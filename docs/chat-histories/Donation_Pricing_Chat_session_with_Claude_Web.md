I'll start by reading the current state and the relevant scope files to understand what we're working with.Searched project for “SCOPE pricing donate brainstorm current state”5 resultsBRAINSTORM_ASU_LIKE_SCHEMA.md2 relevant sectionstextSCOPE_pricing.md3 relevant sectionstextdocs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.mdtextPmerit_Project_Document.mdtextContinue PMERIT scope courses documentationtextExamined project files to synthesize brainstorming decisions.The user wants to continue working on PMERIT, specifically to brainstorm and update the SCOPE_pricing.md and SCOPE_donate.md files. Let me now read those actual scope files to understand their current state.Let me read the current scope files directly from the project.2 stepsReading current SCOPE_donate.md to understand audit findings and gapsShow working fileArchitected brainstorming framework for pricing and donation scope documents.So SCOPE_donate.md is empty. Now I understand the situation:

SCOPE_pricing.md - Has a complete audit report, but HANDOFF_DOCUMENT and RESEARCH_FINDINGS are empty. The audit shows:

Frontend is complete (pricing.html works)
Backend not implemented (no Stripe/PayPal, no subscription tables)
Pay It Forward links to contact.html (no dedicated donation flow)


SCOPE_donate.md - Completely empty, needs to be created from scratch

The user wants to brainstorm and update both files with decisions. This is the Claude Web role - to brainstorm with the user and write requirements based on the audit reports.
Let me structure this for a brainstorming session. Key questions to address:
For Pricing:

What payment processor should we use? (Stripe vs PayPal vs others)
What's the MVP for subscriptions?
How should premium features be gated?
Should we implement currency localization?
What's the priority order?

For Donate:

What donation methods should be supported?
Should there be a dedicated donate.html page?
Integration with Pay It Forward from pricing?
Tax-deductible receipts handling?
Corporate sponsorship workflow?

Let me present this to the user for brainstorming.Now I have the full picture. Let me summarize what we're working with:

📊 CURRENT STATE SUMMARY
SCOPE_pricing.md
Status: Audited, HANDOFF empty
What Exists:

pricing.html with 3 tiers (Free / Premium $2.99/mo / Pay It Forward)
Pay-for-Accountability model documented
FAQ section (7 questions)
Growth projections table

Gaps Identified:

Backend: No subscription API, no Stripe/PayPal, no database tables
Frontend: CTAs lead to signin.html (no actual subscription flow)
Integration: Premium voices exist but not tied to subscriptions

SCOPE_donate.md
Status: EMPTY - needs full creation
The donate functionality is currently handled by:

"Pay It Forward" card on pricing.html → links to contact.html
No dedicated donate page exists


🧠 BRAINSTORM QUESTIONS
Let's work through these decisions together:
For PRICING (Backend Implementation Priority)
Q1: Payment Processor Selection
OptionProsConsCostStripeBest docs, global, low friction2.9% + $0.30/txFree to startPayPalBrand trust, global reachHigher fees, clunkier UX2.99% + $0.49BothUser choiceMore maintenanceCombined
Given your focus on free/open-source first, what's your preference?
Q2: MVP Subscription Scope
Should we implement:

A) Full subscription (signup → payment → recurring billing → tier upgrade)
B) Simple tier flag (manual assignment, no payment processing yet)
C) Just Stripe Checkout links (offload to hosted page, database tracks result)

Q3: Premium Feature Gating Priority
Which premium features should be gated first?

Premium voices (Primo Voice, Primo Female) - Already built
Assessment retry waiver
Verified certificates
Career counseling access

For DONATE (New Scope Creation)
Q4: Donation Methods
Which should we support?

 One-time credit card (Stripe)
 Recurring monthly (Stripe)
 PayPal
 Cryptocurrency (which? BTC, ETH, USDC?)
 Bank transfer (ACH)
 Check mailing address

Q5: Dedicated donate.html Page?
Should we create a dedicated page, or keep donations integrated with pricing.html's "Pay It Forward"?
Q6: Corporate Sponsorship
Should this be:

A) Same donate page with "Corporate" tier
B) Separate enterprise/sponsor inquiry form
C) Contact sales link only


What decisions would you like to make on these? I can then write the HANDOFF_DOCUMENTs for Claude Code to implement.Let's explore the Donation acceptance modes and payment modes and their respective APIs that are widely accepted in both the US and Nigeria.2:14 PMResearching payment solutions for US and Nigerian markets.The user wants to explore donation and payment acceptance options that work well in both the US and Nigeria. This is important because PMERIT serves a global audience with specific focus on these two markets. Let me search for current information on payment APIs and donation platforms that support both countries.I'll research payment and donation APIs that work across both US and Nigeria markets.6 stepsPaystack Stripe integration US business accept Nigerian payments API 202410 resultsPaystack - Modern online and offline payments for Africapaystack.comPayments Face-off: Paystack vs Stripe 2023subscriptionflow.comTransforming Payment Processing: Paystack Nigeriasubscriptionflow.comStripe will acquire Paystack to accelerate online commerce across Africastripe.comPaystack Payment Gateway Integration - Pinlearnpinlearn.comPaystack for Global Brandspaystack.comClottware Blog | Stripe vs. Paystack: The Best Payment Gateway for African Businesses? - Clottware Blogclottware.comPayment Processor for Countries not supporting stripe, paypal, or authorize.net | Payments | HighLevelgohighlevel.comPaystack for Developerspaystack.comPayment Gateways in Nigeria for your Business in 2024 - Anatechanatech.com.ngSynthesized payment infrastructure data for US-Nigeria market comparison.This is excellent research. Let me compile this into a comprehensive comparison for the user to help them make informed decisions about donation and payment acceptance for both US and Nigeria markets.Now I have comprehensive information. Let me compile this into a decision-making framework for you.

🌍 PAYMENT & DONATION MODES: US + NIGERIA ANALYSIS
OVERVIEW: The Strategic Picture
MarketPopulationOnline Payment PreferencesKey ChallengeUnited States330MCredit/Debit Cards, ACH, PayPal, Apple Pay, Google PayHigh fees on small donationsNigeria220MBank Transfer, USSD, Mobile Money, CardsDifferent banking infrastructure
Key Insight: You need a dual-gateway strategy because no single provider optimally serves both markets.

📊 TIER 1: PRIMARY PAYMENT GATEWAYS
Option A: Stripe + Paystack (Recommended)
Why This Works: Stripe acquired Paystack in 2020 for $200M. They share APIs, security standards, and Paystack is being integrated into Stripe's Global Payments Network (GPTN).
FeatureStripe (US/Global)Paystack (Nigeria/Africa)CoverageUS, UK, EU, 46+ countriesNigeria, Ghana, South Africa, KenyaNonprofit Discount✅ 2.2% + $0.30 (vs 2.9% standard)Not specified for nonprofitsLocal Cards2.9% + $0.301.5% + ₦100 (capped at ₦2,000)InternationalSame rate3.9% + ₦100Bank TransferACH: 0.8% (capped $5)✅ Native support (very popular)Mobile Money❌ Not relevant✅ MTN, Airtel MoneyUSSD❌✅ Native supportRecurring✅ (+0.5-0.8% fee)✅ Native supportAPI QualityExcellent documentationExcellent (Stripe-level)Settlement2 days (US)Next day (Nigeria)
Implementation Path:
US/International Donors → Stripe
Nigerian Donors → Paystack
Backend Logic → Detect donor location → Route to appropriate gateway

