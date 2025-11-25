# Theme Persistence Implementation

This document describes how theme (dark mode) and TTS (text-to-speech) persistence works across all pages in the PMERIT platform.

## Overview

The theme persistence system ensures that user preferences for dark mode and text-to-speech are saved in localStorage and applied consistently across all pages, with no flash of unstyled content (FOUC).

## Key Components

### 1. Early Theme Initializer (`partials/theme-init.html`)

A small inline script that should be placed in the `<head>` section of pages to apply the theme immediately before page render.

```html
<head>
  <!-- Other head elements -->
  <script>
  (function() {
    var theme = localStorage.getItem('theme');
    if (!theme) {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  })();
  </script>
</head>
```

### 2. Layout Loader (`assets/js/layout-loader.js`)

The primary loader for pages that use dynamic header/footer. It:
- Applies saved theme on initialization via `applyTheme()` method
- Falls back to system preference (`prefers-color-scheme`) if no saved preference
- Manages theme toggles in the hamburger menu
- Persists theme changes to localStorage with key: `'theme'` (values: `'dark'` or `'light'`)
- Persists TTS settings to localStorage with key: `'tts-enabled'` (values: `'true'` or `'false'`)

**Usage:**
```html
<body data-layout-auto-init>
  <!-- Page content -->
  <script src="assets/js/layout-loader.js"></script>
</body>
```

The `data-layout-auto-init` attribute triggers automatic initialization.

### 3. Main Application (`assets/js/main.js`)

Used on pages with full application functionality (like index.html). It:
- Reads theme from both `'theme'` key and legacy `'pmerit-state'` JSON
- Writes theme to both storage formats for backward compatibility
- Falls back to system preference if no saved theme
- Always applies theme on load (no flash)

## localStorage Keys

The system uses these localStorage keys:

| Key | Values | Description |
|-----|--------|-------------|
| `theme` | `'dark'` or `'light'` | Current theme preference |
| `tts-enabled` | `'true'` or `'false'` | Text-to-speech enabled state |
| `pmerit-state` | JSON object | Legacy state storage (main.js only) |

## Theme Application

The theme is applied via the `data-theme` attribute on the `<html>` element:

```html
<html data-theme="dark">
```

CSS uses this attribute to apply theme-specific styles:

```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}
```

## Page Types

### Pages Using Layout Loader (Recommended)

These pages use `layout-loader.js` for dynamic header/footer:
- assessment-entry.html
- career.html
- community.html
- contact.html
- courses.html
- impact.html
- partnerships.html
- privacy.html
- profile.html
- progress.html
- reports.html
- settings.html
- support.html

**Required setup:**
```html
<body data-layout-auto-init>
  <!-- Page content -->
  <script src="assets/js/layout-loader.js"></script>
</body>
```

### Pages Using Main.js

These pages have full application functionality:
- index.html (includes main.js but not layout-loader.js)
- Pages that load both scripts for VH/CSM features

**Required setup:**
```html
<body>
  <!-- Page content -->
  <script src="assets/js/main.js"></script>
</body>
```

## Testing Theme Persistence

Use `test-theme-persistence.html` to verify:
1. Theme persists on page reload
2. Theme persists when navigating between pages
3. Theme persists in new tabs
4. System preference is respected when no saved preference exists
5. TTS toggle state persists

## Migration Notes

### Removed
- `boot-includes.js` - Non-existent file that was referenced in 5 HTML files
- Duplicate script tags and footer containers in courses.html

### Consolidated
- All pages now use `layout-loader.js` instead of the non-existent `boot-includes.js`
- Both `layout-loader.js` and `main.js` now use the same localStorage keys
- Both loaders respect system preference as fallback

## Browser Support

- localStorage: All modern browsers
- `prefers-color-scheme`: All modern browsers (IE11 gracefully falls back to light mode)
- `data-theme` attribute: All browsers

## Troubleshooting

### Theme doesn't persist
1. Check browser localStorage is enabled
2. Verify `data-theme` attribute is on `<html>` element
3. Check console for JavaScript errors
4. Verify localStorage keys are being written (check DevTools > Application > Local Storage)

### Flash of wrong theme on load
1. Ensure early theme initializer is in `<head>` section
2. Place it before any CSS that depends on theme
3. Verify it runs before page content renders

### Toggles don't update
1. Check that toggle has correct ID (`dark-mode-toggle` or `tts-toggle`)
2. Verify `layout-loader.js` is loaded
3. Check console for initialization errors

## Google Translate Integration

### Overview

Google Translate provides language switching functionality across all pages. The widget is loaded centrally through the shared header partial, ensuring MOSA compliance with a single source of truth.

### How It Works

1. **Widget Container**: The `#google_translate_element` div is placed in `partials/header.html`
2. **Initialization Script**: A `googleTranslateElementInit()` callback function is defined in the header
3. **Script Loading**: The layout-loader.js dynamically loads the Google Translate script via `_loadGoogleTranslate()`
4. **Styling**: Custom styles in `assets/css/google-translate.css` match the widget to PMERIT design

### Files Involved

| File | Purpose |
|------|---------|
| `partials/header.html` | Widget container and initialization callback |
| `assets/js/layout-loader.js` | Dynamic script loading via `_loadGoogleTranslate()` |
| `assets/css/google-translate.css` | Widget styling and dark mode support |

### Language Persistence

Google Translate automatically handles language persistence through its own cookie mechanism. The selected language persists across page navigation and browser sessions.

### Dark Mode Support

The Google Translate widget styling automatically adapts to dark mode via CSS variables and the `[data-theme="dark"]` selector.

## Future Improvements

- [ ] Add theme transition animations
- [ ] Support for more than 2 themes (light/dark/auto)
- [ ] Sync theme across tabs in real-time
- [ ] Add theme preview before applying
- [ ] Respect reduced-motion preference
