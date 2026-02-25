# Fast Track Tool Audit Master Reference

> Complete checklist for auditing Fast Track tools against brand guidelines, design system, and tool criteria

---

## PART 1: 8-POINT TOOL CRITERIA (MANDATORY)

Every tool MUST pass these 8 criteria:

### 1. FORCES A FINAL CLEAR DECISION
- [ ] Tool produces a concrete outcome, not just thinking
- [ ] User leaves with a decision made, not analysis paralysis
- [ ] Final canvas/summary shows the complete decision
- [ ] No ambiguity about what the user accomplished

**Example:** WOOP tool forces specific If-Then plans, not vague "I'll try harder"

---

### 2. ZERO QUESTIONS NEEDED
- [ ] No confusion at any step
- [ ] No need for support or clarification
- [ ] Instructions are self-explanatory
- [ ] Examples/placeholders guide user behavior
- [ ] Field labels are crystal clear

**Example:** Dynamic placeholders change based on earlier selections

---

### 3. EASY INTUITIVE FIRST STEPS
- [ ] Simple entry point builds confidence
- [ ] First input is easy and non-threatening
- [ ] Complexity increases gradually
- [ ] User feels immediate progress

**Example:** Start with basic info (name, company) before complex decisions

---

### 4. FEEDBACK ON EACH STEP
- [ ] Instant validation (like credit card fields turning red)
- [ ] User knows immediately if input is good or bad
- [ ] Character counters show progress
- [ ] Disabled buttons indicate incomplete fields
- [ ] Live previews show constructed outputs

**Example:** If-Then plan preview updates as user types

---

### 5. GAMIFICATION ELEMENTS
- [ ] Progress indicators show completion percentage
- [ ] Step navigation shows where user is in journey
- [ ] Achievements/milestones celebrated
- [ ] Transition screens acknowledge progress
- [ ] Makes completion feel satisfying

**Example:** Progress dots, transition screens with "25% COMPLETE"

---

### 6. CRYSTAL CLEAR RESULTS VISIBILITY
- [ ] User sees exactly what they created
- [ ] Summary/canvas shows all inputs together
- [ ] Clean, readable final output
- [ ] Ready for export/print

**Example:** WOOP canvas displays all 4 sections color-coded

---

### 7. MASS COMMUNICATION OF DECISION
- [ ] Export/save capability (PDF, share)
- [ ] Public commitment mechanism
- [ ] Easy to share with team/stakeholders
- [ ] Creates accountability

**Example:** Export PDF button, Share with Team button

---

### 8. SMELLS LIKE FAST TRACK
- [ ] Unmistakable brand identity
- [ ] Correct colors (black, white, grey, yellow only)
- [ ] Correct fonts (Plaak, Riforma, Monument)
- [ ] NO emojis
- [ ] Sharp, direct tone of voice
- [ ] Bold, high-contrast aesthetics

**Example:** Black backgrounds, yellow accents, Plaak headlines

---

## PART 2: BRAND IDENTITY CHECKLIST

### Colors (ONLY these 4)

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Black** | `#000000` | 0, 0, 0 | Backgrounds, primary text, borders |
| **White** | `#FFFFFF` | 255, 255, 255 | Text on dark, light backgrounds |
| **Grey** | `#B2B2B2` | 178, 178, 178 | Secondary text, borders |
| **Yellow** | `#FFF469` | 255, 244, 105 | Accent ONLY, sparingly for highlights |

**Critical Rules:**
- [ ] NO other colors used (except red for obstacles/warnings if tool-specific)
- [ ] Yellow used sparingly (critical boxes, hover states only)
- [ ] Black OR white backgrounds, not both mixed randomly
- [ ] Strong contrast always maintained

---

### Typography

| Element | Font | Case | Weight | Usage |
|---------|------|------|--------|-------|
| **H1** | Plaak | UPPERCASE | Bold | Main page titles, cover pages |
| **H2** | Plaak | UPPERCASE | Bold | Section headers |
| **H3** | Riforma | Sentence case | Bold | Subsection headers |
| **H4** | Riforma | Sentence case | Bold | Minor headers |
| **Body** | Riforma | Sentence case | Regular | All body text, inputs, buttons |
| **Labels** | Monument Grotesk Mono | UPPERCASE | Regular | Annotations, step numbers (sparingly) |

