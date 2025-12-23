# SCOPE: Pricing System

**Status:** AUDITED + ENHANCED
**Last Audit:** December 17, 2025 (Session 60)
**Last Updated:** December 19, 2025 (Session 64)
**Audited By:** Claude Code
**Related Scopes:** SCOPE_SELF_HOSTED_PREMIUM.md, SCOPE_TTS.md, SCOPE_AVATAR.md

---

## SCOPE IDENTITY

### Files Owned

**Frontend (pmerit-ai-platform)**
| File | Purpose | Lines |
|------|---------|-------|
| `pricing.html` | Pricing page with tiers, FAQ, projections | 422 |
| `assets/css/about-pricing.css` | Shared styles for About & Pricing pages | 933 |

**Backend (pmerit-api-worker)**
| File | Purpose | Status |
|------|---------|--------|
| N/A | No subscription/payment endpoints exist | NOT IMPLEMENTED |

### Database Tables

| Table | Status | Purpose |
|-------|--------|---------|
| `subscriptions` | NOT EXISTS | Would store user subscription tier |
| `payments` | NOT EXISTS | Would store payment history |
| `donation_records` | NOT EXISTS | Would store Pay It Forward contributions |

---

## AUDIT_REPORT

### Production Status: FRONTEND COMPLETE, BACKEND NOT IMPLEMENTED

**Audit Date:** December 17, 2025
**Environment:** Production (pmerit.com)

### 1. Page Structure

**Status:** COMPLETE (Frontend Only)

| Section | Lines | Description |
|---------|-------|-------------|
| Hero | 61-67 | "Education That's Always Free" + Hosea 4:6 quote |
| Pricing Tiers | 69-136 | 3-card grid (Free / Premium / Pay It Forward) |
| Pay-for-Accountability | 138-174 | 4-step retry fee model |
| Revenue Streams | 176-217 | 4-card grid explaining sustainability |
| FAQ | 219-309 | 7 accordion questions |
| Growth Projections | 311-369 | Revenue table (Year 1-3) |
| CTA | 371-391 | Start Learning / Upgrade / Support buttons |

### 2. Pricing Tiers Defined

| Tier | Price | Key Features |
|------|-------|--------------|
| **Always Free** | $0/forever | All courses, basic AI (Gabriel), community, progress tracking, mobile, offline, first attempt free, completion certificates |
| **Premium** | $2.99/month | Everything in Free + advanced AI (GPT-4), personalized paths, priority support, no retry fees, verified certs, career counseling, job matching |
| **Self-Hosted Premium** | $10-20/month | Everything in Premium + Photorealistic MetaHuman avatar, voice cloning (XTTS), perfect lip sync (Audio2Face), local LLM (Llama 3), enterprise features |
| **Pay It Forward** | Custom | Everything in Premium + sponsor students, 1-5% salary contribution, impact tracking, tax-deductible |

### Self-Hosted Premium Tier Details (NEW - Session 64)

**Hardware Infrastructure:** Dell PowerEdge R740 with 2x RTX 4090 GPUs

| Feature | Cloud Premium ($2.99) | Self-Hosted Premium ($10-20) |
|---------|----------------------|------------------------------|
| Avatar | WebGL 3D (cartoon) | Unreal MetaHuman (photorealistic) |
| Voice | Piper TTS (natural) | Coqui XTTS (voice cloning) |
| Lip Sync | Jaw bone rotation | NVIDIA Audio2Face (perfect) |
| AI Model | Cloud API (GPT-4) | Local Llama 3 70B (unlimited) |
| Latency | ~500ms | ~200ms |
| Data Privacy | Cloud processed | 100% on-premise |
| Resolution | 720p | 1080p @ 30fps |

**Cost Justification:**
- Cloud Premium: RunPod GPU costs ~$0.44/hr passed through
- Self-Hosted Premium: Fixed infrastructure, unlimited usage for subscribers
- Break-even: ~50 active Self-Hosted Premium users covers infrastructure

### 3. Pay-for-Accountability Model

| Attempt | Fee | Notes |
|---------|-----|-------|
| 1st | FREE | No cost, take your time |
| 2nd | FREE + Tutoring | Additional AI help provided |
| 3rd | �200 / $0.50 | Small fee, hardship exemptions available |
| 4th+ | Graduated fees | Premium subscribers never pay |

### 4. Revenue Streams Documented

1. **Donations & Pay It Forward** - 1-5% salary, crypto, individual giving
2. **Corporate Sponsorship** - Village/state/national sponsors, CSR
3. **Enterprise Services** - Custom training, white-label solutions
4. **Premium Certifications** - Optional verified certificates

### 5. FAQ Questions (7 Total)

1. Is PMERIT really free forever?
2. What is the pay-for-accountability model?
3. How does Premium differ from the Free plan?
4. What is Pay It Forward?
5. Can I switch between plans?
6. Are donations tax-deductible?
7. Do you sell user data?

### 6. Growth Projections Table (Updated with Self-Hosted Premium)

