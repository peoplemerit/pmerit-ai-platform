# Phase 3.3-A: Classroom Virtual Human (WebGL) MVP - GitHub Issues

## Overview

This directory contains the scripts and documentation for creating GitHub issues for Phase 3.3-A of the PMERIT AI Platform. Phase 3.3-A focuses on implementing a Cloudflare-only Virtual Human feature in the classroom using WebGL, Convai integration, and Reallusion avatars.

### Files Included

- `create-phase-3.3A-issues.sh` - Main script to create all 12 GitHub issues
- `create-labels.sh` - Helper script to create required GitHub labels
- `PHASE_3.3A_ISSUES_README.md` - This documentation file

## Purpose

Phase 3.3-A aims to:
- Deliver a Virtual Human (Convai + Reallusion, WebGL) inside `classroom.html`
- Provide speech synthesis with captions and basic lip-sync
- Enable "Virtual Human Mode" for classroom experiences without GPU/Unreal
- Establish provider abstraction to swap engines later

## Issues Structure

The script creates **12 GitHub issues** organized as follows:

### Epic Issue
1. **Epic: Phase 3.3-A — Classroom Virtual Human (WebGL) MVP**
   - Overall project goal and acceptance criteria
   - Labels: `phase:3.3,area:frontend,area:ux,area:workers,type:epic,priority:P1`

### Implementation Issues
2. **Create branch: feat/phase-3.3A-virtual-human-classroom**
   - Branch creation and initial folder scaffolding
   - Labels: `phase:3.3,area:frontend,type:chore,priority:P1`

3. **Workers: Implement /api/tts and /api/stt with viseme JSON contract**
   - Cloudflare Workers endpoints for TTS/STT
   - Labels: `phase:3.3,area:workers,type:feature,priority:P1`

4. **R2: Create bucket for Reallusion avatar GLB and animation clips**
   - R2 bucket setup for avatar assets
   - Labels: `phase:3.3,area:frontend,area:infra,type:infra,priority:P1`

5. **Avatar: Implement WebGLProvider (Three.js) with idle & speak lifecycle**
   - Three.js renderer and avatar loading
   - Labels: `phase:3.3,area:frontend,type:feature,priority:P1`

6. **Audio + Lip-sync: Map visemes to blendshapes and sync with TTS audio**
   - Lip-sync implementation with viseme mapping
   - Labels: `phase:3.3,area:frontend,type:feature,priority:P1`

7. **Classroom UI: Integrate Virtual Human canvas, toggle, and captions**
   - UI integration in classroom.html
   - Labels: `phase:3.3,area:frontend,area:ux,type:feature,priority:P1`

8. **Accessibility: Captions, audio-only fallback, reduced-motion support**
   - Accessibility features and fallbacks
   - Labels: `phase:3.3,area:ux,type:enhancement,priority:P1`

9. **Security: No secrets in client, origin-locked APIs, CSP headers**
   - Security hardening and CSP implementation
   - Labels: `phase:3.3,area:workers,area:frontend,type:security,priority:P1`

10. **Perf: Frame budget, pause on tab hidden, bandwidth modes**
    - Performance optimization
    - Labels: `phase:3.3,area:frontend,type:performance,priority:P2`

11. **QA: Cross-browser/device matrix and test cases for Classroom Virtual Human**
    - QA testing and validation
    - Labels: `phase:3.3,area:qa,type:testing,priority:P1`

12. **Docs: Classroom Virtual Human README and integration notes**
    - Developer documentation
    - Labels: `phase:3.3,area:frontend,type:docs,priority:P2`

## Prerequisites

Before running the script, ensure you have:

1. **GitHub CLI (gh) installed**
   ```bash
   # Check if gh is installed
   gh --version
   ```

2. **GitHub authentication configured**
   ```bash
   # Log in to GitHub CLI
   gh auth login
   ```

3. **Repository access**
   - You must have permission to create issues in the `peoplemerit/pmerit-ai-platform` repository

## Usage

### Running the Script

1. **Navigate to the repository root:**
   ```bash
   cd /path/to/pmerit-ai-platform
   ```

2. **Create the required labels (first time only):**
   ```bash
   chmod +x create-labels.sh
   ./create-labels.sh
   ```
   
   This step creates all the necessary GitHub labels. You only need to run this once per repository.

3. **Make the issues script executable (if not already):**
   ```bash
   chmod +x create-phase-3.3A-issues.sh
   ```

