# Progress Tracking

## ADDED Requirements

### Requirement: User Progress Initialization

The system SHALL initialize progress tracking for new users with all tools except Sprint 0 locked.

#### Scenario: New user progress created

- **WHEN** new user record is created via SSO
- **THEN** system creates 31 entries in shared.user_progress (one per tool from Sprint 0 to Sprint 30)
- **AND** Sprint 0 (WOOP) has status "unlocked" and unlocked_at timestamp
- **AND** all other sprints (1-30) have status "locked" and null unlocked_at
- **AND** all entries have user_id referencing the new user

#### Scenario: Progress percentage initialized to zero

- **WHEN** user progress entries are created
- **THEN** all progress_percentage values are 0
- **AND** started_at and completed_at are null

### Requirement: Tool Status Transitions

The system SHALL track tool completion status through defined lifecycle states.

#### Scenario: Valid status transitions

- **WHEN** user progresses through tool
- **THEN** status transitions follow valid sequence: locked → unlocked → in_progress → completed
- **AND** system records timestamp for each transition (unlocked_at, started_at, completed_at)
- **AND** system prevents invalid transitions (e.g., locked → completed)

#### Scenario: User starts unlocked tool

- **WHEN** user creates first submission for unlocked tool
- **THEN** system updates user_progress status from "unlocked" to "in_progress"
- **AND** system records started_at timestamp
- **AND** progress_percentage remains 0 until user saves data

#### Scenario: User completes tool

- **WHEN** user submits completed tool via `/api/tools/{slug}/submit`
- **THEN** system updates user_progress status to "completed"
- **AND** system records completed_at timestamp
- **AND** system sets progress_percentage to 100
- **AND** system triggers unlock check for dependent tools

### Requirement: Automatic Tool Unlocking

The system SHALL automatically unlock dependent tools when prerequisite tools are completed.

#### Scenario: Unlock single dependent tool

- **WHEN** user completes Sprint 1 (Know Thyself)
- **THEN** system checks which tools depend on Sprint 1 outputs
- **AND** system finds Sprint 2 (Dream) depends on Sprint 1
- **AND** system updates Sprint 2 status to "unlocked" in user_progress
- **AND** system records unlocked_at timestamp

#### Scenario: Multiple tools unlock simultaneously

- **WHEN** user completes tool that unlocks multiple downstream tools
- **THEN** system updates all dependent tools' status to "unlocked" in single transaction
- **AND** all unlocked_at timestamps are identical

#### Scenario: Tool requires multiple prerequisites

- **WHEN** tool requires multiple prerequisites and user completes one of them
- **THEN** system checks if ALL prerequisites are now completed
- **AND** IF all prerequisites are complete, system unlocks the tool
- **AND** IF any prerequisite is incomplete, tool remains locked

### Requirement: Progress Percentage Calculation

The system SHALL calculate and update progress percentage based on tool completion within submissions.

#### Scenario: Progress updates on auto-save

- **WHEN** user saves draft submission with partial data
- **THEN** system calculates percentage of required fields that have non-null values
- **AND** system updates user_progress.progress_percentage
- **AND** progress is rounded to nearest integer

#### Scenario: Progress reaches 100 on completion

- **WHEN** user submits tool via `/api/tools/{slug}/submit`
- **THEN** system sets progress_percentage to 100
- **AND** status transitions to "completed"

#### Scenario: Optional fields don't affect progress

- **WHEN** calculating progress percentage
- **THEN** system only counts required fields defined in tool schema
- **AND** optional fields are excluded from calculation

### Requirement: Overall User Progress Summary

The system SHALL provide aggregated progress information across all tools.

#### Scenario: Get user's overall progress

- **WHEN** client requests `/api/user/progress`
- **THEN** system returns summary including:
  - total_tools: 31
  - completed_tools: count of tools with status "completed"
  - in_progress_tools: count of tools with status "in_progress"
  - unlocked_tools: count of tools with status "unlocked"
  - locked_tools: count of tools with status "locked"
  - overall_completion_percentage: (completed_tools / total_tools) * 100
  - current_tool: lowest sprint number tool that is in_progress or unlocked
- **AND** response includes array of all tool progress entries with details

#### Scenario: Identify next available tool

- **WHEN** client requests next available tool
- **THEN** system returns lowest sprint number tool with status "unlocked" or "in_progress"
- **AND** if all tools completed, returns Sprint 30 with completion message
- **AND** if only locked tools remain, returns message indicating prerequisites needed

### Requirement: Progress History and Timestamps

The system SHALL maintain accurate timestamps for progress milestones.

#### Scenario: Timestamps recorded for all transitions

- **WHEN** tool status changes
- **THEN** system records timestamp in appropriate field (unlocked_at, started_at, completed_at)
- **AND** timestamps are stored in UTC
- **AND** timestamps are immutable once set (do not update on subsequent saves)

#### Scenario: Calculate time spent on tool

- **WHEN** client requests tool statistics
- **THEN** system calculates time_spent = completed_at - started_at (in days or hours)
- **AND** system includes time_to_unlock = unlocked_at - user.created_at
- **AND** system provides analytics on average completion times per tool
