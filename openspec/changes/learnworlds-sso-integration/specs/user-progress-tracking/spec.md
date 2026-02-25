## ADDED Requirements

### Requirement: User progress database schema
The system SHALL maintain a `user_progress` table with columns: `id`, `user_id`, `sprint_id`, `tool_slug`, `status`, `is_unlocked`, `unlocked_at`, `started_at`, `completed_at`, `created_at`, `updated_at`.

#### Scenario: Progress record creation
- **WHEN** a user's progress needs to be tracked
- **THEN** the system SHALL create a record with unique constraint on (user_id, sprint_id, tool_slug)

#### Scenario: Progress status transitions
- **WHEN** a user interacts with a tool
- **THEN** the system SHALL update status from `not_started` → `in_progress` → `completed` with appropriate timestamps

### Requirement: Users table extension for LearnWorlds data
The system SHALL extend the existing `users` table with columns: `learnworlds_user_id` (TEXT UNIQUE), `learnworlds_email` (TEXT), `sso_verified_at` (TIMESTAMPTZ).

#### Scenario: LearnWorlds user mapping
- **WHEN** a user authenticates via SSO
- **THEN** the system SHALL store their LearnWorlds identifiers for future lookups

### Requirement: Get user progress endpoint
The system SHALL provide an endpoint at `GET /api/user/progress` that returns a user's complete progress state.

#### Scenario: Authenticated user requests progress
- **WHEN** a request includes a valid JWT in Authorization header
- **THEN** the system SHALL return completed tools, currently unlocked tools, and locked tools

#### Scenario: Unauthenticated progress request
- **WHEN** a request to `/api/user/progress` lacks a valid JWT
- **THEN** the system SHALL return HTTP 401 Unauthorized

### Requirement: Progress response format
The system SHALL return progress data with arrays for `completed_tools`, `current_unlocked`, and `locked_tools`.

#### Scenario: Progress data structure
- **WHEN** returning progress data
- **THEN** the system SHALL include `sprint_id`, `tool_slug`, timestamps for completed tools, and `is_unlocked` status for all tools

### Requirement: Get user submission endpoint
The system SHALL provide an endpoint at `GET /api/user/submission/:sprint_id/:tool_slug` that returns past submissions.

#### Scenario: Retrieve completed tool submission
- **WHEN** a user requests a submission for a completed tool
- **THEN** the system SHALL return the submission data in read-only format

#### Scenario: Request submission for incomplete tool
- **WHEN** a user requests a submission for a tool they haven't completed
- **THEN** the system SHALL return HTTP 404 with `{ error: "No submission found" }`

#### Scenario: Request submission without authentication
- **WHEN** a request lacks a valid JWT
- **THEN** the system SHALL return HTTP 401 Unauthorized

### Requirement: Tool unlock logic
The system SHALL unlock sprint tools based on lesson completion sequence.

#### Scenario: First tool unlocked
- **WHEN** Lesson 1 is completed
- **THEN** Sprint 0 WOOP tool SHALL be unlocked

#### Scenario: Sequential unlocking
- **WHEN** Lesson N is completed
- **THEN** Sprint N-1 tool SHALL be unlocked

#### Scenario: Already unlocked tool
- **WHEN** attempting to unlock a tool that is already unlocked
- **THEN** the system SHALL update `unlocked_at` timestamp but not create duplicate records

### Requirement: Progress tracking timestamps
The system SHALL track `unlocked_at`, `started_at`, and `completed_at` timestamps for accurate progress history.

#### Scenario: Tool unlocked timestamp
- **WHEN** a tool is unlocked via webhook
- **THEN** the system SHALL record `unlocked_at` with current timestamp

#### Scenario: Tool started timestamp
- **WHEN** a user opens an unlocked tool
- **THEN** the system SHALL record `started_at` if status is `not_started`

#### Scenario: Tool completed timestamp
- **WHEN** a user completes a tool
- **THEN** the system SHALL record `completed_at` and set status to `completed`

### Requirement: JWT validation middleware
The system SHALL validate JWT tokens on all protected user progress endpoints.

#### Scenario: Valid JWT proceeds
- **WHEN** a request includes a valid, non-expired JWT
- **THEN** the system SHALL extract user_id and process the request

#### Scenario: Invalid JWT rejected
- **WHEN** a request includes an invalid or expired JWT
- **THEN** the system SHALL return HTTP 401 Unauthorized

#### Scenario: Missing JWT rejected
- **WHEN** a protected endpoint is accessed without a JWT
- **THEN** the system SHALL return HTTP 401 Unauthorized
