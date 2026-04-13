"""
Migration Helper: JSON to MongoDB
Run this script to migrate data from JSON files to MongoDB
"""
import json
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def migrate_json_to_mongodb():
    """Migrate all JSON data to MongoDB"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    
    collections = ["users", "orders", "clients", "events", "payments"]
    
    for collection_name in collections:
        try:
            # Load JSON data
            with open(f"data/{collection_name}.json", "r", encoding="utf-8") as f:
                data = json.load(f)
            
            if data:  # Only migrate if data exists
                collection = db[collection_name]
                
                # Clear existing data (optional)
                # await collection.delete_many({})
                
                # Insert data
                if isinstance(data, list):
                    await collection.insert_many(data)
                else:
                    await collection.insert_one(data)
                
                print(f"✅ Migrated {len(data) if isinstance(data, list) else 1} documents to {collection_name}")
            else:
                print(f"⚠️  No data found in {collection_name}.json")
                
        except FileNotFoundError:
            print(f"⚠️  File data/{collection_name}.json not found")
        except Exception as e:
            print(f"❌ Error migrating {collection_name}: {e}")
    
    client.close()
    print("🎉 Migration completed!")

async def migrate_mongodb_to_json():
    """Migrate MongoDB data back to JSON files"""
    
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    
    collections = await db.list_collection_names()
    
    for collection_name in collections:
        try:
            collection = db[collection_name]
            data = await collection.find({}).to_list(length=None)
            
            # Convert ObjectId to string
            for doc in data:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
            
            # Save to JSON
            with open(f"data/{collection_name}.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Exported {len(data)} documents from {collection_name}")
            
        except Exception as e:
            print(f"❌ Error exporting {collection_name}: {e}")
    
    client.close()
    print("🎉 Export completed!")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python migration_helper.py json_to_mongo")
        print("  python migration_helper.py mongo_to_json")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "json_to_mongo":
        asyncio.run(migrate_json_to_mongodb())
    elif command == "mongo_to_json":
        asyncio.run(migrate_mongodb_to_json())
    else:
        print("Invalid command. Use 'json_to_mongo' or 'mongo_to_json'")