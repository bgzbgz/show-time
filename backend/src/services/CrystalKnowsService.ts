import { config } from '../config/env.js';
import { supabase } from '../config/supabase.js';

// =============================================================================
// Types
// =============================================================================

interface CrystalProfile {
  email: string;
  disc_type: string | null;
  personality_overview: string | null;
  strengths: string[];
  communication_dos: string[];
  communication_donts: string[];
}

interface MemberInput {
  email: string;
  full_name?: string;
}

// =============================================================================
// CrystalKnowsService
// =============================================================================

class CrystalKnowsService {
  private apiKey: string | null;
  private baseUrl = 'https://api.crystalknows.com/v1';

  constructor() {
    this.apiKey = config.CRYSTAL_KNOWS_API_KEY || null;
    if (this.apiKey) {
      console.log('[CrystalKnowsService] Initialized with API key');
    } else {
      console.warn('[CrystalKnowsService] No CRYSTAL_KNOWS_API_KEY — profiles disabled');
    }
  }

  isAvailable(): boolean {
    return this.apiKey !== null;
  }

  /**
   * Get Crystal Knows profiles for a list of members.
   * Returns a Map of email → profile (or null if not found).
   */
  async getProfilesForMembers(members: MemberInput[]): Promise<Map<string, CrystalProfile | null>> {
    const result = new Map<string, CrystalProfile | null>();
    if (members.length === 0) return result;

    const emails = members.map(m => m.email.toLowerCase());

    // 1. Check DB cache
    const { data: cached } = await supabase
      .from('crystal_profiles')
      .select('email, disc_type, personality_overview, strengths, communication_dos, communication_donts')
      .in('email', emails);

    const cachedMap = new Map<string, CrystalProfile>();
    (cached || []).forEach(p => {
      cachedMap.set(p.email.toLowerCase(), {
        email: p.email,
        disc_type: p.disc_type,
        personality_overview: p.personality_overview,
        strengths: p.strengths || [],
        communication_dos: p.communication_dos || [],
        communication_donts: p.communication_donts || [],
      });
    });

    // 2. Identify missing
    const missing = members.filter(m => !cachedMap.has(m.email.toLowerCase()));

    // 3. Fetch missing from Crystal API (if key available)
    if (missing.length > 0 && this.apiKey) {
      for (const member of missing) {
        try {
          const profile = await this.fetchFromApi(member);
          if (profile) {
            cachedMap.set(member.email.toLowerCase(), profile);
            // Cache in DB
            await this.upsertProfile(member.email, profile);
          }
          // Rate limit: 200ms between calls
          if (missing.indexOf(member) < missing.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (err: any) {
          console.error(`[CrystalKnowsService] Failed to fetch profile for ${member.email}:`, err.message);
        }
      }
    }

    // 4. Build result map
    for (const email of emails) {
      result.set(email, cachedMap.get(email) || null);
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async fetchFromApi(member: MemberInput): Promise<CrystalProfile | null> {
    if (!this.apiKey) return null;

    const params = new URLSearchParams({ email: member.email });
    if (member.full_name) {
      const parts = member.full_name.trim().split(/\s+/);
      if (parts.length >= 1) params.set('first_name', parts[0]);
      if (parts.length >= 2) params.set('last_name', parts.slice(1).join(' '));
    }

    const response = await fetch(`${this.baseUrl}/profiles?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[CrystalKnowsService] API returned ${response.status} for ${member.email}`);
      return null;
    }

    const data: any = await response.json();
    if (!data || !data.data) return null;

    const p = data.data;
    return {
      email: member.email,
      disc_type: p.disc_type || p.personalities?.disc?.type || null,
      personality_overview: p.overview || p.personalities?.disc?.overview || null,
      strengths: Array.isArray(p.strengths) ? p.strengths : [],
      communication_dos: Array.isArray(p.recommendations?.dos) ? p.recommendations.dos : [],
      communication_donts: Array.isArray(p.recommendations?.donts) ? p.recommendations.donts : [],
    };
  }

  private async upsertProfile(email: string, profile: CrystalProfile): Promise<void> {
    const { error } = await supabase
      .from('crystal_profiles')
      .upsert({
        email: email.toLowerCase(),
        disc_type: profile.disc_type,
        personality_overview: profile.personality_overview,
        strengths: profile.strengths,
        communication_dos: profile.communication_dos,
        communication_donts: profile.communication_donts,
        raw_response: profile,
        fetched_at: new Date().toISOString(),
      }, { onConflict: 'email' });

    if (error) {
      console.error('[CrystalKnowsService] Failed to cache profile:', error);
    }
  }
}

// Singleton
export const crystalKnowsService = new CrystalKnowsService();
