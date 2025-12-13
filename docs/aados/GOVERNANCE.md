# 📑 PMERIT Platform — Canonical Audit & Handoff Governance V7

**Version:** 7.0
**Updated:** 2025-12-13
**New:** Scope Order v2 — Reality-First Workflow

---

## 📂 SCOPE ORDER v2: REALITY-FIRST WORKFLOW

### Key Improvement

Claude Code audits production reality FIRST, then Claude Web writes specs based on facts. This prevents outdated specs and avoids rework.

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

### Scope Files Location

```
.claude/scopes/
├── MASTER_SCOPE.md          ← Full project vision (consolidated)
├── SCOPE_HOMEPAGE.md        ← Homepage gate (H1-H10)
├── SCOPE_ASSESSMENT.md      ← Assessment flow (P1-P2)
├── SCOPE_DASHBOARD.md       ← Dashboard & auth (P3-P4)
├── SCOPE_CLASSROOM.md       ← Virtual classroom (P5)
├── SCOPE_AVATAR.md          ← Avatar system
├── SCOPE_ENROLLMENT.md      ← Course enrollment
├── SCOPE_TTS.md             ← TTS system
├── SCOPE_ADMIN.md           ← Admin portal (P7-P10)
└── SCOPE_CREDENTIALS.md     ← Blockchain credentials (ARCH-2/3)
```

### Scope File States

| State | Contents | Created By |
|-------|----------|------------|
| **Empty** | Just the file name | You (Director) |
| **Audited** | AUDIT_REPORT section | Claude Code |
| **Specified** | HANDOFF_DOCUMENT section | Claude Web |
| **Implemented** | RESEARCH_FINDINGS section | Claude Code |

### Sub-Scope Structure (After Full Cycle)

| Section | Purpose |
|---------|---------|
| **SCOPE IDENTITY** | Files, APIs, tables for this feature |
| **ARCHITECTURAL DECISIONS (LOCKED)** | Final decisions — no changes without approval |
| **AUDIT_REPORT** | What Claude Code found (reality check) |
| **HANDOFF_DOCUMENT** | Requirements from Claude Web |
| **RESEARCH_FINDINGS** | Implementation notes, session history |
| **DEPENDENCIES** | What this scope requires/enables |
| **VERIFICATION CHECKLIST** | Acceptance criteria |

### Scope Commands

| Command | Effect |
|---------|--------|
| **AUDIT SCOPE: [name]** | Claude Code audits reality, populates AUDIT_REPORT |
| **SCOPE UPDATED: [name]** | Claude Code reads updated scope, reviews & implements |
| **SCOPE: [name]** | Load specified scope context |
| **SCOPE: MASTER** | Load full project vision |

### Three-Way Workflow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ CLAUDE WEB  │◄────►│     YOU     │◄────►│ CLAUDE CODE │
│ (Architect) │      │ (Director)  │      │(Implementer)│
└─────────────┘      └─────────────┘      └─────────────┘
     │                     │                     │
     │ Strategy, specs     │ Decisions, git      │ Reality audit
     │ Brainstorming       │ Coordination        │ Quality review
     │ Requirements        │ Approvals           │ Implementation
     │                     │                     │
     └─────────────────────┴─────────────────────┘
                         │
                         ▼
              Scope files maintain context
```

### When to Use Scopes

| Scenario | Action |
|----------|--------|
| New feature | Create empty scope, `AUDIT SCOPE: [name]` |
| After audit | Share report with Claude Web |
| After Claude Web updates | `SCOPE UPDATED: [name]` |
| After implementation | Update RESEARCH_FINDINGS |
| Need full picture | `SCOPE: MASTER` for project vision |

---

## 🔑 AUTO-CONTINUITY SYSTEM

### Magic Keywords

| Keyword | Effect |
|---------|--------|
| **PMERIT CONTINUE** | Full auto-continuity — resume from current phase/requirement |
| **PMERIT STATUS** | Show current state without starting work |
| **PMERIT QUICK FIX: [description]** | Light mode — skip full protocol for minor fixes |
| **PMERIT PHASES** | Show phase progression map |
| **PMERIT ESCALATED** | Show all escalated issues needing alternatives |
| **SCOPE: [name]** | Load specific scope context (NEW) |

### Auto-Continuity Behavior

When Claude (Web or Code Desktop) receives **"PMERIT CONTINUE"**:

1. **Immediately recognize** this is the PMERIT AI Educational Platform project
2. **Read** TASK_TRACKER.md for current phase and status
3. **Identify** the last incomplete requirement or task
4. **Resume work** from exactly where the previous session left off
5. **State** the current phase, status, and next action
6. **Begin work** without asking for additional context

### Auto-Continuity Response Template

```
🔄 PMERIT AUTO-CONTINUITY ACTIVATED

