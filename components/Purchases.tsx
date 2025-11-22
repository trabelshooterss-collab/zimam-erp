
import React, { useState } from 'react';
import { Plus, Filter, Download, ShoppingBag, MessageSquare, Copy, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useStore } from '../context/StoreContext';
import { PurchaseOrder } from '../types';
import { GeminiService } from '../services/geminiService';

const Purchases: React.FC = () => {
  const { t, language } = useLanguage();
  const { purchaseOrders, people, products, createPurchaseOrder, receiveStock } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPO, setNewPO] = useState<{ supplierId: string, productId: string, qty: number }>({
    supplierId: '', productId: '', qty: 10
  });

  // Negotiator State
  const [negotiating, setNegotiating] = useState<string | null>(null);
  const [negotiationDraft, setNegotiationDraft] = useState<{id: string, text: string} | null>(null);

  const handleNegotiate = async (po: PurchaseOrder) => {
    setNegotiating(po.id);
    try {
      // Assuming single item PO for MVP simplicity
      const item = po.items[0]; 
      const draft = await GeminiService.draftNegotiation(po.supplierName, item.productName, item.cost, language);
      setNegotiationDraft({ id: po.id, text: draft });
    } catch (e) {
      console.error(e);
    } finally {
      setNegotiating(null);
    }
  };

  const handleCreatePO = () => {
    if (!newPO.supplierId || !newPO.productId) return;
    const supplier = people.find(p => p.id === newPO.supplierId);
    const product = products.find(p => p.id === newPO.productId);
    if (!supplier || !product) return;

    const po: PurchaseOrder = {
        id: `PO-${Date.now().toString().slice(-4)}`,
        supplierId: supplier.id,
        supplierName: supplier.name,
        date: new Date().toISOString().split('T')[0],
        expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ productId: product.id, productName: product.name, qty: newPO.qty, cost: product.costPrice }],
        totalAmount: product.costPrice * newPO.qty,
        status: 'Ordered'
    };
    createPurchaseOrder(po);
    setIsModalOpen(false);
  };

  const suppliers = people.filter(p => p.type === 'supplier');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('purchases_title')}</h1>
          <p className="text-gray-500">{t('purchases_desc')}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t('new_po')}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('po_id')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('supplier')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('amount')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('status')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-end">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchaseOrders.map((po) => (
              <React.Fragment key={po.id}>
                <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-gray-400" />{po.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{po.supplierName}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{po.totalAmount.toLocaleString()} {t('currency_sar')}</td>
                    <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">{po.status}</span></td>
                    <td className="px-6 py-4 text-end">
                    {po.status === 'Ordered' && (
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleNegotiate(po)} disabled={negotiating === po.id} className="text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors">
                                {negotiating === po.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageSquare className="w-3 h-3" />}
                                {t('negotiate')}
                            </button>
                            <button onClick={() => receiveStock(po.id)} className="text-blue-600 hover:text-blue-800 border border-blue-200 bg-blue-50 px-2 py-1 rounded text-xs font-bold">
                                {t('status_received_action')}
                            </button>
                        </div>
                    )}
                    </td>
                </tr>
                {negotiationDraft && negotiationDraft.id === po.id && (
                    <tr>
                        <td colSpan={5} className="px-6 py-4 bg-amber-50/50">
                            <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-bold text-amber-800">{t('negotiation_draft')}</h4>
                                    <button onClick={() => { navigator.clipboard.writeText(negotiationDraft.text); setNegotiationDraft(null); }} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-xs">
                                        <Copy className="w-3 h-3" /> {t('copy_email')}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{negotiationDraft.text}</p>
                            </div>
                        </td>
                    </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create PO Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">{t('new_po')}</h2>
                <select className="w-full mb-3 border rounded p-2" value={newPO.supplierId} onChange={e => setNewPO({...newPO, supplierId: e.target.value})}>
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select className="w-full mb-3 border rounded p-2" value={newPO.productId} onChange={e => setNewPO({...newPO, productId: e.target.value})}>
                    <option value="">Select Product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input type="number" className="w-full mb-4 border rounded p-2" placeholder="Qty" value={newPO.qty} onChange={e => setNewPO({...newPO, qty: parseInt(e.target.value)})} />
                <button onClick={handleCreatePO} className="w-full bg-primary-600 text-white py-2 rounded">{t('create')}</button>
                <button onClick={() => setIsModalOpen(false)} className="w-full mt-2 text-gray-500 py-2">{t('cancel')}</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
