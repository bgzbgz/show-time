#!/usr/bin/env python3
"""
Fast Track Tools — Intro Page Normalizer
==========================================
Rewrites all non-conforming intro pages (step 0.5) to match
the design of tool 13 (Segmentation & Target Market).

REFERENCE DESIGN (tool 13 IntroPage):
  - Full-page black background, white text
  - "BEFORE WE START" heading — Plaak 100px
  - SPRINT INFO block — yellow heading, white card with sprint title + description + quote
  - PURPOSE block — blockquote with attribution + 2 paragraphs
  - MISTAKES TO AVOID — yellow heading, bullet list
  - THE JOURNEY — numbered step grid
  - "LET'S START →" full-width button

TOOLS NORMALIZED (8 tools):
  01 - know-thyself    (if-return step 0.5 → IntroPage function)
  02 - dream           (inline JSX step 0.5 → IntroPage function)
  03 - values          (if-return step 0.5 → IntroPage function)
  08 - goals           (if-return step 0.5 → IntroPage function)
  12 - market-size     (inline JSX step 0.5, missing SPRINT INFO → IntroPage function)
  14 - target-segment-deep-dive  (no step 0.5 at all → ADD IntroPage + routing)
  26 - employer-branding  (renderIntroduction() → rebuild to match tool 13)
  27 - agile-teams        (renderIntroduction() → rebuild to match tool 13)

TOOLS SKIPPED (functional step 0.5 — not just informational):
  06 - cash flow      (business model selector — data input required)
  07 - energy         (individual/team path chooser)
  09 - focus          (individual/team path chooser)

TOOLS ALREADY CORRECT (full reference design):
  16, 17, 18, 19, 20, 21, 23, 24

USAGE:
  python docs/intro-normalize.py                     # Dry-run (default)
  python docs/intro-normalize.py --apply             # Apply + backups
  python docs/intro-normalize.py --apply --no-backup
  python docs/intro-normalize.py --apply --only=01-know-thyself.html
  python docs/intro-normalize.py --apply --verbose
"""

import re
import sys
import shutil
from pathlib import Path
from datetime import datetime

APPLY     = "--apply"    in sys.argv
NO_BACKUP = "--no-backup" in sys.argv
VERBOSE   = "--verbose"  in sys.argv
ONLY_FILE = next((a.split("=",1)[1] for a in sys.argv if a.startswith("--only=")), None)

REPO_ROOT = Path(__file__).parent.parent
TOOLS_DIR = REPO_ROOT / "frontend" / "tools"

GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

stats = {"files_changed": 0, "skipped": 0}

# ══════════════════════════════════════════════════════════════════════════════
#  PER-TOOL CONTENT DATABASE
#  All content extracted from existing tool files — nothing invented.
# ══════════════════════════════════════════════════════════════════════════════

