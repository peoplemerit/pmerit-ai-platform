#!/bin/bash
# =================================================================
# Test Current Working API - Simple & Direct
# Based on diagnostic: API running on 9011, 87% success rate
# =================================================================

echo "🧪 Testing EXISTING Working PMERIT API (Port 9011)"
echo "=================================================="
echo "Based on diagnostic: simple_working_main.py is running"
echo

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔍 Step 1: Verify API Process is Running"
echo "========================================"
if pgrep -f "simple_working_main.py" > /dev/null; then
    PID=$(pgrep -f "simple_working_main.py")
    echo -e "${GREEN}✅ API Process Found: PID $PID${NC}"
    echo "Process details:"
    ps aux | grep -E "(simple_working_main|9011)" | grep -v grep
else
    echo -e "${RED}❌ API Process Not Found${NC}"
    echo "Let's check what's actually running on port 9011:"
    lsof -i :9011 2>/dev/null || echo "Nothing on port 9011"
fi

echo
echo "🌐 Step 2: Test Basic API Connectivity"
echo "====================================="

# Test root endpoint
echo -n "Root endpoint... "
ROOT_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:9011/ 2>/dev/null)
if echo "$ROOT_RESPONSE" | tail -1 | grep -q "200"; then
    echo -e "${GREEN}✅ Responding${NC}"
    echo "Response: $(echo "$ROOT_RESPONSE" | head -n -1)"
else
    echo -e "${RED}❌ Not responding${NC}"
    echo "Response code: $(echo "$ROOT_RESPONSE" | tail -1)"
fi

echo
echo "🔐 Step 3: Test Authentication (Using Known Credentials)"
echo "======================================================"

# Test login with super admin credentials from previous window
echo "Testing login with: admin@pmerit.com / SuperAdmin123!"
LOGIN_DATA='{"email": "admin@pmerit.com", "password": "SuperAdmin123!"}'

echo -n "Login attempt... "
LOGIN_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA" \
    http://localhost:9011/api/auth/login 2>/dev/null)

echo "Response received"
echo "Full login response:"
echo "$LOGIN_RESPONSE"

# Check if login was successful
if echo "$LOGIN_RESPONSE" | grep -q "success.*true\|access_token\|token"; then
    echo -e "${GREEN}✅ Authentication Working!${NC}"
    
    # Try to extract token
    if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
        TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('access_token', 'TOKEN_NOT_FOUND'))
except:
    print('JSON_PARSE_ERROR')
" 2>/dev/null)
        echo "Token extracted: ${TOKEN:0:50}..."
    fi
else
    echo -e "${RED}❌ Authentication Issue${NC}"
    echo "This might need attention"
fi

echo
echo "💾 Step 4: Check Database Connection"
echo "=================================="

echo -n "Database connectivity... "
if PGPASSWORD=gabriel_secure_2025 psql -h localhost -p 15432 -U gabriel_user -d gabriel_ai -c "SELECT COUNT(*) FROM users;" > /dev/null 2>&1; then
    USER_COUNT=$(PGPASSWORD=gabriel_secure_2025 psql -h localhost -p 15432 -U gabriel_user -d gabriel_ai -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs)
    echo -e "${GREEN}✅ Connected ($USER_COUNT users in database)${NC}"
else
    echo -e "${RED}❌ Connection issue${NC}"
fi

echo
echo "📧 Step 5: Check Email System Status"
echo "==================================="

echo -n "Email templates... "
if [ -d ~/pmerit-ai-platform/emails ] && [ $(ls ~/pmerit-ai-platform/emails/*.html 2>/dev/null | wc -l) -gt 0 ]; then
    EMAIL_COUNT=$(ls ~/pmerit-ai-platform/emails/*.html 2>/dev/null | wc -l)
    echo -e "${GREEN}✅ Found $EMAIL_COUNT email templates${NC}"
    echo "Latest email files:"
    ls -lt ~/pmerit-ai-platform/emails/*.html 2>/dev/null | head -3
else
    echo -e "${RED}❌ No email templates found${NC}"
    echo "Email directory status:"
    ls -la ~/pmerit-ai-platform/emails/ 2>/dev/null || echo "Email directory doesn't exist"
fi

echo
echo "📊 SUMMARY & RECOMMENDATIONS"
echo "============================"

echo -e "${BLUE}Current Status Based on Tests:${NC}"

# Simple status check
if pgrep -f "simple_working_main.py" > /dev/null; then
    echo "✅ API Process: Running"
else
    echo "❌ API Process: Not found"
fi

if curl -s http://localhost:9011/ > /dev/null 2>&1; then
    echo "✅ API Connectivity: Working"
else
    echo "❌ API Connectivity: Failed"
fi

echo
echo -e "${BLUE}Next Steps:${NC}"
echo "1. If API is running but login fails → Focus on authentication fixes"
echo "2. If API is not running → Start the API first"
echo "3. If everything works → Move to frontend integration"
echo "4. Check email templates and regenerate if needed"

echo
echo "🔍 Available API files to work with:"
ls -la ~/pmerit-ai-platform/api/*.py 2>/dev/null | head -5

echo
echo "🎯 Based on results, we can proceed efficiently without rebuilding working components!"
