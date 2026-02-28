/**
 * No-Tailwind CDN Checker for Fast Track Tool HTML files
 *
 * Flags any tool still loading cdn.tailwindcss.com.
 * Modernized tools should use custom CSS only.
 *
 * Usage: node tests/frontend/check-no-tailwind.js
 * Exit code: 0 = all pass, 1 = errors found (warnings don't fail)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const TOOLS_DIR = join(process.cwd(), 'frontend', 'tools');
const WARNINGS = [];
const PASSED = [];

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

function checkFile(filePath) {
  const rel = relative(process.cwd(), filePath);
  let html;
  try {
    html = readFileSync(filePath, 'utf-8');
  } catch (e) {
    return;
  }

  if (html.includes('cdn.tailwindcss.com')) {
    WARNINGS.push(rel);
  } else {
    PASSED.push(rel);
  }
}

// ── Run ──
console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║   NO-TAILWIND CDN CHECK — Fast Track          ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const files = findHtmlFiles(TOOLS_DIR);
console.log(`Scanning ${files.length} tool files...\n`);

for (const file of files) {
  checkFile(file);
}

if (WARNINGS.length > 0) {
  console.log(`⚠️  ${WARNINGS.length} file(s) still use Tailwind CDN:\n`);
  for (const w of WARNINGS) {
    console.log(`  ⚠ ${w}`);
  }
  console.log('\n  (Warning only — not blocking CI)\n');
}

console.log(`✅ ${PASSED.length} files are Tailwind-free${WARNINGS.length > 0 ? `, ${WARNINGS.length} still use it` : ''}\n`);
process.exit(0); // Warnings only — don't block CI