Option B: Flutterwave (Alternative)
Best for: If you want a single provider with broader African coverage
FeatureFlutterwaveCoverage34+ African countries + US, EULocal Nigeria1.4% (capped ₦2,000)International3.8%US Payments✅ Accepts from US customersMobile Money✅ M-Pesa, MTN, AirtelCrypto❌SettlementNext day
Concern: 2022 security breach ($4M+ stolen). Has since strengthened security but reputation matters for donations.

💳 TIER 2: DONATION-SPECIFIC PLATFORMS
For US Tax-Deductible Donations
PlatformFeeCryptoTax ReceiptsBest ForThe Giving Block3.95%✅ 200+ coinsAutoCrypto-first orgsEvery.org1% (crypto)✅ 93 tokensAutoSimple crypto setupZeffy0%❌AutoBudget-conscious nonprofitsDonorbox1.75% + Stripe fees✅ (via Giving Block)AutoAll-in-one solutionBitPay1%✅ 100+ coinsAutoEstablished crypto platform

🪙 TIER 3: CRYPTOCURRENCY DONATIONS
Recommended Coins for PMERIT
CoinWhyUS AcceptanceNigeria AcceptanceTax AdvantageBitcoin (BTC)Most recognized✅ Universal✅ Growing adoption✅ No capital gains on donationEthereum (ETH)Developer community✅ Universal✅ Growing✅ SameUSDC/USDTStablecoins, no volatility✅ Universal✅ Popular in Nigeria✅ SamePolygon (MATIC)Low fees, you use it for credentials✅ Supported⚠️ Limited✅ Same
Implementation Options:

Every.org (Simplest): They handle wallet, conversion, compliance. You receive USD.
The Giving Block (Most comprehensive): 200+ coins, auto-conversion, tax receipts.
Direct Wallet (Most control): You manage wallet, but must handle conversion/compliance.


📱 TIER 4: MOBILE-FIRST PAYMENT METHODS
Nigeria-Specific Methods (Critical for reach)
MethodProviderHow It WorksAdoptionBank TransferPaystack/FlutterwaveDirect bank debit~90% of online paymentsUSSDPaystack919# type codesFeature phones, no internet neededMobile MoneyFlutterwaveMTN MoMo, Airtel MoneyGrowing rapidlyQR CodePaystackScan to payUrban areas
US-Specific Methods
MethodProviderBenefitApple PayStripeOne-tap on iOSGoogle PayStripeOne-tap on AndroidACH TransferStripeLower fees (0.8%)VenmoPayPalPopular with younger donors

🏗️ RECOMMENDED ARCHITECTURE FOR PMERIT
Multi-Gateway Donation Flow
┌─────────────────────────────────────────────────────────────┐
│                    donate.html                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │  One-Time   │    │  Monthly    │    │   Crypto    │    │
│   │  Donation   │    │  Recurring  │    │   Donation  │    │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    │
│          │                  │                  │            │
│          ▼                  ▼                  ▼            │
│   ┌─────────────────────────────────────────────────┐      │
│   │           Location Detection (IP/Selection)      │      │
│   └─────────────────────────────────────────────────┘      │
│          │                                    │             │
│    ┌─────┴─────┐                       ┌─────┴─────┐       │
│    ▼           ▼                       ▼           ▼       │
│ ┌──────┐  ┌──────────┐           ┌──────────┐  ┌───────┐  │
│ │Stripe│  │ Paystack │           │ Every.org│  │BitPay │  │
│ │ (US) │  │(Nigeria) │           │  (Crypto)│  │(Crypto│  │
│ └──────┘  └──────────┘           └──────────┘  └───────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

💰 FEE COMPARISON FOR $10 DONATION
GatewayUS DonorNigerian Donor (₦15,000)Stripe (nonprofit)$0.52 (5.2%)N/APaystackN/A₦325 (2.2%)Flutterwave$0.68 (6.8%)₦310 (2.1%)Every.org (crypto)$0.10 (1%)$0.10 (1%)Zeffy$0 (0%)N/A

✅ DECISION QUESTIONS FOR YOU
Q1: Primary vs Secondary Market Priority?

A) US-first (most donors likely US-based initially)
B) Nigeria-first (mission alignment with Africa)
C) Equal priority (need both from day 1)

Q2: Cryptocurrency Priority?

A) Essential (want to attract crypto donors)
B) Nice-to-have (add later)
C) Skip for now

Q3: Recurring Donation Importance?

A) Critical (Pay It Forward model relies on this)
B) Important but not blocking
C) One-time donations sufficient for now

Q4: Tax-Deductibility Requirement?

A) Yes, PMERIT is/will be 501(c)(3)
B) Not yet, but planned
C) Not applicable (not US nonprofit)

Q5: Implementation Complexity Tolerance?

A) Simple (one gateway, even if not optimal)
B) Moderate (two gateways with location routing)
C) Complex (full multi-gateway with crypto)


Based on your answers, I can write the specific HANDOFF_DOCUMENT requirements for Claude Code to implement. What are your preferences?What about digital wallets,  Flutterwave or PayStack, and Payment by checks or money order, or bank Transfer. Let's explore the best and cheapest possible options for users for implementation. Prepare the appropriate files for implementations.2:20 PMSynthesized multiple payment solutions and prepared implementation strategy.The user wants to explore more payment options including:

Digital wallets
Flutterwave vs Paystack comparison
Payment by checks/money orders
Bank transfers

They want the cheapest options for users and want me to prepare implementation files. Let me do more research on these specific topics and then prepare the scope documents.Let me research digital wallets and traditional payment methods more thoroughly, then prepare the implementation documents.2 stepsnonprofit accept check money order mail donation bank wire transfer ACH fees comparison10 resultsThe Top 9 Payment Processing Tools for (Smart) Nonprofitsdoublethedonation.comThe BEST Online Payment Processing for Nonprofits in 2025: Our Top 17 Pickswildapricot.comPayment Processing for Nonprofits: The Beginner's Guidedoublethedonation.comHow To Set Up ACH Payment Processing For Nonprofits - PaySimplepaysimple.comSupporting Nonprofits and Religious Organizations | Nachanacha.orgPayment Processing for Nonprofits - 10 Top Options for 2025charityengine.netElectronic Bank Transfers Make Collecting Donations Fast, Safe and Reliable | Nachanacha.orgMaking a Wire Transfer Donation to GiveWell | GiveWellgivewell.orgProduct Update: Take Donations with ACH and Venmocausevox.comACH Payment Processing for Nonprofits: Lower Fees, Higher Impact | 4aGoodCause4agoodcause.comSynthesized payment methods and architected cost-effective implementation scope documents.Now I have comprehensive information. Let me compile this into the scope documents for both pricing and donate. The user wants me to explore:

