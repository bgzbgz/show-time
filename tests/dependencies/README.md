# Fast Track Dependency Tests

End-to-end testing suite for verifying data flow between Fast Track's 30 interconnected tools.

## Overview

This test suite verifies that field values from completed tools are correctly extracted to `field_outputs` tables and then injected into dependent tools. Tests cover 6 critical dependency chains with 50+ field mappings.

## Setup

### Prerequisites

- Node.js 18+ installed
- Access to Supabase database (vpfayzzjnegdefjrnyoc)
- All 30 tool HTML files in `frontend/tools/`
- Test user created in database (UUID: `5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad`)

### Installation

```bash
cd tests/dependencies
npm install
```

This installs:
- Puppeteer (browser automation)
- Jest (test runner)
- @supabase/supabase-js (database client)

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific chain
```bash
npm run test:chain-1  # Foundation chain (WOOP → FIT)
npm run test:chain-2  # Goals chain
npm run test:chain-3  # Market chain
npm run test:chain-4  # Product chain
npm run test:chain-5  # Operations chain
npm run test:chain-6  # Team chain
```

### Run with test runner (generates reports)
```bash
npm run test:all
```

### Debug mode (visible browser, slow motion)
```bash
npm run test:debug
```

### Headless mode (for CI)
```bash
npm run test:headless
```

## Environment Variables

- `HEADLESS` - Run browser in headless mode (default: `true`)
- `SLOW_MO` - Slow down actions by N milliseconds (default: `0`)
- `TEST_USER_ID` - Override test user UUID (default: `5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad`)
- `SUPABASE_URL` - Supabase project URL (default: from config)
- `SUPABASE_ANON_KEY` - Supabase anon key (default: from config)

## Directory Structure

```
tests/dependencies/
├── README.md                    # This file
├── package.json                 # Dependencies and scripts
├── test-data.json              # Test fixtures for all 30 tools
├── test-matrix.md              # Pass/fail tracking table
├── run-all-chains.js           # Master test runner
├── chain-1-foundation.test.js  # Chain 1 tests
├── chain-2-goals.test.js       # Chain 2 tests
├── chain-3-market.test.js      # Chain 3 tests
├── chain-4-product.test.js     # Chain 4 tests
├── chain-5-operations.test.js  # Chain 5 tests
├── chain-6-team.test.js        # Chain 6 tests
├── dependency-report.md        # Latest test results (auto-generated)
├── dependency-report.json      # Machine-readable results
├── dependency-report.html      # Human-readable report
├── lib/                        # Shared utilities
│   ├── browser.js              # Browser launch/close
│   ├── auth.js                 # Test user authentication
│   ├── database.js             # Supabase query wrappers
│   ├── navigation.js           # Tool navigation helpers
│   ├── form-filler.js          # Form filling utilities
│   └── assertions.js           # Dependency verification
├── sql/                        # Verification queries
│   ├── all-field-outputs.sql
│   ├── chain-1-integrity.sql
│   ├── chain-2-integrity.sql
│   ├── chain-3-integrity.sql
│   ├── chain-4-integrity.sql
│   ├── chain-5-integrity.sql
│   ├── chain-6-integrity.sql
│   ├── test-user-submissions-count.sql
│   ├── cleanup-test-data.sql
│   └── field-outputs-schema-check.sql
└── screenshots/                # Failure screenshots
```

## Test Data

Test data is defined in `test-data.json` with known values for all 30 tools. Examples:

- WOOP.wish: "Build a $10M sustainable tech company"
- Know Thyself.identity.personal_dream: "Lead a transformative organization"
- Dream.company_dream: "Become the #1 business transformation platform"

These values are designed to be distinctive and traceable through dependency chains.

## How Tests Work

For each dependency (e.g., WOOP.wish → Know Thyself.initial_aspiration):

1. **Setup**: Delete test user's existing submissions
2. **Complete source tool**: Use Puppeteer to fill WOOP with test data and submit
3. **Verify extraction**: Query `sprint_00_woop.field_outputs` to confirm `wish` field extracted
4. **Open dependent tool**: Navigate to Know Thyself tool
5. **Verify injection**: Check that `initial_aspiration` field displays WOOP's wish value
6. **Assert**: Exact string match between source and target values

Both database extraction AND UI injection must pass for dependency to be considered working.

## Reading Test Reports

After running `npm run test:all`, check:

