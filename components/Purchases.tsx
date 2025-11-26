import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Trash2, Edit } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Purchases = () => {
  const { invoices = [], addInvoice } = useStore(); // ضمنا إنها مصفوفة حتى لو فاضية
  const [showAddModal, setShowAddModal] = useState(false);

  // الحل السحري: علامة الاستفهام والـ OR operator
  // ده بيمنع الصفحة تقع لو البيانات لسه بتحمل
  const purchaseInvoices = invoices?.filter(inv => inv.type === 'PURCHASE') || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">المشتريات</h1>
          <p className="text-slate-600 dark:text-slate-400">إدارة فواتير الشراء والموردين</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          فاتورة شراء جديدة
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="بحث في المشتريات..." 
              className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
              <Filter className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <button className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
              <Download className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium">
              <tr>
                <th className="p-4">رقم الفاتورة</th>
                <th className="p-4">المورد</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">المبلغ</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {purchaseInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    لا توجد فواتير مشتريات حتى الآن
                  </td>
                </tr>
              ) : (
                purchaseInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="p-4 font-medium">#{invoice.id.slice(0, 8)}</td>
                    <td className="p-4">{invoice.customerName || 'مورد عام'}</td>
                    <td className="p-4">{new Date(invoice.date).toLocaleDateString('ar-EG')}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {Number(invoice.totalAmount).toLocaleString()} ر.س
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {invoice.status === 'PAID' ? 'مدفوع' : 'معلق'}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button className="p-1 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Purchases;