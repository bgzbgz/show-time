# 🎯 FAST TRACK TOOL TEMPLATE - DEFINITIVE CHECKLIST

**Last Updated:** 2026-02-10
**Based On:** WOOP Tool + Meeting Rhythm Tool (Perfect Templates)
**Purpose:** Every tool we build must match this standard.

---

## ⚠️ CRITICAL REQUIREMENTS - READ FIRST

**These three things MUST work or the tool is incomplete:**

1. **HELP MODAL MUST ACTUALLY WORK**
   - Don't just create the button - implement the full HelpModal component
   - Add `{showHelp && <HelpModal />}` to EVERY step page
   - Fill in real WHY-WHAT-HOW content for each step (from sprint content)
   - Test that clicking ? button opens modal with content

2. **SPRINT CONTENT MUST BE INTEGRATED**
   - Minimum 3 direct quotes from Brain Juice visible in tool
   - Authority quote on intro page (Peter Drucker, etc.)
   - Quote in each step instruction box (yellow left border)
   - Cardinal sins or major mistakes in prominent yellow box

3. **TYPOGRAPHY HIERARCHY MUST BE CORRECT**
   - h1, h2: Plaak (uppercase)
   - h3, h4, h5: Riforma Bold (sentence case)
   - No mixing fonts on headings

**If any of these is missing, STOP and fix before proceeding.**

---

## 🔴 JAVASCRIPT/REACT SYNTAX RULES (PREVENTS WHITE PAGE ERRORS)

**WHITE PAGE = JAVASCRIPT ERROR. Follow these rules EXACTLY:**

### Rule 1: Always Import Fragment
```javascript
// ❌ WRONG - Will break if you use Fragment anywhere
const { useState, useEffect, useRef } = React;

// ✅ CORRECT - Always include Fragment
const { useState, useEffect, useRef, Fragment } = React;
```

**Why:** If you use `<Fragment>` or `<React.Fragment>` anywhere in your code and Fragment isn't imported, the entire tool will show a white page.

### Rule 2: Never Use Escaped Quotes in JSX Placeholders

```javascript
// ❌ WRONG - Breaks Babel parsing
placeholder='We couldn\'t answer the question'
placeholder="He said \"this is broken\""

// ✅ CORRECT - Use HTML entities
placeholder="We couldn't answer the question"  // No escape needed for simple apostrophe
placeholder="We couldn&apos;t answer"           // Or use HTML entity
placeholder="He said &quot;this works&quot;"    // Use &quot; for quotes inside
```

**Common HTML Entities:**
- `&quot;` = " (double quote)
- `&apos;` = ' (apostrophe/single quote)
- `&amp;` = & (ampersand)
- `&lt;` = < (less than)
- `&gt;` = > (greater than)

**Real Example from Tools:**
```javascript
// ❌ WRONG - This broke the tool:
placeholder='"We almost lost our biggest client last month because we couldn\'t answer..."'

// ✅ CORRECT - This works:
placeholder="&quot;We almost lost our biggest client last month because we couldn&apos;t answer...&quot;"
```

### Rule 3: Test The File Opens

Before delivering ANY tool:
1. Open the HTML file in Chrome
2. Press F12 to open console
3. Look for red errors
4. If white page or errors: FIX BEFORE DELIVERING

**Common Errors:**
- `Fragment is not defined` → Import Fragment
- `Unexpected token` → Check for escaped quotes in JSX
- `Uncaught SyntaxError` → Usually quote escaping issue

---

## ✅ MANDATORY CHECKLIST

Use this checklist for EVERY tool you build. Check each item off.

### 📁 FILE STRUCTURE

- [ ] Single HTML file (standalone, no dependencies except CDN)
- [ ] Title format: `[Tool Name] | Fast Track Program`
- [ ] React 18 via CDN
- [ ] Tailwind CSS via CDN
- [ ] jsPDF + html2canvas for PDF export
- [ ] All fonts embedded: Plaak, Riforma, Monument (.otf files in same folder)
- [ ] All images in same folder (cover image, logo)

### 🎨 DESIGN SYSTEM

