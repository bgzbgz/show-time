# Tool API

## ADDED Requirements

### Requirement: Tool Listing

The system SHALL provide an API endpoint that lists all available tools with their metadata and user-specific progress information.

#### Scenario: Get all tools for authenticated user

- **WHEN** an authenticated user sends GET request to `/api/tools`
- **THEN** system returns 200 OK with JSON array of all 30 tools
- **AND** each tool includes slug, name, description, sprint_number, module, dependencies, and user's progress status

#### Scenario: Unauthenticated access denied

- **WHEN** an unauthenticated user sends GET request to `/api/tools`
- **THEN** system returns 401 Unauthorized
- **AND** response includes error message "Authentication required"

### Requirement: Tool Metadata Retrieval

The system SHALL provide an API endpoint to retrieve detailed metadata for a specific tool.

#### Scenario: Get specific tool metadata

- **WHEN** an authenticated user sends GET request to `/api/tools/{slug}`
- **THEN** system returns 200 OK with tool metadata including schema_name, file path, dependencies array, and status
- **AND** response includes tool's unlock status for the current user

#### Scenario: Invalid tool slug

- **WHEN** user requests a tool with non-existent slug
- **THEN** system returns 404 Not Found
- **AND** response includes error message "Tool not found: {slug}"

### Requirement: Submission Data Retrieval

The system SHALL allow users to retrieve their submission data for a specific tool.

#### Scenario: Get user's existing submission

- **WHEN** authenticated user sends GET request to `/api/tools/{slug}/data`
- **THEN** system returns 200 OK with user's most recent submission for that tool
- **AND** response includes submission id, data (JSONB), status, version, and timestamps

#### Scenario: No existing submission

- **WHEN** user requests data for a tool they haven't started
- **THEN** system returns 404 Not Found
- **AND** response includes message "No submission found for this tool"

#### Scenario: Tool is locked for user

- **WHEN** user requests data for a tool they haven't unlocked
- **THEN** system returns 403 Forbidden
- **AND** response includes missing dependencies that must be completed first

### Requirement: Submission Data Persistence

The system SHALL allow users to save and update their tool submission data.

#### Scenario: Create new submission

- **WHEN** authenticated user sends POST request to `/api/tools/{slug}/data` with valid data
- **THEN** system creates new submission record in tool's schema
- **AND** system returns 201 Created with submission id and created_at timestamp
- **AND** system sets status to "draft" by default
- **AND** system creates entries in field_outputs table for recognized field IDs

#### Scenario: Update existing submission

- **WHEN** user sends POST request to `/api/tools/{slug}/data` with existing submission
- **THEN** system updates submission record and increments version number
- **AND** system returns 200 OK with updated submission
- **AND** system updates modified field_outputs entries

#### Scenario: Invalid data structure

- **WHEN** user sends POST request with data that fails Zod validation
- **THEN** system returns 400 Bad Request
- **AND** response includes detailed validation errors

### Requirement: Tool Submission Finalization

The system SHALL allow users to formally submit a completed tool for review or completion.

#### Scenario: Submit completed tool

- **WHEN** user sends POST request to `/api/tools/{slug}/submit` with all required fields completed
- **THEN** system updates submission status to "submitted"
- **AND** system records submitted_at timestamp
- **AND** system triggers progress tracking to unlock dependent tools
- **AND** system returns 200 OK with confirmation

#### Scenario: Submit incomplete tool

- **WHEN** user attempts to submit tool with missing required fields
- **THEN** system returns 400 Bad Request
- **AND** response includes list of missing required fields

### Requirement: Cross-Tool Dependency Data Retrieval

The system SHALL provide an endpoint to fetch required data from prerequisite tools.

#### Scenario: Get dependencies for unlocked tool

- **WHEN** user sends GET request to `/api/tools/{slug}/dependencies`
- **THEN** system queries source tool schemas for required field IDs
- **AND** system returns 200 OK with object mapping field IDs to their values
- **AND** response includes metadata about source tool for each field

#### Scenario: Dependencies not yet available

- **WHEN** user requests dependencies but prerequisite tools are incomplete
- **THEN** system returns 200 OK with partial data
- **AND** response clearly indicates which fields are missing and which tools need completion
