# CSS Style Guide - PMERIT Platform

## Core Principles
1. **Mobile-first** - Write base styles for mobile, enhance for desktop
2. **CSS Variables** - Use custom properties for all colors, fonts, spacing
3. **BEM Naming** - Use Block Element Modifier or utility-based classes
4. **No Inline Styles** - All styling in external CSS files
5. **Consistent Spacing** - Use 4px/8px multiples

---

## CSS Variables (Design Tokens)

### Color System
```css
:root {
  /* Brand Colors (from Pmerit-theme_typography.html) */
  --primary: #2A5B8C;         /* Dark Blue */
  --secondary: #4AA4B9;       /* Teal */
  --accent: #FF6B6B;          /* Coral */
  --success: #3A7F5C;         /* Green */
  --warning: #E67E22;         /* Orange */
  
  /* Background Colors */
  --bg-primary: #FFFFFF;      /* White */
  --bg-secondary: #F8F9FA;    /* Light Gray */
  --bg-dark: #2C2C2C;         /* Dark Gray */
  
  /* Text Colors */
  --text-primary: #2C2C2C;    /* Dark Gray */
  --text-secondary: #6C757D;  /* Medium Gray */
  --text-inverse: #FFFFFF;    /* White text */
  
  /* Border & Shadow */
  --border-color: #E5E7EB;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Typography System
```css
:root {
  /* Font Families */
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* Font Sizes */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 32px;
  
  /* Font Weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

### Spacing System
```css
:root {
  /* Base unit: 4px */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}
```

---

## Mobile-First Approach

### ✅ Correct: Mobile First
```css
/* Base styles for mobile (320px+) */
.header {
  padding: var(--space-4);
  font-size: var(--text-base);
}

/* Enhance for tablet (768px+) */
@media (min-width: 768px) {
  .header {
    padding: var(--space-6);
    font-size: var(--text-lg);
  }
}

/* Enhance for desktop (1024px+) */
@media (min-width: 1024px) {
  .header {
    padding: var(--space-8);
    font-size: var(--text-xl);
  }
}
```

### ❌ Wrong: Desktop First
```css
/* DON'T do this */
.header {
  padding: 64px;
  font-size: 20px;
}

@media (max-width: 768px) {
  .header {
    padding: 16px;
    font-size: 16px;
  }
}
```

---

## Responsive Breakpoints

```css
/* Mobile: 320px - 767px (base styles, no media query) */

/* Tablet */
@media (min-width: 768px) {
  /* Tablet-specific styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop-specific styles */
}

/* Large Desktop */
@media (min-width: 1440px) {
  /* Large screen enhancements */
}
```

---

## Mobile-Specific Patterns

### Dynamic Viewport Height (iOS Support)
```css
/* Use dvh for iOS compatibility */
.mobile-container {
  height: 100dvh; /* Dynamic viewport height */
  height: 100vh;  /* Fallback for older browsers */
}
```

### Safe Area Insets (iPhone Notch)
```css
.mobile-footer {
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### Touch Targets
```css
/* Minimum 44px for mobile touch */
.mobile-button {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-3) var(--space-4);
}
```

### Prevent Horizontal Scroll
```css
body {
  overflow-x: hidden;
  max-width: 100vw;
}
```

---

## Component Patterns

### Hamburger Menu
```css
.hamburger-menu {
  position: fixed;
  top: 0;
  left: -100%; /* Hidden off-screen */
  width: 80%;
  max-width: 320px;
  height: 100dvh;
  background: var(--bg-primary);
  transition: left 0.3s ease;
  z-index: 1000;
}

.hamburger-menu.open {
  left: 0; /* Slide in */
}

.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 999;
}

.menu-overlay.active {
  opacity: 1;
  pointer-events: all;
}
```

### Chat Container (Scrollable)
```css
.chat-container {
  height: calc(100dvh - var(--header-height) - var(--input-height));
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-4);
  scroll-behavior: smooth;
}

.chat-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  padding: var(--space-4);
  border-top: 1px solid var(--border-color);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Modal
```css
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal.open {
  opacity: 1;
  pointer-events: all;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: var(--space-6);
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
```

---

## BEM Naming Convention

```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--primary { }
.card--large { }
.card__header--centered { }
```

### Example
```css
.site-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.site-header__logo {
  height: 40px;
}

.site-header__nav {
  display: flex;
  gap: var(--space-4);
}

.site-header--mobile {
  padding: var(--space-2);
}

.site-header--desktop {
  padding: var(--space-4);
}
```

---

## Dark Mode Support

```css
/* Light mode (default) */
:root {
  --bg-primary: #FFFFFF;
  --text-primary: #2C2C2C;
}

/* Dark mode */
:root.dark {
  --bg-primary: #1F2937;
  --text-primary: #F9FAFB;
}

/* OR using media query */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1F2937;
    --text-primary: #F9FAFB;
  }
}
```

---

## Common Patterns

### Flexbox Layouts
```css
/* Center content */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Space between */
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Responsive flex */
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}
```

### Grid Layouts
```css
/* Three-column desktop layout */
.desktop-grid {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: var(--space-4);
  height: 100vh;
}

