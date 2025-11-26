import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { supabase } from '../supabase';
import { Product, Invoice, Person, FinancialSnapshot } from '../types';

interface StoreContextType {
  products: Product[];
  invoices: Invoice[];
  customers: Person[];
  financials: FinancialSnapshot[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  addCustomer: (customer: Omit<Person, 'id'>) => Promise<void>;
  loading: boolean;
  refreshData: () => void;
}

export const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  // دالة جلب البيانات (مع الترجمة)
  const fetchData = async () => {
    setLoading(true);
    
    try {
      // 1. جلب المنتجات
      const { data: productsData } = await supabase.from('products').select('*');
      if (productsData) {
        const mappedProducts = productsData.map((p: any) => ({
          ...p,
          currentStock: p.current_stock,
          reorderPoint: p.reorder_point,
          costPrice: p.cost_price,
          sellingPrice: p.selling_price
        }));
        setProducts(mappedProducts);
      }

      // 2. جلب العملاء
      const { data: peopleData } = await supabase.from('people').select('*').eq('type', 'customer');
      if (peopleData) setCustomers(peopleData as any);

      // 3. جلب الفواتير
      const { data: invoicesData } = await supabase.from('invoices').select('*');
      if (invoicesData) {
        const mappedInvoices = invoicesData.map((inv: any) => ({
          ...inv,
          customerName: inv.customer_name,
          dueDate: inv.due_date,
          totalAmount: inv.total_amount,
          taxAmount: inv.tax_amount
        }));
        setInvoices(mappedInvoices);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- دوال الإضافة ---

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const dbProduct = {
      name: product.name,
      sku: product.sku,
      category: product.category,
      current_stock: product.currentStock,
      reorder_point: product.reorderPoint,
      cost_price: product.costPrice,
      selling_price: product.sellingPrice
    };
    const { error } = await supabase.from('products').insert([dbProduct]);
    if (!error) fetchData();
  };

  const addCustomer = async (customer: Omit<Person, 'id'>) => {
    const { error } = await supabase.from('people').insert([{ ...customer, type: 'customer' }]);
    if (!error) fetchData();
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    const dbInvoice = {
      type: invoice.type,
      customer_name: invoice.customerName,
      date: invoice.date,
      due_date: invoice.dueDate,
      total_amount: invoice.totalAmount,
      tax_amount: invoice.taxAmount,
      status: invoice.status,
      items: invoice.items,
      compliance: invoice.compliance
    };
    const { error } = await supabase.from('invoices').insert([dbInvoice]);
    if (!error) fetchData();
  };

  const calculateFinancials = (): FinancialSnapshot[] => {
    // التأكد من أن invoices مصفوفة قبل التصفية
    const safeInvoices = Array.isArray(invoices) ? invoices : [];

    const totalRevenue = safeInvoices
      .filter(inv => inv.type === 'SALES')
      .reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);

    const totalExpenses = safeInvoices
      .filter(inv => inv.type === 'PURCHASE')
      .reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);

    return [{
      month: 'Current',
      revenue: totalRevenue,
      expenses: totalExpenses,
      cashFlow: totalRevenue - totalExpenses,
      burnRate: 0
    }];
  };

  return (
    <StoreContext.Provider value={{
      products, invoices, customers, financials: calculateFinancials(),
      addProduct, addInvoice, addCustomer, loading, refreshData: fetchData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};