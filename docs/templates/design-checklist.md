# Fast Track Tools Design Checklist

> Extracted from WOOP Tool (00-woop.html)
> Last Updated: 2026-02-12

---

## Quick Reference

### Brand Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Black** | `#000000` | Primary backgrounds, text on light backgrounds, borders |
| **White** | `#FFFFFF` | Text on dark backgrounds, light backgrounds, button backgrounds |
| **Fast Track Yellow** | `#FFF469` / `#fff469` | Accent color, highlights, hover states |
| **Light Gray** | `#E0E0E0` | Input borders (normal state), disabled backgrounds |
| **Medium Gray** | `#9CA3AF` | Disabled text |
| **Off-White** | `#F8F8F8` | Secondary button hover |
| **Very Light Gray** | `#FAFAFA` | Canvas step boxes |
| **Light Green** | `#F0FDF4` | Canvas wish/plan boxes (success states) |
| **Green** | `#22C55E` | Canvas borders (wish/plan) |
| **Light Red** | `#FEF2F2` | Obstacle boxes background |
| **Red** | `#EF4444` | Obstacle borders (warnings) |
| **Border Gray** | `#E5E7EB` | Canvas box borders |

### Typography

| Element | Font | Size | Weight | Letter Spacing | Line Height |
|---------|------|------|--------|----------------|-------------|
| **H1** | Plaak | text-3xl to text-9xl | bold | -0.01em | 1.2 |
| **H2** | Plaak | text-5xl to text-6xl | bold | -0.01em | 1.2 |
| **H3** | Riforma | text-xl to text-3xl | bold (font-bold) | default | default |
| **H4** | Riforma | text-xl | bold (font-bold) | default | default |
| **Body** | Riforma | 16px / 18px | normal | default | default |
| **Labels** | Riforma | 18px / text-lg / text-xl | bold (font-bold) | default | default |
| **Buttons** | Riforma | 16px / 18px | normal | default | default |
| **Monument (monospace)** | Monument | text-sm to text-xl | normal | 0.05em | default |

### Font Files (woff2)

```css
@font-face {
    font-family: 'Plaak';
    src: url('Plaak3Trial-43-Bold.woff2') format('woff2');
    font-weight: bold;
}

@font-face {
    font-family: 'Riforma';
    src: url('RiformaLL-Regular.woff2') format('woff2');
    font-weight: normal;
}

@font-face {
    font-family: 'Monument';
    src: url('MonumentGrotesk-Mono.woff2') format('woff2');
}
```

---

## Design Checklist for Each Tool

### ✅ Colors

- [ ] **Primary Black**: `#000000` for main backgrounds, primary text on light, borders
- [ ] **White**: `#FFFFFF` for text on dark backgrounds, light page backgrounds
- [ ] **Fast Track Yellow**: `#fff469` for accent/highlight (critical boxes, section headers)
- [ ] **Light Gray**: `#E0E0E0` for input borders (normal state)
- [ ] **Border Gray**: `#E5E7EB` for subtle container borders
- [ ] **Red (Obstacles Only)**: `#EF4444` for obstacle section borders/warnings
- [ ] **Light Red Background**: `#FEF2F2` for obstacle boxes
- [ ] **Green (Success)**: `#22C55E` for plan/wish borders on canvas
- [ ] **Light Green**: `#F0FDF4` for success box backgrounds
- [ ] **NO other colors** unless tool-specific and approved
- [ ] **NO emojis** anywhere in the tool

### ✅ Typography

#### Font Loading
- [ ] All three fonts declared with `@font-face` using woff2 format
- [ ] Font files placed in same directory as HTML tool
- [ ] Body default font: `'Riforma', -apple-system, sans-serif`
- [ ] Font smoothing enabled: `-webkit-font-smoothing: antialiased`

#### Heading Hierarchy
- [ ] **H1**: Plaak, bold, sizes: text-3xl to text-9xl depending on context
- [ ] **H2**: Plaak, bold, sizes: text-5xl to text-6xl
- [ ] **H3**: Riforma with `font-bold` class, sizes: text-xl to text-3xl
- [ ] **H4**: Riforma with `font-bold` class, size: text-xl
- [ ] Plaak has letter-spacing: `-0.01em`, line-height: `1.2`

#### Body & UI Text
- [ ] Body text: Riforma, 16px default, 18px for inputs
- [ ] Labels: Riforma, font-bold, text-lg or text-xl
- [ ] Button text: Riforma, 16-18px, normal weight
- [ ] Monument for monospace/code-like elements: letter-spacing `0.05em`

