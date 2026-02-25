# LearnWorlds SSO Integration - Deployment Checklist

## Pre-Deployment

### Code Review
- [ ] All code reviewed and approved
- [ ] No console.log statements in production code
- [ ] Error handling comprehensive
- [ ] Security best practices followed

### Testing
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Manual SSO flow tested on staging
- [ ] Manual webhook flow tested on staging
- [ ] Load testing completed (if applicable)
- [ ] Security audit completed

---

## Staging Deployment

### 1. Database Migration on Staging

```bash
# Connect to staging database
psql $STAGING_DATABASE_URL

# Run migration
\i supabase/migrations/20260213000000_add_learnworlds_fields.sql

# Verify schema changes
\d users
\d user_progress
\d webhook_events

# Check for existing data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM user_progress;
```

**Verification**:
- [ ] Migration applied successfully
- [ ] All new columns exist with correct types
- [ ] Indexes created
- [ ] Existing data intact

### 2. Backfill Existing Data

```sql
-- Verify sprint_id backfill
SELECT tool_slug, sprint_id, COUNT(*)
FROM user_progress
GROUP BY tool_slug, sprint_id
ORDER BY sprint_id, tool_slug;

-- Verify is_unlocked grandfather clause
SELECT is_unlocked, COUNT(*)
FROM user_progress
WHERE created_at < NOW()
GROUP BY is_unlocked;
```

**Expected Results**:
- [ ] All tools have sprint_id assigned
- [ ] Existing users have tools unlocked (is_unlocked = true)

### 3. Deploy Backend to Staging

```bash
# Pull latest code
git pull origin main

# Install dependencies
cd backend
npm install

# Build
npm run build

# Restart service
pm2 restart backend-staging
# OR
systemctl restart backend-staging
```

**Verification**:
- [ ] Backend started successfully
- [ ] Health check endpoint responding: `GET /api/health`
- [ ] No errors in logs

### 4. Deploy Frontend to Staging

```bash
# Pull latest code
cd frontend

# Copy updated files
rsync -av js/ /var/www/html/js/
rsync -av tools/ /var/www/html/tools/

# Restart web server if needed
systemctl reload nginx
```

**Verification**:
- [ ] auth.js accessible
- [ ] tool-access-control.js accessible
- [ ] WOOP tool loads with auth module

### 5. Configure Environment Variables (Staging)

```bash
# Edit .env file
nano backend/.env

# Add/verify:
LEARNWORLDS_SSO_SECRET="staging-sso-secret"
LEARNWORLDS_WEBHOOK_SECRET="staging-webhook-secret"
JWT_SECRET="staging-jwt-secret"
JWT_EXPIRY="24h"
NODE_ENV="staging"
```

**Verification**:
- [ ] All required env vars present
- [ ] No production secrets in staging
- [ ] Restart backend after env changes

### 6. Configure LearnWorlds (Staging School)

**SSO Configuration**:
- [ ] SSO enabled in LearnWorlds staging
- [ ] SSO secret matches backend `LEARNWORLDS_SSO_SECRET`
- [ ] SSO redirect URL: `https://staging.your-domain.com/tools/woop?sso={sso_token}&timestamp={timestamp}&email={email}&user_id={user_id}`

**Webhook Configuration**:
- [ ] Webhook endpoint: `https://staging.your-domain.com/api/learnworlds/webhook`
- [ ] Webhook secret matches backend `LEARNWORLDS_WEBHOOK_SECRET`
- [ ] Events subscribed: `user.lesson.completed`, `user.course.completed`, `user.enrolled`

### 7. Staging Testing

**SSO Flow**:
- [ ] Create test user in LearnWorlds staging
- [ ] Click tool button in course
- [ ] Verify redirect to tool with SSO params
- [ ] Verify authentication succeeds
- [ ] Verify no login form shown
- [ ] Check backend logs for SSO validation

**Webhook Flow**:
- [ ] Complete test lesson in LearnWorlds
- [ ] Verify webhook received in backend logs
- [ ] Check `webhook_events` table for event record
- [ ] Verify tool unlocked in `user_progress` table
- [ ] Access tool and verify it's unlocked

