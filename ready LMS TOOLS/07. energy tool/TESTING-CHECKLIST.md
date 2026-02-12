# ✅ Energy Sprint Tools - Complete Testing Checklist

## 📋 Overview

Use this checklist to verify all components are working correctly before going live.

---

## 🔧 PRE-TESTING SETUP

### Step 1: Update Individual Tool

- [ ] Open `energy-body-mind-tool.html` in editor
- [ ] Find line 310 (search for `SUBMIT_WEBHOOK`)
- [ ] Change URL to: `https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit`
- [ ] Save file

### Step 2: Verify n8n Workflows are Active

- [ ] Open n8n dashboard
- [ ] Verify "Energy - Individual Submission" workflow has green toggle (Active)
- [ ] Verify "Energy - Team Aggregation" workflow has green toggle (Active)
- [ ] Verify "Energy - Team Meeting Submission" workflow has green toggle (Active)

### Step 3: Verify MongoDB Connection

- [ ] Open MongoDB Compass or Atlas
- [ ] Verify you can connect to database
- [ ] Verify collections exist (or will be created):
  - `energy_body_mind_submissions`
  - `energyteam_meeting_submissions`

---

## 🧪 TEST 1: Individual Tool Submission

### A. Frontend Testing

- [ ] Open `energy-body-mind-tool.html` in browser
- [ ] Verify fonts load correctly (Plaak for headings, Riforma for body)
- [ ] Verify Fast Track logo displays
- [ ] Click "Start Your Energy Protocol" button

**Cover Page:**
- [ ] Black background displays correctly
- [ ] White text is readable
- [ ] Button hover effect works

**Intro Screen:**
- [ ] Purpose, Time, and Rules sections display
- [ ] "Begin Your Energy Protocol" button works

**Section 1: Energy Audit**
- [ ] All 4 pillar sections visible (Sleep, Food, Movement, Brain)
- [ ] 1-10 rating scales work
- [ ] Text inputs accept text
- [ ] Textareas expand properly
- [ ] "Continue" button enables after filling required fields
- [ ] Help button (?) opens modal
- [ ] Progress dots show current section

**Section 2: Energy Drains**
- [ ] Biggest drain input works
- [ ] Energy peak textarea works
- [ ] Energy crash textarea works
- [ ] "Continue" button works

**Section 3: Energy Protocol**
- [ ] All 4 Fast Track rules boxes display with yellow background
- [ ] Commitment inputs work for all 4 pillars
- [ ] "Continue" button works

**Section 4: First Win**
- [ ] First action input works
- [ ] Deadline date picker works
- [ ] "Complete My Protocol" button visible

### B. Submission Testing

- [ ] Click "Complete My Protocol"
- [ ] **Wait for response** (5-10 seconds)
- [ ] Success message displays
- [ ] No errors in browser console (press F12 → Console tab)

### C. Backend Verification

**Check n8n:**
- [ ] Open n8n → Executions tab
- [ ] Find latest "Energy - Individual Submission" execution
- [ ] Verify status is "Success" (green checkmark)
- [ ] Click into execution
- [ ] Verify Webhook node received data
- [ ] Verify Function node calculated metrics
- [ ] Verify MongoDB node inserted document
- [ ] Verify Response node returned success

**Check MongoDB:**
- [ ] Open MongoDB Compass/Atlas
- [ ] Find collection: `energy_body_mind_submissions`
- [ ] Find your test document (search by userName or email)
- [ ] Verify document structure:
  ```
  {
    _id: "energy_body_mind_[email]_[timestamp]"
    toolName: "energy_body_mind"
    userId: "[email]"
    userName: "[your name]"
    companyId: "[company]"
    companyName: "[company name]"
    averageEnergyRating: "X.X"
    lowestRatedPillar: "sleep|food|movement|brain"
    toolData: {
      // All your form data here
    }
  }
  ```
- [ ] Verify all fields populated
- [ ] Verify toolData is an object (not string)
- [ ] Verify averageEnergyRating calculated correctly

### D. Expected Results

**Browser Console:**
```
✅ No red errors
✅ Success response logged
```

**n8n Response:**
```json
{
  "success": true,
  "message": "Energy protocol submitted successfully!",
  "submissionId": "energy_body_mind_xxx_xxx",
  "averageRating": "X.X",
  "focusArea": "sleep|food|movement|brain",
  "submittedAt": "2025-01-06T..."
}
```

