import type { Request, Response, NextFunction } from 'express';
import { toolService } from '../services/ToolService.js';
import { NotFoundError } from './errorHandler.js';

/**
 * Middleware to validate that tool slug exists
 * Attaches tool metadata to req.tool
 */
export function toolExists(req: Request, _res: Response, next: NextFunction): void {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw new NotFoundError('Tool slug is required');
    }

    // Get tool (will throw if not found)
    const tool = toolService.getTool(slug);

    // Attach tool to request
    req.tool = tool;

    next();
  } catch (error) {
    next(error);
  }
}
