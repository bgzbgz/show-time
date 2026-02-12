## ADDED Requirements

### Requirement: JWT Token Extraction from URL
The dashboard SHALL accept JWT tokens via URL parameter and store them securely.

#### Scenario: Token extracted from URL parameter
- **WHEN** user lands on `dashboard.html?token=<jwt>`
- **THEN** the dashboard SHALL extract the token from the URL parameter
- **AND** the token SHALL be stored in `localStorage` with key `ft_token`
- **AND** the token SHALL be removed from the URL using `history.replaceState`

#### Scenario: Token not present in URL
- **WHEN** user lands on dashboard without a token parameter
- **THEN** the dashboard SHALL check localStorage for existing token
- **AND** if no token exists, user SHALL be redirected to LearnWorlds login page

#### Scenario: Clean URL after token extraction
- **WHEN** token has been extracted and stored
- **THEN** the URL SHALL be updated to remove the token parameter
- **AND** browser history SHALL NOT contain the URL with token visible

### Requirement: Token Storage in localStorage
The dashboard SHALL persist authentication tokens in browser localStorage.

#### Scenario: Token stored successfully
- **WHEN** a valid token is received
- **THEN** it SHALL be stored using `localStorage.setItem('ft_token', token)`
- **AND** the token SHALL persist across page reloads
- **AND** the token SHALL be accessible to all API calls

#### Scenario: Token retrieved for API calls
- **WHEN** making an API request
- **THEN** the token SHALL be retrieved from localStorage
- **AND** it SHALL be included in Authorization header as `Bearer <token>`

### Requirement: Token Validation
The dashboard SHALL validate authentication tokens with the backend.

#### Scenario: Valid token verification
- **WHEN** dashboard loads with a stored token
- **THEN** it SHALL make a request to `/api/auth/me` endpoint
- **AND** if response is successful, user SHALL be considered authenticated
- **AND** user information SHALL be displayed in the header

#### Scenario: Invalid token handling
- **WHEN** `/api/auth/me` returns 401 Unauthorized
- **THEN** the token SHALL be removed from localStorage
- **AND** user SHALL be redirected to LearnWorlds login page

#### Scenario: Expired token handling
- **WHEN** token has expired during user session
- **THEN** API calls SHALL return 401 Unauthorized
- **AND** dashboard SHALL detect the expired token
- **AND** user SHALL be redirected to LearnWorlds login page

### Requirement: Authorization Header Injection
The dashboard SHALL include authentication tokens in all API requests.

#### Scenario: Token added to API requests
- **WHEN** making any API call to backend
- **THEN** request headers SHALL include `Authorization: Bearer <token>`
- **AND** token SHALL be retrieved from localStorage
- **AND** if no token exists, Authorization header SHALL be omitted

#### Scenario: Unauthenticated request handling
- **WHEN** an API request is made without a valid token
- **THEN** backend SHALL return 401 Unauthorized
- **AND** dashboard SHALL redirect user to LearnWorlds login

### Requirement: LearnWorlds Integration
The dashboard SHALL integrate with LearnWorlds LMS authentication flow.

#### Scenario: Deep link from LearnWorlds
- **WHEN** user clicks dashboard link in LearnWorlds course
- **THEN** LearnWorlds SHALL generate URL with JWT token parameter
- **AND** dashboard SHALL accept the token and authenticate user
- **AND** user SHALL proceed to dashboard without additional login

#### Scenario: Return to LearnWorlds on auth failure
- **WHEN** authentication fails or token is invalid
- **THEN** user SHALL be redirected to LearnWorlds login page
- **AND** redirect URL SHALL be configured (e.g., `https://fasttrack.learnworlds.com/login`)

### Requirement: User Information Display
The dashboard SHALL display authenticated user information in the header.

#### Scenario: User info retrieved and displayed
- **WHEN** token is validated successfully
- **THEN** dashboard SHALL fetch user data from `/api/auth/me`
- **AND** user name SHALL be displayed in header
- **AND** user avatar SHALL be displayed in header (if available)

#### Scenario: User info update
- **WHEN** user data is retrieved
- **THEN** it SHALL be stored in component state
- **AND** header SHALL render with current user name and avatar
- **AND** if avatar is unavailable, initials or default icon SHALL be shown

### Requirement: Session Persistence
The dashboard SHALL maintain user authentication across browser sessions.

#### Scenario: Token persists across page reloads
- **WHEN** user reloads the dashboard page
- **THEN** token SHALL be retrieved from localStorage
- **AND** user SHALL remain authenticated without re-login
- **AND** dashboard SHALL not request token from URL parameter again

#### Scenario: Token persists across browser restarts
- **WHEN** user closes browser and reopens dashboard
- **THEN** token SHALL still exist in localStorage (until expiry)
- **AND** user SHALL remain authenticated
- **AND** if token has expired, user SHALL be redirected to login

### Requirement: Security Considerations
The dashboard SHALL implement security best practices for token handling.

#### Scenario: HTTPS enforcement in production
- **WHEN** dashboard is deployed to production
- **THEN** it MUST be served over HTTPS
- **AND** token transmission SHALL be encrypted
- **AND** HTTP requests SHALL be redirected to HTTPS

#### Scenario: Token exposure minimization
- **WHEN** token appears in URL parameter
- **THEN** it SHALL be removed from URL within 100ms of extraction
- **AND** it SHALL NOT remain in browser history
- **AND** token SHALL NOT be logged to console in production

#### Scenario: Token expiry handled by backend
- **WHEN** backend validates token
- **THEN** backend SHALL enforce token expiry
- **AND** expired tokens SHALL return 401 Unauthorized
- **AND** dashboard SHALL handle expiry by redirecting to login

### Requirement: Error State Communication
The dashboard SHALL communicate authentication errors clearly to users.

#### Scenario: Authentication error message
- **WHEN** authentication fails
- **THEN** user SHALL see a clear error message before redirect
- **AND** message SHALL indicate authentication issue (e.g., "Session expired. Redirecting to login...")
- **AND** redirect SHALL occur after 2-3 seconds

#### Scenario: Network error during auth
- **WHEN** `/api/auth/me` request fails due to network error
- **THEN** dashboard SHALL display "Unable to connect to server" message
- **AND** user SHALL be given option to retry
- **AND** automatic retry SHALL occur after 5 seconds
