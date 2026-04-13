from datetime import datetime
from typing import Optional, Dict, Any, List
from app.core.database import get_database

class ClientModel:
    def __init__(self):
        self.db = get_database()
        self.collection = "clients_data"
    
    async def create_client(self, client_data: Dict[str, Any]) -> Dict[str, Any]:
        return self.db.insert_one(self.collection, client_data)
    
    async def get_client_by_id(self, client_id: str) -> Optional[Dict[str, Any]]:
        return self.db.find_one(self.collection, {"_id": client_id})
    
    async def get_all_clients(self) -> List[Dict[str, Any]]:
        return self.db.find(self.collection)
    
    async def update_client(self, client_id: str, update_data: Dict[str, Any]) -> bool:
        return self.db.update_one(
            self.collection, 
            {"_id": client_id}, 
            {"$set": update_data}
        )
    
    async def delete_client(self, client_id: str) -> bool:
        return self.db.delete_one(self.collection, {"_id": client_id})