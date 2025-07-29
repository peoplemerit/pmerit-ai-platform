#!/bin/bash
# =================================================================
# Test PMERIT Multi-Tier API on Correct Port
# =================================================================

API_PORT=9011
API_BASE="http://localhost:$API_PORT"

echo "🧪 Testing PMERIT API on port $API_PORT"
echo "======================================"

# Test 1: Health Check
echo ""
echo "🏥 Test 1: Health Check"
curl -s "$API_BASE/health" | python3 -m json.tool || echo "Health check failed"

# Test 2: Login Test
echo ""
echo "🔐 Test 2: Login Test"
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@pmerit.com", "password": "SuperAdmin123!"}')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | python3 -m json.tool || echo "Login failed"

# Extract token for further tests
TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ ! -z "$TOKEN" ]; then
    echo ""
    echo "✅ Login successful! Token extracted."
    
    # Test 3: Employee List
    echo ""
    echo "👥 Test 3: Employee List"
    curl -s -H "Authorization: Bearer $TOKEN" "$API_BASE/api/employees" | python3 -m json.tool
    
    # Test 4: Invitations List
    echo ""
    echo "📧 Test 4: Invitations List"
    curl -s -H "Authorization: Bearer $TOKEN" "$API_BASE/api/invitations" | python3 -m json.tool
    
else
    echo "❌ No token received, cannot test authenticated endpoints"
fi

echo ""
echo "🎯 API Base URL: $API_BASE"
echo "📚 API Documentation: $API_BASE/docs"
echo "🔍 Health Check: $API_BASE/health"

