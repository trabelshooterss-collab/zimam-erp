import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, FileText, Users, Calculator, Settings as SettingsIcon,
  Lock, Mail, Globe, LogOut, Package, BrainCircuit, Wifi, Wrench, ArrowRight, 
  BarChart2, Zap, Camera, Power, Shield, HelpCircle, CreditCard
} from 'lucide-react';

// Contexts
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { InventoryProvider } from './context/InventoryContext';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Purchases from './components/Purchases'; // الفواتير والمشتريات
import Accounting from './components/Accounting';
import SmartAssistant from './components/SmartAssistant';
import People from './components/People';
import Settings from './components/Settings';

// --- صفحات مؤقتة للأقسام الجديدة (لضمان عمل النظام حالياً) ---
const PlaceholderPage = ({ title, icon: Icon, desc }: any) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center p-6">
    <div className="p-6 bg-slate-100 dark:bg-white/5 rounded-full mb-6"><Icon size={64} className="text-blue-500" /></div>
    <h2 className="text-3xl font-bold mb-3 text-slate-800 dark:text-white">{title}</h2>
    <p className="max-w-md mx-auto">{desc}</p>
    <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">تفعيل الميزة</button>
  </div>
);

// --- شاشة الترحيب (Welcome Page) ---
const WelcomePage = ({ onStart }: { onStart: () => void }) => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
    <div className="z-10 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(37,99,235,0.5)]">
        <span className="text-5xl font-bold">Z</span>
      </motion.div>
      <h1 className="text-6xl font-bold mb-4 tracking-tight">Zimam ERP</h1>
      <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
        الحل المتكامل لإدارة الأعمال الصغيرة والمتوسطة في مصر والسعودية.
        <br /> <span className="text-blue-400">ذكاء اصطناعي. جرد ذكي. تسويق آلي.</span>
      </p>
      
      <div className="flex justify-center gap-6 mb-12">
        <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-all">🍎</div><span className="text-xs text-slate-500">iOS</span></div>
        <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-all">🤖</div><span className="text-xs text-slate-500">Android</span></div>
        <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/50">💻</div><span className="text-xs text-blue-400">Web</span></div>
      </div>

      <button onClick={onStart} className="group relative px-10 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105">
        <span className="relative z-10 flex items-center gap-2">ابدأ الآن مجاناً <ArrowRight /></span>
      </button>
    </div>
    
    <div className="absolute bottom-6 text-slate-600 text-xs">
      Developed by <span className="text-white font-bold">Mohamed Said</span>
    </div>
  </div>
);

// --- شاشة الباقات (Subscription) ---
const SubscriptionPlans = ({ onSubscribe }: { onSubscribe: () => void }) => (
  <div className="min-h-screen bg-[#050505] text-white py-20 px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">اختر الباقة المناسبة لنمو أعمالك</h2>
      <p className="text-slate-400">خطط مرنة تناسب السوق المصري والسعودي والعالمي</p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Basic */}
      <div className="border border-white/10 bg-[#111] p-8 rounded-3xl hover:border-white/20 transition-all">
        <h3 className="text-xl font-bold text-slate-300 mb-2">الأساسية (Starter)</h3>
        <div className="text-4xl font-bold mb-6">49 <span className="text-lg text-slate-500 font-normal">ريال/شهر</span></div>
        <ul className="space-y-3 text-slate-400 mb-8 text-sm">
          <li className="flex gap-2">✓ إدارة المخزون (محدود)</li>
          <li className="flex gap-2">✓ نقاط بيع (POS)</li>
          <li className="flex gap-2">✓ 2 مستخدمين</li>
        </ul>
        <button onClick={onSubscribe} className="w-full py-3 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all font-bold">تجربة مجانية</button>
      </div>

      {/* Pro (Recommended) */}
      <div className="border-2 border-blue-600 bg-[#111] p-8 rounded-3xl relative transform md:-translate-y-4 shadow-2xl shadow-blue-900/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">الأكثر طلباً</div>
        <h3 className="text-xl font-bold text-white mb-2">الاحترافية (Pro)</h3>
        <div className="text-4xl font-bold mb-6">149 <span className="text-lg text-slate-500 font-normal">ريال/شهر</span></div>
        <ul className="space-y-3 text-slate-300 mb-8 text-sm">
          <li className="flex gap-2 text-white">✓ كل المميزات الأساسية</li>
          <li className="flex gap-2 text-white">✓ الجرد بالكاميرا (AI)</li>
          <li className="flex gap-2 text-white">✓ التسويق الذكي</li>
          <li className="flex gap-2 text-white">✓ 10 مستخدمين</li>
        </ul>
        <button onClick={onSubscribe} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all font-bold text-white">اشترك الآن</button>
      </div>

      {/* Enterprise */}
      <div className="border border-white/10 bg-[#111] p-8 rounded-3xl hover:border-white/20 transition-all">
        <h3 className="text-xl font-bold text-slate-300 mb-2">العالمية (Global)</h3>
        <div className="text-4xl font-bold mb-6">399 <span className="text-lg text-slate-500 font-normal">ريال/شهر</span></div>
        <ul className="space-y-3 text-slate-400 mb-8 text-sm">
          <li className="flex gap-2">✓ مستخدمين لا محدود</li>
          <li className="flex gap-2">✓ ربط بوابات الدفع</li>
          <li className="flex gap-2">✓ تطبيق جوال خاص</li>
          <li className="flex gap-2">✓ مدير مالي افتراضي</li>
        </ul>
        <button onClick={onSubscribe} className="w-full py-3 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all font-bold">تواصل للمبيعات</button>
      </div>
    </div>
  </div>
);

