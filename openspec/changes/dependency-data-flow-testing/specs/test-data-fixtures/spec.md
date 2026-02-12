## ADDED Requirements

### Requirement: Standardized test data for all 30 tools
Test data fixtures SHALL provide known values for each of the 30 tools to enable deterministic testing.

#### Scenario: All tools have test data
- **WHEN** test-data.json is loaded
- **THEN** it SHALL contain test data objects for all 30 tools (sprint 0-29)

#### Scenario: Known traceable values
- **WHEN** test data is used
- **THEN** values SHALL be distinctive and traceable (e.g., "Build a $10M sustainable tech company" for WOOP.wish)

#### Scenario: JSON format
- **WHEN** test data is accessed
- **THEN** it SHALL be valid JSON with structure: `{ "toolSlug": { "fieldName": "value" } }`

### Requirement: Test data matches tool schema
Test data for each tool SHALL match the actual field names and structure used in tool submissions.

#### Scenario: Field names match submissions
- **WHEN** test data is used to fill a tool
- **THEN** field names SHALL match keys in sprint_XX_name.submissions.data JSONB column

#### Scenario: Data types correct
- **WHEN** test data is inserted
- **THEN** data types SHALL match tool expectations (strings, arrays, objects as appropriate)

### Requirement: Dependency chain coverage
Test data SHALL include all fields that participate in dependency mappings.

#### Scenario: Source fields populated
- **WHEN** a tool is a dependency source (e.g., WOOP)
- **THEN** test data SHALL include values for all fields consumed by dependent tools

#### Scenario: Realistic business scenarios
- **WHEN** test data is created
- **THEN** values SHALL represent realistic business scenarios (not "test123" or random strings)

### Requirement: Reusability across test runs
Test data SHALL be reusable and produce consistent results across multiple test runs.

#### Scenario: Deterministic values
- **WHEN** tests run multiple times
- **THEN** same test data SHALL be used each time (no random generation)

#### Scenario: No timestamps or IDs
- **WHEN** test data is defined
- **THEN** it SHALL NOT include timestamps or auto-generated IDs (those are generated at insertion time)

### Requirement: Test data documentation
Each test data value SHALL be documented with its purpose and which dependencies it tests.

#### Scenario: Inline comments
- **WHEN** viewing test-data.json
- **THEN** critical values SHALL have comments explaining their purpose (e.g., "// Used by Know Thyself.initial_aspiration")

#### Scenario: README reference
- **WHEN** developer needs to understand test data
- **THEN** tests/dependencies/README.md SHALL explain test data structure and usage
