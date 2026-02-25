## Why

Client-side gurus (team leaders/facilitators) need a way to monitor their team's progress through the Fast Track Program without requiring traditional login credentials. Currently, there is no admin interface for gurus to view team submissions, track completion status, or manage meeting notes, making it difficult to provide effective guidance and support.

## What Changes

- Add database schema for multi-tenant organization management with guru access codes
- Create code-based authentication system for guru access (no traditional login)
- Build admin dashboard showing team progress, completion statistics, and member status
- Enable gurus to view individual team member tool submissions (read-only)
- Provide meeting notes management with action item tracking
- Integrate guru guide PDF distribution system
- Add "GURU LOGIN" button to existing WOOP tool for guru access
- Include comprehensive seed data for immediate testing with 3 organizations

## Capabilities

### New Capabilities

- `guru-access-control`: Code-based authentication system where each organization receives a unique sprint-specific access code (8-character alphanumeric) that validates against the database and grants access to that organization's sprint data
- `team-progress-dashboard`: Dashboard interface displaying team completion statistics, member progress status (completed/in-progress/not-started), and overall team performance metrics
- `submission-viewer`: Read-only view of individual team member tool submissions with formatted display of all WOOP fields and modal interface
- `meeting-notes`: Meeting notes management system with structured content storage (discussion points, key insights, concerns), action item tracking with assignees and due dates, and persistent storage per organization-sprint combination
- `guru-guides`: PDF guide storage and distribution system with sprint-specific guides, download capability, and file path management

### Modified Capabilities

None - this is a new feature set with no changes to existing capabilities.

## Impact

**Database:**
- New tables: `organizations`, `guru_access_codes`, `guru_guides`, `guru_meeting_notes`
- Modified tables: `users` (add `organization_id` column)
- Seed data for 3 test organizations with varying team sizes and progress states

**Backend:**
- New route file: `backend/src/routes/guru.js`
- New endpoints: code validation, dashboard data, submission retrieval, meeting notes CRUD
- Modified: `backend/src/index.js` to register guru routes

**Frontend:**
- New single-page application: `frontend/guru-suite/index.html`
- Modified: `frontend/tools/module-0-intro-sprint/00-woop.html` (add GURU LOGIN button)
- New content directory: `frontend/content/guru-guides/` (PDF storage)

**Dependencies:**
- Supabase (database operations)
- Existing user and tool submission schemas
