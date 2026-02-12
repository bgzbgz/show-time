/**
 * Chain 5: Operations Tests
 * Route to Market → Core Activities → Processes → Digitalization → Digital Heart
 *
 * Verifies operational and digital transformation dependencies
 */

const { launchBrowser, closeBrowser, newPage } = require('./lib/browser');
const { getTestUserId } = require('./lib/auth');
const { navigateToTool } = require('./lib/navigation');
const { fillTextField, clickButton } = require('./lib/form-filler');
const { queryFieldOutput, cleanupTestUserData } = require('./lib/database');
const { logSection, logChainSummary } = require('./lib/logger');
const testData = require('./test-data.json');

let browser;
let page;
const userId = getTestUserId();
const results = [];

describe('Chain 5: Operations (Route to Market → Core Activities → Processes → Digitalization → Digital Heart)', () => {
    beforeAll(async () => {
        logSection('Chain 5: Operations Tests');
        await cleanupTestUserData(userId);
        browser = await launchBrowser();
        page = await newPage(browser);
    });

    afterAll(async () => {
        await closeBrowser(browser);
        const passed = results.filter(r => r).length;
        logChainSummary('Chain 5: Operations', passed, results.length);
    });

    test('1. Complete Route to Market tool', async () => {
        await navigateToTool(page, 'route-to-market');
        await fillTextField(page, '#gtm-strategy, [name="gtm_strategy"]', testData['route-to-market'].gtm_strategy);
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('2. Route to Market → Core Activities (gtm_strategy → required_activities)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_14_route_to_market', 'gtm_strategy', userId);
        const passed = fieldOutput && fieldOutput.field_value === testData['route-to-market'].gtm_strategy;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('3. Complete Core Activities tool', async () => {
        await navigateToTool(page, 'core-activities');
        await fillTextField(page, '#activities, [name="activities"]', JSON.stringify(testData['core-activities'].required_activities));
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('4. Core Activities → Processes (activities → decision_points)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_15_core_activities', 'activities', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('5. Complete Processes tool', async () => {
        await navigateToTool(page, 'processes');
        await fillTextField(page, '#core-decisions, [name="core_decisions"]', JSON.stringify(testData.processes.core_decisions));
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('6. Processes → Digitalization (core_decisions → digitalization_opportunities)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_16_processes', 'core_decisions', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('7. Complete Digitalization tool', async () => {
        await navigateToTool(page, 'digitalization');
        await fillTextField(page, '#data-requirements, [name="data_requirements"]', JSON.stringify(testData.digitalization.data_requirements));
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('8. Digitalization → Digital Heart (data_requirements → data_lake_sources)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_17_digitalization', 'data_requirements', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });
});
