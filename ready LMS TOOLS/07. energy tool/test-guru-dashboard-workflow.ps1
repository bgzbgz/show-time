# Test Script for Guru Dashboard Workflow
# Run this after fixing the MongoDB node

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  GURU DASHBOARD WORKFLOW TEST" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Test with different company IDs
$companyIds = @("test_company", "acme_corp", "demo_company")

foreach ($companyId in $companyIds) {
    Write-Host "Testing with companyId: $companyId" -ForegroundColor Yellow
    $url = "https://n8n-edge.fasttrack-diagnostic.com/webhook/energy-guru-view?companyId=$companyId"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
        
        if ($response) {
            Write-Host "✓ SUCCESS!" -ForegroundColor Green
            Write-Host "  - Submissions: $($response.submissions.Count)" -ForegroundColor White
            Write-Host "  - Team Size: $($response.totalTeamMembers)" -ForegroundColor White
            Write-Host "  - Avg Rating: $($response.averageRatings.overall)" -ForegroundColor White
            Write-Host "  - Weakest Pillar: $($response.lowestPillar)" -ForegroundColor White
        } else {
            Write-Host "✗ No data returned (empty response)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Test complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "If all tests show 'No data returned':" -ForegroundColor Yellow
Write-Host "1. No submissions exist for these company IDs" -ForegroundColor White
Write-Host "2. Submit an individual protocol first" -ForegroundColor White
Write-Host "3. Use the exact companyId from that submission" -ForegroundColor White

