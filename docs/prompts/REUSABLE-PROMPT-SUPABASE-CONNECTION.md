# REUSABLE PROMPT: Connect Module Tools to Supabase

Use this prompt for connecting any module's tools to Supabase.

═══════════════════════════════════════════════════════════════════
## PROMPT TEMPLATE
═══════════════════════════════════════════════════════════════════

```
CONNECT MODULE [X] TOOLS TO SUPABASE

Verify Supabase connectivity for Module [X] ([Module Name]) tools.

═══════════════════════════════════════════════════════════════════
TOOLS TO VERIFY
═══════════════════════════════════════════════════════════════════

[List tools with their sprint numbers and schema names]

Example:
| Tool File | Sprint # | Schema Name | Tool Slug |
|-----------|----------|-------------|-----------|
| frontend/tools/module-2-strategy/06-market-size.html | 12 | sprint_12_market_size | market-size |
| frontend/tools/module-2-strategy/07-segmentation.html | 13 | sprint_13_segmentation | segmentation |

═══════════════════════════════════════════════════════════════════
VERIFICATION CHECKLIST
═══════════════════════════════════════════════════════════════════

For each tool, verify:

1. ✅ Supabase client loaded in <head>:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

2. ✅ CONFIG object exists with:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - TOOL_SLUG
   - SPRINT_NUMBER
   - SCHEMA_NAME (format: sprint_XX_toolname)
   - STORAGE_KEY

3. ✅ Supabase client initialized:
   const supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
   window.supabaseClient = supabaseClient;

4. ✅ Dependency injection initialized:
   <script src="../../shared/js/dependency-injection.js"></script>
   DependencyInjection.init(CONFIG.TOOL_SLUG, CONFIG.SCHEMA_NAME);

5. ✅ Submit function exists and calls:
   supabaseClient.rpc('submit_tool_data', {
       p_schema_name: CONFIG.SCHEMA_NAME,
       p_user_id: userId,
       p_data: submissionData,
       p_tool_slug: CONFIG.TOOL_SLUG
   })

6. ✅ Database schema exists:
   Check that sprint_XX_schemaname schema exists in database
   Check that schema has `submissions` and `field_outputs` tables

═══════════════════════════════════════════════════════════════════
IF TOOLS ARE MISSING SUPABASE CONNECTION
═══════════════════════════════════════════════════════════════════

Add this to each tool's <head> section (if missing):
```html
<!-- Supabase JS Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../../shared/js/dependency-injection.js"></script>
```

Add this to the <script> section after React imports:
```javascript
const CONFIG = {
    SUPABASE_URL: 'https://vpfayzzjnegdefjrnyoc.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZmF5enpqbmVnZGVmanJueW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzAwODUsImV4cCI6MjA4NTcwNjA4NX0.7qwzd9kwyRG0Wx9DDSc8F9a1SRD0CoC6CGS-9M1sxIs',
    TOOL_SLUG: '[tool-slug]',
    SPRINT_NUMBER: [X],
    SCHEMA_NAME: 'sprint_[XX]_[toolname]',
    AUTOSAVE_DELAY: 2000,
    STORAGE_KEY: 'fasttrack_[toolname]_data',
    TOOL_NAME: '[tool_name]'
};

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient;

// Initialize dependency injection
DependencyInjection.init(CONFIG.TOOL_SLUG, CONFIG.SCHEMA_NAME);
```

Add handleSubmit function (if missing):
```javascript
const handleSubmit = async () => {
    try {
        const userId = localStorage.getItem('ft_user_id');
        if (!userId) {
            alert('User not authenticated. Please return to the dashboard.');
            return;
        }

        const submissionData = {
            // ... collect all form data
        };

        const { data: result, error: submitError } = await supabaseClient
            .rpc('submit_tool_data', {
                p_schema_name: CONFIG.SCHEMA_NAME,
                p_user_id: userId,
                p_data: submissionData,
                p_tool_slug: CONFIG.TOOL_SLUG
            });

        if (submitError) throw submitError;

        if (!result || !result.success) {
            throw new Error(result?.message || 'Submission failed');
        }

        alert('Submitted successfully!');
        console.log('Submission ID:', result.submission_id);
        localStorage.setItem('lastSubmissionId', result.submission_id);

    } catch (error) {
        console.error('Submit error:', error);
        alert('Submit failed: ' + error.message);
    }
};
```

═══════════════════════════════════════════════════════════════════
DATABASE REQUIREMENTS
═══════════════════════════════════════════════════════════════════

Required database functions (already created):
- ✅ public.submit_tool_data(p_schema_name, p_user_id, p_data, p_tool_slug)
- ✅ public.execute_sql(query) - for dependency injection

Required schemas per tool:
- sprint_XX_toolname schema with:
  - submissions table (id, user_id, organization_id, data, status, version, created_at, updated_at, submitted_at, completed_at)
  - field_outputs table (id, submission_id, field_id, field_value, created_at)

Required shared tables:
- shared.users
- shared.user_progress (with unique constraint on user_id, tool_slug)
- shared.organizations

═══════════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════

For each tool provide:

| Tool | Status | Issues Found |
|------|--------|--------------|
| Tool 1 | ✅ Connected | None |
| Tool 2 | ⚠️ Partial | Missing CONFIG.SCHEMA_NAME |
| Tool 3 | ❌ Not Connected | No Supabase client |

Summary:
- X/Y tools fully connected
- Issues to fix: [list]
- Database schemas verified: [list]
```

═══════════════════════════════════════════════════════════════════
## EXAMPLE USAGE
═══════════════════════════════════════════════════════════════════

**Module 2 (Strategy):**
```
CONNECT MODULE 2 TOOLS TO SUPABASE

Verify Supabase connectivity for Module 2 (Strategy) tools.

TOOLS TO VERIFY:
- frontend/tools/module-2-strategy/06-market-size.html (Sprint 12, sprint_12_market_size)
- frontend/tools/module-2-strategy/07-segmentation.html (Sprint 13, sprint_13_segmentation)
- frontend/tools/module-2-strategy/08-target-segment.html (Sprint 14, sprint_14_target_segment)
- frontend/tools/module-2-strategy/09-value-proposition.html (Sprint 15, sprint_15_value_proposition)
```

**Module 3 (Business Model):**
```
CONNECT MODULE 3 TOOLS TO SUPABASE

Verify Supabase connectivity for Module 3 (Business Model) tools.

TOOLS TO VERIFY:
- frontend/tools/module-3-business-model/10-product-development.html (Sprint 17, sprint_17_product_development)
- frontend/tools/module-3-business-model/11-pricing.html (Sprint 18, sprint_18_pricing)
- frontend/tools/module-3-business-model/12-brand-marketing.html (Sprint 19, sprint_19_brand_marketing)
```

═══════════════════════════════════════════════════════════════════
## NOTES
═══════════════════════════════════════════════════════════════════

- The submit_tool_data and execute_sql functions are already created in the database
- All tools should use the same Supabase URL and anon key
- Schema names follow pattern: sprint_[two-digit-number]_[tool-name-with-underscores]
- Tool slugs use hyphens: market-size, know-thyself, etc.
- Each tool auto-saves to localStorage every 2 seconds
- Dependency injection automatically loads data from previous tools on page load