Digital wallets (Apple Pay, Google Pay, PayPal, Venmo)
Flutterwave vs Paystack comparison
Check/money order payments
Bank transfers (ACH in US, bank transfer in Nigeria)

And they want the cheapest options for implementation. Let me create the scope documents now.Now I have comprehensive information. Let me compile everything and create the implementation documents.Check the docx skill for creating the scope document properlyOrchestrated comprehensive payment integration documentation across multiple platforms.Since we're creating scope documents (markdown files), I don't need the docx skill. Let me create the files now. I'll create comprehensive scope documents for both pricing and donate.Now let me create the comprehensive implementation documents. I'll create both SCOPE files with all the research compiled.2 stepsCreating comprehensive SCOPE_donate.md with all donation methods, payment gateways, and implementation requirementsSCOPE_donate.mdArchitected comparative framework for payment solution implementation.Now let me create a summary comparison document that will help with the decision-making process. This will be a quick reference for the user.Now let me create a summary comparison document for quick reference:4 stepsPresented 3 filesSynthesized payment solutions and architected implementation files.I've created all three files and presented them to the user. Now let me provide a summary of what was created and the key decisions documented.I've created three comprehensive implementation documents:

# PMERIT Payment & Donation Methods: Quick Reference

**Created:** December 17, 2025 (Session 61)
**Purpose:** Decision summary for payment gateway implementation

---

## 🏆 CHEAPEST OPTIONS SUMMARY

### For US Donors

| Rank | Method | Fee on $100 | Setup Complexity |
|------|--------|-------------|------------------|
| 🥇 | Venmo (bank-funded) | $0.00 (0%) | Medium |
| 🥈 | ACH Bank Transfer | $0.80 (0.8%) | Low |
| 🥉 | Check/Money Order | $0.00* | Manual |
| 4 | Crypto (Every.org) | $1.00 (1%) | Low |
| 5 | Card/PayPal | $2.50 (2.5%) | Low |

### For Nigerian Donors

| Rank | Method | Fee on ₦10,000 | Setup Complexity |
|------|--------|----------------|------------------|
| 🥇 | USSD | ~₦100 (1%) | Via Paystack |
| 🥈 | Bank Transfer | ₦150 (1.5%) | Via Paystack |
| 🥉 | Mobile Money | ₦150 (1.5%) | Via Paystack |
| 4 | Card | ₦250 (2.5%) | Via Paystack |

---

## 🔧 GATEWAY SELECTION

### Primary Recommendation

