
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
      fixed start-0 top-16 h-[calc(100vh-4rem)] bg-white border-e border-gray-200 z-20 transition-all duration-300 flex flex-col
      ${isOpen ? 'w-64' : 'w-0 md:w-20 overflow-hidden'}
    `}>
      {/* Menu Items */}
      <nav className="p-4 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-200
              ${activeTab === item.id 
                ? 'bg-primary-50 text-primary-700 shadow-sm translate-x-1' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${activeTab === item.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
            <span className={`whitespace-nowrap ${!isOpen && 'md:hidden'}`}>{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Developer Footer */}
      <div className={`p-4 mt-auto border-t border-gray-100 bg-gray-50/50 ${!isOpen && 'md:hidden'}`}>
        <div className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden group">
            {/* Shine effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">{t('dev_by')}</p>
            <p className="text-sm font-bold text-white mb-2">{t('dev_name')}</p>
            
            <div className="flex items-center gap-2 text-xs text-primary-300 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                <MessageCircle className="w-3 h-3" />
                <span className="font-mono tracking-tight" dir="ltr">+20 122 825 2096</span>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
