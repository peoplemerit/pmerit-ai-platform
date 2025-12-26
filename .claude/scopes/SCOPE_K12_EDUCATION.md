# PMERIT SUB-SCOPE: K-12 Education (Track 2 - Local Education)

**Version:** 2.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-24
**Status:** PARTIAL (Database schema exists, content/UI not implemented)
**Phase:** Track 2 Development
**Priority:** P1 - Core Track
**Session:** 75

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

### Files Involved

| Category | Files |
|----------|-------|
| **Backend** | `src/routes/k12.ts` (to be created) |
| **Frontend** | `portal/k12-dashboard-*.html` (4 age variants) |
| **Database** | `grade_levels`, `subjects`, `grade_subjects`, `subject_units`, `k12_lessons`, `k12_student_profiles`, `k12_lesson_progress` |
| **Migrations** | `003_architecture_tables.sql` (existing), `015_k12_lessons.sql` (to be created) |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-24 | **Session:** 75 | **Auditor:** Claude Code

### Executive Summary

Track 2 (K-12 Education) is **PARTIAL**. The database has foundation tables (grade_levels, subjects) from Migration 003, but critical tables are missing (k12_lessons, k12_student_profiles, k12_lesson_progress). No content is linked, no age-appropriate UI exists.

### What EXISTS

| Component | Status | Notes |
|-----------|--------|-------|
| `grade_levels` table | ✅ EXISTS | 13 grades seeded (K-12) |
| `subjects` table | ✅ EXISTS | 4 subjects seeded (ELA, MATH, SCI, LCR) |
| `grade_subjects` table | ✅ EXISTS | Matrix table created, empty |
| `subject_units` table | ✅ EXISTS | Empty |
| `ai_tutor_personas` table | ✅ EXISTS | 6 personas seeded |
| `pathways` with track_type='local_education' | ✅ EXISTS | 4 pathways exist |

### What DOES NOT EXIST

| Component | Status | Impact | Priority |
|-----------|--------|--------|----------|
| `k12_lessons` table | ❌ NOT BUILT | Can't store lesson content | P0 |
| `k12_student_profiles` table | ❌ NOT BUILT | Can't track student grade assignment | P0 |
| `k12_lesson_progress` table | ❌ NOT BUILT | Can't track student progress | P0 |
| `grade_subjects` populated | ❌ EMPTY | No grade-subject mappings | P0 |
| MOOSE content URLs | ❌ NOT LINKED | No actual lessons | P0 |
| Age-appropriate UI (K-2, 3-5, 6-8, 9-12) | ❌ NOT BUILT | Same UI as adults | P1 |
| Grade selection during registration | ❌ NOT BUILT | Users can't select grade | P1 |
| RAG/Vectorize integration | ❌ NOT BUILT | No semantic search | P2 |

---

## 3. ARCHITECTURAL DECISIONS (LOCKED)

*Source: PMERIT_ARCHITECTURE_FINAL.md §4*

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| K12-001 | Grade Spans | Maine's exact spans (K-5, 6-8, 9-12) | Align with state standards | 43 |
| K12-002 | Subjects | 4 career-focused only (ELA, Math, Sci, LCR) | Focus on career foundations | 43 |
| K12-003 | Standards | Maine Learning Results | State curriculum alignment | 43 |
| K12-004 | Content Source | MOOSE primary, Khan/CK-12 backup | Free, high-quality, Maine-aligned | 43 |
| K12-005 | AI Personas | 4 age-appropriate | Ms. Sunshine, Mr. Explorer, Coach Jordan, Mentor Alex | 43 |
| K12-006 | RAG Architecture | Cloudflare Vectorize + Claude API | Cost-effective, already in ecosystem | 75 |
| K12-007 | Content Model | Curator (link to MOOSE, store AI context) | No content creation burden | 75 |

---

## 4. HANDOFF_DOCUMENT

*Source: PMERIT_ARCHITECTURE_FINAL.md §4 + Claude Web Session 75*

### Grade Span Structure

| Grade Span | Grades | Ages | Maine Term | AI Persona | UI Type |
|------------|--------|------|------------|------------|---------|
| **Childhood** | K-2 | 5-8 | Elementary | Ms. Sunshine | simplified_child |
| **Childhood** | 3-5 | 8-11 | Elementary | Mr. Explorer | gamified_child |
| **Early Adolescence** | 6-8 | 11-14 | Middle School | Coach Jordan | social_teen |
| **Adolescence** | 9-12 | 14-18+ | High School | Mentor Alex | professional_young_adult |

