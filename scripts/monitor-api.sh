#!/bin/bash
# monitor-api.sh - Monitor PMERIT API health
# Run every 15 minutes for first 24 hours after deployment
# Usage: ./scripts/monitor-api.sh [interval_seconds]

set -e

# Configuration
API_BASE_URL="${API_BASE_URL:-https://pmerit-api-worker.peoplemerit.workers.dev}"
INTERVAL="${1:-900}"  # Default: 15 minutes (900 seconds)
LOG_FILE="${LOG_FILE:-./logs/api-monitoring.log}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Function to check endpoint and log result
check_endpoint() {
    local endpoint=$1
    local description=$2
    local method=${3:-GET}
    local data=${4:-}
    
    echo -e "\n${YELLOW}Testing: ${description}${NC}"
    echo "Endpoint: ${endpoint}"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "${endpoint}" \
            -H "Content-Type: application/json" \
            -d "${data}" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" "${endpoint}" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✓ Success (HTTP ${http_code})${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
        return 0
    else
        echo -e "${RED}✗ Failed (HTTP ${http_code})${NC}"
        echo "$body"
        return 1
    fi
}

# Function to run all checks
run_checks() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "========================================" | tee -a "$LOG_FILE"
    echo "API Health Check - $timestamp" | tee -a "$LOG_FILE"
    echo "========================================" | tee -a "$LOG_FILE"
    
    local failed=0
    
    # Health check
    if check_endpoint "${API_BASE_URL}/health" "Health Check" 2>&1 | tee -a "$LOG_FILE"; then
        echo "✓ Health check passed" >> "$LOG_FILE"
    else
        echo "✗ Health check failed" >> "$LOG_FILE"
        failed=$((failed + 1))
    fi
    
    # Database health
    if check_endpoint "${API_BASE_URL}/api/v1/db/health" "Database Health" 2>&1 | tee -a "$LOG_FILE"; then
        echo "✓ Database health check passed" >> "$LOG_FILE"
    else
        echo "✗ Database health check failed" >> "$LOG_FILE"
        failed=$((failed + 1))
    fi
    
    # Database status
    if check_endpoint "${API_BASE_URL}/api/v1/db/status" "Database Status" 2>&1 | tee -a "$LOG_FILE"; then
        echo "✓ Database status check passed" >> "$LOG_FILE"
    else
        echo "✗ Database status check failed" >> "$LOG_FILE"
        failed=$((failed + 1))
    fi
    
    # AI chat endpoint (basic test)
    local chat_data='{"messages":[{"role":"user","content":"Hello"}]}'
    if check_endpoint "${API_BASE_URL}/api/v1/ai/chat" "AI Chat" "POST" "$chat_data" 2>&1 | tee -a "$LOG_FILE"; then
        echo "✓ AI chat check passed" >> "$LOG_FILE"
    else
        echo "✗ AI chat check failed" >> "$LOG_FILE"
        failed=$((failed + 1))
    fi
    
    echo "" | tee -a "$LOG_FILE"
    if [ $failed -eq 0 ]; then
        echo -e "${GREEN}All checks passed!${NC}" | tee -a "$LOG_FILE"
    else
        echo -e "${RED}$failed check(s) failed!${NC}" | tee -a "$LOG_FILE"
    fi
    echo "" | tee -a "$LOG_FILE"
    
    return $failed
}

# Main execution
echo "PMERIT API Monitoring"
echo "====================="
echo "API Base URL: $API_BASE_URL"
echo "Check Interval: ${INTERVAL}s ($(($INTERVAL / 60)) minutes)"
echo "Log File: $LOG_FILE"
echo ""
echo "Press Ctrl+C to stop monitoring"
echo ""

# Run initial check
run_checks

# If interval is specified, run continuously
if [ "$INTERVAL" -gt 0 ]; then
    echo "Waiting ${INTERVAL}s until next check..."
    while true; do
        sleep "$INTERVAL"
        run_checks
        echo "Waiting ${INTERVAL}s until next check..."
    done
fi
