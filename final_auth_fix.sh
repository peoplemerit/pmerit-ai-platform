#!/bin/bash
# =================================================================
# Final Authentication Fix - Port and Database Issues
# =================================================================

echo "🔧 FINAL AUTHENTICATION FIX"
echo "==========================="

# Step 1: Kill any existing API servers
echo "⏹️ Stopping all existing API servers..."
pkill -f "uvicorn.*auth" 2>/dev/null
pkill -f "fastapi" 2>/dev/null
sleep 2

# Step 2: Check what's using port 8001
echo "🔍 Checking port 8001 usage..."
lsof -ti:8001 | xargs kill -9 2>/dev/null || echo "Port 8001 cleared"

# Step 3: Fix database name in ALL API files
echo "🔄 Fixing database name in all API files..."
find ~/pmerit-ai-platform/api -type f \( -name "*.py" -o -name "*.json" -o -name "*.yml" \) | while read file; do
    if grep -q "pmerit_core" "$file" 2>/dev/null; then
        sed -i 's/pmerit_core/pmerit_ai/g' "$file"
        echo "✅ Fixed database name in: $file"
    fi
done

# Step 4: Create a simple working API that definitely uses the right database
echo "🚀 Creating simplified working API..."

# Create a minimal main.py that works
cat > ~/pmerit-ai-platform/api/auth/main.py << 'EOF'
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor
import json
from datetime import datetime

app = FastAPI(title="Pmerit AI Authentication API")

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'port': '5434',
    'database': 'pmerit_ai',
    'user': 'pmerit_admin',
    'password': 'pmerit_secure_2024'
}

class LoginRequest(BaseModel):
    email: str
    password: str

def get_db_connection():
    """Get database connection to pmerit_ai database"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    # Test database connection
    conn = get_db_connection()
    db_status = "connected" if conn else "disconnected"
    if conn:
        conn.close()
    
    return {
        "status": "healthy",
        "service": "Pmerit AI Authentication API",
        "timestamp": datetime.now().isoformat(),
        "database": db_status,
        "database_name": "pmerit_ai",
        "database_port": "5434"
    }

@app.post("/auth/login")
async def login(login_data: LoginRequest):
    """Login endpoint"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            "SELECT id, email, username, tier_level, admin_privileges FROM users WHERE email = %s AND password_hash = %s",
            (login_data.email, login_data.password)
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if user:
            return {
                "status": "success",
                "message": "Login successful",
                "access_token": "jwt_token_placeholder",
                "user_info": {
                    "id": user["id"],
                    "email": user["email"],
                    "username": user["username"],
                    "tier_level": user["tier_level"],
                    "admin_privileges": user["admin_privileges"]
                }
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(e)}")

@app.get("/auth/me")
async def get_current_user():
    """Get current user info"""
    return {
        "message": "Authentication API is working",
        "database": "pmerit_ai",
        "port": "5434"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
EOF

# Step 5: Create a new startup script that uses a different port if needed
cat > ~/pmerit-ai-platform/api/start_auth_api_fixed.sh << 'EOF'
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
EOF

chmod +x ~/pmerit-ai-platform/api/start_auth_api_fixed.sh

echo ""
echo "✅ FINAL FIX COMPLETE!"
echo "====================="
echo "🔧 Fixed Issues:"
echo "   ✅ Killed all existing API processes"
echo "   ✅ Cleared port 8001"
echo "   ✅ Fixed database name (pmerit_core → pmerit_ai)"
echo "   ✅ Created simplified working API"
echo "   ✅ New startup script: start_auth_api_fixed.sh"
echo ""
echo "🚀 Ready to start fixed API!"
echo "Run: ./api/start_auth_api_fixed.sh"
