# Phase 3.3-A Issue Creation Checklist

Use this checklist to ensure all steps are completed correctly.

## Pre-requisites
- [ ] GitHub CLI installed (`gh --version`)
- [ ] Authenticated with GitHub (`gh auth login`)
- [ ] Repository access verified
- [ ] Current directory is the repository root

## Execution Steps

### 1. Label Setup (First Time Only)
- [ ] Make script executable: `chmod +x create-labels.sh`
- [ ] Run label script: `./create-labels.sh`
- [ ] Verify labels created: `gh label list`

### 2. Issue Creation
- [ ] Make script executable: `chmod +x create-phase-3.3A-issues.sh`
- [ ] Run issues script: `./create-phase-3.3A-issues.sh`
- [ ] Wait for completion message

### 3. Verification
- [ ] List phase 3.3 issues: `gh issue list --label "phase:3.3"`
- [ ] Confirm 12 issues created
- [ ] Review Epic issue content
- [ ] Spot-check 2-3 other issues

## Issue Verification Checklist

Verify each issue was created with correct attributes:

### Epic Issue
- [ ] Title: "Epic: Phase 3.3-A — Classroom Virtual Human (WebGL) MVP"
- [ ] Labels: phase:3.3, area:frontend, area:ux, area:workers, type:epic, priority:P1

### Implementation Issues
- [ ] Issue 2: Branch creation (chore, P1)
- [ ] Issue 3: Workers TTS/STT (feature, P1)
- [ ] Issue 4: R2 bucket (infra, P1)
- [ ] Issue 5: WebGLProvider (feature, P1)
- [ ] Issue 6: Lip-sync (feature, P1)
- [ ] Issue 7: Classroom UI (feature, P1)
- [ ] Issue 8: Accessibility (enhancement, P1)
- [ ] Issue 9: Security (security, P1)
- [ ] Issue 10: Performance (performance, P2)
- [ ] Issue 11: QA testing (testing, P1)
- [ ] Issue 12: Documentation (docs, P2)

## Post-Creation Tasks
- [ ] Add issues to project board (if applicable)
- [ ] Assign initial owners
- [ ] Set up issue tracking/notifications
- [ ] Create the feature branch (Issue #2)
- [ ] Update team on issue availability

## Troubleshooting

### If script fails:
1. Check error message
2. Verify GitHub authentication
3. Confirm repository permissions
4. Review PHASE_3.3A_ISSUES_README.md troubleshooting section
5. Check for duplicate issues

### If labels are missing:
1. Run create-labels.sh again
2. Manually create missing labels via GitHub UI
3. Re-run create-phase-3.3A-issues.sh if needed

### If issues are duplicated:
1. Close duplicate issues
2. Reference original issue numbers
3. Update project board if necessary

## Success Indicators
✅ 12 issues created
✅ All issues have correct labels
✅ Issue descriptions are complete
✅ Epic issue properly structured
✅ Team notified and ready to begin

---
**Script Files:**
- `create-labels.sh` - Label creation
- `create-phase-3.3A-issues.sh` - Issue creation
- `PHASE_3.3A_ISSUES_README.md` - Full documentation
- `PHASE_3.3A_SUMMARY.md` - Implementation overview
