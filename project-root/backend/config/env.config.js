import { config } from 'dotenv';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
}

export const PORT = process.env.PORT || 8080;

export const {
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
