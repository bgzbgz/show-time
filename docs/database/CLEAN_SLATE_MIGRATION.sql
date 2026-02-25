-- ============================================================================
-- CLEAN SLATE: Wipe everything and rebuild with 3 clear tables
-- ============================================================================
-- Run this in the SQL Editor of your "Digi LMS tools" project
-- (https://vpfayzzjnegdefjrnyoc.supabase.co)
--
-- This will:
--   1. Drop ALL sprint schemas (sprint_00_woop, sprint_01_know_thyself, etc.)
--   2. Drop everything in the public schema
--   3. Create 3 clean tables: users, tool_questions, user_responses
--   4. Populate Know Thyself as a test (23 questions)
--   5. Enable RLS with appropriate policies
--
-- AFTER THIS: Your Supabase will have exactly 3 tables. That's it.
-- ============================================================================


-- ============================================================================
-- STEP 1: DROP ALL SPRINT SCHEMAS
-- ============================================================================
-- These are the per-tool schemas that made everything confusing.
-- CASCADE drops all tables, functions, etc. within each schema.

DROP SCHEMA IF EXISTS sprint_00_woop CASCADE;
DROP SCHEMA IF EXISTS sprint_01_know_thyself CASCADE;
DROP SCHEMA IF EXISTS sprint_02_dream CASCADE;
DROP SCHEMA IF EXISTS sprint_03_values CASCADE;
DROP SCHEMA IF EXISTS sprint_04_team CASCADE;
DROP SCHEMA IF EXISTS sprint_05_fit CASCADE;
DROP SCHEMA IF EXISTS sprint_06_cash CASCADE;
DROP SCHEMA IF EXISTS sprint_06_market_size CASCADE;
DROP SCHEMA IF EXISTS sprint_07_energy CASCADE;
DROP SCHEMA IF EXISTS sprint_07_segmentation CASCADE;
DROP SCHEMA IF EXISTS sprint_08_goals CASCADE;
DROP SCHEMA IF EXISTS sprint_08_target_segment CASCADE;
DROP SCHEMA IF EXISTS sprint_09_focus CASCADE;
DROP SCHEMA IF EXISTS sprint_09_value_proposition CASCADE;
DROP SCHEMA IF EXISTS sprint_10_performance CASCADE;
DROP SCHEMA IF EXISTS sprint_10_vp_testing CASCADE;
DROP SCHEMA IF EXISTS sprint_11_meeting_rhythm CASCADE;
DROP SCHEMA IF EXISTS sprint_11_product_dev CASCADE;
DROP SCHEMA IF EXISTS sprint_12_market_size CASCADE;
DROP SCHEMA IF EXISTS sprint_12_pricing CASCADE;
DROP SCHEMA IF EXISTS sprint_13_brand_marketing CASCADE;
DROP SCHEMA IF EXISTS sprint_13_segmentation CASCADE;
DROP SCHEMA IF EXISTS sprint_14_customer_service CASCADE;
DROP SCHEMA IF EXISTS sprint_14_target_segment CASCADE;
DROP SCHEMA IF EXISTS sprint_15_route_to_market CASCADE;
DROP SCHEMA IF EXISTS sprint_15_value_proposition CASCADE;
DROP SCHEMA IF EXISTS sprint_16_core_activities CASCADE;
DROP SCHEMA IF EXISTS sprint_16_vp_testing CASCADE;
DROP SCHEMA IF EXISTS sprint_17_processes CASCADE;
DROP SCHEMA IF EXISTS sprint_17_product_development CASCADE;
DROP SCHEMA IF EXISTS sprint_18_digitalization CASCADE;
DROP SCHEMA IF EXISTS sprint_18_pricing CASCADE;
DROP SCHEMA IF EXISTS sprint_19_brand_marketing CASCADE;
DROP SCHEMA IF EXISTS sprint_19_fit CASCADE;
DROP SCHEMA IF EXISTS sprint_20_customer_service CASCADE;
DROP SCHEMA IF EXISTS sprint_20_fit_abc CASCADE;
DROP SCHEMA IF EXISTS sprint_21_org_redesign CASCADE;
DROP SCHEMA IF EXISTS sprint_21_route_to_market CASCADE;
DROP SCHEMA IF EXISTS sprint_22_core_activities CASCADE;
DROP SCHEMA IF EXISTS sprint_22_employer_branding CASCADE;
DROP SCHEMA IF EXISTS sprint_23_agile_teams CASCADE;
DROP SCHEMA IF EXISTS sprint_23_processes_decisions CASCADE;
DROP SCHEMA IF EXISTS sprint_24_fit_abc CASCADE;
DROP SCHEMA IF EXISTS sprint_24_focus CASCADE;
DROP SCHEMA IF EXISTS sprint_25_org_redesign CASCADE;
DROP SCHEMA IF EXISTS sprint_25_performance CASCADE;
DROP SCHEMA IF EXISTS sprint_26_employer_branding CASCADE;
DROP SCHEMA IF EXISTS sprint_26_energy CASCADE;
DROP SCHEMA IF EXISTS sprint_27_agile_teams CASCADE;
DROP SCHEMA IF EXISTS sprint_27_digital_heart CASCADE;
DROP SCHEMA IF EXISTS sprint_28_digitalization CASCADE;
DROP SCHEMA IF EXISTS sprint_29_digital_heart CASCADE;
DROP SCHEMA IF EXISTS sprint_30_program_overview CASCADE;


-- ============================================================================
-- STEP 2: DROP EVERYTHING IN PUBLIC SCHEMA
-- ============================================================================
-- Drop all existing tables (order matters due to foreign keys)

DROP TABLE IF EXISTS guru_meeting_notes CASCADE;
DROP TABLE IF EXISTS guru_access_codes CASCADE;
DROP TABLE IF EXISTS guru_guides CASCADE;
DROP TABLE IF EXISTS autosave_data CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS tool_submissions CASCADE;
DROP TABLE IF EXISTS webhook_events CASCADE;
DROP TABLE IF EXISTS user_responses CASCADE;
DROP TABLE IF EXISTS tool_questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Drop any leftover functions
DROP FUNCTION IF EXISTS submit_tool_data CASCADE;
DROP FUNCTION IF EXISTS execute_sql CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;


-- ============================================================================
-- STEP 3: CREATE THE 3 CLEAN TABLES
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 1: USERS
-- ─────────────────────────────────────────────────────────────────────────────
-- One row per person. Created when they first arrive from LearnWorlds.

CREATE TABLE users (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email               text NOT NULL UNIQUE,
  full_name           text,
  learnworlds_user_id text UNIQUE,            -- LearnWorlds user ID (from SSO)
  organization_name   text,                    -- company name (simple text, no FK needed yet)
  role                text NOT NULL DEFAULT 'user',  -- 'user', 'guru', 'admin'
  created_at          timestamptz DEFAULT now(),
  last_login          timestamptz
);

COMMENT ON TABLE  users IS 'All users of the Fast Track platform. One row per person, linked to LearnWorlds via learnworlds_user_id.';
COMMENT ON COLUMN users.learnworlds_user_id IS 'User ID from LearnWorlds SSO — this is how we know who they are';
COMMENT ON COLUMN users.organization_name   IS 'Company/team name — kept simple as text for now';
COMMENT ON COLUMN users.role                IS 'user = participant, guru = facilitator, admin = platform admin';


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 2: TOOL QUESTIONS
-- ─────────────────────────────────────────────────────────────────────────────
-- One row per question across ALL 31 tools.
-- reference_key = globally unique key used by other tools to pull this answer.

CREATE TABLE tool_questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug       text NOT NULL,                    -- e.g. 'know-thyself', 'woop', 'cash'
  question_key    text NOT NULL,                    -- machine key matching HTML field, e.g. 'birthdayStory'
  question_text   text NOT NULL,                    -- human-readable question
  question_type   text NOT NULL DEFAULT 'textarea', -- 'text','textarea','number','select','slider','array','compound'
  section_name    text,                             -- section in the tool, e.g. 'Dream Launcher'
  step_number     integer NOT NULL DEFAULT 1,       -- wizard step (1-based)
  display_order   integer NOT NULL DEFAULT 1,       -- order within step
  is_required     boolean NOT NULL DEFAULT false,
  reference_key   text UNIQUE,                      -- GLOBALLY UNIQUE key for cross-tool references
                                                    -- e.g. 'identity.dream', 'identity.values.core_list'
                                                    -- NULL = not referenced by other tools
  tags            text[] DEFAULT '{}',              -- grouping tags: 'core','reflection','action-plan','carries-forward'
  metadata        jsonb DEFAULT '{}'::jsonb,        -- placeholder, validation, options, sub-fields
  created_at      timestamptz DEFAULT now(),

  UNIQUE(tool_slug, question_key)
);

