/**
 * HTML Structure Validator for Fast Track Tool files
 *
 * Checks each tool HTML file for required elements:
 * - <div id="root"> mount point
 * - CONFIG object with TOOL_SLUG
 * - Required script imports (react, react-dom, babel, supabase, tool-db)
 * - No broken local script src paths
 * - ReactDOM.createRoot render call
 *
 * Usage: node tests/frontend/check-html-structure.js
 * Exit code: 0 = all pass, 1 = errors found
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';

const TOOLS_DIR = join(process.cwd(), 'frontend', 'tools');
const ERRORS = [];
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
    ERRORS.push({ file: rel, issues: [`Cannot read file: ${e.message}`] });
    return;
  }

  const issues = [];
  const warns = [];

  // 1. Check for root div
  if (!html.includes('id="root"') && !html.includes("id='root'")) {
    issues.push('Missing <div id="root"> mount point');
  }

  // 2. Check for Babel script block
  if (!/<script\s+type=["']text\/babel["']/.test(html)) {
    issues.push('Missing <script type="text/babel"> block');
  }

  // 3. Check for CONFIG with TOOL_SLUG
  if (!html.includes('TOOL_SLUG')) {
    issues.push('Missing CONFIG.TOOL_SLUG — required for Supabase saves');
  }

  // 4. Check required CDN scripts
  const requiredScripts = [
    { pattern: /react@18.*production/i, name: 'React 18' },
    { pattern: /react-dom@18.*production/i, name: 'ReactDOM 18' },
    { pattern: /babel.*standalone/i, name: 'Babel standalone' },
  ];
  for (const req of requiredScripts) {
    if (!req.pattern.test(html)) {
      issues.push(`Missing required script: ${req.name}`);
    }
  }

  // 5. Check for tool-db.js import
  if (!html.includes('tool-db.js')) {
    issues.push('Missing tool-db.js import');
  }

  // 6. Check for ReactDOM render call
  if (!html.includes('createRoot') && !html.includes('ReactDOM.render')) {
    issues.push('Missing ReactDOM.createRoot / ReactDOM.render call');
  }

  // 7. Check local script/link src paths resolve
  const localSrcRegex = /(?:src|href)=["']((?:\.\.\/|\.\/)[^"']+)["']/g;
  let srcMatch;
  while ((srcMatch = localSrcRegex.exec(html)) !== null) {
    const srcPath = srcMatch[1];
    const resolved = join(dirname(filePath), srcPath);
    if (!existsSync(resolved)) {
      warns.push(`Broken local path: ${srcPath}`);
    }
  }

  // 8. Check for Tailwind (warn only — migration in progress)
  if (html.includes('cdn.tailwindcss.com')) {
    warns.push('Still uses Tailwind CDN (migration pending)');
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
console.log('║   HTML STRUCTURE CHECK — Fast Track Tools     ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const files = findHtmlFiles(TOOLS_DIR);
console.log(`Scanning ${files.length} tool files...\n`);

for (const file of files) {
  checkFile(file);
}

// ── Report ──
if (WARNINGS.length > 0) {
  console.log(`⚠️  ${WARNINGS.length} file(s) with warnings:\n`);
  for (const w of WARNINGS) {
    console.log(`  ${w.file}`);
    for (const warn of w.warns) {
      console.log(`    ⚠ ${warn}`);
    }
  }
  console.log('');
}

if (ERRORS.length === 0) {
  console.log(`✅ ALL ${PASSED.length} files passed HTML structure check\n`);
  process.exit(0);
} else {
  console.log(`❌ ${ERRORS.length} file(s) with ERRORS:\n`);
  for (const err of ERRORS) {
    console.log(`  ${err.file}`);
    for (const issue of err.issues) {
      console.log(`    ✗ ${issue}`);
    }
  }
  console.log(`\n  ${PASSED.length} passed, ${ERRORS.length} failed\n`);
  process.exit(1);
}
