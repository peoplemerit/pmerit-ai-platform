# PMERIT SUB-SCOPE: Progress Tracking System

**Version:** 1.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-18
**Status:** PARTIALLY IMPLEMENTED
**Phase:** Core Platform Feature
**Priority:** P0 - Foundation for Credentials

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Unified Progress Tracking Across All Learning Activities |
| **Pages** | `portal/dashboard.html`, `portal/classroom.html` |
| **JavaScript** | `dashboard-courses.js`, `classroom.js` |
| **API Endpoints** | `/api/v1/progress/*`, `/api/v1/users/:id/enrollments` |
| **Database Tables** | `lesson_progress`, `course_enrollments`, `pathway_enrollments` |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-18 | **Session:** 62 | **Auditor:** Claude Code

### Executive Summary

Progress tracking is **PARTIALLY IMPLEMENTED** across multiple scopes. The foundation exists but is fragmented. This scope consolidates and documents the complete progress system.

### What EXISTS

#### Database Tables

| Table | Status | Purpose |
|-------|--------|---------|
| `lesson_progress` | EXISTS | Per-lesson completion tracking |
| `course_enrollments` | EXISTS | Course-level progress (progress_percentage, lessons_completed) |
| `pathway_enrollments` | EXISTS | Pathway-level progress |

#### API Endpoints

| Endpoint | Status | Purpose |
|----------|--------|---------|
| `GET /users/:id/enrollments` | WORKING | Get user's enrolled courses with progress |
| `POST /lessons/:id/complete` | WORKING | Mark lesson complete |
| `GET /courses/:id/progress` | PARTIAL | Get course progress |

#### Frontend Components

| Component | Status | Location |
|-----------|--------|----------|
| Dashboard progress display | WORKING | dashboard.html |
| Classroom progress sidebar | WORKING | classroom.html |
| Lesson completion tracking | WORKING | classroom.js |

### What DOES NOT EXIST

| Component | Status | Impact |
|-----------|--------|--------|
| Unified progress API | NOT BUILT | Progress scattered across endpoints |
| Progress analytics | NOT BUILT | No insights into learning patterns |
| Streak tracking | NOT BUILT | No daily learning streaks |
| Time tracking | PARTIAL | Time spent not accurately tracked |
| Progress notifications | NOT BUILT | No milestone notifications |
| Progress export | NOT BUILT | Can't export learning history |

### Current Progress Flow

```
1. User enrolls in course
   └── course_enrollments record created (progress_percentage: 0)

2. User completes lesson
   └── POST /lessons/:id/complete
   └── lesson_progress record created/updated
   └── course_enrollments.lessons_completed incremented
   └── course_enrollments.progress_percentage recalculated

3. User views dashboard
   └── GET /users/:id/enrollments
   └── Shows enrolled courses with progress bars

4. User views classroom
   └── Progress sidebar shows completed lessons
   └── Current lesson highlighted
```

---

## 3. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| PR-001 | Progress granularity | Per-lesson | Most granular, enables micro-credentials |
| PR-002 | Progress calculation | lessons_completed / total_lessons | Simple, accurate |
| PR-003 | Progress storage | Database (not localStorage) | Persistent, cross-device |
| PR-004 | Completion trigger | User action (not time-based) | Learner controls pace |

---

## 4. HANDOFF_DOCUMENT

### Unified Progress Data Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROGRESS HIERARCHY                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PATHWAY PROGRESS                                                   │
│  └── pathway_enrollments.progress_percentage                        │
│      └── Calculated from: course completions in pathway             │
│                                                                     │
│  COURSE PROGRESS                                                    │
│  └── course_enrollments.progress_percentage                         │
│      └── Calculated from: module completions in course              │
│                                                                     │
│  MODULE PROGRESS (Calculated, not stored)                           │
│  └── lessons_completed_in_module / total_lessons_in_module          │
│                                                                     │
│  LESSON PROGRESS                                                    │
│  └── lesson_progress.status = 'completed'                           │
│      └── Atomic unit of progress                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Progress Events (Proposed)

