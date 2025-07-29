#!/bin/bash
# =================================================================
# PMERIT Email Sending Setup - Complete Implementation
# Enable actual email sending with multiple provider options
# =================================================================

echo "📧 ENABLING ACTUAL EMAIL SENDING FOR PMERIT AI PLATFORM"
echo "======================================================"

cd ~/pmerit-ai-platform

# Step 1: Check current email system status
echo "🔍 Step 1: Checking current email system status..."

if [ -d "emails" ]; then
    EMAIL_COUNT=$(ls emails/*.html 2>/dev/null | wc -l)
    echo "✅ Email templates directory exists with $EMAIL_COUNT generated emails"
else
    echo "📁 Creating emails directory..."
    mkdir -p emails
fi

# Check API status
API_STATUS=$(curl -s http://localhost:9011/health 2>/dev/null | grep -o '"status":"healthy"' || echo "API not responding")
if [[ "$API_STATUS" == *"healthy"* ]]; then
    echo "✅ PMERIT API is running and healthy"
else
    echo "❌ API needs to be started first"
    echo "   Run: cd ~/pmerit-ai-platform && python3 api/simple_working_main.py 9011 &"
fi

echo ""
echo "🎯 Step 2: Email Provider Selection"
echo "=================================="
echo "Choose your email sending method:"
echo "1. SendGrid (Recommended - Easy setup, reliable)"
echo "2. Gmail SMTP (Quick setup with personal Gmail)"
echo "3. Generic SMTP (Any email provider)"
echo ""

read -p "Enter your choice (1-3): " PROVIDER_CHOICE

case $PROVIDER_CHOICE in
    1)
        PROVIDER="sendgrid"
        echo "📧 Selected: SendGrid"
        ;;
    2)
        PROVIDER="gmail"
        echo "📧 Selected: Gmail SMTP"
        ;;
    3)
        PROVIDER="smtp"
        echo "📧 Selected: Generic SMTP"
        ;;
    *)
        PROVIDER="sendgrid"
        echo "📧 Defaulting to: SendGrid"
        ;;
esac

echo ""
echo "🔧 Step 3: Installing email dependencies..."

# Install required packages
pip3 install sendgrid python-dotenv || {
    echo "Trying with pip..."
    pip install sendgrid python-dotenv
}

echo ""
echo "⚙️ Step 4: Creating enhanced email service..."

# Create enhanced email service
cat > api/enhanced_email_service.py << 'EOF'
#!/usr/bin/env python3
# =================================================================
# PMERIT AI Educational Platform - Enhanced Email Service
# Multiple provider support for actual email sending
# =================================================================

import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from datetime import datetime
import logging
from typing import Optional, Dict

# Try to import optional dependencies
try:
    import sendgrid
    from sendgrid.helpers.mail import Mail, Email, To, Content
    SENDGRID_AVAILABLE = True
except ImportError:
    SENDGRID_AVAILABLE = False

try:
    from dotenv import load_dotenv
    load_dotenv()
    DOTENV_AVAILABLE = True
except ImportError:
    DOTENV_AVAILABLE = False

logger = logging.getLogger(__name__)

class EnhancedEmailService:
    """Enhanced email service with multiple provider support"""
    
    def __init__(self, provider="sendgrid"):
        self.provider = provider
        self.from_email = "noreply@pmerit-ai-platform.pages.dev"
        self.from_name = "PMERIT AI Platform"
        self.reply_to = "support@pmerit-ai-platform.pages.dev"
        
        # Load configuration
        self._load_config()
        
    def _load_config(self):
        """Load configuration based on provider"""
        if self.provider == "sendgrid":
            self.sendgrid_api_key = os.getenv('SENDGRID_API_KEY', '')
            if not self.sendgrid_api_key:
                print("⚠️  SENDGRID_API_KEY not found in environment variables")
                
        elif self.provider == "gmail":
            self.smtp_server = "smtp.gmail.com"
            self.smtp_port = 587
            self.smtp_username = os.getenv('GMAIL_EMAIL', '')
            self.smtp_password = os.getenv('GMAIL_APP_PASSWORD', '')
            if not self.smtp_username or not self.smtp_password:
                print("⚠️  GMAIL_EMAIL or GMAIL_APP_PASSWORD not found in environment variables")
                
        elif self.provider == "smtp":
            self.smtp_server = os.getenv('SMTP_SERVER', 'localhost')
            self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
            self.smtp_username = os.getenv('SMTP_USERNAME', '')
            self.smtp_password = os.getenv('SMTP_PASSWORD', '')
    
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
                .container {{ max-width: 600px; margin: 20px auto; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }}
                .header h1 {{ margin: 0; font-size: 32px; font-weight: bold; }}
                .content {{ padding: 40px 30px; }}
                .mission-box {{ background: #f8f9fa; border-left: 5px solid #667eea; padding: 25px; margin: 25px 0; border-radius: 8px; }}
                .cta-button {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 18px 40px; border-radius: 30px; font-weight: bold; font-size: 18px; }}
                .footer {{ background: #2c3e50; color: #ecf0f1; padding: 30px; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌍 Welcome to PMERIT AI</h1>
                    <p>Breaking Poverty Cycles Through Education</p>
                </div>
                <div class="content">
                    <p style="font-size: 20px; color: #333;">Hello {employee_email},</p>
                    <p>You've been invited by <strong>{invited_by}</strong> to join the PMERIT AI Educational Platform team!</p>
                    <div class="mission-box">
                        <h3>🎯 Our Global Mission</h3>
                        <p>We're building an educational platform to serve <strong>3+ billion underserved people worldwide</strong>, starting with Nigerian students and US underserved communities.</p>
                        <ul>
                            <li><strong>Nigeria:</strong> Students with limited university access</li>
                            <li><strong>US:</strong> Rural communities, veterans, displaced workers</li>
                            <li><strong>Global:</strong> Africa (1.3B), South Asia (600M), Latin America (400M)</li>
                        </ul>
                    </div>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="{invitation_url}" class="cta-button">🚀 Accept Invitation & Join Our Mission</a>
                    </div>
                    <p><strong>⏰ Important:</strong> This invitation expires in 48 hours.</p>
                    <p>Welcome to the team that's changing education worldwide!</p>
                    <p>Best regards,<br><strong>The PMERIT AI Team</strong></p>
                </div>
                <div class="footer">
                    <h3>PMERIT AI Educational Platform</h3>
                    <p>Serving Nigerian & US Underserved Communities</p>
                    <p>🌐 <a href="https://pmerit-ai-platform.pages.dev" style="color: #3498db;">pmerit-ai-platform.pages.dev</a></p>
                </div>
            </div>
        </body>
        </html>
        """
    
    async def send_invitation_email_sendgrid(self, employee_email: str, invitation_token: str, invited_by: str) -> Dict:
        """Send email using SendGrid"""
        if not SENDGRID_AVAILABLE:
            return {"success": False, "error": "SendGrid library not installed"}
            
        if not self.sendgrid_api_key:
            return {"success": False, "error": "SendGrid API key not configured"}
        
        try:
            sg = sendgrid.SendGridAPIClient(api_key=self.sendgrid_api_key)
            
            html_content = self.create_invitation_email_html(employee_email, invitation_token, invited_by)
            
            message = Mail(
                from_email=Email(self.from_email, self.from_name),
                to_emails=To(employee_email),
                subject="🌍 Join PMERIT AI - Transform Education Worldwide!",
                html_content=Content("text/html", html_content)
            )
            
            response = sg.send(message)
            
            return {
                "success": True,
                "provider": "sendgrid",
                "message": "Email sent successfully via SendGrid",
                "recipient": employee_email,
                "status_code": response.status_code
            }
            
        except Exception as e:
            return {
                "success": False,
                "provider": "sendgrid",
                "error": str(e)
            }
    
    async def send_invitation_email_smtp(self, employee_email: str, invitation_token: str, invited_by: str) -> Dict:
        """Send email using SMTP"""
        if not self.smtp_username or not self.smtp_password:
            return {"success": False, "error": "SMTP credentials not configured"}
        
        try:
            html_content = self.create_invitation_email_html(employee_email, invitation_token, invited_by)
            
            message = MIMEMultipart("alternative")
            message["Subject"] = "🌍 Join PMERIT AI - Transform Education Worldwide!"
            message["From"] = formataddr((self.from_name, self.smtp_username))
            message["To"] = employee_email
            
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            context = ssl.create_default_context()
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls(context=context)
                server.login(self.smtp_username, self.smtp_password)
                server.sendmail(self.smtp_username, employee_email, message.as_string())
            
            return {
                "success": True,
                "provider": "smtp",
                "message": f"Email sent successfully via {self.smtp_server}",
                "recipient": employee_email
            }
            
        except Exception as e:
            return {
                "success": False,
                "provider": "smtp",
                "error": str(e)
            }
    
    async def send_invitation_email(self, employee_email: str, invitation_token: str, invited_by: str) -> Dict:
        """Send invitation email using configured provider"""
        try:
            # Always save email file for backup
            html_content = self.create_invitation_email_html(employee_email, invitation_token, invited_by)
            
            os.makedirs("/home/gabriel-ai/pmerit-ai-platform/emails", exist_ok=True)
            
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            email_filename = f"/home/gabriel-ai/pmerit-ai-platform/emails/invitation_{employee_email.replace('@', '_')}_{timestamp}.html"
            
            with open(email_filename, 'w') as f:
                f.write(html_content)
            
            # Send email based on provider
            if self.provider == "sendgrid":
                send_result = await self.send_invitation_email_sendgrid(employee_email, invitation_token, invited_by)
            elif self.provider in ["gmail", "smtp"]:
                send_result = await self.send_invitation_email_smtp(employee_email, invitation_token, invited_by)
            else:
                send_result = {"success": False, "error": f"Unsupported provider: {self.provider}"}
            
            result = {
                "success": send_result.get("success", False),
                "message": send_result.get("message", "Email processing completed"),
                "email_file": email_filename,
                "invitation_url": f"https://pmerit-ai-platform-portal.pages.dev/accept-invitation?token={invitation_token}",
                "recipient": employee_email,
                "provider": self.provider
            }
            
            if not send_result.get("success"):
                result["error"] = send_result.get("error", "Unknown error")
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "provider": self.provider
            }

def get_email_service(provider="sendgrid"):
    return EnhancedEmailService(provider)
EOF

echo "✅ Enhanced email service created"

echo ""
echo "🔑 Step 5: Creating environment configuration..."

# Create environment file
cat > .env << EOF
# PMERIT AI Email Configuration
EMAIL_PROVIDER=$PROVIDER

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Gmail Configuration  
GMAIL_EMAIL=your_gmail_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password_here

# SMTP Configuration
SMTP_SERVER=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password

# Email Settings
FROM_EMAIL=noreply@pmerit-ai-platform.pages.dev
FROM_NAME=PMERIT AI Platform
REPLY_TO_EMAIL=support@pmerit-ai-platform.pages.dev
EOF

echo "✅ Environment configuration created"

echo ""
echo "🚀 Step 6: Creating email-enabled API..."

# Create enhanced API with email integration
cat > api/email_enabled_main.py << 'EOF'
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
EOF

echo "✅ Email-enabled API created"

echo ""
echo "🧪 Step 7: Creating test script..."

cat > test_email_sending.sh << 'EOF'
#!/bin/bash

API_BASE="http://localhost:9011"

echo "📧 TESTING PMERIT EMAIL SENDING"
echo "==============================="

# Check health
echo "🔍 Checking API health..."
curl -s "$API_BASE/health" | python3 -m json.tool

# Login
echo ""
echo "🔐 Getting authentication token..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@pmerit.com", "password": "SuperAdmin123!"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('access_token', ''))
except:
    print('')
" 2>/dev/null)

if [ ! -z "$TOKEN" ]; then
    echo "✅ Authentication successful"
    
    echo ""
    read -p "Enter email address to test: " TEST_EMAIL
    
    if [ ! -z "$TEST_EMAIL" ]; then
        echo "📧 Sending invitation email to: $TEST_EMAIL"
        
        curl -s -X POST "$API_BASE/api/employees/invite" \
          -H "Authorization: Bearer $TOKEN" \
          -H "Content-Type: application/json" \
          -d "{\"email\": \"$TEST_EMAIL\", \"role\": \"employee\", \"tier\": 2}" | \
          python3 -m json.tool
    fi
else
    echo "❌ Authentication failed"
fi
EOF

chmod +x test_email_sending.sh

echo "✅ Test script created"

echo ""
echo "🚀 Step 8: Creating startup script..."

cat > start_email_api.sh << 'EOF'
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
EOF

chmod +x start_email_api.sh

echo "✅ Startup script created"

echo ""
echo "🎉 EMAIL SETUP COMPLETE!"
echo "======================="
echo ""
echo "📋 NEXT STEPS:"

case $PROVIDER in
    "sendgrid")
        echo "1. Get SendGrid API Key:"
        echo "   • Go to https://app.sendgrid.com/"
        echo "   • Sign up for free (100 emails/day)"
        echo "   • Create API Key with Full Access"
        echo ""
        echo "2. Configure credentials:"
        echo "   nano .env"
        echo "   # Replace 'your_sendgrid_api_key_here' with real key"
        ;;
    "gmail")
        echo "1. Set up Gmail App Password:"
        echo "   • Enable 2FA on Gmail"
        echo "   • Generate App Password for Mail"
        echo ""
        echo "2. Configure credentials:"
        echo "   nano .env"
        echo "   # Set GMAIL_EMAIL and GMAIL_APP_PASSWORD"
        ;;
esac

echo ""
echo "3. Start email-enabled API:"
echo "   ./start_email_api.sh"
echo ""
echo "4. Test email sending:"
echo "   ./test_email_sending.sh"
echo ""
echo "🌍 Your PMERIT AI Platform will have COMPLETE email capabilities!"
