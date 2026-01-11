# SUB-SCOPE_AUTHENTICATION

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
| **Name** | SUB-SCOPE_AUTHENTICATION |
| **Parent** | SCOPE_SECURITY |
| **Description** | JWT authentication, 2FA, session management, password policies |
| **Repository** | Inherited from parent (frontend + backend) |
| **Type** | Integration |

---

## RELATIONSHIP TO PARENT

**Parent SCOPE:** SCOPE_SECURITY
**Sibling SUB-SCOPEs:**
- SUB-SCOPE_AUTHORIZATION
- SUB-SCOPE_DATA_PROTECTION
- SUB-SCOPE_COMPLIANCE

**Parallel Execution:** Yes - Can run in parallel with siblings

---

## DEPENDENCIES

### Internal Dependencies (Within Parent SCOPE)

| SUB-SCOPE | Required State | Reason |
|-----------|----------------|--------|
| None | - | Authentication is foundational |

### External Dependencies (Other SCOPEs)

| SCOPE | Repository | Required State | Reason |
|-------|------------|----------------|--------|
| Supabase Auth | external | COMPLETE | Provides JWT infrastructure |

---

## DECISION LOG

| ID | Date | Decision | Status | Rationale |
|----|------|----------|--------|-----------|
| AUTH-001 | 2025-12-18 | Use Supabase Auth for JWT | ACTIVE | Already integrated |
| AUTH-002 | 2025-12-18 | TOTP for 2FA (not SMS) | ACTIVE | SIM swap protection |
| AUTH-003 | 2025-12-18 | 5 login attempts before lockout | ACTIVE | Brute force prevention |
| AUTH-004 | 2025-12-18 | 15 min lockout duration | ACTIVE | Balance security/UX |

---

## AUDIT_REPORT

**Last Audit:** 2025-12-28
**Audited By:** Claude Code

### Current State

Authentication uses Supabase Auth with JWT tokens. Basic password auth is working. 2FA is NOT yet implemented.

### Files Involved

| File | Exists | Status | Notes |
|------|--------|--------|-------|
| src/routes/auth.ts (backend) | Yes | Working | Login, register, verify |
| assets/js/auth.js (frontend) | Yes | Working | Client auth handling |

### Discrepancies

| Expected | Actual | Severity |
|----------|--------|----------|
| 2FA for admin accounts | Not implemented | Medium |
| Session management UI | Not implemented | Medium |
| Password policy enforcement | Supabase default only | Low |

---

## HANDOFF_DOCUMENT

### Context

Authentication is the foundation of platform security. Users must be able to securely log in, and admin accounts require additional protection via 2FA.

### Scope Boundaries

**In Scope:**
- JWT token handling and validation
- 2FA setup and verification (TOTP)
- Session management (list, revoke)
- Password policies
- Login attempt tracking and lockout

**Out of Scope:**
- Role-based permissions (SUB-SCOPE_AUTHORIZATION)
- Audit logging (SUB-SCOPE_DATA_PROTECTION)
- Compliance requirements (SUB-SCOPE_COMPLIANCE)

### Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| R-01 | JWT authentication working | Must | Done |
| R-02 | 2FA for Tier 1 admins (mandatory) | Must | Pending |
| R-03 | 2FA for regular users (optional) | Should | Pending |
| R-04 | Session list and revoke UI | Should | Pending |
| R-05 | Password complexity requirements | Could | Pending |

### Technical Specification

**2FA Implementation:**
- Use TOTP (Time-based One-Time Password)
- Store encrypted TOTP secret in `user_security_settings` table
- Generate backup codes during setup
- Require 2FA verification on login for enabled accounts

**Session Management:**
- Track sessions in `user_sessions` table
- Allow users to view active sessions
- Allow revoking individual or all sessions
- Auto-expire sessions after inactivity

### Implementation Steps

| Step | Description | Effort |
|------|-------------|--------|
| 1 | Create user_security_settings table | 1 hour |
| 2 | Create user_sessions table | 1 hour |
| 3 | Implement 2FA setup endpoint | 2 hours |
| 4 | Implement 2FA verify endpoint | 2 hours |
| 5 | Update login flow for 2FA | 2 hours |
| 6 | Create session management endpoints | 2 hours |
| 7 | Build frontend 2FA setup UI | 3 hours |
| 8 | Build frontend session management UI | 2 hours |

### Acceptance Criteria

- [ ] Tier 1 admins can enable 2FA
- [ ] 2FA required for Tier 1 admin login when enabled
- [ ] Backup codes work when authenticator unavailable
- [ ] Users can see list of active sessions
- [ ] Users can revoke individual sessions
- [ ] Sessions auto-expire after 30 days inactivity

---

## RESEARCH_FINDINGS

**Session:** 1
**Date:** 2025-12-28

### What Was Tried
- Reviewed existing auth implementation in Supabase
- Analyzed user_security_settings table schema from SCOPE_SECURITY

### Open Questions
- [ ] Should 2FA be mandatory for all admin tiers or just Tier 1?
- [ ] What is the desired session timeout period?

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
