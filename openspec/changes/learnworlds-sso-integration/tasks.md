## 1. Database Schema & Migrations

- [x] 1.1 Create migration file `supabase/migrations/YYYYMMDD_add_learnworlds_fields.sql`
- [x] 1.2 Add columns to users table: `learnworlds_user_id TEXT UNIQUE`, `learnworlds_email TEXT`, `sso_verified_at TIMESTAMPTZ`
- [x] 1.3 Add columns to user_progress table: `sprint_id INTEGER`, `is_unlocked BOOLEAN`, `unlocked_at TIMESTAMPTZ`, `started_at TIMESTAMPTZ`, `completed_at TIMESTAMPTZ`
- [x] 1.4 Create backfill script to add sprint_id to existing user_progress records (map tool_slug → sprint_id)
- [x] 1.5 Update unique constraint on user_progress to include sprint_id: `UNIQUE(user_id, sprint_id, tool_slug)`
- [x] 1.6 Run migration on local development database and verify existing queries work

## 2. Backend - LearnWorlds SSO Endpoint

- [x] 2.1 Create `backend/src/routes/learnworlds.ts` route file
- [x] 2.2 Implement `GET /api/learnworlds/sso/validate` endpoint with query params `sso` and `timestamp`
- [x] 2.3 Add HMAC-SHA256 signature validation using `LEARNWORLDS_SSO_SECRET`
- [x] 2.4 Implement signature recreation from payload format: `email,user_id,timestamp`
- [x] 2.5 Add timestamp validation (reject if older than 5 minutes for replay attack prevention)
- [x] 2.6 Add email format validation using regex or validator library
- [x] 2.7 Implement user lookup by `learnworlds_user_id` in Supabase
- [x] 2.8 Implement new user creation with LearnWorlds identifiers when user doesn't exist
- [x] 2.9 Generate JWT token using existing `generateAccessToken` utility from auth middleware
- [x] 2.10 Fetch user progress data to include in response
- [x] 2.11 Return response format: `{ success: true, token: JWT, user: {...}, progress: {...} }`
- [x] 2.12 Add error handling for invalid signature, expired timestamp, invalid email
- [x] 2.13 Mount learnworlds routes at `/api/learnworlds` in `backend/src/index.ts`

## 3. Backend - Webhook Endpoint

