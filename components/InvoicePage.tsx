
import React from 'react';
import { motion } from 'framer-motion';
import { Printer, Share2, Download, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Mock data, in a real app this would come from props or a data store
const invoiceData = {
  id: 'INV-2025-001',
  date: 'November 29, 2025',
  dueDate: 'December 29, 2025',
  customer: {
    name: 'Ahmed El-Masry',
    address: '123 Nile St, Cairo, Egypt',
    email: 'ahmed.m@example.com'
  },
  company: {
    name: 'Zimam AI ERP',
    address: '456 Business Hub, Riyadh, KSA',
    email: 'billing@zimam.ai'
  },
  items: [
    { id: 1, description: 'Rim Repair & Diamond Cut (x2)', quantity: 2, unitPrice: 750, total: 1500 },
    { id: 2, description: 'Full Body Nano-Ceramic Coating', quantity: 1, unitPrice: 2500, total: 2500 },
    { id: 3, description: 'Premium Engine Oil Change', quantity: 1, unitPrice: 450, total: 450 },
  ],
  subtotal: 4450,
  tax: 623, // 14% VAT
  total: 5073,
  status: 'Unpaid',
};

const paymentGateways = [
    { name: 'Stripe', icon: CreditCard, color: 'purple' },
    { name: 'PayPal', icon: CreditCard, color: 'blue' },
    { name: 'Mada', icon: CreditCard, color: 'green' },
    { name: 'STC Pay', icon: CreditCard, color: 'indigo' },
    { name: 'Paymob', icon: CreditCard, color: 'red' },
    { name: 'Fawry', icon: CreditCard, color: 'yellow' },
]

const InvoicePage: React.FC = () => {
  const { theme } = useTheme();
  const { t, dir } = useLanguage();

  const getStatusPill = (status: string) => {
    if (status === 'Paid') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'Unpaid') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`min-h-screen font-sans p-4 sm:p-8 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`} dir={dir}>
      <div className="max-w-4xl mx-auto">

        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            {t('invoice')} #{invoiceData.id}
          </h1>
          <div className="flex items-center gap-2">
            <button className="btn-secondary p-2 sm:p-3"><Download size={18} /></button>
            <button className="btn-secondary p-2 sm:p-3"><Printer size={18} /></button>
            <button className="btn-secondary p-2 sm:p-3"><Share2 size={18} /></button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className={`p-6 sm:p-10 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
          
          {/* Invoice Header */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-1">
              <h2 className="font-bold text-xl text-blue-600 dark:text-blue-400">Zimam AI ERP</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{invoiceData.company.address}</p>
            </div>
            <div className="md:col-span-2 text-right">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusPill(invoiceData.status)}`}>
                {invoiceData.status === 'Paid' ? t('status_paid') : invoiceData.status === 'Unpaid' ? t('status_unpaid') : t('status_overdue')}
              </span>
            </div>
          </div>

          {/* Customer and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="font-semibold text-slate-500 dark:text-slate-400 mb-2">{t('billed_to')}</h3>
              <p className="font-bold text-lg text-slate-800 dark:text-white">{invoiceData.customer.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{invoiceData.customer.address}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{invoiceData.customer.email}</p>
            </div>
            <div className="text-left md:text-right">
                <div className="mb-4">
                    <h3 className="font-semibold text-slate-500 dark:text-slate-400">{t('invoice_date')}</h3>
                    <p className="font-medium text-slate-800 dark:text-white">{invoiceData.date}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-500 dark:text-slate-400">{t('due_date')}</h3>
                    <p className="font-medium text-slate-800 dark:text-white">{invoiceData.dueDate}</p>
                </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm">
              <thead className={`border-b-2 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                <tr>
                  <th className="p-3 text-right font-semibold text-slate-600 dark:text-slate-400">{t('item')}</th>
                  <th className="p-3 text-center font-semibold text-slate-600 dark:text-slate-400">{t('quantity')}</th>
                  <th className="p-3 text-center font-semibold text-slate-600 dark:text-slate-400">{t('unit_price')}</th>
                  <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-400">{t('total')}</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map(item => (
                  <tr key={item.id} className={`border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                    <td className="p-3 font-medium text-slate-800 dark:text-white">{item.description}</td>
                    <td className="p-3 text-center text-slate-600 dark:text-slate-300">{item.quantity}</td>
                    <td className="p-3 text-center text-slate-600 dark:text-slate-300">{item.unitPrice.toLocaleString()} {t('currency')}</td>
                    <td className="p-3 text-left font-medium text-slate-800 dark:text-white">{item.total.toLocaleString()} {t('currency')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-10">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2 text-slate-600 dark:text-slate-300"><span>{t('subtotal')}</span><span>{invoiceData.subtotal.toLocaleString()} {t('currency')}</span></div>
              <div className="flex justify-between py-2 text-slate-600 dark:text-slate-300"><span>{t('tax')} (14%)</span><span>{invoiceData.tax.toLocaleString()} {t('currency')}</span></div>
              <div className={`flex justify-between py-3 text-2xl font-bold border-t-2 ${theme === 'dark' ? 'text-white border-slate-700' : 'text-slate-900 border-slate-200'}`}><span>{t('total')}</span><span>{invoiceData.total.toLocaleString()} {t('currency')}</span></div>
            </div>
          </div>
          
          {/* Payment Section */}
          {invoiceData.status === 'Unpaid' && (
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-900/70' : 'bg-slate-50'}`}>
              <h3 className="font-bold text-center text-slate-800 dark:text-white mb-4">{t('pay_now_with')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {paymentGateways.map(gw => (
                    <button key={gw.name} className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-semibold bg-white dark:bg-slate-700/50 border dark:border-slate-600 hover:scale-105 transition-transform`}>
                        <gw.icon size={20} className={`text-${gw.color}-500`} />
                        <span className="dark:text-white">{gw.name}</span>
                    </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};

export default InvoicePage;
