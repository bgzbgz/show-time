# Design Consistency Report
> Audit date: 2026-02-23
> Reference design: WOOP (00-woop.html) + Dream (02-dream.html)

---

## Reference Design System (WOOP/Dream)

The WOOP and Dream tools establish the target visual design with these elements:

| Element | CSS Class / Pattern | Description |
|---------|-------------------|-------------|
| Layout | `wizard-layout` | Sidebar + main content split |
| Sidebar | `wizard-sidebar` | Black, 280px, sticky, step navigation with snippets |
| Content | `wizard-content` | 640px max-width, centered |
| Footer | `btn-footer` | Sticky bottom bar with Back/Next buttons |
| Cover | Black full-screen | Step 0 with plaak title, cover image, CTA |
| Fonts | `monument`, `plaak` | Monument for labels, Plaak for headings |
| Forms | `ft-input`, `ft-textarea` | Consistent form styling |
| Transitions | BRUTAL TRUTH / PEER PROOF | Black interlude screens between steps |
| Navigation | Sidebar click-to-review | No progress dots |

---

## Results: All 30 Tools

### MATCHES (5 tools) — Fully follows WOOP/Dream design

| # | Tool | Module | Notes |
|---|------|--------|-------|
| 00 | WOOP | 0 - Intro | **Reference tool.** Full wizard-sidebar layout. |
| 02 | Dream | 1 - Identity | **Reference tool.** Full wizard-sidebar + transition screens. |
| 06 | Cash Flow | 2 - Performance | Has wizard-layout/sidebar/content/btn-footer. Missing: black cover, ft-* form classes, transitions. Close but not 100%. |
| 15 | Value Proposition | 4 - Strategy Dev | Full wizard-layout/sidebar/content/btn-footer. Missing: ft-* form classes, transitions. |

### DIFFERENT DESIGN SYSTEM (12 tools) — Modern Tailwind pattern, no old artifacts

These tools use a **different but cohesive** design: Tailwind CSS full-width steps, plaak/monument fonts, black cover screens, and transition screens — but do NOT use the wizard-sidebar layout.

| # | Tool | Module | Has Cover | Has Transitions | Has Fonts | Old Patterns |
|---|------|--------|-----------|-----------------|-----------|-------------|
| 13 | Segmentation | 3 - Market | YES | YES | YES | None |
| 19 | Brand Marketing | 5 - Execution | YES | YES | YES | None |
| 20 | Customer Service | 5 - Execution | YES | YES | YES | None |
| 21 | Route to Market | 5 - Execution | YES | YES | YES | None |
| 23 | Processes & Decisions | 6 - Org | YES | YES | YES | None |
| 24 | FIT ABC | 6 - Org | YES | YES | YES | None |
| 25 | Org Redesign | 6 - Org | YES | YES | YES | None |
| 26 | Employer Branding | 7 - People | YES | YES | YES | None |
| 27 | Agile Teams | 7 - People | YES | YES | YES | None |
| 28 | Digitalization | 8 - Tech | YES | YES | YES | None |
| 29 | Digital Heart | 8 - Tech | YES | YES | YES | None |
| 22 | Core Activities | 6 - Org | YES | **NO** | YES | None |

> Tool 22 is missing transition screens between views.

### DOES NOT MATCH (13 tools) — Needs restyling

These tools have **old design patterns** (progress dots, worksheet-input classes, no sidebar, missing cover screens) and need to be restyled to match WOOP/Dream.

