/**
 * Chain 6: Team & Culture Tests
 * Team → FIT ABC → Org Redesign → Employer Branding/Agile Teams
 *
 * Verifies team development and organizational design dependencies
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

describe('Chain 6: Team & Culture (Team → FIT ABC → Org Redesign → Employer Branding/Agile Teams)', () => {
    beforeAll(async () => {
        logSection('Chain 6: Team & Culture Tests');
        await cleanupTestUserData(userId);
        browser = await launchBrowser();
        page = await newPage(browser);
    });

    afterAll(async () => {
        await closeBrowser(browser);
        const passed = results.filter(r => r).length;
        logChainSummary('Chain 6: Team & Culture', passed, results.length);
    });

    test('1. Complete Team and Values tools', async () => {
        await navigateToTool(page, 'team');
        await fillTextField(page, '#team-members, [name="team_members"]', JSON.stringify(testData.team.team_members));
        await clickButton(page, 'button[type="submit"]', 3000);

        await navigateToTool(page, 'values');
        await fillTextField(page, '#core-values, [name="core_values"]', JSON.stringify(testData.values.core_values));
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('2. Team → FIT ABC (team_members → assessment_subjects)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_04_team', 'team_members', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('3. Values → FIT ABC (core_values → cultural_benchmark)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_03_values', 'core_values', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('4. Complete FIT ABC tool', async () => {
        await navigateToTool(page, 'fit-abc');
        await fillTextField(page, '#team-assessment, [name="team_assessment"]', JSON.stringify(testData['fit-abc'].team_assessment));
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('5. FIT ABC → Org Redesign (team_assessment → current_state)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_19_fit_abc', 'team_assessment', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('6. Complete Org Redesign tool', async () => {
        await navigateToTool(page, 'org-redesign');
        await fillTextField(page, '#target-roles, [name="target_roles"]', JSON.stringify(testData['org-redesign'].target_roles));
        await fillTextField(page, '#org-structure, [name="org_structure"]', JSON.stringify(testData['org-redesign'].org_structure));
        await clickButton(page, 'button[type="submit"]', 3000);
    });

    test('7. Org Redesign → Employer Branding (target_roles → recruitment_focus)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_20_org_redesign', 'target_roles', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('8. Values → Employer Branding (core_values → employer_brand_values)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_03_values', 'core_values', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });

    test('9. Org Redesign → Agile Teams (org_structure → team_structure)', async () => {
        const fieldOutput = await queryFieldOutput('sprint_20_org_redesign', 'org_structure', userId);
        const passed = fieldOutput !== null;
        results.push(passed);
        console.log(passed ? '✅ PASS' : '❌ FAIL');
        expect(passed).toBe(true);
    });
});
