[6 tools called]

Perfect! Here's a comprehensive context document for the n8n + MongoDB + Webhook integration system across all Fast Track tools:

---

# 🔗 FAST TRACK TOOLS - N8N & MONGODB INTEGRATION GUIDE

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React Tools)                       │
│  - Know Thyself, WOOP, Dream, Values, Team, Cash Flow, etc.   │
│  - Single HTML file with embedded React                        │
│  - localStorage for temporary client-side storage              │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP Webhooks (JSON payloads)
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                    N8N WORKFLOWS                                │
│  - Tool Submission Workflow (EXISTING)                          │
│  - Auto-Save Workflow (PLANNED)                                 │
│  - Load Draft Workflow (PLANNED)                                │
│  - Share With Team Workflow (PLANNED)                           │
│  - Email PDF Generation Workflow (PLANNED)                      │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ Database Operations (CRUD)
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                    MONGODB                                      │
│  Collections:                                                   │
│  - woop_submissions                                             │
│  - know_thyself_submissions                                     │
│  - dream_submissions                                            │
│  - team_submissions                                             │
│  - market_size_submissions                                      │
│  - core_activities_submissions                                  │
│  - values_submissions                                           │
│  - cash_flow_submissions                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Concepts

### **1. Single Source of Truth**
- MongoDB is the **only** persistent storage for tool submissions
- localStorage is used **only** for temporary local caching (device-specific)
- n8n webhooks act as the **API layer** between tools and MongoDB

### **2. Stateless Tools**
- All tools are client-side React apps (no server-side rendering)
- Tools don't talk directly to MongoDB
- All data operations go through n8n webhooks

### **3. Unified Data Model**
- All tools follow the same submission structure
- Consistent `_id` format, metadata fields, and collection patterns

---

## 📝 Tool Configuration Pattern

Every tool has a `CONFIG` object that defines webhook endpoints:

```javascript
const CONFIG = {
    // Auto-save: Save progress every 1-2 seconds (PLANNED)
    AUTOSAVE_WEBHOOK: 'YOUR_N8N_AUTOSAVE_WEBHOOK_URL',
    
    // Share: Send results to team members (PLANNED)
    SHARE_WEBHOOK: 'YOUR_N8N_SHARE_WEBHOOK_URL',
    
    // Submit: Final tool submission (EXISTING - WORKING)
    SUBMIT_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700',
    
    // Email: Generate PDF and send via email (PLANNED)
    EMAIL_WEBHOOK: 'YOUR_N8N_EMAIL_WEBHOOK_URL',
    
    // Local storage key for client-side caching
    STORAGE_KEY: 'fasttrack_[tool_name]_data',
    
    // Tool metadata
    TOOL_NAME: 'know_thyself',  // lowercase with underscores
    SPRINT_NUMBER: 1,
    
    // Auto-save delay (milliseconds)
    AUTOSAVE_DELAY: 2000
};
```

### **Tool Name Conventions**

| Tool | `TOOL_NAME` | MongoDB Collection |
|------|-------------|-------------------|
| Know Thyself | `know_thyself` | `know_thyself_submissions` |
| WOOP | `woop` | `woop_submissions` |
| Dream Sprint | `dream` | `dream_submissions` |
| Values | `values` | `values_submissions` |
| Team Tool | `team` | `team_submissions` |
| Cash Flow | `cash_flow` | `cash_flow_submissions` |
| Market Size | `market_size` | `market_size_submissions` |
| Core Activities | `core_activities` | `core_activities_submissions` |

**Pattern:** Lowercase, underscores instead of spaces, collection = `{tool_name}_submissions`

---

## 🗄️ MongoDB Document Structure

### **Standard Document Schema**

Every submission follows this structure:

