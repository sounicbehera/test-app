/**
 * Standardized HTTP response helpers.
 * Guarantees uniform client-server API contract across all endpoints.
 */

/**
 * Sends a standardized success response.
 * @param {import('express').Response} res
 * @param {any} data - Data payload to return to client
 * @param {number} [statusCode=200] - HTTP status code (200, 201)
 * @param {object} [meta=null] - Optional pagination or metadata
 */
export function sendSuccess(res, data = null, statusCode = 200, meta = null) {
  const payload = {
    success: true,
    data
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}

/**
 * Sends a standardized error response.
 * @param {import('express').Response} res
 * @param {string} message - Human-readable error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {string} [code='INTERNAL_ERROR'] - Machine-readable error code
 * @param {any} [details=null] - Validation issues or stack (in dev)
 */
export function sendError(res, message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
  const payload = {
    success: false,
    error: {
      code,
      message
    }
  };

  if (details) {
    payload.error.details = details;
  }

  return res.status(statusCode).json(payload);
}

