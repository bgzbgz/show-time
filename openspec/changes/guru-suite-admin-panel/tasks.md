## 1. Database Schema - Organizations and Users

- [x] 1.1 Create migration for `organizations` table with id, name, slug, timestamps
- [x] 1.2 Create migration to add `organization_id` column to `users` table with foreign key to organizations
- [x] 1.3 Verify migrations applied successfully by checking table structure

## 2. Database Schema - Guru Access and Guides

- [x] 2.1 Create migration for `guru_access_codes` table with code, organization_id, sprint_id, guru_name, guru_email, is_active, expires_at
- [x] 2.2 Create migration for `guru_guides` table with sprint_id (unique), file_path, file_name
- [x] 2.3 Create migration for `guru_meeting_notes` table with JSONB fields for notes_content and action_items
- [x] 2.4 Add unique constraint on guru_meeting_notes (organization_id, sprint_id)

## 3. Database Seed Data - Organizations and Access Codes

- [x] 3.1 Insert 3 test organizations: Luxottica, Acme Corp, TechStart Inc with fixed UUIDs
- [x] 3.2 Insert 3 guru access codes: LUXO-WOOP, ACME-WOOP, TECH-WOOP linked to organizations and sprint 0
- [x] 3.3 Insert 5 guru guide records for sprints 0-4 with file paths to PDFs

## 4. Database Seed Data - Test Users and Progress

- [x] 4.1 Insert 7 Luxottica test users with organization_id and varying created_at dates
- [x] 4.2 Insert 3 Acme Corp test users with organization_id
- [x] 4.3 Insert 3 completed WOOP submissions for Luxottica users (Paolo, Giulia, Marco) with detailed JSONB data
- [x] 4.4 Insert 2 autosave draft records for in-progress Luxottica users (Elena, Luca)
- [x] 4.5 Insert 5 user_progress records matching submission and autosave data
- [x] 4.6 Insert 1 sample meeting note for Luxottica sprint 0 with 3 action items

## 5. Database Verification

- [x] 5.1 Query organizations table and verify 3 records with correct slugs
- [x] 5.2 Query guru_access_codes and verify 3 codes map to correct organizations
- [x] 5.3 Query users and verify organization_id foreign keys are populated
- [x] 5.4 Query tool_submissions and verify 3 WOOP submissions with JSONB data
- [x] 5.5 Query guru_meeting_notes and verify JSONB structure is correct

## 6. Backend API - Route File Setup

- [x] 6.1 Create `backend/src/routes/guru.js` file with Express router boilerplate
- [x] 6.2 Import Supabase client configuration in guru.js
- [x] 6.3 Add getSprintName helper function for sprint ID to name mapping

## 7. Backend API - Code Validation Endpoint

- [x] 7.1 Implement POST `/api/guru/validate-code` endpoint
- [x] 7.2 Add query to validate code against guru_access_codes with is_active check
- [x] 7.3 Join organizations table to return organization name and slug
- [x] 7.4 Return 401 error for invalid or inactive codes
- [x] 7.5 Test endpoint with curl/Postman using "LUXO-WOOP" (should succeed) and "INVALID" (should fail)

## 8. Backend API - Dashboard Data Endpoint

- [x] 8.1 Implement GET `/api/guru/dashboard/:code` endpoint
- [x] 8.2 Add code validation and organization_id retrieval logic
- [x] 8.3 Query users table filtered by organization_id
- [x] 8.4 Query user_progress table filtered by sprint_id and user_ids
- [x] 8.5 Query tool_submissions table filtered by sprint_id and user_ids
- [x] 8.6 Combine data to build membersWithStatus array with status calculation
- [x] 8.7 Query guru_guides table for sprint-specific guide
- [x] 8.8 Query guru_meeting_notes table for organization-sprint notes
- [x] 8.9 Calculate aggregate statistics (total, completed, in_progress, not_started)
- [x] 8.10 Return JSON response with organization, sprint, guru, team_progress, members, guru_guide, meeting_notes

## 9. Backend API - Submission Retrieval Endpoint

