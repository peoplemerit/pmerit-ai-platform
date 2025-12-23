# PMERIT Sign In / Sign Up Entry Points

**Version:** 1.0
**Created:** 2025-12-17
**Last Updated:** 2025-12-17
**Status:** IMPLEMENTED

---

## Overview

This document tracks all sign-in and sign-up entry points across the PMERIT platform, their implementation status, and how they work.

---

## Entry Points Summary

| Location | Button/Link | Action | Status |
|----------|-------------|--------|--------|
| index.html (desktop header) | Sign In | Opens AuthModal (signin tab) | WORKING |
| index.html (desktop header) | Start Learning | Opens AuthModal (signup tab) or Dashboard if auth | WORKING |
| index.html (mobile header) | Sign In | Opens AuthModal (signin tab) | WORKING |
| index.html (mobile header) | Start | Opens AuthModal (signup tab) or Dashboard if auth | WORKING |
| index.html (sidebar desktop) | Dashboard button | Opens AuthModal or goes to Dashboard | WORKING |
| index.html (sidebar mobile) | Dashboard button | Opens AuthModal or goes to Dashboard | WORKING |
| header.html partial | Sign In | Opens AuthModal or footer modal or redirects | WORKING |
| header.html partial | Start Learning | Opens AuthModal or footer modal or redirects | WORKING |
| header.html partial | Menu Sign In | Opens AuthModal or footer modal or redirects | WORKING |
| header.html partial | Dashboard (menu) | Opens AuthModal or goes to Dashboard | WORKING |
| signin.html | Sign up here link | Redirects to /?auth=signup | WORKING |
| signin.html | Sign In form | Calls AUTH.signin() | WORKING |

---

## Implementation Details

### 1. index.html (Homepage)

The homepage has its own implementation for auth buttons:

**Desktop Header:**
- `desktopSignInBtn` (#desktopSignInBtn) - Opens AuthModal (signin)
- `startLearningBtn` (#startLearningBtn) - Opens AuthModal (signup) or Dashboard

**Mobile Header:**
- `signInBtn` (#signInBtn) - Opens AuthModal (signin)
- `startLearningBtnMobile` (#startLearningBtnMobile) - Opens AuthModal (signup) or Dashboard

**Sidebar Dashboard Buttons:**
- `desktop-dashboard-btn` (#desktop-dashboard-btn) - Opens AuthModal (signin) if not auth, else Dashboard
- `mobile-dashboard-btn` (#mobile-dashboard-btn) - Opens AuthModal (signin) if not auth, else Dashboard

**Button Text Updates:**
- When authenticated: Dashboard buttons show "Dashboard"
- When not authenticated: Dashboard buttons show "Sign In to Dashboard"
- When authenticated: Sign In becomes "Sign Out", Start Learning becomes "Dashboard"

**Required Scripts (loaded in order):**
1. `assets/js/config.js`
2. `assets/js/auth.js`
3. `assets/js/auth-modal.js`

**Required Partials:**
- `partials/auth-modal.html` (loaded via fetch into #auth-modal-container)

---

### 2. Pages Using header.html Partial

Pages that use the layout-loader.js to load header.html partial:
- pricing.html
- about-us.html
- assessment-results.html
- course.html
- And other sub-pages

**Header Buttons:**
- `sign-in-btn` (#sign-in-btn) - Handled by layout-loader.js
- `start-learning-btn` (#start-learning-btn) - Handled by layout-loader.js
- `menu-sign-in` (#menu-sign-in) - Menu sign in button

**Auth Button Priority (layout-loader.js):**
1. `window.openSignInModal` / `window.openSignUpModal` - From footer modals
2. `window.AuthModal.open()` - If AuthModal is available
3. Redirect to `/signin.html` or `/?auth=signup` - Fallback

**Required Setup:**
- Body must have `data-layout-auto-init` attribute
- Include `layout-loader.js` in page
- Include `auth.js` for authentication checking

---

### 3. signin.html (Dedicated Sign In Page)

Standalone sign-in page with form-based authentication.

**Features:**
- Email/password form
- Password visibility toggle
- Error message display
- Loading state during submission
- Links to Sign Up (redirects to /?auth=signup)

**Required Scripts:**
- `assets/js/settings-manager.js`
- `assets/js/layout-loader.js`
- `assets/js/config.js`
- `assets/js/auth.js`

---

## Authentication Flow

### Sign In Flow
1. User clicks Sign In button
2. AuthModal opens (signin tab) OR footer modal opens OR redirect to signin.html
3. User enters email/password
4. AUTH.signin() is called
5. On success: Token stored, redirect to dashboard or saved URL
6. On failure: Error message displayed

### Sign Up Flow
1. User clicks Start Learning / Sign Up button
2. AuthModal opens (signup tab) OR footer modal opens OR redirect to /?auth=signup
3. User enters name, email, password
4. AUTH.signup() is called
5. On success: Token stored, redirect to account.html (may require email verification)
6. On failure: Error message displayed

---

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/auth/login` | POST | User sign in |
| `/api/v1/auth/register` | POST | User registration |
| `/api/v1/auth/logout` | POST | User logout |
| `/api/v1/auth/verify-email` | POST | Email verification |
| `/api/v1/auth/resend-verification` | POST | Resend verification email |
| `/api/v1/auth/forgot-password` | POST | Request password reset |
| `/api/v1/auth/reset-password` | POST | Reset password with code |

---

## Local Storage Keys

| Key | Purpose |
|-----|---------|
| `pmerit_token` | Authentication JWT token |
| `pmerit_user` | User data JSON (id, email, firstName, lastName, emailVerified) |
| `pmerit_auth_token` | Alternative token key (admin) |
| `pmerit_redirect_after_login` | URL to redirect after login (session storage) |
| `pmerit_pending_verification` | Email pending verification (session storage) |

---

## Session History

| Date | Changes |
|------|---------|
| 2025-12-17 | Initial documentation created |
| 2025-12-17 | Fixed Dashboard button text selector for desktop/mobile |
| 2025-12-17 | Fixed signin.html "Sign up here" link to redirect to /?auth=signup |
| 2025-12-17 | Added Start Learning button handler to layout-loader.js |

---

## Known Issues (Resolved)

1. **Dashboard button text not updating** - Fixed selector to handle different HTML structures for mobile vs desktop buttons
2. **signin.html "Sign up here" link broken** - Fixed href to redirect to /?auth=signup
3. **Start Learning button in header.html not wired** - Added handler in layout-loader.js

---

*Last Updated: 2025-12-17 (Session 59)*
