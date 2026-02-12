#!/bin/bash

# Supabase credentials
SUPABASE_URL="https://vpfayzzjnegdefjrnyoc.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZmF5enpqbmVnZGVmanJueW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzAwODUsImV4cCI6MjA4NTcwNjA4NX0.7qwzd9kwyRG0Wx9DDSc8F9a1SRD0CoC6CGS-9M1sxIs"

# Tool configurations: filename|slug|sprint|schema
declare -a tools=(
    "01-know-thyself.html|know-thyself|1|sprint_01_know_thyself"
    "02-dream.html|dream|2|sprint_02_dream"
    "03-values.html|values|3|sprint_03_values"
    "04-team.html|team|4|sprint_04_team"
    "05-fit.html|fit|5|sprint_05_fit"
    "06-cash.html|cash|6|sprint_06_cash"
    "07-energy.html|energy|7|sprint_07_energy"
    "08-goals.html|goals|8|sprint_08_goals"
    "09-focus.html|focus|9|sprint_09_focus"
    "10-performance.html|performance|10|sprint_10_performance"
    "11-meeting-rhythm.html|meeting-rhythm|11|sprint_11_meeting_rhythm"
    "12-market-size.html|market-size|12|sprint_12_market_size"
    "13-segmentation-target-market.html|segmentation|13|sprint_13_segmentation"
    "14-target-segment-deep-dive.html|target-segment|14|sprint_14_target_segment"
    "15-value-proposition.html|value-proposition|15|sprint_15_value_proposition"
    "16-value-proposition-testing.html|vp-testing|16|sprint_16_vp_testing"
    "17-product-development.html|product-development|17|sprint_17_product_development"
    "18-pricing.html|pricing|18|sprint_18_pricing"
    "19-brand-marketing.html|brand-marketing|19|sprint_19_brand_marketing"
    "20-customer-service.html|customer-service|20|sprint_20_customer_service"
    "21-route-to-market.html|route-to-market|21|sprint_21_route_to_market"
    "22-core-activities.html|core-activities|22|sprint_22_core_activities"
    "23-processes-decisions.html|processes-decisions|23|sprint_23_processes_decisions"
    "24-fit-abc-analysis.html|fit-abc|24|sprint_24_fit_abc"
    "25-org-redesign.html|org-redesign|25|sprint_25_org_redesign"
    "26-employer-branding.html|employer-branding|26|sprint_26_employer_branding"
    "27-agile-teams.html|agile-teams|27|sprint_27_agile_teams"
    "28-digitalization.html|digitalization|28|sprint_28_digitalization"
    "29-digital-heart.html|digital-heart|29|sprint_29_digital_heart"
)

cd "C:/Users/Admin/Desktop/show time/frontend/tools"

for tool_config in "${tools[@]}"; do
    IFS='|' read -r filename slug sprint schema <<< "$tool_config"

    echo "Updating $filename..."

    # 1. Add Supabase CDN after Tailwind (if not already present)
    if ! grep -q "@supabase/supabase-js" "$filename"; then
        sed -i '/cdn.tailwindcss.com/a\    <!-- Supabase JS Client -->\n    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>' "$filename"
    fi

    # 2. Replace CONFIG section with Supabase config
    sed -i "s|AUTOSAVE_WEBHOOK:.*|SUPABASE_URL: '$SUPABASE_URL',|" "$filename"
    sed -i "s|SHARE_WEBHOOK:.*|SUPABASE_ANON_KEY: '$SUPABASE_KEY',|" "$filename"
    sed -i "s|SUBMIT_WEBHOOK:.*|TOOL_SLUG: '$slug',|" "$filename"
    sed -i "/TOOL_SLUG:/a\            SPRINT_NUMBER: $sprint,\n            SCHEMA_NAME: '$schema'," "$filename"

    # 3. Add Supabase client initialization after CONFIG
    if ! grep -q "createClient" "$filename"; then
        sed -i "/const CONFIG = {/,/};/a\\\n        // Initialize Supabase client\n        const { createClient } = supabase;\n        const supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);" "$filename"
    fi

    echo "  ✓ Updated $filename"
done

echo "All tools updated with Supabase configuration!"
echo "Note: You still need to update handleSubmit functions manually for each tool."
