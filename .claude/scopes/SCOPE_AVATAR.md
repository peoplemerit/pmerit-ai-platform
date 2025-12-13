# PMERIT SUB-SCOPE: Avatar System

**Version:** 1.0
**Created:** 2025-12-12
**Last Updated:** 2025-12-12
**Status:** COMPLETE
**Phase:** Integrated with P5 (Classroom)

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
| AV-001 | Rendering Engine | Three.js WebGL | Client-side, no GPU costs | 45 |
| AV-002 | Avatar Source | Ready Player Me | Professional, customizable | 44 |
| AV-003 | Model File | pmerit-tutor-no-morph.glb | No morph targets = no errors | 45 |
| AV-004 | Lip Sync Method | Jaw bone X-axis rotation | ARKit morph targets fail in Three.js | 45 |
| AV-005 | TTS Provider | Cloudflare Workers AI | Integrated, WAV output | 40 |
| AV-006 | Tier System | Free/Standard/Premium | Graceful degradation | 37 |

---

## 3. FEATURE SPECIFICATION

<HANDOFF_DOCUMENT>

### Avatar Tiers

| Tier | Rendering | Requirement | Cost |
|------|-----------|-------------|------|
| Free | CSS/SVG Animation | 0 Mbps | $0 |
| Standard | WebGL 3D (Three.js) | 5 Mbps | $0 |
| Premium | Unreal MetaHuman (RunPod GPU) | 25 Mbps | $0.44/hr (RTX 4090) |
| Fallback | Static Image | 0 Mbps | $0 |

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