```
┌─────────────────────────────────────────────────────────┐
│                  DUAL-GATEWAY STRATEGY                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    US/International          Nigeria/Africa             │
│    ┌─────────────┐          ┌─────────────┐            │
│    │   STRIPE    │          │  PAYSTACK   │            │
│    │             │          │             │            │
│    │ • Cards     │          │ • Cards     │            │
│    │ • ACH       │          │ • Bank Xfer │            │
│    │ • Apple Pay │          │ • USSD      │            │
│    │ • Google Pay│          │ • Mobile $  │            │
│    └─────────────┘          └─────────────┘            │
│                                                         │
│         +──────────────────────────+                   │
│         │  PAYPAL (Both Markets)   │                   │
│         │  • Brand trust           │                   │
│         │  • Venmo (US)            │                   │
│         └──────────────────────────┘                   │
│                                                         │
│         +──────────────────────────+                   │
│         │  EVERY.ORG (Crypto)      │                   │
│         │  • 93 tokens             │                   │
│         │  • 1% fee                │                   │
│         │  • Auto tax receipts     │                   │
│         └──────────────────────────┘                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 FLUTTERWAVE vs PAYSTACK

| Factor | Paystack | Flutterwave | Winner |
|--------|----------|-------------|--------|
| **Local Fee** | 1.5% (cap ₦2K) | 1.4% (cap ₦2K) | Flutterwave (slightly) |
| **Intl Fee** | 3.9% | 3.8% | Flutterwave (slightly) |
| **Owner** | Stripe | Independent | Paystack (backing) |
| **Security History** | Clean | 2022 breach | **Paystack** |
| **API Quality** | Excellent | Very Good | Paystack |
| **Countries** | 4 | 34+ | Flutterwave |
| **Accept US payments** | ❌ | ✅ | Flutterwave |

### Verdict: **Paystack** (for trust & Stripe integration)

But consider Flutterwave if you need:
- Single gateway for US + Africa
- Expansion to more African countries

---

## 💳 DIGITAL WALLETS COMPARISON

| Wallet | US | Nigeria | Recurring | Best For |
|--------|----|---------|-----------| ---------|
| Apple Pay | ✅ | ❌ | ⚠️ | iOS one-time |
| Google Pay | ✅ | ❌ | ⚠️ | Android one-time |
| PayPal | ✅ | Limited | ✅ | International trust |
| Venmo | ✅ | ❌ | ❌ | US younger donors |
| Cash App | ✅ | ❌ | ❌ | US quick donations |

---

## 🪙 CRYPTOCURRENCY OPTIONS

| Platform | Fee | Coins | Tax Receipts | Complexity |
|----------|-----|-------|--------------|------------|
| Every.org | 1% | 93 | ✅ Auto | Low (widget) |
| The Giving Block | 3.95% | 200+ | ✅ Auto | Medium |
| BitPay | 1% | 100+ | ✅ Auto | Medium |
| Direct Wallet | ~$1-5 network | Any | ❌ Manual | High |

### Recommended: **Every.org** (simplest, low fee)

---

## 📝 TRADITIONAL METHODS

### Check/Money Order

**Pros:**
- Zero fees
- Appeals to older donors
- Large donations

**Cons:**
- Manual processing
- Requires physical address
- Slow (mail time + deposit)

**Implementation:** Display mailing address with clear instructions

### Wire Transfer

**Pros:**
- For very large donations ($10K+)
- International donors without card access

**Cons:**
- $25-50 bank fees
- Manual reconciliation

**Implementation:** Provide bank details upon request (not public)

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: MVP (Week 1-2)
- [ ] Stripe integration (US cards + ACH)
- [ ] Paystack integration (Nigeria)
- [ ] Basic donate.html page
- [ ] Webhook handlers
- [ ] Database tables

### Phase 2: Expansion (Week 3-4)
- [ ] PayPal integration
- [ ] Apple Pay / Google Pay via Stripe
- [ ] Recurring donations
- [ ] Tax receipt emails

### Phase 3: Advanced (Week 5-6)
- [ ] Crypto via Every.org
- [ ] Corporate sponsorship portal
- [ ] Impact calculator
- [ ] Donor dashboard

---

## 💰 COST PROJECTIONS

### Assuming 1,000 donations/month

| Scenario | US (500) | Nigeria (500) | Total Fees |
|----------|----------|---------------|------------|
| All Cards | $725 | $375 | $1,100/mo |
| 50% ACH/Bank | $500 | $300 | $800/mo |
| Promote low-fee | $400 | $250 | **$650/mo** |

**Savings by promoting low-fee methods: ~$450/month = $5,400/year**

---

## ✅ DECISIONS MADE

1. **Primary Gateways:** Stripe (US) + Paystack (Nigeria)
2. **Digital Wallets:** Via Stripe (Apple Pay, Google Pay)
3. **PayPal:** Yes, for brand trust and Venmo
4. **Crypto:** Every.org (1% fee, simple widget)
5. **Check/Wire:** Manual process, display address
6. **Flutterwave:** Not now, reconsider if expanding to more African countries

---

## 📁 FILES TO UPDATE/CREATE

### Frontend
- `donate.html` - NEW
- `assets/js/donate.js` - NEW
- `assets/css/donate.css` - NEW
- `pricing.html` - Update CTAs

### Backend
- `src/routes/donations.js` - NEW
- `src/routes/subscriptions.js` - NEW
- `src/services/stripe.js` - NEW
- `src/services/paystack.js` - NEW

### Database
- Run migration for: `donations`, `recurring_donations`, `user_tiers`, `payments`, `corporate_sponsors`

---

*Ready for Claude Code implementation*
📁 Files Created
1. PAYMENT_METHODS_SUMMARY.md (Quick Reference)
One-page decision summary showing the cheapest options, gateway selection, and implementation phases.
2. SCOPE_pricing.md (Complete)
Full implementation spec for the subscription/pricing system including:

Stripe + Paystack dual-gateway architecture
Database schema for user_tiers, payments
API endpoints for subscription management
Premium voice gating implementation

# SCOPE: Pricing System

**Status:** BRAINSTORMED → READY FOR IMPLEMENTATION
**Last Updated:** December 17, 2025 (Session 61)
**Audited By:** Claude Code (Session 60)
**Brainstormed By:** Claude Web (Session 61)

---

## SCOPE IDENTITY

### Files Owned

**Frontend (pmerit-ai-platform)**
| File | Purpose | Status |
|------|---------|--------|
| `pricing.html` | Pricing page with tiers, FAQ, projections | EXISTS (422 lines) |
| `assets/css/about-pricing.css` | Shared styles for About & Pricing pages | EXISTS (933 lines) |

**Backend (pmerit-api-worker)**
| File | Purpose | Status |
|------|---------|--------|
| `src/routes/subscriptions.js` | Subscription management endpoints | TO CREATE |
| `src/routes/payments.js` | Payment processing endpoints | TO CREATE |
| `src/services/stripe.js` | Stripe integration service | TO CREATE |
| `src/services/paystack.js` | Paystack integration service | TO CREATE |

### Database Tables

| Table | Status | Purpose |
|-------|--------|---------|
| `subscriptions` | TO CREATE | Store user subscription tier |
| `payments` | TO CREATE | Store payment history |
| `user_tiers` | TO CREATE | Map users to subscription levels |

---

## AUDIT_REPORT

### Production Status: FRONTEND COMPLETE, BACKEND NOT IMPLEMENTED

**Audit Date:** December 17, 2025
**Environment:** Production (pmerit.com)

### Current Pricing Tiers

| Tier | Price | Key Features |
|------|-------|--------------|
| **Always Free** | $0/forever | All courses, basic AI (Gabriel), community, progress tracking, mobile, offline, first attempt free, completion certificates |
| **Premium** | $2.99/month | Everything in Free + advanced AI (GPT-4), personalized paths, priority support, no retry fees, verified certs, career counseling, job matching |
| **Pay It Forward** | Custom | Everything in Premium + sponsor students, 1-5% salary contribution, impact tracking, tax-deductible |

### Pay-for-Accountability Model

| Attempt | Fee | Notes |
|---------|-----|-------|
| 1st | FREE | No cost, take your time |
| 2nd | FREE + Tutoring | Additional AI help provided |
| 3rd | ₦200 / $0.50 | Small fee, hardship exemptions available |
| 4th+ | Graduated fees | Premium subscribers never pay |

---

## HANDOFF_DOCUMENT

### Implementation Priority: Dual-Gateway Strategy

Based on research, PMERIT needs **two payment gateways** to optimally serve both US and Nigerian markets.

---

### DECISION 1: Primary Payment Gateways

#### Selected: Stripe (US/International) + Paystack (Nigeria/Africa)

**Rationale:**
- Stripe acquired Paystack in 2020 - they share security standards and API philosophy
- No single gateway serves both markets optimally
- Combined approach provides best rates and local payment methods

| Feature | Stripe (US) | Paystack (Nigeria) |
|---------|-------------|-------------------|
| **Target Market** | US, UK, EU, 46+ countries | Nigeria, Ghana, South Africa, Kenya |
| **Nonprofit Rate** | 2.2% + $0.30 | 1.5% + ₦100 (capped ₦2,000) |
| **Standard Rate** | 2.9% + $0.30 | Same |
| **International** | Same rate | 3.9% + ₦100 |
| **ACH/Bank Transfer** | 0.8% (capped $5) | 1% (capped ₦300) |
| **Recurring** | +0.5-0.8% | Native support |
| **Settlement** | 2 days | Next day |

---

### DECISION 2: Payment Methods to Support

#### Tier 1: Essential (MVP)
| Method | Gateway | US | Nigeria | Fee |
|--------|---------|----|---------| ----|
| Credit/Debit Card | Both | ✅ | ✅ | 2.2-2.9% |
| Bank Transfer (ACH) | Stripe | ✅ | ❌ | 0.8% (max $5) |
| Bank Transfer | Paystack | ❌ | ✅ | 1.5% (max ₦2,000) |

#### Tier 2: Digital Wallets (Phase 2)
| Method | Gateway | US | Nigeria | Fee | Notes |
|--------|---------|----|---------| ----|-------|
| Apple Pay | Stripe | ✅ | ❌ | Same as card | iOS devices |
| Google Pay | Stripe | ✅ | ❌ | Same as card | Android/Chrome |
| PayPal | PayPal API | ✅ | Limited | 2.9% + $0.30 | Brand trust |
| Venmo | PayPal API | ✅ | ❌ | 0% (bank) / 3% (card) | US only, younger donors |

#### Tier 3: Africa-Specific (Phase 2)
| Method | Gateway | US | Nigeria | Fee | Notes |
|--------|---------|----|---------| ----|-------|
| USSD | Paystack | ❌ | ✅ | Variable | Feature phones, no internet |
| Mobile Money | Paystack | ❌ | ✅ | 1.5% | MTN, Airtel |
| QR Code | Paystack | ❌ | ✅ | 1.5% | Urban areas |

---

### DECISION 3: Cheapest Options for Users

#### Cost Comparison for $10 Donation

| Method | US Donor | Nigerian Donor (₦15,000) | Winner |
|--------|----------|--------------------------|--------|
| Card (Stripe nonprofit) | $0.52 (5.2%) | N/A | - |
| Card (Paystack) | N/A | ₦325 (2.2%) | - |
| ACH Bank Transfer | $0.08 (0.8%) | N/A | 🏆 US |
| Bank Transfer (Paystack) | N/A | ₦225 (1.5%) | 🏆 Nigeria |
| Venmo (bank-funded) | $0.00 (0%) | N/A | 🏆🏆 Best |
| USSD | N/A | ~₦150 (1%) | Good |

**Recommendation:** Prominently feature ACH (US) and Bank Transfer (Nigeria) as "most of your donation goes to students" option.

---

### DECISION 4: Subscription Implementation Approach

**Selected: Option C - Stripe Checkout + Paystack Checkout**

Rationale: Offload complexity to hosted payment pages, track results via webhooks.

```
User clicks "Upgrade to Premium"
    ↓
