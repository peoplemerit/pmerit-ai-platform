# Test Scenarios - PMERIT Platform
**Issue #14: Comprehensive Cross-Device Testing & Quality Assurance**

---

## 📋 Overview

This document defines the 4 primary test scenarios for the PMERIT platform. Each scenario should be executed on all supported browsers and devices.

---

## 🎯 Test Scenario 1: Assessment Entry & Start

### Objective
Verify users can start a new assessment or resume an existing one

### Priority
🔴 Critical - Core user flow

### Preconditions
- User is on any page of the site
- User has internet connection
- Browser has JavaScript enabled
- LocalStorage is available

### Test Steps

#### Part A: New Assessment
1. Navigate to `https://pmerit.com/`
2. Click "Take Assessment" or "Get Started" button
3. Verify redirect to `/assessment-entry.html`
4. Review "What to Expect" section
5. Scroll through all content sections
6. Read consent information
7. Check all consent checkboxes:
   - Privacy Policy
   - Data Usage
   - Terms & Conditions
8. Click "Start Assessment" button
9. Verify redirect to `/assessment-questions.html`

#### Part B: Resume Assessment
1. Start an assessment (Part A)
2. Answer first 10 questions
3. Close browser tab/window
4. Return to `https://pmerit.com/assessment-entry.html`
5. Verify "Resume Assessment" card appears
6. Click "Resume Assessment" button
7. Verify redirect to `/assessment-questions.html`
8. Verify progress shows 10 questions answered
9. Verify can continue from question 11

#### Part C: Start Fresh
1. Have an existing saved assessment
2. Navigate to `/assessment-entry.html`
3. Verify "Resume Assessment" card appears
4. Click "Start Fresh" button
5. Verify confirmation dialog appears
6. Confirm starting fresh
7. Verify old data is cleared
8. Verify new assessment starts from question 1

### Expected Results

#### Visual/Layout
- [ ] Page loads within 3 seconds
- [ ] All images load correctly
- [ ] Hero section displays with icon and title
- [ ] "What to Expect" timeline visible
- [ ] Consent checkboxes styled correctly
- [ ] Buttons have correct colors and hover states
- [ ] Layout responsive on all screen sizes
- [ ] No layout shifts (CLS < 0.1)

#### Functionality
- [ ] All links work correctly
- [ ] Checkboxes can be checked/unchecked
- [ ] "Start Assessment" disabled until all consents checked
- [ ] "Start Assessment" navigates to questions page
- [ ] Resume card shows when saved data exists
- [ ] "Resume Assessment" continues from saved position
- [ ] "Start Fresh" clears old data and restarts

#### Accessibility
- [ ] All images have alt text
- [ ] Form labels properly associated
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus indicators visible
- [ ] Screen reader announces all content
- [ ] Color contrast meets WCAG AA (4.5:1)

#### Performance
- [ ] Page load time < 3 seconds
- [ ] No console errors
- [ ] No network errors
- [ ] LocalStorage operations fast (<50ms)

### Test Data

**Valid Consent:**
- Privacy: ✓
- Data Usage: ✓
- Terms: ✓

**Invalid Consent (should block):**
- Any checkbox unchecked

### Browser/Device Matrix

| Browser/Device | Part A | Part B | Part C | Issues |
|----------------|--------|--------|--------|--------|
| Chrome Desktop | [ ] | [ ] | [ ] | |
| Firefox Desktop | [ ] | [ ] | [ ] | |
| Safari Desktop | [ ] | [ ] | [ ] | |
| Edge Desktop | [ ] | [ ] | [ ] | |
| Mobile Chrome | [ ] | [ ] | [ ] | |
| Mobile Safari | [ ] | [ ] | [ ] | |

### Pass Criteria
- All parts (A, B, C) pass on all browsers
- No P0 or P1 bugs
- All accessibility checks pass
- Performance targets met

---

## 🎯 Test Scenario 2: Assessment Questions (120 Questions)

### Objective
Complete all 120 assessment questions with auto-save and progress tracking

### Priority
🔴 Critical - Core functionality

### Preconditions
- Assessment started (Scenario 1 completed)
- User on `/assessment-questions.html`
- Browser has LocalStorage available

### Test Steps

#### Part A: Question Navigation (Questions 1-20)
1. Start assessment (from Scenario 1)
2. Verify question 1 displays
3. Select an answer (radio button)
4. Click "Next" button
5. Verify navigation to question 2
6. Repeat for questions 2-10
7. Verify progress bar updates (shows 10/120)
8. Click "Previous" button
9. Verify navigation to question 9
10. Verify previous answer is still selected
11. Change answer
12. Click "Next" twice to return to question 11
13. Continue to question 20

