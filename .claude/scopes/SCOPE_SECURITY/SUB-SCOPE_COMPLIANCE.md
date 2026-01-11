# SUB-SCOPE_COMPLIANCE

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
| **Name** | SUB-SCOPE_COMPLIANCE |
| **Parent** | SCOPE_SECURITY |
| **Description** | COPPA, FERPA, GDPR compliance requirements and implementation |
| **Repository** | Inherited from parent (frontend + backend) |
| **Type** | Integration |

---

## RELATIONSHIP TO PARENT

**Parent SCOPE:** SCOPE_SECURITY
**Sibling SUB-SCOPEs:**
- SUB-SCOPE_AUTHENTICATION
- SUB-SCOPE_AUTHORIZATION
- SUB-SCOPE_DATA_PROTECTION

**Parallel Execution:** Yes - Can run in parallel with siblings

---

## DEPENDENCIES

### Internal Dependencies (Within Parent SCOPE)

| SUB-SCOPE | Required State | Reason |
|-----------|----------------|--------|
| SUB-SCOPE_DATA_PROTECTION | IN_PROGRESS | Compliance requires data protection |

### External Dependencies (Other SCOPEs)

| SCOPE | Repository | Required State | Reason |
|-------|------------|----------------|--------|
| SCOPE_PARENT_PORTAL | frontend | IN_PROGRESS | COPPA consent implementation |
| SCOPE_K12_EDUCATION | frontend | SPECIFIED | Child data handling |

---

## DECISION LOG

| ID | Date | Decision | Status | Rationale |
|----|------|----------|--------|-----------|
| COMP-001 | 2025-12-18 | COPPA: Email Plus verification | ACTIVE | FTC-approved method |
| COMP-002 | 2025-12-18 | COPPA: No data collection before consent | ACTIVE | Legal requirement |
| COMP-003 | 2025-12-18 | Age-tier content filtering | ACTIVE | K-5 strictest |
| COMP-004 | 2025-12-18 | 7-year consent retention | ACTIVE | Legal requirement |

---

## AUDIT_REPORT

**Last Audit:** 2025-12-28
**Audited By:** Claude Code

### Current State

COPPA compliance is largely implemented via SCOPE_PARENT_PORTAL. Age-tier content filtering works via AI Police. FERPA awareness exists in data handling. GDPR features (data export) not yet implemented.

### Files Involved

| File | Exists | Status | Notes |
|------|--------|--------|-------|
| portal/parent-consent.html | Yes | Working | COPPA consent UI |
| src/routes/parent.ts | Yes | Working | Consent API endpoints |
| src/security/ai-police.ts | Yes | Working | Age-tier filtering |
| coppa_consent_records (table) | Yes | Working | Consent audit trail |

### Discrepancies

| Expected | Actual | Severity |
|----------|--------|----------|
| Children's privacy notice page | Not created | Medium |
| GDPR data export | Not implemented | Low (EU users only) |
| FERPA documentation | Not documented | Low |

---

## HANDOFF_DOCUMENT

### Context

Compliance ensures PMERIT meets legal requirements for handling user data, especially for children under 13 (COPPA), educational records (FERPA), and EU users (GDPR).

### Scope Boundaries

**In Scope:**
- COPPA verifiable parental consent
- COPPA data collection limits
- COPPA parental rights (view, delete, revoke)
- FERPA educational record awareness
- GDPR right to erasure
- GDPR data portability
- Children's privacy notice

**Out of Scope:**
- Technical implementation of consent flow (SCOPE_PARENT_PORTAL)
- PII detection (SUB-SCOPE_DATA_PROTECTION)
- Access control (SUB-SCOPE_AUTHORIZATION)

### Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| R-01 | COPPA consent before child data collection | Must | Done |
| R-02 | COPPA verifiable parental consent (Email Plus) | Must | Done |
| R-03 | COPPA parent can view child data | Must | Done |
| R-04 | COPPA parent can delete child data | Must | Done |
| R-05 | COPPA parent can revoke consent | Must | Done |
| R-06 | Children's privacy notice page | Must | Not started |
| R-07 | Age-tier content restrictions | Must | Done |
| R-08 | GDPR data export endpoint | Should | Not started |
| R-09 | FERPA compliance documentation | Could | Not started |

### Technical Specification

**COPPA Requirements (Implemented):**
1. Children under 13 require parental consent
2. Consent collected via Email Plus method
3. Data collection notice displayed before consent
4. Electronic signature with timestamp, IP, user agent
5. Consent records retained 7 years
6. Parent can view, delete, revoke at any time

**COPPA Data Limits:**
| Data | Collected | Not Collected |
|------|-----------|---------------|
| Name | Yes | - |
| Email | Yes | - |
| DOB | Yes | - |
| Progress | Yes | - |
| Location | - | Never |
| Device IDs | - | Never |
| Biometrics | - | Never |
| Social media | - | Never |

**Age-Tier Content Restrictions:**
| Tier | Ages | Blocked Topics |
|------|------|----------------|
| K-5 | 5-10 | violence, death, weapons, drugs, alcohol, dating, politics |
| 6-8 | 11-13 | explicit violence, drugs, alcohol, dating specifics |
| 9-12 | 14-18 | explicit content, illegal activities |
| Adult | 18+ | illegal activities, harmful instructions |

### Acceptance Criteria

- [x] Children under 13 cannot use platform without consent
- [x] Parents receive verification email
- [x] Parents complete consent form with signature
- [x] Parents can view child data in dashboard
- [x] Parents can revoke consent
- [x] Revocation deletes child data
- [ ] Children's privacy notice page exists at /legal/childrens-privacy.html
- [ ] GDPR data export endpoint works

---

## COMPLIANCE DOCUMENTATION

### COPPA Checklist

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Clear privacy notice | Consent form + dedicated page | Partial |
| List all data collected | Displayed in consent form | Done |
| Explain data use | Displayed in consent form | Done |
| Third-party disclosure notice | None (we don't share) | Done |
| Parental consent before collection | Consent flow blocks child | Done |
| Parent can review child data | Parent dashboard | Done |
| Parent can delete child data | Revoke consent endpoint | Done |
| Parent can revoke consent | Settings page | Done |
| Re-consent on material changes | Consent version tracking | Done |
| Reasonable data security | AI Police, encryption | Done |

### FERPA Notes

FERPA applies to educational records when PMERIT works with schools. Current implementation:
- Student progress data is educational record
- Parent has right to inspect (via dashboard)
- Schools would need to designate PMERIT as school official
- No external sharing without consent

### GDPR Notes

GDPR applies to EU users. Required features:
- Right to access (data export) - NOT YET
- Right to erasure (delete account) - PARTIAL
- Right to data portability (export in machine-readable format) - NOT YET
- Privacy notice - PARTIAL

---

## RESEARCH_FINDINGS

**Session:** 1
**Date:** 2025-12-28

### What Works
- COPPA consent flow fully functional
- Age-tier content filtering active
- Consent records properly logged

### Open Questions
- [ ] What specific FERPA requirements apply when partnering with schools?
- [ ] Do we have EU users requiring GDPR compliance?
- [ ] What format for GDPR data export (JSON, CSV)?

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
