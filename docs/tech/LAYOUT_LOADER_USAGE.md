# Layout Loader Usage Guide

## Overview

The **Layout Loader** is a MOSA-compliant JavaScript module that provides dynamic loading and initialization of site-wide header and footer components. It serves as a single source of truth for layout partials, ensuring consistency across all pages.

## Quick Start

### Basic Implementation

Add the following to any HTML page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PMERIT - Your Page</title>
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <!-- Header and footer will be loaded here -->
  
  <main>
    <!-- Your page content -->
  </main>

  <!-- Load the Layout Loader script -->
  <script src="/assets/js/layout-loader.js"></script>
  
  <!-- Initialize after DOM is ready -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      window.LayoutLoader.init();
    });
  </script>
</body>
</html>
```

### Auto-Initialization

For even simpler integration, use the `data-layout-auto-init` attribute:

```html
<body data-layout-auto-init>
  <!-- Header and footer will be loaded automatically -->
  
  <main>
    <!-- Your page content -->
  </main>

  <script src="/assets/js/layout-loader.js"></script>
</body>
```

## Features

### 1. Dynamic Header/Footer Loading

The Layout Loader fetches header and footer HTML partials from `/partials/` directory and injects them into the page:

- **Header**: Loaded from `/partials/header.html` (prepended to `<body>`)
- **Footer**: Loaded from `/partials/footer.html` (appended to `<body>`)

This ensures all pages share the same header and footer structure without duplication.

### 2. Hamburger Menu Management

The hamburger menu provides mobile-friendly navigation with:

- **Open/Close functionality**: Click toggle button or overlay to open/close
- **Keyboard navigation**: Press `Escape` to close menu
- **Focus management**: Automatically manages focus for accessibility
- **ARIA attributes**: Proper `aria-hidden` and `aria-expanded` states
- **Body scroll lock**: Prevents background scrolling when menu is open

### 3. Language Selector

Multi-language support through an accessible dropdown:

- **Language options**: Defined by elements with `data-lang` attribute
- **Persistent preference**: Saves selected language to `localStorage`
- **Active state**: Visual indication of currently selected language
- **Extensible**: Ready for integration with i18n systems

### 4. Authentication State Handling

Dynamic UI updates based on authentication status:

- **Sign-in buttons**: Opens AuthModal or redirects to signin page
- **User welcome message**: Displays username for authenticated users
- **Dashboard link**: Provides quick access to learner portal
- **Integration**: Works with `window.AUTH` module

### 5. Settings Toggles

User preferences with localStorage persistence:

#### Dark Mode Toggle
```javascript
// Dark mode state is automatically saved
const isDarkMode = localStorage.getItem('theme') === 'dark';

// Toggle applies data-theme attribute to <html>
document.documentElement.setAttribute('data-theme', 'dark');
```

#### Text-to-Speech (TTS) Toggle
```javascript
// TTS preference is saved and integrated with TTS module
const ttsEnabled = localStorage.getItem('tts-enabled') === 'true';

// Automatically calls window.TTS.setEnabled() if available
if (window.TTS) {
  window.TTS.setEnabled(true);
}
```

## Advanced Usage

### Custom Configuration

Override default paths and insertion points:

```javascript
await window.LayoutLoader.init({
  headerPartialPath: '/custom-partials/header.html',
  footerPartialPath: '/custom-partials/footer.html',
  headerInsertPoint: '#header-container',
  footerInsertPoint: '#footer-container',
  headerPosition: 'beforeend',
  footerPosition: 'afterbegin'
});
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `headerPartialPath` | string | `/partials/header.html` | Path to header HTML file |
| `footerPartialPath` | string | `/partials/footer.html` | Path to footer HTML file |
| `headerInsertPoint` | string | `body` | CSS selector for header insertion |
| `footerInsertPoint` | string | `body` | CSS selector for footer insertion |
| `headerPosition` | string | `afterbegin` | Position: `afterbegin` or `beforeend` |
| `footerPosition` | string | `beforeend` | Position: `afterbegin` or `beforeend` |

### Checking Load Status

The `init()` method returns a Promise with load status:

