# PMERIT Platform - Visual Repository Map

> 🗺️ Visual guide to understanding the PMERIT AI Educational Platform codebase

---

## 🎯 At a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                   PMERIT AI PLATFORM                         │
│          Breaking Poverty Through Education                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🌍 Mission: Serve 3+ billion underserved learners          │
│  🎓 Focus: Nigeria/Africa + US underserved communities      │
│  🤖 Tech: AI-powered, mobile-first, accessible              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Repository Status Overview

### Completion Status

```
███████████████████░░░░░░░░ 60% Complete

✅ COMPLETED (15 files)
│  ├─ index.html (510 lines) - Main landing page
│  ├─ learner-portal.html - Student dashboard
│  ├─ classroom.html - Virtual classroom
│  ├─ main.js (1213 lines) - Primary logic
│  ├─ chat.js (69 lines) - Chat interface
│  ├─ router.js (137 lines) - Navigation
│  ├─ base.css - Foundation styles
│  ├─ brand.css - PMERIT colors
│  ├─ components.css - UI components
│  ├─ responsive.css - Mobile-first
│  ├─ theme-pmerit.css - Variables
│  ├─ partials/header.html - Navigation
│  ├─ partials/footer.html - Footer + modals
│  └─ Strategic documentation files

🚧 IN PROGRESS (5 files)
│  ├─ assessment.html (placeholder)
│  ├─ career.html (placeholder)
│  ├─ courses.html (placeholder)
│  ├─ library.html (placeholder)
│  └─ API functions (partial)

📝 PLANNED (20+ files)
│  └─ Support pages, admin panels, additional features
```

---

## 🏗️ Architecture Visualization

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                    (HTML + CSS)                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │   Learning   │  │    Admin     │     │
│  │   Pages      │  │   Pages      │  │    Pages     │     │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤     │
│  │ • index      │  │ • portal     │  │ • content    │     │
│  │ • about      │  │ • classroom  │  │ • reports    │     │
│  │ • pricing    │  │ • courses    │  │ • tier1/2    │     │
│  │ • contact    │  │ • library    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     LOGIC LAYER                              │
│                     (JavaScript)                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Core Logic  │  │  Interfaces  │  │  Utilities   │     │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤     │
│  │ • main.js    │  │ • chat.js    │  │ • utils.js   │     │
│  │ • router.js  │  │ • voice.js   │  │ • state.js   │     │
│  │ • core.js    │  │              │  │ • i18n.js    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│                  (Backend Services)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Database    │  │   AI Service │  │   External   │     │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤     │
│  │ PostgreSQL   │  │ ai.pmerit    │  │ BLS API      │     │
│  │ 78 tables    │  │ .com         │  │ NBS Data     │     │
│  │              │  │ Ollama       │  │ Cloudflare   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 File System Map

### Directory Tree with File Counts

