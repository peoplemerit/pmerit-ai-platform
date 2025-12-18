# PMERIT SUB-SCOPE: Notifications System

**Version:** 1.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-18
**Status:** NOT IMPLEMENTED
**Phase:** User Engagement
**Priority:** P2 - Retention & Engagement

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Email & In-App Notifications for Learning Events |
| **Channels** | Email (primary), In-app (secondary), Push (future) |
| **Email Provider** | TBD (SendGrid, Mailgun, or Resend recommended) |
| **Database Tables** | `notification_preferences`, `notification_log` (TBD) |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-18 | **Session:** 62 | **Auditor:** Claude Code

### Executive Summary

The notification system is **NOT IMPLEMENTED**. Currently, no transactional emails are sent (registration confirmation, password reset, progress updates). This impacts user engagement and account security.

### What EXISTS

| Component | Status | Notes |
|-----------|--------|-------|
| User email addresses | EXISTS | Stored in users table |

### What DOES NOT EXIST

| Component | Status | Impact |
|-----------|--------|--------|
| Email service integration | NOT BUILT | Can't send emails |
| Registration confirmation | NOT BUILT | Accounts unverified |
| Password reset email | NOT BUILT | Users locked out |
| Progress notifications | NOT BUILT | No milestone alerts |
| In-app notifications | NOT BUILT | No activity feed |
| Notification preferences | NOT BUILT | No user control |
| Parent notifications | NOT BUILT | Parents uninformed |

---

## 3. ARCHITECTURAL DECISIONS (PENDING)

| ID | Decision | Options | Recommendation |
|----|----------|---------|----------------|
| NOT-001 | Email Provider | SendGrid, Mailgun, Resend | Resend (modern, good DX) |
| NOT-002 | Email Templates | HTML templates, React Email | React Email (composable) |
| NOT-003 | Notification Storage | Database, Redis | Database (audit trail) |
| NOT-004 | Push Notifications | Web Push API | Phase 2 (after PWA) |

---

## 4. HANDOFF_DOCUMENT

### Notification Types

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION CATEGORIES                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  TRANSACTIONAL (Required - Cannot disable)                          │
│  ──────────────────────────────────────────                         │
│  • Email verification                                               │
│  • Password reset                                                   │
│  • Account security alerts                                          │
│  • Payment confirmations                                            │
│                                                                     │
│  LEARNING PROGRESS (User can disable)                               │
│  ────────────────────────────────────                               │
│  • Course enrollment confirmation                                   │
│  • Lesson completion                                                │
│  • Module completion + badge                                        │
│  • Course completion + certificate                                  │
│  • Pathway completion                                               │
│  • Learning streak milestones                                       │
│                                                                     │
│  ENGAGEMENT (User can disable)                                      │
│  ──────────────────────────────                                     │
│  • Inactivity reminder (3 days, 7 days)                            │
│  • Weekly progress summary                                          │
│  • New course recommendations                                       │
│  • Platform announcements                                           │
│                                                                     │
│  PARENT NOTIFICATIONS (For K-12 - Parent controls)                  │
│  ─────────────────────────────────────────────                      │
│  • Child progress updates                                           │
│  • Assessment results                                               │
│  • Credential earned                                                │
│  • Inactivity alerts                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Email Templates Required

| Template | Trigger | Priority |
|----------|---------|----------|
| `welcome.html` | User registration | P0 |
| `verify-email.html` | Email verification request | P0 |
| `password-reset.html` | Password reset request | P0 |
| `course-enrolled.html` | Course enrollment | P1 |
| `lesson-complete.html` | Lesson completion | P2 |
| `module-complete.html` | Module completion + badge | P1 |
| `course-complete.html` | Course completion + certificate | P1 |
| `pathway-complete.html` | Pathway completion | P1 |
| `streak-milestone.html` | 7, 30, 100 day streaks | P2 |
| `inactivity.html` | No login for X days | P2 |
| `weekly-summary.html` | Weekly progress digest | P2 |
| `parent-update.html` | Child progress for parents | P1 |
| `payment-receipt.html` | Subscription/donation | P1 |

### Database Schema (Proposed)

```sql
-- User notification preferences
CREATE TABLE notification_preferences (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    notification_type VARCHAR(50) NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT FALSE,
    frequency VARCHAR(20) DEFAULT 'instant', -- instant, daily, weekly
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, notification_type)
);

-- Notification log (audit trail)
CREATE TABLE notification_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    notification_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL, -- email, in_app, push
    subject VARCHAR(200),
    content_preview TEXT, -- First 200 chars
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed, read
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    external_id VARCHAR(100), -- Email provider message ID
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- In-app notifications
CREATE TABLE in_app_notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- achievement, progress, system, social
    icon VARCHAR(50),
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Endpoints (Proposed)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/notifications` | User | Get in-app notifications |
| PUT | `/api/v1/notifications/:id/read` | User | Mark as read |
| PUT | `/api/v1/notifications/read-all` | User | Mark all as read |
| GET | `/api/v1/notifications/preferences` | User | Get preferences |
| PUT | `/api/v1/notifications/preferences` | User | Update preferences |
| POST | `/api/v1/notifications/unsubscribe` | Token | Email unsubscribe |

