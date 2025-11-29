
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'inventory'

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'inventory-transactions', views.InventoryTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('products/bulk-import/', views.BulkImportProductsView.as_view(), name='bulk-import-products'),
    path('products/export/', views.ExportProductsView.as_view(), name='export-products'),
    path('stock-adjustment/', views.StockAdjustmentView.as_view(), name='stock-adjustment'),
    path('low-stock-alerts/', views.LowStockAlertsView.as_view(), name='low-stock-alerts'),
]
