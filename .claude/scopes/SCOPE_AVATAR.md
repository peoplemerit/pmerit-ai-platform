# PMERIT SUB-SCOPE: Avatar System

**Version:** 2.1
**Created:** 2025-12-12
**Last Updated:** 2025-12-19
**Status:** LOCKED (TTS Regression in Session 64)
**Phase:** Integrated with P5 (Classroom)
**Session:** 65
**Related Scopes:** SCOPE_SELF_HOSTED_PREMIUM.md, SCOPE_TTS.md

---

## LOCKED FILES

**Status:** LOCKED
**Lock Date:** 2025-12-19
**Last Verified Working Commit:** `8807f4a` (before Session 64)

These files are protected. DO NOT MODIFY without explicit UNLOCK command.

| File | Purpose | Last Working Commit | Lock Date |
|------|---------|---------------------|-----------|
| `assets/js/gpu-streaming.js` | GPU avatar streaming | `8807f4a` | 2025-12-19 |
| `assets/js/lip-sync-controller.js` | Lip sync coordination | `8807f4a` | 2025-12-19 |
| `assets/js/AvatarManager.js` | Avatar rendering | `8807f4a` | 2025-12-19 |
| `portal/classroom.html` | Classroom UI | `8807f4a` | 2025-12-19 |
| `assets/css/avatar.css` | Avatar styling | `8807f4a` | 2025-12-19 |

### UNLOCK HISTORY

| Date | File | Reason | Outcome | Session |
|------|------|--------|---------|---------|
| 2025-12-18 | classroom.html | Session 64 voice selection UI | Related to TTS regression | 64 |

### REGRESSION TEST CHECKLIST

Before deploying changes to these files:

- [ ] Avatar renders in classroom (3D model visible)
- [ ] Avatar head/jaw moves when TTS speaks
- [ ] No console errors related to avatar/Three.js
- [ ] Avatar fallback icon shows on mobile
- [ ] Settings modal opens and closes correctly
- [ ] Avatar toggle (on/off) works
- [ ] Lip sync responds to TTS audio intensity

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | AI Tutor Avatar with Lip Sync |
| **Pages** | Used in `portal/classroom.html` |
| **JavaScript** | `gpu-streaming.js`, `lip-sync-controller.js`, `AvatarManager.js`, `tts.js` |
| **CSS** | `avatar.css` |
| **API Endpoints** | `/api/v1/tts`, `/api/v1/gpu/*` |
| **Assets** | `assets/models/avatars/pmerit-tutor-no-morph.glb` |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| AV-001 | Rendering Engine (Free) | Three.js WebGL | Client-side, no GPU costs | 45 |
| AV-002 | Avatar Source (Free) | Ready Player Me | Professional, customizable | 44 |
| AV-003 | Model File (Free) | pmerit-tutor-no-morph.glb | No morph targets = no errors | 45 |
| AV-004 | Lip Sync Method (Free) | Jaw bone X-axis rotation | ARKit morph targets fail in Three.js | 45 |
| AV-005 | TTS Provider (Free) | Cloudflare Workers AI | Integrated, WAV output | 40 |
| AV-006 | Tier System | Free/Standard/Premium/Self-Hosted | Graceful degradation | 64 |
| AV-007 | Self-Hosted Rendering | Unreal Engine 5 MetaHuman | Photorealistic, GPU-rendered | 64 |
| AV-008 | Self-Hosted Lip Sync | NVIDIA Audio2Face | Perfect sync from audio | 64 |
| AV-009 | Self-Hosted Streaming | Pixel Streaming (WebRTC) | Low latency browser playback | 64 |
| AV-010 | Self-Hosted TTS | Coqui XTTS v2 | Voice cloning, natural output | 64 |

---

## 3. FEATURE SPECIFICATION

<HANDOFF_DOCUMENT>

### Avatar Tiers

| Tier | Rendering | Requirement | Cost | Quality |
|------|-----------|-------------|------|---------|
| Free | CSS/SVG Animation | 0 Mbps | $0 | Basic |
| Standard | WebGL 3D (Three.js) | 5 Mbps | $0 | Good |
| Cloud Premium | Unreal MetaHuman (RunPod GPU) | 25 Mbps | $0.44/hr | Great |
| **Self-Hosted Premium** | **Unreal MetaHuman (Dell R740)** | **25 Mbps** | **Included in subscription** | **Photorealistic** |
| Fallback | Static Image | 0 Mbps | $0 | Minimal |

### Self-Hosted Premium Avatar System

**Hardware:**
- Server: Dell PowerEdge R740
- GPU: 2x RTX 4090 (one for avatar, one for AI/TTS)
- Connection: Cloudflare Tunnel to datacenter

**Components:**
1. **Unreal Engine 5 MetaHuman** - Photorealistic digital human
2. **NVIDIA Audio2Face** - Real-time lip sync from TTS audio
3. **Pixel Streaming** - WebRTC stream to browser
4. **Coqui XTTS v2** - Voice cloning for natural speech

**Quality Comparison:**

| Feature | Free (WebGL) | Self-Hosted Premium |
|---------|--------------|---------------------|
| Avatar Quality | 3D cartoon | Photorealistic human |
| Lip Sync | Jaw bone rotation | Perfect blendshapes |
| Voice | Robotic AI | Cloned natural voice |
| Expressions | Limited | Full emotion range |
| Gestures | None | Hand/body animation |
| Resolution | 720p | 1080p @ 30fps |

