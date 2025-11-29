import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, PieChart, TrendingUp, Calendar, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Reports: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="h-full pb-20 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>التقارير والتحليلات</h1>
          <p className="text-slate-500">نظرة شاملة على أداء المؤسسة.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/10 rounded-lg text-sm hover:bg-slate-200 transition-colors dark:text-white">
          <Download size={16} /> تصدير PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart Simulation */}
        <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
          <h3 className={`font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>المبيعات الشهرية</h3>
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {[45, 60, 30, 80, 55, 90].map((h, i) => (
              <div key={i} className="w-full bg-slate-100 dark:bg-white/5 rounded-t-xl relative group">
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${h}%` }} 
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="absolute bottom-0 w-full bg-blue-600 rounded-t-xl group-hover:bg-blue-500 transition-colors"
                />
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded">{h * 1000}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-500">
            <span>يناير</span><span>فبراير</span><span>مارس</span><span>أبريل</span><span>مايو</span><span>يونيو</span>
          </div>
        </div>

        {/* Expenses vs Profit */}
        <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
          <h3 className={`font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>الأرباح vs المصروفات</h3>
          <div className="flex items-center justify-center h-64">
             <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-100 dark:border-white/5 flex items-center justify-center">
               <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                 <path className="text-green-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="70, 100" />
               </svg>
               <div className="text-center">
                 <span className="block text-2xl font-bold text-green-500">70%</span>
                 <span className="text-xs text-slate-500">هامش ربح</span>
               </div>
             </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500"><div className="w-3 h-3 bg-green-500 rounded-full"></div> أرباح</div>
            <div className="flex items-center gap-2 text-sm text-slate-500"><div className="w-3 h-3 bg-slate-200 dark:bg-white/10 rounded-full"></div> مصاريف</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;