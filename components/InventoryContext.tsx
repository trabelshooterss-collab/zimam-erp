import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  barcode: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'iPhone 15 Pro', price: 4500, stock: 5, category: 'electronics', barcode: '1001', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&q=80' },
  { id: 2, name: 'MacBook Air M2', price: 5200, stock: 2, category: 'electronics', barcode: '1002', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80' },
  { id: 3, name: 'Smart Watch Ultra', price: 850, stock: 15, category: 'accessories', barcode: '1003', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80' },
  { id: 4, name: 'Sony Headphones', price: 350, stock: 8, category: 'electronics', barcode: '1004', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
  { id: 5, name: 'Cotton T-Shirt', price: 80, stock: 50, category: 'fashion', barcode: '2001', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { id: 6, name: 'Running Shoes', price: 240, stock: 3, category: 'fashion', barcode: '2002', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
];

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updatedData: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  processSale: (cartItems: any[]) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zimam_inventory');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('zimam_inventory', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: number, updatedData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const processSale = (cartItems: any[]) => {
    setProducts(prevProducts => {
      return prevProducts.map(product => {
        const soldItem = cartItems.find(item => item.id === product.id);
        if (soldItem) {
          return { ...product, stock: Math.max(0, product.stock - soldItem.qty) };
        }
        return product;
      });
    });
  };

  return (
    <InventoryContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, processSale }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within InventoryProvider');
  return context;
};