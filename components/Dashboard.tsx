import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, ShoppingCart, Activity, 
  Sparkles, BrainCircuit, AlertTriangle, ArrowUpRight, 
  Mic, Volume2, Globe, Server
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const { t, formatNumber, language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  
  // مرجع لتخزين المحاولات لعدم الدخول في حلقة مفرغة
  const speechTimeout = useRef<any>(null);

  // --- 1. محرك الصوت الذكي (The Voice Hunter) ---
  const speakAI = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    
    // دالة داخلية للبحث عن الأصوات
    const play = () => {
      const voices = synth.getVoices();

      // إذا لم نجد أصواتاً بعد، ننتظر قليلاً ونحاول مجدداً (هذا هو حل المشكلة)
      if (voices.length === 0) {
        clearTimeout(speechTimeout.current);
        speechTimeout.current = setTimeout(play, 100); 
        return;
      }

      synth.cancel(); // إيقاف أي كلام سابق
      const utterance = new SpeechSynthesisUtterance(text);

      // اختيار أفضل صوت بشري حسب اللغة
      let selectedVoice = null;

      if (language === 'ar') {
        utterance.lang = 'ar-SA';
        // البحث عن صوت Google العربي لأنه الأفضل
        selectedVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('ar'));
        // إذا لم يوجد، نأخذ أي صوت عربي
        if (!selectedVoice) selectedVoice = voices.find(v => v.lang.includes('ar'));
      } else if (language === 'hi') {
        utterance.lang = 'hi-IN';
        selectedVoice = voices.find(v => v.lang.includes('hi'));
      } else if (language === 'en') {
        utterance.lang = 'en-US';
        selectedVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en-US'));
      } else if (language === 'de') {
        utterance.lang = 'de-DE';
        selectedVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('de'));
      }
      
      // تعيين الصوت المختار
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 0.9; // سرعة هادئة ورزينة
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synth.speak(utterance);
    };

    play();
  };

  // --- 2. سيناريو المستشار الذكي (The Brain) ---
  useEffect(() => {
    // تحديد التحية والرسالة بناءً على اللغة والوقت
    const hour = new Date().getHours();
    
    let greeting = "";
    let advice = "";

    if (language === 'ar') {
      greeting = hour < 12 ? "صباح الخير يا محمد" : "مساء الخير يا محمد";
      advice = `${greeting}. لدي تحديث هام. مخزون الآيفون 15 برو وصل لمرحلة الخطر، متبقي 3 قطع فقط. وبناءً على ارتفاع السعر العالمي 5% اليوم، أنصحك بشراء كمية جديدة فوراً لتعظيم الربح.`;
    } else if (language === 'en') {
      greeting = hour < 12 ? "Good Morning Mohamed" : "Good Evening Mohamed";
      advice = `${greeting}. Critical update. iPhone 15 Pro stock is dangerously low, only 3 units left. With global prices up by 5% today, I strongly recommend restocking now to maximize profit.`;
    } else if (language === 'hi') {
      greeting = "नमस्ते मोहम्मद";
      advice = `${greeting}. iPhone 15 Pro का स्टॉक बहुत कम है। कीमतें बढ़ रही हैं, कृपया अभी खरीदें।`;
    } else if (language === 'de') {
      greeting = "Guten Tag Mohamed";
      advice = `${greeting}. iPhone 15 Pro Lagerbestand ist kritisch. Bitte sofort nachbestellen.`;
    } else {
      // Fallback for other languages
      advice = "System Ready. Please check inventory levels.";
    }

    setAiMessage(advice);

    // تأخير بسيط جداً لبدء الكلام بعد الريندر
    const startTimer = setTimeout(() => {
      speakAI(advice);
    }, 1000);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(speechTimeout.current);
      window.speechSynthesis.cancel();
    };
  }, [language]); // يعيد الكلام عند تغيير اللغة

  // --- مكون البطاقة الإحصائية ---
  const SmartCard = ({ title, value, aiPrediction, icon: Icon, color, delay, currency = false }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-3xl p-6 border transition-all duration-300 group
        ${theme === 'dark' 
          ? 'bg-[#111] border-white/10 hover:border-white/20' 
          : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-blue-500/5'}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${color}`}></div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
          <Icon className={theme === 'dark' ? 'text-white' : 'text-slate-700'} />
        </div>
        <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
           <Sparkles size={12} className="text-green-500" />
           <span className="text-[10px] font-bold text-green-500">AI Verified</span>
        </div>
      </div>
      <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{title}</h3>
      <h2 className={`text-3xl font-bold mb-3 font-sans ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
        {formatNumber(value)}
        {currency && <span className="text-sm font-normal mx-1">{t('currency')}</span>}
      </h2>
      <div className="flex items-center gap-2 text-xs">
         <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('projected')}:</span>
         <span className={`font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{aiPrediction}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="pb-20">
      
      {/* 1. Zimam Neural Core (مركز القيادة العبقري) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 relative overflow-hidden rounded-[2rem] p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/20"
      >
        <div className={`relative rounded-[30px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-8 overflow-hidden
          ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
          
          {/* الخلفية التكنولوجية */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
          
          {/* الأفاتار النابض */}
          <div className="relative shrink-0">
             <div className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 transition-all duration-500
               ${isSpeaking ? 'scale-110 shadow-[0_0_30px_rgba(124,58,237,0.6)]' : ''} bg-gradient-to-br from-indigo-600 to-purple-600`}>
                <BrainCircuit className="text-white w-12 h-12" />
             </div>
             {/* تأثير الموجات الصوتية عند الكلام */}
             {isSpeaking && (
               <>
                 <div className="absolute inset-0 rounded-full border-2 border-purple-500/50 animate-ping"></div>
                 <div className="absolute -inset-4 rounded-full border border-indigo-500/20 animate-pulse delay-75"></div>
               </>
             )}
          </div>

          {/* نص الاستشارة الحية */}
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded-lg">
                <Sparkles size={12} /> Zimam AI Consultant
              </span>
              {isSpeaking && (
                 <span className="flex gap-1 items-end h-3">
                   <motion.span animate={{ height: [4, 14, 4] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-purple-500 rounded-full"></motion.span>
                   <motion.span animate={{ height: [4, 14, 4] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }} className="w-1 bg-purple-500 rounded-full"></motion.span>
                   <motion.span animate={{ height: [4, 14, 4] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }} className="w-1 bg-purple-500 rounded-full"></motion.span>
                 </span>
              )}
            </div>
            
            <h2 className={`text-lg md:text-2xl font-bold mb-4 leading-relaxed tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              "{aiMessage}"
            </h2>
            
            {/* شريط البيانات الحية (Live Ticker) */}
            <div className="flex flex-wrap gap-3">
               <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium
                 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                  <Globe size={14} className="text-blue-500" />
                  <span className="text-slate-500">Global Tech Index:</span>
                  <span className="text-green-500 font-bold flex items-center gap-0.5"><ArrowUpRight size={12} /> +5.2%</span>
               </div>
               <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium
                 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                  <Server size={14} className="text-purple-500" />
                  <span className="text-slate-500">Inventory Sync:</span>
                  <span className="text-blue-500 font-bold animate-pulse">Live</span>
               </div>
            </div>
          </div>

          {/* زر إعادة الاستماع */}
          <button 
            onClick={() => speakAI(aiMessage)}
            className="shrink-0 p-4 rounded-full bg-slate-100 dark:bg-white/5 hover:scale-110 hover:bg-white/10 transition-all group border border-transparent hover:border-purple-500/50"
            title="إعادة الاستشارة"
          >
            {isSpeaking ? <Volume2 className="text-purple-500 animate-pulse" /> : <Mic className="text-slate-500 group-hover:text-purple-500" />}
          </button>
        </div>
      </motion.div>

      {/* 2. Stats Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SmartCard 
          title={t('total_sales')} 
          value={245000} 
          aiPrediction="+15% Growth" 
          icon={TrendingUp} 
          color="bg-blue-500" 
          delay={0.1} 
          currency={true}
        />
        <SmartCard 
          title={t('new_customers')} 
          value={1240} 
          aiPrediction="30 Leads" 
          icon={Users} 
          color="bg-purple-500" 
          delay={0.2} 
        />
        <SmartCard 
          title={t('stock_alert')} 
          value={3} 
          aiPrediction="iPhone 15 Pro" 
          icon={AlertTriangle} 
          color="bg-red-500" 
          delay={0.3} 
        />
        <SmartCard 
          title={t('net_profit')} 
          value={89000} 
          aiPrediction="Excellent" 
          icon={Activity} 
          color="bg-emerald-500" 
          delay={0.4} 
          currency={true}
        />
      </div>

      {/* 3. Charts & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <div className={`lg:col-span-2 rounded-3xl p-8 border ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Revenue Projection (AI Model)</h3>
            <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 font-bold">
               Confidence: 98%
            </span>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {[35, 60, 45, 75, 50, 80, 65, 95, 55, 70, 40, 60].map((h, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${h}%` }}
                 transition={{ duration: 0.8, delay: i * 0.05 }}
                 className={`w-full rounded-t-lg opacity-80 cursor-pointer relative group ${i > 8 ? 'bg-gradient-to-t from-purple-600 to-pink-600' : 'bg-gradient-to-t from-blue-600 to-cyan-500'}`}
               >
                 {i > 8 && (
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                      AI Forecast
                   </div>
                 )}
               </motion.div>
            ))}
          </div>
        </div>

        {/* Notifications / Alerts */}
        <div className={`rounded-3xl p-8 border flex flex-col ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
          <h3 className={`font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('notifications')}</h3>
          
          <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {/* Alert 1 */}
            <div className={`flex gap-4 p-4 rounded-2xl border-l-4 border-red-500 cursor-pointer transition-transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-red-500/5 hover:bg-red-500/10' : 'bg-red-50 hover:bg-red-100'}`}>
               <div className="mt-1"><AlertTriangle size={18} className="text-red-500" /></div>
               <div>
                  <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>Low Stock Alert</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>iPhone 15 Pro (3 units left).<br/>Reorder suggested immediately.</p>
               </div>
            </div>

            {/* Alert 2 */}
            <div className={`flex gap-4 p-4 rounded-2xl border-l-4 border-blue-500 cursor-pointer transition-transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-500/5 hover:bg-blue-500/10' : 'bg-blue-50 hover:bg-blue-100'}`}>
               <div className="mt-1"><ShoppingCart size={18} className="text-blue-500" /></div>
               <div>
                  <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>New Bulk Order</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Order #2055 - Riyadh Branch</p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;