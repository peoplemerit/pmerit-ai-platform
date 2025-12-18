# PMERIT SUB-SCOPE: K-12 Education (Track 2 - Local Education)

**Version:** 1.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-18
**Status:** NOT IMPLEMENTED
**Phase:** Track 2 Development
**Priority:** P1 - Core Track

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Maine-Aligned K-12 Education System |
| **Track** | Track 2: Local Education |
| **Target** | K-12 students (Ages 5-18) |
| **Structure** | Grade Span → Grade → Subject → Unit → Lesson |
| **Standards** | Maine Learning Results (MLR) aligned |
| **Content Source** | MOOSE (Maine DOE), Khan Academy, CK-12 |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-18 | **Session:** 62 | **Auditor:** Claude Code

### Executive Summary

Track 2 (K-12 Education) is **NOT IMPLEMENTED**. The database has pathway structure for K-12 (4 education pathways exist) but they follow the Track 1 course structure, not the grade-based structure specified in the architecture.

### What EXISTS

| Component | Status | Notes |
|-----------|--------|-------|
| Database `pathways` table | EXISTS | Has 4 education entries |
| track_type = 'local_education' | EXISTS | Differentiates K-12 |
| Education pathway records | EXISTS | Early Childhood, Primary, Secondary, College |

### What DOES NOT EXIST

| Component | Status | Impact |
|-----------|--------|--------|
| Grade-based structure | NOT BUILT | Follows course model, not grade model |
| Grade spans table | NOT BUILT | K-2, 3-5, 6-8, 9-12 not defined |
| Subject alignment | NOT BUILT | No MLR subject mapping |
| Unit structure | NOT BUILT | No curriculum units |
| MOOSE content integration | NOT BUILT | No Maine DOE content linked |
| Age-appropriate UI | NOT BUILT | Same UI as adult learners |
| Parental consent flow | NOT BUILT | Required for minors |

### Current K-12 Pathways (Incorrect Structure)

| Pathway | Current Structure | Should Be |
|---------|-------------------|-----------|
| Early Childhood | Pathway → Course → Module | Grade Span → Grade → Subject |
| Primary School | Pathway → Course → Module | Grade Span → Grade → Subject |
| Secondary School | Pathway → Course → Module | Grade Span → Grade → Subject |
| College & University | Pathway → Course → Module | Different track entirely |

---

## 3. ARCHITECTURAL DECISIONS (LOCKED)

*Source: PMERIT_ARCHITECTURE_FINAL.md §4*

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| K12-001 | Grade Spans | Maine's exact spans | Align with state standards | 43 |
| K12-002 | Subjects | 4 career-focused only | ELA, Math, Science, LCR | 43 |
| K12-003 | Standards | Maine Learning Results | State curriculum alignment | 43 |
| K12-004 | Content Source | MOOSE primary | Free, high-quality, Maine-aligned | 43 |
| K12-005 | AI Personas | 4 age-appropriate | Ms. Sunshine, Mr. Explorer, Coach Jordan, Mentor Alex | 43 |

---

## 4. HANDOFF_DOCUMENT

*Source: PMERIT_ARCHITECTURE_FINAL.md §4*

### Grade Span Structure

| Grade Span | Grades | Ages | Maine Term | AI Persona |
|------------|--------|------|------------|------------|
| **Childhood** | K-5 | 5-11 | Elementary | Ms. Sunshine (K-2), Mr. Explorer (3-5) |
| **Early Adolescence** | 6-8 | 11-14 | Middle School | Coach Jordan |
| **Adolescence** | 9-Diploma | 14-18+ | High School | Mentor Alex |

### Subject Structure (Career-Focused Only)

| Subject | Code | Career Foundation |
|---------|------|-------------------|
| **English Language Arts** | ELA | Communication, technical writing |
| **Mathematics** | MATH | Logic, problem-solving, data literacy |
| **Science & Engineering** | SCI | Computational thinking, inquiry |
| **Life & Career Readiness** | LCR | Direct career skills, financial literacy |

**Excluded from core:** Health Education, Physical Education, Visual & Performing Arts, World Languages

### Content Hierarchy

```
TRACK 2: LOCAL EDUCATION
│
├── GRADE SPAN: Childhood (K-5)
│   ├── Grade: Kindergarten
│   │   ├── Subject: English Language Arts
│   │   │   ├── Unit: Letter Recognition
│   │   │   │   ├── Lesson: Uppercase A-M
│   │   │   │   ├── Lesson: Uppercase N-Z
│   │   │   │   └── Lesson: Lowercase Letters
│   │   │   └── Unit: Phonemic Awareness
│   │   │       ├── Lesson: Beginning Sounds
│   │   │       └── Lesson: Rhyming Words
│   │   └── Subject: Mathematics
│   │       ├── Unit: Counting
│   │       └── Unit: Shapes
│   ├── Grade: Grade 1
│   │   └── ...
│   └── Grade: Grade 5
│
├── GRADE SPAN: Early Adolescence (6-8)
│   └── ...
│
└── GRADE SPAN: Adolescence (9-Diploma)
    └── ...
```

### Database Schema (Proposed)

