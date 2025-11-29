import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Package, Edit, Trash2, MoreVertical, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: 'Rims' | 'Tires' | 'Oils' | 'Filters';
  stock: number;
  price: number;
  image: string;
}

const mockInventory: Product[] = [
  { id: 1, name: 'جنط ألمنيوم رياضي 18"', sku: 'ZM-RIM-001', category: 'Rims', stock: 15, price: 1200, image: 'https://picsum.photos/seed/rim1/100/100.jpg' },
  { id: 2, name: 'إطار ميشلان Primacy 4', sku: 'MC-TIRE-004', category: 'Tires', stock: 32, price: 850, image: 'https://picsum.photos/seed/tire1/100/100.jpg' },
  { id: 3, name: 'زيت محرك كاسترول 5W-30', sku: 'CS-OIL-002', category: 'Oils', stock: 4, price: 250, image: 'https://picsum.photos/seed/oil1/100/100.jpg' },
  { id: 4, name: 'فلتر هواء رياضي K&N', sku: 'KN-FLTR-008', category: 'Filters', stock: 25, price: 350, image: 'https://picsum.photos/seed/filter1/100/100.jpg' },
  { id: 5, name: 'جنط أسود لامع 19"', sku: 'ZM-RIM-002', category: 'Rims', stock: 0, price: 1800, image: 'https://picsum.photos/seed/rim2/100/100.jpg' },
  { id: 6, name: 'إطار بريدجستون Turanza', sku: 'BG-TIRE-001', category: 'Tires', stock: 18, price: 950, image: 'https://picsum.photos/seed/tire2/100/100.jpg' },
];

const Inventory: React.FC = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (filter === 'all') return true;
        if (filter === 'low_stock') return p.stock > 0 && p.stock <= 5;
        if (filter === 'out_of_stock') return p.stock === 0;
        return p.category === filter;
      })
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm, filter]);

  const getStatus = (stock: number): { text: string; color: string; icon: JSX.Element } => {
    if (stock === 0) return { text: 'نفذ المخزون', color: 'text-red-500', icon: <XCircle size={14}/> };
    if (stock <= 5) return { text: 'مخزون منخفض', color: 'text-orange-500', icon: <AlertTriangle size={14}/> };
    return { text: 'متوفر', color: 'text-green-500', icon: <CheckCircle size={14}/> };
  };
  
  const lowStockCount = useMemo(() => products.filter(p => p.stock > 0 && p.stock <= 5).length, [products]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">إدارة المخزون</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">عرض وإدارة جميع منتجاتك.</p>
        </div>
        <button className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg flex items-center gap-2 self-start md:self-center">
          <Plus className="w-5 h-5" />
          إضافة منتج جديد
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`}><h4 className="text-sm text-slate-500">إجمالي المنتجات</h4><p className="text-2xl font-bold dark:text-white">{products.length}</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`}><h4 className="text-sm text-slate-500">أصناف فريدة</h4><p className="text-2xl font-bold dark:text-white">{[...new Set(products.map(p => p.category))].length}</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`}><h4 className="text-sm text-slate-500">قيمة المخزون</h4><p className="text-2xl font-bold dark:text-white">{products.reduce((acc, p) => acc + p.price * p.stock, 0).toLocaleString()} {t('currency')}</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-orange-900/50' : 'bg-orange-50'} border-orange-200`}><h4 className="text-sm text-orange-600 dark:text-orange-400">تحت حد الطلب</h4><p className="text-2xl font-bold text-orange-600 dark:text-orange-300">{lowStockCount}</p></div>
      </div>

      {/* Filters and Search */}
      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="ابحث بالاسم أو SKU..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`} />
          </div>
          <div className="flex items-center p-1 rounded-lg overflow-x-auto pb-2">
            <button onClick={() => setFilter('all')} className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'dark:text-slate-300'}`}>الكل</button>
            <button onClick={() => setFilter('low_stock')} className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'low_stock' ? 'bg-orange-500 text-white' : 'dark:text-slate-300'}`}>مخزون منخفض</button>
            <button onClick={() => setFilter('out_of_stock')} className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'out_of_stock' ? 'bg-red-500 text-white' : 'dark:text-slate-300'}`}>نفذ المخزون</button>
            <button onClick={() => setFilter('Rims')} className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'Rims' ? 'bg-slate-500 text-white' : 'dark:text-slate-300'}`}>جنوط</button>
            <button onClick={() => setFilter('Tires')} className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'Tires' ? 'bg-slate-500 text-white' : 'dark:text-slate-300'}`}>إطارات</button>
            <button onClick={() => setFilter('Oils')} className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md ${filter === 'Oils' ? 'bg-slate-500 text-white' : 'dark:text-slate-300'}`}>زيوت</button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className={`rounded-xl border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className={`text-xs ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
              <tr>
                <th scope="col" className="p-4">المنتج</th>
                <th scope="col" className="p-4">SKU</th>
                <th scope="col" className="p-4">التصنيف</th>
                <th scope="col" className="p-4">المخزون</th>
                <th scope="col" className="p-4">السعر</th>
                <th scope="col" className="p-4">الحالة</th>
                <th scope="col" className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className={`border-b ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{p.sku}</td>
                  <td className="p-4 text-slate-500">{p.category}</td>
                  <td className="p-4 font-medium dark:text-white">{p.stock}</td>
                  <td className="p-4 font-medium text-blue-600 dark:text-blue-400">{p.price.toLocaleString()} {t('currency')}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${getStatus(p.stock).color}`}>
                      {getStatus(p.stock).icon}
                      {getStatus(p.stock).text}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                       <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"><Edit size={16}/></button>
                       <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
             <div className="text-center py-12 text-slate-500">
                <Package size={40} className="mx-auto mb-2"/>
                <h3 className="font-bold">لا توجد منتجات مطابقة</h3>
                <p className="text-sm">جرّب تغيير كلمات البحث أو الفلتر.</p>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Inventory;