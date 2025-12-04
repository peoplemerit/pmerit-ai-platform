# PMERIT Brainstorm: ASU-Like Online School Experience with AI Tutors

**Session Date:** December 4, 2025
**Status:** Brainstorming / Design Phase
**Purpose:** Handoff document for schema evolution discussions

---

## Executive Summary

This document explores how to evolve PMERIT's current schema (76 tables, pathway-based) into an ASU-like online university experience while maintaining the core mission of **AI tutors** (not human instructors), **free/low-cost education**, and **poverty liberation**.

---

## Current State vs. ASU-Like Model

### What PMERIT Has Now (76 Tables)

```
Current Hierarchy:
├── pathways (14 seeded) - "Web Development", "Data Analytics"
│   ├── courses (0 seeded) - Linked to pathways
│   │   ├── course_modules - Subdivisions within courses
│   │   │   └── lessons - Individual learning content
│   │   └── assessments - Quizzes, exams, projects
│   └── pathway_enrollments - User enrollment tracking
```

**Key Tables Already Exist:**
- `pathways`, `courses`, `course_modules`, `lessons`
- `pathway_enrollments`, `course_enrollments`, `lesson_progress`
- `assessments`, `assessment_questions`, `assessment_attempts`
- `materials`, `material_attachments`
- `content_translations`, `cultural_adaptations`

### What ASU Online Has (Traditional University)

```
ASU-Like Hierarchy:
├── universities (institution level)
│   ├── colleges - "Fulton School of Engineering"
│   │   ├── departments - "Computer Science"
│   │   │   ├── programs - "BS Computer Science (Online)"
│   │   │   │   ├── program_requirements - Core, elective, capstone
│   │   │   │   └── program_courses - Links courses to programs
│   │   │   ├── courses (catalog) - "CSC 101"
│   │   │   │   └── course_offerings (per term) - "CSC101-Fall2025-Section A"
│   │   │   │       ├── modules
│   │   │   │       ├── instructors (via course_instructors)
│   │   │   │       └── enrollments
│   │   │   └── instructors
├── terms - "Fall 2025 Session A"
├── students - Student profiles
│   └── student_programs - Enrollment in degree programs
└── LMS content (modules, learning_objects, assessments, submissions)
```

---

## Key Differences Analysis

| Aspect | PMERIT Current | ASU-Like | PMERIT + AI Tutor Vision |
|--------|---------------|----------|--------------------------|
| **Instructors** | None (AI implied) | Human instructors table | **AI Tutor Personalities** (virtual personas) |
| **Terms/Sessions** | None (self-paced) | Rigid term structure | **Flexible cohorts** (optional) |
| **Degrees/Programs** | Pathways = career tracks | Formal degrees (BS, MBA) | **Credential pathways** + micro-certs |
| **Course Offerings** | Single course definition | Course per term/section | **Continuous availability** |
| **Grading** | Competency-based | GPA-based | **Mastery + portfolio** |
| **Institution** | Single platform | Multi-university | **Single PMERIT "Academy"** |

---

## Proposed Schema Evolution

### Option A: Minimal Adaptation (Recommended for Now)

Keep the current pathway-based schema but add ASU-like features selectively:

