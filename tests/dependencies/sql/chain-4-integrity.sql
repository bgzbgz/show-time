-- Chain 4 Integrity Check: Product Chain
-- Value Proposition → VP Testing → Product Dev → Pricing → Route to Market
-- Verifies all required fields exist in field_outputs for dependency chain

WITH test_user AS (
    SELECT '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad'::uuid as user_id
),
expected_fields AS (
    SELECT 'sprint_09_value_proposition' as schema_name, 'value_propositions' as field_id, 'VP Testing.hypotheses_to_test' as used_by
    UNION ALL
    SELECT 'sprint_10_vp_testing', 'validated_propositions', 'Product Dev.product_requirements'
    UNION ALL
    SELECT 'sprint_10_vp_testing', 'willingness_to_pay', 'Product Dev.wtp_baseline'
    UNION ALL
    SELECT 'sprint_11_product_dev', 'product_tiers', 'Pricing.pricing_tiers'
    UNION ALL
    SELECT 'sprint_10_vp_testing', 'willingness_to_pay', 'Pricing.price_anchors'
    UNION ALL
    SELECT 'sprint_12_pricing', 'pricing_model', 'Route to Market.revenue_model'
    UNION ALL
    SELECT 'sprint_13_brand_marketing', 'marketing_channels', 'Route to Market.channel_candidates'
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
    SELECT field_value FROM sprint_09_value_proposition.field_outputs fo
    JOIN sprint_09_value_proposition.submissions s ON fo.submission_id = s.id
    CROSS JOIN test_user tu
    WHERE s.user_id = tu.user_id AND fo.field_id = ef.field_id AND ef.schema_name = 'sprint_09_value_proposition'
    LIMIT 1
) fo ON true
ORDER BY ef.schema_name;
