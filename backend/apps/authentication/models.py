
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class UserSession(models.Model):
    """User session model for tracking active sessions."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='user_sessions',
        verbose_name=_('user')
    )
    session_key = models.CharField(_('session key'), max_length=40)
    ip_address = models.GenericIPAddressField(_('IP address'), blank=True, null=True)
    user_agent = models.TextField(_('user agent'), blank=True, null=True)
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    last_activity = models.DateTimeField(_('last activity'), auto_now=True)

    class Meta:
        verbose_name = _('User Session')
        verbose_name_plural = _('User Sessions')
        unique_together = ['session_key']
        ordering = ['-last_activity']

    def __str__(self):
        return f"{self.user.email} - {self.session_key[:10]}..."

class PasswordReset(models.Model):
    """Password reset model for handling password reset requests."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='password_resets',
        verbose_name=_('user')
    )
    token = models.CharField(_('token'), max_length=100, unique=True)
    is_used = models.BooleanField(_('used'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    expires_at = models.DateTimeField(_('expires at'))

    class Meta:
        verbose_name = _('Password Reset')
        verbose_name_plural = _('Password Resets')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.token[:10]}..."

    @property
    def is_expired(self):
        """Check if the token is expired."""
        from django.utils import timezone
        return timezone.now() > self.expires_at

class LoginAttempt(models.Model):
    """Login attempt model for tracking login attempts."""

    ATTEMPT_STATUS = (
        ('success', _('Success')),
        ('failed', _('Failed')),
        ('blocked', _('Blocked')),
    )

    email = models.EmailField(_('email'))
    ip_address = models.GenericIPAddressField(_('IP address'))
    user_agent = models.TextField(_('user agent'), blank=True, null=True)
    status = models.CharField(_('status'), max_length=20, choices=ATTEMPT_STATUS)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('Login Attempt')
        verbose_name_plural = _('Login Attempts')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} - {self.status} - {self.created_at}"

class TwoFactorAuth(models.Model):
    """Two-factor authentication model for users."""

    METHODS = (
        ('app', _('Authenticator App')),
        ('sms', _('SMS')),
        ('email', _('Email')),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='two_factor_auth',
        verbose_name=_('user')
    )
    is_enabled = models.BooleanField(_('enabled'), default=False)
    method = models.CharField(_('method'), max_length=20, choices=METHODS, blank=True, null=True)
    secret = models.CharField(_('secret'), max_length=100, blank=True, null=True)
    phone_number = models.CharField(_('phone number'), max_length=20, blank=True, null=True)
    backup_codes = models.TextField(_('backup codes'), blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('Two-Factor Authentication')
        verbose_name_plural = _('Two-Factor Authentication')

    def __str__(self):
        return f"{self.user.email} - {'Enabled' if self.is_enabled else 'Disabled'}"
