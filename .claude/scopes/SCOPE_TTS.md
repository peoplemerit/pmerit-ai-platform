# PMERIT SUB-SCOPE: Text-to-Speech (TTS) System

**Version:** 3.1
**Created:** 2025-12-13
**Last Updated:** 2025-12-19
**Status:** LOCKED (Critical Regression Identified - Session 65)
**Phase:** Integrated with Avatar System (P5 Classroom)
**Session:** 65
**Related Scopes:** SCOPE_SELF_HOSTED_PREMIUM.md

---

## LOCKED FILES

**Status:** LOCKED
**Lock Date:** 2025-12-19
**Last Verified Working Commit:** Session 65 fix (post-architecture fix)

These files are protected. DO NOT MODIFY without explicit UNLOCK command.

| File | Purpose | Last Working Commit | Lock Date |
|------|---------|---------------------|-----------|
| `assets/js/tts.js` | TTS orchestration (frontend) | Session 65 | 2025-12-19 |
| `pmerit-api-worker/src/routes/tts.ts` | TTS API (backend) | Session 65 | 2025-12-19 |
| `assets/js/voice-preview.js` | Voice selection UI | Session 65 | 2025-12-19 |
| `assets/css/voice-preview.css` | Voice modal styling | Session 65 | 2025-12-19 |

### UNLOCK HISTORY

| Date | File | Reason | Outcome | Session |
|------|------|--------|---------|---------|
| 2025-12-18 | tts.js | Session 64 voice selection UI | REGRESSION - all voices sound same | 64 |
| 2025-12-19 | tts.js, voice-preview.js | Session 65 architecture fix | SUCCESS - Free voices now use Browser TTS | 65 |

### ARCHITECTURE FIX APPLIED (Session 65)

**Problem:** All free voices sounded identical because they were routing through RunPod.

**Solution:** Free voices now use Browser Web Speech API (client-side):
- `standard-male`: Browser TTS (male voice preference)
- `standard-female`: Browser TTS (female voice preference)
- `standard-young`: Browser TTS (young voice preference)
- `primo`, `primo-female`: Still use RunPod server (premium only)

**Key Changes:**
1. `tts.js`: Added `useServer: false` for free voices in VOICE_OPTIONS
2. `tts.js`: Added `getBrowserVoiceForPreference()` function
3. `voice-preview.js`: Changed provider from 'edge-tts' to 'browser-tts' for free voices

### REGRESSION TEST CHECKLIST

Before deploying changes to these files:

- [ ] Free voices work WITHOUT RunPod running
- [ ] Standard Male and Standard Female sound DIFFERENT
- [ ] Premium voices show "upgrade" prompt for free users
- [ ] TTS plays audio when AI responds in classroom
- [ ] Speech rate slider affects playback speed
- [ ] Avatar head moves when speaking
- [ ] No console errors related to TTS
- [ ] Welcome message appears (not spoken until user interaction)

---

## CRITICAL ISSUE: TTS Architecture Regression (Session 65)

### Problem

Session 64 broke free voice differentiation. All voices now sound identical because:

1. **Free voices routed through Edge TTS on RunPod** - When pod is off, falls back to MeloTTS
2. **MeloTTS ignores voice parameter** - Documented in Session 52 testing
3. **Result**: All voices sound the same robotic voice

### Root Cause

The architecture was incorrectly modified to route free voices through RunPod Edge TTS instead of using Cloudflare MeloTTS (which was the original free tier provider).

### Correct Architecture (To Be Restored)

```
FREE TIER (No RunPod dependency):
┌────────────────────────────────────────────┐
│ Option A: Browser Web Speech API           │
│ - Different voices available               │
│ - Always works (offline capable)           │
│ - True variety between male/female/young   │
└────────────────────────────────────────────┘
        │ Fallback
        ▼
┌────────────────────────────────────────────┐
│ Option B: Cloudflare MeloTTS               │
│ - Server-side backup                       │
│ - Single voice (no variety)                │
│ - Always available                         │
└────────────────────────────────────────────┘

PREMIUM TIER (Requires RunPod):
┌────────────────────────────────────────────┐
│ Piper TTS / Edge TTS on RunPod            │
│ - Natural human voices                     │
│ - Voice cloning capability                 │
│ - Premium subscription required            │
└────────────────────────────────────────────┘
```

### Fix Required

Update `tts.ts` backend to:
1. Route `standard-male/female/young` to Browser Web Speech API (client-side) as primary
2. Keep MeloTTS as server-side fallback only
3. Only use RunPod for `primo` and `primo-female` voices

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | AI-Powered Text-to-Speech for Avatar & Tutor |
| **Pages** | `portal/classroom.html`, `index.html` (AI chat) |
| **Backend** | `pmerit-api-worker/src/routes/tts.ts` |
| **Frontend** | `tts.js`, `tts-client.js`, `AvatarManager.js`, `lip-sync-controller.js` |
| **API Endpoints** | `POST /api/v1/tts`, `GET /api/v1/tts/quota`, `POST /api/v1/gpu/session` |
| **Production URL** | `https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts` |
| **Premium Provider** | RunPod (GPU Cloud) |

---

## 2. ARCHITECTURAL DECISIONS (LOCKED)

| ID | Decision | Choice | Rationale | Session |
|----|----------|--------|-----------|---------|
| TTS-001 | Primary Provider | Cloudflare Workers AI (MeloTTS) | Integrated, free tier, low latency | 17 |
| TTS-002 | Model | `@cf/myshell-ai/melotts` | Cheapest, good quality English | 17 |
| TTS-003 | Fallback Strategy | Browser Web Speech API | Universal availability | 10 |
| TTS-004 | Audio Format | MP3 (audio/mpeg) | Widely supported, streaming | 17 |
| TTS-005 | Max Text Length | 5000 characters | Balance quality vs latency | 17 |
| TTS-006 | Cache Strategy | 1-year TTL (31536000s) | TTS audio rarely changes | 17 |
| TTS-007 | Quota Management | KV-based daily tracking | Configured: `ca0588f54b98418ea5d730aac89e870a` | 52 |
| TTS-008 | Premium Provider | **RunPod GPU Cloud** | True pay-per-use, GPU for avatar + TTS | 52 |
| TTS-009 | Premium TTS Engine | Piper TTS on RunPod | Natural human voice, open-source | 52 |
| TTS-010 | Premium Avatar | Unreal MetaHuman + Pixel Streaming | Photorealistic, GPU-rendered | 52 |
| TTS-011 | Self-Hosted Premium | **Coqui XTTS v2 on Dell R740** | Voice cloning, 6-sec samples, natural | 64 |
| TTS-012 | Self-Hosted LLM | Llama 3 70B Local | Zero API costs, fine-tunable | 64 |