**Font Files (woff2):**
```css
@font-face {
    font-family: 'Plaak';
    src: url('Plaak3Trial-43-Bold.woff2') format('woff2');
    font-weight: bold;
}

@font-face {
    font-family: 'Riforma';
    src: url('RiformaLL-Regular.woff2') format('woff2');
    font-weight: normal;
}

@font-face {
    font-family: 'Monument';
    src: url('MonumentGrotesk-Mono.woff2') format('woff2');
}
```

**Critical Rules:**
- [ ] Plaak ONLY for H1 and H2, always uppercase, always bold
- [ ] Riforma for H3, H4, body, buttons, inputs
- [ ] Monument sparingly (step numbers, annotations)
- [ ] NO system fonts (Arial, Helvetica, etc.)

---

### Tone of Voice

**DO:**
- [ ] Direct, sharp sentences ("Do this" not "You should do this")
- [ ] Active tense, not passive
- [ ] Confident, not arrogant
- [ ] Short, concise sentences
- [ ] Speak as partners: honest, collaborative, equal
- [ ] Use expertise and conviction

**DON'T:**
- [ ] NO emojis anywhere
- [ ] NO exclamation marks in body copy
- [ ] NO flowery language or elaborate metaphors
- [ ] NO motivational poster speak
- [ ] NO over-excitement or fluffy clichés
- [ ] NO capitalization for emphasis (use bold or color instead)

**Examples:**
- ✅ "Strategy is sacrifice."
- ✅ "Maximum 3 obstacles. Focus on what will ACTUALLY stop you."
- ❌ "Wow! This is amazing! You're doing great! 🎉"
- ❌ "You should really try to think about what might stop you..."

---

## PART 3: VISUAL DESIGN CHECKLIST

### Layout
- [ ] Black background OR white fillable sections (not mixed randomly)
- [ ] Strong left alignment throughout
- [ ] Clear visual hierarchy (Plaak headers → Riforma body)
- [ ] Generous whitespace (min 24px between sections)
- [ ] Max container width: 1152px (max-w-6xl)
- [ ] Consistent padding: 32px or 48px on main containers

---

### Buttons

**Primary Button:**
- [ ] Background: `#000000` (black)
- [ ] Text: `#FFFFFF` (white)
- [ ] Border: `2px solid #000000`
- [ ] Padding: `16px 32px`
- [ ] Font: Riforma, 18px, normal weight
- [ ] Border-radius: `0` (sharp corners)
- [ ] Transition: `all 0.2s ease`

**Primary Hover:**
- [ ] Transform: `scale(1.02)`
- [ ] Box-shadow: `0 4px 8px rgba(0,0,0,0.1)`

**Primary Disabled:**
- [ ] Background: `#E0E0E0`
- [ ] Color: `#9CA3AF`
- [ ] Opacity: `0.5`
- [ ] Cursor: `not-allowed`

**Secondary Button:**
- [ ] Background: `#FFFFFF` (white)
- [ ] Text: `#000000` (black)
- [ ] Border: `2px solid #000000`
- [ ] Padding: `12px 24px`
- [ ] Hover: Background changes to `#F8F8F8`

---

### Input Fields

**Text Input / Textarea:**
- [ ] Border: `1px solid #E0E0E0`
- [ ] Padding: `12px 16px`
- [ ] Font: Riforma, 18px
- [ ] Width: `100%`
- [ ] Border-radius: `0` (sharp corners)
- [ ] Transition: `border-color 0.2s ease`

**Focus State:**
- [ ] Outline: `none`
- [ ] Border-color: `#000000` (black)

**Error State:**
- [ ] Border-color: red
- [ ] Error message displayed below field

---

### Cards/Sections

**Numbered Section Headers:**
- [ ] Background: `#000000`
- [ ] Color: `#FFFFFF`
- [ ] Padding: `10px 16px`
- [ ] Font: Plaak, 26px, bold
- [ ] Display: `inline-block`
- [ ] Format: `[01] SECTION NAME`

**Instruction Boxes (Black):**
- [ ] Background: `#000000`
- [ ] Color: `#FFFFFF`
- [ ] Border: `4px solid #000000`
- [ ] Padding: `24px`

