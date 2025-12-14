#!/usr/bin/env python3
"""
PMERIT TTS Server - RunPod Edition
Session 54: Voice Expansion with Edge TTS + Piper TTS

Features:
- Edge TTS (FREE): Microsoft neural voices - male, female, young
- Piper TTS (PREMIUM): Natural human voices via Piper ONNX models

Voices:
- standard-male   -> Edge TTS en-US-GuyNeural (FREE)
- standard-female -> Edge TTS en-US-JennyNeural (FREE)
- standard-young  -> Edge TTS en-US-AnaNeural (FREE)
- primo           -> Piper TTS lessac-medium (PREMIUM)
- primo-female    -> Piper TTS amy-medium (PREMIUM)

Usage:
  pip install fastapi uvicorn piper-tts edge-tts
  python tts_server.py

@version 2.0.0
@updated December 14, 2025
"""

import asyncio
import io
import logging
import os
import subprocess
import tempfile
import wave
from typing import Optional

import edge_tts
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===== CONFIGURATION =====

# Edge TTS voices (FREE tier)
EDGE_VOICES = {
    'standard-male': 'en-US-GuyNeural',
    'standard-female': 'en-US-JennyNeural',
    'standard-young': 'en-US-AnaNeural',
    # Legacy mappings
    'standard': 'en-US-GuyNeural',
    'alloy': 'en-US-GuyNeural',
}

# Piper TTS voices (PREMIUM tier)
PIPER_VOICES = {
    'primo': '/workspace/models/en_US-lessac-medium.onnx',
    'primo-female': '/workspace/models/en_US-amy-medium.onnx',
}

# Piper executable path
PIPER_PATH = '/workspace/piper/piper'

# ===== MODELS =====

class TTSRequest(BaseModel):
    text: str
    voice: str = 'standard-male'
    engine: Optional[str] = None  # 'edge-tts' or 'piper-tts' (auto-detected if not specified)
    edgeVoice: Optional[str] = None  # Direct Edge TTS voice name override
    speed: float = 1.0

# ===== APP SETUP =====

app = FastAPI(
    title="PMERIT TTS Server",
    description="Text-to-Speech with Edge TTS (free) and Piper TTS (premium)",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== EDGE TTS (FREE) =====

async def generate_edge_tts(text: str, voice_id: str, edge_voice_override: str = None) -> bytes:
    """
    Generate TTS using Microsoft Edge TTS (FREE)
    Returns MP3 audio bytes
    """
    # Get the Edge voice name
    if edge_voice_override:
        edge_voice = edge_voice_override
    else:
        edge_voice = EDGE_VOICES.get(voice_id, 'en-US-GuyNeural')

    logger.info(f"Edge TTS: voice_id={voice_id}, edge_voice={edge_voice}, text_length={len(text)}")

    try:
        communicate = edge_tts.Communicate(text, edge_voice)

        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]

        logger.info(f"Edge TTS success: {len(audio_data)} bytes")
        return audio_data

    except Exception as e:
        logger.error(f"Edge TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Edge TTS error: {str(e)}")

# ===== PIPER TTS (PREMIUM) =====

def generate_piper_tts(text: str, voice_id: str) -> bytes:
    """
    Generate TTS using Piper ONNX (PREMIUM)
    Returns WAV audio bytes
    """
    model_path = PIPER_VOICES.get(voice_id)

    if not model_path:
        raise HTTPException(status_code=400, detail=f"Unknown Piper voice: {voice_id}")

    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail=f"Piper model not found: {model_path}")

    if not os.path.exists(PIPER_PATH):
        raise HTTPException(status_code=500, detail=f"Piper executable not found: {PIPER_PATH}")

    logger.info(f"Piper TTS: voice_id={voice_id}, model={model_path}, text_length={len(text)}")

    try:
        # Create temp file for output
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
            tmp_path = tmp.name

        # Run Piper
        process = subprocess.run(
            [PIPER_PATH, '--model', model_path, '--output_file', tmp_path],
            input=text.encode('utf-8'),
            capture_output=True,
            timeout=60
        )

        if process.returncode != 0:
            error_msg = process.stderr.decode('utf-8', errors='replace')
            logger.error(f"Piper error: {error_msg}")
            raise HTTPException(status_code=500, detail=f"Piper TTS error: {error_msg}")

        # Read the output file
        with open(tmp_path, 'rb') as f:
            audio_data = f.read()

        # Clean up temp file
        os.unlink(tmp_path)

        logger.info(f"Piper TTS success: {len(audio_data)} bytes")
        return audio_data

    except subprocess.TimeoutExpired:
        logger.error("Piper TTS timeout")
        raise HTTPException(status_code=500, detail="Piper TTS timeout")
    except Exception as e:
        logger.error(f"Piper TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Piper TTS error: {str(e)}")

