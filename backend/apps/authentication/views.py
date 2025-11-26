
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.translation import gettext_lazy as _
from .models import UserSession, PasswordReset, LoginAttempt, TwoFactorAuth
from apps.users.models import User
from .utils import send_password_reset_email, generate_2fa_token, verify_2fa_token
import random
import string


class LoginView(APIView):
    """View for user login."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        two_factor_code = request.data.get('two_factor_code', None)

        # Record login attempt
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Record failed login attempt
            LoginAttempt.objects.create(
                email=email,
                ip_address=ip_address,
                user_agent=user_agent,
                status='failed'
            )
            return Response(
                {'error': _('Invalid credentials')},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check if 2FA is enabled
        two_factor_auth = getattr(user, 'two_factor_auth', None)
        if two_factor_auth and two_factor_auth.is_enabled:
            if not two_factor_code:
                return Response(
                    {'error': _('Two-factor authentication code required')},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            if not verify_2fa_token(user, two_factor_code):
                LoginAttempt.objects.create(
                    email=email,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    status='failed'
                )
                return Response(
                    {'error': _('Invalid two-factor authentication code')},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        # Authenticate user
        authenticated_user = authenticate(request, username=email, password=password)

        if authenticated_user:
            # Check if user is active
            if not authenticated_user.is_active:
                return Response(
                    {'error': _('Account is disabled')},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Check if company subscription is active
            if not authenticated_user.company.is_subscription_active:
                return Response(
                    {'error': _('Company subscription has expired')},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Log in user
            login(request, authenticated_user)

            # Create user session
            session_key = request.session.session_key
            UserSession.objects.update_or_create(
                user=authenticated_user,
                defaults={
                    'session_key': session_key,
                    'ip_address': ip_address,
                    'user_agent': user_agent,
                    'is_active': True,
                }
            )

            # Record successful login attempt
            LoginAttempt.objects.create(
                email=email,
                ip_address=ip_address,
                user_agent=user_agent,
                status='success'
            )

            # Generate JWT tokens
            refresh = RefreshToken.for_user(authenticated_user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': authenticated_user.id,
                    'email': authenticated_user.email,
                    'first_name': authenticated_user.first_name,
                    'last_name': authenticated_user.last_name,
                    'role': authenticated_user.role,
                    'company': authenticated_user.company.id,
                    'is_company_admin': authenticated_user.is_company_admin,
                }
            })
        else:
            # Record failed login attempt
            LoginAttempt.objects.create(
                email=email,
                ip_address=ip_address,
                user_agent=user_agent,
                status='failed'
            )
            return Response(
                {'error': _('Invalid credentials')},
                status=status.HTTP_401_UNAUTHORIZED
            )

    def get_client_ip(self, request):
        """Get client IP address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class LogoutView(APIView):
    """View for user logout."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Deactivate user session
            session_key = request.session.session_key
            if session_key:
                UserSession.objects.filter(
                    user=request.user,
                    session_key=session_key
                ).update(is_active=False)

            # Blacklist JWT token
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            return Response({'message': _('Successfully logged out')})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class RefreshTokenView(APIView):
    """View for refreshing JWT token."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)

            # Check if user session is active
            user_id = token.payload.get('user_id')
            if user_id:
                try:
                    user = User.objects.get(id=user_id)
                    session_key = request.session.session_key
                    if session_key:
                        UserSession.objects.filter(
                            user=user,
                            session_key=session_key
                        ).update(is_active=True)
                except User.DoesNotExist:
                    pass

            access_token = str(token.access_token)
            return Response({'access': access_token})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class RegisterView(APIView):
    """View for user registration."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        company_name = request.data.get('company_name')

        # Validate input
        if not all([email, password, first_name, last_name, company_name]):
            return Response(
                {'error': _('All fields are required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate password
        try:
            validate_password(password)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': _('User with this email already exists')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Create company
            from apps.companies.models import Company
            company = Company.objects.create(
                name=company_name,
                email=email,
                country='SA',  # Default to Saudi Arabia
                city='Riyadh',  # Default to Riyadh
                address='',
                phone='',
                subscription_plan='basic',
                subscription_expires=timezone.now().date() + timezone.timedelta(days=30)  # 30 days trial
            )

            # Create user
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                company=company,
                is_company_admin=True,
                is_staff=True,
                is_superuser=True
            )

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                    'company': user.company.id,
                    'is_company_admin': user.is_company_admin,
                }
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class PasswordResetView(APIView):
    """View for password reset request."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response(
                {'error': _('Email is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)

            # Generate token
            token = ''.join(random.choices(string.ascii_letters + string.digits, k=64))

            # Create password reset record
            PasswordReset.objects.create(
                user=user,
                token=token,
                expires_at=timezone.now() + timezone.timedelta(hours=24)  # 24 hours
            )

            # Send password reset email
            send_password_reset_email(user, token)

            return Response({
                'message': _('Password reset email sent')
            })
        except User.DoesNotExist:
            # Don't reveal that user doesn't exist
            return Response({
                'message': _('Password reset email sent')
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class PasswordResetConfirmView(APIView):
    """View for password reset confirmation."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        password = request.data.get('password')

        if not all([token, password]):
            return Response(
                {'error': _('Token and password are required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate password
        try:
            validate_password(password)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get password reset record
            password_reset = PasswordReset.objects.get(token=token)

            # Check if token is expired or used
            if password_reset.is_used or password_reset.is_expired:
                return Response(
                    {'error': _('Invalid or expired token')},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Reset password
            user = password_reset.user
            user.set_password(password)
            user.save()

            # Mark token as used
            password_reset.is_used = True
            password_reset.save()

            return Response({
                'message': _('Password reset successfully')
            })
        except PasswordReset.DoesNotExist:
            return Response(
                {'error': _('Invalid token')},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class TwoFactorSetupView(APIView):
    """View for setting up two-factor authentication."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get 2FA setup information."""
        user = request.user

        # Get or create 2FA record
        two_factor_auth, created = TwoFactorAuth.objects.get_or_create(user=user)

        if two_factor_auth.is_enabled:
            return Response({
                'enabled': True,
                'method': two_factor_auth.method
            })

        # Generate secret
        if not two_factor_auth.secret:
            two_factor_auth.secret = generate_2fa_token()
            two_factor_auth.save()

        # Generate QR code for app
        if two_factor_auth.method == 'app':
            import pyotp
            import qrcode
            import io
            import base64

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
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            qr_code = base64.b64encode(buffer.getvalue()).decode()

            return Response({
                'enabled': False,
                'secret': two_factor_auth.secret,
                'qr_code': qr_code
            })

        return Response({
            'enabled': False,
            'secret': two_factor_auth.secret
        })

    def post(self, request):
        """Enable 2FA."""
        user = request.user
        method = request.data.get('method')
        code = request.data.get('code')
        phone_number = request.data.get('phone_number', '')

        if not all([method, code]):
            return Response(
                {'error': _('Method and verification code are required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or create 2FA record
        two_factor_auth, created = TwoFactorAuth.objects.get_or_create(user=user)

        # Verify code
        if not verify_2fa_token(user, code):
            return Response(
                {'error': _('Invalid verification code')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Enable 2FA
        two_factor_auth.method = method
        two_factor_auth.is_enabled = True
        two_factor_auth.phone_number = phone_number if method == 'sms' else ''
        two_factor_auth.save()

        return Response({
            'message': _('Two-factor authentication enabled successfully')
        })


class TwoFactorVerifyView(APIView):
    """View for verifying two-factor authentication code."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Verify 2FA code."""
        user = request.user
        code = request.data.get('code')

        if not code:
            return Response(
                {'error': _('Verification code is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify code
        if verify_2fa_token(user, code):
            return Response({
                'message': _('Verification successful')
            })
        else:
            return Response(
                {'error': _('Invalid verification code')},
                status=status.HTTP_400_BAD_REQUEST
            )


class TwoFactorDisableView(APIView):
    """View for disabling two-factor authentication."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Disable 2FA."""
        user = request.user
        password = request.data.get('password')

        if not password:
            return Response(
                {'error': _('Password is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify password
        if not user.check_password(password):
            return Response(
                {'error': _('Invalid password')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Disable 2FA
        try:
            two_factor_auth = TwoFactorAuth.objects.get(user=user)
            two_factor_auth.is_enabled = False
            two_factor_auth.save()

            return Response({
                'message': _('Two-factor authentication disabled successfully')
            })
        except TwoFactorAuth.DoesNotExist:
            return Response({
                'message': _('Two-factor authentication is not enabled')
            })