---

## 3. CURRENT STATE (Session 52 Audit)

### ✅ Completed Tasks

| Task | Status | Commit | Notes |
|------|--------|--------|-------|
| Task 1: TTS_QUOTA_KV Binding | ✅ COMPLETE | `1251b1b` | Quota tracking working |
| Task 2: Voice Testing | ✅ COMPLETE | `b73b58b` | MeloTTS ignores voice param |
| Task 3a: Backend Primo Voice | ✅ COMPLETE | `0002ee9` | RunPod routing in tts.ts |
| Task 3b: Frontend Voice UI | ✅ COMPLETE | `72dfc7b` | Simplified to Standard + Primo |
| Task 3c: Premium CSS Styling | ✅ COMPLETE | `72dfc7b` | Gold/amber premium theme |
| Task 3d: RunPod Secrets | ✅ COMPLETE | - | RUNPOD_API_KEY, RUNPOD_TTS_URL set |

### ⚠️ Current Status

| Item | Status | Notes |
|------|--------|-------|
| ~~TTS_QUOTA_KV not configured~~ | ✅ FIXED | Quota tracking working |
| ~~Voice selection is fake~~ | ✅ FIXED | Simplified to 2 real options |
| ~~No premium voice option~~ | ✅ FIXED | Primo Voice implemented |
| RunPod pod running | ✅ YES | Pod `xfdsuii2ig7rsl` active |
| TTS server on pod | ⚠️ NEEDS START | Server not auto-starting on pod |
| Theme consistency | ✅ DONE | Premium gold/amber styling added |

### 🔧 Action Required: Start TTS Server on RunPod

The RunPod pod `xfdsuii2ig7rsl` is running but the TTS server needs to be manually started:

```bash
# SSH into pod via RunPod console or:
ssh root@xfdsuii2ig7rsl.runpod.net

# Start TTS server
curl -s https://raw.githubusercontent.com/peoplemerit/pmerit-ai-platform/main/scripts/runpod-tts-server.py > /workspace/tts_server.py
pip install fastapi uvicorn piper-tts
python3 /workspace/tts_server.py
```

Or configure RunPod to auto-start the server on pod boot.

---

## 4. THREE-TIER TTS ARCHITECTURE

### Tier Overview

| Tier | Provider | Engine | Quality | Cost | Use Case |
|------|----------|--------|---------|------|----------|
| **Free** | Cloudflare | MeloTTS | Robotic AI voice | $0 | All users |
| **Premium (Cloud)** | RunPod | Piper TTS + Edge TTS | Natural voice | $2.99/mo | Paying subscribers |
| **Self-Hosted Premium** | Dell R740 | Coqui XTTS v2 | Voice cloning, ultra-natural | $10-20/mo | Enterprise/Ultra subscribers |

### Self-Hosted TTS (Dell R740)

**Hardware Requirements:**
- Server: Dell PowerEdge R740
- GPU: RTX 4090 (recommended) or RTX 3090
- VRAM: 8GB minimum for XTTS
- RAM: 16GB minimum
- Storage: 10GB for models

**Coqui XTTS v2 Capabilities:**
- 17 languages supported
- Voice cloning from 6-second samples
- Emotional expression (happy, sad, excited)
- Real-time generation on GPU
- Open source (Apache 2.0)

**API Endpoint (Self-Hosted):**
```http
POST /api/premium/self-hosted/tts
Content-Type: application/json
Authorization: Bearer <premium_jwt>

{
    "text": "Let me explain how functions work...",
    "voice": "cloned-teacher",
    "speaker_wav": "base64_encoded_6sec_sample",
    "language": "en",
    "emotion": "friendly"
}

Response: audio/wav
Headers:
  X-TTS-Provider: coqui-xtts
  X-Render-Time-Ms: 450
  X-Premium-Tier: self-hosted
```

**Voice Options (Self-Hosted):**
| Voice | Description | Requires Sample? |
|-------|-------------|------------------|
| `lessac-natural` | Pre-trained male voice | No |
| `amy-natural` | Pre-trained female voice | No |
| `cloned-teacher` | Cloned from teacher sample | Yes (6 sec) |
| `cloned-custom` | User-provided voice clone | Yes (6 sec) |

---

## 5. PREMIUM TIER ARCHITECTURE (RunPod)

### 4.1 Unified Premium Infrastructure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PMERIT TIERED ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      FREE TIER                                   │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │   │
│  │  │ MeloTTS     │    │ WebGL 3D    │    │ Client-Side         │  │   │
│  │  │ (Robotic)   │    │ Avatar      │    │ Rendering           │  │   │
│  │  │ FREE        │    │ FREE        │    │ User's Device       │  │   │
│  │  └─────────────┘    └─────────────┘    └─────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PREMIUM TIER ($10-20/month)                   │   │
│  │                                                                   │   │
│  │  User Request ──▶ Cloudflare API ──▶ RunPod GPU Pod             │   │
│  │                                           │                       │   │
│  │                         ┌─────────────────┴─────────────────┐    │   │
│  │                         │       RunPod GPU Instance         │    │   │
│  │                         │                                   │    │   │
│  │                         │  ┌─────────────────────────────┐  │    │   │
│  │                         │  │     Piper TTS               │  │    │   │
│  │                         │  │     (Primo Voice)           │  │    │   │
│  │                         │  │     Natural Human Voice     │  │    │   │
│  │                         │  └─────────────────────────────┘  │    │   │
│  │                         │                                   │    │   │
│  │                         │  ┌─────────────────────────────┐  │    │   │
│  │                         │  │   Unreal Engine 5           │  │    │   │
│  │                         │  │   MetaHuman Avatar          │  │    │   │
│  │                         │  │   Pixel Streaming           │  │    │   │
│  │                         │  └─────────────────────────────┘  │    │   │
│  │                         │                                   │    │   │
│  │                         │  GPU: RTX 4090 (24GB VRAM)        │    │   │
│  │                         │  Cost: $0.44/hr                   │    │   │
│  │                         └───────────────────────────────────┘    │   │
│  │                                           │                       │   │
│  │                                           ▼                       │   │
│  │                         ┌───────────────────────────────────┐    │   │
│  │                         │   WebRTC Stream to Browser        │    │   │
│  │                         │   - 1080p @ 30fps                 │    │   │
│  │                         │   - Real-time lip sync            │    │   │
│  │                         │   - Photorealistic avatar         │    │   │
│  │                         └───────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 RunPod GPU Options

