import Customer from '../models/Customer.js';
import Order from '../models/Order.js';

export const crmController = {
  getDashboard: async (req, res) => {
    try {
      const customers = await Customer.getAll();
      const orders = await Order.getAll();
      const totalRevenue = await Order.getTotalRevenue();

      const customerOrderCounts = orders.reduce((accumulator, order) => {
        const key = order.customerId?.toString() || order.customerEmail;
        accumulator[key] = (accumulator[key] || 0) + 1;
        return accumulator;
      }, {});

      const returningCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
      const returningRate =
        customers.length > 0 ? Number(((returningCustomers / customers.length) * 100).toFixed(1)) : 0;

      res.json({
        success: true,
        data: {
          totalCustomers: customers.length,
          totalOrders: orders.length,
          totalRevenue,
          returningRate,
          returningCustomers,
          revenueStats: await Order.getRevenueStats()
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getCustomers: async (req, res) => {
    try {
      const customers = await Customer.getAll();
      res.json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

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

  addCustomer: async (req, res) => {
    try {
      const { name, email, phone, address } = req.body;

      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name and email are required' });
      }

      const existingCustomer = await Customer.getByEmail(email);
      if (existingCustomer) {
        return res.status(409).json({ success: false, error: 'Customer email already exists' });
      }

      const customer = await Customer.create({ name, email, phone, address });
      res.status(201).json({ success: true, data: customer });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, address } = req.body;

      const updated = await Customer.update(id, { name, email, phone, address });
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      const customer = await Customer.getById(id);
      res.json({ success: true, data: customer });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

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

  getByMembership: async (req, res) => {
    try {
      const { level } = req.params;
      const customers = await Customer.getByMembership(level);
      res.json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getTopCustomers: async (req, res) => {
    try {
      const limit = Number(req.query.limit || 10);
      const customers = await Customer.getTopCustomers(limit);
      res.json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export default crmController;
