from typing import Dict, Any, List, Optional
from app.models.order import OrderModel
from app.schemas.order import OrderCreate, OrderUpdate

class OrderService:
    def __init__(self):
        self.order_model = OrderModel()
    
    async def create_order(self, order_data: OrderCreate) -> Dict[str, Any]:
        order_dict = order_data.dict()
        order_dict["status"] = "pending"
        return await self.order_model.create_order(order_dict)
    
    async def get_all_orders(self) -> List[Dict[str, Any]]:
        return await self.order_model.get_all_orders()
    
    async def get_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        return await self.order_model.get_order_by_id(order_id)
    
    async def get_orders_by_client(self, client_id: str) -> List[Dict[str, Any]]:
        return await self.order_model.get_orders_by_client(client_id)
    
    async def update_order(self, order_id: str, update_data: OrderUpdate) -> bool:
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        return await self.order_model.update_order(order_id, update_dict)
    
    async def delete_order(self, order_id: str) -> bool:
        return await self.order_model.delete_order(order_id)
    
    async def get_orders_stats(self) -> Dict[str, Any]:
        """Get order statistics for dashboard"""
        booking_orders = self.order_model.db._load_collection("booking_orders")
        
        total_orders = len(booking_orders)
        active_orders = len([o for o in booking_orders if o.get("status") == "active"])
        completed_orders = len([o for o in booking_orders if o.get("status") == "completed"])
        
        total_revenue = 0
        pending_payments = 0
        
        for order in booking_orders:
            deal_amount = order.get("deal_amount", "0")
            if isinstance(deal_amount, str):
                deal_amount = int(deal_amount.replace(",", ""))
            total_revenue += deal_amount
            
            delivery_pending = order.get("delivery_pending", "0")
            if isinstance(delivery_pending, str):
                delivery_pending = int(delivery_pending.replace(",", ""))
            pending_payments += delivery_pending
        
        return {
            "total_orders": total_orders,
            "active_orders": active_orders,
            "completed_orders": completed_orders,
            "total_revenue": total_revenue,
            "pending_payments": pending_payments,
            "completion_rate": round((completed_orders / total_orders * 100) if total_orders > 0 else 0, 1)
        }
    
    async def get_booking_orders(self) -> List[Dict[str, Any]]:
        """Get orders from booking_orders.json"""
        return self.order_model.db._load_collection("booking_orders")
    
    async def create_booking_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new booking order with business logic"""
        from datetime import datetime
        
        order_id = f"ORD-{len(self.order_model.db._load_collection('booking_orders')) + 1:03d}"
        total_amount = order_data.get("total_cost", 0)
        advance_amount = round(total_amount * 0.4)
        
        booking_order = {
            "id": order_id,
            "couple_name": f"{order_data.get('client_name', 'Unknown')}",
            "stage": "pre-lock",
            "status": "active",
            "deal_amount": f"{total_amount:,}",
            "advance_paid": "0",
            "event_paid": "0", 
            "delivery_pending": f"{total_amount:,}",
            "payment_status": "pending",
            "events": [],
            "team_members": [],
            "deliverables": [],
            "prelock_status": [
                {"name": "Order Form", "status": "done"},
                {"name": "Cost Lock", "status": "pending"},
                {"name": "Team", "status": "pending"}
            ],
            "waitlist_status": [
                {"name": "Advance Payment Waitlist"},
                {"name": "Lock Payment Required"}
            ],
            "next_payment_due": f"Advance Payment Due: ₹{advance_amount:,}",
            "created_at": datetime.now().isoformat()
        }
        
        booking_orders = self.order_model.db._load_collection("booking_orders")
        booking_orders.append(booking_order)
        self.order_model.db._save_collection("booking_orders", booking_orders)
        
        return booking_order
    
    async def process_payment(self, order_id: str, payment_type: str, amount: int) -> bool:
        """Process payment with business logic"""
        booking_orders = self.order_model.db._load_collection("booking_orders")
        
        for order in booking_orders:
            if order.get("id") == order_id:
                if payment_type == "advance":
                    order["advance_paid"] = f"{amount:,}"
                    order["stage"] = "pre-event"
                elif payment_type == "event":
                    order["event_paid"] = f"{amount:,}"
                    order["stage"] = "post-event"
                elif payment_type == "delivery":
                    total = int(order["deal_amount"].replace(",", ""))
                    advance = int(order["advance_paid"].replace(",", "")) if order["advance_paid"] != "0" else 0
                    event = int(order["event_paid"].replace(",", "")) if order["event_paid"] != "0" else 0
                    remaining = total - advance - event - amount
                    
                    order["delivery_pending"] = f"{remaining:,}" if remaining > 0 else "0"
                    
                    if remaining <= 0:
                        order["payment_status"] = "completed"
                        order["status"] = "completed"
                    else:
                        order["payment_status"] = "partial"
                
                self._update_next_payment_due(order)
                self.order_model.db._save_collection("booking_orders", booking_orders)
                return True
        
        return False
    
    async def get_order_forms(self) -> List[Dict[str, Any]]:
        """Get all order forms from JSON"""
        return self.order_model.db._load_collection("order_forms")
    
    async def delete_order_form(self, order_id: str) -> bool:
        """Delete order form by ID"""
        try:
            order_forms = self.order_model.db._load_collection("order_forms")
            order_forms = [o for o in order_forms if o.get("_id") != order_id]
            self.order_model.db._save_collection("order_forms", order_forms)
            return True
        except Exception as e:
            print(f"Error deleting order form: {e}")
            return False
    
    async def save_order_form(self, order_data: Dict[str, Any]) -> bool:
        """Save order form data to JSON file"""
        from datetime import datetime
        import uuid
        
        try:
            # Load existing order forms
            order_forms = self.order_model.db._load_collection("order_forms")
            
            # Check if this is an update (has _id) or new order
            if "_id" in order_data and order_data["_id"]:
                # Update existing order
                for i, form in enumerate(order_forms):
                    if form.get("_id") == order_data["_id"]:
                        order_data["updated_at"] = datetime.now().isoformat()
                        order_forms[i] = order_data
                        break
            else:
                # Create new order
                order_data["_id"] = str(uuid.uuid4())
                order_data["created_at"] = datetime.now().isoformat()
                order_data["updated_at"] = datetime.now().isoformat()
                order_forms.append(order_data)
            
            # Save back to file
            self.order_model.db._save_collection("order_forms", order_forms)
            return True
            
        except Exception as e:
            print(f"Error saving order form: {e}")
            return False
    
    async def create_order_sheet(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create complete order sheet from form data"""
        from datetime import datetime
        
        order_id = f"ORD-{len(self.order_model.db._load_collection('order_sheets')) + 1:03d}"
        
        order_sheet = {
            "id": order_id,
            "order_number": order_id,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "status": "active",
            "stage": "pre-lock",
            
            # Complete client information
            "client_info": {
                "bride_name": form_data.get("bride_name", ""),
                "groom_name": form_data.get("groom_name", ""),
                "couple_name": f"{form_data.get('bride_name', '')} & {form_data.get('groom_name', '')}",
                "contact_number": form_data.get("contact_number", ""),
                "email": form_data.get("email", ""),
                "address": form_data.get("address", ""),
                "coverage": form_data.get("coverage", ""),
                "location": form_data.get("location", "")
            },
            
            # Complete event details
            "events": form_data.get("events", []),
            "pre_wedding": form_data.get("pre_wedding", {}),
            
            # Team composition
            "team_members": form_data.get("team_members", []),
            
            # Deliverables
            "deliverables": {
                "standard": form_data.get("standard_deliverables", []),
                "pre_wedding": form_data.get("pre_wedding_deliverables", []),
                "addons": form_data.get("addon_deliverables", []),
                "custom": form_data.get("custom_deliverables", [])
            },
            
            # Payment details
            "payment_info": {
                "total_cost": form_data.get("total_cost", 0),
                "advance_percentage": form_data.get("advance_percentage", 40),
                "advance_amount": round(form_data.get("total_cost", 0) * 0.4),
                "event_percentage": form_data.get("event_percentage", 35),
                "delivery_percentage": form_data.get("delivery_percentage", 25),
                "payment_milestones": form_data.get("payment_milestones", []),
                "advance_paid": 0,
                "event_paid": 0,
                "delivery_paid": 0,
                "payment_status": "pending"
            },
            
            # Cost factors
            "cost_factors": form_data.get("cost_factors", {}),
            
            # Notes and special requirements
            "notes": {
                "client_notes": form_data.get("client_notes", ""),
                "event_notes": form_data.get("event_notes", ""),
                "deliverable_notes": form_data.get("deliverable_notes", ""),
                "payment_notes": form_data.get("payment_notes", ""),
                "special_requirements": form_data.get("special_requirements", "")
            },
            
            # Project specifications
            "project_specs": form_data.get("project_specs", {})
        }
        
        # Save to order_sheets collection
        order_sheets = self.order_model.db._load_collection("order_sheets")
        order_sheets.append(order_sheet)
        self.order_model.db._save_collection("order_sheets", order_sheets)
        
        return order_sheet
    
    async def create_booking_from_sheet(self, order_sheet_id: str) -> Dict[str, Any]:
        """Create booking card from order sheet data"""
        order_sheets = self.order_model.db._load_collection("order_sheets")
        order_sheet = next((sheet for sheet in order_sheets if sheet["id"] == order_sheet_id), None)
        
        if not order_sheet:
            return None
        
        # Create simplified booking card
        total_amount = order_sheet["payment_info"]["total_cost"]
        advance_amount = order_sheet["payment_info"]["advance_amount"]
        
        booking_card = {
            "id": order_sheet["id"],
            "order_sheet_id": order_sheet_id,
            "couple_name": order_sheet["client_info"]["couple_name"],
            "stage": order_sheet["stage"],
            "status": order_sheet["status"],
            "deal_amount": f"{total_amount:,}",
            "advance_paid": "0",
            "event_paid": "0",
            "delivery_pending": f"{total_amount:,}",
            "payment_status": "pending",
            "next_payment_due": f"Advance Payment Due: ₹{advance_amount:,}",
            "prelock_status": [
                {"name": "Order Form", "status": "done"},
                {"name": "Cost Lock", "status": "pending"},
                {"name": "Team", "status": "pending"}
            ],
            "created_at": order_sheet["created_at"]
        }
        
        # Save to booking_orders collection
        booking_orders = self.order_model.db._load_collection("booking_orders")
        # Remove existing booking for this order sheet if any
        booking_orders = [b for b in booking_orders if b.get("order_sheet_id") != order_sheet_id]
        booking_orders.append(booking_card)
        self.order_model.db._save_collection("booking_orders", booking_orders)
        
        return booking_card
    
    async def get_order_sheet(self, order_id: str) -> Optional[Dict[str, Any]]:
        """Get order sheet by ID"""
        order_sheets = self.order_model.db._load_collection("order_sheets")
        return next((sheet for sheet in order_sheets if sheet["id"] == order_id), None)
    
    async def get_booking_cards_from_sheets(self) -> List[Dict[str, Any]]:
        """Get all booking cards (derived from order sheets)"""
        return self.order_model.db._load_collection("booking_orders")
    
    def _update_next_payment_due(self, order: Dict[str, Any]):
        """Update next payment due based on current status"""
        if order["payment_status"] == "completed":
            order["next_payment_due"] = ""
        elif order["advance_paid"] == "0":
            order["next_payment_due"] = "Advance Payment Due"
        elif order["event_paid"] == "0":
            order["next_payment_due"] = "Event Payment Due"
        else:
            order["next_payment_due"] = "Final Payment Due"