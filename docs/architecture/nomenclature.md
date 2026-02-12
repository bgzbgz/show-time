# Fast Track Tools - Naming Conventions & Nomenclature

## Overview

Consistent naming across the entire Fast Track ecosystem ensures maintainability, clarity, and ease of integration.

## Tool Identification

### Sprint Numbers
- **Format**: Two-digit zero-padded numbers (00-30)
- **Range**: 00 (WOOP) through 30 (Program Overview)
- **Total**: 31 tools

### Tool Slugs
- **Format**: Lowercase with hyphens
- **Pattern**: `{sprint_number}-{descriptive-slug}`
- **Examples**:
  - `00-woop`
  - `15-value-proposition`
  - `24-fit-abc-analysis`

### Tool Names (Display)
- **Format**: Title Case
- **Pattern**: Full descriptive name
- **Examples**:
  - "WOOP"
  - "Value Proposition Canvas"
  - "FIT & ABC Analysis"

## File Naming

### HTML Tool Files
```
frontend/tools/{sprint_number}-{slug}.html
```
Examples:
- `frontend/tools/00-woop.html`
- `frontend/tools/15-value-proposition.html`
- `frontend/tools/24-fit-abc-analysis.html`

### Documentation Files
```
docs/{category}/{descriptive-name}.md
```
Examples:
- `docs/architecture/enterprise-architecture.md`
- `docs/specs/sprint-connections.md`
- `docs/templates/tool-template.md`

### Configuration Files
```
config/{purpose}.json
```
Examples:
- `config/tool-registry.json`
- `config/dependencies.json`

## Database Naming

### Schema Names
```
sprint_{sprint_number}_{slug}
```
Examples:
- `sprint_00_woop`
- `sprint_15_value_proposition`
- `sprint_24_fit_abc_analysis`

### Table Names
- **Format**: Snake_case, plural for collections
- **Pattern**: `{schema}.{table_name}`

Within tool schemas:
```
sprint_00_woop.tool_data
sprint_00_woop.audit_log
sprint_15_value_proposition.tool_data
sprint_15_value_proposition.hypotheses
```

Shared schemas:
```
users.accounts
users.profiles
organizations.companies
audit.events
tool_access.permissions
```

### Column Names
- **Format**: snake_case
- **Booleans**: Prefix with `is_`, `has_`, `can_`
- **Timestamps**: Suffix with `_at`
- **Foreign Keys**: `{table}_id`

Examples:
```sql
user_id
organization_id
is_completed
has_dependencies
created_at
updated_at
completed_at
```

## API Naming

### Endpoints
- **Format**: Lowercase with hyphens
- **Pattern**: RESTful conventions

```
/api/tools                           # Collection
/api/tools/{slug}                    # Individual tool
/api/tools/{slug}/data               # Tool data
/api/tools/{slug}/dependencies       # Tool dependencies
```

### Query Parameters
- **Format**: snake_case
```
?user_id=123
?organization_id=456
?include_dependencies=true
?status=completed
```

### JSON Field Names
- **Format**: camelCase (frontend), snake_case (backend)
- **Transformation**: API layer converts between conventions

Frontend (camelCase):
```json
{
  "toolSlug": "value-proposition",
  "userId": "123",
  "completedAt": "2026-02-11T10:00:00Z"
}
```

Backend/Database (snake_case):
```json
{
  "tool_slug": "value-proposition",
  "user_id": "123",
  "completed_at": "2026-02-11T10:00:00Z"
}
```

## Code Conventions

### JavaScript/TypeScript

#### Variables & Functions
```javascript
// camelCase for variables and functions
const toolRegistry = loadToolRegistry();
const userId = getCurrentUser();

function getToolDependencies(slug) { }
async function saveToolData(slug, data) { }
```

#### Classes & Components
```javascript
// PascalCase for classes and React components
class ToolOrchestrator { }
class DatabaseConnection { }

function ValuePropositionTool({ data }) { }
function ProgressIndicator({ currentStep }) { }
```

#### Constants
```javascript
// UPPER_SNAKE_CASE for constants
const MAX_TOOLS = 31;
const API_BASE_URL = 'https://api.fasttrack.com';
const DEFAULT_TIMEOUT = 30000;
```

#### File Names
```
// kebab-case for files
tool-orchestrator.js
database-connection.js
value-proposition-tool.jsx
progress-indicator.component.jsx
```

### SQL Conventions

#### Queries
- Keywords: UPPERCASE
- Identifiers: lowercase

