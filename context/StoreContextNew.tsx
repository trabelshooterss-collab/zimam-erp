
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Product, Invoice, Person, FinancialSnapshot } from '../types';
import apiClient from '../services/api';
import { login, logout, getCurrentUser } from '../services/authService';

interface StoreContextType {
  products: Product[];
  invoices: Invoice[];
  customers: Person[];
  financials: FinancialSnapshot[];
  user: any | null;
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<{ success: boolean; error?: string }>;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<{ success: boolean; error?: string }>;
  addCustomer: (customer: Omit<Person, 'id'>) => Promise<{ success: boolean; error?: string }>;
  refreshData: () => void;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: any }>;
  logoutUser: () => Promise<void>;
}

export const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Person[]>([]);
  const [financials, setFinancials] = useState<FinancialSnapshot[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // دالة جلب البيانات
  const fetchData = async () => {
    setLoading(true);

    try {
      // جلب التوكن
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // إذا كان توكن وهمي، استخدم بيانات وهمية
      if (token === 'mock_access_token') {
        // بيانات وهمية للمنتجات
        const mockProducts: Product[] = [
          { id: '1', name: 'آيفون 15 برو', sku: 'IP15P001', category: 'هواتف', currentStock: 3, reorderPoint: 10, costPrice: 4000, sellingPrice: 5000, lastRestocked: '2024-12-20' },
          { id: '2', name: 'سامسونج S24', sku: 'SS24U001', category: 'هواتف', currentStock: 15, reorderPoint: 10, costPrice: 3500, sellingPrice: 4500, lastRestocked: '2024-12-18' },
          { id: '3', name: 'لابتوب ديل', sku: 'DLX15P001', category: 'أجهزة', currentStock: 8, reorderPoint: 5, costPrice: 3000, sellingPrice: 4000, lastRestocked: '2024-12-15' },
        ];
        setProducts(mockProducts);

        // بيانات وهمية للعملاء
        const mockCustomers: Person[] = [
          { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', phone: '01234567890', type: 'customer', address: 'القاهرة', balance: 500 },
          { id: '2', name: 'محمد علي', email: 'mohammed@example.com', phone: '01234567891', type: 'customer', address: 'الجيزة', balance: 1000 },
          { id: '3', name: 'عمر خالد', email: 'omar@example.com', phone: '01234567892', type: 'customer', address: 'الإسكندرية', balance: 750 },
        ];
        setCustomers(mockCustomers);

        // بيانات وهمية للفواتير
        const mockInvoices: Invoice[] = [
          { 
            id: '1', 
            type: 'SALES' as any, 
            customerName: 'أحمد محمد', 
            date: '2024-01-15', 
            dueDate: '2024-02-15', 
            items: [{ productId: '1', productName: 'آيفون 15 برو', quantity: 1, unitPrice: 5000, total: 5000 }],
            totalAmount: 5000, 
            taxAmount: 250, 
            status: 'PAID' as any,
            compliance: { qr_code_data: 'QR_CODE_1' }
          },
          { 
            id: '2', 
            type: 'SALES' as any, 
            customerName: 'محمد علي', 
            date: '2024-01-16', 
            dueDate: '2024-02-16', 
            items: [{ productId: '2', productName: 'سامسونج S24', quantity: 2, unitPrice: 4500, total: 9000 }],
            totalAmount: 4500, 
            taxAmount: 225, 
            status: 'PENDING' as any,
            compliance: { qr_code_data: 'QR_CODE_2' }
          },
          { 
            id: '3', 
            type: 'PURCHASE' as any, 
            customerName: 'المورد أ', 
            date: '2024-01-10', 
            dueDate: '2024-02-10', 
            items: [{ productId: '1', productName: 'آيفون 15 برو', quantity: 10, unitPrice: 3000, total: 30000 }],
            totalAmount: 12000, 
            taxAmount: 600, 
            status: 'PAID' as any,
            compliance: { qr_code_data: 'QR_CODE_3' }
          },
        ];
        setInvoices(mockInvoices);

        setLoading(false);
        return;
      }

      // 1. جلب المنتجات
      const productsResponse = await apiClient.get('/inventory/products/');
      if (productsResponse.data) {
        const mappedProducts = productsResponse.data.map((p: any) => ({
          ...p,
          currentStock: p.current_stock,
          reorderPoint: p.reorder_point,
          costPrice: p.cost_price,
          sellingPrice: p.selling_price
        }));
        setProducts(mappedProducts);
      }

      // 2. جلب العملاء
      const customersResponse = await apiClient.get('/sales/customers/');
      if (customersResponse.data) {
        setCustomers(customersResponse.data);
      }

      // 3. جلب الفواتير
      const invoicesResponse = await apiClient.get('/sales/invoices/');
      if (invoicesResponse.data) {
        const mappedInvoices = invoicesResponse.data.map((inv: any) => ({
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
      setLoading(false);
    }
  };

  // دالة تسجيل الدخول
  const loginUser = async (email: string, password: string) => {
    try {
      console.debug(`🔐 محاولة تسجيل دخول: ${email}`);
      const result = await login(email, password);
      
      if (result.success && result.user) {
        console.debug(`✅ تم تسجيل الدخول بنجاح: ${email}`);
        setUser(result.user);
        
        // محاولة جلب البيانات، لكن لا تفشل تسجيل الدخول إذا فشلت
        try {
          await fetchData();
        } catch (fetchError) {
          console.warn('Warning: Could not fetch data:', fetchError);
        }
        
        return { success: true, user: result.user };
      }
      
      console.debug(`❌ فشل تسجيل الدخول: ${result.error}`);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'فشل الاتصال بالخادم' };
    }
  };

  // دالة تسجيل الخروج
  const logoutUser = async () => {
    await logout();
    setUser(null);
    setProducts([]);
    setInvoices([]);
    setCustomers([]);
    setFinancials([]);
  };

  // جلب المستخدم الحالي عند تحميل التطبيق
  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await fetchData();
        } else {
          // التوكن غير صالح، تسجيل الخروج
          await logoutUser();
        }
      } else {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  // حساب البيانات المالية
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

  // تحديث البيانات المالية عند تغيير الفواتير
  useEffect(() => {
    setFinancials(calculateFinancials());
  }, [invoices]);

  // دوال الإضافة
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await apiClient.post('/inventory/products/', product);
      if (response.data) {
        await fetchData();
        return { success: true };
      }
      return { success: false, error: 'فشل إضافة المنتج' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'فشل إضافة المنتج' };
    }
  };

  const addCustomer = async (customer: Omit<Person, 'id'>) => {
    try {
      const response = await apiClient.post('/sales/customers/', customer);
      if (response.data) {
        await fetchData();
        return { success: true };
      }
      return { success: false, error: 'فشل إضافة العميل' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'فشل إضافة العميل' };
    }
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    try {
      const response = await apiClient.post('/sales/invoices/', invoice);
      if (response.data) {
        await fetchData();
        return { success: true };
      }
      return { success: false, error: 'فشل إضافة الفاتورة' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'فشل إضافة الفاتورة' };
    }
  };

  return (
    <StoreContext.Provider value={{
      products, invoices, customers, financials, user,
      addProduct, addInvoice, addCustomer, loading, 
      refreshData: fetchData, loginUser, logoutUser
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
