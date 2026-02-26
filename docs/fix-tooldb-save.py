#!/usr/bin/env python3
"""
Fast Track Tools — ToolDB.saveResponses Fixer
===============================================

ROOT CAUSE
----------
tool-db.js exports:  ToolDB.save(userId, mappings)        ← correct 2-arg signature
Many tools call:     ToolDB.saveResponses(userId, slug, mappings)  ← WRONG name + 3 args

Result: "ToolDB.saveResponses is not a function" → submission fails silently.

WHAT THIS SCRIPT DOES
----------------------
1. Scans every tool HTML for ToolDB.saveResponses(...) calls
2. Extracts userId arg and mappings arg, drops the slug arg (already handled by ToolDB.init)
3. Rewrites to ToolDB.save(userId, mappings)
4. Validates that ToolDB.init() is present in each tool that calls ToolDB.save
5. Checks tool-db.js itself hasn't changed the API
6. Reports tools with NO save call at all (may need manual review)

USAGE
------
  python docs/fix-tooldb-save.py              # Dry-run (no changes)
  python docs/fix-tooldb-save.py --apply      # Write changes
  python docs/fix-tooldb-save.py --apply --no-backup
  python docs/fix-tooldb-save.py --only=01-know-thyself.html

SAFETY
-------
  - .bak backup created before each write (unless --no-backup)
  - Only the exact saveResponses(...) call is rewritten — nothing else touched
  - Dry-run by default
"""

import re
import sys
import shutil
from pathlib import Path
from datetime import datetime

# ── CLI flags ──────────────────────────────────────────────────────────────────
APPLY     = "--apply"     in sys.argv
NO_BACKUP = "--no-backup" in sys.argv
ONLY_FILE = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--only=")), None)

# ── Paths ──────────────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent
TOOLS_DIR = REPO_ROOT / "frontend" / "tools"
TOOLDB_JS = REPO_ROOT / "frontend" / "shared" / "js" / "tool-db.js"

# ── Colours ────────────────────────────────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

# ── Stats ──────────────────────────────────────────────────────────────────────
stats = {
    "files_fixed":   0,
    "calls_fixed":   0,
    "files_ok":      0,
    "files_no_save": 0,
    "files_no_init": 0,
}

# ── Pattern: ToolDB.saveResponses(arg1, arg2_slug, arg3_mappings) ──────────────
# Handles single-line calls.  Captures arg1 (userId) and arg3 (mappings var).
# arg2 (the slug string/var) is discarded — the slug is already registered
# via ToolDB.init(slug) at component mount time.
RE_SAVE_RESPONSES = re.compile(
    r'ToolDB\.saveResponses\('   # wrong function name
    r'([^,]+?)'                  # GROUP 1: userId expression (no commas)
    r'\s*,\s*'                   # separator
    r'(?:\'[^\']*\'|\"[^\"]*\"|[^,]+?)'  # slug arg — string literal or expression (dropped)
    r'\s*,\s*'                   # separator
    r'([^)]+?)'                  # GROUP 2: mappings expression (no closing paren)
    r'\)',
    re.MULTILINE
)

# ── Validation patterns ────────────────────────────────────────────────────────
RE_HAS_SAVE      = re.compile(r'ToolDB\.save\s*\(')
RE_HAS_INIT      = re.compile(r'ToolDB\.init\s*\(')
RE_SAVE_CORRECT  = re.compile(r'ToolDB\.save\s*\([^)]+\)')

# ── Verify tool-db.js API ─────────────────────────────────────────────────────
def verify_tooldb_api() -> bool:
    """Confirm tool-db.js exports 'save' (not 'saveResponses') and returns it."""
    if not TOOLDB_JS.exists():
        print(f"  {RED}ERROR: tool-db.js not found at {TOOLDB_JS}{RESET}")
        return False
    src = TOOLDB_JS.read_text(encoding="utf-8")
    if "saveResponses" in src:
        print(f"  {RED}WARNING: tool-db.js contains 'saveResponses' — unexpected!{RESET}")
    if "async function save(" not in src:
        print(f"  {RED}ERROR: tool-db.js does not define 'async function save(' — API may have changed!{RESET}")
        return False
    # Check that 'save' is in the return object
    return_match = re.search(r'return\s*\{([^}]+)\}', src, re.DOTALL)
    if return_match:
        exported = return_match.group(1)
        if 'save' not in exported:
            print(f"  {RED}ERROR: 'save' not found in ToolDB return object!{RESET}")
            return False
    print(f"  {GREEN}tool-db.js API verified: save(userId, mappings) ✓{RESET}")
    return True


