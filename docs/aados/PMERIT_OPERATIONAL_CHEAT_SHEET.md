# 📋 PMERIT OPERATIONAL CHEAT SHEET

**Quick Reference for Solo Developer (@peoplemerit)**  
**Version:** 2.0 | **Date:** 2024-11-30

---

## 🚀 STARTING A SESSION

### Single Repository (Frontend Only)
| Step | Action | Command |
|------|--------|---------|
| 1 | Open PowerShell | — |
| 2 | Navigate to repo | `cd E:\pmerit\pmerit-ai-platform` |
| 3 | Fetch remote | `git fetch origin` |
| 4 | Check sync | `git status` |
| 5 | If behind, pull | `git pull origin main` |
| 6 | Open Claude | Web or Code Desktop |
| 7 | Start work | Say **"PMERIT CONTINUE"** |

### Both Repositories (Full-Stack Work)
```powershell
# Frontend
cd E:\pmerit\pmerit-ai-platform
git fetch origin && git status

# Backend
cd E:\pmerit\pmerit-api-worker
git fetch origin && git status
```

---

## ⚡ QUICK COMMANDS

| Command | What Claude Does |
|---------|------------------|
| `PMERIT CONTINUE` | Reads governance files → Resumes from current task |
| `PMERIT STATUS` | Shows current phase/task without starting work |
| `PMERIT SYNC CONFIRMED` | Confirms you've verified git sync |
| `PMERIT QUICK FIX: [desc]` | Light mode — bypasses full protocol for minor fixes |
| `PMERIT ESCALATED` | Shows all escalated issues needing alternatives |
| `PMERIT PHASES` | Shows phase progression map |
| `CODE DESKTOP UNAVAILABLE` | Switches Claude Web to fallback mode |
| `CODE DESKTOP AVAILABLE` | Switches back to standard workflow |
| `EXTEND: [task ID]` | Grants 2 more attempts (3→5) |
| `PHASE SKIP: [#]` | Emergency skip (requires justification) |
| `DONE` | Confirms step complete → Claude proceeds |

### Environment Commands
| Command | Effect |
|---------|--------|
| `ENV: FE` | Switch focus to Frontend repository |
| `ENV: BE` | Switch focus to Backend repository |
| `ENV: BOTH` | Coordinate both repositories |

---

## 🌐 ENVIRONMENT MAP

| ID | Name | Local Path | Production URL |
|----|------|------------|----------------|
| `FE` | Frontend | `E:\pmerit\pmerit-ai-platform` | https://pmerit.com |
| `BE` | Backend | `E:\pmerit\pmerit-api-worker` | https://pmerit-api-worker.peoplemerit.workers.dev |
| `DB` | Database | Neon Dashboard | — |
| `TR` | Translation | Azure Portal | https://api.cognitive.microsofttranslator.com |

---

## 📂 KEY FILE LOCATIONS

### Governance Files (All in Frontend Repo)
| File | Path |
|------|------|
| Environments | `docs/aados/ENVIRONMENTS.md` |
| State | `docs/aados/STATE.json` |
| Governance | `docs/aados/GOVERNANCE.md` |
| Task Tracker | `docs/aados/TASK_TRACKER.md` |
| Master Instructions | `docs/aados/PMERIT_MASTER_INSTRUCTIONS.md` |
| Cheat Sheet | `docs/aados/PMERIT_OPERATIONAL_CHEAT_SHEET.md` |
| Handoffs | `docs/handoffs/SESSION_X.md` |

### GitHub Repos
```
Frontend: github.com/peoplemerit/pmerit-ai-platform
Backend:  github.com/peoplemerit/pmerit-api-worker
```

---

## 🔄 WORKFLOW MODES

### Standard Three-Way (Default)
```
You → Claude Web (Plan) → Claude Code Desktop (Execute) → Output → You
```
**Use when:** Claude Code Desktop is available

### Fallback Two-Way
```
You → Claude Web (Plan + Provide Commands) → You (Execute Manually)
```
**Use when:** Claude Code Desktop is unavailable  
**Activate:** Say `CODE DESKTOP UNAVAILABLE`

---

## 🔒 SYNC GATE (Every Session)

### Single Repo Sync
```powershell
cd E:\pmerit\pmerit-ai-platform
git fetch origin
git status
```

### Multi-Repo Sync (Full-Stack)
```powershell
# Check both repos
cd E:\pmerit\pmerit-ai-platform && git fetch origin && git status
cd E:\pmerit\pmerit-api-worker && git fetch origin && git status
```

### Sync Status Responses

