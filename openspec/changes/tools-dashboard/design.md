## Context

Fast Track participants complete a 30-tool transformation program organized into 5 modules across 30 sprints. Currently, individual tool HTML files exist (`frontend/tools/*.html`) but there's no central dashboard to navigate the journey, track progress, or understand dependencies between tools.

**Current State**:
- 30 individual tool files in `frontend/tools/` (e.g., `00-woop.html`)
- Backend API at `http://localhost:3000` (assumed operational)
- LearnWorlds LMS handles user authentication and course enrollment
- Tool registry exists at `config/tool-registry.json`

**Constraints**:
- Must follow Fast Track Brand Guidelines strictly (specific fonts, colors, typography hierarchy)
- Single HTML file architecture (no build step) to match existing tool pattern
- Must integrate with existing backend API and tool files
- JWT-based authentication from LearnWorlds

**Stakeholders**:
- Fast Track participants (end users navigating their journey)
- Fast Track admins/coaches (monitoring progress)
- Existing backend API (data provider)

## Goals / Non-Goals

**Goals**:
- Create a single-page dashboard that serves as the landing page for all authenticated Fast Track participants
- Provide clear visual hierarchy of 5 modules and 30 tools with progress indicators
- Implement seamless authentication flow from LearnWorlds to dashboard to individual tools
- Enable real-time progress tracking with visual feedback (locked → unlocked → in-progress → completed)
- Establish reusable patterns for brand-compliant UI that other tools can follow
- Maintain consistency with existing tool architecture (single HTML, React CDN, no build step)

**Non-Goals**:
- Building a new backend API (assume existing endpoints work)
- Modifying LearnWorlds LMS integration (accept JWT tokens as-is)
- Creating a progressive web app or offline-first experience
- Implementing user-to-user social features or commenting
- Building admin/coach management interfaces (separate concern)
- Responsive mobile optimization in Phase 1 (desktop-first)

## Decisions

### D1: Single HTML File Architecture

**Decision**: Build `frontend/dashboard.html` as a self-contained HTML file with inline React components and Tailwind CDN.

**Rationale**:
- Consistency with existing tool pattern (e.g., `00-woop.html`)
- Zero build step = simpler deployment and maintenance
- All dependencies loaded via CDN (React 18, Tailwind CSS)
- Easier for non-technical stakeholders to view source and understand structure

**Alternatives Considered**:
- ❌ Vite/Webpack SPA: Adds build complexity, breaks pattern consistency
- ❌ Server-side rendering: Requires Node.js runtime, overkill for static content

### D2: Component Structure

**Decision**: Organize React components as inline JSX within a single `<script type="text/babel">` block.

**Component Hierarchy**:
```
<Dashboard>
  ├── <Header>
  │   ├── <Logo>
  │   ├── <UserInfo>
  │   └── <ProgressBar>
  ├── <Hero>
  │   ├── <Headline>
  │   └── <ProgressSummary>
  ├── <ModuleGrid>
  │   └── <Module> (x5, collapsible)
  │       └── <ToolCard> (x30 total)
  │           ├── <StatusBadge>
  │           ├── <ProgressBar>
  │           ├── <LaunchButton>
  │           └── <ViewSummaryButton>
  └── <Footer>
```

**Rationale**: Clear separation of concerns while keeping everything in one file for easy debugging.

### D3: State Management

**Decision**: Use React's built-in `useState` and `useEffect` hooks, no external state library.

**State Structure**:
```javascript
{
  user: { name, email, avatar, token },
  tools: [
    { id, sprint, name, slug, module, status, progress, dependencies, data }
  ],
  overallProgress: { completed, total, percentage },
  loading: { tools: boolean, user: boolean },
  error: { message: string | null }
}
```

**Rationale**:
- Single component tree, no prop drilling issues
- 30 tools = manageable data size, no performance concerns
- Avoid external dependencies (Redux, Zustand) for simplicity

**Alternatives Considered**:
- ❌ Redux: Overkill for simple read-heavy dashboard
- ❌ Context API: Unnecessary indirection for single-component state

### D4: API Integration Pattern

**Decision**: Centralized API client with Bearer token authentication via `localStorage`.

**API Client Structure**:
```javascript
const api = {
  baseURL: 'http://localhost:3000',

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('ft_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    // fetch with error handling
  },

  getTools: () => api.request('/api/tools'),
  getUserProgress: () => api.request('/api/user/progress'),
  getUserInfo: () => api.request('/api/auth/me'),
  getToolData: (slug) => api.request(`/api/tools/${slug}/data`)
};
```