4. **Run the script:**
   ```bash
   ./create-phase-3.3A-issues.sh
   ```

### Expected Output

The script will:
- Display progress messages for each issue being created
- Create all 12 issues in sequence
- Display a success message when complete

Example output:
```
Creating Phase 3.3-A GitHub Issues...
======================================
Creating Epic issue...
Creating branch scaffolding issue...
Creating Workers TTS/STT issue...
...
======================================
All Phase 3.3-A issues created successfully!
======================================
```

### Verifying Issues

After running the script, verify the issues were created:

```bash
# List all phase 3.3 issues
gh issue list --label "phase:3.3"

# View a specific issue
gh issue view <issue-number>
```

## Scope

### In Scope for Phase 3.3-A
- DOM hooks and toggle in `classroom.html`
- WebGL avatar load (Reallusion-exported GLB)
- Voice via Workers AI TTS (+ captions)
- Lip-sync from viseme JSON (Convai or fallback map)
- Accessibility/fallbacks (audio-only, captions)
- QA + documentation

### Out of Scope (Deferred)
- Front page integration (Phase 3.3-B)
- Pixel Streaming/MetaHuman (Phase 3.4)

## Technical Architecture

### Frontend Components
- `/assets/js/avatar/AvatarManager.js` - Provider interface
- `/assets/js/avatar/WebGLProvider.js` - Three.js loader/renderer
- `/assets/js/avatar/LipSyncVisemes.js` - Phoneme→blendshape mapping
- `/assets/js/avatar/AudioPlayer.js` - Audio playback wrapper
- `/assets/css/avatar.css` - Avatar styling

### Backend Services
- `/api/tts` - Text-to-speech with viseme data
- `/api/stt` - Speech-to-text (scaffolded)
- R2 bucket: `pmerit-avatars` - Avatar asset storage

### Integration Points
- `classroom.html` - Main integration point
- Cloudflare Workers - API endpoints
- Cloudflare R2 - Asset storage

## Acceptance Criteria

The implementation is complete when:
- ✅ Toggle ON plays TTS + animates mouth; OFF shows text-only
- ✅ Captions visible and accurate
- ✅ Works on Chrome/Edge/Firefox desktop
- ✅ Degrades gracefully to audio-only if WebGL unsupported
- ✅ No secrets in client; all calls proxied via Workers
- ✅ Lighthouse Accessibility score ≥ 95

## Related Documentation

- `TASK_DIVISION_CLAUDE_CHATGPT.md` - Phase coordination
- `PHASE_2_DATABASE_SCHEMA_FINAL.md` - User/session references
- `PRODUCTION_INTEGRATION_REQUIREMENTS_FINAL.md` - Cloudflare-first approach
- `running-chat-history.txt` - Implementation context

## Troubleshooting

### Issue: Script fails with "You are not logged into any GitHub hosts"
**Solution:** Run `gh auth login` to authenticate with GitHub CLI

### Issue: Script fails with "permission denied"
**Solution:** Make the script executable with `chmod +x create-phase-3.3A-issues.sh`

### Issue: Issues created with duplicate content
**Solution:** Check existing issues first with `gh issue list --label "phase:3.3"` to avoid duplicates

### Issue: Labels not recognized
**Solution:** Ensure the repository has the required labels created. You may need to create them first:
```bash
gh label create "phase:3.3" --color "0052CC"
gh label create "area:frontend" --color "1D76DB"
gh label create "area:workers" --color "5319E7"
gh label create "area:ux" --color "D93F0B"
gh label create "type:epic" --color "3E4B9E"
gh label create "type:feature" --color "0E8A16"
gh label create "type:chore" --color "FEF2C0"
gh label create "priority:P1" --color "D93F0B"
gh label create "priority:P2" --color "FBCA04"
```

## Next Steps

After creating the issues:

1. **Review and prioritize** issues in the GitHub project board
2. **Assign** issues to team members
3. **Create the feature branch** as specified in issue #2
4. **Begin implementation** following the task breakdown
5. **Update issues** as work progresses
6. **Link pull requests** to related issues

## Support

For questions or issues with the script:
- Open an issue in the repository
- Tag with `phase:3.3` and `type:support` labels
- Reference this README in your description

---

**Last Updated:** October 25, 2025  
**Phase:** 3.3-A (Classroom Virtual Human - WebGL MVP)  
**Status:** Ready for execution