- [x] 9.1 Implement GET `/api/guru/submission/:code/:userId` endpoint
- [x] 9.2 Validate access code and extract organization_id
- [x] 9.3 Query users table to verify userId belongs to same organization (403 if mismatch)
- [x] 9.4 Query tool_submissions filtered by user_id and sprint_id
- [x] 9.5 Return user_name and submission data in response
- [x] 9.6 Test with valid Luxottica code + Paolo's userId (should succeed) and Acme code + Paolo's userId (should fail 403)

## 10. Backend API - Meeting Notes Endpoint

- [x] 10.1 Implement POST `/api/guru/meeting-notes/:code` endpoint
- [x] 10.2 Validate access code and extract organization_id, sprint_id, guru_code_id
- [x] 10.3 Use Supabase upsert with onConflict for organization_id + sprint_id uniqueness
- [x] 10.4 Accept notes_content (JSONB), action_items (JSONB array), meeting_date (DATE) in request body
- [x] 10.5 Set updated_at timestamp on upsert
- [x] 10.6 Return success response with saved data

## 11. Backend API - Route Registration

- [x] 11.1 Open `backend/src/index.js` file
- [x] 11.2 Import guru routes: `const guruRoutes = require('./routes/guru');`
- [x] 11.3 Register routes: `app.use('/api/guru', guruRoutes);`
- [x] 11.4 Restart backend server and verify no errors in console

## 12. Frontend - Directory and File Setup

- [x] 12.1 Create `frontend/guru-suite/` directory
- [x] 12.2 Create `frontend/guru-suite/index.html` file with HTML5 boilerplate
- [x] 12.3 Add React, ReactDOM, and Babel Standalone CDN script tags in head
- [x] 12.4 Add viewport meta tag for responsive design

## 13. Frontend - Design System and Fonts

