# Session Report — 2026-02-20

## Session Scope

This was a continuation session that spanned two context windows. It covered five major workstreams:

1. AI Suggest-Slices button UI (carried over from previous session)
2. Database updates for new WOOP 6-step mode
3. Fixing the AI challenge layer for anonymous/incognito users
4. Creating a standalone playground repo (ft-playground)
5. Dependency display, tool access control, and LearnWorlds webhook system

---

## 1. What Was Built

### 1A. AI Suggest-Slices Button (Step 6 — Cut the Elephant)

**What**: A button in the WOOP tool's Step 6 that calls `POST /api/ai/suggest-slices` to auto-generate 3 actionable task slices from the user's elephant goal.

**Files changed**:
- `frontend/tools/module-0-intro-sprint/00-woop.html` — Added button with loading spinner, disabled state when input < 10 chars, error display. CSS `@keyframes spin` animation added.

**Backend endpoint** (created in prior session):
- `POST /api/ai/suggest-slices` in `backend/src/routes/ai.ts`
- `ChallengeService.suggestSlices()` in `backend/src/services/ChallengeService.ts`

**Status**: Deployed and working.

---

### 1B. Database Updates for WOOP 6-Step Mode

**What**: The WOOP tool was expanded from 4 steps to 6 steps (WOOP + Pre-mortem + Cut the Elephant). The database needed question definitions and updated AI prompts.

**Changes**:
- Added 10 new rows to `tool_questions` table:
  - 5 for Pre-mortem (step 5): `fear_1` through `fear_5`
  - 5 for Cut the Elephant (step 6): `elephant_goal`, `slice_1` through `slice_3`, `first_action`
- Updated `ai_challenge_prompts` row for WOOP tool with coaching context for Pre-mortem and Elephant steps

**Status**: Live in Supabase.

---

### 1C. AI Challenge Fix for Anonymous Users

**What**: The AI challenge layer was silently skipping review for users without `ft_user_id` (anonymous/incognito). This was a two-part bug.

**Root causes**:
1. Frontend line 714: `if (!userId) { setStep(step === lastStep ? 999 : step + 1); return; }` — silently advanced without AI review
2. Backend validated `user_id` against `users` table, rejecting any ID not in the DB

**Fixes**:
- **Frontend** (`00-woop.html`): Generate `anon-<uuid>` via `crypto.randomUUID()` when no `ft_user_id` exists
- **Backend** (`routes/ai.ts`): Changed `user_id` validation from `z.string().uuid()` to `z.string().min(1)`. Added `isAnonymous` check to skip users table lookup for `anon-` prefixed IDs
- **Database migration** (`allow_anonymous_ai_challenge`): Dropped FK constraint on `ai_challenge_log.user_id`, changed column from `uuid` to `text`

**Status**: Deployed. Anonymous users now get AI review.

---

### 1D. Playground Repo (ft-playground)

**What**: Standalone repo hosting the tool gallery page for quick testing without authentication.

**Repo**: `github.com/bgzbgz/ft-playground`
**Hosted**: GitHub Pages

**Contents**:
- `index.html` — Modified `tools-gallery.html` (removed welcome modal, updated subtitle to "Dev Playground")
- Full copy of `frontend/tools/`, `frontend/shared/`, `frontend/fonts/`
- `package.json` with `npx serve -s . -l 3000` for local dev

**Status**: Live on GitHub Pages.

---

### 1E. Dependency Display, Tool Access Control, and Webhook System

This was the largest workstream — three interconnected features.

#### 1E-i. Dependency Injection Display (Yellow Box)

**What**: When a tool receives data from upstream tools (e.g., "value proposition" flowing into downstream tools), it now shows a branded yellow box instead of a green border.

**File changed**: `frontend/shared/js/dependency-injection.js`

