# Design: Backend Orchestrator for Fast Track Tools

## Context

The Fast Track Tools platform consists of 30 interconnected business transformation tools (Sprint 0 through Sprint 30) that guide companies through a structured transformation program. Currently, these tools exist as standalone HTML files with no backend infrastructure.

**Current State:**
- 30 HTML tools in `frontend/tools/`
- No data persistence layer
- No user authentication
- No cross-tool data flow
- No progress tracking or tool unlocking logic
- Tool metadata exists in `config/tool-registry.json` and `config/dependencies.json`

**Constraints:**
- CTO Requirements: Single backend container, schema separation, API path segregation
- Must support 30 tools with complex interdependencies (Sprint 30 depends on ALL previous sprints)
- Field-level dependency tracking (e.g., Sprint 2 needs `identity.personal_dream` from Sprint 1)
- LearnWorlds LMS integration for SSO
- Supabase PostgreSQL for data persistence
- Must be Railway-deployment ready

**Stakeholders:**
- End users: Business leaders using the tools
- Fast Track gurus: Coaches guiding users
- System administrators: Managing deployments
- Frontend developers: Integrating HTML tools with APIs

## Goals / Non-Goals

**Goals:**
- Create single Node.js/Express backend serving all 30 tools via unified API
- Implement schema separation with 33+ PostgreSQL schemas in Supabase (30 tools + 3 shared)
- Build dependency resolution engine that fetches cross-tool data and validates prerequisites
- Enable tool unlocking based on completion of required dependencies
- Provide JWT authentication with LearnWorlds SSO integration
- Support data export (PDF/JSON) per tool
- Integrate n8n AI agent for tool assistance
- Deploy as single Docker container to Railway

**Non-Goals:**
- Not rebuilding frontend tools (they remain as HTML files)
- Not implementing real-time collaboration features
- Not building a custom ORM (will use Prisma or raw SQL with pg)
- Not supporting multiple database backends (Supabase PostgreSQL only)
- Not implementing payment processing (future sprint)
- Not building mobile apps (future consideration)

## Decisions

### Decision 1: Express.js + Modular Service Architecture

**Choice:** Use Express.js with service-oriented architecture separating concerns into:
- Controllers (request handling)
- Services (business logic)
- Models (data access)
- Middleware (auth, validation, error handling)

**Rationale:**
- Express is mature, well-documented, and has extensive ecosystem
- Service layer enables testability and separation of concerns
- Modular structure scales to 30+ tools without becoming monolithic
- Middleware pattern fits auth, validation, and logging needs

**Alternatives Considered:**
- Fastify: Higher performance but smaller ecosystem, less team familiarity
- NestJS: More opinionated structure but heavier framework for straightforward REST API needs
- Raw Node.js HTTP: Too low-level, would reinvent common patterns

### Decision 2: Prisma for Database Access

**Choice:** Use Prisma ORM with manual schema management for Supabase

**Rationale:**
- Type-safe database access with generated TypeScript types
- Migration system for schema evolution
- Excellent Supabase integration
- Introspection of existing schemas
- Query builder reduces SQL injection risk

**Implementation Notes:**
- Will NOT use Prisma to create the 30+ tool schemas (too complex for Prisma schema definition)
- Instead: Create schemas via Supabase MCP SQL, then use Prisma introspection
- Prisma Client will provide type-safe access to all schemas

**Alternatives Considered:**
- Raw `pg` library: More control but loses type safety and migration system
- TypeORM: More complex decorator syntax, less modern than Prisma
- Drizzle: Newer but less mature ecosystem

### Decision 3: Schema-per-Tool Pattern with Field Outputs Table

**Choice:** Each tool gets its own schema (`sprint_{XX}_{slug}`) with two core tables:
1. `submissions` - Main tool data storage (JSONB column for flexibility)
2. `field_outputs` - Normalized field-level data for cross-tool queries

**Rationale:**
- Schema separation provides data isolation and independent scaling
- JSONB in submissions allows flexible tool-specific data without rigid structure
- `field_outputs` table enables efficient cross-tool dependency queries
- Pattern: `SELECT field_value FROM sprint_01_know_thyself.field_outputs WHERE field_id = 'identity.personal_dream'`

**Schema Structure:**
```sql
-- Example: sprint_01_know_thyself schema
CREATE TABLE submissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES shared.users,
  organization_id UUID,
  data JSONB,  -- All tool-specific fields
  status VARCHAR,
  version INTEGER,
  created_at, updated_at, submitted_at, completed_at TIMESTAMPS
);

CREATE TABLE field_outputs (
  id UUID PRIMARY KEY,
  submission_id UUID REFERENCES submissions,
  field_id VARCHAR,  -- e.g., 'identity.personal_dream'
  field_value JSONB,
  created_at TIMESTAMP
);

CREATE INDEX idx_field_outputs_field_id ON field_outputs(field_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
```

**Alternatives Considered:**
- Single database with tool_id discriminator: Loses schema isolation, harder to scale
- Separate databases per tool: Overly complex, expensive, cross-tool queries become distributed queries
- Document store (MongoDB): Loses relational capabilities needed for cross-tool joins

