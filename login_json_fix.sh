#!/bin/bash
# =================================================================
# PMERIT Login JSON Fix - Final Authentication Resolution
# Fix JSON parsing issue in login response
# =================================================================

echo "🔧 FIXING LOGIN JSON PARSING ISSUE"
echo "================================="

# Step 1: Stop the current API temporarily
echo "🛑 Step 1: Stopping current API to apply fix..."
pkill -f "python.*integrated_main.py" 2>/dev/null
sleep 3

# Step 2: Update the login endpoint with proper JSON handling
echo "🔧 Step 2: Updating login endpoint with fixed JSON handling..."

# Create the fixed login endpoint
cat > ~/pmerit-ai-platform/api/login_fix_patch.py << 'EOF'
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
EOF

# Step 3: Apply the fix to the main API file
echo "🔄 Step 3: Applying fix to main API file..."

# Backup current file
cp ~/pmerit-ai-platform/api/integrated_main.py ~/pmerit-ai-platform/api/integrated_main.py.backup

# Replace the login endpoint in the main file
python3 << 'EOF'
import re

# Read the current file
with open('/home/gabriel-ai/pmerit-ai-platform/api/integrated_main.py', 'r') as f:
    content = f.read()

# Read the fixed login function
with open('/home/gabriel-ai/pmerit-ai-platform/api/login_fix_patch.py', 'r') as f:
    fixed_login = f.read()

# Replace the login endpoint
# Find the start and end of the login function
start_pattern = r'@app\.post\("/api/auth/login"\)'
end_pattern = r'(\n@app\.|\nif __name__)'

# Find the login function
start_match = re.search(start_pattern, content)
if start_match:
    start_pos = start_match.start()
    
    # Find the next function or end of file
    remaining = content[start_pos:]
    end_match = re.search(end_pattern, remaining)
    
    if end_match:
        end_pos = start_pos + end_match.start()
        # Replace the login function
        new_content = content[:start_pos] + fixed_login + '\n' + content[end_pos:]
    else:
        # If no next function found, replace to end
        new_content = content[:start_pos] + fixed_login
    
    # Write the updated content
    with open('/home/gabriel-ai/pmerit-ai-platform/api/integrated_main.py', 'w') as f:
        f.write(new_content)
    
    print("✅ Login endpoint updated successfully")
else:
    print("❌ Could not find login endpoint to replace")
EOF

# Step 4: Create a simple login test
echo "🧪 Step 4: Creating simple login test..."

cat > ~/pmerit-ai-platform/test_login_only.sh << 'EOF'
#!/bin/bash
# Simple login test only

API_BASE="http://localhost:9011"

echo "🔐 TESTING LOGIN ONLY"
echo "===================="

# Wait for API to be ready
echo "⏳ Waiting for API to be ready..."
for i in {1..10}; do
    if curl -s "$API_BASE/health" > /dev/null 2>&1; then
        echo "✅ API is ready"
        break
    fi
    echo "Waiting... ($i/10)"
    sleep 2
done

echo ""
echo "🧪 Testing login with admin@pmerit.com..."

curl -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@pmerit.com", "password": "SuperAdmin123!"}' \
  -w "\nHTTP Status: %{http_code}\n" | python3 -m json.tool 2>/dev/null || echo "Response not valid JSON"

echo ""
echo "🎯 Login test complete"
EOF

chmod +x ~/pmerit-ai-platform/test_login_only.sh

# Step 5: Restart API with fix
echo ""
echo "🚀 Step 5: Restarting API with login fix..."

# Start the fixed API
cd ~/pmerit-ai-platform
nohup python3 api/integrated_main.py 9011 > api_output.log 2>&1 &
API_PID=$!

echo "API started with PID: $API_PID"
echo "Waiting for startup..."
sleep 5

# Test if API is responding
if curl -s http://localhost:9011/health > /dev/null 2>&1; then
    echo "✅ API is responding"
else
    echo "❌ API not responding, checking logs..."
    tail -20 api_output.log
fi

echo ""
echo "🎉 LOGIN FIX COMPLETE!"
echo "====================="
echo ""
echo "✅ Fixed JSON parsing issue in login endpoint"
echo "✅ API restarted with proper JSON handling"
echo "✅ Simple login test script created"
echo ""
echo "🧪 NEXT STEPS:"
echo "1. Test login: ./test_login_only.sh"
echo "2. View API logs: tail -f api_output.log"
echo "3. Check health: curl http://localhost:9011/health"
echo ""
echo "🔐 If login works, Phase 1 is COMPLETE!"
echo "🚀 Then we move to Phase 2: Cloudflare Email Integration!"
