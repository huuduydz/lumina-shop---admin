import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, getDatabaseStatus } from './config/database.js';
import crmRoutes from './routes/crm.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/products.js';

dotenv.config();

const app = express();

const databaseConnectionPromise = connectDatabase().catch(error => {
  console.warn(`MongoDB connection failed: ${error.message}`);
  console.warn('API is running in degraded mode until MongoDB becomes available.\n');
  return null;
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
  })
);
app.use(express.json());

app.use(async (req, res, next) => {
  await databaseConnectionPromise;
  next();
});

app.use('/api/crm', crmRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: getDatabaseStatus(),
    timestamp: new Date()
  });
});

export default app;
