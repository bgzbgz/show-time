# Info Box Visual Specification
## Fast Track Tools - Educational Content Design

**Purpose:** Exact specifications for the 3 branded info box types  
**Date:** 2026-02-17  
**Status:** Ready to implement

---

## 🎨 THE 3 BOX TYPES

### Overview
These boxes reduce cognitive load by:
- **Germane Load:** Reinforce Fast Track methodology (yellow boxes)
- **Germane Load:** Build mental models with science (grey boxes)
- **Extraneous Load Reduction:** Prevent errors before they happen (black boxes)

**Cognitive Principle:** Colored boxes with icons create pattern recognition → Brain processes faster → Less mental effort

---

## 1️⃣ FAST TRACK INSIGHT BOX

### Purpose
Methodology insights, 80/20 principles, strategic shortcuts, "This is the Fast Track way"

### Visual Specs

**Colors:**
- Background: `#FFF469` (Fast Track Yellow)
- Border: `2px solid #000000` (Black) - Optional
- Text: `#000000` (Black)

**Icon:**
- Fast Track "F" mark (favicon)
- Size: 24x24px
- Color: Black
- Position: Top-left corner, 16px from edges

**Typography:**
- **Label:** Monument Grotesk Mono, 12px, Uppercase, Letter-spacing: 0.1em, Black
- **Body:** Riforma Regular, 16px, Line-height: 1.5, Black

**Spacing:**
- Padding: 20px (all sides)
- Padding-left: 56px (to accommodate icon)
- Margin-bottom: 24px (space after box)

**Example Content:**
```
FAST TRACK INSIGHT
This is the 20% of effort that drives 80% of results. Focus here first.
```

### CSS Code
```css
.ft-insight-box {
  position: relative;
  background-color: #FFF469;
  border: 2px solid #000000;
  padding: 20px 20px 20px 56px;
  margin-bottom: 24px;
  font-family: 'Riforma', sans-serif;
  color: #000000;
}

.ft-insight-box::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 20px;
  width: 24px;
  height: 24px;
  background-image: url('path-to-f-icon.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

.ft-insight-box__label {
  font-family: 'Monument Grotesk Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  font-weight: 600;
}

.ft-insight-box__body {
  font-size: 16px;
  line-height: 1.5;
}
```

### React Component
```jsx
const FastTrackInsight = ({ children }) => (
  <div className="ft-insight-box">
    <div className="ft-insight-box__label">FAST TRACK INSIGHT</div>
    <div className="ft-insight-box__body">{children}</div>
  </div>
);

// Usage:
<FastTrackInsight>
  This is the 20% of effort that drives 80% of results. Focus here first.
</FastTrackInsight>
```

### When to Use
- ✅ Explaining why a field matters to Fast Track methodology
- ✅ Highlighting the "80/20" way to approach a section
- ✅ Showing shortcuts or strategic thinking patterns
- ❌ NOT for errors or warnings (use Warning Box)
- ❌ NOT for academic research (use Science Box)

### Placement Rules
- **Max 2 per screen** (more = yellow overload)
- Place **inline** with related questions (not in sidebar)
- Place **above** the field it relates to (user reads before answering)

---

## 2️⃣ SCIENCE BEHIND IT BOX

### Purpose
Evidence, research backing, credibility builders, "Here's why this works"

### Visual Specs

**Colors:**
- Background: `#B2B2B2` (Fast Track Grey)
- Border: None
- Text: `#000000` (Black)

**Icon:**
- Science icon (beaker or atom)
- Size: 24x24px
- Color: Black
- Position: Top-left corner, 16px from edges

**Typography:**
- **Label:** Monument Grotesk Mono, 12px, Uppercase, Letter-spacing: 0.1em, Black
- **Body:** Riforma Regular, 16px, Line-height: 1.5, Black

**Spacing:**
- Padding: 20px (all sides)
- Padding-left: 56px (to accommodate icon)
- Margin-bottom: 24px (space after box)

**Example Content:**
```
THE SCIENCE
Research by Gabriele Oettingen shows that WOOP (mental contrasting) increases goal achievement by 30% compared to positive thinking alone.
```

