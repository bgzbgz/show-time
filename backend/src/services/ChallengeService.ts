import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env.js';
import { supabase } from '../config/supabase.js';

// =============================================================================
// Types
// =============================================================================

interface QuestionDef {
  question_key: string;
  question_text: string;
  question_type: string;
  section_name: string | null;
}

interface ChallengeFeedback {
  question_key: string;
  question_text: string;
  feedback: string;
  suggestion: string;
  severity: 'looks_good' | 'needs_attention' | 'critical';
}

interface ChallengeResult {
  has_challenges: boolean;
  overall_quality: 'strong' | 'good' | 'needs_improvement';
  challenges: ChallengeFeedback[];
  encouragement: string;
}

interface ChallengeLogEntry {
  user_id: string;
  tool_slug: string;
  user_answers: Record<string, unknown>;
  ai_feedback: ChallengeResult | null;
  model_used: string;
  tokens_used: number;
  response_time_ms: number;
  user_action: 'revised' | 'submitted_anyway' | 'no_challenges';
}

// =============================================================================
// Base System Prompt
// =============================================================================

const BASE_SYSTEM_PROMPT = `You are a warm, encouraging business coach reviewing a user's answers in the Fast Track business program. Your job is to help them think deeper and be more specific — but always from a place of encouragement and support. You're their cheerleader AND their coach.

EVALUATION CRITERIA (be generous — look for effort, not perfection):
- Specificity: Do they have some concrete details? Names, numbers, dates, or measurable outcomes are great. Vague is only a problem if the answer is clearly a placeholder like "something" or "stuff".
- Actionability: Could they reasonably act on this? It doesn't need to be perfect — just headed in the right direction.
- Completeness: Did they make a genuine attempt? Even a rough answer that shows real thinking is good enough to pass.

SEVERITY LEVELS — use sparingly:
- "looks_good" — They made a real effort. Even if it could be better, let them through with encouragement.
- "needs_attention" — The answer is too vague or generic to be useful, but they're trying. Nudge gently.
- "critical" — ONLY for obvious placeholders, gibberish, or completely empty effort (e.g. "asdf", "something something", "idk"). This should be rare.

IMPORTANT — BE ENCOURAGING, NOT STRICT:
- Your default should be to APPROVE answers. Most genuine attempts should pass.
- Only flag answers that are clearly too vague to be actionable. Don't nitpick good-enough answers.
- Lead with what's working: "Great start!" or "I like where you're going with this."
- When you do challenge, frame it as "this could be even better" not "this isn't good enough."
- Keep feedback to 1-2 sentences. Be concise and warm.
- If all answers show genuine effort, set has_challenges to false and celebrate their work.
- Use encouraging language in the encouragement field: "Well done!", "You're on the right track!", "Love the specificity here!"

THE SUGGESTION FIELD IS CRITICAL — THIS IS WHAT THE USER WILL USE TO IMPROVE:
- The "suggestion" field must contain a CONCRETE EXAMPLE they can almost copy-paste.
- Format: Start with "Try something like: " and then write a specific example answer.
- Include real numbers, timeframes, names, or measurable outcomes in the example.
- The example should be calibrated to their industry/context if you can infer it.
- BAD suggestion: "Try to be more specific about your goals."
- GOOD suggestion: "Try something like: 'Grow monthly revenue from €45k to €65k by end of Q3 by hiring one senior sales rep and running 2 targeted campaigns per month.'"
- The user should be able to read your example and immediately know what level of detail is expected.

RESPONSE FORMAT — You MUST respond with valid JSON only, no markdown, no code fences:
{
  "has_challenges": true/false,
  "overall_quality": "strong" | "good" | "needs_improvement",
  "challenges": [
    {
      "question_key": "the_key",
      "question_text": "The question that was asked",
      "feedback": "1-2 sentences on what's missing or could be sharper",
      "suggestion": "Try something like: '[concrete example with numbers/names/dates that shows exactly what a strong answer looks like]'",
      "severity": "needs_attention"
    }
  ],
  "encouragement": "A warm, encouraging message about their work"
}

RULES:
- Only include questions in "challenges" that truly need work — when in doubt, let it pass
- If answers show genuine effort (even if imperfect), set has_challenges to false and encourage them
- Never fabricate question keys — only use the keys provided
- Be honest but kind. Celebrate effort. Coach toward excellence without demanding it.`;

// =============================================================================
// ChallengeService
// =============================================================================

