import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendError, sendUnauthorized, sendNotFound, sendInternalError } from '../utils/response.js';
import { generateAccessToken } from '../middleware/auth.js';
import { config } from '../config/env.js';

const router = Router();

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate HMAC signature for SSO token
 */
function validateSSOSignature(
  sso: string,
  email: string,
  userId: string,
  timestamp: number
): boolean {
  if (!config.LEARNWORLDS_SSO_SECRET) {
    throw new Error('LEARNWORLDS_SSO_SECRET not configured');
  }

  // Reconstruct the payload that was signed: email,user_id,timestamp
  const payload = `${email},${userId},${timestamp}`;

  // Generate expected signature
  const expectedSignature = crypto
    .createHmac('sha256', config.LEARNWORLDS_SSO_SECRET)
    .update(payload)
    .digest('hex');

  // Timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(sso, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false; // Length mismatch or invalid hex
  }
}

/**
 * Validate timestamp (must be within 5 minutes)
 */
function validateTimestamp(timestamp: number): boolean {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timeDiff = Math.abs(currentTimestamp - timestamp);
  return timeDiff <= 300; // 5 minutes in seconds
}

/**
 * Get user progress data
 */
async function getUserProgress(userId: string) {
  const { data: progressRecords, error } = await supabase
    .from('user_progress')
    .select('sprint_id, tool_slug, status, is_unlocked, completed_at, unlocked_at, started_at')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  // Organize progress into categories
  const completed_tools = progressRecords
    ?.filter((p) => p.status === 'completed')
    .map((p) => ({
      sprint_id: p.sprint_id,
      tool_slug: p.tool_slug,
      completed_at: p.completed_at,
    })) || [];

  const current_unlocked = progressRecords
    ?.filter((p) => p.is_unlocked && p.status !== 'completed')
    .map((p) => ({
      sprint_id: p.sprint_id,
      tool_slug: p.tool_slug,
      is_unlocked: true,
      unlocked_at: p.unlocked_at,
    })) || [];

  const locked_tools = progressRecords
    ?.filter((p) => !p.is_unlocked)
    .map((p) => ({
      sprint_id: p.sprint_id,
      tool_slug: p.tool_slug,
      is_unlocked: false,
    })) || [];

  return {
    completed_tools,
    current_unlocked,
    locked_tools,
  };
}

// =============================================================================
// GET /api/learnworlds/sso/validate - Validate SSO Token (LEGACY - HMAC)
// =============================================================================
// NOTE: This endpoint is kept for backward compatibility
// New implementation should use /api/learnworlds/auth endpoint below

router.get(
  '/sso/validate',
  asyncHandler(async (req: Request, res: Response) => {
    const { sso, timestamp, email, user_id } = req.query;

    // Validate required parameters
    if (!sso || !timestamp || !email || !user_id) {
      return sendError(res, 'Missing required parameters: sso, timestamp, email, user_id');
    }

    const timestampNum = parseInt(timestamp as string, 10);
    const emailStr = email as string;
    const userIdStr = user_id as string;
    const ssoToken = sso as string;

    // Validate email format
    if (!isValidEmail(emailStr)) {
      return sendError(res, 'Invalid email format');
    }

    // Validate timestamp (replay attack prevention)
    if (!validateTimestamp(timestampNum)) {
      return sendUnauthorized(res, 'Token expired');
    }

    // Validate HMAC signature
    if (!validateSSOSignature(ssoToken, emailStr, userIdStr, timestampNum)) {
      return sendUnauthorized(res, 'Invalid signature');
    }

    // Look up user by LearnWorlds user ID
    const { data: existingUser, error: lookupError} = await supabase
      .from('users')
      .select('*')
      .eq('learnworlds_user_id', userIdStr)
      .single();

    let user = existingUser;

    if (lookupError && lookupError.code !== 'PGRST116') {
      // PGRST116 is "not found" - other errors are real errors
      return sendInternalError(res, 'Database error');
    }

    // Create new user if doesn't exist
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          learnworlds_user_id: userIdStr,
          learnworlds_email: emailStr,
          email: emailStr,
          full_name: emailStr.split('@')[0], // Default name from email
          sso_verified_at: new Date().toISOString(),
          role: 'user',
          last_login: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        return sendInternalError(res, 'Failed to create user');
      }

      user = newUser;
    } else {
      // Update SSO verification timestamp for existing user
      const { error: updateError } = await supabase
        .from('users')
        .update({
          sso_verified_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Failed to update SSO timestamp:', updateError);
      }
    }

    // Generate JWT token
    const token = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id,
    });

    // Get user progress
    const progress = await getUserProgress(user.id);

    // Return success response
    return sendSuccess(res, {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        learnworlds_user_id: user.learnworlds_user_id,
      },
      progress,
    });
  })
);

