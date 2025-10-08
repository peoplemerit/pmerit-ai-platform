# Design Consistency Prompts

Use these prompts when auditing design consistency across the PMERIT platform.

---

## Visual Hierarchy

### Typography Consistency
Check that all text follows the established hierarchy:

```
H1: Montserrat, 32px, Bold (700)
H2: Montserrat, 24px, Semibold (600)
H3: Montserrat, 20px, Semibold (600)
Body: Inter, 16px, Regular (400)
Small: Inter, 14px, Regular (400)
```

**Review Questions:**
- Are heading sizes consistent across all pages?
- Is the font family correct for each element?
- Are font weights appropriate (not mixing Regular/Medium/Bold randomly)?

---

## Color Consistency

### Brand Palette Verification
All colors must come from the Pmerit theme:

| Color Name | Hex | Usage |
|------------|-----|-------|
| Primary | `#2A5B8C` | Primary buttons, links, headers |
| Secondary | `#4AA4B9` | Secondary elements, highlights |
| Accent | `#FF6B6B` | CTAs, important notices |
| Success | `#3A7F5C` | Success messages |
| Warning | `#E67E22` | Warnings, alerts |
| Light Gray | `#F8F9FA` | Backgrounds |
| Dark Gray | `#2C2C2C` | Text |
| Medium Gray | `#6C757D` | Secondary text |

**Check for:**
- ❌ Any hardcoded hex colors not in this list
- ❌ RGB or HSL values instead of CSS variables
- ❌ Inconsistent use of grays across pages

**Correct Pattern:**
```css
/* ✅ Good - Uses CSS variable */
.button-primary {
  background: var(--primary);
  color: var(--text-inverse);
}

/* ❌ Bad - Hardcoded color */
.button-primary {
  background: #2A5B8C;
  color: white;
}
```

---

## Spacing Consistency

### 4px/8px Grid System
All spacing should use multiples of 4px or 8px:

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px
```

**Check for:**
- Random spacing values (e.g., 15px, 23px, 37px)
- Inconsistent padding across similar components
- Inconsistent margins between sections

**Example Violations:**
```css
/* ❌ Bad - Random spacing */
.card {
  padding: 15px; /* Should be 16px or 12px */
  margin-bottom: 23px; /* Should be 24px or 20px */
}

