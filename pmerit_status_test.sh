#!/bin/bash
# =================================================================
# PMERIT Current Status Test - Complete System Diagnostic
# Test everything to see what's actually working vs what needs attention
# =================================================================

echo "🔍 PMERIT AI Platform - Complete Current Status Test"
echo "===================================================="
echo

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to test and report
test_status() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ WORKING${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ NOT WORKING${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Function to test HTTP endpoint
test_http() {
    local name="$1"
    local url="$2"
    local expected_code="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing $name... "
    
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    if [ "$response_code" = "$expected_code" ]; then
        echo -e "${GREEN}✅ RESPONDING ($response_code)${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ NOT RESPONDING (got $response_code, expected $expected_code)${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo "🐳 PHASE 1: DOCKER CONTAINER STATUS"
echo "==================================="

# Test Docker service
test_status "Docker Service" "systemctl is-active docker" "active"

# Count running Gabriel containers
echo -n "Gabriel AI Containers: "
GABRIEL_CONTAINERS=$(docker ps --filter "name=gabriel" --format "{{.Names}}" | wc -l)
if [ $GABRIEL_CONTAINERS -gt 0 ]; then
    echo -e "${GREEN}✅ $GABRIEL_CONTAINERS containers running${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ No Gabriel containers running${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# List running Gabriel containers
echo "📋 Running Gabriel Containers:"
docker ps --filter "name=gabriel" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | head -20

echo
echo "🌐 PHASE 2: SERVICE ENDPOINT TESTING"
echo "===================================="

# Test all Gabriel service ports
test_http "Gabriel Core (9000)" "http://localhost:9000" "200"
test_http "Gabriel Users (9001)" "http://localhost:9001" "200"
test_http "Gabriel Courses (9002)" "http://localhost:9002" "200"
test_http "Gabriel Virtual Human (9003)" "http://localhost:9003" "200"
test_http "Gabriel Assessments (9004)" "http://localhost:9004" "200"
test_http "Gabriel OCR (9005)" "http://localhost:9005" "200"
test_http "Gabriel AI Tutoring (9006)" "http://localhost:9006" "200"
test_http "Gabriel Career (9007)" "http://localhost:9007" "200"
test_http "Gabriel Payments (9008)" "http://localhost:9008" "200"
test_http "Gabriel Communication (9009)" "http://localhost:9009" "200"
test_http "Gabriel Analytics (9010)" "http://localhost:9010" "200"

# Test potential new API port
test_http "New API Port (9011)" "http://localhost:9011" "200"

echo
echo "💾 PHASE 3: DATABASE CONNECTIVITY"
echo "================================="

# Test database connection
echo -n "PostgreSQL Database: "
if PGPASSWORD=gabriel_secure_2025 psql -h localhost -p 15432 -U gabriel_user -d gabriel_ai -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ CONNECTED${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    # Check for specific tables
    echo -n "User Management Tables: "
    if PGPASSWORD=gabriel_secure_2025 psql -h localhost -p 15432 -U gabriel_user -d gabriel_ai -c "SELECT COUNT(*) FROM users;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ EXISTS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ MISSING${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Employee Invitations Table: "
    if PGPASSWORD=gabriel_secure_2025 psql -h localhost -p 15432 -U gabriel_user -d gabriel_ai -c "SELECT COUNT(*) FROM employee_invitations;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ EXISTS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ MISSING${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
else
    echo -e "${RED}❌ NOT CONNECTED${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo
echo "🔐 PHASE 4: AUTHENTICATION SYSTEM"
echo "================================="

# Check for existing API files
echo -n "Multi-tier API Files: "
if [ -f ~/pmerit-ai-platform/api/main.py ] || [ -f ~/pmerit-ai-platform/api/email_enabled_main.py ]; then
    echo -e "${GREEN}✅ API FILES EXIST${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    # List API files
    echo "📁 Found API Files:"
    ls -la ~/pmerit-ai-platform/api/*.py 2>/dev/null | head -10
else
    echo -e "${RED}❌ API FILES MISSING${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test if any API is running on port 9011
echo -n "API Process (Port 9011): "
if pgrep -f "9011" > /dev/null; then
    echo -e "${GREEN}✅ PROCESS RUNNING${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    # Show the process
    echo "🔍 API Process Details:"
    ps aux | grep -E "(9011|main\.py)" | grep -v grep | head -3
else
    echo -e "${RED}❌ NO PROCESS RUNNING${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo
echo "📧 PHASE 5: EMAIL SYSTEM STATUS"
echo "==============================="

# Check for email templates
echo -n "Email Templates: "
if [ -d ~/pmerit-ai-platform/emails ] && [ $(ls ~/pmerit-ai-platform/emails/*.html 2>/dev/null | wc -l) -gt 0 ]; then
    echo -e "${GREEN}✅ EMAIL TEMPLATES EXIST${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    echo "📧 Email Files Found:"
    ls -la ~/pmerit-ai-platform/emails/*.html 2>/dev/null | head -5
else
    echo -e "${YELLOW}⚠️ NO EMAIL TEMPLATES FOUND${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Check for email service configuration
echo -n "Email Service Config: "
if [ -f ~/pmerit-ai-platform/.env ] && grep -q "EMAIL" ~/pmerit-ai-platform/.env; then
    echo -e "${GREEN}✅ EMAIL CONFIG EXISTS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️ EMAIL CONFIG MISSING${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo
echo "🌍 PHASE 6: GLOBAL DEPLOYMENT STATUS"
echo "====================================="

# Test Cloudflare Pages
test_http "Service Platform" "https://pmerit-ai-platform.pages.dev" "200"
test_http "Portal Platform" "https://pmerit-ai-platform-portal.pages.dev" "200"

# Test local dashboard
test_http "Local Dashboard" "http://localhost:9904/dashboard.html" "200"

echo
echo "📊 COMPREHENSIVE TEST RESULTS"
echo "=============================="
echo -e "✅ Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "❌ Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "📋 Total Tests: ${BLUE}$TOTAL_TESTS${NC}"

SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))
echo -e "📈 Success Rate: ${BLUE}$SUCCESS_RATE%${NC}"

if [ $SUCCESS_RATE -ge 80 ]; then
    echo -e "${GREEN}🎉 PLATFORM STATUS: EXCELLENT${NC}"
elif [ $SUCCESS_RATE -ge 60 ]; then
    echo -e "${YELLOW}⚠️ PLATFORM STATUS: GOOD${NC}"
else
    echo -e "${RED}🔧 PLATFORM STATUS: NEEDS ATTENTION${NC}"
fi

echo
echo "🔍 PRIORITY RECOMMENDATIONS:"
echo "=========================="

if [ $TESTS_FAILED -gt 0 ]; then
    echo "🎯 Focus Areas for This Window:"
    
    # Check specific failure patterns
    if ! pgrep -f "9011" > /dev/null; then
        echo "• Start the multi-tier authentication API"
    fi
    
    if ! curl -s -o /dev/null -w "%{http_code}" "http://localhost:9011" | grep -q "200"; then
        echo "• Fix API port conflicts and connectivity"
    fi
    
    if [ ! -f ~/pmerit-ai-platform/.env ] || ! grep -q "EMAIL" ~/pmerit-ai-platform/.env; then
        echo "• Set up email service configuration"
    fi
    
    echo "• Test authentication endpoints with admin credentials"
    echo "• Verify employee invitation workflow"
fi

echo
echo "🚀 READY FOR NEXT PHASE BASED ON RESULTS!"
echo "======================================="
