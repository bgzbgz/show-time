# Database Migrations

This directory contains SQL migration files for the Fast Track Tools backend database.

## Migration 001: Initial Schemas

Creates all required database schemas and tables for the Fast Track Tools platform.

### Files

1. **001-shared-schemas.sql** - Creates shared schemas:
   - `shared.users` - User accounts with LearnWorlds SSO integration
   - `shared.organizations` - Organization/company information
   - `shared.user_progress` - User progress tracking for all 31 tools

2. **002-tool-schemas.sql** - Creates 31 tool schemas:
   - Each schema follows pattern: `sprint_{XX}_{slug}`
   - Each schema contains:
     - `submissions` table - User submission data (JSONB)
     - `field_outputs` table - Extracted fields for cross-tool dependencies
   - Includes indexes for performance
   - Auto-updating `updated_at` triggers

## Running Migrations

### Option 1: Direct Supabase Execution

1. Log in to your Supabase dashboard
2. Navigate to SQL Editor
3. Execute migrations in order:
   - First: `001-shared-schemas.sql`
   - Second: `002-tool-schemas.sql`

### Option 2: Using psql CLI

```bash
# Set your Supabase connection string
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run migrations
psql $DATABASE_URL -f migrations/001-initial-schemas/001-shared-schemas.sql
psql $DATABASE_URL -f migrations/001-initial-schemas/002-tool-schemas.sql
```

### Option 3: Using Prisma

After running the migrations, generate Prisma client:

```bash
# Introspect existing database
npm run db:generate

# This will create prisma/schema.prisma with all tables
```

## Verification

After running migrations, verify all schemas exist:

```sql
-- Should return 31 tool schemas + 1 shared schema
SELECT
    nspname AS schema_name,
    (SELECT count(*) FROM information_schema.tables WHERE table_schema = nspname) AS table_count
FROM pg_namespace
WHERE nspname IN ('shared') OR nspname LIKE 'sprint_%'
ORDER BY nspname;
```

Expected result: 32 schemas total
- 1 `shared` schema (3 tables: users, organizations, user_progress)
- 31 `sprint_XX_*` schemas (2 tables each: submissions, field_outputs)

## Schema Structure

### Shared Schema
```
shared/
├── users
│   ├── id (UUID PK)
│   ├── lms_user_id (VARCHAR UNIQUE)
│   ├── email (VARCHAR UNIQUE)
│   ├── full_name (VARCHAR)
│   ├── organization_id (UUID FK)
│   ├── role (VARCHAR: user/admin/guru)
│   └── timestamps
├── organizations
│   ├── id (UUID PK)
│   ├── name (VARCHAR)
│   ├── slug (VARCHAR UNIQUE)
│   ├── settings (JSONB)
│   └── timestamps
└── user_progress
    ├── id (UUID PK)
    ├── user_id (UUID FK)
    ├── tool_slug (VARCHAR)
    ├── status (VARCHAR: locked/unlocked/in_progress/completed)
    ├── progress_percentage (INTEGER 0-100)
    └── timestamps (unlocked_at, started_at, completed_at)
```

### Tool Schema (repeated 31 times)
```
sprint_{XX}_{slug}/
├── submissions
│   ├── id (UUID PK)
│   ├── user_id (UUID FK to shared.users)
│   ├── organization_id (UUID FK to shared.organizations)
│   ├── data (JSONB) -- Tool-specific submission data
│   ├── status (VARCHAR: draft/in_progress/submitted/completed)
│   ├── version (INTEGER)
│   └── timestamps
└── field_outputs
    ├── id (UUID PK)
    ├── submission_id (UUID FK)
    ├── field_id (VARCHAR) -- e.g., 'identity.personal_dream'
    ├── field_value (JSONB)
    └── created_at
```

## Next Steps

1. Run migrations in Supabase
2. Verify all schemas created successfully
3. Run `npm run db:generate` to create Prisma client
4. Update `.env` with your Supabase connection string
5. Start backend development: `npm run dev`
