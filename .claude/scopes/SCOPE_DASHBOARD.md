# PMERIT SUB-SCOPE: Student Dashboard

**Version:** 2.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-22
**Status:** COMPLETE (Phase 1) / ENHANCEMENT PHASE PENDING
**Phase:** P3-P4 (Sign-Up, Onboarding, Dashboard)

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Student Dashboard & Account Management |
| **Phase** | Phase 3-4 (P3.1-P3.8, P4.1-P4.8) |
| **Pages** | `account.html`, `dashboard.html`, `courses.html`, `profile.html` |
| **JavaScript** | `account.js`, `dashboard.js`, `dashboard-courses.js`, `courses.js`, `auth.js`, `auth-modal.js` |
| **CSS** | `learner-portal-layout.css`, `courses.css` |
| **API Endpoints** | `/api/v1/auth/*`, `/api/v1/users/*`, `/api/v1/enrollments/*`, `/api/v1/classroom/*` |
| **Database Tables** | `users`, `user_profiles`, `enrollments`, `classroom_sessions` |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| DB-001 | Dashboard Architecture | Two-tier (account → dashboard) | Security gate before full portal | 34 |
| DB-002 | Auth Method | JWT + PBKDF2 | Secure, stateless | 31 |
| DB-003 | Email Verification | 6-digit code (15-min expiry) | Balance security + UX | 34 |
| DB-004 | Email Provider | Resend (DKIM/SPF) | Deliverability, simple API | 34 |
| DB-005 | Protected Routes | auth-check.js | Consistent protection | 34 |
| DB-006 | Layout Structure | Icon sidebar + nav panel + main + right sidebar | Scalable, section-based navigation | 35 |

---

## 3. FEATURE SPECIFICATION

<HANDOFF_DOCUMENT>

### P3 Requirements (Sign-Up & Onboarding)

| # | Requirement | Status |
|---|-------------|--------|
| P3.1 | Auth modal triggers | Complete |
| P3.2 | Registration form | Complete |
| P3.3 | Mock sign-up (localStorage) | Complete |
| P3.4 | Tab switching (signup/signin) | Complete |
| P3.5 | Real backend auth API | Complete |
| P3.6 | Email verification | Complete |
| P3.7 | Dedicated dashboard | Complete |
| P3.8 | Protected route redirect | Complete |

### P4 Requirements (Dashboard & Courses)

| # | Requirement | Status |
|---|-------------|--------|
| P4.1 | Enrolled courses display | Complete |
| P4.2 | Enrollment API | Complete |
| P4.3 | My Courses section | Complete |
| P4.4 | Pathway recommendations | Complete |
| P4.5 | Learning path progress | Complete |
| P4.6 | Course catalog access | Complete |
| P4.7 | Assessment-to-courses link | Complete |
| P4.8 | Quick Actions | Complete |

### User Flow

```
Login/Signup → /account.html → "Enter Dashboard" → /dashboard.html
                   │
                   └── Shows verification warning if email not verified
```

### Auth API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Authenticate |
| POST | `/api/v1/auth/logout` | End session |
| POST | `/api/v1/auth/verify-email` | Verify with code |
| POST | `/api/v1/auth/resend-verification` | Resend code |
| POST | `/api/v1/auth/forgot-password` | Request reset |
| POST | `/api/v1/auth/reset-password` | Reset with code |
| GET | `/api/v1/auth/me` | Get current user |

</HANDOFF_DOCUMENT>

---

## 4. IMPLEMENTATION STATUS

<RESEARCH_FINDINGS>

### Session 34 (2025-12-06)
- Two-tier dashboard architecture complete
- Renamed dashboard.html → account.html
- Renamed learner-portal.html → dashboard.html
- Email verification via Resend
- 16 files updated with navigation

### Session 31 (2025-12-06)
- 8 auth endpoints created
- PBKDF2 password hashing
- JWT tokens (60-min expiry)
- Rate limiting (5 failed = 15-min lockout)

