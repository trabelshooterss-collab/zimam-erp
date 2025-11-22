
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Package, Globe, Edit, X, Camera, TrendingUp, Loader2, CheckCircle } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { Product, InventoryPrediction, VisualAuditResult } from '../types';
import { useLanguage } from '../i18n';
import { useStore } from '../context/StoreContext';
import ReactMarkdown from 'react-markdown';

const Inventory: React.FC = () => {
  const { products, adjustStock, updateProductPrice } = useStore();
  const [predictions, setPredictions] = useState<Record<string, InventoryPrediction>>({});
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();
  
  // Adjustment State
  const [adjModal, setAdjModal] = useState<{isOpen: boolean, product: Product | null}>({isOpen: false, product: null});
  const [adjQty, setAdjQty] = useState(0);
  const [adjReason, setAdjReason] = useState('Damage');

  // Genius Features State
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<VisualAuditResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAuditProduct, setSelectedAuditProduct] = useState<Product | null>(null);
  
  const [priceCheckLoading, setPriceCheckLoading] = useState<string | null>(null);
  const [priceAnalysis, setPriceAnalysis] = useState<{id: string, text: string} | null>(null);
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);

  useEffect(() => {
    setPredictions({});
  }, [language]);

  const runAiPrediction = async () => {
    setLoading(true);
    try {
      const results = await GeminiService.predictInventoryNeeds(products, language);
      const predMap: Record<string, InventoryPrediction> = {};
      results.forEach(r => {
        const prod = products.find(p => p.name === r.productName);
        if(prod) predMap[prod.id] = r;
      });
      setPredictions(predMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVisualAudit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files?.[0] || !selectedAuditProduct) return;
    
    setAuditLoading(true);
    setAuditResult(null);
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (evt) => {
        if(evt.target?.result) {
           const base64 = (evt.target.result as string).split(',')[1];
           const result = await GeminiService.analyzeShelfImage(base64, selectedAuditProduct.currentStock, selectedAuditProduct.name, language);
           setAuditResult(result);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    } finally {
      setAuditLoading(false);
    }
  };

  const applyAuditCount = () => {
    if(selectedAuditProduct && auditResult) {
        adjustStock(selectedAuditProduct.id, auditResult.detectedCount, 'Visual Audit Correction');
        setAuditResult(null);
        setSelectedAuditProduct(null);
    }
  };

  const handlePriceCheck = async (product: Product) => {
    setPriceCheckLoading(product.id);
    setPriceAnalysis(null);
    setSuggestedPrice(null);
    try {
      const text = await GeminiService.checkCompetitorPrices(product.name, product.sellingPrice, language);
      setPriceAnalysis({ id: product.id, text });
      
      // Simple regex to try and find a suggested price in the text (heuristic)
      const match = text.match(/(\d+)\s*(?:SAR|EGP|SR|ج\.م)/);
      if(match) {
          setSuggestedPrice(parseInt(match[1]));
      }
    } catch (e) {
       console.error(e);
    } finally {
       setPriceCheckLoading(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('inventory_mgmt')}</h1>
          <p className="text-gray-500">{t('inventory_desc')}</p>
        </div>
        <button
          onClick={runAiPrediction}
          disabled={loading}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2 font-medium transition-all disabled:opacity-70"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {loading ? t('analyzing_web') : t('run_ai_live')}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('col_product')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">{t('col_stock')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50/50 border-s border-indigo-100 w-1/4">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {t('col_ai')}
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-end">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const prediction = predictions[product.id];
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sellingPrice} {t('currency_sar')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.currentStock}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 border-s border-indigo-50 bg-indigo-50/30">
                      {prediction ? (
                        <div className="animate-in fade-in">
                          <span className="text-lg font-bold text-indigo-700">{prediction.suggestedReorderPoint}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        {/* Visual Audit Button */}
                        <button 
                          onClick={() => { setSelectedAuditProduct(product); fileInputRef.current?.click(); }}
                          className="text-gray-400 hover:text-blue-600 p-1" 
                          title={t('visual_audit')}
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        
                        {/* Price Check Button */}
                        <button 
                           onClick={() => handlePriceCheck(product)}
                           disabled={priceCheckLoading === product.id}
                           className="text-gray-400 hover:text-green-600 p-1"
                           title={t('market_check')}
                        >
                           {priceCheckLoading === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                        </button>

                        <button onClick={() => { setAdjModal({isOpen: true, product}); setAdjQty(product.currentStock); }} className="text-gray-400 hover:text-primary-600 p-1">
                           <Edit className="w-4 h-4" />
                        </button>
                      </div>
                      {priceAnalysis && priceAnalysis.id === product.id && (
                          <div className="mt-2 text-xs text-left bg-green-50 p-2 rounded border border-green-100 animate-in fade-in">
                              <p className="font-bold text-green-800 mb-1">{t('market_check_res')}:</p>
                              <p className="mb-2">{priceAnalysis.text}</p>
                              {suggestedPrice && suggestedPrice !== product.sellingPrice && (
                                  <button 
                                    onClick={() => updateProductPrice(product.id, suggestedPrice)}
                                    className="bg-green-600 text-white px-2 py-1 rounded text-[10px] flex items-center gap-1"
                                  >
                                      {t('apply_price')} {suggestedPrice}
                                  </button>
                              )}
                          </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden File Input for Audit */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleVisualAudit} />

      {/* Visual Audit Result Modal */}
      {auditLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                  <p>{t('analyzing')}</p>
              </div>
          </div>
      )}

      {auditResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={() => setAuditResult(null)} className="absolute top-4 end-4"><X className="w-5 h-5" /></button>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-600" /> {t('visual_audit')}
                </h2>
                <div className="space-y-4 text-center">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase">AI Counted</p>
                            <p className="text-2xl font-bold text-gray-900">{auditResult.detectedCount}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${auditResult.discrepancy !== 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                            <p className="text-xs text-gray-500 uppercase">Discrepancy</p>
                            <p className={`text-2xl font-bold ${auditResult.discrepancy !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {auditResult.discrepancy > 0 ? '+' : ''}{auditResult.discrepancy}
                            </p>
                        </div>
                    </div>
                    <div className="text-left bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                        <span className="font-bold">Advice: </span>{auditResult.advice}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setAuditResult(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg">{t('cancel')}</button>
                        <button onClick={applyAuditCount} className="flex-1 bg-primary-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" /> {t('apply_count')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
      
      {/* Adjust Modal */}
      {adjModal.isOpen && adjModal.product && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">{t('adjust_stock')}</h2>
                    <button onClick={() => setAdjModal({isOpen: false, product: null})}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="space-y-4">
                    <input type="number" className="w-full rounded-lg border-gray-300" value={adjQty} onChange={e => setAdjQty(parseInt(e.target.value))} />
                    <select className="w-full rounded-lg border-gray-300" value={adjReason} onChange={e => setAdjReason(e.target.value)}>
                        <option value="Damage">{t('reason_damage')}</option>
                        <option value="Theft">{t('reason_theft')}</option>
                    </select>
                </div>
                <div className="mt-6 flex gap-3">
                    <button onClick={() => { adjustStock(adjModal.product!.id, adjQty, adjReason); setAdjModal({isOpen: false, product: null}); }} className="w-full bg-primary-600 text-white py-2 rounded-lg">{t('confirm_adjust')}</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
