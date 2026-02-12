# N8N WORKFLOW INSTRUCTIONS - IMPACT/EASY MATRIX TOOL

## Overview
This document provides step-by-step instructions for setting up the n8n workflows needed for the Impact/Easy Matrix tool.

---

## WORKFLOW 1: Tool Submission (EXISTING - UPDATE REQUIRED)

### Purpose
Handle final submissions when users click "SUBMIT TO FAST TRACK"

### Webhook URL
`https://n8n-edge.fasttrack-diagnostic.com/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700`

### What to Update

Add routing logic for the new tool:

```javascript
// In your existing Switch/Router node, add this case:

if (toolName === 'impact_easy_matrix') {
  return {
    collection: 'impact_easy_matrix_submissions',
    data: enrichedData
  };
}
```

### Workflow Steps

1. **Webhook Node** (Already exists)
   - Method: POST
   - Path: `/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700`
   - Response: 200 OK

2. **Extract Data Node** (Function)
   ```javascript
   // Extract incoming data
   const body = $input.item.json.body;
   
   return {
     toolName: body.toolName,
     userId: body.userId,
     sprintNumber: body.sprintNumber,
     timestamp: new Date().toISOString(),
     data: body.data
   };
   ```

3. **Enrich Data Node** (Function)
   ```javascript
   // Generate unique ID and add metadata
   const data = $input.item.json;
   const timestamp = Date.now();
   
   return {
     _id: `${data.toolName}_${data.userId}_${timestamp}`,
     submittedAt: data.timestamp,
     lastSaved: data.timestamp,
     version: "1",
     userId: data.userId,
     userName: data.data.userName || data.userId.split('@')[0],
     companyId: data.userId.split('@')[1]?.replace(/\./g, '_') || 'unknown',
     companyName: data.data.companyName || '',
     cohort: data.data.cohort || '',
     toolName: data.toolName,
     toolDisplayName: "Impact/Easy Matrix",
     sprintNumber: data.sprintNumber.toString(),
     moduleNumber: "3",
     status: "completed",
     completionPercentage: 100,
     shared: false,
     sharedAt: null,
     sharedWith: [],
     toolData: {
       ideas: data.data.ideas,
       sortedIdeas: data.data.sortedIdeas,
       timestamp: data.timestamp
     }
   };
   ```

4. **Route to Collection Node** (Switch)
   ```javascript
   // Add this case to your existing switch
   if ($json.toolName === 'impact_easy_matrix') {
     return 0; // Route to impact_easy_matrix_submissions
   }
   ```

5. **MongoDB Insert Node**
   - **NEW NODE REQUIRED**
   - Database: `fasttrack_tools`
   - Collection: `impact_easy_matrix_submissions`
   - Operation: Insert
   - Document: `{{ $json }}`

6. **Success Response Node** (Respond to Webhook)
   ```javascript
   return {
     status: 'success',
     message: 'Impact/Easy Matrix submitted successfully',
     id: $json._id,
     timestamp: $json.submittedAt
   };
   ```

---

## WORKFLOW 2: Auto-Save (NEW - RECOMMENDED)

### Purpose
Save user progress every 2 seconds as they fill out the tool

### Webhook URL (Proposed)
`https://n8n-edge.fasttrack-diagnostic.com/webhook/tools/autosave`

### Workflow Steps

1. **Webhook Node**
   - Method: POST
   - Path: `/webhook/tools/autosave`
   - Response: 200 OK

2. **Extract Data Node** (Function)
   ```javascript
   const body = $input.item.json.body;
   
   return {
     userId: body.userId,
     toolName: body.toolName,
     data: body.data,
     timestamp: new Date().toISOString()
   };
   ```

3. **Prepare Upsert Node** (Function)
   ```javascript
   const data = $input.item.json;
   
   return {
     filter: {
       _id: `${data.toolName}_${data.userId}_draft`
     },
     update: {
       $set: {
         _id: `${data.toolName}_${data.userId}_draft`,
         userId: data.userId,
         toolName: data.toolName,
         toolDisplayName: "Impact/Easy Matrix",
         status: "draft",
         lastSaved: data.timestamp,
         version: "1",
         toolData: data.data
       }
     },
     options: {
       upsert: true
     }
   };
   ```

4. **MongoDB Upsert Node**
   - Database: `fasttrack_tools`
   - Collection: `impact_easy_matrix_submissions`
   - Operation: Update
   - Filter: `{{ $json.filter }}`
   - Update: `{{ $json.update }}`
   - Options: `{{ $json.options }}`

5. **Success Response Node**
   ```javascript
   return {
     saved: true,
     timestamp: $json.timestamp,
     message: 'Auto-saved successfully'
   };
   ```

### Important Notes
- Use **upsert: true** so it creates the document if it doesn't exist
- Keep response minimal for speed (target <100ms)
- No email notifications for auto-save

---

## WORKFLOW 3: Load Draft (NEW - RECOMMENDED)

### Purpose
Retrieve saved progress when user reopens the tool

### Webhook URL (Proposed)
`https://n8n-edge.fasttrack-diagnostic.com/webhook/tools/load-draft`

### Workflow Steps

1. **Webhook Node**
   - Method: GET
   - Path: `/webhook/tools/load-draft`
   - Query Parameters: `userId`, `toolName`

2. **Extract Query Parameters Node** (Function)
   ```javascript
   const params = $input.item.json.query;
   
   return {
     _id: `${params.toolName}_${params.userId}_draft`
   };
   ```

