-- Test User Submissions Count
-- Count submissions for test user across all schemas

WITH test_user AS (
    SELECT '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'::uuid as user_id
)
SELECT
    'sprint_00_woop' as schema_name,
    0 as sprint_number,
    COUNT(*) as submission_count,
    MAX(completed_at) as last_completion
FROM sprint_00_woop.submissions s
CROSS JOIN test_user tu
WHERE s.user_id = tu.user_id

UNION ALL

SELECT
    'sprint_01_know_thyself',
    1,
    COUNT(*),
    MAX(completed_at)
FROM sprint_01_know_thyself.submissions s
CROSS JOIN test_user tu
WHERE s.user_id = tu.user_id

UNION ALL

SELECT
    'sprint_02_dream',
    2,
    COUNT(*),
    MAX(completed_at)
FROM sprint_02_dream.submissions s
CROSS JOIN test_user tu
WHERE s.user_id = tu.user_id

UNION ALL

SELECT
    'sprint_03_values',
    3,
    COUNT(*),
    MAX(completed_at)
FROM sprint_03_values.submissions s
CROSS JOIN test_user tu
WHERE s.user_id = tu.user_id

UNION ALL

SELECT
    'sprint_04_team',
    4,
    COUNT(*),
    MAX(completed_at)
FROM sprint_04_team.submissions s
CROSS JOIN test_user tu
WHERE s.user_id = tu.user_id

UNION ALL

SELECT
    'sprint_05_goals',
    5,
    COUNT(*),
    MAX(completed_at)
FROM sprint_05_goals.submissions s
CROSS JOIN test_user tu
WHERE s.user_id = tu.user_id

-- Add more schemas as needed

ORDER BY sprint_number;

-- Summary
SELECT
    COUNT(DISTINCT schema_name) as schemas_with_submissions,
    SUM(submission_count) as total_submissions
FROM (
    SELECT 'sprint_00_woop' as schema_name, COUNT(*) as submission_count
    FROM sprint_00_woop.submissions s
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
    UNION ALL
    SELECT 'sprint_01_know_thyself', COUNT(*)
    FROM sprint_01_know_thyself.submissions s
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
    UNION ALL
    SELECT 'sprint_02_dream', COUNT(*)
    FROM sprint_02_dream.submissions s
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
    -- Add more as needed
) counts;
