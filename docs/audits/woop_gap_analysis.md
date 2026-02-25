# WOOP Tool — Gap Analysis vs. Fast Track Blueprint

**Tool:** 00-woop.html
**Date:** 2026-02-19
**Blueprint Version:** Fast Track Tool Design System v1.0

---

## A. CURRENT STATE

| Metric | Value |
|--------|-------|
| **Total fields** | ~26 (Setup: 1 radio, Step 1: 3, Step 2: 4, Step 3: 5-15 dynamic, Step 4: 3) |
| **Structure** | Multi-step wizard (Cover → Setup → 4 Steps → Canvas) |
| **Steps** | 6 screens (0, 0.5, 1, 2, 3, 4, 999) |
| **Fields per step** | Step 1: 3, Step 2: 4, Step 3: 5-15, Step 4: 3 |
| **Container** | No max-width on wizard-main (fills available space minus 280px sidebar) |
| **AI integration** | Per-step review (AIChallenge.reviewStep) + final submit (submitWithChallenge) |
| **Data persistence** | localStorage auto-save + Supabase via ToolDB |
| **Export** | PDF via jsPDF + html2canvas |

---

## B. BLUEPRINT VIOLATIONS

### CRITICAL VIOLATIONS (Must Fix)

**1. No max-width container on form content**
- **Line 54:** `.wizard-main { flex: 1; }` — no max-width constraint
- **Blueprint:** Section 1, 9, 15 — "Container Width: max-w-[960px]"
- **Impact:** On wide screens, lines stretch across the full viewport causing "wide-line fatigue"
- **Fix:** Add `max-width: 960px` to the step-content area within wizard-main

**2. Multi-column input grids (violates single-column constraint)**
- **Line 829:** Step 3 IF-THEN plan uses `gridTemplateColumns: '1fr 1fr'` (4 fields in 2x2 grid)
- **Line 900:** Step 4 uses `gridTemplateColumns: '1fr 1fr'` (firstAction + deadline side by side)
- **Blueprint:** Section 1, 15, 17 — "Single-Column Constraint: Stack fields vertically. Never multi-column (except City/Zip)"
- **Impact:** Forces zig-zag scanning, increases cognitive load
- **Fix:** Stack all fields in single column. The IF-THEN fields should flow vertically.

**3. Step 3 can exceed 7 fields per screen (up to 15 with 3 obstacles)**
- **Lines 808-856:** Each obstacle has 5 fields × up to 3 obstacles = 15 visible fields
- **Blueprint:** Section 1, 9, 18 — "Maximum 5-7 active inputs per screen"
- **Impact:** "Wall of fields" cognitive overload with 3 obstacles
- **Fix:** Show one obstacle at a time with internal sub-navigation, or limit to 2 obstacles per screen with a "review" step

**4. No on-blur validation with triple-visual error display**
- **Current:** Uses reactive `canProceed` checks (lines 536-539) — button disabled until minimums met, but no per-field error states
- **Blueprint:** Section 12, 14, 18 — "Validate on Blur. 3-component error: border (2px red) + icon (right side) + message (below field, role='alert')"
- **Impact:** User has no idea which specific field is wrong or what to fix
- **Fix:** Implement field-level blur validation with red border, warning icon, and specific error message below each field

**5. alert() popup for max obstacles**
- **Line 533:** `alert('Maximum 3 obstacles allowed.\n\nStrategy is sacrifice.')`
- **Blueprint:** Section 12 — "No modal error popups. Inline errors only."
- **Impact:** Blocks screen, breaks flow state
- **Fix:** Replace with inline toast or disable the add button with a visible message

**6. Labels not in Monument Mono uppercase**
- **Lines 151-159:** `.field-label` uses `font-weight: 600; font-size: 16px` (Riforma)
- **Blueprint:** Section 13, 14 — "Labels: Monument Grotesk Mono, 14px, uppercase, medium weight"
- **Impact:** Fails typography hierarchy, labels don't scan as labels
- **Fix:** Change field labels to `font-family: 'Monument'; font-size: 14px; text-transform: uppercase; font-weight: 500; letter-spacing: 0.05em`

**7. No required field indicators (red asterisks)**
- **Current:** No asterisks on any required field
- **Blueprint:** Section 14 — "Required indicator: Red asterisk (*) next to the label"
- **Fix:** Add `<span style="color: #DC2626">*</span>` to all required field labels