### CSS Code
```css
.science-box {
  position: relative;
  background-color: #B2B2B2;
  padding: 20px 20px 20px 56px;
  margin-bottom: 24px;
  font-family: 'Riforma', sans-serif;
  color: #000000;
}

.science-box::before {
  content: '🔬'; /* Or use SVG icon */
  position: absolute;
  left: 16px;
  top: 20px;
  font-size: 24px;
}

.science-box__label {
  font-family: 'Monument Grotesk Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  font-weight: 600;
}

.science-box__body {
  font-size: 16px;
  line-height: 1.5;
}

/* Optional: Collapsible version */
.science-box--collapsible .science-box__body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.science-box--collapsible.is-open .science-box__body {
  max-height: 500px;
}
```

### React Component
```jsx
const ScienceBox = ({ children, collapsible = false }) => {
  const [isOpen, setIsOpen] = useState(!collapsible);
  
  return (
    <div className={`science-box ${collapsible && !isOpen ? 'science-box--collapsible' : ''} ${isOpen ? 'is-open' : ''}`}>
      <div 
        className="science-box__label" 
        onClick={() => collapsible && setIsOpen(!isOpen)}
        style={{ cursor: collapsible ? 'pointer' : 'default' }}
      >
        THE SCIENCE {collapsible && (isOpen ? '▼' : '▶')}
      </div>
      {isOpen && <div className="science-box__body">{children}</div>}
    </div>
  );
};

// Usage:
<ScienceBox collapsible={true}>
  Research by Gabriele Oettingen shows that WOOP increases goal achievement by 30%.
</ScienceBox>
```

### When to Use
- ✅ Citing research that validates the methodology
- ✅ Explaining the psychological/neurological basis for a technique
- ✅ Building credibility with evidence
- ❌ NOT for Fast Track-specific advice (use Insight Box)
- ❌ NOT for errors or mistakes (use Warning Box)

### Placement Rules
- **Max 1-2 per screen** (science is optional depth)
- Place **below** the related section (after user has engaged with content)
- Consider making it **collapsible** (label visible, body hidden until clicked)
- Good for "advanced users" who want to know "why"

---

## 3️⃣ WARNING / COMMON MISTAKE BOX

### Purpose
Prevent errors, highlight common mistakes, critical decision points, "brutal honesty" moments

### Visual Specs

**Colors:**
- Background: `#000000` (Black)
- Left Border Accent: `4px solid #FFF469` (Yellow)
- Text: `#FFFFFF` (White)

**Icon:**
- Warning triangle or exclamation mark
- Size: 24px
- Color: `#FFF469` (Yellow)
- Position: Top-left corner, 16px from edges

**Typography:**
- **Headline:** Plaak Bold, 18px, White, Uppercase
- **Body:** Riforma Regular, 16px, Line-height: 1.5, White

**Spacing:**
- Padding: 20px (all sides)
- Padding-left: 56px (to accommodate icon)
- Border-left: 4px (yellow accent)
- Margin-bottom: 24px (space after box)

**Example Content:**
```
COMMON MISTAKE
Don't list departments ("Sales Team"). List what they DO ("Acquire new customers"). Start with a verb.
```

### CSS Code
```css
.warning-box {
  position: relative;
  background-color: #000000;
  border-left: 4px solid #FFF469;
  padding: 20px 20px 20px 56px;
  margin-bottom: 24px;
  color: #FFFFFF;
}

.warning-box::before {
  content: '⚠'; /* Or use SVG icon */
  position: absolute;
  left: 16px;
  top: 20px;
  font-size: 24px;
  color: #FFF469;
}

.warning-box__headline {
  font-family: 'Plaak', sans-serif;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: #FFF469;
}

.warning-box__body {
  font-family: 'Riforma', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #FFFFFF;
}
```

### React Component
```jsx
const WarningBox = ({ headline = "COMMON MISTAKE", children }) => (
  <div className="warning-box">
    <div className="warning-box__headline">{headline}</div>
    <div className="warning-box__body">{children}</div>
  </div>
);

// Usage:
<WarningBox headline="STOP">
  Don't submit vague goals like "Improve sales." Be specific: "Increase MRR to €50K by Q3."
</WarningBox>
```

### When to Use
- ✅ Preventing common errors (from friction report)
- ✅ "Brutal honesty" moments (challenge the user)
- ✅ Critical validation failures (before submit)
- ✅ Highlighting what NOT to do
- ❌ NOT for positive reinforcement (use Insight Box)
- ❌ NOT for optional science (use Science Box)

### Placement Rules
- **Max 1 per screen** (warnings lose impact if overused)
- Place **directly above** the field where mistake happens
- Use for **high-friction points** identified in friction report
- Can also use for **validation errors** (dynamic, appears when user makes mistake)

