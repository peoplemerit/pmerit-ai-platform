# AADOS Visual Walkthrough Protocol (VWP)

**Version:** 1.0
**Created:** December 24, 2025
**Session:** 77
**Status:** Active Control

---

## Purpose

The Visual Walkthrough Protocol (VWP) is a mandatory quality control step that validates scope implementations through end-to-end user journey testing with real screenshots. It prevents the "built but not connected" problem where backend infrastructure exists but frontend user flows don't utilize it.

### Why This Control Exists

In Session 77, we discovered that despite building:
- ✅ K-12 database tables
- ✅ Age-appropriate dashboard HTML files
- ✅ K12 API routes
- ✅ Parent portal backend

The actual user experience was broken because:
- ❌ Registration form had no K-12 options
- ❌ No routing logic to age-appropriate dashboards
- ❌ Parent consent flow not connected

**This control ensures we catch these gaps BEFORE closing a scope.**

---

## When to Execute VWP

### Mandatory Triggers

| Trigger | Action |
|---------|--------|
| Scope reaches "Phase Complete" | Execute VWP before marking scope COMPLETE |
| Major feature implementation | Execute VWP for that feature's user journey |
| Before production deployment | Execute VWP for all affected user flows |
| Sprint completion | Execute VWP for sprint deliverables |

### Command

```
WALKTHROUGH: [SCOPE_NAME] [USER_PERSONA]
```

**Examples:**
- `WALKTHROUGH: SCOPE_K12_EDUCATION parent_with_child`
- `WALKTHROUGH: SCOPE_ASSESSMENT adult_learner`
- `WALKTHROUGH: SCOPE_CLASSROOM k12_student_grade3`

---

## VWP Execution Steps

### Step 1: Define Persona & Scenario

Before starting, clearly define:

```markdown
**Persona:** [Who is the user?]
**Scenario:** [What are they trying to accomplish?]
**Expected Outcome:** [What should happen end-to-end?]
**Scope Being Tested:** [Which scope implementation?]
```

**Example:**
```markdown
**Persona:** Parent of 8-year-old
**Scenario:** Register child for K-12 learning platform
**Expected Outcome:** Child account created → K-12 profile → Age-appropriate dashboard
**Scope Being Tested:** SCOPE_K12_EDUCATION Phase 4
```

### Step 2: Execute Step-by-Step with Screenshots

1. Start from the ENTRY POINT (usually homepage, logged out)
2. Execute ONE ACTION per step
3. User provides SCREENSHOT after each action
4. Claude analyzes screenshot and documents:
   - What is visible
   - What is expected
   - Any GAPs identified
5. Continue until END STATE or BLOCKER

### Step 3: Document Gaps in Real-Time

For each gap found, record:

| Field | Description |
|-------|-------------|
| GAP-ID | Sequential number (GAP-1, GAP-2, etc.) |
| Category | Security, K-12, UX, UI, API, etc. |
| Description | Clear description of the issue |
| Severity | 🔴 Critical / 🟡 Medium / 🟢 Low |
| Screenshot | Which step screenshot shows this |
| Expected | What should have happened |
| Actual | What actually happened |

### Step 4: Generate GAP Report

After walkthrough completes, generate formal report:

```
docs/aados/GAP_REPORT_[SCOPE]_[DATE].md
```

Report includes:
- Executive summary
- Gap registry table
- Root cause analysis
- Flow diagrams (current vs expected)
- Recommended fixes with priority
- Screenshots reference

### Step 5: Update Scope Status

Based on VWP results:

| Result | Action |
|--------|--------|
| No Critical Gaps | Scope can be marked COMPLETE |
| Critical Gaps Found | Scope remains IN_PROGRESS, gaps become tasks |
| Blocker Found | Scope marked BLOCKED, escalate |

---

## Standard User Personas

### Adult Learner Personas

| ID | Persona | Description | Entry Point |
|----|---------|-------------|-------------|
| `adult_new` | New Adult User | First-time visitor, no account | Homepage |
| `adult_returning` | Returning Adult | Has account, logged out | Homepage |
| `adult_enrolled` | Enrolled Adult | Has courses, active progress | Dashboard |

### K-12 Personas

| ID | Persona | Description | Entry Point |
|----|---------|-------------|-------------|
| `parent_new` | New Parent | Registering child for first time | Homepage |
| `parent_returning` | Returning Parent | Checking child's progress | Parent Portal |
| `k12_student_k2` | K-2 Student (5-7 yrs) | Young learner, simplified UI | K-2 Dashboard |
| `k12_student_35` | Grade 3-5 Student (8-10 yrs) | Gamified experience | 3-5 Dashboard |
| `k12_student_68` | Grade 6-8 Student (11-13 yrs) | Social/competitive UI | 6-8 Dashboard |
| `k12_student_912` | Grade 9-12 Student (14-18 yrs) | Professional UI | 9-12 Dashboard |

### CTE/Vocational Personas

| ID | Persona | Description | Entry Point |
|----|---------|-------------|-------------|
| `cte_student` | CTE Student | Vocational training focus | CTE Dashboard |
| `employer_partner` | Employer | Reviewing candidate credentials | Employer Portal |

### Admin Personas

| ID | Persona | Description | Entry Point |
|----|---------|-------------|-------------|
| `admin_tier1` | Super Admin | Full system access | Admin Portal |
| `admin_tier2` | Content Admin | Course/content management | Admin Portal |
| `instructor` | Instructor | Teaching and grading | Instructor Portal |

---

## Standard Scenarios by Scope

### SCOPE_K12_EDUCATION

