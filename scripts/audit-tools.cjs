#!/usr/bin/env node
/**
 * Fast Track Tool Auditor
 * Run: node scripts/audit-tools.js
 *
 * Checks each tool HTML file for:
 *  1. Transition screen  — has TRANSITION_CONTENT with brutalTruth + peerProof
 *  2. Cover image        — URL (https://) not a local file path
 *  3. AI challenge       — AIChallenge.reviewStep or submitWithChallenge wired
 *  4. DB key coverage    — question keys used match what's in tool_questions table
 *  5. Resize handle      — no unguarded textarea resize:vertical
 *  6. Tool slug          — TOOL_SLUG constant matches expected slug
 */

const fs   = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '..', 'frontend', 'tools');

// ── DB question keys (pulled from Supabase 2026-02-25) ─────────────────────
const DB_KEYS = {
  'woop':                      ['commitment_level','elephant_first_slice','elephant_goal','elephant_slice_0','elephant_slice_1','elephant_slice_2','first_action','obstacle_external','obstacle_internal','outcome','plan_if_then','premortem_cause_0','premortem_cause_1','premortem_cause_2','premortem_prevention','premortem_scenario','reflection','wish'],
  'know-thyself':              ['activities','birthdayStory','doLess','doMore','dream','feltBest','giveToWorld','goal_1','goal_2','goal_3','hardships','inspired','likeAboutSelf','paidFor','startTo','strengths','value_1','value_2','value_3','value_4','value_5','whatGoodAt','whatLove'],
  'dream':                     ['dream_narrative','dream_visualization','killer_conclusion','one_sentence'],
  'values':                    ['cool_not_cool','core_values_list','recruitment_questions','red_lines','rollout_plan'],
  'team':                      ['accountability_tracker','conflict_norms','conflict_resolution_strategies','dysfunction_scorecard','trust_action_plan'],
  'fit':                       ['abc_matrix','average_fit','boss_fit','job_fit','team_fit','values_fit'],
  'cash':                      ['action_plan','action_sheets','ler_ratio','power_of_one','story_report','top_priority'],
  'energy':                    ['energy_audit','event_gap_response','habit_commitments','mental_energy','team_strategies'],
  'goals':                     ['accountability_action','accountability_score','alignment_action','alignment_score','elephant_breakdowns','impact_ease_matrix','top_priorities'],
  'focus':                     ['activities','additionalFocus','brainDump','builders','delegationPlan','elimActions','eveningReflection','flowRoutine','flows','ifThens','priority1','priority2','priority3','routines'],
  'performance':               ['consequences_table','execution_dashboard','five_why'],
  'meeting-rhythm':            ['rhythm_dates'],
  'market-size':               ['driving_forces','tam'],
  'segmentation-target-market':['primary_target','segments_list'],
  'target-segment-deep-dive':  ['interview_summary','needs_gains','pains_matrix','persona'],
  'value-proposition':         ['anti_promise','differentiators','pain_mapping','vp_statement'],
  'value-proposition-testing': ['comparison_results','customer_feedback','final_vp','next_steps','reality_log'],
  'product-development':       ['feature_list','portfolio'],
  'pricing':                   ['anchor_price','pricing_tiers'],
  'brand-marketing':           ['cult_model','roadmap'],
  'customer-service':          ['journey_map','service_standards'],
  'route-to-market':           ['channels','rtm_roadmap'],
  'core-activities':           ['activity_owners','top5_activities'],
  'processes-decisions':       ['capabilities','decision_rights','kpi_scoreboard','top3_per_activity'],
  'fit-abc-analysis':          ['a_player_agreements','classification','talent_gaps'],
  'org-redesign':              ['machine_blueprint','right_seats','strategy_shadow'],
  'employer-branding':         ['evp','recruitment_playbook'],
  'agile-teams':               ['sprint_design','team_charter'],
  'digitalization':            ['baby_ai','digital_audit'],
  'digital-heart':             ['blueprint','implementation_plan'],
};

