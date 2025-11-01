# Self-hosted TTS Alternatives — Research & Implementation Plan

**Issue:** #2  
**Phase:** 10  
**Status:** Planning & Research  
**Last Updated:** November 1, 2024

---

## Executive Summary

This document outlines a comprehensive plan for evaluating and implementing self-hosted Text-to-Speech (TTS) alternatives to Cloudflare Workers AI. While Cloudflare provides a convenient solution with a generous free tier (10,000 Neurons/day), costs will scale as usage grows. Self-hosted open-source models offer comparable quality without per-request fees, though they require dedicated infrastructure investment.

**Key Findings:**
- **Best Quality Models:** Chatterbox TTS (MIT) and Dia-1.6B (Apache 2.0)
- **Most Efficient:** Kokoro v1.0 (82M parameters, Apache 2.0)
- **Recommended Approach:** Start with Kokoro for cost-efficiency, scale to Chatterbox for advanced features
- **Infrastructure Cost:** $99–$199/month for GPU-accelerated dedicated servers
- **Break-even Point:** ~67,000–133,000 characters/day (depends on model and server choice)

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Model Evaluation](#2-model-evaluation)
3. [Prototype Deployment](#3-prototype-deployment)
4. [Integration Architecture](#4-integration-architecture)
5. [Cost Analysis](#5-cost-analysis)
6. [Migration Strategy](#6-migration-strategy)
7. [Risk Assessment](#7-risk-assessment)
8. [Recommendations](#8-recommendations)
9. [Next Steps](#9-next-steps)

---

## 1. Current State Analysis

### 1.1 Existing Implementation

The PMERIT platform currently uses **Cloudflare Workers AI** for TTS:

- **Models:** Deepgram Aura-2-EN, Aura-2-ES, Aura-1, MeloTTS
- **Endpoint:** `/functions/tts/speak.js`
- **Fallback:** Browser Web Speech API when service unavailable
- **Features:**
  - 4 voice engines with language support (English, Spanish, multilingual)
  - ~200ms latency for typical requests
  - Automatic error handling and fallback
  - Analytics tracking with latency metrics
  - Settings persistence (localStorage)

**Current Architecture:**
```
Frontend (settings.html)
    ↓
Client TTS Module (assets/js/tts.js)
    ↓
Cloudflare Function (/functions/tts/speak.js)
    ↓
Cloudflare Workers AI (Deepgram Aura Models)
    ↓
Audio Stream (MP3) → Browser Playback
```

### 1.2 Current Pricing (Cloudflare Workers AI)

- **Free Tier:** 10,000 Neurons/day (resets at midnight UTC)
- **Model Cost:** $0.015 per 1,000 characters (Deepgram Aura)
- **Platform Cost:** $0.011 per 1,000 Neurons (beyond free tier)
- **No Infrastructure Management:** Serverless, scales automatically

**Usage Scenarios:**
- 10,000 characters/day → **Free** (within Neuron limit)
- 100,000 characters/day → **$1.50/day** → **~$45/month**
- 500,000 characters/day → **$7.50/day** → **~$225/month**
- 1,000,000 characters/day → **$15/day** → **~$450/month**

### 1.3 Pain Points

1. **Cost Scaling:** Costs increase linearly with usage
2. **Vendor Lock-in:** Tied to Cloudflare's pricing and model availability
3. **Rate Limits:** Daily Neuron limits require careful monitoring
4. **Limited Customization:** Cannot fine-tune models or add custom voices
5. **Latency Variability:** Dependent on Cloudflare edge network performance

---

## 2. Model Evaluation

### 2.1 Candidate Models Overview

| Model | Parameters | License | Quality | Latency | Languages | Voice Cloning |
|-------|-----------|---------|---------|---------|-----------|---------------|
| **Chatterbox TTS** | 500M | MIT | ⭐⭐⭐⭐⭐ (63.75% win rate) | <200ms | 23 languages | ✅ (7s clip) |
| **Kokoro v1.0** | 82M | Apache 2.0 | ⭐⭐⭐⭐ (44% win rate) | <150ms | English | Basic |
| **F5-TTS** | ~400M | MIT/Apache 2.0 | ⭐⭐⭐⭐ | ~300ms | Multilingual | ✅ |
| **Dia-1.6B** | 1.6B | Apache 2.0 | ⭐⭐⭐⭐⭐ | ~300ms | Multilingual | ✅ Advanced |
| ~~Open Audio S1 Mini~~ | N/A | N/A | N/A | N/A | N/A | N/A |

*Note: Open Audio S1 Mini was not found in current 2024 TTS research. It may be a future model or an alternative name for another system.*

### 2.2 Detailed Model Analysis

#### 2.2.1 Chatterbox TTS (⭐ Recommended for Quality)

**Strengths:**
- State-of-the-art quality: Beats ElevenLabs in blind tests (63.75% preference)
- MIT License: Complete commercial freedom
- Emotion control: Adjustable expressiveness and tone
- Fast inference: Sub-200ms latency
- Zero-shot voice cloning: Only 7–20 seconds of reference audio needed
- 23 language support: Ideal for international expansion
- Efficient: 500M parameters, reasonable resource requirements

**Weaknesses:**
- Moderate GPU requirements (NVIDIA GPU recommended)
- Larger model size (~2GB) requires adequate storage
- More complex deployment than lightweight alternatives

**Resource Requirements:**
- **GPU:** NVIDIA RTX 2060/3060 or better (6GB+ VRAM)
- **RAM:** 16–32GB system memory
- **Storage:** 5–10GB for model and dependencies
- **CPU:** 4+ cores for optimal performance

**Docker Deployment:**
```bash
docker pull ghcr.io/devnen/chatterbox-tts-server
docker run -p 8000:8000 --gpus all \
  -e MODEL_NAME="chatterbox" \
  chatterbox-tts-server
```

**Use Cases:**
- High-quality voice experiences (premium content)
- Multi-language support (international markets)
- Voice cloning (personalized experiences)
- Emotion-rich narration (storytelling, tutoring)

---

#### 2.2.2 Kokoro v1.0 (⭐ Recommended for Efficiency)

**Strengths:**
- Ultra-lightweight: Only 82M parameters
- Apache 2.0 License: Commercial-friendly
- Fast inference: <150ms latency
- Low VRAM usage: Runs on consumer-grade GPUs
- Excellent quality-to-size ratio (44% win rate in blind tests)
- CPU-capable: Can run on CPU-only infrastructure (slower)

**Weaknesses:**
- English only (limited language support)
- Basic voice cloning (not as advanced as Chatterbox/Dia)
- Smaller model may lack expressiveness for complex emotions

**Resource Requirements:**
- **GPU:** NVIDIA GTX 1060/RTX 2060 (4GB+ VRAM) or CPU
- **RAM:** 8–16GB system memory
- **Storage:** 1–2GB for model and dependencies
- **CPU:** 4+ cores (8+ for CPU-only mode)

**Docker Deployment:**
```bash
docker pull ghcr.io/devnen/kitten-tts-server
docker run -p 8000:8000 --gpus all \
  -e MODEL_NAME="kokoro" \
  kitten-tts-server
```

**Use Cases:**
- Cost-sensitive deployments
- High-concurrency scenarios (many parallel requests)
- English-only content
- Edge deployments (lower resource overhead)

---

#### 2.2.3 F5-TTS (Diffusion-based)

**Strengths:**
- Diffusion-based synthesis: Advanced voice fidelity
- MIT/Apache 2.0 License: Flexible licensing
- Multilingual support
- High controllability: Prosody and expressiveness adjustments
- Good voice cloning capabilities

**Weaknesses:**
- Higher compute requirements (diffusion models are GPU-intensive)
- Slower inference: ~300ms latency
- More complex deployment and tuning

**Resource Requirements:**
- **GPU:** NVIDIA RTX 3060 Ti/RTX 4060 or better (8GB+ VRAM)
- **RAM:** 32GB+ system memory
- **Storage:** 5–10GB for model and dependencies
- **CPU:** 6+ cores

**Use Cases:**
- Research and experimentation
- Applications requiring maximum voice quality
- Scenarios where latency is less critical

---

#### 2.2.4 Dia-1.6B (High-end)

**Strengths:**
- Top-tier quality: Rivals commercial models
- Advanced voice cloning: Enterprise-grade capabilities
- Codec-based approach: Excellent modulation and multi-speaker support
- Apache 2.0 License: Commercial-friendly
- 1.6B parameters: Rich expressiveness

**Weaknesses:**
- High resource requirements (datacenter-grade GPU recommended)
- Larger model size (~5GB+)
- Higher infrastructure costs

**Resource Requirements:**
- **GPU:** NVIDIA RTX 3090/A4000/Tesla P4 (16GB+ VRAM)
- **RAM:** 48GB+ system memory
- **Storage:** 10–15GB for model and dependencies
- **CPU:** 8+ cores

**Use Cases:**
- Enterprise deployments
- Premium voice experiences
- Applications requiring maximum expressiveness
- Voice cloning for personalized content at scale

---

### 2.3 Model Comparison Matrix

| Criteria | Chatterbox | Kokoro | F5-TTS | Dia-1.6B | Cloudflare |
|----------|-----------|--------|--------|----------|------------|
| **Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Latency** | <200ms | <150ms | ~300ms | ~300ms | ~200ms |
| **GPU VRAM** | 6GB+ | 4GB+ | 8GB+ | 16GB+ | N/A |
| **Languages** | 23 | English | Multi | Multi | Multi |
| **License** | MIT | Apache 2.0 | MIT/Apache | Apache 2.0 | Proprietary |
| **Cloning** | ✅ Advanced | Basic | ✅ Good | ✅ Advanced | ❌ |
| **Cost/Month** | $99–$179 | $99–$149 | $149–$199 | $179–$299 | $0–$450+ |

---

## 3. Prototype Deployment

### 3.1 Deployment Architecture Options

#### Option A: Docker on Dedicated GPU Server (⭐ Recommended)

**Architecture:**
```
Internet
    ↓
Load Balancer (Cloudflare/Nginx)
    ↓
Docker Container(s) with TTS Models
    ↓
GPU Server (NVIDIA CUDA-enabled)
```

**Pros:**
- Full control over infrastructure
- Predictable costs
- Best performance and latency
- Easy to scale vertically (upgrade server)

**Cons:**
- Requires server management
- Higher upfront investment
- Manual scaling (add more servers)

**Recommended Providers:**
- **Hetzner:** €99–€179/month for dedicated GPU servers (best value)
- **DatabaseMart:** $99–$199/month for GPU-optimized instances
- **OVH:** €149–€249/month for bare metal GPU servers
- **AWS/Azure/GCP:** $0.30–$4.00/hour ($216–$2,880/month for 24/7)

---

#### Option B: Kubernetes with Auto-scaling

**Architecture:**
```
Internet
    ↓
Ingress Controller
    ↓
Kubernetes Service
    ↓
TTS Pods (auto-scaling based on load)
    ↓
GPU Node Pool
```

**Pros:**
- Horizontal scaling (add more pods)
- High availability (automatic failover)
- Resource efficiency (scale down during low usage)
- Industry-standard orchestration

**Cons:**
- More complex setup and management
- K8s learning curve
- Higher operational overhead
- GPU node pools can be expensive in cloud

**Recommended For:**
- High-traffic scenarios (>10M requests/month)
- Enterprise deployments requiring HA
- Multi-region deployments

---

#### Option C: Hybrid (Cloudflare + Self-hosted Failover)

**Architecture:**
```
Frontend
    ↓
Try Cloudflare Workers AI (primary)
    ↓ (if rate limited or unavailable)
Fallback to Self-hosted TTS
    ↓ (if both unavailable)
Browser Web Speech API
```

**Pros:**
- Leverage free tier (10,000 Neurons/day)
- Gradual migration path
- Cost-effective for variable traffic
- Redundancy and high availability

**Cons:**
- More complex client logic
- Dual infrastructure to maintain
- Potential inconsistency in voice quality

**Recommended For:**
- Transition phase (migration from Cloudflare)
- Cost optimization (use free tier first)
- High availability requirements

---

### 3.2 Docker Deployment Examples

#### 3.2.1 Kokoro (Lightweight)

**Dockerfile:**
```dockerfile
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

# Install Python and dependencies
RUN apt-get update && apt-get install -y \
    python3.10 python3-pip git curl && \
    rm -rf /var/lib/apt/lists/*

# Install Kokoro TTS
WORKDIR /app
RUN git clone https://github.com/resemble-ai/kokoro-tts.git
WORKDIR /app/kokoro-tts
RUN pip3 install -r requirements.txt

# Download model weights
RUN python3 download_model.py --model kokoro-v1.0

# Expose API port
EXPOSE 8000

# Start TTS server
CMD ["python3", "server.py", "--host", "0.0.0.0", "--port", "8000"]
```

**Docker Compose (with Redis caching):**
```yaml
version: '3.8'

services:
  tts:
    build: ./kokoro
    ports:
      - "8000:8000"
    environment:
      - MODEL_NAME=kokoro-v1.0
      - CUDA_VISIBLE_DEVICES=0
      - REDIS_HOST=redis
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - tts

volumes:
  redis-data:
```

---

#### 3.2.2 Chatterbox (High Quality)

**Docker Compose:**
```yaml
version: '3.8'

services:
  chatterbox:
    image: ghcr.io/devnen/chatterbox-tts-server:latest
    ports:
      - "8000:8000"
    environment:
      - MODEL_NAME=chatterbox
      - MAX_WORKERS=4
      - CACHE_ENABLED=true
      - REDIS_URL=redis://redis:6379
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 2gb --maxmemory-policy lru
    volumes:
      - redis-data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - chatterbox

volumes:
  redis-data:
```

---

### 3.3 Benchmarking Plan

#### 3.3.1 Performance Metrics

**Test Scenarios:**

1. **Single Request Latency:**
   - Small text (50 chars): Expected <150ms (Kokoro), <200ms (Chatterbox)
   - Medium text (500 chars): Expected 200–400ms
   - Large text (2000 chars): Expected 800–1500ms

2. **Concurrent Requests:**
   - 10 concurrent: Measure throughput (requests/second)
   - 50 concurrent: Stress test, identify bottlenecks
   - 100 concurrent: Maximum capacity testing

3. **CPU vs GPU Comparison:**
   - Same model on GPU vs CPU
   - Latency difference
   - Resource utilization (VRAM, RAM, CPU %)

**Benchmarking Tools:**
```bash
# Apache Bench
ab -n 1000 -c 10 -p payload.json \
   -T application/json \
   https://tts.example.com/speak

# wrk (HTTP benchmarking)
wrk -t4 -c100 -d30s --latency \
    -s post.lua \
    https://tts.example.com/speak

# Custom Python script
python3 benchmark_tts.py \
    --url https://tts.example.com/speak \
    --concurrency 50 \
    --duration 60 \
    --texts test_sentences.txt
```

#### 3.3.2 Quality Assessment

**Evaluation Criteria:**
1. **Naturalness:** Does it sound human-like?
2. **Clarity:** Are words clearly articulated?
3. **Emotion:** Can it convey appropriate tone?
4. **Consistency:** Does quality remain stable across requests?
5. **Pronunciation:** Handles technical terms, names correctly?

**Testing Method:**
- Blind A/B testing with 10–20 evaluators
- Compare against current Cloudflare TTS
- Use standardized test sentences (PMERIT educational content)
- Rate on scale of 1–5 for each criterion
- Calculate mean opinion score (MOS)

---

## 4. Integration Architecture

### 4.1 Proposed Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ settings.html │  │ learner-portal │  │  assessment.html │  │
│  └───────┬───────┘  └────────┬───────┘  └────────┬─────────┘  │
│          │                   │                    │             │
│          └───────────────────┴────────────────────┘             │
│                              ↓                                  │
│                   ┌─────────────────────┐                       │
│                   │  assets/js/tts.js   │                       │
│                   │  (Client TTS Module)│                       │
│                   └──────────┬──────────┘                       │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                     TTS Service Gateway                          │
│                   (Cloudflare Function)                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /functions/tts/speak.js                                 │  │
│  │                                                           │  │
│  │  • Request validation                                    │  │
│  │  • Rate limiting (per-user)                              │  │
│  │  • Analytics tracking                                    │  │
│  │  • Caching layer (Redis)                                 │  │
│  │  • Routing logic:                                        │  │
│  │    1. Check cache (Redis)                                │  │
│  │    2. Route to self-hosted TTS                           │  │
│  │    3. Fallback to Cloudflare AI (if configured)          │  │
│  │    4. Return 503 (client uses Web Speech API)            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                ┌─────────────┴──────────────┐
                │                            │
                ↓                            ↓
    ┌────────────────────┐      ┌────────────────────────┐
    │  Self-hosted TTS   │      │ Cloudflare Workers AI  │
    │   Microservice     │      │   (Fallback/Overflow)  │
    │                    │      │                        │
    │ Load Balancer      │      │ • Deepgram Aura-2-EN   │
    │        ↓           │      │ • Deepgram Aura-2-ES   │
    │ ┌──────────────┐   │      │ • MeloTTS              │
    │ │ Kokoro Pod 1 │   │      └────────────────────────┘
    │ │ (Primary)    │   │
    │ └──────────────┘   │
    │ ┌──────────────┐   │
    │ │ Kokoro Pod 2 │   │
    │ │ (Replica)    │   │
    │ └──────────────┘   │
    │ ┌──────────────┐   │
    │ │ Chatterbox   │   │
    │ │ (Premium)    │   │
    │ └──────────────┘   │
    │        ↓           │
    │ ┌──────────────┐   │
    │ │ Redis Cache  │   │
    │ │ (Audio LRU)  │   │
    │ └──────────────┘   │
    └────────────────────┘
                │
                ↓
    ┌────────────────────┐
    │   Analytics DB     │
    │   (Request logs,   │
    │   latency metrics) │
    └────────────────────┘
```

### 4.2 Component Details

#### 4.2.1 TTS Service Gateway (Cloudflare Function)

**Enhanced `/functions/tts/speak.js`:**

```javascript
/**
 * Enhanced TTS Gateway with Self-hosted Support
 * Routes requests to self-hosted TTS or Cloudflare AI
 */

// Configuration
const SELF_HOSTED_TTS_URL = process.env.SELF_HOSTED_TTS_URL || 'https://tts.pmerit.internal';
const REDIS_URL = process.env.REDIS_URL;
const USE_SELF_HOSTED = process.env.USE_SELF_HOSTED === 'true';
const CACHE_TTL = 86400; // 24 hours

// Rate limiting
const RATE_LIMIT_REQUESTS = 100;
const RATE_LIMIT_WINDOW = 3600; // 1 hour

async function routeTTSRequest(request, env, ctx) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { text } = body;
    const url = new URL(request.url);
    const voiceEngine = url.searchParams.get('voiceEngine') || 'kokoro';
    
    // Generate cache key
    const cacheKey = `tts:${voiceEngine}:${hashText(text)}`;
    
    // Check cache first (Redis)
    if (REDIS_URL) {
      const cached = await getCachedAudio(cacheKey, env);
      if (cached) {
        console.log('Cache hit:', cacheKey);
        return new Response(cached, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mp3',
            'X-TTS-Engine': voiceEngine,
            'X-TTS-Cache': 'hit',
            'X-TTS-Latency': (Date.now() - startTime).toString()
          }
        });
      }
    }
    
    // Check rate limiting (per-user)
    const userId = request.headers.get('X-User-ID');
    if (userId && await isRateLimited(userId, env)) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'Please try again later'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Route to self-hosted TTS (primary)
    if (USE_SELF_HOSTED) {
      try {
        const ttsResponse = await fetch(`${SELF_HOSTED_TTS_URL}/speak`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, model: voiceEngine }),
          signal: AbortSignal.timeout(10000) // 10s timeout
        });
        
        if (ttsResponse.ok) {
          const audioData = await ttsResponse.arrayBuffer();
          
          // Cache the result
          if (REDIS_URL) {
            await cacheAudio(cacheKey, audioData, CACHE_TTL, env);
          }
          
          // Track analytics
          trackTTSEvent(env, {
            event: 'tts_success',
            engine: voiceEngine,
            source: 'self-hosted',
            latency: Date.now() - startTime,
            textLength: text.length
          });
          
          return new Response(audioData, {
            status: 200,
            headers: {
              'Content-Type': 'audio/mp3',
              'X-TTS-Engine': voiceEngine,
              'X-TTS-Source': 'self-hosted',
              'X-TTS-Latency': (Date.now() - startTime).toString()
            }
          });
        }
        
        console.warn('Self-hosted TTS failed, falling back to Cloudflare AI');
      } catch (error) {
        console.error('Self-hosted TTS error:', error);
      }
    }
    
    // Fallback to Cloudflare Workers AI
    if (env.AI) {
      const model = getCloudflareModel(voiceEngine);
      const aiResponse = await env.AI.run(model, { text });
      
      // Cache the result
      if (REDIS_URL) {
        await cacheAudio(cacheKey, aiResponse, CACHE_TTL, env);
      }
      
      // Track analytics
      trackTTSEvent(env, {
        event: 'tts_success',
        engine: voiceEngine,
        source: 'cloudflare-ai',
        latency: Date.now() - startTime,
        textLength: text.length
      });
      
      return new Response(aiResponse, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mp3',
          'X-TTS-Engine': voiceEngine,
          'X-TTS-Source': 'cloudflare-fallback',
          'X-TTS-Latency': (Date.now() - startTime).toString()
        }
      });
    }
    
    // All options exhausted
    return new Response(JSON.stringify({
      error: 'Service unavailable',
      message: 'TTS service unavailable, use browser fallback',
      fallback: true
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Fallback': 'required'
      }
    });
    
  } catch (error) {
    console.error('TTS gateway error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      fallback: true
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Fallback': 'required'
      }
    });
  }
}

