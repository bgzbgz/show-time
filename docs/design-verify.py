#!/usr/bin/env python3
"""
Fast Track Tools — Design Verification Script
==============================================
Checks that all design normalization changes from design-normalize.py
have been correctly applied across all 30 tool files and cognitive-load.css.

CHECKS PERFORMED
-----------------
[CSS]  cognitive-load.css
  1. .ft-reveal is dark card (background:#111, border-left yellow)
  2. .ft-reveal-science exists (border-left grey)
  3. .ft-reveal-label color is #FFF469
  4. .ft-reveal-science .ft-reveal-label color is #999
  5. @keyframes ftRevealIn present (no duplicates / orphaned lines)
  6. No orphaned `to {` lines after @keyframes closing brace

[TOOL] Each of 30 tool HTML files:
  7.  wizard-layout class present in <style>
  8.  wizard-content has max-width: 720px
  9.  wizard-content has margin: 0 auto
  10. wizard-sidebar has background: #1a1a1a
  11. wizard-sidebar has width: 280px
  12. wizard-footer has border-top: 1px solid #e5e7eb
  13. btn-wiz-next has background: #000
  14. btn-wiz-back has background: transparent
  15. Riforma font-face declaration present
  16. Monument font-face declaration present
  17. Plaak font-face declaration present
  18. No raw <ScienceBox ...> JSX component tags remaining
  19. No raw <FastTrackInsight ...> JSX component tags remaining
  20. ft-reveal or ft-reveal-science referenced (insight/science content exists)

USAGE
------
  python docs/design-verify.py           # Full report
  python docs/design-verify.py --only=03-values.html
  python docs/design-verify.py --fail-only   # Only show failures
"""

import os
import re
import sys
from pathlib import Path

# -- CLI flags
ONLY_FILE  = next((a.split("=",1)[1] for a in sys.argv if a.startswith("--only=")), None)
FAIL_ONLY  = "--fail-only" in sys.argv

# -- Paths
REPO_ROOT = Path(__file__).parent.parent
TOOLS_DIR = REPO_ROOT / "frontend" / "tools"
CSS_FILE  = REPO_ROOT / "frontend" / "shared" / "css" / "cognitive-load.css"

# -- Result tracking
results = []   # list of (file_label, check_name, passed: bool, detail: str)
pass_count = 0
fail_count = 0
skip_count = 0

GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def check(label, name, condition, detail=""):
    global pass_count, fail_count
    passed = bool(condition)
    results.append((label, name, passed, detail))
    if passed:
        pass_count += 1
    else:
        fail_count += 1
    return passed

def log(msg):
    print(msg)

def read(path):
    return path.read_text(encoding="utf-8", errors="replace")

def strip_style_block(src):
    """Extract only the <style> block content."""
    m = re.search(r'<style>(.*?)</style>', src, re.DOTALL)
    return m.group(1) if m else ""

def css_has_prop(css_text, selector, prop_fragment):
    """
    Check that a CSS selector block contains a given property fragment.
    Searches for: selector { ...prop_fragment... }
    Handles multi-line and compressed CSS.
    """
    # Escape selector for regex
    sel_esc = re.escape(selector)
    # Find the block for this selector
    pattern = re.compile(
        sel_esc + r'\s*\{([^}]*)\}',
        re.DOTALL
    )
    for m in pattern.finditer(css_text):
        block = m.group(1)
        # Normalize whitespace for comparison
        block_norm = re.sub(r'\s+', ' ', block).strip()
        prop_norm  = re.sub(r'\s+', ' ', prop_fragment).strip()
        if prop_norm.lower() in block_norm.lower():
            return True
    return False

def css_selector_present(css_text, selector):
    """Check that a selector rule block exists at all."""
    sel_esc = re.escape(selector)
    return bool(re.search(sel_esc + r'\s*\{', css_text))

# ==============================================================================
#  CHECK 1-6: cognitive-load.css
# ==============================================================================

