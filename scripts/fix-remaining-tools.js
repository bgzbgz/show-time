const fs = require('fs');
const path = require('path');

const toolsDir = 'C:\\Users\\Admin\\Desktop\\show time\\frontend\\tools';
const tools = [
    '06-cash.html', '07-energy.html', '08-goals.html', '09-focus.html',
    '10-performance.html', '11-meeting-rhythm.html', '12-market-size.html',
    '13-segmentation-target-market.html', '14-target-segment-deep-dive.html',
    '15-value-proposition.html', '16-value-proposition-testing.html',
    '17-product-development.html', '18-pricing.html', '19-brand-marketing.html',
    '20-customer-service.html', '21-route-to-market.html'
];

//  Pattern 1: with "// Insert into Supabase" comment
const pattern1Old = /\/\/ Insert into Supabase\s+const \{ data: submission, error: submitError \} = await supabaseClient\s+\.from\(`\$\{CONFIG\.SCHEMA_NAME\}\.submissions`\)\s+\.insert\(\{\s+user_id: userId,\s+data: (\w+),\s+status: 'completed',\s+submitted_at: new Date\(\)\.toISOString\(\),\s+completed_at: new Date\(\)\.toISOString\(\)\s+\}\)\s+\.select\(\)\s+\.single\(\);[\s\S]*?if \(submitError\) throw submitError;[\s\S]*?\/\/ Update user progress[\s\S]*?const \{ error: progressError \} = await supabaseClient\s+\.from\('shared\.user_progress'\)\s+\.upsert\(\{[\s\S]*?onConflict: 'user_id,tool_slug'\s+\}\);[\s\S]*?if \(progressError\) throw progressError;[\s\S]*?(alert\([^)]+\);[\s\S]*?localStorage\.setItem\('lastSubmissionId', submission\.id\);|localStorage\.setItem\('lastSubmissionId', submission\.id\);[\s\S]*?\/\/ Show results page)/;

// Pattern 2: without comment
const pattern2Old = /const \{ data: submission, error: submitError \} = await supabaseClient\s+\.from\(`\$\{CONFIG\.SCHEMA_NAME\}\.submissions`\)\s+\.insert\(\{\s+user_id: userId,\s+data: (\w+),\s+status: 'completed',\s+submitted_at: new Date\(\)\.toISOString\(\),\s+completed_at: new Date\(\)\.toISOString\(\)\s+\}\)\s+\.select\(\)\s+\.single\(\);[\s\S]*?if \(submitError\) throw submitError;[\s\S]*?const \{ error: progressError \} = await supabaseClient\s+\.from\('shared\.user_progress'\)\s+\.upsert\(\{[\s\S]*?onConflict: 'user_id,tool_slug'\s+\}\);[\s\S]*?if \(progressError\) throw progressError;[\s\S]*?(alert\([^)]+\);[\s\S]*?localStorage\.setItem\('lastSubmissionId', submission\.id\);|localStorage\.setItem\('lastSubmissionId', submission\.id\);)/;

function createReplacement(dataVar, ending) {
    return `// Submit using RPC function (handles schema-specific tables)
                    const { data: result, error: submitError } = await supabaseClient
                        .rpc('submit_tool_data', {
                            p_schema_name: CONFIG.SCHEMA_NAME,
                            p_user_id: userId,
                            p_data: ${dataVar},
                            p_tool_slug: CONFIG.TOOL_SLUG
                        });

                    if (submitError) throw submitError;

                    if (!result || !result.success) {
                        throw new Error(result?.message || 'Submission failed');
                    }

                    ${ending.includes('alert') ? ending.replace('localStorage.setItem(\\'lastSubmissionId\\', submission.id);', 'console.log(\\'Submission ID:\\', result.submission_id);\\n                    localStorage.setItem(\\'lastSubmissionId\\', result.submission_id);') : 'console.log(\\'Submission ID:\\', result.submission_id);\\n                    localStorage.setItem(\\'lastSubmissionId\\', result.submission_id);'}`;
}

tools.forEach(tool => {
    const filePath = path.join(toolsDir, tool);

    if (!fs.existsSync(filePath)) {
        console.log(`❌ ${tool}: File not found`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Try pattern 1
    let match = content.match(pattern1Old);
    if (match) {
        const dataVar = match[1];
        const ending = match[2];
        const replacement = createReplacement(dataVar, ending);
        content = content.replace(match[0], replacement);
        modified = true;
        console.log(`✓ ${tool}: Fixed (pattern 1, data var: ${dataVar})`);
    } else {
        // Try pattern 2
        match = content.match(pattern2Old);
        if (match) {
            const dataVar = match[1];
            const ending = match[2];
            const replacement = createReplacement(dataVar, ending);
            content = content.replace(match[0], replacement);
            modified = true;
            console.log(`✓ ${tool}: Fixed (pattern 2, data var: ${dataVar})`);
        } else {
            console.log(`⚠ ${tool}: Pattern not found`);
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log('\nDone processing all tools');
