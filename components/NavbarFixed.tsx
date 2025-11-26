
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // الرجوع خطوة للخلف
import { useLanguage, LANGUAGES } from '../context/LanguageContext'; // استيراد قائمة اللغات
import { Sun, Moon, Bell, Search, Menu, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  toggleSidebar: () => void;
  user?: any;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, user }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, dir, activeLangData } = useLanguage();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // إشعارات وهمية
  const notifications = [
    { id: 1, title: "System Update", msg: "Version 2.0 is live", time: "2m", read: false },
    { id: 2, title: "New Order", msg: "Order #1024 received", time: "1h", read: false },
    { id: 3, title: "High Usage", msg: "CPU usage at 80%", time: "3h", read: true },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full px-6 py-3 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-all"
    >
      <div className="flex justify-between items-center">

        {/* Search & Toggle */}
        <div className="flex items-center gap-4 flex-1">
          <button onClick={toggleSidebar} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 lg:hidden">
            <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>

          <div className="hidden md:flex items-center relative w-full max-w-md group">
            <Search className={`absolute w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder={t('search')}
              className={`w-full bg-slate-100 dark:bg-white/5 border-none outline-none rounded-xl py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700 dark:text-slate-200 ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <span className="text-lg">{activeLangData.flag}</span>
              <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 hidden sm:inline">{language}</span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute top-full mt-2 w-48 bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden z-50 max-h-80 overflow-y-auto custom-scrollbar ${dir === 'rtl' ? 'left-0' : 'right-0'}`}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code as any); setShowLangMenu(false); }}
                      className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${language === lang.code ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{lang.flag}</span>
                        <span className={`text-sm ${language === lang.code ? 'font-bold text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}>{lang.name}</span>
                      </div>
                      {language === lang.code && <Check size={14} className="text-blue-600" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-white/5">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.first_name?.[0] || user.email?.[0] || 'U'}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {user.first_name || user.email}
              </span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-yellow-400 hover:scale-105 transition-all"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications Dropdown (Active Now) */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#09090b] animate-pulse"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute top-full mt-3 w-80 bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden z-50 ${dir === 'rtl' ? 'left-0' : 'right-0'}`}
                >
                  <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 dark:text-white">{t('notifications')}</h3>
                    <button className="text-xs text-blue-500 hover:underline">{t('mark_read')}</button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}>
                         <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">{notif.title}</h4>
                            <span className="text-[10px] text-slate-400">{notif.time}</span>
                         </div>
                         <p className="text-xs text-slate-500 mt-1">{notif.msg}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
