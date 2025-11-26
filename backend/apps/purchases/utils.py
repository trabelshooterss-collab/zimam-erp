
import io
from django.conf import settings
from django.core.mail import send_mail
from django.utils.translation import gettext_lazy as _
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from .models import PurchaseOrder
from apps.inventory.models import StockMovement


def generate_purchase_order_pdf(purchase_order):
    """Generate PDF for purchase order."""
    # Render HTML
    html_string = render_to_string('purchases/purchase_order_pdf.html', {
        'purchase_order': purchase_order,
        'company': purchase_order.company,
        'supplier': purchase_order.supplier,
        'items': purchase_order.items.all(),
    })

    # Create PDF
    html = HTML(string=html_string)
    pdf_buffer = io.BytesIO()
    html.write_pdf(pdf_buffer)

    return pdf_buffer


def send_purchase_order_email(purchase_order, email):
    """Send purchase order via email."""
    subject = _('Purchase Order {} from {}').format(
        purchase_order.order_number,
        purchase_order.company.name
    )

    # Generate PDF
    pdf_buffer = generate_purchase_order_pdf(purchase_order)

    # Send email
    send_mail(
        subject=subject,
        message=_('Please find attached our purchase order {}').format(purchase_order.order_number),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
        attachments=[(
            f'purchase_order_{purchase_order.order_number}.pdf',
            pdf_buffer.read(),
            'application/pdf'
        )]
    )


def update_stock_on_purchase(product, quantity):
    """Update stock when a purchase is made."""
    product.current_stock += quantity
    product.save()

    # Record stock movement
    StockMovement.objects.create(
        product=product,
        movement_type='in',
        quantity=quantity,
        reference='Purchase',
        created_at=timezone.now()
    )