// --- Login Page ---
const Login = ({ onLogin }: { onLogin: () => void }) => {
  const { setLanguage, language, t } = useLanguage();
  const [email, setEmail] = useState('admin@zimam.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onLogin(); }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="w-full max-w-5xl h-auto md:h-[700px] bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/5 flex flex-col md:flex-row overflow-hidden z-10 relative shadow-2xl mx-4">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative order-2 md:order-1">
          <div className="flex justify-between items-center"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">Z</div><button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm bg-white/5 px-3 py-1 rounded-full transition-colors"><Globe size={14} /> {language.toUpperCase()}</button></div>
          <div className="max-w-sm mx-auto w-full py-6"><h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{t('login_title')}</h1><p className="text-slate-400 mb-8">{t('login_subtitle')}</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">{t('email_label')}</label><div className="relative"><Mail className="absolute top-3 left-4 text-slate-500 w-5" /><input type="email" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500" placeholder="admin@zimam.com" value={email} onChange={e => setEmail(e.target.value)} /></div></div>
              <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">{t('password_label')}</label><div className="relative"><Lock className="absolute top-3 left-4 text-slate-500 w-5" /><input type="password" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div></div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold mt-4">{isLoading ? '...' : t('login_btn')}</button>
            </form>
          </div>
          <div className="flex justify-between text-xs text-slate-500 pt-4 border-t border-white/5">
             <span>Privacy Policy</span><span>Help Center</span>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 bg-[#080808] relative items-center justify-center p-12 order-1 md:order-2"><div className="glass-card bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md"><div className="flex justify-between mb-6 border-b border-white/5 pb-4"><span className="text-green-500 text-sm font-mono">SYSTEM: ONLINE</span><Wifi size={16} className="text-blue-500" /></div><div className="h-24 flex items-center justify-center text-slate-500 text-sm">Real-time Data Visualization</div></div></div>
      </div>
    </motion.div>
  );
};

// --- Main Layout ---
const MainLayout = ({ onLogout }: { onLogout: () => void }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // القائمة الكاملة حسب طلبك
  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'pos', label: t('pos'), icon: ShoppingCart },
    { id: 'inventory', label: 'المخزون والمنتجات', icon: Package },
    { id: 'smart-marketing', label: 'التسويق الذكي', icon: Zap }, // جديد
    { id: 'smart-inventory', label: 'الجرد الذكي (كاميرا)', icon: Camera }, // جديد
    { id: 'work-orders', label: 'أوامر العمل', icon: Wrench }, // جديد
    { id: 'invoices', label: 'الفواتير والدفع', icon: FileText },
    { id: 'smart-ai', label: 'المستشار الذكي', icon: BrainCircuit },
    { id: 'accounting', label: 'الإدارة المالية', icon: Calculator },
    { id: 'people', label: t('people'), icon: Users },
    { id: 'reports', label: 'التقارير المتقدمة', icon: BarChart2 }, // جديد
    { id: 'settings', label: t('settings'), icon: SettingsIcon },
  ];

  return (
    <div className={`flex h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#f8fafc]'}`}>
      <motion.aside animate={{ width: isSidebarOpen ? 280 : 90 }} className={`h-full border-l flex flex-col z-30 shadow-2xl relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="p-6 h-24 flex items-center gap-4"><div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">Z</div>{isSidebarOpen && <h1 className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Zimam ERP</h1>}</div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'dark' ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'}`}`}>
              <item.icon size={20} />{isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5"><button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"><LogOut size={20} /> {isSidebarOpen && <span className="font-medium">{t('logout')}</span>}</button></div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto p-6 relative">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'pos' && <POS />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'invoices' && <Purchases />} {/* الفواتير */}
          {activeTab === 'accounting' && <Accounting />}
          {activeTab === 'smart-ai' && <SmartAssistant />}
          {activeTab === 'people' && <People />}
          {activeTab === 'settings' && <Settings />}
          {/* الصفحات الجديدة (حالياً Placeholder) */}
          {activeTab === 'smart-marketing' && <PlaceholderPage title="التسويق الذكي" icon={Zap} desc="اقتراح حملات تسويقية تلقائية بناءً على حالة المخزون." />}
          {activeTab === 'smart-inventory' && <PlaceholderPage title="الجرد الذكي بالكاميرا" icon={Camera} desc="استخدم كاميرا الموبايل لعد المنتجات ومقارنتها بالمخزون." />}
          {activeTab === 'work-orders' && <PlaceholderPage title="أوامر العمل" icon={Wrench} desc="تتبع عمليات الصيانة والتشغيل وتعيين الموظفين." />}
          {activeTab === 'reports' && <PlaceholderPage title="التقارير المتقدمة" icon={BarChart2} desc="تحليلات الأرباح والخسائر وتوقعات الذكاء الاصطناعي." />}
        </main>
      </div>
    </div>
  );
};

// --- App Root ---
function App() {
  const [appState, setAppState] = useState<'welcome' | 'plans' | 'login' | 'app'>('welcome');

  return (
    <ThemeProvider> 
      <LanguageProvider>
        <InventoryProvider> 
          <div className="App h-full font-sans">
            <AnimatePresence mode="wait">
              {appState === 'welcome' && <WelcomePage onStart={() => setAppState('plans')} />}
              {appState === 'plans' && <SubscriptionPlans onSubscribe={() => setAppState('login')} />}
              {appState === 'login' && <Login onLogin={() => setAppState('app')} />}
              {appState === 'app' && <MainLayout onLogout={() => setAppState('login')} />}
            </AnimatePresence>
          </div>
        </InventoryProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;