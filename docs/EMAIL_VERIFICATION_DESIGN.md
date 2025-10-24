# Phase 2 – Email Verification & Account Authentication (Design Memo)

## Overview

This document outlines the architecture and best practices for implementing email verification and account authentication in Phase 2 of the PMERIT platform. It extends Phase 1's mock authentication with production-ready security, user experience, and compliance measures.

## Signup UX (with abuse protection)

### User Interface
- **Single modal/page** offering **Sign up** and **Sign in** tabs
  - Preserves Phase 1's visual design language
  - Seamless tab switching without page reload
  - Mobile-responsive with touch-friendly controls

### Form Fields
- **Email**: Required, validated for format
- **Username**: Required, 3-20 characters, alphanumeric + underscores
- **Region**: Dropdown select (e.g., West Africa, East Africa, North America)
- **Country**: Auto-populated based on region selection
- **Password**: 
  - Minimum 8 characters (stronger than Phase 1's 6)
  - Must include: uppercase, lowercase, number, special character
  - Real-time strength indicator
  - Show/hide toggle for accessibility

### Abuse Protection
- **Cloudflare Turnstile** (CAPTCHA)
  - Use silent/invisible mode when possible
  - Challenge mode for suspicious activity
  - Integrated on form submit, not on page load
  
- **Rate Limiting**
  - **Per IP**: 5 signup attempts per hour
  - **Per email**: 3 attempts per 24 hours
  - **Exponential backoff**: Each failed attempt increases delay
  - **Temporary lockout**: 15-minute cooldown after threshold
  - Store rate limit data in Redis/memory cache with TTL

### Validation Flow
```
1. Client-side validation (immediate feedback)
2. Server-side validation (authoritative)
3. Turnstile verification
4. Rate limit check
5. Email uniqueness check
6. Account creation
7. Trigger verification email
```

## Verification Model

### Primary Method: Magic Link (Double Opt-In)

#### Token Record Schema
```sql
CREATE TABLE verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of token
  purpose VARCHAR(20) NOT NULL, -- 'email_verify', 'password_reset', 'email_change'
  expires_at TIMESTAMP NOT NULL,
  consumed_at TIMESTAMP NULL,
  ip_created INET NOT NULL,
  ua_created TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_token_hash (token_hash),
  INDEX idx_user_purpose (user_id, purpose),
  INDEX idx_expires_at (expires_at)
);
```

#### Token Generation
```javascript
// Generate cryptographically secure token
const token = crypto.randomBytes(32).toString('base64url'); // 43 chars

// Store SHA-256 hash (never store raw token)
const tokenHash = crypto
  .createHash('sha256')
  .update(token)
  .digest('hex');

// Create HMAC signature for link integrity
const signature = crypto
  .createHmac('sha256', process.env.VERIFICATION_SECRET)
  .update(`${tokenId}|${userId}|${expiresAt}`)
  .digest('base64url');
```

#### Email Link Format
```
https://pmerit.com/verify?tid=<token_id>&sig=<hmac_signature>&u=<user_id>
```

**Security Features**:
- **Never embed raw token** in URL (use token ID only)
- **HMAC signature** prevents tampering with parameters
- **Time-bound**: 15-30 minute expiration
- **Single-use**: Mark consumed atomically to prevent race conditions
- **IP tracking**: Log for security auditing

#### Verification Endpoint Logic
```javascript
POST /auth/verify

1. Extract tid, sig, u from query parameters
2. Validate HMAC signature matches expected value
3. Query token record by tid
4. Verify:
   - Token exists and matches user_id
   - Purpose is 'email_verify'
   - Not already consumed (consumed_at IS NULL)
   - Not expired (expires_at > NOW())
5. ATOMIC UPDATE:
   BEGIN TRANSACTION;
   UPDATE verification_tokens 
   SET consumed_at = NOW() 
   WHERE id = tid AND consumed_at IS NULL;
   
   IF affected_rows = 1:
     UPDATE users SET email_verified_at = NOW() WHERE id = u;
     COMMIT;
   ELSE:
     ROLLBACK;
     RETURN "Token already used";
   
6. Log auth_event
7. Return success or error
```

### Fallback Method: OTP Code

For users who cannot click email links (accessibility, email client issues):

#### OTP Schema
```sql
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash VARCHAR(64) NOT NULL, -- SHA-256 of 6-digit code
  purpose VARCHAR(20) NOT NULL,
  expires_at TIMESTAMP NOT NULL, -- 10 minutes
  attempts INT DEFAULT 0,
  consumed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_purpose (user_id, purpose)
);
```

#### OTP Generation
- **6-digit numeric code** (000000-999999)
- **Cryptographically random** (not sequential)
- **10-minute expiration**
- **Maximum 5 verification attempts**
- **Regenerate after 3 failed attempts**
- **Rate limit**: One OTP per 30 seconds per user

#### Email Template
```
Your PMERIT verification code: 123456

This code expires in 10 minutes.

If you didn't request this, please ignore this email.
```

## Deliverability (Must-Do)

### DNS Records Setup

#### SPF (Sender Policy Framework)
```dns
pmerit.com. IN TXT "v=spf1 include:_spf.mail.pmerit.com ~all"
mail.pmerit.com. IN TXT "v=spf1 ip4:<SERVER_IP>/32 -all"
# Note: Replace <SERVER_IP> with your actual email server's IPv4 address
```

#### DKIM (DomainKeys Identified Mail)
```dns
default._domainkey.mail.pmerit.com. IN TXT "v=DKIM1; k=rsa; p=<RSA_2048_PUBLIC_KEY_BASE64>"
# Note: Replace <RSA_2048_PUBLIC_KEY_BASE64> with your RSA 2048-bit public key in base64 format
# Generate with: openssl genrsa -out dkim_private.pem 2048 && openssl rsa -in dkim_private.pem -pubout -outform DER | base64 -w 0
```

#### DMARC (Domain-based Message Authentication)
```dns
_dmarc.pmerit.com. IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@pmerit.com; ruf=mailto:dmarc@pmerit.com; fo=1; adkim=s; aspf=s; pct=100"
```

**Policy Progression**:
1. Start with `p=none` (monitoring only)
2. After 2-4 weeks of clean data: `p=quarantine`
3. After 4-8 weeks: `p=reject` (full enforcement)

### Email Service Configuration

#### Dedicated Subdomain
- Use `mail.pmerit.com` for transactional emails
- Separate from marketing emails
- Protects main domain reputation

#### Warm-up Schedule
```
Day 1-3:    50 emails/day
Day 4-7:    100 emails/day
Day 8-14:   500 emails/day
Day 15-21:  1,000 emails/day
Day 22+:    Gradual increase to production volume
```

#### Bounce Handling
```javascript
// Webhook from email provider
POST /webhooks/email/bounce

{
  "email": "user@example.com",
  "bounceType": "hard", // or "soft"
  "reason": "mailbox_not_found"
}

// Action:
- Hard bounce: Mark email as invalid, suppress future sends
- Soft bounce: Retry with exponential backoff (3 attempts max)
- Log to bounce_logs table
- Alert if bounce rate > 5%
```

#### Complaint Handling
```javascript
POST /webhooks/email/complaint

{
  "email": "user@example.com",
  "complaintType": "spam"
}

// Action:
- Immediately suppress email address
- Flag user account for review
- Log to complaints table
- Alert if complaint rate > 0.1%
```

## Security & Privacy

### Password Security

#### Hashing Algorithm: Argon2id
```javascript
const argon2 = require('argon2');

// Hash password on signup
const hashedPassword = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MB
  timeCost: 3,
  parallelism: 4
});

// Verify on login
const isValid = await argon2.verify(hashedPassword, password);

// Fallback: bcrypt with cost factor 12+
const bcrypt = require('bcrypt');
const saltRounds = 12;
const hash = await bcrypt.hash(password, saltRounds);
```

#### Password Policy
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Not in common password list (top 10,000)
- Not similar to username/email

### Session Management

#### Before Email Verification
- **No session created** until email is verified
- OR create **restricted session** with limited access:
  - Can view verification status page
  - Can request resend verification email
  - Cannot access learner portal or other resources

#### After Email Verification

**Cookie Configuration**:
```javascript
res.cookie('pmerit_refresh_token', refreshToken, {
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/auth/refresh'
});

res.cookie('pmerit_session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
```

**Token Strategy**:
- **Access Token**: Short-lived (5-15 minutes), JWT in memory
- **Refresh Token**: Long-lived (7 days), httpOnly cookie
- **Session ID**: Medium-lived (24 hours), httpOnly cookie
- Automatic refresh before access token expires

### Redirect Security

#### Prevent Open Redirects
```javascript
function validateRedirectUrl(returnUrl) {
  // Whitelist approach
  const allowedDomains = [
    'pmerit.com',
    'www.pmerit.com',
    'app.pmerit.com'
  ];
  
  // Default safe redirect
  const defaultRedirect = '/learner-portal';
  
  if (!returnUrl) {
    return defaultRedirect;
  }
  
  try {
    const url = new URL(returnUrl, 'https://pmerit.com');
    
    // Only allow relative URLs or whitelisted domains
    if (url.origin === 'https://pmerit.com' || 
        allowedDomains.includes(url.hostname)) {
      return url.pathname + url.search + url.hash;
    }
  } catch (e) {
    // Invalid URL
  }
  
  return defaultRedirect;
}
```

### Privacy & Compliance

#### Data Minimization
- Collect only essential information
- Don't log full email addresses in application logs
- Use email hash for logging/analytics

#### Log Redaction
```javascript
function redactEmail(email) {
  const [local, domain] = email.split('@');
  // Handle short local parts (e.g., "a@domain.com")
  const visibleChars = Math.min(local.length, 2);
  const redactedLocal = local.substring(0, visibleChars) + '***';
  return `${redactedLocal}@${domain}`;
}

// Examples:
// "john.doe@example.com" → "jo***@example.com"
// "a@example.com" → "a***@example.com"
```

#### Consent Management
```sql
CREATE TABLE user_consents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  consent_type VARCHAR(50) NOT NULL, -- 'terms', 'privacy', 'marketing', 'cookies'
  granted BOOLEAN NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  granted_at TIMESTAMP NOT NULL,
  withdrawn_at TIMESTAMP NULL,
  
  INDEX idx_user_consent (user_id, consent_type)
);
```

#### GDPR/COPPA Compliance
- **Age verification**: Check if user is 13+ (COPPA) or 16+ (GDPR in some regions)
- **Parental consent**: For users under required age
- **Data export**: Provide endpoint for user to download all their data
- **Right to be forgotten**: Implement account deletion with data purge
- **Privacy policy**: Clear, accessible, version-controlled

## Resend & Recovery

### Resend Verification Email

#### Rate Limiting
```javascript
// Cooldown between resend requests
const RESEND_COOLDOWN = 60; // seconds

async function resendVerification(userId) {
  // Check last sent time
  const lastSent = await redis.get(`resend:${userId}`);
  
  if (lastSent) {
    const elapsed = Date.now() - parseInt(lastSent);
    if (elapsed < RESEND_COOLDOWN * 1000) {
      const waitTime = Math.ceil((RESEND_COOLDOWN * 1000 - elapsed) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before requesting again`);
    }
  }
  
  // Invalidate previous tokens
  await db.query(
    `UPDATE verification_tokens 
     SET consumed_at = NOW() 
     WHERE user_id = $1 AND purpose = 'email_verify' AND consumed_at IS NULL`,
    [userId]
  );
  
  // Generate new token
  const token = await createVerificationToken(userId);
  
  // Send email
  await sendVerificationEmail(user, token);
  
  // Set cooldown
  await redis.setex(`resend:${userId}`, RESEND_COOLDOWN, Date.now().toString());
  
  return { success: true };
}
```

#### UI/UX
```html
<div class="verification-pending">
  <h2>Verify Your Email</h2>
  <p>We sent a verification link to <strong>{{email}}</strong></p>
  <p>Didn't receive it? <button id="resend-btn">Resend</button></p>
  <p id="cooldown-msg" style="display:none;">
    Please wait <span id="countdown"></span> seconds before requesting again.
  </p>
