# frontend/

Static HTML platform served from Railway. No build step — every tool is a self-contained HTML file.

## Deployed at

https://fasttracktools.up.railway.app

## Structure

```
frontend/
├── index.html          Redirects to dashboard.html
├── dashboard.html      Main user entry point — tool grid, access control
├── admin/              Internal admin panel (auth-gated, Supabase email+password)
├── guru-suite/         Facilitator dashboard (access code entry)
├── tools/              31 interactive business tools (HTML files)
├── shared/             Shared assets used by all tools
│   ├── fonts/          Canonical font location (woff2) — Plaak, Riforma, Monument
│   ├── images/         Logo, favicon
│   ├── css/            cognitive-load.css
│   └── js/             tool-db.js, ai-challenge.js, dependency-injection.js, cognitive-load.js
├── content/            Sprint content markdown files (30+ sprints)
├── js/                 auth.js, tool-access-control.js
├── serve.json          Static file serving config
├── railway.json        Railway deploy config
└── nixpacks.toml       Build config
```

## Font rule

All tools reference fonts from their own module folder (e.g. `Plaak3Trial-43-Bold.woff2` relative to the HTML file).
The canonical source is `shared/fonts/`. Do not add font files anywhere else.

## How to add a new tool

1. Copy an existing tool from the same module folder as a starting point
2. Update the tool slug, title, and question content
3. Add `tool_questions` rows in Supabase for the new tool slug
4. Add the tool to `course_tool_mapping` in Supabase
5. Update `dependency-injection.js` if the tool reads from or feeds into other tools
