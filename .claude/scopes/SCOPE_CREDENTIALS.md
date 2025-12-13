# PMERIT SUB-SCOPE: Blockchain Credentials

**Version:** 1.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-12
**Status:** NOT STARTED
**Phase:** ARCH-2, ARCH-3

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | Blockchain-Anchored Credentials |
| **Phase** | ARCH-2 (Credential API) + ARCH-3 (Polygon) |
| **Pages** | TBD: `credentials.html`, `wallet.html` |
| **JavaScript** | TBD |
| **API Endpoints** | `/api/v1/credentials/*` |
| **Database Tables** | `credential_types`, `issued_credentials`, `blockchain_batches`, `credential_shares`, `credential_verifications` |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| CR-001 | Blockchain | Polygon (MATIC) | Low fees, fast, EVM compatible | 43 |
| CR-002 | Credential Levels | 5-level hierarchy | Granular achievement tracking | 43 |
| CR-003 | Anchoring Method | Batch hash to chain | Cost-efficient | 43 |
| CR-004 | Credential Ownership | Student-owned, portable | Core platform principle | 43 |

---

## 3. FEATURE SPECIFICATION

<HANDOFF_DOCUMENT>

### 5-Level Credential Hierarchy

| Level | Name | Example | Typical Time |
|-------|------|---------|--------------|
| 1 | Micro-Credential | "HTML Tables Complete" | 1-2 hours |
| 2 | Skill Badge | "JavaScript Fundamentals" | 1-2 weeks |
| 3 | Course Certificate | "Full JavaScript Course" | 4-6 weeks |
| 4 | Pathway Certificate | "Web Development Pathway" | 6-12 months |
| 5 | Platform Diploma | "PMERIT Career Ready" | 1-2 years |

### Blockchain Flow

```
1. Student completes course
2. System issues credential (DB record)
3. Credential queued for blockchain batch
4. Batch (100 credentials) hashed
5. Hash anchored to Polygon
6. Transaction ID stored with credential
7. Student can share verifiable link
8. Employer verifies via blockchain
```

### Database Tables (Created in ARCH-1)

| Table | Purpose |
|-------|---------|
| `credential_types` | Defines 5 levels |
| `issued_credentials` | Student credentials |
| `blockchain_batches` | Batch records |
| `credential_shares` | Shared links |
| `credential_verifications` | Verification log |

### API Endpoints (Planned)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/credentials/issue` | Issue credential |
| GET | `/api/v1/credentials/:id` | Get credential |
| GET | `/api/v1/users/:id/credentials` | User's credentials |
| POST | `/api/v1/credentials/:id/share` | Generate share link |
| GET | `/api/v1/credentials/verify/:hash` | Verify credential |
| POST | `/api/v1/credentials/batch` | Batch to blockchain |

</HANDOFF_DOCUMENT>

---

## 4. IMPLEMENTATION STATUS

<RESEARCH_FINDINGS>

### Session 43 (2025-12-09) — ARCH-1 Foundation

**Database Tables Created:**
- credential_types (5 types seeded)
- issued_credentials
- blockchain_batches
- credential_shares
- credential_verifications

**Status:** Tables exist, API not implemented

### Not Yet Started

- [ ] Credential issuance API
- [ ] Polygon integration
- [ ] Wallet UI
- [ ] Share/verify flow

</RESEARCH_FINDINGS>

---

## 5. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | SCOPE_CLASSROOM | Completion triggers credential |
| **Requires** | SCOPE_ASSESSMENT | Assessment results inform credentials |
| **Enables** | SCOPE_ADMIN | Admins view issued credentials |
| **Enables** | External Verification | Employers verify credentials |

---

## 6. KNOWN ISSUES

| Issue | Priority | Notes |
|-------|----------|-------|
| Not started | - | Tables ready, needs API implementation |

---

*Last Updated: 2025-12-12 by Claude Code (Session 50)*
