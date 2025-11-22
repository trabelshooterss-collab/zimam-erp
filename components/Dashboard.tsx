
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Brain, TrendingUp, Globe, ExternalLink, RefreshCw, FlaskConical, Play } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { FinancialSnapshot, FinancialInsight, MarketPulseResult, SimulationResult } from '../types';
import { useLanguage } from '../i18n';
import { useStore } from '../context/StoreContext';
import ReactMarkdown from 'react-markdown';

const Dashboard: React.FC = () => {
  const { invoices, refreshData } = useStore();
  const [chartData, setChartData] = useState<FinancialSnapshot[]>([]);
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [marketPulse, setMarketPulse] = useState<MarketPulseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const { t, language } = useLanguage();

  // Simulator State
  const [simScenario, setSimScenario] = useState('');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simLoading, setSimLoading] = useState(false);

  // Dynamic Data Calculation
  useEffect(() => {
    const monthlyData: Record<string, { revenue: number; expenses: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    months.forEach(m => monthlyData[m] = { revenue: Math.floor(Math.random() * 50000) + 50000, expenses: 80000 });
    invoices.forEach(inv => {
      const date = new Date(inv.date);
      const month = date.toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 };
      monthlyData[month].revenue += inv.totalAmount;
    });
    const processedData: FinancialSnapshot[] = Object.keys(monthlyData).map(m => ({
        month: m,
        revenue: monthlyData[m].revenue,
        expenses: monthlyData[m].expenses,
        cashFlow: monthlyData[m].revenue - monthlyData[m].expenses,
        burnRate: monthlyData[m].expenses
    }));
    setChartData(processedData);
  }, [invoices]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const result = await GeminiService.analyzeFinances(chartData.slice(-5), language);
      setInsights(result);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchMarketNews = async () => {
    setNewsLoading(true);
    try {
      const result = await GeminiService.getMarketPulse(language);
      setMarketPulse(result);
    } catch (e) { console.error(e); } finally { setNewsLoading(false); }
  };

  const runSimulation = async () => {
    if(!simScenario) return;
    setSimLoading(true);
    setSimResult(null);
    try {
      // Get latest revenue for context
      const currentRev = chartData[chartData.length - 1]?.revenue || 0;
      const res = await GeminiService.simulateFinancialScenario(simScenario, currentRev, language);
      setSimResult(res);
    } catch(e) { console.error(e); } finally { setSimLoading(false); }
  };

  useEffect(() => {
    if (chartData.length > 0) fetchInsights();
    fetchMarketNews();
  }, [language, chartData.length]); 

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('fin_overview')}</h1>
          <p className="text-gray-500">{t('welcome_msg')}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={refreshData} className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button onClick={() => { fetchInsights(); fetchMarketNews(); }} disabled={loading || newsLoading} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50">
            <Brain className="w-4 h-4" /> {loading ? t('analyzing') : t('refresh_ai')}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: AI Insights, Simulator, Market Pulse */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Simulation Lab (New) */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white shadow-lg">
               <div className="flex items-center gap-2 mb-4">
                  <FlaskConical className="w-5 h-5 text-purple-300" />
                  <h3 className="font-bold">{t('sim_lab')}</h3>
               </div>
               <div className="flex gap-2 mb-4">
                 <input 
                   className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                   placeholder={t('sim_placeholder')}
                   value={simScenario}
                   onChange={(e) => setSimScenario(e.target.value)}
                 />
                 <button 
                   onClick={runSimulation}
                   disabled={simLoading || !simScenario}
                   className="bg-purple-500 hover:bg-purple-600 p-2 rounded-lg disabled:opacity-50"
                 >
                   <Play className="w-4 h-4 fill-current" />
                 </button>
               </div>
               {simLoading && <p className="text-xs text-purple-200 animate-pulse">{t('analyzing')}</p>}
               {simResult && (
                 <div className="bg-white/10 rounded-lg p-3 text-xs space-y-2 border border-white/10 animate-in fade-in">
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-purple-200">{t('impact_rev')}</span>
                      <span className="font-bold">{simResult.impactOnRevenue}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-purple-200">{t('impact_prof')}</span>
                      <span className="font-bold">{simResult.impactOnProfit}</span>
                    </div>
                    <p className="text-gray-200 italic pt-1">"{simResult.recommendation}"</p>
                 </div>
               )}
            </div>

            {/* AI Insights Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col max-h-[400px]">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t('smart_assistant')}</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pe-2 custom-scrollbar">
                {insights.map((insight, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-s-4 ${insight.severity === 'critical' ? 'bg-red-50 border-red-500' : insight.severity === 'warning' ? 'bg-amber-50 border-amber-500' : 'bg-blue-50 border-blue-500'}`}>
                    <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-bold">
                    <span className="uppercase tracking-wider">{t('action')}:</span>
                    <span className="text-gray-800">{insight.actionItem}</span>
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* Market Pulse Card */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg text-white">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <div>
                        <h3 className="font-semibold text-white">{t('market_pulse')}</h3>
                        <p className="text-xs text-slate-400">{t('live_search')}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {newsLoading ? <div className="animate-pulse h-20 bg-slate-700 rounded"></div> : marketPulse ? (
                        <>
                            <div className="text-sm text-slate-300 space-y-2 prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{marketPulse.content}</ReactMarkdown>
                            </div>
                            {marketPulse.sources.length > 0 && (
                                <div className="pt-4 mt-4 border-t border-slate-700 flex flex-wrap gap-2">
                                    {marketPulse.sources.slice(0, 3).map((source, idx) => (
                                        <a key={idx} href={source.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] bg-slate-800 text-blue-300 px-2 py-1 rounded truncate max-w-[150px]">
                                            <ExternalLink className="w-3 h-3" /> {source.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : <p className="text-sm text-slate-500">{t('no_news')}</p>}
                </div>
            </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">{t('rev_vs_exp')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} name={t('chart_revenue')} />
                  <Bar dataKey="expenses" fill="#dc2626" radius={[4, 4, 0, 0]} name={t('chart_expenses')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">{t('cash_flow')}</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="cashFlow" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} name={t('cash_flow')} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
