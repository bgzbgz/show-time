-- Chain 1 Integrity Check: Foundation Chain
-- WOOP → Know Thyself → Dream → Values → Team → FIT
-- Verifies all required fields exist in field_outputs for dependency chain

WITH test_user AS (
    SELECT '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'::uuid as user_id
),
expected_fields AS (
    SELECT 'sprint_00_woop' as schema_name, 'wish' as field_id, 'Know Thyself.initial_aspiration' as used_by
    UNION ALL
    SELECT 'sprint_01_know_thyself', 'identity.personal_dream', 'Dream.founder_vision'
    UNION ALL
    SELECT 'sprint_01_know_thyself', 'identity.purpose', 'Dream.company_purpose_foundation'
    UNION ALL
    SELECT 'sprint_02_dream', 'company_dream', 'Values.dream_reference'
    UNION ALL
    SELECT 'sprint_03_values', 'core_values', 'Team.hiring_values'
    UNION ALL
    SELECT 'sprint_04_team', 'team_members', 'FIT.assessment_subjects'
)
SELECT
    ef.schema_name,
    ef.field_id,
    ef.used_by,
    CASE
        WHEN fo.field_value IS NOT NULL THEN '✅ Found'
        ELSE '❌ Missing'
    END as status,
    fo.field_value,
    fo.created_at
FROM expected_fields ef
LEFT JOIN LATERAL (
    SELECT field_value, created_at
    FROM sprint_00_woop.field_outputs fo
    JOIN sprint_00_woop.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_00_woop'
    UNION ALL
    SELECT field_value, created_at
    FROM sprint_01_know_thyself.field_outputs fo
    JOIN sprint_01_know_thyself.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_01_know_thyself'
    UNION ALL
    SELECT field_value, created_at
    FROM sprint_02_dream.field_outputs fo
    JOIN sprint_02_dream.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_02_dream'
    UNION ALL
    SELECT field_value, created_at
    FROM sprint_03_values.field_outputs fo
    JOIN sprint_03_values.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_03_values'
    UNION ALL
    SELECT field_value, created_at
    FROM sprint_04_team.field_outputs fo
    JOIN sprint_04_team.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_04_team'
    LIMIT 1
) fo ON true
ORDER BY ef.schema_name, ef.field_id;

-- Summary
SELECT
    COUNT(*) as total_expected,
    COUNT(fo.field_value) as fields_found,
    COUNT(*) - COUNT(fo.field_value) as fields_missing
FROM expected_fields ef
LEFT JOIN LATERAL (
    SELECT field_value
    FROM sprint_00_woop.field_outputs fo
    JOIN sprint_00_woop.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_00_woop'
    UNION ALL
    SELECT field_value
    FROM sprint_01_know_thyself.field_outputs fo
    JOIN sprint_01_know_thyself.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_01_know_thyself'
    UNION ALL
    SELECT field_value
    FROM sprint_02_dream.field_outputs fo
    JOIN sprint_02_dream.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_02_dream'
    UNION ALL
    SELECT field_value
    FROM sprint_03_values.field_outputs fo
    JOIN sprint_03_values.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_03_values'
    UNION ALL
    SELECT field_value
    FROM sprint_04_team.field_outputs fo
    JOIN sprint_04_team.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_04_team'
    LIMIT 1
) fo ON true;
