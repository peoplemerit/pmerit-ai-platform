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