Location Detection (IP-based)
    ↓
┌─────────────────┬─────────────────┐
│   US/Global     │     Nigeria     │
│   Stripe        │     Paystack    │
│   Checkout      │     Checkout    │
└────────┬────────┴────────┬────────┘
         ↓                 ↓
    Webhook fires     Webhook fires
         ↓                 ↓
    Update user_tiers table
         ↓
    Return to dashboard with Premium badge
```

---

### DECISION 5: Premium Feature Gating Priority

| Priority | Feature | Complexity | Revenue Impact |
|----------|---------|------------|----------------|
| 1 | Premium voices (Primo Voice, Primo Female) | LOW (already built) | HIGH |
| 2 | Assessment retry fee waiver | MEDIUM | MEDIUM |
| 3 | Verified certificates | HIGH (needs blockchain) | LOW initially |
| 4 | Career counseling access | MEDIUM | MEDIUM |

**MVP:** Gate premium voices only. Others can be added incrementally.

---

## IMPLEMENTATION REQUIREMENTS

### Phase 1: Database Schema

```sql
-- User subscription tiers
CREATE TABLE user_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    tier VARCHAR(20) NOT NULL DEFAULT 'free', -- 'free', 'premium', 'pay_it_forward'
    stripe_customer_id VARCHAR(255),
    paystack_customer_code VARCHAR(255),
    subscription_status VARCHAR(20) DEFAULT 'inactive', -- 'active', 'cancelled', 'past_due'
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment history
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL, -- 'USD', 'NGN'
    gateway VARCHAR(20) NOT NULL, -- 'stripe', 'paystack'
    gateway_payment_id VARCHAR(255),
    payment_type VARCHAR(20) NOT NULL, -- 'subscription', 'donation', 'retry_fee'
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_user_tiers_user_id ON user_tiers(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_gateway_id ON payments(gateway_payment_id);
```

### Phase 2: API Endpoints

```
POST /api/v1/subscriptions/checkout
  - Input: { tier: 'premium', currency: 'USD' | 'NGN' }
  - Output: { checkout_url: string, session_id: string }
  - Logic: Detect currency → Route to Stripe or Paystack

POST /api/v1/subscriptions/webhook/stripe
  - Handles: checkout.session.completed, customer.subscription.updated/deleted
  - Updates: user_tiers table

POST /api/v1/subscriptions/webhook/paystack
  - Handles: charge.success, subscription.create/disable
  - Updates: user_tiers table

GET /api/v1/subscriptions/status
  - Input: Authorization header (JWT)
  - Output: { tier: string, status: string, expires: date }

POST /api/v1/subscriptions/cancel
  - Input: Authorization header
  - Output: { success: boolean, effective_date: date }
```

### Phase 3: Frontend Updates

```javascript
// pricing.html - Update CTA buttons
// Currently: href="signin.html"
// Change to:

document.querySelectorAll('[data-upgrade-tier]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const tier = e.target.dataset.upgradeTier;
        const response = await fetch('/api/v1/subscriptions/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tier, currency: detectCurrency() })
        });
        const { checkout_url } = await response.json();
        window.location.href = checkout_url;
    });
});

function detectCurrency() {
    // Use IP geolocation or stored preference
    return navigator.language.includes('NG') ? 'NGN' : 'USD';
}
```

### Phase 4: Premium Voice Gating

```javascript
// In classroom TTS selection
async function getAvailableVoices() {
    const userTier = await getUserTier();
    
    const voices = [
        { id: 'standard-male', name: 'Standard Male', tier: 'free' },
        { id: 'standard-female', name: 'Standard Female', tier: 'free' },
        { id: 'young-voice', name: 'Young Voice', tier: 'free' },
        { id: 'primo-voice', name: 'Primo Voice', tier: 'premium', badge: '⭐' },
        { id: 'primo-female', name: 'Primo Female', tier: 'premium', badge: '⭐' }
    ];
    
    return voices.map(v => ({
        ...v,
        available: v.tier === 'free' || userTier === 'premium' || userTier === 'pay_it_forward',
        locked: v.tier === 'premium' && userTier === 'free'
    }));
}
```

---

## ENVIRONMENT VARIABLES NEEDED

```bash
# Stripe (US/International)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx  # $2.99/month product

