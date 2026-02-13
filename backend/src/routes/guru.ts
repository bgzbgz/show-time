import { Router, type Request, type Response } from 'express';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = Router();

// =============================================================================
// Helper Functions
// =============================================================================

function getSprintName(sprintId: number): string {
  const names: Record<number, string> = {
    0: 'WOOP',
    1: 'Know Thyself',
    2: 'Dream',
    3: 'Values',
    4: 'Team',
  };
  return names[sprintId] || `Sprint ${sprintId}`;
}

// =============================================================================
// POST /api/guru/validate-code - Validate guru access code
// =============================================================================

router.post(
  '/validate-code',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
      return sendError(res, 'Code is required', 400);
    }

    // Query guru_access_codes with organization join
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
      return sendError(res, 'Invalid code', 401);
    }

    return sendSuccess(res, {
      valid: true,
      organization: (data.organizations as any).name,
      organization_slug: (data.organizations as any).slug,
      sprint_id: data.sprint_id,
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
      return sendError(res, 'Invalid code', 401);
    }

    const orgId = codeData.organization_id;
    const sprintId = codeData.sprint_id;

    // Get all team members for this organization
    const { data: members, error: membersError } = await supabase
      .from('users')
      .select('id, full_name, email, created_at')
      .eq('organization_id', orgId);

    if (membersError || !members) {
      return sendError(res, 'Failed to fetch members', 500);
    }

    const memberIds = members.map((m) => m.id);

    // Get progress records for this sprint
    const { data: progress } = await supabase
      .from('user_progress')
      .select('user_id, status, completed_at')
      .eq('sprint_id', sprintId)
      .in('user_id', memberIds);

    // Get tool submissions for this sprint
    const { data: submissions } = await supabase
      .from('tool_submissions')
      .select('user_id, submitted_at')
      .eq('sprint_id', sprintId)
      .in('user_id', memberIds);

    // Combine data
    const membersWithStatus = members.map((member) => {
      const prog = progress?.find((p) => p.user_id === member.id);
      const sub = submissions?.find((s) => s.user_id === member.id);
      return {
        ...member,
        status: prog?.status || 'not_started',
        submitted_at: sub?.submitted_at || null,
      };
    });

    // Get guru guide
    const { data: guruGuide } = await supabase
      .from('guru_guides')
      .select('*')
      .eq('sprint_id', sprintId)
      .single();

    // Get meeting notes
    const { data: meetingNotes } = await supabase
      .from('guru_meeting_notes')
      .select('*')
      .eq('organization_id', orgId)
      .eq('sprint_id', sprintId)
      .single();

    // Calculate statistics
    const completed = membersWithStatus.filter((m) => m.status === 'completed').length;
    const inProgress = membersWithStatus.filter((m) => m.status === 'in_progress').length;
    const notStarted = membersWithStatus.filter((m) => m.status === 'not_started').length;

    const org = codeData.organizations as any;

    return sendSuccess(res, {
      organization: {
        id: orgId,
        name: org.name,
        slug: org.slug,
      },
      sprint: {
        id: sprintId,
        name: getSprintName(sprintId),
      },
      guru: {
        name: codeData.guru_name,
        email: codeData.guru_email,
      },
      team_progress: {
        total: members.length,
        completed,
        in_progress: inProgress,
        not_started: notStarted,
      },
      members: membersWithStatus,
      guru_guide: guruGuide || null,
      meeting_notes: meetingNotes || null,
    });
  })
);

// =============================================================================
// GET /api/guru/submission/:code/:userId - Get submission data
// =============================================================================

router.get(
  '/submission/:code/:userId',
  asyncHandler(async (req: Request, res: Response) => {
    const { code, userId } = req.params;

    // Validate code
    const { data: codeData, error: codeError } = await supabase
      .from('guru_access_codes')
      .select('sprint_id, organization_id')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (codeError || !codeData) {
      return sendError(res, 'Invalid code', 401);
    }

    // Verify user belongs to org
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('full_name, organization_id')
      .eq('id', userId)
      .single();

    if (userError || !user || user.organization_id !== codeData.organization_id) {
      return sendError(res, 'Access denied', 403);
    }

    // Get submission
    const { data: submission } = await supabase
      .from('tool_submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('sprint_id', codeData.sprint_id)
      .single();

    return sendSuccess(res, {
      user_name: user.full_name,
      submission: submission || null,
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
      .select('id, sprint_id, organization_id')
      .eq('code', code.toUpperCase())
      .single();

    if (codeError || !codeData) {
      return sendError(res, 'Invalid code', 401);
    }

    // Upsert meeting notes
    const { data, error } = await supabase
      .from('guru_meeting_notes')
      .upsert({
        organization_id: codeData.organization_id,
        sprint_id: codeData.sprint_id,
        guru_code_id: codeData.id,
        notes_content,
        action_items,
        meeting_date,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'organization_id,sprint_id'
      })
      .select()
      .single();

    if (error) {
      return sendError(res, 'Failed to save notes', 500);
    }

    return sendSuccess(res, {
      success: true,
      data,
    });
  })
);

export default router;
