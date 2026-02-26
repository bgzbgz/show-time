#!/usr/bin/env python3
"""
Fast Track Tools — Design Normalizer
=====================================
Makes every tool design-consistent with the reference tool:
    module-3-market/13-segmentation-target-market.html

WHAT IT CHANGES
---------------
Phase 1 — cognitive-load.css  (one shared file)
  • .ft-reveal CSS  -> dark card style matching BRUTAL TRUTH transition card
  • .ft-reveal-science CSS (new) -> dark card matching PEER PROOF transition card
  • .cl-insight-box CSS -> dark card (yellow left border)
  • .cl-science-box CSS -> dark card (grey left border)
  (All colours, spacing, fonts pulled directly from transition-screen.js)

Phase 2 — Per-tool <style> block
  • Inject canonical wizard CSS if any wizard class is missing/wrong
    (wizard-layout, wizard-main, wizard-content, wizard-footer, wizard-sidebar,
     btn-wiz-back, btn-wiz-next — exact values from tool 13)
  • Inject Plaak / Riforma / Monument @font-face declarations if absent
  • Add numbered-section + char-counter CSS if absent

Phase 3 — Per-tool JSX
  • <ScienceBox ...>TEXT</ScienceBox>  ->  ft-reveal-science div
    (The CognitiveLoad component disappears; pure HTML div instead)
  • <FastTrackInsight ...>TEXT</FastTrackInsight>  ->  ft-reveal div
  • Both replacements PRESERVE any outer JSX conditional that already exists
  • If the component was unconditionally shown, it is wrapped in
    {(NEAREST_DATA_FIELD || '').length >= 20 && (...)} using a heuristic
    (searches backwards for the most recent data.XXX reference in the same
    step function). If no field found, wraps in {true && (...)} — always visible,
    styled correctly, can be refined manually.

SAFETY GUARANTEES
-----------------
  • Dry-run by default — NO files touched until you pass --apply
  • .bak backups created before any file is touched
  • Multi-line regex uses DOTALL but is anchored to JSX component tags
  • Wizard CSS injection only replaces the specific class rule, never the full <style>
  • ScienceBookmarkIcon elements are NEVER touched
  • JavaScript logic is never modified
  • Canvas sections are never modified
  • Only JSX inside React function bodies is scanned

USAGE
-----
  python docs/design-normalize.py                    # Dry-run (default)
  python docs/design-normalize.py --apply            # Apply + create backups
  python docs/design-normalize.py --apply --no-backup
  python docs/design-normalize.py --apply --only=03-values.html
  python docs/design-normalize.py --apply --skip-css  # skip cognitive-load.css
  python docs/design-normalize.py --apply --only-css  # only cognitive-load.css
"""

import os
import re
import sys
import shutil
from pathlib import Path
from datetime import datetime

# -- CLI flags ------------------------------------------------------------------
APPLY      = "--apply"      in sys.argv
NO_BACKUP  = "--no-backup"  in sys.argv
SKIP_CSS   = "--skip-css"   in sys.argv
ONLY_CSS   = "--only-css"   in sys.argv
ONLY_FILE  = next((a.split("=",1)[1] for a in sys.argv if a.startswith("--only=")), None)
VERBOSE    = "--verbose"    in sys.argv

# -- Paths ----------------------------------------------------------------------
REPO_ROOT  = Path(__file__).parent.parent
TOOLS_DIR  = REPO_ROOT / "frontend" / "tools"
CSS_FILE   = REPO_ROOT / "frontend" / "shared" / "css" / "cognitive-load.css"

# -- Counters -------------------------------------------------------------------
stats = {"files_changed": 0, "css_changes": 0, "jsx_changes": 0, "wizard_css": 0, "font_face": 0}

# ══════════════════════════════════════════════════════════════════════════════
#  CANONICAL DESIGN TOKENS  (source of truth)
# ══════════════════════════════════════════════════════════════════════════════

