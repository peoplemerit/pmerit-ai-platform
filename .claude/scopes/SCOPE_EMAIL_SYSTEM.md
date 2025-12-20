# SCOPE: Official Email System

**Status:** IN_PROGRESS
**Created:** December 19, 2025 (Session 63)
**Last Updated:** December 19, 2025 (Session 63)
**Created By:** Claude Code
**Handoff By:** Claude Web

---

## SCOPE IDENTITY

### Purpose
Establish an official email system for PMERIT platform operations, support, and transactional communications.

### Corporate Structure Context

```
PMERIT (PEOPLE MERIT) LLC (Holdings)
├── PMERIT FOUNDATION (501(c)(3) Pending)
│   ├── Idowu J. Gabriel – Chairperson
│   ├── Kayode C. Sofolahan – Secretary
│   ├── Blessing-Salume Aluge – Treasurer
│   └── Joy Aluge – Bookkeeper
│
└── PMERIT TECHNOLOGIES LLC (Subsidiary)
```

### Files Owned

**Backend (pmerit-api-worker)**
| File | Purpose | Status |
|------|---------|--------|
| `src/utils/email.ts` | Resend email sending utility | EXISTS |
| `src/routes/auth.ts` | Uses email for verification/reset | EXISTS |

**Frontend (pmerit-ai-platform)**
| File | Purpose | Status |
|------|---------|--------|
| N/A | Email references in HTML pages | References only |

### External Services

| Service | Purpose | Status |
|---------|---------|--------|
| Resend | Transactional email API (outbound) | CONFIGURED |
| Cloudflare Email Routing | Inbound email forwarding | CONFIGURED |

---

## AUDIT_REPORT

### Current Cloudflare Email Routing Configuration

| Custom Address | Action | Destination | Status |
|----------------|--------|-------------|--------|
| `noreply@pmerit.com` | Send to Worker | pmerit-email-service | Worker not found (BROKEN) |
| `info@pmerit.com` | Forward | peoplemerit@gmail.com | Active |
| Catch-all | Drop | N/A | Active |

### Current Email Addresses Referenced in Codebase (9)

| Email | Purpose | Implementation Status |
|-------|---------|----------------------|
| `support@pmerit.com` | Primary support inbox | NOT ROUTED (dropped) |
| `privacy@pmerit.com` | Privacy/GDPR inquiries | NOT ROUTED (dropped) |
| `legal@pmerit.com` | Legal matters | NOT ROUTED (dropped) |
| `security@pmerit.com` | Security vulnerability reports | NOT ROUTED (dropped) |
| `noreply@pmerit.com` | Transactional email sender | BROKEN (Worker not found) |
| `api-support@pmerit.com` | API/Developer support | NOT ROUTED (dropped) |
| `developers@pmerit.com` | Developer community | NOT ROUTED (dropped) |
| `careers@pmerit.com` | Career/job inquiries | NOT ROUTED (dropped) |
| `info@pmerit.com` | General inquiries | WORKING |

### Identified Gaps

1. **Broken Worker route** - noreply@pmerit.com points to non-existent Worker
2. **No board member emails** - Founding team has no @pmerit.com addresses
3. **Service emails dropped** - support@, security@, privacy@ all dropped by catch-all
4. **No centralized inbox** - Each address needs routing configuration

---

## HANDOFF_DOCUMENT

### Overview

Establish a professional email system for PMERIT's corporate structure using a phased approach: free Cloudflare Email Routing now, with documented upgrade paths as the organization grows.

### Phase 1: Cloudflare Email Routing (IMPLEMENT NOW)

**Cost:** $0/month
**Timeline:** Immediate
**Effort:** 15 minutes in Cloudflare Dashboard

#### Board Member Email Addresses

| Custom Address | Action | Destination | Purpose |
|----------------|--------|-------------|---------|
| `idowu@pmerit.com` | Forward | idowu.j.gabriel@outlook.com | Chairperson/Founder |
| `kayode@pmerit.com` | Forward | olucornels4g@gmail.com | Secretary |
| `blessing@pmerit.com` | Forward | nikkyholame@gmail.com | Treasurer |
| `joy@pmerit.com` | Forward | Alugejoy3@gmail.com | Bookkeeper |

