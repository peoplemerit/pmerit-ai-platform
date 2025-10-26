#!/bin/bash

# Phase 3.3-A: Classroom Virtual Human (WebGL) MVP - GitHub Issues Creation Script
# This script creates all GitHub issues for the Phase 3.3-A implementation

set -e

echo "Creating Phase 3.3-A GitHub Issues..."
echo "======================================"

# 1) Epic – Phase 3.3-A: Classroom Virtual Human (WebGL) MVP
echo "Creating Epic issue..."
gh issue create \
  --title "Epic: Phase 3.3-A — Classroom Virtual Human (WebGL) MVP" \
  --label "phase:3.3,area:frontend,area:ux,area:workers,type:epic,priority:P1" \
  --body-file <(cat << 'EOF'
**Goal**  
Deliver a Cloudflare-only Virtual Human (Convai + Reallusion, WebGL) inside `classroom.html` with speech, captions, and basic lip-sync.

**Why**  
Enable "Virtual Human Mode" for classroom experiences without GPU/Unreal. Establish provider abstraction to swap engines later.

**Scope (3.3-A Classroom Only)**  
- DOM hooks and toggle in `classroom.html`  
- WebGL avatar load (Reallusion-exported GLB)  
- Voice via Workers AI TTS (+ captions)  
- Lip-sync from viseme JSON (Convai or fallback map)  
- Accessibility/fallbacks (audio-only, captions)  
- QA + docs

**Out of Scope (Defer)**  
- Front page integration (3.3-B)  
- Pixel Streaming/MetaHuman (3.4)  

**Acceptance**  
- Toggle ON plays TTS + animates mouth; OFF shows text-only.  
- Captions visible and accurate.  
- Works on Chrome/Edge/Firefox desktop; degrades to audio-only if WebGL unsupported.  
- No secrets in client; calls proxied via Workers.  

**Links**  
- TASK_DIVISION_CLAUDE_CHATGPT.md (phase coordination)  
- PHASE_2_DATABASE_SCHEMA_FINAL.md (user/session refs as needed)  
- PRODUCTION_INTEGRATION_REQUIREMENTS_FINAL.md (Cloudflare-first)  
- running-chat-history.txt (context)
EOF
)

# 2) Branch creation & scaffolding
echo "Creating branch scaffolding issue..."
gh issue create \
  --title "Create branch: feat/phase-3.3A-virtual-human-classroom" \
  --label "phase:3.3,area:frontend,type:chore,priority:P1" \
  --body-file <(cat << 'EOF'
**Goal**  
Create the working branch and initial folders for avatar modules.

**Tasks**  
- Create branch: `feat/phase-3.3A-virtual-human-classroom`  
- Add `/assets/js/avatar/` with placeholders:  
  - `AvatarManager.js` (provider interface)  
  - `WebGLProvider.js` (Three.js loader/renderer)  
  - `LipSyncVisemes.js` (phoneme→blendshape map)  
  - `AudioPlayer.js` (HTMLAudioElement wrapper with events)  
- Add `/assets/css/avatar.css` (canvas sizing, captions)  
- Wire basic imports in `classroom.html` (defer functionality to later issues)

**Acceptance**  
- Branch exists; files scaffolded; site builds on Cloudflare Pages.
EOF
)

# 3) Cloudflare Workers endpoints for TTS/STT (no secrets in client)
echo "Creating Workers TTS/STT issue..."
gh issue create \
  --title "Workers: Implement /api/tts and /api/stt with viseme JSON contract" \
  --label "phase:3.3,area:workers,type:feature,priority:P1" \
  --body-file <(cat << 'EOF'
**Goal**  
Provide secure endpoints for voice synthesis and (optional) speech-to-text, returning audio + viseme timing JSON.

**Tasks**  
- `/api/tts` POST `{ text, voice?:string, speed?:number }` → `{ audioUrl, visemes:[{v,t}], duration }`  
- `/api/stt` POST `{ audioBase64 }` → `{ text }` (scaffold; can be stubbed in 3.3-A)  
- Use Workers AI (TTS/STT) or proxy to vendor; keys in Workers secrets.  
- Set CORS to site origin; rate limit by session.  
- Store generated audio short-lived (R2 or ephemeral cache).

**Acceptance**  
- Client can fetch audio + visemes for typical 1–3 sentence replies within 1–2s.  
- No keys exposed; logs redact PII.
EOF
)

