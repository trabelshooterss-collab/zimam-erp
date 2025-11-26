
from django.db import models
from django.utils.translation import gettext_lazy as _

class Company(models.Model):
    """Company model for multi-tenant architecture."""

    COUNTRY_CHOICES = (
        ('SA', _('Saudi Arabia')),
        ('EG', _('Egypt')),
        ('AE', _('United Arab Emirates')),
        ('KW', _('Kuwait')),
        ('BH', _('Bahrain')),
        ('QA', _('Qatar')),
        ('OM', _('Oman')),
        ('JO', _('Jordan')),
        ('LB', _('Lebanon')),
        ('IQ', _('Iraq')),
    )

    name = models.CharField(_('company name'), max_length=200)
    commercial_register = models.CharField(_('commercial register'), max_length=100, blank=True, null=True)
    tax_register = models.CharField(_('tax register'), max_length=100, blank=True, null=True)
    country = models.CharField(_('country'), max_length=2, choices=COUNTRY_CHOICES)
    city = models.CharField(_('city'), max_length=100)
    address = models.TextField(_('address'))
    phone = models.CharField(_('phone'), max_length=20)
    email = models.EmailField(_('email'))
    website = models.URLField(_('website'), blank=True, null=True)
    logo = models.ImageField(_('logo'), upload_to='company_logos/', blank=True, null=True)

    # ZATCA and ETA compliance settings
    zatca_enabled = models.BooleanField(_('ZATCA enabled'), default=False)
    zatca_certificate = models.TextField(_('ZATCA certificate'), blank=True, null=True)
    zatca_private_key = models.TextField(_('ZATCA private key'), blank=True, null=True)

    eta_enabled = models.BooleanField(_('ETA enabled'), default=False)
    eta_certificate = models.TextField(_('ETA certificate'), blank=True, null=True)
    eta_private_key = models.TextField(_('ETA private key'), blank=True, null=True)

    # Subscription details
    subscription_plan = models.CharField(_('subscription plan'), max_length=50, default='basic')
    subscription_expires = models.DateField(_('subscription expires'), blank=True, null=True)
    is_active = models.BooleanField(_('active'), default=True)

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('Company')
        verbose_name_plural = _('Companies')
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def is_subscription_active(self):
        from django.utils import timezone
        if not self.subscription_expires:
            return True
        return self.subscription_expires >= timezone.now().date()
