import { Router, type Request, type Response } from 'express';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, generateAccessToken } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';
import type { Role } from '../types/index.js';

const router = Router();

// Admin role check middleware — runs after authenticate
function requireAdmin(req: Request, res: Response, next: Function): void {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'guru')) {
    res.status(403).json({ success: false, error: 'Admin access required' });
    return;
  }
  next();
}

// =============================================================================
// POST /api/admin/auth
// Receives a Supabase auth user ID, verifies against admin_users table,
// issues a backend JWT.
// =============================================================================
router.post(
  '/auth',
  asyncHandler(async (req: Request, res: Response) => {
    const { supabase_user_id, email } = req.body;

    if (!supabase_user_id) {
      return sendError(res, 'supabase_user_id required', undefined, 400);
    }

    // Verify this user is in admin_users table
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, name')
      .eq('id', supabase_user_id)
      .single();

    if (!adminUser) {
      return sendError(res, 'Not an admin user', undefined, 403);
    }

    // Issue backend JWT with admin role
    const access_token = generateAccessToken({
      id: supabase_user_id,
      email: email || '',
      role: 'admin' as Role,
      organization_id: null,
    });

    return sendSuccess(res, {
      access_token,
      token_type: 'Bearer',
      expires_in: 86400,
      admin_name: adminUser.name,
    });
  })
);

// All subsequent routes require authentication + admin role
// =============================================================================
// GET /api/admin/stats
// =============================================================================
router.get(
  '/stats',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const since24h = new Date(Date.now() - 86400000).toISOString();

    const [users, activeUsers, completions, orgs, aiLogs, webhookErrors] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('user_responses').select('user_id').gt('updated_at', since24h),
      supabase.from('tool_completions').select('*', { count: 'exact', head: true }),
      supabase.from('organizations').select('*', { count: 'exact', head: true }),
      supabase.from('ai_challenge_log').select('id', { count: 'exact' }).gt('created_at', since24h),
      supabase.from('webhook_events').select('id', { count: 'exact' }).not('error_message', 'is', null),
    ]);

    // Active unique users in last 24h
    const uniqueActive = new Set((activeUsers.data || []).map((r: any) => r.user_id)).size;

    // Recent activity feed
    const { data: recentActivity } = await supabase
      .from('user_responses')
      .select('updated_at, user_id, users(full_name, organization_name), tool_questions(tool_slug)')
      .order('updated_at', { ascending: false })
      .limit(20);

    return sendSuccess(res, {
      totalUsers: users.count || 0,
      activeUsers24h: uniqueActive,
      totalCompletions: completions.count || 0,
      totalOrgs: orgs.count || 0,
      aiLogs24h: aiLogs.count || 0,
      webhookErrors: webhookErrors.count || 0,
      recentActivity: recentActivity || [],
    });
  })
);

// =============================================================================
// GET /api/admin/organizations
// =============================================================================
router.get(
  '/organizations',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { data: orgs } = await supabase
      .from('organizations')
      .select('*')
      .order('name');

    const { data: users } = await supabase
      .from('users')
      .select('id, full_name, email, organization_id, last_login, created_at, role')
      .order('full_name');

    const { data: completions } = await supabase
      .from('tool_completions')
      .select('user_id, tool_slug, completed_at');

    const { data: responses } = await supabase
      .from('user_responses')
      .select('user_id, updated_at')
      .order('updated_at', { ascending: false });

    const { data: guruAssignments } = await supabase
      .from('guru_assignments')
      .select('id, user_id, organization_id, tool_slug');

    return sendSuccess(res, {
      organizations: orgs || [],
      users: users || [],
      completions: completions || [],
      responses: responses || [],
      guruAssignments: guruAssignments || [],
    });
  })
);

// =============================================================================
// POST /api/admin/organizations
// =============================================================================
router.post(
  '/organizations',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { name, learnworlds_tag } = req.body;
    if (!name) return sendError(res, 'name required', undefined, 400);

    const { data, error } = await supabase
      .from('organizations')
      .insert({ name, learnworlds_tag: learnworlds_tag || null })
      .select()
      .single();

    if (error) return sendError(res, 'Failed to create organization', error.message, 500);
    return sendSuccess(res, data);
  })
);

// =============================================================================
// PUT /api/admin/organizations/:id
// =============================================================================
router.put(
  '/organizations/:id',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { name, learnworlds_tag } = req.body;

    const { data, error } = await supabase
      .from('organizations')
      .update({ name, learnworlds_tag })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return sendError(res, 'Failed to update organization', error.message, 500);
    return sendSuccess(res, data);
  })
);

// =============================================================================
// DELETE /api/admin/organizations/:id
// =============================================================================
router.delete(
  '/organizations/:id',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', req.params.id);

    if (error) return sendError(res, 'Failed to delete organization', error.message, 500);
    return sendSuccess(res, { deleted: true });
  })
);

// =============================================================================
// GET /api/admin/users
// =============================================================================
router.get(
  '/users',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .order('full_name');

    const { data: completions } = await supabase
      .from('tool_completions')
      .select('user_id, tool_slug, completed_at');

    const { data: responses } = await supabase
      .from('user_responses')
      .select('user_id, updated_at, tool_questions(tool_slug)')
      .order('updated_at', { ascending: false });

    return sendSuccess(res, {
      users: users || [],
      completions: completions || [],
      responses: responses || [],
    });
  })
);

