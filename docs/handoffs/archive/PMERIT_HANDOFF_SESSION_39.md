# PMERIT Handoff - Session 39

**Date:** December 7, 2025
**Status:** In Progress
**Primary Focus:** Virtual Classroom WebGL Avatar + Digital Desk UX

---

## Session Summary

Session 39 focused on fixing classroom issues identified in screenshots:
- Three.js GLTFLoader compatibility
- VH container visibility
- WebGL 3D avatar rendering
- API endpoint issues

---

## Completed Tasks

### 1. Three.js GLTFLoader Fix
- [x] Downgraded Three.js from 0.160.0 to r128 (0.128.0)
- [x] r128 is the last version with global `THREE.GLTFLoader` via script tag
- [x] Removed import map (not needed for r128)
- **Commit:** `bd460e6`

### 2. VH Container Visibility Fix
- [x] Updated `updateVHToggle()` to properly show/hide `vh-root` container
- [x] When enabled: removes `is-hidden` class, removes `hidden` attribute
- [x] When disabled: adds `is-hidden`, sets `hidden` attribute
- **Commit:** `b8be5fe`

### 3. WebGL Auto-Loading
- [x] Made `selectTierForBandwidth()` async
- [x] Auto-loads WebGL avatar when tier is `standard`
- [x] Waits one animation frame for container sizing
- **Commit:** `b8be5fe`

### 4. Previous Session Fixes (Still Active)
- [x] Guest/preview mode for classroom (no login required)
- [x] Visual completion indicators for lessons (checkmarks, progress %)
- [x] API_BASE_URL fixed to use backend worker
- [x] CSP updated to include cdn.jsdelivr.net

---

## Remaining Issues

### 1. Avatar Initialization Failed
**Error:** "Avatar initialization failed. Using audio-only mode."

**Root Cause:** Two competing avatar systems:
- `AvatarManager` - Uses WebGL canvas for lip-sync/animation
- `GPUStreaming` - Uses Three.js for 3D model rendering

The `AvatarManager.init()` is failing, which triggers the error message.

**Files Involved:**
- `assets/js/avatar/AvatarManager.js`
- `assets/js/gpu-streaming.js`
- `portal/classroom.html`

### 2. TTS API 404 Error
**Error:** `pmerit-api-worker.peoplemerit.workers.dev/tts:1 Failed to load resource: 404`

**Location:** `AvatarManager.js:203:15` calling `_getTTS()`

**Action Needed:** Check if `/api/v1/tts` endpoint exists in backend worker.

### 3. UX Design Flaw (Gemini Recommendation)
The current error screen blocks the Main Stage, preventing students from seeing lesson content when avatar fails.

---

## Recommended Next Steps: "Digital Desk" Refactor

Based on Gemini's analysis, implement these changes:

### A. Layout Restructuring
1. **Separate Main Stage from Avatar:**
   - Create persistent `#main-stage` container for lesson content
   - Never obscure with avatar errors

2. **Floating Avatar Widget:**
   - Move `#vh-root` to a draggable, floating position (300x400px)
   - Default position: Top-Right
   - Style: Rounded corners, drop shadow, glassmorphism

### B. Graceful Fallback Logic
**CRITICAL:** Remove red error overlay. Replace with silent fallback.

```javascript
// Current (BAD):
showAvatarError(error); // Shows red error screen

// New (GOOD):
// 1. Try to initialize 3D Avatar
// 2. On failure: Silently swap to static image
// 3. Enable CSS audio waveform visualizer
// 4. Show non-intrusive toast: "Low bandwidth detected. Audio-only mode."
```

**Static Fallback Image:** Create `assets/avatars/ty-static.png`

### C. Drag-and-Drop Assignments
- Add drop listener to Avatar Widget
- Visual feedback: Green glow + "Drop to Submit" overlay
- Log file submission (mock backend call)

### D. Proctoring UI State
- Update `#proctor-status` pill
- `toggleProctorMode(true)`: Red background, pulsing, "Proctoring Active"
- `toggleProctorMode(false)`: Gray, "Proctor: Off"

---

## Files Modified This Session

| File | Changes |
|------|---------|
| `portal/classroom.html` | Three.js r128, updateVHToggle visibility fix |
| `assets/js/gpu-streaming.js` | Async selectTierForBandwidth, auto-load WebGL |

---

## Commits This Session

| Hash | Message |
|------|---------|
| `bd460e6` | fix: Downgrade Three.js to r128 for GLTFLoader compatibility |
| `b8be5fe` | fix: Show vh-root container and auto-load WebGL avatar |

---

## Technical Debt

1. **Two Avatar Systems:** `AvatarManager` and `GPUStreaming.loadWebGLAvatar()` both try to render to canvas. Need to unify or clearly separate responsibilities.

2. **TTS Endpoint Missing:** `/api/v1/tts` returns 404. Either implement in backend or remove TTS dependency from AvatarManager.

3. **Error Handling UX:** Red error screen is hostile to low-bandwidth users. Need graceful degradation.

---

## Carryforward to Session 40

- [ ] Fix TTS API 404 error (backend endpoint or remove dependency)
- [ ] Unify avatar systems (AvatarManager vs GPUStreaming)
- [ ] Implement "Digital Desk" layout with floating avatar widget
- [ ] Add graceful fallback (static image + audio waveform, no red errors)
- [ ] Add drag-and-drop assignment submission to avatar widget
- [ ] Enhance proctoring UI state indicator

---

## Reference Documents

- Feature Spec: `docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md`
- User Journey: `docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md`
- Latest Audit: `docs/aados/PRODUCTION_AUDIT_2025-12-06.md`

---

*Generated: December 7, 2025*
*Session: 39*
