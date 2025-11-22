
import React, { useState } from 'react';
import { Users, Phone, Mail, MapPin, MoreVertical, Plus, Truck, X } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useStore } from '../context/StoreContext';
import { Person } from '../types';

interface PeopleProps {
  type: 'customer' | 'supplier';
}

const People: React.FC<PeopleProps> = ({ type }) => {
  const { t } = useLanguage();
  const { people, addPerson } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: '', phone: '', email: '', address: '' });

  const data = people.filter(p => p.type === type);
  
  const title = type === 'customer' ? t('customers') : t('suppliers');
  const addBtn = type === 'customer' ? t('add_customer') : t('add_supplier');
  const Icon = type === 'customer' ? Users : Truck;
  const balanceLabel = type === 'customer' ? t('receivable') : t('payable');

  const handleAdd = () => {
    const person: Person = {
        id: `${type === 'customer' ? 'C' : 'S'}${Date.now()}`,
        type,
        name: newPerson.name,
        phone: newPerson.phone,
        email: newPerson.email,
        address: newPerson.address,
        balance: 0
    };
    addPerson(person);
    setIsModalOpen(false);
    setNewPerson({ name: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-xl text-primary-600">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-500 text-sm">{data.length} {title}</p>
          </div>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {addBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((person) => (
          <div key={person.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{person.name}</h3>
                  <span className="text-xs text-gray-400">ID: #{person.id}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                {person.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                {person.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {person.address}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500 uppercase">{balanceLabel}</span>
              <span className={`font-bold ${person.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {person.balance.toLocaleString()} {t('currency_sar')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Person Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">{addBtn}</h2>
                    <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="space-y-4">
                    <input 
                        placeholder={t('name')} 
                        className="w-full rounded-lg border-gray-300"
                        value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})}
                    />
                    <input 
                        placeholder={t('phone')} 
                        className="w-full rounded-lg border-gray-300"
                        value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})}
                    />
                    <input 
                        placeholder={t('email')} 
                        className="w-full rounded-lg border-gray-300"
                        value={newPerson.email} onChange={e => setNewPerson({...newPerson, email: e.target.value})}
                    />
                    <input 
                        placeholder="Address" 
                        className="w-full rounded-lg border-gray-300"
                        value={newPerson.address} onChange={e => setNewPerson({...newPerson, address: e.target.value})}
                    />
                </div>
                <div className="mt-6 flex gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">{t('cancel')}</button>
                    <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{t('create')}</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default People;
