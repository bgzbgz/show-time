import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from './errorHandler.js';
import type { Role } from '../types/index.js';

// =============================================================================
// Role-Based Access Control (RBAC) Middleware
// =============================================================================

/**
 * Middleware to check if user has required role(s)
 * Must be used after authenticate middleware
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Ensure user is authenticated
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
}

/**
 * Require admin role
 */
export const requireAdmin = authorize('admin');

/**
 * Require admin or guru role
 */
export const requireAdminOrGuru = authorize('admin', 'guru');

/**
 * Allow all authenticated users (any role)
 */
export const requireAuth = authorize('user', 'admin', 'guru');

// =============================================================================
// Resource Ownership Check
// =============================================================================

/**
 * Check if user owns the resource or is admin/guru
 * Returns true if user can access, false otherwise
 */
export function canAccessResource(
  req: Request,
  resourceUserId: string
): boolean {
  if (!req.user) {
    return false;
  }

  // Admin and guru can access any resource
  if (req.user.role === 'admin' || req.user.role === 'guru') {
    return true;
  }

  // Regular users can only access their own resources
  return req.user.id === resourceUserId;
}

/**
 * Middleware to check resource ownership
 * Expects resourceUserId to be set in req.params or req.body
 */
export function checkResourceOwnership(
  getUserIdFromRequest: (req: Request) => string
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const resourceUserId = getUserIdFromRequest(req);

    if (!canAccessResource(req, resourceUserId)) {
      return next(
        new ForbiddenError('You do not have permission to access this resource')
      );
    }

    next();
  };
}

// =============================================================================
// Organization-Based Access Control
// =============================================================================

/**
 * Check if user belongs to the same organization as the resource
 * Gurus can access resources in their assigned organizations
 */
export function checkOrganizationAccess(
  getOrgIdFromRequest: (req: Request) => string | null
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    const resourceOrgId = getOrgIdFromRequest(req);

    // If resource has no org, only admin can access
    if (!resourceOrgId) {
      return next(new ForbiddenError('Access denied'));
    }

    // Check if user's organization matches resource organization
    if (req.user.organization_id !== resourceOrgId) {
      return next(
        new ForbiddenError(
          'You can only access resources within your organization'
        )
      );
    }

    next();
  };
}

// =============================================================================
// Conditional Authorization
// =============================================================================

/**
 * Allow access if any condition is met
 * Example: Allow if user is admin OR owns the resource
 */
export function authorizeIf(
  ...conditions: Array<(req: Request) => boolean>
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // Check if any condition is satisfied
    const hasAccess = conditions.some((condition) => condition(req));

    if (!hasAccess) {
      return next(new ForbiddenError('Access denied'));
    }

    next();
  };
}

// =============================================================================
// Helper Functions for Common Checks
// =============================================================================

/**
 * Check if user is admin
 */
export function isAdmin(req: Request): boolean {
  return req.user?.role === 'admin';
}

/**
 * Check if user is guru
 */
export function isGuru(req: Request): boolean {
  return req.user?.role === 'guru';
}

/**
 * Check if user is admin or guru
 */
export function isAdminOrGuru(req: Request): boolean {
  return isAdmin(req) || isGuru(req);
}

/**
 * Check if user owns resource
 */
export function ownsResource(req: Request, resourceUserId: string): boolean {
  return req.user?.id === resourceUserId;
}

/**
 * Check if user can modify resource (owner, admin, or guru)
 */
export function canModifyResource(req: Request, resourceUserId: string): boolean {
  return ownsResource(req, resourceUserId) || isAdminOrGuru(req);
}