```sql
-- 1. ADD: AI Tutor Personalities (replaces instructors table)
CREATE TABLE ai_tutor_personas (
    persona_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,           -- "Professor Ada", "Coach Marcus"
    personality_traits JSONB,             -- Big Five profile for AI behavior
    teaching_style VARCHAR(50),           -- "socratic", "direct", "encouraging"
    avatar_type VARCHAR(50),              -- "cartoon", "realistic", "text_only"
    avatar_config JSONB,                  -- Visual appearance settings
    voice_id VARCHAR(100),                -- TTS voice selection
    specializations TEXT[],               -- ["data_science", "web_dev"]
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADD: Programs (optional degree-like structure)
CREATE TABLE programs (
    program_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_code VARCHAR(20) UNIQUE,      -- "CERT-WD", "DIPLOMA-DA"
    program_name VARCHAR(255) NOT NULL,   -- "Web Development Certificate"
    credential_type VARCHAR(50),          -- "certificate", "diploma", "badge"
    description TEXT,
    total_credits_required INT,
    pathway_ids UUID[],                   -- Links to one or more pathways
    estimated_duration_months INT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADD: Student Programs (formal enrollment in credential programs)
CREATE TABLE student_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    program_id UUID REFERENCES programs(program_id),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active',  -- active, on_hold, completed, withdrawn
    expected_completion DATE,
    actual_completion DATE,
    certificate_url TEXT,
    UNIQUE(user_id, program_id)
);

-- 4. ADD: Cohorts (optional term-like structure for group learning)
CREATE TABLE cohorts (
    cohort_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_name VARCHAR(255) NOT NULL,    -- "Web Dev Cohort - January 2026"
    pathway_id UUID REFERENCES pathways(pathway_id),
    start_date DATE NOT NULL,
    end_date DATE,
    max_students INT,
    ai_tutor_persona_id UUID REFERENCES ai_tutor_personas(persona_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADD: Cohort Enrollments
CREATE TABLE cohort_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    cohort_id UUID REFERENCES cohorts(cohort_id),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active',
    UNIQUE(user_id, cohort_id)
);

-- 6. ENHANCE: Link courses to AI tutor personas
ALTER TABLE courses ADD COLUMN primary_tutor_id UUID REFERENCES ai_tutor_personas(persona_id);
ALTER TABLE course_modules ADD COLUMN tutor_id UUID REFERENCES ai_tutor_personas(persona_id);
```

### Option B: Full ASU Adaptation (Future State)

For a more traditional university feel:

```sql
-- Academic Structure
CREATE TABLE academic_departments (
    department_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE,              -- "CS", "BA", "HLTH"
    name VARCHAR(255) NOT NULL,           -- "Computer Science"
    description TEXT,
    track_type VARCHAR(50),               -- Links to global_remote, local_education, local_career
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Formal degree programs
CREATE TABLE degree_programs (
    program_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES academic_departments(department_id),
    code VARCHAR(20) UNIQUE,              -- "BSCS-ONLINE"
    name VARCHAR(255) NOT NULL,           -- "Bachelor of Science in Computer Science"
    level VARCHAR(50),                    -- "undergraduate", "graduate", "certificate"
    modality VARCHAR(50) DEFAULT 'online',
    credits_required INT,
    gpa_minimum DECIMAL(3,2),
    description TEXT,
    career_outcomes TEXT[],
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Program requirements
CREATE TABLE program_requirements (
    requirement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES degree_programs(program_id),
    requirement_type VARCHAR(50),         -- "core", "elective", "general_ed", "capstone"
    min_credits INT,
    min_courses INT,
    description TEXT
);

-- Courses linked to requirements
CREATE TABLE program_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES degree_programs(program_id),
    course_id UUID REFERENCES courses(course_id),
    requirement_type VARCHAR(50),
    is_required BOOLEAN DEFAULT FALSE,
    recommended_sequence INT,             -- Suggested order
    UNIQUE(program_id, course_id)
);

-- Academic terms (optional)
CREATE TABLE academic_terms (
    term_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE,              -- "2026-SPRING-A"
    name VARCHAR(100) NOT NULL,           -- "Spring 2026 Session A"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_opens DATE,
    registration_closes DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Course offerings per term
CREATE TABLE course_sections (
    section_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id),
    term_id UUID REFERENCES academic_terms(term_id),
    section_code VARCHAR(20),             -- "001", "ONLINE-A"
    ai_tutor_id UUID REFERENCES ai_tutor_personas(persona_id),
    max_enrollment INT,
    current_enrollment INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    UNIQUE(course_id, term_id, section_code)
);
```

---

## How AI Tutors Replace Human Instructors

### Traditional University (ASU)
```
Instructor:
├── Teaches course sections
├── Creates/curates content
├── Grades assignments
├── Answers questions
├── Provides feedback
└── Office hours
```

### PMERIT AI Tutor Model
```
AI Tutor Persona:
├── "Teaches" courses (contextual chat within course)
├── Content is pre-created (admin/curated)
├── Grades via:
│   ├── Automated quiz scoring
│   ├── LLM-based essay grading
│   └── Rubric-based project assessment
├── Answers questions (RAG-powered, course context)
├── Provides feedback (personalized, AI-generated)
└── Always available (no office hours needed)
```

### AI Tutor Personality System

