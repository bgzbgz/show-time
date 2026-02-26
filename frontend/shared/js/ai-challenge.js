// AIChallenge — AI coaching layer for Fast Track tools.
// Reviews answers per section and at final submit. Mandatory improvement.
var AIChallenge = (function () {
    'use strict';

    var API_BASE = 'https://backend-production-639c.up.railway.app';

    // Track review attempts per step (resets on page load)
    var stepAttempts = {};

    function getAttempt(stepKey) {
        if (!stepAttempts[stepKey]) stepAttempts[stepKey] = 0;
        stepAttempts[stepKey]++;
        return stepAttempts[stepKey];
    }

    // Call backend AI challenge endpoint
    function review(userId, toolSlug, answers, attempt) {
        return fetch(API_BASE + '/api/ai/challenge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, tool_slug: toolSlug, answers: answers, attempt: attempt || 1 }),
        }).then(function (resp) {
            if (!resp.ok) {
                return resp.json().catch(function () { return {}; }).then(function (err) {
                    throw new Error(err.message || 'AI review request failed');
                });
            }
            return resp.json();
        }).then(function (json) {
            return json.data;
        });
    }

    // Show mandatory challenge modal. Returns promise: 'revise' always (no skip option).
    // If allowSkip is true, shows "Continue Anyway" button (for final submit only).
    function showModal(feedback, options) {
        var allowSkip = options && options.allowSkip;
        var stepName = (options && options.stepName) || 'this section';

        return new Promise(function (resolve) {
            var existing = document.getElementById('ai-challenge-modal-overlay');
            if (existing) existing.remove();

            var overlay = document.createElement('div');
            overlay.id = 'ai-challenge-modal-overlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;animation:aicFadeIn 0.25s ease';

            var modal = document.createElement('div');
            modal.style.cssText = 'background:#fff;border-radius:0;border:2px solid #000;max-width:580px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 24px 48px rgba(0,0,0,0.2)';

            // Header
            var header = document.createElement('div');
            header.style.cssText = 'padding:24px 28px 16px;border-bottom:2px solid #000';
            header.innerHTML = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">' +
                '<div style="width:32px;height:32px;background:#FFF469;border:2px solid #000;display:flex;align-items:center;justify-content:center;font-size:18px">!</div>' +
                '<h2 style="font-family:Plaak,sans-serif;font-size:22px;font-weight:bold;letter-spacing:-0.01em;margin:0">COACH\'S REVIEW</h2>' +
                '</div>' +
                '<p style="font-family:Riforma,sans-serif;font-size:14px;color:#666;margin:0">' + escapeHtml(feedback.encouragement) + '</p>';
            modal.appendChild(header);

            // Challenges
            var body = document.createElement('div');
            body.style.cssText = 'padding:20px 28px';

            if (feedback.challenges && feedback.challenges.length > 0) {
                feedback.challenges.forEach(function (ch) {
                    var card = document.createElement('div');
                    var borderColor = ch.severity === 'critical' ? '#EF4444' : '#FFF469';
                    var labelBg = ch.severity === 'critical' ? '#EF4444' : '#FFF469';
                    var labelColor = ch.severity === 'critical' ? '#fff' : '#000';
                    var labelText = ch.severity === 'critical' ? 'NEEDS WORK' : 'COULD BE STRONGER';

                    card.style.cssText = 'border:2px solid ' + borderColor + ';padding:16px;margin-bottom:16px';
                    card.innerHTML = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">' +
                        '<span style="font-family:Monument,monospace;font-size:10px;letter-spacing:0.08em;background:' + labelBg + ';color:' + labelColor + ';padding:3px 8px;font-weight:bold">' + labelText + '</span>' +
                        '<span style="font-family:Monument,monospace;font-size:11px;color:#666;letter-spacing:0.04em">' + escapeHtml(ch.question_text || ch.question_key) + '</span>' +
                        '</div>' +
                        '<p style="font-family:Riforma,sans-serif;font-size:14px;margin:0 0 10px;color:#000">' + escapeHtml(ch.feedback) + '</p>' +
                        '<div style="background:#F5F5F5;padding:12px;border-left:3px solid #000">' +
                        '<p style="font-family:Monument,monospace;font-size:10px;letter-spacing:0.06em;color:#666;margin:0 0 4px">SUGGESTION</p>' +
                        '<p style="font-family:Riforma,sans-serif;font-size:13px;margin:0;color:#333">' + escapeHtml(ch.suggestion) + '</p>' +
                        '</div>';
                    body.appendChild(card);
                });
            }
            modal.appendChild(body);

            // Store feedback in localStorage
            try {
                localStorage.setItem('ai_last_feedback', JSON.stringify({
                    type: 'challenges',
                    encouragement: feedback.encouragement,
                    challenges: feedback.challenges,
                    timestamp: Date.now()
                }));
            } catch (e) { /* ignore */ }

            // Footer
            var footer = document.createElement('div');
            footer.style.cssText = 'padding:16px 28px 24px;border-top:1px solid #E0E0E0;display:flex;gap:12px;justify-content:flex-end';

            if (allowSkip) {
                var skipBtn = document.createElement('button');
                skipBtn.textContent = 'Continue Anyway';
                skipBtn.style.cssText = 'font-family:Riforma,sans-serif;font-size:14px;padding:10px 20px;background:#fff;color:#666;border:1px solid #ccc;cursor:pointer;letter-spacing:0.02em';
                skipBtn.onmouseenter = function () { skipBtn.style.background = '#f5f5f5'; };
                skipBtn.onmouseleave = function () { skipBtn.style.background = '#fff'; };
                skipBtn.onclick = function () { overlay.remove(); resolve('submit_anyway'); };
                footer.appendChild(skipBtn);
            }

            var reviseBtn = document.createElement('button');
            reviseBtn.textContent = 'Sharpen My Answer';
            reviseBtn.style.cssText = 'font-family:Riforma,sans-serif;font-size:14px;padding:10px 24px;background:#000;color:#fff;border:2px solid #000;cursor:pointer;font-weight:600;letter-spacing:0.02em';
            reviseBtn.onmouseenter = function () { reviseBtn.style.background = '#222'; };
            reviseBtn.onmouseleave = function () { reviseBtn.style.background = '#000'; };
            reviseBtn.onclick = function () { overlay.remove(); resolve('revise'); };
            footer.appendChild(reviseBtn);

            modal.appendChild(footer);
            overlay.appendChild(modal);

            // Click outside = revise (go back)
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) { overlay.remove(); resolve('revise'); }
            });

            injectStyle();
            document.body.appendChild(overlay);
        });
    }

    // Show a brief "approved" toast that auto-dismisses
    function showApproved(message) {
        var existing = document.getElementById('ai-approved-toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.id = 'ai-approved-toast';
        toast.style.cssText = 'position:fixed;top:24px;right:24px;z-index:10001;background:#000;color:#fff;padding:16px 40px 16px 24px;border:2px solid #FFF469;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:aicFadeIn 0.25s ease;max-width:380px';
        toast.innerHTML = '<div style="display:flex;align-items:center;gap:10px">' +
            '<div style="width:24px;height:24px;background:#FFF469;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;color:#000;font-weight:bold;flex-shrink:0">\u2713</div>' +
            '<p style="font-family:Riforma,sans-serif;font-size:14px;margin:0;color:#fff">' + escapeHtml(message || 'Sharp. Moving on.') + '</p>' +
            '</div>' +
            '<button onclick="this.parentNode.remove()" style="position:absolute;top:8px;right:8px;background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:2px 6px;line-height:1;opacity:0.7">&times;</button>';
        toast.style.position = 'fixed';

        // Store approval in localStorage
        try {
            localStorage.setItem('ai_last_feedback', JSON.stringify({
                type: 'approved',
                message: message || 'Strong answers! Moving on.',
                timestamp: Date.now()
            }));
        } catch (e) { /* ignore */ }

        injectStyle();
        document.body.appendChild(toast);
        setTimeout(function () { if (toast.parentNode) toast.remove(); }, 8000);
    }

    // Gate a step transition: review answers, block if challenges found.
    // Returns true if user can proceed, false if blocked.
    // Tracks attempts per stepName so re-reviews are more lenient.
    function reviewStep(userId, toolSlug, stepAnswers, stepName) {
        var attempt = getAttempt(toolSlug + ':' + stepName);
        return review(userId, toolSlug, stepAnswers, attempt)
            .then(function (feedback) {
                if (feedback.has_challenges && feedback.challenges.length > 0) {
                    return showModal(feedback, { allowSkip: true, stepName: stepName })
                        .then(function (action) {
                            return action !== 'revise'; // 'submit_anyway' → proceed, 'revise' → stay
                        });
                }
                // No challenges — show brief approval
                showApproved(feedback.encouragement);
                return true;
            })
            .catch(function (err) {
                console.warn('[AIChallenge] Review failed, allowing passage:', err.message);
                return true; // if AI fails, don't block the user
            });
    }

    // Full final-submit flow — saves directly, no AI review gate at final submit
    function submitWithChallenge(userId, toolSlug, questionMappings, callbacks) {
        var onSubmitAnyway = callbacks.onSubmitAnyway;
        var onError = callbacks.onError;

        return doSave(userId, questionMappings, { has_challenges: false }, onSubmitAnyway)
            .catch(function (err) {
                console.error('[AIChallenge] Save error:', err);
                if (onError) onError(err); else throw err;
            });
    }

    function doSave(userId, questionMappings, feedback, onDone) {
        return ToolDB.save(userId, questionMappings).then(function () {
            return ToolDB.markComplete(userId);
        }).then(function () {
            if (onDone) onDone();
            return { action: feedback.has_challenges ? 'submitted_anyway' : 'no_challenges', feedback: feedback };
        });
    }

    var styleEl = null;
    function injectStyle() {
        if (styleEl) return;
        styleEl = document.createElement('style');
        styleEl.textContent = '@keyframes aicFadeIn { from { opacity: 0; } to { opacity: 1; } }';
        document.head.appendChild(styleEl);
    }

    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getLastFeedback() {
        try {
            var raw = localStorage.getItem('ai_last_feedback');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    return {
        review: review,
        showModal: showModal,
        showApproved: showApproved,
        reviewStep: reviewStep,
        submitWithChallenge: submitWithChallenge,
        getLastFeedback: getLastFeedback
    };
})();

window.AIChallenge = AIChallenge;
