# PMERIT SUB-SCOPE: Course Enrollment

**Version:** 1.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-12
**Status:** COMPLETE
**Phase:** Integrated with P4

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Course Catalog & Enrollment |
| **Pages** | `courses.html`, catalog sections in `dashboard.html` |
| **JavaScript** | `courses.js`, enrollment logic in dashboard |
| **CSS** | `courses.css` |
| **API Endpoints** | `/api/v1/courses/*`, `/api/v1/pathways/*`, `/api/v1/enrollments/*` |
| **Database Tables** | `courses`, `pathways`, `enrollments`, `modules`, `lessons` |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| EN-001 | Enrollment Model | User → Course (via enrollment record) | Simple, trackable | 35 |
| EN-002 | Pathway Structure | Pathway → Course → Module → Lesson | Matches Track 1 | 35 |
| EN-003 | Catalog Access | Public (browse) vs Private (enroll) | AI Tutor requires enrollment | 35 |
| EN-004 | Progress Tracking | Per-lesson completion | Granular tracking | 36 |

---

## 3. FEATURE SPECIFICATION

<HANDOFF_DOCUMENT>

### Enrollment Flow

```
1. User browses /courses (public catalog)
2. User clicks "Enroll" on a course
3. If not logged in → Auth modal
4. If logged in → POST /api/v1/enrollments
5. User redirected to Dashboard → My Courses
6. User clicks "Enter Classroom" → classroom.html?courseId=X
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/courses` | List all courses |
| GET | `/api/v1/courses/:id` | Get course details |
| GET | `/api/v1/pathways` | List pathways (14 total) |
| GET | `/api/v1/pathways/:id` | Get pathway with courses |
| POST | `/api/v1/enrollments` | Enroll in course |
| GET | `/api/v1/users/:id/enrollments` | Get user's enrollments |
| DELETE | `/api/v1/enrollments/:id` | Unenroll |

### Current Pathways (14)

Track 1 (Global Remote):
1. Web Development
2. Data Analytics
3. UX Design
4. Digital Marketing
5. Project Management
6. Business Analysis

Track 2 (Local Education):
7. K-5 Curriculum
8. 6-8 Curriculum
9. 9-12 Curriculum

Track 3 (Local Career):
10. Construction Trades
11. Healthcare
12. Manufacturing
13. Transportation
14. General Career Prep

</HANDOFF_DOCUMENT>

---

## 4. IMPLEMENTATION STATUS

<RESEARCH_FINDINGS>

### Session 36 (2025-12-06)

**Completed:**
- Fixed enrollment redirect bug
- Auth check uses window.AUTH?.getCurrentUser()
- Enrollment creates DB record
- Dashboard shows enrolled courses

### Session 35 (2025-12-06)

**Completed:**
- P4.1-P4.8 all requirements
- Enrollment API integration
- My Courses section
- Pathway recommendations

</RESEARCH_FINDINGS>

---

## 5. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_DASHBOARD | Enrollment from dashboard |
| **Requires** | SCOPE_ASSESSMENT | Pathway recommendations |
| **Enables** | SCOPE_CLASSROOM | Enrolled → Can access classroom |
| **Enables** | SCOPE_PROGRESS | Enrollment tracks progress |

---

## 6. KNOWN ISSUES

| Issue | Priority | Notes |
|-------|----------|-------|
| None currently | - | - |

---

*Last Updated: 2025-12-12 by Claude Code (Session 50)*