```
pmerit-ai-platform/
│
├── 📄 index.html ⭐ (510 lines) - MAIN ENTRY POINT
├── 📄 *.html (30+ files) - Page files
│   ├── ✅ learner-portal.html - Working
│   ├── ✅ classroom.html - Working
│   └── 📝 27 placeholder pages
│
├── 📁 assets/ - Static resources
│   │
│   ├── 📁 css/ (7 files, ~1000 lines)
│   │   ├── ⭐ base.css - Foundation
│   │   ├── ⭐ brand.css - PMERIT colors
│   │   ├── ⭐ components.css - UI components
│   │   ├── ⭐ responsive.css - Mobile-first
│   │   ├── ⭐ theme-pmerit.css - CSS variables
│   │   ├── clean-mobile.css - Mobile menu
│   │   └── unified-design-system.css - Design tokens
│   │
│   ├── 📁 js/ (10+ files, ~1400 lines)
│   │   ├── ⭐ main.js (1213 lines) - Primary logic
│   │   ├── ⭐ chat.js (69 lines) - Chat interface
│   │   ├── ⭐ router.js (137 lines) - Navigation
│   │   ├── boot-includes.js - Partial loader
│   │   ├── clean-mobile.js - Mobile menu
│   │   ├── voice.js - Text-to-speech
│   │   ├── core.js - Core utilities
│   │   └── core/
│   │       ├── state.js - State management
│   │       ├── utils.js - Helper functions
│   │       └── i18n.js - Internationalization
│   │
│   └── nav-config.js - Navigation config
│
├── 📁 partials/ (4 files) - Reusable components
│   ├── ⭐ header.html (65 lines) - Navigation header
│   ├── ⭐ footer.html (102 lines) - Footer + modals
│   ├── nav.html - Menu structure
│   └── body.html - Body template
│
├── 📁 functions/ - Cloudflare Workers
│   └── api/
│       ├── [[route]].js - Dynamic routing
│       └── assessment/
│           └── start.js - Assessment API
│
├── 📁 admin/ (4 files) - Admin interfaces
│   ├── content.html - Content management
│   ├── reports.html - Analytics dashboard
│   ├── tier1.html - Basic admin
│   └── tier2.html - Advanced admin
│
├── 📁 doc/ (5 files) - Technical docs
│   ├── GitHub-Copilot-Instructions.md
│   ├── complete-Header-&-Auth.md
│   ├── critique.md
│   ├── header.md
│   └── signup-flow.md
│
├── 📁 .copilot/ (3 files) - Strategic plans
│   ├── ⭐ PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md
│   ├── ⭐ USER-ACCESS-&-FLOW-WALKTHROUGH.md
│   ├── Pmerit-theme_typography.html
│   └── blueprint-index.html
│
├── 📁 templates/ - HTML templates
│   └── page-template.html
│
└── 📝 Documentation (10+ files)
    ├── ⭐ README.md (39 lines)
    ├── ⭐ FILE_DOCUMENTATION.md (1294 lines) ← COMPREHENSIVE GUIDE
    ├── ⭐ QUICK_REFERENCE.md (145 lines) ← FAST LOOKUP
    ├── PR18_ANALYSIS.md
    ├── PR-18-VISUAL-STATUS.md
    └── canonical.md

Legend:
⭐ = Key file (high priority)
✅ = Complete and working
📝 = Placeholder (needs implementation)
```

---

## 🎨 CSS Architecture Flow

```
LOADING ORDER:

1. base.css
   └─→ CSS Reset
   └─→ Typography (Inter font)
   └─→ Base colors & spacing
       │
       ↓
2. brand.css
   └─→ PMERIT colors
   └─→ Primary: #4F46E5
   └─→ Accent: #7C3AED
       │
       ↓
3. components.css
   └─→ Buttons, cards, modals
   └─→ Forms, badges, toggles
   └─→ Collapsibles
       │
       ↓
4. theme-pmerit.css
   └─→ CSS Custom Properties
   └─→ --primary, --accent, etc.
       │
       ↓
5. responsive.css
   └─→ Mobile: <600px
   └─→ Tablet: 600-1100px
   └─→ Desktop: >1100px
```

---

## 💻 JavaScript Initialization Flow

```
PAGE LOADS
    │
    ↓
1. boot-includes.js
   └─→ Fetches partials/header.html
   └─→ Fetches partials/footer.html
   └─→ Injects into DOM
       │
       ↓
2. router.js
   └─→ new NavigationManager()
   └─→ initializeHamburgerMenu()
   └─→ Event listeners attached
       │
       ↓
3. chat.js
   └─→ addMessage() function ready
   └─→ sendMessage() function ready
   └─→ Typing indicator ready
       │
       ↓
4. main.js
   └─→ init() function runs
   └─→ All event listeners attached
   └─→ Toggles initialized
   └─→ Modals initialized
   └─→ Chat interface ready
       │
       ↓
USER INTERACTIONS READY
```

---

