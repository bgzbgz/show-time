# Guru Suite API Documentation

## Overview

The Guru Suite provides client-side gurus (team leaders/facilitators) with an admin interface to monitor their team's progress through the Fast Track Program. Access is granted via unique sprint-specific codes.

## Base URL

```
/api/guru
```

## Authentication

All endpoints use code-based authentication. Each organization receives a unique 8-character alphanumeric code (e.g., "LUXO-WOOP") per sprint. Codes are validated on each request.

---

## Endpoints

### 1. Validate Access Code

**POST** `/api/guru/validate-code`

Validates a guru access code and returns organization information.

**Request Body:**
```json
{
  "code": "LUXO-WOOP"
}
```

**Success Response (200):**
```json
{
  "data": {
    "valid": true,
    "organization": "Luxottica",
    "organization_slug": "luxottica",
    "sprint_id": 0,
    "guru_name": "Maria Rossi"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid code"
}
```

**Notes:**
- Codes are case-insensitive (converted to uppercase)
- Only active codes (is_active = true) are valid
- Non-expired codes only (if expires_at is set)

---

### 2. Get Dashboard Data

**GET** `/api/guru/dashboard/:code`

Retrieves complete dashboard data for a guru's organization and sprint.

**URL Parameters:**
- `code` (string, required): Guru access code

**Success Response (200):**
```json
{
  "data": {
    "organization": {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Luxottica",
      "slug": "luxottica"
    },
    "sprint": {
      "id": 0,
      "name": "WOOP"
    },
    "guru": {
      "name": "Maria Rossi",
      "email": "maria.rossi@luxottica.com"
    },
    "team_progress": {
      "total": 7,
      "completed": 3,
      "in_progress": 2,
      "not_started": 2
    },
    "members": [
      {
        "id": "aaaa1111-1111-1111-1111-111111111111",
        "full_name": "Paolo Bianchi",
        "email": "paolo.bianchi@luxottica.com",
        "status": "completed",
        "submitted_at": "2024-02-08T10:30:00Z",
        "created_at": "2024-02-03T00:00:00Z"
      }
      // ... more members
    ],
    "guru_guide": {
      "id": "...",
      "sprint_id": 0,
      "file_path": "/content/guru-guides/sprint_00_woop_guru_guide.pdf",
      "file_name": "WOOP Guru Guide"
    },
    "meeting_notes": {
      "id": "...",
      "organization_id": "...",
      "sprint_id": 0,
      "notes_content": {
        "discussion_points": "...",
        "key_insights": "...",
        "concerns": "...",
        "next_steps": "..."
      },
      "action_items": [
        {
          "task": "Follow up with Elena",
          "assignee": "Maria Rossi",
          "due": "2024-02-15",
          "status": "pending"
        }
      ],
      "meeting_date": "2024-02-11"
    }
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid code"
}
```

**Member Status Values:**
- `completed`: Tool submission completed
- `in_progress`: User has started but not completed
- `not_started`: No progress record exists

**Sprint Name Mapping:**
- 0: WOOP
- 1: Know Thyself
- 2: Dream
- 3: Values
- 4: Team

---

### 3. Get Submission

**GET** `/api/guru/submission/:code/:userId`

Retrieves a specific team member's tool submission.

**URL Parameters:**
- `code` (string, required): Guru access code
- `userId` (UUID, required): Team member's user ID

**Success Response (200):**
```json
{
  "data": {
    "user_name": "Paolo Bianchi",
    "submission": {
      "id": "sub11111-1111-1111-1111-111111111111",
      "user_id": "aaaa1111-1111-1111-1111-111111111111",
      "sprint_id": 0,
      "tool_slug": "woop",
      "submission_data": {
        "wish": "I want to become a more effective leader...",
        "outcome": "My team consistently exceeds targets by 20%...",
        "obstacle_internal": "I tend to micromanage...",
        "obstacle_external": "Heavy meeting load...",
        "plan_if_then": "IF I feel the urge to check on my team work...",
        "commitment_level": "9",
        "first_action": "Tomorrow I will identify 3 tasks...",
        "reflection": "This exercise helped me realize..."
      },
      "status": "completed",
      "submitted_at": "2024-02-08T10:30:00Z"
    }
  }
}
```

**Error Responses:**

*401 - Invalid Code:*
```json
{
  "error": "Invalid code"
}
```

*403 - Access Denied:*
```json
{
  "error": "Access denied"
}
```

**Security:**
- Verifies user belongs to same organization as guru
- Returns 403 if cross-organization access attempted
- Only completed submissions are typically accessed (enforced by frontend)

---

### 4. Save Meeting Notes

**POST** `/api/guru/meeting-notes/:code`

Creates or updates meeting notes for an organization-sprint combination.

**URL Parameters:**
- `code` (string, required): Guru access code

**Request Body:**
```json
{
  "notes_content": {
    "discussion_points": "Team discussed their WOOPs openly...",
    "key_insights": "Most team members identified time management...",
    "concerns": "Elena and Luca have not completed yet...",
    "next_steps": "Schedule 1:1s with incomplete members..."
  },
  "action_items": [
    {
      "task": "Follow up with Elena on her WOOP progress",
      "assignee": "Maria Rossi",
      "due": "2024-02-15",
      "status": "pending"
    },
    {
      "task": "Schedule delegation workshop",
      "assignee": "Maria Rossi",
      "due": "2024-02-20",
      "status": "pending"
    }
  ],
  "meeting_date": "2024-02-11"
}
```