#### Role-Based Aliases (Professional)

| Custom Address | Action | Destination | Purpose |
|----------------|--------|-------------|---------|
| `founder@pmerit.com` | Forward | idowu.j.gabriel@outlook.com | Public founder contact |
| `secretary@pmerit.com` | Forward | olucornels4g@gmail.com | Corporate secretary |
| `treasurer@pmerit.com` | Forward | nikkyholame@gmail.com | Financial contact |
| `bookkeeper@pmerit.com` | Forward | Alugejoy3@gmail.com | Accounting contact |

#### Service Email Addresses

| Custom Address | Action | Destination | Purpose |
|----------------|--------|-------------|---------|
| `support@pmerit.com` | Forward | peoplemerit@gmail.com | User support |
| `security@pmerit.com` | Forward | idowu.j.gabriel@outlook.com | Security reports |
| `privacy@pmerit.com` | Forward | idowu.j.gabriel@outlook.com | GDPR/privacy requests |
| `legal@pmerit.com` | Forward | olucornels4g@gmail.com | Legal matters |
| `careers@pmerit.com` | Forward | peoplemerit@gmail.com | Job inquiries |
| `info@pmerit.com` | Forward | peoplemerit@gmail.com | Already configured |

#### Cleanup Required

| Custom Address | Current State | Action |
|----------------|---------------|--------|
| `noreply@pmerit.com` | Worker not found | DELETE this route (Resend handles outbound) |
| Catch-all | Drop | Keep as-is (prevents spam) |

### Implementation Steps

**Step 1:** Access Cloudflare Dashboard → pmerit.com → Email → Email Routing → Routing rules

**Step 2:** Delete broken route
- Find `noreply@pmerit.com` → Click "Edit" → Delete

**Step 3:** Add destination addresses (if not already verified)
- Go to "Destination addresses" tab
- Add and verify each personal email:
  - idowu.j.gabriel@outlook.com
  - olucornels4g@gmail.com
  - nikkyholame@gmail.com
  - Alugejoy3@gmail.com
  - peoplemerit@gmail.com (likely already verified)

**Step 4:** Create custom addresses
- Click "Create address" for each entry in the tables above
- Select "Send to an email" as the action
- Select the verified destination

**Step 5:** Verify all routes show "Active" status

### Sending FROM @pmerit.com (Optional - Gmail/Outlook Setup)

Since Cloudflare only forwards inbound email, board members who want to send as their @pmerit.com address can configure their personal email client:

**For Gmail Users (Kayode, Blessing, Joy):**
1. Gmail → Settings → Accounts → "Send mail as"
2. Add name@pmerit.com
3. SMTP Server: smtp.resend.com
4. Port: 587 (TLS)
5. Username: resend
6. Password: [Resend API Key]

**For Outlook Users (Idowu):**
1. Outlook → Settings → Mail → Sync email → Manage or choose a default From address
2. Add alias (requires Resend SMTP configuration)

*Note: This is optional for Phase 1. Full send-as capability comes with Phase 2 (Zoho).*

---

### Phase 2: Zoho Mail Free (FUTURE)

**Trigger:** When team needs native send-as capability without SMTP workarounds
**Cost:** $0/month (up to 5 users)
**Timeline:** When convenient

| Item | From | To |
|------|------|-----|
| MX Records | Cloudflare | Zoho |
| Mailbox Type | Forwarding | Real inbox |
| Send-as | SMTP workaround | Native |
| Storage | N/A | 5GB/user |
| Web Interface | Personal email | mail.zoho.com |

**Migration Steps (Document Only - Not Yet):**
1. Sign up at zoho.com/mail with pmerit.com domain
2. Verify domain ownership via TXT record
3. Create 4 user accounts (board members)
4. Create aliases for service emails
5. Update MX records to Zoho
6. Disable Cloudflare Email Routing
7. Test send/receive

---

### Phase 3: Paid Upgrade (FUTURE)