COMMENT ON TABLE  tool_questions IS 'Master catalog of every question in every Fast Track tool. Filter by tool_slug to see one tool''s questions.';
COMMENT ON COLUMN tool_questions.tool_slug     IS 'Which tool (e.g. know-thyself, woop, cash, dream, values)';
COMMENT ON COLUMN tool_questions.question_key  IS 'Machine key matching the HTML field name in the tool';
COMMENT ON COLUMN tool_questions.question_type IS 'text, textarea, number, select, slider, array (list), compound (object with sub-fields)';
COMMENT ON COLUMN tool_questions.reference_key IS 'CROSS-TOOL REFERENCE: globally unique key so other tools can pull this answer. NULL = not shared. Example: identity.dream is used by 10+ downstream tools.';
COMMENT ON COLUMN tool_questions.tags          IS 'Tags for grouping: core, reflection, action-plan, carries-forward, strengths, values, goals';
COMMENT ON COLUMN tool_questions.metadata      IS 'Extra config: {placeholder, minChars, minItems, options, subFields}';

CREATE INDEX idx_tq_tool ON tool_questions(tool_slug);
CREATE INDEX idx_tq_tool_step ON tool_questions(tool_slug, step_number, display_order);
CREATE INDEX idx_tq_reference ON tool_questions(reference_key) WHERE reference_key IS NOT NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 3: USER RESPONSES
-- ─────────────────────────────────────────────────────────────────────────────
-- One row = one user's answer to one question.
-- Simple answers → response_value (plain text)
-- Complex answers → response_data (JSON)

