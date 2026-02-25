-- ============================================================================
-- POPULATE_ALL_TOOLS.sql
-- Populates tool_questions for ALL Fast Track tools EXCEPT know-thyself
-- (know-thyself is already populated separately)
--
-- Tools covered: woop, dream, values, team, fit, cash, energy, goals, focus,
-- performance, meeting-rhythm, market-size, segmentation-target-market,
-- target-segment-deep-dive, value-proposition, value-proposition-testing,
-- product-development, pricing, brand-marketing, customer-service,
-- route-to-market, core-activities, processes-decisions, fit-abc-analysis,
-- org-redesign, employer-branding, agile-teams, digitalization,
-- digital-heart, program-overview
-- ============================================================================

BEGIN;

-- ============================================================================
-- Sprint 0: WOOP (tool_slug='woop')
-- Section: WOOP Method
-- Tags: reflection, goal-setting
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('woop', 'wish', 'What is your wish? Your most important goal', 'textarea', 'WOOP Method', 1, 1, true, NULL, ARRAY['reflection','goal-setting'], '{"placeholder": "Describe your most important goal..."}'::jsonb),

  ('woop', 'outcome', 'What is the best outcome of achieving your wish?', 'textarea', 'WOOP Method', 1, 2, true, NULL, ARRAY['reflection','goal-setting'], '{"placeholder": "Visualize the best possible outcome..."}'::jsonb),

  ('woop', 'obstacle_external', 'What external obstacles stand in your way?', 'textarea', 'WOOP Method', 1, 3, false, NULL, ARRAY['reflection','goal-setting'], '{"placeholder": "List external barriers..."}'::jsonb),

  ('woop', 'obstacle_internal', 'What internal obstacle holds you back the most?', 'textarea', 'WOOP Method', 1, 4, true, NULL, ARRAY['reflection','goal-setting'], '{"placeholder": "Identify your main internal obstacle..."}'::jsonb),

  ('woop', 'plan_if_then', 'If [obstacle occurs], then I will [action]', 'textarea', 'WOOP Method', 1, 5, true, NULL, ARRAY['reflection','goal-setting'], '{"placeholder": "If... then I will..."}'::jsonb),

  ('woop', 'first_action', 'What is your very first concrete action?', 'textarea', 'WOOP Method', 1, 6, false, NULL, ARRAY['reflection','goal-setting'], '{"placeholder": "Your first concrete step..."}'::jsonb),

  ('woop', 'commitment_level', 'How committed are you? (1-10)', 'select', 'WOOP Method', 1, 7, false, NULL, ARRAY['reflection','goal-setting'], '{"placeholder": "Select your commitment level", "options": [1,2,3,4,5,6,7,8,9,10]}'::jsonb),

  ('woop', 'reflection', 'Final reflection on your WOOP', 'textarea', 'WOOP Method', 1, 8, false, NULL, ARRAY['reflection','goal-setting'], '{"placeholder": "Reflect on your WOOP exercise..."}'::jsonb);

-- ============================================================================
-- Sprint 2: Dream (tool_slug='dream')
-- Section: Company Dream
-- Tags: core, carries-forward, identity
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('dream', 'dream_narrative', 'Write your company dream narrative — the vivid story of where your company is heading', 'textarea', 'Company Dream', 1, 1, true, 'identity.dream.narrative', ARRAY['core','carries-forward','identity'], '{"placeholder": "Describe your vivid company dream..."}'::jsonb),

  ('dream', 'dream_visualization', 'Create a visualization board for your dream — images, words, symbols that represent your vision', 'compound', 'Company Dream', 1, 2, false, 'identity.dream.visualization', ARRAY['core','carries-forward','identity'], '{"placeholder": "Describe the visual elements of your dream..."}'::jsonb),

  ('dream', 'killer_conclusion', 'Write your corporate killer conclusion — the bold statement that captures your dream''s essence', 'textarea', 'Company Dream', 1, 3, true, 'identity.dream.killer_conclusion', ARRAY['core','carries-forward','identity'], '{"placeholder": "Write a bold concluding statement..."}'::jsonb),

  ('dream', 'one_sentence', 'Distill your dream into one powerful sentence', 'textarea', 'Company Dream', 1, 4, true, 'identity.dream.one_sentence', ARRAY['core','carries-forward','identity'], '{"placeholder": "One sentence that captures your dream..."}'::jsonb);

