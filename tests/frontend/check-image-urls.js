/**
 * Image URL Checker for Fast Track Tool HTML files
 *
 * Flags backgroundImage/src pointing to local/relative file paths
 * instead of https URLs. Local images break on Railway deploy.
 *
 * Usage: node tests/frontend/check-image-urls.js
 * Exit code: 0 = all pass, 1 = errors found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const TOOLS_DIR = join(process.cwd(), 'frontend', 'tools');
const ERRORS = [];
const WARNINGS = [];
const PASSED = [];

// Allowed patterns (not flagged)
const ALLOWED_PATTERNS = [
  /^https?:\/\//, // https URLs
  /^data:/, // data URIs
  /^\.\.\/.*\.(js|css|otf|woff2?|json)$/, // allowed local assets (scripts, styles, fonts)
  /^\.\.\/shared\//, // shared directory references
];

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
  const lines = html.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check backgroundImage: url("...")
    const bgMatches = line.matchAll(/backgroundImage\s*:\s*['"`]?url\(['"]?([^'")\s]+)['"]?\)/gi);
    for (const m of bgMatches) {
      const url = m[1];
      if (isLocalImage(url)) {
        issues.push(`Line ${lineNum}: Local backgroundImage "${url}" — will 404 on deploy`);
      }
    }

    // Check background: url(...)
    const bgShorthand = line.matchAll(/background\s*:\s*[^;]*url\(['"]?([^'")\s]+)['"]?\)/gi);
    for (const m of bgShorthand) {
      const url = m[1];
      if (isLocalImage(url)) {
        issues.push(`Line ${lineNum}: Local background url "${url}" — will 404 on deploy`);
      }
    }

    // Check src="..." on img tags (but not script/link src)
    const srcMatches = line.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
    for (const m of srcMatches) {
      const url = m[1];
      if (isLocalImage(url)) {
        issues.push(`Line ${lineNum}: Local <img src> "${url}" — will 404 on deploy`);
      }
    }

    // Check backgroundImage in JSX style objects: backgroundImage: 'url(...)'
    const jsxBgMatches = line.matchAll(/backgroundImage\s*:\s*['"`]url\(([^)]+)\)['"`]/gi);
    for (const m of jsxBgMatches) {
      let url = m[1].replace(/['"]/g, '');
      if (isLocalImage(url)) {
        issues.push(`Line ${lineNum}: Local JSX backgroundImage "${url}" — will 404 on deploy`);
      }
    }
  }

  if (issues.length > 0) {
    ERRORS.push({ file: rel, issues });
  } else {
    PASSED.push(rel);
  }
}

function isLocalImage(url) {
  if (!url) return false;
  // Check against allowed patterns
  for (const pattern of ALLOWED_PATTERNS) {
    if (pattern.test(url)) return false;
  }
  // If it looks like a local image path
  if (/\.(png|jpg|jpeg|gif|svg|webp|avif|ico)(\?.*)?$/i.test(url)) {
    return true;
  }
  // Local paths like ./images/foo.png or /images/foo.png or C:\path
  if (/^(\.\/|\.\.\/|\/[^/]|[A-Z]:\\)/i.test(url) && /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(url)) {
    return true;
  }
  return false;
}

// ── Run ──
console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║   IMAGE URL CHECK — Fast Track Tools           ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const files = findHtmlFiles(TOOLS_DIR);
console.log(`Scanning ${files.length} tool files...\n`);

for (const file of files) {
  checkFile(file);
}

if (ERRORS.length === 0) {
  console.log(`✅ ALL ${PASSED.length} files passed image URL check\n`);
  process.exit(0);
} else {
  console.log(`❌ ${ERRORS.length} file(s) with local image URLs:\n`);
  for (const err of ERRORS) {
    console.log(`  ${err.file}`);
    for (const issue of err.issues) {
      console.log(`    ✗ ${issue}`);
    }
  }
  console.log(`\n  ${PASSED.length} passed, ${ERRORS.length} failed\n`);
  process.exit(1);
}
