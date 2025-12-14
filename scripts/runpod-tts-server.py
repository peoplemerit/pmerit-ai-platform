"""
PMERIT Primo Voice TTS API
Powered by Piper TTS on RunPod GPU
Version: 1.0.0

To run on RunPod pod:
1. SSH into pod or use web terminal
2. cd /workspace
3. python3 this_file.py

Or run:
curl -s https://raw.githubusercontent.com/peoplemerit/pmerit-ai-platform/main/scripts/runpod-tts-server.py > /workspace/tts_server.py && python3 /workspace/tts_server.py
"""
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os
import time
import logging
import sys

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PMERIT Primo Voice API",
    description="Premium natural human voice TTS powered by Piper",
    version="1.0.0"
)

# CORS for Cloudflare Worker and PMERIT domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for initial testing
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

# Voice models configuration
MODELS_DIR = "/workspace/models"
PIPER_CMD = "piper"  # Assumes piper is in PATH after pip install

VOICES = {
    "primo": {
        "model": f"{MODELS_DIR}/en_US-lessac-medium.onnx",
        "name": "Lessac (Male)",
        "language": "en-US"
    }
}

class TTSRequest(BaseModel):
    text: str
    voice: str = "primo"
    speed: float = 1.0

class HealthResponse(BaseModel):
    status: str
    provider: str
    voices: list
    uptime: float
    version: str

start_time = time.time()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "PMERIT Primo Voice",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "provider": "piper-tts",
        "voices": list(VOICES.keys()),
        "uptime": round(time.time() - start_time, 2),
        "version": "1.0.0"
    }

@app.get("/voices")
async def list_voices():
    """List available premium voices"""
    return {
        "voices": [
            {"id": k, "name": v["name"], "language": v["language"]}
            for k, v in VOICES.items()
        ]
    }

@app.post("/api/tts")
async def generate_speech(request: TTSRequest):
    """Generate premium TTS audio using Piper"""

    logger.info(f"TTS request: voice={request.voice}, text_length={len(request.text)}")

    # Validate text
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text is required")

    if len(request.text) > 10000:
        raise HTTPException(status_code=400, detail="Text too long (max 10000 chars)")

    # Validate voice
    if request.voice not in VOICES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid voice '{request.voice}'. Available: {list(VOICES.keys())}"
        )

    voice_config = VOICES[request.voice]
    model_path = voice_config["model"]

    # Check model exists
    if not os.path.exists(model_path):
        logger.error(f"Model not found: {model_path}")
        raise HTTPException(status_code=500, detail=f"Voice model not available at {model_path}")

    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            # Calculate length_scale (inverse of speed for Piper)
            length_scale = 1.0 / max(0.5, min(2.0, request.speed))

            # Run Piper TTS
            cmd = [
                PIPER_CMD,
                "--model", model_path,
                "--output_file", tmp.name,
                "--length_scale", str(length_scale)
            ]

            logger.info(f"Running Piper: {' '.join(cmd)}")

            process = subprocess.run(
                cmd,
                input=request.text.encode('utf-8'),
                capture_output=True,
                timeout=120  # 2 minute timeout for long texts
            )

            if process.returncode != 0:
                error_msg = process.stderr.decode('utf-8', errors='ignore')
                logger.error(f"Piper error: {error_msg}")
                raise HTTPException(status_code=500, detail=f"TTS generation failed: {error_msg}")

            # Read generated audio
            with open(tmp.name, "rb") as f:
                audio_data = f.read()

            # Cleanup temp file
            os.unlink(tmp.name)

            logger.info(f"TTS success: {len(audio_data)} bytes")

            return Response(
                content=audio_data,
                media_type="audio/wav",
                headers={
                    "X-TTS-Provider": "piper-primo",
                    "X-Voice": request.voice,
                    "X-Voice-Name": voice_config["name"],
                    "X-Char-Count": str(len(request.text)),
                    "X-Premium": "true",
                    "Cache-Control": "public, max-age=31536000"
                }
            )

    except subprocess.TimeoutExpired:
        logger.error("TTS generation timed out")
        raise HTTPException(status_code=504, detail="TTS generation timed out")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"TTS error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def setup_models():
    """Download voice models if not present"""
    os.makedirs(MODELS_DIR, exist_ok=True)

    model_file = f"{MODELS_DIR}/en_US-lessac-medium.onnx"
    config_file = f"{MODELS_DIR}/en_US-lessac-medium.onnx.json"

    if not os.path.exists(model_file):
        logger.info("Downloading Piper voice model...")
        subprocess.run([
            "wget", "-q",
            "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx",
            "-O", model_file
        ], check=True)
        logger.info("Model downloaded.")

    if not os.path.exists(config_file):
        logger.info("Downloading Piper voice config...")
        subprocess.run([
            "wget", "-q",
            "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json",
            "-O", config_file
        ], check=True)
        logger.info("Config downloaded.")

if __name__ == "__main__":
    import uvicorn

    # Setup models on startup
    setup_models()

    logger.info("Starting PMERIT Primo Voice TTS Server...")
    logger.info("API docs at http://0.0.0.0:8000/docs")

    uvicorn.run(app, host="0.0.0.0", port=8000)