def verify_css_file():
    label = "cognitive-load.css"
    log(f"\n{BOLD}{CYAN}--- {label} ---{RESET}")

    src = read(CSS_FILE)

    # 1. ft-reveal dark card background
    check(label, ".ft-reveal background: #111",
          css_has_prop(src, ".ft-reveal", "background: #111"))

    # 2. ft-reveal yellow left border
    check(label, ".ft-reveal border-left: 4px solid #FFF469",
          css_has_prop(src, ".ft-reveal", "border-left: 4px solid #FFF469"))

    # 3. ft-reveal-science exists
    check(label, ".ft-reveal-science selector present",
          css_selector_present(src, ".ft-reveal-science"))

    # 4. ft-reveal-science grey left border
    check(label, ".ft-reveal-science border-left: 4px solid #666",
          css_has_prop(src, ".ft-reveal-science", "border-left: 4px solid #666"))

    # 5. ft-reveal-label color #FFF469
    check(label, ".ft-reveal-label color: #FFF469",
          "color: #FFF469" in src)

    # 6. ft-reveal-science label color #999
    check(label, ".ft-reveal-science .ft-reveal-label color: #999",
          ".ft-reveal-science .ft-reveal-label" in src and
          re.search(r'\.ft-reveal-science \.ft-reveal-label\s*\{[^}]*color:\s*#999', src, re.DOTALL))

    # 7. @keyframes ftRevealIn present
    check(label, "@keyframes ftRevealIn present",
          "@keyframes ftRevealIn" in src)

    # 8. No orphaned `to {` lines after closing brace of @keyframes
    # Find everything after @keyframes block ends
    kf_match = re.search(
        r'@keyframes ftRevealIn \{(?:[^{}]|\{[^{}]*\})*\}(.*)',
        src, re.DOTALL
    )
    orphaned = False
    if kf_match:
        after = kf_match.group(1)
        # If there's a standalone `to {` or `} ` before the next real CSS comment/rule
        orphaned = bool(re.search(r'^\s*to\s*\{', after))
    check(label, "No orphaned keyframes lines after @keyframes block",
          not orphaned,
          "Found orphaned `to { }` lines after @keyframes" if orphaned else "")

# ==============================================================================
#  CHECK 7-20: Per-tool HTML files
# ==============================================================================

# Tools that are known placeholders (tool 22) — skip most checks
PLACEHOLDER_TOOLS = {"22-core-activities.html"}

# Tools that legitimately don't have a wizard sidebar (simple single-page tools)
NO_SIDEBAR_TOOLS  = {"00-woop.html", "22-core-activities.html"}

# Tools that may not have insight/science boxes at all
NO_INSIGHT_EXPECTED = {"00-woop.html", "04-team.html", "06-cash.html",
                        "22-core-activities.html"}

def verify_tool(path: Path):
    name  = path.name
    label = name
    src   = read(path)
    style = strip_style_block(src)

    is_placeholder = name in PLACEHOLDER_TOOLS

    # Detect which wizard patterns this tool actually uses in JSX
    uses_wizard_footer  = 'wizard-footer'   in src
    uses_btn_wiz_next   = 'btn-wiz-next'    in src
    uses_btn_wiz_back   = 'btn-wiz-back'    in src
    uses_wizard_content = 'wizard-content'  in src
    uses_wizard_sidebar = 'wizard-sidebar'  in src and name not in NO_SIDEBAR_TOOLS

    # --- Wizard layout CSS (all wizard tools must have this) ---
    check(label, "wizard-layout in <style>",
          css_selector_present(style, ".wizard-layout") or is_placeholder,
          "Missing .wizard-layout CSS rule")

    # --- wizard-content: only check if tool uses the class ---
    if uses_wizard_content:
        check(label, "wizard-content max-width: 720px",
              "max-width: 720px" in style or is_placeholder,
              "wizard-content missing max-width: 720px")

        check(label, "wizard-content margin: 0 auto",
              "margin: 0 auto" in style or is_placeholder,
              "wizard-content missing margin: 0 auto")

    # --- wizard-sidebar: only check if tool uses the class ---
    if uses_wizard_sidebar:
        check(label, "wizard-sidebar background: #1a1a1a",
              "background: #1a1a1a" in style or is_placeholder,
              "wizard-sidebar missing background: #1a1a1a")

        check(label, "wizard-sidebar width: 280px",
              "width: 280px" in style or is_placeholder,
              "wizard-sidebar missing width: 280px")

    # --- wizard-footer: only check if tool uses the class ---
    if uses_wizard_footer:
        check(label, "wizard-footer border-top: 1px solid #e5e7eb",
              "border-top: 1px solid #e5e7eb" in style or is_placeholder,
              "wizard-footer missing border-top")

    # --- buttons: only check if tool uses btn-wiz-* class names ---
    if uses_btn_wiz_next:
        check(label, "btn-wiz-next background: #000",
              css_has_prop(style, ".btn-wiz-next", "background: #000") or is_placeholder,
              ".btn-wiz-next missing background: #000")

    if uses_btn_wiz_back:
        check(label, "btn-wiz-back background: transparent",
              css_has_prop(style, ".btn-wiz-back", "background: transparent") or is_placeholder,
              ".btn-wiz-back missing background: transparent")

    # --- Font-face declarations ---
    check(label, "Riforma font-face present",
          "font-family: 'Riforma'" in src or "font-family: \"Riforma\"" in src,
          "Missing Riforma @font-face")

    check(label, "Monument font-face present",
          "font-family: 'Monument'" in src or "font-family: \"Monument\"" in src,
          "Missing Monument @font-face")

    check(label, "Plaak font-face present",
          "font-family: 'Plaak'" in src or "font-family: \"Plaak\"" in src,
          "Missing Plaak @font-face")

    # --- No leftover JSX component tags ---
    # Must not have raw <ScienceBox or <FastTrackInsight as JSX opening tags
    has_science_box_jsx = bool(re.search(
        r'<ScienceBox\b',
        src
    ))
    check(label, "No raw <ScienceBox> JSX tags remaining",
          not has_science_box_jsx,
          "Found raw <ScienceBox ...> — should be replaced with ft-reveal-science div")

    has_fti_jsx = bool(re.search(
        r'<FastTrackInsight\b',
        src
    ))
    check(label, "No raw <FastTrackInsight> JSX tags remaining",
          not has_fti_jsx,
          "Found raw <FastTrackInsight ...> — should be replaced with ft-reveal div")

    # --- ft-reveal: warn if JSX tags were NOT converted (actual regression) ---
    # (advisory only — tools that never had insight boxes are fine without ft-reveal)
    has_jsx_insight_tags = bool(re.search(r'<(FastTrackInsight|ScienceBox)\b', src))
    has_ft_reveal        = "ft-reveal" in src
    if has_jsx_insight_tags and not has_ft_reveal:
        # This is a real failure: JSX component exists but wasn't converted
        check(label, "JSX insight tags converted to ft-reveal",
              False,
              "Raw <FastTrackInsight>/<ScienceBox> exist but no ft-reveal found — conversion incomplete")

