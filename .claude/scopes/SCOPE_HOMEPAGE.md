# PMERIT SUB-SCOPE: Homepage Gate

**Version:** 1.4
**Created:** 2025-12-12
**Last Updated:** 2025-12-12
**Status:** IN_PROGRESS
**Phase:** GATE (H1-H16)

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Homepage Production-Ready Gate |
| **Phase** | Homepage Gate (H1-H16) |
| **Primary File** | `index.html` (embedded header/footer) |
| **Related Partial** | `partials/header.html` (for other pages) |
| **JavaScript** | `auth-modal.js`, `config.js`, `language-modal.js` |
| **CSS** | `light-theme.css`, `mobile-mockup-match.css`, `components.css` |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| HP-001 | Layout | Google-style centered chatbox | Clean, AI-first | 27 |
| HP-002 | AI Receptionist | Claude/Llama via Workers AI | Always available | 29 |
| HP-003 | Auth Modal | Overlay modal | Seamless UX | 31 |
| HP-004 | Language System | Custom modal (133 languages) | Azure Translator | 27 |
| HP-005 | Header Layout | `[Language] [Pricing] [Donate] [Sign In] [Start Learning]` | BRAINSTORM PART 0 | 51 |
| HP-006 | About Link | "Read About" in chat controls | Avoid header clutter | 51 |
| HP-007 | Header Architecture | Homepage, Dashboard, Classroom have unique headers; other pages use partials | Different UX needs | 51 |

---

## 3. FEATURE SPECIFICATION

### 3.1 Header Architecture

| Page Type | Header Source | Notes |
|-----------|---------------|-------|
| **Homepage** (`index.html`) | Embedded in file | Unique AI-first design |
| **Dashboard/Account** (`portal/*.html`) | Embedded | Logged-in user focus |
| **Classroom** (`portal/classroom.html`) | Embedded | Learning focus, minimal |
| **Other Pages** (pricing, courses, donate) | `partials/header.html` | Shared standard |

### 3.2 Required Header Layout (All Headers)

**Desktop:**
```
[PMERIT Logo]    [🌐 Language] [Pricing] [Donate] [Sign In] [Start Learning]
```