```sql
SELECT user_id, tool_slug, status
FROM tool_access.progress
WHERE user_id = $1
  AND status = 'completed'
ORDER BY completed_at DESC;
```

#### Migrations
```
migrations/
  {timestamp}_{description}.sql

Examples:
  20260211_120000_create_sprint_00_woop.sql
  20260211_120100_add_dependencies_table.sql
```

## Module Organization

### Frontend Modules
```
frontend/
  tools/           # Individual HTML tools
  shared/
    fonts/         # Font files
    images/        # Shared images
    styles/        # Common CSS
```

### Backend Modules
```
backend/
  src/
    api/           # API routes
    models/        # Data models
    services/      # Business logic
    middleware/    # Express middleware
    utils/         # Utility functions
    config/        # Configuration
```

## Environment Variables

### Naming
- **Format**: UPPER_SNAKE_CASE
- **Prefixes**:
  - `DB_` for database config
  - `API_` for API config
  - `REDIS_` for Redis config
  - `JWT_` for authentication config

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fasttrack
DB_USER=postgres
DB_PASSWORD=secret

# API
API_PORT=3000
API_BASE_URL=http://localhost:3000
API_RATE_LIMIT=100

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h

# External Services
LEARNWORLDS_API_KEY=xxx
LEARNWORLDS_API_SECRET=yyy
```

## Version Control

### Git Branches
```
main                    # Production
staging                 # Staging environment
develop                 # Development
feature/{feature-name}  # New features
fix/{bug-description}   # Bug fixes
hotfix/{issue}          # Production hotfixes
```

### Commit Messages
```
{type}({scope}): {subject}

type: feat, fix, docs, style, refactor, test, chore
scope: tool-slug or component name
subject: Short description

Examples:
feat(woop): Add PDF export functionality
fix(api): Resolve CORS issues on production
docs(architecture): Update schema design
refactor(auth): Simplify JWT token generation
```

### Tags
```
v{major}.{minor}.{patch}

Examples:
v1.0.0    # Initial release
v1.1.0    # New feature added
v1.1.1    # Bug fix
```

## Tool Registry Fields

### Required Fields
- `slug`: Tool identifier (kebab-case)
- `sprint_number`: Sprint number (0-30)
- `name`: Display name (Title Case)
- `schema_name`: Database schema (sprint_XX_slug)
- `module`: Module number (0-4)
- `file`: HTML filename
- `dependencies`: Array of prerequisite slugs
- `is_optional`: Boolean

### Example
```json
{
  "slug": "value-proposition",
  "sprint_number": 15,
  "name": "Value Proposition Canvas",
  "schema_name": "sprint_15_value_proposition",
  "module": 2,
  "file": "15-value-proposition.html",
  "dependencies": ["target-segment-deep-dive"],
  "is_optional": false
}
```

## Module Classification

The 31 tools are organized into 5 modules:

### Module 0: Foundation (Sprint 00)
- 00-woop

### Module 1: Leadership (Sprints 01-12)
- 01-know-thyself through 12-market-size

### Module 2: Marketing & Sales (Sprints 13-21)
- 13-segmentation-target-market through 21-route-to-market

### Module 3: Operations (Sprints 22-27)
- 22-core-activities through 27-agile-teams

### Module 4: Digitalization (Sprints 28-30)
- 28-digitalization
- 29-digital-heart
- 30-program-overview

## Asset Naming

### Images
```
{descriptive-name}-{variant}.{ext}

Examples:
fasttrack-logo-white.png
tool-icon-woop.svg
background-gradient-dark.jpg
```

### Fonts
```
{FontFamily}-{Weight}.{ext}

Examples:
Plaak3Trial-43-Bold.otf
RiformaLL-Regular.otf
MonumentGrotesk-Mono.otf
```

## Consistency Checklist

When adding a new tool or feature:

- [ ] Tool slug matches pattern `XX-descriptive-slug`
- [ ] Schema name follows `sprint_XX_slug`
- [ ] HTML file named `XX-slug.html`
- [ ] Entry added to `tool-registry.json`
- [ ] Dependencies mapped in `dependencies.json`
- [ ] API endpoints follow `/api/tools/{slug}/*`
- [ ] Database tables use snake_case
- [ ] Frontend code uses camelCase
- [ ] Environment variables use UPPER_SNAKE_CASE
- [ ] Documentation updated

---

**Last Updated**: 2026-02-11
**Version**: 1.0
