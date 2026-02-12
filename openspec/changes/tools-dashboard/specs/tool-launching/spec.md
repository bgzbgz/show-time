## ADDED Requirements

### Requirement: Launch Button Click Handling
The dashboard SHALL handle tool launch button clicks and navigate to individual tool pages.

#### Scenario: Launch button clicked on unlocked tool
- **WHEN** user clicks "LAUNCH" button on an unlocked tool
- **THEN** dashboard SHALL navigate to the tool's HTML file
- **AND** navigation SHALL occur in the same browser tab
- **AND** user SHALL be able to use back button to return to dashboard

#### Scenario: Launch button clicked on in-progress tool
- **WHEN** user clicks "LAUNCH" button on an in-progress tool
- **THEN** dashboard SHALL navigate to the tool's HTML file
- **AND** tool SHALL resume from last saved state
- **AND** user SHALL continue where they left off

#### Scenario: Launch button clicked on completed tool
- **WHEN** user clicks "LAUNCH" button on a completed tool
- **THEN** dashboard SHALL navigate to the tool's HTML file
- **AND** tool SHALL load with completed data visible
- **AND** user SHALL be able to review or edit their submission

#### Scenario: Launch button disabled on locked tool
- **WHEN** user attempts to click "LAUNCH" on a locked tool
- **THEN** button SHALL be disabled and non-interactive
- **AND** no navigation SHALL occur
- **AND** visual state SHALL indicate unavailability

### Requirement: Tool URL Construction
The dashboard SHALL construct correct URLs for individual tool HTML files.

#### Scenario: Tool URL format
- **WHEN** constructing tool URL
- **THEN** URL SHALL follow format `/frontend/tools/{sprint-number}-{slug}.html`
- **AND** sprint-number SHALL be zero-padded (e.g., "00", "01", "11")
- **AND** slug SHALL match the tool's kebab-case identifier

#### Scenario: Tool URL examples
- **WHEN** launching tool at sprint 0 with slug "woop"
- **THEN** URL SHALL be `/frontend/tools/00-woop.html`
- **WHEN** launching tool at sprint 15 with slug "customer-avatar"
- **THEN** URL SHALL be `/frontend/tools/15-customer-avatar.html`

#### Scenario: Absolute vs relative URLs
- **WHEN** dashboard is hosted at any base URL
- **THEN** tool URLs SHALL be constructed relative to the domain root
- **AND** navigation SHALL work regardless of dashboard location

### Requirement: Token Passing to Tools
The dashboard SHALL pass authentication token to individual tools for API access.

#### Scenario: Token included in tool URL
- **WHEN** navigating to a tool
- **THEN** JWT token SHALL be appended as URL parameter `?token=<jwt>`
- **AND** token SHALL be retrieved from localStorage
- **AND** tool SHALL receive token for backend API calls

#### Scenario: Token persistence across tool navigation
- **WHEN** user navigates from dashboard to tool
- **THEN** token SHALL be available in tool page
- **AND** tool SHALL store token in its own localStorage
- **AND** user SHALL remain authenticated in both contexts

#### Scenario: Missing token handling
- **WHEN** launching tool without valid token in localStorage
- **THEN** dashboard SHALL prevent navigation
- **AND** user SHALL be redirected to authentication flow
- **AND** error message SHALL indicate authentication required

### Requirement: User Context Passing
The dashboard SHALL pass user context to tools for personalization.

#### Scenario: User context in URL parameters
- **WHEN** launching a tool
- **THEN** URL MAY include additional context parameters:
  - `token`: JWT authentication token
  - `user`: user ID (optional, if not in token)
  - `context`: additional context data (optional)

#### Scenario: Context via localStorage
- **WHEN** tool loads
- **THEN** it MAY read additional context from localStorage
- **AND** dashboard SHALL ensure context is available before navigation
- **AND** context SHALL include user preferences, progress data, etc.

### Requirement: Same-Tab Navigation
The dashboard SHALL navigate to tools in the same browser tab.

#### Scenario: Same-tab navigation on launch
- **WHEN** user launches a tool
- **THEN** navigation SHALL occur via `window.location.href`
- **AND** tool SHALL replace current dashboard page
- **AND** browser back button SHALL return to dashboard

#### Scenario: Back navigation to dashboard
- **WHEN** user clicks browser back button from tool
- **THEN** dashboard SHALL reload
- **AND** authentication state SHALL persist
- **AND** progress SHALL reflect any changes made in tool

