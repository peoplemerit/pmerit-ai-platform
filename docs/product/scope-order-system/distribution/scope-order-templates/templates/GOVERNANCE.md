# [PROJECT] — Governance & Workflow Rules

**Version:** 1.0
**Updated:** [DATE]

---

## QUICK COMMANDS

| Command | Effect |
|---------|--------|
| `[PROJECT] CONTINUE` | Full startup: governance + scopes + audit + resume |
| `[PROJECT] STATUS` | Quick health check + state (no work) |
| `AUDIT SCOPE: [name]` | Claude Code audits reality |
| `SCOPE UPDATED: [name]` | Claude Code implements specs |
| `SCOPE: [name]` | Load scope context |
| `SCOPE: MASTER` | Load full project vision |
| `ENV: FE` | Switch to Frontend |
| `ENV: BE` | Switch to Backend |
| `DONE` | Confirm step complete |

---

## SCOPE ORDER SYSTEM v2

### What is Scope Order?

A hierarchical documentation system that enables focused context loading with **Reality-First** workflow.

### File Structure

```
.claude/scopes/
├── MASTER_SCOPE.md          ← Full project vision
├── SCOPE_[FEATURE1].md      ← Feature 1 scope
├── SCOPE_[FEATURE2].md      ← Feature 2 scope
└── ...
```

### Scope File States

| State | Contents | Created By |
|-------|----------|------------|
| **EMPTY** | Just the file name | Director |
| **AUDITED** | AUDIT_REPORT section | Claude Code |
| **SPECIFIED** | HANDOFF_DOCUMENT section | Claude Web |
| **IMPLEMENTED** | RESEARCH_FINDINGS section | Claude Code |

### v2 Workflow (Reality-First)

```
1. DIRECTOR: Create empty SCOPE_[NAME].md → commit
2. CLAUDE CODE: "AUDIT SCOPE: [NAME]" → reality report
3. DIRECTOR → CLAUDE WEB: Share audit report
4. CLAUDE WEB + DIRECTOR: Brainstorm based on facts
5. CLAUDE WEB: Update scope with HANDOFF_DOCUMENT
6. DIRECTOR → CLAUDE CODE: "SCOPE UPDATED: [NAME]"
7. CLAUDE CODE: Review, recommend, implement
8. CLAUDE CODE: Update RESEARCH_FINDINGS
9. REPEAT
```

### Benefits

| Challenge | Solution |
|-----------|----------|
| Outdated specs | Reality check before planning |
| Context overload | Load only active scope |
| Session continuity gaps | RESEARCH_FINDINGS persists |
| Implementation drift | Locked architectural decisions |
| Cross-feature dependencies | Explicit DEPENDENCIES section |

---

## THREE-WAY TEAM ROLES

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ CLAUDE WEB  │◄────►│  DIRECTOR   │◄────►│ CLAUDE CODE │
│ (Architect) │      │    (You)    │      │(Implementer)│
└─────────────┘      └─────────────┘      └─────────────┘
```

| Role | Responsibilities |
|------|------------------|
| **Claude Web** | Strategy, brainstorming, specifications, documentation |
| **Director** | Decisions, git operations, coordination, approvals |
| **Claude Code** | Audits, implementation, quality review, scope updates |

---

## SESSION STARTUP PROTOCOL

### Step 1: Read Governance Files

```
docs/aados/STATE.json       ← Current state
docs/aados/TASK_TRACKER.md  ← Task status
docs/aados/GOVERNANCE.md    ← This file
```

### Step 2: Check Active Scope

From STATE.json → `scope_order.active_scope`

### Step 3: Verify Git Sync

```bash
git fetch origin && git status
```

### Step 4: Output Status

```
🔄 SESSION ACTIVATED — Session [#]

🔒 Sync Gate: [Pending/Confirmed]
📍 Current Phase: [From STATE.json]
📂 Active Scope: [From STATE.json or "None"]

⏭️ Next Action: [Based on state]
```

---

## WORKFLOW RULES

1. **One command at a time** — Wait for "DONE"
2. **Reality first** — Audit before specifying
3. **Escalate after 3 failed attempts**
4. **Document decisions** in scope files
5. **Update RESEARCH_FINDINGS** after every implementation
6. **Never skip the startup protocol**

---

## FILE RESPONSIBILITIES

| File | Updated By | When |
|------|------------|------|
| STATE.json | Claude Code | Session start/end |
| TASK_TRACKER.md | Claude Code | Task completion |
| SCOPE_*.md | Both | Per workflow step |
| MASTER_SCOPE.md | Director + Claude Web | Major changes |

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
