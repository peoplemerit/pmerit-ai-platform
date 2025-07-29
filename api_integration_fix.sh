#!/bin/bash
# =================================================================
# PMERIT API Integration Fix - Resolve HTML/JSON Issues
# Connect to existing gabriel-users service properly
# =================================================================

echo "🔧 FIXING API INTEGRATION AND JSON RESPONSES"
echo "============================================="

# Step 1: Stop any existing processes on port 9011
echo "🛑 Step 1: Cleaning up existing processes..."
pkill -f "python.*9011" 2>/dev/null || echo "No existing process on 9011"
pkill -f "uvicorn.*9011" 2>/dev/null || echo "No uvicorn process on 9011"

# Step 2: Check gabriel-users service status
echo ""
echo "🔍 Step 2: Checking gabriel-users service..."
GABRIEL_USERS_STATUS=$(curl -s http://localhost:8001/health 2>/dev/null || echo "NOT_ACCESSIBLE")
echo "Gabriel-users service: $GABRIEL_USERS_STATUS"

# Step 3: Create integrated API that works with your existing infrastructure
echo ""
echo "🏗️ Step 3: Creating integrated API solution..."

cat > ~/pmerit-ai-platform/api/integrated_main.py << 'EOF'
#!/usr/bin/env python3
# =================================================================
# PMERIT AI Educational Platform - Integrated Multi-Tier API
# Works with existing gabriel-users service infrastructure
# =================================================================

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import asyncpg
import bcrypt
import jwt
from datetime import datetime, timedelta
import uuid
import logging
import uvicorn
import sys
import os
import json

# Enhanced logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Database configuration (using tracked credentials)
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
security = HTTPBearer(auto_error=False)

# Global database pool
db_pool = None

# FastAPI app with proper error handling
app = FastAPI(
    title="PMERIT AI Multi-Tier Portal API",
    description="Integrated multi-tier authentication for Nigerian and US underserved communities",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enhanced CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Global exception handler to ensure JSON responses
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    global db_pool
    try:
        logger.info("🚀 Starting PMERIT API...")
        db_pool = await asyncpg.create_pool(**DATABASE_CONFIG, min_size=1, max_size=10)
        logger.info("✅ Database connection pool created successfully")
        
        # Test database connection
        async with db_pool.acquire() as conn:
            result = await conn.fetchval("SELECT 1")
            logger.info(f"✅ Database connection test: {result}")
            
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        db_pool = None

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    global db_pool
    if db_pool:
        await db_pool.close()
        logger.info("🔒 Database connection pool closed")

# Pydantic models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    role: str
    tier: int
    message: str = "Login successful"

class EmployeeInviteRequest(BaseModel):
    email: EmailStr
    role: str = "employee"
    tier: int = 2

class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
    timestamp: str = datetime.utcnow().isoformat()

# Database helper
async def get_db():
    if not db_pool:
        raise HTTPException(
            status_code=500, 
            detail="Database connection not available"
        )
    return db_pool

# Authentication helper
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return JSONResponse(content={
        "service": "PMERIT AI Multi-Tier Portal API",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "login": "/api/auth/login",
            "employees": "/api/employees"
        }
    })

@app.get("/health")
async def health_check():
    """Enhanced health check with database verification"""
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            # Test database
            db_result = await conn.fetchval("SELECT 1")
            
            # Test user table
            user_count = await conn.fetchval("SELECT COUNT(*) FROM users")
            
            return JSONResponse(content={
                "status": "healthy",
                "service": "PMERIT Multi-Tier API",
                "database": "connected" if db_result == 1 else "disconnected",
                "user_count": user_count,
                "timestamp": datetime.utcnow().isoformat(),
                "port": os.environ.get("PORT", "9011"),
                "version": "1.0.0"
            })
            
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "service": "PMERIT Multi-Tier API",
                "database": "disconnected",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

@app.post("/api/test")
async def test_endpoint():
    """Simple test endpoint to verify JSON responses"""
    return JSONResponse(content={
        "success": True,
        "message": "Test endpoint working",
        "timestamp": datetime.utcnow().isoformat(),
        "api_status": "JSON responses working correctly"
    })

@app.post("/api/auth/login")
async def login(login_data: LoginRequest):
    """Enhanced login with proper JSON responses"""
    try:
        logger.info(f"🔐 Login attempt for: {login_data.email}")
        
        pool = await get_db()
        async with pool.acquire() as conn:
            # Get user from database
            user = await conn.fetchrow(
                "SELECT id, email, password_hash, role, tier, status FROM users WHERE email = $1",
                login_data.email
            )
            
            if not user:
                logger.warning(f"❌ User not found: {login_data.email}")
                return JSONResponse(
                    status_code=401,
                    content={
                        "success": False,
                        "error": "Invalid credentials",
                        "message": "User not found",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
            
            if user['status'] != 'active':
                logger.warning(f"❌ Inactive user: {login_data.email}")
                return JSONResponse(
                    status_code=401,
                    content={
                        "success": False,
                        "error": "Account not active",
                        "message": "User account is not active",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
            
            # Verify password
            if not bcrypt.checkpw(login_data.password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                logger.warning(f"❌ Invalid password for: {login_data.email}")
                return JSONResponse(
                    status_code=401,
                    content={
                        "success": False,
                        "error": "Invalid credentials",
                        "message": "Invalid password",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
            
            # Create JWT token
            payload = {
                "user_id": user['id'],
                "email": user['email'],
                "role": user['role'],
                "tier": user['tier'],
                "exp": datetime.utcnow() + JWT_EXPIRATION,
                "iat": datetime.utcnow()
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
            
            # Log successful login
            await conn.execute(
                "INSERT INTO user_audit_log (user_id, action, details) VALUES ($1, $2, $3)",
                user['id'], "login", f"Successful API login from integrated endpoint"
            )
            
            logger.info(f"✅ Successful login for: {login_data.email}")
            
            return JSONResponse(content={
                "success": True,
                "access_token": token,
                "token_type": "bearer",
                "user_id": user['id'],
                "email": user['email'],
                "role": user['role'],
                "tier": user['tier'],
                "message": "Login successful",
                "timestamp": datetime.utcnow().isoformat()
            })
            
    except Exception as e:
        logger.error(f"❌ Login error: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error",
                "message": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

@app.post("/api/employees/invite")
async def invite_employee(invite_data: EmployeeInviteRequest, user_id: int = Depends(verify_token)):
    """Invite new employee (Tier 1 Super Admin only)"""
    try:
        logger.info(f"📧 Employee invitation request from user {user_id}")
        
        pool = await get_db()
        async with pool.acquire() as conn:
            # Check if requester is Tier 1 Super Admin
            requester = await conn.fetchrow(
                "SELECT email, role, tier FROM users WHERE id = $1", user_id
            )
            
            if not requester or requester['tier'] != 1:
                return JSONResponse(
                    status_code=403,
                    content={
                        "success": False,
                        "error": "Insufficient permissions",
                        "message": "Only Tier 1 Super Admin can invite employees",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
            
            # Check if user already exists
            existing_user = await conn.fetchrow(
                "SELECT id FROM users WHERE email = $1", invite_data.email
            )
            
            if existing_user:
                return JSONResponse(
                    status_code=400,
                    content={
                        "success": False,
                        "error": "User already exists",
                        "message": f"User {invite_data.email} already exists in the system",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
            
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
            
            return JSONResponse(content={
                "success": True,
                "message": "Employee invitation created successfully",
                "data": {
                    "email": invite_data.email,
                    "role": invite_data.role,
                    "tier": invite_data.tier,
                    "invitation_token": invitation_token,
                    "expires_in_hours": 48,
                    "invited_by": requester['email']
                },
                "timestamp": datetime.utcnow().isoformat()
            })
            
    except Exception as e:
        logger.error(f"❌ Employee invitation error: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error",
                "message": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

@app.get("/api/employees")
async def list_employees(user_id: int = Depends(verify_token)):
    """List all employees (Tier 1 Super Admin only)"""
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            # Check permissions
            requester = await conn.fetchrow(
                "SELECT role, tier FROM users WHERE id = $1", user_id
            )
            
            if not requester or requester['tier'] != 1:
                return JSONResponse(
                    status_code=403,
                    content={
                        "success": False,
                        "error": "Insufficient permissions",
                        "message": "Only Tier 1 Super Admin can list employees",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
            
            # Get all users
            users = await conn.fetch(
                "SELECT id, email, role, tier, status, created_at FROM users ORDER BY created_at DESC"
            )
            
            user_list = [
                {
                    "id": user['id'],
                    "email": user['email'],
                    "role": user['role'],
                    "tier": user['tier'],
                    "status": user['status'],
                    "created_at": user['created_at'].isoformat()
                }
                for user in users
            ]
            
            return JSONResponse(content={
                "success": True,
                "message": f"Retrieved {len(user_list)} users",
                "data": {
                    "users": user_list,
                    "total_count": len(user_list)
                },
                "timestamp": datetime.utcnow().isoformat()
            })
            
    except Exception as e:
        logger.error(f"❌ List employees error: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error", 
                "message": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

if __name__ == "__main__":
    # Get port from command line or default to 9011
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 9011
    logger.info(f"🚀 Starting PMERIT API on port {port}")
    
    # Set environment variable for health check
    os.environ["PORT"] = str(port)
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port, 
        log_level="info",
        access_log=True
    )
EOF

# Step 4: Create enhanced startup script
echo ""
echo "🚀 Step 4: Creating enhanced startup script..."

cat > ~/pmerit-ai-platform/start_integrated_api.sh << 'EOF'
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
EOF

chmod +x ~/pmerit-ai-platform/start_integrated_api.sh

# Step 5: Create comprehensive test script
echo ""
echo "🧪 Step 5: Creating comprehensive test script..."

cat > ~/pmerit-ai-platform/test_integrated_api.sh << 'EOF'
#!/bin/bash
# =================================================================
# Test PMERIT Integrated Multi-Tier API
#================================================================= 

API_PORT=9011
API_BASE="http://localhost:$API_PORT"

echo "🧪 TESTING PMERIT INTEGRATED API"
echo "================================="
echo "API Base: $API_BASE"
echo ""

# Test 1: Root endpoint
echo "🏠 Test 1: Root Endpoint"
echo "------------------------"
curl -s "$API_BASE/" | python3 -m json.tool 2>/dev/null || echo "❌ Root endpoint failed"
echo ""

# Test 2: Health Check
echo "🏥 Test 2: Health Check"
echo "-----------------------"
HEALTH_RESPONSE=$(curl -s "$API_BASE/health")
echo "$HEALTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "❌ Health check failed"
echo ""

# Test 3: Test Endpoint (JSON verification)
echo "🧪 Test 3: JSON Test Endpoint"
echo "-----------------------------"
curl -s -X POST "$API_BASE/api/test" | python3 -m json.tool 2>/dev/null || echo "❌ Test endpoint failed"
echo ""

# Test 4: Login Test
echo "🔐 Test 4: Login Test"
echo "--------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@pmerit.com", "password": "SuperAdmin123!"}')

echo "Raw login response:"
echo "$LOGIN_RESPONSE"
echo ""

echo "Formatted login response:"
echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "❌ Login response not JSON"
echo ""

# Extract token if login successful
TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'access_token' in data:
        print(data['access_token'])
    else:
        print('')
except:
    print('')
" 2>/dev/null)

if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "✅ Login successful! Token extracted."
    echo "Token: ${TOKEN:0:50}..."
    echo ""
    
    # Test 5: Employee List (authenticated)
    echo "👥 Test 5: Employee List (Authenticated)"
    echo "---------------------------------------"
    curl -s -H "Authorization: Bearer $TOKEN" "$API_BASE/api/employees" | python3 -m json.tool 2>/dev/null
    echo ""
    
    # Test 6: Employee Invitation (authenticated)
    echo "📧 Test 6: Employee Invitation Test"
    echo "-----------------------------------"
    curl -s -X POST "$API_BASE/api/employees/invite" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"email": "employee@pmerit.com", "role": "employee", "tier": 2}' | python3 -m json.tool 2>/dev/null
    echo ""
    
else
    echo "❌ Login failed or no token received"
    echo "Cannot test authenticated endpoints"
    echo ""
fi

echo "🎯 API TESTING COMPLETE"
echo "========================"
echo "• API Base URL: $API_BASE"
echo "• Documentation: $API_BASE/docs"
echo "• Health Check: $API_BASE/health"
echo ""

# Check if API is still running
if curl -s "$API_BASE/health" > /dev/null 2>&1; then
    echo "✅ API is still running and responsive"
else
    echo "❌ API is not responding"
fi
EOF

chmod +x ~/pmerit-ai-platform/test_integrated_api.sh

echo ""
echo "🎉 API INTEGRATION FIX COMPLETE!"
echo "================================="
echo ""
echo "✅ Created integrated API with proper JSON responses"
echo "✅ Enhanced error handling and logging"
echo "✅ Database integration with tracked credentials"
echo "✅ Startup script with dependency checking"
echo "✅ Comprehensive test script"
echo ""
echo "🚀 NEXT STEPS:"
echo "1. Start API: ./start_integrated_api.sh"
echo "2. Test API: ./test_integrated_api.sh"
echo "3. View docs: http://localhost:9011/docs"
echo ""
echo "🔐 Security Credentials (tracked for rotation):"
echo "• Database: gabriel_user / gabriel_secure_2025"
echo "• Super Admin: admin@pmerit.com / SuperAdmin123!"
echo "• JWT Secret: pmerit_jwt_secret_2025_change_after_project"
echo ""
echo "📊 This API will provide proper JSON responses and integrate"
echo "    with your existing gabriel-users infrastructure!"
echo ""
echo "🌍 Ready to test Phase 1 completion!"
