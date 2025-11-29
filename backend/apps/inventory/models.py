
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
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
    cost_price = models.DecimalField(_('cost price'), max_digits=10, decimal_places=2) # Standard/Last cost
    average_cost = models.DecimalField(_('average cost'), max_digits=10, decimal_places=2, default=0) # WAC
    selling_price = models.DecimalField(_('selling price'), max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField(_('tax rate'), max_digits=5, decimal_places=2, default=0.0)

    # Stock
    current_stock = models.DecimalField(_('current stock'), max_digits=10, decimal_places=2, default=0)
    reorder_point = models.DecimalField(_('reorder point'), max_digits=10, decimal_places=2, default=10)
    ai_suggested_reorder_point = models.DecimalField(_('AI suggested reorder point'), max_digits=10, decimal_places=2, blank=True, null=True)
    last_restocked = models.DateTimeField(_('last restocked'), blank=True, null=True)
    preferred_supplier = models.ForeignKey(
        'purchases.Supplier',
        on_delete=models.SET_NULL,
        related_name='products',
        verbose_name=_('preferred supplier'),
        blank=True,
        null=True
    )

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
        """Calculate profit margin percentage based on average cost."""
        cost = self.average_cost if self.average_cost > 0 else self.cost_price
        if self.selling_price == 0:
            return 0
        return ((self.selling_price - cost) / self.selling_price) * 100

    @property
    def total_value(self):
        """Calculate total inventory value for this product."""
        return self.current_stock * self.average_cost

class InventoryTransaction(models.Model):
    """
    Ledger for all inventory movements.
    The 'Iron Triangle' core component.
    """

    TRANSACTION_TYPES = (
        ('purchase', _('Purchase Receipt')),
        ('sale', _('Sales Order')),
        ('return_in', _('Sales Return')),
        ('return_out', _('Purchase Return')),
        ('adjustment', _('Stock Adjustment')),
        ('transfer_in', _('Transfer In')),
        ('transfer_out', _('Transfer Out')),
    )

    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='transactions',
        verbose_name=_('product')
    )
    transaction_type = models.CharField(_('transaction type'), max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.DecimalField(_('quantity'), max_digits=10, decimal_places=2) # Positive for add, Negative for deduct
    
    # Costing (Snapshot at time of transaction)
    unit_cost = models.DecimalField(_('unit cost'), max_digits=10, decimal_places=2)
    total_cost = models.DecimalField(_('total cost'), max_digits=12, decimal_places=2)
    
    # Audit Trail
    running_balance = models.DecimalField(_('running balance'), max_digits=10, decimal_places=2) # Stock after transaction
    
    # Deep Linking (Polymorphic relationship)
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    related_document = GenericForeignKey('content_type', 'object_id')

    reference = models.CharField(_('reference'), max_length=100, blank=True, null=True) # e.g. INV-001, PO-002
    notes = models.TextField(_('notes'), blank=True, null=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    created_by = models.ForeignKey(
        'users.User', 
        on_delete=models.SET_NULL, 
        related_name='inventory_transactions',
        verbose_name=_('created by'),
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = _('Inventory Transaction')
        verbose_name_plural = _('Inventory Transactions')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.name} - {self.transaction_type} ({self.quantity})"
