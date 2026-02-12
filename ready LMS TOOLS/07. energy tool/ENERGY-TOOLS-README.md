# 🔋 Fast Track Energy Sprint Tools - Complete Guide

## 📚 Overview

The Energy Sprint consists of **2 frontend tools** powered by **3 n8n workflows** and **2 MongoDB collections**.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     INDIVIDUAL USERS                            │
│          (Complete energy protocols individually)               │
└──────────────────┬─────────────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────────┐
│           TOOL 1: Individual Energy Tool                        │
│         (energy-body-mind-tool.html)                           │
└──────────────────┬─────────────────────────────────────────────┘
                   │ POST data
                   ▼
┌────────────────────────────────────────────────────────────────┐
│       WORKFLOW 1: Individual Submission                         │
│  https://n8n-edge.fasttrack-diagnostic.com/webhook/           │
│  energy-individual-submit                                       │
└──────────────────┬─────────────────────────────────────────────┘
                   │ Saves to
                   ▼
┌────────────────────────────────────────────────────────────────┐
│         MongoDB: energy_body_mind_submissions                   │
│  {userId, userName, companyId, averageRating, toolData}        │
└──────────────────┬─────────────────────────────────────────────┘
                   │
                   │ Reads from
                   ▼
┌────────────────────────────────────────────────────────────────┐
│       WORKFLOW 2: Team Aggregation                              │
│  https://n8n-edge.fasttrack-diagnostic.com/webhook/           │
│  energy-team-aggregate?companyId=xxx                           │
└──────────────────┬─────────────────────────────────────────────┘
                   │ Returns aggregated data
                   ▼
┌────────────────────────────────────────────────────────────────┐
│           TOOL 2: Team Meeting Tool                             │
│       (energy-team-meeting-tool.html)                          │
│         Used by Guru during team meeting                        │
└──────────────────┬─────────────────────────────────────────────┘
                   │ POST meeting results
                   ▼
┌────────────────────────────────────────────────────────────────┐
│       WORKFLOW 3: Team Meeting Submission                       │
│  https://n8n-edge.fasttrack-diagnostic.com/webhook/           │
│  energy-team-submit                                            │
└──────────────────┬─────────────────────────────────────────────┘
                   │ Saves to
                   ▼
