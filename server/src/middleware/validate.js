import { sendError } from '../utils/response.js';

/**
 * Higher-order middleware function to defensively validate request parts using Zod schemas.
 * 
 * @param {object} schemas
 * @param {import('zod').ZodSchema} [schemas.body] - Schema for req.body
 * @param {import('zod').ZodSchema} [schemas.query] - Schema for req.query
 * @param {import('zod').ZodSchema} [schemas.params] - Schema for req.params
 */
export function validateRequest({ body, query, params }) {
  return (req, res, next) => {
    try {
      if (body) {
        const parsedBody = body.safeParse(req.body);
        if (!parsedBody.success) {
          const formatted = parsedBody.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }));
          return sendError(res, 'Validation failed for request body', 400, 'VALIDATION_ERROR', formatted);
        }
        req.body = parsedBody.data;
      }

      if (query) {
        const parsedQuery = query.safeParse(req.query);
        if (!parsedQuery.success) {
          const formatted = parsedQuery.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }));
          return sendError(res, 'Validation failed for query parameters', 400, 'VALIDATION_ERROR', formatted);
        }
        req.query = parsedQuery.data;
      }

      if (params) {
        const parsedParams = params.safeParse(req.params);
        if (!parsedParams.success) {
          const formatted = parsedParams.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }));
          return sendError(res, 'Validation failed for route parameters', 400, 'VALIDATION_ERROR', formatted);
        }
        req.params = parsedParams.data;
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

