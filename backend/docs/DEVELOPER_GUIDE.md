# Developer Guide

## Adding a New Tool

This guide walks through adding a new tool to the Fast Track platform.

### Prerequisites

- Access to Supabase database
- Understanding of the tool's purpose and field requirements
- List of dependencies from previous tools (if any)

### Step 1: Create Database Schema

Create a new schema for your tool in the database:

```sql
-- Use the create_tool_schema function
SELECT create_tool_schema('sprint_XX_toolslug');

-- Example for Sprint 31: Strategy Tool
SELECT create_tool_schema('sprint_31_strategy');
```

This creates:
- Schema `sprint_31_strategy`
- Table `sprint_31_strategy.submissions`
- Table `sprint_31_strategy.field_outputs`
- All necessary indexes

### Step 2: Add to Tool Registry

Edit `config/tool-registry.json`:

```json
{
  "tools": [
    {
      "slug": "sprint-31-strategy",
      "name": "Strategy Development",
      "sprint_number": 31,
      "description": "Develop your 3-year business strategy",
      "category": "planning",
      "estimated_time_minutes": 45
    }
  ]
}
```

**Required fields:**
- `slug`: Kebab-case identifier (matches schema name with hyphens)
- `name`: Display name
- `sprint_number`: Numeric identifier
- `description`: Brief description for users
- `category`: Tool category (planning, execution, reflection, etc.)
- `estimated_time_minutes`: Estimated completion time

### Step 3: Define Dependencies

Edit `config/dependencies.json`:

```json
{
  "tools": {
    "sprint-31-strategy": {
      "dependencies": [
        "vision.statement",
        "goals.primary_goal",
        "market.target_audience"
      ],
      "outputs": [
        "strategy.three_year_plan",
        "strategy.milestones"
      ]
    }
  }
}
```

**Dependencies:**
- List field IDs from previous tools that this tool needs
- Format: `{module}.{field_name}`

**Outputs:**
- List field IDs that this tool produces
- These will be extracted and stored in `field_outputs`

### Step 4: Create Validation Schema

Create `src/schemas/sprint-31-strategy.ts`:

```typescript
import { z } from 'zod';

export const Sprint31StrategySchema = z.object({
  three_year_plan: z.string().min(100).max(5000),
  milestones: z.array(z.object({
    year: z.number().min(1).max(3),
    goal: z.string().min(10).max(500),
    metrics: z.string().min(10).max(500),
  })).min(3).max(10),
  competitive_advantage: z.string().min(50).max(2000),
  risks: z.array(z.string()).min(3).max(10),
});

export type Sprint31StrategyData = z.infer<typeof Sprint31StrategySchema>;
```

### Step 5: Create Export Template (Optional)

Create `backend/src/templates/sprint-31-strategy.hbs`:

```handlebars
<!DOCTYPE html>
<html>
<head>
  <title>Strategy Development - {{tool.name}}</title>
  <style>
    /* Custom styles for this tool */
  </style>
</head>
<body>
  <h1>3-Year Strategy</h1>

  <div class="section">
    <h2>Strategic Plan</h2>
    <p>{{submission.data.three_year_plan}}</p>
  </div>

  <div class="section">
    <h2>Milestones</h2>
    {{#each submission.data.milestones}}
      <div class="milestone">
        <h3>Year {{this.year}}</h3>
        <p><strong>Goal:</strong> {{this.goal}}</p>
        <p><strong>Metrics:</strong> {{this.metrics}}</p>
      </div>
    {{/each}}
  </div>

  {{#if dependencies}}
    <div class="dependencies">
      <h2>Built Upon</h2>
      {{#each dependencies}}
        <p><strong>{{@key}}:</strong> {{this.value}}</p>
      {{/each}}
    </div>
  {{/if}}
</body>
</html>
```

### Step 6: Test the Tool

1. **Create test user progress**:
```sql
INSERT INTO shared.user_progress (user_id, tool_slug, status)
VALUES ('test-user-id', 'sprint-31-strategy', 'unlocked');
```

