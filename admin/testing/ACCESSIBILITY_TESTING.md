# Accessibility Testing Guide
**PMERIT Platform - Issue #14: Comprehensive Cross-Device Testing**

---

## 🎯 Purpose

This guide provides comprehensive procedures for testing the PMERIT platform's accessibility compliance with WCAG 2.1 AA standards.

---

## 📋 Testing Requirements

### Success Criteria
- **WCAG 2.1 Level AA** compliance
- **Lighthouse Accessibility Score** ≥90
- **No critical accessibility issues**
- **Screen reader compatible**
- **Full keyboard navigation**

---

## 🛠️ Testing Tools

### Automated Testing Tools

#### 1. **Lighthouse** (Built into Chrome DevTools)
- Comprehensive accessibility audit
- Scores pages 0-100
- Identifies common issues
- Provides fix recommendations

#### 2. **axe DevTools** (Browser Extension)
- Free extension for Chrome/Firefox
- Install: https://www.deque.com/axe/devtools/
- Detects 57% of accessibility issues automatically
- Provides detailed fix guidance

#### 3. **WAVE** (Web Accessibility Evaluation Tool)
- Browser extension: https://wave.webaim.org/extension/
- Visual feedback tool
- Identifies errors, alerts, and features
- Shows structural elements

#### 4. **Color Contrast Analyzer**
- Check text/background contrast ratios
- Target: 4.5:1 for normal text, 3:1 for large text
- Tool: https://webaim.org/resources/contrastchecker/

### Manual Testing Tools

#### 1. **Screen Readers**
- **VoiceOver** (macOS/iOS): Built-in, Cmd+F5 to activate
- **NVDA** (Windows): Free download from https://www.nvaccess.org/
- **JAWS** (Windows): Commercial, most popular in enterprise
- **TalkBack** (Android): Built-in, Settings > Accessibility

#### 2. **Keyboard Only Navigation**
- Unplug mouse or disable trackpad
- Navigate using only keyboard
- Tab, Shift+Tab, Enter, Space, Arrow keys, Escape

---

## ✅ Testing Checklist

### 1. Perceivable - Information and UI must be presentable

#### Images & Media
- [ ] All images have descriptive `alt` attributes
- [ ] Decorative images have `alt=""` or `role="presentation"`
- [ ] Complex images have extended descriptions
- [ ] Icons have accessible labels or `aria-label`
- [ ] Background images used only for decoration
- [ ] Videos have captions
- [ ] Audio content has transcripts

#### Color & Contrast
- [ ] Color contrast ratio ≥4.5:1 for normal text
- [ ] Color contrast ratio ≥3:1 for large text (18px+)
- [ ] Information not conveyed by color alone
- [ ] Links distinguishable from surrounding text
- [ ] Focus indicators have ≥3:1 contrast ratio

#### Text
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] Line height at least 1.5x font size
- [ ] Paragraph spacing at least 2x font size
- [ ] No horizontal scrolling at 320px width
- [ ] Text is selectable (not in images)

---

### 2. Operable - UI components and navigation must be operable

#### Keyboard Navigation
- [ ] All functionality available via keyboard
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators clearly visible
- [ ] No keyboard traps
- [ ] Skip link provided to main content
- [ ] Keyboard shortcuts documented

**Test Procedure:**
```
1. Press Tab repeatedly - verify all interactive elements are reachable
2. Press Shift+Tab - verify backwards navigation works
3. Press Enter/Space on buttons - verify they activate
4. Press Escape - verify modals/menus close
5. Arrow keys - verify they work in menus/sliders
6. Never get stuck - must always be able to move focus
```

#### Touch Targets (Mobile)
- [ ] All touch targets ≥44×44 CSS pixels
- [ ] Adequate spacing between touch targets
- [ ] No overlapping interactive elements
- [ ] Gestures have alternatives (e.g., swipe + button)

#### Timing
- [ ] Users have sufficient time to complete tasks
- [ ] Time limits can be turned off, adjusted, or extended
- [ ] Auto-playing content can be paused
- [ ] Moving content can be paused, stopped, or hidden

#### Navigation
- [ ] Multiple ways to navigate (menu, search, sitemap)
- [ ] Page titles are descriptive and unique
- [ ] Focus order makes sense
- [ ] Link purpose clear from link text or context
- [ ] Breadcrumbs provided where appropriate

---

### 3. Understandable - Information and UI must be understandable

#### Readable
- [ ] Page language identified in HTML (`lang="en"`)
- [ ] Language of parts identified when changing
- [ ] Unusual words defined or linked to definitions
- [ ] Abbreviations expanded on first use
- [ ] Reading level appropriate for audience
- [ ] Pronunciation provided for ambiguous words

#### Predictable
- [ ] Navigation consistent across all pages
- [ ] Components behave consistently
- [ ] No unexpected context changes on focus
- [ ] No unexpected context changes on input
- [ ] Modals/popups clearly labeled