TOOL_DATA = {

    "01-know-thyself": {
        "sprint_title": "Sprint 1: Know Thyself",
        "description": (
            "This is a personal reflection tool. Your guru will only see a short summary "
            "of your answers — not the full details. Be honest with yourself. "
            "The more truthful you are, the more valuable this exercise becomes."
        ),
        "quote": (
            "Knowing yourself is the beginning of all wisdom."
        ),
        "quote_attribution": "Aristotle",
        "purpose_quote": "The unexamined life is not worth living.",
        "purpose_attribution": "Socrates",
        "purpose_text": (
            "Build a complete self-portrait across your dreams, strengths, values, and goals. "
            "Most leaders operate on autopilot — this tool forces the clarity that separates "
            "high-performance executives from average ones."
        ),
        "purpose_stat": (
            "Executives who regularly practise structured self-reflection outperform "
            "peers by 36% in leadership effectiveness (Harvard Business Review)."
        ),
        "mistakes": [
            "Rushing through answers to reach a quick result — depth beats speed here.",
            "Being too self-critical or too self-lenient; aim for honest, specific accuracy.",
            "Skipping sections that feel uncomfortable — those are exactly the ones that matter.",
            "Treating this as a one-time exercise rather than an annual leadership reset.",
        ],
        "journey": [
            ("01", "DREAM LAUNCHER", "Envision your 80th birthday"),
            ("02", "STRENGTHS AMPLIFIER", "Map activities and strengths"),
            ("03", "VALUES COMPASS", "Discover your 5 core values"),
            ("04", "GROWTH BLUEPRINT", "Goals with actions and deadlines"),
        ],
        "grid_cols": 4,
    },

    "02-dream": {
        "sprint_title": "Sprint 2: Dream",
        "description": (
            "This tool is completed together as a leadership team. All answers will be "
            "shared with your team and visible to your guru. A shared dream is the single "
            "most powerful alignment tool a leadership team can use."
        ),
        "quote": (
            "The only thing worse than being blind is having sight but no vision."
        ),
        "quote_attribution": "Helen Keller",
        "purpose_quote": "Good business leaders create a vision, articulate the vision, passionately own the vision, and relentlessly drive it to completion.",
        "purpose_attribution": "Jack Welch",
        "purpose_text": (
            "Define WHY your company exists, HOW you operate, and WHAT you aspire to become. "
            "A shared dream eliminates the daily noise of misaligned priorities and gives your "
            "team a single, compelling reason to push through difficulty."
        ),
        "purpose_stat": (
            "Companies with a clearly articulated vision grow 58% faster and are "
            "72% more profitable than those without one (James Collins, Built to Last)."
        ),
        "mistakes": [
            "Creating a vision by committee that satisfies everyone but excites no one.",
            "Using vague language — 'be the best' or 'customer-centric' without specifics.",
            "Building a dream disconnected from the day-to-day reality of your team.",
            "Skipping the WHY and jumping straight to goals and financial targets.",
        ],
        "journey": [
            ("01", "GOLDEN CIRCLE", "WHY, HOW, WHAT"),
            ("02", "COMPANY DREAM", "10 vision questions"),
            ("03", "DREAM STORY", "One sentence + full narrative"),
            ("04", "DREAM BOARD", "Words, people, images"),
        ],
        "grid_cols": 4,
    },

    "03-values": {
        "sprint_title": "Sprint 3: Values",
        "description": (
            "A two-phase values exercise — first individually, then as a team. "
            "Phase 1 is personal reflection. Phase 2 is a guru-led team session "
            "to define shared behaviors, red lines, and recruitment filters."
        ),
        "quote": (
            "It's not hard to make decisions when you know what your values are."
        ),
        "quote_attribution": "Roy Disney",
        "purpose_quote": "Culture eats strategy for breakfast.",
        "purpose_attribution": "Peter Drucker",
        "purpose_text": (
            "Define the non-negotiable behaviors that shape your culture. "
            "Values without behaviors are just posters on the wall. "
            "This tool translates aspirations into observable, actionable standards "
            "that guide hiring, performance, and every daily decision."
        ),
        "purpose_stat": (
            "Organisations with clearly defined behavioural values see 33% lower turnover "
            "and 23% higher employee engagement (Deloitte Global Culture Survey)."
        ),
        "mistakes": [
            "Listing aspirational values you wish you had rather than behaviours you actually reward.",
            "Creating too many values — 3 to 5 is the proven sweet spot for memorability.",
            "Skipping red lines — knowing what you will NOT tolerate is equally important.",
            "Treating values as a one-time exercise rather than a living operating system.",
        ],
        "journey": [
            ("01", "COMPANY VALUES", "Rate your current values"),
            ("02", "VALUES GAP", "Identify the gaps"),
            ("03", "BEHAVIOURS", "Define observable behaviours"),
            ("04", "RED LINES", "What we never tolerate"),
            ("05", "RECRUITMENT", "Values-based hiring filters"),
            ("06", "COMM PLAN", "How we communicate values"),
        ],
        "grid_cols": 3,
    },

    "08-goals": {
        "sprint_title": "Sprint 8: Goals & Priorities",
        "description": (
            "Transform your list of priorities into a ranked action plan. "
            "Rate each idea on impact and ease, let the score decide what you work on first, "
            "then break the top priorities into executable steps with named owners."
        ),
        "quote": (
            "The essence of strategy is choosing what not to do."
        ),
        "quote_attribution": "Michael E. Porter",
        "purpose_quote": "What gets measured gets managed — but what gets prioritised gets done.",
        "purpose_attribution": "adapted from Peter Drucker",
        "purpose_text": (
            "Most leadership teams have 30+ things they feel they 'should' do. "
            "This tool cuts through the noise to identify the vital few initiatives "
            "that will move the needle — and builds the accountability structure "
            "to ensure they actually happen."
        ),
        "purpose_stat": (
            "Teams that formally prioritise using an impact/ease matrix complete 73% "
            "of their top initiatives vs 31% for teams without a prioritisation system."
        ),
        "mistakes": [
            "Treating all priorities as equally important — they never are.",
            "Rating ease too generously: if it's easy, someone should already have done it.",
            "Skipping the 'cut the elephant' step and leaving priorities as vague goals.",
            "Setting priorities without naming the single owner responsible for each one.",
        ],
        "journey": [
            ("01", "IMPACT MATRIX", "Rate by impact and ease"),
            ("02", "PRIORITY RANKINGS", "Top priorities auto-ranked"),
            ("03", "CUT THE ELEPHANT", "Break into bite-sized steps"),
            ("04", "ACCOUNTABILITY", "Team accountability check"),
            ("05", "ALIGNMENT", "Verify strategic alignment"),
        ],
        "grid_cols": 3,
    },

    "12-market-size": {
        "sprint_title": "Sprint 12: Market Size",
        "description": (
            "Calculate your Total Addressable Market and forecast how it changes "
            "over 3 years using your team's knowledge — no expensive research required. "
            "60-70% accuracy with internal knowledge beats 100% accuracy with stale data."
        ),
        "quote": (
            "The market is a pendulum that will forever swing between unsustainable "
            "optimism and unjustified pessimism."
        ),
        "quote_attribution": "Benjamin Graham",
        "purpose_quote": "If you don't know where your market is going, you can't position yourself to capture it.",
        "purpose_attribution": "Fast Track Tools",
        "purpose_text": (
            "Calculate your Total Addressable Market (TAM), identify the top forces "
            "reshaping it, and forecast where it will be in 3 years. "
            "This turns market intuition into a shared, quantified view that "
            "aligns your leadership team around the same opportunity."
        ),
        "purpose_stat": (
            "Teams that quantify their TAM and forecast market forces make "
            "2.4x better resource allocation decisions than those relying on gut feel alone."
        ),
        "mistakes": [
            "Aiming for 100% accuracy — 60-70% directional accuracy is enough to act on.",
            "Missing the top 3-5 high-impact forces reshaping your market.",
            "Ignoring technology as a force — it reshapes every market faster than expected.",
            "Underestimating your blind spots — the biggest risk is always what you're not seeing.",
            "Setting unrealistic market share targets without grounding them in competitive data.",
        ],
        "journey": [
            ("01", "MARKET SIZE", "Current TAM calculation"),
            ("02", "DRIVING FORCES", "What is reshaping the market"),
            ("03", "FUTURE IMPACT", "3-year market forecast"),
        ],
        "grid_cols": 3,
    },

    "14-target-segment-deep-dive": {
        "sprint_title": "Sprint 14: Target Segment Deep Dive",
        "description": (
            "Go beyond basic segmentation. Study your chosen target segment in depth — "
            "map their 5 stages of awareness, understand their pains and gains, "
            "interview real customers, and build a precision targeting playbook."
        ),
        "quote": (
            "Customers don't buy products. They hire them to do a job."
        ),
        "quote_attribution": "Clayton Christensen",
        "purpose_quote": "The aim of marketing is to know and understand the customer so well that the product or service fits them and sells itself.",
        "purpose_attribution": "Peter Drucker",
        "purpose_text": (
            "Armed with a target segment from Sprint 13, this tool transforms "
            "surface-level knowledge into deep customer intelligence. "
            "You will emerge with a customer portrait precise enough to write "
            "a message that makes your target say 'you get me.'"
        ),
        "purpose_stat": (
            "Companies that conduct structured customer interviews generate 3x more "
            "conversion-ready messaging than those relying purely on assumptions."
        ),
        "mistakes": [
            "Interviewing only happy customers — talk to churned customers and lost prospects too.",
            "Asking what customers want instead of understanding what job they hire you to do.",
            "Conducting too few interviews — minimum 5 per segment to start spotting patterns.",
            "Skipping the 5 stages of awareness: most messaging fails by targeting the wrong stage.",
        ],
        "journey": [
            ("01", "5 STAGES", "Map awareness levels"),
            ("02", "PAINS & GAINS", "Deep customer insights"),
            ("03", "INTERVIEWS", "Structured customer research"),
            ("04", "PROFILE", "Target segment playbook"),
        ],
        "grid_cols": 4,
    },

    "26-employer-branding": {
        "sprint_title": "Sprint 26: Employer Branding",
        "description": (
            "Build an Employer Value Proposition (EVP) that attracts the right talent "
            "and reduces mis-hires. Your EVP is the authentic promise your company makes "
            "to employees in exchange for their contribution — specific, differentiating, and real."
        ),
        "quote": (
            "Your employer brand is what people say about you as an employer "
            "when you're not in the room."
        ),
        "quote_attribution": "adapted from Jeff Bezos",
        "purpose_quote": "The best talent is not looking for a job. They are looking for a mission.",
        "purpose_attribution": "Fast Track Tools",
        "purpose_text": (
            "Most companies hire by accident and lose talent by design. "
            "A formally articulated EVP turns your culture into a competitive advantage — "
            "attracting candidates who will thrive and naturally repelling those who won't fit, "
            "before they waste your time and theirs."
        ),
        "purpose_stat": (
            "Organisations that formally articulate their EVP reduce mis-hires by 30%, "
            "see 50% more qualified applicants, and cut hiring costs by 43% "
            "(Corporate Leadership Council / LinkedIn Global Talent Trends)."
        ),
        "mistakes": [
            "Building an EVP around salary — compensation is a hygiene factor, not a differentiator.",
            "Making aspirational promises that don't reflect your actual day-to-day culture.",
            "Creating one EVP for all talent segments — different roles value different things.",
            "Skipping the Anti-EVP — knowing who you are NOT for is as powerful as knowing who you are.",
        ],
        "journey": [
            ("01", "SEGMENTATION", "Define your target talent"),
            ("02", "NEEDS RANKING", "Rank the 5 need categories"),
            ("03", "EVP FORMULATION", "Draft your core promise"),
            ("04", "EVP TESTING", "Internal truths + Anti-EVP"),
            ("05", "CAMPAIGNS", "Recruitment messaging"),
        ],
        "grid_cols": 3,
    },

    "27-agile-teams": {
        "sprint_title": "Sprint 27: Agile Teams",
        "description": (
            "Traditional hierarchies kill speed. Identify your biggest bottlenecks "
            "and opportunities, prioritise them using an impact/ease matrix, "
            "and design cross-functional agile team charters to execute fast — "
            "without restructuring your entire organisation."
        ),
        "quote": (
            "In traditional hierarchies, up to 80% of project time is consumed "
            "not by doing work, but by waiting."
        ),
        "quote_attribution": "McKinsey & Company",
        "purpose_quote": "Speed is the new competitive advantage. Agility is how you manufacture it.",
        "purpose_attribution": "Fast Track Tools",
        "purpose_text": (
            "Most organisations have the talent to solve their biggest problems. "
            "What they lack is the structure to deploy it. Agile Teams give you "
            "a replicable system for rapid execution — small squads, clear goals, "
            "fast experiments, and learning in weeks rather than quarters."
        ),
        "purpose_stat": (
            "Companies using cross-functional agile teams complete strategic initiatives "
            "40% faster and at 30% lower cost than those using traditional project structures."
        ),
        "mistakes": [
            "Making the team too large — agile teams work best at 4 to 6 members.",
            "Assigning part-time members who carry full operational loads in parallel.",
            "Skipping the charter definition — teams without clear goals lose focus within 2 weeks.",
            "Treating the impact/ease matrix as a discussion rather than a scored decision tool.",
        ],
        "journey": [
            ("01", "BRAINSTORM", "Problems and opportunities"),
            ("02", "PRIORITIZE", "Impact/ease scoring matrix"),
            ("03", "CHARTERS", "Team structure and KPIs"),
        ],
        "grid_cols": 3,
    },
}

