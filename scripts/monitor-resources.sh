#!/bin/bash

echo "🖥️ Gabriel AI Platform - Resource Monitoring"
echo "============================================"
echo ""

# System resources
echo "💻 System Resources:"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')%"
echo "Memory Usage: $(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')"
echo "Disk Usage: $(df -h / | awk 'NR==2{printf "%s", $5}')"
echo ""

# Container resources
echo "🐳 Container Resources:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}"

echo ""
echo "🔗 Service Health Check:"
for port in {8000..8010}; do
    if curl -s http://localhost:$port/health > /dev/null; then
        echo "✅ Port $port: HEALTHY"
    else
        echo "❌ Port $port: DOWN"
    fi
done

# Migration trigger check
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')

if (( $(echo "$CPU_USAGE > 85" | bc -l 2>/dev/null || echo "0") )) || (( $MEMORY_USAGE > 80 )); then
    echo ""
    echo "⚠️ WARNING: High resource usage detected!"
    echo "Consider migrating to Dell PowerEdge R740 server"
    echo "CPU: ${CPU_USAGE}% | Memory: ${MEMORY_USAGE}%"
fi