#### Part B: Auto-Save Functionality
1. Answer questions 1-15
2. Wait 5 seconds (auto-save triggers)
3. Close browser completely
4. Reopen browser
5. Navigate to `/assessment-entry.html`
6. Click "Resume Assessment"
7. Verify on question 16 (saved progress)
8. Verify all previous answers (1-15) are saved
9. Continue answering questions

#### Part C: Complete Assessment (Questions 21-120)
1. Continue from question 21
2. Answer questions systematically
3. Monitor progress bar
4. Test "Previous" button periodically
5. Verify answers persist when navigating back
6. Answer all 120 questions
7. Click "Submit Assessment" button
8. Verify redirect to `/assessment-processing.html`

#### Part D: Validation & Error Handling
1. Try clicking "Next" without selecting answer
2. Verify error message appears
3. Verify cannot advance without answer
4. Select an answer
5. Verify error clears
6. Verify can now advance

#### Part E: Edge Cases
1. Rapidly click "Next" and "Previous"
2. Verify UI stays responsive
3. Answer question 1, go to 120, go back to 1
4. Verify all navigation works
5. Clear LocalStorage via DevTools
6. Verify app handles gracefully (prompts to start over)

### Expected Results

#### Visual/Layout
- [ ] Questions display clearly
- [ ] Radio buttons styled correctly
- [ ] Progress bar accurate (X/120)
- [ ] Question counter shows (Question 1 of 120)
- [ ] Previous/Next buttons visible
- [ ] Layout responsive on mobile
- [ ] No text overflow or wrapping issues

#### Functionality
- [ ] Can select answer for each question
- [ ] Only one answer selectable per question
- [ ] "Next" navigates forward
- [ ] "Previous" navigates backward
- [ ] Progress bar updates correctly
- [ ] Auto-save works (every 5 questions)
- [ ] Resume capability works
- [ ] All 120 questions reachable
- [ ] Submit button appears on question 120
- [ ] Submit navigates to processing page

#### Accessibility
- [ ] Radio buttons keyboard accessible
- [ ] Labels properly associated
- [ ] Tab order logical
- [ ] Screen reader announces question and options
- [ ] Progress announced to screen readers
- [ ] Error messages accessible

#### Performance
- [ ] Question transitions smooth (<100ms)
- [ ] No lag when selecting answers
- [ ] Auto-save doesn't block UI
- [ ] No memory leaks after 120 questions
- [ ] LocalStorage operations fast

### Test Data

**Question Structure:**
- 120 questions total
- Each has 5 options (1-5 scale)
- Questions grouped by Big Five traits
- All questions required

### Browser/Device Matrix

| Browser/Device | Part A | Part B | Part C | Part D | Part E | Issues |
|----------------|--------|--------|--------|--------|--------|--------|
| Chrome Desktop | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Firefox Desktop | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Safari Desktop | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Edge Desktop | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Mobile Chrome | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Mobile Safari | [ ] | [ ] | [ ] | [ ] | [ ] | |

### Pass Criteria
- Complete all 120 questions successfully
- Auto-save works reliably
- Resume functionality works
- No data loss
- All navigation works correctly
- No P0 or P1 bugs

---

## 🎯 Test Scenario 3: Assessment Processing & Results

### Objective
View assessment results with Big Five scores, Holland Code, and career matches

### Priority
🔴 Critical - Final user outcome

### Preconditions
- Assessment completed (Scenario 2 completed)
- User on `/assessment-processing.html`

### Test Steps

#### Part A: Processing Animation
1. Complete assessment (Scenario 2)
2. Click "Submit Assessment"
3. Verify redirect to `/assessment-processing.html`
4. Observe processing animation
5. Verify loading spinner displays
6. Verify progress message updates
7. Wait for processing to complete (5-10 seconds)
8. Verify automatic redirect to `/assessment-results.html`

#### Part B: Results Display
1. Verify redirect to results page
2. Review Big Five Personality Traits section:
   - Openness score and description
   - Conscientiousness score and description
   - Extraversion score and description
   - Agreeableness score and description
   - Neuroticism score and description
3. Verify radar chart displays (Chart.js)
4. Verify chart shows all 5 traits
5. Verify chart is interactive (hover shows values)
6. Review Holland Code section:
   - 3-letter code (e.g., "IAE")
   - Code interpretation
   - Career preferences description
7. Review Career Matches section:
   - List of 10 career recommendations
   - Each shows: title, salary, outlook, fit score
   - Sorted by fit score (highest first)

#### Part C: Interactive Features
1. Click on career match to expand details
2. Verify detailed description appears
3. Verify required skills listed
4. Click "Learn More" button
5. Verify external link opens (BLS data)
6. Test "PDF Export" button
7. Verify PDF generates correctly
8. Verify PDF contains all results
9. Test "Share Results" button
10. Verify share options appear (email, social)

