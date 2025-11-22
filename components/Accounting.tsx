import React from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useStore } from '../context/StoreContext';

const Accounting: React.FC = () => {
  const { t } = useLanguage();
  const { journalEntries } = useStore();

  const totalDebit = journalEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = journalEntries.reduce((sum, e) => sum + e.credit, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
            <Landmark className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('accounting_title')}</h1>
        </div>
        <p className="text-gray-500">{t('accounting_desc')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-green-800 uppercase tracking-wider">{t('total_debit')}</span>
            <ArrowDownLeft className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalDebit.toLocaleString()} <span className="text-lg text-gray-500 font-normal">{t('currency_sar')}</span></div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-red-800 uppercase tracking-wider">{t('total_credit')}</span>
            <ArrowUpRight className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalCredit.toLocaleString()} <span className="text-lg text-gray-500 font-normal">{t('currency_sar')}</span></div>
        </div>
      </div>

      {/* Journal Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t('journal_entries')}
          </h2>
          <span className="text-xs text-gray-500 bg-white border px-2 py-1 rounded">
             {journalEntries.length} Records
          </span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-white border-b border-gray-200">
                <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('date')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('entry_id')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('account')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('description')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-end">{t('debit')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-end">{t('credit')}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {[...journalEntries].reverse().map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-500">{entry.date}</td>
                    <td className="px-6 py-3 text-sm font-medium text-indigo-600">{entry.id}</td>
                    <td className="px-6 py-3 text-sm font-mono text-gray-700">{entry.account}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{entry.description}</td>
                    <td className="px-6 py-3 text-sm font-medium text-end text-gray-900">
                    {entry.debit > 0 ? entry.debit.toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-end text-gray-900">
                    {entry.credit > 0 ? entry.credit.toLocaleString() : '-'}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Accounting;