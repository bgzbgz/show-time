#!/usr/bin/env python3
"""
Phase 3: Remove Supabase CDN, config entries, and client init from tool HTML files.
Only touches tool files (not dashboard, admin, guru-suite — those still need direct Supabase access).

Usage: python scripts/remove-supabase-from-tools.py [--dry-run]
"""

import os
import re
import sys
import glob

DRY_RUN = '--dry-run' in sys.argv

# Only tool files — dashboard/admin/guru-suite are out of scope
TOOL_GLOBS = [
    'frontend/tools/**/*.html',
]

# Files to skip (they use Supabase client directly for non-tool-db queries)
SKIP_FILES = {
    'frontend/dashboard.html',
    'frontend/admin/index.html',
    'frontend/guru-suite/index.html',
}

def remove_supabase(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    content = original

    # 1. Remove Supabase CDN script tag
    content = re.sub(
        r'\s*<script src="https://cdn\.jsdelivr\.net/npm/@supabase/supabase-js@2"></script>\n?',
        '\n',
        content
    )

    # 2. Remove SUPABASE_URL and SUPABASE_ANON_KEY from CONFIG object
    #    Pattern: "            SUPABASE_URL: '...',\n"
    content = re.sub(
        r"[ \t]*SUPABASE_URL:\s*'[^']*',?\s*\n",
        '',
        content
    )
    content = re.sub(
        r"[ \t]*SUPABASE_ANON_KEY:\s*'[^']*',?\s*\n",
        '',
        content
    )

    # 3. Remove createClient + supabaseClient init lines
    #    Pattern: "const { createClient } = supabase;"
    content = re.sub(
        r"[ \t]*const\s*\{\s*createClient\s*\}\s*=\s*supabase;\s*\n",
        '',
        content
    )
    #    Pattern: "const supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);"
    content = re.sub(
        r"[ \t]*const\s+supabaseClient\s*=\s*createClient\([^)]*\);\s*\n",
        '',
        content
    )
    #    Pattern: "window.supabaseClient = supabaseClient;"
    content = re.sub(
        r"[ \t]*window\.supabaseClient\s*=\s*supabaseClient;\s*\n",
        '',
        content
    )

    # 4. Remove standalone variable patterns (some files use this instead of CONFIG)
    content = re.sub(
        r"[ \t]*const\s+SUPABASE_URL\s*=\s*'[^']*';\s*\n",
        '',
        content
    )
    content = re.sub(
        r"[ \t]*const\s+SUPABASE_ANON_KEY\s*=\s*'[^']*';\s*\n",
        '',
        content
    )
    #    Pattern: "const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);"
    content = re.sub(
        r"[ \t]*const\s+\w+\s*=\s*(?:window\.)?supabase\.createClient\([^)]*\);\s*\n",
        '',
        content
    )

    if content == original:
        return False

    if not DRY_RUN:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    return True


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)

    files = []
    for pattern in TOOL_GLOBS:
        files.extend(glob.glob(pattern, recursive=True))

    # Normalize paths
    files = [f.replace('\\', '/') for f in files]
    files = [f for f in files if f not in SKIP_FILES]
    files.sort()

    changed = 0
    skipped = 0

    for filepath in files:
        if remove_supabase(filepath):
            changed += 1
            print(f"  {'[DRY RUN] ' if DRY_RUN else ''}Cleaned: {filepath}")
        else:
            skipped += 1

    print(f"\n{'[DRY RUN] ' if DRY_RUN else ''}Done: {changed} files cleaned, {skipped} already clean")


if __name__ == '__main__':
    main()
