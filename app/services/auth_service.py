import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional, Dict, Any
from app.core.config import settings
from app.models.user import UserModel
from app.schemas.user import UserCreate, UserLogin

class AuthService:
    def __init__(self):
        self.user_model = UserModel()
    
    def hash_password(self, password: str) -> bytes:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    def verify_password(self, password: str, hashed_password) -> bool:
        if isinstance(hashed_password, str):
            hashed_password = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password)
    
    def create_access_token(self, data: Dict[str, Any]) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            return payload
        except JWTError:
            return None
    
    async def authenticate_user(self, login_data: UserLogin) -> Optional[Dict[str, Any]]:
        user = await self.user_model.get_user_by_username(login_data.username)
        if not user:
            return None
        
        # Handle both hashed and plain text passwords for backward compatibility
        password_field = user.get("password_hash") or user.get("password")
        if not password_field:
            return None
            
        # If password is plain text (for testing), compare directly
        if user.get("password") and not user.get("password_hash"):
            if login_data.password == user["password"]:
                return user
            return None
        
        # If password is hashed, verify with bcrypt
        if not self.verify_password(login_data.password, password_field):
            return None
        return user
    
    async def create_user(self, user_data: UserCreate) -> Dict[str, Any]:
        permissions = {
            "superadmin": {"view_financial": True, "full_access": True},
            "admin": {"view_financial": True, "full_access": True},
            "manager": {"view_financial": False, "full_access": False}
        }
        
        hashed_password = self.hash_password(user_data.password)
        
        user_doc = {
            "username": user_data.username,
            "password_hash": hashed_password,
            "role": user_data.role,
            "permissions": permissions.get(user_data.role, {"view_financial": False, "full_access": False})
        }
        
        return await self.user_model.create_user(user_doc)
    
    async def change_password(self, username: str, current_password: str, new_password: str) -> bool:
        user = await self.user_model.get_user_by_username(username)
        if not user or not self.verify_password(current_password, user["password_hash"]):
            return False
        
        new_password_hash = self.hash_password(new_password)
        return await self.user_model.update_user(username, {"password_hash": new_password_hash})