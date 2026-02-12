## 1. Setup & Project Structure

- [x] 1.1 Create `frontend/dashboard.html` file in project root
- [x] 1.2 Add HTML5 boilerplate with viewport meta tag for responsive behavior
- [x] 1.3 Include React 18 CDN script tags (react.development.js, react-dom.development.js)
- [x] 1.4 Include Babel standalone for JSX transformation
- [x] 1.5 Include Tailwind CSS CDN with JIT mode configuration
- [x] 1.6 Set up basic HTML structure with root div for React mounting

## 2. Brand Assets & Fonts

- [x] 2.1 Convert `designs for tools and landing page/02. logos/FastTrack_F_White.png` to base64 data URI
- [x] 2.2 Embed base64 logo in HTML for immediate availability
- [x] 2.3 Add @font-face declarations for Plaak3Trial-43-Bold.woff2
- [x] 2.4 Add @font-face declarations for RiformaLL-Regular.woff2
- [x] 2.5 Add @font-face declarations for MonumentGrotesk-Mono.woff2
- [x] 2.6 Set font-display: swap for all custom fonts to prevent FOIT
- [x] 2.7 Define system font fallbacks (Arial, sans-serif) in CSS
- [x] 2.8 Add favicon link tag pointing to `designs for tools and landing page/01. favicon/favicon-16x16.png`

## 3. CSS Tokens & Base Styles