**Tool Locking**:
- [ ] Access locked tool URL directly
- [ ] Verify locked overlay shown
- [ ] Verify "Continue Learning" button works

**Read-Only Mode**:
- [ ] Complete a tool
- [ ] Reload tool page
- [ ] Verify "View Only" banner shown
- [ ] Verify inputs disabled

### 8. Verify Existing Guru Suite

- [ ] Access `/api/guru/dashboard/:code`
- [ ] Verify dashboard loads correctly
- [ ] Verify team progress displays
- [ ] Check no errors related to new schema changes

---

## Production Deployment

### Pre-Production Checklist

- [ ] Staging fully tested and approved
- [ ] Backup plan prepared
- [ ] Rollback plan documented
- [ ] Communication sent to stakeholders
- [ ] Maintenance window scheduled (if needed)

### 1. Database Backup (Production)

```bash
# Full database backup
pg_dump $DATABASE_URL > backup_pre_learnworlds_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
ls -lh backup_pre_learnworlds_*.sql

# Store backup securely
aws s3 cp backup_pre_learnworlds_*.sql s3://backups/database/
```

**Verification**:
- [ ] Backup file created
- [ ] Backup file size reasonable (not 0 bytes)
- [ ] Backup stored in secure location

### 2. Database Migration (Production)

```bash
# Connect to production database (read-only first to verify)
psql $PRODUCTION_DATABASE_URL

# Verify current state
\d users
\d user_progress

# Apply migration (CAREFUL!)
\i supabase/migrations/20260213000000_add_learnworlds_fields.sql

# Verify migration
\d users
\d user_progress
\d webhook_events
```

**Verification**:
- [ ] Migration completed without errors
- [ ] All new columns exist
- [ ] Indexes created
- [ ] Existing data intact

### 3. Backfill Production Data

```sql
-- Verify backfill ran as part of migration
SELECT COUNT(*) FROM user_progress WHERE sprint_id IS NULL;
-- Should be 0

SELECT COUNT(*) FROM user_progress WHERE is_unlocked = true;
-- Should be > 0 (existing users unlocked)
```

**Verification**:
- [ ] All records have sprint_id
- [ ] Existing users have tools unlocked

### 4. Deploy Backend (Production)

```bash
# Deploy via your CI/CD pipeline
# OR manual deployment:

cd backend
git pull origin main
npm ci --production
npm run build

# Restart with zero-downtime
pm2 reload backend-production
# OR
systemctl reload backend-production

# Verify
curl https://your-domain.com/api/health
```

**Verification**:
- [ ] Backend deployed successfully
- [ ] Health check passing
- [ ] No errors in logs
- [ ] Existing endpoints still working

### 5. Deploy Frontend (Production)

```bash
# Deploy static files
cd frontend
rsync -av js/ /var/www/html/js/
rsync -av tools/ /var/www/html/tools/

# Clear CDN cache if applicable
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

# Reload web server
systemctl reload nginx
```

**Verification**:
- [ ] Frontend files deployed
- [ ] Cache cleared
- [ ] Files accessible via browser

### 6. Configure Environment Variables (Production)

```bash
# Update production .env
nano backend/.env

# Set production values:
LEARNWORLDS_SSO_SECRET="production-sso-secret"
LEARNWORLDS_WEBHOOK_SECRET="production-webhook-secret"
JWT_SECRET="production-jwt-secret-min-32-chars"
JWT_EXPIRY="24h"
NODE_ENV="production"
APP_URL="https://your-domain.com"
CORS_ORIGIN="https://your-domain.com"

# Restart backend
pm2 restart backend-production
```

**Verification**:
- [ ] All env vars set correctly
- [ ] Backend restarted
- [ ] No errors in logs

### 7. Configure LearnWorlds (Production)

**SSO Configuration**:
- [ ] Log in to LearnWorlds production admin
- [ ] Enable SSO
- [ ] Set SSO secret (must match backend)
- [ ] Configure SSO redirect URL for each tool button:
  ```
  https://your-domain.com/tools/{tool}?sso={sso_token}&timestamp={timestamp}&email={email}&user_id={user_id}
  ```

