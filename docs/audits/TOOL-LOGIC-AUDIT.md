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

## Tool 12: Market Size (slug: market-size)

**Classification:** calculator + brainstorm (TAM-SAM-SOM + driving forces)
**Completion:** individual-only
**Meeting phase:** before
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-12-market-size/content.md` (Sprint 13: Market Size)

- **Purpose:** Calculate TAM (Total Addressable Market) + driving forces + 3-year forecast
- **Framework:** TAM-SAM-SOM model + driving forces impact analysis
- **Key questions:** Total customers x avg spending x purchases/year = market size; gross margin = profit pool; brainstorm 30-40 driving forces; score by impact (1-5) + probability (1-5); rank top 7; project 3-year impact
- **Expected outputs:** Current market size + profit pool, top 7 driving forces ranked, 3-year market forecast

### Current Implementation
- **Steps:** Cover -> Setup -> Step 1 (market inputs: 4 phases) -> Transition -> Step 2 (forces: list/score/rank) -> Step 3 (3-year impact analysis) -> Submit
- **Question keys (FROZEN):** tam, driving_forces
- **Reference keys:** market.size.tam, market.size.driving_forces
- **Dependencies consumed:** none
- **Dependencies produced:** tam (used by segmentation)
- **AI challenge:** reviewStep gates steps 1-2; submitWithChallenge on final
- **Special:** Force scoring formula = (2 x impact) + probability (additive, not multiplicative)

### Gap Analysis: MODERATE

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| TAM calculation | customers x spending x purchases | Yes, 3 inputs + auto-calc | PASS |
| Profit pool | gross margin applied | Yes | PASS |
| Driving forces list | 30-40 brainstorm | Unlimited, min 3 | PASS |
| Force scoring | impact x probability | (2 x impact) + probability | DIFFERENT formula |
| Top 7 ranking | sorted display | Yes, ranked with badges | PASS |
| 3-year forecast | per-force impact x 4 variables | Yes, compounding logic | PASS |
| SAM/SOM breakdown | explicit fields | Only TAM (no SAM/SOM) | GAP |
| PDF export | downloadable | Not implemented | GAP |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |

**Missing:** SAM/SOM fields (TAM-only), PDF export, scoring formula documentation
**Wrong:** Scoring formula is additive not multiplicative (may be intentional)

### Fix Priority: P1
### Fix Scope: M (document/fix scoring formula, consider SAM/SOM, add PDF export, fill placeholders)

---

## Tool 13: Segmentation (slug: segmentation-target-market)

**Classification:** canvas + assessment (behavioral segmentation + attractiveness ranking)
**Completion:** individual-then-team
**Meeting phase:** before
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-13-segmentation/content.md` (Sprint 04: Segmentation)

- **Purpose:** Define behavior-driven market segments, quantify size/value, rank by attractiveness, focus on 2-3 targets
- **Framework:** Jobs-to-be-Done + weighted attractiveness index (size, growth, profitability, fit)
- **Key questions:** 5-7 behavior-based segments (name + description + behaviors); quantify each (total market x accessible x avg revenue = value); score attractiveness (4 criteria x 1-10, weighted); target selection with market share goals
- **Expected outputs:** Segment definitions, quantified values, attractiveness ranking, target canvas

### Current Implementation
- **Steps:** Cover -> Intro (user details) -> Step 1 (define segments) -> Step 2 (quantify) -> Step 3 (attractiveness index) -> Step 4 (target selection + goals) -> Canvas
- **Question keys (FROZEN):** segments_list, primary_target
- **Reference keys:** market.segments.list, market.segments.primary_target
- **Dependencies consumed:** none registered (should load TAM from market-size)
- **Dependencies produced:** primary_target (used by target-segment)
- **AI challenge:** reviewStep gates all 4 steps; submitWithChallenge on canvas

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Behavioral segments | 5-7 range | Dynamic, min 1 (should enforce 5-7) | MINOR gap |
| Quantification | accessible x avg revenue = value | Yes, auto-calculated | PASS |
| Weighted scoring | user-defined weights totaling 100% | Yes, validated | PASS |
| Attractiveness 1-10 | 4 criteria per segment | Yes | PASS |
| Target count | 2-3 recommended | No enforcement | MINOR gap |
| Market share goals | current %, target %, timeline | Yes | PASS |
| Market-size dependency | load TAM | Not implemented | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |

**Missing:** Segment count enforcement (5-7), target count guidance (2-3), market-size dependency
**Wrong:** Nothing contradicts content

### Fix Priority: P2
### Fix Scope: S (add count guidance, integrate market-size, fill placeholders)

---

## Tool 14: Target Segment Deep Dive (slug: target-segment-deep-dive)

