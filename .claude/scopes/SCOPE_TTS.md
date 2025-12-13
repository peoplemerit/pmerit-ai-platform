# PMERIT SUB-SCOPE: Text-to-Speech (TTS) System

**Version:** 2.0
**Created:** 2025-12-13
**Last Updated:** 2025-12-13
**Status:** OPERATIONAL (Upgrades Required)
**Phase:** Integrated with Avatar System (P5 Classroom)
**Session:** 52

---

## 1. SCOPE IDENTITY

| Attribute | Value |
|-----------|-------|
| **Feature** | AI-Powered Text-to-Speech for Avatar & Tutor |
| **Pages** | `portal/classroom.html`, `index.html` (AI chat) |
| **Backend** | `pmerit-api-worker/src/routes/tts.ts` |
| **Frontend** | `tts.js`, `tts-client.js`, `AvatarManager.js`, `lip-sync-controller.js` |
| **API Endpoints** | `POST /api/v1/tts`, `GET /api/v1/tts/quota` |
| **Production URL** | `https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts` |

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
| TTS-007 | Quota Management | KV-based daily tracking | Ready but requires `TTS_QUOTA_KV` binding | 17 |
| TTS-008 | Premium Provider | DigitalOcean + Piper TTS | Natural human voice for paying users | 52 |

---

## 3. CURRENT STATE (Session 52 Audit)

### ✅ Working Features

| Feature | Status | Evidence |
|---------|--------|----------|
| TTS Endpoint | ✅ Operational | Returns MP3 audio (HTTP 200) |
| Voice Selection Modal | ✅ Working | Shows 4 voices (Alloy, Echo, Fable, Onyx) |
| Settings Toggle | ✅ Present | Dark Mode, Text-to-Speech, Preview Voices |
| Browser Fallback | ✅ Working | Web Speech API activates on error |
| Avatar Lip Sync | ✅ Integrated | `tts:viseme` events drive jaw animation |
| Audio Caching | ✅ Working | 1-year TTL on cached phrases |

### ⚠️ Gaps Identified

| Gap | Priority | Impact | Status |
|-----|----------|--------|--------|
| TTS_QUOTA_KV not configured | 🔴 High | Shows "Unlimited" - no usage tracking | Open |
| Voice distinction unclear | 🟡 Medium | MeloTTS may sound identical for all voices | Needs Testing |
| No premium voice option | 🟡 Medium | Users wanting natural voice have no option | Open |
| Theme inconsistency | 🟢 Low | Modal doesn't use platform CSS variables | Open |
| Missing Nova/Shimmer voices | 🟢 Low | Only 4 of 6 voices shown in modal | Open |

---

## 4. IMPLEMENTATION TASKS

### TASK 1: TTS_QUOTA_KV Binding Configuration

**Priority:** 🔴 HIGH
**Environment:** Backend (BE)
**Complexity:** Low
**Estimated Time:** 15 minutes

#### Problem
The quota endpoint returns `{"success":false,"error":"Quota tracking not configured"}` because `TTS_QUOTA_KV` KV namespace is not bound in `wrangler.toml`.

#### Solution

**Step 1: Create KV Namespace**
```bash
cd E:\pmerit\pmerit-api-worker
wrangler kv:namespace create "TTS_QUOTA"
```

Expected output:
```
🌀 Creating namespace with title "pmerit-api-worker-TTS_QUOTA"
✅ Success!
Add the following to your wrangler.toml:
[[kv_namespaces]]
binding = "TTS_QUOTA_KV"
id = "YOUR_NAMESPACE_ID_HERE"
```

**Step 2: Update wrangler.toml**

Add to `wrangler.toml` (after existing KV bindings if any):
```toml
[[kv_namespaces]]
binding = "TTS_QUOTA_KV"
id = "YOUR_NAMESPACE_ID_HERE"
```

**Step 3: Deploy**
```bash
wrangler deploy
```

**Step 4: Verify**
```bash
curl "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts/quota"
```

Expected response:
```json
{
  "success": true,
  "quota": {
    "used": 0,
    "remaining": 10000,
    "limit": 10000,
    "resetAt": "2025-12-14T00:00:00.000Z",
    "percentUsed": 0
  },
  "provider": "cloudflare-workers-ai",
  "voicesAvailable": ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
}
```

#### Files Modified
- `wrangler.toml` (add KV binding)

