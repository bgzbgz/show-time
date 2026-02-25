# Cognitive Load Research Plan
## WOOP Framework Applied to Tool UX Redesign

**Date:** February 17, 2026  
**Owner:** Research & Product Team  
**Goal:** Achieve crystal clarity on cognitive load principles and implement world-class educational UX in Fast Track tools

---

## WISH
Transform our 31 Fast Track tools from high-cognitive-load, scroll-heavy interfaces into seamless, addictive, low-friction learning experiences that clients love to use.

---

## OUTCOME (Success Criteria)

### Deliverables
1. **Cognitive Load Playbook** - A 1-page visual reference of dos/don'ts specific to Fast Track tools
2. **Visual Design System** - Branded info boxes (Fast Track yellow, Science grey) with icon specifications
3. **Implementation Checklist** - Tool-by-tool audit identifying high cognitive load patterns
4. **Pattern Library** - 10-15 proven UX patterns from world-class educational tools
5. **Redesign Prototype** - 1-2 tools redesigned as proof-of-concept

### Success Metrics
- **Scrolling reduced by 50%+** compared to current tools
- **Time-to-completion reduced by 30%** for typical exercises
- **Client confusion questions reduced by 60%** (tracked via Guru support tickets)
- **Tool completion rate increased to 85%+** (currently tracking incomplete submissions)

---

## OBSTACLE

### Core Challenges
1. **Information Overload** - Too many research sources on cognitive load (academic papers, UX blogs, case studies)
2. **Generic Advice** - Most cognitive load research is academic or B2C focused, not B2B tool-specific
3. **Conflicting Principles** - Must balance cognitive load reduction WITH existing 8-point criteria, brand guidelines, and Fast Track methodology
4. **Implementation Gap** - Knowing theory ≠ knowing what to change in our specific HTML tools

### Specific Blind Spots
- How do world-class tools (Duolingo, Khan Academy, Typeform, Miro) manage cognitive load in complex exercises?
- What's the optimal information density for B2B decision-making tools vs. consumer education apps?
- How to make "brutal honesty" and "challenging" content low-cognitive-load without dumbing it down?

---

## PLAN

### Phase 1: Targeted Research (Week 1)
**Goal:** Gather only case-specific, actionable insights

#### A. Competitive Benchmarking
**Tools to Analyze:**
- **Typeform** - Progressive disclosure, single-question-per-screen
- **Miro/Mural** - Visual canvas, spatial organization
- **Duolingo** - Gamification, bite-sized learning
- **Notion** - Information hierarchy, collapsible sections
- **Airtable** - Data input with low friction

**What to Extract:**
- How do they chunk information?
- What visual patterns reduce scrolling?
- How do they provide help without overwhelming?
- How do they handle complex multi-step workflows?

**Research Prompts for LLMs:**
1. "Analyze Typeform's UX patterns for reducing cognitive load in multi-step forms. Provide 5 specific techniques with screenshots/descriptions that can be applied to B2B decision-making tools."

2. "What are the core cognitive load principles used by Duolingo to make learning addictive? Extract only the principles applicable to professional/business tools, not gamification."

3. "How does Notion use progressive disclosure and information hierarchy to prevent overwhelm? Provide specific UI patterns (collapsible sections, tabs, sidebars) with best practices."

#### B. Cognitive Load Theory Deep Dive
**Focus:** Sweller's Cognitive Load Theory applied to digital tools

**Research Prompts for LLMs:**
1. "Explain Sweller's Cognitive Load Theory (Intrinsic, Extraneous, Germane) in the context of B2B SaaS tools. Provide 10 specific design decisions that reduce extraneous load in form-heavy applications."

2. "What are the key differences in cognitive load management between educational tools (Khan Academy) and professional tools (Airtable, Asana)? Extract principles for tools that require both learning AND decision-making."

3. "Analyze the concept of 'seductive details' in instructional design. How do educational tools balance necessary context (science, examples) with avoiding cognitive overload?"

#### C. Information Design Principles
**Focus:** Edward Tufte, Don Norman, Nielsen Norman Group

**Research Prompts for LLMs:**
1. "What are Edward Tufte's core principles for information density in professional tools? How do you balance 'data-ink ratio' with usability in interactive web forms?"

2. "Summarize Nielsen Norman Group's research on F-patterns, Z-patterns, and scanning behavior for business tools. Provide 5 layout rules that reduce cognitive load."