### In-App Notification Bell UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔔 (3)                                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  NOTIFICATIONS                               [Mark all as read]     │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🏆 You earned a badge!                             2 min ago │   │
│  │ Completed "HTML Essentials" module                          │   │
│  │ [View Badge]                                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔥 7-day streak!                                   1 hour ago │   │
│  │ You've been learning for 7 days in a row!                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📚 New course available                           Yesterday  │   │
│  │ "Advanced React Patterns" is now available                  │   │
│  │ [View Course]                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [View All Notifications]                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Email Template Example (Welcome)

```html
<!-- templates/welcome.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to PMERIT</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #4f46e5;">Welcome to PMERIT! 🎓</h1>

    <p>Hi {{name}},</p>

    <p>Thank you for joining PMERIT - free AI-powered education for everyone.</p>

    <p>Here's what you can do next:</p>
    <ul>
      <li><strong>Take the Career Assessment</strong> - Find your ideal learning path</li>
      <li><strong>Browse Courses</strong> - Explore our course catalog</li>
      <li><strong>Start Learning</strong> - Begin your first course</li>
    </ul>

    <a href="{{dashboard_url}}"
       style="display: inline-block; background: #4f46e5; color: white;
              padding: 12px 24px; text-decoration: none; border-radius: 6px;">
      Go to Dashboard
    </a>

    <p style="margin-top: 30px;">
      Questions? Reply to this email or visit our help center.
    </p>

    <p>Happy learning!<br>The PMERIT Team</p>

    <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #666;">
      You received this email because you signed up for PMERIT.
      <a href="{{unsubscribe_url}}">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
```

### Notification Service Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION SERVICE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  TRIGGER EVENT                                                      │
│  (lesson.completed, course.enrolled, etc.)                          │
│                                 │                                   │
│                                 ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   NOTIFICATION SERVICE                       │   │
│  │                                                             │   │
│  │  1. Check user preferences                                  │   │
│  │  2. Determine channels (email, in_app, push)                │   │
│  │  3. Generate content from template                          │   │
│  │  4. Queue notifications                                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                 │                                   │
│           ┌─────────────────────┼─────────────────────┐            │
│           │                     │                     │            │
│           ▼                     ▼                     ▼            │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐       │
│  │   EMAIL     │       │   IN-APP    │       │    PUSH     │       │
│  │   (Resend)  │       │  (Database) │       │  (Web Push) │       │
│  └─────────────┘       └─────────────┘       └─────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. RESEARCH_FINDINGS

*No implementation yet - awaiting specification approval*

### Email Provider Comparison

| Provider | Pricing | API Quality | Deliverability |
|----------|---------|-------------|----------------|
| **Resend** | Free tier: 3k/mo | Excellent | High |
| **SendGrid** | Free tier: 100/day | Good | High |
| **Mailgun** | Free tier: 5k/mo | Good | High |
| **Postmark** | $15/mo for 10k | Excellent | Very High |

**Recommendation:** Resend - Modern API, good free tier, excellent DX

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | Email provider account | Resend/SendGrid setup |
| **Requires** | SCOPE_PROGRESS | Progress events trigger notifications |
| **Requires** | SCOPE_CREDENTIALS | Credential events trigger notifications |
| **Enables** | SCOPE_PARENT_PORTAL | Parent notification channel |
| **Enables** | User engagement | Retention through communication |
| **Enables** | Account security | Password reset, verification |

---

## 7. ACCEPTANCE CRITERIA

### Phase 1: Transactional Emails (Critical)
- [ ] Email provider configured
- [ ] Welcome email sent on registration
- [ ] Email verification flow works
- [ ] Password reset email works
- [ ] Payment receipt emails sent

### Phase 2: Progress Notifications
- [ ] Course enrollment confirmation
- [ ] Module completion + badge notification
- [ ] Course completion + certificate notification
- [ ] Notification preferences UI

### Phase 3: In-App Notifications
- [ ] Notification bell in header
- [ ] Notification dropdown/panel
- [ ] Mark as read functionality
- [ ] Real-time updates (WebSocket or polling)

### Phase 4: Engagement
- [ ] Weekly progress summary email
- [ ] Inactivity reminder emails
- [ ] Streak milestone notifications
- [ ] Parent notification channel

---

## 8. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 62 | 2025-12-18 | Scope file created |

---

*Last Updated: 2025-12-18 (Session 62)*
