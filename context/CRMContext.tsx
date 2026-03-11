import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, MembershipLevel, CRMNotification, Order } from '../types';
import { useOrders } from './OrderContext';

interface CRMContextType {
  customers: Customer[];
  notifications: CRMNotification[];
  loading: boolean;
  addCustomer: (customer: Omit<Customer, 'id' | 'membershipLevel' | 'totalSpent' | 'points' | 'joinDate' | 'referralCode'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerOrders: (email: string) => Order[];
  calculateMembership: (totalSpent: number) => MembershipLevel;
  sendNotification: (customerId: string, message: string, type: CRMNotification['type']) => void;
  refreshStats: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/api';

export const CRMProvider = ({ children }: { children: ReactNode }) => {
  const { orders } = useOrders();
  
  // Initialize customers from API or localStorage
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);

  // Fetch customers from backend API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/crm/customers`);
        if (response.ok) {
          const data = await response.json();
          // Transform backend data to match frontend Customer type
          const transformedCustomers = data.map((customer: any) => ({
            id: customer.id?.toString() || customer.name,
            name: customer.name,
            email: customer.email,
            phone: customer.phone || '',
            address: customer.address || '',
            membershipLevel: customer.membershipLevel,
            totalSpent: customer.totalSpent || 0,
            points: customer.points || 0,
            referralCode: customer.referralCode || '',
            joinDate: customer.joinDate || new Date().toISOString()
          }));
          setCustomers(transformedCustomers);
          localStorage.setItem('lumina_crm_customers', JSON.stringify(transformedCustomers));
        } else {
          // Fall back to localStorage
          const saved = localStorage.getItem('lumina_crm_customers');
          setCustomers(saved ? JSON.parse(saved) : []);
        }
      } catch (error) {
        console.warn('Failed to fetch customers from API, using localStorage:', error);
        const saved = localStorage.getItem('lumina_crm_customers');
        if (saved) setCustomers(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_crm_customers', JSON.stringify(customers));
  }, [customers]);

  // Logic: Calculate Membership Level
  const calculateMembership = (totalSpent: number): MembershipLevel => {
    // Logic from prompt: > 10m -> Gold, > 20m -> Diamond
    // My interpretation: < 10m -> Bronze/Silver? 
    // Let's use: < 5m -> Bronze, 5m-10m -> Silver, 10m-20m -> Gold, > 20m -> Diamond
    if (totalSpent > 20000000) return 'Diamond';
    if (totalSpent > 10000000) return 'Gold';
    if (totalSpent > 5000000) return 'Silver';
    return 'Bronze';
  };

  // Logic: Refresh stats based on Orders
  const refreshStats = () => {
    setCustomers(prev => prev.map(customer => {
      const customerOrders = orders.filter(o => o.customer.email === customer.email);
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
      const newLevel = calculateMembership(totalSpent);
      
      // Points logic: 1 point per 10,000 VND spent (example)
      const points = Math.floor(totalSpent / 10000);

      return {
        ...customer,
        totalSpent,
        membershipLevel: newLevel,
        points
      };
    }));
    };

    // Auto-refresh stats when orders change
    useEffect(() => {
      refreshStats();
    }, [orders]);

  const addCustomer = (data: Omit<Customer, 'id' | 'membershipLevel' | 'totalSpent' | 'points' | 'joinDate' | 'referralCode'>) => {
    const newCustomer: Customer = {
      ...data,
      id: `CUST-${Date.now()}`,
      membershipLevel: 'Bronze',
      totalSpent: 0,
      points: 0,
      joinDate: new Date().toISOString(),
      referralCode: `REF-${data.name.split(' ')[0].toUpperCase()}-${Math.floor(Math.random() * 1000)}`
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const getCustomerOrders = (email: string) => {
    return orders.filter(o => o.customer.email === email);
  };

  const sendNotification = (customerId: string, message: string, type: CRMNotification['type']) => {
    const newNotif: CRMNotification = {
      id: `NOTIF-${Date.now()}`,
      customerId,
      message,
      type,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <CRMContext.Provider value={{
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
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within CRMProvider');
  return context;
};
