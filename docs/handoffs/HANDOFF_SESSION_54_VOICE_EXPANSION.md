# PMERIT HANDOFF: Session 54 — Voice Expansion & Subscription Gating

**From:** Claude Web (Session 53)
**To:** Claude Code Desktop
**Date:** 2025-12-14
**Priority:** 🔴 HIGH — Continue Implementation

---

## 🎯 SESSION OBJECTIVES

1. **Lock Primo Voice for premium users only** (subscription gating)
2. **Add free voice variety** (male, female, child options using Edge TTS)
3. **Update frontend voice modal** to show proper options with tier badges

---

## ✅ COMPLETED IN SESSION 53

| Task | Status | Details |
|------|--------|---------|
| RunPod Pod Created | ✅ | `xfdsuii2ig7rsl` (pmerit-tts-v2) |
| Piper TTS Server | ✅ | Running on port 8000 |
| Backend Primo Routing | ✅ | Commit `0002ee9` |
| Cloudflare Secrets | ✅ | RUNPOD_API_KEY, RUNPOD_TTS_URL |
| **Primo Voice Tested** | ✅ | Natural human voice CONFIRMED! |
| Frontend Updated | ✅ | Shows Standard + Primo (see screenshots) |

---

## 🚨 ISSUES TO FIX

### Issue 1: Primo Voice Not Gated
**Current:** Any user can select Primo Voice
**Required:** Only premium subscribers can use Primo Voice

### Issue 2: Limited Free Voice Options
**Current:** One "Standard Voice" (MeloTTS - sounds robotic, same for all)
**Required:** Multiple free voices (male, female, child) with genuine variety

---

## 🔑 CRITICAL INFORMATION

### RunPod Pod (⚠️ MAY BE STOPPED)
```
Pod ID: xfdsuii2ig7rsl
Pod Name: pmerit-tts-v2
Proxy URL: https://xfdsuii2ig7rsl-8000.proxy.runpod.net
Health: https://xfdsuii2ig7rsl-8000.proxy.runpod.net/health
Cost: ~$0.17/hr when running
```

**To restart pod:**
1. Go to https://runpod.io/console/pods
2. Click "Start" on `pmerit-tts-v2`
3. Wait ~30 seconds
4. SSH/Web Terminal: `cd /workspace && python3 tts_server.py`

### Backend API
```
Production: https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts
Method: POST
Body: {"text": "...", "voice": "primo" | "standard" | "edge-male" | etc.}
```

---

## 📋 TASK 1: Add Edge TTS for Free Voice Variety