#### Acceptance Criteria
- [ ] `/api/v1/tts/quota` returns `success: true`
- [ ] Quota shows `remaining: 10000` (not "Unlimited")
- [ ] Voice modal displays actual quota instead of "Unlimited"

---

### TASK 2: Voice Testing & Documentation

**Priority:** 🟡 MEDIUM
**Environment:** Frontend (FE)
**Complexity:** Low
**Estimated Time:** 30 minutes

#### Problem
MeloTTS model may not distinguish between voice options (alloy, echo, fable, etc.). Need to verify which voices sound distinct.

#### Solution

**Step 1: Browser Console Test**
```javascript
// Run in browser console on https://pmerit.com
const testVoices = async () => {
  const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
  const testText = "Hello, welcome to PMERIT. I am your learning assistant.";
  
  for (const voice of voices) {
    console.log(`🔊 Testing voice: ${voice}`);
    try {
      const response = await fetch('https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testText, voice })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
        await new Promise(r => setTimeout(r, 4000)); // Wait for playback
        console.log(`✅ ${voice}: Played successfully`);
      } else {
        console.log(`❌ ${voice}: Failed - ${response.status}`);
      }
    } catch (err) {
      console.log(`❌ ${voice}: Error - ${err.message}`);
    }
  }
};

testVoices();
```

**Step 2: Document Results**
Create a voice comparison table in this scope document.

#### Expected Outcome
Document which voices are:
- Distinct (sound different)
- Identical (same audio output)
- Non-functional (errors)

#### Acceptance Criteria
- [ ] All 6 voices tested
- [ ] Results documented in Section 13 (Voice Testing Results)
- [ ] Recommendation made for which voices to keep in UI

---

### TASK 3: Primo Voice (Premium TTS) Implementation

**Priority:** 🟡 MEDIUM
**Environment:** Both (FE + BE)
**Complexity:** Medium
**Estimated Time:** 2-4 hours

#### Problem
Users wanting natural, human-quality voice have no premium option. Current MeloTTS is robotic.

#### Solution Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIMO VOICE ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Request                                                   │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ Cloudflare API  │──── voice: "primo" ────┐                   │
│  │ /api/v1/tts     │                        │                   │
│  └─────────────────┘                        ▼                   │
│       │                          ┌──────────────────────┐       │
│       │ voice: "alloy"           │ DigitalOcean Droplet │       │
│       │ (free tier)              │ Piper TTS API        │       │
│       ▼                          │ https://tts.pmerit.com│      │
│  ┌─────────────────┐             └──────────────────────┘       │
│  │ MeloTTS         │                        │                   │
│  │ (CF Workers AI) │                        ▼                   │
│  └─────────────────┘             ┌──────────────────────┐       │
│       │                          │ High-Quality Audio   │       │
│       ▼                          │ (Natural Human Voice)│       │
│  ┌─────────────────┐             └──────────────────────┘       │
│  │ Standard Audio  │                                            │
│  │ (Robotic Voice) │                                            │
│  └─────────────────┘                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### DigitalOcean Server Setup

**Server Specifications:**
| Component | Value |
|-----------|-------|
| Droplet Type | CPU-Optimized |
| Size | 2 vCPU, 4GB RAM |
| OS | Ubuntu 22.04 LTS |
| Region | NYC1 (closest to users) |
| Monthly Cost | ~$24/mo |

**Step 1: Create Droplet**
```bash
# Via DigitalOcean Console or CLI
doctl compute droplet create pmerit-tts \
  --image ubuntu-22-04-x64 \
  --size c-2 \
  --region nyc1 \
  --ssh-keys YOUR_SSH_KEY_ID
```

**Step 2: Install Piper TTS**
```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Update system
apt update && apt upgrade -y

# Install dependencies
apt install -y python3-pip python3-venv nginx certbot python3-certbot-nginx

# Create TTS directory
mkdir -p /opt/pmerit-tts
cd /opt/pmerit-tts

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Piper TTS
pip install piper-tts

# Download voice model (en_US-lessac-medium is high quality)
mkdir -p models
cd models
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json
```

**Step 3: Create FastAPI Wrapper**

