import { Router, type Request, type Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env.js';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { crystalKnowsService } from '../services/CrystalKnowsService.js';

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

// =============================================================================
// POST /api/guru/team-analysis - Generate AI team coaching report
// =============================================================================

router.post(
  '/team-analysis',
  asyncHandler(async (req: Request, res: Response) => {
    const { code, orgId, toolSlug, regenerate } = req.body;

    let resolvedOrgId: string;
    let resolvedToolSlug: string;
    let guruName = 'Guru';

    // Auth: code-based OR orgId+toolSlug (auto-login sessions)
    if (code) {
      const { data: codeData, error: codeError } = await supabase
        .from('guru_access_codes')
        .select('organization_id, tool_slug, guru_name')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (codeError || !codeData) {
        return sendError(res, 'Invalid code', undefined, 401);
      }
      resolvedOrgId = codeData.organization_id;
      resolvedToolSlug = codeData.tool_slug;
      guruName = codeData.guru_name || 'Guru';
    } else if (orgId && toolSlug) {
      // Validate via guru_assignments
      const { data: assignment, error: aErr } = await supabase
        .from('guru_assignments')
        .select('id, user_id')
        .eq('organization_id', orgId)
        .eq('tool_slug', toolSlug)
        .limit(1)
        .single();

      if (aErr || !assignment) {
        return sendError(res, 'No guru assignment found for this org/tool', undefined, 401);
      }

      resolvedOrgId = orgId;
      resolvedToolSlug = toolSlug;

      // Get guru name
      const { data: guruUser } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', assignment.user_id)
        .single();
      if (guruUser) guruName = guruUser.full_name || 'Guru';
    } else {
      return sendError(res, 'Either code or orgId+toolSlug required', undefined, 400);
    }

    // Check cache (unless regenerate)
    if (!regenerate) {
      const { data: cached } = await supabase
        .from('guru_analysis_reports')
        .select('*')
        .eq('organization_id', resolvedOrgId)
        .eq('tool_slug', resolvedToolSlug)
        .single();

      if (cached) {
        return sendSuccess(res, { report: cached.report_content, fromCache: true, createdAt: cached.created_at });
      }
    }

    // Fetch members + completion statuses (same pattern as dashboard)
    const { data: members } = await supabase
      .from('users')
      .select('id, full_name, email, created_at')
      .eq('organization_id', resolvedOrgId);

    if (!members || members.length === 0) {
      return sendError(res, 'No team members found', undefined, 404);
    }

    const memberIds = members.map(m => m.id);

    const { data: completions } = await supabase
      .from('tool_completions')
      .select('user_id, completed_at')
      .eq('tool_slug', resolvedToolSlug)
      .in('user_id', memberIds);

    const completionMap = new Map((completions || []).map(c => [c.user_id, c.completed_at]));

    // Get response counts for in-progress detection
    const { data: questions } = await supabase
      .from('tool_questions')
      .select('id')
      .eq('tool_slug', resolvedToolSlug);

    const questionIds = (questions || []).map(q => q.id);
    let responseCounts: Record<string, number> = {};
    if (questionIds.length > 0) {
      const { data: responses } = await supabase
        .from('user_responses')
        .select('user_id, question_id')
        .in('user_id', memberIds)
        .in('question_id', questionIds);

      (responses || []).forEach(r => {
        responseCounts[r.user_id] = (responseCounts[r.user_id] || 0) + 1;
      });
    }

    const membersWithStatus = members.map(m => {
      const completedAt = completionMap.get(m.id);
      let status = 'not_started';
      if (completedAt) status = 'completed';
      else if (responseCounts[m.id] > 0) status = 'in_progress';
      return { ...m, status, completed_at: completedAt || null };
    });

    // Fetch Crystal Knows profiles
    const profiles = await crystalKnowsService.getProfilesForMembers(
      members.map(m => ({ email: m.email, full_name: m.full_name }))
    );

    // Build AI prompt
    const memberLines = membersWithStatus.map(m => {
      const profile = profiles.get(m.email.toLowerCase());
      let line = `- **${m.full_name || m.email}** (${m.email}) — STATUS: ${m.status.toUpperCase()}`;
      if (m.completed_at) line += ` (completed ${m.completed_at})`;
      if (profile) {
        line += `\n  DISC Type: ${profile.disc_type || 'Unknown'}`;
        if (profile.personality_overview) line += `\n  Personality: ${profile.personality_overview}`;
        if (profile.strengths?.length) line += `\n  Strengths: ${profile.strengths.join(', ')}`;
        if (profile.communication_dos?.length) line += `\n  Communication DOs: ${profile.communication_dos.join('; ')}`;
        if (profile.communication_donts?.length) line += `\n  Communication DON'Ts: ${profile.communication_donts.join('; ')}`;
      } else {
        line += '\n  (No personality profile available)';
      }
      return line;
    }).join('\n\n');

    const completed = membersWithStatus.filter(m => m.status === 'completed').length;
    const inProgress = membersWithStatus.filter(m => m.status === 'in_progress').length;
    const notStarted = membersWithStatus.filter(m => m.status === 'not_started').length;

    const systemPrompt = `You are a team coaching advisor for the Fast Track business accelerator program. You help gurus (facilitators) understand their team's progress and provide personalized coaching advice based on DISC personality profiles.

Write a structured team analysis report in markdown. Be direct, specific, and actionable. Use the personality data to tailor coaching advice — if no profile is available for a member, give generic status-based advice.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## Team Overview
[2-3 sentences on overall completion progress and team readiness]

## Individual Coaching Notes
### [Name] — [STATUS]
**Personality**: [DISC type] — [one-liner summary]
**Coaching approach**: [2-3 actionable sentences based on their personality + status]
- **What works**: [specific approach for this personality type]
- **What to avoid**: [what NOT to do with this personality type]
- **Suggested action**: [one concrete step the guru should take]

[Repeat for each member]

## Team Dynamics
[2-3 sentences about team composition — complementary strengths, potential friction points between different DISC types, and how to leverage diversity in the upcoming meeting]

RULES:
- Be direct and practical — no motivational fluff
- If a member has completed, acknowledge it briefly and focus coaching on the meeting
- If a member hasn't started, the coaching should focus on getting them engaged
- For members without DISC profiles, focus advice on their completion status
- Keep each individual section to 4-6 lines max`;

    const userMessage = `TOOL: ${resolvedToolSlug}
TEAM SIZE: ${members.length} (${completed} completed, ${inProgress} in progress, ${notStarted} not started)
GURU: ${guruName}

TEAM MEMBERS:
${memberLines}`;

    // Call Claude
    let reportContent: string;
    try {
      if (!config.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not configured');
      }

      const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const textBlock = response.content.find(b => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') throw new Error('No text response from AI');
      reportContent = textBlock.text;
    } catch (err: any) {
      console.error('[team-analysis] AI call failed:', err.message);
      // Fallback: generate a basic status report
      reportContent = `## Team Overview\nTeam has ${completed}/${members.length} members completed for ${resolvedToolSlug}.\n\n## Individual Status\n${membersWithStatus.map(m => `- **${m.full_name || m.email}**: ${m.status.replace('_', ' ')}`).join('\n')}\n\n*AI analysis unavailable — showing basic status report.*`;
    }

    // Build snapshots for caching
    const memberSnapshot = membersWithStatus.map(m => ({
      id: m.id, name: m.full_name, email: m.email, status: m.status,
    }));
    const profilesUsed = Array.from(profiles.entries())
      .filter(([, p]) => p !== null)
      .map(([email, p]) => ({ email, disc_type: p!.disc_type }));

    // Upsert report
    await supabase
      .from('guru_analysis_reports')
      .upsert({
        organization_id: resolvedOrgId,
        tool_slug: resolvedToolSlug,
        report_content: reportContent,
        member_snapshot: memberSnapshot,
        profiles_used: profilesUsed,
        created_at: new Date().toISOString(),
      }, { onConflict: 'organization_id,tool_slug' });

    return sendSuccess(res, { report: reportContent, fromCache: false, createdAt: new Date().toISOString() });
  })
);

export default router;
