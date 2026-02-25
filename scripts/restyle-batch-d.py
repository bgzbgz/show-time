#!/usr/bin/env python3
"""
Restyle Batch D tools to WOOP/Dream design system.
Tools: 16-value-proposition-testing, 17-product-development, 18-pricing
"""
import re
import os

BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# The standard WOOP/Dream CSS block
STANDARD_CSS = """    /* === FONT FACES === */
        @font-face { font-family: 'Plaak'; src: url('Plaak3Trial-43-Bold.woff2') format('woff2'); font-weight: bold; font-display: swap; }
        @font-face { font-family: 'Riforma'; src: url('RiformaLL-Regular.woff2') format('woff2'); font-weight: normal; font-display: swap; }
        @font-face { font-family: 'Riforma'; src: url('RiformaLL-Regular.woff2') format('woff2'); font-weight: 600; font-display: swap; }
        @font-face { font-family: 'Monument'; src: url('MonumentGrotesk-Mono.woff2') format('woff2'); font-display: swap; }

        /* === BASE RESET === */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Riforma', -apple-system, sans-serif;
            font-size: 16px;
            color: #000;
            background: #000;
            -webkit-font-smoothing: antialiased;
        }

        /* === CUSTOM SCROLLBAR === */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #000; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #333; }
        * { scrollbar-width: thin; scrollbar-color: #000 transparent; }

        /* === TYPOGRAPHY HELPERS === */
        .plaak { font-family: 'Plaak', sans-serif; font-weight: bold; letter-spacing: -0.01em; line-height: 1.2; }
        .monument { font-family: 'Monument', monospace; letter-spacing: 0.05em; }
        .riforma-bold { font-family: 'Riforma', sans-serif; font-weight: bold; }

        /* === LAYOUT FRAME === */
        .tool-frame { background: #fff; min-height: 100vh; }
        .tool-inner { background: #fff; min-height: 100vh; }

        /* === WIZARD LAYOUT === */
        .wizard-layout { display: flex; min-height: 100vh; }
        .wizard-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background: #fff;
        }
        .wizard-content {
            max-width: 640px;
            width: 100%;
            margin: 0 auto;
            padding: 48px 32px;
            flex: 1;
        }

        /* === SIDEBAR === */
        .wizard-sidebar {
            width: 280px;
            background: #000;
            border-left: 1px solid #000;
            flex-shrink: 0;
            position: sticky;
            top: 0;
            height: 100vh;
            overflow: hidden;
        }
        .wizard-sidebar-inner {
            padding: 32px 24px;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .sidebar-step-item {
            padding: 12px;
            margin-bottom: 8px;
            border-left: 3px solid transparent;
            transition: all 0.2s ease;
        }
        .sidebar-step-item.active { border-left-color: #FFF469; background: #222; }
        .sidebar-step-item.completed { background: #fff; color: #000; border-left-color: #fff; cursor: pointer; }
        .sidebar-step-item.completed:hover { background: #E0E0E0; }
        .sidebar-step-item.locked { opacity: 0.5; }
        .sidebar-step-item .step-num { font-family: 'Riforma', sans-serif; font-size: 14px; }
        .sidebar-step-item .step-name { font-family: 'Riforma', sans-serif; font-size: 14px; }
        .sidebar-snippet { font-size: 12px; margin-top: 4px; opacity: 0.7; line-height: 1.3; }

        /* === STEP HEADER === */
        .step-indicator {
            font-family: 'Monument', monospace;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6B7280;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .step-time { font-family: 'Monument', monospace; font-size: 11px; color: #6B7280; }
        .step-heading {
            font-family: 'Plaak', sans-serif;
            font-weight: bold;
            font-size: 32px;
            text-transform: uppercase;
            letter-spacing: -0.01em;
            line-height: 1.2;
            color: #000;
            margin-bottom: 6px;
        }
        .step-hint {
            font-size: 16px;
            color: #6B7280;
            line-height: 1.5;
            margin: 0 0 32px 0;
        }

        /* === FORM ELEMENTS === */
        .ft-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: 'Monument', monospace;
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #000;
            margin-bottom: 8px;
        }
        .ft-required { color: #DC2626; font-weight: 700; }

        .ft-input {
            width: 100%;
            height: 44px;
            padding: 8px 16px;
            font-family: 'Riforma', sans-serif;
            font-size: 16px;
            color: #000;
            background: #fff;
            border: 1px solid #E5E7EB;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .ft-input:focus {
            outline: none;
            border-color: #000;
            box-shadow: 0 0 0 3px #FFF469;
        }
        .ft-input.has-error { border: 2px solid #DC2626; padding-right: 40px; }
        .ft-input.has-error:focus { border-color: #DC2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2); }

        .ft-textarea {
            width: 100%;
            min-height: 120px;
            padding: 12px 16px;
            font-family: 'Riforma', sans-serif;
            font-size: 16px;
            color: #000;
            background: #fff;
            border: 1px solid #E5E7EB;
            resize: vertical;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .ft-textarea:focus {
            outline: none;
            border-color: #000;
            box-shadow: 0 0 0 3px #FFF469;
        }
        .ft-textarea.has-error { border: 2px solid #DC2626; }
        .ft-textarea.has-error:focus { border-color: #DC2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2); }

        .ft-help { font-size: 14px; color: #6B7280; margin-top: 4px; line-height: 1.5; }
        .ft-error-msg { font-size: 14px; font-weight: 600; color: #DC2626; margin-top: 4px; line-height: 1.4; }
        .ft-field-group { margin-bottom: 24px; }
        .ft-field-group:last-child { margin-bottom: 0; }
        .ft-section { margin-bottom: 32px; }

        /* === YELLOW INSIGHT BOX === */
        .ft-insight {
            background: #FFF469;
            border: 3px solid #000;
            padding: 16px;
            margin-bottom: 32px;
        }

        /* === EXAMPLE BOX === */
        .ft-example {
            background: #F3F4F6;
            padding: 16px;
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.6;
            color: #1F2937;
        }

        /* === ERROR SUMMARY === */
        .ft-error-summary {
            border: 2px solid #DC2626;
            background: #fff;
            padding: 16px;
            margin-bottom: 24px;
        }
        .ft-error-summary a { color: #DC2626; text-decoration: underline; cursor: pointer; }
        .ft-error-summary a:hover { text-decoration: none; }

        /* === BUTTON FOOTER === */
        .btn-footer {
            position: sticky;
            bottom: 0;
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 32px;
            border-top: 1px solid #E5E7EB;
            background: #fff;
            width: 100%;
        }
        .btn-back {
            background: #fff;
            color: #000;
            border: 2px solid #000;
            padding: 12px 24px;
            font-family: 'Riforma', sans-serif;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            min-height: 44px;
        }
        .btn-back:hover { background: #F3F4F6; }
        .btn-next {
            background: #000;
            color: #fff;
            border: 2px solid #000;
            padding: 12px 24px;
            font-family: 'Riforma', sans-serif;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            min-height: 44px;
        }
        .btn-next:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .btn-next:disabled { background: #E5E7EB; color: #9CA3AF; border-color: #E5E7EB; cursor: not-allowed; }

        /* === CLOSING MESSAGE === */
        .closing-box {
            border-top: 1px solid #E5E7EB;
            padding: 20px 0 0 0;
            margin-top: 8px;
            text-align: center;
        }
        .closing-box p { font-size: 14px; color: #6B7280; }
        .closing-box .closing-title {
            font-family: 'Monument', monospace;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #000;
            margin-bottom: 6px;
        }

        /* === MOBILE STEP BAR === */
        .mobile-step-bar { display: none; padding: 12px 16px; border-bottom: 1px solid #E5E7EB; background: #F3F4F6; }
        .mobile-step-bar .bar-text { font-family: 'Monument', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B7280; margin-bottom: 6px; }
        .mobile-progress { height: 3px; background: #E5E7EB; width: 100%; }
        .mobile-progress-fill { height: 100%; background: #000; transition: width 0.3s ease; }

        /* === CANVAS STYLES === */
        .numbered-section { background: #000; color: #fff; padding: 8px 14px; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; display: inline-block; font-family: 'Monument', monospace; }
        .canvas-section-box { border: 2px solid #000; background: #FAFAFA; padding: 16px; margin-bottom: 16px; }

        /* === ANIMATIONS === */
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-in { animation: fadeSlideIn 0.3s ease-out; }

        /* === PRINT === */
        @media print { .no-print { display: none !important; } }

        /* === RESPONSIVE === */
        @media (min-width: 769px) and (max-width: 1024px) {
            .wizard-sidebar { width: 220px; }
            .wizard-sidebar-inner { padding: 24px 16px; }
        }
        @media (max-width: 768px) {
            .wizard-sidebar { display: none; }
            .mobile-step-bar { display: block; }
            .wizard-content { padding: 24px 16px; }
            .step-heading { font-size: 24px; }
            .btn-footer { padding: 12px 16px; }
        }
        @media (max-width: 480px) {
            .step-heading { font-size: 20px; }
            .wizard-content { padding: 20px 12px; }
        }"""


