## Context

The Fast Track application currently has SSO infrastructure (`/api/auth/sso`) that uses a generic format. We need to add LearnWorlds-specific SSO with a different signature format and webhook integration for course progress sync. The existing codebase uses:

- **Backend**: Express/TypeScript with ESM imports (.js extensions)
- **Database**: Dual approach - Prisma ORM for users/progress + Supabase client for Guru Suite
- **Auth**: JWT-based (existing middleware at `middleware/auth.ts`, service at `services/AuthService.ts`)
- **Progress Tracking**: Existing `user_progress` table tracks 31 tools with status and tool_slug
- **Patterns**: Route files → Services → Supabase/Prisma, asyncHandler wrapper, sendSuccess/sendError utilities

**Key Constraint**: Must maintain backward compatibility with existing Guru Suite and generic SSO endpoint.

**Stakeholders**: LearnWorlds course creators, Fast Track users, development team

## Goals / Non-Goals

**Goals:**
- Add LearnWorlds-specific SSO endpoint at `GET /api/learnworlds/sso/validate` with HMAC-SHA256 validation
- Implement webhook endpoint `POST /api/learnworlds/webhook` for lesson completion events
- Extend `user_progress` table to track sprint_id, unlock timestamps, and completion state
- Frontend SSO handler for seamless authentication (no login form)
- Tool locking UI based on progress state
- Maintain compatibility with existing auth system and Guru Suite

**Non-Goals:**
- Replacing existing `/api/auth/sso` endpoint (leave for backward compatibility)
- Complex course-to-sprint mapping (use simple N→N-1 mapping: Lesson N unlocks Sprint N-1)
- Real-time unlock notifications (use periodic polling from frontend)
- Multi-tenant LearnWorlds support (single account only)

## Decisions

### Decision 1: Separate LearnWorlds Route File vs Extending Existing Auth

**Choice**: Create new `backend/src/routes/learnworlds.ts` for LearnWorlds-specific endpoints

**Rationale**:
- Existing `/api/auth/sso` uses different signature format (`user_id|email|name|timestamp` vs `email,user_id,timestamp`)
- LearnWorlds endpoints serve different purpose (SSO validation + webhooks) vs generic auth
- Easier to maintain and test LearnWorlds-specific logic in isolation
- Clear separation of concerns - LearnWorlds is one LMS integration among potential others

**Alternatives Considered**:
- Extend `/api/auth/sso` to detect format → rejected due to complexity and breaking changes risk
- Create generic LMS abstraction → rejected as premature (only one LMS so far)

### Decision 2: Database Schema Extensions vs New Tables

**Choice**: Extend existing `users` and `user_progress` tables with new columns

**Rationale**:
- Users table gets: `learnworlds_user_id TEXT UNIQUE`, `learnworlds_email TEXT`, `sso_verified_at TIMESTAMPTZ`
- user_progress gets: `sprint_id INTEGER`, `is_unlocked BOOLEAN`, `unlocked_at TIMESTAMPTZ`, `started_at TIMESTAMPTZ`, `completed_at TIMESTAMPTZ`
- Avoids JOIN complexity for every progress query
- Maintains single source of truth for user identity and progress
- Existing columns (`lms_user_id`) can coexist for backward compatibility

**Alternatives Considered**:
- Separate `learnworlds_users` mapping table → rejected due to JOIN overhead
- Event sourcing for progress → rejected as over-engineered for current needs

### Decision 3: Webhook Signature Verification Strategy

**Choice**: Use header-based signature verification (standard LearnWorlds approach)

**Rationale**:
- LearnWorlds sends signature in `X-LearnWorlds-Signature` header (or similar)
- HMAC-SHA256 of request body using `LEARNWORLDS_WEBHOOK_SECRET`
- Timing-safe comparison to prevent timing attacks
- Standard webhook security pattern used by Stripe, GitHub, etc.

**Implementation**:
```typescript
const signature = req.headers['x-learnworlds-signature'];
const expectedSignature = crypto
  .createHmac('sha256', LEARNWORLDS_WEBHOOK_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');
crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
```

**Alternatives Considered**:
- API key in query string → rejected due to security (logs, browser history)
- JWT tokens → rejected as LearnWorlds doesn't support

### Decision 4: Unlock Logic Mapping

**Choice**: Simple linear mapping: Lesson N completion → Sprint N-1 unlock

**Rationale**:
- Clear, predictable progression
- Example: Lesson 1 complete → Sprint 0 (WOOP) unlocks
- Easy to test and validate
- Matches course structure (assuming 1-to-1 lesson-sprint correspondence)

**Implementation**: Store mapping in webhook handler:
```typescript
const sprintToUnlock = lessonId - 1; // Lesson 1 → Sprint 0
```

**Alternatives Considered**:
- Database-driven mapping table → rejected as unnecessary for initial implementation
- Config file mapping → considered for future if mapping becomes complex

### Decision 5: Frontend Session Storage vs Local Storage

**Choice**: Use sessionStorage for auth tokens

