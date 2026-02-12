# Dependency Orchestration

## ADDED Requirements

### Requirement: Dependency Resolution by Field ID

The system SHALL resolve cross-tool dependencies by fetching specific field values from source tool schemas based on field IDs.

#### Scenario: Resolve single dependency field

- **WHEN** Sprint 2 (Dream) requests dependency `identity.personal_dream` from Sprint 1
- **THEN** system queries `sprint_01_know_thyself.field_outputs` WHERE field_id = 'identity.personal_dream' AND user_id matches
- **AND** system returns field_value JSONB data
- **AND** system includes metadata (source_tool, field_id, retrieved_at)

#### Scenario: Resolve multiple dependency fields

- **WHEN** tool requires multiple fields from different source tools
- **THEN** system fetches all required fields in single database transaction
- **AND** system returns object mapping each field_id to its value
- **AND** missing fields are clearly indicated in response

#### Scenario: Dependency field does not exist

- **WHEN** system queries for field that user hasn't created yet
- **THEN** system returns null for that field_id
- **AND** system includes status indicating field is missing
- **AND** system does NOT throw error (allows partial dependencies)

### Requirement: Tool Unlock Status Validation

The system SHALL validate whether a user can access a tool based on completion of all required prerequisite tools.

#### Scenario: All dependencies satisfied

- **WHEN** user attempts to access tool and all dependency fields exist with status "completed"
- **THEN** system returns unlocked: true
- **AND** system records unlock timestamp in shared.user_progress if not already unlocked
- **AND** user can access tool data and submission endpoints

#### Scenario: Dependencies incomplete

- **WHEN** user attempts to access tool with incomplete prerequisites
- **THEN** system returns unlocked: false
- **AND** response includes array of missing dependencies with tool names and required field IDs
- **AND** response includes message "Complete [Tool X, Tool Y] to unlock this tool"

#### Scenario: Optional tool dependencies

- **WHEN** tool has optional dependencies (e.g., Sprint 7 Energy is optional)
- **THEN** system does NOT block unlock if optional dependency is missing
- **AND** system still fetches optional dependency data if available
- **AND** tool indicates which dependencies are optional vs required

### Requirement: Cascading Dependency Calculation

The system SHALL handle complex cascading dependencies where tools require outputs from multiple previous tools.

#### Scenario: Module 5 tool requires all previous module outputs

- **WHEN** Sprint 21 (Route to Market) dependency check occurs
- **THEN** system validates ALL execution.* fields from Sprints 17-20 exist
- **AND** system validates base dependencies from earlier modules
- **AND** system returns complete dependency tree showing which outputs are satisfied

#### Scenario: Sprint 30 requires all 29 previous sprints

- **WHEN** user attempts to access Sprint 30 (Program Overview)
- **THEN** system validates outputs from ALL sprints 0-29
- **AND** system efficiently queries using indexed field_outputs rather than 29 separate queries
- **AND** system caches dependency status for performance

### Requirement: Dependency Metadata Tracking

The system SHALL track which tools depend on which field IDs using metadata from config/dependencies.json.

#### Scenario: Load dependency configuration

- **WHEN** system starts up
- **THEN** system loads config/dependencies.json into memory
- **AND** system builds dependency graph mapping each tool to its required field IDs
- **AND** system validates all field IDs reference valid source tools

#### Scenario: Query dependency metadata

- **WHEN** API client requests `/api/tools/{slug}/dependencies/metadata`
- **THEN** system returns list of required field IDs for that tool
- **AND** response includes source tool name, field ID, and whether field is optional
- **AND** response indicates current availability status for user

### Requirement: Efficient Bulk Dependency Queries

The system SHALL optimize database queries when resolving dependencies for multiple users or tools.

#### Scenario: Batch dependency resolution

- **WHEN** system needs to check unlock status for all tools for a user
- **THEN** system executes single query fetching all user's field_outputs
- **AND** system evaluates all tool dependencies against fetched data
- **AND** query completes in O(1) database round trips, not O(n) per tool

#### Scenario: Dependency query uses indexes

- **WHEN** system queries field_outputs for specific field_id
- **THEN** PostgreSQL uses index on (field_id) column
- **AND** query execution time is O(log n) regardless of total field_outputs count
- **AND** EXPLAIN ANALYZE shows index scan, not sequential scan

### Requirement: Circular Dependency Prevention

The system SHALL detect and prevent circular dependencies in tool configuration.

#### Scenario: Detect circular dependency at startup

- **WHEN** config/dependencies.json contains Tool A depending on Tool B, and Tool B depending on Tool A
- **THEN** system logs ERROR on startup
- **AND** system prevents server from starting until circular dependency is resolved
- **AND** error message clearly identifies the circular dependency chain

#### Scenario: Valid sequential dependencies allowed

- **WHEN** dependencies form directed acyclic graph (DAG)
- **THEN** system successfully validates configuration
- **AND** system can topologically sort tools into valid completion order
- **AND** system exposes tool order via `/api/tools?order=sequence`
