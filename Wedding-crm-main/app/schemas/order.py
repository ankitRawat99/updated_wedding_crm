from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class OrderCreate(BaseModel):
    client_id: str
    order_type: str
    total_amount: float
    advance_amount: Optional[float] = None
    services: List[str]
    event_date: str
    venue: Optional[str] = None
    notes: Optional[str] = None

class OrderUpdate(BaseModel):
    order_type: Optional[str] = None
    total_amount: Optional[float] = None
    advance_amount: Optional[float] = None
    services: Optional[List[str]] = None
    event_date: Optional[str] = None
    venue: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None