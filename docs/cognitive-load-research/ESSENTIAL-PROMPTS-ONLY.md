# Cognitive Load Research - ESSENTIAL PROMPTS ONLY
## 3 Prompts. That's It.

**Purpose:** Get everything you need with minimal copy-pasting  
**Time:** 1 hour total  
**Result:** Complete research foundation

---

## 🎯 THE ONLY 3 PROMPTS YOU NEED

Run these in order. Save all responses in ONE Google Doc. Then you're done researching.

---

## PROMPT 1: GET THE RULES (ChatGPT or Claude)
**Time:** 20 minutes | **What it gives you:** Exact specifications

```
I'm redesigning B2B strategy tools (31 HTML/React forms) that currently have too much scrolling and cognitive load.

Give me SPECIFIC, ACTIONABLE rules I can apply TODAY:

1. LAYOUT STRUCTURE
   - Single column or multi-column for 20-30 field forms?
   - Max-width for form containers (exact px value)
   - Multi-step wizard vs. accordion sections vs. single page (pros/cons)
   - How many fields to show at once before it's overwhelming?

2. SPACING & SIZING
   - Exact spacing between fields (px or rem)
   - Exact spacing between sections
   - Font sizes: page title, section header, field label, input text, help text
   - Padding inside input fields

3. INFO BOXES (Tips, Warnings, Science)
   - How many colored callout boxes per screen before it's too much? (2? 3? 5?)
   - Placement: inline with content or sidebar?
   - Should they be collapsible or always visible?
   - Icon + text or text only?

4. BUTTONS
   - Primary vs secondary button styling (fill vs outline?)
   - Placement (after each section? sticky footer? both?)
   - Disabled state styling (how to show it clearly?)

5. PROGRESS INDICATION
   - Progress bar, step numbers, or both?
   - Always visible (sticky) or scrolls away?
   - How to show: "Step 2 of 4" vs "50%" vs dots?

6. VALIDATION & FEEDBACK
   - When to validate: on blur, on change, or on submit?
   - How to show errors: border color change, icon, message below, or all 3?
   - Success state necessary or just neutral → error states?

Give me a checklist format I can print and reference while coding.

Context:
- Users: CEOs, time-starved executives
- Current problem: Tools require 3-5 pages of scrolling, users complain
- Tech stack: HTML/React, Tailwind CSS
- Brand: Black/white primary, yellow accent, bold and direct (not soft/corporate)
```

**What to do with the response:**
- Copy the entire response into your Google Doc under "RULES CHECKLIST"
- Highlight the specific numbers (px values, max fields per screen, etc.)
- This is your design system. Reference it constantly.

---

## PROMPT 2: GET REAL EXAMPLES (Perplexity or ChatGPT with web search)
**Time:** 20 minutes | **What it gives you:** Proof + inspiration

```
Find 5 B2B tools with excellent form UX (low cognitive load, minimal scrolling).

For EACH tool, provide:
1. Tool name (and URL if possible)
2. Screenshot description or detailed visual description
3. What makes it low cognitive load (3-4 specific techniques they use)
4. One thing I can steal for my business strategy tools

Requirements:
- Must be B2B/professional tools (not consumer apps like Instagram)
- Must handle complex data input (not simple contact forms)
- Must be known for good UX (like Typeform, Linear, Notion, Airtable, etc.)

Then answer:
- What's the #1 pattern ALL of them use?
- What's the biggest mistake none of them make?
```

**What to do with the response:**
- Copy into Google Doc under "EXAMPLES TO STEAL FROM"
- Screenshot the tools mentioned (visit their sites, create free accounts)
- Look for the common patterns across all 5
- Pick 2-3 techniques to implement in WOOP tool

---

## PROMPT 3: VALIDATE YOUR APPROACH (Claude or ChatGPT)
**Time:** 20 minutes | **What it gives you:** Confidence + course correction

```
I'm adding 3 types of colored info boxes to my business strategy tools to reduce cognitive load:

1. YELLOW BOX (#FFF469 background, black F icon)
   - Purpose: Fast Track methodology insights, 80/20 principles
   - Example: "This is the 20% that drives 80% of results"

2. GREY BOX (#B2B2B2 background, black science icon)
   - Purpose: Research evidence, credibility builders
   - Example: "Studies show WOOP increases goal achievement by 30%"

3. BLACK BOX (black background, yellow left border, yellow ! icon)
   - Purpose: Common mistakes, warnings, critical decisions
   - Example: "Don't list departments. List what they DO."

My plan:
- Max 3-4 boxes total per screen (2 yellow, 1-2 grey, 1 black)
- Place inline (above related fields), not in sidebar
- Make grey boxes collapsible on mobile
- 1-2 sentences each (30-50 words max)

Questions:
1. Is 3-4 boxes per screen too many? What's the research say?
2. Should boxes be collapsible by default or always visible?
3. Any cognitive load principles I'm violating with this approach?
4. What would make this better?

Context: Current tools have long PDF guides users skip, then get confused. These boxes replace those PDFs with just-in-time help.
```

