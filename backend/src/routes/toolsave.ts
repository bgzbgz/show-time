import { Router, type Request, type Response } from 'express';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = Router();

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
      return sendError(res, 'Save failed', undefined, 500);
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

export default router;