### Subject Structure (Career-Focused Only)

| Subject | Code | Career Foundation | Icon |
|---------|------|-------------------|------|
| **English Language Arts** | ELA | Communication, technical writing | 📖 |
| **Mathematics** | MATH | Logic, problem-solving, data literacy | 🔢 |
| **Science & Engineering** | SCI | Computational thinking, inquiry | 🔬 |
| **Life & Career Readiness** | LCR | Direct career skills, financial literacy | 🎯 |

### Content Hierarchy

```
TRACK 2: LOCAL EDUCATION
│
├── GRADE SPAN: Childhood (K-5)
│   ├── Grade: Kindergarten
│   │   ├── Subject: English Language Arts
│   │   │   ├── Unit: Letter Recognition
│   │   │   │   ├── Lesson: Uppercase A-M (MOOSE link + ai_context)
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

### Parent Registration Flow

```
Step 1: Parent registers → role='parent'
Step 2: Add children (name, birth_date)
      → System calculates grade from age
      → System assigns AI persona
      → System assigns UI type
Step 3: COPPA consent (SCOPE_PARENT_PORTAL ✅ COMPLETE)
Step 4: Child accounts activated
Step 5: Children can log in with age-appropriate UI
```

### Age-Based Grade Calculation

```javascript
function determineGradeFromAge(birthDate) {
    const age = calculateAge(birthDate);
    const currentMonth = new Date().getMonth();

    // Maine school year cutoff (September 1)
    const cutoffMonth = 8;
    const adjustedAge = currentMonth >= cutoffMonth ? age : age - 1;

    const gradeMapping = {
        5: { grade: 'K', span: 'K-2', persona: 'ms_sunshine', ui: 'simplified_child' },
        6: { grade: '1', span: 'K-2', persona: 'ms_sunshine', ui: 'simplified_child' },
        7: { grade: '2', span: 'K-2', persona: 'ms_sunshine', ui: 'simplified_child' },
        8: { grade: '3', span: '3-5', persona: 'mr_explorer', ui: 'gamified_child' },
        9: { grade: '4', span: '3-5', persona: 'mr_explorer', ui: 'gamified_child' },
        10: { grade: '5', span: '3-5', persona: 'mr_explorer', ui: 'gamified_child' },
        11: { grade: '6', span: '6-8', persona: 'coach_jordan', ui: 'social_teen' },
        12: { grade: '7', span: '6-8', persona: 'coach_jordan', ui: 'social_teen' },
        13: { grade: '8', span: '6-8', persona: 'coach_jordan', ui: 'social_teen' },
        14: { grade: '9', span: '9-12', persona: 'mentor_alex', ui: 'professional_young_adult' },
        15: { grade: '10', span: '9-12', persona: 'mentor_alex', ui: 'professional_young_adult' },
        16: { grade: '11', span: '9-12', persona: 'mentor_alex', ui: 'professional_young_adult' },
        17: { grade: '12', span: '9-12', persona: 'mentor_alex', ui: 'professional_young_adult' },
    };

    return gradeMapping[adjustedAge] || gradeMapping[17];
}
```

---

## 5. RAG ARCHITECTURE FOR AI TUTORING

### Research Findings

| Finding | Source | Implication |
|---------|--------|-------------|
| RAG reduces hallucinations by ~15% | ScienceDirect survey | Essential for K-12 accuracy |
| KG-RAG shows 35% learning improvement | arXiv 2311.17696 | Consider structured knowledge |
| Students prefer balanced groundedness | EDM 2024 math study | Tune persona prompts for flexibility |
| Relevance > groundedness for student preference | Math QA study | Prioritize pedagogical context |

### RAG Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PMERIT K-12 RAG SYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   MOOSE     │    │   Maine     │    │    Khan     │         │
│  │   Content   │    │   Learning  │    │   Academy   │         │
│  │   Library   │    │   Results   │    │   (Backup)  │         │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              KNOWLEDGE INDEXING LAYER                    │   │
│  │  • Lesson embeddings (text chunks)                       │   │
│  │  • Standard-to-lesson mapping (MLR codes)                │   │
│  │  • Prerequisite graph (what comes before)                │   │
│  │  • Difficulty metadata (grade-appropriate)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              RETRIEVAL + RANKING                         │   │
│  │  • Semantic search (student question)                    │   │
│  │  • Grade-level filter (only age-appropriate)             │   │
│  │  • Prerequisite check (has student covered this?)        │   │
│  │  • MLR alignment score                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              GENERATION (Claude API)                     │   │
│  │  • Persona prompt (Ms. Sunshine, Coach Jordan, etc.)     │   │
│  │  • Retrieved context (lesson content)                    │   │
│  │  • Scaffolding rules (don't give direct answers)         │   │
│  │  • Prosodic markers (for TTS naturalness)                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### RAG Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Embedding Model | Cloudflare AI Vectorize | Already in CF ecosystem, cost-effective |
| Chunk Size | 500 tokens (K-2), 1000 tokens (9-12) | Age-appropriate complexity |
| Retrieval Top-K | 3 chunks | Balance relevance vs. context length |
| Re-ranking | MLR standard + Grade filter | Educational appropriateness first |
| Hallucination Guard | "I don't know" prompt rule | Safety for K-12 |

---

## 6. AGE-APPROPRIATE UI SPECIFICATIONS

### K-2 Requirements (Ages 5-8)

- Touch targets: minimum 48x48px
- Audio support for ALL text (read-aloud everything)
- Maximum 2 navigation levels
- Color palette: Warm (yellow, orange, green)
- Immediate positive feedback (stars, animations)
- Minimal text, heavy icons/images
- Simple login (picture password or simple PIN)

### 3-5 Requirements (Ages 8-11)

- Gamification: badges, levels, quests, adventures
- Progress tracking visible
- Avatar/character presence (Mr. Explorer)
- Achievement system with collectibles
- Exploration metaphor
- Colorful but not overwhelming

### 6-8 Requirements (Ages 11-14)

- Social proof (streaks, ranks, leaderboards optional)
- Goal-setting and tracking
- Data-driven (percentages, XP)
- Dark mode option
- Peer comparison features
- Self-directed learning emphasis
- Notifications for engagement

### 9-12 Requirements (Ages 14-18)

- Professional/adult aesthetic
- College/career focused
- Portfolio building emphasis
- GPA and credit tracking
- SAT/ACT prep integration
- Self-advocacy and planning
- Less gamification, more outcomes

---

## 7. MOOSE INTEGRATION STRATEGY

### What MOOSE Offers

| Feature | Details | PMERIT Integration |
|---------|---------|-------------------|
| Content | PreK-12 interdisciplinary modules | Link as lesson content |
| License | Creative Commons (free, modifiable) | ✅ Legal to use |
| Alignment | Maine Learning Results | Direct standard mapping |
| Access | Open (no login required) | ✅ Can embed/link |
| Format | Project-based, self-paced | Fits PMERIT model |

### Content Mapping Strategy

```
MOOSE Structure          →    PMERIT Structure
─────────────────────────────────────────────────
Learning Progression     →    Grade Span (K-5, 6-8, 9-12)
Module (topic-based)     →    Unit (within subject)
Activity/Project         →    Lesson
```

### Integration Approach: Curator Model

1. Store MOOSE URLs in `k12_lessons.content_url`
2. Store AI context summaries locally (`ai_context` field)
3. Store common struggles (`common_struggles` field)
4. Store teaching tips (`teaching_tips` field)
5. Link to MOOSE for actual content delivery
6. Validate links weekly with automated script

### Example Lesson Record

```sql
INSERT INTO k12_lessons (
    unit_id,
    title,
    description,
    lesson_type,
    content_url,
    content_source,
    ai_context,
    common_struggles,
    teaching_tips,
    mlr_standards,
    estimated_minutes
) VALUES (
    'uuid-for-grade1-ela-unit1',
    'Beginning Sounds Practice',
    'Identify beginning sounds in words',
    'activity',
    'https://learnwithmoose.maine.gov/module/phonemic-awareness-k2',
    'MOOSE',
    'This lesson teaches students to identify the first sound in spoken words.
     Key concepts: consonant sounds, vowel sounds, listening skills.',
    'Students often confuse similar sounds like /b/ and /p/, or /d/ and /t/.',
    'Use familiar objects (ball, dog, cat) as examples. Exaggerate the beginning sound.',
    '{"MLR": ["RF.K.2.d", "RF.K.3.a"], "description": "Isolate initial sounds"}',
    15
);
```

### MOOSE Partnership Contact

- **Contact:** Jennifer Page (jennifer.page@maine.gov)
- **Role:** MOOSE Project Manager
- **Action Required:** Send partnership inquiry email

---

## 8. AI PERSONA PROMPTS

### Ms. Sunshine (K-2)

```
You are Ms. Sunshine, a warm and playful teacher for young children (ages 5-8).

