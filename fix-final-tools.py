# Fix tools 15-21
import os

tools_dir = r"C:\Users\Admin\Desktop\show time\frontend\tools"
tools = [
    "15-value-proposition.html",
    "16-value-proposition-testing.html",
    "17-product-development.html",
    "18-pricing.html",
    "19-brand-marketing.html",
    "20-customer-service.html",
    "21-route-to-market.html"
]

for tool in tools:
    filepath = os.path.join(tools_dir, tool)
    print(f"Fixing {tool}...")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already fixed
    if 'submit_tool_data' in content:
        print(f"  Already fixed, skipping")
        continue

    # Find the start marker
    start_marker = "const { data: submission, error: submitError } = await supabaseClient"
    start_idx = content.find(start_marker)

    if start_idx == -1:
        print(f"  Start marker not found")
        continue

    # Find the alert after this point
    alert_marker = "alert('"
    alert_idx = content.find(alert_marker, start_idx)

    if alert_idx == -1:
        print(f"  Alert marker not found")
        continue

    # Find the end of alert
    alert_end = content.find("');", alert_idx)
    if alert_end == -1:
        print(f"  Alert end not found")
        continue

    alert_end += 3  # Include ');'

    # Extract the alert message
    alert_msg_start = alert_idx + len(alert_marker)
    alert_msg_end = content.find("')", alert_msg_start)
    alert_msg = content[alert_msg_start:alert_msg_end]

    # Create replacement text
    replacement = f"""// Submit using RPC function (handles schema-specific tables)
          const {{ data: result, error: submitError }} = await supabaseClient
            .rpc('submit_tool_data', {{
              p_schema_name: CONFIG.SCHEMA_NAME,
              p_user_id: userId,
              p_data: data,
              p_tool_slug: CONFIG.TOOL_SLUG
            }});

          if (submitError) throw submitError;

          if (!result || !result.success) {{
            throw new Error(result?.message || 'Submission failed');
          }}

          console.log('Submission ID:', result.submission_id);
          localStorage.setItem('lastSubmissionId', result.submission_id);
          alert('{alert_msg}');"""

    # Replace the content
    new_content = content[:start_idx] + replacement + content[alert_end:]

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  Fixed successfully")

print("\nAll tools processed!")