## 🔄 User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│                     USER LANDS ON SITE                       │
│                     (index.html)                             │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ↓               ↓               ↓
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  Browse &   │ │   Sign Up   │ │   AI Chat   │
    │   Explore   │ │             │ │             │
    └─────────────┘ └─────────────┘ └─────────────┘
            │               │               │
            └───────────────┼───────────────┘
                            ↓
                    ┌─────────────┐
                    │ Assessment  │
                    │ (Career)    │
                    └─────────────┘
                            │
                            ↓
                    ┌─────────────┐
                    │   Career    │
                    │ Exploration │
                    └─────────────┘
                            │
                            ↓
                    ┌─────────────┐
                    │   Course    │
                    │  Selection  │
                    └─────────────┘
                            │
                            ↓
                    ┌─────────────┐
                    │   Learner   │
                    │   Portal    │
                    └─────────────┘
                            │
            ┌───────────────┼───────────────┐
            ↓               ↓               ↓
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  Classroom  │ │   Library   │ │  Progress   │
    │  Learning   │ │  Resources  │ │  Tracking   │
    └─────────────┘ └─────────────┘ └─────────────┘
                            │
                            ↓
                    ┌─────────────┐
                    │Certificate  │
                    │  & Career   │
                    └─────────────┘
```

---

## 🎯 Key Components Breakdown

### Mobile Menu Component

```
┌─────────────────────────────────────┐
│        HAMBURGER BUTTON             │
│        (#menuToggle)                │
└─────────────────────────────────────┘
            ↓ onClick
┌─────────────────────────────────────┐
│   main.js:toggleMenu()              │
│   • Adds .active class              │
│   • Shows menu & overlay            │
└─────────────────────────────────────┘
            ↓ CSS Animation
┌─────────────────────────────────────┐
│   SIDE MENU (#sideMenu)             │
│   • left: -100% → left: 0           │
│   • transition: left 0.3s           │
│   • z-index: 1100                   │
└─────────────────────────────────────┘
            +
┌─────────────────────────────────────┐
│   OVERLAY (#menuOverlay)            │
│   • opacity: 0 → opacity: 0.5       │
│   • z-index: 1000                   │
│   • backdrop-filter: blur(2px)      │
└─────────────────────────────────────┘
```

### Chat Component

```
┌─────────────────────────────────────┐
│   USER TYPES MESSAGE                │
│   (#chatInput)                      │
└─────────────────────────────────────┘
            ↓ Enter or Click Send
┌─────────────────────────────────────┐
│   chat.js:sendMessage()             │
│   • Get text from input             │
│   • Clear input                     │
│   • Add user message bubble         │
└─────────────────────────────────────┘
            ↓ setTimeout(1500ms)
┌─────────────────────────────────────┐
│   AI RESPONSE GENERATION            │
│   • Check state.support             │
│   • Generate appropriate response   │
│   • Add AI message bubble           │
└─────────────────────────────────────┘
            ↓ If enabled
┌─────────────────────────────────────┐
│   OPTIONAL ENHANCEMENTS             │
│   • TTS: speechSynthesis.speak()    │
│   • VH: Update captions             │
└─────────────────────────────────────┘
```

---

## 📈 Code Metrics

### Complexity Distribution

```
JAVASCRIPT COMPLEXITY:

main.js ████████████████████░ 1213 lines (Complex)
chat.js ██░░░░░░░░░░░░░░░░░░  69 lines (Simple)
router.js ███░░░░░░░░░░░░░░░░ 137 lines (Medium)
boot-includes.js █░░░░░░░░░░░  ~50 lines (Simple)

CSS COMPLEXITY:

responsive.css ████████░░░░░░ ~300 lines (Complex)
components.css ███████░░░░░░░ ~250 lines (Medium)
base.css ████░░░░░░░░░░░░░░░ ~150 lines (Medium)
brand.css ██░░░░░░░░░░░░░░░░ ~100 lines (Simple)
theme.css ███░░░░░░░░░░░░░░░ ~150 lines (Medium)
```

### Feature Implementation Status

```
✅ WORKING (60%)
├─ Mobile-first responsive layout
├─ Hamburger menu with toggles
├─ AI chat interface (mock)
├─ Virtual Human mode UI
├─ Customer Service mode UI
├─ Dark mode toggle
├─ Text-to-speech toggle
├─ Authentication modals
├─ Career tracks modal
├─ Assessment modal
├─ Voice preview modal
└─ Three-panel desktop layout

🚧 IN PROGRESS (20%)
├─ Assessment functionality
├─ Career exploration
├─ Course catalog
├─ Library resources
└─ API integration

📝 PLANNED (20%)
├─ Real AI responses
├─ Database integration
├─ User authentication
├─ Payment processing
└─ Video conferencing
```

---

## 🎓 Learning Path

### For New Developers

```
DAY 1: UNDERSTAND STRUCTURE
1. Read: README.md
2. Read: QUICK_REFERENCE.md
3. Browse: index.html
4. Run: Local server
   └─→ Explore UI on mobile & desktop

DAY 2: STUDY CORE FILES
1. Study: main.js (primary logic)
2. Study: chat.js (chat interface)
3. Study: responsive.css (mobile-first)
4. Practice: Toggle switches, modals

DAY 3: UNDERSTAND FLOW
1. Read: FILE_DOCUMENTATION.md
2. Follow: Dependency trees
3. Trace: User actions → code
4. Review: Architecture diagrams

DAY 4+: BUILD FEATURES
1. Choose: Placeholder page
2. Design: UI mockup
3. Implement: HTML/CSS/JS
4. Test: Mobile & desktop
5. Document: Update docs
```

---

## 🔍 Where to Find Things

### Common Questions

**Q: Where is the mobile menu code?**
- HTML: `index.html` lines 66-191 (`#sideMenu`)
- CSS: `responsive.css` (hamburger styles)
- JS: `main.js` (`toggleMenu()`, `closeMenu()`)

**Q: How do I add a new page?**
- Create: `my-page.html` in root
- Include: Standard CSS/JS (see QUICK_REFERENCE.md)
- Add link: `partials/header.html` menu

**Q: Where are the brand colors?**
- File: `assets/css/brand.css`
- File: `assets/css/theme-pmerit.css`
- Primary: #4F46E5, Accent: #7C3AED

**Q: How does the chat work?**
- Interface: `chat.js`
- Messages: `addMessage()` function
- Responses: Mock (setTimeout 1.5s)
- Real AI: Coming (ai.pmerit.com)

**Q: Where is the database?**
- Status: Not in repo (infrastructure)
- Location: PostgreSQL (78 tables)
- Connection: Via Cloudflare Workers
- Schema: See strategic plan

---

## 📚 Documentation Hierarchy

```
README.md
   │ (Quick overview)
   ↓
QUICK_REFERENCE.md
   │ (Fast lookup)
   ↓
THIS FILE (VISUAL_MAP.md)
   │ (Visual guide)
   ↓
FILE_DOCUMENTATION.md
   │ (Complete details)
   ↓
STRATEGIC PLAN
   │ (Long-term vision)
   ↓
SPECIFIC DOCS
   (Individual topics)
```

---

## 🚀 Next Steps

### Immediate Priorities

1. ✅ Documentation complete
2. 🚧 Implement placeholder pages
3. 🚧 Connect real AI (ai.pmerit.com)
4. 📝 Database integration
5. 📝 User authentication
6. 📝 Payment system
7. 📝 Video conferencing

### Development Phases

```
PHASE 1: Frontend Polish ⏰ Now
├─ Complete placeholder pages
├─ Enhance mobile UX
├─ Add animations
└─ Accessibility audit

PHASE 2: Backend Integration ⏰ Q1 2025
├─ AI API connection
├─ Database CRUD
├─ User authentication
└─ Session management

PHASE 3: Advanced Features ⏰ Q2 2025
├─ Video conferencing
├─ Payment processing
├─ Blockchain certificates
└─ Analytics dashboard

PHASE 4: Scale & Optimize ⏰ Q3-Q4 2025
├─ Performance optimization
├─ Load testing
├─ Global CDN optimization
└─ Multi-language rollout
```

---

## 📞 Support Resources

- 📖 **Full Documentation**: [FILE_DOCUMENTATION.md](FILE_DOCUMENTATION.md)
- ⚡ **Quick Reference**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- 🗺️ **This Visual Map**: VISUAL_MAP.md
- 📋 **Strategic Plan**: [.copilot/PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md](.copilot/PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md)
- 🌐 **Repository**: https://github.com/peoplemerit/pmerit-ai-platform
- 💻 **Website**: https://pmerit.com

---

**Version**: 1.0  
**Created**: January 2025  
**Purpose**: Visual guide for understanding PMERIT platform architecture

*"Breaking poverty through accessible education"* 🎓
