# PMERIT AI Platform - Comprehensive File Documentation

> **Last Updated**: January 2025  
> **Version**: 1.0  
> **Purpose**: Complete guide to all files, their objectives, and interconnections

---

## 📋 Table of Contents

1. [Repository Overview](#repository-overview)
2. [Core HTML Pages](#core-html-pages)
3. [JavaScript Files](#javascript-files)
4. [CSS Stylesheets](#css-stylesheets)
5. [Partials & Templates](#partials--templates)
6. [Functions & API](#functions--api)
7. [Documentation Files](#documentation-files)
8. [Configuration & Admin](#configuration--admin)
9. [File Interconnections](#file-interconnections)
10. [Architecture Diagrams](#architecture-diagrams)

---

## 🏗️ Repository Overview

### Mission
PMERIT is an AI-powered educational platform designed to break poverty cycles through accessible, high-quality education. It serves 3+ billion underserved learners globally with a focus on Nigeria/Africa, combining cutting-edge AI technology with cultural sensitivity.

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Modular)
- **Backend**: PostgreSQL (78 tables), Cloudflare Workers
- **AI**: Ollama (ai.pmerit.com), Multiple models (Phi-3, Mistral, Llama)
- **Deployment**: GitHub Pages, Cloudflare Pages
- **CDN**: Cloudflare Global Network

### Repository Structure
```
pmerit-ai-platform/
├── .copilot/              # GitHub Copilot instructions & strategic plans
├── assets/                # Static assets (CSS, JS, images)
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript modules
│   └── nav-config.js     # Navigation configuration
├── partials/             # Reusable HTML components
├── functions/            # Cloudflare Workers API functions
├── admin/                # Admin interface pages
├── doc/                  # Technical documentation
├── templates/            # HTML templates
├── *.html               # Page files (20+ pages)
└── *.md                 # Documentation files
```

---

## 🌐 Core HTML Pages

### 1. **index.html** (Main Landing Page)
- **Lines**: ~510
- **Purpose**: Primary entry point with AI chat interface
- **Key Features**:
  - Dual layout: Mobile-first responsive + Desktop three-panel
  - Google-inspired clean header with hamburger menu
  - Enhanced side menu with toggle switches (Virtual Human Mode, Customer Service Mode)
  - AI greeting and chat interface
  - Quick actions sidebar (desktop)
  - Support & discovery sidebar (desktop)
- **Dependencies**: 
  - CSS: base.css, brand.css, components.css, theme-pmerit.css, responsive.css
  - JS: boot-includes.js, router.js, chat.js, main.js
- **Modals**: Sign In, Sign Up, Assessment, Career Tracks, Voice Preview
- **User Flow**: Guest → AI Chat → Assessment → Learning Path Selection

### 2. **learner-portal.html**
- **Purpose**: Student dashboard and learning management
- **Key Features**:
  - Mermaid flowchart showing learner journey
  - Dashboard cards (AI Assistant, Courses, Progress, Career Guidance)
  - Access to enrolled courses and progress tracking
  - Community and support features
- **Connects To**: classroom.html, courses.html, progress.html, certificates.html
- **User Role**: Authenticated learners

### 3. **classroom.html**
- **Purpose**: Interactive virtual classroom environment
- **Key Features**:
  - Three-panel layout (Outline, Video Player, Chat)
  - Class outline with module/lesson navigation
  - Note-taking functionality with local storage
  - Resource upload and management
  - AI assistant chat for questions
  - Video/Avatar placeholder for instruction
- **JavaScript**: Inline state management and rendering functions
- **Storage**: LocalStorage for notes and resources
- **User Role**: Enrolled students

### 4. **assessment.html** (Empty/Placeholder)
- **Status**: Placeholder file (2 lines)
- **Purpose**: Career and learning style assessment
- **Planned Features**:
  - Personality test
  - Career profiling
  - Learning style identification
  - Skills assessment
- **Connects To**: career.html, learner-portal.html

### 5. **career.html** (Empty/Placeholder)
- **Status**: Placeholder file (2 lines)
- **Purpose**: Career exploration and job market integration
- **Planned Features**:
  - Career track browsing (Data Science, Software Dev, Cybersecurity, etc.)
  - Job market data (BLS API integration)
  - Skills mapping
  - Employer connections
- **API**: BLS API key: f3b54462bdd64a829a09dd23d1acb7cd

### 6. **courses.html** (Placeholder)
- **Purpose**: Course catalog and enrollment
- **Planned Features**:
  - Browse courses by category
  - Course details and prerequisites
  - Enrollment functionality
  - Progress tracking
- **Connects To**: classroom.html, learner-portal.html

### 7. **library.html** (Placeholder)
- **Purpose**: Resource library and content repository
- **Planned Features**:
  - Videos, documents, interactive content
  - Offline content sync
  - Search and filtering
  - Bookmarking

### 8. **certificates.html** (Placeholder)
- **Purpose**: Certificate generation and blockchain verification
- **Planned Features**:
  - View earned certificates
  - Blockchain-backed verification
  - Share certificates with employers
  - Download as PDF

### 9. **progress.html** (Placeholder)
- **Purpose**: Learning progress and analytics
- **Planned Features**:
  - Progress tracking
  - Assessment scores
  - Gamification (badges, points)
  - Milestone achievements

### 10. **profile.html** (Placeholder)
- **Purpose**: User profile management
- **Features**:
  - Edit profile information
  - Privacy settings
  - Notification preferences
  - Account security (MFA)

### 11. **support.html** (Placeholder)
- **Purpose**: Customer support interface
- **Features**:
  - Help center
  - Contact form
  - Live chat with support
  - FAQ and troubleshooting

### 12. **help.html** (Placeholder)
- **Purpose**: Help documentation and guides
- **Features**:
  - User guides
  - Video tutorials
  - Platform navigation help

### 13. **signin.html** (Placeholder)
- **Purpose**: Authentication page
- **Note**: Authentication primarily handled via modals in index.html

### 14. **about-us.html** (Placeholder)
- **Purpose**: About PMERIT, mission, team
- **Content**: Mission statement, founder story, values

### 15. **privacy.html** (Placeholder)
- **Purpose**: Privacy policy and terms of service
- **Content**: GDPR compliance, data handling, COPPA compliance

### 16. **contact.html** (Placeholder)
- **Purpose**: Contact form and information

### 17. **pricing.html** (Placeholder)
- **Purpose**: Pricing tiers and donation options
- **Note**: PMERIT aims to never paywall knowledge

### 18. **partnerships.html** (Placeholder)
- **Purpose**: Partnership opportunities and information

### 19. **donate.html** (Placeholder)
- **Purpose**: Donation interface to support the platform

### 20. **alumni.html** (Placeholder)
- **Purpose**: Alumni network and success stories

### 21. **employer.html** (Placeholder)
- **Purpose**: Employer partnerships and job posting

### 22. **impact.html** (Placeholder)
- **Purpose**: Social impact metrics and stories

### 23. **consent.html** (Placeholder)
- **Purpose**: COPPA compliance for minors

### 24. **maintenance.html** (Placeholder)
- **Purpose**: Maintenance mode page

### 25. **monitoring.html** (Placeholder)
- **Purpose**: System monitoring dashboard

### 26. **ai-police.html** (Placeholder)
- **Purpose**: AI ethics and monitoring

### 27. **incident-response.html** (Placeholder)
- **Purpose**: Security incident response

### 28. **index-final.html** (Backup)
- **Purpose**: Backup version of index.html

### 29. **index_backup_20250921.html** (Backup)
- **Purpose**: Dated backup of index.html

---

## 💻 JavaScript Files

### Core JavaScript Architecture
```
assets/js/
├── boot-includes.js      # Dynamic partial loader
├── main.js              # Main application logic (1213 lines)
├── chat.js              # Chat interface (69 lines)
├── router.js            # Navigation manager (137 lines)
├── clean-mobile.js      # Mobile menu exports
├── voice.js             # Text-to-speech functionality
├── core.js              # Core utilities (empty)
├── core/
│   ├── state.js         # State management
│   ├── utils.js         # Utility functions
│   └── i18n.js          # Internationalization
└── nav-config.js        # Navigation configuration
```

### 1. **main.js** (Primary Application File)
- **Lines**: 1213
- **Purpose**: Central application logic and event handling
- **Key Functions**:
  - `init()` - Initialize application on load
  - `toggleMenu()` / `closeMenu()` - Hamburger menu control
  - `showAuthModal()` / `hideAuthModal()` - Authentication UI
  - `toggleVirtualHumanMode()` - VH mode activation
  - `toggleCustomerServiceMode()` - CS mode activation
  - `toggleTextToSpeech()` - TTS functionality
  - `showCareerTracks()` - Career exploration
  - `startAssessment()` - Assessment flow
  - `previewVoices()` - Voice preview modal
  - `initializeBlueprintSidebar()` - Desktop sidebar setup
  - `initializeModernToggles()` - Toggle switch handlers
  - `initializeCollapsibleSettings()` - Collapsible sections
  - `initChatInterface()` - Chat UI initialization
  - `showToast()` - Notification system
  - `initFooterInteractivity()` - Footer link management

- **State Management**:
  - LocalStorage for persistence
  - Toggle states (VH, CS, Dark Mode, TTS)
  - User authentication status
  - Assessment completion

- **Event Listeners**:
  - Menu toggle clicks
  - Modal interactions
  - Toggle switch changes
  - Form submissions
  - Keyboard shortcuts (Escape to close)

- **Dependencies**: 
  - Requires: chat.js, router.js, boot-includes.js
  - Uses: state.js functions if available
  - Integrates with: All modal dialogs in index.html

### 2. **chat.js** (Chat Interface)
- **Lines**: 69
- **Purpose**: Manage chat message display and interactions
- **Key Functions**:
  - `addMessage(sender, text, isUser)` - Add chat bubble
  - `sendMessage()` - Send user message and get AI response
  - `showTypingIndicator()` - Show "AI is typing..."
  - `hideTypingIndicator()` - Hide typing indicator

- **Features**:
  - Message bubble rendering
  - User vs AI message styling
  - Auto-scroll to latest message
  - TTS integration (speaks AI messages if enabled)
  - VH mode integration (displays captions)
  - Typing indicator animation

- **AI Responses**:
  - Context-aware replies based on mode (Support vs AI assistance)
  - Mock responses for demo purposes
  - Timeout-based response simulation (1.5s delay)

### 3. **router.js** (Navigation Manager)
- **Lines**: 137
- **Purpose**: Handle partial loading and navigation
- **Class**: `NavigationManager`
- **Key Methods**:
  - `loadNavigation()` - Fetch and inject nav partial
  - `initializeHamburgerMenu()` - Setup mobile menu
  - `toggleMenu()` / `openMenu()` / `closeMenu()` - Menu control
  - `handleResize()` - Responsive behavior
  - `createFallbackNavigation()` - Error fallback

- **Features**:
  - Async partial loading from `/partials/nav.html`
  - Click-outside-to-close behavior
  - Escape key handling
  - Body scroll prevention when menu open
  - Responsive menu closure on desktop resize

### 4. **boot-includes.js** (Dynamic Loader)
- **Purpose**: Load shared HTML partials (header, footer, nav)
- **Mechanism**: Fetch API + innerHTML injection
- **Targets**: Elements with data-include attribute
- **Usage**: DRY principle for shared components

### 5. **clean-mobile.js** (Mobile Menu)
- **Purpose**: Export mobile menu functionality
- **Note**: Functionality primarily in main.js now

### 6. **voice.js** (Text-to-Speech)
- **Purpose**: Browser TTS integration
- **Features**:
  - Voice selection
  - Rate and pitch control
  - Multi-language support

### 7. **core/state.js** (State Management)
- **Purpose**: Global application state
- **Features**:
  - User authentication state
  - Mode toggles (VH, CS, Dark, TTS)
  - Language preference
  - Assessment progress

### 8. **core/utils.js** (Utilities)
- **Purpose**: Helper functions
- **Features**:
  - LocalStorage wrappers
  - Date formatting
  - String utilities

### 9. **core/i18n.js** (Internationalization)
- **Purpose**: Multi-language support
- **Languages**: English, Yorùbá, Igbo, Hausa
- **Features**: Dynamic text replacement

### 10. **nav-config.js** (Navigation Config)
- **Purpose**: Navigation menu structure and access rules
- **Features**: Role-based navigation

---

## 🎨 CSS Stylesheets

### Stylesheet Architecture
```
assets/css/
├── base.css                    # Foundation styles
├── brand.css                   # PMERIT brand colors
├── components.css              # UI components
├── theme-pmerit.css           # Theme variables
├── responsive.css              # Mobile-first responsive
├── clean-mobile.css           # Mobile menu styles
└── unified-design-system.css  # Design tokens
```

### 1. **base.css**
- **Purpose**: Foundation and reset styles
- **Contents**:
  - CSS reset and normalize
  - Typography base (Inter font)
  - Box-sizing: border-box
  - Base colors and spacing
  - Focus states and accessibility

### 2. **brand.css**
- **Purpose**: PMERIT brand identity
- **Colors**:
  - Primary: #4F46E5 (Indigo)
  - Accent: #7C3AED (Purple)
  - Background: Clean white
  - Text: #1F2937 (Dark gray)
- **Logo**: PMERIT branding styles

### 3. **components.css**
- **Purpose**: Reusable UI components
- **Components**:
  - Buttons (nav-btn, primary, secondary)
  - Cards (dashboard-card, menu-item)
  - Modals (auth-modal, dialog elements)
  - Forms (input-group, email-input)
  - Badges (mode badges, status indicators)
  - Toggle switches (modern-toggle, toggle-slider)
  - Collapsibles (collapsible-header, collapsible-content)

### 4. **theme-pmerit.css**
- **Purpose**: CSS custom properties (variables)
- **Variables**:
  ```css
  --primary: #4F46E5
  --accent: #7C3AED
  --bg-primary: #FFFFFF
  --bg-secondary: #F9FAFB
  --text-primary: #1F2937
  --text-secondary: #6B7280
  --border-color: #E5E7EB
  --success: #10B981
  --warning: #F59E0B
  --error: #EF4444
  ```

### 5. **responsive.css** (Key Mobile File)
- **Lines**: 100+ (partial view shown)
- **Purpose**: Mobile-first responsive design
- **Breakpoints**:
  - Mobile: < 600px
  - Tablet: 600px - 1100px
  - Desktop: > 1100px
- **Key Features**:
  - Hamburger menu positioning (left: -100% → left: 0)
  - Viewport-fit safe areas
  - Dynamic viewport height (dvh)
  - Touch-friendly spacing
  - Horizontal scroll prevention
  - Z-index management (menu: 1100, overlay: 1000)

### 6. **clean-mobile.css**
- **Purpose**: Mobile menu specific styles
- **Features**:
  - Side menu animation
  - Menu overlay
  - Mobile accordion styles

### 7. **unified-design-system.css**
- **Purpose**: Design tokens and system
- **Features**:
  - Spacing scale
  - Typography scale
  - Color palette
  - Shadow system
  - Border radius system

---

## 🧩 Partials & Templates

### Partials Directory
```
partials/
├── header.html    # Global navigation header
├── footer.html    # Global footer with modals
├── nav.html       # Navigation menu structure
└── body.html      # Body template
```

### 1. **header.html** (65 lines)
- **Purpose**: Unified navigation header
- **Style**: Google-inspired design
- **Contents**:
  - Hamburger toggle button
  - Language switcher (🇺🇸 English, 🇳🇬 Yorùbá, Igbo, Hausa)
  - Action buttons (Donate, Sign In, Sign Up)
  - Hamburger menu grid with icons:
    - 📚 Courses
    - 🎯 Career Paths
    - 📊 Assessment
    - 🏫 Classroom
    - 👤 Learner Portal
    - 📖 Library
    - 🏆 Certificates
    - 📈 Progress
    - 💬 Support
    - ❓ Help

### 2. **footer.html** (102 lines)
- **Purpose**: Global footer and shared modals
- **Contents**:
  - Minimal footer (Privacy & Terms, Status, Settings)
  - Sign Up Modal (id: signUpModal)
  - Sign In Modal (id: signInModal)
  - Voice Preview Modal (id: voicesModal)
  - Career Tracks Modal (id: tracksModal)
  - Assessment Modal (id: assessmentModal)

- **Modals Included**:
  1. **Sign Up**: Name, email, password fields
  2. **Sign In**: Email, password, forgot password link
  3. **Voices**: Voice sampler with browser TTS test
  4. **Tracks**: Career exploration grid
  5. **Assessment**: Quick assessment intro

### 3. **nav.html**
- **Purpose**: Navigation menu structure
- **Usage**: Loaded dynamically by router.js

### 4. **body.html**
- **Purpose**: Body template for consistency

---

## ⚙️ Functions & API

### Functions Directory
```
functions/
├── api/
│   ├── [[route]].js              # Dynamic routing
│   └── assessment/
│       └── start.js              # Assessment API
```

### 1. **functions/api/[[route]].js**
- **Purpose**: Cloudflare Workers dynamic routing
- **Type**: Edge function
- **Features**:
  - API request routing
  - CORS handling
  - Authentication middleware
  - Database connections

### 2. **functions/api/assessment/start.js**
- **Purpose**: Assessment API endpoint
- **Features**:
  - Start assessment session
  - Store results in PostgreSQL
  - Return personalized recommendations

---

## 📚 Documentation Files

### Documentation Overview
```
Repository Root:
├── README.md                           # Project overview
├── PR18_ANALYSIS.md                   # PR #18 analysis
├── PR-18-VISUAL-STATUS.md             # Visual status report
├── canonical.md                        # Canonical practices
└── FILE_DOCUMENTATION.md (This file)  # Comprehensive docs

.copilot/:
├── PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md
├── USER-ACCESS-&-FLOW-WALKTHROUGH.md
├── Pmerit-theme_typography.html
└── blueprint-index.html

doc/:
├── GitHub-Copilot-Instructions.md
├── complete-Header-&-Auth.md
├── critique.md
├── header.md
└── signup-flow.md
```

### 1. **README.md**
- **Lines**: 39
- **Purpose**: Repository introduction
- **Contents**:
  - Mission statement
  - Features list
  - Technology stack
  - Live site links (pmerit.com, GitHub Pages)
  - Quick start info

### 2. **PR18_ANALYSIS.md**
- **Purpose**: Detailed PR #18 analysis
- **Contents**: Comparison of menu implementations

### 4. **PR-18-VISUAL-STATUS.md** (183 lines)
- **Purpose**: Visual comparison report
- **Contents**:
  - File status matrix
  - Change statistics
  - Architecture comparison
  - Before/after visual representations
  - Key differences detected

### 5. **.copilot/PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md**
- **Lines**: 100+ (extensive)
- **Purpose**: Strategic roadmap and planning
- **Sections**:
  - Executive Summary
  - Mission & Values
  - Infrastructure Status (PostgreSQL, AI, APIs)
  - Frontend Integration Roadmap (F1-F12)
  - Repository structure
  - Implementation phases

### 6. **.copilot/USER-ACCESS-&-FLOW-WALKTHROUGH.md**
- **Purpose**: User journey documentation
- **Contents**:
  - Phase 1: Landing Page Experience
  - Phase 2: Registration & Onboarding
  - Phase 3: Learning Experience
  - Phase 4: Career Development
  - User Interface Architecture (42 pages planned)
  - Content Repository Structure
  - Database Schema

### 7. **doc/GitHub-Copilot-Instructions.md**
- **Purpose**: Copilot agent instructions

### 8. **doc/complete-Header-&-Auth.md**
- **Purpose**: Header and authentication documentation

### 9. **doc/critique.md**
- **Purpose**: Design critique and improvements

### 10. **doc/header.md**
- **Purpose**: Header component documentation

### 11. **doc/signup-flow.md**
- **Purpose**: Sign-up flow documentation

---

## 🔐 Configuration & Admin

### Admin Directory
```
admin/
├── content.html    # Content management
├── reports.html    # Reporting dashboard
├── tier1.html      # Tier 1 admin
└── tier2.html      # Tier 2 admin
```

### Configuration Files
- **CNAME**: Custom domain configuration (pmerit.com)

---

## 🔗 File Interconnections

### Dependency Tree

```
index.html (Main Entry Point)
├── CSS Dependencies
│   ├── assets/css/base.css
│   ├── assets/css/brand.css
│   ├── assets/css/components.css
│   ├── assets/css/theme-pmerit.css
│   └── assets/css/responsive.css
│
├── JavaScript Dependencies
│   ├── assets/js/boot-includes.js (Loads partials)
│   ├── assets/js/router.js (Navigation)
│   ├── assets/js/chat.js (Chat interface)
│   └── assets/js/main.js (Primary logic)
│
├── Partials (Loaded by boot-includes.js)
│   ├── partials/header.html
│   ├── partials/footer.html
│   └── partials/nav.html
│
└── Navigation Links
    ├── learner-portal.html
    ├── classroom.html
    ├── courses.html
    ├── assessment.html
    ├── career.html
    ├── library.html
    ├── certificates.html
    ├── progress.html
    ├── profile.html
    ├── support.html
    └── help.html
```

### Component Interaction Flow

```
1. USER VISITS INDEX.HTML
   ↓
2. ASSETS LOAD
   • CSS: base → brand → components → theme → responsive
   • JS: boot-includes loads partials
   ↓
3. BOOT-INCLUDES.JS EXECUTES
   • Fetches partials/header.html
   • Fetches partials/footer.html
   • Injects into DOM
   ↓
4. ROUTER.JS INITIALIZES
   • Sets up NavigationManager
   • Attaches event listeners to hamburger menu
   ↓
5. MAIN.JS INITIALIZES
   • init() function runs
   • Attaches all event listeners
   • Initializes toggles and modals
   • Sets up chat interface
   ↓
6. CHAT.JS READY
   • Message handling ready
   • AI response simulation ready
   ↓
7. USER INTERACTIONS
   • Click hamburger → router.js opens menu
   • Click toggle → main.js handles state
   • Send message → chat.js processes
   • Click modal button → main.js shows modal
```

### State Management Flow

```
USER ACTION
   ↓
EVENT LISTENER (main.js)
   ↓
UPDATE STATE (localStorage or memory)
   ↓
UPDATE UI (DOM manipulation)
   ↓
OPTIONAL: API CALL (functions/)
   ↓
OPTIONAL: TTS/VOICE (voice.js)
```

### Page-to-Page Navigation

```
Landing (index.html)
├── Assessment → assessment.html
│   └── Career Recommendations → career.html
│       └── Course Selection → courses.html
│           └── Enrollment → learner-portal.html
│               ├── Classroom → classroom.html
│               ├── Progress → progress.html
│               ├── Library → library.html
│               └── Certificates → certificates.html
│
├── Support → support.html
├── Help → help.html
├── Profile → profile.html
└── Admin (authenticated)
    ├── Content → admin/content.html
    ├── Reports → admin/reports.html
    ├── Tier 1 → admin/tier1.html
    └── Tier 2 → admin/tier2.html
```

---

## 📐 Architecture Diagrams

### System Architecture (High Level)

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              PMERIT Frontend (GitHub Pages)            │  │
│  │  • index.html (Landing + Chat)                        │  │
│  │  • learner-portal.html (Dashboard)                    │  │
│  │  • classroom.html (Learning Environment)              │  │
│  │  • + 20 other pages                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE NETWORK                        │
│  ┌───────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │ Pages Hosting │  │  Workers API   │  │  Global CDN    │ │
│  │ (Static)      │  │  (functions/)  │  │  (Assets)      │ │
│  └───────────────┘  └────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ↓                   ↓
┌─────────────────────────────┐  ┌──────────────────────────┐
│    PostgreSQL Database      │  │   AI Service (Ollama)    │
│    • 78 tables              │  │   • ai.pmerit.com        │
│    • Users, Courses, etc.   │  │   • Phi-3, Mistral, etc. │
└─────────────────────────────┘  └──────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL INTEGRATIONS                      │
│  • BLS API (Job Market Data)                                │
│  • Nigerian Bureau of Statistics                            │
│  • Payment Gateways (Planned)                              │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Component Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      PMERIT FRONTEND                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SHARED COMPONENTS (Partials)             │  │
│  │  • header.html (Nav, Language, Auth)                 │  │
│  │  • footer.html (Links, Modals)                       │  │
│  │  • nav.html (Hamburger Menu)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────┬─────────────┬─────────────┬────────────┐  │
│  │   PUBLIC    │   LEARNER   │   LEARNING  │    ADMIN   │  │
│  │   PAGES     │   PAGES     │   PAGES     │    PAGES   │  │
│  ├─────────────┼─────────────┼─────────────┼────────────┤  │
│  │ • index     │ • portal    │ • classroom │ • content  │  │
│  │ • about     │ • profile   │ • courses   │ • reports  │  │
│  │ • pricing   │ • progress  │ • library   │ • tier1    │  │
│  │ • contact   │ • certs     │ • career    │ • tier2    │  │
│  │ • help      │ • support   │ • assess    │            │  │
│  └─────────────┴─────────────┴─────────────┴────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 JAVASCRIPT MODULES                    │  │
│  │  • main.js (App Logic)                               │  │
│  │  • chat.js (Chat Interface)                          │  │
│  │  • router.js (Navigation)                            │  │
│  │  • boot-includes.js (Partial Loader)                 │  │
│  │  • voice.js (TTS)                                    │  │
│  │  • core/state.js, utils.js, i18n.js                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   STYLESHEETS                         │  │
│  │  • base.css → brand.css → components.css             │  │
│  │  • theme-pmerit.css → responsive.css                 │  │
│  │  • clean-mobile.css, unified-design-system.css       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Mobile Menu Architecture (index.html)

```
┌─────────────────────────────────────────────────────────────┐
│                        MOBILE LAYOUT                         │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │                PMERIT HEADER (Fixed)                   │  │
│  │  [☰] PMERIT                              [Grid] [Sign In] │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              MAIN CONTENT (Scrollable)                 │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │         AI Greeting Section                      │ │  │
│  │  │  🤖 PMERIT                                       │ │  │
│  │  │  Welcome message...                              │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │         Chat Interface                           │ │  │
│  │  │  [Textarea]                                      │ │  │
│  │  │  [0/1000]                          [Send Button] │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              GOOGLE FOOTER (Fixed)                     │  │
│  │  Privacy & Terms  |  Connected  |  Settings            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

When [☰] clicked:
┌─────────────────────────────────────────────────────────────┐
│  [Dark Overlay]                                              │
│  ┌─────────────────────────────────┐                        │
│  │   SIDE MENU (left: 0)          │                        │
│  │                                 │                        │
│  │  🎓 PMERIT                      │                        │
│  │                                 │                        │
│  │  Welcome to PMERIT              │                        │
│  │  [Sign In Button]               │                        │
│  │                                 │                        │
│  │  ⚡ Quick Actions                │                        │
│  │  • Virtual Human Mode [Toggle] │                        │
│  │  • Customer Service [Toggle]   │                        │
│  │  • Career Track & Explore →    │                        │
│  │                                 │                        │
│  │  🎯 Learning Tools              │                        │
│  │  • Begin Assessment             │                        │
│  │  • Discover Your Path (AI)     │                        │
│  │  • Personalized Learning Plan  │                        │
│  │                                 │                        │
│  │  ⚙️ Settings ▼                  │                        │
│  │    • Dark Mode [Toggle]        │                        │
│  │    • Text-to-Speech [Toggle]   │                        │
│  │    • Preview Voices →          │                        │
│  │                                 │                        │
│  │  [📊 Dashboard Button]          │                        │
│  └─────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Desktop Three-Panel Layout (Blueprint)

```
┌─────────────────────────────────────────────────────────────┐
│                     HEADER (Fixed)                           │
│  [☰] PMERIT                          [Language] [Sign In]   │
└─────────────────────────────────────────────────────────────┘
┌────────────┬────────────────────────────────┬───────────────┐
│   LEFT     │       CENTER PANEL              │     RIGHT     │
│  SIDEBAR   │                                 │   SIDEBAR     │
│            │                                 │               │
│ Quick      │  ┌──────────────────────────┐  │  Support      │
│ Actions    │  │  VH/CS Mode Badges       │  │  Assistant    │
│            │  └──────────────────────────┘  │               │
│ [VH Toggle]│                                 │  Discover     │
│ [CS Toggle]│  ┌──────────────────────────┐  │  Your Path    │
│            │  │                          │  │               │
│ Career     │  │     Chat Messages        │  │  [Begin       │
│ Track      │  │                          │  │  Assessment]  │
│            │  │  🤖 AI: Welcome...       │  │               │
│ ⚙️ Settings │  │  👤 You: Hello          │  │  Based on     │
│  • Dark    │  │  🤖 AI: How can I...    │  │  your         │
│  • TTS     │  │                          │  │  interests... │
│            │  └──────────────────────────┘  │               │
│ [Dashboard]│                                 │               │
│            │  ┌──────────────────────────┐  │               │
│ [VH Avatar]│  │  [Textarea]              │  │               │
│            │  │  [0/1000]       [Send]   │  │               │
│            │  └──────────────────────────┘  │               │
│            │                                 │               │
└────────────┴────────────────────────────────┴───────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     FOOTER (Fixed)                           │
│         Privacy & Terms  |  Connected  |  Settings           │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow: User Action → AI Response

```
USER TYPES MESSAGE IN CHAT
        ↓
[chatInput.value]
        ↓
USER CLICKS [Send] or PRESSES [Enter]
        ↓
sendMessage() in chat.js
        ↓
addMessage('You', text, true)
        │
        ├─→ Creates message bubble
        ├─→ Appends to chatBody
        └─→ Scrolls to bottom
        ↓
showTypingIndicator()
        ↓
setTimeout(1500ms)
        ↓
AI RESPONSE LOGIC
  │
  ├─ If state.support = true
  │   └─→ Support message
  │
  └─ Else
      └─→ AI assistance message
        ↓
addMessage('PMERIT AI', reply)
        │
        ├─→ Creates message bubble
        ├─→ Appends to chatBody
        ├─→ Scrolls to bottom
        │
        ├─→ If state.tts = true
        │   └─→ speechSynthesis.speak(text)
        │
        └─→ If state.vh = true
            └─→ Update captions
```

### Authentication Flow

```
USER CLICKS [Sign In] Button
        ↓
showAuthModal() in main.js
        ↓
authModal.classList.remove('hidden')
        ↓
USER ENTERS EMAIL/PASSWORD
        ↓
USER CLICKS [Next] Button
        ↓
Email Validation (Regex)
        │
        ├─ Valid → Proceed
        │   └─→ hideAuthModal()
        │   └─→ Show success message
        │   └─→ In production: API call to authenticate
        │
        └─ Invalid → Show error
            └─→ emailInput.classList.add('error')
            └─→ Focus input
            └─→ Clear error after 3s
```

### Toggle Switch Flow

```
USER CLICKS TOGGLE SWITCH
        ↓
'change' event on .modern-toggle
        ↓
initializeModernToggles() handler
        ↓
Determine toggleId
        │
        ├─ darkModeToggle
        │   └─→ setDark(checked)
        │   └─→ localStorage.setItem('darkModeToggle', checked)
        │
        ├─ virtualHumanToggle
        │   └─→ document.body.classList.toggle('virtual-human-mode')
        │   └─→ showVirtualHumanWelcome()
        │   └─→ Update VH UI (show VH stage, hide text chat)
        │
        ├─ customerServiceToggle
        │   └─→ document.body.classList.toggle('customer-service-mode')
        │   └─→ Update CS UI (show support badge)
        │
        ├─ ttsToggle
        │   └─→ document.body.classList.toggle('tts-enabled')
        │   └─→ Test TTS if enabled
        │
        └─ Other toggles...
            └─→ Update state and UI accordingly
```

---

## 🎯 Key File Relationships Summary

### Primary Interaction Chains

1. **User Loads Site**
   - `index.html` → loads CSS (base → brand → components → theme → responsive)
   - `index.html` → loads JS (boot-includes → router → chat → main)
   - `boot-includes.js` → fetches `partials/header.html` and `partials/footer.html`
   - `main.js` → initializes all event listeners and state

2. **User Opens Mobile Menu**
   - User clicks `#menuToggle` (hamburger button)
   - `main.js:toggleMenu()` → adds `.active` class to `#sideMenu` and `#menuOverlay`
   - `responsive.css` → animates menu (left: -100% → left: 0)

3. **User Sends Chat Message**
   - User types in `#chatInput`
   - User clicks `#sendBtn` or presses Enter
   - `chat.js:sendMessage()` → calls `addMessage()` for user message
   - `chat.js:sendMessage()` → setTimeout 1.5s → calls `addMessage()` for AI response
   - If TTS enabled → `speechSynthesis.speak()`

4. **User Navigates to Another Page**
   - User clicks menu item (e.g., "Courses")
   - `partials/header.html` → `<a href="courses.html">`
   - Browser loads `courses.html` (currently placeholder)
   - `courses.html` would load same CSS/JS and partials

5. **User Toggles Virtual Human Mode**
   - User clicks Virtual Human toggle switch
   - `main.js:initializeModernToggles()` → detects `#virtualHumanToggle` change
   - `main.js:toggleVirtualHumanMode()` → updates UI
   - Desktop: Show `#vhStage`, hide `#textChat`, show `#vhBadge`

### CSS Cascade

```
base.css
  ├─ Sets foundation (reset, typography, base colors)
  └─→ brand.css
       ├─ Applies PMERIT brand colors
       └─→ components.css
            ├─ Defines UI component styles
            └─→ theme-pmerit.css
                 ├─ Defines CSS variables
                 └─→ responsive.css
                      └─ Overrides for mobile/tablet/desktop
```

### JavaScript Load Order

```
1. boot-includes.js (First - loads partials)
2. router.js (Second - sets up navigation)
3. chat.js (Third - chat functionality)
4. main.js (Last - primary logic, depends on others)
```

---

## 🚀 Development Workflow

### Adding a New Page

1. Create HTML file in root (e.g., `my-page.html`)
2. Add to `partials/header.html` menu if needed
3. Include standard CSS:
   ```html
   <link rel="stylesheet" href="assets/css/base.css">
   <link rel="stylesheet" href="assets/css/brand.css">
   <link rel="stylesheet" href="assets/css/components.css">
   <link rel="stylesheet" href="assets/css/theme-pmerit.css">
   <link rel="stylesheet" href="assets/css/responsive.css">
   ```
4. Include standard JS:
   ```html
   <script src="assets/js/boot-includes.js"></script>
   <script src="assets/js/router.js"></script>
   <script src="assets/js/main.js"></script>
   ```
5. Add partial containers:
   ```html
   <div id="header-container"></div>
   <!-- Your content -->
   <div id="footer-container"></div>
   ```

### Adding a New Component

1. Add HTML structure in page or partial
2. Add styles to `assets/css/components.css`
3. Add JavaScript logic to `assets/js/main.js`
4. Update `assets/css/responsive.css` for mobile responsiveness

### Adding a New Modal

1. Add `<dialog>` to `partials/footer.html`
2. Add open button handler to `main.js`
3. Add close button handler to `main.js`
4. Style modal in `components.css`

---

## 📊 File Statistics

### By Type

```
HTML Pages:     30+ files
JavaScript:     10+ files (1,400+ total lines)
CSS:            7 files (1,000+ total lines)
Markdown:       10+ files (5,631 lines)
Partials:       4 files
Functions:      2+ files
Admin:          4 files
```

### By Status

```
Completed:      15 files (index.html, main.js, etc.)
In Progress:    5 files (classroom.html, learner-portal.html)
Placeholder:    20+ files (assessment.html, career.html, etc.)
```

---

## 🔄 Future Enhancements

### Planned Files (From Strategic Plan)

1. **assessment.html** - Full career assessment interface
2. **career.html** - Career exploration with BLS API integration
3. **courses.html** - Course catalog with filtering
4. **library.html** - Resource library with offline sync
5. **certificates.html** - Certificate management with blockchain
6. **progress.html** - Progress tracking with analytics
7. **profile.html** - User profile with MFA
8. **admin/content.html** - CMS interface
9. **admin/reports.html** - Analytics dashboard

### Planned Features

1. **Real AI Integration** - Connect to ai.pmerit.com
2. **Database Integration** - PostgreSQL CRUD operations
3. **Authentication** - JWT-based auth with MFA
4. **Internationalization** - Full i18n implementation
5. **PWA Features** - Service worker, offline mode
6. **Payment Integration** - Stripe/PayPal for donations
7. **Video Conferencing** - WebRTC for live classes
8. **Blockchain Certificates** - NFT-based certificates

---

## 📝 Maintenance Notes

### Code Quality

- **DRY Principle**: Partials used for header/footer
- **Modular JS**: Separate files for concerns
- **CSS Variables**: Easy theme customization
- **Responsive**: Mobile-first approach
- **Accessible**: ARIA labels, keyboard navigation

### Known Issues

1. Many pages are placeholders (2 lines each)
2. Some duplicate CSS classes (noted in responsive.css)
3. Mock AI responses (needs real API integration)
4. LocalStorage only (no backend persistence yet)

### Best Practices

1. Always test mobile-first
2. Use CSS variables from theme-pmerit.css
3. Add new components to components.css
4. Update this documentation when adding files
5. Follow existing naming conventions

---

## 🎓 Learning Resources

### Understanding the Codebase

1. Start with `index.html` - understand the structure
2. Read `main.js` - understand the interactions
3. Review `responsive.css` - understand mobile behavior
4. Check `partials/` - understand component reuse

### Key Concepts

- **Three-Panel Layout**: Desktop view (left sidebar, center, right sidebar)
- **Mobile-First**: Design starts small, enhances for larger screens
- **Progressive Enhancement**: Basic functionality works, enhanced features optional
- **Accessibility**: Screen reader support, keyboard navigation
- **Performance**: Minimal dependencies, efficient CSS

---

## 📞 Support & Contact

For questions about this documentation or the codebase:

- **Repository**: https://github.com/peoplemerit/pmerit-ai-platform
- **Website**: https://pmerit.com
- **Documentation**: See `.copilot/` and `doc/` directories

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Maintained By**: PMERIT Development Team  
**License**: Per repository LICENSE file

---

*This documentation is a living document. Please keep it updated as files are added, modified, or removed.*