**MongoDB Document:**
```
✅ Document exists
✅ All fields present
✅ Correct data types
✅ toolData is nested object
```

---

## 🧪 TEST 2: Team Meeting Tool (Data Loading)

### A. Frontend Testing

- [ ] Open `energy-team-meeting-tool.html` in browser
- [ ] Verify fonts and logo load
- [ ] Click "Begin Team Meeting"

**Company ID Entry:**
- [ ] Input field visible
- [ ] Hint text displays
- [ ] "Load Team Data" button visible

### B. Load Team Data

- [ ] Enter the companyId from your test submission
  - Hint: Look in MongoDB at the `companyId` field
  - Example: `test_company_inc`
- [ ] Click "Load Team Data"
- [ ] **Wait for data to load** (3-5 seconds)
- [ ] No errors in console

**Expected Display:**
- [ ] Team size shows: "1 team members submitted"
- [ ] Overall energy rating displays (e.g., "5.8/10")
- [ ] All 4 pillar averages display
- [ ] Common energy drains section shows (if data exists)
- [ ] Individual protocols summary displays with your submission

### C. Backend Verification

**Check n8n:**
- [ ] Open n8n → Executions tab
- [ ] Find latest "Energy - Team Aggregation" execution
- [ ] Verify status is "Success"
- [ ] Click into execution
- [ ] Verify Webhook node received companyId parameter
- [ ] Verify MongoDB node found documents
- [ ] Verify Function node calculated averages
- [ ] Verify Response node returned aggregated data

### D. Expected Results

**Browser Display:**
```
Company: [Your Company Name]
Team Size: 1
Overall Energy: X.X/10
Pillars: Sleep X.X | Food X.X | Movement X.X | Brain X.X
Individual Protocols: [Your Name] listed
```

---

## 🧪 TEST 3: Team Meeting Tool (Full Submission)

### A. Meeting Facilitation

**From team data review screen:**
- [ ] Click "Continue to Meeting Facilitation"

**Meeting Details:**
- [ ] Facilitator name input works
- [ ] Meeting date picker works (default is today)

**Discussion Notes:**
- [ ] Textarea accepts text
- [ ] Can write multiple paragraphs

**Common Challenges:**
- [ ] 3 input fields visible
- [ ] Can enter challenges in each

**Team Rituals:**
- [ ] 3 input fields visible (yellow background)
- [ ] Can enter rituals in each

- [ ] Click "Continue to Action Planning"

### B. Action Planning

**Team Strategies:**
- [ ] First strategy form visible
- [ ] Description input works
- [ ] Owner input works
- [ ] Deadline date picker works
- [ ] "+ Add Strategy" button works
- [ ] Can add multiple strategies
- [ ] "Remove" button works (if multiple strategies)

**Accountability Plan:**
- [ ] Tracking method input works
- [ ] Report back date picker works
- [ ] Partnerships textarea works
- [ ] Consequences input works

- [ ] Click "Submit Team Meeting Results"
- [ ] **Wait for submission** (3-5 seconds)

### C. Success Screen

- [ ] Success screen displays
- [ ] Green checkmark visible
- [ ] "Team Meeting Complete" message displays
- [ ] Next steps listed
- [ ] "Facilitate Another Meeting" button works

### D. Backend Verification

**Check n8n:**
- [ ] Open n8n → Executions tab
- [ ] Find latest "Energy - Team Meeting Submission" execution
- [ ] Verify status is "Success"
- [ ] Click into execution
- [ ] Verify Webhook node received all data
- [ ] Verify Function node structured data correctly
- [ ] Verify MongoDB node inserted document
- [ ] Verify Response node returned success

**Check MongoDB:**
- [ ] Open MongoDB Compass/Atlas
- [ ] Find collection: `energyteam_meeting_submissions`
- [ ] Find your test document
- [ ] Verify document structure:
  ```
  {
    _id: "team_meeting_energy_[companyId]_[timestamp]"
    toolName: "energy_team_meeting"
    companyId: "[companyId]"
    companyName: "[company name]"
    meetingDate: "2025-01-XX"
    facilitator: "[your name]"
    discussionNotes: "..."
    commonChallenges: [array]
    teamRituals: [array]
    teamStrategies: [array of objects]
    accountabilityPlan: {object}
  }
  ```