# ══════════════════════════════════════════════════════════════════════════════
#  JSX GENERATOR — produces IntroPage function in exact tool 13 format
# ══════════════════════════════════════════════════════════════════════════════

def generate_intro_jsx(data: dict) -> str:
    """Return the complete IntroPage JSX function as a string."""

    # Build mistake list items
    mistake_items = "\n".join(
        f'                <li className="flex items-start">\n'
        f'                  <span className="text-4xl mr-4">•</span>\n'
        f'                  <span>{m}</span>\n'
        f'                </li>'
        for m in data["mistakes"]
    )

    # Build journey step cards
    step_cards = "\n".join(
        f'                <div className="border-2 border-white p-6">\n'
        f'                  <div className="text-8xl plaak mb-4">{s[0]}</div>\n'
        f'                  <p className="text-xl font-bold mb-2">{s[1]}</p>\n'
        f'                  <p className="text-base text-gray-400">{s[2]}</p>\n'
        f'                </div>'
        for s in data["journey"]
    )

    cols = data.get("grid_cols", min(4, len(data["journey"])))

    # Use TOKEN replacement to avoid f-string brace confusion with JSX
    template = (
        '    function IntroPage({ onNext }) {\n'
        '      return (\n'
        '        <div className="bg-black text-white min-h-screen p-16">\n'
        '          <div className="max-w-5xl mx-auto">\n'
        '            <h1 className="plaak mb-16 animate-in" style={{fontSize: \'100px\'}}>\n'
        '              BEFORE WE START\n'
        '            </h1>\n'
        '\n'
        '            {/* Sprint Info */}\n'
        '            <div className="mb-12 animate-in" style={{animationDelay: \'0.08s\'}}>\n'
        '              <h2 className="plaak text-6xl mb-6" style={{color: \'#FFF469\'}}>SPRINT INFO</h2>\n'
        '              <div className="bg-white text-black p-8">\n'
        '                <p className="text-2xl font-bold mb-4">__SPRINT_TITLE__</p>\n'
        '                <p className="text-xl leading-relaxed mb-4">__DESCRIPTION__</p>\n'
        '                <div className="border-l-4 border-black pl-4 italic text-lg">\n'
        '                  "__QUOTE__"\n'
        '                </div>\n'
        '              </div>\n'
        '            </div>\n'
        '\n'
        '            {/* Purpose */}\n'
        '            <div className="mb-12 animate-in" style={{animationDelay: \'0.1s\'}}>\n'
        '              <h2 className="plaak text-6xl mb-6">PURPOSE</h2>\n'
        '              <div className="border-l-4 border-white pl-6 mb-6">\n'
        '                <p className="text-3xl italic mb-2">"__PURPOSE_QUOTE__"</p>\n'
        '                <p className="text-xl text-gray-400">— __PURPOSE_ATTRIBUTION__</p>\n'
        '              </div>\n'
        '              <p className="text-3xl leading-relaxed mb-4">__PURPOSE_TEXT__</p>\n'
        '              <p className="text-2xl text-gray-400">__PURPOSE_STAT__</p>\n'
        '            </div>\n'
        '\n'
        '            {/* Mistakes to Avoid */}\n'
        '            <div className="mb-12 animate-in" style={{animationDelay: \'0.2s\'}}>\n'
        '              <h2 className="plaak text-6xl mb-6" style={{color: \'#FFF469\'}}>MISTAKES TO AVOID</h2>\n'
        '              <ul className="text-2xl space-y-4">\n'
        '__MISTAKES__\n'
        '              </ul>\n'
        '            </div>\n'
        '\n'
        '            {/* The Journey */}\n'
        '            <div className="mb-16 animate-in" style={{animationDelay: \'0.3s\'}}>\n'
        '              <h2 className="plaak text-6xl mb-8">THE JOURNEY</h2>\n'
        '              <div className="grid grid-cols-__COLS__ gap-6 text-center">\n'
        '__STEPS__\n'
        '              </div>\n'
        '            </div>\n'
        '\n'
        '            <button\n'
        '              onClick={onNext}\n'
        '              className="btn-primary w-full text-3xl py-8 plaak"\n'
        '            >\n'
        "              LET'S START \u2192\n"
        '            </button>\n'
        '          </div>\n'
        '        </div>\n'
        '      );\n'
        '    }\n'
    )

    return (template
        .replace("__SPRINT_TITLE__", data["sprint_title"])
        .replace("__DESCRIPTION__",  data["description"])
        .replace("__QUOTE__",        data["quote"])
        .replace("__PURPOSE_QUOTE__",       data["purpose_quote"])
        .replace("__PURPOSE_ATTRIBUTION__", data["quote_attribution"] if "purpose_attribution" not in data else data.get("purpose_attribution", ""))
        .replace("__PURPOSE_ATTRIBUTION__", data.get("purpose_attribution", data["quote_attribution"]))
        .replace("__PURPOSE_TEXT__",  data["purpose_text"])
        .replace("__PURPOSE_STAT__",  data["purpose_stat"])
        .replace("__MISTAKES__",      mistake_items)
        .replace("__STEPS__",         step_cards)
        .replace("__COLS__",          str(cols))
    )

