# Guru Suite - Fast Track Admin Panel

## Overview

The Guru Suite is a single-page React application that provides client-side gurus (team leaders/facilitators) with an administrative interface to monitor their team's progress through the Fast Track Program.

## Features

- **Code-Based Access**: Simple 8-character code entry (no traditional login)
- **Team Progress Dashboard**: Visual progress tracking with completion statistics
- **Submission Viewer**: Read-only access to team member tool submissions
- **Meeting Notes**: Structured note-taking with action item tracking
- **Guru Guides**: Sprint-specific PDF guide access
- **Multi-Organization Support**: Data isolation per organization
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **React 18**: Component-based UI (via CDN, no build step)
- **Vanilla CSS**: Custom styling with CSS custom properties
- **Session Storage**: Authentication state persistence
- **Fetch API**: REST API communication

## File Structure

```
frontend/guru-suite/
├── index.html          # Complete single-page application
└── README.md          # This file

frontend/content/guru-guides/
├── sprint_00_woop_guru_guide.pdf
├── sprint_01_know_thyself_guru_guide.pdf
├── sprint_02_dream_guru_guide.pdf
├── sprint_03_values_guru_guide.pdf
└── sprint_04_team_guru_guide.pdf
```

## Components

### CodeEntry
Entry point for guru authentication.

**Features:**
- Code input with uppercase transformation
- Client-side validation (8-12 characters)
- Error message display
- API validation via `/api/guru/validate-code`

### Dashboard
Main admin interface displaying team progress.

**Features:**
- Organization and sprint context
- Progress statistics (completed/in-progress/not-started)
- Team member table with sorting
- Exit functionality

### SubmissionModal
Modal dialog for viewing individual submissions.

**Features:**
- WOOP field display with formatting
- Yellow left border on WISH section
- Commitment level display (X/10 format)
- Overlay click-to-close

### GuruGuide
Card component for guru guide access.

**Features:**
- PDF icon and title display
- Download button
- Open in new tab button
- Conditional rendering (only if guide exists)

### MeetingNotes
Collapsible panel for meeting notes management.

**Features:**
- Structured note fields (discussion_points, key_insights, concerns, next_steps)
- Action items list with checkbox toggles
- Meeting date picker
- Save functionality with timestamp
- Expand/collapse state

## Design System

### Colors

```css
--bg-primary: #1A1A1A      /* Main background */
--bg-secondary: #2A2A2A    /* Cards, panels */
--bg-tertiary: #3A3A3A     /* Table headers */
--accent-yellow: #FFF469   /* Primary CTA, Fast Track brand */
--success-green: #22C55E   /* Completed status */
--text-primary: #FFFFFF    /* Main text */
--text-secondary: #9CA3AF  /* Secondary text */
--gray: #6B7280           /* Not started status */
--border: #3A3A3A         /* Borders, dividers */
```

### Typography

- **Headings**: Plaak3Trial-43-Bold (bold, custom font)
- **Body**: RiformaLL-Regular (regular weight)
- **Font Loading**: Local .woff2 files from project Designs folder

### Spacing

- Container max-width: 1200px
- Section padding: 32px
- Card padding: 24px
- Gap between elements: 16px

### Components

