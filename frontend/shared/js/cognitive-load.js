/**
 * Cognitive Load Component Library
 * Fast Track Tools - Shared JS components
 *
 * Exposes window.CognitiveLoad with:
 * - TOOL_REGISTRY: All 31 tools
 * - init(toolSlug, config): Initialize drawer + features
 * - getInterconnections(toolSlug): Upstream/downstream tools
 * - components: React component factories
 *
 * Usage in tool HTML:
 *   <script src="../../shared/js/cognitive-load.js"></script>
 *   <script type="text/babel">
 *     const { FastTrackInsight, ScienceBox, WarningBox, CaseStudy,
 *             ScienceBookmarkIcon, ToolGuideDrawer } = CognitiveLoad.components;
 *   </script>
 */

window.CognitiveLoad = (function() {
    'use strict';

    // =========================================================================
    // Tool Registry - All 31 tools
    // =========================================================================
    var TOOL_REGISTRY = {
        'woop':                       { name: 'WOOP',                           module: 0, sprint: 0  },
        'know-thyself':               { name: 'Know Thyself',                   module: 1, sprint: 1  },
        'dream':                      { name: 'Dream',                          module: 1, sprint: 2  },
        'values':                     { name: 'Values',                         module: 1, sprint: 3  },
        'team':                       { name: 'Team',                           module: 1, sprint: 4  },
        'fit':                        { name: 'FIT Assessment',                 module: 1, sprint: 5  },
        'cash':                       { name: 'Cash Flow',                      module: 2, sprint: 6  },
        'energy':                     { name: 'Energy Body Mind',               module: 2, sprint: 7  },
        'goals':                      { name: 'Goals',                          module: 2, sprint: 8  },
        'focus':                      { name: 'Focus & Productivity',           module: 2, sprint: 9  },
        'performance':                { name: 'Performance & Accountability',   module: 2, sprint: 10 },
        'meeting-rhythm':             { name: 'Meeting Rhythm',                 module: 2, sprint: 11 },
        'market-size':                { name: 'Market Size',                    module: 3, sprint: 12 },
        'segmentation-target-market': { name: 'Segmentation & Target Market',   module: 3, sprint: 13 },
        'target-segment-deep-dive':   { name: 'Target Segment Deep Dive',       module: 4, sprint: 14 },
        'value-proposition':          { name: 'Value Proposition',              module: 4, sprint: 15 },
        'value-proposition-testing':  { name: 'Value Proposition Testing',      module: 4, sprint: 16 },
        'product-development':        { name: 'Product Development',            module: 5, sprint: 17 },
        'pricing':                    { name: 'Pricing Strategy',               module: 5, sprint: 18 },
        'brand-marketing':            { name: 'Brand & Marketing',              module: 5, sprint: 19 },
        'customer-service':           { name: 'Customer Service',               module: 5, sprint: 20 },
        'route-to-market':            { name: 'Route to Market',                module: 5, sprint: 21 },
        'core-activities':            { name: 'Core Activities',                module: 6, sprint: 22 },
        'processes-decisions':        { name: 'Core Decisions & Capabilities',  module: 6, sprint: 23 },
        'fit-abc-analysis':           { name: 'FIT & ABC Analysis',             module: 6, sprint: 24 },
        'org-redesign':               { name: 'Organizational Redesign',        module: 6, sprint: 25 },
        'employer-branding':          { name: 'Employer Branding',              module: 7, sprint: 26 },
        'agile-teams':                { name: 'Set Agile Teams',                module: 7, sprint: 27 },
        'digitalization':             { name: 'AI & Digitalization',            module: 8, sprint: 28 },
        'digital-heart':              { name: 'Digital Heart - Data Lake',      module: 8, sprint: 29 },
        'program-overview':           { name: 'Program Overview',               module: 8, sprint: 30 }
    };

    var MODULE_NAMES = {
        0: 'Intro Sprint',
        1: 'Individual & Company Identity',
        2: 'Core Elements of Performance',
        3: 'Understanding the Market',
        4: 'Strategy Development',
        5: 'Strategy Execution',
        6: 'Organizational Structure',
        7: 'People & Leadership',
        8: 'Tech & AI'
    };

    // =========================================================================
    // Utility
    // =========================================================================
    function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // =========================================================================
    // Interconnection / Dependencies
    // =========================================================================
    function getInterconnections(toolSlug) {
        var config = null;
        // Try to read from DependencyInjection if available
        if (window.DependencyInjection && typeof window.DependencyInjection.getDependenciesConfig === 'function') {
            config = window.DependencyInjection.getDependenciesConfig();
        }

        var upstream = [];
        var downstream = [];

        if (config) {
            // Upstream: tools this one depends on
            var toolDeps = config[toolSlug];
            if (toolDeps && toolDeps.depends_on) {
                toolDeps.depends_on.forEach(function(dep) {
                    var reg = TOOL_REGISTRY[dep];
                    if (reg) {
                        upstream.push({ slug: dep, name: reg.name, sprint: reg.sprint, module: reg.module });
                    }
                });
            }

            // Downstream: tools that depend on this one
            Object.keys(config).forEach(function(slug) {
                var entry = config[slug];
                if (entry.depends_on && entry.depends_on.indexOf(toolSlug) !== -1) {
                    var reg = TOOL_REGISTRY[slug];
                    if (reg) {
                        downstream.push({ slug: slug, name: reg.name, sprint: reg.sprint, module: reg.module });
                    }
                }
            });
        }

        // Sort by sprint number
        upstream.sort(function(a, b) { return a.sprint - b.sprint; });
        downstream.sort(function(a, b) { return a.sprint - b.sprint; });

        return { upstream: upstream, downstream: downstream };
    }

    // =========================================================================
    // Drawer DOM Management - REMOVED (Tool Guide drawer removed per user request)
    // Keeping stubs for backward compatibility with tools that reference these
    // =========================================================================
    function openDrawer() {}
    function closeDrawer() {}

    // =========================================================================
    // React Components (using React.createElement, no JSX)
    // =========================================================================
    var h = function() {
        return React.createElement.apply(React, arguments);
    };

    // --- FastTrackInsight ---
    function FastTrackInsight(props) {
        return h('div', { className: 'cl-insight-box no-print' },
            h('div', { className: 'cl-insight-box__label' }, 'FAST TRACK INSIGHT'),
            h('div', { className: 'cl-insight-box__body' }, props.children)
        );
    }

    // --- ScienceBox ---
    function ScienceBox(props) {
        var collapsible = props.collapsible || false;
        var stateHook = React.useState(!collapsible);
        var isOpen = stateHook[0];
        var setIsOpen = stateHook[1];

        var className = 'cl-science-box no-print';
        if (collapsible) className += ' cl-science-box--collapsible';
        if (isOpen) className += ' is-open';

        var labelContent = [
            'THE SCIENCE',
            collapsible ? h('span', { className: 'cl-science-box__toggle', key: 'toggle' }, '\u25B6') : null
        ];

        return h('div', { className: className },
            h('div', {
                className: 'cl-science-box__label',
                onClick: collapsible ? function() { setIsOpen(!isOpen); } : undefined
            }, labelContent),
            h('div', { className: 'cl-science-box__body' }, props.children)
        );
    }

    // --- WarningBox ---
    function WarningBox(props) {
        var headline = props.headline || 'COMMON MISTAKE';
        return h('div', { className: 'cl-warning-box no-print' },
            h('div', { className: 'cl-warning-box__headline' }, headline),
            h('div', { className: 'cl-warning-box__body' }, props.children)
        );
    }

    // --- ScienceBookmarkIcon --- (removed per user feedback - "WHY WE ASK THIS" tooltips are sufficient)
    function ScienceBookmarkIcon() { return null; }

    // --- CaseStudy ---
    function CaseStudy(props) {
        var title = props.title || '[PLACEHOLDER] Case Study';
        var beforeText = props.before || '[PLACEHOLDER] Before implementing this tool, the company struggled with...';
        var afterText = props.after || '[PLACEHOLDER] After 90 days, results included...';
        var quote = props.quote || '[PLACEHOLDER] "This tool changed how we approach our business."';
        var attribution = props.attribution || '[PLACEHOLDER] - CEO, Company Name';

        return h('div', { className: 'cl-case-study no-print' },
            h('div', { className: 'cl-case-study__header' }, 'REAL RESULTS'),
            h('div', { className: 'cl-case-study__title' }, title),
            h('div', { className: 'cl-case-study__before-after' },
                h('div', { className: 'cl-case-study__before' },
                    h('div', { className: 'cl-case-study__label' }, 'BEFORE'),
                    h('div', { className: 'cl-case-study__text' }, beforeText)
                ),
                h('div', { className: 'cl-case-study__after' },
                    h('div', { className: 'cl-case-study__label' }, 'AFTER'),
                    h('div', { className: 'cl-case-study__text' }, afterText)
                )
            ),
            h('div', { className: 'cl-case-study__quote' },
                quote,
                h('span', { className: 'cl-case-study__attribution' }, attribution)
            )
        );
    }

    // --- ToolInterconnectionMap --- (stub, drawer removed)
    function ToolInterconnectionMap() { return null; }

    // --- ToolGuideDrawer --- (stub, drawer removed per user request)
    function ToolGuideDrawer() { return null; }

    // =========================================================================
    // Init
    // =========================================================================
    var _currentToolSlug = null;
    var _currentConfig = {};

    function init(toolSlug, config) {
        config = config || {};
        _currentToolSlug = toolSlug;
        _currentConfig = config;

        if (!TOOL_REGISTRY[toolSlug]) {
            console.warn('[CognitiveLoad] Unknown tool slug:', toolSlug);
        }

        console.log('[CognitiveLoad] Initializing for:', toolSlug);
    }

    // renderDrawerContent removed - Tool Guide drawer removed per user request

    // =========================================================================
    // Public API
    // =========================================================================
    return {
        TOOL_REGISTRY: TOOL_REGISTRY,
        MODULE_NAMES: MODULE_NAMES,
        init: init,
        getInterconnections: getInterconnections,
        openDrawer: openDrawer,
        closeDrawer: closeDrawer,
        components: {
            FastTrackInsight: FastTrackInsight,
            ScienceBox: ScienceBox,
            WarningBox: WarningBox,
            ScienceBookmarkIcon: ScienceBookmarkIcon,
            CaseStudy: CaseStudy,
            ToolInterconnectionMap: ToolInterconnectionMap,
            ToolGuideDrawer: ToolGuideDrawer
        }
    };
})();

// =============================================================================
// Textarea auto-grow — remove resize handle, expand with content
// =============================================================================
(function () {
    var attached = new WeakSet();
    function autoGrow(el) {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }
    function initTextarea(el) {
        if (attached.has(el)) return;
        attached.add(el);
        autoGrow(el);
        el.addEventListener('input', function () { autoGrow(el); });
    }
    function initTextareas(root) {
        var els = (root || document).querySelectorAll('textarea');
        els.forEach(initTextarea);
    }
    // Watch for textareas added by React/dynamic rendering
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
            m.addedNodes.forEach(function (node) {
                if (node.nodeType !== 1) return;
                if (node.tagName === 'TEXTAREA') { initTextarea(node); }
                else { node.querySelectorAll && node.querySelectorAll('textarea').forEach(initTextarea); }
            });
        });
    });
    function start() {
        initTextareas();
        observer.observe(document.body, { childList: true, subtree: true });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
    // Expose for manual calls if needed
    window.initTextareaAutoGrow = initTextareas;
})();
