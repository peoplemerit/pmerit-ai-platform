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