// Helper functions
function hashText(text) {
  // Simple hash for cache key (use crypto.subtle.digest in production)
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

async function getCachedAudio(key, env) {
  // Get from Redis/KV
  return await env.CACHE.get(key, { type: 'arrayBuffer' });
}

async function cacheAudio(key, data, ttl, env) {
  // Store in Redis/KV
  await env.CACHE.put(key, data, { expirationTtl: ttl });
}

async function isRateLimited(userId, env) {
  // Check rate limit in Redis/KV
  const key = `rate:${userId}`;
  const count = await env.CACHE.get(key) || 0;
  
  if (count >= RATE_LIMIT_REQUESTS) {
    return true;
  }
  
  await env.CACHE.put(key, count + 1, { expirationTtl: RATE_LIMIT_WINDOW });
  return false;
}

function trackTTSEvent(env, data) {
  // Send to analytics (Cloudflare Analytics, custom tracking)
  console.log('TTS Event:', JSON.stringify(data));
}

function getCloudflareModel(engine) {
  const models = {
    'aura-2-en': '@cf/deepgram/aura-2-en',
    'aura-2-es': '@cf/deepgram/aura-2-es',
    'aura-1': '@cf/deepgram/aura-1',
    'melotts': '@cf/myshell-ai/melotts'
  };
  return models[engine] || models['aura-2-en'];
}

export async function onRequestPost(context) {
  return await routeTTSRequest(context.request, context.env, context);
}
```

#### 4.2.2 Self-hosted TTS Microservice API

**Expected API Contract:**

```
POST /speak
Content-Type: application/json

Request Body:
{
  "text": "Hello, this is a test.",
  "model": "kokoro" | "chatterbox" | "f5-tts" | "dia",
  "voice": "default" | "custom-voice-id",
  "language": "en" | "es" | "auto",
  "speed": 1.0,
  "pitch": 1.0
}

Response:
Status: 200 OK
Content-Type: audio/mp3
X-TTS-Engine: kokoro
X-TTS-Latency: 145
X-TTS-Model-Version: v1.0.2

Body: <audio binary data>
```

**Health Check:**
```
GET /health

Response:
{
  "status": "healthy",
  "models": ["kokoro", "chatterbox"],
  "gpu_available": true,
  "gpu_memory_used": "4.2 GB",
  "gpu_memory_total": "6 GB",
  "queue_length": 3,
  "avg_latency_ms": 187
}
```

#### 4.2.3 Security Considerations

**Authentication & Authorization:**
- API keys for self-hosted TTS service
- JWT tokens for user authentication
- IP whitelisting (Cloudflare Function → Self-hosted TTS)

**CORS & CSP:**
```nginx
# Nginx configuration for TTS microservice
add_header 'Access-Control-Allow-Origin' 'https://pmerit.com' always;
add_header 'Access-Control-Allow-Methods' 'POST, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
add_header 'X-Content-Type-Options' 'nosniff' always;
add_header 'X-Frame-Options' 'DENY' always;

# Rate limiting at Nginx level
limit_req_zone $binary_remote_addr zone=tts_limit:10m rate=10r/s;
limit_req zone=tts_limit burst=20 nodelay;
```

**CSP Headers (Frontend):**
```
Content-Security-Policy:
  default-src 'self';
  connect-src 'self' https://*.pmerit.com https://tts.pmerit.internal;
  media-src 'self' blob: https://*.pmerit.com https://tts.pmerit.internal;
  script-src 'self' 'unsafe-inline' https://cdn.cloudflare.com;
```

---

## 5. Cost Analysis

### 5.1 Infrastructure Costs

#### Option 1: Single GPU Server (Kokoro — Lightweight)

**Server Specifications:**
- **GPU:** NVIDIA RTX 2060 (6GB VRAM)
- **CPU:** 4 cores
- **RAM:** 32GB
- **Storage:** 100GB SSD
- **Bandwidth:** 20TB/month

**Provider Options:**
| Provider | Monthly Cost | Notes |
|----------|-------------|-------|
| Hetzner (Germany) | €99 (~$107) | Best value, dedicated GPU |
| DatabaseMart | $99–$149 | GPU-optimized VPS |
| OVH (France) | €129 (~$139) | Bare metal with GPU |
| DigitalOcean GPU Droplet | $216/month | Cloud VPS with GPU |

**Estimated Cost:** **$99–$149/month**

**Capacity:**
- Concurrent requests: 10–20 (with Kokoro)
- Requests/minute: 100–150
- Daily requests: ~144,000 (at 1 req/min average)
- Characters/day: ~1.4M (at 100 chars/request average)

---

#### Option 2: Dual GPU Server (Kokoro + Chatterbox)

**Server Specifications:**
- **GPU:** NVIDIA RTX 3060 Ti (8GB VRAM)
- **CPU:** 6 cores
- **RAM:** 64GB
- **Storage:** 250GB SSD
- **Bandwidth:** 30TB/month

**Provider Options:**
| Provider | Monthly Cost | Notes |
|----------|-------------|-------|
| Hetzner (Germany) | €149 (~$161) | Best value |
| DatabaseMart | $179–$199 | GPU-optimized VPS |
| OVH (France) | €199 (~$214) | Bare metal with GPU |

**Estimated Cost:** **$161–$199/month**

**Capacity:**
- Concurrent requests: 20–30
- Requests/minute: 200–250
- Daily requests: ~288,000
- Characters/day: ~2.8M

---

#### Option 3: Kubernetes Cluster (Multi-GPU)

**Cluster Specifications:**
- **3x GPU Nodes** (NVIDIA RTX 3060 Ti each)
- **Load Balancer**
- **Redis Cluster** (3 replicas)
- **Monitoring** (Prometheus + Grafana)

**Estimated Monthly Cost:**
- 3x GPU Nodes: $450–$600
- Load Balancer: $20–$40
- Redis Cluster: $30–$50
- Monitoring: $20–$30
- **Total: $520–$720/month**

**Capacity:**
- Concurrent requests: 60–90
- Requests/minute: 600–750
- Daily requests: ~864,000
- Characters/day: ~8.6M

---

### 5.2 Cost Comparison

#### Scenario 1: Low Usage (10,000 characters/day)

| Solution | Monthly Cost | Notes |
|----------|-------------|-------|
| Cloudflare Workers AI | **$0** | Within free tier |
| Self-hosted (Kokoro) | **$99–$149** | Not cost-effective |

**Winner:** Cloudflare Workers AI

---

#### Scenario 2: Medium Usage (100,000 characters/day)

| Solution | Monthly Cost | Notes |
|----------|-------------|-------|
| Cloudflare Workers AI | **~$45** | $0.015 per 1K chars |
| Self-hosted (Kokoro) | **$99–$149** | Fixed cost |

**Break-even Point:** ~67,000 characters/day  
**Winner (at 100K):** Cloudflare Workers AI (still cheaper)

---

#### Scenario 3: High Usage (500,000 characters/day)

| Solution | Monthly Cost | Notes |
|----------|-------------|-------|
| Cloudflare Workers AI | **~$225** | $0.015 per 1K chars |
| Self-hosted (Kokoro) | **$99–$149** | Fixed cost |
| Self-hosted (Chatterbox) | **$161–$199** | Higher quality |

**Winner:** Self-hosted (Kokoro or Chatterbox)

---

#### Scenario 4: Very High Usage (2,000,000 characters/day)

| Solution | Monthly Cost | Notes |
|----------|-------------|-------|
| Cloudflare Workers AI | **~$900** | $0.015 per 1K chars |
| Self-hosted (Kokoro) | **$99–$149** | May need load balancing |
| Self-hosted (Chatterbox) | **$161–$199** | May need load balancing |
| Kubernetes Cluster | **$520–$720** | High availability |

**Winner:** Self-hosted (single or clustered)

---

### 5.3 Break-even Analysis

**Formula:**
```
Break-even point = Self-hosted cost / Cloudflare per-character cost
                 = $99 / $0.015 per 1K chars
                 = 6,600K characters/month
                 = ~220,000 characters/day
```

**Conclusion:**
- **Below 200K chars/day:** Cloudflare Workers AI is more cost-effective
- **Above 200K chars/day:** Self-hosted TTS becomes cost-effective
- **Above 500K chars/day:** Self-hosted offers significant savings (40–60%)

### 5.4 Total Cost of Ownership (TCO)

**Self-hosted Additional Costs:**
- **Maintenance:** 4–8 hours/month × $50/hour = $200–$400/month (if outsourced)
- **Monitoring:** $20–$50/month (tools, alerting)
- **Backups:** $10–$30/month (model storage, configs)
- **SSL Certificates:** $0–$20/month (Let's Encrypt is free)
- **Logging:** $20–$50/month (centralized logging)

**Total Monthly TCO (Self-hosted):**
- **Server:** $99–$199
- **Operational:** $250–$550
- **Total: $349–$749/month**

**Realistic Break-even (including ops):**
- ~350,000–500,000 characters/day (depends on operational efficiency)

---

## 6. Migration Strategy

### 6.1 Phased Approach

#### Phase 1: Research & Prototyping (Weeks 1–2)

**Goals:**
- Set up development environment
- Deploy Kokoro and Chatterbox in Docker
- Benchmark performance (CPU vs GPU)
- Evaluate audio quality (blind A/B tests)

**Deliverables:**
- Docker Compose files for both models
- Benchmark report (latency, throughput, quality)
- Cost projections based on actual performance

**Success Criteria:**
- Models running successfully in Docker
- Latency <300ms for 95th percentile
- Audio quality rated ≥4/5 by test panel

---

#### Phase 2: Integration (Weeks 3–4)

**Goals:**
- Deploy self-hosted TTS to staging server
- Update `/functions/tts/speak.js` with routing logic
- Implement caching layer (Redis)
- Add monitoring and alerting

**Deliverables:**
- Self-hosted TTS microservice running on staging
- Updated Cloudflare Function with routing
- Redis caching configured
- Monitoring dashboard (Grafana)

**Success Criteria:**
- Staging TTS service accessible via API
- Cache hit rate >50% for repeated phrases
- Monitoring shows <1% error rate

---

#### Phase 3: Parallel Deployment (Weeks 5–6)

**Goals:**
- Deploy to production in shadow mode
- Route 10% of traffic to self-hosted TTS
- Monitor performance, errors, and costs
- Gather user feedback (quality perception)

**Deliverables:**
- Production deployment (self-hosted + Cloudflare)
- Traffic routing (10% self-hosted, 90% Cloudflare)
- Analytics dashboard showing comparative metrics

**Success Criteria:**
- Self-hosted TTS handles 10% traffic without issues
- Latency comparable to Cloudflare (<20% difference)
- No increase in error rate
- User satisfaction maintained

---

#### Phase 4: Gradual Traffic Shift (Weeks 7–10)

**Goals:**
- Incrementally increase self-hosted traffic
- Week 7: 25%
- Week 8: 50%
- Week 9: 75%
- Week 10: 100%
- Monitor closely and roll back if issues arise

**Deliverables:**
- Progressive traffic shift logs
- Incident reports (if any)
- Cost savings metrics

**Success Criteria:**
- No major incidents during traffic shift
- Cost savings realized (if usage is high enough)
- User experience maintained or improved

---

#### Phase 5: Decommission Cloudflare Fallback (Week 11+)

**Goals:**
- Keep Cloudflare as failover only (not primary)
- Optimize self-hosted infrastructure
- Implement auto-scaling if needed
- Document operations and runbooks

**Deliverables:**
- Cloudflare TTS used only for failover
- Operational runbooks for team
- Optimized infrastructure (cost and performance)

**Success Criteria:**
- Cloudflare usage <5% of total requests
- Self-hosted infrastructure stable (>99.5% uptime)
- Team confident in operating self-hosted solution

---

### 6.2 Rollback Plan

**Trigger Conditions:**
- Latency increases >50% compared to Cloudflare
- Error rate exceeds 2%
- User complaints about audio quality increase
- Infrastructure costs exceed projections by >30%

**Rollback Steps:**
1. Adjust traffic routing to 100% Cloudflare (immediate)
2. Investigate root cause (1–2 days)
3. Fix issues or re-evaluate model/infrastructure choice
4. Resume gradual traffic shift once fixed

**Communication:**
- Notify stakeholders of rollback within 1 hour
- Daily status updates during investigation
- Post-mortem report after resolution

---

### 6.3 Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| GPU server downtime | Medium | High | Keep Cloudflare as failover; set up monitoring |
| Model quality degradation | Low | High | Regular blind A/B testing; user feedback |
| Higher than expected costs | Medium | Medium | Start with single server; scale only if needed |
| Team lacks GPU/ML ops skills | Medium | Medium | Training; hire contractor for initial setup |
| Latency increases | Medium | High | Optimize Docker; use caching aggressively |
| Security vulnerabilities | Low | Critical | Regular security audits; keep dependencies updated |

---

## 7. Risk Assessment

### 7.1 Technical Risks

**1. Model Performance Degradation**
- **Risk:** Self-hosted models produce lower quality audio than Cloudflare
- **Likelihood:** Low (models tested in benchmarks)
- **Impact:** High (user experience)
- **Mitigation:** Thorough quality testing in Phase 1; maintain Cloudflare fallback

**2. Infrastructure Reliability**
- **Risk:** GPU server crashes, hardware failures
- **Likelihood:** Medium (single point of failure)
- **Impact:** High (service unavailable)
- **Mitigation:** Multi-region deployment (future); Cloudflare fallback; monitoring

**3. Scaling Challenges**
- **Risk:** Unexpected traffic spikes overwhelm self-hosted infrastructure
- **Likelihood:** Medium
- **Impact:** High (slow responses, errors)
- **Mitigation:** Rate limiting; auto-scaling (K8s); Cloudflare overflow

**4. Latency Variability**
- **Risk:** Self-hosted TTS has inconsistent latency
- **Likelihood:** Medium (depends on GPU load)
- **Impact:** Medium (user experience)
- **Mitigation:** Request queuing; load balancing; caching

---

### 7.2 Operational Risks

**1. Lack of GPU/ML Expertise**
- **Risk:** Team struggles to maintain and troubleshoot GPU infrastructure
- **Likelihood:** Medium
- **Impact:** Medium (operational issues)
- **Mitigation:** Training; hire contractor for initial setup; comprehensive docs

**2. Ongoing Maintenance Burden**
- **Risk:** Self-hosted solution requires significant time investment
- **Likelihood:** High
- **Impact:** Medium (opportunity cost)
- **Mitigation:** Automate ops (Docker, K8s); monitoring; runbooks

**3. Model Updates & Licensing**
- **Risk:** Model updates break compatibility; licensing issues emerge
- **Likelihood:** Low
- **Impact:** Medium (legal, technical)
- **Mitigation:** Version pinning; regular license reviews; test updates in staging

---

### 7.3 Financial Risks

**1. Costs Exceed Projections**
- **Risk:** Infrastructure or operational costs higher than estimated
- **Likelihood:** Medium
- **Impact:** Medium (budget overrun)
- **Mitigation:** Start with single server; monitor costs closely; rollback if needed

**2. Usage Below Break-even Point**
- **Risk:** Usage remains low, self-hosted not cost-effective
- **Likelihood:** Medium (depends on platform growth)
- **Impact:** Low (can revert to Cloudflare)
- **Mitigation:** Analyze usage trends before full migration; keep Cloudflare option

**3. Hidden Costs**
- **Risk:** Bandwidth overages, support costs, etc.
- **Likelihood:** Low
- **Impact:** Low
- **Mitigation:** Choose providers with flat-rate bandwidth; budget for contingencies

---

## 8. Recommendations

### 8.1 Immediate Next Steps (Week 1)

1. **Approve Budget:** Secure $200–$300 for 2-month prototyping phase
2. **Provision Server:** Rent GPU server from Hetzner or DatabaseMart
3. **Deploy Kokoro:** Set up Docker container with Kokoro model
4. **Benchmark:** Run performance and quality tests
5. **Decision Point:** Continue to Phase 2 if benchmarks meet criteria

### 8.2 Recommended Model Strategy

**Primary Model:** **Kokoro v1.0**
- Best cost-to-performance ratio
- Fast inference (<150ms)
- Low resource requirements
- Apache 2.0 license

**Secondary Model (Future):** **Chatterbox TTS**
- Premium quality for high-value content
- Emotion control for engaging experiences
- Voice cloning for personalization
- MIT license

**Fallback:** **Cloudflare Workers AI**
- Always available as overflow/failover
- No infrastructure management
- Leverage free tier for low-usage periods

### 8.3 Deployment Recommendation

**Start Simple:**
- Single GPU server (Hetzner €99/month)
- Docker Compose (no K8s overhead)
- Redis caching for frequently requested phrases
- Nginx for SSL termination and rate limiting

**Scale When Needed:**
- Add second server only if traffic requires (>50K requests/day)
- Consider K8s only for enterprise-scale (>1M requests/day)
- Keep architecture simple to reduce operational burden

### 8.4 Migration Timeline

**Conservative Estimate:** 10–12 weeks
- Weeks 1–2: Prototyping
- Weeks 3–4: Integration
- Weeks 5–6: Shadow deployment (10%)
- Weeks 7–10: Gradual traffic shift (25% → 100%)
- Week 11+: Optimization and stabilization

**Aggressive Estimate:** 6–8 weeks (if prototyping goes smoothly)

---

## 9. Next Steps

### 9.1 Stakeholder Review

**Schedule Meeting:**
- **Attendees:** PMERIT leadership, engineering team, finance
- **Agenda:**
  - Present findings and recommendations
  - Discuss budget allocation
  - Review risk assessment
  - Approve/modify migration timeline
- **Outcome:** Go/no-go decision for Phase 1

### 9.2 Follow-up Issue

**Create GitHub Issue:**
- **Title:** "Implement Self-hosted TTS Integration (Kokoro Model)"
- **Labels:** `phase-10`, `enhancement`, `infrastructure`, `devops`
- **Description:**
  - Summary of this plan
  - Link to approved model (Kokoro)
  - Deployment architecture
  - Migration timeline
  - Acceptance criteria

**Acceptance Criteria:**
- [ ] Self-hosted TTS microservice deployed to production
- [ ] Cloudflare Function updated with routing logic
- [ ] Redis caching implemented and tuned
- [ ] Monitoring and alerting configured
- [ ] Documentation updated (operations runbook)
- [ ] Traffic shifted to self-hosted (100% or agreed percentage)
- [ ] Cost savings realized (if applicable)

### 9.3 Documentation Updates

**Update Existing Docs:**
- `docs/TTS_INTEGRATION.md` → Add self-hosted section
- `docs/TTS_IMPLEMENTATION_SUMMARY.md` → Append migration notes
- `README.md` → Mention self-hosted TTS option

**Create New Docs:**
- `docs/self-hosted-tts-operations.md` → Runbook for team
- `docs/self-hosted-tts-troubleshooting.md` → Common issues and solutions

### 9.4 Monitoring & Metrics

**Key Metrics to Track:**
- **Latency:** P50, P95, P99 response times
- **Error Rate:** % of failed TTS requests
- **Cache Hit Rate:** % of requests served from cache
- **Cost:** Monthly infrastructure spend vs. projected
- **Quality:** User satisfaction scores (NPS for voice quality)
- **Uptime:** Self-hosted TTS availability (target: 99.5%+)

**Alerting:**
- Latency P95 >500ms for 5 minutes → Page on-call
- Error rate >2% for 5 minutes → Alert team
- GPU server down → Page on-call immediately
- Cache hit rate <30% → Investigate (config issue?)

---

## Appendices

### Appendix A: Glossary

- **TTS:** Text-to-Speech (synthesis of audio from text)
- **Neuron:** Cloudflare's unit of AI compute billing
- **VRAM:** Video RAM (GPU memory)
- **MOS:** Mean Opinion Score (1–5 scale for audio quality)
- **LRU:** Least Recently Used (cache eviction policy)
- **CSP:** Content Security Policy (web security)
- **HA:** High Availability

### Appendix B: References

1. Chatterbox TTS: https://github.com/resemble-ai/chatterbox
2. Kokoro TTS: https://huggingface.co/kokoro-v1
3. F5-TTS: https://github.com/SWivid/F5-TTS
4. Dia TTS: https://github.com/dia-tts
5. Cloudflare Workers AI Pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
6. TTS Model Comparisons: https://huggingface.co/spaces/Inferless/Open-Source-TTS-Gallery
7. Docker GPU Support: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/
8. Hetzner GPU Servers: https://www.hetzner.com/dedicated-rootserver/matrix-ax

### Appendix C: Contact Information

**For Questions/Feedback:**
- **GitHub Issue:** #2
- **Project Lead:** [Add contact]
- **DevOps Team:** [Add contact]
- **Finance/Budget:** [Add contact]

---

**Document Version:** 1.0  
**Last Updated:** November 1, 2024  
**Next Review:** After stakeholder meeting (TBD)
