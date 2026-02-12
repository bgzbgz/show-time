-- =============================================================================
-- Fast Track Tools Backend - Tool Schemas
-- Migration 002: Create 31 tool schemas with submissions and field_outputs tables
-- =============================================================================

-- Function to create a tool schema with standard tables
CREATE OR REPLACE FUNCTION create_tool_schema(schema_name TEXT, tool_name TEXT)
RETURNS void AS $$
BEGIN
    -- Create schema
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);

    -- Create submissions table
    EXECUTE format('
        CREATE TABLE %I.submissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES shared.users(id) ON DELETE CASCADE,
            organization_id UUID REFERENCES shared.organizations(id) ON DELETE SET NULL,
            data JSONB NOT NULL DEFAULT ''{}''::jsonb,
            status VARCHAR(50) NOT NULL DEFAULT ''draft'' CHECK (status IN (''draft'', ''in_progress'', ''submitted'', ''completed'')),
            version INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            submitted_at TIMESTAMP WITH TIME ZONE,
            completed_at TIMESTAMP WITH TIME ZONE
        )', schema_name);

    -- Create field_outputs table
    EXECUTE format('
        CREATE TABLE %I.field_outputs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            submission_id UUID NOT NULL REFERENCES %I.submissions(id) ON DELETE CASCADE,
            field_id VARCHAR(255) NOT NULL,
            field_value JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )', schema_name, schema_name);

    -- Create indexes on submissions
    EXECUTE format('CREATE INDEX idx_%s_submissions_user_id ON %I.submissions(user_id)',
        replace(schema_name, '.', '_'), schema_name);
    EXECUTE format('CREATE INDEX idx_%s_submissions_org_id ON %I.submissions(organization_id)',
        replace(schema_name, '.', '_'), schema_name);
    EXECUTE format('CREATE INDEX idx_%s_submissions_status ON %I.submissions(status)',
        replace(schema_name, '.', '_'), schema_name);
    EXECUTE format('CREATE INDEX idx_%s_submissions_updated_at ON %I.submissions(updated_at DESC)',
        replace(schema_name, '.', '_'), schema_name);

    -- Create indexes on field_outputs
    EXECUTE format('CREATE INDEX idx_%s_field_outputs_field_id ON %I.field_outputs(field_id)',
        replace(schema_name, '.', '_'), schema_name);
    EXECUTE format('CREATE INDEX idx_%s_field_outputs_submission_id ON %I.field_outputs(submission_id)',
        replace(schema_name, '.', '_'), schema_name);

    -- Create trigger for auto-updating updated_at
    EXECUTE format('
        CREATE TRIGGER update_%s_submissions_updated_at
        BEFORE UPDATE ON %I.submissions
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
        replace(schema_name, '.', '_'), schema_name);

    -- Add comments
    EXECUTE format('COMMENT ON SCHEMA %I IS ''Schema for %s tool''', schema_name, tool_name);
    EXECUTE format('COMMENT ON TABLE %I.submissions IS ''User submissions for %s tool''', schema_name, tool_name);
    EXECUTE format('COMMENT ON TABLE %I.field_outputs IS ''Extracted output fields for cross-tool dependencies''', schema_name);

    RAISE NOTICE 'Created schema % for %', schema_name, tool_name;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Create all 31 tool schemas
-- =============================================================================

-- Module 0: Foundation
SELECT create_tool_schema('sprint_00_woop', 'WOOP - Goal Setting Framework');

-- Module 1: Leadership
SELECT create_tool_schema('sprint_01_know_thyself', 'Know Thyself - Personal Identity');
SELECT create_tool_schema('sprint_02_dream', 'Dream - Company Vision');
SELECT create_tool_schema('sprint_03_values', 'Values - Core Values');
SELECT create_tool_schema('sprint_04_team', 'Team - Team Structure');
SELECT create_tool_schema('sprint_05_fit', 'FIT - Team Assessment');
SELECT create_tool_schema('sprint_06_cash', 'Cash - Cash Flow Management');
SELECT create_tool_schema('sprint_07_energy', 'Energy - Energy Management (Optional)');
SELECT create_tool_schema('sprint_08_goals', 'Goals - Goal Tracking');
SELECT create_tool_schema('sprint_09_focus', 'Focus - Priority Management');
SELECT create_tool_schema('sprint_10_performance', 'Performance - Performance System');
SELECT create_tool_schema('sprint_11_meeting_rhythm', 'Meeting Rhythm - Meeting Structure');

-- Module 2: Marketing & Sales
SELECT create_tool_schema('sprint_12_market_size', 'Market Size - TAM Analysis');
SELECT create_tool_schema('sprint_13_segmentation', 'Segmentation - Target Market');
SELECT create_tool_schema('sprint_14_target_segment', 'Target Segment - Deep Dive');
SELECT create_tool_schema('sprint_15_value_proposition', 'Value Proposition - VP Canvas');
SELECT create_tool_schema('sprint_16_vp_testing', 'VP Testing - Validation');
SELECT create_tool_schema('sprint_17_product_development', 'Product Development - Roadmap');
SELECT create_tool_schema('sprint_18_pricing', 'Pricing - Strategy');
SELECT create_tool_schema('sprint_19_brand_marketing', 'Brand & Marketing - Strategy');
SELECT create_tool_schema('sprint_20_customer_service', 'Customer Service - Design (Optional)');
SELECT create_tool_schema('sprint_21_route_to_market', 'Route to Market - GTM');

-- Module 3: Operations
SELECT create_tool_schema('sprint_22_core_activities', 'Core Activities - Mapping');
SELECT create_tool_schema('sprint_23_processes_decisions', 'Processes & Decisions - Framework');
SELECT create_tool_schema('sprint_24_fit_abc', 'FIT & ABC - Team Analysis');
SELECT create_tool_schema('sprint_25_org_redesign', 'Org Redesign - Structure');
SELECT create_tool_schema('sprint_26_employer_branding', 'Employer Branding - Talent');
SELECT create_tool_schema('sprint_27_agile_teams', 'Agile Teams - Workflows (Optional)');

-- Module 4: Digitalization
SELECT create_tool_schema('sprint_28_digitalization', 'Digitalization - AI Strategy');
SELECT create_tool_schema('sprint_29_digital_heart', 'Digital Heart - Data Lake');
SELECT create_tool_schema('sprint_30_program_overview', 'Program Overview - Summary');

-- Drop the helper function (no longer needed)
DROP FUNCTION IF EXISTS create_tool_schema(TEXT, TEXT);

-- =============================================================================
-- Verification Query
-- =============================================================================

-- Query to verify all schemas were created
SELECT
    nspname AS schema_name,
    (SELECT count(*) FROM information_schema.tables WHERE table_schema = nspname AND table_name = 'submissions') AS has_submissions,
    (SELECT count(*) FROM information_schema.tables WHERE table_schema = nspname AND table_name = 'field_outputs') AS has_field_outputs
FROM pg_namespace
WHERE nspname LIKE 'sprint_%'
ORDER BY nspname;
