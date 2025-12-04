# PMERIT Brainstorm: ASU-Like Online School Experience with AI Tutors

**Session Date:** December 4, 2025
**Status:** Brainstorming / Design Phase
**Purpose:** Handoff document for schema evolution and implementation flow

---

## Executive Summary

This document explores how to evolve PMERIT's current schema (76 tables, pathway-based) into an ASU-like online university experience while maintaining the core mission of **AI tutors** (not human instructors), **free/low-cost education**, and **poverty liberation**.

---

# PART 1: PUBLIC CATALOG EXPERIENCE (ASU.edu Style)

## The Pre-Registration Experience

Just like visiting ASU.edu, potential students should be able to **browse the full course catalog** before committing to registration.

### User Flow: Guest → Catalog → Registration → Student

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GUEST VISITOR JOURNEY                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. VISIT PMERIT.COM (Homepage)                                     │
│     └── AI Chatbox + Quick Actions visible                          │
│                                                                     │
│  2. CLICK "Career Track & Explore Paths"                            │
│     └── Opens PUBLIC CATALOG (no login required)                    │
│                                                                     │
│  3. BROWSE CATALOG BY TRACK TYPE                                    │
│     ┌─────────────────────────────────────────────────────────────┐ │
│     │  [Tab 1: Global Remote]  [Tab 2: Local Education]  [Tab 3: Local Career] │
│     ├─────────────────────────────────────────────────────────────┤ │
│     │                                                             │ │
│     │  PATHWAY CARDS (Preview Mode)                               │ │
│     │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│     │  │ Web Dev     │ │ Data        │ │ UX Design   │           │ │
│     │  │ 12 courses  │ │ Analytics   │ │ 12 courses  │           │ │
│     │  │ 32 weeks    │ │ 12 courses  │ │ 28 weeks    │           │ │
│     │  │ [View →]    │ │ [View →]    │ │ [View →]    │           │ │
│     │  └─────────────┘ └─────────────┘ └─────────────┘           │ │
│     │                                                             │ │
│     └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  4. CLICK PATHWAY → VIEW FULL CURRICULUM                            │
│     ┌─────────────────────────────────────────────────────────────┐ │
│     │  WEB DEVELOPMENT PATHWAY                                    │ │
│     │  ──────────────────────────────────────                     │ │
│     │  Duration: 32 weeks | 12 Courses | Certificate              │ │
│     │                                                             │ │
│     │  COURSE LIST (Expandable):                                  │ │
│     │  ├── WD-101: HTML & CSS Fundamentals (2 weeks)              │ │
│     │  │   └── 4 modules, 16 lessons, 2 quizzes                   │ │
│     │  ├── WD-102: JavaScript Essentials (4 weeks)                │ │
│     │  │   └── 6 modules, 24 lessons, 3 quizzes, 1 project        │ │
│     │  ├── WD-103: Responsive Design (2 weeks)                    │ │
│     │  │   └── [Expand to see details]                            │ │
│     │  └── ... (9 more courses)                                   │ │
│     │                                                             │ │
│     │  [🔒 Register to Enroll]                                    │ │
│     └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  5. CLICK COURSE → VIEW COURSE SYLLABUS                             │
│     ┌─────────────────────────────────────────────────────────────┐ │
│     │  WD-102: JavaScript Essentials                              │ │
│     │  ──────────────────────────────────────                     │ │
│     │  Prerequisites: WD-101                                      │ │
│     │  Duration: 4 weeks | Credits: 3                             │ │
│     │  AI Tutor: Professor Ada (Professional Mentor)              │ │
│     │                                                             │ │
│     │  LEARNING OBJECTIVES:                                       │ │
│     │  • Understand JavaScript fundamentals                       │ │
│     │  • Build interactive UI elements                            │ │
│     │  • Work with DOM manipulation                               │ │
│     │                                                             │ │
│     │  MODULE OUTLINE:                                            │ │
│     │  1. Variables & Data Types (Week 1)                         │ │
│     │  2. Functions & Scope (Week 1-2)                            │ │
│     │  3. DOM Manipulation (Week 2-3)                             │ │
│     │  4. Events & Interactivity (Week 3)                         │ │
│     │  5. Project: Interactive Calculator (Week 4)                │ │
│     │  6. Final Assessment                                        │ │
│     │                                                             │ │
│     │  [🔒 Register to Enroll] [📥 Download Syllabus PDF]         │ │
│     └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  6. CLICK "Register" → SIGNUP/LOGIN FLOW                            │
│     └── After registration, redirected to Learner Dashboard         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Public Catalog Pages Required

