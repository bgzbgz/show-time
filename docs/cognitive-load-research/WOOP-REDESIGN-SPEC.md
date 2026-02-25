# WOOP Tool Redesign Specification
## Based on Your Cognitive Load Research

**Date:** 2026-02-17  
**Source:** NotebookLM extraction + Fast Track requirements  
**Target:** 00-woop.html redesign  
**Goal:** Reduce scrolling 50%, completion time 30%

---

## 🎯 YOUR RESEARCH FINDINGS (Applied to WOOP)

### Key Numbers from Your Research

| Metric | Your Finding | WOOP Application |
|--------|--------------|------------------|
| **Field threshold** | 10-15+ fields = intimidation | WOOP has ~12-16 fields → MUST split |
| **Optimal steps** | 3-7 steps (target: 4) | WOOP = 4 steps (W, O, O, P) ✅ |
| **Fields per step** | 5-7 max | WOOP: 3-4 fields per step ✅ |
| **Scrolling limit** | 3-5 pages = cognitive drain | Current WOOP = 5+ pages → FIX |
| **Info boxes** | Max 2 per screen (1 yellow + 1 grey) | Apply to each WOOP step |
| **Conversion boost** | Multi-step = 86% higher (HubSpot) | Expected improvement |

---

## 📐 EXACT SPECIFICATIONS FROM YOUR RESEARCH

### Layout Rules (From Your Research)

```
Container Width: 640px max (your research: 580-720px range)
Column: Single column ONLY
Spacing System: 8px grid
  - Label to Input: 8px
  - Between Fields: 24-32px (use 32px for "breathability")
  - Between Sections: 48-64px
  - Inside Containers: 16-32px padding
```

### Typography Scale (From Your Research)

```
Page Title (H1): 28px / 34px line-height (Bold)
Section Header (H2): 24px / 32px line-height (Bold)
Field Labels: 14px (Medium/Bold weight)
Input Text: 16px MINIMUM (prevents mobile zoom)
Help/Error Text: 13-14px
```

### Colors (Fast Track + Your Research)

```
Primary: Black #000000 & White #FFFFFF
Accent: Yellow #FFF469 (focus rings, insight boxes)
  ⚠️ NEVER yellow text on white (fails WCAG)
  ✅ Yellow background + black text
Grey: #F3F4F6 (science boxes)
Error: #DC2626 (red)
```

---

## 🏗️ WOOP TOOL: 4-STEP WIZARD STRUCTURE

### Step 1: WISH (Fields: 3)
**Cognitive Load: LOW (easy start for momentum)**

**Fields:**
1. What is your wish? (Textarea, 150 words min)
2. Time horizon (Dropdown: 1 year, 3 years, 5 years)
3. Why does this matter to you? (Textarea, 50 words)

**Info Boxes (Max 2):**
- **Yellow Box (Fast Track Insight):** "Your wish is the destination, not the to-do list. Paint the picture of arrival in 5 years."
- **Grey Box (Science):** "Research by Gabriele Oettingen shows that WOOP increases goal achievement by 30% compared to positive thinking alone."

**Validation:**
- Disable bullet points (enforce narrative)
- Min word count: 150 words
- On blur: Check for "I will" or "We will" → warn "Describe the outcome, not the action"

---

### Step 2: OUTCOME (Fields: 4)
**Cognitive Load: MEDIUM (requires specificity)**

**Fields:**
1. Best possible outcome (Textarea, 100 words)
2. How will you measure success? (Text input)
3. What number defines success? (Number input)
4. By when? (Date picker)

**Info Boxes (Max 2):**
- **Yellow Box:** "Be specific. Not 'Improve sales' but 'Increase MRR to €50K by Q3 2026.'"
- **Grey Box:** "Mental contrasting (imagining success + obstacles) is 2x more effective than visualization alone."

**Validation:**
- Require number in field 3
- Require date in field 4
- On blur field 2: Check for vague terms ("improve", "better") → warn "Use measurable terms"

---