### Current Dashboard Structure (Session 70 Audit)
- **Icon Sidebar:** 8 sections (Dashboard, Courses, Progress, Career, Certificates, Community, Library, Support)
- **Nav Panel:** Context-specific menus per section
- **Main Content:** Welcome, Overview cards, My Courses grid, Quick Actions
- **Right Sidebar:** Placeholder widgets (Quick Actions, To-Do List)

</RESEARCH_FINDINGS>

---

## 5. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_HOMEPAGE | Users arrive from homepage |
| **Requires** | SCOPE_ASSESSMENT | Assessment informs recommendations |
| **Requires** | SCOPE_pricing | Subscription status display |
| **Enables** | SCOPE_ENROLLMENT | Dashboard shows enrolled courses |
| **Enables** | SCOPE_CLASSROOM | Enter Classroom from dashboard |
| **Enables** | SCOPE_CREDENTIALS | Display earned credentials |

---

## 6. IDENTIFIED GAPS & ENHANCEMENTS

### Priority 1: Track-Aware Dashboard (ARCH Alignment)

**Gap:** Dashboard is one-size-fits-all. Per PMERIT_ARCHITECTURE_FINAL.md, the platform has 3 track types requiring different dashboard experiences.

| Track Type | Target Users | Dashboard Variant Needed |
|------------|--------------|--------------------------|
| **Global Remote** | Adults seeking remote careers | Career-focused (courses, certifications, job matching) |
| **Local Education** | K-12 students (ages 3-18) | Subject-focused (daily schedule, grades, parent link) |
| **Local Career** | CTE/Trade seekers | Certification-focused (trade skills, apprenticeships) |

**Enhancement DB-E01: Adaptive Dashboard Shell**

| ID | Task | Priority | Complexity | Backend Required |
|----|------|----------|------------|------------------|
| DB-E01a | Add `track_type` to user profile | High | Low | Yes |
| DB-E01b | Create dashboard variant loader | High | Medium | No |
| DB-E01c | Global Remote variant (current, enhanced) | High | Low | No |
| DB-E01d | Local Education variant (K-12) | Medium | High | Yes (grades, subjects) |
| DB-E01e | Local Career variant (CTE) | Medium | High | Yes (certifications) |

---

### Priority 2: Personalized Welcome Widget

**Gap:** Current welcome is static "Welcome, [Name]!" with no context.

**Enhancement DB-E02: Smart Welcome Widget**

```
┌─────────────────────────────────────────────────────────┐
│ Good afternoon, Amaka!                                  │
│                                                         │
│ You're 68% through Data Analytics Pathway               │
│ ████████████████░░░░░░░░                                │
│                                                         │
│ Today's Goal: Complete "SQL Joins" lesson               │
│ Estimated time: 25 minutes                              │
│                                                         │
│ [Continue Learning]  [Change Goal]                      │
└─────────────────────────────────────────────────────────┘
```

| ID | Task | Priority | Complexity | Backend Required |
|----|------|----------|------------|------------------|
| DB-E02a | Time-based greeting (Good morning/afternoon/evening) | Low | Low | No |
| DB-E02b | Pathway progress summary | High | Low | No (uses existing data) |
| DB-E02c | Daily goal setting/tracking | Medium | Medium | Yes (new table) |
| DB-E02d | Estimated completion time | Low | Medium | Yes (lesson metadata) |

---

### Priority 3: Activity Feed & To-Do List

**Gap:** Right sidebar shows placeholder "widgets will be added here."

**Enhancement DB-E03: Right Sidebar Activation**

```
┌─────────────────────────────────────┐
│ RECENT ACTIVITY                     │
├─────────────────────────────────────┤
│ ✓ SQL Basics - Completed (92%)      │
│   Yesterday at 3:45 PM              │
│                                     │
│ Started "Python for Data"           │
│   Dec 21 at 2:00 PM                 │
│                                     │
│ Earned: Data Curious Badge          │
│   Dec 20                            │
└─────────────────────────────────────┘
│ TO-DO                               │
├─────────────────────────────────────┤
│ □ Finish SQL Joins lesson           │
│ □ Complete Week 3 quiz              │
│ □ Submit project proposal           │
└─────────────────────────────────────┘
```

