# PMERIT Project Document

**Version:** 2.0
**Last Updated:** December 5, 2025
**Status:** Active Development
**Document Purpose:** Master source of truth for PMERIT platform — roadmap, decisions, and task tracking

---

## How This Document Works

This is the **MASTER DOCUMENT** for the PMERIT project. It serves as:

1. **Strategic Roadmap** — WHY we're building and WHERE we're going
2. **Decision Registry** — Implementation decisions made during development
3. **Task Carryforward** — Incomplete tasks carried between sessions
4. **Session History** — Record of development sessions

### Document Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PMERIT DOCUMENT WORKFLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐      ┌─────────────────┐                       │
│  │ BRAINSTORM      │      │ USER JOURNEY    │                       │
│  │ ASU_LIKE_SCHEMA │      │ NARRATIVE       │                       │
│  │ (Feature Specs) │      │ (User Stories)  │                       │
│  └────────┬────────┘      └────────┬────────┘                       │
│           │                        │                                │
│           └──────────┬─────────────┘                                │
│                      │                                              │
│                      ▼                                              │
│  ┌─────────────────────────────────────────┐                        │
│  │          IMPLEMENTATION                  │                        │
│  │    (Claude Code Desktop Session)         │                        │
│  └────────────────────┬────────────────────┘                        │
│                       │                                             │
│           ┌───────────┴───────────┐                                 │
│           │                       │                                 │
│           ▼                       ▼                                 │
│  ┌─────────────────┐    ┌─────────────────┐                         │
│  │ SESSION HANDOFF │    │ THIS DOCUMENT   │                         │
│  │ (Point-in-time) │───▶│ (Decisions &    │                         │
│  │                 │    │  Carryforward)  │                         │
│  └─────────────────┘    └─────────────────┘                         │
│                                                                     │
│  ✅ Decisions made → Updated here                                   │
│  ✅ Tasks incomplete → Carried forward here                         │
│  ✅ Brainstorm changes → Documented here first                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Executive Summary

**PMERIT** (People Merit) is a free AI-powered educational platform designed to provide alternative education to 3+ billion potential learners globally. The platform uses AI tutors (not human instructors) to deliver personalized learning experiences across three track types.

### Mission Statement

> Provide free, accessible, AI-tutored education to liberate people from poverty through skills that lead to sustainable employment.

### Core Principles

1. **AI-First Tutoring**: No human instructors — AI tutors provide personalized, always-available learning
2. **Free & Accessible**: $0 free tier with full educational content; premium tier for enhanced experience
3. **Global Reach**: PWA architecture for low-bandwidth regions; offline access via Service Workers
4. **Poverty Liberation**: Focus on employment-ready skills across all three track types

---

## Document Hierarchy

This document sits at the top of the PMERIT documentation hierarchy:

```
PMERIT DOCUMENTATION HIERARCHY
│
├── 📄 Pmerit_Project_Document.md (THIS FILE) — MASTER DOCUMENT
│       ├── Strategic roadmap (WHY)
│       ├── Decision registry (WHAT was decided)
│       ├── Task carryforward (WHAT's next)
│       └── Session history (WHEN)
│
├── 📁 docs/handoffs/
│   └── 📄 BRAINSTORM_ASU_LIKE_SCHEMA.md — FEATURE SPECIFICATIONS
│       ├── PART 0: Front Page Shell (Header, CTAs, Auth)
│       ├── PART 1-5: User Journey (Catalog → Classroom → Assessment)
│       ├── PART 6: Platform Feasibility Strategies
│       ├── PART 7: Authentication & Security
│       ├── PART 8: Admin Interface Architecture
│       ├── PART 9: AADOS Integration
│       └── PART 10: UI Design System Standardization
│
├── 📁 docs/project/
│   └── 📄 Pmerit-comprehensively-narrative-users-and-Admin-Journey.md — USER STORIES
│
├── 📁 docs/aados/ — GOVERNANCE SYSTEM
│   ├── 📄 GOVERNANCE.md — Rules, phases, workflows
│   ├── 📄 TASK_TRACKER.md — Living status tracker
│   ├── 📄 STATE.json — Machine-readable state pointer
│   ├── 📄 PMERIT_MASTER_INSTRUCTIONS.md — Claude coordination
│   ├── 📄 PMERIT_OPERATIONAL_CHEAT_SHEET.md — Quick reference
│   └── 📄 ENVIRONMENTS.md — Environment definitions
│
├── 📁 docs/tech/ — TECHNICAL DOCUMENTATION
│   ├── 📄 API_DOCUMENTATION.md
│   ├── 📄 DEVELOPER_GUIDE.md
│   └── ... (other tech docs)
│
└── 📁 docs/archive/ — LEGACY/ARCHIVED
    └── 📄 Original_Ongoing-Plan_vs2.md — Legacy infrastructure plans
```