-- ============================================================================
-- Sprint 3: Values (tool_slug='values')
-- Section: Company Values
-- Tags: core, carries-forward, identity, values
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('values', 'core_values_list', 'Define 5-7 core company values', 'compound', 'Company Values', 1, 1, true, 'identity.values.core_list', ARRAY['core','carries-forward','identity','values'], '{"placeholder": "List your core values..."}'::jsonb),

  ('values', 'cool_not_cool', 'For each value, define Cool (encouraged) vs Not-Cool (unacceptable) behaviors', 'compound', 'Company Values', 1, 2, true, 'identity.values.cool_not_cool', ARRAY['core','carries-forward','identity','values'], '{"placeholder": "Define behaviors for each value..."}'::jsonb),

  ('values', 'red_lines', 'Define cultural laws — Yellow Lines (warnings) and Red Lines (instant consequences)', 'compound', 'Company Values', 1, 3, true, 'identity.values.red_lines', ARRAY['core','carries-forward','identity','values'], '{"placeholder": "Define your cultural boundaries..."}'::jsonb),

  ('values', 'recruitment_questions', 'Create values-based interview questions for hiring', 'compound', 'Company Values', 1, 4, false, 'identity.values.recruitment_questions', ARRAY['core','carries-forward','identity','values'], '{"placeholder": "Write interview questions tied to values..."}'::jsonb),

  ('values', 'rollout_plan', 'Plan how to communicate and roll out values to the team', 'textarea', 'Company Values', 1, 5, false, 'identity.values.rollout_plan', ARRAY['core','carries-forward','identity','values'], '{"placeholder": "Describe your rollout plan..."}'::jsonb);

-- ============================================================================
-- Sprint 4: Team (tool_slug='team')
-- Section: Team Health
-- Tags: team, leadership
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('team', 'dysfunction_scorecard', 'Rate your team on the 5 Dysfunctions (Trust, Conflict, Commitment, Accountability, Results)', 'compound', 'Team Health', 1, 1, true, 'identity.team.dysfunction_scorecard', ARRAY['team','leadership'], '{"placeholder": "Rate each dysfunction area..."}'::jsonb),

  ('team', 'trust_action_plan', 'Create specific actions to build trust within your team', 'textarea', 'Team Health', 1, 2, true, 'identity.team.trust_action_plan', ARRAY['team','leadership'], '{"placeholder": "List trust-building actions..."}'::jsonb),

  ('team', 'conflict_norms', 'Define healthy conflict norms — how your team will engage in productive debate', 'textarea', 'Team Health', 1, 3, false, 'identity.team.conflict_norms', ARRAY['team','leadership'], '{"placeholder": "Describe your conflict norms..."}'::jsonb),

  ('team', 'conflict_resolution_strategies', 'Document strategies for resolving team conflicts', 'compound', 'Team Health', 1, 4, false, 'identity.team.conflict_resolution_strategies', ARRAY['team','leadership'], '{"placeholder": "Outline conflict resolution strategies..."}'::jsonb),

  ('team', 'accountability_tracker', 'Set up a team accountability tracking system', 'compound', 'Team Health', 1, 5, false, 'identity.team.accountability_tracker', ARRAY['team','leadership'], '{"placeholder": "Design your accountability tracker..."}'::jsonb);

-- ============================================================================
-- Sprint 5: FIT Assessment (tool_slug='fit')
-- Section: FIT Assessment
-- Tags: people, assessment
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('fit', 'individual_scores', 'Rate each team member on FIT (Function fit, Individual fit, Team fit)', 'compound', 'FIT Assessment', 1, 1, true, 'identity.fit.individual_scores', ARRAY['people','assessment'], '{"placeholder": "Score each team member on F-I-T..."}'::jsonb),

  ('fit', 'abc_matrix', 'Classify team members into A (top performers), B (solid), C (underperforming)', 'compound', 'FIT Assessment', 1, 2, true, 'identity.fit.abc_matrix', ARRAY['people','assessment'], '{"placeholder": "Classify team members A, B, or C..."}'::jsonb);

