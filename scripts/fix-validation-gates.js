/**
 * fix-validation-gates.js — Batch-fix overly strict canProceed/validation functions
 *
 * Two fixes per tool:
 * 1. Lower character minimums (100→30, 50→20, 30→15)
 * 2. Lower item count minimums (5→2, 3→1, 8→3)
 *
 * Usage:
 *   node scripts/fix-validation-gates.js           # dry-run
 *   node scripts/fix-validation-gates.js --apply    # write changes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

// ANSI
const c = {
  green: s => `\x1b[32m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  dim: s => `\x1b[2m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
};

// Skip compliant tools
const SKIP = ['01-know-thyself', '22-core-activities', '00-woop', '04-team', '09-focus', '10-performance', '11-meeting-rhythm', '23-processes-decisions'];

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
      if (SKIP.includes(name)) continue;
      files.push({ name, path: path.join(modPath, file) });
    }
  }
  return files;
}

/**
 * Reduce character minimums in validation functions.
 * Strategy: find patterns like `.length >= N` or `.length > N` or `.length < N`
 * inside canProceed/validate/isStep functions, and lower extreme values.
 */
function fixCharMinimums(content) {
  let changes = 0;
  const lines = content.split('\n');

  // Track if we're inside a validation function
  let inValidation = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect validation function/expression entry
    if (/(?:canProceed|validate|isStep\d+Valid|isStageValid|isWowValid|isBetterValid)\w*\s*(?:=|\()/.test(line)) {
      inValidation = true;
      braceDepth = 0;
    }

    if (inValidation) {
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;

      // Apply char minimum reductions
      // >= 200 → >= 50
      const r1 = line.replace(/\.length\s*>=\s*200/g, '.length >= 50');
      // >= 150 → >= 50
      const r2 = r1.replace(/\.length\s*>=\s*150/g, '.length >= 50');
      // >= 100 → >= 30
      const r3 = r2.replace(/\.length\s*>=\s*100/g, '.length >= 30');
      // >= 50 → >= 20
      const r4 = r3.replace(/\.length\s*>=\s*50/g, '.length >= 20');
      // > 50 → > 20 (some use > instead of >=)
      const r5 = r4.replace(/\.length\s*>\s*50/g, '.length > 20');
      // < 50 → < 20 (inverted checks)
      const r6 = r5.replace(/\.length\s*<\s*50/g, '.length < 20');
      // < 100 → < 30
      const r7 = r6.replace(/\.length\s*<\s*100/g, '.length < 30');

      if (r7 !== line) {
        lines[i] = r7;
        changes++;
      }

      if (braceDepth <= 0 && i > 0) {
        inValidation = false;
      }
    }
  }

  return { content: lines.join('\n'), changes };
}

/**
 * Reduce item count minimums in validation:
 * - `.length >= 8` → `.length >= 3`
 * - `.length >= 5` → `.length >= 2`
 * - `.length >= 3` → `.length >= 1` (for required items)
 * - `.length < 5` → `.length < 2` etc.
 *
 * Only inside validation functions, and only for array-count patterns
 * (not char-length patterns which use the same syntax).
 */
