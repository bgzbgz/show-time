## Why

Fast Track participants need a centralized dashboard to navigate their transformation journey across 30 tools organized in 5 modules. Currently, there is no landing page that provides progress visibility, module organization, and unified access to tools while maintaining the Fast Track brand identity and "No grit. No growth." philosophy.

## What Changes

- **NEW**: Create `frontend/dashboard.html` as the primary landing page for authenticated Fast Track participants
- **NEW**: Implement modular tool organization (Foundation, Leadership, Marketing & Sales, Operations, Digitalization)
- **NEW**: User authentication flow via JWT tokens from LearnWorlds LMS
- **NEW**: Real-time progress tracking across 30 tools with visual indicators (locked/unlocked/in-progress/completed)
- **NEW**: Tool launching interface that opens individual tool HTML files with user context
- **NEW**: Summary viewing for completed tools via modal interface
- **NEW**: API integration with backend at `http://localhost:3000` for tools, user data, and progress
- **NEW**: Brand-compliant styling using Fast Track typography (Plaak, Riforma, Monument Grotesk), colors (black/white/grey/yellow), and logo assets

## Capabilities

### New Capabilities
- `dashboard-ui`: Dashboard interface with header, hero section, module sections, tool cards, and footer following Fast Track Brand Guidelines
- `user-authentication`: JWT-based authentication flow accepting tokens from URL parameters, storing in localStorage, and handling redirects to LearnWorlds
- `tool-progress-tracking`: Progress tracking system showing overall completion, module completion, and individual tool status with visual unlock animations
- `tool-launching`: Tool launching mechanism that opens individual tool files with proper context passing
- `tool-summary-viewing`: Summary viewing interface displaying completed tool data in formatted modal views
- `api-integration`: Backend API integration for fetching tools, user progress, and tool data

### Modified Capabilities
<!-- No existing capabilities are being modified - this is a new dashboard -->

## Impact

**New Files**:
- `frontend/dashboard.html` (main dashboard, single HTML file with React + Tailwind)

**Dependencies**:
- React 18 (CDN)
- Tailwind CSS (CDN)
- Backend API endpoints: `/api/tools`, `/api/user/progress`, `/api/auth/me`, `/api/tools/{slug}/data`
- Existing tool files: `frontend/tools/{sprint-number}-{slug}.html`
- Configuration: `config/tool-registry.json`

**Assets**:
- Logo: `designs for tools and landing page/02. logos/FastTrack_F_White.png`
- Favicon: `designs for tools and landing page/01. favicon/favicon-16x16.png`
- Fonts: `designs for tools and landing page/03. Fonts/woff2/` (Plaak, Riforma, Monument Grotesk)

**Backend APIs** (assumed existing):
- Must support GET `/api/tools` with user progress data
- Must support GET `/api/user/progress` for overall stats
- Must support GET `/api/auth/me` for user info
- Must support GET `/api/tools/{slug}/data` for completed tool summaries

**User Flow**:
- Entry point for all authenticated Fast Track participants
- Gateway to all 30 individual tools
- Central location for progress tracking and motivation
