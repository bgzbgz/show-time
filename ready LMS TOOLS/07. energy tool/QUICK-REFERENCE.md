# ⚡ Energy Sprint Tools - Quick Reference Card

## 🔗 WEBHOOK URLS

```
Individual Submission:
https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit

Team Aggregation:
https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-team-aggregate

Team Meeting Submission:
https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-team-submit
```

---

## 📁 KEY FILES

| File | Purpose | Status |
|------|---------|--------|
| `energy-body-mind-tool.html` | Individual tool | ⚠️ Update line 310 |
| `energy-team-meeting-tool.html` | Team meeting tool | ✅ Ready |
| `ENERGY-TOOLS-README.md` | Main documentation | 📖 Read first |
| `TESTING-CHECKLIST.md` | Test procedures | ✅ Use to verify |
| `DELIVERY-SUMMARY.md` | What's delivered | 📦 Overview |

---

## 💾 MONGODB COLLECTIONS

```
energy_body_mind_submissions - Individual protocols
energyteam_meeting_submissions - Team meeting results
```

---

## 🔧 THE ONE UPDATE YOU NEED

**File:** `energy-body-mind-tool.html`
**Line:** 310
**Change from:**
```javascript
'https://n8n-edge.fasttrack-diagnostic.com/webhook/608b17ea-9618-4877-ae3c-85eb2e89b700'
```
**Change to:**
```javascript
'https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit'
```

---

## 🧪 QUICK TEST COMMANDS

### Test Individual Submission:
```powershell
$body = @{userName="Test"; userEmail="test@test.com"; companyName="Test Co"; data=@{sleepRating=6; foodRating=5; movementRating=7; brainRating=5}} | ConvertTo-Json -Depth 10; Invoke-RestMethod -Uri "https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-individual-submit" -Method Post -Body $body -ContentType "application/json"
```

### Test Team Aggregation:
```powershell
Invoke-RestMethod -Uri "https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-team-aggregate?companyId=test_company_inc" -Method Get
```

---

## 🐛 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Webhook not found" | Check workflow is Active in n8n |
| No team data loads | Check exact companyId in MongoDB |
| CORS error | Add "Allowed Origins: *" in webhook node |
| Missing MongoDB data | Check n8n execution logs |

---

## ✅ 5-MINUTE TEST SEQUENCE

1. ⏱️ **0:00** - Update line 310 in individual tool
2. ⏱️ **0:30** - Open individual tool, fill form
3. ⏱️ **3:00** - Submit, verify MongoDB
4. ⏱️ **3:30** - Open team meeting tool
5. ⏱️ **4:00** - Load data, verify display
6. ⏱️ **5:00** - ✅ Done!

---

## 📊 SUCCESS INDICATORS

✅ Individual tool submits without errors
✅ n8n shows green checkmarks
✅ MongoDB has both collections with data
✅ Team tool loads aggregated data
✅ No red errors in browser console

---

## 🚀 LAUNCH CHECKLIST

- [ ] Update line 310
- [ ] Test individual tool
- [ ] Test team meeting tool
- [ ] Verify MongoDB data
- [ ] Check n8n workflows active
- [ ] Review main documentation
- [ ] Train Gurus on team tool
- [ ] Deploy to users

---

## 📞 WHERE TO LOOK FOR ISSUES

1. **n8n Executions tab** - Backend errors
2. **Browser Console (F12)** - Frontend errors
3. **MongoDB Compass** - Data verification
4. **ENERGY-TOOLS-README.md** - Troubleshooting guide

---

## 💡 REMEMBER

- All workflows are ACTIVE ✅
- All tests PASSED ✅
- Just ONE line to update ⚠️
- Then you're READY 🚀

---

**Keep this file open while working!**