**Warning Boxes (Yellow):**
- [ ] Background: `#FFF469` (Fast Track yellow)
- [ ] Border: `4px solid #000000`
- [ ] Text: `#000000` (black)
- [ ] Padding: `32px`
- [ ] Used for critical decisions/constraints

**Obstacle Boxes (Red):**
- [ ] Background: `#FEF2F2` (light red)
- [ ] Border: `4px solid #EF4444` (red)
- [ ] Text: `#000000` (black)
- [ ] Only used in obstacle sections

---

### Progress Indicators

**Progress Dots:**
- [ ] Size: `12px × 12px`
- [ ] Border-radius: `50%` (circle)
- [ ] Default: `#E0E0E0`
- [ ] Active: `#000000`, scale `1.3`
- [ ] Completed: `#000000`
- [ ] Transition: `all 0.2s ease`

**Progress Bar:**
- [ ] Height: `2px`
- [ ] Background: `#E0E0E0` (unfilled)
- [ ] Fill: `#000000` (completed)

**Transition Screens:**
- [ ] Black background (`#000000`)
- [ ] White text (`#FFFFFF`)
- [ ] Plaak font, text-8xl or text-9xl
- [ ] Progress percentage displayed
- [ ] Auto-advance or manual continue button

---

## PART 4: UX PATTERNS CHECKLIST

### Intra-Tool Data Flow
- [ ] Earlier inputs displayed in later sections
- [ ] Live preview updates as user types
- [ ] Summary/canvas shows all inputs together
- [ ] Scope/context badges remind user of earlier choices
- [ ] Dynamic placeholders based on earlier selections

**Example:**
```javascript
// Step 1: User selects scope
data.scopeType = 'program' // or 'business'

// Step 2: Placeholders change based on scope
const placeholders = data.scopeType === 'program' ? {
    outcome: "Program-specific example..."
} : {
    outcome: "Business-specific example..."
};
```

---

### Progress & Navigation
- [ ] Clear step indicators (dots, numbers, labels)
- [ ] User knows where they are in the process
- [ ] Can navigate back to previous steps
- [ ] Forward navigation disabled until validation passes
- [ ] Transition screens between major sections

---

### Validation
- [ ] Required fields clearly marked (`* REQUIRED`)
- [ ] Real-time validation feedback (character counters)
- [ ] Cannot proceed with invalid/empty required fields
- [ ] Clear error messages (not just red borders)
- [ ] Positive feedback when validation passes

**Character Counter Example:**
```
{data.outcome.length}/300 characters (min 20)
```

**Validation Logic Example:**
```javascript
const canProceed = data.outcome.length >= 20 &&
                   data.worldChange.length >= 10 &&
                   data.feeling.length >= 3;
```

---

### Results & Export
- [ ] Final summary view of all decisions (canvas)
- [ ] Export to PDF capability
- [ ] Share with team functionality
- [ ] Clear "completed" state
- [ ] Print-friendly styles (`@media print`)

---

### Auto-Save
- [ ] Data saved to localStorage
- [ ] 2 second delay after last input
- [ ] Includes timestamp
- [ ] Restored on page load
- [ ] Migration logic for old data structures

---

## PART 5: QUICK AUDIT TEMPLATE

### Tool: ________________  |  Date: ________________  |  Auditor: ________________

---

### 8-Point Criteria

| # | Criteria | ✅/❌ | Notes |
|---|----------|-------|-------|
| 1 | Forces clear decision | | Final outcome concrete? |
| 2 | Zero questions needed | | Self-explanatory? |
| 3 | Easy first steps | | Simple entry point? |
| 4 | Step feedback | | Instant validation? |
| 5 | Gamification | | Progress indicators? |
| 6 | Clear results | | Summary visible? |
| 7 | Share/export | | PDF/share buttons? |
| 8 | Smells Fast Track | | Brand compliant? |

**Overall 8-Point Score: ___/8**

---

### Brand Compliance

