import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { sendSuccess } from './utils/response.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors({
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// HTTP Request Logger
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Request Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check Endpoint (Essential for micro-vivas, uptime monitors, and CI)
app.get('/health', (req, res) => {
  return sendSuccess(res, {
    status: 'HEALTHY',
    service: 'swayam-proctor-api',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Root API Welcome / Discoverability
app.get('/api/v1', (req, res) => {
  return sendSuccess(res, {
    name: 'Swayam Proctor API',
    version: '1.0.0',
    documentation: '/api/v1/docs'
  });
});

// Placeholder for Phase 2 routes (exams, sessions, questions, violations)
// Will be dynamically hooked during Phase 2

// 404 Catch-All Middleware
app.use(notFoundHandler);

// Centralized Global Error Handler Middleware
app.use(errorHandler);

export default app;

