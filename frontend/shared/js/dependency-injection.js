/**
 * Dependency Injection Library
 * Automatically loads field values from dependent tools
 *
 * Usage in tool HTML:
 * <script src="../../shared/js/dependency-injection.js"></script>
 * <script>
 *   // After DOM loaded
 *   DependencyInjection.init('tool-slug', CONFIG.SCHEMA_NAME);
 * </script>
 */

const DependencyInjection = (function() {
    'use strict';

    // Cache for dependencies config
    let currentTool = null;
    let currentSchema = null;

    // Embedded dependencies configuration (inline to avoid file:// fetch issues)
    const dependenciesConfig = {
        "know-thyself": {
            "depends_on": ["woop"],
            "fields": [{
                "source_tool": "woop",
                "source_field": "wish",
                "target_field": "initial_aspiration"
            }]
        },
        "dream": {
            "depends_on": ["know-thyself"],
            "fields": [{
                "source_tool": "know-thyself",
                "source_field": "identity.personal_dream",
                "target_field": "personal_dream_context",
                "display_label": "Personal Dream"
            }, {
                "source_tool": "know-thyself",
                "source_field": "identity.personal_values",
                "target_field": "personal_values_context",
                "display_label": "Personal Values"
            }]
        },
        "values": {
            "depends_on": ["dream", "know-thyself"],
            "fields": [{
                "source_tool": "dream",
                "source_field": "identity.dream.one_sentence",
                "target_field": "dream_reference",
                "display_label": "One-Sentence Dream"
            }, {
                "source_tool": "know-thyself",
                "source_field": "identity.personal_values",
                "target_field": "personal_values_context",
                "display_label": "Personal Values"
            }]
        },
        "team": {
            "depends_on": ["values", "dream"],
            "fields": [{
                "source_tool": "values",
                "source_field": "identity.values.cool_not_cool",
                "target_field": "values_behaviors_context",
                "display_label": "Cool/Not-Cool Behaviors"
            }, {
                "source_tool": "dream",
                "source_field": "identity.dream.one_sentence",
                "target_field": "dream_context",
                "display_label": "One-Sentence Dream"
            }]
        },
        "fit": {
            "depends_on": ["know-thyself", "values", "team", "dream"],
            "fields": [{
                "source_tool": "know-thyself",
                "source_field": "identity.strengths.matrix",
                "target_field": "strengths_context",
                "display_label": "Individual Strength Matrix"
            }, {
                "source_tool": "values",
                "source_field": "identity.values.core_list",
                "target_field": "core_values_context",
                "display_label": "Core Company Values"
            }, {
                "source_tool": "values",
                "source_field": "identity.values.cool_not_cool",
                "target_field": "behaviors_context",
                "display_label": "Cool/Not-Cool Behaviors"
            }, {
                "source_tool": "team",
                "source_field": "identity.team.dysfunction_scorecard",
                "target_field": "dysfunction_context",
                "display_label": "Team Dysfunction Scorecard"
            }, {
                "source_tool": "dream",
                "source_field": "identity.dream.one_sentence",
                "target_field": "dream_context",
                "display_label": "Company Dream"
            }]
        },
        "cash": {
            "depends_on": ["dream"],
            "fields": [{
                "source_tool": "dream",
                "source_field": "identity.dream.narrative",
                "target_field": "dream_narrative_context",
                "display_label": "Company Dream Narrative"
            }]
        },
        "energy": {
            "depends_on": ["know-thyself"],
            "fields": [{
                "source_tool": "know-thyself",
                "source_field": "identity.strengths.matrix",
                "target_field": "strengths_context",
                "display_label": "Individual Strength Matrix"
            }]
        },
        "goals": {
            "depends_on": ["dream", "cash"],
            "fields": [{
                "source_tool": "dream",
                "source_field": "identity.dream.narrative",
                "target_field": "dream_narrative_context",
                "display_label": "Company Dream Narrative"
            }, {
                "source_tool": "cash",
                "source_field": "performance.cash.power_of_one",
                "target_field": "power_of_one_context",
                "display_label": "Power of One Analysis"
            }]
        },
        "focus": {
            "depends_on": ["goals", "values"],
            "fields": [{
                "source_tool": "goals",
                "source_field": "performance.goals.big_rocks",
                "target_field": "big_rocks_context",
                "display_label": "Big Rocks (90-Day Priorities)"
            }, {
                "source_tool": "values",
                "source_field": "identity.values.core_list",
                "target_field": "core_values_context",
                "display_label": "Core Company Values"
            }]
        },
        "performance": {
            "depends_on": ["goals", "values", "cash"],
            "fields": [{
                "source_tool": "goals",
                "source_field": "performance.goals.quarterly_targets",
                "target_field": "quarterly_targets_context",
                "display_label": "Quarterly Targets"
            }, {
                "source_tool": "values",
                "source_field": "identity.values.cool_not_cool",
                "target_field": "behaviors_context",
                "display_label": "Cool/Not-Cool Behaviors"
            }, {
                "source_tool": "values",
                "source_field": "identity.values.red_lines",
                "target_field": "red_lines_context",
                "display_label": "Cultural Laws (Red Lines)"
            }, {
                "source_tool": "cash",
                "source_field": "performance.cash.top_priority",
                "target_field": "top_cash_priority_context",
                "display_label": "Top Cash Priority"
            }]
        },
        "meeting-rhythm": {
            "depends_on": ["goals", "performance", "cash"],
            "fields": [{
                "source_tool": "goals",
                "source_field": "performance.goals.quarterly_targets",
                "target_field": "quarterly_targets_context",
                "display_label": "Quarterly Targets"
            }, {
                "source_tool": "performance",
                "source_field": "performance.accountability.execution_dashboard",
                "target_field": "execution_dashboard_context",
                "display_label": "Execution Dashboard"
            }, {
                "source_tool": "cash",
                "source_field": "performance.cash.top_priority",
                "target_field": "top_cash_priority_context",
                "display_label": "Top Cash Priority"
            }]
        },
        "market-size": {
            "depends_on": ["dream"],
            "fields": [{
                "source_tool": "dream",
                "source_field": "identity.dream.narrative",
                "target_field": "dream_narrative_context",
                "display_label": "Company Dream Narrative"
            }]
        },
        "segmentation-target-market": {
            "depends_on": ["market-size"],
            "fields": [{
                "source_tool": "market-size",
                "source_field": "market.size.tam",
                "target_field": "tam_context",
                "display_label": "Market Size (TAM)"
            }, {
                "source_tool": "market-size",
                "source_field": "market.size.driving_forces",
                "target_field": "driving_forces_context",
                "display_label": "Driving Forces"
            }]
        }
    };

    /**
     * Load dependencies configuration
     */
    async function loadConfig() {
        return dependenciesConfig;
    }

    /**
     * Get schema name for a tool slug
     */
    function getSchemaName(toolSlug) {
        const schemaMap = {
            'woop': 'sprint_00_woop',
            'know-thyself': 'sprint_01_know_thyself',
            'dream': 'sprint_02_dream',
            'values': 'sprint_03_values',
            'team': 'sprint_04_team',
            'goals': 'sprint_05_goals',
            'market-size': 'sprint_06_market_size',
            'segmentation-target-market': 'sprint_07_segmentation',
            'target-segment-deep-dive': 'sprint_08_target_segment',
            'value-proposition': 'sprint_09_value_proposition',
            'value-proposition-testing': 'sprint_10_vp_testing',
            'product-development': 'sprint_11_product_dev',
            'pricing': 'sprint_12_pricing',
            'brand-marketing': 'sprint_13_brand_marketing',
            'customer-service': 'sprint_14_customer_service',
            'route-to-market': 'sprint_15_route_to_market',
            'core-activities': 'sprint_16_core_activities',
            'processes-decisions': 'sprint_17_processes',
            'digitalization': 'sprint_18_digitalization',
            'fit': 'sprint_19_fit',
            'fit-abc-analysis': 'sprint_20_fit_abc',
            'org-redesign': 'sprint_21_org_redesign',
            'employer-branding': 'sprint_22_employer_branding',
            'agile-teams': 'sprint_23_agile_teams',
            'focus': 'sprint_24_focus',
            'performance': 'sprint_25_performance',
            'energy': 'sprint_26_energy',
            'digital-heart': 'sprint_27_digital_heart',
            'program-overview': 'sprint_30_program_overview',
        };
        return schemaMap[toolSlug];
    }

    /**
     * Query field_outputs for a specific field
     */
    async function queryFieldOutput(sourceTool, fieldId) {
        const userId = localStorage.getItem('ft_user_id');
        if (!userId) {
            console.warn('No user ID found in localStorage');
            return null;
        }

        const schemaName = getSchemaName(sourceTool);
        if (!schemaName) {
            console.warn(`Unknown schema for tool: ${sourceTool}`);
            return null;
        }

        // Query using RPC function
        const query = `
            SELECT fo.field_id, fo.field_value, fo.created_at
            FROM ${schemaName}.field_outputs fo
            JOIN ${schemaName}.submissions s ON fo.submission_id = s.id
            WHERE s.user_id = '${userId}' AND fo.field_id = '${fieldId}'
            ORDER BY fo.created_at DESC
            LIMIT 1
        `;

        try {
            const { data, error } = await window.supabaseClient.rpc('execute_sql', { query });

            if (error) {
                console.error(`Error querying ${sourceTool}.${fieldId}:`, error);
                return null;
            }

            if (data && data.length > 0) {
                return data[0].field_value;
            }

            return null;
        } catch (error) {
            console.error(`Exception querying ${sourceTool}.${fieldId}:`, error);
            return null;
        }
    }

    /**
     * Populate a field with dependency value
     */
    function populateField(targetField, value) {
        // Try multiple selector strategies
        const selectors = [
            `#${targetField}`,
            `[name="${targetField}"]`,
            `[data-field="${targetField}"]`,
            `.${targetField}`,
        ];

        let element = null;
        for (const selector of selectors) {
            element = document.querySelector(selector);
            if (element) break;
        }

        if (!element) {
            console.warn(`Target field not found: ${targetField}`);
            return false;
        }

        // Handle different element types
        const tagName = element.tagName.toLowerCase();
        const type = element.type?.toLowerCase();

        try {
            if (tagName === 'input' || tagName === 'textarea') {
                // For input/textarea, set the value
                if (type === 'checkbox') {
                    element.checked = Boolean(value);
                } else if (type === 'radio') {
                    if (element.value === value) {
                        element.checked = true;
                    }
                } else {
                    // Text input, textarea, etc.
                    const displayValue = typeof value === 'object'
                        ? JSON.stringify(value, null, 2)
                        : String(value);
                    element.value = displayValue;

                    // Trigger input event for reactive frameworks
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                }
            } else if (tagName === 'select') {
                element.value = value;
                element.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                // For display elements (div, span, etc.), set text content
                const displayValue = typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value);
                element.textContent = displayValue;
            }

            // Add visual indicator that this is injected data
            element.classList.add('dependency-injected');
            element.title = `Loaded from ${currentTool} dependencies`;

            console.log(`✓ Populated ${targetField} with dependency value:`, value);
            return true;

        } catch (error) {
            console.error(`Error populating field ${targetField}:`, error);
            return false;
        }
    }

    /**
     * Load all dependencies for current tool
     */
    async function loadDependencies(toolSlug) {
        const config = await loadConfig();
        if (!config) return;

        const toolDeps = config[toolSlug];
        if (!toolDeps || !toolDeps.fields || toolDeps.fields.length === 0) {
            console.log(`No dependencies configured for ${toolSlug}`);
            return;
        }

        console.log(`Loading ${toolDeps.fields.length} dependencies for ${toolSlug}...`);

        const results = {
            total: toolDeps.fields.length,
            loaded: 0,
            failed: 0,
        };

        // Load each dependency
        for (const dep of toolDeps.fields) {
            const value = await queryFieldOutput(dep.source_tool, dep.source_field);

            if (value !== null) {
                const success = populateField(dep.target_field, value);
                if (success) {
                    results.loaded++;
                } else {
                    results.failed++;
                }
            } else {
                console.log(`⚠️ No data found for ${dep.source_tool}.${dep.source_field}${dep.required ? ' (REQUIRED)' : ''}`);
                results.failed++;
            }
        }

        console.log(`Dependency loading complete: ${results.loaded}/${results.total} loaded, ${results.failed} failed`);

        // Show notification if dependencies were loaded
        if (results.loaded > 0) {
            showDependencyNotification(results.loaded, results.total);
        }
    }

    /**
     * Show notification that dependencies were loaded
     */
    function showDependencyNotification(loaded, total) {
        const notification = document.createElement('div');
        notification.className = 'dependency-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                animation: slideIn 0.3s ease-out;
            ">
                ✓ Loaded ${loaded}/${total} values from previous tools
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .dependency-injected {
                    border-left: 3px solid #10b981 !important;
                    background-color: #f0fdf4 !important;
                }
            </style>
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transition = 'opacity 0.3s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Initialize dependency injection for a tool
     * @param {string} toolSlug - Tool slug (e.g., 'know-thyself')
     * @param {string} schemaName - Schema name (e.g., 'sprint_01_know_thyself')
     */
    async function init(toolSlug, schemaName = null) {
        currentTool = toolSlug;
        currentSchema = schemaName || getSchemaName(toolSlug);

        console.log(`🔗 Dependency Injection initialized for ${toolSlug}`);

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => loadDependencies(toolSlug));
        } else {
            await loadDependencies(toolSlug);
        }
    }

    // Public API
    return {
        init,
        queryFieldOutput,
        populateField,
        loadDependencies,
    };
})();

// Make available globally
window.DependencyInjection = DependencyInjection;
