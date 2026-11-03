import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';

/**
 * Singleton PrismaClient instance to prevent multiple database connection pools
 * from accumulating during hot module reloads in development.
 */
const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});

export default prisma;

