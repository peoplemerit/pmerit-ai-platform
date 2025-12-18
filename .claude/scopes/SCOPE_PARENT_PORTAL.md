# PMERIT SUB-SCOPE: Parent Portal

**Version:** 1.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-18
**Status:** NOT STARTED
**Phase:** Track 2 Requirement
**Priority:** P0 - Required for K-12 Track

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Parent/Guardian Dashboard for K-12 Student Oversight |
| **Target Users** | Parents/guardians of Track 2 (Local Education) students |
| **Pages** | `portal/parent-dashboard.html` (TBD) |
| **JavaScript** | `parent-portal.js` (TBD) |
| **API Endpoints** | `/api/v1/parent/*` (NOT IMPLEMENTED) |
| **Database Tables** | `parent_student_links`, `parent_notifications`, `parent_settings` (TBD) |
| **Legal Requirements** | COPPA compliance, minor data protection |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-18 | **Session:** 62 | **Auditor:** Claude Code

### Executive Summary

The Parent Portal is **NOT IMPLEMENTED**. This is a critical gap for Track 2 (K-12 Education) as it's required for:
- COPPA compliance (parental consent for minors)
- Parent oversight of student progress
- Safety and accountability for minor learners

### What EXISTS

| Component | Status |
|-----------|--------|
| Parent Portal UI | NOT BUILT |
| Parent-Student linking | NOT BUILT |
| Parent API endpoints | NOT BUILT |
| Database tables | NOT BUILT |
| Email notifications to parents | NOT BUILT |

### What DOES NOT EXIST

Everything. This is a greenfield scope.

### Priority Assessment

| Priority | Item | Rationale |
|----------|------|-----------|
| **P0** | Parent-student account linking | Foundation for all features |
| **P0** | COPPA consent flow | Legal requirement for minors |
| **P1** | Parent dashboard | View child's progress |
| **P1** | Progress notifications | Keep parents informed |
| **P2** | Learning time controls | Set daily/weekly limits |
| **P2** | Content restrictions | Age-appropriate filtering |

---

## 3. ARCHITECTURAL DECISIONS (PENDING)

| ID | Decision | Options | Recommendation |
|----|----------|---------|----------------|
| PP-001 | Account linking | Invite code vs Email verification | Email verification (more secure) |
| PP-002 | Multi-child support | One parent → Many children | Yes, required |
| PP-003 | Consent storage | Database vs External service | Database with audit trail |
| PP-004 | Notification channel | Email vs In-app vs Both | Both (email primary) |

---

## 4. HANDOFF_DOCUMENT

*Source: PMERIT_ARCHITECTURE_FINAL.md §9*

### Parent Portal Requirements

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PARENT PORTAL SYSTEM                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ACCOUNT LINKING FLOW                                               │
│  ───────────────────                                                │
│  1. Student (minor) creates account                                 │
│  2. System detects age < 13 (or < 18 for some features)            │
│  3. Student enters parent email                                     │
│  4. Parent receives verification email                              │
│  5. Parent creates account OR links existing                        │
│  6. Parent provides COPPA consent                                   │
│  7. Student account activated                                       │
│                                                                     │
│  PARENT DASHBOARD FEATURES                                          │
│  ─────────────────────────                                          │
│  • View all linked children                                         │
│  • See each child's enrolled courses                                │
│  • View progress (lessons completed, time spent)                    │
│  • View assessment scores                                           │
│  • Set learning time limits (optional)                              │
│  • Receive weekly progress emails                                   │
│  • Download progress reports                                        │
│                                                                     │
│  NOTIFICATION TYPES                                                 │
│  ──────────────────                                                 │
│  • Weekly progress summary                                          │
│  • Course completion                                                │
│  • Assessment results                                               │
│  • Inactivity alerts (no login for X days)                         │
│  • Achievement earned                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Database Schema (Proposed)

