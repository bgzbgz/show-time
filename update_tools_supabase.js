const fs = require('fs');
const path = require('path');

// Tool configurations
const tools = [
  { file: '14-target-segment-deep-dive.html', slug: 'target-segment', sprint: 14, schema: 'sprint_14_target_segment' },
  { file: '15-value-proposition.html', slug: 'value-proposition', sprint: 15, schema: 'sprint_15_value_proposition' },
  { file: '16-value-proposition-testing.html', slug: 'vp-testing', sprint: 16, schema: 'sprint_16_vp_testing' },
  { file: '17-product-development.html', slug: 'product-development', sprint: 17, schema: 'sprint_17_product_development' },
  { file: '18-pricing.html', slug: 'pricing', sprint: 18, schema: 'sprint_18_pricing' },
  { file: '19-brand-marketing.html', slug: 'brand-marketing', sprint: 19, schema: 'sprint_19_brand_marketing' },
  { file: '20-customer-service.html', slug: 'customer-service', sprint: 20, schema: 'sprint_20_customer_service' },
  { file: '21-route-to-market.html', slug: 'route-to-market', sprint: 21, schema: 'sprint_21_route_to_market' }
];

const supabaseConfig = `
    // Configuration
    const CONFIG = {
      SUPABASE_URL: 'https://vpfayzzjnegdefjrnyoc.supabase.co',
      SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZmF5enpqbmVnZGVmanJueW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzAwODUsImV4cCI6MjA4NTcwNjA4NX0.7qwzd9kwyRG0Wx9DDSc8F9a1SRD0CoC6CGS-9M1sxIs',
      TOOL_SLUG: 'TOOL_SLUG_PLACEHOLDER',
      SPRINT_NUMBER: SPRINT_NUMBER_PLACEHOLDER,
      SCHEMA_NAME: 'SCHEMA_NAME_PLACEHOLDER',
      AUTOSAVE_DELAY: 2000
    };

    const { createClient } = supabase;
    const supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
`;

const handleSubmitTemplate = `
      const handleSubmit = async () => {
        try {
          // Get user ID from localStorage
          const userId = localStorage.getItem('ft_user_id');
          if (!userId) {
            alert('User not authenticated. Please return to the dashboard.');
            return;
          }

          const submissionData = {
            ...ORIGINAL_DATA_HERE
          };

          // Insert into Supabase
          const { data: submission, error: submitError } = await supabaseClient
            .from(\`\${CONFIG.SCHEMA_NAME}.submissions\`)
            .insert({
              user_id: userId,
              data: submissionData,
              status: 'completed',
              submitted_at: new Date().toISOString(),
              completed_at: new Date().toISOString()
            })
            .select()
            .single();

          if (submitError) throw submitError;

          // Update user progress
          const { error: progressError } = await supabaseClient
            .from('shared.user_progress')
            .upsert({
              user_id: userId,
              tool_slug: CONFIG.TOOL_SLUG,
              status: 'completed',
              progress_percentage: 100,
              completed_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,tool_slug'
            });

          if (progressError) throw progressError;

          localStorage.setItem('lastSubmissionId', submission.id);
          alert('Submission successful!');
        } catch (error) {
          console.error('Submit error:', error);
          alert('Submission failed: ' + error.message + '\\n\\nYour data is still saved locally. Please try again or contact support.');
        }
      };
`;

console.log('Tool configurations ready.');
console.log('Tools to update:', tools.map(t => t.file).join(', '));
console.log('Use Edit tool to apply changes manually to each file.');
