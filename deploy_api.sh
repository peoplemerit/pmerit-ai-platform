#!/bin/bash
# =================================================================
# Deploy PMERIT API with Correct Tracked Credentials
# Using: gabriel_user / gabriel_secure_2025 / gabriel_ai database
# =================================================================

echo "🚀 DEPLOYING PMERIT API WITH TRACKED CREDENTIALS"
echo "================================================"

cd ~/pmerit-ai-platform

# Create API directory
mkdir -p api

# Create the API with correct credentials
cat > api/main.py << 'API_EOF'
# =================================================================
# PMERIT AI Educational Platform - Multi-Tier Backend API
# Using tracked credentials: gabriel_user / gabriel_secure_2025
# =================================================================

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
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
        raise HTTPException(status_code=500, detail="Database connection failed")

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

class UserCreate(UserBase):
    role: str = "employee"
    tier: int = 2

class UserResponse(UserBase):
    id: int
    role: str
    tier: int
    status: str
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        orm_mode = True

class InvitationCreate(BaseModel):
    email: EmailStr
    name: str
    department: Optional[str] = None
    role: str = "employee"
    tier: int = 2

class InvitationResponse(BaseModel):
    id: int
    email: str
    name: str
    department: Optional[str]
    expires_at: datetime
    created_at: datetime
    invited_by_name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class InviteAcceptance(BaseModel):
    token: str
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

# =================================================================
# AUTHENTICATION UTILITIES
# =================================================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

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

def generate_invitation_token() -> str:
    """Generate secure invitation token"""
    return secrets.token_urlsafe(32)

# =================================================================
# AUTHENTICATION MIDDLEWARE
# =================================================================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Query user from database
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cursor.execute(
        "SELECT * FROM users WHERE id = %s AND status = 'active'", 
        (user_id,)
    )
    user = cursor.fetchone()
    conn.close()
    
    if user is None:
        raise credentials_exception
    
    return dict(user)

async def require_super_admin(current_user = Depends(get_current_user)):
    """Require super admin privileges"""
    if current_user['role'] != 'super_admin' or current_user['tier'] != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin privileges required"
        )
    return current_user

# =================================================================
# EMAIL UTILITIES (Placeholder for Phase 2)
# =================================================================

async def send_invitation_email(email: str, name: str, token: str, invited_by: str):
    """Send invitation email (placeholder for Cloudflare Email integration)"""
    invitation_url = f"https://pmerit-ai-platform-portal.pages.dev/employee/invite/{token}"
    
    # Log email sending (will implement actual sending in Phase 2)
    logger.info(f"📧 Invitation email prepared for {email}")
    logger.info(f"🔗 Invitation URL: {invitation_url}")
    
    return True

# =================================================================
# FASTAPI APP INITIALIZATION
# =================================================================

