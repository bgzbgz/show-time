/**
 * Dependency Injection Library
 * Automatically loads field values from dependent tools
 * via the ToolDB shared library (3-table architecture).
 *
 * Usage in tool HTML:
 * <script src="../../shared/js/tool-db.js"></script>
 * <script src="../../shared/js/dependency-injection.js"></script>
 * <script>
 *   DependencyInjection.init('tool-slug');
 * </script>
 */

const DependencyInjection = (function() {
    'use strict';

    let currentTool = null;

    // Embedded dependencies configuration
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
        },
        "target-segment-deep-dive": {
            "depends_on": ["segmentation-target-market", "market-size"],
            "fields": [{
                "source_tool": "segmentation-target-market",
                "source_field": "market.segments.primary_target",
                "target_field": "primary_target_context",
                "display_label": "Primary Target Segment"
            }, {
                "source_tool": "market-size",
                "source_field": "market.size.profit_pool",
                "target_field": "profit_pool_context",
                "display_label": "Profit Pool Analysis"
            }]
        },
        "value-proposition": {
            "depends_on": ["target-segment-deep-dive", "dream"],
            "fields": [{
                "source_tool": "target-segment-deep-dive",
                "source_field": "strategy.target.pains_matrix",
                "target_field": "pains_matrix_context",
                "display_label": "Prioritized Pains Matrix"
            }, {
                "source_tool": "target-segment-deep-dive",
                "source_field": "strategy.target.needs_gains",
                "target_field": "needs_gains_context",
                "display_label": "Needs & Gains Inventory"
            }, {
                "source_tool": "dream",
                "source_field": "identity.dream.one_sentence",
                "target_field": "dream_context",
                "display_label": "One-Sentence Dream"
            }]
        },
        "value-proposition-testing": {
            "depends_on": ["value-proposition", "target-segment-deep-dive"],
            "fields": [{
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "target-segment-deep-dive",
                "source_field": "strategy.target.interview_summary",
                "target_field": "interview_summary_context",
                "display_label": "Interview Summary"
            }, {
                "source_tool": "target-segment-deep-dive",
                "source_field": "strategy.target.needs_gains",
                "target_field": "needs_gains_context",
                "display_label": "Target Customer Pains and Needs"
            }]
        },
        "product-development": {
            "depends_on": ["segmentation-target-market", "target-segment-deep-dive", "value-proposition"],
            "fields": [{
                "source_tool": "segmentation-target-market",
                "source_field": "market.segments.primary_target",
                "target_field": "primary_target_context",
                "display_label": "Primary Target Segment"
            }, {
                "source_tool": "target-segment-deep-dive",
                "source_field": "strategy.target.pains_matrix",
                "target_field": "pains_matrix_context",
                "display_label": "Prioritized Pains Matrix"
            }, {
                "source_tool": "target-segment-deep-dive",
                "source_field": "strategy.target.needs_gains",
                "target_field": "needs_gains_context",
                "display_label": "Needs & Gains Inventory"
            }, {
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "target-segment-deep-dive",
                "source_field": "strategy.target.interview_summary",
                "target_field": "interview_summary_context",
                "display_label": "Interview Summary"
            }]
        },
        "pricing": {
            "depends_on": ["segmentation-target-market", "target-segment-deep-dive", "value-proposition", "product-development"],
            "fields": [{
                "source_tool": "segmentation-target-market",
                "source_field": "market.segments.primary_target",
                "target_field": "primary_target_context",
                "display_label": "Primary Target Segment"
            }, {
                "source_tool": "target-segment-deep-dive",
                "source_field": "strategy.target.pains_matrix",
                "target_field": "pains_matrix_context",
                "display_label": "Prioritized Pains Matrix"
            }, {
                "source_tool": "target-segment-deep-dive",
                "source_field": "strategy.target.needs_gains",
                "target_field": "needs_gains_context",
                "display_label": "Needs & Gains Inventory"
            }, {
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "product-development",
                "source_field": "execution.product.feature_list",
                "target_field": "feature_list_context",
                "display_label": "Feature List"
            }, {
                "source_tool": "product-development",
                "source_field": "execution.product.portfolio",
                "target_field": "product_portfolio_context",
                "display_label": "Product Portfolio"
            }]
        },
        "brand-marketing": {
            "depends_on": ["segmentation-target-market", "value-proposition", "product-development", "pricing"],
            "fields": [{
                "source_tool": "segmentation-target-market",
                "source_field": "market.segments.primary_target",
                "target_field": "primary_target_context",
                "display_label": "Primary Target Segment"
            }, {
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "product-development",
                "source_field": "execution.product.portfolio",
                "target_field": "product_portfolio_context",
                "display_label": "Product Portfolio"
            }, {
                "source_tool": "pricing",
                "source_field": "execution.pricing.tiers",
                "target_field": "pricing_tiers_context",
                "display_label": "Price Tiers"
            }]
        },
        "customer-service": {
            "depends_on": ["segmentation-target-market", "value-proposition", "product-development", "brand-marketing"],
            "fields": [{
                "source_tool": "segmentation-target-market",
                "source_field": "market.segments.primary_target",
                "target_field": "primary_target_context",
                "display_label": "Primary Target Segment"
            }, {
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "product-development",
                "source_field": "execution.product.portfolio",
                "target_field": "product_portfolio_context",
                "display_label": "Product Portfolio"
            }, {
                "source_tool": "brand-marketing",
                "source_field": "execution.brand.cult_model",
                "target_field": "cult_model_context",
                "display_label": "Cult Brand Model"
            }]
        },
        "route-to-market": {
            "depends_on": ["segmentation-target-market", "value-proposition", "product-development", "pricing", "brand-marketing"],
            "fields": [{
                "source_tool": "segmentation-target-market",
                "source_field": "market.segments.primary_target",
                "target_field": "primary_target_context",
                "display_label": "Primary Target Segment"
            }, {
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "product-development",
                "source_field": "execution.product.portfolio",
                "target_field": "product_portfolio_context",
                "display_label": "Product Portfolio"
            }, {
                "source_tool": "pricing",
                "source_field": "execution.pricing.tiers",
                "target_field": "pricing_tiers_context",
                "display_label": "Price Tiers"
            }, {
                "source_tool": "brand-marketing",
                "source_field": "execution.brand.roadmap",
                "target_field": "marketing_roadmap_context",
                "display_label": "Marketing Roadmap"
            }]
        },
        "core-activities": {
            "depends_on": ["value-proposition", "route-to-market"],
            "fields": [{
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "route-to-market",
                "source_field": "execution.rtm.channels",
                "target_field": "rtm_channels_context",
                "display_label": "RTM Channels"
            }]
        },
        "processes-decisions": {
            "depends_on": ["value-proposition", "core-activities"],
            "fields": [{
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "core-activities",
                "source_field": "org.activities.top5",
                "target_field": "top5_activities_context",
                "display_label": "Top 5 Core Activities"
            }, {
                "source_tool": "core-activities",
                "source_field": "org.activities.owners",
                "target_field": "activity_owners_context",
                "display_label": "Core Activity Owners"
            }]
        },
        "fit-abc-analysis": {
            "depends_on": ["value-proposition", "core-activities", "processes-decisions", "values"],
            "fields": [{
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "core-activities",
                "source_field": "org.activities.top5",
                "target_field": "top5_activities_context",
                "display_label": "Top 5 Core Activities"
            }, {
                "source_tool": "processes-decisions",
                "source_field": "org.processes.decision_rights",
                "target_field": "decision_rights_context",
                "display_label": "Decision Rights"
            }, {
                "source_tool": "values",
                "source_field": "identity.values.cool_not_cool",
                "target_field": "behaviors_context",
                "display_label": "Cool/Not-Cool Behaviors"
            }]
        },
        "org-redesign": {
            "depends_on": ["value-proposition", "core-activities", "processes-decisions", "fit-abc-analysis"],
            "fields": [{
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "core-activities",
                "source_field": "org.activities.top5",
                "target_field": "top5_activities_context",
                "display_label": "Top 5 Core Activities"
            }, {
                "source_tool": "processes-decisions",
                "source_field": "org.processes.decision_rights",
                "target_field": "decision_rights_context",
                "display_label": "Decision Rights"
            }, {
                "source_tool": "fit-abc-analysis",
                "source_field": "org.abc.classification",
                "target_field": "abc_classification_context",
                "display_label": "ABC Classification"
            }, {
                "source_tool": "fit-abc-analysis",
                "source_field": "org.abc.talent_gaps",
                "target_field": "talent_gaps_context",
                "display_label": "Talent Gaps"
            }]
        },
        "employer-branding": {
            "depends_on": ["values", "dream", "fit-abc-analysis", "org-redesign", "value-proposition"],
            "fields": [{
                "source_tool": "values",
                "source_field": "identity.values.cool_not_cool",
                "target_field": "behaviors_context",
                "display_label": "Cool/Not-Cool Behaviors"
            }, {
                "source_tool": "dream",
                "source_field": "identity.dream.one_sentence",
                "target_field": "dream_context",
                "display_label": "One-Sentence Dream"
            }, {
                "source_tool": "fit-abc-analysis",
                "source_field": "org.abc.talent_gaps",
                "target_field": "talent_gaps_context",
                "display_label": "Talent Gap Report"
            }, {
                "source_tool": "org-redesign",
                "source_field": "org.redesign.right_seats",
                "target_field": "right_seats_context",
                "display_label": "Right Seats Assignment"
            }, {
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }]
        },
        "agile-teams": {
            "depends_on": ["values", "dream", "fit-abc-analysis", "org-redesign", "value-proposition"],
            "fields": [{
                "source_tool": "values",
                "source_field": "identity.values.cool_not_cool",
                "target_field": "behaviors_context",
                "display_label": "Cool/Not-Cool Behaviors"
            }, {
                "source_tool": "dream",
                "source_field": "identity.dream.one_sentence",
                "target_field": "dream_context",
                "display_label": "One-Sentence Dream"
            }, {
                "source_tool": "fit-abc-analysis",
                "source_field": "org.abc.talent_gaps",
                "target_field": "talent_gaps_context",
                "display_label": "Talent Gap Report"
            }, {
                "source_tool": "org-redesign",
                "source_field": "org.redesign.right_seats",
                "target_field": "right_seats_context",
                "display_label": "Right Seats Assignment"
            }, {
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }]
        },
        "digitalization": {
            "depends_on": ["dream", "values", "target-segment-deep-dive", "value-proposition", "org-redesign", "processes-decisions"],
            "fields": [{
                "source_tool": "dream",
                "source_field": "identity.dream.one_sentence",
                "target_field": "dream_context",
                "display_label": "One-Sentence Dream"
            }, {
                "source_tool": "values",
                "source_field": "identity.values.core_list",
                "target_field": "core_values_context",
                "display_label": "Core Company Values"
            }, {
                "source_tool": "target-segment-deep-dive",
                "source_field": "strategy.target.persona",
                "target_field": "customer_persona_context",
                "display_label": "Customer Persona"
            }, {
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "org-redesign",
                "source_field": "org.redesign.machine_blueprint",
                "target_field": "machine_blueprint_context",
                "display_label": "Machine Blueprint"
            }, {
                "source_tool": "processes-decisions",
                "source_field": "org.processes.top3_per_activity",
                "target_field": "core_processes_context",
                "display_label": "Core Processes"
            }]
        },
        "digital-heart": {
            "depends_on": ["dream", "values", "value-proposition", "org-redesign", "digitalization"],
            "fields": [{
                "source_tool": "dream",
                "source_field": "identity.dream.one_sentence",
                "target_field": "dream_context",
                "display_label": "One-Sentence Dream"
            }, {
                "source_tool": "values",
                "source_field": "identity.values.core_list",
                "target_field": "core_values_context",
                "display_label": "Core Company Values"
            }, {
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition Statement"
            }, {
                "source_tool": "org-redesign",
                "source_field": "org.redesign.machine_blueprint",
                "target_field": "machine_blueprint_context",
                "display_label": "Machine Blueprint"
            }, {
                "source_tool": "digitalization",
                "source_field": "tech.digital.audit",
                "target_field": "digital_audit_context",
                "display_label": "Digitalization Audit"
            }, {
                "source_tool": "digitalization",
                "source_field": "tech.digital.baby_ai",
                "target_field": "ai_pilot_context",
                "display_label": "AI Pilot Use Case"
            }]
        },
        "program-overview": {
            "depends_on": ["dream", "values", "fit", "goals", "value-proposition", "route-to-market", "org-redesign", "employer-branding", "digital-heart"],
            "fields": [{
                "source_tool": "dream",
                "source_field": "identity.dream.one_sentence",
                "target_field": "dream_context",
                "display_label": "One-Sentence Dream"
            }, {
                "source_tool": "values",
                "source_field": "identity.values.core_list",
                "target_field": "core_values_context",
                "display_label": "Core Values"
            }, {
                "source_tool": "fit",
                "source_field": "identity.fit.abc_matrix",
                "target_field": "abc_matrix_context",
                "display_label": "ABC Matrix"
            }, {
                "source_tool": "goals",
                "source_field": "performance.goals.quarterly_targets",
                "target_field": "quarterly_targets_context",
                "display_label": "Quarterly Targets"
            }, {
                "source_tool": "value-proposition",
                "source_field": "strategy.vp.statement",
                "target_field": "vp_statement_context",
                "display_label": "Value Proposition"
            }, {
                "source_tool": "route-to-market",
                "source_field": "execution.rtm.roadmap",
                "target_field": "rtm_roadmap_context",
                "display_label": "RTM Roadmap"
            }, {
                "source_tool": "org-redesign",
                "source_field": "org.redesign.machine_blueprint",
                "target_field": "machine_blueprint_context",
                "display_label": "Machine Blueprint"
            }, {
                "source_tool": "employer-branding",
                "source_field": "people.employer.evp",
                "target_field": "employer_evp_context",
                "display_label": "Employer Value Proposition"
            }, {
                "source_tool": "digital-heart",
                "source_field": "tech.heart.blueprint",
                "target_field": "digital_blueprint_context",
                "display_label": "Digital Blueprint"
            }]
        }
    };

    /**
     * Query field value using ToolDB.getDependency (replaces old RPC/schema approach)
     */
    async function queryFieldOutput(sourceTool, referenceKey) {
        const userId = localStorage.getItem('ft_user_id');
        if (!userId) {
            console.warn('No user ID found in localStorage');
            return null;
        }

        if (!window.ToolDB) {
            console.warn('ToolDB not loaded — cannot query dependencies');
            return null;
        }

        try {
            return await ToolDB.getDependency(userId, referenceKey);
        } catch (error) {
            console.error(`Error querying ${sourceTool}.${referenceKey}:`, error);
            return null;
        }
    }

    /**
     * Populate a field with dependency value
     */
    function populateField(targetField, value) {
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

        const tagName = element.tagName.toLowerCase();
        const type = element.type?.toLowerCase();

        try {
            if (tagName === 'input' || tagName === 'textarea') {
                if (type === 'checkbox') {
                    element.checked = Boolean(value);
                } else if (type === 'radio') {
                    if (element.value === value) {
                        element.checked = true;
                    }
                } else {
                    const displayValue = typeof value === 'object'
                        ? JSON.stringify(value, null, 2)
                        : String(value);
                    element.value = displayValue;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                }
            } else if (tagName === 'select') {
                element.value = value;
                element.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                const displayValue = typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value);
                element.textContent = displayValue;
            }

            element.classList.add('dependency-injected');
            element.title = `Loaded from ${currentTool} dependencies`;

            console.log(`Populated ${targetField} with dependency value`);
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
        const toolDeps = dependenciesConfig[toolSlug];
        if (!toolDeps || !toolDeps.fields || toolDeps.fields.length === 0) {
            console.log(`No dependencies configured for ${toolSlug}`);
            return;
        }

        console.log(`Loading ${toolDeps.fields.length} dependencies for ${toolSlug}...`);

        const results = { total: toolDeps.fields.length, loaded: 0, failed: 0 };

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
                console.log(`No data found for ${dep.source_tool}.${dep.source_field}`);
                results.failed++;
            }
        }

        console.log(`Dependency loading complete: ${results.loaded}/${results.total} loaded, ${results.failed} failed`);

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
                Loaded ${loaded}/${total} values from previous tools
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

        setTimeout(() => {
            notification.style.transition = 'opacity 0.3s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Initialize dependency injection for a tool
     * @param {string} toolSlug - Tool slug (e.g., 'know-thyself')
     */
    async function init(toolSlug) {
        currentTool = toolSlug;

        console.log(`Dependency Injection initialized for ${toolSlug}`);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => loadDependencies(toolSlug));
        } else {
            await loadDependencies(toolSlug);
        }
    }

    return {
        init,
        queryFieldOutput,
        populateField,
        loadDependencies,
        getDependenciesConfig: function() { return dependenciesConfig; },
    };
})();

window.DependencyInjection = DependencyInjection;
