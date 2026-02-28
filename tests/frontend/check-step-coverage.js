/**
 * Step Coverage Checker for Fast Track Tool HTML files
 *
 * Verifies that every wizard step number referenced in conditionals
 * (step === N, step >= N) has a matching render path. Catches blank-page bugs
 * where a step is advanced to but nothing renders.
 *
 * Usage: node tests/frontend/check-step-coverage.js
 * Exit code: 0 = all pass, 1 = errors found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

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

function extractBabelContent(html) {
  const regex = /<script\s+type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    blocks.push(match[1]);
  }
  return blocks.join('\n');
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

  const code = extractBabelContent(html);
  if (!code) return;

  const issues = [];

  // 1. Find all step values set via setStep(N)
  const setStepValues = new Set();
  const setStepRegex = /setStep\s*\(\s*(\d+(?:\.\d+)?)\s*\)/g;
  let m;
  while ((m = setStepRegex.exec(code)) !== null) {
    setStepValues.add(parseFloat(m[1]));
  }

  // 2. Find all step values checked in conditionals
  //    step === N, step == N, step >= N, case N:
  const checkedSteps = new Set();
  const condRegex = /step\s*(?:===?|>=|<=)\s*(\d+(?:\.\d+)?)/g;
  while ((m = condRegex.exec(code)) !== null) {
    checkedSteps.add(parseFloat(m[1]));
  }
  const caseRegex = /case\s+(\d+(?:\.\d+)?)\s*:/g;
  while ((m = caseRegex.exec(code)) !== null) {
    checkedSteps.add(parseFloat(m[1]));
  }

  // 3. Find all renderStepN function definitions
  const renderFuncs = new Set();
  const renderFuncRegex = /(?:const|function)\s+renderStep(\d+)/g;
  while ((m = renderFuncRegex.exec(code)) !== null) {
    renderFuncs.add(parseInt(m[1]));
  }

  // 4. Find all renderStepN calls
  const renderCalls = new Set();
  const renderCallRegex = /renderStep(\d+)\s*\(/g;
  while ((m = renderCallRegex.exec(code)) !== null) {
    renderCalls.add(parseInt(m[1]));
  }

  // 5. Check: any renderStepN() called but not defined?
  for (const n of renderCalls) {
    if (!renderFuncs.has(n)) {
      issues.push(`renderStep${n}() is called but not defined`);
    }
  }

  // 6. Find integer steps that are set but never checked/rendered
  //    Only check integer steps (half-steps are transitions, handled differently)
  const integerStepsSet = [...setStepValues].filter(n => Number.isInteger(n) && n >= 1);
  const integerStepsChecked = [...checkedSteps].filter(n => Number.isInteger(n) && n >= 1);
  const allIntSteps = new Set([...integerStepsSet, ...integerStepsChecked]);

  // For each integer step, verify there's either:
  // - A conditional check (step === N) in the render
  // - A renderStepN function
  // - A case N: in a switch
  for (const n of allIntSteps) {
    const hasConditional = checkedSteps.has(n);
    const hasRenderFunc = renderFuncs.has(n) || renderCalls.has(n);
    const hasCase = new RegExp(`case\\s+${n}\\s*:`).test(code);

    // Check if step is set via setStep but never rendered
    if (setStepValues.has(n) && !hasConditional && !hasRenderFunc && !hasCase) {
      issues.push(`Step ${n} is set via setStep(${n}) but has no render conditional or renderStep${n}()`);
    }
  }

  // 7. Check for totalSteps consistency
  const totalStepsMatch = code.match(/(?:const\s+)?totalSteps\s*=\s*(\d+)/);
  if (totalStepsMatch) {
    const total = parseInt(totalStepsMatch[1]);
    // Every step from 1 to totalSteps should have some render path
    for (let n = 1; n <= total; n++) {
      const hasAnyRender = checkedSteps.has(n) || renderFuncs.has(n) || renderCalls.has(n);
      if (!hasAnyRender) {
        issues.push(`totalSteps=${total} but step ${n} has no render path`);
      }
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
console.log('║   STEP COVERAGE CHECK — Fast Track Tools      ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const files = findHtmlFiles(TOOLS_DIR);
console.log(`Scanning ${files.length} tool files...\n`);

for (const file of files) {
  checkFile(file);
}

if (ERRORS.length === 0) {
  console.log(`✅ ALL ${PASSED.length} files passed step coverage check\n`);
  process.exit(0);
} else {
  console.log(`❌ ${ERRORS.length} file(s) with step coverage issues:\n`);
  for (const err of ERRORS) {
    console.log(`  ${err.file}`);
    for (const issue of err.issues) {
      console.log(`    ✗ ${issue}`);
    }
  }
  console.log(`\n  ${PASSED.length} passed, ${ERRORS.length} failed\n`);
  process.exit(1);
}