#### Part D: Additional Actions
1. Click "Retake Assessment" button
2. Verify confirmation dialog
3. Confirm retake
4. Verify redirect to `/assessment-entry.html`
5. Verify previous data cleared
6. Test "Save Results" button
7. Verify user prompted to sign in (if anonymous)
8. Verify results saved to account (if signed in)

### Expected Results

#### Visual/Layout - Processing Page
- [ ] Loading animation smooth
- [ ] Progress messages clear
- [ ] Spinner visible
- [ ] No layout shifts
- [ ] Auto-redirect works

#### Visual/Layout - Results Page
- [ ] All sections display correctly
- [ ] Radar chart renders properly
- [ ] Scores formatted correctly (e.g., 85/100)
- [ ] Career cards styled nicely
- [ ] Images load (if any)
- [ ] Layout responsive on all sizes
- [ ] Print-friendly layout

#### Functionality
- [ ] Processing completes successfully
- [ ] All data accurate (matches answers)
- [ ] Radar chart interactive
- [ ] Career details expand/collapse
- [ ] PDF export works
- [ ] PDF contains all data
- [ ] Share functionality works
- [ ] Retake clears data and restarts
- [ ] Save to account works (if signed in)

#### Accessibility
- [ ] All content screen reader accessible
- [ ] Chart has text alternative
- [ ] Buttons keyboard accessible
- [ ] Focus indicators visible
- [ ] Color contrast meets standards
- [ ] Semantic HTML used

#### Performance
- [ ] Processing time < 10 seconds
- [ ] Results page loads < 2 seconds
- [ ] Chart renders < 1 second
- [ ] PDF generation < 3 seconds
- [ ] No console errors

### Test Data

**Expected Data:**
- Big Five scores (0-100 for each)
- Holland Code (3 letters from RIASEC)
- 10 career matches
- Each career has title, salary, outlook, fit score

### Browser/Device Matrix

| Browser/Device | Part A | Part B | Part C | Part D | Issues |
|----------------|--------|--------|--------|--------|--------|
| Chrome Desktop | [ ] | [ ] | [ ] | [ ] | |
| Firefox Desktop | [ ] | [ ] | [ ] | [ ] | |
| Safari Desktop | [ ] | [ ] | [ ] | [ ] | |
| Edge Desktop | [ ] | [ ] | [ ] | [ ] | |
| Mobile Chrome | [ ] | [ ] | [ ] | [ ] | |
| Mobile Safari | [ ] | [ ] | [ ] | [ ] | |

### Pass Criteria
- Processing completes successfully
- All results display correctly
- Chart.js renders on all browsers
- PDF export works
- All interactive features work
- No P0 or P1 bugs

---

## 🎯 Test Scenario 4: Virtual Human & Interactive Features

### Objective
Test Virtual Human avatar, WebGL rendering, TTS, and lip-sync

### Priority
🟠 High - Important feature, not core flow

### Preconditions
- Browser supports WebGL
- Browser allows audio playback
- User on page with Virtual Human (e.g., `/classroom.html`)

### Test Steps

#### Part A: Virtual Human Toggle
1. Navigate to `/classroom.html`
2. Locate Virtual Human toggle switch
3. Verify toggle is initially OFF
4. Click toggle to turn ON
5. Verify avatar container appears
6. Verify WebGL canvas renders
7. Verify 3D avatar loads
8. Click toggle to turn OFF
9. Verify avatar container disappears
10. Click toggle ON again
11. Verify avatar reappears

#### Part B: Avatar Rendering (WebGL)
1. Turn on Virtual Human
2. Wait for avatar to load (3-5 seconds)
3. Verify 3D model renders correctly
4. Verify avatar is visible and clear
5. Verify lighting looks good
6. Verify no rendering artifacts
7. Verify avatar is centered in viewport
8. Resize browser window
9. Verify avatar resizes proportionally
10. Test on different screen sizes

#### Part C: Text-to-Speech (TTS)
1. Ensure Virtual Human is ON
2. Type message in chat: "Hello"
3. Send message
4. Verify avatar "speaks" message
5. Verify audio plays clearly
6. Verify volume is appropriate
7. Type longer message (multiple sentences)
8. Verify full message plays
9. Test interruption (send new message while speaking)
10. Verify current speech stops and new starts

#### Part D: Lip-Sync Animation
1. Turn on Virtual Human
2. Send message: "Hello world"
3. Watch avatar mouth movements
4. Verify lips move during speech
5. Verify mouth movements match audio timing
6. Verify mouth closes when silent
7. Test with different messages:
   - Short: "Hi"
   - Long: "This is a longer message with multiple words"
   - Question: "How are you today?"