/* ✅ Good - Consistent spacing */
.card {
  padding: var(--space-4); /* 16px */
  margin-bottom: var(--space-6); /* 24px */
}
```

---

## Component Consistency

### Header Comparison
Compare headers across all pages:

**Mobile Header Requirements:**
- Height: 60px - 70px
- Logo: Left-aligned, 40px height
- Actions: Right-aligned
- Order: Language → Hamburger → Sign-in
- Background: White (light mode) / Dark (dark mode)
- Border-bottom: 1px solid var(--border-color)

**Desktop Header Requirements:**
- Height: 70px
- Logo: Left section
- Navigation: Center section
- User actions: Right section
- Consistent across all pages

**Check:**
- [ ] Header height consistent across pages
- [ ] Logo size/position consistent
- [ ] Button spacing consistent
- [ ] Border/shadow consistent

---

### Footer Comparison

**Mobile Footer:**
- Content: Privacy & Terms | Connected to Educational Services
- Position: Fixed at bottom
- Padding: Include safe-area-inset-bottom
- Background: Matches header

**Desktop Footer:**
- Content: All links, copyright, social icons
- Position: Bottom of page (not fixed)
- Layout: Multi-column
- Background: Subtle background color

**Check:**
- [ ] Footer content matches spec for mobile/desktop
- [ ] Links styled consistently
- [ ] Safe area padding on mobile
- [ ] Responsive breakpoint works

---

### Button Consistency

All buttons should follow one of these patterns:

**Primary Button:**
```css
.btn-primary {
  background: var(--primary);
  color: var(--text-inverse);
  padding: var(--space-3) var(--space-6);
  border-radius: 6px;
  min-height: 44px; /* Mobile */
}
```

**Secondary Button:**
```css
.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: var(--space-3) var(--space-6);
  border-radius: 6px;
  min-height: 44px; /* Mobile */
}
```

**Check:**
- [ ] All primary buttons use same background color
- [ ] All buttons have minimum 44px height on mobile
- [ ] Border radius consistent (6px)
- [ ] Padding consistent
- [ ] Hover states consistent

---

## Layout Consistency

### Mobile Layout (320px - 767px)
Every page should have:
- Non-scrollable viewport (except chat area)
- Hamburger menu for navigation
- Fixed header (60px - 70px)
- Simplified footer
- Full-width content
- Safe-area-inset support

**Check:**
- [ ] Viewport height uses `100dvh`
- [ ] No horizontal scroll
- [ ] Header fixed at top
- [ ] Footer at bottom with safe area
- [ ] Content doesn't overflow

---

### Desktop Layout (1024px+)
Every page should have:
- Three-panel grid (sidebar, main, right panel)
- Persistent left sidebar (280px)
- Main content area (flexible)
- Right panel (320px) - optional
- Full footer with all links

**Check:**
- [ ] Grid layout consistent across pages
- [ ] Sidebar width consistent (280px)
- [ ] Right panel width consistent (320px)
- [ ] Gap between panels consistent
- [ ] Responsive behavior smooth

---

## Interactive Elements

### Hover States
All interactive elements should have consistent hover states:

**Links:**
```css
a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}
```

**Buttons:**
```css
.button {
  transition: all 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

**Check:**
- [ ] Transition timing consistent (0.2s - 0.3s)
- [ ] Transform effects consistent
- [ ] Color changes consistent
- [ ] No jarring or abrupt changes

---

### Focus States
All interactive elements must have visible focus states:

```css
button:focus,
a:focus,
input:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

**Check:**
- [ ] Focus outline visible on all interactive elements
- [ ] Outline color consistent (primary blue)
- [ ] Outline width consistent (2px)
- [ ] Outline offset consistent (2px)

---

## Animation Consistency

### Menu Animations
```css
.mobile-menu {
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal {
  transition: opacity 0.3s ease;
}
```

**Check:**
- [ ] Slide-in animations: 0.3s with easing
- [ ] Fade animations: 0.3s ease
- [ ] No animations > 0.5s (feels sluggish)
- [ ] Reduced motion respected

---

## Image & Icon Consistency

### Logo Usage
- **Mobile:** 40px height, maintains aspect ratio
- **Desktop:** 50px height, maintains aspect ratio
- **Alt text:** "PMERIT" or "PMERIT platform logo"

### Icons
- Icon size: 20px - 24px standard, 16px for small
- Icon color: Inherits from parent or uses CSS variable
- Icon style: Font Awesome or consistent SVG set

**Check:**
- [ ] Logo size consistent across pages
- [ ] Icon sizes consistent within context
- [ ] Icon colors follow theme
- [ ] All icons have proper alt/aria-label

---

## Mobile-Specific Consistency

### Touch Targets
All touch targets must be at least 44px × 44px:

```css
.mobile-btn {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-3) var(--space-4);
}
```

**Check:**
- [ ] All buttons ≥ 44px height
- [ ] All links in nav ≥ 44px tap area
- [ ] Toggle switches ≥ 44px
- [ ] Form inputs ≥ 44px height

---

### Safe Area Support
All fixed elements must respect safe areas:

```css
.mobile-header {
  padding-top: env(safe-area-inset-top);
}

.mobile-footer {
  padding-bottom: env(safe-area-inset-bottom);
}
```

**Check:**
- [ ] Header includes safe-area-inset-top
- [ ] Footer includes safe-area-inset-bottom
- [ ] Fixed sidebars include safe-area-inset-left/right

---

## Cross-Page Consistency Checklist

When comparing multiple pages, verify:

- [ ] **Headers** are identical (mobile and desktop)
- [ ] **Footers** are identical (mobile and desktop)
- [ ] **Color palette** consistent across all pages
- [ ] **Typography** consistent across all pages
- [ ] **Spacing** follows 4px/8px grid everywhere
- [ ] **Button styles** identical across pages
- [ ] **Form inputs** styled consistently
- [ ] **Icons** same size and style
- [ ] **Animations** same timing and easing
- [ ] **Hover states** identical behavior
- [ ] **Focus states** identical appearance
- [ ] **Responsive breakpoints** work the same
- [ ] **Mobile touch targets** all ≥ 44px
- [ ] **Safe area** respected on all fixed elements

---

## Visual Regression Testing

### Desktop Comparison
Compare against `.copilot/blueprint-index.html`:

1. Layout structure (three panels)
2. Color scheme matches
3. Typography hierarchy
4. Spacing proportions
5. Component placement

### Mobile Comparison
Compare against reference images:

1. Header layout and spacing
2. Menu slide-in behavior
3. Chat interface design
4. Footer simplification
5. Safe area handling

---

## Reporting Inconsistencies

When you find design inconsistencies, report them like this:

```markdown
🤖 Copilot Design Review: Inconsistency detected

**Issue:** Header height varies between pages
- index.html: 70px
- courses.html: 65px
- dashboard.html: 72px

**Expected:** All headers should be 70px height

**Files affected:**
- courses.html (line 34)
- dashboard.html (line 28)

**Suggested fix:**
Update header height to 70px in both files to match index.html
```

---

**Goal:** Ensure every page feels like part of a cohesive, professionally designed platform. Consistency builds trust and improves user experience.
