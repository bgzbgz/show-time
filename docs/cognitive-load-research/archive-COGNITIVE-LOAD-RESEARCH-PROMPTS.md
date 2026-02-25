# Cognitive Load Research Prompts
## Copy-Paste Ready Prompts for LLMs

**Purpose:** Collect actionable insights on cognitive load reduction for Fast Track tools  
**Context:** B2B strategic decision-making tools, 31 HTML/React tools, high scrolling, visual clutter issues  
**Goal:** Reduce cognitive load while maintaining Fast Track brand identity

---

## 🎯 QUICK START: Run These 3 Prompts First

### 1. Competitive Benchmark (ChatGPT/Perplexity)
```
I'm redesigning B2B decision-making tools that currently have high cognitive load (too much scrolling, visual clutter, unclear next steps).

Analyze Typeform's UX patterns and extract 5-7 specific techniques they use to reduce cognitive load in multi-step forms. For each pattern:
1. Name the pattern
2. Describe how it works (with UI details)
3. Explain the cognitive load principle it addresses
4. Provide an example of how it could apply to a business strategy tool (not just forms)

Focus on: progressive disclosure, visual hierarchy, information chunking, help systems, and error prevention.
```

### 2. Cognitive Load Theory Basics (Claude/ChatGPT)
```
I need to understand Cognitive Load Theory (Sweller) specifically for B2B SaaS tools that combine learning + decision-making.

Provide:
1. 3-sentence explanation of Intrinsic, Extraneous, Germane load
2. 10 specific design patterns that reduce EXTRANEOUS load in web-based forms/tools
3. 5 examples of how to INCREASE germane load (good cognitive load that builds expertise) without overwhelming users
4. 3 examples of tools/companies that excel at this

Context: Our tools require users to input strategic business data (market sizing, team assessments, financial forecasts) while learning methodology. Users are time-starved executives.
```

### 3. Scrolling Reduction (Perplexity/Grok)
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

---

## 📊 COMPETITIVE ANALYSIS PROMPTS

### Prompt 1A: Typeform Deep Dive
```
Analyze Typeform's approach to multi-step forms and cognitive load management.

Provide:
1. How they use single-question-per-screen (pros/cons for complex business tools)
2. Their progress indication system (top bar, question numbers, visual cues)
3. How they handle conditional logic without confusing users
4. Their use of whitespace and visual simplicity
5. Error handling and validation patterns
6. 3 specific techniques applicable to B2B strategic planning tools

Include screenshots or detailed descriptions of UI patterns.
```

### Prompt 1B: Notion Information Hierarchy
```
Analyze Notion's approach to managing information density and cognitive load.

Extract:
1. How they use collapsible sections (toggles, accordions)
2. Their navigation patterns (sidebar + breadcrumbs + inline navigation)
3. How they balance dense information with usability
4. Their use of databases vs. pages vs. blocks for different content types
5. Progressive disclosure patterns (when to hide/show complexity)
6. 5 specific patterns for tools that require both reading and data entry

Focus on patterns for professional/business use, not personal note-taking.
```

### Prompt 1C: Airtable Data Entry UX
```
Analyze Airtable's approach to low-friction data input in complex databases.

Provide:
1. How they make form views simple while keeping grid views powerful
2. Their field type system (dropdowns, multi-select, linked records) and when to use each
3. Smart defaults and auto-fill patterns
4. Inline validation and error prevention
5. How they guide users through complex data relationships
6. 5 techniques for reducing cognitive load in business data collection tools

Include specific examples of forms with 15+ fields that don't feel overwhelming.
```

### Prompt 1D: Miro Visual Canvas Approach
```
Analyze Miro's approach to spatial organization and cognitive load in complex visual tools.

Extract:
1. How they use infinite canvas without overwhelming users (frames, templates)
2. Their onboarding patterns for complex tools
3. How they balance flexibility with guidance
4. Visual hierarchy techniques for canvas-based interfaces
5. Collaboration patterns that don't create chaos
6. 3 ways spatial organization can reduce cognitive load vs. linear forms

Context: Could spatial/canvas layouts work for strategy tools, or should we stick with forms?
```