| Element | ✅/❌ | Issue (if any) |
|---------|-------|----------------|
| **Colors** | | |
| - Only 4 brand colors used | | |
| - No unapproved colors | | |
| - Yellow used sparingly | | |
| **Typography** | | |
| - Plaak for H1/H2 (uppercase) | | |
| - Riforma for H3/H4/body | | |
| - Monument for labels only | | |
| - Font files loaded (woff2) | | |
| **Tone of Voice** | | |
| - No emojis | | |
| - No exclamation marks | | |
| - Direct, active tense | | |
| - Short, sharp sentences | | |
| **Buttons** | | |
| - Primary: black bg, white text | | |
| - Secondary: white bg, black border | | |
| - Disabled state: grey | | |
| - Sharp corners (no border-radius) | | |
| **Inputs** | | |
| - Correct border colors | | |
| - Focus state: black border | | |
| - Validation feedback present | | |
| **Layout** | | |
| - Left alignment | | |
| - Clear hierarchy | | |
| - Generous whitespace | | |
| - Max-width 1152px | | |

**Overall Brand Score: ___/20**

---

### UX Patterns

| Pattern | ✅/❌ | Notes |
|---------|-------|-------|
| **Data Flow** | | |
| - Earlier inputs shown later | | |
| - Live previews | | |
| - Final canvas/summary | | |
| **Progress** | | |
| - Step indicators | | |
| - Can navigate back | | |
| - Transition screens | | |
| **Validation** | | |
| - Required fields marked | | |
| - Real-time feedback | | |
| - Cannot proceed if invalid | | |
| **Export** | | |
| - PDF export | | |
| - Share functionality | | |
| - Print styles | | |

**Overall UX Score: ___/12**

---

### FINAL AUDIT SCORE

- **8-Point Criteria:** ___/8
- **Brand Compliance:** ___/20
- **UX Patterns:** ___/12

**TOTAL: ___/40**

**Pass Threshold: 35/40 (88%)**

---

## PART 6: COMMON ISSUES TO FIX

### Critical Issues (Must Fix)

1. **Wrong colors**
   - Using colors outside #000000, #FFFFFF, #B2B2B2, #FFF469
   - Fix: Replace all non-brand colors

2. **Wrong fonts**
   - Using system fonts instead of Plaak/Riforma/Monument
   - Fix: Load woff2 files, apply correct font classes

3. **Emojis present**
   - Any emoji in UI text
   - Fix: Remove all emojis, use text only

4. **No clear decision output**
   - Tool produces analysis, not decision
   - Fix: Add final canvas/summary with concrete outputs

5. **No validation feedback**
   - User doesn't know if input is valid
   - Fix: Add character counters, disabled states, error messages

6. **Cannot export/share**
   - No way to save or communicate decision
   - Fix: Add PDF export, share buttons

---

### Major Issues (High Priority)

7. **Vague instructions**
   - User needs to ask questions to understand
   - Fix: Add examples, placeholders, clearer labels

8. **Missing intra-tool data flow**
   - Earlier inputs not referenced later
   - Fix: Display earlier choices in later steps, dynamic placeholders

9. **No progress indicators**
   - User doesn't know where they are
   - Fix: Add step dots, progress bar, transition screens

10. **Inconsistent button styles**
    - Buttons don't follow brand guidelines
    - Fix: Apply `.btn-primary` and `.btn-secondary` classes

---

### Minor Issues (Nice to Have)

11. **No auto-save**
    - User loses work if they close page
    - Fix: Implement localStorage auto-save

12. **No mobile responsive**
    - Layout breaks on small screens
    - Fix: Use Tailwind responsive classes

13. **Missing print styles**
    - PDF export looks messy
    - Fix: Add `@media print` styles, `.no-print` class

14. **No transition screens**
    - Feels abrupt between steps
    - Fix: Add transition screens with progress percentage

15. **No gamification**
    - Completion feels flat
    - Fix: Add achievements, celebrations, progress rewards

---

## PART 7: IMPLEMENTATION CHECKLIST

### Before Starting Development

- [ ] Read this audit master thoroughly
- [ ] Review WOOP tool as reference implementation
- [ ] Copy font files (woff2) to tool directory
- [ ] Confirm tool-specific requirements with stakeholder
- [ ] Understand the 8-point criteria for this tool

---

### During Development

**Setup:**
- [ ] HTML structure with React/Babel/Tailwind CDN
- [ ] @font-face declarations for all 3 fonts
- [ ] Base styles (body, reset, antialiasing)
- [ ] Config object with Supabase credentials

