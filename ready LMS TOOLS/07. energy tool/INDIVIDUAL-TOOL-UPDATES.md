# 🔧 Individual Energy Tool - Required Updates

## Current File: `energy-body-mind-tool.html`

This document shows **exactly** what needs to be changed in the existing individual tool.

---

## ✅ CRITICAL UPDATE: Webhook URL

### Location: Line 310

**CURRENT CODE:**
```javascript
const CONFIG = {
    SUBMIT_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700',
    AUTOSAVE_WEBHOOK: 'YOUR_N8N_AUTOSAVE_WEBHOOK_URL',
    SHARE_WEBHOOK: 'YOUR_N8N_SHARE_WEBHOOK_URL',
    EMAIL_WEBHOOK: 'YOUR_N8N_EMAIL_WEBHOOK_URL',
    STORAGE_KEY: 'fasttrack_energy_body_mind_data',
    TOOL_NAME: 'energy_body_mind',
    SPRINT_NUMBER: 'energy',
    AUTOSAVE_DELAY: 2000
};
```

**UPDATED CODE:**
```javascript
const CONFIG = {
    SUBMIT_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit',
    AUTOSAVE_WEBHOOK: 'YOUR_N8N_AUTOSAVE_WEBHOOK_URL',
    SHARE_WEBHOOK: 'YOUR_N8N_SHARE_WEBHOOK_URL',
    EMAIL_WEBHOOK: 'YOUR_N8N_EMAIL_WEBHOOK_URL',
    STORAGE_KEY: 'fasttrack_energy_body_mind_data',
    TOOL_NAME: 'energy_body_mind',
    SPRINT_NUMBER: 'energy',
    AUTOSAVE_DELAY: 2000
};
```

**Change:** Only line 310 - change the SUBMIT_WEBHOOK URL from the old generic webhook to the new energy-specific webhook.

---

## 🎯 TESTING THE UPDATE

### Step 1: Make the Change

1. Open `energy-body-mind-tool.html` in your editor
2. Find line 310 (search for `SUBMIT_WEBHOOK`)
3. Replace the URL with: `https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit`
4. Save the file

### Step 2: Test the Tool

1. Open `energy-body-mind-tool.html` in your browser
2. Complete the form (all 4 sections)
3. Submit
4. Check browser console for any errors
5. Verify data appears in MongoDB collection `energy_body_mind_submissions`

### Step 3: Verify n8n

1. Open n8n
2. Go to "Executions" tab
3. Find the latest execution of "Energy - Individual Submission" workflow
4. Verify it completed successfully
5. Click into it to see the data flow

---

## 📊 WHAT THIS CHANGE DOES

**Before:**
- Tool submitted to generic Fast Track webhook
- Data was routed through a switch node to multiple tools
- Shared infrastructure with other tools

**After:**
- Tool submits directly to energy-specific webhook
- Cleaner, dedicated workflow for energy tool
- Easier to debug and modify
- n8n workflow calculates energy metrics automatically

---

## ✅ THAT'S IT!

**This is the ONLY change needed** to integrate with your new n8n workflows.

The tool already has all the form fields needed. The new n8n workflow will:
- ✅ Receive all the data
- ✅ Calculate average energy rating
- ✅ Identify lowest pillar (focus area)
- ✅ Save to MongoDB
- ✅ Return success response

---

## 🚀 OPTIONAL ENHANCEMENTS

If you want to add the **TRIGGER/ROUTINE/REWARD/ACCOUNTABILITY** fields and **Mental Energy Wisdom** section (as per the original enhancement plan), those would require more extensive changes. 

**However, the tool works perfectly as-is with just this webhook update!**

Let me know if you want to proceed with the full enhancements later.

---

## 📝 SUMMARY

**File to Edit:** `energy-body-mind-tool.html`
**Line to Change:** 310
**Old Value:** `'https://n8n-edge.fasttrack-diagnostic.com/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700'`
**New Value:** `'https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit'`

**Time to Make Change:** 30 seconds
**Impact:** Tool now uses dedicated energy workflow ✅

