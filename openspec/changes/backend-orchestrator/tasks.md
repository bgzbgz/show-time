# Implementation Tasks

## 1. Project Setup

- [x] 1.1 Create backend/ directory structure with src/, tests/, migrations/
- [x] 1.2 Initialize package.json with Node.js 18+ and Express dependencies
- [x] 1.3 Add dependencies: express, prisma, @prisma/client, zod, jsonwebtoken, puppeteer, handlebars
- [x] 1.4 Add dev dependencies: typescript, @types/node, @types/express, tsx, vitest
- [x] 1.5 Create tsconfig.json with strict mode enabled
- [x] 1.6 Create .env.example with all required environment variables
- [x] 1.7 Create Dockerfile for single container deployment
- [x] 1.8 Create docker-compose.yml for local development

## 2. Database Schema Creation

- [x] 2.1 Connect to Supabase via MCP and verify PostgreSQL access
- [x] 2.2 Create shared.users schema with users table (id, lms_user_id, email, full_name, organization_id, role, timestamps)
- [x] 2.3 Create shared.organizations schema with organizations table (id, name, slug, settings JSONB)
- [x] 2.4 Create shared.user_progress schema with progress tracking table
- [x] 2.5 Create 30 tool schemas following sprint_{XX}_{slug} naming pattern (Sprint 0-29)
- [x] 2.6 Create Sprint 30 schema (sprint_30_program_overview)
- [x] 2.7 Add submissions table to each tool schema (id, user_id, organization_id, data JSONB, status, version, timestamps)
- [x] 2.8 Add field_outputs table to each tool schema (id, submission_id, field_id, field_value JSONB, created_at)
- [x] 2.9 Create indexes on field_outputs(field_id), submissions(user_id, organization_id, status)
- [x] 2.10 Run Prisma introspection to generate Prisma schema from existing database schemas

## 3. Core Backend Structure

- [x] 3.1 Create src/index.ts with Express app initialization
- [x] 3.2 Set up Express middleware: cors, helmet, express.json, express.urlencoded
- [x] 3.3 Create src/config/database.ts for Prisma client initialization
- [x] 3.4 Create src/config/env.ts to load and validate environment variables using Zod
- [x] 3.5 Create src/middleware/errorHandler.ts for centralized error handling
- [x] 3.6 Create src/middleware/logger.ts for request logging
- [x] 3.7 Create src/utils/response.ts with helper functions for consistent API responses
- [x] 3.8 Create src/types/ directory with TypeScript type definitions

## 4. Authentication & Authorization

- [x] 4.1 Create src/middleware/auth.ts for JWT validation middleware
- [x] 4.2 Create src/services/AuthService.ts with LearnWorlds SSO validation logic
- [x] 4.3 Implement POST /api/auth/sso endpoint for LearnWorlds SSO callback
- [x] 4.4 Implement JWT token generation with user claims (id, email, role, organization_id)
- [x] 4.5 Implement refresh token generation and httpOnly cookie setting
- [x] 4.6 Implement POST /api/auth/refresh endpoint for token refresh
- [x] 4.7 Implement GET /api/auth/me endpoint to return current user details
- [x] 4.8 Implement POST /api/auth/logout endpoint
- [x] 4.9 Create src/middleware/authorize.ts for role-based access control (RBAC)
- [x] 4.10 Add RBAC checks for user, admin, and guru roles

## 5. Tool API Endpoints

- [x] 5.1 Create src/services/ToolService.ts with core tool data operations
- [x] 5.2 Load config/tool-registry.json and config/dependencies.json at startup
- [x] 5.3 Implement GET /api/tools endpoint to list all tools with user progress
- [x] 5.4 Implement GET /api/tools/:slug endpoint for tool metadata
- [x] 5.5 Implement GET /api/tools/:slug/data endpoint to retrieve user's submission
- [x] 5.6 Create Zod schemas for submission data validation in src/schemas/
- [x] 5.7 Implement POST /api/tools/:slug/data endpoint to save/update submission
- [x] 5.8 Implement POST /api/tools/:slug/submit endpoint to finalize tool submission
- [x] 5.9 Create src/middleware/toolExists.ts to validate tool slug parameter
- [x] 5.10 Create src/middleware/toolAccess.ts to check if user can access tool (unlocked)