**Rationale**:
- Single source of truth for authentication token
- Consistent error handling across all API calls
- Easy to add retry logic or caching later

**Alternatives Considered**:
- ❌ Fetch calls inline in components: Duplicates token logic
- ❌ Axios library: Unnecessary dependency for simple REST calls

### D5: Authentication Flow

**Decision**: URL parameter → localStorage → API header chain.

**Flow**:
1. User lands on `dashboard.html?token=<jwt>`
2. Extract token from URL parameter on mount
3. Store in `localStorage.setItem('ft_token', token)`
4. Remove token from URL (history.replaceState)
5. Validate token via `/api/auth/me`
6. If invalid/missing, redirect to LearnWorlds login page

**Rationale**:
- LearnWorlds can generate deep links with tokens
- Token persists across page reloads
- Clean URLs after initial authentication
- Graceful degradation to login if token expires

**Security Considerations**:
- Token exposed in URL briefly (acceptable for internal LMS integration)
- HTTPS required in production
- Token expiry handled by backend (redirect to LearnWorlds)

### D6: Brand Asset Loading

**Decision**: Load custom fonts via `@font-face` with local `.woff2` files, embed logo as base64 data URI.

**Font Loading**:
```css
@font-face {
  font-family: 'Plaak';
  src: url('../designs for tools and landing page/03. Fonts/woff2/Plaak3Trial-43-Bold.woff2') format('woff2');
  font-display: swap; /* Prevent FOIT */
}
```

**Logo Embedding**:
- Convert `FastTrack_F_White.png` to base64 data URI
- Embed directly in HTML to avoid external requests
- Reduces HTTP requests, ensures logo always loads

**Rationale**:
- Fonts are core to brand identity, must load reliably
- `font-display: swap` prevents invisible text during load
- Base64 logo = one less dependency, faster perceived load

**Alternatives Considered**:
- ❌ Google Fonts: Custom fonts not available
- ❌ External logo URL: Adds HTTP request, potential failure point

### D7: Tool Status & Progress Logic

**Decision**: Backend returns status (`locked`, `unlocked`, `in_progress`, `completed`) and progress (0-100%). Frontend is read-only display.

**Status Rendering**:
- **LOCKED**: Grey text, disabled button, no interaction
- **UNLOCKED**: White text, clickable "LAUNCH" button
- **IN PROGRESS**: Yellow border + text, clickable "LAUNCH", progress bar visible
- **COMPLETED**: Checkmark icon, "VIEW SUMMARY" button appears, progress bar 100%

**Dependency Unlocking**:
- Backend determines when tools unlock based on completion of dependencies
- Frontend polls `/api/tools` every 30 seconds when user active
- Visual "unlock animation" (fade-in, yellow pulse) when status changes

**Rationale**:
- Single source of truth (backend) prevents sync issues
- Polling = simple, no WebSocket infrastructure needed
- 30-second interval = reasonable freshness without excessive requests

### D8: Tool Launching Mechanism

**Decision**: Open individual tool HTML files in same tab with token + context in URL.

**Launch Flow**:
```javascript
function launchTool(tool) {
  const token = localStorage.getItem('ft_token');
  const url = `/frontend/tools/${tool.sprint}-${tool.slug}.html?token=${token}`;
  window.location.href = url; // Same tab navigation
}
```

**Rationale**:
- Simplest UX (same tab, no popup blockers)
- Token passed to tool for API access
- Back button returns to dashboard naturally
- Individual tools can access dashboard via `document.referrer`

**Alternatives Considered**:
- ❌ New tab: Fragments user experience, loses context
- ❌ Modal/iframe: Breaks tool isolation, complex state management

### D9: Module Organization & Collapsibility

**Decision**: Render 5 modules as collapsible sections, default to all expanded on first visit, persist state in `localStorage`.

**Module Definitions**:
```javascript
const MODULES = [
  { id: 0, name: 'Foundation', sprints: [0] },
  { id: 1, name: 'Leadership', sprints: [1,2,3,4,5,6,7,8,9,10,11] },
  { id: 2, name: 'Marketing & Sales', sprints: [12,13,14,15,16,17,18,19,20,21] },
  { id: 3, name: 'Operations', sprints: [22,23,24,25,26,27] },
  { id: 4, name: 'Digitalization', sprints: [28,29] }
];
```

**Collapse State**:
- Store in `localStorage.setItem('collapsed_modules', JSON.stringify([1, 3]))`
- Allows users to focus on current module
- Reduces visual overwhelm for 30-tool grid

