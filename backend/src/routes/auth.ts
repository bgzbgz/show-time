import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/AuthService.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

const router = Router();

// =============================================================================
// Request Validation Schemas
// =============================================================================

const SSOLoginSchema = z.object({
  user_id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  signature: z.string().min(1),
  timestamp: z.number().int().positive(),
});

const RefreshTokenSchema = z.object({
  refresh_token: z.string().min(1),
});

// =============================================================================
// POST /api/auth/sso - LearnWorlds SSO Callback
// =============================================================================

router.post(
  '/sso',
  asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const payload = SSOLoginSchema.parse(req.body);

    // Process SSO login
    const { accessToken, refreshToken, user } = await authService.processSSOLogin(payload);

    // Set refresh token as httpOnly cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return access token and user info
    return sendCreated(res, {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 86400, // 24 hours in seconds
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        organization_id: user.organization_id,
      },
    }, 'Login successful');
  })
);

// =============================================================================
// POST /api/auth/refresh - Refresh Access Token
// =============================================================================

router.post(
  '/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies?.refresh_token || req.body.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Refresh token not provided',
      });
    }

    // Refresh access token
    const { accessToken, user } = await authService.refreshAccessToken(refreshToken);

    return sendSuccess(res, {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 86400,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        organization_id: user.organization_id,
      },
    }, 'Token refreshed successfully');
  })
);

// =============================================================================
// GET /api/auth/me - Get Current User
// =============================================================================

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get full user details
    const user = await authService.getCurrentUser(req.user.id);

    // Get user's progress summary
    const progressSummary = await getUserProgressSummary(req.user.id);

    return sendSuccess(res, {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      organization_id: user.organization_id,
      created_at: user.created_at,
      last_login: user.last_login,
      progress: progressSummary,
    });
  })
);

// =============================================================================
// POST /api/auth/logout - Logout
// =============================================================================

router.post(
  '/logout',
  authenticate,
  asyncHandler(async (_req: Request, res: Response) => {
    // Clear refresh token cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return sendSuccess(res, null, 'Logged out successfully');
  })
);

// =============================================================================
// Helper Functions
// =============================================================================

async function getUserProgressSummary(userId: string) {
  // Import prisma here to avoid circular dependency
  const { prisma } = await import('../config/database.js');

  const progressRecords = await prisma.user_progress.findMany({
    where: { user_id: userId },
  });

  const completed = progressRecords.filter((p) => p.status === 'completed').length;
  const inProgress = progressRecords.filter((p) => p.status === 'in_progress').length;
  const unlocked = progressRecords.filter((p) => p.status === 'unlocked').length;

  return {
    completed_tools: completed,
    in_progress_tools: inProgress,
    unlocked_tools: unlocked,
    total_tools: progressRecords.length,
    overall_percentage: Math.round((completed / progressRecords.length) * 100),
  };
}

export default router;
