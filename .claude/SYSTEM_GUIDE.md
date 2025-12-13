# PMERIT Development System — Quick Reference Guide

**Version:** 1.0
**Created:** 2025-12-12
**Purpose:** Complete operational guide for the three-way workflow and Scope Order system

---

## Table of Contents

1. [Team Structure](#1-team-structure)
2. [Directory Layout](#2-directory-layout)
3. [Scope Order System](#3-scope-order-system)
4. [Three-Way Workflow](#4-three-way-workflow)
5. [Commands Reference](#5-commands-reference)
6. [File Sync Protocol](#6-file-sync-protocol)
7. [Session Lifecycle](#7-session-lifecycle)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Team Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PMERIT DEVELOPMENT TEAM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐              │
│  │  CLAUDE WEB  │◄────►│     YOU      │◄────►│ CLAUDE CODE  │              │
│  │  (Architect) │      │  (Director)  │      │ (Implementer)│              │
│  └──────────────┘      └──────────────┘      └──────────────┘              │
│                                                                              │
│  Responsibilities:                                                           │
│  ├── Claude Web: Strategy, prompts, brainstorming, documentation            │
│  ├── You: Decisions, coordination, approvals, git operations                │
│  └── Claude Code: Code execution, quality review, implementation            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Role Details

| Role | Tool | Capabilities | Responsibilities |
|------|------|--------------|------------------|
| **Architect** | Claude Web | Web access, Project Knowledge | Strategy, specs, follow-up prompts |
| **Director** | You | Full system access | Decisions, approvals, coordination |
| **Implementer** | Claude Code | File system, code execution | Implementation, quality review |

---

## 2. Directory Layout

```
E:\pmerit\                                    ← WORKSPACE ROOT
│
├── CLAUDE.md                                 ← Claude Code instructions (v3.0)
├── .claude\
│   └── CLAUDE.md                             ← Backup of instructions
│
├── pmerit-ai-platform\                       ← FRONTEND REPO (git)
│   ├── .claude\
│   │   ├── CLAUDE_WEB_SYNC.md                ← Mirror of Claude Web instructions
│   │   ├── SYSTEM_GUIDE.md                   ← THIS FILE
│   │   └── scopes\                           ← SCOPE ORDER SYSTEM
│   │       ├── MASTER_SCOPE.md               ← Project vision
│   │       ├── SCOPE_HOMEPAGE.md             ← H1-H10
│   │       ├── SCOPE_ASSESSMENT.md           ← P1-P2
│   │       ├── SCOPE_DASHBOARD.md            ← P3-P4
│   │       ├── SCOPE_CLASSROOM.md            ← P5
│   │       ├── SCOPE_AVATAR.md               ← Avatar system
│   │       ├── SCOPE_ENROLLMENT.md           ← Enrollment
│   │       ├── SCOPE_ADMIN.md                ← P7-P10
│   │       └── SCOPE_CREDENTIALS.md          ← ARCH-2/3
│   │
│   ├── docs\
│   │   ├── aados\                            ← GOVERNANCE
│   │   │   ├── STATE.json                    ← Current state (machine-readable)
│   │   │   ├── TASK_TRACKER.md               ← Living status
│   │   │   ├── GOVERNANCE.md                 ← Workflow rules (v6)
│   │   │   └── PRODUCTION_AUDIT_*.md         ← Audit reports
│   │   ├── project\
│   │   │   ├── Pmerit_Project_Document.md    ← Master roadmap
│   │   │   └── PMERIT_ARCHITECTURE_FINAL.md  ← Architecture spec
│   │   └── handoffs\
│   │       ├── BRAINSTORM_ASU_LIKE_SCHEMA.md ← Feature specs
│   │       ├── PMERIT_HANDOFF_SESSION_*.md   ← Session handoffs
│   │       └── archive\                      ← Archived handoffs
│   │
│   ├── portal\                               ← Portal pages
│   └── assets\                               ← CSS, JS, images
│
└── pmerit-api-worker\                        ← BACKEND REPO (git)
    └── src\
        └── routes\                           ← API endpoints
```

---

## 3. Scope Order System

### What It Is

A hierarchical documentation system that provides focused context for each feature area.

### Scope Structure

Each scope file contains:

```markdown
# PMERIT SUB-SCOPE: [Feature Name]

## 1. SCOPE IDENTITY
- Files, APIs, database tables for this feature

## 2. ARCHITECTURAL DECISIONS (LOCKED)
- Final decisions that cannot change without approval

## 3. FEATURE SPECIFICATION
<HANDOFF_DOCUMENT>
- Complete requirements and acceptance criteria
</HANDOFF_DOCUMENT>

## 4. IMPLEMENTATION STATUS
<RESEARCH_FINDINGS>
- What's been built, session-by-session notes
- Updated after each implementation session
</RESEARCH_FINDINGS>

## 5. DEPENDENCIES
- What this scope requires and enables

## 6. VERIFICATION CHECKLIST
- Acceptance criteria with status
```

### Current Scopes

| Scope | Status | Phase |
|-------|--------|-------|
| SCOPE_HOMEPAGE | Complete | Gate (H1-H10) |
| SCOPE_ASSESSMENT | Complete | P1-P2 |
| SCOPE_DASHBOARD | Complete | P3-P4 |
| SCOPE_CLASSROOM | Complete | P5 |
| SCOPE_AVATAR | Complete | Integrated |
| SCOPE_ENROLLMENT | Complete | Integrated |
| SCOPE_ADMIN | Not Started | P7-P10 |
| SCOPE_CREDENTIALS | Not Started | ARCH-2/3 |

### Scope Commands

| Command | Effect |
|---------|--------|
| `SCOPE: CLASSROOM` | Claude Code loads classroom context |
| `SCOPE: ASSESSMENT` | Claude Code loads assessment context |
| `SCOPE: MASTER` | Claude Code loads full project vision |
| `SCOPE: [name]` | Claude Code loads specified scope |

---

## 4. Three-Way Workflow

### Complete Cycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WORKFLOW CYCLE                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: PLANNING                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Claude Web + You                                                      │   │
│  │ • Brainstorm feature requirements                                     │   │
│  │ • Define specifications                                               │   │
│  │ • Create implementation prompt                                        │   │
│  │ OUTPUT: Feature spec with acceptance criteria                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  PHASE 2: HANDOFF                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ You → Claude Code                                                     │   │
│  │ • "SCOPE: [feature]" to load context                                  │   │
│  │ • Paste specification from Claude Web                                 │   │
│  │ • Request implementation                                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  PHASE 3: REVIEW                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Claude Code                                                           │   │
│  │ • Reads scope file for context                                        │   │
│  │ • Reviews spec against existing architecture                          │   │
│  │ • Identifies better alternatives (if any)                             │   │
│  │ • Presents recommendations                                            │   │
│  │ OUTPUT: "Proceed with spec" or "Recommend alternative: [reason]"      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  PHASE 4: APPROVAL                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ You                                                                   │   │
│  │ • "Use your recommendations, proceed" OR                              │   │
│  │ • "Let me check with Claude Web first" OR                             │   │
│  │ • "Stick with original spec"                                          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  PHASE 5: IMPLEMENTATION                                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Claude Code                                                           │   │
│  │ • Implements approved solution                                        │   │
│  │ • Updates scope's RESEARCH_FINDINGS                                   │   │
│  │ • Commits changes (if requested)                                      │   │
│  │ OUTPUT: Implementation summary with files changed                     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  PHASE 6: FEEDBACK                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ You → Claude Web                                                      │   │
│  │ • Share Claude Code's implementation summary                          │   │
│  │ • Claude Web reviews and provides follow-up                           │   │
│  │ OUTPUT: Next iteration prompt or approval                             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  REPEAT until feature complete                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Example Interaction

```
YOU → CLAUDE WEB:
"I want to add a bookmark feature to the classroom."

CLAUDE WEB:
"Here's the specification:
- Store bookmarks in localStorage
- Sync to API when online
- Show bookmark icon on lessons
- [acceptance criteria]

Send this to Claude Code: [prompt]"

YOU → CLAUDE CODE:
"SCOPE: CLASSROOM
Here's the bookmark feature spec: [paste]"

CLAUDE CODE:
"I've reviewed the spec. Recommendation:
Use IndexedDB instead of localStorage for better
offline support. Proceed with this change?"

YOU:
"Good idea. Proceed."

CLAUDE CODE:
[Implements feature]
[Updates SCOPE_CLASSROOM.md RESEARCH_FINDINGS]
"Complete. Summary: [details]"

YOU → CLAUDE WEB:
"Bookmark feature done. Here's the output: [paste]"

CLAUDE WEB:
"Looks good. Next: Add bookmark sync indicator..."
```

---

## 5. Commands Reference

### Session Commands

| Command | When to Use | Effect |
|---------|-------------|--------|
| `PMERIT CONTINUE` | Start of session | Full startup protocol |
| `PMERIT STATUS` | Quick check | Show state without working |
| `PMERIT QUICK FIX: [desc]` | Minor fixes | Skip audit, fast mode |
| `PMERIT SYNC CONFIRMED` | After git pull | Confirm repos synced |
| `PMERIT CLEANUP HANDOFFS` | Maintenance | Archive old handoffs |

### Scope Commands

| Command | Effect |
|---------|--------|
| `SCOPE: CLASSROOM` | Load classroom context |
| `SCOPE: ASSESSMENT` | Load assessment context |
| `SCOPE: DASHBOARD` | Load dashboard context |
| `SCOPE: AVATAR` | Load avatar context |
| `SCOPE: HOMEPAGE` | Load homepage context |
| `SCOPE: ENROLLMENT` | Load enrollment context |
| `SCOPE: ADMIN` | Load admin context |
| `SCOPE: CREDENTIALS` | Load credentials context |
| `SCOPE: MASTER` | Load full project vision |

### Environment Commands

| Command | Effect |
|---------|--------|
| `ENV: FE` | Switch to Frontend repo |
| `ENV: BE` | Switch to Backend repo |
| `ENV: BOTH` | Coordinate both repos |

### Workflow Commands

| Command | Effect |
|---------|--------|
| `DONE` | Confirm step complete |
| `EXTEND: [ID]` | Grant 2 more attempts (3→5) |
| `ESCALATE` | Force escalation |

---

## 6. File Sync Protocol

### Claude Web → Claude Code Sync

When Claude Web's project instructions change:

```bash
# 1. Copy content from Claude Web project settings
# 2. Paste into this file:
pmerit-ai-platform/.claude/CLAUDE_WEB_SYNC.md

# 3. Update "Last Synced" date at top of file

# 4. Commit
cd E:\pmerit\pmerit-ai-platform
git add .claude/CLAUDE_WEB_SYNC.md
git commit -m "docs: Sync Claude Web instructions"
git push origin main
```

### Scope Updates After Implementation

After Claude Code implements a feature:

```markdown
# In the relevant SCOPE_*.md file, update:

## 4. IMPLEMENTATION STATUS

<RESEARCH_FINDINGS>

### Session [#] (YYYY-MM-DD)

**Completed:**
- [What was done]

**Files Modified:**
- [List of files]

**Commits:** [commit hashes]

**Notes:**
- [Any important findings]

</RESEARCH_FINDINGS>
```

### STATE.json Updates

Claude Code updates after each session:

```json
{
  "session_number": [INCREMENT],
  "last_updated": "[ISO TIMESTAMP]",
  "scope_order": {
    "active_scope": "[Current scope or null]"
  }
}
```

---

## 7. Session Lifecycle

### Starting a Session

```
1. Say "PMERIT CONTINUE"

2. Claude Code reads:
   ├── docs/aados/STATE.json
   ├── docs/aados/TASK_TRACKER.md
   ├── docs/aados/GOVERNANCE.md
   ├── .claude/scopes/[active_scope].md (if set)
   └── Latest handoff

3. Claude Code runs production audit:
   ├── Homepage check
   ├── API health check
   ├── Key endpoints test
   └── Reports findings

4. Claude Code outputs Auto-Continuity response

5. Work begins
```

### During a Session

```
For each task:
1. Load relevant scope: "SCOPE: [name]"
2. Review spec from Claude Web
3. Recommend alternatives if better
4. Get approval
5. Implement
6. Update scope's RESEARCH_FINDINGS
7. Report output
```

### Ending a Session

```
1. Ensure all scope files updated
2. Commit changes:
   git add .
   git commit -m "[type]: [summary]"
   git push origin main

3. Create handoff if needed:
   docs/handoffs/PMERIT_HANDOFF_SESSION_[#].md

4. Update STATE.json with session number
```

---

## 8. Troubleshooting

### "Context not loaded correctly"

**Solution:** Explicitly load scope
```
SCOPE: [feature name]
```

### "Claude Code doesn't know about recent changes"

**Solution:** Sync was missed
```bash
cd E:\pmerit\pmerit-ai-platform
git pull origin main
```
Then say `PMERIT SYNC CONFIRMED`

### "Scope file outdated"

**Solution:** Update RESEARCH_FINDINGS after implementation

### "Claude Web and Claude Code have different understanding"

**Solution:** Update CLAUDE_WEB_SYNC.md
1. Copy Claude Web project instructions
2. Paste into `.claude/CLAUDE_WEB_SYNC.md`
3. Commit and push

### "Don't know which scope to use"

**Reference:**

| Feature Area | Scope |
|--------------|-------|
| Homepage, chatbox, AI receptionist | SCOPE_HOMEPAGE |
| Career assessment, Big Five, RIASEC | SCOPE_ASSESSMENT |
| Login, signup, account, dashboard | SCOPE_DASHBOARD |
| Classroom, lessons, AI tutor | SCOPE_CLASSROOM |
| Avatar, lip sync, 3D rendering | SCOPE_AVATAR |
| Courses, pathways, enrollment | SCOPE_ENROLLMENT |
| Admin portal, user management | SCOPE_ADMIN |
| Blockchain, credentials, wallet | SCOPE_CREDENTIALS |

### "Need full project context"

**Solution:** Load master scope
```
SCOPE: MASTER
```

---

## Quick Start Checklist

### New Session
- [ ] Say `PMERIT CONTINUE`
- [ ] Wait for Auto-Continuity response
- [ ] Confirm git sync if prompted
- [ ] Load relevant scope: `SCOPE: [name]`

### Implementation Task
- [ ] Load scope context
- [ ] Review Claude Web spec
- [ ] Get approval for approach
- [ ] Implement
- [ ] Update scope RESEARCH_FINDINGS
- [ ] Commit changes

### End of Session
- [ ] All changes committed
- [ ] Scope files updated
- [ ] Handoff created (if major work)
- [ ] STATE.json updated

---

*Quick Reference Guide v1.0*
*Created: 2025-12-12*
*For: PMERIT Three-Way Development Workflow*
