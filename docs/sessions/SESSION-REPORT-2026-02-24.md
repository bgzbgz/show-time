# Session Report — 2026-02-24
## Tool-by-Tool Review & Rewrite Session

**Branch:** `fix/tool-logic-audit`
**Focus:** Reviewing and rewriting tools 4-9 with source PDF/instruction materials

---

## What We Did

### 1. FIT Tool (05-fit.html) — Restructured to 3-Path Architecture

**Problem:** The tool had only 2 paths (Individual + Team). The ABC Talent Matrix was locked behind team completion, but the CEO needs to complete it BEFORE the meeting as pre-meeting prep.

**Fix:** Restructured from 2-path to 3-path:
- **Individual Assessment** (steps 1-4) — always available, everyone completes
- **ABC Talent Matrix** (steps 5-6) — CEO pre-meeting prep, NOT locked. CEO adds team members, rates Values + Performance (0-100%), sees matrix visualization
- **Team Meeting Tool** (steps 7-8) — LOCKED until all individuals submit `fit-individual`. Has full 90-min meeting agenda

**Also added:** Shift+Click dev bypass on locked bars in both 05-fit.html and 04-team.html for testing.

**File:** `frontend/tools/module-1-identity/05-fit.html` (~2467 lines)

---

### 2. Energy Tool (07-energy.html) — Complete Rewrite as Two-Phase

**Individual Tool (2 clear sections):**
- **Section A: Physical Energy** — 3 steps: Sleep (step 1), Nutrition (step 2), Movement (step 3). Each with positive habits, negative habits, goals, and Atomic Habits framework (habit → trigger → routine → reward → accountability partner)
- **Section B: Mental Energy** — Step 4: Control Analysis + Stop/Less/More decisions. Step 5: Event-Gap-Response Analysis
- Step 6: Review & Submit (slug: `energy-individual`)

**Team Meeting Tool (locked, Shift+Click to test):**
- Step 7: Full 60-min meeting agenda (5 segments with key questions + pitfalls)
- Step 8: PDPs & Company Commitments — member commitments with measurable outcomes + company-level energy commitments + 3 team strategies

**Case studies filled with real content from sprint 07 course materials:**
- Individual: "From Burnout to Breakthrough" — CEO 70-hour weeks → Energy Protocol → 50 hours, doubled output
- Team: "Team Energy Transformation" — 15-person team → company-wide energy commitments → sick days down 40%

**File:** `frontend/tools/module-2-performance/07-energy.html`

---

### 3. Goals Tool (08-goals.html) — Rewrite as Single-Flow 5-Step Tool

**Key decision:** Individual and team use the SAME tool. During meetings, the team discusses company priorities and uses Cut the Elephant for company-level actions.

**6 Steps (5 working + review):**
1. **Brainstorm & Rate** — 20-row table with Impact (1-3, weight 2x) and Ease (1-3, weight 1x) dropdowns. Score = (Impact×2)+Ease, max 9. Dropdowns start at "–" (0). Score badge appears only when idea text + both ratings are set.
2. **Priority Rankings** — Sorted by weighted score, TOP 5 highlighted in yellow with badges
3. **Cut the Elephant** — Auto-populated from top 5 priorities via `populateElephants()`. Each broken into 5 incremental steps with deadline date pickers
4. **Accountability Checklist** — 8 Yes/No toggle items, score summary (Strong/Needs Work/Critical Gap), good/bad signs boxes, action plan textarea
5. **Alignment Checklist** — Same structure as accountability, different questions
6. **Review & Submit** — Summary of all 4 sub-tools + case study + AI challenge submit

**Bug fixed during session:** Score wasn't updating dynamically because:
- All dropdowns defaulted to 3/3/9 (no visible change)
- Score badge only showed when `idea.idea.trim()` was truthy
- Fixed: dropdowns start at 0 ("–"), score shows when idea + both ratings > 0

**File:** `frontend/tools/module-2-performance/08-goals.html` (~1779 lines)

---

### 4. Focus Tool (09-focus.html) — IN PROGRESS (not completed)

**Current state:** The tool already has 8 individual steps + 1 team step with WOOP design system, transitions, sidebar. BUT most steps have WRONG field structures compared to the PDF originals.

**What needs to change (detailed gap analysis completed, rewrite NOT yet executed):**

