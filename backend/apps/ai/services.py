import google.generativeai as genai
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class GeminiService:
    """
    Service for interacting with Google Gemini API.
    """
    
    def __init__(self):
        # Configure API key
        api_key = settings.GEMINI_API_KEY if hasattr(settings, 'GEMINI_API_KEY') else None
        if not api_key:
            # Fallback for development if not in settings yet
            import os
            api_key = os.getenv('GEMINI_API_KEY')
            
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
            print("Warning: GEMINI_API_KEY not found.")

    def generate_text(self, prompt):
        """Generate text from a prompt."""
        if not self.model:
            return "Error: Gemini API key not configured."
            
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating content: {str(e)}"

    def draft_negotiation_email(self, purchase_order):
        """
        Draft a negotiation email for a Purchase Order.
        """
        if not self.model:
            return "Error: Gemini API key not configured."

        supplier_name = purchase_order.supplier.name
        contact_person = purchase_order.supplier.contact_person or "Sales Manager"
        items_list = "\n".join([
            f"- {item.product.name}: {item.quantity} units (Target Price: {item.unit_price})"
            for item in purchase_order.items.all()
        ])
        
        total_value = purchase_order.total_amount

        prompt = f"""
        You are an expert Procurement Manager at 'Zimam ERP'.
        Write a professional, persuasive, and friendly email to our supplier '{supplier_name}'.
        
        Context:
        - Receiver: {contact_person}
        - We are placing a new order (PO #{purchase_order.order_number}).
        - Total Value: {total_value} SAR.
        - Items:
        {items_list}
        
        Goal:
        - Request a 5-10% discount due to our long-standing relationship and volume.
        - Ask for faster delivery if possible.
        - Tone: Professional, polite, but firm on getting a good deal.
        - Language: English (but also provide an Arabic version below it).
        
        Format:
        Subject: [Subject Here]
        
        [English Body]
        
        ---
        
        [Arabic Body]
        """
        
        return self.generate_text(prompt)
