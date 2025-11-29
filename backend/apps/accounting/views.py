
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, Sum
from django.utils import timezone
from django.http import HttpResponse
from .models import (
    ChartOfAccounts, JournalEntry, JournalEntryItem, 
    FinancialPeriod, TrialBalance, FinancialStatement
)
from .serializers import (
    ChartOfAccountsSerializer, JournalEntrySerializer, 
    JournalEntryItemSerializer, FinancialPeriodSerializer,
    TrialBalanceSerializer, FinancialStatementSerializer
)
from .utils import (
    generate_trial_balance, generate_income_statement, 
    generate_balance_sheet, generate_cash_flow
)
import io


class ChartOfAccountsViewSet(viewsets.ModelViewSet):
    """ViewSet for ChartOfAccounts model."""

    queryset = ChartOfAccounts.objects.all()
    serializer_class = ChartOfAccountsSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['account_type', 'parent', 'is_active']
    search_fields = ['code', 'name', 'description']
    ordering_fields = ['code', 'name']
    ordering = ['code']

    def get_queryset(self):
        """Filter accounts by company."""
        user = self.request.user
        return ChartOfAccounts.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company when creating an account."""
        serializer.save(company=self.request.user.company)


class JournalEntryViewSet(viewsets.ModelViewSet):
    """ViewSet for JournalEntry model."""

    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_posted']
    search_fields = ['entry_number', 'description', 'reference']
    ordering_fields = ['date', 'entry_number', 'created_at']
    ordering = ['-date', '-entry_number']

    def get_queryset(self):
        """Filter journal entries by company."""
        user = self.request.user
        return JournalEntry.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company and created_by when creating a journal entry."""
        serializer.save(
            company=self.request.user.company,
            created_by=self.request.user
        )

    @action(detail=True, methods=['post'])
    def post(self, request, pk=None):
        """Post a journal entry."""
        journal_entry = self.get_object()

        # Check if entry is balanced
        if not journal_entry.is_balanced:
            return Response(
                {'error': _('Journal entry is not balanced')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update stock for inventory accounts
        for item in journal_entry.items.all():
            if item.account.account_type == 'asset' and 'inventory' in item.account.name.lower():
                # This is an inventory account, update stock
                from apps.inventory.models import Product
                from apps.inventory.services import InventoryService

                # Find product by name in description
                try:
                    product = Product.objects.get(
                        name=item.description,
                        company=request.user.company
                    )

                    # Determine movement type based on debit/credit
                    if item.debit > 0:
                        movement_type = 'in'
                        quantity = item.debit / product.cost_price
                    else:
                        movement_type = 'out'
                        quantity = item.credit / product.cost_price

                    # Update stock
                    if movement_type == 'in':
                        product.current_stock += quantity
                    else:
                        product.current_stock -= quantity
                    product.save()

                    # Record stock movement
                    # Record stock movement via InventoryService
                    InventoryService.process_transaction(
                        product=product,
                        transaction_type='adjustment',
                        quantity=quantity if movement_type == 'in' else -quantity,
                        notes=f"{journal_entry.description} (Ref: {journal_entry.entry_number})",
                        user=request.user
                    )
                except Product.DoesNotExist:
                    pass

        # Mark as posted
        journal_entry.is_posted = True
        journal_entry.save()

        return Response({
            'message': _('Journal entry posted successfully')
        })


class FinancialPeriodViewSet(viewsets.ModelViewSet):
    """ViewSet for FinancialPeriod model."""

    queryset = FinancialPeriod.objects.all()
    serializer_class = FinancialPeriodSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_closed']
    search_fields = ['name']
    ordering_fields = ['start_date', 'end_date', 'name']
    ordering = ['-start_date']

    def get_queryset(self):
        """Filter financial periods by company."""
        user = self.request.user
        return FinancialPeriod.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company when creating a financial period."""
        serializer.save(company=self.request.user.company)

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Close a financial period."""
        financial_period = self.get_object()

        # Check if period is already closed
        if financial_period.is_closed:
            return Response(
                {'error': _('Financial period is already closed')},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Close period
        financial_period.is_closed = True
        financial_period.save()

        return Response({
            'message': _('Financial period closed successfully')
        })


class TrialBalanceViewSet(viewsets.ModelViewSet):
    """ViewSet for TrialBalance model."""

    queryset = TrialBalance.objects.all()
    serializer_class = TrialBalanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['financial_period']
    search_fields = ['account__name', 'account__code']
    ordering_fields = ['account__code', 'account__name']
    ordering = ['account__code']

    def get_queryset(self):
        """Filter trial balances by company."""
        user = self.request.user
        return TrialBalance.objects.filter(financial_period__company=user.company)


class FinancialStatementViewSet(viewsets.ModelViewSet):
    """ViewSet for FinancialStatement model."""

    queryset = FinancialStatement.objects.all()
    serializer_class = FinancialStatementSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['financial_period', 'statement_type']
    search_fields = ['title']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter financial statements by company."""
        user = self.request.user
        return FinancialStatement.objects.filter(financial_period__company=user.company)


class GenerateTrialBalanceView(APIView):
    """View for generating trial balance."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Generate trial balance for financial period."""
        financial_period_id = request.data.get('financial_period_id')

        if not financial_period_id:
            return Response(
                {'error': _('Financial period ID is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            financial_period = FinancialPeriod.objects.get(
                id=financial_period_id,
                company=request.user.company
            )

            # Generate trial balance
            trial_balances = generate_trial_balance(financial_period)

            return Response({
                'message': _('Trial balance generated successfully'),
                'trial_balances': trial_balances
            })
        except FinancialPeriod.DoesNotExist:
            return Response(
                {'error': _('Financial period not found')},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class GenerateIncomeStatementView(APIView):
    """View for generating income statement."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Generate income statement for financial period."""
        financial_period_id = request.data.get('financial_period_id')

        if not financial_period_id:
            return Response(
                {'error': _('Financial period ID is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            financial_period = FinancialPeriod.objects.get(
                id=financial_period_id,
                company=request.user.company
            )

            # Generate income statement
            income_statement = generate_income_statement(financial_period)

            # Create financial statement record
            financial_statement = FinancialStatement.objects.create(
                financial_period=financial_period,
                statement_type='income_statement',
                title=_('Income Statement for {}').format(financial_period.name),
                content=income_statement,
                created_by=request.user
            )

            return Response({
                'message': _('Income statement generated successfully'),
                'financial_statement_id': financial_statement.id,
                'income_statement': income_statement
            })
        except FinancialPeriod.DoesNotExist:
            return Response(
                {'error': _('Financial period not found')},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class GenerateBalanceSheetView(APIView):
    """View for generating balance sheet."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Generate balance sheet for financial period."""
        financial_period_id = request.data.get('financial_period_id')

        if not financial_period_id:
            return Response(
                {'error': _('Financial period ID is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            financial_period = FinancialPeriod.objects.get(
                id=financial_period_id,
                company=request.user.company
            )

            # Generate balance sheet
            balance_sheet = generate_balance_sheet(financial_period)

            # Create financial statement record
            financial_statement = FinancialStatement.objects.create(
                financial_period=financial_period,
                statement_type='balance_sheet',
                title=_('Balance Sheet for {}').format(financial_period.name),
                content=balance_sheet,
                created_by=request.user
            )

            return Response({
                'message': _('Balance sheet generated successfully'),
                'financial_statement_id': financial_statement.id,
                'balance_sheet': balance_sheet
            })
        except FinancialPeriod.DoesNotExist:
            return Response(
                {'error': _('Financial period not found')},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class GenerateCashFlowView(APIView):
    """View for generating cash flow statement."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Generate cash flow statement for financial period."""
        financial_period_id = request.data.get('financial_period_id')

        if not financial_period_id:
            return Response(
                {'error': _('Financial period ID is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            financial_period = FinancialPeriod.objects.get(
                id=financial_period_id,
                company=request.user.company
            )

            # Generate cash flow statement
            cash_flow = generate_cash_flow(financial_period)

            # Create financial statement record
            financial_statement = FinancialStatement.objects.create(
                financial_period=financial_period,
                statement_type='cash_flow',
                title=_('Cash Flow Statement for {}').format(financial_period.name),
                content=cash_flow,
                created_by=request.user
            )

            return Response({
                'message': _('Cash flow statement generated successfully'),
                'financial_statement_id': financial_statement.id,
                'cash_flow': cash_flow
            })
        except FinancialPeriod.DoesNotExist:
            return Response(
                {'error': _('Financial period not found')},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