### ✅ Buttons

#### Primary Button (`.btn-primary`)
- [ ] Background: `#000000` (black)
- [ ] Text: `#FFFFFF` (white)
- [ ] Border: `2px solid #000000`
- [ ] Padding: `16px 32px`
- [ ] Font: Riforma, 18px
- [ ] Transition: `all 0.2s ease`
- [ ] Border-radius: 0 (sharp corners)

#### Primary Hover State
- [ ] Transform: `scale(1.02)`
- [ ] Box-shadow: `0 4px 8px rgba(0,0,0,0.1)`

#### Primary Disabled State
- [ ] Background: `#E0E0E0` (light gray)
- [ ] Color: `#9CA3AF` (medium gray)
- [ ] Opacity: `0.5`
- [ ] Cursor: `not-allowed`

#### Secondary Button (`.btn-secondary`)
- [ ] Background: `#FFFFFF` (white)
- [ ] Text: `#000000` (black)
- [ ] Border: `2px solid #000000`
- [ ] Padding: `12px 24px`
- [ ] Font: Riforma, 16px
- [ ] Transition: `all 0.2s ease`

#### Secondary Hover State
- [ ] Background: `#F8F8F8` (off-white)

### ✅ Input Fields

#### Text Input (`.worksheet-input`)
- [ ] Border: `1px solid #E0E0E0`
- [ ] Padding: `12px 16px`
- [ ] Font: Riforma, 18px
- [ ] Width: `100%`
- [ ] Transition: `border-color 0.2s ease`

#### Textarea (`.worksheet-textarea`)
- [ ] Same as text input
- [ ] Min-height: `120px`
- [ ] Resize: `vertical`

#### Focus State (both)
- [ ] Outline: `none`
- [ ] Border-color: `#000000` (black)

#### Validation/Error State
- [ ] Use Tailwind classes for red borders/backgrounds in obstacle sections
- [ ] Yellow borders/backgrounds for warnings: `border-yellow-500`, `bg-yellow-100`

### ✅ Containers & Cards

#### Page Container
- [ ] Max-width: `max-w-6xl` (Tailwind) = 1152px
- [ ] Padding: `p-12` (48px) on desktop
- [ ] Margin: `mx-auto` (centered)

#### Section Numbering (`.numbered-section`)
- [ ] Background: `#000000`
- [ ] Color: `#FFFFFF`
- [ ] Padding: `10px 16px`
- [ ] Font: Plaak, 26px, bold
- [ ] Letter-spacing: `0.5px`
- [ ] Display: `inline-block`
- [ ] Example: `[01] YOUR WISH`

#### Black Instruction Boxes
- [ ] Background: `#000000`
- [ ] Color: `#FFFFFF`
- [ ] Border: `4px solid #000000`
- [ ] Padding: `p-6` (24px)

#### Yellow Warning Boxes (Critical Decisions)
- [ ] Background: `#fff469` (Fast Track yellow)
- [ ] Border: `4px solid #000000`
- [ ] Text: `#000000` (black)
- [ ] Padding: `p-8` (32px)

#### Canvas Boxes (for final output/PDF)
- [ ] **Wish Box**: bg `#F0FDF4`, border-left `6px solid #22C55E`, other borders `2px solid #E5E7EB`
- [ ] **Step Box**: border `3px solid #000000`, bg `#FAFAFA`
- [ ] **Obstacle Box**: bg `#FEF2F2`, border-left `6px solid #EF4444`, other borders `2px solid #E5E7EB`
- [ ] **Plan Box**: border `5px solid #22C55E`, bg `#F0FDF4`

### ✅ Progress Indicators

#### Progress Dots (`.progress-dot`)
- [ ] Width/Height: `12px`
- [ ] Border-radius: `50%` (circle)
- [ ] Background (default): `#E0E0E0`
- [ ] Background (active): `#000000`, transform `scale(1.3)`
- [ ] Background (completed): `#000000`
- [ ] Transition: `all 0.2s ease`

#### Progress Line
- [ ] Height: `0.5` (2px)
- [ ] Background: `#E0E0E0` (unfilled)
- [ ] Fill: `#000000` (completed)
- [ ] Transition: `all` duration varies

### ✅ Layout & Spacing

#### Header
- [ ] Border-bottom: `2px solid #000000`
- [ ] Padding: `py-6 px-8`

