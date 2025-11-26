
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'companies'

router = DefaultRouter()
router.register(r'companies', views.CompanyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('subscription/plans/', views.SubscriptionPlansView.as_view(), name='subscription-plans'),
    path('subscription/upgrade/', views.UpgradeSubscriptionView.as_view(), name='upgrade-subscription'),
]