**Classification:** assessment + canvas (customer interviews + pains/needs/gains prioritization)
**Completion:** individual-only
**Meeting phase:** before (research phase)
**Data risk:** MEDIUM (2 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-14-target-segment/content.md` (Sprint 31: Target Segment)

- **Purpose:** Conduct 1-5 customer interviews, uncover pains/needs/gains, prioritize by severity/frequency/impact, synthesize customer profile
- **Framework:** The Mom Test (past behavior, not hypothetical) + Pains-Needs-Gains prioritization matrices
- **Key questions:** Define target segment + interview objective + 3+ interview questions; capture 1-5 interviews (profile, pains, needs, gains, quotes, observations); score each item (severity + frequency + impact) x 2; synthesize: core profile, top 3 pains/needs/gains, insights, strategic implications
- **Expected outputs:** Interview guide, interview notes, prioritization matrices, summary canvas

### Current Implementation
- **Steps:** Cover -> Setup -> Step 1 (interview guide) -> Step 2 (interview notes) -> Step 3 (prioritization matrices) -> Step 4 (summary) -> Canvas
- **Question keys (FROZEN):** pains_matrix, persona, needs_gains, interview_summary
- **Reference keys:** strategy.target.pains_matrix, strategy.target.persona, strategy.target.needs_gains, strategy.target.interview_summary
- **Dependencies consumed:** segmentation primary_target (should auto-load)
- **Dependencies produced:** persona, pains_matrix, needs_gains (used by value-proposition)
- **AI challenge:** reviewStep gates all 4 steps; submitWithChallenge on canvas

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Interview guide | segment + objective + 3+ Qs | Yes, validated | PASS |
| 1-5 interviews | dynamic array | Yes, min 1, max 5 | PASS |
| Pains/Needs/Gains matrices | severity + frequency + impact scoring | Yes, score = (S+F+I) x 2 | PASS |
| Summary synthesis | core profile + top 3 + insights | Yes, all fields | PASS |
| Segmentation dependency | load target segment | DependencyContext present, loads via ToolDB | PASS |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |

**Missing:** Top 3 enforcement in matrices, Pains/Needs/Gains glossary
**Wrong:** Nothing

### Fix Priority: P2
### Fix Scope: S (fill placeholders, add top-3 enforcement)

---

## Tool 15: Value Proposition (slug: value-proposition)

**Classification:** strategy framework (VP formula + competitor analysis + stress test)
**Completion:** individual-then-team
**Meeting phase:** before (individual crafts) + during (team finalizes)
**Data risk:** MEDIUM (4 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-15-value-proposition/content.md` + LMS 18_blue_ocean + 26_mastering_vp

- **Purpose:** Craft a clear, differentiated value proposition using the Fast Track Formula
- **Framework:** Fast Track VP Formula: "For [target segment] who struggle with [pain], we provide [solution] that [core benefit], unlike [competitor weakness]" + Anti-Promise + 8-point stress test
- **Key questions:** Define customer pain (from target segment); competitor analysis (3-5: name, strength, weakness, differentiation); craft VP using formula; define anti-promise; 8-point yes/no validation
- **Expected outputs:** VP statement, competitor differentiation map, anti-promise, validation score

### Current Implementation
- **Steps:** Cover -> Step 1 (Define Problem) -> Step 2 (Find Your Edge: competitors) -> Step 3 (Craft Statement: formula + anti-promise) -> Step 4 (Stress Test: 8-point checklist) -> Canvas
- **Question keys (FROZEN):** vp_statement, anti_promise, pain_mapping, differentiators
- **Reference keys:** strategy.vp.statement, strategy.vp.anti_promise, strategy.vp.pain_mapping, strategy.vp.differentiators
- **Dependencies consumed:** target segment persona + pains (from target-segment-deep-dive)
- **Dependencies produced:** vp_statement (used by vp-testing, product-dev, brand-marketing, employer-branding)
- **AI challenge:** reviewStep + submitWithChallenge

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Pain definition | from target segment | Step 1 text fields | PASS |
| Competitor grid | 3-5 with analysis | Dynamic competitor array | PASS |
| VP formula | 5 components | Template with all 5 | PASS |
| Anti-promise | explicit exclusions | Textarea field | PASS |
| 8-point stress test | binary validation | Step 4 checklist | PASS |
| Live preview | yellow-highlighted formula | Yes | PASS |
| Dependency load | target segment data | useEffect + ToolDB.getDependency | PASS |
| Validation method | customer feedback (LMS) | self-assessment checklist | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |

**Missing:** Real customer validation (self-checklist vs external feedback)
**Wrong:** Nothing contradicts framework

### Fix Priority: P2
### Fix Scope: S (fill placeholders, consider adding customer validation note)

---

## Tool 16: VP Testing (slug: value-proposition-testing)

**Classification:** validation (customer interview-based VP testing)
**Completion:** individual-then-team
**Meeting phase:** before (interviews) + during (team reviews)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-16-vp-testing/content.md` (Sprint 03: VP Test)

- **Purpose:** Turn VP assumptions into certainty via real customer validation interviews (30-40 min each)
- **Framework:** Structured interview (reconfirm problem -> present VP -> test CTA -> capture reactions) + consistency metric (6+ of 8 customers consistent = ready)
- **Key questions:** Customer clarity reactions, hesitation tracking, reinterpretation notes, CTA testing ("what would make you act?"), consistency analysis
- **Expected outputs:** Customer feedback array, pattern analysis, reality log, final VP (locked or iterate), next steps

### Current Implementation
- **Steps:** Preparation -> Customer Feedback -> Comparison Results -> Reality Log -> Finalize & Next Steps
- **Question keys (FROZEN):** customer_feedback, comparison_results, reality_log, final_vp, next_steps
- **Reference keys:** strategy.testing.customer_feedback, strategy.testing.comparison, strategy.testing.reality_log, strategy.testing.final_vp, strategy.testing.next_steps
- **Dependencies consumed:** vp_statement from value-proposition tool
- **Dependencies produced:** final_vp (locked version)
- **AI challenge:** reviewStep + submitWithChallenge

### Gap Analysis: MAJOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Structured interview guide | 5-step meeting structure | Not visible in implementation | MAJOR gap |
| Customer feedback array | 8-10 customer records | Likely basic input (not structured per-customer) | MAJOR gap |
| Consistency metric | 6/8+ = ready | No decision rule visible | MAJOR gap |
| Hesitation tracking | binary + severity | Not explicit mechanism | MAJOR gap |
| CTA testing | "what would make you act?" | Not visible | MAJOR gap |
| Pattern analysis | auto-detect common themes | Not visible | MAJOR gap |
| VP dependency load | auto-load from T15 | ToolDB.getDependency pattern | PASS |
| Placeholder content | final | [PLACEHOLDER] | MINOR |

**Missing:** Core validation flow — structured interview template, per-customer feedback records, consistency decision rule, hesitation tracking, CTA field
**Wrong:** Tool may conflate discovery with validation (should be pure validation)

### Fix Priority: P0
### Fix Scope: L (requires 5-6 new steps, structured interview logic, pattern analysis)

---

## Tool 17: Product Development (slug: product-development)

**Classification:** canvas + strategy (product portfolio with strategic roles)
**Completion:** individual-then-team
**Meeting phase:** before + during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-17-product-development/content.md` (Sprint 29: Product Portfolio)

- **Purpose:** Design product portfolio aligned to market segments and VP, using strategic role assignments
- **Framework:** Strategic Roles — Storytellers (<10%, brand-building), Sales Contributors (70-80%, revenue), Profit Contributors (10-20%, margin protection). Process: list features -> interview customers on WTP -> bundle into products -> assign roles
- **Key questions:** List 10-15 key features; customer WTP interviews; bundle features into products; assign Storyteller/Sales/Profit roles; portfolio strategy alignment
- **Expected outputs:** Feature list with WTP data, product bundles with strategic roles, portfolio summary

### Current Implementation
- **Steps:** (Standard 4-5 step structure with cover/intro/steps/canvas)
- **Question keys (FROZEN):** feature_list, portfolio
- **Reference keys:** execution.product.feature_list, execution.product.portfolio
- **Dependencies consumed:** VP from value-proposition-testing
- **Dependencies produced:** portfolio (used by pricing)

### Gap Analysis: MAJOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Feature listing | 10-15 features | Likely present (basic) | Needs verification |
| WTP data collection | customer willingness to pay | Not visible in structure | MAJOR gap |
| Strategic role framework | Storyteller/Sales/Profit | Not visible | MAJOR gap |
| Product bundling UI | combine features into products | Not visible | MAJOR gap |
| Role distribution rules | <10% storytellers, 70-80% sales, 10-20% profit | Not visible | MAJOR gap |
| Placeholder content | final | [PLACEHOLDER] | MINOR |

**Missing:** Strategic role framework, WTP data, bundling logic, role distribution rules
**Wrong:** May treat as simple feature list rather than strategic portfolio

### Fix Priority: P0
### Fix Scope: L (requires strategic role UI, WTP inputs, bundling workflow)

---

## Tool 18: Pricing (slug: pricing)

**Classification:** calculator + strategy (value-based pricing with feature classification)
**Completion:** individual-then-team
**Meeting phase:** before + during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-18-pricing/content.md` (Sprint 30: Pricing)

- **Purpose:** Set strategy-driven pricing using price-first thinking (not cost-plus)
- **Framework:** Feature Classification (Must-Have/Nice-to-Have/Killer) -> Anchor Price -> Tier Design (2-3 max) -> Margin Validation
- **Key principle:** "Pricing is the fastest profit lever. 1% price increase = ~11% profit increase."
- **Key questions:** Classify features; choose anchor (premium/mid/entry); design 2-3 tiers with feature bundles; validate margins; competitor benchmark
- **Expected outputs:** Feature classification, pricing tiers, anchor price, margin projections

### Current Implementation
- **Steps:** (Standard structure with cover/intro/steps/canvas)
- **Question keys (FROZEN):** pricing_tiers, anchor_price
- **Reference keys:** execution.pricing.tiers, execution.pricing.anchor
- **Dependencies consumed:** portfolio from product-development
- **Dependencies produced:** pricing_tiers (end of strategy chain)

### Gap Analysis: MAJOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Feature classification | Must-Have/Nice-to-Have/Killer | Not visible | MAJOR gap |
| Anchor selection | premium/mid/entry decision | Not visible | MAJOR gap |
| Tier design | 2-3 tiers with feature bundles | Not visible | MAJOR gap |
| Margin calculator | cost structure -> margin per tier | Not visible | MAJOR gap |
| Competitor benchmarks | 3-5 competitor prices | Not visible | MAJOR gap |
| Price-first logic | "price before product" | Not visible | MAJOR gap |
| Placeholder content | final | [PLACEHOLDER] | MINOR |

**Missing:** Feature classification UI, anchor decision framework, tier bundling, margin calculator, competitor benchmarks
**Wrong:** May default to simple price entry vs strategic pricing workflow

### Fix Priority: P0
### Fix Scope: L (requires feature classification, tier logic, margin calculations)

---

## Tool 19: Brand & Marketing (slug: brand-marketing)

**Classification:** strategy execution (brand promise + cult brand model + marketing roadmap)
**Completion:** individual-then-team
**Meeting phase:** before + during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-19-brand/content.md` (Sprint 28: Brand Marketing)

- **Purpose:** Build a brand rooted in strategic clarity and emotional truth, then translate into marketing action
- **Framework:** 5-step: Brand Promise -> Brand Personality -> Cult Brand Model (employee + consumer alignment) -> Marketing Strategy (messaging pillars) -> Implementation Plan
- **Key questions:** Brand promise (emotional transformation), personality traits + voice + archetype, cult model (employee belief vs customer experience), messaging pillars (3+) + content strategy, implementation actions (3+) + metrics + consistency

### Current Implementation
- **Steps:** Cover -> Intro -> Step 1 (Brand Promise: 4 fields) -> Step 2 (Personality: traits + voice + archetype) -> Step 3 (Cult Brand: employee + consumer) -> Step 4 (Marketing: pillars + content) -> Step 5 (Implementation: actions + metrics) -> Canvas
- **Question keys (FROZEN):** cult_model, roadmap
- **Reference keys:** execution.brand.cult_model, execution.brand.roadmap
- **Dependencies consumed:** value proposition (from T15)
- **AI challenge:** reviewStep per step + submitWithChallenge

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Brand promise | emotional core | 4 textareas (promise, connection, VP transform, enemy) | PASS |
| Personality | traits + voice + archetype | Dynamic traits + voice + archetype fields | PASS |
| Cult model | employee + consumer alignment | 6 fields (3 employee, 3 consumer) | PASS |
| Marketing strategy | pillars + content | Dynamic pillars + content strategy | PASS |
| Implementation | actions + metrics + consistency | Dynamic actions + metrics + checklist | PASS |
| Placeholder content | final | [PLACEHOLDER] in cognitive load | MINOR |

**Missing:** Cognitive load content only
**Wrong:** Nothing

### Fix Priority: P2
### Fix Scope: S (fill placeholders)

---

## Tool 20: Customer Service (slug: customer-service)

**Classification:** canvas + planning (customer journey map + WOW moments + implementation)
**Completion:** individual-then-team
**Meeting phase:** before + during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-20-customer-service/content.md` (Sprint 23: Customer Service)

- **Purpose:** Transform customer service from reactive to strategic by mapping touchpoints, designing WOW moments, and assigning ownership
- **Framework:** 5-step: Journey Map (5-8 stages) -> WOW Touchpoints (3) -> "Just Better" Improvements (3) -> Ownership & Metrics -> Implementation Plan
- **Key questions:** 5-8 journey stages (goal/action/thought per stage); 3 WOW moments (memorable/emotional/action/measurement); 3 reliability improvements; 6 touchpoint owners with KPIs; execution plan + communication + tracking + quarterly review

### Current Implementation
- **Steps:** Cover -> Intro -> Step 1 (Journey: dynamic stages) -> Step 2 (WOW: 3 fixed) -> Step 3 (Just Better: 3 fixed) -> Step 4 (Ownership: 6 rows) -> Step 5 (Implementation: 4 textareas) -> Canvas
- **Question keys (FROZEN):** journey_map, service_standards
- **Reference keys:** execution.service.journey_map, execution.service.standards
- **Dependencies consumed:** none registered (should link to segment/VP)
- **AI challenge:** reviewStep + submitWithChallenge

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Journey stages | 5-8 dynamic | Dynamic, min 5 enforced | PASS |
| WOW moments | 3 fixed | 3 entries with 4 fields each | PASS |
| Just Better | 3 improvements | 3 entries with 4 fields each | PASS |
| Ownership grid | 6 touchpoints | 6 preset rows | PASS |
| Implementation | 4-part plan | 4 textareas | PASS |
| Dependency load | segment/VP | Not integrated | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] | MINOR |

**Missing:** Dependency integration with segment/VP tools, cognitive load content
**Wrong:** Nothing

### Fix Priority: P2
### Fix Scope: S (fill placeholders, add dependency config)

---

## Tool 21: Route to Market (slug: route-to-market)

**Classification:** planning + assessment (channel evaluation + scenario modeling + roadmap)
**Completion:** individual-then-team
**Meeting phase:** before + during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-21-route-to-market/content.md` (Sprint 08: Route to Market)

- **Purpose:** Define route-to-market strategy aligned with VP, evaluate channels, model scenarios, build implementation roadmap
- **Framework:** 5-step: Business Type -> RTM Options & Evaluation (5 yes/no criteria) -> Scenario Modeling -> RTM Decision (primary/secondary/rejected) -> Implementation Roadmap (30-day actions)
- **Key questions:** Business type (products vs services); 3+ RTM options with scoring; 2+ scenarios with viability; primary/secondary/rejected channels with rationale; 30-day actions + resources + ownership + metrics

### Current Implementation
- **Steps:** Cover -> Intro (business type) -> Step 1 (RTM Options: dynamic + 5 criteria) -> Step 2 (Scenarios: dynamic) -> Step 3 (RTM Decision: primary/secondary/rejected) -> Step 4 (Roadmap: 6 textareas) -> Canvas
- **Question keys (FROZEN):** channels, rtm_roadmap
- **Reference keys:** execution.rtm.channels, execution.rtm.roadmap
- **Dependencies consumed:** none registered (should link to VP + segment)
- **AI challenge:** reviewStep + submitWithChallenge
- **Special:** Business type selector changes labels contextually

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Business type | products vs services | Selector on intro | PASS |
| 3+ RTM options | dynamic with evaluation | Yes, add/remove + 5 criteria | PASS |
| 5-point scoring | yes/no criteria + tally | Yes, 0-5 score display | PASS |
| Scenario modeling | 2+ scenarios | Dynamic, min 2 | PASS |
| RTM decision | primary/secondary/rejected | All 3 with rationale fields | PASS |
| Implementation | 30-day + resources + ownership | 6 textarea fields | PASS |
| Help modal | context-specific | May be missing/incomplete | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] | MINOR |