### Step 3: OBSTACLE (Fields: 3-4)
**Cognitive Load: MEDIUM-HIGH (requires honesty)**

**Fields:**
1. Main internal obstacle (Dropdown: Fear, Lack of skill, Procrastination, Unclear priorities, Other)
2. Describe the obstacle (Textarea, 50 words)
3. What triggers this obstacle? (Text input)
4. [Optional] Secondary obstacle (Text input)

**Info Boxes (Max 2):**
- **Yellow Box (Brutal Honesty):** "The obstacle is usually YOU. Not the market, not your team. What are YOU avoiding?"
- **Grey Box:** "Identifying obstacles activates the prefrontal cortex (planning brain), making you 40% more likely to overcome them."

**Validation:**
- Require fields 1-3
- Field 4 optional (mark clearly)

---

### Step 4: PLAN (Fields: 4-5)
**Cognitive Load: MEDIUM (action-oriented)**

**Fields:**
1. If-Then Plan: "If [obstacle occurs], then I will..." (Textarea, 50 words)
2. First action (this week) (Text input)
3. Who owns this? (Text input - name required)
4. When will you start? (Date picker - must be within 7 days)
5. [Optional] Accountability partner (Text input)

**Info Boxes (Max 2):**
- **Yellow Box:** "If-Then plans increase follow-through by 300%. Be specific: 'If I feel overwhelmed, then I will take a 10-min walk.'"
- **Black Box (Warning):** "COMMON MISTAKE: Don't assign to 'The Team.' Name ONE person. You."

**Validation:**
- Require "If" and "then" in field 1 (regex check)
- Field 3: Reject "team", "IT", "management" → require proper name
- Field 4: Must be ≤7 days from today
- On submit: Show summary of all 4 steps before final save

---

## 🎨 VISUAL IMPLEMENTATION (Your Research Applied)

### Progress Indicator (Sticky Top)
```html
<div class="sticky top-0 bg-white border-b-2 border-black py-4 px-6 z-50">
  <div class="max-w-[640px] mx-auto">
    <p class="text-sm font-mono uppercase mb-2">Step 2 of 4: Outcome</p>
    <div class="w-full bg-gray-200 h-2">
      <div class="bg-black h-2" style="width: 50%"></div>
    </div>
  </div>
</div>
```

**Why (Your Research):**
- Labelled stages > percentages (reduces ambiguity)
- Sticky = always visible (reduces anxiety)
- Shows "Step 2: Outcome" (conceptual milestone)

---

### Info Box Components (Your Research Specs)

#### Yellow Box (Fast Track Insight)
```html
<div class="bg-[#FFF469] border-l-4 border-black p-4 mb-6 relative pl-14">
  <div class="absolute left-4 top-4 w-6 h-6">
    <img src="f-icon.svg" alt="Fast Track" class="w-full h-full">
  </div>
  <p class="font-mono text-xs uppercase tracking-wider mb-2 font-semibold">
    FAST TRACK INSIGHT
  </p>
  <p class="text-base leading-relaxed text-black">
    Your wish is the destination, not the to-do list.
  </p>
</div>
```

**Your Research Says:**
- Max 1 per screen (high salience)
- Inline placement (before relevant field)
- Yellow BG + Black text (WCAG compliant)
- 1-2 sentences max (30-50 words)

#### Grey Box (Science)
```html
<div class="bg-[#F3F4F6] border border-gray-300 p-4 mb-6 relative pl-14">
  <div class="absolute left-4 top-4 text-2xl">🔬</div>
  <p class="font-mono text-xs uppercase tracking-wider mb-2 font-semibold text-gray-700">
    THE SCIENCE
  </p>
  <p class="text-sm leading-relaxed text-gray-800">
    Research by Gabriele Oettingen shows WOOP increases goal achievement by 30%.
  </p>
</div>
```

**Your Research Says:**
- Max 1 per screen (recessive, optional depth)
- Can be collapsible on mobile
- 2-3 sentences (50-80 words)

---

### Field Component (CLT-Optimized)

