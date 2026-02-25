## Context

The Fast Track Program currently supports end-users (team members) completing sprint tools like WOOP through a frontend interface with data stored in Supabase. The existing architecture includes:

- **Database**: Supabase PostgreSQL with tables for `users`, `tool_submissions`, `user_progress`, and `autosave_data`
- **Backend**: Express.js API in `backend/src/` with route handlers
- **Frontend**: HTML/JavaScript tools in `frontend/tools/`
- **Authentication**: User-level authentication exists but no admin/guru access layer

**Current Gap**: Client-side gurus (team leaders at organizations like Luxottica, Acme Corp) have no way to:
- Monitor their team's progress through sprints
- View completed submissions to provide guidance
- Track meeting notes and action items
- Access sprint-specific facilitator guides

**Constraints**:
- Must use existing Supabase infrastructure
- Must not require traditional username/password for gurus (they receive codes from Fast Track)
- Must isolate data by organization (multi-tenancy)
- Must be testable immediately with seed data

## Goals / Non-Goals

**Goals:**
- Enable code-based guru access without traditional login
- Provide read-only visibility into team member submissions
- Support multi-tenant data isolation (organization-level)
- Create intuitive single-page dashboard interface
- Store meeting notes with structured action items
- Distribute sprint-specific PDF guides
- Include comprehensive test data for 3 organizations

**Non-Goals:**
- Guru ability to edit/delete team member submissions (read-only only)
- Multi-factor authentication or complex auth flows
- Real-time notifications or websocket updates
- Mobile-native application (web-only)
- Bulk data export beyond single PDF generation
- Guru-to-guru communication features
- Historical sprint comparison or analytics dashboard

## Decisions

### Decision 1: Code-Based Authentication vs Traditional Login

**Choice**: Implement code-based authentication where gurus enter an 8-character access code.

**Rationale**:
- **Simplicity**: Gurus are often non-technical facilitators who receive codes from Fast Track HQ
- **Distribution**: Easier to email a single code than manage account creation flows
- **Revocability**: Codes can be deactivated via `is_active` flag without complex user management
- **Sprint-Specific**: Each code is tied to one organization + one sprint, providing natural access scoping

**Alternatives Considered**:
- Traditional email/password login: Rejected due to complexity of account creation, password resets, and guru onboarding overhead
- Magic link authentication: Rejected because gurus may not have immediate email access during facilitation sessions
- OAuth (Google/Microsoft): Rejected due to organization SSO complexity and Fast Track not wanting dependency on third-party providers

**Implementation**:
- `guru_access_codes` table with unique code, organization_id, sprint_id
- API endpoint `/api/guru/validate-code` checks code validity
- Client-side session storage maintains authenticated state
- No JWT or session tokens—code is validated on initial entry, then included in subsequent API calls

### Decision 2: Multi-Tenancy via Organization Table

**Choice**: Introduce `organizations` table with `users.organization_id` foreign key.

**Rationale**:
- **Data Isolation**: Each organization's data is isolated via `organization_id` filter in queries
- **Scalability**: Supports adding more organizations without schema changes
- **Clarity**: Explicit relationship between users and organizations is easier to reason about than implicit grouping
- **Future-Proof**: Enables organization-level features (branding, settings, billing) later

**Alternatives Considered**:
- Implicit grouping by email domain: Rejected due to unreliability (contractors, shared email domains)
- Organization slug in user table only: Rejected because it requires string parsing and is error-prone
- Separate database per organization: Rejected due to operational complexity and Supabase pricing model

**Implementation**:
- Add `organizations` table with `id`, `name`, `slug`
- Alter `users` table to add `organization_id UUID REFERENCES organizations(id)`
- All guru API queries filter by `organization_id` derived from access code
- Use `ON CONFLICT` clauses in seed data to make inserts idempotent

### Decision 3: JSONB for Meeting Notes and Action Items

**Choice**: Store meeting notes content as JSONB with structured fields; store action items as JSONB array.

**Rationale**:
- **Flexibility**: Schema-less storage allows adding fields (e.g., "attendees", "next_meeting_date") without migrations
- **Query Capability**: PostgreSQL JSONB supports indexing and querying if analytics needed later
- **Frontend Convenience**: JSON natively maps to JavaScript objects, simplifying frontend code
- **Storage Efficiency**: Avoids creating multiple normalized tables for semi-structured data

**Alternatives Considered**:
- Separate tables for action items: Rejected due to overkill for simple lists; JSONB is sufficient
- Plain TEXT field with markdown: Rejected because it loses structure and makes querying impossible
- Relational schema with `meeting_notes_fields` and `action_items` tables: Rejected due to over-engineering

**Implementation**:
```sql
notes_content JSONB DEFAULT '{}'
action_items JSONB DEFAULT '[]'
```
- Frontend sends structured objects: `{"discussion_points": "...", "key_insights": "..."}`
- Backend validates JSON structure but does not enforce strict schema
- Use `->` and `->>` operators if querying JSONB in future

