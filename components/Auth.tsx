
import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, Loader2, Globe, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n';
import { User as UserType } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const { t, language, setLanguage } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call Delay
    setTimeout(() => {
      const user: UserType = {
        id: '1',
        name: formData.name || (formData.email.split('@')[0]),
        email: formData.email,
        role: formData.email.includes('admin') ? 'admin' : 'manager'
      };
      onLogin(user);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#f8fafc]">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Language Switcher (Floating) */}
      <div className="absolute top-6 end-6 z-20">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="glass flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:text-primary-700 rounded-full transition-all shadow-sm hover:shadow-md"
        >
          <Globe className="w-4 h-4" />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 m-4">
        
        {/* Left Side: Branding (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col justify-center p-10 glass rounded-3xl border-0 md:border-r-0 md:rounded-e-none relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-teal-900/90 z-0"></div>
           <div className="relative z-10 text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-8 shadow-inner">
                Z
              </div>
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                {t('app_name')}
              </h1>
              <p className="text-primary-100 text-lg mb-8 leading-relaxed opacity-90">
                {language === 'ar' 
                  ? 'نظام إدارة موارد المؤسسات الذكي، مصمم لنمو أعمالك في الشرق الأوسط.' 
                  : 'The intelligent ERP system designed for your business growth in the MENA region.'}
              </p>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="font-medium">{t('ai_assistant_title')}</span>
                 </div>
                 <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                    <ShieldCheck className="w-5 h-5 text-green-300" />
                    <span className="font-medium">{t('manage_billing')}</span>
                 </div>
              </div>
           </div>
           
           {/* Decorative Circles */}
           <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="glass rounded-3xl md:rounded-s-none p-8 sm:p-12 shadow-2xl flex flex-col justify-center">
          <div className="mb-8 text-center md:text-start">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? t('login_title') : t('register_title')}
            </h2>
            <p className="text-gray-500">
              {isLogin ? t('login_subtitle') : t('register_subtitle')}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">{t('full_name')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 px-3 py-3.5 ps-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">{t('email_address')}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 px-3 py-3.5 ps-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">{t('password')}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 px-3 py-3.5 ps-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 py-3.5 text-white shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.01] hover:shadow-primary-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2 font-bold">
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? t('login_btn') : t('register_btn'))}
                   {!loading && <ArrowRight className="w-5 h-5" />}
                </div>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
             <p className="text-sm text-gray-500 mb-3">{t('auth_footer')}</p>
             <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-all"
              >
                {isLogin ? t('toggle_register') : t('toggle_login')}
              </button>
          </div>
        </div>
      </div>

      {/* Footer Credits */}
      <div className="absolute bottom-4 text-center w-full z-10 animate-fade-in-up">
         <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/40 shadow-sm">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('dev_by')}</span>
            <span className="text-sm font-bold text-gray-800">{t('dev_name')}</span>
         </div>
      </div>
    </div>
  );
};

export default Auth;
