/**
 * Fix CaseStudy placement for 9 tools that were missed by the main script.
 * Each tool has a unique submit pattern that the main script didn't catch.
 *
 * Usage: node scripts/fix-casestudy.cjs
 */

var fs = require('fs');
var path = require('path');

var TOOLS_DIR = path.join(__dirname, '..', 'frontend', 'tools');

var CASE_STUDIES = {
    'dream': { before: '[PLACEHOLDER] Company had no shared vision. Each department pulled in different directions.', after: '[PLACEHOLDER] One-sentence dream aligned all 50 employees. Revenue grew 40% in 12 months.', quote: '[PLACEHOLDER] When everyone knows the dream, they make decisions without waiting for the CEO.' },
    'focus': { before: '[PLACEHOLDER] CEO responded to every email within 5 minutes.', after: '[PLACEHOLDER] Daily plan with 3 priorities. Strategic thinking time doubled.', quote: '[PLACEHOLDER] The Empty Brain exercise freed up mental bandwidth.' },
    'performance': { before: '[PLACEHOLDER] Performance reviews happened annually.', after: '[PLACEHOLDER] Weekly 15-minute check-ins. Problems caught within days.', quote: '[PLACEHOLDER] The accountability framework removed emotion from difficult conversations.' },
    'product-development': { before: '[PLACEHOLDER] 18-month development cycle. Features nobody used.', after: '[PLACEHOLDER] 90-day MVP cycles. Customer feedback integrated weekly.', quote: '[PLACEHOLDER] We started asking what customers would pay for.' },
    'core-activities': { before: '[PLACEHOLDER] 47 activities listed. No clarity on which mattered.', after: '[PLACEHOLDER] 12 core activities. Resources reallocated to highest-value work.', quote: '[PLACEHOLDER] We found 35% of our work was waste.' },
    'org-redesign': { before: '[PLACEHOLDER] Org chart unchanged in 5 years despite 3x growth.', after: '[PLACEHOLDER] Restructured around value streams. Decision speed doubled.', quote: '[PLACEHOLDER] Our org was designed for where we were, not where we were going.' },
    'employer-branding': { before: '[PLACEHOLDER] 6-month average time to hire.', after: '[PLACEHOLDER] Time-to-hire reduced to 6 weeks. A-player acceptance: 85%.', quote: '[PLACEHOLDER] The right people started finding us.' },
    'agile-teams': { before: '[PLACEHOLDER] Waterfall. 12-month delivery cycles.', after: '[PLACEHOLDER] 2-week sprints. Customer feedback loop in days.', quote: '[PLACEHOLDER] Agile teams delivered the right things, not just faster.' },
    'digitalization': { before: '[PLACEHOLDER] Digital tools nobody used. Data in disconnected systems.', after: '[PLACEHOLDER] Strategic digitalization roadmap. ROI in 6 months.', quote: '[PLACEHOLDER] We started solving problems with technology.' }
};

// Each tool has a unique anchor pattern to find the submit/results area
var TOOL_ANCHORS = {
    'dream': {
        file: 'module-1-identity/02-dream.html',
        // onClick={onSubmit} around line 2071
        pattern: 'onClick={onSubmit}',
        searchFromEnd: true
    },
    'focus': {
        file: 'module-2-performance/09-focus.html',
        // onClick={exportPDF} around line 1559
        pattern: 'EXPORT PDF',
        searchFromEnd: true
    },
    'performance': {
        file: 'module-2-performance/10-performance.html',
        // onClick={exportPDF} around line 1332
        pattern: 'EXPORT PDF',
        searchFromEnd: true
    },
    'product-development': {
        file: 'module-5-strategy-execution/17-product-development.html',
        // onClick={onSubmit} with text "SUBMIT" around line 1536
        pattern: 'onSubmit}',
        searchFromEnd: true
    },
    'core-activities': {
        file: 'module-6-org-structure/22-core-activities.html',
        // onClick={sendToWebhook} around line 481
        pattern: 'sendToWebhook',
        searchFromEnd: true
    },
    'org-redesign': {
        file: 'module-6-org-structure/25-org-redesign.html',
        // onClick={onSubmit} with text "SUBMIT ORGANIZATIONAL REDESIGN" around line 2917
        pattern: 'SUBMIT ORGANIZATIONAL REDESIGN',
        searchFromEnd: true
    },
    'employer-branding': {
        file: 'module-7-people-leadership/26-employer-branding.html',
        // No visible submit button - look for last Export or the end of last renderStep
        pattern: 'EXPORT TO PDF',
        searchFromEnd: true,
        fallback: 'renderStep'
    },
    'agile-teams': {
        file: 'module-7-people-leadership/27-agile-teams.html',
        // No visible submit button
        pattern: 'EXPORT TO PDF',
        searchFromEnd: true,
        fallback: 'renderStep'
    },
    'digitalization': {
        file: 'module-8-tech-ai/28-digitalization.html',
        // onClick={onExport} with EXPORT TO PDF
        pattern: 'EXPORT TO PDF',
        searchFromEnd: true
    }
};

