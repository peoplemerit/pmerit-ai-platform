# Fixed login endpoint with proper JSON handling
@app.post("/api/auth/login")
async def login(login_data: LoginRequest):
    """Enhanced login with proper JSON responses - FIXED VERSION"""
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
            
            # Log successful login
            await conn.execute(
                "INSERT INTO user_audit_log (user_id, action, details) VALUES ($1, $2, $3)",
                user['id'], "login", "API login successful"
            )
            
            logger.info(f"✅ Login successful for: {login_data.email}")
            
            # Return simple dictionary (FastAPI will handle JSON conversion)
            return {
                "success": True,
                "access_token": token,
                "token_type": "bearer",
                "user_id": user['id'],
                "email": user['email'],
                "role": user['role'],
                "tier": user['tier'],
                "message": "Login completed successfully",
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