### Prompt 1E: Linear Focused Workflow
```
Analyze Linear's approach to minimal, focused UI in project management.

Provide:
1. How they achieve simplicity in a complex domain (compared to Jira)
2. Their use of keyboard shortcuts and command palette (reducing UI chrome)
3. Visual hierarchy and typography choices
4. How they handle detailed views without clutter
5. Progressive disclosure patterns (what's always visible vs. hidden)
6. 5 principles for creating "calm" interfaces for serious business tools

Focus on their philosophy of "less is more" in B2B contexts.
```

---

## 🧠 COGNITIVE LOAD THEORY PROMPTS

### Prompt 2A: Core Theory Explained
```
Explain Cognitive Load Theory (Sweller, 1988-2020) for a product designer working on B2B web tools.

Cover:
1. Definitions of Intrinsic, Extraneous, Germane load with 2 examples each
2. Working memory limitations (Miller's 7±2) applied to form design
3. Split-attention effect and how to avoid it in tool interfaces
4. Modality effect (when to use text vs. images vs. video)
5. Redundancy effect (when extra info helps vs. hurts)
6. 10 practical design rules derived from CLT for web forms

Make it actionable, not academic. Cite modern (2020+) applications of the theory.
```

### Prompt 2B: Extraneous Load Reduction
```
I need 15 specific UI/UX patterns that reduce EXTRANEOUS cognitive load in web-based business tools.

For each pattern, provide:
1. Pattern name (e.g., "Inline Validation", "Smart Defaults")
2. What extraneous load it eliminates (e.g., "remembering error messages")
3. When to use it (tool context)
4. Example from a real B2B tool
5. Implementation complexity (easy/medium/hard)

Focus on patterns for tools with:
- 20-30 input fields
- Mix of text, numbers, dropdowns, textareas
- Multi-step workflows (4-6 steps)
- Need for occasional help/guidance

Prioritize patterns with highest impact and lowest implementation cost.
```

### Prompt 2C: Germane Load Optimization
```
Explain how to INCREASE germane cognitive load (the good kind that builds expertise) without overwhelming users.

Provide:
1. What makes germane load "good" vs. overwhelming
2. 5 patterns that build mental models while keeping interfaces clean
3. How to layer learning (beginner mode vs. expert mode)
4. When to use examples, case studies, and "why this matters" context
5. How tools like Duolingo and Khan Academy build expertise incrementally
6. 3 specific techniques for Fast Track tools that teach methodology while users work

Context: Our tools need users to learn "Fast Track methodology" (80/20 thinking, brutal honesty, etc.) WHILE completing strategic planning exercises.
```

### Prompt 2D: Split-Attention Effect
```
Explain the split-attention effect and how to design around it in web forms.

Cover:
1. What causes split-attention (eyes jumping between distant elements)
2. How to integrate labels, help text, and input fields to minimize it
3. Tooltip vs. inline help vs. sidebar documentation (which adds split-attention?)
4. Layout patterns that keep related info together
5. 5 before/after examples showing high vs. low split-attention designs
6. Specific spacing/proximity rules (how close is "close enough"?)

Focus on practical layout decisions for business tools with complex inputs.
```

### Prompt 2E: Information Chunking
```
Research George Miller's chunking principle and modern applications in UI design.

Provide:
1. The 7±2 rule and why it's now considered 4±1 for complex info
2. How to chunk form fields into logical groups (visual and semantic)
3. Examples of good vs. bad chunking in long forms
4. When to break into pages/steps vs. use visual grouping on one page
5. Progressive summarization patterns (show summary, hide details until needed)
6. 5 specific techniques for chunking 25+ field forms

Include examples from enterprise SaaS tools (Salesforce, HubSpot, etc.).
```

---

## 🎨 VISUAL DESIGN PROMPTS

### Prompt 3A: Colored Callout Boxes
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

### Prompt 3B: Icon Usage for Scanning
```
Research icon usage in reducing cognitive load and aiding visual scanning.

Cover:
1. When icons help vs. when they add noise
2. Icon size, spacing, and alignment best practices
3. Icon + text vs. icon-only (for tools, not apps)
4. Consistent icon systems (when to use custom vs. standard library)
5. Color-coded icons (when effective, when confusing)
6. 5 examples of tools that use icons effectively in forms/workflows

Our use case: Small icons (24x24px) in colored boxes to create brand recognition (Fast Track icon = yellow box = methodology insight).
```

