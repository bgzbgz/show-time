/openspec-new-change

## Feature: Guru Suite - Sprint Admin Panel with Complete Test Data

### Overview
Build a "Guru Suite" admin panel that allows client-side gurus (team leaders/facilitators) to monitor their team's progress through the Fast Track Program. The guru accesses the suite via a unique code provided by Fast Track. Include comprehensive seed data for immediate testing.

### Access Model
- Each organization (client company) has ONE guru per sprint
- Guru receives a unique 8-character alphanumeric code (e.g., "LUXO-WOOP")
- Code is sprint-specific: one code per organization per sprint
- No traditional login - just code entry
- Code validates against database and grants access to that sprint's data for that organization

### Database Schema Changes

#### 1. New Tables (create in Supabase using MCP)

-- Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guru access codes
CREATE TABLE IF NOT EXISTS public.guru_access_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id),
    sprint_id INTEGER NOT NULL,
    code TEXT UNIQUE NOT NULL,
    guru_name TEXT,
    guru_email TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Guru guides storage
CREATE TABLE IF NOT EXISTS public.guru_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sprint_id INTEGER NOT NULL UNIQUE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guru meeting notes
CREATE TABLE IF NOT EXISTS public.guru_meeting_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id),
    sprint_id INTEGER NOT NULL,
    guru_code_id UUID REFERENCES public.guru_access_codes(id),
    notes_content JSONB DEFAULT '{}',
    action_items JSONB DEFAULT '[]',
    meeting_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, sprint_id)
);

#### 2. Update users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

### Seed Data - INSERT ALL OF THIS FOR TESTING

#### Organizations
INSERT INTO public.organizations (id, name, slug) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Luxottica', 'luxottica'),
    ('22222222-2222-2222-2222-222222222222', 'Acme Corp', 'acme-corp'),
    ('33333333-3333-3333-3333-333333333333', 'TechStart Inc', 'techstart')
ON CONFLICT (slug) DO NOTHING;

#### Guru Access Codes
INSERT INTO public.guru_access_codes (organization_id, sprint_id, code, guru_name, guru_email, is_active) VALUES
    ('11111111-1111-1111-1111-111111111111', 0, 'LUXO-WOOP', 'Maria Rossi', 'maria.rossi@luxottica.com', true),
    ('22222222-2222-2222-2222-222222222222', 0, 'ACME-WOOP', 'John Smith', 'john.smith@acme.com', true),
    ('33333333-3333-3333-3333-333333333333', 0, 'TECH-WOOP', 'Sarah Chen', 'sarah.chen@techstart.io', true)
ON CONFLICT (code) DO NOTHING;

#### Guru Guides
INSERT INTO public.guru_guides (sprint_id, file_path, file_name) VALUES
    (0, '/content/guru-guides/sprint_00_woop_guru_guide.pdf', 'WOOP Guru Guide'),
    (1, '/content/guru-guides/sprint_01_know_thyself_guru_guide.pdf', 'Know Thyself Guru Guide'),
    (2, '/content/guru-guides/sprint_02_dream_guru_guide.pdf', 'Dream Guru Guide'),
    (3, '/content/guru-guides/sprint_03_values_guru_guide.pdf', 'Values Guru Guide'),
    (4, '/content/guru-guides/sprint_04_team_guru_guide.pdf', 'Team Guru Guide')
ON CONFLICT (sprint_id) DO NOTHING;

