/**
 * Babel Syntax Checker for Fast Track Tool HTML files
 *
 * Extracts <script type="text/babel"> blocks from each tool HTML file
 * and parses them with @babel/parser to catch syntax errors BEFORE deploy.
 *
 * Usage: node tests/frontend/check-babel-syntax.js
 * Exit code: 0 = all pass, 1 = errors found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { parse } from '@babel/parser';

const TOOLS_DIR = join(process.cwd(), 'frontend', 'tools');
const ERRORS = [];
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

function extractBabelScripts(html, filePath) {
  const scripts = [];
  // Match <script type="text/babel"> ... </script>
  const regex = /<script\s+type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const scriptContent = match[1];
    // Count lines before this script block to get correct line offset
    const beforeScript = html.substring(0, match.index);
    const lineOffset = beforeScript.split('\n').length;
    scripts.push({ content: scriptContent, lineOffset });
  }
  return scripts;
}

function checkFile(filePath) {
  const rel = relative(process.cwd(), filePath);
  let html;
  try {
    html = readFileSync(filePath, 'utf-8');
  } catch (e) {
    ERRORS.push({ file: rel, error: `Cannot read file: ${e.message}` });
    return;
  }

  const scripts = extractBabelScripts(html, filePath);
  if (scripts.length === 0) {
    // Not necessarily an error — some files might not have Babel scripts
    return;
  }

  for (const script of scripts) {
    try {
      parse(script.content, {
        sourceType: 'script',
        plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator'],
        errorRecovery: false,
      });
      PASSED.push(rel);
    } catch (e) {
      // Adjust line number to account for HTML lines before the script block
      const babelLine = e.loc ? e.loc.line : '?';
      const actualLine = e.loc ? e.loc.line + script.lineOffset - 1 : '?';
      const col = e.loc ? e.loc.column : '?';
      ERRORS.push({
        file: rel,
        error: e.message.split('\n')[0],
        line: actualLine,
        col,
        babelLine,
      });
    }
  }
}

// ── Run ──
console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║   BABEL SYNTAX CHECK — Fast Track Tools      ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const files = findHtmlFiles(TOOLS_DIR);
console.log(`Scanning ${files.length} tool files...\n`);

for (const file of files) {
  checkFile(file);
}

// ── Report ──
if (ERRORS.length === 0) {
  console.log(`✅ ALL ${PASSED.length} files passed Babel syntax check\n`);
  process.exit(0);
} else {
  console.log(`❌ ${ERRORS.length} SYNTAX ERROR(S) FOUND:\n`);
  for (const err of ERRORS) {
    console.log(`  FILE: ${err.file}`);
    if (err.line) console.log(`  LINE: ${err.line} (col ${err.col})`);
    console.log(`  ERROR: ${err.error}`);
    console.log('');
  }
  console.log(`  ${PASSED.length} files passed, ${ERRORS.length} failed\n`);
  process.exit(1);
}