### Decision 4: Single-Page React Application in Vanilla HTML

**Choice**: Build `frontend/guru-suite/index.html` as a single-page application using React via CDN.

**Rationale**:
- **No Build Step**: Using React/ReactDOM via CDN avoids npm, webpack, babel complexity
- **Rapid Prototyping**: Faster to iterate without transpilation pipeline
- **Consistency**: Existing tools use similar approach (HTML + embedded JS)
- **Ease of Deployment**: Single HTML file can be served statically

**Alternatives Considered**:
- Separate React project with build step: Rejected due to added complexity and deployment overhead for a single admin page
- Vue.js or Svelte: Rejected due to team familiarity with React
- Pure vanilla JS: Rejected due to complexity of managing modal state, sorting, and conditional rendering

**Implementation**:
```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
  // React component code here
</script>
```
- Component structure: `<App>` → `<CodeEntry>` | `<Dashboard>`
- State management via React hooks (useState, useEffect)
- Conditional rendering based on authentication state

### Decision 5: REST API with Express Router

**Choice**: Create `/api/guru/*` routes in new `backend/src/routes/guru.js` file.

**Rationale**:
- **Separation of Concerns**: Guru routes isolated from user-facing routes
- **Consistency**: Matches existing backend architecture pattern
- **Middleware Reuse**: Can leverage existing Supabase client initialization
- **Testability**: Isolated router can be unit tested independently

**Alternatives Considered**:
- GraphQL API: Rejected due to overkill for simple CRUD operations and added dependency
- Serverless functions (Supabase Edge Functions): Rejected to keep all API logic in Express for consistency
- Inline routes in main index.js: Rejected due to file bloat and poor organization

**Implementation**:
- `POST /api/guru/validate-code`: Check code validity, return org/sprint context
- `GET /api/guru/dashboard/:code`: Aggregate dashboard data (members, progress, guide, notes)
- `GET /api/guru/submission/:code/:userId`: Fetch individual submission with access check
- `POST /api/guru/meeting-notes/:code`: Upsert meeting notes with JSONB payload

**Security**: All endpoints validate access code and verify organization ownership before returning data.

### Decision 6: Supabase MCP for Database Operations

**Choice**: Use Supabase MCP tools to create migrations and insert seed data.

**Rationale**:
- **Consistency**: Project already uses Supabase, MCP is the official tool
- **Migrations**: `apply_migration` tool creates versioned, replayable migrations
- **Testing**: Seed data can be inserted via `execute_sql` for immediate testing
- **Rollback**: Migrations are tracked in `supabase_migrations` table

**Alternatives Considered**:
- Raw SQL scripts run manually: Rejected due to lack of version tracking
- Prisma/Drizzle ORM: Rejected to avoid adding new dependencies mid-project
- Supabase Studio UI: Rejected because it's manual and not repeatable

**Implementation**:
- Call `mcp__supabase__apply_migration` for schema changes
- Call `mcp__supabase__execute_sql` for seed data (organizations, codes, users, submissions)
- Use `ON CONFLICT DO NOTHING` to make seed inserts idempotent

### Decision 7: Font Loading and Design System

**Choice**: Load custom fonts (`Plaak3Trial-43-Bold.woff2`, `RiformaLL-Regular.woff2`) from project files and use Fast Track brand colors.

**Rationale**:
- **Brand Consistency**: Guru Suite should match Fast Track visual identity
- **Performance**: Local font files avoid external requests and FOSS issues
- **Professionalism**: Custom typography elevates the admin interface

**Alternatives Considered**:
- Google Fonts: Rejected to maintain brand uniqueness
- System fonts: Rejected due to lack of visual polish

**Implementation**:
```css
@font-face {
  font-family: 'Plaak3';
  src: url('../../Designs/03. Fonts/woff2/Plaak3Trial-43-Bold.woff2') format('woff2');
}
```
- Colors: `#1A1A1A` (background), `#FFF469` (primary yellow), `#22C55E` (success green)
- Typography: Plaak3 for headings, RiformaLL for body text

## Risks / Trade-offs

### Risk 1: Code Security and Distribution
**Risk**: Access codes could be shared or leaked, granting unauthorized access to team data.

**Mitigation**:
- Codes are sprint-specific, limiting blast radius to one sprint
- `is_active` flag allows Fast Track to deactivate codes immediately
- Optional `expires_at` field enables time-limited access
- Future: Add IP restrictions or usage logging if abuse detected

### Risk 2: No Cross-Organization Access Control Enforcement at DB Level
**Risk**: Application-level filtering by `organization_id` could be bypassed if bugs exist in query logic.

**Mitigation**:
- All queries explicitly filter by `organization_id` derived from validated access code
- Use parameterized queries to prevent SQL injection
- Future: Implement Row Level Security (RLS) policies in Supabase for defense-in-depth