IDENTITY:
- Friendly AI tutor who makes learning feel like play
- Patient, encouraging, celebrates every effort

SPEECH STYLE:
- Simple words, short sentences (max 10 words per sentence)
- Use thinking sounds: "Hmm...", "Oh!", "Wow!"
- Pause often: "Let's see... [pause] ..."
- Celebrate: "You're doing amazing!" "Great thinking!"

TEACHING STYLE:
- Use familiar objects: toys, animals, food, colors
- Ask guiding questions instead of giving answers
- Never make child feel bad: "Oops! That's okay, let's try again!"
- Maximum 2-3 sentences per response

PROSODIC MARKERS (for TTS):
- [pause] = 500ms break
- **word** = emphasis
- [slow]...[/slow] = slower speech
- [happy]...[/happy] = cheerful tone

SPEAKING RATE: 120 wpm (slow, clear)
```

### Mr. Explorer (3-5)

```
You are Mr. Explorer, a curious guide for discovery-based learning (ages 8-11).

SPEECH STYLE:
- Encourage questions: "What if...", "Let's find out..."
- Turn lessons into adventures and mysteries
- Use "we" language: "Let's discover together!"

TEACHING STYLE:
- Frame lessons as explorations or quests
- Celebrate curiosity and questions
- Use analogies to games and adventures