### Three Primary Documents

| Document | Role | Update Frequency |
|----------|------|------------------|
| **This Document** | Master roadmap, decisions, carryforward | Every session |
| **Brainstorm Schema** | Feature specifications (PARTs 0-10) | When features change |
| **User Journey** | User/Admin narrative flows | When UX changes |

---

## Three Track Types

PMERIT serves three distinct learner populations:

### 1. Global Remote (6 Pathways)

**Target**: Adults worldwide seeking remote-work-ready skills
**AI Tutor Persona**: Professor Ada (professional, mentor-like)

| Pathway | Duration | Courses | Outcome |
|---------|----------|---------|---------|
| Web Development | 32 weeks | 12 | Remote web developer |
| Data Analytics | 32 weeks | 12 | Remote data analyst |
| UX Design | 28 weeks | 12 | Remote UX designer |
| Digital Marketing | 24 weeks | 10 | Remote marketer |
| Project Management | 20 weeks | 8 | Remote PM |
| Technical Writing | 20 weeks | 8 | Remote tech writer |

### 2. Local Education (4 Pathways)

**Target**: K-12 students (initially Maine Learning Results aligned)
**AI Tutor Persona**: Ms. Sunshine (patient, encouraging)

| Pathway | Grade Range | Subjects | Outcome |
|---------|-------------|----------|---------|
| Elementary | K-5 | ELA, Math, Science, Social Studies | Grade promotion |
| Middle School | 6-8 | Core + Electives | Grade promotion |
| High School | 9-12 | Core + AP | Diploma equivalency |
| GED Prep | Adult | All subjects | GED certification |

### 3. Local Career (4 Pathways)

**Target**: Job seekers in vocational trades (initially Maine CTE aligned)
**AI Tutor Persona**: Coach Mike (hands-on, practical)

| Pathway | Duration | Industry Certs | Outcome |
|---------|----------|----------------|---------|
| Electrician | 12 months | OSHA 10, NEC | Apprenticeship ready |
| Healthcare | 10 months | CPR, Phlebotomy | Entry-level healthcare |
| Automotive | 12 months | ASE, OSHA | Shop technician |
| Culinary | 10 months | ServSafe, HACCP | Kitchen employment |

---

## Technical Architecture

### Serverless-First Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Hosting** | Cloudflare Pages | Static frontend, global CDN |
| **API** | Cloudflare Workers | Backend logic, API routing |
| **Storage** | Cloudflare R2 | Asset storage, RAG data |
| **Database** | Neon DB (Postgres + pgvector) | Serverless, auto-pause |
| **AI (Edge)** | Cloudflare Workers AI | Embedding, basic queries |
| **AI (Premium)** | OpenAI/Claude API | Complex tutoring |
| **GPU (On-Demand)** | RunPod/Lambda Labs | Unreal Virtual Human |

### Production URLs

| Environment | URL |
|-------------|-----|
| **Frontend** | https://pmerit.com |
| **API** | https://pmerit-api-worker.peoplemerit.workers.dev |
| **Database** | Neon Dashboard (65+ tables) |

### Repository Structure

| Repo | Purpose | Local Path |
|------|---------|------------|
| `pmerit-ai-platform` | Frontend, docs, partials | `E:\pmerit\pmerit-ai-platform` |
| `pmerit-api-worker` | API, Workers, AI logic | `E:\pmerit\pmerit-api-worker` |