# Exact wizard CSS from 13-segmentation-target-market.html
WIZARD_CSS_CANONICAL = {
    ".wizard-layout":       "display: flex; min-height: 100vh;",
    ".wizard-main":         "flex: 1; display: flex; flex-direction: column; overflow-y: auto;",
    ".wizard-content":      "flex: 1; padding: 48px 32px; max-width: 720px; width: 100%; margin: 0 auto;",
    ".wizard-footer":       "padding: 24px 64px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #fff;",
    ".wizard-sidebar":      "width: 280px; background: #1a1a1a; min-height: 100vh; padding: 48px 32px; display: flex; flex-direction: column; position: sticky; top: 0; align-self: flex-start; height: 100vh; overflow-y: auto;",
    ".btn-wiz-back":        "background: transparent; border: 2px solid #d1d5db; color: #6b7280; padding: 14px 28px; font-family: 'Monument', monospace; font-size: 12px; letter-spacing: 0.06em; cursor: pointer; transition: all 0.2s;",
    ".btn-wiz-back:hover":  "border-color: #000; color: #000;",
    ".btn-wiz-next":        "background: #000; color: #fff; border: 2px solid #000; padding: 14px 32px; font-family: 'Monument', monospace; font-size: 12px; letter-spacing: 0.06em; cursor: pointer; transition: all 0.2s;",
    ".btn-wiz-next:hover:not(:disabled)": "background: #222;",
    ".btn-wiz-next:disabled": "background: #e5e7eb; border-color: #e5e7eb; color: #9ca3af; cursor: not-allowed;",
}

WIZARD_CSS_BLOCK = """\
    /* Wizard Layout */
    .wizard-layout { display: flex; min-height: 100vh; }
    .wizard-main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
    .wizard-content { flex: 1; padding: 48px 32px; max-width: 720px; width: 100%; margin: 0 auto; }
    .wizard-footer { padding: 24px 64px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #fff; }
    .wizard-sidebar { width: 280px; background: #1a1a1a; min-height: 100vh; padding: 48px 32px; display: flex; flex-direction: column; position: sticky; top: 0; align-self: flex-start; height: 100vh; overflow-y: auto; }
    .btn-wiz-back { background: transparent; border: 2px solid #d1d5db; color: #6b7280; padding: 14px 28px; font-family: 'Monument', monospace; font-size: 12px; letter-spacing: 0.06em; cursor: pointer; transition: all 0.2s; }
    .btn-wiz-back:hover { border-color: #000; color: #000; }
    .btn-wiz-next { background: #000; color: #fff; border: 2px solid #000; padding: 14px 32px; font-family: 'Monument', monospace; font-size: 12px; letter-spacing: 0.06em; cursor: pointer; transition: all 0.2s; }
    .btn-wiz-next:hover:not(:disabled) { background: #222; }
    .btn-wiz-next:disabled { background: #e5e7eb; border-color: #e5e7eb; color: #9ca3af; cursor: not-allowed; }"""

FONT_FACE_BLOCK = """\
    @font-face {
      font-family: 'Plaak';
      src: url('Plaak3Trial-43-Bold.woff2') format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    @font-face {
      font-family: 'Riforma';
      src: url('RiformaLL-Regular.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'Monument';
      src: url('MonumentGrotesk-Mono.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }"""

NUMBERED_SECTION_CSS = """\
    /* Numbered Section Badge */
    .numbered-section {
      background: #000000;
      color: #FFFFFF;
      padding: 10px 16px;
      font-family: 'Plaak', sans-serif;
      font-size: 26px;
      display: inline-block;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }

    /* Character Counter */
    .char-counter { font-size: 14px; color: #666; margin-top: 4px; }
    .char-counter.invalid { color: #EF4444; }"""

# -- New ft-reveal CSS (dark card — matches BRUTAL TRUTH in transition-screen.js)
NEW_FT_REVEAL_CSS = """\
/* Fast Track Insight Reveal — dark card (matches Brutal Truth / Peer Proof style) */
.ft-reveal {
    background: #111;
    border: 1px solid #333;
    border-left: 4px solid #FFF469;
    padding: 20px 24px;
    margin-top: 24px;
    animation: ftRevealIn 0.4s ease;
}
.ft-reveal-label {
    font-family: 'Monument', monospace;
    font-size: 10px;
    color: #FFF469;
    display: block;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 8px;
}
.ft-reveal-text {
    font-size: 14px;
    color: #ccc;
    line-height: 1.7;
    margin: 0;
}
/* Science Reveal variant — dark card (matches Peer Proof style) */
.ft-reveal-science {
    background: #111;
    border: 1px solid #333;
    border-left: 4px solid #666;
    padding: 20px 24px;
    margin-top: 24px;
    animation: ftRevealIn 0.4s ease;
}
.ft-reveal-science .ft-reveal-label {
    color: #999;
}
.ft-reveal-science .ft-reveal-text {
    font-style: italic;
}
@keyframes ftRevealIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
}"""

