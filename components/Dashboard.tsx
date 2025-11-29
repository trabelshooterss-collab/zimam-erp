import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, ShoppingCart, Activity, BrainCircuit,
  Wrench, DollarSign, ArrowUp, ArrowDown, Bell, Search, Filter
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: { value: 0, change: 0, trend: 'up' },
    orders: { value: 0, change: 0, trend: 'down' },
    customers: { value: 0, change: 0, trend: 'up' },
    workOrders: { value: 0, change: 0, trend: 'up' }
  });
  const [revenueData, setRevenueData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/sales/dashboard/stats/');
        setStats(response.data.stats);
        setRevenueData(response.data.revenueData);
        setInventoryData(response.data.inventoryData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight`}>
            {t('dashboard')}
          </h1>
          <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Welcome back, Mohamed. Here's your business at a glance.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500'} shadow-sm border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            <Search size={20} />
          </div>
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500'} shadow-sm border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} relative`}>
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <button className="px-6 py-3 rounded-xl font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 flex items-center gap-2">
            <Activity size={20} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* AI Insights Widget */}
      <motion.div
        variants={itemVariants}
        className={`rounded-3xl p-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600`}
      >
        <div className={`rounded-[22px] p-6 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} h-full`}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <BrainCircuit size={32} />
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                AI Business Insights
              </h3>
              <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                Based on your recent sales data, <span className="font-bold text-green-500">Revenue is {stats.revenue.trend === 'up' ? 'up' : 'down'} {Math.abs(stats.revenue.change)}%</span> this week.
                Inventory analysis suggests restocking <span className="font-bold text-blue-500">Michelin Tires</span> within 3 days to avoid stockouts.
                Consider launching a promotion on <span className="font-bold text-purple-500">Rims</span> to clear slow-moving stock.
              </p>
            </div>
            <button className={`px-4 py-2 rounded-lg text-sm font-bold border ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} transition-colors`}>
              View Details
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: `${stats.revenue.value.toLocaleString()} ${t('currency')}`, change: `${stats.revenue.change}%`, trend: stats.revenue.trend, icon: DollarSign, color: 'blue' },
          { title: 'Active Orders', value: stats.orders.value.toLocaleString(), change: `${stats.orders.change}%`, trend: stats.orders.trend, icon: ShoppingCart, color: 'purple' },
          { title: 'New Customers', value: stats.customers.value.toLocaleString(), change: `${stats.customers.change}%`, trend: stats.customers.trend, icon: Users, color: 'green' },
          { title: 'Pending Work', value: stats.workOrders.value.toLocaleString(), change: `${stats.workOrders.change}%`, trend: stats.workOrders.trend, icon: Wrench, color: 'orange' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} p-6 shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} hover:scale-[1.02] transition-transform`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {stat.change}
              </div>
            </div>
            <h3 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <motion.div
          variants={itemVariants}
          className={`lg:col-span-2 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} p-8 shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Revenue Overview</h3>
            <select className={`bg-transparent border-none font-bold text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} focus:ring-0`}>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#E2E8F0'} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFF',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Inventory Status */}
        <motion.div
          variants={itemVariants}
          className={`rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} p-8 shadow-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
        >
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-8`}>Inventory Status</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'dark' ? '#334155' : '#E2E8F0'} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B', fontWeight: 600 }} width={80} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFF',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;