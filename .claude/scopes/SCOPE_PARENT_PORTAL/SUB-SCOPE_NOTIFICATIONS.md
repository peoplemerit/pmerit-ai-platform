# SUB-SCOPE_NOTIFICATIONS

**Version:** 1.0
**Status:** PARTIAL
**Parent SCOPE:** SCOPE_PARENT_PORTAL
**Repository:** frontend + backend
**Created:** 2025-12-28
**Last Updated:** 2025-12-28

---

## SUB-SCOPE IDENTITY

| Field | Value |
|-------|-------|
| **Name** | SUB-SCOPE_NOTIFICATIONS |
| **Parent** | SCOPE_PARENT_PORTAL |
| **Description** | Email notifications to parents about child activity |
| **Repository** | Inherited from parent (frontend + backend) |
| **Type** | Integration |

---

## RELATIONSHIP TO PARENT

**Parent SCOPE:** SCOPE_PARENT_PORTAL
**Sibling SUB-SCOPEs:**
- SUB-SCOPE_COPPA_CONSENT
- SUB-SCOPE_PROGRESS_DASHBOARD
- SUB-SCOPE_CONTROLS

**Parallel Execution:** Yes - Can run in parallel with siblings

---

## DEPENDENCIES

### Internal Dependencies (Within Parent SCOPE)

| SUB-SCOPE | Required State | Reason |
|-----------|----------------|--------|
| SUB-SCOPE_COPPA_CONSENT | COMPLETE | Need parent email from consent |

### External Dependencies (Other SCOPEs)

| SCOPE | Repository | Required State | Reason |
|-------|------------|----------------|--------|
| SCOPE_EMAIL_SYSTEM | backend | IN_PROGRESS | Email sending infrastructure |

---

## DECISION LOG

| ID | Date | Decision | Status | Rationale |
|----|------|----------|--------|-----------|
| NOT-001 | 2025-12-18 | Email primary, in-app secondary | ACTIVE | Parents check email more reliably |
| NOT-002 | 2025-12-18 | Weekly summary default | ACTIVE | Not too spammy |
| NOT-003 | 2025-12-18 | Per-notification-type toggles | ACTIVE | Granular control |

---

## AUDIT_REPORT

**Last Audit:** 2025-12-28
**Audited By:** Claude Code

### Current State

Notification infrastructure is PARTIAL. Consent request and age-out emails are working. Recurring notifications (weekly summary, achievements) are NOT yet implemented.

### Files Involved

| File | Exists | Status | Notes |
|------|--------|--------|-------|
| portal/parent-settings.html | Yes | Working | Notification preferences UI |
| src/routes/parent.ts | Yes | Working | Settings API endpoints |
| parent_notification_settings (table) | Yes | Working | Preferences storage |
| src/email-templates/index.ts | Yes | Partial | Some templates exist |

### Discrepancies

| Expected | Actual | Severity |
|----------|--------|----------|
| Weekly summary email | Not implemented | Medium |
| Course completion email | Not implemented | Low |
| Assessment result email | Not implemented | Low |
| Inactivity alert email | Not implemented | Medium |
| Achievement email | Not implemented | Low |

---

## HANDOFF_DOCUMENT

### Context

Parents need to stay informed about their children's activity without logging in daily. Email notifications keep parents engaged and aware.

### Scope Boundaries

**In Scope:**
- Consent request emails (DONE)
- Age-out notification emails (DONE)
- Weekly summary emails
- Course completion emails
- Assessment result emails
- Inactivity alert emails
- Achievement emails
- Notification preferences UI

**Out of Scope:**
- In-app notifications (future)
- Push notifications (future)
- SMS notifications (future)

### Technical Specification

**Notification Types:**
| Type | Trigger | Template | Status |
|------|---------|----------|--------|
| Consent Request | Child registers | parentConsentRequest | DONE |
| Age-Out Notice (30 day) | 30 days before birthday | ageOutNotice30Day | DONE |
| Age-Out Complete (Parent) | On 13th birthday | ageOutCompleteParent | DONE |
| Age-Out Complete (Teen) | On 13th birthday | ageOutCompleteTeen | DONE |
| Weekly Summary | Sunday midnight | weeklySummary | TODO |
| Course Completion | Course 100% | courseCompletion | TODO |
| Assessment Result | Assessment graded | assessmentResult | TODO |
| Inactivity Alert | No login for X days | inactivityAlert | TODO |
| Achievement Earned | Badge/achievement | achievementEarned | TODO |

**Parent Preferences:**
```sql
parent_notification_settings (
  setting_id UUID PRIMARY KEY,
  parent_user_id UUID,
  child_user_id UUID,
  weekly_summary_email BOOLEAN DEFAULT TRUE,
  course_completion_email BOOLEAN DEFAULT TRUE,
  assessment_result_email BOOLEAN DEFAULT TRUE,
  inactivity_alert_email BOOLEAN DEFAULT TRUE,
  achievement_email BOOLEAN DEFAULT TRUE,
  summary_frequency VARCHAR(20) DEFAULT 'weekly',
  inactivity_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

**API Endpoints:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/parent/notifications` | GET | Get preferences |
| `/api/v1/parent/notifications` | PUT | Update preferences |

### Implementation Steps

| Step | Description | Effort | Status |
|------|-------------|--------|--------|
| 1 | Weekly summary email template | 2 hours | TODO |
| 2 | Weekly summary cron job | 2 hours | TODO |
| 3 | Course completion trigger | 1 hour | TODO |
| 4 | Assessment result trigger | 1 hour | TODO |
| 5 | Inactivity detection job | 2 hours | TODO |
| 6 | Achievement trigger | 1 hour | TODO |

### Acceptance Criteria

- [x] Consent request emails sent
- [x] Age-out emails sent
- [x] Parent can configure notification preferences
- [ ] Parent receives weekly summary email
- [ ] Parent notified of course completions
- [ ] Parent notified of assessment results
- [ ] Parent receives inactivity alerts
- [ ] Parent notified of achievements

---

## RESEARCH_FINDINGS

**Session:** 1
**Date:** 2025-12-28

### What Works
- Consent request emails via Resend API
- Age-out emails via scheduled job
- Preferences UI and storage

### Open Questions
- [ ] What day/time should weekly summary be sent?
- [ ] What is the minimum inactivity period before alerting?
- [ ] Should there be a daily digest option?

---

## LOCKED FILES

| File | Locked Since | Reason |
|------|--------------|--------|
| - | - | - |

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-28 | Initial creation from SCOPE_PARENT_PORTAL decomposition |

---

*AIXORD v2.1 — SUB-SCOPE of SCOPE_PARENT_PORTAL*
