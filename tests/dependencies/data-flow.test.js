/**
 * Data Flow Test - Chain 1
 * Tests that data flows correctly through field_outputs
 * Bypasses UI to focus on backend data flow
 */

const { getTestUserId } = require('./lib/auth');
const { cleanupTestUserData, queryFieldOutput } = require('./lib/database');
const { submitWOOP, submitKnowThyself, submitDream, submitValues, submitTeam } = require('./lib/direct-submit');
const { logSection, logChainSummary } = require('./lib/logger');
const testData = require('./test-data.json');

const userId = getTestUserId();
const results = [];

describe('Data Flow Test - Chain 1 (Backend)', () => {
    beforeAll(async () => {
        logSection('Data Flow Test - Chain 1');
        console.log('Test User:', userId);
        await cleanupTestUserData(userId);
    });

    afterAll(() => {
        const passed = results.filter(r => r).length;
        const total = results.length;
        logChainSummary('Chain 1 Data Flow', passed, total);
    });

    test('1. Submit WOOP data', async () => {
        console.log('\n📝 Step 1: Submitting WOOP data...');
        const submissionId = await submitWOOP(userId, testData.woop);
        expect(submissionId).toBeDefined();
        console.log('✓ WOOP submitted');
        results.push(true);
    });

    test('2. Verify WOOP.wish extracted to field_outputs', async () => {
        console.log('\n🔍 Step 2: Verifying field extraction...');

        const result = await queryFieldOutput('sprint_00_woop', 'wish', userId);

        if (result) {
            console.log(`✅ WOOP.wish extracted:`, result.field_value);
            results.push(true);
            expect(result.field_value).toBeDefined();
        } else {
            console.log('❌ WOOP.wish not found in field_outputs');
            results.push(false);
            expect(result).not.toBeNull();
        }
    });

    test('3. Submit Know Thyself data', async () => {
        console.log('\n📝 Step 3: Submitting Know Thyself data...');
        const submissionId = await submitKnowThyself(userId, testData['know-thyself']);
        expect(submissionId).toBeDefined();
        console.log('✓ Know Thyself submitted');
        results.push(true);
    });

    test('4. Verify Know Thyself.identity extracted', async () => {
        console.log('\n🔍 Step 4: Verifying identity extraction...');

        const result = await queryFieldOutput('sprint_01_know_thyself', 'identity', userId);

        if (result) {
            console.log(`✅ identity extracted:`, result.field_value);
            results.push(true);
            expect(result.field_value).toBeDefined();
        } else {
            console.log('❌ identity not found in field_outputs');
            results.push(false);
            expect(result).not.toBeNull();
        }
    });

    test('5. Submit Dream data', async () => {
        console.log('\n📝 Step 5: Submitting Dream data...');
        const submissionId = await submitDream(userId, testData.dream);
        expect(submissionId).toBeDefined();
        console.log('✓ Dream submitted');
        results.push(true);
    });

    test('6. Verify Dream.company_dream extracted', async () => {
        console.log('\n🔍 Step 6: Verifying company_dream extraction...');

        const result = await queryFieldOutput('sprint_02_dream', 'company_dream', userId);

        if (result) {
            console.log(`✅ company_dream extracted:`, result.field_value);
            results.push(true);
            expect(result.field_value).toBe(testData.dream.company_dream);
        } else {
            console.log('❌ company_dream not found in field_outputs');
            results.push(false);
            expect(result).not.toBeNull();
        }
    });

    test('7. Submit Values data', async () => {
        console.log('\n📝 Step 7: Submitting Values data...');
        const submissionId = await submitValues(userId, testData.values);
        expect(submissionId).toBeDefined();
        console.log('✓ Values submitted');
        results.push(true);
    });

    test('8. Verify Values.core_values extracted', async () => {
        console.log('\n🔍 Step 8: Verifying core_values extraction...');

        const result = await queryFieldOutput('sprint_03_values', 'core_values', userId);

        if (result) {
            console.log(`✅ core_values extracted:`, result.field_value);
            results.push(true);
            expect(result.field_value).toBeDefined();
        } else {
            console.log('❌ core_values not found in field_outputs');
            results.push(false);
            expect(result).not.toBeNull();
        }
    });

    test('9. Submit Team data', async () => {
        console.log('\n📝 Step 9: Submitting Team data...');
        const submissionId = await submitTeam(userId, testData.team);
        expect(submissionId).toBeDefined();
        console.log('✓ Team submitted');
        results.push(true);
    });

    test('10. Verify Team.team_members extracted', async () => {
        console.log('\n🔍 Step 10: Verifying team_members extraction...');

        const result = await queryFieldOutput('sprint_04_team', 'team_members', userId);

        if (result) {
            console.log(`✅ team_members extracted:`, result.field_value);
            results.push(true);
            expect(result.field_value).toBeDefined();
        } else {
            console.log('❌ team_members not found in field_outputs');
            results.push(false);
            expect(result).not.toBeNull();
        }
    });

    test('11. Verify complete data chain', async () => {
        console.log('\n📊 Final verification: Complete data chain...');

        const chain = [
            { schema: 'sprint_00_woop', field: 'wish', tool: 'WOOP' },
            { schema: 'sprint_01_know_thyself', field: 'identity', tool: 'Know Thyself' },
            { schema: 'sprint_02_dream', field: 'company_dream', tool: 'Dream' },
            { schema: 'sprint_03_values', field: 'core_values', tool: 'Values' },
            { schema: 'sprint_04_team', field: 'team_members', tool: 'Team' }
        ];

        let passed = 0;
        for (const link of chain) {
            const result = await queryFieldOutput(link.schema, link.field, userId);
            if (result) {
                console.log(`  ✓ ${link.tool}.${link.field}`);
                passed++;
            } else {
                console.log(`  ✗ ${link.tool}.${link.field}`);
            }
        }

        console.log(`\nChain integrity: ${passed}/${chain.length} links verified`);
        results.push(passed === chain.length);
        expect(passed).toBe(chain.length);
    });
});
