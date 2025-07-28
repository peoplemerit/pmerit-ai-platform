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
