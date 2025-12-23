# SCOPE: Self-Hosted Premium Infrastructure

**Status:** PLANNED
**Created:** December 19, 2025 (Session 64)
**Author:** Claude Code
**Hardware:** Dell PowerEdge R740

---

## SCOPE IDENTITY

### Overview

On-premise server infrastructure using a Dell R740 to deliver premium services (photorealistic avatars, natural TTS, local LLM) for paying users while maintaining free cloud-based services.

### Files Owned

**Infrastructure Scripts (to be created)**
| File | Purpose |
|------|---------|
| `scripts/self-hosted/setup.sh` | Main server setup script |
| `scripts/self-hosted/tts-server.py` | Coqui XTTS / Piper TTS API |
| `scripts/self-hosted/avatar-server.py` | MetaHuman + Audio2Face control |
| `scripts/self-hosted/llm-server.py` | Local Llama 3 inference |
| `scripts/self-hosted/nginx.conf` | Load balancer + SSL termination |
| `scripts/self-hosted/cloudflare-tunnel.sh` | Secure connection setup |

**Backend Integration (pmerit-api-worker)**
| File | Purpose |
|------|---------|
| `src/routes/premium.ts` | Premium tier routing |
| `src/routes/tts.ts` | TTS routing (update for self-hosted) |
| `src/middleware/premium-auth.ts` | Premium subscription verification |

---

## HARDWARE SPECIFICATION

### Dell PowerEdge R740 Capabilities

| Component | Typical Spec | PMERIT Use Case |
|-----------|--------------|-----------------|
| CPU | Dual Xeon Scalable (up to 56 cores) | AI inference, video encoding, LLM |
| RAM | Up to 3TB DDR4 | Multiple concurrent sessions |
| GPU Slots | 3x double-wide or 6x single-wide | Real-time avatar rendering, AI |
| Storage | 8-24x 2.5" NVMe/SSD bays | Model storage, caching |
| Network | 10GbE+ | Low-latency streaming |
| iDRAC | Remote management | Monitor from anywhere |

### GPU Options for R740

| GPU | VRAM | Price (Used) | Best For | Concurrent Users |
|-----|------|--------------|----------|------------------|
| RTX 4090 | 24GB | $1,600-1,800 | Avatar rendering | 2-4 |
| RTX A4000 | 16GB | $800-1,000 | TTS/LLM inference | 4-8 |
| RTX A5000 | 24GB | $1,200-1,500 | Balanced | 4-6 |
| A100 40GB | 40GB | $5,000-8,000 | Enterprise scale | 10-20 |
| RTX 3090 | 24GB | $900-1,100 | Budget option | 2-4 |

**Recommended:** 2x RTX 4090 (~$3,400 total)
- One for avatar rendering (Unreal/MetaHuman)
- One for AI inference (LLM + TTS)

---

## ARCHITECTURAL DECISIONS

| ID | Decision | Choice | Rationale |
|----|----------|--------|-----------|
| SHP-001 | Server Placement | Colocation datacenter | Professional cooling, 1Gbps+, 99.9% uptime |
| SHP-002 | Connection Method | Cloudflare Tunnel | Secure, no exposed ports, DDoS protection |
| SHP-003 | TTS Engine | Coqui XTTS v2 | Voice cloning, natural output, open-source |
| SHP-004 | Avatar System | Unreal Engine 5 MetaHuman | Photorealistic, industry standard |
| SHP-005 | Lip Sync | NVIDIA Audio2Face | Real-time, perfect sync from audio |
| SHP-006 | LLM | Llama 3 70B (local) | No API costs, full control, fine-tunable |
| SHP-007 | Streaming | WebRTC Pixel Streaming | Low latency, browser-native |
| SHP-008 | Fallback | Cloud services (RunPod) | Maintain service during maintenance |

---

## TIERED ARCHITECTURE

