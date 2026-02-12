## Why

The Fast Track Tools system has 30 interconnected tools where later tools depend on data from earlier ones (e.g., Know Thyself needs WOOP's wish, Dream needs Know Thyself's purpose). Currently, there's no systematic way to verify that these 50+ field dependencies work correctly end-to-end. Without comprehensive testing, data may not flow between tools, breaking the user experience and undermining the sequential program design.

## What Changes

- Create comprehensive test suite for all tool-to-tool dependencies
- Add test data fixtures with known values for each of 30 tools
- Implement automated Puppeteer tests for 6 critical dependency chains
- Create SQL verification queries for field_outputs table population
- Build test matrix documentation for all 50+ field mappings
- Generate dependency integrity report showing pass/fail status

## Capabilities

### New Capabilities

- `dependency-test-matrix`: Documentation and tracking of all 50+ field mappings between tools, including source tool, source field, target tool, target field, and pass/fail status
- `test-data-fixtures`: Standardized test data for all 30 tools with known values that can be traced through dependency chains
- `automated-chain-testing`: Puppeteer scripts that complete entire tool chains (WOOP → Digital Heart) and verify data flow at each step
- `field-extraction-verification`: SQL queries to verify field_outputs tables are correctly populated with extracted values from completed tools
- `dependency-integrity-reporting`: Summary reports of tested dependencies, broken/missing mappings, and recommendations

### Modified Capabilities

None - this is purely additive testing infrastructure with no changes to existing tool functionality.

## Impact

- New `tests/dependencies/` directory structure
- Test scripts depend on:
  - Supabase database with all 31 schemas populated
  - All 30 tool HTML files accessible
  - Puppeteer for browser automation
  - Test user with UUID in database
- No impact on production tools - tests run in isolated test environment
- Validates critical business logic: the tool dependency system that makes Fast Track's sequential program work
