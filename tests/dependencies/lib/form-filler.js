/**
 * Form Filling Utilities
 * Helper functions to fill tool forms with test data
 */

/**
 * Fill a text input field
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for input
 * @param {string} value - Value to fill
 */
async function fillTextField(page, selector, value) {
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.click(selector, { clickCount: 3 }); // Select all existing text
    await page.type(selector, value);
}

/**
 * Fill a textarea field
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for textarea
 * @param {string} value - Value to fill
 */
async function fillTextArea(page, selector, value) {
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.click(selector);
    await page.evaluate((sel) => {
        document.querySelector(sel).value = '';
    }, selector);
    await page.type(selector, value);
}

/**
 * Select a radio button
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for radio button
 */
async function selectRadio(page, selector) {
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.click(selector);
}

/**
 * Check a checkbox
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for checkbox
 * @param {boolean} checked - Whether to check or uncheck
 */
async function setCheckbox(page, selector, checked = true) {
    await page.waitForSelector(selector, { timeout: 5000 });

    const isChecked = await page.$eval(selector, el => el.checked);

    if (isChecked !== checked) {
        await page.click(selector);
    }
}

/**
 * Select an option from dropdown
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for select element
 * @param {string} value - Value to select
 */
async function selectDropdown(page, selector, value) {
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.select(selector, value);
}

/**
 * Click a button
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for button
 * @param {number} waitAfter - Milliseconds to wait after click (default: 1000)
 */
async function clickButton(page, selector, waitAfter = 1000) {
    await page.waitForSelector(selector, { timeout: 5000, visible: true });
    await page.click(selector);

    if (waitAfter > 0) {
        await page.waitForTimeout(waitAfter);
    }
}

/**
 * Fill form with data object
 * Automatically detects field types and fills accordingly
 * @param {Page} page - Puppeteer page instance
 * @param {Object} formData - Key-value pairs where keys are selectors and values are data
 *
 * Example:
 * await fillForm(page, {
 *   '#wish': 'Build a $10M company',
 *   '#outcome': 'Financial freedom',
 *   'input[name="agree"]': { type: 'checkbox', value: true }
 * });
 */
async function fillForm(page, formData) {
    for (const [selector, value] of Object.entries(formData)) {
        try {
            if (typeof value === 'object' && value.type) {
                // Explicit type provided
                switch (value.type) {
                    case 'checkbox':
                        await setCheckbox(page, selector, value.value);
                        break;
                    case 'radio':
                        await selectRadio(page, selector);
                        break;
                    case 'select':
                        await selectDropdown(page, selector, value.value);
                        break;
                    case 'textarea':
                        await fillTextArea(page, selector, value.value);
                        break;
                    default:
                        await fillTextField(page, selector, value.value);
                }
            } else {
                // Auto-detect field type
                const fieldType = await page.$eval(selector, el => {
                    if (el.tagName === 'TEXTAREA') return 'textarea';
                    if (el.tagName === 'SELECT') return 'select';
                    if (el.tagName === 'INPUT') {
                        return el.type || 'text';
                    }
                    return 'text';
                });

                switch (fieldType) {
                    case 'checkbox':
                        await setCheckbox(page, selector, value);
                        break;
                    case 'radio':
                        await selectRadio(page, selector);
                        break;
                    case 'select':
                    case 'select-one':
                        await selectDropdown(page, selector, value);
                        break;
                    case 'textarea':
                        await fillTextArea(page, selector, value);
                        break;
                    default:
                        await fillTextField(page, selector, value);
                }
            }
        } catch (error) {
            console.warn(`⚠️  Failed to fill field ${selector}: ${error.message}`);
        }
    }
}

/**
 * Submit a form
 * @param {Page} page - Puppeteer page instance
 * @param {string} submitButtonSelector - CSS selector for submit button
 * @param {number} waitAfterSubmit - Milliseconds to wait after submit (default: 2000)
 */
async function submitForm(page, submitButtonSelector, waitAfterSubmit = 2000) {
    console.log('📤 Submitting form...');

    await clickButton(page, submitButtonSelector, waitAfterSubmit);

    console.log('✓ Form submitted');
}

/**
 * Fill tool with test data using standard selectors
 * @param {Page} page - Puppeteer page instance
 * @param {Object} testData - Test data for the tool
 */
async function fillToolWithData(page, testData) {
    console.log('📝 Filling tool with test data...');

    // Most tools use data- attributes or IDs matching field names
    // This is a generic approach - specific tools may need custom logic

    for (const [key, value] of Object.entries(testData)) {
        const selector = `#${key}, [name="${key}"], [data-field="${key}"]`;

        try {
            const element = await page.$(selector);
            if (element) {
                await fillTextField(page, selector, typeof value === 'string' ? value : JSON.stringify(value));
            }
        } catch (error) {
            console.warn(`⚠️  Could not fill field ${key}: ${error.message}`);
        }
    }

    console.log('✓ Tool filled with test data');
}

module.exports = {
    fillTextField,
    fillTextArea,
    selectRadio,
    setCheckbox,
    selectDropdown,
    clickButton,
    fillForm,
    submitForm,
    fillToolWithData,
};