**Missing:** Help modal (possibly incomplete), cognitive load content, dependency integration
**Wrong:** Nothing

### Fix Priority: P2
### Fix Scope: S (fill placeholders, verify help modal, add dependencies)

---

## Priority Summary (Session 3 Tools)

| Tool | Gap Rating | Priority | Scope | Key Issue |
|------|-----------|----------|-------|-----------|
| 12-market-size | MODERATE | P1 | M | Scoring formula, missing SAM/SOM, no PDF export |
| 13-segmentation | MINOR | P2 | S | Segment count guidance, market-size dependency |
| 14-target-segment | MINOR | P2 | S | Placeholders, top-3 enforcement |
| 15-value-proposition | MINOR | P2 | S | Placeholders, validation method note |
| **16-vp-testing** | **MAJOR** | **P0** | **L** | **Core validation flow missing (interviews, consistency rules)** |
| **17-product-development** | **MAJOR** | **P0** | **L** | **Strategic role framework + WTP + bundling missing** |
| **18-pricing** | **MAJOR** | **P0** | **L** | **Feature classification + tiers + margin calc missing** |
| 19-brand-marketing | MINOR | P2 | S | Placeholders only |
| 20-customer-service | MINOR | P2 | S | Placeholders, missing dependency config |
| 21-route-to-market | MINOR | P2 | S | Placeholders, help modal, missing dependency config |