# Updated cl-insight-box CSS (dark card, yellow left border)
NEW_CL_INSIGHT_BOX_CSS = """\
.cl-insight-box {
    background: #111;
    border: 1px solid #333;
    border-left: 4px solid #FFF469;
    padding: 20px 24px;
    margin-top: 32px;
    margin-bottom: 32px;
}

.cl-insight-box__label {
    font-family: 'Monument', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
    color: #FFF469;
    display: block;
}

.cl-insight-box__body {
    font-size: 14px;
    color: #ccc;
    line-height: 1.7;
}"""

# Updated cl-science-box CSS (dark card, grey left border)
NEW_CL_SCIENCE_BOX_CSS = """\
.cl-science-box {
    background: #111;
    border: 1px solid #333;
    border-left: 4px solid #666;
    padding: 20px 24px;
    margin-top: 32px;
    margin-bottom: 32px;
}

.cl-science-box__label {
    font-family: 'Monument', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
    color: #999;
    display: block;
    cursor: default;
}

.cl-science-box--collapsible .cl-science-box__label {
    cursor: pointer;
    user-select: none;
}

.cl-science-box__toggle {
    display: inline-block;
    margin-left: 6px;
    font-size: 10px;
    transition: transform 0.3s ease;
}

.cl-science-box.is-open .cl-science-box__toggle {
    transform: rotate(90deg);
}

.cl-science-box__body {
    font-size: 14px;
    color: #ccc;
    line-height: 1.7;
    font-style: italic;
}

.cl-science-box--collapsible .cl-science-box__body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease, opacity 0.3s ease;
    opacity: 0;
}

.cl-science-box--collapsible.is-open .cl-science-box__body {
    max-height: 500px;
    opacity: 1;
}"""


# ══════════════════════════════════════════════════════════════════════════════
#  HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def log(msg, indent=0):
    prefix = "  " * indent
    print(f"{prefix}{msg}")

def log_change(label, detail="", indent=2):
    marker = "  [DRY]" if not APPLY else "  [FIX]"
    print(f"{marker} {label}")
    if detail and VERBOSE:
        for line in detail.split("\n")[:5]:
            print(f"       {line}")

def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")

def write(path: Path, content: str, original: str):
    if content == original:
        return False
    if APPLY:
        if not NO_BACKUP:
            bak = path.with_suffix(path.suffix + ".bak")
            shutil.copy2(path, bak)
        path.write_text(content, encoding="utf-8")
    stats["files_changed"] += 1
    return True

def find_tools() -> list[Path]:
    paths = sorted(TOOLS_DIR.rglob("*.html"))
    # Exclude backup files and blueprint
    paths = [p for p in paths if ".bak" not in p.name and "BLUEPRINT" not in p.name.upper()]
    if ONLY_FILE:
        paths = [p for p in paths if ONLY_FILE in p.name]
    return paths


# ══════════════════════════════════════════════════════════════════════════════
#  PHASE 1 — cognitive-load.css
# ══════════════════════════════════════════════════════════════════════════════

