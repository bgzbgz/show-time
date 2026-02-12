## ADDED Requirements

### Requirement: View Summary Button Display
The dashboard SHALL display "VIEW SUMMARY" button only for completed tools.

#### Scenario: View summary button appears on completed tools
- **WHEN** a tool has status "completed"
- **THEN** "VIEW SUMMARY" button SHALL be visible on the tool card
- **AND** button SHALL be positioned alongside or near "LAUNCH" button
- **AND** button SHALL be enabled and clickable

#### Scenario: View summary button hidden for incomplete tools
- **WHEN** a tool has status "locked", "unlocked", or "in_progress"
- **THEN** "VIEW SUMMARY" button SHALL NOT be visible
- **AND** only "LAUNCH" button SHALL be shown

#### Scenario: View summary button styling
- **WHEN** "VIEW SUMMARY" button renders
- **THEN** it SHALL follow Fast Track brand guidelines
- **AND** button SHALL be distinct from "LAUNCH" button
- **AND** text SHALL be bold and commanding ("VIEW SUMMARY", not "See results")

### Requirement: Summary Modal Display
The dashboard SHALL display tool summaries in a modal overlay.

#### Scenario: Modal opens on button click
- **WHEN** user clicks "VIEW SUMMARY" button
- **THEN** a modal overlay SHALL appear over the dashboard
- **AND** modal SHALL display tool summary data
- **AND** dashboard background SHALL be dimmed or blurred

#### Scenario: Modal structure
- **WHEN** summary modal renders
- **THEN** it SHALL include:
  - Modal header with tool name and sprint number
  - Close button (X icon or "CLOSE" text)
  - Content area with formatted tool output
  - Optional "RELAUNCH TOOL" button at bottom

#### Scenario: Modal styling
- **WHEN** modal is displayed
- **THEN** it SHALL follow Fast Track brand guidelines
- **AND** background SHALL be white or black with appropriate contrast
- **AND** typography SHALL use Plaak for title, Riforma for content
- **AND** modal SHALL be centered on screen

### Requirement: Tool Data Fetching
The dashboard SHALL fetch completed tool data from backend API on-demand.

#### Scenario: Data fetched when modal opens
- **WHEN** user clicks "VIEW SUMMARY" for a tool
- **THEN** dashboard SHALL call GET `/api/tools/{slug}/data` endpoint
- **AND** request SHALL include authentication token
- **AND** response SHALL contain completed tool data

#### Scenario: Loading state during fetch
- **WHEN** tool data is being fetched
- **THEN** modal SHALL display loading indicator
- **AND** indicator SHALL show "Loading summary..." message
- **AND** modal content SHALL not be visible until data loads

#### Scenario: Cached data reuse
- **WHEN** user opens summary for same tool multiple times
- **THEN** dashboard MAY use cached data from previous fetch
- **AND** cache SHALL be stored in component state
- **AND** cache SHALL be valid for current session only

### Requirement: Tool Data Formatting
The dashboard SHALL format and display tool output data in readable format.

#### Scenario: JSON data formatting
- **WHEN** tool data is in JSON format
- **THEN** dashboard SHALL parse and format it as readable structure
- **AND** nested objects SHALL be indented appropriately
- **AND** key-value pairs SHALL be clearly labeled

#### Scenario: HTML content rendering
- **WHEN** tool data includes HTML content
- **THEN** dashboard SHALL render HTML safely
- **AND** XSS protection SHALL be enforced (sanitize HTML)
- **AND** styling SHALL be scoped to modal only

#### Scenario: Plain text display
- **WHEN** tool data is plain text
- **THEN** dashboard SHALL display it in formatted text area
- **AND** line breaks and spacing SHALL be preserved
- **AND** text SHALL be readable with appropriate font sizing

#### Scenario: Mixed content handling
- **WHEN** tool data contains multiple formats (text, images, links)
- **THEN** dashboard SHALL render each element appropriately
- **AND** layout SHALL be clear and organized
- **AND** content SHALL be vertically scrollable if needed

### Requirement: Modal Close Functionality
The dashboard SHALL provide multiple ways to close the summary modal.

#### Scenario: Close button clicked
- **WHEN** user clicks close button in modal header
- **THEN** modal SHALL close immediately
- **AND** dashboard view SHALL be restored
- **AND** no summary data SHALL remain visible

#### Scenario: Overlay clicked
- **WHEN** user clicks outside modal (on dimmed background)
- **THEN** modal SHALL close
- **AND** dashboard SHALL return to normal state

#### Scenario: Escape key pressed
- **WHEN** user presses Escape key while modal is open
- **THEN** modal SHALL close
- **AND** keyboard accessibility SHALL be maintained

#### Scenario: Navigation away from dashboard
- **WHEN** user navigates away (e.g., clicks "LAUNCH")
- **THEN** modal SHALL close automatically
- **AND** no modal state SHALL persist on navigation

