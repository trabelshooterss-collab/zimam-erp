import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, CreditCard, Printer, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Purchases: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const invoices = [
    { id: 'INV-2025-001', customer: 'أحمد المصري', date: '2023-11-20', total: 5073, status: 'Unpaid' },
    { id: 'INV-2025-002', customer: 'شركة الفجر', date: '2023-11-15', total: 1200, status: 'Paid' },
    { id: 'INV-2025-003', customer: 'خالد يوسف', date: '2023-10-01', total: 3500, status: 'Overdue' },
  ];

  const filtered = invoices.filter(i => (filter === 'all' || i.status.toLowerCase() === filter) && i.customer.includes(searchTerm));
  
  const getStatusStyle = (s: string) => s === 'Paid' ? 'bg-green-100 text-green-700' : s === 'Unpaid' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700';

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div><h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>الفواتير والدفع</h1><p className="text-slate-500 mt-1">تتبع الفواتير والمدفوعات الإلكترونية.</p></div>
        <button className="bg-blue-600 text-white font-bold py-3 px-5 rounded-lg flex items-center gap-2"><Plus size={20} /> <span>إنشاء فاتورة</span></button>
      </div>

      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow"><Search className="absolute left-3 top-3 text-slate-400" size={20} /><input type="text" placeholder="بحث..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'} outline-none`} /></div>
          <div className="flex items-center gap-2">
             <button onClick={() => setFilter('all')} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">الكل</button>
             <button onClick={() => setFilter('paid')} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md text-sm">مدفوع</button>
          </div>
        </div>
      </div>

       <div className={`rounded-xl border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className={`text-xs ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-600'}`}><tr><th className="p-4">رقم الفاتورة</th><th className="p-4">العميل</th><th className="p-4">التاريخ</th><th className="p-4">المبلغ</th><th className="p-4">الحالة</th><th className="p-4">إجراءات</th></tr></thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} className={`border-b ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <td className="p-4 font-mono">{inv.id}</td>
                  <td className={`p-4 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{inv.customer}</td>
                  <td className="p-4 text-slate-500">{inv.date}</td>
                  <td className="p-4 font-bold text-blue-500">{inv.total.toLocaleString()} ر.س</td>
                  <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusStyle(inv.status)}`}>{inv.status}</span></td>
                  <td className="p-4 flex gap-2"><button className="p-2 bg-slate-100 dark:bg-slate-700 rounded"><Printer size={16}/></button><button className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded"><CreditCard size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Purchases;