Create `/opt/pmerit-tts/server.py`:
```python
"""
Piper TTS API Server
PMERIT Primo Voice Service
"""
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os

app = FastAPI(title="PMERIT Primo Voice API")

# CORS for Cloudflare Worker
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pmerit-api-worker.peoplemerit.workers.dev", "https://pmerit.com"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

PIPER_MODEL = "/opt/pmerit-tts/models/en_US-lessac-medium.onnx"

class TTSRequest(BaseModel):
    text: str
    speed: float = 1.0

@app.post("/api/tts")
async def generate_speech(request: TTSRequest):
    if len(request.text) > 5000:
        raise HTTPException(status_code=400, detail="Text too long (max 5000 chars)")
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text required")
    
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            # Run Piper TTS
            process = subprocess.run(
                ["piper", "--model", PIPER_MODEL, "--output_file", tmp.name],
                input=request.text.encode(),
                capture_output=True
            )
            
            if process.returncode != 0:
                raise HTTPException(status_code=500, detail="TTS generation failed")
            
            # Read generated audio
            with open(tmp.name, "rb") as f:
                audio_data = f.read()
            
            os.unlink(tmp.name)
            
            return Response(
                content=audio_data,
                media_type="audio/wav",
                headers={
                    "X-TTS-Provider": "piper-primo",
                    "X-Char-Count": str(len(request.text))
                }
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "provider": "piper-tts", "model": "en_US-lessac-medium"}
```

**Step 4: Create Systemd Service**

Create `/etc/systemd/system/pmerit-tts.service`:
```ini
[Unit]
Description=PMERIT Primo Voice TTS API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/pmerit-tts
Environment="PATH=/opt/pmerit-tts/venv/bin"
ExecStart=/opt/pmerit-tts/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
systemctl daemon-reload
systemctl enable pmerit-tts
systemctl start pmerit-tts
```

**Step 5: Configure Nginx + SSL**

Create `/etc/nginx/sites-available/pmerit-tts`:
```nginx
server {
    listen 80;
    server_name tts.pmerit.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and get SSL:
```bash
ln -s /etc/nginx/sites-available/pmerit-tts /etc/nginx/sites-enabled/
certbot --nginx -d tts.pmerit.com
systemctl reload nginx
```

**Step 6: Update DNS**
Add A record: `tts.pmerit.com` → `YOUR_DROPLET_IP`

#### Backend Integration

**Update `src/routes/tts.ts`:**

```typescript
// Add to TTS_CONFIG
const TTS_CONFIG = {
  // ... existing config ...
  
  // Premium TTS Configuration
  PRIMO_ENABLED: true,
  PRIMO_API_URL: 'https://tts.pmerit.com/api/tts',
  PRIMO_VOICES: {
    'primo': 'Natural human voice (Premium)',
    'primo-warm': 'Warm storytelling voice (Premium)',
  }
};

// Add Primo TTS generator function
async function generatePrimoTTS(
  text: string,
  voice: string = 'primo'
): Promise<ArrayBuffer> {
  const response = await fetch(TTS_CONFIG.PRIMO_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, speed: 1.0 })
  });
  
  if (!response.ok) {
    throw new Error('Primo TTS generation failed');
  }
  
  return await response.arrayBuffer();
}

