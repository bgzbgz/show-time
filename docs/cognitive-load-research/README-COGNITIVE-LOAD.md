# 🧠 Cognitive Load Research - START HERE

**Date Created:** 2026-02-17  
**Purpose:** Reduce cognitive load in Fast Track tools by 50%  
**Focus:** Layouts, colors, buttons, questions, sections, scrolling, educational content  
**Timeline:** 3 weeks

---

## 🚀 QUICK START (3 Steps)

### Step 1: Read the Pre-Mortem (10 minutes)
**File:** `PRE-MORTEM-FAILURE-PREVENTION.md`

This prevents all disaster scenarios:
- Getting lost in information
- Breaking production tools
- Deployment disasters
- Collecting wrong sources
- Weak foundation from bad prompts

**Action:** Read it now. Seriously.

---

### Step 2: Run These 3 Prompts (1 hour)

**Open:** `../prompts/ESSENTIAL-PROMPTS-ONLY.md` ⭐ SIMPLIFIED VERSION

Copy-paste these into ChatGPT/Claude/Perplexity:

1. **Prompt 1** (Get The Rules) → ChatGPT - exact specs
2. **Prompt 2** (Get Real Examples) → Perplexity - 5 tools to learn from
3. **Prompt 3** (Validate Your Approach) → Claude - confirm you're on track

Save all responses in ONE Google Doc.

**That's it. 3 prompts. Done.**

---

### Step 3: Design Mockups (3 hours)

**Reference:** `COGNITIVE-LOAD-PLAYBOOK.md` + `INFO-BOX-VISUAL-SPEC.md`

Create 4 screens in Figma/PowerPoint:
- Step 1: Wish
- Step 2: Outcome
- Step 3: Obstacle
- Step 4: Plan

Show to boss. Get approval.

---

## 📚 THE 5 DOCUMENTS

### 1. ⭐ PRE-MORTEM-FAILURE-PREVENTION.md
**Why:** Prevents all 7 ways this could go wrong  
**When:** Read FIRST, re-read when overwhelmed  
**Time:** 15 minutes to read

### 2. 📖 COGNITIVE-LOAD-PLAYBOOK.md
**Why:** One-page quick reference for principles + rules  
**When:** Pin to monitor, reference while working  
**Time:** 10 minutes to read, lifetime to reference

### 3. 💬 ESSENTIAL-PROMPTS-ONLY.md ⭐ USE THIS ONE
**Why:** Just 3 prompts (not 40+), high value, stay in control  
**When:** During research phase (Day 1-3)  
**Time:** 1 hour total

### 3b. COGNITIVE-LOAD-RESEARCH-PROMPTS.md (Archive)
**Why:** 40+ prompts for deep dive (probably overkill)  
**When:** Only if the 3 essential prompts don't answer something  
**Time:** 2+ hours (not recommended)

### 4. 🎨 INFO-BOX-VISUAL-SPEC.md
**Why:** Pixel-perfect specs for yellow/grey/black boxes  
**When:** During coding phase (Week 2)  
**Time:** Reference as needed, code provided

### 5. 📋 COGNITIVE-LOAD-RESEARCH-PLAN.md
**Why:** Comprehensive master plan with all phases  
**When:** For context (most is in other 4 docs)  
**Time:** 20 minutes (optional deep dive)

---

## 🎯 YOUR SCOPE (Only These 8 Things)

You're researching EXACTLY these, nothing more:

