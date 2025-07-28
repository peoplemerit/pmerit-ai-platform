#!/bin/bash
# =================================================================
# Authentication Database Port Fix - Use Working Port 5434
# =================================================================

echo "🔧 FIXING AUTHENTICATION DATABASE CONNECTION"
echo "============================================="

# Navigate to your platform directory
cd ~/pmerit-ai-platform

# Stop the current API server (if running)
echo "⏹️ Stopping current API server..."
pkill -f "uvicorn.*auth" 2>/dev/null || echo "API not currently running"

# Update API configuration to use working port 5434
echo "🔄 Updating API database configuration..."

# Update the main API file to use port 5434
if [ -f "api/auth/main.py" ]; then
    # Update database connection to use working port
    sed -i 's/15432/5434/g' api/auth/main.py
    echo "✅ Updated main.py to use port 5434"
fi

# Update startup script
if [ -f "api/start_auth_api.sh" ]; then
    sed -i 's/15432/5434/g' api/start_auth_api.sh
    echo "✅ Updated startup script to use port 5434"
fi

# Update any configuration files
find api/ -name "*.py" -o -name "*.sh" -o -name "*.json" | xargs grep -l "15432" | while read file; do
    sed -i 's/15432/5434/g' "$file"
    echo "✅ Updated $file to use port 5434"
done

# Verify database is running on port 5434
echo "🔍 Verifying database connection..."
docker ps | grep pmerit-ai-db || echo "❌ AI Database not running"

# Create a simple database connection test
cat > test_db_connection.py << 'EOF'
#!/usr/bin/env python3
import psycopg2
import sys

try:
    # Test connection to AI database on port 5434
    conn = psycopg2.connect(
        host="localhost",
        port="5434",
        database="pmerit_ai",
        user="pmerit_admin",
        password="pmerit_secure_2024"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    result = cursor.fetchone()
    print(f"✅ Database connection successful!")
    print(f"📊 PostgreSQL version: {result[0][:50]}...")
    
    # Test if we can create authentication tables
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            is_active BOOLEAN DEFAULT true,
            tier_level INTEGER DEFAULT 2,
            created_at TIMESTAMP DEFAULT NOW()
        );
    """)
    
    cursor.execute("""
        INSERT INTO users (email, username, password_hash, tier_level) 
        VALUES ('admin@pmerit.com', 'super_admin', 'admin123', 1)
        ON CONFLICT (email) DO NOTHING;
    """)
    
    conn.commit()
    print("✅ Authentication tables ready!")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    sys.exit(1)
EOF

# Make test script executable and run it
chmod +x test_db_connection.py
python3 test_db_connection.py

echo ""
echo "🚀 READY TO START AUTHENTICATION API"
echo "===================================="
echo "Next steps:"
echo "1. ./api/start_auth_api.sh"
echo "2. Test portal login with admin@pmerit.com/admin123"
echo "3. Verify authentication system is working"