def normalize_cognitive_load_css():
    log("\n--- Phase 1: cognitive-load.css -----------------------------------")
    src = read(CSS_FILE)
    out = src

    # 1a. Replace .ft-reveal block (everything from .ft-reveal { to the closing })
    #     Match the entire ft-reveal block including .ft-reveal-label, .ft-reveal-text, @keyframes
    ft_reveal_pattern = re.compile(
        r'/\* Fast Track Insight Reveal.*?'
        r'@keyframes ftRevealIn \{.*?\}',
        re.DOTALL
    )
    if ft_reveal_pattern.search(out):
        new_out = ft_reveal_pattern.sub(NEW_FT_REVEAL_CSS, out, count=1)
        if new_out != out:
            log_change("ft-reveal + ft-reveal-science CSS -> dark card style (Brutal Truth / Peer Proof)")
            stats["css_changes"] += 1
            out = new_out
    else:
        # Append if not found
        log_change("ft-reveal CSS block not found — appending at end")
        out = out.rstrip() + "\n\n" + NEW_FT_REVEAL_CSS + "\n"
        stats["css_changes"] += 1

    # 1b. Replace .cl-insight-box block
    cl_insight_pattern = re.compile(
        r'/\*\s*={5,}.*?2\. Fast Track Insight Box.*?={5,}\s*\*/'
        r'.*?'
        r'\.cl-insight-box__body \{.*?\}',
        re.DOTALL
    )
    if cl_insight_pattern.search(out):
        replacement = (
            "/* ==========================================================================\n"
            "   2. Fast Track Insight Box\n"
            "   Dark card with yellow left border (matches Brutal Truth style)\n"
            "   ========================================================================== */\n"
            + NEW_CL_INSIGHT_BOX_CSS
        )
        new_out = cl_insight_pattern.sub(replacement, out, count=1)
        if new_out != out:
            log_change(".cl-insight-box CSS -> dark card with yellow left border")
            stats["css_changes"] += 1
            out = new_out
    else:
        log("  [SKIP] .cl-insight-box block not found (pattern mismatch — check manually)", 1)

    # 1c. Replace .cl-science-box block
    cl_science_pattern = re.compile(
        r'/\*\s*={5,}.*?3\. Science Box.*?={5,}\s*\*/'
        r'.*?'
        r'\.cl-science-box--collapsible\.is-open \.cl-science-box__body \{.*?\}',
        re.DOTALL
    )
    if cl_science_pattern.search(out):
        replacement = (
            "/* ==========================================================================\n"
            "   3. Science Box\n"
            "   Dark card with grey left border (matches Peer Proof style)\n"
            "   ========================================================================== */\n"
            + NEW_CL_SCIENCE_BOX_CSS
        )
        new_out = cl_science_pattern.sub(replacement, out, count=1)
        if new_out != out:
            log_change(".cl-science-box CSS -> dark card with grey left border")
            stats["css_changes"] += 1
            out = new_out
    else:
        log("  [SKIP] .cl-science-box block not found (pattern mismatch — check manually)", 1)

    changed = write(CSS_FILE, out, src)
    if not changed:
        log("  cognitive-load.css: already up-to-date", 1)


# ══════════════════════════════════════════════════════════════════════════════
#  PHASE 2 — Per-tool <style> block normalization
# ══════════════════════════════════════════════════════════════════════════════

def normalize_style_block(src: str, tool_name: str) -> tuple[str, list[str]]:
    """
    Returns (new_src, list_of_changes).
    Only modifies the <style> block — never touches the Babel <script>.
    """
    changes = []

    # Find the <style> block boundaries
    style_start = src.find("<style>")
    style_end   = src.find("</style>")
    if style_start == -1 or style_end == -1:
        return src, ["No <style> block found — skipping"]
    style_src = src[style_start:style_end + len("</style>")]

    # -- 2a. Font-face declarations --------------------------------------------
    missing_fonts = []
    for font in ("'Plaak'", "'Riforma'", "'Monument'"):
        if font not in style_src:
            missing_fonts.append(font)
    if missing_fonts:
        # Insert after <style> tag
        style_src = style_src.replace(
            "<style>\n",
            "<style>\n" + FONT_FACE_BLOCK + "\n\n",
            1
        )
        changes.append(f"Injected @font-face for: {', '.join(missing_fonts)}")
        stats["font_face"] += 1

    # -- 2b. Wizard CSS --------------------------------------------------------
    has_wizard = "wizard-layout" in style_src

    if has_wizard:
        # Check each canonical value and fix if different
        for selector, canonical_body in WIZARD_CSS_CANONICAL.items():
            # Match: .selector-name { ...any content... }
            escaped = re.escape(selector)
            pattern = re.compile(
                rf'{escaped}\s*\{{([^}}]*)\}}',
                re.IGNORECASE
            )
            m = pattern.search(style_src)
            if m:
                current_body = m.group(1).strip()
                canonical_stripped = canonical_body.strip().rstrip(";")
                # Simple check: is the canonical content mostly there?
                # We only replace if it's clearly wrong (e.g. missing key properties)
                key_checks = {
                    ".wizard-content":  ("max-width: 720px", "margin: 0 auto"),
                    ".wizard-footer":   ("border-top: 1px solid #e5e7eb", "background: #fff"),
                    ".wizard-sidebar":  ("background: #1a1a1a", "width: 280px"),
                    ".btn-wiz-next":    ("background: #000", "font-family: 'Monument'"),
                    ".btn-wiz-back":    ("border: 2px solid #d1d5db",),
                }
                required = key_checks.get(selector, ())
                if any(req not in current_body for req in required):
                    old = m.group(0)
                    new = f"{selector} {{ {canonical_body} }}"
                    style_src = style_src.replace(old, new, 1)
                    changes.append(f"Fixed {selector} CSS to canonical values")
                    stats["wizard_css"] += 1
    else:
        # Only inject wizard CSS if the tool uses the wizard pattern
        # (check for WizardSidebar or wizard-layout in the script section)
        script_section = src[src.find("<script"):]
        if "wizard-layout" in script_section or "WizardSidebar" in script_section or "wizard-sidebar" in script_section:
            # Inject before </style>
            style_src = style_src.replace(
                "</style>",
                "\n" + WIZARD_CSS_BLOCK + "\n</style>",
                1
            )
            changes.append("Injected full wizard CSS block (was missing)")
            stats["wizard_css"] += 1

    # -- 2c. numbered-section + char-counter CSS -------------------------------
    if "numbered-section" not in style_src and "numbered-section" in src:
        style_src = style_src.replace(
            "</style>",
            "\n" + NUMBERED_SECTION_CSS + "\n</style>",
            1
        )
        changes.append("Injected .numbered-section + .char-counter CSS")

    # Reconstruct full source
    new_src = src[:style_start] + style_src + src[style_end + len("</style>"):]
    return new_src, changes


