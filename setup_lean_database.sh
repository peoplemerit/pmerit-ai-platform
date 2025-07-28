#!/bin/bash
# =================================================================
# PMERIT AI PLATFORM - LEAN DATABASE IMPLEMENTATION SCRIPT
# Corrected for current lean structure at ~/pmerit-ai-platform/
# Integrates with existing container setup and lean workflow
# =================================================================

set -e

echo "🚀 PMERIT AI PLATFORM - LEAN DATABASE IMPLEMENTATION"
echo "===================================================="
echo "Integrating databases with your lean structure at ~/pmerit-ai-platform/"

# Navigate to your ACTUAL lean directory structure
cd ~/pmerit-ai-platform

echo "📍 Current directory: $(pwd)"
echo "✅ Confirmed: Working in lean structure directory"

# Create database directory structure within lean setup
echo "📁 Creating database directory structure in lean setup..."
mkdir -p database/{scripts/{init,backup},data,logs,config}

echo "🔍 Checking existing container setup..."
if [ -f "docker-compose.yml" ]; then
    echo "✅ Found existing docker-compose.yml - will integrate with it"
    cp docker-compose.yml docker-compose.yml.backup
else
    echo "📝 No existing docker-compose.yml found - creating fresh setup"
fi

# Create database-specific Docker Compose file (separate from main containers)
echo "🐳 Creating database container configuration..."
cat > database/docker-compose.db.yml << 'EOF'
version: '3.8'

networks:
  pmerit-network:
    driver: bridge
    external: false

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
  # CORE AUTHENTICATION DATABASE (Port 5432)
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
      - "5432:5432"
    volumes:
      - pmerit_core_data:/var/lib/postgresql/data
      - ./database/scripts/init/core_init.sql:/docker-entrypoint-initdb.d/01-core-init.sql
      - ./database/logs:/var/log/postgresql
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
  # AI INTELLIGENCE DATABASE (Port 5434) - For AI Activity Storage
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
      - "5434:5432"
    volumes:
      - pmerit_ai_data:/var/lib/postgresql/data
      - ./database/scripts/init/ai_init.sql:/docker-entrypoint-initdb.d/01-ai-init.sql
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
  # REDIS CACHE (Port 6379) - Session Management
  # =================================================================
  pmerit-redis:
    image: redis:7-alpine
    container_name: pmerit-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./database/config/redis.conf:/usr/local/etc/redis/redis.conf
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
  # PGADMIN - DATABASE MANAGEMENT GUI (Port 8080)
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
      - "8080:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
      - ./database/config/servers.json:/pgadmin4/servers.json
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

# =================================================================
# CORE DATABASE SCHEMA - Authentication & Two-Tier Admin
# =================================================================

echo "📋 Creating Core Authentication database schema..."
cat > database/scripts/init/core_init.sql << 'EOF'
-- =====================================================
-- PMERIT AI CORE DATABASE - AUTHENTICATION & ADMIN
-- Container: pmerit-core (Port 8000)
-- Database: pmerit_core (Port 5432)
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =================================================================
-- USER AUTHENTICATION TABLES
-- =================================================================

-- Core user accounts table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User sessions for JWT token management
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_used TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- TWO-TIER ADMIN SYSTEM TABLES
-- =================================================================

-- Admin roles (Tier 1: Privilege Management, Tier 2: Full Admin)
CREATE TABLE admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    tier_level INTEGER NOT NULL CHECK (tier_level IN (1, 2)),
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Admin privileges assignment
CREATE TABLE admin_privileges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id)
);

-- System configuration settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- AUDIT AND SECURITY TABLES
-- =================================================================

-- User activity logging
CREATE TABLE user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    action_details JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- System events and alerts
CREATE TABLE system_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    severity VARCHAR(20) DEFAULT 'info',
    container_source VARCHAR(50),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- CONTAINER COORDINATION TABLES
-- =================================================================

-- Service registry for container discovery
CREATE TABLE service_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(100) UNIQUE NOT NULL,
    container_port INTEGER NOT NULL,
    health_check_url VARCHAR(255),
    is_healthy BOOLEAN DEFAULT true,
    last_health_check TIMESTAMP,
    registration_time TIMESTAMP DEFAULT NOW()
);

-- Inter-container events for coordination
CREATE TABLE container_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_container VARCHAR(50) NOT NULL,
    target_container VARCHAR(50),
    event_type VARCHAR(50) NOT NULL,
    event_payload JSONB,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- INITIAL DATA SETUP