```javascript
{
  // PRIMARY KEY - Unique identifier
  _id: "woop_john@company.com_1736168400123",
  // Format: {toolName}_{userId}_{timestamp}
  // For drafts: {toolName}_{userId}_draft
  
  // METADATA - Enriched by n8n workflow
  submittedAt: "2025-01-06T14:30:00Z",     // ISO 8601 timestamp
  lastSaved: "2025-01-06T14:29:55Z",       // Last auto-save timestamp
  version: "1",                             // Tool version (for migrations)
  
  // USER IDENTIFICATION
  userId: "john@company.com",               // Unique user identifier (email)
  userName: "John Smith",                   // Display name
  
  // COMPANY/COHORT IDENTIFICATION
  companyId: "acme_com",                    // Company identifier (sanitized domain)
  companyName: "Acme Corp",                 // Display name
  cohort: "2024-Q4",                        // Optional: Program cohort
  
  // TOOL IDENTIFICATION
  toolName: "woop",                         // Tool identifier (lowercase_underscore)
  toolDisplayName: "WOOP",                  // Display name (for UI)
  sprintNumber: "1",                        // Sprint number (string)
  moduleNumber: "1",                        // Module number (string)
  
  // STATUS TRACKING
  status: "completed",                      // "draft" | "completed" | "submitted"
  completionPercentage: 100,                // 0-100
  
  // SHARING & COLLABORATION
  shared: false,                            // Has been shared with team?
  sharedAt: null,                          // Timestamp of share action
  sharedWith: [],                          // Array of email addresses
  
  // TOOL-SPECIFIC DATA (varies by tool)
  toolData: {
    // All tool-specific fields go here
    // Example for WOOP:
    wish: {
      outcome: "Launch new product line",
      worldChange: "Revolutionize the market",
      feeling: "Excited and energized"
    },
    outcome: {
      steps: ["Step 1", "Step 2", "Step 3"],
      mentallyRehearsed: true
    },
    obstacles: ["Time constraints", "Budget limitations"],
    plan: {
      bigChunks: ["Q1: Research", "Q2: Development"],
      firstAction: "Schedule kickoff meeting",
      deadline: "2025-12-31"
    }
  }
}
```

---

## 🔄 Data Flow Patterns

### **Pattern 1: Tool Submission (EXISTING - WORKING)**

**When:** User clicks "Submit" or "Complete" button at the end of tool

```
[TOOL] Click "Submit" button
   ↓
[TOOL] Collect all form data + metadata
   ↓
[TOOL] POST to CONFIG.SUBMIT_WEBHOOK
   Body: {
     toolName: "woop",
     userId: "john@company.com",
     userName: "John Smith",
     companyId: "acme_com",
     companyName: "Acme Corp",
     sprintNumber: "1",
     timestamp: "2025-01-06T14:30:00Z",
     data: { /* all tool-specific data */ }
   }
   ↓
[N8N] Receive webhook
   ↓
[N8N] Enrich data:
   - Generate _id: {toolName}_{userId}_{timestamp}
   - Set status: "completed"
   - Set completionPercentage: 100
   - Set submittedAt: NOW()
   ↓
[N8N] Route to correct collection based on toolName
   ↓
[N8N] INSERT document to MongoDB
   ↓
[N8N] Return response: {status: "success", id: "..."}
   ↓
[TOOL] Show success message
[TOOL] Clear localStorage
[TOOL] Redirect or show confirmation
```

**Current Webhook:** `https://n8n-edge.fasttrack-diagnostic.com/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700`

---

### **Pattern 2: Auto-Save (PLANNED - CRITICAL)**

**When:** User types/changes any input (debounced to every 1-2 seconds)