-- ============================================================================
-- Sprint 6: Cash (tool_slug='cash')
-- Section: Cash Flow Analysis
-- Tags: finance, performance, carries-forward
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('cash', 'story_report', 'Your cash flow story — narrative summary of financial health', 'textarea', 'Cash Flow Analysis', 1, 1, false, 'performance.cash.story_report', ARRAY['finance','performance','carries-forward'], '{"placeholder": "Tell the story of your cash flow..."}'::jsonb),

  ('cash', 'power_of_one', 'Power of One analysis — impact of 1% improvement on each lever', 'compound', 'Cash Flow Analysis', 1, 2, true, 'performance.cash.power_of_one', ARRAY['finance','performance','carries-forward'], '{"placeholder": "Analyze 1% improvement impact..."}'::jsonb),

  ('cash', 'action_sheets', 'Profitability and liquidity improvement actions', 'compound', 'Cash Flow Analysis', 1, 3, false, 'performance.cash.action_sheets', ARRAY['finance','performance','carries-forward'], '{"placeholder": "List improvement actions..."}'::jsonb),

  ('cash', 'top_priority', 'Your #1 cash flow priority for the next 90 days', 'textarea', 'Cash Flow Analysis', 1, 4, true, 'performance.cash.top_priority', ARRAY['finance','performance','carries-forward'], '{"placeholder": "State your top cash flow priority..."}'::jsonb),

  ('cash', 'ler_ratio', 'Labour Efficiency Ratio analysis', 'compound', 'Cash Flow Analysis', 1, 5, false, 'performance.cash.ler_ratio_analysis', ARRAY['finance','performance','carries-forward'], '{"placeholder": "Analyze your LER..."}'::jsonb),

  ('cash', 'action_plan', 'Cash flow improvement action plan with WWW (Who, What, When)', 'compound', 'Cash Flow Analysis', 1, 6, true, 'performance.cash.action_plan', ARRAY['finance','performance','carries-forward'], '{"placeholder": "Define Who, What, When for each action..."}'::jsonb);

-- ============================================================================
-- Sprint 7: Energy (tool_slug='energy')
-- Section: Creating Energy
-- Tags: energy, habits, optional
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('energy', 'energy_audit', 'Energy audit — categorize activities into Stop, Do Less, Do More', 'compound', 'Creating Energy', 1, 1, true, 'performance.energy.audit', ARRAY['energy','habits','optional'], '{"placeholder": "Categorize your activities..."}'::jsonb),

  ('energy', 'habit_commitments', 'Individual habit commitments for better energy management', 'compound', 'Creating Energy', 1, 2, true, 'performance.energy.habit_commitments', ARRAY['energy','habits','optional'], '{"placeholder": "List your habit commitments..."}'::jsonb),

  ('energy', 'team_strategies', 'Team-level energy strategies and rituals', 'textarea', 'Creating Energy', 1, 3, false, 'performance.energy.team_strategies', ARRAY['energy','habits','optional'], '{"placeholder": "Describe team energy strategies..."}'::jsonb),

  ('energy', 'energy_woop', 'WOOP for your most important energy habit', 'compound', 'Creating Energy', 1, 4, false, 'performance.energy.woop', ARRAY['energy','habits','optional'], '{"placeholder": "Apply WOOP to your energy habit..."}'::jsonb);

-- ============================================================================
-- Sprint 8: Goals (tool_slug='goals')
-- Section: Goals & Priorities
-- Tags: goals, planning, carries-forward
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('goals', 'quarterly_targets', 'Define quarterly targets with measurable KPIs', 'compound', 'Goals & Priorities', 1, 1, true, 'performance.goals.quarterly_targets', ARRAY['goals','planning','carries-forward'], '{"placeholder": "Define your quarterly KPIs..."}'::jsonb),

  ('goals', 'impact_ease_matrix', 'Plot goals on Impact vs Ease matrix to prioritize', 'compound', 'Goals & Priorities', 1, 2, false, 'performance.goals.impact_ease_matrix', ARRAY['goals','planning','carries-forward'], '{"placeholder": "Prioritize by impact and ease..."}'::jsonb),

  ('goals', 'big_rocks', 'Identify your Big Rocks — the 3-5 priorities for the next 90 days', 'compound', 'Goals & Priorities', 1, 3, true, 'performance.goals.big_rocks', ARRAY['goals','planning','carries-forward'], '{"placeholder": "List your 3-5 big rocks..."}'::jsonb),

  ('goals', 'elephant_breakdown', 'Break big goals into small actionable pieces (Cut the Elephant)', 'compound', 'Goals & Priorities', 1, 4, false, 'performance.goals.elephant_breakdown', ARRAY['goals','planning','carries-forward'], '{"placeholder": "Break down your biggest goal..."}'::jsonb);

