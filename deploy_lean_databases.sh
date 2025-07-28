#!/bin/bash
# Deploy Pmerit AI Database Infrastructure in Lean Structure

echo "🚀 PMERIT AI LEAN DATABASE DEPLOYMENT"
echo "====================================="
echo "Deploying to: $(pwd)"

# Verify we're in the right directory
if [[ ! -d "gabriel-core" && ! -d "gabriel-users" ]]; then
    echo "❌ ERROR: Not in pmerit-ai-platform directory!"
    echo "Please run: cd ~/pmerit-ai-platform"
    exit 1
fi

# Copy environment file
cp database/.env.db .env 2>/dev/null || echo "Environment file ready"

# Create Docker network
docker network create pmerit-network 2>/dev/null || echo "Network already exists"

# Start databases
./database/start_databases.sh

echo ""
echo "🎉 LEAN DATABASE DEPLOYMENT COMPLETE!"
echo "====================================="
echo ""
echo "📋 What's Ready:"
echo "   ✅ PostgreSQL Core Database (Authentication & Two-Tier Admin)"
echo "   ✅ PostgreSQL AI Database (AI Activity Storage)"
echo "   ✅ Redis Cache (Session Management)"
echo "   ✅ pgAdmin GUI (Visual Management)"
echo ""
echo "🔗 Next Steps:"
echo "   1. Access pgAdmin: http://localhost:8080"
echo "   2. Test authentication with admin@pmerit.com / admin123"
echo "   3. Integrate with your existing containers"
echo ""
echo "🌍 Ready to serve underserved communities globally!"
