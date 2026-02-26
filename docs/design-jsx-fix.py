#!/usr/bin/env python3
"""
Fast Track Tools — JSX Crash Fixer
====================================
Auto-fixes JSX patterns that cause Babel parse errors across all tool files.

FIXES APPLIED
--------------

FIX-1: Arrow function implicit return with leading JSX comment
  Before:
      const TheScience = ({ children }) => (
          {/* TODO: add field condition */}
      <div className="ft-reveal-science">
          ...
      </div>
      );
  After:
      const TheScience = ({ children }) => (
      <div className="ft-reveal-science">
          ...
      </div>
      );
  (Removes the orphaned JSX comment — the ft-reveal div is still rendered,
   just without the invalid comment before it)

FIX-2: Empty JSX conditional block
  Before:
      {condition && (

      )}
  After:
      (removed entirely)
  (These empty blocks serve no purpose and crash Babel)

SAFETY
-------
  - Dry-run by default — pass --apply to write changes
  - .bak backups created unless --no-backup
  - Only the crash-causing lines are removed — no other logic touched
  - Each fix is reported with before/after line context

USAGE
------
  python docs/design-jsx-fix.py                  # Dry-run
  python docs/design-jsx-fix.py --apply          # Apply fixes
  python docs/design-jsx-fix.py --apply --only=04-team.html
  python docs/design-jsx-fix.py --apply --no-backup
"""

import re
import sys
import shutil
from pathlib import Path
from datetime import datetime

APPLY     = "--apply"     in sys.argv
NO_BACKUP = "--no-backup" in sys.argv
ONLY_FILE = next((a.split("=",1)[1] for a in sys.argv if a.startswith("--only=")), None)

REPO_ROOT = Path(__file__).parent.parent
TOOLS_DIR = REPO_ROOT / "frontend" / "tools"

GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

stats = {"files_fixed": 0, "crash1_fixed": 0, "crash2_fixed": 0}

# ── Fix patterns ────────────────────────────────────────────────────────────────

# FIX-1: Remove {/* TODO: add field condition */} line when it's inside
# an arrow function implicit return (immediately after `=>  (` ).
# Matches the whole line containing the comment (including newline).
RE_FIX1 = re.compile(
    r'(=>\s*\(\s*\n)([ \t]*\{/\* TODO: add field condition \*/\}\s*\n)',
    re.MULTILINE
)

# FIX-2: Remove empty JSX conditional blocks: {condition && (\n\n)}
# Captures the entire block so it can be deleted.
# Pattern: {<expr> && (\n<whitespace>\n<whitespace>)}
RE_FIX2 = re.compile(
    r'\{[^\n{}]+&&\s*\(\s*\n[ \t]*\n[ \t]*\)\}[ \t]*\n',
    re.MULTILINE
)

def line_number(src: str, pos: int) -> int:
    return src[:pos].count('\n') + 1

def apply_fix1(src: str) -> tuple[str, int]:
    """Remove orphaned {/* TODO: add field condition */} after => ("""
    count = 0
    def replacer(m):
        nonlocal count
        count += 1
        # Keep the `=> (\n` part, remove the comment line
        return m.group(1)
    new_src = RE_FIX1.sub(replacer, src)
    return new_src, count

def apply_fix2(src: str) -> tuple[str, int]:
    """Remove empty {condition && ()} blocks"""
    count = 0
    def replacer(m):
        nonlocal count
        count += 1
        return ""  # Remove the whole block
    new_src = RE_FIX2.sub(replacer, src)
    return new_src, count

def process_tool(path: Path) -> bool:
    """Returns True if changes were made."""
    src = path.read_text(encoding="utf-8", errors="replace")
    original = src
    changes = []

    # Apply FIX-1
    src, n1 = apply_fix1(src)
    if n1:
        changes.append(f"FIX-1: Removed {n1} orphaned JSX comment(s) from arrow fn returns")
        stats["crash1_fixed"] += n1

    # Apply FIX-2
    src, n2 = apply_fix2(src)
    if n2:
        changes.append(f"FIX-2: Removed {n2} empty JSX conditional block(s)")
        stats["crash2_fixed"] += n2

    if not changes:
        return False

    # Report
    tag = f"{GREEN}[FIXED]{RESET}" if APPLY else f"{YELLOW}[DRY]{RESET}"
    print(f"\n  {tag} {BOLD}{path.name}{RESET}")
    for c in changes:
        print(f"    • {c}")

    if APPLY:
        if not NO_BACKUP:
            shutil.copy(path, path.with_suffix(".html.bak"))
        path.write_text(src, encoding="utf-8")
        stats["files_fixed"] += 1

    return True

def main():
    tool_files = sorted(TOOLS_DIR.rglob("*.html"))
    tool_files = [f for f in tool_files if f.name != "TOOL-BLUEPRINT.html"]

    if ONLY_FILE:
        tool_files = [f for f in tool_files if ONLY_FILE in f.name]
        if not tool_files:
            print(f"  No files matching --only={ONLY_FILE}")
            sys.exit(1)

    mode = "APPLY" if APPLY else "DRY-RUN"
    print(f"\n{BOLD}{'='*65}")
    print(f"  Fast Track Tools — JSX Crash Fixer  [{mode}]")
    print(f"  Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*65}{RESET}")

    if not APPLY:
        print(f"\n  {YELLOW}Dry-run mode — pass --apply to write changes{RESET}")

    any_changed = False
    for path in tool_files:
        changed = process_tool(path)
        if changed:
            any_changed = True

    print(f"\n{'='*65}")
    print(f"  SUMMARY")
    if APPLY:
        print(f"  Files fixed:        {stats['files_fixed']}")
        print(f"  Arrow-comment fixes:{stats['crash1_fixed']}")
        print(f"  Empty-block fixes:  {stats['crash2_fixed']}")
    else:
        if any_changed:
            print(f"  Changes pending — run with --apply to fix")
        else:
            print(f"  {GREEN}No crash patterns found — all tools clean{RESET}")
    print(f"{'='*65}\n")

if __name__ == "__main__":
    main()
