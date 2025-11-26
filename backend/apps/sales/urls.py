
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'sales'

router = DefaultRouter()
router.register(r'customers', views.CustomerViewSet)
router.register(r'invoices', views.InvoiceViewSet)
router.register(r'payments', views.PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('invoices/generate-pdf/<int:pk>/', views.GenerateInvoicePDFView.as_view(), name='generate-invoice-pdf'),
    path('invoices/send-email/<int:pk>/', views.SendInvoiceEmailView.as_view(), name='send-invoice-email'),
    path('invoices/zatca-compliance/<int:pk>/', views.ZATCAComplianceView.as_view(), name='zatca-compliance'),
    path('invoices/eta-compliance/<int:pk>/', views.ETAComplianceView.as_view(), name='eta-compliance'),
]
