/**
 * Custom Operational Application Error class.
 * Differentiates operational client errors (4xx) from programmer / internal errors (5xx).
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error description
   * @param {number} statusCode - HTTP status code (e.g., 400, 401, 403, 404, 500)
   * @param {string} [code='INTERNAL_ERROR'] - Machine-readable error code for frontend consumption
   * @param {any} [details=null] - Additional validation or debugging payload
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

