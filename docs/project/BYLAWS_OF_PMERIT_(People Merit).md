# BYLAWS OF PMERIT (People Merit)

**Version:** 2.0
**Adopted:** February 11, 2025
**Last Updated:** December 13, 2025

---

## ARTICLE I: NAME AND PURPOSE

### Section 1. Name

The name of the organization is **PMERIT**, which stands for "People Merit."

### Section 2. Purpose

PMERIT is a nonprofit organization dedicated to providing free, accessible, AI-tutored education to liberate people from poverty through skills that lead to sustainable employment. The organization addresses global challenges such as literacy, unemployment, and inequality, starting with Nigeria and the State of Maine, USA.

### Section 3. Mission Statement

> Provide free, accessible, AI-tutored education to liberate people from poverty through skills that lead to sustainable employment.

### Section 4. Core Principles

1. **AI-First Tutoring**: No human instructors — AI tutors provide personalized, always-available learning
2. **Free & Accessible**: $0 free tier with full educational content; premium tier for enhanced experience
3. **Global Reach**: PWA architecture for low-bandwidth regions; offline access via Service Workers
4. **Poverty Liberation**: Focus on employment-ready skills across all three educational tracks

---

## ARTICLE II: EDUCATIONAL PLATFORM

### Section 1. Three-Track Educational Model

PMERIT operates a comprehensive AI-powered educational platform with three distinct tracks:

| Track | Name | Target Audience | Outcome |
|-------|------|-----------------|---------|
| **Track 1** | Global Remote | Adults seeking remote careers | Career credentials |
| **Track 2** | Local Education | K-12 students (Maine-aligned) | Academic credentials |
| **Track 3** | Local Career | Trade/vocational seekers | Pre-apprenticeship preparation |

### Section 2. Track 1 — Global Remote (Career Training)

**Purpose:** Provide career-ready skills for adults seeking remote employment opportunities.

**Six Career Pathways:**
- Web Development → Full-Stack Developer
- Data Analytics → Data Analyst
- UX Design → UX/UI Designer
- Digital Marketing → Marketing Specialist
- Project Management → Project Manager
- Business Analysis → Business Analyst

### Section 3. Track 2 — Local Education (Maine K-12)

**Purpose:** Provide K-12 education aligned with Maine Learning Results.

**Grade Spans (per Maine standards):**
- Childhood: Grades K-5 (Ages 5-11)
- Early Adolescence: Grades 6-8 (Ages 11-14)
- Adolescence: Grades 9-Diploma (Ages 14-18+)

**Career-Focused Subjects:**
- English Language Arts (ELA)
- Mathematics
- Science & Engineering
- Life & Career Readiness

### Section 4. Track 3 — Local Career (CTE/Vocational)

**Purpose:** Prepare job seekers for vocational trades and pre-apprenticeship programs.

**Career Clusters:**
- Construction Trades (Electrical, Plumbing, HVAC)
- Healthcare (CNA, Medical Admin, EMT Prep)
- Manufacturing (Welding, CNC, Quality Control)
- Transportation (CDL Prep, Auto Tech, Logistics)

**Legal Positioning:** PMERIT prepares students for certification exams but does not itself grant industry certifications or licenses.

---

## ARTICLE III: BOARD OF TRUSTEES

### Section 1. Composition

The Board of Trustees shall consist of four (4) members, namely:

- **Chairperson:** Idowu J. Gabriel
- **Secretary:** Kayode Sofolahan
- **Treasurer:** Blessing Aluge
- **Bookkeeper:** Joy Aluge

### Section 2. Powers and Duties

The Board of Trustees shall:

1. Oversee the governance, mission, and strategic direction of PMERIT
2. Approve budgets, financial decisions, and organizational policies
3. Appoint officers to fulfill day-to-day operational roles
4. Ensure alignment of all branches with global organizational objectives
5. Oversee platform development and educational quality

### Section 3. Term of Office

Trustees shall serve a term of five (5) years and may be re-elected for additional terms.

### Section 4. Meetings

1. Regular meetings shall be held monthly
2. Special meetings may be called by the Chairperson or any two trustees with at least 7 days' notice

### Section 5. Quorum and Voting

1. A quorum for Board meetings shall consist of three (3) trustees
2. Decisions shall be made by a simple majority vote of trustees present

### Section 6. Removal and Vacancies

1. A trustee may be removed for cause by a two-thirds majority vote of the Board
2. Vacancies shall be filled by the remaining trustees for the unexpired term

---

## ARTICLE IV: OFFICERS

### Section 1. Officers

The officers of PMERIT shall include:

**Chairperson: Idowu J. Gabriel**
- Presides over Board meetings and represents PMERIT in official matters

**Secretary: Kayode Sofolahan**
- Maintains meeting minutes, correspondence, and records of the organization

**Treasurer: Blessing Aluge**
- Oversees financial management, budgeting, and reporting

**Bookkeeper: Joy Aluge**
- Assists in maintaining accurate financial records and tracking expenses

### Section 2. Term and Reelection

Officers shall serve for a term of five (5) years and may be re-elected for additional terms.

---

## ARTICLE V: PLATFORM TECHNOLOGY

### Section 1. Technology Stack

PMERIT operates on a serverless-first architecture:

| Layer | Technology | Purpose |
|-------|------------|---------|
| Hosting | Cloudflare Pages | Static frontend, global CDN |
| API | Cloudflare Workers | Backend logic, API routing |
| Database | Neon PostgreSQL | Serverless database |
| AI Services | Workers AI | Chat, tutoring, assessment |
| Email | Resend | Transactional emails |

