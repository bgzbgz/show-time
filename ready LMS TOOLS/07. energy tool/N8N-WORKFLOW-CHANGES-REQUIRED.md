# 🔧 N8N Workflow Changes Required for Corrected Energy Sprint

## 📋 Overview

The individual tool now has significantly more data fields. Your n8n workflows need minor updates to handle the expanded data structure.

---

## ✅ GOOD NEWS: Minimal Changes Needed!

Because your MongoDB nodes use flexible field mappings, most changes are **automatic**. The new fields will just flow through!

However, there are a few places where you should update calculations and aggregations.

---

## 🔄 WORKFLOW 1: Individual Submission

### Current Function Node (Calculate Metrics):

**BEFORE** (Current code):
```javascript
// Calculate average energy rating
const sleepRating = input.data.sleepRating || 5;
const foodRating = input.data.foodRating || 5;
const movementRating = input.data.movementRating || 5;
const brainRating = input.data.brainRating || 5;

const averageRating = (sleepRating + foodRating + movementRating + brainRating) / 4;

// Find lowest rated pillar
const ratings = {
  sleep: sleepRating,
  food: foodRating,
  movement: movementRating,
  brain: brainRating
};

let lowestPillar = 'sleep';
let lowestValue = sleepRating;

if (foodRating < lowestValue) { lowestPillar = 'food'; lowestValue = foodRating; }
if (movementRating < lowestValue) { lowestPillar = 'movement'; lowestValue = movementRating; }
if (brainRating < lowestValue) { lowestPillar = 'brain'; }
```

**AFTER** (No change needed! Just add more fields to pass through):

The calculation stays the same. The new fields will automatically pass through to MongoDB because you're using `toolData: input.data`.

---

### MongoDB Node:

**Current fields** (comma-separated):
```
_id, toolName, toolDisplayName, userId, userName, companyId, companyName, sprintNumber, submittedAt, status, completionPercentage, version, averageEnergyRating, lowestRatedPillar, toolData
```

**NEW fields - NO CHANGE NEEDED!** ✅

All the new fields are inside `toolData`, so they automatically save!

---

## 🔄 WORKFLOW 2: Team Aggregation

### Current Function Node (Aggregation):

**OPTIONAL ENHANCEMENT** - Add habit summary:

**AFTER** (Enhanced to show habits):

```javascript
// Get all submissions
const items = $input.all();

if (items.length === 0) {
  return [{
    json: {
      error: true,
      message: "No submissions found for this company"
    }
  }];
}

// Initialize counters
let totalSleep = 0;
let totalFood = 0;
let totalMovement = 0;
let totalBrain = 0;
const drainCounts = {};
const protocols = [];
const habitSummary = {
  sleep: [],
  food: [],
  movement: [],
  brain: []
};

// Process each submission
items.forEach(item => {
  const data = item.json.toolData;
  
  // Sum ratings
  totalSleep += Number(data.sleepRating) || 0;
  totalFood += Number(data.foodRating) || 0;
  totalMovement += Number(data.movementRating) || 0;
  totalBrain += Number(data.brainRating) || 0;
  
  // Count energy drains
  if (data.biggestDrain) {
    const drain = data.biggestDrain;
    drainCounts[drain] = (drainCounts[drain] || 0) + 1;
  }
  
  // NEW: Collect habits from each person
  if (data.sleepKeyHabit) {
    habitSummary.sleep.push({
      userName: item.json.userName,
      habit: data.sleepKeyHabit,
      trigger: data.sleepTrigger,
      routine: data.sleepRoutine,
      reward: data.sleepReward,
      accountabilityPartner: data.sleepAccountabilityPartner
    });
  }
  
  if (data.foodKeyHabit) {
    habitSummary.food.push({
      userName: item.json.userName,
      habit: data.foodKeyHabit,
      trigger: data.foodTrigger,
      routine: data.foodRoutine,
      reward: data.foodReward,
      accountabilityPartner: data.foodAccountabilityPartner
    });
  }
  
  if (data.movementKeyHabit) {
    habitSummary.movement.push({
      userName: item.json.userName,
      habit: data.movementKeyHabit,
      trigger: data.movementTrigger,
      routine: data.movementRoutine,
      reward: data.movementReward,
      accountabilityPartner: data.movementAccountabilityPartner
    });
  }
  
  if (data.brainKeyHabit) {
    habitSummary.brain.push({
      userName: item.json.userName,
      habit: data.brainKeyHabit,
      trigger: data.brainTrigger,
      routine: data.brainRoutine,
      reward: data.brainReward,
      accountabilityPartner: data.brainAccountabilityPartner
    });
  }
  
  // Collect individual protocols
  protocols.push({
    userName: item.json.userName,
    userId: item.json.userId,
    submittedAt: item.json.submittedAt,
    averageRating: item.json.averageEnergyRating || 'N/A',
    lowestPillar: item.json.lowestRatedPillar || 'N/A',
    
    // Sleep
    sleepRating: data.sleepRating,
    sleepDoWell: data.sleepDoWell,
    sleepNotDoWell: data.sleepNotDoWell,
    sleepGoals: data.sleepGoals,
    sleepKeyHabit: data.sleepKeyHabit,
    sleepTrigger: data.sleepTrigger,
    sleepRoutine: data.sleepRoutine,
    sleepReward: data.sleepReward,
    sleepAccountabilityPartner: data.sleepAccountabilityPartner,
    
    // Food
    foodRating: data.foodRating,
    foodDoWell: data.foodDoWell,
    foodNotDoWell: data.foodNotDoWell,
    foodGoals: data.foodGoals,
    foodKeyHabit: data.foodKeyHabit,
    foodTrigger: data.foodTrigger,
    foodRoutine: data.foodRoutine,
    foodReward: data.foodReward,
    foodAccountabilityPartner: data.foodAccountabilityPartner,
    
    // Movement
    movementRating: data.movementRating,
    movementDoWell: data.movementDoWell,
    movementNotDoWell: data.movementNotDoWell,
    movementGoals: data.movementGoals,
    movementKeyHabit: data.movementKeyHabit,
    movementTrigger: data.movementTrigger,
    movementRoutine: data.movementRoutine,
    movementReward: data.movementReward,
    movementAccountabilityPartner: data.movementAccountabilityPartner,
    
    // Brain
    brainRating: data.brainRating,
    brainDoWell: data.brainDoWell,
    brainNotDoWell: data.brainNotDoWell,
    brainGoals: data.brainGoals,
    brainKeyHabit: data.brainKeyHabit,
    brainTrigger: data.brainTrigger,
    brainRoutine: data.brainRoutine,
    brainReward: data.brainReward,
    brainAccountabilityPartner: data.brainAccountabilityPartner,
    
    // Mental Energy
    mentalCanControl: data.mentalCanControl,
    mentalCannotControl: data.mentalCannotControl,
    stopDoing1: data.stopDoing1,
    stopDoing2: data.stopDoing2,
    stopDoing3: data.stopDoing3,
    doLess1: data.doLess1,
    doLess2: data.doLess2,
    doLess3: data.doLess3,
    doMore1: data.doMore1,
    doMore2: data.doMore2,
    doMore3: data.doMore3,
    eventDescription: data.eventDescription,
    gapAnalysis: data.gapAnalysis,
    idealResponse: data.idealResponse,
    futurePlan: data.futurePlan
  });
});

const count = items.length;

// Calculate averages
const averages = {
  sleep: (totalSleep / count).toFixed(1),
  food: (totalFood / count).toFixed(1),
  movement: (totalMovement / count).toFixed(1),
  brain: (totalBrain / count).toFixed(1),
  overall: ((totalSleep + totalFood + totalMovement + totalBrain) / (count * 4)).toFixed(1)
};

// Sort drains by frequency (top 5)
const commonDrains = Object.entries(drainCounts)
  .map(([drain, count]) => ({
    drain: drain,
    count: count,
    percentage: Math.round((count / items.length) * 100)
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);

// Return aggregated data
return [{
  json: {
    success: true,
    companyId: items[0].json.companyId,
    companyName: items[0].json.companyName,
    submissionCount: count,
    averageRatings: averages,
    commonEnergyDrains: commonDrains,
    habitSummary: habitSummary,  // NEW: Summary of habits
    individualProtocols: protocols,
    generatedAt: new Date().toISOString()
  }
}];
```

