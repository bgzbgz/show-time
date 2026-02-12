# PowerShell script to fix Supabase submissions in all tools

$toolsPath = "C:\Users\Admin\Desktop\show time\frontend\tools"
$tools = @(
    "04-team.html", "05-fit.html", "06-cash.html", "07-energy.html",
    "08-goals.html", "09-focus.html", "10-performance.html",
    "11-meeting-rhythm.html", "12-market-size.html",
    "13-segmentation-target-market.html", "14-target-segment-deep-dive.html",
    "15-value-proposition.html", "16-value-proposition-testing.html",
    "17-product-development.html", "18-pricing.html",
    "19-brand-marketing.html", "20-customer-service.html",
    "21-route-to-market.html"
)

$oldPattern1 = @"
// Insert into Supabase
                const { data: submission, error: submitError } = await supabaseClient
                    .from(`\${CONFIG.SCHEMA_NAME}.submissions`)
                    .insert({
                        user_id: userId,
                        data: submissionData,
                        status: 'completed',
                        submitted_at: new Date().toISOString(),
                        completed_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (submitError) throw submitError;

                // Update user progress
                const { error: progressError } = await supabaseClient
                    .from('shared.user_progress')
                    .upsert({
                        user_id: userId,
                        tool_slug: CONFIG.TOOL_SLUG,
                        status: 'completed',
                        progress_percentage: 100,
                        completed_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,tool_slug'
                    });

                if (progressError) throw progressError;

                alert('Submission saved successfully!');
                localStorage.setItem('lastSubmissionId', submission.id);
"@

$oldPattern2 = @"
const { data: submission, error: submitError } = await supabaseClient
                    .from(`\${CONFIG.SCHEMA_NAME}.submissions`)
                    .insert({
                        user_id: userId,
                        data: submissionData,
                        status: 'completed',
                        submitted_at: new Date().toISOString(),
                        completed_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (submitError) throw submitError;

                const { error: progressError } = await supabaseClient
                    .from('shared.user_progress')
                    .upsert({
                        user_id: userId,
                        tool_slug: CONFIG.TOOL_SLUG,
                        status: 'completed',
                        progress_percentage: 100,
                        completed_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,tool_slug'
                    });

                if (progressError) throw progressError;

                alert('Submission saved successfully!');
                localStorage.setItem('lastSubmissionId', submission.id);
"@

$newCode = @"
// Submit using RPC function (handles schema-specific tables)
                const { data: result, error: submitError } = await supabaseClient
                    .rpc('submit_tool_data', {
                        p_schema_name: CONFIG.SCHEMA_NAME,
                        p_user_id: userId,
                        p_data: submissionData,
                        p_tool_slug: CONFIG.TOOL_SLUG
                    });

                if (submitError) throw submitError;

                if (!result || !result.success) {
                    throw new Error(result?.message || 'Submission failed');
                }

                alert('Submission saved successfully!');
                console.log('Submission ID:', result.submission_id);
                localStorage.setItem('lastSubmissionId', result.submission_id);
"@

foreach ($tool in $tools) {
    $filePath = Join-Path $toolsPath $tool
    if (Test-Path $filePath) {
        Write-Host "Processing $tool..."
        $content = Get-Content $filePath -Raw

        # Try both patterns
        if ($content -match [regex]::Escape($oldPattern1)) {
            $content = $content -replace [regex]::Escape($oldPattern1), $newCode
            Set-Content $filePath $content -NoNewline
            Write-Host "  Fixed using pattern 1" -ForegroundColor Green
        }
        elseif ($content -match [regex]::Escape($oldPattern2)) {
            $content = $content -replace [regex]::Escape($oldPattern2), $newCode
            Set-Content $filePath $content -NoNewline
            Write-Host "  Fixed using pattern 2" -ForegroundColor Green
        }
        else {
            Write-Host "  Pattern not found, skipping" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "File not found: $filePath" -ForegroundColor Red
    }
}

Write-Host "`nDone! All tools processed."
