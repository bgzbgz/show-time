# Test Data Field Dependencies

This document maps which fields from `test-data.json` are consumed by dependent tools.

## Chain 1: Foundation (WOOP → Know Thyself → Dream → Values → Team → FIT)

### WOOP → Know Thyself
- **woop.wish** → Used by **know-thyself.initial_aspiration**
  - Value: "Build a $10M sustainable tech company"

### Know Thyself → Dream
- **know-thyself.identity.personal_dream** → Used by **dream.founder_vision**
  - Value: "Lead a transformative organization"
- **know-thyself.identity.purpose** → Used by **dream.company_purpose_foundation**
  - Value: "Empower entrepreneurs to succeed"

### Dream → Values
- **dream.company_dream** → Used by **values.dream_reference**
  - Value: "Become the #1 business transformation platform"

### Values → Team
- **values.core_values** → Used by **team.hiring_values**
  - Value: ["Integrity", "Excellence", "Innovation", "Grit"]

### Team → FIT
- **team.team_members** → Used by **fit.assessment_subjects**
  - Value: [{"name": "Alice Johnson", "role": "CEO"}, ...]

## Chain 2: Goals (Dream → Goals → Focus/Performance)

### Dream → Goals
- **dream.company_dream** → Used by **goals.vision_alignment**
  - Value: "Become the #1 business transformation platform"
- **dream.timeline** → Used by **goals.goal_timeframe**
  - Value: "5 years"

### Goals → Focus
- **goals.quarterly_goals** → Used by **focus.focus_candidates**
  - Value: [{"goal": "Launch MVP", "metric": "1000 users"}, ...]

### Goals → Performance
- **goals.quarterly_goals** → Used by **performance.performance_targets**
  - Value: [{"goal": "Launch MVP", "metric": "1000 users"}, ...]

### Team → Performance
- **team.team_members** → Used by **performance.performance_subjects**
  - Value: [{"name": "Alice Johnson", "role": "CEO"}, ...]

## Chain 3: Market (Dream → Market Size → Segmentation → Target Segment → Value Proposition)

### Dream → Market Size
- **dream.target_market** → Used by **market-size.market_definition**
  - Value: "SMB founders in growth phase"

### Market Size → Segmentation
- **market-size.tam** → Used by **segmentation.total_addressable_market**
  - Value: "$50B"
- **market-size.market_segments** → Used by **segmentation.segment_list**
  - Value: ["Enterprise", "SMB", "Startup"]

### Segmentation → Target Segment
- **segmentation.selected_segment** → Used by **target-segment.target_segment**
  - Value: "SMB founders with 10-50 employees"

### Target Segment → Value Proposition
- **target-segment.customer_jobs** → Used by **value-proposition.jobs_to_be_done**
  - Value: ["Scale operations", "Hire talent", "Increase revenue"]
- **target-segment.pains** → Used by **value-proposition.pain_points**
  - Value: ["Time constraints", "Cash flow", "Finding good people"]
- **target-segment.gains** → Used by **value-proposition.desired_gains**
  - Value: ["Growth", "Work-life balance", "Market leadership"]

## Chain 4: Product (Value Proposition → VP Testing → Product Dev → Pricing → Route to Market)

### Value Proposition → VP Testing
- **value-proposition.value_propositions** → Used by **vp-testing.hypotheses_to_test**
  - Value: ["Fast results", "Proven methodology", "Expert guidance"]

### VP Testing → Product Dev
- **vp-testing.validated_propositions** → Used by **product-dev.product_requirements**
  - Value: ["Fast results tested positively", "Experts valued by customers"]
- **vp-testing.willingness_to_pay** → Used by **product-dev.wtp_baseline**
  - Value: "$5000/month"

### Product Dev → Pricing
- **product-dev.product_tiers** → Used by **pricing.pricing_tiers**
  - Value: ["Basic", "Professional", "Enterprise"]

