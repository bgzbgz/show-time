# 🔧 N8N Workflow 4: Guru Dashboard View

## PURPOSE
Allow Guru to view all team submissions for a specific company and start the team meeting.

---

## WORKFLOW OVERVIEW

**Name:** Energy - Guru Dashboard View  
**Trigger:** GET Webhook  
**Endpoint:** `energy-guru-view`  
**Full URL:** `https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-guru-view`

---

## STEP-BY-STEP INSTRUCTIONS

### **Node 1: Webhook (GET)**

1. Click **Add first step** or **+** button
2. Choose **Webhook**
3. Configure:
   - **HTTP Method:** GET
   - **Path:** `energy-guru-view`
   - **Respond:** Using 'Respond to Webhook' Node
   - **Response Mode:** Last Node

4. Click **Execute Node** → You'll get a test URL
5. Keep this window open (we'll test at the end)

---

### **Node 2: MongoDB - Find Submissions**

1. Click **+** after Webhook node
2. Search for **MongoDB**
3. Configure:
   - **Operation:** Find
   - **Collection:** `energy_body_mind_submissions`
   - **Query (JSON):**

```json
{
  "companyId": "={{ $json.query.companyId }}"
}
```

4. **Options:**
   - Leave empty (will return all matching documents)

5. Click **Execute Node** to test
   - If no results, that's okay - we'll handle that in the Function node

---

### **Node 3: Function - Calculate Stats**

1. Click **+** after MongoDB node
2. Search for **Function**
3. **Code:**

```javascript
// Get all submissions
const items = $input.all();

// If no submissions found, return error
if (items.length === 0) {
  return [{
    json: {
      error: true,
      message: "No submissions found for this company",
      submissions: [],
      totalTeamMembers: 0
    }
  }];
}

// Initialize counters
let totalSleep = 0, totalFood = 0, totalMovement = 0, totalBrain = 0;

// Process each submission
items.forEach(item => {
  const data = item.json.toolData;
  
  // Sum ratings
  totalSleep += Number(data.sleepRating) || 0;
  totalFood += Number(data.foodRating) || 0;
  totalMovement += Number(data.movementRating) || 0;
  totalBrain += Number(data.brainRating) || 0;
});

const count = items.length;

// Calculate averages
const avgSleep = (totalSleep / count).toFixed(1);
const avgFood = (totalFood / count).toFixed(1);
const avgMovement = (totalMovement / count).toFixed(1);
const avgBrain = (totalBrain / count).toFixed(1);
const avgOverall = ((totalSleep + totalFood + totalMovement + totalBrain) / (count * 4)).toFixed(1);

// Find lowest pillar
const pillars = [
  {name: 'Sleep', avg: parseFloat(avgSleep)},
  {name: 'Food', avg: parseFloat(avgFood)},
  {name: 'Movement', avg: parseFloat(avgMovement)},
  {name: 'Brain', avg: parseFloat(avgBrain)}
];
const lowestPillar = pillars.sort((a, b) => a.avg - b.avg)[0].name;

// Collect all submission data
const submissions = items.map(item => item.json);

// Return aggregated data
return [{
  json: {
    success: true,
    companyId: items[0].json.companyId,
    companyName: items[0].json.companyName,
    submissions: submissions,
    totalTeamMembers: count,
    averageRatings: {
      sleep: avgSleep,
      food: avgFood,
      movement: avgMovement,
      brain: avgBrain,
      overall: avgOverall
    },
    lowestPillar: lowestPillar,
    allComplete: true,
    generatedAt: new Date().toISOString()
  }
}];
```

4. Click **Execute Node**
   - You should see the aggregated stats!

---

### **Node 4: Respond to Webhook**

1. Click **+** after Function node
2. Search for **Respond to Webhook**
3. Configure:
   - **Respond With:** JSON
   - Leave default (will return Function output)

4. Click **Execute Node**
   - Should show the JSON response

---

## TESTING THE WORKFLOW

### **Step 1: Activate the Workflow**

1. Click the **toggle switch** at top-right
2. Should say **"Active"**
3. Copy the Production Webhook URL:
   ```
   https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-guru-view
   ```

---

### **Step 2: Test with PowerShell**

Open PowerShell and run (replace with your actual companyId):

```powershell
$companyId = "test_company"
$url = "https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-guru-view?companyId=$companyId"

Invoke-RestMethod -Uri $url -Method Get
```

**Expected Response:**

```json
{
  "success": true,
  "companyId": "test_company",
  "companyName": "Test Company",
  "submissions": [...],
  "totalTeamMembers": 3,
  "averageRatings": {
    "sleep": "6.7",
    "food": "7.0",
    "movement": "5.3",
    "brain": "6.0",
    "overall": "6.3"
  },
  "lowestPillar": "Movement",
  "allComplete": true,
  "generatedAt": "2025-01-06T..."
}
```

**If no submissions:**

```json
{
  "error": true,
  "message": "No submissions found for this company",
  "submissions": [],
  "totalTeamMembers": 0
}
```

---

### **Step 3: Test with Guru Dashboard**

1. Open `energy-guru-dashboard.html` in your browser
2. Enter the company ID you tested with
3. Click "View Dashboard"
4. Should see all submissions!

---

## TROUBLESHOOTING

### **Error: "No submissions found"**

**Check:**
1. Is the `companyId` exactly the same as in MongoDB?
2. Open MongoDB Compass → `energy_body_mind_submissions`
3. Look at the `companyId` field - must match exactly (case-sensitive!)

**Fix:** Use the exact same companyId when submitting and loading

---

### **Error: "Cannot read property 'json'"**

**Check:**
1. MongoDB node is returning data correctly
2. The Function node is receiving items

**Fix:** Make sure MongoDB query is correct:
```json
{
  "companyId": "={{ $json.query.companyId }}"
}
```

---

### **Error: "Workflow not found"**

**Check:**
1. Is the workflow **Active**? (Toggle at top-right)
2. Is the path correct? Should be `energy-guru-view`

**Fix:** Activate the workflow

---

## CORS SETTINGS

**IMPORTANT:** Make sure CORS is enabled!

1. Click on **Webhook** node
2. Scroll to **Options**
3. Find **Allowed Origins (CORS)**
4. Set to: `*` (asterisk)
5. This allows the Guru dashboard HTML to call the webhook

---

## OPTIONAL ENHANCEMENTS

### **Add Email Notification Count**

In the Function node, add:

```javascript
// Count unique emails
const uniqueEmails = [...new Set(submissions.map(s => s.userEmail))];

// Add to return object:
totalUniqueUsers: uniqueEmails.length
```

---

### **Add "Last Submission" Time**

```javascript
// Find most recent submission
const lastSubmission = submissions.reduce((latest, current) => {
  return new Date(current.submittedAt) > new Date(latest.submittedAt) ? current : latest;
});

// Add to return object:
lastSubmittedAt: lastSubmission.submittedAt,
lastSubmittedBy: lastSubmission.userName
```

---

## COMPLETE!

✅ **Workflow 4 is ready!**

The Guru Dashboard can now:
- Load all submissions by company
- Show team stats
- Display individual protocols
- Start team meeting

---

## NEXT STEP: Email Notifications

See `N8N-EMAIL-NOTIFICATION-INSTRUCTIONS.md` for adding automatic Guru notifications!

