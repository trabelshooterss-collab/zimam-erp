
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .models import User
from apps.companies.models import Company


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    password = serializers.CharField(write_only=True, required=False)
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'password', 'role', 'company', 'company_name', 'phone',
            'is_active', 'is_company_admin', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined']

    def create(self, validated_data):
        """Create a new user with encrypted password."""
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user

    def update(self, instance, validated_data):
        """Update user with password encryption if provided."""
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

    def validate_password(self, value):
        """Validate password using Django's password validation."""
        try:
            validate_password(value)
        except ValidationError as exc:
            raise serializers.ValidationError(exc.messages)
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for User Profile model."""

    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'role', 'company', 'company_name', 'phone',
            'is_active', 'is_company_admin', 'date_joined'
        ]
        read_only_fields = ['id', 'email', 'date_joined']
