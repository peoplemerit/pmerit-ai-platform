# PMERIT Critical Tasks — Consolidated Backlog

**Created:** 2025-12-11 (Session 50)
**Source:** Claude Code Validated Tasks + Session 50 Gap Analysis
**Purpose:** Single source of truth for all pending implementation work
**Architecture Reference:** `docs/project/PMERIT_ARCHITECTURE_FINAL.md` (v1.1)

---

## 📊 Executive Summary

| Category | Count | Status |
|----------|-------|--------|
| **Critical (Blocking)** | 4 | 🔴 Must complete before K-12 testing |
| **High Priority** | 8 | 🟠 Core functionality gaps |
| **Medium Priority** | 4 | 🟡 Enhancement & testing |
| **Low Priority / Future** | 7 | 🔵 Deferred |
| **TOTAL** | 23 | — |

---

## 🚨 CRITICAL — BLOCKING K-12 TESTING

These tasks MUST be completed before your children (ages 3 & 8) can properly test the platform.

### C1. Parent/Guardian Portal Tables
| Field | Value |
|-------|-------|
| **Source** | ARCH-1 Task #4, Session 50 Gap Analysis |
| **Status** | 🔴 NOT STARTED |
| **Impact** | Blocks all K-12 functionality |
| **Tables Required** | `student_guardians`, `student_grades` |
| **Documented In** | BRAINSTORM_ASU_LIKE_SCHEMA.md |

**Schema (Ready to Create):**
```sql
CREATE TABLE student_guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_user_id UUID REFERENCES users(user_id),
    guardian_user_id UUID REFERENCES users(user_id),
    relationship VARCHAR(50),  -- "parent", "guardian", "grandparent"
    is_primary BOOLEAN DEFAULT FALSE,
    can_view_progress BOOLEAN DEFAULT TRUE,
    can_communicate BOOLEAN DEFAULT TRUE,
    can_manage_credentials BOOLEAN DEFAULT TRUE,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_user_id, guardian_user_id)
);

CREATE TABLE student_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    grade_id UUID REFERENCES grade_levels(grade_id),
    academic_year VARCHAR(9),  -- "2024-2025"
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'active',
    UNIQUE(user_id, academic_year)
);
```

---

### C2. COPPA Age-Based Access Controls
| Field | Value |
|-------|-------|
| **Source** | Architecture Decision, Session 50 Gap Analysis |
| **Status** | 🔴 NOT STARTED |
| **Impact** | Legal compliance for children under 13 |
| **Depends On** | C1 (Parent Tables) |

**Requirements:**
- Under 13: Parent manages everything (COPPA)
- 13-17: More autonomy, parent oversight
- 18+: Full independence
- Parent must create account FIRST, then add children
- No direct child registration without guardian

---

### C3. Link Test Accounts to Parent
| Field | Value |
|-------|-------|
| **Source** | Session 50 Gap Analysis |
| **Status** | 🔴 BLOCKED by C1 |
| **Impact** | Test accounts cannot be used properly |
| **Accounts** | `child1-test@pmerit.com` (age 3), `child2-test@pmerit.com` (age 8) |

**Current Issue:** Test accounts exist but have no parent linkage.

**Resolution:**
1. Create parent account for testing
2. Create `student_guardians` records linking children to parent
3. Implement "Add Child" flow in UI

---

### C4. Enrollment Flow Frontend Verification
| Field | Value |
|-------|-------|
| **Source** | Session 50 Gap Analysis |
| **Status** | 🟡 NEEDS VERIFICATION |
| **Backend** | ✅ COMPLETE (Session 38) |
| **Frontend** | ❓ UNKNOWN |

**Verification Checklist:**
| Component | File | Status |
|-----------|------|--------|
| Dashboard fetches `/users/:id/enrollments` | dashboard.html | ❓ |
| "+ Add Course" button exists | dashboard.html | ❓ |
| "Enroll" button calls API | course.html | ❓ |
| Post-enrollment redirect works | course.html | ❓ |
| "My Courses" shows enrolled courses | dashboard.html | ❓ |
| Drop course functionality | dashboard.html | ❓ |

---

## 🟠 HIGH PRIORITY — Core Functionality

### H1. Phase 6: Progress & Assessment Integration
| Field | Value |
|-------|-------|
| **Source** | STATE.json `not_started` |
| **Status** | 🔴 NOT STARTED |
| **Description** | Connect assessment results to progress tracking |

---

### H2. ARCH-2 Credential Issuance API
| Field | Value |
|-------|-------|
| **Source** | STATE.json `not_started` |
| **Status** | 🔴 NOT STARTED |
| **Description** | API for issuing blockchain-anchored credentials |
| **Depends On** | Credential tables (already exist per ARCH-1) |

---

### H3. H7 Language Modal Fix
| Field | Value |
|-------|-------|
| **Source** | STATE.json `completed_with_gaps` |
| **Status** | 🟡 PARTIALLY COMPLETE |
| **Issue** | "No languages found" error |
| **File** | Homepage language selector |

---

### H4. Assessment Results DB Query
| Field | Value |
|-------|-------|
| **Source** | STATE.json `completed_with_gaps` |
| **Status** | 🟡 PARTIALLY COMPLETE |
| **Issue** | Results not persisting correctly |

---

### H5. TTS Quota Configuration
| Field | Value |
|-------|-------|
| **Source** | STATE.json `completed_with_gaps` |
| **Status** | 🟡 PARTIALLY COMPLETE |
| **Issue** | Need rate limiting/quota management |

