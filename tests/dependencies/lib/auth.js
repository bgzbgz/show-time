/**
 * Test User Authentication Helpers
 * Manages test user authentication via localStorage
 */

const TEST_USER_ID = process.env.TEST_USER_ID || '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad';

/**
 * Set test user authentication in localStorage
 * @param {Page} page - Puppeteer page instance
 * @param {string} userId - User UUID (defaults to TEST_USER_ID)
 */
async function authenticateTestUser(page, userId = TEST_USER_ID) {
    console.log(`🔑 Authenticating test user: ${userId}...`);

    await page.evaluate((uid) => {
        localStorage.setItem('ft_user_id', uid);
    }, userId);

    console.log('✓ Test user authenticated');
}

/**
 * Get current authenticated user ID from localStorage
 * @param {Page} page - Puppeteer page instance
 * @returns {Promise<string|null>} User ID or null if not authenticated
 */
async function getCurrentUserId(page) {
    return await page.evaluate(() => {
        return localStorage.getItem('ft_user_id');
    });
}

/**
 * Clear authentication (logout)
 * @param {Page} page - Puppeteer page instance
 */
async function clearAuth(page) {
    console.log('🔓 Clearing authentication...');

    await page.evaluate(() => {
        localStorage.removeItem('ft_user_id');
        localStorage.removeItem('lastSubmissionId');
    });

    console.log('✓ Authentication cleared');
}

/**
 * Verify user is authenticated
 * @param {Page} page - Puppeteer page instance
 * @throws {Error} If user is not authenticated
 */
async function verifyAuthenticated(page) {
    const userId = await getCurrentUserId(page);

    if (!userId) {
        throw new Error('User not authenticated. Call authenticateTestUser() first.');
    }

    if (userId !== TEST_USER_ID) {
        console.warn(`⚠️  Warning: Authenticated user (${userId}) is not the test user (${TEST_USER_ID})`);
    }

    return userId;
}

/**
 * Get test user ID constant
 * @returns {string} Test user UUID
 */
function getTestUserId() {
    return TEST_USER_ID;
}

module.exports = {
    authenticateTestUser,
    getCurrentUserId,
    clearAuth,
    verifyAuthenticated,
    getTestUserId,
    TEST_USER_ID,
};
