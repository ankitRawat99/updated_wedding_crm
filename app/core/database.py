import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

class JSONDatabase:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        os.makedirs(data_dir, exist_ok=True)
    
    def _get_file_path(self, collection: str) -> str:
        return os.path.join(self.data_dir, f"{collection}.json")
    
    def _load_collection(self, collection: str) -> List[Dict[str, Any]]:
        file_path = self._get_file_path(collection)
        if not os.path.exists(file_path):
            return []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    
    def _save_collection(self, collection: str, data: List[Dict[str, Any]]):
        file_path = self._get_file_path(collection)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def insert_one(self, collection: str, document: Dict[str, Any]) -> Dict[str, Any]:
        data = self._load_collection(collection)
        document["_id"] = str(uuid.uuid4())
        document["created_at"] = datetime.now().isoformat()
        data.append(document)
        self._save_collection(collection, data)
        return document
    
    def find_one(self, collection: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        data = self._load_collection(collection)
        for doc in data:
            if all(doc.get(k) == v for k, v in query.items()):
                return doc
        return None
    
    def find(self, collection: str, query: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        data = self._load_collection(collection)
        if not query:
            return data
        
        result = []
        for doc in data:
            if all(doc.get(k) == v for k, v in query.items()):
                result.append(doc)
        return result
    
    def update_one(self, collection: str, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        data = self._load_collection(collection)
        for doc in data:
            if all(doc.get(k) == v for k, v in query.items()):
                if "$set" in update:
                    doc.update(update["$set"])
                if "$unset" in update:
                    for key in update["$unset"]:
                        doc.pop(key, None)
                doc["updated_at"] = datetime.now().isoformat()
                self._save_collection(collection, data)
                return True
        return False
    
    def delete_one(self, collection: str, query: Dict[str, Any]) -> bool:
        data = self._load_collection(collection)
        for i, doc in enumerate(data):
            if all(doc.get(k) == v for k, v in query.items()):
                data.pop(i)
                self._save_collection(collection, data)
                return True
        return False
    
    def count_documents(self, collection: str, query: Dict[str, Any] = None) -> int:
        return len(self.find(collection, query))

# Global database instance
db = JSONDatabase()

async def connect_to_database():
    print("Connected to JSON Database")
    return True

async def close_database_connection():
    print("JSON Database connection closed")

def get_database():
    return db