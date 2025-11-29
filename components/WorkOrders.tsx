import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Wrench, User, Calendar, DollarSign, AlertTriangle, Clock, CheckCircle, MoreVertical } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface WorkOrder {
  id: string;
  service: 'تجديد' | 'قص ألماسي' | 'بوفيه' | 'دهان';
  customer: string;
  assignedTo: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Cancelled';
  cost: number;
  priority: 'High' | 'Medium' | 'Low';
}

const mockWorkOrders: WorkOrder[] = [
    { id: 'WO-1001', customer: 'أحمد المصري', service: 'قص ألماسي', status: 'In Progress', assignedTo: 'محمود', date: '2023-11-20', priority: 'High', cost: 750 },
    { id: 'WO-1002', customer: 'سارة عبدالله', service: 'دهان', status: 'Pending', assignedTo: 'غير معين', date: '2023-11-21', priority: 'Medium', cost: 1200 },
    { id: 'WO-1003', customer: 'خالد يوسف', service: 'تجديد', status: 'Completed', assignedTo: 'علي', date: '2023-11-19', priority: 'Low', cost: 900 },
    { id: 'WO-1004', customer: 'فاطمة حجازي', service: 'بوفيه', status: 'Completed', assignedTo: 'محمود', date: '2023-11-18', priority: 'Medium', cost: 450 },
    { id: 'WO-1005', customer: 'حسن شريف', service: 'قص ألماسي', status: 'Cancelled', assignedTo: 'علي', date: '2023-11-17', priority: 'High', cost: 700 },
];

const WorkOrders: React.FC = () => {
  const { t, dir } = useLanguage();
  const { theme } = useTheme();
  const [orders, setOrders] = useState(mockWorkOrders);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => filter === 'all' || o.status.toLowerCase().replace(' ', '_') === filter)
      .filter(o => o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || o.service.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [orders, filter, searchTerm]);

  const getStatusPill = (status: WorkOrder['status']) => {
    const styles = {
      Completed: `bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`,
      'In Progress': `bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`,
      Pending: `bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400`,
      Cancelled: `bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`,
    };
    return styles[status];
  };

  const getPriorityPill = (priority: WorkOrder['priority']) => {
    const styles = {
      High: `bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`,
      Medium: `bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`,
      Low: `bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400`,
    };
    return styles[priority];
  };
  
  const pendingCount = useMemo(() => orders.filter(o => o.status === 'Pending').length, [orders]);
  const inProgressCount = useMemo(() => orders.filter(o => o.status === 'In Progress').length, [orders]);


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" dir={dir}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">أوامر العمل</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">تتبع وإدارة جميع مهام الصيانة والإصلاح.</p>
        </div>
        <button className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg flex items-center gap-2 self-start md:self-center">
          <Plus size={20} />
          <span>إنشاء أمر عمل جديد</span>
        </button>
      </div>
      
      {/* Summary Cards */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`}><h4 className="text-sm text-slate-500">الإجمالي</h4><p className="text-2xl font-bold dark:text-white">{orders.length}</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-orange-900/50' : 'bg-orange-50'} border-orange-200`}><h4 className="text-sm text-orange-600 dark:text-orange-400">في الانتظار</h4><p className="text-2xl font-bold text-orange-600 dark:text-orange-300">{pendingCount}</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-50'} border-blue-200`}><h4 className="text-sm text-blue-600 dark:text-blue-400">قيد التنفيذ</h4><p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{inProgressCount}</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-50'} border-green-200`}><h4 className="text-sm text-green-600 dark:text-green-400">مكتمل</h4><p className="text-2xl font-bold text-green-600 dark:text-green-300">{orders.filter(o => o.status === 'Completed').length}</p></div>
      </div>

      {/* Filters and Search */}
      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="ابحث بالعميل أو الخدمة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`} />
          </div>
          <div className="flex items-center p-1 rounded-lg overflow-x-auto pb-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'dark:text-slate-300'}`}>الكل</button>
            <button onClick={() => setFilter('pending')} className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'pending' ? 'bg-orange-500 text-white' : 'dark:text-slate-300'}`}>في الانتظار</button>
            <button onClick={() => setFilter('in_progress')} className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'in_progress' ? 'bg-blue-500 text-white' : 'dark:text-slate-300'}`}>قيد التنفيذ</button>
            <button onClick={() => setFilter('completed')} className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'completed' ? 'bg-green-500 text-white' : 'dark:text-slate-300'}`}>مكتمل</button>
          </div>
        </div>
      </div>
      
      {/* Work Orders Table */}
      <div className={`rounded-xl border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className={`text-xs ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
              <tr>
                <th className="p-4">رقم الطلب</th>
                <th className="p-4">الخدمة</th>
                <th className="p-4">العميل</th>
                <th className="p-4">الفني المسؤول</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">التكلفة</th>
                <th className="p-4">الأولوية</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className={`border-b ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                  <td className="p-4 font-mono text-slate-500">{order.id}</td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{order.service}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{order.assignedTo}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{order.date}</td>
                  <td className="p-4 font-medium text-green-600 dark:text-green-400">{order.cost.toLocaleString()} {t('currency')}</td>
                  <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getPriorityPill(order.priority)}`}>{order.priority}</span></td>
                  <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusPill(order.status)}`}>{order.status}</span></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                       <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-500"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
             <div className="text-center py-12 text-slate-500">
                <Wrench size={40} className="mx-auto mb-2"/>
                <h3 className="font-bold">لا توجد أوامر عمل مطابقة</h3>
                <p className="text-sm">جرّب تغيير كلمات البحث أو الفلتر.</p>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkOrders;