/**
 * Rollout Script: Add cognitive load components to all 30 remaining tools
 * Usage: node scripts/rollout-cognitive-load.js
 */

const fs = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '..', 'frontend', 'tools');

// Tool-specific content for placeholder components
const TOOL_CONTENT = {
    "know-thyself": {
        name: "Know Thyself",
        insights: [
            "Self-awareness is the foundation of leadership. You cannot lead others until you understand yourself.",
            "The 80/20 rule: 80% of your leadership effectiveness comes from understanding your personal values and strengths."
        ],
        caseStudy: { before: "[PLACEHOLDER] CEO could not articulate personal values or purpose.", after: "[PLACEHOLDER] Clear identity statement, team understood the vision, decision-making speed doubled.", quote: "[PLACEHOLDER] Once I knew who I was, every business decision became clearer." }
    },
    "dream": {
        name: "Dream",
        insights: [
            "A company without a dream is just a job. Dreams create energy and alignment across the entire organization.",
            "Your dream must be specific enough to measure but inspiring enough to energize."
        ],
        caseStudy: { before: "[PLACEHOLDER] Company had no shared vision. Each department pulled in different directions.", after: "[PLACEHOLDER] One-sentence dream aligned all 50 employees. Revenue grew 40% in 12 months.", quote: "[PLACEHOLDER] When everyone knows the dream, they make decisions without waiting for the CEO." }
    },
    "values": {
        name: "Values",
        insights: [
            "Values are not aspirational - they describe who you actually are. Fake values destroy trust faster than no values.",
            "Fast Track way: 3-5 values maximum. More than 5 means you have not made hard choices."
        ],
        caseStudy: { before: "[PLACEHOLDER] Company had 12 generic values nobody remembered.", after: "[PLACEHOLDER] 3 sharp values that drove hiring, firing, and promotion decisions.", quote: "[PLACEHOLDER] Our values became our operating system. They made the hard decisions easy." }
    },
    "team": {
        name: "Team",
        insights: [
            "A team is only as strong as its weakest dysfunction. Identify and address the top 3.",
            "Accountability without trust is tyranny. Trust without accountability is negligence."
        ],
        caseStudy: { before: "[PLACEHOLDER] Team meetings were polite but unproductive. No one challenged ideas.", after: "[PLACEHOLDER] Dysfunction scores improved from 3/10 to 7/10. Healthy conflict became normal.", quote: "[PLACEHOLDER] The dysfunction assessment was uncomfortable but transformative." }
    },
    "fit": {
        name: "FIT Assessment",
        insights: [
            "FIT is the most powerful and most uncomfortable tool. It forces honest conversations about whether people are in the right roles.",
            "A-players in wrong seats destroy more value than B-players in right seats."
        ],
        caseStudy: { before: "[PLACEHOLDER] 40% of team members were in wrong roles. Performance was stagnant.", after: "[PLACEHOLDER] Strategic role changes led to 30% productivity increase.", quote: "[PLACEHOLDER] FIT showed us that our best people were being wasted in the wrong positions." }
    },
    "cash": {
        name: "Cash Flow",
        insights: [
            "Revenue is vanity, profit is sanity, cash is king. Most businesses fail not from lack of profit but lack of cash.",
            "The Power of One: improving just one cash lever by 1% can dramatically impact your cash position."
        ],
        caseStudy: { before: "[PLACEHOLDER] Company was profitable on paper but constantly cash-strapped.", after: "[PLACEHOLDER] Cash conversion cycle reduced by 15 days. Freed up working capital.", quote: "[PLACEHOLDER] Understanding the Power of One changed how I think about every financial decision." }
    },
    "energy": {
        name: "Energy Body Mind",
        insights: [
            "Energy management beats time management. A focused hour beats a distracted day.",
            "CEO energy is contagious. If you are depleted, your entire organization feels it."
        ],
        caseStudy: { before: "[PLACEHOLDER] CEO working 70-hour weeks, constant fatigue, poor decisions.", after: "[PLACEHOLDER] Structured energy management: 50-hour weeks with 2x the output.", quote: "[PLACEHOLDER] I realized I was the bottleneck because I was exhausted." }
    },
    "goals": {
        name: "Goals",
        insights: [
            "Goals without alignment are chaos. Every goal must connect to the dream through a clear cascade.",
            "OKRs work because they create transparency and focus. Maximum 3-5 objectives per quarter."
        ],
        caseStudy: { before: "[PLACEHOLDER] 47 goals across the company. Nobody knew what mattered most.", after: "[PLACEHOLDER] 3 company OKRs cascading to team OKRs. Goal completion rate jumped from 20% to 75%.", quote: "[PLACEHOLDER] Fewer goals meant better goals. We finally achieved what we set out to do." }
    },
    "focus": {
        name: "Focus and Productivity",
        insights: [
            "Multitasking is a lie. Each task switch costs 23 minutes of refocus time.",
            "The Impact/Easy Matrix is the single most powerful prioritization tool. Use it daily."
        ],
        caseStudy: { before: "[PLACEHOLDER] CEO responded to every email within 5 minutes. Strategic work never happened.", after: "[PLACEHOLDER] Daily plan with 3 priorities. Strategic thinking time doubled.", quote: "[PLACEHOLDER] The Empty Brain exercise freed up mental bandwidth I did not know I had." }
    },
    "performance": {
        name: "Performance and Accountability",
        insights: [
            "What gets measured gets managed. But only measure what truly matters - too many metrics create noise.",
            "The 5 Whys technique reveals root causes that symptoms analysis misses entirely."
        ],
        caseStudy: { before: "[PLACEHOLDER] Performance reviews happened annually. Issues festered for months.", after: "[PLACEHOLDER] Weekly 15-minute performance check-ins. Problems caught within days.", quote: "[PLACEHOLDER] The accountability framework removed emotion from difficult conversations." }
    },
    "meeting-rhythm": {
        name: "Meeting Rhythm",
        insights: [
            "Bad meetings are the #1 productivity killer. A good rhythm eliminates 80% of ad-hoc meetings.",
            "Daily huddles (15 min), weekly tacticals (60 min), monthly strategics (half day), quarterly planning (full day)."
        ],
        caseStudy: { before: "[PLACEHOLDER] 25 hours/week in meetings. Most had no agenda or outcomes.", after: "[PLACEHOLDER] Structured rhythm: 8 hours/week, all with clear outcomes and owners.", quote: "[PLACEHOLDER] The meeting rhythm gave us back 17 hours per week." }
    },
    "market-size": {
        name: "Market Size",
        insights: [
            "TAM-SAM-SOM is not an academic exercise. It determines whether your dream is even possible.",
            "Most companies overestimate TAM and underestimate the effort to capture SAM."
        ],
        caseStudy: { before: "[PLACEHOLDER] Company assumed their market was huge. No data to back it up.", after: "[PLACEHOLDER] Rigorous TAM-SAM-SOM analysis revealed serviceable market. Strategy refocused.", quote: "[PLACEHOLDER] The market size reality check saved us from a disastrous expansion strategy." }
    },
    "segmentation": {
        name: "Segmentation and Target Market",
        insights: [
            "Trying to serve everyone means serving no one well. Pick your battlefield.",
            "The best segments are underserved, accessible, and profitable. Score them objectively."
        ],
        caseStudy: { before: "[PLACEHOLDER] Company targeted everyone who needs their product. Marketing was generic.", after: "[PLACEHOLDER] 3 clear segments identified, top segment prioritized. CAC dropped 40%.", quote: "[PLACEHOLDER] When we stopped trying to be everything to everyone, we became essential to someone." }
    },
    "target-segment": {
        name: "Target Segment Deep Dive",
        insights: [
            "You cannot create value for customers you do not deeply understand. Empathy is a strategic weapon.",
            "Jobs-to-be-done thinking reveals what customers actually need, not what they say they want."
        ],
        caseStudy: { before: "[PLACEHOLDER] Product roadmap based on assumptions about customer needs.", after: "[PLACEHOLDER] Deep customer interviews revealed 3 unmet needs. Product-market fit achieved.", quote: "[PLACEHOLDER] We thought we knew our customers. We were wrong about almost everything." }
    },
    "value-proposition": {
        name: "Value Proposition",
        insights: [
            "Your value proposition is not your product features. It is the transformation you create for the customer.",
            "If you cannot state your VP in one sentence, it is not clear enough."
        ],
        caseStudy: { before: "[PLACEHOLDER] Sales pitch was a 20-slide deck about features. Close rate: 15%.", after: "[PLACEHOLDER] One-sentence value proposition. Close rate jumped to 35%.", quote: "[PLACEHOLDER] When we stopped selling features and started selling outcomes, everything changed." }
    },
    "vp-testing": {
        name: "Value Proposition Testing",
        insights: [
            "An untested value proposition is just a hypothesis. Test before you invest.",
            "Real validation requires real customers, real money, and real commitment signals."
        ],
        caseStudy: { before: "[PLACEHOLDER] Launched new service based on internal assumptions. Minimal uptake.", after: "[PLACEHOLDER] Tested VP with 20 target customers before build. 14 showed purchase intent.", quote: "[PLACEHOLDER] Testing saved us from building something nobody wanted to pay for." }
    },
    "product-development": {
        name: "Product Development",
        insights: [
            "Build the minimum viable product, not the maximum imagined product. Ship fast, learn faster.",
            "WTP (Willingness to Pay) analysis before development prevents building unprofitable products."
        ],
        caseStudy: { before: "[PLACEHOLDER] 18-month development cycle. Product launched with features nobody used.", after: "[PLACEHOLDER] 90-day MVP cycles. Customer feedback integrated weekly.", quote: "[PLACEHOLDER] We stopped guessing what to build and started asking what customers would pay for." }
    },
    "pricing": {
        name: "Pricing Strategy",
        insights: [
            "Pricing is the most powerful profit lever. A 1% price increase drives ~11% profit increase on average.",
            "Value-based pricing beats cost-plus pricing every time. Price the outcome, not the input."
        ],
        caseStudy: { before: "[PLACEHOLDER] Pricing based on cost + 20% margin. Leaving money on the table.", after: "[PLACEHOLDER] Value-based pricing increased average deal size by 30% with no increase in churn.", quote: "[PLACEHOLDER] We were undercharging because we priced our costs, not our value." }
    },
    "brand-marketing": {
        name: "Brand and Marketing",
        insights: [
            "Brand is not your logo. It is the promise you make and consistently keep.",
            "Marketing without strategy is just noise. Connect every campaign to your value proposition."
        ],
        caseStudy: { before: "[PLACEHOLDER] Big marketing spend with no clear message. Leads were low quality.", after: "[PLACEHOLDER] Brand strategy aligned to VP. Lead quality improved 3x, spend reduced 30%.", quote: "[PLACEHOLDER] When the brand matched the reality, customers started coming to us." }
    },
    "customer-service": {
        name: "Customer Service",
        insights: [
            "Customer service is not a cost center - it is your most powerful retention and growth engine.",
            "One delighted customer tells 3 people. One angry customer tells 11."
        ],
        caseStudy: { before: "[PLACEHOLDER] Customer complaints handled reactively. NPS score: 15.", after: "[PLACEHOLDER] Proactive service design. NPS jumped to 65. Referral revenue grew 40%.", quote: "[PLACEHOLDER] We redesigned service around customer moments that matter." }
    },
    "route-to-market": {
        name: "Route to Market",
        insights: [
            "The best product with the wrong channel strategy will lose to a good product with the right channels.",
            "Multi-channel is essential but channel conflict is real. Design for it upfront."
        ],
        caseStudy: { before: "[PLACEHOLDER] Single-channel dependency. One distributor held 80% of revenue.", after: "[PLACEHOLDER] 3-channel strategy reduced dependency risk. Revenue grew 25% from new channels.", quote: "[PLACEHOLDER] Diversifying our routes to market was the single best strategic decision of the year." }
    },
    "core-activities": {
        name: "Core Activities",
        insights: [
            "Do not list departments. List what they DO. Start with a verb. This reveals what creates value.",
            "80% of your value comes from 20% of your activities. Identify and protect them."
        ],
        caseStudy: { before: "[PLACEHOLDER] 47 activities listed. No clarity on which ones mattered most.", after: "[PLACEHOLDER] 12 core activities identified. Resources reallocated to highest-value work.", quote: "[PLACEHOLDER] When we mapped activities to value creation, we found 35% of our work was waste." }
    },
    "processes-decisions": {
        name: "Core Decisions and Capabilities",
        insights: [
            "A decision not made is worse than a wrong decision. Speed of decision-making is a competitive advantage.",
            "Capabilities take years to build and seconds to lose. Invest in them strategically."
        ],
        caseStudy: { before: "[PLACEHOLDER] All decisions funneled through CEO. Bottleneck delayed everything.", after: "[PLACEHOLDER] Decision framework delegated 80% of decisions. Speed to market improved 3x.", quote: "[PLACEHOLDER] The decision framework freed me from being the bottleneck in my own company." }
    },
    "fit-abc": {
        name: "FIT and ABC Analysis",
        insights: [
            "The ABC Matrix forces the hardest conversation in business: who belongs and who does not.",
            "A-players attract A-players. B-players hire C-players. Guard your talent standard."
        ],
        caseStudy: { before: "[PLACEHOLDER] Team of 20 with mixed performance. No clear standard.", after: "[PLACEHOLDER] ABC analysis led to 3 role changes and 2 exits. Team productivity increased 45%.", quote: "[PLACEHOLDER] The ABC analysis was painful but necessary. Everyone knew the standard now." }
    },
    "org-redesign": {
        name: "Organizational Redesign",
        insights: [
            "Structure follows strategy, never the reverse. Redesign your org to execute your strategy.",
            "Every role should have a clear owner, clear metrics, and clear authority."
        ],
        caseStudy: { before: "[PLACEHOLDER] Org chart unchanged in 5 years despite 3x revenue growth.", after: "[PLACEHOLDER] Restructured around value streams. Decision speed doubled, overhead reduced 20%.", quote: "[PLACEHOLDER] We realized our org was designed for where we were, not where we were going." }
    },
    "employer-branding": {
        name: "Employer Branding",
        insights: [
            "Your employer brand is what employees say about you when you are not in the room.",
            "A-players join companies with strong cultures and clear purpose. Salary is factor #3, not #1."
        ],
        caseStudy: { before: "[PLACEHOLDER] 6-month average time to hire. High rejection rates from top candidates.", after: "[PLACEHOLDER] Employer brand strategy reduced time-to-hire to 6 weeks. A-player acceptance rate: 85%.", quote: "[PLACEHOLDER] When we got clear about who we are, the right people started finding us." }
    },
    "agile-teams": {
        name: "Set Agile Teams",
        insights: [
            "Agile is not about sprints and standups. It is about empowering small teams to make decisions and deliver value fast.",
            "Cross-functional teams of 5-7 people outperform siloed departments of 50."
        ],
        caseStudy: { before: "[PLACEHOLDER] Waterfall project management. 12-month delivery cycles.", after: "[PLACEHOLDER] Agile teams delivering value in 2-week sprints. Customer feedback loop reduced to days.", quote: "[PLACEHOLDER] Agile teams did not just deliver faster - they delivered the right things." }
    },
    "digitalization": {
        name: "AI and Digitalization",
        insights: [
            "Digital transformation is not about technology. It is about using technology to serve your strategy.",
            "Start with the process, then find the technology. Not the other way around."
        ],
        caseStudy: { before: "[PLACEHOLDER] Large spend on digital tools nobody used. Data in disconnected systems.", after: "[PLACEHOLDER] Strategic digitalization roadmap aligned to core processes. ROI in 6 months.", quote: "[PLACEHOLDER] We stopped buying technology and started solving problems with technology." }
    },
    "digital-heart": {
        name: "Digital Heart - Data Lake",
        insights: [
            "Data without a strategy is just storage costs. A data lake must serve specific decisions.",
            "The Digital Heart connects all your data sources into one source of truth."
        ],
        caseStudy: { before: "[PLACEHOLDER] Data in multiple spreadsheets and systems. No single source of truth.", after: "[PLACEHOLDER] Unified data lake. Real-time dashboards for every KPI.", quote: "[PLACEHOLDER] The data lake did not just organize our data - it revealed insights we never had." }
    }
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    // Skip woop (already done)
    if (fileName === '00-woop.html') {
        console.log('  SKIP (already done):', fileName);
        return false;
    }

    // Skip if already has cognitive-load.js
    if (content.includes('cognitive-load.js')) {
        console.log('  SKIP (already has cognitive-load):', fileName);
        return false;
    }

    // Extract TOOL_SLUG from the file
    const slugMatch = content.match(/TOOL_SLUG:\s*['"]([^'"]+)['"]/);
    if (!slugMatch) {
        console.log('  SKIP (no TOOL_SLUG found):', fileName);
        return false;
    }
    const toolSlug = slugMatch[1];
    const toolContent = TOOL_CONTENT[toolSlug] || {
        name: toolSlug,
        insights: ["[PLACEHOLDER] Key insight about this tool and the Fast Track methodology.", "[PLACEHOLDER] The 80/20 rule applied to this specific tool."],
        caseStudy: { before: "[PLACEHOLDER] Before implementing this tool...", after: "[PLACEHOLDER] After 90 days of using this tool...", quote: "[PLACEHOLDER] This tool transformed our approach." }
    };

    console.log('  Processing:', fileName, '(slug:', toolSlug, ')');

    // 1. Add CSS + JS imports after dependency-injection.js
    content = content.replace(
        /(<script src="[^"]*dependency-injection\.js"><\/script>)/,
        '$1\n    <link rel="stylesheet" href="../../shared/css/cognitive-load.css">\n    <script src="../../shared/js/cognitive-load.js"></script>'
    );

    // 2. Add CognitiveLoad.init() + destructure after DependencyInjection.init()
    const diInitPattern = /(DependencyInjection\.init\(CONFIG\.TOOL_SLUG,\s*CONFIG\.SCHEMA_NAME\);)/;
    if (diInitPattern.test(content)) {
        content = content.replace(
            diInitPattern,
            "$1\n\n        // Initialize cognitive load components\n        CognitiveLoad.init('" + toolSlug + "');\n        const { FastTrackInsight, ScienceBox, WarningBox, CaseStudy, ScienceBookmarkIcon, ToolGuideDrawer } = CognitiveLoad.components;"
        );
    }

    // 3. Find ReactDOM.render and inject ToolGuideDrawer component definition before it
    const renderIdx = content.indexOf('ReactDOM.render(');
    if (renderIdx !== -1) {
        const drawerComponent = "\n        // Cognitive Load: Tool Guide Drawer Component\n        function CognitiveLoadDrawer() {\n            return React.createElement(ToolGuideDrawer, {\n                toolSlug: '" + toolSlug + "',\n                insights: " + JSON.stringify(toolContent.insights) + ",\n                caseStudy: " + JSON.stringify(toolContent.caseStudy) + "\n            });\n        }\n\n        ";
        content = content.substring(0, renderIdx) + drawerComponent + content.substring(renderIdx);
    }

    // 4. For team tool: remove local FastTrackInsight definition
    if (fileName === '04-team.html') {
        content = content.replace(
            /\/\/ Info Box Components\s*\n\s*const FastTrackInsight[^;]*;/s,
            '// Info Box Components - Using shared CognitiveLoad.components'
        );
    }

    fs.writeFileSync(filePath, content, 'utf8');
    return true;
}

// Main execution
console.log('=== Cognitive Load Rollout Script ===\n');

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

let processed = 0;
let skipped = 0;

modules.forEach(function(mod) {
    const modDir = path.join(TOOLS_DIR, mod);
    if (!fs.existsSync(modDir)) {
        console.log('Module directory not found:', modDir);
        return;
    }

    console.log('\nModule: ' + mod);
    const files = fs.readdirSync(modDir).filter(function(f) {
        return f.endsWith('.html') && !f.includes('-v2') && !f.includes('-locked');
    });

    files.forEach(function(f) {
        const result = processFile(path.join(modDir, f));
        if (result) processed++;
        else skipped++;
    });
});

console.log('\n=== Complete ===');
console.log('Processed: ' + processed);
console.log('Skipped: ' + skipped);
