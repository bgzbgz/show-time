# Database Schema Documentation

## Overview

The Fast Track backend uses a **schema-per-tool** architecture with 33 PostgreSQL schemas:

- **3 Shared Schemas**: `shared.users`, `shared.organizations`, `shared.user_progress`
- **30 Tool Schemas**: `sprint_00_woop` through `sprint_30_program_overview`

## Schema Naming Convention

Tool schemas follow the pattern: `sprint_{XX}_{slug}`

Where:
- `XX` = Zero-padded sprint number (00-30)
- `slug` = Tool slug in kebab-case

Examples:
- `sprint_00_woop`
- `sprint_01_identity`
- `sprint_02_vision`
- `sprint_30_program_overview`

## Shared Schemas

### shared.users

Stores user accounts from LearnWorlds.

```sql
CREATE TABLE shared.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lms_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    organization_id UUID REFERENCES shared.organizations(id),
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'guru')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);
```

**Indexes:**
- Primary key on `id`
- Unique index on `lms_user_id`
- Unique index on `email`

### shared.organizations

Stores organization/company data.

```sql
CREATE TABLE shared.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Primary key on `id`
- Unique index on `slug`

### shared.user_progress

Tracks progress for all 30 tools.

```sql
CREATE TABLE shared.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES shared.users(id) ON DELETE CASCADE,
    tool_slug VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    unlocked_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tool_slug)
);
```

**Indexes:**
- Primary key on `id`
- Unique index on `(user_id, tool_slug)`
- Index on `user_id`
- Index on `status`

**Status Transitions:**
- `locked` → `unlocked` (when dependencies complete)
- `unlocked` → `in_progress` (when user starts)
- `in_progress` → `completed` (when submitted)

## Tool Schemas (30 total)

Each tool schema contains two tables:

### {schema_name}.submissions

Stores user submission data.

```sql
CREATE TABLE {schema_name}.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES shared.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES shared.organizations(id) ON DELETE SET NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'submitted', 'completed')),
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);
```

**Indexes:**
- Primary key on `id`
- Index on `user_id`
- Index on `(user_id, organization_id)`
- Index on `status`

**JSONB Data Structure:**
The `data` column stores tool-specific submission data. Structure varies by tool.

Example for Sprint 0 (WOOP):
```json
{
  "wish": "Launch a successful business",
  "outcome": "Revenue of $100k in first year",
  "obstacle": "Limited marketing budget",
  "plan": "Focus on organic social media growth"
}
```

### {schema_name}.field_outputs

Stores extracted field values for cross-tool dependencies.

```sql
CREATE TABLE {schema_name}.field_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES {schema_name}.submissions(id) ON DELETE CASCADE,
    field_id VARCHAR(255) NOT NULL,
    field_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Primary key on `id`
- Index on `submission_id`
- Index on `field_id`
- Index on `(submission_id, field_id)`

**Field ID Format:**
Field IDs follow the pattern: `{module}.{context}.{field_name}`

Examples:
- `identity.personal_dream`
- `identity.core_values`
- `vision.statement`
- `goals.primary_goal`

## Dependency System

### How Dependencies Work

1. **Field Extraction**: When a tool is submitted, the system extracts recognized field IDs from the submission data and stores them in `field_outputs`.

2. **Dependency Resolution**: When a user accesses a tool, the system:
   - Checks the tool's dependency configuration
   - Queries `field_outputs` tables across schemas to find required fields
   - Returns field values to populate the tool interface

3. **Unlock Logic**: When a tool is completed:
   - System checks which tools depend on this tool's outputs
   - For each dependent tool, checks if all dependencies are now satisfied
   - Unlocks tools where all dependencies are complete

### Dependency Configuration

Stored in `config/dependencies.json`:

```json
{
  "tools": {
    "sprint-2-vision": {
      "dependencies": [
        "identity.personal_dream",
        "identity.core_values"
      ],
      "outputs": [
        "vision.statement"
      ]
    }
  }
}
```

## Query Patterns

### Cross-Schema Field Query

```sql
SELECT fo.field_value
FROM sprint_01_identity.field_outputs fo
INNER JOIN sprint_01_identity.submissions s ON fo.submission_id = s.id
WHERE s.user_id = $1 AND fo.field_id = $2
ORDER BY s.updated_at DESC
LIMIT 1;
```

### Batch Field Query

```sql
SELECT fo.field_id, fo.field_value
FROM sprint_01_identity.field_outputs fo
INNER JOIN sprint_01_identity.submissions s ON fo.submission_id = s.id
WHERE s.user_id = $1 AND fo.field_id IN ($2, $3, $4);
```

### Progress Summary Query

```sql
SELECT
  COUNT(*) as total_tools,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
  SUM(CASE WHEN status = 'unlocked' THEN 1 ELSE 0 END) as unlocked,
  SUM(CASE WHEN status = 'locked' THEN 1 ELSE 0 END) as locked
FROM shared.user_progress
WHERE user_id = $1;
```

## Migrations

Database migrations are located in `backend/migrations/`.

To run migrations:

```bash
# Via psql
psql $DATABASE_URL < migrations/001-initial-schemas/001-shared-schemas.sql
psql $DATABASE_URL < migrations/001-initial-schemas/002-tool-schemas.sql

# Or via Supabase SQL Editor
# Copy and paste the SQL file contents
```

## Performance Considerations

- **Indexes**: All foreign keys and frequently queried fields are indexed
- **JSONB Indexing**: Consider adding GIN indexes on `data` and `field_value` columns for large datasets
- **Connection Pooling**: Use Supabase connection pooling in production
- **Query Optimization**: Batch queries when resolving multiple dependencies

## Backup and Restore

**Backup all schemas:**
```bash
pg_dump $DATABASE_URL > backup.sql
```

**Restore:**
```bash
psql $DATABASE_URL < backup.sql
```

## Schema Evolution

When adding a new tool:

1. Create new schema: `sprint_XX_newslug`
2. Run the `create_tool_schema()` function
3. Add tool to `config/tool-registry.json`
4. Add dependencies to `config/dependencies.json`
5. Update frontend navigation