CREATE TABLE user_responses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id     uuid NOT NULL REFERENCES tool_questions(id) ON DELETE CASCADE,
  response_value  text,                           -- plain text answer
  response_data   jsonb,                          -- structured answer for arrays/compounds
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),

  UNIQUE(user_id, question_id)
);

COMMENT ON TABLE  user_responses IS 'Every answer from every user. JOIN with tool_questions to see what was asked, JOIN with users to see who answered.';
COMMENT ON COLUMN user_responses.response_value IS 'Plain text answer (for text, textarea, number, select questions)';
COMMENT ON COLUMN user_responses.response_data  IS 'Structured JSON for complex answers (arrays, compound objects)';

CREATE INDEX idx_ur_user ON user_responses(user_id);
CREATE INDEX idx_ur_question ON user_responses(question_id);


-- ============================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

-- tool_questions: read-only for everyone (it's a catalog of questions)
CREATE POLICY "Anyone can read questions" ON tool_questions
  FOR SELECT USING (true);

-- users: allow reads and inserts via anon key (tools create users on first visit)
CREATE POLICY "Allow read users" ON users
  FOR SELECT USING (true);
CREATE POLICY "Allow create users" ON users
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update users" ON users
  FOR UPDATE USING (true);

-- user_responses: allow all operations via anon key
-- TODO: When SSO auth is wired in, restrict to: auth.uid() = user_id
CREATE POLICY "Allow read responses" ON user_responses
  FOR SELECT USING (true);
CREATE POLICY "Allow create responses" ON user_responses
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update responses" ON user_responses
  FOR UPDATE USING (true);


-- ============================================================================
-- STEP 5: POPULATE KNOW THYSELF QUESTIONS (test data)
-- ============================================================================
-- 23 questions across 4 sections.
-- Questions with reference_key are used by downstream tools.

INSERT INTO tool_questions (tool_slug, question_key, question_text, question_type, section_name, step_number, display_order, is_required, reference_key, tags, metadata) VALUES

-- ── SECTION 1: Dream Launcher (Step 1) — 10 questions ──────────────────────

('know-thyself', 'birthdayStory',
 'You at your 80th birthday — Imagine your celebration. Who is there? What do they say? What do you value most? What do you regret?',
 'textarea', 'Dream Launcher', 1, 1, true,
 NULL,
 ARRAY['reflection', 'core'],
 '{"placeholder": "Write your 80th birthday vision... Be vivid. Be specific.", "minChars": 50}'::jsonb),

('know-thyself', 'whatLove',
 'What do you love?',
 'textarea', 'Dream Launcher', 1, 2, false,
 NULL,
 ARRAY['reflection'],
 '{"placeholder": "What activities, people, or experiences bring you joy?"}'::jsonb),

('know-thyself', 'whatGoodAt',
 'What are you good at?',
 'textarea', 'Dream Launcher', 1, 3, false,
 NULL,
 ARRAY['reflection'],
 '{"placeholder": "What natural talents and skills do you possess?"}'::jsonb),

('know-thyself', 'giveToWorld',
 'What can you give to the world?',
 'textarea', 'Dream Launcher', 1, 4, false,
 NULL,
 ARRAY['reflection'],
 '{"placeholder": "What unique value or contribution can you offer?"}'::jsonb),

('know-thyself', 'paidFor',
 'What can you be paid for?',
 'textarea', 'Dream Launcher', 1, 5, false,
 NULL,
 ARRAY['reflection'],
 '{"placeholder": "What skills or services have economic value?"}'::jsonb),

('know-thyself', 'inspired',
 'Who/what are you inspired by and why?',
 'textarea', 'Dream Launcher', 1, 6, false,
 NULL,
 ARRAY['reflection'],
 '{"placeholder": "Who or what moves you? What qualities do you admire?"}'::jsonb),

('know-thyself', 'feltBest',
 'When have you felt most passionate and alive?',
 'textarea', 'Dream Launcher', 1, 7, false,
 NULL,
 ARRAY['reflection'],
 '{"placeholder": "Describe a time when you felt completely engaged and energized"}'::jsonb),

('know-thyself', 'likeAboutSelf',
 'What do you like about yourself?',
 'textarea', 'Dream Launcher', 1, 8, false,
 NULL,
 ARRAY['reflection'],
 '{"placeholder": "What personal qualities do you value in yourself?"}'::jsonb),

('know-thyself', 'hardships',
 'What hardships have you overcome? What mistakes have you learned from?',
 'textarea', 'Dream Launcher', 1, 9, false,
 NULL,
 ARRAY['reflection'],
 '{"placeholder": "Reflect on challenges that shaped you and lessons learned"}'::jsonb),

('know-thyself', 'dream',
 'My reason to get up in the morning (My Dream)',
 'textarea', 'Dream Launcher', 1, 10, true,
 'identity.personal_dream',                    -- REFERENCED BY: dream, values tools
 ARRAY['core', 'synthesis', 'carries-forward'],
 '{"placeholder": "Synthesize into your core dream. This is your North Star.", "minChars": 20}'::jsonb),

-- ── SECTION 2: Strengths Amplifier (Step 2) — 5 questions ──────────────────

('know-thyself', 'activities',
 'Energy map — Activities that energize (+) or drain (-) you',
 'array', 'Strengths Amplifier', 2, 1, true,
 NULL,
 ARRAY['strengths'],
 '{"minItems": 3, "itemShape": {"activity": "text", "energy": "select:+/-"}}'::jsonb),

('know-thyself', 'strengths',
 'Core strengths with fit percentage (0-100%)',
 'array', 'Strengths Amplifier', 2, 2, true,
 'identity.strengths.matrix',                   -- REFERENCED BY: fit, energy tools
 ARRAY['strengths', 'core', 'carries-forward'],
 '{"minItems": 3, "itemShape": {"strength": "text", "fitPercent": "number:0-100"}}'::jsonb),

('know-thyself', 'doMore',
 'Do more of — Activities to increase (based on energizers)',
 'textarea', 'Strengths Amplifier', 2, 3, false,
 NULL,
 ARRAY['action-plan'],
 '{"placeholder": "Activities to increase"}'::jsonb),

('know-thyself', 'doLess',
 'Do less of / Stop — Activities to decrease or delegate',
 'textarea', 'Strengths Amplifier', 2, 4, false,
 NULL,
 ARRAY['action-plan'],
 '{"placeholder": "Activities to decrease or delegate"}'::jsonb),

('know-thyself', 'startTo',
 'Start to — New activities to begin',
 'textarea', 'Strengths Amplifier', 2, 5, false,
 NULL,
 ARRAY['action-plan'],
 '{"placeholder": "New activities, habits, or behaviors to start"}'::jsonb),

-- ── SECTION 3: Values Compass (Step 3) — 5 values ──────────────────────────

('know-thyself', 'value_1',
 'Core value #1 — Name it, how you live it daily, alignment %',
 'compound', 'Values Compass', 3, 1, true,
 NULL,
 ARRAY['values', 'core'],
 '{"subFields": {"value": "Your core value", "howLive": "How you live it daily", "alignment": "Alignment % (0-100)"}}'::jsonb),

('know-thyself', 'value_2',
 'Core value #2 — Name it, how you live it daily, alignment %',
 'compound', 'Values Compass', 3, 2, true,
 NULL,
 ARRAY['values', 'core'],
 '{"subFields": {"value": "Your core value", "howLive": "How you live it daily", "alignment": "Alignment % (0-100)"}}'::jsonb),

('know-thyself', 'value_3',
 'Core value #3 — Name it, how you live it daily, alignment %',
 'compound', 'Values Compass', 3, 3, true,
 NULL,
 ARRAY['values', 'core'],
 '{"subFields": {"value": "Your core value", "howLive": "How you live it daily", "alignment": "Alignment % (0-100)"}}'::jsonb),

('know-thyself', 'value_4',
 'Core value #4 — Name it, how you live it daily, alignment %',
 'compound', 'Values Compass', 3, 4, false,
 NULL,
 ARRAY['values'],
 '{"subFields": {"value": "Your core value", "howLive": "How you live it daily", "alignment": "Alignment % (0-100)"}}'::jsonb),

('know-thyself', 'value_5',
 'Core value #5 — Name it, how you live it daily, alignment %',
 'compound', 'Values Compass', 3, 5, false,
 'identity.personal_values',                    -- REFERENCED BY: dream, values, fit tools
 ARRAY['values', 'carries-forward'],
 '{"subFields": {"value": "Your core value", "howLive": "How you live it daily", "alignment": "Alignment % (0-100)"}}'::jsonb),

-- ── SECTION 4: Growth Blueprint (Step 4) — 3 goals ─────────────────────────

('know-thyself', 'goal_1',
 'Growth goal #1 — Goal, specific action, deadline',
 'compound', 'Growth Blueprint', 4, 1, true,
 NULL,
 ARRAY['goals', 'action-plan'],
 '{"subFields": {"goal": "What is your goal?", "action": "Specific action", "byWhen": "Deadline"}}'::jsonb),

('know-thyself', 'goal_2',
 'Growth goal #2 — Goal, specific action, deadline',
 'compound', 'Growth Blueprint', 4, 2, true,
 NULL,
 ARRAY['goals', 'action-plan'],
 '{"subFields": {"goal": "What is your goal?", "action": "Specific action", "byWhen": "Deadline"}}'::jsonb),

('know-thyself', 'goal_3',
 'Growth goal #3 — Goal, specific action, deadline',
 'compound', 'Growth Blueprint', 4, 3, false,
 NULL,
 ARRAY['goals', 'action-plan'],
 '{"subFields": {"goal": "What is your goal?", "action": "Specific action", "byWhen": "Deadline"}}'::jsonb);


-- ============================================================================
-- DONE! Your database now has exactly 3 tables:
--
--   users          → who is using the platform
--   tool_questions → what questions exist in each tool (23 for know-thyself)
--   user_responses → what each user answered
--
-- To query: "What did someone answer on Know Thyself?"
--
--   SELECT tq.section_name, tq.question_text, ur.response_value, ur.response_data
--   FROM user_responses ur
--   JOIN tool_questions tq ON tq.id = ur.question_id
--   JOIN users u ON u.id = ur.user_id
--   WHERE u.email = 'someone@example.com'
--     AND tq.tool_slug = 'know-thyself'
--   ORDER BY tq.step_number, tq.display_order;
--
-- To query: "Which answers carry forward to other tools?"
--
--   SELECT tool_slug, question_key, reference_key, question_text
--   FROM tool_questions
--   WHERE reference_key IS NOT NULL
--   ORDER BY tool_slug, step_number;
--
-- ============================================================================
