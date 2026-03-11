import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'lumina_crm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection (non-blocking)
pool.getConnection()
  .then(() => console.log('✅ Connected to MySQL'))
  .catch(err => {
    console.warn('⚠️  MySQL not available:', err.message);
    console.warn('📝 API will run without database. Setup MySQL to enable full features.\n');
  });

export default pool;

