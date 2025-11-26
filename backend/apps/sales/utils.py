
import io
import base64
import qrcode
from datetime import datetime
from django.conf import settings
from django.core.mail import send_mail
from django.utils.translation import gettext_lazy as _
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
import json
import hashlib
import uuid
import cryptography
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import utils
from cryptography.hazmat.backends import default_backend
from .models import Invoice


def generate_invoice_pdf(invoice):
    """Generate PDF for invoice."""
    # Render HTML
    html_string = render_to_string('sales/invoice_pdf.html', {
        'invoice': invoice,
        'company': invoice.company,
        'customer': invoice.customer,
        'items': invoice.items.all(),
        'payments': invoice.payments.all(),
    })

    # Create PDF
    html = HTML(string=html_string)
    pdf_buffer = io.BytesIO()
    html.write_pdf(pdf_buffer)

    return pdf_buffer


def send_invoice_email(invoice, email):
    """Send invoice via email."""
    subject = _('Invoice {} from {}').format(
        invoice.invoice_number,
        invoice.company.name
    )

    # Generate PDF
    pdf_buffer = generate_invoice_pdf(invoice)

    # Send email
    send_mail(
        subject=subject,
        message=_('Please find attached your invoice {}').format(invoice.invoice_number),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
        attachments=[(
            f'invoice_{invoice.invoice_number}.pdf',
            pdf_buffer.read(),
            'application/pdf'
        )]
    )


def generate_zatca_qr_code(invoice):
    """Generate ZATCA QR code for invoice."""
    # Create QR code data
    qr_data = {
        'seller_name': invoice.company.name,
        'tax_register': invoice.company.tax_register,
        'invoice_number': invoice.invoice_number,
        'date': invoice.date.isoformat(),
        'total_amount': str(invoice.total_amount),
        'tax_amount': str(invoice.tax_amount)
    }

    # Convert to TLV format
    tlv_data = ''
    for key, value in qr_data.items():
        tlv_data += f'{len(key):02d}{key}{len(value):04d}{value}'

    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(tlv_data)
    qr.make(fit=True)

    # Convert to Base64
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode()

    return img_str


def generate_eta_qr_code(invoice):
    """Generate ETA QR code for invoice."""
    # Create QR code data
    qr_data = {
        'seller_name': invoice.company.name,
        'tax_register': invoice.company.tax_register,
        'invoice_number': invoice.invoice_number,
        'date': invoice.date.isoformat(),
        'total_amount': str(invoice.total_amount),
        'tax_amount': str(invoice.tax_amount)
    }

    # Convert to JSON
    json_data = json.dumps(qr_data)

    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(json_data)
    qr.make(fit=True)

    # Convert to Base64
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode()

    return img_str


def sign_zatca_invoice(invoice, certificate, private_key):
    """Sign ZATCA invoice."""
    # Create hash
    invoice_data = f"{invoice.invoice_number}|{invoice.date}|{invoice.total_amount}|{invoice.tax_amount}"
    hash_value = hashlib.sha256(invoice_data.encode()).digest()

    # Load private key
    private_key = serialization.load_pem_private_key(
        private_key.encode(),
        password=None,
        backend=default_backend()
    )

    # Sign hash
    signature = private_key.sign(
        hash_value,
        padding.PKCS1v15(),
        hashes.SHA256()
    )

    # Create UUID
    zatca_uuid = str(uuid.uuid4())

    # Encode signature
    signature_b64 = base64.b64encode(signature).decode()

    return signature_b64, zatca_uuid


def sign_eta_invoice(invoice, certificate, private_key):
    """Sign ETA invoice."""
    # Create hash
    invoice_data = f"{invoice.invoice_number}|{invoice.date}|{invoice.total_amount}|{invoice.tax_amount}"
    hash_value = hashlib.sha256(invoice_data.encode()).digest()

    # Load private key
    private_key = serialization.load_pem_private_key(
        private_key.encode(),
        password=None,
        backend=default_backend()
    )

    # Sign hash
    signature = private_key.sign(
        hash_value,
        padding.PKCS1v15(),
        hashes.SHA256()
    )

    # Create UUID
    eta_uuid = str(uuid.uuid4())

    return eta_uuid