```
+-----------------------------------------------------------------------+
|                    PMERIT HYBRID INFRASTRUCTURE                        |
+-----------------------------------------------------------------------+
|                                                                        |
|  +------------------------------------------------------------------+  |
|  |                      FREE TIER (Cloud)                           |  |
|  |  +-------------+    +-------------+    +---------------------+   |  |
|  |  | MeloTTS     |    | WebGL 3D    |    | Cloudflare Workers  |   |  |
|  |  | (Robotic)   |    | Avatar      |    | AI (Llama)          |   |  |
|  |  | FREE        |    | FREE        |    | FREE                |   |  |
|  |  +-------------+    +-------------+    +---------------------+   |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  |                    PREMIUM TIER (RunPod Cloud)                   |  |
|  |  +-------------+    +-------------+    +---------------------+   |  |
|  |  | Edge TTS    |    | WebGL 3D    |    | GPT-4 API           |   |  |
|  |  | (Natural)   |    | Avatar      |    | (Via API)           |   |  |
|  |  | $2.99/mo    |    | $2.99/mo    |    | $2.99/mo            |   |  |
|  |  +-------------+    +-------------+    +---------------------+   |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  |              SELF-HOSTED PREMIUM TIER (Dell R740)                |  |
|  |                                                                  |  |
|  |  User Request --> Cloudflare --> Tunnel --> Dell R740           |  |
|  |                                                 |                |  |
|  |                         +----------------------+                 |  |
|  |                         |   NVIDIA GPU Stack   |                 |  |
|  |                         |                      |                 |  |
|  |  +------------------+   |  +----------------+  |                 |  |
|  |  | Coqui XTTS v2    |   |  | Unreal Engine 5|  |                 |  |
|  |  | Voice Cloning    |   |  | MetaHuman      |  |                 |  |
|  |  | 6-sec sample     |   |  | Pixel Streaming|  |                 |  |
|  |  +------------------+   |  +----------------+  |                 |  |
|  |                         |         |           |                  |  |
|  |  +------------------+   |  +----------------+  |                 |  |
|  |  | Llama 3 70B      |   |  | NVIDIA         |  |                 |  |
|  |  | Local Inference  |   |  | Audio2Face     |  |                 |  |
|  |  | No API Costs     |   |  | Lip Sync       |  |                 |  |
|  |  +------------------+   |  +----------------+  |                 |  |
|  |                         +----------------------+                 |  |
|  |                                  |                               |  |
|  |                    WebRTC Stream to Browser                      |  |
|  |                    1080p @ 30fps, Real-time                      |  |
|  |                                                                  |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
+-----------------------------------------------------------------------+
```

---

## SERVICE COMPONENTS

### 1. Coqui XTTS v2 (Natural TTS)

Voice cloning with just 6 seconds of audio sample.

**Features:**
- 17 languages supported
- Voice cloning from short samples
- Emotional expression
- Real-time capable on GPU
- Open source (Apache 2.0)

**API Specification:**
```python
# POST /api/premium/tts
{
    "text": "Let me explain how functions work...",
    "speaker_wav": "teacher_voice_sample.wav",  # 6-second clip
    "language": "en"
}

# Response: audio/wav
```

**Resource Requirements:**
- GPU: RTX 4090 (optimal) or RTX 3090 (acceptable)
- VRAM: 4-8GB for inference
- RAM: 8GB
- Disk: 5GB for models

### 2. Unreal Engine 5 MetaHuman

Photorealistic digital human avatar.

**Features:**
- Film-quality rendering
- Real-time on RTX 4090
- Expressions and emotions
- Customizable appearance
- Streaming via Pixel Streaming

**Pixel Streaming Setup:**
```
Port 8080: Signaling server (WebSocket)
Port 8888: WebRTC data channel
TURN server: Optional for NAT traversal
```

**Resource Requirements:**
- GPU: RTX 4090 (required for real-time)
- VRAM: 12-24GB
- RAM: 32GB
- Disk: 50GB for UE5 project

### 3. NVIDIA Audio2Face

Real-time lip sync from audio input.

**Features:**
- Perfect lip sync from any audio
- Emotional expressions
- Blendshape output for MetaHuman
- Real-time on RTX GPUs

**Pipeline:**
```
Audio (from XTTS) --> Audio2Face --> Blendshapes --> MetaHuman
```

**Resource Requirements:**
- GPU: Any RTX GPU
- VRAM: 2-4GB
- RAM: 8GB

### 4. Local LLM (Llama 3 70B)

AI tutor without API costs.

