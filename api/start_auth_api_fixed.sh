#!/bin/bash
echo "🚀 Starting FIXED Pmerit AI Authentication API..."
echo "=============================================="

cd ~/pmerit-ai-platform

# Kill any existing processes on port 8001
lsof -ti:8001 | xargs kill -9 2>/dev/null || echo "Port 8001 cleared"

# Activate virtual environment
source api/venv/bin/activate 2>/dev/null || echo "Virtual env not found, using system Python"

# Start the API server
echo "🚀 Starting API server on port 8001..."
cd api/auth
python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
