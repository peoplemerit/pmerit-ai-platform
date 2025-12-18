# PMERIT SUB-SCOPE: Blockchain Credentials

**Version:** 2.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-18
**Status:** AUDITED - NOT IMPLEMENTED
**Phase:** ARCH-2, ARCH-3
**Priority:** P0 - Core Platform Differentiator

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Blockchain-Anchored Credentials (Student-Owned, Verifiable) |
| **Phase** | ARCH-2 (Credential API) + ARCH-3 (Polygon Integration) |
| **Pages** | `portal/credentials.html` (TBD), `portal/wallet.html` (TBD) |
| **JavaScript** | `credentials.js` (TBD) |
| **API Endpoints** | `/api/v1/credentials/*` (NOT IMPLEMENTED) |
| **Database Tables** | `credential_types`, `issued_credentials`, `blockchain_batches`, `credential_shares`, `credential_verifications` |
| **Blockchain** | Polygon (MATIC) - EVM compatible, low fees |

---

## 2. AUDIT_REPORT

**Audit Date:** 2025-12-18 | **Session:** 62 | **Auditor:** Claude Code

### Executive Summary

The credential system has **database foundation complete** but **zero functional implementation**. Tables exist and are seeded, but no API endpoints, no UI, and no blockchain integration.

### What EXISTS

#### Database Tables (Created in ARCH-1)

| Table | Status | Records |
|-------|--------|---------|
| `credential_types` | EXISTS | 5 types seeded |
| `issued_credentials` | EXISTS | 0 records |
| `blockchain_batches` | EXISTS | 0 records |
| `credential_shares` | EXISTS | 0 records |
| `credential_verifications` | EXISTS | 0 records |

#### 5-Level Credential Hierarchy (Seeded)

| Level | Name | Typical Duration | Blockchain |
|-------|------|------------------|------------|
| 1 | Micro-Credential | 1-2 hours | Optional batch |
| 2 | Module Badge | 1-2 weeks | Optional batch |
| 3 | Course Certificate | 4-6 weeks | Required |
| 4 | Pathway Certificate | 6-12 months | Required |
| 5 | Platform Diploma | 1-2 years | Required + Full Record |

### What DOES NOT EXIST

| Component | Status | Impact |
|-----------|--------|--------|
| Credential API endpoints | NOT BUILT | Can't issue credentials |
| Credential issuance logic | NOT BUILT | Completion doesn't trigger credentials |
| Wallet UI | NOT BUILT | Students can't view credentials |
| Share/Verify flow | NOT BUILT | Employers can't verify |
| Polygon integration | NOT BUILT | No blockchain anchoring |
| Batch processor | NOT BUILT | No cost-efficient batching |

### Production Verification

```bash
# Check credential tables exist
curl -s "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/credentials"
# Expected: 404 (endpoint not implemented)
```

### Priority Assessment

| Priority | Item | Rationale |
|----------|------|-----------|
| **P1** | Credential issuance API | Core feature - completion triggers credential |
| **P1** | User credential wallet | Students need to see their achievements |
| **P2** | Share link generation | Required for employer verification |
| **P2** | Verify endpoint | Public verification of credentials |
| **P3** | Polygon integration | Blockchain anchoring (can work without initially) |

---

## 3. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| CR-001 | Blockchain | Polygon (MATIC) | Low fees (~$0.01), fast (2s blocks), EVM compatible | 43 |
| CR-002 | Credential Levels | 5-level hierarchy | Granular achievement tracking | 43 |
| CR-003 | Anchoring Method | Batch hash to chain | Cost-efficient (100 creds = 1 tx) | 43 |
| CR-004 | Credential Ownership | Student-owned, portable | Core platform principle | 43 |
| CR-005 | Privacy Default | Private by default | Student chooses to share | 43 |
| CR-006 | Integrity Display | Full transparency | Score + proctoring level shown | 43 |

---

## 4. HANDOFF_DOCUMENT

*Source: PMERIT_ARCHITECTURE_FINAL.md §7*

### Credential Issuance Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CREDENTIAL ISSUANCE FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Student completes module/course/pathway                         │
│     └── Trigger: lesson_progress 100% OR assessment passed          │
│                                                                     │
│  2. System creates credential record                                │
│     └── INSERT INTO issued_credentials                              │
│     └── Status: 'issued', blockchain_status: 'pending'              │
│                                                                     │
│  3. Credential queued for blockchain batch                          │
│     └── Batch collects ~100 credentials                             │
│     └── Runs nightly or on-demand                                   │
│                                                                     │
│  4. Batch processor creates Merkle root                             │
│     └── Hash all credentials in batch                               │
│     └── Single hash represents batch                                │
│                                                                     │
│  5. Merkle root anchored to Polygon                                 │
│     └── Single transaction (~$0.01)                                 │
│     └── Transaction ID stored                                       │
│                                                                     │
│  6. Individual credentials updated                                  │
│     └── blockchain_status: 'anchored'                               │
│     └── blockchain_tx_id: '0x...'                                   │
│     └── merkle_proof stored                                         │
│                                                                     │
│  7. Student can share verifiable link                               │
│     └── POST /credentials/:id/share                                 │
│     └── Returns: pmerit.com/verify/[unique-hash]                    │
│                                                                     │
│  8. Employer verifies via public endpoint                           │
│     └── GET /verify/[hash]                                          │
│     └── Shows: credential details + blockchain proof                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### API Endpoints (To Build)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/credentials/issue` | System | Issue credential on completion |
| GET | `/api/v1/credentials/:id` | Owner | Get credential details |
| GET | `/api/v1/users/:id/credentials` | Owner | List user's credentials |
| POST | `/api/v1/credentials/:id/share` | Owner | Generate shareable link |
| GET | `/api/v1/verify/:hash` | Public | Verify credential (no auth) |
| POST | `/api/v1/admin/credentials/batch` | Admin | Trigger blockchain batch |
| GET | `/api/v1/admin/credentials/stats` | Admin | Credential statistics |

