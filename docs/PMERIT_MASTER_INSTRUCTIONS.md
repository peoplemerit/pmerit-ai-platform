# 🔐 PMERIT MASTER INSTRUCTIONS

**Purpose:** Standalone coordination document for Claude Web and Claude Code Desktop  
**Version:** 1.0  
**Created:** 2024-11-29  
**Author:** @peoplemerit (Tier 1 Admin)  

---

## 🎯 DOCUMENT PURPOSE

This document serves as the **single source of coordination** between:
- **Claude Web** (claude.ai)
- **Claude Code Desktop** (local execution)
- **Solo Developer** (@peoplemerit)

Both Claude environments MUST read and follow these instructions.

---

## 📍 FILE LOCATIONS (Source of Truth)

### GitHub Repository (Authoritative)
```
Repository: https://github.com/peoplemerit/pmerit-ai-platform
Branch: main
```

### Governance Files
| File | Path | Purpose |
|------|------|---------|
| Master Instructions | `docs/PMERIT_MASTER_INSTRUCTIONS.md` | This file — coordination rules |
| Governance | `docs/GOVERNANCE.md` | Detailed rules, phases, workflows |
| Task Tracker | `docs/TASK_TRACKER.md` | Living status, current phase, attempts |
| Handoffs | `docs/handoffs/SESSION_X.md` | Session snapshots |

### Local Repository
```
Path: E:\pmerit\pmerit-ai-platform
```

### Production Site
```
URL: https://pmerit.com
```

---

## ⚡ QUICK COMMANDS

