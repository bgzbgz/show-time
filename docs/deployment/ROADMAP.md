# 🗺️ FAST TRACK TOOLS - 18-DAY BUILD ROADMAP

**Start Date:** Feb 10, 2026
**End Date:** Feb 28, 2026
**Total Sprints:** 31 (0-30)
**Estimated Tools:** 40-45 (some sprints = multiple tools)

---

## 📊 WEEK-BY-WEEK VIEW

```
WEEK 1: FOUNDATION (Feb 10-16)
├── Day 1-3: Architecture & Infrastructure
├── Day 4-6: Master Template & First 2 Tools
└── Day 7: Tool Generator Script

WEEK 2: FACTORY MODE (Feb 17-23)
├── Day 8-9: Foundation Module Tools (5 sprints)
├── Day 10-11: Performance Module Tools (6 sprints)
├── Day 12-13: Market Module Tools (2 sprints)
└── Day 14: Strategy Module Tools (3 sprints)

WEEK 3: FINAL PUSH (Feb 24-28)
├── Day 15-16: Execution Module Tools (5 sprints)
├── Day 17: Org Module Tools (4 sprints)
├── Day 18: People & Tech Module Tools (6 sprints)
└── Buffer: Bug fixes, polish, testing
```

---

## 🏗️ PHASE 1: FOUNDATION (Days 1-3)

### Day 1 - Monday Feb 10 (TODAY)
**Goal:** Lock database & audit existing tools

**Morning (4 hours):**
- [x] Review sprint-connections-updated.md
- [x] Design database schema
- [ ] YOU APPROVE schema
- [ ] Create Supabase project
- [ ] Set up tables

**Afternoon (4 hours):**
- [ ] Audit all 13 existing tools
- [ ] Extract common patterns
- [ ] Document NotebookLM fixes needed
- [ ] Create "Design Lock" document (fonts, colors, spacing)

**Evening (2 hours):**
- [ ] Plan API endpoints
- [ ] Set up LearnWorlds webhook endpoint

---

### Day 2 - Tuesday Feb 11
**Goal:** Build core infrastructure

**Morning (4 hours):**
- [ ] Build API layer (Supabase Edge Functions)
  - GET /api/user/progress
  - GET /api/sprint/:id/dependencies
  - POST /api/sprint/:id/submit
  - POST /api/autosave

**Afternoon (4 hours):**
- [ ] LearnWorlds SSO integration
- [ ] User sync webhook handler
- [ ] Tool unlocking logic

**Evening (2 hours):**
- [ ] AI service wrapper (Claude Haiku 3.5)
- [ ] Test AI critique function

---

### Day 3 - Wednesday Feb 12
**Goal:** Landing page MVP + first tool test

**Morning (4 hours):**
- [ ] Build landing page
  - User dashboard
  - Sprint progress cards
  - Tool launcher
  - Lock/unlock states

**Afternoon (4 hours):**
- [ ] Test with Sprint 0 (Mission & Objectives)
- [ ] Verify data flow: LMS → Landing → Tool → DB → Next Tool
- [ ] Fix critical bugs

**Evening (2 hours):**
- [ ] Deploy to production
- [ ] YOU TEST end-to-end

---

## 🎨 PHASE 2: TEMPLATE PERFECTION (Days 4-6)

### Day 4 - Thursday Feb 13
**Goal:** Build Sprint 1 (Know Thyself) - most complex tool

**All Day (10 hours):**
- [ ] Master template HTML structure
- [ ] Implement all 8-point criteria:
  1. Forces clear decision ✓
  2. No questions needed ✓
  3. Easy first steps ✓
  4. Instant feedback ✓
  5. Gamification ✓
  6. Clear visibility ✓
  7. Mass communication ✓
  8. Smells like Fast Track ✓
- [ ] Fix NotebookLM issues:
  - Just-in-time tooltips
  - Hard constraints (no vagueness)
  - Automated aggregation (if team tool)
- [ ] AI critique integration
- [ ] YOU REVIEW & APPROVE design

---