### Decision 4: Dependency Orchestrator Service

**Choice:** Create `ToolOrchestrator` service with three core methods:
1. `resolveDependencies(toolSlug, userId)` - Fetch required fields from source tools
2. `checkUnlockStatus(toolSlug, userId)` - Validate if user can access tool
3. `updateProgress(userId, toolSlug, status)` - Track completion and unlock downstream tools

**Rationale:**
- Centralizes complex dependency logic in one service
- Service reads dependency metadata from `config/dependencies.json`
- Enables caching of frequently-accessed dependency data
- Provides single point for dependency validation rules

**Implementation Pattern:**
```typescript
// Example: Sprint 2 (Dream) needs fields from Sprint 1
const dependencies = await orchestrator.resolveDependencies('dream', userId);
// Returns: {
//   'identity.personal_dream': '...value from Sprint 1...',
//   'identity.personal_values': '...value from Sprint 1...'
// }

const canAccess = await orchestrator.checkUnlockStatus('dream', userId);
// Returns: { unlocked: true/false, missingDeps: [...] }
```

**Alternatives Considered:**
- GraphQL with DataLoader: Overkill for this use case, adds complexity
- Event-driven updates: Too complex for sequential workflow, hard to debug
- Client-side dependency resolution: Security risk, can't enforce prerequisites

### Decision 5: JWT + LearnWorlds SSO Flow

**Choice:** Implement JWT authentication with LearnWorlds SSO callback:
1. User authenticates in LearnWorlds LMS
2. LearnWorlds redirects to `/api/auth/sso` with signed payload
3. Backend validates signature, creates/updates user in `shared.users`
4. Backend issues JWT token with user claims (id, role, organization_id)
5. Frontend stores JWT in localStorage, includes in Authorization header

**Rationale:**
- JWT is stateless, scales horizontally without session store
- LearnWorlds SSO enables single sign-on from LMS
- Role-based claims (user, admin, guru) enable authorization
- No additional auth infrastructure needed (no OAuth server, no auth database)

**Security:**
- JWT expiry: 24 hours (configurable)
- Refresh tokens: 7 days (stored in httpOnly cookie for security)
- LearnWorlds SSO signature validation prevents token forgery
- HTTPS required in production

**Alternatives Considered:**
- Session-based auth: Requires Redis/session store, doesn't scale horizontally
- OAuth 2.0 server: Overkill, Fast Track controls both LMS and backend
- Firebase Auth: Adds external dependency, not needed with LearnWorlds integration

### Decision 6: API Path Structure `/api/tools/{slug}/...`

**Choice:** Nest all tool operations under `/api/tools/{slug}` prefix:
- `GET /api/tools/{slug}` - Tool metadata
- `GET /api/tools/{slug}/data` - Get user's submission
- `POST /api/tools/{slug}/data` - Save/update submission
- `POST /api/tools/{slug}/submit` - Mark tool as submitted
- `GET /api/tools/{slug}/dependencies` - Get required cross-tool data
- `GET /api/tools/{slug}/export` - Export as PDF/JSON

**Rationale:**
- Clear separation per CTO requirement
- RESTful, predictable URLs
- Easy to add per-tool middleware (validation, specific auth rules)
- Tool slug maps directly to schema name: `slug -> sprint_{XX}_{slug}`

**Middleware Chain:**
```
Request → JWT Auth → Tool Exists → User Access Check → Tool-Specific Validation → Controller
```

**Alternatives Considered:**
- Flat structure `/api/data/{slug}`: Less clear hierarchy, harder to apply tool-specific middleware
- GraphQL single endpoint: Overkill for CRUD operations, harder for frontend to adopt

### Decision 7: Data Export via Templating Engine

**Choice:** Use Handlebars templates + Puppeteer for PDF generation:
1. Each tool has a Handlebars template in `backend/src/templates/{slug}.hbs`
2. Export service renders template with user's submission data
3. Puppeteer converts HTML to PDF for PDF exports
4. JSON exports return raw submission data

**Rationale:**
- Handlebars is simple, logic-less templating
- Puppeteer generates high-quality PDFs with CSS styling
- Templates can be customized per tool without code changes
- Separates presentation (templates) from data (submissions)

**Alternatives Considered:**
- PDF libraries (pdfkit, jsPDF): Programmatic PDF creation is tedious, hard to maintain
- External service (DocRaptor): Adds external dependency and cost
- HTML-only export: Users expect PDF for sharing and printing

### Decision 8: Zod for Request Validation

**Choice:** Use Zod schemas for all API request/response validation

**Rationale:**
- Type-safe validation with TypeScript inference
- Composable schemas (can reuse field validators)
- Clear error messages for clients
- Runtime validation catches invalid data before business logic

**Pattern:**
```typescript
const SaveSubmissionSchema = z.object({
  data: z.record(z.unknown()),  // Tool-specific JSONB
  status: z.enum(['draft', 'in_progress', 'submitted', 'completed'])
});

app.post('/api/tools/:slug/data', validate(SaveSubmissionSchema), controller.saveSubmission);
```