function insertCaseStudy(content, anchorInfo, cs) {
    var lines = content.split('\n');
    var anchorIdx = -1;

    // Search from end for the last occurrence of the pattern
    for (var i = lines.length - 1; i >= 0; i--) {
        if (lines[i].indexOf(anchorInfo.pattern) > -1 &&
            lines[i].indexOf('//') === -1 &&
            lines[i].indexOf('console') === -1 &&
            lines[i].indexOf('const ') === -1 &&
            lines[i].indexOf('var ') === -1 &&
            lines[i].indexOf('function ') === -1) {
            anchorIdx = i;
            break;
        }
    }

    // Fallback pattern if primary not found
    if (anchorIdx === -1 && anchorInfo.fallback) {
        for (var i = lines.length - 1; i >= 0; i--) {
            if (lines[i].indexOf(anchorInfo.fallback) > -1) {
                anchorIdx = i;
                break;
            }
        }
    }

    if (anchorIdx === -1) {
        return null; // Could not find anchor
    }

    // Find the next </div> after the anchor (closing the button container)
    var insertIdx = -1;
    for (var j = anchorIdx + 1; j < Math.min(anchorIdx + 20, lines.length); j++) {
        var trimmed = lines[j].trim();
        if (trimmed === '</div>' || trimmed === '</div>,' || trimmed === '</div>)' ||
            trimmed === '</div>);' || trimmed === '</div>}') {
            insertIdx = j;
            break;
        }
    }

    // If no standalone </div> found, try the line right after the button closes
    if (insertIdx === -1) {
        for (var j = anchorIdx; j < Math.min(anchorIdx + 10, lines.length); j++) {
            if (lines[j].indexOf('</button>') > -1) {
                // Look for next </div>
                for (var k = j + 1; k < Math.min(j + 10, lines.length); k++) {
                    if (lines[k].indexOf('</div>') > -1) {
                        insertIdx = k;
                        break;
                    }
                }
                break;
            }
        }
    }

    if (insertIdx === -1) {
        // Last resort: insert right after the anchor line
        insertIdx = anchorIdx;
    }

    var indent = lines[insertIdx].match(/^(\s*)/)[1];

    var csLines = [
        '',
        indent + '{/* Case Study */}',
        indent + '<CaseStudy',
        indent + '    before={"' + cs.before.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"}',
        indent + '    after={"' + cs.after.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"}',
        indent + '    quote={"' + cs.quote.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"}',
        indent + '/>'
    ];

    // Insert after the target line
    lines.splice(insertIdx + 1, 0, csLines.join('\n'));
    return lines.join('\n');
}

// === Run ===
console.log('=== Fix CaseStudy Placement ===\n');

var fixed = 0;
var slugs = Object.keys(TOOL_ANCHORS);

slugs.forEach(function(slug) {
    var info = TOOL_ANCHORS[slug];
    var filePath = path.join(TOOLS_DIR, info.file);

    if (!fs.existsSync(filePath)) {
        console.log('  NOT FOUND: ' + slug);
        return;
    }

    var content = fs.readFileSync(filePath, 'utf8');

    // Check if CaseStudy already exists
    if (content.indexOf('<CaseStudy') > -1) {
        console.log('  SKIP (already has CaseStudy): ' + slug);
        return;
    }

    var result = insertCaseStudy(content, info, CASE_STUDIES[slug]);
    if (result) {
        fs.writeFileSync(filePath, result, 'utf8');
        console.log('  FIXED: ' + slug);
        fixed++;
    } else {
        console.log('  FAILED (no anchor found): ' + slug);
    }
});

console.log('\nFixed: ' + fixed + ' / ' + slugs.length + ' files');