// =============================================================================
// GET /api/learnworlds/auth - Simplified Authentication for External Links
// =============================================================================
// This endpoint handles LearnWorlds External Link Learning Activities
// URL format: /api/learnworlds/auth?user_id={{USER_ID}}&email={{EMAIL}}&course_id={{COURSE_ID}}

router.get(
  '/auth',
  asyncHandler(async (req: Request, res: Response) => {
    const { user_id, email, course_id, user_name, redirect } = req.query;

    // Validate required parameters
    if (!user_id || !email) {
      return sendError(res, 'Missing required parameters: user_id, email');
    }

    const userIdStr = user_id as string;
    const emailStr = email as string;
    const courseIdStr = course_id as string | undefined;
    const userNameStr = user_name as string | undefined;
    const redirectPath = redirect as string | undefined;

    // Validate email format
    if (!isValidEmail(emailStr)) {
      return sendError(res, 'Invalid email format');
    }

    // Look up user by LearnWorlds user ID
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('learnworlds_user_id', userIdStr)
      .single();

    let user = existingUser;

    if (lookupError && lookupError.code !== 'PGRST116') {
      // PGRST116 is "not found" - other errors are real errors
      return sendInternalError(res, 'Database error');
    }

    // Create new user if doesn't exist
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          learnworlds_user_id: userIdStr,
          learnworlds_email: emailStr,
          email: emailStr,
          full_name: userNameStr || emailStr.split('@')[0], // Use provided name or default from email
          sso_verified_at: new Date().toISOString(),
          role: 'user',
          last_login: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        return sendInternalError(res, 'Failed to create user');
      }

      user = newUser;

      // Initialize progress for new user
      try {
        await initializeUserProgress(userIdStr);
      } catch (error) {
        console.error('Failed to initialize user progress:', error);
        // Don't fail auth if progress init fails
      }
    } else {
      // Update last login for existing user
      const { error: updateError } = await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Failed to update last login:', updateError);
      }
    }

    // Generate JWT token
    const token = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id,
    });

    // Log authentication for debugging
    console.log(`✓ LearnWorlds auth: ${emailStr} (${userIdStr}) from course ${courseIdStr || 'unknown'}`);

    // If redirect parameter provided, redirect to frontend tool with token
    if (redirectPath) {
      const frontendUrl = config.FRONTEND_URL || 'http://localhost:3001';
      const redirectUrl = `${frontendUrl}${redirectPath}?token=${token}`;
      return res.redirect(redirectUrl);
    }

    // Otherwise, return JSON (for API testing)
    const progress = await getUserProgress(user.id);
    return sendSuccess(res, {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        learnworlds_user_id: user.learnworlds_user_id,
      },
      progress,
    });
  })
);

// =============================================================================
// Webhook Helper Functions
// =============================================================================

/**
 * Validate webhook signature
 */
