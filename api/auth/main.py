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
