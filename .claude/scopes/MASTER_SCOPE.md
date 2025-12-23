# PMERIT MASTER SCOPE

**Version:** 3.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-22 (Session 70)
**Status:** ACTIVE
**Purpose:** Consolidated project vision — single source of truth for all sub-scopes
**Scope Count:** 25 active scopes (24 + 1 launch cleanup)

---

## 1. PROJECT IDENTITY

| Attribute | Value |
|-----------|-------|
| **Project Name** | PMERIT (People Merit) |
| **Mission** | Free AI-powered education to liberate people from poverty |
| **Target Users** | 3+ billion potential learners globally |
| **Core Model** | AI tutors (no human instructors) |
| **Business Model** | Free tier (full content) + Premium tiers (enhanced experience) |
| **Infrastructure** | Hybrid cloud + self-hosted for premium services |

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
| ARCH-006 | Avatar Rendering (Free) | Three.js WebGL + jaw bone lip sync | Free tier sustainability | 2025-12-11 |
| ARCH-007 | Avatar Model (Free) | Ready Player Me (pmerit-tutor-no-morph.glb) | Professional appearance | 2025-12-11 |
| ARCH-008 | Self-Hosted Infrastructure | Dell R740 + 2x RTX 4090 | Premium services at scale | 2025-12-19 |
| ARCH-009 | Self-Hosted Avatar | Unreal MetaHuman + Audio2Face + Pixel Streaming | Photorealistic experience | 2025-12-19 |
| ARCH-010 | Self-Hosted TTS | Coqui XTTS v2 | Voice cloning, natural speech | 2025-12-19 |
| ARCH-011 | Self-Hosted LLM | Llama 3 70B | Zero API costs, fine-tunable | 2025-12-19 |

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

PREMIUM LAYERS
├── Free Tier ($0)
│   ├── All courses and content
│   ├── Basic AI tutor (Cloudflare Workers AI)
│   ├── WebGL 3D avatar (Three.js)
│   └── Robotic TTS voice
│
├── Cloud Premium ($2.99/month)
│   ├── Everything in Free
│   ├── Natural TTS voices (Piper)
│   ├── Priority support
│   └── Verified certificates
│
└── Self-Hosted Premium ($10-20/month)
    ├── Everything in Cloud Premium
    ├── Photorealistic MetaHuman avatar
    ├── Voice cloning (XTTS)
    ├── Perfect lip sync (Audio2Face)
    ├── Local LLM (Llama 3 70B)
    └── 100% on-premise data processing
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

### Infrastructure (Cloud)

| Component | Technology |
|-----------|------------|
| CDN | Cloudflare |
| DNS | Cloudflare |
| SSL | Cloudflare Universal |
| Monitoring | Cloudflare Analytics |
| Premium GPU | RunPod (on-demand) |

### Infrastructure (Self-Hosted Premium)

| Component | Technology |
|-----------|------------|
| Server | Dell PowerEdge R740 |
| GPUs | 2x NVIDIA RTX 4090 (24GB each) |
| CPU | Dual Xeon Scalable (up to 56 cores) |
| RAM | Up to 3TB DDR4 |
| Connection | Cloudflare Tunnel |
| TTS | Coqui XTTS v2 |
| Avatar | Unreal Engine 5 MetaHuman |
| Lip Sync | NVIDIA Audio2Face |
| LLM | Llama 3 70B (local) |
| Streaming | Pixel Streaming (WebRTC) |

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

## 7. SUB-SCOPES INDEX (Complete Registry)

### 7.1 GATE & CORE USER JOURNEY (Complete)

| Scope File | Feature | Status | Phase |
|------------|---------|--------|-------|
| SCOPE_HOMEPAGE.md | Homepage gate (H1-H10) | Complete | Gate |
| SCOPE_Select_Language.md | Multi-language modal (H7) | Audited | Gate |
| SCOPE_ASSESSMENT.md | Assessment flow (P1-P2) | Complete | P1-P2 |
| SCOPE_DASHBOARD.md | Student dashboard (P3-P4) | Complete | P3-P4 |
| SCOPE_CLASSROOM.md | Virtual classroom (P5) | Complete | P5 |
| SCOPE_ENROLLMENT.md | Course enrollment | Complete | P2 |

