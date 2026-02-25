/**
 * Add Inline Cognitive Load Components to All Tools
 *
 * Adds <FastTrackInsight>, <ScienceBox>, <WarningBox>, <ScienceBookmarkIcon>,
 * and <CaseStudy> components to each tool's form steps.
 *
 * Skips: WOOP (already done), Team (already done), team-v2 (not a tool)
 *
 * Usage: node scripts/add-inline-components.cjs
 */

var fs = require('fs');
var path = require('path');

var TOOLS_DIR = path.join(__dirname, '..', 'frontend', 'tools');

// Tool mapping: slug -> relative path from TOOLS_DIR
var TOOL_FILES = {
    'know-thyself': 'module-1-identity/01-know-thyself.html',
    'dream': 'module-1-identity/02-dream.html',
    'values': 'module-1-identity/03-values.html',
    'fit': 'module-1-identity/05-fit.html',
    'cash': 'module-2-performance/06-cash.html',
    'energy': 'module-2-performance/07-energy.html',
    'goals': 'module-2-performance/08-goals.html',
    'focus': 'module-2-performance/09-focus.html',
    'performance': 'module-2-performance/10-performance.html',
    'meeting-rhythm': 'module-2-performance/11-meeting-rhythm.html',
    'market-size': 'module-3-market/12-market-size.html',
    'segmentation': 'module-3-market/13-segmentation-target-market.html',
    'target-segment': 'module-4-strategy-development/14-target-segment-deep-dive.html',
    'value-proposition': 'module-4-strategy-development/15-value-proposition.html',
    'vp-testing': 'module-4-strategy-development/16-value-proposition-testing.html',
    'product-development': 'module-5-strategy-execution/17-product-development.html',
    'pricing': 'module-5-strategy-execution/18-pricing.html',
    'brand-marketing': 'module-5-strategy-execution/19-brand-marketing.html',
    'customer-service': 'module-5-strategy-execution/20-customer-service.html',
    'route-to-market': 'module-5-strategy-execution/21-route-to-market.html',
    'core-activities': 'module-6-org-structure/22-core-activities.html',
    'processes-decisions': 'module-6-org-structure/23-processes-decisions.html',
    'fit-abc': 'module-6-org-structure/24-fit-abc-analysis.html',
    'org-redesign': 'module-6-org-structure/25-org-redesign.html',
    'employer-branding': 'module-7-people-leadership/26-employer-branding.html',
    'agile-teams': 'module-7-people-leadership/27-agile-teams.html',
    'digitalization': 'module-8-tech-ai/28-digitalization.html',
    'digital-heart': 'module-8-tech-ai/29-digital-heart.html'
};

var TOOL_NAMES = {
    'know-thyself': 'Know Thyself',
    'dream': 'Dream',
    'values': 'Values',
    'fit': 'FIT Assessment',
    'cash': 'Cash Flow',
    'energy': 'Energy Management',
    'goals': 'Goals and Impact Matrix',
    'focus': 'Focus and Discipline',
    'performance': 'Performance Tracking',
    'meeting-rhythm': 'Meeting Rhythm',
    'market-size': 'Market Size Analysis',
    'segmentation': 'Market Segmentation',
    'target-segment': 'Target Segment Deep Dive',
    'value-proposition': 'Value Proposition',
    'vp-testing': 'Value Proposition Testing',
    'product-development': 'Product Development',
    'pricing': 'Pricing Strategy',
    'brand-marketing': 'Brand and Marketing',
    'customer-service': 'Customer Service',
    'route-to-market': 'Route to Market',
    'core-activities': 'Core Activities',
    'processes-decisions': 'Processes and Decisions',
    'fit-abc': 'FIT ABC Analysis',
    'org-redesign': 'Org Redesign',
    'employer-branding': 'Employer Branding',
    'agile-teams': 'Agile Teams',
    'digitalization': 'Digitalization',
    'digital-heart': 'Digital Heart'
};