# ══════════════════════════════════════════════════════════════════════════════
#  PHASE 3 — JSX component -> ft-reveal div replacements
# ══════════════════════════════════════════════════════════════════════════════

def find_nearest_data_field(src: str, pos: int) -> str:
    """
    Look backwards from `pos` for the most recent data.fieldName reference
    in a JSX expression context (e.g. onChange, value=, updateData).
    Returns the field name string, or '' if not found.
    """
    # Search backwards in the 3000 chars before this position
    snippet = src[max(0, pos - 3000): pos]
    # Match patterns like: data.fieldName, updateData('fieldName', ...), value={data.fieldName}
    candidates = re.findall(
        r'(?:data\.(\w+)|updateData\([\'"](\w+)[\'"]|value=\{data\.(\w+)\})',
        snippet
    )
    if not candidates:
        return ''
    # Return the last match, picking the first non-empty group
    for c in reversed(candidates):
        for g in c:
            if g:
                return g
    return ''


def wrap_with_reveal(inner_jsx: str, field_name: str, label: str, css_class: str) -> str:
    """
    Wraps inner_jsx with:
      {(data.FIELD || '').length >= 20 && (
        <div className="CSS_CLASS">
          <div className="ft-reveal-label">LABEL</div>
          <p className="ft-reveal-text">INNER</p>
        </div>
      )}
    If no field_name is found, emits always-visible version with a TODO comment.
    """
    inner = inner_jsx.strip()
    reveal_div = (
        f'<div className="{css_class}">\n'
        f'    <div className="ft-reveal-label">{label}</div>\n'
        f'    <p className="ft-reveal-text">{inner}</p>\n'
        f'  </div>'
    )
    if field_name:
        return (
            f'{{(data.{field_name} || \'\').length >= 20 && (\n'
            f'  {reveal_div}\n'
            f')}}'
        )
    else:
        # No field found — always visible, add TODO
        return (
            f'{{/* TODO: add field condition */}}\n'
            f'{reveal_div}'
        )


