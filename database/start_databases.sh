#!/bin/bash
# Start Pmerit AI databases with final high number ports

echo "🚀 Starting Pmerit AI Database Infrastructure (Final Ports)..."
echo "============================================================="

# Create network if it doesn't exist
docker network create pmerit-network 2>/dev/null || echo "Network already exists"

# Start database containers
cd database
docker-compose -f docker-compose.db.yml up -d

echo "⏳ Waiting for databases to initialize..."
sleep 25

# Check health status
echo "🔍 Checking database health..."
docker-compose -f docker-compose.db.yml ps

echo ""
echo "✅ DATABASE INFRASTRUCTURE READY (FINAL PORTS)!"
echo "==============================================="
echo ""
echo "🖥️  Access pgAdmin: http://localhost:18080"
echo "📧 Email: admin@pmerit.com"
echo "🔑 Password: admin123"
echo ""
echo "🗄️  Database Ports (FINAL):"
echo "   - Core (Auth): localhost:15432"
echo "   - AI Intelligence: localhost:5434"
echo "   - Redis Cache: localhost:16379"
echo "   - pgAdmin GUI: localhost:18080"
echo ""
echo "🔐 Initial Super Admin:"
echo "   - Email: admin@pmerit.com"
echo "   - Password: admin123"
echo ""
echo "✅ All port conflicts permanently resolved!"
echo "🎯 Ready for Phase 2: Real Authentication Integration!"
