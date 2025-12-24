# AIXORD — AI Execution Order Governance

**Version:** 12.0
**Updated:** 2025-12-24
**Session:** 77
**Formerly:** AADOS (Audit and Artifact Delivery & Orchestration System) V1-V11

> **AIXORD** (AI Execution Order): A structured, guardrailed instruction framework issued by an AI system to a human operator, requiring sequential execution and explicit confirmation.

---

## SECTION 1: SITUATION (System Context)

### 1.1 Project Identity

| Field | Value |
|-------|-------|
| **Platform** | PMERIT AI Educational Platform |
| **Mission** | Accessible, high-quality education for 3+ billion users |
| **Timeline** | 15-year roadmap |
| **Production** | https://pmerit.com |
| **Repository** | github.com/peoplemerit/pmerit-ai-platform |

### 1.2 Local Environment

**Project Location:** `C:\dev\pmerit\`

| Component | Path |
|-----------|------|
| **Node.js** | `C:\dev\pmerit\.node\node-v20.18.1-win-x64\` |
| **Version** | v20.18.1 LTS |

**Activation Required:**
```powershell
cd C:\dev\pmerit
.\pmerit-env.ps1
```

### 1.3 Team Structure

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ CLAUDE WEB  │◄────►│     YOU     │◄────►│ CLAUDE CODE │
│ (Architect) │      │ (Director)  │      │(Implementer)│
└─────────────┘      └─────────────┘      └─────────────┘
     │                     │                     │
     │ Strategy, specs     │ Decisions, git      │ Reality audit
     │ Brainstorming       │ Coordination        │ Implementation
     │ Requirements        │ Approvals           │ Quality review
```

### 1.4 Environment Map

| ID | Name | Path | Purpose |
|----|------|------|---------|
| `FE` | Frontend | `pmerit-ai-platform/` | UI, docs, client JS |
| `BE` | Backend | `pmerit-api-worker/` | API, AI personas, TTS |
| `DB` | Database | Neon Dashboard | Schema, migrations |

---

## SECTION 2: MISSION (Objectives)

### 2.1 Primary Directive

When Claude receives **"PMERIT CONTINUE"**:

1. **Recognize** — This is the PMERIT AI Educational Platform
2. **Read** — AIXORD_STATE.json, AIXORD_TRACKER.md, latest handoffs
3. **Audit** — Run production health check
4. **Resume** — Continue from exactly where previous session ended
5. **Execute** — Begin work without asking for additional context

### 2.2 Scope Order Workflow (Reality-First)

```
1. YOU: Create empty SCOPE_[NAME].md
2. CLAUDE CODE: Audit reality → populate AUDIT_REPORT
3. YOU → CLAUDE WEB: Share audit report
4. CLAUDE WEB: Write requirements → HANDOFF_DOCUMENT
5. YOU → CLAUDE CODE: "SCOPE UPDATED: [NAME]"
6. CLAUDE CODE: Implement → update RESEARCH_FINDINGS
7. CLAUDE CODE: Execute VWP → generate GAP_REPORT
8. REPEAT until complete
```

### 2.3 Phase Progression

```
🏠 HOMEPAGE GATE (H1-H10) ← Must complete first
   │
   ├─► Phase 0-6: User Journey Arc
   │     (Assessment → Dashboard → Classroom → Credentials)
   │
   └─► Phase 7-10: Admin Journey Arc
         (Admin Portal → Curriculum → Audit)

🎉 PLATFORM COMPLETE
```

---

## SECTION 3: EXECUTION (Step-by-Step Protocols)

### 3.1 Auto-Continuity Protocol (8 Steps)

When receiving **"PMERIT CONTINUE"**:

| Step | Action | Files |
|------|--------|-------|
| 1 | Read governance | AIXORD_STATE.json, AIXORD_TRACKER.md |
| 2 | Check active scope | .claude/scopes/SCOPE_[name].md |
| 3 | Read recent handoffs | docs/handoffs/PMERIT_HANDOFF_*.md |
| 4 | Verify git sync | `git fetch && git status` |
| 5 | Run production audit | curl health checks |
| 6 | Update documents | STATE, TRACKER, audit file |
| 7 | Output status | Auto-continuity response |
| 8 | Begin work | Execute next task |

### 3.2 Visual Walkthrough Protocol (VWP)

**Purpose:** Validate scope implementations through end-to-end user journey testing.

**Trigger:** Before marking ANY scope COMPLETE

**Command:**
```
WALKTHROUGH: [SCOPE_NAME] [USER_PERSONA]
```

**Execution:**
1. Define persona & scenario
2. Execute step-by-step (user provides screenshots)
3. Analyze each screenshot for gaps
4. Document gaps with severity
5. Generate GAP report
6. Update scope status

**Severity Levels:**

| Level | Symbol | Definition | Action |
|-------|--------|------------|--------|
| Critical | 🔴 | Blocks core functionality | Must fix |
| High | 🔴 | Major feature broken | Should fix |
| Medium | 🟡 | Suboptimal UX | Next iteration |
| Low | 🟢 | Minor polish | Backlog |