var CASE_STUDIES = {
    'know-thyself': { before: '[PLACEHOLDER] CEO could not articulate personal values or purpose.', after: '[PLACEHOLDER] Clear identity statement, team understood the vision, decision-making speed doubled.', quote: '[PLACEHOLDER] Once I knew who I was, every business decision became clearer.' },
    'dream': { before: '[PLACEHOLDER] Company had no shared vision. Each department pulled in different directions.', after: '[PLACEHOLDER] One-sentence dream aligned all 50 employees. Revenue grew 40% in 12 months.', quote: '[PLACEHOLDER] When everyone knows the dream, they make decisions without waiting for the CEO.' },
    'values': { before: '[PLACEHOLDER] Company had 12 generic values nobody remembered.', after: '[PLACEHOLDER] 3 sharp values that drove hiring, firing, and promotion decisions.', quote: '[PLACEHOLDER] Our values became our operating system.' },
    'fit': { before: '[PLACEHOLDER] 40% of team members were in wrong roles.', after: '[PLACEHOLDER] Strategic role changes led to 30% productivity increase.', quote: '[PLACEHOLDER] FIT showed us our best people were being wasted in wrong positions.' },
    'cash': { before: '[PLACEHOLDER] Company was profitable on paper but constantly cash-strapped.', after: '[PLACEHOLDER] Cash conversion cycle reduced by 15 days.', quote: '[PLACEHOLDER] Understanding the Power of One changed everything.' },
    'energy': { before: '[PLACEHOLDER] CEO working 70-hour weeks, constant fatigue.', after: '[PLACEHOLDER] 50-hour weeks with 2x the output.', quote: '[PLACEHOLDER] I realized I was the bottleneck because I was exhausted.' },
    'goals': { before: '[PLACEHOLDER] 47 goals across the company.', after: '[PLACEHOLDER] 3 company OKRs. Goal completion rate jumped from 20% to 75%.', quote: '[PLACEHOLDER] Fewer goals meant better goals.' },
    'focus': { before: '[PLACEHOLDER] CEO responded to every email within 5 minutes.', after: '[PLACEHOLDER] Daily plan with 3 priorities. Strategic thinking time doubled.', quote: '[PLACEHOLDER] The Empty Brain exercise freed up mental bandwidth.' },
    'performance': { before: '[PLACEHOLDER] Performance reviews happened annually.', after: '[PLACEHOLDER] Weekly 15-minute check-ins. Problems caught within days.', quote: '[PLACEHOLDER] The accountability framework removed emotion from difficult conversations.' },
    'meeting-rhythm': { before: '[PLACEHOLDER] 25 hours/week in meetings. Most had no agenda.', after: '[PLACEHOLDER] 8 hours/week, all with clear outcomes and owners.', quote: '[PLACEHOLDER] The meeting rhythm gave us back 17 hours per week.' },
    'market-size': { before: '[PLACEHOLDER] Company assumed their market was huge. No data.', after: '[PLACEHOLDER] Rigorous TAM-SAM-SOM analysis. Strategy refocused.', quote: '[PLACEHOLDER] The market size reality check saved us from a disastrous expansion.' },
    'segmentation': { before: '[PLACEHOLDER] Company targeted everyone. Marketing was generic.', after: '[PLACEHOLDER] 3 clear segments identified. CAC dropped 40%.', quote: '[PLACEHOLDER] We became essential to someone.' },
    'target-segment': { before: '[PLACEHOLDER] Product roadmap based on assumptions.', after: '[PLACEHOLDER] Deep customer interviews revealed 3 unmet needs.', quote: '[PLACEHOLDER] We thought we knew our customers. We were wrong.' },
    'value-proposition': { before: '[PLACEHOLDER] Sales pitch was a 20-slide feature deck. Close rate: 15%.', after: '[PLACEHOLDER] One-sentence VP. Close rate jumped to 35%.', quote: '[PLACEHOLDER] We stopped selling features and started selling outcomes.' },
    'vp-testing': { before: '[PLACEHOLDER] Launched based on internal assumptions. Minimal uptake.', after: '[PLACEHOLDER] Tested with 20 target customers. 14 showed purchase intent.', quote: '[PLACEHOLDER] Testing saved us from building something nobody wanted.' },
    'product-development': { before: '[PLACEHOLDER] 18-month development cycle. Features nobody used.', after: '[PLACEHOLDER] 90-day MVP cycles. Customer feedback integrated weekly.', quote: '[PLACEHOLDER] We started asking what customers would pay for.' },
    'pricing': { before: '[PLACEHOLDER] Pricing based on cost + margin. Leaving money on the table.', after: '[PLACEHOLDER] Value-based pricing increased deal size by 30%.', quote: '[PLACEHOLDER] We were undercharging because we priced our costs, not our value.' },
    'brand-marketing': { before: '[PLACEHOLDER] Big marketing spend, no clear message.', after: '[PLACEHOLDER] Brand aligned to VP. Lead quality improved 3x.', quote: '[PLACEHOLDER] When the brand matched reality, customers started coming to us.' },
    'customer-service': { before: '[PLACEHOLDER] Complaints handled reactively. NPS: 15.', after: '[PLACEHOLDER] Proactive service design. NPS jumped to 65.', quote: '[PLACEHOLDER] We redesigned service around moments that matter.' },
    'route-to-market': { before: '[PLACEHOLDER] Single-channel dependency. One distributor, 80% of revenue.', after: '[PLACEHOLDER] 3-channel strategy. Revenue grew 25% from new channels.', quote: '[PLACEHOLDER] Diversifying routes to market was the best strategic decision.' },
    'core-activities': { before: '[PLACEHOLDER] 47 activities listed. No clarity on which mattered.', after: '[PLACEHOLDER] 12 core activities. Resources reallocated to highest-value work.', quote: '[PLACEHOLDER] We found 35% of our work was waste.' },
    'processes-decisions': { before: '[PLACEHOLDER] All decisions funneled through CEO.', after: '[PLACEHOLDER] Decision framework delegated 80% of decisions.', quote: '[PLACEHOLDER] The framework freed me from being the bottleneck.' },
    'fit-abc': { before: '[PLACEHOLDER] Mixed performance, no clear standard.', after: '[PLACEHOLDER] ABC analysis led to role changes. Productivity increased 45%.', quote: '[PLACEHOLDER] The ABC analysis was painful but necessary.' },
    'org-redesign': { before: '[PLACEHOLDER] Org chart unchanged in 5 years despite 3x growth.', after: '[PLACEHOLDER] Restructured around value streams. Decision speed doubled.', quote: '[PLACEHOLDER] Our org was designed for where we were, not where we were going.' },
    'employer-branding': { before: '[PLACEHOLDER] 6-month average time to hire.', after: '[PLACEHOLDER] Time-to-hire reduced to 6 weeks. A-player acceptance: 85%.', quote: '[PLACEHOLDER] The right people started finding us.' },
    'agile-teams': { before: '[PLACEHOLDER] Waterfall. 12-month delivery cycles.', after: '[PLACEHOLDER] 2-week sprints. Customer feedback loop in days.', quote: '[PLACEHOLDER] Agile teams delivered the right things, not just faster.' },
    'digitalization': { before: '[PLACEHOLDER] Digital tools nobody used. Data in disconnected systems.', after: '[PLACEHOLDER] Strategic digitalization roadmap. ROI in 6 months.', quote: '[PLACEHOLDER] We started solving problems with technology.' },
    'digital-heart': { before: '[PLACEHOLDER] Data in multiple systems. No single source of truth.', after: '[PLACEHOLDER] Unified data lake. Real-time dashboards for every KPI.', quote: '[PLACEHOLDER] The data lake revealed insights we never had.' }
};

