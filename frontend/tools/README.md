# frontend/tools/

The 31 interactive business tools. Each is a single self-contained HTML file using React 18 + Babel standalone.

## Module map

| Module | Folder | Tools |
|---|---|---|
| 0 — Intro | `module-0-intro-sprint/` | 00-woop |
| 1 — Identity | `module-1-identity/` | 01-know-thyself, 02-dream, 03-values, 04-team, 05-fit |
| 2 — Performance | `module-2-performance/` | 06-cash, 07-energy, 08-goals, 09-focus, 10-performance, 11-meeting-rhythm |
| 3 — Market | `module-3-market/` | 12-market-size, 13-segmentation-target-market |
| 4 — Strategy Dev | `module-4-strategy-development/` | 14-target-segment-deep-dive, 15-value-proposition, 16-value-proposition-testing |
| 5 — Strategy Exec | `module-5-strategy-execution/` | 17-product-development, 18-pricing, 19-brand-marketing, 20-customer-service, 21-route-to-market |
| 6 — Org Structure | `module-6-org-structure/` | 22-core-activities, 23-processes-decisions, 24-fit-abc-analysis, 25-org-redesign |
| 7 — People | `module-7-people-leadership/` | 26-employer-branding, 27-agile-teams |
| 8 — Tech/AI | `module-8-tech-ai/` | 28-digitalization, 29-digital-heart |

## Tool architecture patterns

**Single-flow** — one linear sequence of steps (e.g. goals, woop)

**Two-phase (Individual + Team)** — individual steps (always open) then team steps (locked until all org members complete individual). Shift+Click the locked bar to bypass in dev. Slugs: `{tool}-individual` and `{tool}-team`.

**Three-phase (Individual + CEO Prep + Team)** — same as two-phase but with an unlocked CEO prep section in the middle. Used by: fit.

## Shared dependencies every tool loads

```html
<script src="../../shared/js/tool-db.js"></script>
<script src="../../shared/js/ai-challenge.js"></script>
<script src="../../shared/js/dependency-injection.js"></script>
<script src="../../shared/js/cognitive-load.js"></script>
<link rel="stylesheet" href="../../shared/css/cognitive-load.css">
<script src="../../js/tool-access-control.js"></script>
```

## Fonts

Each module folder contains its own copies of the font files. They are loaded with relative paths (`url('Plaak3Trial-43-Bold.woff2')`). Do not remove these — each tool must be independently serveable.

## TOOL-BLUEPRINT.html

Template/reference file showing the standard structure for a new tool. Not served to users.
