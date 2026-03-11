import pool from '../config/database.js';

export const Customer = {
  // Get all customers
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM customers ORDER BY createdAt DESC');
    return rows;
  },

  // Get customer by ID
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
    return rows[0];
  },

  // Get customer by email
  getByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    return rows[0];
  },

  // Create customer
  create: async (data) => {
    const referralCode = `REF-${data.name.split(' ')[0].toUpperCase()}-${Math.floor(Math.random() * 10000)}`;
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, phone, address, membershipLevel, referralCode) VALUES (?, ?, ?, ?, ?, ?)',
      [data.name, data.email, data.phone, data.address, 'Bronze', referralCode]
    );
    return { id: result.insertId, ...data, referralCode, membershipLevel: 'Bronze' };
  },

  // Update customer
  update: async (id, data) => {
    const [result] = await pool.query(
      'UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?',
      [data.name, data.phone, data.address, id]
    );
    return result.affectedRows > 0;
  },

  // Delete customer
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM customers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Update membership and points
  updateMembership: async (id, membershipLevel, totalSpent, points) => {
    const [result] = await pool.query(
      'UPDATE customers SET membershipLevel = ?, totalSpent = ?, points = ?, lastPurchaseDate = CURRENT_TIMESTAMP WHERE id = ?',
      [membershipLevel, totalSpent, points, id]
    );
    return result.affectedRows > 0;
  },

  // Get customers by membership level
  getByMembership: async (level) => {
    const [rows] = await pool.query('SELECT * FROM customers WHERE membershipLevel = ?', [level]);
    return rows;
  },

  // Get top customers by spending
  getTopCustomers: async (limit = 10) => {
    const [rows] = await pool.query(
      'SELECT * FROM customers ORDER BY totalSpent DESC LIMIT ?',
      [limit]
    );
    return rows;
  }
};

export default Customer;
