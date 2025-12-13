# PMERIT MASTER SCOPE

**Version:** 1.0
**Created:** 2025-12-12
**Status:** ACTIVE
**Purpose:** Consolidated project vision — single source of truth for all sub-scopes

---

## 1. PROJECT IDENTITY

| Attribute | Value |
|-----------|-------|
| **Project Name** | PMERIT (People Merit) |
| **Mission** | Free AI-powered education to liberate people from poverty |
| **Target Users** | 3+ billion potential learners globally |
| **Core Model** | AI tutors (no human instructors) |
| **Business Model** | Free tier (full content) + Premium tier (enhanced experience) |

---

## 2. THREE-TRACK EDUCATIONAL MODEL

### Track Overview

| Track | Name | Target | AI Persona | Structure |
|-------|------|--------|------------|-----------|
| **Track 1** | Global Remote | Adults seeking remote careers | Professor Ada | Pathway → Course → Module → Lesson |
| **Track 2** | Local Education | K-12 (Maine-aligned) | Age-appropriate personas | Grade → Subject → Unit → Lesson |
| **Track 3** | Local Career | Trade/vocational seekers | Coach Mike | Cluster → Pathway → Certification → Module |

### Track 1: Global Remote (6 Pathways)

- Web Development
- Data Analytics
- UX Design
- Digital Marketing
- Project Management
- Business Analysis

### Track 2: Local Education (Maine K-12)

| Grade Span | Grades | AI Persona |
|------------|--------|------------|
| Childhood | K-5 | Ms. Sunshine (K-2), Mr. Explorer (3-5) |
| Early Adolescence | 6-8 | Coach Jordan |
| Adolescence | 9-Diploma | Mentor Alex |

**Subjects:** ELA, Math, Science, Life & Career Readiness

### Track 3: Local Career (4 Clusters)

- Construction Trades (Electrical, Plumbing, HVAC)
- Healthcare (CNA, Medical Admin, EMT Prep)
- Manufacturing (Welding, CNC, Quality Control)
- Transportation (CDL Prep, Auto Tech, Logistics)

---

## 3. LOCKED ARCHITECTURAL DECISIONS

These decisions are FINAL. Changes require explicit approval.

| ID | Decision | Choice | Rationale | Date |
|----|----------|--------|-----------|------|
| ARCH-001 | AI Tutor Access | Enrolled students only | Not public catalog | 2025-12-09 |
| ARCH-002 | Grade Spans | Maine exact (K-5, 6-8, 9-Diploma) | Standards alignment | 2025-12-09 |
| ARCH-003 | Credential System | 5-level with Polygon blockchain | Student ownership | 2025-12-09 |
| ARCH-004 | Parent Portal | Required for minors | Legal compliance | 2025-12-09 |
| ARCH-005 | Content Model | Curator (MOOSE, freeCodeCamp, OSHA) | Scale + quality | 2025-12-09 |
| ARCH-006 | Avatar Rendering | Three.js WebGL + jaw bone lip sync | Free tier sustainability | 2025-12-11 |
| ARCH-007 | Avatar Model | Ready Player Me (pmerit-tutor-no-morph.glb) | Professional appearance | 2025-12-11 |

---

## 4. PLATFORM LAYERS

```
PUBLIC LAYER (No Login)
├── Homepage with track exploration
├── Course catalog (browse only)
├── Program information
└── NO AI Tutor / NO Classroom access

AUTHENTICATED LAYER (Login Required)
├── Student Dashboard (enrolled courses)
├── Parent Dashboard (K-12 oversight)
├── Virtual Classroom + AI Tutor
├── Progress tracking & assessments
└── Credential wallet
```

---

## 5. TECHNOLOGY STACK

### Frontend (pmerit-ai-platform)

| Component | Technology |
|-----------|------------|
| Framework | Vanilla JS + HTML5 + CSS3 |
| 3D Rendering | Three.js WebGL |
| Avatar | Ready Player Me (.glb) |
| TTS | Cloudflare Workers AI |
| Hosting | Cloudflare Pages |

### Backend (pmerit-api-worker)

| Component | Technology |
|-----------|------------|
| Runtime | Cloudflare Workers |
| AI | Cloudflare Workers AI (Llama) |
| Database | Neon PostgreSQL (96 tables) |
| Auth | JWT + PBKDF2 |
| Email | Resend (DKIM/SPF verified) |

### Infrastructure

| Component | Technology |
|-----------|------------|
| CDN | Cloudflare |
| DNS | Cloudflare |
| SSL | Cloudflare Universal |
| Monitoring | Cloudflare Analytics |

---

## 6. CURRENT PRODUCTION STATUS

**As of Session 49 (2025-12-11)**

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | Healthy | Mobile responsive, dark mode |
| Backend API | Healthy | v2.2.0, 40+ endpoints |
| AI Services | Healthy | Chat, Support, Tutor |
| Database | Healthy | 96 tables |
| Avatar | Healthy | Jaw bone lip sync working |
| TTS | Healthy | WAV audio streaming |

---

## 7. SUB-SCOPES INDEX

| Scope File | Feature | Status | Priority |
|------------|---------|--------|----------|
| SCOPE_HOMEPAGE.md | Homepage gate (H1-H10) | Complete | Gate |
| SCOPE_ASSESSMENT.md | Assessment flow (P1-P2) | Complete | P1 |
| SCOPE_DASHBOARD.md | Student dashboard (P3-P4) | Complete | P2 |
| SCOPE_CLASSROOM.md | Virtual classroom (P5) | Complete | P3 |
| SCOPE_AVATAR.md | Avatar system | Complete | P3 |
| SCOPE_ENROLLMENT.md | Course enrollment | Complete | P2 |
| SCOPE_ADMIN.md | Admin portal (P7-P10) | Not Started | P4 |
| SCOPE_CREDENTIALS.md | Blockchain credentials | Not Started | P5 |

---

## 8. REFERENCE DOCUMENTS

| Document | Path | Purpose |
|----------|------|---------|
| Architecture Spec | docs/project/PMERIT_ARCHITECTURE_FINAL.md | Complete architecture |
| Feature Spec | docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md | Feature details |
| User Journey | docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md | User flows |
| Project Document | docs/project/Pmerit_Project_Document.md | Master roadmap |
| Governance | docs/aados/GOVERNANCE.md | Workflow rules |
| State | docs/aados/STATE.json | Current state |

---

## 9. WORKFLOW CONTEXT

### Team Structure

| Role | Participant | Responsibility |
|------|-------------|----------------|
| Architect | Claude Web | Strategy, prompts, brainstorming |
| Director | You (Solo Dev) | Decisions, coordination, git ops |
| Implementer | Claude Code | Code execution, quality review |

### Workflow Cycle

```
1. Claude Web + You → Define feature spec
2. You → Send spec to Claude Code
3. Claude Code → Review, recommend, implement
4. Claude Code → Update scope file
5. You → Share output with Claude Web
6. Claude Web → Provide follow-up
7. Repeat
```

---

## 10. QUALITY GATES

### Career Relevance Filter (All Courses)

- [ ] Skill appears in job postings?
- [ ] Employers test for this in interviews?
- [ ] Required for industry certification?
- [ ] Builds portfolio-worthy projects?

**Rule:** At least ONE must be checked

### Homepage Gate (H1-H10)

Must pass before any phase work.

### Phase Gates

Each phase must complete before next unlocks.

---

*This document consolidates the project vision. Sub-scopes derive from this master.*
