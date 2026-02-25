## ADDED Requirements

### Requirement: Track individual team member commitments
The system SHALL maintain commitment status for each team member, requiring explicit digital sign-off before workflow completion.

#### Scenario: Initial commitment state
- **WHEN** user reaches Step 5 (Commitment Lock) for the first time
- **THEN** all team members SHALL have commitment status "not committed"
- **AND** "Continue to Export" button SHALL be disabled

#### Scenario: Single team member commits
- **WHEN** team member "Alice Johnson" clicks "I Commit" button
- **THEN** system SHALL update Alice's commitment status to "committed"
- **AND** system SHALL record timestamp of commitment
- **AND** Alice's button SHALL change to "✓ Committed" and be disabled

#### Scenario: Partial commitment progress
- **WHEN** 3 of 5 team members have committed
- **THEN** progress counter SHALL display "3 of 5 committed"
- **AND** "Continue to Export" button SHALL remain disabled

#### Scenario: 100% commitment reached
- **WHEN** all team members have clicked "I Commit"
- **THEN** progress counter SHALL display "5 of 5 committed"
- **AND** "Continue to Export" button SHALL become enabled
- **AND** system SHALL save all commitment timestamps to Supabase

### Requirement: Prevent progression without full commitment
The system SHALL block navigation to Step 6 (Export) until all team members have committed.

#### Scenario: Attempt to advance with partial commitment
- **WHEN** only 2 of 4 team members have committed
- **AND** user clicks "Continue to Export" button
- **THEN** button SHALL be disabled (not clickable)

#### Scenario: Allow progression after full commitment
- **WHEN** all 4 team members have committed
- **AND** user clicks "Continue to Export" button
- **THEN** system SHALL advance to Step 6

#### Scenario: Back navigation allowed regardless of commitment
- **WHEN** user is on Step 5 with partial commitment
- **AND** user clicks "Back" button
- **THEN** system SHALL allow navigation to Step 4
- **AND** commitment state SHALL be preserved

### Requirement: Persist commitment data across sessions
The system SHALL save commitment status to localStorage and Supabase for recovery.

#### Scenario: Page refresh with partial commitments
- **WHEN** 3 of 5 team members have committed
- **AND** user refreshes browser page
- **THEN** system SHALL restore commitment state from localStorage
- **AND** 3 committed buttons SHALL show "✓ Committed"
- **AND** 2 uncommitted buttons SHALL show "I Commit"

#### Scenario: Resume on different device via Supabase
- **WHEN** user saves session to Supabase with 4 of 6 commitments
- **AND** user loads session on different device via email
- **THEN** system SHALL restore all 4 commitments from Supabase data
- **AND** progress counter SHALL show "4 of 6 committed"

### Requirement: Display social proof to encourage commitment
The system SHALL visually indicate commitment progress to create group accountability.

#### Scenario: Progress counter updates in real-time
- **WHEN** each team member commits
- **THEN** progress counter SHALL increment immediately
- **AND** counter SHALL display "X of Y committed" format

#### Scenario: Visual differentiation of committed vs uncommitted
- **WHEN** viewing Step 5 commitment list
- **THEN** committed members SHALL have green checkmark icon
- **AND** uncommitted members SHALL have grey "I Commit" button
- **AND** committed member rows SHALL have subtle green background (#F0FDF4)

#### Scenario: FastTrackInsight box explains commitment requirement
- **WHEN** user enters Step 5
- **THEN** yellow FastTrackInsight box SHALL display above commitment list
- **AND** message SHALL state "Each team member must digitally sign off on these actions. The session cannot be marked complete until 100% commit."

### Requirement: Include commitment signatures in PDF export
The system SHALL embed commitment timestamps in final PDF output.

#### Scenario: PDF includes commitment section
- **WHEN** user exports PDF after 100% commitment
- **THEN** PDF SHALL include page titled "Team Commitment"
- **AND** page SHALL list all team members with checkmarks
- **AND** page SHALL display timestamp for each commitment

#### Scenario: Commitment timestamp format
- **WHEN** Alice commits on Feb 17, 2026 at 14:32:15
- **THEN** PDF SHALL display "Alice Johnson - Committed on Feb 17, 2026 at 2:32 PM"

### Requirement: Handle edge case of zero team members
The system SHALL prevent commitment lock step if no team members exist.

#### Scenario: No team members added
- **WHEN** user advances to Step 5 without adding any team members
- **THEN** system SHALL display error "Cannot proceed: No team members added"
- **AND** system SHALL disable Step 5 and force return to Step 1

#### Scenario: All team members removed before commitment
- **WHEN** user adds 3 team members, then removes all 3
- **AND** user attempts to reach Step 5
- **THEN** system SHALL block navigation with error "Add at least 1 team member to continue"
