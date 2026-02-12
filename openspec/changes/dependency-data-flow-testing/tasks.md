## 1. Project Setup

- [x] 1.1 Create tests/dependencies/ directory structure
- [x] 1.2 Initialize package.json for test dependencies (Puppeteer, Jest)
- [x] 1.3 Install Puppeteer: npm install --save-dev puppeteer
- [x] 1.4 Install Jest: npm install --save-dev jest
- [x] 1.5 Create tests/dependencies/README.md with setup instructions
- [x] 1.6 Add .gitignore entries for test screenshots and logs
- [x] 1.7 Create tests/dependencies/screenshots/ directory for failure captures

## 2. Test Data Fixtures

- [x] 2.1 Create tests/dependencies/test-data.json with structure for all 30 tools
- [x] 2.2 Add WOOP test data (wish, outcome, obstacle, plan)
- [x] 2.3 Add Know Thyself test data (identity.personal_dream, identity.purpose)
- [x] 2.4 Add Dream test data (company_dream, target_market, timeline)
- [x] 2.5 Add Values test data (core_values array)
- [x] 2.6 Add Team test data (team_members array with name/role objects)
- [x] 2.7 Add Goals test data (quarterly_goals array)
- [x] 2.8 Add Market Size test data (tam, market_segments)
- [x] 2.9 Add Segmentation test data (selected_segment)
- [x] 2.10 Add Target Segment test data (customer_jobs, pains, gains)
- [x] 2.11 Add Value Proposition test data (value_propositions array)
- [x] 2.12 Add remaining tool test data for sprints 11-29
- [x] 2.13 Add inline comments documenting which fields are used by dependent tools
- [x] 2.14 Validate test-data.json is valid JSON

## 3. Test Matrix Documentation

- [x] 3.1 Create tests/dependencies/test-matrix.md file
- [x] 3.2 Add Markdown table header (Source Tool, Source Field, Target Tool, Target Field, Status, Notes)
- [x] 3.3 Add Chain 1 mappings (WOOP → Know Thyself → Dream → Values → Team → FIT) - 6 mappings
- [x] 3.4 Add Chain 2 mappings (Dream → Goals → Focus/Performance) - 5 mappings
- [x] 3.5 Add Chain 3 mappings (Dream → Market Size → Segmentation → Target Segment → Value Proposition) - 7 mappings
- [x] 3.6 Add Chain 4 mappings (Value Proposition → VP Testing → Product Dev → Pricing → Route to Market) - 7 mappings
- [x] 3.7 Add Chain 5 mappings (Route to Market → Core Activities → Processes → Digitalization → Digital Heart) - 5 mappings
- [x] 3.8 Add Chain 6 mappings (Team → FIT ABC → Org Redesign → Employer Branding/Agile Teams) - 7 mappings
- [x] 3.9 Initialize all Status columns to "⏸️ Not Tested"
- [x] 3.10 Add chain header sections for grouping

## 4. SQL Verification Queries

- [x] 4.1 Create tests/dependencies/sql/all-field-outputs.sql (UNION query across all sprint schemas)
- [x] 4.2 Create tests/dependencies/sql/chain-1-integrity.sql (verify Chain 1 completeness)
- [x] 4.3 Create tests/dependencies/sql/chain-2-integrity.sql (verify Chain 2 completeness)
- [x] 4.4 Create tests/dependencies/sql/chain-3-integrity.sql (verify Chain 3 completeness)
- [x] 4.5 Create tests/dependencies/sql/chain-4-integrity.sql (verify Chain 4 completeness)
- [x] 4.6 Create tests/dependencies/sql/chain-5-integrity.sql (verify Chain 5 completeness)
- [x] 4.7 Create tests/dependencies/sql/chain-6-integrity.sql (verify Chain 6 completeness)
- [x] 4.8 Create tests/dependencies/sql/test-user-submissions-count.sql (count by schema)
- [x] 4.9 Create tests/dependencies/sql/cleanup-test-data.sql (delete test user submissions)
- [x] 4.10 Create tests/dependencies/sql/field-outputs-schema-check.sql (verify table structure)

## 5. Puppeteer Test Utilities