| GPU | VRAM | $/hour | Best For | Availability |
|-----|------|--------|----------|--------------|
| RTX 3090 | 24GB | $0.22 | Good UE5 performance | High |
| RTX 4090 | 24GB | $0.44 | Excellent UE5 performance | Medium |
| A10G | 24GB | $0.50 | Enterprise, reliable | High |
| T4 | 16GB | $0.20 | Budget, may struggle with UE5 | High |

**Recommended:** RTX 4090 ($0.44/hr) for best quality/cost ratio.

### 4.3 Cost Model

| Usage Pattern | GPU Hours/Month | RunPod Cost | Suggested User Price | Margin |
|---------------|-----------------|-------------|----------------------|--------|
| Light (5 hrs/mo) | 5 | $2.20 | $10/mo | 78% |
| Medium (10 hrs/mo) | 10 | $4.40 | $15/mo | 71% |
| Heavy (20 hrs/mo) | 20 | $8.80 | $20/mo | 56% |

**Key Benefit:** RunPod pods can **scale to zero** when not in use — no idle costs!

---

## 5. IMPLEMENTATION TASKS

### TASK 1: TTS_QUOTA_KV Binding ✅ COMPLETE

**Status:** ✅ Done (Session 52)
**Commit:** `1251b1b`
**KV Namespace:** `ca0588f54b98418ea5d730aac89e870a`

---

### TASK 2: Voice Testing ✅ COMPLETE

**Status:** ✅ Done (Session 52)
**Commit:** `b73b58b`

**Key Finding:** MeloTTS ignores the voice parameter. All 6 "voices" produce identical output with random variations.

**Recommendation:** 
- Keep voice UI for now (users perceive choice)
- Add "Primo Voice" as genuinely different premium option

---

### TASK 3: RunPod Premium Integration (Primo Voice + GPU Avatar)

**Priority:** 🔴 HIGH
**Environment:** Backend (BE) + RunPod
**Complexity:** Medium-High
**Estimated Time:** 2-4 hours (after RunPod account setup)

#### 3.1 Prerequisites (User Must Complete)

| Step | Action | Status |
|------|--------|--------|
| 1 | Create RunPod account at https://runpod.io | ⏳ Pending |
| 2 | Add payment method | ⏳ Pending |
| 3 | Generate API key (Settings → API Keys) | ⏳ Pending |
| 4 | Share API key with Claude Code | ⏳ Pending |

#### 3.2 RunPod Pod Template Configuration

**Create a custom pod template with these specifications:**

```yaml
# RunPod Pod Template: pmerit-premium-avatar
name: pmerit-premium-avatar
gpu: RTX 4090
gpu_count: 1
volume_size: 50  # GB for UE5 project
container_image: runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04
ports:
  - 8000  # Piper TTS API
  - 8080  # Pixel Streaming signaling
  - 8888  # Pixel Streaming WebRTC
expose_http: [8000, 8080]
env:
  - PMERIT_MODE=production
```

#### 3.3 Server Setup Script

**File: `/opt/pmerit/setup.sh` (runs on pod startup)**

