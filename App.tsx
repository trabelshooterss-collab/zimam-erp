import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, FileText, Users, Calculator, Settings as SettingsIcon,
  Lock, Mail, Globe, LogOut, Package, BrainCircuit, Wifi, Wrench, ArrowRight, BarChart2
} from 'lucide-react';

// Contexts
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth, UserRole } from './context/AuthContext';

// Pages & Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Invoices from './components/Purchases'; // Renamed conceptually
import InvoicePage from './components/InvoicePage';
import Accounting from './components/Accounting';
import SmartAssistant from './components/SmartAssistant';
import VirtualCFO from './components/VirtualCFO';
import People from './components/People';
import Settings from './components/Settings';
import WelcomePage from './components/WelcomePage';
import SubscriptionPlans from './components/SubscriptionPlans';
import PrivacyPage from './components/PrivacyPage';
import HelpCenterPage from './components/HelpCenterPage';
import WorkOrders from './components/WorkOrders';
import ReportsPage from './components/Reports';
import SmartMarketingPage from './components/SmartMarketingPage';
import SmartInventoryPage from './components/SmartInventoryPage';

type Page = 'welcome' | 'subscriptions' | 'privacy' | 'help' | 'app' | 'login';

const Login = ({ navigate }: { navigate: (page: Page) => void }) => {
  const { setLanguage, language, t } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@zimam.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [bars, setBars] = useState([30, 50, 40, 70, 50]);

  useEffect(() => {
    const i = setInterval(() => setBars(p => p.map(() => Math.floor(Math.random() * 60) + 20)), 1000);
    return () => clearInterval(i);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const mockAdminUser = { id: 'user-001', name: 'Mohamed Said', email: 'trabelshooterss@gmail.com', role: 'admin' as 'admin' };
      login(mockAdminUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="w-full max-w-5xl h-auto md:h-[750px] bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/5 flex flex-col md:flex-row overflow-hidden z-10 relative shadow-2xl mx-4">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative order-2 md:order-1">
          <div className="flex justify-between items-center"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold" onClick={() => navigate('welcome')}>Z</div><button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm bg-white/5 px-3 py-1 rounded-full transition-colors"><Globe size={14} /> {language.toUpperCase()}</button></div>
          <div className="max-w-sm mx-auto w-full py-6"><h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{t('login_title')}</h1><p className="text-slate-400 mb-8">{t('login_subtitle')}</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">{t('email_label')}</label><div className="relative"><Mail className="absolute top-3 left-4 text-slate-500 w-5" /><input type="email" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500" placeholder="admin@zimam.com" value={email} onChange={e => setEmail(e.target.value)} /></div></div>
              <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">{t('password_label')}</label><div className="relative"><Lock className="absolute top-3 left-4 text-slate-500 w-5" /><input type="password" className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></div></div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold mt-4">{isLoading ? '...' : t('login_btn')}</button>
            </form>
          </div>
          <div className="text-center text-xs text-slate-500">
            <button onClick={() => navigate('privacy')} className="hover:text-white">{t('privacy_policy')}</button> | <button onClick={() => navigate('help')} className="hover:text-white">{t('help_center_title')}</button>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 bg-[#080808] relative items-center justify-center p-12 order-1 md:order-2"><div className="glass-card bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md"><div className="flex justify-between mb-6 border-b border-white/5 pb-4"><span className="text-green-500 text-sm font-mono">SYSTEM: ONLINE</span><Wifi size={16} className="text-blue-500" /></div><div className="flex items-end justify-between h-16 gap-1">{bars.map((h, i) => (<motion.div key={i} animate={{ height: `${h}%` }} className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm opacity-80" />))}</div></div></div>
      </div>
    </motion.div>
  );
};

const MainLayout = ({ navigate }: { navigate: (page: Page) => void }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  
  const allMenuItems = useMemo(() => [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['admin', 'manager', 'accountant'] },
    { id: 'reports', label: 'التقارير', icon: BarChart2, roles: ['admin', 'manager'] },
    { id: 'pos', label: t('pos'), icon: ShoppingCart, roles: ['admin', 'manager', 'employee'] },
    { id: 'inventory', label: 'المخزون والمنتجات', icon: Package, roles: ['admin', 'manager', 'employee'] },
    { id: 'work-orders', label: 'أوامر العمل', icon: Wrench, roles: ['admin', 'manager', 'technician', 'employee'] },
    { id: 'invoices', label: 'الفواتير', icon: FileText, roles: ['admin', 'manager', 'accountant'] },
    { id: 'accounting', label: 'الإدارة المالية', icon: Calculator, roles: ['admin', 'manager', 'accountant'] },
    { id: 'people', label: t('people'), icon: Users, roles: ['admin', 'manager'] },
    { id: 'smart-marketing', label: 'التسويق الذكي', icon: Zap, roles: ['admin', 'manager'] },
    { id: 'smart-inventory', label: 'الجرد الذكي', icon: Camera, roles: ['admin', 'manager'] },
    { id: 'virtual-cfo', label: 'المدير المالي الافتراضي', icon: BrainCircuit, roles: ['admin'] },
    { id: 'smart-ai', label: 'المستشار الذكي', icon: BrainCircuit, roles: ['admin'] },
    { id: 'settings', label: t('settings'), icon: SettingsIcon, roles: ['admin'] },
  ], [t]);

  const menuItems = useMemo(() => {
    if (user?.role === 'admin') return allMenuItems;
    return allMenuItems.filter(item => item.roles.includes(user?.role as UserRole));
  }, [user, allMenuItems]);

  const [activeTab, setActiveTab] = useState(menuItems.length > 0 ? menuItems[0].id : '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State for invoice view
  const [invoiceView, setInvoiceView] = useState<'list' | 'details'>('list');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setInvoiceView('details');
  };

  const handleBackToList = () => {
    setInvoiceView('list');
    setSelectedInvoiceId(null);
  }

  // Reset to list view when changing main tabs
  useEffect(() => {
    setInvoiceView('list');
    setSelectedInvoiceId(null);
  }, [activeTab]);

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
        <div className="p-4 border-t border-white/5"><button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"><LogOut size={20} /> {isSidebarOpen && <span className="font-medium">{t('logout')}</span>}</button></div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto p-6 relative">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'pos' && <POS />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'work-orders' && <WorkOrders />}
          {activeTab === 'invoices' && (
            invoiceView === 'list' 
              ? <Invoices onViewInvoice={handleViewInvoice} /> 
              : <div>
                  <button onClick={handleBackToList} className="flex items-center gap-2 mb-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    <ArrowRight className="w-4 h-4 transform rotate-180"/> 
                    {t('back_to_invoices')}
                  </button>
                  <InvoicePage />
                </div>
          )}
          {activeTab === 'accounting' && <Accounting />}
          {activeTab === 'people' && <People />}
          {activeTab === 'smart-marketing' && <SmartMarketingPage />}
          {activeTab === 'smart-inventory' && <SmartInventoryPage />}
          {activeTab === 'virtual-cfo' && <VirtualCFO />}
          {activeTab === 'smart-ai' && <SmartAssistant />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('welcome');

  const navigate = (page: Page) => setCurrentPage(page);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('app');
    } else {
      if (currentPage === 'app') {
        setCurrentPage('login');
      }
    }
  }, [isAuthenticated, currentPage]);
  
  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage onStart={() => navigate('subscriptions')} />;
      case 'subscriptions':
        return <SubscriptionPlans onSubscribe={() => navigate('login')} />;
      case 'privacy':
        return <PrivacyPage />;
      case 'help':
        return <HelpCenterPage />;
      case 'login':
        return <Login navigate={navigate} />;
      case 'app':
        return isAuthenticated ? <MainLayout navigate={navigate} /> : <Login navigate={navigate} />;
      default:
        return <WelcomePage onStart={() => navigate('subscriptions')} />;
    }
  };

  return (
    <div className="App h-full font-sans">
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;