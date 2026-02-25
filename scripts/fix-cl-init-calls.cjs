/**
 * Fix Script: Update CognitiveLoad.init() calls to include config with insights/caseStudy
 * and remove the unused CognitiveLoadDrawer function definitions.
 *
 * Usage: node scripts/fix-cl-init-calls.cjs
 */

const fs = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '..', 'frontend', 'tools');

// Same tool content as the rollout script
const TOOL_CONTENT = {
    "know-thyself": {
        insights: ["Self-awareness is the foundation of leadership. You cannot lead others until you understand yourself.", "The 80/20 rule: 80% of your leadership effectiveness comes from understanding your personal values and strengths."],
        caseStudy: { before: "[PLACEHOLDER] CEO could not articulate personal values or purpose.", after: "[PLACEHOLDER] Clear identity statement, team understood the vision, decision-making speed doubled.", quote: "[PLACEHOLDER] Once I knew who I was, every business decision became clearer." }
    },
    "dream": {
        insights: ["A company without a dream is just a job. Dreams create energy and alignment across the entire organization.", "Your dream must be specific enough to measure but inspiring enough to energize."],
        caseStudy: { before: "[PLACEHOLDER] Company had no shared vision. Each department pulled in different directions.", after: "[PLACEHOLDER] One-sentence dream aligned all 50 employees. Revenue grew 40% in 12 months.", quote: "[PLACEHOLDER] When everyone knows the dream, they make decisions without waiting for the CEO." }
    },
    "values": {
        insights: ["Values are not aspirational - they describe who you actually are.", "Fast Track way: 3-5 values maximum. More than 5 means you have not made hard choices."],
        caseStudy: { before: "[PLACEHOLDER] Company had 12 generic values nobody remembered.", after: "[PLACEHOLDER] 3 sharp values that drove hiring, firing, and promotion decisions.", quote: "[PLACEHOLDER] Our values became our operating system." }
    },
    "team": {
        insights: ["A team is only as strong as its weakest dysfunction. Identify and address the top 3.", "Accountability without trust is tyranny. Trust without accountability is negligence."],
        caseStudy: { before: "[PLACEHOLDER] Team meetings were polite but unproductive.", after: "[PLACEHOLDER] Dysfunction scores improved from 3/10 to 7/10.", quote: "[PLACEHOLDER] The dysfunction assessment was uncomfortable but transformative." }
    },
    "fit": {
        insights: ["FIT forces honest conversations about whether people are in the right roles.", "A-players in wrong seats destroy more value than B-players in right seats."],
        caseStudy: { before: "[PLACEHOLDER] 40% of team members were in wrong roles.", after: "[PLACEHOLDER] Strategic role changes led to 30% productivity increase.", quote: "[PLACEHOLDER] FIT showed us our best people were being wasted in wrong positions." }
    },
    "cash": {
        insights: ["Revenue is vanity, profit is sanity, cash is king.", "The Power of One: improving just one cash lever by 1% can dramatically impact your cash position."],
        caseStudy: { before: "[PLACEHOLDER] Company was profitable on paper but constantly cash-strapped.", after: "[PLACEHOLDER] Cash conversion cycle reduced by 15 days.", quote: "[PLACEHOLDER] Understanding the Power of One changed everything." }
    },
    "energy": {
        insights: ["Energy management beats time management. A focused hour beats a distracted day.", "CEO energy is contagious. If you are depleted, your organization feels it."],
        caseStudy: { before: "[PLACEHOLDER] CEO working 70-hour weeks, constant fatigue.", after: "[PLACEHOLDER] 50-hour weeks with 2x the output.", quote: "[PLACEHOLDER] I realized I was the bottleneck because I was exhausted." }
    },
    "goals": {
        insights: ["Goals without alignment are chaos. Every goal must connect to the dream.", "OKRs work because they create transparency and focus. Maximum 3-5 objectives per quarter."],
        caseStudy: { before: "[PLACEHOLDER] 47 goals across the company.", after: "[PLACEHOLDER] 3 company OKRs. Goal completion rate jumped from 20% to 75%.", quote: "[PLACEHOLDER] Fewer goals meant better goals." }
    },
    "focus": {
        insights: ["Multitasking is a lie. Each task switch costs 23 minutes of refocus time.", "The Impact/Easy Matrix is the single most powerful prioritization tool."],
        caseStudy: { before: "[PLACEHOLDER] CEO responded to every email within 5 minutes.", after: "[PLACEHOLDER] Daily plan with 3 priorities. Strategic thinking time doubled.", quote: "[PLACEHOLDER] The Empty Brain exercise freed up mental bandwidth." }
    },
    "performance": {
        insights: ["What gets measured gets managed. But only measure what truly matters.", "The 5 Whys technique reveals root causes that symptoms analysis misses."],
        caseStudy: { before: "[PLACEHOLDER] Performance reviews happened annually.", after: "[PLACEHOLDER] Weekly 15-minute check-ins. Problems caught within days.", quote: "[PLACEHOLDER] The accountability framework removed emotion from difficult conversations." }
    },
    "meeting-rhythm": {
        insights: ["Bad meetings are the #1 productivity killer. A good rhythm eliminates 80% of ad-hoc meetings.", "Daily huddles (15 min), weekly tacticals (60 min), monthly strategics (half day)."],
        caseStudy: { before: "[PLACEHOLDER] 25 hours/week in meetings. Most had no agenda.", after: "[PLACEHOLDER] 8 hours/week, all with clear outcomes and owners.", quote: "[PLACEHOLDER] The meeting rhythm gave us back 17 hours per week." }
    },
    "market-size": {
        insights: ["TAM-SAM-SOM determines whether your dream is even possible.", "Most companies overestimate TAM and underestimate effort to capture SAM."],
        caseStudy: { before: "[PLACEHOLDER] Company assumed their market was huge. No data.", after: "[PLACEHOLDER] Rigorous TAM-SAM-SOM analysis. Strategy refocused.", quote: "[PLACEHOLDER] The market size reality check saved us from a disastrous expansion." }
    },
    "segmentation": {
        insights: ["Trying to serve everyone means serving no one well.", "The best segments are underserved, accessible, and profitable."],
        caseStudy: { before: "[PLACEHOLDER] Company targeted everyone. Marketing was generic.", after: "[PLACEHOLDER] 3 clear segments identified. CAC dropped 40%.", quote: "[PLACEHOLDER] We became essential to someone." }
    },
    "target-segment": {
        insights: ["You cannot create value for customers you do not deeply understand.", "Jobs-to-be-done thinking reveals what customers actually need."],
        caseStudy: { before: "[PLACEHOLDER] Product roadmap based on assumptions.", after: "[PLACEHOLDER] Deep customer interviews revealed 3 unmet needs.", quote: "[PLACEHOLDER] We thought we knew our customers. We were wrong." }
    },
    "value-proposition": {
        insights: ["Your value proposition is not your product features. It is the transformation you create.", "If you cannot state your VP in one sentence, it is not clear enough."],
        caseStudy: { before: "[PLACEHOLDER] Sales pitch was a 20-slide feature deck. Close rate: 15%.", after: "[PLACEHOLDER] One-sentence VP. Close rate jumped to 35%.", quote: "[PLACEHOLDER] We stopped selling features and started selling outcomes." }
    },
    "vp-testing": {
        insights: ["An untested value proposition is just a hypothesis.", "Real validation requires real customers and real commitment signals."],
        caseStudy: { before: "[PLACEHOLDER] Launched based on internal assumptions. Minimal uptake.", after: "[PLACEHOLDER] Tested with 20 target customers. 14 showed purchase intent.", quote: "[PLACEHOLDER] Testing saved us from building something nobody wanted." }
    },
    "product-development": {
        insights: ["Build the minimum viable product, not the maximum imagined product.", "WTP analysis before development prevents building unprofitable products."],
        caseStudy: { before: "[PLACEHOLDER] 18-month development cycle. Features nobody used.", after: "[PLACEHOLDER] 90-day MVP cycles. Customer feedback integrated weekly.", quote: "[PLACEHOLDER] We started asking what customers would pay for." }
    },
    "pricing": {
        insights: ["Pricing is the most powerful profit lever. A 1% price increase drives ~11% profit increase.", "Value-based pricing beats cost-plus pricing every time."],
        caseStudy: { before: "[PLACEHOLDER] Pricing based on cost + margin. Leaving money on the table.", after: "[PLACEHOLDER] Value-based pricing increased deal size by 30%.", quote: "[PLACEHOLDER] We were undercharging because we priced our costs, not our value." }
    },
    "brand-marketing": {
        insights: ["Brand is not your logo. It is the promise you make and consistently keep.", "Marketing without strategy is just noise."],
        caseStudy: { before: "[PLACEHOLDER] Big marketing spend, no clear message.", after: "[PLACEHOLDER] Brand aligned to VP. Lead quality improved 3x.", quote: "[PLACEHOLDER] When the brand matched reality, customers started coming to us." }
    },
    "customer-service": {
        insights: ["Customer service is not a cost center - it is your retention and growth engine.", "One delighted customer tells 3 people. One angry customer tells 11."],
        caseStudy: { before: "[PLACEHOLDER] Complaints handled reactively. NPS: 15.", after: "[PLACEHOLDER] Proactive service design. NPS jumped to 65.", quote: "[PLACEHOLDER] We redesigned service around moments that matter." }
    },
    "route-to-market": {
        insights: ["The best product with the wrong channel strategy will lose.", "Multi-channel is essential but channel conflict is real."],
        caseStudy: { before: "[PLACEHOLDER] Single-channel dependency. One distributor, 80% of revenue.", after: "[PLACEHOLDER] 3-channel strategy. Revenue grew 25% from new channels.", quote: "[PLACEHOLDER] Diversifying routes to market was the best strategic decision." }
    },
    "core-activities": {
        insights: ["Do not list departments. List what they DO. Start with a verb.", "80% of your value comes from 20% of your activities."],
        caseStudy: { before: "[PLACEHOLDER] 47 activities listed. No clarity on which mattered.", after: "[PLACEHOLDER] 12 core activities. Resources reallocated to highest-value work.", quote: "[PLACEHOLDER] We found 35% of our work was waste." }
    },
    "processes-decisions": {
        insights: ["A decision not made is worse than a wrong decision.", "Capabilities take years to build and seconds to lose."],
        caseStudy: { before: "[PLACEHOLDER] All decisions funneled through CEO.", after: "[PLACEHOLDER] Decision framework delegated 80% of decisions.", quote: "[PLACEHOLDER] The framework freed me from being the bottleneck." }
    },
    "fit-abc": {
        insights: ["The ABC Matrix forces the hardest conversation: who belongs and who does not.", "A-players attract A-players. B-players hire C-players."],
        caseStudy: { before: "[PLACEHOLDER] Mixed performance, no clear standard.", after: "[PLACEHOLDER] ABC analysis led to role changes. Productivity increased 45%.", quote: "[PLACEHOLDER] The ABC analysis was painful but necessary." }
    },
    "org-redesign": {
        insights: ["Structure follows strategy, never the reverse.", "Every role should have a clear owner, clear metrics, and clear authority."],
        caseStudy: { before: "[PLACEHOLDER] Org chart unchanged in 5 years despite 3x growth.", after: "[PLACEHOLDER] Restructured around value streams. Decision speed doubled.", quote: "[PLACEHOLDER] Our org was designed for where we were, not where we were going." }
    },
    "employer-branding": {
        insights: ["Your employer brand is what employees say when you are not in the room.", "A-players join companies with strong cultures. Salary is factor #3, not #1."],
        caseStudy: { before: "[PLACEHOLDER] 6-month average time to hire.", after: "[PLACEHOLDER] Time-to-hire reduced to 6 weeks. A-player acceptance: 85%.", quote: "[PLACEHOLDER] The right people started finding us." }
    },
    "agile-teams": {
        insights: ["Agile is about empowering small teams to make decisions and deliver value fast.", "Cross-functional teams of 5-7 outperform siloed departments of 50."],
        caseStudy: { before: "[PLACEHOLDER] Waterfall. 12-month delivery cycles.", after: "[PLACEHOLDER] 2-week sprints. Customer feedback loop in days.", quote: "[PLACEHOLDER] Agile teams delivered the right things, not just faster." }
    },
    "digitalization": {
        insights: ["Digital transformation is not about technology. It is about serving your strategy.", "Start with the process, then find the technology."],
        caseStudy: { before: "[PLACEHOLDER] Digital tools nobody used. Data in disconnected systems.", after: "[PLACEHOLDER] Strategic digitalization roadmap. ROI in 6 months.", quote: "[PLACEHOLDER] We started solving problems with technology." }
    },
    "digital-heart": {
        insights: ["Data without a strategy is just storage costs.", "The Digital Heart connects all data sources into one source of truth."],
        caseStudy: { before: "[PLACEHOLDER] Data in multiple systems. No single source of truth.", after: "[PLACEHOLDER] Unified data lake. Real-time dashboards for every KPI.", quote: "[PLACEHOLDER] The data lake revealed insights we never had." }
    }
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    // Skip woop (uses JSX portal approach)
    if (fileName === '00-woop.html') return false;

    // Extract TOOL_SLUG
    const slugMatch = content.match(/TOOL_SLUG[:\s]*['"]([^'"]+)['"]/);
    if (!slugMatch) return false;
    const toolSlug = slugMatch[1];

    let changed = false;

    // 1. Remove the CognitiveLoadDrawer function definition if it exists
    const drawerFnPattern = /\n\s*\/\/ Cognitive Load: Tool Guide Drawer Component\s*\n\s*function CognitiveLoadDrawer\(\)[^}]*\{[^}]*\{[^}]*\}[^}]*\}[^}]*\);?\s*\}\s*\n/;
    if (drawerFnPattern.test(content)) {
        content = content.replace(drawerFnPattern, '\n');
        changed = true;
    }

    // 2. Update the CognitiveLoad.init() call to include config
    const tc = TOOL_CONTENT[toolSlug];
    if (!tc) {
        console.log('  No content for slug:', toolSlug, '- skipping config update');
        // Still remove CognitiveLoadDrawer if found
        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('  Fixed:', fileName, '(removed CognitiveLoadDrawer only)');
        }
        return changed;
    }

    const configJSON = JSON.stringify({
        insights: tc.insights,
        caseStudy: tc.caseStudy
    });

    // Replace simple init call with one that includes config
    const simpleInitPattern = new RegExp("CognitiveLoad\\.init\\('" + toolSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "'\\);");
    if (simpleInitPattern.test(content)) {
        content = content.replace(
            simpleInitPattern,
            "CognitiveLoad.init('" + toolSlug + "', " + configJSON + ");"
        );
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('  Fixed:', fileName, '(slug:', toolSlug, ')');
    }

    return changed;
}

console.log('=== Fix CognitiveLoad.init() Calls ===\n');

const modules = [
    'module-0-intro-sprint',
    'module-1-identity',
    'module-2-performance',
    'module-3-market',
    'module-4-strategy-development',
    'module-5-strategy-execution',
    'module-6-org-structure',
    'module-7-people-leadership',
    'module-8-tech-ai'
];

let fixed = 0;

modules.forEach(function(mod) {
    const modDir = path.join(TOOLS_DIR, mod);
    if (!fs.existsSync(modDir)) return;

    const files = fs.readdirSync(modDir).filter(function(f) {
        return f.endsWith('.html') && !f.includes('-v2') && !f.includes('-locked');
    });

    files.forEach(function(f) {
        if (processFile(path.join(modDir, f))) fixed++;
    });
});

console.log('\nFixed: ' + fixed + ' files');