| Source | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Free Tier (Cloud) | $0 | $0 | $0 |
| Cloud Premium ($2.99/mo) | $50K | $500K | $2M |
| **Self-Hosted Premium ($15/mo avg)** | **$18K** | **$180K** | **$900K** |
| Corporate Partnerships | $100K | $750K | $3M |
| Donations & Grants | $200K | $1M | $5M |
| Certifications | $25K | $250K | $1M |
| **Total Revenue** | **$393K** | **$2.68M** | **$11.9M** |
| **Free Learners Served** | **10K+** | **100K+** | **1M+** |
| **Self-Hosted Premium Users** | **100** | **1,000** | **5,000** |

### Self-Hosted Premium Cost Model

| Usage Pattern | GPU Hours/Month | Infrastructure Cost | User Price | Margin |
|---------------|-----------------|---------------------|------------|--------|
| Light (5 hrs/mo) | 5 | ~$1.00/user | $10/mo | 90% |
| Medium (10 hrs/mo) | 10 | ~$2.00/user | $15/mo | 87% |
| Heavy (20 hrs/mo) | 20 | ~$4.00/user | $20/mo | 80% |

**Infrastructure Costs (Fixed):**
| Item | Monthly Cost |
|------|-------------|
| Electricity (500W avg) | $100-200 |
| Colocation/Bandwidth | $150-350 |
| Maintenance/Monitoring | $50-100 |
| **Total Fixed** | **$300-650/mo** |

**Break-even Analysis:**
- At $15/mo subscription: 22-44 subscribers cover infrastructure
- At 100 subscribers: $1,500/mo revenue - $500/mo cost = $1,000/mo profit
- At 1,000 subscribers: $15,000/mo revenue - $500/mo cost = $14,500/mo profit

---

## IDENTIFIED GAPS

### Priority 1: Backend Not Implemented
1. **No subscription API** - Cannot actually subscribe to Premium
2. **No payment processing** - No Stripe/PayPal integration
3. **No user tier storage** - Database has no subscription tables
4. **Premium features not gated** - All users get same features currently

### Priority 2: Frontend Gaps
1. **CTA buttons lead to signin.html** - No actual subscription flow
2. **Pay It Forward links to contact.html** - No dedicated donation flow
3. **No pricing page analytics** - Can't track conversion
4. **No currency localization** - Shows USD/NGN hardcoded

### Priority 3: Integration Gaps
1. **No connection to voice system** - Premium voices exist but not tied to subscription
2. **No assessment retry gating** - Accountability model not enforced
3. **No certificate verification system** - "Verified certificates" not implemented

### Priority 4: Credit System for GPU Features (From Brainstorm Session 70)

**Concept:** Micro-transaction credits for GPU-intensive features like virtual human time.

| Feature | Credit Cost | Real Cost |
|---------|-------------|-----------|
| Premium TTS (1 min) | 5 credits | ~$0.02 |
| MetaHuman session (5 min) | 25 credits | ~$0.15 |
| Voice cloning setup | 100 credits | ~$0.50 |
| AI tutor extended session | 10 credits | ~$0.05 |

**Credit Packages:**
| Package | Credits | Price | Per-Credit |
|---------|---------|-------|------------|
| Starter | 100 | $0.99 | $0.0099 |
| Standard | 500 | $3.99 | $0.0080 |
| Premium | 1,500 | $9.99 | $0.0067 |
| Unlimited | ∞ | $19.99/mo | Subscription |

**Benefits:**
- Pay-as-you-go for occasional premium users
- Lower barrier than monthly subscription
- Usage visibility for cost control
- Path to subscription upgrade

**Database Tables Needed:**
```sql
-- user_credits (user_id, balance, last_updated)
-- credit_transactions (id, user_id, amount, type, feature, created_at)
-- credit_packages (id, name, credits, price_usd, price_ngn)
```

---

## DEPENDENCIES

### Requires
- Authentication system (for subscription association)
- Payment processor (Stripe/PayPal)
- Database migrations for subscription tables

### Enables
- Premium voice access (already built, needs gating)
- Assessment retry limits (needs enforcement)
- Verified certificates (needs blockchain integration - ARCH-2/3)
- Job matching features (needs implementation)

---

## VERIFICATION CHECKLIST

| # | Test | Status |
|---|------|--------|
| 1 | pricing.html loads without errors | PASS |
| 2 | Dark mode works | PASS |
| 3 | Mobile responsive | PASS |
| 4 | FAQ accordion functional | PASS |
| 5 | All CTAs have valid hrefs | PASS |
| 6 | Subscription actually works | NOT IMPLEMENTED |
| 7 | Payment processing works | NOT IMPLEMENTED |
| 8 | Premium features gated | NOT IMPLEMENTED |

---

## HANDOFF_DOCUMENT

*Empty - Awaiting requirements from Claude Web*

---

## RESEARCH_FINDINGS

*Empty - No implementation work done yet*

---

## SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 60 | 2025-12-17 | Initial audit completed |
| 64 | 2025-12-19 | Added Self-Hosted Premium tier based on Dell R740 infrastructure plan |
| 70 | 2025-12-22 | Added credit system for GPU features (from brainstorm) |

---

*Last Updated: 2025-12-22 (Session 70)*