```javascript
const result = await window.LayoutLoader.init();

console.log(result);
// {
//   header: true,
//   footer: true,
//   success: true
// }

if (result.success) {
  console.log('Layout loaded successfully!');
} else {
  console.error('Failed to load:', result.error);
}
```

### Error Handling

```javascript
try {
  const result = await window.LayoutLoader.init();
  
  if (!result.success) {
    // Handle partial failure
    if (!result.header) {
      console.warn('Header failed to load');
    }
    if (!result.footer) {
      console.warn('Footer failed to load');
    }
  }
} catch (error) {
  console.error('Initialization error:', error);
}
```

## MOSA Compliance

The Layout Loader adheres to MOSA (Modular Open Systems Approach) principles:

### ✅ Single Source of Truth

- Header and footer HTML exist in **one location** (`/partials/`)
- Changes propagate automatically to all pages
- No duplication or synchronization issues

### ✅ Modular Component Design

- Self-contained module with no external dependencies
- Clear separation of concerns (loading, initialization, UI updates)
- Independent functionality for each component (menu, language, auth, settings)

### ✅ Standard Interfaces

- Public API through `window.LayoutLoader.init()`
- Standard configuration object pattern
- Promise-based asynchronous operations
- Consistent event handling

### ✅ Independent Functionality

- Can operate standalone without other modules
- Optional integration with `window.AUTH` and `window.TTS`
- Graceful degradation when dependencies are unavailable
- No tight coupling with application code

### ✅ Reusability

- Works across all page types (landing, portal, admin)
- Configurable for different use cases
- Extensible through configuration options
- No hard-coded assumptions about page structure

## Menu Items

The hamburger menu includes these interactive items (configured in `header.html`):

- **Career Track**: Navigates to `/career.html`
- **Dashboard**: Navigates to learner portal (requires authentication)
- **Begin Assessment**: Link to assessment entry page
- **Preview Voices**: Placeholder for TTS voice preview modal
- **Dark Mode Toggle**: Switches between light/dark themes
- **TTS Toggle**: Enables/disables text-to-speech

## Required HTML Elements

The Layout Loader expects these element IDs in the header partial:

### Header Elements
- `hamburger-toggle`: Hamburger menu button
- `hamburger-menu`: Menu panel container
- `menu-overlay`: Background overlay
- `menu-close-btn`: Close button in menu
- `language-btn`: Language selector button
- `language-dropdown`: Language dropdown container
- `close-language-dropdown`: Close button for language dropdown
- `sign-in-btn`: Header sign-in button

### Menu Elements
- `career-track-btn`: Career track button
- `dashboard-btn`: Dashboard button
- `preview-voices-btn`: Preview voices button
- `dark-mode-toggle`: Dark mode checkbox
- `tts-toggle`: TTS checkbox
- `user-section`: Container for authenticated user info
- `menu-sign-in`: Sign-in button in menu

### Footer Elements
- `.footer-copyright`: Element for copyright year

## Integration with Other Modules

### AUTH Module

```javascript
// Layout Loader checks for authentication
if (window.AUTH && window.AUTH.isAuthenticated()) {
  const user = window.AUTH.getCurrentUser();
  // Update UI with user info
}
```

### AuthModal Module

```javascript
// Opens auth modal if available
if (window.AuthModal) {
  window.AuthModal.open('signin');
} else {
  window.location.href = '/signin.html';
}
```

### TTS Module

```javascript
// Integrates with TTS module for toggle
if (window.TTS) {
  window.TTS.setEnabled(enabled);
}
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required (async/await, arrow functions, template literals)
- Fetch API for loading partials
- localStorage for preferences
- Supports mobile and desktop viewports

## Best Practices

### 1. Load Order

Always load Layout Loader before initializing:

```html
<!-- Load dependencies first if needed -->
<script src="/assets/js/auth.js"></script>
<script src="/assets/js/tts.js"></script>

<!-- Load Layout Loader -->
<script src="/assets/js/layout-loader.js"></script>

<!-- Initialize -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    window.LayoutLoader.init();
  });
</script>
```

### 2. Wait for Initialization

If you need to interact with header/footer elements, wait for initialization:

```javascript
const result = await window.LayoutLoader.init();