```sql
-- Grade spans (K-2, 3-5, 6-8, 9-12)
CREATE TABLE grade_spans (
    span_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL, -- 'Childhood', 'Early Adolescence', 'Adolescence'
    code VARCHAR(10) NOT NULL, -- 'K-5', '6-8', '9-12'
    grade_start VARCHAR(5) NOT NULL, -- 'K', '6', '9'
    grade_end VARCHAR(5) NOT NULL, -- '5', '8', '12'
    age_range_start INT NOT NULL, -- 5, 11, 14
    age_range_end INT NOT NULL, -- 11, 14, 18
    ai_persona VARCHAR(50), -- 'ms_sunshine', 'coach_jordan', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grades within spans
CREATE TABLE grades (
    grade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    span_id UUID NOT NULL REFERENCES grade_spans(span_id),
    name VARCHAR(20) NOT NULL, -- 'Kindergarten', 'Grade 1', etc.
    code VARCHAR(5) NOT NULL, -- 'K', '1', '2', etc.
    typical_age INT NOT NULL,
    sort_order INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- K-12 Subjects (different from Track 1 courses)
CREATE TABLE k12_subjects (
    subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL, -- 'ELA', 'MATH', 'SCI', 'LCR'
    description TEXT,
    mlr_code VARCHAR(50), -- Maine Learning Results code
    career_foundation TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- K-12 Units (within grade + subject)
CREATE TABLE k12_units (
    unit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID NOT NULL REFERENCES grades(grade_id),
    subject_id UUID NOT NULL REFERENCES k12_subjects(subject_id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    mlr_standards JSONB, -- Maine Learning Results standards covered
    sequence_order INT NOT NULL,
    estimated_weeks INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- K-12 Lessons (within units)
CREATE TABLE k12_lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES k12_units(unit_id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    lesson_type VARCHAR(50), -- video, reading, activity, quiz
    content_url TEXT, -- MOOSE link
    content_source VARCHAR(50), -- 'MOOSE', 'Khan Academy', 'CK-12'
    ai_context TEXT, -- Context for AI tutor
    mlr_standards JSONB,
    estimated_minutes INT,
    sequence_order INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### MOOSE Integration

| Source | URL | License | Content Type |
|--------|-----|---------|--------------|
| **MOOSE** | learnwithmoose.maine.gov | State-funded (free) | Full K-12 curriculum |
| **Khan Academy** | khanacademy.org | CC BY-NC-SA | Math, Science videos |
| **CK-12** | ck12.org | CC BY-NC | Textbooks, simulations |

### MOOSE Content Mapping Strategy

```
1. Identify MOOSE course by grade + subject
2. Extract lesson URLs from MOOSE
3. Store lesson metadata in k12_lessons
4. Store AI context summary locally
5. Link to MOOSE for actual content
6. Periodically validate links still work
```

### UI Considerations for K-12

| Age Group | UI Adjustments |
|-----------|----------------|
| **K-2** | Large buttons, lots of images, minimal text, audio instructions |
| **3-5** | Gamified elements, progress badges, colorful design |
| **6-8** | Social features, achievements, personalization options |
| **9-12** | More adult-like, career connections, portfolio building |

---

## 5. RESEARCH_FINDINGS

*No implementation yet - awaiting specification approval*

### MOOSE Investigation Required

- [ ] Access MOOSE content catalog
- [ ] Map MOOSE structure to PMERIT schema
- [ ] Identify content for each grade/subject
- [ ] Test content embedding/linking
- [ ] Contact Jennifer Page (jennifer.page@maine.gov) for partnership

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_PARENT_PORTAL | K-12 requires parental oversight |
| **Requires** | SCOPE_AI_PERSONAS | Age-appropriate AI tutors |
| **Requires** | SCOPE_CONTENT_SOURCES | MOOSE integration |
| **Enables** | Maine K-12 students | Primary target audience |
| **Enables** | Track 2 launch | Can't launch without K-12 structure |
| **Enables** | COPPA compliance | Age-gated features |

---

## 7. ACCEPTANCE CRITERIA

### Phase 1: Database Structure
- [ ] Grade spans table created (K-5, 6-8, 9-12)
- [ ] Grades table created (K through 12)
- [ ] K-12 subjects table created (ELA, MATH, SCI, LCR)
- [ ] K-12 units and lessons tables created
- [ ] Sample content for one grade/subject

### Phase 2: Content Integration
- [ ] MOOSE content mapped to structure
- [ ] At least one complete grade/subject populated
- [ ] AI context created for each lesson
- [ ] Content validation scripts working

### Phase 3: UI/UX
- [ ] Age-appropriate UI for each grade span
- [ ] K-2 simplified interface
- [ ] Grade selection flow for students
- [ ] Parent linking during registration

### Phase 4: AI Personas
- [ ] Ms. Sunshine active for K-2
- [ ] Mr. Explorer active for 3-5
- [ ] Coach Jordan active for 6-8
- [ ] Mentor Alex active for 9-12

---

## 8. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 43 | 2025-12-09 | Architecture specified |
| 62 | 2025-12-18 | Scope file created |

---

*Last Updated: 2025-12-18 (Session 62)*
