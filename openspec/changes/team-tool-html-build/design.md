## Context

Fast Track delivers leadership development tools via standalone HTML files with embedded React, following a pattern established in `frontend/tools/module-1-identity/03-values.html`. This architecture avoids build steps, enables instant deployment, and allows facilitators to run tools locally without infrastructure dependencies. The "5 Dysfunctions of a Team" tool digitizes a 3-slide PowerPoint worksheet that currently requires manual calculation, accepts vague commitments, and provides no persistence.

**Current State**:
- PowerPoint template with manual data entry
- Facilitator calculates team averages with calculator during live session
- Action plans accept "All" as owner, "Ongoing" as deadline
- No digital record after workshop ends

**Constraints**:
- Must follow existing tool pattern (single HTML file, CDN dependencies, embedded fonts)
- Must match Fast Track design system (Plaak/Riforma/Monument fonts, black/white/yellow color scheme)
- Must enforce cognitive load principles (max-width 640px, 5-7 inputs per step, 32px spacing)
- Must work offline (localStorage fallback) and sync to Supabase when connected
- Must be accessible to non-technical facilitators (no npm install, no build)

**Stakeholders**:
- Workshop facilitators (need reduced cognitive load, no manual math)
- Team members (need clear accountability, digital record)
- Fast Track admins (need consistent design, Supabase data access)

## Goals / Non-Goals

**Goals**:
- Eliminate manual calculation: Auto-aggregate individual assessment scores into team averages
- Enforce concrete commitments: Block "All" owners and "Ongoing" deadlines via UI constraints
- Provide visual interpretation: Radar chart shows dysfunction profile at-a-glance
- Ensure persistence: Dual-layer save (localStorage + Supabase) with auto-save on every change
- Generate exportable artifact: PDF output with cover, chart, commitments, signatures
- Maintain consistency: Match existing tool UX pattern from 03-values.html

**Non-Goals**:
- Real-time collaboration: Not building multi-user editing (teams complete tool together on single screen)
- Separate React app: Not introducing webpack/vite build pipeline
- Cross-tool integration: Not linking to other tools in suite (standalone completion)
- Mobile optimization: Desktop-first (workshops run on laptops with projector)
- Historical versioning: Not tracking change history within tool (Supabase stores snapshots)
- Individual assessment creation: Not building the assessment tool itself (assumes assessments exist, tool imports them)

## Decisions

### 1. Single HTML File Architecture

**Decision**: Build as standalone HTML file with React via CDN (unpkg.com), not separate components or JSX build.

**Rationale**:
- Matches established pattern in `03-values.html` (~800 lines, proven in production)
- Zero-friction deployment: Drop file in `frontend/tools/`, immediately accessible
- Offline-first: Facilitators can download and run locally without internet
- No build step: Non-technical users can view source, customize, troubleshoot
- CDN reliability: React 18, Tailwind CSS, Supabase JS, Chart.js all have stable CDN distributions

**Alternatives Considered**:
- **Separate React app with build**: Rejected due to deployment friction, requires npm/build knowledge
- **Vanilla JS with templates**: Rejected due to complexity of state management across 7 steps
- **Vue/Svelte via CDN**: Rejected to maintain consistency with existing tools (all use React)

**Implementation**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // 1000-1500 lines of React component code
  </script>
