
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Camera, BarChart, AlertTriangle, Zap, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ComputerVisionInventory from './ComputerVisionInventory';

const FeatureCard = ({ icon, title, description }: { icon: JSX.Element, title: string, description: string }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`}>
            <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                    {icon}
                </div>
                <h3 className="font-bold text-lg dark:text-white">{title}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    )
}

const SmartInventoryPage: React.FC = () => {
  const { theme } = useTheme();
  const [view, setView] = useState<'main' | 'camera'>('main');

  const handleStartCameraScan = () => {
      setView('camera');
  }

  if (view === 'camera') {
      return (
          <div>
              <button onClick={() => setView('main')} className="flex items-center gap-2 mb-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                <ArrowRight className="w-4 h-4 transform rotate-180"/> 
                العودة إلى الجرد الذكي
              </button>
              <ComputerVisionInventory />
          </div>
      )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">الجرد الذكي</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">نظرة عميقة على مخزونك باستخدام الذكاء الاصطناعي.</p>
        </div>
         <button onClick={handleStartCameraScan} className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-lg flex items-center gap-2 self-start md:self-center">
          <Camera size={20} />
          <span>بدء الجرد بالكاميرا</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-red-900/50' : 'bg-red-50'} border-red-200`}><h4 className="text-sm text-red-600 dark:text-red-400">منتجات راكدة</h4><p className="text-2xl font-bold text-red-600 dark:text-red-300">5</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-orange-900/50' : 'bg-orange-50'} border-orange-200`}><h4 className="text-sm text-orange-600 dark:text-orange-400">سينفذ قريبًا</h4><p className="text-2xl font-bold text-orange-600 dark:text-orange-300">8</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-50'} border-green-200`}><h4 className="text-sm text-green-600 dark:text-green-400">الأكثر مبيعًا</h4><p className="text-xl font-bold text-green-600 dark:text-green-300">فلتر رياضي K&N</p></div>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border'}`}><h4 className="text-sm text-slate-500">آخر جرد</h4><p className="text-2xl font-bold dark:text-white">منذ 2 ساعة</p></div>
      </div>

      {/* Main Features */}
      <div className="space-y-6">
         <FeatureCard 
            icon={<TrendingUp size={24}/>}
            title="التنبؤ بالمخزون"
            description="يتوقع النظام متى سينفد منتج معين بناءً على معدلات البيع، ويرسل لك تنبيهًا لعمل طلب شراء جديد في الوقت المناسب."
        />
         <FeatureCard 
            icon={<TrendingDown size={24}/>}
            title="تحليل المنتجات الراكدة"
            description="يكتشف النظام المنتجات التي لم تُبع منذ فترة طويلة ويقترح عليك حلولاً لتصريفها، مثل عمل عروض خاصة أو إدراجها في حملات تسويقية."
        />
         <FeatureCard 
            icon={<Zap size={24}/>}
            title="ربط الجرد بالتسويق"
            description="يقوم النظام تلقائيًا باقتراح حملات تسويقية للمنتجات الراكدة أو التي لديك منها كمية كبيرة، مما يساعدك على تحريك المخزون وزيادة المبيعات."
        />
      </div>

    </motion.div>
  );
};

export default SmartInventoryPage;