# ── Per-file fix ───────────────────────────────────────────────────────────────
def fix_tool(path: Path) -> bool:
    """Returns True if changes were made (or would be in dry-run)."""
    src = path.read_text(encoding="utf-8", errors="replace")

    # Count saveResponses occurrences
    matches = list(RE_SAVE_RESPONSES.finditer(src))
    if not matches:
        # Check it already uses ToolDB.save correctly (or has no save at all)
        has_save = bool(RE_HAS_SAVE.search(src))
        has_init = bool(RE_HAS_INIT.search(src))
        if has_save:
            if not has_init:
                print(f"  {YELLOW}WARN  {RESET} {path.name}  — uses ToolDB.save but missing ToolDB.init()")
                stats["files_no_init"] += 1
            else:
                stats["files_ok"] += 1
        else:
            stats["files_no_save"] += 1
        return False

    # Build replacement
    new_src = src
    replacements = []
    for m in matches:
        user_id_arg = m.group(1).strip()
        mappings_arg = m.group(2).strip()
        old_call = m.group(0)
        new_call = f"ToolDB.save({user_id_arg}, {mappings_arg})"
        replacements.append((old_call, new_call))

    for old_call, new_call in replacements:
        new_src = new_src.replace(old_call, new_call, 1)

    # Validate ToolDB.init is present
    has_init = bool(RE_HAS_INIT.search(src))
    if not has_init:
        init_warning = f" {YELLOW}[WARN: no ToolDB.init() found!]{RESET}"
        stats["files_no_init"] += 1
    else:
        init_warning = ""

    # Report
    tag = f"{GREEN}[FIXED]{RESET}" if APPLY else f"{YELLOW}[DRY]  {RESET}"
    print(f"\n  {tag} {BOLD}{path.name}{RESET}{init_warning}")
    for old_call, new_call in replacements:
        print(f"    {RED}- {old_call}{RESET}")
        print(f"    {GREEN}+ {new_call}{RESET}")

    if APPLY:
        if not NO_BACKUP:
            shutil.copy(path, path.with_suffix(".html.bak"))
        path.write_text(new_src, encoding="utf-8")
        stats["files_fixed"] += 1
        stats["calls_fixed"] += len(replacements)

    return True


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    mode = "APPLY" if APPLY else "DRY-RUN"
    print(f"\n{BOLD}{'='*70}")
    print(f"  Fast Track Tools — ToolDB.saveResponses Fixer  [{mode}]")
    print(f"  Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*70}{RESET}\n")

    # Verify the ToolDB API first
    api_ok = verify_tooldb_api()
    if not api_ok:
        print(f"\n  {RED}Aborting — tool-db.js API check failed.{RESET}\n")
        sys.exit(1)
    print()

    if not APPLY:
        print(f"  {YELLOW}Dry-run mode — pass --apply to write changes{RESET}\n")

    # Collect tool files
    tool_files = sorted(TOOLS_DIR.rglob("*.html"))
    tool_files = [f for f in tool_files if f.name != "TOOL-BLUEPRINT.html" and ".bak" not in f.name]

    if ONLY_FILE:
        tool_files = [f for f in tool_files if ONLY_FILE in f.name]
        if not tool_files:
            print(f"  No files matching --only={ONLY_FILE}")
            sys.exit(1)

    any_changed = False
    for path in tool_files:
        changed = fix_tool(path)
        if changed:
            any_changed = True

    # Summary
    print(f"\n{'='*70}")
    print(f"  SUMMARY")
    if APPLY:
        print(f"  Files fixed:        {stats['files_fixed']}")
        print(f"  saveResponses calls rewritten: {stats['calls_fixed']}")
    else:
        if any_changed:
            print(f"  {YELLOW}Changes pending — run with --apply to fix{RESET}")
        else:
            print(f"  {GREEN}No saveResponses calls found — all tools clean{RESET}")
    print(f"  Files already correct (ToolDB.save): {stats['files_ok']}")
    print(f"  Files with no save call at all:      {stats['files_no_save']}")
    if stats["files_no_init"]:
        print(f"  {YELLOW}Files missing ToolDB.init():          {stats['files_no_init']}  ← review manually{RESET}")
    print(f"{'='*70}\n")

    if not APPLY and any_changed:
        print(f"  Run: python docs/fix-tooldb-save.py --apply\n")


if __name__ == "__main__":
    main()