#### Colors
- [ ] Primary: `#000000` (black) - all major buttons, headers, borders
- [ ] Background: `#FFFFFF` (white) - main background
- [ ] Accent: `#FFF469` (yellow) - ONLY for "MISTAKES TO AVOID" headers and help button hover
- [ ] Input borders: `#E0E0E0` (light gray)
- [ ] Success: `#22C55E` (green) - for completed states, plan sections
- [ ] Warning: `#EF4444` (red) - for obstacles, errors

#### Typography

**CRITICAL: Font Hierarchy**
- [ ] **h1, h2 ONLY**: Plaak font (bold, uppercase)
  - Cover title: `text-9xl` (128px)
  - Section titles: `text-6xl` (60px)
- [ ] **h3, h4, h5**: Riforma Bold (`.riforma-bold` class, sentence case)
  - Subsection: `text-3xl` (30px)
  - Sub-subsection: `text-2xl` (24px)
  - Small headings: `text-xl` (20px)
- [ ] **Body text**: Riforma (regular, sentence case)
  - Body: `text-xl` (20px) or `text-lg` (18px)
  - Inputs: `18px`
- [ ] **Labels**: Monument (uppercase, wide spacing)
  - Labels: `text-sm` (14px) or `text-xs` (12px) with `letter-spacing: 0.05em`

