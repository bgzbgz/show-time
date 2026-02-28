import { Router, type Request, type Response } from 'express';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = Router();

// Tool slugs — mirrors TOOLS array in dashboard.html
const ALL_SLUGS = [
  'woop','know-thyself','dream','values','team','fit','cash','energy','goals','focus',
  'performance','meeting-rhythm','market-size','segmentation-target-market',
  'target-segment-deep-dive','value-proposition','value-proposition-testing',
  'product-development','pricing','brand-marketing','customer-service','route-to-market',
  'core-activities','processes-decisions','fit-abc-analysis','org-redesign',
  'employer-branding','agile-teams','digitalization','digital-heart',
];

// =============================================================================
// GET /api/dashboard/progress
// Returns tool progress for the authenticated user.
// Replaces 3 direct Supabase queries from dashboard.html.
// =============================================================================

router.get(
  '/progress',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // 1. Completions
    const { data: completions } = await supabase
      .from('tool_completions')
      .select('tool_slug, completed_at')
      .eq('user_id', userId);

    const completionMap: Record<string, string> = {};
    (completions || []).forEach((c: any) => { completionMap[c.tool_slug] = c.completed_at; });

    // 2. Questions grouped by tool_slug
    const { data: questions } = await supabase
      .from('tool_questions')
      .select('id, tool_slug')
      .in('tool_slug', ALL_SLUGS);

    const questionsByTool: Record<string, string[]> = {};
    (questions || []).forEach((q: any) => {
      if (!questionsByTool[q.tool_slug]) questionsByTool[q.tool_slug] = [];
      questionsByTool[q.tool_slug].push(q.id);
    });

    // 3. User responses
    const allQuestionIds = (questions || []).map((q: any) => q.id);
    let answeredIds = new Set<string>();

    if (allQuestionIds.length > 0) {
      const { data: responses } = await supabase
        .from('user_responses')
        .select('question_id')
        .eq('user_id', userId)
        .in('question_id', allQuestionIds);

      (responses || []).forEach((r: any) => answeredIds.add(r.question_id));
    }

    // 4. Build per-tool progress
    const toolProgress = ALL_SLUGS.map(slug => {
      const totalQ = (questionsByTool[slug] || []).length;
      const answeredQ = (questionsByTool[slug] || []).filter(qid => answeredIds.has(qid)).length;

      let status: string;
      let progress = 0;

      if (completionMap[slug]) {
        status = 'completed';
        progress = 100;
      } else if (answeredQ > 0) {
        status = 'in_progress';
        progress = totalQ > 0 ? Math.round((answeredQ / totalQ) * 100) : 0;
      } else {
        status = 'unlocked';
      }

      return { slug, status, progress, completedAt: completionMap[slug] || null };
    });

    return sendSuccess(res, toolProgress);
  })
);

// =============================================================================
// GET /api/dashboard/submission?tool_slug=woop
// Returns formatted answers for the summary modal.
// =============================================================================

router.get(
  '/submission',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const toolSlug = req.query.tool_slug as string;

    if (!toolSlug) {
      return sendError(res, 'tool_slug query param required', undefined, 400);
    }

    // Get questions for this tool
    const { data: questions } = await supabase
      .from('tool_questions')
      .select('id, question_key, question_text, question_type')
      .eq('tool_slug', toolSlug);

    if (!questions || questions.length === 0) {
      return sendSuccess(res, []);
    }

    const questionIds = questions.map((q: any) => q.id);
    const questionMap: Record<string, any> = {};
    questions.forEach((q: any) => { questionMap[q.id] = q; });

    // Get responses
    const { data: responses } = await supabase
      .from('user_responses')
      .select('question_id, response_value, response_data')
      .eq('user_id', userId)
      .in('question_id', questionIds);

    // Build formatted array
    const result = (responses || []).map((r: any) => {
      const q = questionMap[r.question_id];
      return {
        question: q?.question_text || q?.question_key || 'Unknown',
        section: q?.question_type || 'Responses',
        answer: r.response_value,
        data: r.response_data,
      };
    });

    return sendSuccess(res, result);
  })
);

export default router;