**Deployment Options:**
```bash
# Option A: Ollama (easiest)
ollama run llama3:70b

# Option B: vLLM (production)
pip install vllm
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3-70b-chat-hf

# Option C: Text Generation Inference
docker run --gpus all -p 8080:80 \
    ghcr.io/huggingface/text-generation-inference:latest \
    --model-id meta-llama/Llama-3-70b-chat-hf
```

**Benefits:**
- No per-token costs
- Full control over responses
- Can fine-tune for education
- Faster than cloud APIs (local)

**Resource Requirements:**
- GPU: RTX 4090 (can run 70B quantized)
- VRAM: 24GB (4-bit quantization)
- RAM: 64GB+ for context
- Disk: 40GB for model weights

---

## NETWORK ARCHITECTURE

### Option A: Home/Office (Testing Only)

```
R740 --> Home Router --> Cloudflare Tunnel --> Users
```

**Pros:** Free, easy setup
**Cons:** Limited upload, ISP restrictions, not production-ready

### Option B: Colocation (Recommended for Production)

```
R740 --> Data Center --> 1Gbps Symmetric --> Cloudflare --> Users
```

**Estimated Costs:**
| Item | Cost/Month |
|------|------------|
| 1U Rack Space | $50-100 |
| Power (500W avg) | $50-100 |
| Bandwidth (1Gbps) | $50-150 |
| **Total** | **$150-350/month** |

**Pros:** Professional cooling, redundant power, direct peering
**Cons:** Monthly cost, limited physical access

### Option C: Hybrid with Cloud Burst

```
R740 (primary) <--> RunPod (overflow)
```

- R740 handles normal load
- RunPod activates for peak demand
- Best of both worlds
- Automatic failover

---

## COST OPTIMIZATION STRATEGIES (From Brainstorm Session 70)

### 1. JIT GPU Instantiation

**Concept:** Spin up GPU resources only during active user sessions, auto-shutdown after inactivity.

```
User Request → Check GPU Status → Provision (if needed) → Process → Idle Timer → Auto-Shutdown
                                         ↓
                              Cold start: 30-60 seconds
                              Warm start: 5-10 seconds (if pod cached)
```

**Implementation:**
- Use RunPod serverless for overflow (already implemented for TTS)
- R740 stays on but GPUs enter low-power state when idle
- Wake-on-LAN or IPMI for full cold start (if datacenter supports)
- Session-based billing for usage tracking

**Savings:** Up to 70% GPU cost reduction vs 24/7 operation

### 2. Spot/Preemptible Instances (Cloud Burst)

**Concept:** Use 70-90% cheaper spot instances for batch processing and overflow.

| Provider | Spot vs On-Demand | Best Use Case |
|----------|-------------------|---------------|
| RunPod | ~60% cheaper | Burst capacity |
| AWS Spot | ~70% cheaper | Batch TTS generation |
| GCP Preemptible | ~80% cheaper | Non-real-time AI |

**When to Use:**
- Pre-generating TTS for common phrases
- Batch processing assessment responses
- Training/fine-tuning models
- Non-time-critical avatar rendering

**Fallback Strategy:**
```
1. Primary: Dell R740 (self-hosted)
2. Burst: RunPod serverless (on-demand)
3. Batch: RunPod spot instances (when available)
4. Emergency: Cloud provider on-demand
```

---

## COST COMPARISON

### Monthly Costs for 1,000 Premium Users

| Service | Cloud Only (RunPod/APIs) | Self-Hosted (R740) |
|---------|--------------------------|---------------------|
| GPU Compute | $500-2,000/mo | $0 (owned) |
| LLM API (OpenAI/Claude) | $500-2,000/mo | $0 (local Llama) |
| TTS API (ElevenLabs) | $99-500/mo | $0 (local XTTS) |
| Electricity | $0 | $100-200/mo |
| Colocation/Internet | $0 | $150-350/mo |
| **TOTAL** | **$1,100-4,500/mo** | **$250-550/mo** |

**ROI:** R740 + GPUs pays for itself in 2-4 months at scale!

### Hardware Investment (One-Time)

| Item | Cost |
|------|------|
| Dell R740 (already owned) | $0 |
| 2x RTX 4090 GPUs | $3,200-3,600 |
| Additional RAM (if needed) | $200-500 |
| NVMe Storage (if needed) | $200-400 |
| Backup R740 (optional) | $800-1,500 |
| **Total Initial** | **$4,400-6,000** |

