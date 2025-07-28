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