// --- Content generators (all placeholder) ---

function getInsightText(toolName, sectionNum) {
    var texts = [
        '[PLACEHOLDER] Fast Track Principle for ' + toolName + ': This foundational step drives 80% of results. Leaders who invest proper time here see the biggest transformation in their organization.',
        '[PLACEHOLDER] Fast Track Insight: The second phase of ' + toolName + ' is where most leaders see breakthroughs. Be specific and brutally honest in your answers here.',
        '[PLACEHOLDER] Fast Track Advanced: This ' + toolName + ' step connects your work to the broader strategy. Look for patterns across your previous answers.',
        '[PLACEHOLDER] Fast Track Integration: At this stage of ' + toolName + ', synthesis matters most. Your outputs should connect to at least 2 other Fast Track tools.',
        '[PLACEHOLDER] Fast Track Completion: The final step ties everything together. Review your ' + toolName + ' work holistically before moving on.'
    ];
    return texts[Math.min(sectionNum - 1, texts.length - 1)];
}

function getScienceText(toolName, sectionNum) {
    var texts = [
        '[PLACEHOLDER] Research from organizational psychology shows that structured ' + toolName.toLowerCase() + ' frameworks improve decision quality by 25-40% compared to unstructured approaches (Harvard Business Review, 2023). Writing responses down activates deeper cognitive processing than thinking alone.',
        '[PLACEHOLDER] Behavioral science research indicates that teams using systematic ' + toolName.toLowerCase() + ' processes make decisions 2.5x faster with 30% fewer errors (McKinsey, 2022). The structure reduces cognitive bias and forces comprehensive thinking.',
        '[PLACEHOLDER] Meta-analysis of 200+ organizations shows that completing structured exercises like this correlates with 35% higher strategic execution rates (Deloitte, 2023). Written commitments create psychological accountability.',
        '[PLACEHOLDER] Longitudinal studies demonstrate that organizations revisiting their ' + toolName.toLowerCase() + ' outputs quarterly maintain 60% higher alignment scores (BCG, 2023). Regular review prevents strategic drift.',
        '[PLACEHOLDER] Cross-industry research confirms that structured frameworks reduce implementation time by 40% while improving quality of outcomes across all organizational levels (Bain, 2023).'
    ];
    return texts[Math.min(sectionNum - 1, texts.length - 1)];
}

