**There's patch at the end of this document; the patch will need to be integrated into this document on the next update ***.

# PMERIT Project Document

**Version:** 3.0
**Last Updated:** December 9, 2025
**Status:** Architecture Implementation Phase
**Document Purpose:** Master source of truth for PMERIT platform — roadmap, decisions, and task tracking
**Architecture Spec:** [PMERIT_ARCHITECTURE_FINAL.md](./PMERIT_ARCHITECTURE_FINAL.md) — APPROVED v1.1

---

## How This Document Works

This is the **MASTER DOCUMENT** for the PMERIT project. It serves as:

1. **Strategic Roadmap** — WHY we're building and WHERE we're going
2. **Decision Registry** — Implementation decisions made during development
3. **Task Carryforward** — Incomplete tasks carried between sessions
4. **Session History** — Record of development sessions
5. **Architecture Reference** — Links to approved architecture specification

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
├── 📄 PMERIT_ARCHITECTURE_FINAL.md — **ARCHITECTURE SPECIFICATION** ⭐
│       ├── Three-Track Model (Global Remote, Local Education, Local Career)
│       ├── Blockchain Credentialing (5-level hierarchy)
│       ├── AI Tutor Personas (6 personas by track/age)
│       ├── Parent Portal Requirements
│       └── Database Schema Requirements
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
│   ├── 📄 PRODUCTION_AUDIT_[DATE].md — Latest audit report
│   └── 📄 archive/ — Archived audits
│
├── 📁 docs/tech/ — TECHNICAL DOCUMENTATION
│   ├── 📄 API_DOCUMENTATION.md
│   ├── 📄 DEVELOPER_GUIDE.md
│   └── ... (other tech docs)
│
└── 📁 docs/archive/ — LEGACY/ARCHIVED
    └── 📄 Original_Ongoing-Plan_vs2.md — Legacy infrastructure plans
