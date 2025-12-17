# PMERIT SUB-SCOPE: Admin Portal

**Version:** 2.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-17
**Status:** AUDITED
**Phase:** P7-P10 (Admin Journey)

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Admin Portal (Content Management, Users, Reports) |
| **Phase** | Phase 7-10 (P7.1-P10.6) |
| **Pages** | `admin/index.html`, `admin/tier1.html`, `admin/tier2.html`, `admin/qa-telemetry.html` |
| **JavaScript** | `auth.js`, `auth-check.js`, `config.js` (generic - no admin-specific) |
| **CSS** | Uses PMERIT standard CSS |
| **API Endpoints** | `/api/v1/admin/*` (IMPLEMENTED - See RESEARCH_FINDINGS) |
| **Database Tables** | `users.role` column, `audit_logs` table (CREATED) |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-17 | **Session:** 58 | **Auditor:** Claude Code

### Executive Summary

The admin portal has **complete frontend UI shells** but **zero backend functionality**. Buttons and dashboard cards are visual mockups that don't connect to any APIs.

### What EXISTS

#### Frontend Files (UI Only)

| File | Purpose | Status |
|------|---------|--------|
| `admin/index.html` | Redirect to Tier 1 | Working |
| `admin/tier1.html` | System Admin Dashboard | UI shell only |
| `admin/tier2.html` | Content Admin Dashboard | UI shell only |
| `admin/qa-telemetry.html` | Telemetry QA Dashboard | Working (reads localStorage) |

#### Tier 1 Dashboard Cards (admin/tier1.html)
- Staff Management
- Infrastructure
- Security
- Reports
- Tier 2 Access
- System Settings

#### Tier 2 Dashboard Tabs (admin/tier2.html)
- **Curriculum Tab:** Course Catalog, Content Editor, Assessments, Learning Paths
- **Students Tab:** Student Directory, Enrollments, Progress Tracking, Communications
- **Classes Tab:** Class Schedules, Assignments, Grading, Attendance
- **Performance Tab:** Analytics Dashboard, Reports, Insights

#### Authentication (Generic Only)
- `auth.js` - Login/logout/register (works)
- `auth-check.js` - Redirects if not logged in (works)
- **NO admin role/tier validation**

### What DOES NOT EXIST

#### Backend API
| Missing | Impact |
|---------|--------|
| `/api/v1/admin/*` routes | No admin operations work |
| Admin role validation | Any logged-in user can access admin pages |
| Permission middleware | No tier-based access control |
| `admin.ts` route file | Backend has no admin handlers |

#### Database
| Missing | Impact |
|---------|--------|
| `admin_users` table | Can't track admin accounts |
| `admin_roles` table | Can't define permissions |
| `audit_logs` table | No admin activity tracking |
| Role column on users | Can't distinguish admin from regular user |

#### Content Management (P9 - CRITICAL GAP)
| Missing | Impact |
|---------|--------|
| Course CRUD endpoints | Can't create/edit courses |
| Module/Lesson editor | Courses are empty shells |
| Content publishing workflow | Can't manage draft/published states |
| External content linking | Can't add freeCodeCamp/Coursera URLs |
| MOOSE content ingestion | Can't manage K-12 lessons |

### Current Access Security

**SECURITY ISSUE:** Admin pages (`admin/tier1.html`, `admin/tier2.html`) only check if user is logged in via generic `auth-check.js`. Any authenticated user can visit these pages - there's no admin role verification.

### Database Schema Audit

Current user-related tables (from migration history):
- `users` - Has `id`, `email`, `password_hash`, `name`, etc.
- **NO `role` or `is_admin` column exists**

### Priority Assessment

| Priority | Item | Rationale |
|----------|------|-----------|
| **P0** | Add role column to users | Foundation for all admin features |
| **P1** | Content Management API | Courses are empty - blocking user value |
| **P1** | Admin role validation | Security issue - pages are open |
| **P2** | Staff Management | Nice to have |
| **P3** | Reports/Analytics | Enhancement |

---

## 3. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| AD-001 | Admin Tiers | Tier 1 (System) + Tier 2 (Content) | Separation of duties | 50 |
| AD-002 | Role System | Column on users table | Simple, no separate tables needed | 58 |
| AD-003 | Content Priority | Tier 2 Content Management first | Unblocks course content creation | 58 |
| AD-004 | Architecture | **Pragmatic Enhancement** (not full refactor) | Sustainable, lower risk, faster delivery | 58 |

### AD-004: Architecture Decision — Pragmatic Enhancement vs Full Refactor

**Context:** Copilot recommended (Oct 31) a full modular restructure with `/shared`, `/user`, `/admin` folders, SPA routing, and separate entry points.

**Decision:** Use **Pragmatic Enhancement** approach instead.

**Rationale:**
1. Admin UI shells already exist (`tier1.html`, `tier2.html`)
2. Auth system works — only needs role column added
3. Full refactor = 2-3 weeks before ANY new features ship
4. Pragmatic approach = days/weeks, feature by feature
5. Clear upgrade path to full modular architecture later if needed
6. Lower maintenance overhead (extends existing patterns)
7. Minimal breaking change risk

**What We Build:**
- Database: `role` column on users (`user`, `tier2_admin`, `tier1_admin`)
- Backend: Admin middleware + `/api/v1/admin/*` routes
- Frontend: Update `auth-check.js` for role validation
- Wire existing tier1/tier2 HTML to new APIs