**Rationale**:
- Tokens expire when tab closes (better security)
- Prevents persistent login across browser restarts
- Users should authenticate fresh from LearnWorlds each session
- Matches typical LTI/SSO pattern

**Alternatives Considered**:
- localStorage → rejected due to persistence risk
- Cookies → rejected as unnecessary (no server-side session needed beyond JWT)

### Decision 6: Tool Lock Enforcement

**Choice**: Backend enforces locks via middleware, frontend displays locked UI

**Rationale**:
- Security: Frontend checks are UX, backend checks are enforcement
- New middleware: `requireToolUnlock(sprintId, toolSlug)` checks progress before allowing access
- Frontend still checks and shows lock overlay (better UX than 403 error page)

**Implementation**:
```typescript
// Backend middleware
export function requireToolUnlock(sprintId: number, toolSlug: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const progress = await getToolProgress(req.user.id, sprintId, toolSlug);
    if (!progress.is_unlocked) {
      return sendError(res, 'Tool locked', 403);
    }
    next();
  };
}
```

**Alternatives Considered**:
- Frontend-only enforcement → rejected due to security (trivial to bypass)
- Role-based access control (RBAC) → rejected as over-engineered (progress-based is simpler)

### Decision 7: Migration Strategy for Existing Users

**Choice**: Backfill existing user progress records with sprint_id and default unlocked state

