# 📦 PMERIT Platform - Component Documentation

**Version:** 2.0  
**Last Updated:** October 2025  
**Purpose:** Document all reusable components for scaling to 28+ pages

---

## 🎯 Component Architecture Overview

The PMERIT platform uses a modular component architecture with clear separation of concerns:

```
assets/
├── css/
│   ├── theme-variables.css  ← Single source of truth for design tokens
│   ├── base.css            ← Global resets and base styles
│   ├── typography.css      ← Font and text styling
│   ├── components.css      ← Reusable UI components
│   ├── mobile.css          ← Mobile-specific overrides
│   └── desktop.css         ← Desktop layout and styles
├── js/
│   ├── main.js             ← Core application logic
│   ├── chat.js             ← Chat interface functionality
│   ├── menu.js             ← Menu system (hamburger, navigation)
│   └── modal.js            ← Modal dialogs
└── partials/
    ├── header.html         ← Site-wide header (not yet implemented)
    ├── footer.html         ← Site-wide footer (not yet implemented)
    └── nav.html            ← Navigation menu (placeholder)
```

---

## 🎨 Design Token System

All design tokens are defined in `assets/css/theme-variables.css` as CSS custom properties.

### Color Variables

```css
/* Brand Colors */
--color-primary: #2A5B8C      /* Dark Blue */
--color-secondary: #4AA4B9    /* Teal */
--color-accent: #FF6B6B       /* Coral */

/* Hero Gradient */
--hero-gradient-start: #667eea /* Vibrant Purple */
--hero-gradient-end: #764ba2   /* Deep Purple */
--hero-gradient: linear-gradient(135deg, var(--hero-gradient-start) 0%, var(--hero-gradient-end) 100%)

/* Semantic Colors */
--color-success: #3A7F5C
--color-warning: #E67E22
--color-error: #DC3545
--color-info: #4AA4B9

/* Backgrounds */
--bg-primary: #F8F9FA
--bg-secondary: #FFFFFF
--bg-overlay: rgba(0, 0, 0, 0.5)
```

### Typography Variables

```css
/* Font Families */
--font-primary: 'Montserrat'   /* Headings */
--font-secondary: 'Inter'       /* Body text */

/* Font Sizes */
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px
--text-3xl: 32px
--text-4xl: 40px

/* Font Weights */
--weight-regular: 400
--weight-medium: 500
--weight-semibold: 600
--weight-bold: 700
```

### Spacing System (4px base)

```css
--space-0: 0
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
```

---

## 🧩 Core Components

### 1. Header Component

**Location:** Inline in pages (future: `partials/header.html`)

**Features:**
- Logo and brand name
- Desktop navigation links (hidden < 1024px)
- Language switcher dropdown
- Hamburger menu button (mobile only)
- Sign In button

**HTML Structure:**
```html
<header class="pmerit-header" role="banner">
  <div class="header-container">
    <div class="header-logo">...</div>
    <nav class="header-nav desktop-only">...</nav>
    <div class="header-actions">
      <div class="language-switcher">...</div>
      <button class="hamburger-button mobile-only">...</button>
      <button class="btn btn-primary sign-in-button">...</button>
    </div>
  </div>
</header>
```

**CSS Classes:**
- `.pmerit-header` - Main header container
- `.header-container` - Inner flex container
- `.header-logo` - Logo section
- `.header-nav` - Desktop navigation
- `.header-actions` - Right-side actions
- `.desktop-only` - Hidden on mobile (< 1024px)
- `.mobile-only` - Hidden on desktop (≥ 1024px)

**JavaScript Integration:**
```javascript
// Sign In button opens modal
document.getElementById('sign-in-btn').addEventListener('click', openAuthModal);

// Hamburger button opens menu (mobile)
document.getElementById('hamburger-toggle').addEventListener('click', openMenu);
```

---

### 2. Hamburger Menu Component

**Location:** Inline in pages (managed by `assets/js/main.js`)

**Features:**
- Slide-in panel from right
- Overlay backdrop
- All navigation items from spec
- Expandable Settings submenu
- Close on ESC, backdrop click, or close button

**HTML Structure:**
```html
<div id="hamburger-menu" class="mobile-menu" role="dialog" aria-modal="true" aria-hidden="true">
  <div id="menu-overlay" class="menu-overlay"></div>
  <div class="menu-panel">
    <div class="menu-header">
      <span class="menu-title">Menu</span>
      <button id="menu-close" class="menu-close">×</button>
    </div>
    <nav class="menu-nav">
      <ul class="menu-list">
        <li class="menu-item">...</li>
        <li class="menu-item menu-item-expandable">
          <button class="menu-link menu-toggle" aria-expanded="false">
            Settings
          </button>
          <ul class="menu-submenu">
            <li class="submenu-item">Dark Mode toggle</li>
            <li class="submenu-item">TTS toggle</li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</div>
```

