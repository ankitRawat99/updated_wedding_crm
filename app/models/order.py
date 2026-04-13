from datetime import datetime
from typing import Optional, Dict, Any, List
from app.core.database import get_database

class OrderModel:
    def __init__(self):
        self.db = get_database()
        self.collection = "orders"
    
    async def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        return self.db.insert_one(self.collection, order_data)
    
    async def get_order_by_id(self, order_id: str) -> Optional[Dict[str, Any]]:
        # Try different ID fields for flexibility
        order = self.db.find_one(self.collection, {"order_info.id": order_id})
        if not order:
            order = self.db.find_one(self.collection, {"_id": order_id})
        if not order:
            order = self.db.find_one(self.collection, {"id": order_id})
        return order
    
    async def get_all_orders(self) -> List[Dict[str, Any]]:
        return self.db.find(self.collection)
    
    async def update_order(self, order_id: str, update_data: Dict[str, Any]) -> bool:
        # Try different ID fields
        updated = self.db.update_one(
            self.collection, 
            {"order_info.id": order_id}, 
            {"$set": update_data}
        )
        if not updated:
            updated = self.db.update_one(
                self.collection, 
                {"_id": order_id}, 
                {"$set": update_data}
            )
        return updated
    
    async def delete_order(self, order_id: str) -> bool:
        deleted = self.db.delete_one(self.collection, {"order_info.id": order_id})
        if not deleted:
            deleted = self.db.delete_one(self.collection, {"_id": order_id})
        return deleted
    
    async def get_orders_count(self) -> int:
        return self.db.count_documents(self.collection)
    
    async def get_orders_by_client(self, client_id: str) -> List[Dict[str, Any]]:
        return self.db.find(self.collection, {"client_id": client_id})