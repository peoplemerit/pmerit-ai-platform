# SCOPE_PARENT_PORTAL

**Version:** 3.0
**Status:** IN_PROGRESS
**Repository:** frontend
**Created:** 2025-12-18
**Last Updated:** 2025-12-28
**Has SUB-SCOPEs:** Yes

---

## SCOPE IDENTITY

| Field | Value |
|-------|-------|
| **Name** | SCOPE_PARENT_PORTAL |
| **Description** | Parent/Guardian Dashboard for K-12 Student Oversight |
| **Repository** | pmerit-ai-platform (frontend) + pmerit-api-worker (backend) |
| **Type** | Integration |
| **Has SUB-SCOPEs** | Yes |
| **Parent SCOPE** | None |

---

## OVERVIEW

This SCOPE provides comprehensive parent/guardian oversight for K-12 students:
- COPPA-compliant consent management
- Progress monitoring and dashboards
- Parental controls (time limits, content restrictions)
- Notifications for activity and achievements
- Age-out transition when child turns 13

---

## SUB-SCOPES

| SUB-SCOPE | State | Description | Last Updated |
|-----------|-------|-------------|--------------|
| SUB-SCOPE_COPPA_CONSENT | COMPLETE | Verifiable parental consent flow | 2025-12-28 |
| SUB-SCOPE_PROGRESS_DASHBOARD | COMPLETE | Child progress viewing | 2025-12-28 |
| SUB-SCOPE_CONTROLS | COMPLETE | Time limits, content restrictions | 2025-12-28 |
| SUB-SCOPE_NOTIFICATIONS | PARTIAL | Email notifications to parents | 2025-12-28 |

**Rollup Rule:** This SCOPE cannot be COMPLETE until ALL SUB-SCOPEs are COMPLETE.

**SUB-SCOPE Files Location:**
```
.claude/scopes/SCOPE_PARENT_PORTAL/
├── SCOPE_PARENT_PORTAL.md              <- This file (parent overview)
├── SUB-SCOPE_COPPA_CONSENT.md
├── SUB-SCOPE_PROGRESS_DASHBOARD.md
├── SUB-SCOPE_CONTROLS.md
└── SUB-SCOPE_NOTIFICATIONS.md
```

---

## DEPENDENCIES

| Prerequisite | Repository | Required State | Reason |
|--------------|------------|----------------|--------|
| SCOPE_SECURITY | frontend | IN_PROGRESS | Parent auth protection |
| Auth System | backend | COMPLETE | Parent accounts, JWT |
| SCOPE_EMAIL_SYSTEM | backend | IN_PROGRESS | Consent emails, notifications |

---

## DECISION LOG

| ID | Date | Decision | Status | Rationale |
|----|------|----------|--------|-----------|
| PP-001 | 2025-12-18 | Consent verification: Email Plus | ACTIVE | Simplest FTC-accepted method |
| PP-002 | 2025-12-18 | Multi-guardian support (2 max) | ACTIVE | Divorced parents, grandparents |
| PP-003 | 2025-12-18 | Consent storage: Database | ACTIVE | Full audit trail, no third party |
| PP-004 | 2025-12-18 | Notification channel: Email + In-app | ACTIVE | Email primary, in-app secondary |
| PP-005 | 2025-12-18 | Age verification: Self-reported | ACTIVE | Industry standard |
| PP-006 | 2025-12-18 | Age-out policy: Auto with grace period | ACTIVE | Smooth UX, legal compliance |
| PP-007 | 2025-12-28 | Decompose into SUB-SCOPEs | ACTIVE | AIXORD v2.1 governance |

---

## IMPLEMENTATION STATUS

### Phase 1: Database (COMPLETE)
- [x] Migration 012: Parent portal tables
- [x] coppa_consent_records table
- [x] parent_notification_settings table
- [x] parent_controls table
- [x] parent_link_requests table

### Phase 2: API Endpoints (COMPLETE)
- [x] 17 parent API endpoints deployed
- [x] Consent request/verify/give/revoke
- [x] Children list and detail
- [x] Controls get/update
- [x] Link by invite code

### Phase 3: Frontend UI (COMPLETE)
- [x] parent-consent.html - COPPA consent form
- [x] parent-dashboard.html - Child overview
- [x] parent-settings.html - Controls and notifications

### Phase 4: Age-Out (COMPLETE)
- [x] Daily cron job for age-out detection
- [x] 30-day advance notice emails
- [x] Transition on 13th birthday
- [x] Migration 014: age_out_notices table

### Phase 5: Notifications (PARTIAL)
- [x] Consent request emails
- [x] Age-out notification emails
- [ ] Weekly summary emails
- [ ] Achievement notification emails
- [ ] Inactivity alert emails

---

## LOCKED FILES

| File | Locked Since | Reason | Locked By |
|------|--------------|--------|-----------|
| src/routes/parent.ts | 2025-12-23 | Parent API endpoints | SCOPE_PARENT_PORTAL |
| portal/parent-consent.html | 2025-12-23 | COPPA consent UI | SCOPE_PARENT_PORTAL |

---

## CHANGELOG

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-18 | Initial creation | Claude Code |
| 2.0 | 2025-12-23 | Phase 1-4 complete | Claude Code |
| 2.1 | 2025-12-23 | E2E testing, bug fix | Claude Code |
| 2.2 | 2025-12-23 | Age-out job implemented | Claude Code |
| 3.0 | 2025-12-28 | Decomposed into SUB-SCOPEs per AIXORD v2.1 | Claude Code |

---

*AIXORD v2.1 — Authority. Execution. Confirmation. Genesis.*