- [ ] Verify all arrays are arrays (not strings)
- [ ] Verify accountabilityPlan is object (not string)

### E. Expected Results

**Browser:**
```
✅ Success screen displays
✅ No console errors
```

**n8n Response:**
```json
{
  "success": true,
  "message": "Team meeting results saved successfully",
  "meetingId": "team_meeting_energy_xxx_xxx"
}
```

**MongoDB:**
```
✅ Document exists in energyteam_meeting_submissions
✅ All fields present
✅ Correct data types
✅ Linked to companyId
```

---

## 🧪 TEST 4: Error Handling

### A. Test Invalid Company ID

- [ ] Open Team Meeting Tool
- [ ] Enter fake company ID: `nonexistent_company`
- [ ] Click "Load Team Data"
- [ ] Verify error message displays: "No submissions found..."
- [ ] Verify no console errors

### B. Test Network Error

- [ ] Disconnect internet
- [ ] Try to submit Individual Tool
- [ ] Verify error handling (timeout or network error)
- [ ] Reconnect internet
- [ ] Verify submission works again

### C. Test Validation

- [ ] Try to continue without filling required fields
- [ ] Verify "Continue" button is disabled or validation messages appear

---

## 🧪 TEST 5: Data Integrity

### A. Complete Flow Test

1. [ ] Have 2-3 people complete Individual Tool with different company IDs
2. [ ] Verify each submission in MongoDB
3. [ ] Load Team Meeting Tool with Company 1 ID
4. [ ] Verify only Company 1 data displays (not Company 2)
5. [ ] Complete team meeting for Company 1
6. [ ] Verify team meeting document has correct companyId

### B. Data Linkage Test

- [ ] Query MongoDB: Find all individual submissions for a company
  ```javascript
  db.energy_body_mind_submissions.find({ companyId: "test_company_inc" })
  ```
- [ ] Note the count
- [ ] Load Team Meeting Tool with same companyId
- [ ] Verify "Team Size" matches MongoDB count
- [ ] Verify all individuals listed in protocols summary

---

## 📊 FINAL VERIFICATION

### All Systems Go Checklist

- [ ] ✅ Individual Tool submits successfully
- [ ] ✅ Data appears in `energy_body_mind_submissions`
- [ ] ✅ Average rating calculated correctly
- [ ] ✅ Team Meeting Tool loads data by companyId
- [ ] ✅ Team aggregation shows correct metrics
- [ ] ✅ Team meeting submission saves successfully
- [ ] ✅ Data appears in `energyteam_meeting_submissions`
- [ ] ✅ All n8n workflows show successful executions
- [ ] ✅ No console errors in browser
- [ ] ✅ CORS working (no CORS errors)
- [ ] ✅ MongoDB documents have correct structure
- [ ] ✅ Error handling works appropriately

---

## 🚀 PRODUCTION READY CRITERIA

Before going live with real Fast Track teams:

- [ ] All tests above pass
- [ ] Tested with 3+ different users
- [ ] Tested with 2+ different companies
- [ ] n8n workflows stable for 24+ hours
- [ ] MongoDB connection stable
- [ ] No unresolved errors in logs
- [ ] Documentation reviewed
- [ ] Guru trained on Team Meeting Tool
- [ ] Support process established

---

## 🐛 Common Issues & Solutions

### Issue: "Webhook not found"
**Solution:** Workflow not active. Toggle Active in n8n.

### Issue: Empty team data
**Solution:** Wrong companyId. Check exact value in MongoDB.

### Issue: CORS error
**Solution:** Add "Allowed Origins: *" in webhook node options.

### Issue: Fields missing in MongoDB
**Solution:** Check field mappings in MongoDB node.

### Issue: Calculation incorrect
**Solution:** Check Function node code in n8n.

---

## 📞 Support During Testing

If you encounter issues:

1. **Check n8n execution logs first** - 90% of issues visible here
2. **Check browser console** - Frontend errors show here
3. **Check MongoDB data** - Verify structure
4. **Review error messages** - They're usually specific
5. **Re-test after fixes** - Verify resolution

---

**Once all tests pass, you're ready for production!** 🎉

**Testing Completed By:** _______________
**Date:** _______________
**Status:** ⬜ Pass | ⬜ Fail | ⬜ Pass with Minor Issues
**Notes:** _______________________________________________


