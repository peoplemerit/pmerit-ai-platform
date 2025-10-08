---
project: pmerit_platform
type: frontend_development_overview
roles:
  - claude
  - copilot
  - human_reviewer
purpose: Central coordination file for managing Claude implementation tasks and Copilot audit reviews for the PMERIT frontend.
---

# 🌐 PMERIT Platform — Frontend Development Overview

## 🎯 Project Goal

Develop and maintain a **modular, responsive frontend** for the PMERIT educational platform using a structured workflow between:

- **Claude** → Implements frontend components and layout
- **GitHub Copilot / AI tools** → Reviews, audits, and ensures technical accuracy
- **Human reviewers** → Provide creative validation and final approval

---

## 🧩 Reference Materials

| Type | File | Description |
|------|------|-------------|
| Blueprint | `.copilot/blueprint-index.html` | One-page working layout reference (desktop) |
| Theme | `.copilot/Pmerit-theme_typography.html` | Official colors, fonts, and typography system |
| Strategic Plan | `.copilot/PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md` | Platform roadmap and strategic vision |
| User Flows | `.copilot/USER-ACCESS-&-FLOW-WALKTHROUGH.md` | User journey and navigation |

### Additional Reference Files
Located in project knowledge:
- `UI-blueprint-index.html.jpg` – Desktop layout visual reference
- `Mobile-UI-body.jpg` – Mobile chat interface design
- `Mobile-UI-body-prompt-response.jpg` – Mobile chat interaction pattern
- `iPhone-Mobile Screen Design And Responsiviness.jpg` – Mobile responsive behavior
- `Repo_Dirandfile1-4.jpg` – Directory structure planning guides

---

## 🧱 Frontend Structure Goals

- **Consistent Theme:** All fonts/colors follow `.copilot/Pmerit-theme_typography.html`
- **Responsive Design:** Mobile-first, non-scrollable UI with adaptive orientation
- **Modular Layout:** Header, Footer, Nav, and Body split into `partials/` directory
- **Scalability:** Base structure supports 28+ pages sharing a unified header/footer
- **Maintainability:** No patchwork — files replaced as clean versions only
- **Accessibility:** WCAG AA compliance, semantic HTML, ARIA labels
- **Performance:** Optimized assets, deferred scripts, lazy loading

---

## ⚙️ Workflow Overview

### **1. Claude (Implementation Phase)**

Claude is responsible for:
- Converting `.copilot/blueprint-index.html` into modular files
- Applying PMERIT colors, fonts, and design principles
- Building responsive, non-scrollable mobile UI with Google-style layout
- Maintaining consistency across header, footer, and body
- Ensuring complete functionality of menus, modals, and chat UI
- Creating clean, production-ready code

**Deliverables per Phase:**
- Phase 1: Directory structure + theme system
- Phase 2: Mobile header + hamburger menu
- Phase 3: Chat interface + body layout
- Phase 4: Mobile footer
- Phase 5: Desktop responsive adaptation
- Phase 6: Interactive features + polish

➡️ **Refer to:** [`INSTRUCTIONS_Claude.md`](./INSTRUCTIONS_Claude.md)

---

### **2. GitHub Copilot / AI Tools (Audit & Review Phase)**

Copilot audits and validates:
- Code structure, syntax, and readability
- Mobile/desktop responsiveness
- Accessibility and semantic compliance
- Missing imports, broken links, or inconsistent styling
- Reusability and maintainability of components
- Brand consistency (colors, fonts, spacing)
- Performance optimizations

**Audit Process:**
1. Triggered automatically on Push/PR via GitHub Actions
2. Loads configuration from `.copilot/config.yml` and `.copilot/instructions.md`
3. Runs lint checks (HTMLHint, Stylelint, ESLint)
4. Posts inline comments with 🤖 prefix
5. Creates summary report in PR comments
6. Adds labels: `frontend`, `copilot-reviewed`, `needs-human-review`

**Audit results are reported via:**
- Pull Request inline comments
- GitHub Issues tagged `audit`, `review`, or `frontend`
- Summary report in PR

➡️ **Refer to:** [`INSTRUCTIONS_Copilot.md`](./INSTRUCTIONS_Copilot.md)

---

### **3. Human Review & Sign-off**

Human reviewers verify:
- Visual accuracy (compared to design references)
- UX flow and branding fidelity
- Accessibility with screen readers
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Responsiveness and interactivity feel
- Final acceptance for production merge