```bash
#!/bin/bash
# PMERIT Premium Pod Setup Script
# Installs Piper TTS and prepares for Pixel Streaming

set -e

echo "=== PMERIT Premium Pod Setup ==="

# Update system
apt-get update && apt-get upgrade -y

# Install dependencies
apt-get install -y \
    python3-pip \
    python3-venv \
    ffmpeg \
    nginx \
    curl \
    wget \
    unzip

# ===== PIPER TTS SETUP =====
echo "Installing Piper TTS..."

mkdir -p /opt/pmerit/piper
cd /opt/pmerit/piper

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Piper
pip install piper-tts

# Download high-quality voice model
mkdir -p models
cd models

# en_US-lessac-medium: Natural, clear American English
wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx
wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json

# en_US-amy-medium: Female voice option
wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx
wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx.json

echo "Piper TTS installed successfully!"

# ===== FASTAPI SERVER =====
echo "Setting up FastAPI server..."

cd /opt/pmerit
pip install fastapi uvicorn python-multipart

# Create TTS API server
cat > /opt/pmerit/tts_server.py << 'PYTHON_EOF'
"""
PMERIT Primo Voice TTS API
Powered by Piper TTS on RunPod GPU
"""
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os
import time

app = FastAPI(
    title="PMERIT Primo Voice API",
    description="Premium natural human voice TTS",
    version="1.0.0"
)

# CORS for Cloudflare Worker
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pmerit-api-worker.peoplemerit.workers.dev",
        "https://pmerit.com",
        "https://www.pmerit.com"
    ],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

# Voice models available
VOICES = {
    "primo": "/opt/pmerit/piper/models/en_US-lessac-medium.onnx",
    "primo-female": "/opt/pmerit/piper/models/en_US-amy-medium.onnx",
}

class TTSRequest(BaseModel):
    text: str
    voice: str = "primo"
    speed: float = 1.0

class HealthResponse(BaseModel):
    status: str
    provider: str
    gpu: str
    voices: list
    uptime: float

start_time = time.time()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for RunPod and monitoring"""
    import torch
    gpu_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "No GPU"
    
    return {
        "status": "healthy",
        "provider": "piper-tts",
        "gpu": gpu_name,
        "voices": list(VOICES.keys()),
        "uptime": time.time() - start_time
    }

@app.post("/api/tts")
async def generate_speech(request: TTSRequest):
    """Generate premium TTS audio using Piper"""
    
    # Validate text
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text is required")
    
    if len(request.text) > 10000:
        raise HTTPException(status_code=400, detail="Text too long (max 10000 chars for premium)")
    
    # Validate voice
    if request.voice not in VOICES:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid voice. Available: {list(VOICES.keys())}"
        )
    
    model_path = VOICES[request.voice]
    
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            # Run Piper TTS
            process = subprocess.run(
                [
                    "/opt/pmerit/piper/venv/bin/piper",
                    "--model", model_path,
                    "--output_file", tmp.name,
                    "--length_scale", str(1.0 / request.speed)  # Inverse for speed
                ],
                input=request.text.encode('utf-8'),
                capture_output=True,
                timeout=60  # 60 second timeout
            )
            
            if process.returncode != 0:
                error_msg = process.stderr.decode('utf-8', errors='ignore')
                raise HTTPException(status_code=500, detail=f"TTS generation failed: {error_msg}")
            
            # Read generated audio
            with open(tmp.name, "rb") as f:
                audio_data = f.read()
            
            # Cleanup
            os.unlink(tmp.name)
            
            return Response(
                content=audio_data,
                media_type="audio/wav",
                headers={
                    "X-TTS-Provider": "piper-primo",
                    "X-Voice": request.voice,
                    "X-Char-Count": str(len(request.text)),
                    "X-Premium": "true",
                    "Cache-Control": "public, max-age=31536000"  # 1 year cache
                }
            )
            
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="TTS generation timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"service": "PMERIT Primo Voice", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
PYTHON_EOF

echo "FastAPI server created!"

# ===== SYSTEMD SERVICE =====
echo "Creating systemd service..."

cat > /etc/systemd/system/pmerit-tts.service << 'SERVICE_EOF'
[Unit]
Description=PMERIT Primo Voice TTS API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/pmerit
Environment="PATH=/opt/pmerit/piper/venv/bin:/usr/local/bin:/usr/bin"
ExecStart=/opt/pmerit/piper/venv/bin/uvicorn tts_server:app --host 0.0.0.0 --port 8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE_EOF

systemctl daemon-reload
systemctl enable pmerit-tts
systemctl start pmerit-tts

echo "=== Setup Complete ==="
echo "TTS API running on port 8000"
echo "Health check: curl http://localhost:8000/health"
```

#### 3.4 Backend Integration

**Update `src/routes/tts.ts`:**

```typescript
// Add to TTS_CONFIG at top of file
const TTS_CONFIG = {
  // ... existing config ...
  
  // RunPod Premium Configuration
  RUNPOD_ENABLED: true,
  RUNPOD_API_KEY: '', // Set via env.RUNPOD_API_KEY
  RUNPOD_ENDPOINT_ID: '', // Set via env.RUNPOD_ENDPOINT_ID
  RUNPOD_TTS_URL: '', // Dynamic: set when pod is running
  
  // Premium Voices (Piper on RunPod)
  PREMIUM_VOICES: {
    'primo': 'Natural human voice (Male)',
    'primo-female': 'Natural human voice (Female)',
  }
};

// Add RunPod pod management functions
interface RunPodStatus {
  id: string;
  status: 'RUNNING' | 'STOPPED' | 'STARTING' | 'STOPPING';
  gpu: string;
  endpoint: string;
}

async function getRunPodStatus(env: Env): Promise<RunPodStatus | null> {
  if (!env.RUNPOD_API_KEY || !env.RUNPOD_ENDPOINT_ID) {
    return null;
  }
  
  try {
    const response = await fetch(
      `https://api.runpod.io/v2/${env.RUNPOD_ENDPOINT_ID}/status`,
      {
        headers: {
          'Authorization': `Bearer ${env.RUNPOD_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('RunPod status check failed:', error);
    return null;
  }
}

async function startRunPodPod(env: Env): Promise<string | null> {
  if (!env.RUNPOD_API_KEY || !env.RUNPOD_ENDPOINT_ID) {
    return null;
  }
  
  try {
    const response = await fetch(
      `https://api.runpod.io/v2/${env.RUNPOD_ENDPOINT_ID}/run`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RUNPOD_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: { action: 'start' }
        })
      }
    );
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('RunPod start failed:', error);
    return null;
  }
}

// Add Primo TTS generator
async function generatePrimoTTS(
  runpodUrl: string,
  text: string,
  voice: string = 'primo'
): Promise<ArrayBuffer> {
  const response = await fetch(`${runpodUrl}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice, speed: 1.0 })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Primo TTS failed: ${error}`);
  }
  
  return await response.arrayBuffer();
}

// Update POST handler - add premium voice routing
// In the existing POST function, add this check before generateCloudflareTTS:

/*
// Check if premium voice requested
if (voice.startsWith('primo') && TTS_CONFIG.RUNPOD_ENABLED) {
  // Check if user has premium subscription (implement your auth check)
  const isPremiumUser = await checkPremiumSubscription(request, env);
  
  if (!isPremiumUser) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Premium voice requires subscription',
      upgradeUrl: 'https://pmerit.com/pricing'
    }), {
      status: 403,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
  
  // Get RunPod endpoint URL
  const runpodStatus = await getRunPodStatus(env);
  
  if (!runpodStatus || runpodStatus.status !== 'RUNNING') {
    // Pod not running - start it or return fallback
    const startId = await startRunPodPod(env);
    
    return new Response(JSON.stringify({
      success: false,
      podStarting: true,
      message: 'Premium voice server is starting. Please retry in 30 seconds.',
      retryAfter: 30
    }), {
      status: 503,
      headers: { 
        ...CORS_HEADERS, 
        'Content-Type': 'application/json',
        'Retry-After': '30'
      }
    });
  }
  
  try {
    const audioBuffer = await generatePrimoTTS(runpodStatus.endpoint, text, voice);
    
    return new Response(audioBuffer, {
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'audio/wav',
        'X-TTS-Provider': 'piper-primo',
        'X-Voice': voice,
        'X-Char-Count': charCount.toString(),
        'X-Premium': 'true'
      }
    });
  } catch (error) {
    console.error('Primo TTS failed, falling back to standard:', error);
    // Fall through to standard TTS
  }
}
*/
```

#### 3.5 Environment Variables to Add

**Backend secrets (via `wrangler secret put`):**

```bash
# RunPod API Key
wrangler secret put RUNPOD_API_KEY
# Enter your RunPod API key when prompted