### Prompt 3C: Typography Hierarchy
```
Research typography hierarchy for complex web forms with multiple content types.

Provide:
1. Font size scale for: page title, section header, field label, input text, help text, validation message
2. Font weight usage (when to bold, when not to)
3. Line height and spacing rules for readability in forms
4. Contrast ratios for accessibility (WCAG AA minimums)
5. Monospace vs. sans-serif for labels vs. inputs
6. 5 examples of clean typography systems from B2B tools

Our font stack:
- Plaak (bold, condensed) - for headlines
- Riforma (regular, serif) - for body/inputs
- Monument Grotesk Mono - for labels/annotations

Suggest sizing and usage patterns for forms.
```

### Prompt 3D: Whitespace and Density
```
Research optimal information density for B2B tools.

Provide:
1. Edward Tufte's "data-ink ratio" applied to web forms
2. How much whitespace is too much (when it feels wasteful) vs. too little (overwhelm)
3. Padding and margin rules (inputs, sections, pages)
4. Responsive density (desktop vs. tablet vs. mobile)
5. Examples of tools with "just right" density (Basecamp, Linear, Height)
6. 5 specific measurements (px or rem) for spacing systems

Our constraint: Must reduce scrolling by 50%, so we can't just add infinite whitespace.
```

### Prompt 3E: Layout Grids for Forms
```
Research grid systems and layout patterns for long forms in web tools.

Cover:
1. Single column vs. two-column vs. flexible grid for forms
2. Max-width containers (when to constrain width on large screens)
3. F-pattern and Z-pattern scanning applied to form layout
4. Alignment rules (left-align labels vs. top-align vs. inline)
5. Responsive breakpoints for form layouts
6. 5 examples of clean form layouts from SaaS tools with 20+ fields

Our current issue: Forms expand to full width on large screens, making them hard to scan.
```

---

## 🖱️ INTERACTION DESIGN PROMPTS

### Prompt 4A: Progressive Disclosure Patterns
```
Research progressive disclosure patterns for complex workflows.

Provide:
1. When to use: accordions, tabs, steppers, modals, sidebars, popovers
2. Pros/cons of each for 4-6 step workflows with 20-30 fields total
3. How to indicate hidden content without creating mystery/confusion
4. State management (save progress, back button, resume later)
5. 10 examples of progressive disclosure done well in B2B tools
6. Anti-patterns (ways progressive disclosure backfires)

Our current state: Single long-scroll page (2000+ lines of HTML). Considering multi-step wizard OR accordion sections OR tabs.
```

### Prompt 4B: Help Systems (Just-in-Time)
```
Research "just-in-time help" patterns that don't overwhelm.

Cover:
1. Tooltip vs. popover vs. inline help vs. sidebar vs. modal (when to use each)
2. Help triggers (hover, click, ?, info icon, etc.)
3. Layered help (quick tip → explanation → video → docs)
4. Contextual help (changes based on user's current step/input)
5. How to avoid "skip all help" behavior (making it too easy to dismiss)
6. 10 examples from educational and B2B tools

Our current issue: Users skip 60-minute "Brain Juice" videos, then get confused during exercises.
```

### Prompt 4C: Inline Validation Patterns
```
Research real-time validation and error prevention in web forms.

Provide:
1. When to validate (on blur, on change, on submit)
2. Visual patterns for validation states (neutral, success, error, warning)
3. Error message placement (inline, at top, modal)
4. Preventing errors before they happen (input masks, dropdowns vs. text)
5. How to make validation feel helpful, not punishing
6. 10 examples of excellent validation UX from SaaS tools

Our need: "Anti-vagueness" validation from friction report (e.g., reject "Team" as an owner, require specific name).
```

### Prompt 4D: Progress Indication
```
Research progress indicators for multi-step workflows.

Cover:
1. Linear progress bars vs. step indicators vs. percentage vs. checklist
2. Sticky headers with progress (always visible vs. hidden on scroll)
3. How to show optional vs. required steps
4. Celebrating progress (micro-interactions, confetti, checkmarks)
5. Handling non-linear workflows (user can skip around)
6. 10 examples of satisfying progress indicators from tools

Our goal: Give dopamine hit for progress, reduce anxiety about "how much more?"
```