**Review Process:**
1. Review Copilot's audit comments
2. Test functionality manually
3. Verify visual design matches references
4. Check accessibility with screen readers
5. Approve or request changes
6. Merge to `main` when all checks pass

---

## 🔄 Development Phases (Tracking Table)

| Phase | Description | Assigned To | Duration | Status |
|-------|-------------|-------------|----------|--------|
| 1 | Setup and theme foundation | Claude | 4-6 hrs | ☐ Pending |
| 2 | Mobile header and hamburger menu | Claude | 6-8 hrs | ☐ Pending |
| 3 | Mobile body and chat interface | Claude | 6-8 hrs | ☐ Pending |
| 4 | Mobile footer | Claude | 2-3 hrs | ☐ Pending |
| 5 | Desktop responsive adaptation | Claude | 6-8 hrs | ☐ Pending |
| 6 | Interactive features & polish | Claude | 8-10 hrs | ☐ Pending |
| 7 | Code review and audit | Copilot | Auto | ☐ Pending |
| 8 | Human visual validation | Reviewer | 2-4 hrs | ☐ Pending |
| 9 | Final merge approval | Reviewer | 1 hr | ☐ Pending |

**Total Estimated Time:** 35-48 hours for implementation + review

---

## 🧾 Issue Coordination Guidelines

### Pull Request Workflow
1. **Claude** creates a Pull Request after each completed phase
2. **GitHub Actions** automatically triggers Copilot review
3. **Copilot** runs lint/audit checks and posts comments
4. **Claude** addresses Copilot feedback and updates PR
5. **Reviewers** validate and approve when all checks pass
6. **Merge** to `main` branch

### GitHub Labels
Use these labels to organize issues and PRs:

| Label | Purpose |
|-------|---------|
| `phase-1` | Setup & theme foundation |
| `phase-2` | Mobile header & navigation |
| `phase-3` | Mobile body & chat |
| `phase-4` | Mobile footer |
| `phase-5` | Desktop adaptation |
| `phase-6` | Interactive features |
| `frontend` | Frontend-related work |
| `copilot-reviewed` | Copilot audit completed |
| `needs-human-review` | Ready for human QA |
| `accessibility` | Accessibility issue/improvement |
| `responsive` | Responsive design issue |
| `bug` | Bug fix required |
| `enhancement` | Feature enhancement |

---

## 🧰 Repository Structure (Expected Final Form)

```
pmerit-ai-platform/
│
├── .copilot/                           # Copilot configuration
│   ├── config.yml
│   ├── instructions.md
│   ├── hints/
│   │   ├── html-style-guide.md
│   │   ├── css-style-guide.md
│   │   └── js-structure-tips.md
│   ├── prompts/
│   │   ├── review-prompts.md
│   │   └── design-consistency.md
│   ├── Pmerit-theme_typography.html    # Brand reference
│   └── blueprint-index.html            # Desktop layout reference
│
├── .github/
│   └── workflows/
│       └── frontend-review.yml         # Auto-review workflow
│
├── assets/
│   ├── css/
│   │   ├── theme-variables.css         # CSS custom properties
│   │   ├── base.css                    # Reset + foundation
│   │   ├── typography.css              # Font styles
│   │   ├── components.css              # Reusable components
│   │   ├── mobile.css                  # Mobile-specific styles
│   │   └── desktop.css                 # Desktop-specific styles
│   ├── js/
│   │   ├── menu.js                     # Hamburger menu controller
│   │   ├── modal.js                    # Modal controller
│   │   ├── chat.js                     # Chat interface
│   │   └── main.js                     # Main app logic
│   └── img/
│       ├── logo.svg
│       ├── favicon.ico
│       └── ...
│
├── partials/
│   ├── header.html                     # Header component
│   ├── footer.html                     # Footer component
│   ├── nav.html                        # Navigation menu
│   └── body.html                       # Body template
│
├── index.html                          # Main entry point
├── INSTRUCTIONS_Claude.md              # Claude implementation guide
├── INSTRUCTIONS_Copilot.md             # Copilot audit guide
├── PROJECT_OVERVIEW.md                 # This file
└── README.md                           # Project overview
```

---

## 🧠 Design Specifications

