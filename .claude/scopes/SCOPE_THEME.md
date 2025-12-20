# PMERIT SUB-SCOPE: Platform Theme & Design System

**Version:** 1.0
**Created:** 2025-12-19
**Last Updated:** 2025-12-19
**Status:** DRAFT (Audit Complete, Implementation Pending)
**Phase:** Foundation
**Session:** 65
**Related Scopes:** All scopes (theme affects entire platform)

---

## SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Unified Platform Theme & Design System |
| **Purpose** | Eliminate UI inconsistencies, establish single source of truth |
| **Primary CSS** | `assets/css/light-theme.css` (canonical) |
| **Deprecated** | `assets/css/theme-variables.css` (to be removed) |
| **Affected Files** | All CSS files, inline styles in HTML |

---

## AUDIT REPORT (Session 65)

### Executive Summary

The PMERIT codebase has **significant theming inconsistencies**:
- **4 competing theme systems** exist
- **955+ hardcoded color values** bypass the design system
- **Primary color defined 3 different ways**
- **Button/hover/focus states vary by component**

### Theme Systems Found

| System | File | Status | Variables |
|--------|------|--------|-----------|
| Primary | `light-theme.css` | **USE THIS** | 140+ |
| Alternate | `theme-variables.css` | DEPRECATED | 170+ |
| Isolated | `classroom.css` | NEEDS INTEGRATION | 20+ |
| Legacy | `brand.css` | REVIEW | Gradients |

### Critical Issues

1. **Primary Color Conflict:**
   - `light-theme.css`: `#2A5B8C`
   - `theme-variables.css`: `#375b8d`
   - Hardcoded in files: `rgba(42, 91, 140, ...)`

2. **Hardcoded Values by File:**
   | File | Hardcoded Values |
   |------|------------------|
   | avatar.css | 25 |
   | language-modal.css | 32 |
   | desktop.css | 15+ |
   | responsive.css | 10+ |
   | classroom.css | Entire file |

3. **Inconsistent Button States:**
   - 4+ different button patterns
   - No standard `:active` state
   - Focus rings vary (2px outline vs 3px shadow)

---

## ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| THEME-001 | Source of Truth | `light-theme.css` | Most comprehensive, correct brand colors | 65 |
| THEME-002 | Base Unit | 4px | Consistent spacing scale | 65 |
| THEME-003 | Primary Font | Inter | Modern, readable, good language support | 65 |
| THEME-004 | Heading Font | Montserrat | Brand identity | 65 |
| THEME-005 | Color Format | HSL for variants | Easier hover/active states | 65 |

---

## DESIGN TOKENS (Canonical)

### Brand Colors

```css
/* PRIMARY PALETTE */
--color-primary: #2A5B8C;           /* Main brand blue */
--color-primary-dark: #1f4567;      /* Hover state */
--color-primary-light: #3a7bb0;     /* Light variant */
--color-primary-rgb: 42, 91, 140;   /* For rgba() */

/* SECONDARY PALETTE */
--color-secondary: #4AA4B9;         /* Teal accent */
--color-secondary-dark: #3d8fa1;    /* Hover state */
--color-secondary-light: #7ED0D9;   /* Light teal */

/* ACCENT COLORS */
--color-accent: #FF6B6B;            /* Coral/red accent */
--color-accent-dark: #E05A5A;       /* Hover state */

/* SEMANTIC COLORS */
--color-success: #22c55e;           /* Green */
--color-warning: #F59E0B;           /* Amber */
--color-error: #ef4444;             /* Red */
--color-info: #3b82f6;              /* Blue */
```

### Background Colors

```css
/* LIGHT MODE */
--bg-primary: #FFFFFF;              /* Main background */
--bg-secondary: #F8FAFC;            /* Cards, sections */
--bg-tertiary: #F1F5F9;             /* Hover states */
--bg-surface: #FFFFFF;              /* Elevated surfaces */

/* DARK MODE */
--bg-dark-primary: #0f1419;         /* Main background */
--bg-dark-secondary: #192734;       /* Cards, sections */
--bg-dark-tertiary: #1e3a4d;        /* Hover states */
--bg-dark-surface: #1a2332;         /* Elevated surfaces */
```

### Text Colors

```css
/* LIGHT MODE */
--text-primary: #1E293B;            /* Headings */
--text-secondary: #475569;          /* Body text */
--text-muted: #94A3B8;              /* Captions, hints */
--text-inverse: #FFFFFF;            /* On dark backgrounds */

/* DARK MODE */
--text-dark-primary: #e7e9ea;       /* Headings */
--text-dark-secondary: #8b98a5;     /* Body text */
--text-dark-muted: #6e767d;         /* Captions, hints */
```

### Spacing Scale (4px base)

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.15);
```

### Typography

```css
/* FONT FAMILIES */
--font-heading: 'Montserrat', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* FONT SIZES */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 2rem;      /* 32px */
--text-4xl: 2.5rem;    /* 40px */

