
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, Sum
from django.utils import timezone
from django.http import HttpResponse
from .models import Customer, Invoice, InvoiceItem, Payment
from .serializers import (
    CustomerSerializer, InvoiceSerializer, InvoiceItemSerializer, PaymentSerializer
)
from .utils import (
    generate_invoice_pdf, send_invoice_email, generate_zatca_qr_code,
    generate_eta_qr_code, sign_zatca_invoice, sign_eta_invoice
)
from apps.inventory.utils import update_stock_on_sale
import io


class CustomerViewSet(viewsets.ModelViewSet):
    """ViewSet for Customer model."""

    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'balance', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter customers by company."""
        user = self.request.user
        return Customer.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company when creating a customer."""
        serializer.save(company=self.request.user.company)

    @action(detail=True, methods=['post'])
    def update_balance(self, request, pk=None):
        """Update customer balance."""
        customer = self.get_object()
        amount = request.data.get('amount')
        notes = request.data.get('notes', '')

        if not amount:
            return Response(
                {'error': _('Amount is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            amount = float(amount)
            customer.balance += amount
            customer.save()

            return Response({
                'message': _('Balance updated successfully'),
                'new_balance': customer.balance
            })
        except ValueError:
            return Response(
                {'error': _('Invalid amount')},
                status=status.HTTP_400_BAD_REQUEST
            )


class InvoiceViewSet(viewsets.ModelViewSet):
    """ViewSet for Invoice model."""

    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['invoice_type', 'payment_status', 'customer']
    search_fields = ['invoice_number', 'customer__name', 'notes']
    ordering_fields = ['date', 'due_date', 'total_amount', 'created_at']
    ordering = ['-date', '-invoice_number']

    def get_queryset(self):
        """Filter invoices by company."""
        user = self.request.user
        return Invoice.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company and created_by when creating an invoice."""
        serializer.save(
            company=self.request.user.company,
            created_by=self.request.user
        )

    @action(detail=True, methods=['post'])
    def add_payment(self, request, pk=None):
        """Add payment to invoice."""
        invoice = self.get_object()
        amount = request.data.get('amount')
        payment_method = request.data.get('payment_method')
        reference = request.data.get('reference', '')
        notes = request.data.get('notes', '')

        if not amount or not payment_method:
            return Response(
                {'error': _('Amount and payment method are required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            amount = float(amount)

            if amount <= 0:
                return Response(
                    {'error': _('Amount must be greater than 0')},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if amount > invoice.balance_due:
                return Response(
                    {'error': _('Payment amount exceeds balance due')},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create payment
            payment = Payment.objects.create(
                invoice=invoice,
                amount=amount,
                payment_method=payment_method,
                reference=reference,
                notes=notes,
                date=timezone.now().date(),
                created_by=request.user
            )

            # Update invoice paid amount
            invoice.paid_amount += amount
            if invoice.paid_amount >= invoice.total_amount:
                invoice.payment_status = 'paid'
            else:
                invoice.payment_status = 'partial'
            invoice.save()

            return Response({
                'message': _('Payment added successfully'),
                'payment_id': payment.id,
                'new_paid_amount': invoice.paid_amount,
                'new_balance_due': invoice.balance_due,
                'new_payment_status': invoice.payment_status
            })
        except ValueError:
            return Response(
                {'error': _('Invalid amount')},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def generate_pdf(self, request, pk=None):
        """Generate PDF for invoice."""
        invoice = self.get_object()

        # Generate PDF
        pdf_buffer = generate_invoice_pdf(invoice)

        # Return PDF
        response = HttpResponse(
            pdf_buffer.read(),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.invoice_number}.pdf"'
        return response

    @action(detail=True, methods=['post'])
    def send_email(self, request, pk=None):
        """Send invoice via email."""
        invoice = self.get_object()
        email = request.data.get('email')

        if not email:
            return Response(
                {'error': _('Email is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Send email
            send_invoice_email(invoice, email)

            # Update invoice status
            invoice.is_sent = True
            invoice.save()

            return Response({
                'message': _('Invoice sent successfully')
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def zatca_compliance(self, request, pk=None):
        """Generate ZATCA compliance data for invoice."""
        invoice = self.get_object()

        # Check if company has ZATCA enabled
        if not invoice.company.zatca_enabled:
            return Response(
                {'error': _('ZATCA is not enabled for this company')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Generate QR code
            qr_code_data = generate_zatca_qr_code(invoice)

            # Sign invoice
            zatca_hash, zatca_uuid = sign_zatca_invoice(
                invoice, 
                invoice.company.zatca_certificate,
                invoice.company.zatca_private_key
            )

            # Update invoice
            invoice.qr_code_data = qr_code_data
            invoice.zatca_hash = zatca_hash
            invoice.zatca_uuid = zatca_uuid
            invoice.save()

            return Response({
                'message': _('ZATCA compliance data generated successfully'),
                'qr_code_data': qr_code_data,
                'zatca_hash': zatca_hash,
                'zatca_uuid': zatca_uuid
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def eta_compliance(self, request, pk=None):
        """Generate ETA compliance data for invoice."""
        invoice = self.get_object()

        # Check if company has ETA enabled
        if not invoice.company.eta_enabled:
            return Response(
                {'error': _('ETA is not enabled for this company')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Generate QR code
            qr_code_data = generate_eta_qr_code(invoice)

            # Sign invoice
            eta_uuid = sign_eta_invoice(
                invoice, 
                invoice.company.eta_certificate,
                invoice.company.eta_private_key
            )

            # Update invoice
            invoice.qr_code_data = qr_code_data
            invoice.eta_uuid = eta_uuid
            invoice.save()

            return Response({
                'message': _('ETA compliance data generated successfully'),
                'qr_code_data': qr_code_data,
                'eta_uuid': eta_uuid
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for Payment model."""

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['invoice', 'payment_method']
    search_fields = ['reference', 'notes']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date', '-created_at']

    def get_queryset(self):
        """Filter payments by company."""
        user = self.request.user
        return Payment.objects.filter(invoice__company=user.company)


class GenerateInvoicePDFView(APIView):
    """View for generating invoice PDF."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """Generate PDF for invoice."""
        try:
            invoice = Invoice.objects.get(
                id=pk,
                company=request.user.company
            )

            # Generate PDF
            pdf_buffer = generate_invoice_pdf(invoice)

            # Return PDF
            response = HttpResponse(
                pdf_buffer.read(),
                content_type='application/pdf'
            )
            response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.invoice_number}.pdf"'
            return response
        except Invoice.DoesNotExist:
            return Response(
                {'error': _('Invoice not found')},
                status=status.HTTP_404_NOT_FOUND
            )


class SendInvoiceEmailView(APIView):
    """View for sending invoice via email."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """Send invoice via email."""
        try:
            invoice = Invoice.objects.get(
                id=pk,
                company=request.user.company
            )

            email = request.data.get('email')

            if not email:
                return Response(
                    {'error': _('Email is required')},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Send email
            send_invoice_email(invoice, email)

            # Update invoice status
            invoice.is_sent = True
            invoice.save()

            return Response({
                'message': _('Invoice sent successfully')
            })
        except Invoice.DoesNotExist:
            return Response(
                {'error': _('Invoice not found')},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ZATCAComplianceView(APIView):
    """View for generating ZATCA compliance data."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """Generate ZATCA compliance data for invoice."""
        try:
            invoice = Invoice.objects.get(
                id=pk,
                company=request.user.company
            )

            # Check if company has ZATCA enabled
            if not invoice.company.zatca_enabled:
                return Response(
                    {'error': _('ZATCA is not enabled for this company')},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Generate QR code
            qr_code_data = generate_zatca_qr_code(invoice)

            # Sign invoice
            zatca_hash, zatca_uuid = sign_zatca_invoice(
                invoice, 
                invoice.company.zatca_certificate,
                invoice.company.zatca_private_key
            )

            # Update invoice
            invoice.qr_code_data = qr_code_data
            invoice.zatca_hash = zatca_hash
            invoice.zatca_uuid = zatca_uuid
            invoice.save()

            return Response({
                'message': _('ZATCA compliance data generated successfully'),
                'qr_code_data': qr_code_data,
                'zatca_hash': zatca_hash,
                'zatca_uuid': zatca_uuid
            })
        except Invoice.DoesNotExist:
            return Response(
                {'error': _('Invoice not found')},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ETAComplianceView(APIView):
    """View for generating ETA compliance data."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """Generate ETA compliance data for invoice."""
        try:
            invoice = Invoice.objects.get(
                id=pk,
                company=request.user.company
            )

            # Check if company has ETA enabled
            if not invoice.company.eta_enabled:
                return Response(
                    {'error': _('ETA is not enabled for this company')},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Generate QR code
            qr_code_data = generate_eta_qr_code(invoice)

            # Sign invoice
            eta_uuid = sign_eta_invoice(
                invoice, 
                invoice.company.eta_certificate,
                invoice.company.eta_private_key
            )

            # Update invoice
            invoice.qr_code_data = qr_code_data
            invoice.eta_uuid = eta_uuid
            invoice.save()

            return Response({
                'message': _('ETA compliance data generated successfully'),
                'qr_code_data': qr_code_data,
                'eta_uuid': eta_uuid
            })
        except Invoice.DoesNotExist:
            return Response(
                {'error': _('Invoice not found')},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
