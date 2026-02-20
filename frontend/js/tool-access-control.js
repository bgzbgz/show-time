/**
 * Tool Access Control
 * Checks if a user has completed prerequisite tools before allowing access.
 * If prerequisites are not met, shows a branded lock screen.
 *
 * Usage in tool HTML (after supabase client, tool-db.js, and dependency-injection.js):
 *   <script src="../../js/tool-access-control.js"></script>
 *   <script>
 *     ToolAccessControl.init('value-proposition');
 *   </script>
 *
 * Uses:
 * - DependencyInjection.getDependenciesConfig() for the dependency graph
 * - Supabase tool_completions table for completion status
 */

var ToolAccessControl = (function () {
    'use strict';

    // Tool display names
    var TOOL_NAMES = {
        'woop': 'WOOP',
        'know-thyself': 'Know Thyself',
        'dream': 'Dream',
        'values': 'Values',
        'team': 'Team',
        'fit': 'Fit',
        'cash': 'Cash',
        'energy': 'Energy',
        'goals': 'Goals',
        'focus': 'Focus',
        'performance': 'Performance Analysis',
        'meeting-rhythm': 'Meeting Rhythm',
        'market-size': 'Market Size',
        'segmentation-target-market': 'Segmentation & Target Market',
        'target-segment-deep-dive': 'Target Segment Deep Dive',
        'value-proposition': 'Value Proposition',
        'value-proposition-testing': 'Value Proposition Testing',
        'product-development': 'Product Development',
        'pricing': 'Pricing',
        'brand-marketing': 'Brand & Marketing',
        'customer-service': 'Customer Service',
        'route-to-market': 'Route to Market',
        'core-activities': 'Core Activities',
        'processes-decisions': 'Processes & Decisions',
        'fit-abc-analysis': 'Fit ABC Analysis',
        'org-redesign': 'Organizational Redesign',
        'employer-branding': 'Employer Branding',
        'agile-teams': 'Agile Teams',
        'digitalization': 'Digitalization',
        'digital-heart': 'Digital Heart'
    };

    /**
     * Check which prerequisite tools are completed
     */
    function checkPrerequisites(toolSlug) {
        var userId = localStorage.getItem('ft_user_id');
        if (!userId) return Promise.resolve({ allowed: false, reason: 'no_user', missing: [] });

        // Get dependency config
        var config = null;
        if (window.DependencyInjection && window.DependencyInjection.getDependenciesConfig) {
            config = window.DependencyInjection.getDependenciesConfig();
        }

        if (!config || !config[toolSlug]) {
            return Promise.resolve({ allowed: true, reason: 'no_deps', missing: [] });
        }

        var requiredTools = config[toolSlug].depends_on || [];
        if (requiredTools.length === 0) {
            return Promise.resolve({ allowed: true, reason: 'no_deps', missing: [] });
        }

        if (!window.supabaseClient) {
            console.warn('[ToolAccessControl] No supabaseClient — allowing access');
            return Promise.resolve({ allowed: true, reason: 'no_supabase', missing: [] });
        }

        return window.supabaseClient
            .from('tool_completions')
            .select('tool_slug')
            .eq('user_id', userId)
            .then(function (result) {
                var completedSlugs = (result.data || []).map(function (r) { return r.tool_slug; });
                var missing = requiredTools.filter(function (slug) {
                    return completedSlugs.indexOf(slug) === -1;
                });

                return {
                    allowed: missing.length === 0,
                    reason: missing.length === 0 ? 'all_complete' : 'missing_prereqs',
                    missing: missing,
                    completed: completedSlugs
                };
            })
            .catch(function (err) {
                console.error('[ToolAccessControl] Error:', err);
                return { allowed: true, reason: 'error', missing: [] };
            });
    }

    /**
     * Render the lock screen
     */
    function showLockScreen(toolSlug, missingTools) {
        var missingList = missingTools.map(function (slug) {
            return TOOL_NAMES[slug] || slug;
        });

        var overlay = document.createElement('div');
        overlay.id = 'tool-access-lock';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;overflow-y:auto;';

        var listItems = missingList.map(function (name) {
            return '<li style="padding:10px 0;border-bottom:1px solid #333;display:flex;align-items:center;gap:12px;">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF469" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
                '<span style="font-family:Riforma,Arial,sans-serif;font-size:15px;">' + name + '</span></li>';
        }).join('');

        overlay.innerHTML =
            '<div style="max-width:520px;width:100%;text-align:center;">' +
                // Lock icon
                '<div style="margin-bottom:32px;">' +
                    '<div style="width:80px;height:80px;margin:0 auto 20px;background:#FFF469;border-radius:50%;display:flex;align-items:center;justify-content:center;">' +
                        '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
                    '</div>' +
                    '<h1 style="font-family:Plaak,Arial,sans-serif;font-size:2.5rem;color:#FFF;text-transform:uppercase;margin-bottom:12px;letter-spacing:-0.01em;">Tool Locked</h1>' +
                    '<p style="font-family:Riforma,Arial,sans-serif;font-size:1.1rem;color:#aaa;line-height:1.6;">Complete the following tools first to unlock <strong style="color:#FFF469;">' + (TOOL_NAMES[toolSlug] || toolSlug) + '</strong></p>' +
                '</div>' +
                // Missing tools list
                '<ul style="list-style:none;padding:0;text-align:left;color:#fff;margin-bottom:36px;">' +
                    listItems +
                '</ul>' +
                // CTA
                '<a href="javascript:history.back()" style="display:inline-block;background:#FFF469;color:#000;font-family:Plaak,Arial,sans-serif;font-size:1rem;text-transform:uppercase;padding:16px 40px;border:none;cursor:pointer;font-weight:bold;text-decoration:none;letter-spacing:0.02em;">Go Back</a>' +
                '<p style="font-family:Monument,Courier New,monospace;font-size:11px;color:#555;margin-top:20px;text-transform:uppercase;letter-spacing:0.05em;">Complete lessons in LearnWorlds to unlock tools</p>' +
            '</div>';

        document.body.appendChild(overlay);

        // Hide tool content
        var root = document.getElementById('root') || document.getElementById('app');
        if (root) root.style.display = 'none';
    }

    /**
     * Initialize access control for a tool
     */
    function init(toolSlug) {
        // WOOP is always accessible
        if (toolSlug === 'woop') return Promise.resolve();

        return checkPrerequisites(toolSlug).then(function (result) {
            if (!result.allowed && result.reason === 'missing_prereqs') {
                console.log('[ToolAccessControl] Blocked — missing:', result.missing);
                showLockScreen(toolSlug, result.missing);
            } else if (!result.allowed && result.reason === 'no_user') {
                // No user logged in — allow access (playground/testing mode)
                console.log('[ToolAccessControl] No user — allowing access (test mode)');
            } else {
                console.log('[ToolAccessControl] Access granted for', toolSlug);
            }
        });
    }

    return {
        init: init,
        checkPrerequisites: checkPrerequisites,
        TOOL_NAMES: TOOL_NAMES
    };
})();

window.ToolAccessControl = ToolAccessControl;
