/**
 * ToolDB — Shared database layer for all Fast Track tools.
 * ALL reads and writes go through the backend API (service_role).
 * No direct Supabase access from the frontend.
 */
const ToolDB = (function() {
    'use strict';

    const API_BASE = 'https://backend-production-639c.up.railway.app';

    let toolSlug = null;
    let questionCache = {}; // { question_key: { id, question_type, reference_key } }
    let initPromise = null;

    /**
     * Initialize for a specific tool — fetches and caches question IDs.
     */
    async function init(slug) {
        toolSlug = slug;
        initPromise = _doInit(slug);
        return initPromise;
    }

    async function _doInit(slug) {
        await identifyUser();

        try {
            const res = await fetch(`${API_BASE}/api/toolsave/questions?tool_slug=${encodeURIComponent(slug)}`);
            if (!res.ok) {
                console.error('[ToolDB] Failed to load questions for', slug, res.status);
                return;
            }
            const { data } = await res.json();

            questionCache = {};
            (data || []).forEach(q => {
                questionCache[q.question_key] = {
                    id: q.id,
                    question_type: q.question_type,
                    reference_key: q.reference_key
                };
            });
        } catch (err) {
            console.error('[ToolDB] Failed to load questions for', slug, err);
            return;
        }

        console.log(`[ToolDB] Initialized for "${slug}" — ${Object.keys(questionCache).length} questions cached`);
    }

    async function whenReady() {
        if (initPromise) await initPromise;
    }

    /**
     * Save answers for multiple questions.
     * Routes through backend — service_role writes to user_responses.
     */
    async function save(userId, mappings) {
        await whenReady();
        if (!userId) throw new Error('No userId');

        const rows = [];
        for (const [key, value] of Object.entries(mappings)) {
            if (value === undefined || value === null) continue;
            const q = questionCache[key];
            if (!q) {
                console.warn(`[ToolDB] Unknown question_key "${key}" for tool "${toolSlug}" — skipping`);
                continue;
            }
            const isComplex = (value !== null && typeof value === 'object');
            rows.push({
                question_id: q.id,
                response_value: isComplex ? null : String(value),
                response_data: isComplex ? value : null
            });
        }

        if (rows.length === 0) {
            console.warn('[ToolDB] No valid mappings to save');
            return { saved: 0 };
        }

        const res = await fetch(`${API_BASE}/api/toolsave/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, responses: rows })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error('[ToolDB] Save error:', err);
            throw new Error(err.message || 'Save failed');
        }

        console.log(`[ToolDB] Saved ${rows.length} responses for tool "${toolSlug}"`);
        return { saved: rows.length };
    }

    /**
     * Load all saved answers for a user on this tool.
     * Routes through backend API.
     */
    async function load(userId) {
        await whenReady();
        if (!userId || !toolSlug) return {};

        if (Object.keys(questionCache).length === 0) return {};

        try {
            const res = await fetch(
                `${API_BASE}/api/toolsave/load?tool_slug=${encodeURIComponent(toolSlug)}&user_id=${encodeURIComponent(userId)}`
            );
            if (!res.ok) {
                console.error('[ToolDB] Load error:', res.status);
                return {};
            }
            const { data } = await res.json();
            const result = data || {};
            console.log(`[ToolDB] Loaded ${Object.keys(result).length} responses for tool "${toolSlug}"`);
            return result;
        } catch (err) {
            console.error('[ToolDB] Load error:', err);
            return {};
        }
    }

    /**
     * Get a dependency value by reference_key (cross-tool).
     * Routes through backend API.
     */
    async function getDependency(userId, referenceKey) {
        if (!userId || !referenceKey) return null;

        try {
            const res = await fetch(
                `${API_BASE}/api/toolsave/dependency?reference_key=${encodeURIComponent(referenceKey)}&user_id=${encodeURIComponent(userId)}`
            );
            if (!res.ok) return null;
            const { data } = await res.json();
            return data;
        } catch (err) {
            console.error('[ToolDB] getDependency error:', err);
            return null;
        }
    }

    /**
     * Identify the current user from LearnWorlds URL params or localStorage.
     * Uses backend for user creation/lookup (service_role).
     */
    async function identifyUser() {
        const params = new URLSearchParams(window.location.search);
        const lwUserId = params.get('lw_user_id');
        const lwEmail = params.get('lw_email');
        const lwName = params.get('lw_name');

        // Clean URL after extracting params
        if (lwUserId || lwEmail) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 1. LearnWorlds params — resolve via backend
        if (lwUserId || lwEmail) {
            try {
                const res = await fetch(`${API_BASE}/api/toolsave/identify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lw_user_id: lwUserId, lw_email: lwEmail, lw_name: lwName })
                });

                if (res.ok) {
                    const { data } = await res.json();
                    if (data?.user_id) {
                        localStorage.setItem('ft_user_id', data.user_id);
                        console.log(`[ToolDB] Identified user via backend: ${data.user_id}`);
                        return data.user_id;
                    }
                }
            } catch (err) {
                console.error('[ToolDB] identify error:', err);
            }
        }

        // 2. Fall back to localStorage
        const storedId = localStorage.getItem('ft_user_id');
        if (storedId) return storedId;

        // 3. Dev mode
        if (new URLSearchParams(window.location.search).has('dev')) {
            const devUserId = '7ac90e0a-0a2f-4e63-82a9-5e0d7b939c88';
            localStorage.setItem('ft_user_id', devUserId);
            console.log('[ToolDB] DEV MODE — using dev user:', devUserId);
            return devUserId;
        }

        return null;
    }

    /**
     * Ensure a user row exists. No-op — handled by identifyUser() via backend.
     * Kept for API compatibility.
     */
    async function ensureUser(userId, email) {
        // User creation now happens via /api/toolsave/identify
        console.log('[ToolDB] ensureUser: handled by identifyUser via backend');
    }

    /**
     * Mark a tool as completed for a user.
     * Routes through backend — service_role writes to tool_completions.
     */
    async function markComplete(userId) {
        if (!userId || !toolSlug) return;

        try {
            const res = await fetch(`${API_BASE}/api/toolsave/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, tool_slug: toolSlug })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error('[ToolDB] markComplete error:', err);
            } else {
                console.log(`[ToolDB] Marked "${toolSlug}" complete for user ${userId}`);
            }
        } catch (err) {
            console.error('[ToolDB] markComplete network error:', err);
        }
    }

    function getQuestionCache() {
        return questionCache;
    }

    // Backward-compat alias: some tools incorrectly call saveResponses(userId, slug, mappings).
    // The slug arg is ignored (already set via init). Delegates to save(userId, mappings).
    async function saveResponses(userId, _slugIgnored, mappings) {
        console.warn('[ToolDB] saveResponses() is deprecated — use save(userId, mappings) instead');
        return save(userId, mappings);
    }

    return {
        init,
        whenReady,
        save,
        saveResponses,
        load,
        getDependency,
        ensureUser,
        identifyUser,
        getQuestionCache,
        markComplete
    };
})();

window.ToolDB = ToolDB;
