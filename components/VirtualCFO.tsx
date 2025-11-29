import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb,
    DollarSign, Package, ShoppingCart, Zap, CheckCircle, XCircle,
    ArrowRight, Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AIInsight {
    id: string;
    type: 'warning' | 'opportunity' | 'success' | 'info';
    title: string;
    description: string;
    action?: string;
    impact: 'high' | 'medium' | 'low';
}

const VirtualCFO: React.FC = () => {
    const { theme } = useTheme();
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(true);

    useEffect(() => {
        // Simulate AI analysis
        setTimeout(() => {
            setInsights([
                {
                    id: '1',
                    type: 'warning',
                    title: 'تنبيه: التدفق النقدي المتوقع',
                    description: 'التدفق النقدي سيكون ضيقاً الأسبوع القادم بسبب أمر الشراء PO-AUTO-2023112901 (5,000 ر.س). اقترح تأجيل الدفع أو التفاوض على شروط دفع أفضل.',
                    action: 'عرض أمر الشراء',
                    impact: 'high'
                },
                {
                    id: '2',
                    type: 'opportunity',
                    title: 'فرصة: منتج عالي الربحية',
                    description: 'المنتج "لابتوب Dell XPS 13" يحقق أعلى هامش ربح (45%) لكن المخزون منخفض (12 وحدة فقط). اقترح زيادة الطلب.',
                    action: 'إنشاء أمر شراء',
                    impact: 'high'
                },
                {
                    id: '3',
                    type: 'info',
                    title: 'تحليل: مخزون راكد',
                    description: 'المنتج "ساعة Apple Watch" لم يُباع منذ 15 يوماً. اقترح تخفيض 20% لتحريك المخزون.',
                    action: 'إنشاء عرض',
                    impact: 'medium'
                },
                {
                    id: '4',
                    type: 'success',
                    title: 'نجاح: أداء ممتاز',
                    description: 'المبيعات هذا الأسبوع تجاوزت التوقعات بنسبة 18%. استمر على نفس الاستراتيجية!',
                    impact: 'low'
                }
            ]);
            setIsAnalyzing(false);
        }, 2000);
    }, []);

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="text-yellow-500" size={24} />;
            case 'opportunity': return <Lightbulb className="text-blue-500" size={24} />;
            case 'success': return <CheckCircle className="text-green-500" size={24} />;
            default: return <Zap className="text-purple-500" size={24} />;
        }
    };

    const getInsightColor = (type: string) => {
        switch (type) {
            case 'warning': return 'border-yellow-500/50 bg-yellow-500/5';
            case 'opportunity': return 'border-blue-500/50 bg-blue-500/5';
            case 'success': return 'border-green-500/50 bg-green-500/5';
            default: return 'border-purple-500/50 bg-purple-500/5';
        }
    };

    const getImpactBadge = (impact: string) => {
        const colors = {
            high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        };
        const labels = {
            high: 'تأثير عالي',
            medium: 'تأثير متوسط',
            low: 'تأثير منخفض'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[impact as keyof typeof colors]}`}>
                {labels[impact as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20' : 'bg-gradient-to-br from-purple-50 to-blue-50'} border ${theme === 'dark' ? 'border-purple-500/20' : 'border-purple-200'} p-8`}>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <Brain className="text-purple-600" size={32} />
                    </div>
                    <div>
                        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                            المدير المالي الافتراضي
                        </h1>
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} flex items-center gap-2 mt-1`}>
                            <Sparkles size={16} className="text-purple-500" />
                            مدعوم بالذكاء الاصطناعي Gemini
                        </p>
                    </div>
                </div>

                {isAnalyzing && (
                    <div className="flex items-center gap-3 mt-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            جاري تحليل بياناتك المالية...
                        </span>
                    </div>
                )}
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {insights.map((insight, index) => (
                    <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-xl border-2 ${getInsightColor(insight.type)} ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} p-6`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                {getInsightIcon(insight.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                        {insight.title}
                                    </h3>
                                    {getImpactBadge(insight.impact)}
                                </div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                                    {insight.description}
                                </p>
                                {insight.action && (
                                    <button className={`flex items-center gap-2 text-sm font-medium ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}>
                                        {insight.action}
                                        <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                        <span className="text-xs text-green-600 font-medium">+12.5%</span>
                    </div>
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        58,750 ر.س
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                        الإيرادات المتوقعة (30 يوم)
                    </p>
                </div>

                <div className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                            <DollarSign className="text-blue-600" size={24} />
                        </div>
                        <span className="text-xs text-blue-600 font-medium">متوازن</span>
                    </div>
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        +12,340 ر.س
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                        التدفق النقدي الصافي
                    </p>
                </div>

                <div className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                            <Package className="text-purple-600" size={24} />
                        </div>
                        <span className="text-xs text-yellow-600 font-medium">يحتاج انتباه</span>
                    </div>
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        3 منتجات
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                        مخزون منخفض
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VirtualCFO;
