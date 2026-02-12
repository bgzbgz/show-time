-- Chain 2 Integrity Check: Goals Chain
-- Dream → Goals → Focus/Performance
-- Verifies all required fields exist in field_outputs for dependency chain

WITH test_user AS (
    SELECT '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'::uuid as user_id
),
expected_fields AS (
    SELECT 'sprint_02_dream' as schema_name, 'company_dream' as field_id, 'Goals.vision_alignment' as used_by
    UNION ALL
    SELECT 'sprint_02_dream', 'timeline', 'Goals.goal_timeframe'
    UNION ALL
    SELECT 'sprint_05_goals', 'quarterly_goals', 'Focus.focus_candidates'
    UNION ALL
    SELECT 'sprint_05_goals', 'quarterly_goals', 'Performance.performance_targets'
    UNION ALL
    SELECT 'sprint_04_team', 'team_members', 'Performance.performance_subjects'
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
    FROM sprint_02_dream.field_outputs fo
    JOIN sprint_02_dream.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_02_dream'
    UNION ALL
    SELECT field_value, created_at
    FROM sprint_04_team.field_outputs fo
    JOIN sprint_04_team.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_04_team'
    UNION ALL
    SELECT field_value, created_at
    FROM sprint_05_goals.field_outputs fo
    JOIN sprint_05_goals.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_05_goals'
    LIMIT 1
) fo ON true
ORDER BY ef.schema_name, ef.field_id;
