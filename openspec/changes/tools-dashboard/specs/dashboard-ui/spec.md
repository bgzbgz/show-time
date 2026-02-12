## ADDED Requirements

### Requirement: Fast Track Brand Compliance
The dashboard SHALL implement all Fast Track Brand Guidelines including colors, typography, and design principles.

#### Scenario: Primary color palette applied
- **WHEN** the dashboard renders
- **THEN** all colors SHALL use the approved palette: Black (#000000), White (#FFFFFF), Grey (#B2B2B2), Yellow Accent (#FFF469)

#### Scenario: Typography hierarchy enforced
- **WHEN** rendering text elements
- **THEN** headlines SHALL use Plaak Ex Condensed 43 Bold in UPPERCASE
- **AND** body text SHALL use Riforma LL Regular in sentence case
- **AND** labels SHALL use Monument Grotesk Mono in UPPERCASE sparingly

#### Scenario: Design principles followed
- **WHEN** laying out UI components
- **THEN** elements SHALL use strong left alignment
- **AND** backgrounds SHALL be black with white/yellow accents
- **AND** design SHALL be bold and minimal, not decorative

### Requirement: Header Component
The dashboard SHALL display a header with logo, user information, and overall progress.

#### Scenario: Header renders on black background
- **WHEN** the dashboard loads
- **THEN** the header SHALL have a black background
- **AND** the Fast Track F logo (white) SHALL appear on the left
- **AND** user name and avatar SHALL appear on the right
- **AND** an overall progress bar with yellow accent SHALL be visible

#### Scenario: Logo asset loaded correctly
- **WHEN** the header renders
- **THEN** the logo SHALL be loaded from `designs for tools and landing page/02. logos/FastTrack_F_White.png`
- **AND** the logo SHALL be displayed as white F mark on black background

### Requirement: Hero Section
The dashboard SHALL display a hero section with transformation journey headline and progress summary.

#### Scenario: Hero section renders with correct typography
- **WHEN** the hero section loads
- **THEN** headline SHALL display "YOUR TRANSFORMATION JOURNEY" in Plaak uppercase
- **AND** subtext SHALL show progress summary "X of 30 tools complete" in Riforma
- **AND** current sprint indicator SHALL be visible

#### Scenario: Progress summary updates
- **WHEN** user completes a tool
- **THEN** the progress summary SHALL update to reflect new completion count
- **AND** the text SHALL show accurate "X of 30 tools complete"

### Requirement: Module Grid Organization
The dashboard SHALL organize tools into 5 collapsible module sections.

#### Scenario: All 5 modules rendered
- **WHEN** the dashboard loads
- **THEN** the following modules SHALL be displayed:
  - Module 0: Foundation (Sprint 0)
  - Module 1: Leadership (Sprints 1-11)
  - Module 2: Marketing & Sales (Sprints 12-21)
  - Module 3: Operations (Sprints 22-27)
  - Module 4: Digitalization (Sprints 28-29)

#### Scenario: Modules are collapsible
- **WHEN** a user clicks on a module header
- **THEN** the module SHALL toggle between expanded and collapsed states
- **AND** collapse state SHALL persist in localStorage

#### Scenario: Default module state on first visit
- **WHEN** a new user visits the dashboard for the first time
- **THEN** all modules SHALL be expanded by default

### Requirement: Tool Card Display
The dashboard SHALL display tool cards with status, progress, and action buttons.

#### Scenario: Tool card structure
- **WHEN** a tool card renders
- **THEN** it SHALL display on a white card against black/dark grey background
- **AND** it SHALL show sprint number in Monument Grotesk Mono (small)
- **AND** it SHALL show tool name in Plaak bold
- **AND** it SHALL include a status indicator
- **AND** it SHALL include a progress percentage bar with yellow fill

#### Scenario: Locked tool display
- **WHEN** a tool is locked
- **THEN** status SHALL show "LOCKED" in grey text
- **AND** the card SHALL be in disabled state
- **AND** "LAUNCH" button SHALL be disabled

#### Scenario: Unlocked tool display
- **WHEN** a tool is unlocked
- **THEN** status SHALL show "UNLOCKED" in white text
- **AND** the card SHALL be clickable
- **AND** "LAUNCH" button SHALL be enabled

#### Scenario: In progress tool display
- **WHEN** a tool is in progress
- **THEN** status SHALL show "IN PROGRESS" in yellow text
- **AND** card SHALL have yellow border
- **AND** progress percentage bar SHALL be visible
- **AND** "LAUNCH" button SHALL be enabled

#### Scenario: Completed tool display
- **WHEN** a tool is completed
- **THEN** status SHALL show checkmark icon or "DONE" text
- **AND** progress bar SHALL show 100% with yellow fill
- **AND** "VIEW SUMMARY" button SHALL appear
- **AND** "LAUNCH" button SHALL remain enabled

### Requirement: Action Buttons
The dashboard SHALL provide "LAUNCH" and "VIEW SUMMARY" buttons with appropriate styling and behavior.

#### Scenario: Launch button styling
- **WHEN** a "LAUNCH" button renders
- **THEN** it SHALL have black background
- **AND** text SHALL be bold and commanding ("LAUNCH", not "Click here")
- **AND** it SHALL be disabled if tool is locked

#### Scenario: View summary button appears conditionally
- **WHEN** a tool is not completed
- **THEN** "VIEW SUMMARY" button SHALL NOT be visible
- **WHEN** a tool is completed
- **THEN** "VIEW SUMMARY" button SHALL appear

### Requirement: Footer Component
The dashboard SHALL display a footer with Fast Track branding.

#### Scenario: Footer renders correctly
- **WHEN** the footer loads
- **THEN** it SHALL have black background
- **AND** it SHALL display "NO GRIT. NO GROWTH." tagline
- **AND** it SHALL show Fast Track copyright text

### Requirement: Font Loading
The dashboard SHALL load custom Fast Track fonts via @font-face declarations.

#### Scenario: Custom fonts loaded from local files
- **WHEN** the dashboard initializes
- **THEN** Plaak SHALL load from `designs for tools and landing page/03. Fonts/woff2/Plaak3Trial-43-Bold.woff2`
- **AND** Riforma SHALL load from `designs for tools and landing page/03. Fonts/woff2/RiformaLL-Regular.woff2`
- **AND** Monument Grotesk SHALL load from `designs for tools and landing page/03. Fonts/woff2/MonumentGrotesk-Mono.woff2`

#### Scenario: Font display strategy
- **WHEN** fonts are loading
- **THEN** font-display SHALL be set to "swap" to prevent invisible text
- **AND** system font fallbacks SHALL be defined (e.g., Arial, sans-serif)

### Requirement: Favicon
The dashboard SHALL use the Fast Track favicon.

#### Scenario: Favicon loaded
- **WHEN** the browser tab displays the dashboard
- **THEN** favicon SHALL be loaded from `designs for tools and landing page/01. favicon/favicon-16x16.png`

### Requirement: Single HTML File Architecture
The dashboard SHALL be implemented as a single self-contained HTML file.

#### Scenario: No build step required
- **WHEN** deploying the dashboard
- **THEN** it SHALL be a single `frontend/dashboard.html` file
- **AND** it SHALL NOT require a build process
- **AND** React 18 SHALL be loaded via CDN
- **AND** Tailwind CSS SHALL be loaded via CDN

#### Scenario: Inline components and styles
- **WHEN** viewing the HTML source
- **THEN** all React components SHALL be defined inline within `<script type="text/babel">` block
- **AND** custom styles SHALL be included in inline `<style>` tags

### Requirement: Visual Unlock Animations
The dashboard SHALL display visual animations when tools unlock.

#### Scenario: Tool unlock animation
- **WHEN** a tool status changes from locked to unlocked
- **THEN** the tool card SHALL display a fade-in animation
- **AND** the card SHALL show a yellow pulse effect
- **AND** the animation SHALL draw user attention to newly available tools

### Requirement: Module Completion Indicators
The dashboard SHALL display completion status for each module.

#### Scenario: Module progress visible
- **WHEN** viewing a module section
- **THEN** the module SHALL show completion count (e.g., "3/11 complete")
- **AND** visual progress indicator SHALL reflect module completion percentage
