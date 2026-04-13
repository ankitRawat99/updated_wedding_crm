#!/usr/bin/env python3
"""
Script to create default users with different roles
"""
import json
import os
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_default_users():
    users_file = "data/users.json"
    
    # Create data directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    
    # Default users with different roles
    default_users = [
        {
            "id": 1,
            "username": "superadmin",
            "password": hash_password("super123"),
            "role": "superadmin",
            "created_at": "2025-01-01T00:00:00",
            "is_active": True
        },
        {
            "id": 2,
            "username": "admin",
            "password": hash_password("admin123"),
            "role": "admin",
            "created_at": "2025-01-01T00:00:00",
            "is_active": True
        },
        {
            "id": 3,
            "username": "manager",
            "password": hash_password("manager123"),
            "role": "manager",
            "created_at": "2025-01-01T00:00:00",
            "is_active": True
        }
    ]
    
    # Write to JSON file
    with open(users_file, "w") as f:
        json.dump(default_users, f, indent=2)
    
    print("✅ Default users created successfully!")
    print("\n📋 Login Credentials:")
    print("🔹 Super Admin: superadmin / super123")
    print("   - Full access to everything")
    print("\n🔹 Admin: admin / admin123") 
    print("   - All access except global cost management")
    print("\n🔹 Manager: manager / manager123")
    print("   - No payment/financial access, no global cost management")

if __name__ == "__main__":
    create_default_users()