```

### Four Primary Documents

| Document | Role | Update Frequency |
|----------|------|------------------|
| **This Document** | Master roadmap, decisions, carryforward | Every session |
| **Architecture Spec** | Three-track model, credentials, AI personas | When architecture changes |
| **Brainstorm Schema** | Feature specifications (PARTs 0-10) | When features change |
| **User Journey** | User/Admin narrative flows | When UX changes |

---

## Three Track Types

**Full Specification:** See [PMERIT_ARCHITECTURE_FINAL.md](./PMERIT_ARCHITECTURE_FINAL.md) for complete details.

PMERIT serves three distinct learner populations:

### Track 1: Global Remote (6 Pathways)

**Target**: Adults worldwide seeking remote-work-ready skills
**AI Tutor Persona**: Professor Ada (professional, mentor-like)
**Structure**: Pathway → Course → Module → Lesson

| Pathway | Target Outcome | Course Count |
|---------|----------------|--------------|
| Web Development | Full-Stack Developer | 7 |
| Data Analytics | Data Analyst | 7 |
| UX Design | UX/UI Designer | 7 |
| Digital Marketing | Marketing Specialist | 7 |
| Project Management | Project Manager | 7 |
| Business Analysis | Business Analyst | 7 |

**Career Relevance Filter (REQUIRED):** Every course must pass at least ONE:
- Does this skill appear in job postings?
- Will employers test for this in interviews?
- Is this required for industry certification?
- Does this build portfolio-worthy projects?

### Track 2: Local Education (Maine K-12)

**Target**: K-12 students (Maine Learning Results aligned)
**Structure**: Grade Span → Grade → Subject → Unit → Lesson
**Grade Spans**: Childhood (K-5), Early Adolescence (6-8), Adolescence (9-Diploma)

**AI Tutor Personas (Age-Appropriate):**
| Grade Span | Persona | Tone |
|------------|---------|------|
| K-2 | Ms. Sunshine | Playful, encouraging |
| 3-5 | Mr. Explorer | Curious, supportive |
| 6-8 | Coach Jordan | Relatable, guiding |
| 9-12 | Mentor Alex | Academic, preparing |

**Career-Focused Subjects Only:**
| Subject | Code | Career Foundation |
|---------|------|-------------------|
| English Language Arts | ELA | Communication, technical writing |
| Mathematics | MATH | Logic, problem-solving, data literacy |
| Science & Engineering | SCI | Computational thinking, inquiry |
| Life & Career Readiness | LCR | Direct career skills, financial literacy |

### Track 3: Local Career (CTE/Vocational)

**Target**: Job seekers in vocational trades (Maine CTE aligned)
**AI Tutor Persona**: Coach Mike (practical, hands-on, safety-focused)
**Structure**: Cluster → Pathway → Certification → Module → Lesson

| Cluster | Pathways | Example Certifications |
|---------|----------|----------------------|
| Construction Trades | Electrical, Plumbing, HVAC | OSHA 10, Pre-Apprenticeship |
| Healthcare | CNA, Medical Admin, EMT Prep | First Aid/CPR, Medical Terminology |
| Manufacturing | Welding, CNC, Quality Control | Safety Certs, Blueprint Reading |
| Transportation | CDL Prep, Auto Tech, Logistics | DOT Compliance, Vehicle Systems |

**Legal Positioning (CRITICAL):**
| ❌ DO NOT CLAIM | ✅ DO CLAIM |
|-----------------|-------------|
| "Earn certification" | "Prepare for certification exams" |
| "Complete required hours" | "Pre-apprenticeship preparation" |
| "Become licensed" | "Master concepts tested in licensing" |

---

## Key Architecture Decisions (CONFIRMED)

Per [PMERIT_ARCHITECTURE_FINAL.md](./PMERIT_ARCHITECTURE_FINAL.md):

| Decision | Choice | Status |
|----------|--------|--------|
| AI Tutor Access | Enrolled students only (not public catalog) | ✅ CONFIRMED |
| Grade Spans | Maine exact (K-5, 6-8, 9-Diploma) | ✅ CONFIRMED |
| Subjects | Career-focused (ELA, Math, Science, LCR) | ✅ CONFIRMED |
| Credentials | 5-level hierarchy with Polygon blockchain | ✅ CONFIRMED |
| Parent Portal | Required for minors from start | ✅ CONFIRMED |
| Content Sources | Curator model (MOOSE, freeCodeCamp, OSHA) | ✅ CONFIRMED |
| Credential Sharing | Private by default | ✅ CONFIRMED |
| Integrity Display | Full transparency (score + proctoring level) | ✅ CONFIRMED |

---

## Credential Hierarchy (5 Levels)

| Level | Type | Blockchain? | Description |
|-------|------|-------------|-------------|
| 1 | Micro-Credential | ❌ No | Lesson/skill completion (database only) |
| 2 | Module Badge | ⚡ Batched | Module completion (weekly batches) |
| 3 | Course Certificate | ✅ Yes | Course completion with assessment |
| 4 | Career-Ready Credential | ✅ Yes | Pathway completion |
| 5 | PMERIT Diploma | ✅ Yes | Track completion |

**Blockchain**: Polygon (Layer-2 Ethereum) — ~$0.001 per transaction

---

## Legacy: Local Education (Previous Structure)

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
| **Database** | Neon DB (Postgres + pgvector) | Serverless, auto-pause, 82+ tables |
| **AI (Edge)** | Cloudflare Workers AI | Embedding, basic queries |
| **AI (Premium)** | OpenAI/Claude API | Complex tutoring |
| **Email** | Resend | Transactional emails (verification, password reset) |
| **GPU (On-Demand)** | DigitalOcean GPU Droplets | Unreal MetaHuman streaming |

### Digital Desk (Virtual Classroom Enhancement) Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Proctor Controller** | JavaScript (proctor-controller.js, 1200 lines) | Exam session management, violation detection, timer |
| **Vision AI** | TensorFlow.js + MediaPipe FaceMesh | Face detection, gaze tracking, privacy controls |
| **GPU Streaming** | WebRTC + Pixel Streaming | Tiered avatar rendering (Free/Standard/Premium) |
| **Avatar Rendering** | CSS/SVG (Free), WebGL (Standard), Unreal (Premium) | Bandwidth-adaptive avatar quality |

### Digital Desk Avatar Tiers

| Tier | Min Bandwidth | Technology | Cost |
|------|---------------|------------|------|
| **Free** | 0 Mbps | CSS/SVG animations | $0 |
| **Standard** | 5 Mbps | WebGL 3D rendering | $0 |
| **Premium** | 25 Mbps | Unreal MetaHuman via GPU streaming | ~$2.68/hr |
| **Fallback** | N/A | Static image | $0 |

### Production URLs

| Environment | URL |
|-------------|-----|
| **Frontend** | https://pmerit.com |
| **API** | https://pmerit-api-worker.peoplemerit.workers.dev |
| **Database** | Neon Dashboard (82+ tables) |

### Repository Structure

| Repo | Purpose | Local Path |
|------|---------|------------|
| `pmerit-ai-platform` | Frontend, docs, partials | `E:\pmerit\pmerit-ai-platform` |
| `pmerit-api-worker` | API, Workers, AI logic | `E:\pmerit\pmerit-api-worker` |

---

## Production Status Snapshot

**Last Verified:** 2025-12-23 (Session 71 — Security Dashboard Complete)
**Audit Report:** [docs/aados/PRODUCTION_AUDIT_2025-12-09.md](../aados/PRODUCTION_AUDIT_2025-12-09.md)

### Platform Health

| Component | Status | Version/Details | Notes |
|-----------|--------|-----------------|-------|
| Frontend | ✅ Healthy | pmerit.com | 25 HTML pages (all return 200/308→200) |
| Backend API | ✅ Healthy | v2.2.0 | **40 endpoints** listed in health check |
| Database | ✅ Active | Neon PostgreSQL | **82 tables** verified via API |
| AI Services | ✅ Operational | Workers AI | Chat, Support, Tutor all streaming |
| TTS Service | ✅ Operational | Workers AI | Returns audio/mpeg (104KB tested) |
| Email Service | ✅ Operational | Resend | DKIM/SPF verified |
| Vectorize | ✅ Available | pmerit-knowledge-base | RAG index ready |
| Digital Desk | ⚠️ Needs Investigation | Model path mismatch | Avatar rendering needs browser test |
| Exam API | ✅ Deployed | 6 endpoints | Session management, violations, submit |
| GPU API | ✅ Deployed | 7 endpoints | 3 tiers, 4 regions |

### Security Status (Session 71)

| Component | Status | Details | Verified |
|-----------|--------|---------|----------|
| AI Police | ✅ Active | 17 injection patterns, PII masking, age-tier filtering | 2025-12-23 |
| Security Headers | ✅ Grade A | HSTS, CSP, X-Content-Type-Options, X-Frame-Options, etc. | SecurityHeaders.com |
| Admin Security Dashboard | ✅ Live | 8 API endpoints + full UI | /admin/security.html |
| Blocklist Management | ✅ Available | IP, user, pattern blocks with duration | API endpoints active |
| Rate Limiting | ⚠️ Basic | Cloudflare default, enhanced rate limiting pending | Phase 3 |
| 2FA for Admins | ❌ Not Started | Phase 5 | - |
| Email Uniqueness | ✅ Active | Prevents duplicate accounts with same email | Session 79 |
| Duplicate Prevention | 📋 Planned | See Session 80 decision below | - |

**Security Dashboard Access:** https://pmerit.com/admin/security.html (Tier 1 admins only)

**SCOPE_SECURITY Status:** Phase 1, 2, 4 complete; Phase 3, 5-7 pending

### Session 80 Decision — Duplicate Account Prevention (2025-12-25)

**Context:** During K-12 registration testing, confirmed email uniqueness check works correctly. User requested documentation of additional security controls for future implementation.

**Current Protection (Active):**
| Control | Status | Implementation |
|---------|--------|----------------|
| Email uniqueness | ✅ Active | Database constraint + API validation |

**Planned Controls (Priority Order):**
| Priority | Control | Description | Effort |
|----------|---------|-------------|--------|
| 🔴 High | Disposable email blocking | Block ~500 disposable domains (mailinator, tempmail, etc.) | Low |
| 🔴 High | Registration rate limiting | Limit to 5 registrations/hour per IP | Medium |
| 🟡 Medium | CAPTCHA | reCAPTCHA v3 or hCaptcha on registration | Medium |
| 🟡 Medium | Child DOB+Name warning | Warn if same child name + DOB exists under different parent | Medium |
| 🟢 Low | Phone verification | Optional phone number verification | High |
| 🟢 Low | Device fingerprinting | Track browser/device signatures | High |

**Decision:** Document now, implement as part of SCOPE_SECURITY Phase 3 (Rate Limiting) and Phase 6 (Enhanced Registration Security).

### Session 43 Key Finding — Avatar Model Mismatch

| Component | Model Path in Code | Actually Deployed |
|-----------|-------------------|-------------------|
| AvatarManager.js (Line 22) | `pm_classic.glb` | N/A |
| GPUStreaming.js (Line 42) | `Ty.glb` | N/A |
| Production Assets | — | `humano_professional.glb` (67MB, HTTP 200) |

**Impact:** JavaScript files reference models that may not exist. The deployed 67MB model may not be loading.

**Resolution Required:** Update model paths in AvatarManager.js and gpu-streaming.js to point to `humano_professional.glb`

### Current Capabilities (Verified in Production)

| Feature | Status | Since Session | Test Method |
|---------|--------|---------------|-------------|
| Homepage Chatbox | ✅ Operational | 29 | POST /api/v1/ai/chat returns streaming |
| Pathways Catalog | ✅ Operational | 24 | GET /api/v1/pathways returns 14 items |
| Courses Catalog | ✅ Operational | 24 | GET /api/v1/courses returns 42 items |
| Personality Assessment | ✅ Operational | 28 | Full 120-question flow working |
| Big Five Scoring | ✅ Operational | 28 | Percentiles calculated correctly |
| Holland Code | ✅ Operational | 28 | RIASEC codes generated |
| Career Matching | ✅ Operational | 28 | Careers with salary/education shown |
| PDF Export | ✅ Operational | 28 | Results downloadable as PDF |
| Customer Service Mode | ✅ Available | 27 | POST /api/v1/ai/support endpoint active |
| Virtual Human Tutor | ✅ Available | 27 | POST /api/v1/ai/tutor endpoint active |
| Text-to-Speech | ✅ Available | 27 | POST /api/v1/tts endpoint active |
| User Authentication | ✅ Operational | 31 | 8 auth endpoints (register, login, verify, etc.) |
| Email Verification | ✅ Operational | 34 | Resend integration with HTML templates |
| Two-Tier Dashboard | ✅ Operational | 34 | account.html (gate) + dashboard.html (portal) |
| Virtual Classroom | ✅ Operational | 36 | Full classroom session API integration |
| Digital Desk Proctor | ✅ Frontend Ready | 37 | proctor-controller.js with violation detection |
| Digital Desk Vision AI | ✅ Frontend Ready | 37 | vision-ai.js with TensorFlow.js face detection |
| Digital Desk GPU Streaming | ✅ Frontend Ready | 37 | gpu-streaming.js with tiered avatar rendering |
| Exam Session API | ✅ Operational | 38 | 6 endpoints for proctored exam management |
| GPU Provisioning API | ✅ Operational | 38 | 7 endpoints for GPU streaming management |
| Language Modal | ⚠️ Partial | 24 | Modal shows "No languages found" |

### API Endpoints Summary

```
Backend: https://pmerit-api-worker.peoplemerit.workers.dev

