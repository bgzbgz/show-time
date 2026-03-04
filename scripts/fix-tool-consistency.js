/**
 * fix-tool-consistency.js — Auto-fixer for tool design consistency issues
 *
 * Usage:
 *   node scripts/fix-tool-consistency.js                         # dry-run all
 *   node scripts/fix-tool-consistency.js --apply                 # write changes
 *   node scripts/fix-tool-consistency.js --tool 10-performance   # single tool
 *   node scripts/fix-tool-consistency.js --fix F2,A3,A4          # specific fixes only
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE = path.resolve(__dirname, '..');

// =============================================================================
// CLI Args
// =============================================================================
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const TOOL_FILTER = args.includes('--tool') ? args[args.indexOf('--tool') + 1] : null;
const FIX_FILTER = args.includes('--fix')
  ? args[args.indexOf('--fix') + 1].split(',').map(f => f.trim().toUpperCase())
  : null;

// Skip list — fully compliant tools
const SKIP = ['01-know-thyself', '22-core-activities'];

// ANSI colors
const c = {
  green: s => `\x1b[32m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan: s => `\x1b[36m${s}\x1b[0m`,
  dim: s => `\x1b[2m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
};

// =============================================================================
// File Discovery (same as audit script)
// =============================================================================
function findToolFiles() {
  const toolsDir = path.join(BASE, 'frontend', 'tools');
  const files = [];
  for (const moduleDir of fs.readdirSync(toolsDir).sort()) {
    const modPath = path.join(toolsDir, moduleDir);
    if (!fs.statSync(modPath).isDirectory()) continue;
    for (const file of fs.readdirSync(modPath).sort()) {
      if (!file.endsWith('.html')) continue;
      if (file === 'TOOL-BLUEPRINT.html') continue;
      const name = file.replace('.html', '');
      if (TOOL_FILTER && name !== TOOL_FILTER) continue;
      if (SKIP.includes(name)) continue;
      files.push({ name, path: path.join(modPath, file) });
    }
  }
  return files;
}

// =============================================================================
// Helper Functions
// =============================================================================
function getIndent(line) {
  const m = line.match(/^(\s*)/);
  return m ? m[1] : '';
}

function shouldApplyFix(fixId) {
  if (!FIX_FILTER) return true;
  return FIX_FILTER.includes(fixId);
}

/**
 * Detect TOTAL_STEPS by scanning for max integer step references
 */
function detectTotalSteps(content) {
  const patterns = [
    /step\s*===?\s*(\d+)/g,
    /step\s*<=?\s*(\d+)/g,
    /step\s*>=?\s*1\s*&&\s*step\s*<=?\s*(\d+)/g,
    /TOTAL_STEPS:\s*(\d+)/g,
    /totalSteps\s*[=:]\s*(\d+)/g,
    /step\s*===?\s*(\d+)\s*&&\s*render/g,
    /case\s+(\d+)\s*:/g,
  ];
  let max = 0;
  for (const pat of patterns) {
    let m;
    while ((m = pat.exec(content)) !== null) {
      const n = parseInt(m[1], 10);
      // Filter out unreasonable values (step 999 bugs, zIndex, etc.)
      if (n > 0 && n <= 20 && n > max) max = n;
    }
  }
  return max || null;
}

/**
 * Find insertion point for guards: before the main return statement
 * Looks for pattern: return (\n  followed by JSX render
 */
function findMainReturnLine(lines) {
  // Search backward from ReactDOM.render/createRoot
  let reactDomLine = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/ReactDOM\.(render|createRoot)/.test(lines[i])) {
      reactDomLine = i;
      break;
    }
  }
  if (reactDomLine === -1) return -1;

  // Search backward from ReactDOM for the main App function's return
  // Look for `return (` that is at function body depth
  for (let i = reactDomLine - 1; i >= 0; i--) {
    const line = lines[i].trim();
    // Skip closing braces, empty lines
    if (line === '' || line === '}' || line === '});' || line === ');') continue;
    // Found the main return
    if (/^\s*return\s*\(/.test(lines[i])) {
      return i;
    }
    // If we hit a function declaration, we went too far
    if (/^\s*function\s+\w+/.test(lines[i])) break;
  }
  return -1;
}

