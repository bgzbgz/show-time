# Master Tool Audit — 2026-02-25

> 30 tools audited across 6 parallel agents.
> Reference design: `00-woop.html` (gold standard).
> Global fix already shipped: `textarea { resize: none }` + auto-grow JS via `cognitive-load.css/.js`

---

## PRIORITY 1 — BROKEN (fix before anything else)

### 🔴 Tools 10 + 11: Missing questionMappings — AI submit will fail

These two tools call `AIChallenge.submitWithChallenge()` but never build a `questionMappings` object. The AI challenge will throw an error or silently pass empty data.

| Tool | File | Missing |
|------|------|---------|
| performance | `10-performance.html` | No `questionMappings` — needs: `goals`, `tasks`, `whys`, `profitability`, `toc`, `accountability` |
| meeting-rhythm | `11-meeting-rhythm.html` | No `questionMappings` — needs: `priorities`, `meetingReadiness`, `problemBreaking`, `solutions` |

**Fix:** Add `const questionMappings = { ... }` before each tool's submit call, matching keys to what's in `tool_questions` table. Verify DB keys with: `SELECT question_key FROM tool_questions WHERE tool_slug IN ('performance', 'meeting-rhythm');`

---

## PRIORITY 2 — TRANSITION SECTIONS

### Current state across all 30 tools

| Status | Tools |
|--------|-------|
| ✅ Full (headline + brutal truth + peer proof + AI panel) | 00-woop, 01-know-thyself, 02-dream, 03-values, 04-team, 05-fit, 07-energy, 08-goals, 15-value-proposition, 16-vp-testing, 17-product-development, 18-pricing |
| ⚠️ Shell only (TransitionScreen exists but bare — just progress bar) | 20-customer-service, 21-route-to-market, 23-processes-decisions, 24-fit-abc, 25-org-redesign, 28-digitalization, 29-digital-heart |
| ⚠️ Partial (component defined but never rendered between steps) | 19-brand-marketing |
| ⚠️ Minimal (closing messages only, no BRUTAL TRUTH / PEER PROOF) | 12-market-size, 14-target-segment |
| ❌ Missing entirely | 06-cash, 09-focus, 10-performance, 11-meeting-rhythm, 13-segmentation, 22-core-activities, 26-employer-branding, 27-agile-teams |

### What a full transition requires (WOOP standard)

```
┌────────────────────────────────────────────┐
│  STEP 2 OF 4          [yellow, Monument]   │
│                                            │
│  EDGE IDENTIFIED       [Plaak, 48px, bold] │
│  Subtitle — what done + what's next        │
│                                            │
│  ┌─ BRUTAL TRUTH ────────────────────┐    │
│  │ [provocative stat / fact]          │    │
│  └────────────────────────────────────┘    │
│                                            │
│  ┌─ PEER PROOF ──────────────────────┐    │
│  │ "Italicised peer story..."         │    │
│  └────────────────────────────────────┘    │
│                                            │
│       [ CONTINUE TO STEP 3 ]              │
└────────────────────────────────────────────┘
  [AI feedback panel — top right, yellow border]
```

### Brain juice source material available for

`cash`, `segmentation`, `agile-teams`, `brand-marketing`, `customer-service`, `core-activities`
→ Path: `brain jucie and deep dive all/`

Content needs to be written for: `focus`, `performance`, `meeting-rhythm`, `target-segment`, `route-to-market`, `processes-decisions`, `org-redesign`, `employer-branding`, `digitalization`, `digital-heart`

---

## PRIORITY 3 — COVER IMAGES

### Missing or broken

| Tool | Issue | Fix |
|------|-------|-----|
| 07-energy | References `"cover image for energy tool.jpg"` — will 404 | Replace with correct filename or remove |
| 12-market-size | `"get out of the box.jpg"` — local file, likely 404 on Railway | Use Unsplash URL or confirm file in deploy folder |
| 14-target-segment | `'cover.jpg'` — local file | Same as above |
| 16-vp-testing | `COVER_IMAGE` not declared in CONFIG | Add declaration |
| 17-product-development | `COVER_IMAGE` not declared in CONFIG | Add declaration |
| 18-pricing | `COVER_IMAGE` not declared in CONFIG | Add declaration |
| 19-brand-marketing | `COVER_IMAGE` not declared in CONFIG | Add declaration |
| 01-know-thyself | No cover image at all | Add cover or leave text-only (deliberate?) |
| 03-values | No cover image | Same |
| 04-team | No cover image | Same |
| 05-fit | No cover image | Same |
| 25-org-redesign | No cover image | Same |
| 26-employer-branding | No cover image | Same |
| 27-agile-teams | No cover image | Same |
| 28-digitalization | No cover image | Same |
| 29-digital-heart | No cover image | Same |

