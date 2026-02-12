/**
 * React Form Filler
 * Directly manipulate React state for testing
 */

/**
 * Set React state for a tool
 * @param {Page} page - Puppeteer page
 * @param {Object} data - Data to set in React state
 */
async function setReactState(page, data) {
    await page.evaluate((stateData) => {
        // Find the React root element
        const rootElement = document.querySelector('#root');
        if (!rootElement) {
            throw new Error('React root element not found');
        }

        // Get the React internal instance
        const reactKey = Object.keys(rootElement).find(key =>
            key.startsWith('__reactInternalInstance') ||
            key.startsWith('__reactFiber')
        );

        if (!reactKey) {
            throw new Error('React instance not found');
        }

        const reactInstance = rootElement[reactKey];

        // Navigate up to find the component with state
        let fiber = reactInstance;
        while (fiber) {
            if (fiber.memoizedState && typeof fiber.memoizedState === 'object') {
                // Found a component with state - try to update it
                const stateNode = fiber.stateNode;
                if (stateNode && typeof stateNode.setState === 'function') {
                    stateNode.setState(stateData);
                    return true;
                }
            }
            fiber = fiber.return;
        }

        throw new Error('Could not find React component with setState');
    }, data);

    await page.waitForTimeout(500); // Let React re-render
}

/**
 * Fill WOOP tool with test data
 * @param {Page} page - Puppeteer page
 * @param {Object} testData - WOOP test data
 */
async function fillWOOP(page, testData) {
    await page.evaluate((data) => {
        // Set localStorage data (WOOP uses autosave)
        const woopData = {
            data: {
                companyId: 'test-company',
                userId: localStorage.getItem('ft_user_id'),
                outcome: data.wish,
                worldChange: data.outcome,
                feeling: 'Energized',
                steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
                mentallyRehearsed: true,
                obstacles: [{ problem: data.obstacle, solution: data.plan }],
                bigChunks: data.plan,
                firstAction: 'Start now',
                deadline: '2026-12-31'
            },
            step: 4,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('woopData', JSON.stringify(woopData));

        // Reload page to pick up the data
        window.location.reload();
    }, testData);

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
}

/**
 * Click submit button
 * @param {Page} page - Puppeteer page
 */
async function clickSubmit(page) {
    // Try multiple strategies to find and click submit button
    try {
        // Try by ID
        await page.waitForSelector('#submit-button', { timeout: 5000 });
        await page.click('#submit-button');
        return;
    } catch (e) {
        // Try by text content
        const buttons = await page.$$('button');
        for (const button of buttons) {
            const text = await page.evaluate(el => el.textContent, button);
            if (text.includes('Submit') || text.includes('submit')) {
                await button.click();
                return;
            }
        }
        throw new Error('Submit button not found');
    }
}

/**
 * Wait for submission to complete
 * @param {Page} page - Puppeteer page
 * @param {number} timeout - Timeout in ms (default: 10000)
 */
async function waitForSubmission(page, timeout = 10000) {
    // Wait for either success alert or console log
    try {
        await page.waitForFunction(
            () => {
                // Check if localStorage has lastSubmissionId (set on successful submit)
                return localStorage.getItem('lastSubmissionId') !== null;
            },
            { timeout }
        );
        console.log('✓ Submission completed successfully');
        return true;
    } catch (error) {
        console.log('⚠️  Submission may have failed or timed out');
        return false;
    }
}

module.exports = {
    setReactState,
    fillWOOP,
    clickSubmit,
    waitForSubmission,
};
