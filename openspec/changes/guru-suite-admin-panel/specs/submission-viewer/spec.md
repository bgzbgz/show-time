## ADDED Requirements

### Requirement: Submission access restriction
The system SHALL allow gurus to view submissions only for team members who have completed status for the current sprint.

#### Scenario: View button for completed members
- **WHEN** a team member has status "completed"
- **THEN** the system displays a "View Submission" button in the ACTIONS column

#### Scenario: No view button for incomplete members
- **WHEN** a team member has status "in_progress" or "not_started"
- **THEN** the system does NOT display a "View Submission" button for that member

### Requirement: Modal-based submission display
The system SHALL display individual submissions in a modal overlay that appears on top of the dashboard without navigating away from the page.

#### Scenario: Modal opening
- **WHEN** a guru clicks "View Submission" for a completed team member
- **THEN** the system opens a modal overlay displaying that member's submission data

#### Scenario: Modal closing
- **WHEN** a guru clicks the close button (X) or clicks outside the modal
- **THEN** the system closes the modal and returns focus to the dashboard

### Requirement: Member identification in modal
The system SHALL display the team member's full name as a header in the submission modal.

#### Scenario: Member name display
- **WHEN** viewing Paolo Bianchi's submission
- **THEN** the modal header displays "Paolo Bianchi"

### Requirement: WOOP field display
The system SHALL display all WOOP submission fields in a formatted, readable layout with clear section labels.

#### Scenario: Complete WOOP display
- **WHEN** viewing a completed WOOP submission
- **THEN** the system displays the following sections in order: WISH, OUTCOME, INTERNAL OBSTACLE, EXTERNAL OBSTACLE, IF-THEN PLAN, COMMITMENT LEVEL, FIRST ACTION, REFLECTION

#### Scenario: Section formatting
- **WHEN** displaying each WOOP section
- **THEN** the system uses uppercase section headers and displays the submitted text content below each header

### Requirement: Commitment level formatting
The system SHALL display the commitment level field as a fraction out of 10 (e.g., "9/10") rather than as a raw number.

#### Scenario: Commitment level display
- **WHEN** a team member submitted a commitment level of "9"
- **THEN** the system displays "9/10" in the COMMITMENT LEVEL section

#### Scenario: Full commitment display
- **WHEN** a team member submitted a commitment level of "10"
- **THEN** the system displays "10/10" in the COMMITMENT LEVEL section

### Requirement: Visual section differentiation
The system SHALL use a yellow left border (#FFF469) on the WISH section to create visual hierarchy and draw attention to the primary goal.

#### Scenario: WISH section styling
- **WHEN** displaying the WISH section
- **THEN** the system applies a 4px solid yellow (#FFF469) left border to distinguish it from other sections

### Requirement: Read-only access
The system SHALL display submission data in read-only format without any ability to edit, modify, or delete the submission content.

#### Scenario: No edit controls
- **WHEN** viewing any submission
- **THEN** the system displays no input fields, edit buttons, save buttons, or delete buttons

#### Scenario: Text selection allowed
- **WHEN** viewing submission content
- **THEN** the system allows text selection and copying but prevents any modifications

### Requirement: Access authorization validation
The system SHALL verify that the requested submission belongs to a team member of the guru's organization before displaying it.

#### Scenario: Same organization access
- **WHEN** a guru for Luxottica requests a submission from a Luxottica team member
- **THEN** the system displays the submission

#### Scenario: Cross-organization access denial
- **WHEN** a guru attempts to access a submission from a team member of a different organization
- **THEN** the system returns a 403 Forbidden error and does not display the submission

#### Scenario: Non-existent user handling
- **WHEN** a guru requests a submission for a user ID that does not exist
- **THEN** the system returns an error message and does not display a modal

### Requirement: Submission data retrieval
The system SHALL retrieve submission data from the tool_submissions table filtered by user_id and sprint_id.

#### Scenario: Successful data retrieval
- **WHEN** fetching submission for user "aaaa1111-1111-1111-1111-111111111111" and sprint 0
- **THEN** the system retrieves the submission_data JSONB field from tool_submissions table

#### Scenario: Missing submission handling
- **WHEN** a user is marked as completed but has no submission record in the database
- **THEN** the system displays an error message indicating the submission data is unavailable
