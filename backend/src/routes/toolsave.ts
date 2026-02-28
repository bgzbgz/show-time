import { Router, type Request, type Response } from 'express';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = Router();

// In-memory cache for tool_questions (they never change at runtime)
const questionsCache = new Map<string, any[]>();

// =============================================================================
// GET /api/toolsave/questions?tool_slug=know-thyself
// Returns tool_questions for a given tool slug. Cached in-memory.
// =============================================================================

router.get(
  '/questions',
  asyncHandler(async (req: Request, res: Response) => {
    const toolSlug = req.query.tool_slug as string;
    if (!toolSlug) {
      return sendError(res, 'tool_slug query param required', undefined, 400);
    }

    // Check cache first
    if (questionsCache.has(toolSlug)) {
      return sendSuccess(res, questionsCache.get(toolSlug));
    }

    const start = Date.now();
    const { data, error } = await supabase
      .from('tool_questions')
      .select('id, question_key, question_type, reference_key')
      .eq('tool_slug', toolSlug);

    if (error) {
      console.error('[ToolSave] questions error:', error);
      return sendError(res, 'Failed to load questions', error.message, 500);
    }

    const rows = data || [];
    questionsCache.set(toolSlug, rows);
    console.log(`[ToolSave] GET /questions ${toolSlug} — ${rows.length} rows, ${Date.now() - start}ms`);
    return sendSuccess(res, rows);
  })
);

// =============================================================================
// GET /api/toolsave/load?tool_slug=know-thyself&user_id=<uuid>
// Returns saved responses for a user on a tool, keyed by question_key.
// =============================================================================

router.get(
  '/load',
  asyncHandler(async (req: Request, res: Response) => {
    const toolSlug = req.query.tool_slug as string;
    const userId = req.query.user_id as string;

    if (!toolSlug || !userId) {
      return sendError(res, 'tool_slug and user_id query params required', undefined, 400);
    }

    const start = Date.now();

    // Get questions (from cache or DB)
    let questions = questionsCache.get(toolSlug);
    if (!questions) {
      const { data, error } = await supabase
        .from('tool_questions')
        .select('id, question_key, question_type, reference_key')
        .eq('tool_slug', toolSlug);
      if (error) {
        return sendError(res, 'Failed to load questions', error.message, 500);
      }
      questions = data || [];
      questionsCache.set(toolSlug, questions);
    }

    if (questions.length === 0) {
      return sendSuccess(res, {});
    }

    const questionIds = questions.map((q: any) => q.id);
    const { data: responses, error: respError } = await supabase
      .from('user_responses')
      .select('question_id, response_value, response_data')
      .eq('user_id', userId)
      .in('question_id', questionIds);

    if (respError) {
      console.error('[ToolSave] load error:', respError);
      return sendError(res, 'Failed to load responses', respError.message, 500);
    }

    // Build id→key map
    const idToKey: Record<string, string> = {};
    for (const q of questions) {
      idToKey[q.id] = q.question_key;
    }

    // Build result keyed by question_key
    const result: Record<string, any> = {};
    for (const row of (responses || [])) {
      const key = idToKey[row.question_id];
      if (key) {
        result[key] = row.response_data !== null ? row.response_data : row.response_value;
      }
    }

    console.log(`[ToolSave] GET /load ${toolSlug} user=${userId.slice(0, 8)} — ${Object.keys(result).length} responses, ${Date.now() - start}ms`);
    return sendSuccess(res, result);
  })
);

// =============================================================================
// GET /api/toolsave/dependency?reference_key=target_segment&user_id=<uuid>
// Returns a single dependency value by reference_key (cross-tool).
// =============================================================================