3. "What are the best practices for using colored callout boxes (warnings, tips, insights) without creating visual clutter? Provide examples from enterprise SaaS tools."

### Phase 2: Pattern Extraction (Week 1-2)
**Goal:** Create a Fast Track-specific pattern library

#### Research Approach
Use NotebookLM to process:
- Friction blind spot report (already in your repo)
- 8-point tool criteria
- Brand guidelines
- Collected research from Phase 1

**NotebookLM Prompt:**
```
Sources: [Upload Friction Report + Brand Guidelines + 8-Point Criteria + Research Notes]

Query: "Extract patterns of high cognitive load from the friction report. Then cross-reference with the research on cognitive load principles. Create a table with 3 columns:
1. Current Problem (from friction report)
2. Cognitive Load Principle Violated
3. Solution Pattern (from best-in-class tools)

Focus on issues related to: scrolling, visual clutter, information overwhelm, unclear hierarchy, and unclear next steps."
```

### Phase 3: Design System Creation (Week 2)
**Goal:** Specify the visual implementation

#### Fast Track Info Box System
Based on boss feedback, create 3 box types:

**1. Fast Track Insight Box**
- **Color:** `#FFF469` (Fast Track Yellow)
- **Icon:** Black Fast Track "F" mark (favicon size: 24x24px)
- **Typography:** Monument Grotesk Mono (uppercase label), Riforma (body)
- **Usage:** Key methodology insights, 80/20 principles, strategic shortcuts
- **Cognitive Load Principle:** Germane load - reinforces Fast Track methodology DNA

**2. Science Behind It Box**
- **Color:** `#B2B2B2` (Fast Track Grey)
- **Icon:** Black science icon (beaker/atom, 24x24px)
- **Typography:** Monument Grotesk Mono (uppercase label), Riforma (body)
- **Usage:** Evidence-based context, research backing, credibility builders
- **Cognitive Load Principle:** Germane load - builds mental models, optional for advanced users

**3. Warning/Action Box**
- **Color:** `#000000` (Black with yellow accent stripe)
- **Icon:** Yellow warning triangle or yellow "!" (24x24px)
- **Typography:** Plaak Bold (headline), Riforma (body)
- **Usage:** Common mistakes, critical decision points, "brutal honesty" nudges
- **Cognitive Load Principle:** Reduces extraneous load - prevents errors before they happen

#### Layout Patterns to Implement
1. **Single Column, Max Width 720px** - Reduces eye travel
2. **Accordion Sections** - Hide complexity until needed
3. **Sticky Progress Bar** - Shows completion without scrolling up
4. **Just-in-Time Help** - Tooltips/popovers instead of upfront explanations
5. **Visual Chunking** - 3-5 items per section max
6. **Smart Defaults** - Pre-fill where possible, reduce typing
7. **Inline Validation** - Instant feedback (like credit card red/green)

### Phase 4: Audit & Prioritization (Week 2)
**Goal:** Identify which tools need immediate redesign

#### Tool Audit Template
For each of the 31 tools, score (1-5):
- **Cognitive Load Score** (5 = overwhelming, 1 = seamless)
- **Scroll Factor** (count: how many page heights to complete?)
- **Information Density** (5 = cluttered, 1 = clean)
- **Client Confusion Rate** (from Guru support tickets)

**Priority for Redesign:**
1. Highest cognitive load scores
2. Most-used tools (from usage analytics)
3. Tools with most support tickets
4. Tools where incomplete submissions are common

### Phase 5: Prototype & Test (Week 3)
**Goal:** Redesign 1-2 tools as proof-of-concept

**Suggested Starting Points:**
1. **WOOP Tool** (00-woop.html) - Currently 2752 lines, high scrolling
2. **Cash Flow Tool** - High friction from friction report, complex calculations

**Redesign Approach:**
- Apply all patterns from research
- Implement new info box system
- A/B test with 2-3 clients
- Measure: time-to-complete, scroll distance, confusion questions, satisfaction

---

## RESEARCH PROMPTS LIBRARY

### For ChatGPT/Claude/Perplexity (Web Research Mode)

#### Prompt Set 1: Competitive Analysis
```
I'm redesigning B2B decision-making tools that currently have high cognitive load (too much scrolling, visual clutter, unclear next steps). 

Analyze [Typeform/Notion/Airtable/Miro] and extract 5-7 specific UX patterns they use to reduce cognitive load in complex workflows. For each pattern:
1. Name the pattern
2. Describe how it works (with UI details)
3. Explain the cognitive load principle it addresses
4. Provide an example of how it could apply to a business strategy tool (not just forms)

Focus on: progressive disclosure, visual hierarchy, information chunking, help systems, and error prevention.
```

