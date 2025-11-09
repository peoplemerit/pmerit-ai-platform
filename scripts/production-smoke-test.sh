#!/bin/bash
# production-smoke-test.sh - Production verification smoke tests
# Tests critical functionality after deployment
# Usage: ./scripts/production-smoke-test.sh [base_url]

set -e

# Configuration
BASE_URL="${1:-https://pmerit.com}"
API_URL="${API_URL:-https://pmerit-api.peoplemerit.workers.dev}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print section header
print_section() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local description=$2
    local expected_code=${3:-200}
    
    echo -n "Testing: $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>&1)
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response, expected $expected_code)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to test for string presence
test_contains() {
    local url=$1
    local search_string=$2
    local description=$3
    
    echo -n "Testing: $description... "
    
    response=$(curl -s "$url" 2>&1)
    
    if echo "$response" | grep -q "$search_string"; then
        echo -e "${GREEN}✓ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (string not found: $search_string)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to test HTTPS redirect
test_https_redirect() {
    local domain=$1
    
    echo -n "Testing: HTTPS redirect... "
    
    # Check if HTTP redirects to HTTPS
    response=$(curl -s -o /dev/null -w "%{redirect_url}" "http://${domain}" 2>&1)
    
    if echo "$response" | grep -q "https://"; then
        echo -e "${GREEN}✓ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (no HTTPS redirect)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to test SSL certificate
test_ssl_certificate() {
    local domain=$1
    
    echo -n "Testing: SSL certificate... "
    
    # Check SSL certificate validity
    if echo | openssl s_client -servername "$domain" -connect "${domain}:443" 2>/dev/null | openssl x509 -noout -checkend 0 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (invalid or expired certificate)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Start tests
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   PMERIT Production Smoke Tests            ║"
echo "╔════════════════════════════════════════════╗"
echo ""
echo "Base URL: $BASE_URL"
echo "API URL: $API_URL"
echo ""

# 1. SSL and Security Tests
print_section "1. SSL & Security"

DOMAIN=$(echo "$BASE_URL" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
test_ssl_certificate "$DOMAIN"
# Skip HTTP redirect test if using localhost or non-standard URL
if [[ ! "$DOMAIN" =~ localhost|127.0.0.1|pages.dev ]]; then
    test_https_redirect "$DOMAIN"
fi

# 2. Core Pages Tests
print_section "2. Core Pages"

test_endpoint "$BASE_URL/" "Home page loads" 200
test_endpoint "$BASE_URL/assessment-entry.html" "Assessment entry page loads" 200
test_endpoint "$BASE_URL/assessment-questions.html" "Assessment questions page loads" 200
test_endpoint "$BASE_URL/assessment-results.html" "Assessment results page loads" 200
test_endpoint "$BASE_URL/privacy.html" "Privacy policy page loads" 200
test_endpoint "$BASE_URL/support.html" "Support page loads" 200

# 3. Content Verification Tests
print_section "3. Content Verification"

test_contains "$BASE_URL/" "PMERIT" "Home page contains PMERIT branding"
test_contains "$BASE_URL/assessment-entry.html" "Assessment" "Assessment entry has assessment content"
test_contains "$BASE_URL/" "<!DOCTYPE html>" "Home page has valid HTML doctype"

# 4. Asset Tests
print_section "4. Assets"

test_endpoint "$BASE_URL/assets/css/theme-variables.css" "Theme CSS loads" 200
test_endpoint "$BASE_URL/assets/js/layout-loader.js" "Layout loader JS loads" 200
# Test for favicon (may return 200 or 204)
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/favicon.ico" > /tmp/favicon_test.txt 2>&1
FAVICON_CODE=$(cat /tmp/favicon_test.txt)
if [ "$FAVICON_CODE" = "200" ] || [ "$FAVICON_CODE" = "204" ]; then
    echo -e "Testing: Favicon exists... ${GREEN}✓ PASS${NC} (HTTP $FAVICON_CODE)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "Testing: Favicon exists... ${YELLOW}⚠ WARN${NC} (HTTP $FAVICON_CODE)"
fi

# 5. API Health Tests
print_section "5. API Health"

test_endpoint "$API_URL/health" "API health endpoint responds" 200
test_endpoint "$API_URL/api/v1/db/health" "Database health endpoint responds" 200
test_endpoint "$API_URL/api/v1/db/status" "Database status endpoint responds" 200

# 6. API Functionality Tests
print_section "6. API Functionality"

# Test AI chat endpoint
echo -n "Testing: AI chat endpoint... "
chat_response=$(curl -s -X POST "$API_URL/api/v1/ai/chat" \
    -H "Content-Type: application/json" \
    -d '{"messages":[{"role":"user","content":"Hello"}]}' 2>&1)

if [ -n "$chat_response" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAIL${NC} (no response)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Final Summary
print_section "Test Summary"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
echo ""
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All smoke tests passed!${NC}"
    echo "Production deployment verified successfully."
    exit 0
else
    echo -e "${RED}✗ Some smoke tests failed!${NC}"
    echo "Please investigate the failures above."
    exit 1
fi