/**
 * Find the last ToolDB.save call in the file
 */
function findLastToolDBSave(lines) {
  let lastIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/ToolDB\.save\s*\(/.test(lines[i])) {
      lastIdx = i;
    }
  }
  return lastIdx;
}

/**
 * Find the closing </style> tag
 */
function findClosingStyle(lines) {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() === '</style>') return i;
  }
  return -1;
}

/**
 * Find insertion point for components: before main App function
 */
function findMainAppLine(lines) {
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*function\s+\w+App\s*\(/.test(lines[i])) return i;
    // Also match: const XxxApp = () => or function Xxx() with ReactDOM nearby
  }
  // Fallback: search for the function right before ReactDOM
  let reactDomLine = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/ReactDOM\.(render|createRoot)/.test(lines[i])) {
      reactDomLine = i;
      break;
    }
  }
  if (reactDomLine === -1) return -1;

  // Walk backward to find function declaration
  let depth = 0;
  for (let i = reactDomLine - 1; i >= 0; i--) {
    const line = lines[i];
    depth += (line.match(/\}/g) || []).length;
    depth -= (line.match(/\{/g) || []).length;
    if (/^\s*function\s+\w+/.test(line) && depth <= 0) return i;
  }
  return -1;
}

// =============================================================================
// Fix Implementations
// =============================================================================

