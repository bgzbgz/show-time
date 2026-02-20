import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// =============================================================================
// LearnWorlds Course ID -> Tool Slug Mapping
// =============================================================================
// TODO: Replace these placeholder course IDs with real LearnWorlds course IDs.
// The keys are LearnWorlds course IDs, the values are tool slugs in user_progress.

const COURSE_TO_TOOL_SLUG: Record<string, string> = {
  'course-woop': 'woop',
  'course-know-thyself': 'know-thyself',
  'course-dream': 'dream',
  'course-values': 'values',
  'course-team': 'team',
  'course-fit': 'fit',
  'course-cash': 'cash',
  'course-energy': 'energy',
  'course-goals': 'goals',
  'course-focus': 'focus',
};

// =============================================================================
// Request Validation Schemas
// =============================================================================
// Matches the actual LearnWorlds courseCompleted webhook payload (v2).
// See: LearnWorlds docs — "When a course is completed"

const CourseCompletedPayloadSchema = z.object({
  version: z.number().optional(),
  type: z.literal('courseCompleted'),
  trigger: z.string().optional(),
  school_id: z.string().optional(),
  data: z.object({
    completed_at: z.number().optional(),
    manually_completed: z.boolean().optional(),
    ip_address: z.string().nullable().optional(),
    course: z.object({
      id: z.string().min(1),
      title: z.string().optional().default(''),
      access: z.string().optional(),
    }).passthrough(),
    user: z.object({
      id: z.string().min(1),
      email: z.string().email(),
      first_name: z.string().optional().default(''),
      last_name: z.string().optional().default(''),
      username: z.string().optional(),
    }).passthrough(),
  }),
});

// =============================================================================
// Middleware: Webhook Secret Verification
// =============================================================================

function verifyWebhookSignature(req: Request): boolean {
  const signatureHeader = req.headers['learnworlds-webhook-signature'] as string | undefined;
  const expectedSecret = process.env.LEARNWORLDS_WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.error('LEARNWORLDS_WEBHOOK_SECRET is not configured');
    return false;
  }

  if (!signatureHeader) {
    return false;
  }

  // LearnWorlds sends: "v1=<signature_value>"
  // Compare against our stored secret (which is the raw signature value)
  const signature = signatureHeader.startsWith('v1=')
    ? signatureHeader.slice(3)
    : signatureHeader;

  return signature === expectedSecret;
}

// =============================================================================
// POST /learnworlds/course-completed
// =============================================================================
// Handles the courseCompleted webhook event from LearnWorlds.
// - Maps the course_id to a tool_slug
// - Looks up or creates the user by email
// - Inserts a tool_completions row to mark the tool as complete
// - Logs the event to webhook_events
// - Always returns 200 OK for fast webhook acknowledgment

