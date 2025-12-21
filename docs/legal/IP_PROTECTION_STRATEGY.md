# PMERIT Intellectual Property Protection Strategy

**Document Status:** CONFIDENTIAL
**Version:** 1.0
**Date:** December 2025
**Owner:** PMERIT Holdings LLC

---

## EXECUTIVE SUMMARY

This document outlines a comprehensive strategy to protect PMERIT's intellectual property, trade secrets, and competitive advantages. Protection covers seven key areas:

1. **Copyright** - Source code, content, designs
2. **Trademark** - Brand identity and names
3. **Trade Secrets** - Proprietary algorithms and methods
4. **Patents** - Novel technical innovations (optional)
5. **Contracts** - Legal agreements with users, employees, vendors
6. **Technical Measures** - Code protection and access controls
7. **Documentation** - Evidence and proof of creation

---

## 1. COPYRIGHT PROTECTION

### 1.1 What Copyright Protects (Automatic Rights)

| Asset Type | Protection Status | Action Required |
|------------|-------------------|-----------------|
| Source code (all repositories) | Protected | Add notices |
| UI/UX designs and layouts | Protected | Document creation dates |
| Written content (courses, lessons) | Protected | Register key works |
| Documentation and guides | Protected | Add copyright headers |
| Original graphics and images | Protected | Watermark/metadata |
| Database structure (expression) | Protected | Document architecture |
| Audio content (TTS generated) | Limited* | Review TTS license |

*Note: AI-generated content copyright is evolving legally. Human curation adds protectable elements.

### 1.2 Copyright Registration (Recommended)

**Why Register?**
- Establishes public record of ownership
- Required before filing infringement lawsuit
- Enables statutory damages ($30K-$150K per infringement)
- Enables attorney fee recovery

**Priority Registration List:**

| Asset | Registration Type | Fee | Priority |
|-------|-------------------|-----|----------|
| Frontend codebase (pmerit-ai-platform) | Computer program | $65 | HIGH |
| Backend codebase (pmerit-api-worker) | Computer program | $65 | HIGH |
| Assessment system (as a collection) | Literary work | $65 | MEDIUM |
| Course content (as a collection) | Literary work | $65 | MEDIUM |
| Logo and brand graphics | Visual arts | $55 | HIGH |
| 500+ career database | Compilation | $65 | MEDIUM |

**Total Recommended Registration Cost:** $380

**How to Register:**
1. Go to: https://www.copyright.gov/registration/
2. Create an account
3. Complete online application
4. Upload deposit copy (source code as ZIP)
5. Pay fee
6. Receive certificate (typically 3-6 months)

### 1.3 Copyright Notices to Add

Add to every source file header:

```javascript
/**
 * PMERIT Platform
 * Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.
 *
 * This file is part of the PMERIT Platform and is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 *
 * For licensing inquiries: legal@pmerit.com
 */
```

Add to every HTML file:

```html
<!--
  PMERIT Platform
  Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.
  Unauthorized use, reproduction, or distribution is prohibited.
-->
```

---

## 2. TRADEMARK PROTECTION

### 2.1 Marks to Protect

| Mark | Type | Class | Priority | Status |
|------|------|-------|----------|--------|
| PMERIT | Word mark | 41 (Education) | HIGH | Pending |
| PMERIT | Word mark | 42 (Software) | HIGH | Pending |
| PMERIT Logo | Design mark | 41, 42 | MEDIUM | Pending |
| People Merit | Word mark | 41 | LOW | Pending |
| "Your Path to Purpose" (if used) | Slogan | 41 | LOW | Pending |

### 2.2 Trademark Application Process

**Step 1: Trademark Search (~$0-300)**
- Free search: https://tmsearch.uspto.gov/
- Professional search (recommended): $150-300

**Step 2: File Application (~$250-350 per class)**
- USPTO TEAS Plus: $250/class (stricter requirements)
- USPTO TEAS Standard: $350/class (more flexibility)
- Online: https://www.uspto.gov/trademarks/apply

**Step 3: Examination (3-4 months)**
- USPTO examines application
- May issue office actions requiring response

