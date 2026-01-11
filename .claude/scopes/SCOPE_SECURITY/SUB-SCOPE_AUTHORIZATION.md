# SUB-SCOPE_AUTHORIZATION

**Version:** 1.0
**Status:** IN_PROGRESS
**Parent SCOPE:** SCOPE_SECURITY
**Repository:** frontend + backend
**Created:** 2025-12-28
**Last Updated:** 2025-12-28

---

## SUB-SCOPE IDENTITY

| Field | Value |
|-------|-------|
| **Name** | SUB-SCOPE_AUTHORIZATION |
| **Parent** | SCOPE_SECURITY |
| **Description** | Role-based access control, permission system, admin tiers |
| **Repository** | Inherited from parent (frontend + backend) |
| **Type** | Integration |

---

## RELATIONSHIP TO PARENT

**Parent SCOPE:** SCOPE_SECURITY
**Sibling SUB-SCOPEs:**
- SUB-SCOPE_AUTHENTICATION
- SUB-SCOPE_DATA_PROTECTION
- SUB-SCOPE_COMPLIANCE

**Parallel Execution:** Yes - Can run in parallel with siblings

---

## DEPENDENCIES

### Internal Dependencies (Within Parent SCOPE)

| SUB-SCOPE | Required State | Reason |
|-----------|----------------|--------|
| SUB-SCOPE_AUTHENTICATION | IN_PROGRESS | Need authenticated user to authorize |

### External Dependencies (Other SCOPEs)

| SCOPE | Repository | Required State | Reason |
|-------|------------|----------------|--------|
| SCOPE_ADMIN | frontend | COMPLETE | Admin portal uses authorization |

---

## DECISION LOG

| ID | Date | Decision | Status | Rationale |
|----|------|----------|--------|-----------|
| AUTHZ-001 | 2025-12-18 | Two admin tiers (Tier 1, Tier 2) | ACTIVE | Separation of duties |
| AUTHZ-002 | 2025-12-18 | Role-based access control (RBAC) | ACTIVE | Scalable permissions |
| AUTHZ-003 | 2025-12-18 | JWT claims for roles | ACTIVE | Stateless verification |

---

## AUDIT_REPORT

**Last Audit:** 2025-12-28
**Audited By:** Claude Code

### Current State

Basic role-based authorization is implemented. Admin tiers (Tier 1, Tier 2) are enforced. API endpoints check admin status via JWT.

### Files Involved

| File | Exists | Status | Notes |
|------|--------|--------|-------|
| src/index.ts (backend) | Yes | Working | Admin role checks |
| admin/tier1.html | Yes | Working | Tier 1 admin portal |
| admin/tier2.html | Yes | Working | Tier 2 admin portal |

### Discrepancies

| Expected | Actual | Severity |
|----------|--------|----------|
| Fine-grained permissions | Coarse admin tiers only | Low |
| Permission management UI | Not implemented | Low |

---

## HANDOFF_DOCUMENT

### Context

Authorization determines what authenticated users can do. PMERIT uses a two-tier admin system with Tier 1 having full access and Tier 2 having limited access.

### Scope Boundaries

**In Scope:**
- Role definitions (student, parent, teacher, admin_tier1, admin_tier2)
- Permission enforcement on API endpoints
- Admin tier separation
- Role assignment

**Out of Scope:**
- Authentication (SUB-SCOPE_AUTHENTICATION)
- Audit logging of access (SUB-SCOPE_DATA_PROTECTION)

### Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| R-01 | Admin tier enforcement on APIs | Must | Done |
| R-02 | Tier 1 can access all admin features | Must | Done |
| R-03 | Tier 2 has limited access | Must | Done |
| R-04 | Role assignment by Tier 1 | Should | Partial |
| R-05 | Fine-grained permission system | Could | Not started |

### Technical Specification

**Current Role System:**
```
Roles:
- student: Basic learner access
- parent: Parent portal access + linked children
- teacher: Classroom management (future)
- admin_tier2: Limited admin access
- admin_tier1: Full admin access (superuser)
```

**Tier Access Matrix:**

| Feature | Tier 1 | Tier 2 |
|---------|--------|--------|
| User management | Full | Read-only |
| Course management | Full | Full |
| Security dashboard | Full | View only |
| System settings | Full | None |
| Audit logs | Full | Limited |

### Acceptance Criteria

- [x] Tier 1 admins can access all admin features
- [x] Tier 2 admins have restricted access
- [x] Non-admins cannot access admin endpoints
- [ ] Role assignment UI for Tier 1 admins
- [ ] Permission audit log

---

## RESEARCH_FINDINGS

**Session:** 1
**Date:** 2025-12-28

### What Works
- JWT role claims are correctly set
- API endpoints check admin tier
- Frontend shows/hides features based on role

### Open Questions
- [ ] Should we implement more granular permissions beyond tiers?
- [ ] How to handle teacher role (not yet fully defined)?

---

## LOCKED FILES

| File | Locked Since | Reason |
|------|--------------|--------|
| - | - | - |

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-28 | Initial creation from SCOPE_SECURITY decomposition |

---

*AIXORD v2.1 — SUB-SCOPE of SCOPE_SECURITY*
