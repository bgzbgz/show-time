import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

// =============================================================================
// Custom Error Classes
// =============================================================================

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, message);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(429, message);
  }
}

// =============================================================================
// Error Handler Middleware
// =============================================================================

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: unknown = undefined;

  // Handle known error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    // Zod validation errors
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma database errors
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        statusCode = 409;
        message = 'Resource already exists';
        break;
      case 'P2025': // Record not found
        statusCode = 404;
        message = 'Resource not found';
        break;
      case 'P2003': // Foreign key constraint
        statusCode = 400;
        message = 'Invalid reference';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid database query';
  }

  // Log error (in production, send to monitoring service)
  if (statusCode >= 500) {
    console.error('Server Error:', err);
  } else {
    console.warn('Client Error:', message, err.message);
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.message,
    }),
  });
};

// =============================================================================
// Async Handler Wrapper
// =============================================================================

/**
 * Wraps async route handlers to catch errors and pass to error middleware
 */
export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
