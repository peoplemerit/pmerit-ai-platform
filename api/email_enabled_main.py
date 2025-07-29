#!/usr/bin/env python3

import os
import sys
import asyncio
from pathlib import Path

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import asyncpg
import bcrypt
import jwt
from datetime import datetime, timedelta
import uuid
import logging
import uvicorn

# Import email service
from enhanced_email_service import get_email_service

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
DATABASE_CONFIG = {
    "host": "localhost",
    "port": 15432,
    "database": "gabriel_ai", 
    "user": "gabriel_user",
    "password": "gabriel_secure_2025"
}

JWT_SECRET = "pmerit_jwt_secret_2025_change_after_project"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION = timedelta(hours=24)

security = HTTPBearer(auto_error=False)
db_pool = None
email_service = None

app = FastAPI(
    title="PMERIT AI Email-Enabled API",
    description="Multi-tier portal with actual email sending",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class EmployeeInviteRequest(BaseModel):
    email: EmailStr
    role: str = "employee" 
    tier: int = 2

@app.on_event("startup")
async def startup_event():
    global db_pool, email_service
    try:
        db_pool = await asyncpg.create_pool(**DATABASE_CONFIG, min_size=1, max_size=10)
        email_provider = os.getenv('EMAIL_PROVIDER', 'sendgrid')
        email_service = get_email_service(email_provider)
        logger.info(f"✅ Startup complete - Email provider: {email_provider}")
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")

@app.on_event("shutdown") 
async def shutdown_event():
    if db_pool:
        await db_pool.close()

async def get_db():
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database not available")
    return db_pool

async def verify_token(credentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="No token provided")
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
async def root():
    return {
        "service": "PMERIT AI Email-Enabled API",
        "status": "operational",
        "version": "2.0.0",
        "email_provider": os.getenv('EMAIL_PROVIDER', 'not_configured'),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            result = await conn.fetchval("SELECT 1")
            
        email_provider = os.getenv('EMAIL_PROVIDER', 'not_configured')
        email_configured = False
        
        if email_provider == 'sendgrid':
            email_configured = bool(os.getenv('SENDGRID_API_KEY'))
        elif email_provider == 'gmail':
            email_configured = bool(os.getenv('GMAIL_EMAIL') and os.getenv('GMAIL_APP_PASSWORD'))
            
        return {
            "status": "healthy",
            "database": "connected",
            "email_provider": email_provider,
            "email_configured": email_configured,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.post("/api/auth/login")
async def login(login_data: LoginRequest):
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            user = await conn.fetchrow(
                "SELECT id, email, password_hash, role, tier, status FROM users WHERE email = $1",
                login_data.email
            )
            
            if not user or user['status'] != 'active':
                return {"success": False, "error": "Invalid credentials"}
            
            if not bcrypt.checkpw(login_data.password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                return {"success": False, "error": "Invalid credentials"}
            
            payload = {
                "user_id": user['id'],
                "email": user['email'],
                "role": user['role'],
                "tier": user['tier'],
                "exp": datetime.utcnow() + JWT_EXPIRATION
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
            
            return {
                "success": True,
                "access_token": token,
                "token_type": "bearer",
                "user_id": user['id'],
                "email": user['email'],
                "role": user['role'],
                "tier": user['tier']
            }
            
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/employees/invite")
async def invite_employee(invite_data: EmployeeInviteRequest, user_id: int = Depends(verify_token)):
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            requester = await conn.fetchrow(
                "SELECT email, role, tier FROM users WHERE id = $1", user_id
            )
            
            if not requester or requester['tier'] != 1:
                return {"success": False, "error": "Insufficient permissions"}
            
            existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1", invite_data.email)
            if existing:
                return {"success": False, "error": "User already exists"}
            
            invitation_token = str(uuid.uuid4())
            
            await conn.execute(
                """INSERT INTO employee_invitations 
                   (email, role, tier, invitation_token, invited_by, expires_at) 
                   VALUES ($1, $2, $3, $4, $5, $6)""",
                invite_data.email, invite_data.role, invite_data.tier,
                invitation_token, user_id, datetime.utcnow() + timedelta(hours=48)
            )
            
            # Send email
            email_result = await email_service.send_invitation_email(
                invite_data.email, invitation_token, requester['email']
            )
            
            return {
                "success": True,
                "message": "Employee invitation created with email",
                "data": {
                    "email": invite_data.email,
                    "email_sent": email_result.get('success', False),
                    "email_provider": email_result.get('provider', 'unknown'),
                    "email_file": email_result.get('email_file', ''),
                    "invitation_url": email_result.get('invitation_url', ''),
                    "error": email_result.get('error') if not email_result.get('success') else None
                }
            }
            
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 9011
    uvicorn.run(app, host="0.0.0.0", port=port)
