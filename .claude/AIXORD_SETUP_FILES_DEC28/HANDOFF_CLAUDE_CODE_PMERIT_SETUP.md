# HANDOFF — Claude Code: PMERIT AIXORD v2.1 Setup

**From:** Claude Web (Architect)  
**To:** Claude Code (Commander)  
**Date:** 2025-12-28  
**Mode:** DECISION → Pending EXECUTION approval  
**Priority:** HIGH

---

## CONTEXT

The Human (Director) has approved the AIXORD v2.1 architecture for PMERIT. This HANDOFF contains the complete implementation order to:

1. Create AIXORD_ROOT directory structure
2. Install governance documents
3. Configure multi-repo federation
4. Prepare backend repo for SCOPE migration
5. Create sandbox directory

**Key Decisions Made:**
- Root folder: `AIXORD_ROOT/` (explicit, visible)
- SUB-SCOPE format: Separate files in subfolders (`SCOPE_[NAME]/SUB-SCOPE_[NAME].md`)
- Backend SCOPEs: Move to `pmerit-api-worker/` where they directly function
- GENESIS protocol: Approved for systematic SCOPE creation

---

## CURRENT STATE

### Workspace Structure (Before)
```
C:\dev\pmerit\
├── .claude/                        ← Old root instructions (to be replaced)
├── .claude-archives/
├── pmerit-ai-platform/
│   └── .claude/
│       ├── CLAUDE.md
│       ├── CLAUDE_WEB_SYNC.md
│       ├── SYSTEM_GUIDE.md
│       └── scopes/                 ← 32 SCOPEs (some need decomposition/move)
├── pmerit-api-worker/
│   └── CLAUDE.md                   ← No scopes directory yet
└── Pmerit_Product_Development/
    └── .claude/
        └── scopes/
            └── SCOPE_AIForCuriousMinds.md
```

### Issues to Resolve
1. No centralized AIXORD_ROOT
2. No sandbox directory
3. Backend SCOPEs (TTS, AI_PERSONAS) in wrong repo
4. Large SCOPEs not decomposed into SUB-SCOPEs
5. Old AADOS references in various files

---

## IMPLEMENTATION SPECIFICATION

### Phase 1: Create AIXORD_ROOT Structure

**Location:** `C:\dev\pmerit\AIXORD_ROOT\`

**Commands:**
```bash
cd C:\dev\pmerit

# Create AIXORD_ROOT structure
mkdir -p AIXORD_ROOT/GOVERNANCE
mkdir -p AIXORD_ROOT/STATE
mkdir -p AIXORD_ROOT/HANDOFFS
mkdir -p AIXORD_ROOT/AUDITS

# Create sandbox
mkdir -p sandbox
touch sandbox/audit.log
```

**Files to Create:**
| File | Source | Action |
|------|--------|--------|
| `AIXORD_ROOT/GOVERNANCE/AIXORD_GOVERNANCE_V2.1.md` | From this HANDOFF | Create |
| `AIXORD_ROOT/STATE/PMERIT_AIXORD_STATE.json` | From this HANDOFF | Create |

### Phase 2: Prepare Backend Repo for SCOPEs

**Location:** `C:\dev\pmerit\pmerit-api-worker\`

**Commands:**
```bash
cd C:\dev\pmerit\pmerit-api-worker

# Create scopes directory
mkdir -p .claude/scopes

# Create subdirectories for decomposed SCOPEs
mkdir -p .claude/scopes/SCOPE_TTS
mkdir -p .claude/scopes/SCOPE_AI_PERSONAS
```

### Phase 3: Prepare Frontend Repo for Decomposition

**Location:** `C:\dev\pmerit\pmerit-ai-platform\.claude\scopes\`

**Commands:**
```bash
cd C:\dev\pmerit\pmerit-ai-platform\.claude\scopes

# Create subdirectories for large SCOPEs to be decomposed
mkdir -p SCOPE_SECURITY
mkdir -p SCOPE_PARENT_PORTAL
mkdir -p SCOPE_K12_EDUCATION
mkdir -p SCOPE_DASHBOARD
```

### Phase 4: Create Products Repo SCOPE Structure

**Location:** `C:\dev\pmerit\Pmerit_Product_Development\.claude\scopes\`

**Commands:**
```bash
cd C:\dev\pmerit\Pmerit_Product_Development\.claude\scopes

# Create AIXORD product SCOPE directory
mkdir -p SCOPE_AIXORD
```

### Phase 5: Install Templates

**Copy templates to each repo:**

| Template | Destination |
|----------|-------------|
| `SCOPE_TEMPLATE_V2.1.md` | Each repo's `.claude/scopes/` |
| `SUB-SCOPE_TEMPLATE.md` | Each repo's `.claude/scopes/` |

### Phase 6: Update CLAUDE.md Files

Each repo needs its `CLAUDE.md` updated to reference AIXORD v2.1:

**Key additions:**
```markdown
## AIXORD AUTHORITY CONTRACT