---

### H6. Locale API (404)
| Field | Value |
|-------|-------|
| **Source** | STATE.json `completed_with_gaps` |
| **Status** | 🟡 PARTIALLY COMPLETE |
| **Issue** | Locale endpoint returning 404 |

---

### H7. Parent Dashboard UI
| Field | Value |
|-------|-------|
| **Source** | Session 50 Gap Analysis |
| **Status** | 🔴 NOT STARTED |
| **Depends On** | C1 (Parent Tables) |
| **Features** | View children's progress, activity reports, credential access |

---

### H8. "Add Child" Registration Flow
| Field | Value |
|-------|-------|
| **Source** | Session 50 Gap Analysis |
| **Status** | 🔴 NOT STARTED |
| **Depends On** | C1 (Parent Tables) |
| **Flow** | Parent Dashboard → Add Child → Link to Guardian Account |

---

## 🟡 MEDIUM PRIORITY — Enhancement & Testing

### M1. Classroom Content Testing
| Field | Value |
|-------|-------|
| **Source** | STATE.json `work_in_progress` |
| **Status** | 🟡 IN PROGRESS |
| **Description** | Test MOOSE content in classroom with real users |

---

### M2. Avatar Browser Testing
| Field | Value |
|-------|-------|
| **Source** | STATE.json `work_in_progress` |
| **Status** | 🟡 IN PROGRESS |
| **Description** | Cross-browser testing for WebGL avatar |

---

### M3. Assessment Enhancements (Tiers 1-5)
| Field | Value |
|-------|-------|
| **Source** | STATE.json `not_started` |
| **Status** | 🔴 NOT STARTED |
| **Tiers** | Basic → AI Scenario-Based |

---

### M4. Avatar Diversity (Track B)
| Field | Value |
|-------|-------|
| **Source** | STATE.json `not_started` |
| **Status** | 🔴 NOT STARTED |
| **Description** | Different avatars for different age groups/personas |
| **Personas** | Ms. Sunshine (K-2), Mr. Explorer (3-5), Coach Jordan (6-8), etc. |

---

## 🔵 LOW PRIORITY / FUTURE

### L1. Admin Portal (Phases 7-10)
| Field | Value |
|-------|-------|
| **Source** | STATE.json `not_started` |
| **Status** | 🔵 DEFERRED |

---

### L2. ARCH-3 Polygon Integration
| Field | Value |
|-------|-------|
| **Source** | STATE.json `not_started` |
| **Status** | 🔵 DEFERRED |
| **Description** | Live blockchain credential anchoring |

---

### L3. DigitalOcean GPU API
| Field | Value |
|-------|-------|
| **Source** | Chat history |
| **Status** | 🔵 DEFERRED |
| **Description** | Premium tier avatar streaming |

---

### L4. support@pmerit.com Inbox
| Field | Value |
|-------|-------|
| **Source** | Chat history |
| **Status** | 🔵 NICE-TO-HAVE |

---

### L5. RAG Knowledge Base
| Field | Value |
|-------|-------|
| **Source** | Chat history |
| **Status** | 🔵 DEFERRED |

---

### L6. GitHub CI/CD
| Field | Value |
|-------|-------|
| **Source** | Chat history |
| **Status** | 🔵 LOW PRIORITY |

---

### L7. K-12 Grade Tables
| Field | Value |
|-------|-------|
| **Source** | ARCH-1 Task #3 |
| **Status** | 🔵 DEFERRED (Part of ARCH-1) |
| **Tables** | `grade_levels`, `subjects`, `grade_subjects`, `subject_units` |

---

## 📋 Recommended Execution Order

### Phase A: Enable K-12 Testing (Critical Path)
```
C1 → C2 → C3 → C4
Parent Tables → COPPA Controls → Link Test Accounts → Verify Enrollment
```
**Estimated:** 1-2 sessions

### Phase B: Fix Technical Debt
```
H3 → H4 → H5 → H6
Language Modal → Assessment DB → TTS Quota → Locale API
```
**Estimated:** 1 session

### Phase C: Complete Parent Experience
```
H7 → H8
Parent Dashboard UI → Add Child Flow
```
**Estimated:** 1-2 sessions

### Phase D: Core Features
```
H1 → H2
Progress Integration → Credential API
```
**Estimated:** 2-3 sessions

---

## 🔗 Reference Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Architecture Spec | `docs/project/PMERIT_ARCHITECTURE_FINAL.md` | Source of truth for design |
| Brainstorm Schema | `docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md` | Detailed schemas |
| User Journey | `docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md` | User flows |
| STATE.json | `docs/aados/STATE.json` | Current state pointer |
| Session 49 Handoff | `docs/handoffs/PMERIT_HANDOFF_SESSION_49.md` | MOOSE seeding complete |

---

## 📝 Session 50 Notes

**Identified Gaps:**
1. Parent/Guardian Portal — 100% documented, 0% implemented
2. Enrollment Flow — Backend complete, frontend unverified
3. COPPA Compliance — Not implemented
4. Test Account Linkage — Accounts exist but orphaned

**Source Validation:**
- Removed 14 tasks already completed (avatar textures, Drizzle ORM, TTS paths, etc.)
- Consolidated from 31 → 23 actionable tasks
- Added 4 critical tasks from Session 50 gap analysis

---

**END OF DOCUMENT**

*This document should be updated after each session to track progress.*
