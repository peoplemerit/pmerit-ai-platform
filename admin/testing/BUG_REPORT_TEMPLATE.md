# Bug Report Template
**PMERIT Platform - Issue #14: Comprehensive Cross-Device Testing**

---

## 🐛 Bug Report Format

Use this template when creating GitHub issues for bugs discovered during testing.

---

## Title Format

```
[Component] Brief description of the issue
```

**Examples:**
- `[Assessment] Questions don't save on Firefox`
- `[Results] Radar chart not rendering on Safari`
- `[Mobile] Touch targets too small on iPhone`
- `[Accessibility] Missing alt text on avatar images`

---

## Issue Body Template

Copy and paste this template into GitHub issues:

```markdown
## Bug Description

**Brief Summary:**
[One sentence describing the issue]

**Severity:** 🔴 P0 / 🟠 P1 / 🟡 P2 / 🟢 P3

**Component:** [Assessment Entry / Questions / Processing / Results / Virtual Human / Navigation / Other]

---

## Environment

**Browser:**
- Name: [Chrome / Firefox / Safari / Edge / Mobile Chrome / Mobile Safari]
- Version: [e.g., 120.0.6099.234]

**Operating System:**
- [ ] Windows 11
- [ ] macOS 14.2
- [ ] iOS 17.2
- [ ] Android 13
- [ ] Linux

**Device:**
- [ ] Desktop (specify resolution: ____x____)
- [ ] iPhone [model]
- [ ] iPad [model]
- [ ] Android Phone [model]
- [ ] Android Tablet [model]

**Screen Size:** ____x____ pixels

**Additional Context:**
- Network: [Fast 3G / 4G / WiFi / Slow 3G]
- Incognito Mode: [Yes / No]
- Extensions Disabled: [Yes / No]

---

## Steps to Reproduce

1. Navigate to [page URL]
2. [Action]
3. [Action]
4. Observe [result]

**Reproducibility:**
- [ ] Always (100%)
- [ ] Frequently (>50%)
- [ ] Sometimes (<50%)
- [ ] Once (unable to reproduce)

---

## Expected Behavior

[Describe what should happen]

---

## Actual Behavior

[Describe what actually happens]

---

## Screenshots / Video

[Attach screenshots or video recording]

**Screenshot Guidelines:**
- Show the entire browser window
- Include browser URL bar and console (if relevant)
- Highlight the issue with arrows or boxes
- Include timestamps for animations/interactions

---

## Console Errors

```
[Paste any JavaScript console errors, warnings, or network errors]
```

**To capture console errors:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Copy all errors/warnings
4. Include full stack trace

---

## Network Activity

**Relevant network requests:**
- Request URL: [URL]
- Status Code: [200 / 404 / 500 / etc.]
- Response Time: [ms]
- Error Message: [if applicable]

---

## Additional Context

**Does it happen on other browsers?**
- [ ] Yes, also on: [browser names]
- [ ] No, only on [browser name]
- [ ] Not tested yet

**Workaround Available?**
- [ ] Yes: [Describe workaround]
- [ ] No

**Related Issues:**
- [Link to related GitHub issues]

**User Impact:**
- [ ] Blocks all users
- [ ] Blocks [browser] users
- [ ] Blocks [device type] users
- [ ] Affects [percentage]% of users
- [ ] Minor inconvenience

---

## Suggested Fix

[Optional: If you know how to fix the issue, describe it here]

---

## Labels

Add these labels to the GitHub issue:
- `bug`
- `priority-[p0/p1/p2/p3]`
- `browser-[chrome/firefox/safari/edge]`
- `platform-[desktop/mobile/tablet]`
- `issue-14` (links to testing issue)

---

## Assignee

- [ ] Assign to: [developer name]
- [ ] Add to milestone: [milestone name]
- [ ] Link to Issue #14

```

---

## 🎯 Severity Levels

### 🔴 P0 (Critical) - Fix Immediately

**Criteria:**
- Site completely unusable
- Data loss occurs
- Security vulnerability
- Complete feature failure on major browser
- Payment/authentication broken

**Examples:**
- Assessment cannot be submitted
- User data deleted
- XSS vulnerability
- Site crashes on load
- Cannot sign in

**Timeline:** Fix within 24 hours, blocks launch

---

### 🟠 P1 (High) - Fix Before Launch

**Criteria:**
- Major feature broken
- Significant UX issue
- Works on some browsers but not others
- Accessibility blocker (WCAG AA violation)
- Performance severely degraded

**Examples:**
- Radar chart doesn't render on Safari
- Keyboard navigation broken
- Assessment auto-save fails
- Screen reader can't access content
- Page load time >10 seconds

**Timeline:** Fix before production launch

---

### 🟡 P2 (Medium) - Should Fix

**Criteria:**
- Minor feature issue
- Cosmetic issue affecting UX
- Works but with workaround
- Performance issue (not severe)
- Edge case bug

