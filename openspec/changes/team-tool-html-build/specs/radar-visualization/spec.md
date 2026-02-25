## ADDED Requirements

### Requirement: Render 5-axis radar chart with team dysfunction scores
The system SHALL generate an interactive radar chart using Chart.js with 5 axes representing the 5 dysfunctions, plotted with team average scores.

#### Scenario: Standard team scores
- **WHEN** team scores are [Trust: 6, Conflict: 7, Commitment: 5, Accountability: 8, Results: 4]
- **THEN** system SHALL render radar chart with 5 axes labeled "Absence of Trust", "Fear of Conflict", "Lack of Commitment", "Avoidance of Accountability", "Inattention to Results"
- **AND** each axis SHALL display corresponding team score

#### Scenario: Chart initialization on Step 2
- **WHEN** user navigates to Step 2 (Team Summary)
- **THEN** system SHALL initialize Chart.js radar chart in canvas element
- **AND** chart SHALL render within 1 second

#### Scenario: Chart updates when scores change
- **WHEN** user goes back to Step 1 and modifies individual assessments
- **THEN** system SHALL recalculate team scores
- **AND** chart SHALL automatically update when returning to Step 2

### Requirement: Apply Fast Track visual design to radar chart
The system SHALL style the radar chart with Fast Track brand colors and typography.

#### Scenario: Chart fill and border colors
- **WHEN** radar chart is rendered
- **THEN** chart background fill SHALL be yellow rgba(255, 244, 105, 0.2)
- **AND** chart border SHALL be black #000000 with width 2px

#### Scenario: Chart scale range
- **WHEN** radar chart is rendered
- **THEN** radial scale SHALL start at 0 and end at 10
- **AND** scale SHALL display gridlines at intervals of 2 (0, 2, 4, 6, 8, 10)

#### Scenario: Chart responsiveness
- **WHEN** viewport width is less than 640px
- **THEN** chart SHALL resize to fit container width
- **AND** aspect ratio SHALL remain 1:1 (square)

### Requirement: Enable interactive tooltips on hover
The system SHALL display tooltips when user hovers over chart data points.

#### Scenario: Hover over data point
- **WHEN** user hovers mouse over any axis point on radar chart
- **THEN** system SHALL display tooltip with format "<Dysfunction Name>: <Score>"
- **AND** tooltip SHALL appear within 200ms of hover

#### Scenario: Tooltip for Trust axis
- **WHEN** user hovers over Trust axis point with score 7.5
- **THEN** tooltip SHALL display "Absence of Trust: 7.5"

#### Scenario: No tooltip when not hovering
- **WHEN** user moves mouse away from chart
- **THEN** tooltip SHALL disappear

### Requirement: Handle edge cases in chart rendering
The system SHALL gracefully handle missing or invalid data when rendering radar chart.

#### Scenario: Missing team scores
- **WHEN** user navigates to Step 2 before entering any individual assessments
- **THEN** system SHALL display message "Add team members and assessments to see radar chart"
- **AND** chart canvas SHALL remain empty

#### Scenario: Partial team scores
- **WHEN** team has scores for only 3 of 5 dysfunctions
- **THEN** system SHALL NOT render chart
- **AND** system SHALL display error "Incomplete data: all 5 dysfunctions required"

#### Scenario: All scores are zero
- **WHEN** all team scores are 0.0
- **THEN** system SHALL render chart with center point (no visible polygon)
- **AND** chart SHALL display normally without errors

### Requirement: Export chart as image for PDF inclusion
The system SHALL capture radar chart as image for PDF export.

#### Scenario: Chart capture for PDF
- **WHEN** user clicks "Export PDF" button in Step 6
- **THEN** system SHALL convert chart canvas to PNG image using html2canvas
- **AND** image SHALL maintain 600x600px minimum resolution

#### Scenario: Chart visibility during capture
- **WHEN** system captures chart for PDF
- **THEN** chart MUST be visible in DOM (not display: none)
- **AND** Chart.js instance MUST be fully rendered before capture