</div>
```

### Email Change Flow

When user requests to change email:

```
1. User enters new email in profile settings
2. Validate new email is not already in use
3. Create verification token for NEW email
4. Send verification email to NEW address
5. User clicks link in NEW email
6. Verify token for new email
7. ATOMIC UPDATE:
   - Update users.email to new value
   - Set users.email_verified_at to NOW()
   - Mark old email as changed in audit log
8. Send notification to OLD email about change
9. Invalidate all sessions (force re-login for security)
```

**Security Notes**:
- Keep old email as backup for 30 days
- Allow reverting within 30 days if compromised
- Require password confirmation before email change
- Send security alert to both old and new addresses

### OTP Fallback Path

```javascript
POST /auth/verify-otp

Request:
{
  "userId": "uuid",
  "code": "123456"
}

Logic:
1. Rate limit: Max 1 attempt per 30 seconds per user
2. Fetch active OTP for user
3. Check attempts < 5
4. Hash provided code and compare
5. If match:
   - Mark user as verified
   - Consume OTP
   - Return success
6. If no match:
   - Increment attempts
   - If attempts >= 5: Invalidate OTP, require new request
   - Return failure with remaining attempts
```

## Auditing & Admin

### Auth Events Table

```sql
CREATE TABLE auth_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL,
  -- Event types:
  -- 'account_created', 'email_verification_sent', 'email_verification_clicked',
  -- 'email_verified', 'email_verification_failed', 'login_success', 'login_failed',
  -- 'password_reset_requested', 'password_reset_completed', 'email_changed',
  -- 'account_locked', 'account_unlocked'
  
  status VARCHAR(20) NOT NULL, -- 'success', 'failure', 'pending'
  failure_reason TEXT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  metadata JSONB NULL, -- Additional context
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_events (user_id, created_at DESC),
  INDEX idx_event_type (event_type, created_at DESC),
  INDEX idx_created_at (created_at DESC)
);
```

#### Event Logging Example
```javascript
async function logAuthEvent(data) {
  await db.query(
    `INSERT INTO auth_events 
     (user_id, event_type, status, failure_reason, ip_address, user_agent, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      data.userId,
      data.eventType,
      data.status,
      data.failureReason || null,
      data.ipAddress,
      data.userAgent,
      data.metadata || {}
    ]
  );
}

// Usage:
await logAuthEvent({
  userId: user.id,
  eventType: 'email_verification_clicked',
  status: 'success',
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  metadata: { tokenId: token.id }
});
```

### Admin Tools

#### Manual Verification Interface
```javascript
POST /admin/users/:userId/verify-email

Authorization: Admin role required

Request:
{
  "reason": "Support ticket #12345 - User unable to receive emails"
}

Logic:
1. Verify admin authentication and permissions
2. Update user.email_verified_at = NOW()
3. Invalidate all outstanding verification tokens
4. Log auth_event with admin override
5. Send confirmation email to user
6. Log admin action in admin_audit_log
```

#### Token Invalidation
```javascript
POST /admin/users/:userId/invalidate-tokens

Request:
{
  "reason": "Security concern - compromised account",
  "tokenTypes": ["email_verify", "password_reset"]
}

Logic:
1. Verify admin permissions
2. Mark all matching tokens as consumed
3. Log admin action
4. Optionally lock account if security concern
```

#### Verification Status Dashboard
- List users by verification status
- Filter by date range, region, verification method
- Bulk actions (resend, verify, invalidate)
- Export data for analysis

## Internationalization & Accessibility

### Email Localization

#### Region-Specific Templates
```javascript
const emailTemplates = {
  'en-NG': { // Nigeria
    subject: 'Verify your PMERIT account',
    greeting: 'Welcome to PMERIT!',
    cta: 'Verify Email'
  },
  'en-US': {
    subject: 'Verify your PMERIT account',
    greeting: 'Welcome to PMERIT!',
    cta: 'Verify Email'
  },
  'fr-SN': { // Senegal
    subject: 'Vérifiez votre compte PMERIT',
    greeting: 'Bienvenue sur PMERIT!',
    cta: 'Vérifier l\'email'
  }
};

function getTemplate(region, language) {
  const locale = `${language}-${region}`;
  return emailTemplates[locale] || emailTemplates['en-US'];
}
```

#### Multi-Part Email Format
```javascript
const mailOptions = {
  from: 'PMERIT <noreply@mail.pmerit.com>',
  to: user.email,
  subject: template.subject,
  text: renderPlainText(template, data), // Plain text version
  html: renderHtml(template, data) // HTML version
};
```

**Plain Text Version** (critical for accessibility):
```
Welcome to PMERIT!

Please verify your email address by clicking the link below:

https://pmerit.com/verify?tid=abc123&sig=xyz789&u=user-id

This link expires in 30 minutes.

If the link doesn't work, copy and paste it into your browser.

If you didn't create a PMERIT account, please ignore this email.

---
PMERIT - Empowering learning through accessible education
```

### Accessible Email Templates

#### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <img src="https://pmerit.com/assets/images/logo.png" 
                   alt="PMERIT Logo" 
                   width="150" 
                   height="50">
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="background: #ffffff; padding: 40px; border-radius: 8px;">
              <h1 style="margin: 0 0 20px; font-size: 24px;">
                Welcome to PMERIT!
              </h1>
              
              <p style="margin: 0 0 20px; font-size: 16px;">
                Thank you for creating an account. Please verify your email address to get started.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 20px 0;">
                    <a href="{{verificationLink}}" 
                       style="display: inline-block; 
                              padding: 14px 40px; 
                              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color: #ffffff; 
                              text-decoration: none; 
                              border-radius: 6px;
                              font-weight: bold;
                              font-size: 16px;"
                       role="button">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Fallback Link -->
              <p style="margin: 20px 0; font-size: 14px; color: #666;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="word-break: break-all; font-size: 12px; color: #667eea;">
                {{verificationLink}}
              </p>
              
              <!-- Expiration Notice -->
              <p style="margin: 20px 0 0; font-size: 14px; color: #999;">
                This link expires in 30 minutes.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 12px; color: #999;">
              <p>If you didn't create a PMERIT account, please ignore this email.</p>
              <p>PMERIT - Empowering learning through accessible education</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

#### Accessibility Features
- ✅ Semantic HTML (`<table role="presentation">` for layout)
- ✅ Alt text for images
- ✅ High color contrast (WCAG AA compliant)
- ✅ Large touch targets (44x44px minimum)
- ✅ Clear, descriptive link text
- ✅ Fallback plain text link
- ✅ Screen reader friendly structure

## User Flow (End-to-End)

### Complete Signup & Verification Journey

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User Clicks "Sign In" in Header                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Modal Opens with Two Tabs                          │
│         - "Sign In" (default)                               │
│         - "Sign Up" (user clicks this)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: User Completes Sign Up Form                        │
│         - Email: user@example.com                           │
│         - Username: johnlearner                             │
│         - Region: West Africa                               │
│         - Country: Nigeria (auto-filled)                    │
│         - Password: ******** (with strength indicator)      │
│         - Turnstile CAPTCHA (invisible or interactive)      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Form Submission                                     │
│         POST /auth/signup                                   │
│         - Client validation passes                          │
│         - Turnstile token included                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Server Processing                                  │
│         - Validate Turnstile token                          │
│         - Check rate limits (IP + email)                    │
│         - Validate email uniqueness                         │
│         - Hash password with Argon2id                       │
│         - Create user record (email_verified_at = NULL)     │
│         - Generate verification token (magic link)          │
│         - Send verification email                           │
│         - Log auth_event: 'account_created'                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Success Screen                                     │
│         "Check Your Email to Verify Your Account"          │
│         - Display user's email (redacted: us***@example.com)│
│         - "Resend Email" button (with cooldown)             │
│         - "Use Code Instead" link (OTP fallback)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 7: User Checks Email                                  │
│         Subject: "Verify your PMERIT account"               │
│         - Clear, branded email                              │
│         - Large "Verify Email Address" button               │
│         - Fallback link (copyable)                          │
│         - Expiration warning (30 minutes)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 8: User Clicks Verification Link                      │
│         GET /verify?tid=abc123&sig=xyz789&u=user-id        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 9: Server Validates Token                             │
│         - Verify HMAC signature                             │
│         - Check token exists and not consumed               │
│         - Check not expired                                 │
│         - ATOMIC: Mark token consumed + set email_verified  │
│         - Log auth_event: 'email_verified'                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 10: Success Page                                      │
│          "Account Verified Successfully!"                   │
│          - Success icon/animation                           │
│          - "Continue to Sign In" button                     │
│          OR auto-redirect in 3 seconds                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 11: User Signs In                                     │
│          - Enter email + password                           │
│          - Server validates credentials                     │
│          - Create secure session                            │
│          - Issue access + refresh tokens                    │
│          - Log auth_event: 'login_success'                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 12: Redirect to Learner Portal                        │
│          - Full access granted                              │
│          - Session persists across page navigation          │
│          - Welcome message with user's name                 │
└─────────────────────────────────────────────────────────────┘
```

### Edge Cases & Alternative Flows

#### Email Not Received
```
User on success screen → Clicks "Resend Email"
                       → Cooldown check (60s)
                       → Generate new token (invalidate old)
                       → Send new email
                       → Update cooldown timer
```

#### Token Expired
```
User clicks old link → Server: "Link expired"
                     → "Request New Verification Email" button
                     → Redirect to resend flow
```

#### Token Already Used
```
User clicks link twice → Server: "Already verified"
                       → "Go to Sign In" button
                       → Redirect to signin page
```

#### OTP Fallback
```
User on success screen → Clicks "Use Code Instead"
                       → Generate 6-digit OTP
                       → Send via email
                       → Show OTP entry form
                       → User enters code
                       → Verify with rate limiting
                       → Success → Redirect to sign in
```

## API Endpoints (Implementation Reference)

### Authentication Endpoints

#### POST /auth/signup
**Description**: Create new user account and trigger email verification

**Request**:
```json
{
  "email": "user@example.com",
  "username": "johnlearner",
  "password": "SecurePass123!",
  "region": "west_africa",
  "country": "Nigeria",
  "turnstileToken": "cf-turnstile-token"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "Account created. Please check your email to verify.",
  "userId": "uuid-here",
  "email": "user@example.com"
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "error": "Email already registered",
  "code": "EMAIL_EXISTS"
}
```

**Error Codes**:
- `EMAIL_EXISTS`: Email already registered
- `USERNAME_TAKEN`: Username unavailable
- `INVALID_EMAIL`: Email format invalid
- `WEAK_PASSWORD`: Password doesn't meet requirements
- `RATE_LIMIT`: Too many attempts
- `TURNSTILE_FAILED`: CAPTCHA verification failed

---

#### POST /auth/resend-verification
**Description**: Resend verification email to user

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Verification email sent",
  "cooldown": 60
}
```

**Response** (Error - 429):
```json
{
  "success": false,
  "error": "Please wait before requesting again",
  "cooldownRemaining": 45
}
```

---

#### GET /auth/verify
**Description**: Verify email address via magic link

**Query Parameters**:
- `tid`: Token ID (UUID)
- `sig`: HMAC signature
- `u`: User ID

**Response** (Success - 200):
```html
<!-- Redirect to success page with message -->
Location: /verified?status=success
```

**Response** (Error - 400):
```html
<!-- Redirect to error page with reason -->
Location: /verified?status=error&reason=expired
```

**Error Reasons**:
- `expired`: Token expired
- `consumed`: Token already used
- `invalid`: Invalid token or signature
- `not_found`: Token not found

---

#### POST /auth/verify-otp
**Description**: Verify email via OTP code

**Request**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "error": "Invalid code",
  "attemptsRemaining": 3
}
```

---

#### POST /auth/request-otp
**Description**: Request OTP code for email verification

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "expiresIn": 600
}
```

---

#### POST /auth/login
**Description**: Authenticate user and create session

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Signed in successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johnlearner",
    "emailVerified": true
  },
  "accessToken": "jwt-token-here",
  "expiresIn": 900
}
```

**Note**: Refresh token set as httpOnly cookie

**Response** (Error - 401):
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Response** (Error - 403):
```json
{
  "success": false,
  "error": "Email not verified",
  "code": "EMAIL_NOT_VERIFIED"
}
```

---

#### POST /auth/logout
**Description**: End user session

**Headers**:
```
Authorization: Bearer <access-token>
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

