# Tool Logic Audit — Master Document

**Created:** 2026-02-23
**Branch:** fix/tool-logic-audit
**Baseline tag:** pre-audit-baseline

## Frozen Assets (NEVER modify during fixes)
- `frontend/shared/js/tool-db.js`
- `frontend/shared/js/ai-challenge.js`
- `frontend/shared/js/dependency-injection.js`
- `frontend/shared/js/cognitive-load.js`
- `frontend/shared/css/cognitive-load.css`
- `frontend/js/tool-access-control.js`
- `frontend/js/auth.js`
- Any backend file

## Live Data Summary (user_responses table)
| Tool | Responses | Risk |
|------|-----------|------|
| woop | 53 | HIGH |
| know-thyself | 68 | HIGH |
| dream | 8 | HIGH |
| values | 10 | HIGH |
| value-proposition | 4 | MEDIUM |
| target-segment-deep-dive | 2 | MEDIUM |
| team | 0 | LOW |
| fit | 0 | LOW |
| All other tools | 0 | LOW |

---

## Tool 00: WOOP (slug: woop)

**Classification:** reflection + planning (dual-mode: program vs business)
**Completion:** individual-only
**Meeting phase:** before (intro sprint — "Get Ready for the Journey")
**Data risk:** HIGH (53 live responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-02-get-ready/content.md` + `LMS/08*/02_get_ready_for_journey`

- **Purpose:** Apply Gabrielle Oettingen's WOOP (Wish-Outcome-Obstacle-Plan) + Pre-Mortem + Cut the Elephant to prepare for the Fast Track program
- **Framework:** Mental Contrasting + Implementation Intentions (MCII)
- **Two modes:** Program Mode (completing FT program) and Business/Everyday Mode (any goal)
- **Key questions it MUST ask:**
  - Wish: What have you achieved? What has the world changed to? How do you feel?
  - Outcome: 3 key milestones (program) or single outcome (business)
  - Obstacle: Internal barriers + IF [trigger] THEN [person] WILL [action] BY [when]
  - Plan: Big chunks, smallest first action (< 30 min), deadline
  - Pre-Mortem (business): failure scenario, 3 root causes, prevention
  - Cut the Elephant (business): big goal, 3 slices, today action
- **Expected outputs:** Completed WOOP canvas, pre-mortem analysis (business), daily action plan

### Current Implementation
- **Steps:** Setup (scope) -> Step 1 (Wish) -> Step 2 (Outcome) -> Step 3 (Obstacle) -> Step 4 (Plan) -> Step 5 (Pre-Mortem, business only) -> Step 6 (Cut Elephant, business only) -> Canvas -> Submit
- **Question keys (FROZEN):** wish, outcome, obstacle_external, obstacle_internal, plan_if_then, first_action, commitment_level, reflection, premortem_scenario, premortem_cause_0/1/2, premortem_prevention, elephant_goal, elephant_slice_0/1/2, elephant_first_slice
- **Dependencies consumed:** identity.personal_dream (from know-thyself, via DI)
- **Dependencies produced:** none registered in tool_questions reference_keys
- **AI challenge:** gates each step + final submit

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Dual mode (program/business) | Yes | Yes | PASS |
| Wish (3 fields) | outcome, worldChange, feeling | Yes | PASS |
| Outcome (3 milestones or 1) | mode-dependent | Yes | PASS |
| Obstacle (IF-THEN) | internal only, IF-THEN plan | Yes, 5-field per obstacle | PASS |
| Plan (action + deadline) | first action + deadline | bigChunks + firstAction + deadline | PASS |
| Pre-Mortem | available for all | business mode only | MINOR gap |
| Cut the Elephant | not in original WOOP docs | business mode only (added) | Extra (acceptable) |
| Tune-in questions | 5 intro questions | none | MINOR gap |
| Mind Rehearsal | 10-min visualization | not implemented | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] in cognitive load components | MINOR |
| Data persistence | Supabase | localStorage + AIChallenge submit | OK (submit saves to user_responses) |

**Missing:** Tune-in questions (5 intro reflections), mind rehearsal step, pre-mortem for program mode
**Wrong:** Nothing contradicts course content
**Extra:** Cut the Elephant (bonus, not harmful), PDF export

### Fix Priority: P2
### Fix Scope: S (add optional tune-in, fix placeholders)

---

## Tool 01: Know Thyself (slug: know-thyself)

**Classification:** reflection + assessment (4-tool composite)
**Completion:** individual-only (team sharing via canvas export)
**Meeting phase:** before (individual prep for team meeting)
**Data risk:** HIGH (68 live responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-01-know-thyself/content.md`

- **Purpose:** Deep self-awareness — strengths, values, purpose. "To know yourself is to be grounded in your strengths, guided by your values, and driven by your purpose."
- **Framework:** 4-phase individual preparation (Dream Launcher, Strengths Amplifier, Values Compass, Growth Blueprint)
- **Key questions it MUST ask:**
  - Dream Launcher (10 questions): 80th birthday story, what you love/good at/give to world/paid for, inspiration, peak experiences, self-appreciation, hardships, morning reason (= dream)
  - Strengths Amplifier: 3+ activities with energy markers, 3+ strengths with fit %, do more/less/start to
  - Values Compass: 5 values with how-you-live-it + alignment %
  - Growth Blueprint: 3 goals with actions + deadlines
- **Expected outputs:** Personal dream statement, strengths map, values alignment, growth plan

### Current Implementation
- **Steps:** Cover -> Intro -> Dream Launcher (10 substeps) -> Strengths Amplifier (3 substeps) -> Values Compass (5 substeps) -> Growth Blueprint (3 substeps) -> Canvas
- **Question keys (FROZEN):** birthdayStory, whatLove, whatGoodAt, giveToWorld, paidFor, inspired, feltBest, likeAboutSelf, hardships, dream, activities, strengths, doMore, doLess, startTo, value_1-5, goal_1-3
- **Reference keys:** identity.personal_dream (dream), identity.personal_values (value_5), identity.strengths.matrix (strengths)
- **Dependencies consumed:** none (first in identity module)
- **Dependencies produced:** personal_dream, personal_values, strengths — used by dream, values, team, fit tools
- **AI challenge:** gates each section + final submit

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Dream Launcher (10 Qs) | 10 guiding questions | All 10 present | PASS |
| Strengths Amplifier | activities + strengths + action | 3 substeps, correct | PASS |
| Values Compass | 5 values + alignment | 5 substeps, one per value | PASS |
| Growth Blueprint | goals + actions + deadlines | 3 substeps, correct | PASS |
| Mind Rehearsal | 10-min guided visualization | not implemented | MINOR gap |
| Placeholder content | final | 3x [PLACEHOLDER] items (FastTrackInsight, ScienceBox, CaseStudy) | MINOR |
| "Share With Team" | functional sharing | mock (client-side alert only) | MINOR |
| Deep Dive Resources | books/articles/videos linked | not linked | MINOR |
| Data persistence | Supabase | localStorage + AIChallenge submit | OK |

**Missing:** Mind rehearsal UI, deep dive resource links, real share functionality
**Wrong:** Nothing contradicts course content
**Extra:** None

### Fix Priority: P3
### Fix Scope: S (fix placeholders, disable/label mock share button)

---

## Tool 02: Dream (slug: dream)

**Classification:** brainstorm + reflection (company dream/vision)
**Completion:** individual-then-team (individual prep, team finalizes in meeting)
**Meeting phase:** before (individual) + during (team discussion)
**Data risk:** HIGH (8 live responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-14-dream/content.md` (Sprint 14: Crafting Your Company Dream)

- **Purpose:** Craft a bold, simple, energizing 10-year company vision — the North Star for all decisions
- **Framework:** Golden Circle (Sinek) + BHAG (Collins & Porras) + "Begin with the End in Mind" (Covey)
- **Key questions it MUST ask:**
  - Corporate Killer (3 Qs): What's lost if brand ceases? What's at stake? Why must it continue?
  - Employee Promise (3 Qs): Money (financial benefit), Pride (what they'd tell family), Freedom (personal growth)
  - Dream Visualization (6 Qs answered one-at-a-time): Achievement (one metric), customers say, employees say, market position, office feel, who you've become
  - One Sentence: Synthesize into one powerful sentence (max 300 chars)
  - Dream Board: 7 essence words + 7 inspirational figures
- **Expected outputs:** Corporate Killer narrative, employee promise, 6-part dream visualization, one-sentence dream, dream board

### Current Implementation
- **Steps:** Cover -> Intro -> Golden Circle interlude -> Corporate Killer (3 Qs) -> Emotional pause -> Employee Promise (3 WIFM Qs) -> Transition -> Dream Questions (6 one-at-a-time) -> Synthesis pause -> One Sentence (+ AI 3 variants) -> Dream Board (7 words + 7 figures) -> Dream Strength Analyzer -> Canvas
- **Question keys (FROZEN):** dream_narrative, dream_visualization, killer_conclusion, one_sentence
- **Reference keys:** identity.dream.narrative, identity.dream.visualization, identity.dream.killer_conclusion, identity.dream.one_sentence
- **Dependencies consumed:** identity.personal_dream, identity.personal_values (from know-thyself)
- **Dependencies produced:** one_sentence (used by 9+ downstream tools), narrative (used by cash, goals, employer-branding)
- **AI features:** jargon detection, bullet-point detection, strength scoring, 3 AI-generated dream sentence variants (conservative/bold/audacious)

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Corporate Killer (3 Qs) | whatLost, whatsAtStake, whyImportant | Yes | PASS |
| Employee Promise (3 Qs) | money, pride, freedom | Yes | PASS |
| Dream Visualization (6 Qs) | achievement, customersSay, employeesSay, marketPosition, officeFeelsLike, personalAchievement | Yes, one-at-a-time | PASS |
| One Sentence | synthesize all | Yes + AI variants | PASS |
| Dream Board | words + figures | 7 words + 7 people | PASS |
| Golden Circle integration | review tool | Step 0.7 displays concept but doesn't capture W/H/W answers | MINOR gap |
| Dependency display | show personal dream/values | loaded but not prominently displayed to user | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |
| Progress calculation | accurate | moodBoard not counted | MINOR bug |

**Missing:** Golden Circle answer capture (just informational), prominent dependency display
**Wrong:** Nothing contradicts course content
**Extra:** Dream Strength Analyzer (clarity/boldness/specificity/emotion metrics — nice addition)

### Fix Priority: P2
### Fix Scope: S (fix progress calc, improve dependency display, fix placeholders)

---

## Tool 03: Values (slug: values)

**Classification:** canvas + assessment (values definition + behavioral translation)
**Completion:** individual-then-team
**Meeting phase:** before (individual) + during (team finalizes)
**Data risk:** HIGH (10 live responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-03-values/content.md` (Sprint 03/22: Values)

- **Purpose:** Transform values from abstract concepts into specific, actionable behaviors with enforcement boundaries
- **Framework:** Core Values -> Cool/Not Cool behaviors -> Red/Yellow lines -> Recruitment questions -> Communication plan
- **Key questions it MUST ask:**
  - Step 1: 10 observable behaviors + extract 5 core values
  - Step 2: Dream auto-load + required values for dream + gap analysis
  - Step 3: For each value — cool behavior + not cool behavior (50+ chars each)
  - Step 4: Yellow lines (warning) + Red lines (termination-level)
  - Step 5: 5 recruitment interview questions
  - Step 6: Communication plan (idea + who + when)
- **Expected outputs:** 5 core values with behavioral definitions, enforcement boundaries, recruitment screen, rollout plan

### Current Implementation
- **Steps:** Cover -> Intro -> Step 1 (Behaviors + Values) -> Step 2 (Dream + Gap) -> Step 3 (Cool/Not Cool) -> Step 4 (Red/Yellow Lines) -> Step 5 (Recruitment Qs) -> Step 6 (Comm Plan) -> Results
- **Question keys (FROZEN):** core_values_list, cool_not_cool, red_lines, recruitment_questions, rollout_plan
- **Reference keys:** identity.values.core_list, identity.values.cool_not_cool, identity.values.red_lines, identity.values.recruitment_questions, identity.values.rollout_plan
- **Dependencies consumed:** identity.dream.one_sentence (from dream tool, auto-loaded via useEffect)
- **Dependencies produced:** core_list, cool_not_cool, red_lines — used by team, fit, employer-branding, and 10+ other tools
- **AI challenge:** gates all 6 steps + final submit

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| 10 behaviors + 5 values | Step 1 | Yes (validated: 3+ behaviors 50+ chars, 3+ values) | PASS |
| Dream auto-load | Step 2 | Yes, useEffect + yellow badge | PASS |
| Values gap analysis | Step 2 | requiredValues + gap fields | PASS |
| Cool/Not Cool | Step 3 | 5 values x cool + notCool (50+ chars) | PASS |
| Yellow/Red lines | Step 4 | 5 each (30+ chars, 2+ required) | PASS |
| Recruitment questions | Step 5 | 5 questions (50+ chars, 3+ required) | PASS |
| Communication plan | Step 6 | idea + who + when (3+ required) | PASS |
| Values Alignment Check | separate tool | NOT implemented | MINOR gap |
| Cover image | present | missing file (404) | MINOR bug |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |
| Missing question mappings | behaviors, dream, gap | not saved to user_responses | MINOR gap |

**Missing:** Values Alignment Check Tool (from content guide), cover image file, 4 question fields not mapped to submission
**Wrong:** Nothing contradicts course content
**Extra:** None

### Fix Priority: P2
### Fix Scope: S (fix cover image, fix placeholders, add missing question mappings)

---

## Tool 04: Team (slug: team)

**Classification:** assessment + planning (team dysfunction diagnosis)
**Completion:** team-only (individual assessments compiled by guru)
**Meeting phase:** during (guru facilitates)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-04-team/content.md` (Sprint 04/17: Team Dynamics)

- **Purpose:** Diagnose team dysfunctions using Lencioni's 5 Dysfunctions framework and create improvement plans
- **Framework:** Patrick Lencioni's hierarchical pyramid:
  1. Absence of Trust (foundation)
  2. Fear of Conflict
  3. Lack of Commitment
  4. Avoidance of Accountability
  5. Inattention to Results
- **Key questions it MUST ask:**
  - Individual Assessment: Rate each dysfunction 1-3 scale (per person)
  - Team Summary: Compiled scores, average per dysfunction, pattern identification
  - Improvement Plan: Top 3 dysfunctions + actionable strategies + responsible person + deadline
- **Expected outputs:** Individual scorecards, team summary with averages, improvement plan, action commitments

### Current Implementation
- **Steps:** Cover -> Step 1 (Team Setup: name, members, 1-10 scores per member per dysfunction) -> Step 2 (Summary + Radar Chart) -> Step 3 (Improvement Plan: free-text per dysfunction) -> Step 4 (Action Plan: 3 cards with what/who/when, strict validation) -> Step 5 (Commitment Lock: 100% team required) -> Step 6 (Review + PDF)
- **Question keys (FROZEN):** dysfunction_scorecard, trust_action_plan, conflict_norms, conflict_resolution_strategies, accountability_tracker
- **Reference keys:** identity.team.dysfunction_scorecard, identity.team.trust_action_plan, identity.team.conflict_norms, identity.team.conflict_resolution_strategies, identity.team.accountability_tracker
- **Dependencies consumed:** (loads from DI config if available)
- **Dependencies produced:** dysfunction_scorecard, trust_action_plan, conflict_norms — used by fit tool
- **Special features:** Chart.js radar visualization, PDF export (6 pages), commitment lock mechanism

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| 5 Dysfunctions framework | Lencioni pyramid | Yes, all 5 present | PASS |
| Assessment scale | 1-3 (Low/Medium/High) | 1-10 numeric | DIFFERENT but acceptable |
| Individual assessment | per-person ratings | per-person in team setup step | PASS |
| Team summary | averages + patterns | auto-calculated + radar chart | PASS (enhanced) |
| Improvement plan | top 3 + strategies | free-text per dysfunction | PASS |
| Action plan | actionable steps | 3 cards with strict validation (30+ chars, owner, date) | PASS (enhanced) |
| Commitment lock | not in content | 100% team commitment mechanism | Extra (good addition) |
| Contextual prompts | behavioral statements per question | no prompts, just numeric input | MINOR gap |
| Mind rehearsal | 10-min visualization | not implemented | MINOR gap |
| Guru facilitation flow | structured meeting agenda | not in tool | MINOR gap (external) |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |

**Missing:** Contextual behavioral statements for each dysfunction rating, mind rehearsal
**Wrong:** Scale is 1-10 vs content's 1-3 (but functionally acceptable — more granularity)
**Extra:** Radar chart, commitment lock, 6-page PDF export

### Fix Priority: P2
### Fix Scope: M (add contextual prompts per dysfunction, fix placeholders)

---

## Tool 05: FIT (slug: fit)

**Classification:** assessment (individual fit + team ABC analysis)
**Completion:** individual-only or team (dual-path: individual self-assessment OR team evaluation)
**Meeting phase:** before (individual) or during (team)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-24-fit-abc/content.md` (Sprint 20/24: FIT & ABC Analysis)

- **Purpose:** Evaluate organizational fit across 4 dimensions and classify team members using ABC analysis
- **Framework:**
  - FIT Analysis: 4 dimensions (Energy/Values/Skill/Impact fit)
  - ABC Classification: A-Players (high fit + high performance), B-Players (high fit, low perf — coach), C-Players (low both — develop/exit), D-Players (low fit, high perf — reposition)
- **Key questions it MUST ask:**
  - Individual path: Context (role, team), Values & Job FIT (sliders + evidence), Team & Boss FIT (sliders + evidence), Action Plan (strengths, improvements, plan)
  - Team path: Setup (team context), Assessment per member (4 FIT sliders + performance + notes), ABC Matrix (auto-plotted)
- **Expected outputs:** Individual FIT score with evidence, or team ABC matrix with classifications

### Current Implementation
- **Steps:** Cover -> Path Selection (individual/team) -> [Individual: Context -> Values & Job (sliders 0-100 + evidence) -> Team & Boss (sliders + evidence) -> Action Plan -> Canvas] or [Team: Setup -> Assessment (per member: 4 sliders + performance + notes) -> ABC Matrix Canvas]
- **Question keys (FROZEN):** individual_scores, abc_matrix
- **Reference keys:** identity.fit.individual_scores, identity.fit.abc_matrix
- **Dependencies consumed:** (loads from DI config if available — should load team/values data)
- **Dependencies produced:** individual_scores, abc_matrix — used by org-redesign, employer-branding
- **Special features:** dual-path architecture, ABC quadrant visualization, PDF export

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Dual path (individual/team) | Yes per content | Yes | PASS |
| 4 FIT dimensions | Energy, Values, Skill, Impact | Values, Job, Team, Boss | DIFFERENT naming |
| FIT sliders (0-100) | percentage assessment | Yes with evidence textareas | PASS |
| ABC classification | A/B/C/D quadrants | Yes, threshold at 70% | PASS |
| Team assessment | per member | Yes, add/remove members | PASS |
| Action plan (individual) | strengths + improvements | Yes | PASS |
| Evidence requirement | substantive text | 50+ chars (arbitrary) | PASS (basic) |
| Values alignment check | separate from general fit | combined into one slider | MINOR gap |
| D-Player guidance | strategy explanation | shown in matrix but no help modal detail | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |
| ToolDB.save() | explicit save | only via AIChallenge submit | OK (same pattern) |

**Missing:** Energy/Skill/Impact naming (uses Values/Job/Team/Boss instead — different lens but same concept), D-Player strategy guidance in help
**Wrong:** FIT dimension names don't match content (but functionally equivalent — assess fit from different angles)
**Extra:** None

### Fix Priority: P3
### Fix Scope: S (add D-Player help text, fix placeholders)

---

## Priority Summary (Session 1 Tools)

| Tool | Gap Rating | Priority | Scope | Key Issue |
|------|-----------|----------|-------|-----------|
| 00-woop | MINOR | P2 | S | Pre-mortem restricted to business mode; placeholders |
| 01-know-thyself | MINOR | P3 | S | Placeholders; mock share button |
| 02-dream | MINOR | P2 | S | Progress calc bug; dependency display; placeholders |
| 03-values | MINOR | P2 | S | Missing cover image; missing question mappings; placeholders |
| 04-team | MINOR | P2 | M | Missing contextual prompts per dysfunction; placeholders |
| 05-fit | MINOR | P3 | S | D-Player guidance; placeholders |

**Common pattern across all 6 tools:** [PLACEHOLDER] content in cognitive load components (FastTrackInsight, ScienceBox, CaseStudy). This is the single most pervasive gap.

---

## Frozen Question Keys Reference (Session 1)

### woop (18 keys)
wish, outcome, obstacle_external, obstacle_internal, plan_if_then, first_action, commitment_level, reflection, premortem_scenario, premortem_cause_0, premortem_cause_1, premortem_cause_2, premortem_prevention, elephant_goal, elephant_slice_0, elephant_slice_1, elephant_slice_2, elephant_first_slice

### know-thyself (25 keys)
birthdayStory, whatLove, whatGoodAt, giveToWorld, paidFor, inspired, feltBest, likeAboutSelf, hardships, dream, activities, strengths, doMore, doLess, startTo, value_1, value_2, value_3, value_4, value_5, goal_1, goal_2, goal_3

### dream (4 keys)
dream_narrative, dream_visualization, killer_conclusion, one_sentence

### values (5 keys)
core_values_list, cool_not_cool, red_lines, recruitment_questions, rollout_plan

### team (5 keys)
dysfunction_scorecard, trust_action_plan, conflict_norms, conflict_resolution_strategies, accountability_tracker

### fit (2 keys)
individual_scores, abc_matrix

---

## Tool 06: Cash Flow (slug: cash)

**Classification:** calculator + planning (P&L analysis, Power of One simulator, action plan)
**Completion:** individual-then-team
**Meeting phase:** before (individual financial analysis) + during (team reviews)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-06-cash/content.md` (Sprint 09: Cash Flow)

- **Purpose:** Master cash flow management by analyzing P&L across 2 fiscal years and identifying high-impact improvements using "Power of One" concept
- **Framework:** Cash Flow Story (4 chapters: profit, working capital, other capital, funding) + Power of One (1% improvement per lever) + Working Capital Optimization (CCC) + Labor Efficiency Ratios
- **Key questions it MUST ask:**
  - Year 1 & Year 2: Full P&L (revenue, COGS, labor, overheads, interest, tax) + Balance Sheet + Working Capital (days A/R, A/P, inventory)
  - Power of One: 9 levers (price, volume, COGS, direct labor, mgmt labor, overheads, debtor days, stock days, creditor days)
  - Action Plan: brainstorm ideas (impact/ease) + WHO/WHAT/WHEN assignments
- **Expected outputs:** Year-over-year P&L comparison, Power of One ranked impacts, CCC analysis, 90-day action plan

### Current Implementation
- **Steps:** Cover -> Step 1 (Year 1 P&L + BS + WC) -> Step 2 (Year 2 data) -> Step 3 (Power of One simulator: 9 sliders) -> Step 4 (Ideas brainstorm + Action Plan) -> Canvas (summary + export + submit)
- **Question keys (FROZEN):** story_report, power_of_one, action_sheets, top_priority, ler_ratio, action_plan
- **Reference keys:** performance.cash.story_report, performance.cash.power_of_one, performance.cash.action_sheets, performance.cash.top_priority, performance.cash.ler_ratio_analysis, performance.cash.action_plan
- **Dependencies consumed:** identity.dream.narrative (from dream tool)
- **Dependencies produced:** power_of_one, top_priority (used by goals, performance, meeting-rhythm)
- **Special features:** Business model translator (manufacturing/service/retail labels), embedded financial calculations (gross margin, EBIT, net profit, LER, CCC), currency formatting (EUR hardcoded)

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Year 1 + Year 2 P&L | full financial snapshot | Yes, complete P&L + BS + WC | PASS |
| Power of One (9 levers) | 1% improvement simulation | Yes, all 9 levers with cash + EBIT impact | PASS |
| Working Capital (CCC) | days A/R + inventory - A/P | Yes, auto-calculated | PASS |
| Labor Efficiency Ratios | direct + mgmt LER | Yes, calculated from P&L | PASS |
| Action plan (WHO/WHAT/WHEN) | structured assignments | Yes with validation | PASS |
| Balance sheet validation | assets = liabilities + equity | calculated but not enforced | MINOR gap |
| P&L consistency check | revenue > COGS | revenue > 0 and COGS > 0, but no COGS > revenue check | MINOR gap |
| Currency configurability | user's currency | EUR hardcoded | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |
| Ideas brainstorm saved | tracked in submission | not included in questionMappings | MINOR gap |

**Missing:** Balance sheet enforcement, P&L consistency validation, ideas brainstorm tracking
**Wrong:** Nothing contradicts course content
**Extra:** Impact/ease brainstorm matrix (good addition)

### Fix Priority: P2
### Fix Scope: S (fix placeholders, add BS validation warning)

---

## Tool 07: Energy (slug: energy)

**Classification:** reflection + habit formation (4-pillar energy protocol + Atomic Habits)
**Completion:** individual-only
**Meeting phase:** before (individual prep)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-07-energy/content.md` (Sprint 15: Energy)

- **Purpose:** Design a complete personal energy protocol across 4 physical pillars (Sleep, Food, Movement, Brain) plus mental energy management using Atomic Habits framework
- **Framework:** 4 Physical Pillars + Atomic Habits (Trigger-Routine-Reward) + Mental Energy Wisdom (Control analysis, Stop/Do-Less/Do-More, Event-Gap-Response)
- **Key questions it MUST ask:**
  - Per pillar (x4): Rating 1-10, Do Well, Do NOT Do Well, Goals, ONE Key Habit, Trigger, Routine, Reward, Accountability Partner
  - Mental Energy Part 1: What I CAN control vs CANNOT control
  - Mental Energy Part 2: STOP doing (3), DO LESS (3), DO MORE (3)
  - Mental Energy Part 3: Event-Gap-Response (recent poor reaction, gap analysis, ideal response, future plan)
- **Expected outputs:** 4-pillar energy audit, 4 atomic habits with full T-R-R-A detail, mental energy wisdom canvas

### Current Implementation
- **Steps:** Cover -> Intro -> Sleep Protocol -> Food Protocol -> Movement Protocol -> Brain Protocol -> Transition -> Mental Energy (Parts 1-3) -> Canvas -> Submit
- **Question keys (FROZEN):** energy_audit, habit_commitments, team_strategies, energy_woop
- **Reference keys:** performance.energy.audit, performance.energy.habit_commitments, performance.energy.team_strategies, performance.energy.woop
- **Dependencies consumed:** identity.strengths.matrix (from know-thyself)
- **Dependencies produced:** energy audit + habits (used by goals, performance, focus)
- **AI challenge:** final canvas submit only (no per-step gating)

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| 4 pillars assessed | Sleep, Food, Movement, Brain | Yes, all 4 | PASS |
| Rating 1-10 | numeric scale | Yes, range input | PASS |
| Do Well / Not Well / Goals | text reflections | Yes, textarea per pillar | PASS |
| One Key Habit per pillar | single habit x4 | Yes | PASS |
| Atomic Habits fields | Trigger, Routine, Reward, Accountability | Yes, 5 fields per pillar | PASS |
| Mental Energy Part 1 | control/cannot-control | Yes, 2 textareas | PASS |
| Mental Energy Part 2 | Stop/Do-Less/Do-More (3 each) | Yes, 9 inputs | PASS |
| Mental Energy Part 3 | Event-Gap-Response | Yes, 4 fields | PASS |
| Validation completeness | all fields required | Only keyHabit + Trigger validated | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |

**Missing:** Full field validation (most fields accept empty), tune-in questions
**Wrong:** Nothing contradicts course content
**Extra:** None

### Fix Priority: P2
### Fix Scope: S (fix placeholders, improve validation)

---

## Tool 08: Goals & Priorities (slug: goals)

**Classification:** brainstorm + prioritization matrix (Impact/Easy framework)
**Completion:** individual-only
**Meeting phase:** before (individual prep for strategy execution)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-08-goals/content.md` (Sprint 24: Goals & Priorities)

- **Purpose:** Master strategic goal-setting using Impact/Easy Matrix to ensure 80/20 focus
- **Framework:** Impact/Easy Matrix (2D scoring: Impact 1-3 + Ease 1-3 = combined score 1-6), Big Rocks (top 5 quarterly priorities)
- **Key questions it MUST ask:**
  - Brainstorm: List all potential actions/ideas (20+ encouraged)
  - Rate: Each idea scored on Impact (1-3) and Ease (1-3)
  - Prioritize: Auto-sort by combined score, highest first
  - Big Rocks: Top 5 priorities for 90-day focus
- **Expected outputs:** Prioritized action list, Big Rocks selection, quarterly targets

### Current Implementation
- **Steps:** Cover -> Intro (email collection) -> Brainstorm & Rate (20-row table with Impact/Ease selects) -> Results (sorted list, top 5 highlighted, submit)
- **Question keys (FROZEN):** quarterly_targets, impact_ease_matrix, big_rocks, elephant_breakdown
- **Reference keys:** performance.goals.quarterly_targets, performance.goals.impact_ease_matrix, performance.goals.big_rocks, performance.goals.elephant_breakdown
- **Dependencies consumed:** identity.dream.narrative (from dream), performance.cash.power_of_one (from cash)
- **Dependencies produced:** quarterly_targets, big_rocks (used by focus, performance, meeting-rhythm)
- **AI challenge:** final submit only

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Brainstorm (20+ ideas) | open-ended list | 20 rows provided | PASS |
| Impact/Ease rating | 1-3 per dimension | Yes, select dropdowns | PASS |
| Auto-sort by score | highest first | Yes | PASS |
| Big Rocks (top 5) | quarterly priorities | Extracted via .slice(0,5) | PASS |
| Color-coded badges | visual scoring | Yes (green/orange/red) | PASS |
| Dependency loading | dream + cash context | Yes, DependencyContext component | PASS |
| Validation | min 5 ideas 10+ chars | Yes | PASS |
| CONFIG.STORAGE_KEY | defined | undefined in CONFIG | MINOR bug |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |

**Missing:** CONFIG.STORAGE_KEY definition (autosave may use wrong key)
**Wrong:** Nothing contradicts course content
**Extra:** PDF export, elephant_breakdown mapping

### Fix Priority: P3
### Fix Scope: S (fix STORAGE_KEY, fix placeholders)

---

## Tool 09: Focus & Discipline (slug: focus)

**Classification:** reflection + assessment + planning (dual-path: individual 8-step + team WWW)
**Completion:** individual-or-team (user chooses at start)
**Meeting phase:** before (individual) or during (team discussion)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-09-focus/content.md` (Sprint 10: Focus, Discipline & Productivity)

- **Purpose:** Design personal focus system across 4 elements: Focus, Flow, Discipline, Habits
- **Framework:** Empty Brain + Impact/Easy Matrix, Daily Plan (top 3 + time blocks), Eliminate/Limit/Delegate, Distraction Reduction, Key Routines, 3 Daily Routines (Trigger-Action-Reward), Flow State Priming
- **Key questions it MUST ask:**
  - Individual (8 steps): brain dump tasks, impact/ease categorization, top 3 priorities + schedule, eliminate/limit/delegate lists + actions, digital/physical distractions + mitigation, morning/work/break/end routines, 3 habit loops (T-A-R), flow state elements (goals, challenge-skill, environment, ritual, feedback)
  - Team: focus patterns, productivity challenges, collective habits, WWW analysis
- **Expected outputs:** Prioritized task matrix, daily schedule, elimination plan, 3 core routines, flow readiness checklist

### Current Implementation
- **Steps:** Cover -> Intro (mistakes + path selection) -> [Individual: 8 sequential steps] or [Team: 1 unified form] -> Canvas -> Submit
- **Question keys (FROZEN):** golden_hour, distraction_plan, daily_reflection, team_rituals
- **Reference keys:** performance.focus.golden_hour, performance.focus.distraction_plan, performance.focus.daily_reflection, performance.focus.team_rituals
- **Dependencies consumed:** (loads from DI config if available)
- **Dependencies produced:** golden_hour, daily_reflection (advisory — not heavily consumed downstream)
- **AI challenge:** final submit only (no per-step gating)

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| 8 individual steps | all 4 elements covered | Yes, all 8 steps match content | PASS |
| Team path | WWW + dynamics | Yes, 1-step team form | PASS |
| Impact/Easy matrix | 4 quadrants | Yes, color-coded | PASS |
| Trigger-Action-Reward | 3 daily routines | Yes, 3 x 4 fields | PASS |
| Flow State (5 elements) | goals, challenge-skill, environment, ritual, feedback | Yes, 5 textareas | PASS |
| Eliminate/Limit/Delegate | 3 categories x 2 parts | Yes | PASS |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |

**Missing:** Tune-in questions, mind rehearsal step
**Wrong:** Nothing contradicts course content
**Extra:** None

### Fix Priority: P3
### Fix Scope: S (fix placeholders)

---

## Tool 10: Performance & Accountability (slug: performance)

**Classification:** assessment + calculator (5 Whys, 80/20, Impact/Easy, accountability framework)
**Completion:** individual-or-team (dual-path: Individual Process Tools + Team Systems)
**Meeting phase:** before (individual analysis) + during (team systems)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-10-performance/` (Sprint 05: Performance Analysis)

- **Purpose:** Translate quarterly targets into actionable frameworks by identifying root causes of underperformance and building accountability systems
- **Framework:** 5 Whys (root cause), 80/20 Principle (vital few vs trivial many), Impact-Easy Matrix (prioritization), Performance Dashboard + Accountability Framework
- **Key questions it MUST ask:**
  - Individual: Problem + 5 Whys + root cause + solution; Objective + 5 inputs + ranking + vital few; Objective + 8 ideas + matrix placement; Expectations + ownership + checkpoints + consequences + rewards
  - Team: 5 tasks with status/reason/owner, dashboard metrics, review cadence; accountability roles + framework + transparency + timeline
- **Expected outputs:** Root cause analysis, 80/20 rankings, prioritized matrix, accountability framework, performance dashboard

### Current Implementation
- **Steps:** Cover -> Path Selection -> [Individual: 4 steps (5 Whys, 80/20, Impact/Easy, Accountability)] or [Team: 2 steps (Performance System, Accountability System)] -> Canvas -> Submit
- **Question keys (FROZEN):** execution_dashboard, five_why, consequences_table
- **Reference keys:** performance.accountability.execution_dashboard, performance.accountability.five_why, performance.accountability.consequences
- **Dependencies consumed:** goals.quarterly_targets, values.cool_not_cool, values.red_lines, cash.top_priority
- **Dependencies produced:** execution_dashboard (used by meeting-rhythm)
- **AI challenge:** final submit only (no per-step gating)

### Gap Analysis: MODERATE

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| 5 Whys | problem → 5 whys → root cause → solution | Yes, all fields present | PASS |
| 80/20 Principle | objective + inputs + ranking | Yes | PASS |
| Impact/Easy Matrix | 8 ideas + 4 quadrants | Yes | PASS |
| Accountability Framework | expectations/ownership/checkpoints/consequences | Yes | PASS |
| Team Performance System | tasks + dashboard + review cadence | Yes | PASS |
| Team Accountability | roles + framework + transparency + timeline | Yes | PASS |
| Dependency auto-load | useEffect pattern | NOT implemented (missing useEffect) | MODERATE gap |
| Per-step AI review | intermediate validation | Final only (no reviewStep) | MINOR gap |
| Form validation | required fields | None (empty fields accepted) | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] throughout | MINOR |

**Missing:** Dependency auto-load (useEffect pattern missing — deps configured in DI but not loaded in HTML), per-step AI review, form validation
**Wrong:** Nothing contradicts course content
**Extra:** None

### Fix Priority: P1
### Fix Scope: M (add useEffect dependency loading, add validation, fix placeholders)

---

## Tool 11: Meeting Rhythm (slug: meeting-rhythm)

**Classification:** planning + assessment (meeting cadence design + evaluation)
**Completion:** individual-then-team
**Meeting phase:** before (individual planning) + during (team review)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-11-meetings/` (Sprint 12: Meeting Rhythm)

- **Purpose:** Establish operational rhythm bridging strategy to execution — daily huddles (15 min), weekly tacticals (60 min), monthly strategics (half-day)
- **Framework:** Priorities Breakdown → Meeting Readiness → Meeting Evaluation → Big Rock Discussion → Rhythm Dates Canvas
- **Key questions it MUST ask:**
  - Step 1: Quarterly priorities with hours breakdown and task decomposition
  - Step 2: Meeting purpose, participants, agenda items (topic/owner/duration), pre-materials, roles (facilitator/scribe/timekeeper)
  - Step 3: Meeting evaluation (date, type, effectiveness, what worked, what didn't, improvements)
  - Step 4: Big Rock issue, problem statement, root cause, proposed solutions, WWW (Who/What/When)
- **Expected outputs:** Quarterly priorities breakdown, meeting template, evaluation framework, Big Rock resolution process

### Current Implementation
- **Steps:** Cover -> Intro (user details) -> Step 1 (Priorities Breakdown) -> Step 2 (Meeting Readiness) -> Step 3 (Meeting Evaluation) -> Step 4 (Big Rock Discussion) -> Canvas (Rhythm Dates)
- **Question keys (FROZEN):** rhythm_dates
- **Reference keys:** performance.meetings.rhythm_dates
- **Dependencies consumed:** goals.quarterly_targets, performance.execution_dashboard, cash.top_priority
- **Dependencies produced:** rhythm_dates (end of performance module chain)
- **AI challenge:** per-step review (reviewStep) + final submit — best practice among Module 2 tools

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Priorities breakdown | quarterly priorities + hours + tasks | Yes | PASS |
| Meeting readiness | purpose, participants, agenda, roles | Yes, all fields | PASS |
| Meeting evaluation | effectiveness assessment | Yes | PASS |
| Big Rock discussion | issue → root cause → solutions → WWW | Yes | PASS |
| Dependency auto-load | useEffect pattern | Yes, correctly implemented | PASS |
| Per-step AI review | intermediate validation | Yes, reviewStep on all 4 steps | PASS |
| Form validation | required fields | None (empty accepted) | MINOR gap |
| Effectiveness rating | enum/scale | free-text (should be 1-5 scale) | MINOR gap |
| Submission key naming | semantic | "rhythm_dates" (misleading — contains all data) | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |

**Missing:** Form validation, effectiveness enum
**Wrong:** Nothing contradicts course content
**Extra:** None

### Fix Priority: P3
### Fix Scope: S (fix placeholders, add effectiveness enum)

---

## Priority Summary (Session 2 Tools)

| Tool | Gap Rating | Priority | Scope | Key Issue |
|------|-----------|----------|-------|-----------|
| 06-cash | MINOR | P2 | S | BS validation, currency hardcoded, placeholders |
| 07-energy | MINOR | P2 | S | Incomplete validation, placeholders |
| 08-goals | MINOR | P3 | S | CONFIG.STORAGE_KEY undefined, placeholders |
| 09-focus | MINOR | P3 | S | Placeholders only |
| 10-performance | MODERATE | P1 | M | Missing useEffect dependency loading, no form validation |
| 11-meeting-rhythm | MINOR | P3 | S | Placeholders, effectiveness should be enum |

**Common pattern:** [PLACEHOLDER] content in cognitive load components persists across all 6 tools. Tool 10 (Performance) is the only P1 — it's missing the dependency auto-load pattern that all other tools have.

---

## Frozen Question Keys Reference (Session 2)

### cash (6 keys)
story_report, power_of_one, action_sheets, top_priority, ler_ratio, action_plan

### energy (4 keys)
energy_audit, habit_commitments, team_strategies, energy_woop

### goals (4 keys)
quarterly_targets, impact_ease_matrix, big_rocks, elephant_breakdown

### focus (4 keys)
golden_hour, distraction_plan, daily_reflection, team_rituals

### performance (3 keys)
execution_dashboard, five_why, consequences_table

### meeting-rhythm (1 key)
rhythm_dates

---

## Session 3 Scope (Next: Tools 12-21)
Tools: market-size, segmentation, target-segment, value-proposition, vp-testing, product-development, pricing, brand-marketing, customer-service, route-to-market (Modules 3-5: Market, Strategy, Execution)
