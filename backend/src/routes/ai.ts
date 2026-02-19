import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { aiService } from '../services/AIService.js';
import { challengeService } from '../services/ChallengeService.js';
import { authenticate } from '../middleware/auth.js';
import { createRateLimiter, createAIRateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess } from '../utils/response.js';
import { config } from '../config/env.js';
import { supabase } from '../config/supabase.js';

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

// =============================================================================
// Challenge Endpoint — Validation & Rate Limiter
// =============================================================================

const AIChallengeRequestSchema = z.object({
  user_id: z.string().uuid(),
  tool_slug: z.string().min(1),
  answers: z.record(z.unknown()),
  attempt: z.number().int().min(1).max(10).optional().default(1),
});

const AIChallengeActionSchema = z.object({
  log_id: z.string().uuid(),
  action: z.enum(['revised', 'submitted_anyway']),
});

// Rate limit by user_id in body (no JWT) — 20/hour
const challengeRateLimiter = createRateLimiter({
  maxRequests: 20,
  windowMs: 60 * 60 * 1000,
  keyGenerator: (req: Request) => `challenge:${req.body?.user_id || req.ip}`,
  message: 'Challenge limit reached. Maximum 20 AI reviews per hour.',
});

// =============================================================================
// POST /api/ai/challenge - Review answers before submission
// =============================================================================

router.post(
  '/challenge',
  challengeRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    // Feature flag check
    if (!config.ENABLE_AI_INTEGRATION) {
      return sendSuccess(res, {
        has_challenges: false,
        challenges: [],
        encouragement: 'AI review is currently disabled.',
      });
    }

    // Check if service is available
    if (!challengeService.isAvailable()) {
      return sendSuccess(res, {
        has_challenges: false,
        challenges: [],
        encouragement: 'AI review is not configured.',
      });
    }

    // Validate request
    const { user_id, tool_slug, answers, attempt } = AIChallengeRequestSchema.parse(req.body);

    // Validate user exists
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (!user) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid user_id',
      });
    }

    // Call challenge service
    const result = await challengeService.reviewAnswers(user_id, tool_slug, answers, attempt);

    return sendSuccess(res, result);
  })
);

// =============================================================================
// POST /api/ai/challenge-action - Log user's action after challenge
// =============================================================================

router.post(
  '/challenge-action',
  asyncHandler(async (req: Request, res: Response) => {
    const { log_id, action } = AIChallengeActionSchema.parse(req.body);
    await challengeService.updateUserAction(log_id, action);
    return sendSuccess(res, { updated: true });
  })
);

// =============================================================================
// POST /api/ai/suggest-slices - AI generates elephant slices from a goal
// =============================================================================

const SuggestSlicesSchema = z.object({
  user_id: z.string().uuid(),
  elephant_goal: z.string().min(5).max(2000),
  context: z.object({
    wish: z.string().optional(),
    outcome: z.string().optional(),
    obstacle: z.string().optional(),
  }).optional(),
});

router.post(
  '/suggest-slices',
  challengeRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    if (!config.ENABLE_AI_INTEGRATION) {
      return res.status(503).json({ error: 'AI not enabled' });
    }

    const { user_id, elephant_goal, context } = SuggestSlicesSchema.parse(req.body);

    const result = await challengeService.suggestSlices(elephant_goal, context);
    return sendSuccess(res, result);
  })
);

export default router;