Verified Working (40):
├── GET  /                              Health check
├── GET  /api/v1/pathways               Curriculum pathways
├── GET  /api/v1/courses                Course catalog
├── GET  /api/v1/db/verify              Database verification
├── GET  /api/v1/db/tables              List database tables
├── POST /api/v1/ai/chat                General AI chat
├── POST /api/v1/ai/support             Customer Service AI
├── POST /api/v1/ai/tutor               Virtual Human Tutor
├── POST /api/v1/ai/assessment          Assessment Analysis
├── POST /api/v1/ai/careers             Career Matching
├── POST /api/v1/assessment/submit      Submit assessment
├── GET  /api/v1/assessment/results/:id Get results
├── POST /api/v1/tts                    Text-to-speech (CONFIRMED WORKING Session 40)
├── GET  /api/v1/tts/quota              TTS quota status
├── GET  /api/v1/virtual-human/avatars  Available avatar models
├── POST /api/v1/auth/register          Create account (with Resend email)
├── POST /api/v1/auth/login             Authenticate user
├── POST /api/v1/auth/logout            End session
├── POST /api/v1/auth/verify-email      Verify with 6-digit code
├── POST /api/v1/auth/resend-verification Resend verification email
├── POST /api/v1/auth/forgot-password   Request password reset
├── POST /api/v1/auth/reset-password    Reset with code
├── GET  /api/v1/auth/me                Get current user (protected)
├── POST /api/v1/classroom/sessions     Start classroom session
├── GET  /api/v1/classroom/sessions/:id Get session details
├── PUT  /api/v1/classroom/sessions/:id Update/end session
├── POST /api/v1/classroom/interactions Log interaction
├── GET  /api/v1/users/:id/classroom/sessions  Get user sessions
├── GET  /api/v1/lessons/:id            Get lesson details
├── POST /api/v1/exams/:examId/sessions Start proctored exam session
├── GET  /api/v1/exams/:examId/sessions/:id Get exam session
├── PUT  /api/v1/exams/:examId/sessions/:id Update exam session
├── POST /api/v1/exams/:examId/sessions/:id/violations Log violation
├── POST /api/v1/exams/:examId/sessions/:id/submit Submit exam
├── GET  /api/v1/users/:id/exam-sessions Get user exam sessions
├── POST /api/v1/gpu/provision          Provision GPU droplet
├── GET  /api/v1/gpu/status/:sessionId  Get GPU session status
├── POST /api/v1/gpu/destroy            Destroy GPU droplet
├── POST /api/v1/gpu/log-session        Log GPU session activity
├── GET  /api/v1/gpu/tiers              Get available GPU tiers
├── GET  /api/v1/bandwidth-test         Bandwidth detection endpoint
└── GET  /api/v1/users/:id/gpu-sessions Get user GPU sessions

