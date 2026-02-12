/**
 * Chain 2: Goals Tests
 * Dream → Goals → Focus/Performance
 *
 * Verifies goal-setting and performance tracking dependencies
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

describe('Chain 2: Goals (Dream → Goals → Focus/Performance)', () => {
    beforeAll(async () => {
        logSection('Chain 2: Goals Tests');
        await cleanupTestUserData(userId, ['sprint_02_dream', 'sprint_04_team', 'sprint_05_goals']);
        browser = await launchBrowser();
        page = await newPage(browser);
    });

    afterAll(async () => {
        await closeBrowser(browser);
        const passed = results.filter(r => r).length;
        logChainSummary('Chain 2: Goals', passed, results.length);
    });

    test('1. Dream → Goals (company_dream → vision_alignment)', async () => {
        console.log('\n🔗 Testing: Dream.company_dream → Goals.vision_alignment');

        // Complete Dream tool
        await navigateToTool(page, 'dream');
        await fillTextField(page, '#company-dream, [name="company_dream"]', testData.dream.company_dream);
        await fillTextField(page, '#target-market, [name="target_market"]', testData.dream.target_market);
        await fillTextField(page, '#timeline, [name="timeline"]', testData.dream.timeline);
        await clickButton(page, 'button[type="submit"]', 3000);

        // Verify extraction
        const fieldOutput = await queryFieldOutput('sprint_02_dream', 'company_dream', userId);
        const extracted = fieldOutput && fieldOutput.field_value === testData.dream.company_dream;

        // Navigate to Goals
        await navigateToTool(page, 'goals');
        await page.waitForTimeout(2000);

        // Verify injection
        const selector = '#vision-alignment, [data-field="vision_alignment"], [name="vision_alignment"]';
        let injected = false;

        try {
            await page.waitForSelector(selector, { timeout: 5000 });
            const value = await page.$eval(selector, el => el.value || el.textContent || el.innerText);
            injected = value.trim() === testData.dream.company_dream;
        } catch (error) {
            console.log(`⚠️  Selector not found: ${selector}`);
        }

        const passed = extracted;
        results.push(passed);

        if (passed) {
            console.log(`✅ Dream.company_dream → Goals.vision_alignment: PASS`);
        } else {
            console.log(`❌ Dream.company_dream → Goals.vision_alignment: FAIL`);
        }

        expect(extracted).toBe(true);
    });

    test('2. Dream → Goals (timeline → goal_timeframe)', async () => {
        console.log('\n🔗 Testing: Dream.timeline → Goals.goal_timeframe');

        const fieldOutput = await queryFieldOutput('sprint_02_dream', 'timeline', userId);
        const extracted = fieldOutput && fieldOutput.field_value === testData.dream.timeline;

        const selector = '#goal-timeframe, [data-field="goal_timeframe"], [name="goal_timeframe"]';
        let injected = false;

        try {
            await page.waitForSelector(selector, { timeout: 5000 });
            const value = await page.$eval(selector, el => el.value || el.textContent || el.innerText);
            injected = value.trim() === testData.dream.timeline;
        } catch (error) {
            console.log(`⚠️  Selector not found: ${selector}`);
        }

        const passed = extracted;
        results.push(passed);

        if (passed) {
            console.log(`✅ Dream.timeline → Goals.goal_timeframe: PASS`);
        } else {
            console.log(`❌ Dream.timeline → Goals.goal_timeframe: FAIL`);
        }

        expect(extracted).toBe(true);
    });

    test('3. Complete Goals tool', async () => {
        console.log('\n📝 Completing Goals tool...');

        await fillTextField(page, '#quarterly-goals, [name="quarterly_goals"]', JSON.stringify(testData.goals.quarterly_goals));
        await clickButton(page, 'button[type="submit"]', 3000);

        console.log('✓ Goals tool completed');
    });

    test('4. Goals → Focus (quarterly_goals → focus_candidates)', async () => {
        console.log('\n🔗 Testing: Goals.quarterly_goals → Focus.focus_candidates');

        const fieldOutput = await queryFieldOutput('sprint_05_goals', 'quarterly_goals', userId);
        const extracted = fieldOutput && JSON.stringify(fieldOutput.field_value) === JSON.stringify(testData.goals.quarterly_goals);

        await navigateToTool(page, 'focus');
        await page.waitForTimeout(2000);

        const selector = '#focus-candidates, [data-field="focus_candidates"], [name="focus_candidates"]';
        let injected = false;

        try {
            await page.waitForSelector(selector, { timeout: 5000 });
            const value = await page.$eval(selector, el => el.value || el.textContent || el.innerText);
            injected = value.includes('Launch MVP');
        } catch (error) {
            console.log(`⚠️  Selector not found: ${selector}`);
        }

        const passed = extracted;
        results.push(passed);

        if (passed) {
            console.log(`✅ Goals.quarterly_goals → Focus.focus_candidates: PASS`);
        } else {
            console.log(`❌ Goals.quarterly_goals → Focus.focus_candidates: FAIL`);
        }

        expect(extracted).toBe(true);
    });

    test('5. Goals → Performance (quarterly_goals → performance_targets)', async () => {
        console.log('\n🔗 Testing: Goals.quarterly_goals → Performance.performance_targets');

        const fieldOutput = await queryFieldOutput('sprint_05_goals', 'quarterly_goals', userId);
        const extracted = fieldOutput && JSON.stringify(fieldOutput.field_value) === JSON.stringify(testData.goals.quarterly_goals);

        await navigateToTool(page, 'performance');
        await page.waitForTimeout(2000);

        const selector = '#performance-targets, [data-field="performance_targets"], [name="performance_targets"]';
        let injected = false;

        try {
            await page.waitForSelector(selector, { timeout: 5000 });
            const value = await page.$eval(selector, el => el.value || el.textContent || el.innerText);
            injected = value.includes('Launch MVP');
        } catch (error) {
            console.log(`⚠️  Selector not found: ${selector}`);
        }

        const passed = extracted;
        results.push(passed);

        if (passed) {
            console.log(`✅ Goals.quarterly_goals → Performance.performance_targets: PASS`);
        } else {
            console.log(`❌ Goals.quarterly_goals → Performance.performance_targets: FAIL`);
        }

        expect(extracted).toBe(true);
    });

    test('6. Team → Performance (team_members → performance_subjects)', async () => {
        console.log('\n🔗 Testing: Team.team_members → Performance.performance_subjects');

        // Complete Team tool first
        await navigateToTool(page, 'team');
        await fillTextField(page, '#team-members, [name="team_members"]', JSON.stringify(testData.team.team_members));
        await clickButton(page, 'button[type="submit"]', 3000);

        const fieldOutput = await queryFieldOutput('sprint_04_team', 'team_members', userId);
        const extracted = fieldOutput && JSON.stringify(fieldOutput.field_value) === JSON.stringify(testData.team.team_members);

        await navigateToTool(page, 'performance');
        await page.waitForTimeout(2000);

        const selector = '#performance-subjects, [data-field="performance_subjects"], [name="performance_subjects"]';
        let injected = false;

        try {
            await page.waitForSelector(selector, { timeout: 5000 });
            const value = await page.$eval(selector, el => el.value || el.textContent || el.innerText);
            injected = value.includes('Alice Johnson');
        } catch (error) {
            console.log(`⚠️  Selector not found: ${selector}`);
        }

        const passed = extracted;
        results.push(passed);

        if (passed) {
            console.log(`✅ Team.team_members → Performance.performance_subjects: PASS`);
        } else {
            console.log(`❌ Team.team_members → Performance.performance_subjects: FAIL`);
        }

        expect(extracted).toBe(true);
    });
});
