#!/bin/bash
# =============================================================================
# PMERIT TTS Server - RunPod Auto-Start Script
# =============================================================================
#
# PURPOSE: Automatically start the TTS server when RunPod pod boots
#
# USAGE:
#   Option 1: Set as Docker CMD in RunPod pod template
#   Option 2: Add to /root/.bashrc for automatic start on terminal connect
#   Option 3: Run manually: bash /workspace/start.sh
#
# CONFIGURATION:
#   - In RunPod pod settings, set "Docker Command" to:
#     bash -c "curl -sL https://raw.githubusercontent.com/peoplemerit/pmerit-ai-platform/main/scripts/runpod/start.sh | bash"
#
# @version 1.0.0
# @created December 18, 2025 - Session 61
# =============================================================================

set -e

echo "=============================================="
echo "PMERIT TTS Server - Auto-Start"
echo "=============================================="

WORKSPACE="/workspace"
TTS_SERVER="$WORKSPACE/tts_server.py"
TTS_LOG="$WORKSPACE/tts.log"
REPO_URL="https://raw.githubusercontent.com/peoplemerit/pmerit-ai-platform/main/scripts/runpod"

# Create workspace if needed
mkdir -p "$WORKSPACE"
mkdir -p "$WORKSPACE/models"

# Function to check if server is already running
is_server_running() {
    pgrep -f "tts_server.py" > /dev/null 2>&1
}

# Function to install dependencies
install_deps() {
    echo "[1/4] Installing Python dependencies..."
    pip install --quiet fastapi uvicorn piper-tts edge-tts 2>/dev/null || {
        echo "Installing dependencies (this may take a minute)..."
        pip install fastapi uvicorn piper-tts edge-tts
    }
    echo "      Dependencies installed."
}

# Function to download latest server code
download_server() {
    echo "[2/4] Downloading latest TTS server code..."
    curl -sL "$REPO_URL/tts_server.py" -o "$TTS_SERVER"
    chmod +x "$TTS_SERVER"
    echo "      Server code downloaded."
}

# Function to download Piper models if not present
download_models() {
    echo "[3/4] Checking Piper models..."

    LESSAC_MODEL="$WORKSPACE/models/en_US-lessac-medium.onnx"
    AMY_MODEL="$WORKSPACE/models/en_US-amy-medium.onnx"

    if [ ! -f "$LESSAC_MODEL" ]; then
        echo "      Downloading lessac-medium model..."
        cd "$WORKSPACE/models"
        wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx
        wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json
    fi

    if [ ! -f "$AMY_MODEL" ]; then
        echo "      Downloading amy-medium model..."
        cd "$WORKSPACE/models"
        wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx
        wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx.json
    fi

    echo "      Models ready."
}

# Function to install Piper binary if not present
install_piper() {
    PIPER_DIR="$WORKSPACE/piper"
    PIPER_BIN="$PIPER_DIR/piper/piper"

    if [ ! -f "$PIPER_BIN" ]; then
        echo "      Installing Piper binary..."
        mkdir -p "$PIPER_DIR"
        cd "$PIPER_DIR"
        wget -q https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_amd64.tar.gz
        tar -xzf piper_amd64.tar.gz
        rm piper_amd64.tar.gz
        chmod +x piper/piper
    fi
}

# Function to start the server
start_server() {
    echo "[4/4] Starting TTS server..."

    if is_server_running; then
        echo "      Server already running. Skipping start."
        return 0
    fi

    cd "$WORKSPACE"

    # Start in background with logging
    nohup python3 "$TTS_SERVER" > "$TTS_LOG" 2>&1 &

    # Wait for server to be ready
    echo "      Waiting for server to start..."
    sleep 3

    # Health check
    for i in {1..10}; do
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            echo "      Server started successfully!"
            echo ""
            echo "=============================================="
            echo "TTS Server is RUNNING"
            echo "=============================================="
            echo "Health:   http://localhost:8000/health"
            echo "API:      http://localhost:8000/api/tts"
            echo "Voices:   http://localhost:8000/api/voices"
            echo "Log:      $TTS_LOG"
            echo "=============================================="
            return 0
        fi
        sleep 1
    done

    echo "      WARNING: Server may not have started. Check logs:"
    echo "      tail -f $TTS_LOG"
    return 1
}

# Main execution
main() {
    install_deps
    download_server
    download_models
    install_piper
    start_server

    # Keep container running (for Docker CMD usage)
    if [ "${KEEP_ALIVE:-false}" = "true" ]; then
        echo ""
        echo "Keeping container alive. Press Ctrl+C to stop."
        tail -f "$TTS_LOG"
    fi
}

# Run main
main "$@"