```html
<div class="flex flex-col mb-8"> <!-- 32px spacing (your research) -->
  
  <!-- Label: Top-aligned, 8px gap (your research) -->
  <label for="wish" class="text-sm font-bold text-black mb-2">
    What is your wish?
  </label>
  
  <!-- Help text: 4-8px from label (spatial contiguity) -->
  <p class="text-xs text-gray-600 mb-2">
    Describe where you'll be in 5 years if you succeed. Write as a story, not bullet points.
  </p>
  
  <!-- Input: 16px min text (your research) -->
  <textarea 
    id="wish"
    rows="6"
    class="px-4 py-3 border-2 border-gray-300 rounded-md text-base focus:ring-2 focus:ring-[#FFF469] focus:border-black"
    placeholder="In 2031, I..."
  ></textarea>
  
  <!-- Validation: Inline, 4-8px below (your research) -->
  <p class="text-sm text-red-600 mt-2 hidden" id="wish-error">
    ⚠️ Remove bullet points. Write as a narrative story.
  </p>
  
  <!-- Success state (positive validation) -->
  <p class="text-sm text-green-600 mt-2 hidden" id="wish-success">
    ✓ Great! This paints a clear picture.
  </p>
  
</div>
```

**Your Research Applied:**
- Label 8px above input (reduces split-attention)
- Help text integrated (not in tooltip)
- 16px input text (prevents mobile zoom)
- Error inline (not at top of page)
- 32px spacing between fields (breathability)

---

### Button Footer (Sticky)

```html
<div class="sticky bottom-0 bg-white border-t-2 border-black py-4 px-6 z-50">
  <div class="max-w-[640px] mx-auto flex justify-between items-center">
    
    <!-- Secondary: Left (your research) -->
    <button 
      type="button"
      class="px-6 py-3 border-2 border-black text-black font-semibold hover:bg-gray-100"
    >
      ← Back
    </button>
    
    <!-- Primary: Right (your research) -->
    <button 
      type="submit"
      class="px-8 py-3 bg-black text-white font-semibold hover:bg-gray-800"
    >
      Next: Outcome →
    </button>
    
  </div>
</div>
```

**Your Research Says:**
- Sticky footer (always visible, reduces friction)
- Back on left, Next on right (Z-pattern)
- One primary button only
- Specific action text ("Next: Outcome" not just "Next")

---

## ✅ VALIDATION RULES (Your Research)

### Timing (From Your Research)
- **On Blur:** Validate formatting, check for vague terms
- **On Change:** Clear errors as user fixes them ("reward early")
- **On Submit:** Validate required fields, show error summary at top

### Anti-Vagueness Enforcement (From Friction Report)
```javascript
// Field 3 (Step 4): Who owns this?
const validateOwner = (value) => {
  const genericTerms = ['team', 'it', 'management', 'department', 'staff', 'all'];
  const lowerValue = value.toLowerCase();
  
  if (genericTerms.some(term => lowerValue.includes(term))) {
    return {
      valid: false,
      message: "Don't assign to 'The Team.' Name ONE person (First Last Name)."
    };
  }
  
  // Check for at least first and last name
  if (value.trim().split(' ').length < 2) {
    return {
      valid: false,
      message: "Enter full name (First Last Name)"
    };
  }
  
  return { valid: true };
};
```

---

## 📱 RESPONSIVE (Mobile Optimization)

### Your Research Says:
- Long forms on mobile = "scroll fest" = 22% drop in completion
- Multi-step = 30% faster on mobile

### Mobile Adjustments
```css
@media (max-width: 768px) {
  /* Reduce padding (your research: tighter on mobile) */
  .container { padding: 16px; }
  
  /* Keep font sizes same (your research: don't shrink labels) */
  label { font-size: 14px; }
  input, textarea { font-size: 16px; } /* Prevent zoom */
  
  /* Auto-collapse grey boxes (your research) */
  .science-box { max-height: 0; overflow: hidden; }
  .science-box.open { max-height: 500px; }
  
  /* Full-width buttons (your research) */
  button { width: 100%; }
  .button-group { flex-direction: column; gap: 12px; }
}
```