| # | Tool | Module | What's Wrong |
|---|------|--------|-------------|
| 01 | Know Thyself | 1 - Identity | progress-dots, worksheet-input, no wizard-layout, no sidebar, no btn-footer |
| 03 | Values | 1 - Identity | progress-dots, worksheet-input, no wizard-layout, no sidebar, no cover screen |
| 04 | Team | 1 - Identity | progress-dots, worksheet-input, no wizard-layout, no sidebar, no cover screen |
| 05 | FIT | 1 - Identity | progress-dots, worksheet-input, no wizard-layout, no sidebar |
| 07 | Energy | 2 - Performance | progress-dots, worksheet-input, no wizard-layout, no sidebar |
| 08 | Goals | 2 - Performance | no wizard-layout, no sidebar, no cover screen, colored quadrant cards |
| 09 | Focus | 2 - Performance | progress-dots, worksheet-input, no wizard-layout, no sidebar, no cover screen |
| 10 | Performance | 2 - Performance | progress-dots, Material Design gradients, no wizard-layout, no sidebar |
| 11 | Meeting Rhythm | 2 - Performance | no wizard-layout, no sidebar, no cover, generic input/textarea |
| 12 | Market Size | 3 - Market | no wizard-layout, no sidebar, no btn-footer, no transitions |
| 14 | Target Segment | 4 - Strategy Dev | (deep-dive variant — check separately) |
| 16 | VP Testing | 4 - Strategy Dev | no wizard-layout, no sidebar, no btn-footer, no transitions |
| 17 | Product Dev | 5 - Execution | no wizard-layout, no sidebar, no btn-footer, no transitions |
| 18 | Pricing | 5 - Execution | no wizard-layout, no sidebar, no btn-footer, no transitions |

---

## Problem Breakdown

### Old Patterns Found in Non-Matching Tools

| Old Pattern | Found In |
|------------|----------|
| `progress-dot` step indicator | 01, 03, 04, 05, 07, 09, 10 |
| `worksheet-input` / `worksheet-textarea` | 01, 03, 04, 05, 07, 08, 09 |
| No `wizard-layout` structure | 01, 03, 04, 05, 07, 08, 09, 10, 11, 12, 16, 17, 18 |
| No `wizard-sidebar` navigation | 01, 03, 04, 05, 07, 08, 09, 10, 11, 12, 16, 17, 18 |
| No black cover screen | 03, 04, 08, 09, 11 |
| No `btn-footer` | 01, 03, 04, 05, 07, 08, 09, 10, 11, 12, 16, 17, 18 |
| Material Design / colored cards | 08, 10 |
| Generic HTML inputs (no ft-* prefix) | 10, 11 |

---

## Recommended Fix Order

Follow the tool dependency chain — fix upstream tools first so downstream tools can reference the pattern.

### Priority 1: Module 1 Identity (4 tools — these have live user data)
1. **01 Know Thyself** — 68 live responses
2. **03 Values** — 10 live responses
3. **04 Team** — no live data yet
4. **05 FIT** — no live data yet

### Priority 2: Module 2 Performance (5 tools)
5. **07 Energy** — no live data
6. **08 Goals** — no live data
7. **09 Focus** — no live data
8. **10 Performance** — no live data
9. **11 Meeting Rhythm** — no live data

### Priority 3: Modules 3-5 (4 tools)
10. **12 Market Size** — no live data
11. **16 VP Testing** — no live data
12. **17 Product Dev** — no live data
13. **18 Pricing** — no live data

### Optional: Add wizard-sidebar to "Different Design" tools
The 12 Tailwind-based tools (13, 19-29) work fine and look modern but use a different layout approach. These could optionally be migrated to the wizard-sidebar pattern for full visual consistency, but this is lower priority since they have no old patterns.

---

## Effort Estimate Per Tool

Each restyle involves:
- Replace CSS section with WOOP design system classes
- Add wizard-layout / wizard-sidebar / wizard-content / btn-footer structure
- Replace progress-dots with sidebar step navigation
- Add black cover screen (step 0)
- Add VP-style transition screens between steps
- Replace worksheet-input/textarea with ft-input/ft-textarea
- Keep ALL question_keys, ToolDB calls, AI gates, and dependency hooks frozen

**Scope:** ~200-400 lines of CSS/layout changes per tool, zero logic changes.

---

## Summary

| Status | Count | Tools |
|--------|-------|-------|
| Matches WOOP/Dream | 4 | 00, 02, 06, 15 |
| Modern (different layout) | 12 | 13, 19-29 |
| **Needs Restyling** | **13** | **01, 03, 04, 05, 07, 08, 09, 10, 11, 12, 16, 17, 18** |
| Not audited (variant files) | 1 | 14 (deep-dive) |

**13 out of 30 tools need restyling** to match the WOOP/Dream design system.
