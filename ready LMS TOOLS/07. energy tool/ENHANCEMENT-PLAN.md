# 🚀 Energy Sprint Tool Enhancement Plan

## Overview
Enhancing the individual tool to include TRIGGER/ROUTINE/REWARD/ACCOUNTABILITY framework and Mental Energy Wisdom section, plus building a Team Meeting Facilitation Tool.

---

## ✅ ENHANCEMENTS TO INDIVIDUAL TOOL

### 1. **Add New Form Data Fields**

**Mental Energy Wisdom (Section 2.5):**
```javascript
// Add to formData state:
canControl: '',
cannotControl: '',
stopDoing1: '', stopDoing2: '', stopDoing3: '',
doLess1: '', doLess2: '', doLess3: '',
doMore1: '', doMore2: '', doMore3: '',
eventDescription: '',
gapAnalysis: '',
idealResponse: '',
futurePlan: '',
```

**TRIGGER/ROUTINE/REWARD/ACCOUNTABILITY (Section 3):**
```javascript
// Add for each pillar:
sleepTrigger: '', sleepRoutine: '', sleepReward: '', sleepAccountability: '',
foodTrigger: '', foodRoutine: '', foodReward: '', foodAccountability: '',
movementTrigger: '', movementRoutine: '', movementReward: '', movementAccountability: '',
brainTrigger: '', brainRoutine: '', brainReward: '', brainAccountability: '',
```

---

### 2. **Add New Section 2.5: Mental Energy Wisdom**

Insert between Section 2 (Energy Drains) and Section 3 (Energy Protocol).

**Layout:**
```
[02.5] MENTAL ENERGY WISDOM

Part 1: Control Analysis
┌─────────────────────────────────────────┐
│ What matters to me that I CAN control:  │
│ [textarea]                              │
│                                         │
│ What matters to me that I CANNOT control:│
│ [textarea]                              │
└─────────────────────────────────────────┘

Part 2: Stop / Do Less / Do More
┌─────────────────────────────────────────┐
│ STOP doing (3 things):                  │
│ 1. [input]                              │
│ 2. [input]                              │
│ 3. [input]                              │
│                                         │
│ DO LESS of (3 things):                  │
│ 1. [input]                              │
│ 2. [input]                              │
│ 3. [input]                              │
│                                         │
│ DO MORE of (3 things):                  │
│ 1. [input]                              │
│ 2. [input]                              │
│ 3. [input]                              │
└─────────────────────────────────────────┘

Part 3: Event-Gap-Response Analysis
┌─────────────────────────────────────────┐
│ Describe a recent event where your      │
│ reaction wasn't aligned with your ideal:│
│ [textarea]                              │
│                                         │
│ The GAP - Your feelings and thoughts:   │
│ [textarea]                              │
│                                         │
│ Your ideal response:                    │
│ [textarea]                              │
│                                         │
│ Plan for future responses:              │
│ [textarea]                              │
└─────────────────────────────────────────┘
```

---

### 3. **Enhance Section 3: Add TRIGGER/ROUTINE/REWARD/ACCOUNTABILITY**

For EACH pillar (Sleep, Food, Movement, Brain), add these 4 fields after the commitment:

**Template for Sleep (repeat for Food, Movement, Brain):**
```html
<div className="border-2 border-black p-6 bg-gray-50">
    <h3 className="plaak text-2xl mb-4">Sleep Protocol</h3>
    
    <!-- Fast Track Rules box (keep existing) -->
    
    <!-- Existing Commitment field -->
    <label className="block mb-2 font-medium">My Sleep Commitment</label>
    <textarea
        className="worksheet-textarea"
        value={formData.sleepCommitment}
        onChange={(e) => updateFormData('sleepCommitment', e.target.value)}
    ></textarea>
    
    <!-- NEW: Action Plan Framework -->
    <div className="mt-6 bg-white p-6 border-2 border-gray-300">
        <h4 className="plaak text-lg mb-4">ACTION PLAN</h4>
        
        <div className="space-y-4">
            <div>
                <label className="block mb-2 font-medium">TRIGGER/REMINDER</label>
                <p className="text-sm text-gray-600 mb-2">What will remind you to perform this habit?</p>
                <input
                    type="text"
                    className="worksheet-input"
                    placeholder="e.g., Phone alarm at 10pm, Visual cue on nightstand"
                    value={formData.sleepTrigger}
                    onChange={(e) => updateFormData('sleepTrigger', e.target.value)}
                />
            </div>
            
            <div>
                <label className="block mb-2 font-medium">ROUTINE</label>
                <p className="text-sm text-gray-600 mb-2">Define the specific steps you'll take</p>
                <textarea
                    className="worksheet-textarea"
                    placeholder="e.g., 1. Put phone in kitchen&#10;2. Brush teeth&#10;3. Read for 20 minutes&#10;4. Lights out by 11pm"
                    value={formData.sleepRoutine}
                    onChange={(e) => updateFormData('sleepRoutine', e.target.value)}
                ></textarea>
            </div>
            
            <div>
                <label className="block mb-2 font-medium">REWARD</label>
                <p className="text-sm text-gray-600 mb-2">Small reward for successfully sticking to the habit</p>
                <input
                    type="text"
                    className="worksheet-input"
                    placeholder="e.g., Feel energized in morning meetings, Track streak and celebrate weekly"
                    value={formData.sleepReward}
                    onChange={(e) => updateFormData('sleepReward', e.target.value)}
                />
            </div>
            
            <div>
                <label className="block mb-2 font-medium">ACCOUNTABILITY PARTNER</label>
                <p className="text-sm text-gray-600 mb-2">Who will you check in with regarding your progress?</p>
                <input
                    type="text"
                    className="worksheet-input"
                    placeholder="e.g., Text my spouse at 10pm daily, Weekly check-in with team member"
                    value={formData.sleepAccountability}
                    onChange={(e) => updateFormData('sleepAccountability', e.target.value)}
                />
            </div>
        </div>
    </div>
</div>
```