**Trigger:** Team exceeds 5 users OR needs calendar/drive/collaboration

| Provider | Cost/User/Month | Users | Storage | Best For |
|----------|-----------------|-------|---------|----------|
| Zoho Lite | $1 | Unlimited | 10GB | Budget, IMAP access |
| Zoho Standard | $3 | Unlimited | 30GB | Full collaboration |
| Google Workspace | $6 | Unlimited | 30GB | Google ecosystem |
| Microsoft 365 | $6 | Unlimited | 50GB | Office/Teams users |

---

### Complete Email Address Registry

| Email | Type | Owner/Destination | Status |
|-------|------|-------------------|--------|
| `idowu@pmerit.com` | Personal | Idowu J. Gabriel | NOT CREATED |
| `kayode@pmerit.com` | Personal | Kayode C. Sofolahan | NOT CREATED |
| `blessing@pmerit.com` | Personal | Blessing-Salume Aluge | NOT CREATED |
| `joy@pmerit.com` | Personal | Joy Aluge | NOT CREATED |
| `founder@pmerit.com` | Role | → Idowu | NOT CREATED |
| `secretary@pmerit.com` | Role | → Kayode | NOT CREATED |
| `treasurer@pmerit.com` | Role | → Blessing | NOT CREATED |
| `bookkeeper@pmerit.com` | Role | → Joy | NOT CREATED |
| `support@pmerit.com` | Service | → peoplemerit@gmail.com | NOT CREATED |
| `security@pmerit.com` | Service | → Idowu | NOT CREATED |
| `privacy@pmerit.com` | Service | → Idowu | NOT CREATED |
| `legal@pmerit.com` | Service | → Kayode | NOT CREATED |
| `careers@pmerit.com` | Service | → peoplemerit@gmail.com | NOT CREATED |
| `info@pmerit.com` | Service | → peoplemerit@gmail.com | ACTIVE |
| `noreply@pmerit.com` | System | → peoplemerit@gmail.com | ACTIVE (can delete) |

---

### Cost Summary

| Phase | Monthly Cost | Annual Cost | Users |
|-------|--------------|-------------|-------|
| Phase 1 (Now) | $0 | $0 | 4 + service emails |
| Phase 2 (Zoho Free) | $0 | $0 | 5 max |
| Phase 3 (Zoho Lite) | $4 | $48 | 4 users |
| Phase 3 (Google) | $24 | $288 | 4 users |

---

## RESEARCH_FINDINGS

### Session 63 Investigation: December 19, 2025

**Issue Discovered:** Email routes were NOT fully configured.

#### Current State (from Cloudflare screenshots)

**Destination Addresses Tab:**
- Only `peoplemerit@gmail.com` is verified
- Missing: `idowu.j.gabriel@outlook.com`, `olucornels4g@gmail.com`, `nikkyholame@gmail.com`, `Alugejoy3@gmail.com`

**Routing Rules Tab:**
- Only 2 routes exist: `noreply@pmerit.com` and `info@pmerit.com`
- Missing: All 13 planned routes (board members, role aliases, service emails)
- Catch-all: Drop (Active) - this is correct

**Outbound Email:**
- Resend transactional email confirmed working
- Sends from `noreply@pmerit.com` via Resend API
- Test: `/api/v1/auth/forgot-password` returns success

---

## SETUP INSTRUCTIONS (Step-by-Step)

### Prerequisites
- Cloudflare account with pmerit.com domain
- Access to each board member's personal email for verification

### Step 1: Add Destination Addresses

1. Go to: **Cloudflare Dashboard → pmerit.com → Email → Email Routing**
2. Click **"Destination addresses"** tab
3. Click **"Add destination address"**
4. Add each of these emails (one at a time):

| Email to Add | Owner |
|--------------|-------|
| `idowu.j.gabriel@outlook.com` | Idowu (Chairperson) |
| `olucornels4g@gmail.com` | Kayode (Secretary) |
| `nikkyholame@gmail.com` | Blessing (Treasurer) |
| `Alugejoy3@gmail.com` | Joy (Bookkeeper) |

