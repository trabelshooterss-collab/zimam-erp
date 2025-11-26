import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, MessageSquare, Sparkles, Target, Zap, Send, Bot } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SmartAssistant: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="h-full pb-20 font-sans">
      
      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] overflow-hidden p-10 mb-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(124,58,237,0.5)]">
              <BrainCircuit size={64} className="text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full border-2 border-black flex items-center gap-1">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span> Active
            </div>
          </div>
          <div className="text-center md:text-right flex-1">
            <h1 className="text-4xl font-bold mb-2">مستشار زمام الذكي</h1>
            <p className="text-indigo-200 text-lg max-w-2xl">
              أنا عقلك الرقمي في المؤسسة. أقوم بتحليل المبيعات، المخزون، واتجاهات السوق لحظة بلحظة لأعطيك أفضل القرارات.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chat Interface */}
        <div className={`lg:col-span-2 rounded-[2rem] border flex flex-col h-[600px] shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
          
          {/* Chat Header */}
          <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/5 bg-[#151515]' : 'border-slate-100 bg-slate-50'}`}>
            <h3 className={`font-bold flex items-center gap-3 text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <div className="p-2 bg-purple-500/10 rounded-lg"><MessageSquare className="text-purple-500" size={20} /></div>
              محادثة حية مع النظام
            </h3>
            <span className="text-xs font-mono text-slate-500">AI_MODEL_V4.2</span>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
            
            {/* AI Welcome */}
            <div className="flex justify-end">
              <div className="flex items-end gap-3 flex-row-reverse">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 text-white shadow-lg"><Bot size={20} /></div>
                 <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white px-6 py-4 rounded-3xl rounded-tr-none max-w-lg shadow-lg">
                    <p className="leading-relaxed text-sm">
                       أهلاً بك يا مدير 👋<br/>
                       لقد قمت للتو بمسح كامل لبيانات المخزون والمبيعات. الأمور تبدو مستقرة، لكن لدي بعض الملاحظات بخصوص فرع "الرياض". كيف يمكنني مساعدتك اليوم؟
                    </p>
                 </div>
              </div>
            </div>

            {/* User Question */}
            <div className="flex justify-start">
              <div className="flex items-end gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 font-bold">ME</div>
                 <div className={`px-6 py-4 rounded-3xl rounded-tl-none max-w-lg ${theme === 'dark' ? 'bg-[#1f1f1f] text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
                    <p className="text-sm">ما هو وضع السيولة النقدية المتوقع لنهاية الشهر؟ وهل تنصحني بشراء بضاعة جديدة الآن؟</p>
                 </div>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-end">
              <div className="flex items-end gap-3 flex-row-reverse">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 text-white shadow-lg"><Bot size={20} /></div>
                 <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white px-6 py-4 rounded-3xl rounded-tr-none max-w-lg shadow-lg">
                    <p className="leading-relaxed text-sm">
                      بناءً على مدفوعات العملاء المتوقعة، سيكون لديك فائض سيولة يقدر بـ <strong>140,000 ريال</strong> بنهاية الشهر. 💰
                      <br/><br/>
                      أما بخصوص الشراء: أنصحك <strong>بالانتظار قليلاً</strong>. تشير مؤشرات السوق العالمية إلى احتمال انخفاض أسعار الإلكترونيات بنسبة 3% الأسبوع القادم. الأفضل أن تحتفظ بالسيولة الآن.
                    </p>
                 </div>
              </div>
            </div>

          </div>

          {/* Input Area */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/5 bg-[#151515]' : 'border-slate-100 bg-white'}`}>
            <div className={`flex items-center gap-3 px-2 py-2 rounded-2xl border ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full cursor-pointer transition-colors">
                 <Sparkles size={20} className="text-purple-500" />
              </div>
              <input 
                type="text" 
                placeholder="اسأل زمام أي سؤال عن البزنس..." 
                className={`flex-1 bg-transparent outline-none text-sm px-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              />
              <button className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors shadow-lg shadow-purple-500/20">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Insights Side */}
        <div className="space-y-6">
          
          {/* Card 1 */}
          <motion.div whileHover={{ scale: 1.02 }} className={`p-6 rounded-[2rem] border relative overflow-hidden group cursor-pointer transition-all ${theme === 'dark' ? 'bg-[#111] border-white/10 hover:border-blue-500/50' : 'bg-white border-slate-200 hover:border-blue-400'}`}>
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
             <div className="flex items-start justify-between mb-4">
               <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500"><Target size={24} /></div>
               <span className="text-xs font-bold bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full">فرصة ذهبية</span>
             </div>
             <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>تحريك المخزون الراكد</h3>
             <p className="text-slate-500 text-sm leading-relaxed">لديك 50 قطعة من "تيشيرت قطني" لم تبع منذ 30 يوماً. أنصح بعمل عرض (اشتر 2 واحصل على 1 مجاناً) لتسييل هذا المخزون بسرعة.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div whileHover={{ scale: 1.02 }} className={`p-6 rounded-[2rem] border relative overflow-hidden group cursor-pointer transition-all ${theme === 'dark' ? 'bg-[#111] border-white/10 hover:border-orange-500/50' : 'bg-white border-slate-200 hover:border-orange-400'}`}>
             <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
             <div className="flex items-start justify-between mb-4">
               <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500"><Zap size={24} /></div>
               <span className="text-xs font-bold bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full">تنبيه تشغيلي</span>
             </div>
             <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>استهلاك الكهرباء</h3>
             <p className="text-slate-500 text-sm leading-relaxed">فاتورة الكهرباء ارتفعت بنسبة 15% هذا الشهر عن المعدل الطبيعي. يرجى التأكد من إغلاق أجهزة التكييف في المخازن الخلفية ليلاً.</p>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default SmartAssistant;