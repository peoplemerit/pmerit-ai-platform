# Copilot Review Prompts

Use these prompts when reviewing files added or modified in the PMERIT platform.

---

## General Review Prompt

When reviewing any frontend file, ask:

1. **Does this file follow the corresponding style guide?**
   - HTML → `.copilot/hints/html-style-guide.md`
   - CSS → `.copilot/hints/css-style-guide.md`
   - JavaScript → `.copilot/hints/js-structure-tips.md`

2. **Does the code separate mobile and desktop logic clearly?**
   - Mobile styles should be base/default
   - Desktop enhancements in `@media (min-width: 1024px)`

3. **Are responsive breakpoints used properly?**
   - Mobile: 320px - 767px (base, no media query)
   - Tablet: 768px - 1023px (`@media (min-width: 768px)`)
   - Desktop: 1024px+ (`@media (min-width: 1024px)`)

4. **Is the naming consistent with the rest of the project?**
   - Files: kebab-case (`mobile-header.css`)
   - Classes: BEM or utility-based
   - Variables: camelCase in JS, kebab-case in CSS

5. **Are repetitive sections abstracted logically?**
   - Reusable components in `partials/`
   - Shared styles in `components.css`
   - Common JS functions in modules

---

## HTML Review Prompts

### Structure
- ✅ Does the file use semantic HTML5 elements?
- ✅ Is the heading hierarchy correct (h1 → h2 → h3)?
- ✅ Are ARIA labels present on interactive elements?
- ✅ Do all images have alt attributes?

### Mobile-Specific
- ✅ Are touch targets at least 44px × 44px?
- ✅ Is safe-area-inset used in footer/header?
- ✅ Is the viewport meta tag present and correct?

### Comments
```markdown
🤖 Copilot Insight: This <div> should be a <section> for better 
semantic structure. Semantic HTML improves accessibility and SEO.

Location: index.html, line 45
```

---

## CSS Review Prompts

### Variables & Theming
- ✅ Are all colors using CSS variables from `theme-variables.css`?
- ✅ Are fonts using `var(--font-heading)` or `var(--font-body)`?
- ✅ Is spacing using `var(--space-*)` variables?

### Mobile-First
- ✅ Are base styles written for mobile (no media query)?
- ✅ Do media queries use `min-width` (not `max-width`)?
- ✅ Is `dvh` used for dynamic viewport height on mobile?

### Performance
- ✅ Are there any duplicate or conflicting styles?
- ✅ Is CSS organized logically (layout, typography, components)?
- ✅ Are transitions smooth but not excessive?

### Comments
```markdown
🤖 Copilot Insight: Replace hardcoded color #2A5B8C with CSS variable 
var(--primary) for consistency with the Pmerit brand theme.

Location: assets/css/components.css, line 89

❌ Current:
.button { background: #2A5B8C; }

✅ Suggested:
.button { background: var(--primary); }
```

---

## JavaScript Review Prompts

### Modern Syntax
- ✅ Is `const` or `let` used instead of `var`?
- ✅ Are arrow functions used where appropriate?
- ✅ Is async/await used for asynchronous operations?

### Modularity
- ✅ Are functions small and focused (single responsibility)?
- ✅ Are there any global variables (should be modules)?
- ✅ Are event listeners used instead of inline onclick?

### DOM Safety
- ✅ Are DOM queries checked for null before use?
- ✅ Are querySelector/querySelectorAll used (not getElementById)?
- ✅ Is innerHTML sanitized to prevent XSS?

### Comments
```markdown
🤖 Copilot Insight: This function uses 'var' which is outdated. 
Use 'const' for immutable references or 'let' for mutable variables.

Location: assets/js/menu.js, line 12

❌ Current:
var menuOpen = false;

✅ Suggested:
let menuOpen = false;
```

---

## Accessibility Review Prompts

### Semantic HTML
- ✅ Is the landmark structure correct?
  - `<header>`, `<main>`, `<footer>`, `<nav>`, `<aside>`
- ✅ Are form inputs properly labeled?
- ✅ Is there a skip-to-content link for keyboard users?

### ARIA
- ✅ Are `aria-label` or `aria-labelledby` used on icon buttons?
- ✅ Is `aria-expanded` used on toggleable elements?
- ✅ Is `aria-hidden="true"` used on decorative elements?

