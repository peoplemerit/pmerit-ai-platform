# GitHub Copilot Instructions for PMERIT AI Platform

> Instructions for GitHub Copilot when working on the PMERIT educational platform

## 📋 Project Overview

PMERIT is a mission-driven educational platform focused on breaking poverty cycles through accessible education and remote career opportunities, primarily serving underserved communities in Nigeria and Africa.

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Modular ES6+)
- **Design**: Responsive with CSS Grid and Flexbox
- **Deployment**: GitHub Pages with custom domain (pmerit.com)
- **Authentication**: Mock implementation (Phase 1) - localStorage based

## 🎨 Design System

### Brand Colors (Authoritative Source: `.copilot/Pmerit-theme_typography.html`)
- **Primary**: `#2A5B8C` (Dark Blue)
- **Secondary**: `#4AA4B9` (Teal)
- **Accent**: `#FF6B6B` (Coral)
- **Success**: `#3A7F5C` (Green)
- **Warning**: `#E67E22` (Orange)
- **Purple Gradient**: `#667eea → #764ba2` (structural design element)

### Typography
- **Headings**: Montserrat, sans-serif
- **Body**: Inter, sans-serif
- **Sizes**: h1 (32px), h2 (24px), h3 (20px), body (16px), small (14px)

### Theme
- **Default**: Light mode (backgrounds: `#F8F9FA`, `#FFFFFF`; text: `#2C2C2C`, `#6C757D`)
- **Dark Mode**: Phase 6 feature (optional toggle, not default)

### Design Sources
1. **Structure**: `.copilot/blueprint-index.html` - Layout grid, component placement, three-panel desktop structure
2. **Brand**: `.copilot/Pmerit-theme_typography.html` - Colors, fonts, typography (AUTHORITATIVE)

**Important**: Use blueprint for structure only. Apply Pmerit brand colors, NOT blueprint colors.

## 📱 Responsive Design Requirements

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Mobile Requirements
- Non-scrollable viewport (except chat area)
- Safe-area-inset for iOS notch/home indicator
- Minimum 44px touch targets for accessibility
- Dynamic viewport height (`dvh`) usage
- Hamburger menu navigation
- Collapsible sidebars and touch-friendly interactions

### Desktop Requirements
- Three-panel layout (280px sidebar | 1fr main | 320px right panel)
- Persistent navigation sidebar
- Full footer with all links

### Mobile Layout Flow
Header → Hero Section → Chat Area → Input Area → Footer

## 🏗️ Code Standards

### HTML
- Use semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, `<section>`, etc.)
- Include proper ARIA labels for accessibility
- Provide alt text for all images
- Maintain proper heading hierarchy (no skipped levels)
- Follow kebab-case for file names

### CSS
- **Mobile-first approach** - Always start with mobile styles
- **Use CSS variables** for theming (no hardcoded colors)
- **No inline styles** unless absolutely necessary and justified
- **Consistent spacing**: Use 4px/8px multiples
- **BEM or utility-based** methodology for class naming
- **Indentation**: 2 spaces
- **Safe-area-inset**: Implement for iOS devices

### JavaScript
- Use modern ES6+ syntax (`const`/`let`, arrow functions, modules)
- **No `var`** declarations
- **No console.log** statements in production code
- Modular functions and files
- Event delegation where appropriate
- Descriptive function and variable names
- No global variables - use modules or IIFE patterns

## 📂 Project Structure

```
project-root/
├── .copilot/                    # Configuration & reference files
│   ├── config.yml
│   ├── hints/
│   ├── prompts/
│   ├── Pmerit-theme_typography.html
│   └── blueprint-index.html
├── .github/
│   ├── workflows/
│   └── copilot-instructions.md  # This file
├── assets/
│   ├── css/
│   │   ├── theme-variables.css
│   │   ├── base.css
│   │   ├── typography.css
│   │   ├── components.css
│   │   ├── mobile.css
│   │   └── desktop.css
│   ├── js/
│   │   ├── menu.js
│   │   ├── modal.js
│   │   ├── chat.js
│   │   └── main.js
│   └── img/
├── partials/
│   ├── header.html
│   ├── footer.html
│   └── nav.html
└── *.html                       # Page files
```

## ♿ Accessibility Standards

### WCAG AA Compliance
- Maintain color contrast ratios ≥ 4.5:1 for normal text
- Maintain color contrast ratios ≥ 3:1 for large text
- Provide keyboard navigation for all interactive elements
- Implement focus traps in modals
- Support Escape key to close modals/menus
- Ensure focus states are visible
- Use semantic HTML elements
- Include descriptive ARIA labels where needed

### Touch Targets
- Minimum 44px × 44px for all interactive elements on mobile
- Adequate spacing between touch targets

## 🧪 Development Workflow

