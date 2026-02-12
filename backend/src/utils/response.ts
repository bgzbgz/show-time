import type { Response } from 'express';

// =============================================================================
// API Response Types
// =============================================================================

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// =============================================================================
// Response Helper Functions
// =============================================================================

/**
 * Send successful response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response<SuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message }),
  });
}

/**
 * Send paginated response
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: {
    page: number;
    limit: number;
    total: number;
  },
  message?: string
): Response<SuccessResponse<T[]>> {
  return res.status(200).json({
    success: true,
    data,
    meta,
    ...(message && { message }),
  });
}

/**
 * Send created response (201)
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Resource created successfully'
): Response<SuccessResponse<T>> {
  return sendSuccess(res, data, message, 201);
}

/**
 * Send accepted response (202) for async operations
 */
export function sendAccepted<T>(
  res: Response,
  data: T,
  message = 'Request accepted for processing'
): Response<SuccessResponse<T>> {
  return sendSuccess(res, data, message, 202);
}

/**
 * Send no content response (204)
 */
export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

/**
 * Send error response
 */
export function sendError(
  res: Response,
  error: string,
  message?: string,
  statusCode = 400
): Response<ErrorResponse> {
  return res.status(statusCode).json({
    success: false,
    error,
    ...(message && { message }),
  });
}

/**
 * Send validation error response
 */
export function sendValidationError(
  res: Response,
  errors: Array<{ field: string; message: string }>,
  message = 'Validation failed'
): Response<ErrorResponse> {
  return res.status(400).json({
    success: false,
    error: 'Validation Error',
    message,
    errors,
  });
}

/**
 * Send not found response
 */
export function sendNotFound(
  res: Response,
  message = 'Resource not found'
): Response<ErrorResponse> {
  return sendError(res, 'Not Found', message, 404);
}

/**
 * Send unauthorized response
 */
export function sendUnauthorized(
  res: Response,
  message = 'Unauthorized access'
): Response<ErrorResponse> {
  return sendError(res, 'Unauthorized', message, 401);
}

/**
 * Send forbidden response
 */
export function sendForbidden(
  res: Response,
  message = 'Access forbidden'
): Response<ErrorResponse> {
  return sendError(res, 'Forbidden', message, 403);
}

/**
 * Send conflict response
 */
export function sendConflict(
  res: Response,
  message = 'Resource already exists'
): Response<ErrorResponse> {
  return sendError(res, 'Conflict', message, 409);
}

/**
 * Send rate limit response
 */
export function sendTooManyRequests(
  res: Response,
  message = 'Too many requests',
  retryAfter?: number
): Response<ErrorResponse> {
  if (retryAfter) {
    res.setHeader('Retry-After', retryAfter.toString());
  }
  return sendError(res, 'Too Many Requests', message, 429);
}

/**
 * Send internal server error response
 */
export function sendInternalError(
  res: Response,
  message = 'Internal server error'
): Response<ErrorResponse> {
  return sendError(res, 'Internal Server Error', message, 500);
}

/**
 * Send service unavailable response
 */
export function sendServiceUnavailable(
  res: Response,
  message = 'Service temporarily unavailable'
): Response<ErrorResponse> {
  return sendError(res, 'Service Unavailable', message, 503);
}