- [x] 5.1 Create tests/dependencies/lib/browser.js with browser launch/close functions
- [x] 5.2 Create tests/dependencies/lib/auth.js with test user authentication helpers
- [x] 5.3 Create tests/dependencies/lib/database.js with Supabase query wrappers
- [x] 5.4 Create tests/dependencies/lib/navigation.js with tool navigation helpers
- [x] 5.5 Create tests/dependencies/lib/form-filler.js with form filling utilities
- [x] 5.6 Create tests/dependencies/lib/assertions.js with dependency verification functions
- [x] 5.7 Add screenshot capture function for failures
- [x] 5.8 Add logging utilities for test output

## 6. Chain 1 Test Implementation (Foundation)

- [x] 6.1 Create tests/dependencies/chain-1-foundation.test.js skeleton
- [x] 6.2 Implement WOOP tool completion with test data
- [x] 6.3 Verify WOOP.wish extracted to sprint_00_woop.field_outputs
- [x] 6.4 Open Know Thyself tool and verify WOOP.wish appears in initial_aspiration
- [x] 6.5 Complete Know Thyself with test data
- [x] 6.6 Verify Know Thyself.identity.personal_dream extracted to field_outputs
- [x] 6.7 Open Dream tool and verify personal_dream appears in founder_vision
- [x] 6.8 Complete Dream with test data
- [x] 6.9 Verify Dream.company_dream extracted to field_outputs
- [x] 6.10 Open Values tool and verify company_dream appears in dream_reference
- [x] 6.11 Complete Values with test data
- [x] 6.12 Verify Values.core_values extracted to field_outputs
- [x] 6.13 Open Team tool and verify core_values appear in hiring_values
- [x] 6.14 Complete Team with test data
- [x] 6.15 Verify Team.team_members extracted to field_outputs
- [x] 6.16 Open FIT tool and verify team_members appear in assessment_subjects
- [x] 6.17 Add assertions for all 6 mappings in Chain 1
- [x] 6.18 Add error handling and screenshot capture on failure

## 7. Chain 2 Test Implementation (Goals)

- [x] 7.1 Create tests/dependencies/chain-2-goals.test.js skeleton
- [x] 7.2 Implement Dream → Goals dependency (company_dream → vision_alignment)
- [x] 7.3 Implement Dream → Goals dependency (timeline → goal_timeframe)
- [x] 7.4 Implement Goals → Focus dependency (quarterly_goals → focus_candidates)
- [x] 7.5 Implement Goals → Performance dependency (quarterly_goals → performance_targets)
- [x] 7.6 Implement Team → Performance dependency (team_members → performance_subjects)
- [x] 7.7 Add assertions for all 5 mappings in Chain 2
- [x] 7.8 Add error handling and cleanup

## 8. Chain 3 Test Implementation (Market)

- [x] 8.1 Create tests/dependencies/chain-3-market.test.js skeleton
- [x] 8.2 Implement Dream → Market Size dependency (target_market → market_definition)
- [x] 8.3 Implement Market Size → Segmentation dependency (tam → total_addressable_market)
- [x] 8.4 Implement Market Size → Segmentation dependency (market_segments → segment_list)
- [x] 8.5 Implement Segmentation → Target Segment dependency (selected_segment → target_segment)
- [x] 8.6 Implement Target Segment → Value Proposition dependency (customer_jobs → jobs_to_be_done)
- [x] 8.7 Implement Target Segment → Value Proposition dependency (pains → pain_points)
- [x] 8.8 Implement Target Segment → Value Proposition dependency (gains → desired_gains)
- [x] 8.9 Add assertions for all 7 mappings in Chain 3
- [x] 8.10 Add error handling and cleanup

## 9. Chain 4 Test Implementation (Product)

- [x] 9.1 Create tests/dependencies/chain-4-product.test.js skeleton
- [x] 9.2 Implement Value Proposition → VP Testing dependency (value_propositions → hypotheses_to_test)
- [x] 9.3 Implement VP Testing → Product Dev dependency (validated_propositions → product_requirements)
- [x] 9.4 Implement VP Testing → Product Dev dependency (willingness_to_pay → wtp_baseline)
- [x] 9.5 Implement Product Dev → Pricing dependency (product_tiers → pricing_tiers)
- [x] 9.6 Implement VP Testing → Pricing dependency (willingness_to_pay → price_anchors)
- [x] 9.7 Implement Pricing → Route to Market dependency (pricing_model → revenue_model)
- [x] 9.8 Implement Brand Marketing → Route to Market dependency (marketing_channels → channel_candidates)
- [x] 9.9 Add assertions for all 7 mappings in Chain 4
- [x] 9.10 Add error handling and cleanup

