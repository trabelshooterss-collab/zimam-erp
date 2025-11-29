import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, Activity, BrainCircuit, Wrench, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const { t, formatNumber, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  // إحصائيات وهمية متوافقة مع متطلباتك
  const stats = {
    revenue: { value: 58750, change: 12.5, trend: 'up' },
    orders: { value: 1248, change: -3.2, trend: 'down' },
    customers: { value: 4256, change: 8.7, trend: 'up' },
    workOrders: { value: 152, change: 15, trend: 'up' }
  };

  useEffect(() => { const timer = setTimeout(() => setIsLoading(false), 1000); return () => clearTimeout(timer); }, []);

  const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants: Variants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('dashboard')}</h1><p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>مرحباً بك مجدداً، إليك ملخص أعمالك.</p></div>
        <div className="flex items-center gap-3"><button className={`px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white`}>+ إضافة جديدة</button></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <motion.div variants={itemVariants} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <div className="flex items-center justify-between mb-4"><div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}><DollarSign className="text-blue-600" size={24} /></div><div className={`flex items-center gap-1 text-sm font-medium ${stats.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{stats.revenue.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.revenue.change)}%</div></div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stats.revenue.value.toLocaleString()} {t('currency')}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>إجمالي الإيرادات</p>
        </motion.div>
        {/* Work Orders */}
        <motion.div variants={itemVariants} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <div className="flex items-center justify-between mb-4"><div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-100'}`}><Wrench className="text-orange-600" size={24} /></div><div className={`flex items-center gap-1 text-sm font-medium ${stats.workOrders.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{stats.workOrders.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.workOrders.change)}%</div></div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stats.workOrders.value.toLocaleString()}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>أوامر العمل النشطة</p>
        </motion.div>
        {/* Customers */}
        <motion.div variants={itemVariants} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <div className="flex items-center justify-between mb-4"><div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}><Users className="text-green-600" size={24} /></div><div className={`flex items-center gap-1 text-sm font-medium ${stats.customers.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{stats.customers.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.customers.change)}%</div></div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stats.customers.value.toLocaleString()}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>العملاء المسجلين</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;