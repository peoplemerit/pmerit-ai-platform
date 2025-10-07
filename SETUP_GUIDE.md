# 🚀 PMERIT Frontend Setup Guide

Complete guide for setting up the frontend implementation environment with Claude and GitHub Copilot automation.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Repository Structure](#repository-structure)
3. [Configuration Files](#configuration-files)
4. [GitHub Setup](#github-setup)
5. [Workflow Overview](#workflow-overview)
6. [Quick Start](#quick-start)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- **GitHub Repository** with proper permissions
- **GitHub Actions** enabled
- **Git** installed locally (optional, can use GitHub Web UI)

### Recommended
- **GitHub Copilot** subscription (Individual or Business)
- **VS Code** with GitHub Copilot extension
- **Node.js 20+** (for local linting)

---

## Repository Structure

After setup, your repository should look like this:

```
pmerit-ai-platform/
│
├── .copilot/                           # Copilot configuration
│   ├── config.yml                      # Main Copilot settings
│   ├── instructions.md                 # Review instructions
│   ├── hints/
│   │   ├── html-style-guide.md
│   │   ├── css-style-guide.md
│   │   └── js-structure-tips.md
│   ├── prompts/
│   │   ├── review-prompts.md
│   │   └── design-consistency.md
│   ├── Pmerit-theme_typography.html    # Brand reference
│   └── blueprint-index.html            # Desktop layout reference
│
├── .github/
│   └── workflows/
│       └── frontend-review.yml         # Auto-review workflow
│
├── assets/                              # Frontend assets (to be created)
│   ├── css/
│   ├── js/
│   └── img/
│
├── partials/                            # HTML components (to be created)
│
├── .htmlhintrc                          # HTML linter config
├── .stylelintrc.json                    # CSS linter config
├── .eslintrc.json                       # JavaScript linter config
├── INSTRUCTIONS_Claude.md               # Claude implementation guide
├── INSTRUCTIONS_Copilot.md              # Copilot audit guide
├── PROJECT_OVERVIEW.md                  # Project coordination
├── SETUP_GUIDE.md                       # This file
└── README.md                            # Project overview
```

---

## Configuration Files

### Step 1: Create `.copilot/` folder structure

Using **GitHub Web UI**:

1. Navigate to your repository
2. Click **Add file** → **Create new file**
3. In the filename field, type: `.copilot/config.yml`
4. Paste the content from the `config.yml` artifact
5. Click **Commit changes**
6. Repeat for each file in the `.copilot/` directory

**Files to create:**
- `.copilot/config.yml`
- `.copilot/instructions.md`
- `.copilot/hints/html-style-guide.md`
- `.copilot/hints/css-style-guide.md`
- `.copilot/hints/js-structure-tips.md`
- `.copilot/prompts/review-prompts.md`
- `.copilot/prompts/design-consistency.md`

### Step 2: Move existing reference files to `.copilot/`

Move these files (if they're in the root):
- `Pmerit-theme_typography.html` → `.copilot/Pmerit-theme_typography.html`
- `blueprint-index.html` → `.copilot/blueprint-index.html`

### Step 3: Create GitHub Actions workflow

1. Create `.github/workflows/frontend-review.yml`
2. Paste content from the workflow artifact
3. Commit the file

### Step 4: Create linter configurations

Create these files in the repository root:
- `.htmlhintrc`
- `.stylelintrc.json`
- `.eslintrc.json`

### Step 5: Create instruction files

Create in repository root:
- `INSTRUCTIONS_Claude.md`
- `INSTRUCTIONS_Copilot.md`
- `PROJECT_OVERVIEW.md`

---

## GitHub Setup

### Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select:
   - ✅ **Read and write permissions**
3. Click **Save**

### Enable Copilot (if available)

1. Go to **Settings** → **Copilot**
2. Enable **Copilot for Pull Requests**
3. Configure permissions as needed

### Set up Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

---

## Workflow Overview

### How It Works

```
┌──────────────┐
│ 1. Claude    │  Creates/modifies frontend files
│   Creates    │  (HTML, CSS, JavaScript)
│   Files      │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 2. Commit &  │  Claude commits changes
│    Push       │  and pushes to GitHub
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 3. GitHub    │  Workflow automatically triggers
│    Actions   │  on push or pull request
│    Trigger   │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 4. Lint      │  HTMLHint, Stylelint, ESLint
│    Checks    │  run automatically
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 5. Copilot   │  Reviews code using .copilot/
│    Review    │  config and instructions
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 6. Post      │  Inline comments on PR
│    Comments  │  + summary report
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ 7. Human     │  Review visual design,
│    Review    │  approve, and merge
└──────────────┘
```

---

## Quick Start

### Option A: GitHub Web UI (Recommended for beginners)

1. **Create all configuration files** (copy-paste from artifacts above)
2. **Commit each file** using GitHub's "Add file" → "Create new file"
3. **Verify structure** by browsing the repository
4. **Start Phase 1** by creating new files in `assets/css/`
5. **Create a Pull Request** to see automated review in action

### Option B: Using Git CLI

```bash
# Clone repository
git clone https://github.com/yourusername/pmerit-ai-platform.git
cd pmerit-ai-platform

# Create directory structure
mkdir -p .copilot/hints .copilot/prompts .github/workflows assets/css assets/js assets/img partials

# Copy all configuration files (from artifacts)
# ... (paste content into each file)

# Add and commit
git add .
git commit -m "Setup: Add frontend implementation environment config"
git push origin main
```

---

## Testing the Setup

### Test 1: Verify GitHub Actions

1. Make a small change to any `.html`, `.css`, or `.js` file
2. Commit and push (or create via Web UI)
3. Go to **Actions** tab in GitHub
4. You should see the workflow running
5. Check that all jobs complete successfully

### Test 2: Verify Linters

The workflow will automatically run:
- **HTMLHint** on all `.html` files
- **Stylelint** on all `.css` files
- **ESLint** on all `.js` files

Check the workflow logs to see lint results.

### Test 3: Verify Copilot Review

1. Create a test Pull Request
2. Add a test HTML file with a small issue (e.g., missing alt text)
3. Copilot should post a review comment pointing out the issue
4. Summary comment should appear in the PR

---

## Troubleshooting

### Issue: GitHub Actions workflow not running

**Solution:**
1. Check that workflow file is in `.github/workflows/frontend-review.yml`
2. Verify GitHub Actions is enabled in repository settings
3. Check that file paths in `on.paths` match your structure
4. Look for YAML syntax errors in the workflow file

### Issue: Linters not running

**Solution:**
1. Check Node.js is available in the workflow (it should be installed automatically)
2. Verify linter config files exist (`.htmlhintrc`, `.stylelintrc.json`, `.eslintrc.json`)
3. Check workflow logs for installation errors

### Issue: Copilot not posting comments

**Solution:**
1. Verify you have GitHub Copilot subscription
2. Check that Copilot is enabled in repository settings
3. Ensure workflow has `pull-requests: write` permission
4. Check that `.copilot/config.yml` and `.copilot/instructions.md` exist

### Issue: Workflow permissions error

**Solution:**
1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select:
   - ✅ **Read and write permissions**
3. Click **Save**
4. Re-run the workflow

---

## Next Steps

Once setup is complete:

1. ✅ **Read** `PROJECT_OVERVIEW.md` for workflow understanding
2. ✅ **Review** `INSTRUCTIONS_Claude.md` for implementation phases
3. ✅ **Start Phase 1**: Setup & Theme Foundation
4. ✅ **Create Pull Request** after Phase 1 completion
5. ✅ **Review Copilot feedback** and iterate
6. ✅ **Continue** through all phases

---

## Support

### Documentation References
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Complete workflow overview
- [INSTRUCTIONS_Claude.md](./INSTRUCTIONS_Claude.md) - Implementation guide
- [INSTRUCTIONS_Copilot.md](./INSTRUCTIONS_Copilot.md) - Audit guide
- [.copilot/instructions.md](.copilot/instructions.md) - Copilot review rules

### External Resources
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [HTMLHint Rules](https://htmlhint.com/docs/user-guide/list-rules)
- [Stylelint Rules](https://stylelint.io/user-guide/rules)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)

---

## Checklist: Setup Complete

Before starting implementation, verify:

- [ ] All `.copilot/` files created
- [ ] GitHub Actions workflow file created
- [ ] Linter configuration files created
- [ ] Instruction files created (Claude, Copilot, Overview)
- [ ] Reference files moved to `.copilot/` folder
- [ ] GitHub Actions enabled in repository settings
- [ ] Workflow permissions set to "Read and write"
- [ ] Test workflow runs successfully
- [ ] Linters execute without errors

**✅ Setup Complete!** You're ready to begin Phase 1 implementation.

---

**Last Updated:** 2025-01-07  
**Maintained By:** PMERIT Platform Team
