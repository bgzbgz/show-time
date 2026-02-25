# LearnWorlds Integration - Quick Start Guide

## ✅ What's Already Done

1. ✅ **Backend auth endpoint** - `/api/learnworlds/auth` ready
2. ✅ **Frontend auth handler** - Updated `auth.js` to handle `?token=` parameter
3. ✅ **All 29 tool URLs** - Ready in `LEARNWORLDS_URLS.md`
4. ✅ **Webhook handler** - Already supports User Automation webhooks

---

## 🚀 What You Need to Do Now

### **Step 1: Deploy Backend Changes (5 minutes)**

1. **Add environment variable in Railway:**
   - Go to: https://railway.app/project/[your-project]
   - Select **backend service**
   - Click **Variables** tab
   - Add: `FRONTEND_URL` = `https://fasttracktools.up.railway.app`
   - Save (auto-deploys)

2. **Commit and push updated code:**
   ```bash
   git add .
   git commit -m "Add LearnWorlds External Link authentication"
   git push
   ```

3. **Verify deployment:**
   - Check: https://backend-production-639c.up.railway.app/api/health
   - Should return: `{"status": "ok", ...}`

---

### **Step 2: Test with WOOP Tool (10 minutes)**

1. **Log in to LearnWorlds admin panel**

2. **Create test External Link activity:**
   - Go to your course → **Course Outline**
   - Click **Add Activity**
   - Select **External Link** (under Embed)
   - Title: `WOOP Tool (Test)`
   - URL:
     ```
     https://backend-production-639c.up.railway.app/api/learnworlds/auth?user_id={{USER_ID}}&email={{USER_EMAIL}}&user_name={{USER_NAME}}&course_id={{COURSE_ID}}&redirect=/tools/module-0-intro-sprint/00-woop
     ```
   - Save

3. **Test as student:**
   - Preview course or use test student account
   - Click the "WOOP Tool (Test)" activity
   - **Expected result:**
     - ✅ Redirected to: `https://fasttracktools.up.railway.app/tools/module-0-intro-sprint/00-woop`
     - ✅ Tool loads
     - ✅ You're automatically logged in
     - ✅ No errors in browser console

4. **Check browser console:**
   - Press F12 → Console tab
   - Should see: No authentication errors
   - Should NOT see: "Authentication required"

5. **Check sessionStorage:**
   - Press F12 → Application tab → Session Storage
   - Should see: `authToken` with JWT value

---

### **Step 3: Add All 29 Tools (30 minutes)**

Once WOOP test works:

1. **Open `LEARNWORLDS_URLS.md`**

2. **For each tool:**
   - Create External Link activity in LearnWorlds
   - Copy-paste the URL from `LEARNWORLDS_URLS.md`
   - **Important:** Copy the ENTIRE URL including all `{{variables}}`

3. **Organize by sprint/module** in your course structure

---

### **Step 4: Set Up Webhooks (20 minutes)**

#### **4a. Get Webhook Credentials**

1. **In LearnWorlds:** Settings → Developers → Webhooks
2. **Copy** your Webhook Secret/Signature
3. **Add to Railway:**
   - Backend service → Variables
   - Add: `LEARNWORLDS_WEBHOOK_SECRET` = `your_secret_here`
   - Save

#### **4b. Create User Automations**

For each sprint, create an automation:

**Example - Sprint 0 (WOOP):**

1. Go to **User → Automations**
2. Click **Create New Automation**
3. **Name:** "Unlock Sprint 0 - WOOP"
4. **Trigger:** "User completes a specific learning activity"
   - Select: Your first lesson/activity
5. **Action:** "Send a Webhook"
   - URL: `https://backend-production-639c.up.railway.app/api/learnworlds/webhook`
   - Method: POST
   - **Custom Data:** (click "Add custom data")
     ```json
     {
       "sprint_id": 0
     }
     ```
6. **Save**

**Repeat for all sprints:**
- Sprint 1 → `"sprint_id": 1`
- Sprint 2 → `"sprint_id": 2`
- ...
- Sprint 8 → `"sprint_id": 8`

---

## 🧪 Testing Checklist

- [ ] Backend deployed with `FRONTEND_URL` env var
- [ ] Health check returns 200 OK
- [ ] WOOP tool accessible from LearnWorlds
- [ ] User auto-logged in when clicking tool
- [ ] No console errors
- [ ] SessionStorage has `authToken`
- [ ] All 29 External Link activities created
- [ ] Webhook secret added to Railway
- [ ] 9 User Automations created (one per sprint)
- [ ] Test student completes lesson → next sprint unlocks

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /api/learnworlds/auth"
**Fix:** Backend not deployed or URL wrong. Check Railway deployment logs.

### Issue: Redirected but not logged in
**Fix:**
1. Check browser console for errors
2. Verify `FRONTEND_URL` is set in Railway
3. Check if `auth.js` is loading (view page source)

### Issue: "CORS error"
**Fix:** Add frontend URL to backend `CORS_ORIGIN`:
```
CORS_ORIGIN=https://fasttracktools.up.railway.app
```

### Issue: Webhook not unlocking tools
**Fix:**
1. Check backend logs for webhook receipt
2. Verify `sprint_id` is in custom data
3. Check `LEARNWORLDS_WEBHOOK_SECRET` matches LearnWorlds

### Issue: User lands on tool but sees "Authentication required"
**Fix:**
1. Open browser console → check for error messages
2. Check Application → Session Storage → should have `authToken`
3. If missing, backend redirect might not include `?token=` parameter

---

## 📊 How to Verify Everything Works

### **1. User Flow Test:**
```
1. Student clicks tool in LearnWorlds
2. → Backend receives request
3. → Backend creates/finds user in database
4. → Backend generates JWT token
5. → Backend redirects to frontend with ?token=xyz
6. → Frontend auth.js reads token from URL
7. → Frontend stores token in sessionStorage
8. → Frontend makes API calls with token
9. ✅ User sees tool loaded
```

### **2. Check Backend Logs (Railway):**
```
✓ LearnWorlds auth: user@example.com (lw_12345) from course {{COURSE_ID}}
```

### **3. Check Database:**
```sql
SELECT * FROM users WHERE learnworlds_user_id IS NOT NULL;
-- Should show new users created via LearnWorlds

SELECT * FROM user_progress WHERE user_id = 'xxx';
-- Should show unlocked/completed tools
```

---

## 🎉 Success Criteria

You're ready to launch when:
- ✅ All 29 tools accessible from LearnWorlds
- ✅ Users auto-authenticated on click
- ✅ Webhooks unlocking tools based on lesson completion
- ✅ No errors in logs
- ✅ Test user can complete full flow

---

## 📞 Next Steps After Launch

1. **Monitor analytics:**
   - Which tools are most used?
   - Where do users drop off?
   - Average completion time per tool

2. **Gather feedback:**
   - User experience survey
   - Track support tickets
   - Watch for authentication issues

3. **Iterate:**
   - Add tool progress indicators
   - Create dashboard showing all tools
   - Add "Continue where you left off" feature

---

## 🔗 Quick Links

- **Your Backend:** https://backend-production-639c.up.railway.app
- **Your Frontend:** https://fasttracktools.up.railway.app
- **Health Check:** https://backend-production-639c.up.railway.app/api/health
- **LearnWorlds Admin:** https://[your-school].learnworlds.com/admin
- **Railway Dashboard:** https://railway.app/project/[your-project]

---

**Estimated Time to Complete:** 1-2 hours

**Ready? Let's go!** 🚀
