# SUB-SCOPE_CONTROLS

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
| **Name** | SUB-SCOPE_CONTROLS |
| **Parent** | SCOPE_PARENT_PORTAL |
| **Description** | Time limits, content restrictions, parental controls |
| **Repository** | Inherited from parent (frontend + backend) |
| **Type** | Integration |

---

## RELATIONSHIP TO PARENT

**Parent SCOPE:** SCOPE_PARENT_PORTAL
**Sibling SUB-SCOPEs:**
- SUB-SCOPE_COPPA_CONSENT
- SUB-SCOPE_PROGRESS_DASHBOARD
- SUB-SCOPE_NOTIFICATIONS

**Parallel Execution:** Yes - Can run in parallel with siblings (after consent)

---

## DEPENDENCIES

### Internal Dependencies (Within Parent SCOPE)

| SUB-SCOPE | Required State | Reason |
|-----------|----------------|--------|
| SUB-SCOPE_COPPA_CONSENT | COMPLETE | Can't control child without consent |

### External Dependencies (Other SCOPEs)

| SCOPE | Repository | Required State | Reason |
|-------|------------|----------------|--------|
| SCOPE_SECURITY | frontend | IN_PROGRESS | Age-tier content filtering |

---

## DECISION LOG

| ID | Date | Decision | Status | Rationale |
|----|------|----------|--------|-----------|
| CTL-001 | 2025-12-18 | Time limits advisory only | ACTIVE | Backend can't block active session |
| CTL-002 | 2025-12-18 | Content age limit override | ACTIVE | Parent knows best |
| CTL-003 | 2025-12-18 | Per-child settings | ACTIVE | Different kids, different needs |

---

## AUDIT_REPORT

**Last Audit:** 2025-12-28
**Audited By:** Claude Code

### Current State

Parental controls are COMPLETE. Parents can set time limits, allowed hours, allowed days, and content age restrictions per child.

### Files Involved

| File | Exists | Status | Notes |
|------|--------|--------|-------|
| portal/parent-settings.html | Yes | Working | Controls UI |
| src/routes/parent.ts | Yes | Working | Controls API endpoints |
| parent_controls (table) | Yes | Working | Settings storage |

### Discrepancies

| Expected | Actual | Severity |
|----------|--------|----------|
| All working | All working | None |

---

## HANDOFF_DOCUMENT

### Context

Parents need to set boundaries on their children's platform usage. Controls include time limits and content restrictions.

### Scope Boundaries

**In Scope:**
- Daily/weekly time limits
- Allowed hours (start/end time)
- Allowed days of week
- Content age tier override
- Revoke consent action

**Out of Scope:**
- Progress viewing (SUB-SCOPE_PROGRESS_DASHBOARD)
- Notification preferences (SUB-SCOPE_NOTIFICATIONS)

### Technical Specification

**Controls Available:**
| Control | Type | Default | Options |
|---------|------|---------|---------|
| Daily time limit | Number | Unlimited | 15-480 minutes |
| Weekly time limit | Number | Unlimited | 60-2400 minutes |
| Allowed start time | Time | Any | HH:MM |
| Allowed end time | Time | Any | HH:MM |
| Allowed days | Multi-select | All | Mon-Sun |
| Content age limit | Select | Auto | K-5, 6-8, 9-12 |

**Enforcement:**
- Time limits are advisory (frontend shows warning)
- Content limits enforced by AI Police
- Parent notified when limits reached

**API Endpoints:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/parent/children/:id/controls` | GET | Get current controls |
| `/api/v1/parent/children/:id/controls` | PUT | Update controls |

**Database Table:**
```sql
parent_controls (
  control_id UUID PRIMARY KEY,
  parent_user_id UUID,
  child_user_id UUID,
  daily_time_limit_minutes INTEGER,
  weekly_time_limit_minutes INTEGER,
  allowed_start_time TIME,
  allowed_end_time TIME,
  content_age_limit VARCHAR(10),
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Acceptance Criteria

- [x] Parent can set daily time limit
- [x] Parent can set weekly time limit
- [x] Parent can set allowed hours
- [x] Parent can set allowed days
- [x] Parent can override content age tier
- [x] Settings persist across sessions
- [x] Parent can revoke consent from settings

---

## LOCKED FILES

| File | Locked Since | Reason |
|------|--------------|--------|
| portal/parent-settings.html | 2025-12-23 | Controls UI |

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-28 | Initial creation from SCOPE_PARENT_PORTAL decomposition |

---

*AIXORD v2.1 — SUB-SCOPE of SCOPE_PARENT_PORTAL*
