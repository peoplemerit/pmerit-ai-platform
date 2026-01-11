# SUB-SCOPE_PROGRESS_DASHBOARD

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
| **Name** | SUB-SCOPE_PROGRESS_DASHBOARD |
| **Parent** | SCOPE_PARENT_PORTAL |
| **Description** | Child progress viewing and monitoring dashboard |
| **Repository** | Inherited from parent (frontend + backend) |
| **Type** | Integration |

---

## RELATIONSHIP TO PARENT

**Parent SCOPE:** SCOPE_PARENT_PORTAL
**Sibling SUB-SCOPEs:**
- SUB-SCOPE_COPPA_CONSENT
- SUB-SCOPE_CONTROLS
- SUB-SCOPE_NOTIFICATIONS

**Parallel Execution:** Yes - Can run in parallel with siblings (after consent)

---

## DEPENDENCIES

### Internal Dependencies (Within Parent SCOPE)

| SUB-SCOPE | Required State | Reason |
|-----------|----------------|--------|
| SUB-SCOPE_COPPA_CONSENT | COMPLETE | Can't view child without consent |

### External Dependencies (Other SCOPEs)

| SCOPE | Repository | Required State | Reason |
|-------|------------|----------------|--------|
| SCOPE_PROGRESS | frontend | PARTIAL | Progress data source |

---

## DECISION LOG

| ID | Date | Decision | Status | Rationale |
|----|------|----------|--------|-----------|
| PD-001 | 2025-12-18 | Card-based child overview | ACTIVE | Clean, scannable UI |
| PD-002 | 2025-12-18 | Modal for detailed progress | ACTIVE | No page navigation needed |
| PD-003 | 2025-12-18 | 7-day learning time chart | ACTIVE | Recent activity focus |

---

## AUDIT_REPORT

**Last Audit:** 2025-12-28
**Audited By:** Claude Code

### Current State

Progress dashboard is COMPLETE. Parents can view all linked children, see course progress, learning time, and assessment scores.

### Files Involved

| File | Exists | Status | Notes |
|------|--------|--------|-------|
| portal/parent-dashboard.html | Yes | Working | Main dashboard UI |
| src/routes/parent.ts | Yes | Working | Progress API endpoints |

### Discrepancies

| Expected | Actual | Severity |
|----------|--------|----------|
| PDF export | Not implemented | Low |

---

## HANDOFF_DOCUMENT

### Context

Parents need to monitor their children's learning progress. This dashboard provides at-a-glance overview and detailed drill-down capability.

### Scope Boundaries

**In Scope:**
- Child overview cards
- Course enrollment list
- Progress percentage per course
- Learning time tracking (daily, weekly)
- Assessment score viewing
- Link child by invite code

**Out of Scope:**
- Time/content controls (SUB-SCOPE_CONTROLS)
- Notifications settings (SUB-SCOPE_NOTIFICATIONS)
- PDF export (future enhancement)

### Technical Specification

**Dashboard Components:**
1. **Child Cards** - One per linked child showing:
   - Name and grade
   - Number of courses
   - Today's learning minutes
   - Weekly learning hours
   - Last active time

2. **Progress Modal** - Opens on child card click:
   - 7-day learning time bar chart
   - Course list with progress bars
   - Recent assessment scores table

3. **Link Child Section** - Bottom of dashboard:
   - Invite code input
   - Link button

**API Endpoints:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/parent/children` | GET | List all linked children |
| `/api/v1/parent/children/:id` | GET | Get child detail |
| `/api/v1/parent/children/:id/progress` | GET | Get progress data |
| `/api/v1/parent/link/code` | POST | Link via invite code |

### Acceptance Criteria

- [x] Parent can log in and see dashboard
- [x] Dashboard shows all linked children
- [x] Child cards show name, grade, status, last login
- [x] Can click child to see detail view
- [x] Detail view shows courses, progress %, time spent
- [x] Can view assessment scores
- [x] Can link child by invite code
- [ ] Can download progress report (PDF) - future

---

## LOCKED FILES

| File | Locked Since | Reason |
|------|--------------|--------|
| portal/parent-dashboard.html | 2025-12-23 | Core dashboard UI |

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-28 | Initial creation from SCOPE_PARENT_PORTAL decomposition |

---

*AIXORD v2.1 — SUB-SCOPE of SCOPE_PARENT_PORTAL*
