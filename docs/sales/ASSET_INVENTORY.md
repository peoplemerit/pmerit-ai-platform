# PMERIT Platform - Asset Inventory & IP Schedule

**Confidential**
**Prepared:** December 2025
**Version:** 1.0

---

## TABLE OF CONTENTS

1. [Asset Summary](#1-asset-summary)
2. [Software Assets](#2-software-assets)
3. [Intellectual Property](#3-intellectual-property)
4. [Domain & Brand Assets](#4-domain--brand-assets)
5. [Data Assets](#5-data-assets)
6. [Third-Party Accounts](#6-third-party-accounts)
7. [Documentation Assets](#7-documentation-assets)
8. [Transfer Schedule](#8-transfer-schedule)

---

## 1. ASSET SUMMARY

### 1.1 Asset Overview

| Category | Items | Est. Value |
|----------|-------|------------|
| Software (Source Code) | 2 repositories | $750K - $1.2M |
| Intellectual Property | 5 proprietary systems | $1.5M - $4.6M |
| Domain & Brand | 1 primary domain + brand kit | $50K - $100K |
| Data Assets | 6 databases/indexes | $100K - $300K |
| Third-Party Accounts | 8 service accounts | $10K - $25K |
| Documentation | 50+ documents | $25K - $50K |
| **Total Estimated Value** | | **$2.4M - $6.3M** |

### 1.2 Transfer Scope

**Included in Sale:**
- ✅ All source code (frontend + backend)
- ✅ All intellectual property rights
- ✅ Domain name and DNS configuration
- ✅ All third-party account access
- ✅ All data (user data with consent, content data)
- ✅ All documentation
- ✅ 90-day transition support

**Excluded from Sale:**
- ❌ Personal development tools/licenses
- ❌ Historical chat logs with AI assistants
- ❌ Personal email archives

---

## 2. SOFTWARE ASSETS

### 2.1 Repository: pmerit-ai-platform (Frontend)

**GitHub URL:** github.com/peoplemerit/pmerit-ai-platform (Private)

| Metric | Value |
|--------|-------|
| Total Commits | 1,783+ |
| Total Files | 1,291 |
| Lines of Code | ~80,000 |
| Primary Languages | HTML, CSS, JavaScript |
| Size (with node_modules) | 296 MB |
| Size (source only) | ~25 MB |

**Directory Structure:**
```
pmerit-ai-platform/
├── index.html                    # Homepage
├── *.html                        # 45 HTML pages
├── assets/
│   ├── css/                      # 25 CSS files (17,500 LOC)
│   ├── js/                       # 44 JS files (22,000 LOC)
│   ├── images/                   # Brand assets, icons
│   ├── fonts/                    # Web fonts
│   └── models/                   # 3D avatar models
├── partials/                     # 8 reusable components
├── admin/                        # Admin panel pages
├── portal/                       # Portal-specific pages
├── data/                         # JSON data files
├── docs/                         # Documentation
│   ├── aados/                    # Governance documents
│   ├── project/                  # Project documents
│   ├── handoffs/                 # Session handoffs
│   └── sales/                    # Sales documents (this folder)
├── .claude/                      # Claude AI instructions
│   └── scopes/                   # Feature scope documents
├── package.json                  # Dependencies
└── README.md                     # Project readme
```

**Key Files by Size:**
| File | Size | Description |
|------|------|-------------|
| `assessment-results.html` | 49 KB | Results visualization |
| `about-us.html` | 21 KB | About page |
| `dashboard.html` | 18 KB | Student dashboard |
| `assessment-questions.html` | 15 KB | Question interface |
| `courses.html` | 14 KB | Course catalog |

### 2.2 Repository: pmerit-api-worker (Backend)

**GitHub URL:** github.com/peoplemerit/pmerit-api-worker (Private)

| Metric | Value |
|--------|-------|
| Total Commits | 47+ |
| Total Files | 30+ |
| Lines of Code | ~6,000 |
| Primary Language | TypeScript |
| Size (with node_modules) | 422 MB |
| Size (source only) | ~500 KB |

**Directory Structure:**
```
pmerit-api-worker/
├── src/
│   ├── index.ts                  # Main handler (1,227 LOC)
│   ├── types.ts                  # Type definitions (409 LOC)
│   ├── routes/
│   │   ├── admin.ts              # Admin API (580 LOC)
│   │   ├── assessment.ts         # Assessment API (320 LOC)
│   │   ├── auth.ts               # Auth API (680 LOC)
│   │   ├── classroom.ts          # Classroom API (290 LOC)
│   │   ├── curriculum.ts         # Curriculum read (240 LOC)
│   │   ├── curriculum-crud.ts    # Curriculum write (380 LOC)
│   │   ├── exams.ts              # Exam API (420 LOC)
│   │   ├── gpu.ts                # GPU API (350 LOC)
│   │   └── tts.ts                # TTS API (520 LOC)
│   ├── algorithms/
│   │   ├── BigFiveScoring.ts     # Personality scoring (280 LOC)
│   │   └── HollandCodeCalculator.ts # Career matching (320 LOC)
│   └── utils/
│       ├── db.ts                 # Database utilities
│       ├── jwt.ts                # JWT handling
│       └── email.ts              # Email utilities
├── migrations/
│   ├── 001_initial.sql           # Initial schema
│   ├── 002_assessment.sql        # Assessment tables
│   ├── 003_architecture.sql      # Architecture expansion
│   ├── 004_content_sources.sql   # Content sources
│   └── 005_admin_roles.sql       # Admin system
├── wrangler.toml                 # Cloudflare config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── vitest.config.ts              # Test config
```

### 2.3 Code Ownership Certification

**Statement:**
All source code in both repositories was authored by the seller or generated with AI assistance (Claude, GitHub Copilot). No code is copied from proprietary sources. Open-source dependencies are MIT/Apache licensed.

**Third-Party Code:**
| Library | License | Usage |
|---------|---------|-------|
| Hono | MIT | Backend routing |
| Drizzle ORM | Apache 2.0 | Database access |
| Zod | MIT | Validation |
| Three.js | MIT | 3D rendering |
| Various npm packages | MIT/Apache | Standard utilities |

---

## 3. INTELLECTUAL PROPERTY

### 3.1 Proprietary System: Avatar Lip-Sync Engine

**Files:**
- `assets/js/AvatarManager.js` (520 LOC)
- `assets/js/LipSyncVisemes.js` (380 LOC)
- `assets/js/WebGLProvider.js` (450 LOC)
- `assets/js/AudioPlayer.js` (290 LOC)
- `assets/js/lip-sync-controller.js` (260 LOC)

**Capabilities:**
- Real-time 3D avatar rendering via WebGL
- Audio-synchronized lip movements
- Viseme calculation algorithm
- Multiple avatar character support
- Graceful degradation on low-end devices

**Estimated Value:** $500K - $2M

**Comparable:** Synthesia (AI avatars) valued at $1.5B

### 3.2 Proprietary System: Assessment Pipeline

**Files:**
- `src/algorithms/BigFiveScoring.ts` (280 LOC)
- `src/algorithms/HollandCodeCalculator.ts` (320 LOC)
- `src/routes/assessment.ts` (320 LOC)
- `assets/js/assessment-*.js` (5 files, 1,820 LOC)
- `data/careers-rag.json` (500+ careers)

**Capabilities:**
- IPIP-NEO 120-question implementation
- Big Five personality scoring with facets
- Holland Code (RIASEC) career matching
- 500+ career database with salary data
- AI-enhanced result interpretation

**Estimated Value:** $200K - $500K

**Comparable:** TestGorilla (assessment) raised $70M Series A

### 3.3 Proprietary System: AI Routing Architecture

**Files:**
- `src/index.ts` (AI routing section, ~300 LOC)
- `src/routes/ai-personas/` (system prompts)

**Capabilities:**
- 5 distinct AI personas with tailored prompts
- Complexity-based model selection
- Cost optimization per query tier
- Context management across conversations
- Figurative mode toggle for creative responses

**Estimated Value:** $300K - $800K

### 3.4 Proprietary System: Multi-Language Infrastructure

**Files:**
- `assets/js/language-manager.js` (340 LOC)
- `assets/js/language-data.js` (comprehensive language list)
- `partials/language-modal.html`
- Azure Translator integration

**Capabilities:**
- 40+ language support
- Client-side language persistence
- Azure Translator API integration
- Locale-specific content variants
- Nigerian languages (Yoruba, Igbo, Hausa)

**Estimated Value:** $200K - $500K

### 3.5 Proprietary System: Curriculum Architecture

**Files:**
- Database schema (pathways, courses, modules, lessons)
- `src/routes/curriculum.ts`
- `src/routes/curriculum-crud.ts`
- `assets/js/dashboard-courses.js`

**Capabilities:**
- Three-track educational model
- Pathway → Course → Module → Lesson hierarchy
- Progress tracking and completion
- Enrollment management
- BLS salary data integration

**Estimated Value:** $200K - $500K

### 3.6 IP Ownership Statement

**Declaration:**
All intellectual property described above was created by the seller during the development of the PMERIT platform. No IP is licensed from third parties beyond standard open-source libraries. Full IP rights transfer with sale.

### 3.7 IP Summary Table

| IP Asset | Files | LOC | Value Range |
|----------|-------|-----|-------------|
| Avatar Lip-Sync Engine | 5 | 1,900 | $500K - $2M |
| Assessment Pipeline | 8 | 2,740 | $200K - $500K |
| AI Routing Architecture | 2 | 500 | $300K - $800K |
| Multi-Language System | 3 | 500 | $200K - $500K |
| Curriculum Architecture | 4 | 800 | $200K - $500K |
| **Total** | **22** | **6,440** | **$1.4M - $4.3M** |

---

## 4. DOMAIN & BRAND ASSETS

### 4.1 Domain Names

| Domain | Registrar | Expiry | Auto-Renew |
|--------|-----------|--------|------------|
| **pmerit.com** | Cloudflare | 2026-XX-XX | Yes |

**DNS Configuration:**
- A record → Cloudflare Pages
- CNAME → pmerit-ai-platform.pages.dev
- MX → Configured for Resend
- TXT → DKIM, SPF, DMARC verified

### 4.2 Brand Assets

| Asset | Location | Format |
|-------|----------|--------|
| Logo (Primary) | `assets/images/logo.svg` | SVG |
| Logo (Icon) | `assets/images/favicon.ico` | ICO |
| Apple Touch Icon | `assets/images/apple-touch-icon.png` | PNG |
| Open Graph Image | `assets/images/og-image.jpg` | JPG |
| Brand Colors | `assets/css/main.css` | CSS Variables |
| Typography | Google Fonts (Montserrat, Inter) | Web Fonts |

**Brand Guidelines:**
| Element | Value |
|---------|-------|
| Primary Color | #2A5B8C (Blue) |
| Secondary Color | #F5A623 (Gold) |
| Dark Mode BG | #0f1419 |
| Font (Headings) | Montserrat |
| Font (Body) | Inter |

### 4.3 Social Media Handles

| Platform | Handle | Status |
|----------|--------|--------|
| GitHub | peoplemerit | Active |
| (Others to be registered) | - | - |

---

## 5. DATA ASSETS

### 5.1 Database: Neon PostgreSQL

**Connection:** Serverless PostgreSQL (Neon)
**Tables:** 25+
**Estimated Rows:** 10,000+

**Core Tables:**
| Table | Rows (Est.) | Data Type |
|-------|-------------|-----------|
| users | 100+ | User accounts |
| pathways | 14 | Learning pathways |
| courses | 42 | Course catalog |
| course_modules | 150+ | Course sections |
| lessons | 500+ | Learning content |
| course_enrollments | 100+ | Enrollment records |
| lesson_progress | 500+ | Progress tracking |
| assessment_results | 200+ | Assessment data |
| career_matches | 1,000+ | Career recommendations |
| ai_usage_logs | 5,000+ | AI usage tracking |
| audit_logs | 1,000+ | Admin audit trail |

### 5.2 Vector Store: Cloudflare Vectorize

**Index Name:** pmerit-careers
**Vectors:** 500+
**Dimensions:** 768
**Content:** Career knowledge base for RAG

### 5.3 Cache: Cloudflare KV

**Namespace:** TTS_CACHE
**Items:** 1,000+ (TTS audio files)
**TTL:** 1 year

### 5.4 Static Data Files

| File | Size | Content |
|------|------|---------|
| `careers-rag.json` | 2.1 MB | 500+ careers with embeddings |
| `ipip-neo-120.json` | 45 KB | Assessment questions |
| `language-data.js` | 15 KB | 40+ language definitions |
| `career-salaries.json` | 120 KB | BLS salary data |

### 5.5 Data Transfer Notes

**User Data:**
- Transfer requires user consent notification
- GDPR-compliant data handling
- Option to anonymize before transfer

**Content Data:**
- Full transfer included
- No third-party licensing restrictions

---

## 6. THIRD-PARTY ACCOUNTS

### 6.1 Account Inventory

| Service | Account | Purpose | Monthly Cost |
|---------|---------|---------|--------------|
| **Cloudflare** | Primary | Hosting, CDN, Workers | $20 |
| **Neon** | Primary | PostgreSQL database | $0-50 |
| **GitHub** | peoplemerit | Source control | $0 |
| **RunPod** | Primary | GPU for TTS | $50-200 |
| **Azure** | Primary | Translator API | $0-100 |
| **Resend** | Primary | Transactional email | $0 |
| **Ready Player Me** | peoplemerit | Avatar creation | $0 |
| **BLS.gov** | API access | Salary data | $0 |

### 6.2 Account Details

#### Cloudflare
- **Plan:** Pro ($20/month)
- **Services Used:**
  - Pages (frontend hosting)
  - Workers (backend API)
  - Workers AI (LLM inference)
  - Vectorize (vector database)
  - KV (key-value cache)
  - D1 (not used)
- **Custom Domain:** pmerit.com configured

#### Neon
- **Plan:** Free → Scale (usage-based)
- **Database:** PostgreSQL 15
- **Region:** US East
- **Branching:** Available

#### RunPod
- **Pod ID:** xfdsuii2ig7rsl
- **Pod URL:** https://xfdsuii2ig7rsl-8000.proxy.runpod.net
- **GPU:** On-demand
- **Cost:** $0.26/hour when running

#### Azure
- **Service:** Translator API
- **Region:** Global
- **Tier:** Free → Pay-as-you-go

### 6.3 Secrets & API Keys

| Secret | Location | Transfer Method |
|--------|----------|-----------------|
| DATABASE_URL | Cloudflare Secrets | Manual transfer |
| JWT_SECRET | Cloudflare Secrets | Regenerate |
| RESEND_API_KEY | Cloudflare Secrets | Regenerate |
| AZURE_TRANSLATOR_KEY | Cloudflare Secrets | Transfer or regenerate |
| RUNPOD_API_KEY | Cloudflare Secrets | Transfer |

---

## 7. DOCUMENTATION ASSETS

### 7.1 Project Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| CLAUDE.md | Root | AI assistant instructions |
| README.md | Root | Project overview |
| GOVERNANCE.md | docs/aados/ | Workflow rules |
| TASK_TRACKER.md | docs/aados/ | Task status |
| STATE.json | docs/aados/ | Machine-readable state |

### 7.2 Architecture Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| PMERIT_ARCHITECTURE_FINAL.md | docs/project/ | System architecture |
| Pmerit_Project_Document.md | docs/project/ | Master roadmap |
| User Journey Narrative | docs/project/ | User flows |
| BRAINSTORM_ASU_LIKE_SCHEMA.md | docs/handoffs/ | Feature specs |

### 7.3 Scope Documentation

| Document | Location | Status |
|----------|----------|--------|
| MASTER_SCOPE.md | .claude/scopes/ | Project vision |
| SCOPE_HOMEPAGE.md | .claude/scopes/ | Complete |
| SCOPE_ASSESSMENT.md | .claude/scopes/ | Complete |
| SCOPE_DASHBOARD.md | .claude/scopes/ | Complete |
| SCOPE_CLASSROOM.md | .claude/scopes/ | Complete |
| SCOPE_AVATAR.md | .claude/scopes/ | Complete |
| SCOPE_ENROLLMENT.md | .claude/scopes/ | Complete |
| SCOPE_TTS.md | .claude/scopes/ | Complete |
| SCOPE_ADMIN.md | .claude/scopes/ | In Progress |
| SCOPE_CREDENTIALS.md | .claude/scopes/ | Not Started |

### 7.4 Sales Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| EXECUTIVE_SUMMARY.md | docs/sales/ | Buyer one-pager |
| TECHNICAL_DUE_DILIGENCE.md | docs/sales/ | Tech deep-dive |
| FINANCIAL_PROJECTIONS.md | docs/sales/ | Business model |
| ASSET_INVENTORY.md | docs/sales/ | This document |
| DEMO_GUIDE.md | docs/sales/ | Feature walkthrough |
| DATA_ROOM_INDEX.md | docs/sales/ | File structure |

---

## 8. TRANSFER SCHEDULE

### 8.1 Pre-Closing (Before Sale)

| Task | Timeline | Owner |
|------|----------|-------|
| Sign NDA | Day 1 | Both parties |
| Provide repo access (read-only) | Day 1-3 | Seller |
| Technical due diligence | Day 3-14 | Buyer |
| Financial verification | Day 3-14 | Buyer |
| Draft purchase agreement | Day 14-21 | Legal |

### 8.2 Closing Day

| Task | Owner |
|------|-------|
| Execute purchase agreement | Both |
| Transfer payment | Buyer |
| Transfer GitHub repositories | Seller |
| Transfer Cloudflare account | Seller |
| Transfer domain ownership | Seller |
| Provide all API keys/secrets | Seller |

### 8.3 Post-Closing (90-Day Transition)

| Week | Activities |
|------|------------|
| 1-2 | Knowledge transfer sessions |
| 3-4 | Handoff of operational procedures |
| 5-8 | On-call support for questions |
| 9-12 | Final documentation, transition complete |

### 8.4 Transition Support Included

| Support Type | Duration | Hours |
|--------------|----------|-------|
| Knowledge transfer calls | Weeks 1-4 | 20 hours |
| Technical Q&A (async) | Weeks 1-12 | Unlimited |
| Emergency support | Weeks 1-12 | As needed |
| Documentation updates | Weeks 1-8 | 10 hours |
| **Total** | **90 days** | **~40 hours** |

---

## APPENDIX

### A. File Count Summary

| Category | Count |
|----------|-------|
| HTML Files | 45 |
| JavaScript Files | 44 |
| CSS Files | 25 |
| TypeScript Files | 15 |
| JSON Files | 10 |
| Markdown Files | 50+ |
| SQL Files | 5 |
| Config Files | 10 |
| Image Files | 100+ |
| **Total** | **~300+** |

### B. Code Statistics

| Metric | Frontend | Backend | Total |
|--------|----------|---------|-------|
| Lines of Code | ~65,000 | ~6,000 | ~71,000 |
| Files | 224+ | 30+ | 254+ |
| Commits | 1,783 | 47 | 1,830 |
| Contributors | 1 | 1 | 1 |

### C. Dependency Audit

**Frontend Dependencies:**
- No critical vulnerabilities
- All MIT/Apache licensed

**Backend Dependencies:**
- No critical vulnerabilities
- All MIT/Apache licensed

### D. License Summary

| License | Usage |
|---------|-------|
| MIT | Primary open-source |
| Apache 2.0 | Drizzle ORM |
| Proprietary | PMERIT custom code |

---

*This inventory is complete and accurate as of the preparation date.*

*Confidential - Do not distribute without authorization.*
