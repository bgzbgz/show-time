import { Router, type Request, type Response } from 'express';
import { progressService } from '../services/ProgressService.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

// =============================================================================
// GET /api/user/progress - Get overall progress summary
// =============================================================================

router.get(
  '/progress',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // Get progress summary
    const summary = await progressService.getProgressSummary(userId);

    return sendSuccess(res, summary);
  })
);

// =============================================================================
// GET /api/user/next-tool - Get next available tool
// =============================================================================

router.get(
  '/next-tool',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // Get next available tool
    const nextTool = await progressService.getNextAvailableTool(userId);

    return sendSuccess(res, nextTool);
  })
);

// =============================================================================
// GET /api/user/stats - Get user statistics
// =============================================================================

router.get(
  '/stats',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // Get progress summary
    const summary = await progressService.getProgressSummary(userId);

    // Calculate statistics
    const completedProgress = summary.progress.filter(p => p.status === 'completed');
    const totalTimeSpent = completedProgress.reduce((total, p) => {
      const time = progressService.getTimeSpent(p);
      return total + (time || 0);
    }, 0);

    const stats = {
      total_tools: summary.total_tools,
      completed: summary.completed_tools,
      in_progress: summary.in_progress_tools,
      unlocked: summary.unlocked_tools,
      locked: summary.locked_tools,
      completion_percentage: summary.overall_completion_percentage,
      total_time_spent_hours: Math.round(totalTimeSpent * 10) / 10,
      average_time_per_tool_hours:
        completedProgress.length > 0
          ? Math.round((totalTimeSpent / completedProgress.length) * 10) / 10
          : 0,
      current_streak: 0, // TODO: Implement streak calculation
    };

    return sendSuccess(res, stats);
  })
);

export default router;