-- ============================================================================
-- Sprint 9: Focus (tool_slug='focus')
-- Section: Focus & Productivity
-- Tags: focus, productivity
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('focus', 'golden_hour', 'Design your Golden Hour schedule — protected time for deep work', 'compound', 'Focus & Productivity', 1, 1, true, 'performance.focus.golden_hour', ARRAY['focus','productivity'], '{"placeholder": "Design your golden hour schedule..."}'::jsonb),

  ('focus', 'distraction_plan', 'Create a distraction management plan', 'textarea', 'Focus & Productivity', 1, 2, true, 'performance.focus.distraction_plan', ARRAY['focus','productivity'], '{"placeholder": "Plan how to manage distractions..."}'::jsonb),

  ('focus', 'daily_reflection', 'Set up a daily reflection practice', 'textarea', 'Focus & Productivity', 1, 3, false, 'performance.focus.daily_reflection', ARRAY['focus','productivity'], '{"placeholder": "Describe your daily reflection routine..."}'::jsonb),

  ('focus', 'team_rituals', 'Define team productivity rituals', 'compound', 'Focus & Productivity', 1, 4, false, 'performance.focus.team_rituals', ARRAY['focus','productivity'], '{"placeholder": "List team productivity rituals..."}'::jsonb);

-- ============================================================================
-- Sprint 10: Performance (tool_slug='performance')
-- Section: Performance & Accountability
-- Tags: accountability, performance
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('performance', 'execution_dashboard', 'Build your execution dashboard with binary scoreboard and KPIs', 'compound', 'Performance & Accountability', 1, 1, true, 'performance.accountability.execution_dashboard', ARRAY['accountability','performance'], '{"placeholder": "Design your execution dashboard..."}'::jsonb),

  ('performance', 'five_why', '5-Why root cause analysis for performance gaps', 'compound', 'Performance & Accountability', 1, 2, false, 'performance.accountability.five_why', ARRAY['accountability','performance'], '{"placeholder": "Apply 5-Why analysis..."}'::jsonb),

  ('performance', 'consequences_table', 'Define accountability framework with consequences', 'compound', 'Performance & Accountability', 1, 3, true, 'performance.accountability.consequences', ARRAY['accountability','performance'], '{"placeholder": "Define consequences framework..."}'::jsonb);

-- ============================================================================
-- Sprint 11: Meeting Rhythm (tool_slug='meeting-rhythm')
-- Section: Meeting Rhythm
-- Tags: meetings, rhythm
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('meeting-rhythm', 'rhythm_dates', 'Set your meeting rhythm — daily huddles, weekly, monthly, quarterly, annual', 'compound', 'Meeting Rhythm', 1, 1, true, 'performance.meetings.rhythm_dates', ARRAY['meetings','rhythm'], '{"placeholder": "Define your meeting cadence..."}'::jsonb);

-- ============================================================================
-- Sprint 12: Market Size (tool_slug='market-size')
-- Section: Market Analysis
-- Tags: market, analysis, carries-forward
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('market-size', 'tam', 'Calculate your Total Addressable Market (TAM/SAM/SOM)', 'compound', 'Market Analysis', 1, 1, true, 'market.size.tam', ARRAY['market','analysis','carries-forward'], '{"placeholder": "Calculate TAM, SAM, and SOM..."}'::jsonb),

  ('market-size', 'driving_forces', 'Identify top 3-5 driving forces shaping your market', 'compound', 'Market Analysis', 1, 2, true, 'market.size.driving_forces', ARRAY['market','analysis','carries-forward'], '{"placeholder": "Identify market driving forces..."}'::jsonb);