This repository operates under AIXORD v2.1 governance.

**Governance Location:** C:/dev/pmerit/AIXORD_ROOT/GOVERNANCE/
**State Location:** C:/dev/pmerit/AIXORD_ROOT/STATE/

**Startup Protocol:**
1. READ AIXORD_ROOT/GOVERNANCE/AIXORD_GOVERNANCE_V2.1.md
2. READ AIXORD_ROOT/STATE/PMERIT_AIXORD_STATE.json
3. CHECK halt status
4. LOAD active SCOPE
5. REPORT state to Human
```

---

## EXECUTION ORDER

| Step | Action | Repository | Verification |
|------|--------|------------|--------------|
| 1 | Create `AIXORD_ROOT/` directories | workspace | `ls -la AIXORD_ROOT/` shows 4 subdirs |
| 2 | Create `sandbox/` directory | workspace | `ls -la sandbox/` shows audit.log |
| 3 | Copy `AIXORD_GOVERNANCE_V2.1.md` | AIXORD_ROOT | File exists, 800+ lines |
| 4 | Copy `PMERIT_AIXORD_STATE.json` | AIXORD_ROOT | File exists, valid JSON |
| 5 | Create backend `scopes/` directory | pmerit-api-worker | Directory exists |
| 6 | Create backend SCOPE subdirectories | pmerit-api-worker | TTS, AI_PERSONAS dirs exist |
| 7 | Create frontend SCOPE subdirectories | pmerit-ai-platform | SECURITY, PARENT_PORTAL, K12 dirs exist |
| 8 | Create products SCOPE subdirectory | Pmerit_Product_Dev | AIXORD dir exists |
| 9 | Copy templates to all repos | all 3 repos | Templates in each scopes/ |
| 10 | Git commit all changes | all 3 repos + workspace | Clean git status |

---

## FILES PROVIDED (Attached)

The following files are ready for deployment:

### 1. AIXORD_GOVERNANCE_V2.1.md
- Complete governance document (800+ lines)
- Includes: SUB-SCOPE spec, GENESIS protocol, AIXORD_ROOT spec, Sandbox spec

### 2. PMERIT_AIXORD_STATE.json
- Configured for 3-repo federation
- Includes: All current SCOPEs with status
- Includes: Decomposition tracking for 6 large SCOPEs
- Sandbox and AIXORD_ROOT enabled

### 3. SCOPE_TEMPLATE_V2.1.md
- Updated template with SUB-SCOPE support
- All required sections per governance

### 4. SUB-SCOPE_TEMPLATE.md
- Template for decomposed SUB-SCOPEs
- Parent relationship tracking

---

## ACCEPTANCE CRITERIA

- [ ] `AIXORD_ROOT/` exists at `C:\dev\pmerit\AIXORD_ROOT\`
- [ ] Governance file installed and readable
- [ ] State file installed and valid JSON
- [ ] `sandbox/` directory exists with audit.log
- [ ] Backend repo has `.claude/scopes/` directory
- [ ] Backend repo has SCOPE_TTS/ and SCOPE_AI_PERSONAS/ subdirs
- [ ] Frontend repo has SCOPE_SECURITY/, SCOPE_PARENT_PORTAL/, SCOPE_K12_EDUCATION/ subdirs
- [ ] Products repo has SCOPE_AIXORD/ subdir
- [ ] Templates copied to all repos
- [ ] All changes committed to git

---

## CARRYFORWARD (After This HANDOFF)

Once this setup is complete, the following work remains:

| Task | Priority | Who |
|------|----------|-----|
| Move SCOPE_TTS.md content to backend | HIGH | Claude Code |
| Move SCOPE_AI_PERSONAS.md content to backend | HIGH | Claude Code |
| Decompose SCOPE_SECURITY into SUB-SCOPEs | MEDIUM | Human + Claude Web brainstorm → Claude Code implement |
| Decompose SCOPE_PARENT_PORTAL into SUB-SCOPEs | MEDIUM | Human + Claude Web brainstorm → Claude Code implement |
| Update all CLAUDE.md files with AIXORD v2.1 references | MEDIUM | Claude Code |
| Archive old .claude/ root folder | LOW | Claude Code |

---

## HALT CONDITIONS

HALT and return to Human if:

- [ ] Any directory creation fails
- [ ] Permission denied errors
- [ ] Git conflicts detected
- [ ] State file fails JSON validation
- [ ] Governance file hash verification fails (if enabled)

---

## AUTHORITY

**Decision Authority:** Human (Director)  
**Execution Authority:** Pending Human approval to `ENTER EXECUTION MODE`

---

*AIXORD v2.1 — HANDOFF from Architect to Commander*
*Generated by Claude Web on 2025-12-28*