---

## IMPLEMENTATION PHASES

### Phase 1: Server Foundation (1-2 weeks)

```
Week 1:
[x] Install Ubuntu Server 22.04 LTS
[ ] Configure RAID for storage
[ ] Set up Docker + NVIDIA Container Toolkit
[ ] Install Cloudflare Tunnel
[ ] Basic monitoring (Prometheus/Grafana)

Week 2:
[ ] Deploy Coqui XTTS (natural TTS)
[ ] Deploy Whisper (speech-to-text)
[ ] Deploy Ollama with Llama 3
[ ] Create API endpoints
[ ] Test latency from Cloudflare
```

### Phase 2: Avatar System (2-4 weeks)

```
Week 3-4:
[ ] Install Unreal Engine 5
[ ] Create/import MetaHuman avatar
[ ] Set up NVIDIA Audio2Face pipeline
[ ] Configure Pixel Streaming for WebRTC
[ ] Integrate with TTS output

Week 5-6:
[ ] Build avatar control API
[ ] Add expressions (happy, thinking, explaining)
[ ] Add gestures (pointing, hand movements)
[ ] Optimize for multiple concurrent users
[ ] Load testing
```

### Phase 3: Frontend Integration (1-2 weeks)

```
Week 7-8:
[ ] Connect PMERIT frontend to self-hosted backend
[ ] User authentication for Self-Hosted Premium tier
[ ] Bandwidth detection for quality switching
[ ] Fallback to cloud if self-hosted unavailable
[ ] Premium subscription billing (Stripe)
```

### Phase 4: Optimization & Scale (Ongoing)

```
[ ] Performance tuning
[ ] Add second R740 for redundancy
[ ] Geographic distribution (if needed)
[ ] Auto-scaling policies
[ ] Disaster recovery procedures
```

---

## ENVIRONMENT REQUIREMENTS

### Software Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| Ubuntu Server | 22.04 LTS | Base OS |
| Docker | 24.0+ | Container runtime |
| NVIDIA Driver | 535+ | GPU driver |
| CUDA Toolkit | 12.0+ | GPU compute |
| NVIDIA Container Toolkit | Latest | Docker GPU support |
| Cloudflare Tunnel | Latest | Secure connection |
| Nginx | 1.24+ | Reverse proxy |
| Let's Encrypt | - | SSL certificates (via Cloudflare) |

### Python Environment

```bash
pip install \
    TTS \                  # Coqui TTS
    piper-tts \            # Piper (backup)
    faster-whisper \       # Speech recognition
    vllm \                 # LLM inference
    fastapi \              # API framework
    uvicorn \              # ASGI server
    websockets \           # WebRTC signaling
    prometheus-client      # Monitoring
```

---

## API ENDPOINTS (Self-Hosted)

### TTS Endpoint

```http
POST /api/premium/self-hosted/tts
Content-Type: application/json
Authorization: Bearer <premium_jwt>

{
    "text": "Hello, welcome to PMERIT!",
    "voice": "cloned-teacher",
    "language": "en",
    "emotion": "friendly"
}

Response: audio/wav
Headers:
  X-TTS-Provider: coqui-xtts
  X-Render-Time-Ms: 450
  X-Premium-Tier: self-hosted
```

### Avatar Stream Endpoint

```http
POST /api/premium/self-hosted/avatar/start
Content-Type: application/json
Authorization: Bearer <premium_jwt>

{
    "avatar_id": "metahuman-tutor",
    "quality": "1080p",
    "audio_enabled": true
}

Response:
{
    "success": true,
    "session_id": "uuid",
    "signaling_url": "wss://pmerit-selfhosted.tunnel.cloudflare.com:8080",
    "ice_servers": [...]
}
```

### LLM Chat Endpoint

```http
POST /api/premium/self-hosted/chat
Content-Type: application/json
Authorization: Bearer <premium_jwt>

{
    "messages": [
        {"role": "system", "content": "You are an AI tutor..."},
        {"role": "user", "content": "Explain recursion"}
    ],
    "stream": true
}

Response: text/event-stream (SSE)
```

