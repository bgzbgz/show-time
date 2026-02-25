# PowerShell script to update remaining tools (17-21)

$tools = @(
    @{file="17-product-development.html"; slug="product-development"; sprint=17; schema="sprint_17_product_development"},
    @{file="18-pricing.html"; slug="pricing"; sprint=18; schema="sprint_18_pricing"},
    @{file="19-brand-marketing.html"; slug="brand-marketing"; sprint=19; schema="sprint_19_brand_marketing"},
    @{file="20-customer-service.html"; slug="customer-service"; sprint=20; schema="sprint_20_customer_service"},
    @{file="21-route-to-market.html"; slug="route-to-market"; sprint=21; schema="sprint_21_route_to_market"}
)

$basePath = "C:\Users\Admin\Desktop\show time\frontend\tools\"

foreach ($tool in $tools) {
    $filePath = Join-Path $basePath $tool.file
    Write-Host "Processing: $($tool.file)"

    if (Test-Path $filePath) {
        Write-Host "  File exists: $filePath" -ForegroundColor Green
        Write-Host "  Slug: $($tool.slug)"
        Write-Host "  Sprint: $($tool.sprint)"
        Write-Host "  Schema: $($tool.schema)"
        Write-Host ""
    } else {
        Write-Host "  ERROR: File not found" -ForegroundColor Red
    }
}

Write-Host "Summary:"
Write-Host "- Tools to update: $($tools.Count)"
Write-Host "- Use Claude Edit tool to apply Supabase changes"