# 4) R2 bucket & build pipeline for avatar assets (GLB + anims)
echo "Creating R2 bucket issue..."
gh issue create \
  --title "R2: Create bucket for Reallusion avatar GLB and animation clips" \
  --label "phase:3.3,area:frontend,area:infra,type:infra,priority:P1" \
  --body-file <(cat << 'EOF'
**Goal**  
Host WebGL avatar files via CDN while keeping repo light.

**Tasks**  
- Create R2 bucket `pmerit-avatars` (private or public-read via signed URLs).  
- Add Worker or Pages config to fetch GLB/anims.  
- Document asset path envs: `AVATAR_BASE_URL`, `AVATAR_MODEL`, `AVATAR_IDLE_CLIP`, etc.  
- Optional: add small placeholder GLB for dev.

**Acceptance**  
- `WebGLProvider` can load the GLB and idle animation from R2 in staging and prod.
EOF
)

# 5) Implement WebGLProvider (Three.js) with idle + speak animations
echo "Creating WebGLProvider issue..."
gh issue create \
  --title "Avatar: Implement WebGLProvider (Three.js) with idle & speak lifecycle" \
  --label "phase:3.3,area:frontend,type:feature,priority:P1" \
  --body-file <(cat << 'EOF'
**Goal**  
Load and render Reallusion GLB in a Three.js scene with basic animation control.

**Tasks**  
- Load GLB via GLTFLoader; set up camera, light, renderer.  
- Play `idle` loop by default; expose `speakStart()` / `speakStop()` for lip-sync.  
- Optimize: pixel ratio clamp, pause when tab hidden, dispose on teardown.  
- Canvas sizing responsive to classroom layout.

**Acceptance**  
- Avatar appears and idles smoothly at ~30–60fps on modern desktop.  
- No memory leaks on repeated toggles.
EOF
)

# 6) Lip-sync mapping & audio playback sync
echo "Creating Lip-sync issue..."
gh issue create \
  --title "Audio + Lip-sync: Map visemes to blendshapes and sync with TTS audio" \
  --label "phase:3.3,area:frontend,type:feature,priority:P1" \
  --body-file <(cat << 'EOF'
**Goal**  
Synchronize mouth shapes to TTS visemes while playing audio.

**Tasks**  
- Implement `LipSyncVisemes.apply(t)` to set morphTargetInfluences based on timeline `{v,t}`.  
- Provide fallback heuristic (basic open/close rhythm) when visemes missing.  
- `AudioPlayer` emits `onProgress(ms)`; WebGLProvider reads and updates morphs.  
- Support speed adjustments (0.9–1.1x).

**Acceptance**  
- Mouth movement tracks audio convincingly across sample sentences.  
- Fallback still looks acceptable without vendor visemes.
EOF
)

# 7) classroom.html integration (DOM hooks, toggle, captions)
echo "Creating Classroom UI integration issue..."
gh issue create \
  --title "Classroom UI: Integrate Virtual Human canvas, toggle, and captions" \
  --label "phase:3.3,area:frontend,area:ux,type:feature,priority:P1" \
  --body-file <(cat << 'EOF'
**Goal**  
Wire the avatar into the classroom view with a user-facing toggle and captions area.

**Tasks**  
- Insert `<canvas id="vh-canvas">` and `<div id="vh-captions">`.  
- Add toggle button/switch bound to `AvatarManager.setEnabled(bool)`.  
- Pipe AI replies to both chat bubble and `AvatarManager.speak(text, meta)`.  
- Style captions for readability; AA contrast.

**Acceptance**  
- Toggle ON: audio + avatar + captions. OFF: text-only.  
- Layout matches current classroom design and is responsive.
EOF
)

