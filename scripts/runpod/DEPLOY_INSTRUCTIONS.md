# RunPod TTS Server Deployment Instructions

## Session 54: Voice Expansion

**Pod ID:** `xfdsuii2ig7rsl`
**Pod Name:** `pmerit-tts-v2`
**Proxy URL:** `https://xfdsuii2ig7rsl-8000.proxy.runpod.net`

---

## Quick Deploy Steps

### Step 1: Connect to RunPod

1. Go to https://runpod.io/console/pods
2. Click "Connect" on `pmerit-tts-v2`
3. Select "Web Terminal" or use SSH

### Step 2: Install Edge TTS

```bash
pip install edge-tts
```

### Step 3: Upload New Server Code

Option A - Copy/Paste the code from `tts_server.py`:

```bash
cat > /workspace/tts_server.py << 'EOF'
# [PASTE CONTENTS OF tts_server.py HERE]
EOF
```

Option B - Use SCP (if you have SSH access):

```bash
scp tts_server.py root@<pod-ip>:/workspace/tts_server.py
```

### Step 4: Start the Server

```bash
cd /workspace
python3 tts_server.py
```

### Step 5: Test the Server

```bash
# Health check
curl https://xfdsuii2ig7rsl-8000.proxy.runpod.net/health

# Test Edge TTS (male)
curl -X POST https://xfdsuii2ig7rsl-8000.proxy.runpod.net/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, I am the standard male voice.","voice":"standard-male"}' \
  --output test-male.mp3

# Test Edge TTS (female)
curl -X POST https://xfdsuii2ig7rsl-8000.proxy.runpod.net/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, I am the standard female voice.","voice":"standard-female"}' \
  --output test-female.mp3

# Test Edge TTS (young)
curl -X POST https://xfdsuii2ig7rsl-8000.proxy.runpod.net/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hi! I am the young voice, perfect for kids!","voice":"standard-young"}' \
  --output test-young.mp3

# Test Piper TTS (primo)
curl -X POST https://xfdsuii2ig7rsl-8000.proxy.runpod.net/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, I am the Primo voice with natural speech.","voice":"primo"}' \
  --output test-primo.wav
```

---

## Voice Configuration

| Voice ID | Engine | Edge/Piper Voice | Tier |
|----------|--------|------------------|------|
| `standard-male` | Edge TTS | en-US-GuyNeural | FREE |
| `standard-female` | Edge TTS | en-US-JennyNeural | FREE |
| `standard-young` | Edge TTS | en-US-AnaNeural | FREE |
| `primo` | Piper TTS | en_US-lessac-medium | PREMIUM |
| `primo-female` | Piper TTS | en_US-amy-medium | PREMIUM |

---

## Download Additional Piper Models (Optional)

```bash
# Amy (female) model
cd /workspace/models
wget https://github.com/rhasspy/piper/releases/download/v1.2.0/voice-en_US-amy-medium.tar.gz
tar -xzf voice-en_US-amy-medium.tar.gz
mv en_US-amy-medium.onnx en_US-amy-medium.onnx
```

---

## Keep Server Running (Background)

```bash
nohup python3 /workspace/tts_server.py > /workspace/tts.log 2>&1 &
```

---

## Troubleshooting

### 502 Error
Server not running. Start it:
```bash
cd /workspace && python3 tts_server.py
```

### Edge TTS not working
Install the package:
```bash
pip install edge-tts
```

### Piper models not found
Check paths:
```bash
ls -la /workspace/models/
ls -la /workspace/piper/
```

---

*Last Updated: December 14, 2025 - Session 54*