#### Main Content Area
- [ ] Padding: `p-12` (desktop), adjust for mobile
- [ ] Max-width: `max-w-6xl`
- [ ] Centered: `mx-auto`

#### Spacing Between Elements
- [ ] Section margin-bottom: `mb-8` (32px) to `mb-16` (64px)
- [ ] Element spacing within section: `mb-6` (24px)
- [ ] Form field spacing: `space-y-8` or individual `mb-6`/`mb-8`

#### Grid Layouts
- [ ] Example: 4-column journey grid: `grid grid-cols-4 gap-8`
- [ ] Example: 2-column outcome steps: `grid grid-cols-2 gap-4`

### ✅ Interactive Behaviors

#### Transitions & Animations
- [ ] Global smooth transition: `transition: all 0.2s ease`
- [ ] Hover transforms: `scale(1.02)` or `scale(1.1)`
- [ ] Slide-in animation: `translateY(20px)` to `0`, duration `0.3s ease-out`
- [ ] Fade-in animation: opacity `0` to `1`, duration `0.5s ease-out`

#### Hover States
- [ ] Buttons: scale up slightly + shadow
- [ ] Help button: scale `1.1`, bg changes to `#fff469`, text to black
- [ ] Secondary button: bg changes to `#F8F8F8`

#### Focus States
- [ ] Inputs: border changes to black (`#000000`)
- [ ] Remove default outline: `outline: none`

#### Validation Feedback
- [ ] Character counters: `text-sm text-gray-600` below inputs
- [ ] Required fields marked with `<span className="text-red-500">* REQUIRED</span>`
- [ ] Disabled button: opacity + color + cursor change

### ✅ Special Components

#### Help Button (`.help-button`)
- [ ] Position: `fixed`, top: `24px`, right: `24px`
- [ ] Size: `56px × 56px`
- [ ] Border-radius: `50%` (circle)
- [ ] Background: `#000000`, text: `#FFFFFF`
- [ ] Content: `?` character, font-size: `28px`
- [ ] Z-index: `40`
- [ ] Hover: background `#fff469`, text `#000000`, scale `1.1`

#### Cover Page
- [ ] Background: `#000000` (full screen)
- [ ] Text: `#FFFFFF`
- [ ] Title: Plaak, text-9xl
- [ ] Animations: staggered delays (`0.2s`, `0.4s`, etc.)

#### Modal/Help Overlay
- [ ] Background: `rgba(0, 0, 0, 0.9)` (90% black)
- [ ] Content container: white background, max-width, centered
- [ ] Border: `8px solid #000000`
- [ ] Close button: large `×` character

### ✅ Data Flow Patterns

#### Live Updates
- [ ] User input in Step 1 → Display in later sections
- [ ] Placeholder text changes based on scope selection (program vs business)
- [ ] Preview updates dynamically as user types (If-Then plan preview)

#### Auto-Save
- [ ] Data saved to localStorage with `2000ms` (2s) delay
- [ ] Includes timestamp
- [ ] Restored on page load

#### Data References in UI
- [ ] Earlier inputs displayed in styled containers
- [ ] Scope reminder badge: yellow background, border, bold text
- [ ] Referenced data in canvas: distinct boxes with color coding

#### Canvas Display (Final Output)
- [ ] All 4 sections (Wish, Outcome, Obstacles, Plan) displayed
- [ ] Each styled differently (color-coded boxes)
- [ ] Ready for PDF export with enhanced styles

### ✅ Responsive Design

#### Breakpoints
- [ ] Use Tailwind responsive prefixes: `md:`, `lg:`, etc.
- [ ] Example: `text-8xl md:text-9xl` (smaller on mobile)

#### Mobile Considerations
- [ ] Reduce padding on small screens
- [ ] Stack grid layouts vertically
- [ ] Adjust font sizes down

### ✅ Print/PDF Styles

- [ ] `.no-print` class hides UI elements (buttons, help, header) in PDF
- [ ] Enhanced border widths and shadows for canvas boxes
- [ ] `@media print` rule to hide `.no-print` elements
- [ ] Canvas container: `border-width: 5px`, strong shadow

---

## CSS Class Reference

### Utility Classes

```css
.plaak {
    font-family: 'Plaak', sans-serif;
    font-weight: bold;
    letter-spacing: -0.01em;
    line-height: 1.2;
}

.monument {
    font-family: 'Monument', monospace;
    letter-spacing: 0.05em;
}

.smooth {
    transition: all 0.2s ease;
}
```