### Prompt 4E: Smart Defaults and Auto-Fill
```
Research smart defaults and auto-fill patterns that reduce data entry effort.

Provide:
1. When to pre-fill vs. leave blank (don't assume too much)
2. Using previous inputs to predict next inputs (within a session)
3. Industry/role-based defaults (if user is B2B SaaS, default to X)
4. Copy-from-previous patterns (repeat last entry with one click)
5. AI-powered suggestions (when helpful, when creepy)
6. 10 examples of smart defaults done well in B2B tools

Our opportunity: Many tools ask for similar info (company name, industry, team size). Could we remember and pre-fill?
```

---

## 🔬 NOTEBOOKLM SYNTHESIS PROMPTS

### Prompt 5A: Friction Report → Cognitive Load Analysis
```
Sources: [Upload friction_blind_spot_report_reformatted.md]

Create a report titled "Cognitive Load Violations in Fast Track Tools" with these sections:

1. HIGH COGNITIVE LOAD PATTERNS (Top 10)
Extract friction points related to:
- Information overload ("too much to read", "TLDR")
- Visual clutter (ugly Excel, fragmented materials)
- Unclear next steps ("what do I do with this?")
- Forced context switching (jumping between PDF, Excel, video)
- Manual mental calculations (matching scores, aggregating data)

For each, quote the evidence and identify which type of cognitive load is excessive (intrinsic, extraneous, germane).

2. SCROLLING AND DENSITY ISSUES
Extract all mentions of:
- Long forms/tools
- Multiple pages
- Need to compress/summarize
- Lost in the ocean

Calculate: How many tools have complaints about length/density?

3. HELP SYSTEM FAILURES
Extract issues with:
- Brain Juice PDFs (skipped, too long)
- Mandatory videos (waste of time)
- Guru explanations needed every time
- Lack of inline definitions

4. VISUAL DESIGN GAPS
Extract mentions of:
- Excel aesthetics ("ugly", "hard to share")
- Lack of visual hierarchy
- Formatting complaints
```

### Prompt 5B: Cross-Reference with Best Practices
```
Sources: [Upload friction report + your research notes from ChatGPT/Claude]

Create a table titled "Problem → Solution Mapping" with these columns:

| Fast Track Problem (from friction report) | Cognitive Load Type | Best Practice Solution (from research) | Example Tool | Implementation Difficulty |

For each of the top 20 friction points, map to:
- A specific cognitive load principle it violates
- A proven UX pattern from your research that solves it
- A real tool that does it well
- Estimated difficulty (easy/medium/hard to implement in our HTML/React tools)

Sort by: Highest impact + Lowest difficulty first (quick wins).
```

### Prompt 5C: Brand Alignment Check
```
Sources: [Upload friction report + Fast Track Brand Guidelines + 8-point criteria]

Create a report titled "Cognitive Load Reduction vs. Brand Identity" analyzing:

1. POTENTIAL CONFLICTS
Identify areas where reducing cognitive load might conflict with:
- "Brutal Honesty" principle (too gentle?)
- "Challenging" character (too easy?)
- "Die Empty" intensity (too relaxed?)
- 8-point criteria (any criteria that require cognitive effort?)

2. BRAND-ALIGNED SOLUTIONS
For each potential conflict, propose solutions that:
- Reduce cognitive load
- Maintain Fast Track edge
- Keep the methodology rigorous

Example: "Brutal Honesty" warnings can be black boxes with yellow accent (visually striking, fast to scan, maintains intensity).

3. TERMINOLOGY ALIGNMENT
Check that new UX patterns use Fast Track vocabulary:
- "Fast Track Insight" not "Tip"
- "Science Behind It" not "Learn More"
- Action language (verbs, directness)
```

### Prompt 5D: Pattern Library Creation
```
Sources: [Upload all your research notes]

Create a document titled "Fast Track UX Pattern Library" organized as:

## Information Architecture Patterns
[5 patterns for organizing content, reducing scrolling, chunking info]

## Visual Design Patterns
[5 patterns for hierarchy, color, typography, whitespace]

## Interaction Design Patterns
[5 patterns for help, validation, progress, defaults]

For EACH pattern, provide:
1. **Pattern Name**
2. **Problem It Solves** (specific to Fast Track tools)
3. **Cognitive Load Principle** (which load it addresses)
4. **When to Use** (tool types, contexts)
5. **How to Implement** (HTML/CSS/JS notes)
6. **Fast Track Brand Adaptation** (colors, fonts, tone)
7. **Example** (screenshot or description from research)

Make this a copy-paste-ready reference for designers/developers.
```