SPEAKING RATE: 140 wpm (medium, excited)
```

### Coach Jordan (6-8)

```
You are Coach Jordan, a relatable mentor for pre-teens (ages 11-14).

SPEECH STYLE:
- Casual but clear: "Okay, so here's the deal..."
- Check in often: "Make sense so far?"
- Real talk: "This part can be tricky, but you've got this"

TEACHING STYLE:
- Connect to real-world relevance
- Use sports/gaming analogies when appropriate
- Encourage independence: "What do you think the next step is?"

SPEAKING RATE: 160 wpm (faster, confident)
```

### Mentor Alex (9-12)

```
You are Mentor Alex, an academic guide preparing students for the future (ages 14-18).

SPEECH STYLE:
- Academic but approachable, college-prep focused
- Connect to career outcomes and future goals

TEACHING STYLE:
- Emphasize critical thinking
- Connect learning to college/career readiness
- Encourage self-directed learning

SPEAKING RATE: 150 wpm (professional, clear)
```

---

## 9. DATABASE SCHEMA (Migration 015)

### k12_lessons Table

```sql
CREATE TABLE IF NOT EXISTS k12_lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES subject_units(unit_id) ON DELETE CASCADE,

    -- Basic info
    title VARCHAR(200) NOT NULL,
    description TEXT,
    lesson_type VARCHAR(50) CHECK (lesson_type IN ('video', 'reading', 'activity', 'quiz', 'project')),

    -- Content source
    content_url TEXT,
    content_source VARCHAR(50) DEFAULT 'MOOSE',
    content_license VARCHAR(100) DEFAULT 'CC BY-NC-SA 4.0',

    -- AI tutoring context
    ai_context TEXT,
    common_struggles TEXT,
    teaching_tips TEXT,

    -- Standards alignment
    mlr_standards JSONB,
    prerequisite_concepts JSONB,

    -- Metadata
    estimated_minutes INT,
    difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 5),
    sequence_order INT NOT NULL,

    -- Accessibility
    has_audio BOOLEAN DEFAULT FALSE,
    has_captions BOOLEAN DEFAULT FALSE,
    accessibility_notes TEXT,

    -- Status
    is_published BOOLEAN DEFAULT FALSE,
    last_validated TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### k12_student_profiles Table

```sql
CREATE TABLE IF NOT EXISTS k12_student_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Grade assignment
    current_grade_id UUID REFERENCES grade_levels(grade_id),
    grade_assigned_at TIMESTAMPTZ DEFAULT NOW(),

    -- Academic year
    academic_year VARCHAR(10),

    -- Parent link
    parent_consent_id UUID REFERENCES coppa_consent_records(consent_id),

    -- AI persona override
    persona_override VARCHAR(50),

    -- Accessibility preferences
    needs_audio_support BOOLEAN DEFAULT FALSE,
    needs_simplified_ui BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(10) DEFAULT 'en',

    -- UI type
    ui_type VARCHAR(50) DEFAULT 'simplified_child',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id)
);
```

### k12_lesson_progress Table