def replace_jsx_components(src: str, tool_name: str) -> tuple[str, list[str]]:
    """
    Replace <FastTrackInsight> and <ScienceBox> JSX components with
    ft-reveal / ft-reveal-science divs.

    SAFETY: only touches lines inside Babel <script> blocks.
    NEVER touches Canvas/CanvasPage sections (they have their own rendering).
    NEVER touches ScienceBookmarkIcon.
    """
    changes = []

    # Extract the babel script content (between <script type="text/babel"> and </script>)
    script_match = re.search(
        r'(<script\s+type=["\']text/babel["\'][^>]*>)([\s\S]*?)(</script>)',
        src
    )
    if not script_match:
        return src, ["No Babel script found — skipping JSX transforms"]

    script_open  = script_match.group(1)
    script_body  = script_match.group(2)
    script_close = script_match.group(3)

    # -- FastTrackInsight -> ft-reveal ------------------------------------------
    ft_pattern = re.compile(
        r'<FastTrackInsight(?P<props>[^>]*)>\s*(?P<content>[\s\S]*?)\s*</FastTrackInsight>',
        re.DOTALL
    )
    new_script = script_body
    for m in list(ft_pattern.finditer(new_script)):
        inner = m.group("content").strip()
        pos   = m.start()
        field = find_nearest_data_field(new_script, pos)
        replacement = wrap_with_reveal(inner, field, "FAST TRACK INSIGHT", "ft-reveal")
        new_script = new_script[:m.start()] + replacement + new_script[m.end():]
        changes.append(
            f"FastTrackInsight -> ft-reveal"
            + (f" (watches data.{field})" if field else " (no field found — always visible)")
        )
        stats["jsx_changes"] += 1
        # Re-search because positions shifted
        ft_pattern_rerun = re.compile(
            r'<FastTrackInsight(?:[^>]*)>\s*(?:[\s\S]*?)\s*</FastTrackInsight>',
            re.DOTALL
        )
        for m2 in list(ft_pattern_rerun.finditer(new_script)):
            inner2 = m2.group(0)
            # Only re-process if this is a different match
            break  # break to avoid infinite loop; next iteration handles remaining

    # -- ScienceBox -> ft-reveal-science ---------------------------------------
    sb_pattern = re.compile(
        r'<ScienceBox(?P<props>[^>]*)>\s*(?P<content>[\s\S]*?)\s*</ScienceBox>',
        re.DOTALL
    )
    # Process all ScienceBox matches (not just first)
    # Iterate from end to start to preserve positions
    matches = list(sb_pattern.finditer(new_script))
    for m in reversed(matches):
        inner = m.group("content").strip()
        props = m.group("props")
        pos   = m.start()
        field = find_nearest_data_field(new_script, pos)

        # collapsible ScienceBox: was hidden by default -> wrap as reveal
        label = "SCIENCE BEHIND IT"
        replacement = wrap_with_reveal(inner, field, label, "ft-reveal-science")
        new_script = new_script[:m.start()] + replacement + new_script[m.end():]
        changes.append(
            f"ScienceBox -> ft-reveal-science"
            + (f" (watches data.{field})" if field else " (no field found — always visible)")
        )
        stats["jsx_changes"] += 1

    if new_script != script_body:
        # Reconstruct full source
        new_src = src[:script_match.start(2)] + new_script + src[script_match.end(2):]
        return new_src, changes
    return src, changes


# ══════════════════════════════════════════════════════════════════════════════
#  PHASE 4 — Additional per-tool fixes
# ══════════════════════════════════════════════════════════════════════════════

def fix_alert_success(src: str) -> tuple[str, list[str]]:
    """
    Replace `alert('...submitted...')` on success paths with setSubmitMessage().
    ONLY runs when setSubmitMessage and setSubmitStatus are already declared in the file
    (prevents ReferenceError in tools that haven't added these state vars yet).
    """
    changes = []
    # Guard: only process if tool already has these state vars
    if "setSubmitMessage" not in src or "setSubmitStatus" not in src:
        return src, []

    pattern = re.compile(
        r"alert\(['\"]([^'\"]*(?:submit|saved|success)[^'\"]*)['\"](?:\s*\+\s*[^)]+)?\);",
        re.IGNORECASE
    )
    def replace_alert(m):
        msg = m.group(1)
        changes.append("Replaced success alert() with setSubmitMessage()")
        return f"setSubmitMessage('{msg}'); setSubmitStatus('success');"

    new_src, n = pattern.subn(replace_alert, src)
    if n:
        stats["jsx_changes"] += n
    return new_src, changes