</body>
</html>
```

### 2. Chart.js for Radar Visualization

**Decision**: Use Chart.js (via CDN) for radar chart, not D3, custom SVG, or canvas drawing.

**Rationale**:
- Radar chart is built-in Chart.js type (no custom geometry calculation)
- Stable CDN distribution, widely used, well-documented
- Handles responsive sizing, tooltips, legends out-of-box
- Fits cognitive load principle: Visual interpretation reduces mental math
- 5-axis radar (one per dysfunction) is simple, not complex multi-dataset

**Alternatives Considered**:
- **D3.js**: Rejected due to large bundle size, steeper learning curve, over-engineered for single chart
- **Custom SVG**: Rejected due to tooltip/responsive complexity, reinventing wheel
- **Canvas drawing**: Rejected due to accessibility issues (screen readers), no hover states
- **Static image**: Rejected due to lack of interactivity, no dynamic updates as data changes

**Implementation**:
```javascript
useEffect(() => {
  if (step === 2 && chartRef.current) {
    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Absence of Trust', 'Fear of Conflict', 'Lack of Commitment',
                 'Avoidance of Accountability', 'Inattention to Results'],
        datasets: [{
          label: 'Team Scores',
          data: Object.values(teamData.dysfunctionScores),
          backgroundColor: 'rgba(255, 244, 105, 0.2)', // Yellow fill
          borderColor: '#000000',
          borderWidth: 2
        }]
      },
      options: {
        scales: { r: { beginAtZero: true, max: 10 } }
      }
    });
  }
}, [step, teamData.dysfunctionScores]);
```

### 3. 7-Step Wizard Structure

**Decision**: Break workflow into 7 discrete steps (0-6) with progress dots, sticky navigation, validation gates.

**Rationale**:
- Cognitive load: Max 5-7 inputs per step prevents overwhelm (Step 4 has 3 actions × 3 fields = 9, but grouped)
- Progressive disclosure: Users see context before data entry (cover → setup → results → planning)
- Natural breakpoints: Each step has clear completion criteria (validated before Next enabled)
- Familiar pattern: Matches 03-values.html wizard UX (users have mental model)
- Workshop pacing: Steps align with facilitation phases (setup → review → plan → commit)

**Step Breakdown**:
- **Step 0 (Cover)**: Welcome, context, "Start" CTA
- **Step 1 (Team Setup)**: Team name, add members, import individual assessments
- **Step 2 (Team Summary)**: Auto-calculated scores, radar chart, color-coded badges
- **Step 3 (Improvement Plan)**: Select top 3 dysfunctions, add improvement notes
- **Step 4 (Action Plan)**: 3 WWW actions (What/Who/When) with validation
- **Step 5 (Commitment Lock)**: Digital sign-off from each team member
- **Step 6 (Final Review)**: Summary + PDF export button

**Alternatives Considered**:
- **Single-page form**: Rejected due to cognitive overload (50+ inputs on one screen)
- **Accordion sections**: Rejected due to lack of completion tracking, easy to skip sections
- **5 steps (merge cover/setup, merge commitment/export)**: Rejected due to step 1 complexity (10+ inputs)

### 4. Dual-Layer Persistence (localStorage + Supabase)

**Decision**: Auto-save to localStorage on every change, debounced sync to Supabase after 2-second idle.

**Rationale**:
- Offline-first: Tool works without internet (workshop venues have unreliable WiFi)
- Zero data loss: Every keystroke preserved locally, synced when possible
- Fast feedback: No spinner/loading states for saves (feels instant)
- Recovery: If Supabase fails, localStorage serves as backup; on reconnect, sync resumes
- Familiar pattern: Matches existing tools (consistent UX)

**Implementation**:
```javascript
// Auto-save to localStorage on every change
useEffect(() => {
  localStorage.setItem('fasttrack_team_tool', JSON.stringify(teamData));
}, [teamData]);

// Debounced Supabase sync (2 seconds after last change)
useEffect(() => {
  const timer = setTimeout(async () => {
    if (userEmail && teamData.teamName) {
      await supabase.from('sprint_04_team').upsert({
        user_email: userEmail,
        tool_slug: 'team',
        sprint_number: 4,
        data: teamData,
        updated_at: new Date().toISOString()
      });
    }
  }, 2000);
  return () => clearTimeout(timer);
}, [teamData, userEmail]);
```

**Alternatives Considered**:
- **Supabase-only**: Rejected due to offline failure mode, slow feedback on saves
- **Manual save button**: Rejected due to user error (forgetting to save), cognitive burden
- **Real-time sync**: Rejected due to rate limiting, unnecessary API calls during typing

### 5. Validation Enforcement at UI Level

**Decision**: Use dropdown for "Who" (no text input), date picker for "When" (no "Ongoing" option), 30-char minimum for "What".

**Rationale**:
- Eliminates ambiguity: Dropdown has finite options (team members only), date picker has calendar UI
- Prevents workarounds: No text input means users can't type "All" or "Everyone"
- Immediate feedback: Character counter for "What", disabled Next button if invalid
- Addresses client feedback: Explicit requirement from workshops (vague commitments fail)

**Implementation**:
```javascript
// "Who" dropdown (no "All" option)
<select value={action.who} onChange={(e) => updateAction(index, 'who', e.target.value)}>
  <option value="">Select person...</option>
  {teamData.teamMembers.map(member => (
    <option key={member.id} value={member.name}>{member.name}</option>
  ))}