def replace_style_block(html, tool_specific_css=""):
    """Replace the entire <style>...</style> block with standard CSS + tool-specific CSS."""
    pattern = r'<style>.*?</style>'
    new_style = f"<style>\n{STANDARD_CSS}"
    if tool_specific_css:
        new_style += f"\n\n        /* === TOOL-SPECIFIC STYLES === */\n{tool_specific_css}"
    new_style += "\n    </style>"
    return re.sub(pattern, new_style, html, count=1, flags=re.DOTALL)


def add_font_preload(html):
    """Add font preload links if missing."""
    if 'rel="preload"' in html:
        return html
    preload = """    <!-- Font preloading to prevent FOUT -->
    <link rel="preload" href="Plaak3Trial-43-Bold.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="RiformaLL-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="MonumentGrotesk-Mono.woff2" as="font" type="font/woff2" crossorigin>

"""
    return html.replace('<style>', preload + '    <style>')


def process_tool16():
    """Process 16-value-proposition-testing.html"""
    path = os.path.join(BASE, 'frontend', 'tools', 'module-4-strategy-development', '16-value-proposition-testing.html')
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Tool-specific CSS
    tool_css = """        /* Character Counter */
        .char-counter { font-size: 14px; color: #666; margin-top: 4px; }
        .char-counter.invalid { color: #EF4444; }"""

    # Step 1: Replace style block
    html = replace_style_block(html, tool_css)
    html = add_font_preload(html)

    # Step 2: Remove old ProgressIndicator component and all references
    # Remove ProgressIndicator function definition
    html = re.sub(r'\n\s*// Progress Indicator Component.*?(?=\n\s*// |\n\s*function [A-Z]|\n\s*// Render)', '', html, flags=re.DOTALL)
    # Remove HelpButton component definition
    html = re.sub(r'\n\s*// Help Button Component.*?(?=\n\s*// Render)', '', html, flags=re.DOTALL)
    # Remove HelpModal component
    html = re.sub(r'\n\s*// Help Modal Component.*?(?=\n\s*// Progress Indicator)', '', html, flags=re.DOTALL)

    # Remove ProgressIndicator calls
    html = html.replace('<ProgressIndicator currentStep={1} />', '')
    html = html.replace('<ProgressIndicator currentStep={2} />', '')
    html = html.replace('<ProgressIndicator currentStep={3} />', '')
    html = html.replace('<ProgressIndicator currentStep={4} />', '')
    html = html.replace('<ProgressIndicator currentStep={5} />', '')

    # Remove HelpButton calls
    html = re.sub(r'\s*<HelpButton onClick=\{[^}]+\} />\n?', '', html)

    # Remove help modal renders
    html = re.sub(r'\s*\{showHelp && <HelpModal[^/]*/>\}', '', html)

    # Remove showHelp state and setShowHelp references from function params
    html = html.replace(', setShowHelp', '')
    html = html.replace('setShowHelp={setShowHelp}', '')

    # Add shared components after DependencyContext
    shared_components = """
    /* ============================================================
       SHARED COMPONENTS (WOOP/Dream design system)
       ============================================================ */

    function CheckIcon({ color = "#fff", size = 16 }) {
        return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
    }

    function ButtonFooter({ onBack, onNext, nextLabel = 'Next', showBack = true, disabled = false }) {
        return (
            <div className="btn-footer no-print">
                {showBack ? <button className="btn-back" onClick={onBack}>&larr; Back</button> : <div />}
                <button className="btn-next" disabled={disabled} onClick={onNext}>{nextLabel} &rarr;</button>
            </div>
        );
    }

    function MobileStepBar({ currentStep, totalSteps }) {
        const total = totalSteps || 5;
        const progress = currentStep >= 999 ? 100 : Math.round((currentStep / total) * 100);
        return (
            <div className="mobile-step-bar no-print">
                <div className="bar-text">Step {Math.min(currentStep, total)} of {total}</div>
                <div className="mobile-progress"><div className="mobile-progress-fill" style={{ width: progress + '%' }} /></div>
            </div>
        );
    }

    function CoachFeedbackPanel() {
        const [expanded, setExpanded] = useState(false);
        const [feedback, setFeedback] = useState(null);
        useEffect(() => {
            const check = () => { if (window.AIChallenge && window.AIChallenge.getLastFeedback) { setFeedback(window.AIChallenge.getLastFeedback()); } };
            check();
            const interval = setInterval(check, 2000);
            return () => clearInterval(interval);
        }, []);
        if (!feedback) return null;
        return (
            <div style={{ marginTop: 24, borderTop: '1px solid #333', paddingTop: 16 }}>
                <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: '#FFF469', cursor: 'pointer', fontFamily: "'Monument', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6, padding: 0, width: '100%' }}>
                    <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>&#9654;</span> COACH FEEDBACK
                </button>
                {expanded && (
                    <div style={{ marginTop: 10, fontSize: 12, color: '#ccc', lineHeight: 1.5 }}>
                        {feedback.type === 'approved' && <p style={{ color: '#FFF469' }}>{feedback.message}</p>}
                        {feedback.type === 'challenges' && (<>
                            {feedback.encouragement && <p style={{ color: '#FFF469', marginBottom: 8 }}>{feedback.encouragement}</p>}
                            {feedback.challenges && feedback.challenges.map((ch, i) => (
                                <div key={i} style={{ marginBottom: 8, paddingLeft: 8, borderLeft: '2px solid #555' }}>
                                    <div style={{ fontSize: 10, color: '#999', marginBottom: 2 }}>{ch.question_text || ch.question_key}</div>
                                    <div>{ch.feedback}</div>
                                </div>
                            ))}
                        </>)}
                    </div>
                )}
            </div>
        );
    }

    /* VP-style transition content between steps */
    const TRANSITION_CONTENT = {
        1: {
            title: 'SETUP COMPLETE.',
            text: "Your testing plan is ready. Now it's time to hear what real customers think.",
            brutalTruth: "80% of failed product launches trace back to untested assumptions. You've just defined what you're testing and who you're testing with. Most teams skip this step and waste months on unfocused customer conversations that yield nothing actionable.",
            peerProof: "Research by Osterwalder et al. (2014) found that companies using structured customer testing processes are 48% more likely to achieve product-market fit within the first year."
        },
        2: {
            title: 'ROUND 1 DONE.',
            text: "You've gathered raw customer reactions. Now find the patterns.",
            brutalTruth: "One customer's opinion is noise. Three saying the same thing is a pattern. Five confirming it is a fact. The words customers used to describe your value proposition are worth more than anything your marketing team writes internally.",
            peerProof: "Rob Fitzpatrick's 'The Mom Test' research shows that questions about past actions predict future behavior 3x better than hypothetical questions. Teams documenting reactions immediately retain 40% more actionable detail."
        },
        3: {
            title: 'MESSAGE REFINED.',
            text: "Your value proposition has been sharpened by real feedback. Time to validate the fix.",
            brutalTruth: "Stanford GSB research found that value propositions refined through evidence-based iteration outperform the original by 3.2x in conversion. The key: change only what feedback demands. Teams that over-revised actually performed worse.",
            peerProof: "Tversky and Kahneman's anchoring research confirms that justifying each change with specific evidence prevents the 'kitchen sink' reflex of adding too much."
        },
        4: {
            title: 'VALIDATION COMPLETE.',
            text: "Two rounds of testing are done. Time to lock it in and execute.",
            brutalTruth: "After two rounds, the evidence is in. The biggest risk now isn't an imperfect message -- it's endless tweaking that delays execution. Your validated value proposition becomes the core message across marketing, sales, and product.",
            peerProof: "Bain & Company's research found that companies with a single, validated value proposition used consistently across all channels achieve 31% higher revenue growth."
        },
        5: {
            title: 'STRATEGY LOCKED.',
            text: "Your value proposition is tested, refined, and ready for rollout.",
            brutalTruth: "A great value proposition isn't debated forever -- it's tested, refined, and executed. Lock it in with conviction. Every department must speak it consistently.",
            peerProof: "McKinsey's 'Decision-Making at Speed' framework shows that teams using validation checklists before committing reduce post-launch pivots by 55%."
        }
    };

"""

    # Insert shared components before "// Main App Component"
    html = html.replace('    // Main App Component\n    function TestingApp()', shared_components + '    // Main App Component\n    function TestingApp()')

    # Now restructure the main render logic
    # Replace the old CoverPage with WOOP-style
    old_cover = """    // Cover Page Component
    function CoverPage({ onStart }) {
      return (
        <div className="relative min-h-screen flex items-center justify-center bg-black">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.85))'}}></div>

          <div className="relative z-10 text-center text-white px-8 max-w-5xl mx-auto">
            <h1 className="plaak animate-in" style={{fontSize: '100px', lineHeight: '1', marginBottom: '32px'}}>
              VALUE PROPOSITION TESTING
            </h1>
            <p className="text-4xl mb-12 animate-in" style={{animationDelay: '0.2s'}}>
              Turn customer feedback into a bulletproof message
            </p>
            <button
              onClick={onStart}
              className="bg-white text-black plaak px-16 py-6 border-4 border-white hover:bg-black hover:text-white transition-all text-3xl animate-in"
              style={{animationDelay: '0.4s'}}
            >
              START
            </button>
          </div>
        </div>
      );
    }"""

    new_cover = """    // Cover Page Component (WOOP design system)
    function CoverPage({ onStart }) {
      return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(cover.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }} />
          <div style={{ position: 'relative', textAlign: 'center', color: '#fff', padding: '0 32px' }} className="animate-in">
            <div className="monument" style={{ fontSize: 12, color: '#FFF469', letterSpacing: '0.1em', marginBottom: 16 }}>SPRINT 16</div>
            <h1 className="plaak" style={{ fontSize: 80, marginBottom: 16, textTransform: 'uppercase' }}>VALUE PROPOSITION TESTING</h1>
            <p style={{ fontSize: 18, color: '#ccc', marginBottom: 48 }}>Turn customer feedback into a bulletproof message</p>
            <button onClick={onStart}
              style={{ background: '#fff', color: '#000', border: 'none', padding: '16px 48px', fontSize: 16, fontFamily: "'Monument', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease', minHeight: 44 }}
              onMouseOver={e => { e.target.style.background = '#FFF469'; }}
              onMouseOut={e => { e.target.style.background = '#fff'; }}
            >START</button>
          </div>
        </div>
      );
    }"""
    html = html.replace(old_cover, new_cover)

    # Replace old TransitionScreen with Dream-style
    old_transition = """    // Transition Screen Component
    function TransitionScreen({ message, progress }) {
      return (
        <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50 fade-in">
          <div className="text-center px-8">
            <h1 className="plaak transition-animate-in" style={{fontSize: '120px', marginBottom: '32px'}}>
              SECTION COMPLETE
            </h1>

            <div className="max-w-2xl mx-auto mb-8 transition-animate-in" style={{animationDelay: '0.2s'}}>
              <div className="h-2 bg-gray-800 mb-4">
                <div
                  className="h-full bg-white transition-all duration-1000"
                  style={{width: `${progress}%`}}
                ></div>
              </div>
              <p className="monument text-xl tracking-wider">{message}</p>
            </div>
          </div>
        </div>
      );
    }"""

    new_transition = """    // Transition Screen Component (Dream design system)
    function TransitionScreen({ completedStep, totalSteps, onContinue }) {
      const t = TRANSITION_CONTENT[completedStep];
      if (!t) return null;
      return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: 640, padding: '0 32px', textAlign: 'center', color: '#fff' }} className="animate-in">
            <div className="monument" style={{ fontSize: 12, color: '#FFF469', letterSpacing: '0.1em', marginBottom: 16 }}>
              STEP {completedStep} OF {totalSteps} COMPLETE
            </div>
            <h1 className="plaak" style={{ fontSize: 48, marginBottom: 12 }}>{t.title}</h1>
            <p style={{ fontSize: 16, color: '#ccc', marginBottom: 48 }}>{t.text}</p>
            <div style={{ background: '#111', border: '1px solid #333', borderLeft: '4px solid #FFF469', padding: '20px 24px', marginBottom: 24, textAlign: 'left' }}>
              <span className="monument" style={{ fontSize: 10, color: '#FFF469', display: 'block', marginBottom: 8 }}>BRUTAL TRUTH</span>
              <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.7 }}>{t.brutalTruth}</p>
            </div>
            <div style={{ background: '#111', border: '1px solid #333', borderLeft: '4px solid #666', padding: '20px 24px', marginBottom: 48, textAlign: 'left' }}>
              <span className="monument" style={{ fontSize: 10, color: '#999', display: 'block', marginBottom: 8 }}>PEER PROOF</span>
              <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.7, fontStyle: 'italic' }}>{t.peerProof}</p>
            </div>
            <button onClick={onContinue}
              style={{ background: '#fff', color: '#000', border: 'none', padding: '16px 48px', fontSize: 16, fontFamily: "'Monument', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseOver={e => { e.target.style.background = '#FFF469'; }}
              onMouseOut={e => { e.target.style.background = '#fff'; }}
            >CONTINUE</button>
          </div>
        </div>
      );
    }"""
    html = html.replace(old_transition, new_transition)

    # Replace the doTransition function to use step-based transitions instead of timed
    old_do_transition = """      const doTransition = (nextStep) => {
        if (step >= 1 && step <= 5) {
          const messages = ['20% COMPLETE', '40% COMPLETE', '60% COMPLETE', '80% COMPLETE', '100% COMPLETE'];
          const progressValues = [20, 40, 60, 80, 100];
          const idx = Math.min(step - 1, 4);
          setTransitionMessage(step === 5 ? '100% COMPLETE' : messages[idx]);
          setTransitionProgress(step === 5 ? 100 : progressValues[idx]);
          setShowTransition(true);
          setTimeout(() => {
            setShowTransition(false);
            setStep(nextStep);
          }, 2000);
        } else {
          setStep(nextStep);
        }
      };"""
    new_do_transition = """      const doTransition = (nextStep) => {
        if (step >= 1 && step <= 5) {
          // Use .5 step for transition screens (Dream pattern)
          setStep(step + 0.5);
        } else {
          setStep(nextStep);
        }
      };"""
    html = html.replace(old_do_transition, new_do_transition)

    # Now we need to add a WizardSidebar for this tool
    wizard_sidebar = """
    function WizardSidebar({ currentStep, data, onNavigate }) {
        const steps = [
            { num: 1, label: 'Setup', time: '~5 min' },
            { num: 2, label: 'Round 1', time: '~10 min' },
            { num: 3, label: 'Refine', time: '~8 min' },
            { num: 4, label: 'Round 2', time: '~10 min' },
            { num: 5, label: 'Decide', time: '~5 min' }
        ];
        const getSnippet = (n) => {
            if (n === 1 && data.valuePropBeingTested) return '"' + data.valuePropBeingTested.substring(0, 50) + (data.valuePropBeingTested.length > 50 ? '...' : '') + '"';
            if (n === 2 && data.round1Interviews[0]?.customerName) return data.round1Interviews.length + ' interview' + (data.round1Interviews.length !== 1 ? 's' : '') + ' recorded';
            if (n === 3 && data.refinedValueProp) return 'VP refined based on patterns';
            if (n === 4 && data.round2Interviews[0]?.customerName) return data.round2Interviews.length + ' validation interview' + (data.round2Interviews.length !== 1 ? 's' : '');
            if (n === 5 && data.finalValueProp) return 'VP locked in';
            return null;
        };
        return (
            <div className="wizard-sidebar no-print">
                <div className="wizard-sidebar-inner">
                    <div style={{ marginBottom: 24 }}>
                        <div className="monument" style={{ fontSize: 12, textTransform: 'uppercase', color: '#fff', marginBottom: 4 }}>VP TESTING</div>
                        <div style={{ fontSize: 13, color: '#999' }}>~38 min total</div>
                    </div>
                    <div style={{ marginBottom: 16, fontFamily: "'Monument', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Your journey</div>
                    {steps.map(s => {
                        const effectiveStep = Math.ceil(currentStep);
                        const isCompleted = effectiveStep > s.num, isActive = effectiveStep === s.num, isLocked = effectiveStep < s.num;
                        const snippet = isCompleted ? getSnippet(s.num) : null;
                        return (
                            <div key={s.num} className={'sidebar-step-item ' + (isCompleted ? 'completed' : '') + ' ' + (isActive ? 'active' : '') + ' ' + (isLocked ? 'locked' : '')}
                                onClick={() => isCompleted && onNavigate && onNavigate(s.num)}
                                title={isCompleted ? 'Click to review this step' : ''}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {isCompleted ? <CheckIcon color="#000" size={14} /> : <span className="step-num" style={{ color: isActive ? '#fff' : '#ccc' }}>{String(s.num).padStart(2, '0')}</span>}
                                    <span className="step-name" style={{ color: isLocked ? '#666' : isCompleted ? '#000' : '#fff' }}>{s.label}</span>
                                </div>
                                {snippet && <div className="sidebar-snippet">{snippet}</div>}
                            </div>
                        );
                    })}
                    <CoachFeedbackPanel />
                </div>
            </div>
        );
    }

"""
    # Insert WizardSidebar before "// Main App Component"
    html = html.replace('    // Main App Component\n    function TestingApp()', wizard_sidebar + '    // Main App Component\n    function TestingApp()')

    # Now restructure the main render of TestingApp
    # The old render returns different full-page components for each step
    # We need to wrap steps 1-5 in wizard-layout
    # Replace the render section
    old_render = """      // Render different pages based on step
      if (showTransition) {
        return <TransitionScreen message={transitionMessage} progress={transitionProgress} />;
      }

      if (step === 0) {
        return <CoverPage onStart={goNext} />;
      }

      if (step === 0.5) {
        return <IntroPage data={data} updateData={updateData} onNext={goNext} canProceed={canProceedFromIntro()} />;
      }

      if (step === 1) {
        return (
          <Fragment>
            <DependencyContext deps={deps} />
            <Step1Page
              data={data}
              updateData={updateData}
              onNext={goNext}
              onBack={goBack}
              canProceed={canProceedFromStep1()}
              aiReviewing={aiReviewing}
            />
          </Fragment>
        );
      }

      if (step === 2) {
        return (
          <Fragment>
            <Step2Page
              data={data}
              updateData={updateData}
              onNext={goNext}
              onBack={goBack}
              canProceed={canProceedFromStep2()}
              addRound1Interview={addRound1Interview}
              removeRound1Interview={removeRound1Interview}
              updateRound1Interview={updateRound1Interview}
              aiReviewing={aiReviewing}
            />
          </Fragment>
        );
      }

      if (step === 3) {
        return (
          <Fragment>
            <Step3Page
              data={data}
              updateData={updateData}
              onNext={goNext}
              onBack={goBack}
              canProceed={canProceedFromStep3()}
              aiReviewing={aiReviewing}
            />
          </Fragment>
        );
      }

      if (step === 4) {
        return (
          <Fragment>
            <Step4Page
              data={data}
              updateData={updateData}
              onNext={goNext}
              onBack={goBack}
              canProceed={canProceedFromStep4()}
              addRound2Interview={addRound2Interview}
              removeRound2Interview={removeRound2Interview}
              updateRound2Interview={updateRound2Interview}
              aiReviewing={aiReviewing}
            />
          </Fragment>
        );
      }

      if (step === 5) {
        return (
          <Fragment>
            <Step5Page
              data={data}
              updateData={updateData}
              updateValidation={updateValidation}
              onNext={goNext}
              onBack={goBack}
              canProceed={canProceedFromStep5()}
              aiReviewing={aiReviewing}
            />
          </Fragment>
        );
      }

      if (step === 6) {
        return (
          <CanvasPage
            data={data}
            onBack={goBack}
            onExport={exportPDF}
            onSubmit={handleSubmit}
          />
        );
      }

      return null;"""

    new_render = """      // Render different pages based on step
      if (step === 0) {
        return <CoverPage onStart={goNext} />;
      }

      if (step === 0.5) {
        return <IntroPage data={data} updateData={updateData} onNext={goNext} canProceed={canProceedFromIntro()} />;
      }

      // Transition screens (step X.5)
      if ([1.5, 2.5, 3.5, 4.5, 5.5].includes(step)) {
        const completedStep = Math.floor(step);
        const nextStep = completedStep === 5 ? 6 : completedStep + 1;
        return <TransitionScreen completedStep={completedStep} totalSteps={5} onContinue={() => setStep(nextStep)} />;
      }

      // Canvas
      if (step === 6) {
        return <CanvasPage data={data} onBack={goBack} onExport={exportPDF} onSubmit={handleSubmit} />;
      }

      // Steps 1-5: Wizard layout
      const currentStepInt = Math.ceil(step);
      return (
        <div className="tool-frame">
          <div className="tool-inner">
            <div className="wizard-layout">
              <div className="wizard-main">
                <MobileStepBar currentStep={currentStepInt} totalSteps={5} />
                <div className="wizard-content animate-in">
                  {step === 1 && <><DependencyContext deps={deps} /><Step1Page data={data} updateData={updateData} /></>}
                  {step === 2 && <Step2Page data={data} updateData={updateData} addRound1Interview={addRound1Interview} removeRound1Interview={removeRound1Interview} updateRound1Interview={updateRound1Interview} />}
                  {step === 3 && <Step3Page data={data} updateData={updateData} />}
                  {step === 4 && <Step4Page data={data} updateData={updateData} addRound2Interview={addRound2Interview} removeRound2Interview={removeRound2Interview} updateRound2Interview={updateRound2Interview} />}
                  {step === 5 && <Step5Page data={data} updateData={updateData} updateValidation={updateValidation} />}
                </div>
                <ButtonFooter
                  onBack={goBack}
                  onNext={goNext}
                  disabled={aiReviewing || (step === 1 && !canProceedFromStep1()) || (step === 2 && !canProceedFromStep2()) || (step === 3 && !canProceedFromStep3()) || (step === 4 && !canProceedFromStep4()) || (step === 5 && !canProceedFromStep5())}
                  nextLabel={aiReviewing ? 'AI Coach Reviewing...' : step === 5 ? 'View Summary' : 'Next'}
                  showBack={true}
                />
              </div>
              <WizardSidebar currentStep={step} data={data} onNavigate={setStep} />
            </div>
          </div>
        </div>
      );"""
    html = html.replace(old_render, new_render)

    # Now remove the old step page wrapper divs and button footers from individual step components
    # Step pages should just return content, not full-page wrappers
    # Replace step page signatures to remove onNext/onBack/canProceed/aiReviewing params
    # and remove the outer wrapper divs and button footers

    # For each step page, strip the outer <div className="bg-white min-h-screen p-16 pb-32"> and its navigation buttons
    for i in range(1, 6):
        # Remove the outer wrapper divs - keep just inner content
        html = re.sub(
            rf'(function Step{i}Page\([^)]*\))\s*\{{\s*return\s*\(\s*<div className="bg-white min-h-screen p-16 pb-32">\s*<div className="max-w-[56]xl mx-auto">',
            rf'\1 {{\n      return (\n        <>',
            html
        )

    # Remove closing wrapper divs and old nav buttons for each step
    # This is tricky with regex. Let's handle it more carefully by removing btn-primary/btn-secondary nav patterns
    # Remove the navigation button blocks from each step
    html = re.sub(r'\s*<div className="flex gap-6">\s*<button onClick=\{onBack\}[^<]*<\/button>\s*<button\s*onClick=\{onNext\}[^<]*<\/button>\s*<\/div>', '', html)
    html = re.sub(r'\s*<div className="flex gap-6 mt-12">\s*<button onClick=\{onBack\}[^<]*<\/button>\s*<button\s*onClick=\{onNext\}[^<]*<\/button>\s*<\/div>', '', html)

    # Clean up closing </div></div> for the wrapper
    # Replace double closing </div> at end of step components with </>
    html = re.sub(r'(\s*</div>\s*</div>\s*)\);\s*\}(\s*\n\s*// Step)', r'\n        </>\n      );\n    }\2', html)

    # Remove showTransition state and related
    html = html.replace("      const [showTransition, setShowTransition] = useState(false);\n", "")
    html = html.replace("      const [transitionMessage, setTransitionMessage] = useState('');\n", "")
    html = html.replace("      const [transitionProgress, setTransitionProgress] = useState(0);\n", "")

    # Write the file
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Processed: {path}")


