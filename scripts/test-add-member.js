#!/usr/bin/env node
/**
 * Test script for POST /api/admin/users (pre-create company members)
 * Also validates admin panel HTML syntax.
 *
 * Usage: node scripts/test-add-member.js
 */

const API = 'https://backend-production-639c.up.railway.app';
const ADMIN_SUPABASE_ID = '175bc76a-cee8-4d70-8605-0b4a6698a841';
const TEST_ORG_ID = '22222222-2222-2222-2222-222222222222'; // Acme Corp
const TEST_EMAIL = `test-member-${Date.now()}@automated-test.com`;

let adminToken = null;
let createdUserId = null;
let passed = 0;
let failed = 0;

function log(icon, msg) { console.log(`  ${icon} ${msg}`); }
function pass(msg) { passed++; log('✅', msg); }
function fail(msg, detail) { failed++; log('❌', `${msg}${detail ? ' — ' + detail : ''}`); }

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (adminToken) headers['Authorization'] = 'Bearer ' + adminToken;
  const res = await fetch(API + path, { ...opts, headers: { ...headers, ...opts.headers } });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data: json.data, error: json.error, json };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

async function testAdminAuth() {
  console.log('\n── Admin Auth ──');
  const res = await api('/api/admin/auth', {
    method: 'POST',
    body: JSON.stringify({ supabase_user_id: ADMIN_SUPABASE_ID, email: 'admin@test.com' }),
  });
  if (res.ok && res.data?.access_token) {
    adminToken = res.data.access_token;
    pass('Got admin JWT');
  } else {
    fail('Admin auth failed', res.error);
    process.exit(1);
  }
}

async function testCreateUser_missingEmail() {
  console.log('\n── POST /api/admin/users — missing email ──');
  const res = await api('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify({ full_name: 'No Email' }),
  });
  if (res.status === 400) {
    pass(`400 returned: "${res.error}"`);
  } else {
    fail(`Expected 400, got ${res.status}`, res.error);
  }
}

async function testCreateUser_noAuth() {
  console.log('\n── POST /api/admin/users — no auth token ──');
  const savedToken = adminToken;
  adminToken = null;
  const res = await api('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'unauth@test.com' }),
  });
  adminToken = savedToken;
  if (res.status === 401 || res.status === 403) {
    pass(`${res.status} returned without auth`);
  } else {
    fail(`Expected 401/403, got ${res.status}`);
  }
}

async function testCreateUser_success() {
  console.log('\n── POST /api/admin/users — create new member ──');
  const res = await api('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL,
      full_name: 'Test Member',
      organization_id: TEST_ORG_ID,
    }),
  });
  if (res.status === 201 && res.data?.id) {
    createdUserId = res.data.id;
    pass(`201 — user created: ${res.data.id}`);

    // Verify fields
    if (res.data.email === TEST_EMAIL.toLowerCase()) pass('Email normalized to lowercase');
    else fail('Email mismatch', res.data.email);

    if (res.data.role === 'participant') pass('Role = participant');
    else fail('Wrong role', res.data.role);

    if (res.data.organization_id === TEST_ORG_ID) pass('Organization ID set correctly');
    else fail('Org ID mismatch', res.data.organization_id);

    if (res.data.full_name === 'Test Member') pass('Full name set correctly');
    else fail('Name mismatch', res.data.full_name);
  } else {
    fail(`Expected 201, got ${res.status}`, res.error);
  }
}

async function testCreateUser_duplicate() {
  console.log('\n── POST /api/admin/users — duplicate email ──');
  const res = await api('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL, organization_id: TEST_ORG_ID }),
  });
  if (res.status === 409) {
    pass(`409 returned: "${res.error}"`);
  } else {
    fail(`Expected 409, got ${res.status}`, res.error);
  }
}

async function testCreateUser_duplicateCaseInsensitive() {
  console.log('\n── POST /api/admin/users — duplicate email (different case) ──');
  const res = await api('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL.toUpperCase(), organization_id: TEST_ORG_ID }),
  });
  if (res.status === 409) {
    pass('409 — case-insensitive duplicate detected');
  } else {
    fail(`Expected 409, got ${res.status}`, res.error);
  }
}

