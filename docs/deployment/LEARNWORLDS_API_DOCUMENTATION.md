# LearnWorlds Integration API Documentation

## Overview

This document describes the API endpoints for LearnWorlds SSO and webhook integration.

## Base URL

- Development: `http://localhost:3000/api/learnworlds`
- Production: `https://your-domain.com/api/learnworlds`

---

## Endpoints

### 1. SSO Validation

Validates LearnWorlds SSO tokens and returns authenticated session.

**Endpoint**: `GET /api/learnworlds/sso/validate`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sso | string | Yes | HMAC-SHA256 signed token from LearnWorlds |
| timestamp | integer | Yes | Unix timestamp (seconds) |
| email | string | Yes | User email address |
| user_id | string | Yes | LearnWorlds user ID |

**Request Example**:
```http
GET /api/learnworlds/sso/validate?sso=abc123...&timestamp=1234567890&email=user@example.com&user_id=lw_123
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "learnworlds_user_id": "lw_123"
  },
  "progress": {
    "completed_tools": [
      {
        "sprint_id": 0,
        "tool_slug": "woop",
        "completed_at": "2026-02-13T10:30:00Z"
      }
    ],
    "current_unlocked": [
      {
        "sprint_id": 1,
        "tool_slug": "know-thyself",
        "is_unlocked": true,
        "unlocked_at": "2026-02-13T11:00:00Z"
      }
    ],
    "locked_tools": [
      {
        "sprint_id": 2,
        "tool_slug": "dream",
        "is_unlocked": false
      }
    ]
  }
}
```

**Error Responses**:

**400 Bad Request** - Invalid email format:
```json
{
  "error": "Invalid email format"
}
```

**401 Unauthorized** - Invalid signature:
```json
{
  "success": false,
  "error": "Invalid signature"
}
```

**401 Unauthorized** - Expired timestamp:
```json
{
  "success": false,
  "error": "Token expired"
}
```

---

### 2. Webhook Handler

Processes LearnWorlds webhook events for course progress sync.

**Endpoint**: `POST /api/learnworlds/webhook`

**Headers**:
| Header | Required | Description |
|--------|----------|-------------|
| Content-Type | Yes | `application/json` |
| X-LearnWorlds-Signature | Yes | HMAC-SHA256 signature of request body |

**Request Body**:
```json
{
  "event": "user.lesson.completed",
  "user_id": "lw_123",
  "course_id": "course_fast_track",
  "lesson_id": 1,
  "timestamp": 1234567890,
  "event_id": "evt_abc123"
}
```

**Event Types**:

1. **user.lesson.completed**
   - Unlocks corresponding sprint (Sprint ID = Lesson ID - 1)
   - Updates `user_progress` table

2. **user.course.completed**
   - Marks course as completed
   - Updates `users.course_completed_at`

3. **user.enrolled**
   - Initializes progress records for all tools
   - Sets first tool (WOOP) as unlocked

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

**Error Responses**:

**400 Bad Request** - Missing required fields:
```json
{
  "success": false,
  "error": "Missing user_id or lesson_id"
}
```

**401 Unauthorized** - Invalid signature:
```json
{
  "success": false,
  "error": "Invalid webhook signature"
}
```

**404 Not Found** - User not found:
```json
{
  "success": false,
  "error": "User not found"
}
```

**429 Too Many Requests** - Rate limit exceeded:
```json
{
  "success": false,
  "error": "Too many requests"
}
```

---

## Authentication

### JWT Token

The SSO validation endpoint returns a JWT token that must be included in subsequent API requests.

**Format**: Bearer token in Authorization header

**Example**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Claims**:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "user",
  "organization_id": "org-uuid",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Token Expiry**: 24 hours (configurable via `JWT_EXPIRY`)

---

## User Progress Endpoints

### Get User Progress

**Endpoint**: `GET /api/user/progress`

**Headers**:
```http
Authorization: Bearer {token}
```

**Success Response** (200 OK):
```json
{
  "total_tools": 31,
  "completed_tools": 5,
  "in_progress_tools": 2,
  "unlocked_tools": 3,
  "locked_tools": 21,
  "overall_completion_percentage": 16,
  "current_tool": "know-thyself",
  "progress": [
    {
      "tool_slug": "woop",
      "sprint_id": 0,
      "status": "completed",
      "is_unlocked": true,
      "unlocked_at": "2026-02-10T10:00:00Z",
      "started_at": "2026-02-10T10:05:00Z",
      "completed_at": "2026-02-10T11:30:00Z"
    }
  ]
}
```

### Get Tool Submission

**Endpoint**: `GET /api/user/submission/:sprint_id/:tool_slug`

**Headers**:
```http
Authorization: Bearer {token}
```

**Path Parameters**:
- `sprint_id`: Integer (0-9)
- `tool_slug`: String (e.g., "woop", "know-thyself")

**Success Response** (200 OK):
```json
{
  "sprint_id": 0,
  "tool_slug": "woop",
  "submitted_at": "2026-02-10T11:30:00Z",
  "submission_data": {
    "outcome": "Launch Fast Track program successfully",
    "worldChange": "Team is aligned and energized",
    "feeling": "Confident and ready"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "No submission found",
  "message": "No submission found for woop in sprint 0"
}
```

---

## Security

### SSO Signature Verification

**Algorithm**: HMAC-SHA256

**Payload**: `email,user_id,timestamp`

**Example** (Node.js):
```javascript
const crypto = require('crypto');

const email = 'user@example.com';
const userId = 'lw_123';
const timestamp = 1234567890;
const secret = process.env.LEARNWORLDS_SSO_SECRET;

const payload = `${email},${userId},${timestamp}`;
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');
```

### Webhook Signature Verification

**Algorithm**: HMAC-SHA256

**Payload**: Request body (JSON string)

**Header**: `X-LearnWorlds-Signature`

**Example** (Node.js):
```javascript
const crypto = require('crypto');

const payload = JSON.stringify(req.body);
const secret = process.env.LEARNWORLDS_WEBHOOK_SECRET;

const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

const isValid = crypto.timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(expectedSignature)
);
```

### Replay Attack Prevention

- SSO tokens expire after **5 minutes**
- Webhook events older than **5 minutes** are rejected
- Webhook event IDs are stored for idempotency

### Rate Limiting

- Webhook endpoint: **100 requests/minute per IP**
- Exceeded requests return **429 Too Many Requests**

---

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid parameters or missing required fields |
| 401 | Unauthorized | Invalid signature, expired token, or missing auth |
| 404 | Not Found | User or resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error (check logs) |

---

## Testing

### Generate Test SSO Token

```bash
node scripts/generate-sso-token.js --email test@example.com --user_id test123
```

### Test Webhook with curl

```bash
curl -X POST https://your-domain.com/api/learnworlds/webhook \
  -H "Content-Type: application/json" \
  -H "X-LearnWorlds-Signature: abc123..." \
  -d '{
    "event": "user.lesson.completed",
    "user_id": "test123",
    "lesson_id": 1,
    "timestamp": '$(date +%s)',
    "event_id": "evt_test_'$(date +%s)'"
  }'
```

---

## Changelog

### 2026-02-13 - v1.0.0
- Initial release
- SSO validation endpoint
- Webhook handler
- User progress endpoints
