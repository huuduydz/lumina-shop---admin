import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, CustomerInfo, Order } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (
    customer: CustomerInfo,
    items: CartItem[],
    subtotal: number,
    discount: number,
    total: number,
    paymentMethod: string
  ) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const API_URL = 'http://localhost:3001/api';

const readOrdersFromStorage = (): Order[] => {
  try {
    const savedOrders = localStorage.getItem('lumina_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    return [];
  }
};

const parseOrderItems = (items: unknown) => {
  if (Array.isArray(items)) {
    return items;
  }

  if (typeof items !== 'string') {
    return [];
  }

  try {
    return JSON.parse(items);
  } catch (error) {
    return [];
  }
};

const mapApiOrder = (order: any): Order => {
  const customer = order.customer || {
    name: order.customerName || order.customerSnapshot?.name || 'Unknown',
    email: order.customerEmail || order.customerSnapshot?.email || '',
    phone: order.customerPhone || order.customerSnapshot?.phone || '',
    address: order.customerAddress || order.customerSnapshot?.address || '',
    note: order.customerNote || order.customerSnapshot?.note || order.notes || ''
  };

  const items = parseOrderItems(order.items);

  return {
    id: order.orderNumber || order.id || order._id || `ORD-${Date.now()}`,
    customer,
    items,
    subtotal: Number(order.subtotal ?? order.totalAmount ?? order.total ?? 0),
    discount: Number(order.discount ?? 0),
    total: Number(order.totalAmount ?? order.total ?? order.subtotal ?? 0),
    paymentMethod: (order.paymentMethod || 'COD') as Order['paymentMethod'],
    status: (order.status || 'Pending') as Order['status'],
    date: order.orderDate || order.date || new Date().toISOString(),
    crmSynced: order.crmSynced ?? true
  };
};

const syncToCRM = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return true;
};

export const OrderProvider = ({ children }: { children?: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/orders`);

        if (!response.ok) {
          throw new Error('Unable to load orders from API');
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        setOrders(data.map(mapApiOrder));
      } catch (error) {
        setOrders(readOrdersFromStorage());
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_orders', JSON.stringify(orders));
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

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items,
          subtotal,
          discount,
          total,
          paymentMethod,
          notes: customer.note || ''
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to create order');
      }

      const createdOrder = mapApiOrder(payload.data || payload);
      setOrders(prevOrders => [createdOrder, ...prevOrders.filter(order => order.id !== createdOrder.id)]);
      await syncToCRM();
      return true;
    } catch (error) {
      const fallbackOrder: Order = {
        id: `ORD-${Date.now()}`,
        customer,
        items,
        subtotal,
        discount,
        total,
        paymentMethod: paymentMethod as Order['paymentMethod'],
        status: 'Pending',
        date: new Date().toISOString(),
        crmSynced: false
      };

      setOrders(prevOrders => [fallbackOrder, ...prevOrders]);
      await syncToCRM();
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const persistOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        return;
      }

      const payload = await response.json();
      if (payload?.data) {
        const updatedOrder = mapApiOrder(payload.data);
        setOrders(prevOrders =>
          prevOrders.map(order => (order.id === orderId ? { ...order, ...updatedOrder } : order))
        );
      }
    } catch (error) {
      // Keep optimistic state when API is unavailable.
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order => (order.id === orderId ? { ...order, status } : order))
    );
    void persistOrderStatus(orderId, status);
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }

  return context;
};
