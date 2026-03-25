import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumina_crm';
const isAtlasConnection =
  MONGODB_URI.includes('mongodb+srv://') || MONGODB_URI.includes('mongodb.net');

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    ...(isAtlasConnection ? { family: 4, tls: true } : {})
  });

  console.log(`Connected to MongoDB: ${MONGODB_URI}`);
  return mongoose.connection;
};

export const getDatabaseStatus = () => {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
};

export default mongoose;