function getWarningText(toolName) {
    return '[PLACEHOLDER] Common mistake in ' + toolName + ': Leaders often rush through this with surface-level answers. <strong>Bad:</strong> Generic responses completed in under 5 minutes. <strong>Good:</strong> Specific, honest answers that require real thought and sometimes discomfort.';
}

function getBookmarkText(toolName) {
    return '[PLACEHOLDER] Research backs this: Studies show that structured reflection on this aspect of ' + toolName.toLowerCase() + ' leads to significantly better outcomes than intuitive approaches alone.';
}

// --- Filtering ---

function shouldProcessSection(line) {
    // Skip compact overview items: have inline style with marginBottom (digital-heart compact items)
    if (line.indexOf('marginBottom') > -1 && line.indexOf('style={{') > -1) {
        return false;
    }
    // Skip compact items: have inline fontSize style, single-line, no margin class
    if (line.indexOf('style={{') > -1 && line.indexOf('fontSize') > -1 &&
        line.indexOf('mb-4') === -1 && line.indexOf('mb-6') === -1 && line.indexOf('mb-8') === -1 &&
        line.indexOf('</div>') > -1) {
        return false;
    }
    return true;
}

// --- Insertion helpers ---

function addCogLoadBlock(result, indent, sectionCount, toolName) {
    result.push('');
    result.push(indent + '{/* Fast Track Insight */}');
    result.push(indent + '<FastTrackInsight>');
    result.push(indent + '    ' + getInsightText(toolName, sectionCount));
    result.push(indent + '</FastTrackInsight>');
    result.push('');
    result.push(indent + '{/* The Science */}');
    result.push(indent + '<ScienceBox collapsible={true}>');
    result.push(indent + '    ' + getScienceText(toolName, sectionCount));
    result.push(indent + '</ScienceBox>');

    if (sectionCount === 1) {
        result.push('');
        result.push(indent + '{/* Common Mistake */}');
        result.push(indent + '<WarningBox>');
        result.push(indent + '    ' + getWarningText(toolName));
        result.push(indent + '</WarningBox>');
    }
    result.push('');
}