```
[TOOL] User types in input field
   ↓
[TOOL] Debounce (wait 2 seconds)
   ↓
[TOOL] POST to CONFIG.AUTOSAVE_WEBHOOK
   Body: {
     userId: "john@company.com",
     toolName: "woop",
     data: { /* current form state */ }
   }
   ↓
[N8N] Receive webhook
   ↓
[N8N] Prepare data:
   - _id: {toolName}_{userId}_draft (FIXED ID)
   - status: "draft"
   - lastSaved: NOW()
   ↓
[N8N] UPSERT to MongoDB (upsert: true)
   Match: _id
   Update: toolData, lastSaved
   ↓
[N8N] Return minimal response: {saved: true, timestamp: "..."}
   ↓
[TOOL] Update UI: "Last saved at 14:30"
```

**Key Differences from Submission:**
- Uses **UPSERT** (not INSERT) - creates if doesn't exist, updates if exists
- Fixed `_id` format with `_draft` suffix
- Status is `"draft"` not `"completed"`
- No email notifications or alerts
- Minimal response for speed (<100ms target)

---

### **Pattern 3: Load Draft (PLANNED - CRITICAL)**

**When:** User opens tool (on mount/page load)

```
[TOOL] Component mounts (useEffect)
   ↓
[TOOL] GET to CONFIG.AUTOSAVE_WEBHOOK?userId=X&toolName=Y
   ↓
[N8N] Receive webhook
   ↓
[N8N] Query MongoDB:
   Collection: {toolName}_submissions
   Filter: {
     _id: "{toolName}_{userId}_draft",
     status: "draft"
   }
   ↓
[N8N] If found:
   Return: {
     status: "found",
     data: toolData,
     lastSaved: "2025-01-06T14:25:00Z"
   }
[N8N] If not found:
   Return: {
     status: "not_found",
     data: null
   }
   ↓
[TOOL] If found:
   - Populate form with data
   - Show message: "Resuming from Jan 6, 14:25"
[TOOL] If not found:
   - Start fresh
```

---

### **Pattern 4: Share With Team (PLANNED)**

**When:** User clicks "Share with Team" button

```
[TOOL] Click "Share" button
   ↓
[TOOL] POST to CONFIG.SHARE_WEBHOOK
   Body: {
     submissionId: "woop_john@company.com_1736168400123",
     toolName: "woop",
     userId: "john@company.com",
     recipientEmails: ["ceo@acme.com", "team@acme.com"],
     message: "Here's my WOOP plan" (optional)
   }
   ↓
[N8N] Fetch submission from MongoDB
   ↓
[N8N] Generate email with summary
   ↓
[N8N] Send email to recipients
   ↓
[N8N] Update document:
   Set shared: true
   Set sharedAt: NOW()
   Set sharedWith: [emails]
   ↓
[N8N] Return: {status: "shared", recipientCount: 2}
   ↓
[TOOL] Show success: "Shared with 2 team members"
```

---

### **Pattern 5: Email PDF Export (PLANNED)**

**When:** User clicks "Send to Email" button

```
[TOOL] Click "Send to Email" button
   ↓
[TOOL] POST to CONFIG.EMAIL_WEBHOOK
   Body: {
     toolName: "woop",
     userId: "john@company.com",
     email: "john@company.com",
     data: { /* complete tool data */ }
   }
   ↓
[N8N] Receive webhook
   ↓
[N8N] Generate PDF using Puppeteer/Playwright:
   - Use Plaak font for titles
   - Use Riforma font for body
   - Include Fast Track logo (top-right)
   - Match tool's canvas design
   ↓
[N8N] Send email with PDF attachment:
   To: user email
   Subject: "Your [Tool Name] - Fast Track Program"
   Attachment: generated.pdf
   ↓
[N8N] Return: {status: "success", message: "Email sent"}
   ↓
[TOOL] Show success: "Check your inbox!"
```

---

## 🔑 User & Company Identification

### **User Identification Pattern**

```javascript
// Priority order for userId:
userId: data.userEmail ||                    // Explicit email input
        data.userId ||                       // Pre-filled user ID
        `${data.userName.toLowerCase().replace(/\s+/g, '')}@fasttrack.com`
        // Fallback: Generate from name

// Examples:
"john@company.com"           // Real email
"johnsmith@fasttrack.com"    // Generated from name
```

