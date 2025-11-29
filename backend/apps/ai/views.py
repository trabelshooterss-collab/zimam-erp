import os
import logging
import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .services import GeminiService
from apps.purchases.models import PurchaseOrder

logger = logging.getLogger(__name__)

class GenerateView(APIView):
    """
    Handle text generation tasks using Google Gemini.
    """
    def post(self, request):
        """
        Request body:
        {
            "task": "analyze_finances" | "market_pulse" | "predict_inventory",
            "data": {...},
            "products": [...],
            "context": {...}
        }
        """
        payload = request.data or {}
        task = payload.get('task', 'default')
        
        # Check if API key is configured
        gemini_key = os.getenv('GEMINI_API_KEY')
        if not gemini_key:
            logger.warning('GEMINI_API_KEY not configured; returning mock response')
            return Response({
                'result': 'تم الوصول للمولد لكن لم يتم تكوين مفتاح Gemini. رجاء تكوين GEMINI_API_KEY في البيئة.',
                'mock': True,
                'error': 'GEMINI_API_KEY not set'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        try:
            # Configure Gemini API
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-pro')
            
            # Build prompt based on task
            prompt = ""
            if task == 'analyze_finances':
                data = payload.get('data', {})
                prompt = f"قم بتحليل البيانات المالية التالية وقدم تقرير مختصر مع توصيات: {str(data)}"
            elif task == 'market_pulse':
                prompt = "قدم ملخصًا عن الاتجاهات الحالية في السوق والفرص المحتملة للنمو."
            elif task == 'predict_inventory':
                products = payload.get('products', [])
                prompt = f"بناءً على قائمة المنتجات التالية، توقع ما قد ينفد قريبًا: {str(products)}"
            else:
                prompt = payload.get('prompt', 'Hello')

            # Call Gemini API
            response = model.generate_content(prompt)
            return Response({
                'result': response.text,
                'mock': False
            })

        except Exception as e:
            logger.error(f'Gemini API error: {str(e)}', exc_info=True)
            return Response({
                'result': f'Error: {str(e)}',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatView(APIView):
    """
    Handle chat interactions.
    """
    def post(self, request):
        """
        Request body:
        {
            "question": "السؤال هنا",
            "context": {...}  (optional)
        }
        """
        payload = request.data or {}
        question = payload.get('question', '')
        context = payload.get('context', {})
        
        if not question:
            return Response(
                {'error': 'يجب توفير سؤال (question field)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if API key is configured
        gemini_key = os.getenv('GEMINI_API_KEY')
        if not gemini_key:
            logger.warning('GEMINI_API_KEY not configured; returning mock chat reply')
            return Response({
                'reply': 'آسف، مفتاح Gemini لم يتم تكوينه. رجاء تواصل مع المسؤول.',
                'mock': True,
                'error': 'GEMINI_API_KEY not set'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        try:
            # Configure Gemini API
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-pro')
            
            # Build prompt with context if provided
            if context:
                prompt = f"السياق: {str(context)}\nالسؤال: {question}"
            else:
                prompt = question
            
            # Call Gemini API
            response = model.generate_content(prompt)
            reply_text = response.text
            
            logger.debug(f'Chat reply generated for question: {question[:50]}...')
            return Response({
                'reply': reply_text,
                'question': question,
                'mock': False
            })
        
        except Exception as e:
            logger.error(f'Gemini chat error: {str(e)}', exc_info=True)
            return Response({
                'reply': f'حدث خطأ أثناء معالجة السؤال: {str(e)}',
                'error': str(e),
                'mock': True
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NegotiateView(APIView):
    """
    Handle AI negotiation for Purchase Orders.
    """
    def post(self, request, pk):
        try:
            po = PurchaseOrder.objects.get(pk=pk)
            service = GeminiService()
            email_draft = service.draft_negotiation_email(po)
            return Response({'email_draft': email_draft})
        except PurchaseOrder.DoesNotExist:
            return Response({'error': 'Purchase Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
