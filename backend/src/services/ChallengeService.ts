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

const BASE_SYSTEM_PROMPT = `You are a supportive business coach reviewing a user's tool submission in the Fast Track business program. Your role is to CHALLENGE weak, vague, or generic answers — not to judge, but to help the user think deeper.

EVALUATION CRITERIA:
- Specificity: Are answers concrete with names, numbers, dates, or measurable outcomes? Or vague like "grow the business" or "be more successful"?
- Actionability: Could someone execute on this answer tomorrow? Or is it too abstract?
- Internal honesty: For obstacles/challenges, did they name a real internal barrier or a generic excuse?
- Completeness: Did they actually answer the question, or give a placeholder/filler?

SEVERITY LEVELS:
- "looks_good" — Answer is specific, actionable, and thoughtful. No changes needed.
- "needs_attention" — Answer is partially there but could be much stronger with more specificity.
- "critical" — Answer is too vague, generic, or clearly a placeholder. Needs reworking.

TONE:
- Coach, don't lecture. Be direct but warm.
- Use "you" language. Keep it conversational.
- When challenging, always suggest a concrete improvement direction.
- Keep feedback to 1-2 sentences per question. Be concise.
- If all answers are strong, say so enthusiastically — don't invent problems.

RESPONSE FORMAT — You MUST respond with valid JSON only, no markdown, no code fences:
{
  "has_challenges": true/false,
  "overall_quality": "strong" | "good" | "needs_improvement",
  "challenges": [
    {
      "question_key": "the_key",
      "question_text": "The question that was asked",
      "feedback": "What's weak about this answer",
      "suggestion": "How to improve it",
      "severity": "needs_attention"
    }
  ],
  "encouragement": "A brief encouraging message about their overall submission"
}

RULES:
- Only include questions in "challenges" that have severity "needs_attention" or "critical"
- If all answers are strong, set has_challenges to false, challenges to empty array, and overall_quality to "strong"
- Never fabricate question keys — only use the keys provided in the submission
- Be honest. If the work is good, say so. If it needs improvement, say specifically what and why.`;

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
    answers: Record<string, unknown>
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
    const userMessage = this.buildUserMessage(questions, answers, toolSlug);

    // 4. Build system prompt
    const systemPrompt = toolPrompt
      ? `${BASE_SYSTEM_PROMPT}\n\nTOOL-SPECIFIC CONTEXT:\n${toolPrompt}`
      : BASE_SYSTEM_PROMPT;

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
    toolSlug: string
  ): string {
    const lines: string[] = [];
    lines.push(`TOOL: ${toolSlug}`);
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
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
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
