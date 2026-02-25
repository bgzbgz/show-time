# supabase/

Supabase project configuration and migration tracking.

## Project

- Project ID: `lutzzfaedkbsmbobmrzx`
- Dashboard: https://supabase.com/dashboard/project/lutzzfaedkbsmbobmrzx
- Region: (check dashboard)

## Migrations

Tracked in `migrations/`. Each migration file is named with a timestamp prefix.

| File | What it does |
|---|---|
| `20260213000000_add_learnworlds_fields.sql` | Adds LearnWorlds-related fields to users table |

Migrations applied via `supabase db push` or directly in the Supabase SQL editor.

## Applying a new migration

For DDL changes (CREATE TABLE, ALTER TABLE, policies), use the Supabase MCP tool `apply_migration` with a snake_case name. This keeps the migration history clean.

For one-off data fixes, use `execute_sql` directly.

## Key tables

| Table | Purpose |
|---|---|
| `users` | All platform users, linked to LearnWorlds via `learnworlds_user_id` |
| `organizations` | Companies using the platform |
| `tool_questions` | Master catalog of every question in every tool |
| `user_responses` | Every answer from every user |
| `tool_completions` | One row per user per completed tool |
| `ai_challenge_log` | Log of every AI evaluation (used in admin panel) |
| `webhook_events` | Raw LearnWorlds webhook payloads + error log |
| `guru_access_codes` | Facilitator access codes (LUXO-WOOP style) |
| `guru_meeting_notes` | Meeting notes saved by facilitators |
| `course_tool_mapping` | Maps LearnWorlds course IDs to tool slugs |
| `admin_users` | UUIDs of users allowed to access the admin panel |

## RLS

Row Level Security is enabled on all tables. Most tables have open SELECT policies for authenticated users (or anonymous for tool_questions). Admin tables use policies that check `admin_users`.
