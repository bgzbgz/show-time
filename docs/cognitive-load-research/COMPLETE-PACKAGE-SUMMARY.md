# COGNITIVE LOAD RESEARCH: COMPLETE PACKAGE
## Everything You Need to Execute Flawlessly

**Created:** 2026-02-17  
**Status:** Ready to Execute  
**Time to Complete:** 3 weeks

---

## 📦 WHAT YOU'VE RECEIVED

I've created **5 comprehensive documents** that answer every aspect of your WOOP request:

### 1. **PRE-MORTEM-FAILURE-PREVENTION.md** ⭐ START HERE
**Purpose:** Prevents all 7 disaster scenarios you identified

**What's Inside:**
- Exact steps to avoid getting lost in information (10 source limit)
- How to not break production tools (sandbox strategy)
- How to avoid deployment disasters (deployment freeze)
- How to collect ONLY the right sources (4-test validation)
- Pre-written prompts so you don't mess up chat queries
- Laser-focused scope (8 specific things to research, not "everything")
- Day-by-day action plan (Days 1-5, then Week 2-3)

**When to Use:** Read this FIRST before starting anything. Re-read when overwhelmed.

---

### 2. **COGNITIVE-LOAD-PLAYBOOK.md**
**Purpose:** One-page quick reference for cognitive load principles

**What's Inside:**
- Cognitive Load 101 (3 types, magic number 4±1)
- Top 10 extraneous load killers (progressive disclosure, eliminate scrolling, etc.)
- Fast Track visual system (3 box types with exact colors/fonts)
- Layout rules (typography, spacing, colors)
- Anti-patterns (what NOT to do)
- Before-you-ship checklist

**When to Use:** Pin this to your monitor. Reference while designing/coding.

---

### 3. **COGNITIVE-LOAD-RESEARCH-PROMPTS.md**
**Purpose:** Copy-paste ready prompts for all LLMs

**What's Inside:**
- 8 prompt categories (40+ total prompts)
- Quick start: 3 prompts to run first
- Competitive analysis prompts (Typeform, Notion, Airtable, etc.)
- Cognitive load theory prompts
- Visual design prompts (colored boxes, icons, typography)
- Scrolling reduction prompts
- NotebookLM synthesis prompts
- Implementation prompts (React components, validation)

**When to Use:** Open this, copy-paste prompts into ChatGPT/Claude/Perplexity. Don't write your own.

---

### 4. **INFO-BOX-VISUAL-SPEC.md**
**Purpose:** Exact pixel-perfect spec for the 3 colored boxes your boss requested

**What's Inside:**
- 3 box types: Fast Track Insight (yellow), Science (grey), Warning (black)
- Visual specs (colors, icons, typography, spacing)
- CSS code (copy-paste ready)
- React components (copy-paste ready)
- When to use each box type
- Placement rules (max 2-3 per screen)
- Responsive behavior (mobile vs desktop)
- Content guidelines (tone, length)

**When to Use:** When coding the info boxes. This is your pixel-perfect blueprint.

---

### 5. **COGNITIVE-LOAD-RESEARCH-PLAN.md**
**Purpose:** Comprehensive master plan with all phases

**What's Inside:**
- WOOP framework applied to your research
- 5-phase plan (Targeted Research, Pattern Extraction, Design System, Audit, Prototype)
- Detailed research prompts for every phase
- Timeline (Week 1-3)
- Success metrics
- Resource list

**When to Use:** For deep context. Most of this is already distilled into the other 4 docs.

---

## 🎯 YOUR ANSWER: LAYOUTS, COLORS, BUTTONS, QUESTIONS, SECTIONS, SCROLLING

You asked: *"What i want is to know how to make the layouts, colors, buttons, questions, sections, scrolling, buttons, educational sections and dos and donts for not overloading cognitive load"*

**Here's where to find each answer:**

### ✅ LAYOUTS
**Document:** COGNITIVE-LOAD-PLAYBOOK.md (pages 10-11)
**Answer:**
- Single column (not multi-column)
- Max-width: 720px
- Top-aligned labels (not beside fields)
- Multi-step wizard OR accordion sections (not long scroll)
- 4-5 fields per step max

**Prompts to Run:** 
- Prompt 1B (Notion Information Hierarchy) in COGNITIVE-LOAD-RESEARCH-PROMPTS.md
- Prompt 4A (Progressive Disclosure Patterns)

---

### ✅ COLORS
**Document:** INFO-BOX-VISUAL-SPEC.md (entire document)
**Answer:**
- Fast Track Yellow: `#FFF469` (insights)
- Fast Track Grey: `#B2B2B2` (science)
- Black: `#000000` (warnings, primary buttons)
- White: `#FFFFFF` (backgrounds, secondary buttons)
- Light Grey: `#F8F8F8` (section backgrounds)
- Border Grey: `#E0E0E0` (input borders)
- Red: `#DC2626` (errors)
- Green: `#10B981` (success)