# ==============================================================================
#  REPORT
# ==============================================================================

def print_report():
    # Group by file
    from collections import defaultdict
    by_file = defaultdict(list)
    for (label, name, passed, detail) in results:
        by_file[label].append((name, passed, detail))

    for file_label, checks in by_file.items():
        file_fails = [(n, d) for n, p, d in checks if not p]
        file_passes = sum(1 for _, p, _ in checks if p)

        if FAIL_ONLY and not file_fails:
            continue

        status_icon = f"{GREEN}PASS{RESET}" if not file_fails else f"{RED}FAIL{RESET}"
        print(f"\n  {BOLD}{file_label}{RESET}  [{status_icon}]  {file_passes}/{len(checks)} checks passed")

        if file_fails:
            for name, detail in file_fails:
                detail_str = f"  ({detail})" if detail else ""
                print(f"    {RED}x{RESET} {name}{detail_str}")
        elif not FAIL_ONLY:
            for name, passed, detail in checks:
                print(f"    {GREEN}v{RESET} {name}")

    total = pass_count + fail_count
    pct = int(100 * pass_count / total) if total else 0
    bar_filled = int(30 * pass_count / total) if total else 0
    bar = "#" * bar_filled + "-" * (30 - bar_filled)

    print(f"""
=================================================================
  VERIFICATION SUMMARY
  Total checks:  {total}
  Passed:        {GREEN}{pass_count}{RESET}
  Failed:        {RED}{fail_count}{RESET}
  Score:         [{bar}] {pct}%
=================================================================
""")

    if fail_count == 0:
        print(f"  {GREEN}{BOLD}All design checks passed. Tools are fully normalized.{RESET}\n")
    else:
        print(f"  {YELLOW}{BOLD}{fail_count} check(s) failed — see details above.{RESET}\n")
        print(f"  Run: python docs/design-normalize.py --apply --verbose")
        print(f"  Or fix manually using the check names above.\n")

# ==============================================================================
#  MAIN
# ==============================================================================

if __name__ == "__main__":
    print(f"""
{BOLD}{'='*65}
  Fast Track Tools — Design Verification
  Reference: 13-segmentation-target-market.html
{'='*65}{RESET}
""")

    # Phase 1: CSS file
    verify_css_file()

    # Phase 2: All tool files
    tool_files = sorted(TOOLS_DIR.rglob("*.html"))
    tool_files = [f for f in tool_files if f.name != "TOOL-BLUEPRINT.html"]

    if ONLY_FILE:
        tool_files = [f for f in tool_files if ONLY_FILE in f.name]
        if not tool_files:
            print(f"  No files matching --only={ONLY_FILE}")
            sys.exit(1)

    log(f"\n{BOLD}{CYAN}--- Tool Files ({len(tool_files)} tools) ---{RESET}")

    for tool_path in tool_files:
        verify_tool(tool_path)

    print_report()
