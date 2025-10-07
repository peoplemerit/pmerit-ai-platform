---
role: claude
task: frontend_implementation
project: pmerit_platform
description: Execute full frontend implementation from blueprint using modular HTML, CSS, and JS structure; apply Pmerit theme and ensure full responsiveness.
---

# 🚀 Frontend Implementation Guide — Claude Version

## 🎯 Objective
Implement the full frontend of the **PMERIT Platform** using the one-page `.copilot/blueprint-index.html` and its corresponding visual references as the design blueprint.  

Replace temporary styles with the brand theme defined in `.copilot/Pmerit-theme_typography.html`.

---

## 🧱 Core Requirements

- Replace all fonts and colors with **PMERIT brand styles**
- Implement **non-scrollable, responsive mobile UI** with orientation support
- Maintain **consistent header, footer, and color scheme** across all 28+ pages
- **No patchwork:** every file produced replaces existing ones
- You may override and restructure the repo directories as needed for consistency and maintainability

---

## 🎨 Brand Specifications

### Colors (from Pmerit-theme_typography.html)
- **Primary:** #2A5B8C (Dark Blue)
- **Secondary:** #4AA4B9 (Teal)
- **Accent:** #FF6B6B (Coral)
- **Success:** #3A7F5C (Green)
- **Warning:** #E67E22 (Orange)

### Typography
- **Headings:** Montserrat, sans-serif
- **Body:** Inter, sans-serif
- **Sizes:** h1 (32px), h2 (24px), h3 (20px), body (16px), small (14px)

---

## 📲 Mobile Design (Google-style)

### Header
- **Left:** PMERIT logo + name  
- **Right:** Language Switcher → Hamburger Menu → Sign-in (modal with Sign-up)  

### Hamburger Menu items:
- Virtual Human Mode  
- Career Track & Explore Paths  
- Customer Service Mode  
- Settings (Dark Mode, Text-to-Speech)  
- Preview Voices  
- Dashboard  
- Begin Assessment  

### Footer
- **Mobile:** Privacy & Terms | Connected to Educational Services  
- **Desktop:** Keep as in blueprint  

### Body
- Non-scrollable viewport
- Chat area scrolls only within prompt-response container
- Dynamic viewport height (`100dvh` for iOS)
- Safe-area-inset for iPhone notch
- Minimum 44px touch targets

---

## 💻 Desktop Design

- Maintain `.copilot/blueprint-index.html` layout
- Three-panel grid: Left sidebar (280px) | Main content (1fr) | Right panel (320px)
- Persistent left sidebar with navigation
- Full footer with all links
- Ensure responsiveness and consistent branding

---

## ⚙️ Implementation Phases

### Phase 1 – Setup & Theme Foundation
**Duration:** 4-6 hours

Tasks:
- [ ] Review blueprint and identify reusable components
- [ ] Create clean directory structure:
  ```
  assets/
    css/
      theme-variables.css
      base.css
      typography.css
      components.css
      mobile.css
      desktop.css
    js/
      menu.js
      modal.js
      chat.js
      main.js
    img/
  partials/
    header.html
    footer.html
    nav.html
    body.html
  index.html
  ```
- [ ] Extract brand colors/fonts from `Pmerit-theme_typography.html`
- [ ] Create `theme-variables.css` with all CSS custom properties
- [ ] Delete or override inconsistent files

**Deliverables:**
- ✅ Complete directory structure
- ✅ `theme-variables.css` with brand colors, fonts, spacing
- ✅ `base.css` with CSS reset and mobile-first foundation

---

### Phase 2 – Mobile Header & Navigation
**Duration:** 6-8 hours

Tasks:
- [ ] Build mobile header HTML structure
- [ ] Create hamburger menu with slide-in animation
- [ ] Add menu overlay backdrop
- [ ] Implement all hamburger menu items
- [ ] Add language switcher dropdown
- [ ] Create sign-in modal (Google-style with Sign-in/Sign-up tabs)
- [ ] Test responsive behavior on 320px screens
- [ ] Add safe-area-inset for iOS
- [ ] Ensure 44px minimum touch targets

**Deliverables:**
- ✅ `partials/header.html` (mobile + desktop versions)
- ✅ `assets/css/components.css` (header, menu, modal styles)
- ✅ `assets/js/menu.js` (hamburger menu controller)
- ✅ `assets/js/modal.js` (modal controller)

---

### Phase 3 – Mobile Body & Chat Interface
**Duration:** 6-8 hours

Tasks:
- [ ] Build non-scrollable viewport container (`100dvh`)
- [ ] Create hero/welcome section with gradient
- [ ] Build scrollable chat container within body
- [ ] Implement message bubbles (user/AI)
- [ ] Add auto-scroll to latest message
- [ ] Create typing indicators
- [ ] Build fixed input bar at bottom
- [ ] Add safe-area-inset to input bar
- [ ] Test chat scrolling behavior

