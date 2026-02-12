/**
 * Logging Utilities
 * Test output logging and screenshot capture
 */

const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.resolve(__dirname, '../screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

/**
 * Capture screenshot on failure
 * @param {Page} page - Puppeteer page instance
 * @param {string} name - Screenshot name (without extension)
 * @returns {Promise<string>} Path to screenshot file
 */
async function captureScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);

    try {
        await page.screenshot({
            path: filepath,
            fullPage: true,
        });

        console.log(`📸 Screenshot saved: ${filename}`);
        return filepath;
    } catch (error) {
        console.error(`❌ Failed to capture screenshot: ${error.message}`);
        return null;
    }
}

/**
 * Log test section header
 * @param {string} title - Section title
 */
function logSection(title) {
    console.log('\n' + '='.repeat(70));
    console.log(`  ${title}`);
    console.log('='.repeat(70) + '\n');
}

/**
 * Log dependency test start
 * @param {string} sourceTool - Source tool name
 * @param {string} targetTool - Target tool name
 */
function logDependencyTest(sourceTool, targetTool) {
    console.log(`\n🔗 Testing dependency: ${sourceTool} → ${targetTool}`);
}

/**
 * Log dependency test result
 * @param {boolean} passed - Whether test passed
 * @param {string} dependency - Dependency description
 * @param {Object} details - Additional details (expected, actual, error)
 */
function logDependencyResult(passed, dependency, details = {}) {
    if (passed) {
        console.log(`✅ PASS: ${dependency}`);
        if (details.value) {
            console.log(`   Value: "${details.value}"`);
        }
    } else {
        console.log(`❌ FAIL: ${dependency}`);
        if (details.expected) {
            console.log(`   Expected: ${details.expected}`);
        }
        if (details.actual !== undefined) {
            console.log(`   Actual:   ${details.actual}`);
        }
        if (details.error) {
            console.log(`   Error:    ${details.error}`);
        }
    }
}

/**
 * Log chain test summary
 * @param {string} chainName - Chain name
 * @param {number} passed - Number of tests passed
 * @param {number} total - Total number of tests
 */
function logChainSummary(chainName, passed, total) {
    const percentage = Math.round((passed / total) * 100);
    const status = passed === total ? '✅' : '❌';

    console.log('\n' + '-'.repeat(70));
    console.log(`${status} ${chainName} Summary: ${passed}/${total} passed (${percentage}%)`);
    console.log('-'.repeat(70) + '\n');
}

/**
 * Create test result object
 * @param {string} sourceFile - Source file name
 * @param {string} sourceField - Source field name
 * @param {string} targetFile - Target file name
 * @param {string} targetField - Target field name
 * @param {boolean} passed - Whether test passed
 * @param {Object} details - Test details (expected, actual, error, screenshot)
 * @returns {Object} Test result object
 */
function createTestResult(sourceFile, sourceField, targetFile, targetField, passed, details = {}) {
    return {
        source: {
            tool: sourceFile,
            field: sourceField,
        },
        target: {
            tool: targetFile,
            field: targetField,
        },
        passed,
        timestamp: new Date().toISOString(),
        details: {
            expected: details.expected,
            actual: details.actual,
            error: details.error,
            screenshot: details.screenshot,
        },
    };
}

/**
 * Save test results to JSON file
 * @param {string} filename - Output filename
 * @param {Object} results - Test results object
 */
function saveTestResults(filename, results) {
    const filepath = path.resolve(__dirname, '..', filename);

    try {
        fs.writeFileSync(filepath, JSON.stringify(results, null, 2), 'utf8');
        console.log(`💾 Test results saved: ${filename}`);
    } catch (error) {
        console.error(`❌ Failed to save test results: ${error.message}`);
    }
}

/**
 * Format duration in human-readable format
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted duration
 */
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
}

/**
 * Log test run summary
 * @param {Object} summary - Test summary object
 */
function logTestSummary(summary) {
    console.log('\n' + '='.repeat(70));
    console.log('  TEST RUN SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Tests:    ${summary.total}`);
    console.log(`Passed:         ${summary.passed} ✅`);
    console.log(`Failed:         ${summary.failed} ❌`);
    console.log(`Pass Rate:      ${summary.passRate}%`);
    console.log(`Duration:       ${formatDuration(summary.duration)}`);
    console.log('='.repeat(70) + '\n');
}

module.exports = {
    captureScreenshot,
    logSection,
    logDependencyTest,
    logDependencyResult,
    logChainSummary,
    createTestResult,
    saveTestResults,
    formatDuration,
    logTestSummary,
};
