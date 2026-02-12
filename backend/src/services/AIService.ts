import { config } from '../config/env.js';
import { toolService } from './ToolService.js';
import { toolOrchestrator } from './ToolOrchestrator.js';
import { prisma } from '../config/database.js';
import { logger } from '../middleware/logger.js';
import type { AIHelpRequest } from '../types/index.js';

// =============================================================================
// AI Service - n8n Integration
// =============================================================================

interface N8NResponse {
  answer: string;
  metadata?: Record<string, unknown>;
}

interface N8NWebhookPayload {
  user_id: string;
  user_email: string;
  tool_slug: string;
  tool_name: string;
  question: string;
  context: {
    submission_data?: Record<string, unknown>;
    dependencies?: Record<string, unknown>;
  };
  timestamp: string;
}

export class AIService {
  private n8nWebhookUrl: string;
  private requestTimeout: number = 30000; // 30 seconds

  constructor() {
    this.n8nWebhookUrl = config.N8N_WEBHOOK_URL || '';
  }

  /**
   * Send help request to n8n AI workflow
   */
  async sendHelpRequest(request: AIHelpRequest): Promise<string> {
    const { userId, toolSlug, question } = request;

    // Check if n8n is configured
    if (!this.n8nWebhookUrl) {
      logger.warn('N8N_WEBHOOK_URL not configured, AI help unavailable');
      return this.getFallbackResponse();
    }

    try {
      // Get user info
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      // Get tool metadata
      const tool = toolService.getTool(toolSlug);

      // Get submission data (optional context)
      let submissionData: Record<string, unknown> | undefined;
      try {
        const submission = await toolService.getSubmission(userId, toolSlug);
        submissionData = submission?.data as Record<string, unknown>;
      } catch {
        // No submission yet - that's okay
      }

      // Get dependencies (optional context)
      let dependencies: Record<string, unknown> | undefined;
      try {
        const deps = await toolOrchestrator.resolveDependencies(toolSlug, userId);
        dependencies = Object.entries(deps).reduce((acc, [fieldId, field]) => {
          acc[fieldId] = field.value;
          return acc;
        }, {} as Record<string, unknown>);
      } catch {
        // No dependencies - that's okay
      }

      // Build webhook payload
      const payload: N8NWebhookPayload = {
        user_id: userId,
        user_email: user?.email || 'unknown',
        tool_slug: toolSlug,
        tool_name: tool.name,
        question,
        context: {
          submission_data: submissionData,
          dependencies,
        },
        timestamp: new Date().toISOString(),
      };

      // Log AI request
      logger.info('Sending AI help request', {
        userId,
        toolSlug,
        questionLength: question.length,
      });

      // Send request to n8n with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

      try {
        const response = await fetch(this.n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`n8n webhook returned ${response.status}: ${response.statusText}`);
        }

        const data = (await response.json()) as N8NResponse;

        // Validate response structure
        if (!data.answer) {
          throw new Error('Invalid n8n response: missing answer field');
        }

        // Sanitize response (prevent XSS)
        const sanitizedAnswer = this.sanitizeMarkdown(data.answer);

        // Log successful AI response
        logger.info('AI help request successful', {
          userId,
          toolSlug,
          answerLength: sanitizedAnswer.length,
        });

        return sanitizedAnswer;
      } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          logger.error('n8n webhook request timeout', { userId, toolSlug });
          throw new Error('AI request timeout - please try again');
        }

        throw error;
      }
    } catch (error: any) {
      logger.error('AI help request failed', {
        userId,
        toolSlug,
        error: error.message,
      });

      // Check if n8n is unavailable
      if (error.message?.includes('fetch failed') || error.message?.includes('ECONNREFUSED')) {
        return this.getFallbackResponse();
      }

      throw error;
    }
  }

  /**
   * Sanitize markdown to prevent XSS
   */
  private sanitizeMarkdown(markdown: string): string {
    // Remove script tags
    let sanitized = markdown.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    return sanitized;
  }

  /**
   * Get fallback response when n8n unavailable
   */
  private getFallbackResponse(): string {
    return `**AI Assistant Temporarily Unavailable**

Our AI assistant is currently unavailable. Please try again in a few moments, or continue working on your submission independently.

If you need immediate assistance, consider:
- Reviewing the tool instructions
- Consulting the Fast Track documentation
- Reaching out to your program facilitator`;
  }

  /**
   * Validate AI request
   */
  validateRequest(request: AIHelpRequest): { valid: boolean; error?: string } {
    if (!request.question || request.question.trim().length === 0) {
      return { valid: false, error: 'Question cannot be empty' };
    }

    if (request.question.length > 2000) {
      return { valid: false, error: 'Question too long (max 2000 characters)' };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const aiService = new AIService();
