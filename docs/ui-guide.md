# PMERIT UI Component Guide

**Version:** 1.0  
**Last Updated:** November 2024  
**Maintainer:** PMERIT Development Team

## Table of Contents

1. [Overview](#overview)
2. [Common Header Component](#common-header-component)
3. [Common Footer Component](#common-footer-component)
4. [Integration Methods](#integration-methods)
5. [Styling & Customization](#styling--customization)
6. [Accessibility Features](#accessibility-features)
7. [Dark Mode Support](#dark-mode-support)
8. [Examples](#examples)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The PMERIT platform uses standardized, reusable header and footer components to ensure consistency across all pages. These components are:

- **Accessible**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- **Responsive**: Mobile-first design with breakpoints for tablet and desktop
- **Themeable**: Full dark mode support with CSS variables
- **Modular**: Can be loaded via HTML includes or JavaScript

### Component Files

| Component | File Path | Description |
|-----------|-----------|-------------|
| Header | `/partials/header.html` | Main navigation, logo, hamburger menu, language selector |
| Footer | `/partials/footer.html` | Mobile and desktop footers with links and status |
| Layout Loader | `/assets/js/layout-loader.js` | JavaScript module for dynamic loading |

---

## Common Header Component

### Features

The header component includes:

- **Logo & Branding**: PMERIT logo with link to homepage
- **Google Translate Widget**: Language switching via Google Translate (centralized, MOSA-compliant)
- **Hamburger Menu**: Slide-in menu for mobile/tablet with:
  - Quick Actions (Career Track, Dashboard, Begin Assessment)
  - Settings (Dark Mode, Text-to-Speech toggles)
  - User authentication section
- **Sign In Button**: Opens authentication modal or redirects to sign-in page

### HTML Structure

```html
<header class="pmerit-header" id="main-header">
  <div class="header-container">
    <!-- Logo -->
    <div class="header-left">
      <a href="index.html" class="logo-link" aria-label="PMERIT Home">
        <i class="fas fa-graduation-cap logo-icon"></i>
        <span class="logo-text">Pmerit</span>
      </a>
    </div>
    
    <!-- Actions -->
    <div class="header-right">
      <!-- Google Translate Widget -->
      <div id="google_translate_element" style="display: inline-block; vertical-align: middle;"></div>
      <button class="header-btn hamburger-toggle" id="hamburger-toggle" 
              aria-label="Toggle menu" aria-expanded="false">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
      <a href="/signin.html" class="btn-sign-in" id="sign-in-btn">Sign In</a>
    </div>
  </div>
</header>
```

### Key IDs for JavaScript

- `main-header`: Main header container
- `hamburger-toggle`: Menu toggle button
- `hamburger-menu`: Slide-in menu panel
- `menu-overlay`: Background overlay when menu is open
- `google_translate_element`: Google Translate widget container
- `sign-in-btn`: Primary sign-in button

### Google Translate Integration

The Google Translate widget provides language switching functionality. It is centralized in the shared header partial and loaded automatically by the layout-loader.js.

**Required CSS**: Include `assets/css/google-translate.css` for proper styling.

**How it works**:
1. The header partial includes the widget container `#google_translate_element`
2. A `googleTranslateElementInit()` callback initializes the widget
3. The layout-loader.js calls `_loadGoogleTranslate()` to load the Google script
4. Language selection persists automatically via Google's cookie mechanism

---

## Common Footer Component

### Features

The footer has two versions:

**Mobile Footer** (< 1024px):
- Simplified layout
- Privacy & Terms link
- Status indicator
- Safe-area-inset support for iOS

**Desktop Footer** (≥ 1024px):
- Four-column layout: Platform, Features, Support, Company
- Bottom bar with copyright, legal links, social media
- Status indicator with icon
- Full link directory

### HTML Structure

```html
<!-- Mobile Footer -->
<footer class="mobile-footer" id="mobile-footer">
  <div class="mobile-footer-content">
    <a href="privacy.html" class="footer-link">Privacy & Terms</a>
    <span class="footer-separator">•</span>
    <span class="footer-status">
      <i class="fas fa-circle status-indicator"></i>
      Connected to Educational Services
    </span>
  </div>
</footer>

<!-- Desktop Footer -->
<footer class="desktop-footer" id="desktop-footer">
  <!-- See /partials/footer.html for full structure -->
</footer>
```

---

## Integration Methods

### Method 1: JavaScript Dynamic Loading (Recommended)

This method loads header and footer asynchronously without requiring server-side includes.

#### Step 1: Include the Layout Loader Script

Add to your page `<head>` or before closing `</body>`:

```html
<script src="/assets/js/layout-loader.js"></script>
```

#### Step 2: Initialize After DOM Ready

Add after your other scripts:

```html
<script>
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayout);
  } else {
    initLayout();
  }

  async function initLayout() {
    // Load header and footer
    const result = await window.LayoutLoader.init();
    
    if (result.success) {
      console.log('✅ Header and footer loaded successfully');
    } else {
      console.error('❌ Failed to load layout components', result);
    }
  }
</script>
```

#### Step 3: Auto-Initialize (Alternative)

For automatic initialization, add `data-layout-auto-init` to your `<body>`:

```html
<body data-layout-auto-init>
  <!-- Your page content -->
</body>
```

The layout loader will automatically initialize when the DOM is ready.

#### Custom Configuration

You can customize where components are inserted:

```javascript
window.LayoutLoader.init({
  headerPartialPath: '/partials/header.html',
  footerPartialPath: '/partials/footer.html',
  headerInsertPoint: 'body',           // CSS selector
  footerInsertPoint: 'body',           // CSS selector
  headerPosition: 'afterbegin',        // where to insert
  footerPosition: 'beforeend'          // where to insert
});
```

**Position Options:**
- `afterbegin`: As first child
- `beforeend`: As last child
- `beforebegin`: Before the element
- `afterend`: After the element

---

### Method 2: Server-Side Includes

If your server supports SSI (Server-Side Includes), you can use:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Your head content -->
</head>
<body>
  <!--#include virtual="/partials/header.html" -->
  
  <main>
    <!-- Your page content -->
  </main>
  
  <!--#include virtual="/partials/footer.html" -->
  
  <!-- Scripts -->
  <script src="/assets/js/layout-loader.js"></script>
  <script>
    // Initialize only the interactive components, don't load HTML
    window.LayoutLoader.initializeComponents();
  </script>
</body>
</html>
```

---

### Method 3: Build-Time Includes

For static site generators or build tools, use your tool's include syntax:

**Example with Eleventy (11ty):**
```liquid
{% include "partials/header.html" %}

<main>
  {{ content }}
</main>

{% include "partials/footer.html" %}
```

**Example with Jekyll:**
```liquid
{% include header.html %}

<main>
  {{ content }}
</main>

{% include footer.html %}
```

After including, initialize the interactive components:

```html
<script src="/assets/js/layout-loader.js"></script>
<script>
  window.LayoutLoader.initializeComponents();
</script>
```

---

## Styling & Customization

### Required CSS Files

Include these CSS files in your `<head>` (in order):

```html
<link rel="stylesheet" href="/assets/css/theme-variables.css">
<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/components.css">
<link rel="stylesheet" href="/assets/css/mobile-mockup-match.css">
```

### CSS Variables

The header and footer use CSS variables for theming:

```css
:root {
  /* Colors */
  --primary: #2A5B8C;
  --primary-dark: #1e4269;
  --text-primary: #1F2937;
  --text-secondary: #6B7280;
  --bg-primary: #FFFFFF;
  --bg-secondary: #F3F4F6;
  --bg-card: #FFFFFF;
  --border-color: #E5E7EB;
  
  /* Spacing */
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  
  /* Shadows */
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition: all 0.2s ease-in-out;
}
```

### Customizing Header Height

To change the header height:

```css
.pmerit-header {
  height: 80px; /* Default is 70px */
}
```

### Customizing Colors

Override CSS variables in your page styles:

```css
:root {
  --primary: #4AA4B9; /* Teal instead of blue */
  --logo-text: #FF6B6B; /* Coral logo */
}
```

---

## Accessibility Features

### Keyboard Navigation

All interactive elements are keyboard accessible:

| Key | Action |
|-----|--------|
| `Tab` | Navigate between elements |
| `Enter` / `Space` | Activate buttons/links |
| `Escape` | Close menus/dropdowns |
| `Arrow Keys` | Navigate menu items (when applicable) |

### Screen Reader Support

- All interactive elements have `aria-label` or visible text
- Menu states use `aria-expanded` and `aria-hidden`
- Focus is trapped within open menus
- Focus returns to trigger element when menu closes

### Color Contrast

All text meets WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements: Clear focus indicators

### Touch Targets

All touch targets are minimum 44x44px as per WCAG guidelines.

---

## Dark Mode Support

### Automatic Detection

The components automatically respect the system preference:

```javascript
// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### Manual Toggle

Users can toggle dark mode via the hamburger menu. The preference is saved to `localStorage`:

```javascript
// Get saved theme
const theme = localStorage.getItem('theme'); // 'light' or 'dark'

// Set theme
document.documentElement.setAttribute('data-theme', theme);
```

### Dark Mode CSS

Dark mode styles are defined using `data-theme` attribute:

```css
[data-theme="dark"] {
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
  --bg-primary: #111827;
  --bg-secondary: #1F2937;
  --bg-card: #1F2937;
  --border-color: #374151;
}
```

---

## Examples

### Example 1: Basic Page with Components

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My PMERIT Page</title>
  
  <!-- CSS -->
  <link rel="stylesheet" href="/assets/css/theme-variables.css">
  <link rel="stylesheet" href="/assets/css/base.css">
  <link rel="stylesheet" href="/assets/css/components.css">
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body data-layout-auto-init>
  
  <!-- Header will be injected here -->
  
  <main style="padding: 2rem;">
    <h1>Welcome to My Page</h1>
    <p>This is my content.</p>
  </main>
  
  <!-- Footer will be injected here -->
  
  <!-- Scripts -->
  <script src="/assets/js/config.js"></script>
  <script src="/assets/js/auth.js"></script>
  <script src="/assets/js/layout-loader.js"></script>
</body>
</html>
```

### Example 2: Page with Authentication

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ... head content ... -->
</head>
<body>
  
  <!-- Content -->
  <main>
    <h1>Dashboard</h1>
  </main>
  
  <!-- Scripts -->
  <script src="/assets/js/config.js"></script>
  <script src="/assets/js/auth.js"></script>
  <script src="/assets/js/layout-loader.js"></script>
  
  <script>
    async function init() {
      // Check authentication first
      if (!window.AUTH || !window.AUTH.isAuthenticated()) {
        window.location.href = '/signin.html';
        return;
      }
      
      // Load layout components
      const result = await window.LayoutLoader.init();
      
      if (result.success) {
        console.log('Layout loaded for authenticated user');
      }
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  </script>
</body>
</html>
```

### Example 3: Custom Insert Points

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ... head content ... -->
</head>
<body>
  
  <div id="app-container">
    <!-- Header goes here -->
    <div id="header-slot"></div>
    
    <main>
      <h1>My App</h1>
    </main>
    
    <!-- Footer goes here -->
    <div id="footer-slot"></div>
  </div>
  
  <script src="/assets/js/layout-loader.js"></script>
  <script>
    window.LayoutLoader.init({
      headerInsertPoint: '#header-slot',
      footerInsertPoint: '#footer-slot',
      headerPosition: 'afterbegin',
      footerPosition: 'afterbegin'
    });
  </script>
</body>
</html>
```

---

## Troubleshooting

### Header/Footer Not Loading

**Problem:** Components don't appear on the page.

**Solutions:**
1. Check browser console for errors
2. Verify paths to partial files are correct
3. Ensure `layout-loader.js` is loaded before initialization
4. Check that fetch is allowed (check CORS if using different domain)

```javascript
// Debug loading
window.LayoutLoader.init().then(result => {
  console.log('Result:', result);
}).catch(error => {
  console.error('Error:', error);
});
```

### Menu Not Opening

**Problem:** Hamburger menu doesn't open when clicked.

**Solutions:**
1. Verify `menu.js` or layout loader is initializing properly
2. Check that IDs match between HTML and JavaScript
3. Look for JavaScript errors in console

```javascript
// Test manually
document.getElementById('hamburger-toggle').click();
```

### Styles Not Applied

**Problem:** Header/footer appear unstyled.

**Solutions:**
1. Verify all required CSS files are loaded
2. Check that CSS files are loaded before header/footer HTML
3. Clear browser cache
4. Check for CSS conflicts with page-specific styles

```html
<!-- Ensure correct order -->
<link rel="stylesheet" href="/assets/css/theme-variables.css">
<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/components.css">
```

### Dark Mode Not Working

**Problem:** Dark mode toggle doesn't change theme.

**Solutions:**
1. Check that `data-theme` attribute is set on `<html>` or `<body>`
2. Verify localStorage is accessible
3. Check for JavaScript errors when toggling

```javascript
// Debug theme
console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
console.log('Saved theme:', localStorage.getItem('theme'));
```

### Google Translate Not Working

**Problem:** Google Translate widget doesn't appear or doesn't function.

**Solutions:**
1. Verify `#google_translate_element` div exists in the header
2. Check that `layout-loader.js` is loaded and initialized
3. Ensure CSP headers allow Google Translate scripts
4. Check console for Google Translate loading errors
5. Verify `google-translate.css` is included for styling

```javascript
// Debug Google Translate
console.log('Widget element:', document.getElementById('google_translate_element'));
console.log('Google Translate loaded:', !!(window.google && window.google.translate));
```

---

## Best Practices

### Performance

1. **Load CSS in `<head>`**: Prevents flash of unstyled content
2. **Load JS at end of `<body>`**: Doesn't block page rendering
3. **Use auto-init when possible**: Simplifies code
4. **Cache partials**: Browser will cache the partial HTML files

### Accessibility

1. **Always include alt text** for images in your content
2. **Use semantic HTML**: `<header>`, `<nav>`, `<main>`, `<footer>`
3. **Test with keyboard**: Ensure all interactive elements are reachable
4. **Test with screen reader**: Use NVDA, JAWS, or VoiceOver

### Maintenance

1. **Don't modify partials directly**: Create issues for changes
2. **Keep CSS variables consistent**: Don't hardcode colors
3. **Document customizations**: Add comments for future maintainers
4. **Test on all breakpoints**: Mobile, tablet, desktop

---

## Support

For questions or issues with the common header/footer components:

1. Check this guide first
2. Review the [ACCESSIBILITY.md](../ACCESSIBILITY.md) document
3. Check existing GitHub issues
4. Create a new issue with `component:layout` label

---

**Document Version:** 1.0  
**Last Updated:** November 2024  
**Next Review:** December 2024
