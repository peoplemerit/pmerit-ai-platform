#!/bin/bash
# =================================================================
# Start PMERIT Multi-Tier API on Available Port
# =================================================================

echo "🚀 Starting PMERIT Multi-Tier API..."
cd ~/pmerit-ai-platform

# Check if python3 exists, fallback to python
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
else
    echo "❌ No Python interpreter found"
    exit 1
fi

echo "Using Python: $PYTHON_CMD"

# Start API on available port
echo "Starting API on port 9011..."
$PYTHON_CMD api/main.py 9011

