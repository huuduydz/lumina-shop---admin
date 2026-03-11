// API Service for frontend to communicate with backend

const API_URL = 'http://localhost:3001/api';

export const crmAPI = {
  // Dashboard
  getDashboard: async () => {
    const res = await fetch(`${API_URL}/crm/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  },

  // Customers
  getCustomers: async () => {
    const res = await fetch(`${API_URL}/crm/customers`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },

  getCustomerDetail: async (id) => {
    const res = await fetch(`${API_URL}/crm/customers/detail/${id}`);
    if (!res.ok) throw new Error('Failed to fetch customer detail');
    return res.json();
  },

  addCustomer: async (data) => {
    const res = await fetch(`${API_URL}/crm/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add customer');
    return res.json();
  },

  updateCustomer: async (id, data) => {
    const res = await fetch(`${API_URL}/crm/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update customer');
    return res.json();
  },

  deleteCustomer: async (id) => {
    const res = await fetch(`${API_URL}/crm/customers/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete customer');
    return res.json();
  },

  getByMembership: async (level) => {
    const res = await fetch(`${API_URL}/crm/customers/membership/${level}`);
    if (!res.ok) throw new Error('Failed to fetch customers by membership');
    return res.json();
  },

  getTopCustomers: async (limit = 10) => {
    const res = await fetch(`${API_URL}/crm/customers/top?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch top customers');
    return res.json();
  }
};

export const orderAPI = {
  // Orders
  getAllOrders: async () => {
    const res = await fetch(`${API_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  getCustomerOrders: async (customerId) => {
    const res = await fetch(`${API_URL}/orders/customer/${customerId}`);
    if (!res.ok) throw new Error('Failed to fetch customer orders');
    return res.json();
  },

  createOrder: async (data) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  updateOrderStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  getRevenueStats: async () => {
    const res = await fetch(`${API_URL}/orders/stats/revenue`);
    if (!res.ok) throw new Error('Failed to fetch revenue stats');
    return res.json();
  }
};
