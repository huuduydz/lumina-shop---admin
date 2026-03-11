import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MySQL root to create database
async function initializeDatabase() {
  let connection;
  try {
    // First connection - without database specified
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
    });

    console.log('🔧 Creating database...');

    // Create database if not exists (raw query, not prepared statement)
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'lumina_crm'}`
    );

    console.log('✅ Database created');

    // Switch to the database
    await connection.query(`USE ${process.env.DB_NAME || 'lumina_crm'}`);

    // Create tables
    const tables = [
      // Users table (Admin, Staff)
      `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Staff') DEFAULT 'Staff',
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        avatar VARCHAR(255),
        lastLogin DATETIME,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Customers table
      `CREATE TABLE IF NOT EXISTS customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15),
        address TEXT,
        membershipLevel ENUM('Bronze', 'Silver', 'Gold', 'Diamond') DEFAULT 'Bronze',
        totalSpent DECIMAL(15, 2) DEFAULT 0,
        points INT DEFAULT 0,
        referralCode VARCHAR(50) UNIQUE,
        referralCount INT DEFAULT 0,
        referredBy VARCHAR(50),
        joinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastPurchaseDate DATETIME,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_referralCode (referralCode)
      )`,

      // Orders table
      `CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customerId INT NOT NULL,
        orderNumber VARCHAR(50) UNIQUE,
        totalAmount DECIMAL(15, 2) NOT NULL,
        status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
        items JSON,
        notes TEXT,
        orderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE,
        INDEX idx_customerId (customerId),
        INDEX idx_orderDate (orderDate)
      )`,

      // Referral Program table
      `CREATE TABLE IF NOT EXISTS referrals (
        id INT PRIMARY KEY AUTO_INCREMENT,
        referrerCustomerId INT NOT NULL,
        referredCustomerId INT NOT NULL,
        referralCode VARCHAR(50),
        bonusPoints INT DEFAULT 100,
        bonusAmount DECIMAL(10, 2) DEFAULT 0,
        status ENUM('Pending', 'Completed', 'Expired') DEFAULT 'Pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completedAt DATETIME,
        FOREIGN KEY (referrerCustomerId) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (referredCustomerId) REFERENCES customers(id) ON DELETE CASCADE
      )`,

      // Notifications table
      `CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customerId INT NOT NULL,
        title VARCHAR(255),
        message TEXT NOT NULL,
        type ENUM('Info', 'Success', 'Warning', 'Error') DEFAULT 'Info',
        isRead BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE,
        INDEX idx_customerId (customerId),
        INDEX idx_isRead (isRead)
      )`,

      // Membership Tiers table
      `CREATE TABLE IF NOT EXISTS membershipTiers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) UNIQUE,
        minSpent DECIMAL(15, 2),
        maxSpent DECIMAL(15, 2),
        discount DECIMAL(4, 2),
        pointsMultiplier DECIMAL(3, 1),
        description TEXT
      )`,

      // Coupons table
      `CREATE TABLE IF NOT EXISTS coupons (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        type ENUM('Percentage', 'Fixed Cart', 'Fixed Product', 'Free Shipping') DEFAULT 'Percentage',
        value DECIMAL(10, 2) NOT NULL,
        usageCount INT DEFAULT 0,
        usageLimit INT,
        expiryDate DATETIME,
        status ENUM('Active', 'Expired', 'Scheduled') DEFAULT 'Active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_code (code),
        INDEX idx_status (status)
      )`
    ];

    for (const table of tables) {
      await connection.query(table);
    }

    console.log('✅ All tables created successfully\n');

    // Insert default membership tiers
    const tiers = [
      { name: 'Bronze', minSpent: 0, maxSpent: 5000000, discount: 0, pointsMultiplier: 1 },
      { name: 'Silver', minSpent: 5000000, maxSpent: 10000000, discount: 5, pointsMultiplier: 1.2 },
      { name: 'Gold', minSpent: 10000000, maxSpent: 20000000, discount: 10, pointsMultiplier: 1.5 },
      { name: 'Diamond', minSpent: 20000000, maxSpent: null, discount: 20, pointsMultiplier: 2 }
    ];

    for (const tier of tiers) {
      await connection.query(
        'INSERT IGNORE INTO membershipTiers (name, minSpent, maxSpent, discount, pointsMultiplier) VALUES (?, ?, ?, ?, ?)',
        [tier.name, tier.minSpent, tier.maxSpent, tier.discount, tier.pointsMultiplier]
      );
    }

    console.log('✅ Membership tiers inserted\n');

    await connection.end();
    console.log('✅ Database initialization completed!\n');
  } catch (error) {
    console.warn('⚠️  Database initialization skipped:', error.message);
    console.warn('📝 Make sure MySQL is running with:\n   User: root\n   Password: 123456\n');
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (e) {
        // ignore
      }
    }
  }
}

export default initializeDatabase;