---

### 4. **Update Progress Dots**

Change from 4 steps to 5 steps:
```javascript
const steps = [
    { num: 1, label: 'Audit' },
    { num: 2, label: 'Drains' },
    { num: 3, label: 'Wisdom' },  // NEW
    { num: 4, label: 'Protocol' },
    { num: 5, label: 'First Win' }
];
```

---

### 5. **Update Canvas to Display All New Fields**

**Add Mental Energy Wisdom Section:**
```javascript
<div className="border-2 border-black p-8 mb-8">
    <h2 className="plaak text-3xl mb-6">Mental Energy Wisdom</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
            <h3 className="plaak text-xl mb-3">I CAN Control</h3>
            <p className="text-sm">{formData.canControl}</p>
        </div>
        <div>
            <h3 className="plaak text-xl mb-3">I CANNOT Control</h3>
            <p className="text-sm">{formData.cannotControl}</p>
        </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
            <h3 className="plaak text-lg mb-2">STOP</h3>
            <ol className="list-decimal list-inside text-sm">
                <li>{formData.stopDoing1}</li>
                <li>{formData.stopDoing2}</li>
                <li>{formData.stopDoing3}</li>
            </ol>
        </div>
        <div>
            <h3 className="plaak text-lg mb-2">DO LESS</h3>
            <ol className="list-decimal list-inside text-sm">
                <li>{formData.doLess1}</li>
                <li>{formData.doLess2}</li>
                <li>{formData.doLess3}</li>
            </ol>
        </div>
        <div>
            <h3 className="plaak text-lg mb-2">DO MORE</h3>
            <ol className="list-decimal list-inside text-sm">
                <li>{formData.doMore1}</li>
                <li>{formData.doMore2}</li>
                <li>{formData.doMore3}</li>
            </ol>
        </div>
    </div>
</div>
```

**Add TRIGGER/ROUTINE/REWARD/ACCOUNTABILITY to Protocol Display:**
```javascript
<div className="border-2 border-white p-6">
    <h3 className="plaak text-2xl mb-3">Sleep Protocol</h3>
    <p className="mb-4">{formData.sleepCommitment}</p>
    
    <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-500 pt-4 mt-4">
        <div>
            <strong>TRIGGER:</strong>
            <p>{formData.sleepTrigger}</p>
        </div>
        <div>
            <strong>REWARD:</strong>
            <p>{formData.sleepReward}</p>
        </div>
        <div className="col-span-2">
            <strong>ROUTINE:</strong>
            <p className="whitespace-pre-wrap">{formData.sleepRoutine}</p>
        </div>
        <div className="col-span-2">
            <strong>ACCOUNTABILITY:</strong>
            <p>{formData.sleepAccountability}</p>
        </div>
    </div>
</div>
```

---

### 6. **Update Celebration Progress Percentages**

```javascript
// Section 1: 20% (was 25%)
// Section 2: 40% (was 50%)
// Section 2.5: 60% (NEW)
// Section 3: 80% (was 75%)
// Section 4: 100% (was 100%)
```

---

## 🆕 BUILD TEAM MEETING FACILITATION TOOL

### **New File:** `team-meeting-tool.html`

**Purpose:** Guru uses this during the 60-minute team meeting to:
1. View aggregated individual tool submissions
2. Facilitate discussion
3. Document team strategies
4. Assign owners and deadlines
5. Create accountability plan

**Structure:**

