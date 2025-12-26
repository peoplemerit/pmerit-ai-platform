# K-12 Dashboard Architecture

**Version:** 1.0.0
**Created:** 2025-12-25 (Session 81)
**Decision:** DECISION-80-001 (Option C Hybrid Dashboard)

---

## Overview

PMERIT uses a **single dashboard.html** that dynamically adapts content based on user type. This document specifies the technical architecture for K-12 content hiding.

---

## 1. Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         K-12 DASHBOARD DATA FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐   ┌─────────────┐ │
│  │   User      │   │  auth.js    │   │ auth-check.js   │   │ dashboard-  │ │
│  │   Login     │──▶│  signin()   │──▶│ fetchCurrent    │──▶│ adapter.js  │ │
│  │             │   │             │   │ User()          │   │ init()      │ │
│  └─────────────┘   └─────────────┘   └─────────────────┘   └──────┬──────┘ │
│                                                                    │        │
│                                        ┌───────────────────────────┘        │
│                                        ▼                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │                    DASHBOARD ADAPTER FLOW                              ││
│  │                                                                        ││
│  │  1. Check user.accountType, user.gradeCode, user.isMinor              ││
│  │  2. If K-12 fields missing → fetch fresh data from /auth/me           ││
│  │  3. Determine uiType from gradeCode                                   ││
│  │  4. Add CSS classes to <body>:                                        ││
│  │     - .user-k12 or .user-adult                                        ││
│  │     - .ui-tier-k2 / .ui-tier-elementary / .ui-tier-middle /           ││
│  │       .ui-tier-high / .ui-tier-adult                                  ││
│  │  5. Call hideCareerContent() for K-12 users                           ││
│  │  6. Add .hidden-for-k12 class to matching elements                    ││
│  │  7. CSS rules apply display:none                                      ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. HTML Element Targeting

### 2.1 Elements with Data Attributes (Preferred)

```html
<!-- Career Guidance Card -->
<div class="dashboard-card" data-content-type="career" data-min-age="14">
  <h3><i class="fas fa-briefcase"></i> Career Guidance</h3>
  ...
</div>
```

**CSS Selector:** `[data-content-type="career"]`

### 2.2 Sidebar Navigation

```html
<!-- Career Icon Button -->
<button class="icon-sidebar-item" data-section="career" aria-label="Career">
  <i class="fas fa-briefcase"></i>
</button>

<!-- Career Nav Section -->
<div class="nav-section" id="nav-career">
  <h2 class="nav-section-title">Career</h2>
  ...
</div>
```

**CSS Selectors:**
- `.icon-sidebar-item[data-section="career"]`
- `#nav-career`

### 2.3 Quick Action Cards

```html
<a href="/assessment-entry.html" class="quick-action-card">
  <i class="fas fa-clipboard-check"></i>
  <span>Take Assessment</span>
</a>
```

**JS Fallback Detection:** Cards with text containing "Assessment" or "Pathway"

---

## 3. JavaScript Selectors (dashboard-adapter.js)

```javascript
K12_HIDDEN_SELECTORS: [
  '#nav-career',                                  // Career nav section
  '.icon-sidebar-item[data-section="career"]',   // Career sidebar button
  '[data-content-type="career"]',                // Data attribute targeting
  '.dashboard-card:has(.fa-briefcase)',          // Fallback for older browsers
  '[href="assessment-entry.html"]',              // Career Assessment links
  '.career-assessment-cta',                      // Career assessment CTAs
  '.career-guidance-section',                    // Career guidance sections
  '.learner-journey-map'                         // Adult learner journey
]
```

---

## 4. CSS Rules (components.css)

```css
/* Hide career content for K-12 users */
.user-k12 .hidden-for-k12,
body.user-k12 #nav-career,
body.user-k12 .icon-sidebar-item[data-section="career"],
body.user-k12 [data-content-type="career"] {
  display: none !important;
}

/* K-12 visible content */
.visible-for-k12 {
  display: block;
}

/* Hide K-12 specific content for adults */
.user-adult .visible-for-k12,
.user-adult .k12-learning-section,
.user-adult .parent-oversight-notice {
  display: none !important;
}
```

---

## 5. API Response (/auth/me)

```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "student@example.com",
    "firstName": "Johnny",
    "lastName": "Student",
    "role": "user",
    "subscriptionTier": "basic",
    "emailVerified": true,
    "isMinor": true,
    "accountType": "k12",
    "gradeCode": "3",
    "uiType": "childhood",
    "personaOverride": null
  }
}
```