-- ============================================================================
-- Sprint 13: Segmentation (tool_slug='segmentation-target-market')
-- Section: Market Segmentation
-- Tags: market, segmentation, carries-forward
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('segmentation-target-market', 'segments_list', 'Define behavioral customer segments', 'compound', 'Market Segmentation', 1, 1, true, 'market.segments.list', ARRAY['market','segmentation','carries-forward'], '{"placeholder": "Define your customer segments..."}'::jsonb),

  ('segmentation-target-market', 'primary_target', 'Select and describe your primary target segment', 'compound', 'Market Segmentation', 1, 2, true, 'market.segments.primary_target', ARRAY['market','segmentation','carries-forward'], '{"placeholder": "Describe your primary target segment..."}'::jsonb);

-- ============================================================================
-- Sprint 14: Target Deep Dive (tool_slug='target-segment-deep-dive')
-- Section: Customer Deep Dive
-- Tags: strategy, customer-research, carries-forward
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('target-segment-deep-dive', 'pains_matrix', 'Create a prioritized pains matrix for your target customers', 'compound', 'Customer Deep Dive', 1, 1, true, 'strategy.target.pains_matrix', ARRAY['strategy','customer-research','carries-forward'], '{"placeholder": "List and prioritize customer pains..."}'::jsonb),

  ('target-segment-deep-dive', 'persona', 'Build your core customer persona with demographics, psychographics, behaviors', 'compound', 'Customer Deep Dive', 1, 2, true, 'strategy.target.persona', ARRAY['strategy','customer-research','carries-forward'], '{"placeholder": "Build your customer persona..."}'::jsonb),

  ('target-segment-deep-dive', 'needs_gains', 'Map customer needs and desired gains', 'compound', 'Customer Deep Dive', 1, 3, false, 'strategy.target.needs_gains', ARRAY['strategy','customer-research','carries-forward'], '{"placeholder": "Map needs and gains..."}'::jsonb),

  ('target-segment-deep-dive', 'interview_summary', 'Summarize insights from customer interviews', 'textarea', 'Customer Deep Dive', 1, 4, false, 'strategy.target.interview_summary', ARRAY['strategy','customer-research','carries-forward'], '{"placeholder": "Summarize customer interview insights..."}'::jsonb);

-- ============================================================================
-- Sprint 15: Value Proposition (tool_slug='value-proposition')
-- Section: Value Proposition Design
-- Tags: strategy, core, carries-forward
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('value-proposition', 'vp_statement', 'Write your value proposition statement', 'textarea', 'Value Proposition Design', 1, 1, true, 'strategy.vp.statement', ARRAY['strategy','core','carries-forward'], '{"placeholder": "Write your value proposition..."}'::jsonb),

  ('value-proposition', 'anti_promise', 'Define your anti-value proposition — what you deliberately do NOT offer', 'textarea', 'Value Proposition Design', 1, 2, false, 'strategy.vp.anti_promise', ARRAY['strategy','core','carries-forward'], '{"placeholder": "What do you deliberately NOT offer?"}'::jsonb),

  ('value-proposition', 'pain_mapping', 'Map your solutions to specific customer pains', 'compound', 'Value Proposition Design', 1, 3, true, 'strategy.vp.pain_mapping', ARRAY['strategy','core','carries-forward'], '{"placeholder": "Map solutions to pains..."}'::jsonb),

  ('value-proposition', 'differentiators', 'Audit your key differentiators vs competitors', 'compound', 'Value Proposition Design', 1, 4, true, 'strategy.vp.differentiators', ARRAY['strategy','core','carries-forward'], '{"placeholder": "List your key differentiators..."}'::jsonb);