---

## 🚀 IMPLEMENTATION PROMPTS

### Prompt 6A: WOOP Tool Redesign
```
I have a WOOP tool (Wish, Outcome, Obstacle, Plan) that's currently 2752 lines of HTML/React with excessive scrolling.

Current structure:
- Single long-scroll page
- 4 major sections (W, O, O, P)
- Each section has 3-5 input fields (text, textarea)
- Info boxes with methodology tips
- PDF export functionality
- Saves to Supabase

Propose a redesign that:
1. Reduces scrolling by 50%+
2. Uses progressive disclosure (wizard? accordions? tabs?)
3. Adds 3 types of branded info boxes (Fast Track, Science, Warning)
4. Maintains all functionality (save, export, validate)
5. Implements cognitive load best practices

Provide:
- Wireframe description (text-based is fine)
- React component structure
- Key CSS/Tailwind classes
- Implementation steps (1, 2, 3...)
```

### Prompt 6B: Info Box Component Design
```
Design 3 React components for branded info boxes in our Fast Track tools.

Requirements:

1. **FastTrackInsight** component
   - Background: #FFF469 (yellow)
   - Icon: Black "F" logo (24x24px, left side)
   - Border: 2px solid black (optional)
   - Typography: Monument Grotesk Mono (label), Riforma (body)
   - Usage: Methodology insights, 80/20 tips

2. **ScienceBox** component
   - Background: #B2B2B2 (grey)
   - Icon: Black science icon (beaker, 24x24px, left side)
   - Border: None
   - Typography: Monument Grotesk Mono (label), Riforma (body)
   - Usage: Research evidence, credibility builders

3. **WarningBox** component
   - Background: #000000 (black)
   - Accent: 4px yellow left border (#FFF469)
   - Color: White text
   - Icon: Yellow "!" or triangle (24x24px)
   - Typography: Plaak Bold (headline), Riforma (body)
   - Usage: Errors, critical decisions, common mistakes

Provide:
- React component code (TypeScript/JSX)
- Prop types (title, children, collapsible?)
- CSS/Tailwind styling
- Usage examples
```

### Prompt 6C: Wizard/Stepper Component
```
Design a multi-step wizard component for Fast Track tools to replace long-scroll pages.

Requirements:
- 4-6 steps per tool
- Sticky progress bar (top of viewport)
- Step indicator (1 of 4, or dots, or both?)
- Previous/Next buttons
- Save progress (Supabase integration)
- Validation before allowing "Next"
- Responsive (mobile-friendly)

Provide:
- React component architecture (StepperContainer, Step, ProgressBar, Navigation)
- State management approach (useState, useReducer, or context?)
- Routing strategy (URL changes? Or just UI state?)
- Accessibility considerations (ARIA labels for screen readers)
- Code examples for core logic
```

### Prompt 6D: Form Validation System
```
Design a form validation system for Fast Track tools that prevents common errors.

Requirements (from friction report):
1. **Anti-Vagueness Validation**
   - Reject "The Team" or "IT" in owner fields (require specific name)
   - Reject generic values like "Integrity" without behavioral examples
   - Enforce WWW format (Who/What/When for action plans)

2. **Real-Time Validation**
   - "You vs. We" counter for value propositions (flag if too company-centric)
   - Verb validator for "Core Activities" (must start with action verb)
   - Number validator for "Goals" (must include metric + timeframe)

3. **Visual Feedback**
   - Neutral state (grey border)
   - Success state (green border, checkmark)
   - Error state (red border, red text below)
   - Warning state (yellow border, yellow text below)

Provide:
- React validation hook (useFormValidation?)
- Validation rule examples (regex, custom logic)
- Visual component code (border colors, icons, messages)
- Real-time vs. on-blur vs. on-submit strategy
```

---

## 📈 MEASUREMENT & TESTING PROMPTS

