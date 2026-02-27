# Migration Plan: Remove Direct Supabase Access from Frontend
**Goal:** Route all database reads through the backend. No tool HTML file should
ever talk to Supabase directly. The anon key and Supabase URL disappear from the frontend.

**Status:** Not started
**Risk:** Low — each phase is independently deployable and fully reversible
**Estimated phases:** 4 (can be done across multiple sessions)

---

## Why We Are Doing This

Every tool HTML file currently contains this:
```js
SUPABASE_URL: 'https://lutzzfaedkbsmbobmrzx.supabase.co',
SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'
```

Anyone who opens DevTools → Sources on any tool page can read these values.
With those two values they can run SQL queries against the database and read
every user's strategy answers. This is unacceptable for a business intelligence tool.

The fix is simple: the backend already connects to Supabase with the service_role key.
We just need to teach it to also answer READ requests, then remove the anon key
from all 30 tool files.

---

## What Currently Uses Supabase Directly (Frontend)

All direct Supabase access lives in ONE shared file:
`frontend/shared/js/tool-db.js`

Three functions inside it hit Supabase directly:

| Function | What it does | Tables touched |
|----------|-------------|----------------|
| `load(userId)` | Loads a user's saved answers when they reopen a tool | `user_responses` |
| `getDependency(userId, referenceKey)` | Fetches a value from another tool (e.g. pull segment name from tool 13 into tool 14) | `tool_questions`, `user_responses` |
| `_doInit(slug)` | Fetches question IDs and caches them at startup | `tool_questions` |

Everything else (save, markComplete, identifyUser) already goes through the backend.

The Supabase CDN script and client initialization block also appear in **every one
of the 30 tool HTML files** — those need to be removed too.

---

## Migration Strategy

> **Key insight:** Because all Supabase access goes through `tool-db.js`, we only
> need to change ONE file to fix all 30 tools. The Python script only removes
> the Supabase CDN tag and init block from the HTML files — it does not touch
> any tool logic.

The migration has 4 phases. Each phase can be committed and deployed independently.
The app keeps working throughout.

```
Phase 1 → Backend grows new read endpoints       (backend only, no frontend change)
Phase 2 → tool-db.js switches to backend reads   (1 shared file, all 30 tools benefit)
Phase 3 → Python script removes Supabase from HTML files  (cosmetic + security)
Phase 4 → Supabase RLS locked down               (database only, no code change)
```

---

## Phase 1 — Add Read Endpoints to Backend

**Files to change:** `backend/src/routes/toolsave.ts`
**Deploys to:** Backend Railway service
**Frontend impact:** None — these endpoints don't exist yet, nothing calls them

### New endpoint 1: Load tool responses

```
GET /api/toolsave/load?tool_slug=know-thyself&user_id=<uuid>
```

**What it does:**
1. Takes `tool_slug` and `user_id` from query params
2. Queries Supabase (service_role) for all `user_responses` rows for that user + tool
3. Joins with `tool_questions` to return `{ question_key: value }` map
4. Returns JSON

**Response shape:**
```json
{
  "data": {
    "strengths": "I am good at...",
    "values": ["honesty", "growth"],
    "birthday_message": "..."
  }
}
```

This mirrors exactly what `tool-db.js load()` currently returns from Supabase directly.

### New endpoint 2: Load a dependency value

```
GET /api/toolsave/dependency?reference_key=target_segment&user_id=<uuid>
```

**What it does:**
1. Finds the `tool_questions` row where `reference_key = 'target_segment'`
2. Finds the `user_responses` row for that question + user
3. Returns the value

**Response shape:**
```json
{
  "data": "SME owners in manufacturing sector, 20-100 employees..."
}
```

### New endpoint 3: Load tool questions (init cache)

```
GET /api/toolsave/questions?tool_slug=know-thyself
```

**What it does:**
Returns the `tool_questions` rows for a given slug so `_doInit` can build its cache
without hitting Supabase directly.

**Response shape:**
```json
{
  "data": [
    { "id": "uuid", "question_key": "strengths", "question_type": "text", "reference_key": null },
    ...
  ]
}
```

### Notes for implementation
- All three endpoints use the existing `supabaseAdmin` client (service_role) — no new Supabase setup needed
- No auth required on these endpoints for now (user_id is trusted, same as current behavior)
- Add basic validation: reject requests where `tool_slug` or `user_id` is missing
- These can sit right below the existing `POST /api/toolsave/save` in `toolsave.ts`

