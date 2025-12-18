# PMERIT SUB-SCOPE: Payments & Subscriptions

**Version:** 1.0
**Created:** 2025-12-18
**Last Updated:** 2025-12-18
**Status:** PARTIALLY IMPLEMENTED (Database only)
**Phase:** Monetization
**Priority:** P2 - Revenue Foundation

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Subscription Tiers, Donations, Payment Processing |
| **Payment Provider** | Stripe (planned) |
| **Pages** | `pricing.html`, `donate.html`, `portal/subscription.html` (TBD) |
| **API Endpoints** | `/api/v1/payments/*`, `/api/v1/subscriptions/*` |
| **Database Tables** | `subscription_tiers`, `user_subscriptions`, `payments`, `donations` |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-18 | **Session:** 62 | **Auditor:** Claude Code

### Executive Summary

The payment system has **database foundation complete** (Session 61) but **no Stripe integration**. Subscription tables exist with 3 tiers seeded. Frontend pages exist but don't process payments.

### What EXISTS

#### Database Tables (Created Session 61)

| Table | Status | Records |
|-------|--------|---------|
| `subscription_tiers` | EXISTS | 3 tiers seeded |
| `user_subscriptions` | EXISTS | 0 records |
| `payments` | EXISTS | 0 records |
| `donations` | EXISTS | 0 records |
| `recurring_donations` | EXISTS | 0 records |
| `assessment_retry_fees` | EXISTS | 0 records |
| `feature_flags` | EXISTS | Feature gating ready |

#### Subscription Tiers (Seeded)

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0/month | Basic access, standard TTS |
| **Premium** | $9.99/month | Priority support, premium TTS voices |
| **Pay It Forward** | $19.99/month | Premium + sponsor another learner |

#### Frontend Pages

| Page | Status | Notes |
|------|--------|-------|
| `pricing.html` | EXISTS | Shows tiers, no payment |
| `donate.html` | EXISTS | Shows mission, no payment |

### What DOES NOT EXIST

| Component | Status | Impact |
|-----------|--------|--------|
| Stripe integration | NOT BUILT | Can't process payments |
| Checkout flow | NOT BUILT | Can't subscribe |
| Subscription management | NOT BUILT | Can't cancel/upgrade |
| Payment webhooks | NOT BUILT | No payment confirmation |
| Invoice generation | NOT BUILT | No receipts |
| Donation processing | NOT BUILT | Can't accept donations |

### Production Verification

```bash
# Pricing page loads
curl -s "https://pmerit.com/pricing" | head -50
# Works - shows pricing tiers

# Donate page loads
curl -s "https://pmerit.com/donate" | head -50
# Works - shows donation message

# No payment API endpoints exist yet
```

---

## 3. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| PAY-001 | Payment Provider | Stripe | Industry standard, good API | 50 |
| PAY-002 | Subscription Model | 3 tiers | Free, Premium, Pay It Forward | 50 |
| PAY-003 | Donation Model | One-time + Recurring | Flexibility for donors | 50 |
| PAY-004 | Free Tier | Full content access | Mission-aligned | 43 |
| PAY-005 | Premium Features | TTS voices, priority support | Not content-gated | 43 |

---

## 4. HANDOFF_DOCUMENT