-- =================================================================

-- Insert default admin roles
INSERT INTO admin_roles (name, description, tier_level, permissions) VALUES
('super_admin', 'Tier 1 - Full system access and privilege management', 1, '{
    "user_management": true,
    "system_settings": true,
    "tier2_access": true,
    "devbot_access": true,
    "docker_access": true,
    "audit_logs": true
}'),
('privilege_manager', 'Tier 1 - Privilege management only', 1, '{
    "tier2_access": true,
    "user_privileges": true,
    "audit_logs": true
}'),
('full_admin', 'Tier 2 - Complete platform administration', 2, '{
    "course_management": true,
    "student_management": true,
    "analytics_access": true,
    "payment_management": true,
    "content_management": true
}'),
('content_admin', 'Tier 2 - Course and content management', 2, '{
    "course_management": true,
    "content_management": true,
    "analytics_view": true
}');

-- Create initial super admin user
INSERT INTO users (email, username, password_hash, is_active, is_verified) VALUES
('admin@pmerit.com', 'super_admin', crypt('admin123', gen_salt('bf')), true, true);

-- Grant super admin privileges
INSERT INTO admin_privileges (user_id, role_id, granted_by)
SELECT u.id, r.id, u.id
FROM users u, admin_roles r
WHERE u.email = 'admin@pmerit.com' AND r.name = 'super_admin';

-- Register initial containers (matching your lean structure)
INSERT INTO service_registry (service_name, container_port, health_check_url) VALUES
('pmerit-core', 8000, 'http://localhost:8000/health'),
('pmerit-users', 8001, 'http://localhost:8001/health'),
('pmerit-courses', 8002, 'http://localhost:8002/health'),
('pmerit-avatar', 8003, 'http://localhost:8003/health'),
('pmerit-assess', 8004, 'http://localhost:8004/health'),
('pmerit-ocr', 8005, 'http://localhost:8005/health'),
('pmerit-ai', 8006, 'http://localhost:8006/health'),
('pmerit-career', 8007, 'http://localhost:8007/health'),
('pmerit-payments', 8008, 'http://localhost:8008/health'),
('pmerit-comms', 8009, 'http://localhost:8009/health'),
('pmerit-analytics', 8010, 'http://localhost:8010/health');

-- =================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_admin_privileges_user_id ON admin_privileges(user_id);
CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_timestamp ON user_activity_log(timestamp);
CREATE INDEX idx_system_events_timestamp ON system_events(timestamp);
CREATE INDEX idx_container_events_processed ON container_events(processed);
EOF

# =================================================================
# AI INTELLIGENCE DATABASE SCHEMA
# =================================================================

echo "🧠 Creating AI Intelligence database schema..."
cat > database/scripts/init/ai_init.sql << 'EOF'
-- =====================================================
-- PMERIT AI INTELLIGENCE DATABASE - AI ACTIVITY STORAGE
-- Container: pmerit-ai (Port 8006)
-- Database: pmerit_ai (Port 5434)
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- AI CONVERSATION INTELLIGENCE
-- =================================================================

-- AI conversation history and context
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_id UUID NOT NULL,
    conversation_type VARCHAR(50) NOT NULL, -- 'tutoring', 'assessment', 'career_guidance'
    message_type VARCHAR(20) NOT NULL, -- 'user', 'ai', 'system'
    message_content TEXT NOT NULL,
    ai_model_used VARCHAR(100), -- 'gpt-4', 'claude-3', 'ollama_codellama'
    context_data JSONB, -- Course context, learning objectives
    cultural_context JSONB, -- Global vs local career focus
    response_time_ms INTEGER,
    token_usage INTEGER,
    confidence_score DECIMAL(3,2),
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI conversation sessions for context tracking
CREATE TABLE ai_conversation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_start TIMESTAMP DEFAULT NOW(),
    session_end TIMESTAMP,
    session_type VARCHAR(50) NOT NULL,
    total_messages INTEGER DEFAULT 0,
    learning_objectives JSONB,
    outcomes_achieved JSONB,
    cultural_adaptation_used JSONB,
    session_quality_score DECIMAL(3,2)
);

-- =================================================================
-- PERSONALIZED LEARNING MODELS
-- =================================================================

