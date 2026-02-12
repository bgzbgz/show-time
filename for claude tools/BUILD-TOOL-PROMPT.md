# 🔥 THE PERFECT TOOL BUILD PROMPT

Copy-paste this prompt to build ANY Fast Track tool in under 5 minutes.

---

## 📋 THE PROMPT (Copy Everything Below)

```
Build the [TOOL NAME] tool for Sprint [NUMBER].

⚠️ CRITICAL: Three things that MUST work:
1. Help modal with real content (not placeholders) - test clicking ? on each step
2. Sprint quotes integrated (minimum 3 visible quotes from Brain Juice)
3. Typography: h1/h2 = Plaak, h3/h4/h5 = Riforma Bold

🔴 CRITICAL JAVASCRIPT/REACT RULES (To prevent white page errors):
1. **ALWAYS import Fragment**: const { useState, useEffect, useRef, Fragment } = React;
2. **Never use escaped quotes in JSX placeholders**: Use HTML entities instead
   ❌ BAD: placeholder='We couldn\'t do it'
   ✅ GOOD: placeholder="We couldn't do it" OR placeholder="We couldn&apos;t do it"
3. **For quotes in placeholders with quotes**: Use &quot; for double quotes, &apos; for apostrophes
   Example: placeholder="&quot;This is a quote&quot; - Customer said we couldn&apos;t"
4. **Test the file opens**: White page = JavaScript error. Check console before delivery.
5. **PDF Export MUST handle CORS**: Images cause "tainted canvas" errors. ALWAYS hide images during export.

**MANDATORY READING (in this order):**

1. **Template Standards:**
   - Read: C:\Users\Admin\Desktop\show time\FAST-TRACK-TOOL-TEMPLATE.md
   - Read: C:\Users\Admin\Desktop\show time\TOOL-BUILD-CHECKLIST.md
   - This is your blueprint. Follow it EXACTLY.

2. **Sprint Content:**
   - Read: C:\Users\Admin\Desktop\LMS\00. sprints\[SPRINT NUMBER]. [SPRINT NAME]\content\[sprint name] content.md
   - **CRITICAL**: Extract minimum 3 direct quotes from Brain Juice section
   - Extract: Tool descriptions, purpose, powerful quotes, statistics, metaphors, "cardinal sins"
   - Look for: Authority quotes (Peter Drucker, etc.), vivid metaphors (symphony conductor, engine room), specific stats (30% improvement, 20% higher)
   - Use quotes for: Intro page purpose box, instruction boxes on each step (with yellow border), mistakes section
   - Use this for: Intro page purpose, help modal content, placeholder examples

3. **Sprint Feedback (if exists):**
   - Read: C:\Users\Admin\Desktop\LMS\00. sprints\[SPRINT NUMBER]. [SPRINT NAME]\[SPRINT NUMBER]. notebooklm.txt
   - Extract: Client complaints, confusion points, common mistakes
   - Use this for: "Mistakes to Avoid" section, validation rules, anti-patterns

4. **Fast Track Brand:**
   - Read: C:\Users\Admin\Desktop\show time\designs for tools and landing page\00. brand guidlines\Fast Track Brand Guidlines.md
   - Extract: Tone of voice, design principles
   - Use this for: Copy tone, visual consistency

5. **8-Point Criteria:**
   - Read: C:\Users\Admin\Desktop\show time\the three principles\th point tool criteria (1).md
   - Extract: Forces decision, no questions needed, easy first steps, instant feedback, gamification, visibility, mass communication, smells like Fast Track
   - Use this for: Feature design, UX decisions

6. **Tool Context (if needed):**
   - Read: C:\Users\Admin\Desktop\show time\the three principles\tool context.md
   - Extract: What makes a good Fast Track tool
   - Use this for: Overall approach

**BUILD REQUIREMENTS:**

Structure:
□ Cover page with background image + START button
□ Intro page: "BEFORE WE START" with Purpose, Mistakes to Avoid, Journey (4 boxes)
□ [X] main step pages with forms, validation, navigation
□ Transition screens between steps (25%, 50%, 75%, 100%)
□ Canvas/summary page with Share, Export PDF, Submit buttons

Design:
□ Follow FAST-TRACK-TOOL-TEMPLATE.md exactly
□ **Typography hierarchy**: h1/h2 = Plaak (uppercase), h3/h4/h5 = Riforma Bold (sentence case)
□ Fonts: Plaak (major headlines), Riforma (body/subheaders), Monument (labels)
□ Colors: Black/White/Yellow ONLY (yellow for mistakes headers and quote borders)
□ **ABSOLUTELY NO EMOJIS ANYWHERE** - Not in buttons, not in text, not in headings
□ **Canvas page buttons**: MUST be plain text only ("EXPORT PDF", "SUBMIT" - NO emojis)
□ Help button (top-right, black circle, ?)
□ Progress dots with step names

Content:
□ **Sprint quotes integration (CRITICAL)**:
  - Minimum 3 direct quotes from Brain Juice
  - Peter Drucker or authority quote on intro page (border-l-4 border-white)
  - Each step instruction box must have sprint quote (border-l-4 border-yellow-400, italic)
  - "Cardinal sins" or major mistakes in prominent yellow-bordered box
  - Include all statistics (30%, 20%, etc.) and metaphors from content
□ Write detailed, specific placeholders (3+ details each, with names/dates/numbers)
□ "Mistakes to Avoid" from notebooklm feedback + sprint context + cardinal sins from content
□ Help modal: WHY-WHAT-HOW format for each step
□ Validation: min character counts, disable next button until valid

Functionality:
□ **CRITICAL: React imports MUST be complete**:
  - ALWAYS include: const { useState, useEffect, useRef, Fragment } = React;
  - If using Fragment/React.Fragment, Fragment MUST be imported or tool breaks
□ **CRITICAL: JSX placeholder syntax**:
  - NEVER use escaped quotes like \' or \" inside JSX attributes
  - Use HTML entities: &quot; for ", &apos; for ', &amp; for &
  - Example: placeholder="Customer said: &quot;We couldn&apos;t solve this&quot;"
□ **CRITICAL: PDF Export MUST avoid CORS errors**:
  - ALWAYS temporarily hide images before html2canvas
  - Images from file system cause "tainted canvas" error
  - Hide images → generate PDF → restore images
  - Use: canvas.querySelectorAll('img').forEach(img => img.style.display = 'none')
  - Then restore after: img.style.display = originalDisplay
□ Auto-save to localStorage every 2s
□ Character counters on all text fields
□ Add/remove dynamic items (if applicable)
□ Back/Next navigation
□ PDF export (hide images to avoid CORS)
□ Submit to webhook (use standard format)
□ **CRITICAL: Help modal MUST work**:
  - Create HelpModal component with helpContent object
  - Include WHY-WHAT-HOW for each step (from sprint content)
  - Add {showHelp && <HelpModal />} to EVERY step page
  - Test that clicking ? button opens modal
  - Modal must close on click outside or × button

File Output:
□ Single HTML file: [sprint-number]-[tool-name].html
□ Include all fonts (Plaak, Riforma, Monument .otf files)
□ Include logo (FastTrack_F_White.png)
□ Include cover image (reuse from existing tools or specify)

**QUALITY GATE:**
Before delivering, verify:
✓ **JavaScript syntax correct**: Fragment imported if used, no escaped quotes in JSX
✓ **File opens without errors**: Not a white page, no console errors
✓ **PDF Export works**: Test export button, check for CORS errors in console
✓ Passes 100% of TOOL-BUILD-CHECKLIST.md
✓ **Sprint content integrated**: Minimum 3 quotes from Brain Juice visible in tool
✓ **Typography hierarchy**: h1/h2 = Plaak, h3/h4/h5 = Riforma Bold
✓ All placeholders are brutally specific (not "Enter goal" but "It's 90 days from now...")
✓ **ZERO EMOJIS ANYWHERE** - Check ALL buttons, especially canvas page ("EXPORT PDF", "SUBMIT")
✓ **Canvas buttons**: Plain text only, no emoji prefixes or decorations
✓ **Help modal ACTUALLY WORKS**: Click ? button on each step → modal opens with real content
✓ Help modal has WHY-WHAT-HOW content for EACH step (not placeholder text)
✓ Modal closes when clicking outside or × button
✓ Intro page has yellow "MISTAKES TO AVOID" with cardinal sins box
✓ Each step instruction box has quote with yellow left border
✓ Canvas page shows all data clearly

**DELIVER:**
1. The complete HTML file (relaunch after creating)
2. Brief summary: "Built [Tool Name] with [X] steps, [Y] mistakes to avoid, [Z] specific features"

Build time target: Under 5 minutes.
```