**Available images in `frontend/shared/images/` or `Designs/05. images for tools/`:**
`asoggetti-17_tB-oI0ao`, `asoggetti-sXPbIgVcmW4`, `fabrizio-conti`, `get out of the box`, `goh-rhy-yan`, `kevin-et-laurianne-langlais`, `fabrizio-conti`

**Duplicate cover image problem:** Tools 21, 23, 24 all use `kevin-et-laurianne-langlais-yCg-sSDyxsE-unsplash.jpg` — same image on three tools.

---

## PRIORITY 4 — SCROLLING

Tools with steps exceeding 2 screens on a standard laptop (1366×768):

| Tool | Step | Problem | Suggested fix |
|------|------|---------|---------------|
| 06-cash | Steps 1–2 | ~30 fields each (P&L + Balance Sheet) | Collapsible sections: P&L / Balance Sheet / Working Capital |
| 07-energy | Steps 1–4 | 15 fields per step (3 dimensions × 5 habit fields) | Accordion per dimension (Sleep / Nutrition / Movement) |
| 09-focus | Steps 1–2 | Brain dump + 4 quadrants + priorities = 2.5 screens | Tabs: Dump / Quadrants / Top 3 |
| 11-meeting-rhythm | Steps 3–4 | 6 large text prompts = 2.5–3 screens | Break Step 3 into sub-steps |
| 13-segmentation | Steps 2–4 | Matrix-building per step = 2–2.5 screens each | Accordion for criteria / attractiveness rows |
| 14-target-segment | Step 2 | Interview notes expand per interview = 3–4 screens | Paginated / tabbed interview records |
| 24-fit-abc | Step 1 | 5 team members × 5 questions = 25 fields | Accordion per team member |
| 25-org-redesign | Step 5 | PDP tables = 3+ screens | Paginate PDPs or sub-step per person |
| 01-know-thyself | Step 1 | 10 fields (Dream Launcher) | Accept or split: Story / Ikigai / Dream |
| 03-values | Individual Step 1 | 15 value-related questions | Accept or break: Define / Rank / Live |

---

## PRIORITY 5 — DB / AI WIRING ISSUES

| Tool | Issue |
|------|-------|
| 10-performance | No questionMappings (see Priority 1) |
| 11-meeting-rhythm | No questionMappings (see Priority 1) |
| 15-value-proposition | Final submit only saves `vp_statement` + `anti_promise` — missing `pain_mapping`, `differentiators`, `validation` |
| 25, 26, 27, 28, 29 | Single coarse-grained DB key (e.g., `machine_blueprint`, `evp`, `blueprint`) — works but loses per-step analytics granularity |

---

## PRIORITY 6 — DESIGN INCONSISTENCIES

| Issue | Tools |
|-------|-------|
| `resize: vertical` on textareas | All tools — **already fixed globally** via `cognitive-load.css` |
| No STEP X OF Y counter in step headers | 20, 21, 22, 23, 24, 25, 26, 27, 28, 29 |
| Duplicate cover image | 21, 23, 24 (all use same photo) |
| Tool 22 uses page-based navigation (not step-based) | Architectural deviation from all other tools |
| AI Panel missing from transitions | All tools except 00-woop (WOOP is the only one with it fully wired) |

---

## WHAT'S CLEAN (no action needed)

| Tool | Status |
|------|--------|
| 00-woop | Gold standard — complete |
| 02-dream | Fully compliant |
| 08-goals | Fully compliant |
| 05-fit | Fully compliant |
| 15-value-proposition | Minor: incomplete final mapping |
| 16-vp-testing | Minor: missing COVER_IMAGE config |
| 17-product-development | Minor: missing COVER_IMAGE config |
| 18-pricing | Minor: missing COVER_IMAGE config |

---

## BATCH FIX STRATEGY

Fixing by issue type (not tool-by-tool) is the cheapest approach:

### Batch A — Critical DB fixes (2 tools, ~1 hour)
Fix questionMappings in `10-performance.html` and `11-meeting-rhythm.html`.
Verify against `tool_questions` table first.

### Batch B — Add transitions to 8 missing tools (~3 hours)
`06-cash`, `09-focus`, `10-performance`, `11-meeting-rhythm`, `13-segmentation`, `26-employer-branding`, `27-agile-teams` + wire `19-brand-marketing` (component exists, just needs TRANSITION_CONTENT + rendering).
Requires: writing BRUTAL TRUTH + PEER PROOF content for each (use brain juice docs where available).

### Batch C — Upgrade bare TransitionScreens in 7 tools (~2 hours)
`20-customer-service`, `21-route-to-market`, `23-processes-decisions`, `24-fit-abc`, `25-org-redesign`, `28-digitalization`, `29-digital-heart`
These already have a TransitionScreen component — just need to add the BRUTAL TRUTH / PEER PROOF cards + headline to each.

