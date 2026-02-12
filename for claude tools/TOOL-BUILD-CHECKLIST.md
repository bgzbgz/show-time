# ⚡ FAST TRACK TOOL - QUICK BUILD CHECKLIST

Use this for rapid checking. Full details in `FAST-TRACK-TOOL-TEMPLATE.md`

---

## 🔴 JAVASCRIPT/REACT SYNTAX (1 MIN CHECK - DO THIS FIRST!)

```
□ Fragment imported: const { useState, useEffect, useRef, Fragment } = React; ✓
□ No escaped quotes in JSX: Never use \' or \" in placeholder attributes ✓
□ Use HTML entities: &quot; for ", &apos; for ', &amp; for & ✓
□ File opens in browser (not white page) ✓
□ No console errors when opened ✓
□ PDF export hides images to avoid CORS ✓

Common errors that break tools:
❌ Using React.Fragment without importing Fragment
❌ placeholder='We couldn\'t do it' (escaped quote breaks Babel)
❌ placeholder='"Quote here" - John\'s comment' (mixed quotes break)
❌ PDF export with images → "tainted canvas" CORS error

Correct syntax:
✅ placeholder="We couldn't do it"
✅ placeholder="&quot;Quote here&quot; - John&apos;s comment"
✅ Hide images before html2canvas, restore after
```

---

## 🎨 DESIGN (5 MIN CHECK)

```
□ Font hierarchy: h1/h2 = Plaak (uppercase), h3/h4/h5 = Riforma Bold (sentence case) ✓
□ Fonts: Plaak (major headlines), Riforma (body/subheaders), Monument (labels) ✓
□ Colors: Black (#000), White (#FFF), Yellow (#FFF469) only ✓
□ **ABSOLUTELY NO EMOJIS ANYWHERE** - Check ALL text, buttons, headings ✓
□ **Canvas page buttons MUST be plain text**: "EXPORT PDF" and "SUBMIT" (no emojis) ✓
□ Button: Black bg, white text, 16px/32px padding ✓
□ Input: 1px #E0E0E0 border, focus → black ✓
□ Help button: 56px circle, top-right, black, "?" ✓
```

---

## 📄 STRUCTURE (5 MIN CHECK)

```
□ Cover page (step 0): Image + gradient + title + START button ✓
□ Intro page (step 0.5): Black bg, BEFORE WE START, Purpose, Mistakes, Journey ✓
□ Step pages (1-4): Header + Progress + Numbered badge + Form + Nav ✓
□ Transitions: Black screen + "SECTION COMPLETE" + progress % ✓
□ Canvas: Border box + all data + 3 buttons (Share/Export/Submit) ✓
```

---

## 💬 PLACEHOLDERS (2 MIN CHECK)

```
□ Every placeholder has 3+ specific details ✓
□ Use real names, dates, numbers ✓
□ Show exact level of detail expected ✓
□ Multi-line examples (use &#10; for breaks) ✓

Example:
❌ BAD: "Enter your goal"
✅ GOOD: "It's 90 days from now. The Fast Track program is complete. Our team is aligned on 3 values. We've implemented the ABC system."
```

---

## 🔘 BUTTONS (1 MIN CHECK)

```
Primary (.btn-primary):
□ bg-black, text-white, 16px/32px padding, 18px font ✓
□ Hover: scale(1.02) ✓
□ Disabled: gray, opacity 0.5 ✓

Secondary (.btn-secondary):
□ bg-white, text-black, 12px/24px padding, 2px black border ✓
□ Hover: bg-gray-50 ✓
```

---

## 📝 VALIDATION (2 MIN CHECK)

```
□ Min character counts shown: "X/300 (min 20)" ✓
□ Required fields marked with red * ✓
□ Next button disabled until valid ✓
□ NO error messages, just disabled button ✓
```

---

## ❓ HELP MODAL (1 MIN CHECK)

```
□ Black overlay (90% opacity) ✓
□ White box, 8px black border ✓
□ "INSTRUCTIONS" header (Plaak, text-5xl) ✓
□ WHY-WHAT-HOW format ✓
□ "GOT IT" button at bottom ✓
```

---

## 🎬 ANIMATIONS (1 MIN CHECK)

```
□ slideIn animation on all page loads (0.3s) ✓
□ Staggered delays on intro (0.05s, 0.1s, 0.2s increments) ✓
□ Button hover: scale(1.02) ✓
□ Transitions: 0.2s ease ✓
```

---

## 📚 SPRINT CONTENT (2 MIN CHECK)

