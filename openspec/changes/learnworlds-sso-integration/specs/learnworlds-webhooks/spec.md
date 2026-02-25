## ADDED Requirements

### Requirement: Webhook endpoint for LearnWorlds events
The system SHALL provide an endpoint at `POST /api/learnworlds/webhook` that processes LearnWorlds event notifications.

#### Scenario: Valid webhook received
- **WHEN** LearnWorlds sends a valid webhook with proper signature
- **THEN** the system SHALL process the event, update user progress, and return HTTP 200

#### Scenario: Invalid webhook signature
- **WHEN** a webhook request is received with an invalid signature
- **THEN** the system SHALL return HTTP 401 with `{ success: false, error: "Invalid webhook signature" }`

### Requirement: Webhook signature verification
The system SHALL verify webhook signatures using the `LEARNWORLDS_WEBHOOK_SECRET` environment variable.

#### Scenario: Signature verification process
- **WHEN** receiving a webhook request
- **THEN** the system SHALL extract the signature from request headers, recreate the expected signature from the payload, and reject requests with mismatched signatures

### Requirement: Lesson completion event processing
The system SHALL process `user.lesson.completed` events to unlock corresponding sprint tools.

#### Scenario: Lesson 1 completion unlocks Sprint 0
- **WHEN** a `user.lesson.completed` event is received for Lesson 1
- **THEN** the system SHALL unlock Sprint 0 (WOOP tool) for that user

#### Scenario: Sequential lesson unlocking
- **WHEN** a `user.lesson.completed` event is received for Lesson N
- **THEN** the system SHALL unlock Sprint N-1 for that user

#### Scenario: User not found during webhook
- **WHEN** a webhook event references a `learnworlds_user_id` that does not exist
- **THEN** the system SHALL log an error and return HTTP 404 with `{ success: false, error: "User not found" }`

### Requirement: Course completion event processing
The system SHALL process `user.course.completed` events to mark overall course completion.

#### Scenario: Course completion recorded
- **WHEN** a `user.course.completed` event is received
- **THEN** the system SHALL update the user record with course completion status and timestamp

### Requirement: User enrollment event processing
The system SHALL process `user.enrolled` events to initialize user progress tracking.

#### Scenario: New enrollment creates progress records
- **WHEN** a `user.enrolled` event is received
- **THEN** the system SHALL create initial progress records for all tools in locked state

### Requirement: Webhook timestamp validation
The system SHALL validate webhook timestamps to prevent replay attacks.

#### Scenario: Recent webhook accepted
- **WHEN** a webhook has a timestamp within acceptable range
- **THEN** the system SHALL process the event

#### Scenario: Old webhook rejected
- **WHEN** a webhook has a timestamp that is too old
- **THEN** the system SHALL reject the webhook to prevent replay attacks

### Requirement: Idempotent webhook processing
The system SHALL handle duplicate webhook deliveries gracefully without creating duplicate unlock events.

#### Scenario: Duplicate webhook ignored
- **WHEN** the same webhook event is received multiple times (same event ID)
- **THEN** the system SHALL process it only once and return success for subsequent deliveries

### Requirement: Webhook rate limiting
The system SHALL rate limit webhook requests to prevent abuse.

#### Scenario: Normal webhook rate accepted
- **WHEN** webhooks arrive at normal frequency
- **THEN** the system SHALL process all events

#### Scenario: Excessive webhook rate blocked
- **WHEN** webhooks exceed the rate limit threshold
- **THEN** the system SHALL return HTTP 429 Too Many Requests
