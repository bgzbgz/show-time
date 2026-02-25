# Fast Track Tools — Project Rules

## Deployment

**ALWAYS deploy via GitHub push. NEVER use the Railway MCP to deploy directly.**

- Railway is connected to GitHub via auto-deploy. Pushing to the correct GitHub repo IS the deployment.
- The Railway MCP is unreliable — do not use `mcp__Railway__deploy` or any Railway deploy tool.
- Every service has its own GitHub repo. Push to the right one:

| Service | GitHub repo | Railway auto-deploys from |
|---------|-------------|--------------------------|
| Frontend (tools + dashboard) | `github.com/bgzbgz/show-time` (branch: `main`) | `frontend/` directory |
| Backend | `github.com/bgzbgz/show-time` (branch: `main`) | `backend/` directory |
| Admin panel | `github.com/bgzbgz/admin-panel-tools` (branch: `main`) | root |
| Guru modal | `github.com/bgzbgz/guru-modal` (branch: `main`) | root |

- When a change affects both the main repo and the admin/guru repo, push to BOTH.
- Never `--force` push to `main`.
