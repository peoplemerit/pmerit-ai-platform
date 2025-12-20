# PMERIT - Required Documents Checklist

**Last Updated:** December 18, 2025
**Purpose:** Track all documents needed to complete entity registration

---

## DOCUMENT STATUS LEGEND

| Symbol | Meaning |
|--------|---------|
| ✅ | Complete - Document exists and is filed |
| 🟡 | In Progress - Submitted, awaiting response |
| ❌ | Not Started - Action required |
| 📋 | Template Available - Ready to complete |
| ⏳ | Pending Dependency - Waiting on another document |

---

## ENTITY 1: PMERIT (PEOPLE MERIT) LLC - Holdings

### Formation Documents

| Document | Status | Notes | Location |
|----------|--------|-------|----------|
| Articles of Organization | ✅ | Filed Dec 3, 2025 | Maine SOS |
| Charter Number Confirmation | ✅ | #202605331DC | current_documents/ |
| EIN (IRS) | ✅ | [Upload to confirm] | current_documents/ |
| Operating Agreement | 🟡 | Needs update for subsidiary provisions | entity_holdings/ |
| Registered Agent Agreement | ✅ | Registered Agents Inc (P10263) | current_documents/ |
| Initial Annual Report | ⏳ | Due 2026 | - |

### Required Actions

- [ ] Upload EIN letter to `current_documents/`
- [ ] Upload Certificate of Organization to `current_documents/`
- [ ] Update Operating Agreement to include:
  - Subsidiary management provisions
  - Mission protection clauses
  - Distribution policies
  - Dissolution language (assets to Foundation)

---

## ENTITY 2: PMERIT FOUNDATION - 501(c)(3) Nonprofit

### Formation Documents

| Document | Status | Notes | Location |
|----------|--------|-------|----------|
| Articles of Incorporation | ✅ | Filed Dec 13, 2025 | Maine SOS |
| EIN (IRS) | ✅ | 41-3091629 | current_documents/ |
| Bylaws | ✅ | Version 2.0 adopted | docs/project/ |
| Conflict of Interest Policy | ✅ | In Bylaws Article XII | docs/project/ |
| Form 1023-EZ | ✅ | Submitted Dec 17, 2025 | Pay.gov |
| 501(c)(3) Determination Letter | 🟡 | Awaiting IRS (2-4 weeks) | - |
| Registered Agent Agreement | ✅ | Registered Agents Inc (P10263) | current_documents/ |

### IRS Submission Details (Form 1023-EZ)

| Field | Value Submitted |
|-------|-----------------|
| Organization Name | PMERIT FOUNDATION |
| Care Of | IDOWU J GABRIEL |
| Address | 439 US Route 1 STE A, York, ME 03909 |
| EIN | 41-3091629 |
| Tax Year Ends | January (01) |
| NTEE Code | B90 (Educational Services) |
| Exempt Purpose | Educational |
| Filing Fee | $275 (Paid Dec 17, 2025) |
| Formation Date | December 13, 2025 |
| State | Maine |

### Required Actions

- [ ] Upload EIN Letter (41-3091629) to `current_documents/`
- [ ] Upload Pay.gov payment confirmation to `current_documents/`
- [ ] Upload Articles of Incorporation to `current_documents/`
- [ ] Wait for IRS 501(c)(3) Determination Letter (expect 2-4 weeks)
- [ ] Once approved, obtain Maine state tax exemption
- [ ] Set up Form 990-N annual filing reminder

### Annual Compliance Requirements

| Requirement | Due Date | Form |
|-------------|----------|------|
| Form 990-N (e-Postcard) | 15th day of 5th month after fiscal year | IRS.gov |
| Maine Annual Report | Within 6 months of year end | Maine SOS |
| Board Meeting Minutes | Quarterly | Internal |
| Conflict of Interest Certifications | Annually | Internal |

---

## ENTITY 3: PMERIT TECHNOLOGIES LLC - For-Profit

### Status: NOT YET FORMED

### Formation Documents Needed

| Document | Status | Notes | Template |
|----------|--------|-------|----------|
| Articles of Organization | ❌ | File with Maine SOS ($175) | 📋 Available |
| EIN (IRS) | ⏳ | After formation | IRS.gov |
| Operating Agreement | ❌ | PMERIT Holdings as sole member | 📋 Available |
| Bank Account | ⏳ | After EIN received | - |
| SAM.gov Registration | ⏳ | After bank account | sam.gov |

### Formation Steps

1. **File Articles of Organization**
   - Name: PMERIT TECHNOLOGIES LLC
   - Registered Agent: Registered Agents Inc (P10263)
   - Management: Member-Managed
   - Member: PMERIT (PEOPLE MERIT) LLC
   - Filing Fee: $175
   - Portal: https://www.maine.gov/sos/cec/corp/

2. **Obtain EIN**
   - Apply at: https://www.irs.gov/ein
   - Legal Name: PMERIT TECHNOLOGIES LLC
   - Type: LLC
   - Members: 1
   - Responsible Party: Idowu Gabriel

3. **Create Operating Agreement**
   - Sole Member: PMERIT (PEOPLE MERIT) LLC
   - Management: Member-Managed
   - Purpose: Technology platform development
   - IP Ownership: All platform intellectual property
   - Distributions: At discretion of Holdings

