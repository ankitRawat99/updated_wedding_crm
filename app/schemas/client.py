from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClientCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    wedding_date: str
    venue: Optional[str] = None
    budget: Optional[float] = None
    notes: Optional[str] = None

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    wedding_date: Optional[str] = None
    venue: Optional[str] = None
    budget: Optional[float] = None
    notes: Optional[str] = None