def process_tool(tool_path, tool_name, tool_slug, sidebar_steps, sidebar_label, sidebar_time, transition_content, cover_title, cover_subtitle, cover_sprint, app_func_name, steps_count=5, canvas_step=6):
    """Generic processor for tools 17 and 18."""
    with open(tool_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Tool-specific CSS
    tool_css = """        /* Character Counter */
        .char-counter { font-size: 14px; color: #666; margin-top: 4px; }
        .char-counter.invalid { color: #EF4444; }"""

    # Step 1: Replace style block
    html = replace_style_block(html, tool_css)
    html = add_font_preload(html)

    # Remove old ProgressIndicator + HelpButton
    html = re.sub(r'\n\s*// Progress Indicator\n.*?(?=\n\s*// Help Button|\n\s*// Render)', '', html, flags=re.DOTALL)
    html = re.sub(r'\n\s*// Help Button\n.*?(?=\n\s*// Render)', '', html, flags=re.DOTALL)

    # Remove ProgressIndicator calls
    for i in range(1, 6):
        html = html.replace(f'<ProgressIndicator currentStep={{{i}}} />', '')
    html = re.sub(r'\s*<HelpButton onClick=\{[^}]+\} />\n?', '', html)

    # Remove setShowHelp references
    html = html.replace(', setShowHelp', '')
    html = html.replace('setShowHelp={setShowHelp}', '')

    # Add shared components before main app
    shared_comps = f"""
    /* ============================================================
       SHARED COMPONENTS (WOOP/Dream design system)
       ============================================================ */

    function CheckIcon({{ color = "#fff", size = 16 }}) {{
        return <svg width={{size}} height={{size}} viewBox="0 0 24 24" fill={{color}}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
    }}

    function ButtonFooter({{ onBack, onNext, nextLabel = 'Next', showBack = true, disabled = false }}) {{
        return (
            <div className="btn-footer no-print">
                {{showBack ? <button className="btn-back" onClick={{onBack}}>&larr; Back</button> : <div />}}
                <button className="btn-next" disabled={{disabled}} onClick={{onNext}}>{{nextLabel}} &rarr;</button>
            </div>
        );
    }}

    function MobileStepBar({{ currentStep, totalSteps }}) {{
        const total = totalSteps || {steps_count};
        const progress = currentStep >= 999 ? 100 : Math.round((currentStep / total) * 100);
        return (
            <div className="mobile-step-bar no-print">
                <div className="bar-text">Step {{Math.min(currentStep, total)}} of {{total}}</div>
                <div className="mobile-progress"><div className="mobile-progress-fill" style={{{{ width: progress + '%' }}}} /></div>
            </div>
        );
    }}

    function CoachFeedbackPanel() {{
        const [expanded, setExpanded] = useState(false);
        const [feedback, setFeedback] = useState(null);
        useEffect(() => {{
            const check = () => {{ if (window.AIChallenge && window.AIChallenge.getLastFeedback) {{ setFeedback(window.AIChallenge.getLastFeedback()); }} }};
            check();
            const interval = setInterval(check, 2000);
            return () => clearInterval(interval);
        }}, []);
        if (!feedback) return null;
        return (
            <div style={{{{ marginTop: 24, borderTop: '1px solid #333', paddingTop: 16 }}}}>
                <button onClick={{() => setExpanded(!expanded)}} style={{{{ background: 'none', border: 'none', color: '#FFF469', cursor: 'pointer', fontFamily: "'Monument', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6, padding: 0, width: '100%' }}}}>
                    <span style={{{{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}}}>&#9654;</span> COACH FEEDBACK
                </button>
                {{expanded && (
                    <div style={{{{ marginTop: 10, fontSize: 12, color: '#ccc', lineHeight: 1.5 }}}}>
                        {{feedback.type === 'approved' && <p style={{{{ color: '#FFF469' }}}}>{{feedback.message}}</p>}}
                        {{feedback.type === 'challenges' && (<>
                            {{feedback.encouragement && <p style={{{{ color: '#FFF469', marginBottom: 8 }}}}>{{feedback.encouragement}}</p>}}
                            {{feedback.challenges && feedback.challenges.map((ch, i) => (
                                <div key={{i}} style={{{{ marginBottom: 8, paddingLeft: 8, borderLeft: '2px solid #555' }}}}>
                                    <div style={{{{ fontSize: 10, color: '#999', marginBottom: 2 }}}}>{{ch.question_text || ch.question_key}}</div>
                                    <div>{{ch.feedback}}</div>
                                </div>
                            ))}}
                        </>)}}
                    </div>
                )}}
            </div>
        );
    }}

    const TRANSITION_CONTENT = {transition_content};

    function TransitionScreen({{ completedStep, totalSteps, onContinue }}) {{
        const t = TRANSITION_CONTENT[completedStep];
        if (!t) return null;
        return (
            <div style={{{{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}}}>
                <div style={{{{ maxWidth: 640, padding: '0 32px', textAlign: 'center', color: '#fff' }}}} className="animate-in">
                    <div className="monument" style={{{{ fontSize: 12, color: '#FFF469', letterSpacing: '0.1em', marginBottom: 16 }}}}>
                        STEP {{completedStep}} OF {{totalSteps}} COMPLETE
                    </div>
                    <h1 className="plaak" style={{{{ fontSize: 48, marginBottom: 12 }}}}>{{t.title}}</h1>
                    <p style={{{{ fontSize: 16, color: '#ccc', marginBottom: 48 }}}}>{{t.text}}</p>
                    <div style={{{{ background: '#111', border: '1px solid #333', borderLeft: '4px solid #FFF469', padding: '20px 24px', marginBottom: 24, textAlign: 'left' }}}}>
                        <span className="monument" style={{{{ fontSize: 10, color: '#FFF469', display: 'block', marginBottom: 8 }}}}>BRUTAL TRUTH</span>
                        <p style={{{{ fontSize: 14, color: '#ccc', lineHeight: 1.7 }}}}>{{t.brutalTruth}}</p>
                    </div>
                    <div style={{{{ background: '#111', border: '1px solid #333', borderLeft: '4px solid #666', padding: '20px 24px', marginBottom: 48, textAlign: 'left' }}}}>
                        <span className="monument" style={{{{ fontSize: 10, color: '#999', display: 'block', marginBottom: 8 }}}}>PEER PROOF</span>
                        <p style={{{{ fontSize: 14, color: '#ccc', lineHeight: 1.7, fontStyle: 'italic' }}}}>{{t.peerProof}}</p>
                    </div>
                    <button onClick={{onContinue}}
                        style={{{{ background: '#fff', color: '#000', border: 'none', padding: '16px 48px', fontSize: 16, fontFamily: "'Monument', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}}}
                        onMouseOver={{e => {{ e.target.style.background = '#FFF469'; }}}}
                        onMouseOut={{e => {{ e.target.style.background = '#fff'; }}}}
                    >CONTINUE</button>
                </div>
            </div>
        );
    }}

    function WizardSidebar({{ currentStep, data, onNavigate }}) {{
        const steps = {sidebar_steps};
        return (
            <div className="wizard-sidebar no-print">
                <div className="wizard-sidebar-inner">
                    <div style={{{{ marginBottom: 24 }}}}>
                        <div className="monument" style={{{{ fontSize: 12, textTransform: 'uppercase', color: '#fff', marginBottom: 4 }}}}>{sidebar_label}</div>
                        <div style={{{{ fontSize: 13, color: '#999' }}}}>{sidebar_time}</div>
                    </div>
                    <div style={{{{ marginBottom: 16, fontFamily: "'Monument', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}}}>Your journey</div>
                    {{steps.map(s => {{
                        const effectiveStep = Math.ceil(currentStep);
                        const isCompleted = effectiveStep > s.num, isActive = effectiveStep === s.num, isLocked = effectiveStep < s.num;
                        return (
                            <div key={{s.num}} className={{'sidebar-step-item ' + (isCompleted ? 'completed' : '') + ' ' + (isActive ? 'active' : '') + ' ' + (isLocked ? 'locked' : '')}}
                                onClick={{() => isCompleted && onNavigate && onNavigate(s.num)}}
                                title={{isCompleted ? 'Click to review this step' : ''}}
                            >
                                <div style={{{{ display: 'flex', alignItems: 'center', gap: 10 }}}}>
                                    {{isCompleted ? <CheckIcon color="#000" size={{14}} /> : <span className="step-num" style={{{{ color: isActive ? '#fff' : '#ccc' }}}}>{{String(s.num).padStart(2, '0')}}</span>}}
                                    <span className="step-name" style={{{{ color: isLocked ? '#666' : isCompleted ? '#000' : '#fff' }}}}>{{s.label}}</span>
                                </div>
                            </div>
                        );
                    }})}}
                    <CoachFeedbackPanel />
                </div>
            </div>
        );
    }}

"""

    html = html.replace(f'    // Main App Component\n    function {app_func_name}()', shared_comps + f'    // Main App Component\n    function {app_func_name}()')

    # Replace CoverPage
    cover_pattern = r'// Cover Page Component\n\s*function CoverPage\(\{ onStart \}\) \{.*?(?=\n\s*// Intro Page)'
    new_cover_code = f"""// Cover Page Component (WOOP design system)
    function CoverPage({{ onStart }}) {{
      return (
        <div style={{{{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}}}>
          <div style={{{{ position: 'absolute', inset: 0, backgroundImage: 'url(cover.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }}}} />
          <div style={{{{ position: 'relative', textAlign: 'center', color: '#fff', padding: '0 32px' }}}} className="animate-in">
            <div className="monument" style={{{{ fontSize: 12, color: '#FFF469', letterSpacing: '0.1em', marginBottom: 16 }}}}>SPRINT {cover_sprint}</div>
            <h1 className="plaak" style={{{{ fontSize: 80, marginBottom: 16, textTransform: 'uppercase' }}}}>{cover_title}</h1>
            <p style={{{{ fontSize: 18, color: '#ccc', marginBottom: 48 }}}}>{cover_subtitle}</p>
            <button onClick={{onStart}}
              style={{{{ background: '#fff', color: '#000', border: 'none', padding: '16px 48px', fontSize: 16, fontFamily: "'Monument', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease', minHeight: 44 }}}}
              onMouseOver={{e => {{ e.target.style.background = '#FFF469'; }}}}
              onMouseOut={{e => {{ e.target.style.background = '#fff'; }}}}
            >START</button>
          </div>
        </div>
      );
    }}

"""
    html = re.sub(cover_pattern, new_cover_code, html, flags=re.DOTALL)

    # Remove old TransitionScreen
    html = re.sub(r'// Transition Screen Component\n\s*function TransitionScreen\(\{[^}]+\}\) \{.*?\n\s*\}\s*\n', '', html, flags=re.DOTALL)

    # Replace advanceStep to use .5 steps
    old_advance = """      const advanceStep = (fromStep) => {
        if (fromStep >= 1 && fromStep < 5) {
          const messages = ['20% COMPLETE', '40% COMPLETE', '60% COMPLETE', '80% COMPLETE', '100% COMPLETE'];
          const progressValues = [20, 40, 60, 80, 100];

          setTransitionMessage(messages[fromStep - 1]);
          setTransitionProgress(progressValues[fromStep - 1]);
          setShowTransition(true);

          setTimeout(() => {
            setShowTransition(false);
            setStep(fromStep + 1);
          }, 2000);
        } else if (fromStep === 5) {
          setStep(6);
        }
      };"""
    new_advance = """      const advanceStep = (fromStep) => {
        // Use .5 step for transition screens (Dream pattern)
        setStep(fromStep + 0.5);
      };"""
    html = html.replace(old_advance, new_advance)

    # Remove showTransition state
    html = html.replace("      const [showTransition, setShowTransition] = useState(false);\n", "")
    html = html.replace("      const [transitionMessage, setTransitionMessage] = useState('');\n", "")
    html = html.replace("      const [transitionProgress, setTransitionProgress] = useState(0);\n", "")

    # Remove showTransition render check
    html = html.replace("      if (showTransition) {\n        return <TransitionScreen message={transitionMessage} progress={transitionProgress} />;\n      }\n\n", "")

    with open(tool_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Processed: {tool_path}")


# Process all tools
print("Processing Tool 16: Value Proposition Testing...")
process_tool16()

print("\nProcessing Tool 17: Product Development...")
process_tool(
    os.path.join(BASE, 'frontend', 'tools', 'module-5-strategy-execution', '17-product-development.html'),
    'Product Development', 'product-development',
    sidebar_steps="[{ num: 1, label: 'Features', time: '~5 min' }, { num: 2, label: 'Interviews', time: '~5 min' }, { num: 3, label: 'WTP Results', time: '~8 min' }, { num: 4, label: 'Portfolio', time: '~8 min' }, { num: 5, label: 'Plan', time: '~5 min' }]",
    sidebar_label="PRODUCT DEV",
    sidebar_time="~31 min total",
    transition_content="""{
        1: { title: 'FEATURES MAPPED.', text: "You've identified the features to test. Now plan how to learn what customers will actually pay for.", brutalTruth: "70% of new products fail because they don't align with customer needs and willingness to pay. You've just taken the first step most companies skip -- listing features tied to customer pain points, not internal excitement.", peerProof: "Research by PDMA (2023) shows companies engaging customers in product development are 30% more likely to launch successful products." },
        2: { title: 'INTERVIEWS PLANNED.', text: "Your interview structure is set. Time to discover what customers truly value.", brutalTruth: "What customers say they value and what they'll actually pay for are different. Your job in the next step is to uncover both. If nobody would pay for a feature, kill it now, not after you've built it.", peerProof: "Madhavan Ramanujam's research found that determining WTP before building is the single most predictive factor of product success, reducing failure rates from 72% to under 30%." },
        3: { title: 'WTP DATA COLLECTED.', text: "Customer value signals are in. Now design your strategic portfolio.", brutalTruth: "Features scoring 8-10 from multiple segments are your must-haves. Features below 5 should be cut immediately, no matter how much your team loves them. Data replaces opinion from here.", peerProof: "A tech startup reversed a product flop by realigning features to customer needs, resulting in a 50% sales increase within the first quarter post-adjustment." },
        4: { title: 'PORTFOLIO DESIGNED.', text: "Storytellers, top-line, and profit roles are assigned. Time to execute.", brutalTruth: "Legacy products -- the 'undead dead' -- are the main reason for strategy confusion and cash drain. Be action-obsessed: every product must pass the features, price map, and roles test.", peerProof: "BCG's 2023 study shows companies with clearly defined product roles achieve 25% higher profit margins and 40% more efficient marketing spend." },
        5: { title: 'PLAN COMPLETE.', text: "Your implementation roadmap is ready. Execute with speed and conviction.", brutalTruth: "Speed of execution separates Fast Track companies from the rest. Come ready with real solutions, not just observations. Kill underperformers immediately.", peerProof: "Bain & Company found that companies implementing structured portfolio reviews reduce time-to-market by 40% and achieve 30% higher ROI on product development." }
    }""",
    cover_title="PRODUCT DEVELOPMENT",
    cover_subtitle="Discover what features customers value and will pay for",
    cover_sprint="17",
    app_func_name="WTPApp"
)

print("\nProcessing Tool 18: Pricing...")
process_tool(
    os.path.join(BASE, 'frontend', 'tools', 'module-5-strategy-execution', '18-pricing.html'),
    'Pricing', 'pricing',
    sidebar_steps="[{ num: 1, label: 'Features', time: '~5 min' }, { num: 2, label: 'Anchor', time: '~8 min' }, { num: 3, label: 'Tiers', time: '~8 min' }, { num: 4, label: 'Align', time: '~5 min' }, { num: 5, label: 'Plan', time: '~8 min' }]",
    sidebar_label="PRICING",
    sidebar_time="~34 min total",
    transition_content="""{
        1: { title: 'FEATURES CLASSIFIED.', text: "Must-Have, Nice-to-Have, and Killer features are sorted. Now set your price anchor.", brutalTruth: "Even a small 1-2% price increase can spark a far larger jump in net margin than most cost-cutting efforts. Getting feature classification right means 80% of your pricing strategy falls into place.", peerProof: "Hermann Simon's research shows a 1% price increase drives approximately 11% increase in operating profit -- making pricing the single most powerful profit lever available." },
        2: { title: 'ANCHOR SET.', text: "Your price position is defined. Now design the tier bundles.", brutalTruth: "Your anchor price is the single most consequential pricing decision. The first number a customer sees becomes their reference point. Companies that deliberately set a high anchor and justify it capture 15-30% more revenue.", peerProof: "Ariely, Loewenstein & Prelec (2003) at MIT found that arbitrary anchors influenced WTP by up to 60-80%. Deliberate anchoring is not optional." },
        3: { title: 'TIERS DESIGNED.', text: "Your 2-3 tier structure is ready. Now align price to value.", brutalTruth: "The decoy effect is real: adding a strategically positioned third option increases selection of the target tier by 40%. Keep tiers simple -- if you can't summarize each in one sentence, it's too complex.", peerProof: "Nagle & Muller (2017) found companies limiting to 2-3 clearly differentiated tiers achieve 30% higher conversion rates than complex multi-tier structures." },
        4: { title: 'VALUE ALIGNED.', text: "Features mapped to price. Time to plan execution.", brutalTruth: "Companies able to quantify their value proposition in monetary terms win deals at 3x the rate of competitors who cannot. Your pricing must explicitly connect features to measurable outcomes.", peerProof: "Anderson, Narus & Van Rossum (2006, HBR) found that quantified value propositions are the strongest predictor of pricing power." },
        5: { title: 'STRATEGY COMPLETE.', text: "Your pricing strategy is ready for pilot testing and rollout.", brutalTruth: "Pricing strategy without execution is worthless. Pilot with a small group first, then adjust before full rollout. Schedule quarterly reviews -- markets and competitors evolve constantly.", peerProof: "Hinterhuber (2008) found structured pricing pilots achieve 23% higher profit improvements than organization-wide launches without testing." }
    }""",
    cover_title="STRATEGY DRIVEN PRICING",
    cover_subtitle="Set value-based price anchors before building the product",
    cover_sprint="18",
    app_func_name="PricingApp"
)

print("\nDone! All 3 tools processed.")