---

## Phase 2 — Update tool-db.js to Use Backend

**File to change:** `frontend/shared/js/tool-db.js` (1 file, affects all 30 tools)
**Deploys to:** Frontend Railway service (git push)
**Frontend impact:** All 30 tools now read through backend. Supabase CDN still loaded
but `supabaseClient` is no longer used for reads. No visible change to users.

### Change 1: `_doInit` — fetch questions from backend instead of Supabase

```js
// BEFORE
async function _doInit(slug) {
    const client = window.supabaseClient;
    const { data, error } = await client
        .from('tool_questions')
        .select('id, question_key, question_type, reference_key')
        .eq('tool_slug', slug);
    ...
}

// AFTER
async function _doInit(slug) {
    const res = await fetch(`${API_BASE}/api/toolsave/questions?tool_slug=${encodeURIComponent(slug)}`);
    if (!res.ok) {
        console.error('[ToolDB] Failed to load questions for', slug);
        return;
    }
    const { data } = await res.json();
    ...
    // rest of cache-building logic is identical
}
```

### Change 2: `load` — fetch responses from backend instead of Supabase

```js
// BEFORE
async function load(userId) {
    await whenReady();
    const client = window.supabaseClient;
    const { data, error } = await client
        .from('user_responses')
        .select(...)
        .eq('user_id', userId)
        .in('question_id', questionIds);
    ...
}

// AFTER
async function load(userId) {
    await whenReady();
    if (!userId || !toolSlug) return {};
    const res = await fetch(
        `${API_BASE}/api/toolsave/load?tool_slug=${encodeURIComponent(toolSlug)}&user_id=${encodeURIComponent(userId)}`
    );
    if (!res.ok) return {};
    const { data } = await res.json();
    return data || {};
}
```

### Change 3: `getDependency` — fetch from backend instead of Supabase

```js
// BEFORE
async function getDependency(userId, referenceKey) {
    const client = window.supabaseClient;
    const { data: questions } = await client.from('tool_questions')...
    const { data: responses } = await client.from('user_responses')...
    ...
}

// AFTER
async function getDependency(userId, referenceKey) {
    if (!userId || !referenceKey) return null;
    const res = await fetch(
        `${API_BASE}/api/toolsave/dependency?reference_key=${encodeURIComponent(referenceKey)}&user_id=${encodeURIComponent(userId)}`
    );
    if (!res.ok) return null;
    const { data } = await res.json();
    return data ?? null;
}
```

### What stays the same
- `identifyUser()` — already uses backend ✓
- `save()` — already uses backend ✓
- `markComplete()` — already uses backend ✓
- `saveResponses()` — already uses backend (our alias) ✓
- All function signatures, return shapes, and calling code in the tools — unchanged ✓

---

## Phase 3 — Remove Supabase from Tool HTML Files (Python Script)

**File to create:** `docs/remove-supabase-frontend.py`
**Files changed:** All 30 tool HTML files
**Deploys to:** Frontend (git push)
**What this actually removes from each file:**