**Visual Hierarchy:**
| Element | Style | Color |
|---------|-------|-------|
| Start Learning | Primary filled | Blue (#3B82F6) |
| Donate | Outline | White border |
| Sign In | Ghost/text | White |
| Pricing | Text link | White |
| Language | Icon + text | White |

### 3.3 Auth State Behavior

| User State | "Sign In" Shows | "Start Learning" Shows |
|------------|-----------------|------------------------|
| **Guest** | "Sign In" → opens auth modal (sign-in tab) | "Start Learning" → opens auth modal (sign-up tab) |
| **Authenticated** | "Sign Out" → logs out user | "Start Learning" → navigates to Dashboard |

### 3.4 Left Sidebar Styling

| Button | Text Color | Background |
|--------|------------|------------|
| Dashboard | White | Blue (#3B82F6) |
| Customer Service Mode | White | Dark gray (#374151) |

---

## 4. IMPLEMENTATION STATUS

### Session 51 — 2025-12-12

**Analysis Complete:**
- index.html has embedded desktop header at lines ~220-230
- index.html has embedded mobile header at lines ~80-95
- partials/header.html used by other pages (also needs update)

**Current State (from screenshot):**
| Element | Status | Notes |
|---------|--------|-------|
| Language button | ✅ | Shows "English" |
| Pricing | ✅ | White text, correct |
| Donate | ❌ | **MISSING** |
| Sign In | ✅ | Present, needs toggle logic |
| Start Learning | ⚠️ | Present, needs ID and handler |
| Customer Service Mode | ✅ | White text now |

---

## 5. GAP SUMMARY

| # | Gap | File | Priority |
|---|-----|------|----------|
| G1 | Donate button missing | `index.html` (desktop header) | Critical |
| G2 | Donate button missing | `index.html` (mobile menu) | Critical |
| G3 | Donate button missing | `partials/header.html` | Critical |
| G4 | Start Learning no handler | `index.html` | High |
| G5 | Sign In → Sign Out toggle | `index.html` | High |
| G6 | Sign In → Sign Out toggle | `partials/header.html` | High |
| G7 | Language modal empty | `language-modal.js` | Low |

---

## 6. VERIFICATION CHECKLIST

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| H1 | No console errors | ✅ | Browser |
| H2 | Google-style design | ✅ | Visual |
| H3 | AI chatbox functional | ✅ | Streaming works |
| H4 | Left panel styling | ✅ | CS Mode white text |
| H5 | Auth modal triggers | ⚠️ | Sign In works, Start Learning needs wire |
| H6 | Customer Service Mode | ✅ | Works |
| H7 | Language system | ❌ | "No languages found" |
| H8 | Header complete | ❌ | Missing Donate |
| H9 | Mobile responsive | ✅ | Hamburger works |
| H10 | No broken assets | ✅ | All load |
| H11 | Donate in header | ❌ | Not present |
| H12 | Pricing white text | ✅ | Correct |
| H13 | Start Learning → auth | ⚠️ | Needs handler |
| H14 | Sign In ↔ Sign Out | ❌ | No toggle |
| H15 | Unified hover states | ✅ | Looks consistent |
| H16 | partials/header.html updated | ❌ | Needs same fixes |

**Gate Status: 10/16 — IN PROGRESS**

---

## 7. IMPLEMENTATION TASKS

### TASK 1: Add Donate to index.html Desktop Header
**File:** `index.html`
**Location:** Desktop header nav (~line 225)

**FIND:**
```html
<a href="pricing.html" class="nav-btn">Pricing</a>
<button class="nav-btn" id="desktopSignInBtn" data-i18n="common.signIn">Sign In</button>
```

**REPLACE WITH:**
```html
<a href="pricing.html" class="nav-btn">Pricing</a>
<a href="donate.html" class="nav-btn donate-btn">Donate</a>
<button class="nav-btn" id="desktopSignInBtn" data-i18n="common.signIn">Sign In</button>
```

---

### TASK 2: Add ID to Start Learning Button
**File:** `index.html`
**Location:** Desktop header nav (~line 228)

**FIND:**
```html
<button class="nav-btn primary" data-i18n="header.startLearning">Start Learning</button>
```

**REPLACE WITH:**
```html
<button class="nav-btn primary" id="desktopStartLearningBtn" data-i18n="header.startLearning">Start Learning</button>
```

---

### TASK 3: Wire Start Learning Click Handler
**File:** `index.html`
**Location:** Inside inline script (~line 460, in initAuthButtons function)

**ADD after signInButtons.forEach block:**
```javascript
// Wire Start Learning button
const startLearningBtn = document.getElementById('desktopStartLearningBtn');
if (startLearningBtn) {
  startLearningBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (window.AuthModal) {
      window.AuthModal.open('signup');
    } else {
      window.location.href = '/signin.html';
    }
  });
}
```

---

### TASK 4: Add Auth State Toggle
**File:** `index.html`
**Location:** After initAuthButtons function

**ADD new function:**
```javascript
// Update header based on auth state
function updateHeaderAuthState() {
  const isAuth = window.AUTH && window.AUTH.isAuthenticated();
  
  // Desktop buttons
  const desktopSignIn = document.getElementById('desktopSignInBtn');
  const desktopStartLearning = document.getElementById('desktopStartLearningBtn');
  
  // Mobile button
  const mobileSignIn = document.getElementById('signInBtn');
  
  if (isAuth) {
    // User is logged in
    if (desktopSignIn) {
      desktopSignIn.textContent = 'Sign Out';
      desktopSignIn.onclick = function(e) {
        e.preventDefault();
        if (window.AUTH) window.AUTH.logout();
        location.reload();
      };
    }
    if (desktopStartLearning) {
      desktopStartLearning.textContent = 'Dashboard';
      desktopStartLearning.onclick = function(e) {
        e.preventDefault();
        window.location.href = '/portal/dashboard.html';
      };
    }
    if (mobileSignIn) {
      mobileSignIn.textContent = 'Sign Out';
      mobileSignIn.onclick = function(e) {
        e.preventDefault();
        if (window.AUTH) window.AUTH.logout();
        location.reload();
      };
    }
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', updateHeaderAuthState);

// Also call when auth state changes
window.addEventListener('auth-state-changed', updateHeaderAuthState);
```

---

### TASK 5: Add Donate to Mobile Menu
**File:** `index.html`
**Location:** Mobile hamburger menu, Quick Actions section (~line 165)

**FIND:**
```html
<a href="pricing.html" class="menu-item" id="pricing-btn">
  <span class="menu-icon">💰</span>
  <span class="menu-text">Pricing</span>
  <i class="fas fa-chevron-right menu-arrow"></i>
</a>
```

**ADD AFTER:**
```html
<a href="donate.html" class="menu-item" id="donate-btn">
  <span class="menu-icon">❤️</span>
  <span class="menu-text">Donate</span>
  <i class="fas fa-chevron-right menu-arrow"></i>
</a>
```

---

### TASK 6: Update partials/header.html
**File:** `partials/header.html`
**Location:** header-right section (~line 20)

**FIND:**
```html
<a href="pricing.html" class="header-btn pricing-link desktop-only">Pricing</a>
```

**ADD AFTER:**
```html
<a href="donate.html" class="header-btn donate-link desktop-only">Donate</a>
```

**ALSO FIND:**
```html
<a href="/signin.html" class="btn-sign-in" id="sign-in-btn">Sign In</a>
```

**REPLACE WITH:**
```html
<button class="btn-sign-in" id="sign-in-btn" data-action="open-auth-signin">Sign In</button>
<button class="btn-start-learning" id="start-learning-btn" data-action="open-auth-signup">Start Learning</button>
```

---

### TASK 7: Add CSS for Donate Button
**File:** `assets/css/light-theme.css` or `assets/css/components.css`

**ADD:**
```css
/* Donate button - outline style */
.nav-btn.donate-btn,
.header-btn.donate-link {
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #ffffff;
  background: transparent;
  transition: background 0.2s ease;
}

.nav-btn.donate-btn:hover,
.header-btn.donate-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Start Learning button for partials/header.html */
.btn-start-learning {
  background-color: #3B82F6;
  color: #ffffff;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-start-learning:hover {
  background-color: #2563EB;
}
```

---

## 8. QUICK COMMANDS

| Command | Action |
|---------|--------|
| `SCOPE: HOMEPAGE` | Switch active scope |
| `SCOPE STATUS` | Show checklist |
| `SCOPE COMPLETE` | Mark done |

---

## 9. FILES TO MODIFY (Execution Order)

| # | File | Tasks | Priority |
|---|------|-------|----------|
| 1 | `index.html` | Tasks 1-5 (Donate, Start Learning ID, handlers, auth toggle, mobile menu) | Critical |
| 2 | `partials/header.html` | Task 6 (Donate, Start Learning for other pages) | Critical |
| 3 | `assets/css/light-theme.css` | Task 7 (Donate button styles) | High |

---

## 10. TEST VERIFICATION

After implementation:

1. ✅ **Homepage header:** `[Language] [Pricing] [Donate] [Sign In] [Start Learning]`
2. ✅ **Donate** = outline button, navigates to donate.html
3. ✅ **Start Learning** = blue button, opens auth modal (sign-up tab)
4. ✅ **Sign In** = opens auth modal (sign-in tab)
5. ✅ **After login:** Sign In → "Sign Out", Start Learning → "Dashboard"
6. ✅ **Mobile menu** includes Donate
7. ✅ **Other pages** (pricing.html, courses.html) also have updated header

---

*Last Updated: 2025-12-12 by Claude Web (Session 51 - Final Specification)*
```

---

## 🎯 CLAUDE CODE PROMPT — TASK 1 & 2 (index.html Desktop Header)

Copy this to Claude Code:
```
SCOPE: HOMEPAGE — TASK 1 & 2

Fix the desktop header in index.html to add Donate button and wire Start Learning.

FILE: E:\pmerit\pmerit-ai-platform\index.html

TASK 1: Add Donate button to desktop header nav

FIND (around line 225 in the desktop-layout header-nav):
```html
<a href="pricing.html" class="nav-btn">Pricing</a>
<button class="nav-btn" id="desktopSignInBtn" data-i18n="common.signIn">Sign In</button>
```

REPLACE WITH:
```html
<a href="pricing.html" class="nav-btn">Pricing</a>
<a href="donate.html" class="nav-btn donate-btn">Donate</a>
<button class="nav-btn" id="desktopSignInBtn" data-i18n="common.signIn">Sign In</button>
```

TASK 2: Add ID to Start Learning button

FIND (around line 228):
```html
<button class="nav-btn primary" data-i18n="header.startLearning">Start Learning</button>
```

REPLACE WITH:
```html
<button class="nav-btn primary" id="desktopStartLearningBtn" data-i18n="header.startLearning">Start Learning</button>
```

OUTPUT: Show the modified header-nav section, then say DONE.