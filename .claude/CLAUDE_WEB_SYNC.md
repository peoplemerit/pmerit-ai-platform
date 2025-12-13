# CLAUDE WEB PROJECT INSTRUCTIONS (Synced Copy)

**Purpose:** This file mirrors Claude Web's project instructions so Claude Code has visibility into what the Architect role sees.
**Last Synced:** 2025-12-12
**Sync Method:** Manual copy from Claude Web project settings

---

# 🔐 PMERIT PLATFORM — MISSION INSTRUCTIONS

## 🎯 Project Identity
This is the **PMERIT AI Educational Platform** project.
- **Production:** https://pmerit.com
- **API:** https://pmerit-api-worker.peoplemerit.workers.dev
- **Repository (Frontend):** https://github.com/peoplemerit/pmerit-ai-platform
- **Repository (Backend):** https://github.com/peoplemerit/pmerit-api-worker
- **Local Path (Frontend):** E:\pmerit\pmerit-ai-platform
- **Local Path (Backend):** E:\pmerit\pmerit-api-worker

---

## 📚 PRIMARY PROJECT DOCUMENTS (What to Build)

**Claude MUST reference these before making implementation decisions:**

| Document | Location | Purpose |
|----------|----------|---------|
| **Pmerit Project Document** | `docs/project/Pmerit_Project_Document.md` | Master roadmap & strategic overview |
| **Brainstorm ASU-Like Schema** | `docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md` | Feature specs, schema design, implementation flow |
| **User & Admin Journey** | `docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md` | User flows & admin journey narratives |

### Brainstorm Part → Phase Mapping
| Part | Phase |
|------|-------|
| PART 0: Front Page Shell | HOMEPAGE GATE |
| PART 1-5: User Journey | Phases 0-6 |
| PART 6-8: Platform & Admin | Phases 7-10 |
| PART 9: AADOS Integration | Governance |
| PART 10: UI Design System | Design standardization |

---

## 🔧 GOVERNANCE FILES (How to Work)

All governance files are in `docs/aados/`:

| File | Purpose |
|------|---------|
| `GOVERNANCE.md` | Rules, phases, workflows |
| `TASK_TRACKER.md` | Living status, attempts |
| `STATE.json` | Current state pointer (machine-readable) |
| `ENVIRONMENTS.md` | Environment definitions (FE, BE, DB, TR) |
| `PMERIT_MASTER_INSTRUCTIONS.md` | Full coordination rules |
| `PMERIT_OPERATIONAL_CHEAT_SHEET.md` | Quick reference |

**Claude MUST read these files before starting any work.**

---

## 🌐 Environment Map

| ID | Name | Local Path | When to Use |
|----|------|------------|-------------|
| `FE` | Frontend | `E:\pmerit\pmerit-ai-platform` | UI, styling, client JS, docs |
| `BE` | Backend | `E:\pmerit\pmerit-api-worker` | API endpoints, AI personas, TTS |
| `DB` | Database | Neon Dashboard | Schema changes, data migrations |
| `TR` | Translation | Azure Portal | Translation API config |

---

## 🔑 Quick Commands

| Command | Action |
|---------|--------|
| **PMERIT CONTINUE** | Read governance files → Resume from current phase |
| **PMERIT STATUS** | Show current state without working |
| **PMERIT SYNC CONFIRMED** | User confirms repos are synced |
| **PMERIT QUICK FIX: [desc]** | Light mode — skip full protocol for minor fixes |
| **EXTEND: [ID]** | Grant 2 more attempts (3→5) |
| **ENV: FE** | Switch focus to Frontend |
| **ENV: BE** | Switch focus to Backend |
| **ENV: BOTH** | Coordinate both repositories |
| **CODE DESKTOP UNAVAILABLE** | Switch to fallback mode |

---

## ⚡ Session Startup

### Using PowerShell Script (Recommended)

```powershell
# From E:\pmerit\pmerit-ai-platform
.\Start-PmeritSession.ps1
```

---

## 🔄 SYNC NOTES

### How to Update This File

1. Open Claude Web project settings
2. Copy the full "Set project instructions" content
3. Paste into this file (replacing everything below the header)
4. Update "Last Synced" date at top
5. Commit: `git commit -m "docs: Sync Claude Web instructions"`

### What Claude Code Does With This

- Reads this file to understand Claude Web's perspective
- Ensures alignment between Architect (Web) and Implementer (Code) roles
- References same documents and commands

### Differences Between Claude Web and Claude Code

| Aspect | Claude Web | Claude Code |
|--------|------------|-------------|
| File Access | Project Knowledge uploads | Direct filesystem |
| Code Execution | Provides commands | Executes directly |
| Web Access | Can browse (if enabled) | No web access |
| Role | Architect, strategist | Implementer, executor |