function fixItemCounts(content) {
  let changes = 0;
  const lines = content.split('\n');

  let inValidation = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/(?:canProceed|validate|isStep\d+Valid)\w*\s*(?:=\s*(?:\(|function|\(\))|[\(])/.test(line)) {
      inValidation = true;
      braceDepth = 0;
    }

    if (inValidation) {
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;

      // Only modify lines that look like array count checks (not string length)
      // Heuristic: preceded by filter(), or checks on array variables (sources, decisions, etc.)
      // Pattern: `).length >= N` or `items.length >= N` where items is likely an array
      if (/\.filter\(/.test(line) || /(?:decisions|sources|truths|items|forces|segments|options|scenarios|actions|challenges|members|interviews|processes|tools|features|tiers|plans|questions|endpoints|roles)\s*[\.\)]/.test(line)) {
        let newLine = line;
        // >= 8 → >= 3
        newLine = newLine.replace(/\.length\s*>=\s*8\b/g, '.length >= 3');
        // >= 5 → >= 2
        newLine = newLine.replace(/\.length\s*>=\s*5\b/g, '.length >= 2');
        // < 5 → < 2
        newLine = newLine.replace(/\.length\s*<\s*5\b/g, '.length < 2');
        // < 3 → < 1
        newLine = newLine.replace(/\.length\s*<\s*3\b/g, '.length < 1');
        // >= 3 → >= 1 (only for clearly array counts)
        if (/(?:decisions|sources|truths|options|scenarios|actions|challenges|members|processes|tools|features|tiers|plans|endpoints|roles)/.test(line)) {
          newLine = newLine.replace(/\.length\s*>=\s*3\b/g, '.length >= 1');
        }

        if (newLine !== line) {
          lines[i] = newLine;
          changes++;
        }
      }

      if (braceDepth <= 0 && i > 0) {
        inValidation = false;
      }
    }
  }

  return { content: lines.join('\n'), changes };
}

/**
 * Also fix char-counter display text to match new minimums.
 * Pattern: `X / 50 minimum` or `X / 100 characters minimum`
 */
function fixCharCounterDisplay(content) {
  let changes = 0;
  // Fix hardcoded char counter display values to match lowered validation
  content = content.replace(/(\d+)\s*\/\s*200\s*(minimum|characters|chars)/gi, (m, count, suffix) => { changes++; return `${count} / 50 ${suffix}`; });
  content = content.replace(/(\d+)\s*\/\s*150\s*(minimum|characters|chars)/gi, (m, count, suffix) => { changes++; return `${count} / 50 ${suffix}`; });
  content = content.replace(/(\d+)\s*\/\s*100\s*(minimum|characters|chars)/gi, (m, count, suffix) => { changes++; return `${count} / 30 ${suffix}`; });
  // Don't change 50→20 in display because 20 is a very low display threshold
  // Only change if it's a char counter component
  content = content.replace(/\{[^}]*\.length[^}]*\}\s*\/\s*50\s*(minimum|characters|chars)/gi, (m) => { changes++; return m.replace('/ 50', '/ 20'); });
  return { content, changes };
}

// =============================================================================
// Main
// =============================================================================
function main() {
  const tools = findToolFiles();
  console.log(c.bold(`\n  🔓 Validation Gate Fixer\n`));
  console.log(`  Mode: ${APPLY ? c.red('APPLY') : c.yellow('DRY-RUN')}`);
  console.log(`  Tools: ${tools.length}\n`);

  let totalCharFixes = 0;
  let totalItemFixes = 0;
  let totalDisplayFixes = 0;

  for (const tool of tools) {
    let content = fs.readFileSync(tool.path, 'utf-8');
    const original = content;

    const r1 = fixCharMinimums(content);
    content = r1.content;

    const r2 = fixItemCounts(content);
    content = r2.content;

    const r3 = fixCharCounterDisplay(content);
    content = r3.content;

    const total = r1.changes + r2.changes + r3.changes;
    if (total > 0) {
      console.log(c.bold(`${tool.name}`) + `: ${c.green(r1.changes + ' char mins')} | ${c.yellow(r2.changes + ' item counts')} | ${c.dim(r3.changes + ' display fixes')}`);
      totalCharFixes += r1.changes;
      totalItemFixes += r2.changes;
      totalDisplayFixes += r3.changes;

      if (APPLY && content !== original) {
        fs.writeFileSync(tool.path, content);
      }
    }
  }

  console.log(c.bold(`\n  TOTAL: ${totalCharFixes + totalItemFixes + totalDisplayFixes} changes`));
  console.log(`    Char minimums lowered: ${totalCharFixes}`);
  console.log(`    Item counts lowered: ${totalItemFixes}`);
  console.log(`    Display values fixed: ${totalDisplayFixes}`);
  if (!APPLY) console.log(c.yellow(`\n  Run with --apply to write changes.\n`));
  if (APPLY) console.log(c.green(`\n  ✓ Changes written.\n`));
}

main();
