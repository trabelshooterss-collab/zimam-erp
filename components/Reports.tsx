
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, PieChart, TrendingUp, Cpu, Package, DollarSign } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// This would eventually be replaced by a real charting library like Recharts or Chart.js
const ChartPlaceholder = ({ type = 'bar', title }: { type?: 'bar' | 'pie', title: string }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`}>
            <h3 className="font-bold text-lg dark:text-white mb-4">{title}</h3>
            <div className="h-64 flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <p className="text-slate-500">{type === 'bar' ? <BarChart2 size={40}/> : <PieChart size={40}/>} Chart Placeholder</p>
            </div>
        </div>
    )
};


const ReportsPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">التقارير الذكية</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">تحليلات مدعومة بالذكاء الاصطناعي لنمو أعمالك.</p>
        </div>
      </div>

      {/* Main Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2">
            <ChartPlaceholder title="الأرباح والتكاليف (آخر 30 يومًا)" />
        </div>

        {/* AI Suggestions */}
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`}>
            <div className="flex items-center gap-3 mb-4">
                <Cpu size={24} className="text-purple-500"/>
                <h3 className="font-bold text-lg dark:text-white">توصيات الذكاء الاصطناعي</h3>
            </div>
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500">
                    <h4 className="font-bold text-sm text-green-800 dark:text-green-300">اقتراح تسعير</h4>
                    <p className="text-xs text-green-700 dark:text-green-400">"جنط ألمنيوم 18" عليه طلب عالي. فكّر في زيادة سعره بنسبة 5% لزيادة الأرباح.</p>
                </div>
                 <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-500">
                    <h4 className="font-bold text-sm text-orange-800 dark:text-orange-300">تحليل المخزون</h4>
                    <p className="text-xs text-orange-700 dark:text-orange-400">"زيت محرك كاسترول" لم يتم بيعه منذ 45 يومًا. فكّر في عمل عرض خاص عليه.</p>
                </div>
            </div>
        </div>
      </div>
      
      {/* Secondary Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartPlaceholder type="pie" title="المنتجات الأكثر مبيعًا" />
        <ChartPlaceholder title="أداء الفنيين" />
        <ChartPlaceholder type="pie" title="مصادر العملاء" />
      </div>

    </motion.div>
  );
};

export default ReportsPage;
