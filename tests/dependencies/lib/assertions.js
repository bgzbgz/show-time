/**
 * Dependency Verification Functions
 * Assertion helpers for verifying data flow between tools
 */

const { queryFieldOutput } = require('./database');
const { captureScreenshot } = require('./logger');

/**
 * Verify field extracted to field_outputs table
 * @param {string} schemaName - Schema name (e.g., 'sprint_00_woop')
 * @param {string} fieldId - Field identifier (e.g., 'wish')
 * @param {string} expectedValue - Expected field value
 * @param {string} userId - User UUID
 * @param {Page} page - Puppeteer page for screenshot on failure
 * @returns {Promise<boolean>} True if verification passed
 */
async function assertFieldExtracted(schemaName, fieldId, expectedValue, userId, page) {
    console.log(`🔍 Verifying ${schemaName}.${fieldId} extracted...`);

    const fieldOutput = await queryFieldOutput(schemaName, fieldId, userId);

    if (!fieldOutput) {
        console.error(`❌ Field not found in field_outputs: ${schemaName}.${fieldId}`);
        if (page) await captureScreenshot(page, `extraction-failed-${schemaName}-${fieldId}`);
        return false;
    }

    const actualValue = typeof fieldOutput.field_value === 'object'
        ? JSON.stringify(fieldOutput.field_value)
        : fieldOutput.field_value;

    const expectedStr = typeof expectedValue === 'object'
        ? JSON.stringify(expectedValue)
        : expectedValue;

    if (actualValue !== expectedStr) {
        console.error(`❌ Field value mismatch in ${schemaName}.${fieldId}`);
        console.error(`   Expected: ${expectedStr}`);
        console.error(`   Actual:   ${actualValue}`);
        if (page) await captureScreenshot(page, `value-mismatch-${schemaName}-${fieldId}`);
        return false;
    }

    console.log(`✅ ${schemaName}.${fieldId} extracted correctly: "${actualValue}"`);
    return true;
}

/**
 * Verify field appears in dependent tool's UI
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for the field in target tool
 * @param {string} expectedValue - Expected value to appear
 * @param {string} dependencyName - Description of dependency (for logging)
 * @returns {Promise<boolean>} True if verification passed
 */
async function assertFieldInjected(page, selector, expectedValue, dependencyName) {
    console.log(`🔍 Verifying ${dependencyName} injected...`);

    try {
        await page.waitForSelector(selector, { timeout: 5000 });
    } catch (error) {
        console.error(`❌ Selector not found: ${selector}`);
        await captureScreenshot(page, `selector-not-found-${dependencyName.replace(/[^a-z0-9]/gi, '-')}`);
        return false;
    }

    // Get value from the element
    const actualValue = await page.$eval(selector, el => {
        // Try different ways to get the value
        if (el.value !== undefined) return el.value;
        if (el.textContent) return el.textContent.trim();
        if (el.innerText) return el.innerText.trim();
        return el.innerHTML.trim();
    });

    const expectedStr = typeof expectedValue === 'object'
        ? JSON.stringify(expectedValue)
        : String(expectedValue).trim();

    const actualStr = String(actualValue).trim();

    if (actualStr !== expectedStr) {
        console.error(`❌ Field value mismatch for ${dependencyName}`);
        console.error(`   Selector: ${selector}`);
        console.error(`   Expected: ${expectedStr}`);
        console.error(`   Actual:   ${actualStr}`);
        await captureScreenshot(page, `injection-mismatch-${dependencyName.replace(/[^a-z0-9]/gi, '-')}`);
        return false;
    }

    console.log(`✅ ${dependencyName} injected correctly: "${actualStr}"`);
    return true;
}

/**
 * Verify complete dependency (extraction + injection)
 * @param {Object} options - Verification options
 * @param {string} options.sourceSchema - Source schema name
 * @param {string} options.sourceField - Source field ID
 * @param {string} options.sourceTool - Source tool name (for logging)
 * @param {Page} options.targetPage - Target tool page instance
 * @param {string} options.targetSelector - Target field selector
 * @param {string} options.targetTool - Target tool name (for logging)
 * @param {string} options.targetField - Target field name (for logging)
 * @param {string} options.expectedValue - Expected value
 * @param {string} options.userId - User UUID
 * @returns {Promise<boolean>} True if both extraction and injection passed
 */
async function assertDependency(options) {
    const {
        sourceSchema,
        sourceField,
        sourceTool,
        targetPage,
        targetSelector,
        targetTool,
        targetField,
        expectedValue,
        userId,
    } = options;

    const dependencyName = `${sourceTool}.${sourceField} → ${targetTool}.${targetField}`;

    console.log(`\n🔗 Verifying dependency: ${dependencyName}`);

    // Step 1: Verify extraction
    const extractionPassed = await assertFieldExtracted(
        sourceSchema,
        sourceField,
        expectedValue,
        userId,
        targetPage
    );

    if (!extractionPassed) {
        console.error(`❌ FAIL: ${dependencyName} (extraction failed)`);
        return false;
    }

    // Step 2: Verify injection
    const injectionPassed = await assertFieldInjected(
        targetPage,
        targetSelector,
        expectedValue,
        dependencyName
    );

    if (!injectionPassed) {
        console.error(`❌ FAIL: ${dependencyName} (injection failed)`);
        return false;
    }

    console.log(`✅ PASS: ${dependencyName}`);
    return true;
}

/**
 * Assert element exists on page
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector
 * @param {string} description - Description for logging
 * @returns {Promise<boolean>} True if element exists
 */
async function assertElementExists(page, selector, description) {
    try {
        await page.waitForSelector(selector, { timeout: 5000 });
        console.log(`✅ Element found: ${description}`);
        return true;
    } catch (error) {
        console.error(`❌ Element not found: ${description} (${selector})`);
        await captureScreenshot(page, `element-not-found-${description.replace(/[^a-z0-9]/gi, '-')}`);
        return false;
    }
}

/**
 * Assert element has specific text
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector
 * @param {string} expectedText - Expected text content
 * @param {string} description - Description for logging
 * @returns {Promise<boolean>} True if text matches
 */
async function assertElementText(page, selector, expectedText, description) {
    try {
        await page.waitForSelector(selector, { timeout: 5000 });

        const actualText = await page.$eval(selector, el => el.textContent.trim());

        if (actualText === expectedText) {
            console.log(`✅ Text matches: ${description}`);
            return true;
        } else {
            console.error(`❌ Text mismatch: ${description}`);
            console.error(`   Expected: ${expectedText}`);
            console.error(`   Actual:   ${actualText}`);
            await captureScreenshot(page, `text-mismatch-${description.replace(/[^a-z0-9]/gi, '-')}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Element not found: ${description} (${selector})`);
        await captureScreenshot(page, `element-not-found-${description.replace(/[^a-z0-9]/gi, '-')}`);
        return false;
    }
}

module.exports = {
    assertFieldExtracted,
    assertFieldInjected,
    assertDependency,
    assertElementExists,
    assertElementText,
};
