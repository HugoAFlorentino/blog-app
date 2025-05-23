import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const {
  PORT,
  MONGODB_CONNECTION,
  ACCESS_SECRET,
  REFRESH_SECRET,
  NODE_ENV,
} = process.env;