```javascript
// Example AI Tutor Persona Configuration
{
  "persona_id": "prof-ada-001",
  "name": "Professor Ada",
  "personality_traits": {
    "openness": 0.8,
    "conscientiousness": 0.9,
    "extraversion": 0.6,
    "agreeableness": 0.85,
    "neuroticism": 0.2
  },
  "teaching_style": "socratic",
  "communication_style": {
    "formality": "semi-formal",
    "encouragement_level": "high",
    "detail_level": "comprehensive",
    "use_analogies": true
  },
  "avatar_config": {
    "type": "realistic",
    "gender": "female",
    "age_range": "40-50",
    "appearance": "professional_academic"
  },
  "voice_id": "elevenlabs_rachel",
  "specializations": ["computer_science", "mathematics"],
  "prompt_system": "You are Professor Ada, a patient and insightful computer science educator..."
}
```

---

## User Experience Comparison

### ASU Online Student Journey
1. Apply to program → Acceptance
2. Assigned academic advisor
3. Register for courses (term-based)
4. Attend virtual classes (scheduled)
5. Complete assignments (deadlines)
6. Receive grades from professor
7. Repeat each term
8. Graduate with degree

### PMERIT AI Tutor Journey (Proposed)
1. **Sign up** → Free access or subscribe
2. **Take personality assessment** → AI recommends pathway
3. **Choose pathway/program** → Optional cohort or self-paced
4. **Matched with AI Tutor** → Persona based on learning style
5. **Learn at own pace** → Always-available AI support
6. **Complete competencies** → Unlock next module/course
7. **Build portfolio** → Real-world projects
8. **Earn credentials** → Certificates, badges, portfolio
9. **Career matching** → AI suggests jobs based on skills

---

## Critical Design Decisions

### 1. Terms vs. Self-Paced
| Model | Pros | Cons | PMERIT Fit |
|-------|------|------|------------|
| **Term-based** | Structure, cohort community | Inflexible for working adults | Poor (target audience) |
| **Self-paced** | Flexible, poverty-friendly | No cohort, isolation | Good |
| **Hybrid** | Flexible + optional cohorts | Complexity | Best |

**Recommendation:** Self-paced with optional cohorts for community.

### 2. Degrees vs. Credentials
| Model | Pros | Cons | PMERIT Fit |
|-------|------|------|------------|
| **Traditional degrees** | Recognized, prestigious | Expensive, time-consuming | Poor |
| **Micro-credentials** | Fast, stackable | Less recognized | Good |
| **Portfolio + Certs** | Proves skills, employers like | No "degree" status | Best |

**Recommendation:** Stackable certificates + portfolio system.

### 3. GPA vs. Competency
| Model | Pros | Cons | PMERIT Fit |
|-------|------|------|------------|
| **GPA-based** | Traditional, comparable | Punishes early failure | Poor |
| **Competency** | Mastery-based, retry allowed | Unfamiliar to some | Best |

**Recommendation:** Competency-based with mastery thresholds.

---

## Schema Reconciliation Strategy

### Current Tables to Keep (14 core curriculum tables)
```
✅ pathways
✅ courses
✅ course_modules
✅ lessons
✅ materials
✅ material_attachments
✅ pathway_enrollments
✅ course_enrollments
✅ lesson_progress
✅ assessments
✅ assessment_questions
✅ assessment_attempts
✅ content_translations
✅ cultural_adaptations
```

### Tables to Add for ASU-Like Experience
```
🆕 ai_tutor_personas - AI teachers with personalities
🆕 programs - Optional credential programs
🆕 student_programs - User enrollment in programs
🆕 cohorts - Optional group learning sessions
🆕 cohort_enrollments - User cohort membership
🆕 program_requirements (optional) - Formal degree structure
🆕 academic_departments (optional) - Organizational structure
```

### Column Additions to Existing Tables
```sql
-- courses table
ALTER TABLE courses ADD COLUMN credits INT DEFAULT 3;
ALTER TABLE courses ADD COLUMN primary_tutor_id UUID REFERENCES ai_tutor_personas(persona_id);

-- pathway_enrollments table
ALTER TABLE pathway_enrollments ADD COLUMN ai_tutor_id UUID REFERENCES ai_tutor_personas(persona_id);
ALTER TABLE pathway_enrollments ADD COLUMN cohort_id UUID REFERENCES cohorts(cohort_id);
```

---

## Phased Implementation Roadmap

### Phase 1: AI Tutor Foundation (Weeks 1-2)
- [ ] Create `ai_tutor_personas` table
- [ ] Seed 3-5 initial AI tutor personas
- [ ] Add tutor assignment to courses
- [ ] Integrate tutor persona into AI chat context