```sql
-- Parent-Student relationship
CREATE TABLE parent_student_links (
    link_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_user_id UUID NOT NULL REFERENCES users(id),
    student_user_id UUID NOT NULL REFERENCES users(id),
    relationship VARCHAR(50) DEFAULT 'parent', -- parent, guardian, teacher
    consent_given BOOLEAN DEFAULT FALSE,
    consent_date TIMESTAMPTZ,
    consent_ip VARCHAR(45),
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, revoked
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(parent_user_id, student_user_id)
);

-- Parent notification preferences
CREATE TABLE parent_notification_settings (
    setting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_user_id UUID NOT NULL REFERENCES users(id),
    student_user_id UUID REFERENCES users(id), -- NULL = all children
    notification_type VARCHAR(50) NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    frequency VARCHAR(20) DEFAULT 'weekly', -- instant, daily, weekly
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent controls
CREATE TABLE parent_controls (
    control_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_user_id UUID NOT NULL REFERENCES users(id),
    student_user_id UUID NOT NULL REFERENCES users(id),
    daily_time_limit_minutes INT, -- NULL = unlimited
    weekly_time_limit_minutes INT,
    allowed_start_time TIME, -- Earliest allowed login
    allowed_end_time TIME, -- Latest allowed login
    content_age_limit VARCHAR(10), -- K-2, 3-5, 6-8, 9-12
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Endpoints (Proposed)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/parent/link/request` | Student | Request parent link |
| POST | `/api/v1/parent/link/verify` | Parent | Verify link + consent |
| GET | `/api/v1/parent/children` | Parent | List linked children |
| GET | `/api/v1/parent/children/:id/progress` | Parent | Get child's progress |
| GET | `/api/v1/parent/children/:id/courses` | Parent | Get child's courses |
| PUT | `/api/v1/parent/children/:id/controls` | Parent | Set time/content limits |
| GET | `/api/v1/parent/notifications` | Parent | Get notification settings |
| PUT | `/api/v1/parent/notifications` | Parent | Update notification settings |

### Parent Dashboard UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  PARENT DASHBOARD                               [Settings] [Logout] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  👨‍👩‍👧‍👦 MY CHILDREN                                                    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 👧 Emma Smith (Grade 3)                                     │   │
│  │    Status: Active | Last login: Today, 3:45 PM              │   │
│  │    Current Course: Mathematics - Fractions                   │   │
│  │    Progress: 67% | Time this week: 4h 32m                   │   │
│  │    [View Details] [Set Controls]                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 👦 Jake Smith (Grade 6)                                     │   │
│  │    Status: Active | Last login: Yesterday                   │   │
│  │    Current Course: Science - Earth Systems                  │   │
│  │    Progress: 45% | Time this week: 2h 15m                   │   │
│  │    [View Details] [Set Controls]                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [+ Link Another Child]                                            │
│                                                                     │
│  📊 WEEKLY SUMMARY                                                  │
│  ─────────────────────                                              │
│  Total learning time: 6h 47m                                       │
│  Lessons completed: 12                                              │
│  Assessments passed: 3                                              │
│  [Download Report]                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. RESEARCH_FINDINGS

*No implementation yet - awaiting specification approval*

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_K12_EDUCATION | Parent portal only for K-12 students |
| **Requires** | SCOPE_PROGRESS | Displays child's progress data |
| **Requires** | SCOPE_NOTIFICATIONS | Sends parent notifications |
| **Requires** | Auth system | Parent accounts, linking |
| **Enables** | COPPA Compliance | Parental consent for minors |
| **Enables** | Track 2 Launch | K-12 can't launch without parent oversight |

---

## 7. ACCEPTANCE CRITERIA

### Phase 1: Account Linking
- [ ] Minor student registration prompts for parent email
- [ ] Parent receives verification email
- [ ] Parent can create account or link existing
- [ ] COPPA consent captured with timestamp/IP
- [ ] Student account activated after consent

### Phase 2: Parent Dashboard
- [ ] Parent sees all linked children
- [ ] Parent views each child's enrolled courses
- [ ] Parent views progress (percentage, time spent)
- [ ] Parent views assessment scores
- [ ] Parent can download progress reports

### Phase 3: Controls & Notifications
- [ ] Parent can set daily/weekly time limits
- [ ] Parent receives weekly progress emails
- [ ] Parent notified of course completions
- [ ] Parent notified of assessment results
- [ ] Parent can customize notification preferences

---

## 8. LEGAL REQUIREMENTS

### COPPA Compliance (Children Under 13)

| Requirement | Implementation |
|-------------|----------------|
| Verifiable parental consent | Email verification + consent checkbox |
| Data minimization | Only collect necessary data |
| Parent access to data | Parent can view all child's data |
| Parent can delete data | Parent can request data deletion |
| No behavioral advertising | No ads targeted to minors |

### Data Protection

| Requirement | Implementation |
|-------------|----------------|
| Consent audit trail | Store consent date, IP, version |
| Consent withdrawal | Parent can revoke consent |
| Data portability | Export child's data |
| Right to deletion | Delete child's account on request |

---

## 9. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 62 | 2025-12-18 | Scope file created |

---

*Last Updated: 2025-12-18 (Session 62)*
