## Why

Fast Track currently delivers the "5 Dysfunctions of a Team" workshop via PowerPoint with manual data entry, requiring facilitators to manually calculate dysfunction scores from individual assessments, create charts by hand, and accept vague action commitments ("All" as owner, "Ongoing" as deadline). This creates three problems: (1) cognitive overload from manual math during live sessions, (2) weak accountability from unenforceable commitments, and (3) no digital record of team agreements. Building this as an interactive HTML tool eliminates manual work, enforces concrete ownership, and creates persistent, exportable team contracts.

## What Changes

- **New standalone HTML file**: `frontend/tools/module-1-identity/04-team.html` following existing tool pattern (React via CDN, embedded fonts, Supabase integration)
- **7-step wizard interface**: Cover → Team Setup → Team Summary → Improvement Plan → Action Plan → Commitment Lock → PDF Export
- **Auto-calculation engine**: Aggregate individual dysfunction assessments into team-level scores with no manual math
- **Interactive radar chart**: Chart.js visualization with color-coded interpretation (green/yellow/red badges)
- **Validation-enforced action planning**: Dropdown-only "Who" field (no "All" option), date-picker-only "When" field (no "Ongoing" text input), minimum 30-character "What" descriptions
- **Digital commitment lock**: Multi-user sign-off system requiring 100% team member commitment before completion
- **Cognitive load optimizations**: Max-width 640px, single column layout, 5-7 inputs per step, 32px spacing (space-y-8), progress dots (0-6), sticky footer navigation
- **Info box components**: FastTrackInsight (yellow #FFF469) and TheScience (grey #F3F4F6) for contextual guidance
- **Supabase integration**: Schema `sprint_04_team`, tool slug `team`, sprint number 4, localStorage backup with storage key `fasttrack_team_tool`
- **PDF export**: jsPDF + html2canvas for final output generation

## Capabilities

### New Capabilities

- `team-assessment-aggregation`: Automatically calculate team-level dysfunction scores from individual assessment imports. Takes N individual assessment objects, aggregates scores for 5 dysfunctions (Absence of Trust, Fear of Conflict, Lack of Commitment, Avoidance of Accountability, Inattention to Results), returns team averages with color-coded severity indicators.

- `radar-visualization`: Generate interactive radar chart showing team dysfunction profile using Chart.js. Display 5-axis radar with team scores, yellow fill (rgba(255,244,105,0.2)), black border, tooltips, responsive sizing.

- `commitment-lock-workflow`: Digital commitment system requiring explicit sign-off from each team member. Track commitment status per member, display progress counter (X of N committed), block progression until 100% commitment reached, timestamp all commitments.

- `action-plan-validation`: Enforce concrete action planning constraints. Validate: (1) "What" descriptions minimum 30 characters, (2) "Who" must be single team member (dropdown only, no "All" option), (3) "When" must be specific date (date picker only, minimum today, no "Ongoing" allowed). Prevent step advancement until 3 validated actions exist.

- `multi-step-wizard-ui`: Reusable wizard framework with progress tracking, navigation controls, auto-save. Features: 7-step progression (0-6), progress dot indicators, sticky back/next buttons, localStorage persistence, Supabase sync, step validation gates, responsive max-width 640px layout.

- `pdf-export-generation`: Export completed team analysis as formatted PDF. Include: cover page, team roster, dysfunction scores table, radar chart image, improvement plan (top 3 dysfunctions), action plan (What/Who/When), commitment signatures with timestamps. Use jsPDF + html2canvas for rendering.

### Modified Capabilities

_No existing capabilities are being modified. This is a net-new tool addition to the module-1-identity suite._

## Impact

**Files Created**:
- `frontend/tools/module-1-identity/04-team.html` (new standalone tool, ~800-1000 lines)

**Files Referenced** (fonts copied from existing tools):
- `frontend/tools/module-1-identity/Plaak3Trial-43-Bold.woff2`
- `frontend/tools/module-1-identity/RiformaLL-Regular.woff2`
- `frontend/tools/module-1-identity/MonumentGrotesk-Mono.woff2`
- `frontend/tools/module-1-identity/RangleRiformaWeb-Medium.woff2`

**Dependencies** (all via CDN, no package.json changes):
- React 18 (unpkg.com) - UI framework
- Tailwind CSS (cdn.tailwindcss.com) - styling
- Supabase JS (cdn.jsdelivr.net) - data persistence
- Chart.js (via CDN) - radar chart visualization
- jsPDF + html2canvas (via CDN) - PDF export

**Database Impact**:
- Supabase schema: `sprint_04_team`
- Expected tables: `submissions` (team data), `assessments` (individual imports)
- Storage key: `fasttrack_team_tool`
- Supabase URL: `https://vpfayzzjnegdefjrnyoc.supabase.co`

**Design System Consistency**:
- Follows existing tool pattern from `03-values.html`
- Black/white/yellow color scheme (#FFF469 for highlights)
- Typography: Plaak (headings), Riforma (body), Monument (mono)
- Component naming: `.btn-primary`, `.btn-secondary`, `.worksheet-input`
- Info boxes: `FastTrackInsight` (yellow), `TheScience` (grey)

**User Experience**:
- Replaces manual PowerPoint workflow (3 slides)
- Reduces facilitation cognitive load (no manual calculation)
- Enforces accountability (no vague commitments)
- Creates persistent digital record (localStorage + Supabase + PDF)

**Client Feedback Addressed**:
- ✅ Auto-calculate dysfunction scores (no manual math)
- ✅ Visual interpretation (color-coded badges: green/yellow/red)
- ✅ Interactive chart (Chart.js radar chart)
- ✅ Enforce single-person ownership (dropdown only, no "All")
- ✅ Block vague deadlines (date picker only, no "Ongoing")
- ✅ Digital commitment tracking (multi-user sign-off with progress)
