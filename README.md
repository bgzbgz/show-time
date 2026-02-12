# Fast Track Tools - Enterprise Platform

> **A comprehensive digital transformation platform with 31 interactive business tools**

## 🎯 Project Overview

Fast Track Tools is an enterprise-grade platform comprising 31 interconnected digital tools designed to guide companies through complete business transformation. From foundational goal-setting to digital transformation, these tools provide a structured, data-driven approach to business growth.

### Key Statistics
- **31 Interactive Tools** organized into 5 modules
- **Enterprise Architecture** with schema separation
- **Single Backend Orchestrator** managing all tools
- **Cross-Tool Dependencies** with intelligent data flow
- **Built for Scale** with PostgreSQL + Node.js backend

## 📁 Project Structure

```
fast-track-tools/
├── frontend/
│   ├── tools/              # 31 HTML tools (React-based)
│   │   ├── 00-woop.html
│   │   ├── 01-know-thyself.html
│   │   └── ...
│   └── shared/
│       ├── fonts/          # Plaak, Riforma, Monument
│       ├── images/         # Logos and shared assets
│       └── styles/         # Common CSS
│
├── backend/ (to be generated)
│   ├── src/
│   │   ├── api/           # REST/GraphQL endpoints
│   │   ├── models/        # Data models (31 schemas)
│   │   ├── services/      # Business logic
│   │   └── middleware/    # Auth, validation, etc.
│   └── migrations/        # Database migrations
│
├── docs/
│   ├── architecture/      # System design docs
│   ├── specs/             # Sprint specifications
│   └── templates/         # Tool templates
│
├── config/
│   ├── tool-registry.json # Central tool registry
│   └── dependencies.json  # Tool dependencies map
│
├── source-materials/      # Original materials (backup)
│
├── DATABASE-SCHEMA.sql    # Complete DB schema
├── ROADMAP.md            # Project roadmap
└── README.md             # This file

```

## 🏗️ Architecture

### Enterprise Design Principles

1. **Schema Separation**: Each tool operates in its own PostgreSQL schema
   - `sprint_00_woop`, `sprint_01_know_thyself`, etc.
   - Ensures data isolation and independent scaling

2. **Single Orchestrator**: Unified backend API manages:
   - Authentication & authorization
   - Cross-tool data dependencies
   - Consistent REST/GraphQL interface

3. **Tool Registry**: Central configuration drives the system
   - Tool metadata (slug, name, sprint number)
   - Schema mappings
   - Dependency graph

### Technology Stack

**Frontend**
- React 18 (via CDN, no build step)
- Tailwind CSS
- Custom fonts (Plaak, Riforma, Monument)
- Standalone HTML files

**Backend** (To be implemented)
- Node.js 18+
- Express/Fastify
- PostgreSQL 14+
- Redis (caching)
- Prisma/TypeORM

**Infrastructure** (Planned)
- Railway/Supabase (database)
- Netlify/Vercel (frontend)
- Docker/Kubernetes (backend)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fast-track-tools
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize database**
   ```bash
   psql -U postgres -f DATABASE-SCHEMA.sql
   ```

4. **Generate backend** (OpenSpec)
   ```bash
   openspec init
   openspec generate --registry config/tool-registry.json
   ```

5. **Start development**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

## 📊 The 31 Tools

### Module 0: Foundation (1 tool)
- **Sprint 00**: WOOP - Goal setting framework

### Module 1: Leadership (11 tools)
- **Sprint 01**: Know Thyself - Personal identity
- **Sprint 02**: Dream - Company vision
- **Sprint 03**: Values - Core values
- **Sprint 04**: Team - Team structure
- **Sprint 05**: FIT - Team assessment
- **Sprint 06**: Cash - Cash flow management
- **Sprint 07**: Energy - Energy management
- **Sprint 08**: Goals - Goal tracking
- **Sprint 09**: Focus - Priority management
- **Sprint 10**: Performance - Performance system
- **Sprint 11**: Meeting Rhythm - Meeting structure