| Page | URL Pattern | Content | Login Required |
|------|-------------|---------|----------------|
| Catalog Home | `/catalog` | Track type tabs, pathway cards | No |
| Pathway Detail | `/catalog/pathway/{slug}` | Full course list, duration, outcomes | No |
| Course Syllabus | `/catalog/course/{slug}` | Modules, objectives, AI tutor info | No |
| Course Preview | `/catalog/course/{slug}/preview` | Sample lesson (limited) | No |
| Register/Enroll | `/enroll/{pathway-slug}` | Registration + pathway enrollment | Yes |

### Schema for Public Catalog

```sql
-- Course visibility settings for public catalog
ALTER TABLE courses ADD COLUMN is_catalog_visible BOOLEAN DEFAULT TRUE;
ALTER TABLE courses ADD COLUMN syllabus_pdf_url TEXT;
ALTER TABLE courses ADD COLUMN preview_lesson_id UUID REFERENCES lessons(lesson_id);

-- Pathway catalog metadata
ALTER TABLE pathways ADD COLUMN catalog_description TEXT;
ALTER TABLE pathways ADD COLUMN career_outcomes TEXT[];
ALTER TABLE pathways ADD COLUMN sample_employers TEXT[];
ALTER TABLE pathways ADD COLUMN salary_range_usd VARCHAR(50); -- "$50,000 - $80,000"

-- Track catalog page views (analytics)
CREATE TABLE catalog_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pathway_id UUID REFERENCES pathways(pathway_id),
    course_id UUID REFERENCES courses(course_id),
    visitor_id VARCHAR(100), -- Anonymous tracking ID
    user_id UUID REFERENCES users(user_id), -- If logged in
    view_type VARCHAR(50), -- "pathway_view", "course_view", "syllabus_download"
    referrer_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

# PART 2: STUDENT REGISTRATION & CLASS MANAGEMENT

## The ASU-Style Add/Drop Experience

Once registered, students access their **Learner Dashboard** where they can:
- Browse the full catalog (now with "Enroll" buttons instead of "Register")
- Add courses to their schedule
- Drop courses (with deadline restrictions)
- View their enrolled courses and progress

### Student Dashboard: Class Registration Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LEARNER DASHBOARD                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Welcome, Amaka! | Academic Year: 2025-2026                         │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  MY ENROLLED COURSES (3 active)                               │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ WD-101: HTML & CSS Fundamentals                         │  │  │
│  │  │ Progress: ████████░░ 78%  | Due: Dec 15                 │  │  │
│  │  │ [Enter Classroom] [View Details] [Drop Course ⚠️]       │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ WD-102: JavaScript Essentials (LOCKED - Prerequisite)   │  │  │
│  │  │ Status: Enrolled, waiting for WD-101 completion         │  │  │
│  │  │ [View Details] [Drop Course]                            │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [+ ADD NEW COURSE]                                           │  │
│  │  ────────────────────                                         │  │
│  │  Opens catalog browser with "Enroll" buttons                  │  │
│  │  Shows prerequisite warnings if not met                       │  │
│  │  Confirms enrollment with "Add to My Courses"                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  MY PATHWAY PROGRESS                                          │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  Web Development (Global Remote)                              │  │
│  │  ████░░░░░░░░ 2/12 courses completed                          │  │
│  │  Estimated completion: August 2026                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Add/Drop Course Schema

```sql
-- Course enrollment with add/drop tracking
ALTER TABLE course_enrollments ADD COLUMN enrollment_type VARCHAR(50) DEFAULT 'self_enrolled';
-- "self_enrolled", "auto_enrolled" (from pathway), "admin_enrolled"