**Step 4: Publication (30 days)**
- Mark published for opposition
- Third parties can object

**Step 5: Registration (2-3 months after publication)**
- Receive registration certificate
- Can use ® symbol

**Estimated Total Cost:**
- 2 classes (Education + Software): $500-700
- Timeline: 8-12 months

### 2.3 Immediate Trademark Actions

1. **Use ™ symbol NOW** - No registration required
   - PMERIT™ in marketing materials
   - Logo with ™ on website

2. **Document First Use Dates**
   - First use in commerce: [Record date]
   - First use anywhere: [Record date from git history]

3. **Consistent Usage**
   - Always capitalize: PMERIT (not Pmerit, pmerit)
   - Use as adjective: "PMERIT platform" not "the PMERIT"
   - Never use as verb: "Use PMERIT software" not "PMERIT your learning"

---

## 3. TRADE SECRET PROTECTION

### 3.1 Trade Secrets Inventory

| Secret | Description | Protection Level |
|--------|-------------|------------------|
| AI Persona Prompts | System prompts for 5 AI personas | CRITICAL |
| Assessment Algorithms | BigFive scoring + Holland code matching | HIGH |
| Lip-Sync Viseme Engine | Audio-to-mouth-movement algorithm | HIGH |
| Career Matching Logic | 500+ career vector matching | HIGH |
| Pricing Strategy | Tiered monetization approach | MEDIUM |
| User Analytics Methods | Engagement and progress tracking | MEDIUM |
| Vendor Relationships | RunPod, Azure integration details | LOW |

### 3.2 Trade Secret Protection Measures

**A. Physical/Digital Security**
- [ ] Private GitHub repositories (current: ✓)
- [ ] Two-factor authentication on all accounts
- [ ] Cloudflare access controls
- [ ] Environment variables for secrets (current: ✓)
- [ ] No secrets in code (current: ✓)

**B. Access Controls**
- [ ] Need-to-know access policy
- [ ] Separate production/development credentials
- [ ] Audit logs for sensitive operations
- [ ] Regular access reviews

**C. Documentation**
- [ ] Mark confidential documents "CONFIDENTIAL - TRADE SECRET"
- [ ] Maintain list of who has access
- [ ] Document protection measures (for legal evidence)

**D. Contractual Protection**
- [ ] NDA for employees (see Section 5)
- [ ] NDA for contractors (see Section 5)
- [ ] NDA for potential investors/buyers
- [ ] Non-compete clauses where enforceable

### 3.3 Trade Secret Documentation

Create a confidential document listing:
1. Each trade secret
2. How it provides competitive advantage
3. What measures protect it
4. Who has access
5. Date created/documented

This documentation is critical if you ever need to enforce trade secret rights in court.

---

## 4. PATENT PROTECTION (OPTIONAL)

### 4.1 Potentially Patentable Innovations

| Innovation | Patentability Assessment | Action |
|------------|-------------------------|--------|
| Lip-sync viseme algorithm | MEDIUM - May have prior art | Research first |
| AI routing by complexity | LOW - Likely obvious | Skip |
| Assessment + career matching pipeline | LOW - Combination of known methods | Skip |
| Multi-language content delivery | LOW - Standard approach | Skip |

### 4.2 Patent Decision Framework

**Consider Patents When:**
- Innovation is truly novel (no prior art)
- Provides significant competitive advantage
- Competitors would clearly infringe
- You have budget ($10K-$15K+ per patent)
- You're willing to publicly disclose method

**Skip Patents When:**
- Trade secret protection is sufficient
- Innovation may become obsolete quickly
- Prior art exists
- Budget is limited
- Public disclosure would help competitors

**Recommendation:** For PMERIT, trade secret protection is more practical than patents for most innovations. Consider provisional patent only for lip-sync algorithm if you believe it's truly novel.

### 4.3 Provisional Patent Option

If you want patent protection:
1. File provisional patent application ($1,600-$3,000)
2. Gives 12 months to decide on full patent
3. Establishes priority date
4. Does not require claims (easier to file)
5. Not examined by USPTO

---

## 5. CONTRACTUAL PROTECTION

### 5.1 Required Agreements

