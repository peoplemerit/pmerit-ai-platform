# PMERIT Platform — Claude Code Desktop Instructions

## MANDATORY STARTUP PROTOCOL

When you receive "PMERIT CONTINUE" or start any session, you MUST:

1. **FIRST** — Read these governance files (in order):
   - `pmerit-ai-platform/docs/aados/STATE.json`
   - `pmerit-ai-platform/docs/aados/TASK_TRACKER.md`
   - `pmerit-ai-platform/docs/aados/GOVERNANCE.md`

2. **THEN** — Output the Auto-Continuity Response:
```
   🔄 PMERIT AUTO-CONTINUITY ACTIVATED
   
   🔒 Sync Gate: [Pending/Confirmed]
   📍 Current Phase: [From STATE.json]
   📊 Phase Status: [From STATE.json]
   🎯 Active Requirement: [From STATE.json]
   🔢 Attempt: [From STATE.json]
   ⚡ Workflow Mode: [From STATE.json]
   
   📚 Reference Docs:
   - Feature Spec: docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md
   - User Flow: docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md
   
   Next Action: [From TASK_TRACKER.md]
```

3. **ONLY THEN** — Begin work on the current task

## DO NOT:
- ❌ Explore the codebase before reading governance files
- ❌ Ask "What would you like to do?" without reading STATE.json first
- ❌ Skip the Auto-Continuity response
- ❌ Proceed without sync verification

## PRIMARY PROJECT DOCUMENTS

Before making implementation decisions, reference:

| Document | Location | Purpose |
|----------|----------|---------|
| Master Roadmap | `pmerit-ai-platform/docs/project/Pmerit_Project_Document.md` | Strategic overview, decisions |
| Feature Specs | `pmerit-ai-platform/docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md` | Schema, implementation |
| User Journeys | `pmerit-ai-platform/docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md` | User flows |

## ENVIRONMENTS

| ID | Path | Purpose |
|----|------|---------|
| FE | `./pmerit-ai-platform` | Frontend, UI, docs |
| BE | `./pmerit-api-worker` | Backend API, AI personas |

## COMMANDS

| Command | Action |
|---------|--------|
| `PMERIT CONTINUE` | Read governance → Resume from current phase |
| `PMERIT STATUS` | Show state without working |
| `PMERIT SYNC CONFIRMED` | User confirms repos synced |
| `ENV: FE` | Switch to Frontend |
| `ENV: BE` | Switch to Backend |
| `DONE` | User confirms step complete |

## WORKFLOW RULES

1. One command at a time — wait for "DONE"
2. Escalate after 3 failed attempts
3. Backend changes require `ENV: BE` acknowledgment
4. Never skip Homepage Gate
5. Document decisions in `Pmerit_Project_Document.md`