### Brand Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Dark Blue) | `#2A5B8C` | Primary actions, links, headers |
| Secondary (Teal) | `#4AA4B9` | Secondary elements, highlights |
| Accent (Coral) | `#FF6B6B` | Call-to-action, important notices |
| Success (Green) | `#3A7F5C` | Success messages, confirmations |
| Warning (Orange) | `#E67E22` | Warnings, cautions |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Montserrat | 32px | 700 (Bold) |
| H2 | Montserrat | 24px | 600 (Semibold) |
| H3 | Montserrat | 20px | 600 (Semibold) |
| Body | Inter | 16px | 400 (Regular) |
| Small | Inter | 14px | 400 (Regular) |

### Responsive Breakpoints
| Device | Width | Layout |
|--------|-------|--------|
| Mobile | 320px - 767px | Single column, hamburger menu |
| Tablet | 768px - 1023px | Adaptive layout |
| Desktop | 1024px+ | Three-panel grid |

### Mobile Requirements
- ✅ Non-scrollable viewport (chat area scrolls internally)
- ✅ Dynamic viewport height (`100dvh` for iOS)
- ✅ Safe-area-inset for iPhone notch
- ✅ Minimum 44px touch targets
- ✅ Hamburger menu navigation
- ✅ Simplified footer

### Desktop Requirements
- ✅ Three-panel layout (sidebar, main, right panel)
- ✅ Persistent left sidebar
- ✅ Full footer with all links
- ✅ Hover states on interactive elements

---

## 📜 Quality Standards

### Accessibility (WCAG AA)
- ✅ Semantic HTML5 elements
- ✅ ARIA labels on interactive elements
- ✅ Alt text for all images
- ✅ Visible focus states
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Contrast ratios meet 4.5:1 minimum
- ✅ Proper heading hierarchy (no skipped levels)

### Performance
- ✅ CSS and JS minified for production
- ✅ Images optimized and lazy-loaded
- ✅ Scripts deferred where appropriate
- ✅ No unused CSS or JS
- ✅ Lighthouse score > 90

### Code Quality
- ✅ No inline styles or scripts
- ✅ CSS uses variables (no hardcoded colors)
- ✅ JavaScript uses const/let (no var)
- ✅ Modular, reusable components
- ✅ Clear, descriptive naming conventions
- ✅ No console.log in production code

---

## 🔑 Success Criteria

The frontend implementation is **complete and successful** when:

1. ✅ All 6 implementation phases are complete
2. ✅ Copilot audit passes with no critical issues
3. ✅ Human review approves visual design
4. ✅ Responsive testing passes (320px to 1920px)
5. ✅ Accessibility audit passes (WCAG AA)
6. ✅ Performance meets targets (Lighthouse > 90)
7. ✅ Cross-browser testing passes
8. ✅ All interactive features work correctly
9. ✅ Brand consistency verified
10. ✅ Code is production-ready

---

## 📞 Communication & Escalation

### For Implementation Questions
- **Review:** `INSTRUCTIONS_Claude.md`
- **Reference:** `.copilot/blueprint-index.html` and `.copilot/Pmerit-theme_typography.html`
- **Contact:** Project maintainer

### For Audit/Review Questions
- **Review:** `INSTRUCTIONS_Copilot.md`
- **Reference:** `.copilot/config.yml` and `.copilot/instructions.md`
- **Contact:** Code review team

### For Strategic Questions
- **Review:** `.copilot/PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md`
- **Contact:** Project leadership

---

## 📊 Progress Tracking

Use GitHub Project Board to track progress:
- **To Do** – Phases not yet started
- **In Progress** – Claude actively working
- **Copilot Review** – Awaiting automated audit
- **Human Review** – Awaiting manual validation
- **Done** – Merged to main

---

## 🎯 Next Steps

1. **Claude:** Start Phase 1 (Setup & Theme Foundation)
2. **Create PR** after Phase 1 completion
3. **GitHub Actions** triggers Copilot review
4. **Address feedback** and iterate
5. **Proceed to Phase 2** when Phase 1 is approved
6. **Repeat** for each phase

---

## 📚 Additional Resources

- [MDN Web Docs](https://developer.mozilla.org/) – HTML/CSS/JS reference
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) – Accessibility standards
- [Google Material Design](https://material.io/design) – Design principles
- [Can I Use](https://caniuse.com/) – Browser compatibility

---

**This document serves as the central coordination point for all frontend development work. Keep it updated as the project evolves.**

**End of Project Overview**