### Requirement: Error Handling for Summary Fetch
The dashboard SHALL handle errors when fetching tool summary data.

#### Scenario: Network error during fetch
- **WHEN** `/api/tools/{slug}/data` request fails due to network issue
- **THEN** modal SHALL display error message "Unable to load summary. Please try again."
- **AND** retry button SHALL be provided
- **AND** close button SHALL allow user to exit modal

#### Scenario: 404 tool data not found
- **WHEN** backend returns 404 for tool data
- **THEN** modal SHALL display "Summary not available for this tool."
- **AND** user SHALL be informed that data may not exist yet
- **AND** close button SHALL dismiss modal

#### Scenario: 401 authentication error
- **WHEN** backend returns 401 during summary fetch
- **THEN** modal SHALL close
- **AND** user SHALL be redirected to authentication flow
- **AND** token SHALL be refreshed or re-validated

#### Scenario: 500 server error
- **WHEN** backend returns 500 server error
- **THEN** modal SHALL display generic error message
- **AND** user SHALL be able to close modal and retry later
- **AND** error SHALL be logged for debugging

### Requirement: Summary Content Display
The dashboard SHALL display key outputs and data from completed tools.

#### Scenario: Tool outputs rendered
- **WHEN** summary data is loaded
- **THEN** modal SHALL display all key outputs from the tool
- **AND** outputs SHALL be organized by section or category
- **AND** each output SHALL be clearly labeled

#### Scenario: Tool responses formatted
- **WHEN** tool collected user responses (form inputs, selections)
- **THEN** summary SHALL display question-answer pairs
- **AND** format SHALL be: "Question: [text]" followed by "Answer: [text]"
- **AND** layout SHALL be readable and scannable

#### Scenario: Generated content displayed
- **WHEN** tool generated content (reports, charts, recommendations)
- **THEN** summary SHALL render generated content
- **AND** formatting SHALL match tool's original output
- **AND** visual elements SHALL be preserved if applicable

### Requirement: Relaunch Tool from Modal
The dashboard SHALL allow users to relaunch tool directly from summary modal.

#### Scenario: Relaunch button in modal
- **WHEN** summary modal is displayed
- **THEN** a "RELAUNCH TOOL" button MAY be present at bottom
- **AND** clicking button SHALL navigate to tool page
- **AND** modal SHALL close automatically on navigation

#### Scenario: Relaunch vs Launch behavior
- **WHEN** user relaunches a completed tool
- **THEN** behavior SHALL be identical to clicking "LAUNCH" button
- **AND** tool SHALL load with completed data
- **AND** user SHALL be able to review or edit

### Requirement: Modal Accessibility
The dashboard SHALL ensure summary modal is accessible to all users.

#### Scenario: Focus management
- **WHEN** modal opens
- **THEN** keyboard focus SHALL move to modal
- **AND** focus SHALL be trapped within modal (cannot tab to dashboard)
- **AND** when modal closes, focus SHALL return to "VIEW SUMMARY" button

#### Scenario: Screen reader support
- **WHEN** modal is open
- **THEN** screen reader SHALL announce modal title
- **AND** modal content SHALL be readable by screen readers
- **AND** close button SHALL be clearly labeled (e.g., "Close summary")

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard
- **THEN** Tab key SHALL move between interactive elements in modal
- **AND** Escape key SHALL close modal
- **AND** Enter key on close button SHALL close modal

### Requirement: Modal Performance
The dashboard SHALL ensure summary modal loads and displays efficiently.

#### Scenario: Fast modal open
- **WHEN** user clicks "VIEW SUMMARY"
- **THEN** modal SHALL appear within 100ms
- **AND** loading indicator SHALL be immediate
- **AND** perceived performance SHALL be fast

#### Scenario: Large data handling
- **WHEN** tool summary contains large amount of data
- **THEN** modal SHALL render efficiently without lag
- **AND** scrolling SHALL be smooth
- **AND** data SHALL be paginated or truncated if necessary

#### Scenario: Modal animation
- **WHEN** modal opens or closes
- **THEN** smooth fade-in/fade-out animation MAY be applied
- **AND** animation SHALL be quick (200-300ms)
- **AND** animation SHALL not delay user interaction

### Requirement: No Summary Available State
The dashboard SHALL handle cases where completed tools have no summary data.

#### Scenario: Empty summary data
- **WHEN** `/api/tools/{slug}/data` returns empty or null data
- **THEN** modal SHALL display "No summary available for this tool."
- **AND** user SHALL understand no data exists
- **AND** close button SHALL dismiss modal

#### Scenario: Tool without summary support
- **WHEN** some tools do not generate summary data
- **THEN** "VIEW SUMMARY" button MAY be hidden even if completed
- **AND** backend SHALL indicate summary availability in tool metadata
- **AND** dashboard SHALL respect this flag
