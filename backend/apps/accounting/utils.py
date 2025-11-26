
from django.db.models import Sum, Q
from .models import (
    ChartOfAccounts, JournalEntry, JournalEntryItem, 
    FinancialPeriod, TrialBalance
)
from apps.sales.models import Invoice
from apps.purchases.models import SupplierInvoice


def generate_trial_balance(financial_period):
    """Generate trial balance for financial period."""
    # Get all accounts
    accounts = ChartOfAccounts.objects.filter(company=financial_period.company)

    trial_balances = []

    for account in accounts:
        # Get opening balance
        opening_balance = 0

        # Get journal entry items for this account
        journal_items = JournalEntryItem.objects.filter(
            account=account,
            journal_entry__date__gte=financial_period.start_date,
            journal_entry__date__lte=financial_period.end_date,
            journal_entry__is_posted=True
        )

        # Calculate totals
        debit_total = journal_items.aggregate(Sum('debit'))['debit__sum'] or 0
        credit_total = journal_items.aggregate(Sum('credit'))['credit__sum'] or 0

        # Calculate closing balance
        if account.account_type in ['asset', 'expense']:
            closing_balance = opening_balance + debit_total - credit_total
        else:
            closing_balance = opening_balance + credit_total - debit_total

        # Create or update trial balance
        trial_balance, created = TrialBalance.objects.update_or_create(
            financial_period=financial_period,
            account=account,
            defaults={
                'opening_balance': opening_balance,
                'debit_total': debit_total,
                'credit_total': credit_total,
                'closing_balance': closing_balance
            }
        )

        if not created:
            trial_balance.opening_balance = opening_balance
            trial_balance.debit_total = debit_total
            trial_balance.credit_total = credit_total
            trial_balance.closing_balance = closing_balance
            trial_balance.save()

        trial_balances.append({
            'account_id': account.id,
            'account_code': account.code,
            'account_name': account.name,
            'account_type': account.account_type,
            'opening_balance': opening_balance,
            'debit_total': debit_total,
            'credit_total': credit_total,
            'closing_balance': closing_balance
        })

    return trial_balances


def generate_income_statement(financial_period):
    """Generate income statement for financial period."""
    # Get revenue accounts
    revenue_accounts = ChartOfAccounts.objects.filter(
        company=financial_period.company,
        account_type='revenue'
    )

    # Get expense accounts
    expense_accounts = ChartOfAccounts.objects.filter(
        company=financial_period.company,
        account_type='expense'
    )

    # Calculate totals
    total_revenue = 0
    revenue_details = []

    for account in revenue_accounts:
        # Get journal entry items for this account
        journal_items = JournalEntryItem.objects.filter(
            account=account,
            journal_entry__date__gte=financial_period.start_date,
            journal_entry__date__lte=financial_period.end_date,
            journal_entry__is_posted=True
        )

        # Calculate totals
        credit_total = journal_items.aggregate(Sum('credit'))['credit__sum'] or 0
        debit_total = journal_items.aggregate(Sum('debit'))['debit__sum'] or 0

        # Revenue accounts have credit balance
        account_total = credit_total - debit_total
        total_revenue += account_total

        revenue_details.append({
            'account_code': account.code,
            'account_name': account.name,
            'total': account_total
        })

    total_expenses = 0
    expense_details = []

    for account in expense_accounts:
        # Get journal entry items for this account
        journal_items = JournalEntryItem.objects.filter(
            account=account,
            journal_entry__date__gte=financial_period.start_date,
            journal_entry__date__lte=financial_period.end_date,
            journal_entry__is_posted=True
        )

        # Calculate totals
        debit_total = journal_items.aggregate(Sum('debit'))['debit__sum'] or 0
        credit_total = journal_items.aggregate(Sum('credit'))['credit__sum'] or 0

        # Expense accounts have debit balance
        account_total = debit_total - credit_total
        total_expenses += account_total

        expense_details.append({
            'account_code': account.code,
            'account_name': account.name,
            'total': account_total
        })

    # Calculate net income
    net_income = total_revenue - total_expenses

    return {
        'financial_period': {
            'name': financial_period.name,
            'start_date': financial_period.start_date,
            'end_date': financial_period.end_date
        },
        'revenue': {
            'details': revenue_details,
            'total': total_revenue
        },
        'expenses': {
            'details': expense_details,
            'total': total_expenses
        },
        'net_income': net_income
    }


