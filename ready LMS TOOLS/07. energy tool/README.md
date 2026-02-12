# Creating Energy in the Body and Mind - Fast Track Tool

## Overview

This tool helps individuals design a personalized energy protocol across the four pillars of peak performance: **Sleep, Food, Movement, and Brain Use**. It's part of the Energy Sprint in the Fast Track executive development program.

## What This Tool Does

The tool guides users through:
1. **Energy Audit** - Honest assessment of current energy habits across 4 pillars
2. **Identify Energy Drains** - Pinpoint the biggest performance killers
3. **Design Energy Protocol** - Create specific commitments for each pillar
4. **First Win** - Define a 24-hour action to create momentum
5. **Energy Canvas** - Visual summary of the complete personalized protocol

## Key Decision Forced

**"My personalized energy protocol with specific commitments I will implement starting tomorrow"**

This tool forces concrete, measurable commitments—not vague wishes. Users leave with actionable protocols like "in bed by 10:30pm, phone outside room, 7.5 hours minimum" rather than "sleep better."

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari latest versions)
- Internet connection (for CDN resources: React 18, TailwindCSS, Babel)
- Fonts must be in the `fonts/` folder:
  - `Plaak3Trial-43-Bold.otf`
  - `RiformaLL-Regular.otf`
  - `MonumentGrotesk-Mono.otf`
- Logo must be in `logo/` folder:
  - `FastTrack_F_White.png`
- Favicon in `favicon/` folder:
  - `favicon-16x16.png`

## How to Use

### For Participants

1. **Open the tool**: Double-click `energy-body-mind-tool.html` in your browser
2. **Complete all sections**: Takes approximately 20-30 minutes
3. **Be brutally honest**: Lower ratings reveal your biggest leverage points
4. **Make specific commitments**: The more specific, the more likely you'll follow through
5. **Define your first action**: Choose something achievable within 24 hours
6. **Submit or print**: Save your protocol before submitting

### Auto-Save Feature

- Progress automatically saves every 2 seconds to your browser's local storage
- Close and reopen the tool anytime—you'll resume where you left off
- "Last saved" timestamp appears in top-right corner
- Data persists until you submit (which clears the draft)

### For Fast Track Facilitators

This is an **Individual Prep Tool** - participants complete it alone before the team Energy Sprint meeting.

**Timing**: Week 1 of Energy Sprint, completed before first team session

**Integration with Team Meeting**: Participants bring their completed protocols to discuss:
- Common energy drains across the team
- Team-wide energy rituals
- Collective accountability strategies

## Configuration

### Webhook URLs

Update the `CONFIG` object in the HTML file (lines 253-265) with your n8n webhook URLs:

```javascript
const CONFIG = {
    SUBMIT_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700', // WORKING
    AUTOSAVE_WEBHOOK: 'YOUR_N8N_AUTOSAVE_WEBHOOK_URL', // PLANNED
    SHARE_WEBHOOK: 'YOUR_N8N_SHARE_WEBHOOK_URL', // PLANNED
    EMAIL_WEBHOOK: 'YOUR_N8N_EMAIL_WEBHOOK_URL', // PLANNED
    STORAGE_KEY: 'fasttrack_energy_body_mind_data',
    TOOL_NAME: 'energy_body_mind',
    SPRINT_NUMBER: 'energy',
    AUTOSAVE_DELAY: 2000
};
```

### Data Submitted to MongoDB

When users click "Submit My Energy Protocol," the following data structure is sent:

```json
{
  "toolName": "energy_body_mind",
  "userId": "john@company.com",
  "userName": "John Smith",
  "companyId": "acme_corp",
  "companyName": "Acme Corp",
  "sprintNumber": "energy",
  "timestamp": "2025-01-06T14:30:00Z",
  "data": {
    "userName": "John Smith",
    "userEmail": "john@company.com",
    "companyName": "Acme Corp",
    "sleepRating": 6,
    "sleepHours": "6.5 hours",
    "sleepQuality": "Go to bed around midnight...",
    "foodRating": 5,
    "foodHabits": "Skip breakfast, coffee at 10am...",
    "movementRating": 4,
    "movementMinutes": "20 minutes walking",
    "brainRating": 5,
    "brainHabits": "Constant email checking...",
    "biggestDrain": "Staying up until 1am watching Netflix...",
    "drainImpact": "Foggy in morning meetings...",
    "energyPeak": "9-11am after coffee",
    "energyCrash": "2-4pm after lunch",
    "sleepCommitment": "In bed by 10:30pm...",
    "foodCommitment": "High-protein breakfast by 8am...",
    "movementCommitment": "6am workout Mon/Wed/Fri...",
    "brainCommitment": "10-minute meditation at 6:30am...",
    "firstAction": "Tonight: Put phone in kitchen at 10pm...",
    "actionDeadline": "Tonight at 10:00pm",
    "accountability": "My spouse"
  }
}
```

