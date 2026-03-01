---
name: build-tool
description: Build a new Fast Track wizard tool from scratch. Use when asked to create, digitalize, or rebuild a tool for the Fast Track program.
argument-hint: "[tool-number] [tool-name] — e.g. 23 market-sizing"
---

Build a complete Fast Track wizard tool. The user will supply source materials (course .md file, screenshot of Excel tool, report .md). Follow every rule below exactly.

## What to do

1. Read the source materials the user provides (course content .md, screenshot of Excel tool, report .md)
2. Extract: all question content, brutal truth quotes, peer proof quotes, case studies, mistakes to avoid
3. Build the complete HTML file following the spec below
4. Add `tool_questions` rows to Supabase for the new tool slug
5. Commit and push to GitHub (Railway auto-deploys)

---

## File location

`frontend/tools/module-{N}-{folder-name}/{number}-{slug}.html`

Module directories:
- Module 0 (intro-sprint): 00
- Module 1 (identity): 01–05
- Module 2 (performance): 06–11
- Module 3 (market): 12–13
- Module 4 (strategy-development): 14–16
- Module 5 (strategy-execution): 17–21
- Module 6 (org-structure): 22–25
- Module 7 (people-leadership): 26–27
- Module 8 (tech-ai): 28–29

Font files (.woff2) are co-located in each module folder — reference them with relative paths.

---

## HTML file structure (non-negotiable)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tool Name | Fast Track Program</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="../../shared/js/tool-db.js"></script>
  <script src="../../shared/js/ai-challenge.js"></script>
  <script src="../../shared/js/dependency-injection.js"></script>
  <link rel="stylesheet" href="../../shared/css/cognitive-load.css">
  <script src="../../shared/js/cognitive-load.js"></script>
  <script src="../../js/tool-access-control.js"></script>
  <style> ... all wizard CSS (copy from spec below) ... </style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
  const { useState, useEffect, useRef } = React;
  const CONFIG = { ... };
  ToolDB.init(CONFIG.TOOL_SLUG);
  ToolAccessControl.init(CONFIG.TOOL_SLUG);
  ... components ...
  function App() { ... }
  // React 18 — always use createRoot
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
</script>
</body>
</html>
```

Use `frontend/tools/module-6-org-structure/22-core-activities.html` as the canonical reference.

**NO Tailwind CDN** — never add `https://cdn.tailwindcss.com`. All styling via CSS classes or inline styles.

---

## Step structure

Every tool has:
- **Step 0** — Cover page (full-screen black, cover image, title, START button)
- **Step 0.5** — IntroPage (BEFORE WE START — see exact layout below)
- **Steps 1–N** — Wizard steps (wizard-layout: main content on LEFT, dark sidebar on RIGHT)
- **Transition screens** (step X.5) — BRUTAL TRUTH + PEER PROOF, full-screen black
- **Canvas step** (`step === 'canvas'`) — Summary of all answers + Submit Answers

### IntroPage layout (always use this structure)