**Rationale**:
- Existing users created via generic SSO have `user_progress` records without `sprint_id`
- Migration adds `sprint_id` column (nullable initially)
- Backfill script maps tool_slug → sprint_id using known mapping
- Set all existing records to `is_unlocked: true` (don't lock existing users out)

**Migration SQL**:
```sql
-- Add columns
ALTER TABLE user_progress ADD COLUMN sprint_id INTEGER;
ALTER TABLE user_progress ADD COLUMN is_unlocked BOOLEAN DEFAULT false;
ALTER TABLE user_progress ADD COLUMN unlocked_at TIMESTAMPTZ;
ALTER TABLE user_progress ADD COLUMN started_at TIMESTAMPTZ;
ALTER TABLE user_progress ADD COLUMN completed_at TIMESTAMPTZ;

-- Backfill sprint_id for existing records
UPDATE user_progress SET sprint_id = 0 WHERE tool_slug = 'woop';
UPDATE user_progress SET sprint_id = 1 WHERE tool_slug = 'know-thyself';
-- ... etc for all 31 tools

-- Unlock all tools for existing users (grandfather clause)
UPDATE user_progress SET is_unlocked = true WHERE created_at < NOW();
```

**Alternatives Considered**:
- Force all users to re-unlock → rejected (poor UX for existing users)
- Separate progress tables → rejected (schema divergence)

## Risks / Trade-offs

### Risk 1: LearnWorlds Signature Format Mismatch
**Risk**: User's requirement specifies `email,user_id,timestamp` format, but LearnWorlds docs may differ
**Mitigation**:
- Validate with LearnWorlds SSO documentation before implementation
- Add detailed logging for signature mismatches in development
- Create test harness to generate valid tokens for local testing
- If format differs, adjust signature reconstruction logic

### Risk 2: Webhook Replay Attacks
**Risk**: Attacker could replay valid webhook events to unlock tools incorrectly
**Mitigation**:
- Validate timestamp in webhook payload (reject if > 5 minutes old)
- Store processed webhook event IDs in database for idempotency check
- Rate limit webhook endpoint (e.g., 100 req/min per IP)
- Consider adding `nonce` field to webhook payload if LearnWorlds supports it

### Risk 3: Frontend SSO Token Exposure in URL
**Risk**: SSO token in query parameters could leak via browser history, logs, referrer headers
**Mitigation**:
- Remove `sso` and `timestamp` params from URL after validation using `history.replaceState`
- Use short token expiry (5 minutes)
- Ensure HTTPS in production (no plain HTTP)
- Consider POST-based SSO redirect if LearnWorlds supports it (less likely to leak)

### Risk 4: Database Migration Rollback
**Risk**: Adding non-nullable columns to `user_progress` could fail if table has millions of rows
**Mitigation**:
- Make all new columns nullable initially
- Backfill in batches (e.g., 10k rows at a time)
- Test migration on production snapshot first
- Rollback plan: Drop added columns (data loss acceptable for new columns)

### Risk 5: Lesson-Sprint Mapping Drift
**Risk**: Course structure changes (lessons added/removed) could break unlock logic
**Mitigation**:
- Document lesson-sprint mapping in code comments and external docs
- Add admin endpoint to manually unlock tools (emergency override)
- Consider making mapping configurable via database table in future iteration
- Monitor webhook events for unexpected lesson IDs

### Risk 6: Dual Database Approach Consistency
**Risk**: Using both Prisma (users) and Supabase client (guru suite) could lead to transaction issues
**Mitigation**:
- Keep LearnWorlds writes within Prisma ORM (for transaction support)
- Use Supabase client only for Guru Suite reads (existing pattern)
- Avoid cross-database transactions (user creation + progress in single Prisma transaction)
- Consider migrating Guru Suite to Prisma in future for consistency

### Risk 7: Frontend Session Expiry UX
**Risk**: User completes tool, JWT expires mid-submission, loses work
**Mitigation**:
- Set JWT expiry to 24 hours (long enough for tool completion)
- Implement token refresh logic (use existing `/api/auth/refresh` endpoint)
- Save tool progress to browser localStorage periodically (auto-save)
- Show "Session expiring soon" warning 5 minutes before expiry

## Migration Plan

### Phase 1: Database Schema Changes
1. Create migration file: `supabase/migrations/YYYYMMDD_add_learnworlds_fields.sql`
2. Add columns to `users` table (nullable for backward compatibility)
3. Add columns to `user_progress` table (nullable initially)
4. Run migration on dev environment
5. Verify existing queries still work (Guru Suite, generic SSO)

### Phase 2: Backend Implementation
1. Create `backend/src/routes/learnworlds.ts`
2. Implement SSO validation endpoint (`GET /api/learnworlds/sso/validate`)
3. Implement webhook endpoint (`POST /api/learnworlds/webhook`)
4. Add JWT validation middleware to progress endpoints
5. Mount routes in `backend/src/index.ts` at `/api/learnworlds`
6. Add unit tests for signature validation, unlock logic

### Phase 3: Frontend Integration
1. Add SSO handler to one tool (e.g., `00-woop.html`) as proof of concept
2. Test authentication flow end-to-end
3. Implement lock overlay UI component
4. Implement read-only mode for completed tools
5. Roll out to all 31 tools in `frontend/tools/`

### Phase 4: LearnWorlds Configuration
1. Configure SSO redirect URL in LearnWorlds admin: `https://myapp.com/tools/woop?sso={token}&timestamp={ts}`
2. Configure webhook endpoint: `https://myapp.com/api/learnworlds/webhook`
3. Add webhook secret to production `.env`
4. Test SSO flow from LearnWorlds course

### Phase 5: Backfill Existing Users
1. Run backfill script to add `sprint_id` to existing progress records
2. Unlock all tools for users created before migration (grandfather clause)
3. Verify no users are locked out unexpectedly

### Rollback Strategy
- **If migration fails**: Drop added columns (acceptable for new data)
- **If SSO breaks existing auth**: LearnWorlds routes are separate, can disable without affecting `/api/auth/sso`
- **If webhooks cause issues**: Disable webhook endpoint, manually unlock tools via admin panel
- **If frontend breaks**: Tools still work without SSO (users can use existing auth)

### Deployment Checklist
- [ ] Database migration applied to production
- [ ] Backend deployed with new routes
- [ ] Environment variables added: `LEARNWORLDS_WEBHOOK_SECRET`
- [ ] Frontend assets deployed (all 31 tool HTML files)
- [ ] LearnWorlds SSO redirect URL configured
- [ ] LearnWorlds webhook endpoint configured
- [ ] Test SSO flow from LearnWorlds course
- [ ] Test webhook with dummy lesson completion
- [ ] Monitor logs for errors in first 24 hours
- [ ] Verify existing Guru Suite still works
- [ ] Document API endpoints in `backend/GURU_API_DOCUMENTATION.md`

## Open Questions

1. **LearnWorlds Signature Header Name**: What is the exact header name LearnWorlds uses for webhook signatures? (`X-LearnWorlds-Signature`? `X-Webhook-Signature`?)
   - **Resolution**: Check LearnWorlds webhook documentation, add fallback to check multiple common header names

2. **Lesson-Sprint Mapping**: Is it truly 1-to-1 (Lesson 1→Sprint 0, Lesson 2→Sprint 1, etc.) or is there a more complex mapping?
   - **Resolution**: Confirm with course creator, document in code comments

3. **Multiple Course Support**: Will users enroll in multiple Fast Track courses, or is it a single linear course?
   - **Resolution**: Start with single course assumption, add course_id tracking if multi-course support needed later

4. **Tool Submission Storage**: Current `user_progress` tracks status, but where is tool submission data stored? (Existing `tool_submissions` table?)
   - **Resolution**: Confirm schema for submission data, ensure `GET /api/user/submission/:sprint_id/:tool_slug` retrieves correct data

5. **Webhook Event Ordering**: Can webhooks arrive out of order (Lesson 3 complete before Lesson 2)?
   - **Resolution**: Add validation to only unlock if previous sprints are unlocked (sequential enforcement)

6. **Admin Override**: How should administrators manually unlock tools for users who had issues?
   - **Resolution**: Add admin-only endpoint `POST /api/admin/unlock-tool` in future iteration (not MVP)

7. **Progress Sync Direction**: Should user progress in Fast Track sync back to LearnWorlds (two-way sync)?
   - **Resolution**: Out of scope for MVP (webhooks are one-way: LW → Fast Track). Consider LearnWorlds API for future two-way sync.
