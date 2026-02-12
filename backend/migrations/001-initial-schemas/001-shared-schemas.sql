-- =============================================================================
-- Fast Track Tools Backend - Shared Schemas
-- Migration 001: Create shared schemas for users, organizations, and progress
-- =============================================================================

-- Create shared schema for users
CREATE SCHEMA IF NOT EXISTS shared;

-- =============================================================================
-- SHARED.USERS - User accounts and authentication
-- =============================================================================
CREATE TABLE shared.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lms_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    organization_id UUID,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'guru')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Indexes for users table
CREATE INDEX idx_users_email ON shared.users(email);
CREATE INDEX idx_users_lms_user_id ON shared.users(lms_user_id);
CREATE INDEX idx_users_organization_id ON shared.users(organization_id);
CREATE INDEX idx_users_role ON shared.users(role);

-- =============================================================================
-- SHARED.ORGANIZATIONS - Organization/company information
-- =============================================================================
CREATE TABLE shared.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for organizations table
CREATE INDEX idx_organizations_slug ON shared.organizations(slug);

-- Add foreign key constraint for organization_id in users
ALTER TABLE shared.users
    ADD CONSTRAINT fk_users_organization
    FOREIGN KEY (organization_id)
    REFERENCES shared.organizations(id)
    ON DELETE SET NULL;

-- =============================================================================
-- SHARED.USER_PROGRESS - Track user progress across all tools
-- =============================================================================
CREATE TABLE shared.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES shared.users(id) ON DELETE CASCADE,
    tool_slug VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    unlocked_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tool_slug)
);

-- Indexes for user_progress table
CREATE INDEX idx_user_progress_user_id ON shared.user_progress(user_id);
CREATE INDEX idx_user_progress_tool_slug ON shared.user_progress(tool_slug);
CREATE INDEX idx_user_progress_status ON shared.user_progress(status);
CREATE INDEX idx_user_progress_user_tool ON shared.user_progress(user_id, tool_slug);

-- =============================================================================
-- TRIGGERS - Auto-update updated_at timestamps
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON shared.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to organizations table
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON shared.organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to user_progress table
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON shared.user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- COMMENTS - Documentation
-- =============================================================================

COMMENT ON SCHEMA shared IS 'Shared schemas for Fast Track Tools backend';
COMMENT ON TABLE shared.users IS 'User accounts with LearnWorlds SSO integration';
COMMENT ON TABLE shared.organizations IS 'Organizations/companies using Fast Track Tools';
COMMENT ON TABLE shared.user_progress IS 'User progress tracking for all 31 tools';

COMMENT ON COLUMN shared.users.lms_user_id IS 'LearnWorlds user ID for SSO integration';
COMMENT ON COLUMN shared.users.role IS 'User role: user (default), admin, or guru (coach)';
COMMENT ON COLUMN shared.user_progress.status IS 'Tool status: locked, unlocked, in_progress, or completed';
COMMENT ON COLUMN shared.user_progress.progress_percentage IS 'Completion percentage (0-100)';