### 3.3 Scope Lock Protocol

**Purpose:** Prevent regression in completed features.

**Status Levels:**

| Status | Modifications |
|--------|---------------|
| `draft` | Free to modify |
| `complete` | Requires review |
| `locked` | Requires explicit UNLOCK |

**Commands:**

| Command | Effect |
|---------|--------|
| `LOCK SCOPE: [name]` | Lock all files |
| `UNLOCK: [file]` | Temporary unlock |
| `RELOCK: [file]` | Re-lock after changes |

### 3.4 Scope Audit Protocol

**Purpose:** Verify foundational integrity before implementation.

**Trigger:** First touch of scope in session, or >3 session gap

**Checklist:**
```
□ Architectural Decisions — Check ARCH-XXX compliance
□ Dependency Validation — Verify depends_on scopes complete
□ Assumption Review — Compare spec vs production reality
□ Technology Stack — Verify planned tech matches current
□ Integration Points — Verify APIs/tables exist
```

### 3.5 Three-Attempt Escalation

```
ATTEMPT 1 → Failed? →
ATTEMPT 2 → Failed? →
ATTEMPT 3 → Failed? →
    ├─► ESCALATE (default)
    └─► EXTEND (grants 2 more, max once)
            └─► ATTEMPT 4 → ATTEMPT 5 → MANDATORY ESCALATION
```

### 3.6 Single-Step Execution Format

```
STEP [#]: [Action] (Attempt [X/3])

[Single command or code block]

Purpose: [Brief explanation]

→ Reply "DONE" to proceed.
```

---

## SECTION 4: CONSTRAINTS (Guardrails)

### 4.1 Prohibitions

❌ DO NOT ask "What would you like to work on?"
❌ DO NOT ask "Can you provide context?"
❌ DO NOT skip Homepage Gate
❌ DO NOT modify LOCKED files without UNLOCK
❌ DO NOT proceed without sync verification
❌ DO NOT skip VWP before marking scope COMPLETE

### 4.2 Mandatory Checks

✅ Read governance files before exploring codebase
✅ Verify git sync before making changes
✅ Run production audit on session start
✅ Check LOCKED FILES before editing
✅ Execute VWP before scope completion
✅ Update RESEARCH_FINDINGS after implementation

### 4.3 Quality Standards

- **MOSA Compliance:** Modular, interoperable, auditable
- **Strict Separation:** HTML, CSS, JS
- **Shared Components:** `/partials/`
- **Backend-First:** Implement API before frontend

### 4.4 Document Hierarchy (Priority Order)

1. Narrative User & Admin Journey
2. Latest Handoff Document
3. AIXORD_TRACKER.md
4. AIXORD_GOVERNANCE.md (this file)
5. Original Ongoing Plan
6. Scope Documents

---

## SECTION 5: COMMAND & SIGNAL (Confirmation Rules)

### 5.1 Primary Commands

| Command | Effect |
|---------|--------|
| **PMERIT CONTINUE** | Full auto-continuity protocol |
| **PMERIT STATUS** | Show state without work |
| **PMERIT QUICK FIX: [desc]** | Light mode for minor fixes |
| **DONE** | Confirm step completion |
| **ESCALATE** | Force escalation |

### 5.2 Scope Commands

| Command | Effect |
|---------|--------|
| **SCOPE: [name]** | Load scope context |
| **SCOPE: MASTER** | Load full project vision |
| **AUDIT SCOPE: [name]** | Run foundational integrity check |
| **SCOPE UPDATED: [name]** | Read updated scope, implement |

### 5.3 VWP Commands

| Command | Effect |
|---------|--------|
| **WALKTHROUGH: [SCOPE] [PERSONA]** | Start Visual Walkthrough |
| **VWP STATUS** | Check walkthrough status |
| **VWP GAPS** | List open gaps |
| **CLOSE GAP: [ID]** | Mark gap resolved |

### 5.4 Lock Commands

| Command | Effect |
|---------|--------|
| **LOCK SCOPE: [name]** | Lock all files in scope |
| **UNLOCK: [file]** | Temporary unlock |
| **UNLOCK SCOPE: [name]** | Unlock all files |
| **RELOCK: [file]** | Re-lock after verification |

### 5.5 Phase Commands

