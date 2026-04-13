from datetime import datetime
from typing import Optional, Dict, Any, List
from app.core.database import get_database

class UserModel:
    def __init__(self):
        self.db = get_database()
        self.collection = "users"
    
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        return self.db.insert_one(self.collection, user_data)
    
    async def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        return self.db.find_one(self.collection, {"username": username})
    
    async def get_all_users(self) -> List[Dict[str, Any]]:
        users = self.db.find(self.collection)
        # Remove password fields from response
        for user in users:
            user.pop("password_hash", None)
            user.pop("password", None)
        return users
    
    async def update_user(self, username: str, update_data: Dict[str, Any]) -> bool:
        return self.db.update_one(
            self.collection, 
            {"username": username}, 
            {"$set": update_data}
        )
    
    async def delete_user(self, username: str) -> bool:
        return self.db.delete_one(self.collection, {"username": username})
    
    async def count_documents(self, query: Dict[str, Any] = None) -> int:
        return self.db.count_documents(self.collection, query)