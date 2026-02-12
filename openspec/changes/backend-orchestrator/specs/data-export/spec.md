# Data Export

## ADDED Requirements

### Requirement: JSON Export Format

The system SHALL provide JSON export of tool submissions with complete data and metadata.

#### Scenario: Export submission as JSON

- **WHEN** authenticated user requests GET `/api/tools/{slug}/export?format=json`
- **THEN** system returns 200 OK with Content-Type application/json
- **AND** response includes submission object with: id, data (complete JSONB), status, version, timestamps
- **AND** response includes metadata: tool_name, tool_slug, sprint_number, user_email, organization_name
- **AND** response includes dependency_data object with values from prerequisite tools (if any)

#### Scenario: JSON export includes nested dependencies

- **WHEN** user exports tool that has dependencies
- **THEN** JSON includes "dependencies" section with all required field values from source tools
- **AND** each dependency includes field_id, value, and source_tool
- **AND** export is self-contained with full context

#### Scenario: Export non-existent submission

- **WHEN** user requests export for tool they haven't started
- **THEN** system returns 404 Not Found
- **AND** response message is "No submission found for this tool"

### Requirement: PDF Export Generation

The system SHALL generate PDF exports using Handlebars templates and Puppeteer rendering.

#### Scenario: Export submission as PDF

- **WHEN** authenticated user requests GET `/api/tools/{slug}/export?format=pdf`
- **THEN** system loads Handlebars template from `backend/src/templates/{slug}.hbs`
- **AND** system renders template with submission data and dependencies
- **AND** system converts rendered HTML to PDF using Puppeteer
- **AND** system returns PDF with Content-Type application/pdf and Content-Disposition attachment filename="{slug}_{user_id}_{date}.pdf"

#### Scenario: PDF includes branding

- **WHEN** PDF is generated
- **THEN** template includes Fast Track branding (logo, colors, fonts)
- **AND** PDF includes header with tool name and user name
- **AND** PDF includes footer with page numbers and export date

#### Scenario: PDF template not found

- **WHEN** tool has no custom template defined
- **THEN** system falls back to generic template at `backend/src/templates/default.hbs`
- **AND** generic template renders all submission data in structured format

### Requirement: Export with Dependency Data

The system SHALL include prerequisite tool data in exports for complete context.

#### Scenario: Export includes upstream data

- **WHEN** user exports Sprint 2 (Dream) tool
- **THEN** export includes Sprint 1 (Know Thyself) fields: identity.personal_dream, identity.personal_values
- **AND** dependency data is clearly labeled with source tool names
- **AND** export provides full narrative context from prerequisite tools

#### Scenario: Export indicates missing dependencies

- **WHEN** user exports tool with incomplete dependencies
- **THEN** export includes placeholder for missing fields
- **AND** PDF renders missing fields as "[Not yet completed]" or similar
- **AND** JSON export includes "missing_dependencies" array

### Requirement: Export File Naming Convention

The system SHALL generate export filenames with consistent naming pattern.

#### Scenario: PDF filename format

- **WHEN** system generates PDF export
- **THEN** filename follows pattern: `{tool-slug}_{user-last-name}_{YYYY-MM-DD}.pdf`
- **AND** filename is URL-safe (spaces replaced with underscores, special characters removed)
- **AND** filename is unique per user per day (date-based versioning)

#### Scenario: JSON filename format

- **WHEN** system generates JSON export
- **THEN** filename follows same pattern as PDF with .json extension
- **AND** Content-Disposition header includes filename for browser download

### Requirement: Export Rate Limiting

The system SHALL rate-limit export requests to prevent resource exhaustion.

#### Scenario: Rate limit per user

- **WHEN** user requests more than 10 exports within 1 hour
- **THEN** system returns 429 Too Many Requests
- **AND** response includes Retry-After header with seconds until rate limit resets
- **AND** response message is "Export rate limit exceeded. Try again in {minutes} minutes."

#### Scenario: Rate limit reset

- **WHEN** rate limit window (1 hour) expires
- **THEN** system resets user's export count to 0
- **AND** user can make new export requests

### Requirement: Asynchronous PDF Generation

The system SHALL handle PDF exports asynchronously for resource-intensive operations.

#### Scenario: Immediate export for small submissions

- **WHEN** user requests PDF export and submission data is less than 1MB
- **THEN** system generates PDF synchronously and returns immediately
- **AND** response time is under 5 seconds

#### Scenario: Background export for large submissions

- **WHEN** user requests PDF export and submission data exceeds 1MB
- **THEN** system returns 202 Accepted with job_id
- **AND** system queues PDF generation as background job
- **AND** user can poll GET `/api/tools/{slug}/export/status/{job_id}` for completion
- **AND** when complete, status endpoint returns PDF download URL

#### Scenario: Export job status check

- **WHEN** user polls export status endpoint
- **THEN** system returns job status: "pending", "processing", "completed", or "failed"
- **AND** if completed, response includes download_url valid for 24 hours
- **AND** if failed, response includes error message