| Git Output | Status | Your Action |
|------------|--------|-------------|
| "Your branch is up to date" | ✅ Synced | Say `PMERIT SYNC CONFIRMED` |
| "Your branch is behind" | ❌ Behind | Run `git pull origin main` |
| "Your branch has diverged" | ⚠️ Conflict | See Conflict Resolution below |
| "Changes not staged" | 🚫 Dirty | Commit or stash first |

---

## ⚠️ GIT CONFLICT RESOLUTION

### When Branch Has Diverged

**Option A: Keep Remote Changes (Recommended)**
```powershell
git stash                    # Save your local changes
git pull origin main         # Get remote changes
git stash pop                # Reapply your changes
# Manually resolve any conflicts in files
git add .
git commit -m "Merge: resolve conflicts"
git push origin main
```

**Option B: Force Local (Use with Caution)**
```powershell
git push origin main --force
```
⚠️ Only use if you're certain your local is correct!

### When You Have Uncommitted Changes

**Option A: Commit First**
```powershell
git add .
git commit -m "WIP: [description]"
git pull origin main
git push origin main
```

**Option B: Stash Temporarily**
```powershell
git stash                    # Save changes
git pull origin main         # Update
git stash pop                # Restore changes
```

### View Conflict Details
```powershell
git diff                     # See what changed
git log --oneline -10        # See recent commits
git status                   # See current state
```

---

## 📤 END OF SESSION

### Commit & Push (Single Repo)
```powershell
cd E:\pmerit\pmerit-ai-platform
git add .
git commit -m "Session X: [brief description]"
git push origin main
```

### Commit & Push (Both Repos)
```powershell
# Frontend
cd E:\pmerit\pmerit-ai-platform
git add .
git commit -m "Session X: [description]"
git push origin main

# Backend
cd E:\pmerit\pmerit-api-worker
git add .
git commit -m "Session X: [description]"
git push origin main
```

### Sync to Claude Web (if needed)
1. Go to Project Knowledge
2. Click "Sync now" on GitHub connection
3. Or upload updated files manually

---

## 🎯 CURRENT STATUS
```
📍 Phase: HOMEPAGE GATE
📊 Status: In Progress
🎯 Task: H7 — Google Translate functional
🔢 Attempt: 2/3 pending
⚡ Active Env: FE (Frontend)
```
*(Update this section as you progress)*

---

## 🚦 PHASE PROGRESSION
```
🏠 HOMEPAGE GATE ◄── CURRENT (Must complete first)
     │
     ▼ "HOMEPAGE GATE COMPLETE"
┌────┴────┐
│ Phase 0 │ AI Receptionist
└────┬────┘
     ▼
┌────┴────┐
│ Phase 1 │ Assessment Entry
└────┬────┘
     ▼
   ... (Phases 2-10)
```

---

## 🔧 BACKEND DEPLOYMENT

### Deploy Workers API
```powershell
cd E:\pmerit\pmerit-api-worker
npx wrangler deploy
```

### Check Worker Logs
```powershell
npx wrangler tail
```

---

## 🗄️ DATABASE ACCESS

### Neon PostgreSQL
- Access via Neon Dashboard
- Or query through API: `GET /api/v1/db/tables`

### Test Database Connection
```
curl https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/db/verify
```

---

## 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Claude doesn't recognize project | Say `PMERIT CONTINUE` |
| Claude asks for context | Say `PMERIT CONTINUE` — it reads governance files |
| Claude can't find files | Files moved to `docs/aados/` — update paths |
| Git push rejected | Run `git pull origin main` first, then push again |
| Stuck on task (3 attempts) | Say `EXTEND: [ID]` for 2 more, or let it escalate |
| Workflow ≠ Implementation | You decide — Claude will present options A/B/C |
| Code Desktop unavailable | Say `CODE DESKTOP UNAVAILABLE` to switch to fallback |
| Need backend changes | Say `ENV: BE` to switch focus |
| Full-stack task | Say `ENV: BOTH` to coordinate both repos |

---

## 📞 DECISION AUTHORITY

| Decision Type | Who Decides |
|---------------|-------------|
| Workflow vs. Implementation conflicts | **You (final say)** |
| Technical approach | Claude recommends, you approve |
| Phase progression | Governed by gates |
| Escalation | Automatic at 3 attempts |
| Emergency bypasses | You only |
| Environment selection | Claude detects, you confirm |

---

## 🔑 REMEMBER

1. ✅ Always sync before starting (`git fetch` + `git status`)
2. ✅ Say `PMERIT CONTINUE` to start any session
3. ✅ Say `DONE` after completing each step
4. ✅ You have final say on all conflicts
5. ✅ Backend changes go to `pmerit-api-worker` repo
6. ✅ Governance files now in `docs/aados/`
7. ❌ Never skip Homepage Gate
8. ❌ Never proceed without sync verification

---

*Keep this cheat sheet handy during development sessions!*