---

## 📏 LAYOUT INTEGRATION

### How to Place Boxes in Forms

**Option A: Inline (Recommended)**
```
[Section Header: Wish]

[Fast Track Insight Box]
"A wish is your dream in 5 years. Not a to-do list."

[Label: What is your wish?]
[Textarea input]

[Warning Box]
"Don't write bullet points. Write a story."
```

**Option B: Stacked at Top**
```
[Fast Track Insight Box]
[Science Box - Collapsible]

[Section Header: Wish]
[Label: What is your wish?]
[Textarea input]
```

**Option C: Floating Sidebar (Not Recommended)**
❌ Creates split-attention effect
❌ Users ignore sidebar content
❌ Doesn't work on mobile

**BEST PRACTICE: Option A (Inline)**
- Box appears **right before** the related field
- User reads it naturally in flow
- No context switching required

---

## 📱 RESPONSIVE BEHAVIOR

### Desktop (>768px)
- Box: Full width (max 720px container)
- Icon: 24x24px, left side
- Padding: 20px
- All boxes visible

### Mobile (<768px)
- Box: Full width (16px side margins)
- Icon: 20x20px (slightly smaller)
- Padding: 16px
- Font size: 14px body (readable on small screens)
- Science boxes: **Collapsed by default** (save screen space)

### CSS Media Query
```css
@media (max-width: 768px) {
  .ft-insight-box,
  .science-box,
  .warning-box {
    padding: 16px 16px 16px 48px;
    margin-bottom: 16px;
  }
  
  .ft-insight-box::before,
  .science-box::before,
  .warning-box::before {
    width: 20px;
    height: 20px;
    left: 12px;
    top: 16px;
  }
  
  .ft-insight-box__body,
  .science-box__body,
  .warning-box__body {
    font-size: 14px;
  }
  
  /* Auto-collapse science boxes on mobile */
  .science-box .science-box__body {
    max-height: 0;
    overflow: hidden;
  }
  
  .science-box.is-open .science-box__body {
    max-height: 500px;
  }
}
```

---

## 🎯 USAGE GUIDELINES

### Maximum Boxes Per Screen

| Box Type | Max Per Screen | Reasoning |
|----------|----------------|-----------|
| Fast Track Insight | 2 | Too many = yellow overload |
| Science | 1-2 | Optional depth, can be collapsible |
| Warning | 1 | Warnings lose impact if overused |
| **TOTAL** | **3-4 max** | More = cognitive overload |

### Content Length Guidelines

**Fast Track Insight:**
- 1-2 sentences max (30-50 words)
- One clear takeaway
- No jargon

**Science Box:**
- 2-3 sentences (50-80 words)
- Can be longer IF collapsible
- Cite source or researcher name

**Warning Box:**
- 1 sentence problem + 1 sentence solution
- Direct, actionable
- Use Fast Track tone (brutal honesty)

### Writing Tone per Box Type

**Fast Track Insight:**
- "This is the 20% that matters."
- "Fast Track way: Focus on X, ignore Y."
- "Strategic shortcut: Do this first."

**Science Box:**
- "Research shows..."
- "Studies by [Name] found..."
- "The psychology behind this..."

**Warning Box:**
- "Don't do X. Do Y instead."
- "Common mistake: ..."
- "Stop. Before you continue..."

---

## 🛠️ IMPLEMENTATION CHECKLIST

### Before You Start
- [ ] You have the 3 icon files (F logo, beaker, warning triangle)
- [ ] Fonts loaded (Plaak, Riforma, Monument Grotesk Mono)
- [ ] Color variables defined in CSS

### Step 1: Create Components
- [ ] FastTrackInsight component coded
- [ ] ScienceBox component coded (with collapsible option)
- [ ] WarningBox component coded
- [ ] All 3 tested in isolation (Storybook or test page)

### Step 2: Add to WOOP Tool
- [ ] 1-2 Fast Track Insight boxes added (per friction report)
- [ ] 1 Science box added (collapsible)
- [ ] 1 Warning box added (common mistake from friction report)
- [ ] Total boxes per step: ≤3

### Step 3: Test
- [ ] Desktop: All boxes display correctly
- [ ] Mobile: Responsive sizing works
- [ ] Mobile: Science box collapses by default
- [ ] Icons load properly
- [ ] Colors match brand guidelines exactly

