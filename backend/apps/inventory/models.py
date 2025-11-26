
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.companies.models import Company

class Category(models.Model):
    """Product category model."""

    name = models.CharField(_('category name'), max_length=100)
    description = models.TextField(_('description'), blank=True, null=True)
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='categories',
        verbose_name=_('company')
    )
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        unique_together = ['name', 'company']
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(models.Model):
    """Product model for inventory management."""

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='products',
        verbose_name=_('company')
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        related_name='products',
        verbose_name=_('category'),
        blank=True, 
        null=True
    )
    name = models.CharField(_('product name'), max_length=200)
    description = models.TextField(_('description'), blank=True, null=True)
    sku = models.CharField(_('SKU'), max_length=100, unique=True)
    barcode = models.CharField(_('barcode'), max_length=100, blank=True, null=True)

    # Pricing
    cost_price = models.DecimalField(_('cost price'), max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(_('selling price'), max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField(_('tax rate'), max_digits=5, decimal_places=2, default=0.0)

    # Stock
    current_stock = models.IntegerField(_('current stock'), default=0)
    reorder_point = models.IntegerField(_('reorder point'), default=10)
    ai_suggested_reorder_point = models.IntegerField(_('AI suggested reorder point'), blank=True, null=True)
    last_restocked = models.DateTimeField(_('last restocked'), blank=True, null=True)

    # Media
    image = models.ImageField(_('image'), upload_to='product_images/', blank=True, null=True)

    # Status
    is_active = models.BooleanField(_('active'), default=True)
    is_discontinued = models.BooleanField(_('discontinued'), default=False)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        ordering = ['name']
        unique_together = ['sku', 'company']

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def is_low_stock(self):
        """Check if product is low in stock."""
        return self.current_stock <= self.reorder_point

    @property
    def is_out_of_stock(self):
        """Check if product is out of stock."""
        return self.current_stock == 0

    @property
    def profit_margin(self):
        """Calculate profit margin percentage."""
        if self.selling_price == 0:
            return 0
        return ((self.selling_price - self.cost_price) / self.selling_price) * 100

class StockMovement(models.Model):
    """Stock movement model for tracking inventory changes."""

    MOVEMENT_TYPES = (
        ('in', _('Stock In')),
        ('out', _('Stock Out')),
        ('adjustment', _('Stock Adjustment')),
        ('transfer', _('Stock Transfer')),
        ('return', _('Return')),
    )

    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='stock_movements',
        verbose_name=_('product')
    )
    movement_type = models.CharField(_('movement type'), max_length=20, choices=MOVEMENT_TYPES)
    quantity = models.IntegerField(_('quantity'))
    reference = models.CharField(_('reference'), max_length=100, blank=True, null=True)
    notes = models.TextField(_('notes'), blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    created_by = models.ForeignKey(
        'users.User', 
        on_delete=models.SET_NULL, 
        related_name='stock_movements',
        verbose_name=_('created by'),
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = _('Stock Movement')
        verbose_name_plural = _('Stock Movements')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.name} - {self.movement_type} ({self.quantity})"