3. **MongoDB Find Node**
   - Database: `fasttrack_tools`
   - Collection: `impact_easy_matrix_submissions`
   - Operation: Find
   - Query: `{{ { "_id": $json._id, "status": "draft" } }}`
   - Limit: 1

4. **Check If Found Node** (IF)
   - Condition: `{{ $json.toolData !== undefined }}`

5. **Response - Found** (Respond to Webhook)
   ```javascript
   return {
     status: 'found',
     data: $json.toolData,
     lastSaved: $json.lastSaved
   };
   ```

6. **Response - Not Found** (Respond to Webhook)
   ```javascript
   return {
     status: 'not_found',
     data: null
   };
   ```

---

## DATABASE SETUP

### MongoDB Collection

**Collection Name:** `impact_easy_matrix_submissions`

**Database:** `fasttrack_tools`

### Create Indexes (Run in MongoDB Shell)

```javascript
// For faster queries
db.impact_easy_matrix_submissions.createIndex({userId: 1, status: 1});
db.impact_easy_matrix_submissions.createIndex({companyId: 1, status: 1});
db.impact_easy_matrix_submissions.createIndex({status: 1, submittedAt: -1});
db.impact_easy_matrix_submissions.createIndex({toolName: 1, submittedAt: -1});
```

### Sample Document Structure

```javascript
{
  _id: "impact_easy_matrix_john@company.com_1736168400123",
  submittedAt: "2025-01-06T14:30:00Z",
  lastSaved: "2025-01-06T14:29:55Z",
  version: "1",
  
  userId: "john@company.com",
  userName: "John Smith",
  companyId: "company_com",
  companyName: "Company Inc",
  cohort: "2024-Q4",
  
  toolName: "impact_easy_matrix",
  toolDisplayName: "Impact/Easy Matrix",
  sprintNumber: "3",
  moduleNumber: "3",
  
  status: "completed",  // or "draft"
  completionPercentage: 100,
  
  shared: false,
  sharedAt: null,
  sharedWith: [],
  
  toolData: {
    ideas: [
      {
        idea: "Implement weekly team standups",
        impact: 3,
        easy: 3
      },
      {
        idea: "Redesign homepage",
        impact: 3,
        easy: 2
      }
      // ... more ideas
    ],
    sortedIdeas: [
      {
        idea: "Implement weekly team standups",
        impact: 3,
        easy: 3,
        score: 6,
        originalIndex: 0
      }
      // ... sorted by score desc
    ]
  }
}
```

---

## TESTING CHECKLIST

### Test Workflow 1: Submission
- [ ] Submit tool with 5+ ideas
- [ ] Verify document appears in MongoDB
- [ ] Check `_id` format is correct
- [ ] Verify `status` = "completed"
- [ ] Verify `sortedIdeas` are properly ranked
- [ ] Check all metadata fields populated

### Test Workflow 2: Auto-Save (if implemented)
- [ ] Fill out 2 ideas
- [ ] Wait 3 seconds
- [ ] Check MongoDB for draft document
- [ ] Verify `_id` ends with `_draft`
- [ ] Verify `status` = "draft"
- [ ] Add more ideas, wait, verify update

### Test Workflow 3: Load Draft (if implemented)
- [ ] Create draft via auto-save
- [ ] Close browser
- [ ] Reopen tool
- [ ] Verify form populated with saved data
- [ ] Verify "Last saved at..." displays correctly

---

## PRIORITY IMPLEMENTATION ORDER

1. **HIGH PRIORITY:** Update Workflow 1 (Submission)
   - Required for tool to function
   - Estimated time: 30 minutes

2. **MEDIUM PRIORITY:** Implement Workflow 2 (Auto-Save)
   - Greatly improves user experience
   - Prevents data loss
   - Estimated time: 1 hour

3. **MEDIUM PRIORITY:** Implement Workflow 3 (Load Draft)
   - Works with Auto-Save
   - Allows users to resume work
   - Estimated time: 45 minutes

---

## CONFIGURATION IN HTML FILE

The tool is already configured with these webhook URLs:

```javascript
const CONFIG = {
    AUTOSAVE_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/tools/autosave',
    SUBMIT_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700',
    STORAGE_KEY: 'fasttrack_impact_easy_matrix',
    TOOL_NAME: 'impact_easy_matrix',
    SPRINT_NUMBER: 3
};
```

**Update these URLs** once your n8n workflows are deployed.

---

## TROUBLESHOOTING

### Submission fails
1. Check n8n workflow is active
2. Verify webhook URL in CONFIG matches n8n
3. Check MongoDB connection in n8n
4. Look for errors in n8n execution log
5. Verify collection name is correct

### Auto-save not working
1. Check AUTOSAVE_WEBHOOK URL is correct
2. Verify upsert: true is set in MongoDB node
3. Check response time (should be <100ms)
4. Look for CORS errors in browser console

### Draft not loading
1. Verify auto-save created draft document
2. Check _id format: `{toolName}_{userId}_draft`
3. Verify status field = "draft"
4. Check MongoDB query in workflow

---

## SECURITY NOTES

### Current State
- No authentication implemented
- Webhooks are publicly accessible
- Users can submit with any email

### Recommendations for Production
1. Add API key validation in n8n
2. Implement user authentication in tool
3. Rate limit webhook endpoints
4. Validate email format server-side
5. Sanitize user inputs before MongoDB insert

---

## SUPPORT

If you encounter issues:
1. Check n8n execution logs
2. Verify MongoDB connection
3. Test webhooks with Postman/curl
4. Review this document for missed steps

---

**Last Updated:** January 2025
**Tool Version:** 1.0
**Compatible with:** n8n v1.0+, MongoDB v4.4+