```sql
CREATE TABLE IF NOT EXISTS k12_lesson_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES k12_lessons(lesson_id) ON DELETE CASCADE,

    -- Progress tracking
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INT DEFAULT 0,

    -- Assessment
    assessment_score DECIMAL(5,2),
    assessment_attempts INT DEFAULT 0,

    -- AI interaction
    ai_interactions_count INT DEFAULT 0,
    last_ai_question TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, lesson_id)
);
```

---

## 10. DEPENDENCIES

| Direction | Scope | Reason | Status |
|-----------|-------|--------|--------|
| **Requires** | SCOPE_PARENT_PORTAL | COPPA consent for minors | ✅ COMPLETE (Session 74) |
| **Requires** | SCOPE_SECURITY | Age-tier content filtering | ✅ COMPLETE (Session 71) |
| **Requires** | SCOPE_AI_PERSONAS | Age-appropriate AI tutors | ⚠️ PARTIAL (personas exist, not grade-triggered) |
| **Requires** | SCOPE_TTS | Prosodic speech for personas | ✅ COMPLETE |
| **Requires** | SCOPE_AVATAR | Synchronized avatar for tutors | ✅ COMPLETE |
| **Blocks** | SCOPE_CREDENTIALS | K-12 academic credentials | ❌ NOT STARTED |
| **Blocks** | SCOPE_LAUNCH_CLEANUP | February 2026 launch | ❌ NOT STARTED |

---

## 11. ACCEPTANCE CRITERIA

### Phase 0: MOOSE Validation (REQUIRED FIRST)
- [ ] Access learnwithmoose.maine.gov and document structure
- [ ] Verify content is openly accessible (no login required)
- [ ] Map 5 MOOSE modules to PMERIT grade/subject schema
- [ ] Test URL patterns for stability
- [ ] Draft partnership email to Jennifer Page
- [ ] Document Creative Commons attribution requirements

### Phase 1: Database Structure
- [ ] Run Migration 015 (k12_lessons, k12_student_profiles, k12_lesson_progress)
- [ ] Populate grade_subjects matrix (13 grades × 4 subjects)
- [ ] Add 10 sample lessons (1 per grade, ELA focus)
- [ ] Create k12_student_profiles for test users
- [ ] Verify indexes created

### Phase 2: Registration Flow Updates
- [ ] Add "Parent/Guardian" registration type
- [ ] Create "Add Children" flow with birth date
- [ ] Implement age-based grade calculation
- [ ] Auto-assign AI persona based on grade span
- [ ] Auto-assign UI type based on grade span
- [ ] Link to COPPA consent flow

### Phase 3: MOOSE Content Integration
- [ ] Map MOOSE modules to k12_lessons records
- [ ] Write AI context for each lesson
- [ ] Document MLR standards for each lesson
- [ ] Document common struggles
- [ ] Create link validation script

### Phase 4: Age-Appropriate UI
- [ ] Create K-2 dashboard (simplified_child.html)
- [ ] Create 3-5 dashboard (gamified_child.html)
- [ ] Create 6-8 dashboard (social_teen.html)
- [ ] Create 9-12 dashboard (professional_young_adult.html)
- [ ] Implement grade-based UI routing

### Phase 5: RAG System
- [ ] Create Vectorize namespace for k12_lessons
- [ ] Generate embeddings for lesson content
- [ ] Implement retrieval function with grade filter
- [ ] Integrate with Claude API streaming
- [ ] Test with each persona

### Phase 6: AI Persona Integration
- [ ] Create persona prompt files
- [ ] Implement persona selection logic (grade → persona)
- [ ] Add prosodic markers for TTS
- [ ] Test each persona with grade-appropriate questions
- [ ] Integrate with unified streaming architecture

---

## 12. RESEARCH_FINDINGS

### Session 75 (2025-12-24)

**Comprehensive Scope Update:**
- Integrated Claude Web architectural specifications
- Added RAG architecture section
- Added age-appropriate UI specifications
- Added AI persona prompts
- Added database schema for missing tables
- Updated dependencies (PARENT_PORTAL ✅, SECURITY ✅)
- Added MOOSE integration strategy
- Created 6-phase implementation plan

**Key Decisions:**
- Curator model for content (link to MOOSE, store AI context locally)
- 4 age-appropriate UIs (K-2, 3-5, 6-8, 9-12)
- Vectorize for RAG semantic search
- Prosodic TTS markers for natural speech
- Scaffolded responses (no direct answers)

---

## 13. K-12 DASHBOARD ADAPTATION (Sessions 80-81)

