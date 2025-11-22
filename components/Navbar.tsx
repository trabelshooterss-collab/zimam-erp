
import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, Globe, Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '../i18n';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { t, language, setLanguage } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-xl md:hidden text-gray-600 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow transform group-hover:scale-105 transition-transform">
            Z
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-800 group-hover:text-primary-700 transition-colors">
            {language === 'en' ? 'Zimam' : 'زِمام'}
          </span>
          
          {/* Connection Status Badge */}
          <div className={`hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
            isOnline 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? t('online') : t('offline')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isOnline && (
            <div className="hidden md:flex text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded border border-amber-200 animate-pulse">
                {t('data_saved')}
            </div>
        )}

        <button 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-primary-700 rounded-lg transition-all border border-transparent hover:border-gray-200"
        >
          <Globe className="w-4 h-4" />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>

        <button className="p-2.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600 rounded-full relative transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-9 w-9 bg-gradient-to-tr from-gray-200 to-gray-100 rounded-full flex items-center justify-center text-gray-600 ring-2 ring-white shadow-sm cursor-pointer hover:ring-primary-100 transition-all">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
