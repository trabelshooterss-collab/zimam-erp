import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, 
  Smartphone, Shirt, Watch, Calculator, X, Printer, CheckCircle,
  User, PauseCircle, PackageOpen // أيقونة جديدة للمخزون
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// --- تحديث البيانات: إضافة المخزون (stock) ---
const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: ShoppingCart },
  { id: 'electronics', name: 'إلكترونيات', icon: Smartphone },
  { id: 'fashion', name: 'أزياء', icon: Shirt },
  { id: 'accessories', name: 'إكسسوارات', icon: Watch },
];

const PRODUCTS = [
  { id: 1, name: 'iPhone 15 Pro', price: 4500, stock: 3, category: 'electronics', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&q=80' },
  { id: 2, name: 'MacBook Air M2', price: 5200, stock: 0, category: 'electronics', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80' }, // منتهي
  { id: 3, name: 'ساعة ذكية Ultra', price: 850, stock: 12, category: 'accessories', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80' },
  { id: 4, name: 'سماعة رأس Sony', price: 350, stock: 5, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
  { id: 5, name: 'تيشيرت قطني', price: 80, stock: 50, category: 'fashion', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { id: 6, name: 'حذاء رياضي', price: 240, stock: 2, category: 'fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
];

const POS: React.FC = () => {
  const { theme } = useTheme();
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // States للميزات الإضافية
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [heldOrders, setHeldOrders] = useState<any[]>([]);
  const [customer, setCustomer] = useState('عميل نقدي');

  const playBeep = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/571/571-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  // --- إضافة للسلة مع التحقق من المخزون ---
  const addToCart = (product: any) => {
    if (product.stock <= 0) return; // منع الإضافة إذا انتهى المخزون

    // التأكد أن الكمية في السلة لا تتجاوز المخزون
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem && existingItem.qty >= product.stock) {
      alert("نفذت الكمية المتاحة في المخزون!");
      return;
    }

    playBeep();
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1, discount: 0 }];
    });
  };

  const updateCartItem = (id: number, newPrice: number, newQty: number, newDiscount: number) => {
    // هنا أيضاً يمكن إضافة تحقق من المخزون قبل التحديث
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, price: newPrice, qty: newQty, discount: newDiscount } : item
    ));
    setEditingItem(null);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
    setEditingItem(null);
  };

  const holdOrder = () => {
    if (cart.length === 0) return;
    const order = { id: Date.now(), items: cart, customer, time: new Date().toLocaleTimeString() };
    setHeldOrders([...heldOrders, order]);
    setCart([]);
  };

  const recallOrder = (order: any) => {
    setCart(order.items);
    setCustomer(order.customer);
    setHeldOrders(heldOrders.filter(o => o.id !== order.id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (item.discount * item.qty), 0);
  const tax = (subtotal - totalDiscount) * 0.15;
  const total = (subtotal - totalDiscount) + tax;

  const filteredProducts = PRODUCTS.filter(p => 
    (selectedCategory === 'all' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 pb-4 overflow-hidden font-sans">
      
      {/* المنتجات */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* البحث والطلبات المعلقة */}
        <div className="flex justify-between items-center gap-4">
          <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border focus-within:ring-2 focus-within:ring-blue-500 transition-all
            ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
            <Search className="text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              className="bg-transparent border-none outline-none w-full text-sm text-slate-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {heldOrders.length > 0 && (
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-3 bg-orange-500/10 text-orange-500 rounded-2xl border border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all">
                <PauseCircle size={20} />
                <span className="font-bold">{heldOrders.length}</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#111] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 p-2 hidden group-hover:block z-50">
                {heldOrders.map(order => (
                  <div key={order.id} onClick={() => recallOrder(order)} className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg cursor-pointer flex justify-between">
                    <span className="text-xs font-bold">#{order.id.toString().slice(-4)}</span>
                    <span className="text-xs text-slate-500">{order.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* التصنيفات */}
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all
                ${selectedCategory === cat.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : `${theme === 'dark' ? 'bg-[#111] text-slate-400 hover:bg-white/10' : 'bg-white text-slate-600 hover:bg-slate-50'}`}`}
            >
              <cat.icon size={18} />
              <span className="font-bold text-sm">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* شبكة المنتجات (مع المخزون) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock === 0;
              const isLowStock = product.stock > 0 && product.stock <= 3;

              return (
                <motion.div 
                  key={product.id}
                  whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
                  onClick={() => addToCart(product)}
                  className={`relative group rounded-3xl p-3 border transition-all
                    ${isOutOfStock 
                      ? 'opacity-60 grayscale cursor-not-allowed border-slate-200 dark:border-white/5' 
                      : `cursor-pointer hover:shadow-xl ${theme === 'dark' ? 'bg-[#111] border-white/10 hover:border-blue-500/30' : 'bg-white border-slate-100 hover:border-blue-200'}`
                    }`}
                >
                  {/* شريط المخزون */}
                  <div className={`absolute top-5 left-5 z-10 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1
                    ${isOutOfStock ? 'bg-slate-500 text-white' : isLowStock ? 'bg-red-500 text-white animate-pulse' : 'bg-white/80 dark:bg-black/50 backdrop-blur-sm text-slate-600 dark:text-slate-300'}`}>
                    <PackageOpen size={12} />
                    <span>{isOutOfStock ? 'نفذت الكمية' : `متبقي ${product.stock}`}</span>
                  </div>

                  <div className="h-32 mb-3 overflow-hidden rounded-2xl relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                    {!isOutOfStock && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Plus className="text-white w-8 h-8 drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{product.name}</h3>
                    <p className="text-blue-500 font-bold mt-1">{product.price} ر.س</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* السلة (كما هي) */}
      <div className={`w-full lg:w-[400px] flex flex-col rounded-[2rem] shadow-2xl overflow-hidden border
        ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-100'}`}>
        
        <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-white/5 bg-[#111]' : 'border-slate-100 bg-slate-50'}`}>
           <div className="flex items-center gap-2">
             <div className="p-2 bg-blue-500/10 rounded-full"><User size={18} className="text-blue-500" /></div>
             <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{customer}</span>
           </div>
           <button className="text-xs text-blue-500 hover:underline">تغيير</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <ShoppingCart size={48} className="mb-4" />
              <p>السلة فارغة</p>
            </div>
          ) : (
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => setEditingItem(item)}
                  className={`flex gap-3 p-3 rounded-2xl border cursor-pointer hover:border-blue-500/50 transition-colors
                    ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-100'}`}
                >
                  <img src={item.image} className="w-14 h-14 rounded-xl object-cover bg-white" alt="" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-sm line-clamp-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{item.name}</h4>
                      <span className="text-xs font-bold text-slate-500">x{item.qty}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <p className="text-blue-500 font-bold text-sm">{item.price} ر.س</p>
                        {item.discount > 0 && <p className="text-[10px] text-red-500 line-through">خصم {item.discount} ر.س</p>}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}>
                        {(item.price * item.qty - item.discount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className={`p-6 border-t space-y-4 ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500"><span>المجموع</span><span>{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-red-500"><span>الخصم</span><span>- {totalDiscount.toLocaleString()}</span></div>
            <div className="flex justify-between text-slate-500"><span>الضريبة (15%)</span><span>{tax.toLocaleString()}</span></div>
            <div className={`flex justify-between text-xl font-bold pt-2 border-t ${theme === 'dark' ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}`}>
              <span>الإجمالي</span><span className="text-blue-600">{total.toLocaleString()} ر.س</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
             <button onClick={holdOrder} className="col-span-1 py-3 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl flex items-center justify-center transition-colors" title="تعليق"><PauseCircle size={20} /></button>
             <button onClick={() => setIsCheckingOut(true)} disabled={cart.length === 0} className="col-span-3 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"><CreditCard size={20} /> دفع {total.toLocaleString()}</button>
          </div>
        </div>
      </div>

      {/* نوافذ التعديل والدفع (كما هي - لم تتغير ولكن موجودة في الكود السابق) */}
      <AnimatePresence>
        {editingItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl ${theme === 'dark' ? 'bg-[#151515] text-white border border-white/10' : 'bg-white text-slate-900'}`}>
              <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold">تعديل المنتج</h3><button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button></div>
              <div className="flex items-center gap-4 mb-6"><img src={editingItem.image} className="w-16 h-16 rounded-xl object-cover" alt="" /><div><h4 className="font-bold">{editingItem.name}</h4><p className="text-sm text-slate-500">{editingItem.category}</p></div></div>
              <div className="space-y-4 mb-6">
                 <div><label className="text-xs text-slate-500 mb-1 block">سعر الوحدة</label><div className={`flex items-center px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}><input type="number" value={editingItem.price} onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})} className="bg-transparent w-full outline-none font-bold"/></div></div>
                 <div className="flex gap-4">
                    <div className="flex-1"><label className="text-xs text-slate-500 mb-1 block">الكمية</label><div className={`flex items-center px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}><button onClick={() => setEditingItem({...editingItem, qty: Math.max(1, editingItem.qty - 1)})}><Minus size={16} /></button><input type="number" value={editingItem.qty} readOnly className="bg-transparent w-full outline-none font-bold text-center"/><button onClick={() => setEditingItem({...editingItem, qty: editingItem.qty + 1})}><Plus size={16} /></button></div></div>
                    <div className="flex-1"><label className="text-xs text-slate-500 mb-1 block">خصم (ريال)</label><div className={`flex items-center px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}><input type="number" value={editingItem.discount} onChange={(e) => setEditingItem({...editingItem, discount: Number(e.target.value)})} className="bg-transparent w-full outline-none font-bold text-red-500"/></div></div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3"><button onClick={() => removeFromCart(editingItem.id)} className="py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-colors">حذف</button><button onClick={() => updateCartItem(editingItem.id, editingItem.price, editingItem.qty, editingItem.discount)} className="py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-colors">حفظ التعديلات</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckingOut && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className={`w-full max-w-md rounded-3xl p-8 relative ${theme === 'dark' ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}`}>
              <button onClick={() => setIsCheckingOut(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full"><X size={20} /></button>
              <div className="text-center mb-8"><div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={40} /></div><h2 className="text-2xl font-bold">تأكيد العملية</h2><p className="text-slate-500 mt-1">المبلغ الإجمالي المستحق</p><h1 className="text-4xl font-bold text-blue-500 mt-2">{total.toLocaleString()} ر.س</h1></div>
              <div className="grid grid-cols-2 gap-4 mb-6"><button className={`p-4 rounded-2xl border flex flex-col items-center gap-2 hover:border-blue-500 transition-colors ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}><CreditCard size={24} className="text-purple-500" /><span className="font-bold text-sm">بطاقة مدى</span></button><button className={`p-4 rounded-2xl border flex flex-col items-center gap-2 hover:border-green-500 transition-colors ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}><Calculator size={24} className="text-green-500" /><span className="font-bold text-sm">نقداً (كاش)</span></button></div>
              <button onClick={() => { setIsCheckingOut(false); setCart([]); playBeep(); }} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Printer size={20} /> دفع وطباعة الفاتورة</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default POS;