| Step | Current | PDF Shows | Status |
|------|---------|-----------|--------|
| 1. Empty Brain | Brain dump + quadrant selector | Same + top 3 priority boxes | Minor update |
| 2. Daily Plan | 3 inputs + 4 time blocks + energy peaks | 3 priorities × 3 sub-steps + Gold Hour (Mon-Fri) + Evening Reflection | REPLACE |
| 3. Eliminate 1/2 | 3×3 text inputs | Proficiency × Passion quadrant (like Impact/Easy) | REPLACE |
| 4. Eliminate 2/2 | 3 textareas | 3 tables (Activity / Say NO / Delegate / Automate / Limit) | REPLACE |
| 5. Distractions | Digital/Physical lists + action text | No Control/Control × Annoying/Fun quadrant + If-Then table + Additional activities | REPLACE |
| 6. Key Routines | 5 textareas | 7 routines table (name + minutes) + 24h time math | REPLACE |
| 7. 3 Routines Builder | name/trigger/action/reward | name/time of day/context setup/reward/accountability | UPDATE fields |
| 8. Flow State | 5 textareas | 4-row table (activity/surrounding/environment) + Flow Routine textarea | REPLACE |
| Team | 1 step (textareas + WWW) | Locked 3-step: Meeting Agenda + Conclusions/Improvements table + WWW | REPLACE |

**All PDF content has been analyzed and the complete rewrite spec is documented above. Ready for execution.**

---

## Technical Patterns Established

### Tool Phase Patterns
1. **Two-Phase (Individual + Team):** Team, FIT (partial), Energy, Focus
   - Cover → Path chooser → Individual steps → Team steps (locked)
   - Team unlock checks Supabase for org member submissions
2. **Three-Phase (Individual + CEO Prep + Team):** FIT
   - ABC Matrix is CEO pre-meeting — NOT locked
3. **Single-Flow:** Goals
   - Same tool used by individual and team meeting

### Key Code Patterns
- **Shift+Click dev bypass:** `onClick={(e) => { if (e.shiftKey) setTeamToolUnlocked(true); }}`
- **Score calculation:** `(impact × 2) + ease`, max 9
- **CaseStudy requires explicit props** — CognitiveLoad.init data is NOT auto-passed
- **Select value={0} with option value={0}** for "unrated" default state
- **populateElephants()** auto-fills from sorted priority rankings

### Files Modified This Session
```
frontend/tools/module-1-identity/04-team.html    — Added Shift+Click bypass
frontend/tools/module-1-identity/05-fit.html     — 3-path restructure
frontend/tools/module-2-performance/07-energy.html — Complete rewrite
frontend/tools/module-2-performance/08-goals.html  — Complete rewrite + scoring fix
frontend/tools/module-2-performance/09-focus.html  — NOT YET REWRITTEN (analysis complete)
```

---

## Batch Processing Strategy (agreed upon this session)

### The Problem
Doing tools one-by-one was too slow — user had to manually paste PDF instructions, meeting agendas, and tool descriptions for each tool. Too many tokens and too much time.