### Phase 2: Programs & Credentials (Weeks 3-4)
- [ ] Create `programs` table
- [ ] Create `student_programs` table
- [ ] Build credential tracking system
- [ ] Certificate generation integration

### Phase 3: Optional Cohorts (Weeks 5-6)
- [ ] Create `cohorts` table
- [ ] Create `cohort_enrollments` table
- [ ] Build cohort discovery/join UI
- [ ] Cohort discussion features (optional)

### Phase 4: Full ASU Experience (Optional - Future)
- [ ] Academic departments
- [ ] Formal degree programs
- [ ] Term-based offerings
- [ ] Academic calendar

---

## Questions for Decision

1. **Do we need formal "degrees" or are stackable certificates enough?**
   - Formal degrees require more structure (terms, credits, GPA)
   - Certificates are faster to implement and more flexible

2. **Should students be assigned an AI tutor or choose their own?**
   - Assignment: Personalized based on assessment
   - Choice: User preference, autonomy

3. **Do we implement cohorts now or later?**
   - Now: Community building, structured experience
   - Later: Focus on self-paced first

4. **How many AI tutor personas to start?**
   - Minimum: 2-3 (variety in teaching styles)
   - Ideal: 5-6 (cover different subjects/styles)

---

## Next Steps for Next Session

1. **Decide:** Option A (minimal) vs Option B (full ASU)
2. **Create:** AI tutor personas table and seed data
3. **Design:** How AI tutor integrates with chat/learning
4. **Implement:** Programs table if credential system needed
5. **Test:** Student journey with AI tutor assignment

---

## References

- Current schema: `docs/handoffs/HANDOFF_SESSION_36_SCHEMA_RECONCILIATION.md`
- Curriculum brainstorm: `docs/startChathistory/Curriculum-implementation-brainstorm.md`
- Schema reconciliation: `docs/startChathistory/Schema-reconciliation-pmerit-backend-database.md`

---

## THE THREE TRACK TYPES — Complete Analysis

The original brainstorm identified THREE distinct track types, each requiring different schema approaches:

| Track Type | Focus | Target Audience | Structure Model |
|------------|-------|-----------------|-----------------|
| **Global Remote** | Career skills | Adults worldwide | Pathway → Course → Module |
| **Local Education** | K-12 academics | Age-based learners | Grade Level → Subject → Unit |
| **Local Career** | Vocational/CTE | Job seekers | Trade → Certification → Skill |

---

## TRACK 1: Global Remote (6 Pathways) — Career Training

**Already covered above.** Uses pathway-based structure with AI tutors.

| Pathway | Target Outcome |
|---------|----------------|
| Data Analytics | Data Analyst |
| Digital Marketing | Marketing Specialist |
| UX Design | UX/UI Designer |
| Web Development | Full-Stack Developer |
| Project Management | Project Manager |
| Business Analysis | Business Analyst |

**Schema Fit:** Current `pathways → courses → modules → lessons` works well.

---

## TRACK 2: Local Education (4 Pathways) — K-12 Academic

### Fundamental Difference from Career Training

K-12 education is **NOT pathway-based**. It's:
- **Age/Grade-based** (students in Grade 5, not "enrolled in a pathway")
- **Subject-based** (Math, ELA, Science — not "courses")
- **Standards-aligned** (Maine Learning Results, Common Core)
- **Time-structured** (academic year, not self-paced)

### The 4 Local Education Pathways

| Pathway | Age Range | Grade Levels | Maine Equivalent |
|---------|-----------|--------------|------------------|
| Early Childhood | 3-7 | PreK, K, 1, 2 | Pre-K to Grade 2 |
| Primary | 5-11 | K-5 | Childhood (K-5) |
| Secondary | 11-18 | 6-12 | Early Adolescence + Adolescence |
| College Prep | 18+ | Post-secondary | Higher Education |

### Maine's 8 Content Areas (Subjects)

1. English Language Arts (ELA)
2. Mathematics
3. Science & Engineering
4. Social Studies
5. Health & Physical Education
6. Visual & Performing Arts
7. World Languages
8. Life & Career Readiness

### Schema Requirements for K-12

The pathway model **doesn't fit K-12**. Need different structure:

