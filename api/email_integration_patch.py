# Add this to the employee invitation endpoint in integrated_main.py

# Import email service at the top
from email_service import email_service

# Updated employee invitation endpoint with email integration
@app.post("/api/employees/invite")
async def invite_employee(invite_data: EmployeeInviteRequest, user_id: int = Depends(verify_token)):
    """Invite new employee with email notification (Tier 1 Super Admin only)"""
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
            
            # Log invitation
            await conn.execute(
                "INSERT INTO user_audit_log (user_id, action, details) VALUES ($1, $2, $3)",
                user_id, "invite_employee", f"Invited {invite_data.email} as {invite_data.role} - Email: {email_result['success']}"
            )
            
            logger.info(f"✅ Employee invitation created for: {invite_data.email}")
            
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