- [x] 3.1 Define CSS custom properties for Fast Track color palette (--color-black, --color-white, --color-grey, --color-yellow)
- [x] 3.2 Define CSS custom properties for typography (--font-plaak, --font-riforma, --font-monument)
- [x] 3.3 Create CSS reset/normalize styles
- [x] 3.4 Set body background to black (#000000)
- [x] 3.5 Define typography hierarchy styles (h1-h6, p, labels)
- [x] 3.6 Create utility classes for brand-compliant spacing and alignment
- [x] 3.7 Style scrollbar to match brand (black/yellow accent)

## 4. Authentication System

- [x] 4.1 Implement token extraction from URL parameter on page load
- [x] 4.2 Store extracted token in localStorage with key 'ft_token'
- [x] 4.3 Remove token from URL using history.replaceState after extraction
- [x] 4.4 Check localStorage for existing token if URL parameter not present
- [x] 4.5 Implement redirect to LearnWorlds login if no token found
- [x] 4.6 Create validateToken function that calls /api/auth/me endpoint
- [x] 4.7 Handle 401 responses by clearing localStorage and redirecting to login
- [x] 4.8 Display authentication error messages before redirect
- [x] 4.9 Implement token persistence across page reloads
- [x] 4.10 Add HTTPS enforcement check for production environment

## 5. API Client Implementation

- [x] 5.1 Create centralized API client object with baseURL configuration
- [x] 5.2 Implement api.request() method with token injection from localStorage
- [x] 5.3 Add Authorization header (Bearer token) to all requests
- [x] 5.4 Implement api.getTools() method for GET /api/tools
- [x] 5.5 Implement api.getUserProgress() method for GET /api/user/progress
- [x] 5.6 Implement api.getUserInfo() method for GET /api/auth/me
- [x] 5.7 Implement api.getToolData(slug) method for GET /api/tools/{slug}/data
- [x] 5.8 Add error handling for network errors with retry logic
- [x] 5.9 Add error handling for 401 (authentication) errors
- [x] 5.10 Add error handling for 404 (not found) errors
- [x] 5.11 Add error handling for 500 (server) errors
- [x] 5.12 Implement request timeout handling (30 second timeout)
- [x] 5.13 Add exponential backoff retry logic (1s, 2s, 4s delays)
- [x] 5.14 Implement request cancellation on component unmount
- [x] 5.15 Add response validation to check expected fields exist

## 6. React Component Structure

- [x] 6.1 Create main Dashboard component as root component
- [x] 6.2 Set up component state with useState for tools, user, progress, loading, error
- [x] 6.3 Implement useEffect hook for initial data fetch on mount
- [x] 6.4 Create Header component with logo, user info, and progress bar
- [x] 6.5 Create Hero component with headline and progress summary
- [x] 6.6 Create ModuleGrid component to organize 5 modules
- [x] 6.7 Create Module component with collapsible functionality
- [x] 6.8 Create ToolCard component with status, progress, buttons
- [x] 6.9 Create Footer component with tagline and copyright
- [x] 6.10 Create StatusBadge component for tool status display
- [x] 6.11 Create ProgressBar component for percentage visualization
- [x] 6.12 Create LaunchButton component with disabled state handling
- [x] 6.13 Create ViewSummaryButton component with conditional rendering

## 7. Header Component Implementation

- [x] 7.1 Render black background container for header
- [x] 7.2 Display Fast Track F logo (base64) on left side with strong left alignment
- [x] 7.3 Fetch and display user name on right side
- [x] 7.4 Display user avatar (or initials fallback) on right side
- [x] 7.5 Implement overall progress bar with yellow accent fill
- [x] 7.6 Calculate overall progress percentage (completed/30 tools)
- [x] 7.7 Style header with appropriate padding and spacing
- [x] 7.8 Make header sticky at top during scroll (optional)

## 8. Hero Section Implementation

- [x] 8.1 Create hero section container with appropriate spacing
- [x] 8.2 Display headline "YOUR TRANSFORMATION JOURNEY" in Plaak uppercase
- [x] 8.3 Display progress summary text "X of 30 tools complete" in Riforma
- [x] 8.4 Calculate completed tools count from tools array
- [x] 8.5 Implement current sprint indicator showing active sprint number
- [x] 8.6 Determine current sprint from first in-progress tool or next unlocked
- [x] 8.7 Style hero with strong left alignment per brand guidelines
- [x] 8.8 Add appropriate vertical spacing between hero elements

## 9. Module Grid Implementation

- [x] 9.1 Define MODULES constant array with 5 module definitions (id, name, sprint ranges)
- [x] 9.2 Render ModuleGrid container with appropriate layout
- [x] 9.3 Map through MODULES array to render Module components
- [x] 9.4 Pass filtered tools to each Module based on sprint ranges
- [x] 9.5 Implement module expansion/collapse state in component state
- [x] 9.6 Store collapse state in localStorage with key 'collapsed_modules'
- [x] 9.7 Load collapse state from localStorage on mount (default all expanded)
- [x] 9.8 Style module grid with appropriate spacing between modules

## 10. Module Component Implementation

- [x] 10.1 Create collapsible module header with click handler
- [x] 10.2 Display module name (e.g., "Leadership") in Plaak bold
- [x] 10.3 Display module sprint range (e.g., "Sprints 1-11") in Monument Grotesk
- [x] 10.4 Calculate and display module completion count (e.g., "3/11 complete")
- [x] 10.5 Render module completion progress bar
- [x] 10.6 Implement expand/collapse icon or indicator
- [x] 10.7 Toggle module visibility on header click
- [x] 10.8 Update localStorage when module is collapsed/expanded
- [x] 10.9 Style module with black background and white/yellow accents
- [x] 10.10 Add completion badge when all module tools completed

## 11. Tool Card Component Implementation

- [x] 11.1 Create white card container on dark grey background
- [x] 11.2 Display sprint number in Monument Grotesk Mono (small, uppercase)
- [x] 11.3 Display tool name in Plaak bold
- [x] 11.4 Render StatusBadge component with tool status
- [x] 11.5 Conditionally render ProgressBar for in-progress tools
- [x] 11.6 Render LaunchButton with appropriate enabled/disabled state
- [x] 11.7 Conditionally render ViewSummaryButton for completed tools
- [x] 11.8 Apply yellow border for in-progress tools
- [x] 11.9 Apply grey styling for locked tools
- [x] 11.10 Style card with appropriate padding, border-radius, shadow

## 12. Tool Status Display Implementation

- [x] 12.1 Implement status badge rendering based on tool.status value
- [x] 12.2 Display "LOCKED" in grey text (#B2B2B2) for locked tools
- [x] 12.3 Display "UNLOCKED" in white text (#FFFFFF) for unlocked tools
- [x] 12.4 Display "IN PROGRESS" in yellow text (#FFF469) for in-progress tools
- [x] 12.5 Display checkmark icon or "DONE" text for completed tools
- [x] 12.6 Style status badges with Monument Grotesk Mono font
- [x] 12.7 Add appropriate sizing and spacing for status badges

## 13. Progress Bar Implementation

- [x] 13.1 Create horizontal progress bar container with grey background
- [x] 13.2 Render filled portion with yellow accent color (#FFF469)
- [x] 13.3 Calculate fill width based on progress percentage (0-100)
- [x] 13.4 Display percentage text adjacent to or within progress bar
- [x] 13.5 Animate progress bar fill on updates (smooth transition)
- [x] 13.6 Handle edge cases (0%, 100%, undefined progress)
- [x] 13.7 Style progress bar with appropriate height and border-radius

## 14. Tool Launching Implementation

- [x] 14.1 Implement launchTool function that accepts tool object
- [x] 14.2 Construct tool URL using format `/frontend/tools/{sprint}-{slug}.html`
- [x] 14.3 Zero-pad sprint numbers (e.g., "00", "01", "15")
- [x] 14.4 Retrieve token from localStorage for URL parameter
- [x] 14.5 Append token to tool URL as query parameter `?token=<jwt>`
- [x] 14.6 Navigate to tool using `window.location.href` (same tab)
- [x] 14.7 Handle LaunchButton click events for unlocked/in-progress/completed tools
- [x] 14.8 Disable LaunchButton and prevent clicks for locked tools
- [x] 14.9 Optional: Change button text to "CONTINUE" for in-progress tools
- [x] 14.10 Add analytics tracking for tool launch events (if applicable)

## 15. Tool Summary Modal Implementation

- [x] 15.1 Create SummaryModal component with modal overlay
- [x] 15.2 Implement modal state (open/closed) in Dashboard component
- [x] 15.3 Create openSummary function that accepts tool slug
- [x] 15.4 Fetch tool data from api.getToolData(slug) when modal opens
- [x] 15.5 Display loading indicator while fetching tool data
- [x] 15.6 Render modal header with tool name and sprint number
- [x] 15.7 Render close button (X icon) in modal header
- [x] 15.8 Display fetched tool data in formatted view (JSON, HTML, or text)
- [x] 15.9 Implement data formatting logic for different content types
- [x] 15.10 Handle empty or missing summary data gracefully
- [x] 15.11 Implement modal close on close button click
- [x] 15.12 Implement modal close on overlay click
- [x] 15.13 Implement modal close on Escape key press
- [x] 15.14 Style modal with Fast Track brand (white/black, appropriate typography)
- [x] 15.15 Center modal on screen with dimmed background
- [x] 15.16 Add smooth fade-in/fade-out animation for modal
- [x] 15.17 Implement focus trap within modal for accessibility
- [x] 15.18 Return focus to ViewSummaryButton when modal closes
- [x] 15.19 Add optional "RELAUNCH TOOL" button at bottom of modal
- [x] 15.20 Handle error states (404, 500, network errors) in modal

## 16. Real-Time Progress Updates

- [x] 16.1 Implement polling mechanism using setInterval for 30-second intervals
- [x] 16.2 Call api.getTools() on each poll to fetch updated tool statuses
- [x] 16.3 Update component state with new tool data
- [x] 16.4 Clear interval when component unmounts to prevent memory leaks
- [x] 16.5 Pause polling when tab is not visible (Page Visibility API)
- [x] 16.6 Resume polling when user returns to tab
- [x] 16.7 Implement manual refresh button to fetch immediately
- [x] 16.8 Display "Last updated X seconds ago" timestamp
- [x] 16.9 Update timestamp every second with relative time
- [x] 16.10 Reset timestamp to "just now" after successful refresh

## 17. Tool Unlock Animations

- [x] 17.1 Detect when tool status changes from "locked" to "unlocked"
- [x] 17.2 Implement fade-in animation for newly unlocked tool cards
- [x] 17.3 Implement yellow pulse animation to draw attention
- [x] 17.4 Stagger animations by 200ms if multiple tools unlock simultaneously
- [x] 17.5 Add CSS transition classes for smooth animation
- [x] 17.6 Remove animation classes after animation completes
- [x] 17.7 Optional: Add subtle notification for unlocked tools

## 18. Footer Implementation

- [x] 18.1 Create footer container with black background
- [x] 18.2 Display "NO GRIT. NO GROWTH." tagline in Plaak uppercase
- [x] 18.3 Display Fast Track copyright text in Riforma
- [x] 18.4 Add current year dynamically to copyright text
- [x] 18.5 Style footer with appropriate padding and centering
- [x] 18.6 Position footer at bottom of page (sticky or fixed optional)

## 19. Error Handling & User Feedback

- [x] 19.1 Create ErrorMessage component for displaying error states
- [x] 19.2 Show authentication errors before redirect to login
- [x] 19.3 Display network error messages with retry buttons
- [x] 19.4 Show "Unable to connect to server" for failed API calls
- [x] 19.5 Display appropriate messages for 404 errors (data not found)
- [x] 19.6 Display generic error for 500 server errors
- [x] 19.7 Add loading spinner for initial dashboard load
- [x] 19.8 Add inline loading indicators for progress updates
- [x] 19.9 Show success feedback after successful data updates (optional)
- [x] 19.10 Implement graceful degradation with cached data on errors

## 20. Accessibility Implementation

- [x] 20.1 Add appropriate ARIA labels to interactive elements
- [x] 20.2 Ensure keyboard navigation works for all buttons and links
- [x] 20.3 Implement focus management for modal (trap focus, return focus)
- [x] 20.4 Add screen reader announcements for status changes
- [x] 20.5 Ensure sufficient color contrast for all text (WCAG 2.1 AA)
- [x] 20.6 Add alt text to logo image
- [x] 20.7 Mark disabled buttons with aria-disabled attribute
- [x] 20.8 Add role="dialog" and aria-modal="true" to modal
- [x] 20.9 Ensure Tab order is logical throughout dashboard
- [x] 20.10 Test with keyboard-only navigation

## 21. Responsive Behavior (Desktop-First)

- [x] 21.1 Test dashboard layout on standard desktop resolutions (1920x1080, 1366x768)
- [x] 21.2 Ensure tool card grid adapts to viewport width
- [x] 21.3 Add CSS media queries for tablet landscape (optional Phase 2)
- [x] 21.4 Verify font sizes are readable on all target screen sizes
- [x] 21.5 Test scrolling behavior with many tools visible
- [x] 21.6 Ensure header remains accessible during scroll

## 22. Performance Optimization

- [x] 22.1 Verify HTML file size is under 200KB target
- [x] 22.2 Optimize base64 logo size (target ~5KB)
- [x] 22.3 Use React.memo for components that don't need frequent re-renders
- [x] 22.4 Implement useMemo for expensive calculations (progress percentages)
- [x] 22.5 Ensure polling interval doesn't cause performance issues
- [x] 22.6 Test dashboard with all 30 tools rendered
- [x] 22.7 Verify smooth animations and transitions
- [x] 22.8 Check for memory leaks (unmounted component updates)

## 23. Testing & Quality Assurance

- [x] 23.1 Test authentication flow: URL token → localStorage → API validation
- [x] 23.2 Test redirect to LearnWorlds when token is missing or invalid
- [x] 23.3 Test all tool statuses render correctly (locked, unlocked, in-progress, completed)
- [x] 23.4 Test launching tools in all statuses (unlocked, in-progress, completed)
- [x] 23.5 Test that locked tools cannot be launched
- [x] 23.6 Test ViewSummary button appears only for completed tools
- [x] 23.7 Test summary modal opens, displays data, and closes correctly
- [x] 23.8 Test modal close via button, overlay click, and Escape key
- [x] 23.9 Test progress bar fills correctly for different percentages
- [x] 23.10 Test module collapse/expand functionality
- [x] 23.11 Test module collapse state persists in localStorage
- [x] 23.12 Test overall progress updates when tools are completed
- [x] 23.13 Test polling updates progress every 30 seconds
- [x] 23.14 Test manual refresh button fetches latest data
- [x] 23.15 Test unlock animations when dependencies are satisfied
- [x] 23.16 Test error handling for network failures
- [x] 23.17 Test error handling for 401, 404, 500 API responses
- [x] 23.18 Test token passing to individual tools via URL parameter
- [x] 23.19 Test back button navigation from tool to dashboard
- [x] 23.20 Verify brand compliance: colors, fonts, typography hierarchy
- [x] 23.21 Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [x] 23.22 Perform accessibility audit with keyboard navigation
- [x] 23.23 Test with screen reader (NVDA or JAWS)
- [x] 23.24 Validate HTML structure with W3C validator

## 24. Documentation & Code Comments

- [x] 24.1 Add inline comments explaining complex logic (token flow, status calculation)
- [x] 24.2 Add JSDoc comments for key functions (launchTool, openSummary, etc.)
- [x] 24.3 Document expected API response structures in comments
- [x] 24.4 Add README section for dashboard in project documentation
- [x] 24.5 Document configuration options (API base URL, polling interval)
- [x] 24.6 Document browser compatibility requirements
- [x] 24.7 Add comments explaining brand guideline implementations

## 25. Deployment Preparation

- [x] 25.1 Verify all asset paths are correct for production environment
- [x] 25.2 Update API base URL for production (not localhost:3000)
- [x] 25.3 Ensure HTTPS is enforced in production
- [x] 25.4 Verify LearnWorlds redirect URL is correct for production
- [x] 25.5 Test dashboard in production-like environment
- [x] 25.6 Create deployment checklist for operations team
- [x] 25.7 Verify favicon loads correctly in production
- [x] 25.8 Test deep link from LearnWorlds with production JWT tokens