---

## BACKEND ROUTING LOGIC

```typescript
// src/routes/premium.ts

async function routePremiumRequest(request: Request, env: Env) {
    const user = await verifyPremiumSubscription(request, env);

    if (!user.isPremium) {
        return Response.json({ error: 'Premium subscription required' }, { status: 403 });
    }

    const tier = user.subscriptionTier;

    switch (tier) {
        case 'self-hosted-premium':
            // Route to Dell R740 via Cloudflare Tunnel
            return proxyToSelfHosted(request, env.SELF_HOSTED_URL);

        case 'cloud-premium':
            // Route to RunPod
            return proxyToRunPod(request, env.RUNPOD_URL);

        default:
            // Free tier - use cloud services
            return handleFreeTier(request, env);
    }
}
```

---

## MONITORING & MAINTENANCE

### Health Checks

```bash
# Cron job every 5 minutes
*/5 * * * * /opt/pmerit/scripts/health-check.sh

# health-check.sh
#!/bin/bash
curl -sf http://localhost:8000/health || systemctl restart pmerit-tts
curl -sf http://localhost:8080/health || systemctl restart pmerit-avatar
curl -sf http://localhost:11434/api/version || systemctl restart ollama
```

### Prometheus Metrics

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'pmerit-selfhosted'
    static_configs:
      - targets:
        - 'localhost:9100'  # Node exporter
        - 'localhost:8000'  # TTS metrics
        - 'localhost:8080'  # Avatar metrics
        - 'localhost:11434' # LLM metrics
```

### Alerting Rules

| Metric | Threshold | Action |
|--------|-----------|--------|
| GPU Utilization | > 95% for 5min | Alert + auto-scale |
| Memory Usage | > 90% | Alert |
| Disk Space | < 10GB | Alert |
| API Latency | > 2s | Alert |
| Error Rate | > 1% | Alert |

---

## DEPENDENCIES

### Requires

- Premium subscription system (SCOPE_pricing)
- User authentication (existing)
- Payment processing (Stripe - to be implemented)

### Enables

- Ultra-premium tier pricing ($10-20/month)
- Voice cloning for tutors
- Photorealistic avatars
- Local AI (no API costs at scale)
- Full data sovereignty

---

## VERIFICATION CHECKLIST

| # | Test | Status |
|---|------|--------|
| 1 | R740 boots and runs Ubuntu | PENDING |
| 2 | GPUs detected with nvidia-smi | PENDING |
| 3 | Coqui XTTS generates natural speech | PENDING |
| 4 | MetaHuman renders in real-time | PENDING |
| 5 | Audio2Face syncs lips correctly | PENDING |
| 6 | Llama 3 responds coherently | PENDING |
| 7 | Cloudflare Tunnel connects securely | PENDING |
| 8 | WebRTC streaming works from browser | PENDING |
| 9 | Fallback to cloud works | PENDING |
| 10 | Multiple concurrent users supported | PENDING |

---

## HANDOFF_DOCUMENT

*Awaiting hardware inventory check and network decision from Director*

### Immediate Questions for Director

1. **Hardware Inventory:** What are the current specs of your R740?
   - CPU model (`lscpu` or iDRAC)
   - Current RAM installed
   - Storage configuration (NVMe/SSD/HDD)
   - Network cards (1GbE/10GbE)
   - Power supplies (redundant?)
   - Current GPU slots (empty or populated?)

2. **Network Decision:** Where will the R740 be hosted?
   - Home office (testing only)
   - Colocation facility (production)
   - Cloud data center (if selling hardware)

3. **GPU Purchase:** Which option for immediate premium capability?
   - Option A (Budget): 1x RTX 3090 (~$900)
   - Option B (Recommended): 2x RTX 4090 (~$3,400)
   - Option C (Enterprise): 1x A100 40GB (~$6,000)

---

## RESEARCH_FINDINGS

*Empty - Implementation not started*

---

## SESSION HISTORY

| Session | Date | Action |
|---------|------|--------|
| 64 | 2025-12-19 | Scope created based on Director's R740 infrastructure plan |
| 70 | 2025-12-22 | Added JIT GPU and spot instance cost optimization strategies |

---

*Last Updated: 2025-12-22 (Session 70)*
