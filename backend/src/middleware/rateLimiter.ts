import { type Request, type Response, type NextFunction } from 'express';
import { TooManyRequestsError } from './errorHandler.js';

// =============================================================================
// Rate Limiter Middleware
// =============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();

  /**
   * Check if request should be rate limited
   */
  checkLimit(
    key: string,
    maxRequests: number,
    windowMs: number
  ): { allowed: boolean; resetTime: number; remaining: number } {
    const now = Date.now();
    const entry = this.requests.get(key);

    // No entry exists - create new one
    if (!entry) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        allowed: true,
        resetTime: now + windowMs,
        remaining: maxRequests - 1,
      };
    }

    // Entry expired - reset it
    if (now > entry.resetTime) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        allowed: true,
        resetTime: now + windowMs,
        remaining: maxRequests - 1,
      };
    }

    // Entry still valid - check count
    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        resetTime: entry.resetTime,
        remaining: 0,
      };
    }

    // Increment count
    entry.count++;
    return {
      allowed: true,
      resetTime: entry.resetTime,
      remaining: maxRequests - entry.count,
    };
  }

  /**
   * Clear expired entries (cleanup)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

// Cleanup expired entries every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

/**
 * Create rate limit middleware
 */
export function createRateLimiter(options: {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}) {
  const {
    maxRequests,
    windowMs,
    keyGenerator = (req: Request) => req.user?.id || req.ip || 'anonymous',
    message = 'Too many requests, please try again later',
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator(req);
    const result = rateLimiter.checkLimit(key, maxRequests, windowMs);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
    res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      throw new TooManyRequestsError(message);
    }

    next();
  };
}

/**
 * Export rate limiter - 10 requests per hour per user
 */
export const exportRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Export limit exceeded. Maximum 10 exports per hour.',
});

/**
 * AI request rate limiter - role-based limits
 */
export function createAIRateLimiter() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role || 'user';

    // Different limits based on role
    const limits = {
      user: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
      admin: { maxRequests: 50, windowMs: 60 * 60 * 1000 }, // 50 per hour
      guru: { maxRequests: 50, windowMs: 60 * 60 * 1000 }, // 50 per hour
    };

    const limit = limits[role as keyof typeof limits] || limits.user;

    const limiter = createRateLimiter({
      maxRequests: limit.maxRequests,
      windowMs: limit.windowMs,
      message: `AI request limit exceeded. Maximum ${limit.maxRequests} requests per hour for ${role} role.`,
    });

    limiter(req, res, next);
  };
}
