# 🧠 Copilot Review Instructions for PMERIT Platform

## 🎯 Goal
Ensure the frontend code is **consistent, responsive, accessible**, and visually aligned with the PMERIT brand specifications.

---

## 🗂️ Reference Files
Found in `.copilot/` folder:
- **`Pmerit-theme_typography.html`** – Official brand colors, fonts, and typography system
  - Colors: Dark Blue (#2A5B8C), Teal (#4AA4B9), Coral (#FF6B6B)
  - Fonts: Montserrat (headings), Inter (body text)
- **`blueprint-index.html`** – Desktop layout reference with three-panel design
- **`PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md`** – Strategic roadmap
- **`USER-ACCESS-&-FLOW-WALKTHROUGH.md`** – User journey documentation

---

## 🔍 Review Priorities

### 1. **Design Consistency**
- ✅ Fonts match spec: Montserrat for headings, Inter for body
- ✅ Colors use brand palette from `Pmerit-theme_typography.html`
- ✅ Header and footer consistent across all pages
- ✅ Spacing follows 4px/8px grid system
- ❌ Flag any hardcoded colors not in the brand palette

### 2. **Responsiveness**
- ✅ **Mobile (320px-767px):**
  - Non-scrollable viewport (chat area scrolls internally)
  - Hamburger menu for navigation
  - Simplified footer (Privacy & Terms only)
  - Safe-area-inset for iPhone notch
  - Dynamic viewport height (`100dvh` for iOS)
- ✅ **Desktop (1024px+):**
  - Three-panel grid layout
  - Persistent left sidebar
  - Full footer with all links
- ❌ Check for horizontal scroll issues
- ❌ Verify orientation changes work properly

### 3. **Accessibility**
- ✅ Use semantic HTML5 (`<header>`, `<main>`, `<footer>`, `<nav>`)
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ ARIA labels for interactive elements
- ✅ Alt text for all images
- ✅ Minimum 44px touch targets for mobile buttons
- ✅ Readable contrast ratios (WCAG AA minimum)
- ❌ Flag missing alt text or ARIA labels

### 4. **Code Structure**
- ✅ **HTML:**
  - Semantic elements
  - Clean indentation (2 spaces)
  - No inline styles or scripts
  - Proper meta tags (viewport, charset)
- ✅ **CSS:**
  - CSS variables for all colors/fonts
  - Mobile-first media queries
  - BEM or utility-based naming
  - No `!important` unless justified
- ✅ **JavaScript:**
  - Modular functions
  - No global variables (use ES6 modules)
  - Event listeners (not inline onclick)
  - Descriptive function names
- ❌ Flag any inline styles, inline scripts, or global variables

### 5. **Performance**
- ✅ Optimize asset loading (defer/async scripts)
- ✅ Minimize CSS and JS file sizes
- ✅ Lazy load images where appropriate
- ❌ Flag large unoptimized images

---

## ⚙️ Validation Checklist

When reviewing a file, check:

- [ ] Color values match brand palette
- [ ] Fonts use Montserrat/Inter as specified
- [ ] Responsive breakpoints work correctly
- [ ] No horizontal scroll on mobile
- [ ] Touch targets are at least 44px
- [ ] Semantic HTML elements used
- [ ] ARIA labels present where needed
- [ ] CSS uses variables (not hardcoded values)
- [ ] JavaScript is modular and clean
- [ ] No console.log statements in production code

---

## 🧾 Output Format

Copilot should provide:

### **Constructive Comments:**
```
🤖 Copilot Review: This button has a 36px height, which is below 
the 44px minimum for mobile touch targets. Consider increasing to 
at least 44px for better accessibility.
```

### **Specific Suggestions:**
```
🤖 Copilot Review: Replace hardcoded color #2563EB with CSS variable 
var(--primary). This ensures consistency with the brand palette defined 
in Pmerit-theme_typography.html.
```

### **Before/After Examples:**
```
🤖 Copilot Review: 
❌ Before: <div class="menu">
✅ After:  <nav class="navigation-menu">
Semantic HTML improves accessibility and SEO.
```

---

## 🚫 What NOT to Review

Do **not** provide feedback on:
- Image files (`.jpg`, `.png`, `.svg`)
- Reference files in `.copilot/` folder
- Documentation files (`.md`)
- Configuration files (`.yml`, `.json`)

---

## 📌 Key Design Requirements

### Mobile Header (Google-style)
- **Left:** PMERIT logo + name
- **Right:** Language Switcher → Hamburger Menu → Sign-in button
- **Hamburger Menu Contains:**
  - Virtual Human Mode
  - Career Track & Explore Paths
  - Customer Service Mode
  - Settings (Dark Mode, Text-to-Speech)
  - Preview Voices
  - Dashboard
  - Begin Assessment

### Mobile Footer
- **Contents:** Privacy & Terms | Connected to Educational Services
- **Position:** Fixed at bottom with safe-area padding

### Desktop Layout
- **Left Sidebar:** Quick Actions, Settings, Navigation
- **Center:** Main content/chat area
- **Right Panel:** Support Assistant
- **Footer:** Full links and information

---

## 🔄 Review Workflow

1. **On Push/PR** → Copilot automatically reviews changed files
2. **Check against** → `.copilot/config.yml` and this instructions file
3. **Post comments** → Inline feedback with 🤖 prefix
4. **Suggest fixes** → Provide actionable improvements
5. **Flag critical issues** → Security, accessibility, or broken functionality

---

## ✅ Success Criteria

A file passes review when:
- ✅ All brand colors/fonts are consistent
- ✅ Responsive design works on 320px and 1920px screens
- ✅ No accessibility violations
- ✅ Clean, modular code structure
- ✅ No hardcoded values (uses CSS variables)
- ✅ Passes HTML/CSS/JS lint checks

---

**Remember:** The goal is **constructive feedback** that helps maintain a clean, consistent, and accessible codebase. Focus on actionable improvements, not nitpicks.
