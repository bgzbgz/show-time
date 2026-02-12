import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth.js';
import { UnauthorizedError, ConflictError } from '../middleware/errorHandler.js';
import type { User, JWTPayload, Role } from '../types/index.js';

// =============================================================================
// LearnWorlds SSO Types
// =============================================================================

interface LearnWorldsSSOPayload {
  user_id: string;
  email: string;
  name: string;
  signature: string;
  timestamp: number;
}

// =============================================================================
// AuthService
// =============================================================================

export class AuthService {
  /**
   * Validate LearnWorlds SSO signature
   */
  private validateSSOSignature(payload: LearnWorldsSSOPayload): boolean {
    if (!config.LEARNWORLDS_SSO_SECRET) {
      throw new Error('LEARNWORLDS_SSO_SECRET not configured');
    }

    // Check timestamp (prevent replay attacks - accept within 5 minutes)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDiff = Math.abs(currentTimestamp - payload.timestamp);
    if (timeDiff > 300) {
      // 5 minutes
      return false;
    }

    // Reconstruct signature
    const dataString = `${payload.user_id}|${payload.email}|${payload.name}|${payload.timestamp}`;
    const expectedSignature = crypto
      .createHmac('sha256', config.LEARNWORLDS_SSO_SECRET)
      .update(dataString)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(payload.signature), Buffer.from(expectedSignature));
  }

  /**
   * Process LearnWorlds SSO login
   */
  async processSSOLogin(ssoPayload: LearnWorldsSSOPayload): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
  }> {
    // Validate signature
    if (!this.validateSSOSignature(ssoPayload)) {
      throw new UnauthorizedError('Invalid SSO signature');
    }

    // Find or create user
    let user = await prisma.users.findUnique({
      where: { lms_user_id: ssoPayload.user_id },
    });

    if (!user) {
      // Create new user
      user = await this.createUserFromSSO(ssoPayload);
    } else {
      // Update last login
      user = await prisma.users.update({
        where: { id: user.id },
        data: { last_login: new Date() },
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as Role,
      organization_id: user.organization_id,
    });

    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: user as User,
    };
  }

  /**
   * Create user from SSO payload
   */
  private async createUserFromSSO(ssoPayload: LearnWorldsSSOPayload): Promise<User> {
    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: ssoPayload.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered with different account');
    }

    // Create user
    const user = await prisma.users.create({
      data: {
        lms_user_id: ssoPayload.user_id,
        email: ssoPayload.email,
        full_name: ssoPayload.name,
        role: 'user',
        last_login: new Date(),
      },
    });

    // Initialize user progress (31 tools)
    await this.initializeUserProgress(user.id);

    return user as User;
  }

  /**
   * Initialize progress for all 31 tools
   */
  private async initializeUserProgress(userId: string): Promise<void> {
    const toolSlugs = [
      'woop',
      'know-thyself',
      'dream',
      'values',
      'team',
      'fit',
      'cash',
      'energy',
      'goals',
      'focus',
      'performance',
      'meeting-rhythm',
      'market-size',
      'segmentation',
      'target-segment',
      'value-proposition',
      'vp-testing',
      'product-development',
      'pricing',
      'brand-marketing',
      'customer-service',
      'route-to-market',
      'core-activities',
      'processes-decisions',
      'fit-abc',
      'org-redesign',
      'employer-branding',
      'agile-teams',
      'digitalization',
      'digital-heart',
      'program-overview',
    ];

    const progressEntries = toolSlugs.map((slug, index) => ({
      user_id: userId,
      tool_slug: slug,
      status: index === 0 ? 'unlocked' : 'locked', // Sprint 0 (WOOP) unlocked by default
      progress_percentage: 0,
      unlocked_at: index === 0 ? new Date() : null,
    }));

    await prisma.user_progress.createMany({
      data: progressEntries,
    });
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    user: User;
  }> {
    // Verify refresh token (will throw if invalid)
    const { id: userId } = verifyRefreshToken(refreshToken);

    // Get user
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as Role,
      organization_id: user.organization_id,
    });

    return {
      accessToken,
      user: user as User,
    };
  }

  /**
   * Get current user details
   */
  async getCurrentUser(userId: string): Promise<User> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user as User;
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, newRole: Role): Promise<User> {
    const user = await prisma.users.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return user as User;
  }
}

// Export singleton instance
export const authService = new AuthService();

// Re-export for convenience
import { verifyRefreshToken } from '../middleware/auth.js';