-- ============================================================================
-- Sprint 16: VP Testing (tool_slug='value-proposition-testing')
-- Section: VP Validation
-- Tags: validation, testing
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('value-proposition-testing', 'customer_feedback', 'Document customer feedback from value proposition interviews', 'compound', 'VP Validation', 1, 1, true, 'strategy.testing.customer_feedback', ARRAY['validation','testing'], '{"placeholder": "Document customer feedback..."}'::jsonb),

  ('value-proposition-testing', 'comparison_results', 'Record comparison test results vs competitor promises', 'compound', 'VP Validation', 1, 2, false, 'strategy.testing.comparison', ARRAY['validation','testing'], '{"placeholder": "Record comparison results..."}'::jsonb),

  ('value-proposition-testing', 'reality_log', 'Maintain reality test log — evidence for/against your VP', 'compound', 'VP Validation', 1, 3, true, 'strategy.testing.reality_log', ARRAY['validation','testing'], '{"placeholder": "Log evidence for and against..."}'::jsonb),

  ('value-proposition-testing', 'final_vp', 'Write your finalized, tested value proposition', 'textarea', 'VP Validation', 1, 4, true, 'strategy.testing.final_vp', ARRAY['validation','testing'], '{"placeholder": "Write your final value proposition..."}'::jsonb),

  ('value-proposition-testing', 'next_steps', 'Define implementation strategy and next steps', 'textarea', 'VP Validation', 1, 5, false, 'strategy.testing.next_steps', ARRAY['validation','testing'], '{"placeholder": "Define next steps..."}'::jsonb);

-- ============================================================================
-- Sprint 17: Product Development (tool_slug='product-development')
-- Section: Product Strategy
-- Tags: execution, product
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('product-development', 'feature_list', 'Define your product feature list prioritized by customer value', 'compound', 'Product Strategy', 1, 1, true, 'execution.product.feature_list', ARRAY['execution','product'], '{"placeholder": "List and prioritize features..."}'::jsonb),

  ('product-development', 'portfolio', 'Map your product/service portfolio', 'compound', 'Product Strategy', 1, 2, true, 'execution.product.portfolio', ARRAY['execution','product'], '{"placeholder": "Map your portfolio..."}'::jsonb);

-- ============================================================================
-- Sprint 18: Pricing (tool_slug='pricing')
-- Section: Pricing Strategy
-- Tags: execution, pricing
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('pricing', 'pricing_tiers', 'Design your pricing tiers/structure', 'compound', 'Pricing Strategy', 1, 1, true, 'execution.pricing.tiers', ARRAY['execution','pricing'], '{"placeholder": "Design your pricing tiers..."}'::jsonb),

  ('pricing', 'anchor_price', 'Set your anchor pricing strategy', 'compound', 'Pricing Strategy', 1, 2, false, 'execution.pricing.anchor', ARRAY['execution','pricing'], '{"placeholder": "Define your anchor pricing..."}'::jsonb);

-- ============================================================================
-- Sprint 19: Brand & Marketing (tool_slug='brand-marketing')
-- Section: Brand Strategy
-- Tags: execution, brand, marketing
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('brand-marketing', 'cult_model', 'Build your Cult Brand model — emotional connection strategy', 'compound', 'Brand Strategy', 1, 1, true, 'execution.brand.cult_model', ARRAY['execution','brand','marketing'], '{"placeholder": "Build your cult brand model..."}'::jsonb),

  ('brand-marketing', 'roadmap', 'Create your marketing roadmap', 'compound', 'Brand Strategy', 1, 2, true, 'execution.brand.roadmap', ARRAY['execution','brand','marketing'], '{"placeholder": "Create your marketing roadmap..."}'::jsonb);

-- ============================================================================
-- Sprint 20: Customer Service (tool_slug='customer-service')
-- Section: Customer Service
-- Tags: execution, service, optional
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('customer-service', 'journey_map', 'Map the complete customer journey with touchpoints', 'compound', 'Customer Service', 1, 1, true, 'execution.service.journey_map', ARRAY['execution','service','optional'], '{"placeholder": "Map your customer journey..."}'::jsonb),

  ('customer-service', 'service_standards', 'Define customer service standards and SLAs', 'compound', 'Customer Service', 1, 2, false, 'execution.service.standards', ARRAY['execution','service','optional'], '{"placeholder": "Define service standards..."}'::jsonb);

-- ============================================================================
-- Sprint 21: Route to Market (tool_slug='route-to-market')
-- Section: Distribution Strategy
-- Tags: execution, distribution
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('route-to-market', 'channels', 'Define your go-to-market channels', 'compound', 'Distribution Strategy', 1, 1, true, 'execution.rtm.channels', ARRAY['execution','distribution'], '{"placeholder": "Define your GTM channels..."}'::jsonb),

  ('route-to-market', 'rtm_roadmap', 'Create your route-to-market roadmap', 'compound', 'Distribution Strategy', 1, 2, true, 'execution.rtm.roadmap', ARRAY['execution','distribution'], '{"placeholder": "Create your RTM roadmap..."}'::jsonb);