function addCaseStudy(result, indent, cs) {
    result.push('');
    result.push(indent + '{/* Case Study */}');
    result.push(indent + '<CaseStudy');
    result.push(indent + '    before={"' + cs.before.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"}');
    result.push(indent + '    after={"' + cs.after.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"}');
    result.push(indent + '    quote={"' + cs.quote.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"}');
    result.push(indent + '/>');
}

function addBookmark(result, indent, toolName) {
    result.push(indent + '<ScienceBookmarkIcon>');
    result.push(indent + '    ' + getBookmarkText(toolName));
    result.push(indent + '</ScienceBookmarkIcon>');
}

// --- Main processing ---

var MAX_SECTIONS = 5;
var MAX_BOOKMARKS = 3;

function processFile(slug) {
    var relPath = TOOL_FILES[slug];
    var filePath = path.join(TOOLS_DIR, relPath);
    var toolName = TOOL_NAMES[slug];

    if (!fs.existsSync(filePath)) {
        console.log('  FILE NOT FOUND: ' + slug + ' (' + relPath + ')');
        return false;
    }

    var content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has inline components
    if (content.indexOf('<FastTrackInsight>') > -1) {
        console.log('  SKIP (already has inline): ' + slug);
        return false;
    }

    var lines = content.split('\n');

    // === Pre-scan: find submit area for CaseStudy placement ===
    var submitLineIdx = -1;

    // Look for last SUBMIT button text or handleSubmit onClick
    for (var i = lines.length - 1; i >= 0; i--) {
        var trimmed = lines[i].trim();
        if (trimmed === 'SUBMIT TO FAST TRACK' ||
            trimmed === 'SUBMIT' ||
            (lines[i].indexOf('handleSubmit') > -1 && lines[i].indexOf('onClick') > -1)) {
            submitLineIdx = i;
            break;
        }
    }

    // Fallback: look for last Export PDF button
    if (submitLineIdx === -1) {
        for (var i = lines.length - 1; i >= 0; i--) {
            if (lines[i].indexOf('Export PDF') > -1 &&
                lines[i].indexOf('//') === -1 &&
                lines[i].indexOf('textContent') === -1 &&
                lines[i].indexOf('console') === -1) {
                submitLineIdx = i;
                break;
            }
        }
    }

    // Find CaseStudy insertion point: first standalone </div> after submit
    var caseStudyIdx = -1;
    if (submitLineIdx > -1) {
        for (var j = submitLineIdx + 1; j < lines.length; j++) {
            var t = lines[j].trim();
            if (t === '</div>' || t === '</div>,') {
                caseStudyIdx = j;
                break;
            }
        }
    }

    // === Main pass: line-by-line processing ===
    var result = [];
    var sectionCount = 0;
    var labelCount = 0;
    var pastIntro = false;
    var pastResults = false;

    // State for multi-line numbered-section divs
    var pendingSection = null; // { num, depth }

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        // Track if we are past the results/submit area
        if (caseStudyIdx > -1 && i > caseStudyIdx) {
            pastResults = true;
        }

        // Push the current line
        result.push(line);

        // === CaseStudy insertion ===
        if (i === caseStudyIdx) {
            var cs = CASE_STUDIES[slug];
            if (cs) {
                var csIndent = line.match(/^(\s*)/)[1];
                addCaseStudy(result, csIndent, cs);
            }
        }

        // === Handle pending multi-line numbered-section ===
        if (pendingSection !== null) {
            // Count div opens and closes on this line
            var opens = (line.match(/<div/g) || []).length;
            var closes = (line.match(/<\/div>/g) || []).length;
            pendingSection.depth += opens - closes;

            if (pendingSection.depth <= 0) {
                // Found the closing div of the numbered-section
                var indent = line.match(/^(\s*)/)[1];
                addCogLoadBlock(result, indent, pendingSection.num, toolName);
                pendingSection = null;
            }
            continue; // Skip other checks while tracking multi-line section
        }

        // === Detect numbered-section divs ===
        if (line.indexOf('className="numbered-section') > -1 ||
            line.indexOf("className='numbered-section") > -1) {

            // Filter: skip compact overview items
            if (!shouldProcessSection(line)) continue;

            // Cap at MAX_SECTIONS
            if (sectionCount >= MAX_SECTIONS) continue;

            // Skip sections in results/canvas area
            if (pastResults) continue;

            sectionCount++;
            pastIntro = true;

            // Check if single-line (opening and closing on same line)
            var divOpens = (line.match(/<div/g) || []).length;
            var divCloses = (line.match(/<\/div>/g) || []).length;
            var depth = divOpens - divCloses;

            if (depth <= 0) {
                // Single-line: insert after this line
                var indent = line.match(/^(\s*)/)[1];
                addCogLoadBlock(result, indent, sectionCount, toolName);
            } else {
                // Multi-line: wait for closing div
                pendingSection = { num: sectionCount, depth: depth };
            }
        }

        // === ScienceBookmarkIcon after labels ===
        if (labelCount < MAX_BOOKMARKS && pastIntro && !pastResults &&
            line.indexOf('<label') > -1 && line.indexOf('className=') > -1 &&
            line.indexOf('</label>') > -1 &&
            (line.indexOf('font-bold') > -1 || line.indexOf('monument') > -1)) {
            labelCount++;
            var indent = line.match(/^(\s*)/)[1];
            addBookmark(result, indent, toolName);
        }

        // Also catch multi-line labels: if we see </label> on its own line
        // and the previous line had a label with font-bold/monument
        if (labelCount < MAX_BOOKMARKS && pastIntro && !pastResults &&
            line.trim() === '</label>' && i > 0) {
            // Check if a recent line (within 3 lines back) had the opening <label with font-bold
            for (var k = Math.max(0, i - 3); k < i; k++) {
                if (lines[k].indexOf('<label') > -1 && lines[k].indexOf('className=') > -1 &&
                    (lines[k].indexOf('font-bold') > -1 || lines[k].indexOf('monument') > -1)) {
                    labelCount++;
                    var indent = line.match(/^(\s*)/)[1];
                    addBookmark(result, indent, toolName);
                    break;
                }
            }
        }
    }

    content = result.join('\n');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  DONE: ' + slug + ' (sections: ' + sectionCount + ', bookmarks: ' + labelCount + ', caseStudy: ' + (caseStudyIdx > -1) + ')');
    return true;
}

// === Run ===
console.log('=== Add Inline Cognitive Load Components ===\n');

var processed = 0;
var slugs = Object.keys(TOOL_FILES);
slugs.forEach(function(slug) {
    if (processFile(slug)) processed++;
});

console.log('\nProcessed: ' + processed + ' / ' + slugs.length + ' files');
console.log('Done.');
