
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    """Serializer for Company model."""

    is_subscription_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'commercial_register', 'tax_register',
            'country', 'city', 'address', 'phone', 'email', 'website', 'logo',
            'zatca_enabled', 'zatca_certificate', 'zatca_private_key',
            'eta_enabled', 'eta_certificate', 'eta_private_key',
            'subscription_plan', 'subscription_expires', 'is_active',
            'is_subscription_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_representation(self, instance):
        """Customize representation to hide sensitive data."""
        data = super().to_representation(instance)

        # Hide sensitive data from non-admin users
        request = self.context.get('request')
        if request and not request.user.is_company_admin:
            data.pop('zatca_certificate', None)
            data.pop('zatca_private_key', None)
            data.pop('eta_certificate', None)
            data.pop('eta_private_key', None)

        return data