---

## Implementation Phases

Following AADOS governance, implementation is **phase-gated**:

```
PHASE PROGRESSION
═══════════════════════════════════════════════════════════════

🏠 HOMEPAGE GATE ◄── CURRENT FOCUS (Cannot be skipped)
   │
   │ Requirements (from BRAINSTORM PART 0):
   │ ├── H1: No console errors
   │ ├── H2: Clean design
   │ ├── H3: AI chatbox functional
   │ ├── H4: Header CTAs (Start Learning, Sign In, Donate)
   │ ├── H5: Auth routing (/auth?action=start|signin)
   │ ├── H6: Donate page functional
   │ ├── H7: Language selector works
   │ ├── H8: Pricing page exists
   │ ├── H9: Mobile responsive
   │ └── H10: No broken assets
   │
   ▼ "HOMEPAGE GATE COMPLETE"

┌────────────────────────────────────────────────────────────────┐
│                       USER JOURNEY ARC                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Phase 0: AI Receptionist (Raise Hand feature)                 │
│      └── BRAINSTORM PART 3: Virtual Classroom                  │
│                                                                │
│  Phase 1: Assessment Entry                                     │
│  Phase 2: Assessment Flow                                      │
│      └── BRAINSTORM PART 4: Assessment & Proctoring            │
│                                                                │
│  Phase 3: Sign-Up & Onboarding                                 │
│      └── BRAINSTORM PART 7: Authentication & Security          │
│                                                                │
│  Phase 4: Dashboard & Courses                                  │
│      └── BRAINSTORM PART 1: Public Catalog Experience          │
│                                                                │
│  Phase 5: Virtual Classroom                                    │
│      └── BRAINSTORM PART 3: Session-based Learning             │
│                                                                │
│  Phase 6: Job Matching & Portfolio                             │
│      └── BRAINSTORM PART 2: Portfolio Projects                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                       ADMIN JOURNEY ARC                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Phase 7: Tier 1 Admin Portal                                  │
│  Phase 8: Tier 2 Accounts                                      │
│  Phase 9: Curriculum Management                                │
│  Phase 10: Audit & Reports                                     │
│      └── BRAINSTORM PART 8: Admin Interface Architecture       │
│                                                                │
└────────────────────────────────────────────────────────────────┘

🎉 PLATFORM COMPLETE
```

---

## Current State

### Completed

- [x] 65+ database tables in Neon DB
- [x] Cloudflare Pages + Workers infrastructure
- [x] Basic homepage with AI chatbox
- [x] MOSA architecture (partials, layout-loader.js)
- [x] Governance system (AADOS V5 FINAL)
- [x] Comprehensive brainstorm document (PARTS 0-9)

### In Progress

- [ ] Homepage Gate requirements (H1-H10)
- [ ] Header CTA implementation (Start Learning, Sign In, Donate)
- [ ] Auth routing (`/auth?action=start|signin`)
- [ ] Azure Translator on dynamic pages (H7)

### Blocked

| Item | Blocker | Since |
|------|---------|-------|
| RAG System | `env.AI` binding undefined | Session 20+ |
| Vector Embeddings | Depends on RAG | Session 20+ |

### Deferred

| Item | Reason | Revisit When |
|------|--------|--------------|
| MetaHuman Integration | Budget pending | Funding secured |
| NBS/BLS Live API | Lower priority | After Phase 6 |

---

## Decision Log

Implementation decisions are documented here for reference. Each decision includes context, options considered, and rationale.

### How to Add Decisions

```markdown
### DEC-XXX: [Brief Title]
**Date:** YYYY-MM-DD | **Session:** XX | **Decided By:** @peoplemerit

**Context:** [What problem or question arose]

**Options Considered:**
- A) [Option A]
- B) [Option B]
- C) [Option C]

**Decision:** [A/B/C or custom]

**Rationale:** [Why this choice]

**Impact:** [What changed as a result]
```

---

### DEC-001: Consolidate to Three Primary Documents
**Date:** 2025-12-05 | **Session:** Documentation Cleanup | **Decided By:** @peoplemerit

