
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import Category, Product, StockMovement


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""

    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'products_count', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_products_count(self, obj):
        """Get number of products in category."""
        return obj.products.count()


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model."""

    category_name = serializers.CharField(source='category.name', read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    is_out_of_stock = serializers.BooleanField(read_only=True)
    profit_margin = serializers.DecimalField(read_only=True, max_digits=5, decimal_places=2)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name', 'description',
            'sku', 'barcode', 'cost_price', 'selling_price', 'tax_rate',
            'current_stock', 'reorder_point', 'ai_suggested_reorder_point',
            'last_restocked', 'image', 'is_active', 'is_discontinued',
            'is_low_stock', 'is_out_of_stock', 'profit_margin',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'last_restocked', 'is_low_stock', 'is_out_of_stock',
            'profit_margin', 'created_at', 'updated_at'
        ]


class StockMovementSerializer(serializers.ModelSerializer):
    """Serializer for StockMovement model."""

    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = StockMovement
        fields = [
            'id', 'product', 'product_name', 'product_sku',
            'movement_type', 'quantity', 'reference', 'notes',
            'created_at', 'created_by', 'created_by_name'
        ]
        read_only_fields = ['id', 'created_at', 'created_by']
