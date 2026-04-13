from typing import Dict, Any, List, Optional
from app.models.client import ClientModel
from app.schemas.client import ClientCreate, ClientUpdate

class ClientService:
    def __init__(self):
        self.client_model = ClientModel()
    
    async def create_client(self, client_data: ClientCreate) -> Dict[str, Any]:
        client_dict = client_data.dict()
        return await self.client_model.create_client(client_dict)
    
    async def get_all_clients(self) -> List[Dict[str, Any]]:
        return await self.client_model.get_all_clients()
    
    async def get_client(self, client_id: str) -> Optional[Dict[str, Any]]:
        return await self.client_model.get_client_by_id(client_id)
    
    async def update_client(self, client_id: str, update_data: ClientUpdate) -> bool:
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        return await self.client_model.update_client(client_id, update_dict)
    
    async def delete_client(self, client_id: str) -> bool:
        return await self.client_model.delete_client(client_id)