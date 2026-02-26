"""
Fast Track Tools — Design Consistency Audit Script
====================================================
Reads every tool HTML file and checks for design inconsistencies
across colors, wizard layout, typography, components, and patterns.

Run from the repo root:
    python docs/design-audit.py

Output: docs/DESIGN-AUDIT-REPORT.md
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime

# ── Config ──────────────────────────────────────────────────────────────────
TOOLS_DIR   = Path(__file__).parent.parent / "frontend" / "tools"
REPORT_PATH = Path(__file__).parent / "DESIGN-AUDIT-REPORT.md"

BRAND_COLORS = {
    "#000000", "#000",
    "#ffffff", "#fff",
    "#fff469",          # yellow accent
    "#b2b2b2",          # grey
    "#1a1a1a",          # dark surface
    "#0a0a0a",          # darker surface
    "#f5f5f5",          # light bg
    "#e5e7eb",          # divider (ft-reveal)
    "#f0fdf4", "#86efac",  # success green
    "#fef2f2", "#dc2626",  # AI error red
    "#ef4444",          # cl-red
    "#22c55e",          # cl-green
}

# Colors that are clearly off-brand (not in the design system)
OFF_BRAND_COLORS = re.compile(
    r'(?:background|color|border[^:]*|fill|stroke)\s*:\s*'
    r'(#(?!000000|000(?:[^0-9a-f]|$)|ffffff|fff(?:[^0-9a-f]|$)|fff469|b2b2b2|1a1a1a|0a0a0a|f5f5f5|e5e7eb|f0fdf4|86efac|fef2f2|dc2626|ef4444|22c55e)'
    r'[0-9a-f]{3,6})',
    re.IGNORECASE
)

REQUIRED_FONTS   = ["Plaak", "Riforma", "Monument"]
WIZARD_CLASSES   = ["wizard-layout", "wizard-sidebar", "wizard-main", "wizard-content", "wizard-footer"]
REQUIRED_SCRIPTS = ["tool-db.js", "ai-challenge.js", "cognitive-load.css"]

# ── Helpers ──────────────────────────────────────────────────────────────────

def read_file(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return ""

def find_all_tools() -> list[Path]:
    return sorted(TOOLS_DIR.rglob("*.html"))

def tool_label(path: Path) -> str:
    return f"{path.parent.name}/{path.name}"

# ── Individual checks ────────────────────────────────────────────────────────

def check_wizard_layout(src: str) -> list[str]:
    issues = []
    for cls in WIZARD_CLASSES:
        if cls not in src:
            issues.append(f"Missing CSS class `{cls}`")
    if "WizardSidebar" not in src and "wizard-sidebar" not in src:
        issues.append("WizardSidebar component not found")
    if "ButtonFooter" not in src and "wizard-footer" not in src:
        issues.append("ButtonFooter / wizard-footer not found")
    return issues

def check_cover_screen(src: str) -> list[str]:
    issues = []
    # Cover should have a dark (black) background
    has_cover = "step === 0" in src or "cover" in src.lower()
    if has_cover:
        # Check cover has a start/launch button
        if not re.search(r"(START|LAUNCH|BEGIN|LET'S START)", src, re.IGNORECASE):
            issues.append("Cover screen may be missing a START/LAUNCH button")
    # Yellow tool badge should be gone
    if re.search(r"color.*#FFF469.*TOOL\s+\d+", src, re.IGNORECASE):
        issues.append("Yellow 'TOOL XX' badge still present on cover (should be removed)")
    if "INDIVIDUAL + TEAM TOOL" in src or "INDIVIDUAL TOOL" in src:
        issues.append("'INDIVIDUAL + TEAM TOOL' badge still present on cover")
    return issues

def check_colors(src: str) -> list[str]:
    issues = []
    # Find hex colors in inline styles
    all_hex = re.findall(r'(?:background|color|border[^-])[^;]*?:\s*(#[0-9a-fA-F]{3,8})', src)
    off_brand = set()
    for h in all_hex:
        normalized = h.lower().strip()
        # Ignore 8-digit hex (rgba hex) for now
        if len(normalized) > 7:
            continue
        if normalized not in BRAND_COLORS:
            off_brand.add(normalized)
    # Filter out near-black/white variants that are acceptable
    acceptable_extras = {
        "#111", "#222", "#333", "#444", "#555", "#666", "#777", "#888", "#999",
        "#aaa", "#bbb", "#ccc", "#ddd", "#eee",
        "#111111", "#222222", "#333333", "#444444", "#555555",
        "#666666", "#777777", "#888888", "#999999",
        "#1f1f1f", "#2a2a2a", "#3a3a3a", "#4a4a4a",
        "#f9f9f9", "#f0f0f0", "#e0e0e0", "#d0d0d0",
        "#060606", "#080808", "#0e0e0e", "#141414",
    }
    real_issues = off_brand - acceptable_extras
    if real_issues:
        issues.append(f"Possible off-brand colors in inline styles: {', '.join(sorted(real_issues))}")
    return issues

def check_typography(src: str) -> list[str]:
    issues = []
    for font in REQUIRED_FONTS:
        if font not in src:
            issues.append(f"Font '{font}' not referenced")
    # Check for naked Arial/sans-serif without brand font
    if re.search(r"fontFamily.*?Arial(?!.*Plaak|.*Riforma|.*Monument)", src):
        issues.append("Arial used without brand font stack fallback")
    return issues

def check_ai_layer(src: str) -> list[str]:
    issues = []
    if "ai-challenge.js" not in src:
        issues.append("ai-challenge.js script not included")
        return issues
    if "AIChallenge" not in src and "reviewStep" not in src:
        issues.append("AIChallenge.reviewStep() never called — AI layer likely inactive")
    if "aiReviewing" not in src:
        issues.append("No `aiReviewing` state — button won't show 'Reviewing...' during AI call")
    if "aiMessage" not in src:
        issues.append("No `aiMessage` state — user won't see feedback when AI blocks progress")
    if "Reviewing" not in src:
        issues.append("Next button doesn't appear to show 'Reviewing...' label during AI check")
    return issues

def check_tool_db(src: str) -> list[str]:
    issues = []
    if "tool-db.js" not in src:
        issues.append("tool-db.js not included — tool can't save to Supabase")
        return issues
    if "ToolDB" not in src:
        issues.append("ToolDB never referenced — responses may not be saved")
    if "saveResponses" not in src and "ToolDB.save" not in src:
        issues.append("ToolDB.save/saveResponses never called — final submit may not work")
    return issues

def check_submit_flow(src: str) -> list[str]:
    issues = []
    # AI gate before final submit should be removed
    if "submitWithChallenge" in src:
        issues.append("AIChallenge.submitWithChallenge() still used — AI gate before final submit (should be direct save)")
    # Submit button should say "Submit Answers"
    if re.search(r"Submit to Fast Track|Share with Team", src, re.IGNORECASE):
        issues.append("Submit button text is 'Submit to Fast Track' or 'Share with Team' — should be 'Submit Answers'")
    # Success message should be styled (not an alert)
    if "alert(" in src and ("success" in src.lower() or "submit" in src.lower()):
        issues.append("alert() used for submit success — should use styled success panel")
    return issues

def check_insight_boxes(src: str) -> list[str]:
    issues = []
    # Old always-visible insight/science boxes
    if re.search(r"<FastTrackInsight(?!\s*.*length\s*>=)", src):
        issues.append("FastTrackInsight component used — should be replaced with ft-reveal pattern")
    if re.search(r"ScienceBox\s+collapsible=\{false\}", src):
        issues.append("ScienceBox with collapsible=false — always visible, should use ft-reveal")
    # Check ft-reveal is used (positive signal)
    if "ft-reveal" not in src and ("insight" in src.lower() or "science" in src.lower()):
        issues.append("No ft-reveal pattern found despite insight/science content — boxes may show before user types")
    return issues

def check_team_unlock(src: str) -> list[str]:
    issues = []
    if "teamToolUnlocked" in src:
        # Check that it's initialized to true
        if re.search(r"teamToolUnlocked.*useState\(false\)", src):
            issues.append("teamToolUnlocked initialized to false — team phase is locked by default (should be true)")
    if "WAITING FOR TEAM" in src or "waitingForTeam" in src:
        issues.append("'WAITING FOR TEAM' gate still present — team phase should be unlocked for everyone")
    return issues

def check_clear_data_link(src: str) -> list[str]:
    issues = []
    if re.search(r"Clear Saved Data|clearData|clear.*data.*onClick|onClick.*clear.*data", src, re.IGNORECASE):
        # Check it's on cover (step 0)
        if "Clear Saved Data" in src:
            issues.append("'Clear Saved Data' link still visible to user (should be removed from cover)")
    return issues

def check_question_marks(src: str) -> list[str]:
    issues = []
    if "help-bubble" in src or "help-btn" in src or "HelpButton" in src or "HelpModal" in src:
        issues.append("Help bubble / ? button component still present (should be removed)")
    return issues

def check_dependency_context(src: str) -> list[str]:
    issues = []
    if "DependencyContext" in src or "dependency-injection.js" in src:
        # Check it's collapsed by default
        if re.search(r"DependencyContext|dependency.*context", src, re.IGNORECASE):
            if re.search(r"useState\(true\).*expand|expand.*useState\(true\)", src, re.IGNORECASE):
                issues.append("DependencyContext expanded by default (should start collapsed)")
    return issues

def check_transition_screens(src: str) -> list[str]:
    issues = []
    # Old showTransition boolean pattern
    if re.search(r"showTransition.*useState|setShowTransition", src):
        issues.append("Old showTransition boolean pattern used — should use setStep(step + 0.5) half-step pattern")
    # setTimeout-based transitions
    if re.search(r"setTimeout.*setStep|setStep.*setTimeout", src):
        if "transition" in src.lower():
            issues.append("setTimeout used for transitions — should use half-step pattern with renderTransitionScreen()")
    return issues

def check_canvas_null_guards(src: str) -> list[str]:
    issues = []
    # Look for .map() calls on data fields without null guard
    unsafe = re.findall(r'data\.(\w+)\.(?:map|filter|forEach|reduce|find)\(', src)
    if unsafe:
        # Check if there's a || [] guard nearby
        for field in set(unsafe):
            pattern_safe   = rf'\(data\.{field}\s*\|\|\s*\[\]\)\.'
            pattern_option = rf'data\.{field}\?\.(?:map|filter)'
            if not re.search(pattern_safe, src) and not re.search(pattern_option, src):
                issues.append(f"data.{field}.map/filter/etc used without null guard (can crash Canvas)")
                if len(issues) >= 3:  # cap noise
                    issues.append("(more unsafe accesses truncated...)")
                    break
    return issues

def check_step_counter(src: str) -> list[str]:
    issues = []
    if "WizardSidebar" in src:
        # Steps should have a counter or progress indicator
        if "totalSteps" not in src and "step_count" not in src and "of " not in src:
            issues.append("No step counter or totalSteps found — user may not know progress")
    return issues

# ── Main audit ───────────────────────────────────────────────────────────────

CHECKS = [
    ("Wizard Layout",          check_wizard_layout),
    ("Cover Screen",           check_cover_screen),
    ("Colors",                 check_colors),
    ("Typography",             check_typography),
    ("AI Layer",               check_ai_layer),
    ("ToolDB / Save",          check_tool_db),
    ("Submit Flow",            check_submit_flow),
    ("Insight Boxes",          check_insight_boxes),
    ("Team Unlock",            check_team_unlock),
    ("Clear Data Link",        check_clear_data_link),
    ("Question Mark Bubbles",  check_question_marks),
    ("Dependency Context",     check_dependency_context),
    ("Transition Screens",     check_transition_screens),
    ("Canvas Null Guards",     check_canvas_null_guards),
    ("Step Counter",           check_step_counter),
]

def audit_tool(path: Path) -> dict:
    src = read_file(path)
    if not src:
        return {"path": path, "label": tool_label(path), "error": "Could not read file", "results": {}}

    results = {}
    for name, fn in CHECKS:
        try:
            issues = fn(src)
            results[name] = issues
        except Exception as e:
            results[name] = [f"Check error: {e}"]

    return {"path": path, "label": tool_label(path), "results": results}

def severity(issues: list[str]) -> str:
    if not issues:
        return "✅"
    critical_keywords = ["not included", "never called", "can't save", "crash", "still present", "broken"]
    for i in issues:
        if any(k in i.lower() for k in critical_keywords):
            return "🔴"
    return "🟡"

def run_audit():
    tools = find_all_tools()
    print(f"Auditing {len(tools)} tool files...")

    all_results = []
    for t in tools:
        print(f"  > {tool_label(t)}")
        all_results.append(audit_tool(t))

    # ── Build report ──
    lines = []
    lines.append("# Fast Track Tools — Design Audit Report")
    lines.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append(f"**Tools audited:** {len(tools)}")
    lines.append("")

    # Summary table
    lines.append("## Summary")
    lines.append("")
    lines.append("| Tool | " + " | ".join(name for name, _ in CHECKS) + " |")
    lines.append("|------|" + "|".join("---" for _ in CHECKS) + "|")

    for r in all_results:
        if "error" in r:
            lines.append(f"| {r['label']} | ERROR |")
            continue
        cells = []
        for name, _ in CHECKS:
            issues = r["results"].get(name, [])
            cells.append(severity(issues))
        lines.append(f"| `{r['label']}` | " + " | ".join(cells) + " |")

    lines.append("")
    lines.append("**Legend:** ✅ Clean &nbsp; 🟡 Warning &nbsp; 🔴 Critical")
    lines.append("")

    # Detail section — only tools with issues
    lines.append("---")
    lines.append("")
    lines.append("## Issues by Tool")
    lines.append("")

    for r in all_results:
        if "error" in r:
            continue
        tool_issues = {name: issues for name, issues in r["results"].items() if issues}
        if not tool_issues:
            continue

        lines.append(f"### `{r['label']}`")
        lines.append("")
        for check_name, issues in tool_issues.items():
            sev = "🔴" if severity(issues) == "🔴" else "🟡"
            lines.append(f"**{sev} {check_name}**")
            for issue in issues:
                lines.append(f"- {issue}")
        lines.append("")

    # Clean tools
    clean = [r for r in all_results if "error" not in r and not any(v for v in r["results"].values())]
    if clean:
        lines.append("---")
        lines.append("")
        lines.append("## ✅ Fully Clean Tools")
        lines.append("")
        for r in clean:
            lines.append(f"- `{r['label']}`")
        lines.append("")

    # Issues by category
    lines.append("---")
    lines.append("")
    lines.append("## Issues by Category")
    lines.append("")
    for check_name, _ in CHECKS:
        affected = [r["label"] for r in all_results if "error" not in r and r["results"].get(check_name)]
        if affected:
            total = sum(len(r["results"].get(check_name, [])) for r in all_results)
            lines.append(f"### {check_name} ({len(affected)} tools, {total} issues)")
            for label in affected:
                r = next(x for x in all_results if x["label"] == label)
                for issue in r["results"].get(check_name, []):
                    sev = "🔴" if severity([issue]) == "🔴" else "🟡"
                    lines.append(f"- {sev} `{label}` — {issue}")
            lines.append("")

    report = "\n".join(lines)
    REPORT_PATH.write_text(report, encoding="utf-8")
    print(f"\nReport written to: {REPORT_PATH}")

    # Print quick summary to console
    total_issues = sum(
        len(issue)
        for r in all_results if "error" not in r
        for issues in r["results"].values()
        for issue in issues
    )
    critical = sum(
        1
        for r in all_results if "error" not in r
        for issues in r["results"].values()
        for issue in issues
        if any(k in issue.lower() for k in ["not included", "never called", "can't save", "crash", "still present"])
    )
    print(f"\n{'='*60}")
    print(f"  Tools audited:  {len(tools)}")
    print(f"  Clean tools:    {len(clean)}")
    print(f"  Total issues:   {total_issues}")
    print(f"  Critical:       {critical}")
    print(f"{'='*60}")

if __name__ == "__main__":
    run_audit()
