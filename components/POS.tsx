
import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Package, Loader2, CheckCircle, User, Printer, X, QrCode } from 'lucide-react';
import { useLanguage } from '../i18n';
import { Product, Person, Invoice } from '../types';
import { useStore } from '../context/StoreContext';
import { CartItem } from '../context/StoreContext';

interface TransactionDetails {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerName: string;
  qrCodeData?: string; // Added for ZATCA
  uuid?: string; // Added for ZATCA
}

const POS: React.FC = () => {
  const { t, language } = useLanguage();
  const { products, processOrder, people, posCart, addToCart, removeFromCart, updateCartQty, clearCart } = useStore();
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  
  // Receipt State
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<TransactionDetails | null>(null);

  const customers = people.filter(p => p.type === 'customer');

  const subtotal = posCart.reduce((sum, item) => sum + (item.product.sellingPrice * item.qty), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const customer = customers.find(c => c.id === selectedCustomerId) || null;
      
      // Capture current cart items before they are cleared
      const currentItems = [...posCart];

      const invoice: Invoice | null = await processOrder(customer);
      
      if (invoice) {
        // Capture transaction details for receipt using the REAL Invoice data
        setLastTransaction({
            id: invoice.id,
            date: invoice.date + ' ' + new Date().toLocaleTimeString(),
            items: currentItems,
            subtotal: invoice.totalAmount - invoice.taxAmount,
            tax: invoice.taxAmount,
            total: invoice.totalAmount,
            customerName: invoice.customerName,
            qrCodeData: invoice.compliance.qr_code_data,
            uuid: invoice.compliance.zatca_uuid
        });

        setShowReceipt(true);
        clearCart();
        setSelectedCustomerId('');
      }
    } catch (e) {
      console.error("Checkout failed", e);
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden relative">
      
      {/* THERMAL RECEIPT MODAL */}
      {showReceipt && lastTransaction && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Actions Header */}
            <div className="bg-gray-100 p-3 flex justify-between items-center border-b border-gray-200">
                <h3 className="font-bold text-gray-700">{t('receipt_title')}</h3>
                <div className="flex gap-2">
                    <button onClick={() => setShowReceipt(false)} className="p-2 hover:bg-gray-200 rounded text-gray-600" title={t('close')}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Receipt Area */}
            <div className="overflow-y-auto p-6 bg-white custom-scrollbar">
                <div className="w-[300px] font-mono text-sm text-gray-900 mx-auto border border-gray-100 p-4 shadow-sm">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xl font-bold mx-auto mb-2">Z</div>
                        <h2 className="font-bold text-lg uppercase">{language === 'en' ? 'Zimam Store' : 'متاجر زِمام'}</h2>
                        <p className="text-xs text-gray-500">Riyadh, Saudi Arabia</p>
                        <p className="text-xs text-gray-500">VAT: 300012345600003</p>
                    </div>

                    {/* Info */}
                    <div className="flex justify-between text-xs mb-2 border-b border-dashed border-gray-300 pb-2">
                        <span>{t('date')}: {lastTransaction.date.split(' ')[0]}</span>
                        <span>Time: {lastTransaction.date.split(' ')[1]}</span>
                    </div>
                    <div className="text-xs mb-4">
                        <span className="font-bold">{t('col_id')}:</span> {lastTransaction.id}<br/>
                        <span className="font-bold">{t('col_client')}:</span> {lastTransaction.customerName}<br/>
                        {lastTransaction.uuid && <span className="text-[8px] text-gray-400 block mt-1 break-all">UUID: {lastTransaction.uuid}</span>}
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs font-bold border-b border-gray-800 pb-1 mb-2">
                            <span className="w-1/2">{t('item')}</span>
                            <span className="w-1/4 text-center">Qty</span>
                            <span className="w-1/4 text-end">Price</span>
                        </div>
                        {lastTransaction.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs mb-1">
                                <span className="w-1/2 truncate pe-2">{item.product.name}</span>
                                <span className="w-1/4 text-center">x{item.qty}</span>
                                <span className="w-1/4 text-end">{(item.product.sellingPrice * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-dashed border-gray-300 pt-2 space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span>{t('subtotal')}</span>
                            <span>{lastTransaction.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('tax_vat')}</span>
                            <span>{lastTransaction.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-800 mt-2">
                            <span>{t('grand_total')}</span>
                            <span>{lastTransaction.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* QR Code for ZATCA */}
                    <div className="mt-6 flex flex-col items-center">
                        <div className="bg-white p-2 border border-gray-200 rounded">
                             {/* Use the real QR data generated by the backend/store logic */}
                            <QrCode className="w-24 h-24 text-gray-800" /> 
                        </div>
                        {lastTransaction.qrCodeData && (
                             <div className="text-[6px] text-gray-300 mt-1 break-all max-w-full text-center hidden">
                                 {lastTransaction.qrCodeData}
                             </div>
                        )}
                        <p className="text-[10px] text-gray-400 mt-2 text-center">Scan for E-Invoice details</p>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6 text-xs text-gray-500">
                        <p>Thank you for shopping with us!</p>
                        <p>visit www.zimam.com</p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex gap-3">
                <button onClick={() => window.print()} className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                    <Printer className="w-4 h-4" /> {t('print')}
                </button>
                <button onClick={() => setShowReceipt(false)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-bold transition-colors">
                    {t('new_sale')}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Side: Product Grid */}
      <div className="flex-1 bg-gray-50 p-4 md:p-6 flex flex-col h-full overflow-hidden">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('pos_title')}</h1>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={t('search_products')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-10 pe-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20 custom-scrollbar">
          {filteredProducts.map(product => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.currentStock <= 0}
              className={`
                bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-start group flex flex-col h-full relative overflow-hidden
                ${product.currentStock <= 0 ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary-300'}
              `}
            >
              {product.currentStock <= 0 && (
                <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center z-10">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</span>
                </div>
              )}
              <div className="bg-gray-100 rounded-lg h-32 mb-3 flex items-center justify-center text-gray-300 group-hover:text-primary-500 transition-colors w-full">
                <Package className="w-12 h-12" />
              </div>
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 flex-1">{product.name}</h3>
              <div className="flex justify-between items-center mt-auto w-full">
                <span className="font-bold text-primary-700">{product.sellingPrice} {t('currency_sar')}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.currentStock < product.reorderPoint ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {product.currentStock} {t('item')}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side: Cart */}
      <div className="w-full md:w-96 bg-white border-s border-gray-200 flex flex-col h-full shadow-xl z-10">
        {/* Customer Select */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full ps-10 pe-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Walk-in Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {t('current_order')}
          </h2>
          <button 
            onClick={clearCart}
            className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
          >
            {t('clear_cart')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {posCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <ShoppingCart className="w-12 h-12 mb-2" />
              <p>{t('empty_cart')}</p>
            </div>
          ) : (
            posCart.map(item => (
              <div key={item.product.id} className="flex items-center gap-3 bg-white border border-gray-100 p-2 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{item.product.sellingPrice} {t('currency_sar')}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <button onClick={() => updateCartQty(item.product.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                  <button onClick={() => addToCart(item.product)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Plus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-500 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{t('subtotal')}</span>
            <span>{subtotal.toFixed(2)} {t('currency_sar')}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{t('tax_vat')}</span>
            <span>{tax.toFixed(2)} {t('currency_sar')}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>{t('grand_total')}</span>
            <span>{total.toFixed(2)} {t('currency_sar')}</span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={posCart.length === 0 || processing}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            {processing ? "Processing..." : t('checkout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
