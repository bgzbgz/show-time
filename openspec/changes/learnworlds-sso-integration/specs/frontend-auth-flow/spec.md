## ADDED Requirements

### Requirement: SSO token detection on page load
The system SHALL detect SSO tokens in URL query parameters when a tool page loads.

#### Scenario: SSO token present in URL
- **WHEN** a tool page loads with `sso` and `timestamp` query parameters
- **THEN** the system SHALL extract these parameters and initiate SSO validation

#### Scenario: No SSO token in URL
- **WHEN** a tool page loads without SSO parameters
- **THEN** the system SHALL check for existing session in sessionStorage

### Requirement: SSO validation via backend
The system SHALL call the backend SSO validation endpoint to authenticate users.

#### Scenario: Successful SSO validation
- **WHEN** the frontend calls `/api/learnworlds/sso/validate` with valid parameters
- **THEN** the system SHALL receive JWT token, user data, and progress data

#### Scenario: Failed SSO validation
- **WHEN** SSO validation fails
- **THEN** the system SHALL display an error message and not store session data

### Requirement: Session storage management
The system SHALL store authentication tokens and user data in sessionStorage.

#### Scenario: Store session after successful SSO
- **WHEN** SSO validation succeeds
- **THEN** the system SHALL store `authToken` and `user` JSON in sessionStorage

#### Scenario: Clear session on logout
- **WHEN** user logs out or session expires
- **THEN** the system SHALL clear `authToken` and `user` from sessionStorage

### Requirement: Existing session validation
The system SHALL check sessionStorage for existing authentication before requiring new login.

#### Scenario: Valid existing session
- **WHEN** a tool page loads and finds a valid `authToken` in sessionStorage
- **THEN** the system SHALL proceed without re-authentication

#### Scenario: Missing or invalid session
- **WHEN** a tool page loads without valid session
- **THEN** the system SHALL redirect to login or show authentication required message

### Requirement: Tool unlock status check
The system SHALL verify that a user has unlocked a tool before allowing access.

#### Scenario: Tool is unlocked
- **WHEN** the frontend receives progress data indicating the current tool is unlocked
- **THEN** the system SHALL allow full tool access and functionality

#### Scenario: Tool is locked
- **WHEN** the frontend receives progress data indicating the current tool is locked
- **THEN** the system SHALL display the locked tool overlay and prevent interaction

### Requirement: Authenticated API requests
The system SHALL include JWT tokens in Authorization headers for all authenticated backend requests.

#### Scenario: Include Authorization header
- **WHEN** making any authenticated API request
- **THEN** the system SHALL include `Authorization: Bearer {token}` header

#### Scenario: Handle 401 responses
- **WHEN** an API request returns HTTP 401
- **THEN** the system SHALL clear session storage and prompt re-authentication

### Requirement: URL cleanup after SSO
The system SHALL remove SSO parameters from URL after successful authentication.

#### Scenario: Clean URL after SSO
- **WHEN** SSO validation completes successfully
- **THEN** the system SHALL remove `sso` and `timestamp` query parameters from the URL using history API

### Requirement: Error handling for authentication failures
The system SHALL display user-friendly error messages for authentication failures.

#### Scenario: Network error during SSO
- **WHEN** the SSO validation request fails due to network error
- **THEN** the system SHALL display "Connection error. Please try again."

#### Scenario: Invalid token error
- **WHEN** the backend returns "Invalid signature" or "Token expired"
- **THEN** the system SHALL display "Authentication failed. Please try again from LearnWorlds."

### Requirement: Session persistence across tool navigation
The system SHALL maintain authentication state when users navigate between tools.

#### Scenario: Navigate between tools
- **WHEN** a user navigates from one tool to another
- **THEN** the system SHALL preserve the authToken in sessionStorage and not require re-authentication

#### Scenario: Session expires during navigation
- **WHEN** a user navigates but their session has expired
- **THEN** the system SHALL detect the expired token and prompt re-authentication