---

## 🎯 EXAMPLE USAGE:

### Example 1: Building Sprint 2 (Dream)
```
Build the Dream Launcher tool for Sprint 2.

**MANDATORY READING (in this order):**

1. **Template Standards:**
   - Read: C:\Users\Admin\Desktop\show time\FAST-TRACK-TOOL-TEMPLATE.md
   - Read: C:\Users\Admin\Desktop\show time\TOOL-BUILD-CHECKLIST.md
   - This is your blueprint. Follow it EXACTLY.

2. **Sprint Content:**
   - Read: C:\Users\Admin\Desktop\LMS\00. sprints\02. Dream\content\dream content.md
   - Extract: Tool descriptions, purpose, brain juice quotes, instructions
   - Use this for: Intro page purpose, help modal content, placeholder examples

3. **Sprint Feedback (if exists):**
   - Read: C:\Users\Admin\Desktop\LMS\00. sprints\02. Dream\02. notebooklm.txt
   - Extract: Client complaints, confusion points, common mistakes
   - Use this for: "Mistakes to Avoid" section, validation rules, anti-patterns

4. **Fast Track Brand:**
   - Read: C:\Users\Admin\Desktop\show time\designs for tools and landing page\00. brand guidlines\Fast Track Brand Guidlines.md
   - Extract: Tone of voice, design principles
   - Use this for: Copy tone, visual consistency

5. **8-Point Criteria:**
   - Read: C:\Users\Admin\Desktop\show time\the three principles\th point tool criteria (1).md
   - Extract: Forces decision, no questions needed, easy first steps, instant feedback, gamification, visibility, mass communication, smells like Fast Track
   - Use this for: Feature design, UX decisions

6. **Tool Context (if needed):**
   - Read: C:\Users\Admin\Desktop\show time\the three principles\tool context.md
   - Extract: What makes a good Fast Track tool
   - Use this for: Overall approach

**BUILD REQUIREMENTS:**
[... rest same as above ...]

Build time target: Under 5 minutes.
```