Not Yet Implemented (2):
├── GET  /api/v1/locales/:lang          Translation API
└── POST /api/v1/translate              Alternative translation
```

### Homepage Gate Status (9/10 Verified)

| Requirement | Status | Verified | Notes |
|-------------|--------|----------|-------|
| H1: No console errors | ✅ | Session 29 | Clean console |
| H2: Clean design | ✅ | Session 29 | Google-style minimalist |
| H3: AI chatbox | ✅ | Session 29 | **NOW WORKING** (was blocked) |
| H4: Left panel actions | ✅ | Session 29 | Dashboard, CS, Pathways visible |
| H5: Sign-Up modal | ✅ | Session 29 | Auth modal triggers correctly |
| H6: Customer Service badge | ✅ | Session 29 | Badge in sidebar |
| H7: Language system | ⚠️ | Session 29 | Modal shows empty state |
| H8: Header/Footer | ✅ | Session 29 | Dynamic loading working |
| H9: Mobile responsive | ✅ | Session 29 | Hamburger menu present |
| H10: No broken assets | ✅ | Session 29 | All resources loading |

### Known Issues (Active)

| ID | Issue | Severity | Affects | Since | Status |
|----|-------|----------|---------|-------|--------|
| KI-001 | Language modal shows "No languages found" | Medium | H7 | Session 26 | Open |
| KI-002 | Locale API returns 404 | Low | Translation | Session 29 | Open |

### Resolved Issues (Recent)

| ID | Issue | Resolution | Resolved In |
|----|-------|------------|-------------|
| RI-001 | env.AI binding undefined | Cloudflare binding fixed | Session 29 |
| RI-002 | Assessment 500 error | Migrated to Worker backend | Session 28 |
| RI-003 | Database connection error | Added DATABASE_URL secret | Session 28 |

### Recent Milestones

| Date | Session | Achievement |
|------|---------|-------------|
| 2025-12-07 | 38 | **Digital Desk Backend COMPLETE** — Exam API (6 endpoints) + GPU API (7 endpoints) deployed |
| 2025-12-07 | 37 | **Digital Desk Frontend COMPLETE** — Proctor Controller, Vision AI, GPU Streaming modules |
| 2025-12-06 | 36 | **Phase 5 Virtual Classroom COMPLETE** — 8/8 requirements implemented |
| 2025-12-06 | 35 | **Phase 4 Dashboard & Courses COMPLETE** — Enrollments, My Courses, pathway recommendations |
| 2025-12-06 | 34 | **Phase 3 COMPLETE** — Two-tier dashboard + Resend email verification |
| 2025-12-06 | 31 | **Backend Auth API** — 8 endpoints with PBKDF2, JWT, rate limiting |
| 2025-12-06 | 29 | **AI backend fixed** — env.AI binding now working, unblocks P0.2-P0.4 |
| 2025-12-06 | 28 | **Assessment pipeline operational** — Full 120-question flow working |

### Infrastructure Costs (Current Month)

| Service | Tier | Monthly Cost | Notes |
|---------|------|--------------|-------|
| Cloudflare Pages | Free | $0 | Static hosting |
| Cloudflare Workers | Free | $0 | 100K requests/day |
| Workers AI | Free | $0 | Included in Workers |
| Neon PostgreSQL | Free | $0 | Auto-pause enabled |
| Azure Translator | Free | $0 | 2M chars/month |
| Resend | Free | $0 | 3K emails/month, pmerit.com domain verified |
| **Total** | — | **$0** | All within free tiers |

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

### DEC-003: Checkbox-Style Selectors Over Radio Buttons
**Date:** 2025-12-24 | **Session:** 79 | **Decided By:** @peoplemerit

**Context:** During K-12 registration form review, the account type selector used radio buttons which created visual inconsistency with other parts of the platform.

**Options Considered:**
- A) Keep radio buttons for single-select options
- B) Use checkbox-style cards with JavaScript single-select behavior
- C) Use dropdown selects

**Decision:** B — Checkbox-style cards with JavaScript-enforced single selection

**Rationale:**
- Consistent UI pattern across the platform
- Better visual feedback with card-based selection
- Cards provide more space for descriptions
- JavaScript ensures only one option is selected at a time
- Checkmarks (when visible) are more universally understood than radio dots

**Impact:**
- Updated auth-modal.html to use checkbox inputs instead of radio inputs
- Updated auth-modal.js to handle single-select behavior for checkboxes
- Added `.selected` class styling for card highlighting
- This pattern should be used for all future single-select card interfaces

**UI Guidelines:**
- For single-select options presented as cards: Use checkboxes with JS single-select
- For simple form fields with 2-3 options: Use dropdowns
- For multiple-select options: Use standard checkboxes
- Radio buttons should generally be avoided in favor of the above patterns

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
| 2.1 | 2025-12-06 | Added Resend to tech stack; Updated production status with Phase 3 completion; Added 8 auth endpoints; Updated infrastructure costs |
| 2.2 | 2025-12-07 | Added Digital Desk stack (Proctor, Vision AI, GPU Streaming); Added 17 new API endpoints (exam + GPU); Updated to 82 database tables; Added Avatar Tiers documentation; Sessions 37-38 milestones |
| 2.3 | 2025-12-23 | Added Security Status section; SCOPE_SECURITY Phases 1, 2, 4 complete; AI Police, Security Headers (Grade A), Admin Security Dashboard live |

---

*This is the MASTER DOCUMENT for PMERIT development.*
*Decisions made during implementation are documented here.*
*Incomplete tasks are carried forward between sessions.*
*For detailed feature specifications, see `docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md`.*
*For workflow governance, see `docs/aados/`.*



## Patch

## Content Sustainability Philosophy

### Current Strategy: Curator Model
PMERIT wraps existing OER (primarily Maine MOOSE) with AI tutoring, 
progress tracking, and credentialing.

### Risk Acknowledgment
- MOOSE backed by Maine state law (Title 20-A, §19301)
- Government-funded content more stable than nonprofit OER
- Platform URLs may change; content substance unlikely to disappear

### Core Truth
"As long as people are being educated, alternatives will exist."