import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { ForbiddenError, UnauthorizedError } from './errorHandler.js';

/**
 * Middleware to check if user can access a tool
 * Must be used after authenticate and toolExists middleware
 */
export async function checkToolAccess(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Ensure tool exists
    if (!req.tool) {
      throw new Error('toolExists middleware must be called before checkToolAccess');
    }

    const userId = req.user.id;
    const toolSlug = req.tool.slug;

    // Get user's progress for this tool
    const progress = await prisma.user_progress.findUnique({
      where: {
        user_id_tool_slug: {
          user_id: userId,
          tool_slug: toolSlug,
        },
      },
    });

    // Check if tool is locked
    if (progress?.status === 'locked') {
      // Get missing dependencies for error message
      // TODO: This will be enhanced in Section 6 with actual dependency resolution
      throw new ForbiddenError(
        `Tool "${req.tool.name}" is locked. Complete prerequisite tools to unlock.`
      );
    }

    // Admin and guru can access any tool regardless of status
    if (req.user.role === 'admin' || req.user.role === 'guru') {
      return next();
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to allow access only to unlocked or in-progress tools
 */
export async function requireUnlocked(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user || !req.tool) {
      throw new UnauthorizedError('Authentication required');
    }

    const progress = await prisma.user_progress.findUnique({
      where: {
        user_id_tool_slug: {
          user_id: req.user.id,
          tool_slug: req.tool.slug,
        },
      },
    });

    const allowedStatuses = ['unlocked', 'in_progress', 'completed'];
    if (!progress || !allowedStatuses.includes(progress.status)) {
      throw new ForbiddenError('Tool is not accessible');
    }

    next();
  } catch (error) {
    next(error);
  }
}