📍 Current Phase: [Phase Name]
📊 Phase Status: [In Progress / Blocked / etc.]
🎯 Next Requirement: [ID and description]
🔢 Attempt: [X/3 or X/5 if extended]
⚡ Workflow Mode: [Standard / Fallback / Direct]

Resuming from: [Last known state]

[Immediately provide the next actionable step]
```

### What Claude Should NOT Do

❌ Ask "What would you like to work on?"  
❌ Ask "Can you provide context?"  
❌ Ask "Where did we leave off?"  
❌ Summarize the entire project history  
❌ Wait for additional instructions before starting

---

## 🩺 PRODUCTION AUDIT INTEGRATION

### Automatic Audit on Session Start

Every `PMERIT CONTINUE` command triggers an automatic production audit:

1. **Homepage Check** — Verify pmerit.com loads correctly
2. **API Health** — Verify backend Worker is healthy (v2.1.1+)
3. **Key Endpoints** — Test pathways, courses, AI chat
4. **Document Update** — Update production snapshot in master doc

### Audit Endpoints

| Check | Endpoint | Expected |
|-------|----------|----------|
| Homepage | https://pmerit.com | HTML with chatbox |
| API Health | https://pmerit-api-worker.peoplemerit.workers.dev/ | `{"status":"healthy"}` |
| Pathways | /api/v1/pathways | Array of 14 items |
| Courses | /api/v1/courses | Array of courses |
| AI Chat | POST /api/v1/ai/chat | Streaming response |
| Assessment | POST /api/v1/assessment/submit | 200 or structured error |

### Audit Output

- Full report: `docs/aados/PRODUCTION_AUDIT_YYYY-MM-DD.md`
- Quick status: Included in Auto-Continuity response
- Snapshot: Updated in `docs/project/Pmerit_Project_Document.md`

### Audit Frequency

| Trigger | Audit Type |
|---------|------------|
| `PMERIT CONTINUE` | Full audit + document updates |
| `PMERIT STATUS` | Quick health check only |
| `PMERIT QUICK FIX` | Skip audit (minor fixes only) |

### Documents Updated After Audit

1. **PRODUCTION_AUDIT_[DATE].md** — Full audit with H1-H10 status
2. **Pmerit_Project_Document.md** — "Production Status Snapshot" section
3. **STATE.json** — session_number, production_health, blockers
4. **TASK_TRACKER.md** — Resumption point with audit summary

### Enhanced Auto-Continuity Response

```
🔄 PMERIT AUTO-CONTINUITY ACTIVATED — Session [#]

🔒 Sync Gate: [Pending/Confirmed]
📍 Current Phase: [From STATE.json]
📊 Phase Status: [From STATE.json]
🎯 Active Requirement: [From STATE.json]
🔢 Attempt: [From STATE.json]
⚡ Workflow Mode: [From STATE.json]

🩺 PRODUCTION AUDIT (Quick Check)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
| Component      | Status | Notes                    |
|----------------|--------|--------------------------|
| Frontend       | ✅/⚠️/❌ | [brief]                  |
| Backend API    | ✅/⚠️/❌ | [version]                |
| AI Services    | ✅/⚠️/❌ | [binding status]         |
| Assessment     | ✅/⚠️/❌ | [pipeline status]        |
| Homepage Gate  | X/10   | [count verified]         |

📊 Changes Since Last Session:
- [Any detected changes]
- [New issues or resolved items]

📚 Reference Docs:
- Feature Spec: docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md
- User Flow: docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md
- Latest Audit: docs/aados/PRODUCTION_AUDIT_[DATE].md

⏭️ Next Action: [Based on audit findings and current phase]
```

---

## 📋 HANDOFF MANAGEMENT

### Automatic Handoff Reading

Every `PMERIT CONTINUE` command reads the latest handoff(s):

1. **Find Latest** — `ls -lt docs/handoffs/PMERIT_HANDOFF_*.md | head -3`
2. **Read Content** — Extract tasks, decisions, blockers
3. **Note Carryforward** — Items that affect current session
4. **Check for FINAL** — If `_FINAL.md` exists, it supersedes base version

### Information to Extract from Handoffs

| Item | Look For | Action |
|------|----------|--------|
| Incomplete Tasks | `[ ]` markers | Add to current session tasks |
| Key Decisions | "Decision:" or "Decided:" | Note for reference |
| Blockers | "Blocked:", "🚫" | Check if resolved |
| Carryforward | "Next Steps:", "Carryforward:" | Include in session plan |

### Handoff Cleanup Rules

| Age | Status | Action |
|-----|--------|--------|
| ≤ 3 sessions | Any | Keep |
| 4-5 sessions | Complete | Review for archive |
| > 5 sessions | Complete | Archive automatically |
| Any age | Incomplete | Keep until resolved |
| Superseded | Any | Archive (e.g., SESSION_28.md when SESSION_28_FINAL.md exists) |

### Files to Never Archive

- `BRAINSTORM_ASU_LIKE_SCHEMA.md` — Feature specification document
- Last 3 session handoffs — Recent context needed
- Any handoff with unresolved items

### Archive Location

```
docs/handoffs/archive/
```

### Cleanup Command

```
PMERIT CLEANUP HANDOFFS
```

Triggers manual review and cleanup:
1. Lists all handoffs with age (sessions since created)
2. Identifies archive candidates
3. Confirms with user before archiving
4. Moves to `docs/handoffs/archive/`
5. Commits changes

### Handoff Cleanup Process

```bash
# Step 1: Create archive directory if needed
mkdir -p docs/handoffs/archive/

# Step 2: Identify candidates (> 5 sessions old, complete)
# Current session: 30
# Archive if session ≤ 25 AND status = Complete

# Step 3: Check each candidate
# - Status: "Complete" or "✅ COMPLETE"
# - No [ ] items remaining
# - No "Blocked" status

# Step 4: Archive
mv docs/handoffs/PMERIT_HANDOFF_SESSION_XX.md docs/handoffs/archive/

# Step 5: Commit
git add docs/handoffs/
git commit -m "chore: Archive completed handoffs"
git push origin main
```

---

## 🌐 MULTI-ENVIRONMENT SUPPORT

### Environment Reference
See `docs/aados/ENVIRONMENTS.md` for full environment details.

### Quick Environment Map

| ID | Name | Local Path | When to Use |
|----|------|------------|-------------|
| `FE` | Frontend | `E:\pmerit\pmerit-ai-platform` | UI, styling, client JS, docs |
| `BE` | Backend | `E:\pmerit\pmerit-api-worker` | API endpoints, AI personas, TTS |
| `DB` | Database | Neon Dashboard | Schema changes, data migrations |
| `TR` | Translation | Azure Portal | Translation API config |

### Environment Detection

When a task is identified, Claude must determine which environment(s) are needed:

| Task Type | Environment | Action |
|-----------|-------------|--------|
| UI/styling changes | `FE` | Work in pmerit-ai-platform |
| API endpoint changes | `BE` | Work in pmerit-api-worker |
| Full-stack feature | `FE` + `BE` | Coordinate both repos |
| Database schema | `DB` | Provide SQL, user executes in Neon |

### Environment Switching Commands

| Command | Effect |
|---------|--------|
| `ENV: FE` | Switch focus to Frontend repository |
| `ENV: BE` | Switch focus to Backend repository |
| `ENV: BOTH` | Coordinate changes across both repositories |

### Multi-Repo Sync Gate

When working with multiple repositories, sync gate applies to ALL active repos:
```
🔒 MULTI-REPO SYNC GATE CHECK

Environment: FE + BE (Full-stack task)

Please verify sync for BOTH repositories:

FRONTEND:
  cd E:\pmerit\pmerit-ai-platform
  git fetch origin && git status

BACKEND:
  cd E:\pmerit\pmerit-api-worker
  git fetch origin && git status

⛔ Cannot proceed until both repos are verified in sync.
```

### Backend-First Rule

When a task requires both frontend and backend changes:
1. **Always implement backend (API) first**
2. **Test API endpoint independently**
3. **Then implement frontend to consume the API**
4. **Test end-to-end**

This prevents frontend code from calling non-existent endpoints.

---

## 🏃 LIGHT MODE (Quick Fixes)

### Purpose
For minor issues that don't require full phase protocol — typos, small CSS fixes, quick config changes.

### Trigger
```
PMERIT QUICK FIX: [description of minor issue]
```

### Light Mode Behavior

1. **Skip** phase gate verification
2. **Skip** full requirement checklist
3. **Implement** the fix directly
4. **Log** to task tracker under "Quick Fixes"
5. **Does NOT** affect phase progression or status

### Light Mode Constraints

- Fix must be completable in **1-3 steps**
- Must NOT break existing functionality
- Must NOT be a core phase requirement
- If fix becomes complex → **Escalate to full protocol**

### Light Mode Response Template

```
🏃 PMERIT LIGHT MODE — QUICK FIX

Issue: [description]
Approach: [brief solution]

[Single step or small code block]

→ Reply "DONE" when applied.
```

### When NOT to Use Light Mode

❌ Core phase requirements (H1-H10, P0.1-P10.6)  
❌ Issues requiring multiple file changes  
❌ Anything affecting user authentication  
❌ Database schema changes  
❌ API endpoint modifications  

---

## 🔁 THREE-ATTEMPT ESCALATION RULE (with EXTEND Option)

### Standard Flow (3 Attempts)

```
ATTEMPT 1: Initial Solution
    │
    ▼ Failed?
ATTEMPT 2: Alternative Approach
    │
    ▼ Failed?
ATTEMPT 3: Research + New Method
    │
    ▼ Failed?
    │
    ├──► ESCALATE (default) — Document and move on
    │
    └──► EXTEND (optional) — User grants 2 more attempts
              │
              ▼
         ATTEMPT 4: Fresh Perspective
              │
              ▼ Failed?
         ATTEMPT 5: Final Attempt
              │
              ▼ Failed?
         ⛔ MANDATORY ESCALATION — No further extensions
```

### EXTEND Option

**When to use:** User believes solution is close or issue is critical to phase completion.

**Trigger:**
```
EXTEND: [requirement ID]
Reason: [why more attempts are justified]
```

**Rules:**
- Grants **2 additional attempts** (total 5)
- Can only be used **once per requirement**
- After attempt 5, **mandatory escalation** — no further extensions
- Must document why extension was granted

### Escalation Documentation Template

```markdown
### ⚠️ ESCALATED: [Requirement ID] — [Brief Name]

**Phase:** [Current phase]
**Date:** [Date]
**Session:** [Session number]
**Extended:** [Yes/No]

#### Attempt 1: [Approach]
- Tried: [What]
- Result: [Outcome]
- Failed because: [Reason]

#### Attempt 2: [Approach]
- Tried: [What]
- Result: [Outcome]
- Failed because: [Reason]

#### Attempt 3: [Approach]
- Tried: [What]
- Result: [Outcome]
- Failed because: [Reason]

[If extended:]
#### Attempt 4: [Approach]
- Tried: [What]
- Result: [Outcome]
- Failed because: [Reason]

#### Attempt 5: [Approach]
- Tried: [What]
- Result: [Outcome]
- Failed because: [Reason]

#### Escalation Decision
- **Status:** ESCALATED
- **Suggested alternatives:**
  1. [External help option]
  2. [Different AI option]
  3. [Manual research option]
- **Revisit when:** [Condition]
- **Phase impact:** [Can continue? What's blocked?]
```

### Escalation Notification

```
⚠️ THREE-ATTEMPT ESCALATION TRIGGERED

Issue: [Brief description]
Attempts: [3/3 or 5/5] exhausted
Extended: [Yes/No]

Summary of attempts:
1. [Attempt 1 — why failed]
2. [Attempt 2 — why failed]
3. [Attempt 3 — why failed]
[4. Attempt 4 — if extended]
[5. Attempt 5 — if extended]

📋 Documented in TASK_TRACKER.md

Recommended alternatives:
- [ ] External developer help
- [ ] Try with ChatGPT / GitHub Copilot
- [ ] Stack Overflow research
- [ ] Revisit next session with fresh perspective

Moving to next requirement: [Next ID]

💡 To revisit later: "PMERIT REVISIT: [requirement ID]"
```

---

## 🚦 PHASE-GATED EXECUTION (with SKIP Option)

### Standard Phase Progression

Phases are **strictly sequential** by default:

```
🏠 HOMEPAGE GATE → Phase 0 → Phase 1 → ... → Phase 10
```

Each phase **MUST** be confirmed complete before the next unlocks.

### PHASE SKIP Option (Emergency Use Only)

**Purpose:** When a phase is blocked but a later phase has critical/easy work.

**Trigger:**
```
PHASE SKIP: [phase number to skip TO]
Current Phase: [current phase]
Reason: [why skip is necessary]
Risk: [what might break or be affected]
```

**Requirements:**
- User must provide explicit justification
- Claude must document risks
- Skipped phase remains "IN PROGRESS" (not complete)
- Return to skipped phase required before final delivery

### PHASE SKIP Rules

| Rule | Description |
|------|-------------|
| **Justification required** | Cannot skip without documented reason |
| **Risk acknowledgment** | Must state what could break |
| **Temporary only** | Must return to complete skipped phase |
| **Logged** | Recorded in task tracker with timestamp |
| **Max skip** | Cannot skip more than 2 phases ahead |
| **No Homepage skip** | Homepage Gate can NEVER be skipped |

### PHASE SKIP Response Template

```
⚠️ PHASE SKIP REQUESTED

From: Phase [X] — [Name]
To: Phase [Y] — [Name]
Reason: [User's justification]

Risk Assessment:
- [Risk 1]
- [Risk 2]
- [Dependency that may be missing]

⚠️ WARNING: Phase [X] remains incomplete. 
You MUST return to complete it before final delivery.

Proceeding to Phase [Y]...

[Begin Phase Y work]
```

---

## 🔄 THREE-WAY COLLABORATION WORKFLOW

### Participant Roles

| Participant | Role | Responsibilities |
|-------------|------|------------------|
| **Solo Developer** | Task Initiator & Executor | Present tasks; execute commands; confirm completion |
| **Claude Web** | Strategic Analyst & Coordinator | Analyze; plan; generate prompts; enforce gates |
| **Claude Code Desktop** | Implementation Engine | Execute code; update files; produce outputs |

### Workflow Modes

#### Mode 1: Standard Three-Way (Claude Code Desktop Available)

```
Solo Developer → Claude Web → [Prompt] → Claude Code Desktop → [Output] → Claude Web → Solo Developer
```

#### Mode 2: Fallback Two-Way (Claude Code Desktop Unavailable)

```
Solo Developer → Claude Web (Coordinator + Executor) → Solo Developer (Manual Execution)
```

#### Mode 3: Direct Execution (Claude Code Desktop Only)

```
Solo Developer → Claude Code Desktop (reads governance + tracker directly)
```

### Workflow Selection

| Condition | Mode |
|-----------|------|
| Claude Code Desktop available, complex task | Standard Three-Way |
| Claude Code Desktop unavailable | Fallback Two-Way |
| Simple task, Claude Code Desktop available | Direct Execution |
| Quick fix (any condition) | Light Mode |

---

## 🔗 UNIFIED INSTRUCTIONS (Claude Web & Claude Code Desktop)

### This Document Works For Both

| Capability | Claude Web | Claude Code Desktop |
|------------|------------|---------------------|
| Read governance | ✅ Project Knowledge | ✅ Repository file |
| Read task tracker | ✅ Project Knowledge | ✅ Repository file |
| Update task tracker | ❌ Provide updates for user | ✅ Direct edit |
| Execute code | ❌ Provide commands | ✅ Direct execution |
| Web search | ✅ If enabled | ❌ No web access |

### File Locations

| File | Claude Web | Claude Code Desktop |
|------|------------|---------------------|
| Governance | Project Knowledge | `/GOVERNANCE.md` |
| Task Tracker | Project Knowledge | `/TASK_TRACKER.md` |
| Handoffs | Project Knowledge | `/handoffs/SESSION_X.md` |

---

## 🔄 SYNCHRONIZATION CHECKLIST

### End of Session (Claude Code Desktop)

```
□ TASK_TRACKER.md updated with:
  □ Current phase status
  □ Completed requirements checked ✅
  □ Attempt counts updated
  □ Any escalations documented
  □ Session history entry added

□ Changes committed to repository

□ Note any files user needs to upload to Claude Web Project Knowledge
```

### Start of Session (Either Claude)

```
□ Say "PMERIT CONTINUE" to auto-load context
□ Verify task tracker matches expected state
□ Confirm workflow mode (Standard / Fallback / Direct)
□ Check for any escalated issues to revisit
```

### Sync Between Claude Web and Claude Code Desktop

```
After Claude Code Desktop session:
1. □ Download updated TASK_TRACKER.md from repository
2. □ Upload to Claude Web Project Knowledge (replace old version)
3. □ Download any new HANDOFF documents
4. □ Upload handoffs to Project Knowledge

Before Claude Web session:
1. □ Ensure Project Knowledge has latest TASK_TRACKER.md
2. □ Ensure Project Knowledge has latest GOVERNANCE.md (this file)
3. □ Say "PMERIT CONTINUE" to verify sync
```

---

## 🚨 HOMEPAGE PREREQUISITE GATE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      🏠 HOMEPAGE PREREQUISITE GATE                          │
│                                                                             │
│   ALL phases (0-10) are LOCKED until Homepage Gate is COMPLETE.             │
│   This gate can NEVER be skipped.                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Homepage Gate Requirements

| # | Requirement | Verification |
|---|-------------|--------------|
| H1 | Homepage loads without console errors | No errors in DevTools Console |
| H2 | Clean, non-scrollable design | Visual matches Google-style layout |
| H3 | AI chatbox centered and functional | Can send/receive messages |
| H4 | Left panel quick actions visible | Dashboard, Career Track, Virtual Human, Customer Service |
| H5 | Sign-Up modal triggers correctly | Click protected action → Modal appears |
| H6 | Customer Service Mode badge | AI responds with Receptionist badge |
| H7 | Azure Translator functional | Language selector works on ALL pages |
| H8 | Header/Footer display correctly | All navigation links work |
| H9 | Mobile responsive | Test at 375px width |
| H10 | No broken images/assets | Visual inspection passes |

### Completion Command
```
HOMEPAGE GATE COMPLETE
[Provide evidence: screenshots, console output, test confirmations]
```

---

## 🗺️ PHASE PROGRESSION MAP

```
🏠 HOMEPAGE GATE ◄─── YOU ARE HERE (if not complete)
   │
   │ "HOMEPAGE GATE COMPLETE"
   ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY ARC                                      │
└──────────────────────────────────────────────────────────────────────────────┘
   │
   ├─► PHASE 0: AI Receptionist
   │      Verify: Customer Service badge activates
   │
   ├─► PHASE 1: Assessment Entry
   │      Verify: Assessment page loads and starts
   │
   ├─► PHASE 2: Assessment Flow
   │      Verify: All stages complete, results generated
   │
   ├─► PHASE 3: Sign-Up & Onboarding
   │      Verify: Account created, dashboard accessible
   │
   ├─► PHASE 4: Dashboard & Courses
   │      Verify: Enrollment works, courses appear
   │
   ├─► PHASE 5: Virtual Classroom
   │      Verify: AI Tutor works, progress tracked
   │
   └─► PHASE 6: Job Matching
          Verify: Badge earned, recommendations appear
   
┌──────────────────────────────────────────────────────────────────────────────┐
│                        ADMIN JOURNEY ARC                                     │
└──────────────────────────────────────────────────────────────────────────────┘
   │
   ├─► PHASE 7: Tier 1 Admin Portal
   │      Verify: Admin login, full access
   │
   ├─► PHASE 8: Tier 2 Accounts
   │      Verify: Limited permissions enforced
   │
   ├─► PHASE 9: Curriculum Management
   │      Verify: Courses created, visible to students
   │
   └─► PHASE 10: Audit & Reports
          Verify: Logs visible, reports generate
          
🎉 PLATFORM COMPLETE
```

---

## 📋 QUICK COMMAND REFERENCE

| Command | Effect |
|---------|--------|
| **PMERIT CONTINUE** | Auto-resume from current state |
| **PMERIT STATUS** | Show status without starting work |
| **PMERIT QUICK FIX: [desc]** | Light mode for minor fixes |
| **PMERIT PHASES** | Show phase progression map |
| **PMERIT ESCALATED** | Show all escalated issues |
| **PMERIT REVISIT: [ID]** | Retry an escalated issue |
| **EXTEND: [ID]** | Grant 2 more attempts (max once per requirement) |
| **PHASE SKIP: [#]** | Skip to later phase (emergency only) |
| **HOMEPAGE GATE COMPLETE** | Unlock Phase 0 |
| **PHASE [X] COMPLETE** | Unlock Phase X+1 |
| **ESCALATE** | Force escalation of current issue |
| **DONE** | Confirm step completion |

---

## 🔑 CORE PRINCIPLES

1. **Auto-Continuity:** "PMERIT CONTINUE" instantly restores project context
2. **Phase-Gated:** No phase unlocks until previous is verified complete
3. **Homepage First:** Homepage Gate must complete before any journey phase
4. **Three-Attempt Rule:** Escalate after 3 failed attempts (extendable to 5 once)
5. **Light Mode:** Quick fixes bypass full protocol
6. **Skip Option:** Emergency phase skip with documented risks
7. **Unified Instructions:** Same governance for Claude Web and Code Desktop
8. **Single-Step Execution:** One command at a time, wait for "DONE"
9. **Sync Protocol:** Keep task tracker synchronized between tools
10. **Handoff Decisions Supersede:** Latest handoff overrides original documents

---

## 👤 DEVELOPER CONTEXT

| Factor | Reality |
|--------|---------|
| Team Size | Solo developer |
| Experience | Learning web development (AI-assisted) |
| AI Tools | Claude (primary), GitHub Copilot, ChatGPT |
| Scale Target | 3+ billion users globally |
| Timeline | 15-year roadmap |

---

## 📚 DOCUMENT HIERARCHY

### Priority Order (Highest to Lowest)

1. **Narrative User & Admin Journey** — Defines WHAT to build (user flows)
2. **Latest Handoff Document** — Current session decisions
3. **TASK_TRACKER.md** — Living status (always current)
4. **GOVERNANCE.md** (this file) — Rules and workflows (HOW to work)
5. **Original Ongoing Plan** — Project roadmap
6. **Unified Assessment Specs** — Assessment feature details
7. **Research & Brainstorm** — Ideas and notes

### 📚 PROJECT DOCUMENTS (Source of Truth for Features)

These documents in **Project Knowledge** define what the platform should do:

| Document | Purpose | When to Reference |
|----------|---------|-------------------|
| Narrative User & Admin Journey | User/Admin flow specifications | Before ANY feature work |
| Original Ongoing Plan | Project roadmap | For phase planning |
| Unified Assessment | Assessment specifications | For assessment features |
| Research & Brainstorm | Ideas and research | For new feature ideas |

⚠️ **CRITICAL:** Claude must verify changes align with these documents.
If implementation contradicts documentation → Flag for Solo Developer decision.

---

## ⚙️ MOSA COMPLIANCE

**Required for all components:**
- Modular, interoperable, auditable
- Strict separation: HTML, CSS, JS
- Shared components in `/partials/`
- Dynamic loading via `layout-loader.js`

---

## 🧩 SINGLE-STEP EXECUTION

```
STEP [#]: [Action] (Attempt [X/3 or X/5])

[Single command or code block]

Purpose: [Brief explanation]

→ Reply "DONE" to proceed.
```

---

## 📊 TOKEN & HANDOFF PROTOCOL

### Create Handoff When:
✅ Phase completed  
✅ 30-50 messages exchanged  
✅ Before new phase begins  
✅ After escalation (3 or 5 attempts failed)  
✅ 2-3 hours of work  

### Don't Create Handoff When:
❌ Mid-requirement  
❌ Active debugging (unless escalating)  

---

## ⚠️ CRITICAL REMINDERS

1. **"PMERIT CONTINUE"** = instant project recognition and resumption
2. **Homepage Gate** can NEVER be skipped
3. **3 attempts** default, extendable to **5 once** per requirement
4. **Escalate, don't spin** — document and move forward
5. **Sync task tracker** between Claude Web and Code Desktop
6. **Light Mode** for quick fixes only
7. **Phase Skip** requires justification and risk acknowledgment
8. **One step at a time** — wait for "DONE"

---

*Production: https://pmerit.com*
*Repository: github.com/peoplemerit/pmerit-ai-platform*
*Version: V7 — 2025-12-13 — Scope Order v2: Reality-First Workflow*