# ══════════════════════════════════════════════════════════════════════════════
#  BLOCK FINDERS — locate old intro blocks using brace/paren counting
# ══════════════════════════════════════════════════════════════════════════════

def find_block_end(src: str, start_brace_pos: int, open_ch: str = '{', close_ch: str = '}') -> int:
    """
    Starting from the position of an opening brace/paren,
    walk the string counting nesting and return the index
    of the matching closing brace/paren (inclusive).
    """
    depth = 0
    i = start_brace_pos
    in_string_single = False
    in_string_double = False
    in_template = False

    while i < len(src):
        ch = src[i]

        # Simple string tracking (good enough for JSX attribute strings)
        if ch == "'" and not in_string_double and not in_template:
            in_string_single = not in_string_single
        elif ch == '"' and not in_string_single and not in_template:
            in_string_double = not in_string_double
        elif ch == '`' and not in_string_single and not in_string_double:
            in_template = not in_template

        if not in_string_single and not in_string_double and not in_template:
            if ch == open_ch:
                depth += 1
            elif ch == close_ch:
                depth -= 1
                if depth == 0:
                    return i
        i += 1
    return -1  # unmatched


def find_function(src: str, func_name: str):
    """
    Find a function (const X = () => (...) or function X(...) { ... })
    by name. Returns (start_idx, end_idx) of the full definition,
    or (-1, -1) if not found.
    """
    # Try arrow function: const funcName = (...) => (
    arrow_pat = re.compile(
        r'([ \t]*(?:const|let|var)\s+' + re.escape(func_name) + r'\s*=\s*\([^)]*\)\s*=>\s*\()',
        re.MULTILINE
    )
    m = arrow_pat.search(src)
    if m:
        open_paren = src.index('(', m.end() - 1)
        end = find_block_end(src, open_paren, '(', ')')
        if end != -1:
            # Include trailing semicolon/newline
            tail = end + 1
            if tail < len(src) and src[tail] == ';':
                tail += 1
            return m.start(), tail
        return m.start(), -1

    # Try regular function: function funcName(
    func_pat = re.compile(
        r'([ \t]*function\s+' + re.escape(func_name) + r'\s*\([^)]*\)\s*\{)',
        re.MULTILINE
    )
    m = func_pat.search(src)
    if m:
        open_brace = src.rindex('{', m.start(), m.end())
        end = find_block_end(src, open_brace, '{', '}')
        if end != -1:
            return m.start(), end + 1
        return m.start(), -1

    return -1, -1


