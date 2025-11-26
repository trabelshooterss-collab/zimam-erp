
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from apps.companies.models import Company
from apps.inventory.models import Product

class Supplier(models.Model):
    """Supplier model for purchase management."""

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='suppliers',
        verbose_name=_('company')
    )
    name = models.CharField(_('supplier name'), max_length=200)
    email = models.EmailField(_('email'), blank=True, null=True)
    phone = models.CharField(_('phone'), max_length=20, blank=True, null=True)
    address = models.TextField(_('address'), blank=True, null=True)
    tax_register = models.CharField(_('tax register'), max_length=100, blank=True, null=True)
    commercial_register = models.CharField(_('commercial register'), max_length=100, blank=True, null=True)
    contact_person = models.CharField(_('contact person'), max_length=100, blank=True, null=True)
    payment_terms = models.CharField(_('payment terms'), max_length=100, blank=True, null=True)
    balance = models.DecimalField(_('balance'), max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('Supplier')
        verbose_name_plural = _('Suppliers')
        ordering = ['name']
        unique_together = ['name', 'company']

    def __str__(self):
        return self.name

class PurchaseOrder(models.Model):
    """Purchase order model for procurement management."""

    ORDER_STATUS = (
        ('draft', _('Draft')),
        ('sent', _('Sent')),
        ('confirmed', _('Confirmed')),
        ('received', _('Received')),
        ('cancelled', _('Cancelled')),
    )

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='purchase_orders',
        verbose_name=_('company')
    )
    order_number = models.CharField(_('order number'), max_length=50)
    supplier = models.ForeignKey(
        Supplier, 
        on_delete=models.CASCADE, 
        related_name='purchase_orders',
        verbose_name=_('supplier')
    )
    order_date = models.DateField(_('order date'))
    expected_date = models.DateField(_('expected delivery date'))
    status = models.CharField(_('status'), max_length=20, choices=ORDER_STATUS, default='draft')

    # Totals
    subtotal = models.DecimalField(_('subtotal'), max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(_('tax amount'), max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(_('discount amount'), max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(_('total amount'), max_digits=10, decimal_places=2)

    # Additional information
    notes = models.TextField(_('notes'), blank=True, null=True)
    terms = models.TextField(_('terms and conditions'), blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='purchase_orders',
        verbose_name=_('created by'),
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = _('Purchase Order')
        verbose_name_plural = _('Purchase Orders')
        ordering = ['-order_date', '-order_number']
        unique_together = ['order_number', 'company']

    def __str__(self):
        return f"{self.order_number} - {self.supplier.name}"

class PurchaseOrderItem(models.Model):
    """Purchase order item model for line items in purchase orders."""

    purchase_order = models.ForeignKey(
        PurchaseOrder, 
        on_delete=models.CASCADE, 
        related_name='items',
        verbose_name=_('purchase order')
    )
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='purchase_items',
        verbose_name=_('product')
    )
    description = models.CharField(_('description'), max_length=200)
    quantity = models.DecimalField(_('quantity'), max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(_('unit price'), max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(_('discount percentage'), max_digits=5, decimal_places=2, default=0)
    tax_rate = models.DecimalField(_('tax rate'), max_digits=5, decimal_places=2, default=0)
    total = models.DecimalField(_('total'), max_digits=10, decimal_places=2)
    received_quantity = models.DecimalField(_('received quantity'), max_digits=10, decimal_places=2, default=0)

    class Meta:
        verbose_name = _('Purchase Order Item')
        verbose_name_plural = _('Purchase Order Items')

    def __str__(self):
        return f"{self.purchase_order.order_number} - {self.product.name}"

    @property
    def pending_quantity(self):
        """Calculate pending quantity to be received."""
        return self.quantity - self.received_quantity

class GoodsReceipt(models.Model):
    """Goods receipt model for recording received items."""

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='goods_receipts',
        verbose_name=_('company')
    )
    receipt_number = models.CharField(_('receipt number'), max_length=50)
    purchase_order = models.ForeignKey(
        PurchaseOrder, 
        on_delete=models.CASCADE, 
        related_name='goods_receipts',
        verbose_name=_('purchase order')
    )
    receipt_date = models.DateField(_('receipt date'))
    notes = models.TextField(_('notes'), blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='goods_receipts',
        verbose_name=_('created by'),
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = _('Goods Receipt')
        verbose_name_plural = _('Goods Receipts')
        ordering = ['-receipt_date', '-receipt_number']
        unique_together = ['receipt_number', 'company']

    def __str__(self):
        return f"{self.receipt_number} - {self.purchase_order.order_number}"

class GoodsReceiptItem(models.Model):
    """Goods receipt item model for line items in goods receipts."""

    goods_receipt = models.ForeignKey(
        GoodsReceipt, 
        on_delete=models.CASCADE, 
        related_name='items',
        verbose_name=_('goods receipt')
    )
    purchase_order_item = models.ForeignKey(
        PurchaseOrderItem, 
        on_delete=models.CASCADE, 
        related_name='receipt_items',
        verbose_name=_('purchase order item')
    )
    quantity = models.DecimalField(_('quantity'), max_digits=10, decimal_places=2)
    notes = models.TextField(_('notes'), blank=True, null=True)

    class Meta:
        verbose_name = _('Goods Receipt Item')
        verbose_name_plural = _('Goods Receipt Items')
        unique_together = ['goods_receipt', 'purchase_order_item']

    def __str__(self):
        return f"{self.goods_receipt.receipt_number} - {self.purchase_order_item.product.name}"

class SupplierInvoice(models.Model):
    """Supplier invoice model for recording invoices from suppliers."""

    INVOICE_STATUS = (
        ('draft', _('Draft')),
        ('received', _('Received')),
        ('verified', _('Verified')),
        ('paid', _('Paid')),
        ('cancelled', _('Cancelled')),
    )

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='supplier_invoices',
        verbose_name=_('company')
    )
    invoice_number = models.CharField(_('invoice number'), max_length=50)
    supplier = models.ForeignKey(
        Supplier, 
        on_delete=models.CASCADE, 
        related_name='invoices',
        verbose_name=_('supplier')
    )
    purchase_order = models.ForeignKey(
        PurchaseOrder, 
        on_delete=models.CASCADE, 
        related_name='supplier_invoices',
        verbose_name=_('purchase order'),
        blank=True, 
        null=True
    )
    invoice_date = models.DateField(_('invoice date'))
    due_date = models.DateField(_('due date'))
    status = models.CharField(_('status'), max_length=20, choices=INVOICE_STATUS, default='draft')

    # Totals
    subtotal = models.DecimalField(_('subtotal'), max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(_('tax amount'), max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(_('discount amount'), max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(_('total amount'), max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(_('paid amount'), max_digits=10, decimal_places=2, default=0)

    # Additional information
    notes = models.TextField(_('notes'), blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='supplier_invoices',
        verbose_name=_('created by'),
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = _('Supplier Invoice')
        verbose_name_plural = _('Supplier Invoices')
        ordering = ['-invoice_date', '-invoice_number']
        unique_together = ['invoice_number', 'company']

    def __str__(self):
        return f"{self.invoice_number} - {self.supplier.name}"

    @property
    def balance_due(self):
        """Calculate remaining balance due."""
        return self.total_amount - self.paid_amount

class SupplierPayment(models.Model):
    """Supplier payment model for tracking payments to suppliers."""

    PAYMENT_METHODS = (
        ('cash', _('Cash')),
        ('bank_transfer', _('Bank Transfer')),
        ('check', _('Check')),
        ('online', _('Online Payment')),
    )

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='supplier_payments',
        verbose_name=_('company')
    )
    payment_number = models.CharField(_('payment number'), max_length=50)
    supplier = models.ForeignKey(
        Supplier, 
        on_delete=models.CASCADE, 
        related_name='payments',
        verbose_name=_('supplier')
    )
    invoice = models.ForeignKey(
        SupplierInvoice, 
        on_delete=models.CASCADE, 
        related_name='payments',
        verbose_name=_('invoice'),
        blank=True, 
        null=True
    )
    amount = models.DecimalField(_('amount'), max_digits=10, decimal_places=2)
    payment_method = models.CharField(_('payment method'), max_length=20, choices=PAYMENT_METHODS)
    reference = models.CharField(_('reference'), max_length=100, blank=True, null=True)
    payment_date = models.DateField(_('payment date'))
    notes = models.TextField(_('notes'), blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='supplier_payments',
        verbose_name=_('created by'),
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = _('Supplier Payment')
        verbose_name_plural = _('Supplier Payments')
        ordering = ['-payment_date', '-payment_number']
        unique_together = ['payment_number', 'company']

    def __str__(self):
        return f"{self.payment_number} - {self.supplier.name} ({self.amount})"