**Context:** Multiple overlapping project documents created confusion about source of truth.

**Options Considered:**
- A) Keep all documents, add index
- B) Consolidate to three primary documents
- C) Single monolithic document

**Decision:** B — Consolidate to three primary documents

**Rationale:** Three documents provide clear separation of concerns:
- This document: WHY (strategy, decisions, carryforward)
- Brainstorm: WHAT (feature specs)
- User Journey: WHO (user stories)

**Impact:**
- Deleted 19 obsolete files (-12,340 lines)
- Updated README.md, TASK_TRACKER.md, MASTER_INSTRUCTIONS.md
- Created pmerit.code-workspace

---

### DEC-002: UI Design System Standardization
**Date:** 2025-12-05 | **Session:** Documentation Cleanup | **Decided By:** @peoplemerit

**Context:** ChatGPT analysis revealed button/hover inconsistencies across pages.

**Options Considered:**
- A) Fix each page individually
- B) Create centralized CSS component system
- C) Document standards for future reference

**Decision:** C then B — Document first, implement later

**Rationale:** Document the standards (PART 10) to ensure consistent implementation when the CSS work begins.

**Impact:** Added PART 10: UI Design System Standardization to brainstorm document

---

## Task Carryforward

Incomplete tasks are carried forward between sessions. This section is updated at the end of each session.

### Format

```markdown
### CF-XXX: [Task Title]
**From Session:** XX | **Priority:** High/Medium/Low | **Phase:** GATE/0-10

**Description:** [What needs to be done]

**Blockers:** [Any dependencies or issues]

**Next Steps:**
1. [Step 1]
2. [Step 2]

**Reference:** [Link to brainstorm PART or other doc]
```

---

### CF-001: Azure Translator on Dynamic Pages (H7)
**From Session:** 25 | **Priority:** High | **Phase:** HOMEPAGE GATE

**Description:** Implement Microsoft Azure Translator for multi-language support across all pages. Deprecated Google Translate in favor of Azure Translator for better control and reliability.

**Blockers:** None — Azure Translator API configured in TR environment

**Next Steps:**
1. Integrate Azure Translator widget/API into layout-loader.js
2. Ensure language selector works on all dynamic pages
3. Test translation functionality across all pages

**Reference:** BRAINSTORM PART 0 (Section 0.4 - Responsiveness Requirements)

---

### CF-002: Implement Header CTA Strategy
**From Session:** N/A | **Priority:** High | **Phase:** HOMEPAGE GATE

**Description:** Implement the header CTA strategy defined in PART 0:
- Start Learning (primary button) → `/auth?action=start`
- Sign In (ghost/text) → `/auth?action=signin`
- Donate (outline button) → `/donate`

**Blockers:** None

**Next Steps:**
1. Update `/partials/header.html` with new CTA buttons
2. Create `/auth` page with query param handling
3. Create `/donate` page (MVP)

**Reference:** BRAINSTORM PART 0 (Sections 0.1, 0.2, 0.3)

---

### CF-003: Apply UI Design System Fixes
**From Session:** Current | **Priority:** Medium | **Phase:** HOMEPAGE GATE

**Description:** Apply the CSS fixes documented in PART 10 to standardize button styles across all pages.

**Blockers:** Depends on components.css location decision

**Next Steps:**
1. Create/update `components.css` with button reset and standardization
2. Audit each page for inline styles and legacy classes
3. Test all button states (default, hover, focus, active)

**Reference:** BRAINSTORM PART 10 (UI Design System Standardization)

---

## Session History

Record of development sessions for continuity.

| Session | Date | Focus | Key Outcomes | Handoff |
|---------|------|-------|--------------|---------|
| 25 | 2024-11-29 | Governance V5 | AADOS system finalized | TASK_TRACKER.md |
| 26 | 2024-12-04 | Brainstorm PARTs 6-9 | Platform feasibility, auth, admin | BRAINSTORM updated |
| 27 | 2024-12-05 | Doc Consolidation | 3 primary docs, 19 files deleted, workspace setup | This document |

---

