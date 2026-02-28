/**
 * Duplicate ID Checker for Fast Track Tool HTML files
 *
 * Flags HTML elements with duplicate id attributes within the same file.
 * Duplicate IDs cause querySelector bugs and accessibility issues.
 *
 * Usage: node tests/frontend/check-duplicate-ids.js
 * Exit code: 0 = all pass, 1 = errors found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const TOOLS_DIR = join(process.cwd(), 'frontend', 'tools');
const ERRORS = [];
const PASSED = [];

// IDs that appear multiple times in JSX but are in conditional branches (never both in DOM)
const IGNORED_IDS = new Set([
  'root', // mount point — always unique
  'canvas-content', // used in wizard view AND print/PDF view (mutually exclusive renders)
  'canvas-view', // same pattern as canvas-content
  'pdf-content', // PDF export container
]);

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
    ERRORS.push({ file: rel, issues: [`Cannot read: ${e.message}`] });
    return;
  }

  const issues = [];

  // Extract all id="..." and id='...' occurrences (both HTML and JSX)
  const idCounts = new Map();
  const idRegex = /\bid=["']([^"']+)["']/g;
  let match;
  while ((match = idRegex.exec(html)) !== null) {
    const id = match[1];
    if (IGNORED_IDS.has(id)) continue;
    // Skip dynamic IDs like id={`item-${idx}`}
    if (id.includes('{') || id.includes('$')) continue;

    const count = (idCounts.get(id) || 0) + 1;
    idCounts.set(id, count);
  }

  for (const [id, count] of idCounts) {
    if (count > 1) {
      issues.push(`id="${id}" appears ${count} times`);
    }
  }

  if (issues.length > 0) {
    ERRORS.push({ file: rel, issues });
  } else {
    PASSED.push(rel);
  }
}

// ── Run ──
console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║   DUPLICATE ID CHECK — Fast Track Tools        ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const files = findHtmlFiles(TOOLS_DIR);
console.log(`Scanning ${files.length} tool files...\n`);

for (const file of files) {
  checkFile(file);
}

if (ERRORS.length === 0) {
  console.log(`✅ ALL ${PASSED.length} files passed duplicate ID check\n`);
  process.exit(0);
} else {
  console.log(`❌ ${ERRORS.length} file(s) with duplicate IDs:\n`);
  for (const err of ERRORS) {
    console.log(`  ${err.file}`);
    for (const issue of err.issues) {
      console.log(`    ✗ ${issue}`);
    }
  }
  console.log(`\n  ${PASSED.length} passed, ${ERRORS.length} failed\n`);
  process.exit(1);
}