8. Verify lip-sync accurate for all

#### Part E: Performance Testing
1. Turn on Virtual Human
2. Open browser DevTools
3. Go to Performance tab
4. Start recording
5. Interact with avatar (send 5 messages)
6. Stop recording
7. Analyze results:
   - FPS (frames per second)
   - CPU usage
   - Memory usage
   - No long tasks (>50ms)

#### Part F: Edge Cases
1. Try toggling ON/OFF rapidly (10 times)
2. Verify no crashes or errors
3. Send 20 messages in quick succession
4. Verify all queue properly
5. Minimize browser window
6. Restore window
7. Verify avatar still works
8. Switch browser tabs
9. Return to tab
10. Verify avatar still functioning

### Expected Results

#### Visual/Rendering
- [ ] Avatar loads within 5 seconds
- [ ] 3D model clear and sharp
- [ ] Lighting appropriate
- [ ] No rendering artifacts
- [ ] Responsive to window resizing
- [ ] Maintains aspect ratio
- [ ] WebGL canvas sizing correct

#### Functionality
- [ ] Toggle works smoothly
- [ ] Avatar appears/disappears correctly
- [ ] TTS plays audio
- [ ] Audio clear and understandable
- [ ] Volume appropriate
- [ ] Lip-sync matches speech
- [ ] Can interrupt speech
- [ ] Multiple messages queue correctly
- [ ] Works after tab switching

#### Performance
- [ ] Desktop FPS ≥30 (target: 60)
- [ ] Mobile FPS ≥24
- [ ] CPU usage reasonable (<50%)
- [ ] Memory usage stable (<100MB increase)
- [ ] No memory leaks over time
- [ ] No janky animations
- [ ] Smooth transitions

#### Accessibility
- [ ] Toggle keyboard accessible
- [ ] Toggle has aria-label
- [ ] Screen reader announces toggle state
- [ ] Alternative text-only mode available
- [ ] Captions available for TTS

#### Compatibility
- [ ] Works on Chrome (WebGL 2.0)
- [ ] Works on Firefox (WebGL 2.0)
- [ ] Works on Safari (WebGL 2.0)
- [ ] Works on Edge (WebGL 2.0)
- [ ] Degrades gracefully if WebGL unsupported
- [ ] Fallback message shown if incompatible

### Performance Targets

| Device Type | FPS Target | CPU Target | Memory Target |
|-------------|------------|------------|---------------|
| Desktop (High-end) | ≥60 | <30% | <150MB |
| Desktop (Mid-range) | ≥30 | <50% | <200MB |
| Mobile (High-end) | ≥30 | <50% | <150MB |
| Mobile (Mid-range) | ≥24 | <60% | <200MB |

### Browser/Device Matrix

| Browser/Device | Part A | Part B | Part C | Part D | Part E | Part F | FPS | Issues |
|----------------|--------|--------|--------|--------|--------|--------|-----|--------|
| Chrome Desktop | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | ___ | |
| Firefox Desktop | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | ___ | |
| Safari Desktop | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | ___ | |
| Edge Desktop | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | ___ | |
| Mobile Chrome | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | ___ | |
| Mobile Safari | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | ___ | |

### Pass Criteria
- Avatar renders on all browsers
- Performance targets met
- TTS works clearly
- Lip-sync is synchronized
- No crashes or errors
- Acceptable on mobile devices
- Graceful degradation if unsupported

---

## 📊 Overall Test Summary

### Completion Tracking

| Scenario | Chrome | Firefox | Safari | Edge | M. Chrome | M. Safari | Status |
|----------|--------|---------|--------|------|-----------|-----------|--------|
| 1. Entry | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | ❌ |
| 2. Questions | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | ❌ |
| 3. Results | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | ❌ |
| 4. Virtual Human | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | ❌ |

### Bug Summary

| Scenario | P0 | P1 | P2 | P3 | Total |
|----------|----|----|----|----|-------|
| 1. Entry | 0 | 0 | 0 | 0 | 0 |
| 2. Questions | 0 | 0 | 0 | 0 | 0 |
| 3. Results | 0 | 0 | 0 | 0 | 0 |
| 4. Virtual Human | 0 | 0 | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** | **0** | **0** |

### Overall Status
- [ ] All scenarios pass on all browsers
- [ ] Zero P0 bugs
- [ ] Zero P1 bugs
- [ ] All accessibility checks pass
- [ ] All performance targets met
- [ ] Ready for production launch

---

**Document Version:** 1.0  
**Created:** November 9, 2025  
**Test Period:** [To be filled]  
**Tester:** [To be filled]
