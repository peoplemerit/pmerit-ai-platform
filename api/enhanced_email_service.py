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