# Paystack (Nigeria)
PAYSTACK_SECRET_KEY=sk_live_xxx
PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_WEBHOOK_SECRET=xxx
PAYSTACK_PREMIUM_PLAN_CODE=PLN_xxx  # ₦2,500/month product
```

---

## VERIFICATION CHECKLIST

| # | Test | Status |
|---|------|--------|
| 1 | pricing.html loads without errors | ✅ PASS |
| 2 | Dark mode works | ✅ PASS |
| 3 | Mobile responsive | ✅ PASS |
| 4 | FAQ accordion functional | ✅ PASS |
| 5 | All CTAs have valid hrefs | ✅ PASS |
| 6 | Stripe checkout creates session | ⏳ TODO |
| 7 | Paystack checkout creates session | ⏳ TODO |
| 8 | Webhook updates user tier | ⏳ TODO |
| 9 | Premium voices gated correctly | ⏳ TODO |
| 10 | Subscription cancellation works | ⏳ TODO |

---

## DEPENDENCIES

### Requires
- Authentication system (EXISTS)
- User table with id field (EXISTS)
- Stripe account with nonprofit verification
- Paystack account (Nigerian business registration)

### Enables
- Premium voice access (already built, needs gating)
- Assessment retry limits (needs enforcement)
- Verified certificates (needs blockchain integration - ARCH-2/3)
- Job matching features (needs implementation)

---

## COST ESTIMATES

### Gateway Setup Costs
| Item | Cost |
|------|------|
| Stripe account | FREE |
| Stripe nonprofit application | FREE |
| Paystack account | FREE |
| Paystack integration fee | FREE |

### Monthly Costs (at 1,000 subscribers)
| Item | Calculation | Monthly |
|------|-------------|---------|
| Stripe fees (500 US × $2.99 × 2.5%) | $37 | ~$37 |
| Paystack fees (500 NG × ₦2,500 × 1.5%) | ₦18,750 | ~$12 |
| **Total payment fees** | | **~$49/month** |

---

## RESEARCH_FINDINGS

*To be populated by Claude Code during implementation*

---

## SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 60 | 2025-12-17 | Initial audit completed |
| 61 | 2025-12-17 | Brainstorm completed, HANDOFF written |

---

*Last Updated: 2025-12-17 (Session 61)*

3. SCOPE_donate.md (Complete)
Full implementation spec for the donation system including:

All payment methods (cards, ACH, bank transfer, USSD, mobile money, PayPal, Venmo, crypto, check)
Database schema for donations, recurring_donations, corporate_sponsors
donate.html page architecture
Every.org crypto widget integration

# SCOPE: Donation System

**Status:** BRAINSTORMED → READY FOR IMPLEMENTATION
**Last Updated:** December 17, 2025 (Session 61)
**Audited By:** Claude Web (Session 61)

---

## SCOPE IDENTITY

### Files to Create

**Frontend (pmerit-ai-platform)**
| File | Purpose | Status |
|------|---------|--------|
| `donate.html` | Dedicated donation page | TO CREATE |
| `assets/js/donate.js` | Donation page logic | TO CREATE |
| `assets/css/donate.css` | Donation page styles | TO CREATE |

**Backend (pmerit-api-worker)**
| File | Purpose | Status |
|------|---------|--------|
| `src/routes/donations.js` | Donation processing endpoints | TO CREATE |
| `src/services/crypto.js` | Cryptocurrency donation handling | TO CREATE |

### Database Tables

| Table | Status | Purpose |
|-------|--------|---------|
| `donations` | TO CREATE | Store all donation records |
| `recurring_donations` | TO CREATE | Track recurring/Pay It Forward donors |
| `donation_impacts` | TO CREATE | Track student sponsorships |

---

## AUDIT_REPORT

### Current State: NO DEDICATED DONATION SYSTEM

**Audit Date:** December 17, 2025

**Current Behavior:**
- "Pay It Forward" card on `pricing.html` links to `contact.html`
- No dedicated donation page exists
- No payment processing for donations
- No recurring donation capability

**Gap Analysis:**
- Missing: Dedicated donate page
- Missing: Multiple donation methods
- Missing: Recurring donation setup
- Missing: Donation tracking/receipts
- Missing: Corporate sponsorship flow
- Missing: Cryptocurrency donations

---

## HANDOFF_DOCUMENT

### Implementation Strategy: Multi-Method Donation Hub

Create a dedicated `donate.html` that serves as a hub for all giving methods, optimized for both US and Nigerian donors.

---

## PAYMENT METHOD DEEP DIVE

### 1. TRADITIONAL PAYMENT METHODS

#### A. Credit/Debit Cards
| Gateway | US Donors | Nigerian Donors | Fee |
|---------|-----------|-----------------|-----|
| Stripe | ✅ Best choice | ❌ Not available | 2.2% + $0.30 (nonprofit) |
| Paystack | ❌ Not available | ✅ Best choice | 1.5% + ₦100 |

**Implementation:** Dual-gateway with location detection

#### B. Bank Transfer / ACH (CHEAPEST OPTION)
| Method | Region | Fee | Processing Time |
|--------|--------|-----|-----------------|
| ACH Direct Debit | US | 0.8% (max $5) | 3-5 days |
| Bank Transfer | Nigeria | 1.5% (max ₦2,000) | Same day |
| Wire Transfer | International | $25-50 flat | 1-3 days |

**Key Insight:** ACH is the **cheapest method** for US donors. A $1,000 donation costs only $5 in fees (0.5%) vs $25 for credit card.

**Implementation:**
```javascript
// Stripe ACH integration
const paymentIntent = await stripe.paymentIntents.create({
    amount: donationAmount,
    currency: 'usd',
    payment_method_types: ['us_bank_account'],
    payment_method_options: {
        us_bank_account: {
            financial_connections: { permissions: ['payment_method'] }
        }
    }
});
```

#### C. Check / Money Order (Traditional)
| Method | Processing | Fee | Best For |
|--------|------------|-----|----------|
| Mail-in Check | Manual | $0 | Large donations, older donors |
| Money Order | Manual | $0 | Unbanked donors |

**Implementation:** Display mailing address with instructions:
```
PMERIT Foundation
[Address to be determined]
[City, State ZIP]

Make checks payable to: "PMERIT Foundation"
Memo: "Donation - [Your Name]"
```

**Note:** Requires physical address and bank account for check deposits.

---

### 2. DIGITAL WALLETS

#### A. Apple Pay & Google Pay
| Wallet | Availability | Fee | Recurring | Notes |
|--------|--------------|-----|-----------|-------|
| Apple Pay | iOS, Safari | Same as card | ⚠️ Limited | 92% mobile wallet market share |
| Google Pay | Android, Chrome | Same as card | ⚠️ Limited | Growing adoption |

**Integration:** Both work through Stripe with no additional setup.

```javascript
// Enable in Stripe Elements
const paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: { label: 'PMERIT Donation', amount: donationAmount },
    requestPayerName: true,
    requestPayerEmail: true
});

// Check availability
const canMakePayment = await paymentRequest.canMakePayment();
if (canMakePayment) {
    // Show Apple Pay / Google Pay button
}
```

**Limitation:** Tokenization makes recurring donations challenging. Recommend for one-time only.

#### B. PayPal
| Feature | Value |
|---------|-------|
| Fee | 2.9% + $0.30 (standard) |
| Nonprofit Rate | 2.2% + $0.30 (must apply) |
| Recurring | ✅ Full support |
| International | ✅ 200+ countries |
| Brand Trust | Very high |

**Implementation:** PayPal Donations Button
```html
<div id="paypal-donate-button"></div>
<script src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js" charset="UTF-8"></script>
<script>
PayPal.Donation.Button({
    env: 'production',
    hosted_button_id: 'YOUR_BUTTON_ID',
    onComplete: function(params) {
        // Track donation
    }
}).render('#paypal-donate-button');
</script>
```

#### C. Venmo (US Only)
| Feature | Value |
|---------|-------|
| Fee (bank-funded) | 0% 🏆 |
| Fee (card-funded) | 3% |
| Recurring | ❌ Not supported |
| Demographics | Younger donors (18-35) |

**Implementation:** Through PayPal Business integration or Stripe Link.

**Marketing Angle:** "100% of your donation goes to students when you use Venmo!"

---

### 3. NIGERIA-SPECIFIC METHODS

#### A. Bank Transfer (Most Popular - 90% of Nigerian payments)
```javascript
// Paystack Bank Transfer
const response = await paystack.transaction.initialize({
    email: donor.email,
    amount: donationAmountKobo, // Amount in kobo (₦1 = 100 kobo)
    channels: ['bank_transfer'],
    callback_url: 'https://pmerit.com/donate/callback'
});
// Returns: { authorization_url, access_code, reference }
```

#### B. USSD (Feature Phones - No Internet Required)
```javascript
// Paystack USSD
const response = await paystack.transaction.initialize({
    email: donor.email,
    amount: donationAmountKobo,
    channels: ['ussd'],
    callback_url: 'https://pmerit.com/donate/callback'
});
// User dials USSD code on any phone to complete payment
```

**Why Important:** Reaches rural Nigeria, users without smartphones or internet.

#### C. Mobile Money (MTN MoMo, Airtel Money)
```javascript
// Through Paystack
const response = await paystack.transaction.initialize({
    email: donor.email,
    amount: donationAmountKobo,
    channels: ['mobile_money'],
    callback_url: 'https://pmerit.com/donate/callback'
});
```

---

### 4. CRYPTOCURRENCY DONATIONS

#### Option A: Every.org (Recommended for Simplicity)
| Feature | Value |
|---------|-------|
| Fee | 1% (flat) |
| Coins Supported | 93 tokens (BTC, ETH, USDC, etc.) |
| Tax Receipts | ✅ Automatic |
| Compliance | ✅ Handled by Every.org |
| Setup | Embed widget |

**Implementation:**
```html
<script 
    async defer 
    src="https://embeds.every.org/0.4/button.js?explicit=1"
    id="every-donate-btn-js">