app = FastAPI(
    title="PMERIT AI Multi-Tier Portal API",
    description="Backend API for employee management and multi-tier authentication",
    version="1.0.0"
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

# =================================================================
# API ENDPOINTS
# =================================================================

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    """Authenticate user and return tokens"""
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    # Query user from database
    cursor.execute("""
        SELECT id, email, name, password_hash, role, tier, status, department, country, created_at
        FROM users 
        WHERE email = %s AND status = 'active'
    """, (login_data.email,))
    
    user = cursor.fetchone()
    
    if not user or not verify_password(login_data.password, user['password_hash']):
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Update last login
    cursor.execute(
        "UPDATE users SET last_login = NOW(), login_count = login_count + 1 WHERE id = %s",
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

@app.post("/api/employees/invite", response_model=Dict[str, str])
async def invite_employee(
    invitation: InvitationCreate,
    current_user = Depends(require_super_admin)
):
    """Super admin invites new employee"""
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (invitation.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Check for pending invitation
    cursor.execute("""
        SELECT id FROM employee_invitations 
        WHERE email = %s AND used_at IS NULL AND expires_at > NOW()
    """, (invitation.email,))
    
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pending invitation already exists for this email"
        )
    
    # Generate invitation token
    token = generate_invitation_token()
    expires_at = datetime.utcnow() + timedelta(hours=48)
    
    # Create invitation record
    cursor.execute("""
        INSERT INTO employee_invitations 
        (email, name, token, role, tier, department, invited_by, expires_at, email_sent_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
        RETURNING id
    """, (invitation.email, invitation.name, token, invitation.role, 
          invitation.tier, invitation.department, current_user['id'], expires_at))
    
    invitation_id = cursor.fetchone()['id']
    
    # Log audit event
    cursor.execute("""
        INSERT INTO user_audit_log (user_id, action, details) VALUES (%s, %s, %s)
    """, (current_user['id'], 'employee_invited', f'{{"invited_email": "{invitation.email}", "invitation_id": {invitation_id}}}'))
    
    conn.close()
    
    # Send invitation email
    await send_invitation_email(
        invitation.email, 
        invitation.name, 
        token, 
        current_user['name']
    )
    
    return {
        "message": "Employee invitation sent successfully",
        "invitation_id": str(invitation_id),
        "expires_at": expires_at.isoformat()
    }

@app.get("/api/employees", response_model=List[UserResponse])
async def list_employees(current_user = Depends(require_super_admin)):
    """Super admin lists all employees"""
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cursor.execute("""
        SELECT id, email, name, role, tier, status, department, country, 
               created_at, last_login, last_activity
        FROM users 
        WHERE role = 'employee' AND tier = 2
        ORDER BY created_at DESC
    """)
    
    employees = cursor.fetchall()
    conn.close()
    
    return [
        UserResponse(
            id=emp['id'],
            email=emp['email'],
            name=emp['name'],
            role=emp['role'],
            tier=emp['tier'],
            status=emp['status'],
            department=emp['department'],
            country=emp['country'],
            created_at=emp['created_at'],
            last_login=emp['last_login']
        )
        for emp in employees
    ]

@app.get("/api/user/profile", response_model=UserResponse)
async def get_user_profile(current_user = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse(
        id=current_user['id'],
        email=current_user['email'],
        name=current_user['name'],
        role=current_user['role'],
        tier=current_user['tier'],
        status=current_user['status'],
        department=current_user.get('department'),
        country=current_user.get('country'),
        created_at=current_user.get('created_at', datetime.now()),
        last_login=current_user.get('last_login')
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        conn = get_db_connection()
        conn.close()
        db_status = "connected"
    except:
        db_status = "disconnected"
    
    return {
        "status": "healthy",
        "service": "PMERIT Multi-Tier Portal API",
        "version": "1.0.0",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }

# =================================================================
# Run the application
# =================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=9001,  # Integrates with your User Management container
        reload=True
    )
API_EOF

echo "✅ API created with tracked credentials"

# Create requirements file
cat > api/requirements.txt << 'REQ_EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
psycopg2-binary==2.9.9
pydantic[email]==2.5.0
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
REQ_EOF

echo "✅ Requirements file created"

# Install dependencies
echo "📦 Installing API dependencies..."
pip install -r api/requirements.txt

# Create systemd service for production (optional)
echo "🔧 Creating API service configuration..."
cat > api/pmerit-api.service << 'SERVICE_EOF'
[Unit]
Description=PMERIT AI Multi-Tier Portal API
After=network.target

[Service]
Type=simple
User=gabriel-ai
WorkingDirectory=/home/gabriel-ai/pmerit-ai-platform/api
Environment=PATH=/home/gabriel-ai/.local/bin
ExecStart=/usr/bin/python -m uvicorn main:app --host 0.0.0.0 --port 9001
Restart=always

[Install]
WantedBy=multi-user.target
SERVICE_EOF

echo "✅ Service configuration created"

# Test the API
echo "🧪 Testing API deployment..."
cd api
python -c "
import psycopg2
try:
    conn = psycopg2.connect(
        host='localhost',
        port=15432,
        database='gabriel_ai',
        user='gabriel_user',
        password='gabriel_secure_2025'
    )
    print('✅ Database connection successful')
    conn.close()
except Exception as e:
    print(f'❌ Database connection failed: {e}')
"

# Start the API
echo "🚀 Starting PMERIT API on port 9001..."
echo "⚠️  Credentials used and tracked:"
echo "   Database: gabriel_user / gabriel_secure_2025"
echo "   JWT Secret: pmerit_jwt_secret_2025_change_after_project"
echo ""
echo "🌐 API will be available at:"
echo "   Health Check: http://localhost:9001/health"
echo "   API Docs: http://localhost:9001/docs"
echo ""
echo "Press Ctrl+C to stop the API server"

# Run the API
python main.py