```sql
-- K-12 SPECIFIC TABLES

-- 1. Grade Levels (replaces pathways for K-12)
CREATE TABLE grade_levels (
    grade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_code VARCHAR(10) NOT NULL,        -- "K", "1", "2", "6", "9"
    grade_name VARCHAR(100) NOT NULL,       -- "Kindergarten", "Grade 1"
    pathway_id UUID REFERENCES pathways(pathway_id), -- Links to "Primary", "Secondary"
    age_range_min INT,                      -- 5
    age_range_max INT,                      -- 6
    sort_order INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subjects (content areas - different from "courses")
CREATE TABLE subjects (
    subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code VARCHAR(20) NOT NULL,      -- "ELA", "MATH", "SCI"
    subject_name VARCHAR(100) NOT NULL,     -- "English Language Arts"
    description TEXT,
    icon_url TEXT,
    color_hex VARCHAR(7),                   -- "#4A90D9" for visual coding
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Grade-Subject Matrix (what subjects at what grade)
CREATE TABLE grade_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID REFERENCES grade_levels(grade_id),
    subject_id UUID REFERENCES subjects(subject_id),
    weekly_hours DECIMAL(4,2),              -- 5.0 hours per week
    credits_value DECIMAL(4,2),             -- For high school
    is_required BOOLEAN DEFAULT TRUE,
    standards_code VARCHAR(50),             -- "MLR-ELA-6-8"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(grade_id, subject_id)
);

-- 4. Units (replaces "modules" for K-12 - aligned to standards)
CREATE TABLE subject_units (
    unit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_subject_id UUID REFERENCES grade_subjects(id),
    unit_number INT NOT NULL,
    unit_title VARCHAR(255) NOT NULL,       -- "Fractions and Decimals"
    description TEXT,
    learning_standards TEXT[],              -- Maine Learning Results alignment
    estimated_weeks INT,                    -- 3 weeks
    sort_order INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Academic Years (for K-12 progression)
CREATE TABLE academic_years (
    year_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_code VARCHAR(10) NOT NULL,         -- "2025-2026"
    year_name VARCHAR(100) NOT NULL,        -- "Academic Year 2025-2026"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Student Grade Enrollment (which grade is student in)
CREATE TABLE student_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    grade_id UUID REFERENCES grade_levels(grade_id),
    academic_year_id UUID REFERENCES academic_years(year_id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'active',    -- active, promoted, retained, withdrawn
    promoted_to_grade_id UUID REFERENCES grade_levels(grade_id),
    promotion_date DATE,
    UNIQUE(user_id, academic_year_id)
);

-- 7. Subject Progress (tracks student progress in each subject)
CREATE TABLE student_subject_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    grade_subject_id UUID REFERENCES grade_subjects(id),
    academic_year_id UUID REFERENCES academic_years(year_id),
    current_unit_id UUID REFERENCES subject_units(unit_id),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    grade_letter VARCHAR(5),                -- "A", "B+", "Pass"
    grade_percentage DECIMAL(5,2),
    standards_met TEXT[],                   -- Which learning standards achieved
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, grade_subject_id, academic_year_id)
);

-- 8. Parent/Guardian Links (K-12 specific)
CREATE TABLE student_guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_user_id UUID REFERENCES users(user_id),
    guardian_user_id UUID REFERENCES users(user_id),
    relationship VARCHAR(50),               -- "parent", "guardian", "grandparent"
    is_primary BOOLEAN DEFAULT FALSE,
    can_view_progress BOOLEAN DEFAULT TRUE,
    can_communicate BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_user_id, guardian_user_id)
);
```

### Nigeria Adaptation for Local Education

| US (Maine) | Nigeria Equivalent |
|------------|-------------------|
| Early Childhood (PreK-2) | ECCDE (Early Child Care) |
| Primary (K-5) | Basic 1-6 |
| Middle School (6-8) | JSS 1-3 (Junior Secondary) |
| High School (9-12) | SSS 1-3 (Senior Secondary) |
| College | Tertiary Education |

```sql
-- Regional education system mappings
CREATE TABLE education_system_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID REFERENCES grade_levels(grade_id),
    region_code VARCHAR(10) NOT NULL,       -- "US-ME", "NG"
    local_grade_name VARCHAR(100),          -- "JSS 1", "Basic 4"
    local_standards TEXT[],                 -- Nigerian curriculum alignment
    language_options TEXT[],                -- ["en", "yo", "ig", "ha"]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(grade_id, region_code)
);
```