| Command | Effect |
|---------|--------|
| **HOMEPAGE GATE COMPLETE** | Unlock Phase 0 |
| **PHASE [X] COMPLETE** | Unlock Phase X+1 |
| **PHASE SKIP: [#]** | Emergency skip (requires justification) |
| **EXTEND: [ID]** | Grant 2 more attempts |
| **PMERIT REVISIT: [ID]** | Retry escalated issue |

### 5.6 Environment Commands

| Command | Effect |
|---------|--------|
| **ENV: FE** | Switch to Frontend |
| **ENV: BE** | Switch to Backend |
| **ENV: BOTH** | Coordinate both repos |

### 5.7 Auto-Continuity Response Format

```
🔄 AIXORD AUTO-CONTINUITY — Session [#]

🔒 Sync Gate: [Pending/Confirmed]
📍 Current Phase: [Phase Name]
📊 Phase Status: [Status]
🎯 Active Requirement: [ID]
📂 Active Scope: [Scope Name]
⚡ Workflow Mode: [Standard/Fallback/Direct]

🩺 PRODUCTION AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
| Component      | Status | Notes        |
|----------------|--------|--------------|
| Frontend       | ✅/⚠️/❌ | [brief]      |
| Backend API    | ✅/⚠️/❌ | [version]    |
| AI Services    | ✅/⚠️/❌ | [status]     |

📚 Reference Docs:
- Active Scope: .claude/scopes/SCOPE_[name].md
- Latest Handoff: docs/handoffs/[latest].md

⏭️ Next Action: [Based on state]
```

---

## SECTION 6: CORE PRINCIPLES

1. **Auto-Continuity:** "PMERIT CONTINUE" instantly restores context
2. **Phase-Gated:** No phase unlocks until previous verified complete
3. **Homepage First:** Homepage Gate can NEVER be skipped
4. **Three-Attempt Rule:** Escalate after 3 failed attempts (extendable to 5)
5. **Light Mode:** Quick fixes bypass full protocol
6. **Skip Option:** Emergency phase skip with documented risks
7. **Unified Instructions:** Same governance for Claude Web and Code Desktop
8. **Single-Step Execution:** One command at a time, wait for "DONE"
9. **Sync Protocol:** Keep tracker synchronized between tools
10. **Handoff Supersedes:** Latest handoff overrides original documents
11. **Scope Audit First:** Verify integrity before implementation
12. **Visual Walkthrough Required:** Execute VWP before marking scope COMPLETE

---

## SECTION 7: FILE LOCATIONS

### 7.1 AIXORD System Files

```
docs/aixord/
├── AIXORD_GOVERNANCE.md     ← This file (rules & protocols)
├── AIXORD_STATE.json        ← Current system state
├── AIXORD_TRACKER.md        ← Task progress tracking
├── AIXORD_VWP.md            ← Visual Walkthrough Protocol
├── AIXORD_EVOLUTION.md      ← History (AADOS → AIXORD)
├── AIXORD_GAP_*.md          ← Gap reports from VWP
└── archive/                 ← Archived documents
```

### 7.2 Scope Files

```
.claude/scopes/
├── MASTER_SCOPE.md
├── SCOPE_HOMEPAGE.md
├── SCOPE_ASSESSMENT.md
├── SCOPE_DASHBOARD.md
├── SCOPE_CLASSROOM.md
├── SCOPE_K12_EDUCATION.md
└── [other scopes...]
```

### 7.3 Handoff Files

```
docs/handoffs/
├── PMERIT_HANDOFF_SESSION_*.md
├── BRAINSTORM_*.md
└── archive/
```

---

## SECTION 8: APPENDICES

### Appendix A: Scope Completion Checklist

```markdown
## Scope Completion Checklist

- [ ] All requirements implemented
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] **VWP Executed** ← MANDATORY
- [ ] **GAP Report generated** ← MANDATORY
- [ ] **No Critical Gaps remaining** ← MANDATORY
- [ ] Deployed to staging
- [ ] Deployed to production
```

### Appendix B: Standard User Personas

| ID | Persona | Description |
|----|---------|-------------|
| `adult_new` | New Adult User | First-time visitor |
| `parent_new` | New Parent | Registering child |
| `k12_student_k2` | K-2 Student | Ages 5-7 |
| `k12_student_35` | Grade 3-5 Student | Ages 8-10 |
| `k12_student_68` | Grade 6-8 Student | Ages 11-13 |
| `k12_student_912` | Grade 9-12 Student | Ages 14-18 |
| `admin_tier1` | Super Admin | Full access |

### Appendix C: Homepage Gate Requirements

| # | Requirement | Verification |
|---|-------------|--------------|
| H1 | No console errors | DevTools Console |
| H2 | Clean, non-scrollable design | Visual |
| H3 | AI chatbox functional | Send/receive |
| H4 | Left panel quick actions | Visible |
| H5 | Sign-Up modal triggers | Click test |
| H6 | Customer Service badge | AI response |
| H7 | Azure Translator works | Language selector |
| H8 | Header/Footer display | Navigation |
| H9 | Mobile responsive | 375px width |
| H10 | No broken images | Visual |

### Appendix D: OPORD Mapping Reference

| OPORD Section | AIXORD Section |
|---------------|----------------|
| 1. Situation | Section 1: System Context |
| 2. Mission | Section 2: Objectives |
| 3. Execution | Section 3: Protocols |
| 4. Sustainment | Section 4: Constraints |
| 5. Command & Signal | Section 5: Commands |

---

*AIXORD — AI Execution Order*
*Version 12.0 — December 24, 2025*
*Evolution: AADOS V1-V11 → AIXORD V12+*
*Production: https://pmerit.com*
