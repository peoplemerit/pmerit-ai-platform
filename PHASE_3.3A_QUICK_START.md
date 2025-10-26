# 🚀 Quick Start: Phase 3.3-A Issue Creation

This guide gets you up and running in **under 5 minutes**.

## What This Does

Creates **12 GitHub issues** for Phase 3.3-A (Classroom Virtual Human MVP):
- 1 Epic tracking issue
- 11 implementation issues (features, infra, docs, QA)

## Prerequisites

```bash
# 1. Check GitHub CLI is installed
gh --version

# 2. Authenticate (if not already)
gh auth login

# 3. Navigate to repository root
cd /path/to/pmerit-ai-platform
```

## Three Simple Steps

### Step 1: Create Labels (First Time Only)
```bash
./create-labels.sh
```
⏱️ Takes ~5 seconds

### Step 2: Create Issues
```bash
./create-phase-3.3A-issues.sh
```
⏱️ Takes ~15 seconds

### Step 3: Verify
```bash
gh issue list --label "phase:3.3"
```
✅ Should show 12 new issues

## That's It! 🎉

Your Phase 3.3-A issues are now ready in GitHub.

## Next Steps

1. **View Issues:** Visit your GitHub repository Issues tab
2. **Review Epic:** Look at the Epic issue for overall tracking
3. **Assign Work:** Distribute issues to team members
4. **Start Coding:** Begin with Issue #2 (branch creation)

## Need Help?

- **Full Documentation:** See `PHASE_3.3A_ISSUES_README.md`
- **Implementation Plan:** See `PHASE_3.3A_SUMMARY.md`
- **Step-by-Step Checklist:** See `PHASE_3.3A_CHECKLIST.md`

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `gh: command not found` | Install GitHub CLI: https://cli.github.com/ |
| `You are not logged into any GitHub hosts` | Run: `gh auth login` |
| `permission denied` | Run: `chmod +x create-*.sh` |
| Labels not found | Run: `./create-labels.sh` first |

---

**Files in This Package:**
- ✅ `create-labels.sh` - Creates required GitHub labels
- ✅ `create-phase-3.3A-issues.sh` - Creates all 12 issues
- 📖 `PHASE_3.3A_QUICK_START.md` - This file
- 📖 `PHASE_3.3A_ISSUES_README.md` - Full documentation
- 📖 `PHASE_3.3A_SUMMARY.md` - Implementation overview
- 📖 `PHASE_3.3A_CHECKLIST.md` - Detailed checklist
