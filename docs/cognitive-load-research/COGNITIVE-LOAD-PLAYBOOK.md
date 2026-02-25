# Cognitive Load Playbook - Fast Track Tools
## One-Page Quick Reference

---

## 🎯 THE GOAL
**Reduce cognitive load by 50%** while maintaining Fast Track's brutal honesty and challenging edge.

**Metric:** Client should complete tools in **30% less time**, with **60% fewer confusion questions**.

---

## 🧠 COGNITIVE LOAD 101

### Three Types of Cognitive Load

1. **INTRINSIC** - Complexity of the task itself  
   *Can't eliminate (strategy IS complex), but can chunk it into digestible pieces*

2. **EXTRANEOUS** - Wasted mental effort from bad UX  
   *THIS IS WHAT WE'RE FIXING: scrolling, visual clutter, unclear labels, split attention*

3. **GERMANE** - Effort that builds expertise  
   *KEEP THIS: Fast Track methodology, 80/20 thinking, brutal honesty principles*

### The Magic Number: **4±1**
Humans can hold 4 chunks of info in working memory at once. Not 7. Not 10. **Four.**

**Tool Design Rule:** Show max 4-5 items at once. Hide the rest until needed.

---

## ⚡ TOP 10 EXTRANEOUS LOAD KILLERS

### 1. **PROGRESSIVE DISCLOSURE**
❌ **Don't:** Show all 25 fields on one long page  
✅ **Do:** Break into 4 steps, show 5-7 fields per step

**Pattern:** Multi-step wizard OR accordion sections with clear visual separation

---

### 2. **ELIMINATE SCROLLING**
❌ **Don't:** Require 3-5 page scrolls to complete a tool  
✅ **Do:** Fit each step into 1 viewport (or minimal scrolling)

**Pattern:** Use max-width containers (720px), larger fonts, generous whitespace

---

### 3. **VISUAL CHUNKING**
❌ **Don't:** Wall of text, no visual breaks  
✅ **Do:** Group related fields with borders, backgrounds, or whitespace

