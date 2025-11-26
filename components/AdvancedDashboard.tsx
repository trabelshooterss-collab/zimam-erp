import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, AlertTriangle, Zap, Brain, BarChart3, 
  Users, ShoppingCart, Clock, Target, Lightbulb
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { AdvancedAnalyticsEngine } from '../services/advancedAnalytics';
import { SmartRecommendationEngine } from '../services/smartRecommendations';
import { automationEngine } from '../services/automationEngine';

/**
 * لوحة التحكم الذكية المتقدمة - Advanced Smart Dashboard
 * توفر تحليلات عميقة وتوصيات ذكية وأتمتة كاملة
 */
const AdvancedDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { t, formatNumber, language } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'analytics' | 'recommendations' | 'automation'>('analytics');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);

  // محاكاة بيانات العينة
  const mockFinancials = [
    { month: 'يناير', revenue: 50000, expenses: 30000, cashFlow: 20000, burnRate: 0.6 },
    { month: 'فبراير', revenue: 55000, expenses: 32000, cashFlow: 23000, burnRate: 0.58 },
    { month: 'مارس', revenue: 60000, expenses: 31000, cashFlow: 29000, burnRate: 0.52 },
  ];

  const mockProducts = [
    { id: '1', name: 'آيفون 15 برو', sku: 'IP15P001', category: 'هواتف', currentStock: 3, reorderPoint: 10, costPrice: 4000, sellingPrice: 5000, lastRestocked: '2024-12-20' },
    { id: '2', name: 'سامسونج S24', sku: 'SS24U001', category: 'هواتف', currentStock: 15, reorderPoint: 10, costPrice: 3500, sellingPrice: 4500, lastRestocked: '2024-12-18' },
  ];

  const mockInvoices = [
    { id: '1', type: 'SALES', customerName: 'أحمد محمد', date: '2024-01-15', dueDate: '2024-02-15', items: [], totalAmount: 5000, taxAmount: 250, status: 'PAID', compliance: {} },
    { id: '2', type: 'SALES', customerName: 'محمد علي', date: '2024-01-16', dueDate: '2024-02-16', items: [], totalAmount: 4500, taxAmount: 225, status: 'OVERDUE', compliance: {} },
  ];

  const mockCustomers = [
    { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', phone: '01234567890', type: 'customer' as const, address: 'القاهرة', balance: 500 },
    { id: '2', name: 'محمد علي', email: 'mohammed@example.com', phone: '01234567891', type: 'customer' as const, address: 'الجيزة', balance: 1000 },
  ];

  // تحميل البيانات التحليلية
  const loadAnalytics = useCallback(() => {
    setLoading(true);
    const insights = AdvancedAnalyticsEngine.generateFinancialInsights(mockFinancials);
    const anomalies = AdvancedAnalyticsEngine.detectAnomalies(mockInvoices);
    
    setAnalyticsData({
      insights,
      anomalies,
      summary: AdvancedAnalyticsEngine.generateSummaryReport(mockFinancials, mockInvoices, mockProducts)
    });
    setLoading(false);
  }, []);

  // تحميل التوصيات
  const loadRecommendations = useCallback(() => {
    setLoading(true);
    const recs = SmartRecommendationEngine.generateRecommendationReport(
      mockProducts,
      mockInvoices,
      mockCustomers
    );
    setRecommendations(recs.slice(0, 8));
    setLoading(false);
  }, []);

  // تحميل Workflows
  const loadWorkflows = useCallback(() => {
    setLoading(true);
    
    automationEngine.createLowStockAutomation();
    automationEngine.createOverdueInvoiceAutomation();
    automationEngine.createNewOrderAutomation();
    automationEngine.createPaymentReceivedAutomation();
    automationEngine.createScheduledReportAutomation();

    setWorkflows(automationEngine.getAllWorkflows());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedTab === 'analytics' && !analyticsData) loadAnalytics();
    if (selectedTab === 'recommendations' && recommendations.length === 0) loadRecommendations();
    if (selectedTab === 'automation' && workflows.length === 0) loadWorkflows();
  }, [selectedTab, analyticsData, recommendations, workflows, loadAnalytics, loadRecommendations, loadWorkflows]);

  const bgColor = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-slate-50';
  const cardBg = theme === 'dark' ? 'bg-[#111]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-slate-200' : 'text-slate-700';

  return (
    <div className={`${bgColor} min-h-screen p-6 transition-colors duration-300`}>
      {/* العنوان */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          🧠 لوحة التحكم الذكية المتقدمة
        </motion.h1>
        <p className={textColor}>تحليلات عميقة، توصيات ذكية، وأتمتة شاملة</p>
      </div>

      {/* التبويبات */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'analytics' as const, label: '📊 التحليلات', icon: BarChart3 },
          { id: 'recommendations' as const, label: '💡 التوصيات', icon: Lightbulb },
          { id: 'automation' as const, label: '⚙️ الأتمتة', icon: Zap }
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab(tab.id)}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
              ${selectedTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : `${cardBg} ${textColor} border border-slate-200 dark:border-white/10`
              }
            `}
          >
            <tab.icon size={20} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* محتوى التبويبات */}
      <AnimatePresence mode="wait">
        {selectedTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className={`${textColor} mt-4`}>جاري تحليل البيانات...</p>
              </div>
            ) : analyticsData ? (
              <>
                {/* بطاقات الرؤى */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyticsData.insights.map((insight: any, idx: number) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      className={`${cardBg} p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm text-slate-500">{insight.metric}</p>
                          <h3 className={`text-2xl font-bold ${textColor}`}>
                            {formatNumber(insight.currentValue)}
                          </h3>
                        </div>
                        <TrendingUp className="text-green-500" size={24} />
                      </div>
                      <div className="text-xs text-slate-500 space-y-1">
                        <p>📈 متوقع: {formatNumber(insight.predictedValue)}</p>
                        <p>🎯 ثقة: {(insight.confidence * 100).toFixed(0)}%</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* التنبيهات */}
                {analyticsData.anomalies.length > 0 && (
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`${cardBg} p-6 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="text-red-600" size={24} />
                      <h3 className="text-lg font-bold text-red-600">⚠️ التنبيهات</h3>
                    </div>
                    <div className="space-y-3">
                      {analyticsData.anomalies.slice(0, 5).map((anomaly: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white dark:bg-[#0a0a0a] rounded-lg">
                          <p className="text-sm font-semibold text-red-600">{anomaly.description}</p>
                          <p className="text-xs text-slate-500 mt-1">💡 {anomaly.suggestedAction}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* الملخص */}
                <motion.div
                  className={`${cardBg} p-6 rounded-xl border border-slate-200 dark:border-white/10`}
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Brain size={20} className="text-blue-600" />
                    📋 الملخص التنفيذي
                  </h3>
                  <p className={`${textColor} text-sm whitespace-pre-wrap font-mono`}>
                    {analyticsData.summary}
                  </p>
                </motion.div>
              </>
            ) : null}
          </motion.div>
        )}

        {selectedTab === 'recommendations' && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className={`${textColor} mt-4`}>جاري توليد التوصيات...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((rec: any, idx: number) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`${cardBg} p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                            rec.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                            rec.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <h3 className={`text-lg font-bold ${textColor}`}>{rec.title}</h3>
                      </div>
                      <Lightbulb className="text-yellow-500" size={24} />
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{rec.description}</p>

                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">💼 الإجراءات:</h4>
                      {rec.actionItems.map((item: string, i: number) => (
                        <p key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <span className="text-blue-600">✓</span> {item}
                        </p>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        💰 النتيجة المتوقعة: {rec.estimatedOutcome}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        🎯 درجة الثقة: {(rec.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {selectedTab === 'automation' && (
          <motion.div
            key="automation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className={`${textColor} mt-4`}>جاري تحميل الأتمتة...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workflows.map((workflow: any, idx: number) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`${cardBg} p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
                          <Zap className="text-yellow-500" size={20} />
                          {workflow.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{workflow.description}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        workflow.enabled
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400'
                      }`}>
                        {workflow.enabled ? '🟢 مفعّل' : '⚪ معطّل'}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Target size={16} className="text-blue-600" />
                        <span>المشغّل: {workflow.trigger.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Clock size={16} className="text-green-600" />
                        <span>عدد الإجراءات: {workflow.actions.length}</span>
                      </div>
                      {workflow.lastExecuted && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <ShoppingCart size={16} className="text-purple-600" />
                          <span>آخر تنفيذ: {new Date(workflow.lastExecuted).toLocaleString('ar-SA')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Users size={16} className="text-orange-600" />
                        <span>عدد التنفيذات: {workflow.executionCount}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedDashboard;