- **Buttons**: 8px border-radius, 12px-24px padding
- **Cards**: 12px border-radius, subtle shadows
- **Inputs**: Dark background (#2A2A2A), light border on focus
- **Tables**: No outer border, subtle row dividers

## Access Codes

### Test Codes

Use these codes to test the application:

| Code | Organization | Sprint | Guru | Team Size |
|------|-------------|--------|------|-----------|
| LUXO-WOOP | Luxottica | WOOP | Maria Rossi | 7 members |
| ACME-WOOP | Acme Corp | WOOP | John Smith | 3 members |
| TECH-WOOP | TechStart Inc | WOOP | Sarah Chen | 0 members |

### Expected Behavior (LUXO-WOOP)

**Team Progress:**
- Total: 7 members
- Completed: 3 (Paolo, Giulia, Marco)
- In Progress: 2 (Elena, Luca)
- Not Started: 2 (Sofia, Andrea)

**Submission Access:**
- Paolo Bianchi: Complete WOOP with 9/10 commitment
- Giulia Ferrari: Complete WOOP with 8/10 commitment
- Marco Romano: Complete WOOP with 10/10 commitment

**Meeting Notes:**
- Pre-populated with sample notes
- 3 action items (1 completed, 2 pending)
- Meeting date: 2 days ago

## Usage

### Starting the Application

1. Open `index.html` in a web browser
2. Enter a valid access code (e.g., "LUXO-WOOP")
3. Click "Access Dashboard"

### Viewing Submissions

1. Locate a team member with "completed" status
2. Click "View Submission" button
3. Review WOOP data in modal
4. Click X or overlay to close

### Managing Meeting Notes

1. Expand "Meeting Notes" section (if collapsed)
2. Edit structured note fields
3. Toggle action item checkboxes to mark complete
4. Click "Save Notes"
5. Verify "Last saved" timestamp updates

### Accessing Guru Guides

1. Locate the guru guide card
2. Click "Download Guide" for local save
3. Or click "Open in New Tab" for browser preview

### Exiting

1. Click "Exit" button in dashboard header
2. Session is cleared
3. Returns to code entry view

## API Integration

The frontend communicates with backend API endpoints:

- `POST /api/guru/validate-code` - Code validation
- `GET /api/guru/dashboard/:code` - Dashboard data
- `GET /api/guru/submission/:code/:userId` - Submission details
- `POST /api/guru/meeting-notes/:code` - Save notes

See `backend/GURU_API_DOCUMENTATION.md` for full API details.

## Session Management

### Storage

- **sessionStorage.guru_code**: Current access code
- **sessionStorage.guru_data**: Validation response data

### Persistence

- Session persists across page refreshes
- Cleared on Exit button click
- Cleared on browser tab close

### Security

- No sensitive data stored
- Access code validated on every API request
- Organization-level data isolation enforced by backend

## Browser Compatibility

- **Chrome/Edge**: 90+ (recommended)
- **Firefox**: 88+
- **Safari**: 14+

**Requirements:**
- ES6+ JavaScript support
- Fetch API support
- CSS Grid support
- CSS Custom Properties support

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  - Single column stat cards
  - Stacked dashboard header
  - Horizontal table scroll
}
```

## Performance Considerations

- **CDN React**: Production minified builds
- **Local Fonts**: Cached after first load
- **Lazy Loading**: Submissions loaded on-demand
- **API Caching**: Dashboard data cached until page refresh

## Accessibility

- **Keyboard Navigation**: All interactive elements focusable
- **Focus Styles**: Visible focus indicators on all inputs/buttons
- **Semantic HTML**: Proper heading hierarchy
- **ARIA**: Modal overlay with proper focus trapping

## Known Limitations

1. **No Pagination**: All team members loaded at once (performance impact for teams >50)
2. **No Real-Time Updates**: Manual refresh required to see progress changes
3. **Single Sprint View**: Cannot view multiple sprints simultaneously
4. **No Offline Support**: Requires active internet connection
5. **No Edit Capability**: Gurus cannot modify team member submissions (by design)

## Troubleshooting

### "Invalid code" error
- Verify code is correct (case-insensitive)
- Check code is active (is_active = true in database)
- Verify code has not expired

### Dashboard not loading
- Check browser console for API errors
- Verify backend server is running
- Check network tab for failed requests

### Submissions not appearing
- Verify team members have completed submissions
- Check database for submission_data in tool_submissions table
- Verify status is "completed" in user_progress table

### Meeting notes not saving
- Check browser console for errors
- Verify JSONB structure is valid
- Check backend logs for database errors

## Future Enhancements

- [ ] Add real-time progress updates (WebSockets/SSE)
- [ ] Implement pagination for large teams
- [ ] Add export to CSV/PDF functionality
- [ ] Support filtering by status
- [ ] Add search by team member name
- [ ] Implement dark/light mode toggle
- [ ] Add keyboard shortcuts
- [ ] Support multiple sprint view
- [ ] Add guru-to-guru messaging
- [ ] Implement notification system

## Integration

### Adding GURU LOGIN Button to Tools

To add the Guru Suite login button to a tool page:

```html
<a href="../../guru-suite/index.html" class="guru-login-btn">GURU LOGIN</a>
```

```css
.guru-login-btn {
    position: fixed;
    top: 20px;
    right: 100px;
    background: transparent;
    border: 2px solid #FFF469;
    color: #FFF469;
    padding: 10px 20px;
    font-family: 'Riforma', sans-serif;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    z-index: 1000;
    cursor: pointer;
}

.guru-login-btn:hover {
    background: #FFF469;
    color: #1A1A1A;
}
```

## Development

### No Build Step Required

This application uses CDN-based React and vanilla CSS, so no build process is needed. Simply edit `index.html` and refresh the browser.

### Testing Locally

1. Start the backend server: `cd backend && npm run dev`
2. Open `frontend/guru-suite/index.html` in browser
3. Use test access codes listed above

### Making Changes

**Adding a Component:**
Add a new function component inside the `<script type="text/babel">` block.

**Modifying Styles:**
Edit the `<style>` block in the `<head>` section.

**Changing API Endpoints:**
Update the `API_BASE` constant at the top of the script.

## Support

For issues or questions:
- Check backend logs for API errors
- Review browser console for frontend errors
- Consult `GURU_API_DOCUMENTATION.md` for API details
- Verify database seed data is present

