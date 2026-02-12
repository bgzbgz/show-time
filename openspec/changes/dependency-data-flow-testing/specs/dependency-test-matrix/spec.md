## ADDED Requirements

### Requirement: Test matrix documentation structure
The test matrix SHALL be a Markdown table that tracks all field mappings between tools with pass/fail status.

#### Scenario: Table format
- **WHEN** viewing test-matrix.md
- **THEN** it SHALL contain columns: Source Tool, Source Field, Target Tool, Target Field, Status, Notes

#### Scenario: All mappings included
- **WHEN** test matrix is generated
- **THEN** it SHALL include all 50+ field mappings from config/dependencies.json

#### Scenario: Status values
- **WHEN** a mapping is tested
- **THEN** status SHALL be one of: "✅ Pass", "❌ Fail", "⏸️ Not Tested", "🚧 Not Implemented"

### Requirement: Mapping verification tracking
Each field mapping in the test matrix SHALL track the expected data flow and actual result.

#### Scenario: Pass criteria
- **WHEN** test completes successfully
- **THEN** status SHALL be "✅ Pass" with timestamp

#### Scenario: Fail criteria with details
- **WHEN** test fails
- **THEN** status SHALL be "❌ Fail" AND Notes SHALL describe the failure (e.g., "Expected 'Build $10M company' but got null")

#### Scenario: Not implemented tool
- **WHEN** dependent tool doesn't exist yet (e.g., Sprint 30)
- **THEN** status SHALL be "🚧 Not Implemented"

### Requirement: Dependency chain organization
The test matrix SHALL group mappings by the 6 critical dependency chains.

#### Scenario: Chain 1 grouping
- **WHEN** viewing test matrix
- **THEN** Chain 1 (WOOP → FIT) mappings SHALL be grouped together with chain header

#### Scenario: All 6 chains represented
- **WHEN** test matrix is complete
- **THEN** it SHALL have sections for all 6 chains: Foundation, Goals, Market, Product, Operations, Team

### Requirement: Auto-generation from test results
The test matrix SHALL be automatically generated from test script output.

#### Scenario: Generate after test run
- **WHEN** automated tests complete
- **THEN** test script SHALL update test-matrix.md with results

#### Scenario: Preserve manual notes
- **WHEN** regenerating test matrix
- **THEN** existing Notes column content SHALL be preserved unless overwritten by new failure details

### Requirement: Version control and history
The test matrix SHALL be tracked in Git to maintain testing history.

#### Scenario: Commit after changes
- **WHEN** test matrix is updated
- **THEN** changes SHALL be committed with message indicating test run date and pass rate

#### Scenario: Historical comparison
- **WHEN** comparing test runs
- **THEN** Git history SHALL show which dependencies broke or were fixed between commits