**Critical finding:** Tools 16, 17, 18 form a broken chain (VP Testing -> Product Dev -> Pricing). All three have MAJOR gaps where the core frameworks from the LMS course content are not implemented. These are the only P0 items found in the entire audit so far.

---

## Frozen Question Keys Reference (Session 3)

### market-size (2 keys)
tam, driving_forces

### segmentation-target-market (2 keys)
segments_list, primary_target

### target-segment-deep-dive (4 keys)
pains_matrix, persona, needs_gains, interview_summary

### value-proposition (4 keys)
vp_statement, anti_promise, pain_mapping, differentiators

### value-proposition-testing (5 keys)
customer_feedback, comparison_results, reality_log, final_vp, next_steps

### product-development (2 keys)
feature_list, portfolio

### pricing (2 keys)
pricing_tiers, anchor_price

### brand-marketing (2 keys)
cult_model, roadmap

### customer-service (2 keys)
journey_map, service_standards

### route-to-market (2 keys)
channels, rtm_roadmap

---

## Tool 22: Core Activities (slug: core-activities)

**Classification:** canvas + planning (activity identification + process mapping)
**Completion:** individual-then-team
**Meeting phase:** before + during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-22-core-activities/content.md` (Sprint 27: Core Activities)

- **Purpose:** Identify 5 core activities that deliver the value proposition, then map processes + KPIs
- **Framework:** 80/20 principle — 20% of activities = 80% of value delivery
- **Key questions:** What's our VP? What activities must we master? What 3 processes per activity? What KPI per process?
- **Expected outputs:** Top 5 core activities, 3 processes per activity with KPIs

### Current Implementation
- **Steps:** Cover -> Intro -> Step 1 (VP + brainstorm + select top 5 + review) -> Step 2 (Processes & KPIs per activity) -> Canvas
- **Question keys (FROZEN):** top5_activities, activity_owners
- **Reference keys:** org.activities.top5, org.activities.owners
- **Dependencies consumed:** none implemented (should load from dream, team, values)
- **Dependencies produced:** top5 (used by processes-decisions)
- **AI challenge:** 4 step reviews + final submit

### Gap Analysis: MODERATE

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| VP context | loaded from upstream | Not auto-loaded (no dependency injection) | MODERATE gap |
| Top 5 selection | from brainstorm | Yes, 4-phase flow | PASS |
| Processes per activity | 3 per activity + KPIs | Yes | PASS |
| Export | PDF | Text only (no PDF) | MINOR gap |
| Placeholder content | final | [PLACEHOLDER] | MINOR |

**Missing:** Dependency injection from prior tools, PDF export
**Wrong:** Nothing

### Fix Priority: P1
### Fix Scope: M (add dependency loading, add PDF export, fill placeholders)

---

## Tool 23: Processes & Decisions (slug: processes-decisions)

**Classification:** canvas + planning (decisions -> data -> capabilities -> gap analysis)
**Completion:** individual-then-team
**Meeting phase:** before + during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-23-processes/content.md` (Sprint 19: Core Decisions)

