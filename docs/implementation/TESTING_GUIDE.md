# LearnWorlds SSO Integration - Testing Guide

## Test Scenarios

### Unit Tests (7.1-7.3)

#### 7.1 HMAC Signature Validation Test
```javascript
// Test file: backend/src/__tests__/learnworlds.test.ts
// Valid signature test
// Invalid signature test
// Edge cases: empty string, malformed hex
```

#### 7.2 Timestamp Expiry Test
```javascript
// Recent timestamp (within 5 min) → accepted
// Old timestamp (> 5 min) → rejected
// Future timestamp → accepted (within threshold)
```

#### 7.3 Email Validation Test
```javascript
// Valid formats: user@domain.com, user+tag@domain.co.uk
// Invalid formats: missing @, missing domain, spaces
```

### Integration Tests (7.4-7.10)

#### 7.4 SSO Endpoint - Valid Token
- **Given**: Valid SSO token with correct signature
- **When**: GET /api/learnworlds/sso/validate
- **Then**: Returns 200, JWT token, user data, progress

#### 7.5 SSO Endpoint - Invalid Signature
- **Given**: SSO token with incorrect signature
- **When**: GET /api/learnworlds/sso/validate
- **Then**: Returns 401, error message

#### 7.6 SSO Endpoint - Expired Timestamp
- **Given**: Valid signature but timestamp > 5 minutes old
- **When**: GET /api/learnworlds/sso/validate
- **Then**: Returns 401, "Token expired"

#### 7.7 SSO Endpoint - New User Creation
- **Given**: Valid SSO token for non-existent user
- **When**: GET /api/learnworlds/sso/validate
- **Then**: Creates new user, returns 200

#### 7.8 Webhook - Lesson Completed Unlocks Tool
- **Given**: Valid webhook with event: user.lesson.completed, lesson_id: 1
- **When**: POST /api/learnworlds/webhook
- **Then**: Sprint 0 tools are unlocked for user

#### 7.9 Webhook - Invalid Signature
- **Given**: Webhook with invalid signature
- **When**: POST /api/learnworlds/webhook
- **Then**: Returns 401

#### 7.10 Webhook - Idempotency
- **Given**: Same webhook event sent twice (same event_id)
- **When**: POST /api/learnworlds/webhook (2x)
- **Then**: Processes once, returns success on duplicate

### Manual Tests (7.11-7.15)

#### 7.11 Generate Valid SSO Token
```bash
# Node.js script to generate test token
node scripts/generate-sso-token.js --email test@example.com --user_id test123
```

#### 7.12 Test Webhook with Payload
```bash
# Use curl or Postman
curl -X POST http://localhost:3000/api/learnworlds/webhook \
  -H "Content-Type: application/json" \
  -H "X-LearnWorlds-Signature: <calculated_signature>" \
  -d '{"event":"user.lesson.completed","user_id":"test123","lesson_id":1}'
```

#### 7.13 Verify Locked Tool UI
1. Access tool URL directly without SSO token
2. Should see locked overlay
3. Verify "Continue Learning" button links to LearnWorlds

#### 7.14 Verify Completed Tool Read-Only
1. Complete a tool
2. Reload tool page
3. Verify "View Only" banner
4. Verify all inputs are disabled

#### 7.15 Verify Guru Suite Compatibility
1. Access /api/guru/dashboard/:code
2. Verify existing functionality unchanged
3. Check that user_progress queries work with new columns

## Test Data

### Sample SSO Token Generation
```javascript
const crypto = require('crypto');

const email = 'test@example.com';
const userId = 'lw_test_123';
const timestamp = Math.floor(Date.now() / 1000);
const secret = process.env.LEARNWORLDS_SSO_SECRET;

const payload = `${email},${userId},${timestamp}`;
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

console.log(`SSO URL: https://myapp.com/tools/woop?sso=${signature}&timestamp=${timestamp}&email=${email}&user_id=${userId}`);
```

### Sample Webhook Payload
```json
{
  "event": "user.lesson.completed",
  "user_id": "lw_test_123",
  "course_id": "course_fast_track",
  "lesson_id": 1,
  "timestamp": 1234567890,
  "event_id": "evt_abc123"
}
```

## Running Tests

```bash
# Backend unit tests
cd backend
npm test

# Integration tests
npm run test:integration

# E2E tests (if implemented)
npm run test:e2e
```

## Test Checklist

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Manual SSO flow tested
- [ ] Manual webhook flow tested
- [ ] Locked tool UI verified
- [ ] Completed tool read-only mode verified
- [ ] Guru Suite backward compatibility verified
- [ ] Error handling tested (network failures, invalid data)
- [ ] Rate limiting tested (webhook endpoint)
- [ ] Session expiry handling tested
