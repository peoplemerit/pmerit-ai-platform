# [PROJECT NAME] — Claude Code Instructions

**Version:** 1.0
**Updated:** [DATE]

---

## TEAM WORKFLOW

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ CLAUDE WEB  │◄────►│     YOU     │◄────►│ CLAUDE CODE │
│ (Architect) │      │ (Director)  │      │(Implementer)│
└─────────────┘      └─────────────┘      └─────────────┘
     │                     │                     │
     │ Strategy, prompts   │ Decisions, git      │ Code execution
     │ Brainstorming       │ Coordination        │ Quality review
     │ Documentation       │ Approvals           │ Scope updates
```

**Claude Web Instructions:** See `.claude/CLAUDE_WEB_SYNC.md`

---

## SCOPE ORDER v2: REALITY-FIRST WORKFLOW

### Workflow Steps

```
1. YOU: Create empty SCOPE_[NAME].md, commit to repo
2. CLAUDE CODE: Audit reality → populate AUDIT_REPORT section
3. YOU → CLAUDE WEB: Share audit report
4. CLAUDE WEB + YOU: Brainstorm, write requirements
5. CLAUDE WEB: Update SCOPE_[NAME].md with HANDOFF_DOCUMENT
6. YOU → CLAUDE CODE: "SCOPE UPDATED: [NAME]"
7. CLAUDE CODE: Review, recommend, implement → update RESEARCH_FINDINGS
8. REPEAT until complete
```

### Scope Commands

| Command | Action |
|---------|--------|
| `AUDIT SCOPE: [name]` | Audit reality, populate AUDIT_REPORT |
| `SCOPE UPDATED: [name]` | Read updated scope, review & implement |
| `SCOPE: [name]` | Load scope context |
| `SCOPE: MASTER` | Load full project vision |

### Scope Files Location

```
.claude/scopes/
├── MASTER_SCOPE.md      ← Project vision
├── SCOPE_[FEATURE].md   ← Per-feature specifications
└── ...
```

---

## MANDATORY STARTUP PROTOCOL

When starting a session, you MUST:

### STEP 1: READ GOVERNANCE FILES

```
docs/aados/STATE.json       ← Current state pointer
docs/aados/TASK_TRACKER.md  ← Living task status
docs/aados/GOVERNANCE.md    ← Workflow rules
```

### STEP 2: CHECK ACTIVE SCOPE

From STATE.json, check `scope_order.active_scope`. If set, read:
```
.claude/scopes/SCOPE_[name].md
```

### STEP 3: VERIFY GIT SYNC

```bash
git fetch origin && git status
```

Expected: `"Your branch is up to date with 'origin/main'."`

### STEP 4: OUTPUT STATUS RESPONSE

```
🔄 SESSION ACTIVATED — Session [#]

🔒 Sync Gate: [Pending/Confirmed]
📍 Current Phase: [From STATE.json]
📂 Active Scope: [From STATE.json or "None"]

⏭️ Next Action: [Based on current state]
```

---

## COMMANDS

| Command | Action |
|---------|--------|
| `[PROJECT] CONTINUE` | Full protocol: governance + scopes + resume |
| `[PROJECT] STATUS` | Quick health check + state (no work) |
| `SCOPE: [name]` | Load specific scope context |
| `ENV: FE` | Switch to Frontend |
| `ENV: BE` | Switch to Backend |
| `DONE` | User confirms step complete |

---

## DO NOT:

- ❌ Explore the codebase before reading governance files
- ❌ Ask "What would you like to do?" without reading STATE.json first
- ❌ Skip the startup protocol
- ❌ Proceed without sync verification
- ❌ Make changes without verifying against existing code first
- ❌ Forget to update scope's RESEARCH_FINDINGS after implementation

---

## QUALITY REVIEW RESPONSIBILITY

As the Implementer, I must:

1. **Review** specs from Claude Web before implementing
2. **Recommend** better alternatives if I find them
3. **Ask** for approval before proceeding with recommendations
4. **Implement** the approved solution
5. **Update** the scope's RESEARCH_FINDINGS with what I did
6. **Report** output for you to share with Claude Web

---

## WORKFLOW RULES

1. **One command at a time** — wait for "DONE"
2. **Escalate after 3 failed attempts**
3. **Document decisions** in project docs
4. **Update scope files** — After implementation, update RESEARCH_FINDINGS

---

## COMMIT MESSAGE FORMAT

```
[type]: [brief summary]

- [Change 1]
- [Change 2]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

*Scope Order System v2 — Reality-First Workflow*
