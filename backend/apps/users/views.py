
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import User
from .serializers import UserSerializer, UserProfileSerializer
from apps.companies.models import Company


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for the User model."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role', 'is_active', 'company']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['email', 'first_name', 'last_name', 'date_joined']
    ordering = ['-date_joined']

    def get_queryset(self):
        """Filter users by company."""
        user = self.request.user
        if user.is_superuser:
            return User.objects.all()
        return User.objects.filter(company=user.company)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user."""
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'message': _('User activated successfully')})

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a user."""
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'message': _('User deactivated successfully')})


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for the User Profile model."""

    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter users by company."""
        user = self.request.user
        if user.is_superuser:
            return User.objects.all()
        return User.objects.filter(company=user.company)


class CurrentUserView(APIView):
    """View for getting current user information."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get current user information."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        """Update current user information."""
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """View for changing user password."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Change user password."""
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        # Validate input
        if not old_password or not new_password:
            return Response(
                {'error': _('Old password and new password are required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check old password
        if not user.check_password(old_password):
            return Response(
                {'error': _('Invalid old password')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate new password
        try:
            validate_password(new_password, user=user)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Change password
        user.set_password(new_password)
        user.save()

        # Update session to keep user logged in
        update_session_auth_hash(request, user)

        return Response({'message': _('Password changed successfully')})