const FIXES = {
  /**
   * F2: Add TOTAL_STEPS to CONFIG
   */
  F2: {
    id: 'F2',
    label: 'Add TOTAL_STEPS to CONFIG',
    check: (content) => /TOTAL_STEPS:\s*\d+/.test(content),
    apply: (content, name) => {
      const totalSteps = detectTotalSteps(content);
      if (!totalSteps) return { content, applied: false, reason: 'Could not detect total steps' };

      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (/TOOL_SLUG:\s*['"]/.test(lines[i])) {
          const indent = getIndent(lines[i]);
          lines.splice(i + 1, 0, `${indent}TOTAL_STEPS: ${totalSteps},`);
          return {
            content: lines.join('\n'),
            applied: true,
            detail: `TOTAL_STEPS: ${totalSteps} (after line ${i + 1})`,
          };
        }
      }
      return { content, applied: false, reason: 'TOOL_SLUG line not found' };
    },
  },

  /**
   * H1: Add tool-frame/tool-inner CSS
   */
  H1: {
    id: 'H1',
    label: 'Add tool-frame/tool-inner CSS',
    check: (content) => /\.tool-frame\s*\{/.test(content),
    apply: (content) => {
      const css = `    .tool-frame { background: #fff; min-height: 100vh; }\n    .tool-inner { background: #fff; min-height: 100vh; }`;
      const lines = content.split('\n');
      const styleEnd = findClosingStyle(lines);
      if (styleEnd === -1) return { content, applied: false, reason: 'No </style> found' };
      lines.splice(styleEnd, 0, css);
      return { content: lines.join('\n'), applied: true, detail: `Inserted before </style> (line ${styleEnd + 1})` };
    },
  },

  /**
   * H2: Add standard CSS classes (.step-content, .step-indicator, .opening-box)
   */
  H2: {
    id: 'H2',
    label: 'Add standard CSS classes',
    check: (content) =>
      /\.step-content\s*\{/.test(content) &&
      /\.step-indicator\s*\{/.test(content) &&
      /\.opening-box\s*\{/.test(content),
    apply: (content) => {
      const missing = [];
      if (!/\.step-content\s*\{/.test(content))
        missing.push("    .step-content { max-width: 100%; padding: 40px 0; flex: 1; }");
      if (!/\.step-indicator\s*\{/.test(content))
        missing.push("    .step-indicator { font-family: 'Monument', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 8px; }");
      if (!/\.opening-box\s*\{/.test(content)) {
        missing.push("    .opening-box { margin-bottom: 32px; }");
        missing.push("    .opening-box .step-heading { font-family: 'Plaak', sans-serif; font-weight: bold; font-size: 32px; letter-spacing: -0.01em; line-height: 1.2; color: #000; margin-bottom: 6px; }");
        missing.push("    .opening-box .step-hint { font-size: 14px; color: #666; line-height: 1.5; margin: 0; }");
      }
      if (missing.length === 0) return { content, applied: false, reason: 'All classes present' };

      const lines = content.split('\n');
      const styleEnd = findClosingStyle(lines);
      if (styleEnd === -1) return { content, applied: false, reason: 'No </style> found' };
      lines.splice(styleEnd, 0, missing.join('\n'));
      return { content: lines.join('\n'), applied: true, detail: `Added ${missing.length} CSS rules` };
    },
  },

  /**
   * C5: Add MobileStepBar CSS
   */
  C5: {
    id: 'C5',
    label: 'Add MobileStepBar CSS',
    check: (content) => /\.mobile-step-bar\s*\{/.test(content),
    apply: (content) => {
      const css = `    .mobile-step-bar { display: none; }
    @media (max-width: 768px) {
        .wizard-sidebar { display: none; }
        .wizard-main { padding: 0 24px; }
        .mobile-step-bar { display: flex; align-items: center; gap: 8px; padding: 16px 24px; background: #1a1a1a; }
        .mobile-step-dot { width: 8px; height: 8px; border-radius: 50%; background: #333; transition: background 0.2s; }
        .mobile-step-dot.active { background: #FFF469; }
        .mobile-step-dot.done   { background: #4ade80; }
        .mobile-step-text { font-family: 'Monument', monospace; font-size: 11px; color: #fff; letter-spacing: 0.06em; }
        .wizard-footer { padding: 16px 24px; }
    }`;
      // Check if @media (max-width: 768px) already exists
      const lines = content.split('\n');
      const styleEnd = findClosingStyle(lines);
      if (styleEnd === -1) return { content, applied: false, reason: 'No </style> found' };

      // If there's already a mobile media query, insert inside it
      // Otherwise insert before </style>
      lines.splice(styleEnd, 0, css);
      return { content: lines.join('\n'), applied: true, detail: 'Inserted MobileStepBar CSS' };
    },
  },

  /**
   * C4: Add MobileStepBar component
   */
  C4: {
    id: 'C4',
    label: 'Add MobileStepBar component',
    check: (content) => /function\s+MobileStepBar/.test(content),
    apply: (content) => {
      const component = `
    function MobileStepBar({ currentStep, totalSteps }) {
        return (
            <div className="mobile-step-bar">
                <span className="mobile-step-text">STEP {Math.ceil(currentStep)} OF {totalSteps}</span>
                {Array.from({ length: totalSteps }, (_, i) => {
                    const n = i + 1;
                    const isDone   = currentStep > n;
                    const isActive = Math.floor(currentStep) === n;
                    return <div key={n} className={\`mobile-step-dot \${isActive ? 'active' : isDone ? 'done' : ''}\`} />;
                })}
            </div>
        );
    }
`;
      const lines = content.split('\n');
      const appLine = findMainAppLine(lines);
      if (appLine === -1) return { content, applied: false, reason: 'Could not find main App function' };

      lines.splice(appLine, 0, component);
      return { content: lines.join('\n'), applied: true, detail: `Inserted before App function (line ${appLine + 1})` };
    },
  },

  /**
   * A3: Add isWizardStep guard
   */
  A3: {
    id: 'A3',
    label: 'Add isWizardStep guard',
    check: (content) => /const\s+isWizardStep\s*=/.test(content),
    apply: (content) => {
      // Need TOTAL_STEPS to exist (either already there or added by F2)
      if (!/TOTAL_STEPS:\s*\d+/.test(content)) {
        return { content, applied: false, reason: 'CONFIG.TOTAL_STEPS not found (run F2 first)' };
      }

      const lines = content.split('\n');
      const returnLine = findMainReturnLine(lines);
      if (returnLine === -1) return { content, applied: false, reason: 'Could not find main return statement' };

      const indent = getIndent(lines[returnLine]);
      // Check if totalSteps variable exists
      const hasTotalSteps = /const\s+totalSteps\s*=/.test(content) || /totalSteps/.test(content);
      const stepsRef = hasTotalSteps ? 'totalSteps' : 'CONFIG.TOTAL_STEPS';

      lines.splice(returnLine, 0,
        `${indent}const isWizardStep = Number.isInteger(step) && step >= 1 && step <= ${stepsRef};`
      );
      return { content: lines.join('\n'), applied: true, detail: `Inserted before return (line ${returnLine + 1})` };
    },
  },

  /**
   * A4: Add isTransition guard
   */
  A4: {
    id: 'A4',
    label: 'Add isTransition guard',
    check: (content) => /const\s+isTransition\s*=/.test(content),
    apply: (content) => {
      const lines = content.split('\n');

      // Find isWizardStep line (should exist after A3 runs)
      let wizardStepLine = -1;
      for (let i = 0; i < lines.length; i++) {
        if (/const\s+isWizardStep\s*=/.test(lines[i])) {
          wizardStepLine = i;
          break;
        }
      }

      if (wizardStepLine !== -1) {
        const indent = getIndent(lines[wizardStepLine]);
        lines.splice(wizardStepLine + 1, 0,
          `${indent}const isTransition = !Number.isInteger(step) && step > 0.5;`
        );
        return { content: lines.join('\n'), applied: true, detail: `Inserted after isWizardStep (line ${wizardStepLine + 2})` };
      }

      // Fallback: insert before main return
      const returnLine = findMainReturnLine(lines);
      if (returnLine === -1) return { content, applied: false, reason: 'Could not find insertion point' };

      const indent = getIndent(lines[returnLine]);
      lines.splice(returnLine, 0,
        `${indent}const isTransition = !Number.isInteger(step) && step > 0.5;`
      );
      return { content: lines.join('\n'), applied: true, detail: `Inserted before return (line ${returnLine + 1})` };
    },
  },

  /**
   * G2: Add ToolDB.markComplete after last ToolDB.save
   */
  G2: {
    id: 'G2',
    label: 'Add ToolDB.markComplete',
    check: (content) => /ToolDB\.markComplete/.test(content),
    apply: (content) => {
      if (!/ToolDB\.save/.test(content)) {
        return { content, applied: false, reason: 'No ToolDB.save found' };
      }
      if (/ToolDB\.markComplete/.test(content)) {
        return { content, applied: false, reason: 'Already present' };
      }

      const lines = content.split('\n');
      const lastSave = findLastToolDBSave(lines);
      if (lastSave === -1) return { content, applied: false, reason: 'ToolDB.save not found' };

      // Find the closing of the save call (might span multiple lines)
      let insertAfter = lastSave;
      let depth = 0;
      for (let i = lastSave; i < lines.length; i++) {
        for (const ch of lines[i]) {
          if (ch === '(') depth++;
          if (ch === ')') depth--;
        }
        if (depth <= 0) {
          insertAfter = i;
          break;
        }
      }

      // Check if enclosing function is async
      let isAsync = false;
      for (let i = insertAfter; i >= 0; i--) {
        if (/async\s+(function|\()/.test(lines[i]) || /=\s*async\s*\(/.test(lines[i])) {
          isAsync = true;
          break;
        }
        if (/^\s*function\s/.test(lines[i]) && !/async/.test(lines[i])) break;
      }

      const indent = getIndent(lines[lastSave]);
      const awaitPrefix = isAsync ? 'await ' : '';
      lines.splice(insertAfter + 1, 0, `${indent}${awaitPrefix}ToolDB.markComplete(userId);`);
      return {
        content: lines.join('\n'),
        applied: true,
        detail: `Inserted after ToolDB.save (line ${insertAfter + 2})${!isAsync ? ' ⚠ not async' : ''}`,
      };
    },
  },
};

// Execution order matters: F2 before A3, A3 before A4
const FIX_ORDER = ['F2', 'H1', 'H2', 'C5', 'C4', 'A3', 'A4', 'G2'];

// =============================================================================
// Manual-only issues (report at end)
// =============================================================================
const MANUAL_ISSUES = [
  { id: 'E1/E2', label: 'TransitionScreen + TRANSITION_CONTENT (needs human-written copy)', check: (c) => !/TRANSITION_CONTENT/.test(c) || !/brutalTruth/.test(c) },
  { id: 'B3', label: 'COVER_IMAGE (needs selected URL)', check: (c) => !/COVER_IMAGE:\s*'https:/.test(c) },
  { id: 'A1/A2', label: 'tool-frame/tool-inner JSX wrappers (needs JSX restructuring)', check: (c) => !/className="[^"]*tool-frame/.test(c) },
  { id: 'C1/C2/C3', label: 'WizardSidebar content (tool-specific)', check: (c) => !/function\s+WizardSidebar/.test(c) },
];

// =============================================================================
// Main Execution
// =============================================================================
function main() {
  const tools = findToolFiles();
  console.log(c.bold(`\n  🔧 Tool Consistency Auto-Fixer\n`));
  console.log(`  Mode: ${APPLY ? c.red('APPLY (writing files)') : c.yellow('DRY-RUN (no changes)')}`);
  console.log(`  Tools: ${tools.length}`);
  if (FIX_FILTER) console.log(`  Fixes: ${FIX_FILTER.join(', ')}`);
  console.log('');

  let totalFixed = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  const results = [];

  for (const tool of tools) {
    let content = fs.readFileSync(tool.path, 'utf-8');
    const originalContent = content;
    const fixes = [];
    const skips = [];
    const fails = [];

    for (const fixId of FIX_ORDER) {
      if (!shouldApplyFix(fixId)) continue;
      const fix = FIXES[fixId];

      // Check if already applied
      if (fix.check(content)) {
        skips.push({ id: fixId, reason: 'Already present' });
        continue;
      }

      const result = fix.apply(content, tool.name);
      if (result.applied) {
        content = result.content;
        fixes.push({ id: fixId, label: fix.label, detail: result.detail });
      } else {
        fails.push({ id: fixId, label: fix.label, reason: result.reason });
      }
    }

    // Check manual issues
    const manualNeeded = MANUAL_ISSUES.filter(m => m.check(content));

    if (fixes.length > 0 || fails.length > 0 || manualNeeded.length > 0) {
      console.log(c.bold(`── ${tool.name} (${fixes.length} fixes${fails.length ? `, ${fails.length} failed` : ''}) ──`));

      for (const f of fixes) {
        console.log(c.green(`  [${f.id}] ${f.label}`));
        if (f.detail) console.log(c.dim(`         ${f.detail}`));
      }
      for (const f of fails) {
        console.log(c.red(`  [${f.id}] ${f.label} — SKIPPED: ${f.reason}`));
      }
      if (manualNeeded.length > 0) {
        console.log(c.yellow(`  ⚠ MANUAL: ${manualNeeded.map(m => m.id).join(', ')}`));
      }
      console.log('');
    }

    totalFixed += fixes.length;
    totalSkipped += skips.length;
    totalFailed += fails.length;
    results.push({ name: tool.name, fixes: fixes.length, fails: fails.length, manual: manualNeeded.length });

    // Write if --apply and content changed
    if (APPLY && content !== originalContent) {
      // Backup
      const bakPath = tool.path + '.bak';
      if (!fs.existsSync(bakPath)) {
        fs.writeFileSync(bakPath, originalContent);
      }
      fs.writeFileSync(tool.path, content);
    }
  }

  // Summary
  console.log(c.bold('═══════════════════════════════════════════════════'));
  console.log(c.bold('  SUMMARY'));
  console.log(c.bold('═══════════════════════════════════════════════════'));
  console.log(`  ${c.green(`Fixed:   ${totalFixed}`)}`);
  console.log(`  ${c.dim(`Skipped: ${totalSkipped} (already present)`)}`);
  console.log(`  ${c.red(`Failed:  ${totalFailed}`)}`);
  console.log(`  Manual: ${results.reduce((s, r) => s + r.manual, 0)} items across ${results.filter(r => r.manual > 0).length} tools`);
  console.log('');

  if (!APPLY && totalFixed > 0) {
    console.log(c.yellow(`  Run with --apply to write changes.\n`));
  }
  if (APPLY && totalFixed > 0) {
    console.log(c.green(`  ✓ ${totalFixed} fixes written. Backups saved as .bak files.\n`));
    console.log(c.dim(`  Run: node scripts/audit-tool-consistency.js  to verify.\n`));
  }
}

main();
