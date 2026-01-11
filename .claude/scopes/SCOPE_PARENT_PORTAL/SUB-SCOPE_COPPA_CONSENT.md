# SUB-SCOPE_COPPA_CONSENT

**Version:** 1.0
**Status:** COMPLETE
**Parent SCOPE:** SCOPE_PARENT_PORTAL
**Repository:** frontend + backend
**Created:** 2025-12-28
**Last Updated:** 2025-12-28

---

## SUB-SCOPE IDENTITY

| Field | Value |
|-------|-------|
| **Name** | SUB-SCOPE_COPPA_CONSENT |
| **Parent** | SCOPE_PARENT_PORTAL |
| **Description** | Verifiable parental consent flow for COPPA compliance |
| **Repository** | Inherited from parent (frontend + backend) |
| **Type** | Integration |

---

## RELATIONSHIP TO PARENT

**Parent SCOPE:** SCOPE_PARENT_PORTAL
**Sibling SUB-SCOPEs:**
- SUB-SCOPE_PROGRESS_DASHBOARD
- SUB-SCOPE_CONTROLS
- SUB-SCOPE_NOTIFICATIONS

**Parallel Execution:** No - Must complete before children can use platform

---

## DEPENDENCIES

### Internal Dependencies (Within Parent SCOPE)

| SUB-SCOPE | Required State | Reason |
|-----------|----------------|--------|
| None | - | Consent is the first step |

### External Dependencies (Other SCOPEs)

| SCOPE | Repository | Required State | Reason |
|-------|------------|----------------|--------|
| SCOPE_EMAIL_SYSTEM | backend | IN_PROGRESS | Consent request emails |
| SCOPE_SECURITY | frontend | IN_PROGRESS | AI Police age-tier filtering |

---

## DECISION LOG

| ID | Date | Decision | Status | Rationale |
|----|------|----------|--------|-----------|
| CC-001 | 2025-12-18 | Email Plus verification method | ACTIVE | FTC-approved, simplest |
| CC-002 | 2025-12-18 | 7-day consent link expiry | ACTIVE | Balance urgency/convenience |
| CC-003 | 2025-12-18 | Electronic signature required | ACTIVE | Audit trail |

---

## AUDIT_REPORT

**Last Audit:** 2025-12-28
**Audited By:** Claude Code

### Current State

COPPA consent flow is COMPLETE and working in production. Consent request emails sent via Resend API. Consent form captures all required data. Child accounts activate upon consent.

### Files Involved

| File | Exists | Status | Notes |
|------|--------|--------|-------|
| portal/parent-consent.html | Yes | Working | COPPA consent UI |
| src/routes/parent.ts | Yes | Working | Consent API endpoints |
| coppa_consent_records (table) | Yes | Working | Consent audit trail |

### Discrepancies

| Expected | Actual | Severity |
|----------|--------|----------|
| All working | All working | None |

---

## HANDOFF_DOCUMENT

### Context

COPPA requires verifiable parental consent before collecting personal information from children under 13. This SUB-SCOPE implements the Email Plus verification method.

### Scope Boundaries

**In Scope:**
- Consent request email sending
- Token-based verification link
- Consent form with data disclosures
- Electronic signature capture
- Consent record storage
- Consent revocation
- Age-out transition handling

**Out of Scope:**
- Parent dashboard (SUB-SCOPE_PROGRESS_DASHBOARD)
- Time/content controls (SUB-SCOPE_CONTROLS)
- Ongoing notifications (SUB-SCOPE_NOTIFICATIONS)

### Technical Specification

**Consent Flow:**
1. Child registers with age < 13
2. Child enters parent email
3. System creates child account in PENDING_CONSENT state
4. System sends consent request email with verification token
5. Parent clicks link, creates account if needed
6. Parent reviews data disclosures
7. Parent provides electronic signature
8. System records consent with IP, user agent, timestamp
9. Child account activated

**Database Tables:**
- `coppa_consent_records` - Audit trail of all consent actions
- `student_guardians` - Parent-child links with consent fields

**API Endpoints:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/parent/consent/request` | POST | Send consent request email |
| `/api/v1/parent/consent/verify/:token` | GET | Validate consent link |
| `/api/v1/parent/consent/give` | POST | Submit consent |
| `/api/v1/parent/consent/revoke` | POST | Revoke consent |
| `/api/v1/parent/consent/status/:childId` | GET | Check consent status |

### Acceptance Criteria

- [x] Child registration detects age < 13
- [x] System sends consent request email to parent
- [x] Consent form displays all COPPA-required information
- [x] Consent captured with electronic signature, timestamp, IP
- [x] Consent record stored in coppa_consent_records
- [x] Child account state transitions correctly
- [x] Consent link expires after 7 days
- [x] Parent can revoke consent
- [x] Revocation deactivates child account

---

## LOCKED FILES

| File | Locked Since | Reason |
|------|--------------|--------|
| portal/parent-consent.html | 2025-12-23 | Core consent UI |
| src/routes/parent.ts | 2025-12-23 | Consent endpoints |

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-28 | Initial creation from SCOPE_PARENT_PORTAL decomposition |

---

*AIXORD v2.1 — SUB-SCOPE of SCOPE_PARENT_PORTAL*
