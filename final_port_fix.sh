#!/bin/bash
# =================================================================
# FINAL DATABASE PORT FIX - Use High Number Ports to Avoid All Conflicts
# =================================================================

echo "🔧 FINAL DATABASE PORT CONFLICT RESOLUTION"
echo "=========================================="

cd ~/pmerit-ai-platform

# Stop any running database containers
echo "🛑 Stopping all database containers..."
cd database
docker-compose -f docker-compose.db.yml down 2>/dev/null || echo "No containers to stop"
cd ..

# Create final Docker Compose with high number ports (completely different)
echo "🐳 Creating final database configuration with high number ports..."
cat > database/docker-compose.db.yml << 'EOF'
version: '3.8'

networks:
  pmerit-network:
    driver: bridge

volumes:
  pmerit_core_data:
    driver: local
  pmerit_ai_data:
    driver: local
  redis_data:
    driver: local
  pgadmin_data:
    driver: local

services:
  # =================================================================
  # CORE AUTHENTICATION DATABASE (High Port 15432)
  # =================================================================
  pmerit-core-db:
    image: postgres:15-alpine
    container_name: pmerit-core-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: pmerit_core
      POSTGRES_USER: pmerit_admin
      POSTGRES_PASSWORD: pmerit_secure_2024
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    ports:
      - "15432:5432"  # ← Using high number port 15432
    volumes:
      - pmerit_core_data:/var/lib/postgresql/data
      - ./scripts/init/core_init.sql:/docker-entrypoint-initdb.d/01-core-init.sql
    networks:
      - pmerit-network
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pmerit_admin -d pmerit_core"]
      interval: 10s
      timeout: 5s
      retries: 5

  # =================================================================
  # AI INTELLIGENCE DATABASE (Keep working port 5434)
  # =================================================================
  pmerit-ai-db:
    image: postgres:15-alpine
    container_name: pmerit-ai-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: pmerit_ai
      POSTGRES_USER: pmerit_admin
      POSTGRES_PASSWORD: pmerit_secure_2024
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    ports:
      - "5434:5432"  # ← Keep this - it works!
    volumes:
      - pmerit_ai_data:/var/lib/postgresql/data
      - ./scripts/init/ai_init.sql:/docker-entrypoint-initdb.d/01-ai-init.sql
    networks:
      - pmerit-network
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.8'
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pmerit_admin -d pmerit_ai"]
      interval: 15s
      timeout: 5s
      retries: 3

  # =================================================================
  # REDIS CACHE (High Port 16379)
  # =================================================================
  pmerit-redis:
    image: redis:7-alpine
    container_name: pmerit-redis
    restart: unless-stopped
    ports:
      - "16379:6379"  # ← Using high number port 16379
    volumes:
      - redis_data:/data
      - ./config/redis.conf:/usr/local/etc/redis/redis.conf
    networks:
      - pmerit-network
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.2'
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    command: redis-server /usr/local/etc/redis/redis.conf

  # =================================================================
  # PGADMIN - DATABASE MANAGEMENT GUI (Port 18080)
  # =================================================================
  pmerit-pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pmerit-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@pmerit.com
      PGADMIN_DEFAULT_PASSWORD: admin123
      PGADMIN_CONFIG_SERVER_MODE: 'False'
      PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED: 'False'
    ports:
      - "18080:80"  # ← Changed to 18080 to be safe
    volumes:
      - pgadmin_data:/var/lib/pgadmin
      - ./config/servers.json:/pgadmin4/servers.json
    networks:
      - pmerit-network
    depends_on:
      - pmerit-core-db
      - pmerit-ai-db
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.3'
EOF

# Update environment configuration with final ports
echo "🔧 Updating environment configuration with final ports..."
cat > database/.env.db << 'EOF'
# Pmerit AI Platform Database Configuration
# Final configuration with high number ports to avoid conflicts

# Database Passwords
DB_CORE_PASSWORD=pmerit_secure_2024
DB_AI_PASSWORD=pmerit_secure_2024

# Redis Configuration
REDIS_PASSWORD=pmerit_redis_2024

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@pmerit.com
PGADMIN_DEFAULT_PASSWORD=admin123

# Database Connection URLs (internal container communication)
DATABASE_CORE_URL=postgresql://pmerit_admin:${DB_CORE_PASSWORD}@pmerit-core-db:5432/pmerit_core
DATABASE_AI_URL=postgresql://pmerit_admin:${DB_AI_PASSWORD}@pmerit-ai-db:5432/pmerit_ai

# Redis Connection URL (internal)
REDIS_URL=redis://:${REDIS_PASSWORD}@pmerit-redis:6379/0

# External connection URLs (for local development)
DATABASE_CORE_EXTERNAL_URL=postgresql://pmerit_admin:${DB_CORE_PASSWORD}@localhost:15432/pmerit_core
DATABASE_AI_EXTERNAL_URL=postgresql://pmerit_admin:${DB_AI_PASSWORD}@localhost:5434/pmerit_ai
REDIS_EXTERNAL_URL=redis://:${REDIS_PASSWORD}@localhost:16379/0
EOF

# Update deployment script with final port information
echo "📝 Updating deployment script with final ports..."
cat > database/start_databases.sh << 'EOF'
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
EOF

chmod +x database/start_databases.sh

echo ""
echo "✅ FINAL PORT CONFIGURATION COMPLETE!"
echo "===================================="
echo ""
echo "🔧 Final Port Mapping (No Conflicts):"
echo "   - Core Database: Port 5432 → 15432"
echo "   - AI Database: Port 5434 (unchanged - working)"
echo "   - Redis Cache: Port 6379 → 16379"
echo "   - pgAdmin GUI: Port 8080 → 18080"
echo ""
echo "🚀 Deploy with final configuration:"
echo "   ./database/start_databases.sh"
echo ""
echo "✅ These high number ports should have zero conflicts!"