- **Purpose:** Clarify core decisions, data inputs, KPIs, required capabilities, and capability gaps per activity
- **Framework:** Decisions -> Data -> Capabilities -> Gap Analysis (4-step progressive disclosure)
- **Key questions:** What 3-5 decisions per activity? What data fuels them? What 2-4 KPIs measure success? What capabilities required (human, systemic, relational)? What gaps exist?
- **Expected outputs:** Decision rights, KPI scoreboard, capability gap analysis, development plan

### Current Implementation
- **Steps:** Cover -> Intro -> Step 1 (Decisions: 3+ per activity with frequency + impact) -> Step 2 (Data & KPIs) -> Step 3 (Capabilities) -> Step 4 (Gap Analysis + Development Plan) -> Canvas
- **Question keys (FROZEN):** decision_rights, top3_per_activity, capabilities, kpi_scoreboard
- **Reference keys:** org.processes.decision_rights, org.processes.top3_per_activity, org.processes.capabilities, org.processes.kpi_scoreboard
- **Dependencies consumed:** core activities from core-activities tool (loaded via DI)
- **Dependencies produced:** decision_rights, capabilities (used by org-redesign)
- **AI challenge:** 4 step reviews + final submit
- **Special:** Transition screens at 25/50/75/100%, help modals per step, PDF export

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Decisions per activity | 3-5 with frequency + impact | Yes, validated (3+ decisions, 20+ chars) | PASS |
| Data inputs | per decision | Yes, 50+ chars required | PASS |
| KPIs | 2-4 per activity | Yes, 2+ required | PASS |
| Capabilities assessment | human/systemic/relational | Yes, 100+ chars | PASS |
| Gap analysis | current vs required | Yes, 50+ chars each | PASS |
| Development plan | actionable | Yes, 100+ chars | PASS |
| Dependency auto-load | core activities | Implemented | PASS |
| Placeholder content | final | [PLACEHOLDER] in case studies | MINOR |

**Missing:** Case study content
**Wrong:** Nothing

### Fix Priority: P2
### Fix Scope: S (fill placeholders)

---

## Tool 24: FIT ABC Analysis (slug: fit-abc-analysis)

**Classification:** assessment (team member evaluation + ABC classification)
**Completion:** team-only (manager evaluates team)
**Meeting phase:** during (guru-facilitated)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-24-fit-abc/content.md` (Sprint 11: FIT ABC)

- **Purpose:** Assess team members on FIT (Energy, Skill, Values, Impact) + classify as A/B/C players
- **Framework:** 4-dimensional FIT grid + 2x2 ABC matrix (Performance vs Values alignment)
- **Key questions:** Does role energize them? Do they have talents + skills? Are values aligned? Are they making measurable contribution? A-player = high FIT + high performance
- **Expected outputs:** FIT scores per member, ABC classification, talent gaps, A-player retention agreements

### Current Implementation
- **Steps:** (Full implementation details limited from 200-line read)
- **Question keys (FROZEN):** classification, talent_gaps, a_player_agreements
- **Reference keys:** org.abc.classification, org.abc.talent_gaps, org.abc.a_player_agreements
- **Dependencies consumed:** references Sprint 3 FIT data (from tool 05)
- **Dependencies produced:** classification (used by org-redesign)
- **AI challenge:** likely implemented

### Gap Analysis: MINOR (partial read)

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| FIT 4 dimensions | Energy, Skill, Values, Impact | Documented in content | PASS |
| ABC classification | A/B/C matrix | 3 question keys mapped | PASS |
| Talent gaps | identification | question key present | PASS |
| A-player agreements | retention | question key present | PASS |
| Placeholder content | final | Likely [PLACEHOLDER] | MINOR |

**Missing:** Full implementation verification needed (only partial HTML read)
**Wrong:** Nothing identified

### Fix Priority: P2
### Fix Scope: S (fill placeholders, verify full implementation)

---

## Tool 25: Org Redesign (slug: org-redesign)

**Classification:** planning + integration (Sprints 1-3 synthesis into implementation)
**Completion:** team-only (guru-facilitated)
**Meeting phase:** during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-25-org-redesign/content.md` (Sprint 21: Org Redesign)