class ChallengeService {
  private client: Anthropic | null = null;
  private model = 'claude-haiku-4-5-20251001';

  constructor() {
    if (config.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
      console.log('[ChallengeService] Initialized with Anthropic API key');
    } else {
      console.warn('[ChallengeService] No ANTHROPIC_API_KEY — AI challenges disabled');
    }
  }

  isAvailable(): boolean {
    return this.client !== null && config.ENABLE_AI_INTEGRATION;
  }

  /**
   * Review a user's answers for a tool and return feedback.
   */
  async reviewAnswers(
    userId: string,
    toolSlug: string,
    answers: Record<string, unknown>,
    attempt: number = 1
  ): Promise<ChallengeResult> {
    if (!this.client) {
      throw new Error('AI challenge service not configured — missing ANTHROPIC_API_KEY');
    }

    const startTime = Date.now();

    // 1. Fetch question definitions from Supabase
    const questions = await this.getQuestionDefinitions(toolSlug);

    // 2. Fetch tool-specific prompt (if any)
    const toolPrompt = await this.getToolPrompt(toolSlug);

    // 3. Build the user message with context
    const userMessage = this.buildUserMessage(questions, answers, toolSlug, attempt);

    // 4. Build system prompt
    let systemPrompt = toolPrompt
      ? `${BASE_SYSTEM_PROMPT}\n\nTOOL-SPECIFIC CONTEXT:\n${toolPrompt}`
      : BASE_SYSTEM_PROMPT;

    // On re-reviews, add leniency instruction
    if (attempt >= 2) {
      systemPrompt += `\n\nIMPORTANT — THIS IS REVIEW ATTEMPT #${attempt}:
The user has already received your feedback and revised their answers. Be MUCH more lenient now.
- Acknowledge their improvement: "Much better!", "Great improvement!", "Now we're talking!"
- If they made a genuine effort to improve (even partially), APPROVE them and let them move on.
- Only flag again if the answer is still clearly a placeholder or hasn't changed at all.
- Your encouragement should celebrate their revision: "Love how you've sharpened this up!" or "That's exactly the kind of specificity that makes WOOP work."`;
    }

    // 5. Call Claude
    let result: ChallengeResult;
    let tokensUsed = 0;
    let modelUsed = this.model;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);
      modelUsed = response.model || this.model;

      // Parse response
      const textBlock = response.content.find(b => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from AI');
      }