```
□ Minimum 3 direct quotes from Brain Juice integrated ✓
□ Peter Drucker or authority quote on intro page ✓
□ Each step has sprint quote in instruction box (yellow border) ✓
□ "Cardinal sins" or mistakes box prominently displayed (yellow border) ✓
□ Statistics included (30% improvement, etc.) ✓
□ Metaphors from content used (symphony conductor, engine room, etc.) ✓
□ All quotes properly attributed ✓
□ Quotes styled with italic + left border ✓

Example quote box:
<p className="text-lg italic border-l-4 border-yellow-400 pl-4">
  "[Quote from sprint content]"
</p>
```

---

## 💾 FUNCTIONALITY (3 MIN CHECK)

```
□ Auto-save to localStorage every 2s ✓
□ Load saved data on mount ✓
□ Add/remove dynamic items works ✓
□ Character counters display ✓
□ Back/Next navigation works ✓
□ PDF export AVOIDS CORS ERRORS ✓
  - Images temporarily hidden during export
  - Images restored after export completes
  - Test: Click Export PDF button, check it downloads
□ Submit to webhook ✓

PDF Export Implementation (REQUIRED):
```javascript
const exportPDF = async () => {
  try {
    // Hide images to avoid CORS
    const images = canvas.querySelectorAll('img');
    const imageStates = [];
    images.forEach(img => {
      imageStates.push({ img, display: img.style.display });
      img.style.display = 'none';
    });

    // Generate PDF
    const canvasImage = await html2canvas(canvas, {
      scale: 2,
      logging: false
    });

    // Restore images
    imageStates.forEach(({ img, display }) => {
      img.style.display = display;
    });

    // Export
    const imgData = canvasImage.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    alert('Failed to export PDF: ' + error.message);
  }
};
```
```

---

## ❓ HELP MODAL (2 MIN CHECK - CRITICAL)

```
□ Help button (?) visible on all step pages ✓
□ Clicking ? button opens modal ✓
□ Modal has real content (not "placeholder" text) ✓
□ Each step has unique WHY-WHAT-HOW content ✓
□ Content extracted from sprint Brain Juice ✓
□ Modal closes on click outside ✓
□ Modal closes on × button ✓
□ "GOT IT" button closes modal ✓

Test each step:
□ Step 1: Click ? → Modal opens with Step 1 content ✓
□ Step 2: Click ? → Modal opens with Step 2 content ✓
□ Step 3: Click ? → Modal opens with Step 3 content ✓
□ Step 4: Click ? → Modal opens with Step 4 content ✓

If ANY help button doesn't work, STOP and fix before proceeding.
```

---

## 🎯 FAST TRACK VIBE CHECK (30 SEC)

```
Ask yourself:
□ Would a CEO approve this design? ✓
□ Are placeholders brutally honest and specific? ✓
□ Does it force clarity, not allow vagueness? ✓
□ Is it professional, not cute? ✓
□ Zero emojis? ✓

If any answer is NO, fix it before proceeding.
```

---

## 📦 FILE CHECKLIST

```
In the tool folder, you need:
□ index.html (the tool) ✓
□ Plaak3Trial-43-Bold.otf ✓
□ RiformaLL-Regular.otf ✓
□ MonumentGrotesk-Mono.otf ✓
□ FastTrack_F_White.png (for cover/canvas) ✓
□ FastTrack_F_black.png (for PDF export) ✓
□ [cover-image].jpg (background for cover page) ✓
```

---

## 🚀 BEFORE DELIVERY (1 MIN)

```
□ ⚠️ OPENS WITHOUT WHITE PAGE - This is #1 priority ✓
□ ⚠️ NO JAVASCRIPT ERRORS in console (press F12) ✓
□ ⚠️ Fragment imported if used anywhere in code ✓
□ ⚠️ All JSX placeholders use HTML entities (no \' or \") ✓
□ ⚠️ NO EMOJIS IN BUTTONS - Check canvas page: "EXPORT PDF", "SUBMIT" (plain text only) ✓
□ Tested on Chrome ✓
□ Tested cover → intro → all steps → canvas ✓
□ Tested back navigation ✓
□ Tested add/remove items ✓
□ Tested PDF export ✓
□ Tested webhook submit ✓
□ All fonts load ✓
```

---

## ⚠️ COMMON MISTAKES TO AVOID

```
❌ Using emojis ANYWHERE (especially in canvas page buttons like 📄 EXPORT PDF or ✅ SUBMIT)
❌ Vague placeholders ("Enter your answer")
❌ Wrong font families
❌ Colors other than black/white/yellow
❌ Allowing progression with incomplete data
❌ Missing character counters
❌ No help modal or wrong format
❌ Cute/friendly tone instead of direct/challenging
❌ Emoji decorations or prefixes in button text
```

---

## 🎯 THE ONE-SENTENCE RULE

**If you can't explain what makes this tool "brutally honest and forcing clarity," you're not done.**

---

Total check time: ~20 minutes
Use full template for detailed specs: `FAST-TRACK-TOOL-TEMPLATE.md`