### Day 5 - Friday Feb 14
**Goal:** Polish Sprint 1, build Sprint 2 (Dream)

**Morning (4 hours):**
- [ ] Finish Sprint 1 polish
- [ ] YOU TEST Sprint 1 thoroughly
- [ ] Fix bugs

**Afternoon (4 hours):**
- [ ] Build Sprint 2 (Dream)
- [ ] Test dependency injection (loads data from Sprint 1)
- [ ] Verify data flows correctly

**Evening (2 hours):**
- [ ] Document template patterns
- [ ] Create sprint config JSON format

---

### Day 6 - Saturday Feb 15
**Goal:** Build tool generator script

**All Day (8 hours):**
- [ ] Create tool generator CLI
- [ ] Input: sprint config JSON
- [ ] Output: Complete HTML tool
- [ ] Test generator with Sprint 3 (Values)
- [ ] Verify generated tool works perfectly
- [ ] LOCK TEMPLATE - no more design changes!

---

## 🏭 PHASE 3: FACTORY MODE (Days 7-16)

### Day 7-8 - Sunday-Monday Feb 16-17
**Module 1: Foundation (Sprints 3-5)**
- [ ] Sprint 3: Values
- [ ] Sprint 4: Team (multiple tools: 5 dysfunctions, team summary, improvement plan)
- [ ] Sprint 5: FIT Assessment (individual + ABC matrix)

---

### Day 9-10 - Tuesday-Wednesday Feb 18-19
**Module 2: Performance (Sprints 6-11)**
- [ ] Sprint 6: Current Cash Position
- [ ] Sprint 7: Creating Energy (Optional)
- [ ] Sprint 8: Goals, Priorities and Planning
- [ ] Sprint 9: Focus, Discipline & Productivity
- [ ] Sprint 10: Performance & Accountability
- [ ] Sprint 11: Meeting Rhythm

---

### Day 11-12 - Thursday-Friday Feb 20-21
**Module 3: Market (Sprints 12-13)**
- [ ] Sprint 12: Market Size
- [ ] Sprint 13: Segmentation and Target Market

**Module 4: Strategy (Sprints 14-16)**
- [ ] Sprint 14: Target Segment Deep Dive
- [ ] Sprint 15: Value Proposition
- [ ] Sprint 16: Value Proposition Testing

---

### Day 13-14 - Saturday-Sunday Feb 22-23
**Module 5: Execution (Sprints 17-21)**
- [ ] Sprint 17: Product Development
- [ ] Sprint 18: Strategy Driven Pricing
- [ ] Sprint 19: Brand and Marketing
- [ ] Sprint 20: Customer Service Strategy (Optional)
- [ ] Sprint 21: Route to Market

---

## 🚀 PHASE 4: FINAL PUSH (Days 15-18)

### Day 15-16 - Monday-Tuesday Feb 24-25
**Module 6: Org Structure (Sprints 22-25)**
- [ ] Sprint 22: Define Core Activities
- [ ] Sprint 23: Processes, Decisions, and Capabilities
- [ ] Sprint 24: FIT & ABC Analysis
- [ ] Sprint 25: Organizational Redesign

---

### Day 17 - Wednesday Feb 26
**Module 7: People (Sprints 26-27)**
- [ ] Sprint 26: Employer Branding and Recruitment
- [ ] Sprint 27: Set Agile Teams (Optional)

**Module 8: Tech & AI (Sprints 28-29)**
- [ ] Sprint 28: Top 3 Decisions & Processes to Digitalize
- [ ] Sprint 29: Create the Digital Heart

---

### Day 18 - Thursday Feb 27
**Final Sprint & Buffer**
- [ ] Sprint 30: Program Overview & Next 12 Months (synthesizes ALL sprints)
- [ ] Bug fixes
- [ ] Final testing
- [ ] YOU DO FULL PROGRAM RUN-THROUGH

---

## 📈 DAILY VELOCITY TRACKER

