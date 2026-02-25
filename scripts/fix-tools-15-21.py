import re

tools = [
    'frontend/tools/15-value-proposition.html',
    'frontend/tools/16-value-proposition-testing.html',
    'frontend/tools/17-product-development.html',
    'frontend/tools/18-pricing.html',
    'frontend/tools/19-brand-marketing.html',
    'frontend/tools/20-customer-service.html',
    'frontend/tools/21-route-to-market.html'
]

old_pattern = r'''          const \{ data: submission, error: submitError \} = await supabaseClient
            \.from\(`\$\{CONFIG\.SCHEMA_NAME\}\.submissions`\)
            \.insert\(\{
              user_id: userId,
              data: data,
              status: 'completed',
              submitted_at: new Date\(\)\.toISOString\(\),
              completed_at: new Date\(\)\.toISOString\(\)
            \}\)
            \.select\(\)
            \.single\(\);

          if \(submitError\) throw submitError;

          const \{ error: progressError \} = await supabaseClient
            \.from\('shared\.user_progress'\)
            \.upsert\(\{
              user_id: userId,
              tool_slug: CONFIG\.TOOL_SLUG,
              status: 'completed',
              progress_percentage: 100,
              completed_at: new Date\(\)\.toISOString\(\)
            \}, \{
              onConflict: 'user_id,tool_slug'
            \}\);

          if \(progressError\) throw progressError;

          localStorage\.setItem\('lastSubmissionId', submission\.id\);
          alert\('([^']+)'\);'''

new_pattern = r'''          // Submit using RPC function (handles schema-specific tables)
          const { data: result, error: submitError } = await supabaseClient
            .rpc('submit_tool_data', {
              p_schema_name: CONFIG.SCHEMA_NAME,
              p_user_id: userId,
              p_data: data,
              p_tool_slug: CONFIG.TOOL_SLUG
            });

          if (submitError) throw submitError;

          if (!result || !result.success) {
            throw new Error(result?.message || 'Submission failed');
          }

          console.log('Submission ID:', result.submission_id);
          localStorage.setItem('lastSubmissionId', result.submission_id);
          alert('\1');'''

for tool_path in tools:
    print(f"Processing {tool_path}...")
    try:
        with open(tool_path, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = re.sub(old_pattern, new_pattern, content)

        if new_content != content:
            with open(tool_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  [OK] Fixed {tool_path}")
        else:
            print(f"  [WARNING] Pattern not found in {tool_path}")
    except Exception as e:
        print(f"  [ERROR] Error processing {tool_path}: {e}")

print("\nDone!")
