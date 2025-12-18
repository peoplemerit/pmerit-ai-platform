# SCOPE: Courses System

**Status:** AUDITED
**Last Audit:** December 17, 2025 (Session 57)
**Audited By:** Claude Code

---

## SCOPE IDENTITY

### Files Owned

**Frontend (pmerit-ai-platform)**
| File | Purpose | Lines |
|------|---------|-------|
| `courses.html` | Public course catalog page | ~1198 |
| `admin-courses.html` | Admin course management interface | ~500+ |
| `assets/js/dashboard-courses.js` | Dashboard courses module | 557 |

**Backend (pmerit-api-worker)**
| File | Purpose | Lines |
|------|---------|-------|
| `src/routes/curriculum.ts` | GET endpoints (pathways, courses, modules, lessons) | 296 |
| `src/routes/curriculum-crud.ts` | CRUD + enrollment endpoints | 399 |

### API Endpoints

| Method | Endpoint | Status | Purpose |
|--------|----------|--------|---------|
| GET | `/api/v1/pathways` |  Working | List all published pathways |
| GET | `/api/v1/pathways/:id` |  Working | Get pathway with courses |
| GET | `/api/v1/courses` |  Working | List all published courses (42 total) |
| GET | `/api/v1/courses/:id` |  Working | Get course with modules |
| GET | `/api/v1/courses/:id/modules` |  Working | Get course modules |
| POST | `/api/v1/courses` |  Working | Create new course (admin) |
| PUT | `/api/v1/courses/:id` |  Working | Update course (admin) |
| DELETE | `/api/v1/courses/:id` |  Working | Soft-delete course (admin) |
| POST | `/api/v1/courses/:id/enroll` |  Working | Enroll user in course |
| DELETE | `/api/v1/courses/:id/enroll` |  Working | Unenroll from course |
| GET | `/api/v1/users/:id/enrollments` |  Working | Get user's enrollments |
| GET | `/api/v1/modules/:id/lessons` |  Working | Get lessons for module |

### Database Tables

| Table | Columns | Purpose |
|-------|---------|---------|
| `pathways` | 16 | Learning pathways (14 active: 6 global_remote, 4 local_education, 4 local_career) |
| `courses` | 37 | Course catalog (42 courses) |
| `course_modules` | 21 | Course content modules |
| `lessons` | 17 | Individual lessons |
| `course_enrollments` | 16 | User-course enrollment records |
| `lesson_progress` | 13 | User lesson completion tracking |
| `pathway_enrollments` | 14 | User-pathway enrollment records |

---

## AUDIT_REPORT

### Production Status:  FULLY OPERATIONAL

**Audit Date:** December 17, 2025
**Environment:** Production (pmerit.com)

### 1. Pathways System

**Status:**  Working

| Metric | Value |
|--------|-------|
| Total Pathways | 14 |
| Global Remote | 6 (Data Analytics, Digital Marketing, UX Design, Web Development, Project Management, Business Analysis) |
| Local Education | 4 (Early Childhood, Primary School, Secondary School, College & University) |
| Local Career | 4 (Healthcare Careers, Skilled Trades, Hospitality & Service, Public Service) |

**API Response:**
```json
{
  "success": true,
  "count": 14,
  "pathways": [...14 items...]
}
```

### 2. Courses System

**Status:**  Working

| Metric | Value |
|--------|-------|
| Total Courses | 42 |
| All Free | Yes (is_free: true for all) |
| With Instructors | Yes (all have instructor_name) |
| Categories | Data Science, Marketing, Design, Web Development, Management, Business, Healthcare, Trades, Hospitality, Public Safety, Education |

**Sample Course Structure:**
```json
{
  "course_id": "989bb541-...",
  "title": "Python for Data Analysis",
  "slug": "python-data-analysis",
  "description": "Learn Python basics...",
  "category": "Data Science",
  "difficulty_level": "beginner",
  "estimated_hours": 20,
  "instructor_name": "Dr. Sarah Chen",
  "is_free": true,
  "pathway_id": "a8a0fa4d-...",
  "pathway_name": "Data Analytics",
  "track_type": "global_remote"
}
```

### 3. Course Catalog Page (courses.html)

**Status:**  Working

