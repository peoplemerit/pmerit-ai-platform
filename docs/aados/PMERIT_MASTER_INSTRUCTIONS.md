# 🔐 PMERIT MASTER INSTRUCTIONS

**Purpose:** Standalone coordination document for Claude Web and Claude Code Desktop
**Version:** 2.0
**Updated:** 2025-12-05
**Author:** @peoplemerit (Tier 1 Admin)

---

## 🎯 PROJECT IDENTITY

This is the **PMERIT AI Educational Platform** project.

| Resource | URL/Path |
|----------|----------|
| **Production** | https://pmerit.com |
| **API** | https://pmerit-api-worker.peoplemerit.workers.dev |
| **Frontend Repo** | https://github.com/peoplemerit/pmerit-ai-platform |
| **Backend Repo** | https://github.com/peoplemerit/pmerit-api-worker |
| **Local Frontend** | `E:\pmerit\pmerit-ai-platform` |
| **Local Backend** | `E:\pmerit\pmerit-api-worker` |

---

## 📚 PRIMARY PROJECT DOCUMENTS (What to Build)

**Claude MUST reference these before making implementation decisions:**

| Document | Location | Purpose |
|----------|----------|---------|
| **Pmerit Project Document** | `docs/project/Pmerit_Project_Document.md` | Master roadmap & strategic overview |
| **Brainstorm ASU-Like Schema** | `docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md` | Feature specs, schema design, implementation flow |
| **User & Admin Journey** | `docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md` | User flows & admin journey narratives |

### Brainstorm Part → AADOS Phase Mapping

| Brainstorm Part | AADOS Phase |
|-----------------|-------------|
| PART 0: Front Page Shell | HOMEPAGE GATE |
| PART 1-5: User Journey | Phases 0-6 |
| PART 6-8: Platform & Admin | Phases 7-10 |
| PART 9: AADOS Integration | Governance alignment |
| PART 10: UI Design System | Design standardization |

⚠️ **CRITICAL RULE:** Before modifying ANY functionality, Claude must:
1. Check if the change aligns with **Brainstorm ASU-Like Schema**
2. Verify against **User & Admin Journey**
3. If uncertain → ASK Solo Developer before proceeding
4. Never assume — always verify against project documents

---

## 🔧 GOVERNANCE FILES (How to Work)

All governance files are in `docs/aados/`:

| File | Purpose |
|------|---------|
| `GOVERNANCE.md` | Rules, phases, workflows |
| `TASK_TRACKER.md` | Living status, attempts |
| `STATE.json` | Current state pointer (machine-readable) |
| `ENVIRONMENTS.md` | Environment definitions (FE, BE, DB, TR) |
| `PMERIT_MASTER_INSTRUCTIONS.md` | This file — coordination rules |
| `PMERIT_OPERATIONAL_CHEAT_SHEET.md` | Quick reference |

**Claude MUST read these files before starting any work.**

---

## 🌐 ENVIRONMENT MAP

| ID | Name | Local Path | When to Use |
|----|------|------------|-------------|
| `FE` | Frontend | `E:\pmerit\pmerit-ai-platform` | UI, styling, client JS, docs |
| `BE` | Backend | `E:\pmerit\pmerit-api-worker` | API endpoints, AI personas, TTS |
| `DB` | Database | Neon Dashboard | Schema changes, data migrations |
| `TR` | Translation | Azure Portal | Translation API config |

See `docs/aados/ENVIRONMENTS.md` for complete specifications.

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
| **ENV: FE** | Switch focus to Frontend |
| **ENV: BE** | Switch focus to Backend |
| **ENV: BOTH** | Coordinate both repositories |
| **CODE DESKTOP UNAVAILABLE** | Switch to Fallback Two-Way workflow |
| **CODE DESKTOP AVAILABLE** | Switch to Standard Three-Way workflow |

---

## 🚀 SESSION STARTUP

### Using PowerShell Script (Recommended)

```powershell
# From E:\pmerit\pmerit-ai-platform
.\Start-PmeritSession.ps1
```

This script will:
1. ✅ Check Frontend repo sync status
2. ✅ Check Backend repo sync status
3. ✅ Display current state from `STATE.json`
4. ✅ Prompt: "Say PMERIT CONTINUE to your AI assistant"

### Manual Sync Check

```bash
git fetch origin && git status
```

**Expected if in sync:** `"Your branch is up to date with 'origin/main'."`

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

Before proceeding, please run:
.\Start-PmeritSession.ps1

Or manually:
    git fetch origin
    git status

⛔ Cannot proceed until sync is verified.

