
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Invoice, InvoiceType, PaymentStatus, Person, PurchaseOrder, User } from '../types';

// --- Initial Mock Data (Seed Database) ---

const initialProducts: Product[] = [
  { id: '1', name: 'Premium Dates (Ajwa)', sku: 'DATES-001', category: 'Food', currentStock: 150, reorderPoint: 100, costPrice: 45, sellingPrice: 80, lastRestocked: '2023-10-15' },
  { id: '2', name: 'Arabic Coffee (Blend)', sku: 'COF-AR-02', category: 'Beverage', currentStock: 40, reorderPoint: 50, costPrice: 30, sellingPrice: 65, lastRestocked: '2023-11-01' },
  { id: '3', name: 'Saffron (10g)', sku: 'SPICE-SAF', category: 'Spices', currentStock: 12, reorderPoint: 10, costPrice: 120, sellingPrice: 200, lastRestocked: '2023-09-20' },
  { id: '4', name: 'Incense Burner (Gold)', sku: 'HOME-INC', category: 'Home', currentStock: 200, reorderPoint: 50, costPrice: 80, sellingPrice: 150, lastRestocked: '2023-08-05' },
  { id: '5', name: 'Oud Perfume 100ml', sku: 'PERF-OUD', category: 'Fragrance', currentStock: 55, reorderPoint: 20, costPrice: 150, sellingPrice: 350, lastRestocked: '2023-12-01' },
  { id: '6', name: 'Gift Box (Large)', sku: 'BOX-L', category: 'Packaging', currentStock: 500, reorderPoint: 100, costPrice: 10, sellingPrice: 25, lastRestocked: '2024-01-10' },
];

const initialPeople: Person[] = [
  { id: 'C1', type: 'customer', name: 'Al-Amal Trading Co.', phone: '+966 50 123 4567', email: 'contact@alamal.com', address: 'Riyadh, Olaya St.', balance: 5000 },
  { id: 'C2', type: 'customer', name: 'Cairo Tech Solutions', phone: '+20 100 987 6543', email: 'info@cairotech.eg', address: 'Cairo, Maadi', balance: 12500 },
  { id: 'S1', type: 'supplier', name: 'National Food Industries', phone: '+966 11 222 3333', email: 'sales@nfi.sa', address: 'Riyadh, Industrial City', balance: 15000 },
  { id: 'S2', type: 'supplier', name: 'Delta Imports', phone: '+20 2 3333 4444', email: 'orders@delta.eg', address: 'Alexandria, Port', balance: 3500 },
];

const initialPOs: PurchaseOrder[] = [
  { id: 'PO-0012', supplierId: 'S1', supplierName: 'National Food Industries', date: '2024-05-01', expectedDate: '2024-05-05', items: [{productId: '1', productName: 'Premium Dates', qty: 100, cost: 45}], totalAmount: 4500, status: 'Received' },
];

const initialEntries = [
  { id: 'JE-1001', date: '2024-05-10', description: 'Opening Balance', account: '1010 Cash on Hand', debit: 50000, credit: 0 },
  { id: 'JE-1001', date: '2024-05-10', description: 'Opening Balance', account: '3000 Owners Equity', debit: 0, credit: 50000 },
];

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

interface StoreContextType {
  products: Product[];
  invoices: Invoice[];
  journalEntries: JournalEntry[];
  people: Person[];
  purchaseOrders: PurchaseOrder[];
  posCart: CartItem[];
  
  // Actions
  processOrder: (customer: Person | null) => Promise<Invoice | null>;
  updateProductStock: (id: string, qty: number) => void;
  updateProductPrice: (id: string, newPrice: number) => void;
  addInvoice: (invoice: Invoice) => void;
  
  addPerson: (person: Person) => void;
  createPurchaseOrder: (po: PurchaseOrder) => void;
  receiveStock: (poId: string) => void;
  
  refundInvoice: (invoiceId: string) => void;
  adjustStock: (productId: string, newQty: number, reason: string) => void;
  
