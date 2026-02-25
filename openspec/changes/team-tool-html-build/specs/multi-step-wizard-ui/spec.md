## ADDED Requirements

### Requirement: Implement 7-step wizard with linear progression
The system SHALL provide a wizard interface with 7 distinct steps (0-6), navigable via Back/Next buttons.

#### Scenario: Initial load starts at Step 0
- **WHEN** user loads tool for the first time
- **THEN** system SHALL display Step 0 (Cover page)
- **AND** progress indicator SHALL show step 0 of 6

#### Scenario: Navigate forward with Next button
- **WHEN** user is on Step 2
- **AND** clicks "Next" button
- **THEN** system SHALL transition to Step 3
- **AND** progress indicator SHALL update to show step 3 of 6

#### Scenario: Navigate backward with Back button
- **WHEN** user is on Step 4
- **AND** clicks "Back" button
- **THEN** system SHALL transition to Step 3
- **AND** data entered in Step 4 SHALL be preserved

#### Scenario: Back button disabled on first step
- **WHEN** user is on Step 0 (Cover)
- **THEN** "Back" button SHALL be hidden or disabled

#### Scenario: Next button disabled on last step
- **WHEN** user is on Step 6 (Final Export)
- **THEN** "Next" button SHALL be hidden or disabled

### Requirement: Display progress indicator with 7 dots
The system SHALL show progress dots at the top of each step, indicating current position and completion status.

#### Scenario: Progress dots on Step 3
- **WHEN** user is on Step 3
- **THEN** dots 0, 1, 2 SHALL be filled (completed)
- **AND** dot 3 SHALL be highlighted (current)
- **AND** dots 4, 5, 6 SHALL be unfilled (upcoming)

#### Scenario: Progress dots clickable for backward navigation
- **WHEN** user is on Step 5
- **AND** clicks on dot 2
- **THEN** system SHALL navigate to Step 2
- **AND** all data SHALL be preserved

#### Scenario: Progress dots not clickable for forward navigation
- **WHEN** user is on Step 2
- **AND** clicks on dot 5
- **THEN** system SHALL NOT navigate (forward jumps disabled)
- **AND** user SHALL remain on Step 2

### Requirement: Enforce validation gates before progression
The system SHALL block forward navigation if current step validation fails.

#### Scenario: Step 1 validation fails
- **WHEN** user is on Step 1 (Team Setup)
- **AND** team name is empty
- **AND** clicks "Next" button
- **THEN** button SHALL be disabled
- **AND** system SHALL display validation error "Enter team name to continue"

#### Scenario: Step 4 validation fails
- **WHEN** user is on Step 4 (Action Plan)
- **AND** only 2 of 3 actions are complete
- **AND** clicks "Next" button
- **THEN** button SHALL be disabled
- **AND** validation summary SHALL show "2 of 3 actions complete"

#### Scenario: Step validation passes
- **WHEN** user is on Step 1
- **AND** team name is filled
- **AND** at least 1 team member added
- **THEN** "Next" button SHALL be enabled
- **AND** user can proceed to Step 2

### Requirement: Auto-save data to localStorage on every change
The system SHALL persist all form data to localStorage immediately on any input change.

#### Scenario: Text input auto-save
- **WHEN** user types "Product Team" in team name field
- **THEN** system SHALL save to localStorage after 300ms debounce
- **AND** localStorage key SHALL be 'fasttrack_team_tool'

#### Scenario: Dropdown selection auto-save
- **WHEN** user selects "Bob" from "Who" dropdown
- **THEN** system SHALL immediately save to localStorage
- **AND** selection SHALL persist after page refresh

#### Scenario: Multi-field form auto-save
- **WHEN** user enters data in Step 4 action items
- **THEN** system SHALL save entire teamData state object to localStorage
- **AND** all 3 actions SHALL be preserved

### Requirement: Sync data to Supabase with debounced saves
The system SHALL sync teamData to Supabase after 2 seconds of inactivity.

#### Scenario: Initial Supabase save
- **WHEN** user enters email and team name in Step 1
- **AND** stops typing for 2 seconds
- **THEN** system SHALL upsert row to 'sprint_04_team' table
- **AND** row SHALL contain user_email, tool_slug: 'team', sprint_number: 4, data: teamData JSON

#### Scenario: Incremental updates
- **WHEN** user modifies action plan in Step 4
- **AND** waits 2 seconds
- **THEN** system SHALL update existing Supabase row (not create duplicate)
- **AND** updated_at timestamp SHALL reflect current time

#### Scenario: Offline mode (no Supabase)
- **WHEN** user is offline and makes changes
- **THEN** localStorage SHALL still save data
- **AND** no errors SHALL be thrown
- **AND** when connection restores, next change SHALL trigger Supabase sync

### Requirement: Restore session from localStorage on page load
The system SHALL load previously saved data from localStorage when tool opens.

#### Scenario: Fresh session (no localStorage)
- **WHEN** user opens tool for first time
- **AND** no data exists in localStorage
- **THEN** system SHALL start at Step 0 with empty teamData

#### Scenario: Resume from localStorage
- **WHEN** localStorage contains saved teamData
- **AND** user opens tool
- **THEN** system SHALL load teamData from localStorage
- **AND** system SHALL restore to last active step (if stored)

#### Scenario: Resume from Supabase (email provided)
- **WHEN** user provides email in URL parameter (?email=user@example.com)
- **AND** Supabase has saved data for that email
- **THEN** system SHALL load teamData from Supabase (overrides localStorage)
- **AND** system SHALL restore to last active step

### Requirement: Apply cognitive load optimizations to layout
The system SHALL enforce max-width 640px, single-column layout, and 32px spacing between sections.

#### Scenario: Content max-width constraint
- **WHEN** viewing any step
- **THEN** content container SHALL have max-width of 640px
- **AND** container SHALL be horizontally centered (mx-auto)

#### Scenario: Vertical spacing between sections
- **WHEN** viewing any step
- **THEN** sections SHALL have 32px spacing (space-y-8 in Tailwind)
- **AND** consistent spacing SHALL apply across all 7 steps

#### Scenario: Single column layout
- **WHEN** viewing any step
- **THEN** all inputs SHALL be stacked vertically (no multi-column grids)
- **AND** each input SHALL span full width of container

#### Scenario: Sticky footer navigation
- **WHEN** scrolling long content in a step
- **THEN** Back/Next buttons SHALL remain fixed at bottom of viewport
- **AND** buttons SHALL not scroll out of view

### Requirement: Display step-specific info boxes
The system SHALL show FastTrackInsight (yellow) or TheScience (grey) boxes with contextual guidance.

#### Scenario: FastTrackInsight box in Step 5
- **WHEN** user is on Step 5 (Commitment Lock)
- **THEN** yellow FastTrackInsight box SHALL display above commitment list
- **AND** box SHALL have background #FFF469, black left border (4px)

#### Scenario: TheScience box in Step 3
- **WHEN** user is on Step 3 (Improvement Plan)
- **THEN** grey TheScience box SHALL explain Lencioni's model
- **AND** box SHALL have background #F3F4F6, grey left border (4px)

#### Scenario: No info box if not needed
- **WHEN** user is on Step 0 (Cover)
- **THEN** no info box SHALL be displayed
- **AND** only hero text and Start button SHALL show
