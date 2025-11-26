import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit3, Trash2, Package, X, Save, Image as ImageIcon, Printer, Barcode, ClipboardList } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useInventory, Product } from '../context/InventoryContext';

const Inventory: React.FC = () => {
  const { theme } = useTheme();
  const { products, addProduct, updateProduct, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: 'electronics', image: '' });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '', category: 'electronics', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price.toString(), stock: product.stock.toString(), category: product.category, image: product.image });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      image: formData.image || 'https://via.placeholder.com/150',
      barcode: Date.now().toString()
    };
    if (editingProduct) updateProduct(editingProduct.id, productData);
    else addProduct(productData);
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    (filterCategory === 'all' || p.category === filterCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6 font-sans pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>إدارة المخزون</h1>
          <p className="text-slate-500 text-sm">تحكم شامل في المنتجات، الباركود، والكميات.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white rounded-xl font-bold hover:bg-slate-200 transition-all">
             <ClipboardList size={20} /> جرد شامل
           </button>
           <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95">
             <Plus size={20} /> منتج جديد
           </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className={`p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center ${theme === 'dark' ? 'bg-[#111]' : 'bg-white border border-slate-200'}`}>
        <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border w-full ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <Search className="text-slate-400" />
          <input type="text" placeholder="بحث باسم المنتج..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700 dark:text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'electronics', 'fashion', 'accessories'].map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${filterCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`relative group rounded-3xl p-4 border transition-all hover:shadow-xl ${theme === 'dark' ? 'bg-[#111] border-white/10 hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-200'}`}>
              
              {/* Stock Label */}
              <div className={`absolute top-6 left-6 z-10 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 backdrop-blur-md ${product.stock === 0 ? 'bg-red-500/90 text-white' : product.stock < 5 ? 'bg-orange-500/90 text-white' : 'bg-white/80 text-slate-800'}`}>
                <Package size={12} /> <span>{product.stock === 0 ? 'نفذت' : `${product.stock}`}</span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => alert(`Print Barcode for: ${product.barcode}`)} className="p-2 bg-white text-slate-800 rounded-full shadow-lg hover:bg-slate-100" title="طباعة باركود"><Barcode size={16} /></button>
                <button onClick={() => openEditModal(product)} className="p-2 bg-white text-blue-600 rounded-full shadow-lg hover:bg-blue-50"><Edit3 size={16} /></button>
                <button onClick={() => deleteProduct(product.id)} className="p-2 bg-white text-red-600 rounded-full shadow-lg hover:bg-red-50"><Trash2 size={16} /></button>
              </div>

              <div className="h-40 mb-4 overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
              </div>

              <div>
                <h3 className={`font-bold text-lg truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">{product.category}</span>
                  <p className="text-blue-500 font-bold text-lg">{product.price} ر.س</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-3xl p-8 shadow-2xl ${theme === 'dark' ? 'bg-[#151515] text-white border border-white/10' : 'bg-white text-slate-900'}`}>
            <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">{editingProduct ? 'تعديل' : 'إضافة'}</h2><button onClick={() => setIsModalOpen(false)}><X size={24} /></button></div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm font-bold mb-1 text-slate-500">الاسم</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full px-4 py-3 rounded-xl border bg-transparent outline-none ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-1 text-slate-500">السعر</label><input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className={`w-full px-4 py-3 rounded-xl border bg-transparent outline-none ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} /></div>
                <div><label className="block text-sm font-bold mb-1 text-slate-500">الكمية</label><input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className={`w-full px-4 py-3 rounded-xl border bg-transparent outline-none ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} /></div>
              </div>
              <div>
                  <label className="block text-sm font-bold mb-2 text-slate-500">التصنيف</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}>
                    <option value="electronics">إلكترونيات</option><option value="fashion">أزياء</option><option value="accessories">إكسسوارات</option>
                  </select>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mt-4"><Save size={20} /> حفظ</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;