### Form Elements

```css
.worksheet-input {
    border: 1px solid #E0E0E0;
    padding: 12px 16px;
    font-family: 'Riforma', sans-serif;
    font-size: 18px;
    transition: border-color 0.2s ease;
    width: 100%;
}

.worksheet-input:focus {
    outline: none;
    border-color: #000000;
}

.worksheet-textarea {
    border: 1px solid #E0E0E0;
    padding: 12px 16px;
    font-family: 'Riforma', sans-serif;
    font-size: 18px;
    transition: border-color 0.2s ease;
    width: 100%;
    min-height: 120px;
    resize: vertical;
}

.worksheet-textarea:focus {
    outline: none;
    border-color: #000000;
}
```

### Buttons

```css
.btn-primary {
    background: #000000;
    color: #FFFFFF;
    padding: 16px 32px;
    border: 2px solid #000000;
    font-family: 'Riforma', sans-serif;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.btn-primary:disabled {
    background: #E0E0E0;
    color: #9CA3AF;
    cursor: not-allowed;
    opacity: 0.5;
}

.btn-secondary {
    background: #FFFFFF;
    color: #000000;
    padding: 12px 24px;
    border: 2px solid #000000;
    font-family: 'Riforma', sans-serif;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-secondary:hover {
    background: #F8F8F8;
}
```

### Section Headers

```css
.numbered-section {
    background: #000000;
    color: #FFFFFF;
    padding: 10px 16px;
    font-size: 26px;
    font-weight: bold;
    letter-spacing: 0.5px;
    display: inline-block;
    font-family: 'Plaak', sans-serif;
}
```

### Special Components

```css
.help-button {
    position: fixed;
    top: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #000000;
    color: #FFFFFF;
    border: 2px solid #000000;
    font-size: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 40;
    transition: all 0.2s ease;
}

.help-button:hover {
    transform: scale(1.1);
    background: #fff469;
    color: #000000;
}

.progress-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #E0E0E0;
    transition: all 0.2s ease;
}

.progress-dot.active {
    background: #000000;
    transform: scale(1.3);
}

.progress-dot.completed {
    background: #000000;
}
```

### Animations

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

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.fade-in {
    animation: fadeIn 0.5s ease-out;
}

.transition-animate-in {
    animation: slideIn 0.3s ease-out;
}
```

### Canvas/PDF Export Styles

```css
.canvas-wish-box {
    background-color: #F0FDF4 !important;
    border-left: 6px solid #22C55E !important;
    border-right: 2px solid #E5E7EB !important;
    border-top: 2px solid #E5E7EB !important;
    border-bottom: 2px solid #E5E7EB !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    padding: 20px !important;
}

.canvas-step-box {
    border-width: 3px !important;
    border-color: #000000 !important;
    background-color: #FAFAFA !important;
    padding: 16px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
}

.canvas-obstacle-box {
    background-color: #FEF2F2 !important;
    border-left: 6px solid #EF4444 !important;
    border-right: 2px solid #E5E7EB !important;
    border-top: 2px solid #E5E7EB !important;
    border-bottom: 2px solid #E5E7EB !important;
    padding: 16px !important;
    box-shadow: 0 2px 4px rgba(239,68,68,0.15) !important;
    margin-bottom: 16px !important;
}

.canvas-plan-box {
    border-width: 5px !important;
    border-color: #22C55E !important;
    background-color: #F0FDF4 !important;
    padding: 24px !important;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
}

.canvas-container {
    border-width: 5px !important;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
}

@media print {
    .no-print {
        display: none !important;
    }
}
```

---

## JavaScript Patterns for Data Flow

### State Management

```javascript
// Use React hooks for state
const [data, setData] = useState({
    // Structure mirrors the tool's data model
    scopeType: '',
    outcome: '',
    worldChange: '',
    feeling: '',
    steps: ['', '', ''],
    obstacles: [{ problem: '', ifTrigger: '', thenPerson: '', thenAction: '', byWhen: '' }],
    bigChunks: '',
    firstAction: '',
    deadline: ''
});

// Update single field
const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
};

// Update array item
const updateStep = (index, value) => {
    setData(prev => ({
        ...prev,
        steps: prev.steps.map((s, i) => i === index ? value : s)
    }));
};
```

### Auto-Save Pattern

```javascript
const autosaveTimer = useRef(null);

