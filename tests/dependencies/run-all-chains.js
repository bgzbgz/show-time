/**
 * Master Test Runner
 * Runs all 6 dependency chain tests and generates comprehensive reports
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { cleanupTestUserData } = require('./lib/database');
const { getTestUserId } = require('./lib/auth');
const { logSection, formatDuration } = require('./lib/logger');

const TEST_FILES = [
    'chain-1-foundation.test.js',
    'chain-2-goals.test.js',
    'chain-3-market.test.js',
    'chain-4-product.test.js',
    'chain-5-operations.test.js',
    'chain-6-team.test.js',
];

const CHAIN_NAMES = {
    'chain-1-foundation': 'Chain 1: Foundation',
    'chain-2-goals': 'Chain 2: Goals',
    'chain-3-market': 'Chain 3: Market',
    'chain-4-product': 'Chain 4: Product',
    'chain-5-operations': 'Chain 5: Operations',
    'chain-6-team': 'Chain 6: Team & Culture',
};

async function runAllChains() {
    logSection('DEPENDENCY TEST SUITE - ALL CHAINS');

    const startTime = Date.now();
    const userId = getTestUserId();
    const results = {
        timestamp: new Date().toISOString(),
        testUser: userId,
        environment: process.env.NODE_ENV || 'local',
        chains: {},
        summary: {
            total: 0,
            passed: 0,
            failed: 0,
            passRate: 0,
            duration: 0,
        },
    };

    console.log(`Test User: ${userId}`);
    console.log(`Environment: ${results.environment}`);
    console.log(`Timestamp: ${results.timestamp}\n`);

    // Cleanup test data before starting
    console.log('🧹 Cleaning up test data before running tests...');
    await cleanupTestUserData(userId);
    console.log('✓ Cleanup complete\n');

    // Run each chain test
    for (const testFile of TEST_FILES) {
        const chainName = path.basename(testFile, '.test.js');
        const displayName = CHAIN_NAMES[chainName] || chainName;

        console.log(`\n${'='.repeat(70)}`);
        console.log(`Running: ${displayName}`);
        console.log('='.repeat(70));

        try {
            const output = execSync(`npm test ${testFile}`, {
                cwd: __dirname,
                encoding: 'utf8',
                stdio: 'inherit',
            });

            results.chains[chainName] = {
                name: displayName,
                status: 'passed',
                output: 'See console output',
            };
        } catch (error) {
            console.error(`\n❌ ${displayName} failed`);

            results.chains[chainName] = {
                name: displayName,
                status: 'failed',
                error: error.message,
            };
        }
    }

    const endTime = Date.now();
    results.summary.duration = endTime - startTime;

    // Calculate summary statistics
    const chainResults = Object.values(results.chains);
    results.summary.total = chainResults.length;
    results.summary.passed = chainResults.filter(c => c.status === 'passed').length;
    results.summary.failed = chainResults.filter(c => c.status === 'failed').length;
    results.summary.passRate = Math.round((results.summary.passed / results.summary.total) * 100);

    // Generate reports
    await generateReports(results);

    // Print final summary
    printSummary(results);

    // Exit with appropriate code
    process.exit(results.summary.failed > 0 ? 1 : 0);
}

async function generateReports(results) {
    console.log('\n' + '='.repeat(70));
    console.log('GENERATING REPORTS');
    console.log('='.repeat(70) + '\n');

    // Generate JSON report
    const jsonPath = path.join(__dirname, 'dependency-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    console.log(`✓ JSON report: dependency-report.json`);

    // Generate Markdown report
    const mdPath = path.join(__dirname, 'dependency-report.md');
    const mdContent = generateMarkdownReport(results);
    fs.writeFileSync(mdPath, mdContent);
    console.log(`✓ Markdown report: dependency-report.md`);

    // Generate HTML report
    const htmlPath = path.join(__dirname, 'dependency-report.html');
    const htmlContent = generateHtmlReport(results);
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`✓ HTML report: dependency-report.html`);

    // Update test matrix
    updateTestMatrix(results);
    console.log(`✓ Updated: test-matrix.md`);
}

function generateMarkdownReport(results) {
    const { summary, timestamp, testUser, environment } = results;

    let md = `# Dependency Test Report\n\n`;
    md += `**Test Run**: ${new Date(timestamp).toLocaleString()}\n`;
    md += `**Test User**: \`${testUser}\`\n`;
    md += `**Environment**: ${environment}\n`;
    md += `**Duration**: ${formatDuration(summary.duration)}\n\n`;

    md += `## Overall Results\n\n`;
    md += `**${summary.passed}/${summary.total} chains passed** (${summary.passRate}%)\n\n`;

    md += `| Chain | Status |\n`;
    md += `|-------|--------|\n`;
    Object.values(results.chains).forEach(chain => {
        const status = chain.status === 'passed' ? '✅ PASS' : '❌ FAIL';
        md += `| ${chain.name} | ${status} |\n`;
    });

    md += `\n## Summary by Chain\n\n`;
    Object.values(results.chains).forEach(chain => {
        const icon = chain.status === 'passed' ? '✅' : '❌';
        md += `${icon} **${chain.name}**: ${chain.status.toUpperCase()}\n`;
        if (chain.error) {
            md += `   - Error: ${chain.error}\n`;
        }
        md += `\n`;
    });

    if (summary.failed > 0) {
        md += `## Failed Chains\n\n`;
        Object.values(results.chains)
            .filter(c => c.status === 'failed')
            .forEach(chain => {
                md += `### ${chain.name}\n\n`;
                md += `**Error**: ${chain.error || 'Unknown error'}\n\n`;
                md += `**Recommendations**:\n`;
                md += `1. Check test logs in console output\n`;
                md += `2. Review screenshots in tests/dependencies/screenshots/\n`;
                md += `3. Verify field_outputs extraction with SQL queries\n`;
                md += `4. Check tool HTML files for correct selectors\n\n`;
            });
    }

    md += `## Next Steps\n\n`;
    if (summary.passRate === 100) {
        md += `✅ All chains passing! Dependency system is working correctly.\n\n`;
    } else if (summary.passRate >= 80) {
        md += `⚠️  Most chains passing, but ${summary.failed} chain(s) need attention.\n\n`;
    } else {
        md += `❌ Multiple chains failing. Review implementation and fix broken dependencies.\n\n`;
    }

    return md;
}

function generateHtmlReport(results) {
    const { summary, timestamp } = results;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dependency Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 40px auto; padding: 0 20px; }
        h1 { color: #1a1a1a; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .pass-rate { font-size: 48px; font-weight: bold; color: ${summary.passRate >= 80 ? '#22c55e' : '#ef4444'}; }
        .chain { padding: 15px; margin: 10px 0; border-left: 4px solid #ddd; background: #fafafa; }
        .chain.passed { border-left-color: #22c55e; }
        .chain.failed { border-left-color: #ef4444; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; font-weight: 600; }
    </style>
</head>
<body>
    <h1>🔗 Dependency Test Report</h1>
    <div class="summary">
        <div class="pass-rate">${summary.passRate}%</div>
        <p><strong>${summary.passed}/${summary.total} chains passed</strong></p>
        <p>Duration: ${formatDuration(summary.duration)}</p>
        <p>Test Run: ${new Date(timestamp).toLocaleString()}</p>
    </div>
    <h2>Chain Results</h2>
    ${Object.values(results.chains).map(chain => `
        <div class="chain ${chain.status}">
            <h3>${chain.status === 'passed' ? '✅' : '❌'} ${chain.name}</h3>
            <p>Status: <strong>${chain.status.toUpperCase()}</strong></p>
            ${chain.error ? `<p>Error: ${chain.error}</p>` : ''}
        </div>
    `).join('')}
</body>
</html>`;
}

function updateTestMatrix(results) {
    // Read current test matrix
    const matrixPath = path.join(__dirname, 'test-matrix.md');
    let matrix = fs.readFileSync(matrixPath, 'utf8');

    // Update overall summary
    const totalDependencies = 37; // From test-matrix.md
    const passedChains = results.summary.passed;
    const totalChains = results.summary.total;

    matrix = matrix.replace(
        /\*\*Total Dependencies\*\*: \d+/,
        `**Total Dependencies**: ${totalDependencies}`
    );
    matrix = matrix.replace(
        /\*\*Pass Rate\*\*: \d+%/,
        `**Pass Rate**: ${results.summary.passRate}%`
    );

    // Add test run to history
    const historyRow = `| ${new Date(results.timestamp).toLocaleDateString()} | ${totalChains} | ${passedChains} | ${results.summary.failed} | ${results.summary.passRate}% | All ${totalChains} chains tested |`;

    if (!matrix.includes(historyRow)) {
        matrix = matrix.replace(
            /\| 2026-02-11 \| 0 \| 0 \| 0 \| 0% \| Initial matrix created \|/,
            historyRow
        );
    }

    fs.writeFileSync(matrixPath, matrix);
}

function printSummary(results) {
    const { summary } = results;

    console.log('\n' + '='.repeat(70));
    console.log('FINAL SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Chains:   ${summary.total}`);
    console.log(`Passed:         ${summary.passed} ✅`);
    console.log(`Failed:         ${summary.failed} ❌`);
    console.log(`Pass Rate:      ${summary.passRate}%`);
    console.log(`Duration:       ${formatDuration(summary.duration)}`);
    console.log('='.repeat(70) + '\n');

    if (summary.passRate === 100) {
        console.log('🎉 All chains passed! Dependency system is working correctly.\n');
    } else if (summary.passRate >= 80) {
        console.log(`⚠️  ${summary.failed} chain(s) failed. Review logs and fix issues.\n`);
    } else {
        console.log('❌ Multiple failures detected. Significant issues need to be addressed.\n');
    }

    console.log('Reports generated:');
    console.log('  - dependency-report.json (machine-readable)');
    console.log('  - dependency-report.md (GitHub-friendly)');
    console.log('  - dependency-report.html (browser view)');
    console.log('  - test-matrix.md (updated)\n');
}

// Run tests
runAllChains().catch(error => {
    console.error('Fatal error running tests:', error);
    process.exit(2);
});
