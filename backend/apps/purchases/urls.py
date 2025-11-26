
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'purchases'

router = DefaultRouter()
router.register(r'suppliers', views.SupplierViewSet)
router.register(r'purchase-orders', views.PurchaseOrderViewSet)
router.register(r'goods-receipts', views.GoodsReceiptViewSet)
router.register(r'supplier-invoices', views.SupplierInvoiceViewSet)
router.register(r'supplier-payments', views.SupplierPaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('purchase-orders/generate-pdf/<int:pk>/', views.GeneratePurchaseOrderPDFView.as_view(), name='generate-purchase-order-pdf'),
    path('purchase-orders/send-email/<int:pk>/', views.SendPurchaseOrderEmailView.as_view(), name='send-purchase-order-email'),
    path('suppliers/bulk-import/', views.BulkImportSuppliersView.as_view(), name='bulk-import-suppliers'),
]
