
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import (
    Supplier, PurchaseOrder, PurchaseOrderItem, 
    GoodsReceipt, GoodsReceiptItem, SupplierInvoice, SupplierPayment
)


class SupplierSerializer(serializers.ModelSerializer):
    """Serializer for Supplier model."""

    total_purchases = serializers.SerializerMethodField()

    class Meta:
        model = Supplier
        fields = [
            'id', 'name', 'email', 'phone', 'address', 'tax_register',
            'commercial_register', 'contact_person', 'payment_terms',
            'balance', 'is_active', 'total_purchases',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_purchases(self, obj):
        """Get total purchases for supplier."""
        return PurchaseOrder.objects.filter(
            supplier=obj,
            status__in=['confirmed', 'received']
        ).aggregate(total=models.Sum('total_amount'))['total'] or 0


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    """Serializer for PurchaseOrderItem model."""

    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    pending_quantity = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)

    class Meta:
        model = PurchaseOrderItem
        fields = [
            'id', 'product', 'product_name', 'product_sku',
            'description', 'quantity', 'unit_price',
            'discount_percentage', 'tax_rate', 'total',
            'received_quantity', 'pending_quantity'
        ]
        read_only_fields = ['id', 'received_quantity', 'pending_quantity']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    """Serializer for PurchaseOrder model."""

    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    items = PurchaseOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = [
            'id', 'order_number', 'supplier', 'supplier_name',
            'order_date', 'expected_date', 'status',
            'subtotal', 'tax_amount', 'discount_amount',
            'total_amount', 'notes', 'terms',
            'items', 'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']

    def create(self, validated_data):
        """Create purchase order with items."""
        items_data = validated_data.pop('items', [])

        # Create purchase order
        purchase_order = PurchaseOrder.objects.create(**validated_data)

        # Create purchase order items
        for item_data in items_data:
            PurchaseOrderItem.objects.create(purchase_order=purchase_order, **item_data)

        return purchase_order


class GoodsReceiptItemSerializer(serializers.ModelSerializer):
    """SerializerReceiptItem model."""

    product_name = serializers.CharField(source='purchase_order_item.product.name', read_only=True)
    product_sku = serializers.CharField(source='purchase_order_item.product.sku', read_only=True)

    class Meta:
        model = GoodsReceiptItem
        fields = [
            'id', 'goods_receipt', 'purchase_order_item',
            'product_name', 'product_sku', 'quantity', 'notes'
        ]
        read_only_fields = ['id']


class GoodsReceiptSerializer(serializers.ModelSerializer):
    """Serializer for GoodsReceipt model."""

    purchase_order_number = serializers.CharField(source='purchase_order.order_number', read_only=True)
    supplier_name = serializers.CharField(source='purchase_order.supplier.name', read_only=True)
    items = GoodsReceiptItemSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = GoodsReceipt
        fields = [
            'id', 'receipt_number', 'purchase_order', 'purchase_order_number',
            'supplier_name', 'receipt_date', 'notes', 'items',
            'created_at', 'created_by', 'created_by_name'
        ]
        read_only_fields = ['id', 'created_at', 'created_by']


class SupplierInvoiceSerializer(serializers.ModelSerializer):
    """Serializer for SupplierInvoice model."""

    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    purchase_order_number = serializers.CharField(source='purchase_order.order_number', read_only=True)
    balance_due = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)

    class Meta:
        model = SupplierInvoice
        fields = [
            'id', 'invoice_number', 'supplier', 'supplier_name',
            'purchase_order', 'purchase_order_number',
            'invoice_date', 'due_date', 'status',
            'subtotal', 'tax_amount', 'discount_amount',
            'total_amount', 'paid_amount', 'balance_due',
            'notes', 'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = [
            'id', 'balance_due', 'created_at', 'updated_at', 'created_by'
        ]


class SupplierPaymentSerializer(serializers.ModelSerializer):
    """Serializer for SupplierPayment model."""

    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = SupplierPayment
        fields = [
            'id', 'payment_number', 'supplier', 'supplier_name',
            'invoice', 'invoice_number', 'amount', 'payment_method',
            'reference', 'notes', 'payment_date',
            'created_at', 'created_by', 'created_by_name'
        ]
        read_only_fields = ['id', 'created_at', 'created_by']
