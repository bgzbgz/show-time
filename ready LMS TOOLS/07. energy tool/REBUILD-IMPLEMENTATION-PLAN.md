# 🔨 Individual Tool Rebuild - Implementation Plan

## 📋 NEW STRUCTURE

### **Tool Flow:**

```
Cover Page
   ↓
Intro Screen (Purpose/Time/Rules)
   ↓
[01] SLEEP PROTOCOL
   ├── Current State Assessment
   │   ├── Rating (1-10)
   │   ├── What I do WELL
   │   └── What I do NOT do well
   ├── My Goals
   └── ONE KEY HABIT TO DEVELOP
       ├── TRIGGER/REMINDER
       ├── ROUTINE
       ├── REWARD
       └── ACCOUNTABILITY PARTNER
   ↓
[02] FOOD PROTOCOL
   ├── [Same structure as Sleep]
   ↓
[03] MOVEMENT PROTOCOL
   ├── [Same structure as Sleep]
   ↓
[04] BRAIN USE PROTOCOL
   ├── [Same structure as Sleep]
   ↓
[05] MENTAL ENERGY WISDOM
   ├── Part 1: Control Analysis
   │   ├── What I CAN control
   │   └── What I CANNOT control
   ├── Part 2: Strategic Decisions
   │   ├── STOP doing (3 things)
   │   ├── DO LESS of (3 things)
   │   └── DO MORE of (3 things)
   └── Part 3: Event-Gap-Response
       ├── Event description
       ├── The GAP (feelings/thoughts)
       ├── Ideal response
       └── Future plan
   ↓
[06] CANVAS / SUMMARY
   ├── Show all protocols
   ├── Show all habits
   ├── Show mental energy insights
   └── Submit button
```

---

## 📊 NEW FORM DATA STRUCTURE

```javascript
formData: {
  // User Info
  userName: '',
  userEmail: '',
  companyName: '',
  
  // SLEEP
  sleepRating: 5,
  sleepDoWell: '',
  sleepNotDoWell: '',
  sleepGoals: '',
  sleepKeyHabit: '',
  sleepTrigger: '',
  sleepRoutine: '',
  sleepReward: '',
  sleepAccountabilityPartner: '',
  
  // FOOD
  foodRating: 5,
  foodDoWell: '',
  foodNotDoWell: '',
  foodGoals: '',
  foodKeyHabit: '',
  foodTrigger: '',
  foodRoutine: '',
  foodReward: '',
  foodAccountabilityPartner: '',
  
  // MOVEMENT
  movementRating: 5,
  movementDoWell: '',
  movementNotDoWell: '',
  movementGoals: '',
  movementKeyHabit: '',
  movementTrigger: '',
  movementRoutine: '',
  movementReward: '',
  movementAccountabilityPartner: '',
  
  // BRAIN
  brainRating: 5,
  brainDoWell: '',
  brainNotDoWell: '',
  brainGoals: '',
  brainKeyHabit: '',
  brainTrigger: '',
  brainRoutine: '',
  brainReward: '',
  brainAccountabilityPartner: '',
  
  // MENTAL ENERGY WISDOM
  mentalCanControl: '',
  mentalCannotControl: '',
  stopDoing1: '',
  stopDoing2: '',
  stopDoing3: '',
  doLess1: '',
  doLess2: '',
  doLess3: '',
  doMore1: '',
  doMore2: '',
  doMore3: '',
  eventDescription: '',
  gapAnalysis: '',
  idealResponse: '',
  futurePlan: ''
}
```

**Total fields: 69 fields** (vs 20 in current tool)

---

## 🎨 UI COMPONENTS NEEDED

### **Reusable Pillar Component:**

```jsx
function PillarSection({ 
  pillar,  // 'sleep', 'food', 'movement', 'brain'
  title,   // 'Sleep Protocol'
  number,  // '[01]'
  formData,
  updateField
}) {
  return (
    <div>
      <div className="numbered-section">{number} {title.toUpperCase()}</div>
      
      {/* Current State */}
      <div className="border-2 border-black p-6 mb-6">
        <h3>Current State Assessment</h3>
        
        <label>Rate your current {pillar} (1-10):</label>
        <input type="range" 1-10 />
        
        <label>What I do WELL:</label>
        <textarea field={`${pillar}DoWell`} />
        
        <label>What I do NOT do well:</label>
        <textarea field={`${pillar}NotDoWell`} />
      </div>
      
      {/* Goals */}
      <div className="border-2 border-black p-6 mb-6">
        <h3>My Goals</h3>
        <textarea field={`${pillar}Goals`} />
      </div>
      
      {/* ONE KEY HABIT */}
      <div className="border-2 border-black p-6 bg-yellow-50">
        <h3>ONE KEY HABIT TO DEVELOP</h3>
        
        <label>My Key Habit:</label>
        <input field={`${pillar}KeyHabit`} />
        
        <label>TRIGGER/REMINDER (When/Where):</label>
        <input field={`${pillar}Trigger`} />
        
        <label>ROUTINE (Specific actions):</label>
        <textarea field={`${pillar}Routine`} />
        
        <label>REWARD (What I get):</label>
        <input field={`${pillar}Reward`} />
        
        <label>ACCOUNTABILITY PARTNER:</label>
        <input field={`${pillar}AccountabilityPartner`} />
      </div>
    </div>
  );
}
```

---

## 🔄 STEP FLOW

| Step | Screen | Time | Validation |
|------|--------|------|------------|
| 0 | Cover | - | - |
| 0.5 | Intro | - | User info required |
| 1 | Sleep Protocol | 8 min | Key habit + trigger required |
| 2 | Food Protocol | 8 min | Key habit + trigger required |
| 3 | Movement Protocol | 8 min | Key habit + trigger required |
| 4 | Brain Protocol | 8 min | Key habit + trigger required |
| 5 | Mental Energy Wisdom | 10 min | All 3 parts required |
| 6 | Canvas | - | Review & submit |

**Total: ~45 minutes** (matches Fast Track timing!)

---

## 📦 FILES TO CREATE/UPDATE

1. **energy-body-mind-tool-v2.html** (NEW - Complete rebuild)
2. **Team meeting tool updates** (after individual tool done)
3. **Updated docs**

---

## ⏰ BUILD SEQUENCE

1. ✅ Create new formData structure
2. ✅ Build reusable PillarSection component
3. ✅ Create 4 pillar sections (Sleep, Food, Movement, Brain)
4. ✅ Create Mental Energy Wisdom section
5. ✅ Update Canvas to show all new data
6. ✅ Update Help Modal content
7. ✅ Test locally
8. ✅ Update team meeting tool
9. ✅ Test complete flow

**Estimated time: 3-4 hours**

---

## 🎯 STARTING NOW!

Building the new individual tool...

