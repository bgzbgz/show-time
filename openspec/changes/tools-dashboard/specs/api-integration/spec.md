## ADDED Requirements

### Requirement: Backend API Base URL
The dashboard SHALL connect to backend API at configured base URL.

#### Scenario: Local development base URL
- **WHEN** dashboard runs in local development
- **THEN** API base URL SHALL be `http://localhost:3000`
- **AND** all API calls SHALL be prefixed with this URL

#### Scenario: Production base URL
- **WHEN** dashboard runs in production
- **THEN** API base URL SHALL be configurable (environment-specific)
- **AND** base URL SHALL use HTTPS protocol
- **AND** base URL SHALL be set via configuration or environment detection

### Requirement: Tools Endpoint
The dashboard SHALL fetch all 30 tools with user progress via tools endpoint.

#### Scenario: Fetch all tools
- **WHEN** dashboard needs tool data
- **THEN** it SHALL call GET `/api/tools` endpoint
- **AND** request SHALL include Authorization header with Bearer token
- **AND** response SHALL return array of 30 tools

#### Scenario: Tools response structure
- **WHEN** `/api/tools` returns successfully
- **THEN** response SHALL include for each tool:
  - `id`: unique tool identifier
  - `sprint`: sprint number (0-29)
  - `name`: tool display name
  - `slug`: kebab-case identifier for URL construction
  - `module`: module ID (0-4)
  - `status`: one of "locked", "unlocked", "in_progress", "completed"
  - `progress`: percentage (0-100) for in-progress tools
  - `dependencies`: array of tool IDs that must be completed first

#### Scenario: Tools endpoint authentication required
- **WHEN** calling `/api/tools` without valid token
- **THEN** backend SHALL return 401 Unauthorized
- **AND** dashboard SHALL redirect to authentication flow

### Requirement: User Progress Endpoint
The dashboard SHALL fetch overall progress summary via user progress endpoint.

#### Scenario: Fetch user progress summary
- **WHEN** dashboard needs aggregate progress data
- **THEN** it SHALL call GET `/api/user/progress` endpoint
- **AND** request SHALL include Authorization header with Bearer token
- **AND** response SHALL return overall progress statistics

#### Scenario: User progress response structure
- **WHEN** `/api/user/progress` returns successfully
- **THEN** response SHALL include:
  - `completed`: count of completed tools
  - `total`: total number of tools (30)
  - `percentage`: completion percentage (0-100)
  - `currentSprint`: sprint number user is currently on
  - `unlockedTools`: count of unlocked but not started tools

#### Scenario: Progress endpoint caching
- **WHEN** dashboard fetches progress multiple times
- **THEN** backend MAY return cached data with short TTL
- **AND** dashboard SHALL accept cached responses
- **AND** data freshness SHALL be acceptable for UX

### Requirement: User Info Endpoint
The dashboard SHALL fetch authenticated user information via auth endpoint.

#### Scenario: Fetch current user info
- **WHEN** dashboard validates authentication
- **THEN** it SHALL call GET `/api/auth/me` endpoint
- **AND** request SHALL include Authorization header with Bearer token
- **AND** response SHALL return user profile data

#### Scenario: User info response structure
- **WHEN** `/api/auth/me` returns successfully
- **THEN** response SHALL include:
  - `id`: user unique identifier
  - `name`: user's full name
  - `email`: user's email address
  - `avatar`: URL to user's avatar image (optional)
  - `token`: validated token (optional, for refresh)

#### Scenario: Token validation via auth endpoint
- **WHEN** dashboard loads with stored token
- **THEN** calling `/api/auth/me` SHALL validate token
- **AND** successful response (200) SHALL indicate valid token
- **AND** 401 response SHALL indicate invalid/expired token

### Requirement: Tool Data Endpoint
The dashboard SHALL fetch completed tool data via tool-specific endpoint.

