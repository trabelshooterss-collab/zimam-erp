import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, FileText, Download, Printer, Filter, 
  AlertCircle, Wallet, ArrowUpRight, ArrowDownLeft, DollarSign, PieChart
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Accounting: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  // بيانات وهمية للمحاكاة
  const transactions = [
    { id: 1, desc: 'مبيعات نقدية - فرع الرياض', type: 'income', amount: 15400, date: '2025-11-25', status: 'completed', category: 'مبيعات' },
    { id: 2, desc: 'شراء بضاعة (مورد أبل)', type: 'expense', amount: 45000, date: '2025-11-24', status: 'pending', category: 'مخزون' },
    { id: 3, desc: 'فاتورة كهرباء وانترنت', type: 'expense', amount: 1200, date: '2025-11-23', status: 'completed', category: 'تشغيل' },
    { id: 4, desc: 'دفعة عميل (شركة المقاولات)', type: 'income', amount: 8500, date: '2025-11-23', status: 'completed', category: 'مستحقات' },
    { id: 5, desc: 'صيانة أجهزة تكييف', type: 'expense', amount: 450, date: '2025-11-22', status: 'completed', category: 'صيانة' },
  ];

  return (
    <div className="h-full flex flex-col gap-6 font-sans pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>الإدارة المالية</h1>
          <p className="text-slate-500 text-sm">مركز القيادة المالية، التقارير الضريبية، ومراقبة السيولة.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 transition-colors">
            <Printer size={18} /> تقرير ضريبي
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-colors">
            <Download size={18} /> تصدير Excel
          </button>
        </div>
      </div>

      {/* Financial Cards (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`p-6 rounded-3xl border relative overflow-hidden group ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
           <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full group-hover:bg-green-500/20 transition-colors"></div>
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg text-green-600 dark:text-green-400"><Wallet size={20} /></div>
                <p className="text-slate-500 text-sm font-bold">صافي الدخل</p>
             </div>
             <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>245,000 <span className="text-sm font-normal text-slate-400">ر.س</span></h2>
             <div className="flex items-center gap-1 text-green-500 text-xs mt-2 font-bold bg-green-500/10 w-fit px-2 py-1 rounded-lg">
               <TrendingUp size={14} /> +12% نمو شهري
             </div>
           </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`p-6 rounded-3xl border relative overflow-hidden group ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
           <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full group-hover:bg-red-500/20 transition-colors"></div>
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400"><ArrowDownLeft size={20} /></div>
                <p className="text-slate-500 text-sm font-bold">المصروفات</p>
             </div>
             <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>42,300 <span className="text-sm font-normal text-slate-400">ر.س</span></h2>
             <div className="flex items-center gap-1 text-red-500 text-xs mt-2 font-bold bg-red-500/10 w-fit px-2 py-1 rounded-lg">
               <TrendingUp size={14} /> +5% عن المتوقع
             </div>
           </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`p-6 rounded-3xl border relative overflow-hidden group ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full group-hover:bg-blue-500/20 transition-colors"></div>
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"><FileText size={20} /></div>
                <p className="text-slate-500 text-sm font-bold">فواتير مستحقة (لنا)</p>
             </div>
             <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>85,000 <span className="text-sm font-normal text-slate-400">ر.س</span></h2>
             <div className="flex items-center gap-1 text-blue-500 text-xs mt-2 font-bold bg-blue-500/10 w-fit px-2 py-1 rounded-lg">
               <ArrowUpRight size={14} /> 5 عملاء
             </div>
           </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`p-6 rounded-3xl border relative overflow-hidden group ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
           <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full group-hover:bg-orange-500/20 transition-colors"></div>
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600 dark:text-orange-400"><AlertCircle size={20} /></div>
                <p className="text-slate-500 text-sm font-bold">الضريبة (VAT)</p>
             </div>
             <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>15,420 <span className="text-sm font-normal text-slate-400">ر.س</span></h2>
             <div className="flex items-center gap-1 text-orange-500 text-xs mt-2 font-bold bg-orange-500/10 w-fit px-2 py-1 rounded-lg">
               مستحق السداد قريباً
             </div>
           </div>
        </motion.div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Transactions Table */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>دفتر القيود اليومية</h3>
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"><Filter size={20} className="text-slate-400" /></button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-right text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <th className="pb-4">البيان</th>
                  <th className="pb-4">التصنيف</th>
                  <th className="pb-4">التاريخ</th>
                  <th className="pb-4">الحالة</th>
                  <th className="pb-4 text-left">المبلغ</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.map((t) => (
                  <tr key={t.id} className={`border-t group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${theme === 'dark' ? 'border-white/5' : 'border-slate-50'}`}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                        </div>
                        <span className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{t.desc}</span>
                      </div>
                    </td>
                    <td className="py-4">
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-xs text-slate-500">{t.category}</span>
                    </td>
                    <td className="py-4 text-slate-500 text-xs font-mono">{t.date}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === 'completed' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {t.status === 'completed' ? 'مكتمل' : 'معلق'}
                      </span>
                    </td>
                    <td className={`py-4 text-left font-bold ${t.type === 'income' ? 'text-green-500' : 'text-slate-800 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Financial Advisor */}
        <div className={`p-8 rounded-[2rem] border bg-gradient-to-b from-indigo-900 to-black text-white border-white/10 flex flex-col justify-between shadow-2xl`}>
           <div>
             <div className="flex items-center gap-3 mb-8">
               <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
                 <BrainCircuitIcon />
               </div>
               <div>
                 <h3 className="font-bold text-xl">Zimam Finance AI</h3>
                 <p className="text-indigo-300 text-xs">تحليل مالي فوري</p>
               </div>
             </div>

             <div className="space-y-4">
               <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer">
                 <h4 className="text-sm font-bold text-indigo-200 mb-2 flex items-center gap-2"><AlertCircle size={14} /> تحليل المصروفات</h4>
                 <p className="text-sm leading-relaxed text-slate-300">
                   لاحظت أن بند "الضيافة" ارتفع بنسبة 30% هذا الشهر. أنصح بمراجعة الفواتير الصادرة من الكافتيريا للتحقق.
                 </p>
               </div>

               <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer">
                 <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2"><TrendingUp size={14} /> فرصة استثمار</h4>
                 <p className="text-sm leading-relaxed text-slate-300">
                   لديك فائض نقدي قدره 120,000 ريال. يمكنك استخدامه لشراء بضاعة المخزون الراكد بخصم نقدي 5% من المورد.
                 </p>
               </div>
             </div>
           </div>

           <button className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
             <FileText size={18} /> طلب تقرير مفصل
           </button>
        </div>

      </div>
    </div>
  );
};

// أيقونة بسيطة
const BrainCircuitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-1.364"/><path d="M19.97 16.636A4 4 0 0 1 18 18"/></svg>
);

export default Accounting;