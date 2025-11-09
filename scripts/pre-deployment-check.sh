#!/bin/bash
# pre-deployment-check.sh - Pre-deployment verification script
# Verifies code quality, security, and readiness before production deployment
# Usage: ./scripts/pre-deployment-check.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNED=0

# Function to print section header
print_section() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check and report result
check_result() {
    local description=$1
    local result=$2
    
    if [ "$result" = "pass" ]; then
        echo -e "${GREEN}✓${NC} $description"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    elif [ "$result" = "warn" ]; then
        echo -e "${YELLOW}⚠${NC} $description"
        CHECKS_WARNED=$((CHECKS_WARNED + 1))
    else
        echo -e "${RED}✗${NC} $description"
        CHECKS_FAILED=$((CHECKS_FAILED + 1))
    fi
}

# Start checks
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   PMERIT Pre-Deployment Checklist          ║"
echo "╔════════════════════════════════════════════╗"
echo ""

# 1. Git Status Checks
print_section "1. Git Repository Status"

# Check clean working directory
if git diff --quiet && git diff --cached --quiet; then
    check_result "Working directory is clean" "pass"
else
    check_result "Working directory has uncommitted changes" "fail"
    git status --short
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
    check_result "On main branch" "pass"
else
    check_result "Not on main branch (current: $CURRENT_BRANCH)" "warn"
fi

# Check if up to date with remote
git fetch origin main --quiet 2>/dev/null || true
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")

if [ -n "$REMOTE" ]; then
    if [ "$LOCAL" = "$REMOTE" ]; then
        check_result "Branch is up to date with origin/main" "pass"
    else
        check_result "Branch is not up to date with origin/main" "fail"
    fi
else
    check_result "Cannot verify remote branch status" "warn"
fi

# 2. Code Quality Checks
print_section "2. Code Quality"

# Check for console.log in production code
CONSOLE_LOGS=$(grep -r "console\.log" --include="*.js" --exclude-dir=node_modules --exclude-dir=admin --exclude-dir=test* . 2>/dev/null | wc -l)
if [ "$CONSOLE_LOGS" -eq 0 ]; then
    check_result "No console.log statements found" "pass"
else
    check_result "$CONSOLE_LOGS console.log statements found" "warn"
fi

# Check for TODO comments
TODO_COUNT=$(grep -r "TODO\|FIXME\|XXX" --include="*.js" --include="*.html" --include="*.css" --exclude-dir=node_modules . 2>/dev/null | wc -l)
if [ "$TODO_COUNT" -eq 0 ]; then
    check_result "No TODO/FIXME comments found" "pass"
else
    check_result "$TODO_COUNT TODO/FIXME comments found" "warn"
fi

# Check for commented-out code blocks
COMMENTED_CODE=$(grep -rE "^\s*//.*[=\{\}\(\)]" --include="*.js" --exclude-dir=node_modules . 2>/dev/null | wc -l)
if [ "$COMMENTED_CODE" -lt 10 ]; then
    check_result "Minimal commented-out code ($COMMENTED_CODE lines)" "pass"
else
    check_result "Significant commented-out code found ($COMMENTED_CODE lines)" "warn"
fi

# 3. Security Checks
print_section "3. Security"

# Check for hardcoded API keys or secrets
POTENTIAL_SECRETS=$(grep -rE "(api[_-]?key|secret|password|token)\s*[:=]\s*['\"]" --include="*.js" --include="*.html" --exclude-dir=node_modules . 2>/dev/null | grep -v "placeholder" | grep -v "example" | wc -l)
if [ "$POTENTIAL_SECRETS" -eq 0 ]; then
    check_result "No hardcoded secrets detected" "pass"
else
    check_result "$POTENTIAL_SECRETS potential hardcoded secrets found" "fail"
    grep -rE "(api[_-]?key|secret|password|token)\s*[:=]\s*['\"]" --include="*.js" --include="*.html" --exclude-dir=node_modules . 2>/dev/null | grep -v "placeholder" | grep -v "example" | head -5
fi

# Check for proper HTTPS usage
HTTP_URLS=$(grep -rE "http://[^l]" --include="*.js" --include="*.html" --exclude="*.md" --exclude-dir=node_modules . 2>/dev/null | grep -v "localhost" | grep -v "127.0.0.1" | wc -l)
if [ "$HTTP_URLS" -eq 0 ]; then
    check_result "No HTTP URLs found (HTTPS properly used)" "pass"
else
    check_result "$HTTP_URLS HTTP URLs found (should use HTTPS)" "warn"
fi

# 4. Configuration Checks
print_section "4. Configuration"

# Check wrangler.toml exists
if [ -f "wrangler.toml" ]; then
    check_result "wrangler.toml exists" "pass"
else
    check_result "wrangler.toml not found" "fail"
fi

# Check CNAME exists
if [ -f "CNAME" ]; then
    DOMAIN=$(cat CNAME)
    check_result "CNAME exists (domain: $DOMAIN)" "pass"
else
    check_result "CNAME not found" "fail"
fi

# Check _headers exists
if [ -f "_headers" ]; then
    check_result "_headers file exists" "pass"
else
    check_result "_headers file not found" "fail"
fi

# 5. Required Files Check
print_section "5. Required Files"

REQUIRED_FILES=(
    "index.html"
    "assessment-entry.html"
    "assessment-questions.html"
    "assessment-results.html"
    "privacy.html"
    "support.html"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_result "$file exists" "pass"
    else
        check_result "$file not found" "fail"
    fi
done

# 6. Assets Check
print_section "6. Assets"

# Check if assets directory exists
if [ -d "assets" ]; then
    check_result "assets/ directory exists" "pass"
    
    # Check for large image files
    LARGE_IMAGES=$(find assets -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) -size +200k 2>/dev/null | wc -l)
    if [ "$LARGE_IMAGES" -eq 0 ]; then
        check_result "No oversized images (>200KB)" "pass"
    else
        check_result "$LARGE_IMAGES images larger than 200KB found" "warn"
    fi
else
    check_result "assets/ directory not found" "fail"
fi

# 7. Documentation Check
print_section "7. Documentation"

DOC_FILES=(
    "README.md"
    "SECURITY_SUMMARY.md"
    "ACCESSIBILITY.md"
)

for file in "${DOC_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_result "$file exists" "pass"
    else
        check_result "$file not found" "warn"
    fi
done

# Final Summary
print_section "Summary"

TOTAL_CHECKS=$((CHECKS_PASSED + CHECKS_FAILED + CHECKS_WARNED))
echo ""
echo "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${YELLOW}Warnings: $CHECKS_WARNED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Pre-deployment checks passed!${NC}"
    echo "Ready for production deployment."
    exit 0
else
    echo -e "${RED}✗ Pre-deployment checks failed!${NC}"
    echo "Please fix the issues above before deploying."
    exit 1
fi