**Success Response (200):**
```json
{
  "data": {
    "success": true,
    "data": {
      "id": "...",
      "organization_id": "...",
      "sprint_id": 0,
      "notes_content": { /* as submitted */ },
      "action_items": [ /* as submitted */ ],
      "meeting_date": "2024-02-11",
      "updated_at": "2024-02-13T12:00:00Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid code"
}
```

**Notes:**
- Uses PostgreSQL upsert (ON CONFLICT) for idempotency
- Unique constraint on (organization_id, sprint_id)
- Automatically updates `updated_at` timestamp
- JSONB fields allow flexible structure

---

## Database Schema

### Tables Used

**guru_access_codes**
- `id` (UUID): Primary key
- `organization_id` (UUID): Foreign key to organizations
- `sprint_id` (INTEGER): Sprint number
- `code` (TEXT): Unique access code
- `guru_name` (TEXT): Facilitator name
- `guru_email` (TEXT): Facilitator email
- `is_active` (BOOLEAN): Code activation status
- `expires_at` (TIMESTAMPTZ): Optional expiration date

**organizations**
- `id` (UUID): Primary key
- `name` (TEXT): Organization name
- `slug` (TEXT): URL-friendly identifier (unique)

**users**
- `id` (UUID): Primary key
- `email` (TEXT): User email (unique)
- `full_name` (TEXT): Display name
- `organization_id` (UUID): Foreign key to organizations

**tool_submissions**
- `id` (TEXT): Primary key
- `user_id` (UUID): Foreign key to users
- `sprint_id` (INTEGER): Sprint number
- `tool_slug` (TEXT): Tool identifier
- `submission_data` (JSONB): Flexible submission content
- `status` (TEXT): Submission status
- `submitted_at` (TIMESTAMPTZ): Completion timestamp

**user_progress**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users
- `sprint_id` (INTEGER): Sprint number
- `tool_slug` (TEXT): Tool identifier
- `status` (TEXT): Progress status (not_started, in_progress, completed)
- `completed_at` (TIMESTAMPTZ): Completion timestamp
- Unique constraint: (user_id, sprint_id, tool_slug)

**guru_guides**
- `id` (UUID): Primary key
- `sprint_id` (INTEGER): Sprint number (unique)
- `file_path` (TEXT): Path to PDF file
- `file_name` (TEXT): Display name

**guru_meeting_notes**
- `id` (UUID): Primary key
- `organization_id` (UUID): Foreign key to organizations
- `sprint_id` (INTEGER): Sprint number
- `guru_code_id` (UUID): Foreign key to guru_access_codes
- `notes_content` (JSONB): Structured notes
- `action_items` (JSONB): Array of action items
- `meeting_date` (DATE): Meeting date
- Unique constraint: (organization_id, sprint_id)

---

## Test Data

### Test Organizations

| Organization | Slug | Test Code |
|-------------|------|-----------|
| Luxottica | luxottica | LUXO-WOOP |
| Acme Corp | acme-corp | ACME-WOOP |
| TechStart Inc | techstart | TECH-WOOP |

### Luxottica Test Users (7 members)

**Completed (3):**
- Paolo Bianchi (paolo.bianchi@luxottica.com)
- Giulia Ferrari (giulia.ferrari@luxottica.com)
- Marco Romano (marco.romano@luxottica.com)

**In Progress (2):**
- Elena Costa (elena.costa@luxottica.com) - has autosave draft
- Luca Moretti (luca.moretti@luxottica.com) - has autosave draft

**Not Started (2):**
- Sofia Ricci (sofia.ricci@luxottica.com)
- Andrea Gallo (andrea.gallo@luxottica.com)

### Expected Dashboard Stats (LUXO-WOOP)

- Total: 7
- Completed: 3 (43%)
- In Progress: 2 (29%)
- Not Started: 2 (29%)

---

## Error Handling

All endpoints follow a consistent error format:

```json
{
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- 200: Success
- 400: Bad Request (missing required fields)
- 401: Unauthorized (invalid or inactive code)
- 403: Forbidden (cross-organization access attempt)
- 500: Internal Server Error

---

## Security Considerations

1. **Code-Based Authentication**: Codes should be distributed securely (email, secure portal)
2. **Organization Isolation**: All queries filter by organization_id to prevent data leakage
3. **Read-Only Submissions**: Gurus can view but not modify team member submissions
4. **No User PII Exposure**: Only necessary user data (name, email, status) is exposed
5. **JSONB Validation**: Backend should validate JSONB structure to prevent malformed data

---

## Future Enhancements

- [ ] Add pagination for large teams (>50 members)
- [ ] Implement Row Level Security (RLS) policies in Supabase
- [ ] Add audit logging for guru actions
- [ ] Support bulk data export (CSV, PDF)
- [ ] Add real-time progress updates (WebSockets)
- [ ] Implement code rotation/regeneration
- [ ] Add usage analytics per guru code

