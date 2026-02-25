# frontend/shared/

Assets shared across all 31 tools and the dashboard.

## JS libraries (loaded by every tool)

| File | What it does |
|---|---|
| `js/tool-db.js` | Save and load answers to/from Supabase (`user_responses` table) |
| `js/ai-challenge.js` | Shows the AI evaluation modal before tool submission. Calls `/api/challenge`. |
| `js/dependency-injection.js` | Reads answers from earlier tools and injects them into the current tool. Dependency graph is hardcoded here — not in the DB. |
| `js/cognitive-load.js` | `CognitiveLoad` component — case study cards, info boxes, tip boxes rendered in tools. |

## CSS

| File | What it covers |
|---|---|
| `css/cognitive-load.css` | Styles for CognitiveLoad components (info boxes, case studies, tip boxes) |

## Fonts (canonical location)

`fonts/` contains the woff2 font files used everywhere:
- `Plaak3Trial-43-Bold.woff2` — headings
- `RiformaLL-Regular.woff2` — body text
- `RangleRiformaWeb-Medium.woff2` — medium weight body
- `MonumentGrotesk-Mono.woff2` — labels, mono text, badges

Note: each tool module folder has its own copy of these fonts for self-contained serving. `shared/fonts/` is the master source.

## Images

- `FastTrack_F_White.png` — white FT logo used in dashboard header
- `favicon-16x16.png` — browser favicon

## Important: DependencyInjection + React tools

`DependencyInjection.init()` does NOT work inside React tools — it runs before React renders. Use `useEffect` + `ToolDB.getDependency()` inside the component instead.