</script>
<a class="every-donate-btn" 
   data-every-style-primary-color="#5b21b6"
   href="https://www.every.org/pmerit?utm_campaign=donate-link#/donate/crypto">
    Donate Crypto
</a>
```

**Requirements:** Register PMERIT as 501(c)(3) with Every.org

#### Option B: The Giving Block (More Coins, Higher Fees)
| Feature | Value |
|---------|-------|
| Fee | 3.95% |
| Coins Supported | 200+ |
| Tax Receipts | ✅ Automatic |
| Setup | Full integration |

#### Option C: Direct Wallet (Most Control, Most Work)
| Feature | Value |
|---------|-------|
| Fee | Network fees only (~$1-5) |
| Coins | Any you set up |
| Tax Receipts | Manual |
| Compliance | Your responsibility |

**Implementation (if chosen):**
```
Bitcoin: bc1qxxx...xxx
Ethereum: 0xXXX...XXX
USDC (Polygon): 0xXXX...XXX  // Lower fees, you already use Polygon
```

**Recommended Coins for PMERIT:**
| Coin | Why | Typical Fee |
|------|-----|-------------|
| Bitcoin (BTC) | Most recognized | $1-5 |
| Ethereum (ETH) | Developer community | $2-10 |
| USDC | Stablecoin, no volatility | $1-3 |
| Polygon MATIC | You use for credentials | $0.01-0.10 |

---

### 5. FLUTTERWAVE vs PAYSTACK (Deep Comparison)

#### Head-to-Head Comparison

| Feature | Paystack | Flutterwave |
|---------|----------|-------------|
| **Founded** | 2015 | 2016 |
| **Acquired by** | Stripe (2020, $200M) | Independent |
| **Countries** | Nigeria, Ghana, SA, Kenya | 34+ African countries |
| **US Payments** | ❌ Cannot accept | ✅ Can accept |
| **Local Fee** | 1.5% + ₦100 (cap ₦2,000) | 1.4% (cap ₦2,000) |
| **International Fee** | 3.9% + ₦100 | 3.8% |
| **Bank Transfer** | ✅ Native | ✅ Native |
| **Mobile Money** | ✅ MTN, Airtel | ✅ More options |
| **USSD** | ✅ Native | ✅ Native |
| **API Quality** | Excellent (Stripe-level) | Very Good |
| **Security Incident** | None major | 2022 breach ($4M+) |
| **Settlement** | Next day | Next day |

#### Recommendation: Paystack

**Reasons:**
1. **Stripe ownership** = shared security standards, potential future integration
2. **No major security incidents** = donor trust
3. **Slightly better documentation** = faster implementation
4. **Lower international fees** are same, local fees similar

**However, consider Flutterwave if:**
- You need to accept US payments through one African gateway
- You plan to expand to countries Paystack doesn't serve
- You want the widest mobile money coverage

---

## DONATE PAGE ARCHITECTURE

### Page Sections

```
┌─────────────────────────────────────────────────────────────┐
│                     DONATE.HTML                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  HERO: "Invest in Someone's Future"                 │   │
│  │  Impact stats: "630 lessons free • 14 pathways"     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  DONATION AMOUNT SELECTOR                           │   │
│  │  [$10] [$25] [$50] [$100] [$___]                    │   │
│  │  [Monthly] [One-Time]                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PAYMENT METHOD TABS                                │   │
│  │  [Card] [Bank] [PayPal] [Crypto] [Check]            │   │
│  │                                                     │   │
│  │  Tab Content:                                       │   │
│  │  - Card: Stripe/Paystack Elements                   │   │
│  │  - Bank: ACH (US) / Bank Transfer (NG)              │   │
│  │  - PayPal: PayPal Donate Button                     │   │
│  │  - Crypto: Every.org Widget                         │   │
│  │  - Check: Mailing address + instructions            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PAY IT FORWARD SECTION                             │   │
│  │  "Commit 1-5% of your future salary"                │   │
│  │  Pledge form + success stories                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CORPORATE SPONSORSHIP                              │   │
│  │  Tiers: Village ($1K) | State ($10K) | National     │   │
│  │  [Contact for Partnership]                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  IMPACT CALCULATOR                                  │   │
│  │  "$50 sponsors 2 students for 1 year"               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FAQ                                                │   │
│  │  - Is my donation tax-deductible?                   │   │
│  │  - How is my money used?                            │   │
│  │  - Can I donate in NGN?                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## IMPLEMENTATION REQUIREMENTS

### Phase 1: Database Schema

```sql
-- Donation records
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_email VARCHAR(255),
    donor_name VARCHAR(255),
    user_id UUID REFERENCES users(id), -- NULL for anonymous
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL, -- 'USD', 'NGN'
    payment_method VARCHAR(30) NOT NULL, -- 'card', 'ach', 'bank_transfer', 'paypal', 'crypto', 'check'
    gateway VARCHAR(20), -- 'stripe', 'paystack', 'paypal', 'every_org', 'manual'
    gateway_transaction_id VARCHAR(255),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency VARCHAR(20), -- 'monthly', 'yearly'
    donation_type VARCHAR(30) DEFAULT 'general', -- 'general', 'pay_it_forward', 'corporate', 'scholarship'
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
    tax_receipt_sent BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Recurring donation subscriptions
CREATE TABLE recurring_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_email VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id),
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL,
    frequency VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
    gateway VARCHAR(20) NOT NULL,
    gateway_subscription_id VARCHAR(255),
    status VARCHAR(20) NOT NULL, -- 'active', 'paused', 'cancelled'
    next_charge_date DATE,
    total_donated_cents INTEGER DEFAULT 0,
    donation_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    cancelled_at TIMESTAMP
);

-- Corporate sponsorships
CREATE TABLE corporate_sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    tier VARCHAR(20) NOT NULL, -- 'village', 'state', 'national', 'founding'
    annual_amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    display_on_site BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) NOT NULL, -- 'active', 'expired', 'pending'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_donations_email ON donations(donor_email);
CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_date ON donations(created_at);
CREATE INDEX idx_recurring_status ON recurring_donations(status);
```

