import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Invoice {
  id: string;
  customer: string;
  date: string;
  dueDate: string;
  total: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

const mockInvoices: Invoice[] = [
  { id: 'INV-2025-001', customer: 'أحمد المصري', date: '2023-11-20', dueDate: '2023-12-20', total: 5073, status: 'Unpaid' },
  { id: 'INV-2025-002', customer: 'فاطمة حجازي', date: '2023-11-15', dueDate: '2023-12-15', total: 1200, status: 'Paid' },
  { id: 'INV-2025-003', customer: 'خالد يوسف', date: '2023-10-01', dueDate: '2023-11-01', total: 3500, status: 'Overdue' },
  { id: 'INV-2025-004', customer: 'الشركة الدولية', date: '2023-11-25', dueDate: '2023-12-25', total: 8500, status: 'Unpaid' },
];

const Invoices: React.FC<{ onViewInvoice: (invoiceId: string) => void }> = ({ onViewInvoice }) => {
  const { theme } = useTheme();
  const [invoices, setInvoices] = useState(mockInvoices);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(i => filter === 'all' || i.status.toLowerCase() === filter)
      .filter(i => i.customer.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [invoices, filter, searchTerm]);
  
  const getStatusPill = (status: Invoice['status']) => {
    const styles = {
      Paid: `bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`,
      Unpaid: `bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400`,
      Overdue: `bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`,
    };
    return styles[status];
  };

  const overdueTotal = useMemo(() => invoices.filter(i => i.status === 'Overdue').reduce((acc, i) => acc + i.total, 0), [invoices]);
  const unpaidCount = useMemo(() => invoices.filter(i => i.status === 'Unpaid').length, [invoices]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">الفواتير</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">تتبع وإدارة فواتير المبيعات والدفع.</p>
        </div>
        <button className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg flex items-center gap-2 self-start md:self-center">
          <Plus size={20} />
          <span>إنشاء فاتورة جديدة</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`}><h4 className="text-sm text-slate-500">إجمالي الفواتير</h4><p className="text-2xl font-bold dark:text-white">{invoices.length}</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-red-900/50' : 'bg-red-50'} border-red-200`}><h4 className="text-sm text-red-600 dark:text-red-400">مبالغ متأخرة</h4><p className="text-2xl font-bold text-red-600 dark:text-red-300">{overdueTotal.toLocaleString()} {t('currency')}</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-orange-900/50' : 'bg-orange-50'} border-orange-200`}><h4 className="text-sm text-orange-600 dark:text-orange-400">غير مدفوع</h4><p className="text-2xl font-bold text-orange-600 dark:text-orange-300">{unpaidCount}</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-50'} border-green-200`}><h4 className="text-sm text-green-600 dark:text-green-400">مدفوع (آخر 30 يوم)</h4><p className="text-2xl font-bold text-green-600 dark:text-green-300">12,500 {t('currency')}</p></div>
      </div>

      {/* Filters and Search */}
      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="ابحث باسم العميل..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`} />
          </div>
          <div className="flex items-center p-1 rounded-lg overflow-x-auto pb-2">
             <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'dark:text-slate-300'}`}>الكل</button>
             <button onClick={() => setFilter('unpaid')} className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'unpaid' ? 'bg-orange-500 text-white' : 'dark:text-slate-300'}`}>غير مدفوع</button>
             <button onClick={() => setFilter('paid')} className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'paid' ? 'bg-green-500 text-white' : 'dark:text-slate-300'}`}>مدفوع</button>
             <button onClick={() => setFilter('overdue')} className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'overdue' ? 'bg-red-500 text-white' : 'dark:text-slate-300'}`}>متأخر</button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
       <div className={`rounded-xl border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className={`text-xs ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
              <tr>
                <th className="p-4">رقم الفاتورة</th>
                <th className="p-4">العميل</th>
                <th className="p-4">تاريخ الإصدار</th>
                <th className="p-4">تاريخ الاستحقاق</th>
                <th className="p-4">المبلغ</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id} className={`border-b ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                  <td className="p-4 font-mono text-slate-500">{invoice.id}</td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{invoice.customer}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{invoice.date}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{invoice.dueDate}</td>
                  <td className="p-4 font-medium text-blue-600 dark:text-blue-400">{invoice.total.toLocaleString()} {t('currency')}</td>
                  <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusPill(invoice.status)}`}>{invoice.status}</span></td>
                  <td className="p-4">
                    <button onClick={() => onViewInvoice(invoice.id)} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">عرض</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInvoices.length === 0 && (
             <div className="text-center py-12 text-slate-500">
                <h3 className="font-bold">لا توجد فواتير مطابقة</h3>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Invoices;