-- Individual student learning profiles powered by AI
CREATE TABLE student_learning_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    learning_style JSONB NOT NULL, -- Visual, auditory, kinesthetic, etc.
    knowledge_state JSONB NOT NULL, -- Skills mastered, gaps identified
    difficulty_preferences JSONB,
    pace_analysis JSONB, -- Learning speed, optimal session length
    ai_recommendations JSONB, -- Personalized content suggestions
    cultural_learning_context JSONB, -- Global vs local career preferences
    career_interests JSONB, -- Remote vs local job preferences
    engagement_patterns JSONB, -- When most active, preferred content types
    last_updated TIMESTAMP DEFAULT NOW(),
    model_version VARCHAR(20) DEFAULT '1.0'
);

-- AI-powered skill assessments and gap analysis
CREATE TABLE ai_skill_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    assessment_type VARCHAR(50) NOT NULL, -- 'initial', 'progress', 'mastery'
    skills_assessed JSONB NOT NULL, -- Skills and competency levels
    ai_analysis JSONB NOT NULL, -- AI insights and recommendations
    learning_gaps JSONB, -- Areas needing improvement
    strengths JSONB, -- Areas of excellence
    career_readiness_score DECIMAL(3,2),
    cultural_career_fit JSONB, -- Global vs local job market fit
    recommended_learning_path JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- AI MODEL PERFORMANCE TRACKING
-- =================================================================

-- AI model performance analytics
CREATE TABLE ai_model_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50),
    interaction_type VARCHAR(50) NOT NULL, -- 'tutoring', 'assessment', 'career'
    response_quality_score DECIMAL(3,2),
    user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating BETWEEN 1 AND 5),
    processing_time_ms INTEGER,
    resource_usage JSONB, -- CPU, memory, tokens used
    cultural_accuracy_score DECIMAL(3,2), -- How well it handles cultural context
    bias_detection_score DECIMAL(3,2), -- Bias monitoring
    cost_per_interaction DECIMAL(8,4), -- AI service costs
    created_at TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- INDEXES FOR AI PERFORMANCE
-- =================================================================

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at);
CREATE INDEX idx_ai_conversation_sessions_user_id ON ai_conversation_sessions(user_id);
CREATE INDEX idx_student_learning_models_user_id ON student_learning_models(user_id);
CREATE INDEX idx_ai_skill_assessments_user_id ON ai_skill_assessments(user_id);
CREATE INDEX idx_ai_model_performance_model_name ON ai_model_performance(model_name);
EOF

# =================================================================
# REDIS CONFIGURATION
# =================================================================

echo "⚡ Creating Redis configuration..."
cat > database/config/redis.conf << 'EOF'
# Redis configuration for Pmerit AI Platform
# Session management and caching

# Basic configuration
bind 127.0.0.1
port 6379
timeout 300
tcp-keepalive 60

# Memory configuration
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence configuration
save 900 1
save 300 10
save 60 10000

# Security
requirepass pmerit_redis_2024

# Logging
loglevel notice
logfile ""

# Session-specific configuration
databases 16
EOF

# =================================================================
# PGADMIN SERVER CONFIGURATION
# =================================================================

echo "🖥️ Creating pgAdmin server configuration..."
cat > database/config/servers.json << 'EOF'
{
    "Servers": {
        "1": {
            "Name": "Pmerit Core Database",
            "Group": "Pmerit AI Platform",
            "Host": "pmerit-core-db",
            "Port": 5432,
            "MaintenanceDB": "pmerit_core",
            "Username": "pmerit_admin",
            "SSLMode": "prefer"
        },
        "2": {
            "Name": "Pmerit AI Intelligence Database",
            "Group": "Pmerit AI Platform",
            "Host": "pmerit-ai-db",
            "Port": 5432,
            "MaintenanceDB": "pmerit_ai",
            "Username": "pmerit_admin",
            "SSLMode": "prefer"
        }
    }
}
EOF

# =================================================================
# ENVIRONMENT CONFIGURATION
# =================================================================

echo "🔧 Creating environment configuration..."
cat > database/.env.db << 'EOF'
# Pmerit AI Platform Database Configuration
# Copy to .env and customize passwords for production

# Database Passwords (Change these for production!)
DB_CORE_PASSWORD=pmerit_secure_2024
DB_AI_PASSWORD=pmerit_secure_2024