def find_if_step_block(src: str, step_val: str = "0.5"):
    """
    Find:   if (step === 0.5) {
                return ( ... );
            }
    Returns (start_idx, end_idx) of the whole if-block, or (-1,-1).
    """
    pat = re.compile(
        r'([ \t]*if\s*\(step\s*===\s*' + re.escape(step_val) + r'\)\s*\{)',
        re.MULTILINE
    )
    m = pat.search(src)
    if not m:
        return -1, -1
    open_brace = src.rindex('{', m.start(), m.end())
    end = find_block_end(src, open_brace, '{', '}')
    if end == -1:
        return m.start(), -1
    return m.start(), end + 1


def find_jsx_step_block(src: str, step_val: str = "0.5"):
    """
    Find:   {step === 0.5 && (
                ...
            )}
    Returns (start_idx, end_idx) of the whole JSX block.
    """
    pat = re.compile(
        r'([ \t]*\{step\s*===\s*' + re.escape(step_val) + r'\s*&&\s*\()',
        re.MULTILINE
    )
    m = pat.search(src)
    if not m:
        return -1, -1
    # find opening ( of the && (
    paren_pos = src.rindex('(', m.start(), m.end())
    end_paren = find_block_end(src, paren_pos, '(', ')')
    if end_paren == -1:
        return m.start(), -1
    # include the closing )}
    end_pos = end_paren + 1
    if end_pos < len(src) and src[end_pos] == '}':
        end_pos += 1
    # include trailing newline
    if end_pos < len(src) and src[end_pos] == '\n':
        end_pos += 1
    return m.start(), end_pos


