-- Fast Track Tools Database Schema
-- Database: Supabase (PostgreSQL)
-- Version: 1.0

-- ============================================
-- USERS TABLE
-- ============================================
-- Synced from LearnWorlds via webhook
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lms_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_users_lms_id ON users(lms_user_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- SPRINTS TABLE (Master List)
-- ============================================
CREATE TABLE sprints (
  id SERIAL PRIMARY KEY,
  sprint_number INTEGER UNIQUE NOT NULL,
  module_number INTEGER NOT NULL,
  sprint_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'identity.dream'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_optional BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data for all 31 sprints
INSERT INTO sprints (sprint_number, module_number, sprint_key, title, is_optional, sort_order) VALUES
(0, 0, 'intro.mission', 'Mission & Objectives', FALSE, 0),
(1, 1, 'identity.know_thyself', 'Know Thyself', FALSE, 1),
(2, 1, 'identity.dream', 'Dream', FALSE, 2),
(3, 1, 'identity.values', 'Values', FALSE, 3),
(4, 1, 'identity.team', 'Team', FALSE, 4),
(5, 1, 'identity.fit', 'FIT Assessment', FALSE, 5),
(6, 2, 'performance.cash', 'Current Cash Position', FALSE, 6),
(7, 2, 'performance.energy', 'Creating Energy', TRUE, 7),
(8, 2, 'performance.goals', 'Goals, Priorities and Planning', FALSE, 8),
(9, 2, 'performance.focus', 'Focus, Discipline & Productivity', FALSE, 9),
(10, 2, 'performance.accountability', 'Performance & Accountability', FALSE, 10),
(11, 2, 'performance.meetings', 'Meeting Rhythm', FALSE, 11),
(12, 3, 'market.size', 'Market Size', FALSE, 12),
(13, 3, 'market.segments', 'Segmentation and Target Market', FALSE, 13),
(14, 4, 'strategy.target', 'Target Segment Deep Dive', FALSE, 14),
(15, 4, 'strategy.vp', 'Value Proposition', FALSE, 15),
(16, 4, 'strategy.testing', 'Value Proposition Testing', FALSE, 16),
(17, 5, 'execution.product', 'Product Development', FALSE, 17),
(18, 5, 'execution.pricing', 'Strategy Driven Pricing', FALSE, 18),
(19, 5, 'execution.brand', 'Brand and Marketing', FALSE, 19),
(20, 5, 'execution.service', 'Customer Service Strategy', TRUE, 20),
(21, 5, 'execution.rtm', 'Route to Market', FALSE, 21),
(22, 6, 'org.activities', 'Define Core Activities', FALSE, 22),
(23, 6, 'org.processes', 'Processes, Decisions, and Capabilities', FALSE, 23),
(24, 6, 'org.abc', 'FIT & ABC Analysis', FALSE, 24),
(25, 6, 'org.redesign', 'Organizational Redesign', FALSE, 25),
(26, 7, 'people.employer', 'Employer Branding and Recruitment', FALSE, 26),
(27, 7, 'people.agile', 'Set Agile Teams', TRUE, 27),
(28, 8, 'tech.digital', 'Top 3 Decisions & Processes to Digitalize', FALSE, 28),
(29, 8, 'tech.heart', 'Create the Digital Heart', FALSE, 29),
(30, 8, 'program.overview', 'Program Overview & Next 12 Months', FALSE, 30);

-- ============================================
-- USER PROGRESS TABLE
-- ============================================
-- Tracks which tools are unlocked/completed per user
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sprint_id INTEGER NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'locked',
  -- Status: 'locked', 'unlocked', 'in_progress', 'submitted', 'completed'
  unlocked_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sprint_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_sprint ON user_progress(sprint_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);

-- ============================================
-- TOOL SUBMISSIONS TABLE
-- ============================================
-- Stores all tool submission data
CREATE TABLE tool_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sprint_id INTEGER NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- All tool outputs stored as JSON: { "dream.narrative": "...", "dream.visualization": "..." }
  version INTEGER DEFAULT 1,
  is_final BOOLEAN DEFAULT FALSE,
  ai_critique JSONB, -- AI feedback/suggestions
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_user ON tool_submissions(user_id);
CREATE INDEX idx_submissions_sprint ON tool_submissions(sprint_id);
CREATE INDEX idx_submissions_final ON tool_submissions(is_final);
CREATE INDEX idx_submissions_data ON tool_submissions USING GIN(submission_data);

-- ============================================
-- SPRINT DEPENDENCIES TABLE
-- ============================================
-- Defines which fields from which sprints are needed
CREATE TABLE sprint_dependencies (
  id SERIAL PRIMARY KEY,
  sprint_id INTEGER NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  depends_on_sprint_id INTEGER NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  field_path VARCHAR(255) NOT NULL, -- e.g., 'identity.personal_dream'
  is_required BOOLEAN DEFAULT TRUE,
  display_label VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dependencies_sprint ON sprint_dependencies(sprint_id);
CREATE INDEX idx_dependencies_depends_on ON sprint_dependencies(depends_on_sprint_id);

-- Seed dependencies (sample - you'll add all 200+)
INSERT INTO sprint_dependencies (sprint_id, depends_on_sprint_id, field_path, display_label) VALUES
-- Sprint 2 (Dream) depends on Sprint 1 (Know Thyself)
(2, 1, 'identity.personal_dream', 'Personal Dream'),
(2, 1, 'identity.personal_values', 'Personal Values'),
-- Sprint 3 (Values) depends on Sprint 1 & 2
(3, 2, 'identity.dream.one_sentence', 'One-Sentence Dream'),
(3, 1, 'identity.personal_values', 'Personal Values'),
-- Sprint 4 (Team) depends on Sprint 2 & 3
(4, 3, 'identity.values.cool_not_cool', 'Cool/Not-Cool Behaviors'),
(4, 2, 'identity.dream.one_sentence', 'One-Sentence Dream');
-- ... (add remaining 200+ dependencies)

-- ============================================
-- AUTO-SAVE DATA TABLE (Optional)
-- ============================================
-- For storing draft data before submission
CREATE TABLE autosave_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sprint_id INTEGER NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sprint_id)
);

CREATE INDEX idx_autosave_user ON autosave_data(user_id);

-- ============================================
-- AI INTERACTIONS LOG (Optional)
-- ============================================
-- Track AI usage for cost monitoring
CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sprint_id INTEGER REFERENCES sprints(id) ON DELETE SET NULL,
  interaction_type VARCHAR(50), -- 'critique', 'suggestion', 'help'
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_cost DECIMAL(10,6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_user ON ai_interactions(user_id);
CREATE INDEX idx_ai_created ON ai_interactions(created_at);

-- ============================================
-- LEARNWORLDS SYNC LOG
-- ============================================
-- Track webhook events from LMS
CREATE TABLE lms_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100), -- 'course_completed', 'user_updated', etc.
  lms_user_id VARCHAR(255),
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lms_sync_user ON lms_sync_log(lms_user_id);
CREATE INDEX idx_lms_sync_processed ON lms_sync_log(processed);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tool_submissions_updated_at BEFORE UPDATE ON tool_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to unlock next sprint when current is completed
CREATE OR REPLACE FUNCTION unlock_next_sprint()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Find next sprint in sequence
    INSERT INTO user_progress (user_id, sprint_id, status, unlocked_at)
    SELECT NEW.user_id, s.id, 'unlocked', NOW()
    FROM sprints s
    WHERE s.sort_order = (
      SELECT sort_order + 1 FROM sprints WHERE id = NEW.sprint_id
    )
    ON CONFLICT (user_id, sprint_id)
    DO UPDATE SET status = 'unlocked', unlocked_at = NOW()
    WHERE user_progress.status = 'locked';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_unlock_next_sprint AFTER UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION unlock_next_sprint();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all user-facing tables
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE autosave_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions" ON tool_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON tool_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own autosave" ON autosave_data
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: User Dashboard (all sprints with progress)
CREATE VIEW user_dashboard AS
SELECT
  u.id as user_id,
  u.email,
  s.sprint_number,
  s.title as sprint_title,
  s.sprint_key,
  s.module_number,
  COALESCE(up.status, 'locked') as status,
  up.progress_percentage,
  up.unlocked_at,
  up.completed_at,
  s.is_optional
FROM users u
CROSS JOIN sprints s
LEFT JOIN user_progress up ON u.id = up.user_id AND s.id = up.sprint_id
ORDER BY u.id, s.sort_order;

-- View: Sprint with dependencies resolved
CREATE VIEW sprint_data_with_dependencies AS
SELECT
  ts.user_id,
  ts.sprint_id,
  s.sprint_key,
  ts.submission_data,
  jsonb_object_agg(
    sd.field_path,
    dep_ts.submission_data->sd.field_path
  ) FILTER (WHERE sd.field_path IS NOT NULL) as dependency_data
FROM tool_submissions ts
JOIN sprints s ON ts.sprint_id = s.id
LEFT JOIN sprint_dependencies sd ON s.id = sd.sprint_id
LEFT JOIN sprints dep_s ON sd.depends_on_sprint_id = dep_s.id
LEFT JOIN tool_submissions dep_ts ON dep_ts.user_id = ts.user_id
  AND dep_ts.sprint_id = sd.depends_on_sprint_id
  AND dep_ts.is_final = TRUE
WHERE ts.is_final = TRUE
GROUP BY ts.user_id, ts.sprint_id, s.sprint_key, ts.submission_data;

-- ============================================
-- NOTES
-- ============================================
-- 1. All tool output fields stored as JSONB in submission_data
-- 2. Dependencies resolved via sprint_dependencies table
-- 3. Auto-unlock next sprint on completion
-- 4. RLS ensures users only see their own data
-- 5. AI costs tracked separately for monitoring
-- 6. LearnWorlds sync via webhook -> lms_sync_log -> process
