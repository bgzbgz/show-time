/**
 * check-global-init-guards.js
 *
 * Detects unguarded calls to shared init functions (CognitiveLoad.init,
 * ToolDB.init, ToolAccessControl.init) that can crash the entire tool
 * if the shared script returns a 503 or fails to load.
 *
 * Pattern caught:
 *   CognitiveLoad.init(...)       ← crashes if cognitive-load.js fails to load
 *
 * Required pattern:
 *   window.CognitiveLoad && CognitiveLoad.init(...)
 *   if (window.CognitiveLoad) CognitiveLoad.init(...)
 *
 * Note: ToolDB.init and ToolAccessControl.init are NOT flagged because
 * without them the tool is completely non-functional regardless — no
 * defensive guard makes sense there.
 */

import { readFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fs = { readFileSync, readdirSync };
const path = { join, relative };

const TOOLS_DIR = path.join(__dirname, '../../frontend/tools');

// Each entry: { pattern, guardPattern, name }
// A line is a violation if it matches `pattern` but NOT `guardPattern`
const RULES = [
    {
        name: 'CognitiveLoad.init unguarded',
        // Matches any call to CognitiveLoad.init(
        pattern: /CognitiveLoad\.init\(/,
        // The guard: the same line must contain window.CognitiveLoad
        guardPattern: /window\.CognitiveLoad/,
        suggestion: 'Use: window.CognitiveLoad && CognitiveLoad.init(...)',
    },
];

function walkHtml(dir) {
    const results = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) results.push(...walkHtml(full));
        else if (entry.name.endsWith('.html') && entry.name !== 'TOOL-BLUEPRINT.html') results.push(full);
    }
    return results;
}

function extractBabelScript(html) {
    // Extract content of <script type="text/babel"> ... </script>
    const match = html.match(/<script\s+type="text\/babel"[^>]*>([\s\S]*?)<\/script>/i);
    return match ? match[1] : '';
}

let failures = 0;

for (const file of walkHtml(TOOLS_DIR)) {
    const html = readFileSync(file, 'utf8');
    const script = extractBabelScript(html);
    if (!script) continue;

    const lines = script.split('\n');
    const relPath = relative(join(__dirname, '../..'), file);

    for (const rule of RULES) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (rule.pattern.test(line) && !rule.guardPattern.test(line)) {
                console.error(`FAIL [${rule.name}] ${relPath}:${i + 1}`);
                console.error(`     Line: ${line.trim()}`);
                console.error(`     Fix:  ${rule.suggestion}`);
                console.error('');
                failures++;
            }
        }
    }
}

if (failures === 0) {
    const allFiles = walkHtml(TOOLS_DIR);
    console.log(`✓ Global init guard check passed (${allFiles.length} files checked)`);
    process.exit(0);
} else {
    console.error(`✗ ${failures} unguarded init call(s) found.`);
    console.error('  If a shared script returns 503 (cold start), unguarded calls crash the entire tool.');
    process.exit(1);
}