**Deliverables:**
- ✅ `partials/body.html` (chat interface structure)
- ✅ `assets/css/mobile.css` (chat styles)
- ✅ `assets/js/chat.js` (chat functionality)

---

### Phase 4 – Mobile Footer
**Duration:** 2-3 hours

Tasks:
- [ ] Create simplified mobile footer
- [ ] Add "Privacy & Terms" link
- [ ] Add "Connected to Educational Services" indicator
- [ ] Implement safe-area-inset-bottom for iOS
- [ ] Ensure proper spacing from chat input
- [ ] Test on iPhone with notch

**Deliverables:**
- ✅ `partials/footer.html` (mobile + desktop versions)
- ✅ Footer styles in `assets/css/mobile.css`

---

### Phase 5 – Desktop Responsive Adaptation
**Duration:** 6-8 hours

Tasks:
- [ ] Implement three-panel grid layout (1024px+)
- [ ] Build left sidebar with Quick Actions, Settings
- [ ] Create right panel for Support Assistant
- [ ] Hide mobile-only elements on desktop (hamburger, simplified footer)
- [ ] Show desktop-only elements (full sidebar, extended footer)
- [ ] Add responsive breakpoint (~1024px)
- [ ] Test responsive behavior from 320px to 1920px
- [ ] Ensure smooth transitions between breakpoints

**Deliverables:**
- ✅ `assets/css/desktop.css` (desktop-specific styles)
- ✅ Three-panel grid layout working
- ✅ Responsive media queries in place

---

### Phase 6 – Interactive Features & Polish
**Duration:** 8-10 hours

Tasks:
- [ ] Implement all toggle switches (Dark Mode, TTS, VH Mode, CS Mode)
- [ ] Build Career Tracks explorer modal
- [ ] Create Assessment flow pages
- [ ] Add voice preview functionality
- [ ] Implement transitions and animations:
  - Menu slide-in/out
  - Button hovers
  - Modal fade-in/out
  - Toast notifications
- [ ] Add accessibility features:
  - Focus states (visible outline)
  - ARIA labels on all interactive elements
  - Keyboard navigation (Tab, Enter, Escape)
  - Screen reader support
- [ ] Test across devices:
  - iPhone (portrait/landscape)
  - iPad (portrait/landscape)
  - Android phones
  - Desktop (Chrome, Firefox, Safari)
- [ ] Performance optimization:
  - Minify CSS/JS
  - Lazy load images
  - Defer non-critical scripts

**Deliverables:**
- ✅ All interactive features working
- ✅ Modal system complete
- ✅ Animation polish
- ✅ Accessibility compliance (WCAG AA)
- ✅ Cross-device testing complete

---

## ✅ Claude Task Checklist

- [ ] File structure consistent with new layout  
- [ ] All components modularized (HTML/CSS/JS)  
- [ ] Header/footer responsive and functional  
- [ ] Fonts/colors match brand specification (Pmerit-theme_typography.html)
- [ ] Chat area implemented with correct behavior  
- [ ] Mobile/desktop tested and responsive  
- [ ] Code validated (HTML/CSS/JS standards)
- [ ] Safe-area-inset implemented for iOS
- [ ] 44px minimum touch targets on mobile
- [ ] Dynamic viewport height (dvh) used
- [ ] CSS variables used (no hardcoded colors)
- [ ] Mobile-first media queries
- [ ] Accessibility features complete (ARIA, focus states)
- [ ] No inline styles or scripts
- [ ] No console.log statements in production code

---

## 🔄 Notes

- Identify and add missing blueprint elements
- Deliver clean, production-ready code with modular organization
- Output files replace existing ones, ensuring full design coherence
- Reference `.copilot/config.yml` and `.copilot/instructions.md` for standards
- Follow `.copilot/hints/` for HTML, CSS, and JS best practices
- Create GitHub commits with clear, descriptive messages
- Request Copilot review before marking phases complete

---

## 📚 Reference Files

Located in `.copilot/` folder:
- **Pmerit-theme_typography.html** – Official brand colors, fonts, typography
- **blueprint-index.html** – Desktop layout reference
- **PMERIT-Strategic-Plan-Unified-&-Current(v4.0).md** – Strategic roadmap
- **USER-ACCESS-&-FLOW-WALKTHROUGH.md** – User journey documentation

---

## 🚀 Getting Started

1. **Review** the blueprint and theme files
2. **Create** the directory structure
3. **Extract** brand variables into `theme-variables.css`
4. **Build** components phase by phase
5. **Test** at each phase (mobile first, then desktop)
6. **Commit** regularly with descriptive messages
7. **Request** Copilot review via GitHub Actions

---

**Remember:** Quality over speed. Build a solid foundation in Phase 1-2, and the rest will flow smoothly. Focus on mobile-first, then enhance for desktop.

**End of Claude Instructions**
