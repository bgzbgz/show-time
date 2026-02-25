# LearnWorlds External Link Integration - Complete Setup Guide

## 🎯 Overview

This guide shows you how to integrate your 31 Fast Track tools with LearnWorlds using **External Link Learning Activities** - the simplest and most reliable method.

**What this achieves:**
- ✅ Users click button in LearnWorlds → instantly land in your tool (authenticated)
- ✅ Automatic user account creation on first access
- ✅ Progress tracking (which tools are unlocked, completed, locked)
- ✅ Automatic tool unlocking based on lesson completion (via webhooks)

---

## 📋 Prerequisites

### 1. Verify LearnWorlds Plan
- **Required:** Learning Center plan or higher
- **Reason:** API and Webhook features are only available on Learning Center+
- **Check:** Settings → Account → Plan Details

### 2. Backend Requirements
- ✅ Backend deployed and accessible via HTTPS
- ✅ Frontend deployed and accessible via HTTPS
- ✅ Environment variables configured (see below)

### 3. Required Environment Variables

Add these to your backend `.env`:

```bash
# Frontend URL for redirects
FRONTEND_URL=https://your-frontend-domain.com

# LearnWorlds Webhook Secret (you'll get this in Step 4)
LEARNWORLDS_WEBHOOK_SECRET=your_webhook_secret_here

# JWT Secret (if not already set)
JWT_SECRET=your_jwt_secret_here
```

---

## 🔧 Part 1: Create External Link Learning Activities

### For Each Tool (31 Total):

1. **Log in** to LearnWorlds admin panel
2. **Navigate** to your Fast Track course
3. **Go to** Course Outline
4. **Click** "Add Activity"
5. **Select** "External Link" (under Embed category)
6. **Give it a title** (e.g., "WOOP Tool", "Know Thyself Tool")
7. **Click** "Save & Edit" (or Save, then hover and click Settings)
8. **Paste the URL** in the "Page URL" field (see templates below)
9. **Save**

---

### 📝 URL Templates for Your Tools

**Format:**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/TOOL-SLUG
```

**Replace:**
- `YOUR-BACKEND-DOMAIN.com` → Your actual backend domain
- `TOOL-SLUG` → The tool's slug (woop, know-thyself, etc.)

---

### 🎯 Complete URL List for All 31 Tools

**Sprint 0: Intro**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/woop
```

**Sprint 1: Know Thyself**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/know-thyself

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/ikigai
```

**Sprint 2: Dream**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/dream
```

**Sprint 3: Values**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/values
```

**Sprint 4: Team**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/team
```

**Sprint 5: Execution**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/fit

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/cash

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/energy

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/goals

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/focus

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/performance

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/meeting-rhythm
```

**Sprint 6: Strategy**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/market-size

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/segmentation

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/target-segment

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/value-proposition

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/vp-testing

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/product-development

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/pricing

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/brand-marketing

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/customer-service

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/route-to-market
```

**Sprint 7: Organization**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/core-activities

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/processes-decisions

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/fit-abc

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/org-redesign

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/employer-branding
```

**Sprint 8: Technology**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/agile-teams

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/digitalization

https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/digital-heart
```

**Sprint 9: Overview**
```
https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/program-overview
```

---

## 🔔 Part 2: Set Up User Automations (Webhooks)

User Automations automatically unlock tools when users complete lessons.

### Step 1: Get Webhook Credentials

1. **Go to** Settings → Developers → Webhooks
2. **Copy** your Webhook Signature/Secret
3. **Add to** your backend `.env`:
   ```bash
   LEARNWORLDS_WEBHOOK_SECRET="your_secret_here"
   ```

### Step 2: Create Automation for Each Sprint

**Navigation:**
- Go to **User** → **Automations**
- Click **Create New Automation**

**Configuration for Sprint 0 (WOOP):**

**Trigger:**
- **When:** User completes a specific learning activity
- **Which:** Select "Lesson 1: Intro to WOOP" (or whatever your first lesson is called)

**Action:**
- **Then:** Send a Webhook
- **Webhook URL:** `https://YOUR-BACKEND-DOMAIN.com/api/learnworlds/webhook`
- **Method:** POST
- **Add Custom Data:**
  ```json
  {
    "sprint_id": 0,
    "lesson_name": "Intro to WOOP"
  }
  ```

**Repeat for all 9 sprints:**

| Sprint | Lesson | sprint_id | Tools Unlocked |
|--------|--------|-----------|----------------|
| 0 | Intro to WOOP | 0 | woop |
| 1 | Know Thyself Basics | 1 | know-thyself, ikigai |
| 2 | Dreaming Big | 2 | dream |
| 3 | Values Discovery | 3 | values |
| 4 | Team Building | 4 | team |
| 5 | Strategy Execution | 5 | fit, cash, energy, goals, focus, performance, meeting-rhythm |
| 6 | Strategy Development | 6 | market-size, segmentation, target-segment, value-proposition, vp-testing, product-development, pricing, brand-marketing, customer-service, route-to-market |
| 7 | Organization Design | 7 | core-activities, processes-decisions, fit-abc, org-redesign, employer-branding |
| 8 | Technology & AI | 8 | agile-teams, digitalization, digital-heart |
| 9 | Program Review | 9 | program-overview |

---

## ✅ Part 3: Testing

### Test 1: External Link Authentication

1. **Log in** to your LearnWorlds course as a test student
2. **Click** on one of the tool activities (e.g., WOOP)
3. **Verify:**
   - ✅ You are redirected to your tool
   - ✅ You are automatically logged in
   - ✅ The tool loads correctly

### Test 2: New User Creation

