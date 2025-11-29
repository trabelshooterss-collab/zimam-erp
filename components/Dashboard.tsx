import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Package, ShoppingCart, Users, DollarSign, Activity, 
  BarChart3, PieChart, Zap, Globe, Calendar, Clock, AlertCircle, 
  ArrowUp, ArrowDown, MoreHorizontal, Filter, Search, Bell, Settings, Wrench
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isLoading, setIsLoading] = useState(true);

  // Mock Data
  const [stats, setStats] = useState({
    revenue: { value: 58750, change: 12.5, trend: 'up' },
    orders: { value: 1248, change: -3.2, trend: 'down' },
    customers: { value: 4256, change: 8.7, trend: 'up' },
    workOrders: { value: 152, change: 15, trend: 'up' }
  });

  const [chartData, setChartData] = useState([
    { name: 'الأحد', sales: 4000, orders: 24 },
    { name: 'الإثنين', sales: 3000, orders: 18 },
    { name: 'الثلاثاء', sales: 5000, orders: 29 },
    { name: 'الأربعاء', sales: 2780, orders: 15 },
    { name: 'الخميس', sales: 6890, orders: 38 },
    { name: 'الجمعة', sales: 7390, orders: 42 },
    { name: 'السبت', sales: 5490, orders: 31 }
  ]);

  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-2023-001', customer: 'أحمد محمد', total: 1250, status: 'completed', date: '2023-10-15' },
    { id: 'ORD-2023-002', customer: 'سارة أحمد', total: 890, status: 'processing', date: '2023-10-15' },
    { id: 'ORD-2023-003', customer: 'محمد علي', total: 2100, status: 'pending', date: '2023-10-14' },
  ]);

  const [recentWorkOrders, setRecentWorkOrders] = useState([
    { id: 'WO-2023-051', customer: 'خالد يوسف', service: 'قص ألماسي', status: 'in_progress', date: '2023-10-15' },
    { id: 'WO-2023-050', customer: 'عائشة مراد', service: 'تجديد جنط', status: 'completed', date: '2023-10-14' },
    { id: 'WO-2023-049', customer: 'حسن شريف', service: 'دهان', status: 'pending', date: '2023-10-14' },
  ]);

  const [topProducts, setTopProducts] = useState([
    { id: 1, name: 'جنط رياضي 18 بوصة', sales: 45, revenue: 67500, image: 'https://picsum.photos/seed/rim1/100/100.jpg' },
    { id: 2, name: 'طقم إطارات ميشلان', sales: 38, revenue: 45600, image: 'https://picsum.photos/seed/tire1/100/100.jpg' },
    { id: 3, name: 'زيت محرك كاسترول', sales: 62, revenue: 18600, image: 'https://picsum.photos/seed/oil1/100/100.jpg' },
    { id: 4, name: 'فلتر هواء رياضي', sales: 87, revenue: 17400, image: 'https://picsum.photos/seed/filter1/100/100.jpg' }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };

  const getStatusPill = (status: string) => {
    const styles: { [key: string]: string } = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      in_progress: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      completed: 'مكتمل',
      processing: 'قيد المعالجة',
      in_progress: 'قيد التنفيذ',
      pending: 'في الانتظار',
    };
    return texts[status] || status;
  };
  
  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>لوحة التحكم</h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>مرحباً بك مجدداً، إليك ملخص سريع لعملك.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className={`px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white`}>+ إضافة جديدة</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <motion.div variants={itemVariants} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}><DollarSign className="text-blue-600" size={24} /></div>
            <div className={`flex items-center gap-1 text-sm font-medium ${stats.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenue.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.revenue.change)}%
            </div>
          </div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stats.revenue.value.toLocaleString()} {t('currency')}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>إجمالي الإيرادات</p>
        </motion.div>
        {/* Orders */}
        <motion.div variants={itemVariants} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'}`}><ShoppingCart className="text-purple-600" size={24} /></div>
            <div className={`flex items-center gap-1 text-sm font-medium ${stats.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
               {stats.orders.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.orders.change)}%
            </div>
          </div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stats.orders.value.toLocaleString()}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>الفواتير / الطلبات</p>
        </motion.div>
        {/* Customers */}
        <motion.div variants={itemVariants} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}><Users className="text-green-600" size={24} /></div>
             <div className={`flex items-center gap-1 text-sm font-medium ${stats.customers.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stats.customers.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.customers.change)}%
            </div>
          </div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stats.customers.value.toLocaleString()}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>العملاء</p>
        </motion.div>
        {/* Work Orders */}
        <motion.div variants={itemVariants} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-100'}`}><Wrench className="text-orange-600" size={24} /></div>
            <div className={`flex items-center gap-1 text-sm font-medium ${stats.workOrders.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stats.workOrders.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.workOrders.change)}%
            </div>
          </div>
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stats.workOrders.value.toLocaleString()}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>أوامر العمل</p>
        </motion.div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Work Orders */}
        <motion.div variants={itemVariants} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-4`}>أوامر العمل الأخيرة</h2>
          <div className="space-y-3">
            {recentWorkOrders.map((wo) => (
              <div key={wo.id} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{wo.service}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusPill(wo.status)}`}>{getStatusText(wo.status)}</span>
                </div>
                <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{wo.customer} - {wo.id}</div>
              </div>
            ))}
          </div>
        </motion.div>
        {/* Recent Orders */}
        <motion.div variants={itemVariants} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-4`}>الفواتير الأخيرة</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
               <div key={order.id} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{order.customer}</span>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{order.total} {t('currency')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{order.id}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusPill(order.status)}`}>{getStatusText(order.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

       {/* Top Products */}
       <motion.div variants={itemVariants} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-4`}>المنتجات الأكثر طلباً</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              <tr>
                <th scope="col" className="px-4 py-3">المنتج</th>
                <th scope="col" className="px-4 py-3">عدد المبيعات</th>
                <th scope="col" className="px-4 py-3">الإيرادات</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                  <td className="px-4 py-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{product.name}</span>
                  </td>
                  <td className={`px-4 py-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{product.sales}</td>
                  <td className={`px-4 py-4 font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{product.revenue.toLocaleString()} {t('currency')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
