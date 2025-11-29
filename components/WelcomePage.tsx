import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Monitor, Power } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

interface WelcomePageProps {
  onStart: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  const { t, setLanguage, language, dir } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden font-sans text-white"
      dir={dir}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full px-6 text-center">

        {/* Logo Animation */}
        <motion.div
          animate={{
            boxShadow: ["0 0 20px rgba(37,99,235,0.2)", "0 0 60px rgba(37,99,235,0.6)", "0 0 20px rgba(37,99,235,0.2)"]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-32 h-32 rounded-full bg-black border border-blue-500/50 flex items-center justify-center mb-8"
        >
          <Power className="w-16 h-16 text-blue-500" />
        </motion.div>

        {/* Title & Subtitle */}
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          ZIMAM <span className="text-blue-500">AI</span>
        </h1>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl">
          {t('welcome_subtitle')}
        </p>

        {/* Language Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 ${language === lang.code
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </button>
          ))}
        </div>

        {/* Main Action Button */}
        <button
          onClick={onStart}
          className="group relative px-12 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] mb-16"
        >
          <span className="relative z-10 flex items-center gap-3">
            {t('start_now')} <ArrowRight size={24} className={dir === 'rtl' ? 'rotate-180' : ''} />
          </span>
          <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
        </button>

        {/* Platform Icons */}
        <div className="flex items-center gap-8 text-slate-500">
          <div className="flex flex-col items-center gap-2 hover:text-green-500 transition-colors cursor-pointer group">
            <div className="p-3 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <Smartphone size={32} className="text-green-500" />
            </div>
            <span className="text-xs font-mono group-hover:text-green-400">Android APK</span>
          </div>
          <div className="flex flex-col items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer group">
            <div className="p-3 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <Monitor size={32} className="text-blue-500" />
            </div>
            <span className="text-xs font-mono group-hover:text-blue-400">Windows / Web</span>
          </div>
          <div className="flex flex-col items-center gap-2 hover:text-white transition-colors cursor-pointer group">
            <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Smartphone size={32} className="text-white" />
            </div>
            <span className="text-xs font-mono group-hover:text-white">iOS / Mac</span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-slate-600 text-sm">
          <p>© 2025 Zimam AI ERP. {t('developed_by')} Mohamed Said</p>
        </div>

      </div>
    </motion.div>
  );
};

export default WelcomePage;