# ===== API ENDPOINTS =====

@app.get("/")
async def root():
    """Root endpoint with server info"""
    return {
        "service": "PMERIT TTS Server",
        "version": "2.0.0",
        "engines": {
            "edge-tts": {
                "status": "available",
                "tier": "free",
                "voices": list(EDGE_VOICES.keys())
            },
            "piper-tts": {
                "status": "available" if os.path.exists(PIPER_PATH) else "not_installed",
                "tier": "premium",
                "voices": list(PIPER_VOICES.keys())
            }
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    piper_available = os.path.exists(PIPER_PATH)

    return {
        "status": "healthy",
        "engines": {
            "edge_tts": True,
            "piper_tts": piper_available
        },
        "models": {
            voice_id: os.path.exists(path)
            for voice_id, path in PIPER_VOICES.items()
        }
    }

@app.post("/api/tts")
async def tts_endpoint(request: TTSRequest):
    """
    Main TTS endpoint

    Routes based on voice ID or engine parameter:
    - standard-* -> Edge TTS (free)
    - primo-*    -> Piper TTS (premium)
    """
    voice = request.voice or 'standard-male'
    text = request.text.strip()

    if not text:
        raise HTTPException(status_code=400, detail="Text is required")

    if len(text) > 5000:
        raise HTTPException(status_code=400, detail="Text too long (max 5000 characters)")

    logger.info(f"TTS request: voice={voice}, engine={request.engine}, text_length={len(text)}")

    # Determine engine based on voice ID or explicit engine parameter
    engine = request.engine

    if engine == 'edge-tts' or voice in EDGE_VOICES or voice.startswith('standard'):
        # FREE: Use Edge TTS
        audio_data = await generate_edge_tts(text, voice, request.edgeVoice)
        return Response(
            content=audio_data,
            media_type="audio/mpeg",
            headers={
                "X-TTS-Engine": "edge-tts",
                "X-Voice": voice,
                "X-Tier": "free"
            }
        )

    elif engine == 'piper-tts' or voice in PIPER_VOICES or voice.startswith('primo'):
        # PREMIUM: Use Piper TTS
        audio_data = generate_piper_tts(text, voice)
        return Response(
            content=audio_data,
            media_type="audio/wav",
            headers={
                "X-TTS-Engine": "piper-tts",
                "X-Voice": voice,
                "X-Tier": "premium"
            }
        )

    else:
        # Default to Edge TTS (standard-male)
        logger.warning(f"Unknown voice '{voice}', falling back to standard-male")
        audio_data = await generate_edge_tts(text, 'standard-male')
        return Response(
            content=audio_data,
            media_type="audio/mpeg",
            headers={
                "X-TTS-Engine": "edge-tts",
                "X-Voice": "standard-male",
                "X-Tier": "free"
            }
        )

@app.get("/api/voices")
async def list_voices():
    """List all available voices"""
    return {
        "free": [
            {
                "id": "standard-male",
                "name": "Standard Male",
                "engine": "edge-tts",
                "edgeVoice": "en-US-GuyNeural",
                "description": "Clear male voice"
            },
            {
                "id": "standard-female",
                "name": "Standard Female",
                "engine": "edge-tts",
                "edgeVoice": "en-US-JennyNeural",
                "description": "Clear female voice"
            },
            {
                "id": "standard-young",
                "name": "Young Voice",
                "engine": "edge-tts",
                "edgeVoice": "en-US-AnaNeural",
                "description": "Friendly young voice (great for kids)"
            }
        ],
        "premium": [
            {
                "id": "primo",
                "name": "Primo Voice",
                "engine": "piper-tts",
                "model": "en_US-lessac-medium",
                "description": "Natural human voice",
                "available": os.path.exists(PIPER_VOICES.get('primo', ''))
            },
            {
                "id": "primo-female",
                "name": "Primo Female",
                "engine": "piper-tts",
                "model": "en_US-amy-medium",
                "description": "Natural female voice",
                "available": os.path.exists(PIPER_VOICES.get('primo-female', ''))
            }
        ]
    }

# ===== MAIN =====

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))

    logger.info("=" * 60)
    logger.info("PMERIT TTS Server v2.0.0")
    logger.info("=" * 60)
    logger.info(f"Edge TTS voices: {list(EDGE_VOICES.keys())}")
    logger.info(f"Piper TTS voices: {list(PIPER_VOICES.keys())}")
    logger.info(f"Piper path: {PIPER_PATH} (exists: {os.path.exists(PIPER_PATH)})")
    logger.info(f"Starting server on port {port}...")
    logger.info("=" * 60)

    uvicorn.run(app, host="0.0.0.0", port=port)