**Components:**
- [ ] Cover page (black background, Plaak title)
- [ ] Intro/instructions page
- [ ] Step components (1-4 or more)
- [ ] Transition screens between steps
- [ ] Final canvas/summary view
- [ ] Help modal
- [ ] Progress indicators

**Functionality:**
- [ ] State management with React hooks
- [ ] Auto-save with 2s delay
- [ ] Data validation for all required fields
- [ ] Intra-tool data flow (earlier inputs shown later)
- [ ] Live previews where applicable
- [ ] Export to PDF
- [ ] Share functionality

**Styling:**
- [ ] All buttons follow brand guidelines
- [ ] All inputs follow brand guidelines
- [ ] Correct colors only
- [ ] Correct fonts only
- [ ] No emojis
- [ ] Sharp corners (no border-radius)
- [ ] Proper spacing (24px, 32px, 48px)

---

### Before Launch

**Testing:**
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test responsive behavior (mobile/tablet)
- [ ] Test auto-save and data restoration
- [ ] Test validation (try to break it)
- [ ] Test PDF export
- [ ] Test all interactive states (hover, focus, disabled)

**Content:**
- [ ] All text follows tone of voice guidelines
- [ ] No emojis present
- [ ] No exclamation marks in body copy
- [ ] Examples are clear and helpful
- [ ] Instructions are self-explanatory

**Brand Audit:**
- [ ] Run through this checklist completely
- [ ] Score 35/40 or higher
- [ ] All critical issues fixed
- [ ] All major issues fixed

**User Testing:**
- [ ] Can user complete tool without questions?
- [ ] Does user leave with clear decision?
- [ ] Can user export/share result?
- [ ] Does tool "smell like Fast Track"?

---

## PART 8: QUICK REFERENCE - CSS CLASSES

### Essential Classes to Use

```css
/* Typography */
.plaak { font-family: 'Plaak'; font-weight: bold; letter-spacing: -0.01em; line-height: 1.2; }
.monument { font-family: 'Monument'; letter-spacing: 0.05em; }

/* Buttons */
.btn-primary { bg: #000; color: #FFF; padding: 16px 32px; border: 2px solid #000; font: Riforma 18px; }
.btn-secondary { bg: #FFF; color: #000; padding: 12px 24px; border: 2px solid #000; font: Riforma 16px; }

/* Inputs */
.worksheet-input { border: 1px solid #E0E0E0; padding: 12px 16px; font: Riforma 18px; width: 100%; }
.worksheet-textarea { same as input + min-height: 120px; resize: vertical; }

/* Sections */
.numbered-section { bg: #000; color: #FFF; padding: 10px 16px; font: Plaak 26px bold; display: inline-block; }

/* Progress */
.progress-dot { w/h: 12px; border-radius: 50%; bg: #E0E0E0; transition: all 0.2s; }
.progress-dot.active { bg: #000; transform: scale(1.3); }

/* Animations */
.animate-in { animation: slideIn 0.3s ease-out; }
.fade-in { animation: fadeIn 0.5s ease-out; }

/* Utility */
.smooth { transition: all 0.2s ease; }
.no-print { display: none in @media print; }
```

---

## PART 9: RED FLAGS 🚩

If you see any of these, the tool FAILS the audit:

1. 🚩 Emojis in UI
2. 🚩 Colors outside brand palette (except tool-specific reds)
3. 🚩 System fonts (Arial, Helvetica, etc.)
4. 🚩 Exclamation marks in body copy
5. 🚩 Rounded corners on buttons/inputs
6. 🚩 No clear final decision/output
7. 🚩 No way to export/share
8. 🚩 User needs to ask questions to understand
9. 🚩 No validation feedback
10. 🚩 Flowery, motivational language

---

## PART 10: APPROVAL CHECKLIST

Before tool goes live:

- [ ] Tool scored 35/40+ on audit
- [ ] No red flags present
- [ ] All 8-point criteria met
- [ ] Fonts loaded correctly (woff2)
- [ ] Colors match brand exactly
- [ ] Tone of voice is on-brand
- [ ] User testing completed successfully
- [ ] PDF export works
- [ ] Share functionality works
- [ ] Auto-save works
- [ ] Mobile responsive
- [ ] Print styles work

**Approved by:** ________________
**Date:** ________________
**Score:** ___/40

---

**END OF MASTER AUDIT REFERENCE**
