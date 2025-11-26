
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'accounting'

router = DefaultRouter()
router.register(r'chart-of-accounts', views.ChartOfAccountsViewSet)
router.register(r'journal-entries', views.JournalEntryViewSet)
router.register(r'financial-periods', views.FinancialPeriodViewSet)
router.register(r'trial-balances', views.TrialBalanceViewSet)
router.register(r'financial-statements', views.FinancialStatementViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate-trial-balance/', views.GenerateTrialBalanceView.as_view(), name='generate-trial-balance'),
    path('generate-income-statement/', views.GenerateIncomeStatementView.as_view(), name='generate-income-statement'),
    path('generate-balance-sheet/', views.GenerateBalanceSheetView.as_view(), name='generate-balance-sheet'),
    path('generate-cash-flow/', views.GenerateCashFlowView.as_view(), name='generate-cash-flow'),
]
