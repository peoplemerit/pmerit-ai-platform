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

**Session Status:** Brainstorming complete. Ready for implementation decisions.

*This document enables seamless continuation of the ASU-like schema discussion in future sessions.*