### Batch D — Cover image fixes (~30 min)
Fix 4 broken paths (07-energy, 12-market-size, 14-target-segment) + add CONFIG declarations in 16-19. Assign unique images to 21/23/24.

### Batch E — Scrolling reduction (~3 hours)
Accordion/collapse for: 06-cash, 07-energy, 24-fit-abc, 25-org-redesign.
Tab/sub-step for: 09-focus, 14-target-segment.
Accept as-is: 01-know-thyself, 03-values (content-dense by design).

---

## FULL TOOL STATUS TABLE

| # | Tool | Transitions | DB Wiring | AI Challenge | Cover | Scrolling | Critical |
|---|------|-------------|-----------|--------------|-------|-----------|----------|
| 00 | woop | ✅ Full | ✅ | ✅ | ✅ | ✅ | — |
| 01 | know-thyself | ✅ Full | ✅ | ✅ | ❌ Missing | ⚠️ Step 1 | Cover |
| 02 | dream | ✅ Full | ✅ | ✅ | ✅ | ✅ | — |
| 03 | values | ✅ Full | ✅ | ✅ | ❌ Missing | ⚠️ Ind. Step 1 | Cover |
| 04 | team | ✅ Full | ✅ | ✅ | ❌ Missing | ✅ | Cover |
| 05 | fit | ✅ Full | ✅ | ✅ | ❌ Missing | ✅ | Cover |
| 06 | cash | ❌ None | ✅ | ✅ | ✅ | 🔴 Steps 1–2 | Transitions + Scroll |
| 07 | energy | ✅ Full | ⚠️ Team keys | ✅ | 🔴 404 path | ⚠️ Steps 1–4 | Cover 404 |
| 08 | goals | ✅ Full | ✅ | ✅ | ✅ text | ✅ | — |
| 09 | focus | ❌ None | ✅ | ✅ | ❌ Missing | ⚠️ Steps 1–2 | Transitions |
| 10 | performance | ❌ None | 🔴 No mapping | 🔴 Will fail | ✅ | ⚠️ Steps 3–4 | DB + Transitions |
| 11 | meeting-rhythm | ❌ None | 🔴 No mapping | 🔴 Will fail | ✅ | 🔴 Steps 3–4 | DB + Transitions |
| 12 | market-size | ⚠️ Partial | ✅ | ✅ | 🔴 404 path | ✅ | Cover 404 |
| 13 | segmentation | ❌ None | ✅ | ✅ | ✅ | 🔴 Steps 2–4 | Transitions + Scroll |
| 14 | target-segment | ⚠️ Minimal | ✅ | ✅ | 🔴 404 path | ⚠️ Step 2 | Transitions + Cover |
| 15 | value-proposition | ✅ Full | ⚠️ Incomplete | ✅ | ✅ | ⚠️ Step 3 | Mapping |
| 16 | vp-testing | ✅ Full | ✅ | ✅ | ⚠️ No config | ✅ | Cover config |
| 17 | product-development | ✅ Full | ✅ | ✅ | ⚠️ No config | ✅ | Cover config |
| 18 | pricing | ✅ Full | ✅ | ✅ | ⚠️ No config | ✅ | Cover config |
| 19 | brand-marketing | ⚠️ Not wired | ✅ | ✅ | ⚠️ No config | ⚠️ Step 1 | Transitions |
| 20 | customer-service | ⚠️ Shell only | ✅ | ✅ | ✅ | ⚠️ Steps 1,4 | Transitions |
| 21 | route-to-market | ⚠️ Shell only | ✅ | ✅ | ⚠️ Duplicate | 🔴 Steps 1,3 | Transitions + Scroll |
| 22 | core-activities | ❌ Diff. arch | ✅ | ✅ | ✅ | ✅ | Architecture |
| 23 | processes-decisions | ⚠️ Shell only | ✅ | ✅ | ⚠️ Duplicate | ⚠️ Nested arrays | Transitions |
| 24 | fit-abc | ⚠️ Shell only | ✅ | ✅ | ⚠️ Duplicate | 🔴 Step 1 (25 fields) | Transitions + Scroll |
| 25 | org-redesign | ⚠️ Shell only | ⚠️ Coarse | ✅ | ❌ Missing | 🔴 Step 5 PDPs | Transitions + Scroll |
| 26 | employer-branding | ❌ None | ⚠️ Coarse | ✅ | ❌ Missing | ⚠️ Step 5 | Transitions |
| 27 | agile-teams | ❌ None | ⚠️ Coarse | ✅ | ❌ Missing | ✅ | Transitions |
| 28 | digitalization | ⚠️ Shell only | ⚠️ Coarse | ✅ | ❌ Missing | ✅ | Transitions |
| 29 | digital-heart | ⚠️ Shell only | ⚠️ Coarse | ✅ | ❌ Missing | ✅ | Transitions |

---

*Generated 2026-02-25 by 6 parallel Haiku agents. Global textarea fix already deployed.*
