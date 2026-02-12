import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { toolService } from '../services/ToolService.js';
import { exportService } from '../services/ExportService.js';
import { authenticate } from '../middleware/auth.js';
import { exportRateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { prisma } from '../config/database.js';

const router = Router();

// =============================================================================
// Request Validation Schemas
// =============================================================================

const SaveSubmissionSchema = z.object({
  data: z.record(z.unknown()),
  status: z.enum(['draft', 'in_progress', 'submitted', 'completed']).optional(),
});

const SubmitToolSchema = z.object({
  data: z.record(z.unknown()),
});

// =============================================================================
// GET /api/tools - List all tools with user progress
// =============================================================================

router.get(
  '/',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // Get tools with user progress
    const tools = await toolService.getToolsWithProgress(userId);

    return sendSuccess(res, tools);
  })
);

// =============================================================================
// GET /api/tools/:slug - Get tool metadata
// =============================================================================

router.get(
  '/:slug',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const userId = req.user!.id;

    // Get tool metadata
    const tool = toolService.getTool(slug);

    // Get user's progress for this tool
    const progress = await prisma.user_progress.findUnique({
      where: {
        user_id_tool_slug: {
          user_id: userId,
          tool_slug: slug,
        },
      },
    });

    return sendSuccess(res, {
      ...tool,
      user_status: progress?.status,
      user_progress: progress?.progress_percentage || 0,
      unlocked: progress?.status !== 'locked',
    });
  })
);

// =============================================================================
// GET /api/tools/:slug/data - Get user's submission
// =============================================================================

router.get(
  '/:slug/data',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const userId = req.user!.id;

    // Verify tool exists
    toolService.getTool(slug);

    // Get submission
    const submission = await toolService.getSubmission(userId, slug);

    if (!submission) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No submission found for this tool',
      });
    }

    return sendSuccess(res, submission);
  })
);

// =============================================================================
// POST /api/tools/:slug/data - Save/update submission
// =============================================================================

router.post(
  '/:slug/data',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const userId = req.user!.id;

    // Validate request body
    const { data, status } = SaveSubmissionSchema.parse(req.body);

    // Get user's organization
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { organization_id: true },
    });

    // Save submission
    const submission = await toolService.saveSubmission(
      userId,
      user?.organization_id || null,
      slug,
      data,
      status || 'draft'
    );

    // Check if this is a new submission
    const isNew = submission.version === 1;

    if (isNew) {
      return sendCreated(res, submission, 'Submission created successfully');
    } else {
      return sendSuccess(res, submission, 'Submission updated successfully');
    }
  })
);

// =============================================================================
// POST /api/tools/:slug/submit - Submit completed tool
// =============================================================================

router.post(
  '/:slug/submit',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const userId = req.user!.id;

    // Validate request body
    const { data } = SubmitToolSchema.parse(req.body);

    // Submit tool
    const submission = await toolService.submitTool(userId, slug, data);

    // Update user progress and unlock dependent tools
    const { toolOrchestrator } = await import('../services/ToolOrchestrator.js');
    await toolOrchestrator.updateProgress(userId, slug, 'completed');

    return sendSuccess(res, submission, 'Tool submitted successfully');
  })
);

// =============================================================================
// GET /api/tools/:slug/dependencies - Get dependency data
// =============================================================================

router.get(
  '/:slug/dependencies',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const userId = req.user!.id;

    // Verify tool exists
    toolService.getTool(slug);

    // Resolve dependencies
    const { toolOrchestrator } = await import('../services/ToolOrchestrator.js');
    const dependencies = await toolOrchestrator.resolveDependencies(slug, userId);

    // Check unlock status
    const unlockStatus = await toolOrchestrator.checkUnlockStatus(slug, userId);

    return sendSuccess(res, {
      tool_slug: slug,
      unlocked: unlockStatus.unlocked,
      missing_dependencies: unlockStatus.missing_dependencies,
      dependencies: Object.values(dependencies),
    });
  })
);

// =============================================================================
// GET /api/tools/:slug/export - Export submission (JSON or PDF)
// =============================================================================

router.get(
  '/:slug/export',
  authenticate,
  exportRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const userId = req.user!.id;
    const format = (req.query.format as string) || 'json';

    // Validate format
    if (!['json', 'pdf'].includes(format)) {
      return res.status(400).json({
        error: 'Invalid format',
        message: 'Format must be either "json" or "pdf"',
      });
    }

    // Verify tool exists
    toolService.getTool(slug);

    // Get user info for filename
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { full_name: true },
    });

    const username = user?.full_name || 'user';
    const filename = exportService.generateFilename(slug, username, format as 'json' | 'pdf');

    // Export based on format
    if (format === 'json') {
      const exportData = await exportService.exportJSON(userId, slug);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      return res.json(exportData);
    } else {
      // PDF export
      const pdf = await exportService.exportPDF(userId, slug);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdf.length.toString());

      return res.send(pdf);
    }
  })
);

export default router;
