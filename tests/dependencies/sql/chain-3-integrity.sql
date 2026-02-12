-- Chain 3 Integrity Check: Market Chain
-- Dream → Market Size → Segmentation → Target Segment → Value Proposition
-- Verifies all required fields exist in field_outputs for dependency chain

WITH test_user AS (
    SELECT '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'::uuid as user_id
),
expected_fields AS (
    SELECT 'sprint_02_dream' as schema_name, 'target_market' as field_id, 'Market Size.market_definition' as used_by
    UNION ALL
    SELECT 'sprint_06_market_size', 'tam', 'Segmentation.total_addressable_market'
    UNION ALL
    SELECT 'sprint_06_market_size', 'market_segments', 'Segmentation.segment_list'
    UNION ALL
    SELECT 'sprint_07_segmentation', 'selected_segment', 'Target Segment.target_segment'
    UNION ALL
    SELECT 'sprint_08_target_segment', 'customer_jobs', 'Value Proposition.jobs_to_be_done'
    UNION ALL
    SELECT 'sprint_08_target_segment', 'pains', 'Value Proposition.pain_points'
    UNION ALL
    SELECT 'sprint_08_target_segment', 'gains', 'Value Proposition.desired_gains'
)
SELECT
    ef.schema_name,
    ef.field_id,
    ef.used_by,
    CASE
        WHEN fo.field_value IS NOT NULL THEN '✅ Found'
        ELSE '❌ Missing'
    END as status,
    fo.field_value
FROM expected_fields ef
LEFT JOIN LATERAL (
    -- Query across all schemas involved in chain 3
    SELECT field_value
    FROM sprint_02_dream.field_outputs fo
    JOIN sprint_02_dream.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id
      AND fo.field_id = ef.field_id
      AND ef.schema_name = 'sprint_02_dream'
    -- Add other schemas as needed
    LIMIT 1
) fo ON true
ORDER BY ef.schema_name, ef.field_id;