5. **IMPORTANT:** Each person must check their inbox (including spam) and click the Cloudflare verification link
6. Wait until all 4 show **"Verified"** status before proceeding

### Step 2: Create Routing Rules

1. Go to **"Routing rules"** tab
2. Click **"Create address"** for each entry below:

#### Board Member Emails (4)

| Custom address | Action | Destination |
|----------------|--------|-------------|
| `idowu` | Send to an email | idowu.j.gabriel@outlook.com |
| `kayode` | Send to an email | olucornels4g@gmail.com |
| `blessing` | Send to an email | nikkyholame@gmail.com |
| `joy` | Send to an email | Alugejoy3@gmail.com |

#### Role-Based Aliases (4)

| Custom address | Action | Destination |
|----------------|--------|-------------|
| `founder` | Send to an email | idowu.j.gabriel@outlook.com |
| `secretary` | Send to an email | olucornels4g@gmail.com |
| `treasurer` | Send to an email | nikkyholame@gmail.com |
| `bookkeeper` | Send to an email | Alugejoy3@gmail.com |

#### Service Emails (5)

| Custom address | Action | Destination |
|----------------|--------|-------------|
| `support` | Send to an email | peoplemerit@gmail.com |
| `security` | Send to an email | idowu.j.gabriel@outlook.com |
| `privacy` | Send to an email | idowu.j.gabriel@outlook.com |
| `legal` | Send to an email | olucornels4g@gmail.com |
| `careers` | Send to an email | peoplemerit@gmail.com |

### Step 3: Cleanup (Optional)

- The existing `noreply@pmerit.com` → `peoplemerit@gmail.com` route can stay or be deleted
- Resend handles outbound from noreply@, so this route only catches replies to transactional emails

### Step 4: Verify Setup

After all routes are created, each should show **"Active"** (green toggle) in the Routing rules list.

**Test by sending an email:**
1. From any external email (Gmail, Yahoo, etc.)
2. Send to `idowu@pmerit.com`
3. Should arrive at `idowu.j.gabriel@outlook.com` within 1-2 minutes

---

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Route shows "Pending" | Destination email not verified - check inbox for Cloudflare link |
| Email not arriving | Check spam folder; verify route shows "Active" |
| "Worker not found" | Delete that route - it's pointing to non-existent Worker |
| Can't add destination | Email may already exist - check "Destination addresses" tab |

---

#### Notes for Future
- Phase 2 (Zoho Mail Free) documented for when send-as capability needed
- Phase 3 (Google Workspace/Zoho Lite) documented for team scaling

---

## DEPENDENCIES

### Requires
- Cloudflare dashboard access (user must configure manually)
- Board member personal email verification
- 10-15 minutes of configuration time

### Enables
- Professional @pmerit.com addresses for all board members
- Centralized support/legal/security email handling
- Foundation for future email system upgrades

---

## VERIFICATION CHECKLIST

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 1 | Send to idowu@pmerit.com | Arrives at Outlook | PENDING |
| 2 | Send to kayode@pmerit.com | Arrives at Gmail | PENDING |
| 3 | Send to blessing@pmerit.com | Arrives at Gmail | PENDING |
| 4 | Send to joy@pmerit.com | Arrives at Gmail | PENDING |
| 5 | Send to support@pmerit.com | Arrives at peoplemerit@gmail.com | PENDING |
| 6 | Send to random@pmerit.com | Dropped (catch-all) | PENDING |
| 7 | noreply@pmerit.com route deleted | No "Worker not found" error | PENDING |
| 8 | Resend sends from noreply@pmerit.com | Verification emails work | WORKING |

---

## SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 63 | 2025-12-19 | Scope created with audit of existing email references |
| 63 | 2025-12-19 | HANDOFF_DOCUMENT received from Claude Web brainstorm |
| 63 | 2025-12-19 | Issue found: Routes NOT created - only info@ and noreply@ exist |
| 63 | 2025-12-19 | Added detailed SETUP INSTRUCTIONS for manual Cloudflare configuration |

---

*Last Updated: 2025-12-19 (Session 63)*
