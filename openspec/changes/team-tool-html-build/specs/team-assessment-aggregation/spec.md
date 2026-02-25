## ADDED Requirements

### Requirement: Calculate team dysfunction scores from individual assessments
The system SHALL aggregate individual team member assessment scores to compute team-level averages for each of the 5 dysfunctions: Absence of Trust, Fear of Conflict, Lack of Commitment, Avoidance of Accountability, and Inattention to Results.

#### Scenario: Team with single member
- **WHEN** team has 1 member with scores [Trust: 8, Conflict: 6, Commitment: 7, Accountability: 5, Results: 9]
- **THEN** team scores SHALL equal individual scores [8, 6, 7, 5, 9]

#### Scenario: Team with multiple members
- **WHEN** team has 3 members with scores:
  - Member 1: [Trust: 8, Conflict: 6, Commitment: 7, Accountability: 5, Results: 9]
  - Member 2: [Trust: 4, Conflict: 8, Commitment: 5, Accountability: 7, Results: 6]
  - Member 3: [Trust: 6, Conflict: 7, Commitment: 6, Accountability: 6, Results: 8]
- **THEN** team scores SHALL be [Trust: 6, Conflict: 7, Commitment: 6, Accountability: 6, Results: 7.67] (rounded to 2 decimals)

#### Scenario: Team with missing individual assessments
- **WHEN** team has 5 members but only 3 have completed assessments
- **THEN** system SHALL calculate averages from available 3 assessments only
- **AND** system SHALL display warning "2 team members have not completed assessments"

### Requirement: Color-code dysfunction severity
The system SHALL assign color-coded badges to each dysfunction score based on severity thresholds.

#### Scenario: Low dysfunction (healthy team)
- **WHEN** dysfunction score is between 1.0 and 3.9
- **THEN** system SHALL display green badge with label "Strength"

#### Scenario: Medium dysfunction (needs attention)
- **WHEN** dysfunction score is between 4.0 and 6.9
- **THEN** system SHALL display yellow badge with label "Opportunity"

#### Scenario: High dysfunction (critical issue)
- **WHEN** dysfunction score is between 7.0 and 10.0
- **THEN** system SHALL display red badge with label "Priority"

#### Scenario: Score exactly at threshold
- **WHEN** dysfunction score is exactly 4.0
- **THEN** system SHALL display yellow badge (lower bound inclusive)

### Requirement: Handle invalid assessment data
The system SHALL validate individual assessment scores before aggregation.

#### Scenario: Score out of valid range
- **WHEN** individual assessment contains score < 1 or score > 10
- **THEN** system SHALL reject the assessment with error "Invalid score: must be between 1 and 10"

#### Scenario: Missing dysfunction score
- **WHEN** individual assessment is missing one or more dysfunction scores
- **THEN** system SHALL reject the assessment with error "Incomplete assessment: all 5 dysfunctions required"

#### Scenario: Non-numeric score
- **WHEN** individual assessment contains non-numeric value (e.g., "N/A", null, undefined)
- **THEN** system SHALL reject the assessment with error "Invalid score: numeric value required"

### Requirement: Sort dysfunctions by severity for improvement planning
The system SHALL rank dysfunctions from highest to lowest score to identify top priorities.

#### Scenario: Distinct scores
- **WHEN** team scores are [Trust: 8, Conflict: 4, Commitment: 6, Accountability: 9, Results: 5]
- **THEN** system SHALL sort as [Accountability: 9, Trust: 8, Commitment: 6, Results: 5, Conflict: 4]

#### Scenario: Tied scores
- **WHEN** team scores are [Trust: 7, Conflict: 7, Commitment: 5, Accountability: 7, Results: 6]
- **THEN** system SHALL sort tied scores in original order [Trust: 7, Conflict: 7, Accountability: 7, Results: 6, Commitment: 5]

#### Scenario: All scores equal
- **WHEN** all team scores are 5.0
- **THEN** system SHALL display message "No clear priority - consider broader team health assessment"
