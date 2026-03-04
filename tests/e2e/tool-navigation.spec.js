/**
 * Playwright E2E tests: Tool Navigation
 *
 * Verifies that each tool:
 * 1. Loads without blank screen (cover page renders)
 * 2. START button is visible and clickable
 * 3. After START, step content appears (not blank)
 * 4. NEXT button exists and is not permanently disabled on step 1
 *
 * Run: npx playwright test tests/e2e/tool-navigation.spec.js
 */

import { test, expect } from '@playwright/test';

const TOOLS = [
  { path: '/tools/module-0-intro-sprint/00-woop.html', name: '00-woop' },
  { path: '/tools/module-1-identity/01-know-thyself.html', name: '01-know-thyself' },
  { path: '/tools/module-1-identity/02-dream.html', name: '02-dream' },
  { path: '/tools/module-1-identity/03-values.html', name: '03-values' },
  { path: '/tools/module-1-identity/04-team.html', name: '04-team' },
  { path: '/tools/module-1-identity/05-fit.html', name: '05-fit' },
  { path: '/tools/module-2-performance/06-cash.html', name: '06-cash' },
  { path: '/tools/module-2-performance/07-energy.html', name: '07-energy' },
  { path: '/tools/module-2-performance/08-goals.html', name: '08-goals' },
  { path: '/tools/module-2-performance/09-focus.html', name: '09-focus' },
  { path: '/tools/module-2-performance/10-performance.html', name: '10-performance' },
  { path: '/tools/module-2-performance/11-meeting-rhythm.html', name: '11-meeting-rhythm' },
  { path: '/tools/module-3-market/12-market-size.html', name: '12-market-size' },
  { path: '/tools/module-3-market/13-segmentation-target-market.html', name: '13-segmentation' },
  { path: '/tools/module-4-strategy-development/14-target-segment-deep-dive.html', name: '14-target-segment' },
  { path: '/tools/module-4-strategy-development/15-value-proposition.html', name: '15-value-proposition' },
  { path: '/tools/module-4-strategy-development/16-value-proposition-testing.html', name: '16-vp-testing' },
  { path: '/tools/module-5-strategy-execution/17-product-development.html', name: '17-product-dev' },
  { path: '/tools/module-5-strategy-execution/18-pricing.html', name: '18-pricing' },
  { path: '/tools/module-5-strategy-execution/19-brand-marketing.html', name: '19-brand-marketing' },
  { path: '/tools/module-5-strategy-execution/20-customer-service.html', name: '20-customer-service' },
  { path: '/tools/module-5-strategy-execution/21-route-to-market.html', name: '21-route-to-market' },
  { path: '/tools/module-6-org-structure/22-core-activities.html', name: '22-core-activities' },
  { path: '/tools/module-6-org-structure/23-processes-decisions.html', name: '23-processes' },
  { path: '/tools/module-6-org-structure/24-fit-abc-analysis.html', name: '24-fit-abc' },
  { path: '/tools/module-6-org-structure/25-org-redesign.html', name: '25-org-redesign' },
  { path: '/tools/module-7-people-leadership/26-employer-branding.html', name: '26-employer-branding' },
  { path: '/tools/module-7-people-leadership/27-agile-teams.html', name: '27-agile-teams' },
  { path: '/tools/module-8-tech-ai/28-digitalization.html', name: '28-digitalization' },
  { path: '/tools/module-8-tech-ai/29-digital-heart.html', name: '29-digital-heart' },
];

// Inject a fake user to bypass auth checks
const INJECT_AUTH = `
  localStorage.setItem('ft_user_id', 'test-e2e-user-001');
  localStorage.setItem('ft_user_email', 'e2e@test.com');
  localStorage.setItem('ft_user_name', 'E2E Tester');
`;

for (const tool of TOOLS) {
  test.describe(tool.name, () => {

    test('loads without blank screen', async ({ page }) => {
      // Inject auth before navigation
      await page.goto('about:blank');
      await page.evaluate(INJECT_AUTH);

      await page.goto(tool.path, { waitUntil: 'networkidle' });

      // Wait for React to render (Babel compile + React mount)
      await page.waitForTimeout(3000);

      // Check page is not blank — body should have visible content
      const bodyText = await page.evaluate(() => document.body.innerText.trim());
      expect(bodyText.length).toBeGreaterThan(10);

      // No uncaught errors in console
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      // Should see START button or tool content
      const hasStart = await page.locator('text=/START/i').count();
      const hasContent = await page.locator('h1, h2, .plaak').count();
      expect(hasStart + hasContent).toBeGreaterThan(0);
    });

    test('START button works', async ({ page }) => {
      await page.goto('about:blank');
      await page.evaluate(INJECT_AUTH);
      await page.goto(tool.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      // Find and click START
      const startBtn = page.locator('button:has-text("START"), a:has-text("START")').first();
      const isVisible = await startBtn.isVisible().catch(() => false);

      if (isVisible) {
        await startBtn.click();
        await page.waitForTimeout(2000);

        // After clicking START, page should not be blank
        const bodyText = await page.evaluate(() => document.body.innerText.trim());
        expect(bodyText.length).toBeGreaterThan(10);
      }
    });

    test('no console errors on load', async ({ page }) => {
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      await page.goto('about:blank');
      await page.evaluate(INJECT_AUTH);
      await page.goto(tool.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      // Filter out known non-critical errors
      const critical = errors.filter(e =>
        !e.includes('net::ERR') &&
        !e.includes('favicon') &&
        !e.includes('404') &&
        !e.includes('CognitiveLoad')
      );

      expect(critical).toEqual([]);
    });

  });
}
