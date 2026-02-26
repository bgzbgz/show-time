#!/usr/bin/env python3
"""
Fast Track Tools — JSX Crash Scanner
=====================================
Scans all 30 tool HTML files for JSX patterns that cause Babel parse errors
or silent render failures.

ROOT CAUSES (introduced by design-normalize.py JSX conversions):

  CRASH-1: Arrow function implicit return with leading JSX comment
  ---------------------------------------------------------------
  Pattern:
      const X = ({ children }) => (
          {/* TODO: add field condition */}
      <div className="ft-reveal-science">
  Why it crashes: `{/* comment */}` is a JSX expression. When placed as the
  FIRST thing in `=> ( ... )`, Babel sees TWO sibling expressions (comment + div)
  at the top level of the implicit return, which is invalid JSX.

  CRASH-2: Empty JSX conditional block
  ------------------------------------
  Pattern:
      {condition && (

      )}
  Why it crashes: `&& ()` with empty parens is a Babel syntax error.
  An empty pair of parentheses is not a valid JSX expression.

  WARN-1: Unconditional ft-reveal boxes (always visible)
  ------------------------------------------------------
  Pattern: <div className="ft-reveal..."> NOT wrapped in {condition && ...}
  Insight/science boxes should only appear after the user has typed an answer
  (>= 20 chars). These render fine but violate the design pattern.

  WARN-2: TODO field condition comment (unconverted)
  --------------------------------------------------
  Pattern: {/* TODO: add field condition */}
  Left over from normalize script when no nearby data field was found.
  These are valid JSX comments but indicate the reveal isn't properly gated.

USAGE
------
  python docs/design-jsx-scan.py              # Full report
  python docs/design-jsx-scan.py --fail-only  # Only tools with issues
  python docs/design-jsx-scan.py --crashes    # Only hard crashes
"""

import re
import sys
from pathlib import Path

FAIL_ONLY   = "--fail-only" in sys.argv
CRASHES_ONLY = "--crashes"  in sys.argv

REPO_ROOT = Path(__file__).parent.parent
TOOLS_DIR = REPO_ROOT / "frontend" / "tools"

GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

# ── Crash patterns ─────────────────────────────────────────────────────────────

# CRASH-1: Arrow fn implicit return immediately followed by {/* TODO... */}
# Matches: => (\n<whitespace>{/* TODO: add field condition */}
RE_CRASH_ARROW = re.compile(
    r'=>\s*\(\s*\n[ \t]*\{/\* TODO: add field condition \*/',
    re.MULTILINE
)

# CRASH-2: Empty JSX conditional: condition && (\n\n)
# Matches: && (\n<optional whitespace>\n<optional whitespace>)
RE_CRASH_EMPTY = re.compile(
    r'&&\s*\(\s*\n[ \t]*\n[ \t]*\)',
    re.MULTILINE
)

# ── Warning patterns ────────────────────────────────────────────────────────────

# WARN-1: ft-reveal div NOT preceded by a {condition && } wrapper
# Look for lines with ft-reveal-science or ft-reveal class that are NOT
# on a JSX conditional line and NOT inside an && expression
RE_REVEAL_DIV = re.compile(
    r'<div\s+className="ft-reveal(?:-science)?"'
)
RE_CONDITIONAL_WRAP = re.compile(
    r'\{[^{}]+&&\s*\('
)

# WARN-2: Any remaining TODO: add field condition comment
RE_TODO_COMMENT = re.compile(
    r'\{/\* TODO: add field condition \*/'
)

# ── Helpers ─────────────────────────────────────────────────────────────────────

def line_number(src: str, pos: int) -> int:
    return src[:pos].count('\n') + 1

def context_lines(src: str, pos: int, before=2, after=2) -> str:
    lines = src.splitlines()
    lineno = line_number(src, pos)
    start = max(0, lineno - before - 1)
    end   = min(len(lines), lineno + after)
    result = []
    for i in range(start, end):
        marker = ">>>" if i == lineno - 1 else "   "
        result.append(f"    {marker} {i+1}: {lines[i]}")
    return "\n".join(result)

