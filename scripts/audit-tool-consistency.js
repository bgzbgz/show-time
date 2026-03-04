#!/usr/bin/env node
/**
 * audit-tool-consistency.js
 * Scans all 31 Fast Track tool HTML files and reports design/structural consistency
 * against the gold standard (22-core-activities.html).
 *
 * Usage: node scripts/audit-tool-consistency.js [--json] [--tool 22-core-activities]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Colour helpers (ANSI) ───────────────────────────────────────────────────
const c = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  cyan:    '\x1b[36m',
  white:   '\x1b[37m',
  bgRed:   '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow:'\x1b[43m',
};
const PASS = `${c.green}[✓]${c.reset}`;
const FAIL = `${c.red}[✗]${c.reset}`;
const WARN = `${c.yellow}[!]${c.reset}`;
const NA   = `${c.dim}n/a${c.reset}`;

// ── Discover tool files ─────────────────────────────────────────────────────
function findToolFiles(baseDir) {
  const toolsDir = path.join(baseDir, 'frontend', 'tools');
  const files = [];
  for (const moduleDir of fs.readdirSync(toolsDir).sort()) {
    const modPath = path.join(toolsDir, moduleDir);
    if (!fs.statSync(modPath).isDirectory()) continue;
    for (const file of fs.readdirSync(modPath).sort()) {
      if (!file.endsWith('.html')) continue;
      if (file === 'TOOL-BLUEPRINT.html') continue;
      files.push({
        name: file.replace('.html', ''),
        path: path.join(modPath, file),
      });
    }
  }
  return files;
}

// ── Check definitions ───────────────────────────────────────────────────────
// Each check: { id, name, category, severity, test(content) => bool|'na' }

const CATEGORIES = {
  WRAP:   { label: 'Structural Wrappers', severity: 'CRITICAL' },
  COVER:  { label: 'Cover & Intro',       severity: 'CRITICAL' },
  WIZARD: { label: 'Wizard Components',   severity: 'CRITICAL' },
  CANVAS: { label: 'Canvas',              severity: 'WARNING'  },
  TRANS:  { label: 'Transitions',          severity: 'WARNING'  },
  CONFIG: { label: 'CONFIG',              severity: 'WARNING'  },
  INTEG:  { label: 'Integration',          severity: 'WARNING'  },
  CSS:    { label: 'CSS/Fonts',            severity: 'INFO'     },
};

const checks = [
  // ── A. Structural Wrappers ──
  {
    id: 'A1', name: 'tool-frame wrapper',
    category: 'WRAP',
    test: (src) => src.includes('tool-frame') && /className=["'][^"']*tool-frame/.test(src),
  },
  {
    id: 'A2', name: 'tool-inner wrapper',
    category: 'WRAP',
    test: (src) => src.includes('tool-inner') && /className=["'][^"']*tool-inner/.test(src),
  },
  {
    id: 'A3', name: 'isWizardStep guard',
    category: 'WRAP',
    test: (src) => /const\s+isWizardStep\s*=\s*.*Number\.isInteger/.test(src),
  },
  {
    id: 'A4', name: 'isTransition guard',
    category: 'WRAP',
    test: (src) => /const\s+isTransition\s*=/.test(src),
  },
  {
    id: 'A5', name: 'Single-return render (no if-return chain)',
    category: 'WRAP',
    test: (src) => {
      // Count occurrences of the anti-pattern: if (step === N) return (
      const matches = src.match(/if\s*\(\s*step\s*===?\s*[\d'"]\S*\s*\)\s*\{?\s*return\s*\(/g);
      // Allow at most 2 (cover + success are okay), flag if 3+
      return !matches || matches.length <= 2;
    },
  },

  // ── B. Cover & Intro ──
  {
    id: 'B1', name: 'Cover screen (step 0 + START)',
    category: 'COVER',
    test: (src) => /step\s*===?\s*0/.test(src) && /START/i.test(src),
  },
  {
    id: 'B2', name: 'Cover yellow label (#FFF469)',
    category: 'COVER',
    test: (src) => /#FFF469/i.test(src) && /SPRINT/i.test(src),
  },
  {
    id: 'B3', name: 'CONFIG.COVER_IMAGE',
    category: 'COVER',
    test: (src) => /COVER_IMAGE\s*:\s*['"]https?:\/\//.test(src),
  },
  {
    id: 'B4', name: 'IntroPage / BEFORE WE START',
    category: 'COVER',
    test: (src) => /function\s+IntroPage/.test(src) || /BEFORE\s+WE\s+START/i.test(src) || /step\s*===?\s*0\.5/.test(src),
  },

  // ── C. Wizard Components ──
  {
    id: 'C1', name: 'WizardSidebar component',
    category: 'WIZARD',
    test: (src) => /function\s+WizardSidebar/.test(src),
  },
  {
    id: 'C2', name: 'Dot sidebar (sidebar-step-dot + active/done colors)',
    category: 'WIZARD',
    test: (src) => /sidebar-step-dot/.test(src) && /#FFF469/.test(src) && /#4ade80/.test(src),
  },
  {
    id: 'C3', name: 'Sidebar renders after wizard-main',
    category: 'WIZARD',
    test: (src) => {
      const mainIdx = src.indexOf('wizard-main');
      const sidebarIdx = src.lastIndexOf('<WizardSidebar');
      if (mainIdx === -1 || sidebarIdx === -1) return false;
      return sidebarIdx > mainIdx;
    },
  },
  {
    id: 'C4', name: 'MobileStepBar component (not inline)',
    category: 'WIZARD',
    test: (src) => /function\s+MobileStepBar/.test(src),
  },
  {
    id: 'C5', name: 'MobileStepBar CSS (hidden by default + @media show)',
    category: 'WIZARD',
    test: (src) => /\.mobile-step-bar\s*\{[^}]*display:\s*none/.test(src) && /@media/.test(src),
  },

  // ── D. Canvas ──
  {
    id: 'D1', name: 'CanvasStep (not CanvasPage)',
    category: 'CANVAS',
    test: (src) => {
      const hasCanvas = /canvas/i.test(src) && (/CanvasStep|CanvasPage|step\s*===?\s*['"]canvas/.test(src));
      if (!hasCanvas) return 'na';
      return /CanvasStep/.test(src) || (/function\s+Canvas/.test(src) && /onSubmit|submitState/.test(src));
    },
  },
  {
    id: 'D2', name: 'Footer hidden on canvas/success',
    category: 'CANVAS',
    test: (src) => {
      const hasCanvas = /step\s*===?\s*['"]canvas/.test(src) || /CanvasStep/.test(src);
      if (!hasCanvas) return 'na';
      // Check that wizard-footer is conditionally rendered
      return /isWizardStep.*wizard-footer|wizard-footer.*isWizardStep|step\s*!==?\s*['"]canvas/.test(src) ||
             /\{.*isWizardStep.*&&.*wizard-footer/.test(src);
    },
  },

  // ── E. Transitions ──
  {
    id: 'E1', name: 'TransitionScreen component',
    category: 'TRANS',
    test: (src) => /function\s+TransitionScreen/.test(src),
  },
  {
    id: 'E2', name: 'TRANSITION_CONTENT (brutalTruth + peerProof)',
    category: 'TRANS',
    test: (src) => /TRANSITION_CONTENT/.test(src) && /brutalTruth/.test(src) && /peerProof/.test(src),
  },

  // ── F. CONFIG ──
  {
    id: 'F1', name: 'TOOL_SLUG in CONFIG',
    category: 'CONFIG',
    test: (src) => /TOOL_SLUG\s*:\s*['"]/.test(src),
  },
  {
    id: 'F2', name: 'TOTAL_STEPS in CONFIG',
    category: 'CONFIG',
    test: (src) => /TOTAL_STEPS\s*:\s*\d/.test(src),
  },

  // ── G. Integration ──
  {
    id: 'G1', name: 'AI Challenge (reviewStep)',
    category: 'INTEG',
    test: (src) => /AIChallenge\.reviewStep/.test(src) || /ai-challenge\.js/.test(src),
  },
  {
    id: 'G2', name: 'ToolDB save + markComplete',
    category: 'INTEG',
    test: (src) => /ToolDB\.save/.test(src) && /ToolDB\.markComplete/.test(src),
  },
  {
    id: 'G3', name: 'Auth state (loading + authenticated)',
    category: 'INTEG',
    test: (src) => /authState/.test(src) && (/loading/.test(src) || /authenticated/.test(src)),
  },

  // ── H. CSS / Fonts ──
  {
    id: 'H1', name: 'Font declarations (Plaak, Riforma, Monument)',
    category: 'CSS',
    test: (src) => /Plaak/.test(src) && /Riforma/.test(src) && /Monument/.test(src),
  },
  {
    id: 'H2', name: 'Standard CSS classes (step-content, step-indicator, opening-box)',
    category: 'CSS',
    test: (src) => /\.step-content/.test(src) && /\.step-indicator/.test(src) && /\.opening-box/.test(src),
  },
];

// ── Run checks ──────────────────────────────────────────────────────────────
function auditFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf-8');
  const results = {};
  for (const check of checks) {
    const result = check.test(src);
    results[check.id] = result; // true, false, or 'na'
  }
  return results;
}

// ── Aggregate by category ───────────────────────────────────────────────────
function categoryPass(results, catKey) {
  const catChecks = checks.filter(ch => ch.category === catKey);
  const applicable = catChecks.filter(ch => results[ch.id] !== 'na');
  if (applicable.length === 0) return 'na';
  return applicable.every(ch => results[ch.id] === true);
}

// ── Main ────────────────────────────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes('--json');
  const toolFilter = args.includes('--tool') ? args[args.indexOf('--tool') + 1] : null;

  const baseDir = path.resolve(__dirname, '..');
  let toolFiles = findToolFiles(baseDir);

  if (toolFilter) {
    toolFiles = toolFiles.filter(f => f.name.includes(toolFilter));
    if (toolFiles.length === 0) {
      console.error(`No tool matching "${toolFilter}" found.`);
      process.exit(1);
    }
  }

  console.log(`\n${c.bold}${c.cyan}━━━ FAST TRACK TOOL CONSISTENCY AUDIT ━━━${c.reset}`);
  console.log(`${c.dim}Scanning ${toolFiles.length} tools against gold standard (22-core-activities)${c.reset}\n`);

  // Run all audits
  const allResults = {};
  for (const tool of toolFiles) {
    allResults[tool.name] = auditFile(tool.path);
  }

  // ── Section 1: Matrix table ────────────────────────────────────────────
  const catKeys = Object.keys(CATEGORIES);
  const catLabels = catKeys.map(k => CATEGORIES[k].label.substring(0, 6).toUpperCase());

  console.log(`${c.bold}SECTION 1: CATEGORY MATRIX${c.reset}\n`);
  // Header
  const nameCol = 28;
  let header = 'TOOL'.padEnd(nameCol);
  for (const k of catKeys) {
    header += CATEGORIES[k].label.substring(0, 7).padEnd(9);
  }
  console.log(`${c.bold}${header}${c.reset}`);
  console.log('─'.repeat(header.length));

  for (const tool of toolFiles) {
    const res = allResults[tool.name];
    let row = tool.name.padEnd(nameCol);
    for (const k of catKeys) {
      const p = categoryPass(res, k);
      if (p === 'na') row += `${NA}      `;
      else if (p)     row += `${PASS}    `;
      else            row += `${FAIL}    `;
    }
    console.log(row);
  }

  // ── Section 2: Failures by tool ────────────────────────────────────────
  console.log(`\n${c.bold}SECTION 2: FAILURES BY TOOL${c.reset}\n`);

  let totalIssues = 0;
  const fullyCompliant = [];

  for (const tool of toolFiles) {
    const res = allResults[tool.name];
    const failures = checks.filter(ch => res[ch.id] === false);
    if (failures.length === 0) {
      fullyCompliant.push(tool.name);
      continue;
    }
    totalIssues += failures.length;

    console.log(`${c.bold}${c.white}${tool.name}${c.reset} (${failures.length} issue${failures.length > 1 ? 's' : ''}):`);
    for (const ch of failures) {
      const sev = CATEGORIES[ch.category].severity;
      const sevColor = sev === 'CRITICAL' ? c.red : sev === 'WARNING' ? c.yellow : c.dim;
      console.log(`  ${sevColor}[${sev}]${c.reset} ${ch.id}: ${ch.name}`);
    }
    console.log('');
  }

  // ── Section 3: Summary ────────────────────────────────────────────────
  console.log(`${c.bold}SECTION 3: SUMMARY${c.reset}\n`);

  console.log(`${'Category'.padEnd(24)} ${'Pass/Total'.padEnd(12)} %`);
  console.log('─'.repeat(44));

  const catStats = {};
  for (const k of catKeys) {
    const catChecks_ = checks.filter(ch => ch.category === k);
    let pass = 0, total = 0;
    for (const tool of toolFiles) {
      for (const ch of catChecks_) {
        const r = allResults[tool.name][ch.id];
        if (r === 'na') continue;
        total++;
        if (r === true) pass++;
      }
    }
    const pct = total > 0 ? Math.round((pass / total) * 100) : 100;
    catStats[k] = { pass, total, pct };
    const pctColor = pct >= 80 ? c.green : pct >= 50 ? c.yellow : c.red;
    console.log(`${CATEGORIES[k].label.padEnd(24)} ${(pass + '/' + total).padEnd(12)} ${pctColor}${pct}%${c.reset}`);
  }

  console.log('');
  console.log(`${c.bold}Total issues: ${c.red}${totalIssues}${c.reset}`);
  console.log(`${c.bold}Fully compliant:${c.reset} ${fullyCompliant.length > 0 ? c.green + fullyCompliant.join(', ') + c.reset : c.dim + 'none' + c.reset}`);

  // Tools needing most work
  const toolIssueCount = toolFiles.map(t => ({
    name: t.name,
    issues: checks.filter(ch => allResults[t.name][ch.id] === false).length,
  })).sort((a, b) => b.issues - a.issues);

  const needingWork = toolIssueCount.filter(t => t.issues > 0).slice(0, 5);
  if (needingWork.length > 0) {
    console.log(`${c.bold}Most work needed:${c.reset} ${needingWork.map(t => `${c.red}${t.name}${c.reset} (${t.issues})`).join(', ')}`);
  }

  console.log('');

  // ── JSON output ────────────────────────────────────────────────────────
  if (jsonMode) {
    const jsonOut = {
      tools: {},
      summary: catStats,
      fullyCompliant,
      totalIssues,
    };
    for (const tool of toolFiles) {
      jsonOut.tools[tool.name] = allResults[tool.name];
    }
    const outPath = path.join(__dirname, 'audit-results.json');
    fs.writeFileSync(outPath, JSON.stringify(jsonOut, null, 2));
    console.log(`${c.dim}JSON written to ${outPath}${c.reset}\n`);
  }
}

main();
