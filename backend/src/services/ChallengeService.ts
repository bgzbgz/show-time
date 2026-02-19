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

RESPONSE FORMAT — You MUST respond with valid JSON only, no markdown, no code fences:
{
  "has_challenges": true/false,
  "overall_quality": "strong" | "good" | "needs_improvement",
  "challenges": [
    {
      "question_key": "the_key",
      "question_text": "The question that was asked",
      "feedback": "Encouraging note on what could be stronger",
      "suggestion": "A friendly nudge toward more specificity",
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