/* Mobile: single column */
@media (max-width: 1023px) {
  .desktop-grid {
    grid-template-columns: 1fr;
  }
}
```

### Transitions
```css
.smooth-transition {
  transition: all 0.3s ease;
}

.button {
  background: var(--primary);
  transition: background 0.2s ease, transform 0.1s ease;
}

.button:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.button:active {
  transform: translateY(0);
}
```

---

## Accessibility

### Focus States
```css
/* Always provide visible focus */
button:focus,
a:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Never remove outline without replacement */
button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### Contrast Ratios
```css
/* Ensure WCAG AA compliance (4.5:1 minimum) */
.text-on-primary {
  background: var(--primary); /* #2A5B8C */
  color: var(--text-inverse); /* #FFFFFF */
}
```

---

## Anti-Patterns (Avoid These)

### ❌ Don't Use
```css
/* Hardcoded colors */
.button {
  background: #2A5B8C; /* Use var(--primary) instead */
}

/* Fixed pixel units */
.container {
  width: 1200px; /* Use max-width with % or rem */
}

/* !important (unless absolutely necessary) */
.override {
  color: red !important; /* Avoid this */
}

/* Inline styles */
<div style="color: blue"> /* Never */

/* Desktop-first */
@media (max-width: 768px) { } /* Wrong approach */
```

### ✅ Do Use
```css
/* CSS variables */
.button {
  background: var(--primary);
}

/* Responsive units */
.container {
  max-width: 1200px;
  width: 100%;
}

/* Specific selectors */
.button.primary {
  color: var(--text-inverse);
}

/* External CSS only */
<link rel="stylesheet" href="styles.css">

/* Mobile-first */
@media (min-width: 768px) { } /* Correct */
```

---

## File Organization

```
assets/css/
├── base.css              # Reset, base elements
├── theme-variables.css   # All CSS custom properties
├── typography.css        # Font styles
├── components.css        # Reusable components
├── layouts.css           # Grid, flexbox layouts
├── mobile.css            # Mobile-specific styles
├── desktop.css           # Desktop-specific styles
└── utilities.css         # Utility classes
```

---

## Checklist for Every CSS File

- [ ] Uses CSS variables (no hardcoded colors/fonts)
- [ ] Mobile-first media queries
- [ ] Consistent spacing (4px/8px multiples)
- [ ] No inline styles
- [ ] No `!important` (unless justified with comment)
- [ ] Proper BEM naming or utility classes
- [ ] Touch targets minimum 44px on mobile
- [ ] Safe-area-inset for iOS
- [ ] Focus states for interactive elements
- [ ] Dark mode support (if applicable)
- [ ] Smooth transitions
- [ ] Comments for complex sections

---

**Remember:** Good CSS is predictable, maintainable, and scales gracefully across devices. Always start mobile-first and enhance progressively.
