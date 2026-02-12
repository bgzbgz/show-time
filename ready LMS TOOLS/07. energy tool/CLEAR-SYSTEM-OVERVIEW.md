# 🎯 ENERGY SPRINT SYSTEM - CLEAR OVERVIEW

## 📂 YOUR HTML FILES EXPLAINED

### **WHAT YOU HAVE NOW:**

| File | Status | What It Is |
|------|--------|------------|
| `energy-body-mind-tool.html` | ❌ OLD | Original tool - has bugs, wrong structure |
| `energy-body-mind-tool-ENHANCED.html` | ❌ OLD | Intermediate version - incomplete |
| **`energy-body-mind-tool-CORRECT.html`** | ✅ **USE THIS** | **Final working individual tool** |
| **`energy-team-meeting-tool.html`** | ✅ **USE THIS** | **Team meeting facilitation tool** |

### **WHAT YOU NEED TO BUILD:**

| File | Status | Purpose |
|------|--------|---------|
| **`energy-guru-dashboard.html`** | 🔨 TO BUILD | Guru sees all submissions, starts meeting |

---

## 🔄 THE COMPLETE FLOW (What You Want)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FAST TRACK ENERGY SPRINT                     │
└─────────────────────────────────────────────────────────────────┘

STEP 1: INDIVIDUAL WORK
┌──────────────────────────────────────┐
│  Team Member Opens:                  │
│  energy-body-mind-tool-CORRECT.html  │ ← ✅ DONE
│                                      │
│  - Fills in 4 pillars               │
│  - Creates habits                   │
│  - Mental energy wisdom             │
│  - Clicks SUBMIT                    │
└──────────────────────────────────────┘
              ↓
         Saves to MongoDB
              ↓
    📧 Email sent to Guru ← 🔨 TO BUILD
              ↓
              
STEP 2: GURU PREPARATION
┌──────────────────────────────────────┐
│  Guru Opens:                         │
│  energy-guru-dashboard.html          │ ← 🔨 TO BUILD
│                                      │
│  - Enters company ID                │
│  - Sees all team submissions        │
│  - Reviews energy ratings           │
│  - Clicks "START TEAM MEETING"      │
└──────────────────────────────────────┘
              ↓
              
STEP 3: TEAM MEETING
┌──────────────────────────────────────┐
│  Everyone Opens:                     │
│  energy-team-meeting-tool.html       │ ← ✅ DONE
│                                      │
│  - Loads all individual data        │
│  - Reviews team patterns            │
│  - Discusses challenges             │
│  - Creates team strategy            │
│  - Assigns accountability           │
└──────────────────────────────────────┘
              ↓
         Saves to MongoDB
              ↓
           ✅ COMPLETE
```

---

## ✅ WHAT'S ALREADY WORKING

1. ✅ **Individual Tool** (`energy-body-mind-tool-CORRECT.html`)
   - All 4 pillars with habit frameworks
   - Mental energy wisdom
   - Submits to MongoDB via n8n
   - Auto-saves

2. ✅ **N8N Workflow 1** (Individual Submission)
   - Receives submission
   - Saves to `energy_body_mind_submissions`
   - Returns success

3. ✅ **N8N Workflow 2** (Team Aggregation)
   - Loads all submissions by company
   - Calculates team averages
   - Returns aggregated data

4. ✅ **Team Meeting Tool** (`energy-team-meeting-tool.html`)
   - Loads team data
   - Shows individual protocols
   - Facilitates discussion
   - Submits team strategy

5. ✅ **N8N Workflow 3** (Team Meeting Submission)
   - Saves team strategy to `energyteam_meeting_submissions`

---

## 🔨 WHAT YOU NEED TO BUILD

### **1. Guru Dashboard Tool** (60 minutes)
**File:** `energy-guru-dashboard.html`

**Purpose:**
- Guru enters company ID
- Sees list of all team members who submitted
- Shows energy ratings for each person
- Shows completion stats (e.g., "5/8 team members completed")
- Big button: "START TEAM MEETING" → redirects to team meeting tool

**Features:**
- Black background (Guru-specific styling)
- Real-time submission tracking
- Quick view of each person's key habits
- Link to start meeting

---

### **2. N8N Workflow 4** - Guru View (10 minutes)
**Name:** "Energy - Guru Dashboard View"

**Purpose:**
- Webhook receives company ID
- Queries MongoDB for all submissions
- Calculates stats (total submitted, averages, etc.)
- Returns data to Guru dashboard

**Endpoints:**
- GET `/webhook/energy-guru-view?companyId=acme_corp`

---

### **3. Email Notification** (OPTIONAL - 10 minutes)
**Update:** N8N Workflow 1 (Individual Submission)

**Purpose:**
- When someone submits, send email to Guru
- Email says: "New submission from John Smith at Acme Corp"
- Includes link to dashboard

---

## 📋 ACTION PLAN - STEP BY STEP

### **Step 1: Clean Up Old Files** (1 minute)
Delete the old versions:
- ❌ Delete `energy-body-mind-tool.html`
- ❌ Delete `energy-body-mind-tool-ENHANCED.html`

Keep only:
- ✅ `energy-body-mind-tool-CORRECT.html` (rename to `energy-individual-tool.html`)
- ✅ `energy-team-meeting-tool.html`

### **Step 2: Build Guru Dashboard** (60 minutes)
Create `energy-guru-dashboard.html`

### **Step 3: Create N8N Workflow 4** (10 minutes)
Set up "Energy - Guru Dashboard View" workflow in n8n

### **Step 4: Test Complete Flow** (15 minutes)
1. Submit 2-3 individual protocols
2. Open Guru dashboard
3. Start team meeting
4. Complete and submit

### **Step 5: Add Email (Optional)** (10 minutes)
Update Workflow 1 to send email to Guru on submission

---

## 🎯 TOTAL TIME ESTIMATE

- Clean up: **1 minute**
- Build Guru Dashboard: **60 minutes**
- N8N Workflow 4: **10 minutes**
- Testing: **15 minutes**
- Email (optional): **10 minutes**

**TOTAL: ~90 minutes to complete everything**

---

## ❓ WHAT DO YOU WANT TO DO?

**Option 1:** "Clean up and build Guru dashboard now" ← RECOMMENDED
- I'll delete old files
- Build complete Guru dashboard
- Create n8n workflow instructions
- Test everything

**Option 2:** "Just explain the plan, I'll do it myself"
- I'll give you detailed instructions
- You build at your own pace

**Option 3:** "I want something different"
- Tell me your vision and I'll adapt

---

## 🚀 READY TO START?

**Just say:** "Let's build the Guru dashboard" and I'll:
1. ✅ Clean up old HTML files
2. ✅ Build complete Guru dashboard tool
3. ✅ Give you n8n workflow instructions
4. ✅ Test the complete flow

**Everything will be crystal clear!** 🎉

