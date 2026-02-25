## ADDED Requirements

### Requirement: Code-based authentication
The system SHALL provide a code-based authentication mechanism where gurus enter a unique access code to gain access to their organization's sprint data without traditional username/password login.

#### Scenario: Valid code entry
- **WHEN** a guru enters a valid 8-character alphanumeric access code
- **THEN** the system validates the code against the database and grants access to the corresponding organization's sprint data

#### Scenario: Invalid code entry
- **WHEN** a guru enters an invalid or non-existent access code
- **THEN** the system displays an error message and denies access

#### Scenario: Inactive code entry
- **WHEN** a guru enters a code that has been deactivated (is_active = false)
- **THEN** the system displays an error message and denies access

### Requirement: Sprint-specific access
The system SHALL associate each access code with a specific organization and sprint combination, ensuring gurus only access data for their assigned sprint.

#### Scenario: Access scope validation
- **WHEN** a guru authenticates with a valid code
- **THEN** the system grants access only to data for the organization and sprint associated with that code

#### Scenario: Multiple sprint isolation
- **WHEN** an organization has multiple active sprints with different codes
- **THEN** each code provides access only to its specific sprint data

### Requirement: Access code format
Access codes MUST be 8-character alphanumeric strings in the format "XXXX-XXXX" (e.g., "LUXO-WOOP") and SHALL be case-insensitive.

#### Scenario: Code format validation
- **WHEN** a guru enters a code in any case combination (e.g., "luxo-woop", "LUXO-WOOP", "Luxo-Woop")
- **THEN** the system converts it to uppercase and validates successfully if the code exists

#### Scenario: Whitespace handling
- **WHEN** a guru enters a code with leading or trailing whitespace
- **THEN** the system trims the whitespace before validation

### Requirement: Organization context retrieval
Upon successful authentication, the system SHALL retrieve and display the organization name, sprint information, and guru name associated with the access code.

#### Scenario: Context display after authentication
- **WHEN** a guru successfully authenticates with code "LUXO-WOOP"
- **THEN** the system displays organization name "Luxottica", sprint name "WOOP", and guru name "Maria Rossi"

### Requirement: Session persistence
The system SHALL maintain the authenticated session while the guru uses the dashboard, without requiring re-entry of the access code for each action.

#### Scenario: Persistent access during session
- **WHEN** a guru has successfully authenticated
- **THEN** the system maintains access to dashboard features without requiring code re-entry until the guru explicitly exits

#### Scenario: Exit and re-authentication
- **WHEN** a guru clicks the "Exit" button
- **THEN** the system clears the session and requires code re-entry for subsequent access

### Requirement: Access code expiration
The system SHALL support optional expiration dates for access codes, automatically denying access to expired codes.

#### Scenario: Unexpired code access
- **WHEN** a guru enters a code with a future expiration date or no expiration date
- **THEN** the system grants access normally

#### Scenario: Expired code denial
- **WHEN** a guru enters a code with an expiration date in the past
- **THEN** the system displays an error message indicating the code has expired and denies access