## 6. Dependency Orchestration

- [x] 6.1 Create src/services/ToolOrchestrator.ts service
- [x] 6.2 Implement loadDependencyConfig() to parse config/dependencies.json
- [x] 6.3 Implement resolveDependencies(toolSlug, userId) to fetch required field values from source schemas
- [x] 6.4 Implement checkUnlockStatus(toolSlug, userId) to validate all prerequisites complete
- [x] 6.5 Implement updateProgress(userId, toolSlug, status) to record completion and trigger unlocks
- [x] 6.6 Create src/utils/dependencyGraph.ts to build and validate dependency DAG
- [x] 6.7 Implement circular dependency detection at startup
- [x] 6.8 Implement GET /api/tools/:slug/dependencies endpoint to expose dependency data
- [x] 6.9 Optimize bulk dependency queries using PostgreSQL IN clauses
- [x] 6.10 Add caching layer for frequently-accessed dependency metadata (in-memory Map)

## 7. Progress Tracking

- [x] 7.1 Create src/services/ProgressService.ts
- [x] 7.2 Implement initializeUserProgress(userId) to create 31 locked progress entries for new user
- [x] 7.3 Ensure Sprint 0 (WOOP) is unlocked by default on user creation
- [x] 7.4 Implement updateToolStatus(userId, toolSlug, status) with valid transition checks
- [x] 7.5 Implement unlockDependentTools(userId, completedToolSlug) to unlock tools that depend on completed tool
- [x] 7.6 Implement calculateProgressPercentage(submissionData, requiredFields) based on field completion
- [x] 7.7 Implement GET /api/user/progress endpoint for overall progress summary
- [x] 7.8 Add timestamp recording for unlocked_at, started_at, completed_at
- [x] 7.9 Implement getNextAvailableTool(userId) to suggest next tool to work on
- [x] 7.10 Add progress validation to prevent invalid status transitions (e.g., locked -> completed)

## 8. Field Storage

- [x] 8.1 Create src/services/FieldStorageService.ts
- [x] 8.2 Load output field definitions from config/dependencies.json
- [x] 8.3 Implement extractFieldOutputs(submissionData, toolSlug) to identify recognized field IDs
- [x] 8.4 Implement saveFieldOutputs(submissionId, schemaName, fieldMap) to insert/update field_outputs
- [x] 8.5 Implement getFieldValue(userId, fieldId) to query specific field across schemas
- [x] 8.6 Implement batchGetFields(userId, fieldIds[]) for efficient multi-field retrieval
- [x] 8.7 Add JSONB value validation for field_value column
- [x] 8.8 Implement field deletion when field removed from submission
- [x] 8.9 Add GET /api/data/:fieldId endpoint for direct field access
- [x] 8.10 Create database helper utilities for cross-schema queries

## 9. Data Export

- [x] 9.1 Create src/services/ExportService.ts
- [x] 9.2 Implement exportJSON(userId, toolSlug) to generate JSON export with submission and dependencies
- [x] 9.3 Create backend/src/templates/ directory for Handlebars templates
- [x] 9.4 Create default.hbs template for generic PDF export
- [x] 9.5 Create tool-specific templates for Sprint 0-5 as examples
- [x] 9.6 Implement renderTemplate(toolSlug, submissionData, dependencies) using Handlebars
- [x] 9.7 Implement generatePDF(html) using Puppeteer with headless Chrome
- [x] 9.8 Implement GET /api/tools/:slug/export endpoint with format query parameter (json/pdf)
- [x] 9.9 Add export rate limiting middleware (10 requests per hour per user)
- [x] 9.10 Implement async PDF generation for large submissions (202 Accepted with job_id)
- [x] 9.11 Create export filename generator following {slug}_{username}_{date} pattern
- [x] 9.12 Add Content-Disposition headers for file downloads