#### Scenario: Forward navigation after back
- **WHEN** user navigates back to dashboard then forward again
- **THEN** previously launched tool SHALL load
- **AND** navigation history SHALL work as expected

### Requirement: Launch Button Availability
The dashboard SHALL control launch button visibility and enablement based on tool status.

#### Scenario: Launch button visible for unlocked tools
- **WHEN** tool status is "unlocked"
- **THEN** "LAUNCH" button SHALL be visible
- **AND** button SHALL be enabled and clickable
- **AND** button SHALL have active visual state

#### Scenario: Launch button visible for in-progress tools
- **WHEN** tool status is "in_progress"
- **THEN** "LAUNCH" button SHALL be visible
- **AND** button text MAY change to "CONTINUE" for clarity
- **AND** button SHALL be enabled and clickable

#### Scenario: Launch button visible for completed tools
- **WHEN** tool status is "completed"
- **THEN** "LAUNCH" button SHALL remain visible
- **AND** button SHALL be enabled (allow review)
- **AND** button SHALL coexist with "VIEW SUMMARY" button

#### Scenario: Launch button disabled for locked tools
- **WHEN** tool status is "locked"
- **THEN** "LAUNCH" button SHALL be visible but disabled
- **AND** button SHALL have greyed-out visual state
- **AND** cursor SHALL indicate non-interactivity (not-allowed)

### Requirement: Tool File Existence Validation
The dashboard SHALL assume tool HTML files exist at expected paths.

#### Scenario: Tool files assumed to exist
- **WHEN** dashboard renders tool cards
- **THEN** it SHALL NOT validate file existence
- **AND** it SHALL assume files exist at `/frontend/tools/{sprint}-{slug}.html`
- **AND** 404 errors SHALL be handled by browser's default behavior

#### Scenario: Missing tool file error
- **WHEN** user launches tool and file does not exist
- **THEN** browser SHALL display 404 error page
- **AND** user SHALL be able to use back button to return to dashboard
- **AND** dashboard SHALL NOT prevent navigation attempt

### Requirement: Navigation Confirmation
The dashboard SHALL NOT show confirmation dialogs before navigating to tools.

#### Scenario: Immediate navigation on launch
- **WHEN** user clicks "LAUNCH" button
- **THEN** navigation SHALL occur immediately
- **AND** no confirmation dialog SHALL be shown
- **AND** user experience SHALL be seamless

#### Scenario: Unsaved changes handling
- **WHEN** dashboard has no form inputs or unsaved state
- **THEN** navigation SHALL always be permitted
- **AND** no beforeunload event SHALL be registered

### Requirement: Tool Registry Integration
The dashboard SHALL use tool data from backend API, not config file.

#### Scenario: Tool metadata from API
- **WHEN** dashboard fetches tools from `/api/tools`
- **THEN** response SHALL include slug, sprint, name for each tool
- **AND** dashboard SHALL use API data to construct URLs
- **AND** config file SHALL NOT be referenced by frontend

#### Scenario: Tool URL construction from API data
- **WHEN** building launch URL
- **THEN** dashboard SHALL use `sprint` and `slug` fields from API
- **AND** URL SHALL be `/frontend/tools/${sprint}-${slug}.html`
- **AND** construction SHALL be consistent across all tools

### Requirement: Launch Analytics
The dashboard MAY track tool launch events for analytics purposes.

#### Scenario: Launch event tracking
- **WHEN** user launches a tool
- **THEN** analytics event MAY be sent to tracking system
- **AND** event SHALL include tool ID, user ID, timestamp
- **AND** tracking SHALL NOT block navigation

#### Scenario: Launch failure tracking
- **WHEN** tool navigation fails (404, network error)
- **THEN** failure event MAY be logged
- **AND** error details SHALL be recorded for debugging
- **AND** tracking SHALL be non-intrusive

### Requirement: Referrer Context
The dashboard SHALL be identifiable as referrer to tools for context awareness.

#### Scenario: Referrer header set
- **WHEN** navigating to tool
- **THEN** browser SHALL set `document.referrer` to dashboard URL
- **AND** tool SHALL be able to identify navigation came from dashboard
- **AND** tool MAY use referrer for conditional logic (e.g., show back button)

#### Scenario: Return to dashboard link in tools
- **WHEN** tool detects dashboard as referrer
- **THEN** tool MAY display "Back to Dashboard" link
- **AND** link SHALL navigate to dashboard
- **AND** user SHALL have explicit way to return beyond back button
