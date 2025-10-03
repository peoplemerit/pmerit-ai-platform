# PMERIT Platform - Quick Reference Guide

> 🚀 Fast lookup for developers - See FILE_DOCUMENTATION.md for detailed information

---

## 📁 Essential Files

### Core Pages (Working)
- **index.html** (510 lines) - Main landing page with AI chat
- **learner-portal.html** - Student dashboard with Mermaid flowchart
- **classroom.html** - Virtual classroom with notes and resources

### JavaScript (Priority)
- **main.js** (1213 lines) - Primary app logic & event handling
- **chat.js** (69 lines) - Chat interface & AI responses
- **router.js** (137 lines) - Navigation & partial loading
- **boot-includes.js** - Dynamic partial loader

### CSS (Priority)
- **base.css** - Foundation & reset
- **brand.css** - PMERIT colors (#4F46E5, #7C3AED)
- **components.css** - UI components (buttons, modals, cards)
- **responsive.css** - Mobile-first breakpoints
- **theme-pmerit.css** - CSS variables

### Partials (Shared)
- **partials/header.html** (65 lines) - Navigation header
- **partials/footer.html** (102 lines) - Footer + modals
- **partials/nav.html** - Menu structure

---

## 🎯 Key Features

### Mobile Menu
- **Trigger**: `#menuToggle` button
- **Container**: `#sideMenu`
- **Overlay**: `#menuOverlay`
- **Animation**: `left: -100%` → `left: 0` (responsive.css)
- **Handler**: `main.js:toggleMenu()`

### Toggle Switches
- Virtual Human Mode (`#virtualHumanToggle`)
- Customer Service Mode (`#customerServiceToggle`)
- Dark Mode (`#darkModeToggle`)
- Text-to-Speech (`#ttsToggle`)
- **Handler**: `main.js:initializeModernToggles()`

### Modals
- Sign In (`#authModal`)
- Sign Up (`#signUpModal`)
- Assessment (`#assessmentModal`)
- Career Tracks (`#tracksModal`)
- Voice Preview (`#voicesModal`)

---

## 🔗 File Dependencies

### Load Order
```
1. HTML loads
2. CSS: base → brand → components → theme → responsive
3. JS: boot-includes → router → chat → main
4. Partials: header.html, footer.html injected
5. Event listeners attached
```

### Page Navigation
```
index.html
├── learner-portal.html (Dashboard)
│   ├── classroom.html (Learning)
│   ├── progress.html (Tracking)
│   └── certificates.html (Awards)
├── assessment.html (Career Test)
├── career.html (Job Market)
└── courses.html (Catalog)
```

---

## 💡 Common Tasks

### Add a New Page
1. Create `my-page.html`
2. Include standard CSS (base, brand, components, theme, responsive)
3. Include standard JS (boot-includes, router, main)
4. Add to `partials/header.html` menu

### Add a New Component
1. Add HTML structure
2. Style in `components.css`
3. Logic in `main.js`
4. Mobile styles in `responsive.css`

### Add a New Modal
1. Add `<dialog>` to `partials/footer.html`
2. Open handler in `main.js`
3. Close handler in `main.js`
4. Style in `components.css`

---

## 🎨 Brand Colors

```css
Primary:    #4F46E5 (Indigo)
Accent:     #7C3AED (Purple)
Background: #FFFFFF (White)
Secondary:  #F9FAFB (Light Gray)
Text:       #1F2937 (Dark Gray)
Border:     #E5E7EB (Light Border)
Success:    #10B981 (Green)
Warning:    #F59E0B (Orange)
Error:      #EF4444 (Red)
```

---

## 📊 Statistics

- **Total HTML Pages**: 30+
- **Working Pages**: 3 (index, learner-portal, classroom)
- **Placeholder Pages**: 27
- **JavaScript Files**: 10+ (1,400+ lines)
- **CSS Files**: 7 (1,000+ lines)
- **Partials**: 4 files
- **Documentation**: 10+ files (5,631 lines)

---

## 🔧 Development

### Local Server
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PowerShell (see server.ps1)
```

### File Structure
```
pmerit-ai-platform/
├── assets/
│   ├── css/         # 7 stylesheet files
│   └── js/          # 10+ JavaScript files
├── partials/        # 4 reusable components
├── functions/       # 2 API functions
├── admin/           # 4 admin pages
├── doc/             # 5 documentation files
├── .copilot/        # 3 strategic documents
├── *.html          # 30+ page files
└── *.md            # 10+ markdown docs
```

---

## 🚀 Quick Links

- **Main Documentation**: [FILE_DOCUMENTATION.md](FILE_DOCUMENTATION.md)
- **Strategic Plan**: [.copilot/PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md](.copilot/PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md)
- **User Flow**: [.copilot/USER-ACCESS-&-FLOW-WALKTHROUGH.md](.copilot/USER-ACCESS-&-FLOW-WALKTHROUGH.md)
- **Repository**: https://github.com/peoplemerit/pmerit-ai-platform
- **Website**: https://pmerit.com

---

## 🎓 Key Concepts

- **Mobile-First**: Design starts at 320px width
- **Three-Panel Layout**: Desktop has left/center/right panels
- **Progressive Enhancement**: Basic works, enhanced optional
- **Component Reuse**: Partials for DRY principle
- **Modular JavaScript**: Separate concerns into files

---

**Version**: 1.0  
**Last Updated**: January 2025  
**See**: FILE_DOCUMENTATION.md for complete details
