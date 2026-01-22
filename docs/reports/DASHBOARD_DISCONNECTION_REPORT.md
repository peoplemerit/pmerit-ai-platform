# PMERIT Dashboard Disconnection Report

**Report Date:** 2026-01-22
**Report Type:** Architecture Audit
**Prepared By:** Claude Code (Session 84)
**Status:** Findings Complete — Awaiting Resolution Decision

---

## Executive Summary

This report documents significant disconnections between PMERIT's documented dashboard architecture and its actual implementation. The platform currently maintains **11 separate dashboard files** (6 user-facing + 5 admin) when the architecture specifies a **single hybrid dashboard** with CSS-based adaptation.

**Critical Finding:** The K-12 dashboard routing completely bypasses the designed hybrid adapter system, rendering `dashboard-adapter.js` unused for its primary purpose.

---

## 1. Complete Dashboard Inventory

### 1.1 User-Facing Dashboards (6 files)

| # | File Path | Purpose | Target Users | Lines of Code |
|---|-----------|---------|--------------|---------------|
| 1 | `/dashboard.html` | Main hybrid dashboard | Adults (primary) | ~800 |
| 2 | `/portal/k12-dashboard-k2.html` | Kindergarten-Grade 2 | Ages 5-8 | ~600 |
| 3 | `/portal/k12-dashboard-35.html` | Grades 3-5 | Ages 8-11 | ~600 |
| 4 | `/portal/k12-dashboard-68.html` | Grades 6-8 | Ages 11-14 | ~600 |
| 5 | `/portal/k12-dashboard-912.html` | Grades 9-12 | Ages 14-18 | ~600 |
| 6 | `/portal/parent-dashboard.html` | Parent oversight | Parents/Guardians | ~500 |

### 1.2 Admin Dashboards (5 files)

| # | File Path | Purpose | Access Level |
|---|-----------|---------|--------------|
| 1 | `/admin/index.html` | Admin landing/overview | All admins |
| 2 | `/admin/tier1.html` | Tier 1 admin panel | Tier 1+ |
| 3 | `/admin/tier2.html` | Tier 2 admin panel | Tier 2 only |
| 4 | `/admin/security.html` | Security monitoring | Security team |
| 5 | `/admin/qa-telemetry.html` | QA & telemetry | QA team |

### 1.3 Supporting JavaScript (4 files)

| # | File Path | Purpose | Actually Used By |
|---|-----------|---------|------------------|
| 1 | `/assets/js/dashboard-adapter.js` | Adapts dashboard for K-12 | Adults only (broken) |
| 2 | `/assets/js/dashboard-courses.js` | Course management | dashboard.html |
| 3 | `/assets/js/auth.js` | Authentication + routing | All dashboards |
| 4 | `/assets/js/auth-modal.js` | Auth modal + routing | Signup/signin flows |

---

## 2. Architecture vs Implementation Comparison

### 2.1 Documented Architecture (K12_DASHBOARD_ARCHITECTURE.md v1.2.0)

**Design Decision:** DECISION-80-001 — Option C Hybrid Dashboard

```
INTENDED FLOW:

  All Users → Login → dashboard.html → dashboard-adapter.js
                                              │
                                              ▼
                                    ┌─────────────────────┐
                                    │ Check user type:    │
                                    │ - accountType       │
                                    │ - gradeCode         │
                                    │ - isMinor           │
                                    └─────────────────────┘
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                         .user-adult    .user-k12      .user-high-school
                              │               │               │
                              ▼               ▼               ▼
                         Show career    Hide career     Show career
                         content        content         (aspirational)
```

**Key mechanisms:**
- `data-audience="adult"` attribute hides content for K-12
- `data-audience="k12"` attribute shows K-12-specific content
- CSS rules on `body` class toggle visibility
- Single HTML file serves all user types

### 2.2 Actual Implementation

```
CURRENT FLOW:

  Adult Login ──────────────────────────────────────► /dashboard.html
                                                           │
                                                           ▼
                                                    dashboard-adapter.js
                                                    (works as designed)

  K-12 Login ──► auth.js getK12DashboardUrl() ──────► /portal/k12-dashboard-*.html
                        │                                   │
                        │                                   ▼
                        │                            (NO adapter runs)
                        │                            (Separate HTML file)
                        │
                        ├── gradeCode K,1,2  → k12-dashboard-k2.html
                        ├── gradeCode 3,4,5  → k12-dashboard-35.html
                        ├── gradeCode 6,7,8  → k12-dashboard-68.html
                        └── gradeCode 9-12   → k12-dashboard-912.html

  Parent Login ─────────────────────────────────────► /portal/parent-dashboard.html
                                                           │
                                                           ▼
                                                    (Completely separate)
```

