# Fast Track Backend Orchestrator

Backend API for the Fast Track Tools platform - managing 30 interconnected business transformation tools with smart dependency resolution and progress tracking.

## Overview

The Fast Track Backend is a Node.js/Express REST API that orchestrates a workflow of 30 business tools (Sprint 0-29 + Sprint 30 overview). It handles:

- **User Authentication**: LearnWorlds SSO with JWT tokens
- **Tool Management**: CRUD operations for 30 tool submissions
- **Dependency Orchestration**: Cross-tool field-level dependencies
- **Progress Tracking**: Automatic tool unlocking based on completion
- **Data Export**: JSON and PDF exports with custom templates
- **AI Integration**: n8n webhook for AI-powered help

## Architecture

- **Single Container**: One Node.js app manages all 30 tools
- **Schema Separation**: 33 PostgreSQL schemas (3 shared + 30 tools)
- **API Path Segregation**: `/api/tools/{slug}/...` pattern
- **Field-Level Dependencies**: Tools reference specific fields from previous tools

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Authentication**: JWT + LearnWorlds SSO (HMAC SHA256)
- **PDF Generation**: Puppeteer + Handlebars
- **Testing**: Vitest with 70% coverage threshold
- **Deployment**: Docker + Railway

## Prerequisites

- Node.js 18 or higher
- PostgreSQL (or Supabase account)
- npm or yarn

## Installation

1. **Clone the repository**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing (min 32 chars)
- `LEARNWORLDS_SSO_SECRET`: Secret for SSO validation
- `N8N_WEBHOOK_URL`: n8n webhook URL for AI integration

4. **Run database migrations**

```bash
# Connect to your Supabase database
psql $DATABASE_URL

# Run migrations
\i migrations/001-initial-schemas/001-shared-schemas.sql
\i migrations/001-initial-schemas/002-tool-schemas.sql
```

Or use the Supabase dashboard SQL editor.

5. **Generate Prisma client**

```bash
npm run db:generate
```

## Development

**Start development server** (with hot reload):

```bash
npm run dev
```

Server runs on `http://localhost:3000`

**Run tests**:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

**Linting and formatting**:

```bash
npm run lint          # Check code
npm run lint:fix      # Fix issues
npm run format        # Format with Prettier
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

**POST /api/auth/sso** - LearnWorlds SSO callback
**POST /api/auth/refresh** - Refresh access token
**GET /api/auth/me** - Get current user
**POST /api/auth/logout** - Logout

### Tools

**GET /api/tools** - List all tools with user progress
**GET /api/tools/:slug** - Get tool metadata
**GET /api/tools/:slug/data** - Get user's submission
**POST /api/tools/:slug/data** - Save/update submission
**POST /api/tools/:slug/submit** - Submit tool for completion
**GET /api/tools/:slug/dependencies** - Get dependency data
**GET /api/tools/:slug/export** - Export submission (JSON or PDF)

### User Progress

**GET /api/user/progress** - Overall progress summary
**GET /api/user/next-tool** - Next available tool
**GET /api/user/stats** - User statistics

### Data Fields

**GET /api/data/:fieldId** - Get specific field value
**POST /api/data/batch** - Batch get multiple fields

### AI Integration

**POST /api/ai/help** - Get AI assistance for a tool

## Database Schema

### Shared Schemas

- **shared.users** - User accounts from LearnWorlds
- **shared.organizations** - Organization/company data
- **shared.user_progress** - Progress tracking for all 30 tools

### Tool Schemas (30 total)

Each tool has its own schema following the pattern `sprint_{XX}_{slug}`:

- `sprint_00_woop`
- `sprint_01_identity`
- `sprint_02_vision`
- ... (Sprint 3-29)
- `sprint_30_program_overview`

Each tool schema contains:
- **submissions** table - User submission data (JSONB)
- **field_outputs** table - Extracted field values for dependencies

## Dependency System

Tools can depend on specific fields from previous tools:

```json
{
  "sprint-2-vision": {
    "dependencies": ["identity.personal_dream", "identity.core_values"],
    "outputs": ["vision.statement"]
  }
}
```

The orchestrator automatically:
1. Resolves field values from source tools
2. Checks unlock status based on dependency completion
3. Unlocks dependent tools when prerequisites complete

## Rate Limiting

- **Exports**: 10 per hour per user
- **AI requests**: 10/hour for users, 50/hour for admin/guru

## Environment Variables

See `.env.example` for all variables. Key categories:

- **Application**: `NODE_ENV`, `APP_PORT`, `APP_URL`
- **Database**: `DATABASE_URL`
- **JWT**: `JWT_SECRET`, `JWT_EXPIRY`
- **LearnWorlds**: `LEARNWORLDS_SSO_SECRET`
- **n8n**: `N8N_WEBHOOK_URL`
- **CORS**: `CORS_ORIGIN`

## Docker Deployment

**Build image**:

```bash
docker build -t fast-track-backend .
```

**Run container**:

```bash
docker run -p 3000:3000 --env-file .env fast-track-backend
```

**Docker Compose** (includes PostgreSQL):

```bash
docker-compose up
```

## Railway Deployment

1. Create new Railway project
2. Connect GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy automatically on push to main

Railway configuration:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 3000

## Testing

Run full test suite:

```bash
npm run test:coverage
```

Tests cover:
- **Unit tests**: Services (Auth, Orchestrator, Progress, FieldStorage)
- **Integration tests**: API endpoints, authentication flow
- **Coverage**: Minimum 70% threshold enforced

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL

# Check Prisma schema
npm run db:generate
```

### SSO Signature Validation Fails

- Verify `LEARNWORLDS_SSO_SECRET` matches LearnWorlds dashboard
- Check timestamp is within 5 minutes

### Tool Not Unlocking

- Check dependencies: `GET /api/tools/:slug/dependencies`
- Verify previous tool is completed: `GET /api/user/progress`

### PDF Export Fails

- Ensure Puppeteer/Chromium is installed
- Check `PUPPETEER_EXECUTABLE_PATH` if using custom Chrome

## Support

For issues or questions:
- **GitHub**: [Repository Issues](https://github.com/fast-track/backend)
- **Email**: dev@fasttrack.com
- **Docs**: [Full Documentation](https://docs.fasttrack.com)

## License

Proprietary - © 2024 Fast Track Ltd.
