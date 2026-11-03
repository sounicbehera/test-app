import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env configuration
dotenv.config();

/**
 * Zod schema to enforce strict typing on environment configuration.
 * Fails fast on application boot if essential variables are missing or malformed.
 */
const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CORS_ORIGIN: z.string().default('http://localhost:5173')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid Environment Configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