## Pricing Model

### Freemium Structure

| Tier | Price | Target | Features |
|------|-------|--------|----------|
| **Free** | $0/mo | Low-income, low-bandwidth | Full courses, GPT-3.5 tutor, cartoon avatar, offline PWA |
| **Premium** | ~$9.99/mo | Better connectivity | GPT-4 tutor, realistic TTS, Unreal Virtual Human |

### Revenue Philosophy

```
Mission Alignment:
├── FREE tier is fully functional for education (core mission)
├── PREMIUM tier funds infrastructure and API costs
└── Alternative funding: Grants, government contracts, donations
```

---

## Key Documentation References

### For Feature Specifications (WHAT to Build)

📄 **`docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md`**

| PART | Topic |
|------|-------|
| PART 0 | Front Page Shell — Header CTAs, Auth, Donate |
| PART 1 | Public Catalog Experience (ASU.edu style) |
| PART 2 | Student Registration & Class Management |
| PART 3 | Virtual Classroom Experience (Raise Hand, Sessions) |
| PART 4 | Assessment & Proctoring |
| PART 5 | Implementation Flow (Phased Roadmap) |
| PART 6 | Platform Feasibility Strategies |
| PART 7 | Authentication & Security |
| PART 8 | Admin Interface Architecture |
| PART 9 | AADOS Integration Recommendations |

### For Workflow Governance (HOW to Work)

📄 **`docs/aados/GOVERNANCE.md`** — Rules, phases, escalation
📄 **`docs/aados/TASK_TRACKER.md`** — Living status
📄 **`docs/aados/MASTER_INSTRUCTIONS.md`** — Claude coordination

### For User Stories

📄 **`docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md`**

- Amaka's Story (Global Remote → Data Analytics → Remote Job)
- Chidi's Story (Local Education → K-12 with parent guardian)
- Bola's Story (Local Career → Electrician → IBEW Apprenticeship)

---

## Quick Start for Development

### Session Start

```powershell
# 1. Navigate to repo
cd E:\pmerit\pmerit-ai-platform

# 2. Verify sync
git fetch origin && git status

# 3. Start work
# Say "PMERIT CONTINUE" to Claude
```

### Key Commands

| Command | Effect |
|---------|--------|
| `PMERIT CONTINUE` | Auto-resume from current phase |
| `PMERIT STATUS` | Show status without starting work |
| `PMERIT QUICK FIX: [desc]` | Light mode for minor fixes |
| `DONE` | Confirm step completion |
| `EXTEND: [H#]` | Grant 2 more attempts |

---

## Infrastructure (Legacy Reference)

For detailed infrastructure plans (Docker, Ollama, encryption, backups), see:

📄 **`docs/archive/Original_Ongoing-Plan_vs2.md`**

This legacy document contains:
- Docker Compose configurations
- Cloudflare tunnel setup
- Oracle ADB integration
- Ollama AI model management
- Backup and disaster recovery procedures
- LUKS encryption setup

**Note:** Infrastructure plans are archived. Current focus is on feature implementation through the phase-gated system.

---

## Contact & Governance

| Role | Identity | Authority |
|------|----------|-----------|
| **Solo Developer / Tier 1 Admin** | @peoplemerit | Final decision authority on all conflicts |
| **AI Assistants** | Claude (Web & Code Desktop) | Implementation and analysis |

### Decision Authority

| Decision Type | Who Decides |
|---------------|-------------|
| Workflow vs. Implementation conflicts | Solo Developer (final say) |
| Technical approach | Claude recommends, Solo Developer approves |
| Phase progression | Governed by gates |
| Emergency bypasses | Solo Developer only |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-04 | Initial consolidated document |
| 2.0 | 2025-12-05 | Added document workflow, decision log, task carryforward, session history; Updated hierarchy to reflect 3 primary docs |

---

*This is the MASTER DOCUMENT for PMERIT development.*
*Decisions made during implementation are documented here.*
*Incomplete tasks are carried forward between sessions.*
*For detailed feature specifications, see `docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md`.*
*For workflow governance, see `docs/aados/`.*