---

### HIGH PRIORITY (Should Fix)

**8. No yellow insight boxes**
- **Current:** Uses LearnMore expandable (lines 366-374) with gray styling
- **Blueprint:** Section 11, 16 — "Yellow insight box: 1 per step max. Background: #FFF469, Border: 3px solid black, Lightning bolt icon"
- **Fix:** Replace or supplement LearnMore with a visible yellow insight box per step with the 80/20 hack for that step

**9. No time estimates per step**
- **Current:** Sidebar shows "~15 min" total (line 409) but individual steps have no estimates
- **Blueprint:** Section 10, 18 — "Step X. ACTION VERB OBJECT ⏱ ~X mins"
- **Fix:** Add time estimates to each step header: Step 1 (~3 min), Step 2 (~3 min), Step 3 (~5 min), Step 4 (~3 min)

**10. No focus ring (yellow glow) on inputs**
- **Lines 170, 183:** Focus state only changes border to black — `border-color: #000`
- **Blueprint:** Section 14 — "Focus: Border Black, Ring Yellow (#FFF469) glow"
- **Fix:** Add `box-shadow: 0 0 0 3px #FFF469` or `outline: 3px solid #FFF469` on focus

**11. Sticky footer buttons not implemented**
- **Line 252-260:** `.btn-footer` has no `position: sticky; bottom: 0`
- **Blueprint:** Section 15 — "Footer: Sticky Bottom (sticky bottom-0). Primary actions always visible."
- **Fix:** Add `position: sticky; bottom: 0; z-index: 10` to btn-footer

**12. No concrete Good vs Bad examples**
- **Current:** Uses placeholder text as examples (lines 668-675, 738-746) — decent but not in ❌/✅ format
- **Blueprint:** Section 10 — "Every complex input has a Gold Standard example. Format: ❌ Bad / ✅ Good"
- **Fix:** Add gray example boxes with explicit Good vs Bad contrasts above or below each field

**13. No error summary box on "Next" click**
- **Current:** Button is simply disabled; no indication of what needs fixing
- **Blueprint:** Section 12 — "Error Summary: If >1 error, show summary box at top with links to fields"
- **Fix:** On Next click with errors, show a summary box listing each missing/invalid field

**14. Help text and error text below minimum size**
- **Line 184:** `.field-help` at 13px
- **Line 185:** `.field-error` at 13px
- **Blueprint:** Section 13 — "Body text min 16px. Help text: 14px"
- **Fix:** Increase both to 14px minimum

**15. Desktop progress indicator missing**
- **Current:** Mobile has progress bar (lines 385-393), desktop relies only on sidebar
- **Blueprint:** Section 9, 15 — "Sticky progress indicator at top" + "Step X of Y explicit status"
- **Fix:** Add a sticky progress bar at the top of wizard-main for desktop as well (or keep sidebar but add explicit "Step X of Y" in the main content area — which exists via `.step-indicator`)

---

### MEDIUM PRIORITY (Nice to Have)

**16. No "Brutal honesty" prompts**
- **Blueprint:** Section 16 — Challenge prompts like "CEOs overestimate progress 2x. Be honest."
- **Fix:** Add contextual challenge micro-copy to steps where users tend to be vague

**17. No Do's and Don'ts panels**
- **Blueprint:** Section 10 — "Right sidebar or collapsible: ✅ DO / ❌ DON'T contrasts"
- **Fix:** Add Do/Don't examples in the sidebar or as collapsible panels for complex fields

**18. Cover page START button hover uses inline JS**
- **Lines 581-582:** Uses onMouseOver/onMouseOut inline event handlers
- **Fix:** Use CSS :hover pseudo-class instead

**19. Endowed progress not at >0%**
- **Line 386:** Progress starts at step 1 = 25%, but blueprint says start at 15%
- **Blueprint:** Section 9 — "Start bar at >0% (e.g., 15%)"
- **Current:** Actually starts at 25% for step 1 which is fine — exceeds the 15% minimum

**20. Instruction voice could be more direct**
- **Current:** "Write in present tense as if it already happened" (line 682)
- **Blueprint:** Section 10, 16 — "Direct command. Action verb first. No hedging."
- **Fix:** Rewrite to: "Write in present tense. It already happened. Be specific — numbers, names, dates."

