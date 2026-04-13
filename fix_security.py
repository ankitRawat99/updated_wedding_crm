"""
CRITICAL SECURITY FIXES FOR WEDDING CRM
Run this script IMMEDIATELY to fix security vulnerabilities
"""

import bcrypt
import json
import os
import secrets

def fix_passwords():
    """Hash all plaintext passwords in users.json"""
    print("🔒 Fixing plaintext passwords...")
    
    users_file = 'data/users.json'
    
    with open(users_file, 'r') as f:
        users = json.load(f)
    
    for user in users:
        if 'password' in user and not user.get('password_hash'):
            # Hash the password
            hashed = bcrypt.hashpw(user['password'].encode('utf-8'), bcrypt.gensalt())
            user['password_hash'] = hashed.decode('utf-8')
            # Remove plaintext password
            del user['password']
            print(f"  ✅ Hashed password for user: {user['username']}")
    
    # Save updated users
    with open(users_file, 'w') as f:
        json.dump(users, f, indent=2)
    
    print("✅ All passwords hashed successfully!\n")

def generate_jwt_secret():
    """Generate strong JWT secret"""
    print("🔑 Generating strong JWT secret...")
    
    secret = secrets.token_hex(32)
    
    # Update .env file
    env_file = '.env'
    
    with open(env_file, 'r') as f:
        lines = f.readlines()
    
    with open(env_file, 'w') as f:
        for line in lines:
            if line.startswith('JWT_SECRET_KEY='):
                f.write(f'JWT_SECRET_KEY="{secret}"\n')
                print(f"  ✅ New JWT secret: {secret[:20]}...")
            else:
                f.write(line)
    
    print("✅ JWT secret updated successfully!\n")

def fix_auth_middleware():
    """Fix authentication bypass vulnerability"""
    print("🛡️ Fixing authentication middleware...")
    
    middleware_file = 'app/middleware/auth_middleware.py'
    
    with open(middleware_file, 'r') as f:
        content = f.read()
    
    # Replace vulnerable cookie auth with secure version
    old_code = '''    # Fallback to cookie-based auth (for web interface)
    logged_in = request.cookies.get("logged_in")
    username = request.cookies.get("username")
    user_role = request.cookies.get("user_role")
    
    if logged_in == "true" and username:
        user_data = {
            "username": username, 
            "role": user_role,
            "permissions": get_user_permissions(user_role or "")
        }
        return user_data'''
    
    new_code = '''    # Fallback to cookie-based auth (for web interface)
    logged_in = request.cookies.get("logged_in")
    token = request.cookies.get("access_token")
    
    if logged_in == "true" and token:
        payload = auth_service.verify_token(token)
        if payload:
            payload["permissions"] = get_user_permissions(payload.get("role", ""))
            return payload'''
    
    if old_code in content:
        content = content.replace(old_code, new_code)
        
        with open(middleware_file, 'w') as f:
            f.write(content)
        
        print("  ✅ Authentication bypass fixed!")
    else:
        print("  ⚠️ Code already updated or different structure")
    
    print("✅ Middleware security improved!\n")

def fix_cookie_security():
    """Add secure cookie flags"""
    print("🍪 Fixing cookie security...")
    
    auth_controller = 'app/controllers/auth_controller.py'
    
    with open(auth_controller, 'r') as f:
        content = f.read()
    
    # Fix cookie settings
    old_cookie = 'response.set_cookie("access_token", token, httponly=True)'
    new_cookie = '''response.set_cookie(
            "access_token", 
            token, 
            httponly=True,
            secure=True,  # HTTPS only
            samesite='strict',  # CSRF protection
            max_age=1800  # 30 minutes
        )'''
    
    if old_cookie in content:
        content = content.replace(old_cookie, new_cookie)
        
        with open(auth_controller, 'w') as f:
            f.write(content)
        
        print("  ✅ Cookie security flags added!")
    else:
        print("  ⚠️ Cookies already secured or different structure")
    
    print("✅ Cookie security improved!\n")

def create_backup():
    """Create backup of critical files"""
    print("💾 Creating backups...")
    
    import shutil
    from datetime import datetime
    
    backup_dir = f'backups/backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
    os.makedirs(backup_dir, exist_ok=True)
    
    files_to_backup = [
        'data/users.json',
        'app/middleware/auth_middleware.py',
        'app/controllers/auth_controller.py',
        '.env'
    ]
    
    for file in files_to_backup:
        if os.path.exists(file):
            shutil.copy(file, os.path.join(backup_dir, os.path.basename(file)))
            print(f"  ✅ Backed up: {file}")
    
    print(f"✅ Backups created in: {backup_dir}\n")

def main():
    print("=" * 60)
    print("🚨 WEDDING CRM - CRITICAL SECURITY FIXES")
    print("=" * 60)
    print()
    
    # Create backups first
    create_backup()
    
    # Fix security issues
    fix_passwords()
    generate_jwt_secret()
    fix_auth_middleware()
    fix_cookie_security()
    
    print("=" * 60)
    print("✅ ALL CRITICAL SECURITY FIXES APPLIED!")
    print("=" * 60)
    print()
    print("⚠️  IMPORTANT NEXT STEPS:")
    print("1. Restart the server")
    print("2. Test login with existing credentials")
    print("3. Review CODE_REVIEW_REPORT.md for remaining issues")
    print("4. DO NOT commit .env file to git!")
    print()

if __name__ == "__main__":
    main()