→ Say "PMERIT SYNC CONFIRMED" when ready.
```

### Sync Gate Responses

| Status | User Says | Claude Action |
|--------|-----------|---------------|
| ✅ Up to date | "PMERIT SYNC CONFIRMED" | Proceed with work |
| ❌ Behind | (paste output) | Instruct user to `git pull origin main` |
| ⚠️ Diverged | (paste output) | Help resolve conflicts |
| 🚫 Uncommitted changes | (paste output) | Instruct user to commit or stash |

---

## 📂 FILE ACCESS PROTOCOL

### For Claude Code Desktop

**Direct Repository Access:**
```
Read from: E:\pmerit\pmerit-ai-platform\docs\aados\
Update directly: E:\pmerit\pmerit-ai-platform\docs\aados\TASK_TRACKER.md
```

### For Claude Web

**Priority 1: GitHub Sync in Project Knowledge**
```
Search for: "GOVERNANCE" or "TASK_TRACKER" in project knowledge
```

**Priority 2: Request Direct Upload**
```
If GitHub sync is unavailable, request user upload:
- docs/aados/GOVERNANCE.md
- docs/aados/TASK_TRACKER.md
- docs/aados/STATE.json
```

---

## 📋 DOCUMENT HIERARCHY (Priority Order)

1. **Brainstorm ASU-Like Schema** — Feature specifications (WHAT to build)
2. **User & Admin Journey** — User flow definitions
3. **TASK_TRACKER.md** — Living status (WHERE we are)
4. **GOVERNANCE.md** — Rules and workflows (HOW to work)
5. **Pmerit Project Document** — Strategic overview (WHY)

**If documents conflict:** Solo Developer (@peoplemerit) has final say.

---

## 🔄 AUTO-CONTINUITY BEHAVIOR

### When "PMERIT CONTINUE" is Received

**Claude (Web or Code Desktop) MUST:**

1. **Immediately recognize** this is the PMERIT AI Educational Platform project
2. **Check Sync Gate** — Request sync verification before proceeding
3. **Read** STATE.json and TASK_TRACKER.md for current phase and status
4. **Identify** the last incomplete requirement or task
5. **Reference** appropriate section in Brainstorm document
6. **State** the current phase, status, and next action
7. **Begin work** without asking for additional context

### Auto-Continuity Response Template

```
🔄 PMERIT AUTO-CONTINUITY ACTIVATED

🔒 Sync Gate: [Pending verification / Confirmed]
📍 Current Phase: [From STATE.json: current_phase]
📊 Phase Status: [From STATE.json: phase_status]
🎯 Active Requirement: [From STATE.json: active_requirement]
🔢 Attempt: [From STATE.json: attempt_count/max_attempts]
⚡ Workflow Mode: [From STATE.json: workflow_mode]

📚 Reference Docs:
- Feature Spec: docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md (PART X)
- User Flow: docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md

Next Action:
[Specific task from TASK_TRACKER.md]

→ [Instructions for user]
```

---

## ⚖️ CONFLICT RESOLUTION

### When Workflow vs. Implementation Contradict

**When Claude detects a contradiction:**

```
⚠️ WORKFLOW vs. IMPLEMENTATION CONFLICT DETECTED

Document says: [What governance/brainstorm specifies]
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

---

## 🛡️ GUARDRAILS

### What Claude MUST Always Do

1. ✅ Run `.\Start-PmeritSession.ps1` or verify sync before any work
2. ✅ Read TASK_TRACKER.md and STATE.json for current state
3. ✅ Reference primary project documents before implementation decisions
4. ✅ Follow phase-gated progression (no skipping without approval)
5. ✅ Escalate after 3 attempts (or 5 if extended)
6. ✅ Flag workflow vs. implementation contradictions
7. ✅ Wait for "DONE" before proceeding to next step
8. ✅ Document decisions and changes

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

## ✅ VERIFICATION CHECKLIST

### For Claude Code Desktop Session Start
```
□ Run .\Start-PmeritSession.ps1
□ Repository path accessible: E:\pmerit\pmerit-ai-platform
□ Sync Gate verified?
□ STATE.json read from docs/aados/?
□ TASK_TRACKER.md read from docs/aados/?
□ Primary project documents accessible?
□ Ready to proceed with "PMERIT CONTINUE"
```

### For Claude Web Session Start
```
□ GitHub sync accessible in Project Knowledge?
□ If not, request direct file upload
□ Sync Gate verified?
□ STATE.json current state loaded?
□ TASK_TRACKER.md loaded?
□ Workflow mode confirmed (Standard/Fallback)?
□ Ready to proceed with "PMERIT CONTINUE"
```

---

## 📝 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-11-29 | Initial creation |
| 2.0 | 2025-12-05 | Consolidated to 3 primary project documents; Added Start-PmeritSession.ps1 integration; Updated file paths to docs/aados/; Removed obsolete document references |

---

*This document is the authoritative source for Claude coordination.*
*Both Claude Web and Claude Code Desktop must follow these instructions.*
*Solo Developer (@peoplemerit) has final decision authority on all conflicts.*
