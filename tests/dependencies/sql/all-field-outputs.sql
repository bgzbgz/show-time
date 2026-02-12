-- All Field Outputs UNION Query
-- Returns all field_outputs across all 31 sprint schemas for a specific user
-- Usage: Replace '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad' with target user UUID

SELECT
    'sprint_00_woop' as schema_name,
    0 as sprint_number,
    'woop' as tool_slug,
    fo.field_id,
    fo.field_value,
    fo.created_at,
    s.completed_at as submission_completed_at
FROM sprint_00_woop.field_outputs fo
JOIN sprint_00_woop.submissions s ON fo.submission_id = s.id
WHERE s.user_id = '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'

UNION ALL

SELECT
    'sprint_01_know_thyself' as schema_name,
    1 as sprint_number,
    'know-thyself' as tool_slug,
    fo.field_id,
    fo.field_value,
    fo.created_at,
    s.completed_at
FROM sprint_01_know_thyself.field_outputs fo
JOIN sprint_01_know_thyself.submissions s ON fo.submission_id = s.id
WHERE s.user_id = '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'

UNION ALL

SELECT
    'sprint_02_dream' as schema_name,
    2 as sprint_number,
    'dream' as tool_slug,
    fo.field_id,
    fo.field_value,
    fo.created_at,
    s.completed_at
FROM sprint_02_dream.field_outputs fo
JOIN sprint_02_dream.submissions s ON fo.submission_id = s.id
WHERE s.user_id = '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'

UNION ALL

SELECT
    'sprint_03_values' as schema_name,
    3 as sprint_number,
    'values' as tool_slug,
    fo.field_id,
    fo.field_value,
    fo.created_at,
    s.completed_at
FROM sprint_03_values.field_outputs fo
JOIN sprint_03_values.submissions s ON fo.submission_id = s.id
WHERE s.user_id = '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'

UNION ALL

SELECT
    'sprint_04_team' as schema_name,
    4 as sprint_number,
    'team' as tool_slug,
    fo.field_id,
    fo.field_value,
    fo.created_at,
    s.completed_at
FROM sprint_04_team.field_outputs fo
JOIN sprint_04_team.submissions s ON fo.submission_id = s.id
WHERE s.user_id = '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'

UNION ALL

SELECT
    'sprint_05_goals' as schema_name,
    5 as sprint_number,
    'goals' as tool_slug,
    fo.field_id,
    fo.field_value,
    fo.created_at,
    s.completed_at
FROM sprint_05_goals.field_outputs fo
JOIN sprint_05_goals.submissions s ON fo.submission_id = s.id
WHERE s.user_id = '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'

-- Add additional schemas as needed (sprint_06 through sprint_30)
-- Template for additional schemas:
-- UNION ALL
-- SELECT
--     'sprint_XX_toolname' as schema_name,
--     XX as sprint_number,
--     'tool-slug' as tool_slug,
--     fo.field_id,
--     fo.field_value,
--     fo.created_at,
--     s.completed_at
-- FROM sprint_XX_toolname.field_outputs fo
-- JOIN sprint_XX_toolname.submissions s ON fo.submission_id = s.id
-- WHERE s.user_id = '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'

ORDER BY sprint_number, created_at;