#### Scenario: Fetch tool summary data
- **WHEN** user views summary for completed tool
- **THEN** dashboard SHALL call GET `/api/tools/{slug}/data` endpoint
- **AND** {slug} SHALL be the tool's kebab-case identifier
- **AND** request SHALL include Authorization header

#### Scenario: Tool data response structure
- **WHEN** `/api/tools/{slug}/data` returns successfully
- **THEN** response SHALL include completed tool outputs
- **AND** response format MAY be JSON, HTML, or mixed content
- **AND** structure SHALL be tool-specific (varies per tool)

#### Scenario: Tool data not found
- **WHEN** tool data does not exist for completed tool
- **THEN** backend SHALL return 404 Not Found
- **AND** dashboard SHALL display "No summary available" message

### Requirement: Centralized API Client
The dashboard SHALL implement a centralized API client for all backend requests.

#### Scenario: API client structure
- **WHEN** dashboard makes API calls
- **THEN** it SHALL use centralized `api` object with methods:
  - `api.getTools()`: fetch tools list
  - `api.getUserProgress()`: fetch progress summary
  - `api.getUserInfo()`: fetch user info
  - `api.getToolData(slug)`: fetch tool data

#### Scenario: Authentication token injection
- **WHEN** API client makes request
- **THEN** it SHALL retrieve token from localStorage
- **AND** it SHALL add Authorization header: `Bearer <token>`
- **AND** if no token exists, header SHALL be omitted

#### Scenario: Request headers
- **WHEN** API client makes request
- **THEN** headers SHALL include:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (if token exists)
- **AND** additional headers MAY be added as needed

### Requirement: Error Handling
The dashboard SHALL handle API errors gracefully and inform users.

#### Scenario: Network error handling
- **WHEN** API request fails due to network issue
- **THEN** dashboard SHALL display error message "Unable to connect to server"
- **AND** retry option SHALL be provided
- **AND** cached data MAY be used as fallback

#### Scenario: 401 Unauthorized error
- **WHEN** API returns 401 Unauthorized
- **THEN** dashboard SHALL remove invalid token from localStorage
- **AND** user SHALL be redirected to LearnWorlds login
- **AND** current state SHALL not be saved

#### Scenario: 404 Not Found error
- **WHEN** API returns 404 for resource
- **THEN** dashboard SHALL display appropriate message (e.g., "Data not found")
- **AND** user SHALL be able to continue using dashboard
- **AND** error SHALL not crash application

#### Scenario: 500 Server Error
- **WHEN** API returns 500 Internal Server Error
- **THEN** dashboard SHALL display "Server error. Please try again later."
- **AND** error details SHALL be logged to console (dev mode)
- **AND** user SHALL be able to retry or continue with cached data

#### Scenario: Timeout handling
- **WHEN** API request exceeds timeout (e.g., 30 seconds)
- **THEN** dashboard SHALL cancel request
- **AND** timeout error message SHALL be displayed
- **AND** retry option SHALL be available

### Requirement: Response Validation
The dashboard SHALL validate API responses to prevent rendering errors.

#### Scenario: Response structure validation
- **WHEN** API response is received
- **THEN** dashboard SHALL verify expected fields exist
- **AND** if structure is invalid, error SHALL be logged
- **AND** fallback data or error message SHALL be displayed

#### Scenario: Empty response handling
- **WHEN** API returns empty response where data expected
- **THEN** dashboard SHALL display appropriate empty state
- **AND** application SHALL not crash or show undefined values

#### Scenario: Malformed JSON handling
- **WHEN** API returns invalid JSON
- **THEN** dashboard SHALL catch parse error
- **AND** error message SHALL indicate data format issue
- **AND** retry option SHALL be provided

### Requirement: Request Retry Logic
The dashboard SHALL implement retry logic for failed API requests.

#### Scenario: Automatic retry on network failure
- **WHEN** API request fails due to network error
- **THEN** dashboard SHALL automatically retry up to 3 times
- **AND** retry delay SHALL increase exponentially (1s, 2s, 4s)
- **AND** after 3 failures, error SHALL be shown to user

