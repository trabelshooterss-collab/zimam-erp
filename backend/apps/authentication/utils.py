
import qrcode
import io
import base64
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .models import TwoFactorAuth
import pyotp


def send_password_reset_email(user, token):
    """Send password reset email to user."""
    subject = _('Password Reset for Zimam ERP')
    message = _(
        f"Hello {user.first_name} {user.last_name},

"
        f"You have requested to reset your password for Zimam ERP.

"
        f"Please click the following link to reset your password:
"
        f"{settings.FRONTEND_URL}/reset-password?token={token}

"
        f"This link will expire in 24 hours.

"
        f"If you didn't request this password reset, please ignore this email.

"
        f"Best regards,
"
        f"The Zimam ERP Team"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def generate_2fa_token(user):
    """Generate a 2FA token for user."""
    two_factor_auth, created = TwoFactorAuth.objects.get_or_create(user=user)

    if not two_factor_auth.secret:
        # Generate a new secret key
        two_factor_auth.secret = pyotp.random_base32()
        two_factor_auth.save()

    # Generate a QR code for the secret key
    totp = pyotp.TOTP(two_factor_auth.secret)
    provisioning_uri = totp.provisioning_uri(
        name=user.email,
        issuer_name='Zimam ERP'
    )

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(provisioning_uri)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    # Convert image to base64
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode()

    return {
        'secret': two_factor_auth.secret,
        'qr_code': f"data:image/png;base64,{img_str}"
    }


def verify_2fa_token(user, token):
    """Verify a 2FA token for user."""
    try:
        two_factor_auth = TwoFactorAuth.objects.get(user=user)

        if not two_factor_auth.is_enabled:
            return False

        totp = pyotp.TOTP(two_factor_auth.secret)
        return totp.verify(token, valid_window=1)  # Allow 1 step tolerance
    except TwoFactorAuth.DoesNotExist:
        return False