### K-12 AI Tutor Considerations

For younger learners, AI tutors need different personas:

```javascript
// K-12 AI Tutor Persona Examples
{
  "persona_id": "tutor-sunshine-001",
  "name": "Ms. Sunshine",
  "target_grades": ["K", "1", "2"],
  "teaching_style": "nurturing",
  "communication_style": {
    "vocabulary_level": "simple",
    "sentence_length": "short",
    "use_visuals": true,
    "positive_reinforcement": "high",
    "patience_level": "maximum"
  },
  "avatar_config": {
    "type": "cartoon",
    "appearance": "friendly_teacher",
    "animations": ["wave", "clap", "thumbs_up"]
  }
}
```

---

## TRACK 3: Local Career (4 Pathways) — CTE/Vocational

### Fundamental Difference from Academic Education

CTE (Career & Technical Education) is:
- **Industry-certified** (OSHA, EPA 608, AWS, ASE)
- **Hands-on** (practical skills, may require in-person)
- **Employment-focused** (apprenticeships, union pathways)
- **Competency-based** (pass certification, not GPA)

### The 4 Local Career Pathways (Consolidated from Maine's 16 Clusters)

| Pathway | Maine CTE Clusters | Example Certifications | Careers |
|---------|-------------------|----------------------|---------|
| Healthcare Careers | Health Science | CNA, EMT, CPR/First Aid | Medical Assistant, Nursing |
| Skilled Trades | Construction, Manufacturing, Transportation | OSHA 10/30, EPA 608, AWS, ASE | Electrician, Plumber, Welder |
| Hospitality & Service | Hospitality & Tourism, Human Services | ServSafe, TIPS | Culinary, Hotel Management |
| Public Service | Government, Law/Public Safety, Education | ParaPro, Emergency Dispatch | Teaching Asst, Law Enforcement |

### Schema Requirements for CTE

```sql
-- CTE/VOCATIONAL SPECIFIC TABLES

-- 1. Industry Certifications (external credentials)
CREATE TABLE industry_certifications (
    cert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cert_code VARCHAR(50) NOT NULL,         -- "OSHA-10", "EPA-608", "AWS-D1.1"
    cert_name VARCHAR(255) NOT NULL,        -- "OSHA 10-Hour Safety"
    issuing_body VARCHAR(255),              -- "Occupational Safety and Health Admin"
    description TEXT,
    validity_months INT,                    -- 60 (5 years)
    renewal_required BOOLEAN DEFAULT FALSE,
    external_exam_required BOOLEAN,         -- Must take external test
    exam_url TEXT,                          -- Link to official exam
    cost_usd DECIMAL(10,2),                 -- $25.00
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trade Skills (granular skills within trades)
CREATE TABLE trade_skills (
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_code VARCHAR(50) NOT NULL,        -- "ELEC-WIRING-RESIDENTIAL"
    skill_name VARCHAR(255) NOT NULL,       -- "Residential Wiring"
    description TEXT,
    pathway_id UUID REFERENCES pathways(pathway_id),
    skill_level VARCHAR(50),                -- "foundational", "intermediate", "advanced"
    hands_on_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Course-to-Certification Links
CREATE TABLE course_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id),
    cert_id UUID REFERENCES industry_certifications(cert_id),
    preparation_level VARCHAR(50),          -- "full_prep", "partial_prep", "awareness"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, cert_id)
);

-- 4. Student Certifications Earned
CREATE TABLE student_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    cert_id UUID REFERENCES industry_certifications(cert_id),
    earned_date DATE,
    expiry_date DATE,
    certificate_number VARCHAR(100),        -- External cert number
    verification_url TEXT,                  -- Link to verify
    status VARCHAR(50) DEFAULT 'active',    -- active, expired, revoked
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Apprenticeship Programs (links to unions/employers)
CREATE TABLE apprenticeship_programs (
    program_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_name VARCHAR(255) NOT NULL,     -- "IBEW Local 474 Apprenticeship"
    pathway_id UUID REFERENCES pathways(pathway_id),
    organization VARCHAR(255),              -- "International Brotherhood of Electrical Workers"
    location_required VARCHAR(255),         -- "Portland, ME area"
    duration_months INT,                    -- 48 (4 years)
    application_url TEXT,
    requirements TEXT[],                    -- Prerequisites
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Hands-On Lab Requirements
CREATE TABLE lab_requirements (
    lab_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id),
    lab_type VARCHAR(50),                   -- "simulation", "in_person", "hybrid"
    description TEXT,
    equipment_needed TEXT[],                -- ["multimeter", "safety_glasses"]
    partner_locations TEXT[],               -- Partner schools/shops for in-person
    simulation_url TEXT,                    -- Virtual lab link
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Employer Partners (for job placement)
CREATE TABLE employer_partners (
    employer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    location VARCHAR(255),
    hiring_pathways UUID[],                 -- Which pathways they hire from
    contact_email VARCHAR(255),
    partnership_status VARCHAR(50),         -- "active", "pending", "inactive"
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### CTE Online Limitations

Some CTE skills **cannot be fully taught online**:

| Skill Area | Online Capability | Solution |
|------------|------------------|----------|
| Safety theory (OSHA) | ✅ Fully online | Course + online exam |
| Blueprint reading | ✅ Fully online | Interactive exercises |
| Welding technique | ⚠️ Theory only | Partner with local trade schools |
| Electrical wiring | ⚠️ Simulations | Virtual labs + local practicum |
| Patient care (CNA) | ⚠️ Theory only | Clinical hours at partner facilities |

```sql
-- Track which courses need in-person components
ALTER TABLE courses ADD COLUMN requires_in_person BOOLEAN DEFAULT FALSE;
ALTER TABLE courses ADD COLUMN in_person_hours_required INT;
ALTER TABLE courses ADD COLUMN partner_facility_types TEXT[]; -- ["trade_school", "hospital", "community_college"]
```

---

## UNIFIED SCHEMA STRATEGY

### How the Three Tracks Coexist

```
pathways table (14 seeded)
├── track_type = 'global_remote' (6)
│   └── Uses: courses → modules → lessons (standard)
│
├── track_type = 'local_education' (4)
│   └── Uses: grade_levels → subjects → units (K-12 specific)
│
└── track_type = 'local_career' (4)
    └── Uses: courses → certifications + trade_skills (CTE specific)
