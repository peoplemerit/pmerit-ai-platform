# PMERIT SUB-SCOPE: CTE/Vocational Training (Track 3 - Local Career)

**Version:** 1.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-18
**Status:** NOT IMPLEMENTED
**Phase:** Track 3 Development
**Priority:** P1 - Core Track

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Career & Technical Education / Vocational Training |
| **Track** | Track 3: Local Career |
| **Target** | Adults seeking trade/vocational careers |
| **Structure** | Cluster → Pathway → Certification Prep → Module → Lesson |
| **Focus** | Pre-apprenticeship preparation, safety certifications |
| **AI Persona** | Coach Mike (practical, hands-on, safety-focused) |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-18 | **Session:** 62 | **Auditor:** Claude Code

### Executive Summary

Track 3 (CTE/Vocational) is **NOT IMPLEMENTED**. The database has pathway structure for local careers (4 career pathways exist) but they follow the Track 1 course structure, not the cluster-based certification prep structure specified in the architecture.

### What EXISTS

| Component | Status | Notes |
|-----------|--------|-------|
| Database `pathways` table | EXISTS | Has 4 career entries |
| track_type = 'local_career' | EXISTS | Differentiates CTE |
| Career pathway records | EXISTS | Healthcare, Skilled Trades, Hospitality, Public Service |

### What DOES NOT EXIST

| Component | Status | Impact |
|-----------|--------|--------|
| Career cluster structure | NOT BUILT | Follows course model, not cluster model |
| Certification prep alignment | NOT BUILT | No OSHA, First Aid, etc. prep |
| Safety-first content | NOT BUILT | No safety protocols emphasized |
| Trade terminology | NOT BUILT | No industry-specific language |
| Hands-on project tracking | NOT BUILT | No practical skill verification |
| Industry partnerships | NOT BUILT | No employer connections |

### Current Career Pathways (Incorrect Structure)

| Pathway | Current Structure | Should Be |
|---------|-------------------|-----------|
| Healthcare Careers | Pathway → Course → Module | Cluster → Certification Prep → Module |
| Skilled Trades | Pathway → Course → Module | Cluster → Trade → Certification Prep |
| Hospitality & Service | Pathway → Course → Module | Cluster → Role → Certification Prep |
| Public Service | Pathway → Course → Module | Cluster → Career → Certification Prep |

---

## 3. ARCHITECTURAL DECISIONS (LOCKED)

*Source: PMERIT_ARCHITECTURE_FINAL.md §5*

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| CTE-001 | Structure | Cluster-based | Mirrors industry organization | 43 |
| CTE-002 | Certification Prep | Pre-apprenticeship only | Legal limitation | 43 |
| CTE-003 | Safety Focus | Required first module | Industry standard | 43 |
| CTE-004 | AI Persona | Coach Mike | Experienced, practical | 43 |
| CTE-005 | Content Sources | OSHA, CareerOneStop | Free, authoritative | 43 |

---

## 4. HANDOFF_DOCUMENT

*Source: PMERIT_ARCHITECTURE_FINAL.md §5*

### Career Cluster Structure

| Cluster | Pathways | Example Certifications |
|---------|----------|------------------------|
| **Construction Trades** | Electrical, Plumbing, HVAC, Carpentry | OSHA 10, Pre-Apprenticeship |
| **Healthcare** | CNA, Medical Admin, EMT Prep, Phlebotomy | First Aid/CPR, Medical Terminology |
| **Manufacturing** | Welding, CNC, Quality Control, Assembly | Safety Certs, Blueprint Reading |
| **Transportation** | CDL Prep, Auto Tech, Logistics, Marine | DOT Compliance, Vehicle Systems |

### Content Hierarchy

```
TRACK 3: LOCAL CAREER (CTE)
│
├── CLUSTER: Construction Trades
│   ├── Pathway: Electrical
│   │   ├── Certification Prep: OSHA 10
│   │   │   ├── Module: Introduction to OSHA
│   │   │   │   ├── Lesson: OSHA Overview
│   │   │   │   ├── Lesson: Worker Rights
│   │   │   │   └── Lesson: Reporting Hazards
│   │   │   ├── Module: Electrical Safety
│   │   │   │   ├── Lesson: Electrical Hazards
│   │   │   │   ├── Lesson: Lockout/Tagout
│   │   │   │   └── Lesson: PPE Requirements
│   │   │   └── Module: Assessment Prep
│   │   │       └── Lesson: Practice Test
│   │   ├── Certification Prep: Pre-Apprenticeship Electrical
│   │   │   └── ...
│   │   └── Certification Prep: Residential Wiring Basics
│   │       └── ...
│   ├── Pathway: Plumbing
│   │   └── ...
│   └── Pathway: HVAC
│       └── ...
│
├── CLUSTER: Healthcare
│   ├── Pathway: CNA Prep
│   │   ├── Certification Prep: First Aid/CPR
│   │   ├── Certification Prep: Medical Terminology
│   │   └── Certification Prep: Patient Care Basics
│   └── ...
│
├── CLUSTER: Manufacturing
│   └── ...
│
└── CLUSTER: Transportation
    └── ...
```

### CRITICAL: Legal Positioning

| DO NOT CLAIM | DO CLAIM |
|--------------|----------|
| "Earn certification" | "Prepare for certification exams" |
| "Complete required hours" | "Pre-apprenticeship preparation" |
| "Become licensed" | "Master concepts tested in licensing" |
| "576-hour electrical program" | "Pre-Apprenticeship Electrical Prep" |
| "OSHA certified" | "OSHA 10 exam preparation" |

