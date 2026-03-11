import Customer from '../models/Customer.js';
import Order from '../models/Order.js';

export const crmController = {
  // Get CRM Dashboard
  getDashboard: async (req, res) => {
    try {
      const customers = await Customer.getAll();
      const orders = await Order.getAll();
      
      const totalCustomers = customers.length;
      const totalOrders = orders.length;
      const totalRevenue = await Order.getTotalRevenue();
      
      // Returning customer rate
      const customerOrderCounts = {};
      orders.forEach(order => {
        customerOrderCounts[order.customerId] = (customerOrderCounts[order.customerId] || 0) + 1;
      });
      
      const returningCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
      const returningRate = totalCustomers > 0 ? ((returningCustomers / totalCustomers) * 100).toFixed(1) : 0;

      res.json({
        success: true,
        data: {
          totalCustomers,
          totalOrders,
          totalRevenue,
          returningRate: parseFloat(returningRate),
          returningCustomers,
          revenueStats: await Order.getRevenueStats()
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get all customers
  getCustomers: async (req, res) => {
    try {
      const customers = await Customer.getAll();
      res.json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get customer details
  getCustomerDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await Customer.getById(id);
      
      if (!customer) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      const orders = await Order.getByCustomerId(id);
      
      res.json({ success: true, data: { customer, orders } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Add customer
  addCustomer: async (req, res) => {
    try {
      const { name, email, phone, address } = req.body;

      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name and email are required' });
      }

      const customer = await Customer.create({ name, email, phone, address });
      
      res.status(201).json({ success: true, data: customer });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update customer
  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone, address } = req.body;

      const updated = await Customer.update(id, { name, phone, address });
      
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      const customer = await Customer.getById(id);
      res.json({ success: true, data: customer });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete customer
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await Customer.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get customers by membership level
  getByMembership: async (req, res) => {
    try {
      const { level } = req.params;
      const customers = await Customer.getByMembership(level);
      
      res.json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get top customers
  getTopCustomers: async (req, res) => {
    try {
      const limit = req.query.limit || 10;
      const customers = await Customer.getTopCustomers(parseInt(limit));
      
      res.json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export default crmController;
