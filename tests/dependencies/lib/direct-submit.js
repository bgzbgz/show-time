/**
 * Direct Submission Helper
 * Submit data directly to Supabase bypassing UI
 */

const { supabase } = require('./database');

/**
 * Submit tool data directly via RPC
 * @param {string} schemaName - Schema name (e.g., 'sprint_00_woop')
 * @param {string} userId - User ID
 * @param {Object} data - Tool data to submit
 * @param {string} toolSlug - Tool slug (e.g., 'woop')
 */
async function submitToolData(schemaName, userId, data, toolSlug) {
    console.log(`📤 Submitting ${toolSlug} data directly...`);

    const { data: result, error } = await supabase.rpc('submit_tool_data', {
        p_schema_name: schemaName,
        p_user_id: userId,
        p_data: data,
        p_tool_slug: toolSlug
    });

    if (error) {
        console.error(`❌ Submission failed:`, error);
        throw error;
    }

    if (!result || !result.success) {
        throw new Error(result?.message || 'Submission failed');
    }

    console.log(`✓ ${toolSlug} submitted successfully (ID: ${result.submission_id})`);
    return result.submission_id;
}

/**
 * Submit WOOP data
 * @param {string} userId - User ID
 * @param {Object} testData - WOOP test data
 */
async function submitWOOP(userId, testData) {
    const data = {
        companyId: 'test-company',
        userId: userId,
        wish: {
            outcome: testData.wish,
            worldChange: testData.outcome,
            feeling: 'Energized'
        },
        outcome: {
            steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
            mentallyRehearsed: true
        },
        obstacles: [{ problem: testData.obstacle, solution: testData.plan }],
        plan: {
            bigChunks: testData.plan,
            firstAction: 'Start now',
            deadline: '2026-12-31'
        }
    };

    return await submitToolData('sprint_00_woop', userId, data, 'woop');
}

/**
 * Submit Know Thyself data
 * @param {string} userId - User ID
 * @param {Object} testData - Know Thyself test data
 */
async function submitKnowThyself(userId, testData) {
    const data = {
        userName: 'Test User',
        userEmail: 'test@example.com',
        identity: testData.identity,
        strengths: [],
        weaknesses: []
    };

    return await submitToolData('sprint_01_know_thyself', userId, data, 'know-thyself');
}

/**
 * Submit Dream data
 * @param {string} userId - User ID
 * @param {Object} testData - Dream test data
 */
async function submitDream(userId, testData) {
    const data = {
        company_dream: testData.company_dream,
        target_market: testData.target_market,
        timeline: testData.timeline
    };

    return await submitToolData('sprint_02_dream', userId, data, 'dream');
}

/**
 * Submit Values data
 * @param {string} userId - User ID
 * @param {Object} testData - Values test data
 */
async function submitValues(userId, testData) {
    const data = {
        core_values: testData.core_values
    };

    return await submitToolData('sprint_03_values', userId, data, 'values');
}

/**
 * Submit Team data
 * @param {string} userId - User ID
 * @param {Object} testData - Team test data
 */
async function submitTeam(userId, testData) {
    const data = {
        team_members: testData.team_members
    };

    return await submitToolData('sprint_04_team', userId, data, 'team');
}

module.exports = {
    submitToolData,
    submitWOOP,
    submitKnowThyself,
    submitDream,
    submitValues,
    submitTeam,
};