**CSS Classes Required:**
```css
.plaak {
  font-family: 'Plaak', sans-serif;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: -0.02em;
}

.riforma-bold {
  font-family: 'Riforma', sans-serif;
  font-weight: bold;
}

.monument {
  font-family: 'Monument', monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

#### Spacing
- [ ] Container max-width: `max-w-6xl` (1280px)
- [ ] Main padding: `p-12` (48px)
- [ ] Section margins: `mb-8` (32px) between major sections
- [ ] Input padding: `12px 16px`
- [ ] Button padding: `16px 32px` (primary), `12px 24px` (secondary)

### 🔘 BUTTONS

#### Primary Button
```css
- [ ] Background: #000000
- [ ] Color: #FFFFFF
- [ ] Padding: 16px 32px
- [ ] Border: 2px solid #000000
- [ ] Font size: 18px
- [ ] Font family: 'Riforma'
- [ ] Hover: transform: scale(1.02)
- [ ] Disabled: gray background (#E0E0E0), opacity 0.5, cursor: not-allowed
```

#### Secondary Button
```css
- [ ] Background: #FFFFFF
- [ ] Color: #000000
- [ ] Padding: 12px 24px
- [ ] Border: 2px solid #000000
- [ ] Font size: 16px
- [ ] Hover: background #F8F8F8
```

### 📝 FORM INPUTS

#### Text Input
- [ ] Border: `1px solid #E0E0E0`
- [ ] Padding: `12px 16px`
- [ ] Font size: `18px`
- [ ] Font family: `Riforma`
- [ ] Width: `100%`
- [ ] Focus: border color changes to `#000000`, no outline

#### Textarea
- [ ] Same as text input
- [ ] Min-height: `120px`
- [ ] Resize: `vertical`
- [ ] Placeholder: detailed, multi-line examples with `white-space: normal`

### 🎯 NUMBERED SECTION BADGE

```css
- [ ] Background: #000000
- [ ] Color: #FFFFFF
- [ ] Padding: 10px 16px
- [ ] Font family: 'Plaak'
- [ ] Font size: 26px
- [ ] Display: inline-block
- [ ] Format: "[01] SECTION NAME"
```

### ❓ HELP BUTTON

- [ ] Position: `fixed`, top: `24px`, right: `24px`
- [ ] Size: `56px × 56px`
- [ ] Border-radius: `50%`
- [ ] Background: `#000000`
- [ ] Color: `#FFFFFF`
- [ ] Content: `?`
- [ ] Font size: `28px`
- [ ] Hover: background changes to `#FFF469`, color to `#000000`, scale(1.1)
- [ ] Z-index: `40`

### 📊 PROGRESS INDICATOR

- [ ] Dots: `12px` diameter circles
- [ ] Default: `#E0E0E0`
- [ ] Active: `#000000`, scale(1.3)
- [ ] Completed: `#000000`
- [ ] Connected with horizontal lines
- [ ] Shows step names below dots

---

## 📚 SPRINT CONTENT INTEGRATION

**CRITICAL: Every tool must include direct quotes from sprint content.**

### Required Sprint Content
- [ ] Read sprint Brain Juice document thoroughly
- [ ] Extract powerful quotes (3-5 minimum)
- [ ] Identify key statistics and facts
- [ ] Note any "cardinal sins" or major mistakes lists
- [ ] Find metaphors and analogies used in content

### Where to Place Quotes

#### 1. Intro Page - Purpose Section
```jsx
<div className="border-l-4 border-white pl-6 mb-6">
  <p className="text-3xl italic mb-2">"[Powerful quote from sprint]"</p>
  <p className="text-xl text-gray-400">— [AUTHOR NAME]</p>
</div>
```

#### 2. Intro Page - Sprint Info Box
```jsx
<div className="border-l-4 border-black pl-4 italic text-lg">
  "[Metaphor or key insight from sprint content]"
</div>
```

#### 3. Step Page - Instruction Boxes
```jsx
<div className="bg-black text-white border-4 border-black p-6 mb-8">
  <h3 className="riforma-bold text-3xl mb-2">[Step Title]</h3>
  <p className="text-xl mb-4">
    [Main instruction text]
  </p>
  <p className="text-lg italic border-l-4 border-yellow-400 pl-4">
    "[Quote from sprint content related to this step]"
  </p>
</div>
```

#### 4. Mistakes to Avoid - Cardinal Sins Box
```jsx
<div className="bg-white text-black p-6 mb-6 border-4 border-yellow-400">
  <p className="riforma-bold text-2xl mb-4">[TITLE OF SINS/MISTAKES]:</p>
  <ul className="text-xl space-y-3">
    <li className="flex items-start">
      <span className="text-3xl mr-3">•</span>
      <span>[Specific mistake from sprint]</span>
    </li>
    {/* More mistakes */}
  </ul>
</div>
```

### Content Extraction Guidelines
- [ ] **Quote attribution**: Use actual names (Peter Drucker, Patrick Lencioni, etc.)
- [ ] **Statistics**: Include exact numbers (30% more likely, 20% improvement, etc.)
- [ ] **Metaphors**: Use vivid comparisons from content (conductor of symphony, engine room, etc.)
- [ ] **Methodology references**: Name specific frameworks (5 Whys, 80/20, Theory of Constraints, etc.)
- [ ] **Action language**: Preserve the direct, commanding tone of sprint content

### Checklist
- [ ] Minimum 3 direct quotes integrated
- [ ] At least 1 quote on intro page
- [ ] At least 1 quote per step instruction box
- [ ] "Cardinal sins" or major mistakes prominently displayed in yellow box
- [ ] Statistics and facts included where relevant
- [ ] All quotes properly attributed
- [ ] Quotes styled with italic text and left border

---

## 🗂️ PAGE STRUCTURE

### 1. COVER PAGE (step = 0)

```jsx
<div className="relative min-h-screen flex items-center justify-center">
  <img src="[cover-image]" className="absolute inset-0 w-full h-full object-cover" />
  <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))'}}></div>
  <div className="relative z-10 text-center text-white px-8">
    <h1 className="plaak text-9xl mb-6 animate-in">[TOOL NAME]</h1>
    <p className="text-3xl mb-12 animate-in" style={{animationDelay: '0.2s'}}>
      [One-line tool description]
    </p>
    <button className="bg-white text-black plaak text-3xl px-16 py-6 border-4 border-white hover:bg-black hover:text-white">
      START
    </button>
  </div>
</div>
```

**Checklist:**
- [ ] Background image with dark gradient overlay
- [ ] Centered white text
- [ ] Plaak font for title (text-9xl)
- [ ] Subtitle in normal text (text-3xl)
- [ ] Large white button that inverts on hover
- [ ] Animation: slideIn with staggered delays

---

### 2. INTRO PAGE (step = 0.5)

```jsx
<div className="bg-black text-white min-h-screen p-16">
  <div className="max-w-5xl mx-auto">
    <h1 className="plaak text-9xl mb-16 animate-in">BEFORE WE START</h1>

    {/* Optional: User Details Form */}
    <div className="mb-12 animate-in" style={{animationDelay: '0.05s'}}>
      <h2 className="plaak text-6xl mb-6">YOUR DETAILS</h2>
      <div className="space-y-6 bg-white text-black p-8">
        {/* Form fields */}
      </div>
    </div>

    {/* Sprint Info */}
    <div className="mb-12 animate-in" style={{animationDelay: '0.08s'}}>
      <h2 className="plaak text-6xl mb-6" style={{color: '#fff469'}}>SPRINT INFO</h2>
      <div className="bg-white text-black p-8">
        <p className="text-2xl font-bold mb-4">[Sprint Name]</p>
        <p className="text-xl leading-relaxed">[Sprint description]</p>
      </div>
    </div>

    {/* Purpose */}
    <div className="mb-12 animate-in" style={{animationDelay: '0.1s'}}>
      <h2 className="plaak text-6xl mb-6">PURPOSE</h2>
      <p className="text-3xl leading-relaxed">[Main purpose statement]</p>
      <p className="text-2xl text-gray-400 mt-4">[Supporting context]</p>
    </div>

    {/* Mistakes to Avoid */}
    <div className="mb-12 animate-in" style={{animationDelay: '0.2s'}}>
      <h2 className="plaak text-6xl mb-6" style={{color: '#fff469'}}>MISTAKES TO AVOID</h2>
      <ul className="text-2xl space-y-4">
        <li className="flex items-start">
          <span className="text-4xl mr-4">•</span>
          <span>[Mistake 1]</span>
        </li>
        {/* 3-5 mistakes */}
      </ul>
    </div>

    {/* The Journey */}
    <div className="mb-16 animate-in" style={{animationDelay: '0.3s'}}>
      <h2 className="plaak text-6xl mb-8">THE JOURNEY</h2>
      <div className="grid grid-cols-4 gap-8 text-center">
        {[1,2,3,4].map(i => (
          <div className="border-2 border-white p-8">
            <div className="text-9xl plaak mb-4">0{i}</div>
            <p className="text-2xl font-bold mb-2">[STEP NAME]</p>
            <p className="text-xl text-gray-400">[Step subtitle]</p>
          </div>
        ))}
      </div>
    </div>

    <button className="btn-primary w-full text-3xl py-8 plaak">
      LET'S START →
    </button>
  </div>
</div>
```

**Checklist:**
- [ ] Black background throughout
- [ ] "BEFORE WE START" header (Plaak, text-9xl)
- [ ] Optional user details form (white box on black bg)
- [ ] Sprint Info with yellow header (#fff469)
- [ ] Purpose section with large text (text-3xl)
- [ ] Mistakes to Avoid with yellow header and bullet points (text-4xl bullets)
- [ ] Journey with 4 numbered boxes (border-2 border-white)
- [ ] Large primary button at bottom
- [ ] Staggered animations (0.05s, 0.08s, 0.1s, 0.2s, 0.3s delays)

---

### 3. MAIN STEP PAGE (steps 1-4)

```jsx
{/* Header */}
<header className="border-b-2 border-black py-6 px-8 no-print">
  <h1 className="plaak text-3xl">[TOOL NAME]</h1>
  <p className="text-sm mt-2 text-gray-600">[Tool tagline]</p>
</header>

{/* Progress Indicator */}
<div className="border-b border-gray-200 py-6 px-8 no-print">
  {/* Progress dots with lines */}
</div>

{/* Main Content */}
<main className="p-12 max-w-6xl mx-auto">
  <div className="animate-in">
    {/* Numbered Section */}
    <div className="numbered-section mb-8">
      [01] SECTION NAME
    </div>

    {/* Instruction Box */}
    <div className="bg-black text-white border-4 border-black p-6 mb-8">
      <h3 className="riforma-bold text-3xl mb-2">[Instruction Title]</h3>
      <p className="text-xl mb-4">
        [Instruction description - what to do and why]
      </p>
      <p className="text-lg italic border-l-4 border-yellow-400 pl-4">
        "[Direct quote from sprint Brain Juice that relates to this step]"
      </p>
    </div>

    {/* Form Fields */}
    <div className="space-y-8">
      {/* Individual fields */}
    </div>

    {/* Navigation */}
    <div className="flex justify-between mt-12">
      <button className="btn-secondary">← Back</button>
      <button className="btn-primary" disabled={!canProceed}>
        Next: [Step Name] →
      </button>
    </div>
  </div>
</main>
```

**Checklist:**
- [ ] Header with tool name and tagline
- [ ] Progress indicator with dots and lines
- [ ] Numbered section badge
- [ ] Black instruction box at top
- [ ] Form fields with proper spacing (space-y-8)
- [ ] Back and Next buttons (Next disabled until valid)
- [ ] Max-width container (max-w-6xl)
- [ ] Proper padding (p-12)

---

### 4. TRANSITION SCREEN (between steps)

```jsx
<div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50 fade-in">
  <div className="text-center px-8">
    <h1 className="plaak text-8xl md:text-9xl mb-8 transition-animate-in">
      SECTION COMPLETE
    </h1>

    <div className="max-w-2xl mx-auto mb-8 transition-animate-in" style={{animationDelay: '0.2s'}}>
      <div className="h-2 bg-gray-800 mb-4">
        <div className="h-full bg-white transition-all duration-1000" style={{width: '25%'}}></div>
      </div>
      <p className="monument text-xl tracking-wider">[25% COMPLETE]</p>
    </div>
  </div>
</div>
```

**Checklist:**
- [ ] Full screen black background
- [ ] Centered text
- [ ] "SECTION COMPLETE" or similar message
- [ ] Progress bar showing percentage
- [ ] Monument font for percentage text
- [ ] Auto-advance after 2 seconds (or manual continue button)
- [ ] Fade-in animation

---

### 5. CANVAS/SUMMARY PAGE

```jsx
<div className="min-h-screen bg-white">
  {/* Header */}
  <header className="no-print border-b-4 border-black p-6">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <div>
        <h1 className="plaak text-4xl mb-2">YOUR [TOOL] CANVAS</h1>
        <p className="text-gray-600">[Tagline]</p>
      </div>
      <button className="btn-secondary">← Edit</button>
    </div>
  </header>

  {/* Canvas Content */}
  <div className="max-w-6xl mx-auto p-12">
    <div className="border-4 border-black p-8 mb-8">
      {/* Display all data in organized sections */}
      {/* Use color-coded boxes for different sections */}
    </div>

    {/* Action Buttons */}
    <div className="flex gap-4 no-print">
      <button className="btn-primary flex-1">Share With Team</button>
      <button className="btn-secondary flex-1">Export PDF</button>
      <button className="btn-primary flex-1">Final Submit</button>
    </div>
  </div>
</div>
```

**Checklist:**
- [ ] Header with canvas name and edit button
- [ ] Main canvas box with 4px black border
- [ ] All user data displayed clearly
- [ ] Color-coded sections (green for success, red for obstacles, etc.)
- [ ] Three action buttons at bottom (equal width, gap-4)
- [ ] "no-print" class on buttons and interactive elements

---

## 💬 PLACEHOLDER TEXT RULES

### ❌ BAD (Vague)
```
placeholder="Enter your goal"
placeholder="Describe your vision"
placeholder="Your answer"
```

### ✅ GOOD (Specific, Detailed, Multi-line)
```
placeholder="It's 90 days from now. The Fast Track program is complete. Our team is aligned on 3 values. We've implemented the ABC system. Weekly metrics dashboard is live. Revenue up 15%."

placeholder="My team makes decisions without me. Clients notice we're more responsive. I have 10 hours/week for strategy work. My calendar has 3 open blocks for deep thinking."

placeholder="Schedule 90-minute workshop with leadership team to brainstorm our 5 core values. Book the room. Send the invite. That's it."
```

**Rules:**
- [ ] Always use real names, dates, numbers
- [ ] Show the level of detail expected
- [ ] Multiple sentences for context
- [ ] Specific examples, not generic statements
- [ ] Use line breaks for multi-line placeholders (`&#10;` in HTML)

---

## 🔍 VALIDATION RULES

- [ ] Minimum character counts (display as "X/300 characters (min 20)")
- [ ] Required fields marked with red asterisk `<span className="text-red-500">*</span>`
- [ ] Disable next button until validation passes
- [ ] Show character count below text fields
- [ ] NO error messages on invalid input - just disabled button
- [ ] Validation is preventive, not punitive

---

## 📱 HELP MODAL

**CRITICAL: Help button must actually work! Don't just create the button - implement the full modal.**

### State Management
```jsx
const [showHelp, setShowHelp] = useState(false);
```

### Help Button Component
```jsx
function HelpButton({ onClick }) {
  return (
    <button className="help-button" onClick={onClick}>
      ?
    </button>
  );
}
```

### Help Modal Component (MUST IMPLEMENT)
```jsx
function HelpModal({ onClose, stepNumber }) {
  const helpContent = {
    1: {
      title: "[STEP 1 NAME]",
      why: "[Why this step matters - extract from sprint content]",
      what: "[What user needs to do - be specific]",
      how: [
        "[Specific action 1]",
        "[Specific action 2]",
        "[Specific action 3]",
        "[Specific action 4]",
        "[Specific action 5]"
      ]
    },
    2: { /* Step 2 content */ },
    3: { /* Step 3 content */ },
    4: { /* Step 4 content */ }
  };

  const content = helpContent[stepNumber] || helpContent[1];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 fade-in" onClick={onClose}>
      <div className="bg-white max-w-3xl p-12 border-8 border-black max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="plaak text-5xl">{content.title}</h2>
          <button onClick={onClose} className="text-4xl font-bold hover:text-gray-600">×</button>
        </div>

        {/* WHY Section */}
        <h3 className="riforma-bold text-3xl mb-4">Why</h3>
        <p className="mb-6 text-lg leading-relaxed">{content.why}</p>

        {/* WHAT Section */}
        <h3 className="riforma-bold text-3xl mb-4">What</h3>
        <p className="mb-6 text-lg leading-relaxed">{content.what}</p>

        {/* HOW Section */}
        <h3 className="riforma-bold text-3xl mb-4">How</h3>
        <ol className="text-lg space-y-3 mb-8">
          {content.how.map((step, index) => (
            <li key={index} className="leading-relaxed">
              <span className="riforma-bold">{index + 1}.</span> {step}
            </li>
          ))}
        </ol>

        <button onClick={onClose} className="btn-primary w-full text-xl py-4">
          GOT IT
        </button>
      </div>
    </div>
  );
}
```

### Integration with Steps (CRITICAL)
```jsx
if (step === 1) {
  return (
    <>
      <StepPage
        stepNumber={1}
        data={data}
        setShowHelp={setShowHelp}
        /* other props */
      />
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} stepNumber={1} />}
    </>
  );
}

if (step === 2) {
  return (
    <>
      <Step2Page
        data={data}
        setShowHelp={setShowHelp}
        /* other props */
      />
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} stepNumber={2} />}
    </>
  );
}

// Repeat for steps 3, 4, etc.
```

### Help Content Requirements
- [ ] **WHY**: Extract from sprint Brain Juice - why this step matters (with stats if available)
- [ ] **WHAT**: Clear, specific description of what user needs to accomplish
- [ ] **HOW**: 5-7 specific, actionable steps (not vague instructions)
- [ ] Use sprint content language and terminology
- [ ] Include Fast Track principles (80/20, first principles, etc.)

### Checklist
- [ ] Full screen overlay (black, 90% opacity, click to close)
- [ ] White content box with 8px black border
- [ ] Max-width: 3xl (768px)
- [ ] Step name as header (Plaak, text-5xl)
- [ ] Close button (× symbol, text-4xl, top-right)
- [ ] **WHY-WHAT-HOW** sections with Riforma Bold headers (NOT Plaak)
- [ ] "GOT IT" button at bottom
- [ ] Max-height with overflow scroll
- [ ] **Modal actually renders** when help button clicked
- [ ] **Content is populated** for each step (not placeholder text)
- [ ] Click outside modal closes it (stopPropagation on inner div)

---

## 🎬 ANIMATIONS

### Slide In (page transitions)
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: slideIn 0.3s ease-out;
}
```

### Staggered Animations (intro page)
```jsx
style={{animationDelay: '0.05s'}}  // First element
style={{animationDelay: '0.1s'}}   // Second element
style={{animationDelay: '0.2s'}}   // Third element
```

**Checklist:**
- [ ] All page transitions use slideIn animation
- [ ] Intro page elements have staggered delays
- [ ] Button hovers use scale(1.02)
- [ ] Smooth transitions (0.2s ease)

---

## 💾 DATA & STATE

### State Structure
```jsx
const [data, setData] = useState({
  // Section 1
  field1: '',
  field2: '',

  // Section 2 (array of objects)
  items: [{ name: '', value: '' }],

  // Section 3
  confirmed: false
});
```

### Auto-Save
- [ ] Auto-save to localStorage every 2 seconds
- [ ] Load saved data on component mount
- [ ] Store with timestamp
- [ ] Handle parse errors gracefully

### Add/Remove Items
```jsx
const addItem = () => {
  setData(prev => ({
    ...prev,
    items: [...prev.items, { name: '', value: '' }]
  }));
};

const removeItem = (index) => {
  if (data.items.length > 1) {
    setData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  }
};
```

**Checklist:**
- [ ] All data in single state object
- [ ] Auto-save implementation
- [ ] Add/remove functions for dynamic lists
- [ ] Minimum 1 item check on remove
- [ ] "+" Add button styled as btn-secondary

---

## 📄 PDF EXPORT

**Checklist:**
- [ ] jsPDF library loaded
- [ ] html2canvas library loaded
- [ ] **CRITICAL: Images hidden during export to avoid CORS errors**
- [ ] Export button disabled during generation
- [ ] Button text changes to "Generating PDF..."
- [ ] Filename format: `[TOOL-NAME]-Canvas-[DATE].pdf`
- [ ] A4 page size (210mm × 297mm)
- [ ] 10mm margins
- [ ] `.no-print` class hides interactive elements

**CRITICAL: CORS Fix Required**

Images loaded from the file system cause "tainted canvas" errors that break PDF export. You MUST temporarily hide images during export:

```javascript
const exportPDF = async () => {
  try {
    console.log('Starting PDF export...');

    // Check if libraries are loaded
    if (!window.jspdf || !window.html2canvas) {
      alert('PDF library not loaded. Please refresh the page and try again.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    const canvas = document.getElementById('canvas-content');
    if (!canvas) {
      alert('Canvas element not found.');
      return;
    }

    // ⚠️ CRITICAL: Hide images to avoid CORS/tainted canvas error
    const images = canvas.querySelectorAll('img');
    const imageStates = [];
    images.forEach(img => {
      imageStates.push({ img, display: img.style.display });
      img.style.display = 'none';
    });

    console.log('Generating PDF...');
    const canvasImage = await html2canvas(canvas, {
      scale: 2,
      logging: false,
      allowTaint: false,
      useCORS: false
    });

    // ⚠️ CRITICAL: Restore images after export
    imageStates.forEach(({ img, display }) => {
      img.style.display = display;
    });

    const imgData = canvasImage.toDataURL('image/png');
    const imgWidth = 190;
    const imgHeight = (canvasImage.height * imgWidth) / canvasImage.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    const filename = `Tool-Name-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);

    console.log('PDF exported successfully!');
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert('Failed to export PDF: ' + error.message);
  }
};
```

**Why This Fix is Required:**
- Logo image (`FastTrack_F_White.png`) loads from file system
- Cross-origin images create "tainted canvas" security errors
- Canvas with tainted content cannot call `toDataURL()`
- Solution: Hide images → generate PDF → restore images
- PDF exports successfully with all text content (minus logo)

---

## 📤 SUBMIT FUNCTIONALITY

```jsx
const handleSubmit = async () => {
  const submissionData = {
    toolName: '[tool-name]',
    userId: data.userId,
    sprintNumber: X,
    timestamp: new Date().toISOString(),
    data: {
      // All form data here
    }
  };

  const response = await fetch('[WEBHOOK_URL]', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submissionData)
  });

  const result = await response.json();

  if (result.status === 'success') {
    alert('Data saved successfully!');
    localStorage.setItem('lastSubmissionId', result.submissionId);
  } else {
    alert('Failed to save. Please try again.');
  }
};
```

**Checklist:**
- [ ] Webhook URL configured
- [ ] Standard submission format
- [ ] Success/error handling
- [ ] Store submission ID in localStorage
- [ ] User-friendly alert messages

---

## 📋 FINAL QUALITY CHECKLIST

Before delivering ANY tool, verify:

### Visual
- [ ] No emojis anywhere
- [ ] **Typography hierarchy correct**: h1/h2 = Plaak, h3/h4/h5 = Riforma Bold
- [ ] All text in correct fonts (Plaak for major headers, Riforma for body/subheaders, Monument for labels)
- [ ] Black and white color scheme (yellow only for "MISTAKES TO AVOID" and quote borders)
- [ ] Proper spacing and padding
- [ ] Clean, minimal design

### Functional
- [ ] Auto-save works
- [ ] Validation prevents proceeding with incomplete data
- [ ] Back/Next navigation works
- [ ] Add/remove items works (if applicable)
- [ ] Help modal displays correct content
- [ ] PDF export generates correctly WITHOUT CORS errors (images temporarily hidden during export)
- [ ] Submit webhook works

### Content
- [ ] All placeholders are detailed and specific
- [ ] Character counts displayed
- [ ] Instructions use WHY-WHAT-HOW format
- [ ] "Mistakes to Avoid" section complete
- [ ] Journey boxes show 4 steps
- [ ] **Sprint content integrated**: Minimum 3 direct quotes from Brain Juice
- [ ] **Quote on intro page**: Peter Drucker or other authority quote
- [ ] **Quotes in instruction boxes**: Each step has relevant quote with yellow border
- [ ] **Cardinal sins/mistakes box**: Prominent yellow-bordered box with specific mistakes from sprint
- [ ] **Metaphors used**: Symphony conductor, engine room, or other vivid comparisons from content
- [ ] **Statistics included**: Exact numbers (30% improvement, 20% higher, etc.)

### Performance
- [ ] Loads in under 2 seconds
- [ ] No console errors
- [ ] Works on mobile (basic responsiveness)
- [ ] All fonts load correctly

---

## 🎯 THE FAST TRACK AESTHETIC

**What makes it "Fast Track":**
1. ✅ Brutal honesty in placeholders
2. ✅ No hand-holding or cuteness
3. ✅ Black/white/yellow only
4. ✅ Big, bold typography
5. ✅ Direct, challenging tone
6. ✅ Forces specificity, prevents vagueness
7. ✅ Zero tolerance for slogans
8. ✅ Clean, minimal, focused

**What RUINS the Fast Track aesthetic:**
1. ❌ Emojis
2. ❌ Pastel colors
3. ❌ Rounded corners everywhere
4. ❌ Cute illustrations
5. ❌ Generic placeholders
6. ❌ Too much white space
7. ❌ Soft, friendly tone
8. ❌ Allowing vague answers

---

## 📞 WHEN IN DOUBT

Ask yourself:
1. Would this make sense in a boardroom?
2. Is the placeholder specific enough that I could use it as-is?
3. Does this force the user to think hard?
4. Is there ANY emoji? (If yes, delete it)
5. Would a CEO find this professional?

If you answer "no" to any of these, fix it.

---

**END OF TEMPLATE**

Use this document as the single source of truth for all Fast Track tools.
Every tool should pass 100% of these checklists.