| Agreement | Use Case | Priority |
|-----------|----------|----------|
| Terms of Service | All users | CRITICAL |
| Privacy Policy | All users | CRITICAL |
| NDA (Mutual) | Business discussions | HIGH |
| Contributor Agreement | Code contributors | HIGH |
| Employee IP Assignment | Employees | HIGH (if hiring) |
| Contractor IP Assignment | Contractors | HIGH (if hiring) |

### 5.2 Terms of Service Key Provisions

Your TOS should include:

**Intellectual Property Section:**
```
All content, features, and functionality of the PMERIT Platform, including
but not limited to text, graphics, logos, icons, images, audio clips,
software, and the compilation thereof, are the exclusive property of
PMERIT Holdings LLC and are protected by United States and international
copyright, trademark, and other intellectual property laws.
```

**License Grant (Limited):**
```
Subject to your compliance with these Terms, PMERIT grants you a limited,
non-exclusive, non-transferable, non-sublicensable license to access and
use the Platform for your personal, non-commercial educational purposes.
```

**Restrictions:**
```
You agree not to:
- Copy, modify, or distribute any part of the Platform
- Reverse engineer, decompile, or disassemble any software
- Use automated systems to access the Platform
- Scrape, harvest, or collect any content
- Remove any copyright or proprietary notices
- Use the Platform for any commercial purpose without authorization
```

### 5.3 NDA Template Provisions

For discussions with potential investors, partners, or acquirers:

**Definition of Confidential Information:**
```
"Confidential Information" means all non-public information disclosed by
PMERIT, including but not limited to: source code, algorithms, trade
secrets, business plans, customer data, pricing, technical specifications,
AI training data and prompts, and any information marked "Confidential."
```

**Non-Disclosure Obligation:**
```
Recipient shall: (a) hold Confidential Information in strict confidence;
(b) not disclose to third parties without prior written consent;
(c) use only for the Purpose; (d) protect using at least the same degree
of care as Recipient uses for its own confidential information.
```

**Term:**
```
Obligations shall survive for five (5) years from disclosure, except for
trade secrets which shall be protected indefinitely.
```

---

## 6. TECHNICAL PROTECTION MEASURES

### 6.1 Code Protection

| Measure | Status | Priority |
|---------|--------|----------|
| Private repositories | ✓ Implemented | - |
| Branch protection rules | ✓ Implemented | - |
| Code signing | Not implemented | MEDIUM |
| Obfuscation (production) | Not implemented | LOW |
| License key validation | Not implemented | LOW |

### 6.2 Content Protection

| Measure | Status | Priority |
|---------|--------|----------|
| Disable right-click/copy | Not implemented | LOW |
| Watermarking images | Not implemented | MEDIUM |
| DRM for premium content | Not implemented | LOW |
| Rate limiting | ✓ Implemented | - |

### 6.3 Access Controls

| Measure | Status | Priority |
|---------|--------|----------|
| Authentication required | ✓ Implemented | - |
| Role-based access | ✓ Implemented | - |
| API key protection | ✓ Implemented | - |
| Audit logging | ✓ Implemented | - |

---

## 7. DOCUMENTATION & EVIDENCE

### 7.1 Creation Evidence

Maintain records proving when you created each asset:

| Evidence Type | Location | Purpose |
|---------------|----------|---------|
| Git commit history | GitHub | Proves creation dates |
| Development screenshots | Local backup | Shows development process |
| Design files | Backup | Proves original creation |
| Email timestamps | Email archive | Corroborates dates |
| This document | docs/legal/ | Establishes protection intent |

### 7.2 Recommended Documentation

- [ ] Create dated screenshots of platform in development
- [ ] Export git log to PDF as evidence
- [ ] Keep copies of early designs and mockups
- [ ] Save communications about development
- [ ] Maintain version history of all documents

### 7.3 Evidence Preservation

```bash
# Create dated evidence archive
git log --all --oneline > evidence/git-history-$(date +%Y%m%d).txt
git archive --format=zip HEAD > evidence/source-archive-$(date +%Y%m%d).zip
```

---

## 8. ENFORCEMENT STRATEGY

### 8.1 Monitoring

