# Schema Management

## ADDED Requirements

### Requirement: Shared Schema Structure

The system SHALL create and maintain three shared PostgreSQL schemas that support all tool operations.

#### Scenario: Shared users table exists

- **WHEN** system initializes database
- **THEN** schema `shared.users` EXISTS with tables for user data
- **AND** users table includes id (UUID), lms_user_id, email, full_name, organization_id, role, and timestamps
- **AND** users table has UNIQUE constraint on email and lms_user_id

#### Scenario: Shared organizations table exists

- **WHEN** system initializes database
- **THEN** schema `shared.organizations` EXISTS with organization metadata
- **AND** organizations table includes id (UUID), name, slug (UNIQUE), and settings (JSONB)

#### Scenario: Shared user progress table exists

- **WHEN** system initializes database
- **THEN** schema `shared.user_progress` EXISTS with progress tracking data
- **AND** user_progress table includes id, user_id (FK to users), tool_slug, status, progress_percentage, and unlock/start/completion timestamps
- **AND** user_progress has index on (user_id, tool_slug) for fast lookups

### Requirement: Tool Schema Naming Convention

The system SHALL create PostgreSQL schemas for each of 30 tools following the naming pattern `sprint_{XX}_{slug}`.

#### Scenario: Tool schema name matches convention

- **WHEN** system creates schema for Sprint 1 "Know Thyself" tool
- **THEN** schema name is exactly `sprint_01_know_thyself`
- **AND** sprint number is zero-padded to 2 digits
- **AND** slug is kebab-case matching tool registry

#### Scenario: All 30 tool schemas exist

- **WHEN** system completes database initialization
- **THEN** exactly 30 tool schemas exist from `sprint_00_woop` through `sprint_30_program_overview`
- **AND** each schema follows naming convention `sprint_{XX}_{slug}`

### Requirement: Tool Submissions Table Structure

Each tool schema SHALL contain a `submissions` table with standardized structure for storing user submissions.

#### Scenario: Submissions table structure

- **WHEN** tool schema is created
- **THEN** schema contains `submissions` table with columns:
  - id (UUID PRIMARY KEY)
  - user_id (UUID, FK to shared.users)
  - organization_id (UUID, FK to shared.organizations)
  - data (JSONB for flexible tool-specific fields)
  - status (VARCHAR: draft, in_progress, submitted, completed)
  - version (INTEGER DEFAULT 1)
  - created_at, updated_at, submitted_at, completed_at (TIMESTAMPS)
- **AND** submissions table has indexes on user_id, organization_id, status, updated_at

#### Scenario: JSONB data column stores tool-specific fields

- **WHEN** user saves submission with tool-specific fields
- **THEN** all fields are stored in JSONB `data` column
- **AND** JSONB structure allows nested objects and arrays
- **AND** data can be queried using PostgreSQL JSONB operators

### Requirement: Field Outputs Table for Cross-Tool Queries

Each tool schema SHALL contain a `field_outputs` table that normalizes key output fields for efficient cross-tool dependency resolution.

#### Scenario: Field outputs table structure

- **WHEN** tool schema is created
- **THEN** schema contains `field_outputs` table with columns:
  - id (UUID PRIMARY KEY)
  - submission_id (UUID, FK to submissions)
  - field_id (VARCHAR, e.g., 'identity.personal_dream')
  - field_value (JSONB)
  - created_at (TIMESTAMP)
- **AND** field_outputs has index on field_id for fast dependency lookups
- **AND** field_outputs has index on submission_id

#### Scenario: Field output created on submission save

- **WHEN** user saves submission containing recognized output field IDs
- **THEN** system creates entry in field_outputs for each output field
- **AND** field_id matches exactly the ID from sprint-connections-updated.md
- **AND** field_value contains the actual data from submission

#### Scenario: Cross-tool field query

- **WHEN** system needs to fetch `identity.personal_dream` for dependency resolution
- **THEN** system queries `SELECT field_value FROM sprint_01_know_thyself.field_outputs WHERE field_id = 'identity.personal_dream' AND submission_id IN (SELECT id FROM sprint_01_know_thyself.submissions WHERE user_id = ?)`
- **AND** query uses index on field_id for O(log n) performance

### Requirement: Schema Isolation

Each tool's schema SHALL be isolated to enable independent scaling and data management.

#### Scenario: Tool schemas do not share tables

- **WHEN** system creates tool schemas
- **THEN** each tool's submissions and field_outputs tables exist ONLY in that tool's schema
- **AND** no cross-schema foreign keys exist between tool schemas
- **AND** cross-tool data access occurs via application-level queries, not database constraints

#### Scenario: Schema-level permissions can be applied

- **WHEN** database administrator configures permissions
- **THEN** PostgreSQL GRANT statements can be applied at schema level
- **AND** different tools can have different access policies
- **AND** compromised tool schema does not grant access to other tool schemas
