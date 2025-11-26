
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from apps.companies.models import Company

class ChartOfAccounts(models.Model):
    """Chart of accounts model for accounting system."""

    ACCOUNT_TYPES = (
        ('asset', _('Asset')),
        ('liability', _('Liability')),
        ('equity', _('Equity')),
        ('revenue', _('Revenue')),
        ('expense', _('Expense')),
    )

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='accounts',
        verbose_name=_('company')
    )
    code = models.CharField(_('account code'), max_length=20)
    name = models.CharField(_('account name'), max_length=200)
    account_type = models.CharField(_('account type'), max_length=20, choices=ACCOUNT_TYPES)
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        related_name='children',
        verbose_name=_('parent account'),
        blank=True, 
        null=True
    )
    description = models.TextField(_('description'), blank=True, null=True)
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('Chart of Accounts')
        verbose_name_plural = _('Chart of Accounts')
        unique_together = ['code', 'company']
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"

class JournalEntry(models.Model):
    """Journal entry model for recording transactions."""

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='journal_entries',
        verbose_name=_('company')
    )
    entry_number = models.CharField(_('entry number'), max_length=50)
    date = models.DateField(_('entry date'))
    description = models.TextField(_('description'))
    reference = models.CharField(_('reference'), max_length=100, blank=True, null=True)
    is_posted = models.BooleanField(_('posted'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='journal_entries',
        verbose_name=_('created by'),
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = _('Journal Entry')
        verbose_name_plural = _('Journal Entries')
        unique_together = ['entry_number', 'company']
        ordering = ['-date', '-entry_number']

    def __str__(self):
        return f"{self.entry_number} - {self.date}"

    @property
    def is_balanced(self):
        """Check if the journal entry is balanced."""
        total_debits = sum(item.debit for item in self.items.all())
        total_credits = sum(item.credit for item in self.items.all())
        return total_debits == total_credits

class JournalEntryItem(models.Model):
    """Journal entry item model for line items in journal entries."""

    journal_entry = models.ForeignKey(
        JournalEntry, 
        on_delete=models.CASCADE, 
        related_name='items',
        verbose_name=_('journal entry')
    )
    account = models.ForeignKey(
        ChartOfAccounts, 
        on_delete=models.CASCADE, 
        related_name='journal_items',
        verbose_name=_('account')
    )
    description = models.CharField(_('description'), max_length=200, blank=True, null=True)
    debit = models.DecimalField(_('debit'), max_digits=10, decimal_places=2, default=0)
    credit = models.DecimalField(_('credit'), max_digits=10, decimal_places=2, default=0)

    class Meta:
        verbose_name = _('Journal Entry Item')
        verbose_name_plural = _('Journal Entry Items')

    def __str__(self):
        return f"{self.journal_entry.entry_number} - {self.account.name}"

class FinancialPeriod(models.Model):
    """Financial period model for accounting periods."""

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='financial_periods',
        verbose_name=_('company')
    )
    name = models.CharField(_('period name'), max_length=100)
    start_date = models.DateField(_('start date'))
    end_date = models.DateField(_('end date'))
    is_closed = models.BooleanField(_('closed'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('Financial Period')
        verbose_name_plural = _('Financial Periods')
        unique_together = ['company', 'name']
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.name} ({self.start_date} to {self.end_date})"

class TrialBalance(models.Model):
    """Trial balance model for generating trial balance reports."""

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='trial_balances',
        verbose_name=_('company')
    )
    financial_period = models.ForeignKey(
        FinancialPeriod, 
        on_delete=models.CASCADE, 
        related_name='trial_balances',
        verbose_name=_('financial period')
    )
    account = models.ForeignKey(
        ChartOfAccounts, 
        on_delete=models.CASCADE, 
        related_name='trial_balances',
        verbose_name=_('account')
    )
    opening_balance = models.DecimalField(_('opening balance'), max_digits=10, decimal_places=2, default=0)
    debit_total = models.DecimalField(_('debit total'), max_digits=10, decimal_places=2, default=0)
    credit_total = models.DecimalField(_('credit total'), max_digits=10, decimal_places=2, default=0)
    closing_balance = models.DecimalField(_('closing balance'), max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('Trial Balance')
        verbose_name_plural = _('Trial Balances')
        unique_together = ['financial_period', 'account']

    def __str__(self):
        return f"{self.financial_period.name} - {self.account.name}"

class FinancialStatement(models.Model):
    """Financial statement model for generating financial reports."""

    STATEMENT_TYPES = (
        ('income_statement', _('Income Statement')),
        ('balance_sheet', _('Balance Sheet')),
        ('cash_flow', _('Cash Flow Statement')),
        ('equity_statement', _('Statement of Changes in Equity')),
    )

    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='financial_statements',
        verbose_name=_('company')
    )
    financial_period = models.ForeignKey(
        FinancialPeriod, 
        on_delete=models.CASCADE, 
        related_name='financial_statements',
        verbose_name=_('financial period')
    )
    statement_type = models.CharField(_('statement type'), max_length=30, choices=STATEMENT_TYPES)
    title = models.CharField(_('title'), max_length=200)
    content = models.TextField(_('content'))
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='financial_statements',
        verbose_name=_('created by'),
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = _('Financial Statement')
        verbose_name_plural = _('Financial Statements')
        unique_together = ['financial_period', 'statement_type']

    def __str__(self):
        return f"{self.title} - {self.financial_period.name}"