```jsx
function IntroPage({ onNext }) {
    return (
        <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '64px 48px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h1 className="plaak animate-in" style={{ fontSize: 64, marginBottom: 48 }}>
                    BEFORE WE START
                </h1>

                {/* SPRINT INFO */}
                <div style={{ background: '#111', border: '1px solid #222', padding: 32, marginBottom: 32 }}>
                    <p style={{ fontFamily: "'Monument', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FFF469', marginBottom: 12 }}>SPRINT INFO</p>
                    <p className="plaak" style={{ fontSize: 24, marginBottom: 12 }}>Sprint XX: Tool Name</p>
                    <p style={{ fontSize: 16, color: '#ccc', lineHeight: 1.7 }}>Description...</p>
                </div>

                {/* PURPOSE */}
                <div style={{ marginBottom: 32 }}>
                    <p className="plaak" style={{ fontSize: 28, marginBottom: 16 }}>PURPOSE</p>
                    <div style={{ borderLeft: '4px solid #FFF469', paddingLeft: 24, marginBottom: 16 }}>
                        <p style={{ fontSize: 20, fontStyle: 'italic', color: '#ccc', lineHeight: 1.6 }}>
                            "Motivational quote."
                        </p>
                        <p style={{ fontFamily: "'Monument', monospace", fontSize: 10, color: '#555', marginTop: 8, letterSpacing: '0.1em' }}>— SOURCE</p>
                    </div>
                    <p style={{ fontSize: 16, color: '#ccc', lineHeight: 1.7 }}>What the user achieves...</p>
                </div>

                {/* MISTAKES TO AVOID */}
                <div style={{ marginBottom: 32 }}>
                    <p className="plaak" style={{ fontSize: 28, color: '#FFF469', marginBottom: 16 }}>MISTAKES TO AVOID</p>
                    {[
                        ['Mistake title', 'Supporting detail.'],
                        ['Mistake title', 'Supporting detail.'],
                    ].map(([title, text], i) => (
                        <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                            <span style={{ fontFamily: "'Monument', monospace", fontSize: 13, color: '#FFF469', minWidth: 28, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                            <div>
                                <p style={{ fontWeight: 600, marginBottom: 4 }}>{title}</p>
                                <p style={{ fontSize: 14, color: '#777' }}>{text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* THE JOURNEY */}
                <div style={{ marginBottom: 48 }}>
                    <p className="plaak" style={{ fontSize: 28, marginBottom: 24 }}>THE JOURNEY</p>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${N}, 1fr)`, gap: 16 }}>
                        {[['01', 'STEP NAME', 'description']].map(([num, title, desc]) => (
                            <div key={num} style={{ border: '1px solid #333', padding: '28px 24px' }}>
                                <p className="plaak" style={{ fontSize: 44, color: '#FFF469', marginBottom: 8 }}>{num}</p>
                                <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{title}</p>
                                <p style={{ fontSize: 13, color: '#777', lineHeight: 1.5 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Full-width yellow button */}
                <button onClick={onNext} className="plaak"
                    style={{ background: '#FFF469', color: '#000', border: 'none', padding: '18px 64px', fontSize: 20, cursor: 'pointer', letterSpacing: '0.05em', width: '100%', transition: 'all 0.2s' }}>
                    LET'S START →
                </button>
            </div>
        </div>
    );
}
```

### Transition screen (critical — always use this exact style)
```jsx
function TransitionScreen({ stepNum, onNext }) {
    const t = CONFIG.TRANSITION_CONTENT[stepNum];
    const c = CONFIG.CLOSING_MESSAGES[stepNum];
    if (!t) { onNext(); return null; }
    return (
        <div style={{ position: 'fixed', inset: 0, background: '#000', color: '#fff',
                      zIndex: 200, overflowY: 'auto', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', padding: '64px 32px' }}>
            <div style={{ maxWidth: 720, width: '100%' }} className="animate-in">
                <div style={{ fontFamily: "'Monument', monospace", fontSize: 10, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 32 }}>
                    SPRINT XX — TOOL NAME
                </div>
                {c && <div style={{ fontFamily: "'Monument', monospace", fontSize: 11, color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>✓ {c.title}</div>}
                <div style={{ borderLeft: '4px solid #DC2626', paddingLeft: 24, marginBottom: 48 }}>
                    <div style={{ fontFamily: "'Monument', monospace", fontSize: 10, color: '#DC2626', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>BRUTAL TRUTH</div>
                    <p className="plaak" style={{ fontSize: 26, lineHeight: 1.35 }}>{t.brutalTruth}</p>
                </div>
                <div style={{ borderLeft: '4px solid #FFF469', paddingLeft: 24, marginBottom: 64 }}>
                    <div style={{ fontFamily: "'Monument', monospace", fontSize: 10, color: '#FFF469', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>PEER PROOF</div>
                    <p style={{ fontSize: 18, color: '#ccc', lineHeight: 1.7, fontStyle: 'italic' }}>{t.peerProof}</p>
                </div>
                <button onClick={onNext} className="plaak"
                    style={{ background: '#FFF469', color: '#000', border: 'none', padding: '18px 48px', fontSize: 18, cursor: 'pointer', letterSpacing: '0.05em' }}>
                    CONTINUE →
                </button>
            </div>
        </div>
    );
}
```

### Wizard layout — sidebar on the RIGHT

Render `<div className="wizard-main">` **first**, `<WizardSidebar />` **last**. No `flex-direction: row-reverse` needed — DOM order puts sidebar on the right.

```jsx
// JSX render order
<div className="wizard-layout">
    <div className="wizard-main">
        <MobileStepBar currentStep={step} />
        {step === 1 && <Step1 ... />}
        {step === 2 && <Step2 ... />}
        <div className="wizard-footer">
            <button className="btn-wiz-back" onClick={goBack}>← BACK</button>
            <button className="btn-wiz-next" disabled={!isValid || aiReviewing} onClick={() => handleNext(step)}>
                {aiReviewing ? 'AI COACH REVIEWING...' : 'NEXT →'}
            </button>
        </div>
    </div>
    <WizardSidebar currentStep={step} />
</div>
```

### Wizard layout render guard (critical — prevents rendering behind transitions)

```jsx
// In App render:
if (step === 1.5) return <TransitionScreen stepNum={1} onNext={() => setStep(2)} />;
if (step === 2.5) return <TransitionScreen stepNum={2} onNext={() => setStep('canvas')} />;
if (step === 0) return <CoverPage onStart={() => setStep(0.5)} />;
if (step === 0.5) return <IntroPage onNext={() => setStep(1)} />;
if (step === 'canvas') return <CanvasStep ... />;

// Wizard — Number.isInteger guard prevents rendering behind transition screens
if (step >= 1 && step <= CONFIG.TOTAL_STEPS && Number.isInteger(step)) {
    return (
        <div className="wizard-layout"> ... </div>
    );
}
return null;
```

---

## Side-by-side paired sections (field-split)

When the source Excel has two columns that belong together (e.g. Brand Promise / Anti Brand Promise, Pluses / Minuses), use `field-split`:

```jsx
<div className="field-split">
    <div>
        <label className="field-label">Left Label</label>
        <p className="field-sub">Sub hint...</p>
        <textarea className="field-textarea" ... />
        <p className="field-help">{(data.leftField || '').length}/300</p>
    </div>
    <div>
        <label className="field-label">Right Label</label>
        <p className="field-sub">Sub hint...</p>
        <textarea className="field-textarea" ... />
        <p className="field-help">{(data.rightField || '').length}/300</p>
    </div>
</div>
```

```css
.field-split { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
@media (max-width: 768px) { .field-split { grid-template-columns: 1fr; } }
```

---

## Multi-section typeform pattern (one section at a time)

Use when a wizard step has multiple distinct sections (e.g. from Excel sheets) that would cause excessive scrolling. Each section = its own focused screen. **Reference: `frontend/tools/module-5-strategy-execution/19-brand-marketing.html`**

### Section definition arrays

```jsx
// One entry per screen within the step
const S1_SECTIONS = [
    { tag: 'SECTION 01', title: 'Current Employer Perception', hint: 'Be honest about both sides.' },
    { tag: 'SECTION 02', title: 'Target Employee Profile',      hint: 'Who do you want to attract?' },
    // ...
];
const S2_SECTIONS = [
    { tag: 'SECTION 01', title: 'Core Customer Reminder', hint: 'Who are we building this brand for?' },
    // ...
];

// In CONFIG:
const CONFIG = {
    // ...
    S1_COUNT: 7,  // must match S1_SECTIONS.length
    S2_COUNT: 5,  // must match S2_SECTIONS.length
};
```

### App state

```jsx
const [step, setStep] = useState(0);
const [s1, setS1]     = useState(0);  // 0 … S1_COUNT-1
const [s2, setS2]     = useState(0);  // 0 … S2_COUNT-1
```

### Step components — render one section based on sub-index

```jsx
function Step1Screen({ s1, data, updateData }) {
    const sec = S1_SECTIONS[s1];
    return (
        <div className="step-content animate-in" key={s1}>
            <p className="step-indicator">STEP 1 OF {CONFIG.TOTAL_STEPS} — {sec.tag}</p>
            <div className="opening-box">
                <h1 className="step-heading">{sec.title}</h1>
                <p className="step-hint">{sec.hint}</p>
            </div>
            {s1 === 0 && (
                <div className="field-split">
                    <div>
                        <label className="field-label">+ PLUSES</label>
                        <textarea className="field-textarea" value={data.pluses} onChange={e => updateData('pluses', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">− MINUSES</label>
                        <textarea className="field-textarea" value={data.minuses} onChange={e => updateData('minuses', e.target.value)} />
                    </div>
                </div>
            )}
            {s1 === 1 && (
                <div className="field-group">
                    <textarea className="field-textarea" value={data.targetProfile} onChange={e => updateData('targetProfile', e.target.value)} />
                </div>
            )}
            {/* ... one block per section ... */}
        </div>
    );
}
```

### Per-screen validation

```jsx
const isScreenValid = () => {
    const d = data;
    if (step === 1) {
        if (s1 === 0) return (d.pluses || '').length >= 20 && (d.minuses || '').length >= 20;
        if (s1 === 1) return (d.targetProfile || '').length >= 30;
        // ...
    }
    if (step === 2) {
        if (s2 === 0) return (d.coreCustomer || '').length >= 30;
        // ...
    }
    return false;
};
```

### isLastScreen helper

```jsx
const isLastScreen = () => {
    if (step === 1) return s1 === CONFIG.S1_COUNT - 1;
    if (step === 2) return s2 === CONFIG.S2_COUNT - 1;
    return false;
};
```

### Dynamic Next button label

```jsx
const nextLabel = () => {
    if (aiReviewing) return 'AI COACH REVIEWING...';
    if (step === 1 && isLastScreen()) return 'NEXT: CUSTOMER BRAND →';
    if (step === 2 && isLastScreen()) return 'VIEW CANVAS →';
    return 'NEXT →';
};
```

### handleNext — advance sub-step or trigger AI review

```jsx
const handleNext = async () => {
    // Not the last screen — just advance
    if (step === 1 && s1 < CONFIG.S1_COUNT - 1) { setS1(s1 + 1); return; }
    if (step === 2 && s2 < CONFIG.S2_COUNT - 1) { setS2(s2 + 1); return; }

    // Last screen — AI review then transition
    const userId = localStorage.getItem('ft_user_id');
    if (!userId) { alert('User not authenticated.'); return; }
    setAiReviewing(true);
    let canProceed = false;
    try {
        const stepAnswers = step === 1
            ? { field1: data.field1, field2: data.field2 /*, ...*/ }
            : { field3: data.field3, field4: data.field4 /*, ...*/ };
        const stepName = step === 1 ? 'Step 1 Name' : 'Step 2 Name';
        canProceed = await window.AIChallenge.reviewStep(userId, CONFIG.TOOL_SLUG, stepAnswers, stepName);
    } catch { canProceed = true; }
    finally { setAiReviewing(false); }
    if (canProceed) setStep(step + 0.5);
};
```

### goBack — traverses sub-steps across step boundaries

```jsx
const goBack = () => {
    if (step === 'canvas') { setStep(2); setS2(CONFIG.S2_COUNT - 1); return; }
    if (step === 2) {
        if (s2 > 0) { setS2(s2 - 1); return; }
        setStep(1); setS1(CONFIG.S1_COUNT - 1); return;  // cross-step: go to last screen of step 1
    }
    if (step === 1) {
        if (s1 > 0) { setS1(s1 - 1); return; }
        setStep(0.5); return;
    }
    if (step === 0.5) { setStep(0); return; }
};
```

### onRevise in submitWithChallenge — go back to LAST sub-step, not just step

```jsx
onRevise: () => { setSubmitStatus(null); setSubmitMessage(''); setStep(2); setS2(CONFIG.S2_COUNT - 1); }
```

### Progress bar in sidebar

```jsx
function WizardSidebar({ step, s1, s2 }) {
    const totalScreens = CONFIG.S1_COUNT + CONFIG.S2_COUNT;
    const currentScreen = step === 1 ? s1 : step === 2 ? CONFIG.S1_COUNT + s2 : totalScreens;
    const pct = Math.round((currentScreen / totalScreens) * 100);
    return (
        <div className="wizard-sidebar">
            {/* ... tool title, step dots ... */}
            <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                <p style={{ fontFamily: "'Monument', monospace", fontSize: 10, color: '#555', letterSpacing: '0.1em', marginBottom: 6 }}>PROGRESS</p>
                <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <p style={{ fontFamily: "'Monument', monospace", fontSize: 10, color: '#555', marginTop: 4 }}>{pct}%</p>
            </div>
        </div>
    );
}
```

```css
.progress-bar-wrap { height: 2px; background: #E0E0E0; margin-bottom: 0; }
.progress-bar-fill { height: 2px; background: #000; transition: width 0.3s ease; }
```

### Passing s1/s2 to sidebar and step screens

```jsx
// In wizard render — pass both s1 and s2 to sidebar
<div className="wizard-layout">
    <div className="wizard-main">
        {step === 1 && <Step1Screen s1={s1} data={data} updateData={updateData} actionIdx={actionIdx} setActionIdx={setActionIdx} />}
        {step === 2 && <Step2Screen s2={s2} data={data} updateData={updateData} />}
        <div className="wizard-footer">
            <button className="btn-wiz-back" onClick={goBack}>← BACK</button>
            <button className="btn-wiz-next" disabled={!isScreenValid() || aiReviewing} onClick={handleNext}>
                {nextLabel()}
            </button>
        </div>
    </div>
    <WizardSidebar step={step} s1={s1} s2={s2} />
</div>
```

---

## Paginated item lists (itemIdx)

When a step has a list of N repeating items (e.g. action plan rows, brainstorm cards):

```jsx
// In App state:
const [itemIdx, setItemIdx] = useState(0);

// Navigator buttons
<div className="item-nav">
    {items.map((_, i) => (
        <button key={i} className={`item-nav-btn ${i === itemIdx ? 'active' : ''}`} onClick={() => setItemIdx(i)}>
            {i + 1}
        </button>
    ))}
    <button className="item-nav-btn add-btn" onClick={addItem}>+</button>
</div>
```

```css
.item-nav { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
.item-nav-btn { width: 44px; height: 44px; border: 2px solid #E0E0E0; background: #F0F0F0; font-family: 'Monument', monospace; font-size: 13px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.item-nav-btn.active { background: #000; color: #FFF469; border-color: #000; }
.item-nav-btn:hover:not(.active) { border-color: #000; }
.item-nav-btn.add-btn { background: transparent; border: 2px dashed #E0E0E0; color: #999; font-size: 20px; }
.item-nav-btn.add-btn:hover { border-color: #000; color: #000; }
```

---

## Data flow

```js
// Init (top-level, outside React)
ToolDB.init(CONFIG.TOOL_SLUG);
ToolAccessControl.init(CONFIG.TOOL_SLUG);

// Load on mount (inside useEffect)
const saved = await ToolDB.load(userId, CONFIG.TOOL_SLUG);
if (saved) setData(d => ({ ...makeDefaultData(), ...saved }));

// Autosave (useEffect on data changes) — use savedRef to skip first render
const savedRef = useRef(false);
useEffect(() => {
    if (!savedRef.current) { savedRef.current = true; return; }
    const t = setTimeout(async () => {
        const userId = localStorage.getItem('ft_user_id');
        if (!userId || !window.ToolDB) return;
        try { await ToolDB.save(userId, CONFIG.TOOL_SLUG, data); } catch {}
    }, 2000);
    return () => clearTimeout(t);
}, [data]);

// Submit
await ToolDB.markComplete(userId, CONFIG.TOOL_SLUG);
```

`question_key` names must exactly match rows in `tool_questions` table.

---

## AI Challenge layer

```js
// Correct call signature — answers must be a plain { key: value } object, NOT an array
const ok = await window.AIChallenge.reviewStep(
    userId,
    CONFIG.TOOL_SLUG,
    { question_key: 'answer text here' },   // plain object
    'Step Name'
);
if (!ok) return; // user chose to revise

// Final submission
await window.AIChallenge.submitWithChallenge(userId, CONFIG.TOOL_SLUG, questionMappings, {
    onReviewStart: () => setSubmitMessage('AI coach is reviewing...'),
    onRevise: () => { setSubmitStatus(null); setSubmitMessage(''); setStep(lastStep); },
    onSubmitAnyway: () => { setSubmitStatus('success'); setSubmitMessage('Saved successfully!'); },
    onError: (err) => { setSubmitStatus('error'); setSubmitMessage('Failed: ' + err.message); }
});
```

- Add AI review on steps where the user writes free text
- Skip rating/toggle/checklist steps
- **Never** gate the SUBMIT button alone with AI review — use `submitWithChallenge`

---

## Null safety rules (critical)

**Every** `.filter()` or property access on data loaded from DB must be null-guarded:

```js
// WRONG — crashes when DB returns null elements
data.strengthsList.filter(s => s.trim())
data.values.filter(v => v.value.trim())

// CORRECT
(data.strengthsList || []).filter(s => s && typeof s === 'string' && s.trim())
(data.values || []).filter(v => v && v.value && v.value.trim())
(data.activities || []).filter(a => a && a.name && a.name.trim())
```

Always use `(data.field || [])` before chaining array methods. Always use `(data.field || '')` before `.length`.

---

## Supabase tool_questions rows

After building the file, insert rows:
```sql
INSERT INTO tool_questions (tool_slug, question_key, question_text)
VALUES
  ('your-slug', 'key1', 'Question label — what this captures'),
  ('your-slug', 'key2', 'Question label — what this captures')
ON CONFLICT (tool_slug, question_key) DO UPDATE SET question_text = EXCLUDED.question_text;
```

Use descriptive `question_key` names that match the data object fields passed to `submitWithChallenge`.

---

## JSX rules (Babel standalone — strict)

- NO `{/* comment */}` as the **first expression** in an `=> (` implicit return body
- NO `expression && ()` with empty parens
- Always `Number.isInteger(step)` guard on wizard render — prevents wizard rendering behind transition screens
- TransitionScreen always `position: fixed; inset: 0; z-index: 200; overflowY: auto`
- Use `ReactDOM.createRoot(document.getElementById('root')).render(<App />)` — NOT `ReactDOM.render`

---

## Design tokens (brand only — no exceptions)

```
Colors:
  #000000  — black (primary, headings, active states)
  #ffffff  — white
  #FFF469  — yellow accent (active sidebar dot, hover states, highlight text on black bg)
  #DC2626  — red (errors, warnings, brutal truth accent)
  #1a1a1a  — sidebar background
  #F9F9F9  — light grey background for info boxes
  #E0E0E0  — border grey
  #4ade80  — green (done/complete state ONLY — sidebar done dot, success checkmarks)

Fonts:
  'Plaak'    — headings, numbers, large labels (bold)
  'Riforma'  — body text, inputs
  'Monument' — monospace labels, step indicators, uppercase tags

FORBIDDEN colors (never use):
  #22c55e / green-*  — use #4ade80 for done states only; never for decorative use
  #f59e0b / yellow-* (Tailwind) — use #FFF469 instead
  #3b82f6 / blue-*   — NOT a brand color
  #8b5cf6 / purple-* — NOT a brand color
  Tailwind utility classes (bg-yellow-100, bg-red-50, etc.) — off-brand
```

---

## Wizard CSS (copy exactly)

```css
@font-face { font-family: 'Plaak';    src: url('Plaak3Trial-43-Bold.woff2') format('woff2'); font-weight: bold; }
@font-face { font-family: 'Riforma';  src: url('RiformaLL-Regular.woff2')   format('woff2'); font-weight: normal; }
@font-face { font-family: 'Monument'; src: url('MonumentGrotesk-Mono.woff2') format('woff2'); }

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Riforma', -apple-system, sans-serif; font-size: 16px; color: #000; background: #000; -webkit-font-smoothing: antialiased; }

.plaak   { font-family: 'Plaak', sans-serif; font-weight: bold; letter-spacing: -0.01em; line-height: 1.2; }
.monument { font-family: 'Monument', monospace; letter-spacing: 0.05em; }

/* Sidebar on RIGHT — render main first, sidebar second */
.wizard-layout  { display: flex; min-height: 100vh; }
.wizard-main    { flex: 1; display: flex; flex-direction: column; min-height: 100vh; background: #fff; padding: 0 48px; }
.wizard-sidebar { width: 280px; background: #1a1a1a; min-height: 100vh; padding: 48px 32px; display: flex; flex-direction: column; position: sticky; top: 0; align-self: flex-start; height: 100vh; overflow-y: auto; }

.step-content   { max-width: 100%; padding: 40px 0; flex: 1; }
.step-indicator { font-family: 'Monument', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 8px; }
.opening-box    { margin-bottom: 32px; }
.opening-box .step-heading { font-family: 'Plaak', sans-serif; font-size: 32px; color: #000; margin-bottom: 6px; }
.opening-box .step-hint    { font-size: 14px; color: #666; line-height: 1.5; }

.field-group    { margin-bottom: 28px; }
.field-group:last-child { margin-bottom: 0; }
.field-label    { font-weight: 600; font-size: 15px; color: #000; margin-bottom: 6px; display: block; }
.field-sub      { font-size: 13px; color: #666; margin-bottom: 6px; line-height: 1.5; }
.field-input    { border: 1px solid #E0E0E0; padding: 12px 16px; font-family: 'Riforma', sans-serif; font-size: 16px; width: 100%; color: #000; background: #fff; transition: border-color 0.2s; }
.field-input:focus { outline: none; border-color: #000; }
.field-textarea { border: 1px solid #E0E0E0; padding: 12px 16px; font-family: 'Riforma', sans-serif; font-size: 16px; width: 100%; min-height: 100px; resize: none !important; color: #000; background: #fff; transition: border-color 0.2s; }
.field-textarea:focus { outline: none; border-color: #000; }
.field-help     { font-size: 13px; color: #666; margin-top: 4px; }

/* Side-by-side paired sections (e.g. Promise / Anti-Promise, Pluses / Minuses) */
.field-split    { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }

.wizard-footer  { display: flex; justify-content: space-between; align-items: center; padding: 24px 48px; border-top: 1px solid #e5e7eb; background: #fff; }
.btn-wiz-back   { background: transparent; border: 2px solid #d1d5db; color: #6b7280; padding: 12px 28px; font-family: 'Monument', monospace; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
.btn-wiz-back:hover { border-color: #000; color: #000; }
.btn-wiz-next   { background: #000; color: #fff; border: 2px solid #000; padding: 12px 36px; font-family: 'Monument', monospace; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
.btn-wiz-next:hover:not(:disabled) { background: #FFF469; color: #000; border-color: #FFF469; }
.btn-wiz-next:disabled { background: #E0E0E0; color: #9CA3AF; border-color: #E0E0E0; cursor: not-allowed; }

.sidebar-tool-num   { font-family: 'Monument', monospace; font-size: 10px; color: #555; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
.sidebar-tool-title { font-family: 'Plaak', sans-serif; font-size: 22px; color: #fff; margin-bottom: 32px; line-height: 1.1; }
.sidebar-step       { padding: 8px 0; border-bottom: 1px solid #2a2a2a; display: flex; align-items: center; gap: 8px; }
.sidebar-step:last-child { border-bottom: none; }
.sidebar-step-dot   { width: 6px; height: 6px; border-radius: 50%; background: #555; flex-shrink: 0; transition: background 0.2s; }
.sidebar-step-dot.active { background: #FFF469; }
.sidebar-step-dot.done   { background: #4ade80; }
.sidebar-step-label { font-family: 'Monument', monospace; font-size: 10px; letter-spacing: 0.08em; color: #555; text-transform: uppercase; transition: color 0.2s; }
.sidebar-step-label.active { color: #FFF469; }
.sidebar-step-label.done   { color: #4ade80; }

.ai-message { background: #FFF9C4; border: 1px solid #FFF469; border-left: 4px solid #FFF469; padding: 12px 16px; font-size: 14px; color: #333; margin-bottom: 16px; line-height: 1.6; }

.animate-in { animation: fadeSlideIn 0.4s ease both; }
@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

/* Canvas — canvas-wrap uses inline style; overflow-x: hidden is required to prevent horizontal scroll */
/* canvas-split grid overflow fix: min-width:0 on children + overflow:hidden on body/section */
.canvas-section        { border: 1px solid #E0E0E0; margin-bottom: 24px; overflow: hidden; }
.canvas-section-header { background: #000; color: #fff; padding: 16px 24px; }
.canvas-section-title  { font-family: 'Plaak', sans-serif; font-size: 22px; color: #fff; }
.canvas-body           { padding: 24px; overflow: hidden; }
.canvas-split          { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.canvas-split > *      { min-width: 0; }  /* prevents grid items overflowing their column */
.canvas-field          { margin-bottom: 16px; min-width: 0; }
.canvas-field-label    { font-family: 'Monument', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-bottom: 6px; }
.canvas-field-value    { font-size: 15px; color: #000; line-height: 1.6; white-space: pre-wrap; overflow-wrap: break-word; word-break: break-word; }

/* Dep context */
.dep-context        { border: 1px solid #E0E0E0; margin-bottom: 24px; }
.dep-context-header { background: #F5F5F5; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
.dep-context-label  { font-family: 'Monument', monospace; font-size: 10px; letter-spacing: 0.1em; color: #666; text-transform: uppercase; }
.dep-context-body   { padding: 14px 16px; font-size: 14px; color: #333; line-height: 1.6; }

/* Mobile */
.mobile-step-bar { display: none; }
@media (max-width: 768px) {
    .wizard-sidebar { display: none; }
    .wizard-main { padding: 0 24px; }
    .mobile-step-bar { display: flex; align-items: center; gap: 8px; padding: 16px 24px; background: #1a1a1a; }
    .mobile-step-dot { width: 8px; height: 8px; border-radius: 50%; background: #333; transition: background 0.2s; }
    .mobile-step-dot.active { background: #FFF469; }
    .mobile-step-dot.done   { background: #4ade80; }
    .mobile-step-text { font-family: 'Monument', monospace; font-size: 11px; color: #fff; letter-spacing: 0.06em; margin-right: 8px; }
    .wizard-footer { padding: 16px 24px; }
    .field-split { grid-template-columns: 1fr; }
    .canvas-split { grid-template-columns: 1fr; }
}
```

---

## Info boxes (use these patterns only)

```jsx
{/* Neutral info / hint box */}
<div style={{ background: '#F9F9F9', borderLeft: '4px solid #000', padding: '14px 20px', marginBottom: 24 }}>
    <div style={{ fontFamily: "'Monument', monospace", fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>LABEL</div>
    <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>Text here.</p>
</div>

{/* Warning / error box */}
<div style={{ background: '#FEF2F2', borderLeft: '4px solid #DC2626', padding: '14px 20px', marginBottom: 24 }}>
    <p style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>Warning text.</p>
</div>

{/* ft-reveal — insight that appears after answer is filled */}
{(data.someField || '').length >= 20 && (
    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
        <div style={{ fontFamily: "'Monument', monospace", fontSize: 10, letterSpacing: '0.12em', color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>FAST TRACK INSIGHT</div>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}>Insight text...</p>
    </div>
)}
```

**Never use:** `FastTrackInsight`, `ScienceBox`, `ScienceBookmarkIcon` components from cognitive-load. **Never use** Tailwind CDN.

---

## Submission success state

```jsx
{submitStatus === 'success' ? (
    <div style={{ color: '#16a34a', fontFamily: "'Monument', monospace", fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
        ✓ {submitMessage || 'Submitted successfully!'}
    </div>
) : submitStatus === 'error' ? (
    <div style={{ color: '#DC2626', fontSize: 14 }}>{submitMessage}</div>
) : (
    <button className="btn-canvas-submit" onClick={onSubmit}>SUBMIT →</button>
)}
```

---

## Commit and deploy

```bash
git add frontend/tools/.../<file>.html
git commit -m "feat: build tool XX (name) as wizard layout

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin main   # Railway auto-deploys — NEVER use Railway MCP
```

---

## Arguments

`$ARGUMENTS` contains the tool number and name the user passed, e.g. `23 market-sizing`.
Use it as context alongside any source files the user attaches.
