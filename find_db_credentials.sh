#!/bin/bash
# =================================================================
# Find Actual Database Credentials in Gabriel AI Platform
# =================================================================

echo "🔍 FINDING ACTUAL DATABASE CREDENTIALS"
echo "======================================"

# Find the PostgreSQL container
POSTGRES_CONTAINER=$(docker ps --format "{{.Names}}" | grep -E "(gabriel-db|db|postgres)" | head -1)

if [ ! -z "$POSTGRES_CONTAINER" ]; then
    echo "✅ Found PostgreSQL container: $POSTGRES_CONTAINER"
    
    echo ""
    echo "🔍 Container environment variables:"
    docker exec $POSTGRES_CONTAINER env | grep -E "(POSTGRES|DB|USER)" | head -10
    
    echo ""
    echo "📋 Let's check what users actually exist in the database:"
    
    # Try to connect and list users with different approaches
    echo "🧪 Method 1: Try connecting as various users..."
    
    # Common users to try
    for user in gabriel_user gabriel admin root pmerit; do
        echo "Testing user: $user"
        if docker exec $POSTGRES_CONTAINER psql -U $user -c "\du" 2>/dev/null; then
            echo "✅ SUCCESS: User $user works!"
            echo "📋 Available users:"
            docker exec $POSTGRES_CONTAINER psql -U $user -c "\du"
            echo ""
            echo "📋 Available databases:"
            docker exec $POSTGRES_CONTAINER psql -U $user -l
            echo ""
            echo "🎯 SOLUTION FOUND! Use this connection:"
            echo "psql -h localhost -p 15432 -U $user -d [database_name] -f database_schema.sql"
            exit 0
        fi
    done
    
    echo ""
    echo "🔍 Method 2: Check container startup logs for database creation:"
    docker logs $POSTGRES_CONTAINER 2>&1 | grep -E "(database|user|role|created)" | tail -10
    
    echo ""
    echo "🔍 Method 3: Check if we can inspect the PostgreSQL data directory:"
    docker exec $POSTGRES_CONTAINER ls -la /var/lib/postgresql/data/ 2>/dev/null || echo "Cannot access data directory"
    
    echo ""
    echo "🔍 Method 4: Try to connect without specifying a user (use container default):"
    if docker exec $POSTGRES_CONTAINER psql -c "\du" 2>/dev/null; then
        echo "✅ Default connection works!"
        docker exec $POSTGRES_CONTAINER psql -c "\du"
    else
        echo "❌ Default connection failed"
    fi
    
else
    echo "❌ No PostgreSQL container found"
    echo "📋 Available containers:"
    docker ps --format "table {{.Names}}\t{{.Image}}"
fi

echo ""
echo "================================================================"
echo "🔧 ALTERNATIVE SOLUTIONS:"
echo "================================================================"

echo ""
echo "💡 SOLUTION 1: Create the database schema in your existing database"
echo "If we found working credentials above, use them with your schema."

echo ""
echo "💡 SOLUTION 2: Use your existing Gabriel AI database structure"
echo "Let's see what tables already exist in your operational database:"

if [ ! -z "$POSTGRES_CONTAINER" ]; then
    echo "🔍 Checking existing tables..."
    # Try different users to see what tables exist
    for user in gabriel_user gabriel admin root; do
        echo "Trying user: $user"
        docker exec $POSTGRES_CONTAINER psql -U $user -c "\dt" 2>/dev/null && break
    done
fi

echo ""
echo "💡 SOLUTION 3: Create a superuser to manage the database"
cat << 'EOF'

# If you have ANY working user, you can create new users:
docker exec -it gabriel-db psql -U [WORKING_USER]

# Then create our required user:
CREATE USER pmerit_user WITH PASSWORD 'secure_password_123' CREATEDB CREATEROLE;
CREATE DATABASE pmerit_db OWNER pmerit_user;
GRANT ALL PRIVILEGES ON DATABASE pmerit_db TO pmerit_user;
\q

EOF

echo ""
echo "🎯 NEXT STEPS:"
echo "1. Look at the results above to find working credentials"
echo "2. Use those credentials to connect to your database"
echo "3. Run the schema migration with the correct user/database"
echo "4. Continue with API deployment"
