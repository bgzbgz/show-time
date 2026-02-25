## ADDED Requirements

### Requirement: Meeting notes storage
The system SHALL store meeting notes as structured JSONB data with fields for discussion_points, key_insights, concerns, and next_steps.

#### Scenario: Notes content structure
- **WHEN** a guru saves meeting notes
- **THEN** the system stores the data in the notes_content JSONB field with structured key-value pairs

#### Scenario: Empty notes handling
- **WHEN** no notes have been saved for an organization-sprint combination
- **THEN** the system initializes an empty JSONB object ({}) in the notes_content field

### Requirement: Action items tracking
The system SHALL store action items as a JSONB array where each item contains task, assignee, due date, and status fields.

#### Scenario: Action item creation
- **WHEN** a guru adds a new action item with task "Follow up with Elena", assignee "Maria Rossi", due date "2024-02-15", and status "pending"
- **THEN** the system appends a new item to the action_items JSONB array with all four fields

#### Scenario: Action item status update
- **WHEN** a guru marks an action item as "completed"
- **THEN** the system updates the status field of that item in the JSONB array

#### Scenario: Empty action items
- **WHEN** no action items exist for a meeting
- **THEN** the system stores an empty array ([]) in the action_items field

### Requirement: Organization-sprint uniqueness
The system SHALL ensure only one meeting notes record exists per organization-sprint combination using a unique constraint.

#### Scenario: First notes creation
- **WHEN** a guru saves notes for an organization-sprint that has no existing notes
- **THEN** the system creates a new record with the provided data

#### Scenario: Notes update on duplicate
- **WHEN** a guru saves notes for an organization-sprint that already has existing notes
- **THEN** the system updates the existing record rather than creating a duplicate

### Requirement: Meeting date tracking
The system SHALL allow gurus to specify and store the meeting date associated with the notes.

#### Scenario: Meeting date storage
- **WHEN** a guru selects February 11, 2024 as the meeting date
- **THEN** the system stores "2024-02-11" in the meeting_date DATE field

#### Scenario: No meeting date
- **WHEN** a guru does not specify a meeting date
- **THEN** the system allows the meeting_date field to be NULL

### Requirement: Notes persistence and retrieval
The system SHALL automatically load existing meeting notes when a guru accesses the dashboard for an organization-sprint that has saved notes.

#### Scenario: Existing notes display
- **WHEN** a guru for Luxottica accesses the sprint 0 dashboard and notes exist
- **THEN** the system populates the meeting notes section with the saved notes_content and action_items

#### Scenario: No existing notes
- **WHEN** a guru accesses a dashboard with no saved meeting notes
- **THEN** the system displays empty input fields and an empty action items list

### Requirement: Autosave functionality
The system SHALL provide a "Save Notes" button that persists all meeting notes and action items to the database.

#### Scenario: Successful save
- **WHEN** a guru clicks "Save Notes" after editing content
- **THEN** the system sends an upsert request to the backend and displays a success confirmation

#### Scenario: Save with validation
- **WHEN** a guru attempts to save notes without authentication
- **THEN** the system returns an error and does not persist the data

### Requirement: Last saved timestamp
The system SHALL display the timestamp of when meeting notes were last saved.

#### Scenario: Timestamp display after save
- **WHEN** notes are successfully saved
- **THEN** the system displays "Last saved: [timestamp]" below the save button

#### Scenario: No previous save
- **WHEN** no notes have been saved yet
- **THEN** the system displays "Not saved yet" or hides the timestamp display

### Requirement: Action item status toggle
The system SHALL allow gurus to toggle action item status between "pending" and "completed" using checkboxes.

#### Scenario: Mark item as completed
- **WHEN** a guru clicks the checkbox next to a pending action item
- **THEN** the system updates the item status to "completed" and applies completed styling

#### Scenario: Mark item as pending
- **WHEN** a guru unchecks a completed action item
- **THEN** the system updates the item status back to "pending" and removes completed styling

### Requirement: Action item addition
The system SHALL provide an "Add Item" button that allows gurus to add new action items with task description, assignee, and due date.

#### Scenario: Add new action item
- **WHEN** a guru clicks "Add Item" and enters task details
- **THEN** the system adds a new item to the action_items array with status "pending"

#### Scenario: Add item validation
- **WHEN** a guru attempts to add an action item without a task description
- **THEN** the system displays a validation error and does not add the item

### Requirement: Collapsible notes panel
The system SHALL display meeting notes in a collapsible panel that can be expanded or collapsed to manage screen space.

#### Scenario: Panel expansion
- **WHEN** a guru clicks the meeting notes section header
- **THEN** the system expands the panel to show all notes content and action items

#### Scenario: Panel collapse
- **WHEN** a guru clicks the header of an expanded meeting notes section
- **THEN** the system collapses the panel to show only the header

#### Scenario: Default state
- **WHEN** a guru first loads the dashboard
- **THEN** the system displays the meeting notes panel in an expanded state if notes exist, collapsed if empty
