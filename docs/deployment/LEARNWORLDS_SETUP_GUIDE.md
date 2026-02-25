# LearnWorlds SSO and Webhook Setup Guide

## Overview

This guide walks you through configuring LearnWorlds to work with the Fast Track tool suite, enabling:
- Single Sign-On (SSO) for seamless authentication
- Webhooks for automatic tool unlocking based on course progress

## Prerequisites

- LearnWorlds school admin access
- Fast Track backend deployed and accessible
- Environment variables configured

## Part 1: SSO Configuration

### Step 1: Generate SSO Secret

1. Log in to your LearnWorlds admin panel
2. Navigate to **Settings** > **Single Sign-On (SSO)**
3. Enable SSO if not already enabled
4. Copy your **SSO Secret Key** (or generate a new one)
5. Add this to your backend `.env` file:
   ```bash
   LEARNWORLDS_SSO_SECRET="your_secret_here"
   ```

### Step 2: Configure SSO Redirect URL

1. In LearnWorlds, go to your course content
2. For each tool (WOOP, Know Thyself, etc.), add a **Custom Button**
3. Set the button URL format:
   ```
   https://your-domain.com/tools/woop?sso={sso_token}&timestamp={timestamp}&email={email}&user_id={user_id}
   ```
4. LearnWorlds will automatically replace placeholders with signed values

### Step 3: Test SSO Flow

1. As a test user, click the tool button in LearnWorlds
2. Verify you're redirected to the tool
3. Verify authentication completes without showing login form
4. Check backend logs for successful SSO validation

## Part 2: Webhook Configuration

### Step 1: Configure Webhook Secret

1. In LearnWorlds admin, go to **Settings** > **Webhooks**
2. Generate or copy your **Webhook Secret**
3. Add to backend `.env`:
   ```bash
   LEARNWORLDS_WEBHOOK_SECRET="your_webhook_secret_here"
   ```

### Step 2: Register Webhook Endpoint

1. In LearnWorlds webhooks settings, click **Add Webhook**
2. Enter your webhook URL:
   ```
   https://your-domain.com/api/learnworlds/webhook
   ```
3. Select the following events:
   - ✓ `user.lesson.completed`
   - ✓ `user.course.completed`
   - ✓ `user.enrolled`

### Step 3: Configure Lesson-to-Sprint Mapping

Map your LearnWorlds lessons to Fast Track sprints:

| Lesson | Lesson ID | Unlocks Sprint | Tools Unlocked |
|--------|-----------|----------------|----------------|
| Intro to WOOP | 1 | Sprint 0 | WOOP |
| Know Thyself Basics | 2 | Sprint 1 | Know Thyself, Ikigai |
| Dreaming Big | 3 | Sprint 2 | Dream |
| Values Discovery | 4 | Sprint 3 | Values |
| Team Building | 5 | Sprint 4 | Team |
| Strategy Execution | 6 | Sprint 5 | Fit, Cash, Energy, Goals, Focus, Performance, Meeting Rhythm |
| Strategy Development | 7 | Sprint 6 | Market Size, Segmentation, Target, VP, VP Testing, Product Dev, Pricing, Brand, Service, Route to Market |
| Organization Design | 8 | Sprint 7 | Core Activities, Processes, Fit ABC, Org Redesign, Employer Branding |
| Technology & AI | 9 | Sprint 8 | Agile Teams, Digitalization, Digital Heart |
| Program Review | 10 | Sprint 9 | Program Overview |

**Important**: The unlock logic is `Sprint ID = Lesson ID - 1`

### Step 4: Test Webhook Delivery

1. Complete a test lesson in LearnWorlds
2. Check your backend logs for webhook receipt
3. Verify tool unlock in database:
   ```sql
   SELECT * FROM user_progress
   WHERE user_id = 'test_user_id'
   AND is_unlocked = true;
   ```
4. Verify webhook event recorded:
   ```sql
   SELECT * FROM webhook_events
   ORDER BY created_at DESC
   LIMIT 10;
   ```

## Part 3: Security Best Practices

### Secret Management

- **Never commit secrets to git**
- Use different secrets for staging/production
- Rotate secrets quarterly
- Use strong, random secrets (min 32 characters)

### Generate Secure Secrets

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### HTTPS Requirements

- **Production MUST use HTTPS**
- SSO tokens in query params require HTTPS to prevent interception
- Webhook endpoints must use HTTPS

### Rate Limiting

- Webhook endpoint is rate-limited to 100 req/min per IP
- Monitor for suspicious activity
- Set up alerts for failed webhook signatures

## Part 4: Monitoring and Debugging

### Enable Logging

In `.env`:
```bash
LOG_LEVEL=debug
```

### Check Logs

```bash
# SSO validation logs
grep "SSO validation" logs/backend.log

# Webhook processing logs
grep "webhook" logs/backend.log
```

### Common Issues

#### Issue: "Invalid signature" on SSO
- **Cause**: Mismatched SSO secret
- **Fix**: Verify `LEARNWORLDS_SSO_SECRET` matches LearnWorlds admin panel

#### Issue: Webhook not unlocking tools
- **Cause**: Incorrect lesson-sprint mapping
- **Fix**: Verify lesson_id in webhook payload matches expected mapping

#### Issue: User not found in webhook
- **Cause**: User hasn't completed SSO login yet
- **Fix**: Ensure users access tools via SSO before receiving webhooks

#### Issue: Timestamp expired errors
- **Cause**: Server time drift
- **Fix**: Sync server time with NTP

## Part 5: Testing Checklist

- [ ] SSO secret configured in backend
- [ ] Webhook secret configured in backend
- [ ] SSO redirect URLs configured for all tools
- [ ] Webhook endpoint registered in LearnWorlds
- [ ] All 3 webhook events subscribed
- [ ] Test user can SSO into WOOP tool
- [ ] Completing lesson 1 unlocks sprint 0
- [ ] Webhook idempotency working (no duplicate unlocks)
- [ ] Locked tool shows overlay with correct message
- [ ] Completed tool loads in read-only mode
- [ ] Backend logs show no errors

## Support

For issues:
1. Check backend logs: `/logs/backend.log`
2. Verify database state: Check `users`, `user_progress`, `webhook_events` tables
3. Test with sample payloads using curl/Postman
4. Contact development team with error details
