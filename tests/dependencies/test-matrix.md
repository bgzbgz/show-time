# Dependency Test Matrix

Test coverage for all 50+ field mappings between Fast Track tools.

**Last Updated**: Auto-generated from test runs
**Test User**: `5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad`

## Legend

| Status | Meaning |
|--------|---------|
| ✅ | Dependency verified - data flows correctly |
| ❌ | Dependency broken - test failed |
| ⏸️ | Not tested yet |
| 🚧 | Tool not implemented |
| ⚠️ | Missing test coverage |

---

## Chain 1: Foundation
**WOOP → Know Thyself → Dream → Values → Team → FIT**

| Source Tool | Source Field | Target Tool | Target Field | Status | Notes |
|------------|--------------|-------------|--------------|--------|-------|
| WOOP | wish | Know Thyself | initial_aspiration | ⏸️ Not Tested | |
| Know Thyself | identity.personal_dream | Dream | founder_vision | ⏸️ Not Tested | |
| Know Thyself | identity.purpose | Dream | company_purpose_foundation | ⏸️ Not Tested | |
| Dream | company_dream | Values | dream_reference | ⏸️ Not Tested | |
| Values | core_values | Team | hiring_values | ⏸️ Not Tested | |
| Team | team_members | FIT | assessment_subjects | ⏸️ Not Tested | |

**Chain 1 Progress**: 0/6 tested

---

## Chain 2: Goals
**Dream → Goals → Focus/Performance**

| Source Tool | Source Field | Target Tool | Target Field | Status | Notes |
|------------|--------------|-------------|--------------|--------|-------|
| Dream | company_dream | Goals | vision_alignment | ⏸️ Not Tested | |
| Dream | timeline | Goals | goal_timeframe | ⏸️ Not Tested | |
| Goals | quarterly_goals | Focus | focus_candidates | ⏸️ Not Tested | |
| Goals | quarterly_goals | Performance | performance_targets | ⏸️ Not Tested | |
| Team | team_members | Performance | performance_subjects | ⏸️ Not Tested | |

**Chain 2 Progress**: 0/5 tested

---

## Chain 3: Market
**Dream → Market Size → Segmentation → Target Segment → Value Proposition**

| Source Tool | Source Field | Target Tool | Target Field | Status | Notes |
|------------|--------------|-------------|--------------|--------|-------|
| Dream | target_market | Market Size | market_definition | ⏸️ Not Tested | |
| Market Size | tam | Segmentation | total_addressable_market | ⏸️ Not Tested | |
| Market Size | market_segments | Segmentation | segment_list | ⏸️ Not Tested | |
| Segmentation | selected_segment | Target Segment | target_segment | ⏸️ Not Tested | |
| Target Segment | customer_jobs | Value Proposition | jobs_to_be_done | ⏸️ Not Tested | |
| Target Segment | pains | Value Proposition | pain_points | ⏸️ Not Tested | |
| Target Segment | gains | Value Proposition | desired_gains | ⏸️ Not Tested | |

**Chain 3 Progress**: 0/7 tested

---

## Chain 4: Product
**Value Proposition → VP Testing → Product Dev → Pricing → Route to Market**

| Source Tool | Source Field | Target Tool | Target Field | Status | Notes |
|------------|--------------|-------------|--------------|--------|-------|
| Value Proposition | value_propositions | VP Testing | hypotheses_to_test | ⏸️ Not Tested | |
| VP Testing | validated_propositions | Product Dev | product_requirements | ⏸️ Not Tested | |
| VP Testing | willingness_to_pay | Product Dev | wtp_baseline | ⏸️ Not Tested | |
| Product Dev | product_tiers | Pricing | pricing_tiers | ⏸️ Not Tested | |
| VP Testing | willingness_to_pay | Pricing | price_anchors | ⏸️ Not Tested | |
| Pricing | pricing_model | Route to Market | revenue_model | ⏸️ Not Tested | |
| Brand Marketing | marketing_channels | Route to Market | channel_candidates | ⏸️ Not Tested | |

**Chain 4 Progress**: 0/7 tested

---

## Chain 5: Operations
**Route to Market → Core Activities → Processes → Digitalization → Digital Heart**

| Source Tool | Source Field | Target Tool | Target Field | Status | Notes |
|------------|--------------|-------------|--------------|--------|-------|
| Route to Market | gtm_strategy | Core Activities | required_activities | ⏸️ Not Tested | |
| Value Proposition | value_propositions | Core Activities | value_delivery_activities | ⏸️ Not Tested | |
| Core Activities | activities | Processes | decision_points | ⏸️ Not Tested | |
| Processes | core_decisions | Digitalization | digitalization_opportunities | ⏸️ Not Tested | |
| Digitalization | data_requirements | Digital Heart | data_lake_sources | ⏸️ Not Tested | |

**Chain 5 Progress**: 0/5 tested

---

## Chain 6: Team & Culture
**Team → FIT ABC → Org Redesign → Employer Branding/Agile Teams**

| Source Tool | Source Field | Target Tool | Target Field | Status | Notes |
|------------|--------------|-------------|--------------|--------|-------|
| Team | team_members | FIT ABC | assessment_subjects | ⏸️ Not Tested | |
| Values | core_values | FIT ABC | cultural_benchmark | ⏸️ Not Tested | |
| FIT ABC | team_assessment | Org Redesign | current_state | ⏸️ Not Tested | |
| Core Activities | activities | Org Redesign | organizational_needs | ⏸️ Not Tested | |
| Org Redesign | target_roles | Employer Branding | recruitment_focus | ⏸️ Not Tested | |
| Values | core_values | Employer Branding | employer_brand_values | ⏸️ Not Tested | |
| Org Redesign | org_structure | Agile Teams | team_structure | ⏸️ Not Tested | |

**Chain 6 Progress**: 0/7 tested

---

## Overall Summary

**Total Dependencies**: 37
**Tested**: 0
**Passed**: 0
**Failed**: 0
**Not Tested**: 37

**Pass Rate**: 0% (0 passed / 0 tested)

---

## Test History

| Date | Total Tested | Passed | Failed | Pass Rate | Notes |
|------|-------------|--------|--------|-----------|-------|
| 11.02.2026 г. | 6 | 0 | 6 | 0% | All 6 chains tested |

---

## Notes

- This matrix is auto-updated by `run-all-chains.js` after each test run
- Manual updates should be avoided to prevent drift from actual test results
- For detailed failure information, see `dependency-report.md`
- For test data values, see `test-data.json` and `test-data-dependencies.md`
