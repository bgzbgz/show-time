## ADDED Requirements

### Requirement: SQL queries for field_outputs verification
Verification queries SHALL check that field_outputs tables are correctly populated after tool submission.

#### Scenario: Check extraction for single tool
- **WHEN** query is run for specific tool (e.g., sprint_00_woop)
- **THEN** it SHALL return all field_outputs rows for test user's latest submission

#### Scenario: Verify field_id correctness
- **WHEN** field_outputs are queried
- **THEN** field_id values SHALL match expected field names from config/dependencies.json

#### Scenario: Verify field_value format
- **WHEN** field_outputs are queried
- **THEN** field_value SHALL be valid JSONB matching original submission data

### Requirement: Cross-schema field_outputs aggregation
Verification SHALL provide queries to see all field_outputs across all 30+ tool schemas.

#### Scenario: Union query across schemas
- **WHEN** all-field-outputs.sql is executed
- **THEN** it SHALL UNION ALL field_outputs from all sprint schemas with schema name included

#### Scenario: Filter by user
- **WHEN** query includes user_id parameter
- **THEN** it SHALL only return field_outputs for that user's submissions

#### Scenario: Order by completion time
- **WHEN** results are returned
- **THEN** they SHALL be ordered by completed_at timestamp to show dependency chain progression

### Requirement: Dependency chain integrity queries
Queries SHALL verify that complete dependency chains have all required field_outputs populated.

#### Scenario: Check Chain 1 completeness
- **WHEN** chain-1-integrity.sql runs
- **THEN** it SHALL verify WOOP.wish, Know Thyself.personal_dream, Dream.company_dream, Values.core_values, Team.team_members, FIT fields all exist

#### Scenario: Missing dependency detection
- **WHEN** a field in dependency chain is missing
- **THEN** query SHALL return row indicating missing field with source tool, target tool, and expected field_id

#### Scenario: Null value detection
- **WHEN** field_value is null but shouldn't be
- **THEN** query SHALL flag as data quality issue

### Requirement: Field_outputs table schema validation
Queries SHALL verify that field_outputs tables have correct schema structure.

#### Scenario: Required columns present
- **WHEN** schema check query runs
- **THEN** it SHALL verify each sprint schema's field_outputs has: id, submission_id, field_id, field_value, created_at columns

#### Scenario: Foreign key integrity
- **WHEN** field_outputs are checked
- **THEN** every submission_id SHALL have corresponding row in schema's submissions table

#### Scenario: Index verification
- **WHEN** checking query performance
- **THEN** queries SHALL verify indexes exist on field_id and submission_id columns

### Requirement: Test user data isolation queries
Queries SHALL isolate test user data for verification without affecting other data.

#### Scenario: Test user submissions count
- **WHEN** count query runs
- **THEN** it SHALL return number of submissions per tool schema for test user only

#### Scenario: Test data cleanup verification
- **WHEN** cleanup query runs
- **THEN** it SHALL confirm all test user data deleted before returning

#### Scenario: No production data impact
- **WHEN** verification queries run
- **THEN** they SHALL be read-only SELECT statements with no UPDATE/DELETE on non-test-user data