1. ✅ **Layouts** - Wizard vs. accordion, single column, max-width
2. ✅ **Colors** - Yellow (#FFF469), Grey (#B2B2B2), Black (#000000)
3. ✅ **Buttons** - Primary (black), secondary (outline), disabled
4. ✅ **Questions/Labels** - Position, size, format, help text
5. ✅ **Sections** - Headers, spacing, visual separation
6. ✅ **Scrolling** - How to reduce by 50% (multi-step, accordions)
7. ✅ **Educational Content** - 3 info box types with icons
8. ✅ **Dos & Don'ts** - Anti-patterns table

**Find answers for these 8. Nothing else.**

---

## 📅 YOUR 3-WEEK TIMELINE

### Week 1: Research & Design
- **Day 1-3:** Research (2 hours/day, STOP after Day 3)
- **Day 4:** Synthesize notes
- **Day 5:** Create mockups, get boss approval

### Week 2: Code in Sandbox
- Create `frontend/tools-redesign-sandbox/00-woop-v2.html`
- Build 4-step wizard
- Add 3 info box types
- Test locally (DON'T deploy)

### Week 3: Test & Deploy
- Test with 2-3 clients
- Get boss approval
- Deploy ONLY WOOP tool
- Monitor, celebrate 🎉

---

## 🚨 CARDINAL RULES

1. **10 Source Limit** - No more than 10 research sources. Period.
2. **Work in Sandbox** - Never touch production files in `frontend/tools/`
3. **No Deployment Until Week 3** - Don't deploy during research/coding
4. **One Tool Only** - WOOP tool only, ignore the other 30 for now
5. **Boss Approval Required** - Don't code until mockups approved
6. **Stop After Day 3** - Research phase is OVER on Day 3, move to design

---

## 💡 ANSWERS TO YOUR SPECIFIC QUESTIONS

### "How to make layouts?"
→ See `COGNITIVE-LOAD-PLAYBOOK.md` page 10-11  
→ Answer: Single column, 720px max-width, multi-step wizard

### "How to use colors?"
→ See `INFO-BOX-VISUAL-SPEC.md` entire document  
→ Answer: Yellow (#FFF469), Grey (#B2B2B2), Black (#000000)

### "How to design buttons?"
→ See `COGNITIVE-LOAD-PLAYBOOK.md` page 11  
→ Answer: Black primary, white outline secondary, sticky footer

### "How to handle scrolling?"
→ See `PRE-MORTEM-FAILURE-PREVENTION.md` Day 1 research  
→ Answer: Multi-step wizard, 4 steps, <1 page scroll per step

### "How to add educational sections?"
→ See `INFO-BOX-VISUAL-SPEC.md` with React components  
→ Answer: 3 box types (yellow, grey, black), max 3-4 per screen

### "What are the dos and don'ts?"
→ See `COGNITIVE-LOAD-PLAYBOOK.md` page 12, Anti-Patterns table  
→ Answer: Do wizards, don't long-scroll. Do single column, don't multi-column.

---

## ✅ YOU'LL KNOW YOU'VE SUCCEEDED WHEN

- [ ] WOOP tool takes 30% less time to complete
- [ ] Scrolling reduced by 50%+ (measured)
- [ ] Guru confusion questions reduced 60%
- [ ] Boss says "this is so much better"
- [ ] Clients say "I didn't have to think, it just flowed"
- [ ] You finished in 3 weeks (not 3 months)

---

## 🆘 WHEN YOU NEED HELP

**Overwhelmed?** → Read `PRE-MORTEM-FAILURE-PREVENTION.md` again

**Don't know what to research?** → Use the 3 prompts in Quick Start

**Breaking production?** → STOP. Work in sandbox only.

**Too many sources?** → Delete everything except 10 approved ones

**Not sure what to code?** → Copy components from `INFO-BOX-VISUAL-SPEC.md`

**Want to fix all 31 tools?** → DON'T. Finish WOOP first.

---

## 📂 FILE STRUCTURE

```
docs/
├── fast-track-specs/
│   ├── PRE-MORTEM-FAILURE-PREVENTION.md ⭐ START HERE
│   ├── COGNITIVE-LOAD-PLAYBOOK.md (quick reference)
│   ├── INFO-BOX-VISUAL-SPEC.md (pixel-perfect specs)
│   ├── COGNITIVE-LOAD-RESEARCH-PLAN.md (master plan)
│   ├── COMPLETE-PACKAGE-SUMMARY.md (this file's sibling)
│   └── README-COGNITIVE-LOAD.md (this file)
└── prompts/
    └── COGNITIVE-LOAD-RESEARCH-PROMPTS.md (40+ prompts)

frontend/
├── tools/
│   └── module-0-intro-sprint/
│       └── 00-woop.html (DON'T TOUCH)
└── tools-redesign-sandbox/ (CREATE THIS)
    └── 00-woop-v2.html (WORK HERE)
```

---

## 🎯 YOUR NEXT ACTION (Right Now)

1. ✅ Open `PRE-MORTEM-FAILURE-PREVENTION.md`
2. ✅ Read it (15 minutes)
3. ✅ Open `COGNITIVE-LOAD-RESEARCH-PROMPTS.md`
4. ✅ Run the 3 Quick Start prompts
5. ✅ Create ONE Google Doc for notes
6. ✅ Set timer for 2 hours, STOP when it rings

**Monday is Day 1. You have everything you need.**

---

## 📞 QUICK LINKS

| I need to... | Go to... |
|--------------|----------|
| Prevent failure | `PRE-MORTEM-FAILURE-PREVENTION.md` |
| Look up a principle | `COGNITIVE-LOAD-PLAYBOOK.md` |
| Find a prompt | `COGNITIVE-LOAD-RESEARCH-PROMPTS.md` |
| Code an info box | `INFO-BOX-VISUAL-SPEC.md` |
| See the full plan | `COGNITIVE-LOAD-RESEARCH-PLAN.md` |
| Understand everything | `COMPLETE-PACKAGE-SUMMARY.md` |

---

**Created by:** Claude (AI Assistant)  
**For:** Fast Track Tools UX Redesign  
**Status:** Ready to Execute  

**Now stop reading. Start executing. You've got this. 🚀**