# ══════════════════════════════════════════════════════════════════════════════
#  TOOL-SPECIFIC TRANSFORMERS
# ══════════════════════════════════════════════════════════════════════════════

def find_insert_point_for_intro_function(src: str) -> int:
    """
    Find the line just before the App function (or main render function)
    so we can insert IntroPage there.
    """
    # Look for the App component definition
    for pattern in [
        r'\n    function App\b',
        r'\n    const App\s*=',
        r'\n    function render\b',
    ]:
        m = re.search(pattern, src)
        if m:
            return m.start() + 1  # +1 to keep the leading newline
    return len(src)  # fallback: append at end


def transform_if_return(src: str, tool_key: str, new_jsx: str) -> tuple[str, list]:
    """
    Replaces:  if (step === 0.5) { return (...); }
    With:      {step === 0.5 && <IntroPage onNext={() => setStep(1)} />}
    And adds the IntroPage function before App.
    Works for tools 01, 03, 08.
    """
    changes = []

    # 1. Find and remove the if-return block
    start, end = find_if_step_block(src, "0.5")
    if start == -1:
        return src, [f"[SKIP] Could not find 'if (step === 0.5)' block"]

    # Detect indentation from the found block
    indent = re.match(r'[ \t]*', src[start:]).group()
    replacement_call = f"{indent}if (step === 0.5) {{ return <IntroPage onNext={{() => setStep(1)}} />; }}\n"

    src = src[:start] + replacement_call + src[end:]
    changes.append("Replaced inline if-return step 0.5 block with IntroPage call")

    # 2. Insert IntroPage function before App
    insert_pos = find_insert_point_for_intro_function(src)
    src = src[:insert_pos] + "\n" + new_jsx + "\n" + src[insert_pos:]
    changes.append("Inserted IntroPage function definition before App")

    return src, changes