### 7.2 CONTENT & CATALOG

| Scope File | Feature | Status | Priority |
|------------|---------|--------|----------|
| SCOPE_courses.md | Course catalog & management | Implemented | P1 |
| SCOPE_Learning_Pathways.md | Pathway catalog with three-track arch | Complete | P1 |
| SCOPE_CONTENT_SOURCES.md | External OER integration (freeCodeCamp, MOOSE) | Partial | P2 |

### 7.3 AI & AVATAR SYSTEM

| Scope File | Feature | Status | Priority |
|------------|---------|--------|----------|
| SCOPE_AVATAR.md | Avatar system (Free + Self-Hosted) | Complete | P3 |
| SCOPE_TTS.md | Text-to-Speech (Free + Premium + Self-Hosted) | Complete | P3 |
| SCOPE_AI_PERSONAS.md | Age-appropriate AI tutor personas | Partial | P1 |

### 7.4 THREE-TRACK ARCHITECTURE

| Scope File | Feature | Status | Priority |
|------------|---------|--------|----------|
| SCOPE_K12_EDUCATION.md | Track 2: Maine K-12 grade structure | Not Started | P1 |
| SCOPE_CTE_VOCATIONAL.md | Track 3: CTE/Trade certification prep | Not Started | P1 |
| SCOPE_PARENT_PORTAL.md | Parent/guardian dashboard for K-12 | Not Started | P0 |

### 7.5 MONETIZATION & PAYMENTS

| Scope File | Feature | Status | Priority |
|------------|---------|--------|----------|
| SCOPE_pricing.md | Pricing tiers (Free/Premium/Self-Hosted) | Frontend Complete | P2 |
| SCOPE_donate.md | Donation system | Frontend Complete | P2 |
| SCOPE_PAYMENTS.md | Stripe integration & subscriptions | Partial (DB only) | P2 |

### 7.6 INFRASTRUCTURE & PREMIUM

| Scope File | Feature | Status | Priority |
|------------|---------|--------|----------|
| SCOPE_SELF_HOSTED_PREMIUM.md | Dell R740 infrastructure | Planned | P3 |
| SCOPE_EMAIL_SYSTEM.md | Official email system (Resend) | In Progress | P2 |

### 7.7 PLATFORM FOUNDATION

| Scope File | Feature | Status | Priority |
|------------|---------|--------|----------|
| SCOPE_PROGRESS.md | Unified progress tracking | Partial | P0 |
| SCOPE_SECURITY.md | Platform security & AI police | Partial | P0 |
| SCOPE_THEME.md | Platform theme & design system | Draft | P2 |
| SCOPE_NOTIFICATIONS.md | Email & in-app notifications | Not Started | P2 |
| SCOPE_OFFLINE_PWA.md | Offline & PWA support | Not Started | P2 |

### 7.8 ADMIN & CREDENTIALS

| Scope File | Feature | Status | Priority |
|------------|---------|--------|----------|
| SCOPE_ADMIN.md | Admin portal (P7-P10) | Phase B Complete | P4 |
| SCOPE_CREDENTIALS.md | Blockchain credentials (ARCH-2/3) | Not Started | P5 |

### 7.9 LAUNCH

| Scope File | Feature | Status | Trigger |
|------------|---------|--------|---------|
| SCOPE_LAUNCH_CLEANUP.md | Banner removal, final cleanup | Not Started | Feb 2026 |

### 7.10 NON-SCOPE FILES (Archived)

These files exist in `/scopes/` but are **not formal scopes**:

| File | Type | Action |
|------|------|--------|
| Start_Learning.md | Empty/stub | Archive |
| Sign_In_Sign_Up.md | Documentation | Move to docs/ |
| Research_with_Copilot.md | Research notes | Move to docs/ |
| SCOPE_TEMPLATE.md | Template | Keep as reference |
| SCOPE_courses_backup.md | Backup | Delete |

---

## 8. REFERENCE DOCUMENTS

| Document | Path | Purpose |
|----------|------|---------|
| Architecture Spec | docs/project/PMERIT_ARCHITECTURE_FINAL.md | Complete architecture |
| Feature Spec | docs/project/PMERIT_FEATURE_SPEC.md | Platform feature specification |
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