async function testCreateUser_noName() {
  console.log('\n── POST /api/admin/users — email only (no name) ──');
  const emailOnly = `no-name-${Date.now()}@automated-test.com`;
  const res = await api('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email: emailOnly }),
  });
  if (res.status === 201 && res.data?.id) {
    pass('201 — user created without name or org');
    if (res.data.full_name === null) pass('full_name is null');
    if (res.data.organization_id === null) pass('organization_id is null');
    // Clean up
    await api('/api/admin/users/' + res.data.id, { method: 'PUT', body: JSON.stringify({ full_name: '_delete_me', email: emailOnly, organization_id: null }) });
    // Actually delete via Supabase would need service role, so just leave it — it's a test email
  } else {
    fail(`Expected 201, got ${res.status}`, res.error);
  }
}

async function testUserAppearsInOrgList() {
  console.log('\n── GET /api/admin/organizations — verify member appears ──');
  const res = await api('/api/admin/organizations');
  if (!res.ok) { fail('Failed to load orgs', res.error); return; }

  const users = res.data?.users || [];
  const found = users.find(u => u.id === createdUserId);
  if (found) {
    pass(`User "${found.full_name}" found in org users list`);
    if (found.organization_id === TEST_ORG_ID) pass('Correct org assignment in list');
    else fail('Wrong org in list', found.organization_id);
  } else {
    fail('Created user not found in org users list');
  }
}

async function testAdminPanelSyntax() {
  console.log('\n── Admin panel JSX syntax ──');
  try {
    const fs = require('fs');
    const parser = require('@babel/parser');

    for (const file of ['frontend/admin/index.html', '../admin-panel-tools/index.html']) {
      const fullPath = require('path').resolve(__dirname, '..', file);
      if (!fs.existsSync(fullPath)) { log('⚠️', `Skipped ${file} (not found)`); continue; }

      const html = fs.readFileSync(fullPath, 'utf8');
      const match = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
      if (!match) { fail(`No babel block in ${file}`); continue; }

      parser.parse(match[1], { sourceType: 'module', plugins: ['jsx'] });
      pass(`${file} — JSX syntax OK`);

      // Check that memberModal, addMember, ADD MEMBER are present
      if (match[1].includes('memberModal')) pass(`${file} — memberModal state found`);
      else fail(`${file} — memberModal state missing`);

      if (match[1].includes('addMember')) pass(`${file} — addMember function found`);
      else fail(`${file} — addMember function missing`);

      if (match[1].includes('ADD MEMBER')) pass(`${file} — ADD MEMBER button found`);
      else fail(`${file} — ADD MEMBER button missing`);
    }
  } catch (err) {
    fail('Syntax check error', err.message);
  }
}

// ─── Cleanup ────────────────────────────────────────────────────────────────

async function cleanup() {
  console.log('\n── Cleanup ──');
  if (createdUserId) {
    // We can't DELETE users via admin API (no endpoint), so we rename to flag for manual cleanup
    await api('/api/admin/users/' + createdUserId, {
      method: 'PUT',
      body: JSON.stringify({ full_name: '_TEST_CLEANUP_' + Date.now(), email: TEST_EMAIL, organization_id: null }),
    });
    log('🧹', `Test user ${createdUserId} flagged for cleanup`);
  }
}

// ─── Run ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  Add Member — Integration Test Suite        ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`  Backend:    ${API}`);
  console.log(`  Test email: ${TEST_EMAIL}`);
  console.log(`  Test org:   Acme Corp (${TEST_ORG_ID})`);

  await testAdminAuth();
  await testCreateUser_missingEmail();
  await testCreateUser_noAuth();
  await testCreateUser_success();
  await testCreateUser_duplicate();
  await testCreateUser_duplicateCaseInsensitive();
  await testCreateUser_noName();
  await testUserAppearsInOrgList();
  await testAdminPanelSyntax();
  await cleanup();

  console.log('\n══════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('══════════════════════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
