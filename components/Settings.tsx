import React, { useState } from 'react';
import { Building, Shield, Save, RefreshCw, CheckCircle2, Search, Send, ExternalLink, MessageCircleQuestion } from 'lucide-react';
import { useLanguage } from '../i18n';
import { GeminiService } from '../services/geminiService';
import { MarketPulseResult } from '../types';
import ReactMarkdown from 'react-markdown';

const Settings: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'general' | 'compliance'>('general');
  
  // Compliance Chat State
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<MarketPulseResult | null>(null);
  const [asking, setAsking] = useState(false);

  const handleAskCompliance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setAsking(true);
    setAnswer(null);
    try {
      const result = await GeminiService.askComplianceQuestion(query, language);
      setAnswer(result);
    } catch (error) {
      console.error(error);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('settings_title')}</h1>
        <p className="text-gray-500">{t('settings_desc')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'general' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Building className="w-4 h-4" />
            {t('tab_general')}
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'compliance' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Shield className="w-4 h-4" />
            {t('tab_compliance')}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">{t('tab_general')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('company_name')}</label>
                  <input type="text" defaultValue="Sahara Trading Ltd." className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('currency')}</label>
                  <select className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500">
                    <option>SAR (Saudi Riyal)</option>
                    <option>EGP (Egyptian Pound)</option>
                    <option>USD (US Dollar)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {t('save_changes')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6 animate-fade-in">
              {/* ZATCA Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('zatca_integration')}</h3>
                    <p className="text-sm text-gray-500">{t('phase_2_ksa')}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {t('zatca_status')}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{t('digital_seal')}</span>
                    <span className="text-xs font-mono bg-white px-2 py-1 rounded border text-gray-500">CN=Sahara_ERP_Seal...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{t('csr_config')}</span>
                    <button className="text-primary-600 text-xs font-semibold hover:underline">{t('sim_mode')}</button>
                  </div>
                </div>
              </div>

              {/* ETA Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                 <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('eta_integration')}</h3>
                    <p className="text-sm text-gray-500">{t('einvoicing_egypt')}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> {t('eta_status')}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client ID (Portal)</label>
                    <input type="password" value="************************" disabled className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
                    <input type="password" value="************************" disabled className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500 text-sm" />
                  </div>
                </div>
              </div>

              {/* Regulatory Assistant Chat */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-blue-500/20 rounded-lg">
                     <MessageCircleQuestion className="w-5 h-5 text-blue-400" />
                   </div>
                   <div>
                     <h3 className="font-bold text-white">{t('comp_assistant')}</h3>
                     <p className="text-xs text-slate-400">{t('comp_desc')}</p>
                   </div>
                 </div>

                 <form onSubmit={handleAskCompliance} className="relative mb-4">
                   <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('ask_comp_placeholder')}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent pe-12"
                   />
                   <button 
                    type="submit"
                    disabled={asking || !query.trim()}
                    className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors disabled:opacity-50"
                   >
                     <Send className="w-4 h-4" />
                   </button>
                 </form>

                 {asking && (
                   <div className="flex items-center gap-2 text-sm text-slate-400 animate-pulse">
                     <Search className="w-4 h-4" />
                     {t('searching_web')}
                   </div>
                 )}

                 {answer && (
                   <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
                     <div className="text-sm text-slate-300 prose prose-invert prose-sm max-w-none">
                       <ReactMarkdown>{answer.content}</ReactMarkdown>
                     </div>
                     {answer.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-wrap gap-2">
                          {answer.sources.map((src, i) => (
                            <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] bg-slate-700 hover:bg-slate-600 text-blue-300 px-2 py-1 rounded transition-colors">
                              <ExternalLink className="w-3 h-3" />
                              {src.title}
                            </a>
                          ))}
                        </div>
                     )}
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
