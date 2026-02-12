/**
 * Chain 4: Product Tests
 * Value Proposition → VP Testing → Product Dev → Pricing → Route to Market
 *
 * Verifies product development and go-to-market dependencies
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

describe('Chain 4: Product (Value Proposition → VP Testing → Product Dev → Pricing → Route to Market)', () => {
    beforeAll(async () => {
        logSection('Chain 4: Product Tests');
        await cleanupTestUserData(userId);
        browser = await launchBrowser();
        page = await newPage(browser);
    });

    afterAll(async () => {
        await closeBrowser(browser);
        const passed = results.filter(r => r).length;
        logChainSummary('Chain 4: Product', passed, results.length);
    });

    test('1. Complete Value Proposition tool', async () => {
        await navigateToTool(page, 'value-proposition');
        await fillTextField(page, '#value-propositions, [name="value_propositions"]', JSON.stringify(testData['value-proposition'].value_propositions));
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('2. Value Proposition → VP Testing (value_propositions → hypotheses_to_test)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_09_value_proposition', 'value_propositions', userId);
        const passed = fieldOutput && JSON.stringify(fieldOutput.field_value) === JSON.stringify(testData['value-proposition'].value_propositions);
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('3. Complete VP Testing tool', async () => {
        await navigateToTool(page, 'vp-testing');
        await fillTextField(page, '#validated-propositions, [name="validated_propositions"]', JSON.stringify(testData['vp-testing'].validated_propositions));
        await fillTextField(page, '#willingness-to-pay, [name="willingness_to_pay"]', testData['vp-testing'].willingness_to_pay);
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('4. VP Testing → Product Dev (validated_propositions → product_requirements)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_10_vp_testing', 'validated_propositions', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('5. VP Testing → Product Dev (willingness_to_pay → wtp_baseline)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_10_vp_testing', 'willingness_to_pay', userId);
        const passed = fieldOutput && fieldOutput.field_value === testData['vp-testing'].willingness_to_pay;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('6. Complete Product Dev tool', async () => {
        await navigateToTool(page, 'product-dev');
        await fillTextField(page, '#product-tiers, [name="product_tiers"]', JSON.stringify(testData['product-dev'].product_tiers));
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('7. Product Dev → Pricing (product_tiers → pricing_tiers)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_11_product_dev', 'product_tiers', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('8. Complete Pricing tool', async () => {
        await navigateToTool(page, 'pricing');
        await fillTextField(page, '#pricing-model, [name="pricing_model"]', testData.pricing.pricing_model);
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('9. Pricing → Route to Market (pricing_model → revenue_model)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_12_pricing', 'pricing_model', userId);
        const passed = fieldOutput && fieldOutput.field_value === testData.pricing.pricing_model;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('10. Complete Brand Marketing and verify Route to Market dependency', async () => {
        await navigateToTool(page, 'brand-marketing');
        await fillTextField(page, '#marketing-channels, [name="marketing_channels"]', JSON.stringify(testData['brand-marketing'].marketing_channels));
        await clickButton(page, 'button[type="submit"]', 3000);

        const fieldOutput = await queryFieldOutput('sprint_13_brand_marketing', 'marketing_channels', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });
});