| Event | Trigger | Actions |
|-------|---------|---------|
| `lesson.completed` | User marks lesson done | Update progress, check module completion |
| `module.completed` | All lessons in module done | Issue module badge, check course completion |
| `course.completed` | All modules in course done | Issue course certificate, check pathway |
| `pathway.completed` | All courses in pathway done | Issue pathway certificate |
| `streak.achieved` | X consecutive days of learning | Award streak badge |
| `milestone.reached` | 25%, 50%, 75% progress | Send notification |

### API Endpoints (Complete)

| Method | Endpoint | Status | Purpose |
|--------|----------|--------|---------|
| GET | `/api/v1/progress/summary` | TBD | User's overall progress summary |
| GET | `/api/v1/progress/pathway/:id` | TBD | Pathway progress details |
| GET | `/api/v1/progress/course/:id` | PARTIAL | Course progress details |
| GET | `/api/v1/progress/streaks` | TBD | User's learning streaks |
| GET | `/api/v1/progress/history` | TBD | Learning activity history |
| GET | `/api/v1/progress/analytics` | TBD | Learning analytics |
| POST | `/api/v1/lessons/:id/complete` | WORKING | Mark lesson complete |
| POST | `/api/v1/lessons/:id/uncomplete` | TBD | Undo lesson completion |

### Progress Dashboard Widget

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 MY PROGRESS                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔥 LEARNING STREAK: 7 days                                         │
│  ████████████░░░░░░░░ (next milestone: 10 days)                    │
│                                                                     │
│  📚 OVERALL PROGRESS                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Web Development Pathway          ████████░░░░ 67%           │   │
│  │   └── HTML & CSS Fundamentals    ██████████████ 100% ✓      │   │
│  │   └── JavaScript Essentials      ████████░░░░░░ 60%         │   │
│  │   └── React Fundamentals         ░░░░░░░░░░░░░░ 0%          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ⏱️ TIME SPENT THIS WEEK: 4h 32m                                    │
│  📖 LESSONS COMPLETED: 12                                           │
│  🏆 CREDENTIALS EARNED: 2                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. RESEARCH_FINDINGS

### Current Implementation Analysis (Session 62)

**lesson_progress table structure:**
```sql
lesson_progress (
    progress_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    lesson_id UUID REFERENCES lessons(id),
    status VARCHAR(20), -- not_started, in_progress, completed
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INT,
    last_position_seconds INT, -- For video resume
    notes TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
```

**course_enrollments progress fields:**
```sql
course_enrollments (
    ...
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    total_lessons INT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    ...
)
```

### Gap Analysis

| Feature | Current State | Target State |
|---------|---------------|--------------|
| Lesson completion | Working | Working |
| Course progress % | Working | Working |
| Module progress | Not calculated | Calculate from lessons |
| Pathway progress | Exists but not updated | Auto-update on course completion |
| Time tracking | Field exists, not populated | Track actual time spent |
| Streaks | Not implemented | Track consecutive days |
| Analytics | Not implemented | Learning patterns, peak times |

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_ENROLLMENT | Enrollment creates progress records |
| **Requires** | SCOPE_CLASSROOM | Lesson completion triggers progress |
| **Enables** | SCOPE_CREDENTIALS | Progress 100% triggers credentials |
| **Enables** | SCOPE_PARENT_PORTAL | Parents view child's progress |
| **Enables** | SCOPE_DASHBOARD | Dashboard displays progress |
| **Enables** | SCOPE_NOTIFICATIONS | Progress milestones trigger notifications |

---

## 7. ACCEPTANCE CRITERIA

### Phase 1: Core Progress (Existing)
- [x] Lesson completion tracked in database
- [x] Course progress percentage calculated
- [x] Dashboard shows enrolled courses with progress
- [x] Classroom shows completed lessons

### Phase 2: Enhanced Progress
- [ ] Module progress calculated and displayed
- [ ] Pathway progress auto-updates
- [ ] Time spent accurately tracked
- [ ] Progress summary API endpoint
- [ ] Progress history viewable

### Phase 3: Gamification
- [ ] Learning streaks tracked
- [ ] Streak badges awarded
- [ ] Milestone notifications (25%, 50%, 75%, 100%)
- [ ] Progress analytics available
- [ ] Weekly progress reports

---

## 8. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 35-36 | 2025-12-06 | Initial progress tracking implemented |
| 62 | 2025-12-18 | Scope file created, audit completed |

---

*Last Updated: 2025-12-18 (Session 62)*
