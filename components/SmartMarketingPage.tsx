
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, BarChart, Cpu, Zap, ShoppingBag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FeatureCard = ({ icon, title, description }: { icon: JSX.Element, title: string, description: string }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`}>
            <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    {icon}
                </div>
                <h3 className="font-bold text-lg dark:text-white">{title}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    )
}

const SmartMarketingPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">التسويق الذكي</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">حملات تسويقية مؤتمتة لزيادة مبيعاتك.</p>
        </div>
         <button className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg flex items-center gap-2 self-start md:self-center">
          <Zap size={20} />
          <span>إطلاق حملة جديدة</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <FeatureCard 
                icon={<Cpu size={24}/>}
                title="اقتراحات حملات ذكية"
                description="يقوم النظام بتحليل مخزونك وبيانات المبيعات ليقترح عليك أفضل المنتجات لعمل حملات تسويقية عليها، والجمهور المستهدف."
            />
            <FeatureCard 
                icon={<Mail size={24}/>}
                title="تنفيذ آلي للحملات"
                description="أطلق حملاتك التسويقية عبر البريد الإلكتروني، واتساب، ومنصات التواصل الاجتماعي مباشرة من هنا وبضغطة زر."
            />
            <FeatureCard 
                icon={<BarChart size={24}/>}
                title="تتبع النتائج والعائد على الاستثمار (ROI)"
                description="راقب أداء حملاتك لحظيًا، واعرف عدد العملاء الجدد والأرباح التي حققتها كل حملة."
            />
        </div>
        
        {/* AI Suggestion Box */}
        <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'} h-fit`}>
            <h3 className="font-bold text-lg dark:text-white mb-4">💡 اقتراح اليوم</h3>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30">
                 <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                        <ShoppingBag size={20} className="text-green-700 dark:text-green-200"/>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-green-800 dark:text-green-300">حملة على المنتجات الراكدة</h4>
                        <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                            منتج "زيت محرك كاسترول" لم يتم بيعه منذ 45 يومًا. نقترح عمل خصم 15% وإرسال حملة بريد إلكتروني للعملاء الذين اشتروا زيوتًا سابقًا.
                        </p>
                    </div>
                 </div>
                 <button className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-md px-3 py-1.5 mt-4">
                    إنشاء الحملة الآن
                </button>
            </div>
        </div>

      </div>

    </motion.div>
  );
};

export default SmartMarketingPage;