- [x] 13.1 Add @font-face declarations for Plaak3Trial-43-Bold.woff2 (headings)
- [x] 13.2 Add @font-face declarations for RiformaLL-Regular.woff2 (body text)
- [x] 13.3 Define CSS custom properties for color palette (#1A1A1A, #FFF469, #22C55E, #6B7280, #2A2A2A, #3A3A3A)
- [x] 13.4 Add global CSS reset and base typography styles
- [x] 13.5 Test font loading by viewing page and inspecting computed styles

## 14. Frontend - Code Entry View Component

- [x] 14.1 Create CodeEntry React component with state for code input and error message
- [x] 14.2 Add Fast Track logo image in top-right corner (fixed position)
- [x] 14.3 Add "Guru Suite" title using Plaak3 font
- [x] 14.4 Add code input field with uppercase transformation and 8-12 char validation
- [x] 14.5 Add "Access Dashboard" button styled with Fast Track yellow (#FFF469)
- [x] 14.6 Implement handleSubmit function to call /api/guru/validate-code
- [x] 14.7 Display error message area for invalid codes
- [x] 14.8 On successful validation, call onAuthenticated callback with code and org data

## 15. Frontend - Dashboard Header Component

- [x] 15.1 Create Dashboard component accepting authenticated code and org data as props
- [x] 15.2 Add header section with organization name in Plaak3 font (large, bold)
- [x] 15.3 Add sprint name badge next to organization name
- [x] 15.4 Add guru name display ("Facilitator: {guru_name}")
- [x] 15.5 Add "Exit" button in top-right that returns to code entry view
- [x] 15.6 Style header with appropriate spacing and background color (#2A2A2A)

## 16. Frontend - Team Progress Overview Component

- [x] 16.1 Fetch dashboard data from /api/guru/dashboard/:code on component mount
- [x] 16.2 Calculate completion percentage from team_progress data
- [x] 16.3 Render large progress bar showing completion percentage
- [x] 16.4 Create three stat cards: Completed (green), In Progress (yellow), Not Started (gray)
- [x] 16.5 Display count and percentage in each stat card
- [x] 16.6 Style cards with rounded corners, padding, and appropriate background colors

## 17. Frontend - Team Members Table Component

- [x] 17.1 Create table with columns: NAME | EMAIL | STATUS | SUBMITTED | ACTIONS
- [x] 17.2 Map over members array to render table rows
- [x] 17.3 Add status badges with color-coded backgrounds (green/yellow/gray)
- [x] 17.4 Format submitted_at timestamp or show "—" if null
- [x] 17.5 Conditionally render "View Submission" button only for completed status
- [x] 17.6 Apply zebra striping (alternating row backgrounds) for readability
- [x] 17.7 Implement column sorting by clicking headers (name, email, status, submitted)

## 18. Frontend - Submission Modal Component

- [x] 18.1 Create SubmissionModal component with state for modal visibility and submission data
- [x] 18.2 Fetch submission data from /api/guru/submission/:code/:userId when "View Submission" clicked
- [x] 18.3 Render dark overlay background that closes modal on click
- [x] 18.4 Render white modal card with member name as header
- [x] 18.5 Display all WOOP fields: WISH (with yellow left border), OUTCOME, INTERNAL OBSTACLE, EXTERNAL OBSTACLE
- [x] 18.6 Display IF-THEN PLAN, COMMITMENT LEVEL (formatted as X/10), FIRST ACTION, REFLECTION
- [x] 18.7 Add close button (X) in top-right corner of modal
- [x] 18.8 Style sections with uppercase headers and appropriate spacing

## 19. Frontend - Guru Guide Section Component

- [x] 19.1 Conditionally render guide card only if guruGuide data exists
- [x] 19.2 Display PDF icon next to guide title
- [x] 19.3 Display guide file_name as card title
- [x] 19.4 Add "Download Guide" button that triggers file download from file_path
- [x] 19.5 Add "Open in New Tab" button that opens file_path in new browser tab
- [x] 19.6 Style card with #2A2A2A background and rounded corners
- [x] 19.7 Handle missing PDF files by checking for 404 errors and showing error message

## 20. Frontend - Meeting Notes Section Component

- [x] 20.1 Create collapsible MeetingNotes component with expand/collapse state
- [x] 20.2 Add meeting date picker (HTML date input)
- [x] 20.3 Add large textarea for notes_content.discussion_points
- [x] 20.4 Add textareas for key_insights, concerns, next_steps
- [x] 20.5 Pre-populate fields with existing meeting notes data from API
- [x] 20.6 Create action items list rendering each item with checkbox, task, assignee, due date
- [x] 20.7 Implement checkbox toggle to update action item status (pending ↔ completed)
- [x] 20.8 Add "Add Item" button that adds new empty action item to list
- [x] 20.9 Add "Save Notes" button that POSTs to /api/guru/meeting-notes/:code
- [x] 20.10 Display loading state on save button during API call
- [x] 20.11 Display "Last saved: {timestamp}" after successful save
- [x] 20.12 Style panel with collapsible header and appropriate padding

## 21. Frontend - App State Management

- [x] 21.1 Create main App component with state for authenticated status and code
- [x] 21.2 Implement conditional rendering: show CodeEntry if not authenticated, Dashboard if authenticated
- [x] 21.3 Store authenticated code in sessionStorage for persistence across page refreshes
- [x] 21.4 Clear sessionStorage on Exit button click
- [x] 21.5 Add error boundary to catch and display React errors gracefully

## 22. Frontend - Responsive Design and Polish

- [x] 22.1 Set container max-width to 1200px with auto margins for centering
- [x] 22.2 Add responsive breakpoints for tablet and mobile (media queries)
- [x] 22.3 Ensure table is horizontally scrollable on small screens
- [x] 22.4 Add hover states to all buttons and clickable elements
- [x] 22.5 Add focus styles for accessibility (keyboard navigation)
- [x] 22.6 Test on different screen sizes and browsers

## 23. Integration - WOOP Tool Button

- [x] 23.1 Open `frontend/tools/module-0-intro-sprint/00-woop.html` file
- [x] 23.2 Add "GURU LOGIN" button HTML in intro/landing section
- [x] 23.3 Style button with fixed top-right position, transparent background, Fast Track yellow border
- [x] 23.4 Set href to `/guru-suite/` or `../../guru-suite/index.html` (test both)
- [x] 23.5 Add hover effect: background changes to yellow, text to dark
- [x] 23.6 Test navigation from WOOP tool to Guru Suite

## 24. Content - Guru Guide PDFs

- [x] 24.1 Create `frontend/content/guru-guides/` directory if it doesn't exist
- [x] 24.2 Place (or create placeholder) PDF files: sprint_00_woop_guru_guide.pdf, sprint_01_know_thyself_guru_guide.pdf
- [x] 24.3 Place sprint_02_dream_guru_guide.pdf, sprint_03_values_guru_guide.pdf, sprint_04_team_guru_guide.pdf
- [x] 24.4 Verify file paths in guru_guides table match actual file locations
- [x] 24.5 Test PDF download and preview functionality in browser

## 25. End-to-End Testing - Code Entry

- [x] 25.1 Open Guru Suite in browser at `/guru-suite/`
- [x] 25.2 Verify Fast Track logo and "Guru Suite" title are visible
- [x] 25.3 Enter invalid code "INVALID123" and verify error message appears
- [x] 25.4 Enter valid code "LUXO-WOOP" and verify dashboard loads

## 26. End-to-End Testing - Dashboard Data

- [x] 26.1 Verify organization name "Luxottica" and sprint name "WOOP" display correctly
- [x] 26.2 Verify guru name "Maria Rossi" displays in header
- [x] 26.3 Verify team progress shows: Total 7, Completed 3 (43%), In Progress 2 (29%), Not Started 2 (29%)
- [x] 26.4 Verify progress bar is filled to 43%
- [x] 26.5 Verify all 7 team members are listed in table with correct names and statuses

## 27. End-to-End Testing - Submission Viewing

- [x] 27.1 Click "View Submission" for Paolo Bianchi
- [x] 27.2 Verify modal opens with Paolo's name in header
- [x] 27.3 Verify WISH section displays: "I want to become a more effective leader..."
- [x] 27.4 Verify COMMITMENT LEVEL displays as "9/10"
- [x] 27.5 Verify yellow left border on WISH section
- [x] 27.6 Verify all 8 WOOP sections are visible and properly formatted
- [x] 27.7 Close modal and verify it returns to dashboard

## 28. End-to-End Testing - Meeting Notes

- [x] 28.1 Expand meeting notes section (if collapsed)
- [x] 28.2 Verify existing notes display with discussion_points, key_insights, concerns, next_steps
- [x] 28.3 Verify 3 action items display with correct task descriptions and statuses
- [x] 28.4 Toggle checkbox on first action item and verify visual change
- [x] 28.5 Edit notes content and click "Save Notes"
- [x] 28.6 Verify success message or "Last saved" timestamp updates
- [x] 28.7 Refresh page and verify notes persist

## 29. End-to-End Testing - Guru Guide

- [x] 29.1 Verify guru guide card displays "WOOP Guru Guide"
- [x] 29.2 Click "Download Guide" and verify PDF downloads
- [x] 29.3 Click "Open in New Tab" and verify PDF opens in new browser tab
- [x] 29.4 Verify PDF content is readable

## 30. End-to-End Testing - Multi-Organization Isolation

- [x] 30.1 Click Exit to return to code entry
- [x] 30.2 Enter code "ACME-WOOP" and verify Acme Corp dashboard loads
- [x] 30.3 Verify only 3 Acme Corp team members are visible (not Luxottica members)
- [x] 30.4 Attempt to access Luxottica member submission via direct API call with Acme code (should return 403)
- [x] 30.5 Verify organization data isolation is working correctly

## 31. End-to-End Testing - Navigation and WOOP Integration

- [x] 31.1 Navigate to `/tools/module-0-intro-sprint/00-woop.html`
- [x] 31.2 Verify "GURU LOGIN" button is visible in top-right corner
- [x] 31.3 Click button and verify navigation to Guru Suite code entry page
- [x] 31.4 Enter valid code and verify full flow works from WOOP tool entry point

## 32. Documentation and Cleanup

- [x] 32.1 Document API endpoints in README or API documentation file
- [x] 32.2 Document seed data structure and test codes for future developers
- [x] 32.3 Add inline code comments for complex logic (JSONB handling, organization filtering)
- [x] 32.4 Remove any console.log debugging statements
- [x] 32.5 Run code formatter/linter if project has one configured
