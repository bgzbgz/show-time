## Why

Users coming from LearnWorlds courses currently have no seamless authentication path to Fast Track tools. They must manually log in, losing context from their course progress. We need SSO integration so users can click a button in LearnWorlds and land authenticated with their progress synced, eliminating friction and enabling progress-gated tool access based on course completion.

## What Changes

- **New SSO authentication flow**: Users authenticate via LearnWorlds HMAC-SHA256 signed tokens, receiving JWT sessions without a login form
- **Webhook endpoint for progress sync**: LearnWorlds sends course/lesson completion events that unlock corresponding sprint tools
- **User progress tracking system**: New database schema and APIs to track tool completion status, unlock state, and submission history
- **Tool locking mechanism**: Frontend checks unlock status before allowing access, shows locked UI for incomplete prerequisites
- **User data extension**: Add LearnWorlds identifiers to existing users table for SSO mapping
- **Session management**: JWT-based sessions with validation middleware for protected endpoints

## Capabilities

### New Capabilities

- `learnworlds-sso`: SSO token validation, HMAC signature verification, user lookup/creation, JWT session generation
- `learnworlds-webhooks`: Webhook signature verification, event processing (course/lesson completion), progress unlock logic
- `user-progress-tracking`: Database schema for tracking sprint/tool completion, unlock state, timestamps, and submission storage
- `frontend-auth-flow`: Client-side SSO token handling, session storage, authentication state management, redirect logic
- `tool-access-control`: Progress-based tool locking/unlocking, locked UI display, completion status checks

### Modified Capabilities

<!-- No existing specs are being modified - this is all new functionality -->

## Impact

**Backend:**
- New route file: `backend/src/routes/learnworlds.ts`
- New middleware: JWT validation for protected endpoints
- Database: New `user_progress` table, add columns to existing `users` table
- Environment variables: Add `LEARNWORLDS_WEBHOOK_SECRET`

**Frontend:**
- All tool HTML files in `frontend/tools/` need SSO handler integration
- New UI components: locked tool overlay, progress display

**Database:**
- Migration required for `user_progress` table
- Migration required for `users` table columns (learnworlds_user_id, learnworlds_email, sso_verified_at)

**Security:**
- HMAC signature validation for SSO tokens
- Webhook signature verification
- Timestamp-based replay attack prevention
- JWT session security

**External Dependencies:**
- LearnWorlds SSO configuration (webhook endpoints, secrets)
- Coordinate lesson-to-sprint mapping with course structure

**Compatibility:**
- Must not break existing Guru Suite routes/functionality
- Existing Supabase connection patterns must be preserved
