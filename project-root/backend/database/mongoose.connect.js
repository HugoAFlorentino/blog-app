import mongoose from 'mongoose';
import { MONGODB_CONNECTION } from '../config/env.config.js';

const db_connection = async () => {
  try {
    await mongoose.connect(MONGODB_CONNECTION);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export default db_connection;
