
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface InventoryContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: any;
  setSelectedProduct: (product: any) => void;
}

export const InventoryContext = createContext<InventoryContextType>({} as InventoryContextType);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <InventoryContext.Provider value={{
      searchQuery, setSearchQuery, selectedProduct, setSelectedProduct
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