### 2.3 Comparison Matrix

| Aspect | Documented | Implemented | Match |
|--------|------------|-------------|-------|
| Number of user dashboards | 1 (hybrid) | 6 (separate) | NO |
| K-12 routing | To dashboard.html | To portal/k12-dashboard-*.html | NO |
| Adapter usage | All users | Adults only | NO |
| Content duplication | None (CSS toggles) | High (separate files) | NO |
| Parent dashboard | Integrated | Separate file | NO |
| Admin dashboards | Not specified | 5 files exist | N/A |

---

## 3. Disconnection Details

### 3.1 DISCONNECTION-001: K-12 Routing Bypass

**Severity:** HIGH
**Location:** `assets/js/auth.js:607-624`, `assets/js/auth-modal.js:674-722`

**Description:**
The routing logic explicitly redirects K-12 users to separate dashboard files, completely bypassing the hybrid adapter system.

**Code Evidence (auth.js:607-624):**
```javascript
static getK12DashboardUrl(user) {
  if (user?.accountType === 'k12' || user?.isMinor) {
    const gradeCode = user.gradeCode;
    if (['K', '1', '2'].includes(gradeCode)) {
      return '/portal/k12-dashboard-k2.html';
    }
    if (['3', '4', '5'].includes(gradeCode)) {
      return '/portal/k12-dashboard-35.html';
    }
    if (['6', '7', '8'].includes(gradeCode)) {
      return '/portal/k12-dashboard-68.html';
    }
    if (['9', '10', '11', '12'].includes(gradeCode)) {
      return '/portal/k12-dashboard-912.html';
    }
  }
  // Falls through to dashboard.html
}
```

**Impact:**
- `dashboard-adapter.js` K-12 adaptation code is dead code
- K12_DASHBOARD_ARCHITECTURE.md is inaccurate documentation
- Duplicate HTML maintenance burden (6 files vs 1)
- Inconsistent feature deployment (changes must be made to multiple files)

---

### 3.2 DISCONNECTION-002: Unused Adapter System

**Severity:** MEDIUM
**Location:** `assets/js/dashboard-adapter.js`

**Description:**
The sophisticated adapter system with CSS class injection and content hiding is designed for K-12 users but they never reach `dashboard.html` where it runs.

**Designed Features (unused for K-12):**
- Body class injection: `.user-k12`, `.ui-tier-k2`, `.ui-tier-elementary`, etc.
- Career content hiding for K-8
- Career content showing for 9-12 (aspirational)
- `data-audience` attribute processing
- Triple-layer hiding (CSS + class + inline style)

**Impact:**
- Wasted engineering effort
- Misleading architecture documentation
- Potential confusion for future developers

---

### 3.3 DISCONNECTION-003: Parent Dashboard Isolation

**Severity:** MEDIUM
**Location:** `/portal/parent-dashboard.html`

**Description:**
The parent dashboard exists as a completely separate file with no integration to the hybrid system or connection to child dashboards.

**Missing Connections:**
- No link from child's K-12 dashboard to parent dashboard
- No shared components between parent and child views
- No real-time child activity feed
- No consent management flow integration

**Impact:**
- Parents cannot easily navigate to/from child's view
- Duplicate styling/component maintenance
- Incomplete parent oversight experience

---

### 3.4 DISCONNECTION-004: Duplicate Code Across K-12 Dashboards

**Severity:** MEDIUM
**Location:** `/portal/k12-dashboard-*.html` (4 files)

**Description:**
The four K-12 dashboard files contain significant code duplication with only minor grade-specific differences.

**Duplicated Elements:**
- Header/navigation structure
- Theme initialization script
- CSS imports
- Authentication checks
- Footer content
- JavaScript imports

**Estimated Duplication:** ~70% of code is identical across all 4 files

**Impact:**
- Bug fixes must be applied to 4 files
- Style changes require 4 updates
- Inconsistency risk when updates miss files
- Larger codebase to maintain

---

### 3.5 DISCONNECTION-005: Documentation Mismatch

