#!/bin/bash

echo "🚀 Starting PMERIT Email-Enabled API..."
cd ~/pmerit-ai-platform

# Stop existing processes
pkill -f "python.*main.py" 2>/dev/null
sleep 2

# Load environment
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment loaded"
fi

# Start API
echo "🌟 Starting on port 9011..."
python3 api/email_enabled_main.py 9011
