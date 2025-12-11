# PMERIT SESSION 46 HANDOFF

**Date:** December 11, 2025
**Status:** CLASSROOM REDESIGN - Planning Complete

---

## Session 46 Summary

### Major Accomplishments

1. **Avatar System COMPLETE (Session 45)**
   - Ready Player Me avatar rendering successfully
   - Jaw bone lip sync implemented (gpu-streaming.js v1.8.0)
   - Model: pmerit-tutor-no-morph.glb (773KB)
   - Technical note: ARKit morph targets cause Three.js parsing errors

2. **Classroom Redesign Planning**
   - Analyzed current UI vs front page design
   - Received Gemini UX recommendations
   - Defined App Shell architecture specifications

3. **Documentation Updates**
   - STATE.json updated to Session 46
   - TASK_TRACKER.md updated with new tasks
   - Session 45 handoff finalized

---

## Classroom Redesign Specifications

### App Shell Architecture

Convert classroom from scrollable webpage to fixed viewport application:

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (fixed)                                             │
├──────────────┬─────────────────────────┬───────────────────┤
│              │                         │                   │
│  LEFT PANEL  │    CENTER STAGE         │   RIGHT PANEL     │
│  (tabbed)    │    (video/content)      │   (AI Chat)       │
│              │                         │                   │
│  - Outline   │    [Avatar PIP]         │   [Chat History]  │
│  - Notes     │                         │                   │
│  - Resources │    [Playback Controls]  │   [Input Bar]     │
│              │                         │                   │
├──────────────┴─────────────────────────┴───────────────────┤
│  (no footer - full viewport)                               │
└─────────────────────────────────────────────────────────────┘
```

### Phase 1: App Shell Foundation
- `body/html`: height: 100vh; overflow: hidden
- 3-column flex layout fills viewport
- Internal scrolling only within panels
- Dark theme background (#0f1419)

### Phase 2: Layout Restructure
- **LEFT**: Tabbed interface (Outline | Notes | Resources)
- **CENTER**: Remove "Preview Mode" banner, dock avatar as PIP
- **RIGHT**: Match "Support Assistant" styling from front page
- **CONTROLS**: Unified playback bar at bottom of center stage

### Phase 3: Visual Polish
- Remove hard borders → background colors + shadows
- Increase border-radius (8-12px)
- Glassmorphism on floating elements
- Style file upload button

### Files to Modify
- `portal/classroom.html` - Layout restructure
- `assets/css/classroom.css` - New dedicated stylesheet
- `assets/js/classroom.js` - Tab switching logic
- `assets/js/gpu-streaming.js` - Avatar PIP positioning

---

## Avatar System Status

### Current Configuration
| Item | Value |
|------|-------|
| Model | pmerit-tutor-no-morph.glb |
| Size | 773KB |
| Rendering | Three.js WebGL |
| Lip Sync | Jaw bone X-axis rotation |
| Status | COMPLETE |

### Ready Player Me Account
| Item | Value |
|------|-------|
| Username | peoplemerit |
| Application | Pmerit AI Tutor |
| Avatar ID | 693a05bd100ae875d551b445 |
| Avatar Code | MWM8XR |

### Planned Additional Avatars
User creating via Ready Player Me:
- pmerit-tutor-youth.glb (K-5 students)
- pmerit-tutor-teen.glb (6-12 students)
- pmerit-tutor-female.glb (gender diversity)
- pmerit-tutor-elder.glb (CTE/Career)
- pmerit-tutor-nigeria.glb (Nigeria market)

### Technical Notes
- ARKit morph targets (`?morphTargets=ARKit`) cause Three.js parsing errors
- Use `?morphTargets=none` parameter for stable avatar
- Jaw bone rotation works reliably for lip sync

---

## Session 45 Commits

| Commit | Description |
|--------|-------------|
| 9f3836a | fix: Use Ready Player Me avatar without morph targets |
| 6e92f8f | feat: TTS lip sync with ARKit blend shapes (failed) |
| 0c2c055 | fix: Use jaw bone animation for lip sync (v1.8.0) |
| c7e4d4a | docs: Session 45 handoff |

---

## Premium Tier Architecture (Future)

### Decision Made
Cloud AI avatar services (HeyGen, Akool, Synthesia, D-ID) are incompatible with free education at scale. Ready Player Me + Three.js is the only sustainable path for free tier.

### Pricing Tiers Planned
| Tier | Price | Features |
|------|-------|----------|
| FREE | $0 | Ready Player Me avatar |
| BASIC | $5/mo | Priority support + certificates |
| PREMIUM | $20/mo | Limited live tutoring |
| PRO | $50/mo | Unlimited MetaHuman + live tutoring |

### Premium Tech Stack (Future)
- DigitalOcean GPU droplets (H100)
- WebRTC for live human tutoring
- Unreal Pixel Streaming for MetaHuman AI

---

## Roadmap

### Track A: Classroom Redesign (Priority)
- [ ] CLASSROOM-1: App Shell foundation (100vh fixed)
- [ ] CLASSROOM-2: Dark theme implementation
- [ ] CLASSROOM-3: Tabbed left panel
- [ ] CLASSROOM-4: Docked avatar PIP
- [ ] CLASSROOM-5: Unified playback controls

### Track B: Avatar Diversity
- [ ] AVATAR-1: Avatar selection system
- [ ] AVATAR-2: Download additional Ready Player Me avatars
- [ ] AVATAR-3: Implement avatar picker in classroom

### Track C: ARCH-2 Core Features
- [ ] Credential issuance API
- [ ] Blockchain hash generation
- [ ] AI persona selection in classroom

---

## Production Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | Healthy | pmerit.com |
| Backend API | Healthy | v2.2.0, 40 endpoints |
| AI Chat | Healthy | Streaming working |
| Avatar | Healthy | Rendering correctly |
| TTS | Healthy | Audio playing |
| Database | Healthy | 96 tables |

---

## Reference Documents

| Document | Purpose |
|----------|---------|
| PMERIT_ARCHITECTURE_FINAL.md | Master architecture spec |
| PMERIT_HANDOFF_SESSION_45.md | Previous session (avatar) |
| PRODUCTION_AUDIT_2025-12-09.md | Latest comprehensive audit |
| STATE.json | Machine state (Session 46) |

---

## Next Session Start Commands

```
PMERIT CONTINUE
```

Expected response will show:
- Phase: CLASSROOM UX REDESIGN
- Next: CLASSROOM-1 (App Shell foundation)
- Avatar: COMPLETE

---

*Session 46 Handoff Created: December 11, 2025*
*Next Focus: Classroom App Shell Implementation*