## 10. Chain 5 Test Implementation (Operations)

- [x] 10.1 Create tests/dependencies/chain-5-operations.test.js skeleton
- [x] 10.2 Implement Route to Market → Core Activities dependency (gtm_strategy → required_activities)
- [x] 10.3 Implement Value Proposition → Core Activities dependency (value_propositions → value_delivery_activities)
- [x] 10.4 Implement Core Activities → Processes dependency (activities → decision_points)
- [x] 10.5 Implement Processes → Digitalization dependency (core_decisions → digitalization_opportunities)
- [x] 10.6 Implement Digitalization → Digital Heart dependency (data_requirements → data_lake_sources)
- [x] 10.7 Add assertions for all 5 mappings in Chain 5
- [x] 10.8 Add error handling and cleanup

## 11. Chain 6 Test Implementation (Team)

- [x] 11.1 Create tests/dependencies/chain-6-team.test.js skeleton
- [x] 11.2 Implement Team → FIT ABC dependency (team_members → assessment_subjects)
- [x] 11.3 Implement Values → FIT ABC dependency (core_values → cultural_benchmark)
- [x] 11.4 Implement FIT ABC → Org Redesign dependency (team_assessment → current_state)
- [x] 11.5 Implement Core Activities → Org Redesign dependency (activities → organizational_needs)
- [x] 11.6 Implement Org Redesign → Employer Branding dependency (target_roles → recruitment_focus)
- [x] 11.7 Implement Values → Employer Branding dependency (core_values → employer_brand_values)
- [x] 11.8 Implement Org Redesign → Agile Teams dependency (org_structure → team_structure)
- [x] 11.9 Add assertions for all 7 mappings in Chain 6
- [x] 11.10 Add error handling and cleanup

## 12. Test Execution and Reporting

- [x] 12.1 Create tests/dependencies/run-all-chains.js master test runner
- [x] 12.2 Add test user cleanup before test run
- [x] 12.3 Add parallel chain execution where possible
- [x] 12.4 Implement test result aggregation
- [x] 12.5 Generate tests/dependencies/dependency-report.md from test results
- [x] 12.6 Update tests/dependencies/test-matrix.md with pass/fail status
- [x] 12.7 Generate tests/dependencies/dependency-report.json (machine-readable)
- [x] 12.8 Generate tests/dependencies/dependency-report.html (human-readable)
- [x] 12.9 Add summary statistics (X/Y passed, Z% pass rate)
- [x] 12.10 Add failure details with recommendations
- [x] 12.11 Add historical comparison if previous run exists

## 13. CI/CD Integration

- [x] 13.1 Create .github/workflows/dependency-tests.yml GitHub Actions workflow
- [x] 13.2 Configure Puppeteer to run in CI environment (headless, no-sandbox)
- [x] 13.3 Add Supabase connection from GitHub secrets
- [x] 13.4 Add test execution step
- [x] 13.5 Add artifact upload for test reports and screenshots
- [x] 13.6 Configure exit code based on pass threshold (95%)
- [x] 13.7 Add PR comment with test summary
- [x] 13.8 Add GitHub Actions annotations for failures

## 14. Documentation

- [x] 14.1 Update tests/dependencies/README.md with complete usage instructions
- [x] 14.2 Document how to run tests locally
- [x] 14.3 Document environment variables (HEADLESS, SLOW_MO)
- [x] 14.4 Document test data structure and how to update
- [x] 14.5 Document how to add new dependency tests
- [x] 14.6 Document SQL query usage
- [x] 14.7 Add troubleshooting section for common failures
- [x] 14.8 Add examples of reading test reports

## 15. Testing and Validation

- [x] 15.1 Run all 6 chain tests locally and verify they pass
- [x] 15.2 Intentionally break a dependency and verify test catches it
- [x] 15.3 Verify screenshots captured on failure
- [x] 15.4 Verify test-matrix.md updated correctly
- [x] 15.5 Verify dependency-report.md generated with correct format
- [x] 15.6 Verify SQL queries return expected data
- [x] 15.7 Run tests in headless mode
- [x] 15.8 Run tests in CI environment
- [x] 15.9 Verify test isolation (multiple runs produce same results)
- [x] 15.10 Verify cleanup leaves no test data behind
