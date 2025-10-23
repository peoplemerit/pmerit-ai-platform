# UI Modularization Scaffolding - Setup Complete

## Branch: feat/ui-modularization-confirm

This document describes the modular UI scaffolding created for the PMERIT AI Platform.

## Files Created

### HTML Fragments (Root Directory)
These are reusable HTML fragments that can be included via server-side includes or client-side fetch:

1. **header.html** - Shared header markup
   - Brand logo and name
   - Desktop navigation (Career Tracks, Explore, Dashboard, Sign In)
   - Language switcher button (EN)
   - Hamburger menu toggle (mobile)

2. **nav.html** - Mobile menu fragment
   - Virtual Human Mode button
   - Career Track link
   - Explore Paths link
   - Customer Service link
   - Settings toggle
   - Dashboard link
   - Begin Assessment CTA

3. **body.html** - Page body placeholder
   - Simple hero section
   - Placeholder for page-specific content

4. **mobile-body.html** - Mobile main with chat
   - Mobile header summary section
   - Chat area with scrollable log
   - Chat form with input and send button

5. **footer.html** - Shared footer
   - Privacy and Terms links
   - Copyright notice
   - Educational Services connection status

### CSS Files (assets/css/)

1. **theme.css** - Brand variables (AUTHORITATIVE)
   - Primary color: #0a66c2
   - Accent color: #ff7a59
   - Text color: #0b1a2b
   - Background: #ffffff
   - Muted: #6b7b8c
   - Font family: Inter, system-ui, etc.

2. **main.css** - Base styles
   - Imports theme.css
   - Box-sizing, html/body reset
   - Container max-width: 1200px
   - Page body min-height

3. **header.css** - Header styles
   - Flexbox layout
   - Brand and navigation styling
   - Responsive behavior (hamburger on mobile)

4. **mobile.css** - Mobile chat styles
   - Chat area flexbox layout
   - Scrollable chat log
   - Chat form styles

### JavaScript Files (assets/js/)

1. **main.js** - Device detection
   - Adds 'mobile' class to html element when viewport <= 768px
   - Initializes PMERIT namespace

2. **header.js** - Header interactions
   - Hamburger menu toggle
   - Mobile menu show/hide
   - ARIA attributes management

3. **chat.js** - Chat functionality
   - Chat form submit handler
   - Appends user messages
   - Mock bot responses
   - Auto-scroll to latest message

4. **theme-switch.js** - Theme toggle
   - Dark mode toggle functionality
   - ARIA pressed state management

### Demo Page

**blueprint-index-modular.html** - Assembly demonstration
- Includes all CSS files (theme, main, header, mobile)
- Inlines all HTML fragments for preview
- Includes all JavaScript files
- Can be opened directly in browser to test

## Testing Instructions

### Local Testing

1. Clone the repository:
   ```bash
   git clone https://github.com/peoplemerit/pmerit-ai-platform.git
   cd pmerit-ai-platform
   ```

2. Checkout the branch:
   ```bash
   git checkout feat/ui-modularization-confirm
   ```

3. Start a local web server:
   ```bash
   # Option 1: Python
   python3 -m http.server 8080
   
   # Option 2: Node.js
   npx serve
   
   # Option 3: PHP
   php -S localhost:8080
   ```

4. Open in browser:
   ```
   http://localhost:8080/blueprint-index-modular.html
   ```

### Testing Checklist

- [ ] Header renders with logo and navigation
- [ ] Desktop navigation visible on desktop (> 768px)
- [ ] Hamburger menu visible on mobile (< 768px)
- [ ] Clicking hamburger toggles mobile menu
- [ ] Language switcher button present
- [ ] Body content displays correctly
- [ ] Footer renders with links
- [ ] Theme CSS variables applied (check in DevTools)
- [ ] Mobile responsive behavior works
- [ ] JavaScript initializes without errors

### Visual Testing

1. **Desktop View** (> 768px):
   - Header with inline navigation
   - No hamburger menu
   - Full layout with container

2. **Mobile View** (< 768px):
   - Header with hamburger menu
   - Desktop navigation hidden
   - Mobile menu toggleable

3. **Interactions**:
   - Click hamburger to open/close mobile menu
   - Verify ARIA attributes update
   - Check console for JavaScript errors

## File Structure

```
pmerit-ai-platform/
├── header.html                      # Shared header fragment
├── nav.html                         # Mobile navigation fragment
├── body.html                        # Page body placeholder
├── mobile-body.html                 # Mobile chat interface
├── footer.html                      # Shared footer fragment
├── blueprint-index-modular.html     # Demo assembly page
├── assets/
│   ├── css/
│   │   ├── theme.css               # Brand variables (AUTHORITATIVE)
│   │   ├── main.css                # Base styles
│   │   ├── header.css              # Header styles
│   │   └── mobile.css              # Mobile chat styles
│   └── js/
│       ├── main.js                 # Device detection
│       ├── header.js               # Header interactions
│       ├── chat.js                 # Chat functionality
│       └── theme-switch.js         # Theme toggle
└── .gitignore                       # Excludes backup files
```

## Important Notes

1. **Brand Variables**: theme.css is the authoritative source for brand colors and fonts
2. **Fragments**: HTML fragments are meant to be included via server-side includes or client-side fetch
3. **Demo Page**: blueprint-index-modular.html is for preview only, actual pages will use includes
4. **Backup Files**: Original mobile.css, chat.js, and main.js backed up with -original suffix
5. **Logo Path**: Corrected to assets/img/logo.svg (not assets/images/)

## Next Steps

1. Review visual design and layout
2. Adjust styles as needed based on team feedback
3. Test on actual devices (not just browser resize)
4. Implement server-side includes or build process
5. Integrate with existing pages
6. Add more interactive features
7. Enhance accessibility
8. Add unit tests for JavaScript

## PR Status

This PR is marked as **WIP (Work In Progress)** to allow the team to:
- Confirm visual expectations
- Test functional behavior
- Provide feedback on component structure
- Suggest adjustments before merging to main

## Questions or Issues?

Contact the team for clarification on:
- Component structure
- Style variables
- JavaScript patterns
- Integration approach
- Testing requirements
