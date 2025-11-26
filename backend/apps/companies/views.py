
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Company
from .serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for Company model."""

    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['country', 'is_active']
    search_fields = ['name', 'email', 'city']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter companies based on user role."""
        user = self.request.user

        if user.is_superuser:
            return Company.objects.all()

        # Regular users can only see their own company
        return Company.objects.filter(id=user.company.id)

    @action(detail=True, methods=['post'])
    def activate_zatca(self, request, pk=None):
        """Activate ZATCA compliance for company."""
        company = self.get_object()
        certificate = request.data.get('certificate')
        private_key = request.data.get('private_key')

        if not certificate or not private_key:
            return Response(
                {'error': _('Certificate and private key are required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        company.zatca_enabled = True
        company.zatca_certificate = certificate
        company.zatca_private_key = private_key
        company.save()

        return Response({'message': _('ZATCA compliance activated successfully')})

    @action(detail=True, methods=['post'])
    def activate_eta(self, request, pk=None):
        """Activate ETA compliance for company."""
        company = self.get_object()
        certificate = request.data.get('certificate')
        private_key = request.data.get('private_key')

        if not certificate or not private_key:
            return Response(
                {'error': _('Certificate and private key are required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        company.eta_enabled = True
        company.eta_certificate = certificate
        company.eta_private_key = private_key
        company.save()

        return Response({'message': _('ETA compliance activated successfully')})


class SubscriptionPlansView(APIView):
    """View for getting available subscription plans."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Get available subscription plans."""
        plans = [
            {
                'id': 'basic',
                'name': _('Basic'),
                'price': 99,
                'duration': 'monthly',
                'features': [
                    _('Up to 5 users'),
                    _('Basic inventory management'),
                    _('Basic sales and accounting'),
                    _('Email support'),
                ]
            },
            {
                'id': 'professional',
                'name': _('Professional'),
                'price': 199,
                'duration': 'monthly',
                'features': [
                    _('Up to 20 users'),
                    _('Advanced inventory management'),
                    _('Advanced sales and accounting'),
                    _('ZATCA/ETA compliance'),
                    _('Priority support'),
                    _('API access'),
                ]
            },
            {
                'id': 'enterprise',
                'name': _('Enterprise'),
                'price': 499,
                'duration': 'monthly',
                'features': [
                    _('Unlimited users'),
                    _('Full-featured inventory management'),
                    _('Full-featured sales and accounting'),
                    _('ZATCA/ETA compliance'),
                    _('Dedicated support'),
                    _('Full API access'),
                    _('Custom integrations'),
                    _('On-premise deployment option'),
                ]
            }
        ]

        return Response(plans)


class UpgradeSubscriptionView(APIView):
    """View for upgrading company subscription."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Upgrade company subscription."""
        user = request.user
        company = user.company

        if not user.is_company_admin:
            return Response(
                {'error': _('Only company administrators can upgrade subscription')},
                status=status.HTTP_403_FORBIDDEN
            )

        plan_id = request.data.get('plan_id')
        payment_method = request.data.get('payment_method')

        if not plan_id or not payment_method:
            return Response(
                {'error': _('Plan ID and payment method are required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Process payment (this would integrate with a payment gateway in a real app)
        # For now, we'll just simulate a successful payment

        # Update subscription
        company.subscription_plan = plan_id
        company.subscription_expires = timezone.now().date() + timezone.timedelta(days=30)
        company.save()

        return Response({
            'message': _('Subscription upgraded successfully'),
            'plan': plan_id,
            'expires_at': company.subscription_expires
        })