```
┌────────────────────────────────────────────┐
│ ENERGY SPRINT - TEAM MEETING              │
│ Fast Track Program                         │
└────────────────────────────────────────────┘

[STEP 1] SELECT COMPANY
┌────────────────────────────────────────────┐
│ Company: [Dropdown of companies]           │
│ Date: [Date picker]                        │
│ Facilitator: [Input]                       │
│ [Load Individual Submissions] button       │
└────────────────────────────────────────────┘

[STEP 2] REVIEW INDIVIDUAL INSIGHTS (10 min)
┌────────────────────────────────────────────┐
│ Team Energy Snapshot                       │
│ ├─ Average Ratings:                        │
│ │  Sleep: 5.2/10, Food: 4.8/10             │
│ │  Movement: 6.1/10, Brain: 5.5/10         │
│ │                                           │
│ ├─ Common Energy Drains (frequency):       │
│ │  • Poor sleep quality (60%)               │
│ │  • Afternoon energy crashes (40%)         │
│ │  • Constant context-switching (80%)       │
│ │                                           │
│ ├─ Individual Protocols Summary:           │
│    [Expandable list of each person's       │
│     commitments and first wins]            │
└────────────────────────────────────────────┘

[STEP 3] GROUP DISCUSSION NOTES (30 min)
┌────────────────────────────────────────────┐
│ Discussion Focus Areas:                    │
│ • How can we create team-wide rituals?     │
│ • Which habits drive highest productivity? │
│                                            │
│ Common Challenges Identified:              │
│ [Large textarea for Guru to capture notes] │
│                                            │
│ Team-Wide Rituals Proposed:                │
│ [Large textarea]                           │
└────────────────────────────────────────────┘

[STEP 4] TEAM STRATEGIES (20 min)
┌────────────────────────────────────────────┐
│ Strategy 1:                                │
│ [Input: Description]                       │
│ Owner: [Input] | Deadline: [Date]         │
│                                            │
│ Strategy 2:                                │
│ [Input: Description]                       │
│ Owner: [Input] | Deadline: [Date]         │
│                                            │
│ Strategy 3:                                │
│ [Input: Description]                       │
│ Owner: [Input] | Deadline: [Date]         │
└────────────────────────────────────────────┘

[STEP 5] ACCOUNTABILITY PLAN (15 min)
┌────────────────────────────────────────────┐
│ How we'll track progress:                 │
│ [Textarea]                                 │
│                                            │
│ When we'll report back:                    │
│ [Input]                                    │
│                                            │
│ Accountability partnerships:               │
│ [Textarea - who checks in with who]       │
└────────────────────────────────────────────┘

[SUBMIT TEAM MEETING RESULTS]
```

**Key Features:**
- Fetches individual submissions from MongoDB by companyId
- Auto-calculates averages and patterns
- Clean interface for screen sharing
- Saves team meeting results back to MongoDB
- PDF export of meeting results

---

## 📊 DATA FLOW

```
BEFORE MEETING:
┌────────────────────────────────────────┐
│ Individual completes enhanced tool      │
│ → MongoDB: energy_body_mind_submissions │
│   Includes: ratings, drains, wisdom,   │
│   protocols with TRIGGER/ROUTINE/etc.   │
└────────────────────────────────────────┘

DURING MEETING:
┌────────────────────────────────────────┐
│ Guru opens team-meeting-tool.html      │
│ → Fetches submissions by companyId     │
│ → Shows aggregated insights            │
│ → Guru facilitates discussion          │
│ → Captures team strategies             │
│ → MongoDB: team_meeting_submissions     │
└────────────────────────────────────────┘

AFTER MEETING:
┌────────────────────────────────────────┐
│ Individual protocols + Team strategies  │
│ → Implementation & tracking             │
│ → Progress reports at next sprint      │
└────────────────────────────────────────┘
```

---

## 📝 IMPLEMENTATION STEPS

### Phase 1: Enhance Individual Tool ✅
1. Add new formData fields
2. Create Section 2.5 component
3. Enhance Section 3 with action plans
4. Update Progress dots (5 steps)
5. Update Canvas display
6. Test complete flow

### Phase 2: Build Team Meeting Tool ✅
1. Create new HTML file structure
2. Build company selection interface
3. Build data fetching logic
4. Build aggregation display
5. Build note-taking interface
6. Build strategy input system
7. Build submission logic
8. Test with sample data

### Phase 3: Documentation ✅
1. Update README
2. Create facilitator guide
3. Update quick start
4. Create integration guide

---

## 🎯 SUCCESS CRITERIA

**Individual Tool:**
- ✅ Captures TRIGGER/ROUTINE/REWARD/ACCOUNTABILITY for each pillar
- ✅ Includes Mental Energy Wisdom section
- ✅ Completion time: 25-35 minutes
- ✅ All data submits to MongoDB
- ✅ Canvas shows complete protocol

**Team Meeting Tool:**
- ✅ Loads individual submissions by company
- ✅ Shows aggregated insights automatically
- ✅ Facilitates 60-minute meeting structure
- ✅ Captures team strategies with owners/deadlines
- ✅ Submits team meeting results to MongoDB

**Complete System:**
- ✅ Individual prep feeds team discussion
- ✅ Team discussion creates collective strategies
- ✅ Accountability mechanisms in place
- ✅ Trackable outcomes

---

## 🚀 READY TO IMPLEMENT

Say "GO" and I'll start building:
1. Enhanced individual tool (complete with all sections)
2. Team meeting facilitation tool (complete new tool)
3. Updated documentation

This will be the most comprehensive Fast Track energy system! ⚡

