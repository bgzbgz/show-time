# 🔧 Energy Sprint Tools - Implementation Guide

## 📋 Overview

We have **3 n8n workflows** ready and **2 frontend tools** to build/update:

### ✅ N8N Workflows (COMPLETE):
1. **Individual Submission**: `https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit`
2. **Team Aggregation**: `https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-team-aggregate`
3. **Team Meeting Submission**: `https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-team-submit`

### 🔨 Frontend Tools (TO BUILD):
1. **Individual Energy Tool** - Enhanced version with all fields
2. **Team Meeting Facilitation Tool** - New tool for Guru

---

## 🎯 TOOL 1: Individual Energy Tool (Enhanced)

### File: `energy-body-mind-tool-COMPLETE.html`

### Changes Needed:

#### 1. **Update CONFIG Object**

**OLD:**
```javascript
const CONFIG = {
    SUBMIT_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700',
    STORAGE_KEY: 'fasttrack_energy_body_mind_data',
    TOOL_NAME: 'energy_body_mind',
    SPRINT_NUMBER: 'energy',
    AUTOSAVE_DELAY: 2000
};
```

**NEW:**
```javascript
const CONFIG = {
    SUBMIT_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit',
    STORAGE_KEY: 'fasttrack_energy_body_mind_data',
    TOOL_NAME: 'energy_body_mind',
    SPRINT_NUMBER: 'energy',
    AUTOSAVE_DELAY: 2000
};
```

#### 2. **Add New Form Data Fields**

Add to initial `formData` state:

```javascript
// Mental Energy Wisdom fields
canControl: '',
cannotControl: '',
stopDoing1: '', stopDoing2: '', stopDoing3: '',
doLess1: '', doLess2: '', doLess3: '',
doMore1: '', doMore2: '', doMore3: '',
eventDescription: '',
gapAnalysis: '',
idealResponse: '',
futurePlan: '',

// TRIGGER/ROUTINE/REWARD/ACCOUNTABILITY for each pillar
sleepTrigger: '', sleepRoutine: '', sleepReward: '', sleepAccountability: '',
foodTrigger: '', foodRoutine: '', foodReward: '', foodAccountability: '',
movementTrigger: '', movementRoutine: '', movementReward: '', movementAccountability: '',
brainTrigger: '', brainRoutine: '', brainReward: '', brainAccountability: '',
```

#### 3. **Add New Section: Mental Energy Wisdom**

Insert as Section 2.5 (after Energy Drains, before Protocol Design).

#### 4. **Enhance Protocol Design Section**

Add TRIGGER/ROUTINE/REWARD/ACCOUNTABILITY fields to each pillar.

---

## 🎯 TOOL 2: Team Meeting Facilitation Tool

### File: `energy-team-meeting-tool.html`

### Purpose:
Guru-facing tool that:
1. Loads all individual submissions for a company
2. Shows aggregated team data
3. Facilitates discussion and captures team strategies

### Flow:
```
Cover Page
  ↓
Enter Company ID
  ↓
Load Team Data (calls workflow 2)
  ↓
Display Aggregated Insights
  ↓
Facilitate Discussion (capture notes)
  ↓
Define Team Strategies
  ↓
Finalize & Submit (calls workflow 3)
```

### Key Features:
- Input: Company ID
- Fetches data from: `energy-team-aggregate` webhook
- Displays:
  - Team average ratings per pillar
  - Common energy drains
  - Individual protocols summary
- Captures:
  - Discussion notes
  - Common challenges
  - Team rituals
  - Team strategies (with owner + deadline)
  - Accountability plan
- Submits to: `energy-team-submit` webhook

---

## 📦 DELIVERABLES

### Individual Tool:
- ✅ File: `energy-body-mind-tool-COMPLETE.html`
- ✅ Updated CONFIG with new webhook
- ✅ Mental Energy Wisdom section added
- ✅ TRIGGER/ROUTINE/REWARD/ACCOUNTABILITY fields added
- ✅ Canvas updated to show all new data
- ✅ All data submits correctly to n8n workflow 1

### Team Meeting Tool:
- ✅ File: `energy-team-meeting-tool.html`
- ✅ Loads team data from workflow 2
- ✅ Captures team strategies
- ✅ Submits to workflow 3
- ✅ Fast Track design standards applied

### Documentation:
- ✅ README for both tools
- ✅ Testing checklist
- ✅ Webhook integration guide

---

## 🚀 NEXT STEPS

I will now build:

1. **Enhanced Individual Tool** - With all new fields and sections
2. **Team Meeting Tool** - Complete new tool for Guru
3. **Documentation** - Usage guides and testing procedures

**These will be ready for you to review and test!**

---

## ✋ WHAT YOU NEED TO DO:

### After I Build the Tools:

1. **Test Individual Tool:**
   - Open `energy-body-mind-tool-COMPLETE.html`
   - Complete all sections
   - Submit and verify data in MongoDB

2. **Test Team Meeting Tool:**
   - Open `energy-team-meeting-tool.html`
   - Enter company ID: `test_company_inc`
   - Verify it loads the individual submission we created
   - Complete team strategies
   - Submit and verify in MongoDB collection `energyteam_meeting_submissions`

3. **Review Data:**
   - Check both MongoDB collections have correct data
   - Verify all fields are present

### If Something Breaks:

1. Check n8n execution logs
2. Check browser console for errors
3. Verify webhook URLs are correct
4. Check MongoDB connection

---

## 📊 DATA FLOW DIAGRAM

```
INDIVIDUAL TOOL
    ↓ (submits)
WORKFLOW 1: Individual Submission
    ↓ (saves to)
MongoDB: energy_body_mind_submissions
    ↑ (reads from)
WORKFLOW 2: Team Aggregation
    ↓ (returns data to)
TEAM MEETING TOOL
    ↓ (submits)
WORKFLOW 3: Team Meeting Submission
    ↓ (saves to)
MongoDB: energyteam_meeting_submissions
```

---

**Building tools now...** 🚀