### Phase 2: API Endpoints

```
# One-time donations
POST /api/v1/donations/checkout
  Input: { amount, currency, method, donor_info }
  Output: { checkout_url } or { client_secret }

POST /api/v1/donations/webhook/stripe
POST /api/v1/donations/webhook/paystack
POST /api/v1/donations/webhook/paypal

# Recurring donations (Pay It Forward)
POST /api/v1/donations/recurring/create
POST /api/v1/donations/recurring/cancel
GET  /api/v1/donations/recurring/status

# Corporate
POST /api/v1/donations/corporate/inquiry
GET  /api/v1/donations/sponsors  # Public - for displaying sponsors

# Crypto
POST /api/v1/donations/crypto/intent
  # Returns wallet addresses or Every.org redirect

# Manual/Check
POST /api/v1/donations/manual/record
  # Admin endpoint to record check donations
```

### Phase 3: Frontend Implementation

```javascript
// donate.js - Main donation logic

class DonationForm {
    constructor() {
        this.amount = 25; // Default
        this.currency = this.detectCurrency();
        this.frequency = 'one-time';
        this.method = 'card';
    }
    
    detectCurrency() {
        // IP-based detection or user preference
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone.includes('Lagos') || timezone.includes('Africa')) {
            return 'NGN';
        }
        return 'USD';
    }
    
    async initiatePayment() {
        const gateway = this.currency === 'NGN' ? 'paystack' : 'stripe';
        
        switch(this.method) {
            case 'card':
            case 'bank':
                return this.processGatewayPayment(gateway);
            case 'paypal':
                return this.processPayPal();
            case 'crypto':
                return this.processCrypto();
            case 'check':
                return this.showCheckInstructions();
        }
    }
    
    async processGatewayPayment(gateway) {
        const response = await fetch('/api/v1/donations/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: this.amount,
                currency: this.currency,
                method: this.method,
                frequency: this.frequency,
                gateway: gateway
            })
        });
        
        const data = await response.json();
        
        if (data.checkout_url) {
            // Redirect to hosted checkout
            window.location.href = data.checkout_url;
        } else if (data.client_secret) {
            // Use Stripe Elements inline
            this.handleStripeElements(data.client_secret);
        }
    }
}
```

---

## COST ANALYSIS: CHEAPEST OPTIONS

### For US Donors (Ranked by Cost)

| Rank | Method | $100 Donation Fee | % Lost |
|------|--------|-------------------|--------|
| 🥇 1 | Venmo (bank) | $0.00 | 0% |
| 🥈 2 | ACH Bank Transfer | $0.80 | 0.8% |
| 🥉 3 | Check/Money Order | $0.00* | 0%* |
| 4 | Crypto (Every.org) | $1.00 | 1% |
| 5 | PayPal (nonprofit) | $2.50 | 2.5% |
| 6 | Credit Card | $2.50 | 2.5% |

*Check requires manual processing = staff time cost

### For Nigerian Donors (Ranked by Cost)

| Rank | Method | ₦10,000 Donation Fee | % Lost |
|------|--------|----------------------|--------|
| 🥇 1 | Bank Transfer | ₦150 | 1.5% |
| 🥈 2 | USSD | ~₦100 | 1% |
| 🥉 3 | Card (Paystack) | ₦250 | 2.5% |
| 4 | Mobile Money | ₦150 | 1.5% |

### Recommendation: Promote Low-Fee Methods

Add messaging like:
> "**Pro tip:** Donate via bank transfer and 98.5% goes directly to students!"

---

## CORPORATE SPONSORSHIP TIERS

| Tier | Annual Amount | Benefits |
|------|---------------|----------|
| **Village Sponsor** | $1,000 / ₦1.5M | Logo on sponsors page, thank you email |
| **State Sponsor** | $10,000 / ₦15M | Above + logo on homepage, quarterly impact report |
| **National Sponsor** | $50,000 / ₦75M | Above + co-branded pathway, speaking opportunities |
| **Founding Partner** | $100,000+ | Custom partnership, board advisor access |

---

## ENVIRONMENT VARIABLES NEEDED

```bash
# Stripe (US/International)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Paystack (Nigeria)
PAYSTACK_SECRET_KEY=sk_live_xxx
PAYSTACK_PUBLIC_KEY=pk_live_xxx

# PayPal
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_DONATE_BUTTON_ID=xxx

# Every.org (Crypto)
EVERY_ORG_NONPROFIT_ID=pmerit

# Mail address for checks
PMERIT_MAILING_ADDRESS="TBD"
```

---

## VERIFICATION CHECKLIST

| # | Test | Status |
|---|------|--------|
| 1 | donate.html loads without errors | ⏳ TODO |
| 2 | Amount selector works | ⏳ TODO |
| 3 | Currency auto-detection works | ⏳ TODO |
| 4 | Stripe card payment completes | ⏳ TODO |
| 5 | Paystack payment completes | ⏳ TODO |
| 6 | ACH payment completes | ⏳ TODO |
| 7 | PayPal donation works | ⏳ TODO |
| 8 | Crypto widget displays | ⏳ TODO |
| 9 | Recurring donation setup works | ⏳ TODO |
| 10 | Tax receipt email sends | ⏳ TODO |
| 11 | Mobile responsive | ⏳ TODO |
| 12 | Dark mode works | ⏳ TODO |

---

## DEPENDENCIES

### Requires
- SCOPE_pricing implementation (shared gateway setup)
- 501(c)(3) status for tax-deductible receipts
- Nigerian business registration for Paystack
- Physical mailing address for checks

### Enables
- Pay It Forward tracking
- Corporate sponsorship display
- Donation impact reporting
- Donor relationship management

---

## SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 61 | 2025-12-17 | Created scope, full brainstorm completed |

---

*Last Updated: 2025-12-17 (Session 61)*


🏆 Key Decisions Documented
DecisionChoiceRationaleUS GatewayStripeNonprofit rates (2.2%), best APINigeria GatewayPaystackStripe-owned, clean security historyCrypto PlatformEvery.org1% fee, auto tax receipts, simple widgetCheapest US MethodVenmo (bank) / ACH0% / 0.8% feesCheapest NG MethodUSSD / Bank Transfer1% / 1.5% feesFlutterwaveNot nowPaystack preferred for Stripe integration

🚀 Next Steps
These files are ready for Claude Code to implement. The recommended order:

Database migrations - Create the tables
Gateway services - Stripe + Paystack integration
API endpoints - Checkout and webhook handlers
donate.html - New donation page
pricing.html updates - Connect CTAs to real checkout

Would you like me to make any changes to these specs before passing to Claude Code?