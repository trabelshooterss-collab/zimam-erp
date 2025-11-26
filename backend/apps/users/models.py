
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from apps.companies.models import Company

class User(AbstractUser):
    """Custom user model with additional fields."""

    ROLE_CHOICES = (
        ('admin', _('Administrator')),
        ('manager', _('Manager')),
        ('cashier', _('Cashier')),
        ('accountant', _('Accountant')),
        ('inventory_manager', _('Inventory Manager')),
        ('sales_rep', _('Sales Representative')),
    )

    email = models.EmailField(_('email address'), unique=True)
    phone = models.CharField(_('phone number'), max_length=20, blank=True, null=True)
    role = models.CharField(_('role'), max_length=20, choices=ROLE_CHOICES, default='cashier')
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='users',
        verbose_name=_('company')
    )
    is_company_admin = models.BooleanField(_('company administrator'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
