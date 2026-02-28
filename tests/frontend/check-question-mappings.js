/**
 * Question Mappings Checker for Fast Track Tool HTML files
 *
 * Extracts TOOL_SLUG and questionMappings keys from each tool,
 * then verifies they match existing tool_questions rows in Supabase.
 * Catches silent save failures where keys don't match DB.
 *
 * The DB snapshot is embedded below (update by running:
 *   node -e "..." to refresh from Supabase)
 *
 * Usage: node tests/frontend/check-question-mappings.js
 * Exit code: 0 = all pass, 1 = errors found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const TOOLS_DIR = join(process.cwd(), 'frontend', 'tools');
const ERRORS = [];
const WARNINGS = [];
const PASSED = [];

// ── DB Snapshot (tool_questions) ──
// Last updated: 2026-02-28
const DB_QUESTIONS = {
  "agile-teams": ["brainstorm_items", "sprint_design", "team_charter", "team_charters"],
  "brand-marketing": ["cult_model", "roadmap"],
  "cash": ["action_plan", "action_sheets", "ler_ratio", "power_of_one", "story_report", "top_priority"],
  "core-activities": ["activity_owners", "brainstorm_activities", "core_activities", "sprint_checklist", "top5_activities", "value_proposition"],
  "customer-service": ["journey_map", "service_standards"],
  "digital-heart": ["blueprint", "implementation_plan"],
  "digitalization": ["baby_ai", "digital_audit"],
  "dream": ["dream_answers", "dream_narrative", "golden_circle", "mood_board", "one_sentence"],
  "employer-branding": ["evp", "recruitment_playbook"],
  "energy": ["energy_audit", "event_gap_response", "habit_commitments", "mental_energy", "team_strategies"],
  "fit": ["abc_matrix", "average_fit", "boss_fit", "job_fit", "team_fit", "values_fit"],
  "fit-abc-analysis": ["a_player_agreements", "classification", "talent_gaps"],
  "focus": ["activities", "additionalFocus", "brainDump", "builders", "delegationPlan", "elimActions", "eveningReflection", "flowRoutine", "flows", "ifThens", "priority1", "priority2", "priority3", "routines"],
  "goals": ["accountability_action", "accountability_score", "alignment_action", "alignment_score", "elephant_breakdowns", "impact_ease_matrix", "top_priorities"],
  "know-thyself": ["activities", "birthday_story", "birthdayStory", "doLess", "doMore", "dream", "feltBest", "giveToWorld", "goal_1", "goal_2", "goal_3", "goals", "hardships", "inspired", "likeAboutSelf", "paidFor", "startTo", "strengths", "value_1", "value_2", "value_3", "value_4", "value_5", "values", "whatGoodAt", "whatLove"],
  "market-size": ["driving_forces", "tam"],
  "meeting-rhythm": ["rhythm_dates"],
  "org-redesign": ["machine_blueprint", "right_seats", "strategy_shadow"],
  "performance": ["consequences_table", "execution_dashboard", "five_why"],
  "pricing": ["anchor_price", "pricing_tiers"],
  "processes-decisions": ["activities", "capabilities", "decision_rights", "kpi_scoreboard", "top3_per_activity"],
  "product-development": ["feature_list", "portfolio"],
  "program-overview": ["final_canvas", "key_metrics", "twelve_month_plan"],
  "route-to-market": ["channels", "rtm_roadmap"],
  "segmentation-target-market": ["brainstorm_data", "primary_target", "segment_quantification", "segment_ranking", "segments_list", "target_setting"],
  "target-segment-deep-dive": ["interview_summary", "needs_gains", "pains_matrix", "persona"],
  "team": ["accountability_tracker", "conflict_norms", "conflict_resolution_strategies", "dysfunction_scorecard", "trust_action_plan"],
  "value-proposition": ["anti_promise", "differentiators", "pain_mapping", "vp_statement"],
  "value-proposition-testing": ["comparison_results", "customer_feedback", "final_vp", "next_steps", "reality_log"],
  "values": ["cool_not_cool", "core_values_list", "recruitment_questions", "red_lines", "rollout_plan"],
  "woop": ["commitment_level", "elephant_first_slice", "elephant_goal", "elephant_slice_0", "elephant_slice_1", "elephant_slice_2", "first_action", "obstacle_internal", "outcome", "plan_if_then", "premortem_cause_0", "premortem_cause_1", "premortem_cause_2", "premortem_prevention", "premortem_scenario", "wish"],
};

function findHtmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findHtmlFiles(full));
    } else if (entry.endsWith('.html') && !entry.includes('BLUEPRINT')) {
      files.push(full);
    }
  }
  return files;
}

function extractBabelContent(html) {
  const regex = /<script\s+type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    blocks.push(match[1]);
  }
  return blocks.join('\n');
}

function checkFile(filePath) {
  const rel = relative(process.cwd(), filePath);
  let html;
  try {
    html = readFileSync(filePath, 'utf-8');
  } catch (e) {
    ERRORS.push({ file: rel, issues: [`Cannot read: ${e.message}`] });
    return;
  }

  const code = extractBabelContent(html);
  if (!code) return;

  const issues = [];
  const warns = [];

  // 1. Extract TOOL_SLUG
  const slugMatch = code.match(/TOOL_SLUG\s*:\s*['"]([^'"]+)['"]/);
  if (!slugMatch) {
    warns.push('Could not extract TOOL_SLUG — skipping question mapping check');
    if (warns.length > 0) WARNINGS.push({ file: rel, warns });
    PASSED.push(rel);
    return;
  }
  const toolSlug = slugMatch[1];

  // 2. Extract questionMappings keys
  //    Pattern: questionMappings = { key1: ..., key2: ... }
  //    or questionMappings: { key1: ..., key2: ... }
  const mappingKeys = new Set();

  // Match the questionMappings object — find opening { after questionMappings
  const mappingRegex = /questionMappings\s*[=:]\s*\{/g;
  let mappingMatch;
  while ((mappingMatch = mappingRegex.exec(code)) !== null) {
    const startIdx = mappingMatch.index + mappingMatch[0].length;
    // Extract only TOP-LEVEL keys using brace depth tracking
    let depth = 0; // we're already inside the outer {
    let i = startIdx;
    let tokenStart = -1;
    let inString = false;
    let stringChar = '';

    while (i < code.length) {
      const ch = code[i];

      // Track string literals to avoid counting braces inside strings
      if (!inString && (ch === '"' || ch === "'" || ch === '`')) {
        inString = true;
        stringChar = ch;
        i++;
        continue;
      }
      if (inString) {
        if (ch === stringChar && code[i - 1] !== '\\') inString = false;
        i++;
        continue;
      }

      if (ch === '{') { depth++; i++; continue; }
      if (ch === '}') {
        if (depth === 0) break; // end of questionMappings object
        depth--;
        i++;
        continue;
      }

      // Only extract keys at depth 0 (top level of questionMappings)
      if (depth === 0 && ch === ':' && tokenStart === -1) {
        // Look backwards for the key name
        let j = i - 1;
        while (j >= startIdx && /\s/.test(code[j])) j--;
        // Remove quotes if present
        let keyEnd = j + 1;
        if (code[j] === '"' || code[j] === "'") { j--; keyEnd = j + 1; }
        let keyStart = j;
        while (keyStart > startIdx && /[a-zA-Z0-9_]/.test(code[keyStart - 1])) keyStart--;
        if (code[keyStart - 1] === '"' || code[keyStart - 1] === "'") { /* skip */ }

        const key = code.substring(keyStart, keyEnd).trim().replace(/['"]/g, '');
        if (key && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
          // Skip non-mapping keys (callbacks etc.)
          if (!['onReviewStart', 'onRevise', 'onSubmitAnyway', 'onError', 'onSuccess'].includes(key)) {
            mappingKeys.add(key);
          }
        }
      }

      i++;
    }
  }

  if (mappingKeys.size === 0) {
    warns.push(`No questionMappings found for tool_slug="${toolSlug}"`);
    if (warns.length > 0) WARNINGS.push({ file: rel, warns });
    PASSED.push(rel);
    return;
  }

  // 3. Check against DB
  const dbKeys = DB_QUESTIONS[toolSlug];
  if (!dbKeys) {
    issues.push(`tool_slug="${toolSlug}" has NO rows in tool_questions table. Keys used: [${[...mappingKeys].join(', ')}]`);
  } else {
    const dbSet = new Set(dbKeys);
    for (const key of mappingKeys) {
      if (!dbSet.has(key)) {
        issues.push(`Key "${key}" in questionMappings but NOT in tool_questions for "${toolSlug}"`);
      }
    }
  }

  if (issues.length > 0) {
    ERRORS.push({ file: rel, issues });
  } else {
    PASSED.push(rel);
  }
  if (warns.length > 0) {
    WARNINGS.push({ file: rel, warns });
  }
}

// ── Run ──
console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║   QUESTION MAPPINGS CHECK — Fast Track        ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const files = findHtmlFiles(TOOLS_DIR);
console.log(`Scanning ${files.length} tool files...\n`);

for (const file of files) {
  checkFile(file);
}

if (WARNINGS.length > 0) {
  console.log(`⚠️  ${WARNINGS.length} file(s) with warnings:\n`);
  for (const w of WARNINGS) {
    console.log(`  ${w.file}`);
    for (const warn of w.warns) console.log(`    ⚠ ${warn}`);
  }
  console.log('');
}

if (ERRORS.length === 0) {
  console.log(`✅ ALL ${PASSED.length} files passed question mappings check\n`);
  process.exit(0);
} else {
  console.log(`❌ ${ERRORS.length} file(s) with mapping issues:\n`);
  for (const err of ERRORS) {
    console.log(`  ${err.file}`);
    for (const issue of err.issues) {
      console.log(`    ✗ ${issue}`);
    }
  }
  console.log(`\n  ${PASSED.length} passed, ${ERRORS.length} failed\n`);
  process.exit(1);
}
