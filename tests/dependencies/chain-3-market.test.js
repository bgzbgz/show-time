/**
 * Chain 3: Market Tests
 * Dream → Market Size → Segmentation → Target Segment → Value Proposition
 *
 * Verifies market analysis and value proposition dependencies
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

describe('Chain 3: Market (Dream → Market Size → Segmentation → Target Segment → Value Proposition)', () => {
    beforeAll(async () => {
        logSection('Chain 3: Market Tests');
        await cleanupTestUserData(userId, [
            'sprint_02_dream',
            'sprint_06_market_size',
            'sprint_07_segmentation',
            'sprint_08_target_segment',
            'sprint_09_value_proposition'
        ]);
        browser = await launchBrowser();
        page = await newPage(browser);
    });

    afterAll(async () => {
        await closeBrowser(browser);
        const passed = results.filter(r => r).length;
        logChainSummary('Chain 3: Market', passed, results.length);
    });

    test('1. Dream → Market Size (target_market → market_definition)', async () => {
        console.log('\n🔗 Testing: Dream.target_market → Market Size.market_definition');

        // Complete Dream
        await navigateToTool(page, 'dream');
        await fillTextField(page, '#company-dream, [name="company_dream"]', testData.dream.company_dream);
        await fillTextField(page, '#target-market, [name="target_market"]', testData.dream.target_market);
        await fillTextField(page, '#timeline, [name="timeline"]', testData.dream.timeline);
        await clickButton(page, 'button[type="submit"]', 3000);

        const fieldOutput = await queryFieldOutput('sprint_02_dream', 'target_market', userId);
        const passed = fieldOutput && fieldOutput.field_value === testData.dream.target_market;

        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('2. Complete Market Size tool', async () => {
        console.log('\n📝 Completing Market Size tool...');

        await navigateToTool(page, 'market-size');
        await fillTextField(page, '#tam, [name="tam"]', testData['market-size'].tam);
        await fillTextField(page, '#market-segments, [name="market_segments"]', JSON.stringify(testData['market-size'].market_segments));
        await clickButton(page, 'button[type="submit"]', 3000);

        console.log('✓ Market Size completed');
    });

    test('3. Market Size → Segmentation (tam → total_addressable_market)', async () => {
        console.log('\n🔗 Testing: Market Size.tam → Segmentation.total_addressable_market');

        const fieldOutput = await queryFieldOutput('sprint_06_market_size', 'tam', userId);
        const passed = fieldOutput && fieldOutput.field_value === testData['market-size'].tam;

        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('4. Market Size → Segmentation (market_segments → segment_list)', async () => {
        console.log('\n🔗 Testing: Market Size.market_segments → Segmentation.segment_list');

        const fieldOutput = await queryFieldOutput('sprint_06_market_size', 'market_segments', userId);
        const passed = fieldOutput && JSON.stringify(fieldOutput.field_value) === JSON.stringify(testData['market-size'].market_segments);

        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('5. Complete Segmentation tool', async () => {
        console.log('\n📝 Completing Segmentation tool...');

        await navigateToTool(page, 'segmentation');
        await fillTextField(page, '#selected-segment, [name="selected_segment"]', testData.segmentation.selected_segment);
        await clickButton(page, 'button[type="submit"]', 3000);

        console.log('✓ Segmentation completed');
    });

    test('6. Segmentation → Target Segment (selected_segment → target_segment)', async () => {
        console.log('\n🔗 Testing: Segmentation.selected_segment → Target Segment.target_segment');

        const fieldOutput = await queryFieldOutput('sprint_07_segmentation', 'selected_segment', userId);
        const passed = fieldOutput && fieldOutput.field_value === testData.segmentation.selected_segment;

        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('7. Complete Target Segment tool', async () => {
        console.log('\n📝 Completing Target Segment tool...');

        await navigateToTool(page, 'target-segment');
        await fillTextField(page, '#customer-jobs, [name="customer_jobs"]', JSON.stringify(testData['target-segment'].customer_jobs));
        await fillTextField(page, '#pains, [name="pains"]', JSON.stringify(testData['target-segment'].pains));
        await fillTextField(page, '#gains, [name="gains"]', JSON.stringify(testData['target-segment'].gains));
        await clickButton(page, 'button[type="submit"]', 3000);

        console.log('✓ Target Segment completed');
    });

    test('8. Target Segment → Value Proposition (customer_jobs → jobs_to_be_done)', async () => {
        console.log('\n🔗 Testing: Target Segment.customer_jobs → Value Proposition.jobs_to_be_done');

        const fieldOutput = await queryFieldOutput('sprint_08_target_segment', 'customer_jobs', userId);
        const passed = fieldOutput && JSON.stringify(fieldOutput.field_value) === JSON.stringify(testData['target-segment'].customer_jobs);

        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('9. Target Segment → Value Proposition (pains → pain_points)', async () => {
        console.log('\n🔗 Testing: Target Segment.pains → Value Proposition.pain_points');

        const fieldOutput = await queryFieldOutput('sprint_08_target_segment', 'pains', userId);
        const passed = fieldOutput && JSON.stringify(fieldOutput.field_value) === JSON.stringify(testData['target-segment'].pains);

        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('10. Target Segment → Value Proposition (gains → desired_gains)', async () => {
        console.log('\n🔗 Testing: Target Segment.gains → Value Proposition.desired_gains');

        const fieldOutput = await queryFieldOutput('sprint_08_target_segment', 'gains', userId);
        const passed = fieldOutput && JSON.stringify(fieldOutput.field_value) === JSON.stringify(testData['target-segment'].gains);

        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });
});
