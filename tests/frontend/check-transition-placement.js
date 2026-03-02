/**
 * check-transition-placement.js
 *
 * Detects when renderTransitionScreen is placed INSIDE a Number.isInteger(step)
 * guarded block. Transition screens render at half-steps (1.5, 2.5, etc.),
 * so placing them inside an isInteger guard means they never render → blank page.
 *
 * Bug pattern:
 *   {Number.isInteger(step) && step >= 1 && (
 *       <div className="wizard-layout">
 *           ...
 *           {renderTransitionScreen(step, CONFIG, ...)}   ← NEVER RENDERS at 1.5
 *       </div>
 *   )}
 *
 * Correct pattern:
 *   {(() => { const t = renderTransitionScreen(step, ...); if (t) return t; ... })()}
 *   {Number.isInteger(step) && step >= 1 && (
 *       <div className="wizard-layout">...</div>
 *   )}
 *
 * OR (tools 10/11 style):
 *   {Number.isInteger(step) && [1,2,3].includes(step) && ( <wizard/> )}
 *   {window.renderTransitionScreen && [1.5,2.5].includes(step) && renderTransitionScreen(...)}
 */

import { readFileSync, readdirSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOOLS_DIR = join(__dirname, '../../frontend/tools');
const violations = [];

function getToolFiles(dir) {
    const results = [];
    for (const mod of readdirSync(dir)) {
        const modPath = join(dir, mod);
        try {
            for (const file of readdirSync(modPath)) {
                if (file.endsWith('.html') && !file.startsWith('TOOL-BLUEPRINT')) {
                    results.push(join(modPath, file));
                }
            }
        } catch (_) { /* not a directory */ }
    }
    return results;
}

for (const filePath of getToolFiles(TOOLS_DIR)) {
    const content = readFileSync(filePath, 'utf8');
    const relPath = relative(join(__dirname, '../..'), filePath);

    // Only check files that use BOTH isInteger guard and renderTransitionScreen
    if (!content.includes('Number.isInteger(step)') || !content.includes('renderTransitionScreen')) {
        continue;
    }

    // Extract the <script type="text/babel"> block
    const babelMatch = content.match(/<script\s+type="text\/babel"[^>]*>([\s\S]*?)<\/script>/);
    if (!babelMatch) continue;
    const jsx = babelMatch[1];
    const lines = jsx.split('\n');

    // Strategy: find every renderTransitionScreen call and check if it's
    // nested inside a Number.isInteger(step) JSX guard block.
    // We track brace depth from the isInteger guard opening.

    let insideIsIntegerBlock = false;
    let braceDepth = 0;
    let guardStartLine = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect opening of an isInteger-guarded JSX block
        // Pattern: {Number.isInteger(step) && ... && (
        if (!insideIsIntegerBlock && /Number\.isInteger\(step\)/.test(line) && /&&\s*\(?\s*$/.test(line.trim())) {
            insideIsIntegerBlock = true;
            braceDepth = 0;
            guardStartLine = i + 1;
            // Count opening parens/braces on this line
            for (const ch of line) {
                if (ch === '(' || ch === '{') braceDepth++;
                if (ch === ')' || ch === '}') braceDepth--;
            }
            continue;
        }

        if (insideIsIntegerBlock) {
            for (const ch of line) {
                if (ch === '(' || ch === '{') braceDepth++;
                if (ch === ')' || ch === '}') braceDepth--;
            }

            // Check if renderTransitionScreen is called inside this block
            if (/renderTransitionScreen\s*\(/.test(line)) {
                violations.push({
                    file: relPath,
                    line: i + 1,
                    guardLine: guardStartLine,
                    snippet: line.trim().substring(0, 100),
                });
            }

            // Block closed
            if (braceDepth <= 0) {
                insideIsIntegerBlock = false;
            }
        }
    }
}

// Report
console.log('╔══════════════════════════════════════════════╗');
console.log('║   TRANSITION SCREEN PLACEMENT CHECK         ║');
console.log('╚══════════════════════════════════════════════╝\n');

if (violations.length === 0) {
    console.log('✅ No transition screens found inside Number.isInteger(step) guards\n');
    process.exit(0);
} else {
    console.log(`❌ Found ${violations.length} transition screen(s) inside isInteger guards:\n`);
    for (const v of violations) {
        console.log(`  ${v.file}:${v.line}`);
        console.log(`    Guard block starts at line ${v.guardLine}`);
        console.log(`    → ${v.snippet}`);
        console.log(`    FIX: Move renderTransitionScreen OUTSIDE the Number.isInteger block\n`);
    }
    process.exit(1);
}
