
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import (
    ChartOfAccounts, JournalEntry, JournalEntryItem, 
    FinancialPeriod, TrialBalance, FinancialStatement
)


class ChartOfAccountsSerializer(serializers.ModelSerializer):
    """Serializer for ChartOfAccounts model."""

    parent_name = serializers.CharField(source='parent.name', read_only=True)
    parent_code = serializers.CharField(source='parent.code', read_only=True)

    class Meta:
        model = ChartOfAccounts
        fields = [
            'id', 'code', 'name', 'account_type', 'parent',
            'parent_name', 'parent_code', 'description', 'is_active'
        ]
        read_only_fields = ['id']


class JournalEntryItemSerializer(serializers.ModelSerializer):
    """Serializer for JournalEntryItem model."""

    account_name = serializers.CharField(source='account.name', read_only=True)
    account_code = serializers.CharField(source='account.code', read_only=True)

    class Meta:
        model = JournalEntryItem
        fields = [
            'id', 'journal_entry', 'account', 'account_name', 'account_code',
            'description', 'debit', 'credit'
        ]
        read_only_fields = ['id']


class JournalEntrySerializer(serializers.ModelSerializer):
    """Serializer for JournalEntry model."""

    items = JournalEntryItemSerializer(many=True, read_only=True)
    is_balanced = serializers.BooleanField(read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = JournalEntry
        fields = [
            'id', 'entry_number', 'date', 'description', 'reference',
            'is_posted', 'items', 'is_balanced', 'created_at',
            'created_by', 'created_by_name'
        ]
        read_only_fields = ['id', 'is_balanced', 'created_at', 'created_by']

    def create(self, validated_data):
        """Create journal entry with items."""
        items_data = validated_data.pop('items', [])

        # Create journal entry
        journal_entry = JournalEntry.objects.create(**validated_data)

        # Create journal entry items
        for item_data in items_data:
            JournalEntryItem.objects.create(journal_entry=journal_entry, **item_data)

        return journal_entry


class FinancialPeriodSerializer(serializers.ModelSerializer):
    """Serializer for FinancialPeriod model."""

    class Meta:
        model = FinancialPeriod
        fields = [
            'id', 'name', 'start_date', 'end_date', 'is_closed', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TrialBalanceSerializer(serializers.ModelSerializer):
    """Serializer for TrialBalance model."""

    account_name = serializers.CharField(source='account.name', read_only=True)
    account_code = serializers.CharField(source='account.code', read_only=True)
    account_type = serializers.CharField(source='account.account_type', read_only=True)

    class Meta:
        model = TrialBalance
        fields = [
            'id', 'financial_period', 'account', 'account_name', 'account_code',
            'account_type', 'opening_balance', 'debit_total', 'credit_total',
            'closing_balance'
        ]
        read_only_fields = ['id']


class FinancialStatementSerializer(serializers.ModelSerializer):
    """Serializer for FinancialStatement model."""

    financial_period_name = serializers.CharField(source='financial_period.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = FinancialStatement
        fields = [
            'id', 'financial_period', 'financial_period_name', 'statement_type',
            'title', 'content', 'created_at', 'created_by', 'created_by_name'
        ]
        read_only_fields = ['id', 'created_at', 'created_by']
