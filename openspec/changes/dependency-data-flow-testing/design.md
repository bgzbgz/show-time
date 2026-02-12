## Context

The Fast Track Tools system consists of 30 interconnected HTML tools organized in 5 modules across sprints 0-30. Tools have dependencies defined in `config/dependencies.json` where later tools consume field values from earlier completed tools. Data flow: User completes Tool A → values stored in `sprint_XX_name.submissions` → specific fields extracted to `sprint_XX_name.field_outputs` → Tool B queries field_outputs to retrieve values.

Current testing approach: Manual, ad-hoc verification. No systematic way to verify all 50+ dependency mappings work correctly. Risk: Silent failures where dependent tools don't receive expected data, breaking user experience.

## Goals / Non-Goals

**Goals:**
- Verify all 50+ field mappings in 6 critical dependency chains work end-to-end
- Provide automated regression testing for dependency system
- Create reusable test data fixtures for all 30 tools
- Generate clear pass/fail reports for each dependency
- Enable rapid verification after database schema or tool submission changes

**Non-Goals:**
- Testing tool UI/UX beyond dependency data display
- Performance/load testing
- Testing tools in isolation (only testing inter-tool dependencies)
- Fixing broken dependencies (only identifying them)

## Decisions

### D1: Test Framework - Puppeteer for E2E automation
**Decision**: Use Puppeteer to automate browser interactions and complete full tool chains.

**Rationale**:
- Tools are single-page HTML apps requiring browser environment
- Need to fill forms, click submit, navigate between tools
- Puppeteer provides full browser automation with JavaScript execution
- Can verify both database state (via SQL) and UI state (DOM inspection)

**Alternatives considered**:
- Playwright: Similar capability but Puppeteer has better Node.js integration for our use case
- Selenium: Heavier, more complex setup
- Direct API calls: Wouldn't test actual user flow through HTML tools

### D2: Test Data Strategy - Fixed known values
**Decision**: Use predefined test data with specific known values (e.g., WOOP.wish = "Build a $10M sustainable tech company").

**Rationale**:
- Enables exact verification - if input is X, output must be X
- Makes test failures immediately obvious (expected "Build a $10M..." but got null)
- Reusable across test runs
- Documented in `tests/dependencies/test-data.json` for reference

**Alternatives considered**:
- Random data: Harder to verify, non-deterministic
- Production data snapshots: Privacy concerns, not reproducible

### D3: Verification Approach - Dual verification (DB + UI)
**Decision**: Verify both database `field_outputs` population AND display in dependent tool UI.

**Rationale**:
- Database check: Confirms extraction logic works (Tool A → field_outputs)
- UI check: Confirms injection logic works (field_outputs → Tool B display)
- Both must pass for dependency to be considered working
- Catches failures at either layer

### D4: Test Organization - One chain per test file
**Decision**: Separate test files for each of 6 critical chains (e.g., `chain-1-foundation.test.js`).

**Rationale**:
- Chains can run independently for faster debugging
- Failures isolated to specific chain
- Easier to maintain and understand
- Can parallelize test execution

**Alternatives considered**:
- Single monolithic test: Slower, harder to debug
- One test per tool pair: Too granular (50+ files)

### D5: Database Queries - SQL over Supabase client
**Decision**: Use raw SQL queries via Supabase `execute_sql` for verification.

**Rationale**:
- Direct access to schema-specific tables
- Complex joins across submissions and field_outputs
- Better performance for batch queries
- Can verify data structure integrity

### D6: Test User - Dedicated test user with UUID
**Decision**: Create persistent test user (ID: `5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad`) in Supabase.

**Rationale**:
- Isolates test data from real users
- Reproducible - same UUID across test runs
- Can reset progress by deleting test user's submissions
- Already created in earlier setup

### D7: Test Matrix Format - Markdown table
**Decision**: Use Markdown table in `test-matrix.md` for tracking pass/fail status.

**Rationale**:
- Human-readable in Git/GitHub
- Easy to update with test results
- Can generate from test script output
- Version controlled alongside code

### D8: Reporting - Summary + detailed logs
**Decision**: Generate both summary report (pass/fail counts) and detailed logs (specific failures).

**Rationale**:
- Summary gives quick health check
- Details enable debugging
- Different audiences (PM vs developer)

## Risks / Trade-offs

**[Risk]** Tests may be brittle - small HTML changes break tests
→ **Mitigation**: Use data-testid attributes in tools, avoid selector brittleness

**[Risk]** Tests take long time to run (30 tools × form filling)
→ **Mitigation**: Only test critical chains (not all possible paths), parallelize where possible

**[Risk]** Test data may not match real user patterns
→ **Mitigation**: Use realistic business scenarios in test data, review with product team

**[Risk]** Database state pollution across test runs
→ **Mitigation**: Delete test user submissions before each run, use transaction rollback where possible

**[Risk]** Puppeteer tests may fail due to timing issues
→ **Mitigation**: Use waitForSelector, explicit waits, retry logic

**[Risk]** Changes to field names/structure break tests
→ **Mitigation**: Maintain test data schema in sync with config/dependencies.json

**[Risk]** Tests don't catch UI display issues (field present but not visible)
→ **Mitigation**: Verify both value presence and visibility in DOM

**[Risk]** Manual updates to test-matrix.md may diverge from actual test results
→ **Mitigation**: Auto-generate test-matrix.md from test script output

## Migration Plan

Not applicable - this is new testing infrastructure with no migration. Tests run independently of production system.

## Open Questions

1. **Should tests clean up after themselves or leave data for inspection?**
   - Option A: Delete submissions after test completes (clean state)
   - Option B: Keep data for debugging (requires manual cleanup)
   - Recommendation: Option A with flag to disable cleanup for debugging

2. **How to handle optional tools (Energy, Customer Service, Agile Teams)?**
   - These have dependencies but aren't required for program completion
   - Test them separately or skip?
   - Recommendation: Test separately, mark as optional in test matrix

3. **Verification threshold - what % pass rate is acceptable?**
   - 100% would be ideal but may be unrealistic initially
   - 80%? 90%?
   - Recommendation: 100% for critical path (Chains 1-3), 80% for secondary chains

4. **How to test tools not yet implemented (Sprint 30)?**
   - Skip until implemented
   - Create stub/mock
   - Recommendation: Skip, mark as "Not Implemented" in test matrix

5. **Should test data include edge cases (empty fields, special characters)?**
   - Proposal focuses on happy path
   - Edge cases would catch more bugs
   - Recommendation: Start with happy path, add edge cases in future iteration
