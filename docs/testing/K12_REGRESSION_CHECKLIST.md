# K-12 Dashboard Regression Checklist

**Version:** 1.2
**Created:** 2025-12-25 (Session 80)
**Updated:** 2025-12-26 (Session 81) - data-audience checks, inline style verification
**Updated:** 2025-12-27 (Session 82) - 9-12 career visibility policy (K-8 hide, 9-12 show)
**Purpose:** Prevent regressions in K-12 dashboard content hiding

---

## Before ANY Dashboard Changes

Run these checks with a K-12 test user:

### 1. K-12 User Detection

- [ ] Login as K-12 user (e.g., `k12test-session80@pmerit.com`)
- [ ] Open browser Developer Tools → Console
- [ ] Verify log shows:
  ```
  [DashboardAdapter] User:
    accountType: 'k12'
    gradeCode: '3' (or appropriate grade)
    uiType: 'childhood' (or appropriate tier)
    isMinor: true
  ```
- [ ] Verify log shows: `[DashboardAdapter] Career content hidden for K-12 user`
- [ ] No JavaScript errors in console

### 2. Visual Content Hiding

- [ ] Career Guidance card is NOT visible
- [ ] Career sidebar icon button is NOT visible (briefcase icon)
- [ ] Career nav section (#nav-career) is NOT visible when clicking other sections
- [ ] "Take Assessment" quick action hidden (for K-8)
- [ ] "Explore Pathways" quick action hidden (for K-8)

### 3. CSS Classes Applied

- [ ] Open Elements inspector
- [ ] Check `<body>` element has class `user-k12`
- [ ] Check `<body>` element has appropriate tier class (e.g., `ui-tier-elementary`)

### 4. Session 81: Data Attributes & Inline Styles

- [ ] Career Guidance card has `data-audience="adult"` attribute
- [ ] Career Guidance card has `style="display: none"` inline
- [ ] Learning Adventure card has `data-audience="k12"` attribute
- [ ] Learning Adventure card IS visible for K-12 users
- [ ] Console shows: `[DashboardAdapter] Hidden adult content: Career Guidance`
- [ ] Console shows: `[DashboardAdapter] Shown K-12 content: Learning Adventure`

### 5. K-12 Specific Features

- [ ] Grade badge appears next to username
- [ ] Navigation labels simplified for K-2 users

---

## Before ANY Auth Changes

### 1. API Response

- [ ] Call `/api/v1/auth/me` with valid token
- [ ] Response includes `accountType` field
- [ ] Response includes `gradeCode` field
- [ ] Response includes `isMinor` field
- [ ] Response includes `uiType` field

### 2. Frontend Storage

- [ ] Check `localStorage.getItem('pmerit_user')`
- [ ] Parsed JSON includes `accountType`
- [ ] Parsed JSON includes `gradeCode`
- [ ] Parsed JSON includes `isMinor`

---

## Before ANY Registration Changes

### K-12 Registration Flow

- [ ] Navigate to `/register-k12.html`
- [ ] Fill form with new test email
- [ ] Submit registration
- [ ] Check backend logs for profile creation
- [ ] Query database: `SELECT * FROM k12_student_profiles WHERE user_id = 'new-user-id'`
- [ ] Verify `grade_code` column populated
- [ ] Verify `parental_consent_status` = 'pending'

---

## High School (9-12) Verification - Session 82

9-12 students SEE career content (aspirational guidance):

- [ ] Login as 9-12 user (grade 9, 10, 11, or 12)
- [ ] Open browser Developer Tools → Console
- [ ] Verify log shows:
  ```
  [DashboardAdapter] User:
    accountType: 'k12'
    gradeCode: '9' (or 10, 11, 12)
    uiType: 'adolescence'
    isMinor: true
  ```
- [ ] Console shows: `[DashboardAdapter] 9-12 user: career content visible (aspirational)`
- [ ] Check `<body>` has classes: `user-k12`, `ui-tier-high`, `user-high-school`
- [ ] Career Guidance card IS visible
- [ ] Career sidebar icon IS visible
- [ ] Career nav section IS accessible
- [ ] Learning Adventure card IS visible (K-12 content still shown)

---

## Adult User Verification

Always verify adult users still see career content:

- [ ] Login as adult user
- [ ] Career Guidance card IS visible
- [ ] Career sidebar icon IS visible
- [ ] Career nav section IS accessible
- [ ] "Take Assessment" quick action IS visible
- [ ] "Explore Pathways" quick action IS visible
- [ ] Console shows: `[DashboardAdapter] Determined UI type: adult`

---

## Quick Debug Commands

### Check User in Console
```javascript
console.log(window.AUTH.getCurrentUser());
```

### Check Body Classes
```javascript
console.log(document.body.className);
```

### Force Refresh User Data
```javascript
await window.AUTH.fetchCurrentUser();
console.log(window.AUTH.getCurrentUser());
```

### Check Hidden Elements
```javascript
document.querySelectorAll('.hidden-for-k12').forEach(el => console.log(el));
```

---

## Test Accounts

| Email | Type | Grade | Password | Notes |
|-------|------|-------|----------|-------|
| k12test-session80@pmerit.com | K-12 | 3 | TestPass123! | Created before migration 019 |
| (create new) | K-12 | K | TestPass123! | Create for K-2 tier testing |
| (create new) | K-12 | 9 | TestPass123! | Create for high school testing |

---

## Files to Monitor

| File | Changes to Watch |
|------|------------------|
| `dashboard.html` | New cards, sections, quick actions |
| `dashboard-adapter.js` | Selector changes, detection logic |
| `components.css` | K-12 CSS rules (lines 2125+) |
| `auth.js` | User object structure |
| `auth.ts` (backend) | /auth/me response fields |

---

*Checklist Version: 1.2*
*Created: Session 80*
*Updated: Session 82*