### Module 2: Marketing & Sales (10 tools)
- **Sprint 12**: Market Size - TAM analysis
- **Sprint 13**: Segmentation - Target market
- **Sprint 14**: Target Segment - Deep dive
- **Sprint 15**: Value Proposition - VP Canvas
- **Sprint 16**: VP Testing - Validation
- **Sprint 17**: Product Development - Roadmap
- **Sprint 18**: Pricing - Strategy
- **Sprint 19**: Brand & Marketing - Strategy
- **Sprint 20**: Customer Service - Design
- **Sprint 21**: Route to Market - GTM

### Module 3: Operations (6 tools)
- **Sprint 22**: Core Activities - Mapping
- **Sprint 23**: Processes & Decisions - Framework
- **Sprint 24**: FIT & ABC - Team analysis
- **Sprint 25**: Org Redesign - Structure
- **Sprint 26**: Employer Branding - Talent
- **Sprint 27**: Agile Teams - Workflows

### Module 4: Digitalization (3 tools)
- **Sprint 28**: Digitalization - AI strategy
- **Sprint 29**: Digital Heart - Data lake
- **Sprint 30**: Program Overview - Summary

## 🔗 Tool Dependencies

Tools are interconnected with intelligent data flow:

```
woop → know-thyself → dream → values → team → fit → ...
                   ↓
              goals → focus
                   ↓
              market-size → segmentation → ...
```

See `config/dependencies.json` for complete dependency graph.

## 🎨 Design System

### Fonts
- **Plaak**: Headers and titles
- **Riforma**: Body text
- **Monument**: Labels and mono text

### Colors
- **Black**: `#000000` - Primary
- **White**: `#FFFFFF` - Background
- **Yellow**: `#FFF469` - Accent

### Principles
- Clean, professional design
- Fast Track brand alignment
- No emojis (professional tone)
- Responsive mobile-first

## 📝 Development Workflow

### Adding a New Tool

1. Create HTML file in `frontend/tools/XX-tool-slug.html`
2. Add entry to `config/tool-registry.json`
3. Map dependencies in `config/dependencies.json`
4. Create schema in `DATABASE-SCHEMA.sql`
5. Generate backend API with OpenSpec
6. Test integration
7. Update documentation

### Database Schema Updates

```bash
# Create migration
npm run migration:create add_new_field_to_tool_23

# Run migrations
npm run migration:run

# Rollback if needed
npm run migration:rollback
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

## 📦 Deployment

### Staging
```bash
npm run deploy:staging
```

### Production
```bash
npm run deploy:production
```

## 📖 Documentation

- **Architecture**: See `docs/architecture/`
  - `enterprise-architecture.md` - System design
  - `schema-design.md` - Database architecture
  - `nomenclature.md` - Naming conventions

- **Specs**: See `docs/specs/`
  - Sprint specifications
  - FT docs and brand guidelines

- **Templates**: See `docs/templates/`
  - Tool template
  - Build checklist
  - Build prompt

## 🔐 Security

- JWT-based authentication
- Row-level security in database
- Schema-level isolation
- API rate limiting
- Input validation (Zod)
- SQL injection protection (ORM)

## 🤝 Contributing

This is a private enterprise project. Contact the Fast Track team for contribution guidelines.

## 📋 Status

### Current Phase: **Foundation**
- [x] All 31 tools digitalized
- [x] Enterprise folder structure created
- [x] Tool registry defined
- [x] Dependencies mapped
- [x] Architecture documented
- [ ] Backend generated (OpenSpec)
- [ ] API orchestrator implemented
- [ ] Authentication system
- [ ] Production deployment

### Next Steps
1. Generate backend with OpenSpec
2. Implement API orchestrator
3. Set up authentication
4. Deploy to staging
5. User testing
6. Production launch

## 📞 Contact

**Fast Track Program**
Website: [FastTrack Link]
Support: support@fasttrack.com

## 📄 License

Proprietary - All Rights Reserved
Copyright © 2026 Fast Track Ltd.

---

**Built with ❤️ by the Fast Track Team**

Last Updated: 2026-02-11
Version: 1.0.0
