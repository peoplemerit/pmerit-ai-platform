---
role: copilot
task: frontend_audit_review
project: pmerit_platform
description: Review and audit Claude's frontend implementation for consistency, responsiveness, and code quality based on PMERIT design and theme guidelines.
---

# 🧮 Frontend Audit & Review Guide — GitHub Copilot Version

## 🎯 Objective
Audit and review the frontend files created by Claude for the **PMERIT Platform**.  

The frontend is based on `.copilot/blueprint-index.html` and `.copilot/Pmerit-theme_typography.html`.  

All code should reflect consistent branding, structure, and responsiveness across at least 28 pages.

---

## 🔍 Audit Scope

- **Structure:** File hierarchy, naming, and modularization
- **Code Quality:** Syntax, readability, and reusability
- **Responsiveness:** Cross-device adaptability and non-scrollable mobile design
- **UI Consistency:** Fonts, colors, header/footer uniformity
- **Functionality:** Working menus, modals, and chat interactivity
- **Accessibility:** Semantic HTML, alt text, ARIA labels, keyboard navigation

---

## 📁 Expected Directory Layout

```
project-root/
├── .copilot/                    # Configuration & reference files
│   ├── config.yml
│   ├── instructions.md
│   ├── hints/
│   ├── prompts/
│   ├── Pmerit-theme_typography.html
│   └── blueprint-index.html
│
├── .github/
│   └── workflows/
│       └── frontend-review.yml
│
├── assets/
│   ├── css/
│   │   ├── theme-variables.css
│   │   ├── base.css
│   │   ├── typography.css
│   │   ├── components.css
│   │   ├── mobile.css
│   │   └── desktop.css
│   ├── js/
│   │   ├── menu.js
│   │   ├── modal.js
│   │   ├── chat.js
│   │   └── main.js
│   └── img/
│
├── partials/
│   ├── header.html
│   ├── footer.html
│   ├── nav.html
│   └── body.html
│
├── index.html
├── INSTRUCTIONS_Claude.md
├── INSTRUCTIONS_Copilot.md
└── PROJECT_OVERVIEW.md
```

**Action:** Confirm this structure is followed. Flag redundant, misplaced, or unused files.

---

## 🧠 Audit Phases

### Phase 1 – Structural Review
**Goal:** Verify file organization and modularization

- [ ] Verify repo directory and file consistency
- [ ] Confirm all components are modular and properly imported
- [ ] Identify unused or duplicate assets
- [ ] Check for orphaned files (not linked anywhere)
- [ ] Ensure proper naming conventions (kebab-case for files)

**Output:** List of structural issues or ✅ if clean

---

### Phase 2 – Code Validation
**Goal:** Check syntax and coding standards

