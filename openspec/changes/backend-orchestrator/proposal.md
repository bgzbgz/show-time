# Backend Orchestrator for Fast Track Tools

## Why

The Fast Track Tools platform consists of 30 interconnected business transformation tools that currently lack a unified backend system. Without a centralized orchestrator, there's no way to manage cross-tool data dependencies, track user progress, or enforce the sequential workflow that the program requires. The CTO has mandated an enterprise-grade single-backend architecture with strict schema separation and API path segregation to enable scalable deployment and maintainable data isolation.

## What Changes

- **Create Node.js/Express backend orchestrator** - Single deployment unit serving all 30 tools
- **Implement 30+ PostgreSQL schemas in Supabase** - Schema separation pattern: `sprint_{XX}_{slug}` plus shared schemas
- **Build REST API with path segregation** - All endpoints follow `/api/tools/{slug}/...` pattern
- **Implement dependency resolution engine** - Orchestrator fetches required data from source tool schemas
- **Add LearnWorlds SSO authentication** - JWT-based auth with LearnWorlds integration
- **Create progress tracking system** - Unlock tools based on dependency completion
- **Add data export capabilities** - PDF/JSON export per tool
- **Integrate n8n AI agent** - Webhook integration for AI-assisted tool completion

## Capabilities

### New Capabilities

- `tool-api`: REST API endpoints for CRUD operations on tool submissions, following `/api/tools/{slug}` pattern
- `schema-management`: PostgreSQL schema structure with separation per tool (30 tool schemas + 3 shared schemas), managed via Supabase
- `dependency-orchestration`: Cross-tool data dependency resolution engine that fetches field-level data from source tools and validates prerequisites
- `authentication`: JWT-based authentication with LearnWorlds SSO integration supporting user, admin, and guru roles
- `progress-tracking`: User progress management system that tracks tool completion status and unlocks tools based on dependency satisfaction
- `field-storage`: Efficient field-level data storage and retrieval using the field_outputs pattern for cross-tool queries
- `data-export`: Export functionality for tool submissions in PDF and JSON formats
- `ai-integration`: n8n webhook integration for AI-assisted tool guidance and completion

### Modified Capabilities
<!-- None - this is net-new backend implementation -->

## Impact

**New Systems:**
- `backend/` - Complete Node.js/Express application with orchestrator logic
- Supabase database with 33+ schemas (30 tools + 3 shared)
- Authentication service with LearnWorlds SSO
- Dependency resolution engine
- Progress tracking service

**Integration Points:**
- Frontend tools (30 HTML tools) will connect to backend APIs
- LearnWorlds LMS for SSO authentication
- n8n for AI agent integration
- Supabase for data persistence

**Dependencies:**
- Node.js 18+
- Express.js framework
- Supabase PostgreSQL database (via MCP)
- Zod for validation
- JWT for authentication
- Prisma or pg for database access

**Data Model:**
- Shared schemas: `shared.users`, `shared.organizations`, `shared.user_progress`
- Tool schemas: 30 schemas following `sprint_{XX}_{slug}` pattern
- Each tool schema contains `submissions` and `field_outputs` tables
- Field-level dependency tracking via field IDs (e.g., `identity.personal_dream`)

**API Surface:**
- `/api/tools` - Tool listing and metadata
- `/api/tools/{slug}/data` - Tool data CRUD
- `/api/tools/{slug}/dependencies` - Cross-tool data retrieval
- `/api/tools/{slug}/export` - Data export
- `/api/data/{field_id}` - Direct field access
- `/api/user/progress` - Progress tracking
- `/api/auth/*` - Authentication endpoints
- `/api/ai/help` - AI integration

**Deployment:**
- Single Docker container
- Railway-ready deployment configuration
- Environment-based configuration for staging/production