#### Input Assistance
- [ ] Form labels clearly associated with inputs
- [ ] Error messages descriptive and helpful
- [ ] Suggestions provided for errors
- [ ] Error prevention for critical actions
- [ ] Confirmation required for financial/legal actions
- [ ] Users can review and correct submissions

---

### 4. Robust - Content must be robust enough for assistive technologies

#### Compatible
- [ ] Valid HTML (no parsing errors)
- [ ] Unique IDs on all elements
- [ ] Correct semantic elements used (nav, main, article, etc.)
- [ ] ARIA attributes used correctly
- [ ] Name, role, value provided for all components
- [ ] Status messages announced to screen readers

---

## 🧪 Testing Procedures

### Procedure 1: Automated Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Navigate to Lighthouse tab
3. Select "Accessibility" category
4. Click "Analyze page load"
5. Review results:
   - **90-100:** Excellent - meets standards
   - **50-89:** Needs improvement
   - **0-49:** Critical issues - must fix

**Pages to Test:**
- assessment-entry.html
- assessment-questions.html
- assessment-processing.html
- assessment-results.html
- classroom.html
- learner-portal.html
- index.html

---

### Procedure 2: axe DevTools Scan

1. Install axe DevTools extension
2. Open DevTools and navigate to "axe DevTools" tab
3. Click "Scan ALL of my page"
4. Review issues by severity:
   - **Critical:** Must fix immediately
   - **Serious:** Should fix before launch
   - **Moderate:** Should fix if time permits
   - **Minor:** Nice to fix

5. For each issue:
   - Read the description
   - Click "Inspect" to see affected element
   - Follow "Learn more" link for fix guidance
   - Document in TEST_REPORT.md

---

### Procedure 3: WAVE Evaluation

1. Install WAVE extension
2. Click WAVE icon in browser toolbar
3. Review the sidebar:
   - **Errors (red):** Must fix
   - **Alerts (yellow):** Review manually
   - **Features (green):** Good accessibility features present
   - **Structural (blue):** Page structure elements

4. Click each icon to highlight on page
5. Review details panel for fix recommendations
6. Document findings

---

### Procedure 4: Color Contrast Testing

1. Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
2. Test all text/background combinations:
   - Body text on backgrounds
   - Button text on button backgrounds
   - Link colors on backgrounds
   - Error messages
   - Success messages
   - Form placeholders

3. Required ratios:
   - Normal text: 4.5:1
   - Large text (18px+ or 14px+ bold): 3:1
   - UI components (borders, icons): 3:1

**Common Elements to Test:**
```
Primary button: White text on #6B5CE7
Secondary button: #333 text on #f0f0f0
Error text: Red on light pink background
Success text: Green on light green background
Body text: #333 on white
Link text: #2196F3 on white
```

---

### Procedure 5: Keyboard Navigation Testing

**Setup:**
1. Unplug mouse or disable trackpad
2. Open browser
3. Navigate to page to test

**Test Steps:**

#### General Navigation
1. Press **Tab** repeatedly
   - Verify each interactive element receives focus
   - Verify focus indicator is clearly visible
   - Verify tab order is logical (top to bottom, left to right)
   - No elements skipped
   - No keyboard traps

2. Press **Shift+Tab** to go backwards
   - Verify reverse navigation works

3. Press **Enter** on links/buttons
   - Verify they activate correctly

4. Press **Space** on buttons/checkboxes
   - Verify they activate/toggle

5. Press **Escape**
   - Modals should close
   - Menus should close
   - Focus returns to trigger element

#### Forms
1. Tab to form fields
   - Labels read by screen reader
   - Instructions clear
2. Type in fields
   - Input accepts text
3. Use arrow keys in dropdowns
4. Press Enter to submit
5. Error messages appear and are announced

#### Custom Components
1. Menus: Arrow keys navigate, Enter selects
2. Modals: Focus trapped within, Escape closes
3. Tabs: Arrow keys switch tabs
4. Sliders: Arrow keys adjust value

**Pass Criteria:**
- [ ] All interactive elements reachable
- [ ] Focus indicators visible (2px outline minimum)
- [ ] Logical tab order
- [ ] No keyboard traps
- [ ] All actions performable without mouse

---

### Procedure 6: Screen Reader Testing

#### VoiceOver (macOS/iOS)

**Activation:**
- macOS: Cmd+F5
- iOS: Settings > Accessibility > VoiceOver

**Basic Commands (macOS):**
- Navigate: VO + Right/Left Arrow
- Interact: VO + Shift + Down Arrow
- Stop Interacting: VO + Shift + Up Arrow
- Click: VO + Space
- Read next: VO + A

**Test Steps:**
1. Activate VoiceOver
2. Navigate to page
3. Press VO + A to start reading
4. Verify all content is announced
5. Tab through interactive elements
6. Verify labels and roles are correct
7. Test form filling
8. Test button activation
9. Test error messages announced
10. Test live regions (assessment progress)

**Pass Criteria:**
- All content readable
- All interactive elements announced with role and label
- Form labels associated correctly
- Error messages announced in live regions
- No "unlabeled" or "unknown" elements