- [ ] Lint HTML, CSS, and JS (via GitHub Actions)
- [ ] Check for missing imports, broken links, and syntax errors
- [ ] Confirm no inline styles unless justified
- [ ] Verify CSS uses variables (no hardcoded #HEX colors)
- [ ] Check JavaScript uses const/let (no var)
- [ ] Ensure no console.log statements in production code

**Output:** List of code quality issues with line numbers

---

### Phase 3 – Responsiveness & Orientation
**Goal:** Test mobile-first and desktop layouts

- [ ] Test mobile layout (320px, 375px, 414px widths)
- [ ] Test tablet layout (768px, 834px widths)
- [ ] Test desktop layout (1024px, 1440px, 1920px widths)
- [ ] Validate orientation switching (portrait/landscape)
- [ ] Ensure non-scrollable mobile layout works as intended
- [ ] Check for horizontal scroll issues
- [ ] Verify safe-area-inset for iOS notch/home indicator
- [ ] Confirm dynamic viewport height (`dvh`) is used

**Output:** Responsive testing report with screenshots

---

### Phase 4 – Branding & Theming
**Goal:** Verify brand consistency

- [ ] Confirm all fonts come from `Pmerit-theme_typography.html`
  - Headings: Montserrat
  - Body: Inter
- [ ] Check colors match brand palette:
  - Primary: #2A5B8C (Dark Blue)
  - Secondary: #4AA4B9 (Teal)
  - Accent: #FF6B6B (Coral)
  - Success: #3A7F5C
  - Warning: #E67E22
- [ ] Verify CSS variables are used (not hardcoded colors)
- [ ] Check header/footer consistency across pages
- [ ] Ensure UI elements (buttons, menus, modals) follow PMERIT style

**Output:** Brand consistency report

---

### Phase 5 – Functional Audit
**Goal:** Test all interactive features

- [ ] Test Hamburger Menu (open/close, overlay, Escape key)
- [ ] Test Sign-in modal (open/close, form validation)
- [ ] Verify Settings features (Dark Mode, Text-to-Speech toggles)
- [ ] Test chat area behavior (prompt-response, auto-scroll)
- [ ] Ensure placeholders exist for:
  - Virtual Human Mode
  - Career Track & Explore Paths
  - Customer Service Mode
  - Preview Voices
  - Dashboard
  - Begin Assessment
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify focus trap in modals

**Output:** Functional testing checklist

---

## 🧾 Copilot Audit Checklist

### Structure & Organization
- [ ] Repo directory conforms to expected structure
- [ ] Files follow naming conventions (kebab-case)
- [ ] No orphaned or unused files
- [ ] Proper modularization (CSS/JS split)

### Code Quality
- [ ] Code validated (HTML/CSS/JS lint checks pass)
- [ ] No inline styles or inline scripts
- [ ] CSS uses variables (no hardcoded colors)
- [ ] JavaScript uses const/let (no var)
- [ ] No console.log in production code

### Responsive Design
- [ ] Mobile-first approach confirmed
- [ ] Safe-area-inset for iOS implemented
- [ ] Dynamic viewport height (dvh) used
- [ ] 44px minimum touch targets on mobile
- [ ] No horizontal scroll issues
- [ ] Orientation switching works properly

### Brand Consistency
- [ ] Header/footer consistent across devices
- [ ] Fonts match spec (Montserrat + Inter)
- [ ] Colors match brand standards
- [ ] Spacing follows 4px/8px grid

### Functionality
- [ ] Hamburger menu works correctly
- [ ] Modals open/close properly
- [ ] Chat interface scrolls correctly
- [ ] Toggle switches functional
- [ ] Keyboard navigation works

### Accessibility
- [ ] Semantic HTML elements used
- [ ] All images have alt text
- [ ] ARIA labels on interactive elements
- [ ] Focus states visible
- [ ] Heading hierarchy correct (no skipped levels)
- [ ] Contrast ratios meet WCAG AA

### Performance
- [ ] No redundant or conflicting CSS/JS files
- [ ] All links, imports, and assets load correctly
- [ ] Images optimized
- [ ] Scripts deferred where appropriate

---

## 🪶 Review Output Format

### Constructive Comments
```
🤖 Copilot Review: This button has a 36px height on mobile, 
which is below the 44px minimum touch target size. Consider 
increasing to at least 44px for better accessibility.

Location: assets/css/components.css, line 142
```

### Code Suggestions
```
🤖 Copilot Review: 

❌ Current:
.button { background: #2A5B8C; }

✅ Suggested:
.button { background: var(--primary); }

Reason: Use CSS variables for consistent theming.
Location: assets/css/components.css, line 89
```

### Severity Levels
- 🔴 **Critical:** Broken functionality, accessibility violation
- 🟠 **Warning:** Best practice violation, potential issue
- 🟡 **Info:** Suggestion for improvement
- ✅ **Pass:** Meets all standards

---

## 📌 Review Workflow

1. **Triggered by:** Push to `main/dev` or Pull Request
2. **GitHub Action runs:** `.github/workflows/frontend-review.yml`
3. **Copilot loads:** `.copilot/config.yml` and `.copilot/instructions.md`
4. **Review process:**
   - Run structural review
   - Execute lint checks
   - Test responsiveness
   - Verify branding
   - Check functionality
   - Audit accessibility
5. **Output:** Inline comments in PR + summary report
6. **Labels added:** `frontend`, `copilot-reviewed`, `needs-human-review`

---

## 🚫 What NOT to Review

Do **not** provide feedback on:
- Image files (`.jpg`, `.png`, `.svg`)
- Reference files in `.copilot/` folder
- Documentation files (`.md`)
- Configuration files (`.yml`, `.json`)
- Third-party libraries

---

## 🔄 Issue Coordination

### Creating GitHub Issues
When issues are found, create GitHub Issues with:
- **Title:** Clear, concise description
- **Labels:** `bug`, `enhancement`, `accessibility`, `responsive`, `frontend`
- **Description:**
  - What's wrong
  - Where it's located (file, line number)
  - Why it matters
  - Suggested fix (if applicable)
  - Screenshots (if visual issue)

### Example Issue
```markdown
## 🔴 Mobile Touch Target Too Small

**File:** `assets/css/components.css`
**Line:** 142

**Issue:** 
The `.menu-toggle` button has a height of 36px on mobile, which is 
below the 44px minimum touch target size recommended by WCAG guidelines.

**Impact:** 
Users with motor impairments may have difficulty tapping this button 
on mobile devices.

**Suggested Fix:**
```css
.menu-toggle {
  min-height: 44px;
  min-width: 44px;
}
```

**Labels:** `accessibility`, `mobile`, `critical`
```

---

## 🧭 Human Reviewer Handoff

After Copilot review is complete:
1. **Copilot posts** summary comment in PR
2. **Labels PR** with `copilot-reviewed` and `needs-human-review`
3. **Human reviewer:**
   - Verifies visual accuracy against design references
   - Tests UX flow and branding fidelity
   - Checks accessibility with screen readers
   - Confirms cross-browser compatibility
4. **Approval or request changes**
5. **Merge when all checks pass**

---

## ✅ Success Criteria

A file **passes review** when:
- ✅ All brand colors/fonts are consistent
- ✅ Responsive design works on 320px and 1920px screens
- ✅ No accessibility violations (WCAG AA)
- ✅ Clean, modular code structure
- ✅ No hardcoded values (uses CSS variables)
- ✅ Passes HTML/CSS/JS lint checks
- ✅ All functional features work correctly
- ✅ Mobile-first approach confirmed
- ✅ Safe-area-inset implemented for iOS
- ✅ 44px minimum touch targets on mobile

---

## 📚 Reference Documentation

- [.copilot/config.yml](.copilot/config.yml) – Copilot configuration
- [.copilot/instructions.md](.copilot/instructions.md) – Review instructions
- [.copilot/hints/html-style-guide.md](.copilot/hints/html-style-guide.md) – HTML standards
- [.copilot/hints/css-style-guide.md](.copilot/hints/css-style-guide.md) – CSS standards
- [.copilot/hints/js-structure-tips.md](.copilot/hints/js-structure-tips.md) – JS standards
- [Pmerit-theme_typography.html](.copilot/Pmerit-theme_typography.html) – Brand spec
- [blueprint-index.html](.copilot/blueprint-index.html) – Desktop layout reference

---

**Remember:** The goal is **constructive feedback** that maintains a clean, consistent, accessible codebase. Focus on actionable improvements that align with PMERIT brand standards and best practices.

**End of Copilot Instructions**
