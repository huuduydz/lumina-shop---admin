import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CRMNotification, Customer, MembershipLevel, Order } from '../types';
import { useOrders } from './OrderContext';

interface CRMContextType {
  customers: Customer[];
  notifications: CRMNotification[];
  loading: boolean;
  addCustomer: (
    customer: Omit<Customer, 'id' | 'membershipLevel' | 'totalSpent' | 'points' | 'joinDate' | 'referralCode'>
  ) => Promise<boolean>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<boolean>;
  deleteCustomer: (id: string) => Promise<boolean>;
  getCustomerOrders: (email: string) => Order[];
  calculateMembership: (totalSpent: number) => MembershipLevel;
  sendNotification: (customerId: string, message: string, type: CRMNotification['type']) => void;
  refreshStats: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);
const API_URL = 'http://localhost:3001/api';

const readCustomersFromStorage = (): Customer[] => {
  try {
    const savedCustomers = localStorage.getItem('lumina_crm_customers');
    return savedCustomers ? JSON.parse(savedCustomers) : [];
  } catch (error) {
    return [];
  }
};

const mapApiCustomer = (customer: any): Customer => ({
  id: customer.id?.toString() || customer._id || customer.email,
  name: customer.name,
  email: customer.email,
  phone: customer.phone || '',
  address: customer.address || '',
  membershipLevel: (customer.membershipLevel || 'Bronze') as MembershipLevel,
  totalSpent: Number(customer.totalSpent || 0),
  referralCode: customer.referralCode || '',
  referredBy: customer.referredBy,
  points: Number(customer.points || 0),
  joinDate: customer.joinDate || customer.createdAt || new Date().toISOString()
});

export const CRMProvider = ({ children }: { children: ReactNode }) => {
  const { orders } = useOrders();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);

  const calculateMembership = (totalSpent: number): MembershipLevel => {
    if (totalSpent > 20000000) return 'Diamond';
    if (totalSpent > 10000000) return 'Gold';
    if (totalSpent > 5000000) return 'Silver';
    return 'Bronze';
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/crm/customers`);

        if (!response.ok) {
          throw new Error('Unable to load customers from API');
        }

        const payload = await response.json();
        const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        setCustomers(data.map(mapApiCustomer));
      } catch (error) {
        setCustomers(readCustomersFromStorage());
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_crm_customers', JSON.stringify(customers));
  }, [customers]);

  const refreshStats = () => {
    setCustomers(prevCustomers =>
      prevCustomers.map(customer => {
        const customerOrders = orders.filter(order => order.customer.email === customer.email);
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
        const membershipLevel = calculateMembership(totalSpent);
        const points = Math.floor(totalSpent / 10000);

        return {
          ...customer,
          totalSpent,
          membershipLevel,
          points
        };
      })
    );
  };

  useEffect(() => {
    refreshStats();
  }, [orders]);

  const addCustomer = async (
    data: Omit<Customer, 'id' | 'membershipLevel' | 'totalSpent' | 'points' | 'joinDate' | 'referralCode'>
  ) => {
    try {
      const response = await fetch(`${API_URL}/crm/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to create customer');
      }

      const newCustomer = mapApiCustomer(payload.data || payload);
      setCustomers(prevCustomers => [newCustomer, ...prevCustomers]);
      return true;
    } catch (error) {
      const fallbackCustomer: Customer = {
        ...data,
        id: `CUST-${Date.now()}`,
        membershipLevel: 'Bronze',
        totalSpent: 0,
        points: 0,
        joinDate: new Date().toISOString(),
        referralCode: `REF-${data.name.split(' ')[0].toUpperCase()}-${Math.floor(Math.random() * 1000)}`
      };
      setCustomers(prevCustomers => [fallbackCustomer, ...prevCustomers]);
      return true;
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(customer => (customer.id === id ? { ...customer, ...data } : customer))
    );

    try {
      await fetch(`${API_URL}/crm/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return true;
    } catch (error) {
      return true;
    }
  };

  const deleteCustomer = async (id: string) => {
    setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== id));

    try {
      await fetch(`${API_URL}/crm/customers/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      return true;
    }
  };

  const getCustomerOrders = (email: string) => {
    return orders.filter(order => order.customer.email === email);
  };

  const sendNotification = (customerId: string, message: string, type: CRMNotification['type']) => {
    const newNotification: CRMNotification = {
      id: `NOTIF-${Date.now()}`,
      customerId,
      message,
      type,
      date: new Date().toISOString(),
      read: false
    };

    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };

  return (
    <CRMContext.Provider
      value={{
        customers,
        notifications,
        loading,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerOrders,
        calculateMembership,
        sendNotification,
        refreshStats
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within CRMProvider');
  }

  return context;
};
