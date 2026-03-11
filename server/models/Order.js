import pool from '../config/database.js';

export const Order = {
  // Get all orders
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY orderDate DESC');
    return rows;
  },

  // Get order by ID
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  },

  // Get orders by customer ID
  getByCustomerId: async (customerId) => {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE customerId = ? ORDER BY orderDate DESC',
      [customerId]
    );
    return rows;
  },

  // Create order
  create: async (data) => {
    const orderNumber = `ORD-${Date.now()}`;
    const [result] = await pool.query(
      'INSERT INTO orders (customerId, orderNumber, totalAmount, status, items, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [data.customerId, orderNumber, data.totalAmount, 'Pending', JSON.stringify(data.items), data.notes]
    );
    return { id: result.insertId, orderNumber, ...data };
  },

  // Update order status
  updateStatus: async (id, status) => {
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  },

  // Get revenue by period
  getRevenueStats: async () => {
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(orderDate, '%Y-%m') as month,
        COUNT(*) as orderCount,
        SUM(totalAmount) as revenue
      FROM orders
      WHERE status != 'Cancelled'
      GROUP BY DATE_FORMAT(orderDate, '%Y-%m')
      ORDER BY month DESC
    `);
    return rows;
  },

  // Get total revenue
  getTotalRevenue: async () => {
    const [rows] = await pool.query(
      'SELECT SUM(totalAmount) as total FROM orders WHERE status != "Cancelled"'
    );
    return rows[0]?.total || 0;
  }
};

export default Order;