| Command | Effect |
|---------|--------|
| **PMERIT CONTINUE** | Full auto-continuity — resume from current phase/requirement |
| **PMERIT STATUS** | Show current state without starting work |
| **PMERIT SYNC CONFIRMED** | User confirms local/remote repos are in sync |
| **PMERIT QUICK FIX: [desc]** | Light mode — skip full protocol for minor fixes |
| **PMERIT ESCALATED** | Show all escalated issues needing alternatives |
| **PMERIT PHASES** | Show phase progression map |
| **EXTEND: [ID]** | Grant 2 more attempts (3→5) for a requirement |
| **PHASE SKIP: [#]** | Emergency skip (requires justification) |
| **CODE DESKTOP UNAVAILABLE** | Switch to Fallback Two-Way workflow |
| **CODE DESKTOP AVAILABLE** | Switch to Standard Three-Way workflow |

---

## 🚦 WORKFLOW PRIORITY

### Default: Start with Claude Code Desktop

**When Claude Code Desktop is available:**
```
Solo Developer → Claude Web (Analyze & Plan) → Claude Code Desktop (Execute) → Output → Claude Web (Review)
```

**Claude Code Desktop is preferred because it can:**
- Read files directly from repository
- Update TASK_TRACKER.md directly
- Execute code and commands
- Commit changes to git

### Fallback: Claude Web Only

**When Claude Code Desktop is unavailable:**
```
User says: "CODE DESKTOP UNAVAILABLE"

Claude Web Response:
"Acknowledged. Switching to Fallback Two-Way workflow.
I will provide commands for you to execute manually.
Say 'CODE DESKTOP AVAILABLE' when service is restored."
```

**In Fallback mode, Claude Web will:**
- Provide all commands for manual execution
- Wait for user to confirm each step with "DONE"
- Request user to update TASK_TRACKER.md manually
- Provide file contents for user to copy/paste

---

## 🔒 MANDATORY SYNC GATE

### Before ANY Work Begins

**Claude MUST request sync verification:**

```
🔒 SYNC GATE CHECK REQUIRED

Before proceeding, please verify sync status:

STEP 1: Open terminal in E:\pmerit\pmerit-ai-platform

STEP 2: Run these commands:
    git fetch origin
    git status

STEP 3: Report the output.

Expected if in sync:
    "Your branch is up to date with 'origin/main'."

⛔ Cannot proceed until sync is verified.

→ Paste output, or say "PMERIT SYNC CONFIRMED" if already verified.
```

### Sync Gate Responses

| Status | User Says | Claude Action |
|--------|-----------|---------------|
| ✅ Up to date | "PMERIT SYNC CONFIRMED" | Proceed with work |
| ❌ Behind | (paste output) | Instruct user to `git pull origin main` |
| ⚠️ Diverged | (paste output) | Help resolve conflicts |
| 🚫 Uncommitted changes | (paste output) | Instruct user to commit or stash |

### Bypass (Emergency Only)

Sync gate can ONLY be bypassed if:
1. GitHub is down (verified)
2. Network is unavailable
3. User explicitly approves with reason

Document any bypass in TASK_TRACKER.md.

---

## 📂 FILE ACCESS PROTOCOL

### For Claude Web

**Priority 1: GitHub Sync in Project Knowledge**
```
Claude Web should first attempt to access governance files through 
the GitHub sync connection in Project Knowledge.

Search for: "GOVERNANCE" or "TASK_TRACKER" in project knowledge
```

**Priority 2: Request Direct Upload**
```
If GitHub sync is unavailable or outdated, Claude Web should say:

"I cannot access the latest governance files through GitHub sync.
Please either:
1. Click 'Sync now' on the GitHub connection in Project Knowledge, OR
2. Upload the latest files directly:
   - docs/GOVERNANCE.md
   - docs/TASK_TRACKER.md
   
From: E:\pmerit\pmerit-ai-platform\docs\"
```

**Priority 3: Use Cached Version**
```
If user confirms files haven't changed, Claude Web may proceed 
with previously loaded content, noting:

"Using cached governance files from [date]. 
Please confirm these are still current."
```

### For Claude Code Desktop

**Direct Repository Access:**
```
Read from: E:\pmerit\pmerit-ai-platform\docs\GOVERNANCE.md
Read from: E:\pmerit\pmerit-ai-platform\docs\TASK_TRACKER.md

Update directly: E:\pmerit\pmerit-ai-platform\docs\TASK_TRACKER.md
```

---

## ⚖️ CONFLICT RESOLUTION & DECISION AUTHORITY

### When Workflow vs. Implementation Contradict

The governance documents describe an **ideal workflow**, but the **actual production implementation** at pmerit.com may differ.

**When Claude detects a contradiction:**

```
⚠️ WORKFLOW vs. IMPLEMENTATION CONFLICT DETECTED

Document says: [What governance/narrative specifies]
Production shows: [What actually exists on pmerit.com]

Options:
A) Follow document (modify implementation)
B) Follow implementation (update document)
C) Hybrid approach: [Suggested compromise]

⏸️ AWAITING YOUR DECISION

Please reply with A, B, C, or your own approach.
Your decision will be documented in TASK_TRACKER.md.
```

### Decision Authority

| Decision Type | Authority |
|---------------|-----------|
| Workflow contradictions | **Solo Developer (final say)** |
| Technical approach | Claude recommends, Solo Developer approves |
| Phase progression | Governed by gates (no skip without justification) |
| Escalation timing | Automatic at 3 attempts (extendable to 5) |
| Emergency bypasses | Solo Developer only |

### Decision Documentation

All conflict resolutions must be recorded:

```markdown
### Decision Log Entry

**Date:** [Date]
**Conflict:** [Brief description]
**Document Said:** [X]
**Implementation Had:** [Y]
**Decision:** [A/B/C/Custom]
**Rationale:** [Why this choice]
**Action Taken:** [What was done]
**Decided By:** @peoplemerit
```

---

## 🔄 AUTO-CONTINUITY BEHAVIOR

### When "PMERIT CONTINUE" is Received

**Claude (Web or Code Desktop) MUST:**

1. **Immediately recognize** this is the PMERIT AI Educational Platform project
2. **Check Sync Gate** — Request sync verification before proceeding
3. **Read** TASK_TRACKER.md for current phase and status
4. **Identify** the last incomplete requirement or task
5. **State** the current phase, status, and next action
6. **Begin work** without asking for additional context

### Auto-Continuity Response Template

```
🔄 PMERIT AUTO-CONTINUITY ACTIVATED

🔒 Sync Gate: [Pending verification / Confirmed]
📍 Current Phase: [HOMEPAGE GATE / Phase X]
📊 Phase Status: [In Progress / Blocked / Complete]
🎯 Active Requirement: [ID — Description]
🔢 Attempt: [X/3 or X/5]
⚡ Workflow Mode: [Standard Three-Way / Fallback Two-Way]

Next Action:
[Specific task or command]

→ [Instructions for user]
```

---

## 📡 COMMUNICATION PROTOCOL

### Switching Workflow Modes

**User → Claude Web:**
```
"CODE DESKTOP UNAVAILABLE" → Switch to Fallback mode
"CODE DESKTOP AVAILABLE" → Switch to Standard mode
```

**Claude Web → User (when Code Desktop needed but unavailable):**
```
"This task would benefit from Claude Code Desktop for direct execution.
Current mode: Fallback Two-Way

Would you like to:
A) Proceed with manual execution (I provide commands)
B) Wait until Claude Code Desktop is available
C) Attempt a simpler approach that doesn't require Code Desktop"
```

### Status Updates Between Claudes

Since Claude Web and Claude Code Desktop don't communicate directly, synchronization happens through:

1. **TASK_TRACKER.md** — Updated by Code Desktop, read by both
2. **Git commits** — Changes pushed to GitHub
3. **User relay** — User copies relevant info between sessions

---

## 🛡️ GUARDRAILS

### What Claude MUST Always Do

1. ✅ Check Sync Gate before any work
2. ✅ Read TASK_TRACKER.md for current state
3. ✅ Follow phase-gated progression (no skipping without approval)
4. ✅ Escalate after 3 attempts (or 5 if extended)
5. ✅ Flag workflow vs. implementation contradictions
6. ✅ Wait for "DONE" before proceeding to next step
7. ✅ Document decisions and changes
8. ✅ Request file access if GitHub sync unavailable

### What Claude MUST NOT Do

1. ❌ Proceed without sync verification
2. ❌ Skip Homepage Gate (NEVER skippable)
3. ❌ Make decisions on conflicts without user approval
4. ❌ Assume files are current without verification
5. ❌ Chain multiple commands without confirmation
6. ❌ Continue past 3 attempts without escalating or extending

---

## 📋 SESSION HANDOFF TRIGGERS

### Create Handoff Document When:

- ✅ Phase completed
- ✅ 30-50 messages exchanged
- ✅ Before starting new phase
- ✅ After escalation (3 or 5 attempts exhausted)
- ✅ After 2-3 hours of work
- ✅ User requests it
- ✅ Token usage approaching limit

### Handoff Location

```
Path: docs/handoffs/SESSION_[XX].md
```

### Handoff Must Include:

- Current phase and requirement status
- What was completed this session
- What's next
- Any escalated issues
- Any decisions made
- Files modified
- Commits made

---

## 🔗 REFERENCE DOCUMENTS

| Document | Location | Purpose |
|----------|----------|---------|
| GOVERNANCE.md | `docs/GOVERNANCE.md` | Full rules, phases, all details |
| TASK_TRACKER.md | `docs/TASK_TRACKER.md` | Living status, attempt tracking |
| Narrative Journey | Project Knowledge | User/Admin journey specifications |
| Session Handoffs | `docs/handoffs/` | Point-in-time snapshots |

---

## ✅ VERIFICATION CHECKLIST

### For Claude Web Session Start
```
□ GitHub sync accessible in Project Knowledge?
□ If not, request direct file upload
□ Sync Gate verified?
□ TASK_TRACKER.md current state loaded?
□ Workflow mode confirmed (Standard/Fallback)?
□ Ready to proceed with "PMERIT CONTINUE"
```

### For Claude Code Desktop Session Start
```
□ Repository path accessible: E:\pmerit\pmerit-ai-platform
□ Sync Gate verified (git fetch + git status)?
□ TASK_TRACKER.md read from docs/?
□ GOVERNANCE.md read from docs/?
□ Ready to proceed with "PMERIT CONTINUE"
```

---

## 📝 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-11-29 | Initial creation |

---

*This document is the authoritative source for Claude coordination.*  
*Both Claude Web and Claude Code Desktop must follow these instructions.*  
*Solo Developer (@peoplemerit) has final decision authority on all conflicts.*