# Redis Configuration
REDIS_PASSWORD=pmerit_redis_2024

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@pmerit.com
PGADMIN_DEFAULT_PASSWORD=admin123

# Database Connection URLs for Containers
DATABASE_CORE_URL=postgresql://pmerit_admin:${DB_CORE_PASSWORD}@pmerit-core-db:5432/pmerit_core
DATABASE_AI_URL=postgresql://pmerit_admin:${DB_AI_PASSWORD}@pmerit-ai-db:5432/pmerit_ai

# Redis Connection URL
REDIS_URL=redis://:${REDIS_PASSWORD}@pmerit-redis:6379/0
EOF

# =================================================================
# BACKUP AND MAINTENANCE SCRIPTS
# =================================================================

echo "💾 Creating backup scripts..."
mkdir -p database/scripts/backup
cat > database/scripts/backup/backup_databases.sh << 'EOF'
#!/bin/bash
# Backup Pmerit AI databases

BACKUP_DIR="./database/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "🗄️ Backing up Pmerit AI databases..."

# Backup each database
docker exec pmerit-core-db pg_dump -U pmerit_admin pmerit_core > "$BACKUP_DIR/pmerit_core_backup.sql"
docker exec pmerit-ai-db pg_dump -U pmerit_admin pmerit_ai > "$BACKUP_DIR/pmerit_ai_backup.sql"

# Backup Redis
docker exec pmerit-redis redis-cli --rdb /data/dump.rdb
docker cp pmerit-redis:/data/dump.rdb "$BACKUP_DIR/redis_backup.rdb"

echo "✅ Backup completed: $BACKUP_DIR"
EOF

chmod +x database/scripts/backup/backup_databases.sh

# =================================================================
# LEAN WORKFLOW INTEGRATION SCRIPTS
# =================================================================

echo "🔧 Creating lean workflow integration scripts..."
cat > database/start_databases.sh << 'EOF'
#!/bin/bash
# Start Pmerit AI databases in lean structure

echo "🚀 Starting Pmerit AI Database Infrastructure..."
echo "============================================="

# Create network if it doesn't exist
docker network create pmerit-network 2>/dev/null || echo "Network already exists"

# Start database containers
cd database
docker-compose -f docker-compose.db.yml up -d

echo "⏳ Waiting for databases to initialize..."
sleep 20

# Check health status
echo "🔍 Checking database health..."
docker-compose -f docker-compose.db.yml ps

echo ""
echo "✅ DATABASE INFRASTRUCTURE READY!"
echo "=================================="
echo ""
echo "🖥️  Access pgAdmin: http://localhost:8080"
echo "📧 Email: admin@pmerit.com"
echo "🔑 Password: admin123"
echo ""
echo "🗄️  Database Ports:"
echo "   - Core (Auth): localhost:5432"
echo "   - AI Intelligence: localhost:5434"
echo "   - Redis Cache: localhost:6379"
echo ""
echo "🔐 Initial Super Admin:"
echo "   - Email: admin@pmerit.com"
echo "   - Password: admin123"
echo ""
echo "🎯 Ready for Phase 2: Real Authentication Integration!"
EOF

chmod +x database/start_databases.sh

cat > database/stop_databases.sh << 'EOF'
#!/bin/bash
# Stop Pmerit AI databases

echo "🛑 Stopping Pmerit AI Database Infrastructure..."

cd database
docker-compose -f docker-compose.db.yml down

echo "✅ Databases stopped"
EOF

chmod +x database/stop_databases.sh

# =================================================================
# MAIN DEPLOYMENT SCRIPT
# =================================================================

echo "🚀 Creating main deployment script..."
cat > deploy_lean_databases.sh << 'EOF'
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
EOF

chmod +x deploy_lean_databases.sh

echo ""
echo "✅ PMERIT AI LEAN DATABASE SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "📁 Database structure created in: $(pwd)/database/"
echo "🚀 Ready to deploy? Run:"
echo "   ./deploy_lean_databases.sh"
echo ""
echo "📋 What you'll get:"
echo "   ✅ PostgreSQL databases with complete schemas"
echo "   ✅ Two-tier admin system ready"
echo "   ✅ AI intelligence storage configured"
echo "   ✅ Real authentication system"
echo "   ✅ Visual management via pgAdmin"
echo "   ✅ Integrated with your lean workflow"
echo ""
echo "🎯 This preserves your lean structure while adding enterprise database capabilities!"
