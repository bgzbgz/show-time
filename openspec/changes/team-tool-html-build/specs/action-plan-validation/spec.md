## ADDED Requirements

### Requirement: Require exactly 3 validated action items
The system SHALL enforce creation of exactly 3 action items (What/Who/When) in Step 4, each meeting validation criteria.

#### Scenario: Step 4 with no actions created
- **WHEN** user enters Step 4 for the first time
- **THEN** system SHALL display 3 empty action item forms
- **AND** "Next" button SHALL be disabled

#### Scenario: All 3 actions validated
- **WHEN** all 3 action items have valid What/Who/When values
- **THEN** "Next" button SHALL become enabled
- **AND** user can proceed to Step 5

#### Scenario: Only 2 actions completed
- **WHEN** user fills 2 action items completely but leaves 1 incomplete
- **THEN** "Next" button SHALL remain disabled
- **AND** system SHALL display validation error "Complete all 3 action items to continue"

### Requirement: Validate "What" field minimum length
The system SHALL require action descriptions to be at least 30 characters to ensure specificity.

#### Scenario: "What" with 29 characters
- **WHEN** user enters "Fix the communication issue." (29 chars)
- **THEN** system SHALL display error "Action description must be at least 30 characters"
- **AND** input border SHALL turn red

#### Scenario: "What" with exactly 30 characters
- **WHEN** user enters "Implement weekly standup meetings." (30 chars)
- **THEN** validation SHALL pass
- **AND** error message SHALL disappear

#### Scenario: "What" with 50 characters
- **WHEN** user enters "Schedule monthly retrospectives to discuss team health and improve trust" (72 chars)
- **THEN** validation SHALL pass
- **AND** character counter SHALL display "72 / 30 minimum"

#### Scenario: "What" with whitespace padding
- **WHEN** user enters "    Fix issues.    " (contains leading/trailing spaces)
- **THEN** system SHALL trim whitespace before validation
- **AND** trimmed length of "Fix issues." is 11, so validation SHALL fail

### Requirement: Enforce single-person ownership via dropdown
The system SHALL require "Who" to be a single team member selected from dropdown, preventing "All" or vague assignments.

#### Scenario: Dropdown contains only team members
- **WHEN** team has members ["Alice", "Bob", "Carol"]
- **THEN** "Who" dropdown options SHALL be ["Select person...", "Alice", "Bob", "Carol"]
- **AND** dropdown SHALL NOT include "All" or "Everyone" options

#### Scenario: Select valid team member
- **WHEN** user selects "Bob" from "Who" dropdown
- **THEN** validation SHALL pass for "Who" field
- **AND** field SHALL display selected value "Bob"

#### Scenario: No selection made
- **WHEN** user leaves "Who" dropdown at default "Select person..."
- **THEN** validation SHALL fail
- **AND** system SHALL display error "Assign action to a specific team member"

#### Scenario: Team member removed after assignment
- **WHEN** action is assigned to "Alice"
- **AND** Alice is removed from team in Step 1
- **THEN** system SHALL invalidate the action
- **AND** "Who" dropdown SHALL reset to "Select person..."

### Requirement: Enforce specific deadline via date picker
The system SHALL require "When" to be a specific future date selected from date picker, preventing "Ongoing" or past dates.

#### Scenario: Date picker allows only future dates
- **WHEN** user clicks "When" date picker on Feb 17, 2026
- **THEN** date picker minimum date SHALL be Feb 17, 2026
- **AND** past dates SHALL be disabled and unselectable

#### Scenario: Select valid future date
- **WHEN** user selects Feb 25, 2026 from date picker
- **THEN** validation SHALL pass for "When" field
- **AND** field SHALL display "2026-02-25"

#### Scenario: Select today's date
- **WHEN** today is Feb 17, 2026
- **AND** user selects Feb 17, 2026
- **THEN** validation SHALL pass (today is acceptable)

#### Scenario: Attempt to manually enter "Ongoing"
- **WHEN** user attempts to type "Ongoing" into "When" field
- **THEN** input SHALL be blocked (date picker only, no text input)
- **AND** field SHALL remain empty

#### Scenario: No date selected
- **WHEN** user leaves "When" field empty
- **THEN** validation SHALL fail
- **AND** system SHALL display error "Select a specific deadline date"

### Requirement: Display real-time validation feedback
The system SHALL provide immediate visual feedback as user fills action items.

#### Scenario: Character counter for "What" field
- **WHEN** user types in "What" field
- **THEN** system SHALL display character count below field
- **AND** counter SHALL show "X / 30 minimum" format
- **AND** counter SHALL turn green when X >= 30

#### Scenario: Validation summary at bottom
- **WHEN** user is on Step 4
- **THEN** system SHALL display validation summary "0 of 3 actions complete"
- **AND** summary SHALL update in real-time as actions are validated

#### Scenario: Individual action validation indicator
- **WHEN** action has all 3 fields validated
- **THEN** system SHALL display green checkmark next to action number
- **AND** action SHALL have subtle green border

#### Scenario: Invalid action visual indicator
- **WHEN** action has any invalid field
- **THEN** system SHALL display red warning icon next to action number
- **AND** invalid fields SHALL have red border

### Requirement: Preserve action data across navigation
The system SHALL save action items to localStorage on every change to prevent data loss.

#### Scenario: Navigate back and forth
- **WHEN** user fills 2 action items in Step 4
- **AND** navigates back to Step 3
- **AND** returns to Step 4
- **THEN** both action items SHALL be preserved with all entered data

#### Scenario: Browser refresh with partial data
- **WHEN** user has entered "What" and "Who" but not "When" for Action 1
- **AND** refreshes browser
- **THEN** system SHALL restore partial action data from localStorage
- **AND** validation state SHALL reflect incomplete "When" field

### Requirement: Prevent duplicate action assignments
The system SHOULD warn if multiple actions are assigned to the same person on the same date.

#### Scenario: Same person, different dates
- **WHEN** Action 1 assigns "Bob" with date Feb 20, 2026
- **AND** Action 2 assigns "Bob" with date Feb 25, 2026
- **THEN** no warning SHALL be displayed (different dates acceptable)

#### Scenario: Same person, same date
- **WHEN** Action 1 assigns "Bob" with date Feb 20, 2026
- **AND** Action 2 assigns "Bob" with date Feb 20, 2026
- **THEN** system SHOULD display warning "Bob has multiple actions due Feb 20, 2026 - ensure workload is realistic"
- **AND** warning SHALL be informational (not block progression)