router.get(
  '/dependency',
  asyncHandler(async (req: Request, res: Response) => {
    const referenceKey = req.query.reference_key as string;
    const userId = req.query.user_id as string;

    if (!referenceKey || !userId) {
      return sendError(res, 'reference_key and user_id query params required', undefined, 400);
    }

    const start = Date.now();

    const { data: questions } = await supabase
      .from('tool_questions')
      .select('id')
      .eq('reference_key', referenceKey)
      .limit(1);

    if (!questions || questions.length === 0) {
      return sendSuccess(res, null);
    }

    const { data: responses } = await supabase
      .from('user_responses')
      .select('response_value, response_data')
      .eq('user_id', userId)
      .eq('question_id', questions[0].id)
      .limit(1);

    if (!responses || responses.length === 0) {
      return sendSuccess(res, null);
    }

    const row = responses[0];
    const value = row.response_data !== null ? row.response_data : row.response_value;
    console.log(`[ToolSave] GET /dependency ${referenceKey} user=${userId.slice(0, 8)} — ${Date.now() - start}ms`);
    return sendSuccess(res, value);
  })
);

// =============================================================================
// POST /api/toolsave/identify
// Resolves a LearnWorlds user to an internal UUID.
// Creates the user row if it doesn't exist yet.
// Called by tool-db.js instead of writing directly to Supabase with the anon key.
// =============================================================================

router.post(
  '/identify',
  asyncHandler(async (req: Request, res: Response) => {
    const { lw_user_id, lw_email, lw_name } = req.body;

    if (!lw_user_id && !lw_email) {
      return sendError(res, 'lw_user_id or lw_email required', undefined, 400);
    }

    let user: { id: string; learnworlds_user_id: string | null } | null = null;

    // 1. Look up by learnworlds_user_id
    if (lw_user_id) {
      const { data } = await supabase
        .from('users')
        .select('id, learnworlds_user_id')
        .eq('learnworlds_user_id', lw_user_id)
        .single();
      user = data;
    }

    // 2. Fall back to email lookup
    if (!user && lw_email) {
      const { data } = await supabase
        .from('users')
        .select('id, learnworlds_user_id')
        .eq('email', lw_email.toLowerCase())
        .single();

      if (data) {
        // Backfill learnworlds_user_id if missing
        if (lw_user_id && !data.learnworlds_user_id) {
          await supabase
            .from('users')
            .update({ learnworlds_user_id: lw_user_id })
            .eq('id', data.id);
        }
        user = data;
      }
    }

    // 3. Create new user if not found
    if (!user) {
      const email = lw_email
        ? lw_email.toLowerCase()
        : `${lw_user_id}@learnworlds.user`;

      const fullName = lw_name || (lw_email ? lw_email.split('@')[0] : 'Fast Track User');

      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email,
          learnworlds_user_id: lw_user_id || null,
          full_name: fullName,
          role: 'participant',
          last_login: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error || !newUser) {
        return sendError(res, 'Failed to create user', undefined, 500);
      }
      user = newUser;
    }

    return sendSuccess(res, { user_id: user.id });
  })
);

// =============================================================================
// POST /api/toolsave/save
// Saves user_responses for a tool. Validates the user exists.
// Replaces direct anon-key upserts from tool-db.js.
// =============================================================================

router.post(
  '/save',
  asyncHandler(async (req: Request, res: Response) => {
    const { user_id, responses } = req.body;

    if (!user_id || !Array.isArray(responses) || responses.length === 0) {
      return sendError(res, 'user_id and responses[] required', undefined, 400);
    }

    // Validate user exists
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (!user) {
      return sendError(res, 'User not found', undefined, 404);
    }

    // Force user_id on every row to prevent spoofing
    const safeRows = responses.map((r: any) => ({
      user_id,
      question_id: r.question_id,
      response_value: r.response_value ?? null,
      response_data: r.response_data ?? null,
    }));

    const { error } = await supabase
      .from('user_responses')
      .upsert(safeRows, { onConflict: 'user_id,question_id' });

    if (error) {
      console.error('[ToolSave] Upsert error:', error);
      return sendError(res, 'Save failed', error.message, 500);
    }

    return sendSuccess(res, { saved: safeRows.length });
  })
);

// =============================================================================
// POST /api/toolsave/complete
// Marks a tool as complete for a user.
// =============================================================================