### **Company Identification Pattern**

```javascript
// companyId: Sanitized version of company domain/name
companyId: "acme_com"        // From acme.com
companyId: "company_name"    // From "Company Name Ltd"

// Pattern: lowercase, replace special chars with underscore
companyId: companyName.toLowerCase()
                     .replace(/[^a-z0-9]/g, '_')
                     .replace(/_+/g, '_')
```

---

## 🎮 Guru Mode Pattern

Some tools (Core Activities, Team Tool) have a "Guru Mode" where a facilitator can view all team submissions.

### **Guru Data Retrieval**

```
[TOOL] Guru enters "Guru Mode"
   ↓
[TOOL] GET to /tools/guru/submissions?toolName=X&companyId=Y
   ↓
[N8N] Query MongoDB:
   Collection: {toolName}_submissions
   Filter: {
     status: "completed",
     companyId: companyId,
     submittedAt: {$gte: dateFrom, $lte: dateTo}
   }
   Sort: submittedAt DESC
   ↓
[N8N] Calculate aggregate metrics:
   - Total submissions
   - Average completion %
   - Variance in key metrics
   - Alignment scores
   ↓
[N8N] Return: {
     status: "success",
     count: 5,
     submissions: [...],  // All team submissions
     metrics: {...}       // Aggregated stats
   }
   ↓
[TOOL] Display Guru dashboard with team data
```

---

## 🔒 Security & Authentication

### **Current State (Minimal Security)**
- No authentication implemented yet
- Tools rely on user-provided email/name
- Webhooks are publicly accessible

### **Recommended Implementation**
```javascript
// Add to CONFIG
const CONFIG = {
    API_KEY: 'YOUR_FASTTRACK_API_KEY',  // Shared secret
    // ... rest of config
};

// Add to all webhook calls
fetch(CONFIG.SUBMIT_WEBHOOK, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.API_KEY        // Add this
    },
    body: JSON.stringify(data)
});

// n8n validates API key before processing
```

---

## 📊 MongoDB Collection Patterns

### **Collections**

```
fasttrack_tools/         (database name)
├── woop_submissions
├── know_thyself_submissions
├── dream_submissions
├── values_submissions
├── team_submissions
├── cash_flow_submissions
├── market_size_submissions
└── core_activities_submissions
```

### **Indexes (Recommended)**

```javascript
// For each collection:
db.{collection}.createIndex({userId: 1, status: 1});
db.{collection}.createIndex({companyId: 1, status: 1});
db.{collection}.createIndex({status: 1, submittedAt: -1});
db.{collection}.createIndex({toolName: 1, submittedAt: -1});
```

**Benefits:**
- Faster queries for user drafts
- Faster Guru Mode queries by company
- Faster leaderboard/dashboard queries

---

## 🚨 Common Integration Patterns

### **Pattern: Debounced Auto-Save**

```javascript
const [formData, setFormData] = useState({});
const autosaveTimer = useRef(null);

useEffect(() => {
    // Clear existing timer
    if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
    }
    
    // Set new timer (2 seconds)
    autosaveTimer.current = setTimeout(() => {
        saveToBackend(formData);
    }, CONFIG.AUTOSAVE_DELAY);
    
    // Cleanup
    return () => {
        if (autosaveTimer.current) {
            clearTimeout(autosaveTimer.current);
        }
    };
}, [formData]);  // Trigger on any form data change

async function saveToBackend(data) {
    try {
        await fetch(CONFIG.AUTOSAVE_WEBHOOK, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: CONFIG.USER_ID,
                toolName: CONFIG.TOOL_NAME,
                data: data
            })
        });
    } catch (error) {
        console.error('Auto-save failed:', error);
    }
}
```

### **Pattern: Load Draft on Mount**