if (result.success) {
  // Now safe to interact with header/footer elements
  const menuBtn = document.getElementById('custom-menu-item');
  menuBtn.addEventListener('click', handleClick);
}
```

### 3. Error Handling

Always handle potential load failures:

```javascript
const result = await window.LayoutLoader.init();

if (!result.success) {
  // Fallback behavior
  document.body.innerHTML = '<p>Failed to load layout. Please refresh.</p>';
}
```

### 4. Custom Styling

Ensure your CSS is loaded before the layout for consistent rendering:

```html
<head>
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
```

## Troubleshooting

### Header/Footer Not Loading

**Problem**: Partials don't appear on page

**Solutions**:
- Check browser console for fetch errors
- Verify partial paths are correct (`/partials/header.html`, `/partials/footer.html`)
- Ensure local server is running (partials can't load from `file://`)
- Check network tab for 404 errors

### Menu Not Opening

**Problem**: Hamburger menu doesn't respond to clicks

**Solutions**:
- Verify required element IDs exist in header partial
- Check console for initialization errors
- Ensure JavaScript is enabled
- Verify no CSS is hiding menu with `display: none !important`

### Settings Not Persisting

**Problem**: Dark mode or TTS settings reset on page reload

**Solutions**:
- Check if localStorage is enabled in browser
- Verify browser isn't in private/incognito mode
- Check for localStorage quota exceeded errors
- Ensure no extensions are blocking localStorage

### Authentication Not Showing

**Problem**: User info doesn't display after login

**Solutions**:
- Verify `window.AUTH` module is loaded
- Check `window.AUTH.isAuthenticated()` returns true
- Ensure `user-section` element exists in header
- Call `updateAuthUI()` after authentication changes

## Migration Guide

### From Duplicated Headers/Footers

If you currently have header/footer HTML copied across pages:

1. Extract header HTML to `/partials/header.html`
2. Extract footer HTML to `/partials/footer.html`
3. Remove header/footer HTML from all pages
4. Add Layout Loader script and initialization to each page
5. Test all pages to ensure proper loading

### From Server-Side Includes

If using SSI or other server-side includes:

1. Keep your current partials structure
2. Configure Layout Loader with your partial paths
3. Test in development environment
4. Deploy Layout Loader alongside or instead of SSI
5. Remove SSI directives once Layout Loader is working

## Examples

### Landing Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PMERIT - Home</title>
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <main class="landing-content">
    <h1>Welcome to PMERIT</h1>
    <!-- Content -->
  </main>

  <script src="/assets/js/layout-loader.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      window.LayoutLoader.init();
    });
  </script>
</body>
</html>
```

### Protected Page with Auth

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PMERIT - Dashboard</title>
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <main class="dashboard">
    <!-- Dashboard content -->
  </main>

  <script src="/assets/js/auth.js"></script>
  <script src="/assets/js/layout-loader.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', async () => {
      // Check auth first
      if (!window.AUTH.isAuthenticated()) {
        window.location.href = '/signin.html';
        return;
      }

      // Load layout
      const result = await window.LayoutLoader.init();
      
      if (result.success) {
        console.log('Dashboard ready');
      }
    });
  </script>
</body>
</html>
```

### Single Page Application (SPA)

```javascript
// app.js - SPA router
class SPARouter {
  async init() {
    // Load layout once
    await window.LayoutLoader.init();
    
    // Set up route handling
    this.setupRoutes();
  }

  async navigate(route) {
    // Load page content dynamically
    const content = await this.loadPageContent(route);
    
    // Update main content area
    document.querySelector('main').innerHTML = content;
    
    // Layout (header/footer) remains unchanged
  }
}
```

## Version History

- **v1.1** (Current): Added comprehensive JSDoc documentation, MOSA compliance documentation
- **v1.0**: Initial release with dynamic loading, menu, language selector, auth integration

## Support

For issues, questions, or contributions:

- **Repository**: https://github.com/peoplemerit/pmerit-ai-platform
- **Documentation**: `/docs/LAYOUT_LOADER_USAGE.md`
- **Issues**: https://github.com/peoplemerit/pmerit-ai-platform/issues

## License

MIT License - See LICENSE file for details

---

**PMERIT Development Team** - Building accessible, modular, educational platforms