### Block A — CDN script tag (1 line per file)
```html
<!-- REMOVE THIS LINE -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Block B — CONFIG block entries (2 lines per file)
```js
// REMOVE THESE TWO LINES from the CONFIG object
SUPABASE_URL: 'https://lutzzfaedkbsmbobmrzx.supabase.co',
SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
```

### Block C — Client initialization (3 lines per file)
```js
// REMOVE THESE THREE LINES
const { createClient } = supabase;
const supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient;
```

### Script behaviour
- Dry-run by default (`--apply` to write)
- Removes ONLY these exact patterns — does not touch surrounding logic
- Reports exactly what it removes from each file with line numbers
- Creates `.bak` backups unless `--no-backup`
- Verifies after apply that no `SUPABASE_ANON_KEY` strings remain
- Skips any file that doesn't have these patterns (safe to re-run)

> **Important:** The script does NOT touch `cognitive-load.js`, `tool-db.js`, or
> any shared file. It only removes the three blocks above from the 30 tool HTML files.
> No tool logic is touched.

---

## Phase 4 — Lock Down Supabase RLS

**Where:** Supabase dashboard / migration
**Code impact:** None
**This is the final security seal — do this last, after confirming Phase 2+3 work**

### What changes

Replace all `qual = true` SELECT policies with restricted ones:

| Table | Current policy | New policy |
|-------|---------------|------------|
| `user_responses` | `true` (anyone) | `user_id = requesting user` via backend header, OR just remove anon SELECT entirely |
| `users` | `true` (anyone) | `id = requesting user` |
| `tool_completions` | `true` (anyone) | `user_id = requesting user` |
| `organizations` | `true` (anyone) | members of that org only |
| `guru_access_codes` | `true` (anyone) | keep public (codes are meant to be looked up) |
| `tool_questions` | `true` (anyone) | keep public (not sensitive) |

### Simplest approach
Since ALL reads now go through the backend (service_role), we can just:
```sql
-- Remove all anon/public SELECT policies
-- Backend uses service_role which bypasses RLS entirely
-- Nothing breaks because no frontend hits Supabase directly anymore
```

This means RLS becomes a last-line-of-defense (if backend is bypassed) rather
than the primary access control. Primary control is now the backend.

---

## Execution Order and Safety Checks

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: Backend endpoints added                           │
│  → Deploy backend                                           │
│  → Test: curl /api/toolsave/load?tool_slug=...&user_id=...  │
│  → Confirm JSON response looks correct                      │
│  → App still works exactly as before (nothing calls it yet) │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: tool-db.js updated                                │
│  → Deploy frontend (git push)                               │
│  → Open any tool, check browser DevTools → Network tab      │
│  → Confirm reads go to backend-production-639c.up.railway   │
│  → Confirm NO calls to lutzzfaedkbsmbobmrzx.supabase.co     │
│  → Test load, save, dependency all still work               │
│  → Supabase CDN tag still in HTML but unused — that's fine  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: Python script removes Supabase from HTML          │
│  → Run dry-run first, review output                         │
│  → Run --apply                                              │
│  → Verify: grep -r "SUPABASE_ANON_KEY" frontend/ → 0 results│
│  → Deploy frontend (git push)                               │
│  → Test tools still load and read data correctly            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: Supabase RLS tightened                            │
│  → Apply migration to remove public SELECT policies         │
│  → Test tools still work (reads go through backend now)     │
│  → Run Supabase advisor → should show 0 warnings            │
└─────────────────────────────────────────────────────────────┘
```

---

## Rollback Plan (if anything goes wrong)

| Phase | How to rollback |
|-------|----------------|
| Phase 1 | Delete the new endpoints — nothing called them anyway |
| Phase 2 | `git revert` the tool-db.js commit — tools go back to Supabase direct reads |
| Phase 3 | `.bak` files exist for every changed HTML — Python script can restore them. Or `git revert` |
| Phase 4 | Re-add the public SELECT policies in Supabase — 1 SQL statement |

Every phase is independently reversible in under 2 minutes.

---

## Files Changed Per Phase (Summary)

| Phase | Files | Count |
|-------|-------|-------|
| 1 | `backend/src/routes/toolsave.ts` | 1 |
| 2 | `frontend/shared/js/tool-db.js` | 1 |
| 3 | All 30 tool HTML files (Python script) | 30 |
| 4 | Supabase migration only | 0 code files |

**Total code files touched: 32**
**Tool logic files touched: 0**

---

## What This Does NOT Change

- Tool UI, steps, logic, data shapes — untouched
- How users authenticate (LearnWorlds JWT flow)
- AI challenge flow
- Guru panel / Admin panel
- Webhook handling
- Save / markComplete flow (already backend)
- The dependency-injection.js system

---

## Open Questions Before Starting

1. **Backend auth on read endpoints** — Currently `user_id` is trusted from the
   query param (same trust level as current direct Supabase read). This is acceptable
   for now. A future improvement would be signing requests with a session token.
   Not required for this migration.

2. **Caching** — The backend could cache `tool_questions` responses (they never change)
   to reduce DB load. Not required for this migration but easy to add to Phase 1.

3. **Cold starts** — Reads now go through Railway (backend). On the trial plan there
   can be cold start delays. This was already true for saves — users are used to it.
   Upgrade to a paid Railway plan when going to production.

---

## When to Do This

Do Phase 1 + 2 before the first paying client cohort.
Do Phase 3 + 4 before any public launch.

The app works fine without this migration. This is a security hardening step,
not a bug fix. Do it in a quiet period, not alongside feature work.