| Activity | Frequency | Tool |
|----------|-----------|------|
| Google Alerts for "PMERIT" | Daily | Google Alerts |
| GitHub code search | Monthly | GitHub search |
| Domain monitoring | Monthly | WHOIS lookup |
| Social media monitoring | Weekly | Manual |

### 8.2 Response to Infringement

**Level 1: Minor Infringement**
- Send cease and desist letter (template included)
- Request removal from platforms (DMCA)

**Level 2: Significant Infringement**
- Engage IP attorney
- Formal demand letter
- Negotiate settlement

**Level 3: Major Infringement**
- File lawsuit (copyright/trademark)
- Seek injunction
- Claim damages

### 8.3 DMCA Takedown Process

For content on third-party platforms:
1. Identify hosting provider
2. Send DMCA takedown notice
3. Include: identification of work, location of infringement, contact info, good faith statement, signature
4. Follow up within 10 business days

---

## 9. ACTION ITEMS

### Immediate (This Week)

- [ ] Add copyright headers to all source files
- [ ] Create root LICENSE file (proprietary)
- [ ] Create COPYRIGHT file
- [ ] Add ™ to PMERIT in marketing materials
- [ ] Set up Google Alerts for "PMERIT"

### Short-Term (This Month)

- [ ] Draft Terms of Service
- [ ] Draft Privacy Policy
- [ ] Create standard NDA template
- [ ] Document all trade secrets
- [ ] Register copyright for main codebase

### Medium-Term (This Quarter)

- [ ] File trademark application for PMERIT
- [ ] Create contributor/contractor IP agreement
- [ ] Implement additional code protections
- [ ] Archive development evidence

### Long-Term (This Year)

- [ ] Complete trademark registration
- [ ] Evaluate patent opportunities
- [ ] Annual IP audit
- [ ] Update protection measures as platform grows

---

## 10. COST SUMMARY

### One-Time Costs

| Item | Cost | Priority |
|------|------|----------|
| Copyright registration (4 works) | $260 | HIGH |
| Trademark search | $150 | HIGH |
| Trademark filing (2 classes) | $500-700 | HIGH |
| Legal review of TOS/Privacy | $500-1,500 | MEDIUM |
| **Total** | **$1,410 - $2,610** |

### Optional Costs

| Item | Cost | Priority |
|------|------|----------|
| Provisional patent | $1,600-3,000 | LOW |
| Full patent | $10,000-15,000 | LOW |
| Legal retainer (ongoing) | $2,000-5,000/year | MEDIUM |

---

## APPENDIX A: CEASE AND DESIST TEMPLATE

```
[Your Name]
[Your Address]
[Date]

[Infringer Name]
[Infringer Address]

Re: Unauthorized Use of PMERIT Copyrighted Materials

Dear [Name]:

It has come to our attention that you are using copyrighted materials
owned by PMERIT Holdings LLC without authorization, specifically:

[Description of infringement]

This material is protected by U.S. copyright law. Your use constitutes
infringement under 17 U.S.C. § 501.

We demand that you immediately:
1. Cease all use of our copyrighted materials
2. Remove all infringing content from your website/platform
3. Confirm compliance in writing within 10 business days

Failure to comply may result in legal action seeking injunctive relief
and damages.

This letter is without prejudice to any and all rights and remedies.

Sincerely,
[Signature]
PMERIT Holdings LLC
```

---

## APPENDIX B: IP PROTECTION CHECKLIST

### Daily Operations
- [ ] New code includes copyright headers
- [ ] Confidential materials marked appropriately
- [ ] Access controls reviewed for new hires

### Monthly Review
- [ ] Check Google Alerts
- [ ] Review access logs
- [ ] Update trade secret documentation

### Quarterly Review
- [ ] Audit repository access
- [ ] Review third-party agreements
- [ ] Update asset inventory

### Annual Review
- [ ] Full IP audit
- [ ] Renewal of registrations
- [ ] Update protection strategy
- [ ] Review enforcement actions

---

*This document is CONFIDENTIAL and intended solely for PMERIT management.*
*Consult with an intellectual property attorney for specific legal advice.*