| Day | Target Tools | Actual | Status | Blockers |
|-----|--------------|--------|--------|----------|
| 1-3 | 0 (infra) | - | - | - |
| 4-6 | 3 | - | - | - |
| 7-8 | 5 | - | - | - |
| 9-10 | 6 | - | - | - |
| 11-12 | 5 | - | - | - |
| 13-14 | 5 | - | - | - |
| 15-16 | 4 | - | - | - |
| 17 | 6 | - | - | - |
| 18 | 1 + polish | - | - | - |
| **TOTAL** | **35 sprints** | **0** | - | - |

---

## 🔥 CRITICAL SUCCESS FACTORS

### What MUST work:
1. **Data flow between tools** (dependencies load correctly)
2. **AI critique doesn't break budget** (Haiku 3.5 only on submit)
3. **Template generator works first try** (no debugging 46 tools)
4. **LearnWorlds SSO never fails** (users can't get locked out)
5. **YOU approve design on Day 4** (no redesigns later)

### What can be "good enough":
1. Landing page design (functional > beautiful)
2. AI responses (helpful > perfect)
3. Gamification (simple > complex)
4. Mobile responsive (desktop-first)
5. Error messages (clear > poetic)

---

## 🚨 DECISION POINTS (Need Your Input)

| Day | Decision | Options | Your Choice |
|-----|----------|---------|-------------|
| 1 | Database approved? | Supabase schema | [ ] YES [ ] NO |
| 4 | Design locked? | Master template | [ ] YES [ ] NO |
| 6 | Generator works? | Tool factory | [ ] YES [ ] NO |
| 10 | Halfway check-in | Continue or pivot? | [ ] GO [ ] STOP |
| 15 | Module 5 complete? | All execution tools | [ ] YES [ ] NO |
| 18 | SHIP IT? | Go live | [ ] YES [ ] NO |

---

## 💰 AI COST TRACKING

**Budget Target:** $50/day max
**Haiku 3.5 Pricing:**
- Input: $0.25 per 1M tokens
- Output: $1.25 per 1M tokens

**Expected Usage:**
- 50 users x 31 sprints = 1,550 submissions
- Average 2K input + 1K output per critique = 3K tokens
- Total: 4.65M tokens = ~$5 for entire program per user

**Daily Monitoring:**
- Check `ai_interactions` table daily
- Alert if cost > $50/day
- Optimize prompts if needed

---

## 📞 DAILY STAND-UP PROTOCOL

**Every day at 6 PM:**
1. I share: What I built today
2. I show: Working demo link
3. You test: 10 minutes of clicking around
4. You say: "Continue" or "Fix X first"

**Format:**
```
DAY X UPDATE:
✅ Completed: [List]
🚧 In Progress: [List]
🐛 Bugs Found: [List]
⏭️ Tomorrow: [List]
🔗 Demo Link: [URL]
```

---

## 🎯 SUCCESS METRICS

**End of Week 1:**
- [ ] Database live
- [ ] Landing page functional
- [ ] 3 tools complete (Sprint 0, 1, 2)
- [ ] Dependencies flow correctly

**End of Week 2:**
- [ ] 20+ tools complete
- [ ] Generator working smoothly
- [ ] No critical bugs

**End of Week 3:**
- [ ] 35+ tools complete
- [ ] Full program testable
- [ ] YOU approve for launch

---

## ⚠️ RED FLAGS (Stop Immediately If...)

1. ❌ Database structure needs major change after Day 3
2. ❌ Template redesign requested after Day 6
3. ❌ AI costs spike over $100/day
4. ❌ Tools take >4 hours each after Day 10
5. ❌ Critical bug blocks all tools

**Action:** Call immediate meeting, assess if deadline realistic.

---

## 📝 NEXT STEPS (RIGHT NOW)

1. **YOU:** Review DATABASE-SCHEMA.sql (just created)
2. **YOU:** Approve or request changes
3. **ME:** Create Supabase project
4. **ME:** Start auditing existing 13 tools
5. **BOTH:** 6 PM check-in today with progress

---

**Last Updated:** Feb 10, 2026 - 10:35 AM
**Status:** Day 1 in progress
