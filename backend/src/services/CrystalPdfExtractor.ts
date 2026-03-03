import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env.js';

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
// CrystalPdfExtractor — uses Claude to extract DISC profile from PDF images
// =============================================================================

class CrystalPdfExtractor {
  private client: Anthropic | null;

  constructor() {
    if (config.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
    } else {
      this.client = null;
      console.warn('[CrystalPdfExtractor] No ANTHROPIC_API_KEY — PDF extraction disabled');
    }
  }

  async extract(pdfBuffer: Buffer): Promise<ExtractedCrystalProfile> {
    if (!this.client) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const base64Pdf = pdfBuffer.toString('base64');

    const response = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64Pdf,
              },
            },
            {
              type: 'text',
              text: `Extract the DISC personality profile from this Crystal Knows PDF. Return ONLY valid JSON with this exact structure:

{
  "disc_type": "Di" or "S" or "Cd" etc — the DISC type abbreviation shown in the profile,
  "personality_overview": "A 2-3 sentence summary of this person's personality and work style",
  "strengths": ["strength 1", "strength 2", ...] — their key strengths (3-6 items),
  "communication_dos": ["do 1", "do 2", ...] — how TO communicate with them (3-6 items),
  "communication_donts": ["don't 1", "don't 2", ...] — what NOT to do when communicating (3-6 items)
}

Extract real data from the PDF. If a section is not present, use an empty array. Return ONLY the JSON object, no markdown fences.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse JSON — strip markdown fences if present
    const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(`Failed to parse Claude response as JSON: ${text.slice(0, 200)}`);
    }

    // Validate required fields
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

export const crystalPdfExtractor = new CrystalPdfExtractor();