---

## 🚀 IMPLEMENTATION CHECKLIST

### Phase 1: Structure (Week 2, Day 1-2)
- [ ] Create 4-step wizard component
- [ ] Implement sticky progress bar (top)
- [ ] Implement sticky button footer (bottom)
- [ ] Add step navigation (back/next)
- [ ] Add auto-save between steps (Supabase)

### Phase 2: Visual (Week 2, Day 3-4)
- [ ] Apply 640px max-width container
- [ ] Implement 8px grid spacing (32px between fields)
- [ ] Add yellow info box component (max 1 per step)
- [ ] Add grey science box component (max 1 per step)
- [ ] Apply typography scale (28px H1, 16px inputs)

### Phase 3: Validation (Week 2, Day 5)
- [ ] On blur validation (formatting, vague terms)
- [ ] Anti-vagueness checks (owner field, measurement field)
- [ ] Inline error display (red text below field)
- [ ] Positive validation (green checkmark)
- [ ] Error summary on submit (top of page)

### Phase 4: Testing (Week 3)
- [ ] Test PDF export (still works?)
- [ ] Test Supabase save (all 4 steps saved?)
- [ ] Test on mobile (no zoom, buttons work?)
- [ ] Test with 2-3 clients (time to complete?)
- [ ] Measure: scrolling reduced? time reduced?

---

## 📊 SUCCESS METRICS (Based on Your Research)

| Metric | Current | Target | Your Research Benchmark |
|--------|---------|--------|------------------------|
| **Scrolling** | 5+ pages | <1 page per step | 3-5 pages = cognitive drain |
| **Time to Complete** | ~20 min | ~14 min (30% reduction) | Multi-step = 30% faster |
| **Completion Rate** | ~60% | >85% | Multi-step = 86% higher conversion |
| **Confusion Questions** | ~10 per week | <4 per week (60% reduction) | Proper design reduces support |
| **Fields Visible** | 12-16 at once | 3-4 per step | 10-15+ = intimidation threshold |

---

## 🎯 FINAL DESIGN DECISIONS (Your Research → WOOP)

### Decision 1: Multi-Step Wizard ✅
**Your Research:** 6+ fields = multi-step, 20-30 fields = 3-5 steps  
**WOOP:** 12-16 fields → **4 steps** (W, O, O, P)

### Decision 2: Fields Per Step ✅
**Your Research:** 5-7 fields max per step  
**WOOP:** 3-4 fields per step (even safer)

### Decision 3: Info Boxes ✅
**Your Research:** Max 2 per screen (1 yellow + 1 grey)  
**WOOP:** 1 yellow + 1 grey per step (4 steps = 8 boxes total)

### Decision 4: Spacing ✅
**Your Research:** 24-32px between fields, 48-64px between sections  
**WOOP:** 32px between fields (breathability for executives)

### Decision 5: Container Width ✅
**Your Research:** 580-720px (60-75 characters)  
**WOOP:** 640px (middle of range, works on all screens)

### Decision 6: Progress Indicator ✅
**Your Research:** Labelled stages > percentages  
**WOOP:** "Step 2 of 4: Outcome" (conceptual milestone)

### Decision 7: Validation Timing ✅
**Your Research:** On blur (not while typing)  
**WOOP:** Validate on blur, clear on change

### Decision 8: Button Placement ✅
**Your Research:** Sticky footer, primary on right  
**WOOP:** Sticky footer with Back (left) and Next (right)

---

## 🔥 QUICK START (Next Action)

1. **Open:** `frontend/tools-redesign-sandbox/00-woop-v2.html`
2. **Copy:** Current WOOP tool as starting point
3. **Implement:** Step 1 (Wish) first
   - 3 fields only
   - 1 yellow box
   - 1 grey box
   - Sticky progress bar
   - Sticky button footer
4. **Test:** Does it work? Can you navigate?
5. **Repeat:** Steps 2, 3, 4

**Time estimate:** 2-3 days for all 4 steps

---

**Your research is gold. Now let's build it.** 🚀
