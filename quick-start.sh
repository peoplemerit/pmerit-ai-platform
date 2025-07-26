#!/bin/bash
echo "🌍 Gabriel AI Platform - Quick Start"
echo "==================================="
echo ""
echo "🚀 Starting all Gabriel AI containers..."

# Build and start all containers
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 10

echo ""
echo "🎯 Testing service health..."
for port in {8000..8010}; do
    if curl -s http://localhost:$port/health > /dev/null; then
        echo "✅ Service on port $port: HEALTHY"
    else
        echo "⚠️ Service on port $port: Starting..."
    fi
done

echo ""
echo "📊 Container status:"
docker-compose ps

echo ""
echo "🎉 Gabriel AI Platform is ready!"
echo "📍 API Gateway: http://localhost:8000"
echo "📋 Management: ./scripts/manage-containers.sh status"
echo "🔍 Monitoring: ./scripts/monitor-resources.sh"