- **Purpose:** Integrate core activities (Sprint 1), decisions/capabilities (Sprint 2), and FIT/ABC people assessments (Sprint 3) into implementation plan
- **Framework:** Current team assessment -> new role definitions -> decision matrix -> action plan + PDPs + 90-day roadmap + communication plan
- **Key questions:** Which people fit new roles? Who needs development (PDPs)? Who should transition out? What's the 90-day timeline? How to communicate changes?
- **Expected outputs:** Machine blueprint (org structure), right seats (people-role assignments), strategy shadow (implementation timeline)

### Current Implementation
- **Steps:** (Full implementation details limited from partial read)
- **Question keys (FROZEN):** machine_blueprint, right_seats, strategy_shadow
- **Reference keys:** org.redesign.machine_blueprint, org.redesign.right_seats, org.redesign.strategy_shadow
- **Dependencies consumed:** core-activities, processes-decisions, fit-abc outputs (all 3 prior sprints)
- **Dependencies produced:** org redesign plan (end of org module chain)
- **AI challenge:** likely implemented
- **Special:** Extensive content.md with 10 "implementation killer" pitfalls + guru scripts

### Gap Analysis: MINOR (partial read)

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Sprint 1-3 integration | explicit dependency loading | Content mentions pre-sprint checklist | Needs verification |
| Role assignment matrix | interactive | Implementation unclear | Needs verification |
| PDP framework | per-person plans | Content includes example (David) | PASS (in content) |
| 90-day roadmap | phased implementation | Content mentions phases 1-4 | PASS (in content) |
| Placeholder content | final | Likely [PLACEHOLDER] | MINOR |

**Missing:** Full implementation verification needed
**Wrong:** Nothing identified

### Fix Priority: P2
### Fix Scope: S (verify implementation, fill placeholders)

---

## Tool 26: Employer Branding (slug: employer-branding)

**Classification:** strategy + canvas (EVP formulation + recruitment strategy)
**Completion:** individual-then-team
**Meeting phase:** before + during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-26-employer-branding/content.md` (Sprint 25: Employer Branding)

- **Purpose:** Build Employer Value Proposition (EVP) and recruitment strategy
- **Framework:** 8-step: Target talent profile -> Internal truths -> Positioning -> Brand message -> Employee segmentation -> Needs ranking -> EVP formulation -> Recruitment strategy
- **Key questions:** Who are target employees? What are their top 5 needs? What single need do we promise to fulfill? How do we translate into message and recruitment?
- **Expected outputs:** EVP statement, employer brand message, recruitment playbook

### Current Implementation
- **Steps:** 6 steps (compressing 8 framework elements into fewer steps)
- **Question keys (FROZEN):** evp, recruitment_playbook
- **Reference keys:** people.employer.evp, people.employer.recruitment_playbook
- **Dependencies consumed:** dream, values (for employer brand alignment)
- **Dependencies produced:** EVP (end of people module chain)
- **AI challenge:** step reviews + final submit
- **Special:** 103KB HTML file (very large — complex multi-form tool)

### Gap Analysis: MODERATE

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| 8 framework steps | all covered | Compressed into 6 steps | MINOR (acceptable compression) |
| Target talent profile | who/skills/mindset | Likely present | Needs verification |
| Internal truths | culture strengths | Likely present | Needs verification |
| EVP formulation | focused promise | Question key present | PASS |
| Recruitment playbook | channels/filtering/hiring | Question key present | PASS |
| Step-framework mapping | clear labels | Step names unclear | MODERATE gap |
| Placeholder content | final | Likely [PLACEHOLDER] | MINOR |

**Missing:** Clear step-to-framework mapping labels, full verification of all 8 elements
**Wrong:** Nothing identified

### Fix Priority: P1
### Fix Scope: M (clarify step labels, verify coverage of all 8 framework elements, fill placeholders)

---

## Tool 27: Agile Teams (slug: agile-teams)

**Classification:** brainstorm + planning (problem prioritization + team charter)
**Completion:** team-only
**Meeting phase:** during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-27-agile/content.md` (Sprint 16: Agile Teams)

- **Purpose:** Form rapid-response agile squads for top organizational priorities
- **Framework:** 3-step: Brainstorm problems/opportunities -> Impact/Ease prioritization -> Define goal/rules/team/KPIs (charter)
- **Key concepts:** "Three Killers of Speed" (illusion of control, endless waiting, sequential chains), 2-week sprints, cross-functional teams
- **Key questions:** What are top pain points? Which 2-3 initiatives move needle fastest? What's the metric, team structure, and KPIs?
- **Expected outputs:** Team charter, sprint design (2-week cadence)

### Current Implementation
- **Steps:** 3-step flow (brainstorm -> prioritize -> charter)
- **Question keys (FROZEN):** team_charter, sprint_design
- **Reference keys:** people.agile.team_charter, people.agile.sprint_design
- **Dependencies consumed:** org structure context
- **Dependencies produced:** sprint_design (feeds execution)
- **AI challenge:** step reviews + final submit
- **Special:** 99KB HTML file

