import app from './app.js';
import { env } from './config/env.js';
import prisma from './db/prisma.js';

let server;

/**
 * Bootstraps database connectivity and initializes HTTP listener.
 */
async function startServer() {
  try {
    // Verify database connectivity
    await prisma.$connect();
    console.log('✅ SQLite Database connected successfully via Prisma ORM.');

    server = app.listen(env.PORT, () => {
      console.log(`🚀 Swayam Proctor Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
      console.log(`📡 Health check accessible at: http://localhost:${env.PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

/**
 * Handles graceful shutdown to safely terminate in-flight requests and close DB pools.
 * @param {string} signal - Triggering OS signal
 */
async function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Commencing graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('🔒 Closed remaining HTTP connections.');
      try {
        await prisma.$disconnect();
        console.log('💾 Disconnected from Prisma ORM cleanly.');
        process.exit(0);
      } catch (err) {
        console.error('Error during database disconnect:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }

  // Force close if graceful shutdown exceeds 10s
  setTimeout(() => {
    console.error('⚠️ Forcefully shutting down after timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception thrown:', error);
  process.exit(1);
});

startServer();

