# GAP REPORT: K-12 Registration & Dashboard Flow

**Report ID:** GAP-2025-12-24-K12-001
**Date:** December 24, 2025
**Session:** 77
**Scope:** SCOPE_K12_EDUCATION (Phase 4 - Age-Appropriate UI)
**Conducted By:** Visual Walkthrough Protocol
**Scenario:** Parent registering 8-year-old child (Grade 3)

---

## Executive Summary

A comprehensive visual walkthrough of the K-12 student registration flow revealed **24 gaps** ranging from critical COPPA compliance issues to UI/UX improvements. The core finding: **there is no path from registration to K-12 student profile creation to age-appropriate dashboard**. All infrastructure exists (database tables, API routes, dashboards) but the frontend registration flow does not support K-12 users.

### Gap Severity Distribution
| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 14 | Blocks K-12 functionality entirely |
| 🟡 Medium | 6 | Affects user experience significantly |
| 🟢 Low/Info | 4 | Minor issues or informational notes |

---

## Gap Registry

### Security & Compliance Gaps

| ID | Category | Description | Severity | COPPA Impact |
|----|----------|-------------|----------|--------------|
| GAP-1 | Security | Auto-login persisted from previous day - session should expire after reasonable time (24h max) | 🔴 High | Yes - child could access without parent present |
| GAP-11 | Security | Verification code shown in UI "(Dev code: 449121)" - must be hidden in production | 🔴 High | No |
| GAP-12 | COPPA | Verification email sent TO child ("Welcome, TestChild!") - for minors, email must go to PARENT | 🔴 Critical | Yes - direct contact with minor |

### Registration Flow Gaps (Critical Path)

| ID | Category | Description | Severity | Impact |
|----|----------|-------------|----------|--------|
| GAP-3 | K-12 UX | No visible "Sign up for K-12" or "Parent Registration" path on homepage | 🔴 High | Parents can't find K-12 registration |
| GAP-4 | K-12 Critical | No "Account Type" selector (Adult Learner / K-12 Student / Parent registering child) | 🔴 Critical | No way to indicate child account |
| GAP-5 | K-12 Critical | No Date of Birth field (required for COPPA - must know if user is under 13) | 🔴 Critical | COPPA violation |
| GAP-6 | K-12 Critical | No Grade Level selection during registration | 🔴 Critical | Can't assign age-appropriate UI |
| GAP-7 | K-12 Critical | No Parent/Guardian Email field for minor accounts | 🔴 Critical | No parental consent path |
| GAP-14 | K-12 Critical | No K-12 profile created during registration - user never asked for DOB or Grade | 🔴 Critical | K-12 features inaccessible |
| GAP-16 | K-12 Critical | No onboarding flow to SET UP K-12 profile after registration | 🔴 Critical | No recovery path |

### Post-Registration Flow Gaps

| ID | Category | Description | Severity | Impact |
|----|----------|-------------|----------|--------|
| GAP-9 | UX Flow | After registration, auto-switched to Sign In instead of guiding to verify email | 🟡 Medium | Confusing UX |
| GAP-10 | UX | Sign In form auto-filled with different email from browser | 🟢 Low | Minor confusion |
| GAP-17 | UX | User can access dashboard without email verification | 🟡 Medium | Security consideration |

### Dashboard Gaps (Age-Appropriate UI)

| ID | Category | Description | Severity | Impact |
|----|----------|-------------|----------|--------|
| GAP-13 | K-12 Critical | Generic ADULT dashboard shown to child - no age-appropriate UI routing | 🔴 Critical | Wrong experience entirely |
| GAP-15 | K-12 Critical | "Take Career Assessment" shown to 8-year-old - inappropriate content | 🔴 High | Adult content for child |
| GAP-18 | K-12 Critical | "Career Guidance" and "Career Assessment" on dashboard - inappropriate for 8-year-old | 🔴 Critical | Adult content |
| GAP-19 | K-12 Critical | Complex adult UI with small text - not age-appropriate for K-5 | 🔴 Critical | Accessibility issue |
| GAP-20 | K-12 Critical | "Learner Journey Map" is career-focused timeline - wrong for elementary | 🔴 High | Wrong content |
| GAP-21 | K-12 Critical | No XP, stars, levels, adventures, or gamification for Grade 3 student | 🔴 Critical | Missing K-12 features |
| GAP-22 | K-12 Missing | No Mr. Explorer persona greeting (should say "Hey Explorer!") | 🔴 High | Missing persona integration |

### UI/UX General Gaps

| ID | Category | Description | Severity | Impact |
|----|----------|-------------|----------|--------|
| GAP-2 | UI | Homepage shows scrollbar but page should be non-scrollable (fixed viewport) | 🟡 Medium | Visual polish |
| GAP-8 | UI | Modal shows scrollbar on right edge | 🟡 Medium | Visual polish |