**Rationale**:
- Long journey = need to focus attention
- Persist preference across sessions for convenience
- All expanded by default = full visibility for new users

### D10: Summary Viewing

**Decision**: Modal overlay with tool summary data fetched on-demand.

**Flow**:
1. User clicks "VIEW SUMMARY" on completed tool
2. Fetch `/api/tools/{slug}/data` (if not cached)
3. Render modal with tool output (formatted JSON or HTML)
4. Close modal returns to dashboard (no navigation)

**Rationale**:
- Lightweight review without leaving dashboard
- On-demand loading = faster initial dashboard load
- Cache in component state to avoid re-fetching

## Risks / Trade-offs

### R1: Single HTML File Size
**Risk**: Large HTML file (fonts, components, Tailwind) may slow initial load.
**Mitigation**:
- Use Tailwind CDN's JIT mode with minimal classes
- Lazy-load font files with `font-display: swap`
- Base64 logo is small (~5KB)
- Target: <200KB total HTML file size

### R2: No Build Step = No TypeScript
**Risk**: No compile-time type checking, potential runtime errors.
**Mitigation**:
- Add JSDoc type comments for critical functions
- Thorough manual testing across status states
- Consider separate TypeScript build as future enhancement

### R3: Polling for Progress Updates
**Risk**: 30-second polling = delayed unlock notifications.
**Mitigation**:
- Show timestamp "Last updated X seconds ago"
- Add manual refresh button for impatient users
- Future: WebSocket for real-time updates if needed

### R4: Token in URL Parameter
**Risk**: Token briefly visible in browser history.
**Mitigation**:
- Clear token from URL immediately after extraction
- Require HTTPS in production
- Token expiry handled by backend (short-lived JWTs)
- Acceptable risk for internal LMS integration

### R5: Dependency on Backend API
**Risk**: Dashboard unusable if backend is down.
**Mitigation**:
- Show clear error message with backend status
- Graceful degradation: show cached tool list if available
- Health check endpoint: `/api/health` (optional)

### R6: Brand Asset Loading Failures
**Risk**: Custom fonts fail to load, breaking brand identity.
**Mitigation**:
- System font fallbacks in CSS: `font-family: 'Plaak', Arial, sans-serif`
- `font-display: swap` ensures text always visible
- Base64 logo embedded = no external dependency

### R7: Tool Registry Sync
**Risk**: `config/tool-registry.json` gets out of sync with backend.
**Mitigation**:
- Backend is source of truth (not the config file)
- Dashboard only reads from `/api/tools` endpoint
- Config file used for backend initialization only

## Migration Plan

### Phase 1: Initial Deployment
1. Create `frontend/dashboard.html` with full component implementation
2. Deploy to existing frontend hosting (same domain as tools)
3. Update LearnWorlds course link to point to `dashboard.html?token={jwt}`
4. Verify backend endpoints return expected data structure

### Phase 2: User Testing
1. Test with 3-5 Fast Track participants across different progress states
2. Validate authentication flow from LearnWorlds
3. Test tool launching and back navigation
4. Verify progress updates and unlock animations

### Phase 3: Rollout
1. Update all LearnWorlds course modules to use dashboard as entry point
2. Communicate new dashboard to existing participants
3. Monitor API logs for errors or unexpected usage patterns

### Rollback Strategy
- Keep direct links to individual tools functional (tools work standalone)
- Dashboard is additive, not replacing existing tool access
- If critical issues, revert LearnWorlds links to direct tool URLs

## Open Questions

1. **Backend API Contract**: Do the assumed endpoints (`/api/tools`, `/api/user/progress`, etc.) exist with the expected response structure? Need API documentation or OpenAPI spec.

2. **Tool Data Format**: What format does `/api/tools/{slug}/data` return for completed tools? JSON? HTML? Pre-formatted text? Affects summary modal rendering.

3. **Progress Calculation**: Is `progress` percentage calculated backend-side or should dashboard calculate it from tool completion events?

4. **Module Completion Badges**: Should modules show completion badges (e.g., "11/11 COMPLETE")? Not specified in requirements.

5. **Error Handling UX**: What should happen if token expires mid-session? Silent redirect? Modal warning?

6. **Accessibility**: WCAG 2.1 compliance level? Keyboard navigation requirements? Screen reader testing needed?

7. **Analytics**: Should dashboard track user interactions (tool launches, time on page)? If yes, which analytics platform?

8. **Caching Strategy**: Should tool list be cached in `localStorage` for offline viewing? Or always fresh from API?
