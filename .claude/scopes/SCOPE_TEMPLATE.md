# [PROJECT] SUB-SCOPE: [FEATURE NAME]

**Version:** 1.0
**Created:** [DATE]
**Last Updated:** [DATE]
**Status:** [EMPTY | AUDITED | SPECIFIED | IMPLEMENTED]

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | [e.g., User Authentication] |
| **Pages** | [e.g., login.html, register.html] |
| **JavaScript** | [e.g., auth.js, session.js] |
| **CSS** | [e.g., auth.css] |
| **API Endpoints** | [e.g., /api/v1/auth/*] |
| **Database Tables** | [e.g., users, sessions] |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

These decisions are final. Changes require MASTER_SCOPE update.

| Decision | Choice | Rationale |
|----------|--------|-----------|
| [e.g., Auth Method] | [JWT] | [Stateless, scalable] |
| [e.g., Password Hash] | [bcrypt] | [Industry standard] |

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

### Audit Date: [DATE]

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

#### Requirement 2: [Name]
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

### Handoff Date: [DATE]

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
- [Issue 2] — [How resolved]

**Decisions Made:**
- [Decision 1] — [Rationale]

**Next Steps:**
- [ ] [Next task 1]
- [ ] [Next task 2]

---

### Session [#] — [DATE]

[Repeat format for each session]

---

## 6. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | [SCOPE_X] | [Why this scope needs X] |
| **Requires** | [SCOPE_Y] | [Why this scope needs Y] |
| **Enables** | [SCOPE_Z] | [What this scope enables] |

---

## 7. VERIFICATION CHECKLIST

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | [Requirement from HANDOFF_DOCUMENT] | [ ] | [Link/Screenshot] |
| 2 | [Requirement from HANDOFF_DOCUMENT] | [ ] | [Link/Screenshot] |
| 3 | [Requirement from HANDOFF_DOCUMENT] | [ ] | [Link/Screenshot] |

---

## 8. SCOPE HISTORY

| Date | Action | By | Notes |
|------|--------|----|-------|
| [Date] | Created (EMPTY) | Director | Initial scope file |
| [Date] | AUDITED | Claude Code | Reality check complete |
| [Date] | SPECIFIED | Claude Web | Requirements added |
| [Date] | IMPLEMENTED | Claude Code | V1 complete |

---

*Scope Order System v2 — Reality-First Workflow*
