import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const {
  PORT,
  MONGODB_CONNECTION,
  ACCESS_SECRET,
  REFRESH_SECRET,
  NODE_ENV,
  BREVO_API_KEY,
  BREVO_SENDER_EMAIL,
  FRONTEND_URL,
  SITE_KEY,
  SECRET_KEY,
} = process.env;