#### Test Users - Luxottica Team (7 members with varying progress)
INSERT INTO public.users (id, email, full_name, organization_id, created_at) VALUES
    ('aaaa1111-1111-1111-1111-111111111111', 'paolo.bianchi@luxottica.com', 'Paolo Bianchi', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '10 days'),
    ('aaaa2222-2222-2222-2222-222222222222', 'giulia.ferrari@luxottica.com', 'Giulia Ferrari', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '9 days'),
    ('aaaa3333-3333-3333-3333-333333333333', 'marco.romano@luxottica.com', 'Marco Romano', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '8 days'),
    ('aaaa4444-4444-4444-4444-444444444444', 'elena.costa@luxottica.com', 'Elena Costa', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '7 days'),
    ('aaaa5555-5555-5555-5555-555555555555', 'luca.moretti@luxottica.com', 'Luca Moretti', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '6 days'),
    ('aaaa6666-6666-6666-6666-666666666666', 'sofia.ricci@luxottica.com', 'Sofia Ricci', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '5 days'),
    ('aaaa7777-7777-7777-7777-777777777777', 'andrea.gallo@luxottica.com', 'Andrea Gallo', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

#### Test Users - Acme Corp Team (3 members)
INSERT INTO public.users (id, email, full_name, organization_id, created_at) VALUES
    ('bbbb1111-1111-1111-1111-111111111111', 'alice.johnson@acme.com', 'Alice Johnson', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '10 days'),
    ('bbbb2222-2222-2222-2222-222222222222', 'bob.williams@acme.com', 'Bob Williams', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '9 days'),
    ('bbbb3333-3333-3333-3333-333333333333', 'carol.davis@acme.com', 'Carol Davis', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '8 days')
ON CONFLICT (id) DO NOTHING;

#### Completed WOOP Submissions (3 Luxottica members)
INSERT INTO public.tool_submissions (id, user_id, sprint_id, tool_slug, submission_data, status, submitted_at, created_at) VALUES
    (
        'sub11111-1111-1111-1111-111111111111',
        'aaaa1111-1111-1111-1111-111111111111',
        0,
        'woop',
        '{"wish": "I want to become a more effective leader who inspires my team to achieve exceptional results while maintaining work-life balance.", "outcome": "My team consistently exceeds targets by 20%, team satisfaction scores are above 90%, and I leave work by 6pm most days feeling accomplished.", "obstacle_internal": "I tend to micromanage because I fear things will not be done correctly. I also struggle to delegate important tasks.", "obstacle_external": "Heavy meeting load leaves little time for strategic thinking. Company culture rewards long hours over efficiency.", "plan_if_then": "IF I feel the urge to check on my team work, THEN I will first ask myself if they have the skills and if I have given clear instructions.", "commitment_level": "9", "first_action": "Tomorrow I will identify 3 tasks I can fully delegate to team members this week.", "reflection": "This exercise helped me realize my micromanagement stems from my own insecurity, not my team capability."}'::jsonb,
        'completed',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days'
    ),
    (
        'sub22222-2222-2222-2222-222222222222',
        'aaaa2222-2222-2222-2222-222222222222',
        0,
        'woop',
        '{"wish": "I want to successfully launch our new product line in the European market within the next 6 months.", "outcome": "The product achieves 2M EUR in sales in Q1, we have distribution in 5 key markets, and customer reviews average 4.5 stars.", "obstacle_internal": "I get overwhelmed by the complexity and tend to procrastinate on difficult decisions. I also avoid conflict with stakeholders.", "obstacle_external": "Budget constraints limit marketing spend. Supply chain issues may delay inventory. Competing priorities from leadership.", "plan_if_then": "IF I feel overwhelmed by a decision, THEN I will break it into 3 smaller decisions and tackle the easiest one first.", "commitment_level": "8", "first_action": "This week I will schedule one-on-ones with each key stakeholder to align on priorities and surface conflicts early.", "reflection": "I realized I need to be more proactive about addressing conflicts rather than hoping they resolve themselves."}'::jsonb,
        'completed',
        NOW() - INTERVAL '4 days',
        NOW() - INTERVAL '4 days'
    ),
    (
        'sub33333-3333-3333-3333-333333333333',
        'aaaa3333-3333-3333-3333-333333333333',
        0,
        'woop',
        '{"wish": "I want to build a high-performing innovation team that develops 3 breakthrough products in the next year.", "outcome": "We have 3 products in pilot testing, team morale is high with zero turnover, and we have filed 2 patents.", "obstacle_internal": "I am risk-averse and tend to kill ideas too early. I also struggle to give my team the autonomy they need.", "obstacle_external": "Corporate approval processes are slow. Budget cycles do not align with innovation timelines. Talent competition is fierce.", "plan_if_then": "IF I want to reject an idea, THEN I will first ask the team to present 3 ways it could work before deciding.", "commitment_level": "10", "first_action": "Monday I will announce to my team that we are adopting a yes and approach to all new ideas for the next month.", "reflection": "My risk aversion has been holding back my team creativity. Time to trust them more."}'::jsonb,
        'completed',
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '3 days'
    )
ON CONFLICT (id) DO NOTHING;

#### Draft/Autosave Data (2 in-progress users)
INSERT INTO public.autosave_data (user_id, sprint_id, tool_slug, draft_data, updated_at) VALUES
    (
        'aaaa4444-4444-4444-4444-444444444444',
        0,
        'woop',
        '{"wish": "I want to transition from individual contributor to team lead successfully.", "outcome": "Draft - still thinking about specific metrics...", "obstacle_internal": "", "obstacle_external": ""}'::jsonb,
        NOW() - INTERVAL '2 days'
    ),
    (
        'aaaa5555-5555-5555-5555-555555555555',
        0,
        'woop',
        '{"wish": "I want to improve my presentation skills"}'::jsonb,
        NOW() - INTERVAL '1 day'
    )
ON CONFLICT (user_id, sprint_id, tool_slug) DO NOTHING;

#### User Progress Records
INSERT INTO public.user_progress (user_id, sprint_id, tool_slug, status, started_at, completed_at) VALUES
    ('aaaa1111-1111-1111-1111-111111111111', 0, 'woop', 'completed', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
    ('aaaa2222-2222-2222-2222-222222222222', 0, 'woop', 'completed', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),
    ('aaaa3333-3333-3333-3333-333333333333', 0, 'woop', 'completed', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'),
    ('aaaa4444-4444-4444-4444-444444444444', 0, 'woop', 'in_progress', NOW() - INTERVAL '2 days', NULL),
    ('aaaa5555-5555-5555-5555-555555555555', 0, 'woop', 'in_progress', NOW() - INTERVAL '1 day', NULL)
ON CONFLICT (user_id, sprint_id, tool_slug) DO NOTHING;

#### Sample Meeting Notes
INSERT INTO public.guru_meeting_notes (organization_id, sprint_id, guru_code_id, notes_content, action_items, meeting_date) 
SELECT 
    '11111111-1111-1111-1111-111111111111',
    0,
    id,
    '{"discussion_points": "Team discussed their WOOPs openly. Good energy in the room. Paolo shared his leadership insights which resonated with others.", "key_insights": "Most team members identified time management and delegation as common obstacles. This suggests we may need team-wide training.", "concerns": "Elena and Luca have not completed yet - need to follow up individually.", "next_steps": "Schedule 1:1s with incomplete members. Plan team workshop on delegation."}'::jsonb,
    '[{"task": "Follow up with Elena on her WOOP progress", "assignee": "Maria Rossi", "due": "2024-02-15", "status": "pending"}, {"task": "Schedule delegation workshop", "assignee": "Maria Rossi", "due": "2024-02-20", "status": "pending"}, {"task": "Share Paolo leadership framework with team", "assignee": "Paolo Bianchi", "due": "2024-02-12", "status": "completed"}]'::jsonb,
    CURRENT_DATE - INTERVAL '2 days'
FROM public.guru_access_codes WHERE code = 'LUXO-WOOP'
ON CONFLICT (organization_id, sprint_id) DO NOTHING;

### Backend API Endpoints

Create file: backend/src/routes/guru.js

const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// POST /api/guru/validate-code
router.post('/validate-code', async (req, res) => {
    const { code } = req.body;
    
    const { data, error } = await supabase
        .from('guru_access_codes')
        .select(`
            *,
            organizations (name, slug)
        `)
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();
    
    if (error || !data) {
        return res.status(401).json({ valid: false, error: 'Invalid code' });
    }
    
    res.json({
        valid: true,
        organization: data.organizations.name,
        organization_slug: data.organizations.slug,
        sprint_id: data.sprint_id,
        guru_name: data.guru_name
    });
});

// GET /api/guru/dashboard/:code
router.get('/dashboard/:code', async (req, res) => {
    const { code } = req.params;
    
    // Validate code and get org info
    const { data: codeData } = await supabase
        .from('guru_access_codes')
        .select('*, organizations(*)')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();
    
    if (!codeData) {
        return res.status(401).json({ error: 'Invalid code' });
    }
    
    const orgId = codeData.organization_id;
    const sprintId = codeData.sprint_id;
    
    // Get all team members for this org
    const { data: members } = await supabase
        .from('users')
        .select('id, full_name, email, created_at')
        .eq('organization_id', orgId);
    
    // Get progress for this sprint
    const { data: progress } = await supabase
        .from('user_progress')
        .select('user_id, status, completed_at')
        .eq('sprint_id', sprintId)
        .in('user_id', members.map(m => m.id));
    
    // Get submissions
    const { data: submissions } = await supabase
        .from('tool_submissions')
        .select('user_id, submitted_at')
        .eq('sprint_id', sprintId)
        .in('user_id', members.map(m => m.id));
    
    // Combine data
    const membersWithStatus = members.map(member => {
        const prog = progress.find(p => p.user_id === member.id);
        const sub = submissions.find(s => s.user_id === member.id);
        return {
            ...member,
            status: prog?.status || 'not_started',
            submitted_at: sub?.submitted_at || null
        };
    });
    
    // Get guru guide
    const { data: guruGuide } = await supabase
        .from('guru_guides')
        .select('*')
        .eq('sprint_id', sprintId)
        .single();
    
    // Get meeting notes
    const { data: meetingNotes } = await supabase
        .from('guru_meeting_notes')
        .select('*')
        .eq('organization_id', orgId)
        .eq('sprint_id', sprintId)
        .single();
    
    const completed = membersWithStatus.filter(m => m.status === 'completed').length;
    const inProgress = membersWithStatus.filter(m => m.status === 'in_progress').length;
    const notStarted = membersWithStatus.filter(m => m.status === 'not_started').length;
    
    res.json({
        organization: codeData.organizations,
        sprint: { id: sprintId, name: getSprintName(sprintId) },
        guru: { name: codeData.guru_name, email: codeData.guru_email },
        team_progress: {
            total: members.length,
            completed,
            in_progress: inProgress,
            not_started: notStarted
        },
        members: membersWithStatus,
        guru_guide: guruGuide,
        meeting_notes: meetingNotes
    });
});

// GET /api/guru/submission/:code/:userId
router.get('/submission/:code/:userId', async (req, res) => {
    const { code, userId } = req.params;
    
    // Validate code
    const { data: codeData } = await supabase
        .from('guru_access_codes')
        .select('sprint_id, organization_id')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();
    
    if (!codeData) {
        return res.status(401).json({ error: 'Invalid code' });
    }
    
    // Verify user belongs to org
    const { data: user } = await supabase
        .from('users')
        .select('full_name, organization_id')
        .eq('id', userId)
        .single();
    
    if (!user || user.organization_id !== codeData.organization_id) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get submission
    const { data: submission } = await supabase
        .from('tool_submissions')
        .select('*')
        .eq('user_id', userId)
        .eq('sprint_id', codeData.sprint_id)
        .single();
    
    res.json({
        user_name: user.full_name,
        submission: submission
    });
});

// POST /api/guru/meeting-notes/:code
router.post('/meeting-notes/:code', async (req, res) => {
    const { code } = req.params;
    const { notes_content, action_items, meeting_date } = req.body;
    
    const { data: codeData } = await supabase
        .from('guru_access_codes')
        .select('id, sprint_id, organization_id')
        .eq('code', code.toUpperCase())
        .single();
    
    if (!codeData) {
        return res.status(401).json({ error: 'Invalid code' });
    }
    
    const { data, error } = await supabase
        .from('guru_meeting_notes')
        .upsert({
            organization_id: codeData.organization_id,
            sprint_id: codeData.sprint_id,
            guru_code_id: codeData.id,
            notes_content,
            action_items,
            meeting_date,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'organization_id,sprint_id'
        })
        .select()
        .single();
    
    res.json({ success: true, data });
});

function getSprintName(sprintId) {
    const names = {
        0: 'WOOP',
        1: 'Know Thyself',
        2: 'Dream',
        3: 'Values',
        4: 'Team'
    };
    return names[sprintId] || `Sprint ${sprintId}`;
}

module.exports = router;

Register in backend/src/index.js:
const guruRoutes = require('./routes/guru');
app.use('/api/guru', guruRoutes);

### Frontend: Guru Suite

Create file: frontend/guru-suite/index.html

Complete single-page React application with:

1. CODE ENTRY VIEW
- Fast Track logo to be top right
- "Guru Suite" title in C:\Users\Admin\Desktop\show time\Designs\03. Fonts\woff2\Plaak3Trial-43-Bold.woff2
- Single input field for code (uppercase, 8-12 chars)
- "Access Dashboard" button (Fast Track yellow #FFF469)
- Error message area
- Dark background (#1A1A1A)

2. DASHBOARD VIEW (after valid code entry)

Header Section:
- Organization name (large,C:\Users\Admin\Desktop\show time\Designs\03. Fonts\woff2\Plaak3Trial-43-Bold.woff2 )
- Sprint name badge
- Guru name display
- "Exit" button (returns to code entry)

Team Progress Overview:
- Large progress bar showing completion percentage
- Three stat cards in a row:
  - COMPLETED: green background, count + percentage
  - IN PROGRESS: yellow (#FFF469) background, count + percentage
  - NOT STARTED: gray background, count + percentage

Team Members Table:
- Columns: NAME | EMAIL | STATUS | SUBMITTED | ACTIONS
- Status badges with appropriate colors
- "View Submission" button only for completed status
- Sortable by clicking column headers
- Zebra striping for readability

Submission Modal:
- Opens when clicking "View Submission"
- Dark overlay background
- White modal with member name header
- Formatted display of all WOOP fields:
  - WISH section with yellow left border
  - OUTCOME section
  - INTERNAL OBSTACLE section
  - EXTERNAL OBSTACLE section
  - IF-THEN PLAN section
  - COMMITMENT LEVEL (show as X/10)
  - FIRST ACTION section
  - REFLECTION section
- Close button (X in corner)

Guru Guide Section:
- Card with PDF icon
- Guide title
- "Download Guide" button
- "Open in New Tab" button

Meeting Notes Section:
- Collapsible panel
- Meeting date picker
- Large textarea for notes
- Action Items subsection:
  - List of existing items with checkboxes
  - "Add Item" button
  - Each item shows: task, assignee, due date, status
- "Save Notes" button with loading state
- Last saved timestamp

Export Section:
- "Export All Submissions as PDF" button
- Generates downloadable PDF with all team data

3. DESIGN SPECIFICATIONS

Colors:
- Background: #1A1A1A
- Primary accent: #FFF469 (Fast Track yellow)
- Text primary: #FFFFFF
- Text secondary: #9CA3AF
- Success/Completed: #22C55E
- Warning/In Progress: #FFF469
- Neutral/Not Started: #6B7280
- Card backgrounds: #2A2A2A
- Borders: #3A3A3A

Typography:
- Headings: 'C:\Users\Admin\Desktop\show time\Designs\03. Fonts\woff2\Plaak3Trial-43-Bold.woff2
- Body: C:\Users\Admin\Desktop\show time\Designs\03. Fonts\woff2\RiformaLL-Regular.woff2
- Load from project files

Spacing:
- Container max-width: 1200px
- Section padding: 32px
- Card padding: 24px
- Gap between elements: 16px

Components:
- Buttons: rounded corners (8px), padding 12px 24px
- Cards: rounded corners (12px), subtle shadow
- Inputs: dark background (#2A2A2A), light border on focus
- Tables: no outer border, subtle row dividers

4. NO EMOJIS ANYWHERE

### Tool Integration: GURU LOGIN Button

Add to frontend/tools/module-0-intro-sprint/00-woop.html

In the intro/landing section of the tool, add a visible button:

Position: Fixed, top-right corner
Style: Outlined button with Fast Track yellow border
Text: "GURU LOGIN"
Link: /guru-suite/

CSS for the button:
.guru-login-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    background: transparent;
    border: 2px solid #FFF469;
    color: #FFF469;
    padding: 10px 20px;
    font-family: 'Sora', sans-serif;
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

### Testing Verification

After implementation, test with seed data:

1. Enter code "LUXO-WOOP" - should access Luxottica dashboard
2. Dashboard should show:
   - Organization: Luxottica
   - Sprint: WOOP
   - Guru: Maria Rossi
   - Total members: 7
   - Completed: 3 (Paolo, Giulia, Marco)
   - In Progress: 2 (Elena, Luca)
   - Not Started: 2 (Sofia, Andrea)

3. Click "View Submission" on Paolo Bianchi:
   - Should show his complete WOOP answers
   - Wish about becoming effective leader
   - Commitment level: 9/10

4. Meeting Notes should show existing notes with 3 action items

5. Guru Guide download should work for sprint_00_woop_guru_guide.pdf

6. GURU LOGIN button visible on 00-woop.html intro page

### File Structure

frontend/
  guru-suite/
    index.html
  tools/
    module-0-intro-sprint/
      00-woop.html (add GURU LOGIN button)
  content/
    guru-guides/
      sprint_00_woop_guru_guide.pdf
      sprint_01_know_thyself_guru_guide.pdf
      sprint_02_dream_guru_guide.pdf
      sprint_03_values_guru_guide.pdf
      sprint_04_team_guru_guide.pdf

backend/
  src/
    routes/
      guru.js (new file)
    index.js (register guru routes)

### Implementation Order

1. Create database tables using Supabase MCP
2. Insert all seed data using Supabase MCP
3. Create backend/src/routes/guru.js
4. Register routes in backend/src/index.js
5. Create frontend/guru-suite/index.html
6. Add GURU LOGIN button to 00-woop.html
7. Test all functionality with seed data