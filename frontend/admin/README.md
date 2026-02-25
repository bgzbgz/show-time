# frontend/admin/

Internal admin panel for Ivan and associates. 360° monitoring view across all companies, users, tool activity, and error logs.

## Deployed at

Railway — admin-panel-tools repo: https://github.com/bgzbgz/admin-panel-tools

## Auth

Supabase email+password. After login, checks `admin_users` table — if the authenticated user's UUID is not in that table, access is denied and the session is signed out.

## To grant admin access to a new person

1. They create a Supabase Auth account (or you create it via Supabase dashboard → Authentication → Users → Add user)
2. Copy their UUID
3. Run in Supabase SQL editor:
   ```sql
   INSERT INTO admin_users (id, name) VALUES ('<uuid>', 'Name');
   ```

## Views

| View | What it shows |
|---|---|
| Overview | 6 stat cards (users, active 24h, completions, companies, AI challenges, errors) + live activity feed |
| Companies | All orgs as cards, expand to see member table, click member to open drawer |
| Users | Searchable table with current tool + last active, click row for full drawer |
| Logs | Webhook errors tab + AI challenge log tab |

## User drawer

Click any user row to open a slide-in drawer showing:
- Completed tools with date and time-to-complete
- In-progress tools with questions answered count
- Last 5 AI challenge interactions
- Raw answers for their most recent tool

## Tech

React 18 + Babel standalone + Supabase JS. All queries go direct to Supabase using the admin's authenticated session (RLS policies allow admin read on all tables).