**Changes:**
- ✅ Added `habitSummary` to group habits by pillar
- ✅ Added all new fields to `individualProtocols`
- ✅ Keeps existing calculations intact

---

## 🔄 WORKFLOW 3: Team Meeting Submission

### No Changes Needed! ✅

The team meeting workflow already handles flexible data. It will automatically accept and store the new meeting data.

---

## 📝 STEP-BY-STEP UPDATE INSTRUCTIONS

### **Workflow 2 Only (Optional Enhancement):**

1. Open n8n
2. Go to "Energy - Team Aggregation" workflow
3. Click on the Function node ("Calculate Team Metrics")
4. Replace the code with the enhanced version above
5. Click "Save"
6. Test by loading team data in the Team Meeting Tool

**Note:** This enhancement is optional. The workflow will work fine without it, but this gives you better habit summaries for the team meeting.

---

## 🎯 SUMMARY OF CHANGES

| Workflow | Change Needed | Complexity | Required? |
|----------|---------------|------------|-----------|
| Workflow 1: Individual Submission | None - auto-handles new fields | None | No change |
| Workflow 2: Team Aggregation | Add habit summary (optional) | Easy | Optional |
| Workflow 3: Team Meeting | None - already flexible | None | No change |

---

## ✅ TESTING CHECKLIST

After updating Workflow 2 (if you choose to):

- [ ] Submit new individual tool with all habit data
- [ ] Check MongoDB - verify all new fields saved
- [ ] Load team aggregation
- [ ] Verify `habitSummary` appears in response
- [ ] Verify `individualProtocols` has all new fields
- [ ] Test team meeting tool displays new data

---

## 🚀 TIMELINE

- **If you skip the optional enhancement:** 0 minutes (no changes needed!)
- **If you add the enhancement:** 5 minutes to update Function node

---

## 💡 RECOMMENDATION

**Add the optional enhancement to Workflow 2.**

Why? Because the team meeting tool will be able to show a nice summary of everyone's habits grouped by pillar, making it easier for the Guru to facilitate the discussion.

But if you're in a rush, you can skip it - the individual protocols array will still have all the data.

---

## 📞 NEED HELP?

If you need me to generate the exact n8n workflow JSON for import, just ask!

Otherwise, the only real change is updating one Function node in Workflow 2, and that's optional.

**Your n8n backend is 95% ready as-is!** 🎉