### Why Edge TTS?
- **100% FREE** (Microsoft's service)
- **High quality** neural voices
- **Multiple voices** - male, female, child
- **No API key needed**

### Recommended Free Voices (US English)

| Voice ID | Name | Gender | Edge TTS Voice |
|----------|------|--------|----------------|
| `standard-male` | Standard Male | Male | `en-US-GuyNeural` |
| `standard-female` | Standard Female | Female | `en-US-JennyNeural` |
| `standard-young` | Young Voice | Child/Young | `en-US-AnaNeural` |

### Implementation: Update RunPod TTS Server

**File:** `scripts/runpod-tts-server.py`

Add Edge TTS support alongside Piper:

```python
# Add to imports
import edge_tts
import asyncio

# Edge TTS voices (FREE)
EDGE_VOICES = {
    'standard-male': 'en-US-GuyNeural',
    'standard-female': 'en-US-JennyNeural', 
    'standard-young': 'en-US-AnaNeural',
}

# Piper TTS voices (PREMIUM)
PIPER_VOICES = {
    'primo': '/workspace/models/en_US-lessac-medium.onnx',
    'primo-female': '/workspace/models/en_US-amy-medium.onnx',  # Need to download
}

async def generate_edge_tts(text: str, voice_id: str) -> bytes:
    """Generate TTS using free Edge TTS"""
    edge_voice = EDGE_VOICES.get(voice_id, 'en-US-GuyNeural')
    communicate = edge_tts.Communicate(text, edge_voice)
    
    audio_data = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data += chunk["data"]
    
    return audio_data

@app.post("/api/tts")
async def tts_endpoint(request: TTSRequest):
    voice = request.voice or 'standard-male'
    
    # Route to appropriate engine
    if voice.startswith('primo'):
        # Premium: Use Piper TTS
        return await generate_piper_tts(request.text, voice)
    elif voice.startswith('standard'):
        # Free: Use Edge TTS
        audio = await generate_edge_tts(request.text, voice)
        return Response(content=audio, media_type="audio/mpeg")
    else:
        # Fallback to Edge TTS male
        audio = await generate_edge_tts(request.text, 'standard-male')
        return Response(content=audio, media_type="audio/mpeg")
```

### Install Edge TTS on RunPod
```bash
pip install edge-tts
```

---

## 📋 TASK 2: Subscription Gating for Primo Voice

### Backend: Check User Subscription

**File:** `src/routes/tts.ts`

Add subscription check before allowing Primo:

```typescript
// In POST handler, before generating Primo voice
if (isPrimoVoice(voice)) {
  // Check if user has premium subscription
  const authHeader = request.headers.get('Authorization');
  const isPremium = await checkPremiumSubscription(authHeader, env);
  
  if (!isPremium) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Premium subscription required for Primo Voice',
      upgradeRequired: true,
      upgradeUrl: '/pricing'
    }), {
      status: 403,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
}

// Helper function
async function checkPremiumSubscription(authHeader: string | null, env: Env): Promise<boolean> {
  if (!authHeader) return false;
  
  // TODO: Implement actual subscription check
  // For now, check against a list of premium user IDs or tokens
  // This should integrate with your payment/subscription system
  
  return false; // Default to not premium until subscription system is ready
}
```

### Frontend: Show Locked State

**File:** `assets/js/tts.js` or voice modal component

```javascript
const VOICE_OPTIONS = [
  // FREE TIER - Edge TTS (available to all)
  { 
    id: 'standard-male', 
    name: 'Standard Male', 
    description: 'Clear male voice',
    tier: 'free',
    icon: '🎤',
    engine: 'edge-tts'
  },
  { 
    id: 'standard-female', 
    name: 'Standard Female', 
    description: 'Clear female voice',
    tier: 'free',
    icon: '🎤',
    engine: 'edge-tts'
  },
  { 
    id: 'standard-young', 
    name: 'Young Voice', 
    description: 'Friendly young voice (great for kids)',
    tier: 'free',
    icon: '🧒',
    engine: 'edge-tts'
  },
  
  // PREMIUM TIER - Piper TTS (subscription required)
  { 
    id: 'primo', 
    name: 'Primo Voice', 
    description: 'Natural human voice ⭐',
    tier: 'premium',
    icon: '✨',
    engine: 'piper-tts',
    requiresSubscription: true
  },
  { 
    id: 'primo-female', 
    name: 'Primo Female', 
    description: 'Natural female voice ⭐',
    tier: 'premium',
    icon: '✨',
    engine: 'piper-tts',
    requiresSubscription: true
  }
];

function renderVoiceOption(voice, userSubscription) {
  const isPremium = voice.tier === 'premium';
  const isLocked = isPremium && !userSubscription?.isPremium;
  
  return `
    <div class="voice-option ${isPremium ? 'voice-premium' : 'voice-free'} ${isLocked ? 'voice-locked' : ''}"
         data-voice="${voice.id}"
         data-tier="${voice.tier}"
         ${isLocked ? 'data-locked="true"' : ''}>
      
      <span class="voice-icon">${voice.icon}</span>
      
      <div class="voice-info">
        <span class="voice-name">${voice.name}</span>
        ${isPremium ? '<span class="premium-badge">PREMIUM</span>' : '<span class="free-badge">FREE</span>'}
        <span class="voice-desc">${voice.description}</span>
      </div>
      
      <div class="voice-actions">
        <button class="voice-preview-btn" onclick="previewVoice('${voice.id}')">
          ▶ Preview
        </button>
        ${isLocked 
          ? `<button class="voice-upgrade-btn" onclick="showUpgradeModal()">
               🔒 Upgrade
             </button>`
          : `<button class="voice-select-btn" onclick="selectVoice('${voice.id}')">
               Select
             </button>`
        }
      </div>
    </div>
  `;
}

// Handle locked voice click
function selectVoice(voiceId) {
  const voice = VOICE_OPTIONS.find(v => v.id === voiceId);
  
  if (voice?.requiresSubscription && !window.userSubscription?.isPremium) {
    showUpgradeModal();
    return;
  }
  
  // Save selection and close modal
  localStorage.setItem('selectedVoice', voiceId);
  updateSelectedVoiceUI(voiceId);
  closeVoiceModal();
}

function showUpgradeModal() {
  // Show subscription upgrade prompt
  const modal = document.getElementById('upgrade-modal') || createUpgradeModal();
  modal.classList.add('active');
}
```

---

## 📋 TASK 3: Update Voice Modal CSS

**File:** `assets/css/voice-modal.css`

```css
/* Voice Tiers */
.voice-option.voice-free {
  background: var(--bg-secondary, rgba(255, 255, 255, 0.05));
  border: 2px solid var(--border-color, rgba(255, 255, 255, 0.1));
}

.voice-option.voice-premium {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.1));
  border: 2px solid rgba(245, 158, 11, 0.3);
}

.voice-option.voice-locked {
  opacity: 0.7;
  cursor: not-allowed;
}

.voice-option.voice-locked:hover {
  border-color: var(--warning, #f59e0b);
}

/* Badges */
.free-badge {
  display: inline-block;
  background: var(--success, #22c55e);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-left: 8px;
}

.premium-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-left: 8px;
}

/* Upgrade Button */
.voice-upgrade-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.voice-upgrade-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Section Headers */
.voice-section-header {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin: 16px 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-color);
}
```

---

## 📋 TASK 4: Update Backend Voice Routing

**File:** `src/routes/tts.ts`

Update to route to correct engine based on voice ID:

```typescript
// Voice routing configuration
const VOICE_CONFIG = {
  // Free voices - Edge TTS (via RunPod)
  'standard-male': { engine: 'edge-tts', edgeVoice: 'en-US-GuyNeural', tier: 'free' },
  'standard-female': { engine: 'edge-tts', edgeVoice: 'en-US-JennyNeural', tier: 'free' },
  'standard-young': { engine: 'edge-tts', edgeVoice: 'en-US-AnaNeural', tier: 'free' },
  
  // Premium voices - Piper TTS (via RunPod)
  'primo': { engine: 'piper-tts', tier: 'premium' },
  'primo-female': { engine: 'piper-tts', tier: 'premium' },
  
  // Legacy mappings (backward compatibility)
  'alloy': { engine: 'edge-tts', edgeVoice: 'en-US-GuyNeural', tier: 'free' },
  'standard': { engine: 'edge-tts', edgeVoice: 'en-US-GuyNeural', tier: 'free' },
};

function getVoiceConfig(voice: string) {
  return VOICE_CONFIG[voice] || VOICE_CONFIG['standard-male'];
}

function isPremiumVoice(voice: string): boolean {
  const config = getVoiceConfig(voice);
  return config.tier === 'premium';
}
```

---

## 🧪 TESTING COMMANDS

### Test Free Voices (Edge TTS)
```powershell
# Male
Invoke-WebRequest -Uri "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts" -Method POST -ContentType "application/json" -Body '{"text":"Hello, I am the standard male voice.","voice":"standard-male"}' -OutFile test-male.mp3

# Female  
Invoke-WebRequest -Uri "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts" -Method POST -ContentType "application/json" -Body '{"text":"Hello, I am the standard female voice.","voice":"standard-female"}' -OutFile test-female.mp3

# Young
Invoke-WebRequest -Uri "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts" -Method POST -ContentType "application/json" -Body '{"text":"Hi! I am the young voice, perfect for kids!","voice":"standard-young"}' -OutFile test-young.mp3
```

### Test Premium Voice (Should Fail Without Subscription)
```powershell
Invoke-WebRequest -Uri "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/tts" -Method POST -ContentType "application/json" -Body '{"text":"This is Primo Voice.","voice":"primo"}' -OutFile test-primo.wav
# Expected: 403 Forbidden with upgradeRequired: true
```

---

## 🎯 EXPECTED FINAL UI

```
┌─────────────────────────────────────────────────┐
│  🎤 Select Your Voice                        ✕  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ── FREE VOICES ──                              │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🎤 Standard Male          [FREE]        │   │
│  │    Clear male voice                     │   │
│  │              [▶ Preview] [✓ Selected]   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🎤 Standard Female        [FREE]        │   │
│  │    Clear female voice                   │   │
│  │              [▶ Preview] [Select]       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🧒 Young Voice            [FREE]        │   │
│  │    Friendly young voice                 │   │
│  │              [▶ Preview] [Select]       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ── PREMIUM VOICES ──                           │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ✨ Primo Voice           [PREMIUM]      │   │
│  │    Natural human voice ⭐               │   │
│  │    Powered by Piper TTS                 │   │
│  │              [▶ Preview] [🔒 Upgrade]   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ✨ Primo Female          [PREMIUM]      │   │
│  │    Natural female voice ⭐              │   │
│  │    Powered by Piper TTS                 │   │
│  │              [▶ Preview] [🔒 Upgrade]   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ────────────────────────────────────────────  │
│  📊 Daily quota: 8,227 characters remaining    │
│     Browser fallback available when exceeded   │
└─────────────────────────────────────────────────┘
```

---

## 📁 FILES TO MODIFY

| File | Changes |
|------|---------|
| `scripts/runpod-tts-server.py` | Add Edge TTS support |
| `src/routes/tts.ts` | Add voice routing, subscription check |
| `assets/js/tts.js` | Update VOICE_OPTIONS array |
| `assets/css/voice-modal.css` | Add tier styling |
| `portal/classroom.html` | Update voice modal if inline |

---

## ✅ ACCEPTANCE CRITERIA

- [ ] Free users see 3 voice options (Male, Female, Young)
- [ ] Free voices work and sound genuinely different
- [ ] Premium voices show "🔒 Upgrade" button for free users
- [ ] Clicking locked voice shows upgrade modal (not selection)
- [ ] Premium users can select and use Primo voices
- [ ] Preview works for all voices
- [ ] Backward compatibility: old voice IDs still work

---

## 🗣️ COMMAND TO START

```
PMERIT CONTINUE

Session 54 - Voice Expansion & Subscription Gating

Primo Voice backend is COMPLETE. Now need to:

1. Add Edge TTS to RunPod server for free voice variety (male, female, young)
2. Implement subscription gating for Primo voices
3. Update frontend voice modal with proper tiers
4. Test all voice options

RunPod Pod: xfdsuii2ig7rsl (may need to restart)

Start by checking if pod is running, then add Edge TTS support.
```

---

## 📊 VOICE ARCHITECTURE SUMMARY

```
┌─────────────────────────────────────────────────────────────┐
│                    VOICE REQUEST FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend                                                   │
│     │                                                       │
│     ▼                                                       │
│  POST /api/v1/tts  { text, voice }                         │
│     │                                                       │
│     ▼                                                       │
│  Backend (Cloudflare Worker)                                │
│     │                                                       │
│     ├─── voice.startsWith('standard') ──► RunPod Edge TTS  │
│     │                                     (FREE)            │
│     │                                                       │
│     ├─── voice.startsWith('primo') ──► Check Subscription  │
│     │         │                                             │
│     │         ├─ Premium? ──► RunPod Piper TTS             │
│     │         │               (PREMIUM)                     │
│     │         │                                             │
│     │         └─ Not Premium? ──► 403 + Upgrade Prompt     │
│     │                                                       │
│     └─── Fallback ──► Cloudflare MeloTTS or Browser API    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ COST REMINDER

**RunPod pod charges ~$0.17/hr when running**

After testing, stop the pod:
1. https://runpod.io/console/pods
2. Click "Stop" on `pmerit-tts-v2`

---

*Generated: 2025-12-14 by Claude Web (Session 53)*
*Previous Session: Primo Voice implementation complete*
*Next Session: Voice expansion + subscription gating*
