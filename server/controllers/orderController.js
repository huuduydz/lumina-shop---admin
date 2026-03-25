import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import { calculateMembershipLevel, calculateRewardPoints } from '../utils/customerMetrics.js';

const buildOrderCustomer = (customerInput, persistedCustomer) => ({
  name: customerInput?.name || persistedCustomer.name,
  email: customerInput?.email || persistedCustomer.email,
  phone: customerInput?.phone || persistedCustomer.phone || '',
  address: customerInput?.address || persistedCustomer.address || '',
  note: customerInput?.note || ''
});

export const orderController = {
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.getAll();
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getCustomerOrders: async (req, res) => {
    try {
      const { customerId } = req.params;
      const orders = await Order.getByCustomerId(customerId);
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createOrder: async (req, res) => {
    try {
      const {
        customerId,
        customer: customerInput,
        subtotal = 0,
        discount = 0,
        total,
        totalAmount,
        paymentMethod = 'COD',
        items = [],
        notes = '',
        status = 'Pending'
      } = req.body;

      const finalTotal = Number(total ?? totalAmount ?? 0);
      if (!finalTotal) {
        return res.status(400).json({ success: false, error: 'total or totalAmount is required' });
      }

      let customer = null;

      if (customerId) {
        customer = await Customer.getById(customerId);
      }

      if (!customer && customerInput?.email) {
        customer = await Customer.getByEmail(customerInput.email);
      }

      if (!customer && customerInput?.name && customerInput?.email) {
        customer = await Customer.create(customerInput);
      }

      if (!customer) {
        return res.status(400).json({
          success: false,
          error: 'Customer information is required to create an order'
        });
      }

      const createdOrder = await Order.create({
        customerId: customer.id,
        customer: buildOrderCustomer(customerInput, customer),
        subtotal: Number(subtotal || finalTotal),
        discount: Number(discount || 0),
        totalAmount: finalTotal,
        paymentMethod,
        status,
        items,
        notes: notes || customerInput?.note || '',
        crmSynced: true
      });

      const customerOrders = await Order.getByCustomerId(customer.id);
      const totalSpent = customerOrders
        .filter(order => order.status !== 'Cancelled')
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

      await Customer.updateMembership(
        customer.id,
        calculateMembershipLevel(totalSpent),
        totalSpent,
        calculateRewardPoints(totalSpent)
      );

      const hydratedOrder = await Order.getById(createdOrder.id);
      res.status(201).json({ success: true, data: hydratedOrder });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.updateStatus(id, status);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

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