function validateWebhookSignature(
  signature: string,
  payload: string
): boolean {
  if (!config.LEARNWORLDS_WEBHOOK_SECRET) {
    throw new Error('LEARNWORLDS_WEBHOOK_SECRET not configured');
  }

  // Generate expected signature
  const expectedSignature = crypto
    .createHmac('sha256', config.LEARNWORLDS_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  // Timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Check if webhook event has already been processed (idempotency)
 */
async function isEventProcessed(eventId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('event_id', eventId)
    .single();

  return !!data && !error;
}

/**
 * Mark webhook event as processed
 */
async function markEventProcessed(eventId: string, eventType: string, payload: any): Promise<void> {
  await supabase
    .from('webhook_events')
    .insert({
      event_id: eventId,
      event_type: eventType,
      payload: payload,
      processed_at: new Date().toISOString(),
    });
}

/**
 * Unlock sprint tool for user
 */
async function unlockTool(learnworldsUserId: string, sprintId: number): Promise<void> {
  // Find user by LearnWorlds ID
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('learnworlds_user_id', learnworldsUserId)
    .single();

  if (userError || !user) {
    throw new Error('User not found');
  }

  // Update all tools in the sprint to unlocked
  const { error: updateError } = await supabase
    .from('user_progress')
    .update({
      is_unlocked: true,
      unlocked_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('sprint_id', sprintId)
    .eq('is_unlocked', false); // Only update if not already unlocked

  if (updateError) {
    throw updateError;
  }
}

/**
 * Unlock a specific tool by tool slug
 */
async function unlockSpecificTool(learnworldsUserId: string, toolSlug: string): Promise<void> {
  // Find user by LearnWorlds ID
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('learnworlds_user_id', learnworldsUserId)
    .single();

  if (userError || !user) {
    throw new Error('User not found');
  }

  // Update specific tool to unlocked
  const { error: updateError } = await supabase
    .from('user_progress')
    .update({
      is_unlocked: true,
      unlocked_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('tool_slug', toolSlug)
    .eq('is_unlocked', false); // Only update if not already unlocked

  if (updateError) {
    throw updateError;
  }
}

/**
 * Initialize progress records for new user enrollment
 */
async function initializeUserProgress(learnworldsUserId: string): Promise<void> {
  // Find user by LearnWorlds ID
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('learnworlds_user_id', learnworldsUserId)
    .single();

  if (userError || !user) {
    throw new Error('User not found');
  }

  // Check if progress already initialized
  const { data: existing } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  if (existing && existing.length > 0) {
    return; // Already initialized
  }

  // Tool slugs mapped to sprint IDs
  const toolMapping = [
    { sprint_id: 0, tool_slug: 'woop' },
    { sprint_id: 1, tool_slug: 'know-thyself' },
    { sprint_id: 1, tool_slug: 'ikigai' },
    { sprint_id: 2, tool_slug: 'dream' },
    { sprint_id: 3, tool_slug: 'values' },
    { sprint_id: 4, tool_slug: 'team' },
    { sprint_id: 5, tool_slug: 'fit' },
    { sprint_id: 5, tool_slug: 'cash' },
    { sprint_id: 5, tool_slug: 'energy' },
    { sprint_id: 5, tool_slug: 'goals' },
    { sprint_id: 5, tool_slug: 'focus' },
    { sprint_id: 5, tool_slug: 'performance' },
    { sprint_id: 5, tool_slug: 'meeting-rhythm' },
    { sprint_id: 6, tool_slug: 'market-size' },
    { sprint_id: 6, tool_slug: 'segmentation' },
    { sprint_id: 6, tool_slug: 'target-segment' },
    { sprint_id: 6, tool_slug: 'value-proposition' },
    { sprint_id: 6, tool_slug: 'vp-testing' },
    { sprint_id: 6, tool_slug: 'product-development' },
    { sprint_id: 6, tool_slug: 'pricing' },
    { sprint_id: 6, tool_slug: 'brand-marketing' },
    { sprint_id: 6, tool_slug: 'customer-service' },
    { sprint_id: 6, tool_slug: 'route-to-market' },
    { sprint_id: 7, tool_slug: 'core-activities' },
    { sprint_id: 7, tool_slug: 'processes-decisions' },
    { sprint_id: 7, tool_slug: 'fit-abc' },
    { sprint_id: 7, tool_slug: 'org-redesign' },
    { sprint_id: 7, tool_slug: 'employer-branding' },
    { sprint_id: 8, tool_slug: 'agile-teams' },
    { sprint_id: 8, tool_slug: 'digitalization' },
    { sprint_id: 8, tool_slug: 'digital-heart' },
    { sprint_id: 9, tool_slug: 'program-overview' },
  ];

  // Create progress records
  const progressRecords = toolMapping.map((tool, index) => ({
    user_id: user.id,
    sprint_id: tool.sprint_id,
    tool_slug: tool.tool_slug,
    status: index === 0 ? 'unlocked' : 'locked', // First tool (WOOP) unlocked by default
    is_unlocked: index === 0,
    unlocked_at: index === 0 ? new Date().toISOString() : null,
    progress_percentage: 0,
  }));

  await supabase.from('user_progress').insert(progressRecords);
}

// =============================================================================
// POST /api/learnworlds/webhook - Process LearnWorlds Webhooks
// =============================================================================

// Simple in-memory rate limiter
const webhookRateLimiter = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100;

  if (!webhookRateLimiter.has(ip)) {
    webhookRateLimiter.set(ip, []);
  }

  const requests = webhookRateLimiter.get(ip)!;

  // Remove old requests outside the window
  const recentRequests = requests.filter((timestamp) => now - timestamp < windowMs);
  webhookRateLimiter.set(ip, recentRequests);

  if (recentRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  recentRequests.push(now);
  webhookRateLimiter.set(ip, recentRequests);
  return true;
}

router.post(
  '/webhook',
  asyncHandler(async (req: Request, res: Response) => {
    // Rate limiting
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
      });
    }

    // Get signature from headers
    // LearnWorlds uses 'Learnworlds-Webhook-Signature' header with 'v1=' prefix
    const signatureHeader = req.headers['learnworlds-webhook-signature'] as string;
    if (!signatureHeader) {
      return sendUnauthorized(res, 'Missing webhook signature');
    }

    // Extract signature (format: "v1=abc123...")
    const signature = signatureHeader.startsWith('v1=')
      ? signatureHeader.substring(3)
      : signatureHeader;

    // Validate webhook signature
    const payload = JSON.stringify(req.body);
    if (!validateWebhookSignature(signature, payload)) {
      return sendUnauthorized(res, 'Invalid webhook signature');
    }

    // Parse LearnWorlds webhook payload structure
    // Real format: { version: 2, type: "courseCompleted", data: { user: {...}, course: {...} } }
    const eventType = req.body.type;
    const eventData = req.body.data || {};
    const userId = eventData.user?.id;
    const courseId = eventData.course?.id;
    const timestamp = eventData.completed_at || eventData.date;

    // Generate event_id for idempotency (LearnWorlds doesn't provide one)
    // Use combination of type + user + course + timestamp
    const eventId = `${eventType}_${userId}_${courseId}_${timestamp}`;

    // Validate timestamp (prevent old webhooks)
    if (timestamp && !validateTimestamp(timestamp)) {
      return sendError(res, 'Webhook timestamp too old');
    }

    // Idempotency check
    if (eventId) {
      const processed = await isEventProcessed(eventId);
      if (processed) {
        return sendSuccess(res, { success: true, message: 'Event already processed' });
      }
    }

    try {
      // Handle different event types
      switch (eventType) {
        case 'courseCompleted':
          if (!userId) {
            return sendError(res, 'Missing user id in webhook data');
          }

          // Parse course_id to determine what to unlock
          // Supports two formats:
          // 1. Sprint-based: "sprint-0", "sprint-1" → unlocks all tools in that sprint
          // 2. Tool-based: "woop", "know-thyself" → unlocks that specific tool
          if (courseId && typeof courseId === 'string') {
            const sprintMatch = courseId.match(/sprint-(\d+)/i);
            if (sprintMatch) {
              // Sprint-based unlocking
              const sprintId = parseInt(sprintMatch[1], 10);
              console.log(`Course completed: ${courseId}, unlocking sprint ${sprintId} for user ${userId}`);
              await unlockTool(userId, sprintId);
            } else {
              // Tool-based unlocking (one course per tool)
              // Assume courseId matches tool_slug
              console.log(`Course completed: ${courseId}, unlocking tool ${courseId} for user ${userId}`);
              try {
                await unlockSpecificTool(userId, courseId);
              } catch (error: any) {
                console.log(`Failed to unlock tool ${courseId}: ${error.message}`);
                // Don't throw - tool might not exist, that's ok
              }
            }
          }

          // Also update user record with course completion timestamp
          const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('learnworlds_user_id', userId)
            .single();

          if (user) {
            await supabase
              .from('users')
              .update({ course_completed_at: new Date().toISOString() })
              .eq('id', user.id);
          }
          break;

        case 'enrolledFreeCourse':
          if (!userId) {
            return sendError(res, 'Missing user id in webhook data');
          }

          console.log(`User enrolled in free course: ${userId}, ${courseId}`);
          // Initialize progress records for new enrollment
          await initializeUserProgress(userId);
          break;

        case 'productBought':
          // Handle paid course purchases
          if (!userId) {
            return sendError(res, 'Missing user id in webhook data');
          }

          console.log(`User purchased product: ${userId}`);
          // Initialize progress records for new purchase
          await initializeUserProgress(userId);
          break;

        default:
          // Log unknown event types but don't error (allows LearnWorlds to add new events)
          console.log(`Unknown webhook event type: ${eventType}`, req.body);
          return sendSuccess(res, { success: true, message: 'Event type not handled' });
      }

      // Mark event as processed
      if (eventId) {
        await markEventProcessed(eventId, eventType, req.body);
      }

      return sendSuccess(res, { success: true, message: 'Webhook processed' });

    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }
      throw error; // Other errors handled by asyncHandler
    }
  })
);

export default router;