### Risk 3: JSONB Schema Drift
**Risk**: Meeting notes JSONB structure could become inconsistent if different versions of frontend send different shapes.

**Mitigation**:
- Document expected JSONB structure in specs (discussion_points, key_insights, concerns, next_steps)
- Backend validates presence of required keys before persisting
- Frontend uses TypeScript-like JSDoc comments to define expected shape
- Future: Add Zod or JSON schema validation

### Risk 4: Single HTML File Scalability
**Risk**: As features grow, single-page HTML file becomes unwieldy and hard to maintain.

**Mitigation**:
- Current scope is limited (5 capabilities), single file is manageable
- Component extraction to separate files can happen if file exceeds ~1000 lines
- Future: Migrate to proper React build setup with Vite if major features added

### Risk 5: PDF File Availability
**Risk**: If PDF files are missing from `frontend/content/guru-guides/`, download/preview buttons fail.

**Mitigation**:
- Seed data includes file path references in `guru_guides` table
- Frontend checks for 404 errors and displays appropriate message
- Future: Add file existence check in backend API endpoint

### Risk 6: No Pagination for Large Teams
**Risk**: Organizations with 100+ team members will have slow-loading dashboards.

**Mitigation**:
- Initial scope targets small-to-medium teams (up to 50 members)
- Table sorting and filtering provide some UX relief
- Future: Add pagination or virtualized scrolling if needed

## Migration Plan

### Phase 1: Database Setup (Supabase)
1. Create migrations for 4 new tables: `organizations`, `guru_access_codes`, `guru_guides`, `guru_meeting_notes`
2. Create migration to add `organization_id` column to `users` table
3. Execute seed data inserts (3 organizations, 3 access codes, 5 guide records, 10 test users, 3 submissions, 2 autosave drafts, 5 progress records, 1 meeting note)
4. Verify seed data with `SELECT` queries

### Phase 2: Backend API (Express.js)
1. Create `backend/src/routes/guru.js` with 4 endpoints
2. Register guru routes in `backend/src/index.js`: `app.use('/api/guru', guruRoutes);`
3. Test endpoints with Postman/curl using seed data codes ("LUXO-WOOP", "ACME-WOOP", "TECH-WOOP")

### Phase 3: Frontend (React SPA)
1. Create `frontend/guru-suite/index.html` with embedded React
2. Implement `<CodeEntry>` component with validation
3. Implement `<Dashboard>` component with progress stats, member table, submission modal, meeting notes panel, guru guide card
4. Add CSS with Fast Track design system colors and fonts
5. Test with seed data codes

### Phase 4: Integration Point
1. Add "GURU LOGIN" button to `frontend/tools/module-0-intro-sprint/00-woop.html`
2. Style button with Fast Track yellow border, fixed top-right position
3. Link to `/guru-suite/` path

### Rollback Strategy
- **Database**: Migrations are reversible via Supabase UI or `DROP TABLE` commands; seed data can be deleted via `DELETE FROM` queries filtered by test organization IDs
- **Backend**: Remove guru routes registration from `index.js`, delete `guru.js` file
- **Frontend**: Delete `frontend/guru-suite/` directory, remove button from `00-woop.html`

### Testing Verification
After deployment, verify:
1. Code "LUXO-WOOP" grants access to Luxottica dashboard showing 7 members (3 completed, 2 in progress, 2 not started)
2. "View Submission" on Paolo Bianchi displays his complete WOOP with 9/10 commitment level
3. Meeting notes display with 3 action items
4. Guru guide "WOOP Guru Guide" is downloadable
5. "GURU LOGIN" button visible on WOOP tool landing page

## Open Questions

1. **Code Distribution Mechanism**: How will Fast Track HQ generate and distribute access codes to client organizations? (Manual admin panel? Automated email?)
   - **Resolution Path**: Discuss with Fast Track team; may need future `/admin/codes` endpoint for internal team

2. **Code Rotation Policy**: Should access codes expire after sprint ends? Should they be rotated periodically?
   - **Resolution Path**: Use `expires_at` field; Fast Track can set policy (e.g., 30 days post-sprint)

3. **Multi-Sprint Access**: If a guru facilitates multiple sprints for same organization, do they receive one code per sprint or a single code?
   - **Current Decision**: One code per sprint (explicit in proposal)

4. **Guru Guide Placeholder**: If PDF files are not ready, should we display placeholder content or hide section?
   - **Resolution Path**: Hide guide section if no record in `guru_guides` table for sprint_id

5. **Action Item Assignment**: Should action items assignee be free text or dropdown of team members + guru?
   - **Current Decision**: Free text for flexibility (gurus may assign to external stakeholders)

6. **Export Format**: "Export All Submissions as PDF" mentioned in original spec—should this be MVP or future enhancement?
   - **Resolution Path**: Defer to Phase 2; initial version focuses on viewing, not exporting