### The Solution: Batch Folder Approach
All source materials already exist at `c:\Users\Admin\Desktop\LMS\00. sprints\` with subfolders for each sprint. Each has:
- A `XX.md` course file (contains "Tool explanation and guide – FOR REVIEW ONLY" sections AND "Team Meeting Preparation Guide")
- `individual tools/` or `Fast Track Process Tools/` subfolder with PPTX/XLSX/PDF tools
- `team tools/` subfolder with team tool files

A drop folder was created at `docs/source-materials/` with subfolders for each remaining tool (09-31). A master checklist at `docs/source-materials/DROP-FILES-HERE.md` shows exactly what exists in the LMS folder and what's missing for each tool.

### Key Discovery: Many Tools Don't Need PDFs
The course `.md` files contain 90%+ of what's needed — the "Tool explanation and guide" sections describe every field, step, and instruction. The PDFs just confirm exact table layouts (columns, row counts, quadrant labels). So even without a PDF, tools can be built from the `.md` file alone.

### LMS Folder Structure (already exists, no setup needed)
```
c:\Users\Admin\Desktop\LMS\00. sprints\
├── 0. WOOP/                    → 00.md + tool/
├── 01. Know Thyself/           → tool/
├── 02. Dream/                  → 02.md + tool/
├── 03. Values/                 → 03 Values.md + tool/
├── 04. Team/                   → 04 team.md + team tool/
├── 05. Fit/                    → 05.md + individual tools/ + team tools/
├── 06. Current Cash Position/  → tool/ + tool logic/
├── 07. Creating Energy.../     → 07.md + individual tools/ + team tools/
├── 08. Goals.../               → 08.md + individual tools/ + team tools/
├── 09. Focus.../               → 09.md + individual tools/ + team tools/
├── 10. Monitor Performance/    → 10.md + Fast Track Process Tools/ + Team Tools/
├── 11. Meeting Rhythm/         → 11.md + Fast Track Process Tools/ (5 different tools!)
├── 12. Market Size/            → 12.md + team tools/
├── 13. Segmentation/           → 13.md + team tools/
├── 14. Target Segment/         → guides/ + team tools/
├── 15. Value Proposition/      → 15.md + team tool/
├── 16. VP Testing/             → 16.md + team/
├── 17. Product Development/    → 17.md + wtp tool/ + product portfolio/
├── 18. Strategy Pricing/       → 18.md + portfolio analysis/ + price map/
├── 19. Brand Marketing/        → 19.md + team tools/
├── 20. Customer Service/       → 20.md + team tool/
├── 21. Route to Market/        → 21.md + products/ + services/
├── 22. Core Activities/        → 22.md + team tools/
├── 23. Processes Decisions/    → 23.md + tool/
├── 24. FIT ABC Analysis/       → 24.md + team/
├── 25. Org Redesign/           → toolkit/ + recruitment/
├── 26. Employer Branding/      → 26.md + team tool/
├── 27. Agile Teams/            → 27.md + team tools/
├── 28. Digitalization/         → 28.md + individual tool/ + team tool/
├── 29. Tech AI/                → 29.md (survey only, no tool)
├── 30. Implementation Plan/    → 30.md (no tools found)
├── 31. Digital Heart/          → 31.md + tool/
└── 32. Program Overview/       → (no tools)
```

### How to Batch Process (for next session)
1. Read course `.md` from LMS folder
2. Read current HTML tool from `frontend/tools/`
3. Read individual/team tool PDF/PPTX if available (some are PPTX/XLSX which can't be read directly — need PDF export)
4. Rewrite following established patterns (two-phase locked team, proper fields, transitions, case studies)
5. Process 3-4 tools in parallel using agents

### User Will: Drop PDF exports of PPTX/XLSX files into `docs/source-materials/{tool-number}/` for tools where the original is not readable (binary PPTX/XLSX). The checklist in `DROP-FILES-HERE.md` shows exactly what's needed.

---

## Next Steps (for new session)

### Priority 1: Complete Focus Tool Rewrite (09-focus.html)
The complete spec is in the gap analysis table above. All 8 steps need field-level updates to match PDFs. Team tool needs locked two-phase + 90-min meeting agenda + conclusions/improvements table (Idea/Who/When). An agent was dispatched but hit the output token limit — the file is ~2000+ lines and needs to be written in chunks or with a higher token limit. Set `CLAUDE_CODE_MAX_OUTPUT_TOKENS` higher, or split the write into multiple edits.

**Detailed data structure and step specs for the rewrite are documented in the gap analysis above and were passed to the agent. The agent read the current file and 07-energy.html for the locked team pattern.**

### Priority 2: Batch-Process Remaining Tools
Using the batch folder approach:
1. Read course `.md` + existing HTML + any PDFs from `docs/source-materials/`
2. Process in parallel batches of 3-4 tools
3. Remaining tools: 06, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31

### Priority 3: Cross-Cutting Tasks
- Add dependency auto-load (useEffect pattern) to ALL React tools
- Fix missing cover images
- Update `course_tool_mapping` with production LearnWorlds course IDs
- RLS policies on webhook_events and course_tool_mapping tables

---

## User Preferences (observed)
- Reviews each tool against original PDF/PowerPoint source materials
- Wants tools to match PDF layouts closely (quadrants, tables, fields)
- Prefers real case study content from sprint course materials (not placeholders)
- Values clear separation between individual prep, CEO prep, and team meeting
- Likes the Shift+Click dev bypass pattern for testing locked features
- Wants session reports at the end of each session
- **Prefers batch processing over one-by-one** — agreed to batch folder approach
- Source materials are at `c:\Users\Admin\Desktop\LMS\00. sprints\` — already organized by sprint number
- Course `.md` files are the primary source of truth for tool instructions and meeting agendas
