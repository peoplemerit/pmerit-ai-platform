# [PROJECT] SUB-SCOPE: [FEATURE NAME]

**Version:** 2.0
**Created:** [DATE]
**Last Updated:** [DATE]
**Status:** [EMPTY | AUDITED | SPECIFIED | IMPLEMENTED | DOCUMENTED]
**Phase:** [Development Phase]
**Priority:** [P0-Critical | P1-High | P2-Medium | P3-Low]

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | [e.g., User Authentication] |
| **Target Users** | [e.g., All users, Admins only, K-12 students] |
| **Pages** | [e.g., login.html, register.html] |
| **JavaScript** | [e.g., auth.js, session.js] |
| **CSS** | [e.g., auth.css] |
| **API Endpoints** | [e.g., /api/v1/auth/*] |
| **Database Tables** | [e.g., users, sessions] |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

These decisions are final. Changes require MASTER_SCOPE update and Director approval.

| ID | Decision | Choice | Rationale |
|----|----------|--------|-----------|
| [FEAT-001] | [e.g., Auth Method] | [JWT] | [Stateless, scalable] |
| [FEAT-002] | [e.g., Password Hash] | [bcrypt] | [Industry standard] |

---

## 3. AUDIT_REPORT

*Populated by Claude Code when running `AUDIT SCOPE: [name]`*

### Current Production Status

```
[Claude Code fills this section with actual findings]
```

### Existing Implementation

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| [Component] | [Exists/Missing] | [path] | [notes] |

### Technical Debt / Issues

- [ ] [Issue 1]
- [ ] [Issue 2]

### Audit Date: [DATE] | Session: [#]

---

## 4. HANDOFF_DOCUMENT

*Populated by Claude Web after reviewing AUDIT_REPORT*

### Feature Requirements

#### Requirement 1: [Name]
- **Priority:** [High/Medium/Low]
- **Description:** [What needs to be done]
- **Acceptance Criteria:**
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]

### User Flow

```
1. User does [action]
2. System responds with [response]
3. User sees [result]
```

### Technical Approach

[Describe the implementation approach]

### Out of Scope

- [Thing 1 that is NOT included]
- [Thing 2 that is NOT included]

### Handoff Date: [DATE] | Session: [#]

---

## 5. RESEARCH_FINDINGS

*Populated by Claude Code after implementation*

### Session [#] — [DATE]

**Completed:**
- [x] [Task 1]
- [x] [Task 2]

**Files Changed:**
- `path/to/file1.js` — [What changed]
- `path/to/file2.css` — [What changed]

**Issues Found:**
- [Issue 1] — [How resolved]

**Decisions Made:**
- [Decision 1] — [Rationale]

**Next Steps:**
- [ ] [Next task 1]

---

## 6. FEATURE_GUIDE

*This section documents HOW the feature works for end users, administrators, and future developers. It serves as the functional documentation after project completion.*

### 6.1 Overview

**What This Feature Does:**
[Plain-language description of the feature's purpose and value]

**Who Uses This Feature:**
| User Type | Access Level | Use Case |
|-----------|--------------|----------|
| [Student] | [View only] | [Description] |
| [Parent] | [View + Manage] | [Description] |
| [Admin] | [Full control] | [Description] |

---

### 6.2 User Guide

#### For Students/Learners

**How to Access:**
1. [Step 1]
2. [Step 2]

**What You Can Do:**
| Action | How To | Result |
|--------|--------|--------|
| [Action 1] | [Click X, then Y] | [What happens] |
| [Action 2] | [Navigate to Z] | [What happens] |

**Common Questions:**
- **Q: [Question]?**
  A: [Answer]

---

#### For Parents/Guardians

**How to Access:**
1. [Step 1]
2. [Step 2]

**What You Can Do:**
| Action | How To | Result |
|--------|--------|--------|
| [Action 1] | [Click X, then Y] | [What happens] |

**Parental Controls:**
| Control | Default | Options | How to Change |
|---------|---------|---------|---------------|
| [Control 1] | [On/Off] | [Options] | [Steps] |

---

#### For Administrators

**How to Access:**
1. Log in to Admin Portal (`/admin/tier1.html` or `/admin/tier2.html`)
2. Navigate to [Section]

**What You Can Do:**
| Action | Permission Level | How To | Result |
|--------|------------------|--------|--------|
| [Action 1] | Tier 1 only | [Steps] | [What happens] |
| [Action 2] | Tier 1 & 2 | [Steps] | [What happens] |

**Admin Dashboard Metrics:**
| Metric | Description | Location |
|--------|-------------|----------|
| [Metric 1] | [What it shows] | [Where to find] |

**Troubleshooting:**
| Issue | Cause | Solution |
|-------|-------|----------|
| [Issue 1] | [Why it happens] | [How to fix] |

---

### 6.3 Technical Reference

*For developers and system administrators*

#### API Endpoints

| Method | Endpoint | Auth | Description | Request | Response |
|--------|----------|------|-------------|---------|----------|
| GET | `/api/v1/[path]` | [Required/Optional] | [Description] | `{...}` | `{...}` |
| POST | `/api/v1/[path]` | [Required/Optional] | [Description] | `{...}` | `{...}` |

**Example Request:**
```bash
curl -X POST "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/[endpoint]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

**Example Response:**
```json
{
  "success": true,
  "data": {...}
}
```

#### Database Schema

**Table: [table_name]**
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| [column] | [type] | [Yes/No] | [default] | [description] |

**Indexes:**
- `idx_[name]` on `[columns]` — [Purpose]

**Foreign Keys:**
- `[column]` → `[table].[column]`

#### Configuration Options

| Setting | Location | Default | Options | Description |
|---------|----------|---------|---------|-------------|
| [Setting 1] | [wrangler.toml/env] | [default] | [options] | [what it does] |

#### Error Codes

| Code | HTTP Status | Meaning | Resolution |
|------|-------------|---------|------------|
| [ERR_001] | 400 | [Description] | [How to fix] |
| [ERR_002] | 401 | [Description] | [How to fix] |
| [ERR_003] | 403 | [Description] | [How to fix] |

---

### 6.4 Security Considerations

| Concern | Mitigation | Implementation |
|---------|------------|----------------|
| [Concern 1] | [How mitigated] | [Where implemented] |
| [Concern 2] | [How mitigated] | [Where implemented] |

---

### 6.5 Integration Points

**Integrates With:**
| System | Direction | Purpose | Data Exchanged |
|--------|-----------|---------|----------------|
| [System 1] | Inbound | [Why] | [What data] |
| [System 2] | Outbound | [Why] | [What data] |

**Events Triggered:**
| Event | When | Payload | Subscribers |
|-------|------|---------|-------------|
| [event_name] | [Trigger condition] | `{...}` | [Who listens] |

---

### 6.6 Performance & Limits

| Metric | Limit | Reason | Exceeded Behavior |
|--------|-------|--------|-------------------|
| [Rate limit] | [X/minute] | [Why] | [What happens] |
| [Data limit] | [X MB] | [Why] | [What happens] |

---

## 7. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | [SCOPE_X] | [Why this scope needs X] |
| **Enables** | [SCOPE_Z] | [What this scope enables] |
| **Blocks** | [SCOPE_Y] | [What cannot start until this completes] |

---

## 8. VERIFICATION CHECKLIST

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | [Requirement from HANDOFF_DOCUMENT] | [ ] | [Link/Screenshot] |
| 2 | [Requirement from HANDOFF_DOCUMENT] | [ ] | [Link/Screenshot] |

---

## 9. LOCKED FILES

*Files protected from modification. Unlock required before changes.*

| File | Last Working Commit | Lock Date | Verified By |
|------|---------------------|-----------|-------------|
| [path/to/file] | [commit hash] | [date] | Session [#] |

---

## 10. SCOPE HISTORY

| Date | Action | By | Session | Notes |
|------|--------|----|---------|-------|
| [Date] | Created (EMPTY) | Director | [#] | Initial scope file |
| [Date] | AUDITED | Claude Code | [#] | Reality check complete |
| [Date] | SPECIFIED | Claude Web | [#] | Requirements added |
| [Date] | IMPLEMENTED | Claude Code | [#] | V1 complete |
| [Date] | DOCUMENTED | Claude Code | [#] | FEATURE_GUIDE added |

---

*Scope Template v2.0 — Enhanced with FEATURE_GUIDE for post-launch documentation*
*AADOS: AI-Augmented Development & Operations System*