┌────────────────────────────────────────────────────────────────┐
│         MongoDB: energyteam_meeting_submissions                 │
│  {companyId, strategies, rituals, accountabilityPlan}          │
└────────────────────────────────────────────────────────────────┘
```

---

## 📦 Files Included

### Frontend Tools:
1. **`energy-body-mind-tool.html`** - Individual energy protocol tool
2. **`energy-team-meeting-tool.html`** - Team meeting facilitation tool (NEW)

### Documentation:
1. **`ENERGY-TOOLS-README.md`** - This file (complete guide)
2. **`IMPLEMENTATION-GUIDE.md`** - Technical implementation details
3. **`INDIVIDUAL-TOOL-UPDATES.md`** - Required updates to existing tool
4. **`n8n, monogdb guide.md`** - n8n workflow creation guide
5. **`TESTING-CHECKLIST.md`** - Complete testing procedures (below)

---

## 🚀 Quick Start

### For Individual Users:

1. Open `energy-body-mind-tool.html` in browser
2. Complete 4 sections:
   - Energy Audit (rate your current state)
   - Energy Drains (identify blockers)
   - Energy Protocol (design your system)
   - First Win (commit to immediate action)
3. Submit
4. Data saves to MongoDB automatically

**Time:** 20-30 minutes

---

### For Gurus (Team Meetings):

1. Ensure all team members completed individual tool
2. Open `energy-team-meeting-tool.html` in browser
3. Enter company ID (e.g., `test_company_inc`)
4. Review team aggregated data
5. Facilitate discussion and capture:
   - Common challenges
   - Team rituals
   - Specific strategies (with owners + deadlines)
   - Accountability plan
6. Submit
7. Share results with team

**Time:** 60-90 minutes (team meeting)

---

## 🔧 Technical Setup

### Prerequisites:
- Modern web browser (Chrome, Firefox, Safari)
- Internet connection (for n8n webhooks)
- MongoDB Atlas account (for data storage)
- n8n instance (workflows already created)

### n8n Workflows (All Active):

1. **Individual Submission**
   - URL: `https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit`
   - Method: POST
   - Status: ✅ Active & Tested

2. **Team Aggregation**
   - URL: `https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-team-aggregate`
   - Method: GET
   - Query Param: `?companyId=xxx`
   - Status: ✅ Active & Tested

3. **Team Meeting Submission**
   - URL: `https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-team-submit`
   - Method: POST
   - Status: ✅ Active & Tested

### MongoDB Collections:

1. **energy_body_mind_submissions**
   - Individual protocols
   - Fields: `_id`, `userId`, `userName`, `companyId`, `companyName`, `averageEnergyRating`, `lowestRatedPillar`, `toolData`

2. **energyteam_meeting_submissions**
   - Team meeting results
   - Fields: `_id`, `companyId`, `companyName`, `meetingDate`, `facilitator`, `teamStrategies`, `accountabilityPlan`

---

## 📊 Data Structure

### Individual Submission Payload:

```javascript
{
  userName: "John Smith",
  userEmail: "john@company.com",
  companyName: "Acme Corp",
  data: {
    // Energy Audit
    sleepRating: 6,
    sleepHours: "7 hours",
    sleepQuality: "Good but inconsistent",
    sleepCommitment: "Sleep by 10:30pm every night",
    
    foodRating: 5,
    foodHabits: "...",
    foodCommitment: "...",
    
    movementRating: 7,
    movementHabits: "...",
    movementCommitment: "...",
    
    brainRating: 5,
    brainWork: "...",
    brainCommitment: "...",
    
    // Energy Drains
    biggestDrain: "Poor sleep quality",
    energyPeak: "Morning 8-11am",
    energyCrash: "After lunch 2-3pm",
    
    // First Win
    firstAction: "Put phone charger in living room tonight",
    firstActionDeadline: "2025-01-07"
  }
}
```

### Team Meeting Submission Payload:

```javascript
{
  companyId: "test_company_inc",
  companyName: "Test Company Inc",
  meetingDate: "2025-01-10",
  facilitator: "Sarah Jones",
  discussionNotes: "...",
  commonChallenges: [
    "Poor sleep quality",
    "Too many meetings",
    "Inconsistent meal timing"
  ],
  teamRituals: [
    "No meetings before 9am",
    "Team walking break at 12pm",
    "Meeting-free Fridays 8-12pm"
  ],
  teamStrategies: [
    {
      description: "Implement team-wide walking break",
      owner: "John Smith",
      deadline: "2025-01-15"
    }
  ],
  accountabilityPlan: {
    trackingMethod: "Weekly check-ins",
    reportBackDate: "2025-02-01",
    partnerships: "Buddy system via Slack",
    consequences: "Team dinner at 80% compliance"
  }
}
```

---

## 🧪 Testing

See `TESTING-CHECKLIST.md` for complete testing procedures.

**Quick Test:**

```powershell
# Test Individual Submission
$body = @{
    userName = "Test User"
    userEmail = "test@test.com"
    companyName = "Test Company"
    data = @{
        sleepRating = 6
        foodRating = 5
        movementRating = 7
        brainRating = 5
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit" -Method Post -Body $body -ContentType "application/json"
```

Expected Response:
```json
{
  "success": true,
  "message": "Energy protocol submitted successfully!",
  "averageRating": "5.8",
  "focusArea": "food"
}
```

---

## 🔍 Troubleshooting

### Problem: "Webhook not found" error

**Solution:**
1. Check n8n workflow is **Active** (toggle in top-right)
2. Verify webhook URL is exactly correct
3. Check workflow execution logs in n8n

---

### Problem: No data in MongoDB

**Solution:**
1. Open n8n execution logs
2. Find the failed execution
3. Click on MongoDB node to see error
4. Common issues:
   - MongoDB credentials expired
   - Collection name typo
   - Field mapping incorrect

---

### Problem: Team Meeting Tool shows "No submissions found"

**Solution:**
1. Verify `companyId` exactly matches what's in database
2. Check MongoDB collection `energy_body_mind_submissions`
3. Look at one document - copy the exact `companyId` value
4. Use that exact value in Team Meeting Tool

---

### Problem: CORS error in browser console

**Solution:**
1. Open n8n workflow
2. Click Webhook node
3. Check "Options" → "Allowed Origins" is set to `*`
4. Save and test again

---

## 📋 Checklist Before Going Live

### Individual Tool:
- [ ] Webhook URL updated to `energy-individual-submit`
- [ ] Tool opens without errors
- [ ] All 4 sections work
- [ ] Submit button functional
- [ ] Data appears in MongoDB
- [ ] Success message displays

### Team Meeting Tool:
- [ ] Company ID input works
- [ ] Team data loads correctly
- [ ] All form sections capture data
- [ ] Submit button functional
- [ ] Data appears in MongoDB
- [ ] Success screen displays

### n8n Workflows:
- [ ] All 3 workflows Active
- [ ] Test executions successful
- [ ] No errors in execution logs
- [ ] CORS enabled on all webhooks

### MongoDB:
- [ ] Both collections exist
- [ ] Test documents have correct structure
- [ ] All fields present
- [ ] Connection stable

---

## 🎯 Success Metrics

After a complete Energy Sprint cycle, you should have:

1. **X individual submissions** in `energy_body_mind_submissions`
   - Each with complete energy audit data
   - Average ratings calculated
   - Focus areas identified

2. **1 team meeting record** in `energyteam_meeting_submissions`
   - Linked to company
   - Team strategies with owners
   - Accountability plan established

3. **n8n execution logs** showing all successful submissions

4. **Team follow-up** scheduled on report back date

---

## 🚀 Next Steps

1. **Test with real users** - Have 1-2 people complete individual tool
2. **Review data quality** - Check MongoDB documents are complete
3. **Facilitate test meeting** - Use Team Meeting Tool with test data
4. **Refine as needed** - Adjust based on user feedback
5. **Roll out to all teams** - Deploy to Fast Track program

---

## 📞 Support

### If you need help:

1. **Check n8n execution logs** - Most issues visible here
2. **Check browser console** - Frontend errors show here
3. **Check MongoDB** - Verify data structure
4. **Review this README** - Covers common issues

### Key Files to Reference:
- `INDIVIDUAL-TOOL-UPDATES.md` - Update instructions
- `n8n, monogdb guide.md` - Workflow details
- `IMPLEMENTATION-GUIDE.md` - Technical architecture

---

## ✅ System Status

**Current Status: READY FOR PRODUCTION** 🎉

- ✅ All n8n workflows active and tested
- ✅ MongoDB collections configured
- ✅ Individual tool functional
- ✅ Team meeting tool built and tested
- ✅ Documentation complete
- ✅ Testing procedures defined

**You're ready to launch the Energy Sprint!** 🚀

---

**Last Updated:** January 6, 2026
**Version:** 1.0
**Status:** Production Ready

