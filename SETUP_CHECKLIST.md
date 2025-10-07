# ✅ PMERIT Frontend Setup Checklist

Use this checklist to ensure all configuration files are in place before starting frontend implementation.

---

## 📁 Configuration Files to Create

### `.copilot/` Directory (7 files)

#### Core Configuration
- [ ] `.copilot/config.yml` - Main Copilot settings
- [ ] `.copilot/instructions.md` - Review instructions

#### Hints (3 files)
- [ ] `.copilot/hints/html-style-guide.md` - HTML best practices
- [ ] `.copilot/hints/css-style-guide.md` - CSS standards
- [ ] `.copilot/hints/js-structure-tips.md` - JavaScript guidelines

#### Prompts (2 files)
- [ ] `.copilot/prompts/review-prompts.md` - Review templates
- [ ] `.copilot/prompts/design-consistency.md` - Design checks

---

### Reference Files to Move

- [ ] Move `Pmerit-theme_typography.html` → `.copilot/Pmerit-theme_typography.html`
- [ ] Move `blueprint-index.html` → `.copilot/blueprint-index.html`

*Note: These files should already exist in your project knowledge.*

---

### `.github/` Directory (1 file)

- [ ] `.github/workflows/frontend-review.yml` - GitHub Actions automation

---

### Root Directory Files (6 files)

#### Linter Configurations
- [ ] `.htmlhintrc` - HTML linter settings
- [ ] `.stylelintrc.json` - CSS linter settings
- [ ] `.eslintrc.json` - JavaScript linter settings

#### Documentation
- [ ] `INSTRUCTIONS_Claude.md` - Claude implementation guide
- [ ] `INSTRUCTIONS_Copilot.md` - Copilot audit guide
- [ ] `PROJECT_OVERVIEW.md` - Project coordination doc

---

## 🔧 GitHub Repository Settings

### GitHub Actions Configuration
- [ ] Go to **Settings** → **Actions** → **General**
- [ ] Set **Workflow permissions** to "Read and write"
- [ ] Click **Save**

### GitHub Copilot (Optional but Recommended)
- [ ] Go to **Settings** → **Copilot**
- [ ] Enable **Copilot for Pull Requests** (if available)

### Branch Protection (Recommended)
- [ ] Go to **Settings** → **Branches**
- [ ] Add rule for `main` branch
- [ ] ✅ Require pull request reviews
- [ ] ✅ Require status checks to pass

---

## 🧪 Verification Tests

### Test 1: File Structure
```bash
# Verify all files exist
.copilot/config.yml
.copilot/instructions.md
.copilot/hints/html-style-guide.md
.copilot/hints/css-style-guide.md
.copilot/hints/js-structure-tips.md
.copilot/prompts/review-prompts.md
.copilot/prompts/design-consistency.md
.copilot/Pmerit-theme_typography.html
.copilot/blueprint-index.html
.github/workflows/frontend-review.yml
.htmlhintrc
.stylelintrc.json
.eslintrc.json
INSTRUCTIONS_Claude.md
INSTRUCTIONS_Copilot.md
PROJECT_OVERVIEW.md
```

- [ ] All files present in correct locations

### Test 2: GitHub Actions
- [ ] Create a test file (e.g., `test.html`)
- [ ] Commit and push
- [ ] Go to **Actions** tab
- [ ] Verify workflow runs successfully
- [ ] Check that lint jobs complete

### Test 3: Pull Request Automation
- [ ] Create a test branch
- [ ] Make a small change to a `.html` file
- [ ] Create Pull Request
- [ ] Verify Copilot review comment appears
- [ ] Verify labels are added automatically

---

## 📊 File Count Summary

| Category | Files | Status |
|----------|-------|--------|
| `.copilot/` configuration | 7 | ☐ |
| `.github/` workflows | 1 | ☐ |
| Linter configs | 3 | ☐ |
| Documentation | 3 | ☐ |
| Reference files | 2 | ☐ |
| **TOTAL** | **16** | **0/16** |

---

## 🚀 Ready to Start?

Once all checkboxes are ✅ checked:

1. **Read** `PROJECT_OVERVIEW.md` for complete workflow
2. **Review** `INSTRUCTIONS_Claude.md` for Phase 1 tasks
3. **Begin** Phase 1: Setup & Theme Foundation
4. **Commit** regularly with clear messages
5. **Create PR** after completing each phase
6. **Review** Copilot feedback and iterate

---

## 📝 Quick Copy-Paste Filenames

For easy file creation in GitHub Web UI:

```
.copilot/config.yml
.copilot/instructions.md
.copilot/hints/html-style-guide.md
.copilot/hints/css-style-guide.md
.copilot/hints/js-structure-tips.md
.copilot/prompts/review-prompts.md
.copilot/prompts/design-consistency.md
.github/workflows/frontend-review.yml
.htmlhintrc
.stylelintrc.json
.eslintrc.json
INSTRUCTIONS_Claude.md
INSTRUCTIONS_Copilot.md
PROJECT_OVERVIEW.md
SETUP_GUIDE.md
```

---

## ⚠️ Common Mistakes to Avoid

- ❌ **Don't** skip the `.copilot/` folder — it's essential
- ❌ **Don't** forget to enable GitHub Actions permissions
- ❌ **Don't** hardcode colors in CSS — use variables
- ❌ **Don't** mix up file locations (.copilot/ vs root)
- ❌ **Don't** skip linter config files — they ensure quality

✅ **Do** follow the exact directory structure
✅ **Do** test the workflow before starting Phase 1
✅ **Do** commit frequently with descriptive messages
✅ **Do** create PRs for each phase
✅ **Do** respond to Copilot feedback

---

## 🎯 Success Indicators

You'll know setup is complete when:

1. ✅ All 16 configuration files are created
2. ✅ GitHub Actions workflow runs successfully
3. ✅ Linters execute without errors
4. ✅ Copilot posts review comments on test PR
5. ✅ Directory structure matches documentation

---

**Status:** ☐ Not Started | ⏳ In Progress | ✅ Complete

**Current Phase:** Setup

**Next Step:** Begin Phase 1 (Setup & Theme Foundation)

---

**Pro Tip:** Create all files in one session to avoid forgetting any. Use the GitHub Web UI "Add file" feature to create them one by one, or use Git CLI to batch-create them locally and push all at once.

---

**Setup Time Estimate:** 30-45 minutes  
**Difficulty:** Easy (copy-paste from artifacts)

**Let's build something amazing! 🚀**
