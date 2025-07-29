#!/bin/bash
# =================================================================
# Start PMERIT Integrated Multi-Tier API
# =================================================================

echo "🚀 Starting PMERIT Integrated Multi-Tier API..."
cd ~/pmerit-ai-platform

# Kill any existing processes
pkill -f "python.*integrated_main.py" 2>/dev/null
pkill -f "uvicorn.*9011" 2>/dev/null
sleep 2

# Determine Python command
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
else
    echo "❌ No Python interpreter found"
    exit 1
fi

echo "Using Python: $PYTHON_CMD"

# Check dependencies
echo "🔍 Checking dependencies..."
$PYTHON_CMD -c "import fastapi, asyncpg, bcrypt, jwt; print('✅ All dependencies available')" 2>/dev/null || {
    echo "❌ Missing dependencies. Installing..."
    pip install fastapi uvicorn asyncpg bcrypt python-jose[cryptography] python-multipart
}

# Start API
echo "🌟 Starting integrated API on port 9011..."
echo "📚 API Documentation: http://localhost:9011/docs"
echo "🏥 Health Check: http://localhost:9011/health"
echo ""

$PYTHON_CMD api/integrated_main.py 9011
