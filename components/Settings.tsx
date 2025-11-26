import React, { useState } from 'react';
import { Save, User, Lock, Bell, Globe, HelpCircle, LogOut, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Settings = () => {
  const { customers } = useStore(); 
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">الإعدادات</h1>
          <p className="text-slate-600 dark:text-slate-400">تحكم في إعدادات النظام وتفضيلاتك</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-fit">
          <nav className="flex flex-col">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300'}`}
            >
              <Globe className="w-5 h-5" />
              عام
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300'}`}
            >
              <User className="w-5 h-5" />
              الحساب الشخصي
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300'}`}
            >
              <Lock className="w-5 h-5" />
              الأمان وكلمة المرور
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300'}`}
            >
              <Bell className="w-5 h-5" />
              الإشعارات
            </button>
            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
            <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
              تسجيل الخروج
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              {activeTab === 'general' && <Globe className="w-5 h-5 text-primary-600" />}
              {activeTab === 'profile' && <User className="w-5 h-5 text-primary-600" />}
              {activeTab === 'security' && <Shield className="w-5 h-5 text-primary-600" />}
              {activeTab === 'notifications' && <Bell className="w-5 h-5 text-primary-600" />}
              
              {activeTab === 'general' && 'إعدادات عامة'}
              {activeTab === 'profile' && 'الملف الشخصي'}
              {activeTab === 'security' && 'الأمان'}
              {activeTab === 'notifications' && 'الإشعارات'}
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400">
                  محتوى إعدادات {activeTab} سيظهر هنا.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 mt-4">
                <HelpCircle className="w-4 h-4" />
                <span>هل تحتاج مساعدة؟</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;