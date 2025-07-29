# =================================================================
# PMERIT AI Educational Platform - Email Service
# Cloudflare Email integration for employee invitations
# =================================================================

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from datetime import datetime
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class EmailService:
    """Email service for PMERIT AI platform using Cloudflare Email Routing"""
    
    def __init__(self):
        # Email configuration for Cloudflare
        self.from_email = "noreply@pmerit-ai-platform.pages.dev"
        self.reply_to = "support@pmerit-ai-platform.pages.dev"
        self.notification_email = "onboard@pmerit-ai-platform.pages.dev"
        
        # For development, we'll use a simple SMTP approach
        # In production, integrate with Cloudflare Workers for email sending
        
    def create_invitation_email_html(self, employee_email: str, invitation_token: str, invited_by: str) -> str:
        """Create beautiful HTML email template for employee invitation"""
        
        invitation_url = f"https://pmerit-ai-platform-portal.pages.dev/accept-invitation?token={invitation_token}"
        
        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PMERIT AI Team Invitation</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }}
                .container {{
                    max-width: 600px;
                    margin: 20px auto;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    overflow: hidden;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                }}
                .content {{
                    padding: 40px 30px;
                }}
                .welcome-text {{
                    font-size: 18px;
                    color: #333;
                    margin-bottom: 20px;
                }}
                .mission-box {{
                    background: #f8f9fa;
                    border-left: 4px solid #667eea;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }}
                .cta-button {{
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 16px;
                    margin: 20px 0;
                    transition: transform 0.3s ease;
                }}
                .cta-button:hover {{
                    transform: translateY(-2px);
                }}
                .details {{
                    background: #e8f4fd;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }}
                .footer {{
                    background: #2c3e50;
                    color: #ecf0f1;
                    padding: 20px;
                    text-align: center;
                    font-size: 14px;
                }}
                .global-impact {{
                    color: #667eea;
                    font-weight: bold;
                    font-size: 16px;
                }}
                .expiry-notice {{
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    color: #856404;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌍 Welcome to PMERIT AI</h1>
                    <p>Breaking Poverty Cycles Through Education</p>
                </div>
                
                <div class="content">
                    <p class="welcome-text">Hello {employee_email},</p>
                    
                    <p>You've been invited by <strong>{invited_by}</strong> to join the PMERIT AI Educational Platform team!</p>
                    
                    <div class="mission-box">
                        <h3>🎯 Our Mission</h3>
                        <p>We're building an educational platform to serve <strong>3+ billion underserved people worldwide</strong>, starting with Nigerian students and US underserved communities.</p>
                        
                        <p class="global-impact">🌍 Global Impact Areas:</p>
                        <ul>
                            <li><strong>Nigeria:</strong> Students with limited university access</li>
                            <li><strong>US:</strong> Rural communities, veterans, displaced workers</li>
                            <li><strong>Global:</strong> Africa (1.3B), South Asia (600M), Latin America (400M)</li>
                        </ul>
                    </div>
                    
                    <div class="details">
                        <h3>🎓 What You'll Be Part Of:</h3>
                        <ul>
                            <li><strong>Enterprise-Grade Platform:</strong> 13 operational Docker containers</li>
                            <li><strong>Cultural Intelligence:</strong> Adaptive framework for global communities</li>
                            <li><strong>Dual-Mode Education:</strong> Remote Career + Local Career tracks</li>
                            <li><strong>Mobile-First Design:</strong> Optimized for budget devices worldwide</li>
                            <li><strong>Multi-Language Support:</strong> English, Hausa, Yoruba, Igbo, and more</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="{invitation_url}" class="cta-button">
                            🚀 Accept Invitation & Join Our Mission
                        </a>
                    </div>
                    
                    <div class="expiry-notice">
                        <strong>⏰ Important:</strong> This invitation expires in 48 hours. Please accept it soon to join our team!
                    </div>
                    
                    <p>If you have any questions, reply to this email or contact us at <a href="mailto:support@pmerit-ai-platform.pages.dev">support@pmerit-ai-platform.pages.dev</a></p>
                    
                    <p>Welcome to the team that's changing education worldwide!</p>
                    
                    <p>Best regards,<br>
                    <strong>The PMERIT AI Team</strong><br>
                    <em>Breaking Poverty Cycles Through Accessible Education</em></p>
                </div>
                
                <div class="footer">
                    <p><strong>PMERIT AI Educational Platform</strong></p>
                    <p>Serving Nigerian & US Underserved Communities</p>
                    <p>🌐 Platform: <a href="https://pmerit-ai-platform.pages.dev" style="color: #3498db;">pmerit-ai-platform.pages.dev</a></p>
                    <p>📧 Support: <a href="mailto:support@pmerit-ai-platform.pages.dev" style="color: #3498db;">support@pmerit-ai-platform.pages.dev</a></p>
                    <p><small>This email was sent to {employee_email} • Invitation Token: {invitation_token[:8]}...</small></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return html_template
    
    def create_invitation_email_text(self, employee_email: str, invitation_token: str, invited_by: str) -> str:
        """Create plain text version of invitation email"""
        
        invitation_url = f"https://pmerit-ai-platform-portal.pages.dev/accept-invitation?token={invitation_token}"
        
        text_content = f"""
PMERIT AI Educational Platform - Team Invitation

Hello {employee_email},

You've been invited by {invited_by} to join the PMERIT AI Educational Platform team!

Our Mission:
We're building an educational platform to serve 3+ billion underserved people worldwide, starting with Nigerian students and US underserved communities.

Global Impact Areas:
• Nigeria: Students with limited university access
• US: Rural communities, veterans, displaced workers  
• Global: Africa (1.3B), South Asia (600M), Latin America (400M)

What You'll Be Part Of:
• Enterprise-Grade Platform: 13 operational Docker containers
• Cultural Intelligence: Adaptive framework for global communities
• Dual-Mode Education: Remote Career + Local Career tracks
• Mobile-First Design: Optimized for budget devices worldwide
• Multi-Language Support: English, Hausa, Yoruba, Igbo, and more

Accept Your Invitation:
{invitation_url}

IMPORTANT: This invitation expires in 48 hours.

Questions? Contact us at support@pmerit-ai-platform.pages.dev

Welcome to the team that's changing education worldwide!

Best regards,
The PMERIT AI Team
Breaking Poverty Cycles Through Accessible Education

Platform: https://pmerit-ai-platform.pages.dev
Support: support@pmerit-ai-platform.pages.dev
        """
        
        return text_content.strip()
    
    async def send_invitation_email(self, employee_email: str, invitation_token: str, invited_by: str) -> dict:
        """Send employee invitation email"""
        try:
            # For now, we'll create the email content and log it
            # In production, this would integrate with Cloudflare Workers for actual sending
            
            html_content = self.create_invitation_email_html(employee_email, invitation_token, invited_by)
            text_content = self.create_invitation_email_text(employee_email, invitation_token, invited_by)
            
            # Log the email creation (for development)
            logger.info(f"📧 Email created for {employee_email}")
            logger.info(f"📧 Invitation URL: https://pmerit-ai-platform-portal.pages.dev/accept-invitation?token={invitation_token}")
            
            # Save email to file for review (development)
            email_filename = f"/home/gabriel-ai/pmerit-ai-platform/emails/invitation_{employee_email.replace('@', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
            
            # Create emails directory if it doesn't exist
            import os
            os.makedirs("/home/gabriel-ai/pmerit-ai-platform/emails", exist_ok=True)
            
            with open(email_filename, 'w') as f:
                f.write(html_content)
            
            logger.info(f"📧 Email saved to: {email_filename}")
            
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
    
    async def send_notification_email(self, subject: str, message: str) -> dict:
        """Send notification email to admin"""
        try:
            # For development, log the notification
            logger.info(f"📧 Admin Notification: {subject}")
            logger.info(f"📧 Message: {message}")
            
            return {
                "success": True,
                "message": "Notification sent successfully"
            }
            
        except Exception as e:
            logger.error(f"❌ Notification failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Global email service instance
email_service = EmailService()
