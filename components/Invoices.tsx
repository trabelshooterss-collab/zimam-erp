
import React, { useState } from 'react';
import { FileText, QrCode, Download, ShieldCheck, Plus, X, Loader2, RotateCcw } from 'lucide-react';
import { Invoice, InvoiceType, PaymentStatus } from '../types';
import { useLanguage } from '../i18n';
import { useStore } from '../context/StoreContext';

const Invoices: React.FC = () => {
  const { t } = useLanguage();
  // Connect to Store
  const { invoices, addInvoice, refundInvoice, generateZatcaQR } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [newInv, setNewInv] = useState({ customer: '', amount: '' });

  const handleCreateInvoice = () => {
    setIsSigning(true);
    
    setTimeout(() => {
      const amount = parseFloat(newInv.amount) || 0;
      const tax = amount * 0.15;
      const total = amount + tax; // Ensure total is correct logic (Amount + Tax) for the demo input
      const timestamp = new Date().toISOString();
      
      // Generate real ZATCA QR Data using the Context Function
      const qrData = generateZatcaQR(
        "Zimam Store",
        "300012345600003",
        timestamp,
        total.toFixed(2),
        tax.toFixed(2)
      );

      const createdInvoice: Invoice = {
        id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        type: InvoiceType.SALES,
        customerName: newInv.customer,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [], // Manual invoice has no line items for demo
        totalAmount: total,
        taxAmount: tax,
        status: PaymentStatus.PENDING,
        compliance: {
          zatca_uuid: crypto.randomUUID(),
          zatca_hash: 'SHA256:' + Math.random().toString(36).substring(2, 15),
          qr_code_data: qrData
        }
      };

      addInvoice(createdInvoice);
      setIsSigning(false);
      setIsModalOpen(false);
      setNewInv({ customer: '', amount: '' });
    }, 1500);
  };

  const handleRefund = (id: string) => {
    if(confirm('Are you sure you want to refund this invoice? This will reverse the transaction and restore stock.')) {
        refundInvoice(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('invoices')}</h1>
          <p className="text-gray-500">{t('manage_billing')}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('new_invoice')}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('col_id')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('col_client')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('col_date')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('col_amount')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('col_status')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('col_compliance')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-end">{t('col_actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400 italic">
                        No invoices yet. Create one or check out at POS.
                    </td>
                </tr>
            ) : invoices.map((inv) => (
              <tr key={inv.id} className={`hover:bg-gray-50 animate-in fade-in slide-in-from-bottom-1 ${inv.status === PaymentStatus.REFUNDED ? 'bg-gray-50 opacity-75' : ''}`}>
                <td className="px-6 py-4 font-medium text-gray-900 relative">
                    {inv.status === PaymentStatus.REFUNDED && (
                        <span className="absolute top-3 left-1 text-[10px] text-red-500 font-bold -rotate-12 border border-red-200 px-1 rounded">RETURNED</span>
                    )}
                    {inv.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{inv.customerName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{inv.date}</td>
                <td className={`px-6 py-4 text-sm font-bold ${inv.status === PaymentStatus.REFUNDED ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {inv.totalAmount.toLocaleString()} <span className="text-xs font-normal text-gray-500">{t('currency_sar')}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${inv.status === PaymentStatus.PAID ? 'bg-green-100 text-green-800' : 
                      inv.status === PaymentStatus.REFUNDED ? 'bg-gray-200 text-gray-800' : 'bg-amber-100 text-amber-800'}
                  `}>
                    {inv.status === PaymentStatus.PAID ? t('status_paid') : 
                     inv.status === PaymentStatus.REFUNDED ? t('status_refunded') : t('status_pending')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {inv.compliance.zatca_uuid && (
                      <div className="group relative">
                        <span className="cursor-help bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-1 rounded border border-purple-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> ZATCA
                        </span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded p-2 hidden group-hover:block z-50 shadow-xl">
                          <div className="font-semibold mb-1 text-purple-300">{t('lbl_uuid')}:</div>
                          <div className="break-all opacity-80 mb-2 font-mono text-[10px]">{inv.compliance.zatca_uuid}</div>
                          {inv.compliance.zatca_hash && (
                            <>
                                <div className="font-semibold mb-1 text-purple-300">{t('lbl_hash')}:</div>
                                <div className="break-all opacity-80 font-mono text-[10px]">{inv.compliance.zatca_hash}</div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    {inv.compliance.eta_uuid && (
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                           <ShieldCheck className="w-3 h-3" /> ETA
                      </span>
                    )}
                    {inv.compliance.qr_code_data && (
                        <div className="group relative">
                            <QrCode className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-white border border-gray-200 p-2 rounded shadow-lg hidden group-hover:block z-50">
                                <div className="text-[10px] text-gray-500 text-center mb-1">Base64 TLV</div>
                                <div className="w-28 h-28 bg-gray-100 flex items-center justify-center text-gray-400 text-[8px] break-all p-1 overflow-hidden">
                                    {inv.compliance.qr_code_data.substring(0, 50)}...
                                </div>
                            </div>
                        </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-end flex items-center justify-end gap-2">
                  {inv.status !== PaymentStatus.REFUNDED && (
                    <button onClick={() => handleRefund(inv.id)} className="text-red-400 hover:text-red-600" title={t('refund')}>
                        <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-primary-600">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">{t('create_invoice_title')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('col_client')}</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  value={newInv.customer}
                  onChange={e => setNewInv({...newInv, customer: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('amount')} (Before Tax) ({t('currency_sar')})</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  value={newInv.amount}
                  onChange={e => setNewInv({...newInv, amount: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button 
                onClick={handleCreateInvoice}
                disabled={!newInv.customer || !newInv.amount || isSigning}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {isSigning ? t('sim_signing') : t('create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