# RunPod Endpoint ID (after creating serverless endpoint)
wrangler secret put RUNPOD_ENDPOINT_ID
```

**Update `src/types.ts`:**

```typescript
export interface Env {
  // ... existing ...
  
  // RunPod Premium Integration
  RUNPOD_API_KEY?: string;
  RUNPOD_ENDPOINT_ID?: string;
}
```

#### 3.6 Frontend Voice Modal Update

**Add Primo Voice option to voice selection:**

```javascript
// In voice modal component (tts.js or similar)
const VOICE_OPTIONS = [
  // Free tier
  { 
    id: 'standard', 
    name: 'Standard Voice', 
    description: 'AI-generated voice', 
    tier: 'free',
    icon: '🔊'
  },
  
  // Premium tier
  { 
    id: 'primo', 
    name: 'Primo Voice', 
    description: 'Natural human voice ⭐', 
    tier: 'premium',
    icon: '✨'
  },
  { 
    id: 'primo-female', 
    name: 'Primo Voice (Female)', 
    description: 'Natural human voice ⭐', 
    tier: 'premium',
    icon: '✨'
  },
];

// Add premium badge and lock icon for non-subscribers
function renderVoiceOption(voice, userIsPremium) {
  const isPremium = voice.tier === 'premium';
  const isLocked = isPremium && !userIsPremium;
  
  return `
    <div class="voice-option ${isPremium ? 'voice-premium' : ''} ${isLocked ? 'voice-locked' : ''}" 
         data-voice="${voice.id}"
         data-tier="${voice.tier}">
      <span class="voice-icon">${voice.icon}</span>
      <div class="voice-info">
        <span class="voice-name">${voice.name}</span>
        ${isPremium ? '<span class="premium-badge">PREMIUM</span>' : ''}
        <span class="voice-desc">${voice.description}</span>
      </div>
      ${isLocked 
        ? '<button class="voice-upgrade-btn" onclick="showPricingModal()">🔒 Upgrade</button>'
        : '<button class="voice-preview-btn">▶ Preview</button>'
      }
      ${!isLocked 
        ? '<button class="voice-select-btn">Select</button>'
        : ''
      }
    </div>
  `;
}
```

#### 3.7 Acceptance Criteria

- [ ] RunPod account created with API key
- [ ] Pod template configured with Piper TTS
- [ ] Backend secrets added (RUNPOD_API_KEY, RUNPOD_ENDPOINT_ID)
- [ ] Backend routes updated for Primo voice routing
- [ ] Frontend voice modal shows Primo options
- [ ] Premium users can hear natural human voice
- [ ] Non-premium users see upgrade prompt
- [ ] Pod scales to zero when idle (cost control)

---

### TASK 4: Theme & Font Alignment

**Priority:** 🟢 LOW
**Environment:** Frontend (FE)
**Complexity:** Low
**Estimated Time:** 30 minutes

#### Problem
Voice selection modal uses inline styles that don't match platform design system.

#### Solution

**Create/update voice modal CSS using platform variables:**

```css
/* Voice Selection Modal - Platform Theme Alignment */
/* File: assets/css/voice-modal.css */

.voice-select-modal {
  font-family: var(--font-primary, 'Inter', system-ui, sans-serif);
}

.voice-select-modal .modal-overlay {
  background: var(--bg-overlay, rgba(0, 0, 0, 0.8));
  backdrop-filter: blur(4px);
}

.voice-select-modal .modal-content {
  background: var(--bg-card, #1a1a2e);
  border-radius: var(--radius-lg, 12px);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  max-width: 500px;
  width: 90%;
}

.voice-select-modal .modal-header {
  padding: var(--spacing-lg, 24px);
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
}

.voice-select-modal .modal-title {
  color: var(--text-primary, #ffffff);
  font-size: var(--text-xl, 1.25rem);
  font-weight: var(--font-semibold, 600);
  display: flex;
  align-items: center;
  gap: 8px;
}

.voice-select-modal .modal-body {
  padding: var(--spacing-lg, 24px);
  max-height: 400px;
  overflow-y: auto;
}

/* Voice Options */
.voice-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 16px);
  background: var(--bg-secondary, rgba(255, 255, 255, 0.05));
  border: 2px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-md, 8px);
  padding: var(--spacing-md, 16px);
  margin-bottom: var(--spacing-sm, 12px);
  transition: var(--transition, 0.2s ease);
  cursor: pointer;
}