## Tool Structure

### Sections

1. **Cover Page**
   - Hero title with Fast Track branding
   - Brief description
   - "Begin Your Energy Protocol" CTA

2. **[01] Energy Audit** (Section 1)
   - User information (name, email, company)
   - Sleep rating (1-10 slider) + hours + habits description
   - Food rating + eating habits description
   - Movement rating + active minutes
   - Brain rating + mental routines description

3. **[02] Identify Energy Drains** (Section 2)
   - Biggest energy drain (specific)
   - Impact on performance (quantified)
   - Energy peak times
   - Energy crash times

4. **[03] Design Your Energy Protocol** (Section 3)
   - Sleep commitment (specific protocol)
   - Food commitment (specific protocol)
   - Movement commitment (specific protocol)
   - Brain commitment (specific protocol)
   - Each section includes Fast Track rules and examples

5. **[04] First Win - 24 Hour Action** (Section 4)
   - ONE specific action for next 24 hours
   - Exact time commitment
   - Accountability partner

6. **Canvas - Energy Protocol Summary**
   - Complete visual summary
   - Energy audit snapshot (ratings)
   - Energy drains
   - Energy patterns (peak/crash)
   - All 4 protocol commitments
   - First win highlighted
   - Submit, print, and edit options

## Features

### Validation & User Experience
- Real-time validation (fields turn red if invalid)
- Progressive disclosure (sections unlock as you complete them)
- Celebration screens between major sections (25%, 50%, 75%, 100%)
- Progress dots showing current section
- Help button (?) with comprehensive FAQs
- Disabled button states for incomplete sections

### Design Standards
- **Plaak font** for all headings
- **Riforma font** for all body text
- **Monument Grotesk Mono** for labels and annotations
- Black/white/grey color palette (+ yellow accent for highlights)
- Numbered section headers [01], [02], [03], [04]
- WHY/WHAT/HOW sticky sidebar on all sections
- 2px borders on all buttons
- Hover effects (scale 1.02) on buttons

### Print-Friendly
- Navigation buttons hidden when printing
- Clean layout optimized for PDF generation
- Logo appears on printed version
- All content fits on standard pages

## Expected Completion Time

**20-30 minutes** for thorough completion

- Section 1 (Energy Audit): 5-7 minutes
- Section 2 (Energy Drains): 5-7 minutes
- Section 3 (Design Protocol): 8-12 minutes
- Section 4 (First Win): 3-5 minutes
- Canvas (Review): 2-3 minutes

## Troubleshooting

### Fonts Not Loading
- Check that fonts are in the `fonts/` folder
- Ensure file names match exactly (case-sensitive on some systems)
- Open browser DevTools (F12) → Network tab → check for 404 errors

### Data Not Saving
- Check browser console (F12) for errors
- Ensure localStorage is enabled (not in private/incognito mode)
- Check "Last saved" timestamp in top-right corner

### Submission Failed
- Check internet connection
- Verify webhook URL in CONFIG object
- Check browser console for error messages
- Test webhook URL in Postman or similar tool

### Progress Lost
- If localStorage is cleared, progress is lost
- Always print/save before submitting
- Don't use private/incognito mode

## Integration Notes

### For n8n Workflow Setup

1. **Submission Endpoint**: Current webhook is working
2. **Auto-Save Endpoint** (planned): Should accept draft saves and upsert to MongoDB
3. **Collection Name**: `energy_body_mind_submissions`
4. **Document Structure**: See data structure above

### Recommended MongoDB Indexes

```javascript
db.energy_body_mind_submissions.createIndex({userId: 1, status: 1});
db.energy_body_mind_submissions.createIndex({companyId: 1, status: 1});
db.energy_body_mind_submissions.createIndex({status: 1, submittedAt: -1});
```

## Fast Track 8-Point Criteria

This tool meets all Fast Track tool criteria:

1. ✅ **Forces Clear Decision** - Concrete energy protocol with specific commitments
2. ✅ **No Questions Needed** - WHY/WHAT/HOW sidebar, inline hints, help button
3. ✅ **Easy First Steps** - Section 1 has only 4 simple inputs (name, email, company, sliders)
4. ✅ **Instant Feedback** - Slider values update live, borders change on focus, validation errors
5. ✅ **Gamification** - Progress dots, celebration screens, percentage complete
6. ✅ **Clear Results** - Canvas shows complete protocol visually
7. ✅ **Mass Communication** - Submit to system, print to share, accountability commitment
8. ✅ **Smells Like Fast Track** - Plaak/Riforma fonts, black/white palette, numbered sections

## Support

For technical issues or questions:
- Review this README
- Check DESIGN-CHECKLIST.md for verification
- Contact Fast Track technical support

---

**Fast Track Program - Energy Sprint**

*"Energy, not time, is the currency of high performance."*