**Changes**:
- Added `createDependencyBox()` function — renders a yellow (#FFF469) box with:
  - Person SVG icon
  - "This is your [label]" header (Monument font, 11px, uppercase)
  - The actual value (Riforma font, 14px)
  - Source tool attribution ("From: [tool name]")
- Updated `populateField()` to accept `displayLabel` and `sourceTool` params
- Updated `loadDependencies()` to pass `dep.display_label` and `dep.source_tool`
- Changed notification toast from green to black/yellow brand colors
- Changed `.dependency-injected` CSS from green border to yellow border with light yellow background

#### 1E-ii. Tool Access Control (Lock Screen)

**What**: Prevents users from accessing tools before completing prerequisites. Shows a branded lock screen listing missing tools.

**File**: `frontend/js/tool-access-control.js` (rewritten from scratch)

**How it works**:
- Uses `DependencyInjection.getDependenciesConfig()` for the dependency graph
- Queries `tool_completions` table via `window.supabaseClient`
- If prerequisites not met: renders full-screen black overlay with yellow accents, lock icon, missing tools list, "Go Back" button
- WOOP is always accessible (no prerequisites)
- No user = test mode (allows access for playground use)

**Integration**: Tools include `<script src="../../js/tool-access-control.js"></script>` and call `ToolAccessControl.init('tool-slug')`.

#### 1E-iii. LearnWorlds Webhook Endpoint

**What**: Receives `courseCompleted` events from LearnWorlds, maps courses to tools, and inserts `tool_completions` rows to unlock the next tool.

**File**: `backend/src/routes/webhooks.ts` (new)

**Endpoint**: `POST /api/webhooks/learnworlds/course-completed`

**Flow**:
1. Verify `x-webhook-secret` header against `LEARNWORLDS_WEBHOOK_SECRET` env var
2. Validate payload with Zod (`CourseCompletedPayloadSchema`)
3. Map `course_id` to `tool_slug` — queries `course_tool_mapping` DB table first, falls back to hardcoded map
4. Upsert user by email (find or create in `users` table)
5. Upsert `tool_completions` row (idempotent via `onConflict: 'user_id,tool_slug'`)
6. Log to `webhook_events` table
7. Always returns 200 OK

**Route registration**: Added to `backend/src/index.ts` as `app.use('/api/webhooks', webhookRoutes)`

#### Database Changes for 1E

**Migration: `add_webhook_and_access_tables`**:
- `webhook_events` table (id, source, event_type, payload, processed, error_message, created_at)
- `course_tool_mapping` table (id, course_id, course_title, tool_slug, module_number, sprint_number) with 30 placeholder rows

**Migration: `extend_tool_completions_for_webhooks`**:
- Added `source text`, `course_id text`, `course_title text` columns to `tool_completions`
- Added unique constraint `tool_completions_user_tool_unique` on `(user_id, tool_slug)`

**Status**: All deployed. Backend running on Railway. Webhook endpoint returns `{"received":true,"processed":false,"reason":"unauthorized"}` when tested without secret (correct behavior).

---

## 2. Mistakes Made and How to Avoid Them

### MISTAKE 1: Silent failure on missing user ID

**What happened**: The frontend WOOP `handleNext()` function had `if (!userId) { setStep(...); return; }` which silently skipped AI review for anonymous users. No error, no log, no indication.

**Why it was bad**: Users in incognito mode (or without `ft_user_id` in localStorage) got zero AI feedback. The feature appeared broken with no clues why.

**How to avoid**:
- **Never silently skip core logic based on optional state.** If a feature should work for all users, handle the missing-state case explicitly (generate a temp ID, show a warning, etc.).
- **Always log when skipping a feature path.** Even if you decide to skip, `console.warn('Skipping AI review — no user ID')` would have saved debugging time.
- **Test in incognito early.** Incognito strips localStorage, which is a common real-world scenario.

---

### MISTAKE 2: Backend validated user_id as UUID and against users table

**What happened**: `routes/ai.ts` used `z.string().uuid()` for user_id validation and then checked `users` table. Anonymous users with generated IDs couldn't pass either check.

**Why it was bad**: The frontend fix (generating `anon-` IDs) was useless until the backend was also fixed. Two fixes needed instead of one.

**How to avoid**:
- **Design for anonymous use from the start.** If a feature should work without auth, the schema and validation must accommodate non-UUID identifiers.
- **Use `z.string().min(1)` instead of `z.string().uuid()` when the field might carry non-UUID values.**
- **When changing the frontend contract, always check the backend contract simultaneously.**

---

### MISTAKE 3: Database column mismatch — webhook route wrote columns that didn't exist

**What happened**: The webhook route's `tool_completions` upsert included `source`, `course_id`, `course_title` fields, but the table only had `id, user_id, tool_slug, completed_at`. Also missing the unique constraint needed for `onConflict: 'user_id,tool_slug'`.

**Why it was bad**: The webhook would have thrown Supabase errors on every call. Caught before user testing, but could have been embarrassing.

**How to avoid**:
- **Always check the actual table schema before writing code that inserts/upserts.** Run `SELECT column_name FROM information_schema.columns WHERE table_name = 'xxx'` before writing the route.
- **When creating a new route that writes to an existing table, list what columns you need and verify they exist.**
- **When using `onConflict`, verify the unique constraint exists.** Supabase will silently fail or error without it.

---

### MISTAKE 4: webhook_events schema mismatch — route used wrong column names

**What happened**: The `logWebhookEvent` helper inserted `processed_at` and `success` columns, but the actual table had `processed` (boolean) and `created_at` (auto). Had to fix the insert to use `processed: success` and remove `processed_at`.

**Why it was bad**: Same class of bug as Mistake 3 — writing to columns that don't exist.

**How to avoid**:
- **Same fix as above: always verify table schema before coding inserts.**
- **When a background agent creates the table and another agent creates the route, explicitly cross-check the schemas match.** Parallel work creates schema drift risk.

---

### MISTAKE 5: Railway cold start masking failures

**What happened**: On Railway's trial plan, the backend sleeps after inactivity. When the user tested the AI challenge, the request timed out because the server was waking up. The frontend catch block silently advanced the user, making it look like the AI feature was broken.

**Why it was bad**: Impossible to distinguish "AI is broken" from "server is sleeping" from the user's perspective.

**How to avoid**:
- **Add timeout handling with user-visible feedback.** Instead of silently catching and advancing, show "Server is waking up, please wait..." or retry once after a delay.
- **Consider adding a health check ping before the first AI call** if the server might be sleeping.
- **On Railway trial: set `sleepApplication: false`** if you can afford it, or accept the cold-start behavior and handle it in the frontend.

---

### MISTAKE 6: tool-access-control.js depended on non-existent window.authManager

**What happened**: The original file was scaffolded but referenced `window.authManager` which doesn't exist anywhere in the codebase. The access control was effectively dead code.

**Why it was bad**: It looked like the feature existed but it was completely non-functional.

**How to avoid**:
- **When scaffolding code, test it immediately.** Don't leave placeholder dependencies that don't exist.
- **Before building on existing code, verify its dependencies actually work.** A quick grep for `authManager` across the codebase would have revealed it's undefined.

---

### MISTAKE 7: Parallel background agents creating inconsistent schemas

**What happened**: One background agent created the `webhook_events` table with certain column names, while another agent wrote the webhook route using different column names. Both worked independently but didn't coordinate.

**Why it was bad**: Required a post-hoc fix to align the route with the table.

**How to avoid**:
- **When using parallel agents for related tasks (DB schema + route code), define the schema contract first**, then pass it to both agents.
- **Or: create the table first, then create the route** — sequential, not parallel, for interdependent work.
- **Always do a final integration check after parallel agents complete.**

---

## 3. Current System State

### Deployed URLs
- **Frontend**: https://fasttracktools.up.railway.app
- **Backend**: https://backend-production-639c.up.railway.app
- **Health**: https://backend-production-639c.up.railway.app/api/health
- **Webhook**: https://backend-production-639c.up.railway.app/api/webhooks/learnworlds/course-completed
- **Playground**: GitHub Pages at bgzbgz/ft-playground

### Supabase Tables (key ones)
| Table | Purpose | Status |
|-------|---------|--------|
| users | User accounts | 14 users, all `learnworlds_user_id` empty |
| tool_completions | Tracks which tools a user has completed | Extended with source/course columns + unique constraint |
| tool_questions | Question definitions per tool | Updated with Pre-mortem + Elephant questions |
| ai_challenge_prompts | Per-tool AI coaching prompts | WOOP updated for 6-step mode |
| ai_challenge_log | Logs every AI challenge | Changed user_id from uuid FK to text for anonymous support |
| webhook_events | Logs incoming webhooks | New, empty |
| course_tool_mapping | Maps LearnWorlds course IDs to tool slugs | 30 placeholder rows (need real IDs) |
| user_responses | Stores user answers per tool | Working |

### Railway Environment Variables Needed
| Variable | Status |
|----------|--------|
| SUPABASE_URL | Set |
| SUPABASE_ANON_KEY | Set |
| ANTHROPIC_API_KEY | Set |
| JWT_SECRET | Set |
| LEARNWORLDS_WEBHOOK_SECRET | **NOT SET — must be added** |

### Git Status
- Branch: `main`
- Latest commit: `3e0db63` — "Add dependency display, tool access control, and LearnWorlds webhook"
- Many deleted files in working tree (old docs/scripts cleaned up but not committed)
- Several untracked directories (Designs/, docs/, openspec/, scripts/, supabase/, assets/)

---

## 4. What Still Needs To Be Done

### Immediate (for webhook testing today)

1. **Set `LEARNWORLDS_WEBHOOK_SECRET` on Railway** — Go to Railway dashboard > backend service > Variables > add it
2. **Configure webhook in LearnWorlds** — URL: `https://backend-production-639c.up.railway.app/api/webhooks/learnworlds/course-completed`, event: `courseCompleted`, header: `x-webhook-secret`
3. **Update `course_tool_mapping` with real LearnWorlds course IDs** — Replace placeholder `course-xxx` values in Supabase dashboard

### Short-term

4. **Test the full webhook flow end-to-end** — Complete a course in LearnWorlds test account, verify `tool_completions` row appears, verify next tool unlocks
5. **Test tool access control** — Verify lock screen appears when prerequisites are not met, verify it disappears after completing the prerequisite
6. **Test dependency display** — Complete a tool with answers, open a dependent tool, verify yellow box shows the upstream answer
7. **Add `tool-access-control.js` script tag to all 30 tools** — Currently the file exists but individual tools need to include it and call `ToolAccessControl.init('slug')`

### Future enhancements (not started)

8. **Gemini Flash 2.5 fallback** for AI challenge (when Anthropic API is down)
9. **Per-step AI challenges** (challenge at each wizard step, not just final submit)
10. **Prompt editing UI** in Guru Suite (currently edit prompts directly in Supabase dashboard)
11. **RLS policies** on webhook_events and course_tool_mapping tables (currently RLS disabled)

---

## 5. Key Architecture Decisions

- **AI challenge is advisory, not blocking**: Users can always "Submit Anyway" after seeing feedback. The catch block in the frontend also falls through to normal save if the AI call fails.
- **Anonymous users get AI review**: `anon-<uuid>` IDs are generated client-side and stored in `ai_challenge_log` as text (not FK to users table).
- **Webhook always returns 200**: LearnWorlds should never retry endlessly. Errors are logged to `webhook_events` for debugging.
- **Course-to-tool mapping is DB-driven**: Edit in Supabase dashboard, no code deploy needed to change mappings. Hardcoded fallback exists for safety.
- **Tool access control is frontend-only**: It's a visual gate, not a security boundary. The backend doesn't enforce tool ordering. This is acceptable because the tools are educational, not security-sensitive.
- **Dependency injection config is embedded in JS**: The full dependency graph (all 30+ tools, their `depends_on` arrays, field mappings) lives in `dependency-injection.js`. Not in the database. This means changes require a code deploy.

---

## 6. File Reference

| File | Purpose | Last Modified |
|------|---------|---------------|
| `frontend/tools/module-0-intro-sprint/00-woop.html` | WOOP tool (6-step mode) | 2026-02-20 |
| `frontend/shared/js/dependency-injection.js` | Dependency display + config (39.6 KB) | 2026-02-20 |
| `frontend/shared/js/ai-challenge.js` | AI challenge frontend module (12.4 KB) | 2026-02-19 |
| `frontend/shared/js/tool-db.js` | Tool database interface (11.4 KB) | Earlier |
| `frontend/shared/js/cognitive-load.js` | Cognitive load management (12.5 KB) | Earlier |
| `frontend/js/tool-access-control.js` | Lock screen for prerequisites (8.2 KB) | 2026-02-20 |
| `frontend/js/auth.js` | Authentication logic (12.5 KB) | Earlier |
| `backend/src/routes/webhooks.ts` | LearnWorlds webhook handler | 2026-02-20 |
| `backend/src/routes/ai.ts` | AI challenge + suggest-slices endpoints | 2026-02-20 |
| `backend/src/services/ChallengeService.ts` | AI challenge logic (15 KB) | 2026-02-19 |
| `backend/src/index.ts` | Express app entry point | 2026-02-20 |
| `backend/src/config/env.ts` | Environment variable schema | 2026-02-19 |