**What We Don't Do (Avoids Tech Debt):**
- Don't restructure into `/shared`, `/user`, `/admin` folders
- Don't introduce SPA routing (keep static HTML simplicity)
- Don't create separate entry points
- Don't add governance artifacts (`canonical.md`, `manifest.md`) yet

**When to Revisit:**
- Team grows beyond 2-3 developers
- User and admin codebases diverge significantly
- Need separate deployment pipelines
- Test coverage requires isolation

---

## 4. HANDOFF_DOCUMENT

*Awaiting Claude Web specification*

### Recommended Implementation Order

**Phase A: Foundation (Required First)**
1. Add `role` enum column to `users` table: `user`, `tier2_admin`, `tier1_admin`
2. Create admin middleware in backend
3. Add role check to `auth-check.js`

**Phase B: Content Management (Tier 2 - Highest Value)**
1. Course CRUD API: `POST/PUT/DELETE /api/v1/admin/courses`
2. Module CRUD API: `POST/PUT/DELETE /api/v1/admin/modules`
3. Lesson CRUD API: `POST/PUT/DELETE /api/v1/admin/lessons`
4. External content linking: `POST /api/v1/admin/courses/:id/external-content`
5. Content editor UI in `admin/tier2.html`

**Phase C: User Management (Tier 1)**
1. User list/search API
2. Admin user creation
3. Role assignment

**Phase D: Reports & Analytics**
1. Enrollment reports
2. Progress dashboards
3. Activity logs

---

## 5. RESEARCH_FINDINGS

**Implementation Date:** 2025-12-17 | **Session:** 58

### Phase A: Foundation — BACKEND COMPLETE

#### Database Migration (005_admin_role_system.sql)
- Added `role` column to users table with CHECK constraint: `('user', 'tier2_admin', 'tier1_admin')`
- Default value: `'user'`
- Created `audit_logs` table for tracking admin actions
- Added indexes for performance: `idx_users_role`, `idx_audit_logs_user_id`, `idx_audit_logs_created_at`
- **Verified:** 45 users exist, all with role='user' (ready for promotion)

#### Backend Files Created
| File | Purpose |
|------|---------|
| `src/utils/admin.ts` | Middleware: `verifyAdminAuth()`, `verifyUserAuth()`, `logAdminAction()` |
| `src/routes/admin.ts` | Route handlers for all `/api/v1/admin/*` endpoints |
| `scripts/migrations/005_admin_role_system.sql` | Database migration |
| `scripts/run-admin-migration.js` | Migration runner script |

#### Admin API Endpoints (Deployed)
| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/api/v1/admin/me` | GET | Any Admin | Get current admin user info |
| `/api/v1/admin/users` | GET | Any Admin | List all users with pagination |
| `/api/v1/admin/users/:id` | GET | Any Admin | Get single user details |
| `/api/v1/admin/users/:id/role` | PUT | Tier 1 Only | Change user role |
| `/api/v1/admin/audit-logs` | GET | Tier 1 Only | View audit trail |
| `/api/v1/admin/courses` | POST | Tier 2+ | Create course |
| `/api/v1/admin/courses/:id` | PUT | Tier 2+ | Update course |
| `/api/v1/admin/courses/:id` | DELETE | Tier 2+ | Delete course |
| `/api/v1/admin/stats` | GET | Any Admin | Dashboard statistics |

#### Production Verification
```bash
curl -s "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/admin/me"
# Returns: {"success":false,"error":"Missing or invalid Authorization header","timestamp":"..."}
```
✅ Proper 401 authentication error — backend is working

### Phase A: Foundation — FRONTEND PENDING

- [ ] Update `auth-check.js` for role validation
- [ ] Wire `tier1.html` to admin APIs
- [ ] Wire `tier2.html` to admin APIs

### To Promote a User to Admin
```sql
-- Make someone a System Admin (Tier 1)
UPDATE users SET role = 'tier1_admin' WHERE email = 'admin@example.com';

-- Make someone a Content Admin (Tier 2)
UPDATE users SET role = 'tier2_admin' WHERE email = 'content@example.com';
```

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | User auth system | Users table exists, auth works |
| **Requires** | Courses/Modules/Lessons tables | Already exist (empty) |
| **Enables** | Course content creation | Admins can populate courses |
| **Enables** | External content linking | Link freeCodeCamp, Google, etc. |

---

## 7. ACCEPTANCE CRITERIA (Draft)

### Phase A: Foundation
- [x] Users table has `role` column with enum values
- [x] Backend middleware validates admin role
- [ ] `auth-check.js` validates admin role before rendering admin pages
- [ ] Non-admin users see "Access Denied" when visiting admin URLs

### Phase B: Content Management
- [ ] Admin can create new course via UI
- [ ] Admin can add modules to course
- [ ] Admin can add lessons to module
- [ ] Admin can link external content URLs (freeCodeCamp, Coursera)
- [ ] Admin can set course/module/lesson as published/draft
- [ ] Changes reflect in public course catalog

### Phase C: User Management
- [ ] Admin can view all users
- [ ] Admin can search/filter users
- [ ] Tier 1 admin can promote user to Tier 2 admin
- [ ] Tier 1 admin can demote Tier 2 admin

---

## 8. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 50 | 2025-12-12 | Scope file created |
| 58 | 2025-12-17 | Full audit completed, reality documented |
| 58 | 2025-12-17 | AD-004: Architecture decision locked (Pragmatic Enhancement) |
| 58 | 2025-12-17 | Phase A Backend: Migration, middleware, routes deployed to production |

---

*Last Updated: 2025-12-17 (Session 58)*