| ID | Task | Priority | Complexity | Backend Required |
|----|------|----------|------------|------------------|
| DB-E03a | Activity feed from classroom_sessions | High | Low | No (existing data) |
| DB-E03b | User to-do list CRUD | Medium | Medium | Yes (new table) |
| DB-E03c | Badge/achievement display | Medium | Medium | Yes (gamification) |
| DB-E03d | Activity timestamp formatting | Low | Low | No |

---

### Priority 4: AI Assistant Quick Access

**Gap:** No direct AI tutor access from dashboard (must go to classroom first).

**Enhancement DB-E04: AI Widget**

```
┌──────────────────────────────────────┐
│ PMERIT AI                            │
│                                      │
│ "Ask me anything about your courses, │
│  career path, or get study help!"    │
│                                      │
│ [Open Chat]   [Get Suggestions]      │
│                                      │
│ Recent: "How do I use GROUP BY?"     │
└──────────────────────────────────────┘
```

| ID | Task | Priority | Complexity | Backend Required |
|----|------|----------|------------|------------------|
| DB-E04a | Floating AI chat widget | High | Medium | No |
| DB-E04b | Recent questions history (localStorage) | Low | Low | No |
| DB-E04c | Context-aware suggestions based on current course | Medium | Medium | No |
| DB-E04d | Voice input support (TTS integration) | Low | Medium | No |

---

### Priority 5: Enhanced Progress Analytics

**Gap:** Progress bars are basic. No mastery visualization or learning analytics.

**Enhancement DB-E05: Progress Dashboard**

