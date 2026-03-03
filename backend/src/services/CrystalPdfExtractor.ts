import Anthropic from '@anthropic-ai/sdk';
import { createRequire } from 'module';
import { config } from '../config/env.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// =============================================================================
// Types
// =============================================================================

export interface ExtractedCrystalProfile {
  disc_type: string;
  personality_overview: string;
  strengths: string[];
  communication_dos: string[];
  communication_donts: string[];
}

// =============================================================================
// CrystalProfileExtractor
// Supports markdown (free, no API) and PDF (text extract + Claude Haiku)
// =============================================================================

class CrystalProfileExtractor {
  private client: Anthropic | null;

  constructor() {
    if (config.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
    } else {
      this.client = null;
      console.warn('[CrystalProfileExtractor] No ANTHROPIC_API_KEY — Claude fallback disabled');
    }
  }

  /**
   * Extract from a file buffer. Detects format by mime type.
   */
  async extract(buffer: Buffer, mimeType: string): Promise<ExtractedCrystalProfile> {
    if (mimeType === 'text/markdown' || mimeType === 'text/plain') {
      return this.extractFromMarkdown(buffer.toString('utf-8'));
    }
    if (mimeType === 'application/pdf') {
      return this.extractFromPdf(buffer);
    }
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  /**
   * Parse Crystal Knows markdown directly — no API call needed.
   */
  extractFromMarkdown(text: string): ExtractedCrystalProfile {
    const discMatch = text.match(/##\s*DISC\s*Type:\s*(\S+)/i);
    if (!discMatch) throw new Error('Could not find DISC Type in markdown');

    return {
      disc_type: discMatch[1],
      personality_overview: this.extractSection(text, 'Personality'),
      strengths: this.extractBullets(text, 'Energizers'),
      communication_dos: this.extractBullets(text, 'Make a Great First Impression'),
      communication_donts: this.extractBullets(text, 'Blind Spots'),
    };
  }

  /**
   * Extract text from PDF, then try markdown parsing. Falls back to Claude.
   */
  async extractFromPdf(buffer: Buffer): Promise<ExtractedCrystalProfile> {
    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text?.trim();

    if (!pdfText || pdfText.length < 50) {
      throw new Error('Could not extract text from PDF — the file may be image-only or empty');
    }

    console.log(`[CrystalProfileExtractor] Extracted ${pdfText.length} chars from PDF (${pdfData.numpages} pages)`);

    // Try direct parsing first (if the text has markdown-like structure)
    if (pdfText.includes('DISC Type') || pdfText.match(/DISC\s*Type/i)) {
      try {
        return this.extractFromMarkdown(pdfText);
      } catch {
        console.log('[CrystalProfileExtractor] Direct parse failed, falling back to Claude');
      }
    }

    // Fall back to Claude for unstructured text
    return this.extractWithClaude(pdfText);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private extractSection(text: string, heading: string): string {
    const regex = new RegExp(`##\\s*${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n+([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = text.match(regex);
    if (!match) return '';
    // Take the first paragraph (non-bullet, non-empty lines)
    const lines = match[1].split('\n').filter(l => l.trim() && !l.trim().startsWith('-') && !l.trim().startsWith('*'));
    return lines.join(' ').trim();
  }

  private extractBullets(text: string, heading: string): string[] {
    const regex = new RegExp(`##\\s*${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n+([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = text.match(regex);
    if (!match) return [];
    return match[1]
      .split('\n')
      .filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'))
      .map(l => l.replace(/^[\s\-*]+/, '').trim())
      .filter(Boolean);
  }

  private async extractWithClaude(text: string): Promise<ExtractedCrystalProfile> {
    if (!this.client) {
      throw new Error('Cannot parse unstructured PDF — ANTHROPIC_API_KEY not configured');
    }

    const response = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Below is text extracted from a Crystal Knows personality profile. Parse it and return ONLY valid JSON:

{
  "disc_type": "Di" or "S" or "Cd" etc,
  "personality_overview": "2-3 sentence summary",
  "strengths": ["strength 1", ...] (3-6 items),
  "communication_dos": ["do 1", ...] (3-6 items),
  "communication_donts": ["don't 1", ...] (3-6 items)
}

Return ONLY JSON, no markdown fences.

--- TEXT START ---
${text.slice(0, 8000)}
--- TEXT END ---`,
        },
      ],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const cleaned = responseText.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(`Failed to parse Claude response as JSON: ${responseText.slice(0, 200)}`);
    }

    if (!parsed.disc_type || typeof parsed.disc_type !== 'string') {
      throw new Error('Extraction missing disc_type');
    }

    return {
      disc_type: parsed.disc_type,
      personality_overview: parsed.personality_overview || '',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      communication_dos: Array.isArray(parsed.communication_dos) ? parsed.communication_dos : [],
      communication_donts: Array.isArray(parsed.communication_donts) ? parsed.communication_donts : [],
    };
  }
}

export const crystalPdfExtractor = new CrystalProfileExtractor();
