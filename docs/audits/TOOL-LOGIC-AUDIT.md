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

## Session 2 Scope (Next: Tools 06-11)
Tools: cash, energy, goals, focus, performance, meeting-rhythm (Module 2: Performance)
