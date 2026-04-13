import bcrypt
import json

password = "admin123"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

user_data = [{
    "_id": "admin-001",
    "username": "admin",
    "password_hash": hashed.decode('utf-8'),
    "role": "superadmin",
    "permissions": {
        "view_financial": True,
        "full_access": True
    },
    "created_at": "2024-01-01T00:00:00"
}]

with open('data/users.json', 'w') as f:
    json.dump(user_data, f, indent=2)

print("Admin user created!")
print("Username: admin")
print("Password: admin123")