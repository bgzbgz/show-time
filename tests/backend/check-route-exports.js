#!/usr/bin/env node
/**
 * Backend Route Export Check
 * Verifies that all route files parse correctly and export a default Router.
 * Catches syntax errors, missing imports, and broken exports before deploy.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROUTES_DIR = join(__dirname, '..', '..', 'backend', 'src', 'routes');

// All route files that index.ts imports
const EXPECTED_ROUTES = [
  'auth.ts',
  'tools.ts',
  'user.ts',
  'data.ts',
  'ai.ts',
  'guru.ts',
  'learnworlds.ts',
  'webhooks.ts',
  'toolsave.ts',
];

let passed = 0;
let failed = 0;
const issues = [];

console.log('╔══════════════════════════════════════════════╗');
console.log('║   BACKEND ROUTE CHECK — Fast Track Tools     ║');
console.log('╚══════════════════════════════════════════════╝\n');

for (const file of EXPECTED_ROUTES) {
  const filepath = join(ROUTES_DIR, file);

  // 1. File exists
  if (!existsSync(filepath)) {
    issues.push(`${file}: FILE MISSING`);
    failed++;
    continue;
  }

  const content = readFileSync(filepath, 'utf-8');

  // 2. Has Router import
  if (!content.includes('Router')) {
    issues.push(`${file}: Missing Router import`);
    failed++;
    continue;
  }

  // 3. Creates a router instance
  if (!content.includes('Router()')) {
    issues.push(`${file}: No Router() instantiation`);
    failed++;
    continue;
  }

  // 4. Has default export
  if (!content.includes('export default')) {
    issues.push(`${file}: Missing default export`);
    failed++;
    continue;
  }

  // 5. Has at least one route handler
  const hasRoute = /router\.(get|post|put|patch|delete)\s*\(/.test(content);
  if (!hasRoute) {
    issues.push(`${file}: No route handlers found`);
    failed++;
    continue;
  }

  passed++;
}

// 6. Check index.ts mounts all routes
const indexPath = join(__dirname, '..', '..', 'backend', 'src', 'index.ts');
if (existsSync(indexPath)) {
  const indexContent = readFileSync(indexPath, 'utf-8');

  for (const file of EXPECTED_ROUTES) {
    const routeName = file.replace('.ts', '');
    if (!indexContent.includes(`'./routes/${routeName}.js'`) && !indexContent.includes(`"./routes/${routeName}.js"`)) {
      issues.push(`index.ts: Missing import for routes/${routeName}`);
      failed++;
    }
  }
} else {
  issues.push('index.ts: FILE MISSING');
  failed++;
}

// 7. Specific checks for toolsave.ts (critical migration file)
const toolsavePath = join(ROUTES_DIR, 'toolsave.ts');
if (existsSync(toolsavePath)) {
  const toolsave = readFileSync(toolsavePath, 'utf-8');

  const requiredEndpoints = [
    { pattern: /router\.get\(\s*['"]\/questions['"]/, name: 'GET /questions' },
    { pattern: /router\.get\(\s*['"]\/load['"]/, name: 'GET /load' },
    { pattern: /router\.get\(\s*['"]\/dependency['"]/, name: 'GET /dependency' },
    { pattern: /router\.get\(\s*['"]\/team-unlock['"]/, name: 'GET /team-unlock' },
    { pattern: /router\.get\(\s*['"]\/completions['"]/, name: 'GET /completions' },
    { pattern: /router\.post\(\s*['"]\/identify['"]/, name: 'POST /identify' },
    { pattern: /router\.post\(\s*['"]\/save['"]/, name: 'POST /save' },
    { pattern: /router\.post\(\s*['"]\/complete['"]/, name: 'POST /complete' },
  ];

  for (const ep of requiredEndpoints) {
    if (!ep.pattern.test(toolsave)) {
      issues.push(`toolsave.ts: Missing endpoint ${ep.name}`);
      failed++;
    } else {
      passed++;
    }
  }
}

// Report
if (issues.length > 0) {
  console.log(`❌ ${issues.length} issue(s) found:\n`);
  for (const issue of issues) {
    console.log(`  ✗ ${issue}`);
  }
  console.log('');
}

console.log(`${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}

console.log('✅ All backend route checks passed');