### Prompt 7A: A/B Test Plan
```
Create an A/B test plan to validate cognitive load reduction in redesigned tools.

Provide:
1. **Metrics to Track**
   - Quantitative: time-to-complete, scroll distance, clicks, errors, completion rate
   - Qualitative: confusion questions, satisfaction score, NPS

2. **Test Setup**
   - Sample size (how many users needed for statistical significance?)
   - Test duration (1 week? 2 weeks?)
   - Control vs. Treatment (old long-scroll vs. new wizard)

3. **Success Criteria**
   - What results would confirm cognitive load is reduced?
   - What results would suggest we need to iterate?

4. **Instrumentation**
   - What analytics to add (Google Analytics events? Custom tracking?)
   - How to track scrolling distance (JavaScript scroll listeners?)
   - How to track confusion (support ticket categories?)

5. **Analysis Plan**
   - Statistical tests to run (t-test, chi-square, etc.)
   - How to interpret qualitative feedback
```

### Prompt 7B: Cognitive Load Measurement
```
How do you objectively measure cognitive load in web-based tools?

Provide:
1. **Proxy Metrics**
   - Task completion time
   - Error rate / correction rate
   - Number of help clicks / tooltip hovers
   - Scroll distance / scroll events
   - Time to first input (hesitation?)
   - Pause duration (stuck thinking?)

2. **Subjective Measures**
   - NASA Task Load Index (TLX) - questionnaire
   - Cognitive Load Scale (Paas) - 9-point scale
   - Custom questions ("How mentally demanding was this?")

3. **Physiological Measures** (if available)
   - Eye tracking (fixations, saccades)
   - Heart rate variability
   - EEG (overkill for our use case?)

4. **Behavioral Indicators**
   - Incomplete submissions (gave up)
   - Support ticket volume (got confused)
   - Back button usage (lost, trying to find something)

Which metrics should we prioritize for Fast Track tools?
```

---

## 🎓 LEARNING RESOURCES PROMPTS

### Prompt 8A: Summarize Key Articles
```
Find and summarize the top 5 articles on cognitive load in UX design from Nielsen Norman Group, Smashing Magazine, or UX Collective.

For each article, provide:
1. Title and author
2. 3-sentence summary
3. Top 3 actionable takeaways
4. Relevance to B2B tools (high/medium/low)
5. Link

Prioritize articles from 2020+ about forms, wizards, or multi-step workflows.
```

### Prompt 8B: Case Studies
```
Find 5 case studies of companies that redesigned complex tools to reduce cognitive load.

For each, provide:
1. Company/product name
2. What they changed (before/after)
3. Results (metrics: time saved, errors reduced, completion rate improved)
4. Key techniques used (progressive disclosure, chunking, etc.)
5. Lessons applicable to Fast Track tools

Focus on B2B SaaS, enterprise tools, or professional productivity tools (not consumer apps).
```

### Prompt 8C: Video Summaries
```
Find and summarize 3-5 YouTube videos or conference talks on cognitive load in UX/product design.

For each, provide:
1. Video title and presenter
2. Length and year
3. 5-sentence summary
4. Timestamp for key sections
5. Visual examples shown (screenshots/demos?)
6. Relevance to our use case

Prioritize: talks by Don Norman, Nielsen Norman Group, or product design conferences (Config, UXDX, Mind the Product).
```

---

## ✅ VALIDATION CHECKLIST

Before considering research complete, ensure:

### Research Quality
- [ ] At least 10 sources from 2020 or later
- [ ] At least 5 B2B tool examples (not consumer apps)
- [ ] Specific, actionable patterns (not vague principles)
- [ ] No conflicts with Fast Track brand or 8-point criteria
- [ ] Sources cited (can link back if needed)

### Pattern Library Completeness
- [ ] 15+ patterns documented
- [ ] Each pattern has: name, problem, solution, example, implementation notes
- [ ] Patterns organized by category (info architecture, visual, interaction)
- [ ] Fast Track brand adaptations specified (colors, fonts, tone)

### Implementation Readiness
- [ ] 1-page visual Cognitive Load Playbook created
- [ ] 3 info box types designed (with code)
- [ ] Top 5 tools prioritized for redesign
- [ ] 1 tool redesigned as proof-of-concept
- [ ] A/B test plan defined
- [ ] Rollout plan for remaining tools

---

**Next Steps:**
1. Copy prompts into ChatGPT/Claude/Perplexity
2. Organize findings in Notion or Google Docs
3. Synthesize with NotebookLM
4. Create visual playbook
5. Start redesigning 1 tool as prototype

**Owner:** [Your Name]  
**Last Updated:** 2026-02-17