**Usage Rules:**
- Max 3-4 colored boxes per screen
- Use subtle grey backgrounds to separate sections (not borders)
- Black/white is primary, yellow/grey are accents

**Prompts to Run:**
- Prompt 3A (Colored Callout Boxes) in COGNITIVE-LOAD-RESEARCH-PROMPTS.md

---

### ✅ BUTTONS
**Document:** COGNITIVE-LOAD-PLAYBOOK.md (page 11)
**Answer:**
- **Primary:** Black background, white text, 16px padding
- **Secondary:** White background, black border, black text, 12px padding
- **Disabled:** Grey background (#E0E0E0), grey text, 50% opacity
- **Placement:** Sticky footer with "Previous" and "Next"
- **Text:** "Next" (not "Continue"), "Previous" (not "Back")

**Prompts to Run:**
- Prompt Set (Day 3) in PRE-MORTEM-FAILURE-PREVENTION.md

---

### ✅ QUESTIONS/LABELS
**Document:** COGNITIVE-LOAD-PLAYBOOK.md (page 11, Typography Hierarchy)
**Answer:**
- **Label:** Riforma 16-18px, black, sentence case
- **Position:** Above input (not beside)
- **Format:** "What is your wish?" (question format OK)
- **Required indicator:** "(Required)" text, not just *
- **Help text:** 14px grey, below label OR in tooltip (? icon)

**Example:**
```
What is your wish? (Required)
[? tooltip: "A wish is your 5-year dream, not a to-do list"]
[Textarea input]
```

**Prompts to Run:**
- Prompt 3C (Typography Hierarchy) in COGNITIVE-LOAD-RESEARCH-PROMPTS.md

---

### ✅ SECTIONS
**Document:** COGNITIVE-LOAD-PLAYBOOK.md (page 11, Spacing System)
**Answer:**
- **Section Header:** Plaak 24-28px, black, uppercase
- **Section Spacing:** 48-64px between major sections
- **Visual Separation:** Subtle grey background (#F8F8F8), not borders
- **Numbering:** "STEP 1" or "1. WISH" (not both)
- **Max per page:** 1 section visible at a time (multi-step wizard)

**Prompts to Run:**
- Prompt 2E (Information Chunking) in COGNITIVE-LOAD-RESEARCH-PROMPTS.md

---

### ✅ SCROLLING REDUCTION
**Document:** PRE-MORTEM-FAILURE-PREVENTION.md (Day 1 research)
**Answer:**
- **Primary Solution:** Multi-step wizard (show 1 step at a time)
- **Alternative:** Accordion sections (collapsed by default)
- **Progress Bar:** Sticky at top, always visible
- **Target:** <1 page scroll per step
- **Rule:** If user scrolls more than 1 page → break into more steps

**Implementation:**
- WOOP tool: 4 steps (W, O, O, P) instead of 1 long page
- Each step: 5-7 fields max
- Progress: "Step 2 of 4" or "50% Complete"

**Prompts to Run:**
- Prompt Set 3 (Scrolling Reduction) in COGNITIVE-LOAD-RESEARCH-PROMPTS.md

---

### ✅ EDUCATIONAL SECTIONS (Info Boxes)
**Document:** INFO-BOX-VISUAL-SPEC.md (entire document)
**Answer:**
- **3 types:** Fast Track Insight (yellow), Science (grey), Warning (black)
- **Max per screen:** 3-4 total (2 yellow, 1-2 grey, 1 black)
- **Placement:** Inline, above related field (not sidebar)
- **Length:** 1-2 sentences (30-50 words)
- **Collapsible:** Science boxes can be collapsible on mobile

**Visual Specs:**
- Yellow box: #FFF469 background, black F icon, 24x24px
- Grey box: #B2B2B2 background, black beaker icon, 24x24px
- Black box: #000000 background, yellow left border, yellow ! icon

**React Components:** Ready to copy-paste from INFO-BOX-VISUAL-SPEC.md

---

### ✅ DOS AND DON'TS
**Document:** COGNITIVE-LOAD-PLAYBOOK.md (page 12, Anti-Patterns table)

| ❌ DON'T | ✅ DO |
|----------|-------|
| Long scroll pages (3-5 pages) | Multi-step wizard (4-6 steps) |
| Wall of text instructions | Just-in-time tooltips |
| Multi-column forms | Single column layout |
| Generic examples (Airbnb) | Industry-specific examples |
| 60-min video first | 30-sec embedded clips |
| Two-column forms | Single column, top-aligned labels |
| No validation until submit | Inline validation on blur |
| No progress indicator | Sticky progress bar |
| Show all 25 fields at once | Show 4-5 fields at a time |
| Vague labels ("Owner") | Specific labels ("Who owns this? (First Last Name)") |

---

## 🚀 YOUR 3-WEEK EXECUTION PLAN

### Week 1: Research & Design

**Monday (Day 1) - Layout Research (2 hours)**
- [ ] Run Prompt 2 (layout rules) in ChatGPT
- [ ] Visit Typeform, Linear, Notion (screenshot forms)
- [ ] Write notes in ONE Google Doc
- [ ] STOP (don't research more)

**Tuesday (Day 2) - Color & Visual Research (2 hours)**
- [ ] Run Prompt 3A (colored boxes) in Claude
- [ ] Google "SaaS info box examples" (save 3-5 images)
- [ ] Write notes in Google Doc
- [ ] STOP

**Wednesday (Day 3) - Button & Action Research (1 hour)**
- [ ] Google "primary secondary button design 2024"
- [ ] Screenshot Linear, Notion buttons
- [ ] Write notes in Google Doc
- [ ] STOP (research phase DONE)

**Thursday (Day 4) - Synthesize (2 hours)**
- [ ] Read all notes from Day 1-3
- [ ] Add findings to COGNITIVE-LOAD-PLAYBOOK.md
- [ ] Print playbook or pin to monitor

**Friday (Day 5) - Design Mockups (3 hours)**
- [ ] Open Figma or PowerPoint
- [ ] Create 4 screens for WOOP redesign (W, O, O, P)
- [ ] Show to boss, get feedback
- [ ] Iterate

---

### Week 2: Code in Sandbox

**Monday-Wednesday - Build Components**
- [ ] Create sandbox: `frontend/tools-redesign-sandbox/00-woop-v2.html`
- [ ] Code 4-step wizard component
- [ ] Code 3 info box components (yellow, grey, black)
- [ ] Test locally (all functionality works)

**Thursday-Friday - Integrate & Test**
- [ ] Add info boxes to each step (max 3 per step)
- [ ] Add inline validation (green/red borders)
- [ ] Test PDF export, Supabase save
- [ ] Test on mobile

---

### Week 3: Test & Deploy

**Monday-Wednesday - Client Testing**
- [ ] Send sandbox link to 2-3 friendly clients
- [ ] Watch them use it (screen share)
- [ ] Collect feedback
- [ ] Iterate based on feedback

**Thursday - Get Approval**
- [ ] Show final version to boss
- [ ] Get explicit "YES, deploy this"

**Friday - Deploy**
- [ ] Deploy ONLY 00-woop.html (not all 31 tools)
- [ ] Monitor for issues (24 hours)
- [ ] CELEBRATE 🎉

---

## 🎯 THE 3 MOST IMPORTANT PROMPTS (Start Here)

If you only run 3 prompts, run these:

### 1. Layout & Structure (ChatGPT)
```
I need SPECIFIC layout and styling rules to reduce cognitive load in web forms.

Provide:
1. LAYOUT: Single column vs multi-column (when to use which?)
2. SPACING: Exact pixel/rem values for field spacing, section spacing
3. TYPOGRAPHY: Font sizes for labels, inputs, help text
4. COLORS: When to use backgrounds to separate sections
5. WIDTH: Max-width for form containers on large screens
6. SCROLLING: Accordion vs. tabs vs. wizard (pros/cons for 20+ fields)

Give me a checklist I can copy-paste and apply to my HTML/CSS today.

Context: I have 31 HTML tools, currently single long-scroll pages with 20-30 input fields each. Users complain about too much scrolling.
```

### 2. Colored Info Boxes (Claude)
```
Research best practices for colored callout boxes (tips, warnings, insights) in professional tools.

Provide:
1. When to use boxes vs. inline text vs. icons
2. Color psychology for professional contexts (what colors signal what?)
3. Maximum number of box types before it becomes visual noise (3? 5? 7?)
4. Placement rules (inline vs. sidebar vs. modal)
5. Typography inside boxes (sizing, weight, spacing)
6. 10 examples from enterprise tools showing effective use of callouts

Context: We're adding 3 box types:
- Yellow box (methodology insights)
- Grey box (science/evidence)
- Black box with yellow accent (warnings/errors)

Validate this approach or suggest improvements.
```

### 3. Real Examples (Perplexity)
```
Find 5 real examples of B2B SaaS tools with excellent form UX (low cognitive load).

For each, provide:
1. Tool name (e.g., Typeform, Airtable, Notion)
2. Screenshot link or detailed description
3. 3 specific techniques they use (progressive disclosure, inline validation, etc.)
4. Why it works (cognitive load principle)

Focus on tools that handle complex data input (not simple contact forms).
```

**After running these 3, you'll have 90% of what you need.**

---

## ✅ SUCCESS CHECKLIST

### You'll Know You're Done When:

**Research Phase ✅**
- [ ] You have EXACTLY 10 sources (no more)
- [ ] All sources passed 4-test validation
- [ ] You have a 1-page playbook with specific rules
- [ ] Total research time: <10 hours
- [ ] You STOPPED researching (didn't fall into information rabbit hole)

**Design Phase ✅**
- [ ] You have mockups for 4 steps of WOOP tool
- [ ] Boss approved the mockups
- [ ] You haven't touched production code
- [ ] All mockups use Fast Track colors/fonts

**Coding Phase ✅**
- [ ] Sandbox file exists: `00-woop-v2.html`
- [ ] Multi-step wizard works (4 steps)
- [ ] 3 info box types work (yellow, grey, black)
- [ ] Inline validation works (green/red)
- [ ] PDF export still works
- [ ] Supabase save still works
- [ ] No changes to production tools

**Deployment Phase ✅**
- [ ] Boss said "yes, deploy"
- [ ] Deployed ONLY 1 tool (WOOP)
- [ ] No bugs in first 48 hours
- [ ] Clients complete tool 30% faster (measured)
- [ ] Guru confusion questions reduced 60% (tracked)

---

## 🆘 WHEN YOU'RE STUCK

### If You're Overwhelmed
→ Re-read **PRE-MORTEM-FAILURE-PREVENTION.md** (especially "When in doubt, do LESS")

### If You Don't Know What to Research
→ Use the 3 prompts above. Don't write your own.

### If You're Breaking Production
→ STOP. Work only in `tools-redesign-sandbox/`

### If You Have Too Many Sources
→ Delete everything except the 10 on the approved list

### If You're Not Sure What to Code
→ Look at INFO-BOX-VISUAL-SPEC.md, copy the React components

### If Boss Hasn't Approved
→ DON'T deploy. Show mockups first.

### If You Want to Fix All 31 Tools
→ DON'T. Finish WOOP first. Then Tool #2.

---

## 📞 QUICK REFERENCE

**File Locations:**
- Pre-mortem (failure prevention): `docs/fast-track-specs/PRE-MORTEM-FAILURE-PREVENTION.md`
- Playbook (quick reference): `docs/fast-track-specs/COGNITIVE-LOAD-PLAYBOOK.md`
- Prompts (copy-paste): `docs/prompts/COGNITIVE-LOAD-RESEARCH-PROMPTS.md`
- Info boxes (specs): `docs/fast-track-specs/INFO-BOX-VISUAL-SPEC.md`
- Master plan (context): `docs/fast-track-specs/COGNITIVE-LOAD-RESEARCH-PLAN.md`

**Sandbox Location:**
- Create here: `frontend/tools-redesign-sandbox/`
- First file: `00-woop-v2.html`

**Your Current Tool:**
- Production: `frontend/tools/module-0-intro-sprint/00-woop.html` (DON'T TOUCH)
- Redesign: `frontend/tools-redesign-sandbox/00-woop-v2.html` (WORK HERE)

---

## 🎯 YOUR NEXT ACTION

**Right now, do this:**

1. ✅ Read **PRE-MORTEM-FAILURE-PREVENTION.md** (10 minutes)
2. ✅ Pin **COGNITIVE-LOAD-PLAYBOOK.md** to your monitor
3. ✅ Open **COGNITIVE-LOAD-RESEARCH-PROMPTS.md** in a browser tab
4. ✅ Run the 3 prompts above in ChatGPT/Claude/Perplexity
5. ✅ Create ONE Google Doc for all your notes
6. ✅ Set a timer for 2 hours. When it goes off, STOP researching.

**Monday (Day 1) starts with research. You have everything you need.**

---

## 💪 CONFIDENCE BOOST

**You asked for:**
- Crystal clarity on cognitive load ✅ (Playbook has the principles)
- How to apply it to your tools ✅ (Exact specs for layouts, colors, buttons, etc.)
- Info on layouts, colors, buttons, questions, sections, scrolling ✅ (All documented)
- Educational sections (info boxes) ✅ (Pixel-perfect specs + code)
- Dos and don'ts ✅ (Anti-patterns table in Playbook)
- How to avoid getting lost ✅ (Pre-mortem document prevents all failure modes)
- Specific use case ✅ (Focused on your 31 HTML tools, B2B context)
- Narrowed down scope ✅ (WOOP tool only, 8 research areas, 3 weeks)

**You have it all. Now execute.**

---

**Status:** Ready to Execute  
**Owner:** You  
**Timeline:** 3 weeks  
**Next Action:** Read PRE-MORTEM-FAILURE-PREVENTION.md  
**Support:** Your boss (show progress every Friday)

**You've got this. Go crush it. 🚀**
