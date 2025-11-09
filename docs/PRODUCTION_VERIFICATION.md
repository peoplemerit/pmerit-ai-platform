# PMERIT Production Verification Guide

**Version:** 1.0  
**Last Updated:** November 2024  
**Purpose:** Post-deployment verification and quality assurance

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Verification](#quick-verification)
3. [Detailed Test Scenarios](#detailed-test-scenarios)
4. [Performance Testing](#performance-testing)
5. [Security Verification](#security-verification)
6. [Accessibility Testing](#accessibility-testing)
7. [Cross-Browser Testing](#cross-browser-testing)
8. [API Verification](#api-verification)
9. [Reporting Issues](#reporting-issues)

---

## Overview

This guide provides comprehensive verification procedures to ensure the PMERIT platform is functioning correctly in production after deployment.

### Verification Goals

- ✅ All features work correctly in production
- ✅ Zero console errors
- ✅ Performance meets targets
- ✅ Security measures active
- ✅ Accessibility standards met
- ✅ Cross-browser compatibility confirmed

### Test Environment

- **Production URL:** https://pmerit.com
- **API URL:** https://pmerit-api.peoplemerit.workers.dev
- **Testing Tools:** Chrome DevTools, Lighthouse, Browser DevTools

---

## Quick Verification

### 5-Minute Smoke Test

Run automated smoke tests:

```bash
./scripts/production-smoke-test.sh https://pmerit.com
```

**Expected Result:** All tests pass with green checkmarks

### Manual Quick Check

1. **Load Home Page**
   - Visit: https://pmerit.com
   - Verify: Loads in <3 seconds, no errors in console

2. **Test Assessment Entry**
   - Visit: https://pmerit.com/assessment-entry.html
   - Verify: Page loads, "Begin Assessment" button visible

3. **Check API Health**
   ```bash
   curl https://pmerit-api.peoplemerit.workers.dev/health
   ```
   - Expected: `{"status":"ok","timestamp":"..."}`

4. **Verify SSL**
   - Check: Browser shows padlock icon
   - Click: Padlock → Certificate valid

If all quick checks pass, proceed to detailed verification.

---

## Detailed Test Scenarios

### Test 1: Home Page Verification

**Objective:** Verify home page loads correctly with all features

#### Steps:
1. Navigate to https://pmerit.com
2. Open browser DevTools (F12)
3. Go to Console tab

#### Verification Checklist:
- [ ] Page loads in <3 seconds
- [ ] No JavaScript errors in console
- [ ] No CSS loading errors
- [ ] Header displays correctly
- [ ] Footer displays correctly
- [ ] Navigation menu works
- [ ] Language switcher functions
- [ ] "Start Assessment" button works
- [ ] All images load properly
- [ ] Favicon displays in browser tab
- [ ] Page is responsive (resize browser window)

#### Screenshot Locations:
- Desktop view (1920x1080)
- Mobile view (375x667)
- Console showing no errors

#### Issues Found:
_Document any issues here_

---

### Test 2: Assessment Entry Flow

**Objective:** Verify users can start new assessment

#### Steps:
1. Navigate to https://pmerit.com/assessment-entry.html
2. Read consent information
3. Check "I agree" checkbox
4. Click "Begin Assessment" button
5. Verify navigation to questions page

#### Verification Checklist:
- [ ] Page loads without errors
- [ ] Consent text is readable
- [ ] Checkbox is functional
- [ ] "Begin Assessment" button is clickable
- [ ] Button is disabled until consent accepted
- [ ] Navigation to questions page successful
- [ ] No console errors during flow

#### Issues Found:
_Document any issues here_

---

### Test 3: Assessment Questions (120 Questions)

**Objective:** Complete full assessment with auto-save testing

#### Steps:
1. Start from `/assessment-questions.html`
2. Answer questions 1-20
3. Verify progress bar updates
4. Test auto-save:
   - Close browser tab
   - Reopen `/assessment-questions.html`
   - Verify resume modal appears
   - Confirm answers are saved
5. Complete all 120 questions
6. Submit assessment
7. Verify navigation to processing page

#### Verification Checklist:
- [ ] Questions load correctly
- [ ] Radio buttons are functional
- [ ] Progress bar updates accurately
- [ ] Navigation between questions works
- [ ] Auto-save functionality works
- [ ] Resume modal appears when returning
- [ ] All 120 questions can be completed
- [ ] Submit button activates when all answered
- [ ] Processing page loads after submission
- [ ] No console errors throughout

#### Auto-Save Test:
- [ ] Answers saved after closing browser
- [ ] Can resume from last question
- [ ] Progress percentage correct

#### Issues Found:
_Document any issues here_

---

### Test 4: Assessment Results

**Objective:** Verify results display correctly with all features

#### Steps:
1. Complete assessment or navigate to results page
2. View all results sections
3. Test interactive features
4. Test export and sharing

#### Verification Checklist:
- [ ] Results page loads without errors
- [ ] Chart.js radar chart renders correctly
- [ ] Big Five personality scores display
- [ ] Scores are between 0-100
- [ ] Top 10 careers display with fit scores
- [ ] Career cards show properly
- [ ] Holland Code (RIASEC) displays
- [ ] RIASEC chart renders correctly

#### Interactive Features:
- [ ] "Export PDF" button works
- [ ] PDF downloads successfully
- [ ] PDF contains all results
- [ ] PDF is formatted correctly
- [ ] "Share Results" button works
- [ ] Share modal opens
- [ ] "Copy Link" button copies URL
- [ ] Shared link is valid

#### Issues Found:
_Document any issues here_

---

### Test 5: Virtual Human (If Enabled)

**Objective:** Verify AI assistant functionality

#### Steps:
1. Navigate to any page
2. Toggle Virtual Human on (header menu)
3. Test chat functionality
4. Test avatar features
5. Toggle Virtual Human off

#### Verification Checklist:
- [ ] Virtual Human toggle in header
- [ ] Avatar loads in sidebar/bottom sheet
- [ ] Chat input field is functional
- [ ] Send message: "Hello, what is PMERIT?"
- [ ] AI responds within 5 seconds
- [ ] Response is relevant
- [ ] TTS audio plays (if enabled)
- [ ] Lip sync works (mouth moves with speech)
- [ ] "Change Avatar" button works
- [ ] Can select different avatar
- [ ] New avatar loads correctly
- [ ] Mute button functions
- [ ] Volume slider works
- [ ] Can toggle Virtual Human off
- [ ] No errors in console

#### Issues Found:
_Document any issues here_

---

### Test 6: Navigation & Links

**Objective:** Verify all links and navigation work

#### Steps:
1. Test header navigation
2. Test footer links
3. Test internal page links
4. Test external links

#### Verification Checklist:

**Header Links:**
- [ ] Home link works
- [ ] About link works
- [ ] Assessment link works
- [ ] Support link works
- [ ] Language switcher works

**Footer Links:**
- [ ] Privacy Policy link works
- [ ] Terms of Service link works
- [ ] Contact link works
- [ ] Social media links work (if present)

**Internal Navigation:**
- [ ] All internal links resolve correctly
- [ ] No 404 errors
- [ ] Back button works correctly

**External Links:**
- [ ] Open in new tab
- [ ] Have rel="noopener noreferrer"

#### Issues Found:
_Document any issues here_

---

## Performance Testing

### Lighthouse Audit

#### How to Run:
1. Open Chrome browser
2. Navigate to https://pmerit.com
3. Open DevTools (F12)
4. Click "Lighthouse" tab
5. Select "Desktop" mode
6. Click "Analyze page load"

#### Target Scores:
- **Performance:** ≥85
- **Accessibility:** ≥90
- **Best Practices:** ≥90
- **SEO:** ≥90

#### Record Results:

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Performance | ≥85 | ___ | ___ |
| Accessibility | ≥90 | ___ | ___ |
| Best Practices | ≥90 | ___ | ___ |
| SEO | ≥90 | ___ | ___ |

#### Core Web Vitals:

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| LCP (Largest Contentful Paint) | <2.5s | ___ | ___ |
| FID (First Input Delay) | <100ms | ___ | ___ |
| CLS (Cumulative Layout Shift) | <0.1 | ___ | ___ |

### Page Load Testing

Test on slow network:

1. Open Chrome DevTools
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Reload page
5. Verify page is usable

#### Checklist:
- [ ] Page loads within 10 seconds on Slow 3G
- [ ] Content is readable while loading
- [ ] No layout shifts during load
- [ ] Images load progressively

---

## Security Verification

### SSL/TLS Certificate

```bash
# Check SSL certificate
echo | openssl s_client -servername pmerit.com -connect pmerit.com:443 2>/dev/null | openssl x509 -noout -text
```

#### Checklist:
- [ ] Certificate is valid (not expired)
- [ ] Certificate issued by trusted CA
- [ ] Certificate covers pmerit.com
- [ ] Certificate covers www.pmerit.com (if used)
- [ ] Browser shows padlock icon
- [ ] No SSL warnings

### HTTPS Enforcement

#### Manual Test:
1. Visit http://pmerit.com (without 's')
2. Verify automatic redirect to https://pmerit.com

#### Checklist:
- [ ] HTTP redirects to HTTPS
- [ ] All assets load via HTTPS
- [ ] No mixed content warnings
- [ ] All API calls use HTTPS

### Security Headers

```bash
# Check security headers
curl -I https://pmerit.com
```

#### Expected Headers:
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: SAMEORIGIN`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Content-Security-Policy` present
- [ ] `Referrer-Policy` present

### Console Security Check

1. Open DevTools Console
2. Look for security warnings
3. Check Network tab for mixed content

#### Checklist:
- [ ] No mixed content warnings
- [ ] No insecure resource warnings
- [ ] No XSS warnings
- [ ] No CORS errors (unless expected)

---

## Accessibility Testing

### Automated Testing

#### Using axe DevTools:
1. Install axe DevTools extension
2. Navigate to https://pmerit.com
3. Click axe icon
4. Click "Scan ALL of my page"
5. Review results

#### Target: Zero critical issues

### Manual Testing

#### Keyboard Navigation:
- [ ] Can navigate using Tab key
- [ ] Focus indicators visible
- [ ] Can activate buttons with Enter
- [ ] Can close modals with Escape
- [ ] No keyboard traps

#### Screen Reader Testing (Optional):
- [ ] Test with VoiceOver (Mac) or NVDA (Windows)
- [ ] All images have alt text
- [ ] Form labels are associated
- [ ] ARIA labels present where needed
- [ ] Headings in logical order

#### Color Contrast:
- [ ] Text meets 4.5:1 contrast ratio
- [ ] Links are distinguishable
- [ ] Buttons have sufficient contrast

#### Responsive Design:
- [ ] Readable at 200% zoom
- [ ] No horizontal scrolling at 100% zoom
- [ ] Mobile touch targets ≥44×44 pixels

---

## Cross-Browser Testing

### Desktop Browsers

#### Chrome (Windows/Mac/Linux)
- [ ] Home page loads
- [ ] Assessment flow works
- [ ] Results display correctly
- [ ] No console errors

#### Firefox (Windows/Mac/Linux)
- [ ] Home page loads
- [ ] Assessment flow works
- [ ] Results display correctly
- [ ] No console errors

#### Safari (Mac)
- [ ] Home page loads
- [ ] Assessment flow works
- [ ] Results display correctly
- [ ] No console errors

#### Edge (Windows)
- [ ] Home page loads
- [ ] Assessment flow works
- [ ] Results display correctly
- [ ] No console errors

### Mobile Browsers

#### Mobile Safari (iPhone)
- [ ] Page loads correctly
- [ ] Touch interactions work
- [ ] Virtual keyboard doesn't break layout
- [ ] Assessment questions navigable
- [ ] Results display correctly

#### Mobile Chrome (Android)
- [ ] Page loads correctly
- [ ] Touch interactions work
- [ ] Virtual keyboard doesn't break layout
- [ ] Assessment questions navigable
- [ ] Results display correctly

### Device Testing

Test on actual devices if possible:
- [ ] iPhone (iOS)
- [ ] Android phone
- [ ] iPad (tablet)
- [ ] Android tablet

---

## API Verification

### Health Endpoints

```bash
# Test all health endpoints
curl https://pmerit-api.peoplemerit.workers.dev/health
curl https://pmerit-api.peoplemerit.workers.dev/api/v1/db/health
curl https://pmerit-api.peoplemerit.workers.dev/api/v1/db/status
```

#### Expected Results:
- [ ] `/health` returns `{"status":"ok"}`
- [ ] `/api/v1/db/health` returns `{"status":"connected"}`
- [ ] `/api/v1/db/status` returns database info
- [ ] All responses are HTTP 200
- [ ] Response time <500ms

### AI Chat Endpoint

```bash
# Test AI chat
curl -X POST https://pmerit-api.peoplemerit.workers.dev/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

#### Checklist:
- [ ] Returns streaming response
- [ ] Response is relevant
- [ ] Response time <5 seconds
- [ ] No error messages

### Database Connectivity

#### Checklist:
- [ ] Assessment submissions save to database
- [ ] Career recommendations query from database
- [ ] No connection timeout errors
- [ ] Check Neon console for recent activity

---

## Reporting Issues

### Issue Template

When reporting issues, include:

1. **Title:** Clear, descriptive title
2. **Priority:** P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
3. **Description:** What went wrong
4. **Steps to Reproduce:**
   - Step 1
   - Step 2
   - Step 3
5. **Expected Behavior:** What should happen
6. **Actual Behavior:** What actually happened
7. **Environment:**
   - Browser: Chrome 120.0
   - OS: Windows 11
   - Device: Desktop/Mobile
   - URL: https://pmerit.com/page.html
8. **Screenshots:** Attach relevant screenshots
9. **Console Errors:** Copy any console errors
10. **Network Errors:** Check Network tab

### Priority Definitions

- **P0 (Critical):** Site is down, data loss, security vulnerability
- **P1 (High):** Major feature broken, affects many users
- **P2 (Medium):** Feature partially broken, workaround exists
- **P3 (Low):** Cosmetic issue, minor bug

### Where to Report

- **GitHub Issues:** https://github.com/peoplemerit/pmerit-ai-platform/issues
- **Email:** support@pmerit.com
- **Slack:** #pmerit-launch (if available)

---

## Verification Sign-Off

### Completion Checklist

- [ ] All test scenarios completed
- [ ] All issues documented
- [ ] Performance tests pass
- [ ] Security verification complete
- [ ] Accessibility tests pass
- [ ] Cross-browser tests complete
- [ ] API verification complete

### Sign-Off

**Tester Name:** ___________________  
**Date:** ___________________  
**Signature:** ___________________  

**QA Lead:** ___________________  
**Date:** ___________________  
**Signature:** ___________________  

**Project Lead:** ___________________  
**Date:** ___________________  
**Signature:** ___________________  

---

## Success Criteria

✅ **Production verification is complete when:**

1. All test scenarios pass
2. Zero P0/P1 bugs found
3. Performance targets met
4. Security measures verified
5. Accessibility standards met
6. Cross-browser compatibility confirmed
7. API endpoints functioning correctly
8. All stakeholders sign-off

---

**Last Updated:** November 2024  
**Document Version:** 1.0  
**Maintained by:** PMERIT QA Team