---

#### POST /auth/refresh
**Description**: Refresh access token

**Cookies**: `pmerit_refresh_token` (httpOnly)

**Response** (Success - 200):
```json
{
  "success": true,
  "accessToken": "new-jwt-token",
  "expiresIn": 900
}
```

---

#### POST /auth/change-email
**Description**: Initiate email change process

**Headers**:
```
Authorization: Bearer <access-token>
```

**Request**:
```json
{
  "newEmail": "newemail@example.com",
  "password": "current-password"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Verification email sent to new address"
}
```

---

#### POST /auth/forgot-password
**Description**: Request password reset email

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "If that email exists, we sent a reset link"
}
```

**Note**: Always return success (even if email doesn't exist) to prevent email enumeration

---

#### POST /auth/reset-password
**Description**: Reset password with token

**Request**:
```json
{
  "token": "reset-token",
  "password": "NewSecurePass123!"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Admin Endpoints

#### POST /admin/users/:userId/verify-email
**Description**: Manually verify user email (admin only)

**Headers**:
```
Authorization: Bearer <admin-access-token>
```

**Request**:
```json
{
  "reason": "Support ticket #12345"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "User email verified"
}
```

---

#### POST /admin/users/:userId/invalidate-tokens
**Description**: Invalidate all tokens for a user

**Request**:
```json
{
  "reason": "Security concern",
  "tokenTypes": ["email_verify", "password_reset"]
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Tokens invalidated",
  "count": 3
}
```

---

#### GET /admin/users/verification-status
**Description**: List users by verification status

**Query Parameters**:
- `status`: `verified` | `pending` | `expired`
- `page`: Page number
- `limit`: Results per page

**Response** (Success - 200):
```json
{
  "success": true,
  "data": [
    {
      "userId": "uuid",
      "email": "user@example.com",
      "username": "johnlearner",
      "createdAt": "2025-10-23T10:00:00Z",
      "emailVerified": false,
      "lastVerificationSent": "2025-10-23T10:01:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

## Minimum Tests

### Unit Tests

#### Token Generation & Validation
```javascript
describe('Verification Token', () => {
  test('generates unique token', () => {
    const token1 = generateToken();
    const token2 = generateToken();
    expect(token1).not.toBe(token2);
  });
  
  test('token hash is SHA-256', () => {
    const token = generateToken();
    const hash = hashToken(token);
    expect(hash).toHaveLength(64); // 256 bits / 4 bits per hex char
  });
  
  test('HMAC signature validates correctly', () => {
    const data = { tid: 'abc', u: 'user-id', exp: Date.now() };
    const sig = generateSignature(data);
    expect(validateSignature(data, sig)).toBe(true);
  });
  
  test('HMAC signature fails with tampered data', () => {
    const data = { tid: 'abc', u: 'user-id', exp: Date.now() };
    const sig = generateSignature(data);
    data.u = 'different-user';
    expect(validateSignature(data, sig)).toBe(false);
  });
});
```

#### Token Reuse Prevention
```javascript
describe('Token Consumption', () => {
  test('token can be used once', async () => {
    const token = await createToken(userId);
    const result1 = await verifyToken(token);
    expect(result1.success).toBe(true);
    
    const result2 = await verifyToken(token);
    expect(result2.success).toBe(false);
    expect(result2.error).toBe('Token already used');
  });
  
  test('concurrent requests handled atomically', async () => {
    const token = await createToken(userId);
    
    // Simulate race condition
    const [result1, result2] = await Promise.all([
      verifyToken(token),
      verifyToken(token)
    ]);
    
    const successes = [result1, result2].filter(r => r.success);
    expect(successes).toHaveLength(1);
  });
});
```

#### Token Expiration
```javascript
describe('Token Expiration', () => {
  test('rejects expired token', async () => {
    const expiredToken = await createToken(userId, { expiresIn: -3600 });
    const result = await verifyToken(expiredToken);
    expect(result.success).toBe(false);
    expect(result.error).toContain('expired');
  });
  
  test('accepts valid non-expired token', async () => {
    const token = await createToken(userId, { expiresIn: 1800 });
    const result = await verifyToken(token);
    expect(result.success).toBe(true);
  });
});
```

#### Rate Limiting
```javascript
describe('Rate Limiting', () => {
  test('allows requests within limit', async () => {
    for (let i = 0; i < 5; i++) {
      const result = await resendVerification(userId);
      expect(result.success).toBe(true);
      await sleep(61000); // Wait for cooldown
    }
  });
  
  test('blocks requests exceeding limit', async () => {
    await resendVerification(userId);
    const result = await resendVerification(userId);
    expect(result.success).toBe(false);
    expect(result.error).toContain('wait');
  });
  
  test('cooldown resets after period', async () => {
    await resendVerification(userId);
    await sleep(61000);
    const result = await resendVerification(userId);
    expect(result.success).toBe(true);
  });
});
```

#### Wrong User Token
```javascript
describe('Token User Validation', () => {
  test('rejects token for different user', async () => {
    const token = await createToken(userId1);
    const result = await verifyToken(token, userId2);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid token');
  });
});
```

### Integration Tests

#### OTP Flow
```javascript
describe('OTP Verification', () => {
  test('complete OTP flow succeeds', async () => {
    // Request OTP
    const req = await request(app)
      .post('/auth/request-otp')
      .send({ email: 'test@example.com' });
    expect(req.status).toBe(200);
    
    // Get OTP from test email inbox
    const otp = await getTestEmail('test@example.com').getOTPCode();
    
    // Verify OTP
    const verify = await request(app)
      .post('/auth/verify-otp')
      .send({ email: 'test@example.com', code: otp });
    expect(verify.status).toBe(200);
    expect(verify.body.success).toBe(true);
    
    // Check user is verified
    const user = await getUser('test@example.com');
    expect(user.emailVerified).toBe(true);
  });
  
  test('invalid OTP rejected with attempts tracking', async () => {
    await request(app)
      .post('/auth/request-otp')
      .send({ email: 'test@example.com' });
    
    const verify = await request(app)
      .post('/auth/verify-otp')
      .send({ email: 'test@example.com', code: '000000' });
    
    expect(verify.status).toBe(400);
    expect(verify.body.attemptsRemaining).toBe(4);
  });
  
  test('OTP locked after max attempts', async () => {
    await request(app)
      .post('/auth/request-otp')
      .send({ email: 'test@example.com' });
    
    // Try 5 wrong codes
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/auth/verify-otp')
        .send({ email: 'test@example.com', code: '000000' });
    }
    
    // 6th attempt
    const verify = await request(app)
      .post('/auth/verify-otp')
      .send({ email: 'test@example.com', code: '000000' });
    
    expect(verify.status).toBe(429);
    expect(verify.body.error).toContain('locked');
  });
});
```

### Email Deliverability Tests

#### SPF/DKIM Alignment
```javascript
describe('Email Deliverability', () => {
  test('emails have valid SPF record', async () => {
    const dns = await resolveTxt('pmerit.com');
    const spf = dns.find(r => r.startsWith('v=spf1'));
    expect(spf).toBeDefined();
    expect(spf).toContain('include:_spf.mail.pmerit.com');
  });
  
  test('emails have DKIM signature', async () => {
    const email = await sendTestEmail();
    expect(email.headers['dkim-signature']).toBeDefined();
    
    const valid = await verifyDKIM(email);
    expect(valid).toBe(true);
  });
  
  test('emails align with DMARC policy', async () => {
    const email = await sendTestEmail();
    const dmarcResult = await checkDMARC(email);
    expect(dmarcResult.spfAligned).toBe(true);
    expect(dmarcResult.dkimAligned).toBe(true);
  });
});
```

#### Link Testing
```javascript
describe('Email Links', () => {
  test('verification link works', async () => {
    const user = await createUser();
    const email = await captureEmail(user.email);
    const link = extractLink(email.html, 'Verify Email');
    
    const response = await fetch(link);
    expect(response.status).toBe(200);
    expect(response.url).toContain('/verified?status=success');
  });
  
  test('broken link shows fallback', async () => {
    const user = await createUser();
    const email = await captureEmail(user.email);
    const plainText = email.text;
    
    expect(plainText).toContain('https://pmerit.com/verify?');
    expect(plainText).toContain('copy and paste');
  });
});
```

### Accessibility Tests

#### Email Template Accessibility
```javascript
describe('Email Accessibility', () => {
  test('HTML email has semantic structure', async () => {
    const html = renderEmailTemplate('verification', data);
    const $ = cheerio.load(html);
    
    expect($('table[role="presentation"]')).toHaveLength(3);
    expect($('img').attr('alt')).toBeDefined();
    expect($('a[role="button"]')).toHaveLength(1);
  });
  
  test('email has sufficient color contrast', async () => {
    const html = renderEmailTemplate('verification', data);
    const results = await axe.run(html, {
      rules: ['color-contrast']
    });
    expect(results.violations).toHaveLength(0);
  });
  
  test('plain text version provided', async () => {
    const email = await sendVerificationEmail(user);
    expect(email.text).toBeDefined();
    expect(email.text).toContain(user.email);
    expect(email.text).toContain('https://pmerit.com/verify');
  });
});
```

### Mobile Testing

```javascript
describe('Mobile Responsiveness', () => {
  test('email renders correctly on mobile viewport', async () => {
    const html = renderEmailTemplate('verification', data);
    
    // Test with Email on Acid or Litmus API
    const preview = await emailPreviewService.test(html, {
      clients: ['gmail-mobile', 'ios-mail', 'outlook-mobile']
    });
    
    expect(preview.passRate).toBeGreaterThan(0.95);
  });
  
  test('CTA button is touch-friendly', async () => {
    const html = renderEmailTemplate('verification', data);
    const $ = cheerio.load(html);
    const button = $('a[role="button"]');
    const padding = button.css('padding');
    
    // Minimum 44x44px touch target
    expect(parsePadding(padding)).toBeGreaterThanOrEqual(44);
  });
});
```

### Security Tests

```javascript
describe('Security', () => {
  test('prevents timing attacks on token verification', async () => {
    const validToken = await createToken(userId);
    const invalidToken = 'invalid-token';
    
    const validTime = await measureTime(() => verifyToken(validToken));
    const invalidTime = await measureTime(() => verifyToken(invalidToken));
    
    // Times should be similar (within 10ms)
    expect(Math.abs(validTime - invalidTime)).toBeLessThan(10);
  });
  
  test('password stored with Argon2id', async () => {
    const user = await createUser({ password: 'TestPass123!' });
    const hash = await getPasswordHash(user.id);
    
    expect(hash).toContain('$argon2id$');
  });
  
  test('prevents email enumeration', async () => {
    // Existing email
    const res1 = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'existing@example.com' });
    
    // Non-existing email
    const res2 = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'nonexistent@example.com' });
    
    // Both should return same message
    expect(res1.body.message).toBe(res2.body.message);
    expect(res1.status).toBe(res2.status);
  });
});
```

## Implementation Priority

### Phase 2.1 - Core Verification (Week 1-2)
1. ✅ Database schema (users, verification_tokens, auth_events)
2. ✅ Token generation and validation logic
3. ✅ Email service integration (SendGrid/AWS SES)
4. ✅ Basic magic link verification endpoint
5. ✅ SPF/DKIM/DMARC setup
6. ✅ Basic email templates (HTML + plain text)

### Phase 2.2 - Security & UX (Week 3-4)
1. ✅ Cloudflare Turnstile integration
2. ✅ Rate limiting (Redis-based)
3. ✅ Argon2id password hashing
4. ✅ Secure session management
5. ✅ Resend verification flow
6. ✅ OTP fallback system

### Phase 2.3 - Admin & Monitoring (Week 5-6)
1. ✅ Auth events logging
2. ✅ Admin verification tools
3. ✅ Dashboard for verification status
4. ✅ Bounce/complaint handling
5. ✅ Metrics and alerting

### Phase 2.4 - Polish & Compliance (Week 7-8)
1. ✅ Email localization (multi-language)
2. ✅ Accessibility improvements
3. ✅ GDPR/COPPA compliance features
4. ✅ Comprehensive testing
5. ✅ Documentation
6. ✅ Production deployment

## Success Metrics

### Technical Metrics
- **Email Delivery Rate**: >95%
- **Email Open Rate**: >40%
- **Verification Completion Rate**: >70%
- **Token Validation Time**: <100ms
- **API Response Time (p95)**: <200ms

### Security Metrics
- **Bounce Rate**: <5%
- **Complaint Rate**: <0.1%
- **Failed Login Attempts**: Monitor for patterns
- **Token Reuse Attempts**: Log and alert

### User Experience Metrics
- **Time to Verify**: Median <2 minutes
- **Resend Rate**: <20% of users
- **Support Tickets**: <2% verification-related

## Maintenance & Operations

### Daily
- Monitor email delivery metrics
- Check error logs for verification failures
- Review rate limiting triggers

### Weekly
- Analyze verification funnel metrics
- Review DMARC reports
- Update bounce suppression list

### Monthly
- Audit auth_events for patterns
- Review and rotate secrets/keys
- Test disaster recovery procedures

### Quarterly
- Security audit of authentication flow
- Penetration testing
- Update dependencies
- Review and update email templates

## References

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- [JWT Best Practices (RFC 8725)](https://tools.ietf.org/html/rfc8725)
- [SPF (RFC 7208)](https://tools.ietf.org/html/rfc7208)
- [DKIM (RFC 6376)](https://tools.ietf.org/html/rfc6376)
- [DMARC (RFC 7489)](https://tools.ietf.org/html/rfc7489)
- [Argon2 Password Hashing](https://github.com/P-H-C/phc-winner-argon2)
- [GDPR Compliance](https://gdpr.eu/)
- [COPPA Guidelines](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule)

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Authors**: PMERIT Engineering Team  
**Status**: Ready for Implementation