-- ============================================================================
-- Sprint 22: Core Activities (tool_slug='core-activities')
-- Section: Core Activities
-- Tags: organization, core
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('core-activities', 'top5_activities', 'Identify your top 5 core business activities that deliver the most value', 'compound', 'Core Activities', 1, 1, true, 'org.activities.top5', ARRAY['organization','core'], '{"placeholder": "List your top 5 core activities..."}'::jsonb),

  ('core-activities', 'activity_owners', 'Assign clear owners for each core activity', 'compound', 'Core Activities', 1, 2, true, 'org.activities.owners', ARRAY['organization','core'], '{"placeholder": "Assign owners to activities..."}'::jsonb);

-- ============================================================================
-- Sprint 23: Processes & Decisions (tool_slug='processes-decisions')
-- Section: Processes & Decisions
-- Tags: organization, processes
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('processes-decisions', 'decision_rights', 'Define decision rights — who decides what (RACI-style)', 'compound', 'Processes & Decisions', 1, 1, true, 'org.processes.decision_rights', ARRAY['organization','processes'], '{"placeholder": "Define decision rights..."}'::jsonb),

  ('processes-decisions', 'top3_per_activity', 'Map top 3 processes for each core activity', 'compound', 'Processes & Decisions', 1, 2, true, 'org.processes.top3_per_activity', ARRAY['organization','processes'], '{"placeholder": "Map top 3 processes per activity..."}'::jsonb),

  ('processes-decisions', 'capabilities', 'Assess required capabilities vs current state', 'compound', 'Processes & Decisions', 1, 3, false, 'org.processes.capabilities', ARRAY['organization','processes'], '{"placeholder": "Assess capability gaps..."}'::jsonb),

  ('processes-decisions', 'kpi_scoreboard', 'Build process KPI scoreboard', 'compound', 'Processes & Decisions', 1, 4, false, 'org.processes.kpi_scoreboard', ARRAY['organization','processes'], '{"placeholder": "Build your KPI scoreboard..."}'::jsonb);

-- ============================================================================
-- Sprint 24: FIT & ABC Analysis (tool_slug='fit-abc-analysis')
-- Section: People Assessment
-- Tags: organization, people, assessment
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('fit-abc-analysis', 'classification', 'Classify all roles/people using ABC framework', 'compound', 'People Assessment', 1, 1, true, 'org.abc.classification', ARRAY['organization','people','assessment'], '{"placeholder": "Classify roles using ABC..."}'::jsonb),

  ('fit-abc-analysis', 'talent_gaps', 'Identify talent gaps by role and capability', 'compound', 'People Assessment', 1, 2, true, 'org.abc.talent_gaps', ARRAY['organization','people','assessment'], '{"placeholder": "Identify talent gaps..."}'::jsonb),

  ('fit-abc-analysis', 'a_player_agreements', 'Create A-Player performance agreements', 'compound', 'People Assessment', 1, 3, false, 'org.abc.a_player_agreements', ARRAY['organization','people','assessment'], '{"placeholder": "Create A-Player agreements..."}'::jsonb);

-- ============================================================================
-- Sprint 25: Org Redesign (tool_slug='org-redesign')
-- Section: Organizational Design
-- Tags: organization, design, carries-forward
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('org-redesign', 'machine_blueprint', 'Design your organizational machine blueprint — structure that delivers strategy', 'compound', 'Organizational Design', 1, 1, true, 'org.redesign.machine_blueprint', ARRAY['organization','design','carries-forward'], '{"placeholder": "Design your org blueprint..."}'::jsonb),

  ('org-redesign', 'right_seats', 'Map right people to right seats', 'compound', 'Organizational Design', 1, 2, true, 'org.redesign.right_seats', ARRAY['organization','design','carries-forward'], '{"placeholder": "Map people to seats..."}'::jsonb),

  ('org-redesign', 'strategy_shadow', 'Create strategy shadow org chart', 'compound', 'Organizational Design', 1, 3, false, 'org.redesign.strategy_shadow', ARRAY['organization','design','carries-forward'], '{"placeholder": "Create shadow org chart..."}'::jsonb);

