# AI Integration

## ADDED Requirements

### Requirement: n8n Webhook Integration

The system SHALL integrate with n8n AI agent via webhook for tool assistance and guidance.

#### Scenario: Send help request to n8n

- **WHEN** user sends POST to `/api/ai/help` with tool_slug, question, and current_data
- **THEN** system forwards request to n8n webhook URL from N8N_WEBHOOK_URL environment variable
- **AND** request payload includes: user_id, tool_slug, tool_context (submission data), question, dependencies (prerequisite tool data)
- **AND** system awaits n8n response with timeout of 30 seconds

#### Scenario: Receive AI response from n8n

- **WHEN** n8n webhook returns response
- **THEN** system validates response structure (answer field present)
- **AND** system returns 200 OK with AI response to client
- **AND** response includes: answer (markdown text), suggestions (array), confidence_score (0-1)

#### Scenario: n8n webhook timeout

- **WHEN** n8n webhook does not respond within 30 seconds
- **THEN** system returns 504 Gateway Timeout
- **AND** response message is "AI assistant is currently unavailable. Please try again."
- **AND** system logs timeout for monitoring

### Requirement: Context-Aware AI Requests

The system SHALL provide n8n AI agent with complete tool context including user data and dependencies.

#### Scenario: Include submission data in AI request

- **WHEN** user requests AI help from within active tool
- **THEN** system includes user's current submission data in tool_context field
- **AND** AI agent can reference user's existing answers to provide relevant guidance

#### Scenario: Include dependency data in AI request

- **WHEN** tool has dependencies on other tools
- **THEN** system fetches all required dependency field values
- **AND** system includes dependency data in dependencies object
- **AND** AI agent can reference prerequisite tool outputs (e.g., "based on your company vision from Sprint 2...")

#### Scenario: Tool metadata included

- **WHEN** AI request is sent
- **THEN** system includes tool metadata: tool_name, sprint_number, description, learning_objectives
- **AND** AI agent understands which tool user is working on and can provide specific guidance

### Requirement: AI Request Rate Limiting

The system SHALL rate-limit AI requests per user to manage costs and prevent abuse.

#### Scenario: Rate limit per user per hour

- **WHEN** user makes more than 10 AI help requests within 1 hour
- **THEN** system returns 429 Too Many Requests
- **AND** response includes message "AI request limit exceeded. You can ask {remaining} more questions in {minutes} minutes."
- **AND** rate limit counter resets after 1 hour window

#### Scenario: Admin and guru roles have higher limits

- **WHEN** user with role "admin" or "guru" requests AI help
- **THEN** system applies higher rate limit of 50 requests per hour
- **AND** different rate limit tracked separately from regular users

### Requirement: AI Response Validation

The system SHALL validate n8n responses before returning to client to ensure data integrity.

#### Scenario: Valid response structure

- **WHEN** n8n returns response
- **THEN** system validates response contains required field: answer (string)
- **AND** system validates optional fields if present: suggestions (array), confidence_score (number 0-1)
- **AND** if validation fails, system returns 500 Internal Server Error with generic message

#### Scenario: Sanitize AI response content

- **WHEN** AI response is received
- **THEN** system sanitizes answer markdown to prevent XSS attacks
- **AND** system ensures no executable code or scripts in response
- **AND** system allows safe markdown: headers, lists, bold, italic, links

### Requirement: AI Request Logging

The system SHALL log AI requests and responses for monitoring, debugging, and improvement.

#### Scenario: Log AI request

- **WHEN** AI help request is sent to n8n
- **THEN** system logs: timestamp, user_id, tool_slug, question_text (truncated to 200 chars), request_id
- **AND** logs are stored in structured format (JSON) for analysis
- **AND** PII is not logged (exclude full submission data)

#### Scenario: Log AI response

- **WHEN** AI response is received
- **THEN** system logs: timestamp, user_id, tool_slug, request_id, response_time_ms, success (boolean)
- **AND** if error occurred, logs error type and message
- **AND** logs do NOT include full response content to avoid storage costs

#### Scenario: Query AI usage analytics

- **WHEN** admin requests AI usage statistics
- **THEN** system provides aggregated metrics: total_requests, requests_per_tool, average_response_time, error_rate
- **AND** metrics can be filtered by date range and user_id

### Requirement: Fallback for AI Unavailability

The system SHALL gracefully handle n8n service unavailability without blocking user workflow.

#### Scenario: AI service unavailable

- **WHEN** n8n webhook is unreachable (DNS error, connection refused)
- **THEN** system returns 503 Service Unavailable
- **AND** response includes message "AI assistant is temporarily unavailable. You can continue working on the tool and try again later."
- **AND** user's tool access is NOT blocked (AI is supplementary, not required)

#### Scenario: Display static help content as fallback

- **WHEN** AI service is unavailable
- **THEN** system optionally returns static help content from tool metadata
- **AND** response includes guidance_text from config/tool-registry.json for that tool
- **AND** client can display fallback help to user
