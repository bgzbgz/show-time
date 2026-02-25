## ADDED Requirements

### Requirement: SSO token validation endpoint
The system SHALL provide an endpoint at `GET /api/learnworlds/sso/validate` that validates LearnWorlds SSO tokens and returns authenticated session data.

#### Scenario: Valid SSO token with existing user
- **WHEN** a request is made with valid `sso` and `timestamp` query parameters
- **THEN** the system SHALL verify the HMAC-SHA256 signature, lookup the existing user, generate a JWT token, and return `{ success: true, token: JWT, user: {...}, progress: {...} }`

#### Scenario: Valid SSO token with new user
- **WHEN** a request is made with a valid SSO token for a user that does not exist
- **THEN** the system SHALL create a new user record with LearnWorlds identifiers and return authenticated session data

#### Scenario: Invalid HMAC signature
- **WHEN** a request is made with an SSO token that has an invalid HMAC signature
- **THEN** the system SHALL return HTTP 401 with `{ success: false, error: "Invalid signature" }`

#### Scenario: Expired timestamp
- **WHEN** a request is made with an SSO token where the timestamp is older than 5 minutes
- **THEN** the system SHALL return HTTP 401 with `{ success: false, error: "Token expired" }`

### Requirement: HMAC signature verification
The system SHALL verify SSO tokens using HMAC-SHA256 with the `LEARNWORLDS_SSO_SECRET` environment variable.

#### Scenario: Signature recreation and comparison
- **WHEN** validating an SSO token
- **THEN** the system SHALL recreate the HMAC signature from the payload (`email,user_id,timestamp`), compare it to the provided token, and reject mismatches

### Requirement: User lookup and creation
The system SHALL lookup users by `learnworlds_user_id` and create new records when needed.

#### Scenario: Existing user found
- **WHEN** a validated SSO token contains a `learnworlds_user_id` that exists in the database
- **THEN** the system SHALL load the user record and update `sso_verified_at` timestamp

#### Scenario: New user creation
- **WHEN** a validated SSO token contains a `learnworlds_user_id` that does not exist
- **THEN** the system SHALL create a new user record with `learnworlds_user_id`, `learnworlds_email`, and `sso_verified_at` populated

### Requirement: JWT session generation
The system SHALL generate JWT tokens signed with `JWT_SECRET` that expire according to `JWT_EXPIRY`.

#### Scenario: JWT token creation
- **WHEN** a user is successfully authenticated via SSO
- **THEN** the system SHALL generate a JWT token containing `user_id`, `email`, and `learnworlds_user_id` claims

#### Scenario: JWT token expiry
- **WHEN** generating a JWT token
- **THEN** the system SHALL set the expiration time according to the `JWT_EXPIRY` environment variable (default 24 hours)

### Requirement: Email validation
The system SHALL validate that email addresses from SSO tokens conform to standard email format.

#### Scenario: Valid email format
- **WHEN** processing an SSO token with a properly formatted email
- **THEN** the system SHALL accept the email and proceed with authentication

#### Scenario: Invalid email format
- **WHEN** processing an SSO token with an invalid email format
- **THEN** the system SHALL return HTTP 400 with `{ success: false, error: "Invalid email format" }`

### Requirement: Replay attack prevention
The system SHALL prevent replay attacks by validating SSO token timestamps.

#### Scenario: Recent timestamp accepted
- **WHEN** an SSO token has a timestamp within the last 5 minutes
- **THEN** the system SHALL accept the token and proceed with validation

#### Scenario: Old timestamp rejected
- **WHEN** an SSO token has a timestamp older than 5 minutes
- **THEN** the system SHALL reject the token to prevent replay attacks
