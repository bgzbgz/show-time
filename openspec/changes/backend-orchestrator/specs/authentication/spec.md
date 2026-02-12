# Authentication

## ADDED Requirements

### Requirement: LearnWorlds SSO Integration

The system SHALL accept SSO authentication callbacks from LearnWorlds LMS and issue JWT tokens for authenticated users.

#### Scenario: Valid LearnWorlds SSO callback

- **WHEN** LearnWorlds redirects user to `/api/auth/sso` with signed payload containing user_id, email, name
- **THEN** system validates SSO signature using LearnWorlds API secret
- **AND** system creates or updates user record in shared.users with lms_user_id matching LearnWorlds user_id
- **AND** system issues JWT token with claims (id, email, role, organization_id)
- **AND** system redirects user to frontend with JWT in query parameter or sets httpOnly cookie

#### Scenario: Invalid SSO signature

- **WHEN** SSO callback contains payload with invalid or missing signature
- **THEN** system returns 401 Unauthorized
- **AND** system logs security warning with IP address and timestamp
- **AND** user is redirected to error page with message "Authentication failed"

#### Scenario: First-time user from LearnWorlds

- **WHEN** SSO callback contains user_id not in shared.users
- **THEN** system creates new user record with role "user" by default
- **AND** system initializes user_progress records with all tools locked except Sprint 0
- **AND** system issues JWT and redirects as normal

### Requirement: JWT Token Issuance

The system SHALL issue JWT tokens with user claims and configurable expiration.

#### Scenario: JWT contains required claims

- **WHEN** system issues JWT after successful authentication
- **THEN** token payload includes claims: id (user UUID), email, role (user/admin/guru), organization_id, iat (issued at), exp (expiration)
- **AND** token is signed with JWT_SECRET from environment
- **AND** token expiration is 24 hours by default (configurable via JWT_EXPIRY env var)

#### Scenario: JWT signature is valid

- **WHEN** client presents JWT in Authorization header as "Bearer {token}"
- **THEN** system validates signature using JWT_SECRET
- **AND** system verifies token has not expired
- **AND** system extracts user claims for request context

#### Scenario: Expired JWT rejected

- **WHEN** client presents JWT past expiration time
- **THEN** system returns 401 Unauthorized with error "Token expired"
- **AND** system prompts client to refresh token or re-authenticate

### Requirement: Refresh Token Support

The system SHALL issue refresh tokens with longer expiration for obtaining new access tokens without re-authentication.

#### Scenario: Issue refresh token on authentication

- **WHEN** user successfully authenticates via SSO
- **THEN** system issues refresh token with 7-day expiration (configurable via JWT_REFRESH_EXPIRY)
- **AND** refresh token is stored in httpOnly, secure cookie
- **AND** refresh token includes minimal claims (user id, token_id)

#### Scenario: Obtain new access token via refresh token

- **WHEN** client sends POST to `/api/auth/refresh` with valid refresh token in cookie
- **THEN** system validates refresh token signature and expiration
- **AND** system issues new JWT access token with fresh 24-hour expiration
- **AND** system returns new access token in response
- **AND** system does NOT issue new refresh token (existing one remains valid)

#### Scenario: Invalid refresh token

- **WHEN** client sends refresh request with invalid or expired refresh token
- **THEN** system returns 401 Unauthorized
- **AND** system clears refresh token cookie
- **AND** client must re-authenticate via SSO

### Requirement: Role-Based Access Control

The system SHALL enforce role-based permissions for API endpoints based on JWT claims.

#### Scenario: User role can access own data

- **WHEN** authenticated user with role "user" requests `/api/tools/{slug}/data`
- **THEN** system allows access to user's own submissions only
- **AND** system filters queries by user_id from JWT claims
- **AND** user cannot access other users' data

#### Scenario: Admin role can access all user data

- **WHEN** authenticated user with role "admin" requests `/api/tools/{slug}/data?user_id={id}`
- **THEN** system allows access to specified user's data
- **AND** admin can list all users and their progress
- **AND** admin can export data for any user

#### Scenario: Guru role has coaching access

- **WHEN** authenticated user with role "guru" requests user data
- **THEN** system allows access to users within guru's assigned organizations
- **AND** guru can view user progress and submissions
- **AND** guru can add comments or feedback to submissions

#### Scenario: Unauthorized role access denied

- **WHEN** user with role "user" attempts admin-only endpoint
- **THEN** system returns 403 Forbidden
- **AND** response message is "Insufficient permissions"

### Requirement: Current User Information

The system SHALL provide endpoint for clients to retrieve authenticated user's information.

#### Scenario: Get current user details

- **WHEN** authenticated user sends GET to `/api/auth/me`
- **THEN** system returns 200 OK with user object (id, email, full_name, role, organization_id, created_at, last_login)
- **AND** response includes user's overall progress summary (completed_tools_count, current_tool)

#### Scenario: Unauthenticated me request

- **WHEN** unauthenticated client sends GET to `/api/auth/me`
- **THEN** system returns 401 Unauthorized

### Requirement: Logout

The system SHALL provide logout functionality that invalidates user session.

#### Scenario: User logout

- **WHEN** authenticated user sends POST to `/api/auth/logout`
- **THEN** system clears refresh token cookie
- **AND** system returns 200 OK with message "Logged out successfully"
- **AND** client discards JWT access token

#### Scenario: JWT remains valid until expiration

- **WHEN** user logs out
- **THEN** JWT access token is NOT actively revoked (stateless tokens)
- **AND** token remains valid until natural expiration (24 hours)
- **AND** refresh token is invalidated via cookie clearing
- **AND** for high-security use case, consider JWT blacklist in Redis (future enhancement)
