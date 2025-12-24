# PMERIT Development System — Quick Reference Guide

**Version:** 3.0 (AIXORD Governance)
**Created:** 2025-12-12
**Updated:** 2025-12-24
**Purpose:** Complete operational guide for the three-way workflow and AIXORD Scope Order system
**Governance:** AIXORD (AI Execution Order) — formerly AADOS

---

## Table of Contents

1. [Team Structure](#1-team-structure)
2. [Directory Layout](#2-directory-layout)
3. [Scope Order System v2](#3-scope-order-system-v2)
4. [Efficient Three-Way Workflow](#4-efficient-three-way-workflow)
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
│  ├── Claude Web: Strategy, specs, brainstorming, requirements               │
│  ├── You: Decisions, coordination, approvals, git operations                │
│  └── Claude Code: Audit reality, quality review, implementation             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Role Details

| Role | Tool | Capabilities | Responsibilities |
|------|------|--------------|------------------|
| **Architect** | Claude Web | Web access, Project Knowledge | Strategy, specs, requirements writing |
| **Director** | You | Full system access | Decisions, approvals, coordination |
| **Implementer** | Claude Code | File system, code execution | Reality audit, implementation, quality review |

---

## 2. Directory Layout

```
C:\dev\pmerit\                                ← WORKSPACE ROOT
│
├── CLAUDE.md                                 ← Claude Code instructions (v4.0 AIXORD)
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
│   │       ├── SCOPE_TTS.md                  ← TTS system
│   │       ├── SCOPE_ADMIN.md                ← P7-P10
│   │       └── SCOPE_CREDENTIALS.md          ← ARCH-2/3
│   │
│   ├── docs\
│   │   ├── aixord\                           ← AIXORD GOVERNANCE (V12+)
│   │   │   ├── AIXORD_STATE.json             ← Current state (machine-readable)
│   │   │   ├── AIXORD_TRACKER.md             ← Living status
│   │   │   ├── AIXORD_GOVERNANCE.md          ← Workflow rules (OPORD structure)
│   │   │   ├── AIXORD_VWP.md                 ← Visual Walkthrough Protocol
│   │   │   ├── AIXORD_EVOLUTION.md           ← AADOS → AIXORD history
│   │   │   └── AIXORD_GAP_*.md               ← Gap reports from VWP
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

## 3. Scope Order System v2

### Key Improvement: Reality-First Approach

The v2 workflow is **pull-based** — Claude Code audits production reality first, then Claude Web writes specs based on facts.

### Old vs New Workflow

| Aspect | v1 (Push-Based) | v2 (Pull-Based) |
|--------|-----------------|-----------------|
| **Starts with** | Claude Web writes spec | You create empty scope file |
| **Reality check** | After implementation | Before spec writing |
| **Risk** | Specs may be outdated | Specs based on current reality |
| **Efficiency** | May duplicate work | Avoids rework |

### Scope File States

| State | Contents | Created By |
|-------|----------|------------|
| **Empty** | Just the file name | You (Director) |
| **Audited** | Implementation reality report | Claude Code |
| **Specified** | Requirements + instructions | Claude Web |
| **Implemented** | Completed with RESEARCH_FINDINGS | Claude Code |

### Scope Structure (After Full Cycle)

```markdown
# PMERIT SUB-SCOPE: [Feature Name]

## 1. SCOPE IDENTITY
- Files, APIs, database tables

## 2. ARCHITECTURAL DECISIONS (LOCKED)
- Final decisions from implementation

## 3. CURRENT IMPLEMENTATION STATUS
<AUDIT_REPORT>
- What Claude Code found during reality audit
- Existing code, endpoints, files
- Gaps identified
</AUDIT_REPORT>

## 4. FEATURE SPECIFICATION
<HANDOFF_DOCUMENT>
- Requirements written by Claude Web
- Based on audit report + brainstorming
</HANDOFF_DOCUMENT>

## 5. IMPLEMENTATION STATUS
<RESEARCH_FINDINGS>
- What Claude Code implemented
- Session-by-session notes
</RESEARCH_FINDINGS>

## 6. DEPENDENCIES
- What this scope requires/enables

## 7. VERIFICATION CHECKLIST
- Acceptance criteria with status
```

---

## 4. Efficient Three-Way Workflow

### The v2 Workflow Cycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EFFICIENT THREE-WAY WORKFLOW (v2)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 1: INITIATE (You)                                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ • Decide what feature/area to work on                                 │   │
│  │ • Create empty scope file: SCOPE_[NAME].md                            │   │
│  │ • Commit to repo (so Claude Web can see it exists)                    │   │
│  │                                                                       │   │
│  │ Example: Create .claude/scopes/SCOPE_TTS.md (empty)                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  STEP 2: REALITY AUDIT (Claude Code)                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Prompt: "Audit SCOPE_TTS - report implementation reality"             │   │
│  │                                                                       │   │
│  │ Claude Code:                                                          │   │
│  │ • Searches codebase for related files                                 │   │
│  │ • Tests production endpoints                                          │   │
│  │ • Documents what exists vs what's missing                             │   │
│  │ • Updates scope file with AUDIT_REPORT section                        │   │
│  │ • Identifies gaps and issues                                          │   │
│  │                                                                       │   │
│  │ OUTPUT: Factual reality report in scope file                          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  STEP 3: SHARE REPORT (You → Claude Web)                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ • Copy Claude Code's audit report                                     │   │
│  │ • Paste to Claude Web                                                 │   │
│  │ • "Here's the current reality for TTS. Let's plan improvements."      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  STEP 4: BRAINSTORM & SPECIFY (Claude Web + You)                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Based on reality report:                                              │   │
│  │ • Discuss what to build/fix                                           │   │
│  │ • Research best approaches                                            │   │
│  │ • Write requirements and instructions                                 │   │
│  │                                                                       │   │
│  │ Claude Web updates SCOPE_[NAME].md with:                              │   │
│  │ • HANDOFF_DOCUMENT section (requirements)                             │   │
│  │ • Implementation instructions                                         │   │
│  │ • Acceptance criteria                                                 │   │
│  │                                                                       │   │
│  │ OUTPUT: Complete spec based on facts                                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  STEP 5: NOTIFY (You → Claude Code)                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ "SCOPE_TTS.md has been updated with requirements. Please review."     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  STEP 6: REVIEW & IMPLEMENT (Claude Code)                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Claude Code:                                                          │   │
│  │ • Reads updated scope file                                            │   │
│  │ • Reviews requirements against architecture                           │   │
│  │ • Recommends better alternatives if found                             │   │
│  │ • Gets approval if recommending changes                               │   │
│  │ • Implements approved solution                                        │   │
│  │ • Updates RESEARCH_FINDINGS section                                   │   │
│  │                                                                       │   │
│  │ OUTPUT: Implementation complete, scope file updated                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  STEP 7: FEEDBACK LOOP (You → Claude Web)                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ • Share implementation results                                        │   │
│  │ • Claude Web reviews and provides follow-up if needed                 │   │
│  │ • Iterate until feature complete                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Example: TTS Scope Workflow

```
YOU:
1. Create empty file: .claude/scopes/SCOPE_TTS.md
2. Commit and push

YOU → CLAUDE CODE:
"Audit SCOPE_TTS - what's the implementation reality for TTS?"

CLAUDE CODE:
• Searches for tts.ts, tts.js, etc.
• Tests /api/v1/tts endpoint
• Documents: "TTS endpoint exists, returns WAV audio,
  but TTS_QUOTA_KV binding not configured"
• Updates SCOPE_TTS.md with audit report

YOU → CLAUDE WEB:
"Here's Claude Code's TTS audit: [paste report]
The quota system isn't working. What should we do?"

CLAUDE WEB + YOU:
• Discuss options
• Decide to implement usage tracking
• Write requirements for quota management
• Update SCOPE_TTS.md with HANDOFF_DOCUMENT

YOU → CLAUDE CODE:
"SCOPE_TTS.md updated with quota requirements. Please review and implement."

CLAUDE CODE:
• Reads new requirements
• "I recommend using Cloudflare KV with per-user daily limits.
  Proceed with this approach?"
• After approval, implements
• Updates RESEARCH_FINDINGS
```

### Benefits of v2 Workflow

| Benefit | Description |
|---------|-------------|
| **No outdated specs** | Requirements based on current reality |
| **No duplicate work** | Audit reveals what already exists |
| **Faster iterations** | Facts before planning |
| **Better decisions** | Claude Web has accurate context |
| **Gap identification** | Issues found before implementation |

---

## 5. Commands Reference

### Scope Audit Commands (NEW)

| Command | Effect |
|---------|--------|
| `AUDIT SCOPE: [name]` | Claude Code audits reality for this scope |
| `SCOPE UPDATED: [name]` | Notify Claude Code that Claude Web updated scope |
| `SCOPE: [name]` | Load scope context (unchanged) |

### Session Commands

| Command | When to Use | Effect |
|---------|-------------|--------|
| `PMERIT CONTINUE` | Start of session | Full startup protocol |
| `PMERIT STATUS` | Quick check | Show state without working |
| `PMERIT QUICK FIX: [desc]` | Minor fixes | Skip audit, fast mode |
| `PMERIT SYNC CONFIRMED` | After git pull | Confirm repos synced |

### Scope Commands

| Command | Effect |
|---------|--------|
| `SCOPE: CLASSROOM` | Load classroom context |
| `SCOPE: ASSESSMENT` | Load assessment context |
| `SCOPE: TTS` | Load TTS context |
| `SCOPE: MASTER` | Load full project vision |
| `AUDIT SCOPE: [name]` | Audit and report reality |
| `SCOPE UPDATED: [name]` | Review updated scope and implement |

### Environment Commands

| Command | Effect |
|---------|--------|
| `ENV: FE` | Switch to Frontend repo |
| `ENV: BE` | Switch to Backend repo |
| `ENV: BOTH` | Coordinate both repos |

---

## 6. File Sync Protocol

### Creating New Scope (You)

```bash
# 1. Create empty scope file
cd E:\pmerit\pmerit-ai-platform
echo "# PMERIT SUB-SCOPE: [Feature Name]" > .claude/scopes/SCOPE_[NAME].md

# 2. Commit
git add .claude/scopes/SCOPE_[NAME].md
git commit -m "docs: Create empty SCOPE_[NAME].md for audit"
git push origin main
```

### After Claude Code Audit

The scope file will contain:
```markdown
# PMERIT SUB-SCOPE: [Feature Name]

## AUDIT_REPORT (by Claude Code)

**Audit Date:** YYYY-MM-DD
**Audited By:** Claude Code (Session #)

### Existing Implementation
- [What exists]

### Files Found
- [List of files]

### Endpoints
- [API endpoints if applicable]

### Gaps Identified
- [What's missing or broken]

### Recommendations
- [Suggested improvements]
```

### After Claude Web Updates

Claude Web adds:
```markdown
## HANDOFF_DOCUMENT (Requirements)

### Objectives
- [What to achieve]

### Requirements
- [Specific requirements]

### Implementation Instructions
- [How to implement]

### Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
```

### After Claude Code Implements

Claude Code adds:
```markdown
## RESEARCH_FINDINGS (Implementation)

### Session [#] (YYYY-MM-DD)

**Completed:**
- [What was done]

**Files Modified:**
- [List of files]

**Commits:** [hashes]

**Notes:**
- [Important findings]
```

---

## 7. Session Lifecycle

### Starting a New Feature

```
1. YOU: Decide feature area (e.g., TTS quota management)

2. YOU: Create empty scope file
   → .claude/scopes/SCOPE_TTS_QUOTA.md
   → Commit and push

3. YOU → CLAUDE CODE: "AUDIT SCOPE: TTS_QUOTA"

4. CLAUDE CODE: Audits and reports reality

5. YOU → CLAUDE WEB: Share audit report

6. CLAUDE WEB + YOU: Brainstorm, write requirements

7. CLAUDE WEB: Updates scope file with HANDOFF_DOCUMENT

8. YOU → CLAUDE CODE: "SCOPE UPDATED: TTS_QUOTA"

9. CLAUDE CODE: Reviews, recommends, implements

10. REPEAT until complete
```

### Continuing Existing Feature

```
1. YOU → CLAUDE CODE: "SCOPE: [name]"

2. CLAUDE CODE: Loads scope, reviews status

3. Continue from current state
```

### Session Handoff

When creating handoff, include:
- Current scope being worked on
- State of scope (audited/specified/implementing)
- Next steps

---

## 8. Troubleshooting

### "Claude Web doesn't have current reality"

**Cause:** Audit wasn't done first
**Solution:** Run `AUDIT SCOPE: [name]` before brainstorming

### "Requirements don't match what exists"

**Cause:** Spec written without reality check
**Solution:** Re-audit, update requirements based on facts

### "Scope file is confusing"

**Solution:** Ensure clear sections:
1. AUDIT_REPORT (Claude Code's findings)
2. HANDOFF_DOCUMENT (Claude Web's requirements)
3. RESEARCH_FINDINGS (Claude Code's implementation notes)

### "Which scope am I working on?"

**Check:** STATE.json → `scope_order.active_scope`

### "Need to audit multiple areas"

**Solution:** Create multiple empty scope files, audit each:
```
AUDIT SCOPE: TTS
AUDIT SCOPE: AVATAR
AUDIT SCOPE: CLASSROOM
```

---

## Quick Start Checklist

### Starting New Feature (v2 Workflow)
- [ ] Create empty `SCOPE_[NAME].md`
- [ ] Commit and push
- [ ] Tell Claude Code: `AUDIT SCOPE: [NAME]`
- [ ] Share audit with Claude Web
- [ ] Brainstorm and write requirements
- [ ] Tell Claude Code: `SCOPE UPDATED: [NAME]`
- [ ] Review Claude Code's recommendations
- [ ] Approve and implement

### Continuing Existing Feature
- [ ] `SCOPE: [NAME]` to load context
- [ ] Check current state (audited/specified/implementing)
- [ ] Continue from where left off

---

*Quick Reference Guide v3.0*
*Updated: 2025-12-24*
*For: PMERIT Three-Way Development Workflow*
*Governance: AIXORD (AI Execution Order) — formerly AADOS*
