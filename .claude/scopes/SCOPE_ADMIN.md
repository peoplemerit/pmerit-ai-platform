# PMERIT SUB-SCOPE: Admin Portal

**Version:** 1.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-12
**Status:** NOT STARTED
**Phase:** P7-P10 (Admin Journey)

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Admin Portal (Curriculum, Users, Reports) |
| **Phase** | Phase 7-10 (P7.1-P10.6) |
| **Pages** | TBD: `admin/dashboard.html`, `admin/users.html`, etc. |
| **JavaScript** | TBD |
| **CSS** | TBD |
| **API Endpoints** | `/api/v1/admin/*` |
| **Database Tables** | `admin_users`, `admin_roles`, `audit_logs` |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| AD-001 | Admin Tiers | Tier 1 (Full) + Tier 2 (Limited) | Separation of duties | - |
| AD-002 | Role System | RBAC | Flexible permissions | - |

---

## 3. FEATURE SPECIFICATION

<HANDOFF_DOCUMENT>

### P7 Requirements (Tier 1 Admin Portal)

| # | Requirement | Status |
|---|-------------|--------|
| P7.1 | Admin login page | Not Started |
| P7.2 | Admin dashboard | Not Started |
| P7.3 | Full platform access | Not Started |
| P7.4 | User management | Not Started |
| P7.5 | Content management | Not Started |
| P7.6 | System settings | Not Started |

### P8 Requirements (Tier 2 Accounts)

| # | Requirement | Status |
|---|-------------|--------|
| P8.1 | Limited admin creation | Not Started |
| P8.2 | Permission scoping | Not Started |
| P8.3 | Department assignment | Not Started |

### P9 Requirements (Curriculum Management)

| # | Requirement | Status |
|---|-------------|--------|
| P9.1 | Course CRUD | Not Started |
| P9.2 | Module/Lesson editor | Not Started |
| P9.3 | Content publishing | Not Started |
| P9.4 | Assessment builder | Not Started |

### P10 Requirements (Audit & Reports)

| # | Requirement | Status |
|---|-------------|--------|
| P10.1 | Activity logs | Not Started |
| P10.2 | User reports | Not Started |
| P10.3 | Enrollment analytics | Not Started |
| P10.4 | Progress dashboards | Not Started |
| P10.5 | Export functionality | Not Started |
| P10.6 | Compliance reports | Not Started |

</HANDOFF_DOCUMENT>

---

## 4. IMPLEMENTATION STATUS

<RESEARCH_FINDINGS>

### Not Yet Started

Admin portal is blocked until Phases 0-6 are complete.

**Prerequisites:**
- [ ] Phase 6 (Progress & Assessment) complete
- [ ] ARCH-2 (Credential API) complete
- [ ] Database admin tables created

</RESEARCH_FINDINGS>

---

## 5. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | ALL P0-P6 | User journey must complete first |
| **Requires** | SCOPE_CREDENTIALS | Admin manages credentials |
| **Enables** | Content Management | Admins create courses |

---

## 6. KNOWN ISSUES

| Issue | Priority | Notes |
|-------|----------|-------|
| Not started | - | Blocked by earlier phases |

---

*Last Updated: 2025-12-12 by Claude Code (Session 50)*