### Before Making Changes
1. Understand the existing code structure
2. Check relevant documentation in `.copilot/` directory
3. Review brand consistency in `Pmerit-theme_typography.html`
4. Verify responsive behavior requirements

### When Making Changes
1. **Maintain consistency**: All pages share unified header/footer/styling
2. **Test responsiveness**: Check at 320px, 768px, and 1024px+ widths
3. **Validate accessibility**: Test keyboard navigation and screen reader compatibility
4. **Use existing patterns**: Follow established code patterns in the repository
5. **Modular approach**: Split code into reusable components

### Quality Checks
- Run HTML linters (`.htmlhintrc` configured)
- Run CSS linters (`.stylelintrc.json` configured)
- Run ESLint (`.eslintrc.json` configured)
- Test on mobile and desktop viewports
- Verify color contrast ratios
- Check for console errors
- Validate that no hardcoded colors are used

## 🚫 What NOT to Do

❌ Convert to dark theme by default  
❌ Use blueprint colors (except the purple gradient)  
❌ Add inline styles without justification  
❌ Use `var` for variable declarations  
❌ Hardcode hex colors instead of CSS variables  
❌ Skip ARIA labels on interactive elements  
❌ Create touch targets smaller than 44px on mobile  
❌ Remove the purple gradient design element  
❌ Use different fonts than Montserrat/Inter  
❌ Break the mobile-first approach  
❌ Modify reference files in `.copilot/` directory

## ✅ Best Practices

✅ Use Pmerit brand colors from `Pmerit-theme_typography.html`  
✅ Use blueprint structure from `blueprint-index.html`  
✅ Maintain light theme as default  
✅ Preserve the purple gradient (#667eea → #764ba2)  
✅ Use CSS variables for all color values  
✅ Follow mobile-first responsive design  
✅ Implement safe-area-inset for iOS  
✅ Use semantic HTML5 elements  
✅ Provide comprehensive ARIA labels  
✅ Test keyboard navigation  
✅ Maintain consistent spacing (4px/8px multiples)  
✅ Keep modular code structure  
✅ Write descriptive comments when necessary  
✅ Follow existing code patterns in the repository

## 📝 Review Criteria

When reviewing code or suggesting changes, focus on:

### Structure & Organization
- File hierarchy and naming conventions
- Modularization and reusability
- No orphaned or unused files
- Proper component separation

### Code Quality
- Clean, readable code
- Proper syntax and formatting
- No redundant or conflicting code
- Efficient use of CSS/JS
- Following established patterns

### Responsiveness
- Mobile-first implementation
- Proper breakpoint usage
- Safe-area-inset for iOS
- Dynamic viewport height (`dvh`)
- No horizontal scroll issues
- Proper orientation handling

### Brand Consistency
- Correct color usage
- Proper typography
- Consistent spacing
- Unified header/footer across pages

### Functionality
- Working menus and modals
- Proper keyboard navigation
- Focus management
- Form validation where applicable
- Interactive elements respond correctly

### Accessibility
- Semantic HTML
- ARIA labels present
- Alt text on images
- Proper heading hierarchy
- Sufficient color contrast
- Keyboard accessibility
- Focus indicators visible

### Performance
- Optimized assets
- No redundant code
- Deferred scripts where appropriate
- Efficient CSS selectors

## 📚 Key Documentation Files

- **`.copilot/Pmerit-theme_typography.html`** - Brand colors, fonts, typography (AUTHORITATIVE)
- **`.copilot/blueprint-index.html`** - Layout structure and component placement
- **`.copilot/DESIGN_SYSTEM_QUICK_REFERENCE.md`** - Quick reference for design decisions
- **`.copilot/config.yml`** - Copilot configuration and review settings
- **`INSTRUCTIONS_Copilot.md`** - Detailed audit and review guide
- **`PROJECT_OVERVIEW.md`** - Project goals and workflow overview
- **`README.md`** - Project setup and development guide

## 🎯 Mission Context

Remember that PMERIT's mission is to break poverty cycles through accessible education. When making suggestions or changes:

- Prioritize accessibility to ensure the platform is usable by all
- Consider low-bandwidth scenarios common in target regions
- Maintain simple, clear UX that doesn't require extensive technical knowledge
- Ensure mobile experience is excellent (primary device for many users)
- Keep educational content and messaging front and center

## 🔄 Workflow Coordination

This project uses a structured workflow:
1. **Implementation**: Code changes and feature development
2. **Audit**: GitHub Copilot reviews for technical accuracy
3. **Validation**: Human reviewers provide creative validation and final approval

When providing feedback or suggestions, use constructive language with clear explanations and actionable recommendations.

---

**Version**: 1.0  
**Last Updated**: October 29, 2025  
**Status**: Production Reference
