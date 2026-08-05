import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '5000',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'lockme_ai_super_secret_jwt_key_2026',
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY || ''
};
