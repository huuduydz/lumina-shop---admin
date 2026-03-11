import Order from '../models/Order.js';
import Customer from '../models/Customer.js';

export const orderController = {
  // Get all orders
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.getAll();
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get orders by customer
  getCustomerOrders: async (req, res) => {
    try {
      const { customerId } = req.params;
      const orders = await Order.getByCustomerId(customerId);
      
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create order
  createOrder: async (req, res) => {
    try {
      const { customerId, totalAmount, items, notes } = req.body;

      if (!customerId || !totalAmount) {
        return res.status(400).json({ success: false, error: 'customerId and totalAmount required' });
      }

      // Check if customer exists
      const customer = await Customer.getById(customerId);
      if (!customer) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      const order = await Order.create({ customerId, totalAmount, items, notes });

      // Update customer membership based on total spending
      const customerOrders = await Order.getByCustomerId(customerId);
      const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      // Calculate membership level
      let membershipLevel = 'Bronze';
      if (totalSpent > 20000000) membershipLevel = 'Diamond';
      else if (totalSpent > 10000000) membershipLevel = 'Gold';
      else if (totalSpent > 5000000) membershipLevel = 'Silver';

      // Calculate points (1 point per 10,000 VND)
      const points = Math.floor(totalSpent / 10000);

      await Customer.updateMembership(customerId, membershipLevel, totalSpent, points);

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update order status
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await Order.updateStatus(id, status);

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      const order = await Order.getById(id);
      res.json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get revenue stats
  getRevenueStats: async (req, res) => {
    try {
      const stats = await Order.getRevenueStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export default orderController;