# 8) Accessibility & fallbacks (audio-only, reduced motion)
echo "Creating Accessibility issue..."
gh issue create \
  --title "Accessibility: Captions, audio-only fallback, reduced-motion support" \
  --label "phase:3.3,area:ux,type:enhancement,priority:P1" \
  --body-file <(cat << 'EOF'
**Goal**  
Ensure inclusive use across varied devices and user needs.

**Tasks**  
- Captions always visible; aria-live for updates.  
- Respect `prefers-reduced-motion`: lower animation intensity/frequency.  
- Detect WebGL support; if missing, show audio-only portrait and captions.  
- Keyboard focus order; toggle accessible name/role.

**Acceptance**  
- Lighthouse Accessibility ≥ 95 on classroom page.  
- Works without WebGL; no blocking errors.
EOF
)

# 9) Privacy, security & CSP
echo "Creating Security issue..."
gh issue create \
  --title "Security: No secrets in client, origin-locked APIs, CSP headers" \
  --label "phase:3.3,area:workers,area:frontend,type:security,priority:P1" \
  --body-file <(cat << 'EOF'
**Goal**  
Harden endpoints and client against leakage and abuse.

**Tasks**  
- Move all keys to Workers secrets; rotate test keys.  
- Lock `/api/*` to site origin; add rate limits per session.  
- Tighten CSP: script-src, connect-src (R2, Workers, RPM if embedded), media-src for audio.  
- Log redaction for PII; include request IDs for traces.

**Acceptance**  
- Security review passes; no keys visible in browser devtools; CSP blocks unexpected origins.
EOF
)

# 10) Performance & network controls
echo "Creating Performance issue..."
gh issue create \
  --title "Perf: Frame budget, pause on tab hidden, bandwidth modes" \
  --label "phase:3.3,area:frontend,type:performance,priority:P2" \
  --body-file <(cat << 'EOF'
**Goal**  
Keep the feature smooth on modest hardware and networks.

**Tasks**  
- Cap pixel ratio; throttle render loop if GPU spikes.  
- Auto-pause render/audio when tab hidden; resume on focus.  
- Add low-bandwidth mode: captions + audio-only toggle.  
- Monitor TTS response times; cache short phrases.

**Acceptance**  
- FPS stable; no runaway CPU/GPU; low-bandwidth mode reduces data by >70%.
EOF
)

# 11) QA plan & cross-browser matrix
echo "Creating QA issue..."
gh issue create \
  --title "QA: Cross-browser/device matrix and test cases for Classroom Virtual Human" \
  --label "phase:3.3,area:qa,type:testing,priority:P1" \
  --body-file <(cat << 'EOF'
**Goal**  
Validate functionality and UX consistency.

**Tasks**  
- Browsers: Chrome, Edge, Firefox (latest); macOS Safari (visual check).  
- Tests: toggle behavior, captions accuracy, viseme sync sanity, audio latency, fallback on WebGL off.  
- Accessibility checks (keyboard, screen reader readouts).  
- Record defects and screenshots.

**Acceptance**  
- All P1 cases pass; known issues documented with workarounds.
EOF
)

# 12) Developer docs and handoff
echo "Creating Documentation issue..."
gh issue create \
  --title "Docs: Classroom Virtual Human README and integration notes" \
  --label "phase:3.3,area:frontend,type:docs,priority:P2" \
  --body-file <(cat << 'EOF'
**Goal**  
Provide clear setup/use instructions and future upgrade notes.

**Tasks**  
- README: architecture, data contracts (viseme JSON), env vars, R2 paths.  
- How to add new avatars/animations.  
- How to switch providers (future Pixel Streaming).  
- Known limits and troubleshooting.

**Acceptance**  
- Docs allow a new dev to set up in <30 minutes; links to relevant project files included.
EOF
)

echo ""
echo "======================================"
echo "All Phase 3.3-A issues created successfully!"
echo "======================================"