**Severity:** HIGH
**Location:** `docs/architecture/K12_DASHBOARD_ARCHITECTURE.md`

**Description:**
The architecture document describes a system that does not match the implementation.

**Document Claims vs Reality:**

| Document States | Reality |
|-----------------|---------|
| "PMERIT uses a **single dashboard.html**" | 6 separate dashboard files exist |
| "dynamically adapts content based on user type" | K-12 users routed to separate files |
| Data flow shows adapter processing K-12 | K-12 never reaches adapter |
| CSS selectors for `.user-k12` on dashboard | K-12 users on different pages |

**Impact:**
- New developers misled by documentation
- Architecture decisions based on false assumptions
- Technical debt hidden by inaccurate docs

---

### 3.6 DISCONNECTION-006: Inconsistent Navigation Between Dashboards

**Severity:** LOW
**Location:** All dashboard files

**Description:**
Each dashboard type has different navigation structures with no clear way to switch between related views.

**Navigation Gaps:**
| From | To | Path Exists |
|------|-----|-------------|
| K-12 Dashboard | Parent Dashboard | NO |
| Parent Dashboard | Child's Dashboard | NO (view only) |
| Adult Dashboard | K-12 Dashboard | NO (not applicable) |
| Admin Dashboard | User Dashboards | NO |
| Any Dashboard | Admin Dashboard | NO (no link) |

---

### 3.7 DISCONNECTION-007: Routing Logic Duplication

**Severity:** LOW
**Location:** `auth.js`, `auth-modal.js`

**Description:**
K-12 dashboard routing logic is duplicated in two files with slightly different implementations.

**auth.js (lines 612-623):**
```javascript
if (['K', '1', '2'].includes(gradeCode)) {
  return '/portal/k12-dashboard-k2.html';
}
```

**auth-modal.js (lines 676-679):**
```javascript
if (grade <= 2) return '/portal/k12-dashboard-k2.html';
if (grade <= 5) return '/portal/k12-dashboard-35.html';
```

**Differences:**
- auth.js uses string matching: `['K', '1', '2'].includes(gradeCode)`
- auth-modal.js uses numeric comparison: `grade <= 2`
- Could produce different results for edge cases

---

## 4. Related Issues

### 4.1 Token Naming Inconsistency

**Issue:** K-12 files use `pmerit_token` while other files may use different token names.
**Recent Fix:** Commit `dea3eca` standardized to `pmerit_token`
**Status:** Resolved

### 4.2 Difficulty Level Type Error

**Issue:** `difficulty_level` returned as integer causing `.charAt()` error
**Recent Fix:** Commit `066ea70` handles integer type
**Status:** Resolved

### 4.3 Subject Card Parameter Passing

**Issue:** Subject cards not passing grade+subject parameters correctly
**Recent Fix:** Commit `f81ab20`
**Status:** Resolved

### 4.4 K-12 Signup Routing

**Issue:** K-12 signup/signin not using grade-based dashboard routing
**Recent Fix:** Commit `15b2939`
**Status:** Resolved

---

## 5. Impact Assessment

### 5.1 Development Impact

| Impact Area | Severity | Description |
|-------------|----------|-------------|
| Maintenance burden | HIGH | 6 files to update instead of 1 |
| Bug introduction risk | MEDIUM | Changes may miss some files |
| Onboarding difficulty | HIGH | New devs confused by architecture |
| Feature parity | MEDIUM | K-12 dashboards may lag behind |

### 5.2 User Experience Impact

| Impact Area | Severity | Description |
|-------------|----------|-------------|
| Parent-child navigation | MEDIUM | No easy switching |
| Consistency | LOW | Different dashboards may diverge |
| Performance | LOW | Separate files = no shared caching benefit |

### 5.3 Technical Debt

| Debt Item | Estimated Effort to Fix |
|-----------|------------------------|
| Unify to single dashboard | 16-24 hours |
| Remove dead adapter code | 2-4 hours |
| Update documentation | 4-8 hours |
| Add shared components | 8-12 hours |

---

## 6. Recommendations

### Option A: Unify (Recommended)

**Approach:** Route all users to `dashboard.html`, use adapter as originally designed

**Pros:**
- Matches documented architecture
- Single source of truth
- Easier maintenance
- Adapter system utilized

**Cons:**
- Significant refactoring
- Risk of regression
- Must preserve K-12 specific features

**Estimated Effort:** 16-24 hours