### Focus Management
- ✅ Are focus states visible (outline or custom focus ring)?
- ✅ Is focus trapped in modals?
- ✅ Does keyboard navigation work (Tab, Enter, Escape)?

### Comments
```markdown
🤖 Copilot Insight: This icon button is missing an aria-label, making 
it unclear to screen reader users what the button does.

Location: partials/header.html, line 23

❌ Current:
<button class="close-btn">
  <i class="fas fa-times"></i>
</button>

✅ Suggested:
<button class="close-btn" aria-label="Close menu">
  <i class="fas fa-times"></i>
</button>
```

---

## Responsive Design Review Prompts

### Mobile Layout
- ✅ Does the layout work on 320px width screens?
- ✅ Is horizontal scroll prevented?
- ✅ Are images responsive (max-width: 100%)?
- ✅ Is the chat area scrollable while viewport is not?

### Orientation
- ✅ Does the layout adapt to portrait and landscape?
- ✅ Are media queries using both width and orientation?

### Safe Area
- ✅ Is `env(safe-area-inset-bottom)` used on fixed footer?
- ✅ Is `env(safe-area-inset-left/right)` used where needed?

### Comments
```markdown
🤖 Copilot Insight: This fixed footer should include safe-area-inset 
for iPhone X and newer models with notches and home indicators.

Location: assets/css/mobile.css, line 156

❌ Current:
.mobile-footer {
  position: fixed;
  bottom: 0;
  padding-bottom: 12px;
}

✅ Suggested:
.mobile-footer {
  position: fixed;
  bottom: 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
```

---

## Brand Consistency Review Prompts

### Colors
- ✅ Do all colors match the Pmerit theme?
  - Primary: #2A5B8C (Dark Blue)
  - Secondary: #4AA4B9 (Teal)
  - Accent: #FF6B6B (Coral)

### Typography
- ✅ Are headings using Montserrat font?
- ✅ Is body text using Inter font?
- ✅ Are font sizes consistent with the spec?

### Spacing
- ✅ Is spacing using 4px/8px multiples?
- ✅ Are margins and padding consistent across components?

### Comments
```markdown
🤖 Copilot Insight: This heading is using Inter font, but per the 
Pmerit brand specification, all headings should use Montserrat.

Location: assets/css/typography.css, line 34

❌ Current:
h1 { font-family: 'Inter', sans-serif; }

✅ Suggested:
h1 { font-family: var(--font-heading); } /* Montserrat */
```

---

## Performance Review Prompts

### CSS
- ✅ Are there any unused CSS rules?
- ✅ Can selectors be simplified?
- ✅ Are there redundant declarations?

### JavaScript
- ✅ Are event listeners removed when no longer needed?
- ✅ Is debouncing/throttling used for scroll/resize events?
- ✅ Are large operations deferred or async?

### Assets
- ✅ Are images optimized and compressed?
- ✅ Are fonts loaded efficiently (preload critical fonts)?
- ✅ Are scripts deferred or loaded async?

### Comments
```markdown
🤖 Copilot Insight: This scroll event listener fires on every scroll 
event, which can cause performance issues. Consider throttling it.

Location: assets/js/main.js, line 67

❌ Current:
window.addEventListener('scroll', () => {
  updateScrollPosition();
});

✅ Suggested:
window.addEventListener('scroll', throttle(() => {
  updateScrollPosition();
}, 100));
```

---

## Summary Prompt Template

When providing a summary comment, use this format:

```markdown
## 🤖 Copilot Review Summary

### ✅ Passed
- Mobile-first approach confirmed
- CSS variables used consistently
- Semantic HTML structure
- Touch targets meet 44px minimum

### ⚠️ Warnings
- Missing safe-area-inset in mobile footer (line 156)
- Heading using wrong font family (line 34)

### 🔴 Critical
- Missing aria-label on icon buttons (lines 23, 45, 67)
- Button height below 44px minimum (line 142)

### 📊 Stats
- Files reviewed: 5
- Issues found: 6
- Critical: 2
- Warnings: 2
- Info: 2

### 🔗 References
- [.copilot/config.yml](.copilot/config.yml)
- [Pmerit Theme](.copilot/Pmerit-theme_typography.html)
- [HTML Style Guide](.copilot/hints/html-style-guide.md)
```

---

**Remember:** Always provide actionable, specific feedback with file names and line numbers. Focus on helping maintain consistency and quality, not on nitpicking minor style preferences.
