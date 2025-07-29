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
