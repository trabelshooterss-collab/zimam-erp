
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def health_check(request):
    """Health check endpoint for load balancers and monitoring."""
    return JsonResponse({"status": "ok"})

urlpatterns = [
    # Health check endpoint
    path('health/', health_check, name='health_check'),

    # Admin interface
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/auth/', include('apps.authentication.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/inventory/', include('apps.inventory.urls')),
    path('api/sales/', include('apps.sales.urls')),
    path('api/accounting/', include('apps.accounting.urls')),
    path('api/purchases/', include('apps.purchases.urls')),
    path('api/companies/', include('apps.companies.urls')),
    # AI proxy endpoints (server-side)
    path('api/ai/', include('apps.ai.urls')),

    # JWT authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