### Wallet UI Requirements

```
┌─────────────────────────────────────────────────────────────────────┐
│  MY CREDENTIALS                                        [Share All]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🎓 PATHWAY CERTIFICATES                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Web Development Career Ready                                 │   │
│  │ Issued: Dec 15, 2025 | Verified: ✅ Blockchain              │   │
│  │ [View] [Share] [Download PDF]                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  📋 COURSE CERTIFICATES (3)                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ HTML & CSS Fundamentals         | Score: 92% | ✅ Proctored │   │
│  │ JavaScript Essentials           | Score: 88% | ✅ Proctored │   │
│  │ React Fundamentals              | Score: 95% | ✅ Proctored │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  🏅 MODULE BADGES (9)                                               │
│  [Show All]                                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Verification Page (Public)

```
┌─────────────────────────────────────────────────────────────────────┐
│  PMERIT CREDENTIAL VERIFICATION                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ✅ VERIFIED CREDENTIAL                                             │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  Web Development Career Ready Certificate                   │   │
│  │                                                             │   │
│  │  Issued to: John Smith                                      │   │
│  │  Issue Date: December 15, 2025                              │   │
│  │  Credential ID: PMERIT-WD-2025-12345                        │   │
│  │                                                             │   │
│  │  Courses Completed: 3                                       │   │
│  │  Total Hours: 64                                            │   │
│  │  Final Assessment: 92% (Proctored)                          │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  🔗 BLOCKCHAIN VERIFICATION                                         │
│  Network: Polygon (MATIC)                                           │
│  Transaction: 0x7a8b...3f2e                                         │
│  Block: 52,847,291                                                  │
│  Timestamp: 2025-12-15 14:32:18 UTC                                 │
│  [View on PolygonScan]                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. RESEARCH_FINDINGS

### Session 43 (2025-12-09) — ARCH-1 Foundation

**Database Tables Created:**
- `credential_types` - 5 types seeded (micro, badge, course, pathway, diploma)
- `issued_credentials` - Ready for credential records
- `blockchain_batches` - Ready for batch tracking
- `credential_shares` - Ready for share links
- `credential_verifications` - Ready for verification log

### Session 62 (2025-12-18) — Audit

**Finding:** Database ready, implementation not started.

**Recommended Implementation Order:**
1. Credential issuance API (trigger on completion)
2. User credentials list endpoint
3. Wallet UI page
4. Share link generation
5. Public verify endpoint
6. Polygon integration (Phase 2)

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_CLASSROOM | Lesson completion triggers micro-credentials |
| **Requires** | SCOPE_ASSESSMENT | Assessment pass triggers course certificate |
| **Requires** | SCOPE_PROGRESS | Progress 100% triggers credentials |
| **Requires** | SCOPE_ENROLLMENT | Must be enrolled to earn credentials |
| **Enables** | SCOPE_ADMIN | Admins view/manage issued credentials |
| **Enables** | External Verification | Employers verify via public endpoint |

---

## 7. ACCEPTANCE CRITERIA

### Phase 1: Core Credential System
- [ ] Completing a module issues micro-credential
- [ ] Completing a course issues course certificate
- [ ] Completing a pathway issues pathway certificate
- [ ] User can view all credentials in wallet
- [ ] Credentials show completion date and score

### Phase 2: Sharing & Verification
- [ ] User can generate shareable link
- [ ] Public verification page shows credential details
- [ ] Verification includes integrity info (proctored/unproctored)
- [ ] Share links can be revoked

### Phase 3: Blockchain Integration
- [ ] Credentials batched for blockchain anchoring
- [ ] Batch processor creates Merkle root
- [ ] Root anchored to Polygon
- [ ] Individual credentials include blockchain proof
- [ ] PolygonScan link on verification page

---

## 8. SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 43 | 2025-12-09 | ARCH-1: Database tables created |
| 50 | 2025-12-12 | Scope file created |
| 62 | 2025-12-18 | Full audit, status documented |

---

*Last Updated: 2025-12-18 (Session 62)*