  // Cart Actions (Global for Voice)
  addToCart: (product: Product) => void;
  addToCartByName: (productName: string, qty: number) => boolean;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, delta: number) => void;
  clearCart: () => void;

  // Helpers
  generateZatcaQR: (sellerName: string, taxId: string, date: string, total: string, tax: string) => string;

  refreshData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- State Initialization ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sahara_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem('sahara_people');
    return saved ? JSON.parse(saved) : initialPeople;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('sahara_pos');
    return saved ? JSON.parse(saved) : initialPOs;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('sahara_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('sahara_journal');
    return saved ? JSON.parse(saved) : initialEntries;
  });

  // Global Cart State
  const [posCart, setPosCart] = useState<CartItem[]>([]);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('sahara_products', JSON.stringify(products));
    localStorage.setItem('sahara_invoices', JSON.stringify(invoices));
    localStorage.setItem('sahara_journal', JSON.stringify(journalEntries));
    localStorage.setItem('sahara_people', JSON.stringify(people));
    localStorage.setItem('sahara_pos', JSON.stringify(purchaseOrders));
  }, [products, invoices, journalEntries, people, purchaseOrders]);

  const refreshData = () => {
    setProducts(initialProducts);
    setInvoices([]);
    setJournalEntries(initialEntries);
    setPeople(initialPeople);
    setPurchaseOrders(initialPOs);
    setPosCart([]);
  };

  const updateProductStock = (id: string, qty: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, currentStock: qty } : p));
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, sellingPrice: newPrice } : p));
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  // --- Helpers ---
  /**
   * Generates a ZATCA (KSA) Compliant QR Code.
   * Implements TLV (Tag-Length-Value) encoding + Base64.
   */
  const generateZatcaQR = (sellerName: string, taxId: string, date: string, total: string, tax: string): string => {
    const textEncoder = new TextEncoder();
    
    const getTlv = (tag: number, value: string): Uint8Array => {
      const valueBytes = textEncoder.encode(value);
      const result = new Uint8Array(2 + valueBytes.length);
      result[0] = tag; // Tag
      result[1] = valueBytes.length; // Length
      result.set(valueBytes, 2); // Value
      return result;
    };

    const tags = [
      getTlv(1, sellerName),
      getTlv(2, taxId),
      getTlv(3, date),
      getTlv(4, total),
      getTlv(5, tax)
    ];

    // Concatenate all TLV byte arrays
    const totalLength = tags.reduce((acc, curr) => acc + curr.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    tags.forEach(tag => {
      combined.set(tag, offset);
      offset += tag.length;
    });

    // Convert to Base64
    return btoa(String.fromCharCode.apply(null, Array.from(combined)));
  };

  // --- Global Cart Methods ---
  const addToCart = (product: Product) => {
    if (product.currentStock <= 0) return;
    setPosCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.currentStock) return prev;
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const addToCartByName = (productName: string, qty: number): boolean => {
    const product = products.find(p => p.name.toLowerCase().includes(productName.toLowerCase()));
    if (product) {
      if (product.currentStock < qty) return false;
      setPosCart(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
           return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + qty } : item);
        }
        return [...prev, { product, qty: qty }];
      });
      return true;
    }
    return false;
  };

  const removeFromCart = (id: string) => {
    setPosCart(prev => prev.filter(item => item.product.id !== id));
  };

  const updateCartQty = (id: string, delta: number) => {
    setPosCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        if (newQty > item.product.currentStock) return item;
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setPosCart([]);

  // --- Business Logic Methods ---

  const addPerson = (person: Person) => {
    setPeople(prev => [...prev, person]);
  };

  const createPurchaseOrder = (po: PurchaseOrder) => {
    setPurchaseOrders(prev => [po, ...prev]);
  };

  const receiveStock = (poId: string) => {
    const poIndex = purchaseOrders.findIndex(p => p.id === poId);
    if (poIndex === -1) return;
    
    const po = purchaseOrders[poIndex];
    if (po.status === 'Received') return; 

    const updatedPOs = [...purchaseOrders];
    updatedPOs[poIndex] = { ...po, status: 'Received' };
    setPurchaseOrders(updatedPOs);

    const updatedProducts = [...products];
    po.items.forEach(item => {
      const prodIndex = updatedProducts.findIndex(p => p.id === item.productId);
      if (prodIndex > -1) {
        updatedProducts[prodIndex] = {
          ...updatedProducts[prodIndex],
          currentStock: updatedProducts[prodIndex].currentStock + item.qty,
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
    });
    setProducts(updatedProducts);

    const date = new Date().toISOString().split('T')[0];
    const jeId = `JE-${Date.now()}`;
    
    const debitEntry: JournalEntry = {
      id: jeId, date, description: `Received PO #${po.id}`,
      account: '1200 Inventory', debit: po.totalAmount, credit: 0
    };

    const creditEntry: JournalEntry = {
      id: jeId, date, description: `Payable for PO #${po.id}`,
      account: '2100 Accounts Payable', debit: 0, credit: po.totalAmount
    };

    setJournalEntries(prev => [...prev, debitEntry, creditEntry]);
  };

  const processOrder = async (customer: Person | null): Promise<Invoice | null> => {
    if (posCart.length === 0) return null;
    const date = new Date().toISOString().split('T')[0];
    // ISO 8601 timestamp for QR Code
    const timestamp = new Date().toISOString();
    
    const subtotal = posCart.reduce((sum, item) => sum + (item.product.sellingPrice * item.qty), 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    const invoiceId = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;

    const updatedProducts = products.map(p => {
      const cartItem = posCart.find(c => c.product.id === p.id);
      if (cartItem) {
        return { ...p, currentStock: p.currentStock - cartItem.qty };
      }
      return p;
    });
    setProducts(updatedProducts);

    // Generate real ZATCA QR Code Data
    const qrData = generateZatcaQR(
      "Zimam Store", 
      "300012345600003", 
      timestamp, 
      total.toFixed(2), 
      tax.toFixed(2)
    );

    const newInvoice: Invoice = {
      id: invoiceId,
      type: InvoiceType.SALES,
      customerName: customer ? customer.name : 'Walk-in Customer',
      date: date,
      dueDate: date, 
      items: posCart.map(c => ({
        productId: c.product.id,
        productName: c.product.name,
        quantity: c.qty,
        unitPrice: c.product.sellingPrice,
        total: c.product.sellingPrice * c.qty
      })),
      totalAmount: total,
      taxAmount: tax,
      status: PaymentStatus.PAID,
      compliance: {
        zatca_uuid: crypto.randomUUID(),
        zatca_hash: 'SHA256:' + Math.random().toString(36).substr(2, 10),
        qr_code_data: qrData
      }
    };
    setInvoices(prev => [newInvoice, ...prev]);

    const jeId = `JE-${Date.now()}`;
    
    const debitEntry: JournalEntry = {
      id: jeId, date, description: `Sales Invoice #${invoiceId}`,
      account: '1010 Cash on Hand', debit: total, credit: 0
    };

    const creditSales: JournalEntry = {
      id: jeId, date, description: `Sales Revenue #${invoiceId}`,
      account: '4000 Sales Income', debit: 0, credit: subtotal
    };

    const creditTax: JournalEntry = {
      id: jeId, date, description: `VAT Output Tax #${invoiceId}`,
      account: '2030 VAT Payable', debit: 0, credit: tax
    };

    setJournalEntries(prev => [...prev, debitEntry, creditSales, creditTax]);
    return newInvoice;
  };

  const refundInvoice = (invoiceId: string) => {
    const invIndex = invoices.findIndex(i => i.id === invoiceId);
    if(invIndex === -1) return;
    const inv = invoices[invIndex];
    if(inv.status === PaymentStatus.REFUNDED) return;

    const updatedInvoices = [...invoices];
    updatedInvoices[invIndex] = { ...inv, status: PaymentStatus.REFUNDED };
    setInvoices(updatedInvoices);

    const updatedProducts = [...products];
    inv.items.forEach(item => {
        const pIdx = updatedProducts.findIndex(p => p.id === item.productId);
        if(pIdx > -1) {
            updatedProducts[pIdx] = {
                ...updatedProducts[pIdx],
                currentStock: updatedProducts[pIdx].currentStock + item.quantity
            };
        }
    });
    setProducts(updatedProducts);

    const jeId = `REF-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const entries = [
        { id: jeId, date, description: `Refund Invoice #${inv.id}`, account: '4000 Sales Returns', debit: inv.totalAmount - inv.taxAmount, credit: 0 },
        { id: jeId, date, description: `Refund VAT #${inv.id}`, account: '2030 VAT Payable', debit: inv.taxAmount, credit: 0 },
        { id: jeId, date, description: `Refund Cash Payment #${inv.id}`, account: '1010 Cash on Hand', debit: 0, credit: inv.totalAmount }
    ];
    setJournalEntries(prev => [...prev, ...entries]);
  };

  const adjustStock = (productId: string, newQty: number, reason: string) => {
    const pIdx = products.findIndex(p => p.id === productId);
    if (pIdx === -1) return;
    const product = products[pIdx];
    const oldQty = product.currentStock;
    const diff = newQty - oldQty;

    if (diff === 0) return;

    const updatedProducts = [...products];
    updatedProducts[pIdx] = { ...product, currentStock: newQty };
    setProducts(updatedProducts);

    const jeId = `ADJ-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const amount = Math.abs(diff * product.costPrice);

    const entries = [];
    if (diff < 0) {
        entries.push({ id: jeId, date, description: `Stock Adj (${reason}): ${product.name}`, account: '5000 Inventory Loss', debit: amount, credit: 0 });
        entries.push({ id: jeId, date, description: `Stock Adj (${reason}): ${product.name}`, account: '1200 Inventory', debit: 0, credit: amount });
    } else {
        entries.push({ id: jeId, date, description: `Stock Adj (${reason}): ${product.name}`, account: '1200 Inventory', debit: amount, credit: 0 });
        entries.push({ id: jeId, date, description: `Stock Adj (${reason}): ${product.name}`, account: '5000 Inventory Gain', debit: 0, credit: amount });
    }
    setJournalEntries(prev => [...prev, ...entries]);
  };

  return (
    <StoreContext.Provider value={{ 
      products, invoices, journalEntries, people, purchaseOrders, posCart,
      processOrder, updateProductStock, addInvoice, refreshData, updateProductPrice,
      addPerson, createPurchaseOrder, receiveStock,
      refundInvoice, adjustStock,
      addToCart, addToCartByName, removeFromCart, updateCartQty, clearCart,
      generateZatcaQR
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