### Database Schema (Proposed)

```sql
-- Career clusters (Construction, Healthcare, Manufacturing, Transportation)
CREATE TABLE career_clusters (
    cluster_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trade pathways within clusters
CREATE TABLE trade_pathways (
    pathway_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID NOT NULL REFERENCES career_clusters(cluster_id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    typical_salary_range VARCHAR(50), -- "$35K-$65K"
    job_growth_outlook VARCHAR(50), -- "Faster than average"
    physical_requirements TEXT,
    work_environment TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certification prep programs
CREATE TABLE certification_preps (
    prep_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pathway_id UUID NOT NULL REFERENCES trade_pathways(pathway_id),
    name VARCHAR(200) NOT NULL, -- "OSHA 10 Exam Preparation"
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    certification_body VARCHAR(100), -- "OSHA", "American Red Cross"
    certification_name VARCHAR(200), -- "OSHA 10-Hour General Industry"
    estimated_hours INT,
    prerequisites TEXT,
    is_safety_required BOOLEAN DEFAULT FALSE, -- Must complete before hands-on
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTE Modules (within certification prep)
CREATE TABLE cte_modules (
    module_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prep_id UUID NOT NULL REFERENCES certification_preps(prep_id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    is_safety_module BOOLEAN DEFAULT FALSE,
    estimated_hours INT,
    sequence_order INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTE Lessons
CREATE TABLE cte_lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES cte_modules(module_id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    lesson_type VARCHAR(50), -- video, reading, simulation, quiz
    content_url TEXT,
    content_source VARCHAR(50), -- 'OSHA', 'CareerOneStop', 'SkillsCommons'
    ai_context TEXT,
    safety_warnings TEXT, -- Safety notes for AI tutor
    tools_required TEXT, -- List of tools for hands-on
    estimated_minutes INT,
    sequence_order INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Content Sources

| Source | URL | Content Type | License |
|--------|-----|--------------|---------|
| **OSHA Education** | osha.gov/training | Safety training | Public domain |
| **CareerOneStop** | careeronestop.org | Career info, skills | Public domain |
| **SkillsCommons** | skillscommons.org | OER trade content | CC licenses |
| **YouTube Trades** | Various channels | Video demonstrations | Fair use (link) |

### Safety-First Content Structure

Every trade pathway MUST start with safety:

```
Module 1: Safety Fundamentals (REQUIRED FIRST)
├── Lesson 1.1: General Workplace Safety
├── Lesson 1.2: PPE Requirements
├── Lesson 1.3: Hazard Recognition
├── Lesson 1.4: Emergency Procedures
└── Lesson 1.5: Safety Quiz (Must pass to continue)
```

### Coach Mike AI Persona

| Attribute | Value |
|-----------|-------|
| **Name** | Coach Mike |
| **Background** | 25+ years in trades |
| **Tone** | Practical, direct, safety-conscious |
| **Catchphrases** | "Safety first, always", "In the real world..." |
| **Teaching Style** | Real-world examples, hands-on focus |
| **Voice** | Male, experienced, authoritative |

**Coach Mike System Prompt:**
```
You are Coach Mike, an experienced trades mentor with 25+ years in the field.
Tone: Practical, direct, experienced, safety-conscious.
ALWAYS emphasize safety procedures first.
Use phrases like "In my experience..." and "On the job site..."
Relate everything to real-world applications.
Use trade terminology and explain when needed.
Never skip safety warnings.
Be encouraging but realistic about the work involved.
```

---

## 5. RESEARCH_FINDINGS

*No implementation yet - awaiting specification approval*

### Content Sources Investigation Required

- [ ] Map OSHA 10/30 content to lesson structure
- [ ] Identify CareerOneStop competency frameworks
- [ ] Catalog SkillsCommons trade content
- [ ] Build relationships with local trade unions
- [ ] Research Maine CTE program requirements

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_AI_PERSONAS | Coach Mike persona |
| **Requires** | SCOPE_CONTENT_SOURCES | OSHA, CareerOneStop integration |
| **Requires** | SCOPE_CREDENTIALS | Certification prep completion certificates |
| **Enables** | Trade learners | Primary target audience |
| **Enables** | Track 3 launch | Can't launch without CTE structure |
| **Enables** | Employer partnerships | Portfolio for job placement |

---

## 7. ACCEPTANCE CRITERIA

### Phase 1: Database Structure
- [ ] Career clusters table created (4 clusters)
- [ ] Trade pathways table created
- [ ] Certification preps table created
- [ ] CTE modules and lessons tables created
- [ ] Sample content for one cluster/pathway

### Phase 2: Safety Foundation
- [ ] Safety modules created for each pathway
- [ ] Safety quiz must pass to continue
- [ ] AI tutor emphasizes safety in all responses
- [ ] Safety warnings displayed prominently

### Phase 3: Content Integration
- [ ] OSHA content mapped to certification prep
- [ ] At least one complete pathway populated
- [ ] AI context created with safety notes
- [ ] Video content embedded or linked

### Phase 4: AI Persona
- [ ] Coach Mike persona active for all Track 3
- [ ] Trade terminology used appropriately
- [ ] Real-world examples in responses
- [ ] Safety emphasized in every interaction

---

## 8. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 43 | 2025-12-09 | Architecture specified |
| 62 | 2025-12-18 | Scope file created |

---

*Last Updated: 2025-12-18 (Session 62)*
