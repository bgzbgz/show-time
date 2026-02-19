/**
 * AIChallenge — Shared AI challenge layer for all Fast Track tools.
 * Reviews user answers at submission time, challenges weak responses,
 * and suggests improvements. Advisory — users can revise or submit anyway.
 *
 * Usage:
 *   <script src="../../shared/js/ai-challenge.js"></script>
 *   <script>
 *     // In your submit handler:
 *     const result = await AIChallenge.submitWithChallenge(userId, 'woop', questionMappings, {
 *       onRevise: () => { /* go back to form */ },
 *       onSubmitAnyway: () => { /* show success */ }
 *     });
 *   </script>
 */
const AIChallenge = (function () {
    'use strict';

    // Backend is on a separate Railway service
    const API_BASE = 'https://backend-production-639c.up.railway.app';

    /**
     * Call the backend AI challenge endpoint.
     * Returns the AI feedback result.
     */
    async function review(userId, toolSlug, answers) {
        const resp = await fetch(`${API_BASE}/api/ai/challenge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, tool_slug: toolSlug, answers }),
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.message || 'AI review request failed');
        }

        const json = await resp.json();
        return json.data; // { has_challenges, overall_quality, challenges, encouragement }
    }

    /**
     * Show the challenge modal. Returns a Promise that resolves to 'revise' or 'submit_anyway'.
     */
    function showModal(feedback) {
        return new Promise((resolve) => {
            // Remove any existing modal
            const existing = document.getElementById('ai-challenge-modal-overlay');
            if (existing) existing.remove();

            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'ai-challenge-modal-overlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;animation:aicFadeIn 0.25s ease';

            // Modal container
            const modal = document.createElement('div');
            modal.style.cssText = 'background:#fff;border-radius:0;border:2px solid #000;max-width:580px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 24px 48px rgba(0,0,0,0.2)';

            // Header
            const header = document.createElement('div');
            header.style.cssText = 'padding:24px 28px 16px;border-bottom:2px solid #000';
            header.innerHTML = `
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
                    <div style="width:32px;height:32px;background:#FFF469;border:2px solid #000;display:flex;align-items:center;justify-content:center;font-size:18px">!</div>
                    <h2 style="font-family:'Plaak',sans-serif;font-size:22px;font-weight:bold;letter-spacing:-0.01em;margin:0">COACH'S REVIEW</h2>
                </div>
                <p style="font-family:'Riforma',sans-serif;font-size:14px;color:#666;margin:0">${escapeHtml(feedback.encouragement)}</p>
            `;
            modal.appendChild(header);

            // Challenges
            const body = document.createElement('div');
            body.style.cssText = 'padding:20px 28px';

            if (feedback.challenges && feedback.challenges.length > 0) {
                feedback.challenges.forEach((ch) => {
                    const card = document.createElement('div');
                    const borderColor = ch.severity === 'critical' ? '#EF4444' : '#FFF469';
                    const labelBg = ch.severity === 'critical' ? '#EF4444' : '#FFF469';
                    const labelColor = ch.severity === 'critical' ? '#fff' : '#000';
                    const labelText = ch.severity === 'critical' ? 'NEEDS WORK' : 'COULD BE STRONGER';

                    card.style.cssText = `border:2px solid ${borderColor};padding:16px;margin-bottom:16px`;
                    card.innerHTML = `
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                            <span style="font-family:'Monument',monospace;font-size:10px;letter-spacing:0.08em;background:${labelBg};color:${labelColor};padding:3px 8px;font-weight:bold">${labelText}</span>
                            <span style="font-family:'Monument',monospace;font-size:11px;color:#666;letter-spacing:0.04em">${escapeHtml(ch.question_text || ch.question_key)}</span>
                        </div>
                        <p style="font-family:'Riforma',sans-serif;font-size:14px;margin:0 0 10px;color:#000">${escapeHtml(ch.feedback)}</p>
                        <div style="background:#F5F5F5;padding:12px;border-left:3px solid #000">
                            <p style="font-family:'Monument',monospace;font-size:10px;letter-spacing:0.06em;color:#666;margin:0 0 4px">SUGGESTION</p>
                            <p style="font-family:'Riforma',sans-serif;font-size:13px;margin:0;color:#333">${escapeHtml(ch.suggestion)}</p>
                        </div>
                    `;
                    body.appendChild(card);
                });
            }
            modal.appendChild(body);

            // Footer with buttons
            const footer = document.createElement('div');
            footer.style.cssText = 'padding:16px 28px 24px;border-top:1px solid #E0E0E0;display:flex;gap:12px;justify-content:flex-end';

            const submitAnywayBtn = document.createElement('button');
            submitAnywayBtn.textContent = 'Submit Anyway';
            submitAnywayBtn.style.cssText = 'font-family:"Riforma",sans-serif;font-size:14px;padding:10px 20px;background:#fff;color:#666;border:1px solid #ccc;cursor:pointer;letter-spacing:0.02em';
            submitAnywayBtn.onmouseenter = () => { submitAnywayBtn.style.background = '#f5f5f5'; };
            submitAnywayBtn.onmouseleave = () => { submitAnywayBtn.style.background = '#fff'; };

            const reviseBtn = document.createElement('button');
            reviseBtn.textContent = 'Revise My Answers';
            reviseBtn.style.cssText = 'font-family:"Riforma",sans-serif;font-size:14px;padding:10px 24px;background:#000;color:#fff;border:2px solid #000;cursor:pointer;font-weight:600;letter-spacing:0.02em';
            reviseBtn.onmouseenter = () => { reviseBtn.style.background = '#222'; };
            reviseBtn.onmouseleave = () => { reviseBtn.style.background = '#000'; };

            const cleanup = () => { overlay.remove(); removeStyle(); };

            submitAnywayBtn.onclick = () => { cleanup(); resolve('submit_anyway'); };
            reviseBtn.onclick = () => { cleanup(); resolve('revise'); };

            footer.appendChild(submitAnywayBtn);
            footer.appendChild(reviseBtn);
            modal.appendChild(footer);

            overlay.appendChild(modal);

            // Close on overlay click (outside modal)
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) { cleanup(); resolve('revise'); }
            });

            // Inject animation CSS
            injectStyle();
            document.body.appendChild(overlay);
        });
    }

    let styleEl = null;
    function injectStyle() {
        if (styleEl) return;
        styleEl = document.createElement('style');
        styleEl.textContent = `
            @keyframes aicFadeIn { from { opacity: 0; } to { opacity: 1; } }
        `;
        document.head.appendChild(styleEl);
    }
    function removeStyle() {
        // Keep style injected — lightweight and reusable
    }

    /**
     * Full submit flow: review -> modal if needed -> save -> markComplete.
     *
     * @param {string} userId
     * @param {string} toolSlug
     * @param {Object} questionMappings - same mappings you'd pass to ToolDB.save()
     * @param {Object} callbacks
     * @param {Function} callbacks.onRevise - called when user clicks "Revise My Answers"
     * @param {Function} callbacks.onSubmitAnyway - called after save completes (user clicked "Submit Anyway" or no challenges)
     * @param {Function} [callbacks.onReviewStart] - called when AI review begins
     * @param {Function} [callbacks.onError] - called on error
     */
    async function submitWithChallenge(userId, toolSlug, questionMappings, callbacks) {
        const { onRevise, onSubmitAnyway, onReviewStart, onError } = callbacks;

        try {
            // Signal review starting
            if (onReviewStart) onReviewStart();

            // 1. Ask AI to review
            let feedback;
            try {
                feedback = await review(userId, toolSlug, questionMappings);
            } catch (reviewErr) {
                console.warn('[AIChallenge] Review failed, proceeding to save:', reviewErr.message);
                // AI failed — fall through to normal save
                feedback = { has_challenges: false, challenges: [], encouragement: '' };
            }

            // 2. If challenges, show modal
            if (feedback.has_challenges && feedback.challenges.length > 0) {
                const action = await showModal(feedback);

                if (action === 'revise') {
                    if (onRevise) onRevise();
                    return { action: 'revised', feedback };
                }

                // User chose "Submit Anyway" — continue to save
            }

            // 3. Save via ToolDB
            await ToolDB.save(userId, questionMappings);
            await ToolDB.markComplete(userId);

            // 4. Callback
            if (onSubmitAnyway) onSubmitAnyway();

            return {
                action: feedback.has_challenges ? 'submitted_anyway' : 'no_challenges',
                feedback,
            };
        } catch (err) {
            console.error('[AIChallenge] Error in submit flow:', err);
            if (onError) {
                onError(err);
            } else {
                throw err;
            }
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    return {
        review,
        showModal,
        submitWithChallenge,
    };
})();

window.AIChallenge = AIChallenge;