-- ============================================================================
-- Sprint 26: Employer Branding (tool_slug='employer-branding')
-- Section: Employer Brand
-- Tags: people, recruitment
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('employer-branding', 'evp', 'Write your Employer Value Proposition — why top talent should join you', 'textarea', 'Employer Brand', 1, 1, true, 'people.employer.evp', ARRAY['people','recruitment'], '{"placeholder": "Write your EVP..."}'::jsonb),

  ('employer-branding', 'recruitment_playbook', 'Build your values-based recruitment playbook', 'compound', 'Employer Brand', 1, 2, false, 'people.employer.recruitment_playbook', ARRAY['people','recruitment'], '{"placeholder": "Build your recruitment playbook..."}'::jsonb);

-- ============================================================================
-- Sprint 27: Agile Teams (tool_slug='agile-teams')
-- Section: Agile Teams
-- Tags: people, agile, optional
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('agile-teams', 'team_charter', 'Create agile team charters with mission, boundaries, and cadence', 'compound', 'Agile Teams', 1, 1, true, 'people.agile.team_charter', ARRAY['people','agile','optional'], '{"placeholder": "Create your team charter..."}'::jsonb),

  ('agile-teams', 'sprint_design', 'Design team sprint cycles aligned to core activities', 'compound', 'Agile Teams', 1, 2, false, 'people.agile.sprint_design', ARRAY['people','agile','optional'], '{"placeholder": "Design your sprint cycles..."}'::jsonb);

-- ============================================================================
-- Sprint 28: Digitalization (tool_slug='digitalization')
-- Section: Digital Transformation
-- Tags: tech, digital
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('digitalization', 'digital_audit', 'Conduct digitalization audit — current vs desired state for top processes', 'compound', 'Digital Transformation', 1, 1, true, 'tech.digital.audit', ARRAY['tech','digital'], '{"placeholder": "Audit current vs desired digital state..."}'::jsonb),

  ('digitalization', 'baby_ai', 'Design your first AI pilot use case', 'compound', 'Digital Transformation', 1, 2, true, 'tech.digital.baby_ai', ARRAY['tech','digital'], '{"placeholder": "Design your AI pilot..."}'::jsonb);

-- ============================================================================
-- Sprint 29: Digital Heart (tool_slug='digital-heart')
-- Section: Digital Infrastructure
-- Tags: tech, infrastructure
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('digital-heart', 'blueprint', 'Design your digital heart blueprint — the core tech infrastructure', 'compound', 'Digital Infrastructure', 1, 1, true, 'tech.heart.blueprint', ARRAY['tech','infrastructure'], '{"placeholder": "Design your digital heart..."}'::jsonb),

  ('digital-heart', 'implementation_plan', 'Create digital implementation roadmap', 'compound', 'Digital Infrastructure', 1, 2, false, 'tech.heart.implementation_plan', ARRAY['tech','infrastructure'], '{"placeholder": "Create your implementation plan..."}'::jsonb);

-- ============================================================================
-- Sprint 30: Program Overview (tool_slug='program-overview')
-- Section: Final Synthesis
-- Tags: synthesis, final
-- ============================================================================

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata)
VALUES
  ('program-overview', 'twelve_month_plan', 'Create your 12-month strategic execution plan', 'compound', 'Final Synthesis', 1, 1, true, 'synthesis.twelve_month_plan', ARRAY['synthesis','final'], '{"placeholder": "Create your 12-month plan..."}'::jsonb),

  ('program-overview', 'key_metrics', 'Define key success metrics for the next 12 months', 'compound', 'Final Synthesis', 1, 2, true, 'synthesis.key_metrics', ARRAY['synthesis','final'], '{"placeholder": "Define your success metrics..."}'::jsonb),

  ('program-overview', 'final_canvas', 'Complete your final Fast Track canvas — one-page strategy summary', 'compound', 'Final Synthesis', 1, 3, false, 'synthesis.final_canvas', ARRAY['synthesis','final'], '{"placeholder": "Complete your strategy canvas..."}'::jsonb);

COMMIT;

-- ============================================================================
-- VERIFICATION: Count questions per tool
-- ============================================================================
SELECT tool_slug, count(*) FROM tool_questions GROUP BY tool_slug ORDER BY tool_slug;
