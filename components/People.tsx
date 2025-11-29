import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Phone, Mail, MapPin, MoreHorizontal, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const People: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    { id: 1, name: 'محمد أحمد', type: 'VIP', phone: '0501234567', email: 'mohamed@email.com', orders: 12, totalSpent: 15400, lastOrder: '2025-11-20' },
    { id: 2, name: 'شركة المقاولات الحديثة', type: 'Corporate', phone: '0112345678', email: 'info@modern-co.com', orders: 5, totalSpent: 45000, lastOrder: '2025-11-18' },
    { id: 3, name: 'سارة علي', type: 'Regular', phone: '0559876543', email: 'sara@email.com', orders: 3, totalSpent: 1200, lastOrder: '2025-11-25' },
  ];

  return (
    <div className="h-full pb-20 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>العملاء (CRM)</h1>
          <p className="text-slate-500">سجل بيانات العملاء وتاريخ تعاملاتهم.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
          <Plus size={20} /> عميل جديد
        </button>
      </div>

      {/* Search */}
      <div className={`p-4 rounded-2xl mb-6 ${theme === 'dark' ? 'bg-[#111]' : 'bg-white border border-slate-200'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <Search className="text-slate-400" />
          <input 
            type="text" 
            placeholder="بحث بالاسم، الرقم، أو البريد..." 
            className="bg-transparent border-none outline-none w-full text-sm text-slate-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c) => (
          <motion.div 
            key={c.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-3xl border relative group cursor-pointer hover:shadow-xl transition-all ${theme === 'dark' ? 'bg-[#111] border-white/10 hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-200'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{c.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.type === 'VIP' ? 'bg-gold-500/10 text-yellow-500' : 'bg-slate-500/10 text-slate-500'}`}>{c.type}</span>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white"><MoreHorizontal size={20} /></button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Phone size={16} /> <span>{c.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Mail size={16} /> <span>{c.email}</span>
              </div>
            </div>

            <div className={`pt-4 border-t flex justify-between items-center ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
               <div className="text-center">
                 <p className="text-xs text-slate-500">إجمالي الطلبات</p>
                 <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{c.orders}</p>
               </div>
               <div className="text-center">
                 <p className="text-xs text-slate-500">مجموع المشتريات</p>
                 <p className="font-bold text-green-500">{c.totalSpent.toLocaleString()} ر.س</p>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default People;