### Step 4: Content Review
- [ ] Fast Track tone maintained (not too soft)
- [ ] Science boxes cite sources
- [ ] Warning boxes are actionable (not just "don't do X")
- [ ] No more than 50 words per box (except collapsible science)

---

## 📊 A/B TEST PLAN (Optional)

### Hypothesis
Info boxes will reduce cognitive load and improve clarity without overwhelming users.

### Test Setup
- **Control:** Tool without info boxes
- **Treatment:** Tool with 3-4 info boxes (1 of each type)

### Metrics
- **Primary:** Time to complete (expect 20% reduction)
- **Secondary:** Confusion questions to Guru (expect 40% reduction)
- **Qualitative:** "Did the colored boxes help?" (survey)

### Success Criteria
- Time reduced by 15%+ OR confusion questions reduced by 30%+
- Survey: >70% say boxes were helpful (not distracting)

---

## 🎨 FIGMA/DESIGN HANDOFF

### For Designers

**Fast Track Insight Box:**
- Background: #FFF469
- Border: 2px solid #000000
- Icon: Fast-Track-F-Icon.svg (24×24px)
- Padding: 20px, Padding-left: 56px
- Label: Monument Grotesk Mono, 12px, uppercase, letter-spacing 0.1em
- Body: Riforma Regular, 16px, line-height 1.5

**Science Box:**
- Background: #B2B2B2
- No border
- Icon: Science-Icon.svg (24×24px)
- Padding: 20px, Padding-left: 56px
- Label: Monument Grotesk Mono, 12px, uppercase
- Body: Riforma Regular, 16px, line-height 1.5

**Warning Box:**
- Background: #000000
- Border-left: 4px solid #FFF469
- Icon: Warning-Icon.svg (24×24px, color: #FFF469)
- Padding: 20px, Padding-left: 56px
- Headline: Plaak Bold, 18px, uppercase, color: #FFF469
- Body: Riforma Regular, 16px, line-height 1.5, color: #FFFFFF

### Export Requirements
- 3 icon SVG files (black, 24×24px, transparent background)
- Component specs in Figma (with auto-layout for dev handoff)
- Mobile variants (20×20px icons, 16px padding)

---

## 🚀 QUICK START (Copy-Paste)

### HTML + Tailwind Version
```html
<!-- Fast Track Insight Box -->
<div class="relative bg-[#FFF469] border-2 border-black p-5 pl-14 mb-6">
  <div class="absolute left-4 top-5 w-6 h-6">
    <img src="f-icon.svg" alt="Fast Track" class="w-full h-full">
  </div>
  <div class="font-mono text-xs uppercase tracking-wider mb-2 font-semibold">
    FAST TRACK INSIGHT
  </div>
  <div class="text-base leading-relaxed">
    This is the 20% of effort that drives 80% of results.
  </div>
</div>

<!-- Science Box -->
<div class="relative bg-[#B2B2B2] p-5 pl-14 mb-6">
  <div class="absolute left-4 top-5 text-2xl">🔬</div>
  <div class="font-mono text-xs uppercase tracking-wider mb-2 font-semibold">
    THE SCIENCE
  </div>
  <div class="text-base leading-relaxed">
    Research by Gabriele Oettingen shows that WOOP increases goal achievement by 30%.
  </div>
</div>

<!-- Warning Box -->
<div class="relative bg-black border-l-4 border-[#FFF469] p-5 pl-14 mb-6 text-white">
  <div class="absolute left-4 top-5 text-2xl text-[#FFF469]">⚠</div>
  <div class="font-bold text-lg uppercase mb-2 text-[#FFF469]" style="font-family: 'Plaak', sans-serif;">
    COMMON MISTAKE
  </div>
  <div class="text-base leading-relaxed">
    Don't list departments. List what they DO. Start with a verb.
  </div>
</div>
```

---

## ✅ FINAL CHECKLIST

Before marking this as "done":
- [ ] All 3 box types are visually distinct
- [ ] Colors match brand guidelines exactly
- [ ] Icons are properly sized and positioned
- [ ] Fonts match spec (Plaak, Riforma, Monument)
- [ ] Mobile responsive (tested on phone)
- [ ] Content is Fast Track tone (not generic)
- [ ] Max 3-4 boxes per screen (not overwhelming)
- [ ] Boss approved the designs

---

**Status:** Ready to implement  
**Owner:** Dev Team  
**Review Date:** After WOOP tool redesign complete  

**Next Step:** Copy React components into your sandbox and start adding boxes to 00-woop-v2.html
