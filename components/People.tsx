import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Phone, Mail, ChevronDown, Filter, Users, Building } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const mockPeople = [
  { id: 1, type: 'customer', name: 'أحمد المصري', email: 'ahmed.m@example.com', phone: '01012345678', joinDate: '2023-01-15', status: 'Active', orderHistory: [
    { orderId: '#1254', date: '2023-11-20', total: 1500, status: 'Completed' },
    { orderId: '#1233', date: '2023-10-05', total: 850, status: 'Completed' },
  ]},
  { id: 2, type: 'customer', name: 'فاطمة حجازي', email: 'fatima.h@example.com', phone: '01298765432', joinDate: '2023-02-20', status: 'Active', orderHistory: [
    { orderId: '#1250', date: '2023-11-18', total: 2500, status: 'Processing' },
  ]},
  { id: 3, type: 'supplier', name: 'الشركة الدولية للإطارات', email: 'contact@international-tires.com', phone: '0223456789', joinDate: '2022-05-10', status: 'Active', orderHistory: []},
  { id: 4, type: 'customer', name: 'حسن شريف', email: 'hassan.s@example.com', phone: '01123456789', joinDate: '2023-03-11', status: 'Inactive', orderHistory: [
     { orderId: '#1190', date: '2023-07-01', total: 400, status: 'Cancelled' },
  ]},
  { id: 5, type: 'supplier', name: 'مصنع زمام للجنوط', email: 'sales@zimam-rims.com', phone: '0345678901', joinDate: '2021-11-30', status: 'Active', orderHistory: []},
];


const People = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filteredPeople = useMemo(() => {
    return mockPeople
      .filter(person => filterType === 'all' || person.type === filterType)
      .filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, filterType]);

  const getStatusPill = (status: string) => {
    const styles: { [key: string]: string } = {
      Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">قائمة الأشخاص</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">إدارة العملاء والموردين في مكان واحد.</p>
        </div>
        <button className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg flex items-center gap-2 self-start md:self-center">
          <UserPlus className="w-5 h-5" />
          إضافة شخص جديد
        </button>
      </div>

      {/* Filters and Search */}
      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="ابحث بالاسم..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
            />
          </div>
          <div className={`flex items-center p-1 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
             <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600/50'}`}>الكل</button>
             <button onClick={() => setFilterType('customer')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${filterType === 'customer' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600/50'}`}><Users size={16}/> عملاء</button>
             <button onClick={() => setFilterType('supplier')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${filterType === 'supplier' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600/50'}`}><Building size={16}/> موردين</button>
          </div>
        </div>
      </div>
      
      {/* People Table */}
      <div className={`rounded-xl border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className={`text-xs ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
              <tr>
                <th scope="col" className="p-4 w-10"></th>
                <th scope="col" className="p-4">الاسم</th>
                <th scope="col" className="p-4">رقم الهاتف</th>
                <th scope="col" className="p-4">تاريخ الانضمام</th>
                <th scope="col" className="p-4">الحالة</th>
                <th scope="col" className="p-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeople.map(person => (
                <React.Fragment key={person.id}>
                  <tr className={`border-b ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                    <td className="p-4">
                      {person.type === 'customer' && person.orderHistory.length > 0 && (
                        <button onClick={() => setExpandedRow(expandedRow === person.id ? null : person.id)}>
                          <ChevronDown className={`w-5 h-5 transition-transform ${expandedRow === person.id ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${person.type === 'customer' ? 'bg-blue-500' : 'bg-purple-500'}`}>{person.name.charAt(0)}</div>
                            <div>
                                {person.name}
                                <div className="text-xs text-slate-500">{person.email}</div>
                            </div>
                        </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{person.phone}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{person.joinDate}</td>
                    <td className="p-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusPill(person.status)}`}>{person.status === 'Active' ? 'نشط' : 'غير نشط'}</span></td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:underline">التفاصيل</button>
                    </td>
                  </tr>
                  <AnimatePresence>
                  {expandedRow === person.id && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={6} className={`p-4 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                        <h4 className="font-bold mb-2 text-slate-800 dark:text-slate-200">سجل الطلبات الأخير</h4>
                        {person.orderHistory.length > 0 ? (
                           <table className="w-full text-xs">
                             <thead className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                               <tr><th className="p-2">رقم الطلب</th><th className="p-2">التاريخ</th><th className="p-2">الإجمالي</th><th className="p-2">الحالة</th></tr>
                             </thead>
                             <tbody>
                               {person.orderHistory.map(order => (
                                 <tr key={order.orderId} className={`border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                                   <td className="p-2">{order.orderId}</td>
                                   <td className="p-2">{order.date}</td>
                                   <td className="p-2">{order.total} {person.type === 'customer' && 'جنيه'}</td>
                                   <td className="p-2"><span className={`px-2 py-0.5 rounded-full ${getStatusPill(order.status)}`}>{order.status}</span></td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                        ): (
                            <p className="text-xs text-slate-500">لا يوجد سجل طلبات لهذا العميل.</p>
                        )}
                      </td>
                    </motion.tr>
                  )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {filteredPeople.length === 0 && (
             <div className="text-center py-12 text-slate-500">
                <Users size={40} className="mx-auto mb-2"/>
                <h3 className="font-bold">لم يتم العثور على نتائج</h3>
                <p className="text-sm">جرّب تغيير كلمات البحث أو الفلتر.</p>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default People;