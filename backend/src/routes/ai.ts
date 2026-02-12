import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { aiService } from '../services/AIService.js';
import { authenticate } from '../middleware/auth.js';
import { createAIRateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

// =============================================================================
// Request Validation Schema
// =============================================================================

const AIHelpRequestSchema = z.object({
  tool_slug: z.string().min(1),
  question: z.string().min(1).max(2000),
});

// =============================================================================
// POST /api/ai/help - Get AI assistance for a tool
// =============================================================================

router.post(
  '/help',
  authenticate,
  createAIRateLimiter(),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // Validate request body
    const { tool_slug, question } = AIHelpRequestSchema.parse(req.body);

    // Additional validation
    const validation = aiService.validateRequest({
      userId,
      toolSlug: tool_slug,
      question,
    });

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation Error',
        message: validation.error,
      });
    }

    // Send help request to n8n
    try {
      const answer = await aiService.sendHelpRequest({
        userId,
        toolSlug: tool_slug,
        question,
      });

      return sendSuccess(res, {
        question,
        answer,
        tool_slug,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      // Handle specific error cases
      if (error.message?.includes('timeout')) {
        return res.status(504).json({
          error: 'Gateway Timeout',
          message: 'AI request took too long. Please try again with a shorter question.',
        });
      }

      if (error.message?.includes('unavailable')) {
        return res.status(503).json({
          error: 'Service Unavailable',
          message: 'AI assistant is temporarily unavailable. Please try again later.',
        });
      }

      // Generic error
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while processing your AI request.',
      });
    }
  })
);

export default router;
