## ADDED Requirements

### Requirement: Sprint-specific guide storage
The system SHALL store one guru guide per sprint with a unique constraint on sprint_id to prevent duplicate guide entries.

#### Scenario: Guide record creation
- **WHEN** a guru guide is added for sprint 0
- **THEN** the system stores the file_path, file_name, and sprint_id in the guru_guides table

#### Scenario: Duplicate sprint prevention
- **WHEN** attempting to insert a second guide for sprint 0
- **THEN** the system rejects the insertion due to the unique constraint on sprint_id

### Requirement: Guide file path management
The system SHALL store the relative file path to the PDF guide file in the format "/content/guru-guides/sprint_XX_name_guru_guide.pdf".

#### Scenario: File path storage
- **WHEN** storing the WOOP guru guide
- **THEN** the system stores the path as "/content/guru-guides/sprint_00_woop_guru_guide.pdf"

#### Scenario: Path retrieval
- **WHEN** a guru accesses the dashboard for sprint 0
- **THEN** the system retrieves the file_path for sprint_id = 0

### Requirement: Guide display on dashboard
The system SHALL display the guru guide card on the dashboard when a guide exists for the current sprint.

#### Scenario: Guide card display
- **WHEN** a guide exists for the current sprint
- **THEN** the system displays a card showing the guide file_name and action buttons

#### Scenario: No guide available
- **WHEN** no guide exists for the current sprint
- **THEN** the system displays a message indicating no guide is available or hides the guide section

### Requirement: Guide download capability
The system SHALL provide a "Download Guide" button that triggers a browser download of the PDF file.

#### Scenario: Download action
- **WHEN** a guru clicks the "Download Guide" button
- **THEN** the system initiates a download of the PDF file from the stored file_path

#### Scenario: Download with correct filename
- **WHEN** downloading the WOOP guide
- **THEN** the browser saves the file with the name specified in file_name (e.g., "WOOP Guru Guide.pdf")

### Requirement: Guide preview in new tab
The system SHALL provide an "Open in New Tab" button that opens the PDF guide in a new browser tab for preview.

#### Scenario: New tab opening
- **WHEN** a guru clicks "Open in New Tab"
- **THEN** the system opens the PDF file from file_path in a new browser tab

#### Scenario: PDF rendering
- **WHEN** the PDF opens in a new tab
- **THEN** the browser's native PDF viewer displays the guide content

### Requirement: Guide metadata display
The system SHALL display the guide file name as the title of the guide card.

#### Scenario: Card title display
- **WHEN** displaying the guide card for sprint 0
- **THEN** the system shows "WOOP Guru Guide" as the card title

### Requirement: Sprint-guide mapping
The system SHALL support the following sprint-to-guide mapping:
- Sprint 0: WOOP Guru Guide
- Sprint 1: Know Thyself Guru Guide
- Sprint 2: Dream Guru Guide
- Sprint 3: Values Guru Guide
- Sprint 4: Team Guru Guide

#### Scenario: Sprint 0 guide retrieval
- **WHEN** a guru accesses sprint 0 dashboard
- **THEN** the system retrieves and displays the WOOP Guru Guide

#### Scenario: Sprint 1 guide retrieval
- **WHEN** a guru accesses sprint 1 dashboard
- **THEN** the system retrieves and displays the Know Thyself Guru Guide

#### Scenario: Sprint 3 guide retrieval
- **WHEN** a guru accesses sprint 3 dashboard
- **THEN** the system retrieves and displays the Values Guru Guide

### Requirement: PDF icon display
The system SHALL display a PDF icon or visual indicator on the guide card to clearly indicate the file type.

#### Scenario: Icon rendering
- **WHEN** the guide card is displayed
- **THEN** the system shows a PDF document icon next to the guide title

### Requirement: File accessibility validation
The system SHALL verify that the PDF file exists at the stored file_path before displaying download and preview options.

#### Scenario: Existing file access
- **WHEN** the PDF file exists at the specified path
- **THEN** the system enables both "Download Guide" and "Open in New Tab" buttons

#### Scenario: Missing file handling
- **WHEN** the PDF file does not exist at the specified path
- **THEN** the system displays an error message and disables the action buttons