#### Scenario: Manual retry option
- **WHEN** API request fails and error is displayed
- **THEN** a "Retry" button SHALL be available
- **AND** clicking SHALL immediately retry the failed request
- **AND** success SHALL update UI with fetched data

#### Scenario: No retry on authentication errors
- **WHEN** API returns 401 Unauthorized
- **THEN** dashboard SHALL NOT retry request
- **AND** user SHALL be redirected to authentication immediately
- **AND** no retry attempts SHALL be made

### Requirement: CORS Configuration
The dashboard SHALL handle Cross-Origin Resource Sharing (CORS) correctly.

#### Scenario: Same-origin requests in production
- **WHEN** dashboard and API are on same domain
- **THEN** CORS SHALL not be an issue
- **AND** requests SHALL succeed without CORS headers

#### Scenario: Cross-origin requests in development
- **WHEN** dashboard (frontend) and API (backend) are on different origins
- **THEN** backend SHALL send appropriate CORS headers
- **AND** dashboard SHALL include credentials if needed
- **AND** preflight OPTIONS requests SHALL be handled by backend

### Requirement: Request Cancellation
The dashboard SHALL support cancelling in-flight API requests when appropriate.

#### Scenario: Cancel request on component unmount
- **WHEN** dashboard navigates away during API request
- **THEN** in-flight request SHALL be cancelled
- **AND** response SHALL not attempt to update unmounted component
- **AND** no memory leaks SHALL occur

#### Scenario: Cancel request on new request
- **WHEN** dashboard makes new request before previous completes
- **THEN** previous request MAY be cancelled (if same endpoint)
- **AND** only latest request SHALL be processed
- **AND** UI SHALL reflect only latest data

### Requirement: API Response Caching
The dashboard MAY implement client-side caching for API responses.

#### Scenario: Cache tools list response
- **WHEN** `/api/tools` is called
- **THEN** response MAY be cached in memory for 30 seconds
- **AND** subsequent calls within 30s SHALL use cache
- **AND** after 30s, fresh request SHALL be made

#### Scenario: Cache user info response
- **WHEN** `/api/auth/me` is called
- **THEN** response MAY be cached for session duration
- **AND** cache SHALL be cleared on logout or auth error

#### Scenario: No caching for tool data
- **WHEN** `/api/tools/{slug}/data` is called
- **THEN** response SHALL NOT be cached between sessions
- **AND** fresh data SHALL be fetched each time modal opens

### Requirement: Loading States
The dashboard SHALL display loading states during API requests.

#### Scenario: Initial load spinner
- **WHEN** dashboard first loads and fetches data
- **THEN** full-page loading spinner SHALL be displayed
- **AND** spinner SHALL use Fast Track branding (yellow accent)
- **AND** spinner SHALL be replaced by content when data loads

#### Scenario: Inline loading indicators
- **WHEN** fetching data for specific section (e.g., progress update)
- **THEN** inline loading indicator SHALL be shown in that section
- **AND** rest of dashboard SHALL remain interactive
- **AND** indicator SHALL disappear when request completes

#### Scenario: Loading state in modal
- **WHEN** fetching tool data for summary modal
- **THEN** modal SHALL show "Loading summary..." message
- **AND** loading indicator SHALL be centered in modal
- **AND** modal SHALL be responsive during load

### Requirement: API Health Check
The dashboard MAY implement health check to verify backend availability.

#### Scenario: Health check on load
- **WHEN** dashboard initializes
- **THEN** it MAY call `/api/health` endpoint (if available)
- **AND** failure SHALL trigger "Backend unavailable" message
- **AND** dashboard SHALL provide retry or contact support options

#### Scenario: Periodic health monitoring
- **WHEN** dashboard is active for extended period
- **THEN** it MAY periodically check backend health
- **AND** if backend goes down, user SHALL be notified
- **AND** graceful degradation SHALL occur (show cached data)