// ── Tool file list ──────────────────────────────────────────────────────────
const TOOLS = [
  { file: 'module-0-intro-sprint/00-woop.html',                    slug: 'woop' },
  { file: 'module-1-identity/01-know-thyself.html',                slug: 'know-thyself' },
  { file: 'module-1-identity/02-dream.html',                       slug: 'dream' },
  { file: 'module-1-identity/03-values.html',                      slug: 'values' },
  { file: 'module-1-identity/04-team.html',                        slug: 'team' },
  { file: 'module-1-identity/05-fit.html',                         slug: 'fit' },
  { file: 'module-2-performance/06-cash.html',                     slug: 'cash' },
  { file: 'module-2-performance/07-energy.html',                   slug: 'energy' },
  { file: 'module-2-performance/08-goals.html',                    slug: 'goals' },
  { file: 'module-2-performance/09-focus.html',                    slug: 'focus' },
  { file: 'module-2-performance/10-performance.html',              slug: 'performance' },
  { file: 'module-2-performance/11-meeting-rhythm.html',           slug: 'meeting-rhythm' },
  { file: 'module-3-market/12-market-size.html',                   slug: 'market-size' },
  { file: 'module-3-market/13-segmentation-target-market.html',    slug: 'segmentation-target-market' },
  { file: 'module-4-strategy-development/14-target-segment-deep-dive.html', slug: 'target-segment-deep-dive' },
  { file: 'module-4-strategy-development/15-value-proposition.html',         slug: 'value-proposition' },
  { file: 'module-4-strategy-development/16-value-proposition-testing.html', slug: 'value-proposition-testing' },
  { file: 'module-5-strategy-execution/17-product-development.html',         slug: 'product-development' },
  { file: 'module-5-strategy-execution/18-pricing.html',                     slug: 'pricing' },
  { file: 'module-5-strategy-execution/19-brand-marketing.html',             slug: 'brand-marketing' },
  { file: 'module-5-strategy-execution/20-customer-service.html',            slug: 'customer-service' },
  { file: 'module-5-strategy-execution/21-route-to-market.html',             slug: 'route-to-market' },
  { file: 'module-6-org-structure/22-core-activities.html',                  slug: 'core-activities' },
  { file: 'module-6-org-structure/23-processes-decisions.html',              slug: 'processes-decisions' },
  { file: 'module-6-org-structure/24-fit-abc-analysis.html',                 slug: 'fit-abc-analysis' },
  { file: 'module-6-org-structure/25-org-redesign.html',                     slug: 'org-redesign' },
  { file: 'module-7-people-leadership/26-employer-branding.html',            slug: 'employer-branding' },
  { file: 'module-7-people-leadership/27-agile-teams.html',                  slug: 'agile-teams' },
  { file: 'module-8-tech-ai/28-digitalization.html',                         slug: 'digitalization' },
  { file: 'module-8-tech-ai/29-digital-heart.html',                          slug: 'digital-heart' },
];

// ── Checks ──────────────────────────────────────────────────────────────────

function checkTransitions(c) {
  const hasContent   = c.includes('TRANSITION_CONTENT');
  const hasBruth     = c.includes('brutalTruth');
  const hasPeerProof = c.includes('peerProof');
  if (hasContent && hasBruth && hasPeerProof) return { icon: '✅', note: '' };
  if (hasContent && !hasBruth)               return { icon: '⚠️', note: 'TRANSITION_CONTENT but no brutalTruth' };
  if (!hasContent)                           return { icon: '❌', note: 'missing TRANSITION_CONTENT entirely' };
  return { icon: '⚠️', note: 'partial' };
}

function checkCoverImage(c) {
  // Look for common cover image assignment patterns
  const patterns = [
    /coverImage\s*[:=]\s*['"]([^'"]+)['"]/gi,
    /COVER\s*[:=]\s*['"]([^'"]+)['"]/gi,
    /background.*url\(['"]([^'"]+)['"]\)/gi,
    /src\s*=\s*['"]([^'"]+\.(jpg|jpeg|png|webp))['"]/gi,
  ];
  const allImages = [];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(c)) !== null) allImages.push(m[1]);
  }
  if (allImages.length === 0) return { icon: '–', note: 'no cover detected' };
  const local = allImages.filter(img => !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/api/'));
  if (local.length > 0) return { icon: '❌', note: `local path: ${local[0]}` };
  return { icon: '✅', note: '' };
}

function checkAI(c) {
  const hasReview = c.includes('AIChallenge.reviewStep');
  const hasSubmit = c.includes('submitWithChallenge');
  if (hasReview || hasSubmit) return { icon: '✅', note: '' };
  // Some tools (e.g. 02-dream, 03-values) may be simpler and not have AI
  return { icon: '⚠️', note: 'no AI challenge call found' };
}

