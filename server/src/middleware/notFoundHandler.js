import { sendError } from '../utils/response.js';

/**
 * 404 Not Found Middleware for unhandled route paths.
 */
export function notFoundHandler(req, res, _next) {
  return sendError(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
    'RESOURCE_NOT_FOUND'
  );
}

