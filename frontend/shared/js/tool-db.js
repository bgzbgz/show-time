/**
 * ToolDB — Shared database layer for all Fast Track tools.
 * Replaces the old per-sprint schema RPC calls with direct table queries
 * against the 3-table architecture: users, tool_questions, user_responses.
 *
 * Usage:
 *   <script src="../../shared/js/tool-db.js"></script>
 *   <script>
 *     ToolDB.init('woop');
 *   </script>
 */
const ToolDB = (function() {
    'use strict';

    let toolSlug = null;
    let questionCache = {}; // { question_key: { id, question_type, reference_key } }
    let initPromise = null;

    /**
     * Initialize for a specific tool — fetches and caches question IDs.
     * Can be called fire-and-forget; save/load will await readiness.
     */
    async function init(slug) {
        toolSlug = slug;
        initPromise = _doInit(slug);
        return initPromise;
    }

    async function _doInit(slug) {
        const client = window.supabaseClient;
        if (!client) {
            console.error('[ToolDB] No supabaseClient on window');
            return;
        }

        // Auto-identify user from LearnWorlds URL params (sets localStorage ft_user_id)
        await identifyUser();

        const { data, error } = await client
            .from('tool_questions')
            .select('id, question_key, question_type, reference_key')
            .eq('tool_slug', slug);

        if (error) {
            console.error('[ToolDB] Failed to load questions for', slug, error);
            return;
        }

        questionCache = {};
        (data || []).forEach(q => {
            questionCache[q.question_key] = {
                id: q.id,
                question_type: q.question_type,
                reference_key: q.reference_key
            };
        });

        console.log(`[ToolDB] Initialized for "${slug}" — ${Object.keys(questionCache).length} questions cached`);
    }

    /** Wait until init() completes. */
    async function whenReady() {
        if (initPromise) await initPromise;
    }

    /**
     * Save answers for multiple questions.
     * @param {string} userId - UUID from ft_user_id in localStorage
     * @param {Object} mappings - { question_key: value, ... }
     *   String/number values → response_value. Objects/arrays → response_data (JSON).
     */
    async function save(userId, mappings) {
        await whenReady();
        const client = window.supabaseClient;
        if (!client) throw new Error('No supabaseClient');
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
                user_id: userId,
                question_id: q.id,
                response_value: isComplex ? null : String(value),
                response_data: isComplex ? value : null
            });
        }

        if (rows.length === 0) {
            console.warn('[ToolDB] No valid mappings to save');
            return { saved: 0 };
        }

        const { error } = await client
            .from('user_responses')
            .upsert(rows, { onConflict: 'user_id,question_id' });

        if (error) {
            console.error('[ToolDB] Save error:', error);
            throw error;
        }

        console.log(`[ToolDB] Saved ${rows.length} responses for tool "${toolSlug}"`);
        return { saved: rows.length };
    }

    /**
     * Load all saved answers for a user on this tool.
     * @returns {Object} { question_key: value, ... }
     */
    async function load(userId) {
        await whenReady();
        const client = window.supabaseClient;
        if (!client || !userId) return {};

        const questionIds = Object.values(questionCache).map(q => q.id);
        if (questionIds.length === 0) return {};

        const { data, error } = await client
            .from('user_responses')
            .select('question_id, response_value, response_data')
            .eq('user_id', userId)
            .in('question_id', questionIds);

        if (error) {
            console.error('[ToolDB] Load error:', error);
            return {};
        }

        // Build reverse map: question_id → question_key
        const idToKey = {};
        for (const [key, q] of Object.entries(questionCache)) {
            idToKey[q.id] = key;
        }

        const result = {};
        (data || []).forEach(row => {
            const key = idToKey[row.question_id];
            if (key) {
                result[key] = row.response_data !== null ? row.response_data : row.response_value;
            }
        });

        console.log(`[ToolDB] Loaded ${Object.keys(result).length} responses for tool "${toolSlug}"`);
        return result;
    }

    /**
     * Get a dependency value by reference_key (cross-tool).
     * Used by DependencyInjection to pull values from other tools.
     */
    async function getDependency(userId, referenceKey) {
        const client = window.supabaseClient;
        if (!client || !userId || !referenceKey) return null;

        // Find the question by reference_key
        const { data: questions, error: qErr } = await client
            .from('tool_questions')
            .select('id')
            .eq('reference_key', referenceKey)
            .limit(1);

        if (qErr || !questions || questions.length === 0) {
            return null;
        }

        const questionId = questions[0].id;

        // Fetch the user's response
        const { data: responses, error: rErr } = await client
            .from('user_responses')
            .select('response_value, response_data')
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .limit(1);

        if (rErr || !responses || responses.length === 0) {
            return null;
        }

        const row = responses[0];
        return row.response_data !== null ? row.response_data : row.response_value;
    }

    /**
     * Ensure a user row exists in the users table.
     */
    async function ensureUser(userId, email) {
        const client = window.supabaseClient;
        if (!client || !userId) return;

        const { data: existing } = await client
            .from('users')
            .select('id')
            .eq('id', userId)
            .limit(1);

        if (existing && existing.length > 0) return;

        const { error } = await client
            .from('users')
            .insert({ id: userId, email: email || 'unknown@fasttrack.local' });

        if (error && !error.message?.includes('duplicate')) {
            console.error('[ToolDB] ensureUser error:', error);
        }
    }

    /**
     * Identify the current user from LearnWorlds URL params or localStorage.
     * LearnWorlds passes ?lw_user_id={{USER_ID}}&lw_email={{USER_EMAIL}}&lw_name={{USER_NAME}}
     * Returns the user UUID (for use as ft_user_id) or null.
     */
    async function identifyUser() {
        const client = window.supabaseClient;
        if (!client) return localStorage.getItem('ft_user_id') || null;

        const params = new URLSearchParams(window.location.search);
        const lwUserId = params.get('lw_user_id');
        const lwEmail = params.get('lw_email');
        const lwName = params.get('lw_name');

        // Clean URL after extracting params (avoid leaking tokens in browser history)
        if (lwUserId || lwEmail) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 1. Try LearnWorlds params
        if (lwUserId || lwEmail) {
            let user = null;

            // Look up by learnworlds_user_id
            if (lwUserId) {
                const { data } = await client
                    .from('users')
                    .select('id, full_name, email, learnworlds_user_id')
                    .eq('learnworlds_user_id', lwUserId)
                    .single();
                user = data;
            }

            // Fall back to email lookup
            if (!user && lwEmail) {
                const { data } = await client
                    .from('users')
                    .select('id, full_name, email, learnworlds_user_id')
                    .eq('email', lwEmail.toLowerCase())
                    .single();
                if (data) {
                    // Backfill learnworlds_user_id if missing
                    if (lwUserId && !data.learnworlds_user_id) {
                        await client.from('users').update({ learnworlds_user_id: lwUserId }).eq('id', data.id);
                    }
                    user = data;
                }
            }

            // Create new user if not found
            if (!user) {
                const email = lwEmail ? lwEmail.toLowerCase() : `${lwUserId}@learnworlds.user`;
                const { data: newUser } = await client
                    .from('users')
                    .insert({
                        email,
                        learnworlds_user_id: lwUserId || null,
                        full_name: lwName || (lwEmail ? lwEmail.split('@')[0] : 'Fast Track User'),
                        role: 'participant',
                        last_login: new Date().toISOString()
                    })
                    .select('id')
                    .single();
                user = newUser;
            }

            if (user) {
                localStorage.setItem('ft_user_id', user.id);
                console.log(`[ToolDB] Identified user from LearnWorlds: ${user.id}`);
                return user.id;
            }
        }

        // 2. Fall back to localStorage
        const storedId = localStorage.getItem('ft_user_id');
        if (storedId) return storedId;

        // 3. Dev mode: use known dev user with real data
        if (new URLSearchParams(window.location.search).has('dev')) {
            const devUserId = '7ac90e0a-0a2f-4e63-82a9-5e0d7b939c88';
            localStorage.setItem('ft_user_id', devUserId);
            console.log('[ToolDB] DEV MODE — using dev user:', devUserId);
            return devUserId;
        }

        return null;
    }

    /**
     * Mark a tool as completed for a user.
     * Upserts into tool_completions — safe to call multiple times.
     */
    async function markComplete(userId) {
        const client = window.supabaseClient;
        if (!client || !userId || !toolSlug) return;

        const { error } = await client
            .from('tool_completions')
            .upsert(
                { user_id: userId, tool_slug: toolSlug },
                { onConflict: 'user_id,tool_slug' }
            );

        if (error) {
            console.error('[ToolDB] markComplete error:', error);
        } else {
            console.log(`[ToolDB] Marked "${toolSlug}" complete for user ${userId}`);
        }
    }

    /**
     * Get the cached question metadata.
     */
    function getQuestionCache() {
        return questionCache;
    }

    return {
        init,
        whenReady,
        save,
        load,
        getDependency,
        ensureUser,
        identifyUser,
        getQuestionCache,
        markComplete
    };
})();

window.ToolDB = ToolDB;