```
┌─────────────────────────────────────────────────────────┐
│ YOUR LEARNING ANALYTICS                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  This Week: 8.5 hours    │    Streak: 12 days          │
│  ▓▓▓▓▓▓░░░░ (85% of goal)│                             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  MASTERY BY SKILL                                       │
│                                                         │
│  SQL           ████████████████████░░░░  85%            │
│  Python        ████████████░░░░░░░░░░░░  55%            │
│  Excel         ████████████████████████  100%           │
│  Visualization ████████░░░░░░░░░░░░░░░░  35%            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| ID | Task | Priority | Complexity | Backend Required |
|----|------|----------|------------|------------------|
| DB-E05a | Weekly time tracking aggregation | Medium | Medium | Yes (session data) |
| DB-E05b | Learning streak calculation | Medium | Medium | Yes (daily login tracking) |
| DB-E05c | Skill mastery visualization | High | Medium | No (existing quiz data) |
| DB-E05d | Weekly goal setting | Low | Medium | Yes (new table) |
| DB-E05e | Chart.js or similar integration | Medium | Low | No |

---

### Priority 6: Gamification Elements

**Gap:** No visible progression system, badges, or leaderboards.

**Enhancement DB-E06: Gamification**

```
┌─────────────────────────────────────────────────────────┐
│ LEVEL: Data Explorer (Level 5)                          │
│ XP: 2,450 / 3,000 to Level 6                            │
│ ████████████████░░░░                                    │
│                                                         │
│ RECENT BADGES                                           │
│ [7-Day Streak] [SQL Master] [First Quiz 100%]          │
│                                                         │
│ LEADERBOARD                                             │
│ You're #47 in Data Analytics this week                  │
│ [View Full Leaderboard]                                 │
└─────────────────────────────────────────────────────────┘
```

| ID | Task | Priority | Complexity | Backend Required |
|----|------|----------|------------|------------------|
| DB-E06a | XP/Level system design | Medium | Medium | Yes (new tables) |
| DB-E06b | Badge definitions and criteria | Medium | Medium | Yes (new tables) |
| DB-E06c | Badge award logic | Medium | High | Yes (triggers/API) |
| DB-E06d | Leaderboard by pathway | Low | Medium | Yes (aggregation API) |
| DB-E06e | Badge display UI | Medium | Low | No |

**Database Tables Needed:**
```sql
-- gamification_levels (id, name, min_xp, max_xp, icon)
-- user_xp (user_id, total_xp, current_level_id, updated_at)
-- badge_definitions (id, name, description, criteria_type, criteria_value, icon)
-- user_badges (user_id, badge_id, earned_at, context)
```

---

### Priority 7: Subscription Status Widget

**Gap:** No indication of user's subscription tier or premium upsell.

**Enhancement DB-E07: Subscription Widget**

```
┌─────────────────────────────────────────────────────────┐
│ YOUR PLAN: Free                                         │
│                                                         │
│ You have 2 assessment retries remaining                 │
│ Next retry fee: ₦200 / $0.50                            │
│                                                         │
│ Upgrade to Premium ($2.99/mo)                           │
│    • Unlimited retries                                  │
│    • Advanced AI tutor                                  │
│    • Verified certificates                              │
│    • Priority support                                   │
│                                                         │
│ [Upgrade Now]                                           │
└─────────────────────────────────────────────────────────┘
```

| ID | Task | Priority | Complexity | Backend Required |
|----|------|----------|------------|------------------|
| DB-E07a | Subscription status display | High | Low | Yes (SCOPE_pricing backend) |
| DB-E07b | Retry count tracking | Medium | Medium | Yes (assessment retries table) |
| DB-E07c | Premium upsell modal | Medium | Low | No |
| DB-E07d | Upgrade flow integration | High | High | Yes (payment processing) |

**Blocked By:** SCOPE_pricing backend implementation

---

### Priority 8: Calendar & Schedule

**Gap:** No visibility into upcoming deadlines or scheduled activities.

**Enhancement DB-E08: Calendar Widget**

```
┌─────────────────────────────────────────────────────────┐
│ THIS WEEK                                               │
├─────────────────────────────────────────────────────────┤
│ MON │ TUE │ WED │ THU │ FRI │ SAT │ SUN                │
│  ✓  │  ✓  │ NOW │     │     │     │                    │
│ 45m │ 30m │     │     │     │     │                    │
├─────────────────────────────────────────────────────────┤
│ UPCOMING                                                │
│                                                         │
│ Dec 24: SQL Assessment Due                              │
│ Dec 28: Python Project Deadline                         │
│ Jan 2:  Live Session: Data Visualization Workshop       │
└─────────────────────────────────────────────────────────┘
```

| ID | Task | Priority | Complexity | Backend Required |
|----|------|----------|------------|------------------|
| DB-E08a | Weekly activity heatmap | Low | Medium | No (existing session data) |
| DB-E08b | Assignment due dates | Medium | Medium | Yes (assignments table) |
| DB-E08c | Live session scheduling | Low | High | Yes (calendar integration) |
| DB-E08d | Date picker library integration | Low | Low | No |

---

### Priority 9: K-12 Dashboard Variant

**Gap:** K-12 students need age-appropriate, simpler dashboard per User Journey doc.

**Enhancement DB-E09: K-12 Dashboard**

```
┌─────────────────────────────────────────────────────────┐
│ Hi Chidi! Ready to learn?                               │
│                                                         │
│ TODAY'S SCHEDULE                                        │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                │
│ │  Math │ │English│ │Science│ │Social │                │
│ │ 45min │ │ 45min │ │ 30min │ │ 30min │                │
│ └───────┘ └───────┘ └───────┘ └───────┘                │
│                                                         │
│ STARS EARNED TODAY: 12                                  │
│ BADGES: 5                                               │
│                                                         │
│ [Start Next Lesson]                                     │
└─────────────────────────────────────────────────────────┘
```

| ID | Task | Priority | Complexity | Backend Required |
|----|------|----------|------------|------------------|
| DB-E09a | Subject-based layout (vs courses) | Medium | High | Yes (curriculum tables) |
| DB-E09b | Daily schedule generator | Medium | High | Yes (timetable logic) |
| DB-E09c | Star/reward system (age-appropriate) | Medium | Medium | Yes (gamification variant) |
| DB-E09d | Parent link/notification | Medium | Medium | Yes (guardian relationship) |
| DB-E09e | Simplified navigation | Medium | Medium | No |

**Blocked By:** K-12 curriculum tables (ARCH-1 complete), parent portal tables

---

### Priority 10: CTE Dashboard Variant

**Gap:** CTE/Trade learners need certification-focused dashboard per User Journey doc.

**Enhancement DB-E10: CTE Dashboard**

```
┌─────────────────────────────────────────────────────────┐
│ ELECTRICIAN PATHWAY - 45% Complete                      │
│ ████████████░░░░░░░░░░░░░                               │
├─────────────────────────────────────────────────────────┤
│ CERTIFICATIONS                                          │
│                                                         │
│ [✓] OSHA 10-Hour Safety       Earned: Dec 15, 2025     │
│ [~] National Electrical Code  In Progress (60%)        │
│ [ ] Residential Wiring         Locked                   │
│ [ ] Commercial Wiring          Locked                   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ APPRENTICESHIP MATCHES                                  │
│                                                         │
│ IBEW Local 474 - Portland, ME                           │
│ 95% match                                               │
│ [Apply Now] [Learn More]                                │
└─────────────────────────────────────────────────────────┘
```

| ID | Task | Priority | Complexity | Backend Required |
|----|------|----------|------------|------------------|
| DB-E10a | Certification progress tracking | Medium | Medium | Yes (certifications table) |
| DB-E10b | Trade skills checklist | Medium | Medium | Yes (skills matrix) |
| DB-E10c | Apprenticeship matching algorithm | Low | High | Yes (employer integration) |
| DB-E10d | Certification badge display | Medium | Low | No |

**Blocked By:** CTE curriculum tables, employer partnership integration

---

## 7. IMPLEMENTATION ROADMAP

### Phase 2A: Quick Wins (Frontend Only)

| ID | Enhancement | Est. Effort | Files to Modify |
|----|-------------|-------------|-----------------|
| DB-E02a | Time-based greeting | 30 min | `dashboard.html` |
| DB-E03a | Activity feed from sessions | 2 hrs | `dashboard.js`, `dashboard.html` |
| DB-E03d | Activity timestamp formatting | 30 min | `dashboard.js` |
| DB-E04a | AI chat widget | 3 hrs | New `ai-widget.js`, `dashboard.html` |
| DB-E05e | Chart.js integration | 2 hrs | `dashboard.html`, `dashboard.js` |

**Total Phase 2A:** ~8 hours

### Phase 2B: Medium Effort (Some Backend)

| ID | Enhancement | Est. Effort | Backend Work |
|----|-------------|-------------|--------------|
| DB-E02b | Pathway progress summary | 2 hrs | API aggregation |
| DB-E03b | User to-do list | 4 hrs | New table + CRUD API |
| DB-E05a | Weekly time tracking | 3 hrs | Session aggregation API |
| DB-E05c | Skill mastery visualization | 4 hrs | Quiz score aggregation |

**Total Phase 2B:** ~13 hours

### Phase 2C: Major Features (Significant Backend)

| ID | Enhancement | Est. Effort | Backend Work |
|----|-------------|-------------|--------------|
| DB-E01 | Track-aware dashboard | 8 hrs | User track_type, variant loader |
| DB-E06 | Gamification system | 16 hrs | XP, badges, leaderboard tables |
| DB-E07 | Subscription widget | 8 hrs | Blocked by SCOPE_pricing |
| DB-E09 | K-12 variant | 20 hrs | Curriculum, parent portal |
| DB-E10 | CTE variant | 16 hrs | Certifications, employers |

**Total Phase 2C:** ~68 hours

---

## 8. VERIFICATION CHECKLIST

### Phase 1 (Complete)

| # | Test | Status |
|---|------|--------|
| 1 | Dashboard loads for authenticated users | PASS |
| 2 | Auth redirect works for unauthenticated | PASS |
| 3 | Enrolled courses display | PASS |
| 4 | Quick actions functional | PASS |
| 5 | Icon sidebar navigation works | PASS |
| 6 | Mobile responsive | PASS |
| 7 | Dark mode support | PASS |
| 8 | Logout functionality | PASS |

### Phase 2 (Pending)

| # | Test | Status |
|---|------|--------|
| 1 | Track-aware variant loading | NOT STARTED |
| 2 | Activity feed displays recent sessions | NOT STARTED |
| 3 | AI widget opens chat | NOT STARTED |
| 4 | Progress analytics charts render | NOT STARTED |
| 5 | Gamification badges display | NOT STARTED |
| 6 | Subscription status shows correctly | BLOCKED |
| 7 | K-12 variant for minor users | NOT STARTED |
| 8 | CTE variant for trade users | NOT STARTED |

---

## 9. KNOWN ISSUES

| Issue | Priority | Notes |
|-------|----------|-------|
| Right sidebar is placeholder | Medium | Addressed by DB-E03 |
| No AI access from dashboard | Medium | Addressed by DB-E04 |
| No subscription visibility | Low | Blocked by SCOPE_pricing |
| Single dashboard for all tracks | Medium | Addressed by DB-E01 |

---

## 10. BEST PRACTICES (Industry Research)

### 10.1 LMS Dashboard UX Best Practices

Based on industry research from leading LMS platforms and UX experts:

#### Core Principles

| Principle | Description | PMERIT Status |
|-----------|-------------|---------------|
| **Clean & Intuitive** | Simple dashboard with easy navigation; 94% of users abandon apps that aren't intuitive | PARTIAL - Good structure, needs polish |
| **Single Screen Focus** | Keep 5-9 key takeaways visible without scrolling; avoid information overload | NEEDS WORK - Current dashboard scrolls extensively |
| **F/Z Reading Pattern** | Structure content following natural eye movement (top-left to bottom-right) | PARTIAL - Icon sidebar follows this |
| **Role-Based Views** | Separate templates for admin, instructor, learner with relevant metrics | NOT IMPLEMENTED - Single view for all |
| **Mobile-First** | Responsive design for all devices (computer, tablet, phone) | IMPLEMENTED |
| **Dark Mode** | Support system/user preference for light/dark themes | IMPLEMENTED |

*Sources: [RiseApps LMS UI/UX Design](https://riseapps.co/lms-ui-ux-design/), [TechHBS LMS Best Practices 2025](https://techhbs.com/designing-lms-ui-ux-best-practices/), [Multipurpose Themes LMS Dashboards](https://multipurposethemes.com/blog/the-future-of-lms-dashboards-design-and-functionality/)*

#### Visual Design Guidelines

| Guideline | Recommendation | Implementation Notes |
|-----------|----------------|---------------------|
| **Color Usage** | One primary color for highlights; green for positive, red for warnings | Use PMERIT brand blue (#2A5B8C) as primary |
| **Visual Limit** | Max 5-9 visualizations per dashboard (brain processes ~7 images/second) | Current dashboard has 6 overview cards + sections |
| **Key Metrics Big** | Essential stats large and prominent; supporting details smaller | Welcome section should show pathway % prominently |
| **Consistent Branding** | Maintain colors, fonts, images throughout | IMPLEMENTED via CSS variables |
| **White Space** | Adequate spacing prevents cognitive overload | NEEDS IMPROVEMENT in dense sections |

*Sources: [JustInMind Dashboard Design](https://www.justinmind.com/ui-design/dashboard-design-best-practices-ux/), [Educate-Me LMS Dashboard Guide](https://www.educate-me.co/blog/lms-dashboard)*

---

### 10.2 Engagement-Focused Features (Research-Backed)

#### What Students Actually Want

| Feature | Student Demand | Research Finding |
|---------|----------------|------------------|
| **Time Estimates** | HIGH | Students want to know time needed for each lesson/assignment |
| **Deadline Import** | HIGH | Ability to import due dates to personal calendars |
| **Checklists** | HIGH | Visual to-do lists for organizing learning |
| **Recommendations** | MEDIUM | Content suggestions AND behavior change suggestions |
| **Progress Visualization** | HIGH | Clear visual of journey and accomplishments |

*Source: [SoLAR - Designing Dashboards for Action](https://www.solaresearch.org/2020/10/designing-dashboards-to-help-students-take-action/)*

#### Self-Regulated Learning Support

| Component | Description | Dashboard Feature |
|-----------|-------------|-------------------|
| **Goal Setting** | Allow learners to set personal learning goals | DB-E02c: Daily goal widget |
| **Self-Monitoring** | Real-time feedback on progress | DB-E05: Progress analytics |
| **Decision Support** | Help learners make choices | DB-E04: AI recommendations |
| **Action Prompts** | Move beyond passive display to actionable items | DB-E03: To-do list |

*Source: [Journal of Learning Analytics - LAD Design](https://learning-analytics.info/index.php/JLA/article/view/8529)*

---

### 10.3 Gamification Best Practices

#### Proven Gamification Elements

| Element | Purpose | Best Practice | PMERIT Enhancement |
|---------|---------|---------------|-------------------|
| **Progress Bars** | Visual advancement | Show at pathway and course level | DB-E02b, DB-E05c |
| **Badges** | Achievement recognition | Must represent TRUE mastery, not just participation | DB-E06b |
| **Streaks** | Daily engagement | Show consecutive days of activity | DB-E05b |
| **XP/Levels** | Long-term progression | Visible level system with clear milestones | DB-E06a |
| **Leaderboards** | Social motivation | CAUTION: Can demotivate if ranks too high to achieve | DB-E06d (optional) |
| **Instant Feedback** | Real-time learning | Immediate corrections and encouragement | Classroom feature |

*Sources: [NetBramha Gamification in EdTech](https://netbramha.com/blogs/gamification-in-edtech-ux-design/), [Mockplus Gamification Guide](https://www.mockplus.com/blog/post/gamification-ui-ux-design-guide), [UX Planet Gamification](https://uxplanet.org/gamification-in-product-design-ui-ux-14047dc6ccab)*

#### Industry Examples to Emulate

| Platform | Key Feature | How to Apply |
|----------|-------------|--------------|
| **Duolingo** | Streak system + bite-sized lessons | Daily streak counter, 15-20 min lesson chunks |
| **Khan Academy** | Galactic achievement system + avatars | Badge galaxy visualization, avatar selection |
| **LinkedIn** | Profile completion progress bar | Pathway completion % prominently displayed |
| **Udemy** | Course progress tracking | Per-course progress bars with % |

*Sources: [ProdWrks Gamification Lessons](https://prodwrks.com/gamification-in-edtech-lessons-from-duolingo-khan-academy-ixl-and-kahoot/), [Built In Gamify UX](https://builtin.com/articles/gamify-ux-design-process)*

#### Gamification Cautions

| Risk | Mitigation |
|------|------------|
| **Badge Inflation** | Badges must represent real achievement, not just activity |
| **Leaderboard Demotivation** | Use cohort-based or opt-in leaderboards |
| **Extrinsic Over Intrinsic** | Balance rewards with genuine learning value |
| **Complexity Creep** | Start simple; add gamification incrementally |

---

### 10.4 Accessibility Requirements (WCAG 2.2 AA)

#### Keyboard Navigation (WCAG 2.1.1)

| Requirement | Implementation | PMERIT Status |
|-------------|----------------|---------------|
| **Tab Navigation** | All interactive elements reachable via Tab key | PARTIAL - Needs audit |
| **Focus Indicators** | Visible focus state on all focusable elements | PARTIAL - Some elements lack visible focus |
| **No Keyboard Traps** | Users can always Tab away from any element | NEEDS TESTING |
| **Arrow Key Support** | For menus, tabs, and complex widgets | PARTIAL - Icon sidebar needs improvement |
| **Skip Links** | "Skip to main content" for screen readers | NOT IMPLEMENTED |

*Sources: [UXPin WCAG 2.1.1 Keyboard](https://www.uxpin.com/studio/blog/wcag-211-keyboard-accessibility-explained/), [UK DfE WCAG Explorer](https://accessibility.education.gov.uk/guidelines/wcag/explorer)*

#### Screen Reader Support

| Requirement | Implementation | PMERIT Status |
|-------------|----------------|---------------|
| **Semantic HTML** | Use `<header>`, `<main>`, `<nav>`, `<section>`, `<article>` | IMPLEMENTED |
| **ARIA Labels** | `aria-label`, `aria-labelledby` for interactive elements | PARTIAL |
| **Reading Order** | Screen readers follow logical DOM order | NEEDS AUDIT |
| **Alt Text** | All images have descriptive alt text | PARTIAL |
| **Live Regions** | `aria-live` for dynamic content updates | IMPLEMENTED (announcer div) |

*Sources: [UserWay Screen Reader Guide](https://userway.org/blog/screen-reader/), [Level Access Screen Reader](https://www.levelaccess.com/blog/screen-reader-accessibility/)*

#### Visual Accessibility

| Requirement | Standard | PMERIT Status |
|-------------|----------|---------------|
| **Color Contrast** | 4.5:1 for normal text, 3:1 for large text | NEEDS AUDIT |
| **Focus Appearance** | Bold, high-contrast focus indicators (WCAG 2.2) | NEEDS IMPROVEMENT |
| **Text Resizing** | Support 200% zoom without loss of functionality | IMPLEMENTED |
| **No Color-Only Info** | Don't rely solely on color to convey meaning | PARTIAL - Status uses colors + text |

*Sources: [Tableau Dashboard Accessibility](https://help.tableau.com/current/pro/desktop/en-us/accessibility_dashboards.htm), [WCAG 2.2 Guide](https://www.accessibility.works/blog/wcag-2-2-guide/)*

#### Dashboard-Specific Accessibility

| Best Practice | Reason | Implementation |
|---------------|--------|----------------|
| **Limit Data Density** | Dense charts difficult for screen readers | Max 1000 data points per visualization |
| **Text Alternatives** | Provide text summary of charts/graphs | Add `aria-describedby` with summary |
| **Logical Tab Order** | Add objects in reading order (top-left first) | Review DOM order matches visual |
| **Keyboard Shortcuts** | Power users benefit from shortcuts | Document and implement consistently |

---

### 10.5 Mobile-Specific Best Practices

| Practice | Description | PMERIT Status |
|----------|-------------|---------------|
| **Touch Targets** | Min 44x44px for tappable elements | NEEDS AUDIT |
| **Thumb Zone** | Key actions within easy thumb reach | Quick Actions at bottom |
| **Swipe Gestures** | Support common mobile gestures | IMPLEMENTED (classroom) |
| **Offline Support** | Cache critical data for offline access | PARTIAL |
| **Progressive Disclosure** | Hide complexity, reveal on demand | Collapsible sections needed |
| **Bottom Navigation** | Primary nav at bottom for one-hand use | NOT IMPLEMENTED |

---

### 10.6 Performance Best Practices

| Practice | Target | Reason |
|----------|--------|--------|
| **First Contentful Paint** | < 1.8s | Users expect fast load |
| **Time to Interactive** | < 3.8s | Dashboard should be usable quickly |
| **Lazy Loading** | Images, charts, iframe content | Reduce initial payload |
| **Skeleton Screens** | Show loading state immediately | Better perceived performance |
| **Data Caching** | Cache API responses | Reduce redundant requests |
| **Code Splitting** | Load JS modules on demand | Smaller initial bundle |

---

### 10.7 Implementation Priority Matrix

Based on best practices research, recommended implementation order:

| Priority | Enhancement | Best Practice Alignment | Impact |
|----------|-------------|------------------------|--------|
| **P1** | Skip Links + Focus Indicators | WCAG Accessibility | Legal/Compliance |
| **P1** | Single-screen welcome widget | LMS UX: Key info at top | High Engagement |
| **P2** | Progress bar prominence | Gamification: Visual progress | Retention |
| **P2** | Activity feed activation | Student want: Checklists | Engagement |
| **P2** | AI quick access widget | Decision support | Learning Outcomes |
| **P3** | Streak counter | Duolingo model | Daily Engagement |
| **P3** | Badge system | Achievement recognition | Motivation |
| **P4** | Leaderboards (opt-in) | Social motivation (careful) | Community |
| **P4** | Calendar integration | Student want: Deadlines | Organization |

---

## 11. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 31 | 2025-12-06 | Auth API implementation |
| 34 | 2025-12-06 | Two-tier dashboard architecture |
| 50 | 2025-12-12 | Scope document created |
| 70 | 2025-12-22 | Comprehensive gap analysis, enhancement roadmap, and industry best practices added |

---

*Last Updated: 2025-12-22 by Claude Code (Session 70)*
