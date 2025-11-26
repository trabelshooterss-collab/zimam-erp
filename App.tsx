import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingCart, FileText, Users, Calculator, Settings as SettingsIcon, 
  Power, ArrowRight, Lock, Mail, Globe, LogOut, Smartphone,
  Server, Wifi, Package, BrainCircuit // أيقونات جديدة
} from 'lucide-react';

// Contexts
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
// import { InventoryProvider } from './context/InventoryContext'; // تم حذف هذا السياق

// Components
import Navbar from './components/Navbar';
// import Dashboard from './components/Dashboard'; // تم حذف هذا المكون
import POS from './components/POS';
import Inventory from './components/Inventory';
import Accounting from './components/Accounting'; // <-- جديد
import SmartAssistant from './components/SmartAssistant'; // <-- جديد
import Purchases from './components/Purchases';
import People from './components/People';
import Settings from './components/Settings';

// ... (IntroScreen & Login code remains same as before to save space, but include it in your file)
// سأضع الكود المختصر هنا، انسخ نفس الـ IntroScreen و Login من رد سابق إذا كانوا عندك، أو أطلبهم وسأعيدهم.
// لكن التغيير الأهم في MainLayout:

const IntroScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
    <motion.div animate={{ boxShadow: ["0 0 20px rgba(37,99,235,0.2)", "0 0 60px rgba(37,99,235,0.6)", "0 0 20px rgba(37,99,235,0.2)"] }} transition={{ repeat: Infinity, duration: 2 }} className="relative w-28 h-28 rounded-full bg-black border border-blue-500/50 flex items-center justify-center mb-10 z-10"><Power className="w-12 h-12 text-blue-500" /></motion.div>
    <h1 className="text-5xl font-bold mb-4 tracking-[0.2em] z-10 font-sans">ZIMAM <span className="text-blue-500">AI</span></h1>
    <button onClick={onStart} className="group relative px-10 py-4 bg-white text-black rounded-full font-bold overflow-hidden transition-all hover:scale-105 z-10"><span className="relative z-10 flex items-center gap-3">تهيئة النظام <ArrowRight size={20} /></span><div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div></button>
  </motion.div>
);

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const { setLanguage, language, t } = useLanguage(); 
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bars, setBars] = useState([30, 50, 40, 70, 50]);
  useEffect(() => { const i = setInterval(() => setBars(p => p.map(() => Math.floor(Math.random() * 60) + 20)), 1000); return () => clearInterval(i); }, []);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setIsLoading(true); setTimeout(() => { setIsLoading(false); onLogin(); }, 1000); };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="w-full max-w-5xl h-auto md:h-[750px] bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/5 flex flex-col md:flex-row overflow-hidden z-10 relative shadow-2xl mx-4">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative order-2 md:order-1">
          <div className="flex justify-between items-center"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">Z</div><button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm bg-white/5 px-3 py-1 rounded-full transition-colors"><Globe size={14} /> {language.toUpperCase()}</button></div>
          <div className="max-w-sm mx-auto w-full py-6"><h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{t('login_title')}</h1><p className="text-slate-400 mb-8">{t('login_subtitle')}</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">{t('email_label')}</label><div className="relative"><Mail className="absolute top-3 left-4 text-slate-500 w-5" /><input type="email" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500" placeholder="admin@zimam.com" value={email} onChange={e => setEmail(e.target.value)} /></div></div>
              <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">{t('password_label')}</label><div className="relative"><Lock className="absolute top-3 left-4 text-slate-500 w-5" /><input type="password" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500" placeholder="••••••••" /></div></div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold mt-4">{isLoading ? '...' : t('login_btn')}</button>
            </form>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 bg-[#080808] relative items-center justify-center p-12 order-1 md:order-2"><div className="glass-card bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md"><div className="flex justify-between mb-6 border-b border-white/5 pb-4"><span className="text-green-500 text-sm font-mono">SYSTEM: ONLINE</span><Wifi size={16} className="text-blue-500" /></div><div className="flex items-end justify-between h-16 gap-1">{bars.map((h, i) => (<motion.div key={i} animate={{ height: `${h}%` }} className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm opacity-80"/>))}</div></div></div>
      </div>
    </motion.div>
  );
};

// --- Main Layout with New Routes ---
const MainLayout = ({ onLogout }: { onLogout: () => void }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'smart-ai', label: 'المستشار الذكي', icon: BrainCircuit }, // جديد
    { id: 'pos', label: t('pos'), icon: ShoppingCart },
    { id: 'inventory', label: 'المخزون والمنتجات', icon: Package }, // جديد
    { id: 'accounting', label: 'الإدارة المالية', icon: Calculator }, // جديد
    { id: 'purchases', label: t('purchases'), icon: FileText },
    { id: 'people', label: t('people'), icon: Users },
    { id: 'settings', label: t('settings'), icon: SettingsIcon },
  ];

  return (
    <div className={`flex h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#f8fafc]'}`}>
      <motion.aside animate={{ width: isSidebarOpen ? 280 : 90 }} className={`h-full border-l flex flex-col z-30 shadow-2xl relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="p-6 h-24 flex items-center gap-4"><div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">Z</div>{isSidebarOpen && <h1 className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Zimam ERP</h1>}</div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'dark' ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'}`}`}>
              <item.icon size={22} />{isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5"><button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"><LogOut size={20} /> {isSidebarOpen && <span className="font-medium">{t('logout')}</span>}</button></div>
      </motion.aside>
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto p-6 relative">
          {activeTab === 'dashboard' && <div>لوحة التحكم قيد التطوير</div>}
          {activeTab === 'smart-ai' && <SmartAssistant />} 
          {activeTab === 'pos' && <POS />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'accounting' && <Accounting />}
          {activeTab === 'purchases' && <Purchases />}
          {activeTab === 'people' && <People />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleStartSystem = () => { setIntroFinished(true); };
  
  return (
    <ThemeProvider> 
      <LanguageProvider>
         
          <div className="App h-full font-sans">
            <AnimatePresence mode="wait">
              {!introFinished && <IntroScreen onStart={handleStartSystem} />}
              {introFinished && !isLoggedIn && <Login onLogin={() => setIsLoggedIn(true)} />}
              {introFinished && isLoggedIn && <MainLayout onLogout={() => setIsLoggedIn(false)} />}
            </AnimatePresence>
          </div>
        
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;