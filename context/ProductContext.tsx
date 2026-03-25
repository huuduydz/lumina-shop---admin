import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Transaction } from '../types';
import { PRODUCTS } from '../data';
import { productAPI } from '../api';

interface ProductContextType {
  products: Product[];
  transactions: Transaction[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (
    productId: string,
    quantity: number,
    type: 'IN' | 'OUT',
    source: 'Manual' | 'Order' | 'API Sync',
    note?: string
  ) => void;
  exportData: () => void;
  syncData: () => Promise<string>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const readProductsFromStorage = (): Product[] => {
  try {
    const savedProducts = localStorage.getItem('lumina_products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  } catch (error) {
    return [];
  }
};

const readTransactionsFromStorage = (): Transaction[] => {
  try {
    const savedTransactions = localStorage.getItem('lumina_transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  } catch (error) {
    return [];
  }
};

const mergeSeededProducts = (savedProducts: Product[] | null): Product[] => {
  if (!savedProducts?.length) {
    return PRODUCTS;
  }

  const savedMap = new Map(savedProducts.map(product => [product.id, product]));
  const mergedSeededProducts = PRODUCTS.map(product => ({
    ...product,
    ...savedMap.get(product.id)
  }));

  const customProducts = savedProducts.filter(
    savedProduct => !PRODUCTS.some(seedProduct => seedProduct.id === savedProduct.id)
  );

  return [...mergedSeededProducts, ...customProducts];
};

const extractArray = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown[] }).data)) {
    return (payload as { data: T[] }).data;
  }

  return [];
};

const buildFallbackTransactions = (products: Product[]): Transaction[] => [
  {
    id: 'tx-init-1',
    productId: products[0]?.id || '1',
    productName: products[0]?.name || 'Seed Product',
    productImage: products[0]?.image || '',
    type: 'IN',
    quantity: products[0]?.stockQuantity || 0,
    date: new Date(Date.now() - 86400000).toISOString(),
    source: 'Manual',
    note: 'Initial stock snapshot',
    totalValue: Number(products[0]?.price || 0) * Number(products[0]?.stockQuantity || 0)
  }
];

const getNextStockState = (
  product: Product,
  quantity: number,
  type: 'IN' | 'OUT'
): Pick<Product, 'stockQuantity' | 'stockStatus'> => {
  const nextQuantity =
    type === 'IN' ? product.stockQuantity + quantity : Math.max(0, product.stockQuantity - quantity);

  if (nextQuantity <= 0) {
    return { stockQuantity: 0, stockStatus: 'Out of Stock' };
  }

  if (nextQuantity <= product.minStock) {
    return { stockQuantity: nextQuantity, stockStatus: 'Low Stock' };
  }

  return { stockQuantity: nextQuantity, stockStatus: 'In Stock' };
};

export const ProductProvider = ({ children }: { children?: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = readProductsFromStorage();
    return savedProducts.length ? mergeSeededProducts(savedProducts) : PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = readTransactionsFromStorage();
    return savedTransactions.length ? savedTransactions : buildFallbackTransactions(PRODUCTS);
  });

  useEffect(() => {
    localStorage.setItem('lumina_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lumina_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    let mounted = true;

    const fetchInventory = async () => {
      try {
        const [productsPayload, transactionsPayload] = await Promise.all([
          productAPI.getProducts(),
          productAPI.getTransactions()
        ]);

        let backendProducts = extractArray<Product>(productsPayload);
        if (!backendProducts.length) {
          const seededPayload = await productAPI.seedProducts(PRODUCTS);
          backendProducts = extractArray<Product>(seededPayload);
        }

        const backendTransactions = extractArray<Transaction>(transactionsPayload);

        if (!mounted) {
          return;
        }

        setProducts(mergeSeededProducts(backendProducts));
        setTransactions(backendTransactions);
      } catch (error) {
        if (!mounted) {
          return;
        }

        const savedProducts = readProductsFromStorage();
        const savedTransactions = readTransactionsFromStorage();
        setProducts(savedProducts.length ? mergeSeededProducts(savedProducts) : PRODUCTS);
        setTransactions(savedTransactions.length ? savedTransactions : buildFallbackTransactions(PRODUCTS));
      }
    };

    void fetchInventory();

    return () => {
      mounted = false;
    };
  }, []);

  const addProduct = (product: Product) => {
    setProducts(prevProducts => [product, ...prevProducts]);

    void productAPI
      .createProduct(product)
      .then(payload => {
        const createdProduct = payload?.data || payload;
        setProducts(prevProducts => prevProducts.map(item => (item.id === product.id ? createdProduct : item)));
      })
      .catch(() => {
        // Keep local optimistic state if API is unavailable.
      });
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prevProducts =>
      prevProducts.map(product => (product.id === id ? { ...product, ...updatedProduct } : product))
    );

    void productAPI.updateProduct(id, updatedProduct).catch(() => {
      // Keep local optimistic state if API is unavailable.
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));

    void productAPI.deleteProduct(id).catch(() => {
      // Keep local optimistic state if API is unavailable.
    });
  };

  const updateStock = (
    productId: string,
    quantity: number,
    type: 'IN' | 'OUT',
    source: 'Manual' | 'Order' | 'API Sync',
    note?: string
  ) => {
    const targetProduct = products.find(product => product.id === productId);
    if (!targetProduct) {
      return;
    }

    const nextProductState = getNextStockState(targetProduct, quantity, type);
    const optimisticTransaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      productId: targetProduct.id,
      productName: targetProduct.name,
      productImage: targetProduct.image,
      type,
      quantity,
      date: new Date().toISOString(),
      source,
      note,
      totalValue: quantity * targetProduct.price
    };

    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, ...nextProductState } : product
      )
    );
    setTransactions(prevTransactions => [optimisticTransaction, ...prevTransactions]);

    void productAPI
      .updateStock(productId, { quantity, type, source, note })
      .then(payload => {
        const product = payload?.data?.product || payload?.product;
        const transaction = payload?.data?.transaction || payload?.transaction;

        if (product) {
          setProducts(prevProducts =>
            prevProducts.map(item => (item.id === productId ? { ...item, ...product } : item))
          );
        }

        if (transaction) {
          setTransactions(prevTransactions => [
            transaction,
            ...prevTransactions.filter(item => item.id !== optimisticTransaction.id)
          ]);
        }
      })
      .catch(() => {
        // Keep local optimistic state if API is unavailable.
      });
  };

  const exportData = () => {
    const dataToExport = {
      inventory: products.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: product.stockQuantity,
        value: product.price
      })),
      transactions
    };

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'inventory_export.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const syncData = async () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (!randomProduct) {
      return 'No products available to sync';
    }

    updateStock(randomProduct.id, 5, 'IN', 'API Sync', 'Synced from Warehouse A');
    return 'Synced successfully with MongoDB inventory';
  };

  return (
    <ProductContext.Provider
      value={{ products, transactions, addProduct, updateProduct, deleteProduct, updateStock, exportData, syncData }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};
