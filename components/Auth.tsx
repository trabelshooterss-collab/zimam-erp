
import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, Loader2, Globe, MessageCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 end-6 z-10">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-white hover:shadow-sm rounded-full transition-all border border-transparent hover:border-gray-200"
        >
          <Globe className="w-4 h-4" />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-2xl shadow-primary-600/30 transform rotate-3 hover:rotate-0 transition-all duration-500">
            Z
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 font-sans">
          {isLogin ? t('login_title') : t('register_title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          {isLogin ? t('login_subtitle') : t('register_subtitle')}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-soft rounded-2xl sm:px-10 border border-white/50 backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700">{t('full_name')}</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="block w-full appearance-none rounded-xl border-gray-200 bg-gray-50 px-3 py-3 ps-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-primary-500 transition-all sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700">{t('email_address')}</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="block w-full appearance-none rounded-xl border-gray-200 bg-gray-50 px-3 py-3 ps-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-primary-500 transition-all sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">{t('password')}</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="block w-full appearance-none rounded-xl border-gray-200 bg-gray-50 px-3 py-3 ps-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-primary-500 transition-all sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl border border-transparent bg-primary-600 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 hover:shadow-primary-600/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? t('login_btn') : t('register_btn')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">{t('auth_footer')}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="flex w-full justify-center rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                {isLogin ? t('toggle_register') : t('toggle_login')}
              </button>
            </div>
          </div>
        </div>

        {/* Developer Credit Footer */}
        <div className="mt-8 text-center animate-fade-in">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-2">{t('dev_by')}</p>
            <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur px-4 py-2 rounded-full border border-white/50 shadow-sm">
                <span className="font-bold text-gray-700">{t('dev_name')}</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1 text-green-600 font-mono text-xs font-semibold">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span dir="ltr">0122 825 2096</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