### Section 2. Production URLs

- **Frontend:** https://pmerit.com
- **API:** https://pmerit-api-worker.peoplemerit.workers.dev

### Section 3. AI Tutor System

PMERIT employs six AI tutor personas tailored to track and age group:

| Persona | Track/Level | Tone |
|---------|-------------|------|
| Professor Ada | Global Remote (Adult) | Professional, industry-focused |
| Ms. Sunshine | Local Education (K-2) | Playful, encouraging |
| Mr. Explorer | Local Education (3-5) | Curious, supportive |
| Coach Jordan | Local Education (6-8) | Relatable, guiding |
| Mentor Alex | Local Education (9-12) | Academic, preparing |
| Coach Mike | Local Career (Adult) | Practical, safety-focused |

---

## ARTICLE VI: CREDENTIALING SYSTEM

### Section 1. Credential Hierarchy

PMERIT issues credentials at five levels:

| Level | Type | Blockchain |
|-------|------|------------|
| 1 | Micro-Credential | No (database only) |
| 2 | Module Badge | Batched (weekly) |
| 3 | Course Certificate | Yes |
| 4 | Career-Ready Credential | Yes |
| 5 | PMERIT Diploma | Yes |

### Section 2. Blockchain Technology

Credentials at Levels 3-5 are anchored on the Polygon blockchain (Layer-2 Ethereum) for verification and portability.

### Section 3. Credential Privacy

Credentials are private by default. Students explicitly choose what to share with employers or institutions.

---

## ARTICLE VII: FINANCIAL MANAGEMENT

### Section 1. Fiscal Year

The fiscal year of PMERIT shall be from February 1 to January 31. Proper financial records must be maintained and audited annually. The Nigerian office shall report all financial activities to the US office for consolidation and compliance with international nonprofit standards.

### Section 2. Pricing Model

PMERIT operates a freemium model:

| Tier | Price | Features |
|------|-------|----------|
| Free | $0/month | Full courses, AI tutor, basic avatar, offline PWA |
| Premium | ~$9.99/month | Enhanced AI, realistic TTS, advanced avatar |

### Section 3. Financial Oversight

1. The Treasurer and Bookkeeper shall ensure proper financial records are maintained
2. All funds shall be used exclusively to achieve the organization's objectives
3. Infrastructure costs are minimized through free-tier cloud services

### Section 4. Audits

The Board shall appoint an external auditor to conduct an annual financial review.

---

## ARTICLE VIII: PARENT PORTAL

### Section 1. Minor Student Oversight

All K-12 students (under 18) require parent/guardian oversight through the Parent Portal.

### Section 2. Parent Portal Features

1. Child account management
2. Progress dashboard for all children
3. Weekly activity reports
4. Communication with AI tutor alerts
5. Credential access and sharing controls
6. Privacy controls

### Section 3. Age-Based Access Controls

| Age | Account Type | Oversight |
|-----|--------------|-----------|
| Under 13 | Child (COPPA) | Parent manages everything |
| 13-17 | Teen | More autonomy, parent oversight |
| 18+ | Adult | Full independence |

---

## ARTICLE IX: COMMITTEES

The Board may establish committees as needed to advance the mission of PMERIT. The Chairperson shall appoint committee members with Board approval.

---

## ARTICLE X: AMENDMENTS

These bylaws may be amended by a two-thirds majority vote of the trustees during a regular or special meeting, provided 14 days' written notice is given.

---

## ARTICLE XI: DISSOLUTION

In the event of dissolution, the remaining assets of PMERIT shall be distributed to an organization with similar objectives, as determined by the Board of Trustees, in accordance with applicable laws.

---

## SIGNATURES

**Chairperson:** _______________________________ Date: _______________
Idowu J. Gabriel

**Secretary:** _________________________________ Date: _______________
Kayode Sofolahan

**Treasurer:** _________________________________ Date: _______________
Blessing Aluge

**Bookkeeper:** _______________________________ Date: 2/11/2025
Joy Aluge

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | February 11, 2025 | Initial adoption |
| 2.0 | December 13, 2025 | Updated to reflect platform architecture, three-track model, AI tutors, credentialing system, technology stack, and parent portal |

---

## ARTICLE XII: CONFLICT OF INTEREST POLICY

### Section 1. Purpose

The purpose of the conflict of interest policy is to protect this tax-exempt organization's interest when it is contemplating entering into a transaction or arrangement that might benefit the private interest of an officer or director of the Organization or might result in a possible excess benefit transaction.

### Section 2. Definitions

**Interested Person:** Any director, principal officer, or member of a committee with governing board delegated powers, who has a direct or indirect financial interest, as defined below, is an interested person.

**Financial Interest:** A person has a financial interest if the person has, directly or indirectly, through business, investment, or family:

1. An ownership or investment interest in any entity with which the Organization has a transaction or arrangement;
2. A compensation arrangement with the Organization or with any entity or individual with which the Organization has a transaction or arrangement; or
3. A potential ownership or investment interest in, or compensation arrangement with, any entity or individual with which the Organization is negotiating a transaction or arrangement.

### Section 3. Procedures

**Duty to Disclose:** In connection with any actual or possible conflict of interest, an interested person must disclose the existence of the financial interest and be given the opportunity to disclose all material facts to the directors and members of committees with governing board delegated powers considering the proposed transaction or arrangement.

**Recusal:** Any interested person may make a presentation at the governing board or committee meeting, but after the presentation, he/she shall leave the meeting during the discussion of, and the vote on, the transaction or arrangement involving the possible conflict of interest.