4. **Open Business Bank Account**
   - Required documents: EIN Letter, Articles of Organization
   - Separate from Holdings and Foundation accounts

5. **Register on SAM.gov**
   - Required for federal contracts and SBIR
   - Need: EIN, DUNS/UEI, Bank Account
   - Free registration

---

## SUPPORTING DOCUMENTS - ALL ENTITIES

### Governance Documents

| Document | Entity | Status | Location |
|----------|--------|--------|----------|
| Constitution of PMERIT | All | ✅ | docs/handoffs/ |
| Bylaws | Foundation | ✅ | docs/project/ |
| Operating Agreement - Holdings | Holdings | 🟡 Needs Update | entity_holdings/ |
| Operating Agreement - Tech | Technologies | ❌ | entity_technologies/ |

### Registration Documents

| Document | Entity | Status | Location |
|----------|--------|--------|----------|
| Registered Agent Agreement | All | ✅ | current_documents/ |
| Maine Business Registration | Holdings | ✅ | current_documents/ |
| Maine Business Registration | Foundation | ✅ | current_documents/ |
| Maine Business Registration | Technologies | ❌ | - |

### Tax Documents

| Document | Entity | Status | Location |
|----------|--------|--------|----------|
| EIN Letter | Holdings | ✅ | current_documents/ |
| EIN Letter | Foundation | ✅ | current_documents/ |
| EIN Letter | Technologies | ❌ | - |
| 501(c)(3) Determination | Foundation | 🟡 | - |

### Bank Documents

| Document | Entity | Status | Notes |
|----------|--------|--------|-------|
| Business Bank Account | Holdings | ❓ | Verify status |
| Business Bank Account | Foundation | ❓ | Verify status |
| Business Bank Account | Technologies | ❌ | After formation |

---

## NIGERIAN REGISTRATION (Reference)

### Completed Documents

| Document | Status | Date |
|----------|--------|------|
| NGO Constitution | ✅ | Nov 20, 2024 |
| CAC Registration | ✅ | Completed |
| Newspaper Publication | ✅ | Completed |
| Trustee Documentation | ✅ | 3 trustees signed |

### Nigerian Office Details
- **Location:** Port Harcourt, Nigeria
- **Trustees:** Joy Aluge, Kayode Sofolahan, Blessing Aluge

---

## DOCUMENT UPLOAD CHECKLIST

### Priority 1: Upload Immediately
Place these in `/current_documents/`:

- [ ] `HOLDINGS_EIN_LETTER_2025-12.pdf`
- [ ] `HOLDINGS_CERTIFICATE_OF_ORGANIZATION_2025-12-03.pdf`
- [ ] `FOUNDATION_EIN_LETTER_2025-12.pdf` (41-3091629)
- [ ] `FOUNDATION_ARTICLES_OF_INCORPORATION_2025-12-13.pdf`
- [ ] `FOUNDATION_1023EZ_CONFIRMATION_2025-12-17.pdf`
- [ ] `REGISTERED_AGENT_AGREEMENT.pdf`

### Priority 2: After 501(c)(3) Approval
- [ ] `FOUNDATION_501C3_DETERMINATION_LETTER.pdf`
- [ ] `FOUNDATION_MAINE_TAX_EXEMPTION.pdf`

### Priority 3: After Technologies LLC Formation
- [ ] `TECHNOLOGIES_ARTICLES_OF_ORGANIZATION.pdf`
- [ ] `TECHNOLOGIES_EIN_LETTER.pdf`
- [ ] `TECHNOLOGIES_OPERATING_AGREEMENT.pdf`

---

## COMPLIANCE CALENDAR

### Monthly
- [ ] Review bank statements for all entities
- [ ] Update financial records

### Quarterly
- [ ] Foundation Board Meeting (minutes required)
- [ ] Review progress on grant applications
- [ ] Review SAM.gov registration status

### Annually
| Month | Task | Entity |
|-------|------|--------|
| February | Fiscal Year End (Foundation) | Foundation |
| May | Form 990-N Due (if <$50K) | Foundation |
| June | Annual Report Due | Holdings |
| June | Annual Report Due | Foundation |
| June | Annual Report Due | Technologies |
| December | Conflict of Interest Certifications | Foundation |

---

## NEXT STEPS (Prioritized)

### Immediate (This Week)
1. ⬜ Upload all existing documents to `current_documents/`
2. ⬜ Verify Holdings LLC EIN exists and upload letter
3. ⬜ Check for 501(c)(3) determination letter (2-4 week window)

### Short-Term (Next 2 Weeks)
4. ⬜ Upon 501(c)(3) approval, file for Maine state tax exemption
5. ⬜ File PMERIT TECHNOLOGIES LLC with Maine SOS
6. ⬜ Obtain EIN for Technologies LLC

### Medium-Term (Next Month)
7. ⬜ Open business bank account for Technologies LLC
8. ⬜ Register Technologies LLC on SAM.gov
9. ⬜ Update Holdings Operating Agreement
10. ⬜ Begin government partnership applications

---

*Checklist Created: December 18, 2025*
*Reference: Incorporation_structure_chat_session.md, U.S_Registration.md*
