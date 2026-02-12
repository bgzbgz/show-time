import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

// =============================================================================
// Request Logger Middleware
// =============================================================================

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    // Determine log level based on status code
    const logLevel = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARN' : 'INFO';

    // Color codes for terminal output
    const colors = {
      INFO: '\x1b[36m', // Cyan
      WARN: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m', // Red
      RESET: '\x1b[0m',
    };

    const color = colors[logLevel];
    const reset = colors.RESET;

    // Format log message
    const timestamp = new Date().toISOString();
    const logMessage = `${color}[${timestamp}] ${logLevel}${reset} ${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`;

    console.log(logMessage);

    // In production, send to external logging service (e.g., Sentry, DataDog)
    if (config.NODE_ENV === 'production' && statusCode >= 500) {
      // TODO: Send to error tracking service
    }
  });

  next();
}

// =============================================================================
// Structured Logging Utility
// =============================================================================

export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'INFO', message, ...meta, timestamp: new Date().toISOString() }));
  },

  warn: (message: string, meta?: object) => {
    console.warn(JSON.stringify({ level: 'WARN', message, ...meta, timestamp: new Date().toISOString() }));
  },

  error: (message: string, error?: Error, meta?: object) => {
    console.error(
      JSON.stringify({
        level: 'ERROR',
        message,
        error: error?.message,
        stack: error?.stack,
        ...meta,
        timestamp: new Date().toISOString(),
      })
    );
  },

  debug: (message: string, meta?: object) => {
    if (config.LOG_LEVEL === 'debug') {
      console.debug(JSON.stringify({ level: 'DEBUG', message, ...meta, timestamp: new Date().toISOString() }));
    }
  },
};
