# SUB-SCOPE_DATA_PROTECTION

**Version:** 1.0
**Status:** SPECIFIED
**Parent SCOPE:** SCOPE_SECURITY
**Repository:** frontend + backend
**Created:** 2025-12-28
**Last Updated:** 2025-12-28

---

## SUB-SCOPE IDENTITY

| Field | Value |
|-------|-------|
| **Name** | SUB-SCOPE_DATA_PROTECTION |
| **Parent** | SCOPE_SECURITY |
| **Description** | Encryption, PII handling, audit logging, data retention |
| **Repository** | Inherited from parent (frontend + backend) |
| **Type** | Integration |

---

## RELATIONSHIP TO PARENT

**Parent SCOPE:** SCOPE_SECURITY
**Sibling SUB-SCOPEs:**
- SUB-SCOPE_AUTHENTICATION
- SUB-SCOPE_AUTHORIZATION
- SUB-SCOPE_COMPLIANCE

**Parallel Execution:** Yes - Can run in parallel with siblings

---

## DEPENDENCIES

### Internal Dependencies (Within Parent SCOPE)

| SUB-SCOPE | Required State | Reason |
|-----------|----------------|--------|
| None | - | Data protection is foundational |

### External Dependencies (Other SCOPEs)

| SCOPE | Repository | Required State | Reason |
|-------|------------|----------------|--------|
| Database (Neon) | external | COMPLETE | Data storage layer |

---

## DECISION LOG

| ID | Date | Decision | Status | Rationale |
|----|------|----------|--------|-----------|
| DP-001 | 2025-12-18 | AES-256 encryption at rest | ACTIVE | Industry standard |
| DP-002 | 2025-12-18 | Immutable audit logs | ACTIVE | Forensic integrity |
| DP-003 | 2025-12-18 | PII detection with AI Police | ACTIVE | COPPA compliance |
| DP-004 | 2025-12-18 | 7-year consent record retention | ACTIVE | Legal requirement |

---

## AUDIT_REPORT

**Last Audit:** 2025-12-28
**Audited By:** Claude Code

### Current State

AI Police includes PII detection. Audit logging tables exist but are not fully populated. Encryption at rest relies on Neon database defaults.

### Files Involved

| File | Exists | Status | Notes |
|------|--------|--------|-------|
| src/security/ai-police.ts | Yes | Working | PII detection patterns |
| security_audit_log (table) | Yes | Partial | Not all events logged |
| ai_moderation_log (table) | Yes | Working | AI Police logs |

### Discrepancies

| Expected | Actual | Severity |
|----------|--------|----------|
| Field-level encryption for PII | Not implemented | High |
| All security events logged | Partial logging | Medium |
| Data retention automation | Manual process | Low |

---

## HANDOFF_DOCUMENT

### Context

Data protection ensures user data, especially PII and child data, is properly secured, logged, and managed throughout its lifecycle.

### Scope Boundaries

**In Scope:**
- PII detection and masking
- Encryption at rest
- Audit trail logging
- Data retention policies
- Right to deletion implementation

**Out of Scope:**
- Authentication (SUB-SCOPE_AUTHENTICATION)
- Access control (SUB-SCOPE_AUTHORIZATION)
- Compliance documentation (SUB-SCOPE_COMPLIANCE)

### Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| R-01 | PII detection in AI inputs | Must | Done |
| R-02 | Security audit logging | Must | Partial |
| R-03 | AI moderation logging | Must | Done |
| R-04 | Field-level PII encryption | Should | Not started |
| R-05 | Automated data retention | Should | Not started |
| R-06 | Data export for GDPR | Could | Not started |

### Technical Specification

**PII Detection Patterns (Implemented):**
- SSN: `\b\d{3}-?\d{2}-?\d{4}\b`
- Credit Card: `\b(?:\d{4}[-\s]?){3}\d{4}\b`
- Phone: `\b(?:\+1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b`
- Email: `\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`
- Address: Street address patterns
- DOB: Date patterns that look like birthdays

**Audit Log Events to Capture:**
- login, logout, failed_login
- permission_change, role_change
- data_access (sensitive resources)
- data_export, data_delete
- admin_action

**Data Retention Policy:**
| Data Type | Retention | Trigger |
|-----------|-----------|---------|
| Consent records | 7 years | Legal hold |
| Progress data | Until deletion request | Parent revokes |
| Chat history | Until deletion request | Parent revokes |
| Learning time | 1 year rolling | Automatic |
| Audit logs | 3 years | Automatic |

### Acceptance Criteria

- [x] PII detected in AI chat inputs
- [x] AI moderation events logged
- [ ] All security events logged to audit table
- [ ] Field-level encryption for PII fields
- [ ] Data retention automation running
- [ ] Data export endpoint for GDPR

---

## RESEARCH_FINDINGS

**Session:** 1
**Date:** 2025-12-28

### What Works
- AI Police PII detection (6 patterns)
- AI moderation logging to database
- Basic audit log table structure

### Open Questions
- [ ] Which fields require field-level encryption?
- [ ] What is the encryption key management strategy?
- [ ] How to handle right to deletion with referential integrity?

---

## LOCKED FILES

| File | Locked Since | Reason |
|------|--------------|--------|
| src/security/ai-police.ts | 2025-12-22 | Core PII detection |

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-28 | Initial creation from SCOPE_SECURITY decomposition |

---

*AIXORD v2.1 — SUB-SCOPE of SCOPE_SECURITY*
