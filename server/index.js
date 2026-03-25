import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, getDatabaseStatus } from './config/database.js';
import crmRoutes from './routes/crm.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/products.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })
);
app.use(express.json());

try {
  await connectDatabase();
} catch (error) {
  console.warn(`MongoDB connection failed: ${error.message}`);
  console.warn('API is running in degraded mode until MongoDB becomes available.\n');
}

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database status: ${getDatabaseStatus()}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}\n`);
});