def transform_inline_jsx(src: str, tool_key: str, new_jsx: str) -> tuple[str, list]:
    """
    Replaces:  {step === 0.5 && ( ... )}
    With:      {step === 0.5 && <IntroPage onNext={() => setStep(1)} />}
    And adds the IntroPage function before App.
    Works for tools 02, 12.
    """
    changes = []

    start, end = find_jsx_step_block(src, "0.5")
    if start == -1:
        return src, [f"[SKIP] Could not find '{{step === 0.5 && (' block"]

    indent = re.match(r'[ \t]*', src[start:]).group()
    replacement_call = f"{indent}{{step === 0.5 && <IntroPage onNext={{() => setStep(1)}} />}}\n"

    src = src[:start] + replacement_call + src[end:]
    changes.append("Replaced inline JSX step 0.5 block with IntroPage call")

    insert_pos = find_insert_point_for_intro_function(src)
    src = src[:insert_pos] + "\n" + new_jsx + "\n" + src[insert_pos:]
    changes.append("Inserted IntroPage function definition before App")

    return src, changes


def transform_render_introduction(src: str, tool_key: str, new_jsx: str) -> tuple[str, list]:
    """
    Replaces the body of renderIntroduction() with new intro content,
    updating the function to accept an onNext parameter from the call site.
    Works for tools 26, 27.
    """
    changes = []

    # Find renderIntroduction function
    start, end = find_function(src, "renderIntroduction")
    if start == -1:
        return src, ["[SKIP] Could not find renderIntroduction function"]

    # Build the new renderIntroduction wrapping the new IntroPage content
    # We keep the function name to avoid changing call sites,
    # but update signature to thread through setStep(1) as onNext
    indent = re.match(r'[ \t]*', src[start:]).group()

    # The new intro function body, wrapped in the same function name
    new_func = (
        f"{indent}const renderIntroduction = () => {{\n"
        f"{indent}  return <IntroPage onNext={{() => setStep(1)}} />;\n"
        f"{indent}}};\n"
    )

    src = src[:start] + new_func + src[end:]
    changes.append("Replaced renderIntroduction body with IntroPage call")

    # Insert IntroPage function definition before the App function
    insert_pos = find_insert_point_for_intro_function(src)
    src = src[:insert_pos] + "\n" + new_jsx + "\n" + src[insert_pos:]
    changes.append("Inserted IntroPage function definition before App")

    return src, changes


def transform_add_intro(src: str, tool_key: str, new_jsx: str) -> tuple[str, list]:
    """
    For tool 14 — adds step 0.5 intro where none existed.
    1. Changes cover page START button from setStep(1) to setStep(0.5)
    2. Adds step 0.5 handler in the render section
    3. Inserts IntroPage function definition
    """
    changes = []

    # 1. Change cover button from setStep(1) to setStep(0.5)
    # Find the cover start button (inside step === 0 block, going to step 1)
    cover_btn_pat = re.compile(
        r'(<button[^>]*onClick=\{[^}]*setStep\(1\)[^}]*\}[^>]*>)\s*(START|BEGIN|LET\'S START)',
        re.DOTALL
    )
    m = cover_btn_pat.search(src)
    if m:
        old_btn = m.group(0)
        new_btn = old_btn.replace('setStep(1)', 'setStep(0.5)')
        if old_btn != new_btn:
            src = src.replace(old_btn, new_btn, 1)
            changes.append("Cover START button now routes to step 0.5 (intro)")
    else:
        # Try simpler pattern
        old_start = "onClick={() => setStep(1)}"
        # Only replace inside a cover/step 0 context
        # Find first occurrence after step === 0 block
        step0_pos = src.find("step === 0")
        if step0_pos != -1:
            search_window = src[step0_pos:step0_pos + 2000]
            if old_start in search_window:
                new_start = "onClick={() => setStep(0.5)}"
                pos = src.find(old_start, step0_pos)
                src = src[:pos] + new_start + src[pos + len(old_start):]
                changes.append("Cover START button now routes to step 0.5 (intro)")

    # 2. Find step === 0 block in render and add step 0.5 handler right after it
    step0_render_pat = re.compile(r'(\{step === 0 &&[^}]*\})', re.DOTALL)
    # Use jsx block finder instead
    start0, end0 = find_jsx_step_block(src, "0")
    if start0 != -1 and end0 != -1:
        # Insert step 0.5 block right after step 0 block
        indent = re.match(r'[ \t]*', src[start0:]).group()
        step05_call = f"\n{indent}{{step === 0.5 && <IntroPage onNext={{() => setStep(1)}} />}}\n"
        src = src[:end0] + step05_call + src[end0:]
        changes.append("Added step 0.5 IntroPage handler in render section")
    else:
        # Fallback: find "if (step === 0)" block
        start0, end0 = find_if_step_block(src, "0")
        if start0 != -1:
            indent = re.match(r'[ \t]*', src[start0:]).group()
            step05_call = f"{indent}if (step === 0.5) {{ return <IntroPage onNext={{() => setStep(1)}} />; }}\n"
            src = src[:end0] + step05_call + src[end0:]
            changes.append("Added step 0.5 IntroPage handler after step 0 block")

    # 3. Insert IntroPage function
    insert_pos = find_insert_point_for_intro_function(src)
    src = src[:insert_pos] + "\n" + new_jsx + "\n" + src[insert_pos:]
    changes.append("Inserted IntroPage function definition before App")

    return src, changes


