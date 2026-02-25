# Database Decision: MongoDB vs Supabase

**Date:** 2026-02-03
**Context:** CTO meeting feedback - need to evaluate NoSQL vs SQL for production

---

## Current State

- **Database:** MongoDB Atlas (NoSQL)
- **Collections:** ~15 (jobs, audit_log, tool responses, quality scores, etc.)
- **Tenant Model:** None (single-tenant currently)
- **Data:** Semi-structured (tool specs, AI responses, user inputs)

---

## Option A: Keep MongoDB Atlas

### Pros
1. **Already implemented** - No migration needed
2. **Schema flexibility** - Tool specs evolve without migrations
3. **JSON-native** - AI responses store directly
4. **Good for documents** - Tool HTML, QA reports, logs
5. **Atlas has good DX** - Charts, triggers, search

### Cons
1. **Manual tenant isolation** - Must add `tenant_id` filter to EVERY query
2. **No RLS** - Security relies on application code
3. **Weak relationships** - Jobs → Tools → Responses need manual joins
4. **No built-in auth** - DIY authentication
5. **Serverless cold starts** - Atlas Serverless can be slow

### Tenant Isolation Pattern (MongoDB)
```typescript
// EVERY query needs this filter - easy to forget
async function getJobs(tenantId: string) {
  return db.collection('jobs').find({
    tenant_id: tenantId,  // MUST NOT FORGET THIS
    status: 'READY_FOR_REVIEW'
  });
}

// Middleware approach (better but still manual)
function tenantFilter(tenantId: string) {
  return { tenant_id: tenantId };
}
```

---

## Option B: Migrate to Supabase (PostgreSQL)

### Pros
1. **Row Level Security (RLS)** - Automatic tenant isolation at DB level
2. **Built-in Auth** - Users, sessions, JWT tokens
3. **Real-time subscriptions** - Live updates for job status
4. **Strong typing** - Foreign keys, constraints
5. **Vercel integration** - Native serverless support
6. **PostgREST API** - Auto-generated REST API
7. **Edge Functions** - Run code close to users

### Cons
1. **Migration required** - ~2-3 days of work
2. **Schema migrations** - Need to manage with migrations
3. **JSON less native** - JSONB works but not as natural
4. **Learning curve** - New patterns for team

### Tenant Isolation Pattern (Supabase RLS)
```sql
-- One-time setup: ALL queries are automatically filtered
CREATE POLICY "tenant_isolation" ON jobs
  USING (tenant_id = auth.jwt()->>'tenant_id');

-- Now queries are automatically safe
SELECT * FROM jobs WHERE status = 'READY_FOR_REVIEW';
-- ↑ Supabase adds: AND tenant_id = [current_user's_tenant]
```

---

## Feature Comparison

| Feature | MongoDB | Supabase | Winner |
|---------|---------|----------|--------|
| **Tenant Isolation** | Manual filters | RLS (automatic) | 🏆 Supabase |
| **Authentication** | DIY | Built-in | 🏆 Supabase |
| **Real-time** | Change Streams | Native subscriptions | 🏆 Supabase |
| **Schema Flexibility** | Excellent | Good (JSONB) | 🏆 MongoDB |
| **Document Storage** | Native | JSONB column | 🏆 MongoDB |
| **Vercel Compatibility** | Good | Excellent | 🏆 Supabase |
| **Existing Code** | Works | Needs rewrite | 🏆 MongoDB |
| **Cost at Scale** | Variable | Predictable | Tie |
| **Security Audit** | More work | Built-in | 🏆 Supabase |

---

## Data Model Comparison

### MongoDB (Current)
```javascript
// jobs collection
{
  _id: ObjectId,
  job_id: "uuid",
  tenant_id: "tenant_uuid",  // Must add manually
  status: "READY_FOR_REVIEW",
  tool_html: "<html>...",    // Large document
  questionnaire: { ... },    // Nested object
  qa_report: { ... }         // Nested object
}
```

### Supabase (Proposed)
```sql
-- jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  status job_status NOT NULL,
  questionnaire JSONB,
  qa_report JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- tool_html in separate table (large content)
CREATE TABLE job_artifacts (
  job_id UUID REFERENCES jobs(id),
  artifact_type TEXT, -- 'html', 'preview', etc.
  content TEXT,
  PRIMARY KEY (job_id, artifact_type)
);

-- RLS policy (one-time setup)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON jobs
  USING (tenant_id = auth.jwt()->>'tenant_id');
```

---

## Migration Effort Estimate

### If migrating to Supabase:

| Task | Effort |
|------|--------|
| Schema design | 4 hours |
| Create tables + RLS policies | 4 hours |
| Migrate db/connection.ts | 2 hours |
| Migrate services (jobStore, etc.) | 8 hours |
| Migrate routes | 4 hours |
| Auth integration | 4 hours |
| Testing | 8 hours |
| **Total** | **~34 hours (4-5 days)** |

---

## Recommendation

### Short-term (Next 2 weeks): Keep MongoDB
- You have working code
- CTO demo needs stability
- Add tenant_id field now for future-proofing

### Medium-term (Before production): Migrate to Supabase
- RLS is too valuable for multi-tenant SaaS
- Built-in auth saves significant development
- Vercel + Supabase is a proven stack
- Security audits will be easier

### Hybrid Option: Keep Both
- MongoDB for: Tool HTML storage, AI logs, quality scores
- Supabase for: Users, tenants, jobs metadata, auth
- This adds complexity but optimizes for each use case

---

## Immediate Actions (MongoDB Prep for Migration)

1. **Add tenant_id to all collections** - Even before Supabase migration
2. **Create tenant middleware** - Centralize tenant filtering
3. **Abstract database layer** - So migration is easier later

```typescript
// services/database/tenantContext.ts
export function withTenant<T extends object>(
  query: T,
  tenantId: string
): T & { tenant_id: string } {
  return { ...query, tenant_id: tenantId };
}

// Usage
const jobs = await collection.find(
  withTenant({ status: 'READY' }, req.tenantId)
);
```

---

## Decision Needed

**Question for you:**

1. **Timeline to production?** If < 1 month, stay MongoDB. If > 2 months, consider Supabase.

2. **Multi-tenant priority?** If selling to multiple companies soon, Supabase RLS is worth the migration.

3. **Auth requirements?** If you need user management (not just LearnWorlds SSO), Supabase auth is a big win.

---

*Document prepared by Claude Code analysis*
