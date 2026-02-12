import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { UnauthorizedError } from './errorHandler.js';
import type { JWTPayload } from '../types/index.js';

// =============================================================================
// JWT Authentication Middleware
// =============================================================================

/**
 * Middleware to verify JWT token and attach user to request
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError('No authorization token provided');
    }

    // Check for Bearer token format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Invalid authorization format. Expected: Bearer <token>');
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
}

/**
 * Optional authentication - attaches user if token present, but doesn't require it
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1];
      const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
}

// =============================================================================
// Token Generation Utilities
// =============================================================================

/**
 * Generate JWT access token
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY,
  });
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ id: userId, type: 'refresh' }, config.JWT_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRY,
  });
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { id: string } {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; type: string };

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return { id: decoded.id };
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}

/**
 * Extract user ID from request (requires authenticate middleware)
 */
export function getUserId(req: Request): string {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }
  return req.user.id;
}

/**
 * Get user from request (optional)
 */
export function getOptionalUser(req: Request): JWTPayload | null {
  return req.user ?? null;
}
