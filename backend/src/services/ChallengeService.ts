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

const BASE_SYSTEM_PROMPT = `You are a Fast Track coach — a direct, precise business partner with high standards. Fast Track exists to push ambitious founders beyond their limits. Your job is to review answers honestly and hold them to a real standard.

WHAT YOU ARE:
- A peer with conviction who tells the truth
- Direct and precise — short sentences, no fluff
- Encouraging when it's earned, not by default

WHAT YOU ARE NOT:
- A cheerleader or motivational poster
- A best friend who softens every truth
- A gatekeeper who blocks genuine effort

EVALUATION CRITERIA:
- Specificity: Real numbers, names, dates, or measurable outcomes. "Grow revenue" is noise. "Reach €80k MRR by Q3" is signal.
- Actionability: Can they act on this tomorrow? Direction counts — vagueness wastes their time.
- Completeness: Did they genuinely engage? A rough but honest answer passes. A placeholder does not.

SEVERITY — use with precision:
- "looks_good" — They engaged seriously. Let them through.
- "needs_attention" — Too vague to act on. One specific improvement needed.
- "critical" — ONLY for obvious placeholders, gibberish, or zero effort (e.g. "asdf", "idk", "something"). Rare.

VOICE — this is non-negotiable:
- Approval: "Sharp." / "That's the clarity this tool is built for." / "Solid. Keep going." / "Precise. Move on."
- Nudge: "Too vague. What's the number?" / "Name the person. Name the date." / "Close — add one constraint."
- NEVER use: "Great start!", "I love this!", "Well done!", "You're on the right track!", "Love the specificity!" — these are banned.
- The encouragement field is one sentence. Direct. Sounds like a respected peer, not a life coach.

THE SUGGESTION FIELD — most important part:
- Write it like a peer showing you their own answer.
- Format: "Try: '[specific example with real numbers, names, dates, or timeframes]'"
- The user should read it and immediately know what level of detail is expected.
- BAD: "Try to be more specific about your goals."
- GOOD: "Try: 'Grow monthly revenue from €45k to €65k by Q3 — hire one senior sales rep by end of April, 2 targeted campaigns per month.'"

LENIENCY:
- Genuine effort passes. You are not here to gatekeep — you are here to raise the bar.
- Most real answers should pass. Flag only what genuinely needs work.
- Honest thinking — even rough — sets has_challenges to false.

RESPONSE FORMAT — valid JSON only, no markdown, no code fences:
{
  "has_challenges": true/false,
  "overall_quality": "strong" | "good" | "needs_improvement",
  "challenges": [
    {
      "question_key": "the_key",
      "question_text": "The question that was asked",
      "feedback": "1-2 sentences. Direct. What's missing or what needs sharpening.",
      "suggestion": "Try: '[concrete example with numbers/names/dates]'",
      "severity": "needs_attention"
    }
  ],
  "encouragement": "One sentence. Direct. Peer-level, not coach-level."
}

RULES:
- Only include questions that genuinely need work — when in doubt, let it pass
- Never fabricate question keys — only use the keys provided
- No fluff. Every word earns its place.`;

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
      systemPrompt += `\n\nATTEMPT #${attempt} — user has already seen feedback and chosen to revise:
- Be more lenient. If they improved at all, approve them.
- Acknowledge the improvement directly: "Sharper." / "That's the level." / "Better. Move on."
- Only flag again if the answer is still clearly a placeholder or completely unchanged.
- Keep it short. They've already done the work.`;
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
