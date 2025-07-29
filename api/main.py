# =================================================================
# PMERIT AI Educational Platform - Multi-Tier API (Port Resolved)
# =================================================================

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import asyncpg
import bcrypt
import jwt
from datetime import datetime, timedelta
import uuid
import logging
import uvicorn
from contextlib import asynccontextmanager

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration using tracked credentials
DATABASE_CONFIG = {
    "host": "localhost",
    "port": 15432,
    "database": "gabriel_ai",
    "user": "gabriel_user",
    "password": "gabriel_secure_2025"
}

# JWT configuration (tracked for security rotation)
JWT_SECRET = "pmerit_jwt_secret_2025_change_after_project"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION = timedelta(hours=24)

# Security
security = HTTPBearer()

# Database connection pool
db_pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(**DATABASE_CONFIG, min_size=1, max_size=10)
        logger.info("✅ Database connection pool created")
        yield
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        yield
    finally:
        # Shutdown
        if db_pool:
            await db_pool.close()
            logger.info("🔒 Database connection pool closed")

# FastAPI app with lifespan
app = FastAPI(
    title="PMERIT AI Multi-Tier Portal API",
    description="Multi-tier authentication system for Nigerian and US underserved communities",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    role: str
    tier: int

class EmployeeInviteRequest(BaseModel):
    email: EmailStr
    role: str = "employee"
    tier: int = 2

class User(BaseModel):
    id: int
    email: str
    role: str
    tier: int
    status: str
    created_at: datetime

# Database helpers
async def get_db():
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database connection not available")
    return db_pool

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            result = await conn.fetchval("SELECT 1")
            return {
                "status": "healthy",
                "database": "connected" if result == 1 else "disconnected",
                "timestamp": datetime.utcnow().isoformat(),
                "service": "PMERIT Multi-Tier API"
            }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@app.post("/api/auth/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """Authenticate user and return JWT token"""
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            # Get user from database
            user = await conn.fetchrow(
                "SELECT id, email, password_hash, role, tier, status FROM users WHERE email = $1",
                login_data.email
            )
            
            if not user:
                logger.warning(f"Login attempt for non-existent user: {login_data.email}")
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            if user['status'] != 'active':
                raise HTTPException(status_code=401, detail="Account not active")
            
            # Verify password
            if not bcrypt.checkpw(login_data.password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                logger.warning(f"Invalid password for user: {login_data.email}")
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            # Create JWT token
            payload = {
                "user_id": user['id'],
                "email": user['email'],
                "role": user['role'],
                "tier": user['tier'],
                "exp": datetime.utcnow() + JWT_EXPIRATION
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
            
            # Log successful login
            await conn.execute(
                "INSERT INTO user_audit_log (user_id, action, details) VALUES ($1, $2, $3)",
                user['id'], "login", f"Successful login from API"
            )
            
            logger.info(f"✅ Successful login for user: {login_data.email}")
            
            return LoginResponse(
                access_token=token,
                token_type="bearer",
                user_id=user['id'],
                email=user['email'],
                role=user['role'],
                tier=user['tier']
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/employees/invite")
async def invite_employee(invite_data: EmployeeInviteRequest, user_id: int = Depends(verify_token)):
    """Invite new employee (Tier 1 Super Admin only)"""
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            # Check if requester is Tier 1 Super Admin
            requester = await conn.fetchrow(
                "SELECT role, tier FROM users WHERE id = $1", user_id
            )
            
            if not requester or requester['tier'] != 1:
                raise HTTPException(status_code=403, detail="Only Tier 1 Super Admin can invite employees")
            
            # Check if user already exists
            existing_user = await conn.fetchrow(
                "SELECT id FROM users WHERE email = $1", invite_data.email
            )
            
            if existing_user:
                raise HTTPException(status_code=400, detail="User already exists")
            
            # Create invitation token
            invitation_token = str(uuid.uuid4())
            
            # Store invitation
            await conn.execute(
                """INSERT INTO employee_invitations 
                   (email, role, tier, invitation_token, invited_by, expires_at) 
                   VALUES ($1, $2, $3, $4, $5, $6)""",
                invite_data.email, invite_data.role, invite_data.tier,
                invitation_token, user_id, datetime.utcnow() + timedelta(hours=48)
            )
            
            # Log invitation
            await conn.execute(
                "INSERT INTO user_audit_log (user_id, action, details) VALUES ($1, $2, $3)",
                user_id, "invite_employee", f"Invited {invite_data.email} as {invite_data.role}"
            )
            
            logger.info(f"✅ Employee invitation created for: {invite_data.email}")
            
            return {
                "message": "Employee invitation created successfully",
                "email": invite_data.email,
                "invitation_token": invitation_token,
                "expires_in_hours": 48
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Employee invitation error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/employees", response_model=List[User])
async def list_employees(user_id: int = Depends(verify_token)):
    """List all employees (Tier 1 Super Admin only)"""
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            # Check if requester is Tier 1 Super Admin
            requester = await conn.fetchrow(
                "SELECT role, tier FROM users WHERE id = $1", user_id
            )
            
            if not requester or requester['tier'] != 1:
                raise HTTPException(status_code=403, detail="Only Tier 1 Super Admin can list employees")
            
            # Get all users
            users = await conn.fetch(
                "SELECT id, email, role, tier, status, created_at FROM users ORDER BY created_at DESC"
            )
            
            return [
                User(
                    id=user['id'],
                    email=user['email'],
                    role=user['role'],
                    tier=user['tier'],
                    status=user['status'],
                    created_at=user['created_at']
                )
                for user in users
            ]
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"List employees error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/invitations")
async def list_invitations(user_id: int = Depends(verify_token)):
    """List pending invitations (Tier 1 Super Admin only)"""
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            # Check if requester is Tier 1 Super Admin
            requester = await conn.fetchrow(
                "SELECT role, tier FROM users WHERE id = $1", user_id
            )
            
            if not requester or requester['tier'] != 1:
                raise HTTPException(status_code=403, detail="Only Tier 1 Super Admin can list invitations")
            
            # Get pending invitations
            invitations = await conn.fetch(
                """SELECT email, role, tier, invitation_token, created_at, expires_at, status
                   FROM employee_invitations 
                   WHERE status = 'pending' AND expires_at > NOW()
                   ORDER BY created_at DESC"""
            )
            
            return [
                {
                    "email": inv['email'],
                    "role": inv['role'],
                    "tier": inv['tier'],
                    "created_at": inv['created_at'].isoformat(),
                    "expires_at": inv['expires_at'].isoformat(),
                    "status": inv['status']
                }
                for inv in invitations
            ]
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"List invitations error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 9011
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
