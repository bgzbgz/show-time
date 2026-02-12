# 📧 N8N Email Notifications (OPTIONAL)

## PURPOSE
Automatically email the Guru when a team member submits their energy protocol.

---

## OVERVIEW

We'll update **Workflow 1 (Energy - Individual Submission)** to add an email notification.

**What happens:**
1. Team member submits protocol
2. Saves to MongoDB ✅ (already working)
3. **NEW:** Sends email to Guru
4. Returns success

---

## OPTION 1: SIMPLE WEBHOOK NOTIFICATION (RECOMMENDED)

Instead of email, send a webhook to a Guru notification system.

### **Add to Workflow 1:**

**After MongoDB node, add:**

1. **HTTP Request Node**
   - **Method:** POST
   - **URL:** `https://your-notification-system.com/api/notify`
   - **Body:**

```json
{
  "type": "energy_submission",
  "userName": "={{ $json.userName }}",
  "companyName": "={{ $json.companyName }}",
  "companyId": "={{ $json.companyId }}",
  "submittedAt": "={{ $json.submittedAt }}",
  "dashboardUrl": "https://your-dashboard-url.com?companyId={{ $json.companyId }}"
}
```

**Benefits:**
- Faster than email
- Can integrate with Slack/Teams/etc.
- No email server config needed

---

## OPTION 2: EMAIL VIA GMAIL/SMTP

### **Prerequisites:**

1. Gmail account for sending
2. App-specific password (if using Gmail)
3. Guru's email address

---

### **Step-by-Step:**

#### **Node: Send Email (Gmail)**

1. Open **Workflow 1: Energy - Individual Submission**
2. Click **+** after MongoDB node
3. Search for **Gmail** (or **Send Email** for SMTP)
4. Configure:

**For Gmail:**
- **Resource:** Message
- **Operation:** Send
- **To:** `guru@fasttrack.com` (replace with actual Guru email)
- **Subject:**

```
Energy Protocol Submitted - {{ $json.userName }} at {{ $json.companyName }}
```

- **Message (HTML):**

```html
<h2>New Energy Protocol Submitted!</h2>

<p><strong>Team Member:</strong> {{ $json.userName }}</p>
<p><strong>Email:</strong> {{ $json.userEmail }}</p>
<p><strong>Company:</strong> {{ $json.companyName }}</p>
<p><strong>Submitted:</strong> {{ $json.submittedAt }}</p>

<hr>

<h3>Energy Ratings:</h3>
<ul>
  <li><strong>Sleep:</strong> {{ $json.toolData.sleepRating }}/10</li>
  <li><strong>Food:</strong> {{ $json.toolData.foodRating }}/10</li>
  <li><strong>Movement:</strong> {{ $json.toolData.movementRating }}/10</li>
  <li><strong>Brain:</strong> {{ $json.toolData.brainRating }}/10</li>
</ul>

<h3>Key Sleep Habit:</h3>
<p>{{ $json.toolData.sleepKeyHabit }}</p>

<hr>

<p><a href="https://your-domain.com/energy-guru-dashboard.html?companyId={{ $json.companyId }}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block;">View Full Dashboard →</a></p>

<p style="color: #666; font-size: 12px;">Fast Track Energy Sprint</p>
```

5. **Credentials:**
   - Click **Create New Credential**
   - Enter Gmail username/password (or app password)
   - Test connection

6. **Execute Node** to test
   - Should receive email!

---

### **For SMTP (Alternative to Gmail):**

If you have your own SMTP server:

1. Use **Send Email** node instead of Gmail
2. Configure:
   - **From Email:** `notifications@fasttrack.com`
   - **To Email:** `guru@fasttrack.com`
   - **SMTP Settings:**
     - Host: `smtp.your-server.com`
     - Port: `587`
     - Username: `your-username`
     - Password: `your-password`
     - Secure: `true`

---

## OPTION 3: DIGEST EMAIL (ONCE PER DAY)

Instead of emailing for each submission, send one daily summary.

### **Create New Workflow:**

**Name:** Energy - Daily Guru Digest

#### **Node 1: Schedule Trigger**
- **Trigger:** Cron
- **Mode:** Every Day
- **Hour:** 8 (8 AM)

#### **Node 2: MongoDB - Find Today's Submissions**
- **Collection:** `energy_body_mind_submissions`
- **Query:**

```json
{
  "submittedAt": {
    "$gte": "={{ new Date(new Date().setHours(0,0,0,0)).toISOString() }}"
  }
}
```

#### **Node 3: Function - Group by Company**

```javascript
const items = $input.all();

if (items.length === 0) {
  return [{json: {hasSubmissions: false}}];
}

// Group by company
const byCompany = {};
items.forEach(item => {
  const companyId = item.json.companyId;
  if (!byCompany[companyId]) {
    byCompany[companyId] = {
      companyName: item.json.companyName,
      companyId: companyId,
      submissions: []
    };
  }
  byCompany[companyId].submissions.push(item.json);
});

return [{
  json: {
    hasSubmissions: true,
    companies: Object.values(byCompany)
  }
}];
```

#### **Node 4: Send Email**

**Subject:**
```
Energy Sprint Daily Digest - {{ $json.companies.length }} companies submitted
```

**Body:**
```html
<h2>Energy Sprint - Daily Digest</h2>
<p><strong>Date:</strong> {{ new Date().toLocaleDateString() }}</p>

{{ #each $json.companies }}
  <h3>{{ this.companyName }} ({{ this.submissions.length }} submissions)</h3>
  <ul>
    {{ #each this.submissions }}
      <li><strong>{{ this.userName }}</strong> - Submitted at {{ new Date(this.submittedAt).toLocaleTimeString() }}</li>
    {{ /each }}
  </ul>
{{ /each }}
```

---

## TESTING EMAIL

### **Test Single Email:**

1. Open Workflow 1
2. Click **Execute Workflow** manually
3. Check Guru email inbox
4. Should receive notification!

---

### **Test with Real Submission:**

1. Open `energy-individual-tool.html`
2. Fill out and submit
3. Check email within 1-2 minutes

---

## TROUBLESHOOTING

### **Email Not Received**

**Check:**
1. Gmail credentials correct?
2. App password enabled (for Gmail)?
3. "Less secure apps" disabled? (Use app password instead)
4. Check spam folder

**Fix:**
- Re-authenticate Gmail in n8n
- Use app-specific password (Settings → Security → App passwords)

---

### **Email Formatting Issues**

**Check:**
1. HTML syntax in email body
2. Missing closing tags

**Fix:**
- Use plain text first to test
- Add HTML after plain text works

---

### **Variables Not Replacing**

**Check:**
1. Syntax: `{{ $json.fieldName }}`
2. Field exists in previous node output

**Fix:**
- Click previous node → View output
- Copy exact field name

---

## RECOMMENDED APPROACH

**For Fast Track:**

Use **Option 1** (Webhook Notification) because:
- ✅ Faster than email
- ✅ Can integrate with Slack/Teams
- ✅ Easier to debug
- ✅ No email server setup
- ✅ Can trigger dashboard refresh

**Email is good for:**
- External Gurus without dashboard access
- Compliance/record-keeping
- Digest reports

---

## COMPLETE!

You now have options for:
1. ✅ Real-time webhook notifications
2. ✅ Individual email notifications
3. ✅ Daily digest emails

Choose what works best for your setup!

---

## NEXT STEPS

1. Test the complete flow end-to-end
2. Train Gurus on the dashboard
3. Launch to first team!

🎉