ALTER TABLE course_enrollments ADD COLUMN dropped_at TIMESTAMPTZ;
ALTER TABLE course_enrollments ADD COLUMN drop_reason TEXT;
ALTER TABLE course_enrollments ADD COLUMN can_drop_until DATE; -- Drop deadline

-- Enrollment history (for transcript/audit)
CREATE TABLE enrollment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    course_id UUID REFERENCES courses(course_id),
    action VARCHAR(50) NOT NULL, -- "enrolled", "dropped", "completed", "failed"
    action_date TIMESTAMPTZ DEFAULT NOW(),
    performed_by UUID REFERENCES users(user_id), -- Self or admin
    notes TEXT
);

-- Waitlist for full courses (optional)
CREATE TABLE course_waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    course_id UUID REFERENCES courses(course_id),
    waitlist_position INT,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    notified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);
```

---

# PART 3: THE VIRTUAL CLASSROOM EXPERIENCE

## Traditional Classroom Model with AI Tutor

The PMERIT classroom mirrors a **traditional classroom experience** where:
- The AI tutor is **already waiting** when the student enters
- The student **initiates the session** (like starting a call)
- Learning is **one-on-one** (not group-based)
- Students **raise their hand** for clarification (not "customer service mode")

### Classroom Session Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    VIRTUAL CLASSROOM SESSION FLOW                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. STUDENT ENTERS CLASSROOM (from Dashboard)                       │
│     └── Click "Enter Classroom" on enrolled course                  │
│                                                                     │
│  2. CLASSROOM LOADS - AI TUTOR WAITING                              │
│     ┌─────────────────────────────────────────────────────────────┐ │
│     │  ┌───────────────┐                                          │ │
│     │  │               │  "Welcome back, Amaka! I'm Professor     │ │
│     │  │  [AI Avatar]  │   Ada. Ready for today's lesson on       │ │
│     │  │  (Idle State) │   JavaScript functions?"                 │ │
│     │  │               │                                          │ │
│     │  └───────────────┘  [🟢 Start Session]  [📋 View Syllabus]  │ │
│     │                                                             │ │
│     │  Today's Lesson: Module 2, Lesson 3 - Function Parameters   │ │
│     │  Estimated Duration: 25 minutes                             │ │
│     └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  3. STUDENT CLICKS "START SESSION" (Like starting a call)          │
│     └── AI Tutor activates, begins lecture via RAG system          │
│     └── Virtual Human (Unreal/Cartoon/Text) starts speaking        │
│     └── TTS reads content, avatar lip-syncs                        │
│                                                                     │
│  4. DURING LECTURE - STUDENT OPTIONS                                │
│     ┌─────────────────────────────────────────────────────────────┐ │
│     │  ┌───────────────┐                                          │ │
│     │  │               │  "A function parameter is a variable     │ │
│     │  │  [AI Avatar]  │   that acts as a placeholder for values  │ │
│     │  │  (Speaking)   │   you pass into the function..."         │ │
│     │  │               │                                          │ │
│     │  └───────────────┘                                          │ │
│     │                                                             │ │
│     │  ┌─────────────────────────────────────────────────────┐    │ │
│     │  │ STUDENT CONTROLS                                    │    │ │
│     │  │ [✋ Raise Hand]  [⏸️ Pause]  [⏩ Skip]  [🔊 Volume] │    │ │
│     │  │ [📝 Take Notes]  [📤 Upload Assignment]             │    │ │
│     │  └─────────────────────────────────────────────────────┘    │ │
│     │                                                             │ │
│     │  Progress: ████████░░░░░░░░░░░░ 42% through lesson          │ │
│     └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  5. STUDENT RAISES HAND (Clarification Mode)                        │
│     └── AI pauses lecture                                           │
│     └── Student types or speaks question                            │
│     └── AI answers using RAG (contextual to current lesson)         │
│     └── AI resumes lecture or asks "Any more questions?"            │
│                                                                     │
│     ┌─────────────────────────────────────────────────────────────┐ │
│     │  [HAND RAISED - CLARIFICATION MODE]                         │ │
│     │                                                             │ │
│     │  Professor Ada: "Yes, Amaka? What would you like me to      │ │
│     │                  clarify?"                                  │ │
│     │                                                             │ │
│     │  Student Input: [________________________________] [Ask]    │ │
│     │                 🎤 Or click to speak                        │ │
│     │                                                             │ │
│     │  [Lower Hand & Resume Lecture]                              │ │
│     └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  6. LESSON COMPLETE - QUIZ/ASSIGNMENT                               │
│     └── AI announces quiz or assignment                             │
│     └── Student can take quiz immediately or later                  │
│     └── Assignments can be uploaded for AI grading                  │
│                                                                     │
│  7. SESSION END (Like ending a call)                                │
│     └── AI summarizes what was covered                              │
│     └── AI previews next lesson                                     │
│     └── Student clicks "End Session"                                │
│     └── Progress saved, returned to Dashboard                       │
│                                                                     │
│     ┌─────────────────────────────────────────────────────────────┐ │
│     │  Professor Ada: "Great work today, Amaka! We covered        │ │
│     │                  function parameters and return values.     │ │
│     │                  Next time, we'll explore arrow functions.  │ │
│     │                  Don't forget to complete Quiz 2.3!"        │ │
│     │                                                             │ │
│     │  [🔴 End Session]  [📝 Complete Quiz Now]  [⏭️ Next Lesson] │ │
│     └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Classroom Features by Mode

| Feature | During Lecture | Raise Hand Mode | Between Sessions |
|---------|---------------|-----------------|------------------|
| AI Speaking | ✅ Active (TTS + Avatar) | ⏸️ Paused | ❌ Idle |
| Student Input | Limited (reactions) | ✅ Full Q&A | ✅ Full access |
| RAG Context | Lesson content | Lesson + question | Full course |
| Avatar State | Animated/Speaking | Listening/Thinking | Idle/Waiting |

### Classroom Session Schema

```sql
-- Classroom sessions (tracks each "call" to the classroom)
CREATE TABLE classroom_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    course_id UUID REFERENCES courses(course_id),
    lesson_id UUID REFERENCES lessons(lesson_id),
    ai_tutor_persona_id UUID REFERENCES ai_tutor_personas(persona_id),

    -- Session lifecycle
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INT,

    -- Progress tracking
    lesson_progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_position JSONB, -- { "video_time": 120, "section": "2.3" }

    -- Interaction tracking
    hand_raises INT DEFAULT 0,
    questions_asked INT DEFAULT 0,
    notes_taken TEXT,

    -- Quality metrics
    avatar_type VARCHAR(50), -- "unreal", "cartoon", "text_only"
    connection_quality VARCHAR(50), -- "excellent", "good", "poor"

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hand raise / Q&A interactions within sessions
CREATE TABLE classroom_interactions (
    interaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES classroom_sessions(session_id),

    interaction_type VARCHAR(50) NOT NULL, -- "hand_raise", "pause", "skip", "note"

    -- For hand raises / questions
    student_question TEXT,
    ai_response TEXT,
    response_time_ms INT,

    -- Context at time of interaction
    lesson_position JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignment submissions from classroom
CREATE TABLE assignment_submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    assessment_id UUID REFERENCES assessments(assessment_id),
    session_id UUID REFERENCES classroom_sessions(session_id),

    -- Submission details
    submission_type VARCHAR(50), -- "file_upload", "text", "code", "scan"
    file_url TEXT,
    text_content TEXT,

    -- Grading
    ai_grade DECIMAL(5,2),
    ai_feedback TEXT,
    human_grade DECIMAL(5,2), -- If escalated
    human_feedback TEXT,
    final_grade DECIMAL(5,2),

    -- Status
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, grading, graded, resubmit
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    graded_at TIMESTAMPTZ
);
```

---

# PART 4: ASSESSMENT & PROCTORING

## Types of Assessments

| Type | Proctoring Level | AI Involvement | Location |
|------|------------------|----------------|----------|
| **In-Lesson Quiz** | None | AI grades instantly | Within classroom session |
| **Module Quiz** | Basic (time-limited) | AI grades | Classroom or dashboard |
| **Course Exam** | Proctored (webcam) | AI grades + flags | Dedicated exam mode |
| **Project** | Portfolio review | AI + peer review | Upload from anywhere |
| **Certification Exam** | External proctored | External body | Partner testing center |

### Proctoring Schema

```sql
-- Proctored exam sessions
CREATE TABLE proctored_sessions (
    proctoring_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    assessment_id UUID REFERENCES assessments(assessment_id),

    -- Proctoring type
    proctoring_level VARCHAR(50), -- "none", "basic", "webcam", "external"

    -- Session data
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,

    -- Integrity checks
    webcam_enabled BOOLEAN,
    screen_recording_enabled BOOLEAN,
    browser_lockdown BOOLEAN,

    -- Flags (potential issues)
    flags JSONB, -- [{"type": "face_not_visible", "timestamp": "...", "severity": "warning"}]
    flag_count INT DEFAULT 0,

    -- Review status
    requires_human_review BOOLEAN DEFAULT FALSE,
    reviewed_by UUID REFERENCES users(user_id),
    review_notes TEXT,

    -- Final status
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed, flagged, invalidated

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio projects
CREATE TABLE portfolio_projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    course_id UUID REFERENCES courses(course_id),

    -- Project details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_url TEXT, -- GitHub, deployed site, etc.
    thumbnail_url TEXT,

    -- Visibility
    is_public BOOLEAN DEFAULT FALSE, -- Visible to employers
    is_featured BOOLEAN DEFAULT FALSE, -- Highlighted on profile

    -- Skills demonstrated
    skills_demonstrated TEXT[],

    -- Review
    ai_review TEXT,
    ai_score DECIMAL(5,2),
    peer_reviews JSONB, -- [{reviewer_id, score, feedback}]

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

# PART 5: IMPLEMENTATION FLOW

## Phase 1: Public Catalog (Weeks 1-2)
```
1. Create /catalog route with track type tabs
2. Build pathway cards with preview data
3. Build course syllabus pages
4. Add "Register to Enroll" CTAs
5. Connect to existing pathways API
```

## Phase 2: Student Registration & Add/Drop (Weeks 3-4)
```
1. Enhance learner-portal.html with "My Courses" section
2. Add "+ Add Course" catalog browser
3. Implement course enrollment API
4. Add drop course functionality with deadline checks
5. Build enrollment history tracking
```

## Phase 3: Virtual Classroom Core (Weeks 5-8)
```
1. Refactor classroom.html for session-based model
2. Add "Start Session" / "End Session" controls
3. Implement "Raise Hand" feature (pause + Q&A)
4. Integrate RAG for contextual AI responses
5. Track classroom sessions in database
```

## Phase 4: Assessment & Proctoring (Weeks 9-12)
```
1. Build in-lesson quiz component
2. Implement module/course exam flow
3. Add basic proctoring (time limits, browser focus)
4. Build assignment upload + AI grading
5. Portfolio project submission system
```

## Phase 5: AI Tutor Personas (Weeks 13-14)
```
1. Create ai_tutor_personas table
2. Seed personas for each track type:
   - Professor Ada (Global Remote - Professional)
   - Ms. Sunshine (K-12 - Nurturing)
   - Coach Mike (CTE - Practical)
3. Integrate persona into classroom AI context
4. Avatar selection based on persona
```

---

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
