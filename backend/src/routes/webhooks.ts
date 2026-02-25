import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// =============================================================================
// LearnWorlds Course ID -> Tool Slug Mapping (hardcoded fallback)
// =============================================================================

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

// Format 1: Standard LearnWorlds webhook (Settings > Developers > Webhooks)
const StandardWebhookSchema = z.object({
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

// Format 2: LearnWorlds automation webhook (user/course/school at top level)
const AutomationWebhookSchema = z.object({
  user: z.object({
    id: z.string().min(1),
    email: z.string().email(),
    username: z.string().optional().default(''),
  }).passthrough(),
  course: z.object({
    id: z.string().min(1),
    title: z.string().optional().default(''),
  }).passthrough(),
  school: z.object({}).passthrough().optional(),
  courses: z.array(z.any()).optional(),
});

// =============================================================================
// Normalize payload from either format into a common shape
// =============================================================================

interface NormalizedPayload {
  lwUserId: string;
  userEmail: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  userTags: string[];
}

function normalizePayload(body: unknown): NormalizedPayload | null {
  // Try standard webhook format first
  const std = StandardWebhookSchema.safeParse(body);
  if (std.success) {
    const { data } = std.data;
    const rawUser = data.user as Record<string, unknown>;
    return {
      lwUserId: data.user.id,
      userEmail: data.user.email,
      userName: [data.user.first_name, data.user.last_name].filter(Boolean).join(' '),
      courseId: data.course.id,
      courseTitle: data.course.title || '',
      userTags: Array.isArray(rawUser.tags) ? (rawUser.tags as string[]) : [],
    };
  }

  // Try automation webhook format
  const auto = AutomationWebhookSchema.safeParse(body);
  if (auto.success) {
    const rawUser = auto.data.user as Record<string, unknown>;
    return {
      lwUserId: auto.data.user.id,
      userEmail: auto.data.user.email,
      userName: auto.data.user.username || '',
      courseId: auto.data.course.id,
      courseTitle: auto.data.course.title || '',
      userTags: Array.isArray(rawUser.tags) ? (rawUser.tags as string[]) : [],
    };
  }

  return null;
}

// =============================================================================
// POST /learnworlds/course-completed
// =============================================================================
// Handles courseCompleted events from LearnWorlds.
// Accepts both standard webhook and automation webhook payload formats.
// - Maps the course_id to a tool_slug
// - Looks up or creates the user by email
// - Inserts a tool_completions row to mark the tool as complete
// - Logs the event to webhook_events
// - Always returns 200 OK for fast webhook acknowledgment

router.post(
  '/learnworlds/course-completed',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      // -----------------------------------------------------------------------
      // 1. Log the raw payload for debugging
      // -----------------------------------------------------------------------
      console.log('Webhook received:', JSON.stringify(req.body).slice(0, 500));

      // -----------------------------------------------------------------------
      // 2. Normalize payload (accepts both standard and automation formats)
      // -----------------------------------------------------------------------
      const payload = normalizePayload(req.body);

      if (!payload) {
        console.warn('Invalid webhook payload — does not match standard or automation format');
        await logWebhookEvent('unknown', req.body, false, 'invalid_payload_format');
        return res.status(200).json({ received: true, processed: false, reason: 'invalid_payload' });
      }

      const { lwUserId, userEmail, userName, courseId, courseTitle, userTags } = payload;
      console.log(`Processing: user=${userEmail}, course=${courseId}, tags=${userTags.join(',')}`);

      // -----------------------------------------------------------------------
      // 3. Map course_id to tool_slug (from DB first, fallback to hardcoded)
      // -----------------------------------------------------------------------
      let toolSlug: string | undefined;

      const { data: mapping } = await supabase
        .from('course_tool_mapping')
        .select('tool_slug')
        .eq('course_id', courseId)
        .single();

      if (mapping) {
        toolSlug = mapping.tool_slug;
      } else {
        toolSlug = COURSE_TO_TOOL_SLUG[courseId];
      }

      if (!toolSlug) {
        console.warn(`No tool_slug mapping found for course_id: ${courseId}`);
        await logWebhookEvent('courseCompleted', req.body, false, `No mapping for course_id: ${courseId}`);
        return res.status(200).json({ received: true, processed: false, reason: 'unmapped_course' });
      }

      // -----------------------------------------------------------------------
      // 4. Look up or create user by email
      // -----------------------------------------------------------------------
      const user = await upsertUserByEmail(userEmail, userName, lwUserId);

      if (!user) {
        console.error(`Failed to upsert user for email: ${userEmail}`);
        await logWebhookEvent('courseCompleted', req.body, false, 'user_upsert_failed');
        return res.status(200).json({ received: true, processed: false, reason: 'user_error' });
      }

      // -----------------------------------------------------------------------
      // 4b. Auto-assign organization from email domain or LearnWorlds tags
      // -----------------------------------------------------------------------
      await assignOrganization(user.id, userEmail, userTags);

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
            course_id: courseId,
            course_title: courseTitle,
          },
          { onConflict: 'user_id,tool_slug' }
        );

      if (completionError) {
        console.error('Failed to insert tool_completions:', completionError);
        await logWebhookEvent('courseCompleted', req.body, false, completionError.message);
        return res.status(200).json({ received: true, processed: false, reason: 'completion_insert_failed' });
      }

      console.log(`Tool completion recorded: user=${userEmail}, tool=${toolSlug}, course=${courseId}`);

      // -----------------------------------------------------------------------
      // 6. Log webhook event
      // -----------------------------------------------------------------------
      await logWebhookEvent('courseCompleted', req.body, true);

      return res.status(200).json({ received: true, processed: true });
    } catch (err: unknown) {
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
  const { data: existingUser, error: lookupError } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single();

  if (lookupError && lookupError.code !== 'PGRST116') {
    console.error('Error looking up user by email:', lookupError);
    return null;
  }

  if (existingUser) {
    const { error: updateError } = await supabase
      .from('users')
      .update({ learnworlds_user_id: learnworldsUserId })
      .eq('id', existingUser.id);

    if (updateError) {
      console.error('Failed to update learnworlds_user_id:', updateError);
    }

    return existingUser as UpsertedUser;
  }

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
// Helper: Assign Organization from Email Domain or LearnWorlds Tags
// =============================================================================
// Priority: 1) email domain match, 2) LearnWorlds tag match.
// If a match is found, sets organization_id on the user record.

async function assignOrganization(
  userId: string,
  email: string,
  tags: string[]
): Promise<void> {
  const { data: orgs, error: orgError } = await supabase
    .from('organizations')
    .select('id, email_domain, learnworlds_tag');

  if (orgError || !orgs || orgs.length === 0) {
    return;
  }

  // 1) Try email domain match (most reliable)
  const emailDomain = email.split('@')[1]?.toLowerCase();
  let matchedOrg = emailDomain
    ? orgs.find(org => org.email_domain && org.email_domain.toLowerCase() === emailDomain)
    : undefined;

  // 2) Fallback to LearnWorlds tag match
  if (!matchedOrg && tags.length > 0) {
    const lowerTags = tags.map(t => t.toLowerCase().trim());
    matchedOrg = orgs.find(org =>
      org.learnworlds_tag && lowerTags.includes(org.learnworlds_tag.toLowerCase())
    );
  }

  if (!matchedOrg) {
    return;
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({ organization_id: matchedOrg.id })
    .eq('id', userId);

  if (updateError) {
    console.error(`Failed to assign organization to user ${userId}:`, updateError);
  } else {
    const matchType = matchedOrg.email_domain?.toLowerCase() === emailDomain ? 'email' : 'tag';
    console.log(`Assigned user ${userId} to org ${matchedOrg.id} (${matchType}: ${matchType === 'email' ? emailDomain : matchedOrg.learnworlds_tag})`);
  }
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
