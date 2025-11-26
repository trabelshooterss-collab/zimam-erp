import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, FileText, Settings, Phone, BookOpen, Users, Truck, ShoppingBag, Landmark, Bot, MessageCircle } from 'lucide-react';
import { useLanguage } from '../i18n';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, onTabChange }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'ai_assistant', label: t('ai_assistant_menu'), icon: Bot },
    { id: 'pos', label: t('pos'), icon: ShoppingCart },
    { id: 'inventory', label: t('inventory'), icon: Package },
    { id: 'invoices', label: t('invoices'), icon: FileText },
    { id: 'purchases', label: t('purchases'), icon: ShoppingBag },
    { id: 'customers', label: t('customers'), icon: Users },
    { id: 'suppliers', label: t('suppliers'), icon: Truck },
    { id: 'accounting', label: t('accounting'), icon: Landmark },
    { id: 'whatsapp', label: t('whatsapp'), icon: Phone },
    { id: 'roadmap', label: t('roadmap'), icon: BookOpen },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside className={`
      fixed start-0 top-16 h-[calc(100vh-4rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-e border-gray-100 dark:border-slate-800 z-20 transition-all duration-300 flex flex-col shadow-soft
      ${isOpen ? 'w-64' : 'w-0 md:w-20 overflow-hidden'}
    `}>
      {/* Menu Items */}
      <nav className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden
                ${isActive 
                  ? 'text-primary-700 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'}
              `}
            >
              {isActive && (
                 <div className="absolute start-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-e-full"></div>
              )}
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300'}`} />
              <span className={`whitespace-nowrap ${!isOpen && 'md:hidden'}`}>{item.label}</span>
              
              {isActive && <div className="absolute inset-0 bg-primary-500/5 dark:bg-primary-500/10 rounded-2xl animate-pulse"></div>}
            </button>
          );
        })}
      </nav>
      
      {/* Developer Footer */}
      <div className={`p-4 mt-auto border-t border-gray-50 dark:border-slate-800 ${!isOpen && 'md:hidden'}`}>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden group shadow-lg">
            {/* Shine effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                   <Settings className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                   <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{t('dev_by')}</p>
                   <p className="text-sm font-bold text-white">{t('dev_name')}</p>
                </div>
            </div>
            
            <a href="https://wa.me/201228252096" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-900 bg-white hover:bg-blue-50 p-2.5 rounded-xl transition-colors w-full">
                <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                <span dir="ltr">Contact Dev</span>
            </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;