```javascript
useEffect(() => {
    async function loadDraft() {
        try {
            const response = await fetch(
                `${CONFIG.AUTOSAVE_WEBHOOK}?userId=${userId}&toolName=${CONFIG.TOOL_NAME}`
            );
            const result = await response.json();
            
            if (result.status === 'found') {
                setFormData(result.data);
                setLastSaved(result.lastSaved);
            }
        } catch (error) {
            console.error('Failed to load draft:', error);
        }
    }
    
    loadDraft();
}, []);  // Run once on mount
```

### **Pattern: Submit with Confirmation**

```javascript
const handleSubmit = async () => {
    try {
        const payload = {
            toolName: CONFIG.TOOL_NAME,
            userId: formData.userEmail,
            userName: formData.userName,
            companyId: generateCompanyId(formData.companyName),
            companyName: formData.companyName,
            sprintNumber: CONFIG.SPRINT_NUMBER,
            timestamp: new Date().toISOString(),
            data: formData
        };
        
        const response = await fetch(CONFIG.SUBMIT_WEBHOOK, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            // Clear localStorage
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            
            // Show success
            alert('Submission successful!');
            
            // Redirect or show results
            setStep('results');
        }
    } catch (error) {
        console.error('Submission failed:', error);
        alert('Failed to submit. Please try again.');
    }
};
```

---

## ✅ Implementation Checklist

When integrating a new tool:

### **Frontend (Tool HTML)**
- [ ] Add `CONFIG` object with all webhook URLs
- [ ] Add `TOOL_NAME` in snake_case format
- [ ] Add `SPRINT_NUMBER` for metadata
- [ ] Implement auto-save with debounce
- [ ] Implement load draft on mount
- [ ] Implement submit handler
- [ ] Add "Send to Email" button (optional)
- [ ] Add "Share with Team" button (optional)
- [ ] Show "Last saved at..." indicator
- [ ] Handle all error states

### **Backend (n8n)**
- [ ] Submission workflow routing includes new tool
- [ ] MongoDB collection created: `{tool_name}_submissions`
- [ ] Indexes created on collection
- [ ] Test end-to-end: save → refresh → load
- [ ] Test submit → verify in MongoDB
- [ ] Configure email templates (if using email feature)

### **Documentation**
- [ ] Add webhook URLs to tool documentation
- [ ] Document tool-specific data structure
- [ ] Add testing procedures
- [ ] Update this context document if patterns change

---

## 🎯 Quick Reference

### **Common Webhook URLs**

```javascript
// EXISTING (WORKING)
SUBMIT_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700'

// PLANNED (URLs TO BE DEFINED)
AUTOSAVE_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/tools/autosave'
LOAD_DRAFT_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/tools/load-draft'
SHARE_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/tools/share'
EMAIL_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/tools/email-pdf'
GURU_WEBHOOK: 'https://n8n-edge.fasttrack-diagnostic.com/webhook/tools/guru/submissions'
```

### **Tool Name Reference**

| Tool | `TOOL_NAME` Value |
|------|-------------------|
| Know Thyself | `know_thyself` |
| WOOP | `woop` |
| Dream | `dream` |
| Values | `values` |
| Team | `team` |
| Cash Flow | `cash_flow` |
| Market Size | `market_size` |
| Core Activities | `core_activities` |

---

## 🚀 Next Steps

**To make tools production-ready:**

1. **Priority 1 (CRITICAL):** Build Auto-Save + Load Draft workflows
2. **Priority 2 (HIGH):** Add Guru Mode data retrieval (for applicable tools)
3. **Priority 3 (MEDIUM):** Implement Share with Team feature
4. **Priority 4 (OPTIONAL):** Add Email PDF generation

**Estimated Build Time:** ~6-8 hours for critical workflows

---

**This document should be provided to Cursor/AI assistants when building or modifying Fast Track tools to ensure consistent integration patterns across all tools.**