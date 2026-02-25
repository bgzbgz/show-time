## 1. File Setup and Structure

- [x] 1.1 Create `frontend/tools/module-1-identity/04-team.html` file
- [x] 1.2 Copy font files (Plaak, Riforma, Monument) to same directory
- [x] 1.3 Verify fonts exist: Plaak3Trial-43-Bold.woff2, RiformaLL-Regular.woff2, MonumentGrotesk-Mono.woff2, RangleRiformaWeb-Medium.woff2

## 2. HTML Skeleton and CDN Imports

- [x] 2.1 Add DOCTYPE and HTML structure with lang="en"
- [x] 2.2 Add React 18 CDN links (react.production.min.js, react-dom.production.min.js)
- [x] 2.3 Add Babel standalone CDN for JSX transformation
- [x] 2.4 Add Tailwind CSS CDN (cdn.tailwindcss.com)
- [x] 2.5 Add Supabase JS CDN (@supabase/supabase-js@2)
- [x] 2.6 Add Chart.js CDN (chart.js@4)
- [x] 2.7 Add jsPDF CDN (jspdf.umd.min.js)
- [x] 2.8 Add html2canvas CDN (html2canvas.min.js)
- [x] 2.9 Add root div element with id="root"

## 3. CSS Styling and Theme

- [x] 3.1 Add @font-face declarations for all 4 fonts (Plaak, Riforma, Monument)
- [x] 3.2 Define CSS custom properties for colors (--ft-yellow: #FFF469, --ft-black: #000000)
- [x] 3.3 Create .plaak class for headings (font-family: Plaak, bold)
- [x] 3.4 Create .riforma class for body text (font-family: Riforma)
- [x] 3.5 Create .monument class for monospace text (font-family: Monument)
- [x] 3.6 Create .btn-primary class (black background, white text, hover states)
- [x] 3.7 Create .btn-secondary class (white background, black border, hover states)
- [x] 3.8 Create .worksheet-input class (border, padding, focus states)
- [x] 3.9 Add global styles (box-sizing, body font, reset)

## 4. React Component Structure and State

- [x] 4.1 Create TeamTool main component function
- [x] 4.2 Initialize step state with useState(0) for current step (0-6)
- [x] 4.3 Initialize userEmail state with useState('')
- [x] 4.4 Initialize teamData state with complete structure (teamName, teamMembers, individualAssessments, dysfunctionScores, improvementPlan, actionPlan, commitments)
- [x] 4.5 Add Supabase client initialization (URL: https://vpfayzzjnegdefjrnyoc.supabase.co)
- [x] 4.6 Create conditional rendering logic to display correct step based on step state
- [x] 4.7 Add ReactDOM.render call at bottom to mount TeamTool to #root

## 5. Info Box Components

- [x] 5.1 Create FastTrackInsight component (yellow #FFF469 background, black left border)
- [x] 5.2 Create TheScience component (grey #F3F4F6 background, grey left border)
- [x] 5.3 Add uppercase labels "FAST TRACK INSIGHT" and "THE SCIENCE" to components
- [x] 5.4 Test both components render with sample content

## 6. Progress Indicator Component

- [x] 6.1 Create ProgressDots component with 7 dots (indices 0-6)
- [x] 6.2 Add filled state for completed steps (indices < current step)
- [x] 6.3 Add highlighted state for current step
- [x] 6.4 Add unfilled state for upcoming steps (indices > current step)
- [x] 6.5 Make dots clickable for backward navigation only (index < current step)
- [x] 6.6 Disable forward navigation clicks (index > current step)

## 7. Navigation Footer Component

- [x] 7.1 Create sticky footer with Back and Next buttons
- [x] 7.2 Add Back button logic (hidden on step 0, enabled on steps 1-6)
- [x] 7.3 Add Next button logic (hidden on step 6, conditionally enabled based on validation)
- [x] 7.4 Implement setStep function to update current step
- [x] 7.5 Add Tailwind classes for sticky positioning (fixed bottom-0)

## 8. Step 0 - Cover Page

- [x] 8.1 Create Step0 component with hero title "5 Dysfunctions of a Team"
- [x] 8.2 Add subtitle "Workshop Tool" with Riforma font
- [x] 8.3 Add descriptive paragraph explaining tool purpose
- [x] 8.4 Add "Start" button that advances to Step 1
- [x] 8.5 Apply max-width 640px and center content
- [x] 8.6 Add Fast Track branding (logo or text)

## 9. Step 1 - Team Setup

- [x] 9.1 Create Step1 component with team name input field
- [x] 9.2 Add "Add Team Member" button and member input field
- [x] 9.3 Implement addTeamMember function to append to teamData.teamMembers array
- [x] 9.4 Display list of added team members with remove buttons
- [x] 9.5 Add section for individual assessment import (manual entry placeholder)
- [x] 9.6 Create input fields for entering dysfunction scores per member (5 scores: 1-10 scale)
- [x] 9.7 Add validation: team name required, at least 1 team member required
- [x] 9.8 Disable Next button if validation fails
- [x] 9.9 Add FastTrackInsight box explaining team setup importance

## 10. Step 2 - Team Summary and Radar Chart

- [x] 10.1 Create Step2 component with team summary header
- [x] 10.2 Implement calculateDysfunctionScores function (aggregate individual assessments into team averages)
- [x] 10.3 Display dysfunction scores table with 3 columns: Dysfunction | Score | Status
- [x] 10.4 Add color-coded badges (green 1-3.9, yellow 4-6.9, red 7-10) based on scores
- [x] 10.5 Create canvas element with ref for Chart.js (chartRef)
- [x] 10.6 Add useEffect to initialize Chart.js radar chart when step === 2
- [x] 10.7 Configure Chart.js with 5 axes (Trust, Conflict, Commitment, Accountability, Results)
- [x] 10.8 Set chart styling (yellow fill rgba(255,244,105,0.2), black border, width 2)
- [x] 10.9 Set chart scale (r: { min: 0, max: 10 })
- [x] 10.10 Add TheScience box explaining Lencioni's 5 Dysfunctions model
- [x] 10.11 Handle edge case: display message if no assessments available

## 11. Step 3 - Improvement Plan

- [x] 11.1 Create Step3 component with improvement plan header
- [x] 11.2 Display top 3 dysfunctions sorted by highest scores
- [x] 11.3 Add text area input for improvement notes for each dysfunction
- [x] 11.4 Store improvement notes in teamData.improvementPlan array
- [x] 11.5 Add FastTrackInsight box about focusing on top 3 priorities
- [x] 11.6 Apply 32px spacing (space-y-8) between dysfunction sections
- [x] 11.7 Validation: at least 1 improvement note required (optional: could allow progression without)

## 12. Step 4 - Action Plan with Validation

- [x] 12.1 Create Step4 component with action plan header
- [x] 12.2 Create 3 action item forms (What/Who/When)
- [x] 12.3 Add "What" textarea with character counter (minimum 30 characters)
- [x] 12.4 Add "Who" dropdown populated with team members (no "All" option)
- [x] 12.5 Add "When" date picker (type="date", min=today, no text input)
- [x] 12.6 Implement updateAction function to modify teamData.actionPlan array
- [x] 12.7 Create validateStep4 function: all 3 actions must have valid What (≥30 chars), Who (selected), When (date chosen)
- [x] 12.8 Display real-time validation feedback (character count, field borders, error messages)
- [x] 12.9 Show validation summary "X of 3 actions complete"
- [x] 12.10 Add green checkmarks for validated actions, red icons for incomplete
- [x] 12.11 Disable Next button until all 3 actions validated
- [x] 12.12 Add warning if same person assigned multiple actions on same date (informational only)

## 13. Step 5 - Commitment Lock

- [x] 13.1 Create Step5 component with commitment lock header
- [x] 13.2 Initialize commitments state with useState({}) to track member commitments
- [x] 13.3 Display list of all team members with "I Commit" buttons
- [x] 13.4 Implement handleCommit function to mark member as committed with timestamp
- [x] 13.5 Change button to "✓ Committed" and disable after commitment
- [x] 13.6 Add subtle green background (#F0FDF4) to committed member rows
- [x] 13.7 Display progress counter "X of Y committed"
- [x] 13.8 Calculate allCommitted boolean (100% commitment required)
- [x] 13.9 Disable Next button until allCommitted === true
- [x] 13.10 Add FastTrackInsight box explaining 100% commitment requirement
- [x] 13.11 Store commitment timestamps in teamData.commitments array

## 14. Step 6 - Final Review and PDF Export

- [x] 14.1 Create Step6 component with final review header
- [x] 14.2 Display summary of all entered data (team name, members, scores, actions, commitments)
- [x] 14.3 Add "Export PDF" button with loading state
- [x] 14.4 Implement generatePDF function using jsPDF
- [x] 14.5 Create PDF page 1: Cover (team name, date, Fast Track branding)
- [x] 14.6 Create PDF page 2: Team summary (roster + dysfunction scores table with color badges)
- [x] 14.7 Create PDF page 3: Radar chart (capture canvas with html2canvas, embed as image 600x600px)
- [x] 14.8 Create PDF page 4: Improvement plan (top 3 dysfunctions + notes)
- [x] 14.9 Create PDF page 5: Action plan (3 WWW actions in table: # | What | Who | When)
- [x] 14.10 Create PDF page 6: Commitment signatures (all members with timestamps)
- [x] 14.11 Set PDF filename format: "FastTrack_Team_[TeamName]_[Date].pdf"
- [x] 14.12 Trigger automatic download on PDF generation complete
- [x] 14.13 Add loading spinner overlay during PDF generation (10-30 seconds)
- [x] 14.14 Handle errors gracefully (jsPDF not loaded, html2canvas fails, missing data)
- [x] 14.15 Display success message "PDF downloaded successfully" after completion

## 15. Auto-Save to localStorage

- [x] 15.1 Add useEffect to save teamData to localStorage on every change
- [x] 15.2 Use localStorage.setItem('fasttrack_team_tool', JSON.stringify(teamData))
- [x] 15.3 Debounce saves with 300ms delay to avoid excessive writes
- [x] 15.4 Load from localStorage on component mount (useEffect with empty deps)
- [x] 15.5 Parse saved data and restore to teamData state
- [x] 15.6 Handle JSON parse errors gracefully (corrupted localStorage)

## 16. Auto-Save to Supabase

- [x] 16.1 Add useEffect with 2-second debounce to sync teamData to Supabase
- [x] 16.2 Check if userEmail and teamName exist before syncing
- [x] 16.3 Use supabase.from('sprint_04_team').upsert() to save or update row
- [x] 16.4 Include fields: user_email, tool_slug: 'team', sprint_number: 4, data: teamData, updated_at
- [x] 16.5 Handle Supabase errors silently (offline mode fallback)
- [x] 16.6 Add email input field in Step 1 to capture userEmail
- [x] 16.7 Implement session restore from Supabase if ?email= URL parameter provided

## 17. Validation Functions

- [x] 17.1 Create validateStep1 function (team name not empty, at least 1 member)
- [x] 17.2 Create validateStep4 function (3 actions, each with What ≥30 chars, Who selected, When date)
- [x] 17.3 Create validateStep5 function (100% commitments)
- [x] 17.4 Add validation checks to Next button disabled logic
- [x] 17.5 Create helper function to trim whitespace before validating text fields

## 18. Score Calculation Functions

- [x] 18.1 Create calculateDysfunctionScores function to aggregate individual assessments
- [x] 18.2 Calculate average for each of 5 dysfunctions across all team members
- [x] 18.3 Round scores to 2 decimal places
- [x] 18.4 Handle edge case: no assessments (return null or empty object)
- [x] 18.5 Create getSeverityBadge function (score → color + label: green/Strength, yellow/Opportunity, red/Priority)
- [x] 18.6 Create sortDysfunctionsByScore function (highest to lowest)

## 19. Layout and Responsive Design

- [x] 19.1 Apply max-width 640px (max-w-2xl) to all step containers
- [x] 19.2 Center containers horizontally with mx-auto
- [x] 19.3 Add 32px vertical spacing (space-y-8) between sections
- [x] 19.4 Ensure single-column layout (no multi-column grids)
- [x] 19.5 Make sticky footer work on all screen sizes (fixed bottom-0, full width)
- [x] 19.6 Test on viewport widths: 320px (mobile), 768px (tablet), 1024px (desktop)

## 20. Testing and Validation

- [x] 20.1 Test file loads without errors in Chrome
- [x] 20.2 Test file loads without errors in Firefox
- [x] 20.3 Test file loads without errors in Safari
- [x] 20.4 Verify all 7 steps navigate correctly with Back/Next buttons
- [x] 20.5 Verify progress dots update on step changes
- [x] 20.6 Verify progress dots clickable backward, not forward
- [x] 20.7 Test radar chart renders in Step 2 with sample data
- [x] 20.8 Verify "Who" dropdown has no "All" option (only team members)
- [x] 20.9 Verify "When" date picker blocks past dates and text input
- [x] 20.10 Test validation blocks Step 4 → Step 5 if actions incomplete
- [x] 20.11 Test commitment lock requires 100% sign-off before Step 6
- [x] 20.12 Test PDF export generates 6-page document with all content
- [x] 20.13 Verify auto-save to localStorage works (refresh page, data persists)
- [x] 20.14 Verify auto-save to Supabase works (check database after 2 seconds)
- [x] 20.15 Verify fonts load correctly (Plaak for headings, Riforma for body)
- [x] 20.16 Verify FastTrackInsight boxes render with yellow background
- [x] 20.17 Verify TheScience boxes render with grey background
- [x] 20.18 Test with 1 team member, 5 team members, 20 team members
- [x] 20.19 Test edge case: browser refresh mid-workflow
- [x] 20.20 Test edge case: missing individual assessments

## 21. Final Polish and Documentation

- [x] 21.1 Add HTML meta tags (title, description, viewport)
- [x] 21.2 Add comments explaining major sections in code
- [x] 21.3 Verify file size is ~1000-1500 lines (similar to 03-values.html)
- [x] 21.4 Add console.log statements for debugging (optional, can be removed in production)
- [x] 21.5 Test full workflow end-to-end: Step 0 → Step 6 → PDF export
- [x] 21.6 Verify all client feedback requirements addressed (auto-calc, visual interpretation, radar chart, enforce ownership, block vague deadlines, digital commitment)