useEffect(() => {
    if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
    }

    autosaveTimer.current = setTimeout(() => {
        localStorage.setItem('toolData', JSON.stringify({
            data,
            step,
            timestamp: new Date().toISOString()
        }));
    }, 2000); // 2 second delay

    return () => {
        if (autosaveTimer.current) {
            clearTimeout(autosaveTimer.current);
        }
    };
}, [data, step]);
```

### Data References in Later Sections

```javascript
// Display earlier input dynamically
{data.scopeType === 'program' ? (
    <p>Your focus: Fast Track Program Completion</p>
) : (
    <p>Your focus: Company Strategic Transformation</p>
)}

// Dynamic placeholders
const placeholders = data.scopeType === 'program' ? {
    outcome: "Program-specific example...",
    worldChange: "Program-specific change..."
} : {
    outcome: "Business-specific example...",
    worldChange: "Business-specific change..."
};
```

### Live Preview Updates

```javascript
// Show preview of constructed statement
{(obstacle.ifTrigger || obstacle.thenPerson || obstacle.thenAction || obstacle.byWhen) && (
    <div className="mt-6 p-4 bg-green-50 border-2 border-green-500">
        <p className="font-bold mb-2">Your If-Then Plan:</p>
        <p className="text-lg">
            IF <strong>{obstacle.ifTrigger || '___'}</strong>,
            THEN <strong>{obstacle.thenPerson || '___'}</strong> will
            <strong> {obstacle.thenAction || '___'}</strong>
            BY <strong>{obstacle.byWhen || '___'}</strong>
        </p>
    </div>
)}
```

### Validation Pattern

```javascript
// Compute validation state
const canProceedStep1 = data.outcome.length >= 20 &&
                       data.worldChange.length >= 10 &&
                       data.feeling.length >= 3;

// Disable button based on validation
<button
    className="btn-primary text-xl py-4 px-8"
    disabled={!canProceedStep1}
    onClick={onNext}
>
    Next: Define Steps →
</button>
```

---

## Design No-Nos ❌

- ❌ **NO emojis** anywhere in the tool UI
- ❌ **NO colors** outside the approved brand palette
- ❌ **NO fonts** outside Plaak/Riforma/Monument
- ❌ **NO inline styles** (use CSS classes and Tailwind)
- ❌ **NO rounded corners** on buttons/inputs (sharp edges only)
- ❌ **NO gradients** except for cover overlays if needed
- ❌ **NO shadows** except for hover states and canvas boxes
- ❌ **NO custom icons** without approval (use text/symbols instead)
- ❌ **NO red color** outside obstacle/warning sections
- ❌ **NO mixing font families** within the same text block

---

## Tool Development Checklist

### Before Starting
- [ ] Read this design checklist thoroughly
- [ ] Review WOOP tool as reference implementation
- [ ] Confirm tool-specific requirements with stakeholder

### During Development
- [ ] Copy font files (woff2) to tool directory
- [ ] Add @font-face declarations
- [ ] Set up base styles (body, reset)
- [ ] Create all custom CSS classes before adding Tailwind
- [ ] Use React hooks for state management
- [ ] Implement auto-save with 2s delay
- [ ] Add validation for all required fields
- [ ] Test all interactive states (hover, focus, disabled)
- [ ] Ensure data flows between sections correctly
- [ ] Add character counters where appropriate

### Before Launch
- [ ] Test on multiple browsers
- [ ] Test responsive behavior
- [ ] Test auto-save and data restoration
- [ ] Test PDF export if applicable
- [ ] Verify all colors match brand palette
- [ ] Verify NO emojis present
- [ ] Verify typography hierarchy correct
- [ ] Test all validation messages
- [ ] Test disabled states
- [ ] Ensure accessibility (keyboard navigation, labels)

---

## Notes

1. **Tailwind CSS**: The WOOP tool uses Tailwind CDN for utility classes. All tools should follow this pattern for consistency.

2. **React**: Tools use React via CDN with Babel for JSX transformation. No build step required.

3. **Supabase**: Tools integrate with Supabase for data persistence. Configuration object at top of script.

4. **File Organization**: Each tool is self-contained in a single HTML file with inline CSS and JavaScript for maximum portability.

5. **Brand Consistency**: The design system prioritizes:
   - Bold, high-contrast aesthetics (black/white/yellow)
   - Sharp edges (no border-radius)
   - Clear typography hierarchy
   - Minimal visual decoration
   - Focus on content and functionality

---

**END OF CHECKLIST**
