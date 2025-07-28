#!/bin/bash
# Start Pmerit AI Authentication API

echo "🚀 Starting Pmerit AI Authentication API..."
echo "=========================================="

cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📦 Installing requirements..."
pip install -r requirements.txt

# Load environment variables
echo "🔧 Loading environment variables..."
source ../database/.env.db

# Start the API server
echo "🚀 Starting authentication API server on port 8001..."
export DATABASE_CORE_EXTERNAL_URL="postgresql://pmerit_admin:pmerit_secure_2024@localhost:5434/pmerit_core"
export REDIS_EXTERNAL_URL="redis://:pmerit_redis_2024@localhost:16379/0"

python auth/main.py
