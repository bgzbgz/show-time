/**
 * Tool Navigation Helpers
 * Navigate between Fast Track tools
 */

const { waitForPageReady } = require('./browser');
const { authenticateTestUser } = require('./auth');
const path = require('path');

// Base path to frontend tools
const TOOLS_BASE_PATH = path.resolve(__dirname, '../../../frontend/tools');

/**
 * Get file:// URL for a tool
 * @param {string} toolSlug - Tool slug (e.g., 'woop', 'know-thyself')
 * @returns {string} File URL to tool HTML file
 */
function getToolUrl(toolSlug) {
    // Map tool slugs to file numbers and names
    const toolMap = {
        'woop': '00-woop.html',
        'know-thyself': '01-know-thyself.html',
        'dream': '02-dream.html',
        'values': '03-values.html',
        'team': '04-team.html',
        'goals': '05-goals.html',
        'market-size': '06-market-size.html',
        'segmentation': '07-segmentation.html',
        'target-segment': '08-target-segment.html',
        'value-proposition': '09-value-proposition.html',
        'vp-testing': '10-vp-testing.html',
        'product-dev': '11-product-dev.html',
        'pricing': '12-pricing.html',
        'brand-marketing': '13-brand-marketing.html',
        'route-to-market': '14-route-to-market.html',
        'core-activities': '15-core-activities.html',
        'processes': '16-processes.html',
        'digitalization': '17-digitalization.html',
        'digital-heart': '18-digital-heart.html',
        'fit': '19-fit.html',
        'fit-abc': '20-fit-abc.html',
        'org-redesign': '21-org-redesign.html',
        'employer-branding': '22-employer-branding.html',
        'agile-teams': '23-agile-teams.html',
        'focus': '24-focus.html',
        'performance': '25-performance.html',
        'energy': '26-energy.html',
        'customer-service': '27-customer-service.html',
        'program-overview': '30-program-overview.html',
    };

    const fileName = toolMap[toolSlug];
    if (!fileName) {
        throw new Error(`Unknown tool slug: ${toolSlug}`);
    }

    const filePath = path.join(TOOLS_BASE_PATH, fileName);
    return `file://${filePath}`;
}

/**
 * Navigate to a tool and wait for it to load
 * @param {Page} page - Puppeteer page instance
 * @param {string} toolSlug - Tool slug
 * @param {boolean} authenticate - Whether to set auth after navigation (default: true)
 */
async function navigateToTool(page, toolSlug, authenticate = true) {
    console.log(`📍 Navigating to tool: ${toolSlug}...`);

    const url = getToolUrl(toolSlug);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    await waitForPageReady(page);

    // Authenticate AFTER navigation (localStorage not available before page loads with file://)
    if (authenticate) {
        await authenticateTestUser(page);
    }

    console.log(`✓ Navigated to ${toolSlug}`);
}

/**
 * Check if tool page loaded successfully
 * @param {Page} page - Puppeteer page instance
 * @returns {Promise<boolean>} True if tool loaded successfully
 */
async function isToolLoaded(page) {
    // Check if Supabase client is available (all tools should have this)
    return await page.evaluate(() => {
        return typeof window.supabaseClient !== 'undefined';
    });
}

/**
 * Wait for tool initialization (Supabase client ready)
 * @param {Page} page - Puppeteer page instance
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
async function waitForToolInitialized(page, timeout = 10000) {
    await page.waitForFunction(
        () => typeof window.supabaseClient !== 'undefined',
        { timeout }
    );
}

/**
 * Reload current tool page
 * @param {Page} page - Puppeteer page instance
 */
async function reloadTool(page) {
    console.log('🔄 Reloading tool...');
    await page.reload({ waitUntil: 'networkidle0' });
    await waitForPageReady(page);
    console.log('✓ Tool reloaded');
}

module.exports = {
    getToolUrl,
    navigateToTool,
    isToolLoaded,
    waitForToolInitialized,
    reloadTool,
};
