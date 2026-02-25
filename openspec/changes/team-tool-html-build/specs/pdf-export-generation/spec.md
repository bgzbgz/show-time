## ADDED Requirements

### Requirement: Generate multi-page PDF with team analysis
The system SHALL export a formatted PDF document containing cover page, team summary, radar chart, improvement plan, action plan, and commitment signatures.

#### Scenario: PDF structure
- **WHEN** user clicks "Export PDF" button in Step 6
- **THEN** system SHALL generate PDF with following pages in order:
  1. Cover page (team name, date, Fast Track branding)
  2. Team summary (roster + dysfunction scores table)
  3. Radar chart visualization (full page)
  4. Improvement plan (top 3 dysfunctions + notes)
  5. Action plan (3 WWW actions in table format)
  6. Commitment signatures (all team members + timestamps)

#### Scenario: PDF filename format
- **WHEN** PDF is generated for team "Product Team" on Feb 17, 2026
- **THEN** filename SHALL be "FastTrack_Team_ProductTeam_2026-02-17.pdf"
- **AND** spaces in team name SHALL be removed

#### Scenario: PDF download triggers automatically
- **WHEN** PDF generation completes
- **THEN** browser SHALL automatically download PDF file
- **AND** user SHALL remain on Step 6 (no navigation)

### Requirement: Include Fast Track branding on cover page
The system SHALL apply Fast Track visual identity to PDF cover page.

#### Scenario: Cover page typography
- **WHEN** generating PDF cover
- **THEN** title SHALL use Plaak font at 32pt, black
- **AND** subtitle SHALL use Riforma font at 16pt, grey

#### Scenario: Cover page logo
- **WHEN** generating PDF cover
- **THEN** Fast Track logo SHALL be centered at top
- **AND** logo SHALL be 200px wide

#### Scenario: Cover page metadata
- **WHEN** generating PDF cover
- **THEN** page SHALL include team name
- **AND** page SHALL include generation date in format "February 17, 2026"
- **AND** page SHALL include text "5 Dysfunctions of a Team - Workshop Results"

### Requirement: Render dysfunction scores table in PDF
The system SHALL format team dysfunction scores as a table with color-coded severity indicators.

#### Scenario: Scores table structure
- **WHEN** generating PDF summary page
- **THEN** table SHALL have 3 columns: Dysfunction | Score | Status
- **AND** all 5 dysfunctions SHALL be listed in order: Trust, Conflict, Commitment, Accountability, Results

#### Scenario: Color-coded status badges in PDF
- **WHEN** dysfunction score is 3.5 (green/Strength)
- **THEN** PDF SHALL render green circle with text "Strength"
- **AND** when dysfunction score is 5.5 (yellow/Opportunity)
- **THEN** PDF SHALL render yellow circle with text "Opportunity"
- **AND** when dysfunction score is 8.0 (red/Priority)
- **THEN** PDF SHALL render red circle with text "Priority"

#### Scenario: Scores rounded to 1 decimal
- **WHEN** team score is 7.666666
- **THEN** PDF SHALL display "7.7"

### Requirement: Embed radar chart image in PDF
The system SHALL capture radar chart canvas as PNG and embed in PDF at high resolution.

#### Scenario: Chart capture resolution
- **WHEN** capturing radar chart for PDF
- **THEN** system SHALL use html2canvas with scale: 2
- **AND** resulting image SHALL be minimum 600x600px

#### Scenario: Chart placement in PDF
- **WHEN** adding chart to PDF
- **THEN** chart SHALL be centered on page 3
- **AND** chart SHALL maintain square aspect ratio
- **AND** page SHALL have title "Team Dysfunction Profile" above chart

#### Scenario: Chart capture timing
- **WHEN** generating PDF
- **THEN** system SHALL ensure Chart.js has fully rendered before capturing
- **AND** if chart not rendered, system SHALL display error "Chart not ready - return to Step 2 first"

### Requirement: Format action plan as table in PDF
The system SHALL display all 3 action items in structured table format.

#### Scenario: Action plan table structure
- **WHEN** generating PDF action plan page
- **THEN** table SHALL have 4 columns: # | What | Who | When
- **AND** all 3 actions SHALL be numbered 1, 2, 3

#### Scenario: Action text wrapping
- **WHEN** "What" description exceeds 80 characters
- **THEN** text SHALL wrap to multiple lines in PDF cell
- **AND** row height SHALL expand to fit content

#### Scenario: Date formatting in PDF
- **WHEN** action "When" is 2026-02-25
- **THEN** PDF SHALL display "Feb 25, 2026" (formatted)

### Requirement: Include commitment signatures with timestamps
The system SHALL list all team member commitments with digital signature timestamps.

#### Scenario: Commitment list format
- **WHEN** generating PDF commitment page
- **THEN** each team member SHALL have row with checkmark icon
- **AND** row SHALL display: ✓ [Member Name] - Committed on [Date] at [Time]

#### Scenario: Timestamp format
- **WHEN** Alice committed on Feb 17, 2026 at 14:32:15
- **THEN** PDF SHALL display "✓ Alice Johnson - Committed on Feb 17, 2026 at 2:32 PM"

#### Scenario: All commitments present
- **WHEN** generating PDF
- **AND** 100% commitment lock reached in Step 5
- **THEN** all team members SHALL appear in commitment list
- **AND** page SHALL include footer "100% Team Commitment Achieved"

### Requirement: Handle PDF generation errors gracefully
The system SHALL provide clear error messages if PDF export fails.

#### Scenario: jsPDF library not loaded
- **WHEN** user clicks "Export PDF"
- **AND** jsPDF library failed to load from CDN
- **THEN** system SHALL display error "PDF export unavailable - check internet connection"

#### Scenario: html2canvas fails to capture chart
- **WHEN** generating PDF
- **AND** html2canvas returns null for chart canvas
- **THEN** system SHALL skip chart page
- **AND** system SHALL display warning "Chart could not be included in PDF"

#### Scenario: Missing required data
- **WHEN** user attempts PDF export
- **AND** teamData is incomplete (e.g., no team name)
- **THEN** system SHALL display error "Cannot export: Complete all steps first"
- **AND** "Export PDF" button SHALL be disabled

### Requirement: Display loading state during PDF generation
The system SHALL show progress indicator while generating PDF (process can take 10-30 seconds).

#### Scenario: Loading spinner appears
- **WHEN** user clicks "Export PDF"
- **THEN** system SHALL display loading spinner overlay
- **AND** overlay SHALL show message "Generating PDF... this may take 30 seconds"

#### Scenario: Button disabled during generation
- **WHEN** PDF generation is in progress
- **THEN** "Export PDF" button SHALL be disabled
- **AND** button text SHALL change to "Generating..."

#### Scenario: Loading state clears after success
- **WHEN** PDF generation completes successfully
- **THEN** loading spinner SHALL disappear
- **AND** button SHALL return to "Export PDF"
- **AND** success message SHALL display "PDF downloaded successfully"

#### Scenario: Loading state clears after error
- **WHEN** PDF generation fails
- **THEN** loading spinner SHALL disappear
- **AND** error message SHALL display with reason
- **AND** button SHALL re-enable for retry