### Gap Analysis: MINOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Brainstorm phase | problems + opportunities | Yes (inferred) | PASS |
| Impact/Ease matrix | 1-3 scoring | JSON form (not Excel) | PASS (format change acceptable) |
| Top 2-3 selection | prioritization | Yes (inferred) | PASS |
| Team charter | goal/rules/team/KPIs | Question key present | PASS |
| Sprint design | 2-week cadence | Question key present | PASS |
| Playing-field rules | budget/scope/authority | Not visible | MINOR gap |
| Output vs outcome KPIs | distinction | Not visible | MINOR gap |
| Placeholder content | final | Likely [PLACEHOLDER] | MINOR |

**Missing:** Playing-field rules section, output vs outcome KPI distinction
**Wrong:** Nothing

### Fix Priority: P2
### Fix Scope: S (add playing-field rules, clarify KPIs, fill placeholders)

---

## Tool 28: Digitalization (slug: digitalization)

**Classification:** assessment + planning (dual-path: individual AI decisions + team strategy)
**Completion:** individual-then-team (2 modes)
**Meeting phase:** before (individual) + during (team synthesis)
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** `frontend/content/sprint-28-digital/content.md` (Sprint 06: Digitalization Made Simple)

- **Purpose:** Identify core decisions and processes to digitalize/automate with AI
- **Framework:** 5-step: Core decisions -> Data sources -> Technology platform -> APIs -> Eliminate human in critical decisions
- **Key questions:** What decisions consume most time? Which processes are most repetitive? What data is needed? What AI tools can automate? What success metrics?
- **Expected outputs:** Digital audit (top decisions + processes for AI), "Baby AI" implementation plan

### Current Implementation
- **Steps:** Intro (mode selection) -> [Individual: 3 steps (decisions, processes, implementation)] or [Team: 2 steps (analyses, plan)] -> Canvas
- **Question keys (FROZEN):** digital_audit, baby_ai
- **Reference keys:** tech.digital.audit, tech.digital.baby_ai
- **Dependencies consumed:** none explicit
- **Dependencies produced:** digital_audit (used by digital-heart)
- **AI challenge:** integrated
- **Special:** Dual-mode (individual/team) in same tool

### Gap Analysis: MAJOR

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Individual decisions (3+) | decision name + frequency + impact + data needs | Yes | PASS |
| Individual processes (3+) | process name + time + repetition + automation | Yes | PASS |
| AI tools selection | per decision/process | Yes | PASS |
| Team synthesis | pattern recognition across members | Unclear implementation | MAJOR gap |
| 3-week implementation plan | weekly milestones | Partial | MODERATE gap |
| Data source strategy | internal + external | Partial (individual only) | MINOR gap |
| Technology platform design | data lake concept | Not visible | MAJOR gap |
| API design | access strategy | Not visible | MAJOR gap |
| Framework alignment | 5-step digitalization | 3 individual + 2 team steps (different structure) | MODERATE gap |
| Placeholder content | final | [PLACEHOLDER] | MINOR |

**Missing:** Technology platform design, API strategy, clear team synthesis flow
**Wrong:** Framework is "digitalization" (org-level) but implementation focuses on "individual AI opportunities"

### Fix Priority: P0
### Fix Scope: L (redesign to align with 5-step framework, clarify individual/team flow)

---

## Tool 29: Digital Heart (slug: digital-heart)

**Classification:** planning + architecture (data lake blueprint + implementation plan)
**Completion:** individual-then-team
**Meeting phase:** before + during
**Data risk:** LOW (0 responses)

### Intended Logic (from course content)

**Source:** Sprint 07: AI Aggressive Digitalization — content documentation sparse/missing for this specific tool

- **Purpose:** Build a centralized data architecture ("digital heart") to serve all digitalized decisions
- **Framework:** 5-step: Core decisions -> Data sources -> Technology & collection -> APIs & access -> Implementation plan
- **Key questions:** What decisions drive the business? What internal/external data sources? What collection/storage/algorithms? How do users access insights (APIs/UI)? What's the phased rollout?
- **Expected outputs:** Blueprint (data architecture), implementation plan (phased rollout)

### Current Implementation
- **Steps:** Intro -> Step 1 (Core Decisions: 3+ with priority 1-10) -> Step 2 (Data Sources per decision: internal/external + quality + gaps) -> Step 3 (Technology: collection, storage, algorithms, processing, integration, security) -> Step 4 (APIs: endpoints, access, UI, training, controls) -> Step 5 (Implementation: timeline, actions, quick wins, resources, cost, metrics)
- **Question keys (FROZEN):** blueprint, implementation_plan
- **Reference keys:** tech.heart.blueprint, tech.heart.implementation_plan
- **Dependencies consumed:** should load from digitalization tool (not implemented)
- **Dependencies produced:** blueprint (end of tech module chain)
- **AI challenge:** likely integrated

### Gap Analysis: MODERATE

| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| Core decisions (3+) | with frequency + impact + priority | Yes, strict validation (50+ chars) | PASS |
| Data sources | internal + external per decision | Yes, quality + gaps | PASS |
| Technology platform | collection + storage + algorithms | Yes, 6 fields | PASS |
| API strategy | endpoints + access + UI | Yes, 6 fields | PASS |
| Implementation plan | phased rollout | Yes, 6 fields | PASS |
| Dependency from T28 | auto-load decisions | NOT implemented | MODERATE gap |
| Content documentation | brain juice + guides | MISSING (no content.md found) | MODERATE gap |
| Validation strictness | appropriate | Very strict (100+ chars for some fields) | MINOR (may frustrate users) |
| Placeholder content | final | Likely [PLACEHOLDER] | MINOR |

**Missing:** Dependency auto-load from digitalization tool, content documentation (no sprint content.md)
**Wrong:** Nothing structurally wrong — 5 steps match framework well

### Fix Priority: P1
### Fix Scope: M (add dependency loading, create content.md, relax validation, fill placeholders)

