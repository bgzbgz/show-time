## ADDED Requirements

### Requirement: Tool Status Display
The dashboard SHALL display the current status of each tool using text-based indicators.

#### Scenario: Locked status displayed
- **WHEN** a tool's status is "locked"
- **THEN** status indicator SHALL show "LOCKED" in grey text (#B2B2B2)
- **AND** tool card SHALL be in disabled visual state
- **AND** user SHALL NOT be able to interact with the tool

#### Scenario: Unlocked status displayed
- **WHEN** a tool's status is "unlocked"
- **THEN** status indicator SHALL show "UNLOCKED" in white text (#FFFFFF)
- **AND** tool card SHALL be in enabled visual state
- **AND** user SHALL be able to launch the tool

#### Scenario: In progress status displayed
- **WHEN** a tool's status is "in_progress"
- **THEN** status indicator SHALL show "IN PROGRESS" in yellow text (#FFF469)
- **AND** tool card SHALL have yellow border
- **AND** progress percentage bar SHALL be visible
- **AND** user SHALL be able to continue working on the tool

#### Scenario: Completed status displayed
- **WHEN** a tool's status is "completed"
- **THEN** status indicator SHALL show checkmark icon or "DONE" text
- **AND** progress bar SHALL display 100% completion with yellow fill
- **AND** "VIEW SUMMARY" button SHALL be visible
- **AND** user SHALL be able to re-launch or view summary

### Requirement: Progress Percentage Bar
The dashboard SHALL display visual progress bars for each tool showing completion percentage.

#### Scenario: Progress bar renders for in-progress tools
- **WHEN** a tool has status "in_progress" with progress value
- **THEN** a horizontal progress bar SHALL be displayed
- **AND** filled portion SHALL use yellow accent color (#FFF469)
- **AND** unfilled portion SHALL use grey color (#B2B2B2)
- **AND** bar SHALL fill from left to right

#### Scenario: Progress percentage displayed
- **WHEN** a tool has progress value (0-100)
- **THEN** progress bar fill SHALL match the percentage
- **AND** percentage text SHALL be displayed (e.g., "45%")
- **AND** visual representation SHALL be accurate

#### Scenario: Progress bar for completed tools
- **WHEN** a tool has status "completed"
- **THEN** progress bar SHALL show 100% fill
- **AND** bar SHALL be fully yellow (#FFF469)

#### Scenario: No progress bar for locked/unlocked tools
- **WHEN** a tool has status "locked" or "unlocked"
- **THEN** progress bar SHALL NOT be displayed
- **AND** only status indicator SHALL be visible

### Requirement: Overall Progress Summary
The dashboard SHALL display overall transformation journey progress.

#### Scenario: Overall completion count
- **WHEN** dashboard loads
- **THEN** hero section SHALL display "X of 30 tools complete"
- **AND** X SHALL be the count of tools with status "completed"
- **AND** total SHALL always be 30

#### Scenario: Overall progress bar in header
- **WHEN** header renders
- **THEN** overall progress bar SHALL display aggregate completion
- **AND** bar SHALL show percentage of completed tools (completed/30)
- **AND** bar SHALL use yellow accent color for fill

#### Scenario: Overall progress updates in real-time
- **WHEN** user completes a tool
- **THEN** overall progress count SHALL increment
- **AND** overall progress bar SHALL update
- **AND** hero section text SHALL update to reflect new count

### Requirement: Module Completion Tracking
The dashboard SHALL track and display completion status for each module.

#### Scenario: Module progress indicator
- **WHEN** viewing a module section
- **THEN** module header SHALL show completion count (e.g., "3/11")
- **AND** fraction SHALL represent completed tools / total tools in module
- **AND** visual indicator SHALL show module completion percentage

#### Scenario: Module completion badge
- **WHEN** all tools in a module are completed
- **THEN** module SHALL display completion badge or indicator
- **AND** visual emphasis SHALL indicate full module completion

#### Scenario: Module progress calculation
- **WHEN** dashboard calculates module progress
- **THEN** it SHALL count tools with status "completed" in that module
- **AND** it SHALL divide by total tools in the module
- **AND** percentage SHALL be accurate and updated in real-time

### Requirement: Real-Time Progress Updates
The dashboard SHALL fetch and display updated progress data periodically.

#### Scenario: Polling for progress updates
- **WHEN** dashboard is active and user is present
- **THEN** it SHALL poll `/api/tools` endpoint every 30 seconds
- **AND** progress data SHALL be refreshed
- **AND** UI SHALL update to reflect new statuses

#### Scenario: Polling paused when inactive
- **WHEN** user is inactive or tab is not visible
- **THEN** polling SHALL be paused to conserve resources
- **AND** polling SHALL resume when user returns
- **AND** immediate refresh SHALL occur on tab visibility change

#### Scenario: Manual refresh option
- **WHEN** user wants immediate progress update
- **THEN** a manual refresh button SHALL be available
- **AND** clicking it SHALL immediately fetch latest progress
- **AND** UI SHALL update with new data

### Requirement: Dependency-Based Unlocking
The dashboard SHALL display tool unlock animations when dependencies are satisfied.

#### Scenario: Tool unlocks after dependency completion
- **WHEN** a tool's dependency is completed
- **THEN** dependent tool status SHALL change from "locked" to "unlocked"
- **AND** unlock animation SHALL play (fade-in + yellow pulse)
- **AND** visual attention SHALL be drawn to newly unlocked tool

#### Scenario: Multiple tools unlock simultaneously
- **WHEN** multiple tools become unlocked at same time
- **THEN** animations SHALL be staggered by 200ms
- **AND** each tool SHALL have distinct visual unlock effect
- **AND** user SHALL notice all newly available tools

#### Scenario: Unlock notification
- **WHEN** tool unlocks during user's session
- **THEN** a subtle notification MAY appear (optional)
- **AND** notification SHALL indicate which tool(s) unlocked
- **AND** notification SHALL not obstruct dashboard view

### Requirement: Current Sprint Indicator
The dashboard SHALL display the user's current active sprint.

#### Scenario: Current sprint displayed in hero section
- **WHEN** dashboard loads
- **THEN** hero section SHALL show "CURRENT SPRINT: X"
- **AND** X SHALL be the sprint number of the first in-progress tool
- **AND** if no tools in progress, SHALL show next unlocked sprint

#### Scenario: Sprint indicator updates
- **WHEN** user completes current sprint's tool
- **THEN** current sprint indicator SHALL update to next sprint
- **AND** visual emphasis SHALL highlight the current sprint in module grid

### Requirement: Progress Data Fetching
The dashboard SHALL fetch user progress data from backend API.

#### Scenario: Initial progress fetch on load
- **WHEN** dashboard loads after authentication
- **THEN** it SHALL call GET `/api/tools` endpoint
- **AND** response SHALL include all 30 tools with status and progress
- **AND** UI SHALL render based on fetched data

#### Scenario: User progress summary fetch
- **WHEN** dashboard needs overall statistics
- **THEN** it SHALL call GET `/api/user/progress` endpoint
- **AND** response SHALL include completed count, current sprint, etc.
- **AND** hero section and header SHALL display this data

#### Scenario: Progress fetch error handling
- **WHEN** progress fetch fails
- **THEN** dashboard SHALL display cached progress (if available)
- **AND** error message SHALL indicate data may be stale
- **AND** retry button SHALL be available

### Requirement: Last Updated Timestamp
The dashboard SHALL display when progress data was last refreshed.

#### Scenario: Timestamp displayed after fetch
- **WHEN** progress data is fetched successfully
- **THEN** a timestamp SHALL be displayed (e.g., "Last updated 30 seconds ago")
- **AND** timestamp SHALL be positioned near refresh button
- **AND** timestamp SHALL update every second to show relative time

#### Scenario: Timestamp updates on refresh
- **WHEN** data is refreshed (automatic or manual)
- **THEN** timestamp SHALL reset to "Last updated just now"
- **AND** relative time SHALL begin counting again

### Requirement: Progress State Management
The dashboard SHALL maintain progress state in React component state.

#### Scenario: Progress state structure
- **WHEN** dashboard manages progress data
- **THEN** state SHALL include:
  - `tools`: array of 30 tool objects with id, sprint, name, slug, module, status, progress
  - `overallProgress`: object with completed count, total, percentage
  - `loading`: boolean indicating fetch in progress
  - `error`: string message if fetch failed

#### Scenario: State updates trigger re-render
- **WHEN** progress state changes
- **THEN** affected UI components SHALL re-render
- **AND** visual updates SHALL be smooth and performant
- **AND** no unnecessary re-renders SHALL occur

### Requirement: Visual Feedback During Updates
The dashboard SHALL provide visual feedback when updating progress data.

#### Scenario: Loading indicator during fetch
- **WHEN** progress data is being fetched
- **THEN** a subtle loading indicator SHALL be visible
- **AND** indicator SHALL NOT obscure dashboard content
- **AND** indicator SHALL disappear when fetch completes

#### Scenario: Success feedback on update
- **WHEN** progress data updates successfully
- **THEN** brief success feedback MAY be shown (e.g., green checkmark)
- **AND** feedback SHALL be non-intrusive
- **AND** user SHALL understand data is current
