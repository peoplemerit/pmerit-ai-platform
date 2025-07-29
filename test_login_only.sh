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