- [x] 3.1 Implement `POST /api/learnworlds/webhook` endpoint in `backend/src/routes/learnworlds.ts`
- [x] 3.2 Add webhook signature verification using `LEARNWORLDS_WEBHOOK_SECRET` from headers
- [x] 3.3 Implement timing-safe signature comparison with `crypto.timingSafeEqual`
- [x] 3.4 Parse webhook event payload: event type, user_id, course_id, lesson_id, timestamp
- [x] 3.5 Implement lesson completion handler for `user.lesson.completed` event
- [x] 3.6 Add unlock logic: Lesson N completion → Sprint N-1 unlocked (e.g., Lesson 1 → Sprint 0)
- [x] 3.7 Update user_progress table: set `is_unlocked = true`, record `unlocked_at` timestamp
- [x] 3.8 Implement course completion handler for `user.course.completed` event
- [x] 3.9 Implement user enrollment handler for `user.enrolled` event (initialize progress records)
- [x] 3.10 Add idempotency check: store processed webhook event IDs to prevent duplicate processing
- [x] 3.11 Add webhook timestamp validation (reject if too old)
- [x] 3.12 Implement rate limiting middleware for webhook endpoint (e.g., 100 req/min)
- [x] 3.13 Handle user not found error (return 404 if learnworlds_user_id doesn't exist)
- [x] 3.14 Return appropriate HTTP status codes (200 for success, 401 for invalid signature, 404 for user not found)

## 4. Backend - User Progress Tracking APIs

- [x] 4.1 Create `GET /api/user/progress` endpoint with JWT authentication middleware
- [x] 4.2 Query user_progress table filtered by authenticated user_id
- [x] 4.3 Format response with three arrays: `completed_tools`, `current_unlocked`, `locked_tools`
- [x] 4.4 Include sprint_id, tool_slug, is_unlocked status, and timestamps in response
- [x] 4.5 Create `GET /api/user/submission/:sprint_id/:tool_slug` endpoint with JWT auth
- [x] 4.6 Query tool_submissions table for past submission data
- [x] 4.7 Return 404 if no submission found for requested tool
- [x] 4.8 Implement JWT validation middleware for protected endpoints (use existing `authenticate` middleware)
- [x] 4.9 Add error handling for unauthorized requests (401)

## 5. Frontend - SSO Authentication Flow

- [x] 5.1 Create reusable auth module: `frontend/js/auth.js` or inline in each tool
- [x] 5.2 Implement SSO token detection: parse `sso` and `timestamp` from URL query parameters
- [x] 5.3 Add function to call `/api/learnworlds/sso/validate` with fetch API
- [x] 5.4 Store JWT token in sessionStorage as `authToken` on successful validation
- [x] 5.5 Store user data in sessionStorage as `user` (JSON string)
- [x] 5.6 Implement URL cleanup: remove `sso` and `timestamp` params using `history.replaceState`
- [x] 5.7 Add existing session check: look for `authToken` in sessionStorage if no SSO params
- [x] 5.8 Implement redirect to login or show "Authentication required" if no token found
- [x] 5.9 Add error message display for failed SSO validation (network errors, invalid token)
- [x] 5.10 Add Authorization header to all authenticated API requests: `Bearer {token}`
- [x] 5.11 Implement 401 response handler: clear sessionStorage and prompt re-authentication
- [x] 5.12 Update one tool HTML file as proof of concept: `frontend/tools/module-0-intro-sprint/00-woop.html`

## 6. Frontend - Tool Access Control UI

- [x] 6.1 Create locked tool overlay component (div with lock icon, message, styling)
- [x] 6.2 Add function to check if tool is unlocked using progress data from backend
- [x] 6.3 Show locked overlay with message: "Complete previous lessons in LearnWorlds to unlock this tool"
- [x] 6.4 Add progress indicator on locked tools: "You've completed X/Y sprints"
- [x] 6.5 Add "Continue Learning" button on locked overlay linking back to LearnWorlds course
- [x] 6.6 Implement read-only mode for completed tools: disable all form inputs
- [x] 6.7 Add "View Only" indicator banner at top of completed tools
- [x] 6.8 Display completion timestamp: "Completed on {completed_at}" for completed tools
- [x] 6.9 Load past submission data for completed tools via `GET /api/user/submission/:sprint_id/:tool_slug`
- [x] 6.10 Add visual distinction: locked (grayed out + lock icon), unlocked (active), completed (green checkmark)
- [x] 6.11 Implement tool navigation menu with lock/unlock/completed icons
- [x] 6.12 Add periodic progress polling (every 60 seconds) to detect newly unlocked tools
- [x] 6.13 Show notification "New tool unlocked!" when progress changes
- [x] 6.14 Roll out SSO handler and lock UI to all 31 tool HTML files in `frontend/tools/`

## 7. Testing & Validation

- [x] 7.1 Write unit test for HMAC signature validation (valid and invalid signatures)
- [x] 7.2 Write unit test for timestamp expiry check (recent and old timestamps)
- [x] 7.3 Write unit test for email validation (valid and invalid formats)
- [x] 7.4 Write integration test for SSO endpoint: valid token → user authenticated
- [x] 7.5 Write integration test for SSO endpoint: invalid signature → 401 error
- [x] 7.6 Write integration test for SSO endpoint: expired timestamp → 401 error
- [x] 7.7 Write integration test for SSO endpoint: new user creation flow
- [x] 7.8 Write integration test for webhook endpoint: lesson completed → tool unlocked
- [x] 7.9 Write integration test for webhook: invalid signature → 401 error
- [x] 7.10 Write integration test for webhook: duplicate event → idempotent (no duplicate unlock)
- [x] 7.11 Manual test: Generate valid SSO token and test authentication flow in browser
- [x] 7.12 Manual test: Trigger webhook with test payload and verify unlock logic
- [x] 7.13 Manual test: Verify locked tool shows overlay and prevents interaction
- [x] 7.14 Manual test: Verify completed tool loads in read-only mode
- [x] 7.15 Manual test: Verify existing Guru Suite functionality still works

## 8. Environment & Configuration

- [x] 8.1 Add `LEARNWORLDS_WEBHOOK_SECRET` to `.env` file (backend)
- [x] 8.2 Verify `LEARNWORLDS_SSO_SECRET` exists in `.env` file
- [x] 8.3 Verify `JWT_SECRET` and `JWT_EXPIRY` are configured
- [x] 8.4 Update `.env.example` with new environment variable documentation
- [x] 8.5 Add environment variable validation on backend startup

## 9. LearnWorlds Configuration

- [x] 9.1 Configure SSO redirect URL in LearnWorlds admin panel: `https://myapp.com/tools/woop?sso={token}&timestamp={ts}`
- [x] 9.2 Configure SSO secret sharing between LearnWorlds and backend
- [x] 9.3 Configure webhook endpoint URL in LearnWorlds: `https://myapp.com/api/learnworlds/webhook`
- [x] 9.4 Configure webhook secret sharing between LearnWorlds and backend
- [x] 9.5 Configure webhook events to subscribe to: `user.lesson.completed`, `user.course.completed`, `user.enrolled`
- [x] 9.6 Document lesson-to-sprint mapping in LearnWorlds course structure

## 10. Documentation

- [x] 10.1 Document SSO endpoint in `backend/GURU_API_DOCUMENTATION.md` or create new `LEARNWORLDS_API_DOCUMENTATION.md`
- [x] 10.2 Document webhook endpoint with payload examples
- [x] 10.3 Document user progress endpoints
- [x] 10.4 Create LearnWorlds setup guide: SSO configuration steps
- [x] 10.5 Create webhook configuration guide with signature verification details
- [x] 10.6 Document lesson-to-sprint mapping (which lesson unlocks which sprint)
- [x] 10.7 Create deployment checklist (database migration, env vars, LearnWorlds config)
- [x] 10.8 Document rollback plan for production deployment

## 11. Deployment & Migration

- [x] 11.1 Run database migration on staging environment
- [x] 11.2 Test SSO flow on staging with test LearnWorlds account
- [x] 11.3 Test webhook flow on staging
- [x] 11.4 Backfill existing user progress records with sprint_id
- [x] 11.5 Unlock all tools for existing users (grandfather clause to prevent lockout)
- [x] 11.6 Deploy backend to production with new routes
- [x] 11.7 Deploy frontend assets to production (all 31 updated tool HTML files)
- [x] 11.8 Add production environment variables (LEARNWORLDS_WEBHOOK_SECRET)
- [x] 11.9 Configure production LearnWorlds SSO and webhook URLs
- [x] 11.10 Monitor logs for SSO and webhook errors in first 24 hours
- [x] 11.11 Verify existing Guru Suite functionality in production
- [x] 11.12 Create admin override endpoint for manual tool unlocking (future enhancement, not MVP)