def generate_balance_sheet(financial_period):
    """Generate balance sheet for financial period."""
    # Get asset accounts
    asset_accounts = ChartOfAccounts.objects.filter(
        company=financial_period.company,
        account_type='asset'
    )

    # Get liability accounts
    liability_accounts = ChartOfAccounts.objects.filter(
        company=financial_period.company,
        account_type='liability'
    )

    # Get equity accounts
    equity_accounts = ChartOfAccounts.objects.filter(
        company=financial_period.company,
        account_type='equity'
    )

    # Calculate totals for assets
    total_assets = 0
    asset_details = []

    for account in asset_accounts:
        # Get journal entry items for this account
        journal_items = JournalEntryItem.objects.filter(
            account=account,
            journal_entry__date__lte=financial_period.end_date,
            journal_entry__is_posted=True
        )

        # Calculate totals
        debit_total = journal_items.aggregate(Sum('debit'))['debit__sum'] or 0
        credit_total = journal_items.aggregate(Sum('credit'))['credit__sum'] or 0

        # Asset accounts have debit balance
        account_total = debit_total - credit_total
        total_assets += account_total

        asset_details.append({
            'account_code': account.code,
            'account_name': account.name,
            'total': account_total
        })

    # Calculate totals for liabilities
    total_liabilities = 0
    liability_details = []

    for account in liability_accounts:
        # Get journal entry items for this account
        journal_items = JournalEntryItem.objects.filter(
            account=account,
            journal_entry__date__lte=financial_period.end_date,
            journal_entry__is_posted=True
        )

        # Calculate totals
        debit_total = journal_items.aggregate(Sum('debit'))['debit__sum'] or 0
        credit_total = journal_items.aggregate(Sum('credit'))['credit__sum'] or 0

        # Liability accounts have credit balance
        account_total = credit_total - debit_total
        total_liabilities += account_total

        liability_details.append({
            'account_code': account.code,
            'account_name': account.name,
            'total': account_total
        })

    # Calculate totals for equity
    total_equity = 0
    equity_details = []

    for account in equity_accounts:
        # Get journal entry items for this account
        journal_items = JournalEntryItem.objects.filter(
            account=account,
            journal_entry__date__lte=financial_period.end_date,
            journal_entry__is_posted=True
        )

        # Calculate totals
        debit_total = journal_items.aggregate(Sum('debit'))['debit__sum'] or 0
        credit_total = journal_items.aggregate(Sum('credit'))['credit__sum'] or 0

        # Equity accounts have credit balance
        account_total = credit_total - debit_total
        total_equity += account_total

        equity_details.append({
            'account_code': account.code,
            'account_name': account.name,
            'total': account_total
        })

    return {
        'financial_period': {
            'name': financial_period.name,
            'start_date': financial_period.start_date,
            'end_date': financial_period.end_date
        },
        'assets': {
            'details': asset_details,
            'total': total_assets
        },
        'liabilities': {
            'details': liability_details,
            'total': total_liabilities
        },
        'equity': {
            'details': equity_details,
            'total': total_equity
        },
        'total_liabilities_equity': total_liabilities + total_equity
    }


def generate_cash_flow(financial_period):
    """Generate cash flow statement for financial period."""
    # Get cash account
    try:
        cash_account = ChartOfAccounts.objects.get(
            company=financial_period.company,
            name__icontains='cash'
        )
    except ChartOfAccounts.DoesNotExist:
        return {
            'error': 'Cash account not found'
        }

    # Get cash receipts from sales
    sales_cash_receipts = JournalEntryItem.objects.filter(
        account=cash_account,
        journal_entry__date__gte=financial_period.start_date,
        journal_entry__date__lte=financial_period.end_date,
        journal_entry__is_posted=True,
        debit__gt=0
    )

    total_sales_cash = sales_cash_receipts.aggregate(Sum('debit'))['debit__sum'] or 0

    # Get cash payments for purchases
    purchases_cash_payments = JournalEntryItem.objects.filter(
        account=cash_account,
        journal_entry__date__gte=financial_period.start_date,
        journal_entry__date__lte=financial_period.end_date,
        journal_entry__is_posted=True,
        credit__gt=0
    )

    total_purchases_cash = purchases_cash_payments.aggregate(Sum('credit'))['credit__sum'] or 0

    # Get cash payments for expenses
    expenses_cash_payments = JournalEntryItem.objects.filter(
        account=cash_account,
        journal_entry__date__gte=financial_period.start_date,
        journal_entry__date__lte=financial_period.end_date,
        journal_entry__is_posted=True,
        credit__gt=0
    )

    total_expenses_cash = expenses_cash_payments.aggregate(Sum('credit'))['credit__sum'] or 0

    # Calculate net cash flow
    net_cash_flow = total_sales_cash - total_purchases_cash - total_expenses_cash

    return {
        'financial_period': {
            'name': financial_period.name,
            'start_date': financial_period.start_date,
            'end_date': financial_period.end_date
        },
        'cash_receipts': {
            'total': total_sales_cash
        },
        'cash_payments': {
            'purchases': total_purchases_cash,
            'expenses': total_expenses_cash,
            'total': total_purchases_cash + total_expenses_cash
        },
        'net_cash_flow': net_cash_flow
    }
