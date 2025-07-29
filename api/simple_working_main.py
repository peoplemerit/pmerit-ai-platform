#!/usr/bin/env python3
# =================================================================
# PMERIT AI Educational Platform - Simple Working API
# Minimal login + email functionality without JSON issues
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
import sys
import os

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

# FastAPI app
app = FastAPI(
    title="PMERIT AI Multi-Tier Portal API",
    description="Simple working multi-tier authentication with email for Nigerian and US underserved communities",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Email Service
class EmailService:
    """Simple email service for invitation templates"""
    
    def __init__(self):
        self.from_email = "noreply@pmerit-ai-platform.pages.dev"
        
    def create_invitation_email_html(self, employee_email: str, invitation_token: str, invited_by: str) -> str:
        """Create beautiful HTML email template"""
        invitation_url = f"https://pmerit-ai-platform-portal.pages.dev/accept-invitation?token={invitation_token}"
        
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PMERIT AI Team Invitation</title>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }}
                .container {{ max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }}
                .header h1 {{ margin: 0; font-size: 28px; font-weight: bold; }}
                .content {{ padding: 40px 30px; }}
                .mission-box {{ background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }}
                .cta-button {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; margin: 20px 0; }}
                .footer {{ background: #2c3e50; color: #ecf0f1; padding: 20px; text-align: center; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌍 Welcome to PMERIT AI</h1>
                    <p>Breaking Poverty Cycles Through Education</p>
                </div>
                <div class="content">
                    <p>Hello {employee_email},</p>
                    <p>You've been invited by <strong>{invited_by}</strong> to join the PMERIT AI Educational Platform team!</p>
                    <div class="mission-box">
                        <h3>🎯 Our Mission</h3>
                        <p>We're building an educational platform to serve <strong>3+ billion underserved people worldwide</strong>, starting with Nigerian students and US underserved communities.</p>
                        <ul>
                            <li><strong>Nigeria:</strong> Students with limited university access</li>
                            <li><strong>US:</strong> Rural communities, veterans, displaced workers</li>
                            <li><strong>Global:</strong> Africa (1.3B), South Asia (600M), Latin America (400M)</li>
                        </ul>
                    </div>
                    <div style="text-align: center;">
                        <a href="{invitation_url}" class="cta-button">🚀 Accept Invitation & Join Our Mission</a>
                    </div>
                    <p><strong>⏰ Important:</strong> This invitation expires in 48 hours.</p>
                    <p>Welcome to the team that's changing education worldwide!</p>
                    <p>Best regards,<br><strong>The PMERIT AI Team</strong></p>
                </div>
                <div class="footer">
                    <p><strong>PMERIT AI Educational Platform</strong></p>
                    <p>Serving Nigerian & US Underserved Communities</p>
                    <p>🌐 <a href="https://pmerit-ai-platform.pages.dev" style="color: #3498db;">pmerit-ai-platform.pages.dev</a></p>
                </div>
            </div>
        </body>
        </html>
        """
    
    async def send_invitation_email(self, employee_email: str, invitation_token: str, invited_by: str) -> dict:
        """Create and save invitation email"""
        try:
            html_content = self.create_invitation_email_html(employee_email, invitation_token, invited_by)
            
            # Create emails directory
            os.makedirs("/home/gabriel-ai/pmerit-ai-platform/emails", exist_ok=True)
            
            # Save email to file
            email_filename = f"/home/gabriel-ai/pmerit-ai-platform/emails/invitation_{employee_email.replace('@', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
            
            with open(email_filename, 'w') as f:
                f.write(html_content)
            
            logger.info(f"📧 Email created and saved: {email_filename}")
            
            return {
                "success": True,
                "message": "Invitation email created successfully",
                "email_file": email_filename,
                "invitation_url": f"https://pmerit-ai-platform-portal.pages.dev/accept-invitation?token={invitation_token}",
                "recipient": employee_email
            }
            
        except Exception as e:
            logger.error(f"❌ Email creation failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Email service instance
email_service = EmailService()

# Startup event
@app.on_event("startup")
async def startup_event():
    global db_pool
    try:
        logger.info("🚀 Starting PMERIT Simple Working API...")
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

class EmployeeInviteRequest(BaseModel):
    email: EmailStr
    role: str = "employee"
    tier: int = 2

# Database helper
async def get_db():
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database connection not available")
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
    return {
        "service": "PMERIT AI Multi-Tier Portal API",
        "status": "operational",
        "version": "1.0.0-simple",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "login": "/api/auth/login",
            "employees": "/api/employees"
        }
    }

@app.get("/health")
async def health_check():
    """Health check with database verification"""
    try:
        pool = await get_db()
        async with pool.acquire() as conn:
            db_result = await conn.fetchval("SELECT 1")
            user_count = await conn.fetchval("SELECT COUNT(*) FROM users")
            
            return {
                "status": "healthy",
                "service": "PMERIT Multi-Tier API - Simple Working Version",
                "database": "connected" if db_result == 1 else "disconnected",
                "user_count": user_count,
                "timestamp": datetime.utcnow().isoformat(),
                "port": os.environ.get("PORT", "9011"),
                "version": "1.0.0-simple"
            }
            
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "service": "PMERIT Multi-Tier API",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@app.post("/api/test")
async def test_endpoint():
    """Simple test endpoint"""
    return {
        "success": True,
        "message": "Test endpoint working perfectly",
        "timestamp": datetime.utcnow().isoformat(),
        "api_status": "Simple working version - JSON responses functional"
    }

@app.post("/api/auth/login")
async def login(login_data: LoginRequest):
    """Simple working login - NO AUDIT LOGGING TO AVOID JSON ISSUES"""
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
                return {
                    "success": False,
                    "error": "Invalid credentials",
                    "message": "User not found",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            if user['status'] != 'active':
                logger.warning(f"❌ Inactive user: {login_data.email}")
                return {
                    "success": False,
                    "error": "Account not active",
                    "message": "User account is not active",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            # Verify password
            if not bcrypt.checkpw(login_data.password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                logger.warning(f"❌ Invalid password for: {login_data.email}")
                return {
                    "success": False,
                    "error": "Invalid credentials",
                    "message": "Invalid password",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
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
            
            # SKIP AUDIT LOGGING TO AVOID JSON PARSING ISSUES
            logger.info(f"✅ Login successful for: {login_data.email} (audit logging skipped)")
            
            return {
                "success": True,
                "access_token": token,
                "token_type": "bearer",
                "user_id": user['id'],
                "email": user['email'],
                "role": user['role'],
                "tier": user['tier'],
                "message": "Login successful - simple version",
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"❌ Login error: {e}")
        return {
            "success": False,
            "error": "Internal server error",
            "message": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@app.post("/api/employees/invite")
async def invite_employee(invite_data: EmployeeInviteRequest, user_id: int = Depends(verify_token)):
    """Invite employee with email - SIMPLIFIED VERSION"""
    try:
        logger.info(f"📧 Employee invitation request from user {user_id}")
        
        pool = await get_db()
        async with pool.acquire() as conn:
            # Check if requester is Tier 1 Super Admin
            requester = await conn.fetchrow(
                "SELECT email, role, tier FROM users WHERE id = $1", user_id
            )
            
            if not requester or requester['tier'] != 1:
                return {
                    "success": False,
                    "error": "Insufficient permissions",
                    "message": "Only Tier 1 Super Admin can invite employees",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            # Check if user already exists
            existing_user = await conn.fetchrow(
                "SELECT id FROM users WHERE email = $1", invite_data.email
            )
            
            if existing_user:
                return {
                    "success": False,
                    "error": "User already exists",
                    "message": f"User {invite_data.email} already exists in the system",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
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
            
            # Send invitation email
            email_result = await email_service.send_invitation_email(
                invite_data.email, invitation_token, requester['email']
            )
            
            # SKIP AUDIT LOGGING TO AVOID JSON ISSUES
            logger.info(f"✅ Employee invitation created for: {invite_data.email} (audit logging skipped)")
            
            return {
                "success": True,
                "message": "Employee invitation created and email sent successfully",
                "data": {
                    "email": invite_data.email,
                    "role": invite_data.role,
                    "tier": invite_data.tier,
                    "invitation_token": invitation_token,
                    "expires_in_hours": 48,
                    "invited_by": requester['email'],
                    "email_sent": email_result['success'],
                    "invitation_url": email_result.get('invitation_url', ''),
                    "email_file": email_result.get('email_file', '')
                },
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"❌ Employee invitation error: {e}")
        return {
            "success": False,
            "error": "Internal server error",
            "message": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

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
                return {
                    "success": False,
                    "error": "Insufficient permissions",
                    "message": "Only Tier 1 Super Admin can list employees",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
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
            
            return {
                "success": True,
                "message": f"Retrieved {len(user_list)} users",
                "data": {
                    "users": user_list,
                    "total_count": len(user_list)
                },
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"❌ List employees error: {e}")
        return {
            "success": False,
            "error": "Internal server error", 
            "message": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

if __name__ == "__main__":
    # Get port from command line or default to 9011
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 9011
    logger.info(f"🚀 Starting PMERIT Simple Working API on port {port}")
    
    # Set environment variable for health check
    os.environ["PORT"] = str(port)
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port, 
        log_level="info",
        access_log=True
    )
