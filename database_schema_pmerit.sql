-- =================================================================
-- PMERIT AI Educational Platform - Multi-Tier Database Schema
-- Updated for pmerit_admin user and pmerit_ai database
-- =================================================================

-- Connect to the pmerit_ai database
\c pmerit_ai;

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS employee_invitations CASCADE;
DROP TABLE IF EXISTS user_audit_log CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with multi-tier role system
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255), -- NULL for pending invitations
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'employee', 'student')),
    tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)), -- 1: super_admin, 2: employee, 3: student
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended', 'deactivated')),
    department VARCHAR(100), -- For employee organization
    permissions JSONB DEFAULT '{}', -- Flexible permission system
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    last_activity TIMESTAMP DEFAULT NOW(),
    
    -- Additional fields for Nigerian/US market context
    country VARCHAR(100), -- Nigeria, US, etc.
    timezone VARCHAR(50) DEFAULT 'UTC',
    preferred_language VARCHAR(10) DEFAULT 'en', -- en, ha, yo, ig for Nigerian languages
    mobile_phone VARCHAR(20),
    
    -- Audit fields
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP
);

-- Create employee invitations table for secure onboarding
CREATE TABLE employee_invitations (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    tier INTEGER NOT NULL DEFAULT 2,
    department VARCHAR(100),
    invited_by INTEGER NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Email tracking
    email_sent_at TIMESTAMP,
    email_opened_at TIMESTAMP,
    reminder_count INTEGER DEFAULT 0,
    
    -- Security
    ip_address INET,
    user_agent TEXT,
    
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Create audit log table for security and compliance
CREATE TABLE user_audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'invite_sent', 'password_change', etc.
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Context for Nigerian/US operations
    country VARCHAR(100),
    session_id VARCHAR(255)
);

-- Create user sessions table for secure session management
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_accessed TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create performance indices for fast queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_tier ON users(role, tier);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_by ON users(created_by);
CREATE INDEX idx_users_country ON users(country);

CREATE INDEX idx_invitations_token ON employee_invitations(token);
CREATE INDEX idx_invitations_email ON employee_invitations(email);
CREATE INDEX idx_invitations_invited_by ON employee_invitations(invited_by);
CREATE INDEX idx_invitations_expires_at ON employee_invitations(expires_at);

CREATE INDEX idx_audit_user_id ON user_audit_log(user_id);
CREATE INDEX idx_audit_action ON user_audit_log(action);
CREATE INDEX idx_audit_timestamp ON user_audit_log(timestamp);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);

-- Insert initial super admin user (using your existing admin email)
INSERT INTO users (
    email, 
    name, 
    password_hash, 
    role, 
    tier, 
    status, 
    country, 
    permissions,
    created_at
) VALUES (
    'admin@pmerit.com',
    'PMERIT Super Administrator',
    '$2b$12$your_actual_bcrypt_hash_here', -- Will update with real hash
    'super_admin',
    1,
    'active',
    'Global',
    '{"all": true, "employee_management": true, "system_administration": true}',
    NOW()
);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION update_user_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update timestamps
CREATE TRIGGER trigger_users_update_activity
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_activity();

-- Function to generate secure invitation tokens
CREATE OR REPLACE FUNCTION generate_invitation_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired invitations (run via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM employee_invitations 
    WHERE expires_at < NOW() AND used_at IS NULL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR is_active = FALSE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Views for common queries
CREATE VIEW active_employees AS
SELECT 
    id, email, name, department, country, created_at, last_login, last_activity
FROM users 
WHERE role = 'employee' AND tier = 2 AND status = 'active';

CREATE VIEW pending_invitations AS
SELECT 
    ei.id, ei.email, ei.name, ei.department, ei.expires_at, ei.created_at,
    u.name as invited_by_name, u.email as invited_by_email
FROM employee_invitations ei
JOIN users u ON ei.invited_by = u.id
WHERE ei.used_at IS NULL AND ei.expires_at > NOW();

-- =================================================================
-- Migration Complete for PMERIT AI Database!
-- =================================================================

