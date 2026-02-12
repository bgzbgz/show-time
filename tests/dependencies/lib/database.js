/**
 * Supabase Query Wrappers
 * Database interaction helpers for verifying field_outputs
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vpfayzzjnegdefjrnyoc.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZmF5enpqbmVnZGVmanJueW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzAwODUsImV4cCI6MjA4NTcwNjA4NX0.7qwzd9kwyRG0Wx9DDSc8F9a1SRD0CoC6CGS-9M1sxIs';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Query field_outputs for a specific tool and field
 * @param {string} schemaName - Schema name (e.g., 'sprint_00_woop')
 * @param {string} fieldId - Field identifier (e.g., 'wish')
 * @param {string} userId - User UUID
 * @returns {Promise<Object|null>} Field output record or null
 */
async function queryFieldOutput(schemaName, fieldId, userId) {
    const query = `
        SELECT fo.field_id, fo.field_value, fo.created_at
        FROM ${schemaName}.field_outputs fo
        JOIN ${schemaName}.submissions s ON fo.submission_id = s.id
        WHERE s.user_id = '${userId}' AND fo.field_id = '${fieldId}'
        ORDER BY fo.created_at DESC
        LIMIT 1
    `;

    const { data, error } = await supabase.rpc('execute_sql', { query });

    if (error) {
        console.error(`❌ Database query error: ${error.message}`);
        return null;
    }

    return data && data.length > 0 ? data[0] : null;
}

/**
 * Delete all submissions for test user (cleanup)
 * @param {string} userId - User UUID
 * @param {Array<string>} schemas - Schema names to clean (default: all known schemas)
 */
async function cleanupTestUserData(userId, schemas = [
    'sprint_00_woop',
    'sprint_01_know_thyself',
    'sprint_02_dream',
    'sprint_03_values',
    'sprint_04_team',
    'sprint_05_goals',
]) {
    console.log(`🧹 Cleaning up test data for user ${userId}...`);

    for (const schema of schemas) {
        try {
            // Delete field_outputs first (foreign key constraint)
            const deleteFieldOutputs = `
                DELETE FROM ${schema}.field_outputs
                WHERE submission_id IN (
                    SELECT id FROM ${schema}.submissions WHERE user_id = '${userId}'
                )
            `;
            await supabase.rpc('execute_sql', { query: deleteFieldOutputs });

            // Delete submissions
            const deleteSubmissions = `
                DELETE FROM ${schema}.submissions WHERE user_id = '${userId}'
            `;
            const { error } = await supabase.rpc('execute_sql', { query: deleteSubmissions });

            if (error) {
                console.warn(`⚠️  Failed to clean ${schema}: ${error.message}`);
            }
        } catch (err) {
            console.warn(`⚠️  Error cleaning ${schema}: ${err.message}`);
        }
    }

    // Clean user progress
    const deleteProgress = `
        DELETE FROM shared.user_progress WHERE user_id = '${userId}'
    `;
    await supabase.rpc('execute_sql', { query: deleteProgress });

    console.log('✓ Cleanup complete');
}

/**
 * Verify submission exists for user in schema
 * @param {string} schemaName - Schema name
 * @param {string} userId - User UUID
 * @returns {Promise<boolean>} True if submission exists
 */
async function hasSubmission(schemaName, userId) {
    const query = `
        SELECT COUNT(*) as count
        FROM ${schemaName}.submissions
        WHERE user_id = '${userId}'
    `;

    const { data, error } = await supabase.rpc('execute_sql', { query });

    if (error) {
        console.error(`❌ Database query error: ${error.message}`);
        return false;
    }

    return data && data.length > 0 && data[0].count > 0;
}

/**
 * Get all field_outputs for a user in a schema
 * @param {string} schemaName - Schema name
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} Array of field_output records
 */
async function getAllFieldOutputs(schemaName, userId) {
    const query = `
        SELECT fo.field_id, fo.field_value, fo.created_at
        FROM ${schemaName}.field_outputs fo
        JOIN ${schemaName}.submissions s ON fo.submission_id = s.id
        WHERE s.user_id = '${userId}'
        ORDER BY fo.created_at
    `;

    const { data, error } = await supabase.rpc('execute_sql', { query });

    if (error) {
        console.error(`❌ Database query error: ${error.message}`);
        return [];
    }

    return data || [];
}

/**
 * Execute raw SQL query
 * @param {string} query - SQL query string
 * @returns {Promise<Object>} Query result
 */
async function executeSQL(query) {
    const { data, error } = await supabase.rpc('execute_sql', { query });

    if (error) {
        throw new Error(`Database error: ${error.message}`);
    }

    return data;
}

module.exports = {
    supabase,
    queryFieldOutput,
    cleanupTestUserData,
    hasSubmission,
    getAllFieldOutputs,
    executeSQL,
};
