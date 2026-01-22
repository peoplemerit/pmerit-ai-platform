# PMERIT Platform — Claude Code Instructions

**Version:** 5.0 (Unified Router Compatible)
**Updated:** 2026-01-19
**Status:** Active under AIXORD v3.0 governance (Foundation Protocol)

---

## ROUTING NOTE

This file is loaded AFTER the root router (`C:\dev\pmerit\CLAUDE.md`) detects `PMERIT CONTINUE` or `ENV: FE`. The root router has already:
- Read STATE.json
- Read SESSION_CONTEXT.md
- Checked kingdom status
- Reported state to Director

You should now follow the platform-specific instructions below.

---

## AIXORD AUTHORITY CONTRACT

This repository operates under **AIXORD v3.0** governance (Foundation Protocol).

| Resource | Location |
|----------|----------|
| **Governance Document** | `C:/dev/pmerit/AIXORD_ROOT/GOVERNANCE/AIXORD_GOVERNANCE_V3.0.md` |
| **State File** | `C:/dev/pmerit/AIXORD_ROOT/STATE/STATE.json` |
| **Session Context** | `C:/dev/pmerit/AIXORD_ROOT/CONTINUITY/SESSION_CONTEXT.md` |
| **SCOPEs** | `.claude/scopes/` |

### Kingdom Enforcement (from root router)

| Kingdom | Code | Allowed Actions |
|---------|------|-----------------|
| **IDEATION** | K:I | Research, analysis, file reading ONLY |
| **BLUEPRINT** | K:B | Review specs, validate feasibility ONLY |
| **REALIZATION** | K:R | Code modifications allowed with approval |

---

## REPOSITORY IDENTITY

| Field | Value |
|-------|-------|
| **Name** | pmerit-ai-platform |
| **Type** | Frontend |
| **Entity** | PMERIT FOUNDATION (501(c)(3)) |
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
+-- SCOPE_TEMPLATE_V2.1.md          <- Template for new SCOPEs
+-- SUB-SCOPE_TEMPLATE.md           <- Template for SUB-SCOPEs
+-- SCOPE_SECURITY/                 <- Decomposed SCOPE
|   +-- SCOPE_SECURITY.md
|   +-- SUB-SCOPE_AUTHENTICATION.md
|   +-- SUB-SCOPE_AUTHORIZATION.md
|   +-- SUB-SCOPE_DATA_PROTECTION.md
|   +-- SUB-SCOPE_COMPLIANCE.md
+-- SCOPE_PARENT_PORTAL/            <- Decomposed SCOPE
|   +-- SCOPE_PARENT_PORTAL.md
|   +-- SUB-SCOPE_COPPA_CONSENT.md
|   +-- SUB-SCOPE_PROGRESS_DASHBOARD.md
|   +-- SUB-SCOPE_CONTROLS.md
|   +-- SUB-SCOPE_NOTIFICATIONS.md
+-- SCOPE_K12_EDUCATION/            <- Pending decomposition
+-- SCOPE_DASHBOARD/                <- Pending decomposition
+-- [other SCOPE files]
```

---

## WORKFLOW RULES

1. **Authority is Explicit** — Always know if you're in DECISION or EXECUTION mode
2. **One Task at a Time** — Wait for `DONE` before proceeding
3. **Document Decisions** — All decisions logged in SCOPE files
4. **HALT on Ambiguity** — Return to Human if unclear
5. **Repo Sovereignty** — Backend SCOPEs live in `pmerit-api-worker/`
6. **Kingdom Compliance** — Respect K:I/K:B/K:R restrictions from root router

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
| Project Document | `AIXORD_ROOT/ARCHITECT/decisions/PMERIT_PROJECT_DOCUMENT.md` | Strategic overview |
| Blueprint | `AIXORD_ROOT/ARCHITECT/decisions/PMERIT_BLUEPRINT.md` | Architecture |
| Master Scope | `AIXORD_ROOT/ARCHITECT/decisions/PMERIT_MASTER_SCOPE.md` | Execution scope |
| Feature Specs | `docs/handoffs/` | Implementation specs |

---

*AIXORD v3.0 — Authority. Execution. Verification.*
*PMERIT FOUNDATION*
*Updated: 2026-01-19*