#### NVDA (Windows)

**Installation:**
- Download from https://www.nvaccess.org/

**Basic Commands:**
- Navigate: Up/Down Arrow
- Next Heading: H
- Next Link: K
- Next Button: B
- Forms mode: Automatic on form fields
- Stop reading: Ctrl

**Test Steps:** (Same as VoiceOver above)

#### TalkBack (Android)

**Activation:**
- Settings > Accessibility > TalkBack

**Basic Gestures:**
- Swipe right: Next item
- Swipe left: Previous item
- Double tap: Activate
- Two-finger swipe: Scroll

**Test Steps:** (Same as VoiceOver above)

---

### Procedure 7: Mobile Touch Target Testing

**Setup:**
- Use real mobile device or browser responsive mode
- Test on iOS and Android

**Test Steps:**
1. Identify all interactive elements:
   - Buttons
   - Links
   - Form inputs
   - Checkboxes/radios
   - Menu items
   - Icons

2. Measure touch targets:
   - Use browser DevTools
   - Should be ≥44×44 CSS pixels
   - Includes padding

3. Test tapping:
   - Can you tap accurately?
   - Do you accidentally tap nearby elements?
   - Is feedback immediate?

4. Test with different finger sizes
5. Test in portrait and landscape

**Pass Criteria:**
- All touch targets ≥44×44px
- Adequate spacing between targets
- No accidental activations
- Immediate visual feedback

---

## 📊 Results Recording

### Automated Testing Results

| Page | Lighthouse | axe Issues | WAVE Errors | Status |
|------|-----------|------------|-------------|--------|
| assessment-entry.html | ___ | ___ | ___ | Pass/Fail |
| assessment-questions.html | ___ | ___ | ___ | Pass/Fail |
| assessment-processing.html | ___ | ___ | ___ | Pass/Fail |
| assessment-results.html | ___ | ___ | ___ | Pass/Fail |

### Manual Testing Results

| Test Type | Status | Notes |
|-----------|--------|-------|
| Keyboard Navigation | Pass/Fail | |
| VoiceOver (macOS) | Pass/Fail | |
| NVDA (Windows) | Pass/Fail | |
| TalkBack (Android) | Pass/Fail | |
| Color Contrast | Pass/Fail | |
| Touch Targets (Mobile) | Pass/Fail | |

---

## 🐛 Common Issues & Fixes

### Issue: Images missing alt text
**Fix:**
```html
<!-- Bad -->
<img src="logo.png">

<!-- Good -->
<img src="logo.png" alt="PMERIT Logo">

<!-- Decorative image -->
<img src="decoration.png" alt="" role="presentation">
```

### Issue: Low color contrast
**Fix:**
- Use contrast checker: https://webaim.org/resources/contrastchecker/
- Adjust colors to meet 4.5:1 ratio
- Consider using darker/lighter shades

### Issue: Buttons without labels
**Fix:**
```html
<!-- Bad -->
<button><i class="fa fa-menu"></i></button>

<!-- Good -->
<button aria-label="Open menu"><i class="fa fa-menu"></i></button>
```

### Issue: Form inputs without labels
**Fix:**
```html
<!-- Bad -->
<input type="email" placeholder="Email">

<!-- Good -->
<label for="email">Email</label>
<input id="email" type="email" placeholder="example@email.com">
```

### Issue: Keyboard trap in modal
**Fix:**
```javascript
// Trap focus within modal
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
});
```

### Issue: Focus not visible
**Fix:**
```css
/* Add visible focus indicator */
button:focus,
a:focus,
input:focus {
  outline: 2px solid #6B5CE7;
  outline-offset: 2px;
}

/* Or custom focus style */
.btn:focus {
  box-shadow: 0 0 0 3px rgba(107, 92, 231, 0.4);
}
```

### Issue: Small touch targets on mobile
**Fix:**
```css
/* Ensure minimum 44x44px touch targets */
.btn,
.link,
.icon-button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}
```

---

## ✅ Quality Gate Checklist

- [ ] Lighthouse Accessibility score ≥90 on all pages
- [ ] axe DevTools shows zero critical/serious issues
- [ ] WAVE shows zero errors
- [ ] All images have appropriate alt text
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Full keyboard navigation works
- [ ] No keyboard traps
- [ ] VoiceOver testing passed
- [ ] NVDA testing passed
- [ ] Touch targets ≥44×44px on mobile
- [ ] Form labels associated correctly
- [ ] Error messages accessible
- [ ] Skip links provided
- [ ] Focus indicators visible
- [ ] WCAG 2.1 AA compliant

---

## 📚 Resources

### Guidelines & Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Testing Guides
- [Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Testing](https://webaim.org/articles/keyboard/)
- [Mobile Accessibility](https://webaim.org/articles/mobile/)

---

**Document Version:** 1.0  
**Last Updated:** November 9, 2025  
**Next Review:** After all fixes implemented
