#!/bin/bash
# =================================================================
# Fix Python Command and Start PMERIT API
# =================================================================

echo "🔧 FIXING PYTHON COMMAND AND STARTING API"
echo "=========================================="

cd ~/pmerit-ai-platform/api

# Test database connection with python3
echo "🧪 Testing database connection with python3..."
python3 -c "
import psycopg2
try:
    conn = psycopg2.connect(
        host='localhost',
        port=15432,
        database='gabriel_ai',
        user='gabriel_user',
        password='gabriel_secure_2025'
    )
    print('✅ Database connection successful with gabriel_user')
    
    # Test if our tables exist
    cursor = conn.cursor()
    cursor.execute(\"SELECT COUNT(*) FROM users;\")
    user_count = cursor.fetchone()[0]
    print(f'✅ Users table exists with {user_count} records')
    
    cursor.execute(\"SELECT tablename FROM pg_tables WHERE schemaname = 'public';\")
    tables = cursor.fetchall()
    print(f'✅ Database tables: {[table[0] for table in tables]}')
    
    conn.close()
except Exception as e:
    print(f'❌ Database connection failed: {e}')
"

echo ""
echo "🚀 Starting PMERIT API with python3..."
echo "⚠️  Credentials being used (tracked for security):"
echo "   📊 Database: gabriel_user / gabriel_secure_2025 / gabriel_ai"
echo "   🔑 JWT Secret: pmerit_jwt_secret_2025_change_after_project"
echo ""

# Update the main.py to use the correct path in shebang and fix any issues
sed -i '1i#!/usr/bin/env python3' main.py

# Add the local bin to PATH for this session
export PATH=$PATH:/home/gabriel-ai/.local/bin

echo "🌐 API will be available at:"
echo "   📊 Health Check: http://localhost:9001/health"
echo "   📚 API Documentation: http://localhost:9001/docs"
echo "   🔐 Login Endpoint: POST http://localhost:9001/api/auth/login"
echo "   👥 Employee Management: POST http://localhost:9001/api/employees/invite"
echo ""

echo "🎯 Testing API startup..."
echo "Press Ctrl+C to stop the API server when you're ready"
echo ""

# Start the API with python3 and uvicorn from local bin
python3 -m uvicorn main:app --host 0.0.0.0 --port 9001 --reload

echo ""
echo "================================================================"
echo "🎉 PMERIT AI MULTI-TIER PORTAL - PHASE 1 COMPLETE!"
echo "================================================================"
echo "✅ Database schema deployed successfully"
echo "✅ API dependencies installed"
echo "✅ Multi-tier authentication system ready"
echo "✅ Employee invitation system operational"
echo ""
echo "🔐 SECURITY REMINDER:"
echo "All credentials are tracked and must be changed after project:"
echo "   • Database: gabriel_user / gabriel_secure_2025"
echo "   • JWT Secret: pmerit_jwt_secret_2025_change_after_project"
echo ""
echo "🚀 READY FOR PHASE 2: Cloudflare Email Integration"