**Alternatives Considered:**
- Joi: Less TypeScript integration, older API
- Class-validator: Decorator-based, more verbose
- Manual validation: Error-prone, no type inference

## Risks / Trade-offs

**Risk: Schema Count (33+ schemas) May Hit Supabase Limits**
→ **Mitigation:** Verify Supabase plan supports 33+ schemas. Supabase Pro plan supports this. Fallback: Combine related sprints into shared schemas if needed.

**Risk: JSONB Flexibility May Lead to Data Inconsistency**
→ **Mitigation:** Use Zod schemas to validate tool-specific data structure. Document expected fields per tool. Use `field_outputs` for critical cross-tool fields to enforce structure.

**Risk: Cross-Schema Queries Are Slower Than Single-Schema Joins**
→ **Mitigation:** Index `field_outputs.field_id` for fast lookups. Cache frequently-accessed dependencies in Redis (future). Most queries are single-user, so performance should be acceptable.

**Risk: JWT Token Size Grows with Claims**
→ **Mitigation:** Keep JWT claims minimal (id, role, org_id). Store additional user metadata in database, not token.

**Risk: Puppeteer PDF Generation Is Resource-Intensive**
→ **Mitigation:** Run PDF exports as background jobs (future: use job queue like BullMQ). Return 202 Accepted with job ID, poll for completion. Implement rate limiting on export endpoints.

**Risk: 30 Tool Schemas Make Prisma Schema File Massive**
→ **Mitigation:** Use Prisma multi-file schema feature (schemas folder). Alternatively, use introspection mode and raw SQL for complex queries.

**Risk: Cascading Dependencies Mean Sprint 30 Has Complex Unlock Logic**
→ **Mitigation:** Pre-compute unlock status in `shared.user_progress` table. Update on tool completion, not on every access check. Provides O(1) lookup instead of recursive dependency checks.

**Trade-off: Single Backend vs. Microservices**
- **Chosen:** Single backend (monolith)
- **Pro:** Simpler deployment, shared code, single database transaction context
- **Con:** Scales as one unit, can't independently scale high-traffic tools
- **Acceptable Because:** Tool usage is sequential, not concurrent. Users work on one tool at a time.

**Trade-off: JSONB Flexibility vs. Strict Schema**
- **Chosen:** JSONB for tool data, normalized `field_outputs` for cross-tool fields
- **Pro:** Tools can evolve structure without migrations. Fast iteration.
- **Con:** Less database-level validation, potential for inconsistent data.
- **Acceptable Because:** Zod validation at API layer. Critical fields are normalized in `field_outputs`.

## Migration Plan

### Phase 1: Database Setup (Week 1)
1. Create shared schemas in Supabase via MCP:
   - `shared.users`
   - `shared.organizations`
   - `shared.user_progress`
2. Create 30 tool schemas with `submissions` and `field_outputs` tables
3. Create indexes on critical lookup fields
4. Seed with test data for development

### Phase 2: Core Backend (Week 2-3)
1. Set up Express app structure
2. Implement JWT authentication and LearnWorlds SSO endpoint
3. Create base CRUD routes for tool data (`/api/tools/{slug}/data`)
4. Implement ToolOrchestrator service for dependency resolution
5. Add middleware for auth, validation, error handling

### Phase 3: Tool-Specific Features (Week 4)
1. Implement progress tracking and tool unlocking
2. Add data export functionality (PDF/JSON)
3. Create n8n AI webhook integration
4. Test with 3-5 sample tools end-to-end

### Phase 4: Deployment (Week 5)
1. Create Dockerfile and docker-compose.yml
2. Set up Railway deployment
3. Configure environment variables for staging/production
4. Deploy to staging, run integration tests
5. Deploy to production

### Rollback Strategy
- Database: Keep schema migration scripts reversible
- API: Version API if breaking changes needed (`/api/v1/tools/...`)
- Deployment: Railway supports instant rollback to previous deployment
- Data: Regular Supabase backups, can restore within 24 hours

## Open Questions

**Q1: How do we handle partial tool completion?**
- Option A: Auto-save drafts every N seconds
- Option B: Manual "Save Draft" button
- **Recommendation:** Option A for UX, with debouncing

**Q2: Should tool exports include data from dependencies?**
- Example: Should Dream tool export include data from Know Thyself?
- **Recommendation:** Yes, include dependency data in exports for complete context

**Q3: What happens if a user's organization changes while they have in-progress tools?**
- **Recommendation:** Lock organization_id on first tool start. Allow admin override only.

**Q4: Rate limiting strategy for AI integration?**
- **Recommendation:** 10 requests per user per hour. Track in Redis.

**Q5: Do we support multiple concurrent submissions per tool?**
- Example: User starts Sprint 1, doesn't finish, starts again
- **Recommendation:** One active submission per tool per user. Archive previous on new start.

**Q6: PDF template design - who owns this?**
- **Recommendation:** Initial templates by dev team. Guru team can customize via Handlebars (no-code).

**Q7: Do we need webhooks for tool completion events?**
- Use case: Notify LearnWorlds when user completes Sprint 5
- **Recommendation:** Not MVP. Add in Phase 2 if needed.
