import os
import logging
from google.generativeai import genai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

logger = logging.getLogger(__name__)


class GenerateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Handle text generation tasks using Google Gemini.
        
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
            if task == 'analyze_finances':
                data = payload.get('data', {})
                prompt = f"قم بتحليل البيانات المالية التالية وقدم تقرير مختصر مع توصيات: {str(data)}"
            elif task == 'market_pulse':
                prompt = "قدم ملخصًا عن الاتجاهات الحالية في السوق والفرص المحتملة للنمو."
            elif task == 'predict_inventory':
                products = payload.get('products', [])
                prompt = f"بناءً على بيانات المنتجات التالية، توقع احتياجات المخزون للشهر القادم: {str(products[:5])}"
            else:
                prompt = payload.get('prompt', 'Hello')
            
            # Call Gemini API
            response = model.generate_content(prompt)
            result_text = response.text
            
            logger.info(f'Gemini task completed: {task}')
            return Response({
                'result': result_text,
                'task': task,
                'mock': False
            })
        
        except Exception as e:
            logger.error(f'Gemini API error: {str(e)}', exc_info=True)
            return Response({
                'result': f'حدث خطأ في معالجة الطلب: {str(e)}',
                'error': str(e),
                'mock': True
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Handle conversational chat with Gemini.
        
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