</select>

// "When" date picker (min=today, no text input)
<input
  type="date"
  value={action.when}
  onChange={(e) => updateAction(index, 'when', e.target.value)}
  min={new Date().toISOString().split('T')[0]}
/>

// Validation for Step 4
const validateStep4 = () => {
  return teamData.actionPlan.length === 3 &&
         teamData.actionPlan.every(action =>
           action.what.trim().length >= 30 &&
           action.who && action.who !== '' &&
           action.when && action.when !== ''
         );
};
```

**Alternatives Considered**:
- **Text input with validation**: Rejected due to workaround risk (users can still type "All")
- **Server-side validation**: Rejected due to offline mode (no API to validate against)
- **Post-submission review**: Rejected due to poor UX (error after clicking Next)

### 6. Commitment Lock Before PDF Export

**Decision**: Require 100% team member sign-off (Step 5) before enabling PDF export (Step 6).

**Rationale**:
- Accountability: Physical signature equivalent (digital commitment timestamp)
- Workshop integrity: Prevents facilitator from exporting incomplete work
- Social pressure: Progress counter (X of N committed) creates group accountability
- Audit trail: Timestamps stored in Supabase for post-workshop verification

**Implementation**:
```javascript
const CommitmentLock = () => {
  const [commitments, setCommitments] = useState({});
  const allCommitted = Object.keys(commitments).length === teamData.teamMembers.length &&
                       Object.values(commitments).every(c => c === true);

  return (
    <div>
      {teamData.teamMembers.map(member => (
        <div key={member.id}>
          <span>{member.name}</span>
          <button
            onClick={() => setCommitments({...commitments, [member.id]: true})}
            disabled={commitments[member.id]}
          >
            {commitments[member.id] ? '✓ Committed' : 'I Commit'}
          </button>
        </div>
      ))}
      <p>{Object.keys(commitments).length} of {teamData.teamMembers.length} committed</p>
      <button disabled={!allCommitted} onClick={() => setStep(6)}>
        Continue to Export
      </button>
    </div>
  );
};
```

**Alternatives Considered**:
- **Optional commitment**: Rejected due to weak accountability (defeats purpose)
- **Single team leader sign-off**: Rejected due to lack of individual ownership
- **Email verification**: Rejected due to workshop time constraints (async delay)

## Risks / Trade-offs

### Risk 1: Large Team Size (50+ members) → Radar Chart Readability
**Mitigation**: Chart.js radar supports 5 axes regardless of team size (axes are dysfunctions, not members). Team size affects score calculation (more data points), not visualization. If team has >50 members, scores are still averaged across 5 dysfunctions.

### Risk 2: Browser Compatibility for Chart.js
**Mitigation**: Chart.js 4.x supports all modern browsers (Chrome, Firefox, Safari, Edge). Internet Explorer not supported, but workshops use modern laptops. Include warning in cover page: "This tool requires a modern browser (Chrome, Firefox, Safari)."

### Risk 3: Data Loss if Both localStorage and Supabase Fail
**Mitigation**: Extremely rare (localStorage fails only on quota exceeded, Supabase has 99.9% uptime). Add export button on every step (not just final) so users can download JSON backup at any point. Include "Import from JSON" button in Step 1 for recovery.

### Risk 4: PDF Generation Performance with Large Datasets
**Mitigation**: html2canvas can be slow with complex DOM (radar chart, many team members). Show loading spinner during export ("Generating PDF... this may take 30 seconds"). Test with 50-member team to establish baseline. If >60s, consider server-side PDF generation in future iteration (out of scope for v1).

### Risk 5: Commitment Lock Workaround (Single User Clicks All Buttons)
**Mitigation**: Workshop facilitation context assumes single shared screen. Commitment lock is social contract, not security mechanism. If multi-device workflow needed in future, add email verification per commitment (requires backend).

### Risk 6: Step Validation Prevents Exploratory Filling
**Trade-off**: Users can't skip ahead to see future steps. This is intentional (prevents confusion, ensures data completeness), but some users may feel constrained. Mitigation: Progress dots preview step names, cover page shows full workflow upfront.

### Risk 7: Radar Chart Doesn't Show Improvement Over Time
**Trade-off**: Tool captures point-in-time assessment, not historical trend. Future iterations could add "Previous Assessments" comparison overlay. For v1, focus on single-session completion.

## Migration Plan

**Deployment**:
1. Copy fonts from `frontend/tools/module-1-identity/*.woff2` to same directory as `04-team.html`
2. Upload `04-team.html` to `frontend/tools/module-1-identity/`
3. Update navigation in other tools (add link to 04-team.html if needed)
4. Create Supabase schema `sprint_04_team` with table structure:
   ```sql
   CREATE TABLE sprint_04_team (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_email TEXT NOT NULL,
     tool_slug TEXT NOT NULL,
     sprint_number INTEGER NOT NULL,
     data JSONB NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
5. Test with sample team (5 members, complete full workflow, verify PDF export)

**Rollback Strategy**:
- If critical bug found, remove link to 04-team.html, revert to PowerPoint template
- localStorage data persists (users can recover when bug fixed)
- Supabase data retained (no destructive changes)

**Testing Checklist**:
- [ ] File loads without errors in Chrome, Firefox, Safari
- [ ] All 7 steps navigate correctly (Back/Next buttons work)
- [ ] Radar chart renders in Step 2 with 5 axes
- [ ] "Who" dropdown has no "All" option (only team members)
- [ ] "When" date picker blocks text input, enforces minimum=today
- [ ] Validation blocks Step 4 → Step 5 if actions incomplete
- [ ] Commitment lock requires 100% sign-off before Step 6 enabled
- [ ] PDF export works (cover, chart, commitments, signatures)
- [ ] Auto-save to localStorage works (refresh page, data persists)
- [ ] Auto-save to Supabase works (check database after 2 seconds)
- [ ] Fonts load correctly (Plaak headings, Riforma body, Monument mono)
- [ ] Info boxes render correctly (yellow FastTrackInsight, grey TheScience)

## Open Questions

1. **Individual Assessment Import Format**: What structure do individual assessments use? JSON? CSV? Do we need to build an importer, or assume assessments are already in Supabase?
   - **Assumption for v1**: Manual entry in Step 1 (add team members, enter scores). Import feature can be v2.

2. **Radar Chart Scale**: Should dysfunction scores be 1-10, 0-100, or normalized percentiles?
   - **Assumption for v1**: 1-10 scale (matches most team assessment frameworks like Lencioni's). Chart.js scale set to `r: { min: 0, max: 10 }`.

3. **Commitment Lock UX**: Should commitments be individually entered (name + button), or single "All Commit" button?
   - **Decision**: Individual buttons (enforces individual accountability). Progress counter shows social proof.

4. **PDF Export Layout**: Should radar chart be full-page or embedded in summary table?
   - **Assumption for v1**: Embedded in summary section (page 1: cover, page 2: summary with chart, page 3: action plan, page 4: commitments).

5. **Navigation Between Tools**: Should there be a "Back to Module 1" button, or assume tools are launched from external menu?
   - **Assumption for v1**: No inter-tool navigation (standalone). Add breadcrumb in future if needed.
