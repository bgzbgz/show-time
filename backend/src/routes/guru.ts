import { Router, type Request, type Response } from 'express';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = Router();

// =============================================================================
// POST /api/guru/validate-code - Validate guru access code
// =============================================================================

router.post(
  '/validate-code',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
      return sendError(res, 'Code is required', undefined, 400);
    }

    const { data, error } = await supabase
      .from('guru_access_codes')
      .select(`
        *,
        organizations (name, slug)
      `)
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return sendError(res, 'Invalid code', undefined, 401);
    }

    return sendSuccess(res, {
      valid: true,
      organization: (data.organizations as any).name,
      organization_slug: (data.organizations as any).slug,
      tool_slug: data.tool_slug,
      guru_name: data.guru_name,
    });
  })
);

// =============================================================================
// GET /api/guru/dashboard/:code - Get dashboard data
// =============================================================================

router.get(
  '/dashboard/:code',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;

    // Validate code and get org info
    const { data: codeData, error: codeError } = await supabase
      .from('guru_access_codes')
      .select(`
        *,
        organizations (*)
      `)
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (codeError || !codeData) {
      return sendError(res, 'Invalid code', undefined, 401);
    }

    const orgId = codeData.organization_id;
    const toolSlug = codeData.tool_slug;

    // Get all team members for this organization
    const { data: members, error: membersError } = await supabase
      .from('users')
      .select('id, full_name, email, created_at')
      .eq('organization_id', orgId);

    if (membersError || !members) {
      return sendError(res, 'Failed to fetch members', undefined, 500);
    }

    const memberIds = members.map((m) => m.id);

    // Get completions from tool_completions (individual tool completion)
    const { data: completions } = await supabase
      .from('tool_completions')
      .select('user_id, completed_at')
      .eq('tool_slug', toolSlug)
      .in('user_id', memberIds);

    // Build set of completed user IDs
    const completedMap = new Map(
      (completions || []).map((c) => [c.user_id, c.completed_at])
    );

    // Combine member data with completion status
    const membersWithStatus = members.map((member) => {
      const completedAt = completedMap.get(member.id);
      return {
        ...member,
        status: completedAt ? 'completed' : 'not_started',
        submitted_at: completedAt || null,
      };
    });

    // Get guru guide for this tool
    const { data: guruGuide } = await supabase
      .from('guru_guides')
      .select('*')
      .eq('tool_slug', toolSlug)
      .single();

    // Get meeting notes
    const { data: meetingNotes } = await supabase
      .from('guru_meeting_notes')
      .select('*')
      .eq('organization_id', orgId)
      .eq('tool_slug', toolSlug)
      .single();

    // Calculate statistics
    const completed = membersWithStatus.filter((m) => m.status === 'completed').length;
    const notStarted = membersWithStatus.filter((m) => m.status === 'not_started').length;

    const org = codeData.organizations as any;

    return sendSuccess(res, {
      organization: {
        id: orgId,
        name: org.name,
        slug: org.slug,
      },
      tool: {
        slug: toolSlug,
      },
      guru: {
        name: codeData.guru_name,
        email: codeData.guru_email,
      },
      team_progress: {
        total: members.length,
        completed,
        in_progress: 0,
        not_started: notStarted,
      },
      members: membersWithStatus,
      guru_guide: guruGuide || null,
      meeting_notes: meetingNotes || null,
    });
  })
);

// =============================================================================
// GET /api/guru/submission/:code/:userId - Get full submission for one member
// =============================================================================

router.get(
  '/submission/:code/:userId',
  asyncHandler(async (req: Request, res: Response) => {
    const { code, userId } = req.params;

    // Validate code
    const { data: codeData, error: codeError } = await supabase
      .from('guru_access_codes')
      .select('tool_slug, organization_id')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (codeError || !codeData) {
      return sendError(res, 'Invalid code', undefined, 401);
    }

    // Verify user belongs to org
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('full_name, organization_id')
      .eq('id', userId)
      .single();

    if (userError || !user || user.organization_id !== codeData.organization_id) {
      return sendError(res, 'Access denied', undefined, 403);
    }

    // Get all question IDs for this tool
    const { data: questions, error: qError } = await supabase
      .from('tool_questions')
      .select('id, question_key, question_text, section_name, step_number, display_order')
      .eq('tool_slug', codeData.tool_slug)
      .order('step_number')
      .order('display_order');

    if (qError || !questions) {
      return sendError(res, 'Failed to fetch questions', undefined, 500);
    }

    const questionIds = questions.map((q) => q.id);

    // Get user's responses
    const { data: responses } = await supabase
      .from('user_responses')
      .select('question_id, response_value, response_data, updated_at')
      .eq('user_id', userId)
      .in('question_id', questionIds);

    // Build response map: question_id → response
    const responseMap = new Map(
      (responses || []).map((r) => [r.question_id, r])
    );

    // Build submission array with question text + answer
    const submission = questions.map((q) => {
      const resp = responseMap.get(q.id);
      return {
        question_key: q.question_key,
        question_text: q.question_text,
        section_name: q.section_name,
        step_number: q.step_number,
        answer: resp ? (resp.response_data ?? resp.response_value) : null,
        answered: !!resp,
      };
    });

    // Check if completed
    const { data: completion } = await supabase
      .from('tool_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('tool_slug', codeData.tool_slug)
      .single();

    return sendSuccess(res, {
      user_name: user.full_name,
      tool_slug: codeData.tool_slug,
      completed_at: completion?.completed_at || null,
      submission,
    });
  })
);

// =============================================================================
// POST /api/guru/meeting-notes/:code - Save meeting notes
// =============================================================================

router.post(
  '/meeting-notes/:code',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    const { notes_content, action_items, meeting_date } = req.body;

    // Validate code
    const { data: codeData, error: codeError } = await supabase
      .from('guru_access_codes')
      .select('id, tool_slug, organization_id')
      .eq('code', code.toUpperCase())
      .single();

    if (codeError || !codeData) {
      return sendError(res, 'Invalid code', undefined, 401);
    }

    // Upsert meeting notes — onConflict uses organization_id + tool_slug
    const { data, error } = await supabase
      .from('guru_meeting_notes')
      .upsert({
        organization_id: codeData.organization_id,
        tool_slug: codeData.tool_slug,
        guru_code_id: codeData.id,
        notes_content,
        action_items,
        meeting_date,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'organization_id,tool_slug'
      })
      .select()
      .single();

    if (error) {
      return sendError(res, 'Failed to save notes', undefined, 500);
    }

    return sendSuccess(res, {
      success: true,
      data,
    });
  })
);

export default router;
