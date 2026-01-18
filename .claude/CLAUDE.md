# PMERIT Platform — Claude Code Instructions

**Version:** 4.0 (AIXORD v2.1)
**Updated:** 2025-12-28
**Status:** Active under AIXORD v2.1 governance

---

## AIXORD AUTHORITY CONTRACT

This repository operates under **AIXORD v2.1** governance.

| Resource | Location |
|----------|----------|
| **Governance Document** | `C:/dev/pmerit/AIXORD_ROOT/GOVERNANCE/AIXORD_GOVERNANCE_V2.1.md` |
| **State File** | `C:/dev/pmerit/AIXORD_ROOT/STATE/STATE.json` |
| **SCOPEs** | `.claude/scopes/` |

### Startup Protocol

When you receive `PMERIT CONTINUE` or start any session:

1. **READ `AIXORD_ROOT/STATE/STATE.json` — Current state
2. **READ** `AIXORD_ROOT/CONTINUITY/SESSION_CONTEXT.md` — Prior session
3. **READ** `AIXORD_ROOT/GOVERNANCE_V2.1.md`
2. **READ** `AIXORD_ROOT/STATE/STATE.json`
3. **CHECK** halt status — if halted, report and wait
4. **LOAD** active SCOPE from state
5. **REPORT** current state to Human

### Response Format

```
🔄 PMERIT CONTINUITY — AIXORD v2.1

Mode: [DECISION | EXECUTION]
Halt: [None | Reason]
Active SCOPE: [From STATE.json]
SCOPE State: [SPECIFIED | IN_PROGRESS | COMPLETE]

Ready for directive.
```

---

## REPOSITORY IDENTITY

| Field | Value |
|-------|-------|
| **Name** | pmerit-ai-platform |
| **Type** | Frontend |
| **Purpose** | Platform UI, docs, admin portals |
| **SCOPE Location** | `.claude/scopes/` |

---

## COMMANDS

| Command | Action |
|---------|--------|
| `PMERIT CONTINUE` | Read governance → Resume from current SCOPE |
| `PMERIT STATUS` | Show state without working |
| `ENV: FE` | Confirm frontend context |
| `ENV: BE` | Switch to backend repo |
| `SCOPE: [name]` | Load specific SCOPE |
| `DONE` | User confirms step complete |

---

## SCOPES IN THIS REPOSITORY

### Active SCOPEs

| SCOPE | Status | Has SUB-SCOPEs |
|-------|--------|----------------|
| SCOPE_SECURITY | IN_PROGRESS | Yes (4 SUB-SCOPEs) |
| SCOPE_PARENT_PORTAL | IN_PROGRESS | Yes (4 SUB-SCOPEs) |
| SCOPE_K12_EDUCATION | SPECIFIED | Yes (3 SUB-SCOPEs) |
| SCOPE_DASHBOARD | IN_PROGRESS | Pending |
| SCOPE_ADMIN | COMPLETE | No |
| SCOPE_PROGRESS | PARTIAL | No |

### SCOPE File Structure

```
.claude/scopes/
├── SCOPE_TEMPLATE_V2.1.md          <- Template for new SCOPEs
├── SUB-SCOPE_TEMPLATE.md           <- Template for SUB-SCOPEs
├── SCOPE_SECURITY/                 <- Decomposed SCOPE
│   ├── SCOPE_SECURITY.md
│   ├── SUB-SCOPE_AUTHENTICATION.md
│   ├── SUB-SCOPE_AUTHORIZATION.md
│   ├── SUB-SCOPE_DATA_PROTECTION.md
│   └── SUB-SCOPE_COMPLIANCE.md
├── SCOPE_PARENT_PORTAL/            <- Decomposed SCOPE
│   ├── SCOPE_PARENT_PORTAL.md
│   ├── SUB-SCOPE_COPPA_CONSENT.md
│   ├── SUB-SCOPE_PROGRESS_DASHBOARD.md
│   ├── SUB-SCOPE_CONTROLS.md
│   └── SUB-SCOPE_NOTIFICATIONS.md
├── SCOPE_K12_EDUCATION/            <- Pending decomposition
├── SCOPE_DASHBOARD/                <- Pending decomposition
└── [other SCOPE files]
```

---

## WORKFLOW RULES

1. **Authority is Explicit** — Always know if you're in DECISION or EXECUTION mode
2. **One Task at a Time** — Wait for `DONE` before proceeding
3. **Document Decisions** — All decisions logged in SCOPE files
4. **HALT on Ambiguity** — Return to Human if unclear
5. **Repo Sovereignty** — Backend SCOPEs live in `pmerit-api-worker/`

---

## RELATED REPOSITORIES

| Repository | Purpose | CLAUDE.md |
|------------|---------|-----------|
| `pmerit-api-worker/` | Backend API | `CLAUDE.md` |
| `pmerit-technologies/` | Products | `.claude/CLAUDE.md` |

---

## PRIMARY PROJECT DOCUMENTS

| Document | Location | Purpose |
|----------|----------|---------|
| Master Roadmap | `docs/project/Pmerit_Project_Document.md` | Strategic overview |
| Feature Specs | `docs/handoffs/` | Implementation specs |
| User Journeys | `docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md` | User flows |

---

*AIXORD v2.1 — Authority. Execution. Confirmation. Genesis.*
*Updated: 2025-12-28*
