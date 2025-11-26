
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
from .models import (
    Supplier, PurchaseOrder, PurchaseOrderItem, 
    GoodsReceipt, GoodsReceiptItem, SupplierInvoice, SupplierPayment
)
from .serializers import (
    SupplierSerializer, PurchaseOrderSerializer, PurchaseOrderItemSerializer,
    GoodsReceiptSerializer, GoodsReceiptItemSerializer, 
    SupplierInvoiceSerializer, SupplierPaymentSerializer
)
from .utils import (
    generate_purchase_order_pdf, send_purchase_order_email,
    update_stock_on_purchase
)
from apps.inventory.models import StockMovement
import csv
import io


class SupplierViewSet(viewsets.ModelViewSet):
    """ViewSet for Supplier model."""

    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'balance', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter suppliers by company."""
        user = self.request.user
        return Supplier.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company when creating a supplier."""
        serializer.save(company=self.request.user.company)

    @action(detail=True, methods=['post'])
    def update_balance(self, request, pk=None):
        """Update supplier balance."""
        supplier = self.get_object()
        amount = request.data.get('amount')
        notes = request.data.get('notes', '')

        if not amount:
            return Response(
                {'error': _('Amount is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            amount = float(amount)
            supplier.balance += amount
            supplier.save()

            return Response({
                'message': _('Balance updated successfully'),
                'new_balance': supplier.balance
            })
        except ValueError:
            return Response(
                {'error': _('Invalid amount')},
                status=status.HTTP_400_BAD_REQUEST
            )


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    """ViewSet for PurchaseOrder model."""

    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['supplier', 'status']
    search_fields = ['order_number', 'supplier__name', 'notes']
    ordering_fields = ['order_date', 'expected_date', 'created_at']
    ordering = ['-order_date', '-order_number']

    def get_queryset(self):
        """Filter purchase orders by company."""
        user = self.request.user
        return PurchaseOrder.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company and created_by when creating a purchase order."""
        serializer.save(
            company=self.request.user.company,
            created_by=self.request.user
        )

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a purchase order."""
        purchase_order = self.get_object()

        if purchase_order.status != 'draft':
            return Response(
                {'error': _('Only draft purchase orders can be confirmed')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update status
        purchase_order.status = 'confirmed'
        purchase_order.save()

        return Response({
            'message': _('Purchase order confirmed successfully')
        })

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """Send a purchase order to supplier."""
        purchase_order = self.get_object()

        if purchase_order.status != 'confirmed':
            return Response(
                {'error': _('Only confirmed purchase orders can be sent')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update status
        purchase_order.status = 'sent'
        purchase_order.save()

        # Send email
        send_purchase_order_email(purchase_order, purchase_order.supplier.email)

        return Response({
            'message': _('Purchase order sent successfully')
        })

    @action(detail=True, methods=['get'])
    def generate_pdf(self, request, pk=None):
        """Generate PDF for purchase order."""
        purchase_order = self.get_object()

        # Generate PDF
        pdf_buffer = generate_purchase_order_pdf(purchase_order)

        # Return PDF
        response = HttpResponse(
            pdf_buffer.read(),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="purchase_order_{purchase_order.order_number}.pdf"'
        return response


class GoodsReceiptViewSet(viewsets.ModelViewSet):
    """ViewSet for GoodsReceipt model."""

    queryset = GoodsReceipt.objects.all()
    serializer_class = GoodsReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['purchase_order']
    search_fields = ['receipt_number', 'notes']
    ordering_fields = ['receipt_date', 'created_at']
    ordering = ['-receipt_date', '-receipt_number']

    def get_queryset(self):
        """Filter goods receipts by company."""
        user = self.request.user
        return GoodsReceipt.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company and created_by when creating a goods receipt."""
        serializer.save(
            company=self.request.user.company,
            created_by=self.request.user
        )

    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """Process a goods receipt and update stock."""
        goods_receipt = self.get_object()

        # Update stock for each item
        for receipt_item in goods_receipt.items.all():
            purchase_order_item = receipt_item.purchase_order_item
            product = purchase_order_item.product

            # Update stock
            update_stock_on_purchase(product, receipt_item.quantity)

            # Update received quantity
            purchase_order_item.received_quantity += receipt_item.quantity
            purchase_order_item.save()

        # Check if purchase order is fully received
        purchase_order = goods_receipt.purchase_order
        all_received = True

        for item in purchase_order.items.all():
            if item.received_quantity < item.quantity:
                all_received = False
                break

        if all_received:
            purchase_order.status = 'received'
            purchase_order.save()

        return Response({
            'message': _('Goods receipt processed successfully')
        })


class SupplierInvoiceViewSet(viewsets.ModelViewSet):
    """ViewSet for SupplierInvoice model."""

    queryset = SupplierInvoice.objects.all()
    serializer_class = SupplierInvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['supplier', 'status', 'purchase_order']
    search_fields = ['invoice_number', 'supplier__name', 'notes']
    ordering_fields = ['invoice_date', 'due_date', 'created_at']
    ordering = ['-invoice_date', '-invoice_number']

    def get_queryset(self):
        """Filter supplier invoices by company."""
        user = self.request.user
        return SupplierInvoice.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company and created_by when creating a supplier invoice."""
        serializer.save(
            company=self.request.user.company,
            created_by=self.request.user
        )

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a supplier invoice."""
        supplier_invoice = self.get_object()

        if supplier_invoice.status != 'received':
            return Response(
                {'error': _('Only received invoices can be verified')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update status
        supplier_invoice.status = 'verified'
        supplier_invoice.save()

        return Response({
            'message': _('Supplier invoice verified successfully')
        })

    @action(detail=True, methods=['post'])
    def add_payment(self, request, pk=None):
        """Add payment to supplier invoice."""
        supplier_invoice = self.get_object()
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

            if amount > supplier_invoice.balance_due:
                return Response(
                    {'error': _('Payment amount exceeds balance due')},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create payment
            payment = SupplierPayment.objects.create(
                company=supplier_invoice.company,
                supplier=supplier_invoice.supplier,
                invoice=supplier_invoice,
                amount=amount,
                payment_method=payment_method,
                reference=reference,
                notes=notes,
                payment_date=timezone.now().date(),
                created_by=request.user
            )

            # Update invoice paid amount
            supplier_invoice.paid_amount += amount
            if supplier_invoice.paid_amount >= supplier_invoice.total_amount:
                supplier_invoice.status = 'paid'
            else:
                supplier_invoice.status = 'verified'
            supplier_invoice.save()

            # Update supplier balance
            supplier = supplier_invoice.supplier
            supplier.balance -= amount
            supplier.save()

            return Response({
                'message': _('Payment added successfully'),
                'payment_id': payment.id,
                'new_paid_amount': supplier_invoice.paid_amount,
                'new_balance_due': supplier_invoice.balance_due,
                'new_payment_status': supplier_invoice.status,
                'new_supplier_balance': supplier.balance
            })
        except ValueError:
            return Response(
                {'error': _('Invalid amount')},
                status=status.HTTP_400_BAD_REQUEST
            )


class SupplierPaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for SupplierPayment model."""

    queryset = SupplierPayment.objects.all()
    serializer_class = SupplierPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['supplier', 'invoice', 'payment_method']
    search_fields = ['payment_number', 'reference', 'notes']
    ordering_fields = ['payment_date', 'amount', 'created_at']
    ordering = ['-payment_date', '-created_at']

    def get_queryset(self):
        """Filter supplier payments by company."""
        user = self.request.user
        return SupplierPayment.objects.filter(company=user.company)


class GeneratePurchaseOrderPDFView(APIView):
    """View for generating purchase order PDF."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """Generate PDF for purchase order."""
        try:
            purchase_order = PurchaseOrder.objects.get(
                id=pk,
                company=request.user.company
            )

            # Generate PDF
            pdf_buffer = generate_purchase_order_pdf(purchase_order)

            # Return PDF
            response = HttpResponse(
                pdf_buffer.read(),
                content_type='application/pdf'
            )
            response['Content-Disposition'] = f'attachment; filename="purchase_order_{purchase_order.order_number}.pdf"'
            return response
        except PurchaseOrder.DoesNotExist:
            return Response(
                {'error': _('Purchase order not found')},
                status=status.HTTP_404_NOT_FOUND
            )


class SendPurchaseOrderEmailView(APIView):
    """View for sending purchase order via email."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """Send purchase order via email."""
        try:
            purchase_order = PurchaseOrder.objects.get(
                id=pk,
                company=request.user.company
            )

            email = request.data.get('email', purchase_order.supplier.email)

            # Send email
            send_purchase_order_email(purchase_order, email)

            # Update status
            purchase_order.status = 'sent'
            purchase_order.save()

            return Response({
                'message': _('Purchase order sent successfully')
            })
        except PurchaseOrder.DoesNotExist:
            return Response(
                {'error': _('Purchase order not found')},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class BulkImportSuppliersView(APIView):
    """View for bulk importing suppliers."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Bulk import suppliers from CSV."""
        csv_file = request.FILES.get('csv_file')

        if not csv_file:
            return Response(
                {'error': _('CSV file is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not csv_file.name.endswith('.csv'):
            return Response(
                {'error': _('File must be a CSV file')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Read CSV file
            data_set = csv_file.read().decode('UTF-8')
            io_string = io.StringIO(data_set)
            next(io_string)  # Skip header

            # Create suppliers
            suppliers_created = 0
            for column in csv.reader(io_string, delimiter=','):
                if len(column) >= 4:
                    Supplier.objects.create(
                        company=request.user.company,
                        name=column[0],
                        email=column[1],
                        phone=column[2],
                        address=column[3] if len(column) > 3 else ''
                    )
                    suppliers_created += 1

            return Response({
                'message': _('Suppliers imported successfully'),
                'count': suppliers_created
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
