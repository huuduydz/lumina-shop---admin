
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Transaction } from '../types';
import { PRODUCTS } from '../data';

interface ProductContextType {
  products: Product[];
  transactions: Transaction[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, quantity: number, type: 'IN' | 'OUT', source: 'Manual' | 'Order' | 'API Sync', note?: string) => void;
  exportData: () => void;
  syncData: () => Promise<string>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const generateMockTransactions = (products: Product[]): Transaction[] => {
    return Array.from({ length: 25 }).map((_, i) => {
        const product = products[i % products.length];
        const isIn = i % 4 === 0;
        const quantity = Math.floor(Math.random() * 5) + 1;
        return {
            id: `tx-mock-${1000 + i}`,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            type: (isIn ? 'IN' : 'OUT') as 'IN' | 'OUT',
            quantity: quantity,
            date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
            source: (isIn ? 'Manual' : 'Order') as 'Manual' | 'Order' | 'API Sync',
            note: isIn ? 'Quarterly Restock' : `Order #${2000 + i}`,
            totalValue: quantity * product.price
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const ProductProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize from LocalStorage or fall back to default data
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('lumina_products');
    return savedProducts ? JSON.parse(savedProducts) : PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('lumina_transactions');
    if (savedTransactions) return JSON.parse(savedTransactions);

    return [
      {
          id: 'tx-init-1',
          productId: '1',
          productName: 'Wireless Noise-Cancelling Headphones Pro',
          productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200',
          type: 'IN',
          quantity: 45,
          date: new Date(Date.now() - 86400000).toISOString(),
          source: 'Manual',
          note: 'Initial Stock Count'
      },
      ...generateMockTransactions(PRODUCTS)
    ];
  });

  // Save to LocalStorage whenever products change
  useEffect(() => {
    localStorage.setItem('lumina_products', JSON.stringify(products));
  }, [products]);

  // Save to LocalStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('lumina_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts((prev) => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  // 1. Inventory & 3. Transaction Logic
  const updateStock = (productId: string, quantity: number, type: 'IN' | 'OUT', source: 'Manual' | 'Order' | 'API Sync', note?: string) => {
    setProducts(prev => prev.map(p => {
        if (p.id === productId) {
            const newQuantity = type === 'IN' ? p.stockQuantity + quantity : Math.max(0, p.stockQuantity - quantity);
            
            // Log Transaction
            const newTransaction: Transaction = {
                id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                productId: p.id,
                productName: p.name,
                productImage: p.image,
                type,
                quantity,
                date: new Date().toISOString(),
                source,
                note,
                totalValue: quantity * p.price
            };
            setTransactions(prevTx => [newTransaction, ...prevTx]);

            // Determine stock status
            let newStatus: Product['stockStatus'] = 'In Stock';
            if (newQuantity === 0) newStatus = 'Out of Stock';
            else if (newQuantity <= p.minStock) newStatus = 'Low Stock';

            return { ...p, stockQuantity: newQuantity, stockStatus: newStatus };
        }
        return p;
    }));
  };

  // 5. Data & Export
  const exportData = () => {
      const dataToExport = {
          inventory: products.map(p => ({
              id: p.id,
              name: p.name,
              sku: p.sku,
              quantity: p.stockQuantity,
              value: p.price
          })),
          transactions
      };
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "inventory_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  // 4. Sync Data (Mock)
  const syncData = async () => {
    // Simulate API call to WooCommerce or External Warehouse
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate incoming changes
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if(randomProduct) {
        updateStock(randomProduct.id, 5, 'IN', 'API Sync', 'Synced from Warehouse A');
    }
    return 'Synced successfully with WooCommerce';
  };

  return (
    <ProductContext.Provider value={{ products, transactions, addProduct, updateProduct, deleteProduct, updateStock, exportData, syncData }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};
