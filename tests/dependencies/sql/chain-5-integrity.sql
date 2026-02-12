-- Chain 5 Integrity Check: Operations Chain
-- Route to Market → Core Activities → Processes → Digitalization → Digital Heart
-- Verifies all required fields exist in field_outputs for dependency chain

WITH test_user AS (
    SELECT '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'::uuid as user_id
),
expected_fields AS (
    SELECT 'sprint_14_route_to_market' as schema_name, 'gtm_strategy' as field_id, 'Core Activities.required_activities' as used_by
    UNION ALL
    SELECT 'sprint_09_value_proposition', 'value_propositions', 'Core Activities.value_delivery_activities'
    UNION ALL
    SELECT 'sprint_15_core_activities', 'activities', 'Processes.decision_points'
    UNION ALL
    SELECT 'sprint_16_processes', 'core_decisions', 'Digitalization.digitalization_opportunities'
    UNION ALL
    SELECT 'sprint_17_digitalization', 'data_requirements', 'Digital Heart.data_lake_sources'
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
    SELECT field_value FROM sprint_14_route_to_market.field_outputs fo
    JOIN sprint_14_route_to_market.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id AND fo.field_id = ef.field_id AND ef.schema_name = 'sprint_14_route_to_market'
    LIMIT 1
) fo ON true
ORDER BY ef.schema_name;