| Feature | Status | Notes |
|---------|--------|-------|
| Page loads |  | Clean, responsive design |
| Dark mode support |  | Theme toggle works |
| Career tracks section |  | Displays all 14 pathways |
| Course grid |  | Shows 42 courses with filters |
| Search filter |  | Real-time filtering |
| Category filter |  | Static options (not from DB) |
| Level filter |  | Beginner/Intermediate/Advanced |
| Duration filter |  | Short/Medium/Long |
| Price filter |  | Free/Paid |
| Grid/List toggle |  | Both views work |
| Course cards |  | Shows title, instructor, tags, duration, rating |
| Enroll button |  | Redirects to auth if not logged in |
| Enrolled users redirect |  | Goes to classroom |

**Known Issues:**
- Category filter uses static options, not synced with DB categories
- Rating/reviews show 0 (no rating system implemented)

### 4. Dashboard Courses Module (dashboard-courses.js)

**Status:**  Working

| Feature | Status | Notes |
|---------|--------|-------|
| getEnrollments() |  | Fetches user's enrolled courses |
| enrollInCourse() |  | POST to /courses/:id/enroll |
| dropCourse() |  | DELETE from enrollment |
| getCourses() |  | Fetch all courses |
| getPathways() |  | Fetch all pathways |
| getRecommendations() |  | Based on Holland code from assessment |
| renderEnrolledCourses() |  | HTML generation |
| loadAndDisplayRecommendations() |  | Shows pathway recommendations |

**Holland Code Mapping:**
- R (Realistic) ’ Skilled Trades, Healthcare
- I (Investigative) ’ Data Analytics, Web Development
- A (Artistic) ’ UX Design, Digital Marketing
- S (Social) ’ Healthcare, Public Service, Early Childhood
- E (Enterprising) ’ Project Management, Business Analysis
- C (Conventional) ’ Data Analytics, Business Analysis

### 5. Enrollment System

**Status:**  Working

| Feature | Status | Notes |
|---------|--------|-------|
| Enroll in course |  | Creates enrollment record, increments course count |
| Unenroll from course |  | Deletes enrollment, decrements count |
| Prevent duplicate enrollment |  | Returns 409 if already enrolled |
| User enrollments list |  | Returns courses with progress |
| Progress tracking |  | lessons_completed, progress_percentage |
| Total lessons count |  | Calculated from lessons table |

**Enrollment Record Fields:**
- enrollment_id, user_id, course_id
- status (not_started, in_progress, completed, paused)
- progress_percentage, lessons_completed, total_lessons
- started_at, completed_at, enrolled_at

### 6. Admin Course Management (admin-courses.html)

**Status:**   Partial

| Feature | Status | Notes |
|---------|--------|-------|
| Course list view |  | Shows all courses |
| Create course |  | POST /courses |
| Edit course |  | PUT /courses/:id |
| Delete course |  | Soft delete (sets archived_at) |
| Module management | L | No admin UI |
| Lesson management | L | No admin UI |
| Bulk operations | L | Not implemented |

---

## DEPENDENCIES

### Requires
- Authentication system (`window.AUTH`) for enrollment
- Assessment results (localStorage) for recommendations
- Database (Neon PostgreSQL) for all data

### Enables
- Classroom system (via courseId from enrollment)
- Dashboard enrolled courses section
- Progress tracking system

---

## VERIFICATION CHECKLIST

| # | Test | Status |
|---|------|--------|
| 1 | courses.html loads without errors |  |
| 2 | Pathways API returns 14 items |  |
| 3 | Courses API returns 42 items |  |
| 4 | Career tracks display correctly |  |
| 5 | Course cards render with all data |  |
| 6 | Search filter works |  |
| 7 | Level filter works |  |
| 8 | Enroll redirects to auth if not logged in |  |
| 9 | Enrolled courses show on dashboard |  |
| 10 | Course recommendations work |  |

---

## IDENTIFIED GAPS

### Priority 1: Content Gaps
1. **No modules/lessons content** - Courses have no actual content yet
2. **Module management UI** - Admin can't create modules/lessons

### Priority 2: Feature Gaps
1. **Course ratings** - No rating system implemented
2. **Course reviews** - No review system
3. **Category sync** - Filter uses static categories, not DB
4. **Course thumbnails** - All using gradient placeholders

### Priority 3: Nice-to-Have
1. **Course prerequisites** - Field exists but no UI enforcement
2. **Enrollment limits** - Field exists but not enforced
3. **Course syllabus view** - Field exists but no UI

---

## RESEARCH_FINDINGS

*To be populated after implementation work*

---

## SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 57 | 2025-12-17 | Initial audit completed |

---

*Last Updated: December 17, 2025*