## 10. AI Integration

- [x] 10.1 Create src/services/AIService.ts for n8n integration
- [x] 10.2 Implement sendHelpRequest(userId, toolSlug, question, context) to forward to n8n webhook
- [x] 10.3 Add N8N_WEBHOOK_URL to environment configuration
- [x] 10.4 Implement POST /api/ai/help endpoint with request body (tool_slug, question)
- [x] 10.5 Include submission data and dependencies in AI request payload
- [x] 10.6 Add 30-second timeout for n8n webhook responses
- [x] 10.7 Validate n8n response structure (answer field required)
- [x] 10.8 Sanitize AI response markdown to prevent XSS
- [x] 10.9 Implement AI request rate limiting (10 per hour for users, 50 for admin/guru)
- [x] 10.10 Add AI request/response logging for monitoring
- [x] 10.11 Implement graceful fallback when n8n unavailable (503 with helpful message)

## 11. Testing

- [x] 11.1 Set up Vitest testing framework in backend/tests/
- [x] 11.2 Create test database configuration for isolated test runs
- [x] 11.3 Write unit tests for AuthService (SSO validation, JWT generation)
- [x] 11.4 Write unit tests for ToolOrchestrator (dependency resolution, unlock logic)
- [x] 11.5 Write unit tests for ProgressService (status transitions, progress calculation)
- [x] 11.6 Write unit tests for FieldStorageService (field extraction, JSONB queries)
- [x] 11.7 Write integration tests for tool API endpoints (CRUD operations)
- [x] 11.8 Write integration tests for authentication flow (SSO -> JWT -> protected endpoint)
- [x] 11.9 Write integration tests for cross-tool dependencies (Sprint 1 -> Sprint 2)
- [x] 11.10 Write tests for export functionality (JSON and PDF generation)
- [x] 11.11 Add test coverage reporting with minimum 70% coverage threshold

## 12. Documentation

- [x] 12.1 Create backend/README.md with setup instructions
- [x] 12.2 Document all environment variables in .env.example with descriptions
- [x] 12.3 Create API documentation using OpenAPI/Swagger spec
- [x] 12.4 Document database schema structure and relationships
- [x] 12.5 Document field ID naming conventions from sprint-connections-updated.md
- [x] 12.6 Create developer guide for adding new tools
- [x] 12.7 Document Handlebars template system for PDF exports
- [x] 12.8 Create troubleshooting guide for common issues

## 13. Deployment

- [x] 13.1 Test Docker build locally (docker build -t fast-track-backend .)
- [x] 13.2 Test docker-compose up with PostgreSQL and backend services
- [x] 13.3 Create Railway project and configure environment variables
- [x] 13.4 Connect Railway to GitHub repository for auto-deployment
- [x] 13.5 Configure Supabase connection pooling for production
- [x] 13.6 Set up Railway Redis instance for rate limiting and caching
- [x] 13.7 Configure CORS origins for production frontend URLs
- [x] 13.8 Enable HTTPS and configure SSL certificates
- [x] 13.9 Set up monitoring and logging (Railway logs, Sentry for errors)
- [x] 13.10 Deploy to Railway staging environment and run smoke tests
- [x] 13.11 Create deployment runbook with rollback procedures
- [x] 13.12 Deploy to Railway production environment

## 14. Integration & Verification

- [x] 14.1 Test LearnWorlds SSO integration end-to-end
- [x] 14.2 Verify all 30 tool schemas exist in Supabase
- [x] 14.3 Test Sprint 0 -> Sprint 1 dependency flow with real data
- [x] 14.4 Test Sprint 30 unlock with all 29 prerequisites complete
- [x] 14.5 Test PDF export with custom template for one tool
- [x] 14.6 Test n8n AI integration with sample questions
- [x] 14.7 Verify rate limiting works across endpoints
- [x] 14.8 Test role-based access (user, admin, guru) on protected endpoints
- [x] 14.9 Load test with 100 concurrent users using k6 or Artillery
- [x] 14.10 Verify frontend HTML tools can successfully connect to backend APIs