router.post(
  '/learnworlds/course-completed',
  asyncHandler(async (req: Request, res: Response) => {
    // Always return 200 to acknowledge receipt quickly.
    // We process inline but catch all errors so the response never fails.
    try {
      // -----------------------------------------------------------------------
      // 1. Verify shared secret
      // -----------------------------------------------------------------------
      if (!verifyWebhookSignature(req)) {
        console.warn('Webhook secret verification failed');
        // Still return 200 — we don't want LearnWorlds to retry endlessly,
        // but we log the failure and bail out of processing.
        return res.status(200).json({ received: true, processed: false, reason: 'unauthorized' });
      }

      // -----------------------------------------------------------------------
      // 2. Validate payload
      // -----------------------------------------------------------------------
      const parseResult = CourseCompletedPayloadSchema.safeParse(req.body);

      if (!parseResult.success) {
        console.warn('Invalid webhook payload:', parseResult.error.flatten());
        return res.status(200).json({ received: true, processed: false, reason: 'invalid_payload' });
      }

      const { data, type } = parseResult.data;
      const lwUserId = data.user.id;
      const user_email = data.user.email;
      const user_name = [data.user.first_name, data.user.last_name].filter(Boolean).join(' ');
      const course_id = data.course.id;
      const course_title = data.course.title;

      // -----------------------------------------------------------------------
      // 3. Map course_id to tool_slug (from DB first, fallback to hardcoded)
      // -----------------------------------------------------------------------
      let toolSlug: string | undefined;

      // Try database mapping first (editable in Supabase dashboard)
      const { data: mapping } = await supabase
        .from('course_tool_mapping')
        .select('tool_slug')
        .eq('course_id', course_id)
        .single();

      if (mapping) {
        toolSlug = mapping.tool_slug;
      } else {
        // Fallback to hardcoded mapping
        toolSlug = COURSE_TO_TOOL_SLUG[course_id];
      }

      if (!toolSlug) {
        console.warn(`No tool_slug mapping found for course_id: ${course_id}`);
        await logWebhookEvent(type, req.body, false, `No mapping for course_id: ${course_id}`);
        return res.status(200).json({ received: true, processed: false, reason: 'unmapped_course' });
      }

      // -----------------------------------------------------------------------
      // 4. Look up or create user by email
      // -----------------------------------------------------------------------
      const user = await upsertUserByEmail(user_email, user_name, lwUserId);

      if (!user) {
        console.error(`Failed to upsert user for email: ${user_email}`);
        await logWebhookEvent(type, req.body, false, 'user_upsert_failed');
        return res.status(200).json({ received: true, processed: false, reason: 'user_error' });
      }

      // -----------------------------------------------------------------------
      // 5. Insert tool_completions row
      // -----------------------------------------------------------------------
      const { error: completionError } = await supabase
        .from('tool_completions')
        .upsert(
          {
            user_id: user.id,
            tool_slug: toolSlug,
            completed_at: new Date().toISOString(),
            source: 'learnworlds_webhook',
            course_id,
            course_title,
          },
          { onConflict: 'user_id,tool_slug' }
        );

      if (completionError) {
        console.error('Failed to insert tool_completions:', completionError);
        await logWebhookEvent(type, req.body, false, completionError.message);
        return res.status(200).json({ received: true, processed: false, reason: 'completion_insert_failed' });
      }

      console.log(`Tool completion recorded: user=${user_email}, tool=${toolSlug}, course=${course_id}`);

      // -----------------------------------------------------------------------
      // 6. Log webhook event
      // -----------------------------------------------------------------------
      await logWebhookEvent(type, req.body, true);

      return res.status(200).json({ received: true, processed: true });
    } catch (err: unknown) {
      // Catch-all: never let the webhook response fail
      console.error('Unhandled error processing webhook:', err);

      try {
        await logWebhookEvent('courseCompleted', req.body, false, String(err));
      } catch {
        // Logging itself failed — nothing more we can do
      }

      return res.status(200).json({ received: true, processed: false, reason: 'internal_error' });
    }
  })
);

// =============================================================================
// Helper: Upsert User by Email
// =============================================================================

interface UpsertedUser {
  id: string;
  email: string;
}

async function upsertUserByEmail(
  email: string,
  name: string,
  learnworldsUserId: string
): Promise<UpsertedUser | null> {
  // Try to find existing user by email
  const { data: existingUser, error: lookupError } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single();

  // PGRST116 = "not found" — that's expected when the user is new
  if (lookupError && lookupError.code !== 'PGRST116') {
    console.error('Error looking up user by email:', lookupError);
    return null;
  }

  if (existingUser) {
    // Update learnworlds_user_id if not already set
    const { error: updateError } = await supabase
      .from('users')
      .update({ learnworlds_user_id: learnworldsUserId })
      .eq('id', existingUser.id);

    if (updateError) {
      console.error('Failed to update learnworlds_user_id:', updateError);
      // Non-fatal — the user still exists
    }

    return existingUser as UpsertedUser;
  }

  // Create new user
  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert({
      email,
      full_name: name || email.split('@')[0],
      learnworlds_user_id: learnworldsUserId,
      role: 'user',
      last_login: new Date().toISOString(),
    })
    .select('id, email')
    .single();

  if (createError) {
    console.error('Failed to create user:', createError);
    return null;
  }

  return newUser as UpsertedUser;
}

// =============================================================================
// Helper: Log Webhook Event
// =============================================================================

async function logWebhookEvent(
  eventType: string,
  payload: unknown,
  success: boolean,
  errorMessage?: string
): Promise<void> {
  const { error } = await supabase
    .from('webhook_events')
    .insert({
      source: 'learnworlds',
      event_type: eventType,
      payload,
      processed: success,
      error_message: errorMessage || null,
    });

  if (error) {
    console.error('Failed to log webhook event:', error);
  }
}

export default router;
