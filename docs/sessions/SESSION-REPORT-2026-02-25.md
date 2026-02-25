# Session Report — 2026-02-25

## What We Did

Three major workstreams in this session:
1. Built and deployed the Admin Panel
2. Reorganized the project folder structure
3. Hardened database security end-to-end

---

## 1. Admin Panel — `frontend/admin/index.html`

### What it is
Internal monitoring panel for Ivan and associates. Single HTML file (React 18 + Babel + Supabase JS). Lives at its own Railway deployment (separate repo: `bgzbgz/admin-panel-tools`).

### Auth
- Supabase email+password login (`supabase.auth.signInWithPassword`)
- After login, checks `admin_users` table for the user's UUID
- If not in `admin_users` → signs out + shows "Access denied"
- Only people explicitly added to `admin_users` can enter

### Four views
| View | What it shows |
|------|--------------|
| **Overview** | 6 stat cards (total users, active last 24h, completions, companies, AI challenges today, webhook errors) + live activity feed |
| **Companies** | Cards per org with member count + completions, expandable member table |
| **Users** | Searchable table with current tool + last active, click row → slide-in drawer with full tool timeline |
| **Logs** | Two tabs: Webhook errors + AI Challenge log |

### Database addition
New table `admin_users`:
```sql
CREATE TABLE admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

**To add Ivan (or anyone) as admin:**
1. Go to Supabase dashboard → Authentication → Users → find the account → copy the UUID
2. Run: `INSERT INTO admin_users (id, name) VALUES ('<uuid>', 'Ivan');`

### RLS policies added (read-only for admins)
Added `Admin read all` SELECT policy on these 7 tables:
- `user_responses`
- `tool_completions`
- `users`
- `organizations`
- `ai_challenge_log`
- `webhook_events`
- `guru_access_codes`

---

## 2. Project Reorganization

### Files deleted (dead/duplicate/useless)
| File | Why deleted |
|------|------------|
| `frontend/tools-gallery.html` | Redundant — dashboard already covers this |
| `frontend/test-dependency-injection.html` | Dev scratch file, not linked anywhere |
| `frontend/test-supabase.html` | Dev scratch file, not linked anywhere |
| `frontend/tools/module-0-intro-sprint/00-woop-v2.html` | Superseded by final version |
| `frontend/tools/module-1-identity/04-team-v2.html` | Superseded by final version |
| `frontend/tools/module-4-strategy-development/15-value-proposition-preview.html` | Superseded |
| `frontend/tools/module-4-strategy-development/15-value-proposition-v2.html` | Superseded |
| `frontend/MonumentGrotesk-Mono.woff2` (+ other root fonts) | Duplicates of `frontend/shared/fonts/` |
| `config/` (root) | Identical to `backend/config/` — confirmed with diff |
| `shared/` (root) | Duplicates of `frontend/shared/` |
| `frontendjs/`, `supabasemigrations/` | Empty legacy folders |
| `docs/specs/` | Identical to `docs/fast-track-specs/` |
| Various `.ps1`, `.sh`, `.js`, `.py` fix scripts | One-off scripts, executed and done |
| `logo-base64.txt`, `project-structure.txt` | Stale artifacts |
| Multiple `REORGANIZATION-*.md`, `DEPLOY_NOW.md`, etc. | One-time reference docs |

### Files moved
| From | To |
|------|----|
| `docs/SESSION-REPORT-*.md` (4 files) | `docs/sessions/` |
| `docs/woop_gap_analysis.md`, `woop_verification.md` | `docs/audits/` |
| `frontend/shared/MASTER-AUDIT-REPORT.md` + all `MODULE-*-AUDIT-REPORT.md` | `docs/audits/` |
| `frontend/shared/TOOL-AUDIT-MASTER.md`, `WOOP-TOOL-AUDIT-REPORT.md` | `docs/audits/` |
| `frontend/shared/design-checklist.md` | `docs/templates/` |

### READMEs added (15 total)
Every major folder now has a `README.md` explaining what lives there:
- `/README.md` (root — rewritten, was outdated)
- `frontend/README.md`
- `frontend/tools/README.md`
- `frontend/shared/README.md`
- `frontend/admin/README.md`
- `docs/README.md`
- `docs/sessions/README.md`
- `docs/audits/README.md`
- `Designs/README.md`
- `scripts/README.md`
- `supabase/README.md`
- `Fast Track Program - Master Content/README.md`

---

## 3. Database Security Hardening

### Problem
The `tool-db.js` frontend library was writing directly to Supabase using the **anon key** with open `INSERT`/`UPDATE` policies — meaning any user could write any data to the database, including overwriting other users' responses.

### Solution: Backend write proxy
All writes now route through the backend (which uses the **service_role key** that bypasses RLS properly).

**New file: `backend/src/routes/toolsave.ts`**
Three endpoints:

| Endpoint | What it does |
|----------|-------------|
| `POST /api/toolsave/identify` | Takes LearnWorlds `lw_user_id` / `lw_email` / `lw_name`, finds or creates the user row, returns internal UUID |
| `POST /api/toolsave/save` | Validates user exists, then upserts `user_responses`. Force-overwrites `user_id` on every row to prevent spoofing |
| `POST /api/toolsave/complete` | Validates user exists, upserts `tool_completions` |

**Updated: `frontend/shared/js/tool-db.js`**
- `identifyUser()` → now POSTs to `/api/toolsave/identify` instead of writing to Supabase
- `save()` → now POSTs to `/api/toolsave/save` instead of direct upsert
- `markComplete()` → now POSTs to `/api/toolsave/complete` instead of direct upsert
- `load()` and `getDependency()` → unchanged (SELECT only, safe with anon key)

**Updated: `backend/src/index.ts`**
- Registered the new route: `app.use('/api/toolsave', toolSaveRoutes)`

### RLS policies removed (open write policies)
These were allowing ANY anonymous user to write anything:

| Table | Policy removed |
|-------|---------------|
| `ai_challenge_log` | `Users can insert their own challenge logs` |
| `guru_access_codes` | `allow_all_guru_access_codes` |
| `guru_guides` | `allow_all_guru_guides` |
| `guru_meeting_notes` | `allow_all_guru_meeting_notes` |
| `organizations` | `allow_all_organizations` |
| `tool_completions` | `allow_all_tool_completions` |
| `user_responses` | `Allow create responses` + `Allow update responses` |
| `users` | `Allow create users` + `Allow update users` |

### RLS policies added (restrictive replacements)
| Table | New policy |
|-------|-----------|
| `guru_access_codes` | SELECT only (public read) |
| `guru_guides` | SELECT only (public read) |
| `organizations` | SELECT only (public read) |
| `tool_completions` | SELECT only (public read) |
| `guru_meeting_notes` | SELECT only (public read) |
| `guru_meeting_notes` | INSERT restricted to valid `organization_id` |
| `guru_meeting_notes` | UPDATE restricted to valid `organization_id` |

### PostgreSQL view + function fixes
| Object | Fix |
|--------|-----|
| `master_activity_dashboard` view | Changed from SECURITY DEFINER to `security_invoker = true` |
| `user_responses_with_email` view | Changed from SECURITY DEFINER to `security_invoker = true` |
| `auto_assign_organization` function | Added `SET search_path = ''`, fully-qualified table refs |
| `update_ai_challenge_prompts_updated_at` function | Added `SET search_path = ''` |

---

## One Remaining Manual Step

**Enable Leaked Password Protection** in Supabase dashboard:
> Authentication → Settings → Password Security → turn on "Leaked Password Protection"

This checks new passwords against HaveIBeenPwned. Cannot be done via SQL — dashboard toggle only.

---

## If Something Breaks

### Tools not saving / "Save failed"
- Check Railway backend logs for the `toolsave` service
- Verify backend is deployed (auto-deploy triggered on push — check Railway dashboard)
- The new flow: browser → `POST backend/api/toolsave/save` → Supabase (service_role). If backend is down, saves will fail silently

### Tools not loading saved data
- Load still goes direct to Supabase anon key (SELECT only) — unaffected by these changes
- If loads break, check Supabase RLS on `user_responses` and `tool_questions` (both have public SELECT)

### Admin panel can't log in
- Must use a Supabase Auth account (email+password), not a LearnWorlds account
- After login, account UUID must be in the `admin_users` table
- Check: `SELECT * FROM admin_users;` in Supabase SQL editor

### Guru meeting notes not saving
- The guru modal writes directly to Supabase (no backend calls)
- Now restricted: INSERT/UPDATE requires valid `organization_id`
- If saving fails, verify the org exists in the `organizations` table

### Something was deleted that's needed
- Everything is in git history: `git log --oneline` → find commit `a212609` → `git show a212609 -- path/to/file`
- The deletions were: test files, v2 drafts, duplicate fonts at root level, one-off fix scripts

---

## Commit Reference
```
a212609  security: route writes through backend, harden RLS + reorganize project
```
