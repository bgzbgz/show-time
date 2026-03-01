/**
 * batch-fixes.js
 * 1. Remove Tailwind CDN from files that don't use Tailwind classes (safe list)
 * 2. Add Number.isInteger(step) guard to JSX wizard render conditions
 *
 * Run: node scripts/batch-fixes.js
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TOOLS_DIR = join(__dirname, '../frontend/tools');

// ── 1. Tailwind CDN removal ──────────────────────────────────────────────────
// Only files confirmed SAFE (no Tailwind utility classes in use)
const TAILWIND_SAFE = new Set([
  '00-woop.html',
  '06-cash.html',
  '09-focus.html',
  '10-performance.html',
  '11-meeting-rhythm.html',
  '14-target-segment-deep-dive.html',
]);

// ── 2. Number.isInteger guard ────────────────────────────────────────────────
// Patterns to fix in JSX renders (inline && conditions).
// We target the specific string that appears in each file and replace it with
// the guarded version. Only touches lines that don't already have the guard.
//
// Pattern: any  `step >= 1 ... && (`  or  `step >= 1 ... && (() =>`
// that does NOT already contain Number.isInteger.
// We insert `Number.isInteger(step) && ` before the trailing `( ` or `(() =>`.

function addIsIntegerGuard(content) {
  // Match: ... && (   where the line has "step >= 1" and NOT "Number.isInteger"
  // We add the guard right before the last `&& (` on such lines.
  // Works for both `&& (` and `&& (() =>` endings.
  const lines = content.split('\n');
  const out = lines.map(line => {
    // Skip if already guarded
    if (line.includes('Number.isInteger')) return line;
    // Skip if not a step >= 1 condition
    if (!line.includes('step >= 1')) return line;
    // Must be a JSX render condition ending with && ( or && (() =>
    if (!/&&\s*\(/.test(line)) return line;

    // Handle IIFE pattern: `&& (() => {`
    if (/&&\s*\(\s*\(\s*=>/.test(line)) {
      return line.replace(/&&\s*(\(\s*\(\s*=>)/, '&& Number.isInteger(step) && $1');
    }

    // Handle normal JSX pattern: `&& (`
    return line.replace(/&&\s*(\()(?!\s*\()/, '&& Number.isInteger(step) && $1');
  });
  return out.join('\n');
}

// ── Walk tools dir ───────────────────────────────────────────────────────────
function walk(dir) {
  let out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(full));
    else if (e.name.endsWith('.html') && e.name !== 'TOOL-BLUEPRINT.html') out.push(full);
  }
  return out;
}

let twRemoved = 0;
let guardAdded = 0;

for (const file of walk(TOOLS_DIR)) {
  const name = basename(file);
  let content = readFileSync(file, 'utf8');
  let changed = false;

  // 1. Tailwind CDN removal
  if (TAILWIND_SAFE.has(name) && content.includes('cdn.tailwindcss.com')) {
    const before = content;
    // Remove the entire <script src="...tailwind..."></script> line (with surrounding whitespace/newline)
    content = content.replace(/\n?\s*<script src="https:\/\/cdn\.tailwindcss\.com[^"]*"><\/script>/g, '');
    if (content !== before) {
      console.log(`[CDN removed]   ${name}`);
      twRemoved++;
      changed = true;
    }
  }

  // 2. Number.isInteger guard
  const guarded = addIsIntegerGuard(content);
  if (guarded !== content) {
    console.log(`[isInt guard]   ${name}`);
    guardAdded++;
    content = guarded;
    changed = true;
  }

  if (changed) {
    writeFileSync(file, content, 'utf8');
  }
}

console.log(`\nDone. Tailwind CDN removed: ${twRemoved} files. isInteger guard added: ${guardAdded} files.`);
