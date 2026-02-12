## ADDED Requirements

### Requirement: Summary test results report
Dependency report SHALL provide high-level summary of test results across all chains.

#### Scenario: Overall pass rate
- **WHEN** report is generated
- **THEN** it SHALL display: "X/Y dependencies passed (Z%)"

#### Scenario: Chain-level breakdown
- **WHEN** viewing summary
- **THEN** it SHALL show pass/fail count for each of 6 critical chains

#### Scenario: Test run metadata
- **WHEN** report is generated
- **THEN** it SHALL include: test run timestamp, test user UUID, total execution time, environment (local/CI)

### Requirement: Failed dependencies detailed listing
Report SHALL list all failed dependencies with actionable debugging information.

#### Scenario: Failure details
- **WHEN** a dependency fails
- **THEN** report SHALL show: source tool, source field, target tool, target field, expected value, actual value, error message

#### Scenario: Screenshot links
- **WHEN** Puppeteer captured screenshot for failure
- **THEN** report SHALL include clickable link to screenshot file

#### Scenario: SQL query for reproduction
- **WHEN** database issue suspected
- **THEN** report SHALL include SQL query to manually verify field_outputs data

### Requirement: Broken and missing mappings identification
Report SHALL identify dependencies that are broken or not implemented.

#### Scenario: Broken mapping detection
- **WHEN** mapping exists in config/dependencies.json but test fails
- **THEN** report SHALL mark as "🔴 BROKEN" with failure reason

#### Scenario: Missing mapping detection
- **WHEN** tool B references field from tool A but no test covers it
- **THEN** report SHALL mark as "⚠️ MISSING TEST"

#### Scenario: Not implemented tool handling
- **WHEN** dependency involves tool not yet built (e.g., Sprint 30)
- **THEN** report SHALL mark as "🚧 NOT IMPLEMENTED" (not counted as failure)

### Requirement: Recommendations for fixes
Report SHALL provide actionable recommendations for fixing broken dependencies.

#### Scenario: Extraction issue recommendation
- **WHEN** field_outputs table missing expected field_id
- **THEN** report SHALL recommend: "Check RPC function submit_tool_data() extracts this field from submission data"

#### Scenario: Injection issue recommendation
- **WHEN** field_outputs has value but tool B doesn't display it
- **THEN** report SHALL recommend: "Check tool B queries field_outputs and populates UI element (selector: #fieldname)"

#### Scenario: Data mismatch recommendation
- **WHEN** value transformed incorrectly (e.g., "Build $10M" became "build 10m")
- **THEN** report SHALL recommend: "Check for case/formatting changes in extraction or injection logic"

### Requirement: Historical trend analysis
Report SHALL compare current test run to previous runs to show regression or improvement.

#### Scenario: Regression detection
- **WHEN** dependency passed in previous run but fails now
- **THEN** report SHALL highlight as "📉 REGRESSION" with change date

#### Scenario: Fix detection
- **WHEN** dependency failed in previous run but passes now
- **THEN** report SHALL highlight as "📈 FIXED" with change date

#### Scenario: Trend visualization
- **WHEN** multiple test runs exist
- **THEN** report SHALL show graph/table of pass rate over time

### Requirement: Export formats
Report SHALL be available in multiple formats for different use cases.

#### Scenario: Markdown format for Git
- **WHEN** report generated
- **THEN** dependency-report.md SHALL be created in Markdown format for version control

#### Scenario: JSON format for automation
- **WHEN** CI/CD needs to parse results
- **THEN** dependency-report.json SHALL be created with machine-readable structure

#### Scenario: HTML format for viewing
- **WHEN** human review needed
- **THEN** dependency-report.html SHALL be created with styling and interactive elements

### Requirement: Integration with CI/CD
Report SHALL support integration with continuous integration systems.

#### Scenario: Exit code on failure
- **WHEN** any dependency fails
- **THEN** test script SHALL exit with non-zero code to fail CI build

#### Scenario: Threshold-based passing
- **WHEN** pass rate exceeds configured threshold (e.g., 95%)
- **THEN** test SHALL pass even if some dependencies fail (for gradual improvement)

#### Scenario: GitHub Actions annotations
- **WHEN** running in GitHub Actions
- **THEN** failures SHALL be annotated on PR with file/line references where possible