- **dependency-report.md**: Summary and failed dependencies
- **test-matrix.md**: Updated with pass/fail status for each mapping
- **screenshots/**: Screenshots of any failures

### Report Format

```markdown
# Dependency Test Report

**Test Run**: 2026-02-11 14:30:00
**Overall**: 45/50 passed (90%)

## Summary by Chain
- Chain 1 (Foundation): 6/6 ✓
- Chain 2 (Goals): 5/5 ✓
- Chain 3 (Market): 6/7 (1 failure)
...

## Failed Dependencies
| Source Tool | Source Field | Target Tool | Target Field | Error |
|------------|--------------|-------------|--------------|-------|
| Target Segment | customer_jobs | Value Prop | jobs_to_be_done | Expected array, got null |
```

## Troubleshooting

### Tests fail with "User not authenticated"
- Check test user exists in `shared.users` table
- Verify localStorage.ft_user_id is being set
- Check browser console logs in screenshots/

### Tests fail with "Could not find table"
- Verify all 31 Supabase schemas exist
- Check RPC function `submit_tool_data()` has SECURITY DEFINER
- Run `sql/field-outputs-schema-check.sql` to verify table structure

### Puppeteer timeouts
- Increase `testTimeout` in package.json jest config
- Add explicit waits in test code: `await page.waitForSelector('#element')`
- Check network latency to Supabase

### Wrong values appearing in dependent tools
- Check `field_outputs` table for actual stored value
- Verify field_id matches between extraction and injection
- Review config/dependencies.json for correct field mapping

### Screenshots not captured on failure
- Ensure `screenshots/` directory exists and is writable
- Check disk space
- Verify Puppeteer has permission to write files

## Adding New Tests

To test a new dependency:

1. **Add test data** to `test-data.json` for both source and target tools
2. **Update test-matrix.md** with new mapping row
3. **Add test code** in appropriate chain test file:
   ```javascript
   // In chain-X-name.test.js
   test('SourceTool.field → TargetTool.field', async () => {
     // Complete source tool
     await fillTool('source-slug', testData.sourceTool);
     await submitTool();

     // Verify extraction
     const extracted = await queryFieldOutput('sprint_XX_source', 'field_name');
     expect(extracted.field_value).toBe(testData.sourceTool.field);

     // Open target tool
     await navigateToTool('target-slug');

     // Verify injection
     const value = await page.$eval('#target-field', el => el.textContent);
     expect(value).toBe(testData.sourceTool.field);
   });
   ```
4. **Run test** to verify it works
5. **Update test-matrix.md** with pass/fail status

## SQL Query Usage

Verification queries in `sql/` can be run directly in Supabase SQL Editor:

```sql
-- Check all field_outputs for test user
\i sql/all-field-outputs.sql

-- Verify Chain 1 completeness
\i sql/chain-1-integrity.sql

-- Count test user submissions
\i sql/test-user-submissions-count.sql
```

Replace `'test-user-uuid'` placeholder with actual test user UUID in queries.

## CI/CD Integration

Tests run automatically in GitHub Actions on PR. See `.github/workflows/dependency-tests.yml`.

Exit codes:
- `0`: All tests passed
- `1`: Test failures detected (but may be below threshold)
- `2`: Critical failure (>5% failed)

## Maintenance

- **After tool changes**: Run tests to verify dependencies still work
- **After schema changes**: Update SQL queries and verify field_outputs structure
- **After adding new tool**: Add test data and update test matrix
- **Monthly**: Review and update test data to match evolving business scenarios

## GitHub Secrets Configuration

For CI/CD integration, add these secrets to your GitHub repository:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `TEST_USER_ID`: Test user UUID (default: `5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad`)

Navigate to: **Repository Settings → Secrets and variables → Actions → New repository secret**

## Local Development Workflow

1. **Make changes to tools**: Edit HTML files in `frontend/tools/`
2. **Run dependency tests**: `cd tests/dependencies && npm run test:all`
3. **Review reports**: Check `dependency-report.md` for results
4. **Fix broken dependencies**: Update extraction/injection logic
5. **Verify fixes**: Re-run tests
6. **Commit changes**: Tests run automatically in CI

## Understanding Test Results

### Extraction Tests
- ✅ PASS: Field value successfully stored in `field_outputs` table
- ❌ FAIL: Field not found in database OR value mismatch

**Common causes:**
- RPC function `submit_tool_data()` not extracting this field
- Field name mismatch between tool and `field_outputs`
- JSON path incorrect (e.g., `identity.personal_dream` vs `personal_dream`)

### Injection Tests
- ✅ PASS: Value appears in dependent tool's UI
- ❌ FAIL: Selector not found OR value mismatch OR value empty

**Common causes:**
- Selector doesn't exist (tool not implemented yet)
- Tool doesn't query `field_outputs` on load
- Query uses wrong field_id or schema name
- UI element exists but not populated with data

## Performance Notes

- Full test suite runs in ~5-10 minutes (depends on network latency to Supabase)
- Individual chains run in 30-60 seconds each
- Most time spent on page navigation and form filling
- Use `SLOW_MO=0` for fastest execution

## Support

For issues or questions, see main project README or contact development team.
