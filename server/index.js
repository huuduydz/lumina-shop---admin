import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import initDatabase from './config/initDatabase.js';
import crmRoutes from './routes/crm.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Initialize database on startup
await initDatabase();

// API Routes
app.use('/api/crm', crmRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Connected to database`);
  console.log(`📍 Frontend URL: ${process.env.FRONTEND_URL}\n`);
});
