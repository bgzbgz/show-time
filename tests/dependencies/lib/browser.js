/**
 * Browser Launch and Close Functions
 * Puppeteer browser lifecycle management
 */

const puppeteer = require('puppeteer');

/**
 * Launch browser with appropriate configuration
 * @param {Object} options - Launch options
 * @param {boolean} options.headless - Run in headless mode (default: true)
 * @param {number} options.slowMo - Slow down by N milliseconds (default: 0)
 * @returns {Promise<Browser>}
 */
async function launchBrowser(options = {}) {
    const {
        headless = process.env.HEADLESS !== 'false',
        slowMo = parseInt(process.env.SLOW_MO) || 0,
    } = options;

    console.log(`🚀 Launching browser (headless: ${headless}, slowMo: ${slowMo}ms)...`);

    const browser = await puppeteer.launch({
        headless,
        slowMo,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security', // Allow cross-origin for local files
        ],
        defaultViewport: {
            width: 1280,
            height: 800,
        },
    });

    console.log('✓ Browser launched');
    return browser;
}

/**
 * Close browser and cleanup resources
 * @param {Browser} browser - Puppeteer browser instance
 */
async function closeBrowser(browser) {
    if (browser) {
        console.log('🔒 Closing browser...');
        await browser.close();
        console.log('✓ Browser closed');
    }
}

/**
 * Create new page with error handling
 * @param {Browser} browser - Puppeteer browser instance
 * @returns {Promise<Page>}
 */
async function newPage(browser) {
    const page = await browser.newPage();

    // Listen for console messages from the page
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error') {
            console.log(`❌ Browser console error: ${msg.text()}`);
        } else if (type === 'warning') {
            console.log(`⚠️  Browser console warning: ${msg.text()}`);
        }
    });

    // Listen for page errors
    page.on('pageerror', error => {
        console.log(`❌ Page error: ${error.message}`);
    });

    return page;
}

/**
 * Wait for page to be ready (DOM loaded and idle)
 * @param {Page} page - Puppeteer page instance
 * @param {number} timeout - Timeout in milliseconds (default: 30000)
 */
async function waitForPageReady(page, timeout = 30000) {
    await page.waitForFunction(
        () => document.readyState === 'complete',
        { timeout }
    );

    // Additional wait for network idle
    await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {
        // Ignore network idle timeout - page may have long-polling
    });
}

module.exports = {
    launchBrowser,
    closeBrowser,
    newPage,
    waitForPageReady,
};
