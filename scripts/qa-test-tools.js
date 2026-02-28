/**
 * QA Test Runner for Fast Track Tools
 * Identifies problematic tools: scrolling issues, broken navigation, performance
 *
 * Run: npm run qa
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOOLS_DIR = path.join(ROOT, 'frontend', 'tools');
const OUT_DIR = path.join(ROOT, 'qa-reports');

const VIEWPORT = { width: 1920, height: 1080 };
const FAKE_UID = '00000000-0000-0000-0000-000000000000';
const DUMMY_SHORT = 'QA test placeholder text';
const DUMMY_LONG = 'This is a detailed QA test response with enough characters to pass validation checks and enable navigation through all wizard steps.';

const AUTH_SCRIPT = `(function(){
  const uid = '${FAKE_UID}';
  const poll = setInterval(() => {
    if (window.ToolDB && !window.ToolDB._p) {
      window.ToolDB._p = true;
      window.ToolDB.identifyUser = async () => uid;
      window.ToolDB.load = async () => ({});
      window.ToolDB.save = async () => true;
      window.ToolDB.submitAnswers = async () => true;
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
        return c;
      };
    }
    if (window.AIChallenge && !window.AIChallenge._p) {
      window.AIChallenge._p = true;
      window.AIChallenge.reviewStep = async () => ({ passed: true });
      window.AIChallenge.submitWithChallenge = async (a,b,c,d,saveFn) => { if (saveFn) await saveFn(); return true; };
    }
  }, 50);
  setTimeout(() => clearInterval(poll), 8000);
})();`;

function findTools() {
  const files = [];
  for (const mod of fs.readdirSync(TOOLS_DIR).filter(d => d.startsWith('module-')).sort()) {
    const dir = path.join(TOOLS_DIR, mod);
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort()) {
      files.push({
        path: path.join(dir, f),
        name: f.replace('.html', '').replace(/^\d+-/, ''),
        num: f.match(/^(\d+)/)?.[1] || '00'
      });
    }
  }
  return files;
}

async function fillStep(page) {
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
      if (!vis(el) || (el.value?.length >= 10)) return; fire(el, S);
    });
    document.querySelectorAll('textarea').forEach(el => {
      if (!vis(el) || (el.value?.length >= 10)) return; fire(el, L);
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
      if (opts.length > 1) fire(el, opts[opts.length - 1].value);
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(el => {
      if (el.offsetParent === null || el.disabled || el.checked) return; el.click();
    });
  }, { S: DUMMY_SHORT, L: DUMMY_LONG });
}

async function collectPageMetrics(page) {
  return page.evaluate(() => {
    const body = document.body;
    const root = document.getElementById('root') || document.getElementById('app');

    return {
      scrollHeight: body.scrollHeight,
      viewportHeight: window.innerHeight,
      needsScroll: body.scrollHeight > window.innerHeight * 1.5,
      excessiveHeight: body.scrollHeight > 3000,

      nextButton: (() => {
        const btn = document.querySelector('.btn-next, .btn-wiz-next');
        if (!btn) return null;
        const rect = btn.getBoundingClientRect();
        return {
          visible: rect.top >= 0 && rect.bottom <= window.innerHeight,
          position: { top: rect.top, bottom: rect.bottom },
          disabled: btn.disabled,
          text: btn.textContent.trim()
        };
      })(),

      hasErrors: window.console._errors?.length > 0,

      currentStep: (() => {
        const active = document.querySelector('.sidebar-step-item.active');
        return active ? active.textContent.trim().substring(0, 30) : 'Unknown';
      })(),

      domNodes: document.querySelectorAll('*').length,
    };
  });
}

async function testTool(browser, tool) {
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  await ctx.addInitScript(AUTH_SCRIPT);
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));
  page.on('dialog', d => d.dismiss().catch(() => {}));

  const screens = [];
  const issues = [];
  const t0 = Date.now();

  try {
    await page.goto(`file:///${tool.path.replace(/\\/g, '/')}`, {
      waitUntil: 'domcontentloaded', timeout: 15000
    });
    await page.waitForTimeout(1500);

    let clicks = 0;
    let lastHeight = 0;
    const MAX_CLICKS = 50;

    while (clicks < MAX_CLICKS) {
      await fillStep(page);

      const metrics = await collectPageMetrics(page);
      screens.push(metrics);

      if (metrics.excessiveHeight) {
        issues.push(`⚠️ Step "${metrics.currentStep}" requires ${metrics.scrollHeight}px scroll (excessive)`);
      }
      if (metrics.nextButton && !metrics.nextButton.visible) {
        issues.push(`🔴 Next button off-screen at step "${metrics.currentStep}"`);
      }
      if (metrics.domNodes > 5000) {
        issues.push(`🐌 Heavy DOM (${metrics.domNodes} nodes) at "${metrics.currentStep}"`);
      }

      const clicked = await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button')].filter(b =>
          b.offsetParent && !b.disabled && !/back|←/i.test(b.textContent)
        );
        if (btns.length === 0) return false;
        btns[0].click();
        return true;
      });

      if (!clicked) break;

      await page.waitForTimeout(500);
      clicks++;

      const newHeight = await page.evaluate(() => document.body.scrollHeight);
      if (newHeight === lastHeight && clicks > 5) {
        issues.push(`🔄 Possible infinite loop detected at step ${clicks}`);
        break;
      }
      lastHeight = newHeight;
    }

    if (clicks >= MAX_CLICKS) {
      issues.push(`🚨 CRITICAL: Tool exceeded ${MAX_CLICKS} steps - possible infinite loop`);
    }

  } catch (err) {
    issues.push(`💥 Fatal error: ${err.message}`);
  }

  await ctx.close();

  const elapsed = Date.now() - t0;
  const avgHeight = screens.length ? Math.round(screens.reduce((s, m) => s + m.scrollHeight, 0) / screens.length) : 0;
  const maxHeight = Math.max(...screens.map(m => m.scrollHeight));

  return {
    screens: screens.length,
    issues: [...new Set(issues)],
    consoleErrors: consoleErrors.slice(0, 5),
    elapsed,
    avgHeight,
    maxHeight,
    status: issues.length === 0 ? '✅' : issues.some(i => i.includes('CRITICAL')) ? '🚨' : '⚠️'
  };
}

async function main() {
  console.log('\n🔍 QA Testing All Tools...\n');

  const tools = findTools();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const tag = `[${String(i+1).padStart(2,'0')}/${tools.length}]`;
    process.stdout.write(`${tag} ${tool.num}-${tool.name}... `);

    const result = await testTool(browser, tool);
    results.push({ ...result, tool: `${tool.num}-${tool.name}` });

    console.log(`${result.status} ${result.screens} screens (${(result.elapsed/1000).toFixed(1)}s)`);
    if (result.issues.length > 0) {
      result.issues.forEach(issue => console.log(`    ${issue}`));
    }
  }

  await browser.close();

  const critical = results.filter(r => r.status === '🚨');
  const warnings = results.filter(r => r.status === '⚠️');
  const passing = results.filter(r => r.status === '✅');

  const report = [
    '# QA Test Report - Fast Track Tools',
    '',
    `**Date:** ${new Date().toISOString().split('T')[0]}`,
    `**Tools Tested:** ${results.length}`,
    `**Status:** ${critical.length} Critical | ${warnings.length} Warnings | ${passing.length} Passing`,
    '',
    '## 🚨 Critical Issues',
    '',
    ...(critical.length ? critical.map(r =>
      `### ${r.tool}\n- Screens: ${r.screens}\n- Time: ${(r.elapsed/1000).toFixed(1)}s\n**Issues:**\n${r.issues.map(i => `- ${i}`).join('\n')}\n`
    ) : ['*No critical issues*']),
    '',
    '## ⚠️ Warnings',
    '',
    ...(warnings.length ? warnings.map(r =>
      `### ${r.tool}\n- Screens: ${r.screens} | Max Height: ${r.maxHeight}px\n**Issues:**\n${r.issues.map(i => `- ${i}`).join('\n')}\n`
    ) : ['*No warnings*']),
    '',
    '## ✅ Passing Tools',
    '',
    ...passing.map(r => `- **${r.tool}** (${r.screens} screens, avg ${r.avgHeight}px)`),
    '',
    '## Summary Table',
    '',
    '| Tool | Status | Screens | Max Height | Time | Issues |',
    '|------|--------|---------|------------|------|--------|',
    ...results.map(r => `| ${r.tool} | ${r.status} | ${r.screens} | ${r.maxHeight}px | ${(r.elapsed/1000).toFixed(1)}s | ${r.issues.length} |`),
  ].join('\n');

  fs.writeFileSync(path.join(OUT_DIR, 'QA-REPORT.md'), report);

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ ${passing.length} passing`);
  console.log(`  ⚠️  ${warnings.length} warnings`);
  console.log(`  🚨 ${critical.length} critical\n`);
  console.log(`Report: ${path.join(OUT_DIR, 'QA-REPORT.md')}\n`);
}

main().catch(console.error);
