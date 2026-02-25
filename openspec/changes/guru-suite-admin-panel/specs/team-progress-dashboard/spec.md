## ADDED Requirements

### Requirement: Team member list display
The system SHALL display a complete list of all team members belonging to the authenticated guru's organization.

#### Scenario: Team roster display
- **WHEN** a guru accesses the dashboard
- **THEN** the system displays all users with the matching organization_id, showing full name, email, and enrollment date

#### Scenario: Empty team handling
- **WHEN** an organization has no team members enrolled
- **THEN** the system displays an appropriate message indicating no team members are found

### Requirement: Progress status calculation
The system SHALL calculate and display each team member's progress status for the current sprint as one of three states: completed, in_progress, or not_started.

#### Scenario: Completed status
- **WHEN** a team member has a tool_submission record with status "completed" for the sprint
- **THEN** the system displays their status as "completed" with submission timestamp

#### Scenario: In progress status
- **WHEN** a team member has a user_progress record with status "in_progress" but no completed submission
- **THEN** the system displays their status as "in_progress" without submission timestamp

#### Scenario: Not started status
- **WHEN** a team member has no user_progress or tool_submission records for the sprint
- **THEN** the system displays their status as "not_started"

### Requirement: Completion statistics
The system SHALL display aggregate statistics showing total team size, number completed, number in progress, and number not started with corresponding percentages.

#### Scenario: Statistics calculation
- **WHEN** a team has 7 members with 3 completed, 2 in progress, and 2 not started
- **THEN** the system displays "Total: 7 | Completed: 3 (43%) | In Progress: 2 (29%) | Not Started: 2 (29%)"

#### Scenario: Zero team members
- **WHEN** an organization has 0 team members
- **THEN** the system displays "Total: 0 | Completed: 0 (0%) | In Progress: 0 (0%) | Not Started: 0 (0%)"

### Requirement: Visual progress indicator
The system SHALL display a visual progress bar showing the percentage of team members who have completed the sprint tool.

#### Scenario: Progress bar rendering
- **WHEN** 3 out of 7 team members have completed the tool
- **THEN** the system displays a progress bar filled to 43% (3/7)

#### Scenario: Zero progress
- **WHEN** no team members have completed the tool
- **THEN** the system displays a progress bar at 0%

#### Scenario: Full completion
- **WHEN** all team members have completed the tool
- **THEN** the system displays a progress bar at 100%

### Requirement: Status-based filtering and sorting
The system SHALL allow gurus to sort the team member list by name, email, status, or submission date.

#### Scenario: Sort by name
- **WHEN** a guru clicks the "NAME" column header
- **THEN** the system sorts team members alphabetically by full name

#### Scenario: Sort by status
- **WHEN** a guru clicks the "STATUS" column header
- **THEN** the system groups team members by status (completed, in_progress, not_started)

#### Scenario: Sort by submission date
- **WHEN** a guru clicks the "SUBMITTED" column header
- **THEN** the system sorts team members by submission timestamp, with most recent first

### Requirement: Real-time data freshness
The system SHALL display current data from the database, reflecting the latest progress updates when the dashboard is loaded or refreshed.

#### Scenario: Dashboard load
- **WHEN** a guru loads the dashboard
- **THEN** the system queries the database for the most recent progress and submission data

#### Scenario: Manual refresh
- **WHEN** a guru refreshes the browser page
- **THEN** the system reloads all dashboard data from the database

### Requirement: Sprint context display
The system SHALL prominently display the sprint name and sprint ID associated with the current dashboard view.

#### Scenario: Sprint header display
- **WHEN** a guru accesses dashboard with code for sprint 0
- **THEN** the system displays "WOOP" as the sprint name in the header

#### Scenario: Sprint mapping
- **WHEN** the sprint_id is 0, 1, 2, 3, or 4
- **THEN** the system displays the corresponding sprint name (WOOP, Know Thyself, Dream, Values, Team)

### Requirement: Organization context display
The system SHALL display the organization name in a prominent header position.

#### Scenario: Organization header
- **WHEN** a guru for Luxottica accesses the dashboard
- **THEN** the system displays "Luxottica" in large, bold typography at the top of the dashboard

### Requirement: Status badge visual differentiation
The system SHALL display status badges with distinct colors: green for completed, yellow for in_progress, gray for not_started.

#### Scenario: Completed badge styling
- **WHEN** a team member has completed status
- **THEN** the system displays a green badge with the text "COMPLETED"

#### Scenario: In progress badge styling
- **WHEN** a team member has in_progress status
- **THEN** the system displays a yellow badge (#FFF469) with the text "IN PROGRESS"

#### Scenario: Not started badge styling
- **WHEN** a team member has not_started status
- **THEN** the system displays a gray badge (#6B7280) with the text "NOT STARTED"