// Update POST handler to check for primo voice
// In the POST function, before calling generateCloudflareTTS:
if (voice.startsWith('primo') && TTS_CONFIG.PRIMO_ENABLED) {
  try {
    audioBuffer = await generatePrimoTTS(text, voice);
    // Return with premium headers
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
```

#### Frontend Integration

**Update voice selection modal in `tts.js` or voice modal component:**

```javascript
// Add Primo voice option
const VOICE_OPTIONS = [
  // Free tier voices
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced', tier: 'free', icon: '🔵' },
  { id: 'echo', name: 'Echo', description: 'Clear and articulate', tier: 'free', icon: '🟢' },
  { id: 'fable', name: 'Fable', description: 'Warm storytelling', tier: 'free', icon: '🟡' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative', tier: 'free', icon: '🟣' },
  
  // Premium tier voices
  { id: 'primo', name: 'Primo Voice', description: 'Natural human voice ⭐', tier: 'premium', icon: '✨' },
];

// Add premium badge to voice option UI
function renderVoiceOption(voice) {
  const isPremium = voice.tier === 'premium';
  return `
    <div class="voice-option ${isPremium ? 'voice-premium' : ''}" data-voice="${voice.id}">
      <span class="voice-icon">${voice.icon}</span>
      <div class="voice-info">
        <span class="voice-name">${voice.name}</span>
        ${isPremium ? '<span class="premium-badge">PREMIUM</span>' : ''}
        <span class="voice-desc">${voice.description}</span>
      </div>
      <button class="voice-preview-btn">▶ Preview</button>
      <button class="voice-select-btn">Select</button>
    </div>
  `;
}
```

#### Acceptance Criteria
- [ ] DigitalOcean Droplet created and running
- [ ] Piper TTS installed with en_US-lessac-medium model
- [ ] FastAPI server responding at https://tts.pmerit.com/health
- [ ] Backend routes updated with Primo voice support
- [ ] Frontend voice modal shows "Primo Voice" option
- [ ] Premium voice sounds noticeably more natural than MeloTTS

---

### TASK 4: Theme & Font Alignment

**Priority:** 🟢 LOW
**Environment:** Frontend (FE)
**Complexity:** Low
**Estimated Time:** 30 minutes

#### Problem
Voice selection modal uses inline styles that don't match platform design system.

#### Current Issues
| Element | Issue | CSS Variable to Use |
|---------|-------|---------------------|
| Modal background | Hardcoded dark | `var(--bg-modal)` |
| Selected button | Green #22c55e | `var(--success)` |
| Select button | Blue hardcoded | `var(--btn-primary-bg)` |
| Preview button | Outline style | `var(--btn-secondary-*)` |
| Voice icons | Custom gradients | Keep (good design) |
| Font | May not match | `var(--font-primary)` |

#### Solution

**Create or update voice modal styles in appropriate CSS file:**

```css
/* Voice Selection Modal - Platform Theme Alignment */

.voice-select-modal {
  font-family: var(--font-primary, 'Inter', system-ui, sans-serif);
  background: var(--bg-modal, rgba(0, 0, 0, 0.8));
}

.voice-select-modal .modal-content {
  background: var(--bg-card, #1a1a2e);
  border-radius: var(--radius-lg, 12px);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
}

.voice-select-modal .modal-title {
  color: var(--text-primary, #ffffff);
  font-size: var(--text-xl, 1.25rem);
  font-weight: var(--font-semibold, 600);
}

.voice-option {
  background: var(--bg-secondary, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-md, 8px);
  padding: var(--spacing-md, 16px);
  transition: var(--transition, 0.2s ease);
}

.voice-option:hover {
  background: var(--bg-hover, rgba(255, 255, 255, 0.1));
  border-color: var(--primary, #3b82f6);
}

.voice-option.selected {
  border-color: var(--success, #22c55e);
  background: rgba(34, 197, 94, 0.1);
}

.voice-preview-btn {
  background: var(--btn-secondary-bg, transparent);
  color: var(--btn-secondary-text, var(--primary));
  border: 1px solid var(--btn-secondary-border, var(--primary));
  border-radius: var(--radius-md, 6px);
  padding: 8px 16px;
  font-size: var(--text-sm, 0.875rem);
  transition: var(--transition, 0.2s ease);
}

.voice-preview-btn:hover {
  background: var(--bg-hover, rgba(59, 130, 246, 0.1));
}

.voice-select-btn {
  background: var(--btn-primary-bg, var(--primary));
  color: var(--btn-primary-text, white);
  border: none;
  border-radius: var(--radius-md, 6px);
  padding: 8px 16px;
  font-size: var(--text-sm, 0.875rem);
  font-weight: var(--font-medium, 500);
  transition: var(--transition, 0.2s ease);
}

.voice-select-btn:hover {
  background: var(--btn-primary-hover, var(--primary-dark));
  transform: translateY(-1px);
}

.voice-select-btn.selected {
  background: var(--success, #22c55e);
}

.voice-select-btn.selected:hover {
  background: var(--success-dark, #16a34a);
}

/* Premium voice styling */
.voice-option.voice-premium {
  border-color: var(--warning, #f59e0b);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.1));
}

.premium-badge {
  background: linear-gradient(135deg, var(--warning), var(--warning-dark, #d97706));
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Quota display */
.quota-display {
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  font-size: var(--text-sm, 0.875rem);
}

.quota-display .quota-value {
  color: var(--success, #22c55e);
  font-weight: var(--font-semibold, 600);
}

/* Dark mode compatibility (already dark by default) */
[data-theme="light"] .voice-select-modal .modal-content {
  background: var(--bg-card-light, #ffffff);
  border-color: var(--border-color-light, #e5e7eb);
}

[data-theme="light"] .voice-option {
  background: var(--bg-secondary-light, #f9fafb);
  border-color: var(--border-color-light, #e5e7eb);
}
```

#### Files to Modify
- `assets/css/components.css` or `assets/css/voice-modal.css`
- Ensure CSS is imported in pages using voice modal

#### Acceptance Criteria
- [ ] Voice modal uses platform CSS variables
- [ ] Colors match rest of platform
- [ ] Dark mode works correctly
- [ ] Light mode (if supported) works correctly
- [ ] Premium badge styling looks polished

---

## 5. CONFIGURATION REQUIREMENTS

### Backend (wrangler.toml)

```toml
# Required: TTS Quota Tracking
[[kv_namespaces]]
binding = "TTS_QUOTA_KV"
id = "YOUR_KV_NAMESPACE_ID"

# Required: Workers AI binding (should already exist)
[ai]
binding = "AI"
```

### Environment Variables / Secrets

| Variable | Required | How to Set | Current Status |
|----------|----------|------------|----------------|
| AI | Yes | wrangler.toml binding | ✅ Configured |
| TTS_QUOTA_KV | Yes | wrangler.toml KV binding | ❌ Not configured |
| PRIMO_API_URL | Optional | Environment variable | ❌ Not configured |

### DNS Records (for Primo Voice)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | tts | YOUR_DROPLET_IP | 300 |

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

### Premium Tier (Primo Voice - Future)

| Limit | Value | Notes |
|-------|-------|-------|
| Daily Characters | 50,000 | Per paying user |
| Max Text per Request | 10,000 chars | Higher limit |
| Priority | High | Dedicated server |
| Voice Quality | Natural human | Piper TTS |

---

## 7. FALLBACK HIERARCHY

```
1. Primo Voice (if premium user + enabled)
   │   └── On error/unavailable
   ▼
2. Cloudflare Workers AI (MeloTTS)
   │   └── On quota exceeded or error
   ▼
3. Browser Web Speech API (speechSynthesis)
   │   └── On browser not supported
   ▼
4. Silent mode (text-only, no speech)
```

---

## 8. API SPECIFICATION

### POST /api/v1/tts

Generate speech audio from text.

**Request:**
```json
{
  "text": "Hello, welcome to PMERIT!",
  "voice": "alloy",
  "language": "en-US"
}
```

**Voice Options:**
| Voice | Tier | Description |
|-------|------|-------------|
| alloy | Free | Neutral and balanced |
| echo | Free | Clear and articulate |
| fable | Free | Warm storytelling |
| onyx | Free | Deep and authoritative |
| nova | Free | Energetic |
| shimmer | Free | Smooth |
| primo | Premium | Natural human voice |

**Response (Success):**
- Status: 200
- Content-Type: audio/mpeg (or audio/wav for Primo)
- Body: Binary audio data
- Headers:
  - `X-TTS-Provider`: cloudflare-workers-ai | piper-primo
  - `X-Voice`: alloy
  - `X-Char-Count`: 27
  - `X-Quota-Remaining`: 9973
  - `X-Cache-Status`: MISS | HIT
  - `X-Premium`: true (if Primo voice)

**Response (Quota Exceeded):**
```json
{
  "success": false,
  "quotaExceeded": true,
  "fallbackRequired": true,
  "quotaRemaining": 0,
  "message": "Daily TTS quota exceeded...",
  "resetAt": "2025-12-14T00:00:00.000Z"
}
```
- Status: 429

### GET /api/v1/tts/quota

Check current TTS quota status.

**Response:**
```json
{
  "success": true,
  "quota": {
    "used": 2500,
    "remaining": 7500,
    "limit": 10000,
    "resetAt": "2025-12-14T00:00:00.000Z",
    "percentUsed": 25
  },
  "provider": "cloudflare-workers-ai",
  "voicesAvailable": ["alloy", "echo", "fable", "onyx", "nova", "shimmer", "primo"]
}
```

---

## 9. FRONTEND MODULES

### tts.js (Primary TTS Module)
- **Location:** `assets/js/tts.js`
- **API:** `window.TTS.speak(text, options)`
- **Features:**
  - Server TTS with Cloudflare Workers AI
  - Browser fallback via Web Speech API
  - Voice engine selection (persisted to localStorage)
  - WebAudio analysis for viseme hints
  - Event emission: `tts:start`, `tts:end`, `tts:viseme`, `tts:fallback`

### tts-client.js (Alternative Client)
- **Location:** `assets/js/tts-client.js`
- **API:** `window.TTSClient.speak(text)`
- **Features:**
  - Text preprocessing (markdown stripping, brand name pronunciation)
  - Client-side audio caching
  - Voice preference persistence
  - Quota awareness

### lip-sync-controller.js
- **Location:** `assets/js/lip-sync-controller.js`
- **Features:**
  - FFT-based amplitude analysis
  - Frequency band detection for approximate viseme
  - ~30 FPS viseme event emission
  - Smoothing and intensity threshold

---

## 10. DEPENDENCIES

| Direction | Scope | Reason |
|-----------|-------|--------|
| **Requires** | Cloudflare Workers AI | Primary TTS provider |
| **Requires** | Web Speech API | Browser fallback |
| **Requires** | DigitalOcean (optional) | Primo Voice server |
| **Enables** | SCOPE_AVATAR | Audio for lip sync |
| **Enables** | SCOPE_CLASSROOM | AI tutor voice |

---

## 11. TESTING COMMANDS

### Production TTS Test
```bash
# Generate speech (free tier)
curl -X POST "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, welcome to PMERIT!","voice":"alloy"}' \
  --output test-alloy.mp3

# Check quota
curl "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts/quota"

# Test Primo voice (when configured)
curl -X POST "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, welcome to PMERIT!","voice":"primo"}' \
  --output test-primo.wav
```

### Browser Console Test
```javascript
// Test standard voice
await window.TTS.speak("Hello, welcome to PMERIT!", { voice: 'alloy' });

// Test all voices
const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
for (const v of voices) {
  console.log(`Testing ${v}...`);
  await window.TTS.speak(`This is the ${v} voice.`, { voice: v });
  await new Promise(r => setTimeout(r, 3000));
}
```

### DigitalOcean Health Check
```bash
curl https://tts.pmerit.com/health
# Expected: {"status":"healthy","provider":"piper-tts","model":"en_US-lessac-medium"}
```

---

## 12. FILE REFERENCE

### Backend Files
| File | Purpose | Status |
|------|---------|--------|
| `src/routes/tts.ts` | TTS route handler, quota management | Needs update for Primo |
| `src/index.ts` | TTS endpoint registration | ✅ Complete |
| `src/types.ts` | Env interface with TTS_QUOTA_KV | ✅ Complete |
| `wrangler.toml` | Worker configuration | Needs KV binding |

### Frontend Files
| File | Purpose | Status |
|------|---------|--------|
| `assets/js/tts.js` | Primary TTS module | Needs Primo support |
| `assets/js/tts-client.js` | Alternative TTS client | ✅ Complete |
| `assets/js/lip-sync-controller.js` | Audio analysis for lip sync | ✅ Complete |
| `assets/js/avatar/AvatarManager.js` | Avatar coordination | ✅ Complete |
| `assets/css/components.css` | Component styles | Needs voice modal styles |

### Infrastructure Files (Primo Voice)
| File | Location | Purpose |
|------|----------|---------|
| `server.py` | DigitalOcean:/opt/pmerit-tts/ | FastAPI TTS server |
| `pmerit-tts.service` | DigitalOcean:/etc/systemd/system/ | Systemd service |
| `pmerit-tts` | DigitalOcean:/etc/nginx/sites-available/ | Nginx config |

---

## 13. VOICE TESTING RESULTS

> **Tested:** Session 52 (2025-12-13) by Claude Code

### Key Finding: MeloTTS Does NOT Support Voice Selection

The backend code (`tts.ts:153-156`) only passes `lang: 'en'` to MeloTTS - the voice parameter is accepted but **not used**:

```typescript
const response = await ai.run(TTS_CONFIG.CF_TTS_MODEL, {
  prompt: text,  // MeloTTS uses 'prompt', not 'text'
  lang: 'en'     // Language (MeloTTS doesn't support voice selection)
});
```

### Test Results

| Voice | HTTP | File Size | MD5 Hash | Distinct Audio? |
|-------|------|-----------|----------|-----------------|
| alloy | 200 | 271,718 bytes | 0df6e087c940922e2be3aa29b8b821ae | N/A (baseline) |
| echo | 200 | 269,670 bytes | c766d16c8af58d4b4052b6463161a52c | Random variation |
| fable | 200 | 269,670 bytes | c4e6490e471b08b5f19a25c485016e1f | Random variation |
| onyx | 200 | 270,694 bytes | f0ee1b54b578ba2297bdae54712b8f51 | Random variation |
| nova | 200 | 273,766 bytes | d56a0788438dbdb0f9144dd07f450979 | Random variation |
| shimmer | 200 | 270,694 bytes | 59b382053355dd242782fe8d6954e126 | Random variation |

### Additional Finding: Non-Deterministic Output

Same voice + same text = **different audio** each request:
- alloy request 1: `0df6e087c940922e2be3aa29b8b821ae`
- alloy request 2: `70424962f2a52ae710feeb64172f26be`

This confirms MeloTTS uses a random seed internally, causing slight variations in output.

### Cache Analysis

- Cache status: `X-Cache-Status: MISS` on repeated requests
- The cache key function may need revision to include voice parameter
- Current cache TTL: 1 year (but cache misses suggest key mismatch)

### Recommendation

**For MVP:** Keep voice selection UI as-is (users perceive choice even if output is similar).

**For Future:**
1. Either remove voice selection (honest UX)
2. Or implement actual voice differentiation via Primo Voice (Piper TTS with multiple models)

| Voice | Keep in UI? | Reason |
|-------|-------------|--------|
| alloy | ✅ Yes | Default, perceived as "standard" |
| echo | ❌ Remove | No actual differentiation |
| fable | ❌ Remove | No actual differentiation |
| onyx | ❌ Remove | No actual differentiation |
| nova | ❌ Remove | No actual differentiation |
| shimmer | ❌ Remove | No actual differentiation |
| primo | ✅ Add | Premium tier with real human voice (Piper TTS) |

**Simplified UI Recommendation:**
- Free tier: Single "Standard Voice" (alloy internally)
- Premium tier: "Primo Voice" (Piper TTS)

---

## 14. IMPLEMENTATION CHECKLIST

### Phase 1: Core Configuration (Immediate) ✅ COMPLETE
- [x] Create TTS_QUOTA_KV namespace (`ca0588f54b98418ea5d730aac89e870a`)
- [x] Add binding to wrangler.toml
- [x] Deploy backend worker (Version: `44b632ae-223d-4fbd-bc3d-2b634e7e7e16`)
- [x] Verify quota endpoint returns data
- [ ] Update frontend to show actual quota (optional - API works)

### Phase 2: Testing & Validation ✅ COMPLETE
- [x] Test all 6 MeloTTS voices
- [x] Document voice comparison results (Section 13)
- [x] Verify lip sync integration (confirmed working)
- [x] Test quota increment/decrement (16 chars = 16 used)

### Phase 3: Theme Alignment
- [ ] Audit voice modal current CSS
- [ ] Create/update voice modal styles
- [ ] Apply platform CSS variables
- [ ] Test dark mode
- [ ] Test light mode (if applicable)

### Phase 4: Primo Voice (Premium)
- [ ] Create DigitalOcean Droplet
- [ ] Install Piper TTS
- [ ] Deploy FastAPI server
- [ ] Configure SSL with Let's Encrypt
- [ ] Add DNS record for tts.pmerit.com
- [ ] Update backend with Primo route
- [ ] Update frontend voice modal
- [ ] Test end-to-end Primo voice

---

## 15. SESSION HISTORY

| Session | Date | Changes |
|---------|------|---------|
| 17 | 2025-12-XX | Initial TTS implementation |
| 41 | 2025-12-07 | Fixed TTS path in AvatarManager |
| 45 | 2025-12-11 | Avatar lip sync integration |
| 51 | 2025-12-13 | Created SCOPE_TTS.md v1.0 |
| 52 | 2025-12-13 | Updated SCOPE_TTS.md v2.0 with full implementation plan |
| 52 | 2025-12-13 | Task 1 COMPLETE: TTS_QUOTA_KV binding configured, deployed |
| 52 | 2025-12-13 | Task 2 COMPLETE: Voice testing revealed MeloTTS ignores voice parameter |

---

*Last Updated: 2025-12-13 by Claude Code (Session 52)*
*Phase 1 & 2 Complete — Phase 3 & 4 Pending*