# PMERIT Platform Architecture — FINAL SPECIFICATION

**Document Version:** 1.1  
**Created:** 2025-12-09  
**Last Updated:** 2025-12-09  
**Status:** APPROVED — Ready for Implementation  
**Author:** Claude Web (Brainstorming) + User Confirmation  
**Target:** Claude Code Desktop for Implementation  

---

## Executive Summary

This document defines the finalized architecture for the PMERIT AI Educational Platform. All decisions have been confirmed by the project owner and are ready for implementation. Claude Code should use this document to update all project files, database schemas, and governance documentation.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Three-Track Educational Model](#2-three-track-educational-model)
3. [Track 1: Global Remote (Career Training)](#3-track-1-global-remote-career-training)
4. [Track 2: Local Education (Maine K-12)](#4-track-2-local-education-maine-k-12)
5. [Track 3: Local Career (CTE/Vocational)](#5-track-3-local-career-ctevocational)
6. [Content Sources Strategy](#6-content-sources-strategy)
7. [Blockchain Credentialing System](#7-blockchain-credentialing-system)
8. [AI Tutor Architecture](#8-ai-tutor-architecture)
9. [Parent Portal System](#9-parent-portal-system)
10. [Database Schema Requirements](#10-database-schema-requirements)
11. [Implementation Priority](#11-implementation-priority)

---

## 1. Platform Overview

### Mission
Provide free, quality education globally through AI-powered tutoring, following Maine's educational framework as the foundation that can be adapted internationally.

### Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Career-Focused** | Every course must pass the "Career Relevance Filter" |
| **Student-Owned Credentials** | Blockchain-anchored, portable, verifiable |
| **AI-Personalized** | Different AI tutor personas per track/age group |
| **Accessibility** | Free, low-bandwidth options, multi-language support |
| **Trust & Verification** | Proctoring integration with transparency |

### Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PMERIT EDUCATIONAL PLATFORM                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PUBLIC LAYER (No Login Required)                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • Homepage with track exploration                                    │   │
│  │ • Course catalog (browse only)                                       │   │
│  │ • Program information                                                │   │
│  │ • NO AI Tutor / NO Classroom access                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                    [Registration / Login]                                   │
│                              │                                              │
│  AUTHENTICATED LAYER (Login Required)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • Student Dashboard (enrolled courses only)                          │   │
│  │ • Parent Dashboard (for K-12 oversight)                              │   │
│  │ • Virtual Classroom + AI Tutor                                       │   │
│  │ • Progress tracking & assessments                                    │   │
│  │ • Credential wallet                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Architecture Decision: AI Tutor Access

**CONFIRMED:** AI Tutor/Avatar is ONLY accessible when:
- ✅ User is logged in
- ✅ User is enrolled in the specific course
- ✅ User accesses from their dashboard (enrolled courses)

**NOT accessible from:**
- ❌ Public course catalog
- ❌ Direct URL to classroom without enrollment

---

## 2. Three-Track Educational Model

### Track Overview

| Track | Name | Target Audience | Structure | Outcome |
|-------|------|-----------------|-----------|---------|
| **Track 1** | Global Remote | Adults seeking remote careers | Pathway → Course → Module → Lesson | Career credentials |
| **Track 2** | Local Education | K-12 students (Maine-aligned) | Grade → Subject → Unit → Lesson | Academic credentials |
| **Track 3** | Local Career | Trade/vocational seekers | Cluster → Pathway → Certification → Module | Pre-apprenticeship prep |

### Visual Structure

```
PMERIT PLATFORM
│
├── TRACK 1: GLOBAL REMOTE (Career Training)
│   ├── Pathway: Web Development
│   │   ├── Course: HTML & CSS Fundamentals
│   │   │   ├── Module: HTML Document Structure
│   │   │   │   ├── Lesson 1.1: Basic HTML Tags
│   │   │   │   └── Lesson 1.2: Semantic Elements
│   │   │   └── Module: CSS Styling
│   │   └── Course: JavaScript Essentials
│   └── Pathway: Data Analytics
│       └── ...
│
├── TRACK 2: LOCAL EDUCATION (Maine K-12)
│   ├── Grade Span: Childhood (K-5)
│   │   ├── Grade: Kindergarten
│   │   │   ├── Subject: English Language Arts
│   │   │   │   ├── Unit: Letter Recognition
│   │   │   │   │   ├── Lesson: Uppercase A-M
│   │   │   │   │   └── Lesson: Uppercase N-Z
│   │   │   │   └── Unit: Phonemic Awareness
│   │   │   └── Subject: Mathematics
│   │   └── Grade: Grade 1
│   ├── Grade Span: Early Adolescence (6-8)
│   └── Grade Span: Adolescence (9-Diploma)
│
└── TRACK 3: LOCAL CAREER (CTE/Trade)
    ├── Cluster: Construction Trades
    │   ├── Pathway: Electrical
    │   │   ├── Certification: OSHA 10
    │   │   │   ├── Module: Electrical Safety
    │   │   │   │   └── Lessons...
    │   │   │   └── Module: Lockout/Tagout
    │   │   └── Certification: Pre-Apprenticeship Prep
    │   └── Pathway: Plumbing
    └── Cluster: Healthcare
```

---

## 3. Track 1: Global Remote (Career Training)

### Structure

| Level | Term | Count | Example |
|-------|------|-------|---------|
| Track | Global Remote | 1 | — |
| Pathway | Career Pathway | 6 | Web Development |
| Course | Skill Course | ~7 per pathway | JavaScript Essentials |
| Module | Topic Block | ~5 per course | Functions & Scope |
| Lesson | Learning Unit | ~5 per module | Arrow Functions |

### Six Career Pathways

| Pathway | Target Outcome | Course Count |
|---------|----------------|--------------|
| Web Development | Full-Stack Developer | 7 |
| Data Analytics | Data Analyst | 7 |
| UX Design | UX/UI Designer | 7 |
| Digital Marketing | Marketing Specialist | 7 |
| Project Management | Project Manager | 7 |
| Business Analysis | Business Analyst | 7 |

### Career Relevance Filter (REQUIRED for all courses)

Every course MUST pass at least ONE of these criteria:

```
┌─────────────────────────────────────────────────────────────────┐
│  CAREER RELEVANCE FILTER — All courses must pass               │
├─────────────────────────────────────────────────────────────────┤
│  □ Does this skill appear in job postings?                     │
│  □ Will employers test for this in interviews?                 │
│  □ Is this required for industry certification?                │
│  □ Does this build portfolio-worthy projects?                  │
├─────────────────────────────────────────────────────────────────┤
│  If ANY = Yes → Include                                        │
│  If ALL = No → Exclude (not career-relevant)                   │
└─────────────────────────────────────────────────────────────────┘
```

### AI Tutor Persona: Professional Mentor

- **Name:** Professor Ada
- **Tone:** Professional, encouraging, industry-focused
- **Avatar:** Adult professional appearance
- **Communication Style:** Concise, practical, career-oriented

---

## 4. Track 2: Local Education (Maine K-12)

### CONFIRMED: Maine's Exact Grade Spans

| Grade Span | Grades | Ages | Maine Term |
|------------|--------|------|------------|
| **Childhood** | K-5 | 5-11 | Elementary |
| **Early Adolescence** | 6-8 | 11-14 | Middle School |
| **Adolescence** | 9-Diploma | 14-18+ | High School |

### CONFIRMED: Career-Focused Subjects Only

Instead of all 8 Maine content areas, PMERIT focuses on career foundations:

| Subject | Code | Career Foundation |
|---------|------|-------------------|
| **English Language Arts** | ELA | Communication, technical writing |
| **Mathematics** | MATH | Logic, problem-solving, data literacy |
| **Science & Engineering** | SCI | Computational thinking, inquiry |
| **Life & Career Readiness** | LCR | Direct career skills, financial literacy |

**Excluded from core (optional electives):**
- Health Education
- Physical Education
- Visual & Performing Arts
- World Languages

### Structure

| Level | Term | Example |
|-------|------|---------|
| Track | Local Education | — |
| Grade Span | Childhood (K-5) | — |
| Grade | Grade 3 | — |
| Subject | Mathematics | MLR-aligned |
| Unit | Fractions | Standards-based |
| Lesson | Adding Fractions | Individual learning unit |

### Maine Learning Results Alignment

| Subject | Grade Span | Standards Code Format |
|---------|------------|----------------------|
| ELA | K-5 | MLR-ELA-K5-R.1 |
| ELA | 6-8 | MLR-ELA-68-W.3 |
| Math | K-5 | MLR-MATH-K5-OA.1 |
| Math | 6-8 | MLR-MATH-68-EE.4 |

### AI Tutor Personas (Age-Appropriate)

| Grade Span | Persona | Tone | Avatar |
|------------|---------|------|--------|
| K-2 | Ms. Sunshine | Playful, encouraging | Friendly cartoon |
| 3-5 | Mr. Explorer | Curious, supportive | Animated character |
| 6-8 | Coach Jordan | Relatable, guiding | Teen-appropriate |
| 9-12 | Mentor Alex | Academic, preparing | Young adult |

---

## 5. Track 3: Local Career (CTE/Vocational)

### Structure

| Level | Term | Count | Example |
|-------|------|-------|---------|
| Track | Local Career | 1 | — |
| Cluster | Career Cluster | 4 | Construction Trades |
| Pathway | Trade Specialty | ~3 per cluster | Electrical |
| Certification | Industry Prep | ~3 per pathway | OSHA 10 |
| Module | Competency Block | ~4 per cert | Electrical Safety |
| Lesson | Learning Unit | ~5 per module | Lockout/Tagout |

### Four Career Clusters

| Cluster | Pathways | Example Certifications |
|---------|----------|----------------------|
| Construction Trades | Electrical, Plumbing, HVAC | OSHA 10, Pre-Apprenticeship |
| Healthcare | CNA, Medical Admin, EMT Prep | First Aid/CPR, Medical Terminology |
| Manufacturing | Welding, CNC, Quality Control | Safety Certs, Blueprint Reading |
| Transportation | CDL Prep, Auto Tech, Logistics | DOT Compliance, Vehicle Systems |

### CRITICAL: Legal Positioning

| ❌ DO NOT CLAIM | ✅ DO CLAIM |
|-----------------|-------------|
| "Earn certification" | "Prepare for certification exams" |
| "Complete required hours" | "Pre-apprenticeship preparation" |
| "Become licensed" | "Master concepts tested in licensing" |
| "576-hour electrical program" | "Pre-Apprenticeship Electrical Prep" |

### AI Tutor Persona: Trade Expert

- **Name:** Coach Mike
- **Tone:** Practical, hands-on, experienced
- **Avatar:** Adult tradesperson appearance
- **Communication Style:** Direct, safety-focused, real-world examples

---

## 6. Content Sources Strategy

### CONFIRMED: "Playlist Curator, Not Textbook Writer"

PMERIT curates and wraps existing quality OER content, adding:
- AI Tutoring layer
- Progress tracking
- Assessments
- Credentials

### Primary Sources by Track

| Track | Primary Source | Secondary Source | PMERIT Adds |
|-------|----------------|------------------|-------------|
| **Global Remote** | freeCodeCamp, Kaggle Learn | The Odin Project, Khan Academy | AI Tutor, Portfolio Projects |
| **Local Education** | **MOOSE (Maine DOE)** | Khan Academy, CK-12, EngageNY | AI Personas, Assessments |
| **Local Career** | OSHA Education, CareerOneStop | SkillsCommons, YouTube Trades | Pre-Apprenticeship Prep |

### Source Quality Criteria

| Criterion | Weight |
|-----------|--------|
| Quality (accuracy, depth) | 30% |
| Alignment (curriculum fit) | 25% |
| Licensing (OER-compliant) | 20% |
| Accessibility (easy to link) | 15% |
| Longevity (stable source) | 10% |

### MOOSE Partnership Opportunity

- **URL:** https://learnwithmoose.maine.gov/
- **Contact:** Jennifer Page (jennifer.page@maine.gov)
- **Opportunity:** Explore becoming recognized delivery platform for Maine content
- **Pitch:** "PMERIT extends Maine's educational excellence globally through AI tutoring"

### Content Sustainability Philosophy

**CONFIRMED (2025-12-09):** Founder's strategic position on content availability.

#### Current Strategy: Curator Model
PMERIT wraps existing OER (primarily Maine MOOSE) with AI tutoring, progress tracking, and credentialing. This maximizes quality while minimizing content creation burden.

#### Risk Acknowledgment
| Factor | Assessment |
|--------|------------|
| **MOOSE Legal Status** | Backed by Maine state law (Title 20-A, §19301) |
| **Funding Stability** | Transitioned from COVID relief → State General Fund (permanent) |
| **Platform Stability** | URLs may change during redesigns |
| **Content Availability** | Government-funded content more stable than nonprofit OER |

#### Mitigation Strategy
- Store `ai_context` summaries locally (AI tutor always has lesson context)
- Periodic link validation scripts
- Alternative OER sources mapped for each subject area
- Maine Learning Results standards documented independently of MOOSE

#### Future State (Scale + Partnership)
If PMERIT achieves adoption and government partnership:
- Option to create original content using established curriculum framework
- AI-assisted content generation pipeline already architected
- Leverage PMERIT's validated pedagogy and credentialing system

#### Core Truth
> *"As long as people are being educated, alternatives will exist. Content sources may change; the need for education never will."*
> — Founder's Position, December 2025

---

## 7. Blockchain Credentialing System

### CONFIRMED Decisions

| Decision | Choice |
|----------|--------|
| Phase 1 Scope | **Option B:** Database + hash + basic Polygon anchoring from start |
| Sharing Default | **Option A:** Private by default (student chooses to share) |
| Integrity Display | **Option A:** Full transparency (score + proctoring level) |

### Credential Hierarchy (5 Levels)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PMERIT CREDENTIAL HIERARCHY                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  LEVEL 5: TRACK COMPLETION                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 🎓 PMERIT DIPLOMA                                              │  │
│  │    Blockchain: ✅ Full credential with all pathway details     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              ▲                                      │
│  LEVEL 4: PATHWAY COMPLETION │                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 📜 CAREER-READY CREDENTIAL                                     │  │
│  │    Blockchain: ✅ Pathway hash + all course completions        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              ▲                                      │
│  LEVEL 3: COURSE COMPLETION  │                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 📋 COURSE CERTIFICATE                                          │  │
│  │    Blockchain: ✅ Course hash + assessment scores              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              ▲                                      │
│  LEVEL 2: MODULE COMPLETION  │                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 🏅 MODULE BADGE                                                │  │
│  │    Blockchain: ⚡ Optional (batched weekly)                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              ▲                                      │
│  LEVEL 1: LESSON/SKILL       │                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ⭐ MICRO-CREDENTIAL                                            │  │
│  │    Blockchain: ❌ Database only (too granular)                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Blockchain Storage Decision

| Level | Store Where | Blockchain? | Reason |
|-------|-------------|-------------|--------|
| Micro-credential | Database only | ❌ No | Too granular, high volume |
| Module Badge | Database + Optional batch | ⚡ Batched | Cost efficiency |
| Course Certificate | Database + Blockchain | ✅ Yes | Meaningful achievement |
| Career-Ready Credential | Database + Blockchain | ✅ Yes | Employment value |
| Track Diploma | Database + Blockchain | ✅ Yes | Major milestone |

### Technical Implementation

**Blockchain:** Polygon (Layer-2 Ethereum)
- Low energy consumption
- ~$0.001 per transaction
- Ethereum-compatible
- Enterprise adoption

**Credential Hash Structure:**
```
SHA-256(
  user_id + 
  achievement_id + 
  score + 
  integrity_score + 
  proctoring_level + 
  timestamp
)
```

### Proctor → Credential → Blockchain Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              VERIFIED CREDENTIAL FLOW                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. STUDENT COMPLETES ASSESSMENT                                    │
│     • Proctor system active (browser focus, time tracking)          │
│     • Assessment score recorded                                     │
│                                                                     │
│  2. PROCTOR GENERATES INTEGRITY REPORT                              │
│     • Integrity Score: 0-100%                                       │
│     • Proctoring Level: none / basic / full                         │
│     • Suspicious behavior flags                                     │
│                                                                     │
│  3. CREDENTIAL ISSUED                                               │
│     • Achievement + Score + Integrity bundled                       │
│     • SHA-256 hash generated                                        │
│     • Stored in database                                            │
│                                                                     │
│  4. BLOCKCHAIN ANCHORING                                            │
│     • Hash submitted to Polygon                                     │
│     • Transaction confirmed                                         │
│     • Block number recorded                                         │
│                                                                     │
│  5. VERIFICATION (by employer/institution)                          │
│     • Scan QR code or enter credential ID                           │
│     • Verify hash on blockchain                                     │
│     • View full transparency: score + integrity + proctoring        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Credential Sharing (Private by Default)

- Credentials are **private by default**
- Student explicitly chooses what to share
- Share options:
  - Generate shareable link (with optional expiration)
  - LinkedIn badge
  - QR code for in-person verification
  - Full transcript export

### Integrity Score Display (Full Transparency)

Employers/verifiers see:
- ✅ Achievement title and date
- ✅ Assessment score (e.g., 87%)
- ✅ Integrity score (e.g., 94%)
- ✅ Proctoring level (none/basic/full)
- ✅ Blockchain verification status

---

## 8. AI Tutor Architecture

### CONFIRMED: AI Tutor Linked to Enrollment

The AI Tutor is ONLY available to enrolled students accessing from their dashboard.

### Persona Matrix

| Track | Grade/Level | Persona Name | Tone | Avatar Style |
|-------|-------------|--------------|------|--------------|
| Global Remote | Adult | Professor Ada | Professional | Adult professional |
| Local Education | K-2 | Ms. Sunshine | Playful | Cartoon character |
| Local Education | 3-5 | Mr. Explorer | Curious | Animated character |
| Local Education | 6-8 | Coach Jordan | Relatable | Teen-appropriate |
| Local Education | 9-12 | Mentor Alex | Academic | Young adult |
| Local Career | Adult | Coach Mike | Practical | Trade professional |

### AI Tutor Features

| Feature | Implementation |
|---------|----------------|
| Text Chat | Always available |
| Voice (TTS) | OpenAI voices via Workers AI |
| Avatar | WebGL 3D (standard tier) |
| Lip Sync | Synced to TTS audio |
| Context | Course + lesson + student history |

---

## 9. Parent Portal System

### CONFIRMED: Required for Minors from Start

All K-12 students (under 18) require parent/guardian oversight.

### Parent Portal Features

| Feature | Description |
|---------|-------------|
| Child Account Management | Add/remove children under supervision |
| Progress Dashboard | View all children's progress |
| Activity Reports | Weekly summaries, time spent |
| Communication | Messages from AI tutor, alerts |
| Credential Access | View/share children's credentials |
| Privacy Controls | Manage what's shared |

### Parent-Child Relationship Structure

```sql
-- Parent creates account first
-- Then adds children under their supervision
-- Children can log in but parent maintains oversight

Parent Account
├── Child 1 (Age 8, Grade 3)
│   ├── Enrolled: Math, ELA, Science
│   └── Progress visible to parent
├── Child 2 (Age 12, Grade 7)
│   ├── Enrolled: Math, ELA, Science, Life & Career
│   └── Progress visible to parent
└── Parent Dashboard
    ├── View all children's progress
    ├── Weekly activity reports
    └── Credential management
```

### Age-Based Access Controls

| Age | Account Type | Restrictions |
|-----|--------------|--------------|
| Under 13 | Child (COPPA) | Parent manages everything |
| 13-17 | Teen | More autonomy, parent oversight |
| 18+ | Adult | Full independence |

---

## 10. Database Schema Requirements

### New Tables Required

```sql
-- =============================================================================
-- BLOCKCHAIN CREDENTIALING TABLES
-- =============================================================================

-- Credential types definition
CREATE TABLE credential_types (
    type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_code VARCHAR(50) NOT NULL UNIQUE,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
    is_blockchain_eligible BOOLEAN DEFAULT FALSE,
    badge_template_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Issued credentials (main record)
CREATE TABLE issued_credentials (
    credential_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    credential_type_id UUID NOT NULL REFERENCES credential_types(type_id),
    achievement_type VARCHAR(50) NOT NULL,
    achievement_id UUID NOT NULL,
    achievement_title VARCHAR(255) NOT NULL,
    achievement_description TEXT,
    
    -- Verification
    proctor_session_id UUID,
    integrity_score DECIMAL(5,2),
    proctoring_level VARCHAR(20),
    
    -- Assessment
    assessment_score DECIMAL(5,2),
    time_spent_minutes INTEGER,
    attempts_count INTEGER DEFAULT 1,
    
    -- Timestamps
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT,
    
    -- Blockchain
    credential_hash VARCHAR(64),
    blockchain_status VARCHAR(20) DEFAULT 'pending',
    blockchain_tx_hash VARCHAR(128),
    blockchain_block_number BIGINT,
    blockchain_anchored_at TIMESTAMPTZ,
    
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blockchain batch anchoring
CREATE TABLE blockchain_batches (
    batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_count INTEGER NOT NULL,
    credentials_merkle_root VARCHAR(64),
    blockchain_network VARCHAR(50),
    tx_hash VARCHAR(128),
    block_number BIGINT,
    gas_used BIGINT,
    cost_usd DECIMAL(10,6),
    status VARCHAR(20) DEFAULT 'pending',
    submitted_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credential sharing
CREATE TABLE credential_shares (
    share_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_id UUID NOT NULL REFERENCES issued_credentials(credential_id),
    user_id UUID NOT NULL REFERENCES users(user_id),
    share_token VARCHAR(64) NOT NULL UNIQUE,
    share_url TEXT,
    expires_at TIMESTAMPTZ,
    max_views INTEGER,
    current_views INTEGER DEFAULT 0,
    require_email BOOLEAN DEFAULT FALSE,
    allowed_domains TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification audit log
CREATE TABLE credential_verifications (
    verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_id UUID NOT NULL REFERENCES issued_credentials(credential_id),
    verifier_type VARCHAR(50),
    verifier_identifier VARCHAR(255),
    verifier_ip VARCHAR(45),
    verification_method VARCHAR(50),
    verification_result BOOLEAN,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- K-12 SPECIFIC TABLES (Maine-Aligned)
-- =============================================================================

-- Grade levels
CREATE TABLE grade_levels (
    grade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_code VARCHAR(10) NOT NULL,
    grade_name VARCHAR(100) NOT NULL,
    grade_span VARCHAR(50) NOT NULL,
    pathway_id UUID REFERENCES pathways(pathway_id),
    age_range_min INTEGER,
    age_range_max INTEGER,
    sort_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects (Maine content areas)
CREATE TABLE subjects (
    subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_career_focused BOOLEAN DEFAULT TRUE,
    icon_url TEXT,
    color_hex VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grade-Subject matrix
CREATE TABLE grade_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID REFERENCES grade_levels(grade_id),
    subject_id UUID REFERENCES subjects(subject_id),
    weekly_hours DECIMAL(4,2),
    credits_value DECIMAL(4,2),
    is_required BOOLEAN DEFAULT TRUE,
    standards_code VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(grade_id, subject_id)
);

-- Subject units (standards-aligned)
CREATE TABLE subject_units (
    unit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_subject_id UUID REFERENCES grade_subjects(id),
    unit_number INTEGER NOT NULL,
    unit_title VARCHAR(255) NOT NULL,
    description TEXT,
    learning_standards TEXT[],
    estimated_weeks INTEGER,
    sort_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- PARENT PORTAL TABLES
-- =============================================================================

-- Parent-child relationships
CREATE TABLE student_guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_user_id UUID REFERENCES users(user_id),
    guardian_user_id UUID REFERENCES users(user_id),
    relationship VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    can_view_progress BOOLEAN DEFAULT TRUE,
    can_communicate BOOLEAN DEFAULT TRUE,
    can_manage_credentials BOOLEAN DEFAULT TRUE,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_user_id, guardian_user_id)
);

-- Student grade enrollment
CREATE TABLE student_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    grade_id UUID REFERENCES grade_levels(grade_id),
    academic_year VARCHAR(10),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'active',
    promoted_to_grade_id UUID REFERENCES grade_levels(grade_id),
    promotion_date DATE,
    UNIQUE(user_id, academic_year)
);

-- =============================================================================
-- AI TUTOR PERSONAS
-- =============================================================================

CREATE TABLE ai_tutor_personas (
    persona_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    persona_code VARCHAR(50) NOT NULL UNIQUE,
    persona_name VARCHAR(100) NOT NULL,
    description TEXT,
    track_type VARCHAR(50),
    grade_span VARCHAR(50),
    tone_description TEXT,
    system_prompt TEXT,
    avatar_id VARCHAR(100),
    voice_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- COURSE SYLLABUS (Professional Documentation)
-- =============================================================================

CREATE TABLE course_syllabi (
    syllabus_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id),
    effective_date DATE NOT NULL,
    revised_date DATE,
    version VARCHAR(10) DEFAULT '1.0',
    career_relevance_score INTEGER CHECK (career_relevance_score BETWEEN 1 AND 10),
    job_titles_targeted TEXT[],
    skills_gained TEXT[],
    industry_certifications TEXT[],
    learning_objectives JSONB,
    assessment_type VARCHAR(50),
    passing_criteria TEXT,
    required_materials JSONB,
    optional_materials JSONB,
    is_published BOOLEAN DEFAULT FALSE,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Career relevance mapping
CREATE TABLE course_career_mapping (
    mapping_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id),
    appears_in_job_postings BOOLEAN DEFAULT FALSE,
    tested_in_interviews BOOLEAN DEFAULT FALSE,
    required_for_certification BOOLEAN DEFAULT FALSE,
    builds_portfolio_project BOOLEAN DEFAULT FALSE,
    job_posting_examples TEXT[],
    interview_question_types TEXT[],
    certification_names TEXT[],
    portfolio_project_ideas TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Seed Data Required

```sql
-- Credential types
INSERT INTO credential_types (type_code, type_name, level, is_blockchain_eligible) VALUES
('micro', 'Micro-Credential', 1, FALSE),
('module', 'Module Badge', 2, FALSE),
('course', 'Course Certificate', 3, TRUE),
('pathway', 'Career-Ready Credential', 4, TRUE),
('diploma', 'PMERIT Diploma', 5, TRUE);

-- Maine grade levels
INSERT INTO grade_levels (grade_code, grade_name, grade_span, age_range_min, age_range_max, sort_order) VALUES
('K', 'Kindergarten', 'Childhood', 5, 6, 1),
('1', 'Grade 1', 'Childhood', 6, 7, 2),
('2', 'Grade 2', 'Childhood', 7, 8, 3),
('3', 'Grade 3', 'Childhood', 8, 9, 4),
('4', 'Grade 4', 'Childhood', 9, 10, 5),
('5', 'Grade 5', 'Childhood', 10, 11, 6),
('6', 'Grade 6', 'Early Adolescence', 11, 12, 7),
('7', 'Grade 7', 'Early Adolescence', 12, 13, 8),
('8', 'Grade 8', 'Early Adolescence', 13, 14, 9),
('9', 'Grade 9', 'Adolescence', 14, 15, 10),
('10', 'Grade 10', 'Adolescence', 15, 16, 11),
('11', 'Grade 11', 'Adolescence', 16, 17, 12),
('12', 'Grade 12', 'Adolescence', 17, 18, 13);

-- Career-focused subjects
INSERT INTO subjects (subject_code, subject_name, is_career_focused, color_hex) VALUES
('ELA', 'English Language Arts', TRUE, '#4A90D9'),
('MATH', 'Mathematics', TRUE, '#7B68EE'),
('SCI', 'Science & Engineering', TRUE, '#32CD32'),
('LCR', 'Life & Career Readiness', TRUE, '#FF8C00');

-- AI Tutor personas
INSERT INTO ai_tutor_personas (persona_code, persona_name, track_type, grade_span, tone_description) VALUES
('professor_ada', 'Professor Ada', 'global_remote', NULL, 'Professional, encouraging, industry-focused'),
('ms_sunshine', 'Ms. Sunshine', 'local_education', 'K-2', 'Playful, encouraging, age-appropriate'),
('mr_explorer', 'Mr. Explorer', 'local_education', '3-5', 'Curious, supportive, discovery-oriented'),
('coach_jordan', 'Coach Jordan', 'local_education', '6-8', 'Relatable, guiding, teen-appropriate'),
('mentor_alex', 'Mentor Alex', 'local_education', '9-12', 'Academic, preparing, young adult'),
('coach_mike', 'Coach Mike', 'local_career', NULL, 'Practical, hands-on, safety-focused');
```

---

## 11. Implementation Priority

### Phase 1: Foundation (Immediate)

| Priority | Task | Impact |
|----------|------|--------|
| 1 | Fix avatar model paths | Unblock current development |
| 2 | Create credential database tables | Enable blockchain system |
| 3 | Create K-12 tables (grade_levels, subjects) | Enable Maine-aligned structure |
| 4 | Update pathways to reflect 3-track model | Data consistency |

### Phase 2: Core Features (Next Sprint)

| Priority | Task | Impact |
|----------|------|--------|
| 5 | Implement credential issuance flow | Core functionality |
| 6 | Add blockchain hash generation | Credential integrity |
| 7 | Create parent portal tables | K-12 support |
| 8 | Implement AI persona selection | Track-appropriate tutoring |

### Phase 3: Integration (Following Sprint)

| Priority | Task | Impact |
|----------|------|--------|
| 9 | Polygon blockchain integration | Live credential anchoring |
| 10 | Credential sharing UI | Student-controlled sharing |
| 11 | Verification API | Employer/institution access |
| 12 | Parent dashboard | K-12 oversight |

---

## Appendix A: Decision Summary

| Element | Decision | Status |
|---------|----------|--------|
| Architecture | AI Tutor linked to enrollment only | ✅ CONFIRMED |
| Grade Spans | Maine exact (K-5, 6-8, 9-Diploma) | ✅ CONFIRMED |
| Subjects | Career-focused (ELA, Math, Science, LCR) | ✅ CONFIRMED |
| Credentials | Layered (5 levels) + Both certificates | ✅ CONFIRMED |
| Parent Portal | Required for minors from start | ✅ CONFIRMED |
| Blockchain Phase 1 | DB + hash + basic Polygon | ✅ CONFIRMED |
| Credential Sharing | Private by default | ✅ CONFIRMED |
| Integrity Display | Full transparency | ✅ CONFIRMED |
| Content Sources | MOOSE, freeCodeCamp, OSHA | ✅ CONFIRMED |
| Content Sustainability | Curator model; create later at scale | ✅ CONFIRMED |

---

## Appendix B: Reference Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Project Document | docs/project/Pmerit_Project_Document.md | Master roadmap |
| Brainstorm Schema | docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md | Feature specs |
| User Journey | docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md | User flows |
| Production Audit | docs/aados/PRODUCTION_AUDIT_2025-12-09.md | Current state |
| STATE.json | docs/aados/STATE.json | Machine-readable state |

---

**END OF DOCUMENT**

*This architecture specification is FINAL and ready for implementation by Claude Code Desktop.*
