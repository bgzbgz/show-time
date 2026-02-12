## ADDED Requirements

### Requirement: Puppeteer-based browser automation
Automated chain tests SHALL use Puppeteer to control browser and interact with tools.

#### Scenario: Browser launch
- **WHEN** chain test starts
- **THEN** it SHALL launch headless Chrome browser with Puppeteer

#### Scenario: Tool navigation
- **WHEN** test needs to open a tool
- **THEN** it SHALL navigate to frontend/tools/XX-slug.html with test user's auth token

#### Scenario: Form filling
- **WHEN** test completes a tool
- **THEN** it SHALL fill form fields using test data from test-data.json

### Requirement: Complete dependency chain execution
Each chain test SHALL complete all tools in the chain from start to finish.

#### Scenario: Chain 1 execution (WOOP to FIT)
- **WHEN** Chain 1 test runs
- **THEN** it SHALL complete WOOP, Know Thyself, Dream, Values, Team, and FIT in sequence

#### Scenario: Chain continuation on failure
- **WHEN** a tool in middle of chain fails
- **THEN** test SHALL mark failure and stop chain (not continue with invalid data)

#### Scenario: All 6 chains testable
- **WHEN** test suite runs
- **THEN** it SHALL have test files for all 6 critical chains

### Requirement: Dependency value verification at each step
After each tool completion, test SHALL verify that dependent tool receives expected values.

#### Scenario: Database verification first
- **WHEN** tool A is completed
- **THEN** test SHALL query sprint_XX_name.field_outputs to verify extraction

#### Scenario: UI verification second
- **WHEN** dependent tool B is opened
- **THEN** test SHALL verify expected value appears in DOM (either pre-filled or displayed as reference)

#### Scenario: Exact value matching
- **WHEN** verifying dependency
- **THEN** test SHALL assert exact string match (e.g., "Build a $10M sustainable tech company" not just truthy)

### Requirement: Test isolation and cleanup
Each test SHALL run in isolation with proper setup and cleanup.

#### Scenario: Fresh test user state
- **WHEN** test starts
- **THEN** it SHALL delete all existing submissions for test user to start clean

#### Scenario: Test user authentication
- **WHEN** test runs
- **THEN** it SHALL set ft_user_id localStorage to test user UUID (5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad)

#### Scenario: Browser cleanup
- **WHEN** test completes (pass or fail)
- **THEN** it SHALL close browser and cleanup Puppeteer resources

### Requirement: Detailed test reporting
Tests SHALL provide detailed output for debugging failures.

#### Scenario: Success logging
- **WHEN** dependency verification passes
- **THEN** test SHALL log: "✅ WOOP.wish → Know Thyself.initial_aspiration: PASS (value: 'Build a $10M...')"

#### Scenario: Failure logging with context
- **WHEN** dependency verification fails
- **THEN** test SHALL log: "❌ WOOP.wish → Know Thyself.initial_aspiration: FAIL (expected: 'Build a $10M...', actual: null, DOM selector: #initial-aspiration)"

#### Scenario: Screenshot on failure
- **WHEN** dependency verification fails
- **THEN** test SHALL capture screenshot and save to tests/dependencies/screenshots/ with descriptive name

### Requirement: Configurable test execution
Tests SHALL support configuration options for different scenarios.

#### Scenario: Headless mode toggle
- **WHEN** environment variable HEADLESS=false
- **THEN** test SHALL run with visible browser for debugging

#### Scenario: Test subset execution
- **WHEN** running npm test -- --chain=1
- **THEN** only Chain 1 test SHALL execute

#### Scenario: Slow mode for debugging
- **WHEN** environment variable SLOW_MO=500
- **THEN** Puppeteer actions SHALL be slowed by 500ms for observation