#### Prompt Set 2: Cognitive Load Theory
```
I need to understand Cognitive Load Theory (Sweller) specifically for B2B SaaS tools that combine learning + decision-making.

Provide:
1. 3-sentence explanation of Intrinsic, Extraneous, Germane load
2. 10 specific design patterns that reduce EXTRANEOUS load in web-based forms/tools
3. 5 examples of how to INCREASE germane load (good cognitive load that builds expertise) without overwhelming users
4. 3 examples of tools/companies that excel at this

Context: Our tools require users to input strategic business data (market sizing, team assessments, financial forecasts) while learning methodology. Users are time-starved executives.
```

#### Prompt Set 3: Visual Design for Clarity
```
Research visual design patterns for reducing cognitive load in information-dense interfaces.

Specifically, I need best practices for:
1. Colored callout boxes (tips, warnings, insights) - when to use, how many, placement rules
2. Icon usage to aid scanning without adding noise
3. Typography hierarchy for complex forms (labels, help text, input fields, section headers)
4. Whitespace usage in business tools (not marketing sites)
5. One-page vs. multi-step wizards - when to use which?

Provide examples from enterprise SaaS tools (Salesforce, HubSpot, Asana, Monday.com) with specific measurements (spacing, font sizes, color contrast).
```

#### Prompt Set 4: Scrolling Reduction Techniques
```
I'm trying to reduce scrolling in web-based tools by 50%. Currently, tools require 3-5 pages of vertical scrolling to complete.

Research and provide:
1. 10 UI patterns that reduce scrolling (accordions, tabs, modals, sidebars, steppers, etc.)
2. Pros/cons of each for tools that require 20-30 input fields
3. Examples of tools that successfully fit complex workflows into minimal scrolling
4. Trade-offs between scrolling vs. clicking (navigation cognitive load)
5. Best practices for progress indication in multi-step flows

Focus on B2B/professional tools, not consumer apps.
```

#### Prompt Set 5: Help Without Overwhelm
```
Our current tools have long "Brain Juice" PDFs and 60-minute videos that users skip, leading to confusion. 

Research "just-in-time help" and "contextual micro-learning" patterns:
1. How do best-in-class tools (Duolingo, Khan Academy, Codecademy) deliver help exactly when needed?
2. Tooltip vs. popover vs. inline help vs. sidebar documentation - when to use each?
3. How to balance "show me how" (examples) with "tell me why" (science/methodology)?
4. Progressive disclosure for help content - layering basic/intermediate/advanced
5. Video help best practices (length, placement, interactive vs. passive)

Provide examples with screenshots/descriptions.
```

### For NotebookLM (Document Synthesis)

#### Prompt Set 6: Friction Report Analysis
```
Sources: [Upload: friction_blind_spot_report_reformatted.md, th point tool criteria.md, Fast Track Brand Guidlines.md]

Create a synthesis document with these sections:

1. TOP 10 COGNITIVE LOAD VIOLATIONS
Extract the 10 most frequent friction points that relate to cognitive overload, visual clutter, or information overwhelm. Rank by frequency + impact.

2. PRINCIPLES CONFLICT ANALYSIS
Identify any conflicts between:
- Reducing cognitive load (goal)
- 8-point tool criteria (requirement)
- Fast Track brand tone (brutal honesty, challenging, focused)

3. DESIGN MANDATES PRIORITY
Re-rank the "Design Mandates" from the friction report based on cognitive load impact. Which fixes will have the biggest impact on reducing mental effort?

4. BRAND-ALIGNED SOLUTIONS
For each of the top 10 violations, propose a solution that:
- Reduces cognitive load
- Maintains Fast Track brand identity
- Doesn't compromise the 8-point criteria

Output as a table: Problem | Cognitive Load Principle | Solution | Brand Alignment
```

#### Prompt Set 7: Pattern Extraction
```
Sources: [Upload: Research notes from ChatGPT/Claude, Competitive analysis screenshots, Cognitive load theory notes]

Create a "Fast Track UX Pattern Library" with 15 patterns:

For each pattern, provide:
1. Pattern Name (e.g., "Accordion Chunking", "Inline Validation", "Ghost Table Preview")
2. When to Use (specific Fast Track tool context)
3. Cognitive Load Principle (which type of load it addresses)
4. Implementation Notes (HTML/CSS/JS approach)
5. Fast Track Brand Adaptation (how to style it per brand guidelines)

Organize patterns by category:
- Information Architecture (5 patterns)
- Visual Design (5 patterns)
- Interaction Design (5 patterns)
```

