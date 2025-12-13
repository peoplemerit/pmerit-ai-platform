# PMERIT SUB-SCOPE: Student Dashboard

**Version:** 1.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-12
**Status:** COMPLETE
**Phase:** P3-P4 (Sign-Up, Onboarding, Dashboard)

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Student Dashboard & Account Management |
| **Phase** | Phase 3-4 (P3.1-P3.8, P4.1-P4.8) |
| **Pages** | `account.html`, `dashboard.html`, `courses.html`, `profile.html` |
| **JavaScript** | `account.js`, `dashboard.js`, `courses.js`, `auth.js`, `auth-modal.js` |
| **CSS** | `dashboard.css`, `courses.css` |
| **API Endpoints** | `/api/v1/auth/*`, `/api/v1/users/*`, `/api/v1/enrollments/*` |
| **Database Tables** | `users`, `user_profiles`, `enrollments` |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| DB-001 | Dashboard Architecture | Two-tier (account → dashboard) | Security gate before full portal | 34 |
| DB-002 | Auth Method | JWT + PBKDF2 | Secure, stateless | 31 |
| DB-003 | Email Verification | 6-digit code (15-min expiry) | Balance security + UX | 34 |
| DB-004 | Email Provider | Resend (DKIM/SPF) | Deliverability, simple API | 34 |
| DB-005 | Protected Routes | auth-check.js | Consistent protection | 34 |

---

## 3. FEATURE SPECIFICATION

<HANDOFF_DOCUMENT>

### P3 Requirements (Sign-Up & Onboarding)

| # | Requirement | Status |
|---|-------------|--------|
| P3.1 | Auth modal triggers | Complete |
| P3.2 | Registration form | Complete |
| P3.3 | Mock sign-up (localStorage) | Complete |
| P3.4 | Tab switching (signup/signin) | Complete |
| P3.5 | Real backend auth API | Complete |
| P3.6 | Email verification | Complete |
| P3.7 | Dedicated dashboard | Complete |
| P3.8 | Protected route redirect | Complete |

### P4 Requirements (Dashboard & Courses)

| # | Requirement | Status |
|---|-------------|--------|
| P4.1 | Enrolled courses display | Complete |
| P4.2 | Enrollment API | Complete |
| P4.3 | My Courses section | Complete |
| P4.4 | Pathway recommendations | Complete |
| P4.5 | Learning path progress | Complete |
| P4.6 | Course catalog access | Complete |
| P4.7 | Assessment-to-courses link | Complete |
| P4.8 | Quick Actions | Complete |

### User Flow

```
Login/Signup → /account.html → "Enter Dashboard" → /dashboard.html
                   │
                   └── Shows verification warning if email not verified
```

### Auth API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Authenticate |
| POST | `/api/v1/auth/logout` | End session |
| POST | `/api/v1/auth/verify-email` | Verify with code |
| POST | `/api/v1/auth/resend-verification` | Resend code |
| POST | `/api/v1/auth/forgot-password` | Request reset |
| POST | `/api/v1/auth/reset-password` | Reset with code |
| GET | `/api/v1/auth/me` | Get current user |

</HANDOFF_DOCUMENT>

---

## 4. IMPLEMENTATION STATUS

<RESEARCH_FINDINGS>

### Session 34 (2025-12-06)
- Two-tier dashboard architecture complete
- Renamed dashboard.html → account.html
- Renamed learner-portal.html → dashboard.html
- Email verification via Resend
- 16 files updated with navigation

### Session 31 (2025-12-06)
- 8 auth endpoints created
- PBKDF2 password hashing
- JWT tokens (60-min expiry)
- Rate limiting (5 failed = 15-min lockout)

</RESEARCH_FINDINGS>

---

## 5. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_HOMEPAGE | Users arrive from homepage |
| **Requires** | SCOPE_ASSESSMENT | Assessment informs recommendations |
| **Enables** | SCOPE_ENROLLMENT | Dashboard shows enrolled courses |
| **Enables** | SCOPE_CLASSROOM | Enter Classroom from dashboard |

---

## 6. KNOWN ISSUES

| Issue | Priority | Notes |
|-------|----------|-------|
| None currently | - | - |

---

*Last Updated: 2025-12-12 by Claude Code (Session 50)*