# ══════════════════════════════════════════════════════════════════════════════
#  ROUTING TABLE — maps tool filename to its transformer function
# ══════════════════════════════════════════════════════════════════════════════

TOOL_TRANSFORMS = {
    # (tool_key, transformer_fn)
    "01-know-thyself":              transform_if_return,
    "02-dream":                     transform_inline_jsx,
    "03-values":                    transform_if_return,
    "08-goals":                     transform_if_return,
    "12-market-size":               transform_inline_jsx,
    "14-target-segment-deep-dive":  transform_add_intro,
    "26-employer-branding":         transform_render_introduction,
    "27-agile-teams":               transform_render_introduction,
}


# ══════════════════════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════════════════════

def process_tool(path: Path) -> bool:
    """Returns True if changes were made or found."""
    name = path.name
    # Derive tool key from filename (strip .html)
    tool_key = name.replace(".html", "")

    if tool_key not in TOOL_TRANSFORMS:
        return False  # Already correct or skipped

    if tool_key not in TOOL_DATA:
        print(f"  {YELLOW}[WARN]{RESET} {name}: tool_key in TRANSFORMS but not in DATA — skipping")
        return False

    data      = TOOL_DATA[tool_key]
    transform = TOOL_TRANSFORMS[tool_key]

    src = path.read_text(encoding="utf-8", errors="replace")
    new_jsx = generate_intro_jsx(data)

    new_src, changes = transform(src, tool_key, new_jsx)

    skipped = all(c.startswith("[SKIP]") for c in changes)
    changed = new_src != src and not skipped

    tag = (
        f"{GREEN}[FIXED]{RESET}" if (APPLY and changed) else
        f"{YELLOW}[DRY]{RESET}"  if changed else
        f"{RED}[SKIP]{RESET}"
    )

    print(f"\n  {tag} {BOLD}{name}{RESET}")
    for c in changes:
        icon = "•" if not c.startswith("[SKIP]") else "!"
        print(f"    {icon} {c}")

    if VERBOSE and changed:
        print(f"\n    --- Generated IntroPage (first 20 lines) ---")
        for i, line in enumerate(new_jsx.splitlines()[:20]):
            print(f"    {line}")
        print("    ...")

    if APPLY and changed:
        if not NO_BACKUP:
            shutil.copy(path, path.with_suffix(".html.bak"))
        path.write_text(new_src, encoding="utf-8")
        stats["files_changed"] += 1
    elif skipped:
        stats["skipped"] += 1

    return changed


def main():
    mode = "APPLY" if APPLY else "DRY-RUN"
    print(f"\n{BOLD}{'='*65}")
    print(f"  Fast Track Tools — Intro Page Normalizer  [{mode}]")
    print(f"  Reference: 13-segmentation-target-market.html")
    print(f"  Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*65}{RESET}")

    if not APPLY:
        print(f"\n  {YELLOW}Dry-run — pass --apply to write changes{RESET}")

    tool_files = sorted(TOOLS_DIR.rglob("*.html"))
    tool_files = [f for f in tool_files if f.name != "TOOL-BLUEPRINT.html"]

    if ONLY_FILE:
        tool_files = [f for f in tool_files if ONLY_FILE in f.name]
        if not tool_files:
            print(f"\n  No files matching --only={ONLY_FILE}")
            sys.exit(1)

    any_change = False
    for path in tool_files:
        changed = process_tool(path)
        if changed:
            any_change = True

    print(f"\n{'='*65}")
    print(f"  SUMMARY")
    if APPLY:
        print(f"  Files modified:  {stats['files_changed']}")
        print(f"  Files skipped:   {stats['skipped']}")
    else:
        if any_change:
            print(f"  {YELLOW}Changes pending — run with --apply to write{RESET}")
        else:
            print(f"  {GREEN}No changes needed{RESET}")
    print(f"{'='*65}\n")

    if APPLY and not NO_BACKUP:
        print(f"  Backups saved as .html.bak alongside each modified file.\n")


if __name__ == "__main__":
    main()
