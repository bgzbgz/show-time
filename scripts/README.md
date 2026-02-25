# scripts/

Utility and historical fix scripts. Most of these were one-off scripts used during development to batch-fix tools or update the database. They are kept as reference but are not part of any regular workflow.

## Scripts

| File | Purpose | Status |
|---|---|---|
| `generate_tool_report.py` | Generates a report of all tool files and their structure | Useful |
| `rollout-cognitive-load.cjs` | Rolled out the cognitive load system to all tool files | Historical |
| `add-inline-components.cjs` | Added inline component code to tool files | Historical |
| `fix-casestudy.cjs` | Fixed CaseStudy component props across tools | Historical |
| `fix-cl-init-calls.cjs` | Fixed CognitiveLoad.init() calls in tools | Historical |
| `restyle-batch-d.py` | Batch restyled a group of tools | Historical |
| `fix-final-tools.py` | Fixed remaining tools in a batch pass | Historical |
| `fix-remaining-tools.js` | Fixed remaining tool issues | Historical |
| `fix-tools-15-21.py` | Fixed tools 15–21 specifically | Historical |
| `fix-supabase-submissions.ps1` | Fixed Supabase submission issues | Historical |
| `batch_update_tools.ps1` | Batch updated tool files | Historical |
| `update_tools_supabase.js` | Updated tool data in Supabase | Historical |
| `update-tools-supabase.sh` | Shell version of above | Historical |
| `LAUNCH-WOOP.bat` | Windows batch file to launch WOOP locally | Historical |

## Note

Historical scripts are kept for reference — they show how batch operations were done and can be adapted if similar fixes are needed in the future. Do not run them without reading the code first.