function checkDbKeys(c, slug) {
  const expected = DB_KEYS[slug];
  if (!expected || expected.length === 0) return { icon: '–', note: 'no DB keys defined' };

  // Match quoted strings OR unquoted JS object keys (e.g.  five_why: )
  const missing = expected.filter(key => {
    const quotedSingle = `'${key}'`;
    const quotedDouble = `"${key}"`;
    const unquoted     = new RegExp(`\\b${key}\\s*:`);      // unquoted object key
    const templateStr  = new RegExp(`\`[^]*?${key}[^]*?\``); // template literal (rare)
    return !c.includes(quotedSingle) && !c.includes(quotedDouble) && !unquoted.test(c) && !templateStr.test(c);
  });
  const coverage = Math.round(((expected.length - missing.length) / expected.length) * 100);

  if (missing.length === 0)  return { icon: '✅', note: `all ${expected.length} keys` };
  if (missing.length <= 2)   return { icon: '⚠️', note: `missing: ${missing.join(', ')}` };
  if (coverage >= 50)        return { icon: '⚠️', note: `${coverage}% — missing: ${missing.slice(0,3).join(', ')}${missing.length > 3 ? '…' : ''}` };
  return                            { icon: '❌', note: `${coverage}% — missing: ${missing.slice(0,4).join(', ')}${missing.length > 4 ? '…' : ''}` };
}

function checkResize(c) {
  // Flag if any unguarded "resize: vertical" exists (Tailwind override not neutralised)
  const hasVertical = /resize\s*:\s*vertical(?!\s*;?\s*\/\*.*important)/.test(c);
  const hasNoneImportant = /resize\s*:\s*none\s*!important/.test(c);
  const hasNone = /resize\s*:\s*none/.test(c);
  if (hasVertical) return { icon: '❌', note: 'resize:vertical found — handle visible' };
  if (hasNoneImportant) return { icon: '✅', note: '!important' };
  if (hasNone) return { icon: '⚠️', note: 'resize:none but no !important (Tailwind may override)' };
  return { icon: '–', note: 'no resize rule' };
}

function checkSlug(c, expectedSlug) {
  const m = c.match(/TOOL_SLUG\s*:\s*['"]([^'"]+)['"]/);
  if (!m) return { icon: '⚠️', note: 'TOOL_SLUG not found' };
  if (m[1] === expectedSlug) return { icon: '✅', note: '' };
  return { icon: '❌', note: `found '${m[1]}', expected '${expectedSlug}'` };
}

// ── Run ─────────────────────────────────────────────────────────────────────

const PAD = {
  tool:        28,
  transitions: 14,
  cover:       8,
  ai:          10,
  dbkeys:      13,
  resize:      10,
  slug:        10,
};

function pad(str, len) {
  return String(str).padEnd(len);
}

const DIVIDER = '─'.repeat(110);

console.log('\n' + DIVIDER);
console.log(
  pad('TOOL', PAD.tool) +
  pad('TRANSITIONS', PAD.transitions) +
  pad('COVER', PAD.cover) +
  pad('AI CHLNG', PAD.ai) +
  pad('DB KEYS', PAD.dbkeys) +
  pad('RESIZE', PAD.resize) +
  pad('SLUG', PAD.slug) +
  'NOTES'
);
console.log(DIVIDER);

const issues = [];

for (const { file, slug } of TOOLS) {
  const filePath = path.join(TOOLS_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`${pad(slug, PAD.tool)} FILE NOT FOUND: ${file}`);
    continue;
  }

  const c = fs.readFileSync(filePath, 'utf8');

  const transitions = checkTransitions(c);
  const cover       = checkCoverImage(c);
  const ai          = checkAI(c);
  const dbkeys      = checkDbKeys(c, slug);
  const resize      = checkResize(c);
  const slugCheck   = checkSlug(c, slug);

  // Collect actionable notes
  const notes = [transitions, cover, ai, dbkeys, resize, slugCheck]
    .filter(r => r.note)
    .map(r => r.note)
    .join(' | ');

  const hasIssue = [transitions, cover, ai, dbkeys, resize, slugCheck]
    .some(r => r.icon === '❌' || r.icon === '⚠️');

  if (hasIssue) issues.push({ slug, notes });

  const shortSlug = slug.length > PAD.tool - 1 ? slug.slice(0, PAD.tool - 2) + '…' : slug;

  console.log(
    pad(shortSlug, PAD.tool) +
    pad(transitions.icon, PAD.transitions) +
    pad(cover.icon, PAD.cover) +
    pad(ai.icon, PAD.ai) +
    pad(dbkeys.icon, PAD.dbkeys) +
    pad(resize.icon, PAD.resize) +
    pad(slugCheck.icon, PAD.slug) +
    (notes.length > 80 ? notes.slice(0, 77) + '…' : notes)
  );
}

console.log(DIVIDER);
console.log(`\n✅ Clean  ⚠️  Warning  ❌ Broken  – N/A\n`);

if (issues.length === 0) {
  console.log('🎉 All tools passed!\n');
} else {
  console.log(`Found issues in ${issues.length} tool(s):\n`);
  for (const { slug, notes } of issues) {
    console.log(`  • ${slug}: ${notes}`);
  }
  console.log('');
}