2. **Test submission endpoint**:
```bash
curl -X POST http://localhost:3000/api/tools/sprint-31-strategy/data \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "three_year_plan": "Our strategy focuses on...",
      "milestones": [...]
    }
  }'
```

3. **Test dependency resolution**:
```bash
curl http://localhost:3000/api/tools/sprint-31-strategy/dependencies \
  -H "Authorization: Bearer $TOKEN"
```

4. **Test export**:
```bash
curl http://localhost:3000/api/tools/sprint-31-strategy/export?format=pdf \
  -H "Authorization: Bearer $TOKEN" \
  --output strategy.pdf
```

### Step 7: Update Frontend

1. Add tool to frontend navigation
2. Create tool-specific UI component
3. Implement dependency field population
4. Add tool-specific validation

### Step 8: Deploy

1. Run database migrations in production
2. Deploy backend with updated config files
3. Deploy frontend with new tool UI
4. Test end-to-end flow

## Field ID Conventions

Follow these conventions for field IDs:

**Format:** `{module}.{context}.{field_name}`

**Module:** High-level category
- `identity` - Personal identity/values
- `vision` - Vision and direction
- `goals` - Goal setting
- `market` - Market analysis
- `strategy` - Strategic planning
- `execution` - Execution planning
- `metrics` - Measurement and tracking

**Context:** Specific sub-category (optional)
- `identity.personal_dream`
- `goals.primary_goal`
- `market.target.audience`

**Field Name:** Descriptive name in snake_case
- Use lowercase
- Separate words with underscores
- Be specific but concise

**Examples:**
- ✅ `identity.personal_dream`
- ✅ `goals.primary_goal`
- ✅ `market.target_audience`
- ❌ `dream` (too vague)
- ❌ `identity-personal-dream` (wrong separator)
- ❌ `Identity.PersonalDream` (wrong case)

## Handlebars Template Guide

### Available Context

```javascript
{
  tool: {
    slug: 'sprint-0-woop',
    name: 'WOOP Framework',
    sprint_number: 0,
    description: '...'
  },
  submission: {
    id: 'uuid',
    data: { /* user submission data */ },
    status: 'completed',
    version: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  dependencies: {
    'identity.personal_dream': {
      value: 'Launch a successful business',
      source_tool: 'sprint-1-identity',
      available: true
    }
  },
  generated_at: '2024-01-01T00:00:00Z'
}
```

### Common Helpers

Handlebars built-in helpers:

```handlebars
{{#each items}}
  {{this}}
{{/each}}

{{#if condition}}
  true branch
{{else}}
  false branch
{{/if}}

{{#unless condition}}
  inverted if
{{/unless}}
```

## Troubleshooting

### Tool Not Appearing in List

- Check `config/tool-registry.json` is valid JSON
- Restart backend server to reload config
- Verify slug matches schema name pattern

### Dependencies Not Resolving

- Check field IDs in `config/dependencies.json`
- Verify field_outputs table has the required fields
- Check previous tool was actually completed

### Export Fails

- Verify Handlebars template syntax is valid
- Check template file name matches tool slug
- Test with JSON export first to verify data structure

### Unlock Logic Not Working

- Verify all dependencies are listed correctly
- Check user_progress status for prerequisite tools
- Review ToolOrchestrator logs for unlock attempts

## Best Practices

1. **Keep submission data flat**: Avoid deep nesting in JSONB
2. **Use meaningful field IDs**: Follow the naming convention
3. **Test dependencies**: Always test with real data from previous tools
4. **Document output fields**: Clearly document what each field represents
5. **Handle missing dependencies**: Always check `field.available` in templates
6. **Version your changes**: Use database migrations for schema changes
7. **Test exports**: Verify PDF renders correctly with sample data

## Resources

- [Handlebars Documentation](https://handlebarsjs.com/)
- [Zod Schema Validation](https://zod.dev/)
- [PostgreSQL JSONB Functions](https://www.postgresql.org/docs/current/functions-json.html)