// =============================================================================
// PUT /api/admin/users/:id
// =============================================================================
router.put(
  '/users/:id',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { full_name, email, organization_id } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({ full_name, email, organization_id })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return sendError(res, 'Failed to update user', error.message, 500);
    return sendSuccess(res, data);
  })
);

// =============================================================================
// PUT /api/admin/users/:id/role
// =============================================================================
router.put(
  '/users/:id/role',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { role } = req.body;
    if (!role) return sendError(res, 'role required', undefined, 400);

    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return sendError(res, 'Failed to update role', error.message, 500);
    return sendSuccess(res, data);
  })
);

// =============================================================================
// GET /api/admin/users/:id/detail
// =============================================================================
router.get(
  '/users/:id/detail',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id;

    const [responses, aiLogs, orgs, notes, adminUnlocks] = await Promise.all([
      supabase
        .from('user_responses')
        .select('id, response_value, response_data, created_at, updated_at, tool_questions(tool_slug, question_text, question_key)')
        .eq('user_id', userId),
      supabase
        .from('ai_challenge_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('organizations')
        .select('id, name'),
      supabase
        .from('admin_notes')
        .select('note')
        .eq('target_type', 'user')
        .eq('target_id', userId)
        .maybeSingle(),
      supabase
        .from('tool_completions')
        .select('tool_slug')
        .eq('user_id', userId)
        .eq('source', 'admin_unlock'),
    ]);

    return sendSuccess(res, {
      responses: responses.data || [],
      aiLogs: aiLogs.data || [],
      organizations: orgs.data || [],
      notes: notes.data?.note || '',
      adminUnlocks: (adminUnlocks.data || []).map((r: any) => r.tool_slug),
    });
  })
);

// =============================================================================
// POST /api/admin/users/:id/unlock-tool
// =============================================================================
router.post(
  '/users/:id/unlock-tool',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { tool_slug } = req.body;
    if (!tool_slug) return sendError(res, 'tool_slug required', undefined, 400);

    const { error } = await supabase
      .from('tool_completions')
      .insert({
        user_id: req.params.id,
        tool_slug,
        completed_at: new Date().toISOString(),
        source: 'admin_unlock',
      });

    if (error) return sendError(res, 'Failed to unlock tool', error.message, 500);
    return sendSuccess(res, { unlocked: true });
  })
);

// =============================================================================
// GET /api/admin/notes/:type/:id
// =============================================================================
router.get(
  '/notes/:type/:id',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { data } = await supabase
      .from('admin_notes')
      .select('note')
      .eq('target_type', req.params.type)
      .eq('target_id', req.params.id)
      .maybeSingle();

    return sendSuccess(res, { note: data?.note || '' });
  })
);

// =============================================================================
// PUT /api/admin/notes/:type/:id
// =============================================================================
router.put(
  '/notes/:type/:id',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { note } = req.body;
    const targetType = req.params.type;
    const targetId = req.params.id;

    // Try update first, then insert
    const { data: existing } = await supabase
      .from('admin_notes')
      .select('id')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('admin_notes')
        .update({ note, updated_at: new Date().toISOString() })
        .eq('target_type', targetType)
        .eq('target_id', targetId);
    } else {
      await supabase
        .from('admin_notes')
        .insert({ target_type: targetType, target_id: targetId, note });
    }

    return sendSuccess(res, { saved: true });
  })
);

// =============================================================================
// PUT /api/admin/guru-assignments
// =============================================================================
router.put(
  '/guru-assignments',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { organization_id, tool_slug, user_id } = req.body;

    const { data, error } = await supabase
      .from('guru_assignments')
      .upsert(
        { organization_id, tool_slug, user_id },
        { onConflict: 'organization_id,tool_slug' }
      )
      .select()
      .single();

    // Also sync user role to guru
    if (user_id) {
      await supabase.from('users').update({ role: 'guru' }).eq('id', user_id);
    }

    if (error) return sendError(res, 'Failed to assign guru', error.message, 500);
    return sendSuccess(res, data);
  })
);

// =============================================================================
// DELETE /api/admin/guru-assignments/:id
// =============================================================================
router.delete(
  '/guru-assignments/:id',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { error } = await supabase
      .from('guru_assignments')
      .delete()
      .eq('id', req.params.id);

    if (error) return sendError(res, 'Failed to remove assignment', error.message, 500);
    return sendSuccess(res, { deleted: true });
  })
);

// =============================================================================
// GET /api/admin/webhook-events
// =============================================================================
router.get(
  '/webhook-events',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { data } = await supabase
      .from('webhook_events')
      .select('id, source, event_type, error_message, payload, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    return sendSuccess(res, data || []);
  })
);

// =============================================================================
// GET /api/admin/ai-logs
// =============================================================================
router.get(
  '/ai-logs',
  authenticate,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { data } = await supabase
      .from('ai_challenge_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    return sendSuccess(res, data || []);
  })
);

export default router;