### Field Derivation Logic

| Field | Source | Logic |
|-------|--------|-------|
| `accountType` | k12_student_profiles.exists | 'k12' if profile exists, else 'adult' |
| `gradeCode` | k12_student_profiles.grade_code | Direct column value |
| `uiType` | k12_student_profiles.ui_type OR derived | If null, derive from gradeCode |
| `isMinor` | users.is_minor | Boolean flag set during K-12 registration |

### uiType Derivation

```javascript
if (gradeCode === 'K' || gradeCode <= 2) uiType = 'early_childhood';
else if (gradeCode >= 3 && gradeCode <= 5) uiType = 'childhood';
else if (gradeCode >= 6 && gradeCode <= 8) uiType = 'early_adolescence';
else if (gradeCode >= 9 && gradeCode <= 12) uiType = 'adolescence';
```

---

## 6. Database Schema

### users table

```sql
is_minor BOOLEAN DEFAULT FALSE
```

### k12_student_profiles table

```sql
user_id UUID REFERENCES users(id)
grade_code VARCHAR(5)              -- 'K', '1', '2', ... '12'
date_of_birth DATE
ui_type VARCHAR(50)                -- 'early_childhood', 'childhood', etc.
parent_guardian_email VARCHAR(255)
parental_consent_status VARCHAR(20) DEFAULT 'pending'
persona_override VARCHAR(50)       -- Optional: override default persona
```

---

## 7. File Reference

| File | Purpose |
|------|---------|
| `dashboard.html` | Main dashboard with data attributes |
| `assets/js/dashboard-adapter.js` | User detection, class application |
| `assets/js/auth.js` | User storage, fetchCurrentUser |
| `assets/js/auth-check.js` | Protected route, triggers fetch |
| `assets/css/components.css` | K-12 CSS rules (lines 2125-2205) |
| `pmerit-api-worker/src/routes/auth.ts` | /auth/me endpoint |

---

## 8. Adding New Career Content

When adding new career-focused content to the dashboard:

1. **Add data attribute:**
   ```html
   <div data-content-type="career" data-min-age="14">
     <!-- Your career content -->
   </div>
   ```

2. **CSS will automatically hide it** for K-12 users via:
   ```css
   body.user-k12 [data-content-type="career"] { display: none !important; }
   ```

3. **If element has no data attribute**, add selector to `K12_HIDDEN_SELECTORS` array in `dashboard-adapter.js`

---

## 9. Regression Testing

Before any dashboard changes:

### K-12 User Test (e.g., k12test@pmerit.com, Grade 3)

1. Open browser console
2. Check logs for:
   ```
   [DashboardAdapter] User:
     accountType: 'k12'
     gradeCode: '3'
     uiType: 'childhood'
     isMinor: true
   [DashboardAdapter] Determined UI type: childhood
   [DashboardAdapter] Applied classes: ui-tier-elementary user-k12
   [DashboardAdapter] Career content hidden for K-12 user
   ```
3. Verify visually:
   - Career Guidance card NOT visible
   - Career sidebar button NOT visible
   - Career nav section NOT visible

### Adult User Test

1. Open browser console
2. Check logs for:
   ```
   [DashboardAdapter] User:
     accountType: 'adult' (or undefined)
   [DashboardAdapter] Determined UI type: adult
   [DashboardAdapter] Applied classes: ui-tier-adult user-adult
   ```
3. Verify visually:
   - All career content IS visible

---

## 10. Troubleshooting

### Issue: K-12 fields show as undefined

**Cause:** User logged in before Session 80 changes, cached data doesn't have K-12 fields

**Solution:** Dashboard adapter now auto-fetches fresh data when K-12 fields are missing

### Issue: Career content still visible for K-12 user

**Causes:**
1. CSS not loaded (check network tab)
2. `user-k12` class not on body (check Elements inspector)
3. Element doesn't match any selector

**Debug:** Check console for `[DashboardAdapter]` logs

### Issue: New K-12 registration doesn't create profile

**Cause:** Schema mismatch - Migration 019 must be run

**Solution:** Run migration in Neon SQL Editor:
```sql
ALTER TABLE k12_student_profiles
ADD COLUMN IF NOT EXISTS grade_code VARCHAR(5),
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS parent_guardian_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS parental_consent_status VARCHAR(20) DEFAULT 'pending';
```

---

*Document Version: 1.0.0*
*Created: Session 81 (2025-12-25)*
*Author: Claude Code*
