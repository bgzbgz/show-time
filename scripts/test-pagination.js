/**
 * Playwright Pagination Test — Fast Track Tools
 * Tests navigator buttons, Next/Back item advancement, and index resets
 * for all 13 tools that received the pagination update.
 *
 * Run: npx playwright test scripts/test-pagination.js
 *   or: node scripts/test-pagination.js
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOOLS = path.join(ROOT, 'frontend', 'tools');
const OUT = path.join(ROOT, 'qa-reports');

const VIEWPORT = { width: 1920, height: 1080 };
const UID = '00000000-0000-0000-0000-000000000000';
const SHORT = 'QA pagination test text';
const LONG = 'Detailed pagination test response with enough characters to pass any validation checks and proceed through wizard steps.';

// Auth + mock injection (same as qa script)
const AUTH_SCRIPT = `(function(){
  const uid = '${UID}';
  const poll = setInterval(() => {
    if (window.ToolDB && !window.ToolDB._p) {
      window.ToolDB._p = true;
      window.ToolDB.identifyUser = async () => uid;
      window.ToolDB.load = async () => ({});
      window.ToolDB.save = async () => true;
      window.ToolDB.submitAnswers = async () => true;
      window.ToolDB.getDependency = async () => ({});
    }
    if (window.supabase && !window.supabase._p) {
      window.supabase._p = true;
      const real = window.supabase.createClient;
      window.supabase.createClient = function(...a) {
        const c = real.apply(this, a);
        if (c.auth) {
          const s = { user: { id: uid, email: 'test@test.com' } };
          c.auth.getSession = async () => ({ data: { session: s }, error: null });
          c.auth.getUser = async () => ({ data: s, error: null });
        }
        if (c.from) {
          const origFrom = c.from.bind(c);
          c.from = (table) => {
            const q = origFrom(table);
            const origSelect = q.select?.bind(q);
            if (origSelect) {
              q.select = (...args) => {
                const r = origSelect(...args);
                r.eq = () => r; r.in = () => r; r.order = () => r;
                r.limit = () => r; r.single = () => r; r.maybeSingle = () => r;
                r.then = (res) => res({ data: [], error: null });
                return r;
              };
            }
            return q;
          };
        }
        return c;
      };
    }
    if (window.AIChallenge && !window.AIChallenge._p) {
      window.AIChallenge._p = true;
      window.AIChallenge.reviewStep = async () => ({ passed: true });
      window.AIChallenge.submitWithChallenge = async (a,b,c,d,saveFn) => { if (saveFn) await saveFn(); return true; };
    }
  }, 50);
  setTimeout(() => clearInterval(poll), 10000);
})();`;

// ─────────────────────────────────────────────
// Tool configs: which steps have pagination
// ─────────────────────────────────────────────
const PAGINATED_TOOLS = [
  {
    file: 'module-2-performance/08-goals.html',
    name: '08-goals',
    paginatedSteps: [
      { wizardStep: 3, label: 'Step 3 — Cut the Elephant', expectedMinItems: 3 }
    ]
  },
  {
    file: 'module-2-performance/11-meeting-rhythm.html',
    name: '11-meeting-rhythm',
    paginatedSteps: [
      { wizardStep: 1, label: 'Step 1 — Priorities', expectedMinItems: 3 }
    ]
  },
  {
    file: 'module-5-strategy-execution/17-product-development.html',
    name: '17-product-development',
    paginatedSteps: [
      { wizardStep: 1, label: 'Step 1 — Features', expectedMinItems: 3 },
      { wizardStep: 3, label: 'Step 3 — WTP', expectedMinItems: 3 },
      { wizardStep: 4, label: 'Step 4 — Portfolio', expectedMinItems: 1 }
    ]
  },
  {
    file: 'module-5-strategy-execution/18-pricing.html',
    name: '18-pricing',
    paginatedSteps: [
      { wizardStep: 1, label: 'Step 1 — Features', expectedMinItems: 3 },
      { wizardStep: 3, label: 'Step 3 — Tiers', expectedMinItems: 3 },
      { wizardStep: 5, label: 'Step 5 — Actions', expectedMinItems: 3 }
    ]
  },
  {
    file: 'module-6-org-structure/25-org-redesign.html',
    name: '25-org-redesign',
    paginatedSteps: [
      { wizardStep: 2, label: 'Step 2 — Roles', expectedMinItems: 1 }
    ]
  },
  {
    file: 'module-8-tech-ai/28-digitalization.html',
    name: '28-digitalization',
    paginatedSteps: [
      { wizardStep: 1, label: 'Step 1 — Decisions', expectedMinItems: 3 },
      { wizardStep: 2, label: 'Step 2 — Processes', expectedMinItems: 3 },
      { wizardStep: 3, label: 'Step 3 — Tools', expectedMinItems: 3 }
    ]
  },
  {
    file: 'module-8-tech-ai/29-digital-heart.html',
    name: '29-digital-heart',
    paginatedSteps: [
      { wizardStep: 1, label: 'Step 1 — Decisions', expectedMinItems: 3 },
      { wizardStep: 2, label: 'Step 2 — Data Sources', expectedMinItems: 3 },
      { wizardStep: 3, label: 'Step 3 — Technology', expectedMinItems: 3 }
    ]
  },
  {
    file: 'module-1-identity/03-values.html',
    name: '03-values',
    paginatedSteps: [
      { wizardStep: 3, label: 'Step 3 — Behaviors', expectedMinItems: 3 }
    ]
  },
  {
    file: 'module-4-strategy-development/15-value-proposition.html',
    name: '15-value-proposition',
    paginatedSteps: [
      { wizardStep: 2, label: 'Step 2 — Competitors', expectedMinItems: 1 }
    ]
  },
  {
    file: 'module-5-strategy-execution/19-brand-marketing.html',
    name: '19-brand-marketing',
    paginatedSteps: [
      { wizardStep: 2, label: 'Step 2 — Traits', expectedMinItems: 3 },
      { wizardStep: 4, label: 'Step 4 — Pillars', expectedMinItems: 3 },
      { wizardStep: 5, label: 'Step 5 — Actions', expectedMinItems: 3 }
    ]
  },
  {
    file: 'module-5-strategy-execution/20-customer-service.html',
    name: '20-customer-service',
    paginatedSteps: [
      { wizardStep: 4, label: 'Step 4 — Ownership', expectedMinItems: 3 }
    ]
  },
  {
    file: 'module-6-org-structure/24-fit-abc-analysis.html',
    name: '24-fit-abc-analysis',
    paginatedSteps: [
      { wizardStep: 3, label: 'Step 3 — ABC Classification', expectedMinItems: 1 }
    ]
  },
  {
    file: 'module-7-people-leadership/26-employer-branding.html',
    name: '26-employer-branding',
    paginatedSteps: [
      { wizardStep: 4, label: 'Step 4 — Truths', expectedMinItems: 3 }
    ]
  }
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Fill all visible inputs on the page */
async function fillInputs(page) {
  await page.evaluate(({ S, L }) => {
    function fire(el, val) {
      const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')
        || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
        || Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
        || Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
      if (d?.set) d.set.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const vis = el => el.offsetParent !== null && !el.disabled && !el.readOnly;
    document.querySelectorAll('input[type="text"], input:not([type])').forEach(el => {
      if (!vis(el) || el.value?.length >= 5) return; fire(el, S);
    });
    document.querySelectorAll('textarea').forEach(el => {
      if (!vis(el) || el.value?.length >= 5) return; fire(el, L);
    });
    document.querySelectorAll('input[type="number"]').forEach(el => {
      if (!vis(el) || (el.value && parseFloat(el.value) > 0)) return;
      fire(el, String(Math.ceil(((parseFloat(el.max)||100)+(parseFloat(el.min)||1))/2)));
    });
    document.querySelectorAll('input[type="date"]').forEach(el => {
      if (!vis(el) || el.value) return; fire(el, '2026-06-30');
    });
    document.querySelectorAll('select').forEach(el => {
      if (!vis(el)) return;
      const opts = el.querySelectorAll('option');
      if (opts.length > 1) fire(el, opts[Math.min(1, opts.length - 1)].value);
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(el => {
      if (el.offsetParent === null || el.disabled || el.checked) return; el.click();
    });
    document.querySelectorAll('input[type="range"]').forEach(el => {
      if (!vis(el)) return;
      fire(el, String(Math.ceil(((parseFloat(el.max)||100)+(parseFloat(el.min)||0))/2)));
    });
  }, { S: SHORT, L: LONG });
}

/** Click the first visible non-back, non-disabled button matching a pattern */
async function clickButton(page, pattern) {
  return page.evaluate((pat) => {
    const regex = new RegExp(pat, 'i');
    const btns = [...document.querySelectorAll('button')].filter(b =>
      b.offsetParent && !b.disabled && regex.test(b.textContent)
    );
    if (btns.length > 0) { btns[0].click(); return true; }
    return false;
  }, pattern);
}

/** Click the Next / Continue / Start button */
async function clickNext(page) {
  return page.evaluate(() => {
    // Priority: btn-wiz-next > btn-next > any forward-looking button
    const selectors = ['.btn-wiz-next', '.btn-next'];
    for (const sel of selectors) {
      const btn = document.querySelector(sel);
      if (btn && btn.offsetParent && !btn.disabled) { btn.click(); return true; }
    }
    // Fallback: any button with next/continue/start/let's start text
    const btns = [...document.querySelectorAll('button')].filter(b =>
      b.offsetParent && !b.disabled &&
      /next|continue|start|let.*s start|→/i.test(b.textContent) &&
      !/back|←|prev/i.test(b.textContent)
    );
    if (btns.length > 0) { btns[0].click(); return true; }
    return false;
  });
}

/** Click the Back button */
async function clickBack(page) {
  return page.evaluate(() => {
    const selectors = ['.btn-wiz-back', '.btn-back'];
    for (const sel of selectors) {
      const btn = document.querySelector(sel);
      if (btn && btn.offsetParent && !btn.disabled) { btn.click(); return true; }
    }
    const btns = [...document.querySelectorAll('button')].filter(b =>
      b.offsetParent && !b.disabled && /back|←/i.test(b.textContent)
    );
    if (btns.length > 0) { btns[0].click(); return true; }
    return false;
  });
}

/** Get pagination navigator state */
async function getNavState(page) {
  return page.evaluate(() => {
    // Look for numbered navigator buttons (the 44px square buttons with numbers)
    // They typically have inline styles with width:44, height:44 and contain a single number
    const allBtns = [...document.querySelectorAll('button')];
    const navBtns = allBtns.filter(b => {
      if (!b.offsetParent) return false;
      const text = b.textContent.trim();
      // Navigator buttons are single numbers or "+"
      if (!/^\d+$/.test(text)) return false;
      // Check size — navigator buttons are small (44px) squares
      const rect = b.getBoundingClientRect();
      if (rect.width > 60 || rect.height > 60) return false;
      return true;
    });

    if (navBtns.length === 0) return null;

    // Find the active one (black bg = active)
    const activeBtn = navBtns.find(b => {
      const bg = getComputedStyle(b).backgroundColor;
      // Black bg or near-black
      return bg === 'rgb(0, 0, 0)' || bg === '#000' || bg === '#000000';
    });

    // Also check for "+" add button nearby
    const addBtn = allBtns.find(b => {
      if (!b.offsetParent) return false;
      const text = b.textContent.trim();
      return text === '+' || /add/i.test(text);
    });

    return {
      count: navBtns.length,
      activeIndex: activeBtn ? parseInt(activeBtn.textContent.trim()) : null,
      numbers: navBtns.map(b => parseInt(b.textContent.trim())),
      hasAddButton: !!addBtn,
    };
  });
}

/** Check if we're on a transition screen */
async function isTransitionScreen(page) {
  return page.evaluate(() => {
    // Transition screens have position:fixed, black bg, large centered text
    const fixedDivs = [...document.querySelectorAll('div')].filter(d => {
      const s = getComputedStyle(d);
      return s.position === 'fixed' && s.zIndex >= 100;
    });
    return fixedDivs.length > 0;
  });
}

/** Get current page scroll height */
async function getScrollHeight(page) {
  return page.evaluate(() => document.body.scrollHeight);
}

/** Get visible form field count */
async function getVisibleFieldCount(page) {
  return page.evaluate(() => {
    const vis = el => el.offsetParent !== null && !el.disabled;
    const inputs = [...document.querySelectorAll('input[type="text"], input:not([type]), textarea, select, input[type="number"]')];
    return inputs.filter(vis).length;
  });
}

/** Get console errors */
function collectErrors(page) {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  return errors;
}

// ─────────────────────────────────────────────
// Main test logic per tool
// ─────────────────────────────────────────────

async function testTool(browser, toolConfig) {
  const filePath = path.join(TOOLS, toolConfig.file);
  if (!fs.existsSync(filePath)) {
    return { tool: toolConfig.name, status: 'SKIP', results: [], error: `File not found: ${filePath}` };
  }

  const ctx = await browser.newContext({ viewport: VIEWPORT });
  await ctx.addInitScript(AUTH_SCRIPT);
  const page = await ctx.newPage();
  const errors = collectErrors(page);
  page.on('dialog', d => d.dismiss().catch(() => {}));

  const results = [];

  try {
    // Load the tool
    await page.goto(`file:///${filePath.replace(/\\/g, '/')}`, {
      waitUntil: 'domcontentloaded', timeout: 15000
    });
    await page.waitForTimeout(2000);

    // Step through cover / intro screens to reach wizard step 1
    // Click START, CONTINUE, LET'S START etc. up to 10 times to get past intros
    let reachedWizard = false;
    for (let attempt = 0; attempt < 12; attempt++) {
      // Check if we see a navigator (means we're in a paginated step)
      const nav = await getNavState(page);
      if (nav) { reachedWizard = true; break; }

      // Check if we see a wizard sidebar (means we're in wizard territory)
      const hasSidebar = await page.evaluate(() =>
        !!document.querySelector('.wizard-sidebar, .sidebar-step-item, .sidebar-step-dot')
      );
      if (hasSidebar) { reachedWizard = true; break; }

      // Try clicking forward
      await fillInputs(page);
      const clicked = await clickNext(page);
      if (!clicked) {
        // Try clicking any visible button
        const anyClick = await page.evaluate(() => {
          const btns = [...document.querySelectorAll('button')].filter(b =>
            b.offsetParent && !b.disabled && !/back|←/i.test(b.textContent)
          );
          if (btns.length > 0) { btns[0].click(); return true; }
          return false;
        });
        if (!anyClick) break;
      }
      await page.waitForTimeout(600);

      // Skip transitions
      if (await isTransitionScreen(page)) {
        await clickNext(page);
        await page.waitForTimeout(600);
      }
    }

    if (!reachedWizard) {
      results.push({
        step: 'SETUP',
        status: 'FAIL',
        message: 'Could not navigate past cover/intro to wizard steps'
      });
      await ctx.close();
      return { tool: toolConfig.name, status: 'FAIL', results, errors: errors.slice(0, 5) };
    }

    // Now navigate to each paginated step and test it
    for (const pStep of toolConfig.paginatedSteps) {
      const stepResult = await testPaginatedStep(page, pStep, toolConfig);
      results.push(stepResult);
    }

  } catch (err) {
    results.push({ step: 'FATAL', status: 'FAIL', message: err.message });
  }

  await ctx.close();

  const allPass = results.every(r => r.status === 'PASS');
  const anyFail = results.some(r => r.status === 'FAIL');

  return {
    tool: toolConfig.name,
    status: anyFail ? 'FAIL' : allPass ? 'PASS' : 'WARN',
    results,
    errors: errors.slice(0, 5)
  };
}

async function testPaginatedStep(page, pStep, toolConfig) {
  const tests = [];
  const label = pStep.label;

  try {
    // Navigate to the target wizard step by clicking Next repeatedly
    // We need to fill inputs and advance until we reach the target step
    let found = false;
    for (let clicks = 0; clicks < 30; clicks++) {
      // Check for navigator buttons on current page
      const nav = await getNavState(page);

      // Check if we might be at the right step by checking step indicators
      const stepInfo = await page.evaluate((targetStep) => {
        // Look for step indicators like "STEP 3 OF 5" or sidebar active items
        const indicator = document.querySelector('.step-indicator, .opening-box .step-indicator');
        if (indicator) {
          const match = indicator.textContent.match(/STEP\s+(\d+)/i);
          if (match) return parseInt(match[1]);
        }
        // Check sidebar active step
        const activeDot = document.querySelector('.sidebar-step.active .sidebar-step-label, .sidebar-step-item.active');
        if (activeDot) {
          // Try to extract step number
          const parent = activeDot.closest('.sidebar-step, .sidebar-step-item');
          if (parent) {
            const allSteps = [...document.querySelectorAll('.sidebar-step, .sidebar-step-item')];
            return allSteps.indexOf(parent) + 1;
          }
        }
        return null;
      }, pStep.wizardStep);

      if (stepInfo === pStep.wizardStep && nav) {
        found = true;
        break;
      }

      // If we have a navigator and we've been clicking a while, we might be there
      if (nav && clicks > pStep.wizardStep) {
        found = true;
        break;
      }

      // Fill and advance
      await fillInputs(page);
      await page.waitForTimeout(300);

      // If there's a navigator, click through all items first
      if (nav && nav.count > 1) {
        for (let i = 0; i < nav.count; i++) {
          await fillInputs(page);
          await page.waitForTimeout(200);
          const advanced = await clickNext(page);
          if (!advanced) break;
          await page.waitForTimeout(300);
        }
      } else {
        await clickNext(page);
        await page.waitForTimeout(400);
      }

      // Handle transition screens
      if (await isTransitionScreen(page)) {
        await page.waitForTimeout(500);
        await clickNext(page);
        await page.waitForTimeout(600);
      }
    }

    if (!found) {
      return {
        step: label,
        status: 'FAIL',
        message: `Could not navigate to wizard step ${pStep.wizardStep}`,
        tests
      };
    }

    // === TEST 1: Navigator exists ===
    const nav = await getNavState(page);
    if (!nav) {
      tests.push({ test: 'Navigator renders', pass: false, detail: 'No numbered navigator buttons found' });
      return { step: label, status: 'FAIL', message: 'No navigator found', tests };
    }
    tests.push({ test: 'Navigator renders', pass: true, detail: `${nav.count} buttons found` });

    // === TEST 2: Navigator shows expected minimum items ===
    const hasMinItems = nav.count >= pStep.expectedMinItems;
    tests.push({
      test: 'Minimum item count',
      pass: hasMinItems,
      detail: `${nav.count} items (expected >= ${pStep.expectedMinItems})`
    });

    // === TEST 3: Active index starts at 1 ===
    tests.push({
      test: 'Active index starts at 1',
      pass: nav.activeIndex === 1,
      detail: `Active index: ${nav.activeIndex}`
    });

    // === TEST 4: Click navigator button 2 changes active state ===
    if (nav.count >= 2) {
      // Fill current item first
      await fillInputs(page);
      await page.waitForTimeout(200);

      // Click button 2
      const clicked = await page.evaluate(() => {
        const navBtns = [...document.querySelectorAll('button')].filter(b => {
          if (!b.offsetParent) return false;
          const text = b.textContent.trim();
          if (text !== '2') return false;
          const rect = b.getBoundingClientRect();
          return rect.width <= 60 && rect.height <= 60;
        });
        if (navBtns.length > 0) { navBtns[0].click(); return true; }
        return false;
      });

      if (clicked) {
        await page.waitForTimeout(400);
        const nav2 = await getNavState(page);
        tests.push({
          test: 'Click button 2 changes active',
          pass: nav2?.activeIndex === 2,
          detail: `Active after click: ${nav2?.activeIndex}`
        });
      } else {
        tests.push({ test: 'Click button 2 changes active', pass: false, detail: 'Could not click button 2' });
      }

      // Click back to 1
      await page.evaluate(() => {
        const navBtns = [...document.querySelectorAll('button')].filter(b => {
          if (!b.offsetParent) return false;
          const text = b.textContent.trim();
          if (text !== '1') return false;
          const rect = b.getBoundingClientRect();
          return rect.width <= 60 && rect.height <= 60;
        });
        if (navBtns.length > 0) navBtns[0].click();
      });
      await page.waitForTimeout(300);
    }

    // === TEST 5: Next button advances through items ===
    // Start at item 1, click Next, should go to item 2 (not next wizard step)
    await fillInputs(page);
    await page.waitForTimeout(200);

    const beforeNext = await getNavState(page);
    await clickNext(page);
    await page.waitForTimeout(500);

    // Check we didn't leave the step (no transition, still have navigator)
    const isTransition = await isTransitionScreen(page);
    const afterNext = await getNavState(page);

    if (nav.count > 1) {
      const advancedItem = afterNext && afterNext.activeIndex === (beforeNext.activeIndex || 1) + 1;
      tests.push({
        test: 'Next advances item (not step)',
        pass: advancedItem && !isTransition,
        detail: isTransition
          ? 'FAIL: Jumped to transition screen instead of next item'
          : `Active: ${beforeNext?.activeIndex} → ${afterNext?.activeIndex}`
      });
    } else {
      tests.push({ test: 'Next advances item (not step)', pass: true, detail: 'Only 1 item — skip test' });
    }

    // === TEST 6: Back at item 1 goes to previous wizard step (not negative index) ===
    // Navigate back to item 1 first
    if (afterNext && afterNext.activeIndex > 1) {
      await clickBack(page);
      await page.waitForTimeout(400);
    }
    const atItem1 = await getNavState(page);
    if (atItem1 && atItem1.activeIndex === 1) {
      await clickBack(page);
      await page.waitForTimeout(500);

      // We should now be on the previous step or the navigator should be gone
      const afterBack = await getNavState(page);
      const noNegative = !afterBack || afterBack.activeIndex === null || afterBack.activeIndex >= 1;
      tests.push({
        test: 'Back at item 1 exits step (no negative index)',
        pass: noNegative,
        detail: afterBack
          ? `Still has navigator, active: ${afterBack.activeIndex}`
          : 'Navigator gone (left paginated step) — correct'
      });

      // Navigate forward again to this step for remaining tests
      await clickNext(page);
      await page.waitForTimeout(500);
      if (await isTransitionScreen(page)) {
        await clickNext(page);
        await page.waitForTimeout(500);
      }
    }

    // === TEST 7: Page height is reasonable (pagination should prevent excessive scroll) ===
    const height = await getScrollHeight(page);
    tests.push({
      test: 'Page height reasonable (< 2000px)',
      pass: height < 2000,
      detail: `${height}px`
    });

    // === TEST 8: Fields visible and fillable ===
    const fieldCount = await getVisibleFieldCount(page);
    tests.push({
      test: 'Has visible form fields',
      pass: fieldCount > 0,
      detail: `${fieldCount} fields visible`
    });

    // === TEST 9: No console errors ===
    // (checked at end)

  } catch (err) {
    tests.push({ test: 'EXCEPTION', pass: false, detail: err.message });
  }

  const fails = tests.filter(t => !t.pass);
  return {
    step: label,
    status: fails.length === 0 ? 'PASS' : 'FAIL',
    message: fails.length === 0 ? 'All tests pass' : `${fails.length} test(s) failed`,
    tests
  };
}

// ─────────────────────────────────────────────
// Runner
// ─────────────────────────────────────────────

async function main() {
  console.log('\n--- Pagination Test Suite ---\n');
  console.log(`Testing ${PAGINATED_TOOLS.length} tools with pagination\n`);

  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const allResults = [];

  for (let i = 0; i < PAGINATED_TOOLS.length; i++) {
    const tool = PAGINATED_TOOLS[i];
    const tag = `[${String(i + 1).padStart(2, '0')}/${PAGINATED_TOOLS.length}]`;
    process.stdout.write(`${tag} ${tool.name}... `);

    const result = await testTool(browser, tool);
    allResults.push(result);

    const icon = result.status === 'PASS' ? 'PASS' : result.status === 'FAIL' ? 'FAIL' : 'WARN';
    console.log(`${icon}`);

    for (const r of result.results) {
      const stepIcon = r.status === 'PASS' ? '  OK' : '  !!';
      console.log(`${stepIcon}  ${r.step}: ${r.message}`);
      if (r.tests) {
        for (const t of r.tests) {
          if (!t.pass) console.log(`       FAIL: ${t.test} — ${t.detail}`);
        }
      }
    }
    if (result.errors?.length > 0) {
      console.log(`  Console errors: ${result.errors.length}`);
      result.errors.forEach(e => console.log(`    ${e.substring(0, 120)}`));
    }
  }

  await browser.close();

  // Summary
  const passed = allResults.filter(r => r.status === 'PASS').length;
  const failed = allResults.filter(r => r.status === 'FAIL').length;
  const warned = allResults.filter(r => r.status === 'WARN').length;

  // Generate report
  const report = [
    '# Pagination Test Report',
    '',
    `**Date:** ${new Date().toISOString().split('T')[0]}`,
    `**Tools Tested:** ${allResults.length}`,
    `**Results:** ${passed} PASS | ${warned} WARN | ${failed} FAIL`,
    '',
    '## Results by Tool',
    '',
    ...allResults.map(r => {
      const lines = [`### ${r.tool} — ${r.status}`];
      for (const sr of r.results) {
        lines.push(`\n**${sr.step}** — ${sr.message}`);
        if (sr.tests) {
          lines.push('| Test | Result | Detail |');
          lines.push('|------|--------|--------|');
          for (const t of sr.tests) {
            lines.push(`| ${t.test} | ${t.pass ? 'PASS' : 'FAIL'} | ${t.detail} |`);
          }
        }
      }
      if (r.errors?.length > 0) {
        lines.push('\n**Console Errors:**');
        r.errors.forEach(e => lines.push(`- \`${e.substring(0, 200)}\``));
      }
      lines.push('');
      return lines.join('\n');
    }),
    '',
    '## Summary',
    '',
    '| Tool | Status | Steps Tested | Failures |',
    '|------|--------|-------------|----------|',
    ...allResults.map(r => {
      const failCount = r.results.filter(sr => sr.status === 'FAIL').length;
      return `| ${r.tool} | ${r.status} | ${r.results.length} | ${failCount} |`;
    }),
  ].join('\n');

  fs.writeFileSync(path.join(OUT, 'PAGINATION-TEST.md'), report);

  console.log(`\n--- Summary ---`);
  console.log(`  PASS: ${passed}`);
  console.log(`  WARN: ${warned}`);
  console.log(`  FAIL: ${failed}`);
  console.log(`\nReport: qa-reports/PAGINATION-TEST.md\n`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
