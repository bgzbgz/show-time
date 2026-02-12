# Database Schema Design

## Schema Organization

Each Fast Track tool operates in its own PostgreSQL schema, providing data isolation and independent evolution.

## Schema Naming Convention

```
sprint_{sprint_number}_{tool_slug}
```

Examples:
- `sprint_00_woop`
- `sprint_15_value_proposition`
- `sprint_24_fit_abc_analysis`

## Common Table Pattern

Each tool schema follows a similar structure:

```sql
-- User's tool data (main table)
{schema_name}.tool_data
  - id: UUID PRIMARY KEY
  - user_id: UUID FOREIGN KEY → users.id
  - organization_id: UUID FOREIGN KEY → organizations.id
  - data: JSONB (flexible tool-specific data)
  - status: ENUM (draft, in_progress, completed, submitted)
  - version: INTEGER
  - created_at: TIMESTAMP
  - updated_at: TIMESTAMP
  - submitted_at: TIMESTAMP
  - completed_at: TIMESTAMP

-- Tool-specific normalized tables (optional)
{schema_name}.specific_entities
  - Custom tables for complex tool data

-- Audit trail
{schema_name}.audit_log
  - id: UUID PRIMARY KEY
  - tool_data_id: UUID
  - user_id: UUID
  - action: VARCHAR
  - changes: JSONB
  - timestamp: TIMESTAMP
```

## Shared Schemas

### users
```sql
CREATE SCHEMA users;

CREATE TABLE users.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  organization_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

CREATE TABLE users.profiles (
  user_id UUID PRIMARY KEY REFERENCES users.accounts(id),
  avatar_url TEXT,
  timezone VARCHAR(50),
  language VARCHAR(10) DEFAULT 'en',
  preferences JSONB DEFAULT '{}'::jsonb
);
```

### organizations
```sql
CREATE SCHEMA organizations;

CREATE TABLE organizations.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  industry VARCHAR(100),
  size VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE organizations.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations.companies(id),
  name VARCHAR(255),
  lead_user_id UUID REFERENCES users.accounts(id),
  members JSONB -- Array of user IDs
);
```

### tool_access
```sql
CREATE SCHEMA tool_access;

CREATE TABLE tool_access.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users.accounts(id),
  tool_slug VARCHAR(100),
  access_level VARCHAR(50), -- view, edit, admin
  granted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  granted_by UUID REFERENCES users.accounts(id)
);

CREATE TABLE tool_access.progress (
  user_id UUID REFERENCES users.accounts(id),
  tool_slug VARCHAR(100),
  status VARCHAR(50), -- not_started, in_progress, completed
  progress_percentage INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP,
  completed_at TIMESTAMP,
  PRIMARY KEY (user_id, tool_slug)
);
```

### audit_log (global)
```sql
CREATE SCHEMA audit;

CREATE TABLE audit.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users.accounts(id),
  organization_id UUID,
  tool_slug VARCHAR(100),
  action VARCHAR(100),
  entity_type VARCHAR(100),
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit.events(user_id, timestamp DESC);
CREATE INDEX idx_audit_org ON audit.events(organization_id, timestamp DESC);
CREATE INDEX idx_audit_tool ON audit.events(tool_slug, timestamp DESC);
```

## Example Tool Schemas

### Sprint 00: WOOP
```sql
CREATE SCHEMA sprint_00_woop;

CREATE TABLE sprint_00_woop.tool_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users.accounts(id),
  organization_id UUID REFERENCES organizations.companies(id),
  wish TEXT,
  outcome TEXT,
  obstacle TEXT,
  plan TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Sprint 15: Value Proposition
```sql
CREATE SCHEMA sprint_15_value_proposition;