**What to do with the response:**
- Copy into Google Doc under "BOX VALIDATION"
- If they suggest changes, update your specs
- If they confirm approach is good, proceed with confidence
- Note any warnings about cognitive overload

---

## ✅ AFTER RUNNING THESE 3 PROMPTS

You'll have in your Google Doc:

1. **RULES CHECKLIST** - Exact specs (spacing, sizing, layout decisions)
2. **EXAMPLES TO STEAL FROM** - 5 real tools with screenshots + techniques
3. **BOX VALIDATION** - Confidence your info box approach is solid

**STOP RESEARCHING.** You have everything you need.

---

## 📋 NEXT STEPS (After Prompts)

### Step 1: Synthesize (30 minutes)
- Read your Google Doc
- Create a 1-page summary with key numbers:
  - Max-width: [X]px
  - Field spacing: [X]px
  - Fields per screen: [X]
  - Boxes per screen: [X]
  - Multi-step wizard: [Yes/No]

### Step 2: Design Mockup (3 hours)
- Open Figma or PowerPoint
- Create 4 screens for WOOP tool
- Apply the rules from your checklist
- Use examples from real tools as inspiration

### Step 3: Show Boss (30 minutes)
- Walk through mockups
- Get approval before coding
- Iterate if needed

### Step 4: Code in Sandbox (Week 2)
- Create `frontend/tools-redesign-sandbox/00-woop-v2.html`
- Build it according to approved mockups
- Test everything works (PDF, Supabase, validation)

---

## 🚨 IMPORTANT RULES

1. **Run ONLY these 3 prompts** - Don't add more. Don't "research further."
2. **One Google Doc** - All responses in one place, not scattered
3. **Time box to 1 hour** - Set a timer. When it goes off, STOP.
4. **If you want to run another prompt** - Re-read this document first. You probably don't need it.

---

## 💡 OPTIONAL: If You Need Deeper Dive (But You Probably Don't)

**Only run these IF the 3 main prompts didn't answer something specific:**

### Optional 4: Typography Deep Dive
```
Give me a typography scale for web forms:
- Page title, section header, field label, input text, help text, validation message
- Include: font size (px), weight, line-height, color
- For both desktop and mobile

Make it accessible (WCAG AA) and optimized for scanning/readability.
```

### Optional 5: Mobile Responsive Rules
```
How should I adapt 20-30 field forms for mobile without destroying UX?

Specifically:
- Font sizes (shrink labels or keep large?)
- Spacing (tighter or same as desktop?)
- Buttons (full-width or not?)
- Multi-step wizard: better on mobile than long scroll?
- Info boxes: auto-collapse or always visible?
```

**But seriously, you probably don't need these. The main 3 cover 95% of what you need.**

---

## 🎯 YOUR ACTION PLAN (Right Now)

1. ✅ Open ChatGPT
2. ✅ Copy PROMPT 1, paste, run
3. ✅ Save response in Google Doc
4. ✅ Open Perplexity
5. ✅ Copy PROMPT 2, paste, run
6. ✅ Save response in Google Doc
7. ✅ Open Claude
8. ✅ Copy PROMPT 3, paste, run
9. ✅ Save response in Google Doc
10. ✅ Close all AI chat windows
11. ✅ Read your Google Doc
12. ✅ Create 1-page summary
13. ✅ Start designing mockups

**Total time: 1-2 hours. Then you're done researching.**

---

## 📊 SUCCESS CRITERIA

You're done with research when:
- [ ] You have exact px values for spacing, sizing, max-width
- [ ] You know: wizard vs accordion vs single page (picked one)
- [ ] You know how many boxes per screen (2? 3? 4?)
- [ ] You have 5 real tool examples with screenshots
- [ ] You have validation that your approach won't overload users
- [ ] Total research time: <2 hours
- [ ] You can explain your design decisions in one sentence each

If you checked all boxes above → **STOP RESEARCHING, START DESIGNING**

---

## 🆘 WHEN YOU'RE TEMPTED TO RESEARCH MORE

**Ask yourself:**
- Do I know the max-width for forms? (Yes → don't research)
- Do I know how many fields per screen? (Yes → don't research)
- Do I know wizard vs accordion? (Yes → don't research)
- Do I know how many info boxes per screen? (Yes → don't research)
- Do I have 3+ real examples to reference? (Yes → don't research)

**If you answered YES to all 5 → You're done. Start designing.**

**If you answered NO to any → Re-read your Google Doc. The answer is probably already there.**

---

## 📞 QUICK REFERENCE

| I need... | Use prompt... | Time |
|-----------|---------------|------|
| Exact specs (px, layout rules) | Prompt 1 | 20 min |
| Real examples (inspiration) | Prompt 2 | 20 min |
| Validation (am I doing it right?) | Prompt 3 | 20 min |
| Everything above | All 3 | 1 hour |

**That's it. That's the whole research phase.**

---

**Remember:**
- 3 prompts > 40 prompts
- Less research, more execution
- Perfect is the enemy of done
- You don't need to be an expert. You need to be better than your current long-scroll mess.

**Now go run those 3 prompts and get to work. 🚀**
