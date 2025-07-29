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