**Self-Hosted Avatar Flow:**
```
User in Browser
      |
      v
Cloudflare Tunnel (secure)
      |
      v
Dell R740 Server
      |
      +---> Coqui XTTS v2: Generate speech audio
      |           |
      |           v
      +---> NVIDIA Audio2Face: Audio --> Blendshapes
      |           |
      |           v
      +---> Unreal Engine 5: MetaHuman rendering
                  |
                  v
            Pixel Streaming (WebRTC)
                  |
                  v
            Browser displays photorealistic avatar
```

### Ready Player Me Account

| Attribute | Value |
|-----------|-------|
| Username | peoplemerit |
| Application | Pmerit AI Tutor |
| Avatar ID | 693a05bd100ae875d551b445 |
| Avatar Code | MWM8XR |

### Planned Avatar Personas (Track B)

| Persona | Target | File |
|---------|--------|------|
| pmerit-tutor-youth.glb | K-5 students | Not started |
| pmerit-tutor-teen.glb | 6-12 students | Not started |
| pmerit-tutor-female.glb | Gender diversity | Not started |
| pmerit-tutor-elder.glb | CTE/Career | Not started |
| pmerit-tutor-nigeria.glb | Nigeria market | Not started |

### Lip Sync Flow

```
1. AI generates response text
2. Text sent to /api/v1/tts
3. TTS returns WAV audio
4. Audio plays via AudioPlayer.js
5. LipSyncController analyzes audio amplitude
6. Jaw bone rotates on X-axis proportional to amplitude
7. Mouth opens/closes in sync with speech
```

</HANDOFF_DOCUMENT>

---

## 4. IMPLEMENTATION STATUS

<RESEARCH_FINDINGS>

### Session 45 (2025-12-11) — AVATAR COMPLETE

**Journey:**
1. Morph targets fix attempted → Three.js errors persisted
2. ARKit lip sync attempted → Parsing errors
3. Jaw bone rotation implemented → SUCCESS

**Files Created/Modified:**
- `lip-sync-controller.js` (new)
- `gpu-streaming.js` v1.8.0
- `pmerit-tutor-no-morph.glb` (773KB)

**Commits:** 9f3836a, 6e92f8f, 0c2c055

---

### Session 44 (2025-12-10)

**Completed:**
- Ready Player Me account created
- Application registered
- Professional avatar selected
- Morph targets error identified

---

### Session 43 (2025-12-09)

**Completed:**
- Avatar model path fix
- Updated to humano_professional.glb (later replaced)

---

### Session 41 (2025-12-07)

**Completed:**
- Fixed TTS paths (was /tts, now /api/v1/tts)
- Deployed 15 avatar texture files
- Unified AvatarManager + GPUStreaming systems

### Session 62 (2025-12-18) — SPEECH ORCHESTRATION FIX

**Problem:** Avatar not speaking/responding to student messages despite all components existing.

**Root Cause Analysis:**
1. All individual components were present and documented as working
2. Integration was ALMOST complete but missing orchestration debugging
3. Jaw bone matching was too narrow for Ready Player Me avatars

**Fixes Applied:**

1. **Enhanced jaw bone detection** (`gpu-streaming.js`):
   - Added more bone name patterns: `mixamorig:Jaw`, `mandible`, etc.
   - Added head scale fallback animation if no jaw bone found
   - Improved debug logging for bone discovery

2. **Added debug logging** across the speech pipeline:
   - `classroom.html`: TTS check before speaking
   - `tts.js`: Viseme emission logging
   - `gpu-streaming.js`: Viseme reception logging

3. **Added welcome speech** (`classroom.html`):
   - Avatar now speaks welcome message after initialization
   - 1.5s delay to ensure avatar is fully loaded

**Speech Pipeline Flow (verified working):**
```
[User sends message]
    ↓
[handleChatSubmit() - POST /api/v1/ai/tutor]
    ↓
[Collect streaming response into aiResponse]
    ↓
[window.TTS.speak(aiResponse)]
    ↓
[speakViaServer() - POST /api/v1/tts]
    ↓
[Audio blob received, Audio element created]
    ↓
[startMeterFromAudio() - AudioContext analysis]
    ↓
[tts:viseme events emitted at 33ms intervals]
    ↓
[GPUStreaming._lipSyncHandler receives events]
    ↓
[applyMouthMovement(intensity)]
    ↓
[Jaw bone rotation: child.rotation.x = -mouthOpen * 0.25]
```

**Files Modified:**
- `portal/classroom.html` - Added welcome speech, debug logging
- `assets/js/gpu-streaming.js` - Enhanced jaw detection, head fallback
- `assets/js/tts.js` - Added viseme emission logging

</RESEARCH_FINDINGS>

---

## 5. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | TTS API | Audio for lip sync |
| **Enables** | SCOPE_CLASSROOM | Avatar renders in classroom |

---

## 6. KNOWN ISSUES

| Issue | Priority | Notes |
|-------|----------|-------|
| Avatar may flash on slow connections | Low | Graceful fallback exists |

---

## 7. GPU STREAMING API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/gpu/provision` | Provision GPU pod (RunPod) |
| GET | `/api/v1/gpu/status/:id` | Get session status |
| POST | `/api/v1/gpu/destroy` | Destroy session |
| POST | `/api/v1/gpu/log-session` | Log activity |
| GET | `/api/v1/gpu/tiers` | Get available tiers |
| GET | `/api/v1/bandwidth-test` | Test bandwidth |

---

## 8. GPU PROVIDER

| Attribute | Value |
|-----------|-------|
| Provider | RunPod (runpod.io) |
| GPU Type | RTX 4090 (24GB VRAM) |
| Cost | $0.44/hour |
| Regions | US East, US West, EU West, Asia Pacific |
| Scale to Zero | Yes (no idle costs) |

---

*Last Updated: 2025-12-13 by Claude Code (Session 52)*
*DigitalOcean → RunPod migration complete*