### For DeepSeek/Grok (Coding Implementation)

#### Prompt Set 8: Technical Implementation
```
I have 31 HTML tools built with React (via Babel standalone). Current issue: high cognitive load from excessive scrolling and visual clutter.

Analyze this tool structure [paste WOOP tool HTML] and provide:

1. REFACTORING PLAN
Break down how to convert a single long-scroll page into:
- Stepper/wizard component (Step 1, 2, 3, 4)
- Accordion sections within each step
- Sticky progress bar
- Collapsible info boxes

2. COMPONENT ARCHITECTURE
Suggest React component structure:
- InfoBox component (with type: 'fasttrack' | 'science' | 'warning')
- ProgressIndicator component
- FormStep component with validation
- HelpTooltip component

3. CSS OPTIMIZATION
Provide Tailwind classes/custom CSS for:
- Max-width containers (prevent wide screens from spreading content)
- Visual chunking (whitespace, borders, backgrounds)
- Typography hierarchy (labels, inputs, help text)
- Responsive behavior (mobile vs. desktop)

4. PERFORMANCE
Ensure changes don't break:
- PDF export functionality
- Supabase data saving
- Dependency injection system
```

---

## RESEARCH EXECUTION TIMELINE

### Week 1: Days 1-2 (Research Sprint)
- **Monday AM:** Run all ChatGPT/Claude prompts (Prompt Sets 1-5) in parallel
- **Monday PM:** Organize findings in Notion/Obsidian, screenshot key examples
- **Tuesday AM:** Run NotebookLM synthesis (Prompt Sets 6-7)
- **Tuesday PM:** Create 1-page visual summary (Cognitive Load Playbook)

### Week 1: Days 3-5 (Design System)
- **Wednesday:** Design 3 info box types (Fast Track, Science, Warning) in Figma/direct HTML
- **Thursday:** Audit all 31 tools, score cognitive load (spreadsheet)
- **Friday:** Prioritize top 5 tools for redesign, create redesign specs

### Week 2 (Prototype)
- **Monday-Wednesday:** Redesign WOOP tool (00-woop.html) as proof-of-concept
- **Thursday:** Internal review with team
- **Friday:** Test with 1-2 friendly clients, gather feedback

### Week 3 (Refinement)
- **Monday-Tuesday:** Iterate based on feedback
- **Wednesday-Friday:** Create implementation guide for remaining 30 tools

---

## SUCCESS CRITERIA & VALIDATION

### Research Quality Checklist
- [ ] All sources are from 2020+ (recent UX best practices)
- [ ] At least 5 B2B tool examples (not just consumer apps)
- [ ] Specific, actionable patterns (not vague principles)
- [ ] No conflicts with 8-point criteria or brand guidelines
- [ ] Measurable (can A/B test before/after)

### Implementation Readiness Checklist
- [ ] 1-page visual Cognitive Load Playbook created
- [ ] 3 info box types designed and coded
- [ ] Top 5 tools prioritized for redesign
- [ ] 1 tool fully redesigned as proof-of-concept
- [ ] A/B test plan created (metrics, sample size)
- [ ] Rollout plan for remaining 30 tools

---

## APPENDIX: Key Resources to Review

### Academic Sources (Quick Summaries Only)
- Sweller's Cognitive Load Theory (1988, 2019 update)
- Miller's Law (7±2 chunks of information)
- Hick's Law (decision time increases with options)
- Nielsen's Usability Heuristics (#8: Aesthetic and minimalist design)

### Industry Sources (Detailed Analysis)
- Nielsen Norman Group: "Minimize Cognitive Load to Maximize Usability"
- Smashing Magazine: "How to Design for Cognitive Load"
- Baymard Institute: Form design research (180+ guidelines)
- Laws of UX (lawsofux.com) - visual reference

### Tool Benchmarks (Hands-On Testing)
- Typeform (form UX)
- Notion (information hierarchy)
- Airtable (data input)
- Miro (visual canvas)
- Linear (focused workflow)
- Height (minimal UI)

---

**Next Action:** Run ChatGPT Prompt Set 1 (Typeform analysis) and Prompt Set 2 (Cognitive Load Theory)

**Owner:** [Your Name]  
**Review Date:** [1 week from today]
