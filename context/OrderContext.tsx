
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order, CustomerInfo, CartItem } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (customer: CustomerInfo, items: CartItem[], subtotal: number, discount: number, total: number, paymentMethod: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const API_URL = 'http://localhost:3001/api';

// Simple CRM sync placeholder
const syncToCRM = async (order: Order) => {
  await new Promise((r) => setTimeout(r, 500));
  return true;
};

export const OrderProvider = ({ children }: { children?: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/orders`);
        if (res.ok) {
          const apiResp = await res.json();
          const data = apiResp.data || apiResp;
          const transformed = (Array.isArray(data) ? data : []).map((order: any) => ({
            id: order.orderNumber || `ORD-${order.id}`,
            customer: {
              name: order.customerName || order.customer?.name || 'Unknown',
              email: order.customerEmail || order.customer?.email || '',
              phone: order.customerPhone || order.customer?.phone || '',
              address: order.customerAddress || order.customer?.address || ''
            },
            items: order.items ? (typeof order.items === 'string' ? JSON.parse(order.items) : order.items) : [],
            subtotal: order.totalAmount || 0,
            discount: 0,
            total: order.totalAmount || 0,
            paymentMethod: order.paymentMethod || 'Unknown',
            status: order.status || 'Pending',
            date: order.orderDate || new Date().toISOString()
          }));
          setOrders(transformed);
          localStorage.setItem('lumina_orders', JSON.stringify(transformed));
        } else {
          const saved = localStorage.getItem('lumina_orders');
          setOrders(saved ? JSON.parse(saved) : []);
        }
      } catch (err) {
        const saved = localStorage.getItem('lumina_orders');
        setOrders(saved ? JSON.parse(saved) : []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Persist whenever orders change
  useEffect(() => {
    if (orders.length) localStorage.setItem('lumina_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (
    customer: CustomerInfo,
    items: CartItem[],
    subtotal: number,
    discount: number,
    total: number,
    paymentMethod: string
  ): Promise<boolean> => {
    setIsLoading(true);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customer,
      items,
      subtotal,
      discount,
      total,
      paymentMethod: paymentMethod as any,
      status: 'Pending',
      date: new Date().toISOString()
    };

    // Add locally
    setOrders((prev) => [newOrder, ...prev]);

    // Try to sync to backend (best-effort)
    try {
      await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: null, totalAmount: total, items, notes: '' })
      });
    } catch (e) {
      // ignore
    }

    // Sync to CRM placeholder
    await syncToCRM(newOrder);

    setIsLoading(false);
    return true;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
