import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

/**
 * Global Centralized Error Handling Middleware for Express.
 * Guarantees zero unhandled promise rejections crashing the application.
 */
export function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';
  let details = err.details || null;

  // Handle malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request payload';
    code = 'MALFORMED_JSON';
  }

  // Handle Prisma Database Errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Unique constraint violation on field: ${(err.meta?.target || []).join(', ')}`;
    code = 'DUPLICATE_ENTRY';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested database record not found';
    code = 'RECORD_NOT_FOUND';
  }

  // Log non-operational (system/unexpected) bugs for engineering review
  if (!(err instanceof AppError) || !err.isOperational) {
    console.error('💥 Unhandled Exception:', {
      path: req.originalUrl,
      method: req.method,
      error: err
    });
  }

  // Attach stack trace only in development
  if (env.NODE_ENV === 'development' && !details) {
    details = { stack: err.stack };
  }

  return sendError(res, message, statusCode, code, details);
}

