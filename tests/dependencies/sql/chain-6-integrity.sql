-- Chain 6 Integrity Check: Team & Culture Chain
-- Team → FIT ABC → Org Redesign → Employer Branding/Agile Teams
-- Verifies all required fields exist in field_outputs for dependency chain

WITH test_user AS (
    SELECT '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'::uuid as user_id
),
expected_fields AS (
    SELECT 'sprint_04_team' as schema_name, 'team_members' as field_id, 'FIT ABC.assessment_subjects' as used_by
    UNION ALL
    SELECT 'sprint_03_values', 'core_values', 'FIT ABC.cultural_benchmark'
    UNION ALL
    SELECT 'sprint_19_fit_abc', 'team_assessment', 'Org Redesign.current_state'
    UNION ALL
    SELECT 'sprint_15_core_activities', 'activities', 'Org Redesign.organizational_needs'
    UNION ALL
    SELECT 'sprint_20_org_redesign', 'target_roles', 'Employer Branding.recruitment_focus'
    UNION ALL
    SELECT 'sprint_03_values', 'core_values', 'Employer Branding.employer_brand_values'
    UNION ALL
    SELECT 'sprint_20_org_redesign', 'org_structure', 'Agile Teams.team_structure'
)
SELECT
    ef.schema_name,
    ef.field_id,
    ef.used_by,
    CASE
        WHEN fo.field_value IS NOT NULL THEN '✅ Found'
        ELSE '❌ Missing'
    END as status
FROM expected_fields ef
LEFT JOIN LATERAL (
    SELECT field_value FROM sprint_04_team.field_outputs fo
    JOIN sprint_04_team.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id AND fo.field_id = ef.field_id AND ef.schema_name = 'sprint_04_team'
    LIMIT 1
) fo ON true
ORDER BY ef.schema_name;
