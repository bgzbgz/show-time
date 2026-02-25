# Fast Track Tools

Internal platform with 31 interactive business transformation tools used by companies going through the Fast Track program.

## Live URLs

| Service | URL | Repo |
|---|---|---|
| Tools platform (frontend) | https://fasttracktools.up.railway.app | this repo |
| API (backend) | https://backend-production-639c.up.railway.app | this repo |
| Admin panel | deployed on Railway | github.com/bgzbgz/admin-panel-tools |
| Guru modal | deployed on Railway | github.com/bgzbgz/guru-modal |
| Supabase | lutzzfaedkbsmbobmrzx | supabase.com/dashboard/project/lutzzfaedkbsmbobmrzx |

## Folder structure

```
frontend/          Static HTML platform — 31 tools, dashboard, admin
backend/           Express/TypeScript API — AI challenge, webhooks, LearnWorlds SSO
supabase/          DB schema config and migrations
docs/              All documentation — architecture, audits, sessions, specs, deployment
Designs/           Brand assets — fonts (.otf), logos, images, TOV guide
scripts/           Utility and historical fix scripts
tests/             Dependency chain integration tests
openspec/          Claude Code workflow change files
assets/            Misc static assets
Fast Track Program - Master Content/   Source program materials (PDFs, PPTX, client decks)
```

## Running locally

```bash
# Backend API
cd backend && npm install && npm run dev
# Runs on http://localhost:3000

# Frontend (static, no build step)
cd frontend && npx serve . -p 4000
# Open http://localhost:4000/dashboard.html
# Admin panel: http://localhost:4000/admin/
```

## Architecture

- **Frontend**: React 18 via Babel standalone — single HTML files, zero build step, served as static from Railway
- **Backend**: Express/TypeScript on Railway
- **Database**: Supabase (PostgreSQL) — project ID `lutzzfaedkbsmbobmrzx`
- **Auth**: LearnWorlds SSO webhook → creates Supabase users. Admin panel uses Supabase email+password
- **AI**: Claude Haiku (claude-haiku-4-5) evaluates tool answers before final submission
- **Access control**: Frontend visual gate only — not a security boundary

## Test credentials

- User: `ivanhristovgr@gmail.com` / user_id: `7ac90e0a-0a2f-4e63-82a9-5e0d7b939c88`
- Guru codes: `LUXO-WOOP`, `ACME-WOOP`, `TECH-WOOP`
- Admin: add your Supabase Auth UUID to `admin_users` table

## Key files

| File | What it does |
|---|---|
| `frontend/dashboard.html` | Main user-facing dashboard (entry point) |
| `frontend/shared/js/tool-db.js` | Supabase read/write for all tools |
| `frontend/shared/js/ai-challenge.js` | AI evaluation modal |
| `frontend/shared/js/dependency-injection.js` | Cross-tool answer injection |
| `frontend/shared/js/cognitive-load.js` | Case study + info box components |
| `backend/src/routes/webhooks.ts` | LearnWorlds webhook → tool unlock |
| `backend/src/services/ChallengeService.ts` | AI challenge evaluation logic |
| `backend/src/routes/guru.ts` | Guru dashboard API (4 endpoints) |

## The 31 tools

Numbered 00–29, grouped into 9 modules. Each is a single HTML file in `frontend/tools/module-*/`.
See `frontend/tools/README.md` for the full list with status.