### Decision: Option C Hybrid Dashboard (DECISION-80-001)

| Attribute | Value |
|-----------|-------|
| **Decision** | Single `dashboard.html` for all users |
| **Alternative A Rejected** | Show/hide sections (too complex conditional logic) |
| **Alternative B Rejected** | Multiple dashboards by grade span (5 files to maintain) |
| **Rationale** | Easier maintenance, consistent URL, natural age progression without URL changes |

### Implementation Architecture

```
User Login → auth-check.js → fetchCurrentUser() → dashboard-adapter.js → Apply CSS Classes
                                                          ↓
                                                   Detect user type:
                                                   - accountType: 'k12' or 'adult'
                                                   - gradeCode: 'K', '1', '2', ... '12'
                                                   - uiType: derived from grade
                                                          ↓
                                                   Apply body classes:
                                                   - .user-k12 or .user-adult
                                                   - .ui-tier-k2, .ui-tier-elementary, etc.
                                                          ↓
                                                   CSS rules hide/show content
```

### Hidden Elements for K-12 Users

| Element | Selector | Reason |
|---------|----------|--------|
| Career nav section | `#nav-career` | Career focus is adult feature |
| Career sidebar button | `.icon-sidebar-item[data-section="career"]` | Hide from sidebar |
| Career Guidance card | `[data-content-type="career"]` | Not age-appropriate for K-8 |
| Career Assessment links | `[href="assessment-entry.html"]` | Career assessment for adults |
| Explore Pathways (K-8) | Quick action with "pathway" text | Not relevant for young students |

### Required Database Fields

| Field | Table | Purpose |
|-------|-------|---------|
| `is_minor` | `users` | Boolean flag for minor status |
| `grade_code` | `k12_student_profiles` | Grade level (K, 1-12) |
| `ui_type` | `k12_student_profiles` | UI tier (early_childhood, childhood, etc.) |
| `parental_consent_status` | `k12_student_profiles` | COPPA consent tracking |
| `parent_guardian_email` | `k12_student_profiles` | Parent contact |
| `date_of_birth` | `k12_student_profiles` | Age verification |

### API Response Structure (/auth/me)

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "firstName": "Johnny",
    "lastName": "Student",
    "isMinor": true,
    "accountType": "k12",
    "gradeCode": "3",
    "uiType": "childhood",
    "personaOverride": null
  }
}
```

### CSS Tier Classes

| Class | Grade Span | Description |
|-------|------------|-------------|
| `.ui-tier-k2` | K-2 | Larger touch targets, simplified text |
| `.ui-tier-elementary` | 3-5 | Gamified, slightly larger elements |
| `.ui-tier-middle` | 6-8 | Standard with pathways visible |
| `.ui-tier-high` | 9-12 | Near-adult, career prep visible |
| `.ui-tier-adult` | Adult | Full career focus |

### Files Modified (Session 80-81)

| File | Change |
|------|--------|
| `pmerit-api-worker/src/routes/auth.ts` | `/auth/me` returns accountType, gradeCode, uiType |
| `assets/js/dashboard-adapter.js` | Detects user type, applies CSS classes, fetches fresh user data |
| `assets/js/auth.js` | Stores K-12 fields in user object |
| `assets/css/components.css` | K-12 hiding rules (~80 lines) |
| `dashboard.html` | Added `data-content-type="career"` attributes |
| `scripts/migrations/019_k12_profile_fix.sql` | Added missing columns to k12_student_profiles |

### Regression Test Checklist

Before any dashboard or auth changes, verify:

1. **K-12 User (Grade 3)**
   - [ ] Console shows `accountType: 'k12'`
   - [ ] Console shows `gradeCode: '3'`
   - [ ] Career Guidance card is hidden
   - [ ] Career sidebar button is hidden
   - [ ] #nav-career is hidden
   - [ ] Grade badge appears near username

2. **Adult User**
   - [ ] Console shows `accountType: 'adult'`
   - [ ] Career Guidance card is visible
   - [ ] Career sidebar button is visible
   - [ ] No grade badge appears

---

## 14. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 43 | 2025-12-09 | Architecture specified |
| 62 | 2025-12-18 | Scope file created |
| 75 | 2025-12-24 | Comprehensive update with RAG, UI specs, personas, migration schema |
| 80 | 2025-12-25 | Option C Hybrid Dashboard decided, initial implementation |
| 81 | 2025-12-25 | Fixed race condition, added data attributes, documented architecture |

---

*Last Updated: 2025-12-25 (Session 81)*