/* FONT WEIGHTS */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* LINE HEIGHTS */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Transitions

```css
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;
```

---

## BUTTON COMPONENT SYSTEM

### Base Button

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--transition-normal);
}

/* States */
.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0) scale(0.98);
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### Button Variants

```css
/* PRIMARY */
.btn--primary {
  background: var(--color-primary);
  color: var(--text-inverse);
}
.btn--primary:hover {
  background: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}

/* SECONDARY */
.btn--secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
.btn--secondary:hover {
  background: rgba(var(--color-primary-rgb), 0.1);
}

/* GHOST */
.btn--ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn--ghost:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* DANGER */
.btn--danger {
  background: var(--color-error);
  color: var(--text-inverse);
}
.btn--danger:hover {
  background: #dc2626;
}

/* SUCCESS */
.btn--success {
  background: var(--color-success);
  color: var(--text-inverse);
}
.btn--success:hover {
  background: #16a34a;
}
```

### Button Sizes

```css
.btn--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
}

.btn--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-base);
}

.btn--icon {
  padding: var(--space-2);
  width: 36px;
  height: 36px;
}
```

---

## HOVER/ACTIVE/FOCUS STATES (Standard)

### Interactive Elements

```css
/* STANDARD HOVER */
.interactive:hover {
  background: var(--bg-tertiary);
  transition: background var(--transition-fast);
}

/* STANDARD ACTIVE */
.interactive:active {
  transform: scale(0.98);
  transition: transform 50ms ease;
}

/* STANDARD FOCUS */
.interactive:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* TAP HIGHLIGHT (Mobile) */
.interactive {
  -webkit-tap-highlight-color: rgba(var(--color-primary-rgb), 0.1);
}
```

### Links

```css
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

---

## IMPLEMENTATION TASKS

### Phase 1: Foundation (Priority: Critical)

- [ ] **T1.1** Remove `theme-variables.css` (deprecated)
- [ ] **T1.2** Add missing variables to `light-theme.css`:
  - `--color-amber: #F59E0B`
  - `--color-secondary-dark: #3d8fa1`
  - `--radius-2xl: 24px`
- [ ] **T1.3** Create `_buttons.css` component with standard system
- [ ] **T1.4** Create `_states.css` for hover/active/focus standards

### Phase 2: Migration (Priority: High)

- [ ] **T2.1** Migrate `avatar.css` to use variables (25 values)
- [ ] **T2.2** Migrate `language-modal.css` to use variables (32 values)
- [ ] **T2.3** Migrate `desktop.css` to use variables (15+ values)
- [ ] **T2.4** Migrate `responsive.css` to use variables (10+ values)

### Phase 3: Integration (Priority: Medium)

- [ ] **T3.1** Integrate `classroom.css` with main theme system
- [ ] **T3.2** Update inline styles in `portal/*.html`
- [ ] **T3.3** Audit and fix `brand.css` gradients

### Phase 4: Documentation (Priority: Low)

- [ ] **T4.1** Create Storybook/style guide page
- [ ] **T4.2** Document all design tokens
- [ ] **T4.3** Add CSS linting rules for hardcoded values

---

## FILES TO MODIFY

### Priority 1 (Hardcoded Values)

| File | Values | Action |
|------|--------|--------|
| `assets/css/avatar.css` | 25 | Replace hardcoded |
| `assets/css/language-modal.css` | 32 | Replace hardcoded |
| `assets/css/desktop.css` | 15+ | Replace hardcoded |
| `assets/css/responsive.css` | 10+ | Replace hardcoded |
| `assets/css/avatar-frame.css` | 7 | Replace hardcoded |

### Priority 2 (System Integration)

| File | Issue | Action |
|------|-------|--------|
| `assets/css/classroom.css` | Isolated theme | Integrate with main |
| `assets/css/theme-variables.css` | Deprecated | Remove |
| `assets/css/brand.css` | Legacy | Review/update |

### Priority 3 (Component Consistency)

| File | Issue | Action |
|------|-------|--------|
| `assets/css/components.css` | Mixed patterns | Standardize |
| `assets/css/modal.css` | Inline values | Use variables |
| `assets/css/proctor-mode.css` | Custom shadows | Standardize |

---

## VERIFICATION CHECKLIST

Before marking tasks complete:

- [ ] No hardcoded hex colors (use variables)
- [ ] No hardcoded px for spacing (use --space-*)
- [ ] No hardcoded px for radius (use --radius-*)
- [ ] All buttons use standard system
- [ ] All hover states use standard pattern
- [ ] All focus states have visible outline
- [ ] Works in both light and dark mode
- [ ] No !important flags (except utilities)

---

## SESSION HISTORY

| Session | Date | Changes |
|---------|------|---------|
| 65 | 2025-12-19 | Created scope, completed audit |

---

*Last Updated: 2025-12-19 by Claude Code (Session 65)*
*Status: Audit Complete, Implementation Ready*