### Option B: Formalize Separation

**Approach:** Keep separate files, update documentation, remove unused adapter code

**Pros:**
- Minimal code changes
- Documents current reality
- Quick to implement

**Cons:**
- Maintains duplication
- Ongoing maintenance burden
- Admits architectural compromise

**Estimated Effort:** 4-8 hours

### Option C: Hybrid Component Approach

**Approach:** Keep separate dashboard files but extract shared components

**Pros:**
- Reduces duplication
- Maintains separation where needed
- Incremental improvement

**Cons:**
- Partial solution
- Still multiple files
- Component architecture overhead

**Estimated Effort:** 12-16 hours

---

## 7. File Reference

### All Dashboard-Related Files

```
pmerit-ai-platform/
├── dashboard.html                           # Main adult dashboard
├── portal/
│   ├── k12-dashboard-k2.html               # K-2 dashboard
│   ├── k12-dashboard-35.html               # Grades 3-5 dashboard
│   ├── k12-dashboard-68.html               # Grades 6-8 dashboard
│   ├── k12-dashboard-912.html              # Grades 9-12 dashboard
│   └── parent-dashboard.html               # Parent dashboard
├── admin/
│   ├── index.html                          # Admin landing
│   ├── tier1.html                          # Tier 1 admin
│   ├── tier2.html                          # Tier 2 admin
│   ├── security.html                       # Security dashboard
│   └── qa-telemetry.html                   # QA dashboard
├── assets/js/
│   ├── dashboard-adapter.js                # Hybrid adapter (underutilized)
│   ├── dashboard-courses.js                # Course management
│   ├── auth.js                             # Auth + K-12 routing
│   └── auth-modal.js                       # Auth modal + routing
└── docs/
    └── architecture/
        └── K12_DASHBOARD_ARCHITECTURE.md   # Architecture doc (outdated)
```

---

## 8. Next Steps

1. **Decide** on resolution approach (A, B, or C)
2. **Prioritize** based on current sprint/roadmap
3. **Create** implementation tasks in tracker
4. **Update** architecture documentation regardless of choice
5. **Test** thoroughly after any changes

---

## Appendix A: Routing Code Locations

### auth.js K-12 Routing (lines 607-624)

```javascript
static getK12DashboardUrl(user) {
  if (user?.accountType === 'k12' || user?.isMinor) {
    const gradeCode = user.gradeCode;
    if (['K', '1', '2'].includes(gradeCode)) {
      return '/portal/k12-dashboard-k2.html';
    }
    if (['3', '4', '5'].includes(gradeCode)) {
      return '/portal/k12-dashboard-35.html';
    }
    if (['6', '7', '8'].includes(gradeCode)) {
      return '/portal/k12-dashboard-68.html';
    }
    if (['9', '10', '11', '12'].includes(gradeCode)) {
      return '/portal/k12-dashboard-912.html';
    }
  }
}
```

### auth-modal.js K-12 Routing (lines 674-722)

```javascript
getK12DashboardUrl(user) {
  // Multiple routing logic paths exist here
  // Uses numeric grade comparison
  if (grade <= 2) return '/portal/k12-dashboard-k2.html';
  if (grade <= 5) return '/portal/k12-dashboard-35.html';
  if (grade <= 8) return '/portal/k12-dashboard-68.html';
  if (grade <= 12) return '/portal/k12-dashboard-912.html';
}
```

---

## Appendix B: Dashboard Adapter Intended Flow

From K12_DASHBOARD_ARCHITECTURE.md:

```
1. Check user.accountType, user.gradeCode, user.isMinor
2. If K-12 fields missing → fetch fresh data from /auth/me
3. Determine uiType from gradeCode
4. Add CSS classes to <body>:
   - .user-k12 or .user-adult
   - .user-high-school (for 9-12 students)
   - .ui-tier-k2 / .ui-tier-elementary / .ui-tier-middle /
     .ui-tier-high / .ui-tier-adult
5. Career visibility:
   - K-8: hideCareerContent() → hidden
   - 9-12: showCareerContent() → visible (aspirational)
6. Add .hidden-for-k12 class to matching elements (K-8 only)
7. CSS uses :not(.user-high-school) to exclude 9-12
```

---

*Report generated by Claude Code — Session 84*
*Repository: pmerit-ai-platform*
*Branch: claude/continue-pmerit-e2A8A*
