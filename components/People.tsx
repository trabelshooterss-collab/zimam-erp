import React, { useState } from 'react';
import { Search, UserPlus, Phone, Mail, MapPin, MoreVertical } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const People = () => {
  const { customers = [] } = useStore(); // حماية المصفوفة
  const [filterType, setFilterType] = useState('all');

  // كود الحماية هنا
  const filteredPeople = customers?.filter(person => {
    if (filterType === 'all') return true;
    return person.type === filterType;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">العملاء والموردين</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          إضافة جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPeople.length === 0 ? (
           <div className="col-span-full text-center py-10 text-slate-500">لا يوجد عملاء مضافين</div>
        ) : (
          filteredPeople.map((person) => (
            <div key={person.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{person.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${person.type === 'customer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {person.type === 'customer' ? 'عميل' : 'مورد'}
                    </span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {person.phone || 'لا يوجد هاتف'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {person.address || 'لا يوجد عنوان'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default People;