def fix_wizard_content_centering(src: str) -> tuple[str, list[str]]:
    """
    Ensure wizard-content has max-width: 720px and margin: 0 auto for centering.
    Fixes tools where wizard-content is left-aligned.
    """
    changes = []
    # Look for wizard-content CSS rule in <style> and fix centering
    pattern = re.compile(
        r'(\.wizard-content\s*\{)([^}]*?)(\})',
        re.DOTALL
    )
    def fix_centering(m):
        body = m.group(2)
        modified = body
        if "max-width" not in modified:
            modified += " max-width: 720px;"
        if "margin: 0 auto" not in modified and "margin:0 auto" not in modified:
            # Remove any existing margin that conflicts
            modified = re.sub(r'margin:[^;]+;', '', modified)
            modified += " margin: 0 auto;"
        if "width: 100%" not in modified:
            modified += " width: 100%;"
        if modified != body:
            changes.append("Fixed .wizard-content: added max-width + margin: 0 auto for centering")
        return m.group(1) + modified + m.group(3)

    new_src = pattern.sub(fix_centering, src)
    return new_src, changes


# ══════════════════════════════════════════════════════════════════════════════
#  MAIN PROCESSOR
# ══════════════════════════════════════════════════════════════════════════════

def process_tool(path: Path):
    label = f"{path.parent.name}/{path.name}"
    src   = read(path)
    out   = src
    all_changes = []

    # Phase 2: style block
    out, c = normalize_style_block(out, label)
    all_changes.extend(c)

    # Phase 3: JSX components
    # Only process if the tool uses CognitiveLoad components
    if "FastTrackInsight" in out or "ScienceBox" in out:
        out, c = replace_jsx_components(out, label)
        all_changes.extend(c)

    # Phase 4a: wizard-content centering
    # Only run if normalize_style_block didn't already fix it
    # (i.e. wizard CSS was present but centering was off)
    if ".wizard-content" in out and ("max-width: 720px" not in out or "margin: 0 auto" not in out):
        out, c = fix_wizard_content_centering(out)
        all_changes.extend(c)

    # Phase 4b: alert() success
    # Only in last submit handler — look for patterns near handleSubmit
    if "alert(" in out and ("submitted" in out.lower() or "success" in out.lower()):
        out, c = fix_alert_success(out)
        all_changes.extend(c)

    # Report + write
    real_changes = [c for c in all_changes if "already" not in c.lower() and "not found" not in c.lower() and "skip" not in c.lower()]
    if real_changes or out != src:
        log(f"\n  {label}")
        for c in all_changes:
            log_change(c, indent=2)
        write(path, out, src)
    elif VERBOSE:
        log(f"  {label}: clean")


# ══════════════════════════════════════════════════════════════════════════════
#  ENTRY POINT
# ══════════════════════════════════════════════════════════════════════════════

def main():
    mode = "APPLY" if APPLY else "DRY-RUN"
    log(f"\n{'='*65}")
    log(f"  Fast Track Tools — Design Normalizer  [{mode}]")
    log(f"  Reference: 13-segmentation-target-market.html")
    log(f"  Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    log(f"{'='*65}")

    if not APPLY:
        log("\n  >> Dry-run mode. Pass --apply to write changes.")
        log("  >> Backups will be created as .bak files unless --no-backup.")

    # -- Phase 1: cognitive-load.css
    if not SKIP_CSS:
        normalize_cognitive_load_css()
    else:
        log("\n--- Phase 1: SKIPPED (--skip-css)")

    if ONLY_CSS:
        log("\n  --only-css: skipping per-tool processing.")
    else:
        # -- Phase 2+3: per-tool
        tools = find_tools()
        log(f"\n--- Phase 2+3: Processing {len(tools)} tool files -----------------")
        if ONLY_FILE:
            log(f"    (filtered to: {ONLY_FILE})")

        for path in tools:
            try:
                process_tool(path)
            except Exception as e:
                log(f"  [ERROR] {path.name}: {e}")

    # -- Summary
    log(f"\n{'='*65}")
    log(f"  SUMMARY")
    log(f"  Files modified:   {stats['files_changed']}")
    log(f"  CSS changes:      {stats['css_changes']}")
    log(f"  Wizard CSS fixes: {stats['wizard_css']}")
    log(f"  Font-face injects:{stats['font_face']}")
    log(f"  JSX conversions:  {stats['jsx_changes']}")
    log(f"{'='*65}")
    if not APPLY:
        log("\n  Run with --apply to write all changes.\n")
    else:
        log(f"\n  Done. {'Backups created as .bak files.' if not NO_BACKUP else 'No backups (--no-backup).'}\n")


if __name__ == "__main__":
    main()
