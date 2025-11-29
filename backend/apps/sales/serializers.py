
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import Customer, Invoice, InvoiceItem, Payment


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for Customer model."""

    total_sales = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'email', 'phone', 'address', 'tax_register',
            'balance', 'credit_limit', 'is_active', 'total_sales',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_sales(self, obj):
        """Get total sales for customer."""
        return Invoice.objects.filter(
            customer=obj,
            invoice_type='sales'
        ).aggregate(total=models.Sum('total_amount'))['total'] or 0


class InvoiceItemSerializer(serializers.ModelSerializer):
    """Serializer for InvoiceItem model."""

    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)

    class Meta:
        model = InvoiceItem
        fields = [
            'id', 'product', 'product_name', 'product_sku',
            'description', 'quantity', 'unit_price',
            'discount_percentage', 'tax_rate', 'total'
        ]
        read_only_fields = ['id', 'total']


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""

    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'invoice', 'amount', 'payment_method',
            'reference', 'notes', 'date', 'created_at',
            'created_by', 'created_by_name'
        ]
        read_only_fields = ['id', 'created_at', 'created_by']


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer for Invoice model."""

    customer_name = serializers.CharField(source='customer.name', read_only=True)
    items = InvoiceItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    balance_due = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_type', 'invoice_number', 'customer', 'customer_name',
            'date', 'due_date', 'subtotal', 'tax_amount', 'discount_amount',
            'total_amount', 'paid_amount', 'balance_due', 'payment_status',
            'is_sent', 'notes', 'qr_code_data', 'zatca_uuid', 'zatca_hash',
            'eta_uuid', 'is_overdue', 'items', 'payments',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = [
            'id', 'balance_due', 'is_overdue', 'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        """Create invoice with items."""
        from apps.inventory.utils import update_stock_on_sale
        
        items_data = validated_data.pop('items', [])

        # Create invoice
        invoice = Invoice.objects.create(**validated_data)

        # Create invoice items
        for item_data in items_data:
            item = InvoiceItem.objects.create(invoice=invoice, **item_data)
            
            # Update stock if it's a sales invoice
            if invoice.invoice_type == 'sales':
                update_stock_on_sale(item.product, item.quantity, invoice)

        return invoice