**JavaScript:**
```javascript
// Open/close menu
function openMenu() { ... }
function closeMenu() { ... }

// Submenu toggle
document.querySelectorAll('.menu-toggle').forEach(toggle => {
  toggle.addEventListener('click', function() {
    // Toggle aria-expanded and display submenu
  });
});
```

---

### 3. Modal Component

**Location:** Inline in pages (managed by `assets/js/main.js`)

**Features:**
- Tab-based authentication (Sign In / Sign Up)
- Backdrop overlay
- Close button and ESC key support
- Focus trap
- Prevent body scroll when open

**HTML Structure:**
```html
<div id="sign-in-modal" class="modal" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="modal-backdrop"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Welcome to PMERIT</h2>
      <button id="modal-close" class="modal-close">×</button>
    </div>
    <div class="modal-tabs" role="tablist">
      <button role="tab" id="signin-tab" aria-selected="true">Sign In</button>
      <button role="tab" id="signup-tab" aria-selected="false">Sign Up</button>
    </div>
    <div class="modal-body tab-panel active" role="tabpanel" id="signin-panel">
      <form id="signin-form">...</form>
    </div>
    <div class="modal-body tab-panel" role="tabpanel" id="signup-panel" aria-hidden="true">
      <form id="signup-form">...</form>
    </div>
  </div>
</div>
```

**JavaScript:**
```javascript
function openAuthModal() {
  const modal = document.getElementById('sign-in-modal');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const modal = document.getElementById('sign-in-modal');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Tab switching
document.getElementById('signin-tab').addEventListener('click', () => {
  // Switch to sign-in panel
});
```

---

### 4. Chat Interface Component

**Location:** Inline in pages (managed by `assets/js/chat.js`)

**Features:**
- Dual-mode: mobile and desktop layouts
- Dynamic message rendering
- Typing indicator
- Character counter
- Auto-resize textarea
- Scrollable message area

**HTML Structure (Mobile):**
```html
<main class="main-container mobile-only">
  <section class="hero-section">...</section>
  
  <div class="chat-messages" id="mobile-chat-messages" role="log">
    <!-- Messages inserted by JS -->
  </div>
  
  <div class="chat-input-container">
    <div class="chat-input-wrapper">
      <textarea id="mobile-chat-input" class="chat-input"></textarea>
      <button id="mobile-send-btn" class="chat-send-btn">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
    <div class="chat-input-footer">
      <span id="mobile-char-count">0/1000</span>
    </div>
  </div>
</main>
```

**JavaScript:**
```javascript
// Send message
function sendMessage(layout = 'mobile') {
  const inputId = layout === 'mobile' ? 'mobile-chat-input' : 'desktop-chat-input';
  const input = document.getElementById(inputId);
  const message = input.value.trim();
  
  if (message === '') return;
  
  addMessage('user', message, layout);
  input.value = '';
  
  // Show typing indicator and generate AI response
  showTypingIndicator(layout);
  setTimeout(() => {
    hideTypingIndicator(layout);
    const response = generateAIResponse(message);
    addMessage('ai', response, layout);
  }, 1500);
}

// Add message to chat
function addMessage(sender, text, layout) {
  const messagesId = layout === 'mobile' ? 'mobile-chat-messages' : 'desktop-chat-messages';
  const container = document.getElementById(messagesId);
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message-bubble ${sender === 'user' ? 'user-message' : 'ai-message'}`;
  // ... build message HTML
  
  container.appendChild(messageDiv);
  scrollToBottom(container);
}
```

---

### 5. Footer Component

**Location:** Inline in pages (future: `partials/footer.html`)

**Features:**
- Responsive design: simplified on mobile, full on desktop
- Status indicator (Connected to Educational Services)
- Multiple columns on desktop
- Safe-area padding for iOS devices

**HTML Structure:**
```html
<footer class="pmerit-footer" role="contentinfo">
  <!-- Mobile Footer -->
  <div class="footer-mobile mobile-only">
    <div class="footer-content">
      <a href="#privacy">Privacy & Terms</a>
      <span>•</span>
      <span class="footer-status">
        <span class="status-indicator"></span>
        Connected to Educational Services
      </span>
    </div>
  </div>
  
  <!-- Desktop Footer -->
  <div class="footer-desktop desktop-only">
    <div class="footer-grid">
      <div class="footer-column">...</div>
      <div class="footer-column">...</div>
      <div class="footer-column">...</div>
      <div class="footer-column">...</div>
    </div>
    <div class="footer-bottom">...</div>
  </div>
</footer>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Mobile (default): 0 - 767px */
/* No media query needed */

/* Tablet: 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Transitional styles */
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .mobile-only { display: none !important; }
  .desktop-only { display: block; }
  /* Desktop three-panel layout */
}