---

## Priority Summary (Session 4 Tools)

| Tool | Gap Rating | Priority | Scope | Key Issue |
|------|-----------|----------|-------|-----------|
| 22-core-activities | MODERATE | P1 | M | Missing dependency injection, no PDF export |
| 23-processes-decisions | MINOR | P2 | S | Placeholders only |
| 24-fit-abc | MINOR | P2 | S | Needs full verification, placeholders |
| 25-org-redesign | MINOR | P2 | S | Needs full verification, placeholders |
| 26-employer-branding | MODERATE | P1 | M | Step-framework mapping unclear, large file |
| 27-agile-teams | MINOR | P2 | S | Missing playing-field rules, placeholders |
| **28-digitalization** | **MAJOR** | **P0** | **L** | **Framework misalignment — individual AI vs org digitalization** |
| 29-digital-heart | MODERATE | P1 | M | Missing dependency + content docs, strict validation |

---

## Frozen Question Keys Reference (Session 4)

### core-activities (2 keys)
top5_activities, activity_owners

### processes-decisions (4 keys)
decision_rights, top3_per_activity, capabilities, kpi_scoreboard

### fit-abc-analysis (3 keys)
classification, talent_gaps, a_player_agreements

### org-redesign (3 keys)
machine_blueprint, right_seats, strategy_shadow

### employer-branding (2 keys)
evp, recruitment_playbook

### agile-teams (2 keys)
team_charter, sprint_design

### digitalization (2 keys)
digital_audit, baby_ai

### digital-heart (2 keys)
blueprint, implementation_plan

---

# MASTER PRIORITY SUMMARY — ALL 30 TOOLS

## P0 — Fix Immediately

**(Empty — deep reads revealed no P0 tools remain)**

Initial audit rated tools 16, 17, 18 as MAJOR/P0 based on partial reads (~200 lines).
Full HTML deep reads revealed these tools already implement their core frameworks:
- **16-vp-testing**: HAS 2-round interview flow, consistency checking, 7-point validation
- **17-product-dev**: HAS strategic roles (Storyteller/Top-Line/Profit), WTP testing
- **18-pricing**: HAS feature classification (Must-Have/Nice-to-Have/Killer), anchor + tiers

These tools are downgraded to P2 (minor polish only).

**28-digitalization** remains the highest-priority structural concern (individual AI focus vs org-wide digitalization framework from course), but it IS a dual-path tool (individual + team) with comprehensive implementation. Downgraded to P1.

## P1 — Fix Next (MODERATE gaps, structural issues)

| Tool | Module | Gap | Scope | Issue |
|------|--------|-----|-------|-------|
| 28-digitalization | Tech | MODERATE | M | Framework emphasis (individual AI vs org digitalization) |
| 10-performance | Performance | MODERATE | M | Missing useEffect dependency loading |
| 12-market-size | Market | MODERATE | M | Scoring formula + SAM/SOM + PDF export |
| 22-core-activities | Org | MODERATE | M | Missing dependency injection + PDF export |
| 26-employer-branding | People | MODERATE | M | Step-framework mapping unclear |
| 29-digital-heart | Tech | MODERATE | M | Missing dependency + content docs |

## P2 — Minor Fixes (MINOR gaps, content/polish)

| Tool | Module | Gap | Scope | Issue |
|------|--------|-----|-------|-------|
| 00-woop | Intro | MINOR | S | Pre-mortem scope |
| 02-dream | Identity | MINOR | S | Progress calc bug, dependency display |
| 03-values | Identity | MINOR | S | Missing cover image, question mappings |
| 04-team | Identity | MINOR | M | Missing contextual prompts per dysfunction |
| 06-cash | Performance | MINOR | S | BS validation, currency |
| 07-energy | Performance | MINOR | S | Incomplete validation |
| 13-segmentation | Market | MINOR | S | Segment count guidance |
| 14-target-segment | Strategy | MINOR | S | Top-3 enforcement |
| 15-value-proposition | Strategy | MINOR | S | Validation method note |
| 16-vp-testing | Strategy | MINOR | S | Minor polish (frameworks already present) |
| 17-product-dev | Execution | MINOR | S | Minor polish (strategic roles already present) |
| 18-pricing | Execution | MINOR | S | Minor polish (tier design already present) |
| 19-brand-marketing | Execution | MINOR | S | Dependency config |
| 20-customer-service | Execution | MINOR | S | Dependency config |
| 21-route-to-market | Execution | MINOR | S | Help modal |
| 23-processes-decisions | Org | MINOR | S | Minor polish |
| 24-fit-abc | Org | MINOR | S | Verify structure |
| 25-org-redesign | Org | MINOR | S | Verify structure |
| 27-agile-teams | People | MINOR | S | Playing-field rules |

## P3 — Cosmetic Only (pass audit)

| Tool | Module | Gap | Scope | Issue |
|------|--------|-----|-------|-------|
| 01-know-thyself | Identity | MINOR | S | Mock share button |
| 05-fit | Identity | MINOR | S | D-Player help text |
| 08-goals | Performance | MINOR | S | CONFIG.STORAGE_KEY bug |
| 09-focus | Performance | MINOR | S | Minor polish |
| 11-meeting-rhythm | Performance | MINOR | S | Effectiveness enum |

## ~~Pervasive Issue: [PLACEHOLDER] Content~~ RESOLVED

~~ALL 30 tools have [PLACEHOLDER] text in cognitive load components.~~

**RESOLVED (2026-02-23):** All 409 [PLACEHOLDER] instances across 26 tool files have been
replaced with real brain juice content from each sprint's content.md — including 80/20
key learnings, research citations, case studies, common mistakes, and field-level callouts.
Committed as `ae4daf1`.

## Recommended Fix Order (updated)

1. **P1 tools** (28, 10, 12, 22, 26, 29) — structural fixes
2. **P2 batch** — minor fixes, can be parallelized
3. **P3 cosmetic** — optional polish
