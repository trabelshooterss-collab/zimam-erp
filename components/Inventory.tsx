import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Package, Edit, Trash2, AlertTriangle, CheckCircle, XCircle, Camera } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useInventory } from '../context/InventoryContext';

const Inventory: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { products, addProduct, updateProduct, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: 'electronics', image: '' });

  // ... (نفس دوال Modal السابقة)
  const openAddModal = () => { setIsModalOpen(true); setFormData({ name: '', price: '', stock: '', category: 'electronics', image: '' }); };
  const handleSave = (e: React.FormEvent) => { e.preventDefault(); addProduct({ name: formData.name, price: Number(formData.price), stock: Number(formData.stock), category: formData.category, image: '', barcode: Date.now().toString() }); setIsModalOpen(false); };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full flex flex-col gap-6 font-sans pb-20">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>المخزون والمنتجات</h1>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all"><Camera size={20} /> جرد بالكاميرا</button>
           <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"><Plus size={20} /> إضافة</button>
        </div>
      </div>
      
      <div className={`p-4 rounded-2xl flex items-center gap-4 ${theme === 'dark' ? 'bg-[#111]' : 'bg-white border border-slate-200'}`}><div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border w-full ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-slate-50 border-slate-200'}`}><Search className="text-slate-400" /><input type="text" placeholder="بحث..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700 dark:text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar">
        {filtered.map(p => (
          <div key={p.id} className={`p-4 rounded-3xl border relative ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-bold ${p.stock <= 5 ? 'bg-red-500 text-white' : 'bg-white/80'}`}>{p.stock} قطعة</div>
            <div className="h-32 mb-3 bg-slate-100 rounded-xl overflow-hidden"><img src={p.image} className="w-full h-full object-cover" alt=""/></div>
            <h3 className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{p.name}</h3>
            <div className="flex justify-between mt-2"><span className="text-blue-500 font-bold">{p.price} ر.س</span><div className="flex gap-2"><button><Edit size={16} className="text-slate-400"/></button><button><Trash2 size={16} className="text-slate-400"/></button></div></div>
          </div>
        ))}
      </div>
      {/* Modal removed for brevity in this response, keep yours */}
    </div>
  );
};
export default Inventory;