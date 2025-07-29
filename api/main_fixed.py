# =================================================================
# PMERIT AI Educational Platform - Fixed Multi-Tier Backend API
# Fixed version with proper JSON responses and error handling
# =================================================================

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import psycopg2
import psycopg2.extras
from pydantic import BaseModel, EmailStr, validator
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import secrets
import os
from typing import Optional, List, Dict, Any
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# =================================================================
# DATABASE CONFIGURATION - Using Tracked Credentials
# =================================================================

DB_CONFIG = {
    'host': 'localhost',
    'port': 15432,
    'database': 'gabriel_ai',
    'user': 'gabriel_user',
    'password': 'gabriel_secure_2025'  # ⚠️ TRACKED - Change after project
}

def get_db_connection():
    """Get database connection using tracked credentials"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        return conn
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# =================================================================
# SECURITY CONFIGURATION - Using Tracked Credentials
# =================================================================

# JWT Configuration - ⚠️ TRACKED - Change after project
SECRET_KEY = "pmerit_jwt_secret_2025_change_after_project"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# =================================================================
# PYDANTIC MODELS
# =================================================================

class UserBase(BaseModel):
    email: EmailStr
    name: str
    department: Optional[str] = None
    country: Optional[str] = "Nigeria"
    preferred_language: Optional[str] = "en"
    mobile_phone: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    tier: int
    status: str
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class InvitationCreate(BaseModel):
    email: EmailStr
    name: str
    department: Optional[str] = None
    role: str = "employee"
    tier: int = 2

# =================================================================
# UTILITY FUNCTIONS
# =================================================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Password verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# =================================================================
# FASTAPI APP INITIALIZATION
# =================================================================

app = FastAPI(
    title="PMERIT AI Multi-Tier Portal API",
    description="Backend API for employee management and multi-tier authentication",
    version="1.0.0",
    debug=True
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pmerit-ai-platform.pages.dev",
        "https://pmerit-ai-platform-portal.pages.dev",
        "http://localhost:3000",
        "http://localhost:9904"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "type": type(exc).__name__
        }
    )

# =================================================================
# API ENDPOINTS
# =================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
    
    return {
        "status": "healthy",
        "service": "PMERIT Multi-Tier Portal API",
        "version": "1.0.0",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "login": "/api/auth/login",
            "docs": "/docs",
            "health": "/health"
        }
    }

@app.post("/api/auth/login")
async def login(login_data: LoginRequest):
    """Authenticate user and return tokens"""
    
    try:
        logger.info(f"Login attempt for: {login_data.email}")
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        # Query user from database
        cursor.execute("""
            SELECT id, email, name, password_hash, role, tier, status, department, country, created_at
            FROM users 
            WHERE email = %s AND status = 'active'
        """, (login_data.email,))
        
        user = cursor.fetchone()
        logger.info(f"User found: {user is not None}")
        
        if not user:
            conn.close()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Verify password
        if not user['password_hash']:
            conn.close()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Password not set for user"
            )
        
        password_valid = verify_password(login_data.password, user['password_hash'])
        logger.info(f"Password valid: {password_valid}")
        
        if not password_valid:
            conn.close()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password"
            )
        
        # Update last login
        cursor.execute(
            "UPDATE users SET last_login = NOW(), login_count = COALESCE(login_count, 0) + 1 WHERE id = %s",
            (user['id'],)
        )
        
        # Log audit event
        cursor.execute(
            "INSERT INTO user_audit_log (user_id, action, details) VALUES (%s, %s, %s)",
            (user['id'], 'login', '{"ip_address": "127.0.0.1"}')
        )
        
        conn.close()
        
        # Create tokens
        access_token = create_access_token(data={"sub": user['id']})
        refresh_token = create_refresh_token(data={"sub": user['id']})
        
        user_response = UserResponse(
            id=user['id'],
            email=user['email'],
            name=user['name'],
            role=user['role'],
            tier=user['tier'],
            status=user['status'],
            department=user['department'],
            country=user['country'],
            created_at=user['created_at'],
            last_login=datetime.now()
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@app.get("/api/test")
async def test_endpoint():
    """Simple test endpoint"""
    return {
        "message": "API is working!",
        "timestamp": datetime.utcnow().isoformat(),
        "database_test": "checking..."
    }

# =================================================================
# Run the application
# =================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main_fixed:app", 
        host="0.0.0.0", 
        port=9001,
        reload=True,
        log_level="info"
    )