| Scenario | Persona | Steps |
|----------|---------|-------|
| K-12 Registration | `parent_new` | Homepage → Register → K-12 Options → Grade Select → Parent Consent → Child Dashboard |
| K-12 Learning | `k12_student_35` | Login → Dashboard → Start Lesson → Complete → Earn XP |
| Parent Oversight | `parent_returning` | Login → Parent Portal → View Child Progress → Adjust Controls |

### SCOPE_ASSESSMENT

| Scenario | Persona | Steps |
|----------|---------|-------|
| Career Assessment | `adult_new` | Homepage → Begin Assessment → Complete Questions → View Results → Pathway Recommendations |
| K-12 Assessment | `k12_student_68` | Dashboard → Age-Appropriate Assessment → Results |

### SCOPE_CLASSROOM

| Scenario | Persona | Steps |
|----------|---------|-------|
| Enter Classroom | `adult_enrolled` | Dashboard → Enter Classroom → AI Tutor Interaction |
| K-12 Classroom | `k12_student_35` | Dashboard → Start Adventure → AI Persona (Mr. Explorer) |

### SCOPE_DASHBOARD

| Scenario | Persona | Steps |
|----------|---------|-------|
| First Login | `adult_new` | Register → Verify → First Dashboard View |
| Progress Check | `adult_enrolled` | Login → Dashboard → View Progress → Enrolled Courses |

---

## Gap Severity Definitions

| Severity | Symbol | Definition | Action Required |
|----------|--------|------------|-----------------|
| **Critical** | 🔴 | Blocks core functionality, security risk, compliance violation | Must fix before scope completion |
| **High** | 🔴 | Major feature broken, poor UX for primary flow | Should fix before scope completion |
| **Medium** | 🟡 | Feature works but suboptimal, secondary flow affected | Can fix in next iteration |
| **Low** | 🟢 | Minor polish, edge case, cosmetic issue | Backlog item |
| **Info** | ℹ️ | Observation, future consideration, positive note | Document only |

---

## Integration with AADOS Workflow

### Modified Scope Completion Checklist

Before marking any scope COMPLETE, verify:

```markdown
## Scope Completion Checklist

- [ ] All requirements implemented
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] **VWP Executed** ← NEW MANDATORY STEP
- [ ] **GAP Report generated** ← NEW
- [ ] **No Critical Gaps remaining** ← NEW
- [ ] Deployed to staging
- [ ] Deployed to production
```

### STATE.json Update

Add VWP tracking to STATE.json:

```json
{
  "scope_order": {
    "active_scope": "SCOPE_K12_EDUCATION",
    "phase": "Phase 4",
    "vwp_status": "pending|in_progress|complete|gaps_found",
    "last_vwp_date": "2025-12-24",
    "gap_report": "GAP_REPORT_K12_REGISTRATION_FLOW.md",
    "critical_gaps_count": 14
  }
}
```

### Task Tracker Integration

When gaps are found, automatically create tasks:

```markdown
## From VWP: GAP_REPORT_K12_REGISTRATION_FLOW.md

| Task | Priority | Status | Gap Reference |
|------|----------|--------|---------------|
| Add Account Type selector to registration | P0 | pending | GAP-4 |
| Add DOB field for COPPA compliance | P0 | pending | GAP-5 |
| Add Grade Level dropdown | P0 | pending | GAP-6 |
| Implement dashboard routing by gradeCode | P0 | pending | GAP-13 |
```

---

## Command Reference

| Command | Description |
|---------|-------------|
| `WALKTHROUGH: [SCOPE] [PERSONA]` | Start VWP for scope with persona |
| `VWP STATUS` | Check current VWP status |
| `VWP GAPS` | List all open gaps from last VWP |
| `VWP REPORT: [SCOPE]` | Generate/view GAP report |
| `CLOSE GAP: [GAP-ID]` | Mark gap as resolved |

---

## Example VWP Session

```
User: WALKTHROUGH: SCOPE_K12_EDUCATION parent_new

Claude: Starting Visual Walkthrough Protocol

**Persona:** Parent of 8-year-old (parent_new)
**Scenario:** Register child for K-12 platform
**Scope:** SCOPE_K12_EDUCATION Phase 4
**Expected Flow:** Homepage → Register → K-12 → Grade → Parent Consent → Child Dashboard

---

### Step 1: Navigate to Homepage

**Action:** Go to https://pmerit.com (logged out)

**Expected:** Homepage with clear K-12 registration path visible

Please provide screenshot.

---

[User provides screenshot]

---

### Step 1 Analysis

**Observed:** Homepage shows generic "Start Learning" button
**GAP-1 Identified:** 🔴 No visible K-12 specific CTA

---

### Step 2: Click Registration

**Action:** Click "Start Learning" to access registration

Please provide screenshot.

---

[Continue step by step...]
```

---

## Appendix: Gap Report Template

```markdown
# GAP REPORT: [Scope Name]

**Report ID:** GAP-YYYY-MM-DD-[SCOPE]-001
**Date:** [Date]
**Session:** [Session Number]
**Scope:** [Scope Name and Phase]
**Conducted By:** Visual Walkthrough Protocol
**Scenario:** [User scenario tested]

---

## Executive Summary
[2-3 sentence summary of findings]

## Gap Registry
[Table of all gaps found]

## Root Cause Analysis
[Diagrams and explanation of why gaps exist]

## Recommended Fixes
[Prioritized list of fixes]

## Screenshots Reference
[Link to screenshots or descriptions]

---
*Generated by AADOS Visual Walkthrough Protocol*
```

---

*Version 1.0 - December 24, 2025*
*AADOS Quality Control System*
