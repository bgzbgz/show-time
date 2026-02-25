# PRE-MORTEM: Cognitive Load Research
## Failure Prevention Plan

**Date:** 2026-02-17  
**Purpose:** Prevent disaster scenarios and ensure focused, actionable research

---

## 🚨 WORST CASE SCENARIOS & PREVENTION

### Failure Mode 1: "I GET LOST IN INFORMATION"

#### What Happens
- You collect 50+ articles, videos, academic papers
- Too much to process, analysis paralysis
- Can't extract what's actually useful
- Research takes weeks instead of days

#### PREVENTION STRATEGY
✅ **Strict Information Diet**
- **ONLY 10 SOURCES MAX** (that's it, no more)
- **Time Box:** 2 days of research, then STOP
- **One Note Doc:** Everything goes into ONE Google Doc (not scattered files)
- **Filter Question:** Before saving anything, ask "Does this tell me EXACTLY what to change in my HTML tools?" If no → delete

✅ **Pre-Approved Source List** (Pick ONLY from here)
1. Nielsen Norman Group: "Minimize Cognitive Load" article
2. Typeform blog: How they design forms
3. Laws of UX website: Miller's Law + Hick's Law pages
4. Baymard Institute: Form design guidelines
5. One YouTube video: "Cognitive Load in UX" (max 20 min)
6. Linear's design philosophy blog post
7. Notion's design system docs
8. One academic summary: Sweller's CLT (Wikipedia is fine)
9. Smashing Magazine: "Designing for Cognitive Load"
10. Your own friction report (already have it)

**If you're tempted to add an 11th source → STOP. You have enough.**

---

### Failure Mode 2: "I COMPLETELY MESS UP THE CURRENT TOOLS"

#### What Happens
- You start redesigning tools directly in production
- Break functionality (PDF export, Supabase saves, validation)
- Tools stop working for clients mid-sprint
- Panic, rollback, lost work

#### PREVENTION STRATEGY
✅ **CREATE SANDBOX ENVIRONMENT**

**STEP 1: Create a Safe Testing Area**
```bash
# In your project root
mkdir frontend/tools-redesign-sandbox
cp frontend/tools/module-0-intro-sprint/00-woop.html frontend/tools-redesign-sandbox/00-woop-v2.html
```

**STEP 2: Work ONLY in Sandbox**
- **RULE:** Never touch files in `frontend/tools/` directly
- All redesign work happens in `frontend/tools-redesign-sandbox/`
- Original tools stay 100% untouched

**STEP 3: Version Control Safety**
```bash
# Before starting ANY work
git checkout -b redesign-cognitive-load
git add .
git commit -m "Backup before cognitive load redesign"
```

**STEP 4: Test Checklist Before Moving to Production**
- [ ] PDF export still works?
- [ ] Supabase save still works?
- [ ] All validation rules still work?
- [ ] Tested on Chrome, Firefox, Safari?
- [ ] Tested on mobile screen?
- [ ] Boss approved the changes?

**ONLY THEN:** Copy from sandbox to production

---

### Failure Mode 3: "I MIX DEPLOYMENTS AND EVERYTHING GOES TO SHIT"

#### What Happens
- You deploy redesigned tools to live site too early
- Clients see broken/half-finished tools
- Backend breaks, database issues
- Railway deployment fails, site goes down

#### PREVENTION STRATEGY
✅ **DEPLOYMENT FREEZE**

**RULE #1: NO DEPLOYMENTS DURING RESEARCH PHASE**
- Research phase = 1-2 weeks = ZERO deployments
- Put a sticky note on your monitor: "NO DEPLOY UNTIL APPROVED"

**RULE #2: LOCAL TESTING ONLY**
```bash
# Work locally ONLY
cd frontend
# Open files directly in browser (file://) OR use local server:
npx serve .
# Access at http://localhost:3000
```

**RULE #3: When Ready to Deploy (Week 3+)**
1. Show redesign to boss (in sandbox, locally)
2. Get explicit approval: "Yes, deploy this"
3. Deploy ONLY the redesigned sandbox file
4. Test on staging first (if you have one)
5. Monitor for 24 hours before deploying more

**Deployment Checklist:**
- [ ] Boss approved?
- [ ] Tested locally for 1 week?
- [ ] Tested with 2-3 friendly clients?
- [ ] No breaking changes to database?
- [ ] Backup of current production taken?
- [ ] Ready to rollback if needed?

---

### Failure Mode 4: "I DON'T COLLECT THE RIGHT SOURCES"

#### What Happens
- You collect academic papers (too theoretical)
- Or consumer app examples (not applicable to B2B)
- Or outdated sources (2015 UX blogs)
- Research doesn't apply to your specific use case

#### PREVENTION STRATEGY
✅ **SOURCE VALIDATION CHECKLIST**

**Before saving ANY source, it must pass ALL 4 tests:**

1. **Recency Test:** Published 2020 or later? (YES/NO)
2. **Relevance Test:** About forms, wizards, or B2B tools? (YES/NO)
3. **Actionability Test:** Contains specific UI patterns (not just theory)? (YES/NO)
4. **Example Test:** Shows real screenshots or code examples? (YES/NO)

**If ANY answer is NO → Don't use that source**

✅ **Pre-Filtered Search Queries** (Copy-paste these EXACTLY)

**For Perplexity/ChatGPT:**
```
"cognitive load" AND "form design" AND "UX" site:nngroup.com OR site:smashingmagazine.com 2020..2026
```

```
"progressive disclosure" AND "multi-step forms" AND "B2B" 2022..2026
```

```
"reduce scrolling" AND "web forms" AND "SaaS tools" examples
```

**For YouTube:**
```
"cognitive load UX design" forms wizard 2020..2026
```
(Then filter: Sort by Relevance, Duration: 10-20 minutes)

---

### Failure Mode 5: "I DON'T PROMPT THE CHATS CORRECTLY"

#### What Happens
- You ask vague questions: "How to reduce cognitive load?"
- Get generic answers: "Use whitespace, make it simple"
- Can't apply to your specific tools
- Waste time going back and forth

#### PREVENTION STRATEGY
✅ **USE ONLY THESE PRE-TESTED PROMPTS**

**I've already written them for you in `COGNITIVE-LOAD-RESEARCH-PROMPTS.md`**

**Your job: Copy-paste EXACTLY, don't modify**

**START WITH THESE 3 (IN THIS ORDER):**

**PROMPT 1 (ChatGPT):**
```
I'm redesigning B2B decision-making tools that currently have high cognitive load (too much scrolling, visual clutter, unclear next steps).

Analyze Typeform's UX patterns and extract 5-7 specific techniques they use to reduce cognitive load in multi-step forms. For each pattern:
1. Name the pattern
2. Describe how it works (with UI details)
3. Explain the cognitive load principle it addresses
4. Provide an example of how it could apply to a business strategy tool (not just forms)

Focus on: progressive disclosure, visual hierarchy, information chunking, help systems, and error prevention.
```

**PROMPT 2 (Claude/ChatGPT):**
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

**PROMPT 3 (Perplexity):**
```
Find 5 real examples of B2B SaaS tools with excellent form UX (low cognitive load).

For each, provide:
1. Tool name (e.g., Typeform, Airtable, Notion)
2. Screenshot link or detailed description
3. 3 specific techniques they use (progressive disclosure, inline validation, etc.)
4. Why it works (cognitive load principle)

Focus on tools that handle complex data input (not simple contact forms).
```

**STOP AFTER THESE 3** → You'll have everything you need

---

### Failure Mode 6: "I DON'T HAVE A SPECIFIED USE CASE"

#### What Happens
- You research "cognitive load in general"
- Get advice for e-commerce, games, education apps
- Can't translate to your business strategy tools
- Advice doesn't fit Fast Track brand or methodology

#### PREVENTION STRATEGY
✅ **LOCK IN YOUR USE CASE (Write This Down)**

**MY SPECIFIC USE CASE:**
- **What:** 31 HTML/React web forms for business strategy workshops
- **Users:** CEOs, founders, executives (time-starved, impatient)
- **Current Problem:** Too much scrolling (3-5 pages), visual clutter, unclear next steps
- **Tools:** HTML/React (Babel standalone), Tailwind CSS, Supabase backend
- **Constraints:** Must maintain Fast Track brand (black/white/yellow, Plaak/Riforma fonts)
- **Fields:** 20-30 input fields per tool (text, textarea, dropdowns, radio buttons)
- **Goal:** Reduce scrolling by 50%, reduce completion time by 30%

**When researching, ALWAYS add this context to your prompts:**
"Context: B2B strategic planning tools for executives, not consumer apps"

---

### Failure Mode 7: "I DON'T NARROW IT DOWN"

#### What Happens
- You try to fix everything at once
- Get overwhelmed by 31 tools × 10 issues each = 310 things to fix
- Never start because it's too big
- Or start everywhere, finish nowhere

#### PREVENTION STRATEGY
✅ **THE ONE TOOL RULE**

**RULE:** You will redesign EXACTLY ONE TOOL in Week 1-2. That's it.

**The Tool:** `00-woop.html` (Wish, Outcome, Obstacle, Plan)
- **Why this one?** It's Module 0 (intro), so all clients use it first
- **High impact:** If this is great, it sets tone for all other tools
- **Manageable:** 4 sections (W, O, O, P) = perfect for multi-step wizard

**IGNORE the other 30 tools for now**

✅ **THE ONE ISSUE RULE**

**You will fix EXACTLY ONE ISSUE at a time:**

**Week 1:**
- **ONLY:** Reduce scrolling (convert long page → 4-step wizard)
- Ignore: colors, fonts, validation, help text, everything else

**Week 2:**
- **ONLY:** Add 3 info box types (Fast Track yellow, Science grey, Warning black)
- Ignore: everything else

**Week 3:**
- **ONLY:** Add inline validation (green checkmarks, red errors)
- Ignore: everything else

**Week 4:**
- Test, iterate, get approval
- THEN consider Tool #2

**No multitasking. One tool, one issue, one week.**

---

## 🎯 YOUR CRYSTAL CLEAR SCOPE

### EXACTLY What You're Researching

**YOU WANT TO KNOW (AND ONLY THIS):**

#### 1. LAYOUT PATTERNS
- [ ] Multi-step wizard (stepper) vs. accordion vs. tabs (which for 4-6 sections?)
- [ ] Single column vs. multi-column (which for forms?)
- [ ] Max-width for form container (720px? 960px?)
- [ ] Spacing between fields (16px? 24px? 32px?)
- [ ] Spacing between sections (48px? 64px?)

#### 2. COLOR USAGE
- [ ] When to use background colors to separate sections
- [ ] Which colors signal what (grey for optional, white for required?)
- [ ] How many colors before it's overwhelming (3? 5?)

#### 3. BUTTON DESIGN
- [ ] Primary vs. secondary button styles (fill vs. outline?)
- [ ] Button placement (sticky footer? after each section?)
- [ ] Button text ("Next" vs. "Continue" vs. "Save & Next")
- [ ] Disabled state styling (how to show it's not clickable yet?)

#### 4. QUESTION/LABEL DESIGN
- [ ] Label above field vs. beside field (which reduces cognitive load?)
- [ ] Label text: "Wish" vs. "What is your wish?" (short vs. question format?)
- [ ] Required field indicator (* or "Required" text?)
- [ ] Help text placement (below label? below input? popover?)

#### 5. SECTION DESIGN
- [ ] Visual separation (border? background? whitespace only?)
- [ ] Section headers (size, weight, spacing)
- [ ] Numbering (1, 2, 3 or Step 1, Step 2?)

#### 6. SCROLLING REDUCTION
- [ ] Accordion pattern (collapsed by default or expanded?)
- [ ] Step-by-step wizard (show only 1 step at a time?)
- [ ] Sticky progress bar (always visible at top?)

#### 7. EDUCATIONAL CONTENT (Info Boxes)
- [ ] Box placement (inline with questions or in sidebar?)
- [ ] Max number of boxes per page (2? 3?)
- [ ] Collapsible or always visible?
- [ ] Icon + text or text only?

#### 8. DOS AND DON'TS
- [ ] Do: Show 4-5 fields at once (not 20)
- [ ] Don't: Multi-column forms (use single column)
- [ ] Do: Validate on blur (instant feedback)
- [ ] Don't: Wait until submit to show errors
- [ ] Do: Pre-fill when possible
- [ ] Don't: Leave all fields blank
- [ ] Do: Progress bar (show completion %)
- [ ] Don't: Hide progress (user doesn't know how far along)

**THAT'S IT. This is your entire scope. Nothing else.**

---

## 📋 YOUR STEP-BY-STEP ACTION PLAN

### Day 1 (Monday) - Research ONLY Layout & Structure

**TIME BUDGET: 2 hours**

**Action 1:** Run Prompt 2 (layout rules) in ChatGPT
**Action 2:** Visit Typeform.com, create a free form, screenshot each step
**Action 3:** Visit Linear.app, Notion.com, screenshot their form layouts
**Action 4:** Write down in ONE Google Doc:
- "Multi-step wizard: Show 1 step at a time, progress bar at top"
- "Single column: Labels above fields"
- "Max-width: 720px"
- "Spacing: 24px between fields, 48px between sections"

**STOP. Close all tabs. You're done for the day.**

---

### Day 2 (Tuesday) - Research ONLY Color & Visual Separation

**TIME BUDGET: 2 hours**

**Action 1:** Run Prompt 3A (colored callout boxes) in Claude
**Action 2:** Google "SaaS info box examples", save 3-5 images
**Action 3:** Open your friction report, find the info box recommendation
**Action 4:** Write down in your Google Doc:
- "Fast Track box: #FFF469 yellow, black F icon, 24px left"
- "Science box: #B2B2B2 grey, black beaker icon"
- "Warning box: Black background, yellow left border"
- "Max 2 boxes per screen"

**STOP. Close all tabs. You're done for the day.**

---

### Day 3 (Wednesday) - Research ONLY Buttons & Actions

**TIME BUDGET: 1 hour**

**Action 1:** Google "primary secondary button design 2024"
**Action 2:** Check Linear, Notion, Airtable button styles (screenshot)
**Action 3:** Write down in your Google Doc:
- "Primary button: Black background, white text, 16px padding"
- "Secondary button: White background, black border, black text"
- "Placement: Sticky footer with Previous/Next"
- "Disabled: Grey background, grey text, 50% opacity"

**STOP. You're done researching.**

---

### Day 4 (Thursday) - Synthesize & Create Playbook

**TIME BUDGET: 2 hours**

**Action 1:** Read your Google Doc (all notes from Day 1-3)
**Action 2:** Open `COGNITIVE-LOAD-PLAYBOOK.md` (I already created it)
**Action 3:** Add your findings to the playbook under each section
**Action 4:** Print it or pin to your monitor

**STOP. Research phase is OVER.**

---

### Day 5 (Friday) - Design Mockup (No Code Yet)

**TIME BUDGET: 3 hours**

**Action 1:** Open Figma or PowerPoint
**Action 2:** Create 4 screens showing WOOP tool redesign:
- Screen 1: Wish (Step 1 of 4)
- Screen 2: Outcome (Step 2 of 4)
- Screen 3: Obstacle (Step 3 of 4)
- Screen 4: Plan (Step 4 of 4)

**Action 3:** Show to boss, get feedback
**Action 4:** Iterate based on feedback

**STOP. No coding yet. Week 1 is done.**

---

### Week 2 (Monday-Friday) - Code the Redesign in SANDBOX

**TIME BUDGET: Full week**

**Action 1:** Create sandbox file (see Failure Mode 2)
**Action 2:** Code the 4-step wizard in `00-woop-v2.html`
**Action 3:** Add the 3 info box types
**Action 4:** Add inline validation
**Action 5:** Test locally (PDF export, Supabase save)

**STOP. Do NOT deploy. Week 2 is done.**

---

### Week 3 (Monday-Wednesday) - Test with Clients

**Action 1:** Send sandbox link to 2-3 friendly clients
**Action 2:** Watch them use it (screen share or record)
**Action 3:** Collect feedback
**Action 4:** Iterate

---

### Week 3 (Thursday-Friday) - Get Approval & Deploy

**Action 1:** Show final version to boss
**Action 2:** Get explicit "YES, deploy this"
**Action 3:** Deploy ONLY this one tool
**Action 4:** Monitor for issues

**CELEBRATION: You redesigned 1 tool successfully!**

---

### Week 4+ - Repeat for Remaining 30 Tools

**NOW you have a proven process. Repeat for tools 2-31.**

---

## ✅ SUCCESS CRITERIA (How You Know You've Succeeded)

### Research Phase Success
- [ ] You have EXACTLY 10 sources (not 50)
- [ ] All sources pass the 4-test validation
- [ ] You have a 1-page playbook with specific rules (px, colors, patterns)
- [ ] You can explain each rule in one sentence
- [ ] Total research time: <10 hours (not 40 hours)

### Design Phase Success
- [ ] You have mockups for 4 screens (Figma/PowerPoint)
- [ ] Boss approved the mockups
- [ ] You haven't touched production code yet
- [ ] All mockups use Fast Track brand colors/fonts

### Coding Phase Success
- [ ] Sandbox file works (test all features)
- [ ] No changes to production tools yet
- [ ] Git backup exists (can rollback)
- [ ] 2-3 clients tested it and gave feedback

### Deployment Phase Success
- [ ] Boss said "yes, deploy"
- [ ] Deployed ONLY 1 tool (not all 31)
- [ ] No bugs reported in first 48 hours
- [ ] Clients complete tool 30% faster (measured)

---

## 🚨 EMERGENCY STOPS (When to PAUSE)

**STOP immediately if:**
- You've collected more than 10 sources → Delete extras
- You're on Day 4 and still researching → Move to synthesis
- You're editing production tools → Switch to sandbox
- You're trying to fix multiple tools at once → Focus on WOOP only
- You're overwhelmed → Re-read this document, narrow scope
- Boss hasn't approved mockups → Don't start coding

---

## 📞 DECISION FLOWCHART

**"Should I use this source?"**
→ Does it pass all 4 validation tests? YES → Save it | NO → Delete it

**"Should I research this topic?"**
→ Is it in the 8 scope items (layout, color, buttons, questions, sections, scrolling, educational content, dos/donts)? YES → Research it | NO → Ignore it

**"Should I code this feature?"**
→ Did boss approve the mockup? YES → Code in sandbox | NO → Go back to mockup

**"Should I deploy this?"**
→ Did boss say "yes, deploy"? YES → Deploy 1 tool only | NO → Keep testing locally

**"Should I work on Tool #2?"**
→ Is Tool #1 deployed and working? YES → Start Tool #2 | NO → Finish Tool #1 first

---

## 🎯 YOUR CHEAT SHEET (Print This)

### THE ONLY 3 PROMPTS YOU NEED

1. **Layout Prompt** (Day 1)
2. **Color/Visual Prompt** (Day 2)
3. **Examples Prompt** (Day 3)

(Already written in `COGNITIVE-LOAD-RESEARCH-PROMPTS.md`)

### THE ONLY 8 THINGS YOU'RE RESEARCHING

1. Layout patterns
2. Color usage
3. Button design
4. Question/label design
5. Section design
6. Scrolling reduction
7. Educational content (info boxes)
8. Dos and don'ts

### THE ONLY 1 TOOL YOU'RE FIXING

- `00-woop.html` → `00-woop-v2.html` (in sandbox)

### THE ONLY 3 WEEKS YOU NEED

- Week 1: Research + Design mockups
- Week 2: Code in sandbox
- Week 3: Test + Deploy

---

**THE MOST IMPORTANT RULE:**

**When in doubt, do LESS, not more.**
- Fewer sources = clearer insights
- Fewer tools to fix = actually finish
- Fewer features = ship faster
- Fewer weeks = stay focused

You don't need to be perfect. You need to be DONE.

---

**Next Action:** Read this document again. Then start Day 1 (Monday).

**Owner:** You  
**Accountability Buddy:** Your boss (show progress every Friday)  
**Safety Net:** This document (read it when overwhelmed)

**YOU'VE GOT THIS. Now go execute.**
