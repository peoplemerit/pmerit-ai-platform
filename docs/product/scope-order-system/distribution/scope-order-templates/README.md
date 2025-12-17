# Scope Order System - Templates

**Version:** 1.0
**Thank you for your purchase!**

---

## Quick Setup (15 minutes)

### Step 1: Create Directory Structure

In your project root, run:

```bash
# Create .claude directories
mkdir -p .claude/scopes

# Create docs directories
mkdir -p docs/aados
mkdir -p docs/handoffs
```

### Step 2: Copy Templates

Copy these files to your project:

| From This Package | To Your Project |
|-------------------|-----------------|
| `templates/CLAUDE.md` | `.claude/CLAUDE.md` |
| `templates/CLAUDE_WEB_SYNC.md` | `.claude/CLAUDE_WEB_SYNC.md` |
| `templates/SYSTEM_GUIDE.md` | `.claude/SYSTEM_GUIDE.md` |
| `templates/MASTER_SCOPE.md` | `.claude/scopes/MASTER_SCOPE.md` |
| `templates/SCOPE_TEMPLATE.md` | `.claude/scopes/` (copy as needed) |
| `templates/GOVERNANCE.md` | `docs/aados/GOVERNANCE.md` |
| `templates/STATE.json` | `docs/aados/STATE.json` |

### Step 3: Customize

1. Open `.claude/CLAUDE.md`
2. Replace `[PROJECT NAME]` with your project name
3. Replace `[PROJECT]` in commands with your prefix (e.g., `MYAPP`)

4. Open `.claude/scopes/MASTER_SCOPE.md`
5. Fill in your project details

### Step 4: Setup Claude Web

1. Go to claude.ai
2. Open your project
3. Click "Set project instructions"
4. Paste your project context (see CLAUDE_WEB_SYNC.md for template)

### Step 5: Commit & Test

```bash
git add .claude/ docs/aados/
git commit -m "chore: Setup Scope Order System"
```

Then start Claude Code and type:
```
[YOURPROJECT] CONTINUE
```

---

## Package Contents

```
scope-order-templates/
├── README.md              <- You are here
├── LICENSE.md             <- Usage terms
└── templates/
    ├── CLAUDE.md          <- Claude Code instructions
    ├── CLAUDE_WEB_SYNC.md <- Claude Web sync file
    ├── SYSTEM_GUIDE.md    <- Complete reference guide
    ├── MASTER_SCOPE.md    <- Project vision template
    ├── SCOPE_TEMPLATE.md  <- Per-feature scope template
    ├── GOVERNANCE.md      <- Workflow rules
    └── STATE.json         <- State tracking
```

---

## Quick Reference

### Commands

| Command | Effect |
|---------|--------|
| `[PROJECT] CONTINUE` | Start session with full protocol |
| `AUDIT SCOPE: [name]` | Audit reality for a feature |
| `SCOPE UPDATED: [name]` | Implement after specs written |
| `SCOPE: [name]` | Load existing scope context |

### Workflow

```
1. Create empty SCOPE_[NAME].md
2. AUDIT SCOPE: [name] -> Claude Code checks reality
3. Share audit with Claude Web
4. Brainstorm specs with Claude Web
5. SCOPE UPDATED: [name] -> Claude Code implements
6. Repeat
```

---

## Need Help?

- Read the full eBook for detailed explanations
- Check SYSTEM_GUIDE.md for troubleshooting
- Email: [your-support-email]

---

*Scope Order System - Stop re-explaining. Start shipping.*