### VP Testing → Pricing
- **vp-testing.willingness_to_pay** → Used by **pricing.price_anchors**
  - Value: "$5000/month"

### Pricing → Route to Market
- **pricing.pricing_model** → Used by **route-to-market.revenue_model**
  - Value: "Subscription - monthly recurring"

### Brand Marketing → Route to Market
- **brand-marketing.marketing_channels** → Used by **route-to-market.channel_candidates**
  - Value: ["LinkedIn", "Content Marketing", "Referrals"]

## Chain 5: Operations (Route to Market → Core Activities → Processes → Digitalization → Digital Heart)

### Route to Market → Core Activities
- **route-to-market.gtm_strategy** → Used by **core-activities.required_activities**
  - Value: "Direct sales + content marketing"

### Value Proposition → Core Activities
- **value-proposition.value_propositions** → Used by **core-activities.value_delivery_activities**
  - Value: ["Fast results", "Proven methodology", "Expert guidance"]

### Core Activities → Processes
- **core-activities.activities** → Used by **processes.decision_points**
  - Value: ["Lead gen", "Sales", "Delivery", "Support"]

### Processes → Digitalization
- **processes.core_decisions** → Used by **digitalization.digitalization_opportunities**
  - Value: ["Qualify lead", "Close deal", "Schedule session"]

### Digitalization → Digital Heart
- **digitalization.data_requirements** → Used by **digital-heart.data_lake_sources**
  - Value: ["Customer data", "Usage metrics", "Revenue data"]

## Chain 6: Team (Team → FIT ABC → Org Redesign → Employer Branding/Agile Teams)

### Team → FIT ABC
- **team.team_members** → Used by **fit-abc.assessment_subjects**
  - Value: [{"name": "Alice Johnson", "role": "CEO"}, ...]

### Values → FIT ABC
- **values.core_values** → Used by **fit-abc.cultural_benchmark**
  - Value: ["Integrity", "Excellence", "Innovation", "Grit"]

### FIT ABC → Org Redesign
- **fit-abc.team_assessment** → Used by **org-redesign.current_state**
  - Value: {"team_score": 85, "strengths": ["Technical", "Leadership"], "gaps": ["Sales"]}

### Core Activities → Org Redesign
- **core-activities.activities** → Used by **org-redesign.organizational_needs**
  - Value: ["Lead gen", "Sales", "Delivery", "Support"]

### Org Redesign → Employer Branding
- **org-redesign.target_roles** → Used by **employer-branding.recruitment_focus**
  - Value: ["VP Sales", "Customer Success Manager", "Marketing Lead"]

### Values → Employer Branding
- **values.core_values** → Used by **employer-branding.employer_brand_values**
  - Value: ["Integrity", "Excellence", "Innovation", "Grit"]

### Org Redesign → Agile Teams
- **org-redesign.org_structure** → Used by **agile-teams.team_structure**
  - Value: {"departments": ["Product", "Sales", "Support"], "reporting": "Flat"}

## Usage in Tests

When testing a dependency, use the exact values from `test-data.json`:

```javascript
// Example: Testing WOOP → Know Thyself dependency
const testData = require('./test-data.json');

// Fill WOOP tool
await fillField('#wish', testData.woop.wish);
await submitTool();

// Verify in Know Thyself
await navigateToTool('know-thyself');
const initialAspiration = await getFieldValue('#initial-aspiration');
expect(initialAspiration).toBe(testData.woop.wish);
// Expected: "Build a $10M sustainable tech company"
```

## Updating Test Data

When adding or modifying test data:

1. Update `test-data.json` with the new field values
2. Update this document to reflect the dependency mapping
3. Update `test-matrix.md` with the new mapping row
4. Update the relevant chain test file with assertions
5. Run tests to verify the change works

## Field Naming Conventions

- Use snake_case for field names to match database schema
- Use kebab-case for tool slugs
- Arrays should contain objects with consistent structure
- Null values indicate optional fields
- All string values should be distinctive and traceable (not "test123")