**Examples:**
- Button styling inconsistent
- Animation stutters occasionally
- Incorrect tooltip text
- Slow animation on low-end devices
- Minor layout shift

**Timeline:** Fix if time permits, or defer to post-launch

---

### 🟢 P3 (Low) - Nice to Have

**Criteria:**
- Minor cosmetic issue
- Enhancement request
- Rare edge case
- Documentation error
- Does not affect functionality

**Examples:**
- Icon alignment off by 1px
- Console warning (non-breaking)
- Rare browser version bug
- Typo in comment
- Missing semicolon

**Timeline:** Defer to post-launch or future sprint

---

## 📝 Example Bug Reports

### Example 1: Critical Bug

```markdown
# [Assessment] Cannot submit assessment on Firefox

## Bug Description

**Brief Summary:**
Clicking "Submit Assessment" button does nothing on Firefox 121

**Severity:** 🔴 P0

**Component:** Assessment Questions

---

## Environment

**Browser:**
- Name: Firefox
- Version: 121.0

**Operating System:**
- [x] Windows 11
- [ ] macOS 14.2
- [ ] iOS 17.2
- [ ] Android 13
- [ ] Linux

**Device:**
- [x] Desktop (1920x1080)

---

## Steps to Reproduce

1. Navigate to https://pmerit.com/assessment-questions.html
2. Answer all 120 questions
3. Click "Submit Assessment" button
4. Observe nothing happens

**Reproducibility:**
- [x] Always (100%)

---

## Expected Behavior

Clicking "Submit Assessment" should navigate to assessment-processing.html

---

## Actual Behavior

Button click has no effect. Page remains on assessment-questions.html

---

## Console Errors

```
TypeError: Cannot read property 'addEventListener' of null
  at assessment-questions.js:245
  at assessment-questions.js:12
```

---

## Additional Context

**Does it happen on other browsers?**
- [x] No, only on Firefox

**Workaround Available?**
- [ ] No

**User Impact:**
- [x] Blocks Firefox users (approximately 20% of users)

---

## Suggested Fix

Looks like the submit button selector is wrong. Should be:
```javascript
// Current (wrong)
const submitBtn = document.querySelector('.btn-submit');

// Fixed
const submitBtn = document.getElementById('submit-assessment');
```
```

---

### Example 2: High Priority Bug

```markdown
# [Accessibility] Images missing alt text

## Bug Description

**Brief Summary:**
Multiple images throughout the site are missing alt attributes

**Severity:** 🟠 P1

**Component:** Multiple pages

---

## Environment

**Browser:**
- Name: All browsers
- Version: N/A

---

## Steps to Reproduce

1. Run Lighthouse accessibility audit
2. Review "Images do not have alt attributes" section
3. Observe 15 images flagged

**Reproducibility:**
- [x] Always (100%)

---

## Expected Behavior

All images should have descriptive alt attributes for screen readers

---

## Actual Behavior

15 images missing alt attributes:
- assessment-entry.html: 3 images
- assessment-results.html: 8 images
- classroom.html: 4 images

---

## Screenshots / Video

[Lighthouse audit screenshot showing errors]

---

## Additional Context

**User Impact:**
- [x] Affects screen reader users
- WCAG 2.1 AA violation

**Suggested Fix:**
Add descriptive alt text to all images
```

---

## 📋 Quick Reference

### Bug Triage Questions

When evaluating a bug, ask:

1. **Can users complete their task?**
   - No → P0/P1
   - Yes, but difficult → P2
   - Yes, easily → P3

2. **How many users affected?**
   - All users → P0/P1
   - Single browser/device → P1/P2
   - Rare case → P2/P3

3. **Is there a workaround?**
   - No → Increase priority
   - Yes → Decrease priority

4. **Does it affect accessibility?**
   - Yes → Minimum P1
   - No → Evaluate normally

5. **Does it affect core functionality?**
   - Yes → P0/P1
   - No → P2/P3

---

## 🔗 Useful Links

- **GitHub Issues:** https://github.com/peoplemerit/pmerit-ai-platform/issues
- **Test Report:** /TEST_REPORT.md
- **Testing Checklist:** /admin/testing/
- **Browser Compatibility:** /admin/testing/BROWSER_COMPATIBILITY.md
- **Accessibility Guide:** /admin/testing/ACCESSIBILITY_TESTING.md

---

## ✅ Checklist Before Submitting

- [ ] Title is clear and descriptive
- [ ] Severity level assigned
- [ ] Reproduction steps provided
- [ ] Screenshots/video attached
- [ ] Console errors included
- [ ] Browser/device info complete
- [ ] Impact assessed
- [ ] Labels added
- [ ] Linked to Issue #14

---

**Template Version:** 1.0  
**Last Updated:** November 9, 2025