```

### Shared Tables (All Tracks)

```
✅ users, user_profiles
✅ ai_tutor_personas
✅ materials, material_attachments
✅ assessments, assessment_questions
✅ content_translations, cultural_adaptations
✅ lesson_progress (adapted per track)
```

### Track-Specific Tables

| Global Remote | Local Education | Local Career |
|--------------|-----------------|--------------|
| courses | grade_levels | courses |
| course_modules | subjects | industry_certifications |
| lessons | grade_subjects | trade_skills |
| pathway_enrollments | subject_units | course_certifications |
| course_enrollments | academic_years | student_certifications |
| — | student_grades | apprenticeship_programs |
| — | student_guardians | lab_requirements |
| — | education_system_mappings | employer_partners |

---

## IMPLEMENTATION PRIORITY

### Recommended Order

1. **Global Remote** (Weeks 1-4) — Already have foundation, add AI tutors
2. **Local Career/CTE** (Weeks 5-8) — Similar to career tracks, add certifications
3. **Local Education/K-12** (Weeks 9-16) — Most complex, different model

### Why This Order?

| Track | Complexity | Revenue Potential | Mission Impact |
|-------|------------|-------------------|----------------|
| Global Remote | Medium | High (adult learners pay) | High (job outcomes) |
| Local Career | Medium | Medium (certification prep) | High (employment) |
| Local Education | High | Low (free for kids) | Very High (poverty liberation) |

---

## Questions for Decision (Updated)

1. **Should K-12 (Local Education) use same pathway structure or separate grade-level structure?**
   - Same: Simpler code, less flexible
   - Separate: More accurate model, more tables

2. **How do we handle CTE hands-on requirements?**
   - Partner facilities: Requires business development
   - Simulations only: Limited but scalable
   - Hybrid: Best but complex

3. **Should AI tutors be different for children vs adults?**
   - Yes: Different personas for age appropriateness
   - No: Universal tutor with adaptive behavior

4. **Which track to build first?**
   - Global Remote: Fastest to market, revenue generating
   - Local Education: Highest mission impact, most complex
   - Local Career: Middle ground, certification-focused

---

**Session Status:** Comprehensive brainstorming complete for all three track types.

*This document enables seamless continuation of the multi-track schema discussion in future sessions.*