**Pattern:** Use subtle grey backgrounds (#F8F8F8) to separate sections

---

### 4. **INLINE VALIDATION**
❌ **Don't:** Wait until submit, then show errors at top of page  
✅ **Do:** Validate on blur, show green checkmark or red X immediately

**Pattern:** Border color changes (grey → green/red), icon + message below field

---

### 5. **SMART DEFAULTS**
❌ **Don't:** Leave all fields blank, make users type everything  
✅ **Do:** Pre-fill where possible (company name, industry from previous tools)

**Pattern:** "Use previous entry" button, dropdown with common options

---

### 6. **JUST-IN-TIME HELP**
❌ **Don't:** Force users to watch 60-min video before starting  
✅ **Do:** Embed 30-sec tooltips exactly where/when needed

**Pattern:** (?) icon next to field label → hover/click → popover with tip

---

### 7. **SINGLE COLUMN LAYOUT**
❌ **Don't:** Multi-column forms that force eye zigzagging  
✅ **Do:** Single column, top-aligned labels, consistent spacing

**Pattern:** Label above field, not beside it (reduces split-attention)

---

### 8. **CLEAR PROGRESS**
❌ **Don't:** No indication of how far along user is  
✅ **Do:** Sticky progress bar at top showing "Step 2 of 4" or "50% complete"

**Pattern:** Linear stepper with numbers, or simple progress bar

---

### 9. **ANTI-VAGUENESS ENFORCEMENT**
❌ **Don't:** Accept "The Team" as an owner or "Integrity" as a value  
✅ **Do:** Validate input, reject generic terms, force specificity

**Pattern:** Dropdown of actual team members, required sub-fields for behavioral examples

---

### 10. **CONTEXTUAL EXAMPLES**
❌ **Don't:** Generic B2C examples for B2B clients  
✅ **Do:** Toggle examples based on industry/business model

**Pattern:** "Is your business B2B or B2C?" → swap all examples dynamically

---

## 🎨 FAST TRACK VISUAL SYSTEM

### Info Box Types (Increase Germane Load, Reduce Extraneous Load)

#### 1. FAST TRACK INSIGHT BOX
- **Color:** `#FFF469` (Fast Track Yellow)
- **Icon:** Black "F" logo (24x24px, left aligned)
- **Border:** Optional 2px solid black
- **Font:** Monument Grotesk Mono (label), Riforma (body)
- **Usage:** Methodology insights, 80/20 tips, strategic shortcuts
- **Tone:** "Fast Track Insight: This is the 20% that drives 80% of results."

#### 2. SCIENCE BEHIND IT BOX
- **Color:** `#B2B2B2` (Fast Track Grey)
- **Icon:** Black science icon (beaker/atom, 24x24px, left aligned)
- **Border:** None
- **Font:** Monument Grotesk Mono (label), Riforma (body)
- **Usage:** Evidence, research, credibility (optional depth for curious users)
- **Tone:** "The Science: Studies show that..."

#### 3. WARNING / ACTION BOX
- **Color:** `#000000` (Black background)
- **Accent:** 4px yellow left border (#FFF469)
- **Text Color:** White
- **Icon:** Yellow "!" or triangle (24x24px)
- **Font:** Plaak Bold (headline), Riforma (body)
- **Usage:** Common mistakes, critical decisions, "brutal honesty" moments
- **Tone:** "Common Mistake: Don't list departments. List what they DO."

### Placement Rules
- **Max 2-3 boxes per screen** (more = visual noise)
- **Place inline** near relevant field (not in sidebar where eyes must jump)
- **Make collapsible** if content is long (title always visible, body can hide)

---

## 📏 LAYOUT RULES

### Typography Hierarchy
- **Page Title:** Plaak 32-36px, black, uppercase
- **Section Header:** Plaak 24-28px, black, uppercase
- **Field Label:** Riforma 16-18px, black, sentence case
- **Input Text:** Riforma 18px, black
- **Help Text:** Riforma 14px, grey (#666666)
- **Validation Message:** Riforma 14px, red (#DC2626) or green (#10B981)

### Spacing System
- **Page Padding:** 32-48px (desktop), 16-24px (mobile)
- **Section Spacing:** 48-64px between major sections
- **Field Spacing:** 24-32px between fields
- **Label-Input Gap:** 8px (label directly above input)
- **Max Width:** 720px for form content (center on large screens)

### Color Palette (from Brand Guidelines)
- **Primary:** Black (#000000), White (#FFFFFF)
- **Accent:** Yellow (#FFF469)
- **Grey:** #B2B2B2 (secondary), #E0E0E0 (borders), #F8F8F8 (backgrounds)
- **Validation:** Red (#DC2626), Green (#10B981)

---

## 🚫 ANTI-PATTERNS (Don't Do This)

| ❌ Bad | ✅ Good |
|--------|---------|
| Long scroll pages (3-5 pages) | Multi-step wizard OR accordions |
| Wall of text instructions | Just-in-time tooltips |
| Generic examples (Airbnb, Uber) | Industry-specific toggles (B2B vs. B2C) |
| "Watch this 60-min video first" | Embedded 30-sec clips inline |
| Excel spreadsheet aesthetics | Clean, spacious web forms |
| Two-column forms | Single column, top-aligned labels |
| Vague field labels ("Owner") | Specific labels ("Who owns this? (First Last Name)") |
| No validation until submit | Inline validation on blur |
| No progress indicator | Sticky progress bar |
| Fragmented materials (PDF + Excel + Video) | All-in-one tool with embedded help |

---

## 🔍 BEFORE YOU SHIP: CHECKLIST

### Cognitive Load Audit
- [ ] Can user complete this in **<10 minutes**? (If not, break into smaller steps)
- [ ] Scrolling required: **<1 page** per step?
- [ ] Max **4-5 input fields** visible at once?
- [ ] Every field has **inline help** (tooltip or placeholder)?
- [ ] Validation is **immediate** (on blur, not on submit)?
- [ ] Progress is **always visible** (sticky header)?

### Brand Alignment
- [ ] Uses Fast Track fonts (Plaak, Riforma, Monument)?
- [ ] Uses Fast Track colors (black/white/yellow/grey)?
- [ ] Tone is **direct, bold, challenging** (not soft)?
- [ ] Info boxes use correct types (Fast Track yellow, Science grey, Warning black)?
- [ ] No generic corporate speak ("synergy", "leverage", etc.)?

### 8-Point Criteria Check
- [ ] Forces a **clear decision** (not just thinking)?
- [ ] **Zero confusion** (no Guru explanation needed)?
- [ ] **Easy first steps** (onboarding is smooth)?
- [ ] **Instant feedback** on each input (validation)?
- [ ] **Gamification** hints (progress bar, checkmarks)?
- [ ] **Results visibility** (show what they've created)?
- [ ] **Accountability** mechanism (save, export, share)?
- [ ] **Smells like Fast Track** (brand DNA evident)?

---

## 📊 MEASURE SUCCESS

### Quantitative Metrics (Track in Analytics)
- **Time to Complete:** Target 30% reduction
- **Scroll Distance:** Target 50% reduction
- **Completion Rate:** Target 85%+
- **Error Rate:** Target <10% of fields need correction
- **Help Clicks:** Track but don't minimize (good engagement)

### Qualitative Metrics (Track in Support)
- **Confusion Questions:** Target 60% reduction in Guru support tickets
- **"Lost" Behavior:** Track back button usage (should be minimal)
- **Satisfaction Score:** Post-tool NPS or 5-star rating

### A/B Test Setup
- **Control:** Current long-scroll tool
- **Treatment:** New cognitive-load-optimized tool
- **Sample:** 20-30 users per variant
- **Duration:** 2 weeks
- **Decision:** If treatment shows 20%+ improvement in time OR completion rate → ship it

---

## 🎯 QUICK WINS (Do These First)

### Phase 1: No-Code Improvements (This Week)
1. Add **max-width: 720px** to all form containers
2. Increase **field spacing** (24-32px instead of 12-16px)
3. Change to **single-column layout** (kill multi-column grids)
4. Add **sticky progress bar** at top
5. Increase **font sizes** (labels 16-18px, inputs 18px)

### Phase 2: Component Additions (Week 2)
1. Build **3 info box components** (Fast Track, Science, Warning)
2. Add **inline validation** (border colors + icons + messages)
3. Implement **tooltips** for field labels (? icon → popover)
4. Add **smart defaults** where possible (carry over from previous tools)

### Phase 3: Architecture Refactor (Week 3-4)
1. Convert **long-scroll → multi-step wizard** (4-6 steps)
2. Implement **accordion sections** within steps (for dense content)
3. Add **save progress** functionality (resume later)
4. Build **industry toggle** system (B2B vs. B2C examples)

---

## 📚 KEY PRINCIPLES SUMMARY

1. **Working Memory = 4 chunks** → Never show more than 4-5 things at once
2. **Proximity = Understanding** → Keep label, input, help text close together
3. **Feedback = Confidence** → Validate immediately, don't make users guess
4. **Progress = Motivation** → Always show how far along they are
5. **Defaults = Speed** → Pre-fill when possible, reduce typing
6. **Whitespace ≠ Waste** → Breathing room reduces overwhelm
7. **One Column = One Path** → Don't make eyes zigzag
8. **Just-in-Time = Just Enough** → Help when needed, not all upfront
9. **Brand = Consistency** → Use same boxes, fonts, colors across all 31 tools
10. **Brutal Honesty ≠ Brutal UX** → Be challenging in CONTENT, not INTERFACE

---

## 🔗 RESOURCES

### Must-Read Articles
- Nielsen Norman Group: "Minimize Cognitive Load to Maximize Usability"
- Smashing Magazine: "How to Design for Cognitive Load"
- Laws of UX: Miller's Law, Hick's Law, Fitts's Law

### Tools to Study
- **Typeform** (progressive disclosure)
- **Notion** (information hierarchy)
- **Linear** (minimal UI)
- **Airtable** (data entry)

### Internal Docs
- `friction_blind_spot_report_reformatted.md` - All client pain points
- `Fast Track Brand Guidlines.md` - Colors, fonts, tone
- `th point tool criteria (1).md` - What makes a tool "Fast Track"

---

**Last Updated:** 2026-02-17  
**Owner:** Product & UX Team  
**Review Cycle:** After each tool redesign (learn and improve)

---

## 🚀 START HERE

**Your first action:** 
1. Print this playbook (or pin to Notion)
2. Run the 3 "Quick Start" prompts from `COGNITIVE-LOAD-RESEARCH-PROMPTS.md`
3. Audit WOOP tool (00-woop.html) using the "Before You Ship" checklist
4. Redesign 1 section of WOOP as proof-of-concept
5. Test with 2-3 clients, iterate

**Remember:** We're not dumbing it down. We're making it brutally efficient.
