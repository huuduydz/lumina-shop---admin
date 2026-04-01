import dotenv from 'dotenv';
import mongoose from './config/database.js';
import { connectDatabase } from './config/database.js';
import { ensureAdminDemoData } from './adminDemoData.js';

dotenv.config();

const run = async () => {
  try {
    await connectDatabase();
    const result = await ensureAdminDemoData();
    console.log('Admin demo data seeded successfully.');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Failed to seed admin demo data.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

void run();