### Example 2: Building Sprint 12 (Market Size)
```
Build the Market Size Calculator tool for Sprint 12.

**MANDATORY READING (in this order):**
[same structure, just change sprint number and name]

2. **Sprint Content:**
   - Read: C:\Users\Admin\Desktop\LMS\00. sprints\12. Market Size\content\market size content.md
   [etc...]
```

---

## 🚀 QUICK FILL TEMPLATE:

For fastest use, just fill in these two lines:

```
Build the [____________] tool for Sprint [__].
```

Then add:
- Sprint content path: `C:\Users\Admin\Desktop\LMS\00. sprints\[NUMBER]. [NAME]\content\[name] content.md`
- Sprint feedback path (if exists): `C:\Users\Admin\Desktop\LMS\00. sprints\[NUMBER]. [NAME]\[NUMBER]. notebooklm.txt`

Everything else stays the same for all tools.

---

## 💡 PRO TIPS:

1. **If notebooklm.txt doesn't exist**, skip that step - just say "no feedback file found"

2. **For tools with multiple sub-tools** (like Team with 5 dysfunctions + summary):
   ```
   Build the Team Assessment tool for Sprint 4.
   This tool has 3 sub-sections:
   1. Five Dysfunctions Assessment
   2. Team Summary
   3. Improvement Plan
   ```

3. **If you need to specify a different structure**, add after the prompt:
   ```
   TOOL STRUCTURE:
   - Step 1: [Name] - [what it does]
   - Step 2: [Name] - [what it does]
   - etc.
   ```

4. **If sprint content is missing**, tell me and I'll use:
   - WOOP as reference
   - Fast Track principles
   - 8-point criteria
   - Create appropriate placeholders

---

## ⚡ SPEED OPTIMIZATION:

To hit the 5-minute target:
1. I read all files in parallel
2. I extract key content while reading
3. I build structure first, then fill content
4. I copy CSS/JS patterns from template
5. I generate placeholders based on sprint context
6. I verify against checklist automatically

---

## 🎯 EXPECTED OUTPUT:

After giving me this prompt, I will:

1. **Read all specified files** (30 seconds)
2. **Build the tool** (3 minutes)
3. **Verify against checklist** (1 minute)
4. **Deliver and relaunch** (30 seconds)

You'll get:
- ✅ Complete HTML file
- ✅ Tool relaunched in browser
- ✅ Summary of features

Then you just:
1. Test it
2. Give feedback
3. I iterate if needed

---

## 🔄 ITERATION PROMPT:

If you need changes after first build:

```
Update [Tool Name]:
- [Change 1]
- [Change 2]
- [Change 3]

Keep everything else from the template.
```

---

## 📝 SUMMARY:

**The One-Sentence Prompt:**
```
Build the [TOOL NAME] tool for Sprint [NUMBER] following FAST-TRACK-TOOL-TEMPLATE.md, reading sprint content from [PATH], notebooklm feedback from [PATH], and deliver in under 5 minutes.
```

**But use the full prompt above for best results.**

Save this file. Every time you need a tool, copy-paste the prompt with sprint details filled in.

---

END OF BUILD PROMPT GUIDE