---

## C. AI FEATURES TO PRESERVE

| Feature | Location | Notes |
|---------|----------|-------|
| **ai-challenge.js script** | Line 15 | `<script src="../../shared/js/ai-challenge.js"></script>` |
| **AIChallenge.reviewStep** | Lines 500-528 | `handleNext` async function — per-step AI review gating |
| **Step answer mappings** | Lines 506-511 | `stepAnswerMap` object mapping steps 1-4 to question keys |
| **AIChallenge.submitWithChallenge** | Lines 936-963 | `handleSubmit` in CanvasView — final submission with AI review |
| **Question mappings (submit)** | Lines 943-950 | Full `questionMappings` object for final review |
| **aiReviewing state** | Line 498 | Controls button disabled state and label text |
| **ButtonFooter AI label** | Line 650 | Shows "AI Coach Reviewing..." when aiReviewing is true |
| **Supabase client** | Lines 342-351 | CONFIG, createClient, ToolDB.init |
| **DependencyInjection** | Line 352 | `DependencyInjection.init(CONFIG.TOOL_SLUG)` |
| **CognitiveLoad** | Line 353 | `CognitiveLoad.init('woop')` |
| **PDF export** | Lines 971-989 | jsPDF + html2canvas with logo overlay |
| **Auto-save (localStorage)** | Lines 474-480 | Debounced 2s save of data + step |
| **Data loading** | Lines 483-496 | Restore from localStorage on mount |
| **Submit status display** | Lines 1057-1061 | Success/error message below canvas buttons |

---

## D. REDESIGN PLAN

### Recommended Structure: 6 Screens

| Screen | Theme | Fields | Time Est |
|--------|-------|--------|----------|
| **Cover** | Hero + Start CTA | 0 | — |
| **Setup** | Scope selection | 1 (radio) | ~1 min |
| **Step 1: WISH** | Define the dream | 3 (outcome, worldChange, feeling) | ~3 min |
| **Step 2: OUTCOME** | Map milestones | 4 (3 steps + mental rehearsal checkbox) | ~3 min |
| **Step 3: OBSTACLE** | IF-THEN plans | 5 per obstacle, max 2 visible at once | ~5 min |
| **Step 4: PLAN** | First action + deadline | 3 (bigChunks, firstAction, deadline) | ~3 min |
| **Canvas** | Summary + Export + Submit | 0 input (display only) | — |

### Key Changes Per Step

**Step 1 (3 fields):** Single column. Add yellow insight box ("Mental contrasting increases goal achievement by 40%"). Add ❌/✅ examples above each textarea. Monument Mono labels. On-blur validation.

**Step 2 (4 fields):** Single column. Add time estimate. Add good/bad milestone examples. Yellow insight box about mental rehearsal.

**Step 3 (5 fields per obstacle):** Single column stack for IF-THEN fields (no 2-col grid). Show one obstacle at a time with "Next Obstacle" sub-navigation, or show all but stacked vertically. Yellow insight box about IF-THEN plans. Remove alert() — inline message.

**Step 4 (3 fields):** Single column (no side-by-side). Yellow insight box about Zeigarnik Effect. Date field with format hint.

**All Steps:** Max-width 960px. Sticky footer. Yellow focus rings. Monument Mono uppercase labels. Red asterisks. On-blur validation with triple-visual errors. Error summary on Next. Time estimates in step headers.

### What Stays the Same
- 4-step WOOP framework (W-O-O-P)
- Cover page with hero image
- Setup scope selection
- Canvas view with PDF export
- Sidebar navigation (desktop)
- Mobile progress bar
- All AI challenge integration
- All Supabase/ToolDB integration
- Auto-save to localStorage

### What Changes
- Container max-width enforced (960px)
- All inputs stacked single-column
- Labels → Monument Mono 14px uppercase
- Focus rings → yellow (#FFF469) glow
- Validation → on-blur with triple-visual errors
- Error summary box on Next click
- Yellow insight boxes (1 per step)
- Time estimates per step
- Good/Bad examples per complex field
- Sticky footer buttons
- Red asterisks on required fields
- Help/error text → 14px minimum
- alert() → inline message
- Direct, action-verb instruction voice
