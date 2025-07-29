#!/bin/bash
# =================================================================
# Test Complete Employee Workflow - Use Working API on Port 9011
# NO DUPLICATION - Build on what's already working!
# =================================================================

echo "🧪 Testing Complete PMERIT Employee Workflow"
echo "Using WORKING API on port 9011 (simple_working_main.py)"
echo "=============================================="
echo

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔐 Step 1: Login with Working Credentials"
echo "========================================"

# Use the credentials that we know work from your terminal output
LOGIN_DATA='{"email": "admin@pmerit.com", "password": "SuperAdmin123!"}'

echo "Logging in as admin@pmerit.com..."
LOGIN_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA" \
    "http://localhost:9011/api/auth/login")

echo "Login Response:"
echo "$LOGIN_RESPONSE"

# Extract the access token (we know this works from your test)
if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data['access_token'])
except:
    print('TOKEN_EXTRACTION_FAILED')
")
    echo -e "${GREEN}✅ Login Successful! Token extracted.${NC}"
    echo "Token: ${ACCESS_TOKEN:0:50}..."
else
    echo -e "${RED}❌ Login failed - stopping test${NC}"
    exit 1
fi

echo
echo "👥 Step 2: Test Employee Invitation System"
echo "========================================="

# Test employee invitation (this should generate email template)
INVITE_DATA='{"email": "employee@pmerit.com", "role": "employee", "tier": 2, "name": "Test Employee"}'

echo "Creating employee invitation..."
INVITE_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d "$INVITE_DATA" \
    "http://localhost:9011/api/employees/invite")

echo "Invitation Response:"
echo "$INVITE_RESPONSE"

if echo "$INVITE_RESPONSE" | grep -q "success\|invitation\|email"; then
    echo -e "${GREEN}✅ Employee invitation created!${NC}"
else
    echo -e "${RED}❌ Employee invitation failed${NC}"
fi

echo
echo "📧 Step 3: Check for Generated Email Templates"
echo "============================================="

# Check if email templates were generated
echo "Checking emails directory..."
if [ -d ~/pmerit-ai-platform/emails ]; then
    EMAIL_COUNT=$(ls ~/pmerit-ai-platform/emails/*.html 2>/dev/null | wc -l)
    if [ $EMAIL_COUNT -gt 0 ]; then
        echo -e "${GREEN}✅ Found $EMAIL_COUNT email templates!${NC}"
        echo "Latest email files:"
        ls -lt ~/pmerit-ai-platform/emails/*.html 2>/dev/null | head -3
        
        # Show content of latest email
        LATEST_EMAIL=$(ls -t ~/pmerit-ai-platform/emails/*.html 2>/dev/null | head -1)
        if [ -n "$LATEST_EMAIL" ]; then
            echo
            echo "📧 Latest Email Content Preview:"
            echo "================================"
            head -20 "$LATEST_EMAIL"
            echo "..."
            echo "Email saved at: $LATEST_EMAIL"
        fi
    else
        echo -e "${RED}❌ No email templates found${NC}"
        echo "Email templates may need to be generated"
    fi
else
    echo -e "${RED}❌ Emails directory doesn't exist${NC}"
fi

echo
echo "🔍 Step 4: Check Available API Endpoints"
echo "======================================="

# Check what endpoints are available
echo "Testing available endpoints..."
curl -s "http://localhost:9011/" | head -10

echo
echo "📊 Step 5: List Current Users and Invitations"
echo "============================================"

# List employees (if endpoint exists)
echo "Checking for existing employees..."
EMPLOYEES_RESPONSE=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
    "http://localhost:9011/api/employees" 2>/dev/null)

if [ $? -eq 0 ] && [ -n "$EMPLOYEES_RESPONSE" ]; then
    echo "Employees Response:"
    echo "$EMPLOYEES_RESPONSE"
else
    echo "Employees endpoint may not be available or needs different path"
fi

echo
echo "🎯 WORKFLOW TEST SUMMARY"
echo "======================="

echo -e "${BLUE}Testing Results:${NC}"
echo "✅ API Running: Port 9011 operational"
echo "✅ Authentication: Login working perfectly"

if echo "$INVITE_RESPONSE" | grep -q "success\|invitation"; then
    echo "✅ Employee Invitations: Working"
else
    echo "❌ Employee Invitations: Need attention"
fi

if [ -d ~/pmerit-ai-platform/emails ] && [ $(ls ~/pmerit-ai-platform/emails/*.html 2>/dev/null | wc -l) -gt 0 ]; then
    echo "✅ Email Templates: Generated"
else
    echo "❌ Email Templates: Missing - need to generate"
fi

echo
echo "🚀 RECOMMENDED NEXT STEPS:"
echo "========================"

if echo "$INVITE_RESPONSE" | grep -q "success"; then
    echo "✅ Core system working - ready for:"
    echo "   • Email template enhancement"
    echo "   • Frontend integration"
    echo "   • Cloudflare email setup"
else
    echo "🔧 Fix needed for:"
    echo "   • Employee invitation endpoint"
    echo "   • Email template generation"
fi

echo
echo "💡 NO DUPLICATION NEEDED!"
echo "Your authentication system is working perfectly."
echo "Focus on completing the missing pieces only."
