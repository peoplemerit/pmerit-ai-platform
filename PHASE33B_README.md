# Phase 3.3-B GitHub Issues Script

This script creates all Phase 3.3-B GitHub issues for the PMERIT AI Platform, focusing on Virtual Human (VH) integration, Customer Service Mode (CSM), and related enhancements.

## Overview

Phase 3.3-B focuses on:
- **Virtual Human Mode**: WebGL avatar integration with Three.js, Convai, and Reallusion
- **Customer Service Mode**: Compact assistant widget for support inquiries
- **Brand Consistency**: Restoring design system colors and typography
- **Infrastructure**: CSP policies, environment configuration, and asset paths
- **Performance**: Audio-only fallback, accessibility features
- **Analytics**: Event tracking for user interactions
- **Documentation**: Comprehensive runbook and setup guides

## Prerequisites

Before running this script, ensure you have:

1. **GitHub CLI (gh) installed and authenticated**
   ```bash
   gh --version
   gh auth status
   ```

2. **Repository access with issue creation permissions**
   - You must be a collaborator or have appropriate permissions in the `peoplemerit/pmerit-ai-platform` repository

3. **Authentication setup** (if not already authenticated):
   ```bash
   gh auth login
   ```

## Usage

### Quick Start

From the repository root directory:

```bash
# Make the script executable (if not already)
chmod +x phase33b_issues.sh

# Run the script
./phase33b_issues.sh
```

### What the Script Does

The script will create **15 GitHub issues** with the following labels:
- `phase:3.3-B` - Identifies all Phase 3.3-B work
- `area:frontend` - Marks frontend-related tasks
- Additional specific labels per issue (e.g., `bug`, `enhancement`, `security`, etc.)

### Issues Created

1. **BUG: VH toggle renders generic widget, not WebGL avatar**
   - Labels: `phase:3.3-B`, `area:frontend`

2. **FEATURE: Customer Service Mode uses compact Support widget**
   - Labels: `phase:3.3-B`, `area:frontend`, `mode:customer-service`, `enhancement`

3. **BUG: Brand regression: colors & typography drifted from blueprint**
   - Labels: `phase:3.3-B`, `area:frontend`, `design`, `bug`

4. **TASK: Add DOM hooks/IDs for VH home (canvas + captions)**
   - Labels: `phase:3.3-B`, `area:frontend`, `implementation`

5. **TASK: Wire AvatarManager lifecycle (enable/disable + lazy-load)**
   - Labels: `phase:3.3-B`, `area:frontend`, `implementation`

6. **TASK: Update CSP/connect-src for audio & provider endpoints**
   - Labels: `phase:3.3-B`, `area:frontend`, `security`, `infra`

7. **PERF: Audio-only fallback & prefers-reduced-motion support**
   - Labels: `phase:3.3-B`, `area:frontend`, `performance`, `accessibility`

8. **ANALYTICS: Track VH/CSM toggles, first reply, CTA clicks**
   - Labels: `phase:3.3-B`, `area:frontend`, `analytics`

9. **ROUTING: 'Begin Assessment' & 'Sign Up' CTAs route correctly**
   - Labels: `phase:3.3-B`, `area:frontend`, `routing`

10. **TASK: Integrate /api/session/summary Worker (MVP payload)**
    - Labels: `phase:3.3-B`, `area:frontend`, `backend`, `worker`

11. **TASK: ENV template & asset paths for avatars**
    - Labels: `phase:3.3-B`, `area:frontend`, `devx`

12. **UI: VH section layout (canvas size, captions, status strip)**
    - Labels: `phase:3.3-B`, `area:frontend`, `design`

13. **BUG: Mic permission flow & lip-sync alignment**
    - Labels: `phase:3.3-B`, `area:frontend`, `bug`, `audio`

14. **TASK: Clarify chip actions: 'VH Mode' & 'Read About'**
    - Labels: `phase:3.3-B`, `area:frontend`, `ux`, `accessibility`

15. **DOCS: Phase 3.3-B README + operator runbook**
    - Labels: `phase:3.3-B`, `area:frontend`, `docs`

## Verification

After running the script, verify the issues were created:

```bash
# List all Phase 3.3-B issues
gh issue list --label "phase:3.3-B"

# View a specific issue
gh issue view <issue-number>
```

## Troubleshooting

### Error: "You are not logged into any GitHub hosts"
**Solution**: Authenticate with GitHub CLI:
```bash
gh auth login
```

### Error: "Permission denied"
**Solution**: Make the script executable:
```bash
chmod +x phase33b_issues.sh
```

### Error: "HTTP 403: Resource not accessible by integration"
**Solution**: Ensure you have write access to the repository:
- Check repository permissions
- Verify you're authenticated as a user with collaborator access

### Error: "Label 'phase:3.3-B' does not exist"
**Solution**: The script will fail if labels don't exist. Create labels first:
```bash
gh label create "phase:3.3-B" --color "0366d6" --description "Phase 3.3-B tasks"
gh label create "area:frontend" --color "d93f0b" --description "Frontend development"
# ... create other labels as needed
```

Or modify the script to remove label parameters temporarily.

## Script Features

- **Error Handling**: Uses `set -euo pipefail` for strict error checking
- **Consistent Metadata**: All issues share common labels for easy filtering
- **Descriptive Content**: Each issue includes clear acceptance criteria
- **Modular Function**: `create_issue()` helper for consistency

## Related Documentation

For context on this phase, refer to:
- `Pmerit comprehensively narrative users and Admin Journey.txt` (attached to original issue)
- Project documentation in `.copilot/` directory
- `PROJECT_OVERVIEW.md` for platform architecture

## Support

If you encounter issues not covered in troubleshooting:
1. Check the GitHub CLI documentation: https://cli.github.com/manual/
2. Review repository permissions and access
3. Contact the repository maintainers

---

**Script Version**: 1.0  
**Created**: Phase 3.3-B Redo  
**Maintainer**: PMERIT Development Team