1. **Check** your database:
   ```sql
   SELECT * FROM users WHERE learnworlds_user_id = 'test_user_id';
   ```
2. **Verify:**
   - ✅ User was created automatically
   - ✅ Email matches LearnWorlds email
   - ✅ Progress records were initialized

### Test 3: Webhook Unlocking

1. **Complete** Lesson 1 as test student
2. **Check** backend logs for webhook receipt
3. **Check** database:
   ```sql
   SELECT * FROM user_progress
   WHERE user_id = 'test_user_uuid'
   AND sprint_id = 0;
   ```
4. **Verify:**
   - ✅ `is_unlocked = true`
   - ✅ `unlocked_at` timestamp is set

### Test 4: Webhook Signature Verification

1. **Send test webhook** using curl:
   ```bash
   # Generate signature (you'll need your webhook secret)
   PAYLOAD='{"type":"courseCompleted","data":{"user":{"id":"test123"},"course":{"id":"sprint-0"}}}'
   SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "YOUR_WEBHOOK_SECRET" | cut -d' ' -f2)

   # Send webhook
   curl -X POST https://your-backend.com/api/learnworlds/webhook \
     -H "Content-Type: application/json" \
     -H "Learnworlds-Webhook-Signature: v1=$SIGNATURE" \
     -d "$PAYLOAD"
   ```

2. **Check** response is `200 OK` with `{"success": true}`

---

## 🔒 Security Considerations

### 1. HTTPS Required
- ✅ Both backend and frontend MUST use HTTPS in production
- ❌ LearnWorlds won't send webhooks to HTTP endpoints

### 2. Webhook Signature Verification
- ✅ Your backend verifies webhook signatures (already implemented)
- ✅ Prevents unauthorized webhook submissions

### 3. Rate Limiting
- ✅ Webhook endpoint has rate limiting (100 req/min per IP)
- ✅ Prevents DDoS attacks

### 4. User Validation
- ✅ Backend creates users only from valid LearnWorlds user IDs
- ✅ Email format validation
- ✅ No password exposure (users authenticate via LearnWorlds)

---

## 🐛 Troubleshooting

### Issue: "Missing required parameters"
**Cause:** URL doesn't include {{USER_ID}} or {{EMAIL}}
**Fix:** Verify you copied the complete URL template with all variables

### Issue: User redirected but not logged in
**Cause:** Frontend not receiving/processing token
**Fix:** Check that frontend reads `?token=` from URL query params

### Issue: Webhook not unlocking tools
**Cause:** Custom data not configured in automation
**Fix:** Verify `sprint_id` is included in webhook custom data

### Issue: "Invalid webhook signature"
**Cause:** Webhook secret mismatch
**Fix:** Copy exact secret from LearnWorlds → Settings → Developers → Webhooks

### Issue: CORS errors when accessing tools
**Cause:** Backend CORS_ORIGIN doesn't include frontend URL
**Fix:** Add frontend URL to `CORS_ORIGIN` environment variable

---

## 📊 Monitoring & Analytics

### Backend Logs to Monitor

```bash
# Successful authentications
✓ LearnWorlds auth: user@example.com (lw_123) from course sprint-0

# Webhook processing
Course completed: sprint-0, unlocking sprint 0 for user lw_123

# Errors to watch for
Failed to initialize user progress: [error details]
Invalid webhook signature
Missing user id in webhook data
```

### Database Queries for Insights

**Total users from LearnWorlds:**
```sql
SELECT COUNT(*) FROM users WHERE learnworlds_user_id IS NOT NULL;
```

**Most completed tools:**
```sql
SELECT tool_slug, COUNT(*) as completions
FROM user_progress
WHERE status = 'completed'
GROUP BY tool_slug
ORDER BY completions DESC;
```

**Average sprint progress:**
```sql
SELECT
  sprint_id,
  COUNT(*) FILTER (WHERE is_unlocked = true) as unlocked,
  COUNT(*) FILTER (WHERE status = 'completed') as completed
FROM user_progress
GROUP BY sprint_id
ORDER BY sprint_id;
```

---

## 🚀 Go-Live Checklist

- [ ] All 31 External Link Learning Activities created
- [ ] All URLs use HTTPS (not HTTP)
- [ ] Frontend URL configured in backend `.env`
- [ ] Webhook secret configured in backend `.env`
- [ ] 9 User Automations created (one per sprint)
- [ ] Test user can access WOOP tool from LearnWorlds
- [ ] Test user completion unlocks next sprint
- [ ] Backend logs show no errors
- [ ] Database has progress records for test user
- [ ] CORS configured correctly
- [ ] Rate limiting working

---

## 📞 Support Resources

**LearnWorlds Documentation:**
- External Link Activities: https://support.learnworlds.com/support/solutions/articles/12000003627
- User Automations: https://support.learnworlds.com/support/solutions/articles/12000092545
- Webhooks: https://support.learnworlds.com/support/solutions/articles/12000025878

**LearnWorlds Support:**
- Daily webinars: https://www.learnworlds.com/daily-webinars/
- Support tickets: support@learnworlds.com

**Your Backend API Endpoints:**
- Health check: `https://your-backend.com/api/health`
- Auth endpoint: `https://your-backend.com/api/learnworlds/auth`
- Webhook endpoint: `https://your-backend.com/api/learnworlds/webhook`

---

## 🎉 Next Steps After Setup

1. **Create onboarding email** for users explaining how to access tools from LearnWorlds
2. **Monitor analytics** to see which tools are most popular
3. **Gather feedback** on user experience
4. **Iterate** based on user behavior and completion rates

Good luck with your launch! 🚀