def scan_tool(path: Path) -> dict:
    src = path.read_text(encoding="utf-8", errors="replace")
    issues = {"crashes": [], "warnings": []}

    # CRASH-1: arrow function comment
    for m in RE_CRASH_ARROW.finditer(src):
        ln = line_number(src, m.start())
        issues["crashes"].append({
            "type": "CRASH-1",
            "label": "Arrow fn implicit return with JSX comment",
            "line": ln,
            "fix": "Remove the {/* TODO: add field condition */} line",
            "context": context_lines(src, m.start()),
        })

    # CRASH-2: empty JSX conditional
    for m in RE_CRASH_EMPTY.finditer(src):
        ln = line_number(src, m.start())
        issues["crashes"].append({
            "type": "CRASH-2",
            "label": "Empty JSX conditional block {cond && ()}",
            "line": ln,
            "fix": "Remove the empty && () block entirely",
            "context": context_lines(src, m.start()),
        })

    if not CRASHES_ONLY:
        # WARN-2: TODO comments (not necessarily crashing, but indicate incomplete gating)
        for m in RE_TODO_COMMENT.finditer(src):
            # Skip if it's inside a definition comment or arrow fn context (already caught as CRASH-1)
            ln = line_number(src, m.start())
            already_crash = any(c["line"] == ln for c in issues["crashes"])
            if not already_crash:
                issues["warnings"].append({
                    "type": "WARN-2",
                    "label": "ft-reveal not gated on answer length",
                    "line": ln,
                    "fix": "Replace {/* TODO */} + <div ft-reveal> with {(data.field||'').length>=20 && <div ft-reveal>}",
                    "context": context_lines(src, m.start()),
                })

    return issues

# ── Report ───────────────────────────────────────────────────────────────────────

def main():
    tool_files = sorted(TOOLS_DIR.rglob("*.html"))
    tool_files = [f for f in tool_files if f.name != "TOOL-BLUEPRINT.html"]

    print(f"\n{BOLD}{'='*65}")
    print("  Fast Track Tools — JSX Crash Scanner")
    print(f"  Scanning {len(tool_files)} tool files")
    print(f"{'='*65}{RESET}\n")

    total_crashes = 0
    total_warns   = 0
    crash_files   = []
    warn_files    = []

    for path in tool_files:
        issues = scan_tool(path)
        crashes = issues["crashes"]
        warnings = issues["warnings"]

        total_crashes += len(crashes)
        total_warns   += len(warnings)

        if not crashes and not warnings:
            if not FAIL_ONLY and not CRASHES_ONLY:
                print(f"  {GREEN}CLEAN{RESET}  {path.name}")
            continue

        if CRASHES_ONLY and not crashes:
            continue

        if crashes:
            crash_files.append(path.name)
            status = f"{RED}{BOLD}CRASH{RESET}"
        else:
            warn_files.append(path.name)
            status = f"{YELLOW}WARN{RESET} "

        print(f"\n  {status}  {BOLD}{path.name}{RESET}")

        for c in crashes:
            print(f"\n    {RED}[{c['type']}]{RESET} {c['label']}  (line {c['line']})")
            print(f"    Fix: {c['fix']}")
            print(c["context"])

        for w in warnings:
            if not CRASHES_ONLY:
                print(f"\n    {YELLOW}[{w['type']}]{RESET} {w['label']}  (line {w['line']})")
                print(f"    Fix: {w['fix']}")

    print(f"\n{'='*65}")
    print(f"  SUMMARY")
    print(f"  Hard crashes:  {RED}{total_crashes}{RESET}  (tools won't load at all)")
    print(f"  Warnings:      {YELLOW}{total_warns}{RESET}  (tools load but ft-reveal not gated)")
    print(f"{'='*65}")

    if total_crashes:
        print(f"\n  {RED}{BOLD}Crashing files: {', '.join(crash_files)}{RESET}")
        print(f"\n  Run: python docs/design-jsx-fix.py --apply  to auto-fix all crashes\n")
    else:
        print(f"\n  {GREEN}{BOLD}No crash-causing JSX patterns found.{RESET}\n")

if __name__ == "__main__":
    main()
