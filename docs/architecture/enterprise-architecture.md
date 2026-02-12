# Fast Track Tools - Enterprise Architecture

## Overview

The Fast Track Program consists of 31 interactive digital tools organized into a cohesive enterprise-grade system. This document outlines the architectural decisions and design patterns.

## Architecture Principles

### 1. Schema Separation
Each tool operates on its own isolated database schema to ensure:
- **Data Independence**: Tools can be deployed, updated, or scaled independently
- **Security**: Data isolation between different program modules
- **Flexibility**: Schemas can evolve without affecting other tools
- **Multi-tenancy**: Easy to partition data by organization/client

### 2. Single Backend Orchestrator
Despite separated schemas, a unified backend API orchestrator provides:
- **Unified Authentication**: Single sign-on across all tools
- **Cross-tool Data Flow**: Managed data dependencies between tools
- **Consistent API Interface**: Standard REST/GraphQL endpoints
- **Centralized Business Logic**: Validation, workflows, and rules

### 3. Tool Registry System
A central registry (`config/tool-registry.json`) defines:
- Tool metadata (slug, name, sprint number)
- Schema mapping (`sprint_XX_toolname`)
- Dependencies between tools
- Module grouping

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
│  31 HTML Tools (React-based, standalone HTML files)         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ REST/GraphQL API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API Orchestrator                        │
│  - Authentication & Authorization                            │
│  - Tool Registry Manager                                     │
│  - Dependency Resolution                                     │
│  - Data Flow Controller                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Database Connections
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database Layer (PostgreSQL)                 │
│                                                              │
│  sprint_00_woop         sprint_01_know_thyself               │
│  sprint_02_dream        sprint_03_values                     │
│  ...                    ...                                  │
│  sprint_29_digital_heart                                     │
│                                                              │
│  + Shared schemas: users, organizations, audit_log          │
└─────────────────────────────────────────────────────────────┘
```

## Schema Naming Convention

All tool schemas follow the pattern:
```
sprint_{XX}_{tool_slug}
```

Examples:
- `sprint_00_woop`
- `sprint_15_value_proposition`
- `sprint_24_fit_abc_analysis`

### Shared Schemas

Some schemas are shared across all tools:
- `users` - User accounts and profiles
- `organizations` - Client companies using the tools
- `audit_log` - Activity tracking across all tools
- `tool_access` - Permissions and access control

## Data Flow Between Tools

Tools can depend on data from previous tools. The orchestrator manages:

1. **Sequential Dependencies**: Tool B requires completion of Tool A
2. **Field Mapping**: Specific fields from Tool A populate Tool B
3. **Validation**: Ensure prerequisite data exists before tool access
4. **Data Transformation**: Convert/adapt data between tool formats

Example: Dream tool (Sprint 02) pulls personal dream from Know Thyself tool (Sprint 01)

## API Design

### Unified Endpoints

```
GET    /api/tools                    - List all available tools
GET    /api/tools/{slug}             - Get tool metadata
GET    /api/tools/{slug}/data        - Get user's data for tool
POST   /api/tools/{slug}/data        - Save user's data for tool
GET    /api/tools/{slug}/dependencies - Get prerequisite tools
POST   /api/tools/{slug}/submit      - Submit completed tool
GET    /api/tools/{slug}/export      - Export tool data (PDF/JSON)
```

### Cross-Tool Data Access

```
GET    /api/data/{source_tool}/{field_path} - Get specific field from another tool
POST   /api/data/transfer                    - Transfer data between tools
GET    /api/user/progress                    - Get user's overall progress
```

## Security Architecture

### Authentication
- JWT-based authentication
- Single sign-on (SSO) integration ready
- LearnWorlds API integration for LMS sync

### Authorization
- Role-based access control (RBAC)
  - Individual Users: Access own tools
  - Team Leaders: Access team aggregations
  - Admins: Full access
  - Gurus: Facilitation and review mode

### Data Isolation
- Row-level security in database
- Organization-based data partitioning
- Schema-level isolation between tools

## Deployment Strategy

### Development
- Local PostgreSQL with all schemas
- Frontend: Static HTML files served locally
- Backend: Node.js API server

### Staging
- Managed PostgreSQL (Railway/Supabase)
- Frontend: Netlify/Vercel
- Backend: Railway/Heroku

### Production
- Managed PostgreSQL with read replicas
- Frontend: CDN distribution
- Backend: Containerized deployment (Docker/Kubernetes)
- Redis for caching and sessions

## Technology Stack

### Frontend
- **Framework**: Vanilla JavaScript + React (CDN)
- **Styling**: Tailwind CSS + Custom Fonts
- **Build**: None (standalone HTML files)
- **State**: localStorage + API sync

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js or Fastify
- **API**: REST + optional GraphQL
- **ORM**: Prisma or TypeORM
- **Validation**: Zod or Joi

### Database
- **Primary**: PostgreSQL 14+
- **Caching**: Redis
- **Search**: PostgreSQL full-text search

### Infrastructure
- **Hosting**: Railway, Supabase, or AWS
- **CDN**: Cloudflare or CloudFront
- **Monitoring**: Sentry + LogRocket
- **Analytics**: Custom event tracking

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Connection pooling for database
- Redis for distributed sessions

### Vertical Scaling
- Schema-level partitioning allows per-tool optimization
- Index strategies per tool requirements
- Materialized views for complex aggregations

### Caching Strategy
- Tool metadata cached (24h TTL)
- User data cached (5min TTL)
- Dependencies graph cached (1h TTL)

## Monitoring & Observability

### Metrics
- API response times per tool
- Database query performance per schema
- User tool completion rates
- Error rates and types

### Logging
- Structured JSON logs
- Request/response logging
- Database query logging (dev only)
- User activity audit trail

### Alerts
- API downtime
- Database connection issues
- High error rates
- Slow query detection

## Development Workflow

1. **Tool Development**: Standalone HTML files with mock data
2. **Schema Design**: Define tables in appropriate schema
3. **API Integration**: Connect tool to backend endpoints
4. **Testing**: Unit tests + integration tests
5. **Deployment**: Atomic deployments (frontend + backend)

## Migration Path

### Phase 1: Foundation (Current)
- Organize tools into enterprise structure
- Define schemas and registry
- Create backend scaffolding

### Phase 2: Backend Development
- Implement orchestrator API
- Set up database with all schemas
- Build authentication system

### Phase 3: Integration
- Connect tools to backend
- Implement data dependencies
- Add cross-tool features

### Phase 4: Enhancement
- Advanced analytics dashboard
- Team collaboration features
- Mobile responsive improvements

## Future Considerations

### Potential Enhancements
- Real-time collaboration (WebSockets)
- Offline-first capability (Service Workers)
- Mobile native apps
- AI-powered insights per tool
- Integration marketplace

### Technical Debt Prevention
- Regular dependency updates
- Performance budgets
- Accessibility audits
- Security scanning

---

**Last Updated**: 2026-02-11
**Version**: 1.0
**Status**: Foundation Phase