/* Large Desktop: 1440px+ */
@media (min-width: 1440px) {
  /* Wider sidebars and max-width containers */
}
```

---

## ♿ Accessibility Guidelines

### ARIA Best Practices

1. **Dialogs/Modals:**
   ```html
   <div role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-hidden="true">
     <h2 id="modal-title">Modal Title</h2>
   </div>
   ```

2. **Navigation:**
   ```html
   <nav role="navigation" aria-label="Main Navigation">
     <ul>...</ul>
   </nav>
   ```

3. **Live Regions:**
   ```html
   <div role="log" aria-live="polite" aria-atomic="false">
     <!-- Chat messages -->
   </div>
   ```

4. **Buttons:**
   ```html
   <button aria-label="Close Menu" aria-expanded="false" aria-controls="mobile-menu">
     <span class="sr-only">Close Menu</span>
     <i class="fas fa-times" aria-hidden="true"></i>
   </button>
   ```

### Keyboard Navigation

- **Tab:** Navigate between focusable elements
- **Enter/Space:** Activate buttons and links
- **Escape:** Close modals and menus
- **Arrow Keys:** Navigate within menus (optional enhancement)

### Touch Targets

- Minimum size: **44x44px** (per WCAG guidelines)
- Defined in CSS: `min-width: var(--mobile-touch-target, 44px)`

### Color Contrast

- **Text:** 4.5:1 minimum (WCAG AA)
- **UI Components:** 3:1 minimum (WCAG AA)
- **Large Text (18px+):** 3:1 minimum

---

## 🔧 Usage Examples

### Adding a New Page

1. **Copy `index.html` as template**
2. **Update page-specific content:**
   - Change `<title>`
   - Modify hero section text
   - Update chat placeholder (optional)

3. **Keep these unchanged:**
   - Header structure
   - Footer structure
   - Hamburger menu
   - Modal dialogs
   - CSS/JS imports

### Customizing Component Colors

**Never use hardcoded colors.** Always use CSS variables:

```css
/* ❌ BAD */
.my-button {
  background-color: #2A5B8C;
}

/* ✅ GOOD */
.my-button {
  background-color: var(--color-primary);
}
```

### Adding a New Component

1. **Add HTML structure** to page
2. **Add CSS** to `components.css`:
   ```css
   .my-component {
     /* Use design tokens */
     padding: var(--space-4);
     color: var(--text-primary);
     background-color: var(--bg-secondary);
   }
   ```

3. **Add JavaScript** to `main.js` or separate module:
   ```javascript
   function initializeMyComponent() {
     const component = document.getElementById('my-component');
     // Add event listeners, etc.
   }
   
   // Call in init()
   document.addEventListener('DOMContentLoaded', function() {
     initializeMyComponent();
   });
   ```

---

## 🚀 Scaling to 28+ Pages

### Recommended Approach

1. **Convert inline components to partials:**
   - Move header HTML to `partials/header.html`
   - Move footer HTML to `partials/footer.html`
   - Use server-side includes (SSI) or build tool

2. **Create page templates:**
   - Basic template (header + content + footer)
   - Dashboard template (with sidebar)
   - Assessment template (full-screen mode)

3. **Centralize JavaScript initialization:**
   - Keep `main.js` as core initializer
   - Create page-specific modules:
     ```javascript
     // assessment.js
     import { init as initCore } from './main.js';
     
     document.addEventListener('DOMContentLoaded', () => {
       initCore();
       initAssessmentSpecific();
     });
     ```

4. **Use a build system (optional):**
   - **Webpack** for JS bundling
   - **PostCSS** for CSS processing
   - **HTML includes** for partials
   - **Gulp/Grunt** for automation

### File Organization

```
pages/
├── index.html
├── about.html
├── courses/
│   ├── index.html
│   ├── programming.html
│   └── data-science.html
├── assessment/
│   ├── start.html
│   └── results.html
└── dashboard/
    ├── index.html
    ├── progress.html
    └── certificates.html
```

---

## 📝 Maintenance Checklist

- [ ] Keep `theme-variables.css` as single source of truth
- [ ] Avoid inline styles (use utility classes if needed)
- [ ] Test all changes on mobile (375px) and desktop (1280px)
- [ ] Validate ARIA attributes with axe DevTools
- [ ] Check color contrast with WebAIM tool
- [ ] Verify keyboard navigation
- [ ] Update this documentation when adding components

---

## 🐛 Common Issues & Solutions

### Issue: Modal not closing
**Solution:** Ensure `aria-hidden` is toggled and body overflow is restored.

### Issue: Chat messages not appearing
**Solution:** Check element IDs match in HTML and JavaScript.

### Issue: Styles not applying on mobile
**Solution:** Verify `mobile.css` loads after `components.css`.

### Issue: Menu submenu not expanding
**Solution:** Ensure `.menu-toggle` event listener is attached in `initializeMenu()`.

---

## 📚 Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Responsive Design Best Practices](https://web.dev/responsive-web-design-basics/)

---

**Last Reviewed:** October 10, 2025  
**Version:** 2.0  
**Maintainer:** PMERIT Development Team
