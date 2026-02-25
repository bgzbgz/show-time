## ADDED Requirements

### Requirement: Locked tool overlay display
The system SHALL display a locked overlay when a user attempts to access a tool they have not unlocked.

#### Scenario: Display locked overlay
- **WHEN** a user lands on a tool page where `is_unlocked` is false
- **THEN** the system SHALL display an overlay covering the tool with lock icon and message

#### Scenario: Locked overlay message
- **WHEN** displaying the locked overlay
- **THEN** the system SHALL show "Complete previous lessons in LearnWorlds to unlock this tool"

### Requirement: Progress indicator on locked tools
The system SHALL display the user's overall progress when showing locked tools.

#### Scenario: Show progress count
- **WHEN** displaying a locked tool overlay
- **THEN** the system SHALL include text like "You've completed 2/5 sprints"

#### Scenario: Update progress dynamically
- **WHEN** progress data is loaded
- **THEN** the system SHALL calculate completed vs total sprints and display current progress

### Requirement: Completed tool read-only mode
The system SHALL display completed tools in read-only mode with past submissions visible.

#### Scenario: Load completed tool
- **WHEN** a user accesses a tool where `status` is `completed`
- **THEN** the system SHALL load and display the past submission in read-only format

#### Scenario: Disable editing on completed tools
- **WHEN** displaying a completed tool
- **THEN** the system SHALL disable all form inputs and show "View Only" indicator

#### Scenario: Show completion timestamp
- **WHEN** displaying a completed tool
- **THEN** the system SHALL show "Completed on {completed_at}" near the top of the tool

### Requirement: Unlocked tool edit mode
The system SHALL allow full interaction with unlocked, incomplete tools.

#### Scenario: Enable editing on unlocked tools
- **WHEN** a user accesses a tool where `is_unlocked` is true and `status` is not `completed`
- **THEN** the system SHALL enable all form inputs and allow saving progress

#### Scenario: Track tool start
- **WHEN** a user interacts with an unlocked tool for the first time
- **THEN** the system SHALL update status to `in_progress` and record `started_at`

### Requirement: Tool navigation menu access control
The system SHALL indicate locked/unlocked status in navigation menus or tool lists.

#### Scenario: Show lock icon on locked tools
- **WHEN** displaying a tool navigation menu
- **THEN** the system SHALL show a lock icon next to tools where `is_unlocked` is false

#### Scenario: Show checkmark on completed tools
- **WHEN** displaying a tool navigation menu
- **THEN** the system SHALL show a checkmark icon next to tools where `status` is `completed`

#### Scenario: Highlight current active tool
- **WHEN** displaying a tool navigation menu
- **THEN** the system SHALL highlight the currently accessible unlocked tool

### Requirement: Prevent direct URL access to locked tools
The system SHALL enforce lock status even when users attempt direct URL navigation.

#### Scenario: Block direct navigation to locked tool
- **WHEN** a user navigates directly to a locked tool URL
- **THEN** the system SHALL load the page but immediately display the locked overlay

#### Scenario: Allow direct navigation to unlocked tools
- **WHEN** a user navigates directly to an unlocked or completed tool URL
- **THEN** the system SHALL display the tool normally

### Requirement: Lock status refresh on webhook events
The system SHALL refresh lock status when progress changes occur.

#### Scenario: Poll for progress updates
- **WHEN** a user has the application open
- **THEN** the system SHALL periodically check for progress updates from the backend

#### Scenario: Unlock notification
- **WHEN** a tool becomes unlocked while the user is viewing the application
- **THEN** the system SHALL show a notification "New tool unlocked!" and update the UI

### Requirement: Visual distinction between locked, unlocked, and completed states
The system SHALL use clear visual indicators for each tool state.

#### Scenario: Locked tool appearance
- **WHEN** displaying a locked tool
- **THEN** the system SHALL use grayed-out styling, lock icon, and disabled interaction

#### Scenario: Unlocked tool appearance
- **WHEN** displaying an unlocked, in-progress tool
- **THEN** the system SHALL use active styling with editable controls

#### Scenario: Completed tool appearance
- **WHEN** displaying a completed tool
- **THEN** the system SHALL use success styling (e.g., green checkmark) with read-only controls

### Requirement: Accessible lock messaging
The system SHALL provide clear, accessible messages about why tools are locked and how to unlock them.

#### Scenario: Explain unlock requirements
- **WHEN** a user views a locked tool
- **THEN** the system SHALL display which lesson must be completed to unlock it

#### Scenario: Link back to LearnWorlds
- **WHEN** displaying locked tool message
- **THEN** the system SHALL include a call-to-action button "Continue Learning" that links back to the LearnWorlds course