**Webhook Configuration**:
- [ ] Add webhook endpoint: `https://your-domain.com/api/learnworlds/webhook`
- [ ] Set webhook secret (must match backend)
- [ ] Subscribe to events:
  - user.lesson.completed
  - user.course.completed
  - user.enrolled
- [ ] Enable webhook

### 8. Production Smoke Tests

**SSO Flow** (5 minutes):
- [ ] Test with real user account
- [ ] Click tool button in LearnWorlds course
- [ ] Verify authentication works
- [ ] Verify tool loads correctly

**Webhook Flow** (10 minutes):
- [ ] Have test user complete a lesson
- [ ] Monitor backend logs for webhook
- [ ] Verify tool unlocked
- [ ] Test user can access newly unlocked tool

**Existing Functionality** (5 minutes):
- [ ] Guru Suite dashboard loads
- [ ] Existing tools work
- [ ] No regression bugs

### 9. Monitor Production (First 24 Hours)

**Immediate** (First hour):
- [ ] Watch backend logs for errors
- [ ] Monitor error rate (should not spike)
- [ ] Check SSO success rate
- [ ] Verify webhooks being received

**Ongoing** (24 hours):
- [ ] Monitor SSO success/failure ratio
- [ ] Check webhook processing times
- [ ] Verify no 401/403 errors from auth
- [ ] Monitor database performance

**Metrics to Track**:
```bash
# SSO validations
grep "SSO validation" logs/backend.log | wc -l

# Failed SSO attempts
grep "Invalid signature" logs/backend.log | wc -l

# Webhooks processed
grep "Webhook processed" logs/backend.log | wc -l

# Errors
grep "ERROR" logs/backend.log | tail -20
```

### 10. Communication

**Before Deployment**:
- [ ] Notify users of upcoming changes
- [ ] Send email with new access instructions

**After Deployment**:
- [ ] Announce successful deployment
- [ ] Share LearnWorlds setup guide
- [ ] Provide support contact info

---

## Rollback Plan

### If SSO Issues

1. **Immediate**: Disable SSO in LearnWorlds admin
2. Revert to previous auth method (if any)
3. Investigate logs for root cause
4. Fix and redeploy when ready

### If Webhook Issues

1. **Immediate**: Disable webhook in LearnWorlds admin
2. Manually unlock tools for affected users via SQL:
   ```sql
   UPDATE user_progress
   SET is_unlocked = true, unlocked_at = NOW()
   WHERE user_id = 'affected_user_id' AND sprint_id = X;
   ```
3. Fix webhook handler
4. Re-enable webhook

### If Database Migration Issues

1. **STOP IMMEDIATELY** if migration fails mid-way
2. Restore from backup:
   ```bash
   pg_restore -d $DATABASE_URL backup_pre_learnworlds_YYYYMMDD.sql
   ```
3. Revert backend deployment
4. Investigate migration issue
5. Fix and retry

### Full Rollback

1. Revert backend to previous version:
   ```bash
   git checkout previous-tag
   npm run build
   pm2 restart backend-production
   ```
2. Restore database from backup (if schema changes made)
3. Revert frontend files
4. Disable LearnWorlds SSO/webhook
5. Notify users of rollback

---

## Post-Deployment

### Week 1
- [ ] Daily log review
- [ ] User feedback collection
- [ ] Bug fixes as needed

### Week 2-4
- [ ] Monitor unlock patterns
- [ ] Verify lesson-sprint mapping accuracy
- [ ] Optimize as needed

### Documentation Updates
- [ ] Update runbook with lessons learned
- [ ] Document any edge cases discovered
- [ ] Share knowledge with team

---

## Emergency Contacts

- Backend Lead: [Contact]
- Database Admin: [Contact]
- LearnWorlds Admin: [Contact]
- On-Call Engineer: [Contact]

---

## Success Criteria

- [ ] Zero-downtime deployment achieved
- [ ] All smoke tests pass
- [ ] No increase in error rate
- [ ] SSO success rate > 95%
- [ ] Webhook delivery success rate > 98%
- [ ] No user-reported critical bugs
- [ ] Guru Suite functionality unchanged
