#!/bin/bash
# =================================================================
# Database Setup Fix - Create Authentication Tables in AI Database
# =================================================================

echo "🔧 FIXING DATABASE SETUP FOR AUTHENTICATION"
echo "==========================================="

# Stop the API temporarily
echo "⏹️ Stopping API server..."
pkill -f "uvicorn.*auth" 2>/dev/null

# Connect to the working AI database and set up authentication tables
echo "🗄️ Setting up authentication tables in AI database..."

# Create authentication setup SQL
cat > setup_auth_tables.sql << 'EOF'
-- Create authentication tables in the AI database
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    tier_level INTEGER DEFAULT 2,
    admin_privileges JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table for JWT token management
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user (use simple password for now)
INSERT INTO users (email, username, password_hash, tier_level, admin_privileges) 
VALUES (
    'admin@pmerit.com', 
    'super_admin', 
    'admin123',  -- Simple password for testing
    1,  -- Tier 1 admin
    '{"user_management": true, "system_settings": true, "tier2_access": true}'
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    tier_level = EXCLUDED.tier_level,
    admin_privileges = EXCLUDED.admin_privileges;

-- Verify setup
SELECT 'Authentication tables created successfully!' as status;
SELECT email, username, tier_level FROM users WHERE email = 'admin@pmerit.com';
EOF

# Execute the SQL setup
echo "📋 Creating authentication tables..."
docker exec -i pmerit-ai-db psql -U pmerit_admin -d pmerit_ai < setup_auth_tables.sql

# Verify the setup worked
echo "🔍 Verifying authentication setup..."
docker exec pmerit-ai-db psql -U pmerit_admin -d pmerit_ai -c "SELECT email, tier_level FROM users WHERE email = 'admin@pmerit.com';"

# Update API configuration to use pmerit_ai database instead of pmerit_core
echo "🔄 Updating API to use pmerit_ai database..."

# Find and update database name in API files
find ~/pmerit-ai-platform/api -name "*.py" | xargs grep -l "pmerit_core" | while read file; do
    sed -i 's/pmerit_core/pmerit_ai/g' "$file"
    echo "✅ Updated $file to use pmerit_ai database"
done

# Create a simple API configuration that works
cat > ~/pmerit-ai-platform/api/auth/database.py << 'EOF'
import psycopg2
from psycopg2.extras import RealDictCursor
import os

DATABASE_CONFIG = {
    'host': 'localhost',
    'port': '5434',
    'database': 'pmerit_ai',
    'user': 'pmerit_admin',
    'password': 'pmerit_secure_2024'
}

def get_db_connection():
    """Get database connection"""
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def verify_user(email, password):
    """Simple user verification for testing"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            "SELECT id, email, username, tier_level, admin_privileges FROM users WHERE email = %s AND password_hash = %s",
            (email, password)
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        return dict(user) if user else None
    except Exception as e:
        print(f"User verification error: {e}")
        return None
EOF

echo ""
echo "✅ DATABASE SETUP COMPLETE!"
echo "=========================="
echo "📊 Configuration:"
echo "   - Database: pmerit_ai (port 5434)"
echo "   - Tables: users, user_sessions created"
echo "   - Admin user: admin@pmerit.com / admin123"
echo "   - Tier level: 1 (Super Admin)"
echo ""
echo "🚀 Ready to restart API server!"
echo "Run: ./api/start_auth_api.sh"