### Positive Notes (Infrastructure Exists)

| ID | Category | Description | Status |
|----|----------|-------------|--------|
| GAP-23 | Info | "Settings & Profile" mentions "Parental/teacher oversight for minors" | Feature planned, not activated |
| GAP-24 | Info | "Accessibility" mentions "COPPA compliant" parental controls | Feature planned, not implemented |

---

## Root Cause Analysis

### The Core Problem

```
CURRENT FLOW (Broken):
┌──────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│  Homepage    │ → │  Registration   │ → │  Generic Acct   │ → │  Adult Dashboard │
│              │    │  (No K-12 opt)  │    │  (No K-12 prof) │    │  (Career focus)  │
└──────────────┘    └─────────────────┘    └─────────────────┘    └──────────────────┘
                           ↑
                   No DOB, No Grade, No Parent Email
                   No K-12 profile created
                   No age-appropriate routing


REQUIRED FLOW:
┌──────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│  Homepage    │ → │  "Who is this   │ → │  K-12 Details   │ → │  Parent Consent  │
│  (K-12 CTA)  │    │   account for?" │    │  (DOB, Grade)   │    │  Email Flow      │
└──────────────┘    └─────────────────┘    └─────────────────┘    └──────────────────┘
                                                                           │
                    ┌─────────────────┐    ┌─────────────────┐            │
                    │ Age-Appropriate │ ← │  K-12 Profile   │ ←──────────┘
                    │   Dashboard     │    │  Created        │
                    │ (k12-dash-35)   │    │  (is_minor=true)│
                    └─────────────────┘    └─────────────────┘
```

### What We Built vs What's Missing

| Component | Built? | Connected? |
|-----------|--------|------------|
| K-12 Database Tables (k12_student_profiles, grade_levels) | ✅ Yes | ❌ No registration creates profiles |
| Age-Appropriate Dashboards (k12-dashboard-k2/35/68/912.html) | ✅ Yes | ❌ No routing logic to use them |
| K12 API Routes (/api/v1/users/:id/k12/progress) | ✅ Yes | ❌ No frontend calls them for routing |
| Parent Portal Backend (parent.ts routes) | ✅ Yes | ❌ No frontend parent consent flow |
| AI Personas (Ms. Sunshine, Mr. Explorer, etc.) | ✅ Yes | ❌ No dashboard uses them |
| /auth/me returns gradeCode, uiType | ✅ Yes | ❌ No frontend uses these for routing |

---

## Recommended Fixes (Priority Order)

### P0 - Critical (Must Fix Before K-12 Launch)

1. **Add Account Type Selection to Registration**
   - Add radio: "I'm an adult learner" / "I'm registering a child (K-12)"
   - Show different form fields based on selection

2. **Add K-12 Registration Fields**
   - Date of Birth (calculate age for COPPA)
   - Grade Level dropdown (K, 1, 2, ... 12)
   - Parent/Guardian Email (required for minors)

3. **Create K-12 Profile on Registration**
   - When child account created:
     - Set `is_minor = true` in users table
     - Create `k12_student_profiles` record
     - Set `ui_type` based on grade span
     - Trigger parent consent flow

4. **Implement Dashboard Routing**
   - On login, check `gradeCode` from /auth/me
   - Route to appropriate dashboard:
     - K-2 → k12-dashboard-k2.html
     - 3-5 → k12-dashboard-35.html
     - 6-8 → k12-dashboard-68.html
     - 9-12 → k12-dashboard-912.html
     - Adult → dashboard.html

5. **Parent Consent Flow**
   - Send consent email to parent, not child
   - Block child access until parent consents
   - Use existing parent.ts routes

### P1 - High Priority

6. **Session Expiration** - Implement 24h max session for security
7. **Hide Dev Code** - Remove verification code from production UI
8. **Email Routing** - Send verification to parent for minor accounts

### P2 - Medium Priority

9. **Fix Scrollbar Issues** - CSS fixes for homepage and modal
10. **Improve Post-Registration Flow** - Guide to email verification

---

## Appendix: Walkthrough Screenshots

| Step | Screenshot | Observation |
|------|------------|-------------|
| 1 | Homepage (logged out) | No K-12 specific CTA visible |
| 2 | Registration modal | Generic form, no K-12 options |
| 3 | Account created | Dev code visible, auto-switch to sign in |
| 4 | Verification email | Sent to "child", should go to parent |
| 5 | Account page | Generic adult view |
| 6 | Dashboard | Full adult dashboard with career focus |

---

## Sign-Off

- [ ] Reviewed by: _______________
- [ ] Approved for implementation: _______________
- [ ] Target Sprint: _______________

---

*Generated by AADOS Visual Walkthrough Protocol*
*Session 77 - December 24, 2025*