      result = this.parseResponse(textBlock.text);
    } catch (error: any) {
      console.error('[ChallengeService] AI call failed:', error.message);
      // Graceful fallback — let the user through
      result = {
        has_challenges: false,
        overall_quality: 'good',
        challenges: [],
        encouragement: 'Your answers have been recorded. Keep up the great work!',
      };
    }

    const responseTimeMs = Date.now() - startTime;

    // 6. Log to ai_challenge_log
    await this.logChallenge({
      user_id: userId,
      tool_slug: toolSlug,
      user_answers: answers,
      ai_feedback: result,
      model_used: modelUsed,
      tokens_used: tokensUsed,
      response_time_ms: responseTimeMs,
      user_action: result.has_challenges ? 'revised' : 'no_challenges', // Will be updated by frontend
    });

    return result;
  }

  /**
   * Update the user_action on a challenge log entry.
   */
  async updateUserAction(logId: string, action: 'revised' | 'submitted_anyway'): Promise<void> {
    await supabase
      .from('ai_challenge_log')
      .update({ user_action: action })
      .eq('id', logId);
  }

  /**
   * Generate 3 actionable slices for a big goal (Cut the Elephant).
   */
  async suggestSlices(
    elephantGoal: string,
    context?: { wish?: string; outcome?: string; obstacle?: string }
  ): Promise<{ slices: string[]; firstSlice: string }> {
    if (!this.client) {
      throw new Error('AI service not configured');
    }

    const systemPrompt = `You are a productivity coach. The user has a big, overwhelming goal (their "elephant"). Your job is to slice it into 3 small, concrete, time-boxed tasks that can each be done in 15-60 minutes. Also suggest what they should do TODAY as their very first slice.

RULES:
- Each slice must be specific and actionable — start with a verb
- Include a time estimate in parentheses, e.g. "(30 min)"
- Each slice should be completable in one sitting
- Order slices by priority — most impactful first
- The first_slice should be the easiest to start RIGHT NOW to build momentum

Respond with valid JSON only, no markdown:
{"slices":["slice 1 (time)","slice 2 (time)","slice 3 (time)"],"first_slice":"what to do today (time)"}`;

    let userMsg = `THE ELEPHANT (big goal): ${elephantGoal}`;
    if (context?.wish) userMsg += `\nWISH: ${context.wish}`;
    if (context?.outcome) userMsg += `\nDESIRED OUTCOME: ${context.outcome}`;
    if (context?.obstacle) userMsg += `\nMAIN OBSTACLE: ${context.obstacle}`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }],
      });

      const textBlock = response.content.find(b => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') throw new Error('No text response');

      let cleaned = textBlock.text.trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/i, '');
      if (!cleaned.startsWith('{')) {
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) cleaned = match[0];
      }

      const parsed = JSON.parse(cleaned);
      return {
        slices: Array.isArray(parsed.slices) ? parsed.slices.map(String).slice(0, 3) : [],
        firstSlice: String(parsed.first_slice || ''),
      };
    } catch (e: any) {
      console.error('[ChallengeService] Suggest slices failed:', e.message);
      return { slices: [], firstSlice: '' };
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async getQuestionDefinitions(toolSlug: string): Promise<QuestionDef[]> {
    const { data, error } = await supabase
      .from('tool_questions')
      .select('question_key, question_text, question_type, section_name')
      .eq('tool_slug', toolSlug);

    if (error) {
      console.error('[ChallengeService] Failed to fetch questions:', error);
      return [];
    }

    return data || [];
  }

  private async getToolPrompt(toolSlug: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('ai_challenge_prompts')
      .select('system_prompt, enabled')
      .eq('tool_slug', toolSlug)
      .single();

    if (error || !data || !data.enabled) {
      return null;
    }

    return data.system_prompt;
  }

  private buildUserMessage(
    questions: QuestionDef[],
    answers: Record<string, unknown>,
    toolSlug: string,
    attempt: number = 1
  ): string {
    const lines: string[] = [];
    lines.push(`TOOL: ${toolSlug}`);
    if (attempt >= 2) {
      lines.push(`REVIEW ATTEMPT: ${attempt} (user has revised after previous feedback)`);
    }
    lines.push('');
    lines.push('QUESTIONS AND USER ANSWERS:');
    lines.push('');

    // Build a map of question_key → question_text
    const questionMap = new Map(questions.map(q => [q.question_key, q]));

    for (const [key, value] of Object.entries(answers)) {
      const q = questionMap.get(key);
      const questionText = q?.question_text || key;
      const answerText = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);

      lines.push(`--- ${key} ---`);
      lines.push(`Question: ${questionText}`);
      lines.push(`Answer: ${answerText}`);
      lines.push('');
    }

    return lines.join('\n');
  }

  private parseResponse(text: string): ChallengeResult {
    try {
      // Strip markdown code fences if present
      let cleaned = text.trim();
      // Remove opening ```json or ``` and closing ```
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
      // If still not valid JSON, try extracting JSON object
      if (!cleaned.startsWith('{')) {
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) cleaned = match[0];
      }

      const parsed = JSON.parse(cleaned);

      // Validate structure
      return {
        has_challenges: Boolean(parsed.has_challenges),
        overall_quality: ['strong', 'good', 'needs_improvement'].includes(parsed.overall_quality)
          ? parsed.overall_quality
          : 'good',
        challenges: Array.isArray(parsed.challenges)
          ? parsed.challenges.map((c: any) => ({
              question_key: String(c.question_key || ''),
              question_text: String(c.question_text || ''),
              feedback: String(c.feedback || ''),
              suggestion: String(c.suggestion || ''),
              severity: ['looks_good', 'needs_attention', 'critical'].includes(c.severity)
                ? c.severity
                : 'needs_attention',
            }))
          : [],
        encouragement: String(parsed.encouragement || 'Keep going!'),
      };
    } catch (e) {
      console.error('[ChallengeService] Failed to parse AI response:', text);
      return {
        has_challenges: false,
        overall_quality: 'good',
        challenges: [],
        encouragement: 'Your answers have been recorded.',
      };
    }
  }

  private async logChallenge(entry: ChallengeLogEntry): Promise<string | null> {
    const { data, error } = await supabase
      .from('ai_challenge_log')
      .insert(entry)
      .select('id')
      .single();

    if (error) {
      console.error('[ChallengeService] Failed to log challenge:', error);
      return null;
    }

    return data?.id || null;
  }
}

// Singleton
export const challengeService = new ChallengeService();
