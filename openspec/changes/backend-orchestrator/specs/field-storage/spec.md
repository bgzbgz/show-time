# Field Storage

## ADDED Requirements

### Requirement: Field Output Extraction

The system SHALL automatically extract recognized output fields from submission data and store them in the field_outputs table for efficient cross-tool queries.

#### Scenario: Extract output fields on submission save

- **WHEN** user saves submission containing field matching defined output pattern (e.g., identity.personal_dream)
- **THEN** system identifies field by matching against config/dependencies.json output field IDs
- **AND** system creates entry in tool's field_outputs table with field_id and field_value
- **AND** system links entry to submission via submission_id foreign key

#### Scenario: Update existing field output

- **WHEN** user updates submission containing previously extracted field
- **THEN** system updates corresponding field_outputs entry with new field_value
- **AND** system maintains same field_outputs.id (update, not insert)
- **AND** system updates field_outputs.created_at to reflect modification time

#### Scenario: Multiple fields extracted in single save

- **WHEN** submission contains multiple recognized output fields
- **THEN** system extracts all matching fields in single transaction
- **AND** all field_outputs entries reference same submission_id
- **AND** extraction completes atomically (all succeed or all fail)

### Requirement: Field ID Format Validation

The system SHALL validate that field IDs follow the hierarchical naming convention defined in sprint-connections-updated.md.

#### Scenario: Valid field ID format

- **WHEN** system extracts field with ID "identity.personal_dream"
- **THEN** field ID matches pattern: {module}.{tool_context}.{field_name}
- **AND** module is one of: identity, performance, market, strategy, execution, org, people, tech, program
- **AND** field ID is stored exactly as defined in dependencies configuration

#### Scenario: Invalid field ID rejected

- **WHEN** submission contains field with non-standard ID format
- **THEN** system logs warning but does not create field_output entry
- **AND** system includes field in submission data JSONB but not in field_outputs table
- **AND** field is not queryable via cross-tool dependency system

### Requirement: Efficient Field Lookup by ID

The system SHALL provide fast retrieval of field values by field_id across all tool schemas.

#### Scenario: Direct field query by ID

- **WHEN** system needs to fetch specific field (e.g., identity.personal_dream) for user
- **THEN** system queries single table: `{source_schema}.field_outputs WHERE field_id = ? AND submission_id IN (SELECT id FROM {source_schema}.submissions WHERE user_id = ?)`
- **AND** query uses index on field_id for O(log n) performance
- **AND** query returns field_value JSONB directly

#### Scenario: Batch field query for multiple IDs

- **WHEN** tool requires multiple fields from same source schema
- **THEN** system uses single query with IN clause: `WHERE field_id IN (?, ?, ?)`
- **AND** system minimizes database round trips
- **AND** system returns map of field_id to field_value

### Requirement: Field Value JSONB Flexibility

The system SHALL store field values as JSONB to support complex nested data structures.

#### Scenario: Store simple scalar value

- **WHEN** field contains simple string value (e.g., "Innovate boldly")
- **THEN** field_value stores as JSONB string: `"Innovate boldly"`
- **AND** value can be retrieved and parsed as string

#### Scenario: Store complex object value

- **WHEN** field contains nested object (e.g., strengths matrix with multiple dimensions)
- **THEN** field_value stores complete object structure as JSONB
- **AND** nested fields can be queried using PostgreSQL JSONB operators (e.g., `field_value->>'dimension'`)

#### Scenario: Store array value

- **WHEN** field contains array (e.g., list of core values)
- **THEN** field_value stores as JSONB array: `["Integrity", "Innovation", "Impact"]`
- **AND** array elements can be accessed using JSONB array indexing

### Requirement: Field Versioning with Submissions

The system SHALL maintain field output versions aligned with submission versions.

#### Scenario: Field outputs track submission version

- **WHEN** user updates submission and version increments to v2
- **THEN** system updates field_outputs entries to reflect new values from v2 submission
- **AND** system does NOT maintain historical field values (latest only)
- **AND** historical values can be retrieved by querying archived submission data if needed

#### Scenario: Field deleted from submission

- **WHEN** user removes field from submission that was previously extracted
- **THEN** system deletes corresponding field_outputs entry
- **AND** dependent tools querying that field will receive null/missing status

### Requirement: Cross-Schema Field Queries

The system SHALL execute cross-schema queries to fetch field values from any tool schema.

#### Scenario: Query field from different schema

- **WHEN** Sprint 2 (sprint_02_dream) needs field from Sprint 1 (sprint_01_know_thyself)
- **THEN** system constructs query: `SELECT field_value FROM sprint_01_know_thyself.field_outputs WHERE ...`
- **AND** PostgreSQL executes cross-schema query within same database
- **AND** query performance is equivalent to single-schema query

#### Scenario: Field not found in source schema

- **WHEN** system queries for field that doesn't exist in source schema
- **THEN** query returns zero rows (no match)
- **AND** system interprets as field not yet created by user
- **AND** dependency resolution marks field as missing
