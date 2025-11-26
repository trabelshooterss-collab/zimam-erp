
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from apps.companies.models import Company
from apps.inventory.models import Product

class Customer(models.Model):
    """Customer model for sales management."""

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='customers',
        verbose_name=_('company')
    )
    name = models.CharField(_('customer name'), max_length=200)
    email = models.EmailField(_('email'), blank=True, null=True)
    phone = models.CharField(_('phone'), max_length=20, blank=True, null=True)
    address = models.TextField(_('address'), blank=True, null=True)
    tax_register = models.CharField(_('tax register'), max_length=100, blank=True, null=True)
    balance = models.DecimalField(_('balance'), max_digits=10, decimal_places=2, default=0)
    credit_limit = models.DecimalField(_('credit limit'), max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('Customer')
        verbose_name_plural = _('Customers')
        ordering = ['name']
        unique_together = ['name', 'company']

    def __str__(self):
        return self.name

class Invoice(models.Model):
    """Invoice model for sales transactions."""

    INVOICE_TYPES = (
        ('sales', _('Sales Invoice')),
        ('return', _('Sales Return')),
        ('quote', _('Sales Quote')),
    )

    PAYMENT_STATUS = (
        ('paid', _('Paid')),
        ('partial', _('Partially Paid')),
        ('unpaid', _('Unpaid')),
        ('overdue', _('Overdue')),
        ('refunded', _('Refunded')),
    )

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='invoices',
        verbose_name=_('company')
    )
    invoice_type = models.CharField(_('invoice type'), max_length=20, choices=INVOICE_TYPES, default='sales')
    invoice_number = models.CharField(_('invoice number'), max_length=50)
    customer = models.ForeignKey(
        Customer, 
        on_delete=models.CASCADE, 
        related_name='invoices',
        verbose_name=_('customer')
    )
    date = models.DateField(_('invoice date'))
    due_date = models.DateField(_('due date'))

    # Totals
    subtotal = models.DecimalField(_('subtotal'), max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(_('tax amount'), max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(_('discount amount'), max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(_('total amount'), max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(_('paid amount'), max_digits=10, decimal_places=2, default=0)

    # Status
    payment_status = models.CharField(_('payment status'), max_length=20, choices=PAYMENT_STATUS, default='unpaid')
    is_sent = models.BooleanField(_('sent'), default=False)
    notes = models.TextField(_('notes'), blank=True, null=True)

    # Compliance
    qr_code_data = models.TextField(_('QR code data'), blank=True, null=True)
    zatca_uuid = models.CharField(_('ZATCA UUID'), max_length=100, blank=True, null=True)
    zatca_hash = models.CharField(_('ZATCA hash'), max_length=500, blank=True, null=True)
    eta_uuid = models.CharField(_('ETA UUID'), max_length=100, blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='created_invoices',
        verbose_name=_('created by'),
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = _('Invoice')
        verbose_name_plural = _('Invoices')
        ordering = ['-date', '-invoice_number']
        unique_together = ['invoice_number', 'company']

    def __str__(self):
        return f"{self.invoice_number} - {self.customer.name}"

    @property
    def balance_due(self):
        """Calculate remaining balance due."""
        return self.total_amount - self.paid_amount

    @property
    def is_overdue(self):
        """Check if invoice is overdue."""
        from django.utils import timezone
        return (
            self.payment_status in ['unpaid', 'partial'] and 
            self.due_date < timezone.now().date()
        )

class InvoiceItem(models.Model):
    """Invoice item model for line items in invoices."""

    invoice = models.ForeignKey(
        Invoice, 
        on_delete=models.CASCADE, 
        related_name='items',
        verbose_name=_('invoice')
    )
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='invoice_items',
        verbose_name=_('product')
    )
    description = models.CharField(_('description'), max_length=200)
    quantity = models.DecimalField(_('quantity'), max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(_('unit price'), max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(_('discount percentage'), max_digits=5, decimal_places=2, default=0)
    tax_rate = models.DecimalField(_('tax rate'), max_digits=5, decimal_places=2, default=0)
    total = models.DecimalField(_('total'), max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = _('Invoice Item')
        verbose_name_plural = _('Invoice Items')

    def __str__(self):
        return f"{self.invoice.invoice_number} - {self.product.name}"

class Payment(models.Model):
    """Payment model for tracking payments against invoices."""

    PAYMENT_METHODS = (
        ('cash', _('Cash')),
        ('card', _('Card')),
        ('bank_transfer', _('Bank Transfer')),
        ('check', _('Check')),
        ('online', _('Online Payment')),
    )

    invoice = models.ForeignKey(
        Invoice, 
        on_delete=models.CASCADE, 
        related_name='payments',
        verbose_name=_('invoice')
    )
    amount = models.DecimalField(_('amount'), max_digits=10, decimal_places=2)
    payment_method = models.CharField(_('payment method'), max_length=20, choices=PAYMENT_METHODS)
    reference = models.CharField(_('reference'), max_length=100, blank=True, null=True)
    notes = models.TextField(_('notes'), blank=True, null=True)
    date = models.DateField(_('payment date'))
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='payments',
        verbose_name=_('created by'),
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = _('Payment')
        verbose_name_plural = _('Payments')
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"Payment {self.id} - {self.invoice.invoice_number} ({self.amount})"
