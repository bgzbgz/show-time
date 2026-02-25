-- Migration: Add LearnWorlds SSO and Progress Tracking Fields
-- Description: Extends users and user_progress tables for LearnWorlds integration
-- Date: 2026-02-13

-- ============================================================================
-- Add LearnWorlds fields to users table
-- ============================================================================

-- Add LearnWorlds identifiers to users table (nullable for backward compatibility)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS learnworlds_user_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS learnworlds_email TEXT,
ADD COLUMN IF NOT EXISTS sso_verified_at TIMESTAMPTZ;

-- Create index for faster lookup by LearnWorlds user ID
CREATE INDEX IF NOT EXISTS idx_users_learnworlds_user_id ON users(learnworlds_user_id);

-- ============================================================================
-- Extend user_progress table for sprint tracking and unlock logic
-- ============================================================================

-- Add progress tracking columns (nullable initially for backfill)
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS sprint_id INTEGER,
ADD COLUMN IF NOT EXISTS is_unlocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- ============================================================================
-- Backfill sprint_id for existing progress records
-- ============================================================================

-- Module 0: Intro Sprint
UPDATE user_progress SET sprint_id = 0 WHERE tool_slug = 'woop' AND sprint_id IS NULL;

-- Module 1: Know Thyself Sprint
UPDATE user_progress SET sprint_id = 1 WHERE tool_slug = 'know-thyself' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 1 WHERE tool_slug = 'ikigai' AND sprint_id IS NULL;

-- Module 2: Dream Sprint
UPDATE user_progress SET sprint_id = 2 WHERE tool_slug = 'dream' AND sprint_id IS NULL;

-- Module 3: Values Sprint
UPDATE user_progress SET sprint_id = 3 WHERE tool_slug = 'values' AND sprint_id IS NULL;

-- Module 4: Team Sprint
UPDATE user_progress SET sprint_id = 4 WHERE tool_slug = 'team' AND sprint_id IS NULL;

-- Module 5: Strategy Execution Sprint
UPDATE user_progress SET sprint_id = 5 WHERE tool_slug = 'fit' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 5 WHERE tool_slug = 'cash' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 5 WHERE tool_slug = 'energy' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 5 WHERE tool_slug = 'goals' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 5 WHERE tool_slug = 'focus' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 5 WHERE tool_slug = 'performance' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 5 WHERE tool_slug = 'meeting-rhythm' AND sprint_id IS NULL;

-- Module 6: Strategy Development Sprint
UPDATE user_progress SET sprint_id = 6 WHERE tool_slug = 'market-size' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 6 WHERE tool_slug = 'segmentation' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 6 WHERE tool_slug = 'target-segment' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 6 WHERE tool_slug = 'value-proposition' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 6 WHERE tool_slug = 'vp-testing' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 6 WHERE tool_slug = 'product-development' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 6 WHERE tool_slug = 'pricing' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 6 WHERE tool_slug = 'brand-marketing' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 6 WHERE tool_slug = 'customer-service' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 6 WHERE tool_slug = 'route-to-market' AND sprint_id IS NULL;

-- Module 7: Organization Sprint
UPDATE user_progress SET sprint_id = 7 WHERE tool_slug = 'core-activities' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 7 WHERE tool_slug = 'processes-decisions' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 7 WHERE tool_slug = 'fit-abc' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 7 WHERE tool_slug = 'org-redesign' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 7 WHERE tool_slug = 'employer-branding' AND sprint_id IS NULL;

-- Module 8: Technology & AI Sprint
UPDATE user_progress SET sprint_id = 8 WHERE tool_slug = 'agile-teams' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 8 WHERE tool_slug = 'digitalization' AND sprint_id IS NULL;
UPDATE user_progress SET sprint_id = 8 WHERE tool_slug = 'digital-heart' AND sprint_id IS NULL;

-- Program Overview (special case - sprint 9)
UPDATE user_progress SET sprint_id = 9 WHERE tool_slug = 'program-overview' AND sprint_id IS NULL;

-- ============================================================================
-- Grandfather clause: Unlock all tools for existing users
-- ============================================================================

-- Set is_unlocked to true for all existing progress records (created before this migration)
UPDATE user_progress
SET is_unlocked = true,
    unlocked_at = COALESCE(unlocked_at, created_at)
WHERE created_at < NOW() AND is_unlocked IS NULL;

-- ============================================================================
-- Update unique constraint to include sprint_id
-- ============================================================================

-- Drop old unique constraint if it exists
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_tool_slug_key;

-- Add new unique constraint including sprint_id
ALTER TABLE user_progress
ADD CONSTRAINT user_progress_user_id_sprint_id_tool_slug_key
UNIQUE (user_id, sprint_id, tool_slug);

-- ============================================================================
-- Create indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_progress_sprint_id ON user_progress(sprint_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_is_unlocked ON user_progress(is_unlocked);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_sprint ON user_progress(user_id, sprint_id);

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON COLUMN users.learnworlds_user_id IS 'LearnWorlds user identifier for SSO mapping';
COMMENT ON COLUMN users.learnworlds_email IS 'Email address from LearnWorlds SSO';
COMMENT ON COLUMN users.sso_verified_at IS 'Timestamp of last successful SSO authentication';

COMMENT ON COLUMN user_progress.sprint_id IS 'Sprint/Module number (0-9)';
COMMENT ON COLUMN user_progress.is_unlocked IS 'Whether tool is unlocked for user (based on course progress)';
COMMENT ON COLUMN user_progress.unlocked_at IS 'Timestamp when tool was unlocked';
COMMENT ON COLUMN user_progress.started_at IS 'Timestamp when user first started working on tool';
COMMENT ON COLUMN user_progress.completed_at IS 'Timestamp when user completed the tool';
