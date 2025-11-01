# PMERIT Mobile QA Checklist
**Phase 8.10 - Cross-Browser QA Matrix & Bugfix Sprint**

Last Updated: November 1, 2025  
Version: 1.0

## Testing Matrix

### Device Categories
1. **Mobile Phones**
   - iOS (iPhone 12+)
   - Android (Pixel, Samsung Galaxy)
2. **Tablets**
   - iPad (10.2" and larger)
   - Android tablets
3. **Desktop Responsive**
   - Chrome DevTools responsive mode
   - Various viewport sizes

### Browser Requirements
- iOS Safari (latest)
- Android Chrome (latest)
- Edge Mobile
- Desktop Chrome (responsive emulator)

### Viewport Sizes to Test
- 360×640 (Small mobile)
- 390×844 (iPhone 13)
- 414×896 (iPhone 11 Pro Max)
- 768×1024 (iPad portrait)
- 1280×800 (Desktop)

---

## Test Cases

### 1. Navigation & Menu (Issues 8.2, 8.3)

#### Hamburger Menu
- [ ] Hamburger button visible and accessible (min 44x44px)
- [ ] Menu opens with smooth animation
- [ ] Overlay visible when menu is open
- [ ] Menu closes when clicking overlay
- [ ] Menu closes when pressing Escape key
- [ ] Focus trapped within menu when open
- [ ] Tab/Shift+Tab navigation works correctly
- [ ] Arrow keys navigate menu items
- [ ] First focusable element receives focus on open
- [ ] Focus returns to hamburger button on close

#### Nested Navigation
- [ ] Nested sections expand/collapse correctly
- [ ] Accordion behavior works smoothly
- [ ] ARIA attributes updated (aria-expanded)
- [ ] Icons rotate/change on expand/collapse
- [ ] Nested items are keyboard accessible

#### Classroom Link
- [ ] Classroom link visible in menu
- [ ] Clicking Classroom navigates to correct route
- [ ] Avatar canvas visible after navigation
- [ ] Chat interface visible after navigation
- [ ] No layout shift (CLS < 0.1)
- [ ] Deep link `/#/classroom` works
- [ ] Back/forward navigation works

**Device/Browser Results:**
```
[ ] iOS Safari iPhone 13 - Pass/Fail - Notes:
[ ] Android Chrome Pixel 6 - Pass/Fail - Notes:
[ ] Edge Mobile - Pass/Fail - Notes:
[ ] Desktop Chrome 390px - Pass/Fail - Notes:
[ ] iPad Safari 768px - Pass/Fail - Notes:
```

---

### 2. Chat Input (Issue 8.4)

#### Input Bar
- [ ] Input bar sticky at bottom
- [ ] Safe-area padding visible on iOS (notch devices)
- [ ] Input bar height 56-64px
- [ ] All buttons ≥44x44px touch targets
- [ ] No occlusion by mobile keyboard
- [ ] Mic and send buttons visible when keyboard open

#### Text Input
- [ ] Textarea auto-expands up to 3 lines
- [ ] Scrolls after 3 lines
- [ ] No zoom on focus (font-size ≥16px)
- [ ] Placeholder text visible
- [ ] Character counter shows on focus
- [ ] Counter hidden when empty
- [ ] Warning color at 90% (900 chars)
- [ ] Error color at 100% (1000 chars)

#### Voice Input
- [ ] Voice button accessible
- [ ] Recording state shows pulse animation
- [ ] Background changes during recording
- [ ] Status announced to screen readers
- [ ] Button label changes (Start/Stop)

#### Send Button
- [ ] Disabled when input is empty
- [ ] Enabled when text present
- [ ] Sends message on click
- [ ] Sends message on Enter key (without Shift)
- [ ] Shift+Enter adds new line
- [ ] Proper hover/active states

**Device/Browser Results:**
```
[ ] iOS Safari iPhone 13 - Pass/Fail - Notes:
[ ] Android Chrome Pixel 6 - Pass/Fail - Notes:
[ ] Edge Mobile - Pass/Fail - Notes:
[ ] Desktop Chrome 390px - Pass/Fail - Notes:
```

---

### 3. Layout & Responsiveness (Issue 8.1)

#### General Layout
- [ ] No horizontal scrolling at any viewport
- [ ] Content adapts smoothly at breakpoints
- [ ] 360px: Minimum layout works
- [ ] 480px: Small mobile layout
- [ ] 768px: Tablet portrait layout
- [ ] 1024px: Tablet landscape/desktop
- [ ] 1280px: Desktop layout

#### Chat & Avatar
- [ ] Chat stream never overlaps avatar
- [ ] Avatar max height 40vh on mobile
- [ ] Avatar max height 50vh on tablet
- [ ] Avatar max height 60vh on desktop
- [ ] All tappables ≥44x44px
- [ ] Text readable without zoom

#### Safe Areas
- [ ] Top safe area applied (status bar)
- [ ] Bottom safe area applied (home indicator)
- [ ] Left/right safe areas applied (landscape)
- [ ] Footer respects safe area bottom

**Device/Browser Results:**
```
[ ] iOS Safari iPhone 13 - Pass/Fail - Notes:
[ ] Android Chrome Pixel 6 - Pass/Fail - Notes:
[ ] iPad Safari 768px - Pass/Fail - Notes:
[ ] Desktop Chrome all sizes - Pass/Fail - Notes:
```

---

### 4. Typography & Spacing (Issue 8.6)

#### Text Sizes
- [ ] Body text 16-18px on mobile
- [ ] Headings don't wrap awkwardly
- [ ] No orphans/widows in hero blocks
- [ ] Line-height appropriate (1.5 for body)
- [ ] Text scales at breakpoints
- [ ] Mobile heading size (28px)
- [ ] Desktop heading size (32px)

#### Spacing
- [ ] Consistent spacing scale used
- [ ] Mobile gutter: 16px
- [ ] Desktop gutter: 24px
- [ ] Section spacing appropriate
- [ ] No cramped UI elements

**Device/Browser Results:**
```
[ ] iOS Safari iPhone 13 - Pass/Fail - Notes:
[ ] Android Chrome Pixel 6 - Pass/Fail - Notes:
[ ] Desktop Chrome 1280px - Pass/Fail - Notes:
```

---

### 5. Accessibility (Issue 8.8)

#### Screen Reader
- [ ] Skip link appears on focus
- [ ] All images have alt text
- [ ] All buttons have aria-label
- [ ] Live regions announce messages
- [ ] TTS status announced
- [ ] Recording status announced
- [ ] Navigation changes announced
- [ ] Loading states announced

#### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Focus indicators visible (2px outline)
- [ ] Tab order logical
- [ ] Focus trap works in menu
- [ ] Escape closes modals/menus
- [ ] Keyboard shortcuts work (/, ?)
- [ ] Arrow keys navigate menus

#### Focus Visible
- [ ] Focus ring visible on all elements
- [ ] High contrast mode supported
- [ ] Reduced motion respected
- [ ] Touch targets ≥44x44px
- [ ] Color contrast ≥4.5:1

**Screen Reader Tests:**
```
[ ] VoiceOver (iOS) - Pass/Fail - Notes:
[ ] TalkBack (Android) - Pass/Fail - Notes:
```

---

### 6. Performance (Issue 8.9)

#### Core Web Vitals
- [ ] CLS ≤ 0.1
- [ ] LCP ≤ 2.5s
- [ ] INP ≤ 200ms
- [ ] No long tasks > 200ms

#### Lighthouse Mobile Scores
- [ ] Performance ≥ 80
- [ ] Accessibility ≥ 90
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 90

#### Resource Loading
- [ ] Images lazy load below fold
- [ ] Avatar/Three.js loads only on needed routes
- [ ] No 404 errors
- [ ] No mixed content warnings
- [ ] No CSP violations

**Performance Results:**
```
[ ] iPhone 13 LCP: ___ms CLS: ___ INP: ___ms
[ ] Pixel 6 LCP: ___ms CLS: ___ INP: ___ms
[ ] Desktop LCP: ___ms CLS: ___ INP: ___ms
```

---

### 7. Telemetry (Issue 8.11)

#### Event Tracking
- [ ] nav_open tracked
- [ ] nav_close tracked
- [ ] nav_item_click tracked
- [ ] classroom_enter tracked
- [ ] chat_input_focus tracked
- [ ] keyboard_open tracked
- [ ] keyboard_close tracked
- [ ] avatar_focus_mode_toggle tracked

#### Data Quality
- [ ] No PII in payloads
- [ ] Route captured correctly
- [ ] Viewport info accurate
- [ ] Device hints present
- [ ] Timestamp present
- [ ] Events visible in admin panel

**Telemetry Check:**
```
[ ] View admin/qa-telemetry.html - Pass/Fail
[ ] All events logging - Pass/Fail
[ ] No PII present - Pass/Fail
```

---

## Known Issues Log

### Priority 0 (Critical - Blocks Release)
_No P0 issues currently_

### Priority 1 (High - Must Fix Before Release)
_List P1 issues here with:_
- Issue number/ID
- Description
- Device/Browser affected
- Steps to reproduce
- Assigned to
- Status

Example:
```
#123 - Menu doesn't close on overlay click (iOS Safari 15.6)
- Affects: iPhone 12 iOS 15.6
- Steps: Open menu, click overlay
- Assigned: Developer Name
- Status: In Progress
```

### Priority 2 (Medium - Should Fix)
_List P2 issues here_

### Priority 3 (Low - Nice to Have)
_List P3 issues here_

---

## Sign-Off

### QA Approval
- [ ] All P0 issues resolved
- [ ] All P1 issues resolved  
- [ ] Test matrix 100% complete
- [ ] Screenshots/videos captured
- [ ] Documentation updated

**QA Tester:** ________________  
**Date:** ________________  
**Signature:** ________________

### Technical Lead Approval
- [ ] Code reviewed
- [ ] Performance validated
- [ ] Security validated
- [ ] A11y validated

**Tech Lead:** ________________  
**Date:** ________________  
**Signature:** ________________

---

## Screenshots & Recordings

Attach screenshots for each device/browser combination showing:
1. Hamburger menu open
2. Classroom view
3. Chat input with keyboard
4. Avatar display
5. Any issues found

Store in: `/admin/qa-screenshots/phase-8/`

---

## Notes & Observations

_Add any additional observations, edge cases found, or recommendations for future improvements:_

```
Example:
- iOS 15.6 has slight animation lag on menu open (acceptable)
- Consider adding pinch-to-zoom for avatar on next phase
- Users may want adjustable text size (future enhancement)
```