CREATE TABLE sprint_15_value_proposition.tool_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users.accounts(id),
  organization_id UUID REFERENCES organizations.companies(id),
  data JSONB NOT NULL, -- Contains all VP canvas fields
  status VARCHAR(50) DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sprint_15_value_proposition.hypotheses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_data_id UUID REFERENCES sprint_15_value_proposition.tool_data(id),
  hypothesis_text TEXT NOT NULL,
  category VARCHAR(50), -- gain, pain, jobs
  priority INTEGER,
  tested BOOLEAN DEFAULT FALSE,
  test_results JSONB
);
```

### Sprint 24: FIT & ABC Analysis
```sql
CREATE SCHEMA sprint_24_fit_abc_analysis;

CREATE TABLE sprint_24_fit_abc_analysis.tool_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users.accounts(id),
  organization_id UUID REFERENCES organizations.companies(id),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sprint_24_fit_abc_analysis.team_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_data_id UUID REFERENCES sprint_24_fit_abc_analysis.tool_data(id),
  team_member_name VARCHAR(255),
  role VARCHAR(255),
  fit_energy INTEGER, -- 1-10
  fit_skill INTEGER,
  fit_values INTEGER,
  fit_impact INTEGER,
  abc_rating CHAR(1), -- A, B, or C
  notes TEXT,
  action_items JSONB
);
```

## Data Dependencies

Tools can reference data from other tools via foreign keys or API-level joins:

```sql
-- Example: Dream tool references Know Thyself
CREATE TABLE sprint_02_dream.tool_data (
  id UUID PRIMARY KEY,
  user_id UUID,
  -- Reference to source tool
  source_know_thyself_id UUID,
  -- Tool-specific data
  company_dream TEXT,
  personal_alignment JSONB
);

-- Enforced at application level, not FK constraint
-- to maintain schema isolation
```

## Indexing Strategy

### Standard Indexes (all tool_data tables)
```sql
CREATE INDEX idx_{schema}_user ON {schema}.tool_data(user_id);
CREATE INDEX idx_{schema}_org ON {schema}.tool_data(organization_id);
CREATE INDEX idx_{schema}_status ON {schema}.tool_data(status);
CREATE INDEX idx_{schema}_updated ON {schema}.tool_data(updated_at DESC);
```

### JSONB Indexes
```sql
-- For tools using JSONB data column
CREATE INDEX idx_{schema}_data_gin ON {schema}.tool_data USING GIN(data);

-- Specific JSON paths can be indexed
CREATE INDEX idx_{schema}_specific_field
ON {schema}.tool_data ((data->>'specific_field'));
```

## Migration Strategy

### Version Control
All schema changes tracked in migration files:
```
migrations/
  001_create_shared_schemas.sql
  002_create_sprint_00_woop.sql
  003_create_sprint_01_know_thyself.sql
  ...
  031_create_sprint_29_digital_heart.sql
```

### Rollback Safety
- Each migration has up/down scripts
- Test migrations on staging first
- Automated backups before migrations
- Gradual rollout for schema changes

## Performance Considerations

### Connection Pooling
- Set `search_path` per connection for schema
- Pool size tuned per tool usage patterns
- Separate pool for admin operations

### Query Optimization
- Use `EXPLAIN ANALYZE` for complex queries
- Materialized views for reporting
- Partial indexes for filtered queries

### Data Archival
- Archive completed tool_data after 2 years
- Keep audit logs for 7 years (compliance)
- Compress archived data

## Security

### Row-Level Security
```sql
ALTER TABLE sprint_00_woop.tool_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_access ON sprint_00_woop.tool_data
  FOR ALL
  USING (user_id = current_setting('app.user_id')::UUID);

CREATE POLICY org_admin_access ON sprint_00_woop.tool_data
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM users.accounts
      WHERE id = current_setting('app.user_id')::UUID
      AND role = 'admin'
    )
  );
```

### Encryption
- Sensitive fields encrypted at application level
- Database-level encryption for backups
- TLS for all connections

## Backup & Recovery

### Backup Schedule
- Full backup: Daily (retain 30 days)
- Incremental backup: Hourly (retain 7 days)
- Transaction logs: Continuous archival

### Recovery Testing
- Monthly restore drills
- Recovery time objective (RTO): 4 hours
- Recovery point objective (RPO): 1 hour

---

**Last Updated**: 2026-02-11
**Version**: 1.0