### Subscription Tiers

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SUBSCRIPTION TIERS                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  FREE TIER ($0/month)                                               │
│  ─────────────────────                                              │
│  ✓ Full access to all courses                                       │
│  ✓ AI Tutor assistance                                              │
│  ✓ Progress tracking                                                │
│  ✓ Credentials & certificates                                       │
│  ✓ Standard TTS voices                                              │
│  ○ Community support only                                           │
│                                                                     │
│  PREMIUM TIER ($9.99/month)                                         │
│  ──────────────────────────                                         │
│  ✓ Everything in Free                                               │
│  ✓ Premium TTS voices (Primo, Primo-Female)                         │
│  ✓ Priority email support                                           │
│  ✓ Ad-free experience                                               │
│  ✓ Offline content download                                         │
│  ✓ Advanced analytics                                               │
│                                                                     │
│  PAY IT FORWARD ($19.99/month)                                      │
│  ─────────────────────────────                                      │
│  ✓ Everything in Premium                                            │
│  ✓ Sponsor a learner (your contribution funds another's access)     │
│  ✓ Sponsor badge on profile                                         │
│  ✓ Quarterly impact report                                          │
│  ✓ Community recognition                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Stripe Integration Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SUBSCRIPTION FLOW                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. User clicks "Upgrade to Premium" on pricing page                │
│     └── Must be logged in (redirect to auth if not)                 │
│                                                                     │
│  2. Frontend calls POST /api/v1/subscriptions/checkout              │
│     └── Body: { tier: 'premium' }                                   │
│     └── Backend creates Stripe Checkout Session                     │
│     └── Returns: { sessionId: 'cs_xxx', url: 'checkout.stripe.com'} │
│                                                                     │
│  3. User redirected to Stripe Checkout                              │
│     └── Enters payment details on Stripe-hosted page                │
│     └── Stripe handles PCI compliance                               │
│                                                                     │
│  4. On success, Stripe redirects to /subscription/success           │
│     └── Frontend shows confirmation                                 │
│                                                                     │
│  5. Stripe sends webhook to /api/v1/webhooks/stripe                 │
│     └── Event: checkout.session.completed                           │
│     └── Backend creates user_subscriptions record                   │
│     └── Backend updates users.subscription_tier                     │
│                                                                     │
│  6. User now has premium access                                     │
│     └── Premium TTS voices unlocked                                 │
│     └── Feature flags checked on each request                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Donation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DONATION FLOW                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ONE-TIME DONATION                                                  │
│  ─────────────────                                                  │
│  1. User visits /donate                                             │
│  2. Selects amount ($10, $25, $50, $100, Custom)                   │
│  3. Clicks "Donate Now"                                             │
│  4. Redirected to Stripe Checkout (donation mode)                   │
│  5. Payment processed                                               │
│  6. Thank you page + email receipt                                  │
│  7. donations table record created                                  │
│                                                                     │
│  RECURRING DONATION                                                 │
│  ──────────────────                                                 │
│  1. User selects "Make this monthly"                                │
│  2. Stripe creates subscription for donation                        │
│  3. recurring_donations table record created                        │
│  4. Monthly charges processed automatically                         │
│  5. User can cancel anytime                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### API Endpoints (Proposed)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/subscriptions/tiers` | Public | List available tiers |
| GET | `/api/v1/subscriptions/current` | User | Get user's subscription |
| POST | `/api/v1/subscriptions/checkout` | User | Create checkout session |
| POST | `/api/v1/subscriptions/portal` | User | Stripe customer portal |
| POST | `/api/v1/subscriptions/cancel` | User | Cancel subscription |
| POST | `/api/v1/donations/checkout` | Public | Create donation checkout |
| POST | `/api/v1/webhooks/stripe` | Stripe | Handle Stripe webhooks |

### Database Schema (Existing)

```sql
-- Subscription tiers (seeded)
subscription_tiers (
    tier_id UUID PRIMARY KEY,
    name VARCHAR(50), -- 'free', 'premium', 'pay_it_forward'
    display_name VARCHAR(100),
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    stripe_price_id_monthly VARCHAR(100),
    stripe_price_id_yearly VARCHAR(100),
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE
);

-- User subscriptions
user_subscriptions (
    subscription_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    tier_id UUID REFERENCES subscription_tiers(tier_id),
    stripe_subscription_id VARCHAR(100),
    stripe_customer_id VARCHAR(100),
    status VARCHAR(20), -- active, canceled, past_due
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE
);

-- Payment history
payments (
    payment_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    stripe_payment_intent_id VARCHAR(100),
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20),
    payment_type VARCHAR(20), -- subscription, donation, retry_fee
    created_at TIMESTAMPTZ
);

-- Donations
donations (
    donation_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id), -- NULL for anonymous
    amount DECIMAL(10,2),
    stripe_payment_intent_id VARCHAR(100),
    is_anonymous BOOLEAN DEFAULT FALSE,
    message TEXT,
    created_at TIMESTAMPTZ
);
```

### Environment Variables Required

```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_PREMIUM_MONTHLY=price_xxx
STRIPE_PRICE_PREMIUM_YEARLY=price_xxx
STRIPE_PRICE_PIF_MONTHLY=price_xxx
STRIPE_PRICE_PIF_YEARLY=price_xxx
```

---

## 5. RESEARCH_FINDINGS

### Session 61 (2025-12-18)

**Database Migration 006 Applied:**
- Created subscription_tiers table
- Created user_subscriptions table
- Created payments table
- Created donations table
- Created recurring_donations table
- Created feature_flags table
- Seeded 3 subscription tiers

**TTS Integration:**
- Premium voice check implemented
- TTS_TESTING_MODE bypasses subscription check
- Ready for Stripe integration

### Stripe Setup Required

1. Create Stripe account (if not exists)
2. Create Products in Stripe Dashboard:
   - Premium Monthly ($9.99)
   - Premium Yearly ($99.99)
   - Pay It Forward Monthly ($19.99)
   - Pay It Forward Yearly ($199.99)
3. Get Price IDs for each product
4. Configure webhook endpoint
5. Add environment variables

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | Auth system | User must be logged in to subscribe |
| **Requires** | Stripe account | Payment processor |
| **Enables** | SCOPE_TTS | Premium voices gated by subscription |
| **Enables** | SCOPE_NOTIFICATIONS | Payment confirmations |
| **Enables** | Revenue generation | Sustainability |

---

## 7. ACCEPTANCE CRITERIA

### Phase 1: Stripe Setup
- [ ] Stripe account configured
- [ ] Products and prices created in Stripe
- [ ] Environment variables added to Cloudflare
- [ ] Webhook endpoint configured

### Phase 2: Subscription Flow
- [ ] User can view pricing tiers
- [ ] User can initiate checkout
- [ ] Stripe Checkout completes payment
- [ ] Webhook updates user subscription
- [ ] User sees premium features unlocked

### Phase 3: Subscription Management
- [ ] User can view current subscription
- [ ] User can access Stripe customer portal
- [ ] User can cancel subscription
- [ ] Canceled users retain access until period end
- [ ] Downgrade removes premium features

### Phase 4: Donations
- [ ] One-time donation checkout works
- [ ] Recurring donation option available
- [ ] Anonymous donations supported
- [ ] Thank you page displays
- [ ] Receipt email sent

---

## 8. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 50 | 2025-12-12 | Architecture decisions made |
| 61 | 2025-12-18 | Database migration 006 applied |
| 62 | 2025-12-18 | Scope file created |

---

*Last Updated: 2025-12-18 (Session 62)*