.voice-option:hover {
  background: var(--bg-hover, rgba(255, 255, 255, 0.1));
  border-color: var(--primary, #3b82f6);
}

.voice-option.selected {
  border-color: var(--success, #22c55e);
  background: rgba(34, 197, 94, 0.1);
}

.voice-option.voice-locked {
  opacity: 0.7;
  cursor: not-allowed;
}

.voice-option.voice-locked:hover {
  border-color: var(--warning, #f59e0b);
}

/* Voice Icon */
.voice-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-md, 8px);
}

/* Voice Info */
.voice-info {
  flex: 1;
}

.voice-name {
  display: block;
  color: var(--text-primary, #ffffff);
  font-weight: var(--font-medium, 500);
  font-size: var(--text-base, 1rem);
}

.voice-desc {
  display: block;
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  font-size: var(--text-sm, 0.875rem);
  margin-top: 2px;
}

/* Premium Badge */
.premium-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--warning, #f59e0b), #d97706);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 8px;
  vertical-align: middle;
}

/* Buttons */
.voice-preview-btn,
.voice-select-btn,
.voice-upgrade-btn {
  padding: 8px 16px;
  border-radius: var(--radius-md, 6px);
  font-size: var(--text-sm, 0.875rem);
  font-weight: var(--font-medium, 500);
  transition: var(--transition, 0.2s ease);
  cursor: pointer;
}

.voice-preview-btn {
  background: var(--btn-secondary-bg, transparent);
  color: var(--btn-secondary-text, var(--primary));
  border: 1px solid var(--btn-secondary-border, var(--primary));
}

.voice-preview-btn:hover {
  background: rgba(59, 130, 246, 0.1);
}

.voice-select-btn {
  background: var(--btn-primary-bg, var(--primary));
  color: var(--btn-primary-text, white);
  border: none;
  margin-left: 8px;
}

.voice-select-btn:hover {
  background: var(--btn-primary-hover, var(--primary-dark));
  transform: translateY(-1px);
}

.voice-select-btn.selected {
  background: var(--success, #22c55e);
}

.voice-upgrade-btn {
  background: linear-gradient(135deg, var(--warning, #f59e0b), #d97706);
  color: white;
  border: none;
}

.voice-upgrade-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Quota Display */
.voice-quota {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md, 16px);
  background: var(--bg-secondary, rgba(255, 255, 255, 0.05));
  border-radius: var(--radius-md, 8px);
  margin-top: var(--spacing-md, 16px);
}

.voice-quota-label {
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  font-size: var(--text-sm, 0.875rem);
}

.voice-quota-value {
  color: var(--success, #22c55e);
  font-weight: var(--font-semibold, 600);
}

.voice-quota-fallback {
  color: var(--text-muted, rgba(255, 255, 255, 0.5));
  font-size: var(--text-xs, 0.75rem);
}

/* Premium Voice Styling */
.voice-option.voice-premium {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.1));
  border-color: rgba(245, 158, 11, 0.3);
}

.voice-option.voice-premium:hover {
  border-color: var(--warning, #f59e0b);
}

.voice-option.voice-premium.selected {
  border-color: var(--warning, #f59e0b);
  background: rgba(245, 158, 11, 0.15);
}

/* Dark/Light Mode */
[data-theme="light"] .voice-select-modal .modal-content {
  background: var(--bg-card-light, #ffffff);
}

[data-theme="light"] .voice-option {
  background: var(--bg-secondary-light, #f9fafb);
  border-color: var(--border-color-light, #e5e7eb);
}

[data-theme="light"] .voice-name {
  color: var(--text-primary-light, #111827);
}

[data-theme="light"] .voice-desc {
  color: var(--text-secondary-light, #6b7280);
}
```

#### Acceptance Criteria

- [ ] Voice modal uses platform CSS variables
- [ ] Premium voices have distinct styling
- [ ] Locked voices show upgrade prompt
- [ ] Dark mode works correctly
- [ ] Buttons match platform button styles
- [ ] Quota display matches platform typography

---

## 6. QUOTA & LIMITS

### Free Tier (Cloudflare MeloTTS)

| Limit | Value | Notes |
|-------|-------|-------|
| Daily Characters | 10,000 | Cloudflare free tier |
| Monthly Characters | 300,000 | 30 × 10,000 |
| Max Text per Request | 5,000 chars | Enforced in backend |
| Reset Time | Midnight UTC | Daily |
| Cache TTL | 1 year | Repeated phrases cached |
| Voice Quality | Robotic | MeloTTS limitation |

### Premium Tier (RunPod Piper TTS)

| Limit | Value | Notes |
|-------|-------|-------|
| Daily Characters | 100,000 | Per paying user |
| Max Text per Request | 10,000 chars | Higher limit |
| Voice Quality | Natural Human | Piper TTS |
| Voices Available | 2+ | Male and Female options |
| GPU Avatar | Included | MetaHuman streaming |
| Priority | High | Dedicated GPU when active |

---

## 7. FALLBACK HIERARCHY

```
Self-Hosted Premium User Request:
1. Coqui XTTS (Dell R740 Self-Hosted)
   │   └── On server unavailable
   ▼
2. Primo Voice (RunPod Piper TTS) - Cloud fallback
   │   └── On pod starting/unavailable
   ▼
3. Cloudflare Workers AI (MeloTTS) + Apology message
   │   └── On quota exceeded or error
   ▼
4. Browser Web Speech API (speechSynthesis)
   │   └── On browser not supported
   ▼
5. Silent mode (text-only, no speech)

Cloud Premium User Request:
1. Primo Voice (RunPod Piper TTS)
   │   └── On pod starting/unavailable
   ▼
2. Cloudflare Workers AI (MeloTTS) + Apology message
   │   └── On quota exceeded or error
   ▼
3. Browser Web Speech API (speechSynthesis)
   │   └── On browser not supported
   ▼
4. Silent mode (text-only, no speech)

Free User Request:
1. Cloudflare Workers AI (MeloTTS)
   │   └── On quota exceeded or error
   ▼
2. Browser Web Speech API (speechSynthesis)
   │   └── On browser not supported
   ▼
3. Silent mode (text-only, no speech)
```

---

## 8. API SPECIFICATION

### POST /api/v1/tts

Generate speech audio from text.

**Request:**
```json
{
  "text": "Hello, welcome to PMERIT!",
  "voice": "primo",
  "language": "en-US"
}
```

**Voice Options:**

| Voice | Tier | Provider | Description |
|-------|------|----------|-------------|
| standard | Free | MeloTTS | AI-generated voice |
| alloy | Free | MeloTTS | (Legacy - same as standard) |
| echo | Free | MeloTTS | (Legacy - same as standard) |
| fable | Free | MeloTTS | (Legacy - same as standard) |
| onyx | Free | MeloTTS | (Legacy - same as standard) |
| nova | Free | MeloTTS | (Legacy - same as standard) |
| shimmer | Free | MeloTTS | (Legacy - same as standard) |
| **primo** | Premium | Piper | Natural male voice |
| **primo-female** | Premium | Piper | Natural female voice |

**Response (Success - Free):**
- Status: 200
- Content-Type: audio/mpeg
- Headers: `X-TTS-Provider: cloudflare-workers-ai`

**Response (Success - Premium):**
- Status: 200
- Content-Type: audio/wav
- Headers: `X-TTS-Provider: piper-primo`, `X-Premium: true`

**Response (Premium Pod Starting):**
```json
{
  "success": false,
  "podStarting": true,
  "message": "Premium voice server is starting. Please retry in 30 seconds.",
  "retryAfter": 30
}
```
- Status: 503

**Response (Premium Required):**
```json
{
  "success": false,
  "error": "Premium voice requires subscription",
  "upgradeUrl": "https://pmerit.com/pricing"
}
```
- Status: 403

---

## 9. RUNPOD CONFIGURATION

### Account Setup Checklist

| Step | Action | Status |
|------|--------|--------|
| 1 | Create account at https://runpod.io | ⏳ |
| 2 | Verify email | ⏳ |
| 3 | Add payment method | ⏳ |
| 4 | Generate API key (Settings → API Keys) | ⏳ |
| 5 | Create Serverless Endpoint | ⏳ |
| 6 | Note Endpoint ID | ⏳ |

### Serverless Endpoint Configuration

```yaml
# RunPod Serverless Endpoint Settings
Name: pmerit-premium-tts
GPU Type: RTX 4090 (or A10G for more availability)
Max Workers: 3
Min Workers: 0  # Scale to zero!
Idle Timeout: 300  # 5 minutes
Container Image: Custom (with Piper TTS)
Volume: 50GB
Exposed Ports: 8000
```

### Cost Control Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| Min Workers | 0 | Scale to zero when idle |
| Idle Timeout | 300s | Shut down after 5 min idle |
| Max Workers | 3 | Cap concurrent users |
| Spend Limit | $100/month | Alert/stop at limit |

---

## 10. TESTING COMMANDS

### Free Tier TTS Test
```bash
# Generate speech
curl -X POST "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, welcome to PMERIT!","voice":"standard"}' \
  --output test-standard.mp3

# Check quota
curl "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts/quota"
```

### Premium Tier TTS Test (after RunPod setup)
```bash
# Test Primo voice (requires auth token)
curl -X POST "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PREMIUM_TOKEN" \
  -d '{"text":"Hello, welcome to PMERIT!","voice":"primo"}' \
  --output test-primo.wav

# Test Primo female voice
curl -X POST "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PREMIUM_TOKEN" \
  -d '{"text":"Hello, welcome to PMERIT!","voice":"primo-female"}' \
  --output test-primo-female.wav
```

### RunPod Health Check
```bash
# Direct pod health check (when running)
curl https://YOUR_RUNPOD_ENDPOINT/health
```

---

## 11. IMPLEMENTATION CHECKLIST

### Phase 1: Core Configuration ✅ COMPLETE
- [x] Create TTS_QUOTA_KV namespace
- [x] Add binding to wrangler.toml
- [x] Deploy backend worker
- [x] Verify quota endpoint returns data

### Phase 2: Testing & Validation ✅ COMPLETE
- [x] Test all 6 MeloTTS voices
- [x] Document voice comparison results
- [x] Confirm MeloTTS ignores voice parameter

### Phase 3: RunPod Premium Integration ✅ MOSTLY COMPLETE
- [x] Create RunPod account
- [x] Add payment method ($70 credit loaded)
- [x] Generate API key (`rpa_66FMXVRK9...`)
- [x] Create pod (pmerit-tts-v2, ID: `xfdsuii2ig7rsl`)
- [x] Add RUNPOD_API_KEY secret to backend
- [x] Add RUNPOD_TTS_URL secret to backend
- [x] Update backend routes for Primo voice (`tts.ts`)
- [x] Update frontend voice modal (`voice-preview.js`)
- [x] Simplify to 2 voices (Standard + Primo)
- [x] Add voice migration for legacy engines
- [ ] **Start TTS server on RunPod pod** ⚠️ MANUAL ACTION
- [ ] Test Primo voice end-to-end
- [ ] Implement subscription check (future)

### Phase 4: Theme Alignment ✅ COMPLETE
- [x] Update voice-preview.css
- [x] Add premium voice styling (gold/amber gradient)
- [x] Add premium badge styling
- [x] Add tier note styling
- [x] Fix mobile responsive media query
- [x] Test on platform

### Phase 5: GPU Avatar (Future)
- [ ] Add MetaHuman to RunPod pod
- [ ] Configure Pixel Streaming
- [ ] Integrate with lip sync controller
- [ ] Test WebRTC streaming

---

## 12. SESSION HISTORY

| Session | Date | Changes |
|---------|------|---------|
| 17 | 2025-12-XX | Initial TTS implementation |
| 41 | 2025-12-07 | Fixed TTS path in AvatarManager |
| 45 | 2025-12-11 | Avatar lip sync integration |
| 51 | 2025-12-13 | Created SCOPE_TTS.md v1.0 |
| 52 | 2025-12-13 | Task 1 COMPLETE: TTS_QUOTA_KV binding |
| 52 | 2025-12-13 | Task 2 COMPLETE: Voice testing documented |
| 52 | 2025-12-13 | Updated to v2.1: RunPod premium architecture |
| 53 | 2025-12-13 | Backend Primo Voice routing added (`0002ee9`) |
| 53 | 2025-12-13 | Frontend simplified to 2 voices (`72dfc7b`) |
| 53 | 2025-12-13 | Premium CSS styling added |
| 53 | 2025-12-13 | Updated to v2.2: Implementation complete (pending pod server start) |

---

## 13. VOICE TESTING RESULTS (Session 52)

### Key Finding: MeloTTS Does NOT Support Voice Selection

The backend code (`tts.ts:153-156`) only passes `lang: 'en'` to MeloTTS - the voice parameter is accepted but **not used**:

```typescript
const response = await ai.run(TTS_CONFIG.CF_TTS_MODEL, {
  prompt: text,
  lang: 'en'  // No voice parameter passed!
});
```

### Test Results

| Voice | HTTP Status | File Size | MD5 Hash | Distinct? |
|-------|-------------|-----------|----------|-----------|
| alloy | 200 | 271,718 | 0df6e087... | ❌ No |
| echo | 200 | 269,670 | c766d16c... | ❌ No |
| fable | 200 | 269,670 | c4e64904... | ❌ No |
| onyx | 200 | 270,694 | f0ee1b54... | ❌ No |
| nova | 200 | 273,766 | d56a0788... | ❌ No |
| shimmer | 200 | 270,694 | 59b38205... | ❌ No |

**Note:** Different hashes are due to non-deterministic TTS output (random seed), not different voices.

### Recommendation

1. **Simplify free tier** to single "Standard Voice" option
2. **Add Primo Voice** as genuinely different premium option
3. **Keep legacy voice IDs** for backward compatibility but route all to same MeloTTS

---

---

## 14. IMPLEMENTATION SUMMARY (Session 53)

### What Was Implemented

1. **Backend (pmerit-api-worker):**
   - `src/routes/tts.ts`: Added `generatePrimoTTS()` function and `isPrimoVoice()` check
   - Routes `voice: "primo"` to RunPod Piper TTS endpoint
   - Falls back to MeloTTS if RunPod unavailable
   - Secrets configured: `RUNPOD_API_KEY`, `RUNPOD_TTS_URL`

2. **Frontend (pmerit-ai-platform):**
   - `assets/js/voice-preview.js`: Simplified from 6 fake voices to 2 real options
   - `assets/js/tts.js`: Added `VOICE_OPTIONS` mapping and API voice routing
   - `assets/css/voice-preview.css`: Added premium gold/amber styling

3. **Voice Options:**
   | Voice | API Value | Provider | Tier |
   |-------|-----------|----------|------|
   | Standard | `alloy` | MeloTTS (Cloudflare) | Free |
   | Primo | `primo` | Piper TTS (RunPod) | Premium |

4. **RunPod Infrastructure:**
   - Pod: `xfdsuii2ig7rsl` (pmerit-tts-v2)
   - GPU: RTX 4090 ($0.44/hr)
   - Status: Running but TTS server not started
   - Script: `scripts/runpod-tts-server.py`

### What's Working
- Standard Voice: ✅ MeloTTS generating audio correctly
- Voice modal: ✅ Shows 2 options with premium styling
- Voice migration: ✅ Legacy voice IDs map to "standard"
- Backend routing: ✅ Detects "primo" and routes to RunPod

### What's Pending
- **Start TTS server on RunPod pod** - Manual action required
- Test Primo voice end-to-end after server starts
- Consider pod auto-start script for production

*Last Updated: 2025-12-14 by Claude Code (Session 56)*
*Version: 2.3 - All 5 Voices Working, Dark Theme Complete*

---

## 15. SESSION 55-56 UPDATE: VOICE SYSTEM FULLY OPERATIONAL

### What Was Completed (Session 55-56)

1. **RunPod Deployment:**
   - Deployed `tts_server.py` via GitHub clone method
   - Fixed Piper path: `/workspace/piper/piper/piper` (not `/workspace/piper/piper`)
   - Set executable permissions: `chmod +x /workspace/piper/piper/piper`
   - All 5 voices tested and working

2. **Backend Fixes:**
   - Added `RUNPOD_TTS_URL` to `wrangler.toml`
   - Fixed `checkPremiumSubscription()` - moved `TESTING_MODE` check to top
   - Deployed to Cloudflare Workers

3. **Frontend Fixes:**
   - Fixed `tts-client.js` `setVoice()` validation to accept new voice IDs
   - Added voice migration for legacy voices → `standard-male`
   - Updated browser voice fallback mapping

4. **Dark Theme Support:**
   - Added comprehensive dark mode CSS to `voice-preview.css`
   - Modal container, body, footer themed
   - Voice items, buttons, premium styling themed
   - Header changed to subtle dark gradient (not bright blue)

### Current Voice Configuration

| Voice | Backend Value | Engine | Provider | Tier |
|-------|---------------|--------|----------|------|
| Standard Male | `standard-male` | Edge TTS | RunPod | Free |
| Standard Female | `standard-female` | Edge TTS | RunPod | Free |
| Young Voice | `standard-young` | Edge TTS | RunPod | Free |
| Primo Voice | `primo` | Piper TTS | RunPod | Premium |
| Primo Female | `primo-female` | Piper TTS | RunPod | Premium |

### RunPod Pod Status

| Item | Value |
|------|-------|
| Pod ID | `xfdsuii2ig7rsl` |
| Pod Name | `pmerit-tts-v2` |
| GPU | RTX 4090 |
| Cost | $0.26/hr |
| Status | **OFF** (start on-demand) |
| Proxy URL | `https://xfdsuii2ig7rsl-8000.proxy.runpod.net` |

### Startup Commands for RunPod

When pod is started:
```bash
cd /workspace
git clone https://github.com/peoplemerit/pmerit-ai-platform.git repo
cp repo/scripts/runpod/tts_server.py .
pip install edge-tts
python3 tts_server.py
```

---

## 16. REMAINING WORK (Future Sessions)

### Priority 1: Premium Subscription Wiring

Currently `TESTING_MODE = true` allows all users to access premium voices. When subscription system is ready:

1. Set `TESTING_MODE = false` in `tts.ts`
2. Implement actual `checkPremiumSubscription()`:
   - Verify JWT token from auth header
   - Check user's `subscription_tier` in database
   - Return `isPremium: true/false` based on tier

**Location:** `pmerit-api-worker/src/routes/tts.ts:173-220`

### Priority 2: Classroom/Human Avatar Integration

TTS voices need wiring into:

1. **Classroom Tutor Avatar (`portal/classroom.html`):**
   - `AvatarManager.js` lip-sync with TTS audio
   - Voice selection should persist per user
   - Premium voices for premium users in classroom

2. **Human Avatar (Future):**
   - MetaHuman avatar on RunPod with Pixel Streaming
   - Lip sync with Piper TTS audio
   - Real-time WebRTC streaming

**Key Files:**
- `assets/js/AvatarManager.js`
- `assets/js/lip-sync-controller.js`
- `portal/classroom.html`

### Priority 3: Auto-Start TTS Server

Currently requires manual server start when pod boots. Options:
1. Add startup script to RunPod pod configuration
2. Use RunPod Serverless instead of Pods
3. Create GitHub webhook to auto-deploy on push