router.post(
  '/complete',
  asyncHandler(async (req: Request, res: Response) => {
    const { user_id, tool_slug } = req.body;

    if (!user_id || !tool_slug) {
      return sendError(res, 'user_id and tool_slug required', undefined, 400);
    }

    // Validate user exists
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (!user) {
      return sendError(res, 'User not found', undefined, 404);
    }

    const { error } = await supabase
      .from('tool_completions')
      .upsert({ user_id, tool_slug }, { onConflict: 'user_id,tool_slug' });

    if (error) {
      return sendError(res, 'Mark complete failed', undefined, 500);
    }

    return sendSuccess(res, { ok: true });
  })
);

// =============================================================================
// GET /api/toolsave/team-unlock?tool_slug=energy-individual&user_id=<uuid>
// Checks if all org members have submitted the individual phase.
// Used by two-phase tools (team, fit, energy, focus, performance, meeting-rhythm).
// =============================================================================

router.get(
  '/team-unlock',
  asyncHandler(async (req: Request, res: Response) => {
    const toolSlug = req.query.tool_slug as string;
    const userId = req.query.user_id as string;

    if (!toolSlug || !userId) {
      return sendError(res, 'tool_slug and user_id query params required', undefined, 400);
    }

    // 1. Get user's organization_id
    const { data: userData } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', userId)
      .single();

    if (!userData?.organization_id) {
      return sendSuccess(res, { unlocked: false, submitted: 0, total: 0, reason: 'no_org' });
    }

    // 2. Get all org members
    const { data: orgMembers } = await supabase
      .from('users')
      .select('id')
      .eq('organization_id', userData.organization_id);

    if (!orgMembers || orgMembers.length === 0) {
      return sendSuccess(res, { unlocked: false, submitted: 0, total: 0, reason: 'no_members' });
    }

    const memberIds = orgMembers.map((m: any) => m.id);

    // 3. Check submissions — try user_responses first, then tool_completions
    let submittedUserIds = new Set<string>();

    // Check user_responses (most tools use this)
    const { data: responses } = await supabase
      .from('user_responses')
      .select('user_id')
      .in('user_id', memberIds);

    // Filter to those who have responses for this specific tool's questions
    if (responses && responses.length > 0) {
      // Get question IDs for this tool_slug
      let questions = questionsCache.get(toolSlug);
      if (!questions) {
        const { data: qData } = await supabase
          .from('tool_questions')
          .select('id')
          .eq('tool_slug', toolSlug);
        questions = qData || [];
        if (questions.length > 0) questionsCache.set(toolSlug, questions);
      }

      if (questions.length > 0) {
        const questionIds = questions.map((q: any) => q.id);
        const { data: filteredResponses } = await supabase
          .from('user_responses')
          .select('user_id')
          .in('user_id', memberIds)
          .in('question_id', questionIds);

        if (filteredResponses) {
          filteredResponses.forEach((r: any) => submittedUserIds.add(r.user_id));
        }
      }
    }

    // Also check tool_completions (focus tool uses this)
    const { data: completions } = await supabase
      .from('tool_completions')
      .select('user_id')
      .eq('tool_slug', toolSlug)
      .in('user_id', memberIds);

    if (completions) {
      completions.forEach((c: any) => submittedUserIds.add(c.user_id));
    }

    const submitted = submittedUserIds.size;
    const total = orgMembers.length;

    return sendSuccess(res, {
      unlocked: submitted >= total,
      submitted,
      total,
    });
  })
);

// =============================================================================
// GET /api/toolsave/completions?user_id=<uuid>
// Returns all completed tool slugs for a user.
// Used by tool-access-control.js for prerequisite checks.
// =============================================================================

router.get(
  '/completions',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.user_id as string;

    if (!userId) {
      return sendError(res, 'user_id query param required', undefined, 400);
    }

    const { data, error } = await supabase
      .from('tool_completions')
      .select('tool_slug')
      .eq('user_id', userId);

    if (error) {
      console.error('[ToolSave] completions error:', error);
      return sendError(res, 'Failed to load completions', error.message, 500);
    }

    const slugs = (data || []).map((r: any) => r.tool_slug);
    return sendSuccess(res, slugs);
  })
);

export default router;
